/**
 * Algebra 1 — Unit 9 CED 9.1: Simplifying Radical Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.simplifying-radicals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U9_SIMPLIFYING_RADICALS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.simplifying-radicals.v1',
  course: 'Algebra 1',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Simplifying Radical Expressions',
  planId: 'evelyn.hs.alg1.simplifying-radicals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.simplifying-radicals.v1' }],
  theory: [
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'Simplest form', content: `SIMPLEST FORM — a radical expression is simplified when (1) no perfect-square factor is left under the √ and (2) no radical is left in a denominator. Two conditions, both required.` },
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'The extraction move', content: `THE EXTRACTION MOVE — factor the radicand using the LARGEST perfect square you can find, then split: √48 = √(16 · 3) = √16 · √3 = 4√3. Keep the perfect squares handy: 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.` },
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'Product rule', content: `PRODUCT RULE — √a · √b = √(ab) whenever a and b are not negative, and it runs both directions. Rightward it merges (√8 · √2 = √16 = 4); leftward it extracts.` },
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'Quotient rule', content: `QUOTIENT RULE — √(a/b) = √a / √b for b greater than 0, so √(49/16) = 7/4. Fractions under a root split apart exactly the same way products do.` },
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'Like radicals only', content: `LIKE RADICALS ONLY — you may add or subtract only terms with the same radicand: 5√3 + 2√3 = 7√3. Add the coefficients, leave the radicand alone. And SIMPLIFY FIRST — √8 and √50 look unlike until they become 2√2 and 5√2.` },
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'The addition trap', content: `THE ADDITION TRAP — √(a + b) is NOT √a + √b. Test it: √(9 + 16) = √25 = 5, but √9 + √16 = 3 + 4 = 7. The square root splits over multiplication and division, never over addition or subtraction.` },
    { loId: 'alg1.simplifying-radicals', kind: 'framework', title: 'Rationalizing', content: `RATIONALIZING — a lone radical downstairs gets cleared by multiplying the top and bottom by that same radical, since √5 · √5 = 5: 3/√5 = (3 · √5)/(√5 · √5) = 3√5/5. You multiplied by √5/√5, which is 1, so the value never changed.` },
    { loId: 'alg1.simplifying-radicals', kind: 'definition', title: 'radicand', content: 'the number sitting underneath the radical sign — the 48 in √48.' },
    { loId: 'alg1.simplifying-radicals', kind: 'definition', title: 'like radicals', content: `radical terms with identical radicands, e.g. 5√3 and 2√3 — the only ones that can be added or subtracted.` },
    { loId: 'alg1.simplifying-radicals', kind: 'definition', title: 'rationalize the denominator', content: 'rewrite a fraction so no radical remains on the bottom.' },
  ],
  methods: [
    {
      title: 'Worked extract and combine',
      steps: [
        `Simplify each radical on its own first. For √48, the largest perfect-square factor of 48 is 16: √48 = √(16 · 3) = √16 · √3 = 4√3.`,
        `For √27, the largest perfect-square factor is 9: √27 = √(9 · 3) = 3√3. The term is 2√27, so 2 · 3√3 = 6√3.`,
        `Now both terms carry the same radicand, √3, so they are like radicals: 4√3 + 6√3 = 10√3. Add the coefficients only — the √3 is untouched.`,
        `CHECK with decimals: √48 ≈ 6.928 and 2√27 ≈ 10.392, which sum to ≈ 17.32; 10√3 ≈ 10(1.732) = 17.32. ✓`,
      ],
      example: { problem: 'Simplify: √48 + 2√27', solution: '10√3' },
      relatedLoIds: ['alg1.simplifying-radicals'],
    },
    {
      title: 'Worked rationalize',
      steps: [
        `Clean up the radical before touching the fraction: √8 = √(4 · 2) = 2√2. The expression is now 10/(2√2).`,
        `Reduce the whole numbers out front: 10/2 = 5, leaving 5/√2. This is where most students stop — but a radical in the denominator means it is NOT in simplest form yet.`,
        `Rationalize: multiply the top and bottom by √2, which is multiplying by 1. (5 · √2)/(√2 · √2) = 5√2/2, because √2 · √2 = 2.`,
        `Nothing reduces further (5 and 2 share no factor), so 5√2/2 is the answer. CHECK: 10/√8 ≈ 10/2.828 ≈ 3.536, and 5√2/2 ≈ 5(1.414)/2 ≈ 3.536. ✓`,
      ],
      example: { problem: 'Simplify: 10/√8', solution: '5√2/2' },
      relatedLoIds: ['alg1.simplifying-radicals'],
    },
  ],
  pointers: [
    { content: `Add inside the radical FIRST: √(9 + 16) = √25 = 5, not 7. The root splits over multiplication and division only — √(9 · 16) = 3 · 4 = 12 really is legal, but √(a + b) ≠ √a + √b, ever.`, kind: 'common-error' },
    { content: `The √2 behaves like a unit label: 5 of them plus 3 of them is 8 of them, so 5√2 + 3√2 = 8√2. Only the coefficients add; the radicand never changes when you combine like radicals.`, kind: 'common-error' },
    { content: `Simplest form = no perfect-square factor under the radical AND no radical in the denominator.`, kind: 'tip' },
    { content: 'Extract with the LARGEST perfect square: √48 = √16 · √3 = 4√3.', kind: 'tip' },
    { content: '√a · √b = √(ab) and √(a/b) = √a/√b — but √(a + b) is NEVER √a + √b.', kind: 'tip' },
    { content: `Add or subtract only like radicals, and simplify first so hidden matches show up: √8 + √50 = 2√2 + 5√2 = 7√2.`, kind: 'tip' },
    { content: 'Clear a denominator radical by multiplying top and bottom by it: 3/√5 = 3√5/5.', kind: 'tip' },
    { content: `When you combine like radicals, the radicand NEVER changes: 5√2 + 3√2 = 8√2, not 8√4. Treat √2 like a unit label ('2 apples + 3 apples'). Add coefficients only.`, kind: 'common-error' },
    { content: `√(a + b) ≠ √a + √b — ever. The root splits over multiplication and division only. If you're tempted, test with 9 and 16: √25 = 5, but 3 + 4 = 7.`, kind: 'gotcha' },
    { content: `Simplest form has TWO conditions. Getting 5/√2 is not done — a radical downstairs still fails condition 2. Ask both questions every time: perfect square left inside? radical left in the denominator?`, kind: 'common-error' },
    { content: `Pull out the LARGEST perfect square, or you'll have to extract twice. √200 = √(4·50) = 2√50 is not finished (50 = 25·2); √(100·2) = 10√2 in one shot. If the leftover radicand still has a square factor, keep going.`, kind: 'tip' },
    { content: `Simplify each radical BEFORE deciding terms are unlike. √8 + √50 looks unlike but becomes 2√2 + 5√2 = 7√2. Never write 'cannot be combined' until every radicand is in simplest form.`, kind: 'gotcha' },
    { content: `Unlike radicals just stay side by side: 4√3 + 2√5 − √3 = 3√3 + 2√5. That's a finished answer, not an unsolved problem — don't force it into one term.`, kind: 'edge-case' },
    { content: `Say 'radicand' for what's under the sign and 'coefficient' for the number in front. In 2√27 the 2 is a coefficient — multiply it by the extracted 3, giving 6√3, don't leave 2·3√3 or drop the 2.`, kind: 'vocab-note' },
    { content: `Rationalizing multiplies by √a/√a = 1, so the value is unchanged — check with decimals: 10/√8 ≈ 3.536 and 5√2/2 ≈ 3.536. Do this decimal check whenever you doubt an answer.`, kind: 'tip' },
  ],
};
