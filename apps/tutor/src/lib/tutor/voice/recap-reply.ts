/** Spec §B.4 — deterministic yes/no/unclear for a recap OFFER. Decline is
 *  tested first so "no, I'm good" never reads as accept. Pure. */
export type RecapReply = 'accept' | 'decline' | 'unclear';
const FILLER = /\b(?:um+|uh+|er+|hmm+|like|well|so)\b[,\s]*/gi;
const DECLINE_RE = /^(?:no+|nah|nope|not (?:now|right now|today)|(?:maybe )?later|skip(?: it)?|let'?s (?:keep going|just continue|continue|move on)|move on|i'?m (?:fine|good|ok|okay)|i get it(?: now)?|straight in|no thanks?|i'?m alright|we'?re good)\b/i;
const ACCEPT_RE = /^(?:sure|yes+|yeah|yep|yup|ok|okay|alright|go ahead|please|why not|sounds good|let'?s do (?:it|that)|that would help|a quick one|quick one|yes please|do it|i'?d like that)\b/i;
export function classifyRecapReply(text: string): RecapReply {
  const t = text.trim().toLowerCase().replace(FILLER, '').replace(/^[\s,.!-]+/, '').trim();
  if (!t) return 'unclear';
  if (DECLINE_RE.test(t)) return 'decline';
  if (ACCEPT_RE.test(t)) return 'accept';
  return 'unclear';
}
