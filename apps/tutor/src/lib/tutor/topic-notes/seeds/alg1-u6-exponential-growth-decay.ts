/**
 * Algebra 1 — Unit 6 CED 6.4: Exponential Growth & Decay Models.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.exponential-growth-decay.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U6_EXPONENTIAL_GROWTH_DECAY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.exponential-growth-decay.v1',
  course: 'Algebra 1',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Exponential Growth & Decay Models',
  planId: 'evelyn.hs.alg1.exponential-growth-decay.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.exponential-growth-decay.v1' }],
  theory: [
    { loId: 'alg1.exponential-growth-decay', kind: 'framework', title: 'The two forms', content: `THE TWO FORMS — growth: y = a(1 + r)ᵗ. Decay: y = a(1 − r)ᵗ. Both are the same shape y = a·bᵗ; the only question is what you plug in for the base b.` },
    { loId: 'alg1.exponential-growth-decay', content: `a IS THE STARTING AMOUNT — the value when t = 0, because b⁰ = 1. Pull it straight out of the problem: "starts at 12,000 people" means a = 12000.` },
    { loId: 'alg1.exponential-growth-decay', content: `PERCENT TO r — r is the percent written as a DECIMAL: 5% → r = 0.05, 20% → r = 0.20, 3.5% → r = 0.035. Divide the percent by 100; never leave it as a whole number.` },
    { loId: 'alg1.exponential-growth-decay', content: `THE 1.05-vs-0.05 TRAP — the base is 1 + r, NOT r. A 5% yearly gain gives base 1.05, not 0.05. Using 0.05 as the base would mean keeping only 5% of the money each year. Same on the decay side: a 20% loss gives base 0.80, not 0.20.` },
    { loId: 'alg1.exponential-growth-decay', kind: 'framework', title: 'Read the rate back out', content: `READ THE RATE BACK OUT — given a model, compare b to 1. If b > 1 the quantity grows and r = b − 1 (base 1.06 → up 6%). If 0 < b < 1 it decays and r = 1 − b (base 0.91 → down 9%).` },
    { loId: 'alg1.exponential-growth-decay', kind: 'framework', title: 'Multiplying, not adding', content: `MULTIPLYING, NOT ADDING — each step multiplies by b, so a percent change is a different DOLLAR (or people) amount every period. That is why 20% off three years running is not the same as 60% off.` },
    { loId: 'alg1.exponential-growth-decay', content: `UNITS OF t — t counts the periods named in the problem: years, hours, half-lives. If the rate is per year, t must be in years.` },
    { loId: 'alg1.exponential-growth-decay', kind: 'framework', title: 'Sanity check with a short table', content: `SANITY CHECK WITH A SHORT TABLE — build t = 0, 1, 2 by multiplying by b each time and confirm the direction matches the story: growth values rise, decay values shrink toward zero without ever reaching it.` },
    { loId: 'alg1.exponential-growth-decay', kind: 'definition', title: 'growth factor', content: `the base 1 + r, greater than 1 — the number you multiply by each period when a quantity increases.` },
    { loId: 'alg1.exponential-growth-decay', kind: 'definition', title: 'decay factor', content: `the base 1 − r, between 0 and 1 — the number you multiply by each period when a quantity decreases.` },
    { loId: 'alg1.exponential-growth-decay', kind: 'definition', title: 'initial value', content: 'the amount a at t = 0, before any growth or decay has happened.' },
    { loId: 'alg1.exponential-growth-decay', kind: 'definition', title: 'rate of change r', content: 'the percent gained or lost each period, written as a decimal.' },
  ],
  methods: [
    {
      title: 'Worked population growth',
      steps: [
        'Starting amount: a = 12000. Percent to decimal: 3% → r = 0.03.',
        'Growing, so the base is 1 + r = 1.03. Model: P(t) = 12000(1.03)ᵗ.',
        `Evaluate at t = 4. Square first: 1.03² = 1.0609. Then square that: 1.0609² = 1.12550881.`,
        `P(4) = 12000 × 1.12550881 = 13506.1 (about 13,506 people). Sanity check: 12,000 growing a few percent a year should land just over 13,000 after 4 years. ✓`,
      ],
      example: { problem: `A town's population is 12,000 people and grows 3% per year. Write a function P(t) for the population after t years, then find the population after 4 years.`, solution: 'P(t) = 12000(1.03)ᵗ; P(4) ≈ 13,506 people' },
      relatedLoIds: ['alg1.exponential-growth-decay'],
    },
    {
      title: 'Worked depreciation not linear',
      steps: [
        `a = 1200, and 20% → r = 0.20. Losing value, so the base is 1 − r = 0.80. Model: V(t) = 1200(0.8)ᵗ.`,
        'Evaluate at t = 3: 0.8³ = 0.512, so V(3) = 1200 × 0.512 = 614.40.',
        `Year by year confirms it: 1200 → 960 → 768 → 614.40. Each year takes 20% of a SMALLER number, so the dollar drop shrinks: $240, then $192, then $153.60.`,
        `The tempting wrong path: 20% of 1200 is $240, times 3 years is $720, giving 1200 − 720 = $480. That treats the loss as a fixed $240 every year — that is a LINEAR model, and it undershoots the real value by $134.40.`,
      ],
      example: { problem: `A laptop bought for $1,200 loses 20% of its value each year. Write V(t) and find the value after 3 years — and compare it to "20% three times is 60% off."`, solution: 'V(t) = 1200(0.8)ᵗ; V(3) = $614.40 (not $480)' },
      relatedLoIds: ['alg1.exponential-growth-decay'],
    },
  ],
  pointers: [
    { content: `The base is 1 + r = 1 + 0.05 = 1.05, so A(t) = 2000(1.05)ᵗ. A base of 0.05 would mean keeping only 5% of the balance each year: $2,000 would drop to $100 after one year instead of growing to $2,100.`, kind: 'common-error' },
    { content: `Percent means "per hundred", so 5% = 5/100 = 0.05 and the base is 1.05. A base of 1.5 is a 50% yearly gain — ten times too fast.`, kind: 'common-error' },
    { content: 'Growth: y = a(1 + r)ᵗ. Decay: y = a(1 − r)ᵗ. a is the value at t = 0.', kind: 'tip' },
    { content: `Write the percent as a decimal first (5% → 0.05), then build the base: 1.05 for growth, 0.95 for decay. The base is never the bare rate.`, kind: 'tip' },
    { content: `Given a model, read the rate back out: base > 1 → grows by (base − 1); base < 1 → shrinks by (1 − base).`, kind: 'tip' },
    { content: `Percent change multiplies, it does not add — losing 20% three years running leaves 51.2% of the value, not 40%.`, kind: 'tip' },
    { content: `Convert percent by moving the decimal **two** places, not one: 5% → 0.05 (base 1.05), never 0.5 (base 1.5). A base of 1.5 is a 50% yearly gain — ten times too fast. Say "per hundred" out loud if you hesitate.`, kind: 'common-error' },
    { content: `The base is the growth/decay **factor**, not the rate. 5% gain → 1.05, not 0.05. 20% loss → 0.80, not 0.20. Writing 2000(0.05)ᵗ says you keep only 5% of the balance each year.`, kind: 'gotcha' },
    { content: `For decay, subtract the rate from 1 *first*, then use that one number as the base: 9% loss → 0.91. Don't write 18000(1 − 0.09ᵗ) or 18000(1)(0.09)ᵗ — the exponent applies to the whole factor.`, kind: 'common-error' },
    { content: `Percent change **multiplies** each period, so the dollar (or people) amount changes every step. Losing 20% for 3 years leaves 51.2%, not 40% — subtracting a fixed $240 each year is a *linear* model, a different unit's tool.`, kind: 'gotcha' },
    { content: `To read a rate out of a given model, compare the base to 1: base 1.06 → grows 6% (r = b − 1); base 0.91 → shrinks 9% (r = 1 − b). Base 0.91 is **not** a 91% decrease.`, kind: 'vocab-note' },
    { content: `Interpret growth as "gains 4% of its **current** balance each year," not "4% of the original." Percent-of-original wording describes linear change and is the wrong reading of a(1 + r)ᵗ.`, kind: 'vocab-note' },
    { content: `Check that t's units match the rate's period. A rate "per year" means t counts years — for 18 months use t = 1.5, and for a rate per half-life count half-lives, not years.`, kind: 'edge-case' },
    { content: `Sanity-check with a 3-row table (t = 0, 1, 2), multiplying by b each time: growth must rise, decay must shrink but stay positive. A decay model never hits 0 — if you get 0 or a negative value, your base is wrong.`, kind: 'tip' },
  ],
};
