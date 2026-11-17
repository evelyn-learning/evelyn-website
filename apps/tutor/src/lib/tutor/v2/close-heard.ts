/**
 * Tutor brain v2 — the close: when it is due, and what the student says over it.
 *
 * The tutor's closing words take twenty seconds or more to say. The microphone was switched off the moment
 * end_lesson was accepted, so a student who spoke over the summary was not heard and the session ended on them;
 * and the close was allowed with a fifth of the session left, six minutes of a thirty-minute lesson
 * (AP US Government, portal-1115afec: closed at 24:21 of 30:00, the student trying to speak).
 */

/** Minutes left at which a lesson's close becomes due. A fifth of the session, and never more than three minutes:
 *  with more than that left the student is asked what they would like next. */
export function closeDueMinutes(timeBoxMinutes: number): number {
  return Math.min(timeBoxMinutes * 0.2, 3);
}

const PARTING = /\b(?:ok(?:ay)?|yes|yeah|yep|sure|alright|all right|right|great|cool|nice|good|perfect|awesome|got it|sounds good|will do|i will|thanks?(?: you)?(?: (?:so|very) much)?(?: a lot)?|(?:good)?bye(?:[- ]bye)?|see you(?: (?:later|soon|next time|then))?|good ?night|take care|you too|have a (?:good|nice|great) (?:one|day|night|evening|weekend)|mr|mrs|ms|miss|sir|ma'?am)\b/gi;
/** One word that is left after the thanks may be the tutor's name; these are not names. */
const NOT_A_NAME = /^(?:wait|no|but|question|why|what|how|when|where|who|again|more|stop|sorry|actually|and|so|can|could|one|hold|hang)$/i;

/** Whether words heard over the closing words call the close off. Thanks and a goodbye do not: the student is
 *  closing too. Anything else is something they still want to say, and the lesson goes on from it. */
export function reopensClose(said: string): boolean {
  const s = said.trim().replace(/[’]/g, "'");
  if (!s || !/[\p{L}\p{N}]/u.test(s)) return false;
  if (s.includes('?')) return true;
  const rest = s.replace(PARTING, ' ').split(/[^\p{L}\p{N}']+/u).filter(Boolean);
  return rest.length > 1 || (rest.length === 1 && NOT_A_NAME.test(rest[0]));
}
