/**
 * AP Micro — Elasticity.
 *
 * Price elasticity of demand and supply, total revenue, determinants.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MICRO_ELASTICITY: LessonPlan = {
  id: 'evelyn.ap.micro.elasticity.v1',
  title: 'Elasticity of Demand and Supply',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'ap-microeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmicro.elasticity',
      description: 'Compute price elasticity of demand and supply, classify as elastic / inelastic / unit-elastic, and predict total revenue effects of a price change.',
      standard: 'AP-MICRO-2',
    },
  ],
  prerequisites: ['apmicro.supply-demand'],
  followUps: ['apmicro.market-structures'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why a 10% price hike is fine for some products and disastrous for others.',
      script: 'A coffee shop raises prices 10%. A car dealer raises prices 10%. The coffee shop barely loses customers — people grumble and pay. The car dealer\'s sales tank. Same price change, very different outcomes. The reason is elasticity: how responsive customers are to price. It\'s the single most important number in pricing strategy.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-elasticity',
      kind: 'concept',
      goal: 'Define elasticity, classify, link to total revenue.',
      keyIdeas: [
        'PRICE ELASTICITY OF DEMAND: % change in quantity demanded ÷ % change in price. Always negative for normal goods, but we usually take ABSOLUTE VALUE.',
        'CLASSIFICATION: |E_d| > 1 ELASTIC (responsive — luxuries, items with substitutes). |E_d| < 1 INELASTIC (insensitive — necessities, no substitutes). |E_d| = 1 UNIT ELASTIC.',
        'PERFECTLY ELASTIC = ∞ (horizontal demand curve, can\'t raise price at all). PERFECTLY INELASTIC = 0 (vertical, price doesn\'t affect quantity).',
        'DETERMINANTS of elasticity: (1) substitutes available — more subs → more elastic. (2) necessity vs luxury — luxuries more elastic. (3) % of income spent — bigger share → more elastic. (4) time — longer time → more elastic (people adjust).',
        'TOTAL REVENUE TEST: TR = P × Q. ELASTIC: price up → revenue DOWN (qty drops more than price rises). INELASTIC: price up → revenue UP (qty drops less than price rises). UNIT ELASTIC: revenue unchanged.',
        'PRICE ELASTICITY OF SUPPLY: % change in quantity supplied ÷ % change in price. Determinants: time (more time → more elastic), production flexibility, inventory.',
        'INCOME ELASTICITY: % change in qty / % change in income. Positive = NORMAL good. Negative = INFERIOR good. >1 = LUXURY.',
        'CROSS-PRICE ELASTICITY: % change in qty of A / % change in price of B. Positive = SUBSTITUTES. Negative = COMPLEMENTS.',
      ],
      vocabulary: [
        { term: 'elastic demand', definition: 'demand that changes by more than 1% for a 1% price change.' },
        { term: 'inelastic demand', definition: 'demand that changes by less than 1% for a 1% price change.' },
        { term: 'inferior good', definition: 'a good whose demand falls as income rises.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-coffee',
      kind: 'worked_example',
      problem: 'A coffee shop raises prices from $4 to $5 (a 25% increase). Quantity sold drops from 100 to 90 cups. Compute price elasticity of demand and predict the effect on total revenue.',
      steps: [
        '% change in Q: (90 − 100) / 100 = −10%.',
        '% change in P: (5 − 4) / 4 = +25%.',
        '|E_d| = |−10% / 25%| = 0.4. INELASTIC.',
        'TR before: 4 × 100 = 400. TR after: 5 × 90 = 450. Revenue UP by 50.',
        'PREDICTION CHECK: inelastic + price up → revenue up. ✓',
        'INTUITION: customers don\'t have many close substitutes (loyal regulars, location). They mostly absorb the price increase.',
      ],
      answer: '|E_d| = 0.4 (inelastic). Revenue rises from $400 to $450.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Demand for cigarettes is highly inelastic. If a government raises taxes (passing the cost onto consumers), what happens to cigarette companies\' revenue?',
      expectedAnswer: 'Revenue rises (or barely falls), because inelastic demand means consumers buy almost the same quantity at the higher price. This is why governments tax inelastic goods — high revenue, predictable.',
      responseFormat: 'free',
      hints: [
        'Inelastic + price up → revenue ?',
        'Smokers don\'t quit easily over a price change.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-elasticity-slope',
      kind: 'misconception_check',
      question: 'Is elasticity the same as the slope of the demand curve?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing elasticity with slope.',
          correctsTo: 'No. Slope is in absolute units (e.g. dollars per unit); elasticity is in percentages. The same straight-line demand curve has DIFFERENT elasticities at different points: more elastic at high prices, less at low prices. Slope is constant on a line; elasticity is not. The exam loves to trap students who treat them as equivalent.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '|E_d| > 1 elastic, < 1 inelastic. Use absolute value.',
        'Elastic + price up → revenue down. Inelastic + price up → revenue up.',
        'Determinants: substitutes, necessity, % of income, time.',
        'Income elasticity: +/− tells normal vs inferior. Cross-price: +/− tells substitutes vs complements.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is demand for a specific brand (e.g. Coke) much MORE elastic than demand for the entire category (soda)?',
      hint: 'For Coke, Pepsi is a near-perfect substitute. For "soda" overall, there are fewer obvious substitutes (water? juice?). Substitution at the brand level is easier than at the category level. Same logic: demand for "fast food" is more inelastic than demand for McDonald\'s specifically.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
