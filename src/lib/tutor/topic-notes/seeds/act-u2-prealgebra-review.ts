/**
 * ACT — Unit 2 CED 2.1: Pre-Algebra: Fractions, Percents & Ratios.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.prealgebra-review.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_PREALGEBRA_REVIEW: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.prealgebra-review.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Pre-Algebra: Fractions, Percents & Ratios',
  planId: 'evelyn.testprep.act.prealgebra-review.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.prealgebra-review.v1' }],
  theory: [
    { loId: 'act.prealgebra-review', content: `PERCENT OF: "x is what percent of y" → (x / y) × 100. Always divide by the ORIGINAL whole, not by x.` },
    { loId: 'act.prealgebra-review', content: `PERCENT CHANGE: increasing by p% means multiply by (1 + p/100); decreasing by p% means multiply by (1 − p/100). Never just add or subtract p from 100.` },
    { loId: 'act.prealgebra-review', kind: 'framework', title: 'Trap', content: `TRAP — SEQUENTIAL PERCENTS COMPOUND, NOT ADD: two discounts of 20% and 10% do NOT combine to 30% off. Multiply the "keep" fractions: 0.80 × 0.90 = 0.72, so it is really 28% off.` },
    { loId: 'act.prealgebra-review', kind: 'framework', title: 'Trap', content: `TRAP — INCREASE THEN DECREASE DOES NOT CANCEL: a 20% increase followed by a 20% decrease does not return to the original value, because the second percentage is taken of a different (larger) base.` },
    { loId: 'act.prealgebra-review', content: `FRACTIONS: common denominator to add/subtract; multiply straight across (numerator × numerator, denominator × denominator); divide by multiplying by the reciprocal.` },
    { loId: 'act.prealgebra-review', content: `RATIOS: a:b means a parts to b parts. Total parts = a + b. Find the value of ONE part by dividing a given total by the total parts, then scale up.` },
    { loId: 'act.prealgebra-review', kind: 'framework', title: 'Trap', content: `TRAP — PART-TO-WHOLE vs. PART-TO-PART: a ratio of 3:5 means the first quantity is 3/8 of the whole (not 3/5) — the whole is a + b parts, not just the other term.` },
    { loId: 'act.prealgebra-review', content: `CALCULATOR is allowed throughout ACT Math — use it for the arithmetic, but set up the fraction/percent/ratio relationship on paper first so you calculate the right thing.` },
    { loId: 'act.prealgebra-review', kind: 'definition', title: 'percent change', content: `the multiplier (1 ± p/100) applied to a starting value to reflect an increase or decrease of p percent.` },
    { loId: 'act.prealgebra-review', kind: 'definition', title: 'ratio', content: `a comparison of two quantities by division, written a:b, where the whole is a + b parts.` },
    { loId: 'act.prealgebra-review', kind: 'definition', title: 'part-to-whole', content: `a fraction comparing one part of a ratio to the total of all parts, as opposed to comparing one part to another part.` },
  ],
  methods: [
    {
      title: 'Worked sequential percent',
      steps: [
        'After the 20% markdown: $50 × (1 − 0.20) = $50 × 0.80 = $40.',
        `After the additional 10% off the marked-down price: $40 × (1 − 0.10) = $40 × 0.90 = $36.`,
        `Trap check: the total discount is NOT 20% + 10% = 30%. Compute it from the combined multiplier instead: 0.80 × 0.90 = 0.72, so the customer pays 72% of $50 and the total discount is 28%.`,
        'Sanity-check: $50 × 0.72 = $36, matching the step-by-step result. ✓',
      ],
      example: { problem: `A $50 shirt is marked down 20%. At checkout, an additional 10% off the marked-down price is applied. What is the final price, and what is the total percent discount from $50?`, solution: '$36 (a total discount of 28%, not 30%)' },
      relatedLoIds: ['act.prealgebra-review'],
    },
    {
      title: 'Worked ratio trap',
      steps: [
        'Total parts in the ratio: 4 + 7 = 11.',
        'Value of one part: 33 total ÷ 11 parts = 3 pieces of fruit per part.',
        'Oranges = 7 parts × 3 = 21.',
        `Trap avoided: a student who treats 7:4 as "7/4 of the apple count" or scales 33 by 7/4 gets a non-integer, impossible answer — the ratio numbers describe PARTS OF THE WHOLE (11 parts), not a part-to-part multiplier on the total.`,
        'Sanity-check: apples = 4 × 3 = 12; 12 + 21 = 33. ✓',
      ],
      example: { problem: `A fruit basket contains only apples and oranges in the ratio 4:7. If there are 33 pieces of fruit in the basket, how many are oranges?`, solution: '21 oranges' },
      relatedLoIds: ['act.prealgebra-review'],
    },
  ],
  pointers: [
    { content: `The price does not return to the original value — the percents do not cancel, because the decrease is taken of a DIFFERENT (larger) base. Starting at $100: a 20% increase gives $100 × 1.20 = $120. A 20% decrease from there gives $120 × 0.80 = $96 — not $100. Every percent change must be applied to the CURRENT value, not the original one.`, kind: 'common-error' },
    { content: `Percent change = multiply by (1 ± p/100); sequential percentages compound (multiply the keep-fractions), they never simply add.`, kind: 'tip' },
    { content: `A p% increase followed by a p% decrease does NOT return to the original value — the base changes at each step.`, kind: 'tip' },
    { content: `Ratios describe parts of a whole: for a:b, the whole is a + b parts — find the value of one part, then scale.`, kind: 'tip' },
    { content: `Pre-algebra questions cluster in the easier first third of ACT Math — bank these at well under the 60-second/question pace.`, kind: 'tip' },
    { content: `Read the last line of the question, not the first. "What is the final price?" and "What is the total percent discount?" are different answers ($36 vs. 28%) — and the ACT plants **both** in the choices. Circle the requested unit before computing.`, kind: 'gotcha' },
    { content: `"Percent OF" vs. "percent GREATER THAN": if 30 is 150% *of* 20, it is only 50% *greater than* 20. When the stem says "more than" / "less than" / "increase," you must subtract 100% at the end.`, kind: 'vocab-note' },
    { content: `In percent-change problems, the ORIGINAL is always the denominator — even when the question asks about a decrease. Going 80 → 60 is a 25% decrease (20/80), not 33% (20/60). Ask: which number came first in time?`, kind: 'common-error' },
    { content: `Three-term ratios show up: a:b:c means a+b+c parts. And if two ratios share a term (A:B = 2:3, B:C = 6:5), scale B to match (4:6 and 6:5) before combining into 4:6:5. Don't just chain the numbers.`, kind: 'edge-case' },
    { content: `A ratio problem that gives you ONE quantity (not the total) — "24 daisies, ratio 5:3" — needs 24 ÷ 3 = 8 per part, not 24 ÷ 8. Divide by the part count that matches the quantity you were handed.`, kind: 'common-error' },
    { content: `When no starting number is given ("a price rises 25%, then falls 20% — what is the net change?"), plug in $100. Percent answers are independent of the starting value, so the easiest number is legal.`, kind: 'tip' },
    { content: `Working backward from a sale price? DIVIDE, don't add the percent back. If $36 is after 28% off, the original is 36 ÷ 0.72 = $50 — not 36 × 1.28 = $46.08. The ACT always lists that wrong product.`, kind: 'gotcha' },
    { content: `Fraction answer choices are usually fully reduced with rationalized-looking forms — if your answer is 6/8 and you see 3/4, it's the same answer. Reduce before you scan, or you'll waste time thinking you erred.`, kind: 'tip' },
  ],
};
