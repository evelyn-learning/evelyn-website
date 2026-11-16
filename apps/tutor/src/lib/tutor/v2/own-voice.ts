/**
 * Tutor brain v2 — is this recognised speech the tutor's own voice?
 *
 * The microphone hears the tutor through the speakers, so while it is speaking
 * the recogniser can hand back the tutor's own sentences. Those are not the
 * student. A transcript counts as the tutor's own when most of its words, in
 * order, sit inside what the tutor has just said. Short replies ("yes", "ok")
 * are never treated as an echo: a student's "yes" over the tutor is real.
 *
 * Japanese and Chinese are written without spaces, so split on spaces a whole
 * Japanese sentence was one "word", and the tutor's own Japanese was never
 * recognised as echo. Each character of those scripts is a word of its own
 * here, and counts as half a word towards the minimum: 「はい、そうです」 is
 * too short to be taken for an echo, as "yes it is" is.
 */
const CJK_CHAR = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC]/u;
const SPLIT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC]|[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC]+/gu;
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).flatMap((w) => (CJK_CHAR.test(w) ? w.match(SPLIT) ?? [] : [w]));
const weight = (ws: string[]) => ws.reduce((n, w) => n + (CJK_CHAR.test(w) ? 0.5 : 1), 0);

export function isOwnVoice(transcript: string, recentlySpoken: string[], minWords = 4, share = 0.7): boolean {
  const heard = words(transcript);
  if (!heard.length || weight(heard) < minWords) return false;
  const said = words(recentlySpoken.join(' '));
  if (!said.length) return false;
  // Longest run of the transcript's words found in order within what was said.
  let best = 0;
  for (let start = 0; start < said.length; start++) {
    let i = 0; let j = start; let hit = 0;
    while (i < heard.length && j < said.length && j - start < heard.length * 2) {
      if (heard[i] === said[j]) { hit += 1; i += 1; j += 1; continue; }
      // A word the tutor did not say within reach is the recogniser's slip (三 heard as 3): it is passed over,
      // where before it ran past everything the tutor said after it.
      const k = said.indexOf(heard[i], j);
      if (k < 0 || k - start >= heard.length * 2) i += 1; else j = k;
    }
    if (hit > best) best = hit;
  }
  return best / heard.length >= share;
}
