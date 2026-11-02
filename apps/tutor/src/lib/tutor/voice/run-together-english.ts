/**
 * Split English that the STT ran together back into words.
 *
 * GDI starter session embed-1792185403054 (2026-10-16): in a bilingual
 * (Japanese + English) session Cartesia ink-2 returns the learner's English
 * with no spaces — "Haveyouevergotokaraoke", "Iwenttoplaygolfyesterday",
 * "Ihaven ' thaveyou". The tutor read "goto" as "got", told the learner six
 * times that a word they never said was wrong, and the answer checks graded
 * the same unreadable string. Every bilingual exercise had this shape.
 *
 * A Latin run of 6+ letters that is not itself a known word is split by the
 * cheapest sequence of known words (word cost grows with frequency rank —
 * the classic "word ninja" segmentation). A run that cannot be covered by
 * known words except for one short unknown piece keeps that piece as is
 * ("IwenttoGiffullastweek" → "I went to Giffull last week" style), so a
 * learner's misspoken word is never silently corrected into a real one.
 */
import { ENGLISH_WORDS_BY_FREQUENCY } from './english-word-freq';

let costs: Map<string, number> | null = null;
let maxLen = 0;

function wordCosts(): Map<string, number> {
  if (costs) return costs;
  const words = ENGLISH_WORDS_BY_FREQUENCY.split(' ');
  const logN = Math.log(words.length);
  costs = new Map();
  words.forEach((w, i) => {
    costs!.set(w, Math.log((i + 1) * logN));
    if (w.length > maxLen) maxLen = w.length;
  });
  return costs;
}

// An unknown piece costs well above any known word and grows slowly with
// length, so a short one absorbs its neighbours ("Hokkaido" stays whole instead of "Hokka I do"), and a
// lone "a"/"I" inside a run pays extra ("Ihaveited" → "I have ited", not
// "I have I ted").
const SHORT_WORDS = new Set([
  'a', 'i', 'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 'is', 'it',
  'me', 'my', 'no', 'of', 'oh', 'ok', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
]);
const UNKNOWN_BASE = 20;
const UNKNOWN_PER_CHAR = 3;
const MID_SINGLE_LETTER_PENALTY = 20;

/**
 * Task 30 fix round 3 R2-3 (run r2, 489 s: the typed "exhibitions" became
 * "exhibit ions"): a run that is a word of the list (english-word-freq.ts,
 * ENGLISH_WORDS_BY_FREQUENCY) or a regular inflection of one (-s, -es, -ies
 * for -y, -ed, -d, -ing, -ly, -er, -ers) is a real word and is never split;
 * nor is a run whose best split has a piece that is only a word ending
 * ("ions", "ing", "ment" … — SUFFIX_FRAGMENTS): the list (15 000 words,
 * generated — not edited here) lacks "exhibition(s)".
 */
export function isKnownWordForm(word: string): boolean {
  const c = wordCosts();
  const w = (word ?? '').toLowerCase();
  if (!w) return false;
  if (c.has(w)) return true;
  const stems: string[] = [];
  for (const suf of ['s', 'es', 'ed', 'd', 'ing', 'ly', 'er', 'ers']) {
    if (w.length > suf.length + 2 && w.endsWith(suf)) stems.push(w.slice(0, -suf.length));
  }
  if (w.endsWith('ies') && w.length > 4) stems.push(`${w.slice(0, -3)}y`);
  if (w.endsWith('ing') && w.length > 5) stems.push(`${w.slice(0, -3)}e`);
  if (w.endsWith('ed') && w.length > 4) stems.push(`${w.slice(0, -2)}e`.replace(/ee$/, 'e'));
  return stems.some((st) => c.has(st));
}

const SUFFIX_FRAGMENTS = new Set(['ion', 'ions', 'tion', 'tions', 'sion', 'sions', 'ing', 'ings', 'ed', 'ly', 'ness', 'ment', 'ments', 'er', 'ers', 'es', 'ies', 'able', 'ible', 'ity', 'ities', 'al', 'ally', 'ive', 'ize', 'ise', 'ized', 'ised', 'ful', 'less']);
function splitRun(run: string): string | null {
  const c = wordCosts();
  const lower = run.toLowerCase();
  if (c.has(lower) || isKnownWordForm(lower)) return null;
  const n = lower.length;
  const best: number[] = new Array(n + 1).fill(Infinity);
  const back: Array<{ from: number; known: boolean }> = new Array(n + 1);
  best[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = Math.max(0, i - Math.max(maxLen, 12)); j < i; j++) {
      if (best[j] === Infinity) continue;
      const piece = lower.slice(j, i);
      let known = c.get(piece);
      // A 1–2 letter piece must be a real short word ("H ok kai do" for
      // Hokkaido is not English); an unknown piece must be 3+ letters.
      if (known !== undefined && piece.length <= 2 && !SHORT_WORDS.has(piece)) known = undefined;
      if (known === undefined && piece.length < 3) continue;
      const cost = known === undefined
        ? UNKNOWN_BASE + UNKNOWN_PER_CHAR * piece.length
        : known + (piece.length === 1 && j > 0 ? MID_SINGLE_LETTER_PENALTY : 0);
      if (best[j] + cost < best[i]) {
        best[i] = best[j] + cost;
        back[i] = { from: j, known: known !== undefined };
      }
    }
  }
  const pieces: Array<{ text: string; known: boolean }> = [];
  for (let i = n; i > 0; i = back[i].from) {
    pieces.unshift({ text: run.slice(back[i].from, i), known: back[i].known });
  }
  if (pieces.length < 2) return null;
  // Fix round 3 (R2-3): a piece that is only a word ending ("exhibit" +
  // "ions") means the run is ONE word the list lacks — never split it.
  if (pieces.some((p, k) => k > 0 && SUFFIX_FRAGMENTS.has(p.text.toLowerCase()))) return null;
  // More than one unknown piece means the run is not English we can read —
  // leave it exactly as the STT gave it.
  if (pieces.filter((p) => !p.known).length > 1) return null;
  return pieces
    .map((p) => (p.known && p.text.toLowerCase() === 'i' ? 'I' : p.known && /^i'/i.test(p.text) ? `I${p.text.slice(1).toLowerCase()}` : p.text))
    .join(' ');
}

/** The transcript with run-together English split into words. Text with no
 *  such run comes back unchanged (same string). */
export function splitRunTogetherEnglish(text: string): string {
  if (typeof text !== 'string' || !text) return text;
  // STT spaces apostrophes apart: "Ihaven ' thaveyou" → "Ihaven'thaveyou".
  const joined = text.replace(/([A-Za-z])\s+'\s+([A-Za-z])/g, "$1'$2");
  const out = joined.replace(/[A-Za-z']{6,}/g, (run) => splitRun(run) ?? run);
  return out === joined && joined === text ? text : out;
}

/**
 * Task 30 fix round 3 R2-3 (run r2, 489 s: a typed line produced TWO student
 * entries, the second the split text): a rewrite of the student's transcript
 * (run-together split, digit words) REPLACES the last student entry when it
 * holds the original text; null when there is no such entry (the caller's
 * normal append then adds the rewritten text once). Pure.
 */
export function replaceLastStudentEntry<T extends { role: string; text: string }>(entries: readonly T[], from: string, to: string): T[] | null {
  const last = entries[entries.length - 1];
  if (!last || last.role !== 'student' || last.text !== from || from === to) return null;
  return [...entries.slice(0, -1), { ...last, text: to }];
}
