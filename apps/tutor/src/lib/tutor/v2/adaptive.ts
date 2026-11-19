/**
 * Tutor brain v2 — Task 7q: adaptivity inside one lesson. Mic test 4 (embed-1795028886172): a wrong sentence was corrected and
 * the next question was no easier, and a mistake made in one part was never asked for again in the lesson.
 *
 *  1. SUPPORT_STEPS: five steps (stretch −1, normal 0, starter 1, gap 2, repeat 3), kept per lesson. Two answers in a row that
 *     needed a correction, in the part in hand, step up one (to repeat at most); two answered right step down one (to stretch at
 *     least); a change of step resets both runs; a part change moves the step one towards normal and keeps it. While the step is
 *     not normal, the facts say what the next new question looks like.
 *  2. RETEST_MISTAKE: a correction is recorded (the part, their sentence, the card's sentence, its stress words as the target,
 *     the turn), at most 5, one per target. In a later practice part that is not behind its plan minutes, one at a time and at
 *     most 3 a lesson, the facts ask for one question whose natural answer needs the target (sent for at most 2 turns). Their
 *     next carded sentences in that part give the outcome: the target used and not corrected again = passed (one word of praise
 *     allowed); corrected again on it = missed; neither by then, or the part left = not asked.
 *
 * The signal is structural, never a match on the tutor's words: a sentence of the learner's practice answer (learner-card.ts
 * v2PracticeAnswerSentences: an answer to an ask for a sentence, not yet carded) and the sentence card of this reply that is of
 * it (v2CardIsOf). The card as they said it = an answer right; the card changing their words (v2IsCorrectionOf) = one that
 * needed a correction, its `emphasis` (stress) the target. A sentence the reply put on no card counts as neither.
 *
 * Facts only: no hold, no refusal, no page, nothing of the lesson's position, part asks, close or time rules moves on it. Spoken
 * lessons that teach a language (the 7h gate) with a labelled plan; practice parts only (time-fit.ts v2PracticePart: not the
 * overview, the level check, pronunciation or the close), not once the summary has begun, not on another part's page (7k
 * visit). Keyed on the session, never on a partner. Pure, client-safe.
 */
import type { LessonPlan } from '../lesson-plan/types';
import { TUTOR_V2_FREE_CONVERSATION, TUTOR_V2_PART_CLOCK, TUTOR_V2_RETEST_ASKED, TUTOR_V2_RETEST_MISTAKE, TUTOR_V2_RETEST_SPREAD, TUTOR_V2_RETEST_TARGET_CHANGED, TUTOR_V2_STARTER_IS_ANSWER, TUTOR_V2_SUPPORT_FOLLOWED, TUTOR_V2_SUPPORT_STEPS } from '../orchestrator/flags';
import { v2AskedForQuestion, v2CardIsOf, v2SentenceWords } from './learner-card';
import { v2NoteTargetsOn } from './note-targets';
import { v2PartInHand, v2PartViewed, v2PlanLabelled, v2TutorReplies } from './part-flow';
import { v2PartOf } from './plan-map';
import { v2CorrectionWords, v2IsCorrectionOf } from './sentence-cards';
import { v2PartClock, v2PracticePart } from './time-fit';
import type { Segment } from '../lesson-plan/types';
import type { V2Retest, V2Session, V2State, V2Support, V2SupportStep, V2TurnEvent } from './types';

/** Task 7v: `changed` (RETEST_TARGET_CHANGED), `spread` (RETEST_SPREAD), `followed` (SUPPORT_FOLLOWED): each only where its 7q switch
 *  is on; absent = its flag. */
/** Task 7x: `free` (FREE_CONVERSATION), `asked` (RETEST_ASKED); absent = its flag. */
export interface V2AdaptFlags { support: boolean; retest: boolean; changed?: boolean; spread?: boolean; followed?: boolean; free?: boolean; asked?: boolean }
const FLAGS = (): V2AdaptFlags => ({ support: TUTOR_V2_SUPPORT_STEPS, retest: TUTOR_V2_RETEST_MISTAKE });
const changedOn = (f: V2AdaptFlags) => f.changed ?? TUTOR_V2_RETEST_TARGET_CHANGED;
const spreadOn = (f: V2AdaptFlags) => f.spread ?? TUTOR_V2_RETEST_SPREAD;
const followedOn = (f: V2AdaptFlags) => f.followed ?? TUTOR_V2_SUPPORT_FOLLOWED;
const freeOn = (f: V2AdaptFlags) => f.free ?? TUTOR_V2_FREE_CONVERSATION;
const askedOn = (f: V2AdaptFlags) => f.asked ?? TUTOR_V2_RETEST_ASKED;

export const V2_SUPPORT_STEPS: readonly V2SupportStep[] = ['stretch', 'normal', 'starter', 'gap', 'repeat'];
/** Answers in a row that move the step. */
export const V2_SUPPORT_RUN = 2;
export const V2_RETEST_MAX_KEPT = 5;
export const V2_RETEST_MAX_ASKED = 3;
export const V2_RETEST_TURNS = 2;
/** Task 7x (RETEST_ASKED): the turns the retest line is sent for (mic test 7, embed-1795100797999: six offered in two turns each, none
 *  asked; a reply that corrects and asks for a repeat leaves the question to the reply after it). */
export const V2_RETEST_TURNS_ASKED = 3;
/** Task 7x (FREE_CONVERSATION): corrections made aloud in a free-conversation part at most (the support signals counted per part). */
export const V2_FREE_CONV_CORRECTIONS = 2;
const retestTurns = (f: V2AdaptFlags) => (askedOn(f) ? V2_RETEST_TURNS_ASKED : V2_RETEST_TURNS);
/** Task 7v (RETEST_SPREAD): corrections recorded per part at most. */
export const V2_RETEST_PER_PART = 2;
const MAX_TARGET_WORDS = 4;
const MAX_CHARS = 200;

/** The lesson kind it runs in: spoken, teaching a language (the 7h gate, note-targets.ts), with a labelled plan. */
export function v2AdaptOn(session: V2Session): boolean {
  return v2NoteTargetsOn(session) && v2PlanLabelled(session.plan);
}

/** The practice part in hand, or null where nothing applies (not a practice part, the summary begun, closed, another part's page). */
export function v2AdaptPart(session: V2Session, state: V2State): { index: number; id: string } | null {
  const plan = session.plan;
  if (!v2AdaptOn(session) || !v2PlanLabelled(plan) || state.closed || typeof state.summaryBegunAt === 'number') return null;
  if (v2PartViewed(plan, state) >= 0) return null;
  const index = v2PartInHand(plan, state);
  return v2PracticePart(plan, index) ? { index, id: plan.segments[index]!.id } : null;
}

const stepAt = (s: V2SupportStep) => V2_SUPPORT_STEPS.indexOf(s);
const moved = (s: V2SupportStep, by: number) => V2_SUPPORT_STEPS[Math.min(V2_SUPPORT_STEPS.length - 1, Math.max(0, stepAt(s) + by))]!;
const label = (plan: LessonPlan, id: string) => { const seg = plan.segments.find((x) => x.id === id); return seg ? v2PartOf(seg).label ?? id : id; };
const ev = (type: string, message: string): V2TurnEvent => ({ type, message });

/** The facts line for a support step (none at normal). */
export function v2SupportLine(step: V2SupportStep, starterIsAnswer: boolean = TUTOR_V2_STARTER_IS_ANSWER, followed: boolean = TUTOR_V2_SUPPORT_FOLLOWED): string | null {
  if (followed) return v2SupportFormLine(step, starterIsAnswer);
  const tail = 'This shapes only your next new question: a correction, a retry it asks for, one question a reply and the cards stay as they are';
  switch (step) {
    // Task 7s (STARTER_IS_ANSWER): the starter is the opening of their answer, a statement, never the question form.
    case 'starter': return starterIsAnswer
      ? `support for the next question: starter (their recent answers in this part needed corrections). Give them the first words of their answer, as a statement, to build on ("Start with: I have worked…"), never the question form; they finish the sentence. ${tail}`
      : `support for the next question: starter (their recent answers in this part needed corrections). Give them the first words of the answer to build on ("Start with: I have worked…"); they finish the sentence. ${tail}`;
    case 'gap': return `support for the next question: gap (their recent answers needed corrections even with a start). Ask them to fill one gap in a sentence: say the sentence aloud with the gap, and put it on the question card with the gap as ___. ${tail}`;
    case 'repeat': return `support for the next question: repeat (their recent answers needed corrections even with a gap to fill). Say one model sentence of this part's form and ask them to say it after you; once they have, ask one easy question that takes the same form. ${tail}`;
    case 'stretch': return `support for the next question: stretch (their last answers in this part were right with no correction). Give no starter: ask a more open question that needs a longer answer or a reason, still on this part's point (never a new grammar point outside the part). ${tail}`;
    default: return null;
  }
}

/** Task 7v (SUPPORT_FOLLOWED): the step's line, the form of the next new question named first, with one example of its shape. Mic test
 *  6 (embed-1795067373124): about a third of new questions ignored the step (starters given while it was gap). */
export function v2SupportFormLine(step: V2SupportStep, starterIsAnswer: boolean = TUTOR_V2_STARTER_IS_ANSWER): string | null {
  const tail = 'Only your next NEW question takes this form: a correction, a retry it asks for, one question a reply and the cards stay as they are';
  switch (step) {
    // Task 7s (STARTER_IS_ANSWER): the starter is the opening of their answer, a statement, never the question form.
    // Fix round 1 (m8): the shapes are abstract (no sentence of any one lesson: the engine's prompts stay generic).
    case 'starter': return `next question's form: STARTER (support step: starter, their recent answers in this part needed corrections). Ask your question and give the first words of ${starterIsAnswer ? 'their answer as a statement, never the question form' : 'the answer to build on'}, shaped as: <your question> + "Start with: <the first two or three words of an answer in this part's form>…". They finish the sentence. Not a gap-fill. ${tail}`;
    case 'gap': return `next question's form: GAP-FILL (support step: gap, their recent answers needed corrections even with a start). One full sentence of this part's form with ONE word replaced by a gap (the word the part is about, for example its verb), said aloud and on the question card with the gap as ___. Not a starter ("Start with: …"), not an open question. ${tail}`;
    case 'repeat': return `next question's form: REPEAT AFTER ME (support step: repeat, their recent answers needed corrections even with a gap to fill). One model sentence of this part's form for them to say after you, shaped as: "Please say this after me: <the sentence>"; once they have, one easy question that takes the same form. Not a starter, not a gap-fill. ${tail}`;
    case 'stretch': return `next question's form: OPEN, NO HELP (support step: stretch, their last answers in this part were right with no correction). A more open question that needs a longer answer or a reason ("why" or "how"), still on this part's point. No starter, no gap-fill. ${tail}`;
    default: return null;
  }
}

/** Task 7v (SUPPORT_FOLLOWED): a part the plan marks as free conversation: the opening sentence of its note, aim or script calls it an
 *  open / free conversation, or the note makes the tutor a conversation partner. No part name is fixed in the engine. */
const FREE_CONVERSATION = /\b(?:open|free)[- ]conversation\b|\bconversation partner\b/i;
export function v2FreeConversationPart(seg: Segment | undefined): boolean {
  if (!seg) return false;
  const x = seg as unknown as Record<string, unknown>;
  // The opening sentence of its note, aim or script says what the part is ("Open conversation practice."); a note that only names
  // the next part ("…advance to the open conversation.") does not. A conversation partner anywhere in it.
  const texts = ['teacherNote', 'goal', 'script'].map((k) => (typeof x[k] === 'string' ? x[k] as string : '')).filter(Boolean);
  // Fix round 1 (m4): the plan's own text only; no name keyword ("Conversation drills" is no free conversation). The plan schema has
  // no field for it (kind, response format and goals say nothing of free speaking).
  return texts.some((t) => FREE_CONVERSATION.test(t.split(/(?<=[.!?:])\s/)[0] ?? '') || /\bconversation partner\b/i.test(t));
}
/** Task 7v (SUPPORT_FOLLOWED): in a free-conversation part the step never goes above starter (no gap-fill or repeat drills there). */
const capped = (plan: LessonPlan, index: number, step: V2SupportStep, on: boolean) => (on && stepAt(step) > stepAt('starter') && v2FreeConversationPart(plan.segments[index]) ? 'starter' : step);

const words = (s: string) => v2SentenceWords(s);
/** Fix round 1 (M2): the same target = any target word in common ("sold, machines" then "sold" is one entry). */
const sameTarget = (a: readonly string[], b: readonly string[]) => { const x = new Set(a.flatMap(words)); return b.flatMap(words).some((w) => x.has(w)); };
const quoteTarget = (t: readonly string[]) => t.map((x) => `"${x}"`).join(', ');
/** Their sentence holds a target word (a target phrase whole), whole words (numbers in words and digits alike). Fix round 1 (M1):
 *  any of them, not all: "sold, machines" is used by a sentence with "sold". */
const usesTarget = (sentence: string, target: readonly string[]) => { const have = ` ${words(sentence).join(' ')} `; return target.some((x) => { const w = words(x).join(' '); return !!w && have.includes(` ${w} `); }); };
/** Fix round 1 (M1): words that are rarely the point of a correction on their own. Dropped from a target when a content word stays. */
const FUNCTION_WORDS = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by', 'and', 'or', 'but', 'is', 'are', 'am', 'was', 'were', 'be', 'it', 'this', 'that', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'i', 'you', 'he', 'she', 'we', 'they']);
const DERIVED_MAX = 2;
/** The target as kept: function words out when a content word stays (an article or a preposition alone stays the point). */
export function v2RetestTarget(stress: readonly string[], max: number = MAX_TARGET_WORDS): string[] {
  const xs = stress.map((x) => x.trim()).filter(Boolean);
  const content = xs.filter((x) => !words(x).every((w) => FUNCTION_WORDS.has(w)));
  return (content.length ? content : xs).slice(0, max);
}
const touches = (stress: readonly string[], target: readonly string[]) => { const t = new Set(target.flatMap(words)); return stress.flatMap(words).some((w) => t.has(w)); };
/** Task 7v (RETEST_TARGET_CHANGED): two targets are the same when a phrase of one holds a phrase of the other whole ("the best" and
 *  "in the home" share "the" and are not the same). */
const phraseIn = (a: string, b: string) => { const x = ` ${words(a).join(' ')} `; const y = words(b).join(' '); return !!y && x.includes(` ${y} `); };
const samePhrase = (a: readonly string[], b: readonly string[]) => a.some((x) => b.some((y) => phraseIn(x, y) || phraseIn(y, x)));

/** Task 7v (RETEST_TARGET_CHANGED): the runs of card words the correction added or changed (numbers as words and fillers out, 7u):
 *  the card's words outside the longest common run of theirs and the card's, in order. Each run: its word positions in the card. */
function changedRuns(said: string, card: string): { cardWords: string[]; runs: number[][] } {
  const a = v2CorrectionWords(said); const b = v2CorrectionWords(card);
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
  const kept = new Set<number>(); let i = 0; let j = 0;
  while (i < a.length && j < b.length) { if (a[i] === b[j]) { kept.add(j); i += 1; j += 1; } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) i += 1; else j += 1; }
  const runs: number[][] = [];
  b.forEach((_, k) => { if (kept.has(k)) return; const last = runs[runs.length - 1]; if (last && last[last.length - 1] === k - 1) last.push(k); else runs.push([k]); });
  return { cardWords: b, runs };
}
/** At most this many changed words make a target of them; more, and the card's stress words are the target. */
export const V2_TARGET_CHANGED_MAX = 3;
/** Task 7v (RETEST_TARGET_CHANGED): the words the correction changed, as phrases (no neighbour): for the praise line. Empty when
 *  nothing differs or more than V2_TARGET_CHANGED_MAX words do. */
export function v2ChangedWords(said: string, card: string): string[] {
  const { cardWords, runs } = changedRuns(said, card);
  const n = runs.reduce((t, r) => t + r.length, 0);
  return n === 0 || n > V2_TARGET_CHANGED_MAX ? [] : runs.map((r) => r.map((k) => cardWords[k]!).join(' '));
}
/** Task 7v (RETEST_TARGET_CHANGED): the retest target of a correction: each run of changed words with one neighbour word for context (the
 *  word after a run that ends on a function word, "in the home"; else the word before, "negotiate with customers"), function words kept
 *  (in a language lesson the preposition or article is the point). Nothing changed, or more than three words: the card's stress words,
 *  adjacent ones as one phrase ("is to tell"). Mic test 6 (embed-1795067373124): "on → in" became "home, appliance, division". */
export function v2ChangedTarget(said: string, card: string, stress: readonly string[]): string[] {
  const { cardWords, runs } = changedRuns(said, card);
  const n = runs.reduce((t, r) => t + r.length, 0);
  if (n === 0 || n > V2_TARGET_CHANGED_MAX) return stressPhrases(cardWords, stress);
  return runs.map((r) => {
    const first = r[0]!; const last = r[r.length - 1]!;
    const after = last + 1 < cardWords.length; const before = first > 0;
    const span = r.map((k) => cardWords[k]!);
    if (after && (FUNCTION_WORDS.has(cardWords[last]!) || !before)) return [...span, cardWords[last + 1]!].join(' ');
    return before ? [cardWords[first - 1]!, ...span].join(' ') : span.join(' ');
  }).slice(0, MAX_TARGET_WORDS);
}
/** The card's stress words as phrases: those next to each other in the card joined ("is", "to", "tell" → "is to tell"). */
function stressPhrases(cardWords: readonly string[], stress: readonly string[]): string[] {
  const xs = stress.map((x) => x.trim()).filter(Boolean);
  if (!xs.length) return [];
  const at = xs.map((x) => { const w = v2CorrectionWords(x); const k = cardWords.findIndex((_, i) => w.length > 0 && w.every((y, d) => cardWords[i + d] === y)); return { x, k, len: w.length }; });
  const out: string[] = [];
  let prevEnd = -2;
  for (const p of at.filter((q) => q.k >= 0).sort((m, q) => m.k - q.k)) {
    if (out.length && p.k === prevEnd + 1) out[out.length - 1] = `${out[out.length - 1]} ${p.x}`; else out.push(p.x);
    prevEnd = p.k + p.len - 1;
  }
  for (const p of at) if (p.k < 0) out.push(p.x);
  return out.slice(0, MAX_TARGET_WORDS);
}

/** Whether the part is behind its plan minutes (the time used is past the minutes of the parts before it plus its own). No box,
 *  or a part with no minutes: not behind (nothing to tell by). */
export function v2PartBehind(session: V2Session, state: V2State, index: number, nowMs: number, clockOn: boolean = TUTOR_V2_PART_CLOCK): boolean {
  const plan = session.plan;
  if (!plan || !session.timeBoxMinutes) return false;
  // Task 7v (PART_CLOCK): by the part's own minutes since the lesson entered it.
  const c = v2PartClock(session, state, nowMs, clockOn);
  if (c && c.index === index) return c.used > c.own;
  const counts = (i: number) => { const seg = plan.segments[i]!; return state.goals[seg.id]?.status !== 'skipped' && !state.timeFit?.dropped.includes(seg.id) && !(v2PartOf(seg).skipWhenLevelKnown && state.workingLevel?.from === 'earlier_lesson'); };
  const own = v2PartOf(plan.segments[index]!).minutes;
  const before = plan.segments.slice(0, index).map((_, i) => i).filter(counts);
  if (!own || before.some((i) => !v2PartOf(plan.segments[i]!).minutes)) return false;
  const start = before.reduce((t, i) => t + (v2PartOf(plan.segments[i]!).minutes ?? 0), 0);
  return (nowMs - state.startedAtMs) / 60000 > start + own;
}

/** Before the facts (mutates `state`): a part change moves the step one towards normal; an open retest left behind in another
 *  part is not asked; the lines for this turn (support step, retest ask, praise). */
export function v2AdaptBefore(session: V2Session, state: V2State, heard: string | null | undefined, nowMs: number, flags: V2AdaptFlags = FLAGS()): { lines: string[]; events: V2TurnEvent[] } {
  const lines: string[] = []; const events: V2TurnEvent[] = [];
  if ((!flags.support && !flags.retest) || !v2AdaptOn(session)) return { lines, events };
  const plan = session.plan!;
  const part = v2AdaptPart(session, state);
  // The number of this turn's reply (v2AdaptAfter counts it once the reply is in the history): both name the same turn.
  const turn = v2TutorReplies(state.history) + 1;
  if (flags.support && part && state.support && state.support.part && state.support.part !== part.id) {
    const from = state.support.step; const to = capped(plan, part.index, moved(from, from === 'normal' ? 0 : stepAt(from) > stepAt('normal') ? -1 : 1), followedOn(flags));
    state.support = { step: to, wrong: 0, clean: 0, part: part.id };
    if (to !== from) events.push(ev('v2_support_step', `from=${from} to=${to} why=part_change part=${part.id} turn=${turn}`));
  }
  // A silence turn (no words from them) gets no line: its reply is one short line with no new question (facts.ts), and a retest
  // sent then would spend one of its turns.
  const said = typeof heard === 'string' && !!heard.trim();
  // Task 7x (FREE_CONVERSATION): in a free-conversation part a starter only after they were silent or asked for help there.
  const free = freeOn(flags) && !!part && v2FreeConversationPart(plan.segments[part.index]);
  if (flags.support && part && state.support && said) {
    const step = capped(plan, part.index, state.support.step, followedOn(flags));
    const l = free && step === 'starter' && !v2AskedForHelp(heard) && !v2SilenceBefore(state.history) ? null : v2SupportLine(step, undefined, followedOn(flags));
    if (l) lines.push(l);
  }
  if (free && part && said) lines.push(...v2FreeConvLines(session, state, part, nowMs));
  if (!flags.retest) return { lines, events };
  const list = state.retests ?? [];
  // An open retest is not asked when: the lesson is in another practice part, or at its summary or close (fix round 1, M3: not on
  // a turn on the pronunciation page or a 7k visit, from which the part comes back); or its last send's answer has gone by
  // with no outcome (M4: that answer carried no practice sentence, so v2AdaptAfter did not run on it).
  const ended = state.closed || typeof state.summaryBegunAt === 'number';
  for (const r of list) {
    if (!r.offered || r.outcome) continue;
    const left = part ? part.id !== r.in : ended;
    // Task 7x (RETEST_ASKED): open until the part it was offered in ends (no turn limit on the outcome).
    const spent = !askedOn(flags) && (r.offered ?? 0) >= V2_RETEST_TURNS && typeof r.lastAt === 'number' && turn > r.lastAt + 1;
    if (left || spent) { r.outcome = 'not_asked'; events.push(ev('v2_retest_outcome', `target=${quoteTarget(r.target)} outcome=not_asked part=${r.in} turn=${turn}`)); }
  }
  if (!part || !said) return { lines, events };
  const open = list.find((r) => r.offered && !r.outcome);
  // Their answer just now uses the target of the open retest: one word of praise is allowed, once, if it is right.
  if (open && !open.praised && heard && usesTarget(heard, open.target)) {
    open.praised = true;
    // Task 7v (RETEST_TARGET_CHANGED): the praise names only the words the correction changed, never a neighbour shown for context.
    const runs = changedOn(flags) ? v2ChangedWords(open.said, open.right) : [];
    // Each target phrase holds its changed run (v2ChangedTarget, same order): only the runs of the phrases their answer used.
    const named = runs.length === open.target.length ? runs.filter((_, i) => usesTarget(heard, [open.target[i]!])) : [];
    const praise = named.length ? named : open.target;
    lines.push(`retest: their answer just now uses ${quoteTarget(open.target)}, which they got wrong earlier in the lesson ("${open.said}"). If it is right there, you may add one short word of praise that names it (you said ${quoteTarget(praise)} this time); once only`);
    return { lines, events };
  }
  let ask: V2Retest | undefined;
  if (open && (open.offered ?? 0) < retestTurns(flags)) ask = open;
  else if (!open && spreadOn(flags)) {
    // Task 7v (RETEST_SPREAD): one retest offered per part; only retests put to them count against the three a lesson (one that
    // ended "not asked" never reached them); one place kept for a free-conversation part still to come.
    const asked = list.filter((r) => r.offered && r.outcome !== 'not_asked').length;
    const convLater = !v2FreeConversationPart(plan.segments[part.index]) && plan.segments.some((seg, i) => i > part.index && v2PracticePart(plan, i) && v2FreeConversationPart(seg) && !state.timeFit?.dropped.includes(seg.id));
    if (!list.some((r) => r.in === part.id) && asked < V2_RETEST_MAX_ASKED - (convLater ? 1 : 0) && !v2PartBehind(session, state, part.index, nowMs)) ask = list.find((r) => !r.offered && !r.outcome && r.part !== part.id);
  }
  else if (!open && list.filter((r) => r.offered).length < V2_RETEST_MAX_ASKED && !v2PartBehind(session, state, part.index, nowMs)) ask = list.find((r) => !r.offered && !r.outcome && r.part !== part.id);
  // Task 7x (FREE_CONVERSATION): the turn that invites their own question asks nothing else; the retest waits a turn.
  if (ask && !lines.some((l) => l.startsWith('your turn to be asked'))) {
    // Fix round 1 (I1, I2): the turn of each send: only answers after the first send are scored, and not asked only after the
    // answer to the last send.
    ask.offered = (ask.offered ?? 0) + 1; ask.in = part.id; if (ask.offered === 1) ask.askedAt = turn; ask.lastAt = turn;
    events.push(ev('v2_retest_offered', `target=${quoteTarget(ask.target)} part=${part.id} from=${ask.part} send=${ask.offered}/${retestTurns(flags)} turn=${turn}`));
    // Task 7x (RETEST_ASKED): the instruction for the next question, one imperative sentence that gives its aim (mic test 7: six offered
    // as background, none asked).
    if (askedOn(flags)) lines.push(v2RetestAskLine(plan, ask));
    else lines.push(`retest of an earlier mistake: in the ${label(plan, ask.part)} part they said "${ask.said}" where "${ask.right}" was right (the point: ${quoteTarget(ask.target)}). If it fits this part's own topic, shape ONE of your questions in this part so that a natural answer needs ${quoteTarget(ask.target)}; do not mention the earlier mistake before they answer. If it does not fit, leave it`);
  }
  return { lines, events };
}

/** One sentence of their answer and the card this reply gave it: right as said, or corrected (its stress words). */
export interface V2PracticePair { said: string; card: string; corrected: boolean; stress: string[] }

/** The pairs of this answer: each sentence of theirs with the reply's card of it (each card used once); a sentence with no card
 *  is left out. `cards`: the reply's sentence cards painted or pointed back at, with their stress. */
export function v2PracticePairs(sentences: readonly string[], cards: ReadonlyArray<{ sentence: string; stress: readonly string[] }>, changed: boolean = TUTOR_V2_RETEST_TARGET_CHANGED && TUTOR_V2_RETEST_MISTAKE): V2PracticePair[] {
  const left = [...cards]; const out: V2PracticePair[] = [];
  for (const s of sentences) {
    const at = left.findIndex((c) => v2CardIsOf(c.sentence, s));
    if (at < 0) continue;
    const c = left.splice(at, 1)[0]!;
    const corrected = v2IsCorrectionOf(c.sentence, s);
    // Task 7v (RETEST_TARGET_CHANGED): the words the correction changed, with one neighbour each.
    if (changed && corrected) { const t = v2ChangedTarget(s, c.sentence, c.stress); if (t.length) { out.push({ said: s.slice(0, MAX_CHARS), card: c.sentence.slice(0, MAX_CHARS), corrected, stress: t }); continue; } }
    let stress = corrected ? v2RetestTarget(c.stress) : [];
    // A correction card with no stress: the card's words that are not theirs (learner-card.ts computes a runtime card's alike),
    // fix round 1 (M1): function words out when a content word stays, at most two.
    if (corrected && !stress.length) { const have = new Set(words(s)); stress = v2RetestTarget([...new Set(c.sentence.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [])].filter((w) => !words(w).every((x) => have.has(x))), DERIVED_MAX); }
    out.push({ said: s.slice(0, MAX_CHARS), card: c.sentence.slice(0, MAX_CHARS), corrected, stress });
  }
  return out;
}

/** After the reply (mutates `state`): this answer counted (one that needed a correction, or right), the step moved, corrections
 *  recorded, the open retest's outcome. `part`: the practice part the answer was given in (v2AdaptPart before the reply), null
 *  where nothing applies. `uncarded`: their answer had sentences of theirs and the reply carded none of them. */
export function v2AdaptAfter(session: V2Session, state: V2State, part: { index: number; id: string } | null, sentences: readonly string[], pairs: readonly V2PracticePair[], flags: V2AdaptFlags = FLAGS()): V2TurnEvent[] {
  const events: V2TurnEvent[] = [];
  if ((!flags.support && !flags.retest) || !part || !v2AdaptOn(session) || state.closed) return events;
  const turn = v2TutorReplies(state.history);
  const wrong = pairs.some((p) => p.corrected);
  const signal = wrong ? 'wrong' : pairs.length ? 'clean' : null;
  if (signal) events.push(ev('v2_practice_signal', `${signal} part=${part.id} turn=${turn} sentences=${pairs.length}${wrong ? ` corrected=${pairs.filter((p) => p.corrected).length} stress=${pairs.filter((p) => p.corrected).map((p) => p.stress.join('/')).join(';')}` : ''}`));
  else if (sentences.length) events.push(ev('v2_practice_signal', `none part=${part.id} turn=${turn} sentences=${sentences.length} (none carded in this reply)`));
  if (flags.support && signal) {
    const cur: V2Support = state.support && state.support.part === part.id ? { ...state.support } : { step: state.support?.step ?? 'normal', wrong: 0, clean: 0, part: part.id };
    if (signal === 'wrong') { cur.wrong = Math.min(V2_SUPPORT_RUN, cur.wrong + 1); cur.clean = 0; } else { cur.clean = Math.min(V2_SUPPORT_RUN, cur.clean + 1); cur.wrong = 0; }
    const by = cur.wrong >= V2_SUPPORT_RUN ? 1 : cur.clean >= V2_SUPPORT_RUN ? -1 : 0;
    const to = capped(session.plan!, part.index, moved(cur.step, by), followedOn(flags));
    if (to !== cur.step) { events.push(ev('v2_support_step', `from=${cur.step} to=${to} why=${by > 0 ? 'two_wrong' : 'two_clean'} part=${part.id} turn=${turn}`)); cur.step = to; cur.wrong = 0; cur.clean = 0; }
    state.support = cur;
  }
  // Task 7x (FREE_CONVERSATION): the answers corrected in a free-conversation part (the support signal, counted per part).
  if (freeOn(flags) && wrong && v2FreeConversationPart(session.plan!.segments[part.index])) {
    const fc = state.freeConv?.part === part.id ? state.freeConv : { part: part.id, corrected: 0 };
    state.freeConv = { ...fc, corrected: Math.min(99, fc.corrected + 1) };
  }
  if (!flags.retest) return events;
  const list = [...(state.retests ?? [])];
  // The open retest of this part: corrected again on its target = missed; its target used and not corrected on it = passed;
  // neither once its turns are spent = not asked.
  // Fix round 1 (I1, I2): only an answer given after the first send (the turn after it, or later) is scored: the answer heard
  // on the turn of the first send replies to a question that was not shaped. Not asked only once the answer to the last send
  // (the turn after it) has been read with neither outcome.
  const open = list.find((r) => r.offered && !r.outcome && r.in === part.id && typeof r.askedAt === 'number' && turn > r.askedAt);
  if (open) {
    const missed = pairs.some((p) => p.corrected && ((changedOn(flags) ? samePhrase(p.stress, open.target) : touches(p.stress, open.target)) || (!usesTarget(p.said, open.target) && usesTarget(p.card, open.target))));
    const passedNow = !missed && pairs.some((p) => usesTarget(p.said, open.target));
    // Task 7x (RETEST_ASKED): no "not asked" by turns: the outcome stays open until the part ends (v2AdaptBefore).
    const outcome = missed ? 'missed' : passedNow ? 'passed' : !askedOn(flags) && (open.offered ?? 0) >= V2_RETEST_TURNS && typeof open.lastAt === 'number' && turn > open.lastAt ? 'not_asked' : null;
    if (outcome) { open.outcome = outcome; events.push(ev('v2_retest_outcome', `target=${quoteTarget(open.target)} outcome=${outcome} part=${part.id} turn=${turn}`)); }
  }
  for (const p of pairs) {
    if (!p.corrected || !p.stress.length) continue;
    if (list.some((r) => (changedOn(flags) ? samePhrase(r.target, p.stress) : sameTarget(r.target, p.stress)))) continue;
    if (spreadOn(flags)) {
      // Task 7v (RETEST_SPREAD): at most V2_RETEST_PER_PART per part (the first two distinct targets); the list full, a newer one takes
      // the place of the oldest never offered, so later parts' mistakes are kept (mic test 6: full after "Your job").
      if (list.filter((r) => r.part === part.id).length >= V2_RETEST_PER_PART) continue;
      if (list.length >= V2_RETEST_MAX_KEPT) { const k = list.findIndex((r) => !r.offered && !r.outcome); if (k < 0) continue; const gone = list.splice(k, 1)[0]!; events.push(ev('v2_retest_replaced', `target=${quoteTarget(gone.target)} part=${gone.part} by=${quoteTarget(p.stress)} turn=${turn}`)); }
    } else if (list.length >= V2_RETEST_MAX_KEPT) continue;
    list.push({ part: part.id, said: p.said, right: p.card, target: p.stress, turn });
    events.push(ev('v2_retest_recorded', `target=${quoteTarget(p.stress)} part=${part.id} turn=${turn}`));
  }
  if (list.length) state.retests = list;
  return events;
}

/** Task 7q fix: a retest that was missed is a gap the next lesson's profile keeps (memory.ts gaps). */
export function v2RetestGaps(state: Pick<V2State, 'retests'>, enabled: boolean = TUTOR_V2_RETEST_MISTAKE): Array<{ kind: 'prerequisite'; conceptLabel: string; observation: string }> {
  if (!enabled) return [];
  return (state.retests ?? []).filter((r) => r.outcome === 'missed').map((r) => ({ kind: 'prerequisite' as const, conceptLabel: `${r.target.join(', ')}: "${r.right}"`.slice(0, 120), observation: `corrected ("${r.said}"), asked again later in the lesson and still not right`.slice(0, 200) }));
}

const STEP_SET = new Set<string>(V2_SUPPORT_STEPS);
const ID = /^[\w.:-]{1,80}$/;
const str = (x: unknown, n = MAX_CHARS) => (typeof x === 'string' && x.trim() ? x.slice(0, n) : null);
const count = (x: unknown, max: number) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? Math.min(max, Math.floor(x)) : 0);

/** The route's reading of the two fields in the client's state: anything malformed is dropped. */
export function v2ReadAdaptive(raw: Partial<Record<keyof V2State, unknown>>): Pick<V2State, 'support' | 'retests' | 'freeConv'> {
  const out: Pick<V2State, 'support' | 'retests' | 'freeConv'> = {};
  // Task 7x (FREE_CONVERSATION).
  const fc = raw.freeConv as Partial<NonNullable<V2State['freeConv']>> | undefined;
  if (fc && typeof fc === 'object' && typeof fc.part === 'string' && ID.test(fc.part)) out.freeConv = { part: fc.part, corrected: count(fc.corrected, 99), ...(fc.invited === true ? { invited: true as const } : {}) };
  const s = raw.support as Partial<V2Support> | undefined;
  if (s && typeof s === 'object' && typeof s.step === 'string' && STEP_SET.has(s.step)) out.support = { step: s.step, wrong: count(s.wrong, V2_SUPPORT_RUN), clean: count(s.clean, V2_SUPPORT_RUN), ...(typeof s.part === 'string' && ID.test(s.part) ? { part: s.part } : {}) };
  if (Array.isArray(raw.retests)) {
    const list: V2Retest[] = [];
    for (const r of raw.retests.slice(0, V2_RETEST_MAX_KEPT) as Array<Partial<V2Retest> | null>) {
      if (!r || typeof r !== 'object' || typeof r.part !== 'string' || !ID.test(r.part)) continue;
      const said = str(r.said); const right = str(r.right);
      const target = Array.isArray(r.target) ? r.target.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, MAX_TARGET_WORDS).map((x) => x.slice(0, 40)) : [];
      if (!said || !right || !target.length) continue;
      list.push({ part: r.part, said, right, target, turn: count(r.turn, 10000),
        ...(count(r.offered, V2_RETEST_TURNS_ASKED) ? { offered: count(r.offered, V2_RETEST_TURNS_ASKED) } : {}),
        ...(typeof r.in === 'string' && ID.test(r.in) ? { in: r.in } : {}),
        ...(typeof r.askedAt === 'number' && Number.isFinite(r.askedAt) && r.askedAt >= 0 ? { askedAt: count(r.askedAt, 10000) } : {}),
        ...(typeof r.lastAt === 'number' && Number.isFinite(r.lastAt) && r.lastAt >= 0 ? { lastAt: count(r.lastAt, 10000) } : {}),
        ...(r.outcome === 'passed' || r.outcome === 'missed' || r.outcome === 'not_asked' ? { outcome: r.outcome } : {}),
        ...(r.praised === true ? { praised: true as const } : {}) });
    }
    if (list.length) out.retests = list;
  }
  return out;
}

/** Task 7x (RETEST_ASKED): the retest as the instruction for the next question: one imperative sentence that gives its aim. */
export function v2RetestAskLine(plan: LessonPlan, r: V2Retest): string {
  return `next question's aim (a retest of an earlier mistake): Your next new question must make them say ${quoteTarget(r.target)}; for example ask about something whose natural answer is like "${r.right}" (in the ${label(plan, r.part)} part they said "${r.said}"). Keep it on this part's topic; do not mention the earlier mistake before they answer. A correction, a retry it asks for and one question a reply stay as they are`;
}

/** Task 7x (FREE_CONVERSATION): their words just now ask for help or are a question ("How do I say…?", "What should I say?",
 *  「わかりません」). Informs the facts only. */
const HELP = /[?？]\s*$|^(?:(?:uh|um|er|so|well|sorry|hmm)[,.]?\s+)*(?:how|what|which|can you|could you|would you|do you|is it|help|i don'?t (?:know|understand)|i'?m not sure)\b|わかりません|分かりません|どう言|教えて/i;
export function v2AskedForHelp(heard: string | null | undefined): boolean {
  return typeof heard === 'string' && HELP.test(heard.trim());
}
/** Task 7x (FREE_CONVERSATION): the learner's turn before this one was a silence turn (turn.ts v2StudentBlock: "[The student has not
 *  replied.]"). */
export function v2SilenceBefore(history: V2State['history']): boolean {
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i]!;
    if (h.role !== 'user') continue;
    const text = typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' ');
    if (!text.trim()) continue; // tool results only
    return /^\[The student has not replied\.\]/.test(text.trim());
  }
  return false;
}

/** Task 7x (FREE_CONVERSATION): the lines of a free-conversation part: corrections aloud spent (V2_FREE_CONV_CORRECTIONS), and once, at
 *  half its own minutes on the part clock, the invitation for the learner to ask a question (until a reply in the part asked them to). */
export function v2FreeConvLines(session: V2Session, state: V2State, part: { index: number; id: string }, nowMs: number): string[] {
  const lines: string[] = [];
  const fc = state.freeConv?.part === part.id ? state.freeConv : null;
  if (fc && fc.corrected >= V2_FREE_CONV_CORRECTIONS) lines.push(`corrections in this conversation part: ${fc.corrected} of their answers were corrected, and this part makes at most ${V2_FREE_CONV_CORRECTIONS} corrections aloud. From now on do not correct aloud and ask for no retry: respond to what they said and go on with the conversation. A sentence of theirs with a mistake still goes on the board as it should be (its sentence card, with no words about it), so it is kept for the summary's "To improve"`);
  const c = v2PartClock(session, state, nowMs);
  if (!fc?.invited && c && c.index === part.index && c.used >= c.own / 2) lines.push('your turn to be asked: half of this conversation part\'s time has passed and they have not yet been invited to ask you anything. In this reply, after responding to what they said, invite them to ask you one question of their own (about you or your own experience of this topic) instead of asking your next question; answer it briefly from your persona card, then go on with the conversation');
  return lines;
}

/** Task 7x (FREE_CONVERSATION): after the reply (mutates `state`): a reply in a free-conversation part that asked them to make a question
 *  of their own has given the invitation. `part`: as v2AdaptAfter's. */
export function v2FreeConvAfter(session: V2Session, state: V2State, part: { index: number; id: string } | null, replyText: string, enabled: boolean = TUTOR_V2_FREE_CONVERSATION): void {
  if (!enabled || !part || !v2AdaptOn(session) || state.closed || !v2FreeConversationPart(session.plan!.segments[part.index]) || !v2AskedForQuestion(replyText)) return;
  const fc = state.freeConv?.part === part.id ? state.freeConv : { part: part.id, corrected: 0 };
  state.freeConv = { ...fc, invited: true };
}
