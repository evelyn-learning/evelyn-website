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
 * family of Task 6e F2's "Now you say it") when it is the reply's last sentence (fix round 1); and a check-in sentence, which the
 * model's own trailing "Does that make sense so far?" after a practice ask is dropped as. Pure: the callers gate.
 */
import { asksAnywhere } from './board-timing';
import { stripBoardBlocks } from './board-inline';
import { v2IsPracticeAsk } from './languages';
import { v2InviteHeldBack, v2InvitesToSpeak, v2WithoutQuotedPhrases } from './language-pack';

/** A reply's sentences: cut after . ! ? and any closing quotes or brackets, and after 。！？. */
export function v2ReplySentences(text: string): string[] {
  return text.split(/(?<=[.!?]["'”’)\]]*)\s+|(?<=[。！？][」』)）"”]*)\s*/).map((x) => x.trim()).filter(Boolean);
}

/** Words that may lead an ask ("Okay, now please say it."). */
const LEAD = /^(?:(?:okay|ok|so|now|then|right|good|great|alright|all right|and|next|this time|once more|one more time|again)[,!.:]?\s+)*/i;
/** An imperative that hands the turn over: please say / say it / repeat / try / tell me / give me / now you … / your turn.
 *  Task 7e: "Start with: I have worked in accounting for…", "Please answer with a number: …" (v2audio-7 Tester A T26, T34),
 *  "complete the sentence", "fill in the blank": each got "Does that make sense so far?" after it. */
const HAND_OVER = /^(?:please[,]?\s+)?(?:say\b|repeat\b|read (?:it|this|that|the|them|these|aloud|out)\b|try\b|tell me\b|give me\b|you (?:say|try|repeat)\b|your turn\b|have a go\b|let me hear\b|go ahead\b|over to you\b|(?:start|begin) (?:with|by)\b|(?:answer|reply) (?:with|in|using)\b|(?:complete|finish) (?:the|this|that|it)\b|fill in\b)/i;
/** The lesson's Japanese asks: 言ってみてください, もう一度 … ください, 繰り返してください, 読んでみてください. */
const HAND_OVER_JA = /言ってみて|言ってください|もう一度[^。！？?]*(?:ください|ましょう)|繰り返して(?:ください|みて)|(?:話して|教えて|読んで|発音して)(?:みて)?ください/;
/** Advice for later is no ask ("Try to say it this way next time."). */
const LATER = /\bnext time\b|次回|次の機会/i;
/** Fix round 1 (review I1): imperatives that explain or set a scene, not asks: "Say you have 5 apples…", "Try thinking of it
 *  as a ramp.", "Give me a second to draw it.", "Tell me if you need a break." ("Please say that sentence again." is an ask.) */
const NOT_AN_ASK = /^(?:please[,]?\s+)?(?:say (?:you|we|they|he|she|there|for example|if)\b|say that (?!sentence|again|once|word|one|phrase|back|aloud|out loud)|try (?:not to|to (?:think|imagine|picture|remember)|thinking|imagining|picturing|remembering)\b|give me a (?:second|moment|minute|sec)\b|tell me (?:if|when|whenever)\b|go ahead and (?:imagine|picture|think)\b)|\bif you (?:need|want|like)\b/i;

/** Whether a sentence hands the turn over by asking them to say, try or tell something (or is a practice ask, Task 6g). */
export function v2HandsOver(sentence: string): boolean {
  const s = sentence.trim().replace(/^["'“‘(「『]+/, '');
  if (!s || LATER.test(s)) return false;
  const bare = s.replace(LEAD, '');
  if (NOT_AN_ASK.test(bare)) return false;
  return HAND_OVER.test(bare) || HAND_OVER_JA.test(s) || v2IsPracticeAsk(s);
}

/** Fix round 1 (controller ruling, review I1): a hand-over counts by its place, not its words alone: only as the reply's last
 *  spoken sentence, where a check-in or an offer added after it would be a second thing to answer. Earlier in a reply an
 *  imperative never counts ("Say you have 5 apples and eat 2. Then 3 are left." is an explanation). */
function endsHandingOver(sentences: string[]): boolean {
  const last = sentences[sentences.length - 1];
  return !!last && v2HandsOver(last);
}

/** Whether a reply asks them anything, for the runtime's check-in: what asked before (board-timing.ts asksAnywhere on the old
 *  cut, so nothing that asked before stops asking), or its last sentence, cut after quotes too, hands over. */
export function v2ReplyAsks(text: string): boolean {
  const plain = stripBoardBlocks(text);
  const old = plain.split(/(?<=[.?!])\s+/).filter((x) => x.trim());
  const now = v2ReplySentences(plain);
  return asksAnywhere(old) || endsHandingOver(now) || now.some(v2AsksInJapanese) || now.slice(-2).some(v2HandsOverInItsLanguage);
}

/** A lesson taught in Chinese or Japanese hands the turn over with an instruction and no question mark as often as an
 *  English one does (「請你把 x 等於 3 代入第一式，算出 y。」, 「求下面聯立方程式的 x 和 y。」, 「y を求めてください。」): taken for a
 *  statement, each got the runtime's check-in after it (first zh-TW run, 2026-11-24: a problem read out, then "Are you with
 *  me so far?"). Read in the reply's last two sentences only, as an English instruction is (board-timing.ts asksAloud).
 *  Not advice for later or under a condition (下次…, 如果有問題…, 次回…, …があれば). */
const ZH_HAND_OVER = /(?:請|请)(?:你|妳|您)?(?:先|再|也|試著|试着|自己)?\s*(?:算|說|说|寫|写|試|试|想|告訴|告诉|回答|做|解|求|找|比|完成|選|选|看|判斷|判断|列|代入|計算|计算|解釋|解释|描述|讀|读|畫|画|用|把|舉|举)|(?:試|试)(?:試|试)看|算算看|想想看|做做看|(?:說說|说说)看|你來(?:試|算|做|說|寫|解)|你来(?:试|算|做|说|写|解)|(?:換|换|輪到|轮到)你|(?:告訴|告诉)我|^(?:(?:現在|现在|接下來|接下来|那麼|那么|好|來|来)[，,、]?\s*)*(?:求|算出|計算|计算|解出|寫出|写出|找出|比較|比较|化簡|化简)(?!出來了|出来了)/u;
const JA_HAND_OVER_TASK = /(?:求め|解い|計算し|答え|考え|やっ|書い|選ん|比べ|説明し|代入し|試し|確かめ)て(?:みて)?(?:ください|みましょう|ごらん)|やってみましょう|(?:求め|解き|計算し|答え)なさい/u;
const NOT_NOW_CJK = /下次|下一次|以後|以后|如果有|有問題的話|有问题的话|隨時|随时|次回|あとで|後で|があれば|あったら|いつでも/u;
export function v2HandsOverInItsLanguage(sentence: string): boolean {
  const s = sentence.trim();
  return !!s && !NOT_NOW_CJK.test(s) && (ZH_HAND_OVER.test(s) || JA_HAND_OVER_TASK.test(s));
}

/** Task 7e: a Japanese question with no question mark, ending か (「…次に進みますか。」, 「もう一度言ってもらえますか。」,
 *  「…ましょうか」, 「…ですか」), counts as a question wherever it stands, as a "?" does (board-timing.ts asksAnywhere): the
 *  part ask 「質問がありますか、それとも次に進みますか。」 got "Is that clear, or shall I go over it again?" after it (v2audio-7
 *  Tester A T54; T71 the same after 「もう一度言ってもらえますか。」 and an explanation). Not 「そうですか。」 (an "I see"). */
const JA_ASKS = /[\u3040-\u30ff\u4e00-\u9fff](?:か|かな|かね)[。．]?["'”’)\]」』）]*$/u;
const JA_I_SEE = /^(?:(?:あ|ああ|あっ|へえ|へー|なるほど|そう)[、,]?\s*)*そう(?:です|でした|なんです)?か[。！!]?$/u;
export function v2AsksInJapanese(sentence: string): boolean {
  const s = sentence.trim();
  return JA_ASKS.test(s) && !JA_I_SEE.test(s);
}

/** Task 7r (ASK_ONE_TEST): the one test for "this reply asked the learner something", for the client's early silence recheck
 *  (TutorVoiceV2) and the silence turn's facts (facts.ts v2LastReplyAsked), on the reply's whole sentences (not the voice's
 *  language parts: 「例えば「I sell washing machines.」のように…言ってみましょう。」 split in three, and the hand-over fell out of the
 *  last two). Everything v2ReplyAsks counts (a 「…か。」 question anywhere, a hand-over ending it), and in either of the last two
 *  sentences a hand-over (v2HandsOver: "Repeat after me.", "Please say…", 繰り返してください) or an invitation in a language pack's wording
 *  (language-pack.ts v2InvitesToSpeak: 〜てみましょう, 繰り返して, 教えてください, どうぞ; not under a condition, for later, or quoted).
 *  Only ever more replies than asksAnywhere alone. */
/** Fix round 1 (I2): v2ReplyAsks's parts, on sentences with their quoted phrases left out and without the sentences that ask only
 *  under a condition or for later: 「わからない単語があれば、いつでも教えてください。」 is an offer, 「次回までに…書いてみてください。」 homework,
 *  「"Please tell me" は「教えてください」です。」 and 「"Could you tell me…?" は「教えてもらえますか」という意味です。」 teach a phrase. The
 *  client and v2LastReplyAsked still OR the test they had at 7ce31282 (asksAnywhere), so nothing that asked before stops asking
 *  there; the silence-after-ask facts (item 2) read this test alone. */
export function v2AsksTheLearner(text: string): boolean {
  // Quoted phrases out of the whole reply first: cut into sentences, 「…。"Please tell me" は…」 splits at the opening quote.
  const plain = v2WithoutQuotedPhrases(stripBoardBlocks(text));
  // Fix round 2 (N1): a sentence that is itself a question always stays (「今までに、海外出張をしたことがありますか。」); the condition /
  // later guard leaves out invitations only.
  const kept = v2ReplySentences(plain).filter((x) => /[?？]/.test(x) || v2AsksInJapanese(x) || !v2InviteHeldBack(x));
  if (asksAnywhere(kept) || kept.some(v2AsksInJapanese)) return true;
  return kept.slice(-2).some((s) => v2HandsOver(s) || v2InvitesToSpeak(s));
}

/** Whether a reply hands the turn over for an ask the runtime would add after it (a part ask, an offer): its last sentence is a
 *  question or hands over. A question further back may be rhetorical ("Why? Because the slope is 2."), and the offer after
 *  such a reply is the only question in it. */
export function v2ReplyHandsOver(text: string): boolean {
  const now = v2ReplySentences(stripBoardBlocks(text));
  return /(?:[?？]|か[。．]?)["'”’)\]」』）]*$/.test(now[now.length - 1] ?? '') || endsHandingOver(now);
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

/** Task 7x (REPEAT_THEN_WAIT): a sentence that asks THEM to say a sentence again: "Can you say the sentence once more?", "Please try that
 *  sentence again.", "Almost, say it again.", "Let's say it together once more.", 「もう一度言ってみてください」, 「もう一度言ってみましょう」,
 *  「一緒に言ってみましょう」, 「繰り返してください」. Never advice for later ("Try to say it this way next time."). Fix round 1 (ruling): never
 *  the tutor saying it again itself ("Let me say it once more", 「もう一度言いますね」) or moving on ("Let's try again with a new question").
 *  Fix round 2 (ruling): it only keeps the runtime from appending its own lines after the ask (turn.ts), so it is read wide. */
const REPEAT_EN = /\b(?:say|repeat|try|read)\b[^.?!]*?\b(?:again|once more|one more time|(?:the|that|this|your) (?:complete|whole|full|correct|corrected|new) sentence|after me)\b|\brepeat (?:it|that|this|the sentence|that sentence|the whole sentence)\b/i;
const NOT_THEIRS = /\b(?:let me|i'?ll|i will|i'?m going to|i am going to|i can)\b|\blet'?s\b[^.?!]*\b(?:new|next|another|different) (?:question|sentence|one|topic|word)\b/i;
const REPEAT_JA = /もう一度[^。！？?]*(?:言って(?!います|いる|いた)|言いましょう|言えますか|繰り返し(?:て|ましょう)|発音し(?:て|ましょう)|読ん(?:で(?!います))|読みましょう)|一緒に[^。！？?]*(?:言って|言いましょう|繰り返|読みましょう|読んで)|繰り返して(?:ください|みて)|繰り返しましょう/;
export function v2AsksRepeat(sentence: string): boolean {
  const s = sentence.trim();
  if (!s || LATER.test(s)) return false;
  return (REPEAT_EN.test(s) && !NOT_THEIRS.test(s)) || REPEAT_JA.test(s);
}

/** Task 7x (REPEAT_THEN_WAIT): the facts line of a reply to their practice answer in a spoken language lesson. */
/** Fix round 1 (ruling): in a spoken language lesson, a reply that corrects their sentence asks them to say it once more and ends there. */
export const V2_CORRECT_THEN_REPEAT_LINE = 'after a correction: when you correct their sentence, ask them to say the corrected sentence once more, and stop there: that ask ENDS this reply (it is its one question): no next question, question card or offer after it. Ask your next question in the reply after they have said it. A reply that corrects nothing goes on to your next question';
