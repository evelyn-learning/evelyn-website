/**
 * Tutor brain v2 — one question per reply (Task 7c, ASK_NO_CHECKIN).
 *
 * Mic test 1 (embed-1794882458629, t≈8.36): the tutor said "Please say that sentence again." and then "Does that make sense
 * so far?", and the learner could not tell which to answer. The second question was the runtime's check-in (turn.ts): the
 * reply was cut into sentences only at ". " so `we say "I have worked with Canadian customers." Please say that sentence
 * again.` stayed one sentence that begins with a quote, and the imperative ask in it was never seen. The same at t≈9.3
 * ("…"sold." Please say it: "…"" + "Is that clear, or shall I go over it again?") and t≈12.6.
 *
 * Here: a reply's sentences cut after closing quotes too; an imperative that hands the turn over counts as an ask (the
 * family of Task 6e F2's "Now you say it"); a reply asks when any sentence of it does; and a check-in sentence, which the
 * model's own trailing "Does that make sense so far?" after a practice ask is dropped as. Pure: the callers gate.
 */
import { asksAnywhere } from './board-timing';
import { stripBoardBlocks } from './board-inline';
import { v2IsPracticeAsk } from './languages';

/** A reply's sentences: cut after . ! ? and any closing quotes or brackets, and after 。！？. */
export function v2ReplySentences(text: string): string[] {
  return text.split(/(?<=[.!?]["'”’)\]]*)\s+|(?<=[。！？][」』)）"”]*)\s*/).map((x) => x.trim()).filter(Boolean);
}

/** Words that may lead an ask ("Okay, now please say it."). */
const LEAD = /^(?:(?:okay|ok|so|now|then|right|good|great|alright|all right|and|next|this time|once more|one more time|again)[,!.:]?\s+)*/i;
/** An imperative that hands the turn over: please say / say it / repeat / try / tell me / give me / now you … / your turn. */
const HAND_OVER = /^(?:please[,]?\s+)?(?:say\b|repeat\b|read (?:it|this|that|the|them|these|aloud|out)\b|try\b|tell me\b|give me\b|you (?:say|try|repeat)\b|your turn\b|have a go\b|let me hear\b|go ahead\b|over to you\b)/i;
/** The lesson's Japanese asks: 言ってみてください, もう一度 … ください, 繰り返してください, 読んでみてください. */
const HAND_OVER_JA = /言ってみて|言ってください|もう一度[^。！？?]*(?:ください|ましょう)|繰り返して(?:ください|みて)|(?:話して|教えて|読んで|発音して)(?:みて)?ください/;
/** Advice for later is no ask ("Try to say it this way next time."). */
const LATER = /\bnext time\b|次回|次の機会/i;

/** Whether a sentence hands the turn over by asking them to say, try or tell something (or is a practice ask, Task 6g). */
export function v2HandsOver(sentence: string): boolean {
  const s = sentence.trim().replace(/^["'“‘(「『]+/, '');
  if (!s || LATER.test(s)) return false;
  return HAND_OVER.test(s.replace(LEAD, '')) || HAND_OVER_JA.test(s) || v2IsPracticeAsk(s);
}

/** Whether a reply asks them anything: a question anywhere, an instruction at its end (board-timing.ts asksAnywhere, on the
 *  old cut and on the cut after quotes, so nothing that asked before stops asking), or a hand-over anywhere. */
export function v2ReplyAsks(text: string): boolean {
  const plain = stripBoardBlocks(text);
  const old = plain.split(/(?<=[.?!])\s+/).filter((x) => x.trim());
  const now = v2ReplySentences(plain);
  return asksAnywhere(old) || asksAnywhere(now) || now.some(v2HandsOver);
}

/** Whether a reply hands the turn over for an ask the runtime would add after it (a part ask, an offer): its last sentence is a
 *  question, or any sentence hands over. A question further back may be rhetorical ("Why? Because the slope is 2."), and
 *  the offer after such a reply is the only question in it. */
export function v2ReplyHandsOver(text: string): boolean {
  const now = v2ReplySentences(stripBoardBlocks(text));
  return /(?:[?？]|か[。．]?)["'”’)\]」』）]*$/.test(now[now.length - 1] ?? '') || now.some(v2HandsOver);
}

/** A check-in: a whole sentence that only asks whether they follow ("Does that make sense so far?", "Is that clear, or shall
 *  I go over it again?", 「わかりましたか？」). Never a question about the lesson's content ("Does it make sense to use the
 *  past simple here?" goes on past "sense"). */
const CHECK_IN = /^(?:(?:okay|ok|so|now|alright|all right)[,!.]?\s+)*(?:does (?:that|this|it|everything|all that) make sense(?: so far| now)?|(?:is|was) (?:that|this|it|everything|all that) clear(?: so far| now)?(?:,? or (?:shall|should) i (?:go over|explain) (?:it|that|this) again)?|are you (?:with me|following(?: me)?)(?: so far)?|(?:do you have )?any questions(?: so far)?|(?:do you )?understand(?: so far)?|got (?:it|that)|(?:is )?that (?:okay|ok|clear)|(?:shall|should) i (?:go over|explain) (?:it|that|this) again|(?:all )?clear|ok(?:ay)?|make sense)\s*\?["'”’]*$/i;
const CHECK_IN_JA = /^(?:ここまで(?:は|で)?、?)?(?:わかりましたか|分かりましたか|大丈夫ですか|いいですか|よろしいですか|(?:何か)?質問はありますか)[？?]?$/;
export function v2IsCheckIn(sentence: string): boolean {
  const s = sentence.trim();
  return CHECK_IN.test(s) || CHECK_IN_JA.test(s);
}
