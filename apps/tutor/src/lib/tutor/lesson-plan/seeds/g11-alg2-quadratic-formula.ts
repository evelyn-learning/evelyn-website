/**
 * G11 — Algebra 2: Quadratic formula and the discriminant.
 *
 * The general-purpose tool that solves ANY quadratic ax² + bx + c = 0
 * even when factoring fails or is ugly. The discriminant b² - 4ac
 * tells you WITHOUT solving how many real roots exist (positive: 2,
 * zero: 1, negative: 0 real / 2 complex).
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_QUADRATIC_FORMULA: LessonPlan = {
  id: 'evelyn.g11.math.algebra2.quadratic-formula.v1',
  title: 'The Quadratic Formula and Discriminant',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'quadratics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsa.rei.b.4.b',
      description: 'Solve quadratic equations by inspection, factoring, completing the square, and the quadratic formula.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.B.4.B',
    },
  ],
  prerequisites: ['ccss.math.hsa.rei.b.4'],
  followUps: ['ccss.math.hsn.cn.c.7'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that factoring fails on most quadratics — and motivate the universal tool.',
      script: 'Try to factor x² - 4x + 1 = 0. There\'s no pair of nice integers that multiplies to 1 and adds to -4. So is the equation unsolvable? No — there\'s a single formula that solves EVERY quadratic, no matter how ugly. It\'s the most-used formula in all of high school math.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-formula-and-discriminant',
      kind: 'concept',
      goal: 'The formula itself + the discriminant\'s three cases.',
      keyIdeas: [
        'For ANY quadratic ax² + bx + c = 0 (with a ≠ 0):',
        '  x = (-b ± √(b² - 4ac)) / 2a',
        'The ± symbol gives you BOTH roots in one expression.',
        'STEP 1 — get the equation into standard form ax² + bx + c = 0. Identify a, b, c.',
        'STEP 2 — compute the DISCRIMINANT: D = b² - 4ac. (The bit under the square root.)',
        'STEP 3 — three cases based on D:',
        '  D > 0: TWO distinct real roots.',
        '  D = 0: ONE repeated real root (the parabola just touches the x-axis).',
        '  D < 0: NO real roots — two COMPLEX roots involving i.',
        'STEP 4 — plug into the formula and simplify.',
        'Sign matters: a, b, c can be negative. Handle the signs carefully.',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'b² - 4ac — tells how many real solutions a quadratic has.' },
        { term: 'quadratic formula', definition: 'x = (-b ± √(b² - 4ac)) / 2a — solves any quadratic.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-clean',
      kind: 'worked_example',
      problem: 'Solve x² - 4x + 1 = 0 using the quadratic formula.',
      steps: [
        'Identify: a = 1, b = -4, c = 1.',
        'Discriminant: b² - 4ac = (-4)² - 4(1)(1) = 16 - 4 = 12. Positive → two real roots.',
        'Formula: x = (-(-4) ± √12) / 2(1) = (4 ± √12) / 2.',
        'Simplify √12 = 2√3.',
        'x = (4 ± 2√3) / 2 = 2 ± √3.',
        'Two roots: x = 2 + √3 ≈ 3.73 and x = 2 - √3 ≈ 0.27.',
      ],
      answer: 'x = 2 ± √3',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-discriminant',
      kind: 'worked_example',
      problem: 'How many real roots does 2x² + 3x + 5 = 0 have? Use the discriminant.',
      steps: [
        'a = 2, b = 3, c = 5.',
        'D = b² - 4ac = 9 - 40 = -31.',
        'D < 0 → NO real roots. The equation has two complex roots involving i.',
        'No need to compute the roots themselves to answer the question.',
      ],
      answer: '0 real roots (D < 0)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve x² + 6x - 7 = 0.',
      expectedAnswer: 'x = 1 or x = -7',
      responseFormat: 'free',
      hints: [
        'a = 1, b = 6, c = -7.',
        'D = 36 + 28 = 64. √64 = 8.',
        'x = (-6 ± 8) / 2.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sign',
      kind: 'misconception_check',
      question: 'Solving x² - 5x + 6 = 0, Asha writes x = (-5 ± √(25 - 24)) / 2 = (-5 ± 1) / 2 = -2 or -3. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Forgetting that b in the formula is -5 here, so -b = +5 (not -5).',
          correctsTo: 'b = -5, so -b = +5. The numerator is (5 ± 1)/2 = 3 or 2. The actual roots are x = 3 and x = 2 (you can check by factoring as (x-2)(x-3) = 0). The sign on b in the formula always reverses.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'x = (-b ± √(b² - 4ac)) / 2a — works for every quadratic.',
        'Discriminant D = b² - 4ac. Positive → 2 real roots, 0 → 1 repeated, negative → 2 complex.',
        'Always rewrite to standard form ax² + bx + c = 0 first.',
        'Watch the sign on -b — it\'s the OPPOSITE of whatever b\'s sign was in the equation.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For what value of k does x² + kx + 9 = 0 have exactly ONE real root?',
      hint: 'D = 0 condition. k² - 4(1)(9) = 0 → k² = 36 → k = ±6.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
