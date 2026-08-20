/**
 * Grade 7 Math — Unit 2 CED 2.1: Adding Rational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.adding-rational-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U2_ADDING_RATIONAL_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.adding-rational-numbers.v1',
  course: 'Grade 7 Math',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Adding Rational Numbers',
  planId: 'evelyn.ms.m7math.adding-rational-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.adding-rational-numbers.v1' }],
  theory: [
    { loId: 'm7math.adding-rational-numbers', kind: 'framework', title: 'Adding is moving on the number line', content: `ADDING IS MOVING ON THE NUMBER LINE — start at the first number. A positive number moves you right, a negative number moves you left. So −5 + 3 means start at −5 and take three steps right, landing on −2. Every rule below is just a shortcut for that walk.` },
    { loId: 'm7math.adding-rational-numbers', kind: 'framework', title: 'Same signs', content: `SAME SIGNS — ADD AND KEEP THE SIGN. When both numbers pull the same direction, add their absolute values and keep the sign they share. So −3 + (−7) = −10, because owing 3 and then owing 7 more means owing 10. In the same way −1.4 + (−2.6) = −4, and −1/8 + (−3/8) = −4/8, which is −1/2.` },
    { loId: 'm7math.adding-rational-numbers', kind: 'framework', title: 'Different signs', content: `DIFFERENT SIGNS — SUBTRACT AND KEEP THE WINNER. When the numbers pull opposite directions, subtract the smaller absolute value from the larger one, then keep the sign of the number that had the LARGER absolute value. So −8 + 3 = −5, because 8 − 3 = 5 and the 8 was negative. And 9 + (−2) = 7, because 9 − 2 = 7 and the 9 was positive.` },
    { loId: 'm7math.adding-rational-numbers', kind: 'framework', title: 'Opposites add to zero', content: `OPPOSITES ADD TO ZERO — a number plus its opposite always gives zero: 6 + (−6) = 0 and −2.5 + 2.5 = 0. That pair is called an additive inverse. Spotting one in a long string is a gift, because it cancels out and you can skip it.` },
    { loId: 'm7math.adding-rational-numbers', kind: 'framework', title: 'Fractions need same-size pieces first', content: `FRACTIONS NEED SAME-SIZE PIECES FIRST — the two sign rules never change, but fractions can only be added once the denominators match. Rewrite −3/4 + 1/6 as −9/12 + 2/12 before you touch the signs. Decimals want the same courtesy: line up the decimal points and fill in a zero so 7.2 becomes 7.20.` },
    { loId: 'm7math.adding-rational-numbers', kind: 'definition', title: 'rational number', content: `any number that can be written as a fraction of two integers — that includes integers, fractions, and terminating or repeating decimals.` },
    { loId: 'm7math.adding-rational-numbers', kind: 'definition', title: 'additive inverse', content: 'the opposite of a number; the two of them add to zero, like 6 and −6.' },
    { loId: 'm7math.adding-rational-numbers', kind: 'definition', title: 'sum', content: 'the result of adding numbers together.' },
    { loId: 'm7math.adding-rational-numbers', kind: 'definition', title: 'common denominator', content: `a shared bottom number that lets two fractions be added, because it makes the pieces the same size.` },
  ],
  methods: [
    {
      title: 'Worked add unlike fractions',
      steps: [
        `Check the signs first. One number is negative and one is positive, so this is the different-signs case. But the pieces are different sizes, so the fractions have to match up before anything else happens.`,
        `Find a common denominator for 4 and 6. The smallest number both divide into is 12. Rewrite: −3/4 = −9/12 because 3 times 3 is 9, and 1/6 = 2/12 because 1 times 2 is 2.`,
        `Now the problem reads −9/12 + 2/12. Different signs, so subtract the smaller absolute value from the larger: 9/12 − 2/12 = 7/12.`,
        `Keep the sign of the number with the larger absolute value. That was −9/12, which is negative, so the answer is −7/12.`,
        `Check with decimals. −3/4 is −0.75 and 1/6 is about 0.167, so the sum is about −0.583. And −7/12 is about −0.583. They match. WRONG answer to avoid: −11/12, which comes from adding 9 and 2 as if the signs were the same. RIGHT answer: −7/12.`,
      ],
      example: { problem: 'Add: −3/4 + 1/6', solution: '−7/12' },
      relatedLoIds: ['m7math.adding-rational-numbers'],
    },
    {
      title: 'Worked add decimals',
      steps: [
        `The signs are different, so the two numbers pull opposite ways. Compare their absolute values: |−7.2| = 7.2 and |4.85| = 4.85. The 7.2 is bigger, so the negative side wins the tug of war.`,
        `Subtract the smaller absolute value from the larger one. Line up the decimal points and write 7.2 as 7.20 so both numbers have two places: 7.20 − 4.85 = 2.35.`,
        `Keep the sign of the larger absolute value, which was negative. So −7.2 + 4.85 = −2.35.`,
        `Does that make sense in the story? You owed 7 dollars 20 and handed over 4 dollars 85, so you still owe 2 dollars 35. Still owing is negative, and −2.35 says exactly that.`,
        `WRONG answer to avoid: 12.05, which comes from adding 7.2 and 4.85 as though the signs matched. RIGHT answer: −2.35.`,
      ],
      example: { problem: `Your snack account is 7 dollars 20 in the hole, so it reads −7.2. You pay in 4.85. Find −7.2 + 4.85.`, solution: '−2.35' },
      relatedLoIds: ['m7math.adding-rational-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "−4" — Both numbers are negative, so they pull the SAME direction. Same signs means add the absolute values and keep the shared sign: 3 + 7 = 10, and the sign is negative, so −3 + (−7) = −10. Picture it as owing 3 dollars and then owing 7 more — you are 10 dollars down, not 4.`, kind: 'common-error' },
    { content: `Students often say "10" — Adding two negatives can never give a positive. Start at −3 on the number line and move 7 more steps LEFT; you land on −10, further from zero, not on the positive side of it. The correct answer is −10.`, kind: 'common-error' },
    { content: `Same signs: add the absolute values and keep the sign they share, so −3 + (−7) = −10.`, kind: 'tip' },
    { content: `Different signs: subtract the smaller absolute value from the larger and keep the sign of the larger, so −8 + 3 = −5.`, kind: 'tip' },
    { content: `A number plus its opposite is always zero: 6 + (−6) = 0, so opposites cancel and drop out.`, kind: 'tip' },
    { content: `Fractions need a common denominator before you add: −3/4 + 1/6 becomes −9/12 + 2/12 = −7/12.`, kind: 'tip' },
    { content: `Decimals need lined-up decimal points: 7.20 − 4.85 = 2.35, so −7.2 + 4.85 = −2.35.`, kind: 'tip' },
    { content: `"Two negatives make a positive" is a MULTIPLICATION saying. In addition, two negatives always give a negative: −3 + (−7) = −10, never 10. Adding a negative always moves you further left.`, kind: 'common-error' },
    { content: `Decide the CASE before you compute. Both signs same → add. Signs different → subtract. Students who start crunching numbers first often subtract when they should add (getting −4 instead of −10 for −3 + (−7)).`, kind: 'tip' },
    { content: `In the different-signs case, the sign comes from the number with the bigger ABSOLUTE VALUE, not the one written first. In 3 + (−8), the −8 wins, so the answer is −5.`, kind: 'gotcha' },
    { content: `Fix the denominators BEFORE applying any sign rule. −3/4 + 1/6 is not a subtraction of 3 and 1 — rewrite it as −9/12 + 2/12 first, then subtract 9 − 2.`, kind: 'common-error' },
    { content: `When you add fractions, only the numerators combine. The common denominator stays put: −9/12 + 2/12 = −7/12, not −7/24.`, kind: 'common-error' },
    { content: `Give decimals the same number of places before subtracting. Write 7.2 as 7.20 so 7.20 − 4.85 = 2.35. Lining up digits instead of decimal points gives nonsense answers.`, kind: 'tip' },
    { content: `Scan for a number and its opposite before doing any work. In −3.6 + 9 + (−9), the 9 and −9 cancel to 0, leaving just −3.6. Opposites don't disappear the answer — they leave what's left.`, kind: 'tip' },
    { content: `Zero counts too: 0 + (−6) = −6, and if the two absolute values are equal the sum is exactly 0 with no sign, like −2.5 + 2.5 = 0. Don't write −0.`, kind: 'edge-case' },
  ],
};
