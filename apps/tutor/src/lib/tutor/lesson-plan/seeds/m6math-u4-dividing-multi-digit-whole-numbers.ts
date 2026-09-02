/**
 * Grade 6 Math — Multi-Digit & Decimal Operations: Dividing Multi-Digit Whole
 * Numbers.
 *
 * PROCEDURE-LED lesson for the m6math fan-out (row 4.1, CCSS 6.NS.B.2). The
 * shape follows the fan-out's procedure-led exemplar: the concept segment is
 * a short ordered recipe (Divide, Multiply, Subtract, Bring down) rather than
 * a mental model, both worked examples run the same four moves so the
 * pattern is unmistakable, and every answer is checked two ways: an estimate
 * made BEFORE dividing, and a multiply-back check made AFTER. Two traps this
 * plan is built to kill: skipping a quotient-digit position instead of
 * writing a 0 when the divisor does not fit, and stopping one digit early by
 * forgetting to bring down the last digit of the dividend. At least one item
 * (the second worked example, plus the numeric try-yourself) carries a
 * genuine remainder, and the lesson says explicitly what to do with it: keep
 * it as a whole-number amount left over, and check that it is smaller than
 * the divisor.
 *
 * SCOPE GUARD: Grade 6 row 4.1 divides whole numbers by whole numbers using
 * the standard long-division algorithm. Every dividend, divisor, quotient,
 * and remainder in this plan is a whole number, and no decimal point appears
 * in any dividend, divisor, or answer. A remainder here is always reported
 * as a leftover whole-number amount, never continued into a decimal or
 * fraction — that continuation is row 4.3's territory (Multiplying &
 * Dividing Decimals). This row also never computes with negative numbers
 * (Grade 7 territory) and never touches GCF, LCM, or the distributive
 * property, which belong to row 4.4.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U4_DIVIDING_MULTI_DIGIT_WHOLE_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m6math.dividing-multi-digit-whole-numbers.v1',
  title: 'Dividing Multi-Digit Whole Numbers',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.dividing-multi-digit-whole-numbers',
      standard: 'M6MATH-4.1',
      description:
        'Fluently divide multi-digit whole numbers using the standard algorithm, checking every quotient by multiplying it back with the divisor and adding any remainder (CCSS 6.NS.B.2).',
    },
  ],
  prerequisites: ['m6math.word-problems-with-fraction-division'],
  followUps: ['m6math.adding-and-subtracting-decimals'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that guessing or repeated subtraction runs out of steam on large numbers, so the student wants a reliable step-by-step rule.',
      script:
        'Your class baked 756 cookies for the bake sale table. You want to pack them into bags of 6 cookies each, with none left over if you can help it. You could subtract 6 over and over and count how many times you did it, but with a number like 756 that takes forever and it is easy to lose count. Today you learn the standard long-division algorithm: four moves, repeated one digit at a time, that turn any whole-number division, no matter how large, into something you can do by hand. You will also learn two checks that catch a mistake before it becomes your final answer: an estimate you make first, and a multiply-back check you make last.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-divide-multiply-subtract-bring-down',
      kind: 'concept',
      goal: 'Install the four-move algorithm, why a 0 digit can never be skipped, and the two checks that catch a slip.',
      keyIdeas: [
        'FOUR MOVES, REPEATED — DIVIDE, MULTIPLY, SUBTRACT, BRING DOWN. Divide to find how many times the divisor fits into the digits you are looking at, multiply that digit by the divisor, subtract to find what is left, then bring down the next digit of the dividend and repeat. Keep repeating until every digit of the dividend has been brought down.',
        'ESTIMATE FIRST WITH FRIENDLY NUMBERS — before dividing, round the dividend and the divisor to numbers that divide evenly, and use that to predict roughly how big the answer should be. If your final answer is nowhere near the estimate, a digit went in the wrong place.',
        'A ZERO DIGIT IS STILL A DIGIT — if the divisor does not fit into the number you are looking at, the quotient digit there is 0. Write the 0 and bring down the next digit anyway. Skipping that position instead of writing 0 shrinks the whole answer, because every digit after it shifts one place too far.',
        'KEEP GOING UNTIL EVERY DIGIT HAS BEEN BROUGHT DOWN — the division is not finished just because the numbers look small. Stopping before the last digit of the dividend has been used always leaves an answer that is too small.',
        'A REMAINDER MUST BE SMALLER THAN THE DIVISOR — whatever is left over after the last subtraction is the remainder, and it always has to be less than the divisor. If it is not, the quotient digit you chose was too small; try the next digit up.',
        'CHECK BY MULTIPLYING BACK — quotient times divisor, plus the remainder, must equal the original dividend. This single check catches an arithmetic slip in any one of the divide-multiply-subtract-bring down cycles.',
      ],
      vocabulary: [
        { term: 'dividend', definition: 'the number being divided, written first in the division, for example the 756 in 756 divided by 6.' },
        { term: 'divisor', definition: 'the number you are dividing by, for example the 6 in 756 divided by 6.' },
        { term: 'quotient', definition: 'the answer to a division problem, the number of equal groups the dividend splits into.' },
        { term: 'remainder', definition: 'whatever whole-number amount is left over after dividing as many equal groups as possible; it is always smaller than the divisor.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cookies-into-bags',
      kind: 'worked_example',
      problem: 'You have 756 cookies to pack into bags of 6 cookies each, with none left over. How many bags do you need? Work out 756 divided by 6.',
      steps: [
        'Estimate first. 756 is a little more than 720, and 720 divided by 6 is 120. So expect the exact answer to be a little more than 120.',
        'DIVIDE: how many times does 6 go into the first digit, 7? Once, since 6 × 1 = 6 and 6 × 2 = 12 is too big. Write 1 in the quotient above the 7.',
        'MULTIPLY: 6 × 1 = 6. SUBTRACT: 7 minus 6 = 1.',
        'BRING DOWN the next digit, 5, to make 15.',
        'DIVIDE: how many times does 6 go into 15? Twice, since 6 × 2 = 12 and 6 × 3 = 18 is too big. Write 2 in the quotient, next to the 1.',
        'MULTIPLY: 6 × 2 = 12. SUBTRACT: 15 minus 12 = 3.',
        'BRING DOWN the last digit, 6, to make 36.',
        'DIVIDE: how many times does 6 go into 36? Exactly 6 times, since 6 × 6 = 36. Write 6 in the quotient. SUBTRACT: 36 minus 36 = 0.',
        'No digits are left to bring down, and the last subtraction landed on exactly 0, so there is no remainder. Quotient: 126.',
        'Check by multiplying back: 6 × 126 = 756, exactly the dividend you started with. And 126 is a little more than the estimate of 120, just as predicted.',
      ],
      answer: '126, with no cookies left over',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gift-boxes-with-a-remainder',
      kind: 'worked_example',
      problem: 'You have 583 cookies to pack into gift boxes that hold 24 cookies each. How many full boxes can you pack, and how many cookies are left over? Work out 583 divided by 24.',
      steps: [
        'Estimate first. 583 is close to 600, and 24 is close to 25. 600 divided by 25 is 24, since 25 × 24 = 600. So expect the exact answer to land near 24.',
        'DIVIDE: 24 does not fit into the first digit, 5, alone, so look at the first two digits, 58. How many times does 24 go into 58? Twice, since 24 × 2 = 48 and 24 × 3 = 72 is too big. Write 2 in the quotient above the 8.',
        'MULTIPLY: 24 × 2 = 48. SUBTRACT: 58 minus 48 = 10.',
        'BRING DOWN the next digit, 3, to make 103.',
        'DIVIDE: how many times does 24 go into 103? WRONG: picking 3 gives 24 × 3 = 72, and 103 minus 72 = 31. A remainder can never be bigger than the divisor, and 31 is bigger than 24, so 3 is too small a digit. CORRECT: try 4. 24 × 4 = 96, and 103 minus 96 = 7. Since 7 is smaller than 24, the digit 4 is the right one. Write 4 in the quotient.',
        'No digits are left to bring down, so the division stops here. Quotient: 24. Remainder: 7.',
        'Check by multiplying back: 24 × 24 = 576, plus the remainder 7, gives 583, exactly the dividend you started with. And the estimate from step 1 predicted 24, which matches exactly.',
        'Read it back into the story: you can pack 24 full gift boxes, with 7 cookies left over that do not make a whole box.',
      ],
      answer: '24 full boxes, with 7 cookies left over',
      estimatedMinutes: 3,
    },
    {
      id: 'try-beads-for-bracelets',
      kind: 'try_yourself',
      problem: 'You have 936 beads to share evenly among 4 friends for bracelet making. How many beads does each friend get?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '243' },
        { id: 'b', text: '234', correct: true },
        { id: 'c', text: '468' },
        { id: 'd', text: '235' },
      ],
      expectedAnswer: '234',
      hints: [
        'Estimate first: 936 is close to 800, and 800 divided by 4 is 200. So expect the exact answer to be somewhat more than 200.',
        'Use Divide, Multiply, Subtract, Bring down one digit at a time: start with 9 divided by 4, then bring down the 3, then bring down the 6. Check your final answer by multiplying it back by 4 — you should land exactly on 936.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-check-the-division',
      kind: 'try_yourself',
      problem: 'You divide 517 by 8 and get a quotient of 64 with a remainder of 5. Which expression checks that this answer is correct by working back to 517?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8 × 64 - 5' },
        { id: 'b', text: '64 × 5 + 8' },
        { id: 'c', text: '8 × 5 + 64' },
        { id: 'd', text: '8 × 64 + 5', correct: true },
      ],
      expectedAnswer: '8 × 64 + 5',
      hints: [
        'The check for division is: divisor times quotient, plus remainder, should equal the original dividend.',
        'Here the divisor is 8, the quotient is 64, and the remainder is 5. Multiply the divisor by the quotient first, then add the remainder — do not add the divisor or multiply the remainder by anything.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-stickers-for-a-club',
      kind: 'try_yourself',
      problem: 'A club has 251 stickers to share equally among 9 members. Any stickers that do not make a full share stay in the box. How many stickers does each member get? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '27',
      hints: [
        'Estimate first: 251 is close to 270, and 270 divided by 9 is 30. Since 251 is a bit less than 270, expect the exact answer to be a bit less than 30.',
        'Use Divide, Multiply, Subtract, Bring down. Once you have a quotient, check it by multiplying it by 9 and adding whatever is left over — you should land back on 251.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skipped-zero-and-stopped-early',
      kind: 'misconception_check',
      question: 'One student divides 824 by 4 and gets 26. A different student divides 619 by 5 and gets "12 remainder 1." What went wrong in each case?',
      commonErrors: [
        {
          answer: '26',
          misconception: 'When the divisor did not fit into the digit being brought down, that position was skipped instead of writing a 0 in the quotient, so the quotient ended up with too few digits.',
          correctsTo:
            'Divide 824 by 4 one digit at a time. 4 goes into 8 twice, so the first quotient digit is 2, and 8 minus 8 = 0. Bring down the next digit, 2. Since 2 is smaller than 4, the divisor does not fit even once, so the next quotient digit is 0 — write the 0 and bring down the last digit anyway, combining with the remainder to make 24. 4 goes into 24 exactly 6 times, so the last quotient digit is 6. Reading the digits in order gives 206, not 26. Check by multiplying back: 4 × 206 = 824, the number you started with, while 4 × 26 = 104, nowhere close to 824, which shows the skipped zero was not a small slip.',
        },
        {
          answer: '12 remainder 1',
          misconception: 'The final digit of the dividend, 9, was never brought down, so the last divide-multiply-subtract cycle never happened and the division stopped one digit too early.',
          correctsTo:
            'After 11 divided by 5 gives 2 with remainder 1, there is still a digit left in the dividend: the 9. Bring it down to make 19. Divide again: 5 goes into 19 three times, since 5 × 3 = 15 and 19 minus 15 = 4, which is smaller than 5, so the division is finished. The correct quotient is 123 with remainder 4. Check: 5 × 123 = 615, plus the remainder 4, gives 619, the number you started with. Stopping before every digit of the dividend has been used always leaves an answer that is too small.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The standard algorithm repeats four moves for every digit: Divide, Multiply, Subtract, Bring down.',
        'Estimate first using friendly, rounded numbers, so a magnitude mistake gets caught before you trust your final answer.',
        'Every quotient digit lines up with the digit you just brought down. If the divisor does not fit, the digit is 0, never a skipped space.',
        'Keep bringing down digits until none are left in the dividend, even when a step gives a quotient digit of 0.',
        'A remainder must always be smaller than the divisor. If it is not, the quotient digit chosen was too small.',
        'Check every answer by multiplying the quotient by the divisor and adding the remainder; the result must equal the original dividend.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Dividing Multi-Digit Whole Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
