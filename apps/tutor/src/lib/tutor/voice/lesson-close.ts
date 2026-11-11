/**
 * After the lesson has closed, a student's goodbye is not a new turn.
 *
 * GDI starter session 2026-10-15 (embed-1792105245704): the student said
 * 「今日はここまでで大丈夫です」, the tutor closed the lesson (the close tool
 * fired), and then every 「はい、ありがとうございました」「またお願いします」
 * got another full farewell — eight of them — and one bare 「はい」 restarted
 * the kayaking exercise through the idle nudge. Once closed, a reply that is
 * only thanks / goodbye / acknowledgement gets no new tutor turn; anything
 * with content (a question, a request) still does.
 */

import { lastQuestionSentence, lastAskSentence } from '../question-gist-text';

// Each clause of the utterance must be one of these, start to end.
const PLEASANTRY_CLAUSE = new RegExp(
  '^(?:' + [
    'はい', 'ええ', 'うん', 'そうですね', 'わかりました', '分かりました',
    'ありがとう(?:ございます|ございました)?', 'どうも(?:ありがとうございました)?',
    'お疲れ(?:様|さま)でした', '失礼します', '失礼しました',
    'また(?:次回|今度|明日|ね)?(?:も)?(?:よろしく)?(?:お願いします|お願いしますね)?',
    '次回(?:も)?(?:よろしく)?お願いします', 'よろしくお願いします', 'さようなら', 'じゃあね', 'では',
    'ok(?:ay)?', 'yes', 'yeah', 'thanks?(?: you)?(?: so much| very much)?', 'bye', 'goodbye', 'good bye',
    'see you(?: next time| later| soon)?', 'have a (?:good|nice) (?:day|one|evening)', 'take care',
  ].join('|') + ')$',
  'i',
);

export function isPleasantryOnly(text: string): boolean {
  if (typeof text !== 'string') return false;
  if (/[?？]/.test(text)) return false;
  const clauses = text
    .toLowerCase()
    .split(/[、。,.!！\n]+/)
    .map((c) => c.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  if (clauses.length === 0) return false;
  if (clauses.every((c) => PLEASANTRY_CLAUSE.test(c))) return true;
  // embed-1792174263669: 「うん、こちらこそです。ありがとうございました。今日は色々
  // 練習できました。まだ難しいけど、また次回もお願いします。」 got a second full
  // farewell. A remark that ENDS on a goodbye is a goodbye; one that ends on
  // new content (「…ちょっと自信つきました。」) still gets its turn.
  return FAREWELL_CLAUSE.test(clauses[clauses.length - 1]) && !QUESTION_MARKER.test(text);
}

const FAREWELL_CLAUSE = new RegExp(
  '^(?:' + [
    'ありがとう(?:ございます|ございました)?', 'どうも(?:ありがとうございました)?',
    'お疲れ(?:様|さま)でした', '失礼します', '失礼しました',
    '(?:また)?(?:次回|今度|明日)?(?:も)?(?:よろしく)?お願いします(?:ね)?',
    'さようなら', 'じゃあね', 'またね',
    'thanks?(?: you)?(?: so much| very much)?', 'bye', 'goodbye', 'good bye',
    'see you(?: next time| later| soon)?', 'take care',
  ].join('|') + ')$',
  'i',
);
// A question anywhere keeps the turn, even after a goodbye. STT often drops
// the「？」, so the spoken question endings count too.
const QUESTION_MARKER = /[?？]|(?:です|ます|でした|ません)か|教えて|もう一(?:つ|回|度)|質問|one more|question/i;

/**
 * A mutual farewell closes the lesson even when the close tool did not fire.
 *
 * embed-1792254012923 (2026-10-17): the student said 「今日はここまでにします
 * …さようなら」, the tutor said 「さようなら、Mikeさん」 — and did not call
 * close_session_notes. Nothing marked the lesson closed, so 75 s later the
 * idle nudge told the student to "take your time thinking", the student asked
 * what that was about, and the tutor restarted the exercise. Three more
 * goodbyes followed before the close tool fired.
 *
 * `isTutorFarewell` reads the TUTOR's reply: its last sentence is a goodbye and
 * the turn asks nothing. The caller pairs it with the student's own session-end
 * signal, so a greetings lesson that practises さようなら mid-turn does not
 * close itself.
 */
const FAREWELL_RE =
  /さようなら|さよなら|またね|また(?:次回|今度|明日|来週)|お疲れ(?:様|さま)|失礼します|良い(?:一日|週末)を|\b(?:goodbye|good bye|bye|see you(?: next time| soon| later| tomorrow)?|take care|have a (?:good|nice|great|lovely) (?:day|one|evening|weekend|night))\b/i;

export function isTutorFarewell(tutorText: string): boolean {
  if (typeof tutorText !== 'string') return false;
  const t = tutorText.trim();
  if (!t || /[?？]\s*$/.test(t)) return false;
  const sentences = t.split(/(?<=[。！!.])\s*|\n+/).map((s) => s.trim()).filter(Boolean);
  const last = sentences[sentences.length - 1] ?? '';
  if (FAREWELL_RE.test(last)) return true;
  // 「さようなら。Keep practising!」 — the goodbye one sentence back, followed by
  // a short closing line that asks for nothing. 「さようならは英語で goodbye です。
  // 言ってみましょう。」 asks the student to say it: a lesson, not a farewell.
  const prev = sentences[sentences.length - 2] ?? '';
  return !!prev && FAREWELL_RE.test(prev) && last.length <= 30 && !FAREWELL_TAIL_ASK_RE.test(last);
}
const FAREWELL_TAIL_ASK_RE = /言って|言い|読んで|答え|聞|質問|\b(?:say|repeat|try|answer|question)\b/i;

/**
 * Task 20 §B (GDI run 8, 1543 s): the farewell part of an attempt that closes
 * the lesson too early. Fix round 1 (I2): farewell words are lesson content
 * too ("Repeat after me: "Have a nice day."", 「今日はここまでです」 as a
 * phrase to learn) — a sentence counts only when it is a goodbye
 * (FAREWELL_RE / PREMATURE_CLOSE_LINE_RE, not a question, no instruction in
 * it) AND it is the turn's last sentence or is followed only by goodbye /
 * thanks sentences. Fix round 2 (I2): (a) a quoted span is removed only when
 * it is content — introduced by say / repeat / a phrase / a colon, or followed
 * by "means" / "is a …" — or is no close at all; the brain's own goodbye in
 * 「…」 (run 8 wrote it that way) counts; (b) up to two pleasantry /
 * encouragement lines after the goodbye ("Keep up the good work.") still close.
 * Returns that sentence (for the debug event), else null.
 */
const QUOTED_SPAN_RE = /"([^"\n]*)"|“([^”\n]*)”|「([^」\n]*)」|『([^』\n]*)』/g;
const FAREWELL_INSTRUCTION_RE = /言って|読んで|答え|練習|\b(?:say|repeat|try|answer|question|practi[cs]e|read|tell me|review|homework)\b/i;
const THANKS_RE = /\b(?:thank you|thanks)\b|ありがとう|お疲れ(?:様|さま)/i;
const ENCOURAGEMENT_RE = /\b(?:keep up|well done|good work|great work|great job|take care|keep practi[sc]ing)\b/i;
/** Before a quote: it is introduced as something to say / learn. */
const CONTENT_QUOTE_BEFORE_RE = /(?:\b(?:say|says|said|repeat|after me|practi[cs]e|phrase|word|expression|sentence|with|like|as|reads?|write)\b|[:：])\s*$/i;
/** After a quote: it is explained or judged as language. */
const CONTENT_QUOTE_AFTER_RE = /^\s*(?:means?\b|is (?:a|an|the|natural|correct|polite|common)\b|と(?:言|いう|いい)|って|は英語|in English)/i;
function splitFarewellSentences(text: string): string[] {
  return text
    .split(/(?<=[。！!.?？])\s+|(?<=[。！？])|\n+/)
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter((x) => /[\p{L}\p{N}]/u.test(x));
}
function isFarewellSentence(s: string): boolean {
  if (/[?？]\s*$/.test(s) || /(?:ましょうか|ますか|ですか|でしょうか)\s*$/.test(s)) return false;
  if (FAREWELL_INSTRUCTION_RE.test(s)) return false;
  return FAREWELL_RE.test(s) || PREMATURE_CLOSE_LINE_RE.test(s);
}
function isClosingTailSentence(s: string): boolean {
  if (/[?？]\s*$/.test(s)) return false;
  return isPleasantryOnly(s) || ENCOURAGEMENT_RE.test(s) || (THANKS_RE.test(s) && !FAREWELL_INSTRUCTION_RE.test(s));
}
export function prematureFarewellLine(tutorText: string): string | null {
  if (typeof tutorText !== 'string' || !tutorText.trim()) return null;
  const unquoted = tutorText.replace(QUOTED_SPAN_RE, (m, ...groups: unknown[]) => {
    const inner = String(groups.slice(0, 4).find((g) => g !== undefined) ?? '');
    const at = groups[4] as number;
    const before = tutorText.slice(Math.max(0, at - 40), at);
    const after = tutorText.slice(at + m.length, at + m.length + 30);
    const isClose = splitFarewellSentences(inner).some(isFarewellSentence);
    const isContent = CONTENT_QUOTE_BEFORE_RE.test(before) || CONTENT_QUOTE_AFTER_RE.test(after);
    // the tutor's own goodbye, written in quotes: keep its sentences
    return isClose && !isContent ? ` ${inner} ` : ' ';
  });
  const sentences = splitFarewellSentences(unquoted);
  for (let i = 0; i < sentences.length; i++) {
    if (!isFarewellSentence(sentences[i]!)) continue;
    const tail = sentences.slice(i + 1);
    const extra = tail.filter((t) => !isFarewellSentence(t));
    if (extra.length <= 2 && extra.every(isClosingTailSentence)) return sentences[i]!;
  }
  return null;
}

/**
 * Task 20 fix round 2 (NEW-I1): the student's end request as a WHOLE
 * utterance — "Okay, let's stop here.", "Bye!", 「今日はここまでにしましょう」.
 * A stop word inside a sentence ("I usually stop working at six.", "I said
 * goodbye to the clients.") is lesson talk and never latches the end signal.
 */
const STANDALONE_STOP_RE =
  /^(?:(?:let['’]?s |I (?:want|would like|'d like) to )?(?:stop|finish|end|quit|exit)(?: (?:here|now|the lesson|for today))?|(?:good)?bye|see you(?: (?:next time|later|tomorrow))?|that['’]?s (?:all|enough)(?: for today)?)[.!]?$/i;
const STOP_PAD_RE = /^(?:(?:um+|uh+|er+|ok(?:ay)?|yes|yeah|well|so|alright|all right|thanks?(?: you)?(?: (?:so|very) much)?)[,.!]?\s+)+|(?:[,.!]?\s+(?:thanks?(?: you)?(?: (?:so|very) much)?|okay|ok))+[.!]?$/gi;
export function isStandaloneStopUtterance(studentText: string): boolean {
  const t = (studentText ?? '').trim();
  if (!t) return false;
  if (isSessionEndSignalJa(t)) return true;
  const core = t.replace(STOP_PAD_RE, '').trim();
  return STANDALONE_STOP_RE.test(core);
}

/**
 * Task 33 §E (GDI bot run r8, 578 s: "We can finish it." mid-part was ignored
 * and the probe went on): the student's stop request — a standalone stop
 * utterance, or a short "we can / let's / can we / I want to / I'd like to /
 * shall we finish · stop · end (it / here / now / the lesson / for today)",
 * "that's enough (for today)", or a short 終わり… reply. Whole utterance
 * only (≤ 8 words) — "We can finish the report on Friday." is lesson talk.
 */
const STOP_REQUEST_RE =
  /^(?:(?:I think|maybe|so|ok(?:ay)?|well|um+|uh+)[,\s]+)*(?:we can|we could|can we|could we|shall we|let['’]?s|let us|I (?:want|would like|'d like|wanna) to|I want|I(?:'d| would) like to)\s+(?:finish|stop|end|quit|wrap up)(?:\s+(?:it|this|here|now|the lesson|the class|for today|today|for now))*\s*[.!?]?$/i;
const ENOUGH_RE = /^(?:(?:ok(?:ay)?|well|so)[,\s]+)?that['’]?s (?:enough|all)(?: for (?:today|now))?\s*[.!]?$/i;
// Fix round 1 (I-1b): a question is never a stop request ("終わりですか？",
// "これで終わり?", "Is it finished?") — except the English request shapes
// "can we / could we / shall we stop …?" — and a past report ("おわりました",
// "終わりました": a practice item is done) is none either.
const QUESTION_END_RE = /[?？]\s*$|(?:です|ます|でしょう)?か[。.]?\s*$/;
const MODAL_REQUEST_RE = /^(?:(?:ok(?:ay)?|so|well)[,\s]+)?(?:can we|could we|shall we)\b/i;
const JA_PAST_DONE_RE = /(?:終|お)わりました/;
/**
 * W18 (GDI 11-09: Josh embed-1794204711914 387 s "Okay, please stop. I would
 * like to end the session for now."; Praveen embed-1794186480072 310 s "Can we
 * finish the session? I have to go somewhere.", 343 s "I want to finish the
 * session, please. I have to go.", 345 s "Please end it."): none matched the
 * whole-utterance shapes above (a second sentence, "the session", "please"),
 * so the stop never reached the engine and the tutor kept teaching. A FIRM
 * stop is one SENTENCE of the utterance that is an explicit stop, a request to
 * stop / end / finish the SESSION, a "please stop / end it", or a leaving line
 * ("I have to go"). The session / leaving words make it unambiguous, so it
 * closes at once (no finish-or-stop choice). Whole sentences only: "We can
 * finish the report on Friday." / "I have to go to Osaka next week." are
 * lesson talk.
 */
const FIRM_PAD = String.raw`(?:(?:sorry|ok(?:ay)?|so|well|um+|uh+|yes|yeah|no|please|actually|i think|maybe)[,\s]+)*`;
const SESSION_STOP_RE = new RegExp(String.raw`^${FIRM_PAD}(?:(?:can|could) (?:we|you|i)|shall we|let['’]?s|let us|i (?:want|would like|'d like|wanna|need) to|i want|we (?:can|could|should|need to))?\s*(?:please\s+)?(?:finish|stop|end|quit|close|wrap up)\s+(?:the|this|our|today['’]?s)\s+(?:session|lesson|class)(?:\s+(?:now|here|for now|for today|today|early|please))*[\s,]*(?:please)?\s*[.!?]?$`, 'i');
// "please end it" is firm; a bare "please stop" / "stop, please" can be a barge-in on the tutor's speech — a stop
// REQUEST only (the choice), firm when another sentence of the utterance is.
const PLEASE_END_RE = new RegExp(String.raw`^${FIRM_PAD}(?:please\s+end(?: (?:it|this))?|end (?:it|this),?\s+please)(?:\s+(?:here|now|for now|for today))*\s*[.!?]?$`, 'i');
const PLEASE_STOP_RE = new RegExp(String.raw`^${FIRM_PAD}(?:please\s+stop|stop,?\s+please)(?:\s+(?:here|now|for now|for today))*\s*[.!?]?$`, 'i');
const LEAVING_RE = new RegExp(String.raw`^${FIRM_PAD}(?:i|we)\s+(?:have to|need to|must|'ve got to|have got to|gotta|got to)\s+(?:go|leave|run)(?:\s+(?:now|soon|somewhere|already|right now|sorry))*\s*[.!]?$`, 'i');
// James, GDI demo embed-1794314921551 724 s: "Sorry, I have to finish now." matched nothing — "finish" with no
// object was neither a stop request nor a firm stop, so the tutor took it as "go to the summary" and asked a
// readiness question, then a recap question; he had to say "I have to go" twice more (36 s). Having to finish,
// stop or end, with nothing after it but now / here / today, is leaving. An object keeps it lesson talk
// ("I have to finish the report on Friday.").
const MUST_FINISH_RE = new RegExp(String.raw`^${FIRM_PAD}(?:i|we)\s+(?:have to|need to|must|'ve got to|have got to|gotta|got to)\s+(?:finish|stop|end|quit)(?:[\s,]+(?:now|here|there|soon|already|right now|for now|for today|today|sorry))*\s*[.!]?$`, 'i');
function utteranceSentences(t: string): string[] {
  return t.split(/(?<=[.!?？。])\s*/).map((s) => s.trim()).filter(Boolean);
}
export function isFirmStop(studentText: string | null | undefined): boolean {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  if (t.split(/\s+/).length > 30) return false;
  const sentences = utteranceSentences(t);
  // an explicit stop sentence of 2+ words ("Let's stop here.", "Stop for today.") — never a bare "Stop." / "Bye."
  const explicitLong = (s: string) => isExplicitStop(s) && s.replace(/[^\p{L}\s'’]/gu, ' ').replace(/\b(?:please|ok(?:ay)?|yes|yeah|no|well|so|um+|uh+|thanks?|thank you)\b/gi, ' ').trim().split(/\s+/).length >= 2
    && !/^(?:(?:good)?bye|see you)/i.test(s.replace(STOP_PAD_RE, '').trim());
  if (sentences.some((s) => SESSION_STOP_RE.test(s) || PLEASE_END_RE.test(s) || LEAVING_RE.test(s) || MUST_FINISH_RE.test(s) || explicitLong(s))) return true;
  // "Okay, please stop. I would like to …": a please-stop beside another stop-shaped sentence
  return sentences.length > 1 && sentences.some((s) => PLEASE_STOP_RE.test(s)) && sentences.some((s) => !PLEASE_STOP_RE.test(s) && isStopRequestCore(s));
}
/** The soft stop request (a please-stop included) — whole utterance, no firm check. */
function isStopRequestCore(studentText: string): boolean {
  const t = studentText.trim();
  if (PLEASE_STOP_RE.test(t)) return true;
  const core = t.replace(STOP_PAD_RE, '').trim();
  if (QUESTION_END_RE.test(t) && !MODAL_REQUEST_RE.test(core)) return false;
  if (JA_PAST_DONE_RE.test(t)) return false;
  if (isStandaloneStopUtterance(t)) return true;
  if (core.split(/\s+/).length > 8) return false;
  return STOP_REQUEST_RE.test(core) || ENOUGH_RE.test(core);
}
export function isStopRequest(studentText: string | null | undefined): boolean {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  if (isFirmStop(t) || isStopRequestCore(t)) return true;
  if (QUESTION_END_RE.test(t) || JA_PAST_DONE_RE.test(t)) return false;
  return t.length <= 12 && /終わり|おわり/.test(t);
}
/**
 * Task 33 fix round 1 (B-1): once the engine has asked the stop choice
 * ("finish with <parts left>, or stop for today?"), "Let's finish." / "I'd
 * like to finish." / "I want to finish it." mean CONTINUE to the finish.
 * Only an EXPLICIT stop closes: stop (for today / here / now), no more, end
 * (it) here, that's enough, bye, やめ…, 終わりにします, 今日はここまで. A
 * "finish" word never is one. Pure.
 */
const EXPLICIT_STOP_RE =
  /^(?:(?:no|ok(?:ay)?|yes|yeah|well|so|um+|uh+|please|i think)[,\s]+)*(?:(?:let['’]?s |let us |i (?:want|would like|'d like|wanna) to |we can |can we |could we |shall we |i['’]d rather )?(?:stop|end(?: it)?|quit)(?: (?:here|now|for today|today|the lesson|please))*|no more(?: (?:today|for today|please))?|that['’]?s enough(?: for (?:today|now))?|(?:good)?bye|see you(?: (?:next time|later))?|stop,? please)[\s.!]*$/i;
const FINISH_WORD_RE = /\b(?:finish|finishing|complete|go on|continue|carry on)\b|最後まで|続け/i;
export function isExplicitStop(studentText: string | null | undefined): boolean {
  // Fix round 2: a stop phrased as a polite question ("Can we stop here?") is a stop.
  const t = (studentText ?? '').trim().replace(/[?？]+\s*$/, '').trim();
  if (!t || /^\s*\[/.test(t)) return false;
  if (/やめ|今日はここまで|終わりにします|終わりにしましょう/.test(t)) return true;
  if (FINISH_WORD_RE.test(t)) return false;
  return EXPLICIT_STOP_RE.test(t.replace(/\s*(?:thanks?(?: you)?(?: (?:so|very) much)?)[.!]?\s*$/i, '').trim());
}
/** Fix round 1 (B-1): the reply to the stop choice picks the finish path. */
export function choosesFinish(studentText: string | null | undefined): boolean {
  const t = (studentText ?? '').trim();
  return !!t && !isExplicitStop(t) && (FINISH_WORD_RE.test(t) || /\b(?:pronunciation|summary|yes|ok(?:ay)?|sure)\b/i.test(t));
}

/**
 * The STUDENT's session-end signal in Japanese: 今日はここまで / 終わりにします /
 * さようなら / 失礼します / また次回. The English list lives in
 * VoiceTutorRealtime's sessionEndSignalRegex (word-bounded); Japanese has no
 * word boundaries, so it is matched here and OR-ed in.
 */
export const SESSION_END_SIGNAL_JA_RE =
  /今日はここまで|ここまでにし|ここまでで(?:大丈夫|いい|結構)|終わりにし|終わります|もう終わり|やめます|さようなら|さよなら|失礼します|お疲れ(?:様|さま)|また次回|また今度/;

export function isSessionEndSignalJa(studentText: string): boolean {
  return SESSION_END_SIGNAL_JA_RE.test(studentText ?? '');
}

/**
 * After the close, end the session when the room goes quiet.
 *
 * embed-1792261973710 (2026-10-17): the lesson closed at 12:18 (the close tool
 * fired, the goodbye was said, a second student goodbye was silenced), and the
 * tab stayed open until 20:57. Nothing spoke, but the mic kept streaming to the
 * speech recogniser (which dropped and re-opened its socket after five silent
 * minutes), the recording kept uploading, and the saves kept running: eight
 * and a half minutes of paid recognition for a lesson that was over. Praveen
 * read the cost ticking up and the tutor as "stuck".
 *
 * Once the lesson is closed, a quiet LESSON_CLOSE_AUTO_END_MS ends the session
 * the way the End button does (no second goodbye — it was said). A student
 * who speaks after the close restarts the clock; while the tutor is still
 * talking, or a turn is in flight, the check waits.
 */
export const LESSON_CLOSE_AUTO_END_MS = 45_000;
export const LESSON_CLOSE_AUTO_END_RECHECK_MS = 5_000;

export type LessonCloseAutoEndDecision = 'end' | 'recheck';

export function decideLessonCloseAutoEnd(args: { busy: boolean; elapsedMs: number }): LessonCloseAutoEndDecision {
  if (args.busy) return 'recheck';
  return args.elapsedMs >= LESSON_CLOSE_AUTO_END_MS ? 'end' : 'recheck';
}

/**
 * Post-close gate (2026-10-18, embed-1792350642171, Kenji v4).
 *
 * After the mutual farewell, ChatGPT's own English chatter ("I'm sorry, I
 * couldn't pull the report…", "What do you prefer?") reached the mic. Only
 * pleasantries were silenced, so the tutor answered 「お気になさらずに」 and
 * then produced two turns of tool-call markup. Once the lesson is closed,
 * EVERY student utterance is silenced except an explicit continue / question
 * shape: 続けて / もう一つ / 質問 / 待って / a Japanese question ending in か or
 * ？ / "wait", "one more", "question", "continue", or an English question
 * with a question mark or an auxiliary-first shape. Those still get a turn
 * (with POST_CLOSE_NOTE, so the turn is a short answer, not bookkeeping).
 */
const POST_CLOSE_CONTINUE_RE = new RegExp(
  [
    '続け', '再開', 'もう(?:一|1|ひと)(?:つ|問|回|度|個)', '質問', '待っ', '聞きたい', '教えて', 'お願いがあ', 'いいですか', 'できますか',
    '[?？]', '(?:です|ます|でした|ません|ました|ない|る|た)か[。！!]?\\s*$',
    '\\b(?:wait|one more|question|continue|carry on|go on|hold on|not yet)\\b',
    '^\\s*(?:(?:um+|uh+|ok(?:ay)?|so|well|sorry|excuse me|えーと|あの)[,.、]?\\s+)?(?:can|could|would|will|do|does|did|is|are|was|were|should|may|how|what|why|where|when|which|who)\\s+(?:i|you|we|it|that|this|he|she|they|is|are|do|does|did|about)\\b',
  ].join('|'),
  'i',
);

export type PostCloseDecision = 'silence' | 'answer';

// 2026-10-18 (embed-1792361732296): after the goodbye, ChatGPT's own "What do
// you prefer?" carried a question mark and got a full answer about the sea
// and hiking. An ENGLISH utterance after the close is answered only when it
// is about the lesson — homework, the next lesson, a word, a question for the
// tutor, a wait/continue request. Japanese keeps the broader shapes: a
// Japanese question from this learner is theirs.
const POST_CLOSE_LESSON_EN_RE =
  /\b(?:homework|assignment|lesson|class|next (?:time|week|session)|practi[sc]e|review|question|word|phrase|sentence|mean|means|say|pronounce|spell|grammar|english|japanese|wait|hold on|one more|not yet|continue|carry on|go on|stop|end|finish|teacher|tutor|ryota)\b/i;

export function decidePostCloseUtterance(studentText: string): PostCloseDecision {
  const t = (studentText ?? '').trim();
  if (!t) return 'silence';
  const hasCjk = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(t);
  if (!hasCjk) return POST_CLOSE_LESSON_EN_RE.test(t) ? 'answer' : 'silence';
  if (POST_CLOSE_CONTINUE_RE.test(t)) return 'answer';
  return 'silence';
}

/** Why an utterance was silenced after the close — for the debug event. */
export function postCloseSilenceKind(studentText: string): 'pleasantry' | 'chatter' {
  return isPleasantryOnly(studentText) ? 'pleasantry' : 'chatter';
}

/**
 * Task 20 §B2 (GDI run 8, 1566 s): after the close the student asked "Can we
 * practice pronunciation little bit more?", the brain said "Of course… say it
 * after me" and armed a target — then his repeat was silenced as post-close
 * chatter and the auto-end ended the session. A post-close turn that arms a
 * pronunciation target, carries an ask, or asks a real question re-opens the
 * lesson (fixed-script plans only — the caller checks). Fix round 1 (I3): a
 * courtesy question ("Is there anything else you'd like to ask?", 「他に質問は
 * ありますか」) and a goodbye never do.
 */
const POST_CLOSE_COURTESY_RE =
  /\b(?:anything else|any (?:other |more )?questions?|is that (?:ok|okay|all right)|shall we (?:stop|finish)|ready to (?:finish|stop))\b|\b(?:tell|let) me (?:know )?if you (?:have|need) any(?: other| more)? (?:questions?|help)\b|他に|よろしいですか|終わりにしましょうか/i;
export function reopensAfterClose(tutorText: string, armed: boolean): boolean {
  const t = tutorText ?? '';
  if (isTutorFarewell(t)) return false;
  if (armed) return true;
  // Fix round 2 (I3): the courtesy check runs BEFORE the ask check — "Please
  // tell me if you have any other questions." is an ask in form only.
  const ask = lastAskSentence(t);
  if (ask != null && !POST_CLOSE_COURTESY_RE.test(ask)) return true;
  const q = lastQuestionSentence(t);
  return q != null && !POST_CLOSE_COURTESY_RE.test(q);
}

/** Heads every brain turn after the close (the same session: after the close
 *  the model re-ran its bookkeeping and wrote the tool calls out as text). */
export const POST_CLOSE_NOTE =
  '[runtime note — not from the student] The lesson is already closed and its closing notes are recorded. ' +
  'Do not call close_session_notes, mark_segment_complete or advance_lesson again, and do not start or resume an exercise. ' +
  'Answer what the student just asked in one or two sentences, in the language you have been using with them, and stop. ' +
  // Task 30 fix round 4 R3-7b (run r3 1354 s: "I'm sorry, but I can't continue the lesson now, because it has already closed.").
  'Reply with one warm goodbye line; never say the lesson is closed, ended, or that you cannot continue. ' +
  'Apply this silently; never mention this note.';

/**
 * The tutor announces the END OF THE DAY mid-lesson.
 *
 * embed-1792363895174 (2026-10-18, 03:26): 「今日の練習はここまでにしましょう」
 * at a segment transition, then four more minutes of teaching. The learner
 * (and the reviewer) heard the lesson end. A segment transition is 「次は…」;
 * 「今日はここまで」 belongs only to the turn that closes the lesson. While the
 * lesson is open, the student has not asked to stop, and the plan still has
 * more than one real segment to go, such a sentence is dropped from speech
 * and a one-line note follows the turn. Closing an EXERCISE (「この練習はここ
 * まで」) and a mid-lesson recap (「ここまでのポイント」) are not matched.
 */
export const PREMATURE_CLOSE_LINE_RE =
  /今日(?:の(?:練習|レッスン|授業|勉強))?は(?:ここまで|これで(?:終わり|おしまい|終了))/;

export function isPrematureCloseLine(
  sentence: string,
  ctx: { lessonClosed: boolean; studentEndSignal: boolean; closingStretch: boolean },
): boolean {
  if (ctx.lessonClosed || ctx.studentEndSignal || ctx.closingStretch) return false;
  const s = (sentence ?? '').trim();
  // A QUESTION is the recap's own ending (「続けますか、それとも今日はここまでに
  // しましょうか?」 — embed-1792367246990 dropped one): never a close.
  if (/[?？]\s*$/.test(s) || /(?:ましょうか|ますか|ですか|でしょうか)[」』]?\s*$/.test(s)) return false;
  return PREMATURE_CLOSE_LINE_RE.test(s);
}

/** Is the lesson in its closing stretch — the recap, the last segment, or the
 *  one before it (extensions do not count)? Unknown plan or segment ⇒ true,
 *  so the guard never drops a legitimate close it cannot place. */
export function inClosingStretch(
  plan: { segments: ReadonlyArray<{ id: string; kind: string }> } | null | undefined,
  segmentId: string | null | undefined,
): boolean {
  if (!plan || !segmentId) return true;
  const idx = plan.segments.findIndex((s) => s.id === segmentId);
  if (idx < 0) return true;
  if (plan.segments[idx]!.kind === 'recap' || plan.segments[idx]!.kind === 'extension') return true;
  const left = plan.segments.slice(idx + 1).filter((s) => s.kind !== 'extension').length;
  return left <= 1;
}

export const PREMATURE_CLOSE_NOTE =
  '[runtime note — not from the student] The lesson is not over, and a sentence in your last turn that announced the end of today\'s lesson was removed before the student heard it. ' +
  'A segment transition is 「次は…」 (one sentence, then the next item); 「今日はここまで」 and a closing summary belong only in the turn that calls close_session_notes. ' +
  'Apply this silently; never mention this note.';

/**
 * 2026-11-09 (Crimsora portal-6ed49162): the status a session row gets when the
 * page goes away without the End button. The tutor had closed the lesson and
 * said goodbye; the student closed the tab before the quiet
 * LESSON_CLOSE_AUTO_END_MS ran out, and the row read "abandoned" for a lesson
 * that finished. A lesson the tutor closed is a completed one. Not for a
 * session the student chose to discard: that save does not come through here.
 */
export function unloadSaveStatus(lessonClosed: boolean, enabled = true): 'completed' | 'abandoned' {
  return enabled && lessonClosed ? 'completed' : 'abandoned';
}
