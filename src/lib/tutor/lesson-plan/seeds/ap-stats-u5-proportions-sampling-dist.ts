/**
 * AP Statistics — CED Unit 5.5+5.6: Sampling Distributions for
 * Proportions.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U5_PROPORTIONS_SAMPLING_DIST: LessonPlan = {
  id: 'evelyn.ap.stats.proportions-sampling-dist.v1', title: 'U5.5 Sampling Distribution of p̂',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.proportions-sampling-dist', description: 'Find the mean and SD of the sampling distribution of a sample proportion. Verify Large Counts and 10% conditions for normality. Compute probabilities for the sampling distribution of p̂ and of p̂_1 − p̂_2.', standard: 'AP-STATS-5.5-5.6' }],
  prerequisites: ['apstats.central-limit-theorem'], followUps: ['apstats.means-sampling-dist'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame proportions sampling distribution.', script: "When we sample binary outcomes (yes/no, success/fail), the sample proportion p̂ varies from sample to sample. Today: its mean, SD, and conditions for treating it as approximately normal.", estimatedMinutes: 2 },
    { id: 'concept-prop', kind: 'concept', goal: 'Cover proportions sampling distribution + 2-sample.',
      keyIdeas: [
        'For SRS of size n from a population with success proportion p, the SAMPLING DISTRIBUTION of p̂:',
        '  • CENTER: μ_p̂ = p (unbiased).',
        '  • SPREAD: σ_p̂ = √(p(1−p)/n).',
        '  • SHAPE: approximately normal IF Large Counts condition holds.',
        'LARGE COUNTS CONDITION: np ≥ 10 AND n(1−p) ≥ 10. (Some texts use 5; AP uses 10.)',
        '10% CONDITION: n ≤ 0.10·N (sampling fraction at most 10%) for independence.',
        'PROBABILITIES via standardization: z = (p̂ − p)/σ_p̂ = (p̂ − p)/√(p(1−p)/n). Look up in standard normal table.',
        'TWO-SAMPLE difference of proportions p̂_1 − p̂_2 (independent samples):',
        '  • μ_{p̂_1 − p̂_2} = p_1 − p_2.',
        '  • σ_{p̂_1 − p̂_2} = √(p_1(1−p_1)/n_1 + p_2(1−p_2)/n_2). (Variances ADD.)',
        '  • SHAPE: approximately normal IF Large Counts holds in BOTH samples (n_1 p_1 ≥ 10, n_1(1−p_1) ≥ 10, n_2 p_2 ≥ 10, n_2(1−p_2) ≥ 10).',
        'AP RUBRIC: ALWAYS verify Large Counts AND 10% before claiming normality.',
      ],
      vocabulary: [
        { term: 'standard error of p̂', definition: '√(p(1−p)/n).' },
        { term: 'Large Counts condition', definition: 'np ≥ 10 AND n(1−p) ≥ 10.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-prob', kind: 'worked_example',
      problem: '60% of a town\'s voters support a measure. SRS of 200 voters. (a) Sampling distribution of p̂. (b) P(p̂ < 0.55)?',
      steps: [
        '(a) Population proportion p = 0.60. μ_p̂ = 0.60. σ_p̂ = √(0.6·0.4/200) = √0.0012 ≈ 0.0346. \nLarge Counts: np = 200(0.6) = 120 ≥ 10 ✓; n(1−p) = 200(0.4) = 80 ≥ 10 ✓. \n10%: 200 ≤ 0.10·N requires town has ≥ 2000 voters (assume yes). \nSo p̂ ~ N(0.60, 0.0346) approximately.',
        '(b) z = (0.55 − 0.60)/0.0346 ≈ -1.45. P(Z < -1.45) ≈ 0.0735. About 7.4%.',
      ],
      answer: 'p̂ ~ N(0.60, 0.0346). P(p̂ < 0.55) ≈ 0.074.', estimatedMinutes: 4 },
    { id: 'try-conditions', kind: 'try_yourself',
      problem: 'Sample of 50 from a population with p = 0.05. Can we treat the sampling distribution of p̂ as approximately normal?',
      expectedAnswer: 'Large Counts: np = 50(0.05) = 2.5. NOT ≥ 10 → Large Counts FAILS. Cannot use normal approximation. The sampling distribution will be skewed (because p is small). Need larger n or another method.',
      responseFormat: 'free', hints: ['Both np and n(1−p) need to be ≥ 10.'], estimatedMinutes: 3 },
    { id: 'try-twoprop', kind: 'try_yourself',
      problem: 'A poll: among 200 men, 50% support measure; among 200 women, 60% support. (a) Find the sampling distribution of p̂_W − p̂_M. (b) Compute P(p̂_W − p̂_M > 0.15).',
      expectedAnswer: '(a) μ_{diff} = 0.60 − 0.50 = 0.10. σ²_{diff} = (0.6·0.4/200) + (0.5·0.5/200) = 0.0012 + 0.00125 = 0.00245. σ_{diff} = √0.00245 ≈ 0.0495. Large Counts: 200(0.5) = 100, 200(0.5) = 100, 200(0.6) = 120, 200(0.4) = 80 — ALL ≥ 10 ✓. \nDistribution: approximately N(0.10, 0.0495). \n(b) z = (0.15 − 0.10)/0.0495 ≈ 1.01. P(Z > 1.01) ≈ 1 − 0.8438 = 0.1562. About 15.6%.',
      responseFormat: 'numeric', hints: ['Variances add for difference; check Large Counts in both groups.'], estimatedMinutes: 5 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A college claims 80% of its grads find jobs within 6 months. A skeptical researcher takes a SRS of 100 grads and finds 70 employed within 6 months (p̂ = 0.70). (a) Verify conditions. (b) Find P(p̂ ≤ 0.70) IF the claim is true. (c) Should the researcher be skeptical?',
      expectedAnswer: '(a) Random sample: SRS ✓. Large Counts: np = 100(0.80) = 80 ≥ 10 ✓; n(1−p) = 100(0.20) = 20 ≥ 10 ✓. 10%: assume more than 1000 grads; ✓. (1.5)\n(b) μ_p̂ = 0.80, σ_p̂ = √(0.8·0.2/100) = √0.0016 = 0.04. z = (0.70 − 0.80)/0.04 = -2.5. P(Z ≤ -2.5) ≈ 0.0062. (2.5)\n(c) Yes. Under the claim, observing p̂ ≤ 0.70 has probability about 0.62%. This is rare evidence — the researcher has strong reason to doubt the 80% claim. The true rate is likely lower than 80%. (2)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Conditions; standardize; interpret as evidence.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'μ_p̂ = p; σ_p̂ = √(p(1−p)/n).',
      'Large Counts: np ≥ 10 AND n(1−p) ≥ 10.',
      '10%: n ≤ 0.10·N for independence.',
      'Two-sample diff: variances add; Large Counts in BOTH samples.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '5', cedTopic: '5.5-5.6', cedTitle: 'Sampling Distribution of p̂', sources: [{ type: 'concept', book: 'tps5e', chapter: '7-8', note: 'Standard sampling distribution of p̂.' }] },
};
