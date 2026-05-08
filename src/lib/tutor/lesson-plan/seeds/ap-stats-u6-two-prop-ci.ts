/**
 * AP Statistics — CED Unit 6.8+6.9: Two-Proportion z-Confidence Interval.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U6_TWO_PROP_CI: LessonPlan = {
  id: 'evelyn.ap.stats.two-prop-ci.v1', title: 'U6.8 Two-Proportion z-Interval',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.two-prop-ci', description: 'Construct and interpret a two-proportion z-CI for the difference p_1 − p_2. Verify conditions in both samples. Use the interval to assess whether two proportions differ.', standard: 'AP-STATS-6.8-6.9' }],
  prerequisites: ['apstats.test-errors'], followUps: ['apstats.two-prop-test'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame two-proportion CI.', script: "Often we want to know if TWO populations differ in proportion — men vs women, treatment vs control. The two-proportion z-CI gives a range of plausible values for the DIFFERENCE p_1 − p_2.", estimatedMinutes: 2 },
    { id: 'concept-twoprop-ci', kind: 'concept', goal: 'Cover formula, conditions, interpretation.',
      keyIdeas: [
        'TWO-PROPORTION z-CI: (p̂_1 − p̂_2) ± z* · √(p̂_1(1−p̂_1)/n_1 + p̂_2(1−p̂_2)/n_2).',
        '  • POINT ESTIMATE: p̂_1 − p̂_2 (NOT pooled — for CI, use separate p̂s).',
        '  • SE = √(p̂_1(1−p̂_1)/n_1 + p̂_2(1−p̂_2)/n_2). Variances ADD.',
        '  • z* same as one-proportion CI (1.96 for 95%, etc.).',
        'CONDITIONS to verify (BOTH samples):',
        '  • RANDOM: independent random samples or random assignment.',
        '  • LARGE COUNTS: in each sample: n_1 p̂_1 ≥ 10, n_1(1−p̂_1) ≥ 10, n_2 p̂_2 ≥ 10, n_2(1−p̂_2) ≥ 10.',
        '  • 10%: each sample is < 10% of its respective population.',
        'INTERPRETATION: "We are C% confident that the TRUE DIFFERENCE p_1 − p_2 is between [lower] and [upper]." Always specify which is which (e.g., women minus men).',
        'USING A CI TO TEST FOR A DIFFERENCE: if 0 is IN the interval, no evidence of a difference at this confidence level. If 0 is OUTSIDE, evidence of a difference.',
        '  • Example: CI = (-0.05, 0.10) contains 0 → not enough evidence to conclude p_1 ≠ p_2.',
        '  • CI = (0.02, 0.15) does not contain 0 → evidence p_1 > p_2 at this confidence level.',
        'AP COMMON ERROR: only checking conditions in ONE sample. Both must be checked.',
      ],
      vocabulary: [
        { term: 'two-proportion z-interval', definition: '(p̂_1 − p̂_2) ± z*·√(p̂_1(1−p̂_1)/n_1 + p̂_2(1−p̂_2)/n_2).' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-twoprop', kind: 'worked_example',
      problem: 'A study compares smoking rates: 60 of 200 men smoke (p̂_1 = 0.30); 40 of 250 women smoke (p̂_2 = 0.16). Construct a 95% CI for p_1 − p_2 (men − women).',
      steps: [
        'STEP 1 — p̂_1 = 0.30, p̂_2 = 0.16. Difference: 0.30 − 0.16 = 0.14.',
        'STEP 2 — Conditions: Random ✓. Large Counts: 200(0.3) = 60 ≥ 10, 200(0.7) = 140 ≥ 10, 250(0.16) = 40 ≥ 10, 250(0.84) = 210 ≥ 10 ✓. 10%: assume large populations ✓.',
        'STEP 3 — SE = √(0.3·0.7/200 + 0.16·0.84/250) = √(0.00105 + 0.000538) = √0.001588 ≈ 0.0399.',
        'STEP 4 — z* = 1.96 for 95%. ME = 1.96(0.0399) ≈ 0.0782.',
        'STEP 5 — CI: 0.14 ± 0.0782 = (0.0618, 0.2182).',
        'STEP 6 — Interpret: "We are 95% confident that the true difference (men minus women) in smoking rates is between about 6.2% and 21.8%." Since 0 is NOT in the interval, evidence men smoke at higher rate.',
      ],
      answer: '95% CI: (0.062, 0.218); 0 not in interval → significant difference.', estimatedMinutes: 5 },
    { id: 'try-interpret', kind: 'try_yourself',
      problem: 'A 90% CI for p_A − p_B (treatment minus control) is (-0.02, 0.08). What can we conclude about the difference?',
      expectedAnswer: 'Since 0 is in the interval (between -0.02 and 0.08), we do NOT have convincing statistical evidence that p_A and p_B differ at the 90% confidence level. The data are consistent with p_A = p_B (no difference).',
      responseFormat: 'free', hints: ['Does the CI contain 0?'], estimatedMinutes: 2 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. In a clinical trial: 25 of 100 placebo patients improved; 40 of 100 treated patients improved. (a) Construct a 99% CI for the difference p_treat − p_placebo. (b) State a conclusion in context.',
      expectedAnswer: '(a) p̂_treat = 0.40, p̂_plac = 0.25. Diff = 0.15. SE = √(0.4·0.6/100 + 0.25·0.75/100) = √(0.0024 + 0.001875) = √0.004275 ≈ 0.0654. \nz* = 2.576 for 99%. ME = 2.576(0.0654) ≈ 0.1685. CI: 0.15 ± 0.1685 = (-0.0185, 0.3185). \nConditions: Random (assume randomized assignment). Large Counts: 100(0.4) = 40, 100(0.6) = 60, 100(0.25) = 25, 100(0.75) = 75 — all ≥ 10 ✓. (5)\n(b) "We are 99% confident that the true difference (treatment minus placebo) in improvement rates is between -1.85% and 31.85%. Since 0 IS in this interval, we do NOT have convincing statistical evidence at the 99% level that the treatment is more effective than placebo. (At 95%, the interval would not contain 0 and we WOULD conclude the treatment is better. The high confidence level requires more evidence.)" (2)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['SE adds variances; check 0 in interval; confidence level affects width.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'CI: (p̂_1 − p̂_2) ± z*·√(p̂_1(1−p̂_1)/n_1 + p̂_2(1−p̂_2)/n_2).',
      'Conditions: BOTH samples Random, Large Counts (each), 10%.',
      '0 in interval → not enough evidence for a difference at this confidence level.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.8-6.9', cedTitle: 'Two-Proportion z-CI', sources: [{ type: 'concept', book: 'tps5e', chapter: '10', note: 'Standard 2-prop z-interval.' }] },
};
