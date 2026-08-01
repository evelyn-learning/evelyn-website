/**
 * Algebra 1 — Unit 7 CED 7.5: Factoring Special Forms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.factoring-special-forms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U7_FACTORING_SPECIAL_FORMS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.factoring-special-forms.v1',
  course: 'Algebra 1',
  cedUnit: 7,
  cedTopic: '7.5',
  cedTitle: 'Factoring Special Forms',
  planId: 'evelyn.hs.alg1.factoring-special-forms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.factoring-special-forms.v1' }],
  theory: [
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'Strategy order', content: `STRATEGY ORDER — 1) pull out the GCF, always, 2) count the terms: TWO terms means look for a difference of squares, THREE terms means check for a perfect-square trinomial first and a general trinomial second, 3) keep factoring until nothing inside factors any further.` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'Difference of squares', content: `DIFFERENCE OF SQUARES — a² − b² = (a + b)(a − b). It works because the middle terms cancel when you multiply back: (a + b)(a − b) = a² − ab + ab − b² = a² − b².` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'Coefficients are part of the square', content: `COEFFICIENTS ARE PART OF THE SQUARE — 9x² − 25 is a difference of squares because 9x² = (3x)² and 25 = 5², so a = 3x and b = 5, giving (3x + 5)(3x − 5). Take the square root of the number AND the variable, not just the variable.` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'Perfect-square trinomial', content: `PERFECT-SQUARE TRINOMIAL — a² + 2ab + b² = (a + b)² and a² − 2ab + b² = (a − b)². The test has two parts: the first and last terms are perfect squares, AND the middle term is exactly 2 × a × b. Example: 4x² − 12x + 9 = (2x − 3)² because 2 × 2x × 3 = 12x.` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'The sign lives in the middle term', content: `THE SIGN LIVES IN THE MIDDLE TERM — the last term of a perfect-square trinomial is always positive (it is b²); the middle term is what tells you whether the binomial is (a + b) or (a − b).` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'A sum of squares does not factor', content: `A SUM OF SQUARES DOES NOT FACTOR — a² + b² is prime over the real numbers. Test it yourself: (a + b)² = a² + 2ab + b², which carries an extra 2ab term that a² + b² simply does not have.` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'Gcf first or you will miss the pattern', content: `GCF FIRST OR YOU WILL MISS THE PATTERN — 8x² − 50 looks unfactorable because 8 and 50 are not perfect squares, but pulling out the 2 gives 2(4x² − 25) = 2(2x + 5)(2x − 5).` },
    { loId: 'alg1.factoring-special-forms', kind: 'framework', title: 'Check by multiplying back', content: `CHECK BY MULTIPLYING BACK — every factoring answer is verifiable in ten seconds by expanding it. If the product is not the original expression, the factoring is wrong.` },
    { loId: 'alg1.factoring-special-forms', kind: 'definition', title: 'difference of squares', content: 'a two-term expression a² − b² — always factors as (a + b)(a − b).' },
    { loId: 'alg1.factoring-special-forms', kind: 'definition', title: 'perfect-square trinomial', content: 'a trinomial that is the square of a binomial, a² ± 2ab + b² = (a ± b)².' },
    { loId: 'alg1.factoring-special-forms', kind: 'definition', title: 'prime polynomial', content: `a polynomial that cannot be factored further over the real numbers, like x² + 36.` },
  ],
  methods: [
    {
      title: 'Worked difference of squares',
      steps: [
        'GCF first: 9 and 25 share nothing but 1, so there is no GCF to pull out.',
        'Two terms with a minus between them — check the difference-of-squares pattern.',
        `Is each term a perfect square? 9x² = (3x)² and 25 = 5². Yes, so a = 3x and b = 5.`,
        'Apply a² − b² = (a + b)(a − b): (3x + 5)(3x − 5).',
        'CHECK by expanding: 9x² − 15x + 15x − 25 = 9x² − 25. ✓',
      ],
      example: { problem: 'Factor 9x² − 25.', solution: '(3x + 5)(3x − 5)' },
      relatedLoIds: ['alg1.factoring-special-forms'],
    },
    {
      title: 'Worked gcf then special form',
      steps: [
        `Tempting wrong move: 8 is not a perfect square and 50 is not a perfect square, so a student who skips the GCF step declares this prime. It is not.`,
        'GCF first: 8 and 50 both divide by 2. Pull it out: 2(4x² − 25).',
        `Now look inside. 4x² = (2x)² and 25 = 5², with a minus between them — a difference of squares with a = 2x and b = 5.`,
        'Factor the inside and keep the GCF out front: 2(2x + 5)(2x − 5).',
        'CHECK: (2x + 5)(2x − 5) = 4x² − 25, and 2(4x² − 25) = 8x² − 50. ✓',
      ],
      example: { problem: 'Factor 8x² − 50 completely.', solution: '2(2x + 5)(2x − 5)' },
      relatedLoIds: ['alg1.factoring-special-forms'],
    },
  ],
  pointers: [
    { content: `Expand the claim: (3x − 4)² = 9x² − 24x + 16, which has a −24x term the original does not have. Two terms with a minus means difference of squares, so it factors into a sum times a difference: 9x² − 16 = (3x + 4)(3x − 4).`, kind: 'common-error' },
    { content: `a is the square root of the WHOLE first term: √(9x²) = 3x, not x. So the answer is (3x + 4)(3x − 4), which expands back to 9x² − 16. ✓`, kind: 'common-error' },
    { content: `Order: GCF first, then count terms — two terms means difference of squares, three terms means check for a perfect square — then factor again until nothing factors.`, kind: 'tip' },
    { content: `Difference of squares: a² − b² = (a + b)(a − b), and the coefficient gets square-rooted too: 9x² − 25 = (3x + 5)(3x − 5).`, kind: 'tip' },
    { content: `Perfect-square trinomial: a² ± 2ab + b² = (a ± b)², and the middle term must be exactly 2ab.`, kind: 'tip' },
    { content: 'A sum of squares, a² + b², is prime over the real numbers — it does NOT factor.', kind: 'tip' },
    { content: 'Every answer is checkable: multiply back out and compare to the original.', kind: 'tip' },
    { content: `Two terms with a minus → difference of squares → (a + b)(a − b). Never write a two-term expression as a squared binomial: 9x² − 16 ≠ (3x − 4)², since (3x − 4)² = 9x² − 24x + 16.`, kind: 'common-error' },
    { content: `Square-root the WHOLE term, coefficient included: √(9x²) = 3x, not x. So 9x² − 16 = (3x + 4)(3x − 4), not (x + 4)(x − 4).`, kind: 'common-error' },
    { content: `Don't declare something prime before pulling the GCF. 8x² − 50 looks hopeless (8 and 50 aren't squares) but = 2(4x² − 25) = 2(2x + 5)(2x − 5). Also: the GCF stays in the final answer — don't drop it.`, kind: 'gotcha' },
    { content: `A sum of squares is prime over the reals: x² + 36 does NOT factor, and it is not (x + 6)². But x² + 36 with a GCF, like 2x² + 72 = 2(x² + 36), still factors partially — 'prime' applies to what's left inside.`, kind: 'edge-case' },
    { content: `Perfect-square trinomial has a two-part test: first and last terms are squares AND the middle term equals exactly 2ab. 4x² + 10x + 25 fails (2·2x·5 = 20x, not 10x), so try general trinomial factoring instead.`, kind: 'gotcha' },
    { content: `In a² ± 2ab + b², the last term is always POSITIVE (it's b²). Only the middle term's sign decides (a + b)² vs (a − b)². A trinomial ending in a negative constant is never a perfect square.`, kind: 'vocab-note' },
    { content: `Write the final answer with the exponent: 4x² − 20x + 25 = (2x − 5)², not (2x − 5)(2x − 5) crossed out or a single (2x − 5). Both factors must appear, and 'completely factored' means you can't factor inside any parenthesis further.`, kind: 'vocab-note' },
    { content: `Ten-second self-check: expand your factors and compare to the original. Difference of squares should have NO middle term (the ±ab cancel); a perfect square should have the middle term back.`, kind: 'tip' },
  ],
};
