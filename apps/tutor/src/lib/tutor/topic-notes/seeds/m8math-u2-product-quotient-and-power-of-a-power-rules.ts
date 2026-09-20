/**
 * Grade 8 Math — Unit 2 CED 2.1: Product, Quotient & Power-of-a-Power Rules.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.product-quotient-and-power-of-a-power-rules.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U2_PRODUCT_QUOTIENT_AND_POWER_OF_A_POWER_RULES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.product-quotient-and-power-of-a-power-rules.v1',
  course: 'Grade 8 Math',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Product, Quotient & Power-of-a-Power Rules',
  planId: 'evelyn.ms.m8math.product-quotient-and-power-of-a-power-rules.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.product-quotient-and-power-of-a-power-rules.v1' }],
  theory: [
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'framework', title: 'The exponent counts the factors', content: `THE EXPONENT COUNTS THE FACTORS — 2³ means 2 × 2 × 2, three factors of 2, and you already evaluate it as 8. Writing a power out as its list of factors is called expanded form, and it is the tool that proves every rule in this lesson. When you are unsure which rule applies, expand and count.` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', content: `PRODUCT RULE: SAME BASE, MULTIPLY, ADD THE EXPONENTS — 3² × 3⁵ expands to (3 × 3) × (3 × 3 × 3 × 3 × 3), which is seven factors of 3 in a row, so 3² × 3⁵ = 3⁷. Two factors plus five factors is seven factors, and that is all "add the exponents" means. Check with values: 9 × 243 = 2187, and 3⁷ = 2187. The same count works in base 10: 10⁴ × 10³ is four zeros followed by three more, 10⁷.` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', content: `QUOTIENT RULE: SAME BASE, DIVIDE, SUBTRACT THE EXPONENTS — 5⁶ ÷ 5² is six factors of 5 on top and two factors of 5 underneath. Each 5 underneath cancels one 5 on top, so two pairs cancel and four factors of 5 are left: 5⁶ ÷ 5² = 5⁴. Six factors minus two factors is four factors. Check with values: 15625 ÷ 25 = 625, and 5⁴ = 625. In this lesson the bigger exponent is always on top, so the subtraction always leaves a positive count.` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', content: `POWER OF A POWER: MULTIPLY THE EXPONENTS — (2³)² means 2³ used as a factor twice: 2³ × 2³. That is (2 × 2 × 2) × (2 × 2 × 2), two groups of three factors, six factors of 2 in all, so (2³)² = 2⁶. Two groups of three is 2 × 3 = 6, which is why this rule multiplies. Check with values: 2³ = 8, 8² = 64, and 2⁶ = 64.` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'framework', title: 'The base never changes, and the bases must match', content: `THE BASE NEVER CHANGES, AND THE BASES MUST MATCH — in every rule the base stays exactly what it was: 3² × 3⁵ is 3⁷, not 9⁷, because expanded form is a row of 3s and nothing in it is a 9. And the rules only work when both powers have the SAME base, because only then are all the factors alike. 2³ × 5² is 8 × 25, which is 200, and there is no shortcut for it; the 2s and the 5s cannot be counted together.` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'framework', title: 'A variable base works the same way', content: `A VARIABLE BASE WORKS THE SAME WAY — x stands for one number, so x⁴ × x³ is four factors of x followed by three more, seven factors, x⁷. Check by choosing a value: if x = 2, then 16 × 8 = 128, and 2⁷ = 128. Expand and count works whether the base is 2, 10, or x.` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'definition', title: 'base', content: 'the number being multiplied by itself, the 3 in 3⁵.' },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'definition', title: 'exponent', content: 'the count of how many times the base is used as a factor, the 5 in 3⁵.' },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'definition', title: 'power', content: `a base with an exponent, such as 3⁵ or x⁴, read "3 to the fifth" or "x to the fourth".` },
    { loId: 'm8math.product-quotient-and-power-of-a-power-rules', kind: 'definition', title: 'expanded form', content: 'a power written out as its list of factors: 3⁵ = 3 × 3 × 3 × 3 × 3.' },
  ],
  methods: [
    {
      title: 'Worked product then quotient',
      steps: [
        `Every power here has base 2, so the rules apply. Work the parentheses first. Inside them, 2⁴ × 2³ is a product of powers with the same base: four factors of 2 followed by three more, seven factors, so 2⁴ × 2³ = 2⁷.`,
        `Now the expression is 2⁷ ÷ 2⁵, a quotient of powers with the same base. Seven factors of 2 on top, five underneath, five pairs cancel, two factors are left: 2⁷ ÷ 2⁵ = 2². Subtract the exponents, 7 - 5 = 2.`,
        'The single power is 2², which equals 4.',
        `Check with values from the original expression: 2⁴ = 16, 2³ = 8, and 16 × 8 = 128. Then 2⁵ = 32, and 128 ÷ 32 = 4. The value check gives 4, and 2² is 4, so the rules did exactly what the arithmetic did.`,
        `Notice that you never needed the value 128 to get the answer. The exponents did the counting: 4 + 3 = 7 factors, then 7 - 5 = 2 factors. The value check is there to catch a slip, not to find the answer.`,
      ],
      example: { problem: 'Write (2⁴ × 2³) ÷ 2⁵ as a single power of 2, then check the answer with values.', solution: '2² (which is 4)' },
      relatedLoIds: ['m8math.product-quotient-and-power-of-a-power-rules'],
    },
    {
      title: 'Worked power of a power',
      steps: [
        `Read the outer exponent for what it counts: (3²)⁴ means 3² used as a factor four times, 3² × 3² × 3² × 3².`,
        `Expand each 3²: (3 × 3) × (3 × 3) × (3 × 3) × (3 × 3). That is four groups of two factors, eight factors of 3 in all, so (3²)⁴ = 3⁸. Four groups of two is 2 × 4 = 8, which is why a power of a power multiplies the exponents.`,
        `WRONG: (3²)⁴ = 3⁶, from adding 2 + 4 because the two exponents are sitting next to each other. CORRECT: (3²)⁴ = 3⁸. Adding is the product rule, and a product rule needs two powers being multiplied, not one power inside parentheses with an exponent outside.`,
        `Check with values: 3² = 9, and 9⁴ = 9 × 9 × 9 × 9 = 81 × 81 = 6561. Then 3⁸ = 3⁴ × 3⁴ = 81 × 81 = 6561. Both roads give 6561, so 3⁸ is right. The wrong answer 3⁶ is 729, nowhere near it.`,
        `Now the look-alike, 3² × 3⁴. This time there are two separate powers being multiplied, two factors of 3 followed by four more, six factors, so 3² × 3⁴ = 3⁶. Check with values: 9 × 81 = 729, and 3⁶ = 729.`,
        `Same digits, different structure, different rule. An exponent outside parentheses multiplies the exponents; a multiplication sign between two powers adds them. When in doubt, expand and count the factors.`,
      ],
      example: { problem: `Write (3²)⁴ as a single power of 3. Then compare it with 3² × 3⁴, which looks almost the same.`, solution: '(3²)⁴ = 3⁸ (which is 6561), while 3² × 3⁴ = 3⁶ (which is 729)' },
      relatedLoIds: ['m8math.product-quotient-and-power-of-a-power-rules'],
    },
  ],
  pointers: [
    { content: `Students often say "3² × 3⁵ = 9⁷" — The exponents were added correctly, 2 + 5 = 7, but the base never changes. Expanded form is (3 × 3) × (3 × 3 × 3 × 3 × 3), a row of seven 3s, and nothing in that row is a 9. So 3² × 3⁵ = 3⁷, which is 2187. The value check exposes 9⁷: it equals 4,782,969, while 9 × 243 is 2187. Only the count of factors changes; the base is what is being counted.`, kind: 'common-error' },
    { content: `Students often say "2³ × 5² = 10⁵" — The product rule needs the same base on both powers, because the rule is just counting factors that are all alike. Here the factors are 2 × 2 × 2 × 5 × 5, three 2s and two 5s, and there is no way to count them as one kind. So there is no shortcut: 2³ = 8, 5² = 25, and 8 × 25 = 200. The claim 10⁵ is 100,000, which is nowhere near 200. When the bases differ, evaluate each power and multiply the values.`, kind: 'common-error' },
    { content: `The exponent counts the factors. Expanded form, a power written as its row of factors, proves every rule and settles every doubt.`, kind: 'tip' },
    { content: 'Same base, multiply: ADD the exponents. 3² × 3⁵ = 3⁷.', kind: 'tip' },
    { content: 'Same base, divide: SUBTRACT the exponents. 5⁶ ÷ 5² = 5⁴.', kind: 'tip' },
    { content: 'Power of a power: MULTIPLY the exponents. (2³)² = 2⁶.', kind: 'tip' },
    { content: `The base never changes, and the rules only apply when the bases match. 3² × 3⁵ is 3⁷, never 9⁷; 2³ × 5² has no rule, it is just 8 × 25 = 200.`, kind: 'tip' },
    { content: `Check with values: work out the original expression and the single power as plain numbers, and they must match. A variable base such as x works the same way, and choosing a value for x lets you check it too.`, kind: 'tip' },
    { content: `When bases don't match, there is NO rule. 2³ × 5² is not 10⁵. Expand and count: you get three 2s and two 5s, not five of the same thing. Just multiply the values: 8 × 25 = 200.`, kind: 'common-error' },
    { content: `Don't add exponents when you see an exponent outside parentheses. (3²)⁴ means 3² as a factor four times, so you multiply 2 × 4 = 8, not add. Adding only works when there's a multiplication sign between two powers.`, kind: 'common-error' },
    { content: `The base never changes when you apply a rule. 3² × 3⁵ = 3⁷, not 9⁷. The exponent counts factors, and those factors are all 3s, not 9s.`, kind: 'gotcha' },
    { content: `Always expand and count when you're unsure which rule applies or whether a rule applies at all. Expanded form is your proof—it never lies.`, kind: 'tip' },
    { content: `A variable base like x works exactly the same way as a number base. x⁴ × x³ = x⁷, just four factors of x plus three more. You can check by plugging in a number for x.`, kind: 'vocab-note' },
    { content: `The exponent is the count of factors. 2⁵ is five 2s, not 2 × 5. If you say '2 times 5' instead of 'two to the fifth,' you'll mix up the exponent with multiplication.`, kind: 'vocab-note' },
    { content: `In this lesson, the bigger exponent is always on top when you divide, so the subtraction is always positive. If you get a negative exponent, you made a slip—check your arithmetic.`, kind: 'edge-case' },
    { content: `Use the value check to catch arithmetic mistakes, not to find the answer. Work out the original expression and the simplified power as plain numbers—they must match. If they don't, you made an error somewhere.`, kind: 'tip' },
  ],
};
