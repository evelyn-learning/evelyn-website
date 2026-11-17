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
 *  E (MORE_PRACTICE): a learner who asks for more practice once the summary has begun, or at the close, gets it while more
 *    than V2_MORE_PRACTICE_MIN_LEFT minutes remain to the hard stop; otherwise the tutor says there is no time left today.
 * Pure.
 */
import type { LessonPlan, Segment } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { v2LearnerSentence } from './learner-card';
import { v2AsksPartChange, v2MoveAnswer, v2PartInHand, v2PlanLabelled } from './part-flow';
import { v2IsPageOfPart, v2PartIsOptional, v2PartNamedIn, v2PartOf } from './plan-map';
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
export function v2TimeFitFacts(session: V2Session, state: V2State, on: boolean): string[] {
  if (!on || !session.plan || state.closed) return [];
  const dropped = v2DroppedParts(session.plan, state);
  if (!dropped.length) return [];
  const list = names(dropped); const one = dropped.length === 1;
  if (!state.timeFit?.told) return [`left out for time: the plan's parts add up to more than the ${session.timeBoxMinutes} minutes, so ${list} ${one ? 'is' : 'are'} left for the next session. Tell them once, in one short sentence in this reply (in your own words, in the lesson's language), that time does not allow ${one ? 'it' : 'them'} today and ${one ? 'it is' : 'they are'} for next time; then teach the parts in hand at their full depth`];
  return [`left out for time (already told): ${list}, for next time; do not offer ${one ? 'it' : 'them'} unless they ask`];
}

/** After the reply: the learner has been told once a reply names every part left out, or the facts have asked enough times. */
export function v2TimeFitAfterReply(plan: LessonPlan | undefined, state: V2State, spoken: string): void {
  const fit = state.timeFit;
  if (!plan || !fit || fit.told || !fit.dropped.length) return;
  const said = stripBoardBlocks(spoken);
  const named = v2DroppedParts(plan, state).every((seg) => v2PartNamedIn(seg, said));
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

/** The learner asks for more practice ("Can we do some more practice?", "another exercise", 「もっと練習したい」). */
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

/** Task 7f E: the facts line when the learner asks for more practice at the close: given while more than
 *  V2_MORE_PRACTICE_MIN_LEFT minutes remain to the hard stop, else declined plainly and named for next time. */
export function v2MorePracticeFacts(granted: boolean | null, leftToStop: number): string[] {
  if (granted === null) return [];
  return [granted
    ? `they asked for more practice, and there is time for it (about ${Math.max(1, Math.floor(leftToStop))} minutes before the session must end): give it now, one or two practice sentences on what they choose or on today's points, and do not end the lesson in this reply; then return to the close`
    : 'they asked for more practice, and there is no time left today: say so plainly in one short sentence, name more practice as something for next time, and go on with the close'];
}
