/**
 * Grades 9-10 Math — Quadratic Formula and Discriminant.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_QUADRATIC_FORMULA: LessonPlan = {
  id: 'evelyn.g910.math.quadratic.formula.v1',
  title: 'Quadratic Equations — The Quadratic Formula',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'quadratic-equations',
  locale: 'en',
  los: [
    {
      id: 'g910.math.quadratic.formula',
      description: 'Solve any quadratic equation using the quadratic formula and interpret the discriminant.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.B.4',
    },
  ],
  prerequisites: ['g910.math.quadratic.completing-square'],
  followUps: ['g910.math.quadratic.vertex-form'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The quadratic formula solves EVERY quadratic in one step.',
      script: 'You\'ve seen factoring (only works on factorable ones) and completing the square (always works but slow). The quadratic formula is what completing the square gives you when you do it on the GENERIC quadratic ax² + bx + c = 0. Memorise it once, solve everything forever.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-quadratic-formula',
      kind: 'concept',
      goal: 'Quadratic formula, discriminant interpretation, when each method is best.',
      keyIdeas: [
        'For ax² + bx + c = 0 (with a ≠ 0): x = (−b ± √(b² − 4ac)) / (2a).',
        'The expression UNDER the square root, b² − 4ac, is called the DISCRIMINANT (Δ).',
        'DISCRIMINANT cases:',
        '  Δ > 0  ⟹ TWO real roots (the parabola crosses the x-axis at two points).',
        '  Δ = 0  ⟹ ONE real root (a double root; the parabola touches the x-axis at its vertex).',
        '  Δ < 0  ⟹ NO real roots (two complex conjugate roots; the parabola doesn\'t cross the x-axis).',
        'When to use which method:',
        '  FACTORING — fastest, but only works when factors are integers and visible.',
        '  COMPLETING THE SQUARE — best when you also need the vertex form.',
        '  QUADRATIC FORMULA — universal; required when factoring doesn\'t work and you don\'t need vertex form.',
        'COMMON ERRORS: forgetting the negative on −b, splitting the formula across two lines, miscomputing b² (sign matters).',
        'DERIVATION: start from ax² + bx + c = 0 and complete the square in full generality. The formula falls out — proves the universality.',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'Δ = b² − 4ac; its sign determines whether the quadratic has 2, 1, or 0 real roots.' },
        { term: 'double root', definition: 'a root that the polynomial passes through with multiplicity 2; the parabola is tangent to the x-axis there.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve 2x² − 5x − 3 = 0 using the quadratic formula. State the number of real roots first.',
      steps: [
        'Identify a = 2, b = −5, c = −3.',
        'Compute discriminant: Δ = b² − 4ac = (−5)² − 4(2)(−3) = 25 + 24 = 49.',
        'Δ > 0 ⟹ two distinct real roots.',
        'Apply formula: x = (5 ± √49) / 4 = (5 ± 7) / 4.',
        'Two solutions: x = (5+7)/4 = 12/4 = 3, OR x = (5−7)/4 = −2/4 = −1/2.',
        'Verify: 2(3)² − 5(3) − 3 = 18 − 15 − 3 = 0 ✓; 2(1/4) + 5/2 − 3 = 1/2 + 5/2 − 3 = 0 ✓.',
      ],
      answer: 'x = 3 or x = −1/2',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Without solving, determine how many real roots x² + 4x + 7 = 0 has. Show your reasoning.',
      expectedAnswer: 'a = 1, b = 4, c = 7. Δ = 4² − 4(1)(7) = 16 − 28 = −12. Δ < 0, so no real roots (the quadratic has 2 complex conjugate roots, but no points where the parabola crosses the x-axis).',
      responseFormat: 'free',
      hints: [
        'You only need the discriminant, not the full formula.',
        'Δ = b² − 4ac. What does Δ < 0 mean?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-negative-b',
      kind: 'misconception_check',
      question: 'A student plugs b = −5 into the formula but writes the numerator as (−5 ± √Δ) instead of −(−5) ± √Δ. What goes wrong?',
      commonErrors: [
        {
          answer: 'Skips the −b leading negative',
          misconception: 'Confusing "b" (the coefficient) with "−b" (what appears in the formula).',
          correctsTo: 'The formula has −b in the numerator, not b. If b = −5, then −b = +5. The student dropped the negation, getting x = (−5 ± 7)/4 = 1/2 or −3 — the WRONG roots. The fix: write b = −5 explicitly, then compute −b = +5 step-by-step. The error rate plummets when you separate "what is b" from "what is −b."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'x = (−b ± √(b² − 4ac)) / (2a) — universal solver.',
        'Discriminant Δ = b² − 4ac decides root count: Δ > 0 → 2, Δ = 0 → 1, Δ < 0 → 0 real.',
        '−b means negate b — sign mistakes are the #1 error.',
        'Use factoring when fast, formula when not, completing-square when you need vertex form.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
