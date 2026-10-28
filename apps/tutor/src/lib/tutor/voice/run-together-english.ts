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

function splitRun(run: string): string | null {
  const c = wordCosts();
  const lower = run.toLowerCase();
  if (c.has(lower)) return null;
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
