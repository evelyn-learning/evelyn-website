/**
 * Algebra 1 — Exponential Functions: Growth & Decay Models.
 *
 * The percent-change workhorse (CCSS F-LE.A.2, F-LE.B.5): turn "grows 5% a
 * year" into a(1 + r)ᵗ and "loses 20% a year" into a(1 − r)ᵗ, then read the
 * starting amount, the factor, and the rate back out of a model someone else
 * wrote. Population, savings, and depreciation problems are all this one form.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U6_EXPONENTIAL_GROWTH_DECAY: LessonPlan = {
  id: 'evelyn.hs.alg1.exponential-growth-decay.v1',
  title: 'Exponential Growth & Decay Models',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.exponential-growth-decay',
      standard: 'ALG1-6.4',
      description:
        'Write, evaluate, and interpret exponential growth and decay models of the form a(1 + r)ᵗ and a(1 − r)ᵗ, converting a stated percent change into the growth or decay factor and explaining what each part of the model means in context (CCSS F-LE.A.2, F-LE.B.5).',
    },
  ],
  prerequisites: ['alg1.exponential-functions'],
  followUps: ['alg1.polynomial-operations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame exponential models as the math behind money, populations, and everything that loses value — one form that answers all of them.',
      script:
        'Your savings account, the price of a used car, the number of people in your town — all three change by a PERCENT each year, not by a fixed amount. That one difference is why a balance snowballs and a car price never quite hits zero. Today you learn the single form that models all of them, and how to turn any sentence like "grows five percent a year" into an equation you can actually evaluate.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-growth-decay-form',
      kind: 'concept',
      goal: 'The a(1 + r)ᵗ / a(1 − r)ᵗ form, converting a percent to r, reading each part in context, and why this is multiplying rather than adding.',
      keyIdeas: [
        'THE TWO FORMS — growth: y = a(1 + r)ᵗ. Decay: y = a(1 − r)ᵗ. Both are the same shape y = a·bᵗ; the only question is what you plug in for the base b.',
        'a IS THE STARTING AMOUNT — the value when t = 0, because b⁰ = 1. Pull it straight out of the problem: "starts at 12,000 people" means a = 12000.',
        'PERCENT TO r — r is the percent written as a DECIMAL: 5% → r = 0.05, 20% → r = 0.20, 3.5% → r = 0.035. Divide the percent by 100; never leave it as a whole number.',
        'THE 1.05-vs-0.05 TRAP — the base is 1 + r, NOT r. A 5% yearly gain gives base 1.05, not 0.05. Using 0.05 as the base would mean keeping only 5% of the money each year. Same on the decay side: a 20% loss gives base 0.80, not 0.20.',
        'READ THE RATE BACK OUT — given a model, compare b to 1. If b > 1 the quantity grows and r = b − 1 (base 1.06 → up 6%). If 0 < b < 1 it decays and r = 1 − b (base 0.91 → down 9%).',
        'MULTIPLYING, NOT ADDING — each step multiplies by b, so a percent change is a different DOLLAR (or people) amount every period. That is why 20% off three years running is not the same as 60% off.',
        'UNITS OF t — t counts the periods named in the problem: years, hours, half-lives. If the rate is per year, t must be in years.',
        'SANITY CHECK WITH A SHORT TABLE — build t = 0, 1, 2 by multiplying by b each time and confirm the direction matches the story: growth values rise, decay values shrink toward zero without ever reaching it.',
      ],
      vocabulary: [
        { term: 'growth factor', definition: 'the base 1 + r, greater than 1 — the number you multiply by each period when a quantity increases.' },
        { term: 'decay factor', definition: 'the base 1 − r, between 0 and 1 — the number you multiply by each period when a quantity decreases.' },
        { term: 'initial value', definition: 'the amount a at t = 0, before any growth or decay has happened.' },
        { term: 'rate of change r', definition: 'the percent gained or lost each period, written as a decimal.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-population-growth',
      kind: 'worked_example',
      problem:
        "A town's population is 12,000 people and grows 3% per year. Write a function P(t) for the population after t years, then find the population after 4 years.",
      steps: [
        'Starting amount: a = 12000. Percent to decimal: 3% → r = 0.03.',
        'Growing, so the base is 1 + r = 1.03. Model: P(t) = 12000(1.03)ᵗ.',
        'Evaluate at t = 4. Square first: 1.03² = 1.0609. Then square that: 1.0609² = 1.12550881.',
        'P(4) = 12000 × 1.12550881 = 13506.1 (about 13,506 people). Sanity check: 12,000 growing a few percent a year should land just over 13,000 after 4 years. ✓',
      ],
      answer: 'P(t) = 12000(1.03)ᵗ; P(4) ≈ 13,506 people',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-depreciation-not-linear',
      kind: 'worked_example',
      problem:
        'A laptop bought for $1,200 loses 20% of its value each year. Write V(t) and find the value after 3 years — and compare it to "20% three times is 60% off."',
      steps: [
        'a = 1200, and 20% → r = 0.20. Losing value, so the base is 1 − r = 0.80. Model: V(t) = 1200(0.8)ᵗ.',
        'Evaluate at t = 3: 0.8³ = 0.512, so V(3) = 1200 × 0.512 = 614.40.',
        'Year by year confirms it: 1200 → 960 → 768 → 614.40. Each year takes 20% of a SMALLER number, so the dollar drop shrinks: $240, then $192, then $153.60.',
        'The tempting wrong path: 20% of 1200 is $240, times 3 years is $720, giving 1200 − 720 = $480. That treats the loss as a fixed $240 every year — that is a LINEAR model, and it undershoots the real value by $134.40.',
      ],
      answer: 'V(t) = 1200(0.8)ᵗ; V(3) = $614.40 (not $480)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-interpret-model',
      kind: 'try_yourself',
      problem:
        'A savings account balance is modeled by A(t) = 750(1.04)ᵗ, where t is the number of years since the account was opened. Which statement correctly interprets this model?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The account started with $750 and gains 4% of its current balance each year.', correct: true },
        { id: 'b', text: 'The account started with $750 and gains 104% each year.' },
        { id: 'c', text: 'The account started with $750 and gains $4 each year.' },
        { id: 'd', text: 'The account started with $750 and loses 4% each year.' },
      ],
      expectedAnswer: 'The account started with $750 and gains 4% of its current balance each year.',
      hints: [
        'a is the value at t = 0, and the base tells you the direction: is 1.04 bigger or smaller than 1?',
        'The base is 1 + r, so 1.04 = 1 + 0.04 → r = 0.04, which is 4% — a percent of the balance, not a fixed number of dollars.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-write-decay-model',
      kind: 'try_yourself',
      problem:
        'A car bought for $18,000 loses 9% of its value each year. Which function models the value V, in dollars, after t years?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'V(t) = 18000(0.09)ᵗ' },
        { id: 'b', text: 'V(t) = 18000(0.91)ᵗ', correct: true },
        { id: 'c', text: 'V(t) = 18000(1.09)ᵗ' },
        { id: 'd', text: 'V(t) = 18000 − 1620t' },
      ],
      expectedAnswer: 'V(t) = 18000(0.91)ᵗ',
      hints: [
        'The value is going DOWN, so the base must be between 0 and 1 — that rules out two of these immediately.',
        'Decay base = 1 − r = 1 − 0.09. The base is not the rate itself, and a fixed dollar drop each year would be linear, not exponential.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-savings',
      kind: 'try_yourself',
      problem:
        'A savings account starts with $2,000 and earns 5% interest per year. Type the balance, in dollars, after 2 years as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2205',
      hints: ['5% growth means base 1 + 0.05 = 1.05, so the model is A(t) = 2000(1.05)ᵗ.', 'A(2) = 2000 × 1.05². Compute 1.05² = 1.1025 first.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rate-as-base',
      kind: 'misconception_check',
      question:
        'A student models a $2,000 account earning 5% per year as A(t) = 2000(0.05)ᵗ. Another student writes A(t) = 2000(1.5)ᵗ. What went wrong in each?',
      commonErrors: [
        {
          answer: 'A(t) = 2000(0.05)ᵗ',
          misconception: 'Using the rate itself as the base instead of 1 + r — treating "5%" and "the growth factor" as the same number.',
          correctsTo:
            'The base is 1 + r = 1 + 0.05 = 1.05, so A(t) = 2000(1.05)ᵗ. A base of 0.05 would mean keeping only 5% of the balance each year: $2,000 would drop to $100 after one year instead of growing to $2,100.',
        },
        {
          answer: 'A(t) = 2000(1.5)ᵗ',
          misconception: 'Converting 5% to 0.5 instead of 0.05 — moving the decimal point one place instead of two.',
          correctsTo:
            'Percent means "per hundred", so 5% = 5/100 = 0.05 and the base is 1.05. A base of 1.5 is a 50% yearly gain — ten times too fast.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Growth: y = a(1 + r)ᵗ. Decay: y = a(1 − r)ᵗ. a is the value at t = 0.',
        'Write the percent as a decimal first (5% → 0.05), then build the base: 1.05 for growth, 0.95 for decay. The base is never the bare rate.',
        'Given a model, read the rate back out: base > 1 → grows by (base − 1); base < 1 → shrinks by (1 − base).',
        'Percent change multiplies, it does not add — losing 20% three years running leaves 51.2% of the value, not 40%.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Exponential Growth & Decay Models' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
