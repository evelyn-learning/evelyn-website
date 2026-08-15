/**
 * GRE Quant — Arithmetic: Fractions, Decimals, Percent.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_ARITHMETIC: LessonPlan = {
  id: 'evelyn.gre.q.arithmetic.v1',
  title: 'GRE Quant — Arithmetic Foundations',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.arithmetic',
      description: 'Fluency with fractions, decimals, percentage conversions and operations under GRE time pressure.',
      standard: 'GRE-Q-ARITHMETIC',
    },
  ],
  prerequisites: [],
  followUps: ['gre.q.number-properties'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE Quant rewards arithmetic that runs on autopilot — the time you save here funds harder questions later.',
      script: 'GRE Quant gives you ~1.75 minutes per question. Spending 30 seconds working out what 7/8 of $240 is loses time you need for word problems and data interpretation. Today we lock in the conversions, the percentage shortcuts, and the fraction tactics that compress those calculations into seconds.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-arithmetic',
      kind: 'concept',
      goal: 'Conversion table, percent shortcuts, fraction tactics.',
      keyIdeas: [
        'CORE EQUIVALENTS to memorise: 1/2 = 0.5 = 50%; 1/3 ≈ 0.333; 1/4 = 0.25 = 25%; 1/5 = 0.2 = 20%; 1/6 ≈ 0.167; 1/8 = 0.125 = 12.5%; 1/10 = 0.1 = 10%; 3/8 = 0.375; 5/8 = 0.625; 7/8 = 0.875.',
        'PERCENT TO DECIMAL: divide by 100 (move decimal two places left). Decimal to percent: multiply by 100.',
        'PERCENT OF: "X percent of Y" = (X/100)·Y. "20% of 60" = 0.2·60 = 12.',
        'PERCENT CHANGE: ((new − old)/old) × 100%. Negative if decrease.',
        'SUCCESSIVE PERCENT: 20% off then 10% off is NOT 30% off. Multiply: 0.80 × 0.90 = 0.72 → 28% off.',
        'FRACTION ARITHMETIC: common denominator for + and −. Multiply directly. Divide by reciprocating second fraction.',
        'CROSS-MULTIPLICATION SHORTCUT: a/b vs c/d. Compare a·d vs b·c.',
        'GRE TRAP: percent OF vs percent MORE. "120% of 50" = 60. "120% more than 50" = 50 + 1.2·50 = 110.',
      ],
      vocabulary: [
        { term: 'percent change', definition: '((new − old)/old)·100%; sign indicates increase or decrease.' },
        { term: 'reciprocal', definition: '1/x; flipping numerator and denominator of a fraction.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-percent',
      kind: 'worked_example',
      problem: 'A laptop priced $1200 is discounted 25%, then a sales tax of 8% is applied. What is the final price?',
      steps: [
        'Discount step: 25% off means pay 75% of $1200. New price = 0.75 × 1200 = $900.',
        'Tax step: 8% added means multiply by 1.08. Final = 900 × 1.08 = $972.',
        'Combined factor: 0.75 × 1.08 = 0.81. So final = 0.81 × 1200 = $972.',
        'CHECK: 25% of 1200 = 300, so discounted = 900. 8% of 900 = 72, so tax adds 72. Final 972. ✓',
      ],
      answer: '$972',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A jacket\'s price increased by 20%, then decreased by 20%. Compared to the original, what is the net percent change?',
      expectedAnswer: '4% decrease',
      responseFormat: 'free',
      hints: [
        'Multiply factors: 1.20 × 0.80.',
        '1.20 × 0.80 = 0.96.',
        '0.96 means 96% of original → 4% decrease.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-additive',
      kind: 'misconception_check',
      question: 'Successive percent changes of +30% and then −30%. A student says net change is 0%. Correct?',
      commonErrors: [
        {
          answer: 'Net change is 0',
          misconception: 'Adding successive percentages instead of multiplying their factors.',
          correctsTo: 'Multiplicatively: 1.30 × 0.70 = 0.91. So 91% of original → 9% net DECREASE. Successive percentage changes never simply add. Mnemonic: 50% gain followed by 50% loss = 1.5·0.5 = 0.75 → 25% loss, not 0%. Always convert to multiplicative factors.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Memorise core fraction-decimal-percent equivalents.',
        'Successive percent changes: multiply factors, never add.',
        'Percent change = (new − old)/old × 100%.',
        'Percent OF vs percent MORE THAN: different operations.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What single percent decrease is equivalent to two successive 10% decreases?',
      hint: 'Combined factor 0.9 × 0.9 = 0.81 → 19% decrease. Note 19% < 20% — successive % decreases compound to LESS than the sum.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
