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

import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import {
  segmentLabel,
  type LessonProgress,
  type LessonSegmentRef,
} from '@evelyn/portal-contract/v1';

/** Per-segment pacing weight for the % calculation. Missing/zero minutes → 1. */
function segmentWeight(estimatedMinutes: number | undefined): number {
  return typeof estimatedMinutes === 'number' && estimatedMinutes > 0 ? estimatedMinutes : 1;
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

  const segments: LessonSegmentRef[] = plan.segments.map((s) => ({ id: s.id, kind: s.kind }));
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
  };
}
