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
  /** The plan's minutes add up to more than the box, and were scaled down to fit it. */
  fitted: boolean;
}

/** Which part of the plan should be running after `usedMin` minutes, by the parts' estimated minutes; fitted to the box
 *  when they add up to more. 'done': every part's time is past. null: a part that counts has no minutes. */
export function v2PartDueNow(plan: LessonPlan, goals: V2State['goals'], usedMin: number, boxMin?: number): V2PartDue | 'done' | null {
  const parts = plan.segments.filter((s) => goals[s.id]?.status !== 'skipped').map((s) => ({ seg: s, part: v2PartOf(s) }));
  if (!parts.length || parts.some(({ part }) => !part.minutes)) return null;
  const total = parts.reduce((t, { part }) => t + (part.minutes ?? 0), 0);
  const fitted = !!boxMin && total > boxMin;
  const scale = fitted ? boxMin! / total : 1;
  let at = 0;
  for (let i = 0; i < parts.length; i += 1) {
    const { seg, part } = parts[i];
    const to = at + (part.minutes ?? 0) * scale;
    if (usedMin < to) return { id: seg.id, ...(part.label ? { label: part.label } : {}), n: i + 1, of: parts.length, fromMin: Math.round(at), toMin: Math.round(to), fitted };
    at = to;
  }
  return 'done';
}

/** The facts line for where the lesson should be by the clock (facts.ts), or null. A lesson plan's parts carry their
 *  minutes and the tutor was told only the total used: a 20-minute partner sitting began its summary at 18:54
 *  (tester-2), and a timed lesson can overrun its box. Facts only: which part the minutes put
 *  here, not an order to move on. A discussion and homework are paced by their own lines. */
export function v2PartDueFact(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_TIME_BOX): string | null {
  if (!on || !session.plan || session.homework || session.homeworkSheet || discussionOf(session.plan)) return null;
  const usedMin = Math.max(0, (nowMs - state.startedAtMs) / 60000);
  const due = v2PartDueNow(session.plan, state.goals, usedMin, session.timeBoxMinutes);
  if (!due) return null;
  if (due === 'done') return 'by the plan\'s minutes: every part\'s time has passed';
  const within = due.fitted ? `, the plan's minutes fitted to the ${session.timeBoxMinutes}-minute box` : '';
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
  log?: (type: string, message: string) => void;
}

/** The stop at the box. With a goodbye: the turn stops, the speech under way finishes (bounded, then cut), the goodbye is
 *  said, and the session ends once it has been heard. Without one (the kill switch off, or the lesson already said its
 *  goodbye): cut and end at once, as before. */
export async function v2HardStop(s: V2HardStopSteps, farewell: string | null): Promise<void> {
  s.stopTurn();
  if (!farewell) { s.cut(); s.commit(); s.end(); return; }
  if (s.untilQuiet) {
    const quiet = await s.untilQuiet(V2_HARD_STOP_TAIL_MAX_MS);
    if (!quiet) { s.log?.('v2_time_limit_tail_cut', `speech still going after ${V2_HARD_STOP_TAIL_MAX_MS / 1000} s`); s.cut(); }
  }
  s.say(farewell);
  s.log?.('v2_time_limit_goodbye', farewell);
  s.commit();
  await s.afterGoodbye();
  s.end();
}
