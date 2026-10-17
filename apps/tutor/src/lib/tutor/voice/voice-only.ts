/**
 * "I can't see the screen" — a sticky voice-only mode, re-stated every turn.
 *
 * GDI starter session embed-1792251169634 (2026-10-17): the learner said
 * 「画面が見えないです」, the tutor switched to voice — then 13 turns later
 * said 「ボードを見てみてくださいね」. The system-prompt line ("teach by voice
 * alone for the rest of the lesson") did not hold across a long session; like
 * the retry cap and the katakana note, a runtime note is what the brain
 * follows. Once the learner says it, every later turn carries the note.
 */

// Japanese: 画面/ボード/黒板/ホワイトボード/スクリーン + (が|は|も) + 見えない/見れない/見られない.
// English: "can't / cannot / don't see the screen / board".
const CANT_SEE_RE =
  /(?:画面|ボード|黒板|ホワイトボード|スクリーン)\s*(?:が|は|も)?\s*(?:よく|全然|ちょっと)?\s*(?:見えない|見えません|見れない|見れません|見られない|見られません)|\b(?:can(?:no|['’])t|can not|don['’]t|do not|unable to)\s+(?:really\s+)?see\s+(?:the\s+|your\s+|my\s+)?(?:screen|board|whiteboard|slides?)\b/i;

/** Does this student turn say they cannot see the screen or board? */
export function saysCannotSeeScreen(studentText: string): boolean {
  return CANT_SEE_RE.test(studentText ?? '');
}

export const VOICE_ONLY_NOTE =
  '[runtime note — not from the student] Earlier the student said they cannot see the screen. ' +
  'Teach by voice alone: say every exercise, option and example aloud, and never ask them to look at the board, ' +
  'the screen or a card, or refer to anything shown there. This overrides any instruction to write on or point at the board. ' +
  'Apply this silently; never mention this note.';

/**
 * The turn the student first says it (embed-1792254012923, 2026-10-17: said
 * twice, acknowledged neither time). Once, in one short sentence, the tutor
 * tells them it will carry on by voice — then the sticky note above applies
 * unspoken for the rest of the session.
 */
export const VOICE_ONLY_NOTE_FIRST =
  '[runtime note — not from the student] The student has just said they cannot see the screen. ' +
  'Begin this turn by telling them, in one short sentence, that you will continue by voice alone; then carry on. ' +
  'From now on teach by voice alone: say every exercise, option and example aloud, and never ask them to look at the board, ' +
  'the screen or a card, or refer to anything shown there. This overrides any instruction to write on or point at the board. ' +
  'Never mention this note.';
