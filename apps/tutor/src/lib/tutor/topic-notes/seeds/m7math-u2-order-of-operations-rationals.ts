/**
 * Grade 7 Math — Unit 2 CED 2.4: Order of Operations with Rational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.order-of-operations-rationals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U2_ORDER_OF_OPERATIONS_RATIONALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.order-of-operations-rationals.v1',
  course: 'Grade 7 Math',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Order of Operations with Rational Numbers',
  planId: 'evelyn.ms.m7math.order-of-operations-rationals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.order-of-operations-rationals.v1' }],
  theory: [
    { loId: 'm7math.order-of-operations-rationals', kind: 'framework', title: 'The order, in four ranks', content: `THE ORDER, IN FOUR RANKS — first grouping symbols, innermost pair first. Second exponents. Third multiplication and division. Fourth addition and subtraction. PEMDAS is a way to remember it, but it is FOUR ranks, not six steps. So 3 + 4 times 5 = 3 + 20 = 23, not 35.` },
    { loId: 'm7math.order-of-operations-rationals', kind: 'framework', title: 'Same rank goes left to right', content: `SAME RANK GOES LEFT TO RIGHT — multiplication and division are tied, so neither one outranks the other: 24 ÷ 4 times 3 = 6 times 3 = 18, and NOT 24 ÷ 12. Addition and subtraction are tied the same way: 8 − 2 + 3 = 6 + 3 = 9, and NOT 8 − 5.` },
    { loId: 'm7math.order-of-operations-rationals', kind: 'framework', title: 'Grouping is more than parentheses', content: `GROUPING IS MORE THAN PARENTHESES — square brackets, absolute value bars, and the bar of a fraction all group. They all mean the same thing: finish everything inside me before I take part in anything else.` },
    { loId: 'm7math.order-of-operations-rationals', kind: 'framework', title: 'The fraction bar is a grouping symbol', content: `THE FRACTION BAR IS A GROUPING SYMBOL — it means evaluate the entire top, evaluate the entire bottom, and only then divide. So (3 + 9) over (5 − 1) is 12 over 4, which is 3. Never cancel or divide one piece at a time across the bar.` },
    { loId: 'm7math.order-of-operations-rationals', kind: 'framework', title: 'Negatives and fractions get no special treatment', content: `NEGATIVES AND FRACTIONS GET NO SPECIAL TREATMENT — they take their turn by rank like every other number, so do not save them for last. Use the sign rules from this unit at each step, and watch the base: (−3)² = 9 because the parentheses include the minus, while −3² = −9 because the exponent owns only the 3.` },
    { loId: 'm7math.order-of-operations-rationals', kind: 'definition', title: 'grouping symbol', content: `anything that wraps part of an expression — parentheses, brackets, absolute value bars, or a fraction bar — meaning evaluate me first.` },
    { loId: 'm7math.order-of-operations-rationals', kind: 'definition', title: 'evaluate', content: 'work an expression down to a single number.' },
    { loId: 'm7math.order-of-operations-rationals', kind: 'definition', title: 'exponent', content: `the small raised number telling you how many copies of the base to multiply together.` },
  ],
  methods: [
    {
      title: 'Worked negative fraction exponent',
      steps: [
        `Scan for grouping symbols first. The only parentheses hold single numbers, so there is nothing to simplify inside them. Move on to rank two.`,
        `Exponents next. The base is −3 because the parentheses wrap the minus sign along with the 3, so (−3)² = (−3)(−3). Two negative factors, an even count, so it is positive 9. The expression is now −2 + (1/2)(9).`,
        `Rank three, multiplication. Half of 9 is 9/2, which is 4.5. The expression is now −2 + 9/2.`,
        `Rank four, addition. Different signs, so use the addition rule from lesson 2.1. Write −2 in halves so the pieces match: −2 = −4/2. Then −4/2 + 9/2 = 5/2, which is 2.5.`,
        `Check the whole thing as decimals: (−3)² = 9, half of 9 is 4.5, and −2 + 4.5 = 2.5. That agrees with 5/2. WRONG answer to avoid: −6.5, which comes from reading the exponent as −3² = −9 and then computing −2 + (−4.5). RIGHT answer: 5/2, or 2.5.`,
      ],
      example: { problem: 'Evaluate: −2 + (1/2)(−3)²', solution: '5/2, which is 2.5' },
      relatedLoIds: ['m7math.order-of-operations-rationals'],
    },
    {
      title: 'Worked fraction bar',
      steps: [
        `The fraction bar groups. Treat the top as its own little problem and the bottom as its own little problem, and do not let anything cross the bar until both sides are single numbers.`,
        `Top: −8 + 2. Different signs, so subtract the absolute values: 8 − 2 = 6, and the 8 had the larger absolute value and was negative. The top is −6.`,
        `Bottom: 5 − 2 times 4. Multiplication outranks subtraction, so 2 times 4 = 8 first, giving 5 − 8. Rewrite as adding the opposite: 5 + (−8) = −3. The bottom is −3.`,
        `Now the bar finally acts as division: −6 ÷ (−3). Both signs are the same, so the answer is positive, and 6 ÷ 3 = 2. The value is 2.`,
        `WRONG answer to avoid: −1/2, which comes from working the bottom left to right as 5 − 2 = 3 and then 3 times 4 = 12, giving −6 over 12. RIGHT answer: 2. Multiplication outranks subtraction even when it is hiding under a fraction bar.`,
      ],
      example: { problem: 'Evaluate the fraction with (−8 + 2) on top and (5 − 2 times 4) on the bottom.', solution: '2' },
      relatedLoIds: ['m7math.order-of-operations-rationals'],
    },
  ],
  pointers: [
    { content: `Students often say "4" — Addition and subtraction share ONE rank, so they run left to right: 10 − 4 = 6 first, then 6 + 2 = 8. The correct answer is 8. PEMDAS is four ranks with two ties inside it, not six steps in a line.`, kind: 'common-error' },
    { content: `Students often say "2" — Multiplication and division also share one rank, so they run left to right: 20 ÷ 5 = 4 first, then 4 × 2 = 8. The correct answer is 8. Whenever two tied operations sit side by side, the one on the LEFT goes first.`, kind: 'common-error' },
    { content: `Four ranks: grouping, then exponents, then multiplying and dividing, then adding and subtracting.`, kind: 'tip' },
    { content: 'Tied operations run left to right, so 24 ÷ 4 × 3 = 18 and 8 − 2 + 3 = 9.', kind: 'tip' },
    { content: 'A fraction bar groups: finish the whole top and the whole bottom, then divide.', kind: 'tip' },
    { content: 'Parentheses decide the base, so (−3)² = 9 while −3² = −9.', kind: 'tip' },
    { content: `Negatives, fractions and decimals wait their turn by rank; use the sign rules from this unit at each step.`, kind: 'tip' },
    { content: `PEMDAS is **four ranks, not six steps**. M and D are tied; A and S are tied. When two tied operations sit side by side, do the LEFT one first: 20 ÷ 5 × 2 = 8, and 10 − 4 + 2 = 8.`, kind: 'common-error' },
    { content: `Check the parentheses before you square: (−3)² = 9 but −3² = −9. If the minus sign is outside, the exponent only owns the 3 and the minus is applied last.`, kind: 'gotcha' },
    { content: `A fraction bar is a grouping symbol. Finish the WHOLE top and the WHOLE bottom, then divide. Never cancel or combine a piece of the top with a piece of the bottom first.`, kind: 'vocab-note' },
    { content: `Order of operations still applies inside the top and bottom of a fraction. In (5 − 2 × 4), multiply first: 5 − 8 = −3. Working left to right there gives 12 and a wrong answer.`, kind: 'common-error' },
    { content: `Subtracting a negative is not a special rule you save for the end. Do it in its turn: 8 − 2 × (−3) becomes 8 − (−6) = 8 + 6 = 14, not 8 − 6.`, kind: 'gotcha' },
    { content: `Brackets and absolute value bars group too, not just parentheses. Work the innermost pair first, and don't take an absolute value until everything inside it is one number.`, kind: 'edge-case' },
    { content: `Fractions and decimals wait their turn by rank like any other number. Don't convert everything to decimals first if it changes the order — and if you mix forms, rewrite so the pieces match: −2 = −4/2.`, kind: 'tip' },
    { content: `Redo the problem a second way as a quick check — for example, work it all in decimals. If 5/2 and 2.5 agree, you're safe. If the two runs disagree, you skipped a rank somewhere.`, kind: 'tip' },
  ],
};
