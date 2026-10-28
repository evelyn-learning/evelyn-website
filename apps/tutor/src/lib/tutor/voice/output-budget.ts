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
 *   · a plain language voice turn gets LANGUAGE_TURN_MAX_TOKENS (220 by
 *     default — about four short sentences plus one small board call; it
 *     was 320 until 2026-10-18, when embed-1792363895174 showed 9-sentence
 *     turns passing at out=216: short Japanese sentences are cheap in
 *     tokens, so 320 bounded words, not sentences);
 *   · a turn that has to carry tools keeps the normal cap: the opener, a
 *     synthetic bracketed directive, a turn with the segment-advance note
 *     pending, the closing turn after the student's end signal, a recap
 *     go/wrap turn;
 *   · the model is TOLD the budget each capped turn (budget note), so it
 *     plans short rather than being truncated;
 *   · when the model still runs past the cap (`stop=max_tokens`), the
 *     orchestrator drops the trailing partial sentence — the student hears
 *     complete sentences only — and appends nothing; when the cap cut a
 *     TOOL CALL instead (text spoken, JSON half-written), the brain finishes
 *     it with one continuation call at the normal cap (settleCutToolUse
 *     below) — the reason the cap could be lowered without stranding a
 *     model-initiated close or advance. The next student turn
 *     comes as usual; the idle nudge keeps its ordinary delay regardless of
 *     whether the kept text ends on a question (idle-nudge.ts decides by
 *     silence, not by the shape of the last turn).
 */

export const LANGUAGE_TURN_MAX_TOKENS_DEFAULT = 220;

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
    `(roughly four short sentences in the student's language, less if you also use a board tool). Plan to finish well inside it: ` +
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

/**
 * A tool call the cap cut in half (GDI embed-1792363895174, 07:31:
 * `stop=max_tokens blocks=[text,tool_use]`): the model spoke 「今日はここまで
 * にしましょう、お疲れ様でした」 and its close_session_notes JSON was cut, so
 * the lesson did not close until the student's own goodbye 30 s later. The
 * same shape on advance_lesson strands the lesson in a segment. The
 * headroom exemptions (opener, directives, segment-advance note, student end
 * signal, recap) cannot see a MODEL-initiated close or advance, so the brain
 * recovers: ONE continuation call at the normal cap, with the spoken text as
 * the assistant turn and an instruction to finish the tool call(s) and say
 * nothing new. Any text the continuation still produces is muted — the
 * student has already heard this turn's sentences.
 */
export interface CutToolUse { id: string; name: string }

export type CutToolDecision = 'continue' | 'reject' | 'none';

export function settleCutToolUse(args: {
  /** The tool_use block whose input JSON did not parse (or never closed). */
  cut: CutToolUse | null;
  stopReason: string | null | undefined;
  /** This turn already ran its one continuation. */
  alreadyContinued: boolean;
}): CutToolDecision {
  if (!args.cut) return 'none';
  if (args.stopReason === 'max_tokens' && !args.alreadyContinued) return 'continue';
  return 'reject';
}

export function toolContinuationNote(toolName: string, doneTools: readonly string[] = []): string {
  const done = doneTools.length
    ? ` These tool calls from this turn have already been executed and must not be repeated: ${doneTools.join(', ')}.`
    : '';
  return (
    `[continuation — not from the student] Your reply was cut off at the output limit while you were calling ${toolName}. ` +
    `The student has already heard everything you said above.${done} Finish the tool call(s) this turn still needs now, with complete arguments, ` +
    `and add no new speech: output tool calls only.`
  );
}

export function toolContinuationMessages(
  spokenText: string,
  toolName: string,
  doneTools: readonly string[] = [],
): Array<{ role: 'assistant' | 'user'; content: string }> {
  const spoken = (spokenText ?? '').trim();
  return [
    ...(spoken ? [{ role: 'assistant' as const, content: spoken }] : []),
    { role: 'user' as const, content: toolContinuationNote(toolName, doneTools) },
  ];
}
