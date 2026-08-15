/**
 * Task C2 (pedagogy) — compress-and-confirm completion gate.
 *
 * Pure decision helpers for what happens when the brain calls
 * mark_segment_complete. Today the brain's tool call ALONE records mastery
 * and fires the academy-facing milestones — no check that the student ever
 * demonstrated anything. The gate (active only when the pedagogy-opener
 * flag is on AND the session targets a lesson node) additionally requires
 * the segment to have been DEMONSTRATED: the student produced a genuine
 * verification turn on that segment that the brain then affirmed (see
 * VoiceTutorRealtime's demonstratedSegmentsRef, populated at the same
 * post-stream site as the pacing correct-streak increment, inheriting all
 * its exclusions — pure acks, help requests, too-short turns, judge-kill
 * retries never count).
 *
 * CRITICAL flag-off contract: with gateActive === false the outcome must be
 * byte-equivalent to the pre-C2 inline logic in the markSegmentComplete
 * handler:
 *   - milestone: 'first_concept_complete' when kind === 'concept'
 *     (regardless of masteryDelta); 'first_try_yourself_success' when
 *     kind === 'try_yourself' UNLESS an explicit non-positive masteryDelta
 *     marks it a miss (md === undefined || md > 0); null otherwise.
 *   - recordMastery: masteryDelta is a number (the caller separately
 *     requires a plan loId before pushing — that check stays in the caller).
 *   - visitedNotMastered: always false.
 *
 * Note the progress strip (completedSegmentIdsRef) is NOT decided here —
 * the caller keeps that add unconditional in both modes: a gated segment is
 * still "visited", it just doesn't record mastery or fire a milestone.
 */

export interface CompletionSignal {
  /** TUTOR_PEDAGOGY_OPENER on AND this is a lessonNode session. */
  gateActive: boolean;
  /** Plan segment kind for the completed segment (undefined if unresolvable). */
  segmentKind: string | undefined;
  /** Explicit masteryDelta from the tool call, if it was a number. */
  masteryDelta: number | undefined;
  /** Segment id present in demonstratedSegmentsRef (affirmed genuine attempt). */
  demonstrated: boolean;
}

export interface CompletionOutcome {
  /** Push masteryDelta + losTouched into the session accumulator? */
  recordMastery: boolean;
  milestone: 'first_concept_complete' | 'first_try_yourself_success' | null;
  /** True only when the gate suppressed mastery/milestone (visited, not mastered). */
  visitedNotMastered: boolean;
}

export function resolveCompletionOutcome(s: CompletionSignal): CompletionOutcome {
  // Baseline (today's exact behavior — see flag-off contract above).
  const baseMilestone: CompletionOutcome['milestone'] =
    s.segmentKind === 'concept'
      ? 'first_concept_complete'
      : s.segmentKind === 'try_yourself' && (s.masteryDelta === undefined || s.masteryDelta > 0)
        ? 'first_try_yourself_success'
        : null;
  const baseRecordMastery = typeof s.masteryDelta === 'number';

  if (!s.gateActive) {
    return { recordMastery: baseRecordMastery, milestone: baseMilestone, visitedNotMastered: false };
  }

  if (s.demonstrated) {
    return { recordMastery: baseRecordMastery, milestone: baseMilestone, visitedNotMastered: false };
  }

  // Gate on + not demonstrated: visited, not mastered. Suppress BOTH the
  // mastery push and the milestone; the caller logs + emits a debug event.
  return { recordMastery: false, milestone: null, visitedNotMastered: true };
}

/**
 * recap_reached fires purely on ARRIVING at a recap segment today. With the
 * gate on, require at least one demonstrated segment this session — a
 * student who skipped straight to recap without ever showing work should
 * not trip the academy's furthest-milestone signal.
 */
export function shouldFireRecapMilestone(s: {
  gateActive: boolean;
  demonstratedCount: number;
}): boolean {
  if (!s.gateActive) return true;
  return s.demonstratedCount > 0;
}
