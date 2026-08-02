/**
 * Algebra 1 — Unit 2 CED 2.4: Proportions & Percent Problems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.proportions-percents.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U2_PROPORTIONS_PERCENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.proportions-percents.v1',
  course: 'Algebra 1',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Proportions & Percent Problems',
  planId: 'evelyn.hs.alg1.proportions-percents.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.proportions-percents.v1' }],
  theory: [
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'A proportion is two equal ratios', content: `A PROPORTION IS TWO EQUAL RATIOS — a/b = c/d. Build it so matching units sit in matching positions: miles over hours on the left means miles over hours on the right, never miles over hours equals hours over miles.` },
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'Cross-multiply', content: `CROSS-MULTIPLY — a/b = c/d becomes ad = bc. This is legal because you multiplied both sides by bd; it just converts a fraction equation into the linear equation you already know how to solve.` },
    { loId: 'alg1.proportions-percents', content: `LABEL EVERY NUMBER when you set up. If the two sides of your proportion do not describe the same unit in the same slot, the equation is wrong before you do any arithmetic.` },
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'Percent of', content: `PERCENT OF — "what is p% of n" translates to (p/100) × n. "x is what percent of y" translates to (x/y) × 100. The whole y always goes in the denominator.` },
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'Percent proportion', content: `PERCENT PROPORTION — part/whole = percent/100 handles all three question types at once: cross-multiply and solve for whichever piece is missing.` },
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'Percent change', content: `PERCENT CHANGE — increasing by p% means multiplying by (1 + p/100); decreasing by p% means multiplying by (1 − p/100). Percent change itself is (new − old)/old × 100.` },
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'Error', content: `ERROR — WRONG BASE: percent change divides by the ORIGINAL value, not the new one. Dropping from 45 to 36 is a 9/45 = 20% decrease, not 9/36 = 25%.` },
    { loId: 'alg1.proportions-percents', kind: 'framework', title: 'Error', content: `ERROR — WORKING BACKWARDS BY ADDING: if a 15% discount left a price of $68, the original is NOT 68 + 15% of 68. Write 0.85p = 68 and solve for p — the percent was taken of the unknown original, so the unknown belongs in the equation.` },
    { loId: 'alg1.proportions-percents', kind: 'definition', title: 'proportion', content: 'an equation stating that two ratios are equal, a/b = c/d.' },
    { loId: 'alg1.proportions-percents', kind: 'definition', title: 'unit rate', content: `a ratio written with a denominator of 1, such as dollars per ounce or miles per hour.` },
    { loId: 'alg1.proportions-percents', kind: 'definition', title: 'percent change', content: 'the change divided by the original amount, expressed as a percent.' },
  ],
  methods: [
    {
      title: 'Worked proportion',
      steps: [
        'Set up matching units — ounces over dollars on both sides: 12/2.40 = 20/x.',
        'Cross-multiply: 12x = 2.40 × 20, so 12x = 48.',
        'Divide by 12: x = 4, so the 20-ounce bottle costs $4.00.',
        `Check with the unit rate: $2.40 ÷ 12 oz = $0.20 per ounce, and 20 × $0.20 = $4.00. ✓`,
      ],
      example: { problem: `A 12-ounce bottle of juice costs $2.40. At the same price per ounce, what does a 20-ounce bottle cost?`, solution: '$4.00' },
      relatedLoIds: ['alg1.proportions-percents'],
    },
    {
      title: 'Worked reverse percent',
      steps: [
        `Name the unknown: let p be the original price. The discount was taken of p, so p is what belongs inside the percent.`,
        'A 15% discount means the shopper pays 85% of the original: 0.85p = 68.',
        'Divide both sides by 0.85: p = 68 ÷ 0.85 = 80. The original price was $80.',
        `The trap: adding 15% back to $68 gives 68 × 1.15 = $78.20, which is wrong because that takes 15% of the SALE price instead of the original.`,
        'Check: 15% of $80 is $12, and $80 − $12 = $68. ✓',
      ],
      example: { problem: 'After a 15% discount, a jacket costs $68. What was the original price?', solution: 'p = $80' },
      relatedLoIds: ['alg1.proportions-percents'],
    },
  ],
  pointers: [
    { content: `The price does not return to the original value — the percents do not cancel, because the second percent is taken of a bigger base. Start at $100: the increase gives 100 × 1.20 = $120, then the decrease gives 120 × 0.80 = $96 — a 4% net loss, not a return to $100. Combine percent changes by multiplying the factors: 1.20 × 0.80 = 0.96.`, kind: 'common-error' },
    { content: `A proportion is a/b = c/d with matching units in matching slots; cross-multiply to ad = bc, then solve as usual.`, kind: 'tip' },
    { content: `Percent proportion: part/whole = percent/100 covers percent of, percent is, and find-the-whole.`, kind: 'tip' },
    { content: 'Percent change divides by the ORIGINAL value: (new − old)/old × 100.', kind: 'tip' },
    { content: `To undo a percent change, put the unknown in the equation: a 15% discount to $68 is 0.85p = 68, not 68 + 15% of 68.`, kind: 'tip' },
    { content: `Percent changes multiply, they do not add: 1.20 × 0.80 = 0.96, so up 20% then down 20% loses 4%.`, kind: 'tip' },
    { content: `Percent change always divides by the ORIGINAL value. $45 → $36 is 9/45 = 20% decrease, not 9/36 = 25%. Circle the "before" number before you divide.`, kind: 'common-error' },
    { content: `To undo a percent change, put the unknown in the equation: 15% off to $68 is **0.85p = 68**, not 68 × 1.15. The percent was taken of the original, so the original must be the thing multiplied.`, kind: 'gotcha' },
    { content: `Percent changes multiply, they never add. Up 20% then down 20% is 1.20 × 0.80 = 0.96 — a 4% net loss, not a return to the start. Same for two discounts: 30% then 10% off is 0.70 × 0.90 = 0.63, not 60% off.`, kind: 'common-error' },
    { content: `Keep matching units in matching slots: oz/$ = oz/$ works, oz/$ = $/oz does not. Label every number with its unit as you write the proportion, then check the two denominators name the same quantity.`, kind: 'tip' },
    { content: `When cross-multiplying with a binomial numerator, multiply the WHOLE numerator: (x+2)/6 = 5/3 gives 3(x+2) = 30, so distribute or divide first. Writing 3x + 2 = 30 drops the parentheses and the answer.`, kind: 'common-error' },
    { content: `In "x is what percent of y," the number after "of" is the WHOLE and goes in the denominator. In part/whole = percent/100, the percent side never gets a % sign written — 20% is entered as the 20 in 20/100.`, kind: 'vocab-note' },
    { content: `"Percent change" ≠ "percent of the original." After a 15% discount you pay 85% of the original; the change is 15%, the multiplier is 0.85. State which number you're reporting before you answer.`, kind: 'vocab-note' },
    { content: `A percent decrease can never exceed 100% (you'd end below zero), but a percent increase can — going from 20 to 60 is a 200% increase, not 300%. Compute (new − old)/old, not new/old.`, kind: 'edge-case' },
  ],
};
