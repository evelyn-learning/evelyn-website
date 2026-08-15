/**
 * GCSE Math Higher — Cumulative Frequency, Box Plots, IQR.
 * Reading cumulative frequency curves, finding median and quartiles,
 * constructing box plots, comparing distributions.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_CUMULATIVE_FREQ: LessonPlan = {
  id: 'evelyn.gcse.math.cumulative-freq.v1',
  title: 'GCSE Higher — Cumulative Frequency & Box Plots',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.cumulative-freq',
      description: 'Construct and read cumulative frequency curves; find median, quartiles, IQR; compare distributions using box plots.',
      standard: 'GCSE-MATH-S2/S4',
    },
  ],
  prerequisites: [],
  followUps: ['gcse.math.histograms'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Cumulative frequency lets you read off the median and quartiles directly from a graph — no formulas needed.',
      script: 'Given a list of 200 numbers, finding the median by hand is tedious. But plot a cumulative frequency curve and the median is just where the curve hits the 100th value — read straight off the x-axis. Box plots then turn that information into a comparison tool.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cumfreq',
      kind: 'concept',
      goal: 'How cumulative frequency works, plus median, IQR, box-plot construction and comparison.',
      keyIdeas: [
        'CUMULATIVE FREQUENCY = running total of frequencies. For grouped data, plot cumulative frequency against the UPPER class boundary.',
        'CURVE SHAPE: always non-decreasing (it sums up). S-shape is typical for normal-like data; steeper middle = more data clustered.',
        'MEDIAN at n/2 of total. Q1 (lower quartile) at n/4. Q3 (upper quartile) at 3n/4. Read x-coordinate where the curve passes through these heights.',
        'IQR (interquartile range) = Q3 − Q1. Measures spread of MIDDLE 50% — robust to outliers.',
        'BOX PLOT components: minimum, Q1, median, Q3, maximum. Box from Q1 to Q3 with median line; whiskers to min and max.',
        'OUTLIERS: a value beyond Q1 − 1.5·IQR or Q3 + 1.5·IQR is often classed as an outlier. (GCSE rarely tests outlier rule directly but examiners do mention them.)',
        'COMPARING DISTRIBUTIONS: use TWO measures — average (median) and spread (IQR). Always discuss both. "Distribution A has higher median (location) and smaller IQR (less variation) than B."',
      ],
      vocabulary: [
        { term: 'quartile', definition: 'a value dividing sorted data into quarters; Q1 at 25%, Q2 = median at 50%, Q3 at 75%.' },
        { term: 'interquartile range', definition: 'IQR = Q3 − Q1; a measure of spread covering the central 50% of data.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cumfreq-read',
      kind: 'worked_example',
      problem: 'A class of 60 students takes a test. The cumulative frequency curve passes through (40 marks, 15 students), (50, 30), (60, 45), (70, 60). Find the median, Q1, Q3, and IQR.',
      steps: [
        'Total n = 60.',
        'Median position = n/2 = 30. Read x where cumulative frequency = 30: from the data point (50, 30), median = 50 marks.',
        'Q1 position = n/4 = 15. From (40, 15), Q1 = 40 marks.',
        'Q3 position = 3n/4 = 45. From (60, 45), Q3 = 60 marks.',
        'IQR = Q3 − Q1 = 60 − 40 = 20 marks.',
        'INTERPRETATION: middle half of class scored between 40 and 60. Spread of 20 marks suggests moderate variability.',
      ],
      answer: 'Median = 50; Q1 = 40; Q3 = 60; IQR = 20',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A box plot shows: minimum 12, Q1 18, median 24, Q3 30, maximum 40. State the IQR and the range.',
      expectedAnswer: 'IQR = 12; range = 28',
      responseFormat: 'free',
      hints: [
        'IQR = Q3 − Q1.',
        'Range = max − min.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-comparing',
      kind: 'misconception_check',
      question: 'Class A has median 50 and IQR 30; Class B has median 45 and IQR 5. A student concludes "Class A did better because the median is higher." What\'s missing?',
      commonErrors: [
        {
          answer: '"Class A did better" — comparing only medians',
          misconception: 'Drawing a single-summary conclusion when the spread tells a competing story.',
          correctsTo: 'Better is multidimensional. A typical Class A student scored higher (median 50 vs 45), but Class A is far more variable (IQR 30 vs 5) — meaning many A students scored worse than typical B students, AND many scored better. B is more consistent. A complete answer always cites BOTH location AND spread: "Class A has a higher median, suggesting better central performance, but a larger IQR shows more variability — Class B was more consistent."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cumulative frequency plotted at UPPER class boundaries.',
        'Median at n/2; Q1 at n/4; Q3 at 3n/4 — read x-coordinate from the curve.',
        'IQR = Q3 − Q1; measures middle-50% spread.',
        'Box plot: min, Q1, median, Q3, max.',
        'Compare distributions with BOTH a location measure AND a spread measure, in context.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A box plot has Q1 = 15, Q3 = 25, max = 50. Using the 1.5·IQR rule, is the maximum an outlier?',
      hint: 'IQR = 25 − 15 = 10. Outlier threshold = Q3 + 1.5·IQR = 25 + 15 = 40. Maximum 50 > 40 → yes, the maximum is an outlier by the 1.5·IQR rule. Some box plots omit outliers from the whisker, marking them as separate dots.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
