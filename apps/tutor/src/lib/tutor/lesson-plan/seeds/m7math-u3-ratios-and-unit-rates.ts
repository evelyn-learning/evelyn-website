/**
 * Grade 7 Math — Ratios & Proportional Relationships: Ratios & Unit Rates.
 *
 * The opening move of the whole unit (CCSS 7.RP.A.1). A ratio compares two
 * amounts, a rate compares two DIFFERENT units, and a unit rate answers the
 * one question that makes offers comparable: what does ONE cost, or how far
 * in ONE hour. The trap this plan is built to kill is dividing in the wrong
 * order, which silently answers the other question. The unit rate found here
 * returns in 3.4 with a new name, the constant of proportionality.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U3_RATIOS_AND_UNIT_RATES: LessonPlan = {
  id: 'evelyn.ms.m7math.ratios-and-unit-rates.v1',
  title: 'Ratios & Unit Rates',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.ratios-and-unit-rates',
      standard: 'M7MATH-3.1',
      description:
        'Tell a ratio from a rate, compute the unit rate associated with a pair of quantities, and use unit rates to compare two offers (CCSS 7.RP.A.1, 6.RP.A.2).',
    },
  ],
  prerequisites: ['m7math.order-of-operations-rationals'],
  followUps: ['m7math.complex-fraction-unit-rates'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that two prices cannot be compared until both are put on a per-one footing.',
      script:
        'Two boxes of granola bars sit on the shelf. The small box holds 6 bars for $4.50. The big box holds 10 bars for $7.00. The big box costs more money, so is it the worse deal? You cannot tell yet. The boxes hold different numbers of bars, so the two prices are not answering the same question. The only fair way to compare them is to ask what ONE bar costs in each box. That number has a name. It is called a unit rate, and it is the whole lesson today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ratios-rates-unit-rates',
      kind: 'concept',
      goal: 'Separate ratio from rate from unit rate, and make the per-one question the thing the student always asks first.',
      keyIdeas: [
        'A RATIO COMPARES TWO AMOUNTS — 3 cups of water to 2 cups of juice is a ratio, written 3 to 2, or 3:2, or as the fraction 3/2. A ratio does not have to involve money or time. It just says how two amounts sit next to each other.',
        'A RATE IS A RATIO OF TWO DIFFERENT UNITS — $4.50 for 6 bars compares dollars to bars. 120 miles in 3 hours compares miles to hours. The word that gives a rate away is per: dollars per bar, miles per hour, pages per minute.',
        'A UNIT RATE IS THE PER-ONE VERSION — it tells you the amount that goes with exactly ONE of the other thing. $0.75 per bar is a unit rate. 40 miles per hour is a unit rate. The second number is always 1, even though nobody writes the 1 down.',
        'DIVIDE TO GET IT, AND DECIDE THE ORDER FIRST — the words tell you which way to divide. Dollars per bar means dollars divided by bars. So $4.50 for 6 bars gives 4.50 ÷ 6 = $0.75 per bar. Flip that division and you get 6 ÷ 4.50, which is about 1.33 bars per dollar. That is a true statement too, but it answers a different question. Read the per phrase BEFORE you touch the calculator.',
        'UNIT RATES MAKE OFFERS COMPARABLE — two totals like $4.50 and $7.00 cannot be compared directly when the pack sizes differ. Once both are turned into a price for one bar, the smaller number is the better buy. This per-one price is often called the unit price.',
        'ONE NUMBER, MANY NAMES — the unit rate is going to follow you through this entire unit. In lesson 3.4 the same number gets a longer name, the constant of proportionality. It is not a new idea. It is this idea wearing a different hat.',
      ],
      vocabulary: [
        { term: 'ratio', definition: 'a comparison of two amounts, written 3 to 2, 3:2, or 3/2.' },
        { term: 'rate', definition: 'a ratio that compares two different units, such as dollars to bars or miles to hours.' },
        { term: 'unit rate', definition: 'the rate for exactly one of the second quantity, such as $0.75 per bar.' },
        { term: 'unit price', definition: 'the unit rate when the first quantity is money: the cost of one item.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-unit-price',
      kind: 'worked_example',
      problem: 'A pack of 12 dog treats costs $3.60. What is the price per treat?',
      steps: [
        'Read the per phrase first: price PER TREAT. That means dollars divided by treats, so the $3.60 is the amount being split and the 12 treats are what it is split into.',
        'Write the division that matches those words: 3.60 ÷ 12.',
        'Split $3.60 into 12 equal shares. Twelve shares of 30 cents make 12 × 0.30 = 3.60, so each share is $0.30.',
        'Say the answer with its units attached: $0.30 per treat. Units are not decoration here. They are how you know you divided the right way.',
        'Check by scaling back up. If one treat is $0.30, then 12 treats cost 0.30 × 12 = $3.60, which is exactly the price printed on the pack.',
      ],
      answer: '$0.30 per treat',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compare-two-offers',
      kind: 'worked_example',
      problem: 'Which is the better buy: a 6-bar box for $4.50, or a 10-bar box for $7.00?',
      steps: [
        'The two totals cannot be compared yet, because they buy different numbers of bars. Put both on a per-one footing first.',
        'Small box: dollars per bar means 4.50 ÷ 6 = 0.75, so $0.75 per bar. Check it: 6 × 0.75 = 4.50.',
        'Big box: 7.00 ÷ 10 = 0.70, so $0.70 per bar. Check it: 10 × 0.70 = 7.00.',
        'Now the comparison is fair, because both numbers answer the same question. $0.70 is less than $0.75, so the big box is cheaper by 5 cents on every single bar.',
        'WRONG answer to avoid: the small box is the better deal because $4.50 is less than $7.00. That compares TOTALS, and the totals buy different amounts. RIGHT answer: the 10-bar box, at $0.70 per bar.',
      ],
      answer: 'The 10-bar box, at $0.70 per bar',
      estimatedMinutes: 3,
    },
    {
      id: 'try-unit-price',
      kind: 'try_yourself',
      problem: 'A sheet of 20 stickers costs $5.00. What is the price per sticker?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$0.25 per sticker', correct: true },
        { id: 'b', text: '$4.00 per sticker' },
        { id: 'c', text: '$5.00 per sticker' },
        { id: 'd', text: '$100.00 per sticker' },
      ],
      expectedAnswer: '$0.25 per sticker',
      hints: [
        'Read the per phrase before you divide. Price per sticker means dollars divided by stickers.',
        'You are splitting $5.00 into 20 equal shares, so the answer has to be smaller than a dollar.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-better-buy',
      kind: 'try_yourself',
      problem: 'Pack A is 8 juice boxes for $6.00. Pack B is 12 juice boxes for $8.40. Which is the better buy?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Pack B, because $0.70 per box beats $0.75 per box', correct: true },
        { id: 'b', text: 'Pack A, because $0.75 per box beats $0.70 per box' },
        { id: 'c', text: 'Pack A, because $6.00 is less than $8.40' },
        { id: 'd', text: 'They are the same deal, because a bigger pack always costs more for more boxes' },
      ],
      expectedAnswer: 'Pack B, because $0.70 per box beats $0.75 per box',
      hints: [
        'Turn each pack into a price for ONE juice box before you compare anything.',
        'For a price per box, the SMALLER number is the better buy, because you pay less for each one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pages-per-hour',
      kind: 'try_yourself',
      problem: 'Maya reads 144 pages in 6 hours. How many pages does she read per hour? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '24',
      hints: [
        'Pages per hour means pages divided by hours, so the 144 gets split into 6 equal parts.',
        'Check whatever you get by scaling back up: your answer times 6 should land on 144.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-divided-the-wrong-way',
      kind: 'misconception_check',
      question: 'A sheet of 20 stickers costs $5.00. A student computes 20 ÷ 5 = 4 and says each sticker costs $4. What went wrong?',
      commonErrors: [
        {
          answer: '$4 per sticker',
          misconception: 'Dividing the bigger number by the smaller one out of habit, instead of letting the per phrase decide the order.',
          correctsTo: 'The number 4 is real, but it answers a different question: it is 4 stickers per dollar. The question asked for dollars per sticker, which is 5.00 ÷ 20 = $0.25. A quick sanity check catches this instantly: $4 for one sticker would make the sheet of 20 cost $80, not $5. Read the per phrase first, then divide in that order.',
        },
        {
          answer: 'The 6-bar box is the better deal because $4.50 is less than $7.00',
          misconception: 'Comparing the totals when the two offers buy different amounts, so the totals are not answering the same question.',
          correctsTo: 'Totals only compare fairly when the amounts match. Turn each box into a price for one bar: 4.50 ÷ 6 = $0.75 and 7.00 ÷ 10 = $0.70. The 10-bar box is cheaper on every bar, even though it costs more money at the register.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A ratio compares two amounts; a rate compares two different units; a unit rate is the per-one version.',
        'The word per tells you the order of the division: dollars per bar means dollars ÷ bars.',
        'Flipping the division gives a true but different rate, so decide the order before computing.',
        'To compare two offers, turn both into a price for ONE item and pick the smaller number.',
        'Always say the unit rate with its units attached, like $0.70 per bar or 24 pages per hour.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Ratios & Unit Rates' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
