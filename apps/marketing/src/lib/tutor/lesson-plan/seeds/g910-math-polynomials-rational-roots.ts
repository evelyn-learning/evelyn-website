/**
 * Grades 9-10 Math — Polynomials: Rational Roots Theorem.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_POLYNOMIALS_RATIONAL_ROOTS: LessonPlan = {
  id: 'evelyn.g910.math.polynomials.rational-roots.v1',
  title: 'Polynomials — Rational Roots Theorem',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'polynomials',
  locale: 'en',
  los: [
    {
      id: 'g910.math.polynomials.rational-roots',
      description: 'Apply the Rational Roots Theorem to list candidate rational roots of a polynomial and use synthetic division to identify actual roots.',
      standard: 'CCSS.MATH.CONTENT.HSN.CN.C.9',
    },
  ],
  prerequisites: ['g910.math.polynomials.long-division'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'How do you find roots of a cubic or quartic? Rational Roots Theorem narrows the search to a finite list.',
      script: 'A polynomial of degree 3 has 3 roots, but they could be anywhere on the number line. Without help, you\'d be guessing. The Rational Roots Theorem gives you a SHORT LIST of possible rational roots — usually 4-12 candidates. Test each with synthetic division; the actual roots fall out.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rrt',
      kind: 'concept',
      goal: 'The theorem, applying it, combining with synthetic division to factor.',
      keyIdeas: [
        'RATIONAL ROOTS THEOREM: if P(x) = aₙxⁿ + ... + a₁x + a₀ has integer coefficients, then any RATIONAL root has the form p/q where p divides a₀ (the constant term) and q divides aₙ (the leading coefficient).',
        'STEPS to use:',
        '  1. List p = factors of |a₀| (constant term). Include both ± signs.',
        '  2. List q = factors of |aₙ| (leading coefficient).',
        '  3. Form all candidate rationals ±p/q (reduce duplicates).',
        '  4. Test each via synthetic division (or P(c) eval). Hits where P(c) = 0 ARE roots.',
        '  5. Each found root reduces the polynomial degree by 1; repeat on the quotient until you can use quadratic formula.',
        'EXAMPLE: P(x) = 2x³ − 3x² − 8x + 12. a₀ = 12, factors: 1, 2, 3, 4, 6, 12. aₙ = 2, factors: 1, 2. Candidates: ±{1, 2, 3, 4, 6, 12, 1/2, 3/2}.',
        'CAVEAT: the theorem only catches RATIONAL roots. If the polynomial has irrational or complex roots only, you\'ll find no candidates that work — fall back on numerical methods or factoring strategy.',
        'IF the leading coefficient is 1, q = 1 always, so candidates are just ± factors of the constant term — much shorter list.',
        'AFTER finding roots: the polynomial factors as P(x) = aₙ(x − r₁)(x − r₂)...(x − rₙ). Useful for sketching graphs and solving inequalities.',
      ],
      vocabulary: [
        { term: 'Rational Roots Theorem', definition: 'a result narrowing rational roots of an integer-coefficient polynomial to ±(factors of constant) / (factors of leading coefficient).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Find all roots of P(x) = x³ − 4x² + x + 6.',
      steps: [
        'a₀ = 6, factors: 1, 2, 3, 6. aₙ = 1, factors: 1. Candidates: ±{1, 2, 3, 6}.',
        'Test x = 1: P(1) = 1 − 4 + 1 + 6 = 4. ✗',
        'Test x = −1: P(−1) = −1 − 4 − 1 + 6 = 0. ✓ ROOT.',
        'Synthetic division by (x + 1) using c = −1: coefficients 1, −4, 1, 6 → 1, −5, 6, 0. Quotient: x² − 5x + 6.',
        'Factor x² − 5x + 6 = (x − 2)(x − 3). Roots: x = 2, x = 3.',
        'All roots: x = −1, 2, 3. Factored form: P(x) = (x + 1)(x − 2)(x − 3).',
        'Verify: P(2) = 8 − 16 + 2 + 6 = 0 ✓. P(3) = 27 − 36 + 3 + 6 = 0 ✓.',
      ],
      answer: 'Roots: −1, 2, 3. Factored: (x + 1)(x − 2)(x − 3).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'List all rational root candidates for P(x) = 3x³ + 2x² − 7x + 2. (Don\'t test them yet — just list candidates.)',
      expectedAnswer: 'a₀ = 2, factors: 1, 2. aₙ = 3, factors: 1, 3. Candidates: ±p/q = ±{1, 2, 1/3, 2/3}. Eight candidates total (with both signs).',
      responseFormat: 'free',
      hints: [
        'p = factors of constant term (2).',
        'q = factors of leading coefficient (3).',
        'Form ±p/q for all combinations.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-irrational-roots',
      kind: 'misconception_check',
      question: 'A student tests every candidate from the Rational Roots Theorem, finds none of them work, and concludes the polynomial has no roots. What\'s wrong?',
      commonErrors: [
        {
          answer: 'No rational candidates work → no roots',
          misconception: 'Confusing "no rational roots" with "no roots at all."',
          correctsTo: 'The theorem only says: IF a root is rational, it\'s in this list. It does NOT say all roots are rational. A polynomial like x² − 2 has roots ±√2 (irrational) — the theorem\'s candidates are ±1, ±2, none of which work, but the polynomial still has roots. After exhausting rational candidates, fall back on: completing the square, quadratic formula on the remaining quadratic factor, or numerical methods. Every degree-n polynomial has exactly n complex roots (Fundamental Theorem of Algebra) — but they need not be rational.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rational roots = ±(factors of a₀) / (factors of aₙ).',
        'List candidates, test via synthetic division.',
        'Each found root reduces degree by 1; recurse.',
        'No rational candidates work ≠ no roots — irrational/complex roots exist.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
