/**
 * Grade 6 Math — Negative Numbers & Absolute Value: Rational Numbers on the
 * Number Line.
 *
 * CONCEPT-LED fan-out row for m6math. The student already knows that signed
 * numbers record a direction from a chosen zero (row 5.1); this lesson gives
 * that idea a precise home by building a number line that holds every
 * rational number — integers, fractions, and decimals alike — and by
 * teaching the "opposite" as a mirror-flip across zero (CCSS 6.NS.C.6a). The
 * second half of the standard, that the opposite of the opposite of a number
 * is the number itself, is treated as its own idea worth a full worked
 * example, not a one-line aside, because "flip twice, land back home" is the
 * exact fact students misremember as "flip twice, land on zero."
 *
 * SCOPE GUARD: Grade 6 places integers and rational numbers on a number line
 * by distance and direction from zero, and finds the opposite of a number,
 * including the opposite of an opposite. It never computes with signed
 * numbers: no adding, subtracting, multiplying, or dividing positive and
 * negative numbers appears anywhere in this file, and that arithmetic is
 * Grade 7 (m7math U1-U2). What a negative number means in a real-world
 * context is row 5.1's territory and is not re-taught here; naming a
 * number's absolute value is row 5.3; comparing two rational numbers and
 * writing an inequality statement between them is row 5.4, so this lesson
 * only locates single points and their mirror-image opposites, and never
 * asks which of two different numbers is greater. Fractions and decimals
 * such as 2.5 and -1/2 appear only as points to be located between marked
 * integers, never as values to combine.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 5.1 -> 5.2 -> 5.3.
 * Row 5.1 (negative-numbers-in-context) is already registered as an
 * exemplar, so its loId is safe to reference now; row 5.3 (absolute-value)
 * is a sibling fan-out row that lands in the same batched commit, per the
 * fan-out contract.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U5_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE: LessonPlan = {
  id: 'evelyn.ms.m6math.rational-numbers-on-the-number-line.v1',
  title: 'Rational Numbers on the Number Line',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.rational-numbers-on-the-number-line',
      standard: 'M6MATH-5.2',
      description:
        'Place integers and other rational numbers on a number line; understand that the opposite of the opposite of a number is the number itself (CCSS 6.NS.C.6a).',
    },
  ],
  prerequisites: ['m6math.negative-numbers-in-context'],
  followUps: ['m6math.absolute-value'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up one chalk line with a zero mark and both directions before any number gets placed on it.',
      script:
        'Picture a hopscotch line drawn in chalk on the driveway, except this one keeps going past a mark in the middle labeled 0. To the right, the squares count up: 1, 2, 3. To the left, the squares count down the same way: -1, -2, -3. In today\'s card game, each card names a number, and the rule is simple: your bottle cap has to land on that exact spot, even when the card says something tricky like -2.5 or -1/2. Every single rational number has exactly one true spot on that chalk line, no matter how small the fraction or how far left the number sits. Today we find that exact spot for any rational number, and we learn a mirror trick called the opposite, including what happens when you flip a number across zero twice.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-placing-and-opposites',
      kind: 'concept',
      goal: 'Build the rule for placing any rational number by distance and direction, and establish that flipping across zero twice returns the original number.',
      keyIdeas: [
        'THE NUMBER LINE HOLDS EVERY RATIONAL NUMBER — a number line is not only for whole numbers. Fractions and decimals belong on it too. Between 1 and 2 sits 1.5. Between 0 and -1 sits -1/2. Every rational number, no matter how it is written, has exactly one true spot on the line.',
        'DISTANCE AND DIRECTION LOCATE A POINT — to place a rational number, find two things: its distance from zero, which is the number written without its sign, and its direction, which the sign gives you. Positive numbers sit to the right of zero. Negative numbers sit to the left.',
        'FRACTIONS AND DECIMALS SPLIT THE SPACE BETWEEN INTEGERS — the line is not just integer stops. Marking the halfway point between two integers gives a home for a number like 2.5 or -1/2. The finer the marks between whole numbers, the more precise a number can be placed.',
        'THE OPPOSITE OF A NUMBER IS ITS MIRROR ACROSS ZERO — every rational number has an opposite: the point the same distance from zero, but on the other side. The opposite of 4 is -4. The opposite of -2.5 is 2.5. Zero is its own opposite, since it sits no distance from itself.',
        'THE OPPOSITE OF THE OPPOSITE BRINGS YOU BACK TO THE START — flipping a point across zero once gives its opposite. Flipping that opposite across zero a second time lands exactly back on the number you began with. So the opposite of the opposite of a number is the number itself: two mirror-flips, and you are home again.',
      ],
      vocabulary: [
        { term: 'rational number', definition: 'any number that can be written as a fraction, including whole numbers, fractions, and decimals that stop or repeat.' },
        { term: 'integer', definition: 'a whole number or its opposite, with no fraction or decimal part, such as -4, 0, or 7.' },
        { term: 'opposite', definition: 'a number the same distance from zero as another number, but on the other side of it.' },
        { term: 'number line', definition: 'a line marked with zero that extends in both directions, holding positive numbers to the right and negative numbers to the left.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-placing-rational-numbers',
      kind: 'worked_example',
      problem:
        'Place each of these numbers on a number line, and give its distance from zero: 4, -4, 2.5, and -1/2.',
      steps: [
        'Draw a number line with 0 in the middle. Numbers to the right of 0 are positive. Numbers to the left of 0 are negative.',
        'For 4: the digit alone gives the distance from zero, which is 4. The number is positive, so the direction is right. Place a point 4 units to the right of 0.',
        'For -4: the distance from zero is 4 again, found by dropping the sign. The number is negative, so the direction is left. Place a point 4 units to the left of 0. Notice that 4 and -4 sit the same distance from zero on opposite sides, so they are opposites.',
        'For 2.5: this number sits between the whole numbers 2 and 3. Mark the halfway point between 2 and 3 and place 2.5 there, 2.5 units to the right of 0.',
        'For -1/2: this number sits between 0 and -1. Since 1/2 is halfway to 1, mark the halfway point between 0 and -1 on the negative side, and place -1/2 there.',
        'WRONG: placing -1/2 to the right of 0, between 0 and 1, because 1/2 by itself looks like a small positive fraction. CORRECT: the negative sign sends the whole number to the left of 0, no matter how small the fraction looks. -1/2 belongs between 0 and -1.',
        'Check by reading each point back: 4 is four steps right of the middle, -4 is four steps left, 2.5 is two and a half steps right, and -1/2 is half of one step left.',
      ],
      answer:
        '4 is 4 units right of 0. -4 is 4 units left of 0. 2.5 is halfway between 2 and 3, which is 2.5 units right of 0. -1/2 is halfway between 0 and -1, which is 1/2 unit left of 0.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-opposite-of-the-opposite',
      kind: 'worked_example',
      problem:
        'A cave map marks the entrance as 0. A tour reaches a chamber 6 meters below the entrance, recorded as -6. What is the opposite of -6? Then what is the opposite of that new number?',
      steps: [
        'The opposite of a number is its mirror across zero: the point the same distance from zero, but on the other side.',
        '-6 sits 6 units to the left of zero, below the entrance. Its opposite sits 6 units to the right of zero, the same distance, the other side: the opposite of -6 is 6.',
        'Now find the opposite of that new number, 6. It sits 6 units to the right of zero. Its opposite sits 6 units to the left of zero: the opposite of 6 is -6.',
        'So the opposite of the opposite of -6 is -6 again, exactly the point the tour started from.',
        'WRONG: assuming the opposite of the opposite must land on some brand-new number, such as 0 or 12, because two flips should change things more. CORRECT: flipping across zero twice always returns you to the exact same point you started on, because the second flip undoes the first.',
        'Check with a different number: the opposite of 3 is -3, and the opposite of -3 is 3, right back at the start. The same pattern holds for -6.',
      ],
      answer: 'The opposite of -6 is 6. The opposite of 6 is -6. The opposite of the opposite of -6 is -6.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-placing-a-decimal',
      kind: 'try_yourself',
      problem: 'A fish is swimming at a depth recorded as -1.5 meters, measured from the surface at 0. Where does -1.5 sit on a vertical number line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Between 0 and -1, halfway between them' },
        { id: 'b', text: 'Between 1 and 2, halfway between them' },
        { id: 'c', text: 'Exactly at -2' },
        { id: 'd', text: 'Between -1 and -2, halfway between them', correct: true },
      ],
      expectedAnswer: 'Between -1 and -2, halfway between them',
      hints: [
        'Drop the sign first to find the distance from zero: -1.5 is 1.5 units from zero, not 0.5 units.',
        'A distance of 1.5 sits between the whole-number marks 1 and 2. Since the number is negative, it belongs between -1 and -2, at the halfway point.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-opposite-of-the-opposite',
      kind: 'try_yourself',
      problem: 'What is the opposite of the opposite of -9?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0' },
        { id: 'b', text: '-9', correct: true },
        { id: 'c', text: '9' },
        { id: 'd', text: '18' },
      ],
      expectedAnswer: '-9',
      hints: [
        'Find the opposite of -9 first. It is the mirror of -9 across zero, the same distance away, on the other side.',
        'Now flip that result across zero one more time. Two flips bring you back to the number you started with, not to zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-halfway-point',
      kind: 'try_yourself',
      problem:
        'A point on a number line sits exactly halfway between -3 and -4. Write this point as a decimal. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-3.5',
      hints: [
        'The halfway point between two numbers sits exactly in the middle of them. -3 and -4 are both whole numbers one unit apart.',
        'The middle of that one-unit gap is half a unit past -3, in the direction of -4: -3.5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sign-dropped-and-double-flip-to-zero',
      kind: 'misconception_check',
      question:
        'A student places -3/4 on a number line to the right of zero, between 0 and 1. Then, when asked for the opposite of the opposite of 6, the same student answers 0. What went wrong in each case?',
      commonErrors: [
        {
          answer: '-3/4 placed to the right of zero, between 0 and 1',
          misconception: 'Looking only at the fraction 3/4 and forgetting that the negative sign sends the whole number to the other side of zero.',
          correctsTo:
            'Every negative number sits to the left of zero, no matter how small its digits look. -3/4 is three-quarters of the way from 0 to -1, so it belongs between 0 and -1, on the left side of the line.',
        },
        {
          answer: 'The opposite of the opposite of 6 is 0',
          misconception: 'Treating two flips across zero as something that cancels the number down to nothing, instead of two separate mirror-images.',
          correctsTo:
            'Each opposite is one flip to the matching point on the other side of zero. The opposite of 6 is -6. The opposite of -6 is 6 again, the exact starting point. The opposite of the opposite of 6 is 6, not 0.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every rational number, whether a whole number, fraction, or decimal, has exactly one spot on a number line.',
        'To place a number, find its distance from zero (the number without its sign) and its direction (positive numbers go right, negative numbers go left).',
        'Fractions and decimals such as 2.5 or -1/2 sit between the marked integers, splitting that space precisely.',
        'The opposite of a number is its mirror across zero: the same distance, the other side.',
        'The opposite of the opposite of a number is the number itself, because two mirror-flips across zero return you to the start.',
        'Placing a number or finding its opposite never asks you to add it to, or subtract it from, anything else.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Rational Numbers on the Number Line' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
