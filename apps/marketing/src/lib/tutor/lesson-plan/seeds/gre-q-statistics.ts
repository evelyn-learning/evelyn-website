/**
 * GRE Quant — Statistics: Mean, Median, SD, Quartiles.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_STATISTICS: LessonPlan = {
  id: 'evelyn.gre.q.statistics.v1',
  title: 'GRE Quant — Statistics',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.statistics',
      description: 'Compute mean, median, mode, range, standard deviation, and quartiles; reason about how summary statistics shift under transformations.',
      standard: 'GRE-Q-STATS',
    },
  ],
  prerequisites: ['gre.q.data-interpretation'],
  followUps: ['gre.q.probability-counting'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Statistics on GRE rarely requires calculation — usually comparison and reasoning about how stats shift.',
      script: '"If 5 is added to every value in a set, what happens to the median?" "Which set has the smaller standard deviation?" These reasoning questions reward fluency with the definitions and transformation rules over arithmetic.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-stats',
      kind: 'concept',
      goal: 'Definitions + the transformation rules + intuition for SD.',
      keyIdeas: [
        'MEAN x̄ = (Σxᵢ)/n. Sensitive to outliers.',
        'MEDIAN: middle value of sorted data (or average of two middles for even n). Robust.',
        'MODE: most common value. Multimodal possible.',
        'RANGE: max − min.',
        'QUARTILES: Q1 (25%), Q2 (median), Q3 (75%). IQR = Q3 − Q1.',
        'STANDARD DEVIATION σ: spread around mean. σ² = Σ(xᵢ − x̄)²/n. SD has same units as data.',
        'TRANSFORMATIONS: y = ax + b → mean(y) = a·mean(x) + b. SD(y) = |a|·SD(x). Adding constant doesn\'t affect spread.',
        'INTUITION: SD ≈ "typical distance from the mean". Larger SD → more spread out.',
        'GRE TRAP: which has larger SD: {1, 2, 3, 4, 5} or {2, 2, 3, 4, 4}? First — wider range = more spread.',
      ],
      vocabulary: [
        { term: 'standard deviation', definition: 'a measure of spread; root-mean-square distance from the mean.' },
        { term: 'IQR', definition: 'interquartile range: Q3 − Q1, measuring spread of the middle 50%.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mean',
      kind: 'worked_example',
      problem: 'The mean of 5 numbers is 12. If a 6th number is added and the new mean is 13, what is the 6th number?',
      steps: [
        'Original total: 5·12 = 60.',
        'New total (6 numbers, mean 13): 6·13 = 78.',
        '6th number = 78 − 60 = 18.',
      ],
      answer: '18',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For the data {3, 7, 8, 10, 12}, find median and range.',
      expectedAnswer: 'Median = 8; range = 9',
      responseFormat: 'free',
      hints: [
        'Already sorted; middle value is 8.',
        'Range = max − min = 12 − 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sd-shift',
      kind: 'misconception_check',
      question: 'A dataset has SD 4. We add 100 to every value. New SD?',
      commonErrors: [
        {
          answer: 'SD = 104',
          misconception: 'Treating SD like the mean — both shift by 100.',
          correctsTo: 'Adding a constant SHIFTS but does NOT spread out the data. Each (xᵢ − x̄) is unchanged. So SD remains 4. Only multiplying by a constant a changes SD by a factor |a|.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean: sum/count. Median: middle (sorted). Mode: most common.',
        'Range = max − min. IQR = Q3 − Q1.',
        'Adding constant shifts mean, doesn\'t affect SD. Multiplying by a scales both.',
        'For GRE, sum reasoning = (mean × count).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 10-value data set has mean 50 and SD 8. Each value is multiplied by 3 and then 5 is subtracted. New mean and SD?',
      hint: 'New mean = 3·50 − 5 = 145. New SD = |3|·8 = 24 (the −5 doesn\'t affect spread).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
