/**
 * Grade 6 Math — Unit 4 CED 4.2: Adding & Subtracting Decimals.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.adding-and-subtracting-decimals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U4_ADDING_AND_SUBTRACTING_DECIMALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.adding-and-subtracting-decimals.v1',
  course: 'Grade 6 Math',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Adding & Subtracting Decimals',
  planId: 'evelyn.ms.m6math.adding-and-subtracting-decimals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.adding-and-subtracting-decimals.v1' }],
  theory: [
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'framework', title: 'Place value after the decimal point', content: `PLACE VALUE AFTER THE DECIMAL POINT — the first digit after the decimal point is tenths, the second is hundredths. In 12.75, the 7 is 7 tenths and the 5 is 5 hundredths. Every digit is worth ten times less than the digit to its left.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'framework', title: 'Line up the decimal points, not the last digits', content: `LINE UP THE DECIMAL POINTS, NOT THE LAST DIGITS — when you stack two decimals to add or subtract them, the decimal points must sit directly on top of each other. That puts tenths under tenths and hundredths under hundredths, exactly like lining up ones under ones in whole-number addition. Lining up the rightmost digit instead, the way you would for two whole numbers, is the single most common way this goes wrong.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'framework', title: 'Pad a shorter decimal with zeros', content: `PAD A SHORTER DECIMAL WITH ZEROS — 5.6 has one digit after the point, while 12.75 has two. Writing 5.6 as 5.60 does not change its value, because 6 tenths and 60 hundredths are the same amount. Padding both numbers to the same number of decimal places means every column has a digit in it, and none can be skipped by accident.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'framework', title: 'Add or subtract like whole numbers, then drop the point straight down', content: `ADD OR SUBTRACT LIKE WHOLE NUMBERS, THEN DROP THE POINT STRAIGHT DOWN — once every column lines up, add or subtract digit by digit from the right, carrying or borrowing exactly the way you already do with whole numbers. The decimal point in the answer goes directly below the decimal points above it.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'framework', title: 'Estimate first to catch a misaligned answer', content: `ESTIMATE FIRST TO CATCH A MISALIGNED ANSWER — round each number to the nearest whole number before you start. If the exact answer lands far from that estimate, a place value probably slipped somewhere.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'framework', title: 'Check addition with subtraction, and subtraction with addition', content: `CHECK ADDITION WITH SUBTRACTION, AND SUBTRACTION WITH ADDITION — subtracting one addend back out of a sum should return the other addend. Adding a difference back to the number you subtracted should return the number you started with. If it does not, redo the columns.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'definition', title: 'decimal point', content: `the dot that separates the whole-number part of a number from its fractional part, such as the point in 12.75.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'definition', title: 'tenths place', content: `the first digit after the decimal point, such as the 6 in 5.6, worth six tenths of a whole.` },
    { loId: 'm6math.adding-and-subtracting-decimals', kind: 'definition', title: 'align', content: `to stack numbers so that digits with the same place value sit directly on top of each other, decimal point under decimal point.` },
  ],
  methods: [
    {
      title: 'Worked pizza party collection',
      steps: [
        `Estimate first. $12.75 rounds to $13, and $5.6 rounds to $6. $13 + $6 = $19, so the exact total should land close to $19.`,
        `Write $12.75 above $5.6 and line up the decimal points, point directly under point.`,
        `Pad $5.6 with a zero so it has two decimal places like $12.75: $5.6 becomes $5.60. This does not change its value, because 6 tenths and 60 hundredths are the same amount.`,
        `Add column by column from the right, carrying when a column totals 10 or more. Hundredths: 5 + 0 = 5. Tenths: 7 + 6 = 13, so write 3 and carry 1 to the ones. Ones: 2 + 5 = 7, plus the carried 1 = 8. Tens: 1 + 0 = 1.`,
        `Drop the decimal point straight down between the ones column and the tenths column: the total is $18.35.`,
        `WRONG: ignoring the decimal points and adding the digits as if both numbers were whole numbers, 1275 + 56 = 1331, then guessing where the point belongs, gives something like $13.31 or $133.10, and neither is close to the $19 estimate. CORRECT: line up the decimal points, pad $5.6 to $5.60, then add column by column to get $18.35, which is close to the $19 estimate.`,
        `Check against the estimate one more time: $18.35 is close to $19, so the answer is reasonable.`,
      ],
      example: { problem: `Your class collected $12.75 on Monday and $5.6 on Tuesday. How much has the class collected in total?`, solution: '$18.35' },
      relatedLoIds: ['m6math.adding-and-subtracting-decimals'],
    },
    {
      title: 'Worked book purchase change',
      steps: [
        `Estimate first. $9.4 rounds to $9, and $3.65 rounds to $4. $9 - $4 = $5, so the exact difference should land close to $5.`,
        `Write $9.4 above $3.65 and line up the decimal points, point directly under point.`,
        `Pad $9.4 with a zero so it has two decimal places like $3.65: $9.4 becomes $9.40. This does not change its value, because 4 tenths and 40 hundredths are the same amount.`,
        `Subtract column by column from the right, borrowing when the top digit is smaller than the bottom digit. Hundredths: 0 minus 5 needs a borrow, so borrow 1 tenth from the tenths column, making it 10 hundredths minus 5 = 5. Tenths: after lending 1, there are 3 tenths left, so 3 minus 6 needs a borrow too, borrow 1 one from the ones column, making it 13 tenths minus 6 = 7. Ones: after lending 1, there are 8 ones left, so 8 minus 3 = 5.`,
        'Drop the decimal point straight down: the difference is $5.75.',
        `WRONG: forgetting to pad $9.4 to $9.40 and dropping the hundredths digit of $3.65 entirely, subtracting only $9.4 - $3.6 to get $5.80. That number is close enough to look believable, which is exactly why this mistake is dangerous, but it is not the same amount. CORRECT: pad both numbers to two decimal places first, then subtract every column including the hundredths, to get $5.75.`,
        `Check by adding back: $3.65 + $5.75 = $9.40, which matches the number you started with, and $5.75 is close to the $5 estimate.`,
      ],
      example: { problem: `You have collected $9.4 for the class trip. You spend $3.65 on supplies. How much do you have left?`, solution: '$5.75' },
      relatedLoIds: ['m6math.adding-and-subtracting-decimals'],
    },
  ],
  pointers: [
    { content: `Students often say "3.08" — Line up the decimal points, not the last digits. Pad 6.3 with a zero so it reads 6.30, the same number of decimal places as 2.45. Then add column by column from the right: hundredths 0 + 5 = 5, tenths 3 + 4 = 7, ones 6 + 2 = 8. The correct total is 6.30 + 2.45 = 8.75. That is nowhere close to 3.08, because lining up the wrong column does not just shift the answer a little, it changes it completely.`, kind: 'common-error' },
    { content: `Students often say "9.40" — Write 15 as 15.00 so it has the same two decimal places as 6.40, then line up the decimal points. The tenths digit on top is 0, which is smaller than the 4 being subtracted, so borrow 1 from the ones column: 15.00 becomes 14 ones and 10 tenths. Now subtract: tenths 10 - 4 = 6, ones 14 - 6 = 8. The correct difference is 15.00 - 6.40 = 8.60, not 9.40.`, kind: 'common-error' },
    { content: 'Line up the decimal points before adding or subtracting, never the last digits.', kind: 'tip' },
    { content: `Pad a shorter decimal with zeros so both numbers have the same number of decimal places. This does not change its value.`, kind: 'tip' },
    { content: `Add or subtract column by column like whole numbers, then drop the decimal point straight down into the answer.`, kind: 'tip' },
    { content: `Estimate first by rounding each number, so you can catch a misaligned or miscarried answer before you trust it.`, kind: 'tip' },
    { content: `Check an addition by subtracting one addend back out of the sum. Check a subtraction by adding the difference back to the number you subtracted.`, kind: 'tip' },
    { content: `Line up decimal points, not last digits. Lining up the rightmost digit shifts every place value and ruins your answer.`, kind: 'common-error' },
    { content: `Always pad with zeros to match decimal places before you add or subtract. Forgetting even one zero can silently drop a column and hide your mistake.`, kind: 'tip' },
    { content: `The decimal point in your answer goes straight down from the decimal points above it. Do not guess where it belongs based on the size of the digits.`, kind: 'vocab-note' },
    { content: `Estimate first by rounding each number to the nearest whole. If your exact answer is far from the estimate, stop and recheck—you probably misaligned or miscarried.`, kind: 'tip' },
    { content: `When a decimal ends with 0 (like 5.60 or 9.40), that zero is real and counts. Do not drop it just because it "looks empty"—it holds a place value.`, kind: 'edge-case' },
    { content: `Check addition with subtraction: subtract one addend from your sum. If you do not get back the other addend, you made a mistake.`, kind: 'tip' },
    { content: `When subtracting, be extra careful with borrowing. After you borrow, cross out the old digit and write the new one so you do not forget and subtract the wrong amount.`, kind: 'common-error' },
    { content: `A whole number like 20 has no decimal part written, but for addition/subtraction it has one: write it as 20.00 to match decimal places.`, kind: 'edge-case' },
  ],
};
