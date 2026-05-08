/**
 * AP Statistics — CED Unit 5.7+5.8: Sampling Distributions for Means.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U5_MEANS_SAMPLING_DIST: LessonPlan = {
  id: 'evelyn.ap.stats.means-sampling-dist.v1', title: 'U5.7 Sampling Distribution of x̄',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.means-sampling-dist', description: 'Find mean, SD, and shape of the sampling distribution of x̄. Apply CLT for normal approximation. Compute probabilities. Extend to two-sample difference x̄_1 − x̄_2.', standard: 'AP-STATS-5.7-5.8' }],
  prerequisites: ['apstats.proportions-sampling-dist'], followUps: [], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame means sampling distribution.', script: "Same idea as proportions but for averaging quantitative data: x̄ varies from sample to sample. Today: full toolkit for the sampling distribution of x̄ and the two-sample difference x̄_1 − x̄_2.", estimatedMinutes: 2 },
    { id: 'concept-means', kind: 'concept', goal: 'Cover one-sample and two-sample for x̄.',
      keyIdeas: [
        'ONE-SAMPLE x̄: For SRS of size n from a population with mean μ and SD σ, sampling distribution of x̄:',
        '  • CENTER: μ_x̄ = μ.',
        '  • SPREAD: σ_x̄ = σ/√n.',
        '  • SHAPE: approximately normal IF the population is normal OR n ≥ 30 (CLT).',
        'TWO-SAMPLE difference x̄_1 − x̄_2 (INDEPENDENT samples):',
        '  • CENTER: μ_{x̄_1 − x̄_2} = μ_1 − μ_2.',
        '  • SPREAD: σ_{x̄_1 − x̄_2} = √(σ²_1/n_1 + σ²_2/n_2). (Variances ADD; from independence.)',
        '  • SHAPE: approximately normal IF (a) BOTH populations are normal, OR (b) n_1 ≥ 30 AND n_2 ≥ 30.',
        'AP CONDITIONS to verify:',
        '  • RANDOM: SRS or random assignment.',
        '  • NORMAL/LARGE: population is normal OR n ≥ 30 OR sample plot is roughly symmetric (with no extreme outliers — visually OK).',
        '  • 10%: n ≤ 0.10·N (independence).',
        'STANDARD ERROR vs SD: when σ is known we say SD (or "SD of sampling distribution"). When σ is unknown and we use s instead, we call it the "standard error" — covered in Unit 7.',
        'Calculator: normalcdf for probability, invNorm for percentile.',
      ],
      vocabulary: [
        { term: 'standard error of x̄', definition: 'σ/√n (when σ known); s/√n is its sample-based estimate.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-onesample', kind: 'worked_example',
      problem: 'IQ scores are N(100, 15). SRS of 25. (a) Sampling distribution of x̄? (b) P(x̄ > 105)?',
      steps: [
        '(a) μ_x̄ = 100. σ_x̄ = 15/√25 = 3. Population normal → x̄ ~ N(100, 3) exactly.',
        '(b) z = (105 − 100)/3 = 1.667. P(Z > 1.667) ≈ 0.0478. About 4.8%.',
      ],
      answer: 'x̄ ~ N(100, 3). P(x̄ > 105) ≈ 0.048.', estimatedMinutes: 3 },
    { id: 'try-skewed', kind: 'try_yourself',
      problem: 'Income in a city is right-skewed with μ = $50k, σ = $20k. SRS of 100 residents. (a) Sampling distribution of x̄? (b) P(x̄ < $48k)?',
      expectedAnswer: '(a) μ_x̄ = $50k. σ_x̄ = 20/√100 = $2k. n = 100 ≥ 30 → CLT applies → x̄ ~ N($50k, $2k) approximately. \n(b) z = (48 − 50)/2 = -1. P(Z < -1) ≈ 0.1587. About 15.9%.',
      responseFormat: 'numeric', hints: ['CLT applies for skewed pop with large n.'], estimatedMinutes: 3 },
    { id: 'try-twomeans', kind: 'try_yourself',
      problem: 'Two breeds of cats: Breed A has μ_A = 9 lbs, σ_A = 1.2 lbs; Breed B has μ_B = 11 lbs, σ_B = 1.5 lbs. Both roughly normal. SRS of 16 from each. Find the sampling distribution of x̄_A − x̄_B and P(x̄_A − x̄_B > -1).',
      expectedAnswer: 'μ_{diff} = 9 − 11 = -2. σ²_{diff} = 1.2²/16 + 1.5²/16 = 0.09 + 0.140625 = 0.230625. σ_{diff} = √0.230625 ≈ 0.4803. Both populations normal → diff is normal. x̄_A − x̄_B ~ N(-2, 0.4803). \nP(x̄_A − x̄_B > -1): z = (-1 − (-2))/0.4803 = 1/0.4803 ≈ 2.082. P(Z > 2.082) ≈ 0.0186. About 1.9%.',
      responseFormat: 'numeric', hints: ['Variances add; standardize diff.'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A textbook claims university students sleep μ = 7 hours per night with σ = 1.2 hours, with a roughly normal distribution. A researcher takes SRS of 36 students and finds x̄ = 6.6 hours. (a) Verify conditions. (b) Find P(x̄ ≤ 6.6 hours) under the claim. (c) Comment on whether this is unusual.',
      expectedAnswer: '(a) Random: SRS ✓. Normal/Large: population ≈ normal AND n = 36 ≥ 30 ✓. 10%: assume student population ≥ 360. ✓ (1)\n(b) μ_x̄ = 7, σ_x̄ = 1.2/√36 = 0.2. x̄ ~ N(7, 0.2). z = (6.6 − 7)/0.2 = -2. P(Z ≤ -2) ≈ 0.0228. (2.5)\n(c) About 2.3% chance of getting x̄ ≤ 6.6 if the claim is true. This is somewhat unusual — the data provide MODERATE evidence that students sleep less than 7 hours. Whether this is "significant" depends on the chosen significance level (typically 5%) — so yes, statistically significant at α = 0.05, but not at α = 0.01. (2)\nTotal: 5.5 points.',
      responseFormat: 'frq', hints: ['Conditions, standardize, interpret tail probability.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'μ_x̄ = μ; σ_x̄ = σ/√n.',
      'Two-sample diff: variances add (independent).',
      'Normal if population normal OR n ≥ 30 (CLT).',
      'Always verify Random, Normal/Large, 10% conditions.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '5', cedTopic: '5.7-5.8', cedTitle: 'Sampling Distribution of x̄', sources: [{ type: 'concept', book: 'tps5e', chapter: '7', note: 'Standard sampling distribution of x̄.' }] },
};
