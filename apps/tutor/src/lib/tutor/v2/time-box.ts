/**
 * Tutor brain v2 — the time box: where the lesson should be by the clock, the wrap minute, and the stop at the box.
 *
 * The box is the session's minutes as the host gives them: the tighter of the link's own box and a partner minute
 * pool's cap (partner-pool.ts `poolTimeBox`, embed page), with the wrap minute two before it. The tutor is told the
 * time in every turn's facts (facts.ts), the wrap among them; the runtime speaks only at the box itself: a fixed
 * goodbye, after any speech the tutor had under way. Under TUTOR_V2_TIME_BOX.
 *
 * On v1 the wrap was a line the client spoke into the lesson ("We've got about two minutes left, so let's finish
 * this one."), and it cut into the menu the tutor was reading (tester-2 at 18:26). And v2 ended at the box in the
 * middle of a sentence with no goodbye.
 */
import type { LessonPlan } from '../lesson-plan/types';
import { TUTOR_V2_TIME_BOX } from '../orchestrator/flags';
import { discussionOf } from './discussion';
import { v2PartOf } from './plan-map';
import type { V2Session, V2State } from './types';

/** Minutes left at or below which the time is up: the facts say so, a close is no longer argued with, and a page the
 *  closing reply opens is never held (turn.ts). Here, a leaf module, so close-invite.ts reads it too (facts.ts re-exports it). */
export const V2_TIME_UP_MIN = 1.5;

/** The clock lets the tutor close by itself: no box, or the box's last fifth (turn.ts applyControlTool's end_lesson rule; a
 *  student's request or a finished homework close at any time). Task 7d: the invitation to ask questions lives only here. */
export function v2CloseOpenByClock(session: Pick<V2Session, 'timeBoxMinutes'>, state: Pick<V2State, 'startedAtMs'>, nowMs: number): boolean {
  if (!session.timeBoxMinutes) return true;
  return session.timeBoxMinutes - (nowMs - state.startedAtMs) / 60000 <= session.timeBoxMinutes * 0.2;
}

/** How long the speech the tutor has under way at the box may run on before the goodbye. Bounded: a partner's minute
 *  pool is charged to the wall clock, with POOL_CHARGE_SLACK_SEC (120 s) of slack past the box. */
export const V2_HARD_STOP_TAIL_MAX_MS = 20000;

/** The session is past its wrap minute (the host's `sessionWrapMinutes`, two before the box). */
export function v2WrapDue(session: Pick<V2Session, 'wrapMinutes' | 'timeBoxMinutes'>, usedMin: number, on: boolean = TUTOR_V2_TIME_BOX): boolean {
  return on && !!session.timeBoxMinutes && typeof session.wrapMinutes === 'number' && session.wrapMinutes > 0 && usedMin >= session.wrapMinutes;
}

export interface V2PartDue {
  id: string; label?: string;
  /** 1-based, among the parts that count (a skipped part does not). */
  n: number; of: number;
  fromMin: number; toMin: number;
  /** The plan's minutes add up to something other than the box, and were scaled to it. */
  fitted: boolean;
  /** The plan's own total, in minutes. */
  planMin: number;
}

/** Which part of the plan should be running after `usedMin` minutes of a `boxMin`-minute box, by the parts' estimated
 *  minutes scaled to the box both ways: a 26-minute plan is squeezed into 20, and a 15-minute plan in a 30-minute box
 *  runs at half speed (unscaled, it read "every part's time has passed" at 15 minutes beside "about 15 left, which is
 *  time for more", review 5a I2). 'done': the box's time is past. null: no box (nothing to pace to), or a part that
 *  counts has no minutes. */
export function v2PartDueNow(plan: LessonPlan, goals: V2State['goals'], usedMin: number, boxMin?: number): V2PartDue | 'done' | null {
  if (!boxMin || !(boxMin > 0)) return null;
  const parts = plan.segments.filter((s) => goals[s.id]?.status !== 'skipped').map((s) => ({ seg: s, part: v2PartOf(s) }));
  if (!parts.length || parts.some(({ part }) => !part.minutes)) return null;
  const total = parts.reduce((t, { part }) => t + (part.minutes ?? 0), 0);
  const fitted = total !== boxMin;
  const scale = boxMin / total;
  let at = 0;
  for (let i = 0; i < parts.length; i += 1) {
    const { seg, part } = parts[i];
    const to = at + (part.minutes ?? 0) * scale;
    if (usedMin < to) return { id: seg.id, ...(part.label ? { label: part.label } : {}), n: i + 1, of: parts.length, fromMin: Math.round(at), toMin: Math.round(to), fitted, planMin: total };
    at = to;
  }
  return 'done';
}

/** The facts line for where the lesson should be by the clock (facts.ts), or null. A lesson plan's parts carry their
 *  minutes and the tutor was told only the total used: a 20-minute partner sitting began its summary at 18:54
 *  (tester-2), and a timed lesson can overrun its box. Facts only: which part the minutes put
 *  here, not an order to move on. A discussion and homework are paced by their own lines; a lesson with no box has
 *  nothing to pace to. `timeUp`: the facts' time-up window (facts.ts V2_TIME_UP_MIN); "every part's time has passed" is
 *  said only then or past the wrap minute, never while the box has time left. */
export function v2PartDueFact(session: V2Session, state: V2State, nowMs: number, timeUp: boolean, on: boolean = TUTOR_V2_TIME_BOX): string | null {
  if (!on || !session.plan || !session.timeBoxMinutes || session.homework || session.homeworkSheet || discussionOf(session.plan)) return null;
  const usedMin = Math.max(0, (nowMs - state.startedAtMs) / 60000);
  const due = v2PartDueNow(session.plan, state.goals, usedMin, session.timeBoxMinutes);
  if (!due) return null;
  if (due === 'done') return timeUp || v2WrapDue(session, usedMin, on) ? 'by the plan\'s minutes: every part\'s time has passed' : null;
  const within = due.fitted ? `, the plan's ${due.planMin} minutes fitted to the ${session.timeBoxMinutes}-minute box` : '';
  return `by the plan's minutes: [${due.id}]${due.label ? ` ${due.label}` : ''} would be running now (part ${due.n} of ${due.of}, minutes ${due.fromMin}–${due.toMin}${within})`;
}

/** What the session does at the box. Each step is the caller's (useV2Turns); this is their order. */
export interface V2HardStopSteps {
  /** Stop the running brain turn: no more of its words. */
  stopTurn: () => void;
  /** Voice: resolves once the tutor's speech has finished (true), or at `maxMs` with speech still going (false). */
  untilQuiet?: (maxMs: number) => Promise<boolean>;
  /** Stop speaking now. */
  cut: () => void;
  /** The goodbye: into the transcript, and spoken. */
  say: (line: string) => void;
  /** The student's profile commit. */
  commit: () => void;
  /** Wait for the goodbye to be heard (or read). */
  afterGoodbye: () => Promise<void>;
  end: () => void;
  /** The session has already ended some other way (the End button, the host's end, the page going away): checked after
   *  each wait, so a stop no longer wanted says no goodbye, commits nothing more and does not end it twice (review 5a I1). */
  ended?: () => boolean;
  log?: (type: string, message: string) => void;
}

/** The stop at the box. With a goodbye: the turn stops, the speech under way finishes (bounded, then cut), the goodbye is
 *  said, and the session ends once it has been heard. Without one (the kill switch off, or the lesson already said its
 *  goodbye): cut and end at once, as before. */
export async function v2HardStop(s: V2HardStopSteps, farewell: string | null): Promise<void> {
  s.stopTurn();
  if (!farewell) { s.cut(); s.commit(); s.end(); return; }
  const gone = (where: string) => { if (!s.ended?.()) return false; s.log?.('v2_time_limit_superseded', `the session ended ${where}: the stop at the box does nothing more`); return true; };
  if (s.untilQuiet) {
    const quiet = await s.untilQuiet(V2_HARD_STOP_TAIL_MAX_MS);
    if (gone('while the last words played')) return;
    if (!quiet) { s.log?.('v2_time_limit_tail_cut', `speech still going after ${V2_HARD_STOP_TAIL_MAX_MS / 1000} s`); s.cut(); }
  }
  s.say(farewell);
  s.log?.('v2_time_limit_goodbye', farewell);
  s.commit();
  await s.afterGoodbye();
  if (gone('while the goodbye played')) return;
  s.end();
}
