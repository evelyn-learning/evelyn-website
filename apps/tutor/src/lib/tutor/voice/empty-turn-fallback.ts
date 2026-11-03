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

/**
 * Task 38 §A (voice run 19, 522–530 s: the brain's whole reply was one
 * third-person sentence the narration filter dropped; the turn rendered a
 * show_sentence card and said NOTHING, and the student waited 50 s). A turn
 * that ends with zero spoken sentences but with board tool calls is still a
 * silent turn: in a language / fixed-script lesson the engine speaks. When
 * the turn put a sentence card up, the card's sentence is said as the model
 * ("Here's the natural version: … Please say it once more."); otherwise the
 * pending ask is re-asked (the same line as the empty-turn fallback). null
 * when neither exists, or outside language lessons. Pure.
 */
export function silentTurnFallbackLine(input: { cardSentence: string | null | undefined; pinGist: string | null | undefined; languageLesson: boolean; bilingual: boolean }): { kind: 'card' | 'reask'; text: string } | null {
  if (!input.languageLesson) return null;
  const card = (input.cardSentence ?? '').replace(/\s+/g, ' ').trim();
  if (card && /[\p{L}]/u.test(card)) {
    const punctuated = /[.!?。！？]["”」’]?$/u.test(card) ? card : `${card}.`;
    return { kind: 'card', text: `Here's the natural version: ${punctuated} Please say it once more.` };
  }
  const line = emptyTurnFallbackLine({ pinGist: input.pinGist, languageLesson: true, bilingual: input.bilingual });
  return line.kind === 'reask' ? { kind: 'reask', text: line.text } : null;
}

/** The last show_sentence card's sentence among a turn's tool calls. Pure. */
export function lastShowSentenceOf(calls: ReadonlyArray<{ name: string; args: Record<string, unknown> }>): string | null {
  for (let i = calls.length - 1; i >= 0; i--) {
    const c = calls[i];
    if ((c.name === 'show_sentence' || c.name === 'showSentence') && typeof c.args?.sentence === 'string' && c.args.sentence.trim()) return c.args.sentence.trim();
  }
  return null;
}

/** Task 38 §A: tools that own a turn's speech elsewhere (advance / close / hold) — a silent turn carrying one is not given the fallback. */
export const SILENT_TURN_STATE_TOOLS: ReadonlySet<string> = new Set(['advance_lesson', 'mark_segment_complete', 'close_session_notes', 'hold_for_student', 'propose_plan_swap', 'generate_problem', 'end_session']);
