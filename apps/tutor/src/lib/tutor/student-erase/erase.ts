/**
 * Student erase — remove EVERY engine-side record of one partner student.
 *
 * Called by `POST /api/portal/v1/student-erase`. Before this module the
 * route deleted only the learner model (evidence, projections, snapshots,
 * Elo student rows); the profile (name, gaps with verbatim quotes, session
 * summaries), the session documents (transcripts, email, IP), topic notes,
 * homework, mock attempts and the recorded audio all survived.
 *
 * ── Whose rows are these? ─────────────────────────────────────────────────
 * The caller is an HMAC-verified partner naming one of ITS student ids.
 * Two different partners can use the same student id, so a delete is never
 * keyed on the partner-supplied id alone:
 *
 *   • Stores keyed by the PROFILE id (learner model, topic notes, homework,
 *     mock attempts, the profile itself) are deleted by the ids returned by
 *     `ownedProfileIds` — the surrogate `_id` of the profile whose
 *     (partnerId, externalStudentId) pair is this caller's, plus the bare id
 *     only while the deployment still keys everything by bare id AND that
 *     bare-id profile is not stamped as another partner's.
 *   • Stores that record the partner themselves (profile, evidence,
 *     homework, sessions, review plans) ALSO filter on it, so a wrong id can
 *     still not reach another partner's rows.
 *   • Session documents are keyed by the bare student id (it comes from the
 *     embed token), so they are deleted ONLY where `sourcePartnerId` is the
 *     caller. Audio directories are removed for exactly those sessions.
 *
 * ── What is deliberately left alone ───────────────────────────────────────
 * Shared content (curated and generated-course lesson plans, problem banks,
 * LO-global generated practice items, Elo item/LO rows), partner metering
 * (PartnerCounter) and demo-gate records.
 *
 * ── Homework plans ────────────────────────────────────────────────────────
 * A `gen-` plan built from ONE student's own typed/uploaded problems stores
 * that text (`metadata.problems`) but, until 2026-10-08, no student id — the
 * only link is the student's session (`lessonProgress.lessonPlanId`). Such a
 * plan is deleted with the student when `classifyHomeworkPlan` says so:
 * per-student kind, created by the calling partner, and referenced by no
 * session or homework row that survives this erase. Anything it declines is
 * counted in `retained` by reason rather than dropped silently. Practice
 * items generated from a deleted plan's own LOs go with it.
 *
 * The filter builders are pure and exported so the scoping is pinned by
 * unit tests without a database (scripts/test-student-erase.ts); the
 * end-to-end behaviour is pinned against a throwaway local mongod
 * (scripts/test-student-erase-db.ts).
 */

import connectDB from '@core/db';
import { StudentProfileModel } from '@/models/StudentProfile';
import { StudentTopicNotesModel } from '@/models/StudentTopicNotes';
import { PracticeAssignmentModel } from '@/models/PracticeAssignment';
import { PracticeGenCounter } from '@/models/PracticeGenCounter';
import { MockAttempt } from '@/models/MockAttempt';
import { TutorSession } from '@/models/TutorSession';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank } from '@/models/ProblemBank';
import { deleteLearnerModelData } from '@/lib/tutor/learner-model/store';
import { identityFilter, identityResolutionEnabled, forgetEphemeralProfile } from '@/lib/tutor/student-profile/store';
import { forgetEphemeralTopicNotes } from '@/lib/tutor/topic-notes/apply-overlay';
import { HOMEWORK_PLAN_KIND } from '@/lib/tutor/lesson-plan/homework';
import { audioBaseDir, removeSessionAudioDirs, type AudioFs, type AudioRemovalSummary } from './audio-dir';

export interface EraseIdentity {
  /** HMAC-verified caller. */
  partnerId: string;
  /** The student id as the partner sent it. */
  externalStudentId: string;
}

/** Ownership stamp of the profile whose `_id` is the bare external id. */
export interface BareProfileOwner {
  partnerId?: string | null;
  externalStudentId?: string | null;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const unique = (xs: Array<string | null | undefined>): string[] =>
  Array.from(new Set(xs.filter((x): x is string => typeof x === 'string' && x.length > 0)));

/**
 * Whether this student's rows are keyed by the bare external id rather than
 * a surrogate: always for `trial:` ids (they are never resolved — see
 * `resolveProfileIdOrRaw`), and for everyone while identity resolution is
 * off.
 */
export function usesBareIdNamespace(externalStudentId: string, resolutionEnabled: boolean = identityResolutionEnabled()): boolean {
  return externalStudentId.startsWith('trial:') || !resolutionEnabled;
}

/**
 * The profile ids whose rows this caller may erase.
 *
 * `surrogateIds` are the `_id`s of profiles matching the caller's
 * (partnerId, externalStudentId) pair — always owned.
 *
 * The bare external id is added only in the bare-id namespace, and only
 * when the profile stored under it is absent, unstamped, or stamped as this
 * same pair. With resolution ON a bare-id row is at best a leftover of a
 * degraded write and cannot be attributed to one partner, so it is left in
 * place rather than guessed at — erasing another partner's student is the
 * worse of the two errors.
 */
export function ownedProfileIds(input: {
  identity: EraseIdentity;
  surrogateIds: readonly string[];
  /** `null` when no profile is stored under the bare external id. */
  bareProfile: BareProfileOwner | null;
  bareNamespace: boolean;
}): string[] {
  const { identity, surrogateIds, bareProfile, bareNamespace } = input;
  const owned = [...surrogateIds];
  if (bareNamespace) {
    const stampedPartner = bareProfile?.partnerId || null;
    const stampedStudent = bareProfile?.externalStudentId || null;
    const foreign =
      (stampedPartner !== null && stampedPartner !== identity.partnerId) ||
      (stampedStudent !== null && stampedStudent !== identity.externalStudentId);
    if (!foreign) owned.push(identity.externalStudentId);
  }
  return unique(owned);
}

/** `{ $in: [partnerId, null] }` — the caller's rows plus rows written before
 *  the partner was stamped (Mongo's `null` also matches a missing field).
 *  Never matches a row stamped with a different partner. */
const callerOrUnstamped = (partnerId: string) => ({ $in: [partnerId, null] as Array<string | null> });

/** Every Mongo filter the erase runs, built in one place. Pure. */
export function buildEraseFilters(input: {
  identity: EraseIdentity;
  ownedIds: readonly string[];
  /** Session ids referenced by the student's own profile / homework rows. */
  linkedSessionIds?: readonly string[];
}) {
  const { identity } = input;
  const { partnerId, externalStudentId } = identity;
  const ownedIds = unique([...input.ownedIds]);
  const linked = unique([...(input.linkedSessionIds ?? [])]);
  // Session documents carry the id from the embed token (the bare id); the
  // owned profile ids are included so a session stamped either way is found.
  const sessionStudentIds = unique([externalStudentId, ...ownedIds]);
  const idAlternation = (ids: readonly string[]) => ids.map(escapeRegExp).join('|');

  return {
    /** Profiles: owned id AND not another partner's. */
    profiles: { _id: { $in: ownedIds }, partnerId: callerOrUnstamped(partnerId) },
    /** Stores with no partner field — safe only because `ownedIds` is. */
    byStudentId: { studentId: { $in: ownedIds } },
    /** Stores that also record the partner (EvidenceEvent, PracticeAssignment). */
    byStudentIdAndPartner: { studentId: { $in: ownedIds }, partnerId: callerOrUnstamped(partnerId) },
    /** Per-(student, LO) daily generation caps: `<id>::<loId>`. These are
     *  written under the bare id, so it is always included. */
    practiceGenCounters: { scopeKey: { $regex: `^(?:${idAlternation(sessionStudentIds)})::` } },
    /**
     * Sessions: ALWAYS the caller's (`sourcePartnerId`), and either stamped
     * with this student's id or — for a session whose student id never
     * arrived — referenced from this student's own profile/homework.
     */
    sessions: {
      sourcePartnerId: partnerId,
      $or: [
        { studentId: { $in: sessionStudentIds } },
        ...(linked.length > 0 ? [{ sessionId: { $in: linked }, studentId: null }] : []),
      ],
    },
    /** Review plans composed for this student (compose-review-plan.ts). */
    reviewPlans: {
      'metadata.reviewPlan': true,
      'metadata.studentId': { $in: sessionStudentIds },
      'metadata.partnerId': partnerId,
    },
  };
}

/** Generated-plan ids (`gen-<uuid>`, plan-generate/route.ts). Curated,
 *  review (`rev-`) and freestyle (`freestyle-`) plans are never candidates. */
const GENERATED_PLAN_PREFIX = 'gen-';

export type HomeworkPlanDecision =
  | 'delete'
  /** A surviving session / homework row (or another student's owner stamp)
   *  still points at the plan. */
  | 'sharedWithOtherStudent'
  /** Per-student kind, but not created by the calling partner. */
  | 'otherPartner'
  /** Built from uploaded material with no owner stamp: it may be one
   *  student's worksheet or a course a teacher built — indistinguishable. */
  | 'unattributedMaterials'
  /** Not a per-student plan at all (a generated course, a cached topic
   *  plan). Left alone and not counted as retained homework. */
  | 'notPerStudent';

/**
 * Whether a plan the erased student's records point at is that student's
 * own and may go with them. Pure. The per-student kinds are exactly the two
 * the code creates from a single student's own material:
 *   • `metadata.kind === 'homework-help'` — the student's typed/uploaded
 *     problems, verbatim (lesson-plan/homework.ts);
 *   • `metadata.sourceKind === 'materials'` — a plan generated from an
 *     uploaded document, but ONLY when it carries this student's
 *     `ownerStudentId` stamp: the same path also builds shared courses.
 */
export function classifyHomeworkPlan(
  plan: { _id: string; metadata?: Record<string, unknown> | null },
  ctx: { partnerId: string; ownedIds: readonly string[]; referencedElsewhere: ReadonlySet<string> },
): HomeworkPlanDecision {
  const md = plan.metadata ?? {};
  if (typeof plan._id !== 'string' || !plan._id.startsWith(GENERATED_PLAN_PREFIX)) return 'notPerStudent';
  const owner = typeof md.ownerStudentId === 'string' && md.ownerStudentId ? md.ownerStudentId : null;
  const ownedByThisStudent = owner !== null && ctx.ownedIds.includes(owner);
  const isHomework = md.kind === HOMEWORK_PLAN_KIND;
  const isMaterials = md.sourceKind === 'materials';
  if (!isHomework && !isMaterials) return 'notPerStudent';
  if (!isHomework && owner === null) return 'unattributedMaterials';
  if (md.portalPartnerId !== ctx.partnerId) return 'otherPartner';
  if (owner !== null && !ownedByThisStudent) return 'sharedWithOtherStudent';
  if (ctx.referencedElsewhere.has(plan._id)) return 'sharedWithOtherStudent';
  return 'delete';
}

export type HomeworkPlanRetainReason = Exclude<HomeworkPlanDecision, 'delete' | 'notPerStudent'>;

/** Second-stage session delete: by the exact ids collected, still partner-scoped. */
export function sessionDeleteFilter(partnerId: string, sessionIds: readonly string[]) {
  return { sessionId: { $in: [...sessionIds] }, sourcePartnerId: partnerId };
}

export interface EraseResult {
  /** Per-collection deleted-row counts (the contract's `deleted` record). */
  deleted: Record<string, number>;
  audio: Pick<AudioRemovalSummary, 'removed' | 'missing' | 'skipped' | 'failed'>;
  /** Per-student homework plans this student's records point at that were
   *  NOT deleted — the total, and the count per reason. */
  retained: { homeworkPlans: number; homeworkPlanReasons: Record<HomeworkPlanRetainReason, number> };
  /** False when an audio directory could not be removed; its session
   *  document is kept so a retry can finish the job. */
  complete: boolean;
}

interface ProfileLinks {
  _id: string;
  recentSessions?: Array<{ sessionId?: string; lessonPlanId?: string }>;
  gaps?: Array<{ sessionIds?: string[] }>;
  nextSessionIntent?: { sessionId?: string };
}

export interface EraseOptions {
  /** Defaults to TUTOR_AUDIO_DIR. Tests pass a temp directory. */
  audioDir?: string;
  audioFs?: AudioFs;
  /** Defaults to the PORTAL_IDENTITY_RESOLUTION flag. */
  resolutionEnabled?: boolean;
}

const count = (res: { deletedCount?: number }): number => res.deletedCount ?? 0;

/**
 * Erase one partner student. Idempotent: a second call finds nothing and
 * returns zeros. Throws on a database failure (the caller must know the
 * erase did not complete); audio failures are reported, not thrown.
 */
export async function eraseStudentData(identity: EraseIdentity, opts: EraseOptions = {}): Promise<EraseResult> {
  const { partnerId, externalStudentId } = identity;
  if (!partnerId) throw new Error('eraseStudentData: partnerId is required');
  if (!externalStudentId) throw new Error('eraseStudentData: externalStudentId is required');
  await connectDB();

  // 1. Which profile ids belong to this (partner, student) pair. A plain
  //    read — unlike resolveProfileId this must never mint a profile.
  const [pairProfiles, bareProfile] = await Promise.all([
    StudentProfileModel.find(identityFilter(identity)).select('_id').lean<Array<{ _id: string }>>().exec(),
    StudentProfileModel.findById(externalStudentId).select('partnerId externalStudentId').lean<BareProfileOwner>().exec(),
  ]);
  const ownedIds = ownedProfileIds({
    identity,
    surrogateIds: pairProfiles.map((p) => p._id),
    bareProfile: bareProfile ?? null,
    bareNamespace: usesBareIdNamespace(externalStudentId, opts.resolutionEnabled ?? identityResolutionEnabled()),
  });
  const base = buildEraseFilters({ identity, ownedIds });

  // 2. Session ids the student's own records point at — read BEFORE those
  //    records are deleted, because afterwards nothing links them.
  const [profiles, assignments] = ownedIds.length > 0
    ? await Promise.all([
        StudentProfileModel.find(base.profiles)
          .select('recentSessions.sessionId recentSessions.lessonPlanId gaps.sessionIds nextSessionIntent.sessionId')
          .lean<ProfileLinks[]>()
          .exec(),
        PracticeAssignmentModel.find(base.byStudentIdAndPartner)
          .select('sessionId lessonPlanId')
          .lean<Array<{ sessionId?: string; lessonPlanId?: string }>>()
          .exec(),
      ])
    : [[], []];
  const linkedSessionIds = unique([
    ...profiles.flatMap((p) => (p.recentSessions ?? []).map((s) => s.sessionId)),
    ...profiles.flatMap((p) => (p.gaps ?? []).flatMap((g) => g.sessionIds ?? [])),
    ...profiles.map((p) => p.nextSessionIntent?.sessionId),
    ...assignments.map((a) => a.sessionId),
  ]);
  const filters = buildEraseFilters({ identity, ownedIds, linkedSessionIds });

  // 3. The sessions themselves — ids first, the audio is named by them.
  const sessions = await TutorSession.find(filters.sessions)
    .select('sessionId lessonPlanId lessonProgress.lessonPlanId')
    .lean<Array<{ sessionId: string; lessonPlanId?: string; lessonProgress?: { lessonPlanId?: string } }>>()
    .exec();
  const sessionIds = unique(sessions.map((s) => s.sessionId));

  // 4. Audio before the session documents: once a document is gone, its id
  //    — the only thing naming the directory — is gone with it.
  const audio = await removeSessionAudioDirs(opts.audioDir ?? audioBaseDir(), sessionIds, opts.audioFs);
  if (audio.skippedSessionIds.length > 0) {
    console.warn(`[student-erase] ${audio.skippedSessionIds.length} session(s) have an id that is not a safe directory name; any audio for them was left on disk: ${audio.skippedSessionIds.map((id) => JSON.stringify(id)).join(', ')}`);
  }
  const failedAudio = new Set(audio.failedSessionIds);
  const deletableSessionIds = sessionIds.filter((id) => !failedAudio.has(id));

  // 4b. Homework plans. Candidates: every generated plan this student's
  //     sessions, profile or homework rows name, plus any plan stamped with
  //     an owned profile id. Read BEFORE the sessions go — they are the link.
  const planIdOf = (s: { lessonPlanId?: string; lessonProgress?: { lessonPlanId?: string } }) =>
    [s.lessonProgress?.lessonPlanId, s.lessonPlanId];
  const linkedPlanIds = unique([
    ...sessions.flatMap(planIdOf),
    ...profiles.flatMap((p) => (p.recentSessions ?? []).map((s) => s.lessonPlanId)),
    ...assignments.map((a) => a.lessonPlanId),
  ]).filter((id) => id.startsWith(GENERATED_PLAN_PREFIX));
  type PlanLite = { _id: string; metadata?: Record<string, unknown> | null };
  const candidatePlans = linkedPlanIds.length > 0 || ownedIds.length > 0
    ? await LessonPlanModel.find({
        $or: [
          ...(linkedPlanIds.length > 0 ? [{ _id: { $in: linkedPlanIds } }] : []),
          ...(ownedIds.length > 0 ? [{ 'metadata.ownerStudentId': { $in: ownedIds }, 'metadata.portalPartnerId': partnerId }] : []),
        ],
      })
        .select('_id metadata.kind metadata.sourceKind metadata.portalPartnerId metadata.ownerStudentId')
        .lean<PlanLite[]>()
        .exec()
    : [];
  const candidatePlanIds = candidatePlans.map((p) => p._id);
  // Who else points at them: any session that will SURVIVE this erase
  // (another student's — or this student's own, when its audio could not be
  // removed and the document is being kept for the retry), and any homework
  // row that is not this student's.
  const [otherSessions, otherAssignments] = candidatePlanIds.length > 0
    ? await Promise.all([
        TutorSession.find({
          sessionId: { $nin: deletableSessionIds },
          $or: [{ 'lessonProgress.lessonPlanId': { $in: candidatePlanIds } }, { lessonPlanId: { $in: candidatePlanIds } }],
        })
          .select('lessonPlanId lessonProgress.lessonPlanId')
          .lean<Array<{ lessonPlanId?: string; lessonProgress?: { lessonPlanId?: string } }>>()
          .exec(),
        PracticeAssignmentModel.find({
          lessonPlanId: { $in: candidatePlanIds },
          ...(ownedIds.length > 0 ? { $nor: [filters.byStudentIdAndPartner] } : {}),
        })
          .select('lessonPlanId')
          .lean<Array<{ lessonPlanId?: string }>>()
          .exec(),
      ])
    : [[], []];
  const referencedElsewhere = new Set(unique([...otherSessions.flatMap(planIdOf), ...otherAssignments.map((a) => a.lessonPlanId)]));
  const homeworkPlanReasons: Record<HomeworkPlanRetainReason, number> = { sharedWithOtherStudent: 0, otherPartner: 0, unattributedMaterials: 0 };
  const deletablePlanIds: string[] = [];
  for (const plan of candidatePlans) {
    const decision = classifyHomeworkPlan(plan, { partnerId, ownedIds, referencedElsewhere });
    if (decision === 'delete') deletablePlanIds.push(plan._id);
    else if (decision !== 'notPerStudent') homeworkPlanReasons[decision] += 1;
  }

  // 5. The rows. Every id-keyed delete is skipped when there is no owned id
  //    (an unknown student): nothing to do, and no filter built from nothing.
  const none = { deletedCount: 0 };
  const hasOwned = ownedIds.length > 0;
  const hasPlans = deletablePlanIds.length > 0;
  const [learnerModel, studentProfiles, tutorSessions, studentTopicNotes, practiceAssignments, mockAttempts, practiceGenCounters, reviewPlans, homeworkPlans, homeworkPracticeItems] =
    await Promise.all([
      deleteLearnerModelData(ownedIds, { partnerId }),
      hasOwned ? StudentProfileModel.deleteMany(filters.profiles) : none,
      deletableSessionIds.length > 0 ? TutorSession.deleteMany(sessionDeleteFilter(partnerId, deletableSessionIds)) : none,
      hasOwned ? StudentTopicNotesModel.deleteMany(filters.byStudentId) : none,
      hasOwned ? PracticeAssignmentModel.deleteMany(filters.byStudentIdAndPartner) : none,
      hasOwned ? MockAttempt.deleteMany(filters.byStudentId) : none,
      PracticeGenCounter.deleteMany(filters.practiceGenCounters),
      LessonPlanModel.deleteMany(filters.reviewPlans),
      // Partner filter repeated at the point of deletion, not only in the
      // classifier that produced the ids.
      hasPlans ? LessonPlanModel.deleteMany({ _id: { $in: deletablePlanIds }, 'metadata.portalPartnerId': partnerId }) : none,
      // Practice items generated from a deleted plan's OWN LOs
      // (`<planId>.homework-lo-N`) are variants of the student's problems.
      // Only runtime-generated rows, only under those plan-scoped LO ids.
      hasPlans
        ? ProblemBank.deleteMany({
            id: { $regex: '^practice-gen\\.' },
            loId: { $regex: `^(?:${deletablePlanIds.map(escapeRegExp).join('|')})\\.` },
          })
        : none,
    ]);

  // In-process fallbacks (used only while Mongo was unreachable).
  for (const id of ownedIds) {
    forgetEphemeralProfile(id);
    forgetEphemeralTopicNotes(id);
  }

  return {
    deleted: {
      ...learnerModel,
      studentProfiles: count(studentProfiles),
      tutorSessions: count(tutorSessions),
      studentTopicNotes: count(studentTopicNotes),
      practiceAssignments: count(practiceAssignments),
      mockAttempts: count(mockAttempts),
      practiceGenCounters: count(practiceGenCounters),
      reviewPlans: count(reviewPlans),
      homeworkPlans: count(homeworkPlans),
      homeworkPracticeItems: count(homeworkPracticeItems),
      audioDirs: audio.removed,
    },
    audio: { removed: audio.removed, missing: audio.missing, skipped: audio.skipped, failed: audio.failed },
    retained: {
      homeworkPlans: Object.values(homeworkPlanReasons).reduce((a, b) => a + b, 0),
      homeworkPlanReasons,
    },
    complete: audio.failed === 0,
  };
}
