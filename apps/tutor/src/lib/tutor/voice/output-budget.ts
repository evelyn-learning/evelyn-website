/**
 * Output budget for language voice turns — pure.
 *
 * RULING (Praveen, 2026-10-18, after GDI embed-1792350642171): no TTS cut.
 * The brain's OUTPUT gets a hard cap on language voice turns, and the turn
 * must not end abruptly. Three sessions of cadence notes (≤3 sentences,
 * sticky from the second plant) had not moved the median: 12 of 29 turns ran
 * over five sentences with the sticky note in place.
 *
 * Measured from the local server log of the same sessions (`out=` per turn,
 * Sonnet 5, Japanese guidance + English targets): 4–6 sentence turns with
 * one board tool ran 87–280 output tokens; a 10-sentence turn 359; turns
 * that advanced the lesson (mark_segment_complete + advance_lesson +
 * show_segment_card) 414–681. So:
 *   · a plain language voice turn gets LANGUAGE_TURN_MAX_TOKENS (320 by
 *     default — five or six short sentences plus one small board call);
 *   · a turn that has to carry tools keeps the normal cap: the opener, a
 *     synthetic bracketed directive, a turn with the segment-advance note
 *     pending, the closing turn after the student's end signal, a recap
 *     go/wrap turn;
 *   · the model is TOLD the budget each capped turn (budget note), so it
 *     plans short rather than being truncated;
 *   · when the model still runs past the cap (`stop=max_tokens`), the
 *     orchestrator drops the trailing partial sentence — the student hears
 *     complete sentences only — and appends nothing. The next student turn
 *     comes as usual; the idle nudge keeps its ordinary delay regardless of
 *     whether the kept text ends on a question (idle-nudge.ts decides by
 *     silence, not by the shape of the last turn).
 */

export const LANGUAGE_TURN_MAX_TOKENS_DEFAULT = 320;

export function languageTurnMaxTokens(opts: {
  /** The session is bilingual (tutor_languages carries a second language). */
  languageLesson: boolean;
  /** Voice session (text sessions are not capped). */
  voice: boolean;
  /** The opener, a bracketed synthetic directive, a pending segment-advance
   *  note, the student's end-of-session signal, a recap go/wrap turn. */
  needsHeadroom: boolean;
  /** The configured cap; null = feature off. */
  cap: number | null;
}): number | undefined {
  if (opts.cap === null || !Number.isFinite(opts.cap) || opts.cap <= 0) return undefined;
  if (!opts.languageLesson || !opts.voice || opts.needsHeadroom) return undefined;
  return Math.round(opts.cap);
}

export function outputBudgetNote(maxTokens: number): string {
  return (
    `[cadence note — not from the student] Hard limit this turn: your whole reply is cut off at about ${maxTokens} tokens of output ` +
    `(roughly five short sentences in the student's language, less if you also use a board tool). Plan to finish well inside it: ` +
    `one idea, at most three sentences, then hand the turn back with one question or one instruction. ` +
    `If you need the board, say one sentence first and keep the tool call small. ` +
    `Apply this silently; never mention this note.`
  );
}

/** Does this text end on a sentence boundary? Terminal punctuation in either
 *  script, or a closing quote / bracket after it. */
export function endsSentence(text: string): boolean {
  return /[.!?。！？…][\s"”’」』)）]*\s*$/.test((text ?? '').trim()) || /[」』"”]\s*$/.test((text ?? '').trim());
}

export type HeldTailDecision = 'speak' | 'drop';

/**
 * The fragment the sentence buffer flushed at the end of a text block, with
 * the stop reason that followed. A fragment on a `max_tokens` stop is the
 * cut-off half of a sentence: dropped. Anything else (a last sentence the
 * model wrote without a full stop, an `end_turn`, a `tool_use` hand-off) is
 * spoken as before.
 */
export function settleHeldTail(fragment: string, stopReason: string | null | undefined): HeldTailDecision {
  if (!fragment || !fragment.trim()) return 'drop';
  if (stopReason === 'max_tokens' && !endsSentence(fragment)) return 'drop';
  return 'speak';
}
