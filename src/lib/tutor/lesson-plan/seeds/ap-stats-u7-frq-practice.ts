/**
 * AP Statistics — Unit 7 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U7_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u7-frq-practice.v1', title: 'U7 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u7-frq-practice', description: 'Apply Unit 7 inference techniques for means in AP-style FRQs.', standard: 'AP-STATS-7-FRQ' }],
  prerequisites: ['apstats.two-mean-test'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 7 FRQs: one-sample t-CI, paired t-test, two-sample t-test.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'One-sample t: t = (x̄ − μ_0)/(s/√n); df = n − 1.',
      'Two-sample t: SE = √(s²_1/n_1 + s²_2/n_2); df = min(n_1−1, n_2−1) conservative.',
      'Paired: one-sample t on differences.',
      'Conditions: Random, Normal/Large, 10%.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-onesample-ci', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — One-Sample CI. A SRS of 16 light bulbs has mean lifetime x̄ = 1175 hours, s = 75 hours. The data look approximately normal. (a) Construct a 95% CI for the mean lifetime. (b) Verify conditions. (c) The manufacturer claims a mean of at least 1200 hours. Does your CI contradict this claim?',
      expectedAnswer: '(a) n = 16, df = 15. t* for 95%, df=15 ≈ 2.131. SE = 75/√16 = 18.75. ME = 2.131(18.75) ≈ 39.96. CI: 1175 ± 39.96 = (1135.04, 1214.96). (3)\n(b) Random: SRS ✓. Normal/Large: data approximately normal — t-procedures OK with n = 16 < 30 ✓. 10%: assume large bulb population ✓. (1.5)\n(c) The interval (1135.04, 1214.96) INCLUDES 1200. So the data do NOT contradict the manufacturer\'s claim of ≥ 1200 hours — 1200 is a plausible value for the true mean at 95% confidence. (However, 1135 is also plausible — there is uncertainty.) (2)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['t-CI; verify; check whether claim value is in interval.'], estimatedMinutes: 6 },
    { id: 'try-frq-paired', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Matched Pairs. 8 randomly selected drivers each took a SAT exam under both quiet and noisy conditions. SAT score in noisy minus quiet (per driver): -50, -32, -18, -25, -10, -42, -35, -28. (a) Identify the appropriate test. (b) State hypotheses (in terms of mean difference μ_d). (c) Carry out the test at α = 0.05.',
      expectedAnswer: '(a) MATCHED-PAIRS t-test (each driver gives a pair of scores). (1)\n(b) H_0: μ_d = 0 (no difference between quiet and noisy). H_a: μ_d < 0 (noisy < quiet, so noisy minus quiet is negative). (1.5)\n(c) d̄ = (-50 − 32 − 18 − 25 − 10 − 42 − 35 − 28)/8 = -240/8 = -30. \nDeviations from -30: -20, -2, 12, 5, 20, -12, -5, 2. Squared: 400, 4, 144, 25, 400, 144, 25, 4 = 1146. s²_d = 1146/7 ≈ 163.71. s_d ≈ 12.79. \nConditions: Random (assume); Normal/Large of differences (n = 8, must check — assume approximately normal as differences look reasonable); 10% ✓. \nt = (-30 − 0)/(12.79/√8) = -30/4.523 ≈ -6.633. df = 7. \np-value = P(T_7 ≤ -6.633) ≈ 0.000147. \n0.000147 < 0.05 → REJECT H_0. \nConclusion: "Because p ≈ 0.0001 < α = 0.05, we reject H_0. There IS convincing statistical evidence that drivers score LOWER under noisy conditions than quiet conditions on the SAT." (5.5)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Compute mean and SD of differences; one-sample t on differences.'], estimatedMinutes: 7 },
    { id: 'try-frq-twosample', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Two-Sample. Two diet programs randomly assigned to overweight subjects. Diet A: n = 20, mean weight loss x̄ = 12 lbs, s = 5 lbs. Diet B: n = 25, x̄ = 8 lbs, s = 4 lbs. Data plots roughly symmetric. At α = 0.05, test whether Diet A produces greater mean weight loss.',
      expectedAnswer: 'H_0: μ_A = μ_B; H_a: μ_A > μ_B. \nConditions: Random assignment ✓ (clinical trial); Normal/Large: data symmetric, n_A = 20, n_B = 25 — borderline but reasonable ✓; 10%; Independence (separate subjects). (2)\nDiff = 12 − 8 = 4. SE = √(5²/20 + 4²/25) = √(1.25 + 0.64) = √1.89 ≈ 1.375. \nt = 4/1.375 ≈ 2.909. df conservative = min(19, 24) = 19. (2)\np-value = P(T_{19} ≥ 2.909) ≈ 0.00455. (1.5)\n0.00455 < 0.05 → REJECT H_0. (1)\nConclusion: "Because p ≈ 0.005 < α = 0.05, we reject H_0. There IS convincing statistical evidence that Diet A produces greater mean weight loss than Diet B." (1.5)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Independent samples; SE adds variances; conservative df; one-sided.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Use t (not z) when σ unknown. df = n − 1 for one-sample.',
      'Two-sample: variances add; conservative df = min(n_1−1, n_2−1).',
      'Paired: one-sample t on differences.',
      'Conditions: Random, Normal/Large, 10%.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7-FRQ', cedTitle: 'Unit 7 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-7 FRQs.' }] },
};
