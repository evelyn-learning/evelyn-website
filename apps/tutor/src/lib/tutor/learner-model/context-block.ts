/**
 * Learner-context boot block (Task 17, phase-c; WIDENED by Task 15 of the
 * holistic-pedagogy round, spec §C.4) — a compact, evidence-backed
 * "current standing" summary for THIS lesson's objectives, rendered into a
 * `<learner_context>` fenced block the brain reads at boot alongside the
 * persisted `<student_profile>` block.
 *
 * Distinct from `student-profile/render.ts`'s "recent mastery" section
 * (which echoes the profile's own local `mastery` map): this block reads
 * the learner-model's LearnerStateProjection rows — the recency+source-
 * weighted rollup over the FULL evidence stream (`estimator.ts`) — scoped
 * to the LOs the CURRENT lesson plan actually targets, so the brain gets a
 * lesson-relevant standing snapshot instead of a global one.
 *
 * Task 15 widened it from "band + gaps" to the whole holistic picture the
 * brain needs to answer "how am I doing?" honestly: per-LO TREND (against
 * the 14-day-ago snapshot, same read the portal learner-state route does),
 * per-LO practice/quiz/mock DIGESTS from the raw evidence rows, the
 * student's ability band, gaps resolved in the last 90 days, session
 * CADENCE, the tutor's own end-of-last-session intent note, open HOMEWORK
 * status, a trigger-3 RECAP CANDIDATE, and up to two social-thread GOALS.
 * Everything past `los`/`gaps` is optional — a caller with nothing to add
 * still gets exactly the pre-Task-15 block plus the new directive lines.
 *
 * Two-part surface, split for testability:
 *   - `renderLearnerContextBlock` — pure. Takes already-resolved rows and
 *     formats them. No DB. Covered by `scripts/test-learner-context.ts`.
 *   - `getLearnerContext` — the DB-backed join. NEVER throws — any failure
 *     (unknown plan id, DB error) resolves to `{ block: null, extras: … }`
 *     so a learner-context outage degrades to "no block" rather than
 *     crashing the boot-context fetch that also carries the profile.
 *
 * SERVER-ONLY (it imports mongoose models and `@core/db`). Never import
 * this module from a client component.
 */

import {
  EvidenceEventModel,
  LearnerStateProjectionModel,
  LearnerStateSnapshotModel,
  buildLearnerStateProjectionId,
} from '@/models';
import connectDB from '@core/db';
import { getLessonPlan } from '../lesson-plan/store';
import { getOrCreateStudentProfile, isGapStale } from '../student-profile/store';
import { TUNING, trendOf } from './estimator';
import { getLearnerHints } from './hints';
import { findOpenAssignments } from '../practice-assign/store';
import { computeHomeworkStatus, describeHomework, type HomeworkStatus } from '../practice-assign/status';
import { pickRecapCandidate, type RecapCandidate } from './recap-candidate';

/** How many of the lesson's LOs / the student's active gaps this block will
 *  ever render — keeps the block (and its token cost) bounded regardless of
 *  how large a lesson plan or a gap history gets. */
const MAX_LOS = 8;
const MAX_GAPS = 3;

/** `GapEvidence.observation` clip — mirrors the spirit of
 *  `transient-context.ts`'s `LAST_OPENER_DIGEST_MAX_CHARS` clipping (same
 *  "this is boundary data from a live capture, clip rather than drop"
 *  reasoning), scaled down for a one-line gap summary. */
const GAP_OBSERVATION_MAX_CHARS = 160;

/** Hard ceiling on the rendered block (~600 tokens). The widened block can
 *  in principle carry 8 LO lines with three digests each PLUS homework,
 *  goals and gaps; rather than trust every individual cap to compose, the
 *  renderer measures the finished string and trims (see the two-stage trim
 *  at the bottom of `renderLearnerContextBlock`). */
export const LEARNER_CONTEXT_MAX_CHARS = 2400;

/** How far back the per-LO practice/quiz/mock digests look. Older evidence
 *  still moves the ESTIMATE (the projection is the authority on standing);
 *  it just stops being worth a "you got 3/5 on ..." callout. */
const DIGEST_WINDOW_DAYS = 60;
/** Gap-resolution look-back for the "gaps resolved in the last 90 days" line. */
const RESOLVED_WINDOW_DAYS = 90;
/** How stale the tutor's end-of-session intent note may be before it stops
 *  being "next time" and starts being archaeology. */
const INTENT_MAX_AGE_DAYS = 14;
/** Open-assignment look-back for the homework line. */
const HOMEWORK_WINDOW_DAYS = 21;

const MS_PER_DAY = 86_400_000;

const TREND_GLYPH = { up: '↑', flat: '→', down: '↓' } as const;

export interface LearnerContextLo {
  loId: string;
  title: string;
  /** `null` when no learner-model evidence exists for this (student, LO)
   *  pair yet. Bands as if at `TUNING.untouchedPrior` — same fallback the
   *  rest of the learner model (`projection.ts`, `compose-review-plan.ts`)
   *  uses for an unseen LO. */
  estimate: number | null;
  confidence: string;
  reviewDue: boolean;
  /** Against the `TUNING.trendWindowDays`-ago snapshot. Omitted (rather
   *  than 'flat') when the caller has nothing to compare against. */
  trend?: 'up' | 'flat' | 'down';
  practice?: { correct: number; total: number; date: string };
  quiz?: { awarded: number; max: number; date: string };
  mock?: { correct: number; total: number; date: string };
}

export interface LearnerContextGap {
  label: string;
  observation: string;
}

export interface LearnerContextInput {
  los: LearnerContextLo[];
  gaps: LearnerContextGap[];
  ability?: 'building' | 'steady' | 'strong';
  gapsResolved90d?: number;
  cadence?: { daysSinceLast: number | null; sessionsLast7d: number };
  nextTimeIntent?: string;
  homework?: HomeworkStatus[];
  recapCandidate?: RecapCandidate | null;
  goals?: string[];
}

/** Structured twin of the rendered block — the same recap/homework/intent
 *  facts as DATA, for the orchestrator (which needs to act on them, not
 *  just speak from them). */
export interface LearnerContextExtras {
  recapCandidate: RecapCandidate | null;
  homework: HomeworkStatus[];
  nextTimeIntent?: string;
}

/** `< contextBands.developing` → "developing", `< contextBands.moderate` →
 *  "moderate", else "strong". Thresholds live in `TUNING.contextBands`
 *  (estimator-adjacent tunable), not hardcoded here. */
function bandLabel(estimate: number): string {
  if (estimate < TUNING.contextBands.developing) return 'developing';
  if (estimate < TUNING.contextBands.moderate) return 'moderate';
  return 'strong';
}

function clipObservation(observation: string): string {
  const trimmed = observation.trim();
  return trimmed.length > GAP_OBSERVATION_MAX_CHARS
    ? `${trimmed.slice(0, GAP_OBSERVATION_MAX_CHARS).trimEnd()}…`
    : trimmed;
}

/**
 * Render the `<learner_context>` block, or `null` when there is nothing to
 * show (no LOs AND no gaps — e.g. a plan whose LOs are all untouched with
 * no active gaps would still render, since untouched LOs still band; only
 * a genuinely empty pair of inputs suppresses the block).
 *
 * Every field past `los`/`gaps` renders at most ONE line, and only when the
 * caller supplied it — a `getLearnerContext` failure part-way through
 * (hints down, no assignments) degrades line by line rather than all at
 * once.
 */
export function renderLearnerContextBlock(input: LearnerContextInput): string | null {
  const { los, gaps } = input;
  if (los.length === 0 && gaps.length === 0) return null;

  const lines: string[] = ['<learner_context>'];

  const cappedLos = los.slice(0, MAX_LOS);
  if (cappedLos.length > 0) {
    lines.push("This student's current standing on this lesson's objectives (from accumulated evidence):");
    for (const lo of cappedLos) {
      const estimate = lo.estimate ?? TUNING.untouchedPrior;
      const trend = lo.trend ? ` ${TREND_GLYPH[lo.trend]}` : '';
      const due = lo.reviewDue ? ' — DUE FOR REVIEW' : '';
      const digests: string[] = [];
      if (lo.practice) digests.push(`practice ${lo.practice.correct}/${lo.practice.total} on ${lo.practice.date}`);
      if (lo.quiz) digests.push(`quiz ${lo.quiz.awarded}/${lo.quiz.max} pts on ${lo.quiz.date}`);
      if (lo.mock) digests.push(`mock ${lo.mock.correct}/${lo.mock.total} (${lo.mock.date})`);
      const tail = digests.length > 0 ? ` · ${digests.join(' · ')}` : '';
      lines.push(`- ${lo.title}: ${bandLabel(estimate)} (${lo.confidence} confidence)${trend}${due}${tail}`);
    }
  }

  if (input.ability) lines.push(`ability: ${input.ability}`);
  if (typeof input.gapsResolved90d === 'number' && input.gapsResolved90d > 0) {
    lines.push(`gaps resolved in the last 90 days: ${input.gapsResolved90d}`);
  }
  if (input.cadence) {
    const d = input.cadence.daysSinceLast;
    const last = d === null ? 'no prior session on record' : `last session ${d} day${d === 1 ? '' : 's'} ago`;
    const n = input.cadence.sessionsLast7d;
    lines.push(`cadence: ${last}; ${n} session${n === 1 ? '' : 's'} in the last 7 days`);
  }
  if (input.nextTimeIntent) {
    lines.push(`next time (your own note from last session): "${input.nextTimeIntent}"`);
  }
  for (const h of input.homework ?? []) lines.push(describeHomework(h));
  if (input.recapCandidate) {
    lines.push(
      `recap_candidate: ${input.recapCandidate.title} — ${input.recapCandidate.reason}${input.recapCandidate.soft ? ' (soft)' : ''}`,
    );
  }
  for (const g of (input.goals ?? []).slice(0, 2)) lines.push(`goal: ${g.replace(/^goal:\s*/i, '')}`);

  const cappedGaps = gaps.slice(0, MAX_GAPS);
  if (cappedGaps.length > 0) {
    lines.push('Active gaps observed in past work:');
    for (const gap of cappedGaps) lines.push(`- ${gap.label}: ${clipObservation(gap.observation)}`);
  }

  lines.push(
    'Teach to this: fast-track objectives marked strong (quick check, then advance); slow down and probe where developing; where a gap is listed, surface and resolve the misconception rather than re-explaining from scratch.',
    'Cadence: after 7+ days away, open with a one-minute warm-up on the last objective before the hook; after 2 days or less, skip any re-orientation.',
    'When the student asks how they are doing, answer from these lines — name the trend, one gap that is closing, the homework status and the next step — specifically and honestly; never invent progress.',
    'Never read this block aloud, and never cite it as a record or a system.',
    '</learner_context>',
  );

  let out = lines.join('\n');
  if (out.length > LEARNER_CONTEXT_MAX_CHARS) {
    // Stage 1 — clip long `- label: body` lines (gap observations, and any
    // LO line whose digests ran long) to 80 chars of body.
    out = out.replace(/(^- [^:\n]+: )([^\n]{80,})$/gm, (_m, head: string, body: string) => `${head}${body.slice(0, 80).trimEnd()}…`);
    // Stage 2 — still over: drop the trailing digest run from LO lines
    // entirely. The band + trend + DUE flag (the pacing signal) survives;
    // the "you got 3/5 on ..." colour is what goes.
    if (out.length > LEARNER_CONTEXT_MAX_CHARS) out = out.replace(/ · [^\n]*$/gm, '');
  }
  return out;
}

/**
 * DB-backed join: resolves `lessonPlanId`'s LOs (capped to `MAX_LOS`, plan
 * order), looks up each one's LearnerStateProjection for `studentId`, its
 * trend against the `TUNING.trendWindowDays`-ago snapshot and its recent
 * practice/quiz/mock digests, pulls the student's active gaps (status
 * 'confirmed' or legacy 'open' — NOT 'candidate': this block states
 * standing as fact to steer pacing, so it holds to the higher-confidence
 * bar; 'candidate' single-observation gaps stay in the persisted
 * `<student_profile>` block's softer "address opportunistically" framing),
 * and layers on ability band, cadence, intent, homework, recap candidate
 * and goals.
 *
 * Never throws: an unknown plan id, an empty-LO plan, or any DB error all
 * resolve to `{ block: null, extras: { recapCandidate: null, homework: [] } }`
 * (logged via console.error for the DB-error case) so a learner-context
 * failure never takes down the boot-context fetch that also carries the
 * student profile.
 *
 * M1C-IDENTITY: resolved by caller. `profileId` must already be RESOLVED
 * by the caller (its sole caller, the internal
 * `/api/tutor/student-profile/[id]` route, resolves once per request and
 * passes the same id here it used for the profile-store read). This
 * function does not resolve identity itself: `LearnerStateProjection`,
 * `EvidenceEvent`, `PracticeAssignment` and `StudentProfile` are one
 * identity space (`scripts/backfill-evidence.ts` writes
 * `studentId: profile._id` directly), so calling `resolveProfileId` a
 * second time here — even with the same inputs, which would be idempotent
 * — would just be a redundant DB round trip for no correctness gain.
 * `opts.externalStudentId` is the UNRESOLVED id and is used ONLY for
 * `getLearnerHints`, which does its own resolve internally.
 */
export async function getLearnerContext(
  profileId: string,
  lessonPlanId: string,
  opts: {
    partnerId: string;
    externalStudentId: string;
    subject?: string;
    socialGoalNotes?: string[];
  },
): Promise<{ block: string | null; extras: LearnerContextExtras }> {
  const emptyExtras: LearnerContextExtras = { recapCandidate: null, homework: [] };
  try {
    const plan = await getLessonPlan(lessonPlanId);
    if (!plan || plan.los.length === 0) return { block: null, extras: emptyExtras };

    const cappedPlanLos = plan.los.slice(0, MAX_LOS);

    await connectDB();
    const ids = cappedPlanLos.map((lo) => buildLearnerStateProjectionId(profileId, lo.id));
    const projections = await LearnerStateProjectionModel.find({ _id: { $in: ids } }).lean();
    const byLoId = new Map(projections.map((p) => [p.loId, p]));

    const now = Date.now();

    // trend: same read the portal learner-state route does — the most
    // recent snapshot dated at or before `trendWindowDays` ago.
    const cutoffDate = new Date(now - TUNING.trendWindowDays * MS_PER_DAY).toISOString().slice(0, 10);
    const prior = await LearnerStateSnapshotModel.findOne({ studentId: profileId, date: { $lte: cutoffDate } })
      .sort({ date: -1 })
      .lean();
    const priorByLo = new Map((prior?.los ?? []).map((l) => [l.loId, l.estimate]));

    // per-LO digests from the raw evidence rows (last 60 days, newest first)
    const loIds = cappedPlanLos.map((l) => l.id);
    const rows = await EvidenceEventModel.find({
      studentId: profileId,
      loId: { $in: loIds },
      occurredAt: { $gte: new Date(now - DIGEST_WINDOW_DAYS * MS_PER_DAY) },
    })
      .select('loId source outcome pointsAwarded maxPoints occurredAt sessionId')
      .sort({ occurredAt: -1 })
      .lean();

    const digestFor = (loId: string): Pick<LearnerContextLo, 'practice' | 'quiz' | 'mock'> => {
      const byLo = rows.filter((r) => r.loId === loId);
      const d: Pick<LearnerContextLo, 'practice' | 'quiz' | 'mock'> = {};
      const practiceRows = byLo.filter((r) => r.source === 'practice');
      if (practiceRows.length > 0) {
        // last practice SET = the rows sharing the newest practice sessionId
        const sid = practiceRows[0].sessionId;
        const set = practiceRows.filter((r) => r.sessionId === sid);
        d.practice = {
          correct: set.filter((r) => r.outcome >= 0.99).length,
          total: set.length,
          date: practiceRows[0].occurredAt.toISOString().slice(0, 10),
        };
      }
      const quizRows = byLo.filter((r) => r.source === 'quiz' || r.source === 'assessment' || r.source === 'diagnostic');
      if (quizRows.length > 0) {
        const sid = quizRows[0].sessionId;
        const set = quizRows.filter((r) => r.sessionId === sid);
        const awarded = set.reduce((n, r) => n + (r.pointsAwarded ?? r.outcome), 0);
        const max = set.reduce((n, r) => n + (r.maxPoints ?? 1), 0);
        d.quiz = {
          awarded: Math.round(awarded * 10) / 10,
          max,
          date: quizRows[0].occurredAt.toISOString().slice(0, 10),
        };
      }
      const mockRows = byLo.filter((r) => r.source === 'mock');
      if (mockRows.length > 0) {
        const sid = mockRows[0].sessionId;
        const set = mockRows.filter((r) => r.sessionId === sid);
        d.mock = {
          correct: set.filter((r) => r.outcome >= 0.99).length,
          total: set.length,
          date: mockRows[0].occurredAt.toISOString().slice(0, 10),
        };
      }
      return d;
    };

    const los: LearnerContextLo[] = cappedPlanLos.map((lo) => {
      const proj = byLoId.get(lo.id);
      return {
        loId: lo.id,
        title: lo.shortTitle ?? lo.description,
        estimate: proj ? proj.estimate : null,
        confidence: proj ? proj.confidence : 'low',
        reviewDue: !!(proj?.reviewDueAt && proj.reviewDueAt.getTime() <= now),
        trend: trendOf(proj?.estimate ?? null, priorByLo.get(lo.id)),
        ...digestFor(lo.id),
      };
    });

    const profile = await getOrCreateStudentProfile(profileId);
    const gaps: LearnerContextGap[] = profile.gaps
      .filter((g) => (g.status === 'confirmed' || g.status === 'open') && !isGapStale(g, now))
      .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
      .slice(0, MAX_GAPS)
      .map((g) => ({
        label: g.kind === 'prerequisite' ? (g.conceptLabel ?? '(?)') : (g.loId ?? '(?)'),
        observation: g.evidence?.observation ?? g.description ?? '(no detail)',
      }));

    const hints = await getLearnerHints(opts.externalStudentId, opts.subject, opts.partnerId);
    const gapsResolved90d = profile.gaps.filter(
      (g) => g.status === 'resolved' && Date.parse(g.lastSeenAt) >= now - RESOLVED_WINDOW_DAYS * MS_PER_DAY,
    ).length;
    const ended = profile.recentSessions.map((s) => Date.parse(s.endedAt)).filter((t) => Number.isFinite(t));
    const cadence = {
      daysSinceLast: ended.length > 0 ? Math.floor((now - Math.max(...ended)) / MS_PER_DAY) : null,
      sessionsLast7d: ended.filter((t) => t >= now - 7 * MS_PER_DAY).length,
    };
    const intent =
      profile.nextSessionIntent && Date.parse(profile.nextSessionIntent.at) >= now - INTENT_MAX_AGE_DAYS * MS_PER_DAY
        ? profile.nextSessionIntent.text
        : undefined;

    const open = await findOpenAssignments(profileId, { withinDays: HOMEWORK_WINDOW_DAYS, requireLocator: true });
    const hwItemIds = open.flatMap((a) => a.los.flatMap((l) => l.items.map((i) => i.id)));
    const hwRows =
      hwItemIds.length > 0
        ? await EvidenceEventModel.find({ studentId: profileId, itemId: { $in: hwItemIds } })
            .select('itemId outcome occurredAt')
            .lean()
        : [];
    const homework = open.map((a) => computeHomeworkStatus(a, hwRows));

    const recapCandidate = pickRecapCandidate({
      planLos: cappedPlanLos.map((l) => ({ loId: l.id, title: l.shortTitle ?? l.description })),
      projections: new Map(
        projections.map((p) => [p.loId, { estimate: p.estimate, ...(p.reviewDueAt ? { reviewDueAt: p.reviewDueAt } : {}) }]),
      ),
      gaps: profile.gaps,
      homework,
      now: new Date(now),
    });

    const block = renderLearnerContextBlock({
      los,
      gaps,
      ability: hints.band,
      gapsResolved90d,
      cadence,
      nextTimeIntent: intent,
      homework,
      recapCandidate,
      goals: opts.socialGoalNotes,
    });
    return { block, extras: { recapCandidate, homework, ...(intent ? { nextTimeIntent: intent } : {}) } };
  } catch (err) {
    console.error('[learner-context] getLearnerContext failed:', err);
    return { block: null, extras: emptyExtras };
  }
}

/**
 * Backward-compatible wrapper for the pre-Task-15 call shape (block only,
 * no extras, retail 'evelyn' identity). Kept because
 * `scripts/test-learner-model.ts`'s Task-17 DB section still asserts on it;
 * new callers should use `getLearnerContext` so they also get the
 * structured `extras`.
 *
 * CAVEAT: it passes the ALREADY-RESOLVED `profileId` as
 * `externalStudentId`, so the ability-band hint read resolves under
 * `{partnerId: 'evelyn', externalStudentId: profileId}` rather than the
 * caller's real partner + external id. Every OTHER read here is keyed on
 * `profileId` directly and is therefore exact; only the `ability:` line can
 * degrade (to the neutral 'steady' default) through this shim. Real routes
 * must call `getLearnerContext` with the true partner/external pair.
 */
export async function getLearnerContextBlock(
  profileId: string,
  lessonPlanId: string,
): Promise<string | null> {
  const { block } = await getLearnerContext(profileId, lessonPlanId, {
    partnerId: 'evelyn',
    externalStudentId: profileId,
  });
  return block;
}
