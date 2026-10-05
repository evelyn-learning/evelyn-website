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
 */

import type {
  FrqRubric,
  GradeFreeResponseRequest,
  GradeFreeResponseResponse,
} from '@evelyn/portal-contract/v1';
import { gradeNumericAnswer } from './numeric-answer-rule';

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

export async function gradeFreeResponse(
  req: GradeFreeResponseRequest,
  item: GradeItem,
  deps: GradeDeps,
): Promise<GradeFreeResponseResponse> {
  // Rubric path — score each part, clamp to its maxPoints.
  if (item.rubric && item.rubric.parts.length > 0) {
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
      });
      parts.push({
        criterionId: p.criterionId,
        pointsAwarded: clamp(graded.pointsAwarded, 0, p.maxPoints),
        maxPoints: p.maxPoints,
        feedback: graded.feedback,
      });
      if (p.modelResponse) modelChunks.push(`${p.criterionId}: ${p.modelResponse}`);
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

async function callClaudeJson(system: string, user: string): Promise<Record<string, unknown>> {
  const { getModelClient } = await import('../ai/model-registry');
  const { client, model } = getModelClient('grader');
  const msg = await client.messages.create({
    model,
    max_tokens: 1000,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const text = msg.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .trim();
  // Tolerate fenced JSON.
  const jsonStr = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** A model call that returns parsed JSON (`{}` when the reply is not JSON). */
export type JsonModelCall = (system: string, user: string) => Promise<Record<string, unknown>>;

/**
 * Instructions for the single-answer judge. Generic by design — no topic
 * examples (an example teaches the judge that topic, not the rule).
 *
 * The three rules after the first exist because the judge, given only
 * "does it match?", accepted answers that were merely near the key and
 * answers that broke a form the question demanded:
 *  - equal, not close;
 *  - a stated requirement on the answer is part of what "correct" means;
 *  - interval bracket style is deliberately NOT enforced (owner's decision).
 */
export const SINGLE_ANSWER_JUDGE_SYSTEM = [
  'You judge whether a student answer to a question is correct, given the expected answer.',
  'Equivalence: accept an answer that says the same thing as the expected answer in a different but valid way — an equivalent expression or relation, the same value in another notation, or the same idea in the student\'s own words. When the expected answer is a worked solution, compare the student answer with its final result.',
  'Equal, not close: an answer is correct only if it is equal to the expected answer, not merely close to it. Do not accept a numeric answer because it is near the expected value or "within rounding", unless it is the expected value written to a different valid precision that the question permits. A related but different idea is not the expected idea.',
  'Stated requirements: when the question states a required form, precision, units or constraint on the answer (a named standard form, sign or integer constraints on coefficients, a number of decimal places, simplest form, a fraction), an answer that is otherwise equivalent but violates the stated requirement is incorrect, and the feedback must say which requirement is not met.',
  'Intervals: when the question asks for the interval(s) on which something is increasing or decreasing, accept either bracket style (open or closed endpoints).',
  'Feedback: one or two sentences addressed to the student.',
  'Reply ONLY as JSON: {"correct": boolean, "feedback": string}.',
].join('\n');

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

export function defaultGradeDeps(): GradeDeps {
  return makeGradeDeps(callClaudeJson);
}

/** The model-backed graders over an injectable model call (tests pass a fake). */
export function makeGradeDeps(callJson: JsonModelCall): GradeDeps {
  return {
    async gradeRubricPart(args) {
      const system =
        'You are an AP exam grader. Score the student response for ONE rubric criterion only. ' +
        'Award integer or half points from 0 to the criterion maxPoints. Be strict and fair. ' +
        'Reply ONLY as JSON: {"pointsAwarded": number, "feedback": string}.';
      const user = [
        ...(args.passageText
          ? [`Stimulus the student analyzed (verify cited evidence against it):\n${args.passageText}`]
          : []),
        `Criterion (max ${args.maxPoints} pts): ${args.scoringCriteria}`,
        `Reference (full-credit) response: ${args.modelResponse}`,
        `Student response: ${responseToText(args.response)}`,
      ].join('\n\n');
      const out = await callJson(system, user);
      return {
        pointsAwarded: typeof out.pointsAwarded === 'number' ? out.pointsAwarded : 0,
        feedback: typeof out.feedback === 'string' ? out.feedback : '',
      };
    },
    async judgeSingleAnswer(args) {
      const { system, user } = buildSingleAnswerJudgePrompt(args);
      const out = await callJson(system, user);
      return {
        correct: out.correct === true,
        feedback: typeof out.feedback === 'string' ? out.feedback : '',
        modelResponse: args.expectedAnswer,
      };
    },
  };
}
