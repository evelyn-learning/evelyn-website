/**
 * G2 — Even and odd numbers.
 *
 * Pair-up rule. Last digit rule. Why this distinction matters.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_MATH_EVEN_ODD: LessonPlan = {
  id: 'evelyn.g2.math.numbers.even-odd.v1',
  title: 'Even and odd numbers',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'math',
  topic: 'numbers',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.2.oa.c.3',
      description: 'Determine whether a group of objects (up to 20) has an odd or even number of members.',
      standard: 'CCSS.MATH.CONTENT.2.OA.C.3',
    },
  ],
  prerequisites: ['ccss.math.k.cc.b.4'],
  followUps: ['ccss.math.3.oa.d.9'],
  estimatedMinutes: 9,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a pairing example.',
      script: 'You have 8 cookies. Can you split them into 2 equal piles? Yes — 4 and 4. What about 7 cookies? No — one cookie has no partner. 8 is EVEN; 7 is ODD.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Two ways to tell + why some numbers pair up.',
      keyIdeas: [
        'EVEN numbers can be split into TWO EQUAL groups, OR each item can be paired with a partner. Examples: 2, 4, 6, 8, 10, 12.',
        'ODD numbers always have one LEFT OVER when paired. Examples: 1, 3, 5, 7, 9, 11.',
        'PATTERN: even numbers end in 0, 2, 4, 6, or 8. Odd numbers end in 1, 3, 5, 7, or 9.',
        'You can tell ANY number even/odd by looking at JUST THE LAST DIGIT.',
        'Even + Even = Even. Odd + Odd = Even. Even + Odd = Odd. (You can verify with small examples.)',
      ],
      vocabulary: [
        { term: 'even', definition: 'a number that splits evenly into two equal groups.' },
        { term: 'odd', definition: 'a number with one left over when paired.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Is 134 even or odd?',
      steps: [
        'Look at the LAST digit: 4.',
        '4 is in the even list (0, 2, 4, 6, 8).',
        'So 134 is EVEN.',
        'Don\'t need to look at the rest of the number.',
      ],
      answer: 'even',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is 67 even or odd?',
      expectedAnswer: 'odd',
      responseFormat: 'free',
      hints: [
        'Look at the LAST digit: 7.',
        '7 ends in odd category.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-look-at-all-digits',
      kind: 'misconception_check',
      question: 'For 234, do you need to add the digits to find out if it\'s even?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Adding digits like for divisibility by 3.',
          correctsTo: 'No — for EVEN/ODD, just look at the LAST digit. 234 ends in 4, so it\'s even. Digit sum is for divisibility by 3 or 9, not for even/odd.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'EVEN: splits into 2 equal groups; ends in 0, 2, 4, 6, 8.',
        'ODD: one left over; ends in 1, 3, 5, 7, 9.',
        'Just check the LAST digit.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If you add an EVEN number and an ODD number, will the result be even or odd?',
      hint: 'Try a few: 2+3=5 (odd), 6+7=13 (odd), 10+5=15 (odd). Always ODD. Even+odd is always odd.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
