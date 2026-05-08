/**
 * AP Statistics — CED Unit 7.7+7.8: Two-Sample t-CI for Difference of
 * Means.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U7_TWO_MEAN_CI: LessonPlan = {
  id: 'evelyn.ap.stats.two-mean-ci.v1', title: 'U7.7 Two-Sample t-CI for Difference of Means',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.two-mean-ci', description: 'Construct two-sample t-CI for μ_1 − μ_2 (independent samples). Verify conditions in both samples. Recognize matched-pairs as a one-sample t-CI on differences.', standard: 'AP-STATS-7.7-7.8' }],
  prerequisites: ['apstats.one-mean-test'], followUps: ['apstats.two-mean-test'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame two-mean CI.', script: "Two independent groups, each with its own mean. The two-sample t-CI gives a range of plausible values for the DIFFERENCE μ_1 − μ_2. Special case: matched pairs uses a ONE-sample t on differences.", estimatedMinutes: 2 },
    { id: 'concept-twomean-ci', kind: 'concept', goal: 'Cover formula, conditions, matched pairs.',
      keyIdeas: [
        'TWO-SAMPLE t-CI (independent samples): (x̄_1 − x̄_2) ± t* · √(s²_1/n_1 + s²_2/n_2).',
        '  • SE = √(s²_1/n_1 + s²_2/n_2). VARIANCES ADD (independence).',
        '  • df: AP uses CALCULATOR-determined df (Welch-Satterthwaite formula). For hand calculations, use the smaller of n_1 − 1 and n_2 − 1 (CONSERVATIVE — gives wider CI).',
        '  • t* from the chosen df.',
        'CONDITIONS:',
        '  • RANDOM: independent random samples or random assignment.',
        '  • NORMAL/LARGE: each population normal, OR each n ≥ 30, OR both sample plots are roughly normal-shaped.',
        '  • 10% in EACH population if sampling without replacement.',
        'INDEPENDENCE: the two samples are independent (e.g., not paired).',
        'INTERPRETATION: "We are C% confident that the true difference μ_1 − μ_2 (specify which) is between [lower] and [upper]." If 0 is in the interval, no evidence of a difference at this confidence level.',
        'MATCHED-PAIRS DESIGN: each subject contributes a PAIR of values (e.g., before/after, left/right hand). Compute differences d_i = X_i − Y_i for each pair, then do a ONE-SAMPLE t-CI ON THE DIFFERENCES. Don\'t use the two-sample formula.',
        'AP COMMON ERROR: applying two-sample formula when data is paired. Always check for pairing first.',
      ],
      vocabulary: [
        { term: 'matched-pairs design', definition: 'each unit gives a pair of measurements; analyze with one-sample t on differences.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-twomean', kind: 'worked_example',
      problem: 'Compare height of two breeds of dog. Breed A: 25 dogs, x̄ = 14.2 in, s = 1.8. Breed B: 20 dogs, x̄ = 12.6 in, s = 2.1. Both samples random; data plots approximately normal. Construct a 95% CI for μ_A − μ_B.',
      steps: [
        'STEP 1 — Conditions: Random ✓; Normal/Large: data plots approx normal ✓; 10% ✓.',
        'STEP 2 — Diff: 14.2 − 12.6 = 1.6.',
        'STEP 3 — SE = √(1.8²/25 + 2.1²/20) = √(0.1296 + 0.2205) = √0.3501 ≈ 0.5917.',
        'STEP 4 — Conservative df = min(25 − 1, 20 − 1) = 19. t* for 95% with df = 19 ≈ 2.093. (Calculator using Welch df ≈ 38, t* ≈ 2.024 — narrower.)',
        'STEP 5 — ME = 2.093(0.5917) ≈ 1.238 (conservative). \n  Or with calculator df: 2.024(0.5917) ≈ 1.198.',
        'STEP 6 — CI: 1.6 ± 1.238 = (0.362, 2.838) using conservative df.',
        'STEP 7 — Interpret: "We are 95% confident that the true difference (Breed A − Breed B) in height is between 0.36 and 2.84 inches. Since 0 is NOT in the interval, evidence Breed A is taller on average."',
      ],
      answer: '95% CI: (0.36, 2.84) inches; significant difference (A taller).', estimatedMinutes: 5 },
    { id: 'try-paired', kind: 'try_yourself',
      problem: 'A study measures blood pressure of 12 patients before and after taking a drug. Differences (before − after): mean d̄ = 8 mmHg, s_d = 5 mmHg. Construct a 90% CI for the true mean reduction.',
      expectedAnswer: 'PAIRED data: treat differences as one sample. n = 12, df = 11. t* for 90% with df = 11 ≈ 1.796. SE = s_d/√n = 5/√12 ≈ 1.443. ME = 1.796(1.443) ≈ 2.592. CI: 8 ± 2.592 = (5.41, 10.59). \nConditions: Random (assume); Normal/Large of differences: n = 12 < 30, must check (assume diffs symmetric); 10%. \nInterpret: "We are 90% confident that the true mean reduction in blood pressure is between 5.41 and 10.59 mmHg."',
      responseFormat: 'frq', hints: ['Paired = one-sample t on differences.'], estimatedMinutes: 5 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. Two independent SRSs of test scores. Group X: n = 30, x̄ = 75, s = 8. Group Y: n = 35, x̄ = 70, s = 10. Both data plots roughly symmetric. (a) Construct a 95% CI for μ_X − μ_Y. (b) Does the interval suggest a difference? Justify.',
      expectedAnswer: '(a) Conditions: Random ✓; Normal/Large: both n ≥ 30 (CLT) ✓; 10% (assume large pops) ✓. \nDiff = 75 − 70 = 5. SE = √(8²/30 + 10²/35) = √(2.133 + 2.857) = √4.990 ≈ 2.234. \nConservative df = min(29, 34) = 29. t* for 95% df=29 ≈ 2.045. (Calculator df ≈ 62, t* ≈ 2.000.) \nME = 2.045(2.234) ≈ 4.568 (conservative). \nCI: 5 ± 4.568 = (0.43, 9.57) (conservative). (4)\n(b) The interval (0.43, 9.57) does NOT contain 0. We are 95% confident that the true mean of Group X exceeds Group Y by between 0.43 and 9.57 points. Yes, evidence of a difference. (1.5)\nTotal: 5.5 points.',
      responseFormat: 'frq', hints: ['Conditions; SE adds variances; df conservative.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Two-sample t-CI: (x̄_1 − x̄_2) ± t*·√(s²_1/n_1 + s²_2/n_2).',
      'df conservative: min(n_1 − 1, n_2 − 1). Calculator gives Welch df.',
      'Variances ADD (independence).',
      'PAIRED data → one-sample t on differences.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.7-7.8', cedTitle: 'Two-Sample t-CI', sources: [{ type: 'concept', book: 'tps5e', chapter: '10', note: 'Standard 2-sample t-interval.' }] },
};
