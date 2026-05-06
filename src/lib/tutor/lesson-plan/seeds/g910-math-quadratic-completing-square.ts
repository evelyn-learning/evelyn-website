/**
 * Grades 9-10 Math — Quadratic Equations: Completing the Square.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_QUADRATIC_COMPLETING_SQUARE: LessonPlan = {
  id: 'evelyn.g910.math.quadratic.completing-square.v1',
  title: 'Quadratic Equations — Completing the Square',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'quadratic-equations',
  locale: 'en',
  los: [
    {
      id: 'g910.math.quadratic.completing-square',
      description: 'Solve quadratic equations by completing the square; convert standard form to vertex form.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.B.4',
    },
  ],
  prerequisites: ['g9.math.quadratics-intro'],
  followUps: ['g910.math.quadratic.formula'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Factoring fails when a quadratic has irrational roots — completing the square always works.',
      script: 'Try factoring x² + 6x − 1 = 0. You can\'t — the roots are irrational. We need a different tool. Completing the square turns ANY quadratic into a perfect square plus a constant — which we can solve directly. It\'s also the algebraic move that DERIVES the quadratic formula.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-completing-square',
      kind: 'concept',
      goal: 'Recognise perfect-square trinomials, complete the square procedurally, solve.',
      keyIdeas: [
        'A PERFECT-SQUARE TRINOMIAL has the form x² + 2bx + b² = (x + b)². The middle coefficient is twice the constant\'s square root.',
        'TO COMPLETE THE SQUARE on x² + bx + c: take half of b, square it, add and subtract that value: x² + bx + (b/2)² − (b/2)² + c.',
        'Then group: (x + b/2)² − (b/2)² + c. Now you have a perfect square plus a constant.',
        'STEPS to solve x² + bx + c = 0 by completing the square:',
        '  1. Move the constant: x² + bx = −c.',
        '  2. Add (b/2)² to BOTH sides: x² + bx + (b/2)² = (b/2)² − c.',
        '  3. Factor LHS as a perfect square: (x + b/2)² = (b/2)² − c.',
        '  4. Square root both sides (don\'t forget ±): x + b/2 = ±√[(b/2)² − c].',
        '  5. Solve for x: x = −b/2 ± √[(b/2)² − c].',
        'When the leading coefficient ≠ 1, FACTOR IT OUT first: 2x² + 8x − 3 = 0 → 2(x² + 4x) = 3 → 2(x² + 4x + 4 − 4) = 3 → 2(x+2)² − 8 = 3 → (x+2)² = 11/2.',
        'Completing the square also converts y = ax² + bx + c (standard form) to y = a(x − h)² + k (VERTEX FORM), where (h, k) is the vertex.',
      ],
      vocabulary: [
        { term: 'perfect-square trinomial', definition: 'a trinomial that factors as (x + b)² — the middle term is 2b times the square root of the constant.' },
        { term: 'vertex form', definition: 'y = a(x − h)² + k; the vertex is (h, k); obtained by completing the square on standard form.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve x² + 6x − 1 = 0 by completing the square.',
      steps: [
        'Move the constant: x² + 6x = 1.',
        'Half of 6 is 3; squared is 9. Add 9 to both sides: x² + 6x + 9 = 10.',
        'Factor LHS: (x + 3)² = 10.',
        'Square root both sides: x + 3 = ±√10.',
        'Solve: x = −3 ± √10.',
        'Decimal check: √10 ≈ 3.162, so x ≈ 0.162 or x ≈ −6.162. Plug back into original to verify.',
      ],
      answer: 'x = −3 ± √10',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve x² − 4x − 5 = 0 by completing the square.',
      expectedAnswer: 'x = 5 or x = −1. Steps: x² − 4x = 5; half of −4 squared is 4; (x − 2)² = 9; x − 2 = ±3; x = 5 or x = −1.',
      responseFormat: 'free',
      hints: [
        'Move the −5 to the right side first.',
        'Half of −4 is −2; square it to get 4.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-half-bsquared',
      kind: 'misconception_check',
      question: 'A student tries to solve x² + 8x = 3 and adds 64 (which is 8²) to both sides instead of 16. What went wrong?',
      commonErrors: [
        {
          answer: 'Adds b² instead of (b/2)²',
          misconception: 'Squaring b directly instead of HALVING first.',
          correctsTo: 'The completion target is (x + b/2)², which when expanded is x² + bx + (b/2)². So you add (b/2)², NOT b². For b = 8: (8/2)² = 16, NOT 64. Memorise: HALF then SQUARE. Easiest check: expand (x + b/2)² and confirm the constant is (b/2)² before adding to both sides.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Add (b/2)² — half then square — not b² itself.',
        'Add to BOTH sides to keep the equation balanced.',
        'Factor as a perfect square (x + b/2)², then square-root both sides with ±.',
        'For leading coefficient ≠ 1, factor it out first.',
        'Completing the square also converts to vertex form y = a(x − h)² + k.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
