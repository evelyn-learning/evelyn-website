/**
 * Grades 11-12 Math — Sigma Notation and Series.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_SEQUENCES_SIGMA: LessonPlan = {
  id: 'evelyn.g1112.math.sequences.sigma.v1',
  title: 'Sequences & Series — Sigma Notation and Series Formulas',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'sequences-series',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.sequences.sigma',
      description: 'Read and write sigma notation; apply finite arithmetic, geometric, and power-sum formulas; recognise infinite geometric convergence.',
      standard: 'CCSS.MATH.CONTENT.HSA.SSE.B.4',
    },
  ],
  prerequisites: ['g11.math.algebra2.sequences-series'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Sigma notation is shorthand for "add a bunch of terms" — once read fluently, it unlocks every series formula.',
      script: 'Σ_{k=1}^{10} k² is just shorthand for "add 1² + 2² + 3² + ... + 10²." The sigma symbol tells you the variable, the start, the end, and what to add. Today we read sigma fluently and use it with the standard finite-series formulas.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sigma',
      kind: 'concept',
      goal: 'Sigma syntax, finite arithmetic + geometric sums, infinite geometric, useful sums, manipulation rules.',
      keyIdeas: [
        'SIGMA NOTATION: Σ_{k=m}^{n} f(k) means add f(m) + f(m+1) + ... + f(n).',
        '  Lower limit (k = m) — start.',
        '  Upper limit (n) — end.',
        '  Body f(k) — the term as a function of k.',
        'PROPERTIES:',
        '  Linearity: Σ (af(k) + bg(k)) = a·Σf(k) + b·Σg(k).',
        '  Constant: Σ_{k=1}^{n} c = nc.',
        '  Index shift: Σ_{k=1}^{n} f(k) = Σ_{j=0}^{n-1} f(j+1).',
        'CLASSIC FINITE SUMS:',
        '  Σ_{k=1}^{n} k = n(n+1)/2.',
        '  Σ_{k=1}^{n} k² = n(n+1)(2n+1)/6.',
        '  Σ_{k=1}^{n} k³ = [n(n+1)/2]².',
        'ARITHMETIC series sum: S_n = n(a₁ + a_n)/2 = n·a₁ + n(n−1)d/2, where d = common difference.',
        'GEOMETRIC series sum (finite): S_n = a₁(1 − rⁿ)/(1 − r) for r ≠ 1.',
        'INFINITE GEOMETRIC series: Σ_{k=0}^{∞} a·rᵏ = a/(1 − r), CONVERGES only when |r| < 1.',
        'TO RECOGNISE which formula applies: arithmetic adds the same DIFFERENCE each step; geometric multiplies by the same RATIO each step.',
      ],
      vocabulary: [
        { term: 'sigma notation', definition: 'a compact way of writing the sum of a sequence of terms; Σ from k = lower to upper of f(k).' },
        { term: 'common ratio', definition: 'in a geometric sequence, the constant ratio between consecutive terms (a₂/a₁).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Evaluate Σ_{k=1}^{20} (3k + 5).',
      steps: [
        'Use linearity: Σ (3k + 5) = 3 Σ k + Σ 5.',
        'First sum: Σ_{k=1}^{20} k = 20(21)/2 = 210.',
        'Second sum: Σ_{k=1}^{20} 5 = 20 · 5 = 100.',
        'Combine: 3 · 210 + 100 = 630 + 100 = 730.',
        'Verify by recognising as arithmetic: a₁ = 3(1) + 5 = 8; a₂₀ = 3(20) + 5 = 65; n = 20.',
        'S₂₀ = 20(8 + 65)/2 = 20 · 73 / 2 = 730 ✓.',
      ],
      answer: '730',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find Σ_{k=0}^{∞} (1/3)ᵏ.',
      expectedAnswer: 'Infinite geometric series with a = 1 (the k = 0 term: (1/3)⁰ = 1) and r = 1/3. Since |r| = 1/3 < 1, converges. Sum = a/(1 − r) = 1/(1 − 1/3) = 1/(2/3) = 3/2.',
      responseFormat: 'free',
      hints: [
        'It\'s an infinite geometric series. What\'s the formula?',
        'Identify a (first term) and r (common ratio).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-divergence',
      kind: 'misconception_check',
      question: 'A student computes Σ_{k=0}^{∞} 2ᵏ using the formula a/(1 − r) = 1/(1 − 2) = −1. Why is this nonsense?',
      commonErrors: [
        {
          answer: 'Applies the convergence formula regardless of r',
          misconception: 'Forgetting the convergence condition |r| < 1.',
          correctsTo: 'The formula a/(1 − r) ONLY applies when |r| < 1 — i.e. when the series converges. Here r = 2, so |r| > 1, and the series 1 + 2 + 4 + 8 + 16 + ... DIVERGES (grows without bound). The formula gives a meaningless number when applied outside its domain. ALWAYS check |r| < 1 before applying the infinite geometric sum formula. If |r| ≥ 1, the series diverges and there is no finite sum.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Σ from m to n adds the body for each integer k from m to n.',
        'Linearity + classic sums (Σk, Σk², Σk³) handle most polynomial summations.',
        'Arithmetic: S_n = n(a₁ + a_n)/2.',
        'Geometric finite: S_n = a₁(1 − rⁿ)/(1 − r).',
        'Geometric infinite: a/(1 − r), only when |r| < 1.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
