/**
 * Grade 7 Math — Percent & Applications: Tax, Tip, Discount & Markup.
 *
 * Percent change applied to real prices (CCSS 7.RP.A.3, 7.EE.B.3). The real
 * skill is the ONE-STEP MULTIPLIER: a 20% discount is × 0.80, an 8% tax is
 * × 1.08. The traps this plan is built to kill are stopping at the discount
 * amount and calling it the sale price, and adding or subtracting percents
 * across a two-step problem instead of multiplying twice.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U4_TAX_TIP_DISCOUNT_MARKUP: LessonPlan = {
  id: 'evelyn.ms.m7math.tax-tip-discount-markup.v1',
  title: 'Tax, Tip, Discount & Markup',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.tax-tip-discount-markup',
      standard: 'M7MATH-4.3',
      description:
        'Solve multistep price problems involving sales tax, tips, discounts and markups, using a single multiplier for each step (CCSS 7.RP.A.3, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.percent-increase-decrease'],
  followUps: ['m7math.simple-interest-and-percent-error'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame tax, tip, discount and markup as four names for one move.',
      script:
        'You finally find the sneakers. The tag says 45 dollars. The sign above the rack says 25 percent off, so the price drops. You get to the register and the number goes back UP, because tax gets added. Then at dinner your family leaves a tip, and that number goes up again. Tax, tip, discount, markup — four different words, four different signs in the store, but underneath they are all the exact same move you already know: take a percent of a price, then add it on or take it off. Today we learn to do that whole move in ONE multiplication.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-price-multipliers',
      kind: 'concept',
      goal: 'Build the one-step multiplier for adding and removing a percent, and the rule for two-step problems.',
      keyIdeas: [
        'FOUR WORDS, ONE MOVE — a sales TAX and a TIP get added to the price. A MARKUP is what a store adds on top of what an item cost them, so it gets added too. A DISCOUNT gets taken off. Every one of them is a percent OF the price, and then a plus or a minus. Once you know which direction it goes, the arithmetic is identical.',
        'THE ONE-STEP MULTIPLIER — the price is 100% of itself. Adding 8% tax leaves you paying 108% of the price, so multiply by 1.08. Taking 20% off leaves you paying 80% of the price, so multiply by 0.80. Adding uses 1 PLUS the rate, and taking off uses 1 MINUS the rate. One multiplication, done.',
        'DO NOT STOP HALFWAY — 20% of 45 dollars is 9 dollars, but 9 dollars is the DISCOUNT, not the sale price. The sale price is what is left: 45 minus 9 = 36, which is exactly what 45 times 0.80 gives you. Read the question and check which one it actually asked for. The same trap catches tips: the tip is one number and the total bill is another.',
        'TWO STEPS MEAN TWO MULTIPLICATIONS — a jacket 25% off and then 8% tax is 0.75 first, then 1.08 on the result. Each multiplier acts on the price that exists at that moment. Never combine them by adding or subtracting the percents. Taking 25% off and then adding 8% is NOT the same as taking 17% off, and it never will be.',
        'ORDER DOES NOT CHANGE THE TOTAL — because you are multiplying, doing 0.75 first and 1.08 second gives the same answer as 1.08 first and 0.75 second. Both come to 0.81 times the original price. That is a nice thing to know, but it is only true when you MULTIPLY at each step. It falls apart the moment somebody adds percents together.',
        'MONEY GETS ROUNDED AT THE END — carry the full decimal through your multiplications and round to the nearest cent only once, in the final answer. And always sanity-check the direction: after a discount the price must be lower, and after tax or a tip it must be higher.',
      ],
      vocabulary: [
        { term: 'sales tax', definition: 'a percent of the price added on at the register.' },
        { term: 'tip', definition: 'a percent of the bill added on for service, also called a gratuity.' },
        { term: 'discount', definition: 'a percent of the price taken off, leaving the sale price.' },
        { term: 'markup', definition: 'a percent a store adds on top of what an item cost them, to set the selling price.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-one-step-discount',
      kind: 'worked_example',
      problem: 'A $45 pair of shoes is 25% off. What is the sale price?',
      steps: [
        'Decide the direction. A discount comes OFF, so the multiplier is 1 minus the rate.',
        'Convert and subtract: 25% is 0.25, and 1 minus 0.25 = 0.75. You will pay 75% of the tag price.',
        'Multiply once: 45 times 0.75 = 33.75. The sale price is 33 dollars and 75 cents.',
        'Check the long way. 25% of 45 is 0.25 times 45 = 11.25, which is the discount. Then 45 minus 11.25 = 33.75. Same answer, more steps.',
        'Direction check: 33.75 is lower than 45, which is what a discount should do.',
      ],
      answer: '$33.75',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-discount-then-tax',
      kind: 'worked_example',
      problem: 'A $60 jacket is 25% off. Then 8% sales tax is added to the sale price. What do you pay?',
      steps: [
        'Step one, the discount. The multiplier is 1 minus 0.25 = 0.75. So 60 times 0.75 = 45. The sale price is 45 dollars.',
        'Check that piece: 25% of 60 is 15, and 60 minus 15 = 45. It matches.',
        'Step two, the tax. Tax is charged on what you are actually paying, which is the 45 dollar sale price, not the old 60 dollar tag. The multiplier is 1 plus 0.08 = 1.08.',
        'Multiply: 45 times 1.08 = 48.60. You pay 48 dollars and 60 cents.',
        'Check that piece too: 8% of 45 is 3.60, and 45 plus 3.60 = 48.60. It matches.',
        'WRONG answer to avoid: combining the percents into 25% minus 8% = 17% off and computing 60 times 0.83 = 49.80. Percents from different steps cannot be added or subtracted. RIGHT answer: 48.60, from multiplying twice.',
      ],
      answer: '$48.60',
      estimatedMinutes: 3,
    },
    {
      id: 'try-tip-total-mcq',
      kind: 'try_yourself',
      problem: 'A pizza bill comes to $30 and you leave a 20% tip. What is the total you pay?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$6' },
        { id: 'b', text: '$24' },
        { id: 'c', text: '$36', correct: true },
        { id: 'd', text: '$50' },
      ],
      expectedAnswer: '$36',
      hints: [
        'A tip gets ADDED, so the multiplier is 1 plus the rate.',
        'The question asks for the TOTAL, not just the tip. Multiply 30 by 1.20, or find 20% of 30 and then add it to 30.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-multiplier-mcq',
      kind: 'try_yourself',
      problem: 'A store takes 35% off everything. Which single multiplier turns the tag price into the sale price in one step?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Multiply by 0.35' },
        { id: 'b', text: 'Multiply by 0.65', correct: true },
        { id: 'c', text: 'Multiply by 1.35' },
        { id: 'd', text: 'Multiply by 3.5' },
      ],
      expectedAnswer: 'Multiply by 0.65',
      hints: [
        'The tag price counts as 100%. If 35% comes off, what percent of the tag price do you still have to pay?',
        '100% minus 35% is 65%, and 65% as a decimal is 0.65. Test your pick on a 100 dollar tag — the sale price should land below 100.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-two-step',
      kind: 'try_yourself',
      problem: 'A $50 hoodie is 30% off, and then 6% sales tax is added to the sale price. How many dollars do you pay in total? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '37.10',
      hints: [
        'Do the discount first: multiply 50 by 1 minus 0.30.',
        'Then charge tax on THAT sale price, not on the original 50: multiply your result by 1.06. Round to the nearest cent at the end.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-discount-vs-sale-price',
      kind: 'misconception_check',
      question: 'A $40 shirt is 25% off. A student says the sale price is $10. What went wrong?',
      commonErrors: [
        {
          answer: '$10',
          misconception: 'Stopping at the discount amount. The student computed 25% of 40 correctly but reported the money SAVED as if it were the money PAID.',
          correctsTo: 'The 10 dollars is the discount, not the price. The sale price is what is left over: 40 minus 10 = 30 dollars. The one-step version says the same thing, because 1 minus 0.25 = 0.75 and 40 times 0.75 = 30. A useful check: paying only 10 dollars would be 75% off, and the sign said 25% off, so the answer had to be much closer to 40 than to 0.',
        },
        {
          answer: '$50',
          misconception: 'Using the ADD multiplier on a discount — computing 40 times 1.25 as if 25% were being tacked on, which is what a markup does.',
          correctsTo: 'A discount takes money OFF, so the multiplier must be 1 MINUS the rate: 0.75, giving 40 times 0.75 = 30 dollars. The multiplier 1.25 is the one you would use for a 25% markup or a 25% tip, and it makes the price go up. Always check the direction: after a discount the price has to be lower than it started.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tax, tip and markup get ADDED; a discount gets taken OFF. Everything else about them is the same move.',
        'Use one multiplier per step: 8% tax is × 1.08, a 20% discount is × 0.80. Add uses 1 plus the rate, take-off uses 1 minus the rate.',
        'The discount amount is not the sale price. 20% of 45 is 9, but the sale price is 45 − 9 = 36.',
        'In a two-step problem multiply twice, applying tax to the SALE price: 60 × 0.75 = 45, then 45 × 1.08 = 48.60.',
        'Never add or subtract percents from different steps — 25% off then 8% tax is not 17% off.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Tax, Tip, Discount & Markup' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
