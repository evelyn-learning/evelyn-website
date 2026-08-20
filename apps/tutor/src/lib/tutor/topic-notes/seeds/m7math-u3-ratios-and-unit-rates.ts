/**
 * Grade 7 Math — Unit 3 CED 3.1: Ratios & Unit Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.ratios-and-unit-rates.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U3_RATIOS_AND_UNIT_RATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.ratios-and-unit-rates.v1',
  course: 'Grade 7 Math',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Ratios & Unit Rates',
  planId: 'evelyn.ms.m7math.ratios-and-unit-rates.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.ratios-and-unit-rates.v1' }],
  theory: [
    { loId: 'm7math.ratios-and-unit-rates', kind: 'framework', title: 'A ratio compares two amounts', content: `A RATIO COMPARES TWO AMOUNTS — 3 cups of water to 2 cups of juice is a ratio, written 3 to 2, or 3:2, or as the fraction 3/2. A ratio does not have to involve money or time. It just says how two amounts sit next to each other.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'framework', title: 'A rate is a ratio of two different units', content: `A RATE IS A RATIO OF TWO DIFFERENT UNITS — $4.50 for 6 bars compares dollars to bars. 120 miles in 3 hours compares miles to hours. The word that gives a rate away is per: dollars per bar, miles per hour, pages per minute.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'framework', title: 'A unit rate is the per-one version', content: `A UNIT RATE IS THE PER-ONE VERSION — it tells you the amount that goes with exactly ONE of the other thing. $0.75 per bar is a unit rate. 40 miles per hour is a unit rate. The second number is always 1, even though nobody writes the 1 down.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'framework', title: 'Divide to get it, and decide the order first', content: `DIVIDE TO GET IT, AND DECIDE THE ORDER FIRST — the words tell you which way to divide. Dollars per bar means dollars divided by bars. So $4.50 for 6 bars gives 4.50 ÷ 6 = $0.75 per bar. Flip that division and you get 6 ÷ 4.50, which is about 1.33 bars per dollar. That is a true statement too, but it answers a different question. Read the per phrase BEFORE you touch the calculator.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'framework', title: 'Unit rates make offers comparable', content: `UNIT RATES MAKE OFFERS COMPARABLE — two totals like $4.50 and $7.00 cannot be compared directly when the pack sizes differ. Once both are turned into a price for one bar, the smaller number is the better buy. This per-one price is often called the unit price.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'framework', title: 'One number, many names', content: `ONE NUMBER, MANY NAMES — the unit rate is going to follow you through this entire unit. In lesson 3.4 the same number gets a longer name, the constant of proportionality. It is not a new idea. It is this idea wearing a different hat.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'definition', title: 'ratio', content: 'a comparison of two amounts, written 3 to 2, 3:2, or 3/2.' },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'definition', title: 'rate', content: `a ratio that compares two different units, such as dollars to bars or miles to hours.` },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'definition', title: 'unit rate', content: 'the rate for exactly one of the second quantity, such as $0.75 per bar.' },
    { loId: 'm7math.ratios-and-unit-rates', kind: 'definition', title: 'unit price', content: 'the unit rate when the first quantity is money: the cost of one item.' },
  ],
  methods: [
    {
      title: 'Worked unit price',
      steps: [
        `Read the per phrase first: price PER TREAT. That means dollars divided by treats, so the $3.60 is the amount being split and the 12 treats are what it is split into.`,
        'Write the division that matches those words: 3.60 ÷ 12.',
        `Split $3.60 into 12 equal shares. Twelve shares of 30 cents make 12 × 0.30 = 3.60, so each share is $0.30.`,
        `Say the answer with its units attached: $0.30 per treat. Units are not decoration here. They are how you know you divided the right way.`,
        `Check by scaling back up. If one treat is $0.30, then 12 treats cost 0.30 × 12 = $3.60, which is exactly the price printed on the pack.`,
      ],
      example: { problem: 'A pack of 12 dog treats costs $3.60. What is the price per treat?', solution: '$0.30 per treat' },
      relatedLoIds: ['m7math.ratios-and-unit-rates'],
    },
    {
      title: 'Worked compare two offers',
      steps: [
        `The two totals cannot be compared yet, because they buy different numbers of bars. Put both on a per-one footing first.`,
        `Small box: dollars per bar means 4.50 ÷ 6 = 0.75, so $0.75 per bar. Check it: 6 × 0.75 = 4.50.`,
        'Big box: 7.00 ÷ 10 = 0.70, so $0.70 per bar. Check it: 10 × 0.70 = 7.00.',
        `Now the comparison is fair, because both numbers answer the same question. $0.70 is less than $0.75, so the big box is cheaper by 5 cents on every single bar.`,
        `WRONG answer to avoid: the small box is the better deal because $4.50 is less than $7.00. That compares TOTALS, and the totals buy different amounts. RIGHT answer: the 10-bar box, at $0.70 per bar.`,
      ],
      example: { problem: 'Which is the better buy: a 6-bar box for $4.50, or a 10-bar box for $7.00?', solution: 'The 10-bar box, at $0.70 per bar' },
      relatedLoIds: ['m7math.ratios-and-unit-rates'],
    },
  ],
  pointers: [
    { content: `Students often say "$4 per sticker" — The number 4 is real, but it answers a different question: it is 4 stickers per dollar. The question asked for dollars per sticker, which is 5.00 ÷ 20 = $0.25. A quick sanity check catches this instantly: $4 for one sticker would make the sheet of 20 cost $80, not $5. Read the per phrase first, then divide in that order.`, kind: 'common-error' },
    { content: `Students often say "The 6-bar box is the better deal because $4.50 is less than $7.00" — Totals only compare fairly when the amounts match. Turn each box into a price for one bar: 4.50 ÷ 6 = $0.75 and 7.00 ÷ 10 = $0.70. The 10-bar box is cheaper on every bar, even though it costs more money at the register.`, kind: 'common-error' },
    { content: `A ratio compares two amounts; a rate compares two different units; a unit rate is the per-one version.`, kind: 'tip' },
    { content: `The word per tells you the order of the division: dollars per bar means dollars ÷ bars.`, kind: 'tip' },
    { content: `Flipping the division gives a true but different rate, so decide the order before computing.`, kind: 'tip' },
    { content: `To compare two offers, turn both into a price for ONE item and pick the smaller number.`, kind: 'tip' },
    { content: `Always say the unit rate with its units attached, like $0.70 per bar or 24 pages per hour.`, kind: 'tip' },
    { content: `Don't divide big ÷ small out of habit. The **per** phrase sets the order: "dollars per sticker" means dollars ÷ stickers, so $5.00 ÷ 20 = $0.25 — even though 20 ÷ 5 is easier.`, kind: 'common-error' },
    { content: `Flipping the division isn't "wrong math" — it's a different rate. 4 stickers per dollar and $0.25 per sticker are both true. Check which one the question asked for before you circle an answer.`, kind: 'gotcha' },
    { content: `Always write the units with the number: $0.70 per bar, 24 pages per hour. A bare "0.70" hides whether you divided the right way. Units are your proof, not decoration.`, kind: 'tip' },
    { content: `Cheaper total ≠ better buy. $4.50 beats $7.00 at the register, but the $7.00 box is 10 bars at $0.70 each vs. $0.75 each. Totals only compare fairly when the amounts match.`, kind: 'common-error' },
    { content: `Ratio, rate, unit rate are not synonyms. 3 cups water to 2 cups juice is a *ratio* (same units). $4.50 for 6 bars is a *rate* (different units). $0.75 per bar is a *unit rate* — the second amount is 1.`, kind: 'vocab-note' },
    { content: `Sanity-check with a quick scale-up: if one treat is $0.30, then 12 treats cost 0.30 × 12 = $3.60. ✓ If your check gives $80 for a $5 sheet of stickers, you divided backwards.`, kind: 'tip' },
    { content: `Unit rates often aren't whole numbers, and that's fine. 6 bars for $4.50 the other way gives about 1.33 bars per dollar. Don't round to a "nicer" number — round only when the problem says to, and keep cents to two places.`, kind: 'edge-case' },
    { content: `"Unit price" is just a unit rate whose first quantity is money. Same idea, narrower name. And the unit rate returns later as the *constant of proportionality* — one number, several names.`, kind: 'vocab-note' },
  ],
};
