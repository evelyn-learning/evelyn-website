/**
 * Grade 8 Math — Real Numbers: Rational, Irrational & Roots: Estimating &
 * Locating Irrational Numbers.
 *
 * PROCEDURE-LED. The student arrives knowing that √50 is irrational and that
 * √49 = 7; what is new is a repeatable method for saying WHERE √50 is
 * (CCSS 8.NS.A.2). The concept segment is an ordered recipe: trap the root
 * between the two perfect squares on either side, refine to one decimal place
 * by squaring one-decimal candidates and keeping the closer square, write the
 * result with ≈ because the symbol is exact and the decimal is not, then use
 * the estimate to place the number on a number line, to order it against
 * plain decimals and π, and to estimate an expression such as π² by
 * truncating first and computing second. Both worked examples run the same
 * trap-square-compare moves, and every estimate ends with a squaring check.
 * Two traps this plan is built to kill: guessing the decimal by feel (the
 * root of a number "between 49 and 64" is NOT halfway between 7 and 8), and
 * treating the tenths estimate as the exact value (7.1² = 50.41, not 50).
 *
 * SCOPE GUARD: Grade 8 row 1.4 traps √n between consecutive perfect squares,
 * refines to one decimal place by squaring candidates (√50 ≈ 7.1), places
 * irrational numbers on a number line, compares/orders mixed sets (√2, 1.5,
 * π, 3.2), and uses truncations to estimate expressions like π² ≈ 9.8.
 * Withholds: decimal expansion past tenths, radical arithmetic →
 * `alg1-u9-simplifying-radicals.ts`. Concretely: every root estimate in this
 * file is stated to exactly one decimal place, and no root is ever refined to
 * hundredths. The only digits past tenths that appear are (a) π ≈ 3.14,
 * carried as a known truncation and never derived, and (b) the squares of
 * one-decimal or two-decimal candidates, such as 7.1² = 50.41 and
 * 3.14² = 9.8596, which are the arithmetic a tenths decision rests on, not a
 * decimal expansion of the root. No radical is ever rewritten (√50 stays √50
 * and never becomes 5√2), and no two radicals are added, multiplied or
 * combined symbolically; the one expression containing a radical, the mural
 * border 4 × √50, is estimated as 4 × 7.1 = 28.4, a decimal estimate of an
 * expression as the standard asks, not radical arithmetic. Sideways: the plan
 * never makes evaluating a perfect-square root or solving x² = p its objective
 * (row 1.3, assumed — the perfect-square ladder is recalled in one keyIdea and
 * √64 = 8 appears only as a trapping step), and never asks the student to
 * classify a number as rational or irrational (row 1.2, assumed — the
 * irrationality of √50 is recalled only to explain why the estimate carries ≈
 * and not =). Below, assumed and not re-taught: comparing and ordering
 * decimals such as 1.5 < 3.2 (`m7math-u1-comparing-and-ordering-rationals.ts`)
 * and whole-number exponents (`m6math` row 7.1). Salvaged from
 * `g8-math-square-roots-irrationals.ts`: the between-two-perfect-squares
 * example shape only; its refinement of √50 to 7.07 (hundredths) was
 * deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U1_ESTIMATING_AND_LOCATING_IRRATIONAL_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m8math.estimating-and-locating-irrational-numbers.v1',
  title: 'Estimating & Locating Irrational Numbers',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.estimating-and-locating-irrational-numbers',
      standard: 'M8MATH-1.4',
      description:
        'Trap √n between consecutive perfect squares, refine to one decimal place by squaring candidates (√50 ≈ 7.1), place irrational numbers on a number line, and compare/order mixed sets (√2, 1.5, π, 3.2); use truncations to estimate expressions like π² ≈ 9.8 (CCSS 8.NS.A.2).',
    },
  ],
  prerequisites: ['m8math.square-roots-and-cube-roots'],
  followUps: ['m8math.product-quotient-and-power-of-a-power-rules'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put an irrational side length in front of a tape measure, so the student feels why "between 7 and 8" is not good enough and a one-decimal estimate is the real goal.',
      script:
        'Your art class is painting a square mural on the wall outside the gym, and the can of paint you bought covers exactly 50 square feet. To tape off the square, you need the length of one side. A side of 7 feet gives 7 × 7 = 49 square feet, a hair too small. A side of 8 feet gives 8 × 8 = 64, far too big. The side you want is √50, and from earlier in this unit you know that number is irrational: its decimal runs forever and never repeats, so no tape measure can show it exactly. What a tape measure CAN show is tenths. Today you learn to pin any square root down to one decimal place, to put it on a number line, and to line irrational numbers up against ordinary decimals like 1.5 and 3.2.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trap-square-compare',
      kind: 'concept',
      goal: 'Install the trap-then-square recipe for a one-decimal estimate, the ≈ discipline that keeps the symbol exact, and the two uses of the estimate: placing on a number line and ordering a mixed set.',
      keyIdeas: [
        'TRAP THE ROOT BETWEEN TWO PERFECT SQUARES — you already own the perfect squares 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121 and 144. To locate √50, find the two perfect squares on either side of 50: 49 and 64. Since 49 < 50 < 64, taking square roots gives 7 < √50 < 8. The root is trapped between two consecutive whole numbers, and because 50 is much closer to 49 than to 64, √50 sits much closer to 7.',
        'REFINE TO TENTHS BY SQUARING CANDIDATES — do not guess the decimal by feel. Pick a candidate with one decimal place and square it: 7.1 × 7.1 = 50.41, which is just past 50, while 7.0 × 7.0 = 49 falls short. So √50 is between 7.0 and 7.1. Now compare the gaps: 50 is 1 away from 49 but only 0.41 away from 50.41, so the square of 7.1 lands closer and √50 ≈ 7.1. The candidate whose square lands closer to the number under the root wins.',
        'THE SYMBOL IS EXACT, THE DECIMAL IS AN ESTIMATE — √50 names the number exactly. 7.1 is a stand-in that is accurate to one decimal place, and 7.1² = 50.41 is the proof that it is not the real thing. Because √50 is irrational, no decimal you could ever write is exactly equal to it, so this lesson stops at tenths and always writes ≈, never =.',
        'THE ESTIMATE TELLS YOU WHERE THE DOT GOES — an irrational number is a real point on the number line, and the estimate locates it. √50 ≈ 7.1, so its dot goes just past 7, one tenth of the way toward 8. π ≈ 3.14, so its dot goes a little past 3.1. √2 ≈ 1.4, so its dot goes a bit less than halfway from 1 to 2.',
        'ORDER A MIXED SET BY ESTIMATING TO TENTHS, OR BY SQUARING — to order √2, 1.5, π and 3.2, turn each root and π into a one-decimal estimate: √2 ≈ 1.4 and π ≈ 3.1. Now compare decimals the way you always have: 1.4 < 1.5 < 3.1 < 3.2, so √2 < 1.5 < π < 3.2. When a root and a decimal look close, square the decimal instead: 1.5² = 2.25 is more than 2, so 1.5 is more than √2. For positive numbers, the bigger square belongs to the bigger number.',
        'ESTIMATE AN EXPRESSION BY TRUNCATING FIRST, THEN COMPUTING — to estimate π², cut π off at two decimal places, π ≈ 3.14, then square: 3.14 × 3.14 = 9.8596. Cut that off at tenths and π² ≈ 9.8, a little less than 10. The same move estimates the mural border: four sides of √50 feet come to about 4 × 7.1 = 28.4 feet of tape.',
      ],
      vocabulary: [
        { term: 'perfect square', definition: 'a whole number that is some whole number times itself, such as 49 = 7 × 7.' },
        { term: 'approximation', definition: 'a nearby number used in place of the exact value, written with the symbol ≈.' },
        { term: 'truncate', definition: 'to cut a decimal off after a chosen place without rounding, so 3.14159... truncated to hundredths is 3.14.' },
      ],
      suggestedTools: ['show_number_line', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mural-root-fifty',
      kind: 'worked_example',
      problem: 'The mural paint covers 50 square feet. Estimate the side length √50 to one decimal place, place √50 on a number line, and estimate how many feet of tape go around all four sides.',
      steps: [
        'Trap it. The perfect squares on either side of 50 are 49 = 7² and 64 = 8². Since 49 < 50 < 64, √50 is between 7 and 8, and because 50 is only 1 more than 49, the root is close to 7.',
        'Square a candidate with one decimal place. Try 7.1: 7.1 × 7.1 = 50.41, which is just above 50. So √50 is less than 7.1.',
        'Square the candidate just below it. 7.0 × 7.0 = 49, which is below 50. So √50 is between 7.0 and 7.1.',
        'Pick the closer one. 50 - 49 = 1, while 50.41 - 50 = 0.41. The square of 7.1 lands closer to 50, so √50 ≈ 7.1.',
        'Check by squaring the estimate: 7.1² = 50.41, within half a square foot of 50, so the estimate holds. Write it with ≈, because 50.41 is not 50 and √50 has no exact decimal.',
        'Place it. On a number line marked from 7 to 8 in tenths, the dot for √50 goes at the first tick past 7, at about 7.1.',
        'Estimate the tape. Four sides of about 7.1 feet each: 4 × 7.1 = 28.4, so about 28.4 feet of tape goes around the mural.',
      ],
      answer: '√50 ≈ 7.1; the dot goes just past 7 on the number line; about 28.4 feet of tape',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-mixed-set',
      kind: 'worked_example',
      problem: 'Order √2, 1.5, π and 3.2 from least to greatest, and place all four on a number line from 0 to 4.',
      steps: [
        'Estimate every irrational number to tenths first. Trap √2: 1 < 2 < 4, so 1 < √2 < 2. Square candidates: 1.4 × 1.4 = 1.96, just below 2, and 1.5 × 1.5 = 2.25, above 2. The number 2 is 0.04 away from 1.96 and 0.25 away from 2.25, so √2 ≈ 1.4.',
        'π is the one irrational number you carry as a known truncation: π ≈ 3.14, so to tenths π ≈ 3.1.',
        'WRONG: writing 1.5 < √2 because "2 is bigger than 1.5, so its root must be bigger too". CORRECT: the 2 under the root is not the size of √2. Compare fairly by squaring the decimal: 1.5² = 2.25, and 2.25 is more than 2, so 1.5 is more than √2. The estimate agrees: 1.4 < 1.5.',
        'Now every number is a decimal you can line up: 1.4, 1.5, 3.1, 3.2. In order from least to greatest: √2 < 1.5 < π < 3.2.',
        'Check the close pair at the top the same way: 3.2 × 3.2 = 10.24, while 3.14 × 3.14 = 9.8596, so 3.2 has the bigger square and 3.2 is more than π.',
        'Place the dots. √2 goes a little less than halfway between 1 and 2. 1.5 goes exactly halfway. π goes just past 3.1, and 3.2 goes one more tick to the right, so the π dot and the 3.2 dot sit close together with π on the left.',
      ],
      answer: '√2 < 1.5 < π < 3.2 (about 1.4, 1.5, 3.1 and 3.2 on the number line)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-trap-root-seventy-five',
      kind: 'try_yourself',
      problem: 'Between which two consecutive whole numbers does √75 lie?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7 and 8' },
        { id: 'b', text: '8 and 9', correct: true },
        { id: 'c', text: '37 and 38' },
        { id: 'd', text: '9 and 10' },
      ],
      expectedAnswer: '8 and 9',
      hints: [
        'List the perfect squares near 75: 49, 64, 81. Which two sit on either side of 75?',
        '64 < 75 < 81, and √64 = 8 while √81 = 9. The root is trapped between those two whole numbers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-order-mixed-set',
      kind: 'try_yourself',
      problem: 'Which list shows √15, 4.1, √20 and 4.5 in order from least to greatest?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4.1, 4.5, √15, √20' },
        { id: 'b', text: '√15, 4.1, 4.5, √20' },
        { id: 'c', text: '4.1, √15, √20, 4.5' },
        { id: 'd', text: '√15, 4.1, √20, 4.5', correct: true },
      ],
      expectedAnswer: '√15, 4.1, √20, 4.5',
      hints: [
        'Trap each root first. 9 < 15 < 16 puts √15 between 3 and 4, so √15 is less than 4.1. 16 < 20 < 25 puts √20 between 4 and 5, which is where 4.1 and 4.5 live too, so that trio needs a closer look.',
        'Square the decimals: 4.1 × 4.1 = 16.81 and 4.5 × 4.5 = 20.25. The number 20 sits between those two squares, so √20 sits between 4.1 and 4.5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-root-forty',
      kind: 'try_yourself',
      problem: 'Estimate √40 to one decimal place. Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '6.3',
      hints: [
        'Trap it: 36 < 40 < 49, so √40 is between 6 and 7, and 40 is closer to 36 than to 49, so start with candidates near 6.',
        'Square 6.3 and 6.4. One square is below 40 and one is above. Keep the candidate whose square lands closer to 40.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-exact-and-midpoint',
      kind: 'misconception_check',
      question: 'Dev and Lena both estimate √50. Dev writes √50 = 7.1 and says that is its exact value. Lena writes √50 ≈ 7.5, because 50 is between 49 and 64, so the root is between 7 and 8, and she picked the middle. What went wrong in each case?',
      commonErrors: [
        {
          answer: '√50 = 7.1',
          misconception: 'Treating the one-decimal estimate as the exact value of the root, and writing = where ≈ belongs.',
          correctsTo:
            'Square it and the mismatch shows: 7.1 × 7.1 = 50.41, not 50. So 7.1 is close to √50 but is not √50. Because √50 is irrational, no decimal that ends is ever exactly equal to it, and no decimal that goes on forever can be written down. The exact name of the number is √50 itself; 7.1 is its estimate to tenths, so the correct statement is √50 ≈ 7.1.',
        },
        {
          answer: '√50 ≈ 7.5',
          misconception: 'Assuming the root sits halfway between the two trapping whole numbers, without squaring a candidate to see where it really lands.',
          correctsTo:
            'Trapping tells you the root is between 7 and 8, but it does not put it in the middle. Square Lena\'s guess: 7.5 × 7.5 = 56.25, which is far past 50. The number 50 is only 1 above 49 and a full 14 below 64, so the root sits close to 7. Squaring candidates settles it: 7.0² = 49 and 7.1² = 50.41 trap 50, and 50.41 is the closer square, so √50 ≈ 7.1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Trap a square root between the two perfect squares on either side of the number under the root: 49 < 50 < 64 means 7 < √50 < 8.',
        'Refine to tenths by squaring one-decimal candidates and keeping the one whose square lands closer: 7.1² = 50.41, so √50 ≈ 7.1.',
        'The symbol is exact and the decimal is an estimate, so write ≈, never =. This lesson stops at one decimal place.',
        'The estimate tells you where the dot goes on the number line: √50 ≈ 7.1 sits just past 7.',
        'To order a mixed set, estimate every root and π to tenths and compare as decimals; when two are close, square the decimal and compare squares.',
        'To estimate an expression such as π², truncate first (π ≈ 3.14) and compute second: π² ≈ 9.8, a little under 10.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Estimating & Locating Irrational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
