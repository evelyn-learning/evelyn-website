/**
 * Did the tutor's spoken turn actually VOICE the recap offer the
 * `<recap_offer>` block asked for?
 *
 * Live probes (2026-09-05, both runs): the block rode the turn, the brain
 * answered the student's "I'm stuck" with a sub-question and never made the
 * offer — and the student's NEXT utterance was then consumed as the reply to
 * an offer nobody heard. The orchestrator uses this predicate after the turn:
 * unvoiced ⇒ the offer is not pending (the next utterance is a normal turn)
 * and it is re-armed for a later turn, a bounded number of times.
 *
 * Generic on purpose: an offer is (a) a recap-shaped verb/noun and (b) an
 * invitation — a question mark or an asking phrase. No subject terms.
 */
const RECAP_SHAPE_RE = /\b(?:recap|re-cap|refresher|revisit|review|rewind|step back|go (?:back )?over|run (?:back )?through|walk (?:back )?through|quick (?:re)?run|circle back|back up)\b/i;
const INVITATION_RE = /\?|\b(?:want|would you like|would that help|shall we|how about|do you want|up for|fancy|ok(?:ay)? if|sound good|good idea|worth it|yes or no)\b/i;

export function isRecapOfferVoiced(tutorText: string): boolean {
  const t = (tutorText || '').trim();
  if (!t) return false;
  return RECAP_SHAPE_RE.test(t) && INVITATION_RE.test(t);
}

/** How many turns an unvoiced offer is re-armed before it is dropped. */
export const RECAP_OFFER_MAX_ATTEMPTS = 3;
