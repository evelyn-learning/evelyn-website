/**
 * GCSE Math Higher — Quadratics: Completing the Square.
 * Vertex form, deriving the quadratic formula, solving by completion.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_QUADRATIC_COMPLETE_SQUARE: LessonPlan = {
  id: 'evelyn.gcse.math.quadratic-complete-square.v1',
  title: 'GCSE Higher — Completing the Square',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.quadratic-complete-square',
      description: 'Rewrite quadratics in completed-square form (x − h)² + k; use to find turning points and solve quadratic equations.',
      standard: 'GCSE-MATH-A11/A18',
    },
  ],
  prerequisites: ['gcse.math.algebra-factor'],
  followUps: ['gcse.math.simultaneous-lin-quad'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Completing the square shows up in graph sketching, exact roots, and the proof of the quadratic formula itself.',
      script: 'Some quadratics don\'t factorise nicely. Completing the square is the universal hammer — it works for every quadratic, gives exact roots in surd form, and reveals the turning point of the parabola in one step. The quadratic formula you\'ll memorise? It\'s just completing the square done once with letters instead of numbers.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cts',
      kind: 'concept',
      goal: 'Algorithm for x² + bx + c, then for ax² + bx + c, plus the geometric meaning.',
      keyIdeas: [
        'COMPLETED-SQUARE FORM: a(x − h)² + k. The graph is a parabola with vertex (turning point) at (h, k).',
        'MONIC ALGORITHM (x² + bx + c): take half of b, square it, add and subtract. x² + bx + c = (x + b/2)² − (b/2)² + c.',
        'EXAMPLE: x² + 6x + 1 = (x + 3)² − 9 + 1 = (x + 3)² − 8. Vertex at (−3, −8).',
        'NON-MONIC ALGORITHM: factor out the leading coefficient from x² and x terms first. 2x² + 8x + 5 = 2(x² + 4x) + 5 = 2[(x+2)² − 4] + 5 = 2(x+2)² − 8 + 5 = 2(x+2)² − 3.',
        'TO SOLVE a(x − h)² + k = 0: isolate (x − h)² = −k/a, take ±√, then add h. Gives EXACT roots — no decimals.',
        'EXAMPLE: x² + 6x + 1 = 0 → (x+3)² − 8 = 0 → (x+3)² = 8 → x + 3 = ±√8 = ±2√2 → x = −3 ± 2√2.',
        'GRAPH USE: vertex (h, k) tells you minimum (if a > 0) or maximum (if a < 0) value of the quadratic, plus the line of symmetry x = h.',
      ],
      vocabulary: [
        { term: 'completed-square form', definition: 'a(x − h)² + k, equivalent to ax² + bx + c, with vertex (h, k) directly readable.' },
        { term: 'turning point', definition: 'the maximum or minimum point on a parabola; coincides with the vertex.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-non-monic-cts',
      kind: 'worked_example',
      problem: 'Express 2x² − 12x + 7 in the form a(x + p)² + q. Hence find the minimum value of the expression.',
      steps: [
        'Factor 2 from the x² and x terms: 2(x² − 6x) + 7.',
        'Inside the bracket complete the square on x² − 6x: half of −6 is −3, squared is 9. So x² − 6x = (x − 3)² − 9.',
        'Substitute back: 2[(x − 3)² − 9] + 7 = 2(x − 3)² − 18 + 7 = 2(x − 3)² − 11.',
        'So a = 2, p = −3, q = −11. Form: 2(x − 3)² − 11.',
        'Minimum value: (x − 3)² is always ≥ 0, so 2(x − 3)² − 11 is minimised when (x − 3)² = 0, i.e. at x = 3.',
        'Minimum value of expression = 2·0 − 11 = −11.',
      ],
      answer: '2(x − 3)² − 11; minimum value −11 at x = 3',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve x² − 4x − 1 = 0 by completing the square. Give exact answers in surd form.',
      expectedAnswer: 'x = 2 ± √5',
      responseFormat: 'free',
      hints: [
        'Complete the square: x² − 4x = (x − 2)² − 4.',
        'Equation becomes (x − 2)² − 4 − 1 = 0 → (x − 2)² = 5.',
        'Take ±√: x − 2 = ±√5.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-sign',
      kind: 'misconception_check',
      question: 'A student writes x² + 8x + 5 = (x + 4)² + 5. What\'s wrong?',
      commonErrors: [
        {
          answer: '(x + 4)² + 5',
          misconception: 'Adding b/2 inside the bracket but forgetting to subtract (b/2)² to compensate.',
          correctsTo: 'Expand (x + 4)² = x² + 8x + 16, NOT x² + 8x. So (x + 4)² + 5 = x² + 8x + 21, not x² + 8x + 5. Correct: x² + 8x + 5 = (x + 4)² − 16 + 5 = (x + 4)² − 11. Always remember: when you create (x + b/2)², you have introduced an extra (b/2)². You must SUBTRACT it back to keep equality.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Monic: x² + bx + c = (x + b/2)² − (b/2)² + c.',
        'Non-monic: factor out a from the x²- and x-terms first.',
        'Vertex form a(x − h)² + k → vertex at (h, k); min if a > 0, max if a < 0.',
        'To solve: isolate the squared bracket, take ± square root, add h.',
        'Always verify by expanding back to standard form.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Use completing the square on ax² + bx + c = 0 (with a ≠ 0) to derive the quadratic formula.',
      hint: 'Divide by a: x² + (b/a)x + c/a = 0. Complete the square: (x + b/(2a))² − (b/(2a))² + c/a = 0. Rearrange: (x + b/(2a))² = (b² − 4ac)/(4a²). Take ±√: x + b/(2a) = ±√(b² − 4ac)/(2a). Solve: x = (−b ± √(b² − 4ac))/(2a). The discriminant b² − 4ac comes from the right-hand side of the completed square.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
