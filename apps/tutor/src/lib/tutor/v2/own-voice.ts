/**
 * Tutor brain v2 — is this recognised speech the tutor's own voice?
 *
 * The microphone hears the tutor through the speakers, so while it is speaking
 * the recogniser can hand back the tutor's own sentences. Those are not the
 * student. A transcript counts as the tutor's own when most of its words, in
 * order, sit inside what the tutor has just said. Short replies ("yes", "ok")
 * are never treated as an echo: a student's "yes" over the tutor is real.
 */
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

export function isOwnVoice(transcript: string, recentlySpoken: string[], minWords = 4, share = 0.7): boolean {
  const heard = words(transcript);
  if (heard.length < minWords) return false;
  const said = words(recentlySpoken.join(' '));
  if (!said.length) return false;
  // Longest run of the transcript's words found in order within what was said.
  let best = 0;
  for (let start = 0; start < said.length; start++) {
    let i = 0; let j = start; let hit = 0;
    while (i < heard.length && j < said.length && j - start < heard.length * 2) {
      if (heard[i] === said[j]) { hit += 1; i += 1; j += 1; } else j += 1;
    }
    if (hit > best) best = hit;
  }
  return best / heard.length >= share;
}
