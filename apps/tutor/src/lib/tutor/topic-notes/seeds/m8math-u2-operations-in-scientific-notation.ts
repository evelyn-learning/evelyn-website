/**
 * Grade 8 Math — Unit 2 CED 2.4: Operations in Scientific Notation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.operations-in-scientific-notation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U2_OPERATIONS_IN_SCIENTIFIC_NOTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.operations-in-scientific-notation.v1',
  course: 'Grade 8 Math',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Operations in Scientific Notation',
  planId: 'evelyn.ms.m8math.operations-in-scientific-notation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.operations-in-scientific-notation.v1' }],
  theory: [
    { loId: 'm8math.operations-in-scientific-notation', kind: 'framework', title: 'Two parts, two separate jobs', content: `TWO PARTS, TWO SEPARATE JOBS — a number in scientific notation has a coefficient (a number from 1 up to, but not including, 10) and a power of 10. When you multiply two of them, the coefficients get multiplied together and the powers of 10 get multiplied together: (3 × 10⁴) × (2 × 10⁵) = (3 × 2) × (10⁴ × 10⁵) = 6 × 10⁹. Regrouping like that is legal because every piece is being multiplied, and order does not matter in multiplication.` },
    { loId: 'm8math.operations-in-scientific-notation', content: `MULTIPLY THE COEFFICIENTS, ADD THE EXPONENTS; DIVIDE THE COEFFICIENTS, SUBTRACT THE EXPONENTS — the powers of 10 follow the product and quotient rules you already own: 10⁴ × 10⁵ = 10⁹ because four tens times five tens is nine tens, and 10⁷ ÷ 10³ = 10⁴. So (8 × 10⁷) ÷ (2 × 10³) = (8 ÷ 2) × 10⁷⁻³ = 4 × 10⁴. The exponents are never multiplied and never divided; that is the single most common slip in this lesson.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'framework', title: 'Renormalize when the coefficient leaves the 1-to-10 range', content: `RENORMALIZE WHEN THE COEFFICIENT LEAVES THE 1-TO-10 RANGE — 6 × 4 = 24, so (6 × 10³) × (4 × 10⁴) comes out as 24 × 10⁷, and 24 is not allowed as a coefficient. Divide the coefficient by 10 and add 1 to the exponent: 2.4 × 10⁸. It works the other way too: 0.4 × 10³ has a coefficient below 1, so multiply the coefficient by 10 and take 1 off the exponent: 4 × 10². Each trade leaves the number itself unchanged, because 24 × 10,000,000 and 2.4 × 100,000,000 are both 240,000,000.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'framework', title: 'To add or subtract, match the exponents first', content: `TO ADD OR SUBTRACT, MATCH THE EXPONENTS FIRST — 3.2 × 10⁵ + 4 × 10⁴ cannot be added as it stands, because 3.2 counts hundred-thousands and 4 counts ten-thousands. Rewrite the smaller power to match the larger: 4 × 10⁴ = 0.4 × 10⁵. Now add the coefficients and keep the shared power of 10: 3.2 + 0.4 = 3.6, so the sum is 3.6 × 10⁵. Subtraction is the same move: 7.5 × 10⁶ - 2 × 10⁵ = 7.5 × 10⁶ - 0.2 × 10⁶ = 7.3 × 10⁶. If one of the numbers arrives written the ordinary way, such as 50,000, write it as 5 × 10⁴ first and then match.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'framework', title: 'Choose a unit that a person can picture', content: `CHOOSE A UNIT THAT A PERSON CAN PICTURE — 1.89 × 10⁹ seconds is a true answer and a useless one, because nobody knows how long 1.89 billion seconds is. There are about 3.15 × 10⁷ seconds in a year (60 × 60 × 24 × 365 = 31,536,000), so divide: (1.89 × 10⁹) ÷ (3.15 × 10⁷) = 0.6 × 10² = 6 × 10¹ = 60 years. Same amount of time, and now it means something. When an answer in one unit has an exponent that is hard to picture, look for a bigger unit for a huge quantity or a smaller unit for a tiny one.` },
    { loId: 'm8math.operations-in-scientific-notation', content: `A CALCULATOR WRITES E INSTEAD OF × 10 — when the answer is too long for the screen, a calculator shows something like 6.4E4, which means 6.4 × 10⁴, or 2.5E-3, which means 2.5 × 10⁻³. The E is short for "times ten to the", and the number after it is the exponent. It is not an error message and it is not a letter to copy into your answer; some calculators show a small e or a raised 10 instead, and they all mean the same thing.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'definition', title: 'coefficient', content: `the number in front of the power of 10 in scientific notation, which must be at least 1 and less than 10.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'definition', title: 'power of 10', content: `the 10ⁿ part of a number in scientific notation; its exponent n tells how many places the decimal point has moved.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'definition', title: 'renormalize', content: `to fix a result whose coefficient has left the 1-to-10 range by moving its decimal point one place and changing the exponent by 1 in the opposite direction.` },
    { loId: 'm8math.operations-in-scientific-notation', kind: 'definition', title: 'E notation', content: `a calculator's shorthand for scientific notation, in which 6.4E4 means 6.4 × 10⁴.` },
  ],
  methods: [
    {
      title: 'Worked songs on a phone',
      steps: [
        `Songs that fit = total bytes ÷ bytes per song, so the calculation is (2.56 × 10¹¹) ÷ (4 × 10⁶). Split it into the two jobs: the coefficients 2.56 ÷ 4, and the powers of ten 10¹¹ ÷ 10⁶.`,
        `Coefficients: 2.56 ÷ 4 = 0.64. Powers of ten: subtract the exponents, 11 - 6 = 5, so 10¹¹ ÷ 10⁶ = 10⁵. The raw result is 0.64 × 10⁵.`,
        `Renormalize. The coefficient 0.64 is below 1, so it is not allowed yet. Multiply the coefficient by 10 to get 6.4 and take 1 off the exponent to get 10⁴: the answer is 6.4 × 10⁴. Both forms say the same number, since 0.64 × 100,000 and 6.4 × 10,000 are both 64,000.`,
        `Check by multiplying back. Songs times bytes per song should give the total: (6.4 × 10⁴) × (4 × 10⁶) = (6.4 × 4) × 10⁴⁺⁶ = 25.6 × 10¹⁰ = 2.56 × 10¹¹. That is the storage we started with, so the division is right.`,
        `Read the answer: 6.4 × 10⁴ is 64,000 songs. If you had typed the division into a calculator, the screen would show 6.4E4, which is the calculator's way of writing 6.4 × 10⁴, the same number.`,
      ],
      example: { problem: `A phone has 256 GB of storage, which is 2.56 × 10¹¹ bytes. One downloaded song takes about 4 × 10⁶ bytes. How many songs fit? Give the answer in scientific notation, then as an ordinary number.`, solution: '6.4 × 10⁴ songs, which is 64,000 songs' },
      relatedLoIds: ['m8math.operations-in-scientific-notation'],
    },
    {
      title: 'Worked watch time in years',
      steps: [
        `(a) Total seconds = views × seconds per view = (4.5 × 10⁶) × (4.2 × 10²). Two jobs again: the coefficients 4.5 × 4.2, and the powers of ten 10⁶ × 10².`,
        `Coefficients: 4.5 × 4.2 = 18.9, because 4.5 × 4 = 18 and 4.5 × 0.2 = 0.9. Powers of ten: add the exponents, 6 + 2 = 8, so 10⁶ × 10² = 10⁸. The raw result is 18.9 × 10⁸.`,
        `WRONG: multiplying the exponents, 6 × 2 = 12, and writing 18.9 × 10¹². CORRECT: 10⁶ × 10² is six tens times two more tens, eight tens in all, so the exponents ADD and the power is 10⁸. A product of 10¹² would be ten thousand times too big.`,
        `Renormalize. The coefficient 18.9 is 10 or more, so divide it by 10 to get 1.89 and add 1 to the exponent to get 10⁹. The total watch time is 1.89 × 10⁹ seconds.`,
        `(b) Nobody can picture 1.89 × 10⁹ seconds, so change the unit. Years = total seconds ÷ seconds per year = (1.89 × 10⁹) ÷ (3.15 × 10⁷). Coefficients: 1.89 ÷ 3.15 = 0.6, since 3.15 × 0.6 = 1.89. Powers of ten: 9 - 7 = 2. The raw result is 0.6 × 10², which renormalizes to 6 × 10¹, and 6 × 10¹ is 60. The total watch time is about 60 years.`,
        `Check by converting back: 60 years × 3.15 × 10⁷ seconds per year = (6 × 10¹) × (3.15 × 10⁷) = (6 × 3.15) × 10⁸ = 18.9 × 10⁸ = 1.89 × 10⁹ seconds, which matches part (a). And 60 years is a number a person can actually picture, which is why the unit change was worth doing.`,
      ],
      example: { problem: `A video has 4.5 × 10⁶ views, and the average viewer watches it for 4.2 × 10² seconds. (a) Find the total watch time in seconds, in scientific notation. (b) There are about 3.15 × 10⁷ seconds in a year. Express the total watch time in years.`, solution: '(a) 1.89 × 10⁹ seconds; (b) about 60 years' },
      relatedLoIds: ['m8math.operations-in-scientific-notation'],
    },
  ],
  pointers: [
    { content: `Students often say "8 × 10¹⁵" — 10³ × 10⁵ is three tens times five tens, which is eight tens, so 10³ × 10⁵ = 10⁸, and the exponents ADD. The coefficients multiply as usual, 2 × 4 = 8, so the product is 8 × 10⁸. The long way agrees: 2,000 × 400,000 = 800,000,000, which is 8 followed by eight zeros. Devin's 8 × 10¹⁵ is 8 followed by fifteen zeros, ten million times too big.`, kind: 'common-error' },
    { content: `Students often say "8 × 10⁶" — The two numbers are not the same size, because 4 × 10⁶ is 4,000,000 and 4 × 10⁵ is only 400,000. Match the exponents first: 4 × 10⁵ = 0.4 × 10⁶. Then add the coefficients and keep the shared power: 4 + 0.4 = 4.4, so the sum is 4.4 × 10⁶. The long way agrees: 4,000,000 + 400,000 = 4,400,000. Lena's 8 × 10⁶ would mean the second number was as big as the first, and it is only a tenth as big.`, kind: 'common-error' },
    { content: `Multiply: multiply the coefficients and ADD the exponents. Divide: divide the coefficients and SUBTRACT the exponents. The exponents themselves are never multiplied or divided.`, kind: 'tip' },
    { content: `Renormalize when the coefficient leaves the 1-to-10 range: divide it by 10 and add 1 to the exponent, or multiply it by 10 and take 1 off the exponent. The number does not change.`, kind: 'tip' },
    { content: `To add or subtract, match the exponents first, then add or subtract the coefficients and keep the shared power of 10.`, kind: 'tip' },
    { content: `A number written the ordinary way gets rewritten in scientific notation before it joins the calculation.`, kind: 'tip' },
    { content: `Choose a unit a person can picture: 1.89 × 10⁹ seconds is about 60 years, using 3.15 × 10⁷ seconds per year.`, kind: 'tip' },
    { content: `On a calculator, 6.4E4 means 6.4 × 10⁴. The E stands for "times ten to the" and is not part of the answer.`, kind: 'tip' },
  ],
};
