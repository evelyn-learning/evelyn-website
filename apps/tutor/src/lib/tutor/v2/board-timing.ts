/**
 * Tutor brain v2 — when a board item appears in a spoken reply.
 *
 * A reply is written in a second or two and spoken over twenty. Each board call can carry `say_with`,
 * the opening words of the sentence it belongs with (tools.ts); this finds that sentence among the
 * ones sent to the voice, so the client can hold the item until it starts playing.
 */
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

/** Index of the sentence the anchor points at, or -1 when there is no anchor or nothing matches.
 *  The anchor may run across a sentence break ("Good. Now a trap."): the item goes with the sentence
 *  its last matched word is in. */
export function anchorSentenceIndex(sayWith: string | undefined, sentences: string[]): number {
  const want = norm(sayWith ?? '');
  if (!want.length) return -1;
  const words: string[] = []; const owner: number[] = [];
  sentences.forEach((s, i) => { for (const w of norm(s)) { words.push(w); owner.push(i); } });
  // The model copies the opening words, sometimes loosely: try five words, then fewer.
  for (const n of [5, 4, 3, 2]) {
    if (want.length < n) continue;
    for (let at = 0; at + n <= words.length; at++) {
      let k = 0;
      while (k < n && words[at + k] === want[k]) k++;
      if (k === n) return owner[at + n - 1];
    }
  }
  return -1;
}

const STOP = new Set(['the', 'a', 'an', 'is', 'it', 'its', 'this', 'that', 'here', 'heres', 'now', 'so', 'and', 'of', 'to', 'in', 'on', 'for', 'one', 'you', 'your', 'lets', 'let', 'me', 'we', 'yes', 'right', 'good', 'ok', 'okay', 's', 'with', 'at', 'be', 'are']);

/** Where an anchored item goes once the whole reply is known. The model sometimes describes its sentence
 *  instead of quoting it ("Here is the rule." for "Now let's see whether L'Hôpital's rule gets there"):
 *  then the sentence sharing most of the anchor's content words, and failing that the last sentence —
 *  an item the tutor meant for later should not appear first. */
export function anchorSentenceFinal(sayWith: string | undefined, sentences: string[]): number {
  const exact = anchorSentenceIndex(sayWith, sentences);
  if (exact >= 0 || !sentences.length) return exact;
  const want = norm(sayWith ?? '').filter((w) => !STOP.has(w));
  if (!want.length) return -1;
  let best = -1; let bestHits = 0;
  sentences.forEach((s, i) => { const words = new Set(norm(s)); const hits = want.filter((w) => words.has(w)).length; if (hits > bestHits) { best = i; bestHits = hits; } });
  return best >= 0 ? best : sentences.length - 1;
}
