/**
 * Grade 8 Math — Unit 2 CED 2.2: Zero & Negative Exponents.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.zero-and-negative-exponents.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U2_ZERO_AND_NEGATIVE_EXPONENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.zero-and-negative-exponents.v1',
  course: 'Grade 8 Math',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Zero & Negative Exponents',
  planId: 'evelyn.ms.m8math.zero-and-negative-exponents.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.zero-and-negative-exponents.v1' }],
  theory: [
    { loId: 'm8math.zero-and-negative-exponents', content: `THE QUOTIENT RULE FORCES a⁰ = 1 — the quotient rule you already own says a³ ÷ a³ = a³⁻³ = a⁰. But any nonzero number divided by itself is 1: 5³ ÷ 5³ is 125 ÷ 125 = 1. Both answers describe the same division, so a⁰ has to equal 1. That holds for every nonzero base: 7⁰ = 1, 12⁰ = 1, and 1000⁰ = 1. A zero exponent does not mean "nothing is left"; it means "the base divided by itself".` },
    { loId: 'm8math.zero-and-negative-exponents', content: `THE QUOTIENT RULE FORCES a⁻ⁿ = 1/aⁿ — take a² ÷ a⁵. The rule subtracts the exponents: a²⁻⁵ = a⁻³. Written out, a² ÷ a⁵ is (a × a) ÷ (a × a × a × a × a); two factors of a cancel top and bottom, leaving 1 ÷ (a × a × a), which is 1/a³. So a⁻³ and 1/a³ are the same number. With 2 as the base: 2² ÷ 2⁵ = 4 ÷ 32 = 1/8, and 1/2³ = 1/8 as well. A negative exponent means the reciprocal of the matching positive power.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'framework', title: 'Walk the ladder', content: `WALK THE LADDER — 2³ = 8, 2² = 4, 2¹ = 2, and each step down divides by 2. Keep going: 2⁰ = 2 ÷ 2 = 1, then 2⁻¹ = 1 ÷ 2 = 1/2, then 2⁻² = 1/4, then 2⁻³ = 1/8. A positive exponent says how many times to multiply by the base, and a negative exponent says how many times to divide by it. The ladder never lands on zero and never turns negative; it just keeps shrinking.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'framework', title: 'A negative exponent is not a negative number', content: `A NEGATIVE EXPONENT IS NOT A NEGATIVE NUMBER — 2⁻³ = 1/8, a positive number sitting between 0 and 1. The sign of a power comes from the BASE, never from the exponent: (-2)³ = -8 because the base is negative, while 2⁻³ = 1/8 because the exponent only shrinks the value. Reading 2⁻³ as -8 is the mistake this lesson exists to kill.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'framework', title: 'A fraction base flips', content: `A FRACTION BASE FLIPS — (1/2)⁻² means the reciprocal of (1/2)², and (1/2)² = 1/4, so (1/2)⁻² = 1 ÷ (1/4) = 4. The short version: a negative exponent on a fraction flips the fraction and makes the exponent positive, so (1/2)⁻² = 2² = 4. Notice that 4 is bigger than 1, because dividing by a number smaller than 1 makes things grow.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'framework', title: 'The rules still work', content: `THE RULES STILL WORK — the product and quotient rules do not care whether an exponent is negative; you add or subtract the exponents exactly as before, keeping the signs. 3² × 3⁻⁵: add the exponents, 2 + (-5) = -3, so the product is 3⁻³ = 1/3³ = 1/27. Check it with values: 3² = 9 and 3⁻⁵ = 1/243, and 9/243 = 1/27, since 243 ÷ 9 = 27.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'definition', title: 'reciprocal', content: `the flip of a number: the reciprocal of 8 is 1/8, and the reciprocal of 1/4 is 4. A number times its reciprocal is 1.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'definition', title: 'zero exponent', content: `an exponent of 0; any nonzero base raised to it equals 1, because it stands for the base divided by itself.` },
    { loId: 'm8math.zero-and-negative-exponents', kind: 'definition', title: 'negative exponent', content: `an exponent below 0; a⁻ⁿ stands for 1/aⁿ, the reciprocal of the positive power. The exponent never makes the answer negative; only the base can.` },
  ],
  methods: [
    {
      title: 'Worked quotient rule two ways',
      steps: [
        `Start with 5³ ÷ 5³. The quotient rule subtracts the exponents: 3 - 3 = 0, so the rule says the answer is 5⁰.`,
        `Now work it with values. 5³ = 5 × 5 × 5 = 125, so 5³ ÷ 5³ = 125 ÷ 125 = 1. The same division gave 5⁰ and gave 1, so 5⁰ = 1.`,
        `Now 2² ÷ 2⁵. The quotient rule subtracts the exponents: 2 - 5 = -3, so the rule says the answer is 2⁻³.`,
        `Work it with values. 2² = 4 and 2⁵ = 32, so 2² ÷ 2⁵ = 4 ÷ 32 = 4/32 = 1/8. The same division gave 2⁻³ and gave 1/8, so 2⁻³ = 1/8. And 2³ = 8, which means 2⁻³ = 1/2³: the reciprocal of the positive power.`,
        `Check by working backward: if 2⁻³ really is 1/8, then multiplying it by 2⁵ should give back 2², because -3 + 5 = 2. Try it: (1/8) × 32 = 32/8 = 4, and 2² = 4. It holds.`,
      ],
      example: { problem: `Work 5³ ÷ 5³ and 2² ÷ 2⁵ two ways each: once with the quotient rule, once with the actual values. Say what each result tells you about a zero or a negative exponent.`, solution: '5³ ÷ 5³ = 5⁰ = 1; 2² ÷ 2⁵ = 2⁻³ = 1/8' },
      relatedLoIds: ['m8math.zero-and-negative-exponents'],
    },
    {
      title: 'Worked product rule and fraction base',
      steps: [
        `Start with 3² × 3⁻⁵. Same base, so the product rule adds the exponents, signs included: 2 + (-5) = -3. The product is 3⁻³.`,
        `WRONG: 3⁻³ = -27, or 3⁻³ = -1/27, "because the exponent is negative". CORRECT: the negative exponent means the reciprocal of 3³, and 3³ = 27, so 3⁻³ = 1/27. The base 3 is positive, so nothing here can make the answer negative.`,
        `Check with values: 3² = 9, and 3⁻⁵ = 1/3⁵ = 1/243. Then 9 × 1/243 = 9/243. Since 243 ÷ 9 = 27, that fraction is 1/27. It matches.`,
        `Now (1/2)⁻². The negative exponent means the reciprocal of (1/2)². Compute the positive power first: (1/2)² = 1/2 × 1/2 = 1/4.`,
        `Take the reciprocal: 1 ÷ (1/4) = 4. So (1/2)⁻² = 4. The shortcut says the same thing: flip 1/2 to 2 and make the exponent positive, and 2² = 4.`,
        `Check by working backward: (1/2)⁻² × (1/2)² should be (1/2)⁰ = 1, because -2 + 2 = 0. And 4 × 1/4 = 1. It holds, and notice the answer 4 is larger than 1: dividing by a fraction makes the result grow.`,
      ],
      example: { problem: `Evaluate 3² × 3⁻⁵ and (1/2)⁻². Give each answer as a single whole number or fraction.`, solution: '3² × 3⁻⁵ = 3⁻³ = 1/27; (1/2)⁻² = 4' },
      relatedLoIds: ['m8math.zero-and-negative-exponents'],
    },
  ],
  pointers: [
    { content: `Students often say "2⁻³ = -8" — The exponent decides how many times to multiply or divide by the base, not the sign of the answer. Walk the ladder: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4, 2⁻³ = 1/8. So 2⁻³ = 1/2³ = 1/8, a positive number between 0 and 1. The only way to get -8 from a power with 2 in it is a negative base: (-2)³ = -8.`, kind: 'common-error' },
    { content: `Students often say "5⁰ = 0" — A zero exponent comes from the quotient rule: 5² ÷ 5² = 5²⁻² = 5⁰, and 5² ÷ 5² is also 25 ÷ 25 = 1, so 5⁰ = 1. On the ladder, every step down divides by 5, and 5¹ ÷ 5 = 5 ÷ 5 = 1, not 0. The same holds for every nonzero base: 7⁰, 12⁰, and 1000⁰ are all 1.`, kind: 'common-error' },
    { content: `a⁰ = 1 for every nonzero base, because a³ ÷ a³ is a⁰ by the quotient rule and 1 by plain division.`, kind: 'tip' },
    { content: `a⁻ⁿ = 1/aⁿ: a negative exponent means the reciprocal of the matching positive power. 2⁻³ = 1/8.`, kind: 'tip' },
    { content: `A negative exponent never makes the answer negative. The sign comes from the base; the exponent only decides how many times to multiply or divide.`, kind: 'tip' },
    { content: `Walking the ladder down divides by the base at every step: 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4.`, kind: 'tip' },
    { content: `A fraction base with a negative exponent flips: (1/2)⁻² = 2² = 4, which is bigger than 1.`, kind: 'tip' },
    { content: `The product and quotient rules work exactly the same with negative exponents, signs included: 3² × 3⁻⁵ = 3⁻³ = 1/27.`, kind: 'tip' },
    { content: `A negative exponent does NOT make the answer negative. Only the BASE can make a number negative. 2⁻³ = 1/8 (positive), not -8. The exponent just tells you to divide.`, kind: 'common-error' },
    { content: `Don't write a⁰ = 0. Every nonzero base to the power 0 equals 1, because a⁰ comes from dividing the base by itself (a³ ÷ a³ = 1).`, kind: 'common-error' },
    { content: `When you see a⁻ⁿ, think 'reciprocal of aⁿ.' So 2⁻³ = 1/2³ = 1/8. The negative exponent flips it to a fraction; it never flips the sign of the answer.`, kind: 'vocab-note' },
    { content: `When a fraction base gets a negative exponent, flip the fraction AND make the exponent positive: (1/2)⁻² = 2² = 4. The answer gets bigger, not smaller.`, kind: 'tip' },
    { content: `The product and quotient rules still work when exponents are negative. Just add or subtract the exponents with their signs: 3² × 3⁻⁵ = 3^(2+(-5)) = 3⁻³.`, kind: 'tip' },
    { content: `Walk the ladder to build intuition: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4. Each step down divides by the base. The result shrinks but never becomes 0 or negative.`, kind: 'tip' },
    { content: `Before you simplify, make sure the base is the same when you use product or quotient rules. You can't combine 2³ × 3⁻² because the bases are 2 and 3, not the same number.`, kind: 'gotcha' },
    { content: `Be careful: a⁰ = 1 only when a ≠ 0. The expression 0⁰ is undefined (not in 8th grade, but avoid writing it as 1). All other nonzero bases work: 7⁰ = 1, 12⁰ = 1, (-3)⁰ = 1.`, kind: 'edge-case' },
  ],
};
