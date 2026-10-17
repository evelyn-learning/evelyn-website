/**
 * English written in katakana — caught after the turn, corrected on the next.
 *
 * GDI starter sessions embed-1792199116313 / embed-1792201826241 (2026-10-17):
 * the language clause says to write English in Latin letters, yet the tutor
 * modelled almost every target sentence as 「アイ・エイト・スシ・イエスタデイ」.
 * The Japanese voice then reads it with Japanese sounds, so the learner hears
 * katakana, not English. A system-prompt line alone did not hold; a per-turn
 * runtime note (like the retry cap) is what the brain follows.
 *
 * embed-1792254012923 (2026-10-17): the dotted-sentence shape never appeared,
 * but single words were given katakana readings four times —
 * 「コーワーカーと読みます」, 「キャリオゥキーみたいに言います」,
 * 「sang の音は「サング」です」, 「「サング・カラオケ」です」 — and the note
 * never fired. A katakana run offered AS A READING (quoted and glossed, or
 * attached to 読みます / 音は / みたいに言います) counts too. A loanword used
 * as an ordinary Japanese word (カラオケをしたことがありますか) does not.
 */

const KATAKANA_WORD = '[ァ-ヺー]+';
const KATAKANA_RUN = '[ァ-ヺー・]{2,}';

// Three or more katakana words joined by the middle dot: an English sentence
// spelled out for pronunciation (アイ・エイト・スシ). Loanword names with one
// dot (コカ・コーラ) do not match.
const DOTTED_SENTENCE_RE = new RegExp(`${KATAKANA_WORD}(?:・${KATAKANA_WORD}){2,}`, 'u');

// A katakana run presented as how an English word sounds:
//   「サング」です / 「サング」と読みます / 「サング」と言います / 「サング」みたいに
//   コーワーカーと読みます
//   キャリオゥキーみたいに言います / のように発音します
//   音は「サング」 / 発音はサング / 読み方はサング
const READING_RE = new RegExp(
  [
    `「${KATAKANA_RUN}」\\s*(?:です|と読|と言|みたいに|のように|って)`,
    `${KATAKANA_RUN}と読み`,
    `${KATAKANA_RUN}(?:みたいに|のように|っぽく)\\s*(?:言|読|発音)`,
    `(?:音|発音|読み方?)は[、\\s]*「?${KATAKANA_RUN}`,
  ].join('|'),
  'u',
);

/** Does this tutor turn spell English out in katakana? */
export function hasKatakanaEnglish(tutorText: string): boolean {
  const t = tutorText ?? '';
  return DOTTED_SENTENCE_RE.test(t) || READING_RE.test(t);
}

export const KATAKANA_ENGLISH_NOTE =
  '[runtime note — not from the student] Your last turn wrote English in katakana. ' +
  'From now on write every English word and sentence only in Latin letters (A–Z), never spelled out in katakana, ' +
  'so the student hears real English. Apply this silently; never mention this note.';
