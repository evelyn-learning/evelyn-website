/**
 * G3 — Rounding to nearest 10 and 100.
 *
 * Number-line approach + the digit-checking shortcut. Foundation for
 * estimation in later grades.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_ROUNDING: LessonPlan = {
  id: 'evelyn.g3.math.numbers.rounding.v1',
  title: 'Rounding to nearest 10 and 100',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'numbers',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.nbt.a.1',
      description: 'Use place value understanding to round whole numbers to the nearest 10 or 100.',
      standard: 'CCSS.MATH.CONTENT.3.NBT.A.1',
    },
  ],
  prerequisites: ['ccss.math.2.nbt.a.1'],
  followUps: ['ccss.math.4.nbt.a.3'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show rounding makes mental math easier.',
      script: 'A book costs $19 and a toy costs $32. About how much together? Easier if we use $20 and $30 — about $50. That\'s rounding in real life.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nearest',
      kind: 'concept',
      goal: 'Rounding finds the nearest 10, 100, etc., on the number line.',
      keyIdeas: [
        'To ROUND to the nearest 10: find which two MULTIPLES OF 10 the number is between, and pick the closer one.',
        'EXAMPLE: 47 is between 40 and 50. It\'s closer to 50, so it rounds to 50.',
        'SHORTCUT: look at the digit to the RIGHT of the place you\'re rounding to. If it\'s 5 or more, round UP. If it\'s 4 or less, round DOWN.',
        '47 → ones digit is 7 → round UP to 50. 23 → ones digit is 3 → round DOWN to 20.',
        'For nearest 100: look at the TENS digit. 247 → tens is 4 → round DOWN to 200. 271 → tens is 7 → round UP to 300.',
        'Special case: 5 ALWAYS rounds UP in elementary math (so 25 → 30, not 20).',
      ],
      vocabulary: [
        { term: 'round', definition: 'change a number to a nearby easier number, like the closest 10 or 100.' },
        { term: 'multiple of 10', definition: 'a number you can reach by counting by tens — 10, 20, 30, 40…' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-47',
      kind: 'worked_example',
      problem: 'Round 47 to the nearest 10.',
      steps: [
        '47 is between 40 and 50.',
        'Look at the ones digit: 7.',
        '7 is greater than 5, so round UP.',
        '47 rounds to 50.',
      ],
      answer: '50',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-271',
      kind: 'worked_example',
      problem: 'Round 271 to the nearest 100.',
      steps: [
        '271 is between 200 and 300.',
        'Look at the tens digit: 7.',
        '7 is 5 or more, so round UP.',
        '271 rounds to 300.',
      ],
      answer: '300',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Round 83 to the nearest 10.',
      expectedAnswer: '80',
      responseFormat: 'numeric',
      hints: [
        '83 is between 80 and 90.',
        'Ones digit is 3 — round up or down?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-round-far',
      kind: 'misconception_check',
      question: 'When rounding 273 to the nearest 100, do you look at the ONES digit (3)?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Always looking at the ones digit.',
          correctsTo: 'No — you look at the digit just to the RIGHT of the place you\'re rounding to. For nearest 100, look at the TENS digit (7), not ones. 7 ≥ 5 → 273 rounds to 300.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Round to the nearest 10: look at ONES digit. 5 or more → up.',
        'Round to the nearest 100: look at TENS digit. 5 or more → up.',
        '5 always rounds UP.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is rounding USEFUL? Give one example where rounding helps you in real life.',
      hint: 'Estimating costs, large populations, distances, time… anywhere we don\'t need the exact number.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
