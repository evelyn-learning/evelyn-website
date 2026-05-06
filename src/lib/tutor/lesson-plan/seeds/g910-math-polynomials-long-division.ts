/**
 * Grades 9-10 Math — Polynomial Long Division and Synthetic Division.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_POLYNOMIALS_LONG_DIVISION: LessonPlan = {
  id: 'evelyn.g910.math.polynomials.long-division.v1',
  title: 'Polynomials — Long Division and Synthetic Division',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'polynomials',
  locale: 'en',
  los: [
    {
      id: 'g910.math.polynomials.long-division',
      description: 'Divide one polynomial by another using long division and synthetic division; interpret the quotient and remainder.',
      standard: 'CCSS.MATH.CONTENT.HSA.APR.D.6',
    },
  ],
  prerequisites: ['g9.math.algebra.polynomials-intro'],
  followUps: ['g910.math.polynomials.rational-roots'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Polynomial division is just long division you already know — applied to polynomials instead of integers.',
      script: 'Divide 153 by 7 and you get 21 remainder 6. Same procedure works on polynomials: x³ − 4x² + 2x + 1 divided by (x − 2) gives a quotient and a remainder. Today we cover both classical long division AND synthetic division (a shortcut for dividing by linear factors).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-poly-division',
      kind: 'concept',
      goal: 'Long division procedure, synthetic division shortcut, division algorithm, remainder theorem.',
      keyIdeas: [
        'DIVISION ALGORITHM: dividend = (divisor)(quotient) + remainder, where deg(remainder) < deg(divisor). Same as integer division.',
        'POLYNOMIAL LONG DIVISION steps:',
        '  1. Write dividend in DESCENDING powers of x (use 0 for missing terms).',
        '  2. Divide leading term of dividend by leading term of divisor → first term of quotient.',
        '  3. Multiply divisor by that quotient term, subtract from dividend.',
        '  4. Bring down next term. Repeat.',
        '  5. Stop when remainder degree < divisor degree.',
        'SYNTHETIC DIVISION (shortcut for divisor of form x − c):',
        '  Write the coefficients of the dividend in a row.',
        '  Bring down the leading coefficient.',
        '  Multiply by c, add to next coefficient.',
        '  Repeat to the end. The last number is the remainder; the others are the quotient coefficients.',
        'REMAINDER THEOREM: when you divide P(x) by (x − c), the remainder equals P(c). Useful sanity check or shortcut.',
        'FACTOR THEOREM: (x − c) is a factor of P(x) if and only if P(c) = 0. Synthetic division with c gives remainder 0 ⟺ c is a root.',
      ],
      vocabulary: [
        { term: 'remainder theorem', definition: 'the remainder when P(x) is divided by (x − c) is P(c).' },
        { term: 'synthetic division', definition: 'a streamlined arithmetic process for dividing a polynomial by a linear (x − c) divisor.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Divide x³ − 4x² + 2x + 1 by (x − 2). Use synthetic division.',
      steps: [
        'Coefficients: 1, −4, 2, 1. Use c = 2.',
        'Bring down 1. Multiply 1 × 2 = 2. Add to −4: −2.',
        'Multiply −2 × 2 = −4. Add to 2: −2.',
        'Multiply −2 × 2 = −4. Add to 1: −3.',
        'Result row: 1, −2, −2, −3.',
        'Quotient (one degree lower): x² − 2x − 2. Remainder: −3.',
        'Final: (x³ − 4x² + 2x + 1) = (x − 2)(x² − 2x − 2) + (−3).',
        'Sanity check via remainder theorem: P(2) = 8 − 16 + 4 + 1 = −3 ✓.',
      ],
      answer: 'Quotient x² − 2x − 2, remainder −3',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Divide 2x³ + 3x² − 8x − 12 by (x + 2) using synthetic division. Then state whether (x + 2) is a factor.',
      expectedAnswer: 'c = −2 (because divisor x + 2 = x − (−2)). Coefficients: 2, 3, −8, −12. Bring down 2. 2(−2) = −4; 3 + (−4) = −1. (−1)(−2) = 2; −8 + 2 = −6. (−6)(−2) = 12; −12 + 12 = 0. Quotient: 2x² − x − 6, remainder: 0. Since remainder = 0, (x + 2) IS a factor.',
      responseFormat: 'free',
      hints: [
        'For divisor (x + 2), use c = −2 in synthetic division.',
        'A remainder of 0 means the divisor IS a factor.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-missing-term',
      kind: 'misconception_check',
      question: 'A student divides x⁴ − 1 by (x − 1) using synthetic division and writes coefficients 1, −1. What\'s missing?',
      commonErrors: [
        {
          answer: 'Skips the missing zero coefficients',
          misconception: 'Forgetting to insert 0s for missing terms before dividing.',
          correctsTo: 'x⁴ − 1 in standard form is x⁴ + 0x³ + 0x² + 0x − 1. The coefficients are 1, 0, 0, 0, −1 — five values. Skipping the zeros leaves you doing the wrong calculation entirely. ALWAYS write the polynomial out in full descending order with explicit zero coefficients before starting synthetic OR long division.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Long division: divide leading terms, multiply, subtract, bring down. Repeat.',
        'Synthetic division: shortcut for divisor (x − c). Last number = remainder.',
        'Remainder theorem: P(c) = remainder when divided by (x − c).',
        'Factor theorem: (x − c) is a factor ⟺ P(c) = 0.',
        'Always include explicit 0 coefficients for missing-degree terms.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
