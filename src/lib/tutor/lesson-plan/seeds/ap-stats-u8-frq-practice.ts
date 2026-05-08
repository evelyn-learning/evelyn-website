/**
 * AP Statistics — Unit 8 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U8_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u8-frq-practice.v1', title: 'U8 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u8-frq-practice', description: 'Apply Unit 8 chi-square techniques in AP-style FRQs.', standard: 'AP-STATS-8-FRQ' }],
  prerequisites: ['apstats.choosing-categorical-procedures'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Two Unit 8 FRQs: GOF and two-way (homogeneity/independence). Watch for the procedure-selection question — wrong test = lost points.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'GOF: 1 variable, claimed distribution. χ² = Σ(O−E)²/E. df = k−1.',
      'Two-way: E = (row·col)/total. df = (r−1)(c−1).',
      'Homogeneity (multiple populations) vs independence (one sample).',
      'Conditions: Random, all E ≥ 5, 10%.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-gof', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Goodness of Fit. A casino claims a roulette wheel produces results: red 47.4%, black 47.4%, green 5.2%. In 500 spins: red 230, black 250, green 20. (a) Test whether the wheel is fair to the claim at α = 0.05. (b) Compute χ² and p-value. (c) State conclusion in context.',
      expectedAnswer: 'H_0: distribution is (red 0.474, black 0.474, green 0.052). H_a: at least one differs. (1)\nExpected: 500(0.474) = 237; 237; 26. All ≥ 5 ✓. \nConditions: Random spins (assume independence) ✓; Large Counts ✓. (1)\nχ² = (230−237)²/237 + (250−237)²/237 + (20−26)²/26 \n= 49/237 + 169/237 + 36/26 \n= 0.2068 + 0.7131 + 1.3846 ≈ 2.305. (2.5)\ndf = 3 − 1 = 2. p-value = P(χ²_2 ≥ 2.305) ≈ 0.316. (1)\n0.316 > 0.05 → fail to reject H_0. (1)\nConclusion: "Because p ≈ 0.32 > α = 0.05, we fail to reject H_0. There is NOT convincing statistical evidence that the wheel\'s output deviates from the casino\'s claimed distribution." (1.5)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Hypotheses; expecteds; χ²; df; p; conclude.'], estimatedMinutes: 7 },
    { id: 'try-frq-twoway', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Two-Way. Three random samples of 100 commuters each from three cities: \n  | Walk | Bike | Drive | Total\n  City A: 25 | 15 | 60 | 100\n  City B: 35 | 25 | 40 | 100\n  City C: 15 | 10 | 75 | 100\n(a) Identify the appropriate test (GOF / homogeneity / independence). Justify. (b) State hypotheses. (c) Test at α = 0.05.',
      expectedAnswer: '(a) HOMOGENEITY — three SEPARATE random samples (one from each city) — multiple populations. (1.5)\n(b) H_0: distribution of commute mode is the SAME across the three cities. H_a: distributions DIFFER. (1.5)\n(c) Column totals: walk = 75; bike = 50; drive = 175. Grand total: 300. \nExpected (using row total = 100 for each city): \nE_walk = 100(75)/300 = 25 (each city). E_bike = 100(50)/300 ≈ 16.67. E_drive = 100(175)/300 ≈ 58.33. \nAll ≥ 5 ✓. \nχ² = (25−25)²/25 + (15−16.67)²/16.67 + (60−58.33)²/58.33 + (35−25)²/25 + (25−16.67)²/16.67 + (40−58.33)²/58.33 + (15−25)²/25 + (10−16.67)²/16.67 + (75−58.33)²/58.33 \n= 0 + 0.167 + 0.048 + 4 + 4.165 + 5.762 + 4 + 2.667 + 4.764 \n= 25.573. (3)\ndf = (3−1)(3−1) = 4. p-value = P(χ²_4 ≥ 25.573) ≈ 0.000040. \n0.000040 < 0.05 → REJECT H_0. (1.5)\nConclusion: "Because p < 0.001 < α = 0.05, we reject H_0. There IS convincing statistical evidence that commute-mode distributions DIFFER across the three cities." (1.5)\nTotal: 9 points.',
      responseFormat: 'frq', hints: ['Three separate samples → homogeneity; expecteds; χ²; conclude.'], estimatedMinutes: 8 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'GOF for 1 variable; two-way for 2 variables.',
      'Multiple samples = homogeneity. One sample = independence.',
      'E = (row·col)/total. df = (r−1)(c−1).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8-FRQ', cedTitle: 'Unit 8 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-8 FRQs.' }] },
};
