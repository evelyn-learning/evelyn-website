/**
 * Grade 8 Math — Unit 1 CED 1.4: Estimating & Locating Irrational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.estimating-and-locating-irrational-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U1_ESTIMATING_AND_LOCATING_IRRATIONAL_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.estimating-and-locating-irrational-numbers.v1',
  course: 'Grade 8 Math',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Estimating & Locating Irrational Numbers',
  planId: 'evelyn.ms.m8math.estimating-and-locating-irrational-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.estimating-and-locating-irrational-numbers.v1' }],
  theory: [
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'framework', title: 'Trap the root between two perfect squares', content: `TRAP THE ROOT BETWEEN TWO PERFECT SQUARES — you already own the perfect squares 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121 and 144. To locate √50, find the two perfect squares on either side of 50: 49 and 64. Since 49 < 50 < 64, taking square roots gives 7 < √50 < 8. The root is trapped between two consecutive whole numbers, and because 50 is much closer to 49 than to 64, √50 sits much closer to 7.` },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'framework', title: 'Refine to tenths by squaring candidates', content: `REFINE TO TENTHS BY SQUARING CANDIDATES — do not guess the decimal by feel. Pick a candidate with one decimal place and square it: 7.1 × 7.1 = 50.41, which is just past 50, while 7.0 × 7.0 = 49 falls short. So √50 is between 7.0 and 7.1. Now compare the gaps: 50 is 1 away from 49 but only 0.41 away from 50.41, so the square of 7.1 lands closer and √50 ≈ 7.1. The candidate whose square lands closer to the number under the root wins.` },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'framework', title: 'The symbol is exact, the decimal is an estimate', content: `THE SYMBOL IS EXACT, THE DECIMAL IS AN ESTIMATE — √50 names the number exactly. 7.1 is a stand-in that is accurate to one decimal place, and 7.1² = 50.41 is the proof that it is not the real thing. Because √50 is irrational, no decimal you could ever write is exactly equal to it, so this lesson stops at tenths and always writes ≈, never =.` },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'framework', title: 'The estimate tells you where the dot goes', content: `THE ESTIMATE TELLS YOU WHERE THE DOT GOES — an irrational number is a real point on the number line, and the estimate locates it. √50 ≈ 7.1, so its dot goes just past 7, one tenth of the way toward 8. π ≈ 3.14, so its dot goes a little past 3.1. √2 ≈ 1.4, so its dot goes a bit less than halfway from 1 to 2.` },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'framework', title: 'Order a mixed set by estimating to tenths, or by squaring', content: `ORDER A MIXED SET BY ESTIMATING TO TENTHS, OR BY SQUARING — to order √2, 1.5, π and 3.2, turn each root and π into a one-decimal estimate: √2 ≈ 1.4 and π ≈ 3.1. Now compare decimals the way you always have: 1.4 < 1.5 < 3.1 < 3.2, so √2 < 1.5 < π < 3.2. When a root and a decimal look close, square the decimal instead: 1.5² = 2.25 is more than 2, so 1.5 is more than √2. For positive numbers, the bigger square belongs to the bigger number.` },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'framework', title: 'Estimate an expression by truncating first, then computing', content: `ESTIMATE AN EXPRESSION BY TRUNCATING FIRST, THEN COMPUTING — to estimate π², cut π off at two decimal places, π ≈ 3.14, then square: 3.14 × 3.14 = 9.8596. Cut that off at tenths and π² ≈ 9.8, a little less than 10. The same move estimates the mural border: four sides of √50 feet come to about 4 × 7.1 = 28.4 feet of tape.` },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'definition', title: 'perfect square', content: 'a whole number that is some whole number times itself, such as 49 = 7 × 7.' },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'definition', title: 'approximation', content: 'a nearby number used in place of the exact value, written with the symbol ≈.' },
    { loId: 'm8math.estimating-and-locating-irrational-numbers', kind: 'definition', title: 'truncate', content: `to cut a decimal off after a chosen place without rounding, so 3.14159... truncated to hundredths is 3.14.` },
  ],
  methods: [
    {
      title: 'Worked mural root fifty',
      steps: [
        `Trap it. The perfect squares on either side of 50 are 49 = 7² and 64 = 8². Since 49 < 50 < 64, √50 is between 7 and 8, and because 50 is only 1 more than 49, the root is close to 7.`,
        `Square a candidate with one decimal place. Try 7.1: 7.1 × 7.1 = 50.41, which is just above 50. So √50 is less than 7.1.`,
        `Square the candidate just below it. 7.0 × 7.0 = 49, which is below 50. So √50 is between 7.0 and 7.1.`,
        `Pick the closer one. 50 - 49 = 1, while 50.41 - 50 = 0.41. The square of 7.1 lands closer to 50, so √50 ≈ 7.1.`,
        `Check by squaring the estimate: 7.1² = 50.41, within half a square foot of 50, so the estimate holds. Write it with ≈, because 50.41 is not 50 and √50 has no exact decimal.`,
        `Place it. On a number line marked from 7 to 8 in tenths, the dot for √50 goes at the first tick past 7, at about 7.1.`,
        `Estimate the tape. Four sides of about 7.1 feet each: 4 × 7.1 = 28.4, so about 28.4 feet of tape goes around the mural.`,
      ],
      example: { problem: `The mural paint covers 50 square feet. Estimate the side length √50 to one decimal place, place √50 on a number line, and estimate how many feet of tape go around all four sides.`, solution: '√50 ≈ 7.1; the dot goes just past 7 on the number line; about 28.4 feet of tape' },
      relatedLoIds: ['m8math.estimating-and-locating-irrational-numbers'],
    },
    {
      title: 'Worked order mixed set',
      steps: [
        `Estimate every irrational number to tenths first. Trap √2: 1 < 2 < 4, so 1 < √2 < 2. Square candidates: 1.4 × 1.4 = 1.96, just below 2, and 1.5 × 1.5 = 2.25, above 2. The number 2 is 0.04 away from 1.96 and 0.25 away from 2.25, so √2 ≈ 1.4.`,
        `π is the one irrational number you carry as a known truncation: π ≈ 3.14, so to tenths π ≈ 3.1.`,
        `WRONG: writing 1.5 < √2 because "2 is bigger than 1.5, so its root must be bigger too". CORRECT: the 2 under the root is not the size of √2. Compare fairly by squaring the decimal: 1.5² = 2.25, and 2.25 is more than 2, so 1.5 is more than √2. The estimate agrees: 1.4 < 1.5.`,
        `Now every number is a decimal you can line up: 1.4, 1.5, 3.1, 3.2. In order from least to greatest: √2 < 1.5 < π < 3.2.`,
        `Check the close pair at the top the same way: 3.2 × 3.2 = 10.24, while 3.14 × 3.14 = 9.8596, so 3.2 has the bigger square and 3.2 is more than π.`,
        `Place the dots. √2 goes a little less than halfway between 1 and 2. 1.5 goes exactly halfway. π goes just past 3.1, and 3.2 goes one more tick to the right, so the π dot and the 3.2 dot sit close together with π on the left.`,
      ],
      example: { problem: `Order √2, 1.5, π and 3.2 from least to greatest, and place all four on a number line from 0 to 4.`, solution: '√2 < 1.5 < π < 3.2 (about 1.4, 1.5, 3.1 and 3.2 on the number line)' },
      relatedLoIds: ['m8math.estimating-and-locating-irrational-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "√50 = 7.1" — Square it and the mismatch shows: 7.1 × 7.1 = 50.41, not 50. So 7.1 is close to √50 but is not √50. Because √50 is irrational, no decimal that ends is ever exactly equal to it, and no decimal that goes on forever can be written down. The exact name of the number is √50 itself; 7.1 is its estimate to tenths, so the correct statement is √50 ≈ 7.1.`, kind: 'common-error' },
    { content: `Students often say "√50 ≈ 7.5" — Trapping tells you the root is between 7 and 8, but it does not put it in the middle. Square Lena's guess: 7.5 × 7.5 = 56.25, which is far past 50. The number 50 is only 1 above 49 and a full 14 below 64, so the root sits close to 7. Squaring candidates settles it: 7.0² = 49 and 7.1² = 50.41 trap 50, and 50.41 is the closer square, so √50 ≈ 7.1.`, kind: 'common-error' },
    { content: `Trap a square root between the two perfect squares on either side of the number under the root: 49 < 50 < 64 means 7 < √50 < 8.`, kind: 'tip' },
    { content: `Refine to tenths by squaring one-decimal candidates and keeping the one whose square lands closer: 7.1² = 50.41, so √50 ≈ 7.1.`, kind: 'tip' },
    { content: `The symbol is exact and the decimal is an estimate, so write ≈, never =. This lesson stops at one decimal place.`, kind: 'tip' },
    { content: `The estimate tells you where the dot goes on the number line: √50 ≈ 7.1 sits just past 7.`, kind: 'tip' },
    { content: `To order a mixed set, estimate every root and π to tenths and compare as decimals; when two are close, square the decimal and compare squares.`, kind: 'tip' },
    { content: `To estimate an expression such as π², truncate first (π ≈ 3.14) and compute second: π² ≈ 9.8, a little under 10.`, kind: 'tip' },
  ],
};
