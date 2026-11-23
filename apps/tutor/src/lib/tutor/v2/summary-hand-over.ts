/**
 * Tutor brain v2 — Task 8j (SUMMARY_HAND_OVER): the learner is not moved from a held optional part into the Summary without a
 * hand-over. Mic test 13 (embed-1795453600266, 17.7 min): the reply to the pronunciation score (the part held by 7x: 1 of 2 items, its
 * minutes not over) gave the result and the stress tip, then opened the Summary page, gave the summary and ended on the check question,
 * all in one reply: the 7x hold is facts only, and the reply's own `<board page>Summary</board>` opened the close.
 *
 * Fix round 1 (controller's rulings), turn.ts:
 *  - Held only there: a Summary page the model opens while the optional part in hand is held by 7x (v2OptionalHold), on a turn that is
 *    no closing turn (the wrap due, the time up, a stop asked, `end_lesson` because the student asked, a D1 release), and not after the
 *    reply's own words announced the summary (`beganNow`: the summary has begun). Every closing turn is as at 663fe546.
 *  - The held reply is not cut mid-promise: one bounded continuation call finishes the reply from the page on (the part's feedback,
 *    anything it announced, then the hand-over ask). Fallback (the call fails, times out, or writes the page again): the words before the
 *    page and the fixed hand-over line; the line is also added when the continuation does not end asking.
 *  - `end_lesson` on a held reply: deferred with the optional part's in-part prefix, so the deferral counts with 7v's (once in the part);
 *    when one was already given in the part, or the student asked, the page is not held.
 *  - The next reply: the Summary opens without the hold when the reply before carried the runtime's hand-over (state.summaryHandOver,
 *    the count of tutor replies when it was given; round-trips), or the part-release logic opens it on their go.
 * Pure, client-safe.
 */
import type { V2State } from './types';
import { v2TutorReplies } from './part-flow';

/** Task 7v's in-part deferral prefix (re-exported by turn.ts, where it was defined). */
export const V2_OPTIONAL_DEFER_IN_PREFIX = 'not ended yet, in the part:';

/** The fixed hand-over line (the fallback, or after a continuation that did not ask). */
export const V2_SUMMARY_HAND_OVER_LINE = 'Would you like one more, or shall we move on to the summary?';

/** The continuation call's instruction, sent after the reply as heard (cut just before the page). */
export const V2_HAND_OVER_CONTINUE = '[from the system running the session, not from the student] The Summary page was not opened, and nothing you wrote from it on was said: the student heard your reply only up to just before it. Continue the same reply from there, in at most two short sentences: finish what you were saying about this part (if you said you would show or say something, do it now), then ask whether they would like one more or to move on to the summary, and stop there. No summary, no Summary page, no check question, no goodbye, and no end_lesson.';

/** The outcome of `end_lesson` in a held reply: the optional part's in-part deferral (its prefix: counted with 7v's, once in the part). */
export const V2_HAND_OVER_DEFER = `${V2_OPTIONAL_DEFER_IN_PREFIX} the Summary page was not opened in this reply, which ends by asking whether they want one more or the summary. Say nothing of this message. Close after their answer.`;

/** Bounds of the continuation call. */
export const V2_HAND_OVER_MAX_TOKENS = 600;
export const V2_HAND_OVER_TIMEOUT_MS = 10000;

/** The reply before this turn carried the runtime's hand-over (state, not wording). */
export function v2HandedOver(state: Pick<V2State, 'summaryHandOver' | 'history'>): boolean {
  return typeof state.summaryHandOver === 'number' && state.summaryHandOver === v2TutorReplies(state.history);
}

/** An in-part deferral was already given in this lesson (7v's or this one's): the page is not held again for an `end_lesson`. */
export function v2InPartDeferredBefore(history: V2State['history']): boolean {
  return history.some((h) => Array.isArray(h.content) && h.content.some((c) => c.type === 'tool_result' && typeof c.content === 'string' && c.content.startsWith(V2_OPTIONAL_DEFER_IN_PREFIX)));
}
