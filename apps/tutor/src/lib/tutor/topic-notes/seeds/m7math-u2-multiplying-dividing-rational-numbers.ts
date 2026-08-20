/**
 * Grade 7 Math — Unit 2 CED 2.3: Multiplying & Dividing Rational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.multiplying-dividing-rational-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U2_MULTIPLYING_DIVIDING_RATIONAL_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.multiplying-dividing-rational-numbers.v1',
  course: 'Grade 7 Math',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Multiplying & Dividing Rational Numbers',
  planId: 'evelyn.ms.m7math.multiplying-dividing-rational-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.multiplying-dividing-rational-numbers.v1' }],
  theory: [
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'framework', title: 'The sign rule', content: `THE SIGN RULE — same signs give a POSITIVE answer, different signs give a NEGATIVE answer. So (−4)(−3) = 12 and (−4)(3) = −12. Why do two negatives turn positive? Taking away four debts of 3 dollars each leaves you 12 dollars better off.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'framework', title: 'Division uses the exact same rule', content: `DIVISION USES THE EXACT SAME RULE — nothing changes: −12 ÷ 4 = −3 and −12 ÷ (−4) = 3. And the minus sign can sit anywhere in a fraction without changing its value, so −3/4 and (−3)/4 and 3/(−4) are all the same number.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'framework', title: 'Do the sign first, then the size', content: `DO THE SIGN FIRST, THEN THE SIZE — decide positive or negative before you multiply anything, so the sign is settled while your head is still clear. With a long string, just count the negative factors: an EVEN count gives a positive answer, an ODD count gives a negative one. In (−2)(3)(−5) there are two negatives, so the answer is positive 30.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'framework', title: 'Multiply fractions straight across', content: `MULTIPLY FRACTIONS STRAIGHT ACROSS — numerator times numerator, denominator times denominator. No common denominator is needed; that is an addition requirement and it does not belong here. So (−2/3)(3/5) = −6/15, which simplifies to −2/5.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'framework', title: 'Divide by multiplying by the reciprocal', content: `DIVIDE BY MULTIPLYING BY THE RECIPROCAL — flip the second fraction and multiply. The reciprocal of 2/5 is 5/2. So (−3/4) ÷ (2/5) = (−3/4)(5/2) = −15/8. Flip only the number you are dividing BY, and never the first one.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'framework', title: 'The exponent sign trap', content: `THE EXPONENT SIGN TRAP — (−3)² means (−3)(−3), which is 9, because the parentheses make the minus part of the base. But −3² means take 3 times 3 and then apply the minus, which is −9. Same digits, opposite answers, decided entirely by whether the parentheses are there.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'definition', title: 'product', content: 'the result of multiplying numbers together.' },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'definition', title: 'quotient', content: 'the result of dividing one number by another.' },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'definition', title: 'reciprocal', content: `the flip of a fraction; the reciprocal of 2/5 is 5/2, and a number times its reciprocal is 1.` },
    { loId: 'm7math.multiplying-dividing-rational-numbers', kind: 'definition', title: 'base', content: `the number an exponent is applied to; in (−3)² the base is −3, but in −3² the base is just 3.` },
  ],
  methods: [
    {
      title: 'Worked multiply fractions',
      steps: [
        `Settle the sign before anything else. One factor is negative and one is positive, so the signs are different, which means the answer will be negative. Write the minus sign down now so it cannot get lost.`,
        `Multiply straight across. Numerators: 2 times 9 is 18. Denominators: 3 times 10 is 30. So far the answer is −18/30.`,
        `Simplify. Both 18 and 30 divide by 6: 18 ÷ 6 = 3 and 30 ÷ 6 = 5. That gives −3/5.`,
        `Check with decimals. −2/3 is about −0.667 and 9/10 is 0.9, and −0.667 times 0.9 is about −0.6. And −3/5 is −0.6. They match.`,
        `WRONG answer to avoid: −11/13, which comes from adding across the top and bottom instead of multiplying. RIGHT answer: −3/5. Multiplying fractions never needs a common denominator.`,
      ],
      example: { problem: 'Multiply: (−2/3)(9/10)', solution: '−3/5' },
      relatedLoIds: ['m7math.multiplying-dividing-rational-numbers'],
    },
    {
      title: 'Worked divide and exponent trap',
      steps: [
        `(a) Sign first. Both numbers are negative, so the signs are the same, which means the answer will be positive.`,
        `(a) Division becomes multiplication by the reciprocal. Flip the SECOND fraction only: 2/3 becomes 3/2. So the problem is (5/6)(3/2), with the sign already settled as positive.`,
        `(a) Multiply straight across: 5 times 3 is 15, and 6 times 2 is 12, giving 15/12. Both divide by 3, so it simplifies to 5/4. Check with decimals: −0.833 divided by −0.667 is about 1.25, and 5/4 is 1.25.`,
        `(b) (−4)² has parentheses, so the whole −4 is the base: (−4)(−4). Two negative factors, an even count, so the answer is positive 16.`,
        `(b) −4² has no parentheses, so the exponent grabs only the 4. Do 4 times 4 = 16 first, then apply the waiting minus sign, giving −16. Read the parentheses carefully: (−4)² = 16 but −4² = −16.`,
      ],
      example: { problem: 'Compute: (a) (−5/6) ÷ (−2/3). (b) Evaluate (−4)² and −4².', solution: '(a) 5/4, (b) (−4)² = 16 and −4² = −16' },
      relatedLoIds: ['m7math.multiplying-dividing-rational-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "−4" — The parentheses make the whole −2 the base, so (−2)² means (−2)(−2). Two negative factors is an even count, and same signs give a positive, so (−2)² = 4.`, kind: 'common-error' },
    { content: `Students often say "4" — With no parentheses the exponent owns only the 2. Square it first, 2 times 2 = 4, then apply the minus that was waiting in front, giving −2² = −4. The parentheses are the only thing that decides, so read them before you square.`, kind: 'common-error' },
    { content: `Same signs give a positive answer, different signs give a negative one, for multiplying AND dividing.`, kind: 'tip' },
    { content: `Count the negative factors: an even count is positive, an odd count is negative, so (−2)(3)(−5) = 30.`, kind: 'tip' },
    { content: `Multiply fractions straight across, no common denominator needed: (−2/3)(9/10) = −18/30 = −3/5.`, kind: 'tip' },
    { content: `Divide by multiplying by the reciprocal of the second fraction: (−5/6) ÷ (−2/3) = (5/6)(3/2) = 5/4.`, kind: 'tip' },
    { content: 'Parentheses decide the base: (−4)² = 16, but −4² = −16.', kind: 'tip' },
    { content: `Don't drag the "common denominator" rule into multiplication. Common denominators belong to adding and subtracting only. (−2/3)(9/10) = −18/30 = −3/5, never −11/13.`, kind: 'common-error' },
    { content: `When dividing fractions, flip **only the second** fraction. (−5/6) ÷ (−2/3) becomes (5/6)(3/2), not (6/5)(3/2). Flipping both, or flipping the first, changes the answer completely.`, kind: 'common-error' },
    { content: `Parentheses decide the base. (−3)² = 9 because the base is −3. −3² = −9 because the exponent only owns the 3 and the minus waits its turn. Read the parentheses BEFORE you square.`, kind: 'gotcha' },
    { content: `"Product" means multiply, "quotient" means divide, "reciprocal" is the flip. The reciprocal of 5 is 1/5 (write 5 as 5/1 first), and 0 has no reciprocal.`, kind: 'vocab-note' },
    { content: `Settle the sign FIRST, write it down, then multiply the numbers. If you save the sign for last, it gets lost while you're busy simplifying.`, kind: 'tip' },
    { content: `With three or more factors, count the negatives instead of doing signs pair by pair: even count → positive, odd count → negative. (−2)(3)(−5) has two negatives, so the answer is +30.`, kind: 'tip' },
    { content: `A minus sign can sit on top, on the bottom, or in front of a fraction — −3/4, (−3)/4, and 3/(−4) are all the same number. But never write two minus signs for one negative.`, kind: 'edge-case' },
    { content: `Multiplying by a number between 0 and 1 makes the result SMALLER, and dividing by it makes the result BIGGER. 0.75 × 6 = 4.5, but 6 ÷ 0.75 = 8. Don't assume "multiply = grow."`, kind: 'edge-case' },
  ],
};
