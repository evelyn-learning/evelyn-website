/**
 * Algebra 1 — Radical Expressions: Radical Equations & Pythagorean
 * Applications.
 *
 * The isolate-then-square routine (CCSS A-REI.A.2) plus the thing that
 * makes radical equations different from every other equation in the
 * course: squaring can INVENT solutions, so the check is part of the
 * method, not a courtesy. Closes with the Pythagorean theorem (8.G.B
 * bridge) — the radical equation students will meet most often outside
 * this chapter.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U9_RADICAL_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.radical-equations.v1',
  title: 'Radical Equations & Pythagorean Applications',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.radical-equations',
      standard: 'ALG1-9.2',
      description:
        'Solve radical equations by isolating the radical and squaring both sides, identify and discard extraneous solutions, and apply the Pythagorean theorem to find a missing leg or hypotenuse (CCSS A-REI.A.2, 8.G.B.7).',
    },
  ],
  prerequisites: ['alg1.simplifying-radicals'],
  followUps: ['alg1.rational-expressions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame radical equations as the way you dig out a length that is trapped inside a square — starting with a shortcut everybody has taken.',
      script:
        'A rectangular park is 300 m by 400 m. Walking two sides is 700 m; cutting straight across the diagonal is only 500 m, so the shortcut saves you 200 meters. Nobody measured that diagonal — it was solved for, out of a length hiding inside a square. Today the unknown lives under a square root sign, and the routine is short: isolate, square, solve, CHECK. That last step matters more here than anywhere else in Algebra 1, because squaring is the one move that can hand you an answer that was never true.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-isolate-square-check',
      kind: 'concept',
      goal: 'The isolate-then-square routine, why squaring can lie, and the Pythagorean theorem as the classic radical application.',
      keyIdeas: [
        'THE ROUTINE — 1) isolate the radical alone on one side, 2) square both sides to undo the root, 3) solve whatever equation is left, 4) CHECK every answer in the ORIGINAL equation.',
        'ISOLATE FIRST — squaring only kills the root when the radical stands alone. (√x + 3)² is x + 6√x + 9, NOT x + 9; the root survives and you are worse off than when you started.',
        'SQUARING IS NOT A REVERSIBLE MOVE — the statement x = −2 is false, but squaring it gives x² = 4, which x = −2 satisfies. Squaring can turn a false statement into a true one, so it can create answers out of nothing.',
        'EXTRANEOUS SOLUTION — a value the squared equation accepts but the original equation rejects. It is not an arithmetic mistake; it is a side effect of squaring. Discard it. The check is the last step of the method, not optional.',
        'THE PRINCIPAL ROOT IS NEVER NEGATIVE — √(anything) = a negative number has NO solution. You can stop before squaring; squaring would hide the contradiction and hand you a fake answer.',
        'WHEN SQUARING MAKES A QUADRATIC — √(x + 6) = x becomes x + 6 = x², i.e. x² − x − 6 = 0. Solve it the usual way, then test BOTH roots; typically one survives and one is extraneous.',
        'PYTHAGOREAN THEOREM — the radical equation you will meet most: a² + b² = c². Missing hypotenuse: c = √(a² + b²). Missing leg: b = √(c² − a²). Lengths take the POSITIVE root only, so the ± never appears here.',
        'LEG vs HYPOTENUSE — c is ALWAYS the hypotenuse, the longest side, across from the right angle. Adding the two given sides when one of them is the hypotenuse (so you should have subtracted) is the number-one error in these problems.',
      ],
      vocabulary: [
        { term: 'radicand', definition: 'the expression sitting under the radical sign — the x + 6 in √(x + 6).' },
        { term: 'extraneous solution', definition: 'a value produced by squaring that fails the original equation and must be thrown out.' },
        { term: 'hypotenuse', definition: 'the longest side of a right triangle, opposite the right angle — always c in a² + b² = c².' },
      ],
      suggestedTools: ['show_equation', 'show_geometry'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-isolate-then-square',
      kind: 'worked_example',
      problem: 'Solve: √(x − 3) + 4 = 9',
      steps: [
        'Isolate the radical: subtract 4 from both sides to get √(x − 3) = 5.',
        'Now the radical stands alone, so square both sides: x − 3 = 25.',
        'Solve the leftover linear equation: add 3 to both sides, x = 28.',
        'CHECK in the ORIGINAL: √(28 − 3) + 4 = √25 + 4 = 5 + 4 = 9. ✓ So x = 28 is a genuine solution.',
      ],
      answer: 'x = 28',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-extraneous',
      kind: 'worked_example',
      problem: 'Solve: √(x + 6) = x',
      steps: [
        'The radical is already alone, so square both sides: x + 6 = x².',
        'Move everything to one side: x² − x − 6 = 0, which factors as (x − 3)(x + 2) = 0, giving candidates x = 3 and x = −2.',
        'CHECK x = 3 in the original: √(3 + 6) = √9 = 3, and the right side is 3. ✓ It works.',
        'CHECK x = −2: √(−2 + 6) = √4 = 2, but the right side is −2. Since 2 ≠ −2, x = −2 is EXTRANEOUS — squaring invented it, and the check catches it.',
        'Report only the survivor: x = 3. Skipping the check here would have doubled the answer set with a value that is simply not a solution.',
      ],
      answer: 'x = 3 only (x = −2 is extraneous)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-isolate-square',
      kind: 'try_yourself',
      problem: 'Solve for x: √(3x + 1) = 5',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 8', correct: true },
        { id: 'b', text: 'x = 4/3' },
        { id: 'c', text: 'x = 26/3' },
        { id: 'd', text: 'x = 24' },
      ],
      expectedAnswer: 'x = 8',
      hints: [
        'The radical is already isolated — square BOTH sides, including the 5.',
        'Squaring gives 3x + 1 = 25. Subtract 1, then divide by 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-extraneous',
      kind: 'try_yourself',
      problem: 'Squaring both sides of √(x + 12) = x gives x + 12 = x², whose solutions are x = 4 and x = −3. Which of those are actual solutions of the ORIGINAL equation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 4 only', correct: true },
        { id: 'b', text: 'x = −3 only' },
        { id: 'c', text: 'Both x = 4 and x = −3' },
        { id: 'd', text: 'Neither one' },
      ],
      expectedAnswer: 'x = 4 only',
      hints: [
        'Substitute each candidate into the original equation √(x + 12) = x, not into the squared version.',
        'For x = −3 the left side is √9 = 3, and a principal square root is never negative — so it cannot equal −3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pythagorean-leg',
      kind: 'try_yourself',
      problem: 'A right triangle has a hypotenuse of 17 cm and one leg of 8 cm. How long is the other leg, in cm? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        '17 is the hypotenuse (the longest side), so it is c: 8² + b² = 17².',
        '64 + b² = 289, so b² = 225 — take the positive square root.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-square-and-check',
      kind: 'misconception_check',
      question: 'Two students get stuck. The first solves √x + 3 = 7 by squaring immediately, writes x + 9 = 49, and answers x = 40. The second solves √(x − 2) = −5 by squaring to get x − 2 = 25, and answers x = 27. Substitute each answer back into its original equation — what went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 40',
          misconception: 'Squaring term-by-term: treating (√x + 3)² as x + 9. Squaring a SUM is not the sum of the squares — the middle term goes missing.',
          correctsTo: 'Isolate before squaring: √x = 4, then square to get x = 16. Check: √16 + 3 = 4 + 3 = 7 ✓. (For the record, (√x + 3)² = x + 6√x + 9, which still contains a radical — that is exactly why you isolate first.) And x = 40 fails the check: √40 + 3 ≈ 9.3, not 7.',
        },
        {
          answer: 'x = 27',
          misconception: 'Trusting the squared equation without checking. Squaring erased the negative sign on the right, so the contradiction disappeared.',
          correctsTo: 'A principal square root is never negative, so √(x − 2) = −5 has NO solution — you can say that before squaring. And the check confirms it: √(27 − 2) = √25 = 5, not −5, so x = 27 is extraneous.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The routine: isolate the radical, square both sides, solve, then CHECK in the original equation.',
        'Squaring can invent solutions — any candidate that fails the original is EXTRANEOUS and gets discarded.',
        'Isolate before you square: (√x + 3)² = x + 6√x + 9, not x + 9.',
        '√(expression) = a negative number has no solution; the principal root is never negative.',
        'Pythagorean: hypotenuse c = √(a² + b²), missing leg b = √(c² − a²) — positive root only, and c is always the longest side.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Radical Equations & Pythagorean Applications' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
