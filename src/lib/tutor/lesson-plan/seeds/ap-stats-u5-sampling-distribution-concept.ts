/**
 * AP Statistics — CED Unit 5.1+5.2+5.4: Sampling Distribution Concept and
 * Bias of Estimators.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U5_SAMPLING_DISTRIBUTION_CONCEPT: LessonPlan = {
  id: 'evelyn.ap.stats.sampling-distribution-concept.v1', title: 'U5.1 The Sampling Distribution',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.sampling-distribution-concept', description: 'Distinguish parameter (population) vs. statistic (sample). Understand that a sample statistic varies from sample to sample. Define the sampling distribution. Recognize unbiased estimators and the role of variability.', standard: 'AP-STATS-5.1-5.4' }],
  prerequisites: [], followUps: ['apstats.central-limit-theorem'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the central question.', script: "Two students each take a different SRS of 100 voters from the same city. They report different proportions for the same candidate. Why? STATISTICS VARY from sample to sample. The distribution of all possible sample statistics is the SAMPLING DISTRIBUTION — the heart of inference.", estimatedMinutes: 2 },
    { id: 'concept-sampling-dist', kind: 'concept', goal: 'Cover parameter, statistic, sampling distribution, bias.',
      keyIdeas: [
        'PARAMETER: a NUMBER describing the POPULATION. Usually unknown. Notation: μ (population mean), p (population proportion), σ (population SD).',
        'STATISTIC: a NUMBER computed from a SAMPLE. Notation: x̄ (sample mean), p̂ (sample proportion), s (sample SD).',
        'KEY IDEA: every sample gives a different statistic. The sampling distribution is the distribution of the statistic over ALL POSSIBLE samples of size n.',
        'CENTER (mean) of sampling distribution: μ_x̄ or μ_p̂.',
        'SPREAD (SD) of sampling distribution: σ_x̄ or σ_p̂. Tells how much the statistic varies sample-to-sample.',
        'SHAPE: depends on sample size, parameter, and underlying distribution.',
        'UNBIASED ESTIMATOR: an estimator whose mean over the sampling distribution EQUALS the parameter. The sample mean x̄ is unbiased for μ; the sample proportion p̂ is unbiased for p.',
        'WARNING: sample SD s is approximately unbiased (uses n−1 denominator). If you used n, you\'d UNDERESTIMATE σ on average — which is why we use n−1.',
        'PRECISION (variability of estimator) ≠ accuracy (bias). Larger n REDUCES variability. Bias is fixed by the estimator design, not the sample size.',
        'AP RUBRIC: when discussing whether a statistic is "good," address both bias (centers on parameter?) AND variability (low spread?).',
      ],
      vocabulary: [
        { term: 'parameter', definition: 'a number describing the population.' },
        { term: 'statistic', definition: 'a number computed from a sample.' },
        { term: 'sampling distribution', definition: 'distribution of a statistic over all possible samples of fixed size n.' },
        { term: 'unbiased estimator', definition: 'an estimator whose expected value equals the parameter.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-vary', kind: 'worked_example',
      problem: 'A bag has 60% red marbles, 40% blue. A student takes 50 SRSs of size 20 and computes p̂ each time. (a) What\'s the population parameter? (b) Predict the center of the sampling distribution of p̂. (c) The student observes p̂ ranging from 0.40 to 0.85 with mean ≈ 0.60. Comment.',
      steps: [
        '(a) Parameter: p = 0.60 (true population proportion red).',
        '(b) Sample proportion p̂ is UNBIASED, so center of sampling distribution ≈ p = 0.60.',
        '(c) Mean ≈ 0.60 confirms unbiasedness. Range 0.40 to 0.85 reflects sample-to-sample VARIABILITY (since n = 20 is small). Larger n would tighten the range.',
      ],
      answer: 'p = 0.60. Sampling distribution is centered at 0.60 (unbiased) with spread that depends on n.', estimatedMinutes: 4 },
    { id: 'try-vocab', kind: 'try_yourself',
      problem: 'Identify each as parameter or statistic: (a) μ = 65 inches (mean height in U.S.). (b) x̄ = 65.2 inches (mean of an SRS). (c) p = 0.52 (proportion voters favoring candidate). (d) p̂ = 0.55 (proportion favoring in a poll of 500).',
      expectedAnswer: '(a) Parameter (population). (b) Statistic (sample). (c) Parameter. (d) Statistic.',
      responseFormat: 'free', hints: ['Greek letter usually = parameter. Hat or bar = statistic.'], estimatedMinutes: 2 },
    { id: 'try-bias', kind: 'try_yourself',
      problem: 'AP-style synthesis. Two methods estimate population mean μ. Method A averages 5 sample values; Method B uses the median of 5 sample values. The population is normal. Compare them. (a) Are both unbiased? (b) Which has lower variability?',
      expectedAnswer: '(a) For a normal population, BOTH the sample mean (Method A) and the sample median (Method B) are unbiased estimators of μ. Their sampling distributions both center at μ. (1.5)\n(b) For a normal population, the sample mean has LOWER variability than the sample median. (Theoretical SD of median is about 1.25 × SD of mean for normal populations.) Method A is preferred for efficiency. (2)\n(c) Note: the median can be PREFERRED if the population is skewed/has outliers — it\'s more resistant. Pick the estimator based on context. (1)\nTotal: 4.5 points.',
      responseFormat: 'frq', hints: ['Bias = expected value matches parameter. Variability = SD of sampling distribution.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Parameter (population, unknown) vs statistic (sample, computed).',
      'Sampling distribution = distribution of a statistic over all possible samples.',
      'Unbiased: mean of sampling distribution = parameter.',
      'Larger n → less variability; bias is independent of n.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '5', cedTopic: '5.1-5.4', cedTitle: 'Sampling Distribution Concept', sources: [{ type: 'concept', book: 'tps5e', chapter: '7', note: 'Standard sampling distribution intro.' }] },
};
