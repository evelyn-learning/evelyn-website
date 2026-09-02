/**
 * Grade 6 Math — Multi-Digit & Decimal Operations: Multiplying & Dividing
 * Decimals.
 *
 * PROCEDURE-LED fan-out row. Row 4.2 taught adding and subtracting decimals
 * by lining up the decimal point; this row moves to multiplying and
 * dividing, where lining up columns is not the rule — placing the decimal
 * point correctly at the END is. The two traps this plan is built to kill
 * are exactly the two named in the brief: misplacing the decimal point in a
 * product, and shifting the decimal point in only ONE of the divisor/
 * dividend pair instead of both. The estimate-first check (round to a
 * friendly number, multiply or divide THAT) is taught as the single tool
 * that catches both traps, and every worked example and try_yourself item
 * uses it before computing.
 *
 * SCOPE GUARD: Grade 6 row 4.3 multiplies and divides multi-digit decimals
 * using the standard algorithm. Every decimal, product, and quotient in this
 * plan is positive; signed decimal arithmetic never appears here, including
 * in distractors, because operating on negative or rational numbers is
 * Grade 7 (G7 U1-U2). Adding and subtracting decimals is row 4.2's skill and
 * is not taught here; the GCF/LCM/distributive property row (4.4) is not
 * taught here either. No percent, ratio, or unit-rate reasoning appears.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 4.2 (adding-and-subtracting-decimals) -> 4.3 (this row) -> 4.4
 * (gcf-lcm-and-the-distributive-property). Both neighbors are authored in
 * the same fan-out batch and registered together with this file, so the
 * real slugs are used below rather than empty arrays.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U4_MULTIPLYING_AND_DIVIDING_DECIMALS: LessonPlan = {
  id: 'evelyn.ms.m6math.multiplying-and-dividing-decimals.v1',
  title: 'Multiplying & Dividing Decimals',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.multiplying-and-dividing-decimals',
      standard: 'M6MATH-4.3',
      description:
        'Fluently multiply and divide multi-digit decimals using the standard algorithm (CCSS 6.NS.B.3).',
    },
  ],
  prerequisites: ['m6math.adding-and-subtracting-decimals'],
  followUps: ['m6math.gcf-lcm-and-the-distributive-property'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up both operations with one relatable scenario and preview the estimate-first check.',
      script:
        'Your class is stocking up for a camping trip. Bags of trail mix cost $2.15 each, and you need 6 bags. About how much will that cost? Now flip it around: you have a 9.6-meter coil of rope and you need to cut it into 0.8-meter pieces for tent stakes. About how many pieces will you get? The first question is multiplication, because you know the price of one bag and want the total for many. The second is division, because you know a total length and want to split it into equal pieces. Today you get the standard way to do both with decimals, plus one habit that catches the single most common decimal mistake: putting the decimal point in the wrong place. That habit is estimating first, before you compute anything exactly.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-place-the-point',
      kind: 'concept',
      goal: 'Install the multiply-then-count-places rule, the shift-both-together division rule, and the estimate-first check that catches a slip in either one.',
      keyIdeas: [
        'MULTIPLY LIKE WHOLE NUMBERS, THEN COUNT DECIMAL PLACES — to multiply two decimals, ignore the decimal points and multiply the digits as whole numbers first. Then count the TOTAL number of decimal places in both factors added together, and place the decimal point that many places from the right in the product.',
        'ESTIMATE FIRST TO CATCH A MISPLACED DECIMAL — round each factor to a friendly nearby number and multiply those instead. If $2.15 times 6 rounds to about $2 times 6, the real answer should land close to $12, not close to $120 or close to $1.20. Estimating first is what tells you whether your placed decimal point is even in the right neighborhood.',
        'TO DIVIDE BY A DECIMAL, SHIFT THE DIVISOR TO A WHOLE NUMBER FIRST — move the decimal point in the divisor to the right until it becomes a whole number. Whatever power of 10 you used to do that, you must apply to the dividend too.',
        'SHIFT THE DIVIDEND BY THE EXACT SAME NUMBER OF PLACES — move the decimal point in the dividend to the right the SAME number of places you moved it in the divisor, adding zeros if you run out of digits. This does not change the answer, because multiplying both numbers by the same power of 10 does not change how many times the divisor fits into the dividend. Once both are shifted, divide as you would with whole numbers.',
        'ESTIMATE A DIVISION TOO, BEFORE SHIFTING ANYTHING — if the divisor is a little less than 1, like 0.8, the exact answer will be a little BIGGER than the dividend, not smaller. Knowing that in advance catches the most common division slip: shifting only one of the two decimal points and landing on an answer that is off by a factor of 10.',
        'CHECK BY MULTIPLYING BACK — for a division, the quotient times the ORIGINAL divisor must return the ORIGINAL dividend. For a multiplication, the product should be close to the estimate. Either check, done every time, catches a misplaced decimal before it becomes a wrong answer.',
      ],
      vocabulary: [
        { term: 'product', definition: 'the answer to a multiplication problem.' },
        { term: 'quotient', definition: 'the answer to a division problem.' },
        { term: 'divisor', definition: 'the number you are dividing by. In decimal division, this is the number whose decimal point gets shifted first.' },
        { term: 'dividend', definition: 'the number being divided. Its decimal point shifts by the same amount as the divisor.' },
      ],
      suggestedTools: ['show_equation', 'show_problem'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trail-mix-multiplication',
      kind: 'worked_example',
      problem: 'Bags of trail mix cost $2.15 each. You buy 6 bags for a camping trip. How much do you spend in total?',
      steps: [
        'Estimate first: $2.15 is close to $2, and 2 times 6 is 12, so the exact answer should land close to $12.',
        'Multiply as if there were no decimal points at all: 215 times 6. 215 times 6 is 1290.',
        'Count decimal places: 2.15 has 2 decimal places, and 6 has 0 decimal places, so the product needs 2 decimal places total.',
        'Place the decimal point 2 places from the right in 1290, which gives 12.90.',
        'WRONG: placing the decimal point somewhere else, such as writing 129.0 or 1.290, without checking it against the estimate. CORRECT: 12.90, because that is the only placement that lands near the estimate of $12.',
        'Compare to the estimate one more time: 12.90 is close to 12, so the decimal point is in the right place.',
      ],
      answer: '$12.90',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rope-into-stakes-division',
      kind: 'worked_example',
      problem: 'You spent $9.60 total on sticker sheets. Each sticker sheet costs $0.80. How many sticker sheets did you buy?',
      steps: [
        'Estimate first: $0.80 is a little less than $1, and dividing by a number less than 1 makes the answer BIGGER than the amount you started with, not smaller. So expect an answer a little more than 9.6, somewhere around 10 to 12.',
        'Shift the decimal point in the divisor, 0.80, to the right until it becomes a whole number: 0.80 becomes 80. That shift moved the decimal point 2 places, which means both numbers were multiplied by 100.',
        'Shift the decimal point in the dividend, 9.60, the SAME number of places: 9.60 becomes 960.',
        'Now divide the whole numbers: 960 divided by 80 is 12.',
        'WRONG: shifting only the divisor and forgetting to shift the dividend too, dividing 9.6 by 80 to get 0.12 — a far-too-small answer that does not match the estimate at all. CORRECT: shift both decimal points by the same amount, so the real division is 960 divided by 80, which is 12.',
        'Check by multiplying back: 12 times $0.80 is $9.60, which matches the amount spent. And 12 is a little more than 9.6, exactly as the estimate predicted.',
      ],
      answer: '12 sticker sheets',
      estimatedMinutes: 4,
    },
    {
      id: 'try-granola-bars-multiplication',
      kind: 'try_yourself',
      problem: 'Granola bars cost $1.45 each. You buy 4 of them for a class trip. How much do you spend in total?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$580.00' },
        { id: 'b', text: '$58.00' },
        { id: 'c', text: '$0.58' },
        { id: 'd', text: '$5.80', correct: true },
      ],
      expectedAnswer: '$5.80',
      hints: [
        'Estimate first: $1.45 is close to $1.50, and 1.50 times 4 is 6, so the exact answer should land close to $6.',
        'Multiply as whole numbers: 145 times 4 is 580. Then count decimal places: 1.45 has 2 decimal places and 4 has 0, so place the decimal point 2 places from the right in 580.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rope-pieces-division',
      kind: 'try_yourself',
      problem: 'A 6.4-meter rope is cut into equal pieces that are each 0.4 meters long. How many pieces are there?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1.6' },
        { id: 'b', text: '16', correct: true },
        { id: 'c', text: '160' },
        { id: 'd', text: '0.16' },
      ],
      expectedAnswer: '16',
      hints: [
        'Estimate first: 0.4 is less than 1, so dividing by it makes the answer BIGGER than 6.4, not smaller. Expect an answer well above 6.',
        'Shift the decimal point in the divisor 0.4 to make it a whole number: 0.4 becomes 4. Shift the dividend 6.4 the SAME number of places: 6.4 becomes 64. Now divide 64 by 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-bracelet-string',
      kind: 'try_yourself',
      problem: 'You are making friendship bracelets for a class gift exchange. Each bracelet uses 0.75 meters of string. You have 4.5 meters of string. How many full bracelets can you make? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Estimate first: 0.75 is a little less than 1, so dividing 4.5 by 0.75 gives an answer a little more than 4.5 — expect a small whole number, somewhere around 5 or 6.',
        'Shift the decimal point in the divisor 0.75 to make it a whole number: 0.75 becomes 75. Shift the dividend 4.5 the SAME number of places: 4.5 becomes 450. Now divide 450 by 75.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-decimal-shift-only',
      kind: 'misconception_check',
      question: 'One student multiplies 4.6 times 2.3 and writes 105.8. Another student divides 6.3 by 0.9 and writes 0.7. What went wrong in each case?',
      commonErrors: [
        {
          answer: '105.8',
          misconception:
            'Counted only one of the two decimal places when placing the decimal point in the product, instead of adding together the decimal places from BOTH factors.',
          correctsTo:
            'Multiply as whole numbers first: 46 times 23 is 1058. Then count the decimal places in both factors together: 4.6 has 1 decimal place and 2.3 has 1 decimal place, for a total of 2. Place the decimal point 2 places from the right in 1058 to get 10.58. Check with an estimate: 4.6 is close to 5 and 2.3 is close to 2, and 5 times 2 is 10, so 10.58 matches the estimate while 105.8 does not.',
        },
        {
          answer: '0.7',
          misconception:
            'Shifted the decimal point in the divisor to make it a whole number (0.9 became 9) but left the decimal point in the dividend exactly where it started, instead of shifting it the same number of places.',
          correctsTo:
            'Shift both decimal points by the same number of places: multiply both 0.9 and 6.3 by 10, so the divisor becomes 9 and the dividend becomes 63. Divide 63 by 9 to get 7. Check by multiplying back: 7 times 0.9 is 6.3, which matches the original dividend. An estimate also catches this: 0.9 is close to 1, so 6.3 divided by something close to 1 should be close to 6.3, not 0.7.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'To multiply decimals, multiply the digits as whole numbers, then count the total decimal places in BOTH factors and place the decimal point that many places from the right in the product.',
        'To divide by a decimal, shift the decimal point in the divisor to the right until it is a whole number, then shift the decimal point in the dividend the SAME number of places.',
        'Shifting both decimal points by the same amount never changes the answer, because both numbers are multiplied by the same power of 10.',
        'Estimate first with friendly rounded numbers, so you know roughly how big the exact answer should be before you compute it.',
        'Misplacing the decimal point in a product, and shifting only ONE of the two decimal points in a division, are the two most common decimal mistakes — an estimate catches both.',
        'Check every answer: for multiplication, compare the product to the estimate; for division, multiply the quotient by the original divisor and confirm it returns the original dividend.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Multiplying & Dividing Decimals' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
