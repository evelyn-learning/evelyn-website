/**
 * G9 — Algebra 1: Quadratic equations intro (zero product property,
 * solve by factoring, intro to the parabola).
 *
 * The first systematic way to solve x² problems. Set the equation to
 * zero, factor, and use the zero product property: if a × b = 0, then
 * a = 0 or b = 0. Two solutions per quadratic — sometimes equal,
 * sometimes complex (covered later). Brief preview of the parabola
 * shape and how solutions relate to x-intercepts.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ALG1_QUADRATICS_INTRO: LessonPlan = {
  id: 'evelyn.g9.math.algebra.quadratics-intro.v1',
  title: 'Solving Quadratic Equations by Factoring',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'quadratics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsa.rei.b.4.b',
      description: 'Solve quadratic equations by factoring, using the zero product property.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.B.4.B',
    },
  ],
  prerequisites: ['ccss.math.hsa.sse.b.3.a'],
  followUps: ['ccss.math.hsa.rei.b.4.a'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the zero product property as the unlock.',
      script: 'I tell you that two numbers multiply to give zero. What can you say about the numbers? At least one of them HAS to be zero — there\'s no other way. That tiny observation is the key that opens up quadratic equations.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-zero-product',
      kind: 'concept',
      goal: 'Zero product property + solve-by-factoring procedure.',
      keyIdeas: [
        'A QUADRATIC EQUATION has the form ax² + bx + c = 0 (highest power 2).',
        'ZERO PRODUCT PROPERTY: if a × b = 0, then a = 0 OR b = 0 (or both). Only zero kills a product.',
        'SOLVING BY FACTORING — three steps:',
        '  1) Move everything to one side so the equation = 0.',
        '  2) FACTOR the polynomial (GCF, trinomial, difference of squares).',
        '  3) Set EACH factor equal to zero and solve those simple equations.',
        'Example: x² + 5x + 6 = 0. Factor: (x + 2)(x + 3) = 0. Either x + 2 = 0 → x = -2, or x + 3 = 0 → x = -3.',
        'Two solutions. Sometimes called ROOTS, ZEROS, or X-INTERCEPTS.',
        'GRAPH preview: y = ax² + bx + c is a U-shaped curve called a PARABOLA. The roots are where the parabola crosses the x-axis.',
      ],
      vocabulary: [
        { term: 'quadratic equation', definition: 'an equation with x² as the highest power.' },
        { term: 'zero product property', definition: 'if a × b = 0, then a = 0 or b = 0.' },
        { term: 'roots', definition: 'the values of x that make the equation true (also called zeros).' },
        { term: 'parabola', definition: 'the U-shaped graph of a quadratic.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trinomial',
      kind: 'worked_example',
      problem: 'Solve x² − 7x + 12 = 0.',
      steps: [
        'Already = 0. Good.',
        'Factor: need two numbers multiplying to 12, adding to -7. → -3 and -4.',
        '(x − 3)(x − 4) = 0.',
        'Zero product: x − 3 = 0 OR x − 4 = 0.',
        'Solve each: x = 3 or x = 4.',
        'CHECK x = 3: (3)² − 7(3) + 12 = 9 − 21 + 12 = 0. ✓',
        'CHECK x = 4: 16 − 28 + 12 = 0. ✓',
      ],
      answer: 'x = 3 or x = 4',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-set-equal',
      kind: 'worked_example',
      problem: 'Solve x² + 6x = 16.',
      steps: [
        'Move 16 to the left side: x² + 6x − 16 = 0.',
        'Factor: two numbers multiplying to -16 and adding to 6 → 8 and -2.',
        '(x + 8)(x − 2) = 0.',
        'x = -8 or x = 2.',
      ],
      answer: 'x = -8 or x = 2',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve x² − 25 = 0.',
      expectedAnswer: 'x = 5 or x = -5',
      responseFormat: 'free',
      hints: [
        'Difference of squares: factor as (x − 5)(x + 5) = 0.',
        'Zero product: each factor = 0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-divide-by-x',
      kind: 'misconception_check',
      question: 'To solve x² − 5x = 0, Hina divides both sides by x and gets x − 5 = 0 → x = 5. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Dividing by a variable that could be zero — and losing one of the two solutions.',
          correctsTo: 'You found ONE solution but lost the other. Factoring instead: x(x − 5) = 0 → x = 0 OR x = 5. Both are solutions. Dividing by x quietly assumed x ≠ 0 and threw away the x = 0 root. NEVER divide both sides by a variable in a quadratic — factor.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quadratic = ax² + bx + c.',
        'Solve by factoring: get =0 first, factor, set each factor =0.',
        'Zero product: a × b = 0 → a = 0 or b = 0.',
        'Most quadratics have TWO solutions.',
        'Never divide by a variable — you might lose a root.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve 2x² − 8x = 0.',
      hint: 'GCF 2x: 2x(x − 4) = 0. So 2x = 0 or x − 4 = 0 → x = 0 or x = 4.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
