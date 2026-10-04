/**
 * Prompts + JSON schemas for the answer-key audit. Pure (no I/O).
 *
 * Two rules:
 *  1. Solver prompts are built from a `SolverView`, a type that has no key and
 *     no `correct` flag — the stored key cannot reach a solver by construction.
 *  2. Prompts are subject-agnostic (maths, sciences, history, English …): no
 *     topic-specific examples.
 */
import type { Prompt } from '../../src/lib/tutor/portal/key-verify-prompts';

// The solver + judge prompts live in src/ (shared with the creation-time verifier).
export { buildSolverPrompt, buildJudgePrompt } from '../../src/lib/tutor/portal/key-verify-prompts';
export type { Prompt };

const obj = (properties: Record<string, unknown>) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const REVIEW_SYSTEM = `You review an open-response practice question that has no single expected answer; a student's response is graded against a rubric (shown when one is available). Do not answer the question. Decide whether it can be fairly answered and fairly graded.

Report PROBLEM only for a concrete defect, such as: the question is ambiguous or self-contradictory; it relies on a figure, table, passage or data that is not included; it states something factually wrong; its parts cannot all be answered from what is given; the rubric rewards something the question never asks for, contradicts the question, awards points that cannot be told apart, or cannot be applied to a real response. Matters of style or difficulty are not defects. Otherwise report OK.

Reply as JSON:
- verdict: OK or PROBLEM.
- problem_in: "question", "rubric" or "both" when PROBLEM, otherwise "".
- reason: one sentence — the defect, or why it is gradable.`;

export function buildReviewPrompt(question: string, rubric: string | null): Prompt {
  const rubricPart = rubric
    ? `Rubric:\n${rubric.trim()}`
    : 'Rubric: (not available to you — review the question on its own: is it well-posed, self-contained and gradable by a reasonable rubric?)';
  return {
    system: REVIEW_SYSTEM,
    user: `Question:\n${question.trim()}\n\n${rubricPart}`,
    schema: obj({
      verdict: { type: 'string', enum: ['OK', 'PROBLEM'] },
      problem_in: { type: 'string', enum: ['question', 'rubric', 'both', ''] },
      reason: { type: 'string' },
    }),
  };
}
