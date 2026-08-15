/**
 * Learner-context boot block (Task 17, phase-c) — a compact, evidence-backed
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
 * Two-part surface, split for testability (per the task-17 brief):
 *   - `renderLearnerContextBlock` — pure. Takes already-resolved LO/gap
 *     rows and formats them. No DB, no imports beyond `TUNING`.
 *   - `getLearnerContextBlock` — the DB-backed join: resolves the lesson
 *     plan's LOs, looks up their projections for this student, pulls the
 *     student's active gaps, and calls the pure renderer. NEVER throws —
 *     any failure (unknown plan id, DB error) resolves to `null` so a
 *     learner-context outage degrades to "no block" rather than crashing
 *     the boot-context fetch that also carries the student profile.
 */

import { LearnerStateProjectionModel, buildLearnerStateProjectionId } from '@/models';
import connectDB from '@core/db';
import { getLessonPlan } from '../lesson-plan/store';
import { getOrCreateStudentProfile, isGapStale } from '../student-profile/store';
import { TUNING } from './estimator';

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
}

export interface LearnerContextGap {
  label: string;
  observation: string;
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
 */
export function renderLearnerContextBlock(
  los: LearnerContextLo[],
  gaps: LearnerContextGap[],
): string | null {
  if (los.length === 0 && gaps.length === 0) return null;

  const cappedLos = los.slice(0, MAX_LOS);
  const cappedGaps = gaps.slice(0, MAX_GAPS);

  const lines: string[] = ['<learner_context>'];

  if (cappedLos.length > 0) {
    lines.push("This student's current standing on this lesson's objectives (from accumulated evidence):");
    for (const lo of cappedLos) {
      const estimate = lo.estimate ?? TUNING.untouchedPrior;
      const due = lo.reviewDue ? ' — DUE FOR REVIEW' : '';
      lines.push(`- ${lo.title}: ${bandLabel(estimate)} (${lo.confidence} confidence)${due}`);
    }
  }

  if (cappedGaps.length > 0) {
    lines.push('Active gaps observed in past work:');
    for (const gap of cappedGaps) {
      lines.push(`- ${gap.label}: ${clipObservation(gap.observation)}`);
    }
  }

  lines.push(
    'Teach to this: fast-track objectives marked strong (quick check, then advance); slow down and probe where developing; where a gap is listed, surface and resolve the misconception rather than re-explaining from scratch.',
  );
  lines.push('</learner_context>');
  return lines.join('\n');
}

/**
 * DB-backed join: resolves `lessonPlanId`'s LOs (capped to `MAX_LOS`, plan
 * order), looks up each one's LearnerStateProjection for `studentId`, pulls
 * the student's active gaps (status 'confirmed' or legacy 'open' — NOT
 * 'candidate': this block states standing as fact to steer pacing, so it
 * holds to the higher-confidence bar; 'candidate' single-observation gaps
 * stay in the persisted `<student_profile>` block's softer "address
 * opportunistically" framing), and renders the block.
 *
 * Never throws: an unknown plan id, an empty-LO plan, or any DB error all
 * resolve to `null` (logged via console.error for the DB-error case) so a
 * learner-context failure never takes down the boot-context fetch that
 * also carries the student profile.
 */
export async function getLearnerContextBlock(
  studentId: string,
  lessonPlanId: string,
): Promise<string | null> {
  try {
    const plan = await getLessonPlan(lessonPlanId);
    if (!plan || plan.los.length === 0) return null;

    const cappedPlanLos = plan.los.slice(0, MAX_LOS);

    await connectDB();
    const ids = cappedPlanLos.map((lo) => buildLearnerStateProjectionId(studentId, lo.id));
    const projections = await LearnerStateProjectionModel.find({ _id: { $in: ids } }).lean();
    const byLoId = new Map(projections.map((p) => [p.loId, p]));

    const now = Date.now();
    const los: LearnerContextLo[] = cappedPlanLos.map((lo) => {
      const proj = byLoId.get(lo.id);
      return {
        loId: lo.id,
        title: lo.shortTitle ?? lo.description,
        estimate: proj ? proj.estimate : null,
        confidence: proj ? proj.confidence : 'low',
        reviewDue: !!(proj?.reviewDueAt && proj.reviewDueAt.getTime() <= now),
      };
    });

    const profile = await getOrCreateStudentProfile(studentId);
    const gaps: LearnerContextGap[] = profile.gaps
      .filter((g) => (g.status === 'confirmed' || g.status === 'open') && !isGapStale(g, now))
      .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
      .slice(0, MAX_GAPS)
      .map((g) => ({
        label: g.kind === 'prerequisite' ? (g.conceptLabel ?? '(?)') : (g.loId ?? '(?)'),
        observation: g.evidence?.observation ?? g.description ?? '(no detail)',
      }));

    return renderLearnerContextBlock(los, gaps);
  } catch (err) {
    console.error('[learner-context] getLearnerContextBlock failed:', err);
    return null;
  }
}
