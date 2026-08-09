/**
 * Lesson-progress builder (engine side) — E2.
 *
 * Maps the engine's runtime lesson position (the `LessonPlan` manifest +
 * `currentSegmentIdRef` / `completedSegmentIdsRef`) into the portal contract's
 * `LessonProgress` shape, computing the minutes-weighted `percent` the portal
 * can't (it has no segment minutes).
 *
 * `percent` (spec §1.3): minutes-weighted from each segment's
 * `estimatedMinutes`. Completed segments count FULL weight; the current
 * (in-progress) segment counts HALF weight — so the bar moves during a long
 * hook/concept instead of sitting at 0 until the first completion. Segments
 * without `estimatedMinutes` fall back to weight 1, so a plan with no minutes
 * degenerates gracefully to the count-based equivalent.
 */

import type { LessonPlan, LearningObjective } from '@/lib/tutor/lesson-plan/types';
import { isGeneratedPlan, loGroupOf } from '@/lib/tutor/lesson-plan/context';
import {
  segmentLabel,
  type LessonProgress,
  type LessonSegmentRef,
} from '@evelyn/portal-contract/v1';

/** Per-segment pacing weight for the % calculation. Missing/zero minutes → 1. */
function segmentWeight(estimatedMinutes: number | undefined): number {
  return typeof estimatedMinutes === 'number' && estimatedMinutes > 0 ? estimatedMinutes : 1;
}

/** Max words in a title derived from an LO's description when it has no
 *  `shortTitle` (contract v1.11.0). Keeps un-authored fallback titles
 *  chip-sized; long descriptions truncate with an ellipsis. */
const LO_TITLE_MAX_WORDS = 6;

/** Display title for an LO progress chip: `shortTitle` when authored
 *  (stage-1 generated or curated), else a bounded truncation of
 *  `description`. */
function loDisplayTitle(lo: LearningObjective): string {
  if (lo.shortTitle) return lo.shortTitle;
  const words = lo.description.replace(/[.?!]+$/, '').split(/\s+/).filter(Boolean);
  return words.length <= LO_TITLE_MAX_WORDS
    ? words.join(' ')
    : words.slice(0, LO_TITLE_MAX_WORDS).join(' ') + '…';
}

/**
 * Build the contract `LessonProgress` from the live runtime position. Returns
 * `null` when there is no active plan (or it has no segments) — the caller
 * skips emitting in that case.
 */
export function buildLessonProgress(
  plan: LessonPlan | null,
  currentSegmentId: string,
  completedSegmentIds: readonly string[],
): LessonProgress | null {
  if (!plan || !plan.segments?.length) return null;

  // LO view (contract v1.11.0): map each segment to the LO it teaches and
  // surface the LO list itself, so the portal can render named progress
  // chips instead of raw segment kinds. Generated plans (E6's
  // "<loId>-hook/-concept/-worked/-try" convention) map via loGroupOf,
  // leaving 'intro'/'recap' unmapped (they aren't any one LO). Curated
  // plans don't follow that id convention, but the common case is a
  // single-LO plan — group every segment under that LO, titled by the
  // plan's own title. Plans with no LOs at all (or curated multi-LO
  // plans, which have no reliable segment→LO signal) fall back to the
  // pre-v1.11.0 shape with `los`/`loId` simply absent.
  const planLos = plan.los ?? [];
  let segments: LessonSegmentRef[];
  let los: { id: string; title: string }[] | undefined;

  if (isGeneratedPlan(plan) && planLos.length > 0) {
    const loIds = new Set(planLos.map((l) => l.id));
    segments = plan.segments.map((s) => {
      const group = loGroupOf(s.id);
      return loIds.has(group) ? { id: s.id, kind: s.kind, loId: group } : { id: s.id, kind: s.kind };
    });
    los = planLos.map((l) => ({ id: l.id, title: loDisplayTitle(l) }));
  } else if (planLos.length > 0) {
    const primary = planLos[0].id;
    segments = plan.segments.map((s) => ({ id: s.id, kind: s.kind, loId: primary }));
    los = [{ id: primary, title: plan.title }];
  } else {
    segments = plan.segments.map((s) => ({ id: s.id, kind: s.kind }));
  }

  const completed = new Set(completedSegmentIds);

  // Minutes-weighted percent: completed = full, current (if not already
  // completed) = half. Clamped to [0, 100].
  let total = 0;
  let credited = 0;
  for (const s of plan.segments) {
    const w = segmentWeight(s.estimatedMinutes);
    total += w;
    if (completed.has(s.id)) {
      credited += w;
    } else if (s.id === currentSegmentId) {
      credited += w / 2;
    }
  }
  const percent = total > 0 ? Math.max(0, Math.min(100, Math.round((credited / total) * 100))) : 0;

  return {
    lessonPlanId: plan.id,
    segments,
    currentSegmentId,
    completedSegmentIds: [...completedSegmentIds],
    currentSegmentLabel: segmentLabel(segments, currentSegmentId),
    percent,
    ...(los ? { los } : {}),
  };
}
