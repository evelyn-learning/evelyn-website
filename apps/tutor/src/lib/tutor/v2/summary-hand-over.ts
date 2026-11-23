/**
 * Tutor brain v2 — Task 8j (SUMMARY_HAND_OVER): the learner is never moved from a part into the Summary without a hand-over.
 * Mic test 13 (embed-1795453600266, 17.7 min): the reply to the pronunciation score gave the result and the stress tip, then opened
 * the Summary page, gave the summary and ended on the check question, all in one reply, with the optional part held (1 of 2 items) and
 * no "one more, or move on?" asked. The hold of 7x is facts only, and the reply's own `<board page>Summary</board>` opened the close.
 *
 * By position (turn.ts): in a part-flow lesson the Summary page written in a reply is held, and that reply ends with the hand-over,
 * unless the hand-over was already given (the last reply's last two sentences name the summary: an ask, or "we are moving to the
 * summary now"), their words just now go for the summary (the part ask's go), they asked to stop, the summary began earlier, or the
 * hard stop is near (within V2_TIME_UP_MIN of the box plus its margin: the existing "the time is up" of time-box.ts). The page opens on
 * the next reply. Nothing is refused; no lesson state moves on the phrase reading (it only decides whether a page turns now).
 * Pure, client-safe.
 */
import type { LessonPlan } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { V2_CLOSING_PAGE } from './part-close';
import { v2PartNamedIn } from './plan-map';
import type { V2State } from './types';

const SENTENCES = /(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/;

/** The last reply handed over to the summary: its last two sentences name it (the plan's closing part by its name or a localized
 *  name, or a summary word). */
export function v2HandedOverToSummary(plan: LessonPlan, lastTutor: string): boolean {
  const last = plan.segments[plan.segments.length - 1];
  const tail = stripBoardBlocks(lastTutor).split(SENTENCES).map((x) => x.trim()).filter(Boolean).slice(-2).join(' ');
  if (!tail) return false;
  return V2_CLOSING_PAGE.test(tail) || (!!last && v2PartNamedIn(last, tail));
}

/** Which hand-over: `more` (an optional part in hand that still has time: one more item, or the summary), `ask` (go on to the
 *  summary?), `now` (the time is up: we move to the summary now; it opens on the next reply). */
export type V2SummaryHandOver = 'more' | 'ask' | 'now';

const LINES: Record<V2SummaryHandOver, string[]> = {
  more: ['Would you like one more, or shall we move on to the summary?', 'One more, or shall we go to the summary now?'],
  ask: ['Shall we move on to the summary?', 'Shall we go to the summary now?'],
  now: ["We're almost out of time, so we'll move on to the summary now.", "Time is nearly up, so let's go to the summary now."],
};

/** The runtime's hand-over line: never an earlier reply's words when another is left. */
export function v2SummaryHandOverLine(kind: V2SummaryHandOver, history: V2State['history']): string {
  const said = history.filter((h) => h.role === 'assistant').map((h) => (typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '))).join(' ');
  return LINES[kind].find((x) => !said.includes(x)) ?? LINES[kind][0]!;
}
