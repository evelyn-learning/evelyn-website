/**
 * IB DP Math AA — Descriptive Statistics.
 * Mean, median, mode, quartiles, variance, standard deviation;
 * effect of linear transformations.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_STATISTICS_DESCRIPTIVE: LessonPlan = {
  id: 'evelyn.ibdp.aa.statistics-descriptive.v1',
  title: 'IB DP Math AA — Descriptive Statistics',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.statistics-descriptive',
      description: 'Compute and interpret mean, median, mode, quartiles, variance, standard deviation; predict the effect of linear transformations on these summary statistics.',
      standard: 'IB-DP-MATH-AA-4.2/4.3',
    },
  ],
  prerequisites: ['ibdp.aa.vector-lines-planes'],
  followUps: ['ibdp.aa.probability'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB AA descriptive stats is fast points if you know the formulas — and the linear-transformation rules.',
      script: 'Mean and standard deviation are the two summary numbers IB AA cares about most. Knowing how they shift when you add 5 to every value, or multiply every value by 2, lets you skip recomputation entirely on transformed data.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-summary-stats',
      kind: 'concept',
      goal: 'Definitions, formulas, transformation rules.',
      keyIdeas: [
        'MEAN: x̄ = (Σxᵢ)/n. Sensitive to outliers.',
        'MEDIAN: middle value when sorted (or average of two middles). Robust to outliers.',
        'MODE: most frequent value. Multiple modes possible.',
        'QUARTILES: Q1 (25%), Q2 = median (50%), Q3 (75%). IQR = Q3 − Q1.',
        'VARIANCE σ² = (Σ(xᵢ − x̄)²)/n (population) or s² = (Σ(xᵢ − x̄)²)/(n − 1) (sample). IB AA typically uses the population formula unless specified.',
        'STANDARD DEVIATION σ = √variance. Same units as the data.',
        'LINEAR TRANSFORMATIONS: if y = ax + b, then mean(y) = a·mean(x) + b. Standard deviation: σ(y) = |a|·σ(x). Adding a constant b shifts the mean but does NOT change spread.',
        'Σx² FORMULA (alternate variance form): σ² = (Σx²)/n − x̄². Useful when given Σx and Σx² instead of raw data.',
        'GROUPED DATA: use class midpoints as x values. Mean = (Σf·midpoint)/Σf. Variance similarly with frequencies.',
      ],
      vocabulary: [
        { term: 'standard deviation', definition: 'a measure of spread; the square root of variance, in the same units as the data.' },
        { term: 'IQR', definition: 'interquartile range = Q3 − Q1; spread of the middle 50%.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-transformation',
      kind: 'worked_example',
      problem: 'A dataset has mean 12 and standard deviation 4. The data is transformed by y = 3x − 5. Find the new mean and standard deviation.',
      steps: [
        'Apply transformation rules: mean(y) = a·mean(x) + b with a = 3, b = −5.',
        'New mean = 3·12 + (−5) = 36 − 5 = 31.',
        'For SD: σ(y) = |a|·σ(x) = |3|·4 = 12. The constant −5 has no effect on spread.',
      ],
      answer: 'Mean = 31; SD = 12',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For the data set {2, 4, 4, 5, 6, 8, 9}, find the mean and median.',
      expectedAnswer: 'Mean = 38/7 ≈ 5.43; Median = 5',
      responseFormat: 'free',
      hints: [
        'Mean: sum / count.',
        '2 + 4 + 4 + 5 + 6 + 8 + 9 = 38.',
        'Sorted set has 7 values; median is the 4th.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-add-constant-sd',
      kind: 'misconception_check',
      question: 'A student adds 10 to every value in a dataset and concludes that the standard deviation also increases by 10. Why is this wrong?',
      commonErrors: [
        {
          answer: 'New SD = old SD + 10',
          misconception: 'Treating standard deviation as if it shifts with the mean.',
          correctsTo: 'Adding a constant to every value SHIFTS the entire distribution but does NOT change the spread. Each deviation (xᵢ − x̄) is unchanged because both xᵢ and x̄ shifted by the same amount. So SD stays the same. Only MULTIPLYING (scaling) by a constant a changes the SD by a factor of |a|. Mnemonic: shift moves the mean; scale stretches the spread.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean = Σx/n; affected by outliers.',
        'Median: middle value (sorted); robust to outliers.',
        'Variance σ² = Σ(x − x̄)²/n. SD σ = √variance.',
        'Linear transformation y = ax + b: mean shifts AND scales; SD only scales by |a|.',
        'Adding a constant doesn\'t change spread.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Σx = 200, Σx² = 4500, n = 10. Find the variance.',
      hint: 'Mean x̄ = 200/10 = 20. Variance = (Σx²)/n − x̄² = 4500/10 − 400 = 450 − 400 = 50.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
