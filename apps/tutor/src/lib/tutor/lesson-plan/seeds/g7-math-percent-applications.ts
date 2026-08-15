/**
 * G7 — Percent applications: tip, tax, discount, simple interest.
 *
 * Real-world percent problems. Builds on G6 percent intro.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_PERCENT_APPLICATIONS: LessonPlan = {
  id: 'evelyn.g7.math.percents.applications.v1',
  title: 'Percent applications: tip, tax, discount, interest',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'percents',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.rp.a.3',
      description: 'Use proportional relationships to solve multistep ratio and percent problems (tax, tips, markups, discounts, simple interest).',
      standard: 'CCSS.MATH.CONTENT.7.RP.A.3',
    },
  ],
  prerequisites: ['ccss.math.6.rp.a.3.c'],
  followUps: ['ccss.math.8.f.b.4'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tie percents to money — tipping, sales, paying tax.',
      script: 'You go out to dinner. The bill is $40. The waiter was great — 20% tip. Then there\'s 8% tax. How much do you actually pay? This is real-world percent math.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-percent-ops',
      kind: 'concept',
      goal: 'Master four common percent applications.',
      keyIdeas: [
        'CONVERTING % TO DECIMAL: divide by 100. 25% = 0.25, 8% = 0.08.',
        'PERCENT OF A NUMBER: multiply. "20% of $40" = 0.20 × 40 = $8.',
        'TIP: tip = bill × tip%. Total = bill + tip.',
        'SALES TAX: tax = price × tax%. Total = price + tax.',
        'DISCOUNT: discount = original × discount%. Sale price = original − discount. (OR: sale price = original × (1 − discount%).)',
        'SIMPLE INTEREST: I = P · r · t. P = principal (amount borrowed/saved), r = annual rate as decimal, t = time in years.',
        'COMMISSION: commission = sales × commission%. (Same math as tip.)',
      ],
      vocabulary: [
        { term: 'principal', definition: 'the original amount of money borrowed or invested.' },
        { term: 'simple interest', definition: 'interest computed only on the principal: I = P·r·t.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-tip-tax',
      kind: 'worked_example',
      problem: 'Bill is $40. Add 20% tip and 8% tax. Total?',
      steps: [
        'Tip: 20% of 40 = 0.20 × 40 = $8.',
        'Tax: 8% of 40 = 0.08 × 40 = $3.20.',
        'Total = 40 + 8 + 3.20 = $51.20.',
      ],
      answer: '$51.20',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-discount',
      kind: 'worked_example',
      problem: 'A jacket costs $80. It\'s 25% off. What\'s the sale price?',
      steps: [
        'Discount = 25% of 80 = 0.25 × 80 = $20.',
        'Sale price = 80 − 20 = $60.',
        'Or shortcut: sale price = 80 × (1 − 0.25) = 80 × 0.75 = $60.',
      ],
      answer: '$60',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You deposit $500 in a savings account at 3% simple interest. How much interest do you earn in 2 years?',
      expectedAnswer: '30',
      responseFormat: 'numeric',
      hints: [
        'I = P · r · t.',
        'P = 500, r = 0.03 (NOT 3 — convert to decimal!), t = 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-twice',
      kind: 'misconception_check',
      question: 'A shirt is $50, 20% off, then 10% off again. Is that the same as 30% off?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Adding successive percent discounts.',
          correctsTo: 'No — discounts compound. After 20% off: $40. Take 10% off $40: $4 off → $36. But 30% off $50 would be $35. So sequential is LESS savings ($36) than 30% off ($35).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Convert % to decimal first (divide by 100).',
        'Tip / tax / commission: amount × rate, then add.',
        'Discount: original × rate, then subtract (or use × (1 − rate)).',
        'Simple interest: I = P · r · t.',
        'Successive discounts compound — they\'re not additive.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A store advertises "buy one, get one 50% off". What\'s the average discount per item?',
      hint: 'Two items at $20 each = $40 normally. With deal: $20 + $10 = $30. Saved $10 out of $40 = 25%. So averaged 25% off per item.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
