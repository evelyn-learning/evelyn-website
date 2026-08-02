/**
 * Algebra 1 — Unit 6 CED 6.2: Zero & Negative Exponents; Scientific Notation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.negative-exponents-scientific-notation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U6_NEGATIVE_EXPONENTS_SCIENTIFIC_NOTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.negative-exponents-scientific-notation.v1',
  course: 'Algebra 1',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Zero & Negative Exponents; Scientific Notation',
  planId: 'evelyn.hs.alg1.negative-exponents-scientific-notation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.negative-exponents-scientific-notation.v1' }],
  theory: [
    { loId: 'alg1.negative-exponents-scientific-notation', content: `WHY a⁰ = 1 — the quotient rule says a⁵/a⁵ = a⁵⁻⁵ = a⁰. But anything nonzero divided by itself is 1. So a⁰ = 1 for every a ≠ 0. It is a consequence of the rules, not a random definition. (0⁰ is left undefined.)` },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'framework', title: 'Only what the exponent touches', content: `ONLY WHAT THE EXPONENT TOUCHES — in 4x⁰ the exponent sits on x alone, so 4x⁰ = 4 · 1 = 4. In (4x)⁰ the parentheses put it on everything, so (4x)⁰ = 1.` },
    { loId: 'alg1.negative-exponents-scientific-notation', content: `WHY a⁻ⁿ = 1/aⁿ — walk the pattern down: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, and each step divides by 2, so 2⁻¹ = 1/2 and 2⁻² = 1/4. A negative exponent keeps dividing.` },
    { loId: 'alg1.negative-exponents-scientific-notation', content: `NEGATIVE EXPONENT ≠ NEGATIVE VALUE — 2⁻³ = 1/8, a positive number between 0 and 1. The BASE decides the sign; the exponent only decides the size. Positive exponents grow, negative exponents shrink.` },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'framework', title: 'Crossing the fraction bar', content: `CROSSING THE FRACTION BAR — a FACTOR with a negative exponent flips to the other side and turns positive: x⁻²y³ = y³/x², and 1/x⁻² = x². This works on factors only, never on terms: (x + y)⁻¹ is NOT 1/x + 1/y.` },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'framework', title: 'Scientific notation form', content: `SCIENTIFIC NOTATION FORM — a × 10ⁿ where 1 ≤ a < 10 and n is an integer. 4,500,000 = 4.5 × 10⁶; 0.00032 = 3.2 × 10⁻⁴. Count how many places the decimal point moves; big numbers get a POSITIVE n, numbers under 1 get a NEGATIVE n.` },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'framework', title: 'Multiplying and dividing', content: `MULTIPLYING AND DIVIDING — regroup: multiply the front numbers and ADD the exponents; divide the front numbers and SUBTRACT the exponents. (3 × 10⁵)(2 × 10⁻⁸) = 6 × 10⁻³.` },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'framework', title: 'Renormalize at the end', content: `RENORMALIZE AT THE END — if the front number lands outside 1 ≤ a < 10, fix it: (5 × 10⁴)(4 × 10³) = 20 × 10⁷ = 2 × 10⁸. Likewise 0.4 × 10⁷ = 4 × 10⁶.` },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'definition', title: 'reciprocal', content: 'the flip of a number — the reciprocal of aⁿ is 1/aⁿ, which is what a⁻ⁿ means.' },
    { loId: 'alg1.negative-exponents-scientific-notation', kind: 'definition', title: 'scientific notation', content: 'a number written as a × 10ⁿ with 1 ≤ a < 10 and n an integer.' },
  ],
  methods: [
    {
      title: 'Worked zero negative',
      steps: [
        `Handle the zero exponent first: a⁰ = 1, and the exponent is only on a, so the numerator is 5 · 1 · b⁻³ = 5b⁻³. The 5 is untouched.`,
        `The a⁻² is downstairs, so move it upstairs and make the exponent positive: 5a²b⁻³ / b.`,
        'Same base b: b⁻³ / b¹ = b⁻³⁻¹ = b⁻⁴, giving 5a²b⁻⁴.',
        `Flip the negative exponent to clear it: 5a²b⁻⁴ = 5a²/b⁴. Check with a = 2, b = 2: original is 5(1)(1/8) ÷ ((1/4)(2)) = (5/8) ÷ (1/2) = 5/4, and 5(4)/16 = 5/4. ✓`,
      ],
      example: { problem: 'Simplify with positive exponents only: 5a⁰b⁻³ / (a⁻²b)', solution: '5a²/b⁴' },
      relatedLoIds: ['alg1.negative-exponents-scientific-notation'],
    },
    {
      title: 'Worked scinot divide',
      steps: [
        'Regroup into fronts and powers: (3.6 / 9) × (10⁴ / 10⁻³).',
        'Front numbers: 3.6 / 9 = 0.4.',
        `Powers: subtract the exponents, 4 − (−3) = 7, so 10⁷. Subtracting a negative ADDS — the classic slip is writing 4 − 3 = 1.`,
        `0.4 × 10⁷ is the right VALUE but not scientific notation, because 0.4 is less than 1. Since 0.4 = 4 × 10⁻¹, we get 4 × 10⁻¹ × 10⁷ = 4 × 10⁶.`,
        'Sanity check in plain numbers: 36,000 ÷ 0.009 = 4,000,000 = 4 × 10⁶. ✓',
      ],
      example: { problem: 'Divide and write the result in scientific notation: (3.6 × 10⁴) / (9 × 10⁻³)', solution: '4 × 10⁶' },
      relatedLoIds: ['alg1.negative-exponents-scientific-notation'],
    },
  ],
  pointers: [
    { content: `3⁻² = 1/3² = 1/9 — a POSITIVE number smaller than 1. The exponent controls size (reciprocal), the base controls sign. Compare 3² = 9 (big) with 3⁻² = 1/9 (small); neither is negative because the base 3 is positive.`, kind: 'common-error' },
    { content: '3² means 3 · 3 = 9, not 3 · 2 = 6. So 3⁻² = 1/9, not 1/6.', kind: 'common-error' },
    { content: `a⁰ = 1 for every a ≠ 0 — it falls straight out of aⁿ/aⁿ = 1. Watch what the exponent touches: 4x⁰ = 4, but (4x)⁰ = 1.`, kind: 'tip' },
    { content: 'a⁻ⁿ = 1/aⁿ. A negative exponent means RECIPROCAL, never a negative value.', kind: 'tip' },
    { content: `A factor with a negative exponent crosses the fraction bar and turns positive — factors only, never terms.`, kind: 'tip' },
    { content: `Scientific notation is a × 10ⁿ with 1 ≤ a < 10; big numbers take a positive n, numbers under 1 take a negative n.`, kind: 'tip' },
    { content: `Multiply → multiply the fronts and ADD exponents; divide → divide the fronts and SUBTRACT; then renormalize so the front is between 1 and 10.`, kind: 'tip' },
    { content: `A negative exponent never makes a number negative. 3⁻² = 1/9, not −9. The BASE decides sign, the exponent decides size. Also (−3)² = 9 but −3² = −9 — the parentheses matter just as much here.`, kind: 'common-error' },
    { content: `Check what the exponent actually touches before you write 1. In 4x⁰ only x has the exponent, so the answer is 4·1 = 4. In (4x)⁰ the parentheses include the 4, so the answer is 1. Coefficients outside parentheses never vanish.`, kind: 'gotcha' },
    { content: `Negative exponents flip FACTORS, not TERMS. x⁻²y³ = y³/x² is fine, but (x + y)⁻¹ ≠ 1/x + 1/y — it's 1/(x+y). If it's connected by + or −, you can't move pieces across the bar individually.`, kind: 'edge-case' },
    { content: `When dividing powers of 10, subtracting a negative ADDS: 10⁴/10⁻³ → 4 − (−3) = 7, not 4 − 3 = 1. Write the parentheses around the negative exponent before subtracting.`, kind: 'common-error' },
    { content: `Getting the right value isn't the same as being in scientific notation. 20 × 10⁷ and 0.4 × 10⁷ are both correct numbers but neither is in form — the front must satisfy 1 ≤ a < 10. Renormalize as the last step, every time.`, kind: 'vocab-note' },
    { content: `When you renormalize, move the exponent the opposite way from the front number: 20 × 10⁷ → 2 × 10⁸ (front shrank, exponent grew); 0.4 × 10⁷ → 4 × 10⁶ (front grew, exponent shrank). The overall value can't change.`, kind: 'tip' },
    { content: `aⁿ means n copies of a multiplied, not a·n. 3² = 3·3 = 9, so 3⁻² = 1/9 — never 1/6. If your negative-exponent answer came from multiplying base times exponent, redo it.`, kind: 'common-error' },
    { content: `a⁰ = 1 only for a ≠ 0 — 0⁰ is undefined, and 0⁻ⁿ is undefined too (you'd divide by 0). If a problem says 'for x ≠ 0', that restriction is doing real work, not decoration.`, kind: 'edge-case' },
  ],
};
