/**
 * AP Statistics — CED Unit 9.4+9.5: t-Test for the Slope of a
 * Regression Model.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U9_SLOPE_TEST: LessonPlan = {
  id: 'evelyn.ap.stats.slope-test.v1', title: 'U9.4 t-Test for Slope',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.slope-test', description: 'Set up hypotheses about the population slope β. Compute t-statistic from regression output. Find p-value with df = n − 2. Conclude in context.', standard: 'AP-STATS-9.4-9.5' }],
  prerequisites: ['apstats.slope-ci'], followUps: [], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame slope test.', script: "Test whether x and y have a LINEAR RELATIONSHIP — i.e., whether the population slope β is non-zero. Same t-test machinery; df = n − 2.", estimatedMinutes: 2 },
    { id: 'concept-slope-test', kind: 'concept', goal: 'Cover hypotheses, statistic, p-value.',
      keyIdeas: [
        'HYPOTHESES (about population slope β):',
        '  • H_0: β = 0 (no linear association between x and y).',
        '  • H_a: β ≠ 0 (linear association exists), or β > 0, or β < 0.',
        'TEST STATISTIC: t = (b − 0) / SE(b) = b / SE(b).',
        '  • df = n − 2.',
        'OFTEN REPORTED in regression output: T = b/SE(b), and p = two-sided p-value (matching H_a: β ≠ 0).',
        '  • If your H_a is one-sided, divide the reported two-sided p by 2 (provided observed direction matches H_a).',
        'CONDITIONS: same LINER conditions as for the CI.',
        'INTERPRETATION: "Because p = [#] is [≤ / >] α = [#], we [reject / fail to reject] H_0. There [is / is not] convincing statistical evidence of a linear association between [x in context] and [y in context]."',
        'AP CALCULATOR: LinRegTTest (uses lists). Outputs: t, df, p, b, SE(b), s, R², r.',
        'CONNECTION: r ≠ 0 ⟺ slope ≠ 0. So this slope test is equivalent to a test of H_0: ρ = 0 (correlation = 0). Same t and p.',
        'COMMON MISTAKE: rejecting H_0 means evidence of a LINEAR association — does NOT prove causation, and doesn\'t imply the relationship IS linear (curvature could still exist; the slope is just nonzero on average).',
      ],
      vocabulary: [
        { term: 'slope test', definition: 'tests H_0: β = 0; t = b/SE(b), df = n − 2.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-slope-test', kind: 'worked_example',
      problem: 'A regression of test score (y) on study hours (x) for 30 students gives b = 4.2, SE(b) = 0.9. At α = 0.05, test whether there is a linear association between study hours and test score.',
      steps: [
        'STEP 1 — H_0: β = 0; H_a: β ≠ 0.',
        'STEP 2 — Conditions: assume LINER met.',
        'STEP 3 — t = b/SE(b) = 4.2/0.9 ≈ 4.667. df = 30 − 2 = 28.',
        'STEP 4 — p-value = 2·P(T_{28} ≥ 4.667) ≈ 0.000074.',
        'STEP 5 — 0.000074 < 0.05 → REJECT H_0.',
        'STEP 6 — Conclusion: "Because p < 0.001 < α = 0.05, we reject H_0. There IS convincing statistical evidence of a linear association between study hours and test score."',
      ],
      answer: 't ≈ 4.67, df = 28, p < 0.001 → reject H_0; evidence of linear association.', estimatedMinutes: 4 },
    { id: 'try-test', kind: 'try_yourself',
      problem: 'Output: b = 0.45, SE(b) = 0.30, n = 12. At α = 0.05, test for linear association.',
      expectedAnswer: 'H_0: β = 0; H_a: β ≠ 0. \nt = 0.45/0.30 = 1.50. df = 10. \np-value = 2·P(T_{10} ≥ 1.50) ≈ 2·0.082 ≈ 0.164. \n0.164 > 0.05 → fail to reject H_0. \nConclusion: "Because p ≈ 0.16 > α = 0.05, we fail to reject H_0. There is NOT convincing statistical evidence of a linear association."',
      responseFormat: 'frq', hints: ['t = b/SE(b); 2x for two-sided.'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A regression of HOME PRICE (y, $1000s) on SQUARE FEET (x) for 50 homes gives: \n  Predictor | Coef | SE Coef | T | P\n  Constant: 25.4 | 12.8 | 1.98 | 0.053\n  SqFt: 0.18 | 0.025 | 7.20 | 0.000\n(a) Test whether there is a positive linear association at α = 0.05. (b) Construct a 95% CI for β. (c) Are the CI and test conclusions consistent?',
      expectedAnswer: '(a) H_0: β = 0; H_a: β > 0 (one-sided). t = 0.18/0.025 = 7.20. df = 50 − 2 = 48. \nReported p (two-sided) ≈ 0.000. One-sided p = 0.000/2 < 0.001 (since b > 0 matches H_a direction). \n0.000 < 0.05 → REJECT H_0. \nConclusion: "Because p < 0.001 < α = 0.05, we reject H_0. There IS convincing statistical evidence that home price increases linearly with square footage." (3)\n(b) df = 48, t* for 95% ≈ 2.011. ME = 2.011(0.025) = 0.0503. CI: 0.18 ± 0.0503 = (0.130, 0.230). \nInterpret: "We are 95% confident that each additional square foot is associated with a true mean increase in home price of $130 to $230." (2)\n(c) YES, consistent. The CI (0.130, 0.230) lies ENTIRELY ABOVE 0 — confirms rejection of H_0: β = 0 at the 5% level (95% CI corresponds to two-sided α = 0.05). Both conclude the slope is positive. (1.5)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['One-sided test; CI from same SE; 0 not in CI confirms reject.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      't = b/SE(b); df = n − 2.',
      'Two-sided p reported by software; halve for one-sided when direction matches.',
      'CI and two-sided test at same level give consistent conclusions about H_0: β = 0.',
      'Rejecting H_0 = evidence of linear association (NOT of causation).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9.4-9.5', cedTitle: 'Slope Test', sources: [{ type: 'concept', book: 'tps5e', chapter: '12', note: 'Standard slope t-test.' }] },
};
