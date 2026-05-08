/**
 * AP Calculus BC — Unit 6 FRQ Practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u6-frq-practice.v1',
  title: 'U6 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u6-frq-practice', description: 'Apply Unit 6 integration techniques in multi-part FRQs.', standard: 'AP-CALCBC-6-FRQ' }],
  prerequisites: ['apcalcbc.integration-strategy'],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Set Unit 6 FRQ stakes — biggest unit on the BC exam.',
      script: "Unit 6 is the largest content area on the BC exam (17-20%). FRQs test FTC, Riemann sums, integration techniques, and improper integrals. Three problems incoming.",
      estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresher on Unit 6 FRQ scoring.',
      keyIdeas: [
        'Show all integration steps. Identify technique used.',
        'For FTC Part 1: state the formula explicitly with chain rule when applicable.',
        'For Riemann sums: show Δx; show explicit sum; identify L/R/M/Trap.',
        'For improper integrals: explicit limit setup; do not skip the lim notation.',
      ],
      estimatedMinutes: 2 },
    { id: 'try-frq-techniques', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Integration Techniques. Evaluate each. (a) ∫_0^2 x² · e^(x³) dx. (b) ∫ x sin x dx. (c) ∫ 1/(x² − 1) dx.',
      expectedAnswer: '(a) U-SUB: u = x³, du = 3x² dx, x² dx = du/3. New limits: x=0→u=0; x=2→u=8. ∫_0^8 e^u·(1/3) du = (1/3)(e^8 − 1). (2.5)\n(b) BY PARTS: u = x, dv = sin x dx. du = dx, v = -cos x. ∫ x sin x dx = -x cos x + ∫ cos x dx = -x cos x + sin x + C. (2)\n(c) PARTIAL FRACTIONS: 1/[(x−1)(x+1)] = A/(x−1) + B/(x+1). 1 = A(x+1) + B(x−1). x=1: 1 = 2A → A=1/2. x=-1: 1 = -2B → B=-1/2. Integral = (1/2) ln|x−1| − (1/2) ln|x+1| + C = (1/2) ln|(x−1)/(x+1)| + C. (2.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Identify technique for each, execute step by step.'], estimatedMinutes: 8 },
    { id: 'try-frq-ftc', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — FTC. Let g(x) = ∫_0^x (t² − 4) dt. (a) Find g\'(x). (b) Find all critical points of g and classify each. (c) Find g(3) explicitly. (d) Use g\'(x) directly to find an interval where g is INCREASING.',
      expectedAnswer: '(a) FTC Part 1: g\'(x) = x² − 4. (1.5)\n(b) Critical: g\'(x) = 0 → x² = 4 → x = ±2. Use g\'\' = 2x. g\'\'(2) = 4 > 0 → local min. g\'\'(-2) = -4 < 0 → local max. (2.5)\n(c) g(3) = ∫_0^3 (t² − 4) dt = [t³/3 − 4t]_0^3 = 9 − 12 = -3. (1.5)\n(d) g\'(x) > 0 when x² > 4, i.e., |x| > 2. So g is increasing on (-∞, -2) and (2, ∞). (1.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['FTC Part 1 gives g\' directly. Critical points + concavity test.'], estimatedMinutes: 7 },
    { id: 'try-frq-improper', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Riemann Sums + Improper Integral. (a) Use the trapezoidal rule with n = 4 to approximate ∫_0^2 e^x dx. Compare to the exact value. (b) Determine convergence and value (if convergent) of ∫_1^∞ 1/x^4 dx.',
      expectedAnswer: '(a) Δx = 2/4 = 0.5. x = 0, 0.5, 1, 1.5, 2. f-values: 1, e^0.5 ≈ 1.649, e ≈ 2.718, e^1.5 ≈ 4.482, e² ≈ 7.389. Trap = (0.5/2)·[1 + 2·1.649 + 2·2.718 + 2·4.482 + 7.389] = 0.25·[1 + 3.298 + 5.436 + 8.964 + 7.389] = 0.25·26.087 = 6.522. Exact: ∫_0^2 e^x = e² − 1 ≈ 6.389. Trapezoidal slightly overestimates (e^x is concave up, chord above curve). (3.5)\n(b) ∫_1^b x^(-4) dx = [-1/(3x³)]_1^b = -1/(3b³) + 1/3. Limit: 1/3 − 0 = 1/3. CONVERGES to 1/3. (Confirms p-test: p = 4 > 1 → converges.) (3)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['(a) Trap formula and explicit calculation. (b) Setup limit; evaluate.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Choose technique by integrand structure.',
      'FTC: differentiation and integration are inverse.',
      'Improper integrals: explicit limit setup.',
      'Trap rule: (Δx/2)·[f(a) + 2·sum-interior + f(b)].',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6-FRQ', cedTitle: 'Unit 6 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-6 patterns.' }] },
};
