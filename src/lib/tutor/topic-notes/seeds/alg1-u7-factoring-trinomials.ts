/**
 * Algebra 1 — Unit 7 CED 7.4: Factoring Trinomials.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.factoring-trinomials.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U7_FACTORING_TRINOMIALS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.factoring-trinomials.v1',
  course: 'Algebra 1',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Factoring Trinomials',
  planId: 'evelyn.hs.alg1.factoring-trinomials.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.factoring-trinomials.v1' }],
  theory: [
    { loId: 'alg1.factoring-trinomials', kind: 'framework', title: 'Un-foiling', content: `UN-FOILING — a trinomial that came from two binomials can be sent back to them. Since (x + 3)(x + 8) = x² + 11x + 24, the two numbers you are hunting for are exactly the ones that MULTIPLY to the constant and ADD to the middle coefficient.` },
    { loId: 'alg1.factoring-trinomials', kind: 'framework', title: 'Step 0', content: `STEP 0 — GCF ALWAYS FIRST: pull the greatest common factor out of all three terms before anything else. 2x² + 12x + 16 = 2(x² + 6x + 8). The trinomial left inside is smaller and easier, and the GCF stays part of the final answer.` },
    { loId: 'alg1.factoring-trinomials', content: `x² + bx + c — SUM-PRODUCT: find two numbers whose product is c and whose sum is b, then drop them straight into (x + __)(x + __). For x² + 9x + 20 the pair is 4 and 5, giving (x + 4)(x + 5).` },
    { loId: 'alg1.factoring-trinomials', kind: 'framework', title: 'Sign reading', content: `SIGN READING — do not guess the signs, read them. If c is POSITIVE the two numbers share a sign and that sign matches b: c = +24 with b = +11 gives 3 and 8; c = +24 with b = −11 gives −3 and −8. If c is NEGATIVE the two numbers have OPPOSITE signs, and the one that is bigger in size takes the sign of b: c = −28 with b = −3 gives −7 and +4.` },
    { loId: 'alg1.factoring-trinomials', content: `ax² + bx + c — AC-METHOD: multiply a·c, find two numbers with that product that add to b, split the middle term into those two pieces, then factor by grouping. For 3x² + 10x + 8: a·c = 24, the pair is 4 and 6, so 3x² + 6x + 4x + 8 → 3x(x + 2) + 4(x + 2) → (x + 2)(3x + 4).` },
    { loId: 'alg1.factoring-trinomials', kind: 'framework', title: 'Grouping check', content: `GROUPING CHECK — after the split, the two parentheses you produce MUST be identical. If they are not, either a sign is off or the two middle pieces need to be swapped; either way, stop and fix it before continuing.` },
    { loId: 'alg1.factoring-trinomials', kind: 'framework', title: 'Check by FOIL, every time', content: `CHECK BY FOIL, EVERY TIME — multiply your factors back out. Landing on anything other than the original trinomial means the factoring is wrong, and you will catch it in about ten seconds.` },
    { loId: 'alg1.factoring-trinomials', kind: 'framework', title: 'Classic errors', content: `CLASSIC ERRORS — forgetting the GCF, or pulling it out and then dropping it from the final answer; guessing signs instead of reading them off c and b; and calling the job done while a factor like (2x + 4) still hides a common factor of 2 inside.` },
    { loId: 'alg1.factoring-trinomials', kind: 'definition', title: 'trinomial', content: 'a polynomial with exactly three terms, such as x² + 11x + 24.' },
    { loId: 'alg1.factoring-trinomials', kind: 'definition', title: 'ac-method', content: `for ax² + bx + c, split the middle term using two numbers that multiply to a·c and add to b, then factor by grouping.` },
  ],
  methods: [
    {
      title: 'Worked sum product',
      steps: [
        `GCF check first: 1, 11, and 24 share nothing but 1, so there is no GCF to pull out.`,
        `Leading coefficient is 1, so use sum-product: two numbers with product 24 and sum 11. Both are positive because c = +24 and b = +11.`,
        `List the pairs multiplying to 24: 1 and 24 (sum 25), 2 and 12 (sum 14), 3 and 8 (sum 11) ← that is the pair, 4 and 6 (sum 10).`,
        'Drop the pair in: (x + 3)(x + 8).',
        'Check by FOIL: x² + 8x + 3x + 24 = x² + 11x + 24. ✓',
      ],
      example: { problem: 'Factor x² + 11x + 24.', solution: '(x + 3)(x + 8)' },
      relatedLoIds: ['alg1.factoring-trinomials'],
    },
    {
      title: 'Worked GCF ac method',
      steps: [
        `GCF FIRST — 6, −2, and −20 all share 2: 6x² − 2x − 20 = 2(3x² − x − 10). Park that 2 outside; it belongs in the final answer.`,
        `Inside, a = 3, b = −1, c = −10, so the leading coefficient is not 1 — use the ac-method: a·c = 3(−10) = −30.`,
        `Need two numbers with product −30 and sum −1. The product is negative, so the signs are opposite, and the bigger-in-size number takes the sign of b (negative): −6 and 5. Check: (−6)(5) = −30 and −6 + 5 = −1. ✓`,
        `Split the middle term and group: 3x² − 6x + 5x − 10 = 3x(x − 2) + 5(x − 2). The two parentheses match, which confirms the split was right.`,
        `Factor out the shared (x − 2): (x − 2)(3x + 5). Now restore the GCF — leaving it behind is the classic slip: 2(x − 2)(3x + 5).`,
        `Check by FOIL: (x − 2)(3x + 5) = 3x² + 5x − 6x − 10 = 3x² − x − 10, and 2(3x² − x − 10) = 6x² − 2x − 20. ✓`,
      ],
      example: { problem: 'Factor completely: 6x² − 2x − 20', solution: '2(x − 2)(3x + 5)' },
      relatedLoIds: ['alg1.factoring-trinomials'],
    },
  ],
  pointers: [
    { content: `(2x + 4)(x + 4) isn't fully factored — (2x + 4) still has a common factor of 2 hiding inside it. Pull the GCF before anything else: 2x² + 12x + 16 = 2(x² + 6x + 8) = 2(x + 2)(x + 4). Same product, but now every factor is fully broken down.`, kind: 'common-error' },
    { content: `The 2 is part of the answer: 2(x + 2)(x + 4). Without it the expression is only x² + 6x + 8, which is half of the original.`, kind: 'common-error' },
    { content: 'GCF first — and keep it in the final answer.', kind: 'tip' },
    { content: 'x² + bx + c: two numbers that multiply to c and add to b.', kind: 'tip' },
    { content: `c positive → same signs, matching b; c negative → opposite signs, with the bigger number taking the sign of b.`, kind: 'tip' },
    { content: `ax² + bx + c: use a·c, split the middle term, factor by grouping — the two parentheses must match.`, kind: 'tip' },
    { content: `Check by FOILing back, and make sure no factor still has something left to pull out.`, kind: 'tip' },
    { content: `A correct product doesn't mean you're done. If any factor like (2x + 4) still hides a common factor, the expression isn't factored **completely**. Scan each finished binomial for a GCF before you write the answer.`, kind: 'gotcha' },
    { content: `Once you pull out a GCF, write it in front of your parentheses immediately. Dropping it later turns 2(x + 2)(x + 4) into an expression worth half the original.`, kind: 'common-error' },
    { content: `Read the signs, don't guess: c > 0 → both numbers share b's sign; c < 0 → opposite signs, and the larger-in-size number takes b's sign. Test on x² − 3x − 28: −7 and +4, not +7 and −4.`, kind: 'tip' },
    { content: `In the ac-method the pair multiplies to **a·c**, not to c alone. For 3x² + 10x + 8 you need product 24 (not 8) and sum 10.`, kind: 'common-error' },
    { content: `After grouping, the two parentheses must be **identical**. If you get 3x(x + 2) + 4(x − 2), something is wrong — swap the two middle pieces or recheck a sign. Never force a match.`, kind: 'gotcha' },
    { content: `When grouping with a negative third term, factor out a **negative** so the parentheses match: 2x² − 6x − 5x + 15 = 2x(x − 3) − 5(x − 3), not −5(x + 3).`, kind: 'edge-case' },
    { content: `"Trinomial" means exactly three terms; "factor completely" means every factor is as broken down as possible. Answering (2x + 4)(x + 4) answers a different question than the one asked.`, kind: 'vocab-note' },
    { content: `Some trinomials just don't factor over the integers (x² + x + 5 has no integer pair). List all factor pairs of c first — if none sums to b, write "prime," don't invent a pair.`, kind: 'edge-case' },
  ],
};
