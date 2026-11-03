import { turnAskGist } from './correct-retry';
import { sentenceAsksStudent } from '../question-gist-text';
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
export function silentTurnFallbackLine(input: { cardSentence: string | null | undefined; pinGist: string | null | undefined; languageLesson: boolean; bilingual: boolean; studentText?: string | null }): { kind: 'card' | 'reask'; text: string } | null {
  if (!input.languageLesson) return null;
  const card = (input.cardSentence ?? '').replace(/\s+/g, ' ').trim();
  // Fix round 1 (m-2): a card of the student's own sentence is no "natural version" to repeat.
  const ownKey = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const isOwn = !!input.studentText && ownKey(card) === ownKey(input.studentText);
  if (card && !isOwn && /[\p{L}]/u.test(card)) {
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
// Fix round 1 (I-2): request_pronunciation_check (the clip is arming), set_working_level (the level-set advance has its own continuation) and resume_lesson are silent by purpose too.
export const SILENT_TURN_STATE_TOOLS: ReadonlySet<string> = new Set(['advance_lesson', 'mark_segment_complete', 'close_session_notes', 'hold_for_student', 'propose_plan_swap', 'generate_problem', 'end_session', 'request_pronunciation_check', 'set_working_level', 'resume_lesson']);
/** Fix round 1 (I-2): when the silent-turn fallback is due — a LANGUAGE
 *  lesson (subject languages / fixed-script plan; never a bilingual maths
 *  session), a student turn (not a runtime "[" turn), no pronunciation clip
 *  armed, kept text empty, tools ran and none of them is silent by purpose.
 *  Pure. */
export function silentTurnFallbackDue(input: { languageLesson: boolean; transcript: string; keptText: string; toolsSeen: readonly string[]; retrySkipped: boolean; pronunciationArmed: boolean }): boolean {
  if (!input.languageLesson || /^\s*\[/.test(input.transcript ?? '') || input.pronunciationArmed || input.retrySkipped) return false;
  if ((input.keptText ?? '').trim() || input.toolsSeen.length === 0) return false;
  return !input.toolsSeen.some((n) => SILENT_TURN_STATE_TOOLS.has(n));
}

/**
 * Task 39 fix round 1 (R26-1, bot run r26 309 s: after the tangent
 * 「今日は疲れています。」 the tutor said only 「お疲れさまです。 今日は、現在完了で
 * 経験を話す練習ができましたね。」 — no return to the lesson, the student left with
 * nothing to answer). When the student's turn was a non-answer (the check
 * said it answers neither question, or it was a backchannel) and the kept
 * text asks nothing, the engine appends the pending ask (the last tutor
 * turn's ask gist) — the engine-spoken offer's mechanism. A Japanese lead
 * when the session teaches in Japanese too; the ask itself as it was asked.
 * Language lessons only; never on a runtime turn, a closing turn, or when
 * the kept text is empty (the silent / empty-turn fallbacks own that). Pure.
 */
export function nonAnswerReturnLine(input: {
  languageLesson: boolean;
  studentNonAnswer: boolean;
  runtimeTurn: boolean;
  closing: boolean;
  keptText: string;
  /** the kept text already asks / instructs (attemptAsksStudent) */
  keptAsks: boolean;
  pinGist: string | null | undefined;
  japanese: boolean;
}): string | null {
  if (!input.languageLesson || !input.studentNonAnswer || input.runtimeTurn || input.closing) return null;
  if (!(input.keptText ?? '').trim() || input.keptAsks) return null;
  const ask = (input.pinGist ?? '').trim();
  if (!ask) return null;
  if ((input.keptText ?? '').includes(ask)) return null;
  return input.japanese ? `では、レッスンに戻りましょう。 ${ask}` : `Let's get back to the lesson. ${ask}`;
}
/** Fix round 1 (R26-1): the pending ask of the last tutor turn — its ask gist
 *  (turnAskGist), else its last sentence that asks the student (an
 *  imperative with a quoted starter, 'Please finish this sentence about your
 *  job: "I have worked..."', which the gist helpers miss at the ellipsis). */
export function pendingAskOf(prevTutor: string | null | undefined): string {
  const gist = turnAskGist(prevTutor);
  if (gist) return gist;
  const parts = (prevTutor ?? '').split(/(?<=[.!?。！？]["”」’]?)\s+/).map((x) => x.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) if (sentenceAsksStudent(parts[i]!)) return parts[i]!;
  return '';
}
