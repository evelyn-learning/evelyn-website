/**
 * Grade 6 Math — Unit 7 CED 7.1: Numerical Expressions with Exponents.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.numerical-expressions-with-exponents.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U7_NUMERICAL_EXPRESSIONS_WITH_EXPONENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.numerical-expressions-with-exponents.v1',
  course: 'Grade 6 Math',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Numerical Expressions with Exponents',
  planId: 'evelyn.ms.m6math.numerical-expressions-with-exponents.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.numerical-expressions-with-exponents.v1' }],
  theory: [
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'framework', title: 'An exponent counts repeated factors', content: `AN EXPONENT COUNTS REPEATED FACTORS — an exponent tells how many times a number, called the base, is multiplied by itself. In 3⁴, the base 3 is used as a factor four times: 3 × 3 × 3 × 3, which equals 81.` },
    { loId: 'm6math.numerical-expressions-with-exponents', content: `NAME THE PARTS: BASE AND EXPONENT — in 3⁴, the 3 sitting on the line is the base, and the small raised 4 is the exponent. Say it out loud as "three to the fourth power" before computing anything, so it is clear which number is which.` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'framework', title: 'Write repeated multiplication as a power', content: `WRITE REPEATED MULTIPLICATION AS A POWER — to turn 6 × 6 × 6 into exponent form, count the factors. There are three 6s, so the exponent is 3 and the base is 6, giving 6³. The exponent is always the COUNT of factors, never one of the factors itself.` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'framework', title: 'The exponent never means times', content: `THE EXPONENT NEVER MEANS TIMES — 3⁴ is not 3 × 4. Multiplying 3 by 4 only uses 3 as a factor once; the exponent 4 says to use 3 as a factor four separate times. 3⁴ = 81, while 3 × 4 = 12, and those two answers are far apart, so checking catches this mix-up fast.` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'framework', title: 'Squared, cubed, and beyond', content: `SQUARED, CUBED, AND BEYOND — an exponent of 2 is read "squared," and an exponent of 3 is read "cubed." Beyond that, just say the exponent as a number: 2⁵ is read "two to the fifth power."` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'framework', title: 'In a bigger expression, the power goes first', content: `IN A BIGGER EXPRESSION, THE POWER GOES FIRST — when a power sits next to addition or multiplication with no parentheses, evaluate the power first. In 4 + 5², the exponent belongs only to the 5, so compute 5² = 25 before adding: 4 + 25 = 29. The exponent does not reach across the plus sign to grab the 4 as well.` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'definition', title: 'base', content: 'the number that gets multiplied by itself in a power. In 3⁴, the base is 3.' },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'definition', title: 'exponent', content: `the small raised number that tells how many times the base is used as a factor. In 3⁴, the exponent is 4.` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'definition', title: 'power', content: `a base and an exponent written together, such as 3⁴, or the value it evaluates to.` },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'definition', title: 'squared', content: 'raised to the exponent 2, so "5 squared" means 5².' },
    { loId: 'm6math.numerical-expressions-with-exponents', kind: 'definition', title: 'cubed', content: 'raised to the exponent 3, so "5 cubed" means 5³.' },
  ],
  methods: [
    {
      title: 'Worked write and evaluate a power',
      steps: [
        `Count how many times 6 appears as a factor. It appears three times, so the exponent is 3. The base is 6, the number being multiplied. Write it as 6³.`,
        'To evaluate 6³, multiply 6 by itself three times: 6 × 6 × 6.',
        'Multiply two at a time: 6 × 6 = 36, then 36 × 6 = 216.',
        `WRONG: reading the exponent as an extra multiplication and computing 6 × 3 = 18. CORRECT: 6³ means three factors of 6 multiplied together, which is 216, not 6 times 3.`,
        `Check by expanding the power back into its factors: 6 × 6 × 6 = 216. The multiplication matches, so the answer holds.`,
      ],
      example: { problem: 'Write 6 × 6 × 6 as a single expression using an exponent. Then evaluate it.', solution: '6³ = 216' },
      relatedLoIds: ['m6math.numerical-expressions-with-exponents'],
    },
    {
      title: 'Worked order of operations with a power',
      steps: [
        `Look for the base and exponent written right next to each other. Here that is 5², so the exponent 2 belongs only to the 5, not to the whole expression.`,
        'Evaluate the power first: 5² = 5 × 5 = 25.',
        'Now finish the expression with the number that is left: 4 + 25 = 29.',
        `WRONG: adding first and squaring the sum, computing (4 + 5)² = 9² = 81. CORRECT: the exponent only touches the 5 next to it, so the answer is 29, not 81.`,
        `Check by reading the steps back in order: the power came first and gave 25, and the addition came last and gave 29.`,
      ],
      example: { problem: 'Evaluate 4 + 5².', solution: '29' },
      relatedLoIds: ['m6math.numerical-expressions-with-exponents'],
    },
  ],
  pointers: [
    { content: `Students often say "12" — The exponent is a count of factors, not a number to multiply by. 3⁴ means 3 used as a factor four times: 3 × 3 × 3 × 3 = 81. Multiplying 3 by 4 only uses 3 once, which is a completely different question.`, kind: 'common-error' },
    { content: `Students often say "343" — An exponent applies only to the base written directly on the line next to it, which is 2. Evaluate 2³ first: 2 × 2 × 2 = 8. Then add: 5 + 8 = 13. The exponent never reaches across a plus sign unless parentheses group the sum together first.`, kind: 'common-error' },
    { content: `An exponent tells how many times to multiply the base by itself; 3⁴ means 3 × 3 × 3 × 3, not 3 × 4.`, kind: 'tip' },
    { content: `The base is the repeated factor, and the exponent is the count of how many times it is used.`, kind: 'tip' },
    { content: 'An exponent of 2 is read "squared," and an exponent of 3 is read "cubed."', kind: 'tip' },
    { content: `To write repeated multiplication as a power, count the factors: that count is the exponent.`, kind: 'tip' },
    { content: `In a bigger expression, evaluate the power first, before addition, subtraction, or multiplication that sits next to it.`, kind: 'tip' },
    { content: `An exponent applies only to the base written next to it, never to a sum on the other side of a plus or minus sign, unless parentheses group them together.`, kind: 'tip' },
    { content: `Check a power by expanding it back into its repeated-multiplication factors and multiplying them one at a time.`, kind: 'tip' },
  ],
};
