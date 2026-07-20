/**
 * Digital SAT — Math / Advanced Math: Rational, Radical & Absolute-Value
 * Equations.
 *
 * Three equation families that share one core trap: the algebra that
 * solves them (clearing denominators, squaring, case-splitting) can
 * MANUFACTURE solutions that don't actually satisfy the original
 * equation. The digital SAT bakes extraneous roots into the wrong
 * answer choices — checking every candidate against the original
 * equation is not optional, it's the skill being tested. Desmos is
 * allowed on every math question.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U2_RATIONAL_RADICAL_ABSOLUTE: LessonPlan = {
  id: 'evelyn.testprep.dsat.rational-radical-absolute.v1',
  title: 'Rational, Radical & Absolute-Value Equations',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.rational-radical-absolute',
      standard: 'DSAT-2.5',
      description:
        'Solve rational equations by clearing denominators, radical equations by isolating and squaring, and absolute-value equations by case-splitting — and identify and reject extraneous solutions by checking every candidate against the original equation.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame extraneous-solution checking as the actual skill being tested, not a formality.',
      script:
        'Rational, radical, and absolute-value equations show up throughout Advanced Math on the digital SAT. The algebra to solve each one is quick — but that same algebra can manufacture a solution that does not actually work in the original equation. The SAT knows this, and it plants that extraneous value as a wrong answer choice. Today the real skill: solve, then check.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-extraneous',
      kind: 'concept',
      goal: 'The solve procedure for each equation family, and why each one can produce extraneous solutions.',
      keyIdeas: [
        'RATIONAL EQUATIONS — clear every denominator by multiplying both sides by the LCD, solve the resulting polynomial, then CHECK each candidate against the ORIGINAL denominators. Any candidate that makes an original denominator zero is EXTRANEOUS — reject it, even though it "solves" the cleared equation.',
        'RADICAL EQUATIONS — isolate the radical on one side, then square both sides to eliminate it. Squaring is not reversible (it loses sign information), so it can manufacture a candidate that fails the ORIGINAL (unsquared) equation. Plug every candidate back into the original before reporting it.',
        'ABSOLUTE-VALUE EQUATIONS — |A| = B splits into two cases, A = B and A = −B, but ONLY when B ≥ 0. If B is negative, the equation has NO SOLUTION — an absolute value can never equal a negative number.',
        'THE SAT TRAP — wrong answer choices on these questions are frequently the exact extraneous root produced by squaring or clearing denominators. Skipping the check step is the single most common way to miss an otherwise-correct solve.',
        'DOMAIN FIRST, when possible — for rational equations, identify which x-values make a denominator zero BEFORE you solve, so you already know which candidates to reject on sight.',
        'DESMOS CHECK — graph y = (left side) − (right side); the x-intercepts are the TRUE solutions, since Desmos evaluates the actual original functions and automatically excludes points where a function is undefined.',
        '|A| = |B| (absolute value on BOTH sides) splits into A = B or A = −B with no sign condition needed — both sides are already guaranteed nonnegative, so the split itself never introduces an extraneous root.',
      ],
      vocabulary: [
        { term: 'extraneous solution', definition: 'a value produced by valid algebra (squaring, clearing denominators) that fails to satisfy the ORIGINAL equation — must be rejected.' },
        { term: 'excluded value', definition: 'an x-value that makes a denominator zero and can never belong to a rational equation\'s solution set.' },
        { term: 'case split', definition: 'rewriting |A| = B as the two equations A = B and A = −B, valid only when B ≥ 0.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem: 'Solve: 2/(x + 3) = 1/(x − 1)',
      steps: [
        'Cross-multiply: 2(x − 1) = 1(x + 3).',
        'Distribute and collect: 2x − 2 = x + 3 → x = 5.',
        'CHECK the original denominators: x + 3 = 8 ≠ 0 and x − 1 = 4 ≠ 0 — x = 5 is allowed. Verify: 2/8 = 0.25 and 1/4 = 0.25. ✓',
      ],
      answer: 'x = 5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap',
      kind: 'worked_example',
      problem: 'Solve: √(x + 3) = x − 3',
      steps: [
        'Square both sides: x + 3 = (x − 3)² = x² − 6x + 9.',
        'Collect: 0 = x² − 7x + 6 = (x − 6)(x − 1) → x = 6 or x = 1.',
        'CHECK x = 6 in the ORIGINAL: √9 = 3, and 6 − 3 = 3. ✓ Valid.',
        'CHECK x = 1 in the ORIGINAL: √4 = 2, and 1 − 3 = −2. 2 ≠ −2 — EXTRANEOUS. Reject it.',
      ],
      answer: 'x = 6 (x = 1 is extraneous — squaring introduced it)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-absolute',
      kind: 'try_yourself',
      problem: 'Solve for x: |2x − 5| = 9',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 7 or x = −2', correct: true },
        { id: 'b', text: 'x = 7 or x = 2' },
        { id: 'c', text: 'x = −7 or x = 2' },
        { id: 'd', text: 'x = 7 only' },
      ],
      expectedAnswer: 'x = 7 or x = −2',
      hints: [
        'Absolute value equations split into two cases: the inside expression equals the value, or equals its negative.',
        'Solve 2x − 5 = 9 and 2x − 5 = −9 separately, then check both in the original equation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rational-trap',
      kind: 'try_yourself',
      problem: 'Solve: x/(x − 2) = 2/(x − 2) + 3',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 2' },
        { id: 'b', text: 'No solution', correct: true },
        { id: 'c', text: 'x = −2' },
        { id: 'd', text: 'x = 4' },
      ],
      expectedAnswer: 'No solution',
      hints: [
        'Multiply both sides by (x − 2) to clear denominators — but first ask what value of x makes (x − 2) = 0.',
        'Clearing the denominators gives x = 2. Is that value allowed in the original equation?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-radical-spr',
      kind: 'try_yourself',
      problem: 'Student-produced response (type your answer): What is the value of x that satisfies √(2x + 1) = x − 1?',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Square both sides to get a quadratic, then find both algebraic candidates.',
        'One candidate makes the right side negative while the left side (a square root) can never be negative — check both in the original equation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-rhs',
      kind: 'misconception_check',
      question: 'A student solves |x − 4| = −6 by writing the two cases x − 4 = −6 and x − 4 = 6, getting x = −2 or x = 10. What went wrong?',
      commonErrors: [
        {
          answer: 'x = −2 or x = 10',
          misconception: 'Splitting into two cases without first checking whether the right-hand side is nonnegative.',
          correctsTo: 'Before splitting |A| = B into cases, check the sign of B. Here B = −6, which is negative — and an absolute value can NEVER equal a negative number. The equation has NO SOLUTION. The case split A = B or A = −B is only valid when B ≥ 0.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rational equations: clear the LCD, solve, then reject any candidate that makes an original denominator zero.',
        'Radical equations: isolate and square, then check every candidate in the ORIGINAL (unsquared) equation — squaring can create extraneous roots.',
        '|A| = B splits into A = B or A = −B only when B ≥ 0; a negative B means no solution, full stop.',
        'The SAT\'s wrong answer choices are often exactly the extraneous root — never skip the check.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.5', cedTitle: 'Rational, Radical & Absolute-Value Equations' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
