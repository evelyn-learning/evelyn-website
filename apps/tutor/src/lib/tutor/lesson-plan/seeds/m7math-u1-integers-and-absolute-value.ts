/**
 * Grade 7 Math — Rational Numbers: Integers & Absolute Value.
 *
 * The number line as a model students can point at (CCSS 7.NS.A.1): what a
 * negative number means in the world, what opposites are, and absolute value
 * as DISTANCE rather than "make it positive" — the misconception that breaks
 * every later signed-arithmetic lesson.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U1_INTEGERS_AND_ABSOLUTE_VALUE: LessonPlan = {
  id: 'evelyn.ms.m7math.integers-and-absolute-value.v1',
  title: 'Integers & Absolute Value',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.integers-and-absolute-value',
      standard: 'M7MATH-1.1',
      description:
        'Place positive and negative integers on a number line, identify opposites, and interpret absolute value as the distance a number sits from zero (CCSS 7.NS.A.1, 6.NS.C.7).',
    },
  ],
  prerequisites: [],
  followUps: ['m7math.rational-numbers-on-the-number-line'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor negative numbers in something the student already pictures without effort.',
      script:
        'Picture an elevator in a tall building. The lobby is floor zero. Press 3 and you go up three floors. Press B2 and you go down two. Nobody is confused by B2 — it just means two floors below the lobby. That is exactly what a negative number is: a position on the other side of zero. Today we put those numbers on a line, find each one its opposite, and figure out what it means to ask how FAR a number is from zero.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-integers-absolute-value',
      kind: 'concept',
      goal: 'Build the number line, opposites, and absolute value as distance.',
      keyIdeas: [
        'THE NUMBER LINE HAS TWO SIDES — zero sits in the middle. Positive numbers go right, negative numbers go left. Moving right always makes a number bigger, so −2 is bigger than −7 even though 7 is bigger than 2. On the line, −7 sits further left, and further left means smaller.',
        'OPPOSITES ARE MIRROR IMAGES — 5 and −5 are opposites because they sit the same distance from zero on opposite sides. The opposite of zero is zero. Writing the opposite of a number means flipping which side it is on, not making it negative: the opposite of −8 is 8.',
        'ABSOLUTE VALUE IS DISTANCE FROM ZERO — we write it with two straight bars, so |−6| = 6 and |6| = 6. Both numbers sit six units from zero, and distance is never negative. That is the whole idea.',
        'THE BIG TRAP — absolute value does NOT mean "erase the minus sign." It only acts on what is INSIDE the bars. If a minus sign is sitting outside, it stays: |−6| = 6, but −|−6| = −6. Read the bars like parentheses; they close before the outside sign gets its turn.',
        'DISTANCE BETWEEN TWO NUMBERS — the gap between two numbers on the line is the absolute value of their difference. From −3 to 4 the gap is |−3 − 4| = |−7| = 7. Counting the jumps on the line gives the same 7, which is a good way to check yourself.',
      ],
      vocabulary: [
        { term: 'integer', definition: 'a whole number and its opposite, including zero: … −2, −1, 0, 1, 2 …' },
        { term: 'opposite', definition: 'the number the same distance from zero but on the other side of the line.' },
        { term: 'absolute value', definition: 'the distance of a number from zero, written |x| and never negative.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-order-integers',
      kind: 'worked_example',
      problem: 'Put these in order from least to greatest: 3, −8, 0, −2, 6',
      steps: [
        'Sketch a number line and mark zero in the middle. Everything negative goes left of it, everything positive goes right.',
        'Place the negatives: −8 is eight units left of zero, −2 is only two units left. So −8 sits further left than −2.',
        'Place the positives: 3 is three right, 6 is six right, so 3 comes before 6.',
        'Read the line left to right, which is exactly least to greatest: −8, −2, 0, 3, 6.',
      ],
      answer: '−8, −2, 0, 3, 6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-absolute-value-signs',
      kind: 'worked_example',
      problem: 'Evaluate each one: (a) |−9|, (b) −|−9|, (c) |4 − 10|',
      steps: [
        '(a) The bars ask for distance from zero. Negative nine sits nine units from zero, so |−9| = 9.',
        '(b) Work inside the bars first: |−9| = 9. NOW apply the minus sign that was waiting outside, which gives −9. Compare (a) and (b) carefully — same digits, different answers, because the outside sign survives.',
        '(c) Everything inside the bars is one job: 4 − 10 = −6 first. Then |−6| = 6.',
        'Takeaway: bars behave like parentheses. Finish the inside, then deal with whatever is outside.',
      ],
      answer: '(a) 9, (b) −9, (c) 6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-compare',
      kind: 'try_yourself',
      problem: 'Which statement is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−9 is greater than −4' },
        { id: 'b', text: '−4 is greater than −9', correct: true },
        { id: 'c', text: '−9 and −4 are equal' },
        { id: 'd', text: '−9 is greater than 2' },
      ],
      expectedAnswer: '−4 is greater than −9',
      hints: [
        'Put both numbers on a number line before you decide.',
        'Whichever number sits further RIGHT is the greater one, even when both are negative.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-absolute-value',
      kind: 'try_yourself',
      problem: 'What is −|−12| ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '12' },
        { id: 'b', text: '−12', correct: true },
        { id: 'c', text: '0' },
        { id: 'd', text: '24' },
      ],
      expectedAnswer: '−12',
      hints: [
        'Do the inside of the bars first, then look at what is still sitting outside them.',
        '|−12| is 12. There is still a minus sign in front of it waiting its turn.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-distance',
      kind: 'try_yourself',
      problem: 'How far apart are −5 and 6 on the number line? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '11',
      hints: [
        'Distance is the absolute value of the difference: |−5 − 6|.',
        'You can also count the jumps: five steps from −5 up to 0, then six more to 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-absolute-value-erases-minus',
      kind: 'misconception_check',
      question: 'A student says −|−7| = 7, because "absolute value makes everything positive." What went wrong?',
      commonErrors: [
        {
          answer: '7',
          misconception: 'Treating absolute value as a rule that deletes every minus sign in view, including the one outside the bars.',
          correctsTo: 'Absolute value only acts on what is INSIDE the bars, so |−7| = 7. The minus sign outside then applies to that result, giving −|−7| = −7. Compare |−7| = 7 with −|−7| = −7 — the bars close first, and the outside sign goes last.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On the number line, further right means greater — so −2 is greater than −7.',
        'Opposites sit the same distance from zero on opposite sides; the opposite of −8 is 8.',
        'Absolute value is distance from zero, so it is never negative: |−6| = 6.',
        'The bars act like parentheses. A minus sign outside them survives: −|−6| = −6.',
        'The distance between two numbers is the absolute value of their difference: from −3 to 4 is |−3 − 4| = 7.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Integers & Absolute Value' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
