/**
 * G11 — Statistics: Correlation and linear regression.
 *
 * Quantifying the relationship between two numeric variables. The
 * correlation coefficient (r) measures strength + direction. Linear
 * regression fits a line to predict one variable from another.
 * Critical caveats: correlation doesn't imply causation;
 * extrapolating beyond data is risky.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_STATS_CORRELATION_REGRESSION: LessonPlan = {
  id: 'evelyn.g11.math.stats.correlation-regression.v1',
  title: 'Correlation and Linear Regression',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hss.id.b.6',
      description: 'Represent data on two variables with a scatter plot and describe their relationship.',
      standard: 'CCSS.MATH.CONTENT.HSS.ID.B.6',
    },
    {
      id: 'ccss.math.hss.id.c.7',
      description: 'Interpret the slope and intercept of a linear model.',
      standard: 'CCSS.MATH.CONTENT.HSS.ID.C.7',
    },
  ],
  prerequisites: ['ccss.math.8.f.b.4'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "scatter cloud" can have a clear story.',
      script: 'Plot ice cream sales vs. drowning incidents over a year. The cloud of points has a clear pattern — both go up in summer. Does that mean ice cream causes drowning? Of course not. Both are caused by hot weather. Recognizing CORRELATION is easy. Confusing it with CAUSATION is the most-common mistake in pop science.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-correlation-regression',
      kind: 'concept',
      goal: 'r value, line of best fit, slope/intercept interpretation, no-causation caveat.',
      keyIdeas: [
        'CORRELATION COEFFICIENT (r): measures STRENGTH and DIRECTION of a linear relationship.',
        '  Range: -1 ≤ r ≤ +1.',
        '  r = +1: perfect positive linear relationship.',
        '  r = -1: perfect negative.',
        '  r = 0: no linear relationship.',
        '  |r| close to 1 = strong; close to 0 = weak.',
        'IMPORTANT: r measures LINEAR relationship only. A perfect parabola would have r ≈ 0 even though there\'s a clear non-linear pattern.',
        'LINE OF BEST FIT (regression line): y = a + bx, fitted to minimize squared distances from points.',
        '  SLOPE (b): rate of change of y per unit increase in x.',
        '  Y-INTERCEPT (a): predicted y when x = 0.',
        'INTERPRETATION:',
        '  Slope: "for each additional unit of x, predicted y changes by b."',
        '  Intercept: only meaningful if x = 0 makes physical sense.',
        'CORRELATION ≠ CAUSATION. Two variables can be correlated for reasons OTHER than one causing the other:',
        '  Common cause (lurking variable): hot weather → ice cream + drowning.',
        '  Reverse causation: maybe Y causes X.',
        '  Coincidence: especially with small samples.',
        'EXTRAPOLATION: predicting y for x values OUTSIDE the original data range. Risky — the linear pattern might break down.',
      ],
      vocabulary: [
        { term: 'correlation coefficient (r)', definition: 'measure of linear relationship strength, between -1 and 1.' },
        { term: 'line of best fit', definition: 'the line that minimizes squared distances from data points.' },
        { term: 'extrapolation', definition: 'predicting beyond the range of original data.' },
        { term: 'lurking variable', definition: 'an unmeasured variable causing both variables to vary together.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-interpret',
      kind: 'worked_example',
      problem: 'A regression of test score (y) on hours studied (x): y = 50 + 4x. r = 0.78. Interpret slope, intercept, and r.',
      steps: [
        'SLOPE 4: each additional hour of study predicts a 4-point increase in test score.',
        'INTERCEPT 50: a student who studied 0 hours is predicted to score 50.',
        'r = 0.78: STRONG, POSITIVE linear relationship. As study hours go up, test scores tend to go up.',
        'CAVEAT: this is correlation, not necessarily causation. Could be true cause-effect, or could be that motivated students BOTH study more AND score higher (motivation as lurking variable).',
      ],
      answer: 'See interpretations',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-extrapolation',
      kind: 'worked_example',
      problem: 'Using y = 50 + 4x from above, predict the test score for someone who studied 100 hours.',
      steps: [
        'Plug in: y = 50 + 4(100) = 450.',
        'BUT — most students study 0-20 hours. 100 hours is FAR outside the original data range.',
        'The model says 450, but maximum possible score might be 100. The linear pattern almost certainly BREAKS at extreme x values (saturation, fatigue).',
        'CONCLUSION: don\'t trust this prediction. Extrapolation is unreliable.',
      ],
      answer: 'Mathematical answer 450; but unreliable due to extrapolation.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two variables have r = -0.92. Describe the relationship.',
      expectedAnswer: 'Strong negative linear relationship',
      responseFormat: 'free',
      hints: [
        'Sign tells direction; magnitude tells strength.',
        '|r| close to 1 is strong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-causation',
      kind: 'misconception_check',
      question: 'A study finds that towns with more police officers per capita have higher crime rates. Reza concludes "police cause crime." Right?',
      commonErrors: [
        {
          answer: 'yes — clear correlation',
          misconception: 'Treating correlation as causation.',
          correctsTo: 'Wrong — that\'s the classic causation error. The likely explanation is REVERSE causation: high-crime areas hire more police, not the other way around. Could also be a lurking variable (population density). Correlation only proves they MOVE together, not WHY.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'r between -1 and 1; sign = direction, magnitude = strength.',
        'r measures LINEAR relationship — non-linear patterns can have r ≈ 0.',
        'Slope = change in y per unit x. Intercept = y when x = 0 (often meaningless).',
        'Correlation ≠ causation. Always consider lurking variables and reverse causation.',
        'Don\'t extrapolate beyond your data range.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two variables have r = 0.05. What does that tell you about a regression line fit to them?',
      hint: 'r near 0 means almost no linear relationship — the line will be nearly flat (slope close to 0) and predictions will be barely better than just guessing the mean.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
