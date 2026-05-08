/**
 * AP Statistics — Unit 5 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U5_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u5-frq-practice.v1', title: 'U5 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u5-frq-practice', description: 'Apply Unit 5 sampling-distribution techniques.', standard: 'AP-STATS-5-FRQ' }],
  prerequisites: ['apstats.means-sampling-dist'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 5 FRQs on sampling distributions for proportions, means, and differences.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'p̂: μ_p̂ = p; σ_p̂ = √(p(1−p)/n). Conditions: Random, Large Counts (np ≥ 10, n(1−p) ≥ 10), 10%.',
      'x̄: μ_x̄ = μ; σ_x̄ = σ/√n. Conditions: Random, Normal/Large (population normal OR n ≥ 30), 10%.',
      'Two-sample difference: variances ADD.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-prop', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Proportion. A school claims 75% of its graduates attend college. Skeptical, an investigator surveys SRS of 80 graduates and finds 52 attended college (p̂ = 0.65). (a) Verify conditions for normal approximation. (b) If the claim is TRUE, what is the probability of obtaining p̂ ≤ 0.65? (c) What does this suggest about the claim?',
      expectedAnswer: '(a) Random: SRS ✓. Large Counts (assuming claim p = 0.75): np = 80(0.75) = 60 ≥ 10 ✓; n(1−p) = 80(0.25) = 20 ≥ 10 ✓. 10%: assume school has > 800 grads. ✓ (1.5)\n(b) μ_p̂ = 0.75, σ_p̂ = √(0.75·0.25/80) = √(0.002344) ≈ 0.0484. z = (0.65 − 0.75)/0.0484 ≈ -2.066. P(Z ≤ -2.066) ≈ 0.0194. (3)\n(c) The probability of getting p̂ ≤ 0.65 is only about 1.9% if the school\'s claim were true. This is unusual evidence — the true graduation-to-college rate is likely LESS than 75%. (2)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['Conditions; standardize; interpret tail probability.'], estimatedMinutes: 6 },
    { id: 'try-frq-mean', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Mean. Daily commuting time in a city has μ = 30 minutes, σ = 12 minutes, right-skewed. SRS of 50 commuters. (a) Find the sampling distribution of x̄. (b) What is the probability that the sample mean exceeds 33 minutes? (c) Without computing, would the probability in (b) INCREASE or DECREASE if n = 200? Justify.',
      expectedAnswer: '(a) μ_x̄ = 30. σ_x̄ = 12/√50 ≈ 1.697. n = 50 ≥ 30 → CLT applies. x̄ ~ N(30, 1.697) approximately. (2)\n(b) z = (33 − 30)/1.697 ≈ 1.768. P(Z > 1.768) ≈ 0.0385. About 3.85%. (2.5)\n(c) DECREASE. With n = 200, σ_x̄ = 12/√200 ≈ 0.849 — about half the SD with n = 50. The sampling distribution is tighter around 30, so P(x̄ > 33) becomes much smaller (≈ 0.000196). Larger n → less variability → less likely to see extreme x̄. (2)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['CLT for skewed; standardize; reason about σ_x̄.'], estimatedMinutes: 6 },
    { id: 'try-frq-twomeans', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Difference of Two Means. Brand A and Brand B batteries: Brand A has μ_A = 750 hrs, σ_A = 60 hrs; Brand B has μ_B = 720 hrs, σ_B = 80 hrs. Both populations normal. Independent SRSs of size 36 from each brand. Let D = x̄_A − x̄_B. (a) Find μ_D and σ_D. (b) Find P(D > 50). (c) Find P(D < 0). What does this represent in context?',
      expectedAnswer: '(a) μ_D = 750 − 720 = 30. σ²_D = 60²/36 + 80²/36 = 100 + 177.78 = 277.78. σ_D = √277.78 ≈ 16.67. (2.5)\n(b) Standardize: z = (50 − 30)/16.67 ≈ 1.20. P(Z > 1.20) ≈ 0.1151. About 11.5%. (2)\n(c) z = (0 − 30)/16.67 ≈ -1.80. P(Z < -1.80) ≈ 0.0359. About 3.6%. \nThis is the probability that x̄_A < x̄_B — i.e., that in a randomly chosen pair of samples, Brand A\'s sample mean falls BELOW Brand B\'s sample mean (despite Brand A having higher true mean). Counter-intuitive but possible due to sampling variability. (2.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Variances add; interpret D < 0 in context.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Standard error: σ_p̂ = √(p(1−p)/n); σ_x̄ = σ/√n.',
      'Verify conditions: Random, Normal/Large or Large Counts, 10%.',
      'Two-sample difference: variances ADD.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '5', cedTopic: '5-FRQ', cedTitle: 'Unit 5 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-5 FRQs.' }] },
};
