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
import { v2AsksPartChange, v2MoveAnswer, v2NextPart, v2PartInHand, v2PlanLabelled } from './part-flow';
import { v2IsPageOfPart, v2PartEntered, v2PartIsOptional, v2PartNamedIn, v2PartOf } from './plan-map';
import { v2OverrunMin, v2Taught } from './time-box';
import { TUTOR_V2_STAY_IN_PART } from '../orchestrator/flags';
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
export function v2DroppedMentioned(plan: LessonPlan, state: V2State, said: string | null, usedMin: number, boxMin: number | undefined, marginMin: number): { index: number; left: number; minutes: number; fits: boolean } | null {
  if (!said || !boxMin || !state.timeFit?.byArrival) return null;
  const i = plan.segments.findIndex((seg) => state.timeFit!.dropped.includes(seg.id) && !!v2PartOf(seg).label && v2PartNamedIn(seg, said));
  if (i < 0) return null;
  const minutes = v2PartOf(plan.segments[i]!).minutes ?? 0;
  const left = boxMin + marginMin - usedMin;
  return { index: i, left, minutes, fits: minutes <= left + 1e-9 };
}

/** Task 7i fix round 1: a part left out on arrival that the lesson has ENTERED (plan-map.ts v2PartEntered, its being left out
 *  aside: its page holds something, practice counted, a goal shown) was taken after all: out of `dropped`, into `taken` (never
 *  left out again). Mutates; the ids taken. */
export function v2TakeEnteredDropped(plan: LessonPlan, state: V2State): string[] {
  const fit = state.timeFit;
  if (!fit?.byArrival || !fit.dropped.length) return [];
  const bare = { ...state, timeFit: undefined };
  const ids = fit.dropped.filter((id) => { const seg = plan.segments.find((x) => x.id === id); return !!seg && v2PartEntered(seg, bare); });
  if (ids.length) state.timeFit = { ...fit, dropped: fit.dropped.filter((id) => !ids.includes(id)), taken: [...(fit.taken ?? []), ...ids] };
  return ids;
}

/** Task 7i (STAY_IN_PART): the time line's addition while the lesson is ahead of its plan in a required practice part (elapsed
 *  under the plan minutes of the parts before it plus half its own): how many of its minutes are left, and to go on with it.
 *  Facts only: no hold, no refusal. Mic test 3 (embed-1794967959470, flag 6): the summary began at 12.6 of 20 minutes after one
 *  exchange of the five-minute conversation. Spoken lessons with labelled plans; null otherwise. */
export function v2StayInPartLine(session: V2Session, state: V2State, nowMs: number, on: boolean = TUTOR_V2_STAY_IN_PART): string | null {
  const plan = session.plan;
  if (!on || !plan || !session.timeBoxMinutes || session.mode !== 'voice' || !v2Taught(session) || !v2PlanLabelled(plan) || state.closed) return null;
  const cur = v2PartInHand(plan, state);
  const seg = plan.segments[cur];
  if (!seg || !v2PracticePart(plan, cur) || v2PartIsOptional(seg) || (state.moveOnAsked ?? []).includes(seg.id)) return null;
  const before = plan.segments.slice(0, cur).filter((x) => counts(x, state));
  const own = v2PartOf(seg).minutes;
  if (!own || before.some((x) => !v2PartOf(x).minutes)) return null;
  const start = before.reduce((t, x) => t + (v2PartOf(x).minutes ?? 0), 0);
  const used = (nowMs - state.startedAtMs) / 60000;
  if (used >= start + own / 2) return null;
  const left = Math.max(1, Math.round(start + own - used));
  return `this part (${v2PartOf(seg).label ?? seg.id}) has about ${Math.min(left, own)} of its ${own} minutes left by the plan: there is time, so go on with it (another question, or a follow-up on their answer) rather than offering the next part`;
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
    const toTell = typeof state.summaryBegunAt === 'number' ? [] : dropped.filter((seg) => !toldIds.includes(seg.id));
    const rest = dropped.filter((seg) => !toTell.includes(seg));
    const lines: string[] = [];
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
export function v2CountPractice(plan: LessonPlan, state: V2State, said: string | null, lastTutor: string): void {
  if (!said || state.closed) return;
  const i = v2PartInHand(plan, state);
  if (!v2PracticePart(plan, i)) return;
  const id = plan.segments[i]!.id;
  const lastAsk = stripBoardBlocks(lastTutor).split(/(?<=[.!?。！？])\s*/).map((x) => x.trim()).filter(Boolean).pop() ?? '';
  const moveOn = MOVE_ON_ASKED.test(said) || (v2AsksPartChange(plan, lastAsk) && v2MoveAnswer(said, lastTutor) === 'go');
  if (moveOn) { if (!(state.moveOnAsked ?? []).includes(id)) state.moveOnAsked = [...(state.moveOnAsked ?? []), id].slice(-20); return; }
  if (v2MoveAnswer(said, lastTutor) === 'question' || !v2LearnerSentence(said)) return;
  state.practiceSaid = { ...(state.practiceSaid ?? {}), [id]: Math.min(99, (state.practiceSaid?.[id] ?? 0) + 1) };
}

/** The practice part in hand is short of its sentences: its index and how many were said, or null (not a practice part,
 *  enough said, the learner asked to move on, or its goal already marked done). */
export function v2PracticeShort(plan: LessonPlan, state: V2State): { index: number; id: string; n: number } | null {
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
export const v2AsksMorePractice = (said: string | null | undefined): boolean => {
  if (!said) return false;
  return said.split(/(?<=[.!?。！？])\s*/).some((raw) => {
    const s = raw.replace(DECLINE_LEAD, '').trim();
    if (!s) return false;
    if (/[぀-ヿ一-鿿]/.test(s)) return ASK_JA.test(s) && !OWN_INTENT_JA.test(s) && !DECLINES_JA.test(s);
    if (BARE_ONE_MORE.test(s)) return true;
    return PRACTICE_WORDS.test(s) && REQUEST_FRAME.test(s) && !OWN_INTENT.test(s) && !NEGATED.test(s);
  });
};

/** Task 7f E: the facts line when the learner's words look like a request for more practice at the close: allowed while more
 *  than V2_MORE_PRACTICE_MIN_LEFT minutes remain to the hard stop, else no time today and named for next time. Permissive
 *  (fix round 4): the matcher can misread a closing remark, so the line leaves the reading of their meaning to the model. */
export function v2MorePracticeFacts(granted: boolean | null, leftToStop: number): string[] {
  if (granted === null) return [];
  return [granted
    ? `more practice: their words may be a request for more practice now. If that is what they mean, it is allowed: there are about ${Math.max(1, Math.floor(leftToStop))} minutes before the session must end, so give one or two practice sentences on what they choose or on today's points, then return to the close. If they mean something else (thanks, a wish for another day, a question, a goodbye), answer that and close as you would have`
    : 'more practice: their words may be a request for more practice now. If that is what they mean, there is no time left today: say so plainly in one short sentence, name more practice as something for next time, and go on with the close. If they mean something else, answer that and close as you would have'];
}
