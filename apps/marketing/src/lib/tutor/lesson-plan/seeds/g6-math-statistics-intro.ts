/**
 * G6 — Statistics intro: mean, median, mode, range.
 *
 * Four ways to summarize a data set. When each measure is best.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_STATISTICS_INTRO: LessonPlan = {
  id: 'evelyn.g6.math.statistics.intro.v1',
  title: 'Mean, median, mode, range',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.sp.b.5.c',
      description: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation).',
      standard: 'CCSS.MATH.CONTENT.6.SP.B.5.C',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.math.7.sp.a.1'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "average" is not just one thing.',
      script: 'You hear "average score". Average can mean different things — three different things, actually. Today we\'ll learn all three: mean, median, mode. Plus range to show how spread out the data is.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-measures',
      kind: 'concept',
      goal: 'Compute and choose between mean, median, mode, range.',
      keyIdeas: [
        'MEAN (arithmetic average): add all values, divide by how many. Sensitive to OUTLIERS.',
        'MEDIAN: the MIDDLE value when sorted. (Or average of two middles if even count.) NOT affected by outliers.',
        'MODE: the value that appears MOST often. There can be one mode, multiple modes, or no mode.',
        'RANGE: largest − smallest. Shows SPREAD, not center.',
        'WHICH TO USE? MEAN works for most clean numerical data. MEDIAN better when there are extreme values (a billionaire skews the mean income of a town). MODE for categorical data (most common shoe size, most popular color).',
      ],
      vocabulary: [
        { term: 'mean', definition: 'the arithmetic average — sum divided by count.' },
        { term: 'median', definition: 'the middle value when data is sorted.' },
        { term: 'mode', definition: 'the most frequent value in a data set.' },
        { term: 'range', definition: 'the difference between largest and smallest values.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-all-four',
      kind: 'worked_example',
      problem: 'Test scores: 70, 80, 80, 90, 100. Find mean, median, mode, range.',
      steps: [
        'MEAN: (70+80+80+90+100)/5 = 420/5 = 84.',
        'MEDIAN: sorted already: 70, 80, 80, 90, 100. Middle (3rd of 5) = 80.',
        'MODE: 80 appears twice; others once. Mode = 80.',
        'RANGE: 100 − 70 = 30.',
      ],
      answer: 'mean=84, median=80, mode=80, range=30',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the median of: 12, 5, 8, 15, 9, 6, 11.',
      expectedAnswer: '9',
      responseFormat: 'numeric',
      hints: [
        'First SORT: 5, 6, 8, 9, 11, 12, 15.',
        'Middle (4th of 7) = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mean-always-best',
      kind: 'misconception_check',
      question: 'In a town where one billionaire lives among 99 average earners, is the MEAN income a good summary?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Trusting mean even with extreme outliers.',
          correctsTo: 'No — the billionaire SKEWS the mean way up. Mean income might be $1M while almost everyone earns $50K. MEDIAN is more honest here — it shows the middle person\'s income, ignoring the outlier.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean = sum / count. Sensitive to outliers.',
        'Median = middle (sort first). Resistant to outliers.',
        'Mode = most frequent. Good for categories.',
        'Range = max − min. Shows spread.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When is MODE the only useful measure?',
      hint: 'For categorical data — favorite color, shoe size, most-streamed song. You can\'t average colors or take their median, but you CAN find the most common.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
