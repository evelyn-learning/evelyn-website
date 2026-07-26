/**
 * Incomplete-utterance hold (R34) — Ink2's semantic endpointing sometimes
 * finalizes a turn on a mid-sentence hesitation (live: "Could you give me a",
 * session portal-d9bacb7e). turn.end is irrevocable upstream, so the client
 * holds a transcript that ENDS ON A DANGLING FUNCTION WORD for HOLD_MS,
 * merging it with the student's resumed speech instead of dispatching a
 * fragment the brain will answer wrongly.
 *
 * Conservative by construction: only unambiguous sentence-medial words hold.
 * Words that legitimately end turns ("what", "why", "more") are excluded.
 */
export const HOLD_MS = 1400;

const DANGLING_WORDS = new Set([
  // articles / determiners
  'a', 'an', 'the', 'my', 'your', 'his', 'her', 'its', 'their', 'our', 'this', 'that', 'these', 'those', 'some', 'any',
  // prepositions
  'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'into', 'about', 'over', 'under', 'between',
  // conjunctions / trail-offs
  'and', 'or', 'but', 'so', 'because', 'if', 'when', 'while', 'than',
  // auxiliaries that never end a real turn
  'is', 'are', 'was', 'were', 'be', 'been',
]);

export function endsMidThought(transcript: string): boolean {
  const t = transcript.trim();
  if (!t || t.startsWith('[')) return false;
  const words = t.toLowerCase().replace(/[.,!?;:]+$/g, '').split(/\s+/).filter(Boolean);
  if (words.length < 2) return false; // a bare "a"/"the" is noise, not a cut sentence
  return DANGLING_WORDS.has(words[words.length - 1]);
}

export function mergeHeldTranscript(held: string, next: string): string {
  const left = held.trim().replace(/[.]+$/g, '').trim();
  const right = next.trim();
  return `${left} ${right}`.trim();
}
