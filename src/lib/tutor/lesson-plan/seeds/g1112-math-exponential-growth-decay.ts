/**
 * Grades 11-12 Math — Exponential Growth and Decay.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_EXPONENTIAL_GROWTH_DECAY: LessonPlan = {
  id: 'evelyn.g1112.math.exponential.growth-decay.v1',
  title: 'Exponential Growth and Decay — Modeling',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'logarithms-exponentials',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.exponential.growth-decay',
      description: 'Build and analyse exponential models for growth, decay, half-life, and continuous compounding using y = a·bᵗ and y = a·eᵏᵗ.',
      standard: 'CCSS.MATH.CONTENT.HSF.LE.A.1c',
    },
  ],
  prerequisites: ['g1112.math.log.equations'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Population, money, radioactivity — many real-world quantities grow or shrink in proportion to their current size, which is exactly what exponential models capture.',
      script: 'Bacteria populations double every 30 minutes. Radioactive isotopes lose half their mass every half-life. Compound interest grows a fund. All of these are described by y = a · bᵗ — a starting value times a growth factor raised to time. Today: how to set up the model, find the parameters, and use it to predict.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-growth-decay',
      kind: 'concept',
      goal: 'Two model forms, identifying parameters from data, half-life, continuous compounding (e), solving for time.',
      keyIdeas: [
        'DISCRETE form: y(t) = a · bᵗ.',
        '  a = initial value (at t = 0).',
        '  b = growth factor per unit time. b > 1 = growth; 0 < b < 1 = decay.',
        '  Percent change per unit: if b = 1.05, growth = 5% per unit time. If b = 0.8, decay = 20% per unit.',
        'CONTINUOUS form (using base e): y(t) = a · eᵏᵗ.',
        '  k > 0 = growth; k < 0 = decay.',
        '  Continuous models arise from differential equations dy/dt = k·y (rate proportional to current size).',
        'CONVERSION: a · bᵗ = a · e^(t ln b). So k = ln b.',
        'HALF-LIFE T₁/₂: time for the quantity to halve. For decay y = a · e^(−kt), half-life satisfies a/2 = a·e^(−k T₁/₂), giving T₁/₂ = ln(2)/k.',
        'DOUBLING TIME T_d: time to double. T_d = ln(2)/k for growth.',
        'COMPOUND INTEREST formulas:',
        '  Discrete: A = P(1 + r/n)^(nt).  (P = principal, r = annual rate, n = compounds per year, t = years.)',
        '  Continuous: A = Pe^(rt).',
        'TO FIND k OR b FROM TWO POINTS: plug both points into the model, divide to eliminate a, solve for k.',
        'TO SOLVE FOR TIME t when the equation has t in the exponent: take log of both sides, isolate t.',
      ],
      vocabulary: [
        { term: 'half-life', definition: 'the time required for a quantity undergoing exponential decay to reduce to half its initial value; T₁/₂ = ln(2)/k.' },
        { term: 'continuous compounding', definition: 'compounding done at every instant; uses A = Pe^(rt) instead of discrete formulas.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Carbon-14 has a half-life of 5730 years. A bone fragment shows 25% of its original C-14 remaining. Estimate its age.',
      steps: [
        'Model: y(t) = a · e^(−kt), where t in years.',
        'Find k from half-life. T₁/₂ = ln(2)/k ⟹ k = ln(2)/5730 ≈ 0.0001210 per year.',
        'Set up: 25% remaining means y(t) = 0.25 a.',
        '0.25a = a · e^(−kt) ⟹ 0.25 = e^(−kt).',
        'Take ln: ln(0.25) = −kt.',
        'ln(0.25) = ln(1/4) = −ln 4 = −2 ln 2 ≈ −1.386.',
        't = 1.386 / 0.0001210 ≈ 11,460 years.',
        'Sanity check: 25% remaining = 1/2 → 1/2 → 1/4 = TWO half-lives. 2 × 5730 = 11,460. ✓',
      ],
      answer: '≈ 11,460 years (two half-lives)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bacterial culture starts with 500 cells and doubles every 3 hours. How many cells are there after 10 hours?',
      expectedAnswer: 'Doubling every 3 hours means b = 2 with t in units of 3 hours. So y(t) = 500 · 2^(t/3). At t = 10: y(10) = 500 · 2^(10/3) ≈ 500 · 2^(3.333) ≈ 500 · 10.08 ≈ 5040 cells.',
      responseFormat: 'free',
      hints: [
        'Set up y = 500 · 2^(t/3) — base 2, exponent t/3 because period is 3 hours.',
        'Plug in t = 10.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-percent-vs-factor',
      kind: 'misconception_check',
      question: 'A population grows at 8% per year. A student writes y = a · 0.08ᵗ. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Uses 0.08 as the base',
          misconception: 'Confusing the percent rate with the growth factor.',
          correctsTo: '8% per year growth means MULTIPLYING by 1.08 each year (current + 8%). So b = 1.08, not 0.08. Writing 0.08 means losing 92% per year — extreme decay. The general rule: growth factor b = 1 + r (where r is the decimal rate); decay factor b = 1 − r. For 8% growth: b = 1.08. For 8% decay: b = 0.92. Always check whether the model captures growth or decay — does b > 1 or b < 1 match what you expect?',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = a·bᵗ: a = initial, b = growth factor per unit time. b > 1 grows, b < 1 decays.',
        'Continuous: y = a·eᵏᵗ. k = ln b.',
        'Half-life T₁/₂ = ln(2)/k. Doubling time T_d = ln(2)/k for growth.',
        'Percent rate r → b = 1 + r (growth) or 1 − r (decay).',
        'Solve for t by taking ln of both sides.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
