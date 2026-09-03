/**
 * Grade 6 Math — Unit 4 CED 4.1: Dividing Multi-Digit Whole Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.dividing-multi-digit-whole-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U4_DIVIDING_MULTI_DIGIT_WHOLE_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.dividing-multi-digit-whole-numbers.v1',
  course: 'Grade 6 Math',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Dividing Multi-Digit Whole Numbers',
  planId: 'evelyn.ms.m6math.dividing-multi-digit-whole-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.dividing-multi-digit-whole-numbers.v1' }],
  theory: [
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'framework', title: 'Four moves, repeated', content: `FOUR MOVES, REPEATED — DIVIDE, MULTIPLY, SUBTRACT, BRING DOWN. Divide to find how many times the divisor fits into the digits you are looking at, multiply that digit by the divisor, subtract to find what is left, then bring down the next digit of the dividend and repeat. Keep repeating until every digit of the dividend has been brought down.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'framework', title: 'Estimate first with friendly numbers', content: `ESTIMATE FIRST WITH FRIENDLY NUMBERS — before dividing, round the dividend and the divisor to numbers that divide evenly, and use that to predict roughly how big the answer should be. If your final answer is nowhere near the estimate, a digit went in the wrong place.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'framework', title: 'A zero digit is still a digit', content: `A ZERO DIGIT IS STILL A DIGIT — if the divisor does not fit into the number you are looking at, the quotient digit there is 0. Write the 0 and bring down the next digit anyway. Skipping that position instead of writing 0 shrinks the whole answer, because every digit after it shifts one place too far.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'framework', title: 'Keep going until every digit has been brought down', content: `KEEP GOING UNTIL EVERY DIGIT HAS BEEN BROUGHT DOWN — the division is not finished just because the numbers look small. Stopping before the last digit of the dividend has been used always leaves an answer that is too small.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'framework', title: 'A remainder must be smaller than the divisor', content: `A REMAINDER MUST BE SMALLER THAN THE DIVISOR — whatever is left over after the last subtraction is the remainder, and it always has to be less than the divisor. If it is not, the quotient digit you chose was too small; try the next digit up.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'framework', title: 'Check by multiplying back', content: `CHECK BY MULTIPLYING BACK — quotient times divisor, plus the remainder, must equal the original dividend. This single check catches an arithmetic slip in any one of the divide-multiply-subtract-bring down cycles.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'definition', title: 'dividend', content: `the number being divided, written first in the division, for example the 756 in 756 divided by 6.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'definition', title: 'divisor', content: 'the number you are dividing by, for example the 6 in 756 divided by 6.' },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'definition', title: 'quotient', content: `the answer to a division problem, the number of equal groups the dividend splits into.` },
    { loId: 'm6math.dividing-multi-digit-whole-numbers', kind: 'definition', title: 'remainder', content: `whatever whole-number amount is left over after dividing as many equal groups as possible; it is always smaller than the divisor.` },
  ],
  methods: [
    {
      title: 'Worked cookies into bags',
      steps: [
        `Estimate first. 756 is a little more than 720, and 720 divided by 6 is 120. So expect the exact answer to be a little more than 120.`,
        `DIVIDE: how many times does 6 go into the first digit, 7? Once, since 6 × 1 = 6 and 6 × 2 = 12 is too big. Write 1 in the quotient above the 7.`,
        'MULTIPLY: 6 × 1 = 6. SUBTRACT: 7 minus 6 = 1.',
        'BRING DOWN the next digit, 5, to make 15.',
        `DIVIDE: how many times does 6 go into 15? Twice, since 6 × 2 = 12 and 6 × 3 = 18 is too big. Write 2 in the quotient, next to the 1.`,
        'MULTIPLY: 6 × 2 = 12. SUBTRACT: 15 minus 12 = 3.',
        'BRING DOWN the last digit, 6, to make 36.',
        `DIVIDE: how many times does 6 go into 36? Exactly 6 times, since 6 × 6 = 36. Write 6 in the quotient. SUBTRACT: 36 minus 36 = 0.`,
        `No digits are left to bring down, and the last subtraction landed on exactly 0, so there is no remainder. Quotient: 126.`,
        `Check by multiplying back: 6 × 126 = 756, exactly the dividend you started with. And 126 is a little more than the estimate of 120, just as predicted.`,
      ],
      example: { problem: `You have 756 cookies to pack into bags of 6 cookies each, with none left over. How many bags do you need? Work out 756 divided by 6.`, solution: '126, with no cookies left over' },
      relatedLoIds: ['m6math.dividing-multi-digit-whole-numbers'],
    },
    {
      title: 'Worked gift boxes with a remainder',
      steps: [
        `Estimate first. 583 is close to 600, and 24 is close to 25. 600 divided by 25 is 24, since 25 × 24 = 600. So expect the exact answer to land near 24.`,
        `DIVIDE: 24 does not fit into the first digit, 5, alone, so look at the first two digits, 58. How many times does 24 go into 58? Twice, since 24 × 2 = 48 and 24 × 3 = 72 is too big. Write 2 in the quotient above the 8.`,
        'MULTIPLY: 24 × 2 = 48. SUBTRACT: 58 minus 48 = 10.',
        'BRING DOWN the next digit, 3, to make 103.',
        `DIVIDE: how many times does 24 go into 103? WRONG: picking 3 gives 24 × 3 = 72, and 103 minus 72 = 31. A remainder can never be bigger than the divisor, and 31 is bigger than 24, so 3 is too small a digit. CORRECT: try 4. 24 × 4 = 96, and 103 minus 96 = 7. Since 7 is smaller than 24, the digit 4 is the right one. Write 4 in the quotient.`,
        `No digits are left to bring down, so the division stops here. Quotient: 24. Remainder: 7.`,
        `Check by multiplying back: 24 × 24 = 576, plus the remainder 7, gives 583, exactly the dividend you started with. And the estimate from step 1 predicted 24, which matches exactly.`,
        `Read it back into the story: you can pack 24 full gift boxes, with 7 cookies left over that do not make a whole box.`,
      ],
      example: { problem: `You have 583 cookies to pack into gift boxes that hold 24 cookies each. How many full boxes can you pack, and how many cookies are left over? Work out 583 divided by 24.`, solution: '24 full boxes, with 7 cookies left over' },
      relatedLoIds: ['m6math.dividing-multi-digit-whole-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "26" — Divide 824 by 4 one digit at a time. 4 goes into 8 twice, so the first quotient digit is 2, and 8 minus 8 = 0. Bring down the next digit, 2. Since 2 is smaller than 4, the divisor does not fit even once, so the next quotient digit is 0 — write the 0 and bring down the last digit anyway, combining with the remainder to make 24. 4 goes into 24 exactly 6 times, so the last quotient digit is 6. Reading the digits in order gives 206, not 26. Check by multiplying back: 4 × 206 = 824, the number you started with, while 4 × 26 = 104, nowhere close to 824, which shows the skipped zero was not a small slip.`, kind: 'common-error' },
    { content: `Students often say "12 remainder 1" — After 11 divided by 5 gives 2 with remainder 1, there is still a digit left in the dividend: the 9. Bring it down to make 19. Divide again: 5 goes into 19 three times, since 5 × 3 = 15 and 19 minus 15 = 4, which is smaller than 5, so the division is finished. The correct quotient is 123 with remainder 4. Check: 5 × 123 = 615, plus the remainder 4, gives 619, the number you started with. Stopping before every digit of the dividend has been used always leaves an answer that is too small.`, kind: 'common-error' },
    { content: `The standard algorithm repeats four moves for every digit: Divide, Multiply, Subtract, Bring down.`, kind: 'tip' },
    { content: `Estimate first using friendly, rounded numbers, so a magnitude mistake gets caught before you trust your final answer.`, kind: 'tip' },
    { content: `Every quotient digit lines up with the digit you just brought down. If the divisor does not fit, the digit is 0, never a skipped space.`, kind: 'tip' },
    { content: `Keep bringing down digits until none are left in the dividend, even when a step gives a quotient digit of 0.`, kind: 'tip' },
    { content: `A remainder must always be smaller than the divisor. If it is not, the quotient digit chosen was too small.`, kind: 'tip' },
    { content: `Check every answer by multiplying the quotient by the divisor and adding the remainder; the result must equal the original dividend.`, kind: 'tip' },
    { content: `If the remainder is bigger than the divisor, your quotient digit was too small. Try the next digit up and subtract again.`, kind: 'common-error' },
    { content: `Write a 0 in the quotient when the divisor doesn't fit into the digits you're looking at. Never skip that position or your whole answer shifts left and becomes too small.`, kind: 'gotcha' },
    { content: `Estimate using friendly numbers before you start dividing. If your final answer is way off from the estimate, a digit landed in the wrong place.`, kind: 'tip' },
    { content: `Don't stop dividing just because the numbers look small. Keep going until you've brought down every single digit of the dividend.`, kind: 'common-error' },
    { content: `Check your answer by multiplying quotient × divisor + remainder. It must equal the original dividend exactly. If it doesn't, an arithmetic slip happened somewhere.`, kind: 'tip' },
    { content: `The remainder is what's left over after the last subtraction. It's never zero if you wrote a remainder — it's always smaller than the divisor.`, kind: 'vocab-note' },
    { content: `When the divisor doesn't fit into the first digit alone, look at the first two (or more) digits together before you divide.`, kind: 'edge-case' },
  ],
};
