/**
 * Tutor brain v2 — has the student just ended the session?
 *
 * English is v1's firm stop (voice/lesson-close.ts isFirmStop), tuned on live sessions: a whole sentence that stops,
 * ends the session or leaves ("Okay, please stop. I would like to end the session for now.", "Sorry, I have to
 * finish now.", "I have to go."). A stop word inside lesson talk ("I have to finish the report on Friday.") is not
 * one.
 *
 * Japanese holds to the same rule: a SENTENCE whose whole content is the stop (今日はここまで, 終わりにしましょう,
 * もう終わりにしたいです, お疲れ様でした …), after at most a few lead words (すみません、じゃあ、今日は、もう), thanks
 * (ありがとうございました、) or a reason (疲れたので), and before thanks. A question is never a stop (もう終わりですか？,
 * また次回続けられますか？) except a polite request to stop the lesson, with ここまで or 終わり as what is asked for
 * (今日はここまでにしてもいいですか？, 今日はここまでにさせてください): "Can we stop here?" is a stop in English too
 * (re-review 1 of dfaae1ea).
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

const JA_SCRIPT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u30FC「」『』、。！？]+/gu;
const JA_THANKS = String.raw`(?:ありがとうございました|ありがとうございます|どうもありがとうございました|お疲れ(?:様|さま)でした|また(?:次回|今度)?(?:も)?(?:よろしく)?お願いします)`;
// A reason before the stop: a short clause ending in ので / から with no object of the stop in it.
const JA_REASON = String.raw`[^、。?？「」]{1,24}(?:ので|から)`;
const JA_LEAD = String.raw`(?:(?:すみません|すいません|ごめんなさい|じゃあ|じゃ|では|それでは|はい|あの|えっと|えーと|今日は|今日|もう|そろそろ|${JA_THANKS}|${JA_REASON})[、,\s]*)*`;
const JA_TAIL = String.raw`(?:[、,\s]*${JA_THANKS})*`;
const JA_STOP_CORE = [
  String.raw`(?:今日は)?ここまで(?:に(?:します|しましょう|したいです|してください|しておきます)|で(?:お願いします|大丈夫です|いいです|結構です|終わりにします)?|です)?`,
  String.raw`(?:今日は)?(?:ここまで|終わり)に(?:させてください|させていただきます|させていただけますか|して(?:も)?(?:いい|よろしい)(?:です|でしょう)か|してもらえますか)`,
  String.raw`終わり(?:に(?:します|しましょう|したいです|してください)|たいです)`,
  String.raw`終わります`,
  String.raw`やめ(?:ます|ましょう|たいです)`,
  String.raw`さようなら|さよなら`,
  String.raw`お疲れ(?:様|さま)でした`,
  String.raw`失礼しました`,
].join('|');
const JA_STOP_SENTENCE = new RegExp(String.raw`^${JA_LEAD}(?:${JA_STOP_CORE})(?:ね|よ)?${JA_TAIL}$`);
/** The request forms, which stay stops when asked as a question. */
const JA_STOP_REQUEST = /(?:ここまで|終わり)に(?:させていただけますか|して(?:も)?(?:いい|よろしい)(?:です|でしょう)か|してもらえますか)$/;

/** Each sentence of a Japanese utterance, with its end mark: a question is a stop only as a request to stop. */
function jaStopSentence(t: string): boolean {
  return t.split(/(?<=[。！!?？\n])/).map((s) => s.replace(/\s+/g, '')).filter(Boolean).some((raw) => {
    const asked = /[?？]$/.test(raw);
    const s = raw.replace(/[。！!?？]+$/, '');
    if (!JA_STOP_SENTENCE.test(s)) return false;
    return !(asked || /か$/.test(s)) || JA_STOP_REQUEST.test(s);
  });
}

export function v2StopAsked(studentSaid: string | null | undefined): boolean {
  const t = (studentSaid ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  // English is judged on its English words only: v1's firm stop also matches やめ / 今日はここまで anywhere once the
  // words have a space, so "How do you say やめて in English?" and a quoted 「今日はここまで…」と言います read as stops.
  const english = t.replace(JA_SCRIPT, ' ').replace(/\s+/g, ' ').trim();
  return (!!english && isFirmStop(english)) || jaStopSentence(t);
}
