/**
 * G6 — Percent (as ratio per 100, conversions, percent of a number).
 *
 * Percent is a special unit rate: per 100. The %-decimal-fraction
 * triangle (50% = 0.5 = 1/2) is the bedrock; tipping, discounts, and
 * tax are all the same operation. Anchored on real-world dollar
 * scenarios because percent is mostly a money tool for students.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_PERCENT: LessonPlan = {
  id: 'evelyn.g6.math.percent.v1',
  title: 'Percent',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'percent',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.rp.a.3.c',
      description: 'Find a percent of a quantity as a rate per 100.',
      standard: 'CCSS.MATH.CONTENT.6.RP.A.3.C',
    },
  ],
  prerequisites: ['ccss.math.6.rp.a.1', 'ccss.math.5.nbt.b.7'],
  followUps: ['ccss.math.7.rp.a.3'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a 20%-off sale to make percent practical.',
      script: 'A jacket costs $50. The store says "20% off!" How much do you actually pay? You need to figure out 20% of $50, then subtract. Percent isn\'t magic — it\'s just a fraction with a hidden 100.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-percent',
      kind: 'concept',
      goal: 'Percent = "per hundred". Convert freely between percent, decimal, and fraction.',
      keyIdeas: [
        'PERCENT means "per 100". The symbol % literally means "/100".',
        '50% = 50/100 = 1/2 = 0.5. Same number, three names.',
        'To convert PERCENT → DECIMAL: divide by 100 (or shift the decimal 2 places left). 25% = 0.25. 7% = 0.07.',
        'To convert DECIMAL → PERCENT: multiply by 100 (shift decimal 2 places right). 0.6 = 60%. 0.04 = 4%.',
        'To find "X% of Y": convert X% to a decimal, then multiply by Y. 20% of 50 = 0.20 × 50 = 10.',
        '100% = 1 (the whole). 200% = 2 (twice as much). Percent ABOVE 100 means MORE than the original.',
      ],
      vocabulary: [
        { term: 'percent', definition: 'a rate per 100; a fraction with denominator 100.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-discount',
      kind: 'worked_example',
      problem: 'Find 20% of $50.',
      steps: [
        'Convert 20% to decimal: 20 ÷ 100 = 0.20.',
        'Multiply by the whole: 0.20 × 50 = 10.',
        'So 20% of $50 = $10.',
        'For the discounted price: $50 - $10 = $40.',
      ],
      answer: '$10 (jacket costs $40 after discount)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-conversion',
      kind: 'worked_example',
      problem: 'Convert 0.35 to a percent. Convert 7% to a decimal.',
      steps: [
        '0.35 → percent: shift decimal 2 right → 35%.',
        '7% → decimal: shift decimal 2 left → 0.07. (Pad with a zero — 7% is 0.07, not 0.7.)',
        'Quick check: 7% should be a small number, less than 0.1. 0.07 fits. 0.7 would be 70%.',
      ],
      answer: '0.35 = 35%; 7% = 0.07',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A waiter\'s tip is 15% of the bill. The bill is $40. How much is the tip?',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: [
        '15% as a decimal is 0.15.',
        '0.15 × 40 = ?',
        'Or: 10% of 40 is 4, 5% is half of that = 2. 4 + 2 = 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-magnitude',
      kind: 'misconception_check',
      question: 'Mike sees 0.6% on a bank statement and thinks it means 60% of his money. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the digit string in front of % as a decimal already.',
          correctsTo: 'No. 0.6% literally means 0.6 per 100, which is 0.006 as a decimal — six tenths of one percent. Less than 1%. To convert to decimal: 0.6 ÷ 100 = 0.006. (60% would be 60/100 = 0.6.) Sense-check: a 0.6% interest rate is tiny, not 60%.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent = per 100. The % symbol means "/100".',
        'To find X% of Y: convert X% to decimal (divide by 100), then multiply by Y.',
        'Convert percent ↔ decimal by shifting the decimal 2 places.',
        '100% = 1 (the whole). Above 100% = more than the whole.',
        'Sense-check: a small percent should give a small piece.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A shirt costs $30. Sales tax is 8%. What is the total cost?',
      hint: 'Tax = 0.08 × 30 = $2.40. Total = $30 + $2.40 = $32.40. Or: total = 1.08 × 30 in one step.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
