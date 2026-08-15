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
      expectedAnswer: '(a) U-SUB: u = x³, du = 3x² dx, x² dx = du/3. New limits: x=0→u=0; x=2→u=8. ∫_0^8 e^u·(1/3) du = (1/3)(e^8 − 1). (3)\n(b) BY PARTS: u = x, dv = sin x dx. du = dx, v = -cos x. ∫ x sin x dx = -x cos x + ∫ cos x dx = -x cos x + sin x + C. (3)\n(c) PARTIAL FRACTIONS: 1/[(x−1)(x+1)] = A/(x−1) + B/(x+1). 1 = A(x+1) + B(x−1). x=1: 1 = 2A → A=1/2. x=-1: 1 = -2B → B=-1/2. Integral = (1/2) ln|x−1| − (1/2) ln|x+1| + C = (1/2) ln|(x−1)/(x+1)| + C. (3)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Selects u-substitution with u = x³ (du = 3x² dx), correctly CHANGES the limits to 0 and 8, and evaluates the definite integral to (1/3)(e^8 − 1). Credit the substitution setup, the limit change, and the final value.', modelResponse: 'u-substitution: let u = x³, du = 3x² dx, so x² dx = du/3. Limits: x = 0 → u = 0, x = 2 → u = 8. ∫_0^8 (1/3)e^u du = (1/3)[e^u]_0^8 = (1/3)(e^8 − 1).' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Uses integration by parts with u = x, dv = sin x dx (du = dx, v = -cos x), applies the formula correctly, and reaches -x cos x + sin x + C. Requires a correct choice of parts and the +C.', modelResponse: 'Integration by parts: u = x, dv = sin x dx → du = dx, v = -cos x. ∫ x sin x dx = -x cos x − ∫(-cos x) dx = -x cos x + sin x + C.' },
        { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Decomposes 1/(x²−1) into partial fractions, solves A = 1/2 and B = -1/2, and integrates to (1/2)ln|x−1| − (1/2)ln|x+1| + C. Credit the decomposition, the constants, and the log antiderivative.', modelResponse: '1/[(x−1)(x+1)] = A/(x−1) + B/(x+1) → 1 = A(x+1) + B(x−1). x = 1: A = 1/2; x = -1: B = -1/2. ∫ = (1/2)ln|x−1| − (1/2)ln|x+1| + C = (1/2)ln|(x−1)/(x+1)| + C.' },
      ] },
      modelResponse: '(a) u = x³ (du = 3x² dx), limits 0→8: ∫_0^8 (1/3)e^u du = (1/3)(e^8 − 1). (b) By parts u = x, dv = sin x dx: -x cos x + sin x + C. (c) Partial fractions 1/(x²−1) = (1/2)/(x−1) − (1/2)/(x+1): (1/2)ln|(x−1)/(x+1)| + C.',
      responseFormat: 'frq', hints: ['Identify technique for each, execute step by step.'], estimatedMinutes: 8 },
    { id: 'try-frq-ftc', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — FTC. Let g(x) = ∫_0^x (t² − 4) dt. (a) Find g\'(x). (b) Find all critical points of g and classify each. (c) Find g(3) explicitly. (d) Use g\'(x) directly to find an interval where g is INCREASING.',
      expectedAnswer: '(a) FTC Part 1: g\'(x) = x² − 4. (2)\n(b) Critical: g\'(x) = 0 → x² = 4 → x = ±2. Use g\'\' = 2x. g\'\'(2) = 4 > 0 → local min. g\'\'(-2) = -4 < 0 → local max. (3)\n(c) g(3) = ∫_0^3 (t² − 4) dt = [t³/3 − 4t]_0^3 = 9 − 12 = -3. (2)\n(d) g\'(x) > 0 when x² > 4, i.e., |x| > 2. So g is increasing on (-∞, -2) and (2, ∞). (2)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Applies the Fundamental Theorem of Calculus (Part 1) to state g\'(x) = x² − 4 directly. Full credit requires recognizing/stating FTC, not re-integrating.', modelResponse: 'By the Fundamental Theorem of Calculus (Part 1), g\'(x) = x² − 4.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Solves g\'(x) = 0 for the critical points x = ±2 and classifies each with justification (g\'\'(x) = 2x: g\'\'(2) > 0 → local min at x = 2; g\'\'(-2) < 0 → local max at x = -2). Requires both critical points AND justified classification.', modelResponse: 'g\'(x) = 0 → x² = 4 → x = ±2. Using g\'\'(x) = 2x: g\'\'(2) = 4 > 0, so local MIN at x = 2; g\'\'(-2) = -4 < 0, so local MAX at x = -2.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Evaluates g(3) = ∫_0^3 (t² − 4) dt using an antiderivative [t³/3 − 4t] and the FTC to get -3. Credit the antiderivative and the correct numerical value.', modelResponse: 'g(3) = ∫_0^3 (t² − 4) dt = [t³/3 − 4t]_0^3 = (27/3 − 12) − 0 = 9 − 12 = -3.' },
        { criterionId: 'd', maxPoints: 2, scoringCriteria: 'Uses g\'(x) = x² − 4 > 0 (i.e., |x| > 2) directly to state g is increasing on (-∞, -2) and (2, ∞). Must argue from the sign of g\'.', modelResponse: 'g is increasing where g\'(x) = x² − 4 > 0, i.e., x² > 4 → |x| > 2. So g is increasing on (-∞, -2) and (2, ∞).' },
      ] },
      modelResponse: '(a) FTC Part 1: g\'(x) = x² − 4. (b) Critical points x = ±2; g\'\'(x) = 2x gives local min at x = 2, local max at x = -2. (c) g(3) = [t³/3 − 4t]_0^3 = 9 − 12 = -3. (d) g\' > 0 for |x| > 2 → g increasing on (-∞, -2) and (2, ∞).',
      responseFormat: 'frq', hints: ['FTC Part 1 gives g\' directly. Critical points + concavity test.'], estimatedMinutes: 7 },
    { id: 'try-frq-improper', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Riemann Sums + Improper Integral. (a) Use the trapezoidal rule with n = 4 to approximate ∫_0^2 e^x dx. Compare to the exact value. (b) Determine convergence and value (if convergent) of ∫_1^∞ 1/x^4 dx.',
      expectedAnswer: '(a) Δx = 2/4 = 0.5. x = 0, 0.5, 1, 1.5, 2. f-values: 1, e^0.5 ≈ 1.649, e ≈ 2.718, e^1.5 ≈ 4.482, e² ≈ 7.389. Trap = (0.5/2)·[1 + 2·1.649 + 2·2.718 + 2·4.482 + 7.389] = 0.25·[1 + 3.298 + 5.436 + 8.964 + 7.389] = 0.25·26.087 = 6.522. Exact: ∫_0^2 e^x = e² − 1 ≈ 6.389. Trapezoidal slightly overestimates (e^x is concave up, chord above curve). (5)\n(b) ∫_1^b x^(-4) dx = [-1/(3x³)]_1^b = -1/(3b³) + 1/3. Limit: 1/3 − 0 = 1/3. CONVERGES to 1/3. (Confirms p-test: p = 4 > 1 → converges.) (4)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a-i', maxPoints: 3, scoringCriteria: 'Sets up the trapezoidal rule with Δx = 0.5 and the correct nodes/weights (1, 2, 2, 2, 1) and computes the approximation ≈ 6.522. Credit the setup and the numerical execution.', modelResponse: 'Δx = 2/4 = 0.5 with nodes x = 0, 0.5, 1, 1.5, 2 and f-values 1, 1.649, 2.718, 4.482, 7.389. Trap = (Δx/2)[f(0) + 2f(0.5) + 2f(1) + 2f(1.5) + f(2)] = 0.25·26.087 ≈ 6.522.' },
        { criterionId: 'a-ii', maxPoints: 2, scoringCriteria: 'Computes the exact value e² − 1 ≈ 6.389, compares it to the approximation, AND justifies the overestimate (e^x concave up → trapezoids lie above the curve). Justification of the overestimate is required for full credit.', modelResponse: 'Exact = ∫_0^2 e^x dx = e² − 1 ≈ 6.389. The trapezoidal estimate 6.522 OVERESTIMATES because e^x is concave up, so each chord lies above the curve.' },
        { criterionId: 'b', maxPoints: 4, scoringCriteria: 'Writes the improper integral as an explicit LIMIT ∫_1^b x^(-4) dx as b → ∞, evaluates the antiderivative [-1/(3x³)], takes the limit to conclude the integral CONVERGES to 1/3. The explicit limit notation and the convergence conclusion are both required.', modelResponse: '∫_1^∞ x^(-4) dx = lim_{b→∞} ∫_1^b x^(-4) dx = lim_{b→∞} [-1/(3x³)]_1^b = lim_{b→∞} (-1/(3b³) + 1/3) = 1/3. The integral CONVERGES to 1/3 (consistent with the p-test: p = 4 > 1).' },
      ] },
      modelResponse: '(a) Δx = 0.5, Trap = (0.25)[1 + 2(1.649) + 2(2.718) + 2(4.482) + 7.389] ≈ 6.522; exact e² − 1 ≈ 6.389, so trapezoid overestimates (e^x concave up). (b) lim_{b→∞} [-1/(3x³)]_1^b = 1/3 → converges to 1/3 (p = 4 > 1).',
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
