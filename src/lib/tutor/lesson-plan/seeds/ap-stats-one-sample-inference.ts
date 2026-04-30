/**
 * AP Stats — One-Sample Inference.
 *
 * One-sample t-test, t-CI for mean; one-proportion z-test and z-CI.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_ONE_SAMPLE_INFERENCE: LessonPlan = {
  id: 'evelyn.ap.stats.one-sample-inference.v1',
  title: 'One-Sample Inference',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'math',
  topic: 'ap-statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.one-sample',
      description: 'Conduct one-sample t-tests and z-tests for proportions, and construct corresponding confidence intervals; check conditions and interpret results in context.',
      standard: 'AP-STATS-UNC-4',
    },
  ],
  prerequisites: ['apstats.sampling-distributions'],
  followUps: ['apstats.two-sample'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Move from one sample to a claim about the population.',
      script: 'You collect data from one sample. Now you want to make a claim about the entire population — say, the average commute time in your city, or the proportion of voters who back a candidate. The one-sample test is the bridge: a structured way to turn sample evidence into a population conclusion, with explicit uncertainty.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-procedure',
      kind: 'concept',
      goal: 'Hypotheses, conditions, test statistic, p-value, conclusion.',
      keyIdeas: [
        'STATE hypotheses. H₀: parameter = some value. Hₐ: parameter ≠, <, or > that value.',
        'CHECK conditions: (a) random sample, (b) approximately normal sampling distribution, (c) 10% rule for independence.',
        'For MEAN with σ unknown: use t-distribution with df = n − 1. Test stat: t = (x̄ − μ₀) / (s/√n).',
        'For PROPORTION: test stat z = (p̂ − p₀) / √(p₀(1−p₀)/n). Use p₀ in the SE formula (not p̂) — the test assumes the null is true.',
        'COMPUTE p-value: probability of getting a test statistic this extreme OR MORE if H₀ is true. Two-tailed: 2 × one-tailed.',
        'CONCLUSION: compare p-value to α (often 0.05). p < α → reject H₀ → "evidence supports Hₐ". p > α → fail to reject → "insufficient evidence". Always in CONTEXT, never just the math.',
        'CONFIDENCE INTERVAL: estimate ± margin of error. For mean: x̄ ± t* · (s/√n). For proportion: p̂ ± z* · √(p̂(1−p̂)/n). t* and z* depend on the confidence level (e.g. 95% → z* ≈ 1.96).',
        'CI vs TEST: a 95% CI corresponds to a two-tailed test at α = 0.05. If the null value is OUTSIDE the CI, reject. If INSIDE, fail to reject.',
        'CONDITIONS for proportion test: n·p₀ ≥ 10 AND n·(1−p₀) ≥ 10. For CI: use p̂ in conditions (n·p̂ ≥ 10).',
      ],
      vocabulary: [
        { term: 'p-value', definition: 'probability of observing a test statistic at least as extreme as the one calculated, assuming H₀ is true.' },
        { term: 'confidence interval', definition: 'a range of plausible values for the parameter, with a stated confidence level.' },
        { term: 'significance level α', definition: 'a threshold (often 0.05) below which we reject H₀.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mean',
      kind: 'worked_example',
      problem: 'A factory claims the mean weight of its bags is 50 lbs. A random sample of n = 25 bags has x̄ = 49.2 lbs and s = 1.5 lbs. Test at α = 0.05 whether the true mean differs from 50.',
      steps: [
        'STATE: H₀: μ = 50, Hₐ: μ ≠ 50.',
        'CONDITIONS: random sample (given), n = 25 < 30 — need population approximately normal (assume / check via plot in real problem). Sample is < 10% of all bags. Conditions met.',
        'TEST STAT: t = (49.2 − 50) / (1.5 / √25) = −0.8 / 0.3 = −2.67. df = 24.',
        'P-VALUE: P(|t₂₄| > 2.67). Two-tailed. From t-table: 2 × P(t₂₄ > 2.67) ≈ 2 × 0.0067 ≈ 0.013.',
        'CONCLUSION: p ≈ 0.013 < 0.05. Reject H₀. There is statistically significant evidence that the true mean weight is NOT 50 lbs (in fact, it appears LIGHTER).',
        'CI for context: 49.2 ± 2.064 · 0.3 ≈ (48.6, 49.8). Notice 50 is OUTSIDE this 95% CI — consistent with rejecting.',
      ],
      answer: 'Reject H₀. p ≈ 0.013. Evidence the mean differs from 50 (lighter).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A sample of n = 200 voters shows 110 supporting a candidate. Construct a 95% CI for the population proportion.',
      expectedAnswer: 'Approximately (0.481, 0.619), i.e., 0.55 ± 0.069.',
      responseFormat: 'free',
      hints: [
        'p̂ = 110/200 = 0.55.',
        'SE = √(0.55 · 0.45 / 200) ≈ 0.0352.',
        'z* for 95% = 1.96. Margin = 1.96 · 0.0352 ≈ 0.069.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-pvalue',
      kind: 'misconception_check',
      question: 'A p-value of 0.04 means there is a 4% probability that H₀ is true.',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Misinterpreting p-value as P(H₀ is true).',
          correctsTo: 'False. p-value = P(data at least this extreme | H₀ is true). It assumes H₀ is true and asks how unusual the data are. It does NOT give the probability that H₀ itself is true. To get P(H₀ | data), you\'d need Bayesian methods + prior probability. Confusing these two is one of the most common stats errors in published papers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hypotheses → conditions → test stat → p-value → conclusion in context.',
        'Mean: t = (x̄ − μ₀)/(s/√n), df = n − 1. Proportion: z, use p₀ in SE.',
        'CI: estimate ± critical · SE. 95% CI ↔ α=0.05 two-sided test.',
        'p-value is NOT P(H₀ is true). It\'s P(data this extreme | H₀).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do we use the t-distribution instead of z when σ is unknown?',
      hint: 'When σ is unknown we estimate it with s — a value that itself has random variation. The t-distribution has heavier tails than z to account for this extra uncertainty. As n → ∞, t converges to z. For small n the difference matters.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
