/**
 * G4 — Mixed numbers and improper fractions.
 *
 * Convert between mixed (1 1/2) and improper (3/2). Add and subtract
 * with same denominators.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_MIXED_NUMBERS: LessonPlan = {
  id: 'evelyn.g4.math.fractions.mixed-numbers.v1',
  title: 'Mixed numbers and improper fractions',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.nf.b.3.c',
      description: 'Add and subtract mixed numbers with like denominators.',
      standard: 'CCSS.MATH.CONTENT.4.NF.B.3.C',
    },
  ],
  prerequisites: ['ccss.math.3.nf.a.1'],
  followUps: ['ccss.math.5.nf.a.1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a pizza example.',
      script: 'You ate one whole pizza and a half of another. How much pizza? You could say 3/2 pizzas. Or 1 1/2 pizzas. Both are right. Today we\'ll switch between them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-conversions',
      kind: 'concept',
      goal: 'Definitions + two-way conversion.',
      keyIdeas: [
        'PROPER FRACTION: numerator < denominator. Examples: 1/2, 3/4, 5/8.',
        'IMPROPER FRACTION: numerator ≥ denominator. Examples: 5/3, 7/4, 11/8.',
        'MIXED NUMBER: a whole number AND a fraction together. Examples: 1 1/2, 2 3/4.',
        'IMPROPER → MIXED: divide numerator by denominator. Quotient = whole number. Remainder over original denominator = fraction.',
        '   Example: 11/4. 11 ÷ 4 = 2 remainder 3. So 11/4 = 2 3/4.',
        'MIXED → IMPROPER: (whole × denominator + numerator) over denominator.',
        '   Example: 2 3/4. (2 × 4 + 3)/4 = 11/4.',
        'When ADDING mixed numbers, you can either: convert to improper, add, convert back. Or add wholes and fractions separately and recombine.',
      ],
      vocabulary: [
        { term: 'mixed number', definition: 'a whole number combined with a proper fraction.' },
        { term: 'improper fraction', definition: 'a fraction where numerator ≥ denominator.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-improper-to-mixed',
      kind: 'worked_example',
      problem: 'Convert 13/5 to a mixed number.',
      steps: [
        'Divide: 13 ÷ 5 = 2 remainder 3.',
        'Whole number: 2.',
        'Remainder over original denom: 3/5.',
        'Mixed number: 2 3/5.',
      ],
      answer: '2 3/5',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-mixed-to-improper',
      kind: 'worked_example',
      problem: 'Convert 3 2/7 to an improper fraction.',
      steps: [
        'Multiply whole × denominator: 3 × 7 = 21.',
        'Add numerator: 21 + 2 = 23.',
        'Place over original denominator: 23/7.',
      ],
      answer: '23/7',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Convert 17/4 to a mixed number.',
      expectedAnswer: '4 1/4',
      responseFormat: 'free',
      hints: [
        '17 ÷ 4 = ? remainder ?',
        'Whole + remainder/4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-wholes-only',
      kind: 'misconception_check',
      question: 'When adding 1 1/2 + 2 3/4, can you just add the wholes (1+2=3) and ignore fractions?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating fractions as ignorable.',
          correctsTo: 'No — you have to add the fractional parts too. 1/2 + 3/4 = 2/4 + 3/4 = 5/4 = 1 1/4. Combined with whole 3 → 4 1/4. Always handle BOTH parts.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Improper → Mixed: divide; quotient = whole, remainder = numerator.',
        'Mixed → Improper: (whole × denom + numer)/denom.',
        'When adding mixed numbers, watch for fractional parts that exceed 1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Subtract: 4 1/3 − 1 2/3. Why does this need "borrowing"?',
      hint: '1/3 < 2/3, so you can\'t subtract straight. Borrow 1 from the 4: 4 1/3 = 3 4/3. Now: 3 4/3 − 1 2/3 = 2 2/3.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
