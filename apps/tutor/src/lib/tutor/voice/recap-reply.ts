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

/** Spec-listed declines whose decline word is NOT the first token, so the
 *  anchored DECLINE_RE above can never see them: "go straight in", "I'd rather
 *  go straight in", "let's just start", "let's just get going".
 *
 *  EXACTLY those four shapes and no synonyms. A wider alternation
 *  (begin|get started|dive in, or a bare `let's just start` with any tail)
 *  turned "yeah, let's just start the recap" — an ACCEPT — into a decline,
 *  because decline is tested first. The trailing `(?![\w])` boundary plus the
 *  absence of a tail-swallowing suffix is what keeps the phrase a whole reply
 *  rather than a prefix of some other request. */
const DECLINE_UNANCHORED_RE =
  /(?:go\s+|i'?d\s+rather\s+(?:go\s+)?)?\bstraight\s+in\s*$|\blet'?s\s+(?:just\s+)?(?:start|get\s+going)\s*$/i;

/** The same shapes with something AFTER them. "let's just start" declines the
 *  detour; "let's just start the recap" asks for it — the phrase alone does not
 *  decide, and decline is tested before accept, so without this the tail would
 *  be swallowed and the reply mis-read as a decline (or, via the ≤5-word accept
 *  remainder, as a bare accept). An ambiguous reply is 'unclear' by design: the
 *  brain re-asks rather than guessing which way the student meant it. */
const AMBIGUOUS_START_RE = /\blet'?s\s+(?:just\s+)?(?:start|get\s+going)\b|\bstraight\s+in\b/i;

/** "why not" is an idiomatic ACCEPT, but its "why" trips UNCLEAR_MARKERS when
 *  it lands in an accept token's remainder ("sure why not"). Exempted only
 *  inside the ≤5-word, marker-free remainder test below — never as a widening
 *  of the accept anchor — so "sure, why not after this problem?" stays
 *  unclear on its length/markers exactly as before. */
const WHY_NOT_IDIOM_RE = /\bwhy\s+not\b/i;

// Markers indicating unclear (deferral, contrast, question, number)
const UNCLEAR_MARKERS = /\b(?:but|after|later|first|wait|what|why|how|when)\b|\?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|hundred|thousand)\b|\d/i;

export function classifyRecapReply(text: string): RecapReply {
  let t = text.trim().toLowerCase();

  // Strip leading filler repeatedly
  while (LEADING_FILLER.test(t)) {
    t = t.replace(LEADING_FILLER, '').trim();
  }

  // Clean up leading punctuation, and TRAILING punctuation too: the four
  // end-anchored decline shapes below must still match "let's just start." /
  // "go straight in!" — with the period left in place they fell through to
  // AMBIGUOUS_START_RE and read as 'unclear' (scoped re-review of caefdf04).
  t = t.replace(/^[\s,.!-]+/, '').replace(/[\s,.!?-]+$/, '').trim();

  if (!t) return 'unclear';

  // Check decline first (negation takes precedence)
  if (DECLINE_RE.test(t) || DECLINE_UNANCHORED_RE.test(t)) return 'decline';

  // …then the same shapes carrying a tail: ambiguous, never a decline.
  if (AMBIGUOUS_START_RE.test(t)) return 'unclear';

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

    // "sure why not" — drop the idiom before the marker test, but only when
    // the WHOLE reply is short: the length gate below still runs on the
    // untouched remainder, so a long why-not reply cannot sneak through.
    const markerText = words <= 5 && WHY_NOT_IDIOM_RE.test(cleanRemainder)
      ? cleanRemainder.replace(WHY_NOT_IDIOM_RE, ' ').trim()
      : cleanRemainder;

    // Accept only if ≤ 5 words AND no unclear markers
    if (words <= 5 && !UNCLEAR_MARKERS.test(markerText)) {
      return 'accept';
    }

    return 'unclear';
  }

  return 'unclear';
}
