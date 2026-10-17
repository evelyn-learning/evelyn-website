/**
 * English written in katakana — caught after the turn, corrected on the next.
 *
 * GDI starter sessions embed-1792199116313 / embed-1792201826241 (2026-10-17):
 * the language clause says to write English in Latin letters, yet the tutor
 * modelled almost every target sentence as 「アイ・エイト・スシ・イエスタデイ」.
 * The Japanese voice then reads it with Japanese sounds, so the learner hears
 * katakana, not English. A system-prompt line alone did not hold; a per-turn
 * runtime note (like the retry cap) is what the brain follows.
 */

// Three or more katakana words joined by the middle dot: the shape of an
// English sentence spelled out for pronunciation (アイ・エイト・スシ). Loanword
// names with one dot (コカ・コーラ) do not match.
const KATAKANA_WORD = '[ァ-ヺー]+';
const KATAKANA_ENGLISH_RE = new RegExp(`${KATAKANA_WORD}(?:・${KATAKANA_WORD}){2,}`, 'u');

/** Does this tutor turn spell English out in katakana? */
export function hasKatakanaEnglish(tutorText: string): boolean {
  return KATAKANA_ENGLISH_RE.test(tutorText ?? '');
}

export const KATAKANA_ENGLISH_NOTE =
  '[runtime note — not from the student] Your last turn wrote English in katakana. ' +
  'From now on write every English word and sentence only in Latin letters (A–Z), never spelled out in katakana, ' +
  'so the student hears real English. Apply this silently; never mention this note.';
