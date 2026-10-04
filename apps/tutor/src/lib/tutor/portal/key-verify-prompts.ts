/**
 * Solver + judge prompts for the blind-solve answer-key check. Pure (no I/O).
 * Moved from scripts/audit/prompts.ts (which re-exports them) so the
 * creation-time verifier (./key-verify.ts) and the offline audit use the SAME
 * prompts.
 *
 * Two rules:
 *  1. Solver prompts are built from a `SolverView`, a type that has no key and
 *     no `correct` flag — the stored key cannot reach a solver by construction.
 *  2. Prompts are subject-agnostic (maths, sciences, history, English …): no
 *     topic-specific examples.
 */

/** What a solver is allowed to see. There is no `key` and no `correct` flag on
 *  this type — solver prompts are built ONLY from a SolverView. */
export interface SolverView {
  format: string;
  question: string;
  options: Array<{ letter: string; text: string }>;
}

export interface Prompt {
  system: string;
  user: string;
  schema: Record<string, unknown>;
}

const obj = (properties: Record<string, unknown>) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const SOLVER_SYSTEM = `You are a meticulous subject expert checking practice questions written for school and college-entry students. You are given one question and nothing else. Work it out carefully yourself, double-check the result, and report your final answer.

Do not guess. If the question cannot be answered as written, say so instead of answering: set ill_posed to true when it is ambiguous, is missing information needed to answer, contradicts itself, depends on a figure, graph, table or passage that is not included, or has more than one defensible answer (for multiple choice: no option is correct, or more than one is). A question that is merely hard, or that asks for an explanation in the student's own words, is NOT ill-posed.

Reply as JSON, filling the fields in this order:
- working: your working, kept brief — the steps that lead to the answer, checked once. Finish it BEFORE you commit to an answer; the fields after it must agree with where the working ends up.
- ill_posed: true / false.
- ill_posed_reason: one sentence when ill_posed is true, otherwise "".
- assumptions: ONLY a choice you had to make that the question did not settle AND that changes the final answer — a different standard choice would give a noticeably different result (for instance which standard value of a constant to use). Name it with the value you used. Leave "" when the question states everything needed; do not list values the question gives, or the usual idealisations of the subject.
- chosen_option: for multiple choice, the single letter of the correct option; otherwise "" (also "" when ill_posed).
- final_answer: your final answer only, in its simplest exact form (for multiple choice, the text of the option you chose). "" when ill_posed.
- justification: ONE line showing the decisive step or fact.`;

function formatHint(view: SolverView): string {
  if (view.options.length > 0) return 'Answer format: multiple choice — exactly one option is meant to be correct.';
  if (view.format === 'numeric') {
    return 'Answer format: the student types a single number. Give final_answer as a plain number (an exact fraction or a decimal), with no working.';
  }
  if (view.format === 'frq') {
    return 'Answer format: a written free response. Give final_answer as a complete but compact model answer covering every part asked (state each required result or claim; no padding).';
  }
  return 'Answer format: a short answer. Give final_answer as the result itself — a value, expression or brief statement — not a paragraph, unless the question asks for an explanation.';
}

/** Blind solve / tie-break solve. Takes ONLY a SolverView. */
export function buildSolverPrompt(view: SolverView): Prompt {
  const parts = [`Question:\n${view.question.trim()}`];
  if (view.options.length > 0) {
    parts.push(`Options:\n${view.options.map((o) => `${o.letter}) ${o.text}`).join('\n')}`);
  }
  parts.push(formatHint(view));
  return {
    system: SOLVER_SYSTEM,
    user: parts.join('\n\n'),
    schema: obj({
      working: { type: 'string' },
      ill_posed: { type: 'boolean' },
      ill_posed_reason: { type: 'string' },
      assumptions: { type: 'string' },
      chosen_option: { type: 'string' },
      final_answer: { type: 'string' },
      justification: { type: 'string' },
    }),
  };
}

const JUDGE_SYSTEM = `You compare two answers to the same question and decide whether they are the same answer. You are not asked which one is right, and you must not solve the question again to pick a side — only decide whether a grader holding ANSWER 1 as the reference would accept ANSWER 2, and the reverse.

Return exactly one verdict:
- SAME: the two answers state the same result. Differences of form do not matter (equivalent expressions, fraction vs decimal within rounding, units written differently, different wording, extra correct explanation or working around the same result). For explanatory answers: they make the same essential claims and neither contradicts the other.
- DIFFERENT: they give different results, or one asserts something the other contradicts — a student giving one would be marked wrong against the other.
- KEY_INCOMPLETE: ANSWER 1 is a fragment, covers only part of what the question asks, or is clearly less precise than the question demands — but nothing in it conflicts with ANSWER 2. (Use this only about ANSWER 1. If ANSWER 2 is the thinner one and nothing conflicts, that is SAME.)
- CANNOT_JUDGE: you cannot tell — for instance the question or an answer depends on material that is not shown, or the answers are not comparable.

Reply as JSON: verdict, and reason (one sentence naming the decisive difference or equivalence).`;

export function buildJudgePrompt(question: string, answer1: string, answer2: string): Prompt {
  return {
    system: JUDGE_SYSTEM,
    user: `Question:\n${question.trim()}\n\nANSWER 1:\n${answer1.trim()}\n\nANSWER 2:\n${answer2.trim()}`,
    schema: obj({
      verdict: { type: 'string', enum: ['SAME', 'DIFFERENT', 'KEY_INCOMPLETE', 'CANNOT_JUDGE'] },
      reason: { type: 'string' },
    }),
  };
}
