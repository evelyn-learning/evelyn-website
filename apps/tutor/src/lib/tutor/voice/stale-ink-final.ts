/**
 * Stale Ink 2 final — pure helper for useCartesiaInkWS's finalizeTurn.
 *
 * 2026-10-18, GDI session embed-1792338502233, 16:05: Ink 2 opened a turn while
 * the tutor was speaking (the mic caught the tutor's own "Yes, I have"); the
 * mic was then ducked for the rest of the tutor's 10-sentence turn, so Ink 2
 * never saw the silence that closes a turn. 42 s later, the moment the student
 * next spoke, it delivered ", Ihave ." as that turn's final. The orchestrator
 * dispatched it as a fresh student turn, the brain began answering, and the
 * student's real sentence had to cut that reply off — two wasted brain calls
 * and a spoken fragment the learner heard as an interruption.
 *
 * Two tokens in 42 seconds is not speech. A final whose turn stayed open past
 * the hook's own stuck-turn watchdog and whose token rate is far below talking
 * speed is stale: its words were captured during the tutor's turn, not now.
 * The threshold is deliberately low (0.25 tokens/s ≈ a quarter of a word, or
 * one kana, every four seconds) so a slow A1 learner's halting sentence is
 * never touched — Ink 2 closes a real pause via turn_end_timeout long before
 * 12 s, so a long-open turn can only come from the muted-mic window.
 */

/** Same figure as the hook's TRANSCRIPTION_WATCHDOG_MS: a turn open this long
 *  without a final is already treated as stuck. */
export const STALE_INK_FINAL_MIN_OPEN_MS = 12_000;
export const STALE_INK_FINAL_MAX_TOKENS_PER_SEC = 0.25;
/** A stale final is a fragment. A long-open turn that carries a whole sentence
 *  is kept whatever its rate — those words are the student's, however Ink 2
 *  came to hold them. */
export const STALE_INK_FINAL_MAX_TOKENS = 4;

const LATIN_WORD_RE = /[A-Za-z0-9À-ɏ']+/g;
// Hiragana, katakana (incl. the prolonged-sound mark), CJK unified ideographs,
// Hangul syllables: each character is roughly one spoken unit.
const CJK_CHAR_RE = /[぀-ヿ㐀-䶿一-鿿가-힯]/g;

/** Latin words plus one token per kana / kanji / hangul character. */
export function countSpeechTokens(text: string): number {
  const latin = text.match(LATIN_WORD_RE)?.length ?? 0;
  const cjk = text.match(CJK_CHAR_RE)?.length ?? 0;
  return latin + cjk;
}

/** True when a final that arrived `openMs` after its turn.start carries too
 *  little speech for that span to be real. */
export function isStaleInkFinal(text: string, openMs: number): boolean {
  if (openMs < STALE_INK_FINAL_MIN_OPEN_MS) return false;
  const tokens = countSpeechTokens(text);
  if (tokens > STALE_INK_FINAL_MAX_TOKENS) return false;
  return tokens / (openMs / 1000) < STALE_INK_FINAL_MAX_TOKENS_PER_SEC;
}
