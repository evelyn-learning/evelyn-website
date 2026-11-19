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
 *
 * Task 7f (the owner's decision after mic test 2, embed-1794941004529): the box is a target, not a cutoff. A taught lesson may run
 * TUTOR_V2_OVERRUN_MIN (5) minutes past it: "the time is up" and the hard stop move to target + margin (F); the parts keep
 * their own minutes (B); the tutor closes by itself when the plan's content is done or at the wrap minute, not at the box's
 * last fifth (D).
 */
import type { LessonPlan } from '../lesson-plan/types';
import { TUTOR_V2_CLOCK_FROM_START, TUTOR_V2_CLOSE_BY_CONTENT, TUTOR_V2_FLAG_CLOCK_PAUSE, TUTOR_V2_MORE_PRACTICE, TUTOR_V2_OPTIONAL_AT_ARRIVAL, TUTOR_V2_OVERRUN_MIN, TUTOR_V2_PART_ENTERED, TUTOR_V2_PART_MIN_PRACTICE, TUTOR_V2_TIME_BOX, TUTOR_V2_TIME_NO_SQUEEZE, TUTOR_V2_TIME_OVERRUN } from '../orchestrator/flags';
import { discussionOf } from './discussion';
import { v2IsPageOfPart, v2OfferedOut, v2PartEntered, v2PartIsOptional, v2PartOf } from './plan-map';
import { v2SummaryOpensClose } from './summary-close';
import type { V2Session, V2State } from './types';

/** Task 7g (CLOCK_FROM_START): the engine's clock starts with the session (the tap that opens it, or the first typed message:
 *  where the visible timer starts), not when the page mounted (useV2Turns' newV2State): mic test 2 (embed-1794941004529) ran
 *  about a minute ahead of the learner's timer. Only a session nothing has been said in: a resumed one keeps its start (and its
 *  true elapsed time). The same object when nothing changes. Every reader of `startedAtMs` (facts, time-box, turn, memory's
 *  duration, the hard stop's resume offset) then reads the session's start. */
export function v2StartClock(state: V2State, nowMs: number, enabled: boolean = TUTOR_V2_CLOCK_FROM_START): V2State {
  if (!enabled || state.history.length || state.closed || state.startedAtMs === nowMs) return state;
  return { ...state, startedAtMs: nowMs };
}

/** Task 7n (FLAG_CLOCK_PAUSE): the paused total is honoured only outside production. Only the tester's debug flag panel sets it,
 *  and that panel exists only in development (V2FlagBar V2_FLAGS_ON), so production has no legitimate sender (fix round 1, I2). */
export const V2_CLOCK_PAUSE_HONOURED = process.env.NODE_ENV !== 'production';
/** Task 7n (FLAG_CLOCK_PAUSE): the time the tester's debug flag panel has held the lesson clock (state.clockPausedMs); 0 with the
 *  switch off, in production, or for a malformed value. Fix round 1 (I2): never more than the wall time since the start (the
 *  lesson's minutes never go negative) nor than `capMs` (the box plus the margin, when the session has a box). Mic test 4
 *  (embed-1795028886172): 4.71 min of open flags made the wrap minute fire with ~14 min taught. */
export function v2ClockPausedMs(state: Pick<V2State, 'clockPausedMs' | 'startedAtMs'>, wallMs: number, capMs?: number, enabled: boolean = TUTOR_V2_FLAG_CLOCK_PAUSE, honoured: boolean = V2_CLOCK_PAUSE_HONOURED): number {
  const p = state.clockPausedMs;
  if (!enabled || !honoured || typeof p !== 'number' || !Number.isFinite(p) || p <= 0) return 0;
  const elapsed = Math.max(0, wallMs - state.startedAtMs);
  return Math.min(p, elapsed, typeof capMs === 'number' && Number.isFinite(capMs) && capMs > 0 ? capMs : Infinity);
}
/** Task 7n (FLAG_CLOCK_PAUSE): the lesson clock's "now": the wall clock less the paused time, never before the start. Every time
 *  rule of the turn reads this (time fit, wrap, time left, the stamps it writes); never billing or the recorded length (memory.ts
 *  reads the wall). `boxMin`: the session's box, so the pause is capped at the box plus the margin. */
export function v2LessonNowMs(wallMs: number, state: Pick<V2State, 'clockPausedMs' | 'startedAtMs'>, boxMin?: number, enabled: boolean = TUTOR_V2_FLAG_CLOCK_PAUSE, honoured: boolean = V2_CLOCK_PAUSE_HONOURED): number {
  const cap = typeof boxMin === 'number' && boxMin > 0 ? (boxMin + v2OverrunMin()) * 60000 : undefined;
  return wallMs - v2ClockPausedMs(state, wallMs, cap, enabled, honoured);
}
/** Task 7n (FLAG_CLOCK_PAUSE): the client's hard stop, re-armed after a pause: the stop minute less the lesson time used. */
export function v2HardStopDelayMs(stopMin: number, state: Pick<V2State, 'startedAtMs' | 'clockPausedMs'>, wallMs: number, honoured: boolean = V2_CLOCK_PAUSE_HONOURED): number {
  return Math.max(5000, stopMin * 60000 - (v2LessonNowMs(wallMs, state, stopMin, true, honoured) - state.startedAtMs));
}

/** Task 7f's switches, B to F, as one value: each its own flag (default on); tests pass some off for one turn. */
export interface V2TimeFlags { noSqueeze: boolean; minPractice: boolean; closeByContent: boolean; morePractice: boolean; overrun: boolean }
export function v2TimeFlags(o: Partial<V2TimeFlags> = {}): V2TimeFlags {
  return {
    noSqueeze: o.noSqueeze ?? TUTOR_V2_TIME_NO_SQUEEZE, minPractice: o.minPractice ?? TUTOR_V2_PART_MIN_PRACTICE,
    closeByContent: o.closeByContent ?? TUTOR_V2_CLOSE_BY_CONTENT, morePractice: o.morePractice ?? TUTOR_V2_MORE_PRACTICE, overrun: o.overrun ?? TUTOR_V2_TIME_OVERRUN,
  };
}

/** Task 7f F (TIME_OVERRUN): the minutes a v2 lesson may run past its box (the target). 0 with the switch off. */
export function v2OverrunMin(on: boolean = TUTOR_V2_TIME_OVERRUN): number { return on ? TUTOR_V2_OVERRUN_MIN : 0; }

/** Task 7f F: the minute of the runtime's hard stop (useV2Turns): the box plus the margin, never past `ceilingMin` (a partner
 *  pool's remaining balance) and never before the box. */
export function v2HardStopMinutes(boxMin: number, ceilingMin?: number, on: boolean = TUTOR_V2_TIME_OVERRUN): number {
  const stop = boxMin + v2OverrunMin(on);
  return typeof ceilingMin === 'number' && Number.isFinite(ceilingMin) && ceilingMin > 0 ? Math.max(boxMin, Math.min(stop, ceilingMin)) : stop;
}

/** A taught lesson: not homework, not a discussion (they keep their own time lines; the margin reaches only their hard stop). */
export const v2Taught = (session: Pick<V2Session, 'homework' | 'homeworkSheet' | 'plan'>) => !session.homework && !session.homeworkSheet && !discussionOf(session.plan);

/** Minutes left to the time-up reference: a taught lesson's box plus the overrun margin (Task 7f F: "the time is up" moves to
 *  target + margin), homework's and a discussion's box. Infinity with no box. */
export function v2LeftToStopMin(session: Pick<V2Session, 'timeBoxMinutes' | 'homework' | 'homeworkSheet' | 'plan'>, state: Pick<V2State, 'startedAtMs'>, nowMs: number, overrun: boolean = TUTOR_V2_TIME_OVERRUN): number {
  if (!session.timeBoxMinutes) return Infinity;
  return session.timeBoxMinutes + (v2Taught(session) ? v2OverrunMin(overrun) : 0) - (nowMs - state.startedAtMs) / 60000;
}

/** The wrap minute: the host's, else (Task 7f D, CLOSE_BY_CONTENT) two before the box, so the close by the clock still has a
 *  minute to come at. Undefined with no box, or no host wrap and the switch off (as before). */
export function v2WrapMin(session: Pick<V2Session, 'wrapMinutes' | 'timeBoxMinutes'>, fallback: boolean = TUTOR_V2_CLOSE_BY_CONTENT): number | undefined {
  if (!session.timeBoxMinutes) return undefined;
  if (typeof session.wrapMinutes === 'number' && session.wrapMinutes > 0) return session.wrapMinutes;
  return fallback ? Math.max(1, session.timeBoxMinutes - 2) : undefined;
}

/** Minutes left at or below which the time is up: the facts say so, a close is no longer argued with, and a page the
 *  closing reply opens is never held (turn.ts). Here, a leaf module, so close-invite.ts reads it too (facts.ts re-exports it). */
export const V2_TIME_UP_MIN = 1.5;

/** The clock lets the tutor close by itself: no box, or the box's last fifth (turn.ts applyControlTool's end_lesson rule; a
 *  student's request or a finished homework close at any time). Task 7d: the invitation to ask questions lives only here. */
export function v2CloseOpenByClock(session: Pick<V2Session, 'timeBoxMinutes'>, state: Pick<V2State, 'startedAtMs'>, nowMs: number): boolean {
  if (!session.timeBoxMinutes) return true;
  return session.timeBoxMinutes - (nowMs - state.startedAtMs) / 60000 <= session.timeBoxMinutes * 0.2;
}

/** Task 7f D (CLOSE_BY_CONTENT): the plan's content is done: every part before the last (the close's own) is done: a goal
 *  marked (shown, demonstrated or skipped: a part declined or passed is marked skipped), left out for time (B), a level check
 *  with the level known, a part the lesson has gone past (a later part's goal marked shown or demonstrated or, in a plan with part names, its page
 *  open), or an optional part offered twice and not taken up (declined). No plan: never by content. `requiredOnly`: optional
 *  parts aside (facts.ts: the close is near, so an optional part not reached is offered). */
/** Task 7i (PART_ENTERED, `enteredOn`): a later part counts as reached only when the lesson entered it (plan-map.ts
 *  v2PartEntered), never by a page alone nor when left out for time: the empty "Pronunciation" page of mic test 3
 *  (embed-1794967959470) made every part before it "done" from minute 0.83, and the close was open all lesson. */
export function v2PlanContentDone(plan: LessonPlan | undefined, state: Pick<V2State, 'goals' | 'board' | 'workingLevel' | 'history' | 'timeFit'> & Partial<Pick<V2State, 'practiceSaid'>>, requiredOnly = false, enteredOn: boolean = TUTOR_V2_PART_ENTERED): boolean {
  if (!plan || !plan.segments.length) return false;
  const segs = plan.segments;
  if (segs.length === 1) return !!state.goals[segs[0]!.id];
  const dropped = new Set(state.timeFit?.dropped ?? []);
  const out = v2OfferedOut(plan, state);
  const labelled = segs.every((seg) => !!v2PartOf(seg).label);
  const paged = (i: number) => labelled && state.board.pages.some((pg) => v2IsPageOfPart(segs[i]!, pg.title));
  const reachedAfter = (i: number) => segs.slice(i + 1, -1).some((seg, k) => (enteredOn
    ? (['shown', 'demonstrated'].includes(state.goals[seg.id]?.status ?? '') && !dropped.has(seg.id)) || (labelled && v2PartEntered(seg, state))
    : ['shown', 'demonstrated'].includes(state.goals[seg.id]?.status ?? '') || paged(i + 1 + k)));
  return segs.slice(0, -1).every((seg, i) => !!state.goals[seg.id] || dropped.has(seg.id) || (v2PartOf(seg).skipWhenLevelKnown && !!state.workingLevel)
    || (v2PartIsOptional(seg) && (requiredOnly || out.has(seg.id))) || reachedAfter(i));
}

/** Task 7f D: the tutor may begin the summary or end the lesson by itself: no box; the wrap minute reached (v2WrapMin); or the
 *  plan's content done (v2PlanContentDone). Homework keeps the last fifth (its own time line). `on` off: the last fifth, as
 *  before (v2CloseOpenByClock). Read by turn.ts (applyControlTool's end_lesson rule, the summary detection, the held summary
 *  page), close-invite.ts and facts.ts. */
export function v2CloseOpen(session: V2Session, state: Pick<V2State, 'startedAtMs' | 'goals' | 'board' | 'workingLevel' | 'history' | 'timeFit'> & Partial<Pick<V2State, 'practiceSaid' | 'summaryBegunAt' | 'closed'>>, nowMs: number, on: boolean = TUTOR_V2_CLOSE_BY_CONTENT): boolean {
  // Task 7w (SUMMARY_OPENS_CLOSE): once the tutor has begun the summary, the close is open, whatever the wrap minute (summary-close.ts).
  if (v2SummaryOpensClose(session, state)) return true;
  if (!on || session.homework || session.homeworkSheet) return v2CloseOpenByClock(session, state, nowMs);
  if (!session.timeBoxMinutes) return true;
  if (v2WrapDue(session, (nowMs - state.startedAtMs) / 60000, true, true)) return true;
  return v2PlanContentDone(session.plan, state);
}

/** How long the speech the tutor has under way at the box may run on before the goodbye. Bounded: a partner's minute
 *  pool is charged to the wall clock, with POOL_CHARGE_SLACK_SEC (120 s) of slack past the box. */
export const V2_HARD_STOP_TAIL_MAX_MS = 20000;

/** The session is past its wrap minute (the host's `sessionWrapMinutes`, two before the box). */
export function v2WrapDue(session: Pick<V2Session, 'wrapMinutes' | 'timeBoxMinutes'>, usedMin: number, on: boolean = TUTOR_V2_TIME_BOX, fallback: boolean = TUTOR_V2_CLOSE_BY_CONTENT): boolean {
  const wrap = v2WrapMin(session, fallback);
  return on && wrap !== undefined && usedMin >= wrap;
}

export interface V2PartDue {
  id: string; label?: string;
  /** 1-based, among the parts that count (a skipped part does not). */
  n: number; of: number;
  fromMin: number; toMin: number;
  /** The plan's minutes add up to something other than the box, and were scaled to it (never with TIME_NO_SQUEEZE). */
  fitted: boolean;
  /** The plan's own total, in minutes. */
  planMin: number;
}

/** Which part of the plan should be running after `usedMin` minutes of a `boxMin`-minute box, by the parts' estimated
 *  minutes scaled to the box both ways: a 26-minute plan is squeezed into 20, and a 15-minute plan in a 30-minute box
 *  runs at half speed (unscaled, it read "every part's time has passed" at 15 minutes beside "about 15 left, which is
 *  time for more", review 5a I2). 'done': the box's time is past. null: no box (nothing to pace to), or a part that
 *  counts has no minutes. */
export function v2PartDueNow(plan: LessonPlan, goals: V2State['goals'], usedMin: number, boxMin?: number, opts: { fit?: boolean; dropped?: readonly string[]; levelKnown?: boolean } = {}): V2PartDue | 'done' | null {
  if (!boxMin || !(boxMin > 0)) return null;
  // Task 7f B (TIME_NO_SQUEEZE): the parts keep their own minutes, and a part left out for time takes none.
  const fit = opts.fit ?? !TUTOR_V2_TIME_NO_SQUEEZE;
  const dropped = new Set(opts.dropped ?? []);
  // Task 7i (OPTIONAL_AT_ARRIVAL, `levelKnown`): a level check skipped for a level known from an earlier lesson takes no minutes,
  // marked skipped or not (the time fit's accounting, time-fit.ts v2CountedMinutes).
  const parts = plan.segments.filter((s) => goals[s.id]?.status !== 'skipped' && !dropped.has(s.id) && !(opts.levelKnown && v2PartOf(s).skipWhenLevelKnown)).map((s) => ({ seg: s, part: v2PartOf(s) }));
  if (!parts.length || parts.some(({ part }) => !part.minutes)) return null;
  const total = parts.reduce((t, { part }) => t + (part.minutes ?? 0), 0);
  const fitted = fit && total !== boxMin;
  const scale = fit ? boxMin / total : 1;
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
export function v2PartDueFact(session: V2Session, state: V2State, nowMs: number, timeUp: boolean, on: boolean = TUTOR_V2_TIME_BOX, noSqueeze: boolean = TUTOR_V2_TIME_NO_SQUEEZE): string | null {
  if (!on || !session.plan || !session.timeBoxMinutes || session.homework || session.homeworkSheet || discussionOf(session.plan)) return null;
  const usedMin = Math.max(0, (nowMs - state.startedAtMs) / 60000);
  const due = v2PartDueNow(session.plan, state.goals, usedMin, session.timeBoxMinutes, { fit: !noSqueeze, dropped: noSqueeze ? state.timeFit?.dropped : [], levelKnown: TUTOR_V2_OPTIONAL_AT_ARRIVAL && state.workingLevel?.from === 'earlier_lesson' });
  if (!due) return null;
  // Task 7f B: unscaled, the line is a guide: it never cuts a part short (the practice a part needs comes first).
  const head = noSqueeze ? 'by the plan\'s minutes (a guide only: never a reason to cut a part short or skip its practice)' : 'by the plan\'s minutes';
  if (due === 'done') return timeUp || v2WrapDue(session, usedMin, on) ? `${head}: every part's time has passed` : null;
  const within = due.fitted ? `, the plan's ${due.planMin} minutes fitted to the ${session.timeBoxMinutes}-minute box` : '';
  return `${head}: [${due.id}]${due.label ? ` ${due.label}` : ''} would be running now (part ${due.n} of ${due.of}, minutes ${due.fromMin}–${due.toMin}${within})`;
}

/** The lesson's time line in the facts, after "time: N min used of about B; " (facts.ts). Task 7f: "the time is up" at the box
 *  plus the margin (F); the close by content or the wrap minute, never the box's last fifth (D). Both off: as before. */
export function v2LessonTimeLine(session: V2Session, state: Pick<V2State, 'startedAtMs'>, nowMs: number, o: { summaryBegun: boolean; closeOpen: boolean; tf: V2TimeFlags }): string {
  const box = session.timeBoxMinutes!;
  const used = (nowMs - state.startedAtMs) / 60000;
  const left = box - used;
  const leftStop = left + (o.tf.overrun ? v2OverrunMin(true) : 0);
  const n = Math.round(left);
  if (leftStop <= V2_TIME_UP_MIN) return 'the time is up';
  if (v2WrapDue(session, used, TUTOR_V2_TIME_BOX, o.tf.closeByContent)) {
    return left > 0.5 ? `about ${Math.max(1, n)} minutes left: finish this exchange, then summary` : 'the planned time is reached: finish this exchange properly, then summary (there are a few minutes past it to finish well, not for new work)';
  }
  if (!o.tf.closeByContent) {
    if (left > box * 0.2) return o.summaryBegun ? `about ${n} left` : `about ${n} left, which is time for more: the lesson is not at its close unless the student asks to stop`;
    return left > 0.5 ? `about ${n} left: the close is near` : 'the planned time is reached: the close is near';
  }
  if (o.summaryBegun) return `about ${n} left`;
  if (o.closeOpen) return `about ${n} left; the plan's parts are done, so the summary may begin`;
  return `about ${n} left, which is time for more: the lesson is not at its close unless the student asks to stop`;
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
