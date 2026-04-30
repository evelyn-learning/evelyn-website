/**
 * AP Statistics — Linear regression inference.
 *
 * Beyond the descriptive line of best fit: testing whether the slope
 * is significantly different from zero. Confidence intervals for slope.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_REGRESSION_INFERENCE: LessonPlan = {
  id: 'evelyn.ap.stats.linear-regression-inference.v1',
  title: 'Linear regression inference: slope tests',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'ap-statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.regression-inference',
      description: 'Conduct hypothesis tests and construct confidence intervals for the slope of a regression line.',
      standard: 'AP-STATS-DAT-2',
    },
  ],
  prerequisites: ['apstats.confidence-intervals', 'apstats.hypothesis-test'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect descriptive regression to inference.',
      script: 'You collected data and drew a line of best fit with slope 0.5. Is the relationship REAL — or could the slope have come up just by chance, with the true population slope being 0? Inference answers that.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-slope-test',
      kind: 'concept',
      goal: 'Hypotheses, t-statistic, df, conditions.',
      keyIdeas: [
        'POPULATION model: y = β₀ + β₁·x + ε, where β₁ is the TRUE population slope.',
        'SAMPLE estimates: b₁ (sample slope), SE(b₁) (standard error of slope).',
        'TYPICAL TEST: H₀: β₁ = 0 (no relationship). H_a: β₁ ≠ 0 (some relationship). Two-sided.',
        'TEST STATISTIC: t = b₁ / SE(b₁). Compares observed slope to expected (0) under H₀, scaled by uncertainty.',
        'DEGREES OF FREEDOM: df = n − 2. (We estimated 2 things: slope and intercept.)',
        'CONFIDENCE INTERVAL for slope: b₁ ± t* · SE(b₁), where t* is the critical value for the desired confidence level.',
        'CONDITIONS for valid inference: 1) LINEAR relationship. 2) INDEPENDENT observations. 3) NORMAL residuals. 4) EQUAL variance (homoscedasticity) across x. Mnemonic: LINE.',
      ],
      vocabulary: [
        { term: 'slope (β₁)', definition: 'the true rate of change in y per unit x in the population.' },
        { term: 'standard error of slope', definition: 'how much the sample slope varies from sample to sample.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-test',
      kind: 'worked_example',
      problem: 'A study with n = 30 finds b₁ = 0.6, SE(b₁) = 0.2. Test H₀: β₁ = 0 at α = 0.05.',
      steps: [
        't = 0.6 / 0.2 = 3.0.',
        'df = n − 2 = 28.',
        'Critical t* for α = 0.05 two-sided, df=28: ≈ 2.048.',
        '|3.0| > 2.048 → REJECT H₀.',
        'Strong evidence the population slope is nonzero — there IS a relationship.',
        'For a 95% CI: 0.6 ± 2.048 · 0.2 = (0.19, 1.01). Doesn\'t contain 0 — consistent with rejecting H₀.',
      ],
      answer: 'reject H₀; t=3.0 > 2.048; 95% CI = (0.19, 1.01)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A regression with n=20 has b₁ = 1.5, SE(b₁) = 1.0. Compute t and decide at α = 0.05.',
      expectedAnswer: 't = 1.5; fail to reject (df=18, critical ≈ 2.10)',
      responseFormat: 'free',
      hints: [
        't = 1.5 / 1.0 = 1.5.',
        'df = 18. Critical at α=0.05 two-sided ≈ 2.10.',
        '|1.5| < 2.10 → fail to reject.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-significance-prediction',
      kind: 'misconception_check',
      question: 'If a regression slope is statistically significant, is it always practically important?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating statistical and practical significance.',
          correctsTo: 'No — with a HUGE sample, even a tiny slope can be statistically significant. But a slope of 0.001 doesn\'t mean much in practice. Always look at EFFECT SIZE alongside p-value. "Significant" doesn\'t mean "important".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        't = b₁ / SE(b₁). df = n − 2.',
        'H₀: β₁ = 0 (no relationship).',
        'CI: b₁ ± t* · SE(b₁).',
        'Conditions: LINE — Linear, Independent, Normal residuals, Equal variance.',
        'Significance ≠ practical importance.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do you check the LINE conditions in practice?',
      hint: 'Linear: scatter plot. Independent: study design. Normal residuals: residual plot histogram. Equal variance: residual plot — points should fan evenly across x. If conditions fail, transform data or use a different method.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
