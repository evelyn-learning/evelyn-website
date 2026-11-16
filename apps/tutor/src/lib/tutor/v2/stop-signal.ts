/**
 * Tutor brain v2 — has the student just ended the session?
 *
 * English is v1's firm stop (voice/lesson-close.ts isFirmStop), tuned on live sessions: a whole sentence that stops,
 * ends the session or leaves ("Okay, please stop. I would like to end the session for now.", "Sorry, I have to
 * finish now.", "I have to go."). A stop word inside lesson talk ("I have to finish the report on Friday.") is not
 * one.
 *
 * Japanese holds to the same rule: a SENTENCE whose whole content is the stop (今日はここまで, 終わりにしましょう,
 * もう終わりにしたいです, お疲れ様でした …), after at most a few lead words (すみません、じゃあ、今日は、もう).
 * v1's end-signal list (isSessionEndSignalJa) matches anywhere in the words, which in a lesson reads a question
 * (もう終わりですか？), a sentence to translate (会議を終わりにします), quoted speech (さようなら、と言います) and a
 * comment on the lesson (今日はここまでの内容は難しかったです) as a stop (review of 6971a0b0). A pause
 * (「ちょっと待ってください」) is not a stop. お疲れ様です and 失礼します are left out: in a Japanese office they
 * open a meeting as often as they close one.
 *
 * What it is for (turn.ts): the facts say the student asked to end the session, and their close is never refused
 * for time left. A refused close tells the tutor to ask what they would like next: a new question to a student
 * who is leaving.
 */
import { isFirmStop } from '../voice/lesson-close';

const JA_LEAD = String.raw`(?:(?:すみません|すいません|ごめんなさい|じゃあ|じゃ|では|それでは|はい|あの|えっと|えーと|今日は|今日|もう|そろそろ)[、,\s]*)*`;
const JA_STOP_CORE = [
  String.raw`(?:今日は)?ここまで(?:に(?:します|しましょう|したいです|してください|しておきます)|で(?:お願いします|大丈夫です|いいです|結構です|終わりにします)?|です)?`,
  String.raw`終わり(?:に(?:します|しましょう|したいです|してください)|たいです)`,
  String.raw`終わります`,
  String.raw`やめ(?:ます|ましょう|たいです)`,
  String.raw`さようなら|さよなら`,
  String.raw`お疲れ(?:様|さま)でした`,
  String.raw`失礼しました`,
].join('|');
const JA_STOP_SENTENCE = new RegExp(String.raw`^${JA_LEAD}(?:${JA_STOP_CORE})(?:ね|よ)?$`);

/** Sentences of a Japanese utterance, without their end marks. A question mark keeps its sentence out. */
function jaStopSentence(t: string): boolean {
  return t.split(/[。！!\n]+/).map((s) => s.trim()).filter(Boolean)
    .some((s) => !/[?？]/.test(s) && JA_STOP_SENTENCE.test(s.replace(/\s+/g, '')));
}

export function v2StopAsked(studentSaid: string | null | undefined): boolean {
  const t = (studentSaid ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  return isFirmStop(t) || jaStopSentence(t);
}
