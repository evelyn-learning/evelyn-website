/**
 * G3 — Multiplication tables fluency.
 *
 * Strategies for the 2s, 5s, 10s, 9s, doubles, and the rest. Why
 * memorization frees the mind for harder problems.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_MULTIPLICATION_FLUENCY: LessonPlan = {
  id: 'evelyn.g3.math.multiplication.fluency.v1',
  title: 'Multiplication tables: strategies for fluency',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'multiplication',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.oa.c.7',
      description: 'Fluently multiply and divide within 100, using strategies, by the end of grade 3 know from memory all products of two one-digit numbers.',
      standard: 'CCSS.MATH.CONTENT.3.OA.C.7',
    },
  ],
  prerequisites: ['ccss.math.3.oa.a.1'],
  followUps: ['ccss.math.4.nbt.b.5'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why memorization matters.',
      script: 'When you read, you don\'t sound out every word — you KNOW the common ones at a glance. Math works the same way. Knowing 7 × 8 = 56 instantly frees your brain for the bigger problem.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-strategies',
      kind: 'concept',
      goal: 'Strategies for each table family.',
      keyIdeas: [
        '2s: doubles. 2×3 = 3+3 = 6. 2×7 = 7+7 = 14.',
        '5s: count by 5s. 5×4 = 5+5+5+5 = 20.',
        '10s: easiest. 10×anything = put a 0 at the end. 10×7 = 70.',
        '9s TRICK: 9×N = (N-1) tens + (10-N) ones. Example: 9×7 → tens digit 6, ones digit 3 → 63. Or: 9 finger trick.',
        'DOUBLES: 4×4 = 16, 6×6 = 36, 7×7 = 49. Useful anchors.',
        'COMMUTATIVE: A×B = B×A. So if you know 4×7, you also know 7×4. Cuts the table in HALF.',
        'ZERO and ONE: anything × 0 = 0. Anything × 1 = itself.',
        'BUILD UP: 6×7 = 6×5 + 6×2 = 30 + 12 = 42. Break the harder fact into easier ones.',
      ],
      vocabulary: [
        { term: 'product', definition: 'the answer to a multiplication problem.' },
        { term: 'commutative', definition: 'order doesn\'t matter — A × B = B × A.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-9-times',
      kind: 'worked_example',
      problem: 'Compute 9 × 6 using the 9-trick.',
      steps: [
        'For 9 × N: tens digit = N − 1; ones digit = 10 − N.',
        'N = 6: tens = 6 − 1 = 5; ones = 10 − 6 = 4.',
        'So 9 × 6 = 54.',
        'Verify: digits 5 + 4 = 9. (Multiples of 9 always have digits summing to 9.)',
      ],
      answer: '54',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-build-up',
      kind: 'worked_example',
      problem: 'Compute 7 × 8 by building up from easier facts.',
      steps: [
        '7 × 8 = 7 × 4 + 7 × 4. (Split 8 into 4+4.)',
        '7 × 4 = 28.',
        '28 + 28 = 56.',
        'So 7 × 8 = 56. (Eventually you\'ll just know it!)',
      ],
      answer: '56',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What is 6 × 7? (Use any strategy.)',
      expectedAnswer: '42',
      responseFormat: 'numeric',
      hints: [
        'Build up: 6 × 7 = 6 × 5 + 6 × 2 = 30 + 12 = ?',
        'Or: 6 × 7 = 7 × 6 (commutative). 7 × 6 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-memorize',
      kind: 'misconception_check',
      question: 'Should you ONLY memorize multiplication tables — never use strategies?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating memorization as the only path.',
          correctsTo: 'No — STRATEGIES (doubling, building up) help you understand WHY answers work and let you check yourself. Memorization comes through repeated practice with strategies. They go together.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Use strategies (2s = doubles, 9s = trick, build up).',
        'Commutative property cuts learning in half.',
        '0 × anything = 0. 1 × anything = anything.',
        'Practice → memorize. Both matter.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For 11 × 11 through 11 × 99 (single-digit by 11), there\'s a fast trick. Try 11 × 27.',
      hint: '11 × 27 = 27 with the digits 2 and 7 split, and their sum (9) inserted between them: 297. Works for two-digit times 11 if no carrying is needed.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
