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
 *  in the lesson's context. `context` = every Latin word the student and the
 *  tutor have used this session plus the lesson plan's words (2026-10-18,
 *  embed-1792350642171: a four-turn window missed "Nagoya" said twelve turns
 *  earlier). `skip` = words already asked for once this session — one note
 *  per word.
 *
 *  Proper nouns: the recogniser writes a name with a capital letter, and it
 *  runs a short word into it ("toNagoya", "inNagoya"). A capitalised token
 *  that is not sentence-initial is a name and is never flagged; a run-together
 *  of a short known word and a capitalised rest is split and the rest is a
 *  name. */
export function findUnreadableWords(studentText: string, context: Iterable<string>, opts?: { skip?: Iterable<string> }): string[] {
  const dict = englishDictionary();
  const ctx = new Set<string>();
  for (const w of context) ctx.add(w.toLowerCase());
  const skip = new Set<string>();
  for (const w of opts?.skip ?? []) skip.add(w.toLowerCase());
  const out: string[] = [];
  const seen = new Set<string>();
  const text = studentText ?? '';
  const re = new RegExp(LATIN_TOKEN_RE.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const raw = m[0];
    const sentenceInitial = /(?:^|[.!?。！？「」『』"“”]\s*)$/.test(text.slice(0, m.index));
    for (const piece of splitProperNoun(raw, sentenceInitial, dict)) {
      const w = piece.toLowerCase().replace(/^'+|'+$/g, '');
      if (w.length < 3 || seen.has(w)) continue;
      seen.add(w);
      if (skip.has(w) || dict.has(w) || ctx.has(w)) continue;
      // 2026-10-18 (embed-1792346446334): "toNagoya" — a run-together the
      // splitter could not break because the proper noun is not in its list.
      // A token that CONTAINS a context word (≥4 letters) or a longer
      // dictionary word (≥5) is readable, not lost.
      if (containsKnownWord(w, ctx, dict)) continue;
      const tolerance = w.length <= 4 ? 1 : 2;
      let soundAlike = false;
      for (const c of ctx) {
        if (editDistance(w, c, tolerance) <= tolerance) { soundAlike = true; break; }
      }
      if (!soundAlike) out.push(piece);
    }
  }
  return out;
}

/** "toNagoya" → ["to"] (Nagoya is a name: dropped from the check);
 *  "Nagoya" mid-sentence → [] (a name); "Thef" at a sentence start → ["Thef"]
 *  (checked lower-cased as usual); "thef" → ["thef"]. */
function splitProperNoun(raw: string, sentenceInitial: boolean, dict: Set<string>): string[] {
  const camel = /^([A-Za-z]*[a-z])([A-Z][a-z']+)$/.exec(raw);
  if (camel) {
    const [, head] = camel;
    // "toNagoya" → ["to"]; "IwenttoTerimachi" → ["Iwentto"] (checked as a
    // run-together of known words); the capitalised rest is a name.
    return [head];
  }
  if (/^[A-Z][a-z']+$/.test(raw) && !sentenceInitial) return [];
  return [raw];
}

function containsKnownWord(w: string, ctx: Set<string>, dict: Set<string>): boolean {
  for (const c of ctx) if (c.length >= 4 && w.includes(c)) return true;
  for (let start = 0; start < w.length - 4; start++) {
    for (let end = w.length; end - start >= 5; end--) {
      if (dict.has(w.slice(start, end))) return true;
    }
  }
  return false;
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

/**
 * 2026-10-18 (embed-1792361732296): the student said "I went to Torimachi
 * last month" (a made-up town), the recogniser wrote "Terimachi", and the
 * tutor taught 「寺町」 — it replaced an unknown name with a known place. A
 * capitalised token (or the capitalised rest of a run-together) that is in
 * neither the dictionary nor anything said or planned this session is an
 * UNKNOWN NAME: not asked for again (it is probably exactly what they said),
 * but the model is told to keep it as spelled and never swap it for a
 * similar-sounding place. One note per name per session (`skip`).
 */
export function findUnknownNames(studentText: string, context: Iterable<string>, opts?: { skip?: Iterable<string> }): string[] {
  const dict = englishDictionary();
  const ctx = new Set<string>();
  for (const w of context) ctx.add(w.toLowerCase());
  const skip = new Set<string>();
  for (const w of opts?.skip ?? []) skip.add(w.toLowerCase());
  const out: string[] = [];
  const seen = new Set<string>();
  const text = studentText ?? '';
  const re = new RegExp(LATIN_TOKEN_RE.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const raw = m[0];
    const sentenceInitial = /(?:^|[.!?。！？「」『』"“”]\s*)$/.test(text.slice(0, m.index));
    const camel = /^(?:[A-Za-z]*[a-z])([A-Z][a-z']+)$/.exec(raw);
    const name = camel ? camel[1] : (/^[A-Z][a-z']+$/.test(raw) && !sentenceInitial ? raw : null);
    if (!name) continue;
    const w = name.toLowerCase();
    if (w.length < 4 || seen.has(w)) continue;
    seen.add(w);
    if (skip.has(w) || dict.has(w) || ctx.has(w)) continue;
    let near = false;
    for (const c of ctx) { if (c.length >= 4 && editDistance(w, c, 1) <= 1) { near = true; break; } }
    if (near) continue;
    out.push(name);
  }
  return out;
}

export function unknownNameNote(names: string[]): string {
  const quoted = names.slice(0, 3).map((n) => `"${n}"`).join(', ');
  return (
    `[runtime note — not from the student] The student's last turn contains the name ${quoted}, which is in neither the lesson nor anything said so far. ` +
    `It is a place or a person the student knows and you do not. Use it EXACTLY as spelled, in Latin letters, every time you refer to it: ` +
    `never replace it with a similar-sounding place you know, never write it in kanji or katakana, never explain what it is. ` +
    `If you need to be sure of it, ask once — 「${names[0]} ですか？」 — and accept their answer. Apply this silently; never mention this note.`
  );
}
