/**
 * G5 — Fraction operations (add/subtract unlike denominators, multiply
 * fractions, divide fractions intro).
 *
 * The first time fractions are operated on across denominators. Common
 * denominator approach for add/sub. "Multiplying fractions makes
 * smaller, not bigger" is the central misconception. Division of
 * fractions introduced via the "how many fits" framing.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_MATH_FRACTION_OPERATIONS: LessonPlan = {
  id: 'evelyn.g5.math.fraction-operations.v1',
  title: 'Fraction Operations',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.nf.a.1',
      description: 'Add and subtract fractions with unlike denominators.',
      standard: 'CCSS.MATH.CONTENT.5.NF.A.1',
    },
    {
      id: 'ccss.math.5.nf.b.4',
      description: 'Multiply a fraction by a fraction; interpret as scaling.',
      standard: 'CCSS.MATH.CONTENT.5.NF.B.4',
    },
  ],
  prerequisites: ['ccss.math.4.nf.a.1', 'ccss.math.4.nf.b.3'],
  followUps: ['ccss.math.6.ns.a.1'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why same-denominator fractions are easy and unlike are tricky.',
      script: 'Two pizzas, same size, both cut into 4 slices. You eat 1/4 of one and 2/4 of the other. Total: 3/4. Easy — same-size slices, just count. But what if one pizza was cut into 4 slices and the other into 3? Adding 1/4 + 1/3 isn\'t as simple. We need a way to make the slice sizes match.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-common-denominator',
      kind: 'concept',
      goal: 'To add or subtract unlike fractions, rewrite both with a common denominator first.',
      keyIdeas: [
        'You can ONLY add or subtract fractions when they have the SAME denominator (same-size pieces).',
        'To add unlike fractions: find a COMMON DENOMINATOR — a number that both denominators divide into.',
        'Easiest common denominator: multiply the two denominators. (Often not the smallest, but always works.)',
        'Rewrite each fraction as an equivalent fraction with the common denominator, then add the numerators.',
        'Example: 1/4 + 1/3. Common denominator: 12. 1/4 = 3/12. 1/3 = 4/12. Sum: 7/12.',
      ],
      vocabulary: [
        { term: 'common denominator', definition: 'a number both fraction denominators divide into evenly.' },
        { term: 'least common denominator', definition: 'the smallest such number — used to keep fractions simple.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-multiply-fractions',
      kind: 'concept',
      goal: 'Multiplying fractions: just multiply tops and bottoms. Often the result is SMALLER than what you started with.',
      keyIdeas: [
        'To multiply fractions: multiply numerators together, multiply denominators together. That\'s it — no common denominator needed.',
        'Example: 2/3 × 1/4 = (2 × 1) / (3 × 4) = 2/12 = 1/6.',
        'A fraction times a fraction = "a part of a part". 1/2 × 1/2 means "half of a half" = 1/4.',
        'When BOTH factors are less than 1, the product is SMALLER than either of them. Multiplying by a fraction is shrinking, not growing.',
        'When one factor is bigger than 1 (like a whole number), the product is bigger than the original fraction.',
      ],
      vocabulary: [],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-unlike-add',
      kind: 'worked_example',
      problem: 'Compute 2/5 + 1/4.',
      steps: [
        'Need a common denominator. 5 × 4 = 20. Both 5 and 4 divide into 20.',
        'Rewrite 2/5 as twentieths: multiply top and bottom by 4 → 8/20.',
        'Rewrite 1/4 as twentieths: multiply top and bottom by 5 → 5/20.',
        'Add: 8/20 + 5/20 = 13/20.',
        '13/20 doesn\'t simplify (no common factor between 13 and 20). Final answer: 13/20.',
      ],
      answer: '13/20',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-multiply',
      kind: 'worked_example',
      problem: 'Compute 3/4 × 2/5.',
      steps: [
        'Multiply numerators: 3 × 2 = 6.',
        'Multiply denominators: 4 × 5 = 20.',
        'Result: 6/20.',
        'Simplify: divide top and bottom by 2 → 3/10.',
        '3/4 × 2/5 = 3/10.',
      ],
      answer: '3/10',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute 1/3 + 1/6.',
      expectedAnswer: '1/2',
      responseFormat: 'free',
      hints: [
        '6 is already a common denominator (3 divides into 6).',
        'Rewrite 1/3 as 2/6, then add.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-tops-bottoms',
      kind: 'misconception_check',
      question: 'Liam computes 1/3 + 1/4 by adding the tops AND adding the bottoms: 2/7. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating fraction addition like multiplication — adding both numerator and denominator.',
          correctsTo: 'No. The pieces have to be the same size first. Common denominator 12: 1/3 = 4/12, 1/4 = 3/12. Sum: 7/12. Sense-check: 1/3 alone is bigger than 2/7, so 1/3 + 1/4 must be bigger than 1/3.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Add/subtract fractions: get a common denominator first. Add numerators only.',
        'Multiply fractions: multiply tops, multiply bottoms. No common denominator needed.',
        'A fraction × a fraction (both < 1) → product SMALLER than either.',
        'Always simplify the final answer if possible.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute 5/6 - 1/4.',
      hint: 'Common denominator 12. 5/6 = 10/12. 1/4 = 3/12. 10/12 - 3/12 = 7/12.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
