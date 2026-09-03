/**
 * Grade 6 Math — Unit 5 CED 5.2: Rational Numbers on the Number Line.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.rational-numbers-on-the-number-line.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U5_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.rational-numbers-on-the-number-line.v1',
  course: 'Grade 6 Math',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Rational Numbers on the Number Line',
  planId: 'evelyn.ms.m6math.rational-numbers-on-the-number-line.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.rational-numbers-on-the-number-line.v1' }],
  theory: [
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'framework', title: 'The number line holds every rational number', content: `THE NUMBER LINE HOLDS EVERY RATIONAL NUMBER — a number line is not only for whole numbers. Fractions and decimals belong on it too. Between 1 and 2 sits 1.5. Between 0 and -1 sits -1/2. Every rational number, no matter how it is written, has exactly one true spot on the line.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'framework', title: 'Distance and direction locate a point', content: `DISTANCE AND DIRECTION LOCATE A POINT — to place a rational number, find two things: its distance from zero, which is the number written without its sign, and its direction, which the sign gives you. Positive numbers sit to the right of zero. Negative numbers sit to the left.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'framework', title: 'Fractions and decimals split the space between integers', content: `FRACTIONS AND DECIMALS SPLIT THE SPACE BETWEEN INTEGERS — the line is not just integer stops. Marking the halfway point between two integers gives a home for a number like 2.5 or -1/2. The finer the marks between whole numbers, the more precise a number can be placed.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'framework', title: 'The opposite of a number is its mirror across zero', content: `THE OPPOSITE OF A NUMBER IS ITS MIRROR ACROSS ZERO — every rational number has an opposite: the point the same distance from zero, but on the other side. The opposite of 4 is -4. The opposite of -2.5 is 2.5. Zero is its own opposite, since it sits no distance from itself.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'framework', title: 'The opposite of the opposite brings you back to the start', content: `THE OPPOSITE OF THE OPPOSITE BRINGS YOU BACK TO THE START — flipping a point across zero once gives its opposite. Flipping that opposite across zero a second time lands exactly back on the number you began with. So the opposite of the opposite of a number is the number itself: two mirror-flips, and you are home again.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'definition', title: 'rational number', content: `any number that can be written as a fraction, including whole numbers, fractions, and decimals that stop or repeat.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'definition', title: 'integer', content: `a whole number or its opposite, with no fraction or decimal part, such as -4, 0, or 7.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'definition', title: 'opposite', content: `a number the same distance from zero as another number, but on the other side of it.` },
    { loId: 'm6math.rational-numbers-on-the-number-line', kind: 'definition', title: 'number line', content: `a line marked with zero that extends in both directions, holding positive numbers to the right and negative numbers to the left.` },
  ],
  methods: [
    {
      title: 'Worked placing rational numbers',
      steps: [
        `Draw a number line with 0 in the middle. Numbers to the right of 0 are positive. Numbers to the left of 0 are negative.`,
        `For 4: the digit alone gives the distance from zero, which is 4. The number is positive, so the direction is right. Place a point 4 units to the right of 0.`,
        `For -4: the distance from zero is 4 again, found by dropping the sign. The number is negative, so the direction is left. Place a point 4 units to the left of 0. Notice that 4 and -4 sit the same distance from zero on opposite sides, so they are opposites.`,
        `For 2.5: this number sits between the whole numbers 2 and 3. Mark the halfway point between 2 and 3 and place 2.5 there, 2.5 units to the right of 0.`,
        `For -1/2: this number sits between 0 and -1. Since 1/2 is halfway to 1, mark the halfway point between 0 and -1 on the negative side, and place -1/2 there.`,
        `WRONG: placing -1/2 to the right of 0, between 0 and 1, because 1/2 by itself looks like a small positive fraction. CORRECT: the negative sign sends the whole number to the left of 0, no matter how small the fraction looks. -1/2 belongs between 0 and -1.`,
        `Check by reading each point back: 4 is four steps right of the middle, -4 is four steps left, 2.5 is two and a half steps right, and -1/2 is half of one step left.`,
      ],
      example: { problem: `Place each of these numbers on a number line, and give its distance from zero: 4, -4, 2.5, and -1/2.`, solution: `4 is 4 units right of 0. -4 is 4 units left of 0. 2.5 is halfway between 2 and 3, which is 2.5 units right of 0. -1/2 is halfway between 0 and -1, which is 1/2 unit left of 0.` },
      relatedLoIds: ['m6math.rational-numbers-on-the-number-line'],
    },
    {
      title: 'Worked opposite of the opposite',
      steps: [
        `The opposite of a number is its mirror across zero: the point the same distance from zero, but on the other side.`,
        `-6 sits 6 units to the left of zero, below the entrance. Its opposite sits 6 units to the right of zero, the same distance, the other side: the opposite of -6 is 6.`,
        `Now find the opposite of that new number, 6. It sits 6 units to the right of zero. Its opposite sits 6 units to the left of zero: the opposite of 6 is -6.`,
        `So the opposite of the opposite of -6 is -6 again, exactly the point the tour started from.`,
        `WRONG: assuming the opposite of the opposite must land on some brand-new number, such as 0 or 12, because two flips should change things more. CORRECT: flipping across zero twice always returns you to the exact same point you started on, because the second flip undoes the first.`,
        `Check with a different number: the opposite of 3 is -3, and the opposite of -3 is 3, right back at the start. The same pattern holds for -6.`,
      ],
      example: { problem: `A cave map marks the entrance as 0. A tour reaches a chamber 6 meters below the entrance, recorded as -6. What is the opposite of -6? Then what is the opposite of that new number?`, solution: `The opposite of -6 is 6. The opposite of 6 is -6. The opposite of the opposite of -6 is -6.` },
      relatedLoIds: ['m6math.rational-numbers-on-the-number-line'],
    },
  ],
  pointers: [
    { content: `Students often say "-3/4 placed to the right of zero, between 0 and 1" — Every negative number sits to the left of zero, no matter how small its digits look. -3/4 is three-quarters of the way from 0 to -1, so it belongs between 0 and -1, on the left side of the line.`, kind: 'common-error' },
    { content: `Students often say "The opposite of the opposite of 6 is 0" — Each opposite is one flip to the matching point on the other side of zero. The opposite of 6 is -6. The opposite of -6 is 6 again, the exact starting point. The opposite of the opposite of 6 is 6, not 0.`, kind: 'common-error' },
    { content: `Every rational number, whether a whole number, fraction, or decimal, has exactly one spot on a number line.`, kind: 'tip' },
    { content: `To place a number, find its distance from zero (the number without its sign) and its direction (positive numbers go right, negative numbers go left).`, kind: 'tip' },
    { content: `Fractions and decimals such as 2.5 or -1/2 sit between the marked integers, splitting that space precisely.`, kind: 'tip' },
    { content: `The opposite of a number is its mirror across zero: the same distance, the other side.`, kind: 'tip' },
    { content: `The opposite of the opposite of a number is the number itself, because two mirror-flips across zero return you to the start.`, kind: 'tip' },
    { content: `Placing a number or finding its opposite never asks you to add it to, or subtract it from, anything else.`, kind: 'tip' },
    { content: `The negative sign applies to the whole number, not just the digits. -3/4 goes left of zero (between 0 and -1), not right. Don't ignore the sign because the fraction looks small.`, kind: 'common-error' },
    { content: `Distance from zero is always positive. It's the number stripped of its sign. Distance for both 5 and -5 is 5, even though one sits right and one sits left.`, kind: 'vocab-note' },
    { content: `Opposite of the opposite means two flips across zero—you land back home, not at 0 or somewhere new. Opposite of 6 is -6; opposite of -6 is 6 again.`, kind: 'common-error' },
    { content: `Decimals and fractions are equally valid on the number line. Mark them between the integers—2.5 sits halfway between 2 and 3, just like 5/2 does. Same spot, different notation.`, kind: 'tip' },
    { content: `Zero is its own opposite. It sits zero distance from itself, so there's no other side to flip to. Opposite of 0 is 0.`, kind: 'edge-case' },
    { content: `Check your placement by counting distance and direction: Is this number X units left or right of zero? Does that match the sign and size of my number?`, kind: 'tip' },
  ],
};
