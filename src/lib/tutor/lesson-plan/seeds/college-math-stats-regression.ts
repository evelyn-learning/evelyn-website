/**
 * College Intro Statistics — Simple Linear Regression.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_STATS_REGRESSION: LessonPlan = {
  id: 'evelyn.college.math.stats.regression.v1',
  title: 'Intro Statistics — Simple Linear Regression',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'college.math.stats.regression',
      description: 'Fit a simple linear regression line by least squares; interpret slope, intercept, r, R², residuals; check assumptions.',
      standard: 'COLLEGE-INTRO-STATS',
    },
  ],
  prerequisites: ['college.math.stats.hypothesis-testing'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Regression is how you turn "x correlates with y" into a quantitative prediction with uncertainty.',
      script: 'Height vs weight, study hours vs test score, ad spend vs sales — wherever two variables move together, regression fits the BEST LINE. The slope quantifies "y per x." But the line can mislead if you don\'t check residuals and assumptions. Today: fit, interpret, and check.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-regression',
      kind: 'concept',
      goal: 'Least squares, slope/intercept formulas, interpretation, r and R², residuals, assumptions.',
      keyIdeas: [
        'MODEL: y = β₀ + β₁ x + ε. Estimate β̂₀ (intercept) and β̂₁ (slope) from data.',
        'LEAST SQUARES: choose β̂₀, β̂₁ to minimise Σ(y_i − ŷ_i)² where ŷ = β̂₀ + β̂₁ x. The MSE-minimising line.',
        'FORMULAS:',
        '  β̂₁ = r · (s_y / s_x), where r is the correlation coefficient.',
        '  β̂₀ = ȳ − β̂₁ x̄. (The line passes through (x̄, ȳ) — the centroid.)',
        'INTERPRETATION:',
        '  β̂₁ (SLOPE) = predicted change in y per unit increase in x.',
        '  β̂₀ (INTERCEPT) = predicted y when x = 0. Often meaningful only when x = 0 is realistic.',
        'CORRELATION r ∈ [−1, 1] measures linear association strength + direction. R² = r² is the proportion of variance in y explained by x. R² = 0.6 means 60% of y\'s variation is captured by the line.',
        'RESIDUAL: y_i − ŷ_i (observed minus predicted). Residual plot vs x should look like RANDOM SCATTER with no pattern. Patterns indicate the linear model is misspecified.',
        'ASSUMPTIONS for inference (testing β₁ = 0, etc.):',
        '  LINEARITY (relationship is actually linear).',
        '  INDEPENDENCE (residuals are independent).',
        '  NORMALITY (residuals approximately normal).',
        '  EQUAL VARIANCE / homoscedasticity (residual spread doesn\'t depend on x).',
        'EXTRAPOLATION risk: the regression model is only valid in the RANGE of observed x. Predicting outside that range (extrapolation) is unreliable.',
        'CORRELATION ≠ CAUSATION: a strong slope does NOT mean x causes y. Confounders, reverse causation, and selection bias can all create non-zero β̂₁.',
      ],
      vocabulary: [
        { term: 'least squares', definition: 'the regression criterion: choose the line minimising the sum of squared vertical residuals.' },
        { term: 'R-squared', definition: 'r²; proportion of variation in y explained by the linear regression on x; ranges 0 to 1.' },
        { term: 'homoscedasticity', definition: 'the residuals have constant variance across x; an assumption for valid inference in linear regression.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Hours studied vs test score: x̄ = 5, ȳ = 80, s_x = 2, s_y = 8, r = 0.75. Find the regression line and predict score for 6 hours.',
      steps: [
        'Slope β̂₁ = r · (s_y / s_x) = 0.75 · (8/2) = 0.75 · 4 = 3.',
        'Interpretation: each additional hour of study predicts +3 points on the test.',
        'Intercept β̂₀ = ȳ − β̂₁ x̄ = 80 − 3 · 5 = 80 − 15 = 65.',
        'Regression line: ŷ = 65 + 3x.',
        'Predict at x = 6: ŷ = 65 + 18 = 83 points.',
        'R² = 0.75² = 0.5625, so 56% of test-score variance is explained by hours studied.',
        'Caveat: this is correlational, not causal. Other factors (sleep, prior knowledge) likely contribute.',
      ],
      answer: 'ŷ = 65 + 3x; predicted score for 6 hours: 83.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is it usually wrong to use a regression line to predict the y-value for an x far outside the observed data range?',
      expectedAnswer: 'EXTRAPOLATION. The regression line was fit to data within a specific x-range; outside that range, we have no evidence the linear relationship continues. Real-world relationships often plateau, curve, or break entirely. Examples: hours studied predicts score within reasonable hours, but at 100+ hours the relationship saturates or reverses (fatigue). A regression model is reliable only IN-SAMPLE — predictions outside the range carry unknown errors.',
      responseFormat: 'free',
      hints: [
        'What does the linear model say outside the observed range?',
        'Can we trust patterns we haven\'t observed?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-causation',
      kind: 'misconception_check',
      question: 'A study reports a regression of life expectancy on coffee consumption with slope +1.2 years per cup/day. A student concludes "drinking more coffee adds years to your life." What\'s wrong?',
      commonErrors: [
        {
          answer: 'Slope implies causation',
          misconception: 'Treating regression as a causal estimator.',
          correctsTo: 'Regression measures ASSOCIATION, not CAUSATION. Multiple alternative explanations: (1) confounding — wealthier countries with better healthcare also drink more coffee. (2) Reverse causation — healthier people may live longer and consume more coffee over their lifetimes. (3) Selection — observational sample isn\'t random. To infer causation, you need a randomised trial or a strong natural experiment that breaks confounding. Regression on observational data is descriptive, not causal.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slope = r · (s_y / s_x); intercept = ȳ − β̂₁ x̄.',
        'Slope = predicted change in y per unit x; intercept = ŷ when x = 0.',
        'R² = proportion of y-variance explained by x.',
        'Check residuals for randomness; check assumptions before inference.',
        'Don\'t extrapolate; correlation is not causation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
