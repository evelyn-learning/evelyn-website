/**
 * Tutor brain v2 — Task 7f: no rushing a lesson to fit the clock (the owner's decisions after mic test 2, embed-1794941004529:
 * a 25-minute plan in a 20-minute box had every part thinned to one learner sentence, the summary began at 15.9 minutes with
 * two parts not taught, and "Can we do some more practice?" was refused).
 *
 *  B (TIME_NO_SQUEEZE): when the plan's minutes do not fit the box, its OPTIONAL parts are left out, last first, until the rest
 *    fits (v2PartsToDrop). Decided once, when the first teaching part opens (not during the level check), and the facts ask the
 *    tutor to tell the learner once that time does not allow them today. They are named as next time at the close (plan-map's
 *    next-time line names an optional part not taken up) and carried to the next session (memory.ts). If even the required
 *    parts do not fit, nothing is thinned: the lesson goes as far as it gets, and the rest is named as next time at the close.
 *  C (PART_MIN_PRACTICE): in a spoken lesson with a labelled plan, a practice part is not closed until the learner has said at
 *    least V2_MIN_PRACTICE practice sentences of their own in it, unless they ask to move on. Counted here (state.practiceSaid,
 *    round-tripped), told in the facts, and held in turn.ts (no goal marked done, no part ask, no next page).
 *  E (MORE_PRACTICE): when a learner's words look like a request for more practice once the summary has begun, or at the
 *    close, the facts say it is allowed while more than V2_MORE_PRACTICE_MIN_LEFT minutes remain to the hard stop, otherwise
 *    that there is no time left today. It informs only (fix round 4): the model decides, and no close is refused for it.
 * Pure.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { v2LearnerSentence } from './learner-card';
import { v2AsksPartChange, v2EndingPartAsk, v2MoveAnswer, v2NextPart, v2OpenPagePart, v2PartInHand, v2PartViewed, v2PlanLabelled } from './part-flow';
import { v2IsPageOfPart, v2OfferedOut, v2PartEntered, v2PartIsOptional, v2PartNamedIn, v2PartOf } from './plan-map';
import { v2OverrunMin, v2Taught } from './time-box';
import { v2WithoutFillers } from './language-pack';
import { TUTOR_V2_CLOSE_REOPENED, TUTOR_V2_OPTIONAL_AT_ARRIVAL, TUTOR_V2_OPTIONAL_FIT, TUTOR_V2_PART_ASK_LANGS, TUTOR_V2_PART_CLOCK, TUTOR_V2_PRACTICE_ON_PART_PAGE, TUTOR_V2_STAY_IN_PART, TUTOR_V2_TIME_NO_SQUEEZE } from '../orchestrator/flags';
import type { V2Session, V2State } from './types';

/** The practice sentences of their own a practice part needs before it closes (Task 7f C). */
export const V2_MIN_PRACTICE = 2;
/** More practice asked for at the close is given while more than this many minutes remain to the hard stop (Task 7f E). */
export const V2_MORE_PRACTICE_MIN_LEFT = 3;
/** The facts ask the tutor to tell the learner about the parts left out at most this many turns (Task 7f B). */
export const V2_DROP_TELL_TURNS = 2;

/** The plan parts left out for time: the optional parts (never the last, the close's own), last first, until the minutes of
 *  the parts still in it fit `boxMin`. Parts marked skipped, and a level check whose level is known, take no minutes. Empty
 *  when the plan fits, a part has no minutes, or there is no box. */
export function v2PartsToDrop(plan: LessonPlan, state: Pick<V2State, 'goals' | 'workingLevel'>, boxMin: number | undefined): string[] {
  if (!boxMin || !(boxMin > 0) || plan.segments.length < 2) return [];
  const counted = plan.segments.filter((seg) => state.goals[seg.id]?.status !== 'skipped' && !(v2PartOf(seg).skipWhenLevelKnown && state.workingLevel));
  if (counted.some((seg) => !v2PartOf(seg).minutes)) return [];
  let total = counted.reduce((t, seg) => t + (v2PartOf(seg).minutes ?? 0), 0);
  const last = plan.segments[plan.segments.length - 1]!;
  const dropped: string[] = [];
  for (const seg of [...counted].reverse()) {
    if (total <= boxMin + 1e-9) break;
    if (seg === last || !v2PartIsOptional(seg)) continue;
    dropped.push(seg.id); total -= v2PartOf(seg).minutes ?? 0;
  }
  return dropped;
}

/** Task 7i: a part whose minutes count: not marked skipped, not left out for time, not a level check whose level is known from
 *  an earlier lesson (a level check run in this lesson took its minutes). */
const counts = (seg: Segment, state: Pick<V2State, 'goals' | 'workingLevel' | 'timeFit'>) => state.goals[seg.id]?.status !== 'skipped' && !state.timeFit?.dropped.includes(seg.id) && !(v2PartOf(seg).skipWhenLevelKnown && state.workingLevel?.from === 'earlier_lesson');

/** Task 7i (OPTIONAL_AT_ARRIVAL): the time fit decided at the first teaching part. Nothing is left out up front, unless the
 *  plan's REQUIRED parts alone add up to more than the box plus the margin: then the Task 7f decision (v2PartsToDrop against the
 *  box). `byArrival`: the optional parts are decided as the lesson arrives at each (v2ArrivalDrops). */
export function v2TimeFitUpFront(plan: LessonPlan, state: Pick<V2State, 'goals' | 'workingLevel'>, boxMin: number | undefined, marginMin: number): NonNullable<V2State['timeFit']> {
  const required = plan.segments.filter((seg) => !v2PartIsOptional(seg) && state.goals[seg.id]?.status !== 'skipped' && !(v2PartOf(seg).skipWhenLevelKnown && state.workingLevel));
  const total = required.reduce((t, seg) => t + (v2PartOf(seg).minutes ?? 0), 0);
  if (boxMin && boxMin > 0 && required.every((seg) => !!v2PartOf(seg).minutes) && total > boxMin + marginMin + 1e-9) return { dropped: v2PartsToDrop(plan, state, boxMin) };
  return { dropped: [], byArrival: true };
}

/** Task 7i: the minutes an optional part needs from now: its own, and those of every required part after it (the summary's
 *  among them). Null: a part without minutes. */
function minutesFrom(plan: LessonPlan, i: number, state: Pick<V2State, 'goals' | 'workingLevel' | 'timeFit'>): number | null {
  const segs = [plan.segments[i]!, ...plan.segments.slice(i + 1).filter((seg) => !v2PartIsOptional(seg) && counts(seg, state))];
  if (segs.some((seg) => !v2PartOf(seg).minutes)) return null;
  return segs.reduce((t, seg) => t + (v2PartOf(seg).minutes ?? 0), 0);
}

/** Task 7i (OPTIONAL_AT_ARRIVAL): the optional parts left out as the lesson arrives at them: while the next part after the part
 *  in hand is an optional part not yet entered nor left out, it is left out when its minutes plus the summary's (and any
 *  required part's still to come) no longer fit before the box plus the margin, measured from `usedMin`. Time only runs on, so
 *  a part that does not fit now never will; one that fits is decided again next turn, and taken when the lesson enters it.
 *  Labelled plans only (the part in hand is known); empty when nothing is left out now. */
/** Fix round 1 (minor 2): `asked`: the part the last reply asked about (held or pending); its decision was made at the ask, and
 *  the answer to it is not overturned by the minutes that passed while they answered. */
export function v2ArrivalDrops(plan: LessonPlan, state: V2State, usedMin: number, boxMin: number | undefined, marginMin: number, asked?: string | null): string[] {
  if (!boxMin || !(boxMin > 0) || !state.timeFit?.byArrival || !v2PlanLabelled(plan)) return [];
  const out: string[] = [];
  const view = { ...state, timeFit: { ...state.timeFit, dropped: [...state.timeFit.dropped] } };
  const cur = v2PartInHand(plan, view);
  for (;;) {
    const nx = v2NextPart(plan, view, cur, true);
    if (nx < 0 || nx >= plan.segments.length - 1) break;
    const seg = plan.segments[nx]!;
    if (!v2PartIsOptional(seg) || seg.id === asked || state.timeFit.taken?.includes(seg.id) || state.board.pages.some((pg) => v2IsPageOfPart(seg, pg.title)) || state.goals[seg.id]) break;
    const need = minutesFrom(plan, nx, view);
    if (need === null || usedMin + need <= boxMin + marginMin + 1e-9) break;
    out.push(seg.id); view.timeFit.dropped.push(seg.id);
  }
  return out;
}

/** Task 7i fix round 1 (the controller's ruling, as in 7f E: never decided by phrases): an optional part left out on arrival that
 *  the learner's words name. Only the facts use it (v2TimeFitFacts' mention line): a mention changes no state. `left`: minutes to
 *  the hard stop; `fits`: the part's own minutes fit in them. Null: none named. */
export function v2DroppedMentioned(plan: LessonPlan, state: V2State, said: string | null, usedMin: number, boxMin: number | undefined, marginMin: number, optionalToo: boolean = TUTOR_V2_OPTIONAL_FIT): { index: number; left: number; minutes: number; fits: boolean; notReached?: true } | null {
  if (!said || !boxMin || !state.timeFit?.byArrival) return null;
  const i = plan.segments.findIndex((seg) => state.timeFit!.dropped.includes(seg.id) && !!v2PartOf(seg).label && v2PartNamedIn(seg, said));
  const left = boxMin + marginMin - usedMin;
  if (i < 0) {
    // Task 7v (OPTIONAL_FIT): at the close, an optional part not reached that a request of theirs names ("Can we do pronunciation
    // before going?", mic test 6 at 18.9 with six minutes left): the 7i fit says whether it can be taken now.
    const k = optionalToo ? v2OptionalAskedAtClose(plan, state, said) : -1;
    if (k < 0) return null;
    return { index: k, left, minutes: v2PartOf(plan.segments[k]!).minutes ?? 0, fits: v2OptionalFits(plan, state, k, usedMin, boxMin, marginMin), notReached: true };
  }
  const minutes = v2PartOf(plan.segments[i]!).minutes ?? 0;
  return { index: i, left, minutes, fits: minutes <= left + 1e-9 };
}

/** Task 7v (OPTIONAL_FIT): at the close (the summary begun or their questions invited), a sentence of theirs asked of the tutor
 *  (a request frame: can / could we, let's, I'd like, please, a question) that names an optional part the lesson has not entered and
 *  did not leave out; never their intent for later, a negated sentence or another day. Its index, or -1. Recognising only: the caller
 *  turns the board to its page (7k) and the facts say whether it fits; nothing of the lesson's state moves on it. */
export function v2OptionalAskedAtClose(plan: LessonPlan, state: V2State, said: string | null | undefined, on: boolean = TUTOR_V2_OPTIONAL_FIT): number {
  if (!on || !said || !v2PlanLabelled(plan) || (typeof state.summaryBegunAt !== 'number' && typeof state.closeInvitedAt !== 'number')) return -1;
  const last = plan.segments.length - 1;
  for (const raw of said.split(/(?<=[.!?。！？])\s*/)) {
    const x = raw.replace(DECLINE_LEAD, '').trim();
    if (!x) continue;
    const ja = /[぀-ヿ一-鿿]/.test(x);
    if (ja ? !(ASK_JA.test(x) || /(?:できますか|しませんか|お願いします|やりたい|したい)/.test(x)) || OWN_INTENT_JA.test(x) || DECLINES_JA.test(x) : !REQUEST_FRAME.test(x) || OWN_INTENT.test(x) || NEGATED.test(x) || SOME_OTHER_TIME.test(x)) continue;
    const i = plan.segments.findIndex((seg, k) => k !== last && v2PartIsOptional(seg) && !!v2PartOf(seg).label && v2PartNamedIn(seg, x) && !state.timeFit?.dropped.includes(seg.id) && !v2PartEntered(seg, state));
    if (i >= 0) return i;
  }
  return -1;
}

/** Task 7i fix round 1: a part left out on arrival that the lesson has ENTERED (plan-map.ts v2PartEntered, its being left out
 *  aside: its page holds something, practice counted, a goal shown) was taken after all: out of `dropped`, into `taken` (never
 *  left out again). Mutates; the ids taken. */
export function v2TakeEnteredDropped(plan: LessonPlan, state: V2State): string[] {
  const fit = state.timeFit;
  if (!fit?.byArrival || !fit.dropped.length) return [];
  // Task 7k fix round 1 (I1, ruling c): a visit's page is the lesson entering a part left out for time (7i decides taken).
  const bare = { ...state, timeFit: undefined, visitPages: undefined };
  const ids = fit.dropped.filter((id) => { const seg = plan.segments.find((x) => x.id === id); return !!seg && v2PartEntered(seg, bare); });
  if (ids.length) {
    const { byChoice, ...rest } = fit; const chosen = (byChoice ?? []).filter((id) => !ids.includes(id));
    state.timeFit = { ...rest, dropped: fit.dropped.filter((id) => !ids.includes(id)), taken: [...(fit.taken ?? []), ...ids], ...(chosen.length ? { byChoice: chosen } : {}) };
  }
  return ids;
}

/** Task 7r fix round 4 (I-E, the controller's ruling: declining an optional part is state): the parts `ids` are left out by the
 *  learner's choice (part-flow.ts v2OptionalDeclined: a no to the part when it was offered; v2SummaryGo: their yes to going on to
 *  the summary past it). Left out exactly as a part left out for time on arrival is (`dropped`: plan order goes past it, it is
 *  named as next time and carried, and taken after all once the lesson enters it), marked `byChoice` so the facts never call it
 *  "no time", and already told (they chose). Only where the time fit is decided on arrival. Mutates; the ids added. */
export function v2LeaveOutByChoice(state: V2State, ids: readonly string[]): string[] {
  const fit = state.timeFit;
  if (!fit?.byArrival) return [];
  const add = ids.filter((id) => !fit.dropped.includes(id));
  if (add.length) state.timeFit = { ...fit, dropped: [...fit.dropped, ...add], byChoice: [...new Set([...(fit.byChoice ?? []), ...add])], toldIds: [...new Set([...(fit.toldIds ?? []), ...add])] };
  return add;
}

/** Task 7i (STAY_IN_PART): the time line's addition while the lesson is ahead of its plan in a required practice part (elapsed
 *  under the plan minutes of the parts before it plus half its own): how many of its minutes are left, and to go on with it.
 *  Facts only: no hold, no refusal. Mic test 3 (embed-1794967959470, flag 6): the summary began at 12.6 of 20 minutes after one
 *  exchange of the five-minute conversation. Spoken lessons with labelled plans; null otherwise. */
export function v2StayInPartLine(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_STAY_IN_PART, clockOn: boolean = TUTOR_V2_PART_CLOCK): string | null {
  const plan = session.plan;
  if (!on || !plan || !session.timeBoxMinutes || session.mode !== 'voice' || !v2Taught(session) || !v2PlanLabelled(plan) || state.closed) return null;
  const cur = v2PartInHand(plan, state);
  const seg = plan.segments[cur];
  if (!seg || !v2PracticePart(plan, cur) || v2PartIsOptional(seg) || (state.moveOnAsked ?? []).includes(seg.id)) return null;
  // Task 7v (PART_CLOCK): measured from when the lesson entered the part, against its own minutes.
  const own = v2PartOf(seg).minutes;
  const pace = v2PartPace(session, state, nowMs, clockOn);
  if (pace) {
    if (!pace.stay) return null;
    const left = Math.max(1, Math.round(pace.left));
    return pace.core
      ? `this part (${pace.label}) is the lesson's main practice and has about ${left} minutes left (its own ${pace.own}, and the time the earlier parts saved): there is time, so go on with it (another question, or a follow-up on their answer) rather than offering the next part`
      : `this part (${pace.label}) has about ${Math.min(left, pace.own)} of its ${pace.own} minutes left by the plan: there is time, so go on with it (another question, or a follow-up on their answer) rather than offering the next part`;
  }
  const before = plan.segments.slice(0, cur).filter((x) => counts(x, state));
  if (!own || before.some((x) => !v2PartOf(x).minutes)) return null;
  const start = before.reduce((t, x) => t + (v2PartOf(x).minutes ?? 0), 0);
  const used = (nowMs - state.startedAtMs) / 60000;
  if (used >= start + own / 2) return null;
  const left = Math.max(1, Math.round(start + own - used));
  return `this part (${v2PartOf(seg).label ?? seg.id}) has about ${Math.min(left, own)} of its ${own} minutes left by the plan: there is time, so go on with it (another question, or a follow-up on their answer) rather than offering the next part`;
}

/** Task 7v (PART_CLOCK): the lessons the part clock runs in: spoken, timed, taught, with a labelled plan, not closed. */
export function v2PartClockOn(session: V2Session, state: Pick<V2State, 'closed'>, on: boolean = TUTOR_V2_PART_CLOCK): boolean {
  return on && !!session.plan && !!session.timeBoxMinutes && session.mode === 'voice' && v2Taught(session) && v2PlanLabelled(session.plan) && !state.closed;
}

/** Task 7v (PART_CLOCK): the part in hand is a new part: it began now (state.partStart, mutates). Called as the turn begins (a page
 *  opened on their yes) and after the reply (a page the reply opened). Mic test 6 (embed-1795067373124): the stay line measured each
 *  part from the lesson's start, so the minutes an early level check saved went to "Your job" (5.3 of its 3 minutes). */
export function v2MarkPartStart(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_PART_CLOCK): void {
  if (!v2PartClockOn(session, state, on)) return;
  const plan = session.plan!;
  if (v2PartViewed(plan, state) >= 0) return;
  const seg = plan.segments[v2PartInHand(plan, state)];
  if (seg && state.partStart?.part !== seg.id) state.partStart = { part: seg.id, at: nowMs };
}

/** Task 7v (PART_CLOCK): the part in hand, its own plan minutes and the minutes used in it since the lesson entered it; null when the
 *  clock does not run, the part has no minutes, or its start is not known. */
export function v2PartClock(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_PART_CLOCK): { index: number; id: string; label: string; own: number; used: number } | null {
  if (!v2PartClockOn(session, state, on)) return null;
  const plan = session.plan!;
  const index = v2PartInHand(plan, state); const seg = plan.segments[index];
  const own = seg ? v2PartOf(seg).minutes : undefined;
  if (!seg || !own || state.partStart?.part !== seg.id) return null;
  return { index, id: seg.id, label: v2PartOf(seg).label ?? seg.id, own, used: Math.max(0, (nowMs - state.partStart.at) / 60000) };
}

/** Task 7v (PART_CLOCK): the time line's addition once a teaching part has had its own plan minutes: offer the next part when its
 *  practice is done. Facts only (the 7f minimum still holds the part, and nothing is squeezed). Not where they asked to move on (they
 *  decided), nor in the level check, the overview or the close. */
export function v2PartTimeUpLine(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_PART_CLOCK): string | null {
  const c = v2PartPace(session, state, nowMs, on);
  if (!c || !c.up || !v2TeachingPart(session.plan!, c.index) || (state.moveOnAsked ?? []).includes(c.id)) return null;
  if (c.late) return `the lesson is behind its plan (about ${Math.round(c.lessonUsed)} minutes used, the plan has this part (${c.label}) done by ${Math.round(c.planThrough)}): its practice is done, so close it now and offer the next part`;
  return `this part (${c.label}) has had its ${c.core ? 'time' : `${c.own} planned minutes`} (about ${Math.round(c.used)} used in it): once its practice is done, close it and offer the next part`;
}

/** Fix round 1 (I1, the controller's ruling): the lesson's main practice part, which keeps the time earlier parts saved: the required
 *  practice part the plan gives the most minutes (the later one on a tie). 7i's stay line was written for it (mic test 3,
 *  embed-1794967959470: the five-minute conversation); the plan names no such part, so it is found by its minutes. -1: none. */
export function v2CorePart(plan: LessonPlan): number {
  let best = -1; let most = 0;
  plan.segments.forEach((seg, i) => { const m = v2PartOf(seg).minutes ?? 0; if (v2PracticePart(plan, i) && !v2PartIsOptional(seg) && m > 0 && m >= most) { best = i; most = m; } });
  return best;
}

/** Fix round 1 (I1): how a part in hand stands on the part clock (facts only).
 *   - Any part but the core one: go on until half its own minutes from its own start (`stay`), its time is up at its own minutes (`up`).
 *   - The core part (v2CorePart): go on until its own minutes from its own start AND until the lesson clock reaches the target less
 *     the minutes of the parts still to come (an optional part that fits and was not declined, the required ones, the summary): the
 *     time saved stays in hand for it.
 *   - Behind: the lesson clock is more than V2_BEHIND_SLACK_MIN past the plan minutes of every part up to and including this one, and
 *     its two practice sentences are said (7f): no go-on line, its time is up now (`late`).
 *  Null where the part clock does not run (v2PartClock). */
export const V2_BEHIND_SLACK_MIN = 1;
export function v2PartPace(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_PART_CLOCK): { index: number; id: string; label: string; own: number; used: number; lessonUsed: number; planThrough: number; core: boolean; stay: boolean; up: boolean; late: boolean; left: number } | null {
  const c = v2PartClock(session, state, nowMs, on);
  if (!c) return null;
  const plan = session.plan!; const box = session.timeBoxMinutes!;
  const lessonUsed = (nowMs - state.startedAtMs) / 60000;
  const through = plan.segments.slice(0, c.index + 1).filter((x) => counts(x, state));
  const planThrough = through.reduce((t, x) => t + (v2PartOf(x).minutes ?? 0), 0);
  const minMet = !v2PracticePart(plan, c.index) || (state.practiceSaid?.[c.id] ?? 0) >= V2_MIN_PRACTICE;
  const late = through.every((x) => !!v2PartOf(x).minutes) && lessonUsed > planThrough + V2_BEHIND_SLACK_MIN && minMet;
  const core = c.index === v2CorePart(plan);
  if (core) {
    const margin = v2OverrunMin();
    let rest = 0;
    plan.segments.forEach((seg, j) => {
      if (j <= c.index || !counts(seg, state)) return;
      const m = v2PartOf(seg).minutes ?? 0;
      if (!v2PartIsOptional(seg)) { rest += m; return; }
      if (v2OfferedOut(plan, state).has(seg.id) || state.goals[seg.id]?.status === 'skipped') return;
      const need = minutesFrom(plan, j, state);
      if (need !== null && lessonUsed + need <= box + margin + 1e-9) rest += m;
    });
    const until = Math.max(c.own - c.used, box - rest - lessonUsed);
    const stay = !late && until > 0;
    return { ...c, lessonUsed, planThrough, core, stay, up: !stay, late, left: until };
  }
  const stay = !late && c.used < c.own / 2;
  return { ...c, lessonUsed, planThrough, core, stay, up: late || c.used >= c.own, late, left: c.own - c.used };
}

/** Task 7v (OPTIONAL_FIT): the 7i fit for optional part `i` now: its minutes and those of the required parts after it (the summary's,
 *  unless the summary has begun: then its own alone) within the box plus the margin from `usedMin`. False for a part without minutes. */
export function v2OptionalFits(plan: LessonPlan, state: V2State, i: number, usedMin: number, boxMin: number, marginMin: number): boolean {
  const seg = plan.segments[i];
  if (!seg || !v2PartIsOptional(seg)) return false;
  const need = typeof state.summaryBegunAt === 'number' ? v2PartOf(seg).minutes ?? null : minutesFrom(plan, i, state);
  return need !== null && usedMin + need <= boxMin + marginMin + 1e-9;
}

/** Task 7v (OPTIONAL_FIT): the wrap minute for this turn while an optional part fits (mic test 6, embed-1795067373124: the yes at
 *  18.1 to Pronunciation offered at 17.85 opened nothing, the wrap being 18). The wrap moves later, never earlier, and never past the
 *  minute the summary still needs before the box plus the margin:
 *   - the optional part is in hand (the lesson entered it): to the end of its own minutes from its start;
 *   - it is the next part (the part in hand is the one before it) and it fits now, or the last reply asked about it (the 7i
 *     decision made at the ask stands): to the last minute it still fits.
 *  Null: nothing moves (no optional part there, it was declined, left out, offered out, the summary has begun, or the flag off).
 *  `asked`: the part the last reply asked about. Labelled spoken timed lessons whose time fit is decided on arrival only. */
export function v2OptionalWrapMin(session: V2Session, state: V2State, nowMs: number, wrapMin: number | undefined, marginMin: number, asked: string | null, on: boolean = TUTOR_V2_OPTIONAL_FIT): { wrap: number; label: string; minutes: number; phase: 'next' | 'in'; leftInPart?: number } | null {
  const plan = session.plan; const box = session.timeBoxMinutes;
  if (!on || !TUTOR_V2_OPTIONAL_AT_ARRIVAL || !TUTOR_V2_TIME_NO_SQUEEZE || !plan || !box || wrapMin === undefined || session.mode !== 'voice' || !v2Taught(session) || !v2PlanLabelled(plan)) return null;
  if (state.closed || typeof state.summaryBegunAt === 'number' || typeof state.closeInvitedAt === 'number' || !state.timeFit?.byArrival) return null;
  const used = (nowMs - state.startedAtMs) / 60000;
  const cur = v2PartInHand(plan, state);
  const dropped = state.timeFit.dropped;
  const after = (i: number) => plan.segments.slice(i + 1).filter((seg) => !v2PartIsOptional(seg) && counts(seg, state)).reduce((t, seg) => t + (v2PartOf(seg).minutes ?? 0), 0);
  const seg = plan.segments[cur];
  if (seg && cur < plan.segments.length - 1 && v2PartIsOptional(seg) && !dropped.includes(seg.id) && v2PartOf(seg).minutes) {
    const own = v2PartOf(seg).minutes!;
    // Fix round 1 (I2): no start known (PART_CLOCK off, or a state from before it): no hold, as before this task; never one invented.
    if (state.partStart?.part !== seg.id) return null;
    const start = (state.partStart.at - state.startedAtMs) / 60000;
    const wrap = Math.min(start + own, box + marginMin - V2_HOLD_SLACK_MIN - after(cur));
    return wrap > wrapMin ? { wrap, label: v2PartOf(seg).label ?? seg.id, minutes: own, phase: 'in', leftInPart: Math.max(0, start + own - used) } : null;
  }
  const nx = v2NextPart(plan, state, cur, true);
  const next = plan.segments[nx];
  if (!next || nx >= plan.segments.length - 1 || !v2PartIsOptional(next) || dropped.includes(next.id) || state.goals[next.id] || v2OfferedOut(plan, state).has(next.id)) return null;
  const need = minutesFrom(plan, nx, state);
  if (need === null) return null;
  // Fix round 1 (m3): the hold leaves V2_HOLD_SLACK_MIN before the hard stop for the close after the summary.
  const fits = used + need <= box + marginMin - V2_HOLD_SLACK_MIN + 1e-9;
  if (!fits && asked !== next.id) return null;
  const wrap = Math.max(box + marginMin - V2_HOLD_SLACK_MIN - need, used + 0.01);
  return wrap > wrapMin ? { wrap, label: v2PartOf(next).label ?? next.id, minutes: v2PartOf(next).minutes ?? 0, phase: 'next' } : null;
}

/** Fix round 1 (m3): minutes kept free before the hard stop when the wrap is held for an optional part. */
export const V2_HOLD_SLACK_MIN = 0.5;

/** Task 7v (OPTIONAL_FIT): the time line's addition while the wrap is held for an optional part (v2OptionalWrapMin). */
export function v2OptionalHeldLine(h: { label: string; minutes: number; phase: 'next' | 'in'; leftInPart?: number }): string {
  return h.phase === 'in'
    ? `the optional ${h.label} part fits before the session must end: go on with it (about ${Math.max(1, Math.round(h.leftInPart ?? h.minutes))} of its ${h.minutes} minutes left), then the summary`
    : `the optional ${h.label} part (about ${h.minutes} minutes) still fits before the session must end with the summary after it: when this part is done, offer it in one line; if they say yes, take it; if they would rather not, go to the summary`;
}

/** A teaching part: not the overview (an opening hook), not the level check, not the close. */
export function v2TeachingPart(plan: LessonPlan, i: number): boolean {
  const seg = plan.segments[i];
  return !!seg && i > 0 && i < plan.segments.length - 1 && seg.kind !== 'hook' && seg.kind !== 'recap' && !v2PartOf(seg).skipWhenLevelKnown;
}

/** The time fit is decided now: a timed taught lesson with a plan, not yet decided, and the first teaching part has opened (a
 *  plan with part names: a page of a teaching part is up) or, in a plan without part names, the tutor has spoken once. */
export function v2TimeFitDue(session: V2Session, state: V2State, on: boolean): boolean {
  if (!on || !session.plan || !session.timeBoxMinutes || session.homework || session.homeworkSheet || state.timeFit || state.closed) return false;
  const plan = session.plan;
  if (!v2PlanLabelled(plan)) return state.history.some((h) => h.role === 'assistant');
  return plan.segments.some((seg, i) => v2TeachingPart(plan, i) && state.board.pages.some((pg) => v2IsPageOfPart(seg, pg.title)));
}

const names = (segs: Segment[]) => {
  const xs = segs.map((seg) => `the ${v2PartOf(seg).label ?? seg.id} part`);
  return xs.length === 1 ? xs[0]! : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
};

/** The parts left out for time, as plan segments. */
export function v2DroppedParts(plan: LessonPlan | undefined, state: Pick<V2State, 'timeFit'>): Segment[] {
  const ids = new Set(state.timeFit?.dropped ?? []);
  return plan && ids.size ? plan.segments.filter((seg) => ids.has(seg.id)) : [];
}

/** The facts line for the parts left out for time: tell the learner once (until a reply has named them, at most
 *  V2_DROP_TELL_TURNS turns), then a reminder that they are for next time and not offered. */
export function v2TimeFitFacts(session: V2Session, state: V2State, on: boolean, nowMs?: number): string[] {
  if (!on || !session.plan || state.closed) return [];
  const dropped = v2DroppedParts(session.plan, state);
  if (!dropped.length) return [];
  const list = names(dropped); const one = dropped.length === 1;
  // Task 7i (OPTIONAL_AT_ARRIVAL): left out as the lesson arrived at it: told once, in the reply that moves on to the part after.
  // Fix round 1 (minor 1): told per part (`toldIds`): a part left out later is told, one already told is not told again.
  if (state.timeFit?.byArrival) {
    const toldIds = state.timeFit.toldIds ?? [];
    // Task 7r fix round 4: a part left out by their choice (v2LeaveOutByChoice) has its own line: never "no time".
    const chosen = dropped.filter((seg) => state.timeFit!.byChoice?.includes(seg.id));
    const timed = dropped.filter((seg) => !chosen.includes(seg));
    const toTell = typeof state.summaryBegunAt === 'number' ? [] : timed.filter((seg) => !toldIds.includes(seg.id));
    const rest = timed.filter((seg) => !toTell.includes(seg));
    const lines: string[] = [];
    if (chosen.length) {
      const c1 = chosen.length === 1;
      lines.push(`not taken today by their choice (they said no to ${c1 ? 'it' : 'them'}, or agreed to go on to the summary without ${c1 ? 'it' : 'them'}): ${names(chosen)}, for next time; do not offer ${c1 ? 'it' : 'them'} again unless they ask, and never say there was no time for ${c1 ? 'it' : 'them'}`);
    }
    if (rest.length) {
      const r1 = rest.length === 1;
      lines.push(`left out for time (${rest.every((seg) => toldIds.includes(seg.id)) ? 'already told' : 'name it in your summary as next time'}): ${names(rest)}, for next time; do not offer ${r1 ? 'it' : 'them'} unless they ask`);
    }
    if (toTell.length) {
      const t1 = toTell.length === 1;
      const used = typeof nowMs === 'number' ? ` (about ${Math.max(0, Math.round((nowMs - state.startedAtMs) / 60000))} minutes used, and the session can run to about ${(session.timeBoxMinutes ?? 0) + v2OverrunMin()})` : '';
      lines.push(`left out for time: there is no longer time for ${names(toTell)} and the summary${used}, so ${t1 ? 'it is' : 'they are'} left for the next session. Say nothing of ${t1 ? 'it' : 'them'} while the part in hand goes on; in the reply that closes the part in hand and moves on, tell them once, in one short sentence (in your own words, in the lesson's language), that there is no time left for ${t1 ? 'it' : 'them'} today and you will take ${t1 ? 'it' : 'them'} up next time, and go on to the next part; do not offer ${t1 ? 'it' : 'them'}`);
    }
    return lines;
  }
  if (!state.timeFit?.told) return [`left out for time: the plan's parts add up to more than the ${session.timeBoxMinutes} minutes, so ${list} ${one ? 'is' : 'are'} left for the next session. Tell them once, in one short sentence in this reply (in your own words, in the lesson's language), that time does not allow ${one ? 'it' : 'them'} today and ${one ? 'it is' : 'they are'} for next time; then teach the parts in hand at their full depth`];
  return [`left out for time (already told): ${list}, for next time; do not offer ${one ? 'it' : 'them'} unless they ask`];
}

/** After the reply: the learner has been told once a reply names every part left out, or the facts have asked enough times. */
export function v2TimeFitAfterReply(plan: LessonPlan | undefined, state: V2State, spoken: string): void {
  const fit = state.timeFit;
  if (!plan || !fit || fit.told || !fit.dropped.length) return;
  const said = stripBoardBlocks(spoken);
  const named = v2DroppedParts(plan, state).every((seg) => v2PartNamedIn(seg, said));
  // Task 7i: a part left out on arrival is told when a reply names it (the facts say when; turns are not counted).
  // Fix round 1 (minor 1): per part (`toldIds`); `told` once every part left out has been named.
  if (fit.byArrival) {
    const toldIds = [...new Set([...(fit.toldIds ?? []), ...v2DroppedParts(plan, state).filter((seg) => v2PartNamedIn(seg, said)).map((seg) => seg.id)])];
    state.timeFit = { ...fit, toldIds, ...(fit.dropped.every((id) => toldIds.includes(id)) ? { told: true as const } : {}) };
    return;
  }
  const shown = (fit.shown ?? 0) + 1;
  state.timeFit = named || shown >= V2_DROP_TELL_TURNS ? { dropped: fit.dropped, told: true } : { dropped: fit.dropped, shown };
}

/** Task 7f C: a practice part: a teaching part (v2TeachingPart) whose practice is sentences of the learner's own. Fix round 1
 *  (I1): not a part the plan marks as pronunciation practice (`metadata.pronunciation`: words and sentences to say): its
 *  tries are single words and read-aloud lines, never counted as sentences, and the part was held until the wrap minute. */
export function v2PracticePart(plan: LessonPlan, i: number): boolean {
  const seg = plan.segments[i];
  return v2TeachingPart(plan, i) && !!seg && !v2PartOf(seg).pronunciation;
}

/** The learner's words ask to move on ("Let's move on", "Can we go to the next part?", 「次に進みましょう」). */
const MOVE_ON_ASKED = /\b(?:let'?s|let us|can we|could we|shall we|i(?:'d| would) like to|i want to)\s+(?:please\s+)?(?:move on|go on to the next|go to the next|skip (?:this|it|ahead)|do the next)\b|\b(?:move on|next part|next topic),? please\b|^\s*(?:(?:ok(?:ay)?|yes|so)[,.]?\s+)?(?:move on|next part|next topic|skip(?: this| it)?)[.!]?\s*$|次に進(?:みたい|みましょう|んで)|次へ(?:行きましょう|お願いします)/i;

/** Count the learner's words for the part in hand (mutates `state`): a sentence of their own (v2LearnerSentence: four words or
 *  more, not a question) in a practice part adds one; asking to move on, or a yes to a part ask, records the part as theirs to
 *  close. Not while the lesson is closed. */
/** Task 7k (PRACTICE_ON_PART_PAGE, `viewOn`): on another part's page (v2PartViewed: practice they asked for of an earlier
 *  part), nothing is counted (fix round 1, I1: a visit never counts for a part's practice, the position's or the visited
 *  one's), and a move-on there is no move-on of the position's part. */
/** Task 7n (PART_ASK_LANGS, `langs`): "Uh, move on." asks to move on (the filler taken off first, language-pack.ts), and a yes to
 *  a part ask the reply ended on by position in the lesson's `languages` (part-flow.ts v2EndingPartAsk) is a move-on too. */
export function v2CountPractice(plan: LessonPlan, state: V2State, said: string | null, lastTutor: string, viewOn: boolean = TUTOR_V2_PRACTICE_ON_PART_PAGE, languages?: readonly string[], langs: boolean = TUTOR_V2_PART_ASK_LANGS): void {
  if (!said || state.closed) return;
  if (v2PartViewed(plan, state, viewOn) >= 0) return;
  const i = v2PartInHand(plan, state);
  if (!v2PracticePart(plan, i)) return;
  const id = plan.segments[i]!.id;
  const lastAsk = stripBoardBlocks(lastTutor).split(/(?<=[.!?。！？])\s*/).map((x) => x.trim()).filter(Boolean).pop() ?? '';
  const asked = v2AsksPartChange(plan, lastAsk) || !!v2EndingPartAsk(lastTutor, plan, languages, langs);
  const moveOn = MOVE_ON_ASKED.test(langs ? v2WithoutFillers(said, languages) : said) || (asked && v2MoveAnswer(said, lastTutor, languages, langs, plan) === 'go');
  if (moveOn) { if (!(state.moveOnAsked ?? []).includes(id)) state.moveOnAsked = [...(state.moveOnAsked ?? []), id].slice(-20); return; }
  if (v2MoveAnswer(said, lastTutor, languages, langs, plan) === 'question' || !v2LearnerSentence(said)) return;
  state.practiceSaid = { ...(state.practiceSaid ?? {}), [id]: Math.min(99, (state.practiceSaid?.[id] ?? 0) + 1) };
}

/** The practice part in hand is short of its sentences: its index and how many were said, or null (not a practice part,
 *  enough said, the learner asked to move on, or its goal already marked done). */
/** Task 7k (PRACTICE_ON_PART_PAGE, `viewOn`): null while another part's page is in view for practice they asked for (the
 *  position's minimum waits until the board is back). */
export function v2PracticeShort(plan: LessonPlan, state: V2State, viewOn: boolean = TUTOR_V2_PRACTICE_ON_PART_PAGE): { index: number; id: string; n: number } | null {
  if (v2PartViewed(plan, state, viewOn) >= 0) return null;
  const i = v2PartInHand(plan, state);
  if (!v2PracticePart(plan, i)) return null;
  const id = plan.segments[i]!.id;
  const g = state.goals[id]?.status;
  if (g === 'shown' || g === 'demonstrated' || g === 'skipped' || (state.moveOnAsked ?? []).includes(id)) return null;
  const n = state.practiceSaid?.[id] ?? 0;
  return n < V2_MIN_PRACTICE ? { index: i, id, n } : null;
}

/** The facts line while the practice part in hand is short. */
export function v2PracticeFacts(plan: LessonPlan, short: { index: number; n: number } | null): string[] {
  if (!short) return [];
  const label = v2PartOf(plan.segments[short.index]!).label ?? plan.segments[short.index]!.id;
  return [`practice in this part (${label}): the learner has said ${short.n} of the ${V2_MIN_PRACTICE} practice sentences of their own this part needs. Until they have said ${V2_MIN_PRACTICE}, the part is not done: mark no goal done, ask nothing about going on, open no next page; ask them for another sentence of their own on it. Only if they ask to move on does it close sooner. The plan's minutes never outrank this`];
}

/** The runtime's ask when a reply tried to leave a practice part short of its sentences (turn.ts). */
export const V2_PRACTICE_MORE_LINES = ['Before we go on, let\'s practise this a little more. Can you say another sentence of your own?', 'Let\'s do one more before we move on. Can you make another sentence of your own with it?'];
export const v2PracticeMoreLine = (history: V2State['history']) => V2_PRACTICE_MORE_LINES[history.filter((h) => h.role === 'assistant').length % V2_PRACTICE_MORE_LINES.length]!;

/** The learner's words look like a request for more practice ("Can we do some more practice?", "another exercise",
 *  「もっと練習したい」). Fix round 4: the result only chooses a facts line (v2MorePracticeFacts); it refuses nothing, so a
 *  misread remark costs nothing and these lists do not grow for edge cases. A plain decline is still not a request. */
// Fix round 1 (C1): practice, exercises, sentences to make or another try only; never questions or examples ("No more questions,
// thank you." answers the close's invitation; "one more question: …" is a question), and never a negated phrase.
// Fix round 2 (R1): a request is asked of the tutor now, sentence by sentence: a request frame (can / could / may we or I, let me,
// let's, I'd like, I want, give me, please, or a question) with practice words; never a statement of the learner's own practice
// ("I will practise more at home", "I'll keep practising", 「もっと練習します」), never a negated sentence. A "No," that answers
// "any questions?" is set aside first: "No, I'd like another exercise." is a request; "No, thanks." is nothing.
const PRACTICE_WORDS = /\b(?:more|another|extra|one more)\b[^.?!]{0,25}?\b(?:practi[cs]e|practi[cs]ing|exercises?|drills?|sentences?|tries|try|go|rounds?)\b|\b(?:practi[cs]e|try) (?:some |a (?:bit|little) )?more\b|\b(?:keep|continue) practi[cs]ing\b|\b(?:do|try|make|say) (?:another|one more) (?:sentence|one|exercise)\b|\b(?:do|try|have) one more\b|\bone more (?:time|try|go|round)\b|\b(?:do|try) (?:it|that|this) again\b/i;
/** Fix round 3: the bare ask, "Uh, one more." / "One more, please." (fillers aside; never "one more question"). */
const BARE_ONE_MORE = /^(?:(?:uh|um|er|ok(?:ay)?|yes|yeah|so|well)[,.]?\s+)*(?:just\s+)?one more(?:\s+(?:time|try|go|round|one))?(?:,?\s+please)?\s*[.!?]?$/i;
const REQUEST_FRAME = /\b(?:can|could|may|shall)\s+(?:we|i|you)\b|\blet(?:'s| me| us)\b|\bi(?:'d| would) (?:like|love)\b|\bi want\b|\b(?:give|show) me\b|\bplease\b|\?\s*$/i;
/** The learner's own practice, not something asked of the tutor now. */
const OWN_INTENT = /\b(?:i'?ll|i will|i'm going to|i am going to|i'm gonna|i plan to|i'?m planning to)\b|\b(?:at home|later|tomorrow|next time|next week|next lesson|next session|(?:in|at|for) (?:the|our) next (?:lesson|session|class)|another (?:day|time)|tonight|by myself|on my own|with my (?:team|colleagues|friends|family|teacher))\b/i;
/** A negated or declining sentence (after any leading "No," that answers the invitation). */
const NEGATED = /\b(?:no|not|never|without|enough|nothing)\b|n't\b/i;
const DECLINE_LEAD = /^\s*(?:(?:no|nope|nah|not yet|no problem|i don'?t know|no,? thanks?|no,? thank you)\s*[,.!]\s*)+/i;
const ASK_JA = /(?:もっと|もう少し|もう(?:一|1|１)回|もう一度|もう(?:一|1|１)問|もう(?:一|1|１)つ)[^。！？]{0,10}?(?:したい|やりたい|お願い|ください|できますか|しませんか|しましょう)|練習(?:を)?(?:もっと|もう少し)[^。！？]{0,6}?(?:したい|お願い)/;
// Fix round 3: a wish about a later session (次回 / 今度 / 次は / 来週 / 次のレッスン) is no request for practice now.
const OWN_INTENT_JA = /練習します|頑張ります|家で|自分で|あとで|後で|次回|今度|次は|来週|次のレッスン|次の授業|また次/;
const DECLINES_JA = /(?:練習|もう)(?:は)?(?:もう)?(?:いい|大丈夫|結構)|いりません|要りません|ありません/;
/** Task 7k (CLOSE_REOPENED, `opts.widened`): also a request that names a plan part (not the closing one) with a practice cue
 *  ("can we also do some more pronunciation, please?", "can we go back to conversation and do one more example?", "Oh, one
 *  more, one more past simple, please."), and a "one more" asked of the tutor ("Can we do one more example?"; never one more
 *  question, thing or minute). The old goodbyes stay no request ("No more questions, thank you", "I will practice more at
 *  home", 「次回もっと練習したいです」, "Let's do this again sometime."). `opts` is an object: callers pass this function to
 *  `Array.every`, whose index lands in the second argument. */
export const v2AsksMorePractice = (said: string | null | undefined, opts?: { plan?: LessonPlan | null; widened?: boolean } | number): boolean => {
  if (!said) return false;
  const o = typeof opts === 'object' && opts ? opts : {};
  const widened = o.widened ?? TUTOR_V2_CLOSE_REOPENED;
  const parts = widened && o.plan ? o.plan.segments.slice(0, -1).filter((seg) => !!v2PartOf(seg).label) : [];
  return said.split(/(?<=[.!?。！？])\s*/).some((raw) => {
    const s = raw.replace(DECLINE_LEAD, '').trim();
    if (!s) return false;
    if (widened && parts.some((seg) => v2PartNamedIn(seg, s)) && v2AsksPracticeOfPart(s)) return true;
    if (/[぀-ヿ一-鿿]/.test(s)) return ASK_JA.test(s) && !OWN_INTENT_JA.test(s) && !DECLINES_JA.test(s);
    if (BARE_ONE_MORE.test(s)) return true;
    if (widened && SOME_OTHER_TIME.test(s)) return false;
    if (widened && ONE_MORE_ASK.test(s) && REQUEST_FRAME.test(s) && !OWN_INTENT.test(s) && !NEGATED.test(s)) return true;
    return PRACTICE_WORDS.test(s) && REQUEST_FRAME.test(s) && !OWN_INTENT.test(s) && !NEGATED.test(s);
  });
};

/** Task 7k: a wish for another day ("Let's do this again sometime."): a goodbye, no request now. */
// Fix round 1 (M5): a named day or "next …" is a later session too ("Can we practise the past simple again next Tuesday?").
const SOME_OTHER_TIME = /\b(?:sometime|some ?time soon|some other (?:time|day)|someday|one day|next (?:time|lesson|session|class|week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(?:on )?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)s?|tomorrow)\b/i;
/** Task 7k: "one more" asked of the tutor, never one more question, thing, minute or moment. */
const ONE_MORE_ASK = /\bone more\b(?!\s+(?:questions?|things?|minutes?|seconds?|moments?)\b)/i;
/** Task 7k: a practice cue in a sentence that names a part: more, another, again, going back, practice, an example. */
const PART_PRACTICE_CUE = /\b(?:more|another|one more|again|go back|back to|practi[cs]e|practi[cs]ing|exercises?|examples?|try)\b/i;
/** …asked of the tutor: a request frame, or a bare "more X" / "one more X" / "another X". */
const BARE_MORE_LEAD = /^(?:(?:uh|um|er|oh|ok(?:ay)?|yes|yeah|so|well)[,.]?\s+)*(?:just\s+)?(?:some\s+)?(?:more|one more|another)\b/i;
const BACK_JA = /戻(?:り|って|れ|ろ)[^。！？]{0,8}?(?:たい|ください|お願い|ますか|ませんか)/;
/** Task 7k: a sentence (one that names a plan part) asks for practice of it now: a practice cue asked of the tutor, not the
 *  learner's own intent, not negated. Japanese: the 7f ask, or asking to go back (「会話に戻りたいです」). */
export function v2AsksPracticeOfPart(sentence: string): boolean {
  const s = sentence.replace(DECLINE_LEAD, '').trim();
  if (!s) return false;
  if (/[぀-ヿ一-鿿]/.test(s)) return (ASK_JA.test(s) || BACK_JA.test(s)) && !OWN_INTENT_JA.test(s) && !DECLINES_JA.test(s);
  return PART_PRACTICE_CUE.test(s) && (REQUEST_FRAME.test(s) || BARE_MORE_LEAD.test(s)) && !OWN_INTENT.test(s) && !NEGATED.test(s) && !SOME_OTHER_TIME.test(s);
}

/** Task 7k (PRACTICE_ON_PART_PAGE): the plan part their words ask to practise, when it is not the part of the page in view:
 *  a part the lesson has reached (up to the position), one left out for time, or an optional one not yet entered; never the
 *  level check (no page) or the closing part. The sentence that names it must be a request (v2AsksPracticeOfPart). Null: none.
 *  Recognising only: the caller turns the board's page (and only that); nothing of the lesson's state moves on it.
 *  Fix round 1 (I1, ruling b): `ahead`: before the close (the summary not begun) a part after the position: words alone never
 *  move the lesson forward, so the caller opens nothing for it (facts only). At the close every part is behind the Summary. */
export function v2PartPracticeAsked(plan: LessonPlan, state: V2State, said: string | null | undefined, enabled: boolean = TUTOR_V2_PRACTICE_ON_PART_PAGE): { index: number; ahead: boolean } | null {
  if (!enabled || !said || !v2PlanLabelled(plan)) return null;
  const pos = v2OpenPagePart(plan, state.board, true, state);
  const viewed = v2PartViewed(plan, state, true);
  const inView = viewed >= 0 ? viewed : pos;
  const sentences = said.split(/(?<=[.!?。！？])\s*/).map((x) => x.trim()).filter(Boolean);
  const last = plan.segments.length - 1;
  for (const s of sentences) {
    if (!v2AsksPracticeOfPart(s)) continue;
    const i = plan.segments.findIndex((seg, k) => k !== last && k !== inView && !v2PartOf(seg).skipWhenLevelKnown && !!v2PartOf(seg).label && v2PartNamedIn(seg, s));
    if (i >= 0) return { index: i, ahead: typeof state.summaryBegunAt !== 'number' && i > pos };
  }
  // Task 7v (OPTIONAL_FIT): at the close, a request that names an optional part not reached, with no practice cue ("Can we do
  // pronunciation before going?"): its page is turned to as for practice they asked for (the caller checks it fits).
  const opt = v2OptionalAskedAtClose(plan, state, said);
  if (opt >= 0 && opt !== inView) return { index: opt, ahead: false };
  return null;
}

/** Task 7f E: the facts line when the learner's words look like a request for more practice at the close: allowed while more
 *  than V2_MORE_PRACTICE_MIN_LEFT minutes remain to the hard stop, else no time today and named for next time. Permissive
 *  (fix round 4): the matcher can misread a closing remark, so the line leaves the reading of their meaning to the model. */
/** Task 7k (CLOSE_REOPENED, `reopened`): the close was reopened: after the practice, the reply asks whether they want more or to
 *  finish, rather than returning to the close at once. */
export function v2MorePracticeFacts(granted: boolean | null, leftToStop: number, reopened = false): string[] {
  if (granted === null) return [];
  return [granted
    ? `more practice: their words may be a request for more practice now. If that is what they mean, it is allowed: there are about ${Math.max(1, Math.floor(leftToStop))} minutes before the session must end, so give one or two practice sentences on what they choose or on today's points, then ${reopened ? 'once they have answered and you have given feedback, ask whether they would like more or to finish' : 'return to the close'}. If they mean something else (thanks, a wish for another day, a question, a goodbye), answer that and close as you would have`
    : 'more practice: their words may be a request for more practice now. If that is what they mean, there is no time left today: say so plainly in one short sentence, name more practice as something for next time, and go on with the close. If they mean something else, answer that and close as you would have'];
}
