/**
 * Does this spoken sentence tell the student that practice/homework is
 * waiting for them somewhere?
 *
 * Live 2026-09-05 (portal-51b667f1): with no practice locator in context the
 * prompt says "do not mention homework at all", yet the goodbye turn said
 * "Your practice for that stratified-design write-up is waiting in your
 * practice area" — and no record existed behind it. The orchestrator drops
 * such sentences when there is no locator (nothing was, or could be,
 * announced). Deliberately narrow: ordinary in-session "let's practice this"
 * and "try a practice problem" must survive.
 */
const NOUN = String.raw`(?:practice|homework|assignments?|exercises?|problems?|questions?|write-?ups?)`;
const LOCATION_VERB = String.raw`(?:waiting|assigned|queued|lined up|saved|posted)`;
const AREA = String.raw`(?:area|tab|section|page|set|queue|list|dashboard)`;

const NOUN_THEN_VERB_RE = new RegExp(String.raw`\b${NOUN}\b[^.!?]{0,80}?\b${LOCATION_VERB}\b`, 'i');
const VERB_THEN_NOUN_RE = new RegExp(String.raw`\b${LOCATION_VERB}\b[^.!?]{0,60}?\b${NOUN}\b`, 'i');
const AREA_RE = new RegExp(String.raw`\b(?:your|the) (?:practice|homework|assignments?) ${AREA}\b`, 'i');
const FOR_HOMEWORK_RE = /\b(?:for|as) homework\b|\bhomework (?:for|before) (?:next|our next|tonight|tomorrow)\b/i;
// Live check 6 (2026-09-07, portal-63ee9f2c): "go crush that practice set
// whenever you're ready" — nothing assigned, no location verb, no "your
// practice area", so nothing above matched. A practice NOUN PHRASE plus a
// DEFERRAL ("whenever you're ready", "later", "tonight", "before next time",
// "on your own") is a pointer to work outside this session; in-session
// "let's do that practice set now" carries no deferral and survives.
const PRACTICE_SET_RE = /\b(?:that|this|the|your|those|these) (?:practice|homework) (?:set|problems?|questions?|exercises?)\b/i;
const DEFERRAL_RE = /\b(?:whenever|when|once) you(?:'re| are|'ve| have| get| feel)?\b|\blater\b|\btonight\b|\bbefore (?:our |the )?next\b|\bafter (?:class|this|today|school)\b|\bat home\b|\bon your own\b|\bthis week\b/i;

export function isHomeworkAnnouncement(sentence: string): boolean {
  const s = (sentence || '').trim();
  if (!s) return false;
  return NOUN_THEN_VERB_RE.test(s) || VERB_THEN_NOUN_RE.test(s) || AREA_RE.test(s) || FOR_HOMEWORK_RE.test(s)
    || (PRACTICE_SET_RE.test(s) && DEFERRAL_RE.test(s));
}
