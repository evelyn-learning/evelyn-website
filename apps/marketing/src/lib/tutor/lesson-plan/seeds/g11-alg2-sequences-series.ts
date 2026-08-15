/**
 * G11 — Algebra 2: Arithmetic and geometric sequences/series.
 *
 * Two patterns of "list of numbers". ARITHMETIC: add the same amount
 * each step (common difference d). GEOMETRIC: multiply by the same
 * amount (common ratio r). Closed-form formulas for the nth term and
 * the sum of the first n terms — students should have BOTH for both
 * sequence types.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_SEQUENCES_SERIES: LessonPlan = {
  id: 'evelyn.g11.math.algebra2.sequences-series.v1',
  title: 'Arithmetic and Geometric Sequences',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'sequences',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsf.bf.a.2',
      description: 'Write arithmetic and geometric sequences both recursively and with an explicit formula.',
      standard: 'CCSS.MATH.CONTENT.HSF.BF.A.2',
    },
  ],
  prerequisites: ['ccss.math.hsf.le.a.2'],
  followUps: ['ccss.math.hsa.sse.b.4'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "next-term" patterns split into two big families.',
      script: 'Quick: 5, 8, 11, 14, ... what\'s next? You\'d say 17 — adding 3 each time. Different pattern: 3, 6, 12, 24, ... next? 48 — multiplying by 2. Two completely different rhythms. Most number patterns you\'ll encounter belong to one of these families: ARITHMETIC (constant addition) or GEOMETRIC (constant multiplication).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-arithmetic-geometric',
      kind: 'concept',
      goal: 'Definitions, nth-term and sum formulas for both types.',
      keyIdeas: [
        'A SEQUENCE is an ordered list of numbers. Each is a TERM. a₁ = first term, a₂ = second, etc. aₙ = nth term.',
        'ARITHMETIC SEQUENCE: each term = previous + d. d is the COMMON DIFFERENCE.',
        '  Explicit formula: aₙ = a₁ + (n - 1) · d.',
        '  Sum of first n terms (arithmetic series): Sₙ = (n/2)(a₁ + aₙ).',
        'GEOMETRIC SEQUENCE: each term = previous × r. r is the COMMON RATIO.',
        '  Explicit formula: aₙ = a₁ · r^(n-1).',
        '  Sum of first n terms: Sₙ = a₁ · (1 - rⁿ)/(1 - r), for r ≠ 1.',
        'TEST FOR ARITHMETIC: subtract consecutive terms. If always the same, it\'s arithmetic.',
        'TEST FOR GEOMETRIC: divide consecutive terms. If always the same ratio, it\'s geometric.',
        'Some sequences are NEITHER (e.g. Fibonacci 1, 1, 2, 3, 5, 8 — neither constant difference nor constant ratio).',
      ],
      vocabulary: [
        { term: 'common difference', definition: 'the constant added between terms in an arithmetic sequence.' },
        { term: 'common ratio', definition: 'the constant multiplied between terms in a geometric sequence.' },
        { term: 'series', definition: 'the sum of the terms of a sequence.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-arithmetic',
      kind: 'worked_example',
      problem: 'Find the 20th term of the arithmetic sequence 4, 9, 14, 19, ...',
      steps: [
        'Identify a₁ = 4, d = 9 - 4 = 5.',
        'Apply formula: aₙ = a₁ + (n - 1)d.',
        'a₂₀ = 4 + (20 - 1)(5) = 4 + 19 · 5 = 4 + 95 = 99.',
      ],
      answer: '99',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-geometric',
      kind: 'worked_example',
      problem: 'Find the 8th term of the geometric sequence 3, 6, 12, 24, ...',
      steps: [
        'a₁ = 3, r = 6/3 = 2.',
        'Apply: aₙ = a₁ · r^(n-1).',
        'a₈ = 3 · 2⁷ = 3 · 128 = 384.',
      ],
      answer: '384',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sum',
      kind: 'worked_example',
      problem: 'Find the sum of the first 10 terms of the arithmetic sequence 2, 5, 8, 11, ...',
      steps: [
        'a₁ = 2, d = 3.',
        'Find a₁₀: a₁₀ = 2 + 9(3) = 29.',
        'Sum formula: S₁₀ = (10/2)(a₁ + a₁₀) = 5 · (2 + 29) = 5 · 31 = 155.',
      ],
      answer: '155',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the 6th term of the geometric sequence 5, 10, 20, 40, ...',
      expectedAnswer: '160',
      responseFormat: 'numeric',
      hints: [
        'r = 2, a₁ = 5.',
        'a₆ = 5 · 2⁵ = 5 · 32.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-off-by-one',
      kind: 'misconception_check',
      question: 'For the arithmetic sequence 7, 11, 15, ..., Owen finds the 5th term as 7 + 5 · 4 = 27. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Multiplying d by n instead of (n - 1).',
          correctsTo: 'The formula uses (n - 1), not n. The first term has 0 jumps of d, the second has 1, etc. So the 5th term is 7 + (5 - 1)(4) = 7 + 16 = 23. Owen\'s answer is one full step too high — a classic off-by-one error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Arithmetic: aₙ = a₁ + (n - 1)d. Constant difference.',
        'Geometric: aₙ = a₁ · r^(n-1). Constant ratio.',
        'Off-by-one: the formula uses (n - 1), not n.',
        'Sum (arithmetic): Sₙ = (n/2)(a₁ + aₙ).',
        'Sum (geometric): Sₙ = a₁(1 - rⁿ)/(1 - r), r ≠ 1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A geometric sequence has first term 4 and 6th term 972. Find r.',
      hint: 'a₆ = a₁ · r⁵ = 972. So 4r⁵ = 972 → r⁵ = 243 → r = 3 (since 3⁵ = 243).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
