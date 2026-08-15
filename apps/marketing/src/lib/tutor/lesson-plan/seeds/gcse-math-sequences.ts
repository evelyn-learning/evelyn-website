/**
 * GCSE Math Higher — Sequences: nth Term, Geometric, Quadratic.
 * Linear sequences (already familiar), geometric sequences (common ratio),
 * quadratic sequences (second difference method).
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_SEQUENCES: LessonPlan = {
  id: 'evelyn.gcse.math.sequences.v1',
  title: 'GCSE Higher — Sequences (Linear, Quadratic, Geometric)',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.sequences',
      description: 'Find the nth term for linear, quadratic, and geometric sequences; use the nth-term formula to predict any term.',
      standard: 'GCSE-MATH-A23/A24/A25',
    },
  ],
  prerequisites: ['gcse.math.algebra-factor'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A reliable nth-term formula lets you find the 100th term as easily as the 5th — a huge leap from listing.',
      script: 'Most students can find the next term in a sequence by inspection. Higher GCSE asks: find the 200th term. Listing is hopeless; you need a closed-form rule. Three sequence types appear on the paper, and each has a clean recipe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'Three nth-term recipes (linear, quadratic, geometric) and how to identify which fits.',
      keyIdeas: [
        'LINEAR (arithmetic) sequence: constant first difference d. nth term = dn + (a₁ − d). Example: 5, 8, 11, 14, … d = 3, a₁ = 5 → nth term = 3n + 2.',
        'QUADRATIC sequence: constant SECOND difference. If second difference = 2a, then the n² coefficient is a. Example: 4, 9, 16, 25, … differences 5, 7, 9, 11; second difference = 2 → a = 1 → start with n². Compare n²: 1, 4, 9, 16; original − n² gives 3, 5, 7, 9 → linear with nth term 2n + 1. So full nth term = n² + 2n + 1.',
        'QUADRATIC ALGORITHM: (1) compute second differences; (2) leading coefficient a = (second difference)/2; (3) subtract an² from the sequence; (4) the residual is a linear sequence — find its nth term as bn + c.',
        'GEOMETRIC sequence: each term = previous × constant ratio r. nth term = a₁ · r^(n−1). Example: 3, 6, 12, 24, … r = 2 → nth term = 3·2^(n−1).',
        'IDENTIFICATION TEST: first differences constant → linear. Second differences constant → quadratic. Constant RATIO of consecutive terms → geometric.',
        'FIBONACCI-style: each term = sum of two previous (1, 1, 2, 3, 5, 8, …). Not a standard nth-term type at GCSE — recurrence relation only.',
      ],
      vocabulary: [
        { term: 'common difference', definition: 'the constant gap d between consecutive terms in a linear sequence.' },
        { term: 'common ratio', definition: 'the constant multiplier r between consecutive terms in a geometric sequence.' },
        { term: 'second difference', definition: 'the difference between consecutive first differences; constant in a quadratic sequence.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-quadratic',
      kind: 'worked_example',
      problem: 'Find the nth term of: 3, 8, 15, 24, 35, …',
      steps: [
        'First differences: 8 − 3 = 5; 15 − 8 = 7; 24 − 15 = 9; 35 − 24 = 11. Sequence of differences: 5, 7, 9, 11.',
        'Second differences: 7 − 5 = 2; 9 − 7 = 2; 11 − 9 = 2. Constant 2 → quadratic sequence.',
        'Leading coefficient a = (second difference)/2 = 2/2 = 1. So the n² part is 1·n² = n².',
        'Subtract n² from the original: term 1: 3 − 1 = 2. Term 2: 8 − 4 = 4. Term 3: 15 − 9 = 6. Term 4: 24 − 16 = 8. Residual: 2, 4, 6, 8 …',
        'Residual is a linear sequence with d = 2, starts at 2 → nth term = 2n.',
        'Combine: nth term = n² + 2n.',
        'Verify with term 5: 5² + 2·5 = 25 + 10 = 35. ✓',
      ],
      answer: 'n² + 2n',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A geometric sequence has first term 5 and common ratio 3. Find the 6th term.',
      expectedAnswer: '1215',
      responseFormat: 'numeric',
      hints: [
        'Use nth term = a₁ · r^(n−1).',
        '6th term = 5 · 3^(6−1) = 5 · 3⁵.',
        '3⁵ = 243.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-quadratic',
      kind: 'misconception_check',
      question: 'A student finds the nth term of 2, 6, 12, 20, 30 by computing first differences (4, 6, 8, 10) and writing nth term = 4n + something. What\'s wrong?',
      commonErrors: [
        {
          answer: 'Treating it as a linear sequence with d = 4',
          misconception: 'Stopping at first differences without checking if they are constant.',
          correctsTo: 'The first differences are 4, 6, 8, 10 — NOT constant. Compute SECOND differences: 2, 2, 2 — constant! This is a quadratic sequence. Leading coefficient = 2/2 = 1, so n² part is n². Residual: 2−1=1, 6−4=2, 12−9=3, 20−16=4, 30−25=5 → linear nth term n. Combined: n² + n. Always check second differences before concluding linear.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Linear: constant first diff d → nth = dn + (a₁ − d).',
        'Quadratic: constant second diff 2a → start with an², subtract, fit linear residual.',
        'Geometric: constant ratio r → nth = a₁ · r^(n−1).',
        'Always test by plugging n = 1, 2, 3 back into your formula.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A geometric sequence has 3rd term 12 and 5th term 48. Find the first term and common ratio.',
      hint: 'Term 5 / term 3 = r² = 48/12 = 4 → r = ±2 (Higher accepts both, often expects positive). With r = 2: term 3 = a₁·r² = 4a₁ = 12 → a₁ = 3. Sequence: 3, 6, 12, 24, 48.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
