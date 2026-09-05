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
import { getLearnerHints, type LearnerHints } from './hints';
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
 *  in principle carry 8 LO lines with three digests each PLUS five homework
 *  statuses, goals and gaps; rather than trust every individual cap to
 *  compose, the renderer re-assembles the block under progressively harsher
 *  trim settings until it fits (see `TRIM_STAGES` / `renderLearnerContextBlock`). */
export const LEARNER_CONTEXT_MAX_CHARS = 2400;

/** How far a gap observation is clipped once the block is over the cap
 *  (the un-trimmed clip is `GAP_OBSERVATION_MAX_CHARS`). */
const TRIMMED_GAP_OBSERVATION_CHARS = 80;

/** Marker inserted by the last-resort hard truncation so the brain can see
 *  the body was cut rather than silently believing it read the whole thing. */
const TRUNCATION_MARKER = '… (truncated)';

const LO_SECTION_HEADER = "This student's current standing on this lesson's objectives (from accumulated evidence):";
const GAP_SECTION_HEADER = 'Active gaps observed in past work:';

/** Always rendered, in this order, immediately before the closing fence.
 *  The trim never touches these — a block that has lost its directives is
 *  worse than a block that has lost half its data. */
const DIRECTIVES = [
  'Teach to this: fast-track objectives marked strong (quick check, then advance); slow down and probe where developing; where a gap is listed, surface and resolve the misconception rather than re-explaining from scratch.',
  'Cadence: after 7+ days away, open with a one-minute warm-up on the last objective before the hook; after 2 days or less, skip any re-orientation.',
  'When the student asks how they are doing, answer from these lines — name the trend, one gap that is closing, the homework status and the next step — specifically and honestly; never invent progress.',
  'Never read this block aloud, and never cite it as a record or a system.',
] as const;

interface TrimStage {
  /** Re-clip gap observations to `TRIMMED_GAP_OBSERVATION_CHARS`. */
  clipGaps: boolean;
  /** Drop the ` · practice … · quiz …` digest tail from LO lines. The band,
   *  trend glyph and DUE FOR REVIEW flag — the pacing signal — survive. */
  dropDigests: boolean;
  /** Drop the `goal:` lines. */
  dropGoals: boolean;
  /** Keep only the most recent `homework (assigned …)` line. */
  firstHomeworkOnly: boolean;
}

/** Applied in order; the first assembly that fits the cap wins. Ordered
 *  cheapest-loss-first: verbose gap prose, then LO colour, then goals, then
 *  older homework. Monotone (each stage is a superset of the one before), so
 *  the sequence strictly shrinks and terminates. */
const TRIM_STAGES: TrimStage[] = [
  { clipGaps: false, dropDigests: false, dropGoals: false, firstHomeworkOnly: false },
  { clipGaps: true, dropDigests: false, dropGoals: false, firstHomeworkOnly: false },
  { clipGaps: true, dropDigests: true, dropGoals: false, firstHomeworkOnly: false },
  { clipGaps: true, dropDigests: true, dropGoals: true, firstHomeworkOnly: false },
  { clipGaps: true, dropDigests: true, dropGoals: true, firstHomeworkOnly: true },
];

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

/** Run one OPTIONAL sub-read of the join. A failure logs and degrades that
 *  one field to `fallback` — it must not take the whole block down with it.
 *  Only the plan / projection / profile reads are fatal (they ARE the
 *  block); everything routed through here is colour on top. */
async function optionalRead<T>(what: string, read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (err) {
    console.error(`[learner-context] ${what} failed:`, err);
    return fallback;
  }
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
 * caller supplied it — `getLearnerContext` wraps each optional sub-read in
 * its own try/catch, so a hints outage or a homework-read failure costs you
 * that one line rather than the whole block.
 *
 * TRIM: the block is assembled from SEGMENTED arrays (LO rows keep their
 * digest tail separate; gap rows keep their raw observation) rather than
 * post-processed with regexes over the finished string — the previous
 * regex approach could not converge and mis-targeted any line containing
 * " · " (a goal or a homework title). Assembly is retried under each
 * `TRIM_STAGES` setting until it fits, then, only if even the harshest
 * stage overflows, the BODY is hard-truncated with a `… (truncated)`
 * marker so the block always closes with its four directives and
 * `</learner_context>`.
 */
export function renderLearnerContextBlock(input: LearnerContextInput): string | null {
  const { los, gaps } = input;
  if (los.length === 0 && gaps.length === 0) return null;

  // --- segment the content (nothing is stringified into one blob yet) ---

  const loRows = los.slice(0, MAX_LOS).map((lo) => {
    const estimate = lo.estimate ?? TUNING.untouchedPrior;
    const trend = lo.trend ? ` ${TREND_GLYPH[lo.trend]}` : '';
    const due = lo.reviewDue ? ' — DUE FOR REVIEW' : '';
    const digests: string[] = [];
    if (lo.practice) digests.push(`practice ${lo.practice.correct}/${lo.practice.total} on ${lo.practice.date}`);
    if (lo.quiz) digests.push(`quiz ${lo.quiz.awarded}/${lo.quiz.max} pts on ${lo.quiz.date}`);
    if (lo.mock) digests.push(`mock ${lo.mock.correct}/${lo.mock.total} (${lo.mock.date})`);
    return {
      base: `- ${lo.title}: ${bandLabel(estimate)} (${lo.confidence} confidence)${trend}${due}`,
      tail: digests.length > 0 ? ` · ${digests.join(' · ')}` : '',
    };
  });

  const midLines: string[] = [];
  if (input.ability) midLines.push(`ability: ${input.ability}`);
  if (typeof input.gapsResolved90d === 'number' && input.gapsResolved90d > 0) {
    midLines.push(`gaps resolved in the last 90 days: ${input.gapsResolved90d}`);
  }
  if (input.cadence) {
    const d = input.cadence.daysSinceLast;
    const last = d === null ? 'no prior session on record' : `last session ${d} day${d === 1 ? '' : 's'} ago`;
    const n = input.cadence.sessionsLast7d;
    midLines.push(`cadence: ${last}; ${n} session${n === 1 ? '' : 's'} in the last 7 days`);
  }
  if (input.nextTimeIntent) {
    midLines.push(`next time (your own note from last session): "${input.nextTimeIntent}"`);
  }

  const homeworkLines = (input.homework ?? []).map((h) => describeHomework(h));
  const recapLines = input.recapCandidate
    ? [`recap_candidate: ${input.recapCandidate.title} — ${input.recapCandidate.reason}${input.recapCandidate.soft ? ' (soft)' : ''}`]
    : [];
  const goalLines = (input.goals ?? []).slice(0, 2).map((g) => `goal: ${g.replace(/^goal:\s*/i, '')}`);
  const gapRows = gaps.slice(0, MAX_GAPS).map((g) => ({ label: g.label, observation: clipObservation(g.observation) }));

  // --- assembly under one trim setting ---

  const assemble = (stage: TrimStage): string => {
    const lines: string[] = ['<learner_context>'];
    if (loRows.length > 0) {
      lines.push(LO_SECTION_HEADER);
      for (const row of loRows) lines.push(stage.dropDigests ? row.base : `${row.base}${row.tail}`);
    }
    lines.push(...midLines);
    lines.push(...(stage.firstHomeworkOnly ? homeworkLines.slice(0, 1) : homeworkLines));
    lines.push(...recapLines);
    if (!stage.dropGoals) lines.push(...goalLines);
    if (gapRows.length > 0) {
      lines.push(GAP_SECTION_HEADER);
      for (const gap of gapRows) {
        const observation =
          stage.clipGaps && gap.observation.length > TRIMMED_GAP_OBSERVATION_CHARS
            ? `${gap.observation.slice(0, TRIMMED_GAP_OBSERVATION_CHARS).trimEnd()}…`
            : gap.observation;
        lines.push(`- ${gap.label}: ${observation}`);
      }
    }
    lines.push(...DIRECTIVES, '</learner_context>');
    return lines.join('\n');
  };

  let out = '';
  for (const stage of TRIM_STAGES) {
    out = assemble(stage);
    if (out.length <= LEARNER_CONTEXT_MAX_CHARS) return out;
  }

  // --- last resort: hard-truncate the body, keep the fence + directives ---
  const closing = [...DIRECTIVES, '</learner_context>'];
  const body = out.split('\n').slice(1, -closing.length);
  const fixedCost = '<learner_context>\n'.length + TRUNCATION_MARKER.length + 1 + closing.join('\n').length;
  const budget = Math.max(0, LEARNER_CONTEXT_MAX_CHARS - fixedCost);
  const kept: string[] = [];
  let used = 0;
  for (const line of body) {
    if (used + line.length + 1 > budget) break;
    kept.push(line);
    used += line.length + 1;
  }
  return ['<learner_context>', ...kept, TRUNCATION_MARKER, ...closing].join('\n');
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
 * DEGRADES FIELD BY FIELD. Only THREE reads are fatal — the lesson plan,
 * the projections and the student profile — because they are the block:
 * without them there is no standing to state. Every other sub-read (the
 * trend snapshot, the digest evidence rows, the ability-band hints, the
 * open assignments + their evidence rows, and the recap-candidate pick)
 * runs inside its OWN try/catch via `optionalRead`, logs
 * `[learner-context] <what> failed`, and degrades to undefined/empty. A
 * homework-collection outage therefore costs the block its homework line,
 * not its existence.
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
    // recent snapshot dated at or before `trendWindowDays` ago. OPTIONAL:
    // no snapshot (or a failed read) means no trend glyph, not no block.
    const cutoffDate = new Date(now - TUNING.trendWindowDays * MS_PER_DAY).toISOString().slice(0, 10);
    const priorByLo = await optionalRead(
      'trend snapshot read',
      async () => {
        const prior = await LearnerStateSnapshotModel.findOne({ studentId: profileId, date: { $lte: cutoffDate } })
          .sort({ date: -1 })
          .lean();
        return new Map((prior?.los ?? []).map((l) => [l.loId, l.estimate]));
      },
      new Map<string, number>(),
    );

    // per-LO digests from the raw evidence rows (last 60 days, newest
    // first). OPTIONAL: no rows means LO lines without their digest tail.
    const loIds = cappedPlanLos.map((l) => l.id);
    const rows = await optionalRead(
      'evidence digest read',
      () =>
        EvidenceEventModel.find({
          studentId: profileId,
          loId: { $in: loIds },
          occurredAt: { $gte: new Date(now - DIGEST_WINDOW_DAYS * MS_PER_DAY) },
        })
          .select('loId source outcome pointsAwarded maxPoints occurredAt sessionId')
          .sort({ occurredAt: -1 })
          .lean(),
      [],
    );

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
        // Only when there is a REAL 14-day-ago value to compare against.
        // `trendOf` answers 'flat' for a missing prior, which would stamp a
        // meaningless `→` on every line of a new student's block; an absent
        // `trend` renders no glyph at all.
        ...(priorByLo.has(lo.id) ? { trend: trendOf(proj?.estimate ?? null, priorByLo.get(lo.id)) } : {}),
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

    // OPTIONAL: no band ⇒ the `ability:` line simply doesn't render.
    const hints = await optionalRead<LearnerHints | null>(
      'ability-band hints read',
      () => getLearnerHints(opts.externalStudentId, opts.subject, opts.partnerId),
      null,
    );
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

    // OPTIONAL: assignments + their evidence rows are ONE unit (the rows are
    // meaningless without the assignments), so one catch covers both. A
    // failure ⇒ no homework line and empty `extras.homework`.
    const homework = await optionalRead<HomeworkStatus[]>(
      'open-homework read',
      async () => {
        const open = await findOpenAssignments(profileId, { withinDays: HOMEWORK_WINDOW_DAYS, requireLocator: true });
        const hwItemIds = open.flatMap((a) => a.los.flatMap((l) => l.items.map((i) => i.id)));
        const hwRows =
          hwItemIds.length > 0
            ? await EvidenceEventModel.find({ studentId: profileId, itemId: { $in: hwItemIds } })
                .select('itemId outcome occurredAt')
                .lean()
            : [];
        return open.map((a) => computeHomeworkStatus(a, hwRows));
      },
      [],
    );

    // OPTIONAL and PURE, but wrapped all the same: a throw in the picker
    // must not cost the caller the standing block it was decorating.
    let recapCandidate: RecapCandidate | null = null;
    try {
      recapCandidate = pickRecapCandidate({
        planLos: cappedPlanLos.map((l) => ({ loId: l.id, title: l.shortTitle ?? l.description })),
        projections: new Map(
          projections.map((p) => [p.loId, { estimate: p.estimate, ...(p.reviewDueAt ? { reviewDueAt: p.reviewDueAt } : {}) }]),
        ),
        gaps: profile.gaps,
        homework,
        now: new Date(now),
      });
    } catch (err) {
      console.error('[learner-context] recap-candidate pick failed:', err);
    }

    const block = renderLearnerContextBlock({
      los,
      gaps,
      ability: hints?.band,
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
