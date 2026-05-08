/**
 * AP Statistics — Unit 9 FRQ Practice (and procedure-selection capstone).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U9_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u9-frq-practice.v1', title: 'U9 FRQ Practice and Procedure Selection',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u9-frq-practice', description: 'Apply Unit 9 slope inference and the broader inference-procedure-selection skill from CED 9.6.', standard: 'AP-STATS-9-FRQ' }],
  prerequisites: ['apstats.slope-test'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Two Unit 9 FRQs plus a procedure-selection capstone. The AP exam ALWAYS includes one or more questions where you must pick the right inference procedure from scratch.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh + capstone procedure selection.', keyIdeas: [
      'Slope inference (Unit 9): t = b/SE(b); df = n − 2; LINER conditions.',
      'COMPLETE INFERENCE PROCEDURE SELECTION TREE:',
      '  • One quantitative variable: 1-sample t (CI or test).',
      '  • Two paired quantitative measurements: matched-pairs t (one-sample t on differences).',
      '  • Two independent quantitative samples: 2-sample t.',
      '  • One categorical variable, 2 categories: 1-prop z.',
      '  • One categorical variable, ≥ 3 categories with claimed distribution: chi-square GOF.',
      '  • Two categorical variables, 2 each: 2-prop z OR chi-square (equivalent).',
      '  • Two categorical variables, ≥ 3 cats either, multiple populations: chi-square HOMOGENEITY.',
      '  • Two categorical variables, ≥ 3 cats either, one population: chi-square INDEPENDENCE.',
      '  • Bivariate quantitative, slope of LSRL: t-test (or CI) on β; df = n − 2.',
      'Conditions: each procedure has its OWN — Random/Independence + Normal-style condition + sample-size rule.',
    ], estimatedMinutes: 3 },
    { id: 'try-frq-slope-ci', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Slope CI. A regression of car gas mileage (y, mpg) on weight (x, lbs) for 50 cars: \n  Predictor | Coef | SE Coef | T | P\n  Constant: 45.2 | 2.1 | 21.5 | 0.000\n  Weight: -0.0085 | 0.0011 | -7.73 | 0.000\n  s = 2.5, R-Sq = 56.0%. \n(a) Construct a 95% CI for β. (b) Interpret. (c) Does the data provide convincing evidence that car weight is associated with mpg?',
      expectedAnswer: '(a) df = 50 − 2 = 48. t* for 95% with df = 48 ≈ 2.011 (use 2.000 or 2.021 if rounding). ME = 2.011(0.0011) ≈ 0.00221. CI: -0.0085 ± 0.00221 = (-0.01071, -0.00629). (3)\n(b) "We are 95% confident that each additional pound of weight is associated with a true mean DECREASE in gas mileage of between 0.0063 and 0.0107 mpg. Equivalently, each additional 100 lbs decreases mileage by about 0.6 to 1.1 mpg." (2)\n(c) YES. The CI (-0.01071, -0.00629) lies ENTIRELY BELOW 0 — does not contain 0. So at the 95% confidence level, there is convincing evidence the slope is non-zero (specifically negative — heavier cars get lower mileage). (1.5)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['SE from output; CI; check 0 inclusion.'], estimatedMinutes: 6 },
    { id: 'try-frq-slope-test', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Slope Test. Output: a regression of cricket chirps per second (x) on temperature (y, °F) for 14 nights gives b = 3.29, SE(b) = 0.605. (a) State hypotheses for testing positive linear association. (b) Compute t and p. (c) Conclude at α = 0.01.',
      expectedAnswer: '(a) H_0: β = 0; H_a: β > 0 (positive linear association). (1)\n(b) t = b/SE(b) = 3.29/0.605 ≈ 5.438. df = 14 − 2 = 12. \np-value = P(T_{12} ≥ 5.438) ≈ 0.000077 (very small, one-sided). (3)\n(c) 0.000077 < α = 0.01 → REJECT H_0. \nConclusion: "Because p ≈ 0.0001 < α = 0.01, we reject H_0. There IS convincing statistical evidence of a positive linear association between cricket chirps per second and temperature." (2)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['t = b/SE(b); one-sided p; conclude.'], estimatedMinutes: 6 },
    { id: 'try-frq-procedure', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Procedure Selection. For each scenario, identify the appropriate inference procedure (give name + justification): \n(a) A SRS of 200 likely voters: 110 say they\'ll vote yes on a measure. Test whether the proportion exceeds 50%. \n(b) Two SRSs of 80 students each from two universities; record their final exam scores. Test whether mean scores differ. \n(c) One SRS of 300 employees; record gender and department. Test whether gender and department are associated. \n(d) A regression of test score on study hours for 30 students. Test whether the slope is positive. \n(e) 25 SRSs of 50 students, each from a different school. Record favorite subject. Test whether subject distribution is the same across schools.',
      expectedAnswer: '(a) ONE-PROPORTION z-TEST. One variable, two categories (yes/no), claimed proportion 0.50. (1)\n(b) TWO-SAMPLE t-TEST for difference of means. Two independent samples, comparing means. (1)\n(c) CHI-SQUARE INDEPENDENCE. One sample classified by two categorical variables. (1)\n(d) t-TEST FOR THE SLOPE β. Bivariate quantitative; one-sided H_a: β > 0. (1)\n(e) CHI-SQUARE HOMOGENEITY. 25 separate populations (schools), one categorical response (subject), distribution-comparison across populations. (1)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Walk through the inference-procedure decision tree.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Slope: t = b/SE(b); df = n − 2; LINER conditions.',
      'AP exam tests procedure selection — practice walking the tree.',
      'Always state H_0/H_a, conditions, calculation, conclusion in context.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9-FRQ', cedTitle: 'Unit 9 FRQ + Procedure Selection', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-9 FRQs + capstone procedure selection.' }] },
};
