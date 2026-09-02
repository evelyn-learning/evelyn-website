/**
 * Grade 6 Math — Multi-Digit & Decimal Operations: Adding & Subtracting Decimals.
 *
 * PROCEDURE-LED lesson for the m6math fan-out. Row 4.1 built fluency dividing
 * multi-digit whole numbers; this row turns to decimals and installs one
 * procedure that handles both addition and subtraction (CCSS 6.NS.B.3): line
 * up the decimal points, pad a shorter decimal with zeros so both numbers
 * have the same number of decimal places, then add or subtract column by
 * column exactly like whole numbers. Both worked examples run the same three
 * moves, and both try_yourself MCQs carry a distractor built from the one
 * trap this lesson is built to kill: lining up the LAST digit of each number
 * instead of the decimal point, which silently shifts every place value by
 * one column the moment the two numbers have a different number of decimal
 * places.
 *
 * SCOPE GUARD: Grade 6 row 4.2 covers ADDING and SUBTRACTING multi-digit
 * decimals with the standard algorithm. It never multiplies or divides a
 * decimal by anything; that is row 4.3, Multiplying & Dividing Decimals, and
 * does not appear here. Every number in this lesson, in every worked
 * example, try_yourself item, and distractor, is positive; signed-number
 * arithmetic is Grade 7 (6.NS.C.5/6.NS.C.7 place and compare signed numbers
 * in Grade 6, but never compute with them) and does not appear anywhere in
 * this file.
 *
 * NOTE ON prerequisites/followUps: row 4.1 (dividing-multi-digit-whole-numbers)
 * and row 4.3 (multiplying-and-dividing-decimals) are authored in the same
 * fan-out batch as this file. `lint-ms-plans` checks prerequisite/followUp
 * resolution across the whole batch, not per file, so both real slugs are
 * written here now even though neither file exists on disk yet.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U4_ADDING_AND_SUBTRACTING_DECIMALS: LessonPlan = {
  id: 'evelyn.ms.m6math.adding-and-subtracting-decimals.v1',
  title: 'Adding & Subtracting Decimals',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.adding-and-subtracting-decimals',
      standard: 'M6MATH-4.2',
      description:
        'Fluently add and subtract multi-digit decimals using the standard algorithm (CCSS 6.NS.B.3).',
    },
  ],
  prerequisites: ['m6math.dividing-multi-digit-whole-numbers'],
  followUps: ['m6math.multiplying-and-dividing-decimals'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a believable wrong answer that comes from misaligning decimal places, so the student wants a rule that always works.',
      script:
        'Your class is raising money for a pizza party. On Monday you collected $12.75. On Tuesday you collected $5.6 more. Quick, in your head: just push the numbers together, 1275 and 56, add them to get 1331, and slide the point in somewhere, and you might write $13.31. That answer looks fine sitting there, but it is wrong, and it is wrong because $12.75 has two digits after the decimal point and $5.6 has only one. Lining numbers up by their last digit instead of by the decimal point silently changes what each digit is worth. Today you get a procedure that lines up decimal points every single time, no matter how many digits after the point each number has, so this trap never catches you again.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-line-up-the-points',
      kind: 'concept',
      goal: 'Install the align-pad-add procedure and the two checks that catch a slip before it becomes a wrong answer.',
      keyIdeas: [
        'PLACE VALUE AFTER THE DECIMAL POINT — the first digit after the decimal point is tenths, the second is hundredths. In 12.75, the 7 is 7 tenths and the 5 is 5 hundredths. Every digit is worth ten times less than the digit to its left.',
        'LINE UP THE DECIMAL POINTS, NOT THE LAST DIGITS — when you stack two decimals to add or subtract them, the decimal points must sit directly on top of each other. That puts tenths under tenths and hundredths under hundredths, exactly like lining up ones under ones in whole-number addition. Lining up the rightmost digit instead, the way you would for two whole numbers, is the single most common way this goes wrong.',
        'PAD A SHORTER DECIMAL WITH ZEROS — 5.6 has one digit after the point, while 12.75 has two. Writing 5.6 as 5.60 does not change its value, because 6 tenths and 60 hundredths are the same amount. Padding both numbers to the same number of decimal places means every column has a digit in it, and none can be skipped by accident.',
        'ADD OR SUBTRACT LIKE WHOLE NUMBERS, THEN DROP THE POINT STRAIGHT DOWN — once every column lines up, add or subtract digit by digit from the right, carrying or borrowing exactly the way you already do with whole numbers. The decimal point in the answer goes directly below the decimal points above it.',
        'ESTIMATE FIRST TO CATCH A MISALIGNED ANSWER — round each number to the nearest whole number before you start. If the exact answer lands far from that estimate, a place value probably slipped somewhere.',
        'CHECK ADDITION WITH SUBTRACTION, AND SUBTRACTION WITH ADDITION — subtracting one addend back out of a sum should return the other addend. Adding a difference back to the number you subtracted should return the number you started with. If it does not, redo the columns.',
      ],
      vocabulary: [
        { term: 'decimal point', definition: 'the dot that separates the whole-number part of a number from its fractional part, such as the point in 12.75.' },
        { term: 'tenths place', definition: 'the first digit after the decimal point, such as the 6 in 5.6, worth six tenths of a whole.' },
        { term: 'align', definition: 'to stack numbers so that digits with the same place value sit directly on top of each other, decimal point under decimal point.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pizza-party-collection',
      kind: 'worked_example',
      problem: 'Your class collected $12.75 on Monday and $5.6 on Tuesday. How much has the class collected in total?',
      steps: [
        'Estimate first. $12.75 rounds to $13, and $5.6 rounds to $6. $13 + $6 = $19, so the exact total should land close to $19.',
        'Write $12.75 above $5.6 and line up the decimal points, point directly under point.',
        'Pad $5.6 with a zero so it has two decimal places like $12.75: $5.6 becomes $5.60. This does not change its value, because 6 tenths and 60 hundredths are the same amount.',
        'Add column by column from the right, carrying when a column totals 10 or more. Hundredths: 5 + 0 = 5. Tenths: 7 + 6 = 13, so write 3 and carry 1 to the ones. Ones: 2 + 5 = 7, plus the carried 1 = 8. Tens: 1 + 0 = 1.',
        'Drop the decimal point straight down between the ones column and the tenths column: the total is $18.35.',
        'WRONG: ignoring the decimal points and adding the digits as if both numbers were whole numbers, 1275 + 56 = 1331, then guessing where the point belongs, gives something like $13.31 or $133.10, and neither is close to the $19 estimate. CORRECT: line up the decimal points, pad $5.6 to $5.60, then add column by column to get $18.35, which is close to the $19 estimate.',
        'Check against the estimate one more time: $18.35 is close to $19, so the answer is reasonable.',
      ],
      answer: '$18.35',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-book-purchase-change',
      kind: 'worked_example',
      problem: 'You have collected $9.4 for the class trip. You spend $3.65 on supplies. How much do you have left?',
      steps: [
        'Estimate first. $9.4 rounds to $9, and $3.65 rounds to $4. $9 - $4 = $5, so the exact difference should land close to $5.',
        'Write $9.4 above $3.65 and line up the decimal points, point directly under point.',
        'Pad $9.4 with a zero so it has two decimal places like $3.65: $9.4 becomes $9.40. This does not change its value, because 4 tenths and 40 hundredths are the same amount.',
        'Subtract column by column from the right, borrowing when the top digit is smaller than the bottom digit. Hundredths: 0 minus 5 needs a borrow, so borrow 1 tenth from the tenths column, making it 10 hundredths minus 5 = 5. Tenths: after lending 1, there are 3 tenths left, so 3 minus 6 needs a borrow too, borrow 1 one from the ones column, making it 13 tenths minus 6 = 7. Ones: after lending 1, there are 8 ones left, so 8 minus 3 = 5.',
        'Drop the decimal point straight down: the difference is $5.75.',
        'WRONG: forgetting to pad $9.4 to $9.40 and dropping the hundredths digit of $3.65 entirely, subtracting only $9.4 - $3.6 to get $5.80. That number is close enough to look believable, which is exactly why this mistake is dangerous, but it is not the same amount. CORRECT: pad both numbers to two decimal places first, then subtract every column including the hundredths, to get $5.75.',
        'Check by adding back: $3.65 + $5.75 = $9.40, which matches the number you started with, and $5.75 is close to the $5 estimate.',
      ],
      answer: '$5.75',
      estimatedMinutes: 3,
    },
    {
      id: 'try-notebook-and-pencils',
      kind: 'try_yourself',
      problem: 'You buy a notebook for $4.25 and a pack of pencils for $1.8. What is the total cost?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$4.43' },
        { id: 'b', text: '$5.05' },
        { id: 'c', text: '$6.05', correct: true },
        { id: 'd', text: '$2.45' },
      ],
      expectedAnswer: '$6.05',
      hints: [
        'Line up the decimal points first. Pad $1.8 with a zero so it reads $1.80, the same number of decimal places as $4.25.',
        'Add column by column from the right: hundredths 5 + 0, tenths 2 + 8 (carry the 1 to the ones), then ones 4 + 1 plus the carried 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-savings-after-a-book',
      kind: 'try_yourself',
      problem: 'You have $20 saved. You spend $8.45 on a book. How much money do you have left?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$11.55', correct: true },
        { id: 'b', text: '$12.45' },
        { id: 'c', text: '$28.45' },
        { id: 'd', text: '$11.45' },
      ],
      expectedAnswer: '$11.55',
      hints: [
        'Write $20 as $20.00 so it lines up with the two decimal places in $8.45, then line up the decimal points.',
        'Borrow across the decimal point the same way you would borrow across a zero in whole-number subtraction: $20.00 minus $8.45 needs regrouping before you can subtract in the tenths and hundredths columns.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-flour-and-sugar',
      kind: 'try_yourself',
      problem: 'A recipe calls for 2.4 cups of flour and 0.75 cups of sugar. How many cups of dry ingredients is that in total? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3.15',
      hints: [
        'Line up the decimal points, and pad 2.4 with a zero so it reads 2.40, the same number of decimal places as 0.75.',
        'Add column by column from the right: hundredths 0 + 5, tenths 4 + 7 (carry the 1 to the ones), then ones 2 + 0 plus the carried 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lined-up-the-wrong-digit',
      kind: 'misconception_check',
      question: 'A student adds 6.3 + 2.45 and gets 3.08. Another student subtracts 15 minus 6.40 and gets 9.40. What went wrong in each case, and what are the correct answers?',
      commonErrors: [
        {
          answer: '3.08',
          misconception:
            'Lining up the last digit of each number instead of lining up the decimal points. This makes the tenths digit of 6.3 add to the hundredths digit of 2.45, shifting every place value by one column and folding a carry into the wrong spot.',
          correctsTo:
            'Line up the decimal points, not the last digits. Pad 6.3 with a zero so it reads 6.30, the same number of decimal places as 2.45. Then add column by column from the right: hundredths 0 + 5 = 5, tenths 3 + 4 = 7, ones 6 + 2 = 8. The correct total is 6.30 + 2.45 = 8.75. That is nowhere close to 3.08, because lining up the wrong column does not just shift the answer a little, it changes it completely.',
        },
        {
          answer: '9.40',
          misconception:
            'Subtracting the whole-number parts separately, 15 minus 6 equals 9, and then just copying the decimal part of the number being subtracted onto the end, instead of lining up the decimal points and borrowing when the top digit is smaller than the bottom digit.',
          correctsTo:
            'Write 15 as 15.00 so it has the same two decimal places as 6.40, then line up the decimal points. The tenths digit on top is 0, which is smaller than the 4 being subtracted, so borrow 1 from the ones column: 15.00 becomes 14 ones and 10 tenths. Now subtract: tenths 10 - 4 = 6, ones 14 - 6 = 8. The correct difference is 15.00 - 6.40 = 8.60, not 9.40.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Line up the decimal points before adding or subtracting, never the last digits.',
        'Pad a shorter decimal with zeros so both numbers have the same number of decimal places. This does not change its value.',
        'Add or subtract column by column like whole numbers, then drop the decimal point straight down into the answer.',
        'Estimate first by rounding each number, so you can catch a misaligned or miscarried answer before you trust it.',
        'Check an addition by subtracting one addend back out of the sum. Check a subtraction by adding the difference back to the number you subtracted.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Adding & Subtracting Decimals' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
