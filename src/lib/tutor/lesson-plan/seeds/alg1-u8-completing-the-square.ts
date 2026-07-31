/**
 * Algebra 1 — Quadratic Functions: Completing the Square.
 *
 * The universal quadratic move (CCSS A-REI.B.4a, F-IF.C.8a): build the
 * (b/2)² term, add it to BOTH sides, factor the perfect square, finish with
 * ±. The same manoeuvre rewrites standard form into vertex form — and, run
 * on ax² + bx + c in the abstract, it is literally where the quadratic
 * formula comes from.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U8_COMPLETING_THE_SQUARE: LessonPlan = {
  id: 'evelyn.hs.alg1.completing-the-square.v1',
  title: 'Completing the Square',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.completing-the-square',
      standard: 'ALG1-8.3',
      description:
        'Solve quadratic equations by completing the square and rewrite a quadratic from standard form into vertex form to reveal its vertex (CCSS A-REI.B.4a, F-IF.C.8a).',
    },
  ],
  prerequisites: ['alg1.solving-by-factoring-square-roots'],
  followUps: ['alg1.quadratic-formula-discriminant'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Position completing the square as the method that never fails — and as the source of the quadratic formula.',
      script:
        'Try to factor x² + 6x − 1. You cannot — no pair of whole numbers works, because the answers are irrational. Factoring only rescues the tidy quadratics. Completing the square works on every single one: you reshape the equation into (something)² = a number, and a square root finishes it. Bonus — run this exact move on a general quadratic and out falls the quadratic formula you will meet next.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-completion-number',
      kind: 'concept',
      goal: 'Build the (b/2)² term, keep the equation balanced, and see the same move produce vertex form.',
      keyIdeas: [
        'THE COMPLETION NUMBER — for x² + bx, the number that finishes the square is (b/2)². HALVE first, THEN square. For b = 8 that is (8/2)² = 16, not 8² = 64.',
        'WHY IT WORKS — (x + p)² expands to x² + 2px + p². So the middle coefficient is twice p, meaning p = b/2, and the constant you need is p² = (b/2)². Half of the middle coefficient always sits inside the parentheses: x² + bx + (b/2)² = (x + b/2)².',
        'SOLVING AN EQUATION — 1) move the constant to the right, 2) add (b/2)² to BOTH sides, 3) factor the left as (x + b/2)², 4) square-root both sides, 5) isolate x. Skipping the right side breaks the balance and every answer after it is wrong.',
        'ALWAYS ± — square-rooting both sides gives two branches, because both +5 and −5 square to 25. Write x + b/2 = ±√(right side) or you lose one of the two solutions.',
        'LEADING COEFFICIENT NOT 1 — divide (or factor) the a out first. 2x² + 12x − 4 = 0 becomes x² + 6x − 2 = 0, then x² + 6x = 2, then (x + 3)² = 11, so x = −3 ± √11.',
        'EQUATION vs EXPRESSION — on an equation you add (b/2)² to both sides. On an expression like y = x² + bx + c there is no second side, so you add AND subtract it in the same line: y = (x² + bx + (b/2)²) − (b/2)² + c. Adding without subtracting quietly changes the function.',
        'VERTEX FORM — that rewrite lands on y = a(x − h)² + k, whose vertex is (h, k). It is the fastest way to read a parabola off its equation: the h shifts it sideways, the k up or down.',
        'WHERE THE FORMULA COMES FROM — complete the square on ax² + bx + c = 0 with letters instead of numbers and you get x = (−b ± √(b² − 4ac)) / (2a). The formula is not a separate trick; it is this lesson, done once, in general.',
      ],
      vocabulary: [
        {
          term: 'perfect-square trinomial',
          definition: 'a trinomial that factors as (x + p)² — its constant is the square of half its middle coefficient.',
        },
        {
          term: 'vertex form',
          definition: 'y = a(x − h)² + k, which displays the vertex (h, k) of the parabola directly.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-solve-equation',
      kind: 'worked_example',
      problem: 'Solve by completing the square: x² + 6x − 1 = 0',
      steps: [
        'Move the constant to the right: x² + 6x = 1.',
        'Half of 6 is 3, and 3² = 9. Add 9 to BOTH sides: x² + 6x + 9 = 10.',
        'The left side is now a perfect square: (x + 3)² = 10.',
        'Square-root both sides, keeping ±: x + 3 = ±√10.',
        'Subtract 3: x = −3 ± √10. Since √10 ≈ 3.16, the solutions are about 0.16 and −6.16.',
        'Check x = −3 + √10: (−3 + √10)² = 19 − 6√10, and 6(−3 + √10) = −18 + 6√10. Adding gives 1, and 1 − 1 = 0. ✓',
      ],
      answer: 'x = −3 ± √10',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-vertex-form',
      kind: 'worked_example',
      problem: 'Rewrite y = x² − 5x + 2 in vertex form and name the vertex. (Watch the one-sided bookkeeping — there is no second side to add to here.)',
      steps: [
        'Half of −5 is −5/2, and (−5/2)² = 25/4. This is an expression, not an equation, so add 25/4 and subtract it back in the same line: y = (x² − 5x + 25/4) − 25/4 + 2.',
        'Factor the bracket as a perfect square: y = (x − 5/2)² − 25/4 + 2.',
        'Combine the constants: 2 = 8/4, so −25/4 + 8/4 = −17/4. Vertex form: y = (x − 5/2)² − 17/4.',
        'Read the vertex off the form: (h, k) = (5/2, −17/4), i.e. (2.5, −4.25).',
        'Check by expanding: (x − 5/2)² = x² − 5x + 25/4, and 25/4 − 17/4 = 8/4 = 2, giving back x² − 5x + 2. ✓',
        'Contrast: a student who adds 25/4 and forgets to subtract it gets y = (x − 5/2)² + 2, a different function shifted 25/4 too high.',
      ],
      answer: 'y = (x − 5/2)² − 17/4, vertex (5/2, −17/4)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-mcq',
      kind: 'try_yourself',
      problem: 'Solve by completing the square: x² + 8x − 5 = 0',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = −4 ± √21', correct: true },
        { id: 'b', text: 'x = −4 ± √5' },
        { id: 'c', text: 'x = −8 ± √69' },
        { id: 'd', text: 'x = 4 ± √21' },
      ],
      expectedAnswer: 'x = −4 ± √21',
      hints: [
        'Move the −5 across first: x² + 8x = 5.',
        'Half of 8 is 4 and 4² = 16 — add 16 to BOTH sides, so the right side becomes 21.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-vertex-mcq',
      kind: 'try_yourself',
      problem: 'Which is the vertex form of y = x² + 10x + 18?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = (x + 5)² − 7', correct: true },
        { id: 'b', text: 'y = (x + 5)² + 18' },
        { id: 'c', text: 'y = (x + 5)² + 43' },
        { id: 'd', text: 'y = (x + 10)² − 82' },
      ],
      expectedAnswer: 'y = (x + 5)² − 7',
      hints: [
        'Half of 10 is 5, so the square is (x + 5)² — and expanding it brings in a 25 that was not in the original.',
        'Subtract that 25 back in the same line: (x + 5)² − 25 + 18.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve x² − 6x − 16 = 0 by completing the square, then type the LARGER solution as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'Move the constant: x² − 6x = 16, then add (−6/2)² = 9 to both sides.',
        '(x − 3)² = 25, so x − 3 = ±5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-balance-and-plusminus',
      kind: 'misconception_check',
      question:
        'Solving x² + 10x = 3, a student writes: "x² + 10x + 25 = 3, so (x + 5)² = 3, so x + 5 = √3, so x = −5 + √3." Two different things went wrong. What are they?',
      commonErrors: [
        {
          answer: '(x + 5)² = 3',
          misconception: 'Adding the completion number 25 to the left side only, so the two sides are no longer equal.',
          correctsTo:
            'Whatever you add to complete the square must be added to BOTH sides: x² + 10x + 25 = 3 + 25, which gives (x + 5)² = 28.',
        },
        {
          answer: 'x = −5 + √3 as the only solution',
          misconception: 'Square-rooting both sides without the ±, which throws away one of the two solutions.',
          correctsTo:
            'Both +√28 and −√28 square to 28, so x + 5 = ±√28 = ±2√7 and x = −5 ± 2√7. A quadratic has two solutions unless the squared side equals 0.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The completion number is (b/2)² — HALVE, then square. Never b².',
        'On an equation, add it to BOTH sides; on an expression, add and subtract it in the same line.',
        'Factor as (x + b/2)², then square-root both sides WITH ± — two solutions, not one.',
        'If the leading coefficient is not 1, divide it out before you start.',
        'The same move turns y = ax² + bx + c into vertex form y = a(x − h)² + k with vertex (h, k) — and, done with letters, produces the quadratic formula.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Completing the Square' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
