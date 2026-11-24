/**
 * Tutor brain v2 — the close: when it is due, and what the student says over it.
 *
 * The tutor's closing words take twenty seconds or more to say. The microphone was switched off the moment
 * end_lesson was accepted, so a student who spoke over the summary was not heard and the session ended on them;
 * and the close was allowed with a fifth of the session left, six minutes of a thirty-minute lesson
 * (AP US Government, portal-1115afec: closed at 24:21 of 30:00, the student trying to speak).
 */

/** Minutes left at which a lesson's close becomes due: a fifth of the session, and never more than two minutes.
 *  Until then the tutor may not close by itself; with more time than that left and the plan done, the student is
 *  asked what they would like next. When it is reached the tutor says so and uses what is left for the one thing
 *  that matters most (facts.ts), and the client makes sure that turn happens even if no one is speaking (useV2Turns). */
export const V2_CLOSE_DUE_MAX_MINUTES = 2;
export function closeDueMinutes(timeBoxMinutes: number): number {
  return Math.min(timeBoxMinutes * 0.2, V2_CLOSE_DUE_MAX_MINUTES);
}

/** The student asks the tutor to wait: "pause for a second", "hold on", "give me a minute". A tutor that agreed
 *  and then heard two seconds of silence was told the student was waiting for it, and went on with the lesson
 *  (Algebra 1, portal-50a1e584). A question is not a request to wait ("wait, why is it negative?"). */
export function asksToWait(said: string): boolean {
  // The same asked in Chinese or Japanese (等一下, 給我一點時間, ちょっと待ってください); a question about the lesson is not (等一下，為什麼是負的？).
  if (/等一下|等等|稍等|暫停|暂停|(?:給|给)我一(?:點|点|些)?(?:時間|时间)|ちょっと待って|少し待って|待ってください|少々お待ち/u.test(said)) return !/[?？]/.test(said) || !/為什麼|为什么|怎麼|怎么|什麼|什么|なぜ|どうして|何/u.test(said);
  const s = said.toLowerCase().replace(/[’]/g, "'");
  const WAIT = /\b(?:pause|hold on|hang on|bear with me|be right back|brb|(?:give me|wait|just|one)\s+(?:(?:a|one)\s+)?(?:sec(?:ond)?|min(?:ute)?|moment)s?)\b/;
  // "Can you give me a second, please?" is the request itself, written down with a question mark; the tutor
  // answered it by explaining the answer five seconds later (portal-84f8660d).
  if (s.includes('?')) return s.split(/(?<=\?)/).every((part) => !part.includes('?') || (WAIT.test(part) && /\b(?:can|could|would|will|may|mind)\b/.test(part) && !/\b(?:why|what|how|when|where|who|which)\b/.test(part)));
  return /\b(?:pause|hold on|hang on|bear with me|be right back|brb|(?:give me|wait|just|one)\s+(?:(?:a|one)\s+)?(?:sec(?:ond)?|min(?:ute)?|moment)s?)\b/.test(s);
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
