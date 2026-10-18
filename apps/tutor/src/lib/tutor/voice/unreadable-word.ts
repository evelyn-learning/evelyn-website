/**
 * Unreadable word in the student's English — pure.
 *
 * GDI session embed-1792338502233 (2026-10-18): the recogniser wrote
 * "I went thef last week ." and the tutor said 「I went to Gifu last week. —
 * 完璧ですね」, crediting a place name it never heard. The judge flagged it as
 * false praise afterwards, but the correction note's "if on re-checking it was
 * correct, continue" exit let it stand. The language clause already says to
 * ask for a doubtful word again; the model needs to be told WHICH word, in
 * the same turn.
 *
 * A Latin token of three or more letters is unreadable when it is not an
 * English word (the 15K-word frequency list), not a word the tutor has used
 * recently or the lesson plan contains (names, places), and not within one or
 * two edits of any of those context words (STT sound-alikes — "reast" for
 * "last", "haven" for "haven't" — are credited by the clause, not re-asked).
 * Short tokens are skipped: a two-letter garble is noise, not a lost word.
 */
import { ENGLISH_WORDS_BY_FREQUENCY } from './english-word-freq';

let dictionary: Set<string> | null = null;
export function englishDictionary(): Set<string> {
  return (dictionary ??= new Set(ENGLISH_WORDS_BY_FREQUENCY.split(' ')));
}

const LATIN_TOKEN_RE = /[A-Za-z][A-Za-z']*/g;

/** Lower-cased Latin tokens (≥2 chars) of any text — for context sets. */
export function latinWords(text: string): string[] {
  return (text.match(LATIN_TOKEN_RE) ?? []).map((w) => w.toLowerCase()).filter((w) => w.length >= 2);
}

function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array<number>(b.length + 1);
  const cur = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/** Words in the student's text that cannot be read as English or as anything
 *  in the lesson's context. `context` = words the tutor has said recently plus
 *  the lesson plan's words. */
export function findUnreadableWords(studentText: string, context: Iterable<string>): string[] {
  const dict = englishDictionary();
  const ctx = new Set<string>();
  for (const w of context) ctx.add(w.toLowerCase());
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of studentText.match(LATIN_TOKEN_RE) ?? []) {
    const w = raw.toLowerCase().replace(/^'+|'+$/g, '');
    if (w.length < 3 || seen.has(w)) continue;
    seen.add(w);
    if (dict.has(w) || ctx.has(w)) continue;
    const tolerance = w.length <= 4 ? 1 : 2;
    let soundAlike = false;
    for (const c of ctx) {
      if (editDistance(w, c, tolerance) <= tolerance) { soundAlike = true; break; }
    }
    if (!soundAlike) out.push(raw);
  }
  return out;
}

export function unreadableWordNote(words: string[]): string {
  const quoted = words.slice(0, 3).map((w) => `"${w}"`).join(', ');
  return (
    `[runtime note — not from the student] In the student's last turn the transcript has ${quoted}, ` +
    `which is not a readable English word and matches nothing in this lesson. Speech recognition lost it. ` +
    `Do not credit, correct, or guess that word — do not turn it into a place or a thing they may not have said. ` +
    `Say the sentence as you heard it, with that word left out, and ask the student to say just that word once more. ` +
    `Apply this silently; never mention this note.`
  );
}
