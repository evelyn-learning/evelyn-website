/**
 * AP Stats — Sampling Distributions.
 *
 * Sampling distribution of x̄ and p̂, Central Limit Theorem.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_SAMPLING_DISTRIBUTIONS: LessonPlan = {
  id: 'evelyn.ap.stats.sampling-distributions.v1',
  title: 'Sampling Distributions',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.sampling-distributions',
      description: 'Identify the mean and standard error of sampling distributions for x̄ and p̂, apply the Central Limit Theorem, and check conditions.',
      standard: 'AP-STATS-UNC-3',
    },
  ],
  prerequisites: ['apstats.probability'],
  followUps: ['apstats.confidence-intervals', 'apstats.hypothesis-testing'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why a sample statistic has its own distribution.',
      script: 'Your sample average is a single number — say the mean weight of 50 apples is 152 grams. But if you took a different 50 apples, you\'d get a different number. Take many samples and the means form their own distribution. THAT distribution is the key to inference: it tells you how much the sample mean might vary from the true population mean.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-clt',
      kind: 'concept',
      goal: 'Sampling distribution mean, standard error, CLT, conditions.',
      keyIdeas: [
        'SAMPLING DISTRIBUTION: the distribution of a statistic (like x̄ or p̂) over all possible samples of size n from the population.',
        'FOR x̄ (sample MEAN): mean of x̄ = μ (population mean). SE of x̄ = σ/√n. As n grows, SE shrinks — bigger samples are tighter.',
        'FOR p̂ (sample PROPORTION): mean of p̂ = p (population proportion). SE of p̂ = √(p(1−p)/n).',
        'CENTRAL LIMIT THEOREM (CLT): for large n, the sampling distribution of x̄ is approximately NORMAL, regardless of the population\'s shape. Rule of thumb: n ≥ 30 is usually enough; for skewed populations, more.',
        'WHY CLT MATTERS: it lets you use Z-scores and normal-distribution probabilities to make inferences about a population from a sample, even when the population isn\'t normal.',
        'CONDITIONS for normality of x̄: (a) random sample, (b) n ≥ 30 OR population approximately normal.',
        'CONDITIONS for normality of p̂: (a) random sample, (b) n·p ≥ 10 AND n·(1−p) ≥ 10. (c) sample is < 10% of the population (independence).',
        '10% RULE: when sampling without replacement, draws are slightly dependent. If n < 10% of N, the dependence is negligible — treat as independent.',
      ],
      vocabulary: [
        { term: 'standard error', definition: 'standard deviation of a sampling distribution.' },
        { term: 'Central Limit Theorem', definition: 'sample means become approximately normal as sample size grows, regardless of population shape.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mean',
      kind: 'worked_example',
      problem: 'Adult women\'s heights are normally distributed with μ = 64 inches, σ = 3 inches. A random sample of n = 36 women is taken. Find the probability the sample mean exceeds 65 inches.',
      steps: [
        'Sampling distribution of x̄: mean = 64. SE = σ/√n = 3/√36 = 3/6 = 0.5.',
        'Population is already normal, so sampling distribution of x̄ is normal regardless of n.',
        'Z = (65 − 64) / 0.5 = 2.0.',
        'P(Z > 2.0) = 1 − P(Z ≤ 2.0) = 1 − 0.9772 = 0.0228.',
        'INTERPRETATION: ~2.3% chance a random sample of 36 has average height above 65 inches.',
        'COMPARE: P(individual woman > 65) = P(Z > 1/3) ≈ 0.37. The sample mean is much less variable.',
      ],
      answer: '≈ 0.0228 (about 2.3%)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A coin is flipped 100 times. Find the standard error of p̂, the sample proportion of heads. (Assume p = 0.5.)',
      expectedAnswer: '0.05',
      responseFormat: 'free',
      hints: [
        'SE of p̂ = √(p(1−p)/n).',
        '√(0.5·0.5/100) = √0.0025 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sample-vs-pop',
      kind: 'misconception_check',
      question: 'When n = 100, a population\'s standard deviation is the same as the standard deviation of x̄, right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing SD of population with SE of sample mean.',
          correctsTo: 'No. Population SD is σ. SE of x̄ is σ/√n. With n = 100 and σ = 10, SE of x̄ = 10/√100 = 1. Sample means are LESS variable than individual observations because averaging cancels out random highs and lows. That\'s the whole reason we sample — n = 100 is much more precise than n = 1.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'x̄: mean = μ, SE = σ/√n. p̂: mean = p, SE = √(p(1−p)/n).',
        'CLT: x̄ approximately normal for n ≥ 30 (any population).',
        'p̂ approximately normal when n·p ≥ 10 AND n·(1−p) ≥ 10.',
        '10% rule: sample without replacement is OK if n < 10% of population.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'You quadruple your sample size. By what factor does SE of x̄ shrink?',
      hint: 'SE = σ/√n. n → 4n means √n → 2√n. SE shrinks by factor of 2. To halve the SE, you must quadruple the sample. This is why precision is expensive.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
