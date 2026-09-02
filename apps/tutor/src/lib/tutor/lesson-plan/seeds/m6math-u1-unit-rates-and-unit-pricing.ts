/**
 * Grade 6 Math — Understanding Ratios & Rates: Unit Rates & Unit Pricing.
 *
 * PROCEDURE-LED. Lesson 1.3 scaled ratios up and down with tables and double
 * number lines; this lesson turns a ratio a:b into a single number, the unit
 * rate a/b, and uses that number to compare two offers fairly (CCSS 6.RP.A.2).
 * The trap this plan is built to kill is dividing in the wrong order (or
 * comparing totals instead of unit prices), which silently answers a
 * different question than the one asked.
 *
 * SCOPE GUARD: this lesson computes the unit rate a/b for a ratio a:b with
 * b not equal to zero, and uses that unit rate to compare unit prices between
 * two offers. It does not teach ratio notation or how to write a ratio (row
 * 1.1), building ratio tables or double number lines (row 1.2), or solving a
 * missing-value ratio problem (row 1.3) — those skills are assumed already in
 * place and are used here only to justify the division, not re-taught.
 * Nothing here is named a constant of proportionality or written as y = kx,
 * no unit rate in this plan is a complex fraction, and no example applies a
 * percent, a tax, a tip, or a discount — those are Grade 7 territory. Every
 * unit rate computed in this plan is a terminating decimal or whole number
 * reached by ordinary long division; no negative numbers are placed or
 * computed with anywhere in this plan.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U1_UNIT_RATES_AND_UNIT_PRICING: LessonPlan = {
  id: 'evelyn.ms.m6math.unit-rates-and-unit-pricing.v1',
  title: 'Unit Rates & Unit Pricing',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.unit-rates-and-unit-pricing',
      standard: 'M6MATH-1.4',
      description:
        'Compute the unit rate a/b for a ratio a:b with b not equal to zero, and use unit rates to compare unit prices between two offers (CCSS 6.RP.A.2).',
    },
  ],
  prerequisites: ['m6math.solving-missing-value-ratio-problems'],
  followUps: ['m6math.percent-as-rate-per-100'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that two prices cannot be compared until both are put on a per-one footing.',
      script:
        'Your class is making friendship bracelets for the school fair table. One craft store sells string in bundles of 4 spools for $6.00. Another store sells bundles of 9 spools for $12.60. The second bundle costs more money, so is it the worse deal? You cannot tell yet. The two bundles do not hold the same number of spools, so the two prices are not answering the same question. The only fair way to compare them is to ask what ONE spool costs in each bundle. That number has a name. It is called a unit rate, and finding it is what today is about.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-unit-rate',
      kind: 'concept',
      goal: 'Turn a ratio a:b into the single number a/b, and make comparing by unit price the automatic next step.',
      keyIdeas: [
        'A UNIT RATE IS THE PER-ONE VERSION OF A RATIO — for a ratio a:b, the unit rate is a divided by b, written a/b. It tells you the amount of the first quantity that matches exactly ONE of the second quantity. If a car uses 2 gallons of gas to go 60 miles, the ratio is 60:2, and the unit rate is 60 divided by 2, which is 30 miles for ONE gallon.',
        'THE WORD PER NAMES A UNIT RATE, AND TELLS YOU THE ORDER — miles per gallon, price per pouch, and pages per hour are all unit rates. The word before per is what you are dividing, and the word after per is what you are dividing by. Price per pouch means dollars divided by pouches. Read the per phrase before you touch a division sign.',
        'UNIT PRICE IS A UNIT RATE ABOUT MONEY — when the first quantity is money, the unit rate is called the unit price: the cost of exactly ONE item. It is found the same way as any other unit rate, total price divided by number of items.',
        'THE SECOND NUMBER CAN NEVER BE ZERO — a unit rate a/b only makes sense when b is not zero, because dividing by zero has no answer. Every ratio you turn into a unit rate needs a second term that is a real, nonzero amount.',
        'UNIT RATES MAKE OFFERS COMPARABLE — two totals cannot be compared directly when they buy different amounts, such as $2.40 for 3 notebooks against $3.50 for 5 notebooks. Turning each into a price for ONE notebook puts both offers on the same footing, and the smaller unit price is the better deal, even if its total price is higher.',
        'CHECK BY MULTIPLYING BACK — once you divide to find a unit rate, multiply that unit rate by b. If the result matches a, the division was done correctly. This one check catches almost every mistake in this lesson.',
      ],
      vocabulary: [
        { term: 'unit rate', definition: 'for a ratio a:b, the number a/b, found by dividing a by b; it is the amount of the first quantity that matches exactly ONE of the second quantity.' },
        { term: 'unit price', definition: 'a unit rate where the first quantity is money: the cost of exactly one item, found by dividing total price by number of items.' },
        { term: 'per', definition: 'the word that names a unit rate, such as miles per gallon or dollars per pouch; it tells you which quantity is divided by which.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-price-per-marker',
      kind: 'worked_example',
      problem: 'A 4-pack of markers costs $6.00. What is the price per marker?',
      steps: [
        'Read the per phrase first: price PER MARKER. That means dollars divided by markers, so the ratio is $6.00 to 4 markers, written 6.00:4.',
        'Write the division that matches those words: 6.00 divided by 4.',
        'Split $6.00 into 4 equal shares. Four shares of $1.50 make 4 times 1.50, which is 6.00, so each share is $1.50.',
        'Say the answer with its unit attached: $1.50 per marker. The unit is not decoration. It is how you know you divided in the right order.',
        'Check by multiplying back: 1.50 times 4 is 6.00, which is exactly the price on the pack. The check matches, so the answer holds.',
      ],
      answer: '$1.50 per marker',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compare-two-offers',
      kind: 'worked_example',
      problem: 'A store sells pretzels two ways: Bag A has 5 ounces for $3.50, and Bag B has 8 ounces for $5.20. Which bag is the better deal?',
      steps: [
        'The two totals cannot be compared yet, because the bags hold different numbers of ounces. Put both on a per-one footing first by finding the price per ounce for each.',
        'Bag A: price per ounce means dollars divided by ounces, so 3.50 divided by 5 is 0.70. Check it: 0.70 times 5 is 3.50, which matches.',
        'Bag B: 5.20 divided by 8 is 0.65. Check it: 0.65 times 8 is 5.20, which matches.',
        'Now the comparison is fair, because both numbers answer the same question: what does ONE ounce cost. 0.65 is less than 0.70, so Bag B is cheaper by 5 cents on every single ounce.',
        'WRONG answer to avoid: Bag A is the better deal because $3.50 is less than $5.20. That compares TOTALS, and the totals buy different amounts of pretzels. CORRECT answer: Bag B, at $0.65 per ounce.',
      ],
      answer: 'Bag B, at $0.65 per ounce',
      estimatedMinutes: 3,
    },
    {
      id: 'try-price-per-pouch',
      kind: 'try_yourself',
      problem: 'A 5-pack of juice pouches costs $4.00. What is the price per pouch?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$0.80 per pouch', correct: true },
        { id: 'b', text: '$1.25 per pouch' },
        { id: 'c', text: '$20.00 per pouch' },
        { id: 'd', text: '$9.00 per pouch' },
      ],
      expectedAnswer: '$0.80 per pouch',
      hints: [
        'Read the per phrase before you divide. Price per pouch means dollars divided by pouches, so it is 4.00 divided by 5, not 5 divided by 4.00.',
        'You are splitting $4.00 into 5 equal shares, so the answer has to be smaller than a dollar.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-better-buy',
      kind: 'try_yourself',
      problem: 'Notebook Pack A is 3 notebooks for $2.40. Notebook Pack B is 5 notebooks for $3.50. Which is the better deal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Pack A, because $0.80 per notebook beats $0.70 per notebook' },
        { id: 'b', text: 'Pack B, because $0.70 per notebook beats $0.80 per notebook', correct: true },
        { id: 'c', text: 'Pack A, because $2.40 is less than $3.50' },
        { id: 'd', text: 'Pack B, because it has more notebooks' },
      ],
      expectedAnswer: 'Pack B, because $0.70 per notebook beats $0.80 per notebook',
      hints: [
        'Turn each pack into a price for ONE notebook before you compare anything: 2.40 divided by 3, and 3.50 divided by 5.',
        'For a price per notebook, the SMALLER number is the better deal, because you pay less for each one. The number of notebooks in the pack and the total price do not decide this by themselves.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-miles-per-hour',
      kind: 'try_yourself',
      problem: 'A ferry travels 36 miles in 4 hours at a steady speed. How many miles per hour is that? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'Miles per hour means miles divided by hours, so the 36 gets split into 4 equal parts.',
        'Check whatever you get by multiplying back: your answer times 4 should land on 36.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-order-and-wrong-comparison',
      kind: 'misconception_check',
      question: 'A 5-pack of juice pouches costs $4.00. One student writes $1.25 per pouch. Another student compares Notebook Pack A (3 notebooks for $2.40) with Notebook Pack B (5 notebooks for $3.50) and picks Pack A because it costs less money overall. What went wrong in each case?',
      commonErrors: [
        {
          answer: '$1.25 per pouch',
          misconception: 'Dividing the number of pouches by the price instead of the price by the number of pouches, flipping the order the per phrase asks for.',
          correctsTo:
            'Price per pouch means dollars divided by pouches, so the division is 4.00 divided by 5, not 5 divided by 4.00. That gives $0.80 per pouch. Check it by multiplying back: 0.80 times 5 is 4.00, which matches the price on the pack. The number 1.25 is real, but it answers a different question, how many pouches per dollar.',
        },
        {
          answer: 'Pack A, because $2.40 is less than $3.50',
          misconception: 'Comparing the two total prices instead of the two unit prices, even though the packs hold different numbers of notebooks.',
          correctsTo:
            'Totals only compare fairly when the quantities match, and here they do not: Pack A has 3 notebooks and Pack B has 5. Turn each into a price for ONE notebook first: 2.40 divided by 3 is $0.80 per notebook, and 3.50 divided by 5 is $0.70 per notebook. Pack B is cheaper on every single notebook, even though its total price is higher.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'For a ratio a:b, the unit rate is a divided by b, the amount that matches exactly ONE of the second quantity.',
        'The word per names a unit rate and tells you which number divides which: price per pouch means dollars divided by pouches.',
        'Unit price is a unit rate about money: the cost of exactly ONE item.',
        'The second number in a unit rate can never be zero, because dividing by zero has no answer.',
        'To compare two offers, turn each into a unit price and pick the smaller number, not the smaller total.',
        'Check every unit rate by multiplying it back by the second number to see if you land on the first number again.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Unit Rates & Unit Pricing' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
