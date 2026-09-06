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
/** Task 13 fix round 2: the RUNTIME's own pointer sentence shape ("I've set 3
 *  practice questions on … for you"). The gate must match it so a model that
 *  echoes the pointer verbatim right after the runtime spoke it is dropped.
 *  Narrow on purpose: a set/left verb within a few words of an explicit
 *  practice/homework question-noun — "let's practice this one more time" and
 *  "want to try a practice problem?" carry no such verb. */
const SET_PRACTICE_RE = new RegExp(String.raw`\b(?:set|left)\b[^.!?]{0,30}?\b(?:practice|homework)\s+(?:questions?|problems?|exercises?|items?)\b`, 'i');

export function isHomeworkAnnouncement(sentence: string): boolean {
  const s = (sentence || '').trim();
  if (!s) return false;
  return NOUN_THEN_VERB_RE.test(s) || VERB_THEN_NOUN_RE.test(s) || AREA_RE.test(s) || FOR_HOMEWORK_RE.test(s)
    || SET_PRACTICE_RE.test(s);
}
