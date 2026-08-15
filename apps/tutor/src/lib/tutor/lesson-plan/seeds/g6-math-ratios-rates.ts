/**
 * G6 — Ratios, rates, and unit rate.
 *
 * Two new ways to compare quantities. RATIOS compare two amounts of
 * the same kind (3 cups flour to 1 cup sugar). RATES compare two
 * different kinds (60 miles per 1 hour). UNIT RATE = the rate when
 * the second quantity is 1. Foundation for proportions, percent,
 * slope, and most of pre-algebra.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_RATIOS_RATES: LessonPlan = {
  id: 'evelyn.g6.math.ratios-rates.v1',
  title: 'Ratios, Rates, and Unit Rate',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'ratios',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.rp.a.1',
      description: 'Understand the concept of a ratio and use ratio language.',
      standard: 'CCSS.MATH.CONTENT.6.RP.A.1',
    },
    {
      id: 'ccss.math.6.rp.a.2',
      description: 'Understand unit rate associated with a ratio a:b (b ≠ 0).',
      standard: 'CCSS.MATH.CONTENT.6.RP.A.2',
    },
  ],
  prerequisites: ['ccss.math.5.nf.b.4'],
  followUps: ['ccss.math.7.rp.a.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a price comparison to motivate the unit-rate idea.',
      script: 'Two grocery stores. Store A sells 6 apples for $3. Store B sells 8 apples for $5. Which is cheaper per apple? Both numbers look pretty close — but to compare fairly, we need the price for ONE apple. That\'s a unit rate, and it makes comparisons honest.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ratio-vs-rate',
      kind: 'concept',
      goal: 'Distinguish ratio (same kind) vs rate (different kinds), and define unit rate.',
      keyIdeas: [
        'A RATIO compares two quantities of the SAME KIND. "3 cups flour to 1 cup sugar" — both are cups.',
        'A RATE compares two quantities of DIFFERENT KINDS. "60 miles per 1 hour" — miles and hours.',
        'Both can be written as a:b, "a to b", or as the fraction a/b.',
        'A UNIT RATE is a rate where the second quantity is 1. "Per 1 hour", "per 1 apple", "per 1 dollar".',
        'To get the unit rate from a:b, divide both sides by b: a/b "per 1".',
        'Equivalent ratios: 6:3 = 2:1 = 4:2. Multiplying or dividing both sides by the same number preserves the ratio.',
      ],
      vocabulary: [
        { term: 'ratio', definition: 'a comparison of two quantities of the same kind.' },
        { term: 'rate', definition: 'a comparison of two quantities of different kinds.' },
        { term: 'unit rate', definition: 'a rate per 1 of the second quantity.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-unit-rate',
      kind: 'worked_example',
      problem: 'Find the unit rate: 6 apples for $3.',
      steps: [
        'Set up: 6 apples to $3 dollars. We want the price per 1 apple.',
        'Divide both sides by 6 (the number of apples): 6 ÷ 6 = 1 apple. $3 ÷ 6 = $0.50.',
        'Unit rate: $0.50 per 1 apple — or 50¢ per apple.',
        'Now compare to Store B (8 apples for $5): $5 ÷ 8 = $0.625 per apple.',
        'Store A ($0.50/apple) is cheaper than Store B ($0.625/apple).',
      ],
      answer: '$0.50 per apple',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A car travels 240 miles on 8 gallons of gas. What is the car\'s gas mileage in miles per gallon?',
      expectedAnswer: '30',
      responseFormat: 'numeric',
      hints: [
        'Per gallon means divide by 8.',
        '240 ÷ 8 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flip',
      kind: 'misconception_check',
      question: 'A recipe says "2 cups flour for every 3 cups water." Sam writes the ratio as 3:2. Right?',
      commonErrors: [
        {
          answer: 'yes, ratios can go either way',
          misconception: 'Treating ratios as commutative — order doesn\'t matter.',
          correctsTo: 'Wrong. Ratio order matters. "Flour to water" is 2:3, not 3:2. The reverse means a different recipe (more flour than water, not the other way).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ratio: same kind. Rate: different kinds.',
        'Unit rate: per 1. Divide both sides by the second number.',
        'Order matters: 2:3 is NOT the same as 3:2.',
        'Equivalent ratios: multiply or divide both sides by the same number.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A printer prints 30 pages in 5 minutes. How many pages can it print in 12 minutes?',
      hint: 'Unit rate first: 30 ÷ 5 = 6 pages per minute. Then × 12 = 72 pages.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
