/** Spec §B.4 — deterministic yes/no/unclear for a recap OFFER. Decline is
 *  tested first so "no, I'm good" never reads as accept. After accept match,
 *  validate remainder (≤5 words, no deferral/contrast/question/digit). Pure. */
export type RecapReply = 'accept' | 'decline' | 'unclear';

// Strip leading filler only (um, uh, er, hmm, like, well, so)
const LEADING_FILLER = /^(?:um+|uh+|er+|hmm+|like|well|so)\b[,\s]*/i;

// Decline: negations, deferrals, neutral, negated accepts
const DECLINE_RE = /^(?:no+|nah|nope|not (?:now|right now|today)|(?:maybe )?later|skip(?: it)?|let'?s (?:keep going|just continue|continue|move on)|move on|i'?m (?:fine|good|ok|okay|alright)|i get it(?: now)?|straight in|no thanks?|we'?re good|i don'?t think so|not really|no need|i'?m (?:ok|okay|fine) without)\b/i;

// Accept patterns (will validate remainder separately)
const ACCEPT_RE = /^(?:sure|yes+|yeah|yep|yup|ok|okay|alright|go ahead|please|why not|sounds good|let'?s do (?:it|that)|that would help|a quick one|quick one|yes please|do it|i'?d like that)\b/i;

// Markers indicating unclear (deferral, contrast, question, number)
const UNCLEAR_MARKERS = /\b(?:but|after|later|first|wait|what|why|how|when)\b|\?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|hundred|thousand)\b|\d/i;

export function classifyRecapReply(text: string): RecapReply {
  let t = text.trim().toLowerCase();

  // Strip leading filler repeatedly
  while (LEADING_FILLER.test(t)) {
    t = t.replace(LEADING_FILLER, '').trim();
  }

  // Clean up leading punctuation
  t = t.replace(/^[\s,.!-]+/, '').trim();

  if (!t) return 'unclear';

  // Check decline first (negation takes precedence)
  if (DECLINE_RE.test(t)) return 'decline';

  // Check accept, validating remainder
  const acceptMatch = t.match(ACCEPT_RE);
  if (acceptMatch) {
    const token = acceptMatch[0];
    const remainder = t.slice(token.length).trim();

    // No remainder → accept
    if (remainder === '') return 'accept';

    // Remove leading punctuation from remainder
    const cleanRemainder = remainder.replace(/^[,\s]+/, '').trim();

    // Empty after cleaning → accept
    if (cleanRemainder === '') return 'accept';

    // Count words
    const words = cleanRemainder.split(/\s+/).length;

    // Accept only if ≤ 5 words AND no unclear markers
    if (words <= 5 && !UNCLEAR_MARKERS.test(cleanRemainder)) {
      return 'accept';
    }

    return 'unclear';
  }

  return 'unclear';
}
