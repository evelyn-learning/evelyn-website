/**
 * Tutor brain v2 — questions before the close (Task 7d, CLOSE_INVITES_QUESTIONS).
 *
 * Mic test 1 (embed-1794882458629, 17.57 of a 20-minute box): the summary, the goodbye and end_lesson came in one reply with
 * 2.4 minutes left, and the learner had no chance to ask a question (the partner's checklist has "the student invited to
 * ask questions"). end_lesson was accepted because the box's last fifth had begun (turn.ts applyControlTool): nothing
 * asked for a question first.
 *
 * Now, in a spoken plan-led second-language lesson (the gate of the 6e close guards, narrowed to language lessons), while a
 * close is open (time-box.ts v2CloseOpen: Task 7f D, the plan's content done or the wrap minute; with CLOSE_BY_CONTENT off the
 * box's last fifth, the rule applyControlTool already uses)
 * and more than the time-up minute is left (at or under it the time is up, and the close is as before), and the learner
 * has not asked to stop:
 *  - the facts say the summary reply ends with one invitation to ask questions and does not end the lesson;
 *  - an end_lesson before the invitation is refused with what to do instead (its goodbye is dropped: reply-gate.ts); a
 *    second one in the same reply ends the turn there, open, on the invitation (fix round 1, I2);
 *  - final review I2: an end_lesson in a reply that already ends on the invitation is answered WAIT (the turn ends there,
 *    open), never "ask whether they have questions" again (two invitations back to back); a refused close whose reply then
 *    ends on no question gets the runtime's invitation (V2_CLOSE_INVITE_LINE), spoken and stored;
 *  - the invitation is recorded (state.closeInvitedAt) only when the reply's last sentence spoken is one, and (final review
 *    I3) the summary has begun (an earlier reply, a closing page, or this reply's own words): a bare "any questions?" during
 *    pronunciation closed the lesson with no summary. From then on the close is never refused for it (answered or ignored,
 *    the lesson can always end), and the facts say to answer briefly (the summary first if none was given), then close.
 * Earlier than the last fifth an "any questions?" is an ordinary question: it records nothing, and the close is refused as it
 * was before this task (fix round 1, I1: an invitation recorded at 12 min had the facts say "end the lesson in this reply"
 * every turn while the close was refused every turn).
 * The next-time line (Task 6g) waits for the reply that closes; the runtime's goodbye at the box carries it when no reply did
 * (v2HardStopNextTime). Pure.
 */
import { TUTOR_V2_CLOSE_INVITES_QUESTIONS, TUTOR_V2_CLOSE_REOPENED, TUTOR_V2_CLOSE_SUMMARY_ONCE } from '../orchestrator/flags';
import type { LessonPlan } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { discussionOf } from './discussion';
import { V2_CLOSING_PAGE, endsAsking } from './part-close';
import { v2NextTimeLine } from './plan-map';
import { v2HandsOver, v2ReplySentences } from './one-question';
import { isPartFrame } from './reply-gate';
import { V2_TIME_UP_MIN, v2CloseOpen, v2LeftToStopMin } from './time-box';
import type { V2Session, V2State } from './types';

type Gate = Pick<V2Session, 'mode' | 'plan' | 'homework' | 'homeworkSheet' | 'languages' | 'pronunciation'>;

/** The lessons it applies to: spoken, plan-led, taught (not homework, not a discussion), in a second language (two teaching
 *  languages, or pronunciation practice). `enabled` is the kill switch. */
export function v2CloseInviteOn(session: Gate, enabled: boolean = TUTOR_V2_CLOSE_INVITES_QUESTIONS): boolean {
  return enabled && session.mode === 'voice' && !!session.plan && !session.homework && !session.homeworkSheet && !discussionOf(session.plan)
    && ((session.languages?.length ?? 0) >= 2 || !!session.pronunciation);
}

/** The invitation is owed now: the lesson is one it applies to, not closed, not yet invited, the clock lets the tutor close
 *  (the box's last fifth), more than the time-up minute is left, and the learner has not asked to stop. */
export function v2CloseInviteOwed(session: V2Session, state: V2State, ctx: { nowMs: number; stopAsked: boolean; enabled?: boolean; closeByContent?: boolean; overrun?: boolean }): boolean {
  if (!v2CloseInviteOn(session, ctx.enabled) || state.closed || typeof state.closeInvitedAt === 'number' || ctx.stopAsked || !session.timeBoxMinutes) return false;
  // Task 7f: the time-up minute is at the box plus the margin (F), and the close opens by content or the wrap minute (D).
  return v2LeftToStopMin(session, state, ctx.nowMs, ctx.overrun) > V2_TIME_UP_MIN && v2CloseOpen(session, state, ctx.nowMs, ctx.closeByContent);
}

/** The result of an end_lesson refused for the invitation. Said as the tutor's own next step, as the other refused closes are. */
export const V2_CLOSE_INVITE_REFUSAL = 'not ended: there is time for their questions. Say nothing of this message or of the clock, and say no goodbye now. If you have not given the summary, give it; then end this reply with one short question, in your own words and in the lesson\'s language, asking whether they have any questions before you finish. Close after their answer.';
/** Task 8d (CLOSE_SUMMARY_ONCE): the refusal once the summary has been given (a closing page, or state.summaryBegunAt): it never asks for
 *  the summary again. Mic test 10 (embed-1795202398886, T93: the refusal's "If you have not given the summary, give it" with the Summary
 *  page up, and the summary was given a second time). */
export const V2_CLOSE_INVITE_REFUSAL_GIVEN = 'not ended: there is time for their questions. Say nothing of this message or of the clock, and say no goodbye now. The summary has been given: do not give it again or recap it. End this reply with one short question, in your own words and in the lesson\'s language, asking whether they have any questions before you finish. Close after their answer.';
/** The refusal for the invitation: without the summary clause once the summary has been given (`enabled`: the kill switch). */
export function v2CloseInviteRefusal(summaryGiven: boolean, enabled: boolean = TUTOR_V2_CLOSE_SUMMARY_ONCE): string {
  return enabled && summaryGiven ? V2_CLOSE_INVITE_REFUSAL_GIVEN : V2_CLOSE_INVITE_REFUSAL;
}
/** Task 8d (CLOSE_SUMMARY_ONCE): the summary has been given: its closing page was opened and holds at least one card or note (fix round 1,
 *  M1, ruling: a closing page opened with nothing on it, or a summary only recorded by words, still has the summary asked for). */
export function v2SummaryGiven(state: Pick<V2State, 'board'>): boolean {
  return state.board.pages.some((pg) => V2_CLOSING_PAGE.test(pg.title) && pg.items.length > 0);
}
/** Task 8d (CLOSE_SUMMARY_ONCE): the goodbye after the summary is short. */
export const V2_SUMMARY_GIVEN_GOODBYE = 'the summary has been given: do not give it again and recap nothing of what went well or what to improve; thank them and say goodbye in one or two sentences';
/** Task 8d: the owed line once the summary has been given (the reply that gave it did not end on the invitation). */
export const V2_CLOSE_INVITE_OWED_GIVEN_LINE = 'questions before the close: the summary has been given, so do not give it again or recap it. There is time for their questions: answer what they said briefly, then end this reply with one question, in your own words, asking whether they have any questions before you finish (that is its one question; no goodbye in it). The lesson ends on their answer';
/** Task 8d: the invitation given after the summary: answer, then the short goodbye. */
export const V2_CLOSE_INVITED_GIVEN_LINE = `questions before the close: you have asked whether they have any questions before you finish. If they asked one, answer it briefly; then say goodbye and end the lesson in this reply. ${V2_SUMMARY_GIVEN_GOODBYE[0]!.toUpperCase()}${V2_SUMMARY_GIVEN_GOODBYE.slice(1)}`;
/** Task 8d: they asked to stop after the summary: the goodbye in this reply, short. */
export const V2_SUMMARY_GIVEN_STOP_LINE = `questions before the close: they asked to finish. ${V2_SUMMARY_GIVEN_GOODBYE}, and end the lesson in this reply`;

/** Final review I2: the runtime's own invitation, said when a refused close leaves the reply ending on no question (the
 *  model's next call was only a goodbye, or nothing). Spoken and stored, so the lesson never hands over with no question. */
export const V2_CLOSE_INVITE_LINE = 'Do you have any questions before we finish?';
/** …and a second end_lesson in the same reply: the turn ends there, the lesson open, waiting for their answer (fix round 1, I2). */
export const V2_CLOSE_INVITE_WAIT = 'not ended: wait for their answer to your question. Say nothing of this message.';

/** The facts line: the invitation owed, or given (only while the clock lets the tutor close: never "end the lesson in this
 *  reply" where the close would be refused). */
/** Task 7z (UNHEARD_ASK_OWED): the line when the invitation the last reply gave did not reach them (v2UnheardCloseAsks re-owed it). */
export const V2_CLOSE_INVITE_UNHEARD_LINE = 'questions before the close: your question whether they have any questions before you finish did not reach them (they spoke over it), so it is still owed. Answer what they said first (if it answers your check question, short feedback on it), then end this reply by asking it again, in new words (that is its one question; no goodbye in it). The lesson ends on their answer to it';
/** `inviteUnheard`: Task 7z, the invitation was re-owed this turn because it was not heard. */
export function v2CloseInviteFacts(session: V2Session, state: V2State, ctx: { nowMs: number; stopAsked: boolean; enabled?: boolean; closeByContent?: boolean; overrun?: boolean; reopenedOn?: boolean; moreTime?: boolean; inviteUnheard?: boolean; summaryOnce?: boolean }): string[] {
  if (!v2CloseInviteOn(session, ctx.enabled) || state.closed) return [];
  // Final review I3: the summary is part of the close; when no summary has begun (no summary page, no summary reply), it comes
  // first, in a few words.
  const summaryGiven = typeof state.summaryBegunAt === 'number' || state.board.pages.some((pg) => V2_CLOSING_PAGE.test(pg.title));
  // Task 8d (CLOSE_SUMMARY_ONCE): `once`: the summary given is never asked for again, and the goodbye after it is short.
  const once = (ctx.summaryOnce ?? TUTOR_V2_CLOSE_SUMMARY_ONCE) && v2SummaryGiven(state);
  // …a learner who asks to finish after the summary gets the goodbye in this reply (end_lesson is never deferred for a stop).
  if (once && ctx.stopAsked) return [V2_SUMMARY_GIVEN_STOP_LINE];
  // Task 7k (CLOSE_REOPENED): the close reopened and no ask given since: no goodbye pressed; after the practice, ask.
  if (v2CloseReopened(state, ctx.reopenedOn)) {
    return !ctx.stopAsked && !!session.timeBoxMinutes && v2LeftToStopMin(session, state, ctx.nowMs, ctx.overrun) > V2_TIME_UP_MIN ? [v2CloseReopenedLine(summaryGiven)] : [];
  }
  // Fix round 1 (I2): the ask was "more, or finish?": their answer is read by the model, and no goodbye is pressed.
  // Fix round 2 (N2): only while there is time for more (`moreTime`: more than V2_MORE_PRACTICE_MIN_LEFT to the hard stop);
  // otherwise the normal close.
  if (v2MoreAskAnswered(state, ctx.reopenedOn)) return [ctx.moreTime !== false && !ctx.stopAsked ? V2_MORE_ASK_ANSWER_LINE : V2_MORE_ASK_NO_TIME_LINE];
  if (typeof state.closeInvitedAt === 'number') return v2CloseOpen(session, state, ctx.nowMs, ctx.closeByContent) ? [once ? V2_CLOSE_INVITED_GIVEN_LINE : `questions before the close: you have asked whether they have any questions before you finish. If they asked one, answer it briefly; ${summaryGiven ? '' : 'if you have not given the summary yet, give it in a few words first; '}then say goodbye and end the lesson in this reply`] : [];
  if (!v2CloseInviteOwed(session, state, ctx)) return [];
  if (ctx.inviteUnheard) return [V2_CLOSE_INVITE_UNHEARD_LINE];
  if (once) return [V2_CLOSE_INVITE_OWED_GIVEN_LINE];
  return ['questions before the close: there is time for their questions, so the reply that gives the summary does not end the lesson: it ends with one question, in your own words, asking whether they have any questions before you finish (that is its one question; no goodbye in it). The lesson ends on their answer'];
}

/** Task 7k (CLOSE_REOPENED): the close was reopened (the learner spoke over the closing words, or asked for more practice or
 *  another part after the invitation: turn.ts) and no ask has been given since. `enabled` is the kill switch. */
export function v2CloseReopened(state: Pick<V2State, 'closeReopened' | 'closeInvitedAt' | 'closed'>, enabled: boolean = TUTOR_V2_CLOSE_REOPENED): boolean {
  return enabled && !state.closed && typeof state.closeReopened === 'number' && typeof state.closeInvitedAt !== 'number';
}

/** Task 7k fix round 1 (I2): the recorded ask was "more, or finish?" (state.closeAsk) and the lesson is open: this turn answers
 *  it. "Yes, please.", "Keep going." or 「はい、お願いします。」 brought back the goodbye line (review I2); no phrase list decides. */
export function v2MoreAskAnswered(state: Pick<V2State, 'closeAsk' | 'closeInvitedAt' | 'closed'>, enabled: boolean = TUTOR_V2_CLOSE_REOPENED): boolean {
  return enabled && !state.closed && typeof state.closeInvitedAt === 'number' && state.closeAsk === 'more';
}
export const V2_MORE_ASK_NO_TIME_LINE = 'questions before the close: you asked whether they would like more practice or to finish, and there is no time left for more today: thank them, say so in one short sentence if they want more, then say goodbye and end the lesson in this reply';
export const V2_MORE_ASK_ANSWER_LINE = 'questions before the close: you asked whether they would like more practice or to finish. If they want more, give one more practice (on the page of the part it is about: its page block first) and do not end the lesson; otherwise say goodbye and end the lesson in this reply';

/** Task 7k: the facts line while the close is reopened (mic test 3, embed-1794967959470, flag 8: "it's always in a hurry to end
 *  … it should ask: are you done, do you want more, or shall we end it here?"). */
export function v2CloseReopenedLine(summaryGiven: boolean): string {
  return `the close is reopened: they asked for more (or spoke over your goodbye), so no goodbye and no end of the lesson in this reply. Do what they asked: a practice they asked for, give it and end on its question. Once they have answered a practice and you have given your feedback, end that reply with one short question, in your own words, asking whether they would like more practice or to finish (no goodbye in it${summaryGiven ? '; the summary was given already: never offer it again' : ''}). The lesson ends on their answer to that question`;
}

/** Task 7k: the result of an end_lesson deferred because the close was reopened (once per ask, as the 7d invitation's). */
export const V2_CLOSE_REOPEN_REFUSAL = 'not ended: they asked for more. Say nothing of this message and say no goodbye now. If they have just asked for a practice, give it and end on its question; if they have answered one, give your feedback and end this reply with one short question, in your own words and in the lesson\'s language, asking whether they would like more practice or to finish. Close after their answer.';
/** Task 7k: the runtime's ask, said when a deferred close leaves the reply ending on no question. */
export const V2_CLOSE_MORE_LINE = 'Would you like some more practice, or shall we finish here?';

/** Task 7k: the reply's last sentence asks whether they want more or to finish ("Would you like more practice, or shall we
 *  finish here?", "Do you want to try another one, or are you done?", 「もう少し練習しますか、それとも終わりにしますか？」). */
export function v2ReplyAsksMoreOrFinish(lastSentence: string): boolean {
  const s = lastSentence.trim().replace(/[‘’]/g, "'");
  if (!endsAsking(s, true)) return false;
  return (/\b(?:more|another|again|keep going|continue|carry on)\b/i.test(s) && /\b(?:finish|end|stop|done|wrap (?:it )?up|leave it|call it a day)\b/i.test(s))
    || (/もっと|もう少し|もう一|続け/.test(s) && /終わ|終了|おしまい/.test(s));
}

/** The invitation's shape (fix round 1, M3): "Any questions before we finish?", "Do you have any (other) questions?", "Is there
 *  anything you'd like to ask?", 「何か質問はありますか？」; never "Can you answer a question for me about your project?", nor the
 *  mid-lesson check-in "Any questions so far?". */
const INVITES = [
  /^(?:\w+[,.!]?\s+){0,3}(?:(?:do|did) you have|have you got|are there|(?:is|was) there)?\s*(?:any|a few|some)\s+(?:(?:last|final|other|more|further)\s+)?questions?\b(?:\s+(?:for me|before (?:we|i) (?:finish|end|stop|go|close)|about (?:today|the lesson|anything|what we did)|at all))?\s*(?:,\s*or[^?]*)?\?["'”’)]*$/i,
  /^(?:\w+[,.!]?\s+){0,3}(?:is there )?anything (?:else )?(?:you(?:'d| would) like to ask|you want to ask)(?: (?:me|before (?:we|i) (?:finish|end)))?\?["'”’)]*$/i,
  /(?:何か|ほかに|他に)?(?:質問|聞きたいこと)(?:は|が)(?:あります|ありません)か[。？?]?\s*$/u,
];
/** The reply's last sentence invites their questions. Curly apostrophes read as straight ones (final review M3). Never a
 *  part-change frame (「次に進みますか、それとも先に質問がありますか？」 ends as the Japanese invitation does): it asks whether
 *  to go on. */
export function v2ReplyInvites(lastSentence: string): boolean {
  const s = lastSentence.trim().replace(/[‘’]/g, "'");
  return endsAsking(s, true) && INVITES.some((re) => re.test(s)) && !isPartFrame(s, true);
}

/** Task 8d (CLOSE_SUMMARY_ONCE): the invitation a reply gave: its last QUESTION sentence when that invites their questions (a statement
 *  after it, 「なければ、ここで終わりにします。」 / "If not, we'll finish here.", does not undo it: by position, with the existing matcher);
 *  with `lastQuestion` off (the kill switch), only its last sentence, as before. Null: none. Mic test 10 (embed-1795202398886, T91). */
export function v2InviteOfReply(text: string, lastQuestion: boolean = TUTOR_V2_CLOSE_SUMMARY_ONCE): string | null {
  const sentences = v2ReplySentences(stripBoardBlocks(text));
  if (!lastQuestion) { const at = sentences[sentences.length - 1]; return at && v2ReplyInvites(at) ? at : null; }
  const i = sentences.map((x) => endsAsking(x, true)).lastIndexOf(true);
  const at = i >= 0 ? sentences[i]! : '';
  // …and nothing after it hands the turn over ("Any questions? If not, please say the sentence once more." ends on that ask).
  return at && v2ReplyInvites(at) && !sentences.slice(i + 1).some((x) => v2HandsOver(x)) ? at : null;
}

/** The next-time line for the runtime's goodbye at the box (useV2Turns armHardStop), when the summary began and no reply said
 *  it (the line waited for the reply that closes, and the box came first: fix round 1, M10). Null otherwise. */
export function v2HardStopNextTime(session: Gate, plan: LessonPlan | null | undefined, state: V2State, enabled: boolean = TUTOR_V2_CLOSE_INVITES_QUESTIONS): string | null {
  if (!plan || !v2CloseInviteOn({ ...session, plan }, enabled) || typeof state.summaryBegunAt !== 'number' || state.closed) return null;
  const said = state.history.filter((h) => h.role === 'assistant').map((h) => stripBoardBlocks(typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' ')))
    .flatMap((t) => t.split(/(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/)).filter((x) => /\bnext time\b|次回|次の機会/i.test(x)).join(' ');
  return v2NextTimeLine(plan, state, said);
}
