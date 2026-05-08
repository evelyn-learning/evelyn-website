/**
 * AP Statistics — CED Unit 1.10: The Normal Distribution.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_NORMAL_DISTRIBUTION: LessonPlan = {
  id: 'evelyn.ap.stats.normal-distribution.v1', title: 'U1.10 The Normal Distribution',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.normal-distribution', description: 'Recognize the normal distribution. Apply the 68-95-99.7 (empirical) rule. Convert raw values to z-scores. Use z-scores to find probabilities and percentiles via the standard normal table.', standard: 'AP-STATS-1.10' }],
  prerequisites: ['apstats.summary-statistics'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the normal distribution.', script: "The normal distribution is the bell curve — symmetric, mound-shaped, governed by mean μ and standard deviation σ. It models heights, test scores, measurement errors, and shows up everywhere in statistics. Today: empirical rule and z-scores.", estimatedMinutes: 2 },
    { id: 'concept-normal', kind: 'concept', goal: 'Cover normal distribution + empirical rule + z-scores.',
      keyIdeas: [
        'NORMAL DISTRIBUTION N(μ, σ): symmetric, bell-shaped, with mean μ and SD σ. Notation: X ~ N(μ, σ).',
        'EMPIRICAL RULE (68-95-99.7) for any normal distribution:',
        '  • ~68% of values within 1 SD of the mean (μ ± σ).',
        '  • ~95% within 2 SD (μ ± 2σ).',
        '  • ~99.7% within 3 SD (μ ± 3σ).',
        'Z-SCORE: z = (x − μ) / σ. Number of SDs the value x is above (positive) or below (negative) the mean. Standardizes any normal distribution to N(0, 1).',
        'STANDARD NORMAL: N(0, 1) — has mean 0 and SD 1. Tables (or calculator normalcdf) give cumulative probability P(Z ≤ z).',
        'PROBABILITIES: for X ~ N(μ, σ), P(X ≤ x) = P(Z ≤ (x − μ)/σ). Look up the z-score in the table.',
        'PERCENTILES (reverse): given a probability p, find z such that P(Z ≤ z) = p (use invNorm). Then x = μ + z·σ.',
        'AP CALCULATOR: normalcdf(lower, upper, μ, σ) for probability between two values; invNorm(p, μ, σ) for percentile.',
      ],
      vocabulary: [
        { term: 'z-score', definition: 'z = (x − μ)/σ — number of SDs x is from the mean.' },
        { term: 'empirical rule', definition: '68-95-99.7 rule for normal distributions.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-empirical', kind: 'worked_example',
      problem: 'SAT scores are approximately N(1050, 200). What percent of test-takers score between 850 and 1450?',
      steps: [
        'STEP 1 — z for 850: (850 − 1050)/200 = -1.',
        'STEP 2 — z for 1450: (1450 − 1050)/200 = 2.',
        'STEP 3 — Range is from 1 SD below mean to 2 SDs above mean.',
        'STEP 4 — Empirical rule: 68% within ±1 SD; 95% within ±2 SD. So between -1 and +2 SD = (68/2) + (95/2) = 34% + 47.5% = 81.5%.',
        'STEP 5 — About 81.5% of test-takers score between 850 and 1450.',
      ],
      answer: '~81.5%.', estimatedMinutes: 4 },
    { id: 'try-zscore', kind: 'try_yourself',
      problem: 'Heights are N(67, 3) inches. (a) Find the z-score for someone 73 inches tall. (b) Find the height corresponding to z = -1.5.',
      expectedAnswer: '(a) z = (73 − 67)/3 = 2. The person is 2 SDs above the mean. (b) x = 67 + (-1.5)(3) = 67 − 4.5 = 62.5 inches.',
      responseFormat: 'numeric', hints: ['(a) z = (x − μ)/σ. (b) Solve for x.'], estimatedMinutes: 3 },
    { id: 'try-prob', kind: 'try_yourself',
      problem: 'IQ scores are N(100, 15). What proportion of people have IQ above 130?',
      expectedAnswer: 'z = (130 − 100)/15 = 2. P(Z > 2) = 1 − P(Z ≤ 2). From the standard normal table, P(Z ≤ 2) ≈ 0.9772. So P(Z > 2) ≈ 0.0228, about 2.3%.',
      responseFormat: 'numeric', hints: ['Compute z; use 1 − P(Z ≤ z) for upper tail.'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. Tire lifetimes are N(40000, 5000) miles. (a) What proportion last more than 50000 miles? (b) The manufacturer wants to guarantee a mileage at which 95% of tires will last AT LEAST that long. What mileage?',
      expectedAnswer: '(a) z = (50000 − 40000)/5000 = 2. P(X > 50000) = P(Z > 2) ≈ 0.0228 (~2.3%).\n(b) Want P(X ≥ x) = 0.95, i.e., P(X < x) = 0.05. Find z such that P(Z < z) = 0.05 → z ≈ -1.645 (invNorm). x = 40000 + (-1.645)(5000) = 40000 − 8225 = 31775 miles. So guarantee ~31,775 miles.',
      responseFormat: 'frq', hints: ['(a) Compute z; upper tail. (b) Use invNorm(0.05) to find z.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Empirical rule: 68-95-99.7 within ±1, ±2, ±3 SDs.',
      'z = (x − μ)/σ — standardize any normal to N(0,1).',
      'Use normal table or normalcdf for probabilities; invNorm for percentiles.',
      'A z-score of 2 means \'2 SDs above mean\'.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1.10', cedTitle: 'Normal Distribution', sources: [{ type: 'concept', book: 'tps5e', chapter: '2', note: 'Standard empirical rule + z-scores.' }] },
};
