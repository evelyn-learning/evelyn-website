/**
 * Tutor brain v2 — has the student just ended the session?
 *
 * The detectors are v1's (voice/lesson-close.ts), tuned on live sessions: a firm stop is a whole sentence that
 * stops, ends the session or leaves ("Okay, please stop. I would like to end the session for now.", "Sorry, I have
 * to finish now.", "I have to go."), and the Japanese end signal is 今日はここまで / 終わりにします / さようなら …
 * A stop word inside lesson talk ("I have to finish the report on Friday.") and a pause (「ちょっと待ってください」)
 * are not stops.
 *
 * Two greetings in the Japanese list are also said on arriving: お疲れ様です and 失礼します open a meeting in a
 * Japanese office as often as they close one, so they alone never count here (お疲れ様でした, past, still does).
 *
 * What it is for (turn.ts): the facts say the student asked to end the session, and their close is never refused
 * for time left. A refused close tells the tutor to ask what they would like next: a new question to a student
 * who is leaving.
 */
import { isFirmStop, isSessionEndSignalJa } from '../voice/lesson-close';

const ARRIVING = /お疲れ(?:様|さま)です|失礼します/g;

export function v2StopAsked(studentSaid: string | null | undefined): boolean {
  const t = (studentSaid ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  return isFirmStop(t) || isSessionEndSignalJa(t.replace(ARRIVING, ' '));
}
