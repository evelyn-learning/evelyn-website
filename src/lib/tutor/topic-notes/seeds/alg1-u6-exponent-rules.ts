/**
 * Algebra 1 — Unit 6 CED 6.1: Exponent Rules.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.exponent-rules.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U6_EXPONENT_RULES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.exponent-rules.v1',
  course: 'Algebra 1',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Exponent Rules',
  planId: 'evelyn.hs.alg1.exponent-rules.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.exponent-rules.v1' }],
  theory: [
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Product rule', content: `PRODUCT RULE — xᵃ · xᵇ = xᵃ⁺ᵇ. Multiplying powers of the SAME base ADDS the exponents: x³ · x⁵ = x⁸.` },
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Quotient rule', content: `QUOTIENT RULE — xᵃ / xᵇ = xᵃ⁻ᵇ. Dividing powers of the same base SUBTRACTS the exponents: x⁷ / x⁴ = x³.` },
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Power rule', content: `POWER RULE — (xᵃ)ᵇ = xᵃᵇ. Raising a power to a power MULTIPLIES the exponents: (x³)⁵ = x¹⁵.` },
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Power of a product / quotient', content: `POWER OF A PRODUCT / QUOTIENT — the outside exponent lands on EVERY factor inside: (xy)ᵃ = xᵃyᵃ and (x/y)ᵃ = xᵃ/yᵃ. The coefficient is a factor too, so (3x²)³ = 3³ · x⁶ = 27x⁶ — not 3x⁶.` },
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Why they work', content: `WHY THEY WORK — COUNT THE FACTORS: x³ · x² = (x·x·x)(x·x) = x⁵, five factors in a row. And (x³)² = (x·x·x)(x·x·x) = x⁶, three factors taken twice. You never have to memorize which rule adds and which multiplies if you can expand a small case and count.` },
    { loId: 'alg1.exponent-rules', content: `ADD vs MULTIPLY — the classic mix-up in one line: x³ · x⁵ = x⁸ (product rule, ADD), but (x³)⁵ = x¹⁵ (power rule, MULTIPLY). Read the parentheses before you touch the exponents.` },
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Same base only', content: `SAME BASE ONLY — x³ · y⁴ cannot be combined; there is no rule for different bases. And x³ + x⁵ is NOT an exponent rule at all — addition needs like terms, so it stays as it is, while x³ + x³ = 2x³.` },
    { loId: 'alg1.exponent-rules', kind: 'framework', title: 'Watch the base', content: `WATCH THE BASE — 2x³ means 2 · x · x · x, so only the x is cubed; (2x)³ = 2³x³ = 8x³, where the parentheses put the 2 inside the base.` },
    { loId: 'alg1.exponent-rules', kind: 'definition', title: 'base', content: 'in xᵃ, the x — the factor being repeated.' },
    { loId: 'alg1.exponent-rules', kind: 'definition', title: 'coefficient', content: `the number multiplying a power, like the 3 in 3x² — it is a factor, so an outside exponent applies to it too.` },
  ],
  methods: [
    {
      title: 'Worked combine',
      steps: [
        `Power of a product first — the exponent 3 hits every factor: (3x²y⁵)³ = 3³ · x⁶ · y¹⁵ = 27x⁶y¹⁵. Note the exponents 2 and 5 got MULTIPLIED by 3.`,
        `Multiply by 2xy using the product rule: coefficients 27 · 2 = 54, and ADD exponents — x⁶⁺¹ = x⁷, y¹⁵⁺¹ = y¹⁶. So far: 54x⁷y¹⁶.`,
        `Divide by 9x⁴y⁶ using the quotient rule: coefficients 54 / 9 = 6, and SUBTRACT exponents — x⁷⁻⁴ = x³, y¹⁶⁻⁶ = y¹⁰.`,
        `Final: 6x³y¹⁰. Sanity check with x = y = 1: the original is (3)³ · 2 / 9 = 54/9 = 6, and 6(1)(1) = 6. ✓`,
      ],
      example: { problem: 'Simplify: (3x²y⁵)³ · 2xy / (9x⁴y⁶)', solution: '6x³y¹⁰' },
      relatedLoIds: ['alg1.exponent-rules'],
    },
    {
      title: 'Worked add vs multiply',
      steps: [
        `(2a⁴)³ — the cube is OUTSIDE the parentheses, so it applies to both factors: 2³ · (a⁴)³ = 8 · a¹² = 8a¹². Power rule multiplied 4 by 3, and the coefficient 2 got cubed as well.`,
        `2a⁴ · a³ — this is a multiplication of two powers of a, so the product rule ADDS: a⁴⁺³ = a⁷. The coefficient 2 is only multiplied by 1, so it stays: 2a⁷.`,
        `Compare: 8a¹² versus 2a⁷. Same-looking pieces, completely different results — the parentheses decided it.`,
        `Check with a = 1: (2·1)³ = 8 and 8(1)¹² = 8 ✓; 2·1·1 = 2 and 2(1)⁷ = 2 ✓. Check the first with a = 2: (2 · 16)³ = 32³ = 32768, and 8 · 2¹² = 8 · 4096 = 32768. ✓`,
      ],
      example: { problem: 'Simplify BOTH and explain why the answers differ: (2a⁴)³ and 2a⁴ · a³', solution: '(2a⁴)³ = 8a¹²; 2a⁴ · a³ = 2a⁷' },
      relatedLoIds: ['alg1.exponent-rules'],
    },
  ],
  pointers: [
    { content: `x³ · x⁵ = x⁸. Expand it: (x·x·x)(x·x·x·x·x) is eight x factors in a row, so you ADD. Exponents multiply only when a power is raised to a power, as in (x³)⁵ = x¹⁵.`, kind: 'common-error' },
    { content: `x³ + x³ = 2x³. These are like terms, so you count them: one x³ plus another x³ is two of them. The exponent never changes when you add.`, kind: 'common-error' },
    { content: 'Same base: multiply → ADD exponents; divide → SUBTRACT exponents.', kind: 'tip' },
    { content: 'Power to a power → MULTIPLY exponents. Parentheses are the signal.', kind: 'tip' },
    { content: `An outside exponent hits every factor inside, coefficient included: (3x²)³ = 27x⁶.`, kind: 'tip' },
    { content: `When in doubt, expand a small case and count the factors — that is where every rule comes from.`, kind: 'tip' },
    { content: 'Addition is not an exponent rule: x³ + x³ = 2x³, not x⁶.', kind: 'tip' },
    { content: `Read the parentheses BEFORE you touch exponents: \`x³ · x⁵ = x⁸\` (add) but \`(x³)⁵ = x¹⁵\` (multiply). If the exponent sits outside a parenthesis, you multiply; if two powers sit side by side, you add.`, kind: 'common-error' },
    { content: `An outside exponent hits the coefficient too. \`(3x²)³ = 3³x⁶ = 27x⁶\`, not \`3x⁶\`. Cube the number, don't just carry it along.`, kind: 'gotcha' },
    { content: `\`2x³\` and \`(2x)³\` are different: \`2x³\` cubes only x, while \`(2x)³ = 8x³\` cubes the whole base. Check what the exponent is actually attached to before simplifying.`, kind: 'vocab-note' },
    { content: `Exponent rules apply to multiplication and division only. \`x³ + x³ = 2x³\` (like terms, exponent unchanged), and \`x³ + x⁵\` cannot be simplified at all. Never add exponents across a \`+\` sign.`, kind: 'common-error' },
    { content: `Different bases don't combine: \`x³ · y⁴\` stays as it is. Only match exponents when the bases are identical — handle x's with x's and y's with y's separately.`, kind: 'edge-case' },
    { content: `In the quotient rule, subtract in the right order: top exponent minus bottom. \`x⁴/x⁷\` is \`x⁻³\`, not \`x³\` — flipping the subtraction is a silent sign error.`, kind: 'gotcha' },
    { content: `Coefficients follow ARITHMETIC, not exponent rules: in \`54x⁷/9x⁴\` you divide 54 by 9 to get 6 — you don't subtract 54 and 9. Exponents get the rules; numbers in front get multiplied or divided normally.`, kind: 'common-error' },
    { content: `Forgot which rule adds and which multiplies? Expand a tiny case and count factors: \`x²·x³ = (xx)(xxx)\` = 5 factors; \`(x²)³ = (xx)(xx)(xx)\` = 6. Two seconds of counting beats a guess.`, kind: 'tip' },
  ],
};
