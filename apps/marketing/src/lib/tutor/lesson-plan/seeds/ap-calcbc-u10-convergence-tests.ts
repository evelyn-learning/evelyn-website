/**
 * AP Calculus BC — CED Unit 10.3+10.4+10.5+10.6: Integral Test, p-Series,
 * Comparison Tests.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_CONVERGENCE_TESTS: LessonPlan = {
  id: 'evelyn.ap.calcbc.convergence-tests.v1', title: 'U10.3 Integral Test, p-Series, and Comparison Tests',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.convergence-tests', description: 'Apply the integral test, p-series test, direct comparison test, and limit comparison test to determine convergence/divergence of positive-term series.', standard: 'AP-CALCBC-10.3-10.6' }],
  prerequisites: ['apcalcbc.series-convergence'], followUps: ['apcalcbc.alternating-series'], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the test arsenal.', script: "Most series aren't geometric. We need MORE tests. Today: 4 of them — integral test, p-series, direct comparison, limit comparison. All work for POSITIVE-TERM series.", estimatedMinutes: 2 },
    { id: 'concept-tests', kind: 'concept', goal: 'Cover all four tests with rules.',
      keyIdeas: [
        'INTEGRAL TEST: If a_n = f(n) where f is positive, continuous, decreasing on [N, ∞), then Σ a_n and ∫_N^∞ f(x) dx EITHER both converge OR both diverge.',
        'EXAMPLE — INTEGRAL TEST on harmonic Σ 1/n: f(x) = 1/x is positive, continuous, decreasing on [1, ∞). ∫_1^∞ 1/x dx = ∞. DIVERGES.',
        'p-SERIES: Σ 1/n^p. CONVERGES iff p > 1. (Memorize.) Special cases: p = 1 is harmonic (diverges); p = 2 is Σ 1/n² = π²/6 (converges).',
        'DIRECT COMPARISON TEST: For positive-term series Σ a_n and Σ b_n with 0 ≤ a_n ≤ b_n.',
        '  • If Σ b_n CONVERGES, then Σ a_n CONVERGES. ("smaller-than-converging" → converges)',
        '  • If Σ a_n DIVERGES, then Σ b_n DIVERGES. ("bigger-than-diverging" → diverges)',
        'LIMIT COMPARISON TEST: For positive Σ a_n and Σ b_n. If lim a_n/b_n = L where 0 < L < ∞, then BOTH converge or BOTH diverge. (Used when direct comparison is awkward.)',
        'STRATEGY: dominate the leading behavior. Σ a_n compared with Σ 1/n^p where p matches the dominant power.',
        'EXAMPLE — LIMIT COMPARISON on Σ 1/(n² + 5n + 1). For large n, ≈ 1/n². Compare with Σ 1/n² (p-series, p = 2, CONVERGES). Limit: lim [1/(n²+5n+1)] / [1/n²] = lim n²/(n²+5n+1) = 1. ✓ 0 < 1 < ∞ → BOTH converge.',
      ],
      vocabulary: [{ term: 'p-series', definition: 'Σ 1/n^p — converges iff p > 1.' }],
      estimatedMinutes: 6 },
    { id: 'worked-pseries', kind: 'worked_example', problem: 'Determine convergence of Σ 1/n^{1/2} (i.e., Σ 1/√n).',
      steps: [
        'STEP 1 — p-series with p = 1/2.',
        'STEP 2 — p = 1/2 < 1. p-series diverges when p ≤ 1.',
        'STEP 3 — DIVERGES.',
      ],
      answer: 'Diverges (p-series with p = 1/2 ≤ 1).', estimatedMinutes: 2 },
    { id: 'try-direct-comp', kind: 'try_yourself', problem: 'Determine convergence of Σ 1/(2^n + n) using direct comparison.',
      expectedAnswer: 'For all n ≥ 1: 1/(2^n + n) ≤ 1/2^n. Σ 1/2^n is geometric with r = 1/2 < 1, CONVERGES (sum = 1). By direct comparison, Σ 1/(2^n + n) CONVERGES.',
      responseFormat: 'free', hints: ['Compare with a known convergent series.'], estimatedMinutes: 4 },
    { id: 'try-limit-comp', kind: 'try_yourself', problem: 'Determine convergence of Σ (n + 1)/(n³ + 2) using limit comparison.',
      expectedAnswer: 'For large n: (n + 1)/(n³ + 2) ≈ n/n³ = 1/n². Compare with Σ 1/n² (p-series p = 2, CONVERGES). Limit: lim [(n + 1)/(n³ + 2)] / (1/n²) = lim n²(n+1)/(n³+2) = lim (n³ + n²)/(n³ + 2) = 1. 0 < 1 < ∞. ✓ Both converge. Σ (n + 1)/(n³ + 2) CONVERGES.',
      responseFormat: 'free', hints: ['Identify dominant behavior; compare with p-series.'], estimatedMinutes: 4 },
    { id: 'try-integral-test', kind: 'try_yourself', problem: 'Use the integral test on Σ_{n=2}^∞ 1/(n ln n).',
      expectedAnswer: 'f(x) = 1/(x ln x). For x ≥ 2, f is positive, continuous, decreasing. ∫_2^∞ 1/(x ln x) dx. u-sub: u = ln x, du = dx/x. = ∫_{ln 2}^∞ 1/u du = [ln u]_{ln 2}^∞ = ∞. Integral DIVERGES, so series DIVERGES.',
      responseFormat: 'free', hints: ['u = ln x in the integral.'], estimatedMinutes: 4 },
    { id: 'try-mixed', kind: 'try_yourself', problem: 'AP-style synthesis. Determine convergence: (a) Σ n/(n² + 1). (b) Σ 1/(n² + 1). Use any test. Justify.',
      expectedAnswer: '(a) Limit comparison with Σ 1/n: lim [n/(n²+1)]/(1/n) = lim n²/(n²+1) = 1. Σ 1/n harmonic DIVERGES. So Σ n/(n²+1) DIVERGES. \n(b) Direct comparison or limit comparison with Σ 1/n²: 1/(n²+1) ≤ 1/n². Σ 1/n² is p-series with p=2, CONVERGES. By direct comparison, Σ 1/(n²+1) CONVERGES.',
      responseFormat: 'free', hints: ['Match each to a p-series via dominant behavior.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'p-series Σ 1/n^p: converges iff p > 1.',
      'Direct comparison: 0 ≤ a_n ≤ b_n. b converges → a converges. a diverges → b diverges.',
      'Limit comparison: lim a_n/b_n = L, 0 < L < ∞ → both converge or both diverge.',
      'Integral test: f positive, continuous, decreasing on [N,∞) → series and integral converge/diverge together.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.3-10.6', cedTitle: 'Convergence Tests', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard convergence tests.' }] },
};
