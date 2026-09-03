/**
 * Grade 6 Math — Unit 4 CED 4.3: Multiplying & Dividing Decimals.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.multiplying-and-dividing-decimals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U4_MULTIPLYING_AND_DIVIDING_DECIMALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.multiplying-and-dividing-decimals.v1',
  course: 'Grade 6 Math',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Multiplying & Dividing Decimals',
  planId: 'evelyn.ms.m6math.multiplying-and-dividing-decimals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.multiplying-and-dividing-decimals.v1' }],
  theory: [
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'framework', title: 'Multiply like whole numbers, then count decimal places', content: `MULTIPLY LIKE WHOLE NUMBERS, THEN COUNT DECIMAL PLACES — to multiply two decimals, ignore the decimal points and multiply the digits as whole numbers first. Then count the TOTAL number of decimal places in both factors added together, and place the decimal point that many places from the right in the product.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'framework', title: 'Estimate first to catch a misplaced decimal', content: `ESTIMATE FIRST TO CATCH A MISPLACED DECIMAL — round each factor to a friendly nearby number and multiply those instead. If $2.15 times 6 rounds to about $2 times 6, the real answer should land close to $12, not close to $120 or close to $1.20. Estimating first is what tells you whether your placed decimal point is even in the right neighborhood.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'framework', title: 'To divide by a decimal, shift the divisor to a whole number first', content: `TO DIVIDE BY A DECIMAL, SHIFT THE DIVISOR TO A WHOLE NUMBER FIRST — move the decimal point in the divisor to the right until it becomes a whole number. Whatever power of 10 you used to do that, you must apply to the dividend too.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'framework', title: 'Shift the dividend by the exact same number of places', content: `SHIFT THE DIVIDEND BY THE EXACT SAME NUMBER OF PLACES — move the decimal point in the dividend to the right the SAME number of places you moved it in the divisor, adding zeros if you run out of digits. This does not change the answer, because multiplying both numbers by the same power of 10 does not change how many times the divisor fits into the dividend. Once both are shifted, divide as you would with whole numbers.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'framework', title: 'Estimate a division too, before shifting anything', content: `ESTIMATE A DIVISION TOO, BEFORE SHIFTING ANYTHING — if the divisor is a little less than 1, like 0.8, the exact answer will be a little BIGGER than the dividend, not smaller. Knowing that in advance catches the most common division slip: shifting only one of the two decimal points and landing on an answer that is off by a factor of 10.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'framework', title: 'Check by multiplying back', content: `CHECK BY MULTIPLYING BACK — for a division, the quotient times the ORIGINAL divisor must return the ORIGINAL dividend. For a multiplication, the product should be close to the estimate. Either check, done every time, catches a misplaced decimal before it becomes a wrong answer.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'definition', title: 'product', content: 'the answer to a multiplication problem.' },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'definition', title: 'quotient', content: 'the answer to a division problem.' },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'definition', title: 'divisor', content: `the number you are dividing by. In decimal division, this is the number whose decimal point gets shifted first.` },
    { loId: 'm6math.multiplying-and-dividing-decimals', kind: 'definition', title: 'dividend', content: `the number being divided. Its decimal point shifts by the same amount as the divisor.` },
  ],
  methods: [
    {
      title: 'Worked trail mix multiplication',
      steps: [
        `Estimate first: $2.15 is close to $2, and 2 times 6 is 12, so the exact answer should land close to $12.`,
        `Multiply as if there were no decimal points at all: 215 times 6. 215 times 6 is 1290.`,
        `Count decimal places: 2.15 has 2 decimal places, and 6 has 0 decimal places, so the product needs 2 decimal places total.`,
        'Place the decimal point 2 places from the right in 1290, which gives 12.90.',
        `WRONG: placing the decimal point somewhere else, such as writing 129.0 or 1.290, without checking it against the estimate. CORRECT: 12.90, because that is the only placement that lands near the estimate of $12.`,
        `Compare to the estimate one more time: 12.90 is close to 12, so the decimal point is in the right place.`,
      ],
      example: { problem: `Bags of trail mix cost $2.15 each. You buy 6 bags for a camping trip. How much do you spend in total?`, solution: '$12.90' },
      relatedLoIds: ['m6math.multiplying-and-dividing-decimals'],
    },
    {
      title: 'Worked rope into stakes division',
      steps: [
        `Estimate first: $0.80 is a little less than $1, and dividing by a number less than 1 makes the answer BIGGER than the amount you started with, not smaller. So expect an answer a little more than 9.6, somewhere around 10 to 12.`,
        `Shift the decimal point in the divisor, 0.80, to the right until it becomes a whole number: 0.80 becomes 80. That shift moved the decimal point 2 places, which means both numbers were multiplied by 100.`,
        `Shift the decimal point in the dividend, 9.60, the SAME number of places: 9.60 becomes 960.`,
        'Now divide the whole numbers: 960 divided by 80 is 12.',
        `WRONG: shifting only the divisor and forgetting to shift the dividend too, dividing 9.6 by 80 to get 0.12 — a far-too-small answer that does not match the estimate at all. CORRECT: shift both decimal points by the same amount, so the real division is 960 divided by 80, which is 12.`,
        `Check by multiplying back: 12 times $0.80 is $9.60, which matches the amount spent. And 12 is a little more than 9.6, exactly as the estimate predicted.`,
      ],
      example: { problem: `You spent $9.60 total on sticker sheets. Each sticker sheet costs $0.80. How many sticker sheets did you buy?`, solution: '12 sticker sheets' },
      relatedLoIds: ['m6math.multiplying-and-dividing-decimals'],
    },
  ],
  pointers: [
    { content: `Students often say "105.8" — Multiply as whole numbers first: 46 times 23 is 1058. Then count the decimal places in both factors together: 4.6 has 1 decimal place and 2.3 has 1 decimal place, for a total of 2. Place the decimal point 2 places from the right in 1058 to get 10.58. Check with an estimate: 4.6 is close to 5 and 2.3 is close to 2, and 5 times 2 is 10, so 10.58 matches the estimate while 105.8 does not.`, kind: 'common-error' },
    { content: `Students often say "0.7" — Shift both decimal points by the same number of places: multiply both 0.9 and 6.3 by 10, so the divisor becomes 9 and the dividend becomes 63. Divide 63 by 9 to get 7. Check by multiplying back: 7 times 0.9 is 6.3, which matches the original dividend. An estimate also catches this: 0.9 is close to 1, so 6.3 divided by something close to 1 should be close to 6.3, not 0.7.`, kind: 'common-error' },
    { content: `To multiply decimals, multiply the digits as whole numbers, then count the total decimal places in BOTH factors and place the decimal point that many places from the right in the product.`, kind: 'tip' },
    { content: `To divide by a decimal, shift the decimal point in the divisor to the right until it is a whole number, then shift the decimal point in the dividend the SAME number of places.`, kind: 'tip' },
    { content: `Shifting both decimal points by the same amount never changes the answer, because both numbers are multiplied by the same power of 10.`, kind: 'tip' },
    { content: `Estimate first with friendly rounded numbers, so you know roughly how big the exact answer should be before you compute it.`, kind: 'tip' },
    { content: `Misplacing the decimal point in a product, and shifting only ONE of the two decimal points in a division, are the two most common decimal mistakes — an estimate catches both.`, kind: 'tip' },
    { content: `Check every answer: for multiplication, compare the product to the estimate; for division, multiply the quotient by the original divisor and confirm it returns the original dividend.`, kind: 'tip' },
  ],
};
