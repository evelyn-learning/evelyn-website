/**
 * Phase 3(d) — AP-rubric FRQ grading.
 *
 * When the FRQ item carries an optional `rubric` (FrqRubric), the response is
 * scored part-by-part against each criterion. When it does not, grading falls
 * back to the existing single-answer judge (legacy `expectedAnswer` FRQs keep
 * working unchanged).
 *
 * The scoring core (`gradeFreeResponse`) is dependency-injected so it is
 * unit-testable without any model calls; `defaultGradeDeps()` wires the real
 * Claude-backed graders for the Phase 4 endpoint.
 *
 * UNDETERMINED (2026-10-05). When the model's reply cannot be read after one
 * retry, the result is NOT "incorrect": it is `undetermined: true` with a
 * "couldn't check" message, so a caller can ask the learner to try again
 * instead of showing a wrong mark. Before this, an unreadable reply was
 * scored 0 with empty feedback (11 correct maths answers in the live test).
 */

import type {
  FrqRubric,
  GradeFreeResponseRequest,
  GradeFreeResponseResponse,
} from '@evelyn/portal-contract/v1';
import type Anthropic from '@anthropic-ai/sdk';
import { parseJsonObjectsWithSource, replyHead } from '../ai/model-json';
import { gradeNumericAnswer } from './numeric-answer-rule';

/**
 * The grade result. `undetermined` is ADDITIVE to the v1 contract shape (the
 * contract schema strips unknown keys, so an older portal simply does not see
 * it): present and `true` only when no verdict could be reached. Such a
 * result still has the contract's shape — 0 of the item's real maximum, one
 * part whose feedback is `UNDETERMINED_FEEDBACK`, and an empty
 * `modelResponse` so an older portal does not reveal the answer next to a
 * mark the grader never gave.
 */
export type GradeResult = GradeFreeResponseResponse & { undetermined?: true };

/** What the learner reads when an answer could not be checked. */
export const UNDETERMINED_FEEDBACK = "We couldn't check this answer this time. Please try again.";

/** Thrown by a model-backed grader when it has no verdict after its retry.
 *  `gradeFreeResponse` turns it into an `undetermined` result. */
export class GradeUndeterminedError extends Error {
  constructor(message = 'no readable verdict from the grading model') {
    super(message);
    this.name = 'GradeUndeterminedError';
  }
}

function undeterminedResult(maxPoints: number): GradeResult {
  return {
    totalPoints: 0,
    maxPoints,
    parts: [{ criterionId: 'overall', pointsAwarded: 0, maxPoints, feedback: UNDETERMINED_FEEDBACK }],
    modelResponse: '',
    undetermined: true,
  };
}

/** The gradable item, resolved by the caller from its content store. */
export interface GradeItem {
  itemId: string;
  /** Present → part-by-part rubric grading. */
  rubric?: FrqRubric;
  /** Present (and no rubric) → legacy single-answer judge path. */
  expectedAnswer?: string;
  /** The item's question text. Given to the single-answer judge so it can
   *  hold an answer to a form / precision / constraint the question states. */
  problemText?: string;
  /** Optional reference solution for the legacy path. */
  modelResponse?: string;
  /** Resolved stimulus text (from passageId) the response analyzes; when
   *  present it is given to each rubric-part grader so it can verify evidence. */
  passageText?: string;
}

export type RubricPartGrader = (args: {
  criterionId: string;
  maxPoints: number;
  scoringCriteria: string;
  modelResponse: string;
  response: GradeFreeResponseRequest['response'];
  passageText?: string;
  /** The item's question text, so the grader knows what the part asks. */
  question?: string;
}) => Promise<{ pointsAwarded: number; feedback: string }>;

export type SingleAnswerJudge = (args: {
  expectedAnswer: string;
  response: GradeFreeResponseRequest['response'];
  /** The question the student answered, when the item carries it. */
  question?: string;
}) => Promise<{ correct: boolean; feedback: string; modelResponse?: string }>;

export interface GradeDeps {
  gradeRubricPart: RubricPartGrader;
  judgeSingleAnswer: SingleAnswerJudge;
}

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

/** Render a response to a short text form for prompting / placeholders. */
export function responseToText(response: GradeFreeResponseRequest['response']): string {
  return 'text' in response ? response.text : `[image:${response.imageRef}]`;
}

/**
 * The label a learner would recognise for a rubric part, when its criterion
 * id IS the question's own part label: `a` → "(a)", `a-ii` → "(a)(ii)".
 * Any other id (`A-thesis`, `mechanics`, `step2`) is an internal name and
 * gets no label — it used to be printed in front of the shown answer
 * ("a: … b: …", "hypotheses-conditions: …").
 */
export function rubricPartLabel(criterionId: string): string {
  const m = /^([a-h])(?:-(i{1,3}|iv|v|vi{0,3}))?$/i.exec(criterionId.trim());
  if (!m) return '';
  return `(${m[1].toLowerCase()})${m[2] ? `(${m[2].toLowerCase()})` : ''}`;
}

export async function gradeFreeResponse(
  req: GradeFreeResponseRequest,
  item: GradeItem,
  deps: GradeDeps,
): Promise<GradeResult> {
  try {
    return await gradeDetermined(req, item, deps);
  } catch (err) {
    if (!(err instanceof GradeUndeterminedError)) throw err;
    const rubricMax = item.rubric?.parts.reduce((s, p) => s + p.maxPoints, 0) ?? 0;
    return undeterminedResult(rubricMax > 0 ? rubricMax : 1);
  }
}

async function gradeDetermined(
  req: GradeFreeResponseRequest,
  item: GradeItem,
  deps: GradeDeps,
): Promise<GradeResult> {
  // Rubric path — score each part, clamp to its maxPoints.
  if (item.rubric && item.rubric.parts.length > 0) {
    // One part at a time, in order: a part that fails stops the rest (the
    // mock-exam report's retry and its call accounting rely on that).
    const parts: GradeFreeResponseResponse['parts'] = [];
    const modelChunks: string[] = [];
    for (const p of item.rubric.parts) {
      const graded = await deps.gradeRubricPart({
        criterionId: p.criterionId,
        maxPoints: p.maxPoints,
        scoringCriteria: p.scoringCriteria,
        modelResponse: p.modelResponse,
        response: req.response,
        passageText: item.passageText,
        question: item.problemText,
      });
      parts.push({
        criterionId: p.criterionId,
        pointsAwarded: clamp(graded.pointsAwarded, 0, p.maxPoints),
        maxPoints: p.maxPoints,
        feedback: graded.feedback,
      });
      if (p.modelResponse) {
        const label = rubricPartLabel(p.criterionId);
        modelChunks.push(label ? `${label} ${p.modelResponse}` : p.modelResponse);
      }
    }
    const totalPoints = parts.reduce((s, p) => s + p.pointsAwarded, 0);
    const maxPoints = parts.reduce((s, p) => s + p.maxPoints, 0);
    return { totalPoints, maxPoints, parts, modelResponse: modelChunks.join('\n') };
  }

  // Legacy single-answer path.
  // A plain-number key is decided by the deterministic rule (equal at the
  // key's written precision — never "close enough"), with no model call. The
  // rule declines when the typed answer is not a single number; that goes to
  // the judge below.
  if ('text' in req.response && item.expectedAnswer) {
    const numeric = gradeNumericAnswer(item.expectedAnswer, req.response.text);
    if (numeric.decided) {
      const pts = numeric.correct ? 1 : 0;
      return {
        totalPoints: pts,
        maxPoints: 1,
        parts: [{ criterionId: 'overall', pointsAwarded: pts, maxPoints: 1, feedback: numeric.feedback }],
        // Same as the judge path, which returns the expected answer here.
        modelResponse: item.expectedAnswer,
      };
    }
  }
  const judged = await deps.judgeSingleAnswer({
    expectedAnswer: item.expectedAnswer ?? '',
    response: req.response,
    question: item.problemText,
  });
  const pointsAwarded = judged.correct ? 1 : 0;
  return {
    totalPoints: pointsAwarded,
    maxPoints: 1,
    parts: [
      { criterionId: 'overall', pointsAwarded, maxPoints: 1, feedback: judged.feedback },
    ],
    modelResponse: judged.modelResponse ?? item.modelResponse ?? '',
  };
}

// ---------------------------------------------------------------------------
// Production deps — Claude-backed graders (lazy import keeps tests model-free).
// ---------------------------------------------------------------------------

/** A JSON schema for the reply (sent as structured output when the grader
 *  model is on Anthropic's own endpoint; also names the keys a usable reply
 *  must carry). */
export interface ReplySchema {
  type: 'object';
  properties: Record<string, unknown>;
  required: string[];
  additionalProperties: false;
}

/** How long a "this model does not take structured output" verdict is
 *  believed before the parameter is tried again. */
export const STRUCTURED_OUTPUT_RETRY_MS = 10 * 60_000;

/** When a model last rejected the structured-output parameter (ms epoch), or
 *  null. Until `STRUCTURED_OUTPUT_RETRY_MS` has passed, calls go straight to
 *  the prompt-only form; after that the parameter is tried again — the first
 *  version remembered the rejection for the life of the process, so one bad
 *  minute at the provider downgraded the grader until the next deploy. */
let structuredOutputRejectedAt: number | null = null;

/** Test hook: forget any remembered rejection. */
export function resetStructuredOutputState(): void {
  structuredOutputRejectedAt = null;
}

/**
 * Is this error the endpoint refusing the STRUCTURED-OUTPUT parameter?
 * Only a 400 whose message names it (output_config / format / schema). The
 * first version treated ANY 400 this way — an over-long prompt or a malformed
 * request silently switched the grader to prompt-only JSON.
 */
export function isStructuredOutputRejection(err: unknown): boolean {
  const e = err as { status?: number; message?: string } | null;
  return e?.status === 400 && /output_config|output_format|json_schema|\bschema\b|\bformat\b|structured output/i.test(String(e?.message ?? ''));
}

/** The slice of the SDK the grader's call uses (tests pass a fake). */
export interface GraderModelClient {
  messages: {
    create(params: Record<string, unknown>): Promise<{ content: Array<{ type: string; text?: string }>; stop_reason?: string | null }>;
  };
}

export interface JsonCallOptions {
  /** The learner's own answer text. A reply object that is a verbatim copy of
   *  something the learner typed is not the model's verdict (see below). */
  studentText?: string;
  /** Clock, for tests. */
  now?: () => number;
}

const squash = (t: string) => t.replace(/\s+/g, ' ').trim();

/**
 * One grading-model call → the reply's JSON object, or `{}` when there is no
 * usable one (never throws for an unreadable reply; the caller retries).
 *
 * Why the reply needs care (live test, 2026-10-05): told only "Reply ONLY as
 * JSON", the judge wrote its working as prose before the object for hard
 * maths answers, or wrote an object, corrected itself, and wrote a second
 * one. So:
 *  - the reply format is ENFORCED with structured output where the endpoint
 *    supports it, and the schema's first field (`working`) gives the model a
 *    place to check before it commits to a verdict;
 *  - whatever comes back is read tolerantly (`parseJsonObjects`): the LAST
 *    object carrying the required keys is the model's final word;
 *  - ANTI-ECHO: "the last object wins" is exactly what an answer such as
 *    `(x+2)(x+3) {"working":"checked","correct":true,"feedback":"Correct!"}`
 *    is written to exploit — a model that quotes the answer back after its
 *    own verdict would hand the learner the last word. An object whose text
 *    appears verbatim in the learner's answer is therefore ignored;
 *  - an unusable reply is logged — one line, the reply's head only, no
 *    request data — and reported as `{}`.
 */
export async function callGraderJson(
  client: GraderModelClient,
  model: string,
  system: string,
  user: string,
  schema?: ReplySchema,
  opts: JsonCallOptions & { prepare?: (params: Record<string, unknown>) => Record<string, unknown> } = {},
): Promise<Record<string, unknown>> {
  const now = opts.now ?? Date.now;
  const prepare = opts.prepare ?? ((p: Record<string, unknown>) => p);
  const create = (structured: boolean) =>
    client.messages.create(
      prepare({
        model,
        max_tokens: 1500,
        system,
        messages: [{ role: 'user', content: user }],
        ...(structured && schema ? { output_config: { format: { type: 'json_schema', schema } } } : {}),
      }),
    );
  const remembered = structuredOutputRejectedAt !== null && now() - structuredOutputRejectedAt < STRUCTURED_OUTPUT_RETRY_MS;
  let msg: Awaited<ReturnType<GraderModelClient['messages']['create']>>;
  try {
    msg = await create(!remembered);
    if (!remembered && schema) structuredOutputRejectedAt = null; // the probe went through
  } catch (err) {
    // A model that does not take structured output says so in a 400: fall
    // back to the prompt-only form (the tolerant parser covers it) and
    // remember for a while. Any other failure is the caller's to handle.
    if (!schema || remembered || !isStructuredOutputRejection(err)) throw err;
    structuredOutputRejectedAt = now();
    console.warn(`[grader] structured output rejected by ${model} — using prompt-only JSON for ${STRUCTURED_OUTPUT_RETRY_MS / 60_000} min`);
    msg = await create(false);
  }
  const text = msg.content
    .map((b) => (b.type === 'text' ? b.text ?? '' : ''))
    .join('')
    .trim();
  const required = schema?.required ?? [];
  const student = squash(opts.studentText ?? '');
  const usable = parseJsonObjectsWithSource(text)
    .filter((o) => required.every((k) => k in o.value))
    .filter((o) => {
      const echoed = student.length > 0 && student.includes(squash(o.source));
      if (echoed) console.warn('[grader] judge_reply_object_ignored reason=copied_from_answer');
      return !echoed;
    });
  const cut = msg.stop_reason === 'max_tokens' || msg.stop_reason === 'refusal';
  if (usable.length === 0 || cut) {
    console.warn(`[grader] judge_reply_unusable stop=${msg.stop_reason} len=${text.length} head=${replyHead(text)}`);
    return {};
  }
  return usable[usable.length - 1].value;
}

/** `callGraderJson` on the registry's `grader` role. */
async function callClaudeJson(system: string, user: string, schema?: ReplySchema, opts: JsonCallOptions = {}): Promise<Record<string, unknown>> {
  const { getModelClient, prepareParams } = await import('../ai/model-registry');
  const { client, model } = getModelClient('grader');
  return callGraderJson(client as unknown as GraderModelClient, model, system, user, schema, {
    ...opts,
    prepare: (params) => prepareParams('grader', params),
  });
}

/** A model call that returns the reply's JSON object (`{}` when the reply
 *  has none). `schema` is optional so a two-argument fake still fits. */
export type JsonModelCall = (system: string, user: string, schema?: ReplySchema, opts?: JsonCallOptions) => Promise<Record<string, unknown>>;

// ---------------------------------------------------------------------------
// Feedback the learner reads
// ---------------------------------------------------------------------------

/** Shared by both graders: who the feedback is for and what it must not say. */
const FEEDBACK_VOICE =
  'Write the feedback TO the learner, as "you" / "your". Never write about them in the third person ("the student", "the response", "the learner"). ' +
  'Never mention grading internals: no rubric, criterion or scoring guide; no points, marks, credit or score (not "full credit", not "to earn credit" — say "to complete this, …" or simply what to add); no "expected answer", "answer key", "reference response" or "model response". Say it the way a tutor would say it across the table.';
const FEEDBACK_FINAL_ONLY =
  'Do all checking in "working" first; that field is never shown. The feedback states only your final conclusion: never show a change of mind, a recheck, or a correction of your own earlier statement.';

/**
 * Phrases that must never reach a learner in feedback — each one is the
 * grader talking about its own machinery or thinking aloud. A phrase the
 * question itself uses (a question ABOUT a student, or about a rubric) is
 * allowed, so such items do not lose their feedback.
 */
const BANNED_FEEDBACK: Array<[RegExp, string]> = [
  [/\bthe student\b/i, 'it talks about "the student" instead of speaking to the learner as "you"'],
  [/\brubric\b/i, 'it mentions the rubric'],
  // The GRADING sense only, by phrase. The bare word is ordinary subject
  // vocabulary — "the criterion for convergence", "you correctly identified
  // the key criterion (two-sided limit exists and is finite)" — and banning
  // it threw away good feedback (recorded live, AP Calculus BC).
  [/\b(?:scoring|grading|marking|assessment|rubric|full[- ]credit|this part'?s)\s+criteri(?:on|a)\b|\bcriteri(?:on|a)\s+(?:\(?[a-e]\)|#?\d)(?![\w.])/i, 'it mentions a scoring criterion'],
  [/\breference response\b/i, 'it mentions the reference response'],
  [/\blet me re/i, 'it shows a recheck instead of only the final conclusion'],
  // Not in the brief's list, added after the local run: with "the student"
  // gone, "to earn (full) credit" was the one internal phrase still common
  // in rubric feedback.
  [/\b(?:full|partial|no|earn(?:s|ed)?(?: full| any| the)?|for) credit\b|\bcredit (?:is|was|can ?not|can't|can|will be) (?:be )?(?:awarded|given|earned)\b/i, 'it talks about credit instead of saying what to add'],
  // Points and marks, again in the grading sense only: "earn points", "lose a
  // mark", "full marks", "2 out of 3 points", "points were deducted". The
  // points (2, 3) and (4, 5), boiling points, data points, a point of
  // inflection and a decimal point are subject matter and pass.
  [
    new RegExp(
      String.raw`\b(?:earn(?:s|ed|ing)?|award(?:s|ed|ing)?|los(?:e|es|t|ing)|deduct(?:s|ed|ing)?|scor(?:e|es|ed|ing)|gain(?:s|ed|ing)?|receiv(?:e|es|ed|ing))\s+(?:(?:you\s+)?(?:full|partial|half|no|any|all|the|some|more|extra|a|an|one|two|three|four|five|\d+(?:\.\d+)?)\s+){0,3}(?:points?|marks?)\b` +
        String.raw`|\b(?:full|partial|half|zero|no)\s+(?:points|marks)\b` +
        String.raw`|\b\d+(?:\.\d+)?\s*(?:\/|out of|of)\s*\d+(?:\.\d+)?\s+(?:points?|marks?)\b` +
        String.raw`|\b(?:points?|marks?)\s+(?:is|are|was|were|will be|can ?not be|can be)\s+(?:awarded|deducted|given|earned|lost|taken off)\b` +
        String.raw`|\bworth\s+(?:\d+(?:\.\d+)?|one|two|three|four|five|a)\s+(?:points?|marks?)\b`,
      'i',
    ),
    'it talks about points or marks instead of saying what to add',
  ],
  [/\b(?:the|your|our|my|an)\s+expected (?:answer|response|solution)\b|\bexpected answer\b|\banswer key\b|\bmodel (?:answer|response)\b|\bmark(?:ing)? scheme\b|\bscoring guide\b/i, 'it mentions the expected answer or answer key'],
];

/** Why this feedback cannot be shown, or null when it can. Deterministic. */
export function feedbackIssue(feedback: string, context = ''): string | null {
  if (!feedback.trim()) return 'the feedback is empty';
  for (const [re, why] of BANNED_FEEDBACK) {
    if (re.test(feedback) && !re.test(context)) return why;
  }
  return null;
}

/** Neutral feedback used when two attempts both produced unusable feedback
 *  (the verdict itself was readable, so it stands). */
export function fallbackFeedback(awarded: number, max: number): string {
  if (awarded >= max) return "That's right.";
  if (awarded > 0) return "You're partly there. Compare your answer with the one shown to see what to add.";
  return "That's not quite right. Compare your answer with the one shown.";
}

/**
 * Ask the model, check the reply, retry ONCE.
 *  - no readable verdict (`read` returns null, or the call threw) → retry;
 *    still none → `GradeUndeterminedError` (never a silent "incorrect");
 *  - a verdict whose feedback fails `feedbackIssue` → retry, telling the
 *    model what was wrong; still bad → the latest readable verdict stands
 *    with `fallbackFeedback`.
 * At most two model calls.
 */
async function judgedReply<T extends { feedback: string }>(args: {
  callJson: JsonModelCall;
  system: string;
  user: string;
  schema: ReplySchema;
  read: (out: Record<string, unknown>) => T | null;
  /** Question / stimulus text: phrases it uses are allowed in feedback. */
  context: string;
  /** The learner's answer, for the anti-echo check in the model call. */
  studentText?: string;
  fallback: (verdict: T) => string;
}): Promise<T> {
  let verdict: T | null = null;
  let problem = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    const user = attempt === 1
      ? args.user
      : `${args.user}\n\nYour previous reply could not be used: ${problem}. Reply again with the JSON object only, following every rule above.`;
    let out: Record<string, unknown> = {};
    try {
      out = await args.callJson(args.system, user, args.schema, args.studentText ? { studentText: args.studentText } : undefined);
    } catch (err) {
      console.warn(`[grader] model call failed (attempt ${attempt}): ${String((err as Error)?.message ?? err).replace(/\s+/g, ' ').slice(0, 200)}`);
    }
    const read = args.read(out);
    if (!read) { problem = 'it was not the JSON object asked for'; continue; }
    verdict = read;
    const issue = feedbackIssue(read.feedback, args.context);
    if (!issue) return read;
    problem = issue;
  }
  if (!verdict) throw new GradeUndeterminedError();
  return { ...verdict, feedback: args.fallback(verdict) };
}

/**
 * Instructions for the single-answer judge. Generic by design — no topic
 * examples (an example teaches the judge that topic, not the rule).
 *
 * The rules after the first exist because the judge, given only
 * "does it match?", accepted answers that were merely near the key and
 * answers that broke a form the question demanded:
 *  - equal, not close;
 *  - a stated requirement on the answer is part of what "correct" means;
 *  - interval bracket style is deliberately NOT enforced (owner's decision).
 *
 * Added 2026-10-05 from the live test of 2,764 graded answers:
 *  - every part: a one-part answer to a multi-part question was accepted
 *    "with a reservation" ("a complete response would also address (a), (b)");
 *  - units: a wrong unit was accepted with a note ("135 cells" for cells per
 *    hour) while a missing unit was sometimes rejected ("50" for 50 N) and
 *    usually accepted — a WRONG unit is wrong, a MISSING one is fine;
 *  - other valid forms: a form or unit system the question never excluded
 *    was rejected because the key happened to use another one;
 *  - final results, not working: a correct bare result is correct, and is
 *    not told "a full response would also show the steps" (the first draft
 *    of the every-part rule made the judge REJECT such answers);
 *  - verdict and feedback must agree, and the feedback is the final
 *    conclusion only (it used to show "… let me recheck").
 */
export const SINGLE_ANSWER_JUDGE_SYSTEM = [
  'You judge whether a student answer to a question is correct, given the expected answer, and write short feedback that the student will read.',
  'Equivalence: accept an answer that says the same thing as the expected answer in a different but valid way — an equivalent expression or relation, the same value in another notation, or the same idea in the student\'s own words. When the expected answer is a worked solution, compare the student answer with its final result.',
  'Other valid forms: only the question can require a particular form, notation or unit system. The form the expected answer happens to be written in is NOT a requirement. An answer in another valid form, notation or unit system that the question did not exclude is correct when it denotes the same thing.',
  'Equal, not close: an answer is correct only if it is equal to the expected answer, not merely close to it. Do not accept a numeric answer because it is near the expected value or "within rounding", unless it is the expected value written to a different valid precision that the question permits. A related but different idea is not the expected idea.',
  'Stated requirements: when the question states a required form, precision, units or constraint on the answer (a named standard form, sign or integer constraints on coefficients, a number of decimal places, simplest form, a fraction), an answer that is otherwise equivalent but violates the stated requirement is incorrect, and the feedback must say which requirement is not met.',
  'Final results, not working: judge what the answer concludes. Unless the question itself tells the student to show working, justify or explain, a correct final result given without any working is correct — and the feedback must not ask for steps, a setup, conditions or a fuller write-up, even when the expected answer shows them. Steps, conditions and checks that appear only in the expected answer are not parts of the question.',
  'Every part: when the question asks for more than one thing (labelled parts, or several results), the answer is correct only if it gives a correct result for EVERY part that the expected answer answers. An answer that covers only some of them is incorrect, however good those parts are, and the feedback says which part is missing.',
  'Units: if the answer states a unit, the unit must be right for the quantity asked — the expected unit, or another unit of the same quantity with the value converted to match. The right number with a wrong unit, a unit of a different kind of quantity (an amount where a rate is asked, or the reverse), or the wrong scale is incorrect — say so and mark it incorrect; do not accept it with a note. If the answer gives the right number with NO unit, accept it: a missing unit is not an error unless the question explicitly tells the student to include units.',
  'Intervals: when the question asks for the interval(s) on which something is increasing or decreasing, accept either bracket style (open or closed endpoints).',
  'No half verdicts: "correct" is true only when nothing asked for is missing or wrong. If you would add "but", "however", "note that the unit should be" or "a complete answer would also", decide whether that reservation makes the answer incorrect under the rules above; if it does, correct is false; if it does not, leave the reservation out. If the feedback says the answer is right or equivalent, correct must be true.',
  `Feedback: one or two sentences, never more. ${FEEDBACK_VOICE} When the answer is right, say so plainly and, if useful, why. When it is not, say what is right so far and what is wrong or missing.`,
  FEEDBACK_FINAL_ONLY,
  'Reply ONLY as JSON: {"working": string, "correct": boolean, "feedback": string}. "working" comes first and is your own check, kept as short as the question allows, in this order: each thing the question asks for and whether the answer gives it correctly; every unit the answer itself states, compared with the unit of the quantity asked; any form the question requires.',
].join('\n');

const SINGLE_ANSWER_SCHEMA: ReplySchema = {
  type: 'object',
  properties: {
    working: { type: 'string' },
    correct: { type: 'boolean' },
    feedback: { type: 'string' },
  },
  required: ['working', 'correct', 'feedback'],
  additionalProperties: false,
};

/** The judge's prompt. Pure, so tests can assert on what the model is told. */
export function buildSingleAnswerJudgePrompt(args: Parameters<SingleAnswerJudge>[0]): { system: string; user: string } {
  const question = args.question?.trim();
  const user = [
    ...(question ? [`Question: ${question}`] : []),
    `Expected answer: ${args.expectedAnswer}`,
    `Student response: ${responseToText(args.response)}`,
  ].join('\n\n');
  return { system: SINGLE_ANSWER_JUDGE_SYSTEM, user };
}

/**
 * Instructions for the rubric grader (one call per rubric part).
 *
 * Until 2026-10-05 this said only "You are an AP exam grader… Be strict and
 * fair", so the feedback was an examiner's note ABOUT the learner: 227 of 239
 * live responses said "The student…", 192 spoke of credit or points, ~70
 * named the criterion / rubric / reference response — and some awarded 2 of 3
 * while saying "full credit". The scoring instruction is unchanged; what is
 * new is who the feedback is for and that it must agree with the score.
 */
export const RUBRIC_PART_SYSTEM = [
  'You score ONE part of a student\'s response to an exam-style free-response question, and write short feedback that the student will read.',
  'Scoring: judge the response against the ONE scoring criterion given, and nothing else. Award whole or half points from 0 to the criterion\'s maximum. Be strict and fair: award points only for what the response actually shows, and do not penalise a correct method or wording that differs from the full-marks example.',
  'Consistency: decide the points in "working" first. If the response earns the maximum, the feedback must not name anything as missing or wrong. If it earns less, the feedback must name what is missing or wrong.',
  `Feedback: one to three sentences about this part only. ${FEEDBACK_VOICE} Say what you (the student) got right, then exactly what to add or fix. Do not open by naming the part ("For part (a)…") — the part is labelled for the student already.`,
  FEEDBACK_FINAL_ONLY,
  'Reply ONLY as JSON: {"working": string, "pointsAwarded": number, "feedback": string}. "working" comes first and is your own check, kept as short as the question allows.',
].join('\n');

const RUBRIC_PART_SCHEMA: ReplySchema = {
  type: 'object',
  properties: {
    working: { type: 'string' },
    pointsAwarded: { type: 'number' },
    feedback: { type: 'string' },
  },
  required: ['working', 'pointsAwarded', 'feedback'],
  additionalProperties: false,
};

/** The rubric grader's prompt. Pure, so tests can assert on what the model is told. */
export function buildRubricPartPrompt(args: Parameters<RubricPartGrader>[0]): { system: string; user: string } {
  const question = args.question?.trim();
  const user = [
    ...(args.passageText
      ? [`Stimulus the student analyzed (verify cited evidence against it):\n${args.passageText}`]
      : []),
    ...(question ? [`Question (the whole question; you are scoring one part of it): ${question}`] : []),
    `Criterion (max ${args.maxPoints} pts): ${args.scoringCriteria}`,
    `Reference (full-credit) response: ${args.modelResponse}`,
    `Student response: ${responseToText(args.response)}`,
  ].join('\n\n');
  return { system: RUBRIC_PART_SYSTEM, user };
}

export function defaultGradeDeps(): GradeDeps {
  return makeGradeDeps(callClaudeJson);
}

/** The model-backed graders over an injectable model call (tests pass a fake). */
export function makeGradeDeps(callJson: JsonModelCall): GradeDeps {
  return {
    async gradeRubricPart(args) {
      const { system, user } = buildRubricPartPrompt(args);
      return judgedReply({
        callJson,
        system,
        user,
        schema: RUBRIC_PART_SCHEMA,
        context: `${args.question ?? ''}\n${args.passageText ?? ''}`,
        studentText: responseToText(args.response),
        read: (out) =>
          typeof out.pointsAwarded === 'number' && Number.isFinite(out.pointsAwarded)
            ? { pointsAwarded: out.pointsAwarded, feedback: typeof out.feedback === 'string' ? out.feedback.trim() : '' }
            : null,
        fallback: (v) => fallbackFeedback(clamp(v.pointsAwarded, 0, args.maxPoints), args.maxPoints),
      });
    },
    async judgeSingleAnswer(args) {
      const { system, user } = buildSingleAnswerJudgePrompt(args);
      const verdict = await judgedReply({
        callJson,
        system,
        user,
        schema: SINGLE_ANSWER_SCHEMA,
        context: args.question ?? '',
        studentText: responseToText(args.response),
        read: (out) =>
          typeof out.correct === 'boolean'
            ? { correct: out.correct, feedback: typeof out.feedback === 'string' ? out.feedback.trim() : '' }
            : null,
        fallback: (v) => fallbackFeedback(v.correct ? 1 : 0, 1),
      });
      return { ...verdict, modelResponse: args.expectedAnswer };
    },
  };
}
