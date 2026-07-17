/**
 * Round-15 Issue 1 (2026-07-16): infer a pedagogical advance from a
 * show_segment_card resolution.
 *
 * Since the Sonnet-5 brain (~2026-07-11) the model often walks the
 * whiteboard forward with show_segment_card alone and never calls
 * advance_lesson, so the pedagogical cursor (currentSegmentIdRef — the
 * source of truth for lessonPlanContext AND the portal progress pills)
 * freezes at the opening segment while the board moves on. Observed in
 * BOTH 2026-07-16 live-test sessions: AP Psych pill stuck on "Hook"
 * 0/7 after two completed Try-Yourself problems; AP Calc stuck on
 * "Concept" 1/7 at the last segment.
 *
 * The advance is inferred only when the card resolves to a segment
 * strictly LATER in the plan than the cursor:
 *  - same segment  → re-render / defensive habit, no transition
 *  - earlier       → deliberate revisit, never auto-complete forward
 *  - empty cursor  → free conversation; re-entry stays brain-driven
 *  - unknown ids   → nothing safe to infer
 */
export function inferAdvanceFromSegmentCard(
  segmentIds: readonly string[],
  cursorId: string,
  targetId: string,
): boolean {
  if (!cursorId || !targetId) return false;
  const cursorIdx = segmentIds.indexOf(cursorId);
  const targetIdx = segmentIds.indexOf(targetId);
  return cursorIdx >= 0 && targetIdx > cursorIdx;
}
