/**
 * Incomplete-utterance hold (R34) — Ink2's semantic endpointing sometimes
 * finalizes a turn on a mid-sentence hesitation (live: "Could you give me a",
 * session portal-d9bacb7e). turn.end is irrevocable upstream, so the client
 * holds a transcript that ENDS ON A DANGLING FUNCTION WORD for HOLD_MS,
 * merging it with the student's resumed speech instead of dispatching a
 * fragment the brain will answer wrongly.
 *
 * Conservative by construction: contains only words that are rare sentence-final
 * in complete STATEMENTS (articles, subjunct prepositions, linking auxiliaries).
 * Questions are EXEMPTED wholesale: English strands prepositions constantly at
 * question end ("what does it converge to?"). Tradeoff: a rare complete statement
 * ending in a kept word costs one HOLD_MS of latency, never data loss.
 */
export const HOLD_MS = 1400;

const DANGLING_WORDS = new Set([
  // articles / determiners (articles almost never end statements)
  'a', 'an', 'the', 'my', 'your', 'their', 'our',
  // prepositions that require objects (cannot end statements)
  'to', 'of', 'into',
  // conjunctions / trail-offs (never end well-formed statements)
  'and', 'or', 'but', 'so', 'because', 'if', 'when', 'while', 'than',
  // auxiliaries that never end a real turn
  'is', 'are', 'was', 'were', 'be', 'been',
]);

export function endsMidThought(transcript: string): boolean {
  const t = transcript.trim();
  if (!t || t.startsWith('[')) return false;
  // Questions are exempt (English routinely strands prepositions at question end)
  if (t.endsWith('?')) return false;
  const words = t.toLowerCase().replace(/[.,!?;:]+$/g, '').split(/\s+/).filter(Boolean);
  if (words.length < 2) return false; // a bare "a"/"the" is noise, not a cut sentence
  return DANGLING_WORDS.has(words[words.length - 1]);
}

export function mergeHeldTranscript(held: string, next: string): string {
  const left = held.trim().replace(/[.]+$/g, '').trim();
  const right = next.trim();
  return `${left} ${right}`.trim();
}
