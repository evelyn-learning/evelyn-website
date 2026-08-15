/**
 * AP Statistics — CED Unit 6.10+6.11: Two-Proportion z-Test (uses pooled
 * proportion).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U6_TWO_PROP_TEST: LessonPlan = {
  id: 'evelyn.ap.stats.two-prop-test.v1', title: 'U6.10 Two-Proportion z-Test',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.two-prop-test', description: 'Set up hypotheses for a difference of two proportions. Use the POOLED proportion p̂_c in the SE for the test statistic. Compute z, find p-value, conclude in context.', standard: 'AP-STATS-6.10-6.11' }],
  prerequisites: ['apstats.two-prop-ci'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame two-proportion test.', script: "When testing whether two proportions are EQUAL, we POOL the samples to estimate the common proportion under H_0 — this gives a better estimate of the SE than using each p̂ separately.", estimatedMinutes: 2 },
    { id: 'concept-twoprop-test', kind: 'concept', goal: 'Cover hypotheses, pooled proportion, test statistic, conclusion.',
      keyIdeas: [
        'HYPOTHESES (H_0 says p_1 = p_2):',
        '  • H_0: p_1 = p_2 (or equivalently p_1 − p_2 = 0).',
        '  • H_a: p_1 ≠ p_2 OR p_1 < p_2 OR p_1 > p_2.',
        'POOLED PROPORTION p̂_c (for use under H_0): p̂_c = (x_1 + x_2)/(n_1 + n_2). Combines both samples.',
        'TEST STATISTIC: z = (p̂_1 − p̂_2) / √(p̂_c(1−p̂_c)·(1/n_1 + 1/n_2)).',
        '  • Note: SE here uses POOLED p̂_c (single estimate of common p under H_0). DIFFERENT from CI which uses separate p̂s.',
        'P-VALUE: from standard normal table based on H_a direction (left, right, or two-tail).',
        'CONDITIONS:',
        '  • RANDOM: independent random samples or random assignment.',
        '  • LARGE COUNTS using POOLED p̂_c: n_1·p̂_c ≥ 10, n_1·(1−p̂_c) ≥ 10, n_2·p̂_c ≥ 10, n_2·(1−p̂_c) ≥ 10.',
        '  • 10%: each sample ≤ 10% of its population.',
        'WHEN TO USE POOLED vs SEPARATE:',
        '  • CI: separate p̂s (since H_0 is not assumed in CIs).',
        '  • TEST: pooled p̂_c (H_0 says p_1 = p_2 = p, common proportion).',
        'AP COMMON ERROR: using separate p̂s in the test SE. Always pool when H_0 specifies equality.',
        'CONCLUSION TEMPLATE: same as one-prop test, with parameters in context.',
      ],
      vocabulary: [
        { term: 'pooled proportion', definition: 'p̂_c = combined success proportion across both samples; used in test SE under H_0: p_1 = p_2.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-twoprop-test', kind: 'worked_example',
      problem: 'Hospital A: 18 of 200 patients had complications. Hospital B: 25 of 250. At α = 0.05, test if complication rates differ.',
      steps: [
        'STEP 1 — p̂_A = 18/200 = 0.09; p̂_B = 25/250 = 0.10. Diff: -0.01.',
        'STEP 2 — H_0: p_A = p_B; H_a: p_A ≠ p_B (two-sided).',
        'STEP 3 — Pooled: p̂_c = (18 + 25)/(200 + 250) = 43/450 ≈ 0.0956.',
        'STEP 4 — Conditions: Random (assume). Large Counts (using p̂_c): 200(0.0956) ≈ 19.1 ≥ 10 ✓; 200(0.9044) ≈ 180.9 ≥ 10 ✓; 250(0.0956) ≈ 23.9 ≥ 10 ✓; 250(0.9044) ≈ 226.1 ≥ 10 ✓.',
        'STEP 5 — SE = √(0.0956·0.9044·(1/200 + 1/250)) = √(0.0865·(0.005 + 0.004)) = √(0.0865·0.009) = √0.000778 ≈ 0.02790.',
        'STEP 6 — z = (-0.01 − 0)/0.02790 ≈ -0.358.',
        'STEP 7 — p-value = 2·P(Z ≤ -0.358) = 2·0.3601 ≈ 0.7203.',
        'STEP 8 — 0.7203 > 0.05 → fail to reject H_0.',
        'STEP 9 — Conclusion: "Because p = 0.72 > α = 0.05, we fail to reject H_0. There is NOT convincing statistical evidence of a difference in complication rates between the two hospitals."',
      ],
      answer: 'z ≈ -0.36; p ≈ 0.72. Fail to reject H_0.', estimatedMinutes: 6 },
    { id: 'try-test', kind: 'try_yourself',
      problem: 'A new ad campaign: 80 of 200 viewers in city A bought; 60 of 200 in city B bought. At α = 0.05, test whether buying rates differ.',
      expectedAnswer: 'p̂_A = 0.40; p̂_B = 0.30. Diff: 0.10. \nH_0: p_A = p_B; H_a: p_A ≠ p_B. \np̂_c = (80 + 60)/(200 + 200) = 140/400 = 0.35. \nLarge Counts (using p̂_c): 200(0.35) = 70 ≥ 10 ✓; 200(0.65) = 130 ≥ 10 ✓ (both samples). \nSE = √(0.35·0.65·(1/200 + 1/200)) = √(0.2275·0.01) = √0.002275 ≈ 0.0477. \nz = (0.10 − 0)/0.0477 ≈ 2.097. \np-value = 2·P(Z ≥ 2.097) = 2·0.0179 ≈ 0.0358. \nDecision: 0.0358 < 0.05 → REJECT H_0. \nConclusion: "Because p = 0.036 < α = 0.05, we reject H_0. There IS convincing statistical evidence that buying rates differ between cities A and B (with city A higher in this sample)."',
      responseFormat: 'frq', hints: ['Pool first; verify Large Counts with p̂_c; compute z; conclude in context.'], estimatedMinutes: 6 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A study tests whether a new vaccine reduces flu incidence (compared to placebo). Vaccine group: 35 of 500 got flu. Placebo group: 60 of 500 got flu. At α = 0.05, test whether the vaccine reduces flu rate.',
      expectedAnswer: 'p̂_vac = 35/500 = 0.07; p̂_plac = 60/500 = 0.12. \nH_0: p_vac = p_plac; H_a: p_vac < p_plac (one-sided — vaccine reduces flu). \np̂_c = (35 + 60)/(500 + 500) = 95/1000 = 0.095. \nConditions: Random (clinical trial, assume RA). Large Counts: 500(0.095) = 47.5 ≥ 10; 500(0.905) = 452.5 ≥ 10 (both) ✓. (2)\nSE = √(0.095·0.905·(1/500 + 1/500)) = √(0.0860·0.004) = √0.000344 ≈ 0.0185. \nz = (0.07 − 0.12)/0.0185 ≈ -2.70. (2)\np-value (left-tail) = P(Z ≤ -2.70) ≈ 0.00347. (1)\n0.00347 < α = 0.05 → REJECT H_0. (1)\nConclusion: "Because p = 0.0035 < α = 0.05, we reject H_0. There IS convincing statistical evidence that the new vaccine reduces flu rate compared to placebo." (2)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['One-sided; pool; z-stat; small p means reject.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'TEST: pool to get p̂_c = (x_1 + x_2)/(n_1 + n_2).',
      'SE_test = √(p̂_c(1−p̂_c)·(1/n_1 + 1/n_2)). Pooled.',
      'CI uses separate p̂s; TEST uses pooled p̂_c.',
      'Verify Large Counts using POOLED p̂_c.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.10-6.11', cedTitle: 'Two-Proportion z-Test', sources: [{ type: 'concept', book: 'tps5e', chapter: '10', note: 'Standard 2-prop z-test.' }] },
};
