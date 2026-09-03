/**
 * Grade 6 Math — Unit 1 CED 1.4: Unit Rates & Unit Pricing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.unit-rates-and-unit-pricing.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U1_UNIT_RATES_AND_UNIT_PRICING: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.unit-rates-and-unit-pricing.v1',
  course: 'Grade 6 Math',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Unit Rates & Unit Pricing',
  planId: 'evelyn.ms.m6math.unit-rates-and-unit-pricing.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.unit-rates-and-unit-pricing.v1' }],
  theory: [
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'framework', title: 'A unit rate is the per-one version of a ratio', content: `A UNIT RATE IS THE PER-ONE VERSION OF A RATIO — for a ratio a:b, the unit rate is a divided by b, written a/b. It tells you the amount of the first quantity that matches exactly ONE of the second quantity. If a car uses 2 gallons of gas to go 60 miles, the ratio is 60:2, and the unit rate is 60 divided by 2, which is 30 miles for ONE gallon.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'framework', title: 'The word per names a unit rate, and tells you the order', content: `THE WORD PER NAMES A UNIT RATE, AND TELLS YOU THE ORDER — miles per gallon, price per pouch, and pages per hour are all unit rates. The word before per is what you are dividing, and the word after per is what you are dividing by. Price per pouch means dollars divided by pouches. Read the per phrase before you touch a division sign.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'framework', title: 'Unit price is a unit rate about money', content: `UNIT PRICE IS A UNIT RATE ABOUT MONEY — when the first quantity is money, the unit rate is called the unit price: the cost of exactly ONE item. It is found the same way as any other unit rate, total price divided by number of items.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'framework', title: 'The second number can never be zero', content: `THE SECOND NUMBER CAN NEVER BE ZERO — a unit rate a/b only makes sense when b is not zero, because dividing by zero has no answer. Every ratio you turn into a unit rate needs a second term that is a real, nonzero amount.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'framework', title: 'Unit rates make offers comparable', content: `UNIT RATES MAKE OFFERS COMPARABLE — two totals cannot be compared directly when they buy different amounts, such as $2.40 for 3 notebooks against $3.50 for 5 notebooks. Turning each into a price for ONE notebook puts both offers on the same footing, and the smaller unit price is the better deal, even if its total price is higher.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'framework', title: 'Check by multiplying back', content: `CHECK BY MULTIPLYING BACK — once you divide to find a unit rate, multiply that unit rate by b. If the result matches a, the division was done correctly. This one check catches almost every mistake in this lesson.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'definition', title: 'unit rate', content: `for a ratio a:b, the number a/b, found by dividing a by b; it is the amount of the first quantity that matches exactly ONE of the second quantity.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'definition', title: 'unit price', content: `a unit rate where the first quantity is money: the cost of exactly one item, found by dividing total price by number of items.` },
    { loId: 'm6math.unit-rates-and-unit-pricing', kind: 'definition', title: 'per', content: `the word that names a unit rate, such as miles per gallon or dollars per pouch; it tells you which quantity is divided by which.` },
  ],
  methods: [
    {
      title: 'Worked price per marker',
      steps: [
        `Read the per phrase first: price PER MARKER. That means dollars divided by markers, so the ratio is $6.00 to 4 markers, written 6.00:4.`,
        'Write the division that matches those words: 6.00 divided by 4.',
        `Split $6.00 into 4 equal shares. Four shares of $1.50 make 4 times 1.50, which is 6.00, so each share is $1.50.`,
        `Say the answer with its unit attached: $1.50 per marker. The unit is not decoration. It is how you know you divided in the right order.`,
        `Check by multiplying back: 1.50 times 4 is 6.00, which is exactly the price on the pack. The check matches, so the answer holds.`,
      ],
      example: { problem: 'A 4-pack of markers costs $6.00. What is the price per marker?', solution: '$1.50 per marker' },
      relatedLoIds: ['m6math.unit-rates-and-unit-pricing'],
    },
    {
      title: 'Worked compare two offers',
      steps: [
        `The two totals cannot be compared yet, because the bags hold different numbers of ounces. Put both on a per-one footing first by finding the price per ounce for each.`,
        `Bag A: price per ounce means dollars divided by ounces, so 3.50 divided by 5 is 0.70. Check it: 0.70 times 5 is 3.50, which matches.`,
        'Bag B: 5.20 divided by 8 is 0.65. Check it: 0.65 times 8 is 5.20, which matches.',
        `Now the comparison is fair, because both numbers answer the same question: what does ONE ounce cost. 0.65 is less than 0.70, so Bag B is cheaper by 5 cents on every single ounce.`,
        `WRONG answer to avoid: Bag A is the better deal because $3.50 is less than $5.20. That compares TOTALS, and the totals buy different amounts of pretzels. CORRECT answer: Bag B, at $0.65 per ounce.`,
      ],
      example: { problem: `A store sells pretzels two ways: Bag A has 5 ounces for $3.50, and Bag B has 8 ounces for $5.20. Which bag is the better deal?`, solution: 'Bag B, at $0.65 per ounce' },
      relatedLoIds: ['m6math.unit-rates-and-unit-pricing'],
    },
  ],
  pointers: [
    { content: `Students often say "$1.25 per pouch" — Price per pouch means dollars divided by pouches, so the division is 4.00 divided by 5, not 5 divided by 4.00. That gives $0.80 per pouch. Check it by multiplying back: 0.80 times 5 is 4.00, which matches the price on the pack. The number 1.25 is real, but it answers a different question, how many pouches per dollar.`, kind: 'common-error' },
    { content: `Students often say "Pack A, because $2.40 is less than $3.50" — Totals only compare fairly when the quantities match, and here they do not: Pack A has 3 notebooks and Pack B has 5. Turn each into a price for ONE notebook first: 2.40 divided by 3 is $0.80 per notebook, and 3.50 divided by 5 is $0.70 per notebook. Pack B is cheaper on every single notebook, even though its total price is higher.`, kind: 'common-error' },
    { content: `For a ratio a:b, the unit rate is a divided by b, the amount that matches exactly ONE of the second quantity.`, kind: 'tip' },
    { content: `The word per names a unit rate and tells you which number divides which: price per pouch means dollars divided by pouches.`, kind: 'tip' },
    { content: 'Unit price is a unit rate about money: the cost of exactly ONE item.', kind: 'tip' },
    { content: `The second number in a unit rate can never be zero, because dividing by zero has no answer.`, kind: 'tip' },
    { content: `To compare two offers, turn each into a unit price and pick the smaller number, not the smaller total.`, kind: 'tip' },
    { content: `Check every unit rate by multiplying it back by the second number to see if you land on the first number again.`, kind: 'tip' },
    { content: `Read the 'per' phrase FIRST before you write any division. The word before 'per' goes on top, the word after goes on bottom. Price per pouch means dollars ÷ pouches, not the other way around.`, kind: 'common-error' },
    { content: `Comparing total prices when the quantities differ is a trap. $2.40 looks cheaper than $3.50, but if one buys 3 items and the other buys 5, you're comparing apples to oranges. Always find the unit price first.`, kind: 'gotcha' },
    { content: `Always attach the unit to your answer: write '$1.50 per marker', not just '1.50'. The unit tells you that you divided in the right order and answers the right question.`, kind: 'vocab-note' },
    { content: `Check your unit rate by multiplying it back by the second number. If you get the first number again, you divided correctly. 0.80 × 5 = 4.00 ✓ means the unit price is right.`, kind: 'tip' },
    { content: `The second number in a ratio can never be zero when you turn it into a unit rate. You cannot divide by zero, so 'miles per zero hours' is impossible, not an answer.`, kind: 'edge-case' },
    { content: `Unit price and unit rate are the same thing when money is involved. Don't think of them as different topics—unit price is just what we call a unit rate about dollars.`, kind: 'vocab-note' },
  ],
};
