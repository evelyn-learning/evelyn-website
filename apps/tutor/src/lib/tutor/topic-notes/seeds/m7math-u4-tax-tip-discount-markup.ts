/**
 * Grade 7 Math — Unit 4 CED 4.3: Tax, Tip, Discount & Markup.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.tax-tip-discount-markup.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U4_TAX_TIP_DISCOUNT_MARKUP: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.tax-tip-discount-markup.v1',
  course: 'Grade 7 Math',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Tax, Tip, Discount & Markup',
  planId: 'evelyn.ms.m7math.tax-tip-discount-markup.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.tax-tip-discount-markup.v1' }],
  theory: [
    { loId: 'm7math.tax-tip-discount-markup', kind: 'framework', title: 'Four words, one move', content: `FOUR WORDS, ONE MOVE — a sales TAX and a TIP get added to the price. A MARKUP is what a store adds on top of what an item cost them, so it gets added too. A DISCOUNT gets taken off. Every one of them is a percent OF the price, and then a plus or a minus. Once you know which direction it goes, the arithmetic is identical.` },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'framework', title: 'The one-step multiplier', content: `THE ONE-STEP MULTIPLIER — the price is 100% of itself. Adding 8% tax leaves you paying 108% of the price, so multiply by 1.08. Taking 20% off leaves you paying 80% of the price, so multiply by 0.80. Adding uses 1 PLUS the rate, and taking off uses 1 MINUS the rate. One multiplication, done.` },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'framework', title: 'Do not stop halfway', content: `DO NOT STOP HALFWAY — 20% of 45 dollars is 9 dollars, but 9 dollars is the DISCOUNT, not the sale price. The sale price is what is left: 45 minus 9 = 36, which is exactly what 45 times 0.80 gives you. Read the question and check which one it actually asked for. The same trap catches tips: the tip is one number and the total bill is another.` },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'framework', title: 'Two steps mean two multiplications', content: `TWO STEPS MEAN TWO MULTIPLICATIONS — a jacket 25% off and then 8% tax is 0.75 first, then 1.08 on the result. Each multiplier acts on the price that exists at that moment. Never combine them by adding or subtracting the percents. Taking 25% off and then adding 8% is NOT the same as taking 17% off, and it never will be.` },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'framework', title: 'Order does not change the total', content: `ORDER DOES NOT CHANGE THE TOTAL — because you are multiplying, doing 0.75 first and 1.08 second gives the same answer as 1.08 first and 0.75 second. Both come to 0.81 times the original price. That is a nice thing to know, but it is only true when you MULTIPLY at each step. It falls apart the moment somebody adds percents together.` },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'framework', title: 'Money gets rounded at the end', content: `MONEY GETS ROUNDED AT THE END — carry the full decimal through your multiplications and round to the nearest cent only once, in the final answer. And always sanity-check the direction: after a discount the price must be lower, and after tax or a tip it must be higher.` },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'definition', title: 'sales tax', content: 'a percent of the price added on at the register.' },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'definition', title: 'tip', content: 'a percent of the bill added on for service, also called a gratuity.' },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'definition', title: 'discount', content: 'a percent of the price taken off, leaving the sale price.' },
    { loId: 'm7math.tax-tip-discount-markup', kind: 'definition', title: 'markup', content: `a percent a store adds on top of what an item cost them, to set the selling price.` },
  ],
  methods: [
    {
      title: 'Worked one step discount',
      steps: [
        `Decide the direction. A discount comes OFF, so the multiplier is 1 minus the rate.`,
        `Convert and subtract: 25% is 0.25, and 1 minus 0.25 = 0.75. You will pay 75% of the tag price.`,
        'Multiply once: 45 times 0.75 = 33.75. The sale price is 33 dollars and 75 cents.',
        `Check the long way. 25% of 45 is 0.25 times 45 = 11.25, which is the discount. Then 45 minus 11.25 = 33.75. Same answer, more steps.`,
        'Direction check: 33.75 is lower than 45, which is what a discount should do.',
      ],
      example: { problem: 'A $45 pair of shoes is 25% off. What is the sale price?', solution: '$33.75' },
      relatedLoIds: ['m7math.tax-tip-discount-markup'],
    },
    {
      title: 'Worked discount then tax',
      steps: [
        `Step one, the discount. The multiplier is 1 minus 0.25 = 0.75. So 60 times 0.75 = 45. The sale price is 45 dollars.`,
        'Check that piece: 25% of 60 is 15, and 60 minus 15 = 45. It matches.',
        `Step two, the tax. Tax is charged on what you are actually paying, which is the 45 dollar sale price, not the old 60 dollar tag. The multiplier is 1 plus 0.08 = 1.08.`,
        'Multiply: 45 times 1.08 = 48.60. You pay 48 dollars and 60 cents.',
        'Check that piece too: 8% of 45 is 3.60, and 45 plus 3.60 = 48.60. It matches.',
        `WRONG answer to avoid: combining the percents into 25% minus 8% = 17% off and computing 60 times 0.83 = 49.80. Percents from different steps cannot be added or subtracted. RIGHT answer: 48.60, from multiplying twice.`,
      ],
      example: { problem: `A $60 jacket is 25% off. Then 8% sales tax is added to the sale price. What do you pay?`, solution: '$48.60' },
      relatedLoIds: ['m7math.tax-tip-discount-markup'],
    },
  ],
  pointers: [
    { content: `Students often say "$10" — The 10 dollars is the discount, not the price. The sale price is what is left over: 40 minus 10 = 30 dollars. The one-step version says the same thing, because 1 minus 0.25 = 0.75 and 40 times 0.75 = 30. A useful check: paying only 10 dollars would be 75% off, and the sign said 25% off, so the answer had to be much closer to 40 than to 0.`, kind: 'common-error' },
    { content: `Students often say "$50" — A discount takes money OFF, so the multiplier must be 1 MINUS the rate: 0.75, giving 40 times 0.75 = 30 dollars. The multiplier 1.25 is the one you would use for a 25% markup or a 25% tip, and it makes the price go up. Always check the direction: after a discount the price has to be lower than it started.`, kind: 'common-error' },
    { content: `Tax, tip and markup get ADDED; a discount gets taken OFF. Everything else about them is the same move.`, kind: 'tip' },
    { content: `Use one multiplier per step: 8% tax is × 1.08, a 20% discount is × 0.80. Add uses 1 plus the rate, take-off uses 1 minus the rate.`, kind: 'tip' },
    { content: `The discount amount is not the sale price. 20% of 45 is 9, but the sale price is 45 − 9 = 36.`, kind: 'tip' },
    { content: `In a two-step problem multiply twice, applying tax to the SALE price: 60 × 0.75 = 45, then 45 × 1.08 = 48.60.`, kind: 'tip' },
    { content: `Never add or subtract percents from different steps — 25% off then 8% tax is not 17% off.`, kind: 'tip' },
    { content: `Read the question twice: does it ask for the *tip/discount amount* or the *total/sale price*? "20% of $45 = $9" answers a different question than "what do you pay?" ($36). Circle the word the question asks for before you multiply.`, kind: 'common-error' },
    { content: `Never turn "25% off then 8% tax" into "17% off." Percents from different steps can't be added or subtracted. Multiply twice: × 0.75, then × 1.08. (60 × 0.83 = 49.80 is wrong; the answer is 48.60.)`, kind: 'gotcha' },
    { content: `Watch the 1 **+** vs 1 **−**. Tax, tip and markup go UP (1.08, 1.20, 1.25). A discount goes DOWN (0.75, 0.80). Using 1.25 on a 25%-off shirt turns $40 into $50 — a price that went the wrong way.`, kind: 'common-error' },
    { content: `Tax is charged on the price you actually pay, so apply it to the SALE price, not the original tag. In the $60 jacket problem, tax hits the $45, not the $60.`, kind: 'gotcha' },
    { content: `Don't mix up **markup** and **tax**. A markup is what the STORE adds to its own cost to set the selling price; tax is added at the register by law. Both use 1 + rate, but they act on different starting prices.`, kind: 'vocab-note' },
    { content: `Round to the nearest cent only at the very END. If you round $37.0996 to $37.10 mid-problem and keep multiplying, your final answer drifts. Carry all the decimals through every step.`, kind: 'tip' },
    { content: `Finish with a direction check: after a discount the price must be LOWER than you started; after tax, a tip or a markup it must be HIGHER. If $40 with 25% off gives $10, that's 75% off — way too cheap.`, kind: 'tip' },
    { content: `Order doesn't matter *only because you're multiplying*: 0.75 then 1.08 equals 1.08 then 0.75 (both are × 0.81). The moment someone adds or subtracts percents instead, that shortcut breaks.`, kind: 'edge-case' },
  ],
};
