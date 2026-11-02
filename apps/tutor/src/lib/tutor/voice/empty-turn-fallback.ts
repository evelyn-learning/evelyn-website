/**
 * Task 30 fix round 8 (A4, run r6-A 1197 s: after the backfill filter dropped
 * every sentence of a turn — `meta_narration_backfill_filtered … → ""` — the
 * empty-turn fallback said "Hmm, I didn't come up with anything for that —
 * mind rephrasing?", blaming the student in the middle of a lesson that had a
 * question pending). In a fixed-script / language lesson with a pending ask
 * (the question pin, else the last tutor ask), the fallback re-asks it:
 * "Let me ask that again: <ask>" — 「もう一度聞きますね。」 + the ask in a
 * bilingual session. The generic line is used only when no ask is pending.
 * Pure.
 */
export const EMPTY_TURN_GENERIC_TYPED = "Hmm, I didn't come up with anything for that — mind rephrasing?";
export function emptyTurnFallbackLine(input: { pinGist: string | null | undefined; languageLesson: boolean; bilingual: boolean }): { kind: 'reask' | 'generic'; text: string } {
  const ask = (input.pinGist ?? '').trim();
  if (input.languageLesson && ask) {
    return { kind: 'reask', text: input.bilingual ? `もう一度聞きますね。 ${ask}` : `Let me ask that again: ${ask}` };
  }
  return { kind: 'generic', text: EMPTY_TURN_GENERIC_TYPED };
}
