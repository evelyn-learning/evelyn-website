/**
 * Tutor brain v2 — Task 7u (CLOSE_CHECK): the plan's closing check question is its own step.
 *
 * Mic test 6 (embed-1795067373124, 18.8 min): the plan's summary says "(3) Ask the check question: 'Before we finish, can you
 * explain the difference between these two sentences? I have worked here for five years. I worked here five years ago. …'", but
 * the close lines allowed one question in the summary reply and named it the questions invitation (7d), so the tutor stated the
 * difference itself and asked "Do you have any questions before we finish?". Now, by state:
 *  - the plan's closing part holds a check question (its teacher note quotes it after "check question"): while the 7d invitation
 *    is owed and none was asked, the facts say the summary reply ENDS on that question as a question card and does not answer it,
 *    and gives no invitation (the 7d owed line is replaced); an end_lesson there is refused with that in place of the invitation;
 *  - the reply that ended asking it (a question card painted, or its last sentence a question that is not the invitation) records
 *    state.closeCheck.askedAt; the learner's next words are the answer: the facts say short feedback, then the invitation (the 7d
 *    flow, deferred by exactly that one reply); that turn records answeredAt;
 *  - a silence turn there gets 7r's silence-after-ask line (a hint, never the answer) and no invitation line;
 *  - owed only before the summary has begun (state.summaryBegunAt) and while the close is not reopened (7k);
 *  - with V2_CLOSE_CHECK_MIN or less beyond the 7d time-up minute to the hard stop, the check is skipped and the invitation is as
 *    before. Nothing here ends or keeps the lesson open by itself: end_lesson is never refused for the check alone.
 * Spoken lessons that teach a language with a labelled plan, where 7d applies. Pure, client-safe.
 */
import { TUTOR_V2_ANSWER_OVER_ASK, TUTOR_V2_CLOSE_CHECK, TUTOR_V2_CLOSE_SUMMARY_ONCE, TUTOR_V2_UNHEARD_ASK_OWED } from '../orchestrator/flags';
import type { LessonPlan } from '../lesson-plan/types';
import { v2CloseInviteOn, v2CloseInviteOwed } from './close-invite';
import { v2NoteTargetsOn } from './note-targets';
import { v2NoMoreAnswer, v2PlanLabelled } from './part-flow';
import { v2SummaryOpensCloseOn } from './summary-close';
import { V2_TIME_UP_MIN, v2LeftToStopMin } from './time-box';
import type { V2Session, V2State } from './types';

/** The minutes the check takes beyond the time-up minute: with less left to the hard stop, it is skipped. */
export const V2_CLOSE_CHECK_MIN = 1;

/** The check question the plan's closing part quotes in its teacher note ("…check question: '…'"), or null. A quote closes on a
 *  mark of punctuation followed by the quote and a space or the end, so "I'll" inside it does not end it. */
export function v2PlanCheckQuestion(plan: LessonPlan | null | undefined): string | null {
  const last = plan?.segments[plan.segments.length - 1] as { teacherNote?: unknown } | undefined;
  const note = typeof last?.teacherNote === 'string' ? last.teacherNote : '';
  const m = /check question\s*[:：]?\s*['"‘“]([\s\S]{8,400}?[.?!])['"’”](?=\s|$)/i.exec(note);
  const q = m?.[1]?.replace(/\s+/g, ' ').trim();
  return q && /\?/.test(q) ? q : null;
}

/** The lessons it applies to. `enabled` is the kill switch. */
export function v2CloseCheckOn(session: V2Session, enabled: boolean = TUTOR_V2_CLOSE_CHECK): boolean {
  return enabled && v2CloseInviteOn(session) && v2NoteTargetsOn(session) && v2PlanLabelled(session.plan) && !!v2PlanCheckQuestion(session.plan);
}

/** `summaryNow`: Task 7w (SUMMARY_OPENS_CLOSE), the summary began in this very reply (turn.ts). `opensClose`: that switch (tests). */
/** `unheardOwed`: Task 7z (UNHEARD_ASK_OWED), tests (default: the flag). */
type Ctx = { nowMs: number; stopAsked: boolean; closeByContent?: boolean; overrun?: boolean; enabled?: boolean; summaryNow?: boolean; opensClose?: boolean; unheardOwed?: boolean };

/** The check is owed now: the invitation is owed (7d), the check was never asked, and there is time for it. */
export function v2CloseCheckOwed(session: V2Session, state: V2State, ctx: Ctx): boolean {
  // Only before the summary has begun, and never once the close was reopened (7k): the check belongs to the summary reply.
  // Task 7w (SUMMARY_OPENS_CLOSE): the summary reply itself (begun in this reply), and the reply after one that skipped it, once.
  const late = v2SummaryOpensCloseOn(session, ctx.opensClose) && (ctx.summaryNow === true || typeof state.closeCheckLate === 'number');
  if (!v2CloseCheckOn(session, ctx.enabled) || state.closeCheck || (typeof state.summaryBegunAt === 'number' && !late) || typeof state.closeReopened === 'number') return false;
  // Fix round 2 (N1): the check step's one deferral, given after the summary began, was spent: the check is dropped (the invitation follows).
  if (v2SummaryOpensCloseOn(session, ctx.opensClose) && typeof state.closeCheckDeferredAt === 'number') return false;
  if (!v2CloseInviteOwed(session, state, { nowMs: ctx.nowMs, stopAsked: ctx.stopAsked, closeByContent: ctx.closeByContent, overrun: ctx.overrun })) return false;
  return v2LeftToStopMin(session, state, ctx.nowMs, ctx.overrun) > V2_TIME_UP_MIN + V2_CLOSE_CHECK_MIN;
}

/** The check was asked and not answered yet (no invitation given since). */
export function v2CloseCheckPending(session: V2Session, state: V2State, enabled: boolean = TUTOR_V2_CLOSE_CHECK): boolean {
  return v2CloseCheckOn(session, enabled) && !state.closed && typeof state.closeCheck?.askedAt === 'number' && typeof state.closeCheck.answeredAt !== 'number' && typeof state.closeInvitedAt !== 'number';
}

export const v2CloseCheckAskLine = (q: string) => `closing check: there is time for the plan's check question, so the reply that gives the summary does not end the lesson and does not ask whether they have questions: it ENDS on the check question, on a question card (a <board problem> block holding the question and the sentences it asks about, after the summary's cards), and it does not give the answer or explain the difference (that is its one question; no goodbye). The check question: ${JSON.stringify(q)}. After their answer you give short feedback and then ask whether they have any questions before you finish`;
export const V2_CLOSE_CHECK_ANSWER_LINE = 'closing check: your last reply asked the check question, and their words just now are their answer. Give short feedback on it (right, or in a sentence or two what the difference is), then end this reply with one question, in your own words, asking whether they have any questions before you finish (that is its one question; no goodbye in it). The lesson ends on their answer to that';
/** Task 7z (UNHEARD_ASK_OWED): added to the answer line. Mic test 8 (embed-1795115593161, T102–T103): he read the card's two sentences
 *  aloud and was praised for explaining the difference "in your own words". */
export const V2_CLOSE_CHECK_READ_BACK = 'Reading the card\'s sentences back is not an explanation: if their words only repeat the sentences on the card, do not praise an explanation; instead ask once more, in one short question, for the difference in their own words (that question then ends this reply, and the invitation comes after their next answer)';
/** The answer line, with the read-back sentence under UNHEARD_ASK_OWED. */
export const v2CloseCheckAnswerLine = (enabled: boolean = TUTOR_V2_UNHEARD_ASK_OWED) => (enabled ? `${V2_CLOSE_CHECK_ANSWER_LINE}. ${V2_CLOSE_CHECK_READ_BACK}` : V2_CLOSE_CHECK_ANSWER_LINE);
/** An end_lesson refused while the check is owed (7d's refusal, with the check in place of the invitation). */
export const V2_CLOSE_CHECK_REFUSAL = 'not ended: there is time for the check question. Say nothing of this message or of the clock, and say no goodbye now. If you have not given the summary, give it; then end this reply with the plan\'s check question on a question card, without its answer. Close after their answer and your questions invitation.';
/** Task 8d (CLOSE_SUMMARY_ONCE): the check's refusal once the summary has been given: it never asks for the summary again. */
export const V2_CLOSE_CHECK_REFUSAL_GIVEN = 'not ended: there is time for the check question. Say nothing of this message or of the clock, and say no goodbye now. The summary has been given: do not give it again or recap it. End this reply with the plan\'s check question on a question card, without its answer. Close after their answer and your questions invitation.';
export function v2CloseCheckRefusal(summaryGiven: boolean, enabled: boolean = TUTOR_V2_CLOSE_SUMMARY_ONCE): string {
  return enabled && summaryGiven ? V2_CLOSE_CHECK_REFUSAL_GIVEN : V2_CLOSE_CHECK_REFUSAL;
}

/** The facts for the check, and whether they stand in place of the 7d invitation line this turn. `heard`: their words this turn
 *  (null or empty on a silence turn). */
export function v2CloseCheckFacts(session: V2Session, state: V2State, ctx: Ctx & { heard: string | null | undefined }): { lines: string[]; replacesInvite: boolean } {
  if (!v2CloseCheckOn(session, ctx.enabled) || state.closed || ctx.stopAsked) return { lines: [], replacesInvite: false };
  if (v2CloseCheckPending(session, state, ctx.enabled ?? TUTOR_V2_CLOSE_CHECK)) {
    // A silence turn: the check stands (the silence-after-ask line gives a hint, never the answer), and no invitation yet.
    return ctx.heard?.trim() ? { lines: [v2CloseCheckAnswerLine(ctx.unheardOwed)], replacesInvite: true } : { lines: [], replacesInvite: true };
  }
  if (v2CloseCheckOwed(session, state, ctx)) return { lines: [v2CloseCheckAskLine(v2PlanCheckQuestion(session.plan)!)], replacesInvite: true };
  return { lines: [], replacesInvite: false };
}

/** The route's reading of the client's copy: anything malformed is dropped. */
export function v2ReadCloseCheck(raw: unknown): V2State['closeCheck'] | undefined {
  const c = raw as { askedAt?: unknown; answeredAt?: unknown } | null | undefined;
  if (!c || typeof c !== 'object' || typeof c.askedAt !== 'number' || !Number.isFinite(c.askedAt) || c.askedAt <= 0) return undefined;
  return { askedAt: c.askedAt, ...(typeof c.answeredAt === 'number' && Number.isFinite(c.answeredAt) && c.answeredAt > 0 ? { answeredAt: c.answeredAt } : {}) };
}

/** Task 7w (SUMMARY_OPENS_CLOSE): the line beside the summary page's layout line, before the close is open by the clock: the reply that
 *  gives the summary ends on the check question (the 7u ask line). Null where the check does not apply, was asked, or there is no time. */
export function v2CloseCheckSummaryLine(session: V2Session, state: V2State, ctx: Ctx): string | null {
  if (!v2SummaryOpensCloseOn(session, ctx.opensClose) || !v2CloseCheckOn(session, ctx.enabled) || state.closed || ctx.stopAsked || state.closeCheck || typeof state.closeInvitedAt === 'number' || typeof state.closeReopened === 'number' || typeof state.summaryBegunAt === 'number' || !session.timeBoxMinutes) return null;
  if (v2LeftToStopMin(session, state, ctx.nowMs, ctx.overrun) <= V2_TIME_UP_MIN + V2_CLOSE_CHECK_MIN) return null;
  return v2CloseCheckAskLine(v2PlanCheckQuestion(session.plan)!);
}

/** Task 7w: the route's reading of closeCheckLate. */
export function v2ReadCloseCheckLate(raw: unknown): number | undefined {
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : undefined;
}

/** Task 7w fix round 2 (b): the Question card of a check the runtime asks: the question and the sentences after it that it asks about,
 *  not the plan's words to the learner after them ("Take your time; I'll help you if you need it."): a sentence addressing the learner
 *  ("you", "your") after the question ends the card. The whole wording is spoken. */
export function v2CheckCardText(q: string): string {
  const parts = q.replace(/\s+/g, ' ').trim().split(/(?<=[.?!])\s+/);
  const at = parts.findIndex((x) => x.includes('?'));
  if (at < 0) return q.trim();
  const out = [parts[at]!];
  for (const x of parts.slice(at + 1)) { if (/\b(?:you|your|you'll|you're)\b/i.test(x)) break; out.push(x); }
  return out.join(' ');
}

/** Task 7w fix round 2: the route's reading of closeCheckDeferredAt. */
export function v2ReadCloseCheckDeferred(raw: unknown): number | undefined {
  return typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? raw : undefined;
}

/** Task 7z (UNHEARD_ASK_OWED): before the turn (mutates `state`): a close step the last reply gave whose ask the learner did not hear is
 *  not counted as given and is owed again. Fix round 1 (I2, ruling): decided by state and position only, never by the words: the reply
 *  that recorded the step left `closeAskLast` (the step and its last sentence), and that last sentence is among the sentences the learner
 *  did not hear (state.unheard, the client's record of a barge-in). The invitation: closeInvitedAt clears (7d owes it again). The check
 *  (asked, not answered): its record clears, and once the summary has begun it is owed in this reply (closeCheckLate, used up after it).
 *  Fix round 1 (I1, ruling): each step is owed again at most once (closeReowed); after its second ask it counts as given, heard or not.
 *  Never when their words ask to stop. Mic test 8 (embed-1795115593161, T103: the invitation cut 0.8 s in, counted asked; the next reply
 *  said goodbye). `closeAskLast` is used up here every turn. Returns what it re-owed. */
/** Task 8d (ANSWER_OVER_ASK, `said` / `overAsk`): the invitation was the sentence playing when they cut in (the first unheard sentence) and
 *  their words are a plain "no questions" (part-flow.ts v2NoMoreAnswer): it counts as heard and answered, is not owed again, and the
 *  "not heard" line is not sent (state.unheard clears: the invitation and what followed it). Any other answer, or an invitation that was not the sentence playing, as before. */
export function v2UnheardCloseAsks(session: V2Session, state: V2State, ctx: { nowMs: number; stopAsked: boolean; enabled?: boolean; said?: string | null; languages?: readonly string[]; overAsk?: boolean }): { invite: boolean; check: boolean } {
  const none = { invite: false, check: false };
  const last = state.closeAskLast; delete state.closeAskLast;
  if (!(ctx.enabled ?? TUTOR_V2_UNHEARD_ASK_OWED) || !last || ctx.stopAsked || state.closed || !state.unheard?.length || !v2CloseInviteOn(session)) return none;
  if ((state.closeReowed ?? []).includes(last.step)) return none;
  const key = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (!key(last.last) || !state.unheard.some((x) => key(x) === key(last.last))) return none;
  if ((ctx.overAsk ?? TUTOR_V2_ANSWER_OVER_ASK) && last.step === 'invite' && typeof state.closeInvitedAt === 'number' && key(state.unheard[0]!) === key(last.last) && v2NoMoreAnswer(ctx.said ?? null, ctx.languages)) {
    // The invitation was the first sentence they did not hear: it and whatever followed it ("if not, we'll finish here") are answered.
    delete state.unheard;
    return none;
  }
  if (last.step === 'invite' && typeof state.closeInvitedAt === 'number') {
    delete state.closeInvitedAt; delete state.closeAsk;
    state.closeReowed = [...(state.closeReowed ?? []), 'invite'];
    return { invite: true, check: false };
  }
  if (last.step === 'check' && state.closeCheck && typeof state.closeCheck.answeredAt !== 'number' && typeof state.closeInvitedAt !== 'number') {
    delete state.closeCheck; if (typeof state.summaryBegunAt === 'number') state.closeCheckLate = ctx.nowMs;
    state.closeReowed = [...(state.closeReowed ?? []), 'check'];
    return { invite: false, check: true };
  }
  return none;
}

/** Task 7z fix round 1 (I2): after the reply (mutates `state`): the close step this reply recorded (closeInvitedAt or closeCheck.askedAt
 *  set to this turn's time) and the reply's last sentence, for the next turn's v2UnheardCloseAsks. */
export function v2NoteCloseAskLast(state: V2State, nowMs: number, lastSentence: string, enabled: boolean = TUTOR_V2_UNHEARD_ASK_OWED): void {
  if (!enabled || state.closed || !lastSentence.trim()) return;
  if (state.closeInvitedAt === nowMs) state.closeAskLast = { step: 'invite', last: lastSentence.trim() };
  else if (state.closeCheck?.askedAt === nowMs && typeof state.closeCheck.answeredAt !== 'number') state.closeAskLast = { step: 'check', last: lastSentence.trim() };
}
