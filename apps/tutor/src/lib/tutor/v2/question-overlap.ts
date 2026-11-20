/**
 * Tutor brain v2 — Task 8a fix round 1: whether two questions are the same question, or a question is about a stored one, by the words
 * they share (Latin script: content words, five-letter stems alike) or the characters they share (Japanese: character bigrams). Used to
 * keep re-test bookkeeping and the level check's count (never a hold, a refusal of end_lesson, a page or a cut of the model's words).
 * Also the runtime's own check-in lines (moved here from turn.ts so the level check can tell them from a question it put). Pure.
 */

/** How a reply that asked nothing hands the turn to the student (turn.ts appends one). Rotated, so it is not one phrase every time. */
export const V2_CHECK_INS = ['Does that make sense so far?', 'Are you with me so far?', 'Is that clear, or shall I go over it again?', 'Does that make sense?'];

const SMALL = new Set(('the and you your you\'d you\'re can could would will what which when where who how why about that this these those with have has had '
  + 'are was were for any one some me more like into from them they their there here then than just also very much does did do is it its '
  + 'not but our out get got let let\'s ever if so').split(/\s+/));
/** The Latin-script content words of a text (three letters or more, small words out), once each. */
export const v2ContentWords = (t: string): string[] => [...new Set((t.toLowerCase().replace(/[’]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? []).filter((w) => w.length >= 3 && !SMALL.has(w)))];
/** Task 8a fix round 2 (M1): a word's stem: an ending -ing / -ed / -es / -s off, then a final "e", each only when three letters or more
 *  stay ("living" / "live" → "liv", "worked" → "work", "making" / "make" → "mak", "uses" / "use" → "use"; "using" stays "using"). */
export function v2WordStem(w: string): string {
  let x = w;
  for (const end of ['ing', 'ed', 'es', 's']) if (x.endsWith(end) && x.length - end.length >= 3) { x = x.slice(0, -end.length); break; }
  if (x.endsWith('e') && x.length - 1 >= 3) x = x.slice(0, -1);
  return x;
}
/** Two words alike: the same, the same stem (v2WordStem, fix round 2 M1: "live" / "living", "work" / "worked"), or the same first five
 *  letters ("websites" / "website"). Unrelated short words stay apart ("work" / "word"). */
export const v2SameWord = (a: string, b: string): boolean => a === b || v2WordStem(a) === v2WordStem(b) || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));
/** Task 8a fix round 2 (M3): a question with its case, quotes, punctuation and spacing normalised (identical questions compare equal). */
export const v2NormalQuestion = (t: string): string => t.toLowerCase().replace(/[’]/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, ' ').replace(/\s+/g, ' ').trim();
/** How many of `want` have a like word in `have`. */
export const v2WordsShared = (want: readonly string[], have: readonly string[]): number => want.filter((w) => have.some((x) => v2SameWord(w, x))).length;

const CJK_RUN = /[぀-ヿ㐀-鿿ｦ-ﾟ]+/g;
export const V2_CJK = /[぀-ヿ㐀-鿿]/;
/** The character bigrams of the Japanese runs of a text (a one-character run is its character). */
export function v2CjkBigrams(t: string): Set<string> {
  const out = new Set<string>();
  for (const run of t.match(CJK_RUN) ?? []) { if (run.length === 1) out.add(run); for (let i = 0; i + 1 < run.length; i++) out.add(run.slice(i, i + 2)); }
  return out;
}
/** The share of the smaller bigram set found in the other (0 when either is empty). */
export function v2CjkOverlap(a: string, b: string): { share: number; min: number } {
  const x = v2CjkBigrams(a); const y = v2CjkBigrams(b);
  const [small, big] = x.size <= y.size ? [x, y] : [y, x];
  if (!small.size) return { share: 0, min: 0 };
  return { share: [...small].filter((g) => big.has(g)).length / small.size, min: small.size };
}
/** A sentence in Latin script with no Japanese in it (the language taught, in a bilingual reply). */
export const v2LatinOnly = (t: string): boolean => /[A-Za-z]/.test(t) && !V2_CJK.test(t);

/** The same question asked again. Latin script: two thirds of the shorter's content words alike, and at least two content words on each
 *  side (fix round 1, M2: with fewer there is too little to compare, and they count as different questions: the count fails towards setting
 *  the level, not towards never setting it; fix round 2, M3: unless they are identical once normalised). Japanese only: half the smaller bigram set shared, at least three bigrams each. A Latin and a
 *  Japanese-only question: different. */
export function v2SameQuestion(a: string, b: string): boolean {
  // Fix round 2 (M3): identical questions (normalised) are the same, however short.
  if (v2NormalQuestion(a) && v2NormalQuestion(a) === v2NormalQuestion(b)) return true;
  const la = v2LatinOnly(a); const lb = v2LatinOnly(b);
  if (la && lb) {
    const x = v2ContentWords(a); const y = v2ContentWords(b);
    if (x.length < 2 || y.length < 2) return false;
    const [short, long] = x.length <= y.length ? [x, y] : [y, x];
    return v2WordsShared(short, long) / short.length >= 2 / 3;
  }
  if (!la && !lb && V2_CJK.test(a) && V2_CJK.test(b)) { const o = v2CjkOverlap(a, b); return o.min >= 3 && o.share >= 0.5; }
  return false;
}
