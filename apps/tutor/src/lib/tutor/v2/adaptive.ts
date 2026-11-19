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
import { TUTOR_V2_RETEST_MISTAKE, TUTOR_V2_STARTER_IS_ANSWER, TUTOR_V2_SUPPORT_STEPS } from '../orchestrator/flags';
import { v2CardIsOf, v2SentenceWords } from './learner-card';
import { v2NoteTargetsOn } from './note-targets';
import { v2PartInHand, v2PartViewed, v2PlanLabelled, v2TutorReplies } from './part-flow';
import { v2PartOf } from './plan-map';
import { v2IsCorrectionOf } from './sentence-cards';
import { v2PracticePart } from './time-fit';
import type { V2Retest, V2Session, V2State, V2Support, V2SupportStep, V2TurnEvent } from './types';

export interface V2AdaptFlags { support: boolean; retest: boolean }
const FLAGS = (): V2AdaptFlags => ({ support: TUTOR_V2_SUPPORT_STEPS, retest: TUTOR_V2_RETEST_MISTAKE });

export const V2_SUPPORT_STEPS: readonly V2SupportStep[] = ['stretch', 'normal', 'starter', 'gap', 'repeat'];
/** Answers in a row that move the step. */
export const V2_SUPPORT_RUN = 2;
export const V2_RETEST_MAX_KEPT = 5;
export const V2_RETEST_MAX_ASKED = 3;
export const V2_RETEST_TURNS = 2;
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
export function v2SupportLine(step: V2SupportStep, starterIsAnswer: boolean = TUTOR_V2_STARTER_IS_ANSWER): string | null {
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

/** Whether the part is behind its plan minutes (the time used is past the minutes of the parts before it plus its own). No box,
 *  or a part with no minutes: not behind (nothing to tell by). */
export function v2PartBehind(session: V2Session, state: V2State, index: number, nowMs: number): boolean {
  const plan = session.plan;
  if (!plan || !session.timeBoxMinutes) return false;
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
    const from = state.support.step; const to = moved(from, from === 'normal' ? 0 : stepAt(from) > stepAt('normal') ? -1 : 1);
    state.support = { step: to, wrong: 0, clean: 0, part: part.id };
    if (to !== from) events.push(ev('v2_support_step', `from=${from} to=${to} why=part_change part=${part.id} turn=${turn}`));
  }
  // A silence turn (no words from them) gets no line: its reply is one short line with no new question (facts.ts), and a retest
  // sent then would spend one of its turns.
  const said = typeof heard === 'string' && !!heard.trim();
  if (flags.support && part && state.support && said) { const l = v2SupportLine(state.support.step); if (l) lines.push(l); }
  if (!flags.retest) return { lines, events };
  const list = state.retests ?? [];
  // An open retest is not asked when: the lesson is in another practice part, or at its summary or close (fix round 1, M3: not on
  // a turn on the pronunciation page or a 7k visit, from which the part comes back); or its last send's answer has gone by
  // with no outcome (M4: that answer carried no practice sentence, so v2AdaptAfter did not run on it).
  const ended = state.closed || typeof state.summaryBegunAt === 'number';
  for (const r of list) {
    if (!r.offered || r.outcome) continue;
    const left = part ? part.id !== r.in : ended;
    const spent = (r.offered ?? 0) >= V2_RETEST_TURNS && typeof r.lastAt === 'number' && turn > r.lastAt + 1;
    if (left || spent) { r.outcome = 'not_asked'; events.push(ev('v2_retest_outcome', `target=${quoteTarget(r.target)} outcome=not_asked part=${r.in} turn=${turn}`)); }
  }
  if (!part || !said) return { lines, events };
  const open = list.find((r) => r.offered && !r.outcome);
  // Their answer just now uses the target of the open retest: one word of praise is allowed, once, if it is right.
  if (open && !open.praised && heard && usesTarget(heard, open.target)) {
    open.praised = true;
    lines.push(`retest: their answer just now uses ${quoteTarget(open.target)}, which they got wrong earlier in the lesson ("${open.said}"). If it is right there, you may add one short word of praise that names it (you said ${quoteTarget(open.target)} this time); once only`);
    return { lines, events };
  }
  let ask: V2Retest | undefined;
  if (open && (open.offered ?? 0) < V2_RETEST_TURNS) ask = open;
  else if (!open && list.filter((r) => r.offered).length < V2_RETEST_MAX_ASKED && !v2PartBehind(session, state, part.index, nowMs)) ask = list.find((r) => !r.offered && !r.outcome && r.part !== part.id);
  if (ask) {
    // Fix round 1 (I1, I2): the turn of each send: only answers after the first send are scored, and not asked only after the
    // answer to the last send.
    ask.offered = (ask.offered ?? 0) + 1; ask.in = part.id; if (ask.offered === 1) ask.askedAt = turn; ask.lastAt = turn;
    events.push(ev('v2_retest_offered', `target=${quoteTarget(ask.target)} part=${part.id} from=${ask.part} send=${ask.offered}/${V2_RETEST_TURNS} turn=${turn}`));
    lines.push(`retest of an earlier mistake: in the ${label(plan, ask.part)} part they said "${ask.said}" where "${ask.right}" was right (the point: ${quoteTarget(ask.target)}). If it fits this part's own topic, shape ONE of your questions in this part so that a natural answer needs ${quoteTarget(ask.target)}; do not mention the earlier mistake before they answer. If it does not fit, leave it`);
  }
  return { lines, events };
}

/** One sentence of their answer and the card this reply gave it: right as said, or corrected (its stress words). */
export interface V2PracticePair { said: string; card: string; corrected: boolean; stress: string[] }

/** The pairs of this answer: each sentence of theirs with the reply's card of it (each card used once); a sentence with no card
 *  is left out. `cards`: the reply's sentence cards painted or pointed back at, with their stress. */
export function v2PracticePairs(sentences: readonly string[], cards: ReadonlyArray<{ sentence: string; stress: readonly string[] }>): V2PracticePair[] {
  const left = [...cards]; const out: V2PracticePair[] = [];
  for (const s of sentences) {
    const at = left.findIndex((c) => v2CardIsOf(c.sentence, s));
    if (at < 0) continue;
    const c = left.splice(at, 1)[0]!;
    const corrected = v2IsCorrectionOf(c.sentence, s);
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
    const to = moved(cur.step, by);
    if (to !== cur.step) { events.push(ev('v2_support_step', `from=${cur.step} to=${to} why=${by > 0 ? 'two_wrong' : 'two_clean'} part=${part.id} turn=${turn}`)); cur.step = to; cur.wrong = 0; cur.clean = 0; }
    state.support = cur;
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
    const missed = pairs.some((p) => p.corrected && (touches(p.stress, open.target) || (!usesTarget(p.said, open.target) && usesTarget(p.card, open.target))));
    const passedNow = !missed && pairs.some((p) => usesTarget(p.said, open.target));
    const outcome = missed ? 'missed' : passedNow ? 'passed' : (open.offered ?? 0) >= V2_RETEST_TURNS && typeof open.lastAt === 'number' && turn > open.lastAt ? 'not_asked' : null;
    if (outcome) { open.outcome = outcome; events.push(ev('v2_retest_outcome', `target=${quoteTarget(open.target)} outcome=${outcome} part=${part.id} turn=${turn}`)); }
  }
  for (const p of pairs) {
    if (!p.corrected || !p.stress.length || list.length >= V2_RETEST_MAX_KEPT) continue;
    if (list.some((r) => sameTarget(r.target, p.stress))) continue;
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
export function v2ReadAdaptive(raw: Partial<Record<keyof V2State, unknown>>): Pick<V2State, 'support' | 'retests'> {
  const out: Pick<V2State, 'support' | 'retests'> = {};
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
        ...(count(r.offered, V2_RETEST_TURNS) ? { offered: count(r.offered, V2_RETEST_TURNS) } : {}),
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
