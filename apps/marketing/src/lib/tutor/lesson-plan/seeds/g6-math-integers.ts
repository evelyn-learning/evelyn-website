/**
 * G6 — Integers and operations with negatives.
 *
 * First systematic exposure to negatives. Number line as the model
 * (left = negative, right = positive). Addition and subtraction with
 * negatives via "moves on the number line". Absolute value as
 * distance from zero. The "two negatives make a positive" rule for
 * multiplication, with the why.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_INTEGERS: LessonPlan = {
  id: 'evelyn.g6.math.integers.v1',
  title: 'Integers and Negative Numbers',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'integers',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.ns.c.5',
      description: 'Understand positive and negative numbers in real-world contexts.',
      standard: 'CCSS.MATH.CONTENT.6.NS.C.5',
    },
    {
      id: 'ccss.math.6.ns.c.7',
      description: 'Understand ordering and absolute value of rational numbers.',
      standard: 'CCSS.MATH.CONTENT.6.NS.C.7',
    },
  ],
  prerequisites: ['ccss.math.5.nbt.b.7'],
  followUps: ['ccss.math.7.ns.a.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor on temperature — a familiar context where below-zero is real.',
      script: 'It\'s a chilly day at -5°F outside, and overnight the temperature drops another 10°F. What\'s the new temperature? Not 5, not 15 — it\'s -15°F. Numbers can go BELOW zero, and we need rules for working with them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-number-line',
      kind: 'concept',
      goal: 'Negatives are mirror images of positives across zero. Absolute value = distance from zero.',
      keyIdeas: [
        'NUMBER LINE: zero in the middle, positives to the right (1, 2, 3…), negatives to the left (-1, -2, -3…).',
        'INTEGERS: …, -3, -2, -1, 0, 1, 2, 3, …. Whole numbers and their opposites.',
        'OPPOSITES: numbers the same distance from 0 but on different sides. -5 and +5 are opposites.',
        'ABSOLUTE VALUE: a number\'s distance from zero, ignoring direction. |−7| = 7. |3| = 3. Always positive (or zero).',
        'Comparing: a number further LEFT on the number line is SMALLER. So -10 < -3 (counterintuitive — a "bigger" negative is actually smaller).',
        'For ADDING: positive moves you right, negative moves you left.  -5 + (-10) = -15 (start at -5, move 10 left).',
        'SUBTRACTING a negative is ADDING the positive. 7 - (-3) = 7 + 3 = 10. ("Subtract a negative" = "the negative cancels.")',
      ],
      vocabulary: [
        { term: 'integer', definition: 'a whole number, positive, negative, or zero.' },
        { term: 'absolute value', definition: 'a number\'s distance from zero on the number line.' },
        { term: 'opposite', definition: 'a number the same distance from zero on the other side.' },
      ],
      suggestedTools: ['show_number_line', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-add-negatives',
      kind: 'worked_example',
      problem: 'Compute -3 + (-5).',
      steps: [
        'Use show_number_line. Start at -3.',
        'Adding -5 means moving 5 to the LEFT (negative direction).',
        '-3 → -4 → -5 → -6 → -7 → -8.',
        'Result: -8.',
      ],
      answer: '-8',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-subtract-negative',
      kind: 'worked_example',
      problem: 'Compute 4 - (-6).',
      steps: [
        'The trick: subtracting a negative becomes ADDING the positive.',
        '4 - (-6) → 4 + 6 = 10.',
        'Why? Subtraction is "remove". Removing a negative debt makes you better off.',
      ],
      answer: '10',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute -8 - 4.',
      expectedAnswer: '-12',
      responseFormat: 'numeric',
      hints: [
        'Start at -8 on the number line. Subtract 4 means move 4 to the LEFT.',
        '-8 → -9 → -10 → -11 → -12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-negative',
      kind: 'misconception_check',
      question: 'Bea says "-100 is bigger than -3 because 100 is bigger than 3." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Carrying over positive-number intuition; ignoring the sign.',
          correctsTo: 'No. On the number line, -100 is FAR to the left of -3, so it\'s SMALLER. -100 < -3. The "bigger" the negative, the smaller the number. (Think temperature: -100°F is way colder, hence smaller, than -3°F.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Number line: negatives left of zero, positives right.',
        'Absolute value = distance from zero. Always non-negative.',
        '"Subtract a negative" = "add the positive."',
        'On the number line, further left = smaller. So -10 < -3.',
        'Adding a negative moves left; adding a positive moves right.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Order from smallest to largest: -7, 3, -1, 0, -10, 5.',
      hint: 'Imagine them on the number line. Smallest = furthest left. Order: -10, -7, -1, 0, 3, 5.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
