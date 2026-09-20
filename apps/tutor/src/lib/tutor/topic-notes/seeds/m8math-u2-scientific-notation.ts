/**
 * Grade 8 Math — Unit 2 CED 2.3: Writing & Comparing Numbers in Scientific Notation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.scientific-notation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U2_SCIENTIFIC_NOTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.scientific-notation.v1',
  course: 'Grade 8 Math',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Writing & Comparing Numbers in Scientific Notation',
  planId: 'evelyn.ms.m8math.scientific-notation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.scientific-notation.v1' }],
  theory: [
    { loId: 'm8math.scientific-notation', content: `THE FORM IS a × 10ⁿ, WITH a BETWEEN 1 AND 10 — scientific notation writes a number as a coefficient a times a power of ten, and the coefficient must satisfy 1 ≤ a < 10: exactly one nonzero digit sits in front of the decimal point. So 3.4 × 10⁶ is scientific notation. The values 34 × 10⁵ and 0.34 × 10⁷ equal the very same number, but neither is in scientific notation, because 34 is too big and 0.34 is too small to be the coefficient.` },
    { loId: 'm8math.scientific-notation', kind: 'framework', title: 'A large number gets a positive exponent', content: `A LARGE NUMBER GETS A POSITIVE EXPONENT — to write 4,500,000, put the decimal point right after the first nonzero digit to get 4.5, then count how many places the point moved from the end of the number: 6 places. That count is the exponent, so 4,500,000 = 4.5 × 10⁶. Check it: 4.5 × 1,000,000 = 4,500,000. Count the places the point moves, not the zeros; 4,500,000 has five zeros, but the point moves six places.` },
    { loId: 'm8math.scientific-notation', kind: 'framework', title: 'A small number gets a negative exponent', content: `A SMALL NUMBER GETS A NEGATIVE EXPONENT — to write 0.00032, move the decimal point to the right until it sits just after the first nonzero digit, giving 3.2, and count the moves: 4 places. A number less than 1 needs a negative exponent, so 0.00032 = 3.2 × 10⁻⁴. You already know that 10⁻⁴ = 1/10⁴ = 0.0001, and 3.2 × 0.0001 = 0.00032, so the check works. The sign of the exponent tells the size: positive for a number that is 10 or more, negative for a number less than 1, and zero for a number already between 1 and 10.` },
    { loId: 'm8math.scientific-notation', kind: 'framework', title: 'Back to standard form, the exponent says how far to move', content: `BACK TO STANDARD FORM, THE EXPONENT SAYS HOW FAR TO MOVE — for 6.02 × 10⁵, move the decimal point 5 places to the right, filling the empty places with zeros: 602,000. For 9 × 10⁻³, move the point 3 places to the left, filling with zeros: 0.009. Positive exponent, the number grows and the point goes right; negative exponent, the number shrinks and the point goes left.` },
    { loId: 'm8math.scientific-notation', kind: 'framework', title: 'Estimate with a single digit times a power of ten', content: `ESTIMATE WITH A SINGLE DIGIT TIMES A POWER OF TEN — when the question is about size rather than exact value, round the coefficient to one digit. The United States has about 340,000,000 people, which is 3.4 × 10⁸, and for a size comparison 3 × 10⁸ is enough. The world has about 8,100,000,000 people, and 8 × 10⁹ is enough. The power of ten carries the size and the single digit carries the fine tuning.` },
    { loId: 'm8math.scientific-notation', content: `HOW MANY TIMES AS LARGE: POWERS OF TEN FIRST, THEN THE DIGITS — to compare 8 × 10⁹ with 3 × 10⁸, first compare the powers of ten: 10⁹ ÷ 10⁸ = 10¹ = 10, by the quotient rule you already own, so the exponents alone say 10 times. Then adjust by the digits: 8 ÷ 3 is a little under 3. Put them together and the world has 10 × (a little under 3) times the United States population, about 27 times. When the digits divide evenly the answer is exact: 6 × 10⁸ is 2 × 10⁴ = 20,000 times as large as 3 × 10⁴, since 10⁸ ÷ 10⁴ = 10⁴ and 6 ÷ 3 = 2.` },
    { loId: 'm8math.scientific-notation', kind: 'definition', title: 'scientific notation', content: `a way of writing a number as a × 10ⁿ, where a is at least 1 and less than 10 and n is an integer.` },
    { loId: 'm8math.scientific-notation', kind: 'definition', title: 'coefficient', content: `the number a in a × 10ⁿ; it must be at least 1 and less than 10, so exactly one nonzero digit sits in front of the decimal point.` },
    { loId: 'm8math.scientific-notation', kind: 'definition', title: 'standard form', content: `a number written out with all of its digits in the usual way, such as 4,500,000 or 0.00032.` },
    { loId: 'm8math.scientific-notation', kind: 'definition', title: 'power of ten', content: `a number such as 10⁶ or 10⁻³; its exponent counts how many places the decimal point moves.` },
  ],
  methods: [
    {
      title: 'Worked phone and silk',
      steps: [
        `Start with 512,000,000,000. The first nonzero digit is 5, so the coefficient will be 5.12. The decimal point currently sits at the end of the number, after the last zero; moving it to just after the 5 takes 11 places. Large number, so the exponent is positive: 512,000,000,000 = 5.12 × 10¹¹.`,
        `Check by working backward: 5.12 × 10¹¹ means move the point 11 places to the right. 5.12 becomes 512 after 2 places, and the other 9 places add 9 zeros: 512,000,000,000. It matches.`,
        `Now 0.000004. Move the decimal point to the right until it sits just after the 4: it passes five zeros and then the 4, which is 6 places. Small number, so the exponent is negative: 0.000004 = 4 × 10⁻⁶. Check: 10⁻⁶ = 0.000001, and 4 × 0.000001 = 0.000004.`,
        `Finally 3.7 × 10⁵. The exponent is positive 5, so move the point 5 places to the right: 3.7 becomes 37 after 1 place, and the other 4 places add 4 zeros: 370,000.`,
        `Check the last one by going the other way: the first nonzero digit of 370,000 is 3, the coefficient is 3.7, and the point moves 5 places from the end back to just after the 3. That gives 3.7 × 10⁵, the number we started from.`,
      ],
      example: { problem: `A 512 GB phone holds about 512,000,000,000 bytes. A strand of spider silk is about 0.000004 meters thick. Write both numbers in scientific notation, then write 3.7 × 10⁵ in standard form.`, solution: '5.12 × 10¹¹ bytes; 4 × 10⁻⁶ meters; 370,000' },
      relatedLoIds: ['m8math.scientific-notation'],
    },
    {
      title: 'Worked views comparison',
      steps: [
        `Estimate the big count. 312,000,000 = 3.12 × 10⁸, because the point moves 8 places from the end to sit after the 3. Rounding the coefficient to one digit gives 3 × 10⁸.`,
        `Estimate the small count. 58,000 = 5.8 × 10⁴, because the point moves 4 places. Rounding 5.8 to one digit gives 6 × 10⁴.`,
        `Compare the powers of ten first: 10⁸ ÷ 10⁴ = 10⁴ = 10,000. If the digits were equal, the dance clip would have 10,000 times as many views.`,
        `WRONG: reading the exponents 8 and 4, subtracting to get 4, and answering "4 times as many views". CORRECT: the difference in the exponents counts powers of ten, not plain units. Four more in the exponent means 10 × 10 × 10 × 10 = 10,000 times, and 312,000,000 is obviously far more than 4 times 58,000.`,
        `Now adjust by the digits: 3 ÷ 6 = 0.5, so the dance clip has only half the digit that your clip has. Half of 10,000 is 5,000. The dance clip has about 5,000 = 5 × 10³ times as many views.`,
        `Check with the standard-form numbers: 6 × 10⁴ = 60,000, and 60,000 × 5,000 = 300,000,000 = 3 × 10⁸. The multiplier takes the small estimate to the large one, so 5 × 10³ times is right. With the original counts, 58,000 × 5,000 = 290,000,000, close to 312,000,000, so the estimate is sensible.`,
      ],
      example: { problem: `A dance clip on a video app has 312,000,000 views. Your own clip has 58,000 views. Estimate each count as a single digit times a power of ten, then find about how many times as many views the dance clip has.`, solution: '3 × 10⁸ views and 6 × 10⁴ views; about 5 × 10³ (5,000) times as many' },
      relatedLoIds: ['m8math.scientific-notation'],
    },
  ],
  pointers: [
    { content: `Students often say "4,500,000 = 4.5 × 10⁵" — The exponent counts decimal-point moves, not zeros. In 4,500,000 the point starts at the end and moves 6 places to sit just after the 4, so the number is 4.5 × 10⁶. The check settles it: 4.5 × 10⁵ = 450,000, which is ten times too small, while 4.5 × 10⁶ = 4,500,000. Zeros and moves agree only when every digit after the first one is a zero, as in 4,000,000 = 4 × 10⁶.`, kind: 'common-error' },
    { content: `Students often say "2 × 10⁻⁷ is larger than 7 × 10⁻⁵" — Write both out. 10⁻⁵ = 0.00001 and 10⁻⁷ = 0.0000001, so 7 × 10⁻⁵ = 0.00007 and 2 × 10⁻⁷ = 0.0000002, and the first number is larger. Compare the powers of ten first: 10⁻⁵ ÷ 10⁻⁷ = 10² = 100, so 10⁻⁵ is 100 times 10⁻⁷, and 7 ÷ 2 = 3.5 makes 7 × 10⁻⁵ exactly 350 times as large as 2 × 10⁻⁷. Check: 0.0000002 × 350 = 0.00007.`, kind: 'common-error' },
    { content: `Scientific notation is a × 10ⁿ with 1 ≤ a < 10: exactly one nonzero digit in front of the decimal point.`, kind: 'tip' },
    { content: `To write a number, put the point just after the first nonzero digit and count the places it moved; that count is the exponent. Count moves, not zeros.`, kind: 'tip' },
    { content: `A number that is 10 or more gets a positive exponent; a number less than 1 gets a negative exponent.`, kind: 'tip' },
    { content: `To go back to standard form, move the point the number of places the exponent says: right for positive, left for negative, filling with zeros.`, kind: 'tip' },
    { content: 'For a size comparison, round each number to a single digit times a power of ten.', kind: 'tip' },
    { content: `How many times as large: compare the powers of ten first by subtracting exponents, then adjust by dividing the digits, and check that the small number times your multiplier gives the large one.`, kind: 'tip' },
    { content: `Count how many places the decimal point moves, not how many zeros are in the number. 4,500,000 has five zeros but the point moves 6 places, so it's 4.5 × 10⁶, not 4.5 × 10⁵.`, kind: 'common-error' },
    { content: `The coefficient a must satisfy 1 ≤ a < 10 — exactly one nonzero digit before the decimal point. 34 × 10⁵ and 0.34 × 10⁷ are not in scientific notation, even though they equal the same number.`, kind: 'vocab-note' },
    { content: `Negative exponent means the number is smaller than 1. More negative (like 10⁻⁷) is much smaller than less negative (like 10⁻⁵). Don't confuse the digit in the exponent with the size of the power.`, kind: 'gotcha' },
    { content: `To find 'how many times as large,' divide the powers of ten first (subtract the exponents), then divide the coefficients. Don't just subtract the exponents and call that the answer.`, kind: 'common-error' },
    { content: `When moving the decimal point back to standard form, the exponent tells you how many places to move—positive means right, negative means left. Fill empty spaces with zeros.`, kind: 'tip' },
    { content: `For estimation, round the coefficient to one digit (3.12 × 10⁸ becomes 3 × 10⁸), but keep the exponent exact. The power of ten carries the size; the single digit is the rough adjustment.`, kind: 'tip' },
    { content: `A number between 1 and 10 (like 5, 7.3, or 9.99) has exponent 0 in scientific notation because the point doesn't need to move. 5 = 5 × 10⁰.`, kind: 'edge-case' },
    { content: `Always check your work by converting back. If 4.5 × 10⁶ doesn't turn into 4,500,000 when you move the point, your exponent is wrong.`, kind: 'tip' },
  ],
};
