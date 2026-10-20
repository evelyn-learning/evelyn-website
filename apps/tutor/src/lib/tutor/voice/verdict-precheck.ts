/**
 * Verdict pre-check — SERVER ONLY (reads env, calls a model). TEXT mode.
 *
 * Why (2026-10-06, replay of 23 scripted text sessions with thinking on): the
 * brain still denied or failed to credit a correct hedged answer in 5 of 12
 * sessions. In each the student had typed the correct FINAL answer while the
 * tutor's last question was about a smaller step ("what does the bottom
 * become?" → "maybe <the limit>?" → "Not quite — plug in…"), and the brain
 * graded it against the step. Reasoning inside the brain turn did not fix it:
 * the brain is busy with the reply, the board and 120K tokens of instructions.
 * A separate, small call that does ONE thing — which question does this
 * message answer, and is it right for THAT question — is run first, and its
 * finding is handed to the brain as a fact (./verdict-precheck-shared.ts
 * `formatAnswerCheckBlock`).
 *
 * When: a text-mode turn whose message proposes a value or claim
 * (turn-shape-signal.ts `answerShaped`: a hedged proposal, a bare value, a
 * fuller answer, "check my answer X") while a tutor question is open or the
 * student's own problem is tracked. Never for a bare yes / no, a question, a
 * request, or a runtime turn.
 *
 * It runs BEFORE the brain call of that turn, with nothing else in flight, so
 * the whole of its latency is added to the turn. Hard cap: 6 s (4 s until
 * 2026-10-06, when it cut 19 of 91 checks in the replay). A timeout, an
 * error, a refusal, an unparsable reply or a low-confidence reply yields
 * null / nothing injected — the turn then runs exactly as it did before.
 *
 *   TUTOR_TEXT_VERDICT_PRECHECK             unset/anything ⇒ ON · 'off' ⇒ off
 *   TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS  hard cap; set ⇒ that cap for every turn. Unset ⇒ 6000 for a
 *                                           short problem, rising with its length to 12000 (below)
 *   TUTOR_TEXT_VERDICT_PRECHECK_LONG_PROBLEM 'off' ⇒ 6000 whatever the problem's length
 *   TUTOR_MODEL_VERDICT_PRECHECK            model id (registry role `verdict-precheck`)
 *   TUTOR_TEXT_VERDICT_PRECHECK_THINKING    'low' (adaptive thinking, low effort) | 'off' (no thinking,
 *                                           a scratch field first) | 'bare' (neither); default per model, below
 *
 * Voice: the switch is false whatever the flag, so a voice request is the
 * pre-existing one byte for byte.
 *
 * The prompt is generic — no subject content, no example values (repo rule).
 * `runVerdictPrecheck` never throws. `npm run test:verdict-precheck`.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient, prepareParams, resolveModel } from '../ai/model-registry';
import { falseArithmeticIn } from './turn-shape-signal';
import { TUTOR_AMBIGUOUS_EXPRESSION_RULE, TUTOR_PRECHECK_DIFFERS_AT, TUTOR_READINESS_NAMED_TASK } from '@/lib/tutor/orchestrator/turn-round-flags';
import { readOpenQuestion } from './nonanswer-praise';
import { PROBLEM_LETTERS_RULE, problemLetterNames } from '../lesson-plan/homework-ledger';
import type {
  PrecheckConfidence,
  PrecheckTarget,
  PrecheckVerdict,
  VerdictPrecheckResult,
} from './verdict-precheck-shared';

/** 2026-10-06 (third round): 4 s cut 19 of 91 checks in the end-to-end replay
 *  (completed calls: p50 2.6 s, p90 3.3 s; the bench p90 was 6.0 s). 6 s. */
export const VERDICT_PRECHECK_TIMEOUT_MS = 6000;

/** On for a turn iff the session is text mode and the flag is not 'off'. */
export function textVerdictPrecheckEnabled(
  inputMode: unknown,
  flag: string | undefined = process.env.TUTOR_TEXT_VERDICT_PRECHECK,
): boolean {
  return inputMode === 'text' && flag !== 'off';
}

export function verdictPrecheckTimeoutMs(env: string | undefined = process.env.TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS): number {
  const n = Number(env);
  return Number.isFinite(n) && n >= 500 && n <= 15_000 ? Math.round(n) : VERDICT_PRECHECK_TIMEOUT_MS;
}

/** 2026-10-12: a multi-step word problem (≈270 characters) took the check
 *  7–11 s in four runs; at 6 s it was cut and the turn ran with no check —
 *  on exactly the problems where a wrong final answer is hardest to judge.
 *  The cap rises with the length of the problem being worked: 6 s up to 150
 *  characters, 40 ms for each character beyond, 12 s at most. */
export const VERDICT_PRECHECK_LONG_PROBLEM_FROM_CHARS = 150;
export const VERDICT_PRECHECK_LONG_PROBLEM_MS_PER_CHAR = 40;
export const VERDICT_PRECHECK_TIMEOUT_MAX_MS = 12_000;

/** The cap for THIS turn's check. An explicit
 *  TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS is the cap for every turn. */
export function verdictPrecheckTimeoutFor(
  input: Pick<VerdictPrecheckInput, 'problems' | 'currentProblem' | 'activeProblemStatement'>,
  env: { timeoutEnv?: string; longProblemFlag?: string } = {
    timeoutEnv: process.env.TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS,
    longProblemFlag: process.env.TUTOR_TEXT_VERDICT_PRECHECK_LONG_PROBLEM,
  },
): number {
  const base = verdictPrecheckTimeoutMs(env.timeoutEnv);
  if ((env.timeoutEnv ?? '').trim() && base !== VERDICT_PRECHECK_TIMEOUT_MS) return base;
  if (env.longProblemFlag === 'off') return base;
  const worked = (input.problems ?? [])[(input.currentProblem ?? 0) - 1]?.text ?? '';
  const chars = Math.max(worked.trim().length, (input.activeProblemStatement ?? '').trim().length);
  const extra = Math.max(0, chars - VERDICT_PRECHECK_LONG_PROBLEM_FROM_CHARS) * VERDICT_PRECHECK_LONG_PROBLEM_MS_PER_CHAR;
  return Math.min(VERDICT_PRECHECK_TIMEOUT_MAX_MS, base + extra);
}

/** 2026-10-15 (GreenApple staging, no-reveal-ledger-gate.ts): 7 of 78 checks
 *  were cut at 6 s; two of those were a hedged right answer and the first
 *  solved problem, so the ledger never recorded it and the tutor went back to
 *  it. Under the ledger the cap is at least 10 s (the long-problem rise above
 *  still applies, to 12 s). An explicit TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS
 *  still wins. */
export const LEDGER_VERDICT_PRECHECK_TIMEOUT_MS = 10_000;

export function ledgerVerdictPrecheckTimeoutFor(
  input: Pick<VerdictPrecheckInput, 'problems' | 'currentProblem' | 'activeProblemStatement'>,
  env: { timeoutEnv?: string; longProblemFlag?: string } = {
    timeoutEnv: process.env.TUTOR_TEXT_VERDICT_PRECHECK_TIMEOUT_MS,
    longProblemFlag: process.env.TUTOR_TEXT_VERDICT_PRECHECK_LONG_PROBLEM,
  },
): number {
  const base = verdictPrecheckTimeoutFor(input, env);
  if ((env.timeoutEnv ?? '').trim() && verdictPrecheckTimeoutMs(env.timeoutEnv) !== VERDICT_PRECHECK_TIMEOUT_MS) return base;
  return Math.max(LEDGER_VERDICT_PRECHECK_TIMEOUT_MS, base);
}

export interface VerdictPrecheckInput {
  /** The student's own problems (homework session), verbatim. */
  problems?: ReadonlyArray<{ n: number; text: string }>;
  /** Which of them is tracked as current (1-based position). */
  currentProblem?: number;
  /** The tracked active problem statement, when there is one. */
  activeProblemStatement?: string;
  /** The conversation so far, oldest first; the last few turns are used. */
  history: ReadonlyArray<{ role: 'user' | 'assistant'; content: string }>;
  /** The tutor's last question, verbatim; null when none is open. */
  openQuestion: string | null;
  studentMessage: string;
  /** Facts the runtime computed from the problem itself (a system /
   *  inequality problem: whiteboard/inequality-facts.ts), as plain text. */
  problemFacts?: string;
  /** Unset ⇒ TUTOR_READINESS_NAMED_TASK (a readiness question that names
   *  the next part says so under <open_question>). */
  readinessTask?: boolean;
  /** 2026-10-19 (homework ledger): list POSITIONS (1-based) of the problems
   *  already solved. Rendered only when `deps.ledger` is on. */
  solved?: readonly number[];
}

export interface VerdictPrecheckLlmRequest {
  system: string;
  user: string;
  maxTokens: number;
  signal: AbortSignal;
  timeoutMs: number;
}
export interface VerdictPrecheckLlmReply { text: string; model: string; inputTokens: number; outputTokens: number }
/** The model call, injectable so tests never touch the network. */
export type VerdictPrecheckLlm = (req: VerdictPrecheckLlmRequest) => Promise<VerdictPrecheckLlmReply>;

export interface VerdictPrecheckDeps {
  llm?: VerdictPrecheckLlm;
  timeoutMs?: number;
  /** Measurement overrides (scripts/replay-verdict-turns.ts). */
  model?: string;
  thinking?: 'low' | 'off' | 'bare';
  /** Unset ⇒ TUTOR_PRECHECK_DIFFERS_AT; false ⇒ `differsAt` is never kept. */
  differsAt?: boolean;
  /** 2026-10-19 (no-reveal-ledger-gate.ts): ask for `solved_problem` and
   *  list the problems already solved. Unset/false ⇒ the request as before. */
  ledger?: boolean;
  /** 2026-10-19: judge a stated claim that answers none of the questions
   *  (`CLAIM_VERDICT_RULE`). Unset/false ⇒ the prompt as before. */
  claimVerdict?: boolean;
  /** 2026-10-16 (GAC v12): under the ledger a CORRECT finding is confirmed by
   *  a second, independent check started at the same time. Unset ⇒ on
   *  (ledger only); false ⇒ one check, as before. */
  confirmCorrect?: boolean;
  now?: () => number;
}

export const VERDICT_PRECHECK_SYSTEM =
  'You check ONE student message in a tutoring session, before the tutor replies. You are given the student\'s own problem or problems, the recent conversation, the last question the tutor asked (the open question), and the student\'s message. Nobody but the tutor\'s software reads your output.\n' +
  'Work in this order.\n' +
  '1. WHAT IS PROPOSED. Find the value, expression, statement or claim the message offers as an answer. A hedge that goes on to propose something ("I don\'t know, maybe …") proposes that thing. A request to check a value proposes that value. If the message proposes nothing — it is an assent, a question, a request, small talk — set answers to "neither".\n' +
  '2. SOLVE THE PROBLEM FIRST. Before deciding anything else, work out for yourself, from the student\'s own problem and data, the final answer of the problem (and of the part) being worked, and the answer to the open question. Do every operation yourself. Do not take over any value or intermediate result from the conversation — not from the tutor, even where the tutor has already confirmed or rejected something (tutors make mistakes), and not from the student\'s own message (a line of working inside it can be wrong: recompute each operation they wrote).\n' +
  '3. WHICH QUESTION IT ANSWERS.\n' +
  '   First test: does the proposed value equal the final answer of the problem or part being worked? If it does, and the open question was asking for something else (a smaller step, a method, a reason), then answers is "overall_problem" and the verdict is "correct" — the student has jumped ahead to the final answer. This holds even when the value could also be read as a wrong answer to the open question: matching the final answer is not a coincidence.\n' +
  '   Otherwise decide from what KIND of thing each question asks for and what kind of thing the student gave:\n' +
  '   "open_question" — it is a possible answer to the tutor\'s last question exactly as that question was asked (including when that question itself asks for the final answer).\n' +
  '   "overall_problem" — it is offered as an answer to the problem or part being worked rather than to the smaller step the tutor had just asked about.\n' +
  '   "other_part" — it answers a different problem, or a different part, from the one being worked — including one that was settled earlier.\n' +
  '   "neither" — it answers none of these: it is the wrong kind of thing for the open question and is not an answer to any of the student\'s problems, or it is unrelated.\n' +
  '4. COMPARE with your own answer to THAT question. An equivalent form, notation, ordering or unit spelling is the same answer. verdict: "correct" only when it is the complete right answer to that question; "incorrect"; "partly_correct" when the question asks for several things, or for all the values that work, and the student gave only some of them, or part is right and part is wrong; "cannot_determine" when the question has no single right answer (an opinion, an open-ended draft, a choice of what to do next) or there is not enough information to solve it.\n' +
  '5. CONFIDENCE. "high" only when it is unambiguous which question the message answers AND you solved that question completely. "medium" when either is somewhat uncertain. "low" otherwise. When answers is "neither", confidence is about that classification alone.\n' +
  'Fields, in this order: proposed_value — what the student proposed, as they wrote it. problem_final_answer — the final answer of the problem or part being worked, as YOU worked it out in step 2 (empty if it has no single answer). proposed_equals_final_answer — true when the two are the same answer. target — a short name for the question the message answers, in your own words. correct_value — the correct answer to THAT question, worked out by you; empty when answers is "neither" or the verdict is "cannot_determine". differs_test and differs_at — only when answers is "overall_problem" and the verdict is "incorrect"; both empty in every other case. Put what the student proposed into each thing the problem states, one at a time, and find the first condition, quantity or relationship of the problem that their answer does NOT agree with. It is something the problem gives, not the quantity the problem asks for. differs_test — for that one thing, what their answer gives and what the problem states, in a few words. differs_at — its name alone, in a few words, the way the problem names it. ONE thing only: do not join several conditions together. It must be something their answer actually fails: never name a condition their answer satisfies. Give no value in differs_at — not the correct answer, not a result of any working. If what they proposed cannot be put into the problem\'s conditions directly, or you are not sure which one fails, leave both empty rather than guess.';

/**
 * 2026-10-06b (portal-10beb4f5, voice): a spoken expression arrived as words
 * with no brackets, could be grouped two ways, and the check graded the
 * grouping the student did not mean — a correct answer came back "incorrect"
 * with high confidence. The same happens with typed input that leaves its
 * brackets out. One sentence added to step 4; generic wording.
 */
export const AMBIGUOUS_READING_RULE =
  ' AMBIGUOUS WRITING OR SPEECH. The student\'s words may reach you spoken aloud and transcribed, or typed without brackets, so what they proposed can have more than one reasonable reading (how its parts are grouped, which part a word applies to). List the reasonable readings before you compare. If ANY reasonable reading is the right answer to that question, the verdict is "correct", and correct_value gives that answer written out in full and unambiguously. Only when NO reasonable reading is right is the verdict "incorrect". Never return "incorrect" on the strength of one reading while another reasonable reading is right.';

/**
 * 2026-10-06c (portal-c301c9ad @77.3 s): the tutor's last question was "Ready
 * to move to <the next part>, finding <its quantity>?", the student answered
 * with a value for that part, and the check — reading a readiness question as
 * "no question asked" — graded the value against a later part. One sentence
 * after the "open_question" definition of step 3; generic wording.
 */
export const READINESS_TASK_RULE =
  '\n   A readiness or transition question that names the next part or task (it asks whether the student is ready for, or wants to move on to, a named part, and may name what that part asks for) makes THAT part the open question: a value or working the student offers in reply is their answer to that part — "open_question", judged against that part.';

/**
 * 2026-10-19 (GreenApple Biology, 2026-10-14): "can you check my answer:
 * <a false claim about the topic>" was classed "neither" with no verdict on
 * the claim, so the tutor was told to ask its open question again and the
 * misconception stood. A stated claim is judged even when it answers none of
 * the questions. Appended after step 4; generic wording.
 */
export const CLAIM_VERDICT_RULE =
  ' A STATED CLAIM THAT ANSWERS NOTHING. When answers is "neither" but the message states a claim of fact, rule, definition or reasoning about the subject (including one the student asks you to check), still judge that claim from what is true of the subject: verdict "incorrect" when the claim is false, "correct" when it is true. Use "cannot_determine" only when the message states no claim at all (an assent, a question, a request, small talk). Confidence then covers both the classification and your judgement of the claim.';

/**
 * 2026-10-19 (homework ledger, lesson-plan/homework-ledger.ts): the check
 * names the listed problems whose complete final answer the student has now
 * stated, so the session can record them as solved from the check rather
 * than from the tutor's memory. Appended after the field list; generic wording.
 *
 * 2026-10-15 (GAC staging, varied run v5): the field named ONE problem per
 * message, judged from that message alone. Two answers in one message
 * recorded only the first problem; a two-part answer given across two
 * messages was never recorded. It is now a list, and a part the student
 * stated in an earlier message counts. `about_problem` names the listed
 * problem the message is about, so a wrong second answer to a problem
 * already solved does not reopen it.
 */
// 2026-10-15 (GAC v7 audit): `reason_wrong` — a right value with a false
// reason was forced to "correct" by the final-answer test and recorded solved.
// 2026-10-15 (GAC staging v6): "<right answer> and <wrong answer>" in one
// message was judged correct as a whole and both problems recorded solved
// (and, once, the wrong one praised). Each stated answer is judged on its
// own, against the check's own working, before anything is recorded.
export const SOLVED_PROBLEM_FIELD_RULE =
  ' stated_answers — one entry for EACH of the student\'s listed problems (or part of one) that this message states an answer for: problem (its number as listed), stated (what the message states for it), own_answer (the answer to that problem or part as YOU worked it out in step two — work it out for each one, do not assume), right (true only when stated is the same answer as own_answer). Empty when the message states no answer to a listed problem. When the message states answers for more than one problem or part, the verdict is "correct" only when every entry is right, and "partly_correct" when some are right and some are not.'
  + ' solved_problems — the numbers, as listed in <student_problems>, of EVERY one of the student\'s problems whose COMPLETE final answer (every part and every value that problem asks for) the student has now stated correctly, judged by your own working in step two. One message can complete several problems: list each one. An answer can also be split across messages: for each part of a problem, take the student\'s LATEST statement of it, in this message or in their own earlier messages in the recent conversation (never the tutor\'s words); when those latest statements together are the complete right answer, list the problem. Leave a problem out when only a step, one part or some of the values have been stated, or when the latest statement of any part is wrong. Judge this whichever question the message answers: a message that restates the complete final answer of a problem settled earlier lists that problem. Empty when none, or when no problems are listed.'
  + ' about_problem — the number, as listed in <student_problems>, of the student\'s problem this message proposes an answer, step or part for; zero when it is about none of the listed problems (a new problem of their own, a general claim, small talk) or when it is about several.'
  + ' reason_wrong — true when the message gives a reason, rule or method for its answer and that reason is false or does not actually establish the answer, even when the answer itself is right; false when it gives no reason or a sound one. A reason that uses a value which is right under an accepted convention is sound, even when your own working used another convention. A right answer with a wrong reason is "partly_correct", and that problem is not listed in solved_problems.'
  + ' wrong_step — when the answer is wrong and the message shows working: the FIRST operation in THEIR working that is wrong, named by what it does with the numbers or terms THEY wrote (which subtraction, which sign, which substitution), in a few words. Recompute every operation they wrote, in order, and name the first one that does not hold — not a later one, and never an operation they did correctly. Give no result: not the correct value of that operation, not the answer. Empty when they showed no working, when their working holds and the error is elsewhere, or when you are not sure.';

/**
 * 2026-10-15 (GAC staging v5): with several problems listed, a correct answer
 * to a DIFFERENT listed problem from the one the tutor was asking about was
 * judged a wrong answer to the open question. Ledger only; inserted after the
 * first test of step 3; generic wording.
 */
export const OTHER_LISTED_PROBLEM_RULE =
  '\n   Second test: does the proposed value equal the final answer of a DIFFERENT one of the student\'s listed problems (or of one of its parts)? If it does, answers is "other_part" and the verdict is "correct" — the student has answered that problem, not the question asked just now.';

/**
 * 2026-10-15 (GAC v7, Algebra II): "a is 3" — one of the two roots of the
 * first problem — was judged against the tutor's smaller step question and
 * called wrong. A value the student labels with a problem is an answer to
 * that problem. Ledger only; after the second test; generic wording.
 */
export const NAMED_PROBLEM_RULE =
  '\n   Third test: when the message names one of the listed problems for a value (by its letter, number or position), that value is the student\'s answer to THAT problem, never to the open question: judge it against that problem\'s final answer — "partly_correct" when it is some of the values that problem asks for and all of them are right.';

/**
 * 2026-10-15 (GAC v7 audit): the same answer in another form was left to
 * "an equivalent form … is the same answer", and a value the student reports
 * from someone else was not always read as proposed. Ledger only; inserted
 * before step 5; generic wording.
 * 2026-10-16 (GAC v17, Biology): "it binds in the active site itself and
 * blocks the substrate" — the problem's whole question — was partly_correct
 * because the check's own answer added "its shape resembles the substrate"
 * (asked by the tutor along the way), and (b) stayed open at the wrap-up.
 */
/** 2026-10-20 (GAC Geometry upload portal-242abe76): "angles are 70, 60, 50 -
 *  scalene triangle" was checked CORRECT for "classify the triangle by its
 *  angles" (the answer is acute; scalene classifies by sides). */
export const ANSWER_KIND_RULE =
  ' THE KIND OF ANSWER ASKED FOR. When the question asks for something by a stated criterion or in a stated form — a classification by one property, a name, a value to a given precision or in a given unit, a form such as a fraction or an exact value — an answer that is true of the object but answers a different criterion or a different kind of question is not an answer to that question: "incorrect" when that is all it gives, "partly_correct" when the message also gives a right part of what was asked. Judge against the question as the problem words it, not against whether the statement is true.';

export const LEDGER_FORMS_RULE =
  ' SAME ANSWER, ANOTHER FORM. A number written in words, an answer written in another language, a percentage of the same fraction, another exact form of the same value, and a right value with its unit left off or abbreviated are all the same answer. A rounded decimal of an exact answer is the same answer when the problem does not ask for an exact form; when the problem asks for an exact form, it is "partly_correct" (the right value, not yet in the form asked for), never "incorrect". Where the subject has more than one accepted convention or method for a quantity, an answer that is right under a recognised one is right: before you call a value wrong, check whether another accepted method or convention gives it, and if one does, it is right — and so is later working built on it. Use ONE convention consistently through your own working; never mix two in one calculation. A value the student reports from someone else (a teacher, a friend, a book, an answer key) for one of their problems is proposed and judged exactly as if they had written it themselves. Judge only what the message actually says: never complete a vague answer or replace a related term with the right one. A misspelt word is the word it is closest to; when that is a different term from the answer (a related part, substance, process or person), it is not the answer. A WORDED ANSWER (a why, what or describe question): the complete answer is what the problem as written asks for — not every detail a full textbook answer would add, and not a detail a later question of the tutor\'s asked for. A message that states that point correctly answers the problem completely ("correct", the problem is solved), even when it leaves out a cause or a detail the problem itself did not ask for.';

/**
 * 2026-10-15 (GAC v7, Geometry): "31.4" for a circumference asked "in terms
 * of pi" came back INCORRECT with high confidence, and the reply said it was
 * not what the problem gives. A decimal that rounds the check's own exact
 * answer is never a wrong value. The plain numeric value of a short answer
 * (π, square roots, fractions, powers; a leading "x =" and a trailing unit
 * dropped), or null when it is not one.
 */
export function plainNumericValue(text: string): number | null {
  let t = String(text ?? '').toLowerCase().replace(/\s+/g, '').replace(/−/g, '-')
    .replace(/\\pi|π/g, 'P').replace(/\\sqrt\{([^{}]*)\}/g, 'S($1)').replace(/√\(/g, 'S(').replace(/√(\d+(?:\.\d+)?)/g, 'S($1)')
    .replace(/sqrt\(/g, 'S(').replace(/\bpi\b|pi/g, 'P').replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
  t = t.replace(/^[a-z][a-z0-9_]*(?:\([a-z]\))?=/, '').replace(/[a-oq-z°²³]+$/i, '').replace(/[{}]/g, '');
  if (!t || !/^[0-9.+\-*/^()PS]+$/.test(t) || !/\d|P/.test(t)) return null;
  const expr = t.replace(/(\d|\)|P)(?=[P(S])/g, '$1*').replace(/\^/g, '**').replace(/P/g, '(Math.PI)').replace(/S\(/g, 'Math.sqrt(');
  try {
    // Only digits, operators, brackets and the two Math names reach here.
    const v = Function(`"use strict"; return (${expr});`)() as unknown;
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  } catch { return null; }
}

/** Is `stated` a decimal rounding of the exact answer `own`? Only for an
 *  exact form (π, a root or a fraction) and a decimal with at least one
 *  place or three significant digits. */
export function roundsExactAnswer(stated: string, own: string): boolean {
  if (!/π|pi|√|sqrt|\/|frac/i.test(String(own ?? ''))) return false;
  const m = /(-?\d+)(?:\.(\d+))?/.exec(String(stated ?? ''));
  if (!m || /π|pi|√|sqrt|\//i.test(String(stated))) return false;
  const places = m[2]?.length ?? 0;
  if (places === 0 && m[1].replace('-', '').length < 3) return false;
  const a = plainNumericValue(stated), b = plainNumericValue(own);
  if (a === null || b === null) return false;
  return Math.abs(a - b) <= 0.5 * Math.pow(10, -places) + 1e-9;
}

/** The system prompt the check is sent. `ambiguousReadingRule` unset ⇒
 *  TUTOR_AMBIGUOUS_EXPRESSION_RULE; `readinessTaskRule` unset ⇒
 *  TUTOR_READINESS_NAMED_TASK; both false ⇒ the prompt of 2026-10-06. */
export function verdictPrecheckSystem(opts?: { ambiguousReadingRule?: boolean; readinessTaskRule?: boolean; claimVerdict?: boolean; ledger?: boolean }): string {
  let system = verdictPrecheckSystemBase(opts);
  if (opts?.claimVerdict === true) {
    const marker = '\n5. CONFIDENCE.';
    const at = system.indexOf(marker);
    system = at < 0 ? system + CLAIM_VERDICT_RULE : system.slice(0, at) + CLAIM_VERDICT_RULE + system.slice(at);
  }
  if (opts?.ledger === true) {
    const anchor = 'matching the final answer is not a coincidence.';
    const i = system.indexOf(anchor);
    if (i >= 0) system = system.slice(0, i + anchor.length) + OTHER_LISTED_PROBLEM_RULE + NAMED_PROBLEM_RULE + system.slice(i + anchor.length);
    const at5 = system.indexOf('\n5. CONFIDENCE.');
    system = at5 < 0 ? system + LEDGER_FORMS_RULE + ANSWER_KIND_RULE : system.slice(0, at5) + LEDGER_FORMS_RULE + ANSWER_KIND_RULE + system.slice(at5);
    system += SOLVED_PROBLEM_FIELD_RULE;
  }
  return system;
}

function verdictPrecheckSystemBase(opts?: { ambiguousReadingRule?: boolean; readinessTaskRule?: boolean }): string {
  let system = VERDICT_PRECHECK_SYSTEM;
  if (opts?.readinessTaskRule ?? TUTOR_READINESS_NAMED_TASK) {
    const anchor = 'including when that question itself asks for the final answer).';
    const i = system.indexOf(anchor);
    if (i >= 0) system = system.slice(0, i + anchor.length) + READINESS_TASK_RULE + system.slice(i + anchor.length);
  }
  if (!(opts?.ambiguousReadingRule ?? TUTOR_AMBIGUOUS_EXPRESSION_RULE)) return system;
  const marker = '\n5. CONFIDENCE.';
  const at = system.indexOf(marker);
  if (at < 0) return system + AMBIGUOUS_READING_RULE;
  return system.slice(0, at) + AMBIGUOUS_READING_RULE + system.slice(at);
}

/** `working` is a scratch field for a model that is NOT thinking: it is
 *  written first so the verdict follows the working. A thinking model has
 *  done its working already, and the field would only add ~1 s of output. */
const WORKING_FIELD_NOTE = ' working — your own working, at most 80 words, written before anything else.';

// Field ORDER is part of the method: the reply is written in this order, so
// the final answer of the problem is on the page — and compared with what the
// student proposed — before the model commits to which question the message
// answers. (Bench, 2026-10-06: without these two fields a correct final
// answer given while a method question was open was classed, with high
// confidence, as a wrong answer to the method question.)
const BASE_PROPERTIES = {
  proposed_value: { type: 'string' },
  problem_final_answer: { type: 'string' },
  proposed_equals_final_answer: { type: 'boolean' },
  answers: { type: 'string', enum: ['open_question', 'overall_problem', 'other_part', 'neither'] },
  target: { type: 'string' },
  correct_value: { type: 'string' },
  verdict: { type: 'string', enum: ['correct', 'incorrect', 'partly_correct', 'cannot_determine'] },
  confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  // Last, so that every field before them is written exactly as it was. The
  // test is written before the name, so the name follows from a test.
  differs_test: { type: 'string' },
  differs_at: { type: 'string' },
} as const;

export const VERDICT_PRECHECK_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['proposed_value', 'problem_final_answer', 'proposed_equals_final_answer', 'answers', 'target', 'correct_value', 'verdict', 'confidence', 'differs_test', 'differs_at'],
  properties: BASE_PROPERTIES,
};
export const VERDICT_PRECHECK_SCHEMA_WITH_WORKING: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['working', 'proposed_value', 'problem_final_answer', 'proposed_equals_final_answer', 'answers', 'target', 'correct_value', 'verdict', 'confidence', 'differs_test', 'differs_at'],
  properties: { working: { type: 'string' }, ...BASE_PROPERTIES },
};

/** 2026-10-19: the same schema with the ledger fields LAST, so every field
 *  before them is written exactly as it was (homework ledger). 2026-10-15:
 *  `solved_problems` (a list) replaced `solved_problem`; `about_problem` added. */
export function withSolvedProblemField(schema: Record<string, unknown>): Record<string, unknown> {
  return {
    ...schema,
    required: [...(schema.required as string[]), 'stated_answers', 'solved_problems', 'about_problem', 'reason_wrong', 'wrong_step'],
    properties: {
      ...(schema.properties as Record<string, unknown>),
      stated_answers: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['problem', 'stated', 'own_answer', 'right'],
          properties: { problem: { type: 'integer' }, stated: { type: 'string' }, own_answer: { type: 'string' }, right: { type: 'boolean' } },
        },
      },
      solved_problems: { type: 'array', items: { type: 'integer' } },
      about_problem: { type: 'integer' },
      reason_wrong: { type: 'boolean' },
      wrong_step: { type: 'string' },
    },
  };
}

const HISTORY_TURNS = 8;
const TURN_MAX_CHARS = 900;
const PROBLEM_MAX_CHARS = 1500;

function clip(s: string, max: number): string {
  const t = (s ?? '').trim();
  return t.length > max ? `${t.slice(0, max)} …` : t;
}

/** 2026-10-19 (ledger): '' unless `solved` is given (the ledger is on).
 *  2026-10-15: with the ledger on, also how the student may name a problem
 *  (homework-ledger.ts `PROBLEM_LETTERS_RULE`). */
function solvedNote(problems: ReadonlyArray<{ n: number; text: string }>, solved?: readonly number[]): string {
  if (!solved) return '';
  const labels = solved.map((pos) => problems[pos - 1]?.n).filter((n): n is number => typeof n === 'number');
  return `\n(${PROBLEM_LETTERS_RULE})`
    + (labels.length ? `\n(Already solved, from earlier checks: ${labels.map((n) => `Problem ${n}`).join(', ')}.)` : '');
}

/** The user content of the pre-check call. Exported for the tests. */
export function buildVerdictPrecheckUser(input: VerdictPrecheckInput): string {
  const parts: string[] = [];
  const problems = input.problems ?? [];
  if (problems.length > 0) {
    const cur = problems[(input.currentProblem ?? 0) - 1];
    parts.push(
      '<student_problems>\n'
      + problems.map((p) => `${p.n}. ${clip(p.text, PROBLEM_MAX_CHARS)}`).join('\n')
      + (cur ? `\n(The tutor's tracker marks Problem ${cur.n} as the one being worked. The tracker can lag behind the conversation.)` : '')
      + solvedNote(problems, input.solved)
      + '\n</student_problems>',
    );
  }
  const statement = (input.activeProblemStatement ?? '').trim();
  if (statement && !problems.some((p) => p.text.includes(statement.slice(0, 60)))) {
    parts.push(`<problem_on_the_board>\n${clip(statement, PROBLEM_MAX_CHARS)}\n</problem_on_the_board>`);
  }
  // 2026-10-06b: the check read the same conversation as the tutor and
  // followed its error about which side of a line is shaded. These facts are
  // computed from the problem's own inequalities.
  const facts = (input.problemFacts ?? '').trim();
  if (facts) {
    parts.push(`<computed_facts>\n${clip(facts, 3000)}\nThese were computed from the problem itself and are certain: use them as given in step 2, even where the conversation — tutor or student — says otherwise.\n</computed_facts>`);
  }
  const recent = input.history.filter((m) => typeof m.content === 'string' && m.content.trim()).slice(-HISTORY_TURNS);
  if (recent.length > 0) {
    parts.push(
      '<recent_conversation>\n'
      + recent.map((m) => `${m.role === 'assistant' ? 'TUTOR' : 'STUDENT'}: ${clip(m.content, TURN_MAX_CHARS)}`).join('\n')
      + '\n</recent_conversation>',
    );
  }
  // 2026-10-06c: a readiness question that names the next part — say which
  // part is open, so a value for it is not read as "no question asked".
  const namedTask = input.openQuestion && (input.readinessTask ?? TUTOR_READINESS_NAMED_TASK)
    ? readOpenQuestion(input.openQuestion, { namedTask: true })?.namedTask
    : undefined;
  parts.push(`<open_question>\n${input.openQuestion ? clip(input.openQuestion, 500) : '(the tutor\'s last message asked no question)'}`
    + (namedTask ? `\n(This readiness question introduces the next part: "${clip(namedTask, 200).replace(/"/g, "'")}". A value or working the student offers now answers that part.)` : '')
    + '\n</open_question>');
  parts.push(`<student_message>\n${clip(input.studentMessage, 1200)}\n</student_message>`);
  // 2026-10-15 (GAC v8): "a is <value>" — the problem a letter names, stated
  // for the check (ledger requests only: `solved` is set only for them).
  if (input.solved && problems.length > 1) {
    const named = problemLetterNames(input.studentMessage, problems.map((p) => p.n));
    if (named.length) parts.push(`<named_problems>\nThe student's message labels a value with a problem letter: ${named.join(', ')}. That value is their answer to THAT problem (third test).\n</named_problems>`);
  }
  // A written calculation with the wrong result: a calculator's finding, so
  // the model does not have to notice it (it did not, once — see
  // turn-shape-signal.ts `falseArithmeticIn`).
  const wrongSum = falseArithmeticIn(input.studentMessage);
  if (wrongSum) {
    parts.push(`<calculator_check>\nThe student's message states "${wrongSum.claim}". By calculator: ${wrongSum.correct}.\n</calculator_check>`);
  }
  return parts.join('\n\n');
}

/** Default thinking setting per model family. Measured 2026-10-06 on the 91
 *  answer-shaped turns of the 23 replayed sessions
 *  (scripts/replay-verdict-turns.ts `--precheck-bench`; outputs and my
 *  reading in artifacts/replay-verdict-turns/levers/):
 *    claude-sonnet-5, thinking low   88/91 right · p50 2.6–3.5 s · p90 3.3–6.0 s
 *    claude-sonnet-4-6 (grader class) no thinking, scratch field first:
 *                                    81/89 right, 4 high-confidence errors on
 *                                    exactly the hedged class · p50 4.3 s
 *    claude-haiku-4-5                75/89, 12 high-confidence errors · p50 2.3 s
 *  'bare' (no thinking, no scratch field; Sonnet 5) was 44/46 on the wrong +
 *  hedged classes at p50 ~2.2 s but wrote a wrong correct_value twice — the
 *  faster option if the 4 s cap cuts too many checks (it cut 19 of 91 in the
 *  end-to-end replay with thinking low). */
export function verdictPrecheckThinking(
  model: string,
  env: string | undefined = process.env.TUTOR_TEXT_VERDICT_PRECHECK_THINKING,
): 'low' | 'off' | 'bare' {
  if (env === 'low' || env === 'off' || env === 'bare') return env;
  return /sonnet-5|opus-5/.test(model) ? 'low' : 'off';
}

function defaultLlm(deps: VerdictPrecheckDeps): VerdictPrecheckLlm {
  return async (req) => {
    const role = getModelClient('verdict-precheck');
    const model = deps.model ?? role.model;
    const thinking = deps.thinking ?? verdictPrecheckThinking(model);
    // 'bare' (measurement only): no thinking and no scratch field.
    const baseSchema = thinking === 'off' ? VERDICT_PRECHECK_SCHEMA_WITH_WORKING : VERDICT_PRECHECK_SCHEMA;
    const schema = deps.ledger === true ? withSolvedProblemField(baseSchema) : baseSchema;
    const params = prepareParams('verdict-precheck', {
      model,
      max_tokens: req.maxTokens,
      system: thinking === 'off' ? req.system + WORKING_FIELD_NOTE : req.system,
      messages: [{ role: 'user', content: req.user }],
      ...(thinking === 'low'
        ? { thinking: { type: 'adaptive' }, output_config: { effort: 'low', format: { type: 'json_schema', schema } } }
        : { thinking: { type: 'disabled' }, output_config: { format: { type: 'json_schema', schema } } }),
    });
    const msg = await role.client.messages.create(params as unknown as Anthropic.MessageCreateParamsNonStreaming, {
      signal: req.signal,
      timeout: req.timeoutMs,
      maxRetries: 0,
    });
    if (msg.stop_reason === 'refusal') throw new Error('model declined the request');
    if (msg.stop_reason === 'max_tokens') throw new Error('reply truncated');
    const text = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
    return { text, model, inputTokens: msg.usage?.input_tokens ?? 0, outputTokens: msg.usage?.output_tokens ?? 0 };
  };
}

function parseReply(text: string): Record<string, unknown> | null {
  const t = (text ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    const s = t.indexOf('{');
    const e = t.lastIndexOf('}');
    if (s < 0 || e <= s) return null;
    const v = JSON.parse(t.slice(s, e + 1)) as unknown;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const TARGETS: ReadonlySet<string> = new Set(['open_question', 'overall_problem', 'other_part', 'neither']);
const VERDICTS: ReadonlySet<string> = new Set(['correct', 'incorrect', 'partly_correct', 'cannot_determine']);
const CONFIDENCES: ReadonlySet<string> = new Set(['high', 'medium', 'low']);

/**
 * What a wrong answer does not agree with, or '' when it may not be used.
 * It is rendered on the branch that withholds the correct value, so it must
 * carry none: it is dropped when it contains the check's own correct value,
 * or any number that is in neither the student's problem nor their message
 * (such a number is a result of working).
 */
export function safeDiffersAt(raw: unknown, correctValue: string, input: VerdictPrecheckInput): string {
  const at = String(raw ?? '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  if (!at) return '';
  const norm = (v: string) => v.toLowerCase().replace(/\s+/g, '');
  const value = norm(correctValue);
  if (value && norm(at).includes(value)) return '';
  const given = [...(input.problems ?? []).map((p) => p.text), input.activeProblemStatement ?? '', input.studentMessage ?? ''].join(' ');
  const numbersIn = (v: string) => v.match(/\d+(?:[.,]\d+)*/g) ?? [];
  const known = new Set(numbersIn(given));
  return numbersIn(at).every((n) => known.has(n)) ? at : '';
}

/** The model the pre-check will call (registry role `verdict-precheck`). */
export function verdictPrecheckModel(): string {
  return resolveModel('verdict-precheck').model;
}

/**
 * Run the pre-check. Resolves to null — never rejects — on a timeout, an
 * error, a refusal or a reply that is not the schema.
 */
export async function runVerdictPrecheck(
  input: VerdictPrecheckInput,
  deps: VerdictPrecheckDeps = {},
): Promise<VerdictPrecheckResult | null> {
  const now = deps.now ?? Date.now;
  const startedAt = now();
  const timeoutMs = deps.timeoutMs ?? verdictPrecheckTimeoutFor(input);
  const abort = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    if (!(input.studentMessage ?? '').trim()) return null;
    const llm = deps.llm ?? defaultLlm(deps);
    const ledger = deps.ledger === true && (input.problems ?? []).length > 0;
    const request = {
      system: verdictPrecheckSystem({ ...(deps.claimVerdict === true ? { claimVerdict: true } : {}), ...(ledger ? { ledger: true } : {}) }),
      user: buildVerdictPrecheckUser(ledger ? { ...input, solved: input.solved ?? [] } : { ...input, solved: undefined }),
      maxTokens: 1500,
      timeoutMs,
    };
    const call = llm({ ...request, signal: abort.signal });
    // The abandoned call rejects when aborted; nothing awaits it then.
    call.catch(() => undefined);
    // 2026-10-16 (GAC v12, Praveen: "confirm correct only"): the same check
    // once more, independently and at the same time. It is read only when the
    // first finds the answer CORRECT (a correct finding records the problem
    // solved); otherwise it is aborted. Two findings that disagree → no
    // verdict either way (`disputed`).
    const confirmAbort = new AbortController();
    const confirm = ledger && deps.confirmCorrect !== false ? llm({ ...request, signal: confirmAbort.signal }) : null;
    confirm?.catch(() => undefined);
    const raced = await Promise.race([
      call,
      new Promise<'timeout'>((resolve) => { timer = setTimeout(() => resolve('timeout'), timeoutMs); }),
    ]);
    if (raced === 'timeout') {
      abort.abort();
      confirmAbort.abort();
      console.warn(`[verdict-precheck] timed out after ${timeoutMs} ms — nothing injected`);
      return null;
    }
    const o = parseReply(raced.text);
    // Measurement only (replay scripts): the check's whole reply.
    if (process.env.TUTOR_PRECHECK_DUMP === '1') console.log(`[verdict-precheck] raw ${raced.text}`);
    if (!o || !TARGETS.has(String(o.answers)) || !VERDICTS.has(String(o.verdict)) || !CONFIDENCES.has(String(o.confidence))) {
      console.warn('[verdict-precheck] unusable reply — nothing injected');
      return null;
    }
    // The model's own two findings are held to each other: a proposal it says
    // EQUALS the final answer of the problem being worked is a correct answer
    // to that problem, whatever it then wrote about the open question —
    // unless it classed it as a correct answer to the open question already.
    // 2026-10-15 (GAC v7 audit): not over the check's own finding that the
    // reason given is wrong (ledger).
    const reasonWrong = ledger && o.reason_wrong === true;
    let upgradedToFinal = false;
    if (o.proposed_equals_final_answer === true && String(o.problem_final_answer ?? '').trim() && !reasonWrong
        && !(o.verdict === 'correct' && (o.answers === 'open_question' || o.answers === 'overall_problem'))) {
      o.answers = 'overall_problem';
      o.verdict = 'correct';
      o.correct_value = String(o.problem_final_answer);
      if (o.confidence === 'low') o.confidence = 'medium';
      upgradedToFinal = true;
    }
    // 2026-10-16 (GAC v16, Geometry): "check my answer x = 4" for a problem
    // the student brought up mid-session (not on the list) came back
    // answers=neither / incorrect — so no reveal guard and no no-reveal rule,
    // and the reply said "so x = 20 — not 4". Under the ledger a wrong VALUE
    // with a checked correct value is an answer to the problem being worked.
    if (ledger && o.answers === 'neither' && o.verdict === 'incorrect' && String(o.correct_value ?? '').trim()
        && /\d|=/.test(String(o.proposed_value ?? '')) && !(Array.isArray(o.stated_answers) && o.stated_answers.length)) {
      o.answers = 'open_question';
      console.log('[verdict-precheck] neither → open_question: a wrong value for a problem off the list (the one being worked)');
    }
    let disputed = false;
    let confirmAgreed = false;
    let partlyByConfirm = false;
    if (confirm) {
      if (o.verdict !== 'correct') confirmAbort.abort();
      else {
        const left = Math.max(0, timeoutMs - (now() - startedAt));
        let t2: ReturnType<typeof setTimeout> | undefined;
        const second = await Promise.race([
          confirm.catch(() => null),
          new Promise<null>((resolve) => { t2 = setTimeout(() => resolve(null), left); }),
        ]);
        if (t2) clearTimeout(t2);
        if (!second) {
          confirmAbort.abort();
          console.log('[verdict-precheck] confirming check: no reply in time — the first finding stands');
        } else {
          const o2 = parseReply(second.text);
          const agrees = !!o2 && (o2.verdict === 'correct'
            || (o2.proposed_equals_final_answer === true && String(o2.problem_final_answer ?? '').trim() !== '' && o2.reason_wrong !== true));
          if (agrees) confirmAgreed = true;
          // 2026-10-16 (GAC v17, Geometry): "maybe x = 17" for a problem that
          // also asks for both angles — first check correct, second
          // partly_correct. That is a finding about completeness, not a
          // dispute: the part is right, the problem stays open.
          // 2026-10-16 (GAC v18, Biology): a WORDED answer (no number in it)
          // that the first check found complete and the second only partly
          // complete keeps the first finding — a detail the problem did not
          // ask for is not missing (LEDGER_FORMS_RULE "A WORDED ANSWER").
          const proposedNums = (String(o.proposed_value ?? '').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
          const finalNums = (String(o.problem_final_answer ?? '').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
          const numericPart = proposedNums.length > 0 && finalNums.length > proposedNums.length
            && proposedNums.every((v) => finalNums.some((w) => Math.abs(v - w) < 1e-9));
          const worded = proposedNums.length === 0;
          if (o2 && o2.verdict === 'partly_correct' && !agrees && numericPart) {
            o.verdict = 'partly_correct';
            partlyByConfirm = true;
            console.log('[verdict-precheck] confirming check says partly_correct (a value that is part of the answer) — verdict partly_correct, nothing recorded solved');
          } else if (o2 && o2.verdict === 'partly_correct' && !agrees && worded) {
            confirmAgreed = true;
            console.log('[verdict-precheck] confirming check says partly_correct on a worded answer — the first finding stands');
          } else if (o2 && VERDICTS.has(String(o2.verdict)) && !agrees) {
            disputed = true;
            console.log(`[verdict-precheck] confirming check DISAGREES (${String(o2.verdict)}) — no verdict either way`);
          } else {
            console.log(`[verdict-precheck] confirming check ${agrees ? 'agrees' : 'unusable — the first finding stands'}`);
          }
        }
      }
    }
    const correctValue = String(o.correct_value ?? '').trim().slice(0, 240);
    // Rendered only for a wrong answer to the whole problem (verdict-precheck-shared.ts).
    const wantsDiffersAt = (deps.differsAt ?? TUTOR_PRECHECK_DIFFERS_AT) && o.answers === 'overall_problem' && o.verdict === 'incorrect';
    const differsAt = wantsDiffersAt
      ? safeDiffersAt(o.differs_at, correctValue, input)
      : '';
    if (wantsDiffersAt && !differsAt && String(o.differs_at ?? '').trim()) {
      console.log(`[verdict-precheck] differs_at not used (it carried a value): "${String(o.differs_at).replace(/\s+/g, ' ').slice(0, 120)}"`);
    }
    // 2026-10-19 (ledger): the problem LABELS the check named → list positions.
    // `solved_problem` (one number) is still read for a reply in the old shape
    // (a test double or a replay of a stored reply; the schema no longer asks for it).
    const problems = input.problems ?? [];
    const positionOf = (v: unknown): number => {
      const n = Number(v);
      return ledger && Number.isInteger(n) && n > 0 ? problems.findIndex((p) => p.n === n) + 1 : 0;
    };
    let labels: unknown[] = Array.isArray(o.solved_problems) ? o.solved_problems.slice(0, 25) : [o.solved_problem];
    // 2026-10-16 (GAC v16, AP Calc BC): "maybe 1/4" came back neither /
    // incorrect yet equal to the problem's final answer; the upgrade above made
    // it correct at medium with no problem named — the reply credited it, the
    // ledger kept it OPEN, and the wrap-up said "problem 2 is still open".
    // Upgraded this way and confirmed by the second check: the problem the
    // message is about is solved, at high confidence.
    const confirmedUpgrade = ledger && upgradedToFinal && !disputed && confirmAgreed && !reasonWrong
      && !labels.some((l) => positionOf(l) > 0) && positionOf(o.about_problem) > 0;
    if (confirmedUpgrade) {
      labels = [o.about_problem];
      o.confidence = 'high';
      console.log('[verdict-precheck] equals-final upgrade confirmed by the second check — recorded the problem it is about');
    }
    // 2026-10-15 (GAC staging v6): the check's own per-answer findings are
    // held over its summary. A problem whose answer in THIS message it judged
    // wrong is never recorded solved, and a message with any wrong answer is
    // not "correct" as a whole.
    const stated = ledger && Array.isArray(o.stated_answers) ? o.stated_answers.slice(0, 25) as Array<Record<string, unknown>> : [];
    // A rounded decimal of the exact answer is not wrong: right value, not yet in the exact form.
    const rounded = (a: Record<string, unknown>) => roundsExactAnswer(String(a.stated ?? ''), String(a.own_answer ?? ''));
    // 2026-10-16 (GAC v16, AP Statistics): "15.5" for a problem whose answer
    // is "median 15.5, IQR 15" came back right:false (not the WHOLE answer)
    // and the reply said "not 15.5". A value that IS one of the check's own
    // answer values is part of the answer, never wrong.
    const partOfOwn = (a: Record<string, unknown>) => {
      const st = (String(a.stated ?? '').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      const own = (String(a.own_answer ?? '').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      return st.length > 0 && own.length > st.length && st.every((v) => own.some((w) => Math.abs(v - w) < 1e-9));
    };
    const roundedHere = new Set(stated.filter((a) => a && a.right === false && rounded(a)).map((a) => positionOf(a.problem)).filter((pos) => pos > 0));
    const wrongHere = new Set(stated.filter((a) => a && a.right === false && !rounded(a) && !partOfOwn(a)).map((a) => positionOf(a.problem)).filter((pos) => pos > 0));
    if (ledger && o.verdict === 'incorrect' && (roundedHere.size || roundsExactAnswer(String(o.proposed_value ?? ''), String(o.correct_value || o.problem_final_answer || '')))
        && !wrongHere.size) {
      o.verdict = 'partly_correct';
      console.log('[verdict-precheck] verdict incorrect → partly_correct: a rounded decimal of the exact answer');
    }
    const rightHere = stated.some((a) => a && a.right === true);
    if (wrongHere.size && o.verdict === 'correct') {
      o.verdict = rightHere ? 'partly_correct' : 'incorrect';
      console.log(`[verdict-precheck] verdict correct → ${o.verdict}: a stated answer was judged wrong (problem position ${[...wrongHere].join(',')})`);
    }
    const aboutProblem = positionOf(o.about_problem);
    // A right answer given for a wrong reason is not yet solved: the problem
    // it is about (or every one it states, when it is about several) stays open.
    const reasonOpen = new Set<number>();
    if (reasonWrong) {
      if (aboutProblem) reasonOpen.add(aboutProblem);
      else for (const a of stated) { const pos = positionOf(a?.problem); if (pos > 0) reasonOpen.add(pos); }
      if (o.verdict === 'correct') o.verdict = 'partly_correct';
      console.log(`[verdict-precheck] reason judged wrong — not recorded solved (problem position ${[...reasonOpen].join(',') || 'none'})`);
    }
    // 2026-10-15 (GAC v8, Algebra II): the second half of a split answer came
    // back CORRECT with every stated answer right and the final-answer test
    // agreeing — at medium confidence, so the ledger (high only) never
    // recorded the problem and the tutor kept asking for it. When the check's
    // own three findings agree, that is a high-confidence correct.
    if (ledger && o.verdict === 'correct' && o.confidence === 'medium' && o.proposed_equals_final_answer === true
        && stated.length > 0 && stated.every((a) => a && a.right === true) && !reasonWrong) {
      o.confidence = 'high';
      console.log('[verdict-precheck] confidence medium → high: correct, every stated answer right, final-answer test agrees');
    }
    // The value given is the exact answer rounded: whatever the verdict
    // word, the reply must not call it a wrong value.
    const roundedDecimal = ledger && o.verdict !== 'correct' && !wrongHere.size
      && (roundedHere.size > 0 || stated.some((a) => a && rounded(a))
        || roundsExactAnswer(String(o.proposed_value ?? ''), String(o.correct_value || o.problem_final_answer || '')));
    if (roundedDecimal) console.log('[verdict-precheck] rounded decimal of the exact answer — reply must not call it wrong');
    const solvedProblems = disputed || partlyByConfirm ? [] : [...new Set(labels.map(positionOf).filter((pos) => pos > 0 && !wrongHere.has(pos) && !roundedHere.has(pos) && !reasonOpen.has(pos)))].sort((a, b) => a - b);
    const wrongStep = ledger && o.verdict !== 'correct' && !disputed ? safeDiffersAt(o.wrong_step, correctValue, input) : '';
    // 2026-10-20 (GAC Geometry upload portal-0886d151, problem "find x and
    // m∠1"): "6x+60=180 so x=20" came back partly_correct — x right, m∠1 not
    // given yet — and the block's "something is missing or wrong" let the
    // reply say x "doesn't follow". When every value the student stated is
    // part of the check's own answer and nothing of theirs was found wrong,
    // the only thing wrong is what is missing: the reply confirms the part
    // and asks for the rest.
    const missingOnly = ledger && o.verdict === 'partly_correct' && !disputed && !reasonWrong && !wrongStep && !wrongHere.size && !roundedDecimal
      && o.confidence !== 'low' && stated.length > 0
      && stated.every((a) => a && (a.right === true || partOfOwn(a)));
    if (missingOnly) console.log('[verdict-precheck] partly_correct with nothing wrong — a right part, the rest not yet given');
    return {
      ...(solvedProblems.length ? { solvedProblem: solvedProblems[0], solvedProblems } : {}),
      ...(aboutProblem ? { aboutProblem } : {}),
      ...(wrongHere.size ? { wrongProblems: [...wrongHere].sort((a, b) => a - b) } : {}),
      ...(roundedDecimal ? { roundedDecimal: true as const } : {}),
      // 2026-10-16 (GAC v16, Algebra I): "7y = -4" — the reply pointed at the
      // distribution, which was right. The check names the first wrong
      // operation of THEIR working, with no value in it (safeDiffersAt).
      ...(wrongStep ? { wrongStep } : {}),
      ...(missingOnly ? { missingOnly: true as const } : {}),
      answers: o.answers as PrecheckTarget,
      target: String(o.target ?? '').trim().slice(0, 200),
      proposed: String(o.proposed_value ?? '').trim().slice(0, 240),
      verdict: (disputed ? 'cannot_determine' : o.verdict) as PrecheckVerdict,
      confidence: (disputed ? 'medium' : o.confidence) as PrecheckConfidence,
      ...(disputed ? { disputed: true as const } : {}),
      correctValue,
      ...(differsAt ? { differsAt, differsTest: String(o.differs_test ?? '').replace(/\s+/g, ' ').trim().slice(0, 240) } : {}),
      model: raced.model,
      ms: now() - startedAt,
      inputTokens: raced.inputTokens,
      outputTokens: raced.outputTokens,
    };
  } catch (err) {
    console.warn(`[verdict-precheck] failed (${(err instanceof Error ? err.message : String(err)).slice(0, 120)}) — nothing injected`);
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
