/**
 * G11 — Statistics: Descriptive statistics (center, spread, shape).
 *
 * The first step of any data analysis. Measures of CENTER (mean,
 * median, mode), measures of SPREAD (range, IQR, standard deviation),
 * and SHAPE of a distribution (symmetric, skewed, bimodal).
 * Recognizing when each measure is appropriate.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_STATS_DESCRIPTIVE: LessonPlan = {
  id: 'evelyn.g11.math.stats.descriptive.v1',
  title: 'Descriptive Statistics: Center, Spread, Shape',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hss.id.a.2',
      description: 'Use statistics appropriate to the shape of the data distribution to compare center and spread.',
      standard: 'CCSS.MATH.CONTENT.HSS.ID.A.2',
    },
  ],
  prerequisites: ['ccss.math.6.sp.b.5'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "average" alone is misleading.',
      script: 'A class has 10 students. Nine score 90 on a test; one scores 0. The average is 81. Is "the class scored 81" a fair description? Not really — most scored 90, and one bombed. The MEAN hides the story. To describe data well you need three things: where it\'s centered, how spread out it is, and what shape it has.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-csms',
      kind: 'concept',
      goal: 'Center, spread, shape — pick the right measure for the situation.',
      keyIdeas: [
        'CENTER — three measures:',
        '  MEAN: sum / count. Sensitive to outliers.',
        '  MEDIAN: middle value when sorted. Robust to outliers.',
        '  MODE: most-frequent value. Useful for categorical data.',
        '  Outlier present? Use median. Symmetric data? Mean and median are close.',
        'SPREAD — three measures:',
        '  RANGE: max − min. Crude but quick.',
        '  IQR (Interquartile Range): Q3 − Q1. The middle 50% of the data. Robust.',
        '  STANDARD DEVIATION (σ or s): typical distance from the mean. Sensitive to outliers.',
        'SHAPE — visual descriptions:',
        '  SYMMETRIC: data falls evenly on both sides of center (bell curve / normal).',
        '  SKEWED RIGHT: long tail on the right (income distributions). Mean > median.',
        '  SKEWED LEFT: long tail on the left (test scores when most pass). Mean < median.',
        '  BIMODAL: two peaks. Suggests two underlying groups.',
        'STRATEGY: when describing data, give CENTER + SPREAD + SHAPE. All three. Match measure to shape: skewed data → use median + IQR. Symmetric data → mean + standard deviation work fine.',
      ],
      vocabulary: [
        { term: 'mean', definition: 'sum divided by count — the arithmetic average.' },
        { term: 'median', definition: 'the middle value when data is sorted.' },
        { term: 'IQR', definition: 'Q3 - Q1; spread of the middle 50%.' },
        { term: 'standard deviation', definition: 'typical distance from the mean.' },
        { term: 'outlier', definition: 'a data point much larger or smaller than the rest.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mean-vs-median',
      kind: 'worked_example',
      problem: 'A neighborhood has incomes (in $1000s): 40, 45, 50, 50, 55, 60, 800. Find mean and median. Which is more representative?',
      steps: [
        'Sort: 40, 45, 50, 50, 55, 60, 800. Already sorted.',
        'Median: 4th value (middle of 7) = 50.',
        'Mean: sum = 40+45+50+50+55+60+800 = 1100. Mean = 1100/7 ≈ 157.',
        'The 800 is an OUTLIER — drags the mean way up.',
        'MEDIAN ($50K) is much more representative of typical income. Mean ($157K) misleads because of the one outlier.',
      ],
      answer: 'Mean ≈ 157; median = 50. Median is more representative.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-shape',
      kind: 'worked_example',
      problem: 'A histogram of household incomes shows a long right tail. What\'s the shape, and how do mean and median compare?',
      steps: [
        'Long right tail = SKEWED RIGHT (positive skew).',
        'In right-skewed data, a few very high values pull the MEAN to the right.',
        'Median is more in the bulk of the data.',
        'So MEAN > MEDIAN for right-skewed data.',
        'Standard report: "right-skewed; median better describes typical."',
      ],
      answer: 'Right-skewed; mean > median',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For data set {2, 5, 8, 11, 14}, find the standard deviation (sample, divide by n-1).',
      expectedAnswer: '~4.74',
      responseFormat: 'numeric',
      hints: [
        'Mean = 8.',
        'Squared deviations: 36, 9, 0, 9, 36. Sum = 90.',
        'Sample variance = 90/4 = 22.5. SD = √22.5 ≈ 4.74.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-mean-always',
      kind: 'misconception_check',
      question: 'Sage uses MEAN to describe the typical home price in a neighborhood with one $5M mansion. What\'s the issue?',
      commonErrors: [
        {
          answer: 'nothing — mean is the average',
          misconception: 'Defaulting to mean without considering outliers and shape.',
          correctsTo: 'The mansion outlier inflates the mean. The MEDIAN price would describe the typical home much better. With skewed data or outliers, always prefer MEDIAN.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Describe data with: center + spread + shape.',
        'Outliers / skew → use MEDIAN + IQR.',
        'Symmetric → mean + standard deviation work.',
        'Mean is sensitive; median is robust.',
        'Right skew: mean > median. Left skew: mean < median.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is income usually right-skewed instead of symmetric?',
      hint: 'There\'s a floor (income can\'t go below 0) but no ceiling. A small group of very high earners stretches the right tail. This is true for many "amount" measures: time spent, file sizes, populations.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
