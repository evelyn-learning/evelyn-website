/**
 * Algebra 1 — Inequalities: Solving & Graphing One-Variable Inequalities.
 *
 * Same isolate-the-variable rhythm as the equation unit (CCSS A-REI.B.3)
 * with exactly one new rule — multiplying or dividing both sides by a
 * NEGATIVE flips the inequality — plus number-line graphs: open circle
 * for strict, closed circle for inclusive. Compound inequalities,
 * absolute-value inequalities, and every "constraint" problem later in
 * the course are built on this single routine.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U3_ONE_VARIABLE_INEQUALITIES: LessonPlan = {
  id: 'evelyn.hs.alg1.one-variable-inequalities.v1',
  title: 'Solving & Graphing One-Variable Inequalities',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.one-variable-inequalities',
      standard: 'ALG1-3.1',
      description:
        'Solve one-variable linear inequalities, apply the sign-flip rule when multiplying or dividing by a negative, and graph the solution set on a number line with open or closed circles (CCSS A-REI.B.3).',
    },
  ],
  prerequisites: ['alg1.proportions-percents'],
  followUps: ['alg1.compound-inequalities'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame inequalities as the language of limits — budgets, capacities, minimums — where the answer is a RANGE, not a single number.',
      script:
        'Most real questions do not have one right answer. You have 50 dollars and tickets cost 8 — how many can you buy? A ride needs riders at least 48 inches tall. A truck can carry at most 2 tons. None of those are equations; they are inequalities, and the answer is a whole range of numbers. The good news: you already know how to solve them, because the routine is the same as an equation. There is exactly ONE new rule, and today it becomes automatic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-flip-and-graph',
      kind: 'concept',
      goal: 'The solve-like-an-equation routine, the one exception (the flip rule), and how to draw the solution set on a number line.',
      keyIdeas: [
        'SAME ROUTINE AS EQUATIONS — distribute, collect like terms, undo addition/subtraction, then divide by the coefficient. Whatever you do to one side you do to the other.',
        'THE FLIP RULE — multiplying OR dividing both sides by a NEGATIVE number reverses the inequality symbol: −3x > 15 becomes x < −5, not x > −5.',
        'WHY IT FLIPS — start with a true statement, 5 > 3. Multiply both sides by −1: −5 and −3. But −5 is LESS than −3, so the symbol must reverse to keep the statement true.',
        'WHEN NOT TO FLIP — adding or subtracting anything (even a negative number) never flips. Multiplying or dividing by a POSITIVE never flips. Only a negative multiplier or divisor does.',
        'NUMBER-LINE GRAPH — put the boundary value on the line, then shade every value that works.',
        'OPEN vs CLOSED CIRCLE — strict symbols (< or >) get an OPEN circle: the boundary itself is not a solution. Inclusive symbols (≤ or ≥) get a CLOSED, filled circle: the boundary IS a solution.',
        'WHICH WAY TO SHADE — read the FINAL line with x on the left. x < 5 shades left (toward smaller numbers); x > 5 shades right. Do not read the direction off the original problem — it may have flipped along the way.',
        'ALWAYS SENSE-CHECK — pick one number inside your shaded region and one outside, and substitute both into the ORIGINAL inequality. The inside number must make it true and the outside number must make it false.',
      ],
      vocabulary: [
        { term: 'solution set', definition: 'every value of the variable that makes the inequality true — usually infinitely many.' },
        { term: 'boundary value', definition: 'the number where the solution set starts or stops; included for ≤ and ≥, excluded for < and >.' },
        { term: 'strict inequality', definition: 'one using < or > only, so the boundary value itself does not count as a solution.' },
      ],
      suggestedTools: ['show_equation', 'show_number_line'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-no-flip',
      kind: 'worked_example',
      problem: 'Solve and graph: 4x + 9 ≤ 33',
      steps: [
        'Subtract 9 from both sides: 4x ≤ 24. (Subtraction never flips the symbol.)',
        'Divide both sides by 4 — positive, so no flip: x ≤ 6.',
        'Graph: CLOSED circle at 6 because ≤ includes the boundary, shaded LEFT toward smaller numbers.',
        'Sense-check inside: x = 6 → 4(6) + 9 = 33 ≤ 33 ✓. Outside: x = 7 → 37 ≤ 33 is false ✓.',
      ],
      answer: 'x ≤ 6 (closed circle at 6, shaded left)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-flip',
      kind: 'worked_example',
      problem: 'Solve and graph: 7 − 3x > 22',
      steps: [
        'Subtract 7 from both sides: −3x > 15. Still >, because subtracting does not flip.',
        'Now divide both sides by −3. THIS is the flip step: the symbol reverses from > to <.',
        '15 ÷ (−3) = −5, so x < −5.',
        'Graph: OPEN circle at −5 because > is strict, shaded LEFT — read the direction off the final line x < −5, not off the original >.',
        'Sense-check inside: x = −6 → 7 − 3(−6) = 7 + 18 = 25 > 22 ✓. Outside: x = 0 → 7 > 22 is false ✓.',
      ],
      answer: 'x < −5 (open circle at −5, shaded left)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-flip',
      kind: 'try_yourself',
      problem: 'Solve for x: −5x + 3 ≥ 28',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x ≤ −5', correct: true },
        { id: 'b', text: 'x ≥ −5' },
        { id: 'c', text: 'x ≤ 5' },
        { id: 'd', text: 'x ≥ 5' },
      ],
      expectedAnswer: 'x ≤ −5',
      hints: [
        'Subtract 3 from both sides first — that step does not flip anything.',
        'You are left with −5x ≥ 25. Dividing by −5 is negative, so the symbol reverses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-graph',
      kind: 'try_yourself',
      problem: 'Which number-line graph shows the solution set of 2x − 6 > 4?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Open circle at 5, shaded right', correct: true },
        { id: 'b', text: 'Closed circle at 5, shaded right' },
        { id: 'c', text: 'Open circle at 5, shaded left' },
        { id: 'd', text: 'Open circle at 10, shaded right' },
      ],
      expectedAnswer: 'Open circle at 5, shaded right',
      hints: [
        'Solve it first: add 6 to both sides, then divide by 2 (positive — no flip).',
        'x > 5 is strict, so the boundary point is not included; shade the side the final symbol points to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Type your answer as a number: what is the SMALLEST integer value of x that satisfies −4x + 1 ≤ 17?',
      responseFormat: 'numeric',
      expectedAnswer: '-4',
      hints: [
        'Subtract 1 from both sides to get −4x ≤ 16.',
        'Divide by −4 and flip the symbol: x ≥ −4. The smallest integer in that set is the boundary itself, since ≥ includes it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-missed-flip',
      kind: 'misconception_check',
      question: 'A student solves 12 − 5x < 2 by writing −5x < −10 and then x < 2. Test x = 1 in the original inequality. What went wrong?',
      commonErrors: [
        {
          answer: 'x < 2',
          misconception: 'Dividing both sides by −5 without reversing the inequality symbol — treating the flip rule as optional whenever the arithmetic "looks fine".',
          correctsTo: 'Dividing by a NEGATIVE reverses the symbol: −5x < −10 gives x > 2. Check the student answer x = 1: 12 − 5(1) = 7, and 7 < 2 is false, so x = 1 is not a solution. Check x = 3: 12 − 15 = −3 < 2 ✓.',
        },
        {
          answer: 'Flip the symbol at the first step because there is a negative in the problem',
          misconception: 'Over-applying the rule — flipping whenever any negative number appears, instead of only when multiplying or dividing BOTH sides by a negative.',
          correctsTo: 'Subtracting 12 from both sides is addition/subtraction, so nothing flips: 12 − 5x < 2 becomes −5x < −10 with the symbol unchanged. The flip happens only at the divide-by-−5 step.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solve an inequality exactly like an equation — same move on both sides.',
        'THE FLIP RULE: multiplying or dividing both sides by a NEGATIVE reverses the symbol. Nothing else does.',
        'Open circle for < and >; closed, filled circle for ≤ and ≥.',
        'Shade based on the FINAL line with x isolated on the left, not the symbol in the original problem.',
        'Sense-check with one number inside the solution set and one outside.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Solving & Graphing One-Variable Inequalities' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
