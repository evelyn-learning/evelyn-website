/**
 * Grade 7 Math — Rational Numbers: Rational Numbers on the Number Line.
 *
 * Row 1.1 put integers on the line. This one fills in every gap between them
 * (CCSS 7.NS.A.1, 6.NS.C.7): what "rational" means, how a denominator tells
 * you how finely to cut each unit, why 1/2 and 0.5 and 2/4 are one point with
 * three names, and the two traps that ruin placement — reading −1.25 as if it
 * were −0.25, and dividing a fraction the wrong way round.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U1_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE: LessonPlan = {
  id: 'evelyn.ms.m7math.rational-numbers-on-the-number-line.v1',
  title: 'Rational Numbers on the Number Line',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.rational-numbers-on-the-number-line',
      standard: 'M7MATH-1.2',
      description:
        'Place positive and negative fractions and decimals on a number line, recognize that equivalent forms name the same point, and convert a fraction to a terminating or repeating decimal by division (CCSS 7.NS.A.1, 7.NS.A.2d, 6.NS.C.7).',
    },
  ],
  prerequisites: ['m7math.integers-and-absolute-value'],
  followUps: ['m7math.comparing-and-ordering-rationals'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student picturing the space BETWEEN the whole numbers as full of numbers, not empty.',
      script:
        'Think about the volume slider on your phone. It is not just off or all the way up. You can park it anywhere along that bar. A number line works the same way. Between 0 and 1 there is a whole crowd of numbers hiding: one half, three quarters, 0.375. And the line keeps running the other way past zero, so −3/4 and −1.25 have their own spots too. Today we find the exact spot for any fraction or decimal, on either side of zero, and figure out why 1/2 and 2/4 and 0.5 all end up standing on the very same one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rationals-on-the-line',
      kind: 'concept',
      goal: 'Define rational numbers, place fractions and decimals on both sides of zero, and connect equivalent forms to a single point.',
      keyIdeas: [
        'A RATIONAL NUMBER IS ANY NUMBER YOU CAN WRITE AS A FRACTION of two integers, with a bottom number that is not zero. That is a bigger club than it sounds. Integers join, because 6 is 6/1. Decimals that stop join, because 2.5 is 5/2. Negatives join, because −3/4 is (−3)/4.',
        'THE DENOMINATOR SAYS HOW FINELY TO CUT, the numerator says how many pieces to count. To place 3/4, cut each unit on the line into 4 equal pieces and count 3 of them starting from zero. To place −3/4, cut the same way and count 3 pieces to the LEFT of zero instead.',
        'NEGATIVE FRACTIONS ARE MIRROR IMAGES — −3/4 sits exactly as far from zero as 3/4, just on the other side. That is why the minus sign can ride anywhere without changing the number: −3/4 and (−3)/4 and −(3/4) are one number in three costumes.',
        'A DECIMAL WITH A WHOLE PART GOES PAST THE FIRST INTEGER. To place −1.25, travel one full unit left to reach −1, then keep going a quarter more. So −1.25 lands between −1 and −2. The single biggest placement mistake is looking at the 25 and dropping it between 0 and −1, which would be −0.25, a completely different point.',
        'EQUIVALENT FORMS ARE ONE POINT WITH MANY NAMES — 1/2, 2/4, 4/8, 0.5 and 50/100 all mark the identical spot. Nothing on the line moves when you simplify a fraction or rewrite it as a decimal. You only changed the label.',
        'DIVIDE TOP BY BOTTOM TO GET THE DECIMAL, and the division ends one of two ways. Either the remainder hits zero and the decimal stops, like 3/4 = 0.75, or a remainder comes back around and the digits repeat forever, like 1/3 = 0.333… Both kinds are still rational, and both still sit at exactly one point.',
      ],
      vocabulary: [
        { term: 'rational number', definition: 'any number that can be written as one integer over another, with the bottom one not zero.' },
        { term: 'numerator', definition: 'the top number of a fraction — how many equal pieces you count.' },
        { term: 'denominator', definition: 'the bottom number of a fraction — how many equal pieces each whole unit is cut into.' },
        { term: 'terminating decimal', definition: 'a decimal whose digits stop, such as 0.75, because the division reaches a remainder of zero.' },
        { term: 'repeating decimal', definition: 'a decimal whose digits go on forever in a pattern, such as 0.333…' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-place-three-numbers',
      kind: 'worked_example',
      problem: 'Place −3/4, 2.5 and −1.25 on a number line, then read them off from least to greatest.',
      steps: [
        'Draw the line and mark the whole numbers first: −2, −1, 0, 1, 2, 3. Those are your fence posts, and everything else goes between them.',
        'Place −3/4. The denominator is 4, so cut each unit into 4 equal pieces. Count 3 of those pieces to the LEFT of zero. That lands between −1 and 0, and it is closer to −1, because 3 pieces out of 4 is more than half the way across.',
        'Place 2.5. Point five means half a unit, so 2.5 sits exactly halfway between 2 and 3.',
        'Place −1.25. Travel one whole unit left to reach −1, then keep going a quarter of a unit further left. So −1.25 sits between −1 and −2, a quarter of the way from −1 toward −2. WRONG placement to avoid: dropping it between 0 and −1 because the 25 looks small. RIGHT placement: between −1 and −2.',
        'Read the finished line left to right, which is always least to greatest: −1.25, then −3/4, then 2.5. In decimals that is −1.25, −0.75, 2.5, and those are clearly in order.',
      ],
      answer: 'From left to right: −1.25, then −3/4, then 2.5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fraction-to-decimal',
      kind: 'worked_example',
      problem: 'Write 3/8 and 2/3 as decimals. Then say which point 6/16 lands on.',
      steps: [
        'A fraction bar is a division sign. 3/8 means 3 ÷ 8, so put a decimal point after the 3 and add zeros: 3.000 ÷ 8.',
        'Divide step by step. 30 ÷ 8 = 3 with 6 left over, so the first digit is 0.3. Bring down a zero: 60 ÷ 8 = 7 with 4 left over, so now 0.37. Bring down a zero: 40 ÷ 8 = 5 with 0 left over, so 0.375 and the remainder is zero. The decimal stops. 3/8 = 0.375. Check it: 0.375 × 8 = 3.',
        'Now 2/3, which means 2 ÷ 3. 20 ÷ 3 = 6 with 2 left over, giving 0.6. Bring down a zero: 20 ÷ 3 = 6 with 2 left over again. The same remainder came back, so the 6 repeats forever. 2/3 = 0.666…, written with a bar over the 6. It never stops, but it is still one single point, sitting just past 0.6 and just short of 0.7.',
        'For 6/16, look for a common factor before dividing. Both 6 and 16 divide by 2, giving 3/8. That is the same fraction you already placed, so 6/16 lands on exactly the same point: 0.375. Simplifying renamed it and moved it nowhere.',
      ],
      answer: '3/8 = 0.375, 2/3 = 0.666… (repeating), and 6/16 sits at the same point as 3/8, which is 0.375',
      estimatedMinutes: 3,
    },
    {
      id: 'try-between-integers',
      kind: 'try_yourself',
      problem: 'Which of these numbers sits between −2 and −1 on the number line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−1.25', correct: true },
        { id: 'b', text: '−0.75' },
        { id: 'c', text: '−2.5' },
        { id: 'd', text: '1.25' },
      ],
      expectedAnswer: '−1.25',
      hints: [
        'Start at zero and walk left. How many whole units do you pass before the decimal part even starts?',
        'A number between −1 and −2 has to be more than 1 unit from zero but less than 2 units from zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-point',
      kind: 'try_yourself',
      problem: 'Which number lands on exactly the same point of the number line as 3/4?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.34' },
        { id: 'b', text: '0.75', correct: true },
        { id: 'c', text: '1.33' },
        { id: 'd', text: '0.25' },
      ],
      expectedAnswer: '0.75',
      hints: [
        'The fraction bar means divide. Which number goes inside the division box, the 3 or the 4?',
        'Work out 3 ÷ 4, not 4 ÷ 3. Since 3/4 is less than one whole, the answer has to be less than 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-eighths',
      kind: 'try_yourself',
      problem: 'Write 5/8 as a decimal. Type your answer as a decimal number.',
      responseFormat: 'numeric',
      expectedAnswer: '0.625',
      hints: [
        'A fraction bar means divide, so this is 5 ÷ 8. Put the 5 inside, not the 8.',
        'Write the 5 as 5.000 and keep dividing until the remainder is zero. 50 ÷ 8 = 6 with 2 left over, so the first digit after the point is 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-decimal-whole-part',
      kind: 'misconception_check',
      question: 'A student marks −1.25 between 0 and −1, saying "1.25 is a small number, so it belongs close to zero." Where does −1.25 really go, and what went wrong?',
      commonErrors: [
        {
          answer: 'between 0 and −1',
          misconception: 'Looking only at the digits after the decimal point and ignoring the whole 1 in front of them, so −1.25 gets treated as if it were −0.25.',
          correctsTo: '−1.25 is one whole unit and a quarter away from zero. That first whole unit already carries you all the way to −1, and the extra 0.25 keeps traveling left from there. So −1.25 sits between −1 and −2, a quarter of the way from −1 toward −2. Say the number out loud as "one and a quarter, on the negative side" and the whole unit stops disappearing.',
        },
        {
          answer: '−1.75',
          misconception: 'Getting the right pair of fence posts but measuring the extra quarter from the wrong end — starting at −2 and stepping right instead of starting at −1 and stepping left.',
          correctsTo: 'Always travel outward from zero. One full unit left puts you on −1, and the 0.25 is the next part of that same trip, so keep going left a quarter more. That is −1.25. Counting a quarter up from −2 gives −1.75, which is a different point entirely.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A rational number is anything you can write as one integer over another, so integers, terminating decimals and negative fractions are all rational.',
        'The denominator says how many equal pieces to cut each unit into; the numerator says how many pieces to count, left of zero if the number is negative.',
        'A decimal with a whole part goes past the first integer: −1.25 sits between −1 and −2, never between 0 and −1.',
        'Equivalent forms are one point with many names — 6/16, 3/8 and 0.375 are the same spot on the line.',
        'Divide top by bottom to get the decimal. It either stops, like 3/8 = 0.375, or repeats forever, like 2/3 = 0.666…',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Rational Numbers on the Number Line' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
