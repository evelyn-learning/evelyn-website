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

/** The gradable item, resolved by the caller from its content store. */
export interface GradeItem {
  itemId: string;
  /** Present → part-by-part rubric grading. */
  rubric?: FrqRubric;
  /** Present (and no rubric) → legacy single-answer judge path. */
  expectedAnswer?: string;
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
  const judged = await deps.judgeSingleAnswer({
    expectedAnswer: item.expectedAnswer ?? '',
    response: req.response,
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

const GRADER_MODEL = 'claude-sonnet-4-6';

async function callClaudeJson(system: string, user: string): Promise<Record<string, unknown>> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: GRADER_MODEL,
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

export function defaultGradeDeps(): GradeDeps {
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
      const out = await callClaudeJson(system, user);
      return {
        pointsAwarded: typeof out.pointsAwarded === 'number' ? out.pointsAwarded : 0,
        feedback: typeof out.feedback === 'string' ? out.feedback : '',
      };
    },
    async judgeSingleAnswer(args) {
      const system =
        'You judge whether a student answer matches the expected answer. ' +
        'Reply ONLY as JSON: {"correct": boolean, "feedback": string}.';
      const user = [
        `Expected answer: ${args.expectedAnswer}`,
        `Student response: ${responseToText(args.response)}`,
      ].join('\n\n');
      const out = await callClaudeJson(system, user);
      return {
        correct: out.correct === true,
        feedback: typeof out.feedback === 'string' ? out.feedback : '',
        modelResponse: args.expectedAnswer,
      };
    },
  };
}
