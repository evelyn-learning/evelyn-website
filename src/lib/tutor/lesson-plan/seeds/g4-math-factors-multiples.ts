/**
 * G4 — Factors and multiples (and prime/composite).
 *
 * Two related ways of looking at a number — what divides INTO it
 * (factors) vs. what it divides EVENLY into others (multiples).
 * Foundation for prime numbers, simplifying fractions, and finding
 * common denominators later.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_FACTORS_MULTIPLES: LessonPlan = {
  id: 'evelyn.g4.math.factors-multiples.v1',
  title: 'Factors, Multiples, and Primes',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'number-theory',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.oa.b.4',
      description: 'Find all factor pairs for a whole number 1-100; recognize prime / composite numbers.',
      standard: 'CCSS.MATH.CONTENT.4.OA.B.4',
    },
  ],
  prerequisites: ['ccss.math.3.oa.a.1', 'ccss.math.3.oa.b.6'],
  followUps: ['ccss.math.6.ns.b.4'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a real "fits-or-doesn\'t" game — arranging dots into rectangles — to introduce factors.',
      script: '12 dots. Can you arrange them into a perfect rectangle? Try 3 rows of 4 — yes. Try 2 rows of 6 — yes. Try 5 rows? You\'d have 2 left over — no rectangle. The numbers that DO work — 1, 2, 3, 4, 6, 12 — are 12\'s factors.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-factors-and-multiples',
      kind: 'concept',
      goal: 'Factors divide INTO a number; multiples are what you GET by multiplying.',
      keyIdeas: [
        'A FACTOR of a number divides into it evenly — no remainder.',
        'Factors of 12: 1, 2, 3, 4, 6, 12. Each one fits into 12 a whole number of times.',
        'Factors come in PAIRS: 1 × 12, 2 × 6, 3 × 4. Pairs always multiply to give the number.',
        'A MULTIPLE of a number is what you get when you multiply that number by 1, 2, 3, …',
        'Multiples of 4: 4, 8, 12, 16, 20, 24… (an endless list).',
        'Watch the swap: 4 is a FACTOR of 12; 12 is a MULTIPLE of 4. Same relationship, two viewpoints.',
        'A PRIME number has exactly 2 factors: 1 and itself. (Examples: 2, 3, 5, 7, 11.)',
        'A COMPOSITE number has more than 2 factors. (Examples: 4, 6, 8, 9, 10.)',
        '1 is special — it has only ONE factor (itself), so it\'s neither prime nor composite.',
      ],
      vocabulary: [
        { term: 'factor', definition: 'a number that divides evenly into another number.' },
        { term: 'multiple', definition: 'the result of multiplying a number by an integer.' },
        { term: 'prime', definition: 'a number with exactly two factors: 1 and itself.' },
        { term: 'composite', definition: 'a number with more than two factors.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-factors-of-24',
      kind: 'worked_example',
      problem: 'Find all factors of 24.',
      steps: [
        'Start at 1 and walk up. Does each one divide 24 evenly? If yes, write it AND its partner.',
        '1 × 24 = 24. So 1 and 24 are factors.',
        '2 × 12 = 24. So 2 and 12 are factors.',
        '3 × 8 = 24. So 3 and 8 are factors.',
        '4 × 6 = 24. So 4 and 6 are factors.',
        '5? 24 ÷ 5 = 4 R 4 — not even. Skip.',
        '6 we already have. We\'ve met in the middle — done.',
        'All factors: 1, 2, 3, 4, 6, 8, 12, 24.',
      ],
      answer: '1, 2, 3, 4, 6, 8, 12, 24',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is 17 prime or composite?',
      expectedAnswer: 'prime',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Prime', correct: true },
        { id: 'b', text: 'Composite' },
      ],
      hints: [
        'Try dividing 17 by 2, 3, 4, 5… anything fit evenly?',
        '17 ÷ 2 has a remainder. Same for 3, 4, 5. So 17\'s only factors are 1 and 17.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-1-prime',
      kind: 'misconception_check',
      question: 'Lupe says "1 is prime because it can\'t be divided by anything but itself." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating "few factors" with "prime".',
          correctsTo: 'No. Prime means EXACTLY 2 different factors: 1 and itself. 1 only has ONE factor (itself), so it doesn\'t count. 1 is neither prime nor composite — it\'s a special case.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Factor: divides evenly into a number. Multiple: comes out of multiplying it.',
        'Factors come in pairs that multiply to the number.',
        'Prime: exactly 2 factors (1 and itself). Composite: more than 2.',
        '1 is neither prime nor composite.',
        'Same relationship from two angles: 4 is a factor of 12; 12 is a multiple of 4.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'List the first six multiples of 7. Then say which of them are prime.',
      hint: '7, 14, 21, 28, 35, 42. Of these, only 7 itself is prime — the rest are multiples of 7 AND something else.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
