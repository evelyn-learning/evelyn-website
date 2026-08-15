/**
 * G11 — Statistics: Normal distribution and the 68-95-99.7 rule.
 *
 * The bell curve. Symmetric, defined by mean and standard deviation.
 * Empirical rule: 68% within 1 SD, 95% within 2 SDs, 99.7% within 3.
 * Z-scores standardize any value to "how many SDs from the mean".
 * Used for everything from grades to height to standardized tests.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_STATS_NORMAL_DISTRIBUTION: LessonPlan = {
  id: 'evelyn.g11.math.stats.normal-distribution.v1',
  title: 'Normal Distribution and Z-Scores',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hss.id.a.4',
      description: 'Use the mean and standard deviation of a data set to fit it to a normal distribution.',
      standard: 'CCSS.MATH.CONTENT.HSS.ID.A.4',
    },
  ],
  prerequisites: ['ccss.math.hss.id.a.2'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor on the bell curve as the most common shape in nature.',
      script: 'Heights, test scores, baby weights, factory measurements — they all tend to form the same shape: a bell curve, or NORMAL DISTRIBUTION. Most values cluster around the average; fewer values appear at the extremes. There\'s a beautiful, useful rule for ANY normal distribution: 68% of values are within 1 SD, 95% within 2 SDs, 99.7% within 3.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-normal-and-z',
      kind: 'concept',
      goal: 'Bell curve properties + 68-95-99.7 rule + z-score standardization.',
      keyIdeas: [
        'A NORMAL DISTRIBUTION is symmetric and bell-shaped, fully described by its MEAN (μ) and STANDARD DEVIATION (σ).',
        'Mean = median = mode in a perfect normal.',
        'EMPIRICAL RULE (68-95-99.7):',
        '  ~68% of values fall within 1 SD of the mean.',
        '  ~95% within 2 SDs.',
        '  ~99.7% within 3 SDs.',
        'Z-SCORE = (value - mean) / standard deviation. Tells you how many SDs above or below the mean a value is.',
        '  z = +1.5 means "1.5 SDs above the mean".',
        '  z = -2 means "2 SDs below the mean".',
        '  z = 0 means "at the mean".',
        'Z-scores let you compare values from DIFFERENT distributions on the same scale (e.g. SAT vs ACT scores).',
        'In a normal distribution, the percentile of any z-score is fixed:',
        '  z = 0 → 50th percentile (the median).',
        '  z = 1 → ~84th percentile.',
        '  z = -1 → ~16th percentile.',
        '  z = 2 → ~97.5th percentile.',
        'Z-tables give the exact percentile for any z-score.',
      ],
      vocabulary: [
        { term: 'normal distribution', definition: 'a symmetric bell-shaped distribution.' },
        { term: 'z-score', definition: '(value - mean)/SD; how many SDs from the mean.' },
        { term: 'empirical rule', definition: '68% within 1 SD, 95% within 2, 99.7% within 3.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-empirical',
      kind: 'worked_example',
      problem: 'Heights of adult women are normally distributed with mean 64 inches and SD 2.5 inches. About what percent of women are between 59 and 69 inches tall?',
      steps: [
        '59 = 64 - 5 = 64 - 2(2.5) = mean - 2 SD.',
        '69 = 64 + 5 = 64 + 2(2.5) = mean + 2 SD.',
        'So 59-69 inches is "within 2 SDs of the mean."',
        'By the 68-95-99.7 rule: ~95% of women are in this range.',
      ],
      answer: '~95%',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-z-score',
      kind: 'worked_example',
      problem: 'On a test with mean 75 and SD 8, a student scored 91. What is their z-score?',
      steps: [
        'z = (value - mean) / SD = (91 - 75) / 8 = 16/8 = 2.',
        'Interpretation: the student scored 2 standard deviations above the mean.',
        'By the empirical rule, that\'s about the 97.5th percentile — better than 97.5% of test-takers.',
      ],
      answer: 'z = 2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'IQ scores are normally distributed with mean 100, SD 15. What percent of people have IQ between 85 and 115?',
      expectedAnswer: '68%',
      responseFormat: 'numeric',
      hints: [
        '85 = 100 - 15 = mean - 1 SD. 115 = 100 + 15 = mean + 1 SD.',
        'Within 1 SD by empirical rule.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-not-normal',
      kind: 'misconception_check',
      question: 'A class\'s test scores are heavily skewed left (most got high scores, a few bombed). Sage applies the 68-95-99.7 rule to it. Right approach?',
      commonErrors: [
        {
          answer: 'yes — works for any data',
          misconception: 'Applying the empirical rule to non-normal distributions.',
          correctsTo: 'Wrong. The 68-95-99.7 rule is SPECIFIC to NORMAL distributions. Skewed data doesn\'t obey it. Always verify the data is approximately normal (symmetric bell shape) before using the rule. For skewed data, use percentiles directly.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Normal = symmetric bell curve; defined by mean and SD.',
        'Empirical rule: 68% within 1 SD, 95% within 2, 99.7% within 3.',
        'Z-score = (value − mean)/SD.',
        'Z-scores let you compare across different normal distributions.',
        'Empirical rule ONLY works for normal data.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two students: Alice scored 750 on the SAT (mean 1000, SD 200). Bob scored 28 on the ACT (mean 21, SD 5). Who did better relatively?',
      hint: 'Z-scores. Alice: (750-1000)/200 = -1.25 (below mean). Bob: (28-21)/5 = 1.4 (above mean). Bob did much better relative to test-takers.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
