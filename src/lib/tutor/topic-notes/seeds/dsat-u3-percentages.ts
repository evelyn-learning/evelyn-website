/**
 * Digital SAT — Unit 3 CED 3.2: Percentages.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.percentages.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U3_PERCENTAGES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.percentages.v1',
  course: 'Digital SAT',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Percentages',
  planId: 'evelyn.testprep.dsat.percentages.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.percentages.v1' }],
  theory: [
    { loId: 'dsat.percentages', content: 'PERCENT OF: "p% of x" = (p/100) × x. 15% of $400 = 0.15 × 400 = $60.' },
    { loId: 'dsat.percentages', content: `PERCENT CHANGE FORMULA: (new − old) / old × 100. Always divide by the ORIGINAL value — dividing by the new value instead is the single most common percent mistake on the test.` },
    { loId: 'dsat.percentages', content: `INCREASE BY p%: multiply the original by (1 + p/100). DECREASE BY p%: multiply by (1 − p/100). A 20% discount is × 0.80, not "subtract 20 from the price."` },
    { loId: 'dsat.percentages', kind: 'framework', title: 'Trap', content: `TRAP — PERCENT-CHANGE CHAINS. Sequential changes MULTIPLY their multipliers; they do NOT add. A 10% increase then a 10% decrease is × 1.10 × 0.90 = × 0.99 — a 1% net DECREASE, not 0%.` },
    { loId: 'dsat.percentages', kind: 'framework', title: 'Trap', content: `TRAP — REVERSE PERCENTAGE. When the question gives the value AFTER a change and asks for the value BEFORE it, divide by the multiplier — never subtract the percent from the final value. "After a 20% discount the price is $48" means original × 0.80 = 48, so original = 48 / 0.80 = $60 (NOT 48 + 0.20 × 48).` },
    { loId: 'dsat.percentages', content: `PERCENT vs PERCENTAGE POINTS — when a rate itself changes (e.g., an interest rate goes from 4% to 6%), "increased by 2 percentage points" is NOT the same as "increased by 2%" (which would be 4% × 1.02 ≈ 4.08%). Read which one the question asks for.` },
    { loId: 'dsat.percentages', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — the calculator is available on every math question. For a multi-step chain, type the multiplier chain directly (e.g., 60*1.25*0.8) instead of computing each step by hand.` },
    { loId: 'dsat.percentages', kind: 'definition', title: 'percent change', content: '(new − old) / old × 100; always computed relative to the ORIGINAL value.' },
    { loId: 'dsat.percentages', kind: 'definition', title: 'multiplier', content: `the single factor (1 ± p/100) that applies a percent change in one multiplication.` },
    { loId: 'dsat.percentages', kind: 'definition', title: 'percentage point', content: `a unit for the raw difference between two percentages, distinct from a percent change of one relative to the other.` },
  ],
  methods: [
    {
      title: 'Worked chain',
      steps: [
        'First change: +25% → multiply by 1.25. New price = 60 × 1.25 = $75.',
        'Second change: −20% → multiply by 0.80. Final price = 75 × 0.80 = $60.',
        `Check by multiplying the multipliers directly: 1.25 × 0.80 = 1.00 — the two changes exactly cancel, so the final price equals the ORIGINAL $60. A 25% increase paired with a 20% decrease is a classic "looks like it should cancel" pair — verify by multiplying, never assume opposite percents cancel.`,
      ],
      example: { problem: `A store raises the price of a $60 item by 25%, then marks it down 20% for a clearance sale. What is the final price?`, solution: '$60' },
      relatedLoIds: ['dsat.percentages'],
    },
    {
      title: 'Worked reverse',
      steps: [
        'The $48 is the price AFTER a 20% discount, so original × 0.80 = 48.',
        'Divide both sides by 0.80: original = 48 / 0.80 = $60.',
        `Check: $60 × 0.80 = $48. ✓ A common wrong move is computing 48 + 0.20 × 48 = $57.60 — that mistakenly applies the 20% to the SALE price instead of undoing it from the original.`,
      ],
      example: { problem: `After a 20% discount, a jacket's sale price is $48. What was the original price?`, solution: '$60' },
      relatedLoIds: ['dsat.percentages'],
    },
  ],
  pointers: [
    { content: `Multiply the multipliers instead: 1.50 × 0.50 = 0.75. The final price is 75% of the original — a 25% DECREASE, not 0%. Opposite percents only cancel when you're comparing the SAME multiplier applied and undone (e.g., ×1.20 then ÷1.20), never when both steps use the raw percent.`, kind: 'common-error' },
    { content: `Percent change = (new − old) / old × 100 — always divide by the ORIGINAL value, never the new one.`, kind: 'tip' },
    { content: `Increase by p%: multiply by (1 + p/100). Decrease by p%: multiply by (1 − p/100).`, kind: 'tip' },
    { content: `Chained percent changes MULTIPLY their multipliers — they never add. +10% then +10% is ×1.21 (a 21% increase), not 20%.`, kind: 'tip' },
    { content: `Reverse percentage: given the value AFTER a change, divide by the multiplier to recover the value BEFORE it — never just subtract the percent from the final value.`, kind: 'tip' },
    { content: `"What percent of" vs "percent greater than": *A is what percent of B* → A/B × 100. *A is what percent greater than B* → (A−B)/B × 100. If A = 150 and B = 100, the answers are 150 and 50 — both appear as choices. Reread the stem before picking.`, kind: 'gotcha' },
    { content: `Percent answers often need one more step: after finding the multiplier, the question may ask for the *percent change*, not the final value. ×0.99 means answer "1% decrease" — not 0.99, not 99%. Convert the multiplier: subtract 1, then read the sign.`, kind: 'common-error' },
    { content: `In reverse-percentage word problems, spot the direction word: "after a discount / after tax / after an increase" means the given number is the NEW value — divide. "The price before shipping is $48" means it's the OLD value — multiply. Label old vs new before touching the calculator.`, kind: 'tip' },
    { content: `"Increased by 3 percentage points" vs "increased by 3%" also shows up backward: a rate falling from 8% to 6% is a drop of **2 percentage points** but a **25% decrease**. Both numbers will be in the choices — check which unit the question names.`, kind: 'vocab-note' },
    { content: `Order doesn't matter in a chain — ×1.25×0.80 = ×0.80×1.25 — so don't waste time re-reading which change came first when only the FINAL value is asked. It only matters if the question asks for an intermediate price.`, kind: 'edge-case' },
    { content: `A percent change with an answer over 100% is legitimate: going from 20 to 70 is (70−20)/20 = 250% increase, not 71%. Don't reject a big answer as "too large" — only percent DECREASES are capped at 100%.`, kind: 'edge-case' },
    { content: `In Desmos, type the whole chain on one line (\`200*1.3*0.7\`) rather than rounding at each step. Rounding an intermediate dollar amount to the cent then continuing can push you off the exact grid-in answer.`, kind: 'tip' },
    { content: `When percents are unknowns ("x% of 40 is 10"), translate word-for-word: *of* = ×, *is* = =, so (x/100)(40) = 10. Don't guess-and-check — set the equation and solve, especially when the answer is a variable expression.`, kind: 'common-error' },
  ],
};
