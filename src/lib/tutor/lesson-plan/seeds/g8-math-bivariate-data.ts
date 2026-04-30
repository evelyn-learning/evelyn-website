/**
 * G8 — Bivariate data: scatter plots and lines of best fit.
 *
 * Two variables at once. Recognizing positive/negative/no
 * correlation. Drawing line of best fit by eye.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_BIVARIATE_DATA: LessonPlan = {
  id: 'evelyn.g8.math.statistics.bivariate-scatter.v1',
  title: 'Scatter plots and lines of best fit',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.sp.a.1',
      description: 'Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association.',
      standard: 'CCSS.MATH.CONTENT.8.SP.A.1',
    },
  ],
  prerequisites: ['ccss.math.6.sp.b.5'],
  followUps: ['ccss.math.hss-id.b.6'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show two-variable data with a relatable example.',
      script: 'You collect data on 20 students: hours studied vs test score. Plot each student as a point. The pattern shows: the more hours, the higher the score? That\'s a scatter plot — and we can see correlations at a glance.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-correlations',
      kind: 'concept',
      goal: 'Three correlation patterns + line of best fit + correlation isn\'t causation.',
      keyIdeas: [
        'BIVARIATE DATA: each data point has TWO values (x and y).',
        'SCATTER PLOT: dots in the xy-plane, one per data point.',
        'POSITIVE CORRELATION: as x increases, y tends to increase. Dots slope UP-RIGHT.',
        'NEGATIVE CORRELATION: as x increases, y tends to decrease. Dots slope DOWN-RIGHT.',
        'NO CORRELATION: dots scattered randomly, no pattern.',
        'STRENGTH: how tightly dots cluster around a line. Tight = strong; loose = weak.',
        'LINE OF BEST FIT: a line drawn through the cloud of points, minimizing the average distance. Used to PREDICT.',
        'CORRELATION ≠ CAUSATION: just because x and y move together doesn\'t mean x CAUSES y. Could be reverse, both caused by a third variable, or coincidence.',
      ],
      vocabulary: [
        { term: 'scatter plot', definition: 'a graph of bivariate data, one dot per pair.' },
        { term: 'correlation', definition: 'a tendency of two variables to vary together.' },
        { term: 'line of best fit', definition: 'a line that approximates the trend in scattered data.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'A scatter plot shows ICE CREAM SALES vs OUTDOOR TEMPERATURE — and dots clearly slope upward. What kind of correlation? Does ice cream cause warm weather?',
      steps: [
        'Pattern: slopes UP-RIGHT → POSITIVE correlation (warmer → more ice cream).',
        'Strong correlation (real causal link).',
        'But ICE CREAM doesn\'t cause WARM WEATHER. Causation runs the OTHER way: warm weather causes ice cream sales.',
        'Lesson: pattern doesn\'t tell you direction of causation. Always think about what could cause what.',
      ],
      answer: 'positive correlation; warm weather causes sales (not the other way)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A scatter plot of "hours of TV watched" vs "test scores" shows a downward slope. What kind of correlation?',
      expectedAnswer: 'negative correlation',
      responseFormat: 'free',
      hints: [
        'Dots go DOWN as x increases.',
        'More TV → lower scores.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-correlation-causation',
      kind: 'misconception_check',
      question: 'Drowning deaths and ice cream sales are POSITIVELY correlated — both rise together. Does eating ice cream CAUSE drowning?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing correlation with causation.',
          correctsTo: 'No — they correlate because of a THIRD VARIABLE: SUMMER. Hot weather drives both ice cream sales and swimming (which leads to drownings). The ice cream itself isn\'t causing anything. This is the classic "lurking variable" trap.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Scatter plot: one dot per pair.',
        'Positive: up-right. Negative: down-right. None: random.',
        'Line of best fit: trend line for prediction.',
        'CORRELATION ≠ CAUSATION. Always consider lurking variables.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How could you tell if a correlation is REAL vs RANDOM noise?',
      hint: 'More data points = more confidence. Statisticians use correlation coefficient (r) and p-values to quantify how unlikely the pattern is by chance. Strong correlations from large samples are unlikely to be random.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
