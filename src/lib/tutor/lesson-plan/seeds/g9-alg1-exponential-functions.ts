/**
 * G9 — Algebra 1: Exponential functions intro (y = a · b^x).
 *
 * Functions where the variable is in the EXPONENT — used for
 * compound growth, decay, populations, viral spread, half-life.
 * The "doubling pattern" contrasted with linear's "constant
 * difference". Identify growth (b > 1) vs decay (0 < b < 1) and the
 * starting value a.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ALG1_EXPONENTIAL_FUNCTIONS: LessonPlan = {
  id: 'evelyn.g9.math.algebra.exponential-functions.v1',
  title: 'Exponential Functions: Growth and Decay',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'exponential-functions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsf.le.a.1',
      description: 'Distinguish between linear and exponential functions.',
      standard: 'CCSS.MATH.CONTENT.HSF.LE.A.1',
    },
    {
      id: 'ccss.math.hsf.le.a.2',
      description: 'Construct linear and exponential functions from given information.',
      standard: 'CCSS.MATH.CONTENT.HSF.LE.A.2',
    },
  ],
  prerequisites: ['ccss.math.8.f.b.4', 'ccss.math.8.ee.a.1'],
  followUps: ['ccss.math.hsf.le.b.5'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a doubling story to make the magnitude of exponential growth feel real.',
      script: 'Imagine I offer you two job options. Option A: $100 a day for a month. Option B: 1 cent on day 1, 2 cents on day 2, 4 cents on day 3 — doubling each day. Most people pick A. After 30 days: A pays $3,000. B pays over $5 MILLION. That\'s exponential growth, and once you see it you can\'t un-see it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-form-and-rate',
      kind: 'concept',
      goal: 'y = a · b^x: a = starting value, b = factor; growth vs decay; contrast with linear.',
      keyIdeas: [
        'EXPONENTIAL FUNCTION: y = a · bˣ, where the variable is in the EXPONENT.',
        'a = STARTING VALUE (the y-value at x = 0). a · b⁰ = a · 1 = a.',
        'b = GROWTH/DECAY FACTOR. Each unit increase in x MULTIPLIES y by b.',
        'GROWTH: b > 1. y is bigger at every step. (b = 2 → doubling.)',
        'DECAY: 0 < b < 1. y shrinks at every step. (b = 0.5 → halving.)',
        'b ≤ 0 is not used for standard exponential functions.',
        'CONTRAST WITH LINEAR: linear adds the SAME amount per step (constant difference). Exponential MULTIPLIES by the same amount per step (constant ratio).',
        'Linear is fast at first, exponential is slow at first — but exponential always wins eventually.',
        'Real examples: compound interest (growth), radioactive decay (decay), population growth, viral spread.',
      ],
      vocabulary: [
        { term: 'exponential function', definition: 'y = a · bˣ — variable in the exponent.' },
        { term: 'growth factor', definition: 'b > 1 — multiplied per step, makes y bigger.' },
        { term: 'decay factor', definition: '0 < b < 1 — multiplied per step, makes y smaller.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-growth',
      kind: 'worked_example',
      problem: 'A bacteria colony starts with 50 cells and doubles every hour. Write the function for population P after t hours, then find P at t = 5.',
      steps: [
        'Identify a (starting value): 50.',
        'Identify b (factor per step): 2 (doubles).',
        'Function: P = 50 · 2ᵗ.',
        'Evaluate at t = 5: P = 50 · 2⁵ = 50 · 32 = 1600.',
      ],
      answer: 'P = 50 · 2^t; P(5) = 1600',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-decay',
      kind: 'worked_example',
      problem: 'A car worth $20,000 loses 15% of its value each year. Write the function for value V after t years.',
      steps: [
        'Starting value a = 20000.',
        'Each year, the car KEEPS (100% − 15%) = 85% = 0.85 of its value. So b = 0.85.',
        'Function: V = 20000 · (0.85)ᵗ.',
        'b is between 0 and 1 — decay.',
        'Sense-check t=1: 20000 × 0.85 = 17000. (Lost $3000, which is 15% of $20k.) ✓',
      ],
      answer: 'V = 20000 · (0.85)^t',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A rabbit population triples every year, starting at 8. What\'s the population after 4 years?',
      expectedAnswer: '648',
      responseFormat: 'numeric',
      hints: [
        'Tripling means b = 3.',
        'P = 8 · 3⁴.',
        '3⁴ = 81. 8 × 81 = 648.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-rate',
      kind: 'misconception_check',
      question: 'A balance grows 5% per year. Tara writes b = 0.05. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Using the percent rate alone as the factor — but the BALANCE keeps 100% AND adds 5%, so the factor is 1.05.',
          correctsTo: 'Wrong. b = 0.05 would mean the balance becomes 5% of itself each year — losing 95%. For 5% GROWTH, b = 1 + 0.05 = 1.05. For 5% DECAY, b = 1 − 0.05 = 0.95.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Exponential: y = a · bˣ. Variable in the exponent.',
        'a = starting value (y at x = 0). b = factor per step.',
        'b > 1 = growth. 0 < b < 1 = decay.',
        'Linear ADDS per step; exponential MULTIPLIES per step.',
        'For r% growth: b = 1 + r. For r% decay: b = 1 − r. (r as a decimal.)',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A drug breaks down at 20% per hour. Starting with 200 mg, how much remains after 3 hours?',
      hint: 'b = 0.80 (keeps 80% per hour). y = 200 · (0.8)³ = 200 · 0.512 = 102.4 mg.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
