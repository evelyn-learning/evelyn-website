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

/** Heads every brain turn after the close (the same session: after the close
 *  the model re-ran its bookkeeping and wrote the tool calls out as text). */
export const POST_CLOSE_NOTE =
  '[runtime note — not from the student] The lesson is already closed and its closing notes are recorded. ' +
  'Do not call close_session_notes, mark_segment_complete or advance_lesson again, and do not start or resume an exercise. ' +
  'Answer what the student just asked in one or two sentences, in the language you have been using with them, and stop. ' +
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
