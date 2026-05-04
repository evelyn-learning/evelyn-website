/**
 * IB DP Math AA — Polynomial & Rational Functions.
 * Polynomial division, factor and remainder theorem, asymptotes of
 * rational functions.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_POLY_RATIONAL: LessonPlan = {
  id: 'evelyn.ibdp.aa.poly-rational.v1',
  title: 'IB DP Math AA — Polynomials & Rational Functions',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.poly-rational',
      description: 'Apply factor and remainder theorems to polynomials; sketch rational functions identifying vertical, horizontal, and oblique asymptotes.',
      standard: 'IB-DP-MATH-AA-2.7/2.13',
    },
  ],
  prerequisites: ['ibdp.aa.quadratics-deep'],
  followUps: ['ibdp.aa.trig-radians'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Polynomial and rational function questions reward systematic factor-finding plus accurate asymptote sketches.',
      script: 'Given P(x) = x³ − 4x² + x + 6, finding roots without trial-and-error means using the factor theorem: try integer factors of the constant term ±6, plug into P, look for zero. Once one root is found, polynomial division gives the rest. Today\'s drill: theorem application + clean asymptote analysis.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-poly-rational',
      kind: 'concept',
      goal: 'Factor / remainder theorems, polynomial division, asymptote rules.',
      keyIdeas: [
        'REMAINDER THEOREM: when P(x) is divided by (x − a), the remainder is P(a). Provides a fast-evaluation tool.',
        'FACTOR THEOREM: (x − a) is a factor of P(x) ⟺ P(a) = 0. Find roots by testing factors of the constant term.',
        'POLYNOMIAL DIVISION: long division algorithm. Write quotient + remainder/divisor. Used after factor theorem to break P(x) into (x − a)·Q(x) + remainder.',
        'RATIONAL FUNCTION: f(x) = P(x)/Q(x). Domain excludes zeros of Q.',
        'VERTICAL ASYMPTOTE: at zero of Q (where the denominator is 0 but numerator is non-zero). Function blows up to ±∞.',
        'HORIZONTAL ASYMPTOTE rules: compare degrees of P and Q. If deg(P) < deg(Q): y = 0. If deg(P) = deg(Q): y = (leading coefficient of P)/(leading coefficient of Q). If deg(P) > deg(Q): no horizontal — instead an oblique/curved asymptote.',
        'OBLIQUE ASYMPTOTE (deg P = deg Q + 1): perform polynomial division. Quotient (linear) is the asymptote; remainder vanishes as |x| → ∞.',
        'HOLE (removable discontinuity): if P and Q share a common factor (x − a), it cancels and a hole appears at x = a, not a vertical asymptote.',
      ],
      vocabulary: [
        { term: 'asymptote', definition: 'a line that a curve approaches but does not touch (or touches only at infinity).' },
        { term: 'factor theorem', definition: '(x − a) is a factor of P(x) iff P(a) = 0.' },
        { term: 'oblique asymptote', definition: 'a non-horizontal line y = mx + c that the curve approaches as |x| → ∞.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-factor',
      kind: 'worked_example',
      problem: 'Factor fully: P(x) = x³ − 4x² + x + 6.',
      steps: [
        'Try integer divisors of the constant 6: ±1, ±2, ±3, ±6.',
        'P(1) = 1 − 4 + 1 + 6 = 4 ≠ 0.',
        'P(−1) = −1 − 4 − 1 + 6 = 0. ✓ So (x + 1) is a factor.',
        'Divide P(x) by (x + 1) using polynomial long division: x³ − 4x² + x + 6 ÷ (x + 1) → x² − 5x + 6.',
        'Factor x² − 5x + 6 = (x − 2)(x − 3).',
        'So P(x) = (x + 1)(x − 2)(x − 3).',
        'CHECK: roots at x = −1, 2, 3. P(2) = 8 − 16 + 2 + 6 = 0 ✓. P(3) = 27 − 36 + 3 + 6 = 0 ✓.',
      ],
      answer: '(x + 1)(x − 2)(x − 3)',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the equations of any vertical and horizontal asymptotes of f(x) = (2x² + 3)/(x² − 1).',
      expectedAnswer: 'Vertical: x = 1 and x = −1. Horizontal: y = 2.',
      responseFormat: 'free',
      hints: [
        'Vertical asymptotes at zeros of denominator: x² − 1 = 0 → x = ±1.',
        'For horizontal: deg(P) = deg(Q) = 2 → ratio of leading coefficients.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-hole',
      kind: 'misconception_check',
      question: 'A student finds the vertical asymptotes of f(x) = (x² − 4)/(x − 2) by setting denominator to 0 and concludes x = 2 is a vertical asymptote. Correct?',
      commonErrors: [
        {
          answer: 'Vertical asymptote at x = 2',
          misconception: 'Treating any zero of the denominator as an asymptote, without checking for cancellation with the numerator.',
          correctsTo: 'Numerator: x² − 4 = (x − 2)(x + 2). The (x − 2) cancels with the denominator: f(x) simplifies to x + 2 for x ≠ 2. So at x = 2 there\'s a HOLE (removable discontinuity) — the curve looks like a line with a missing point — NOT a vertical asymptote. Always check for common factors first.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Remainder theorem: P(x) ÷ (x − a) gives remainder P(a).',
        'Factor theorem: (x − a) factor ⟺ P(a) = 0.',
        'Vertical asymptote: zero of Q(x) NOT shared with P(x).',
        'Horizontal asymptote rules by degree comparison.',
        'Common factor of P, Q → hole, not asymptote.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the oblique asymptote of f(x) = (x² + 3x + 2)/(x − 1).',
      hint: 'Polynomial division: (x² + 3x + 2) ÷ (x − 1). x² ÷ x = x; x·(x−1) = x² − x; subtract: 4x + 2. Then 4x ÷ x = 4; 4·(x−1) = 4x − 4; subtract: 6. So f(x) = (x + 4) + 6/(x − 1). As |x| → ∞ the 6/(x−1) → 0. Oblique asymptote: y = x + 4.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
