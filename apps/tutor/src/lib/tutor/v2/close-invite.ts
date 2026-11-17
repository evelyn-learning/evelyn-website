/**
 * Tutor brain v2 — questions before the close (Task 7d, CLOSE_INVITES_QUESTIONS).
 *
 * Mic test 1 (embed-1794882458629, 17.57 of a 20-minute box): the summary, the goodbye and end_lesson came in one reply with
 * 2.4 minutes left, and the learner had no chance to ask a question (the partner's checklist has "the student invited to
 * ask questions"). end_lesson was accepted because the box's last fifth had begun (turn.ts applyControlTool): nothing
 * asked for a question first.
 *
 * Now, in a spoken plan-led second-language lesson (the gate of the 6e close guards, narrowed to language lessons), while
 * more than the time-up minute is left (facts.ts V2_TIME_UP_MIN; at or under it the time is up, and the close is as before)
 * and the learner has not asked to stop:
 *  - the facts say the summary reply ends with one invitation to ask questions and does not end the lesson;
 *  - an end_lesson before the invitation is refused, once, with what to do instead (its goodbye is dropped: reply-gate.ts);
 *  - the invitation is recorded (state.closeInvitedAt) when that refusal is given, or when a reply near the close ends by
 *    asking whether they have questions; from then on the close is never refused for it (answered or ignored, the lesson can always end),
 *    and the facts say to answer briefly, then say goodbye and close.
 * The next-time line (Task 6g) waits for the reply that closes. Pure.
 */
import { TUTOR_V2_CLOSE_INVITES_QUESTIONS } from '../orchestrator/flags';
import { discussionOf } from './discussion';
import { endsAsking } from './part-close';
import type { V2Session, V2State } from './types';

/** Minutes left at or below which the time is up (facts.ts V2_TIME_UP_MIN, repeated here: facts.ts reads this module). */
const TIME_UP_MIN = 1.5;

/** The lessons it applies to: spoken, plan-led, taught (not homework, not a discussion), in a second language (two teaching
 *  languages, or pronunciation practice). `enabled` is the kill switch. */
export function v2CloseInviteOn(session: V2Session, enabled: boolean = TUTOR_V2_CLOSE_INVITES_QUESTIONS): boolean {
  return enabled && session.mode === 'voice' && !!session.plan && !session.homework && !session.homeworkSheet && !discussionOf(session.plan)
    && ((session.languages?.length ?? 0) >= 2 || !!session.pronunciation);
}

/** The invitation is still owed: the lesson is one it applies to, not closed, not yet invited, the box has more than the
 *  time-up minute left, and the learner has not asked to stop. */
export function v2CloseInviteOwed(session: V2Session, state: V2State, ctx: { nowMs: number; stopAsked: boolean; enabled?: boolean }): boolean {
  if (!v2CloseInviteOn(session, ctx.enabled) || state.closed || typeof state.closeInvitedAt === 'number' || ctx.stopAsked || !session.timeBoxMinutes) return false;
  const left = session.timeBoxMinutes - (ctx.nowMs - state.startedAtMs) / 60000;
  return left > TIME_UP_MIN;
}

/** The result of an end_lesson refused for the invitation. Said as the tutor's own next step, as the other refused closes are. */
export const V2_CLOSE_INVITE_REFUSAL = 'not ended: there is time for their questions. Say nothing of this message or of the clock, and say no goodbye now. If you have not given the summary, give it; then end this reply with one short question, in your own words and in the lesson\'s language, asking whether they have any questions before you finish. Close after their answer.';

/** The facts line: the invitation owed near the close, or given. `near`: the close is near (the box's last fifth, the wrap
 *  minute, or the summary has begun). */
export function v2CloseInviteFacts(session: V2Session, state: V2State, ctx: { nowMs: number; stopAsked: boolean; near: boolean; enabled?: boolean }): string[] {
  if (!v2CloseInviteOn(session, ctx.enabled) || state.closed) return [];
  if (typeof state.closeInvitedAt === 'number') return ['questions before the close: you have asked whether they have any questions before you finish. If they asked one, answer it briefly; then say goodbye and end the lesson in this reply'];
  if (!ctx.near || !v2CloseInviteOwed(session, state, ctx)) return [];
  return ['questions before the close: there is time for their questions, so the reply that gives the summary does not end the lesson: it ends with one question, in your own words, asking whether they have any questions before you finish (that is its one question; no goodbye in it). The lesson ends on their answer'];
}

/** A question about their questions ("Any questions before we finish?", 「何か質問はありますか？」). */
const INVITES = /\b(?:any|a|some|other|more) (?:last |final |other |more )?questions?\b|\bquestions? (?:for me|before)\b|質問/i;
/** The reply's last sentence invites their questions: it asks, and asks about questions. */
export function v2ReplyInvites(lastSentence: string): boolean {
  return endsAsking(lastSentence.trim(), true) && INVITES.test(lastSentence);
}
