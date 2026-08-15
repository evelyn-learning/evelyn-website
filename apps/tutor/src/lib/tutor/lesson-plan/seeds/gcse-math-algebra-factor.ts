/**
 * GCSE Math Higher — Algebraic Manipulation & Factorising.
 * Expanding double brackets, factorising quadratics (monic + non-monic),
 * difference of two squares, simplifying algebraic fractions.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_ALGEBRA_FACTOR: LessonPlan = {
  id: 'evelyn.gcse.math.algebra-factor.v1',
  title: 'GCSE Higher — Algebraic Manipulation & Factorising',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.algebra-factor',
      description: 'Expand binomials, factorise monic and non-monic quadratics, recognise the difference of two squares, simplify algebraic fractions.',
      standard: 'GCSE-MATH-A4/A5/A6',
    },
  ],
  prerequisites: ['gcse.math.surds-indices'],
  followUps: ['gcse.math.quadratic-complete-square'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Factorising is the gateway skill — every quadratic equation, algebraic fraction, and proof relies on it.',
      script: 'If factorising clicks, the rest of GCSE algebra falls into place. Quadratic equations? Factorise then read off roots. Simplify a fraction? Factorise top and bottom, cancel. Most students who struggle in Higher algebra struggle here first — so we\'re going to make it solid.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-factor',
      kind: 'concept',
      goal: 'Cement the four core factorising methods + a multiplication-grid mental model.',
      keyIdeas: [
        'EXPANSION (FOIL): (x + a)(x + b) = x² + (a+b)x + ab. The "outside + inside" gives the linear coefficient; "last × last" gives the constant.',
        'MONIC FACTORISING (x² + bx + c): find two numbers that multiply to c AND add to b. x² + 5x + 6 → factors of 6 that sum to 5 → 2 and 3 → (x+2)(x+3).',
        'NON-MONIC FACTORISING (ax² + bx + c, a ≠ 1): use AC method. Find two numbers that multiply to a·c and add to b. Split bx into those two pieces, then factor by grouping.',
        'DIFFERENCE OF TWO SQUARES: a² − b² = (a − b)(a + b). Spot it by: two terms, both squares, separated by minus. Examples: x² − 9 = (x−3)(x+3); 4x² − 25 = (2x−5)(2x+5).',
        'PERFECT SQUARE: x² + 2ax + a² = (x + a)². Spot it by: outer terms both squares, middle term = 2 × √(first) × √(last).',
        'ALGEBRAIC FRACTIONS: (x² − 9) / (x² + 5x + 6) — factorise top and bottom, cancel common bracket. Top = (x−3)(x+3). Bottom = (x+2)(x+3). Cancel (x+3): result = (x−3)/(x+2).',
      ],
      vocabulary: [
        { term: 'monic', definition: 'a quadratic with leading coefficient 1: x² + bx + c.' },
        { term: 'non-monic', definition: 'a quadratic with leading coefficient ≠ 1: ax² + bx + c with a ≠ 1.' },
        { term: 'difference of two squares', definition: 'an expression of the form a² − b², which always factorises to (a−b)(a+b).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-non-monic',
      kind: 'worked_example',
      problem: 'Factorise 6x² + 11x − 10.',
      steps: [
        'Compute a·c = 6 × (−10) = −60.',
        'Find two numbers that multiply to −60 and add to +11 (the b coefficient).',
        'List factor pairs of −60: (1, −60), (−1, 60), (4, −15), (−4, 15), (5, −12), (−5, 12), (3, −20), (−3, 20)…',
        'Look for sum of +11: 15 + (−4) = 11. ✓',
        'Split 11x into 15x − 4x: 6x² + 15x − 4x − 10.',
        'Factor by grouping: 3x(2x + 5) − 2(2x + 5).',
        'Common bracket (2x + 5): (2x + 5)(3x − 2).',
        'Verify by expanding: (2x + 5)(3x − 2) = 6x² − 4x + 15x − 10 = 6x² + 11x − 10. ✓',
      ],
      answer: '(2x + 5)(3x − 2)',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Factorise 9x² − 16.',
      expectedAnswer: '(3x − 4)(3x + 4)',
      responseFormat: 'free',
      hints: [
        'Two terms separated by a minus — think difference of two squares.',
        '9x² = (3x)², 16 = 4².',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sign',
      kind: 'misconception_check',
      question: 'A student factorises x² − 5x + 6 as (x − 6)(x + 1). Is this correct? If not, what went wrong?',
      commonErrors: [
        {
          answer: '(x − 6)(x + 1)',
          misconception: 'Picking factors of 6 that look right but ignoring the sign of the middle term.',
          correctsTo: 'Expand to check: (x − 6)(x + 1) = x² + x − 6x − 6 = x² − 5x − 6. The constant term should be +6, not −6. Correct factors must multiply to +6 AND sum to −5. That\'s −2 and −3 (both negative). So x² − 5x + 6 = (x − 2)(x − 3). Whenever the constant is positive, BOTH brackets share the sign of the middle term.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Monic quadratic: find two numbers that multiply to c and add to b.',
        'Non-monic: AC method — multiply to a·c, add to b, then split and group.',
        'Difference of two squares: a² − b² = (a−b)(a+b).',
        'Sign rule: if c > 0, both brackets share the sign of b. If c < 0, the brackets have opposite signs.',
        'Always verify by expanding — catches sign errors instantly.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Simplify (2x² − 8) / (x² + x − 6).',
      hint: 'Top: factor out 2 first → 2(x² − 4) → 2(x − 2)(x + 2). Bottom: factors of −6 summing to 1 are 3 and −2 → (x + 3)(x − 2). Cancel (x − 2): result = 2(x + 2)/(x + 3).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
