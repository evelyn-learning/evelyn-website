/**
 * Grade 6 Math — Unit 3 CED 3.3: Dividing Mixed Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.dividing-mixed-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U3_DIVIDING_MIXED_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.dividing-mixed-numbers.v1',
  course: 'Grade 6 Math',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Dividing Mixed Numbers',
  planId: 'evelyn.ms.m6math.dividing-mixed-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.dividing-mixed-numbers.v1' }],
  theory: [
    { loId: 'm6math.dividing-mixed-numbers', kind: 'framework', title: 'Convert any mixed number before dividing', content: `CONVERT ANY MIXED NUMBER BEFORE DIVIDING — a mixed number cannot go straight into keep-change-flip. Turn every mixed number in the problem into an improper fraction first, whether it is the dividend, the divisor, or both.` },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'framework', title: 'How to convert', content: `HOW TO CONVERT — multiply the whole number by the denominator, add the numerator, and keep the same denominator. For 2 and 1/4: 2 × 4 = 8, plus 1 is 9, over the same denominator, so 2 and 1/4 = 9/4.` },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'framework', title: 'Then divide exactly as before', content: `THEN DIVIDE EXACTLY AS BEFORE — once both numbers are improper fractions, use the same three moves from the last lesson: keep the first fraction, change the division sign to multiplication, and flip the second fraction into its reciprocal. Multiply straight across.` },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'framework', title: 'Only flip the converted form', content: `ONLY FLIP THE CONVERTED FORM — the fraction that gets flipped is the improper-fraction version of the divisor, never the mixed number itself. Flipping "1 and 1/2" into something like "1 and 2/1" is not a real reciprocal and cannot be multiplied correctly.` },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'framework', title: 'Simplify, convert back, and check', content: `SIMPLIFY, CONVERT BACK, AND CHECK — simplify the result, rewrite it as a mixed number if that is the clearest form, and check by multiplying the answer by the divisor to get the dividend back. The size test still applies: dividing by a number less than 1 makes the answer bigger than the dividend, and dividing by a number greater than 1 makes the answer smaller.` },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'definition', title: 'mixed number', content: 'a whole number and a fraction written together, like 2 and 1/4.' },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'definition', title: 'improper fraction', content: `a fraction where the top number is greater than or equal to the bottom number, like 9/4.` },
    { loId: 'm6math.dividing-mixed-numbers', kind: 'definition', title: 'reciprocal', content: 'a fraction flipped over; a fraction times its reciprocal always equals 1.' },
  ],
  methods: [
    {
      title: 'Worked ribbon bows',
      steps: [
        'Convert the mixed number first: 2 and 1/4 = (2 × 4 + 1)/4 = 9/4.',
        'Size test: 3/8 is less than 1, so the answer will be bigger than 2 and 1/4.',
        `KEEP 9/4, CHANGE the sign to multiplication, and FLIP 3/8 into its reciprocal, 8/3. The problem is now 9/4 × 8/3.`,
        'Multiply straight across. Top: 9 × 8 = 72. Bottom: 4 × 3 = 12. That gives 72/12.',
        'Simplify. 72/12 = 6.',
        `Check by multiplying back: 6 × 3/8 = 18/8, which simplifies to 9/4, the same as 2 and 1/4. The answer holds.`,
        'Read it back into the story: 6 full bows, with no ribbon left over.',
      ],
      example: { problem: `You have 2 and 1/4 yards of ribbon and each gift bow uses 3/8 of a yard. Work out 2 and 1/4 ÷ 3/8.`, solution: '6' },
      relatedLoIds: ['m6math.dividing-mixed-numbers'],
    },
    {
      title: 'Worked both mixed',
      steps: [
        `Size test first: 1 and 1/2 is greater than 1, so the answer will be smaller than 3 and 3/4.`,
        `Convert BOTH mixed numbers to improper fractions before doing anything else: 3 and 3/4 = (3 × 4 + 3)/4 = 15/4. 1 and 1/2 = (1 × 2 + 1)/2 = 3/2.`,
        `WRONG: flipping the mixed number before converting it, turning 1 and 1/2 into something like 1 and 2/1. That is not a real reciprocal and cannot be multiplied correctly. CORRECT: convert first, then flip. The reciprocal of 3/2 is 2/3.`,
        `KEEP 15/4, CHANGE the sign to multiplication, and FLIP 3/2 into 2/3. The problem is now 15/4 × 2/3.`,
        `Multiply straight across. Top: 15 × 2 = 30. Bottom: 4 × 3 = 12. That gives 30/12.`,
        'Simplify. 30/12 = 5/2, which is the same as 2 and 1/2.',
        `Check by multiplying back: 5/2 × 3/2 = 15/4, the same as 3 and 3/4. The answer holds.`,
        `Size check: 2 and 1/2 is smaller than 3 and 3/4, exactly as the size test predicted in step 1.`,
      ],
      example: { problem: 'Work out 3 and 3/4 ÷ 1 and 1/2.', solution: '5/2, which is 2 and 1/2' },
      relatedLoIds: ['m6math.dividing-mixed-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "2 and 2/3" — A mixed-number division problem cannot be split into a whole-number division and a fraction division done side by side. Convert both mixed numbers to improper fractions first: 2 and 1/3 = 7/3 and 1 and 1/2 = 3/2. Then keep 7/3, change the sign to multiplication, and flip 3/2 into 2/3: 7/3 × 2/3 = 14/9, which is 1 and 5/9. Check by multiplying back: 1 and 5/9 × 1 and 1/2 = 14/9 × 3/2 = 42/18, which simplifies to 7/3, the same as 2 and 1/3.`, kind: 'common-error' },
    { content: `Students often say "4 and 2/3" — Every mixed number in the problem must be converted before anything gets flipped, including the divisor. 1 and 1/2 = 3/2, not just 1/2, so its reciprocal is 2/3, not 2/1. The correct setup is 7/3 × 2/3 = 14/9, which is 1 and 5/9. Multiplying 4 and 2/3 back by 1 and 1/2 gives 7, which is not 2 and 1/3, so 4 and 2/3 cannot be the answer.`, kind: 'common-error' },
    { content: `A mixed number cannot be used directly in keep-change-flip. Convert it to an improper fraction first: multiply the whole number by the denominator, add the numerator, and keep the same denominator.`, kind: 'tip' },
    { content: `Convert every mixed number in the problem, both dividend and divisor, before doing anything else.`, kind: 'tip' },
    { content: `Once both numbers are improper fractions, divide exactly as before: keep the first, change ÷ to ×, flip the second into its reciprocal, and multiply straight across.`, kind: 'tip' },
    { content: `Only flip the improper-fraction form of the divisor. Flipping a mixed number itself, without converting it first, is not a real reciprocal.`, kind: 'tip' },
    { content: `Simplify the result, convert it back to a mixed number if that is the clearer form, and check by multiplying the answer by the divisor to get the dividend back.`, kind: 'tip' },
    { content: `Size test: dividing by a number less than 1 makes the answer bigger than the dividend, and dividing by a number greater than 1 makes the answer smaller.`, kind: 'tip' },
    { content: `Convert BOTH mixed numbers to improper fractions before you do anything else — including the divisor. Don't try to flip a mixed number directly; flip only the converted improper fraction.`, kind: 'common-error' },
    { content: `When converting a mixed number, always multiply the whole number by the denominator first, then add the numerator. The denominator stays the same. For 2 and 1/4: (2 × 4) + 1 = 9, so it becomes 9/4.`, kind: 'tip' },
    { content: `Don't split a mixed-number division into separate whole-number and fraction divisions. Dividing 2 and 1/3 by 1 and 1/2 as '2 ÷ 1 = 2, then 1/3 ÷ 1/2 = 2/3, then combine' gives the wrong answer. Always convert first.`, kind: 'common-error' },
    { content: `Use the size test before you divide to predict whether your answer should be bigger or smaller than the dividend. If the divisor is less than 1, the answer is bigger. If the divisor is greater than 1, the answer is smaller.`, kind: 'tip' },
    { content: `Always check your answer by multiplying it back by the divisor. You should get the dividend. If you don't, your conversion or reciprocal was wrong.`, kind: 'tip' },
    { content: `If your final answer is an improper fraction, convert it back to a mixed number to match the format of the original problem and make the answer easier to read.`, kind: 'vocab-note' },
    { content: `A reciprocal is a flipped fraction: 3/2 flips to 2/3, and they multiply to give 1. Never flip the whole number part of a mixed number by itself — that's not a reciprocal.`, kind: 'vocab-note' },
    { content: `If the divisor is a whole number (like 6), treat it as an improper fraction with denominator 1 (6/1) before flipping to get 1/6.`, kind: 'edge-case' },
  ],
};
