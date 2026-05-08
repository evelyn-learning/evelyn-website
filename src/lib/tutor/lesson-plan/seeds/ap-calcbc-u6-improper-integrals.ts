/**
 * AP Calculus BC — CED Unit 6.13: Improper Integrals (BC only).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_IMPROPER_INTEGRALS: LessonPlan = {
  id: 'evelyn.ap.calcbc.improper-integrals.v1',
  title: 'U6.13 Improper Integrals',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.improper-integrals', description: 'Evaluate improper integrals: those with infinite limits OR with discontinuous integrands. Determine convergence vs divergence using limits.', standard: 'AP-CALCBC-6.13' }],
  prerequisites: ['apcalcbc.partial-fractions'],
  followUps: ['apcalcbc.integration-strategy'],
  estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame improper integrals as integrals that need limits.',
      script: "Some integrals have infinite bounds (∫_1^∞ 1/x² dx) or integrate across a discontinuity (∫_0^1 1/√x dx). These are IMPROPER. Replace the offending bound with a variable, take the limit at the end. AP Calc BC tests both convergence and value.",
      estimatedMinutes: 2 },
    { id: 'concept-improper', kind: 'concept', goal: 'Cover both types of improper integrals.',
      keyIdeas: [
        'TYPE 1 — INFINITE LIMITS. ∫_a^∞ f(x) dx = lim_{b→∞} ∫_a^b f(x) dx. If the limit exists and is finite, the integral CONVERGES; otherwise DIVERGES.',
        'EXAMPLE: ∫_1^∞ 1/x² dx. Compute ∫_1^b 1/x² dx = [-1/x]_1^b = -1/b + 1 = 1 − 1/b. Take limit: lim_{b→∞} (1 − 1/b) = 1. CONVERGES to 1.',
        'EXAMPLE OF DIVERGENCE: ∫_1^∞ 1/x dx. ∫_1^b 1/x dx = ln(b). Limit: lim ln(b) = ∞. DIVERGES.',
        'TYPE 2 — DISCONTINUOUS INTEGRAND. ∫_a^b f(x) dx where f has a vertical asymptote at one of the bounds (or interior point). Replace bound with variable, take limit.',
        'EXAMPLE: ∫_0^1 1/√x dx. Integrand undefined at x = 0. Compute ∫_t^1 x^(-1/2) dx for t > 0 = 2√1 − 2√t = 2 − 2√t. Limit as t → 0⁺: 2. CONVERGES to 2.',
        'INTERIOR DISCONTINUITY: split at the point. ∫_a^b f = ∫_a^c f + ∫_c^b f. Each piece is a separate improper integral; both must converge for the whole to converge.',
        'P-INTEGRALS — important convergence test: ∫_1^∞ 1/x^p dx converges iff p > 1. ∫_0^1 1/x^p dx converges iff p < 1.',
        'AP convention: write the limit explicitly. Just writing "lim_{b→∞} F(b)" without explicit setup may lose points.',
      ],
      vocabulary: [
        { term: 'improper integral', definition: 'integral with infinite limits or with discontinuous integrand; requires a limit.' },
        { term: 'converges', definition: 'the limit exists and is a finite real number.' },
        { term: 'diverges', definition: 'the limit is ±∞ or does not exist.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-infinite', kind: 'worked_example',
      problem: 'Evaluate ∫_0^∞ e^(-x) dx.',
      steps: [
        'STEP 1 — Replace ∞ with a variable b. Compute ∫_0^b e^(-x) dx = [-e^(-x)]_0^b = -e^(-b) − (-1) = 1 − e^(-b).',
        'STEP 2 — Limit: lim_{b→∞} (1 − e^(-b)) = 1 − 0 = 1.',
        'STEP 3 — CONVERGES to 1.',
      ],
      answer: '1', estimatedMinutes: 3 },
    { id: 'worked-discontinuous', kind: 'worked_example',
      problem: 'Evaluate ∫_0^1 1/√x dx.',
      steps: [
        'STEP 1 — Integrand 1/√x = x^(-1/2) is undefined at x = 0. Replace with t > 0; compute ∫_t^1 x^(-1/2) dx = [2x^(1/2)]_t^1 = 2 − 2√t.',
        'STEP 2 — Limit as t → 0⁺: 2 − 0 = 2.',
        'STEP 3 — CONVERGES to 2.',
      ],
      answer: '2', estimatedMinutes: 3 },
    { id: 'try-various', kind: 'try_yourself',
      problem: 'Determine convergence and find the value if convergent. (a) ∫_1^∞ 1/x³ dx. (b) ∫_1^∞ 1/√x dx. (c) ∫_0^1 1/x² dx.',
      expectedAnswer: '(a) ∫_1^b x^(-3) dx = [-1/(2x²)]_1^b = -1/(2b²) + 1/2. Limit: 1/2. Converges to 1/2. (b) ∫_1^b x^(-1/2) dx = [2x^(1/2)]_1^b = 2√b − 2. Limit: ∞. DIVERGES. (c) ∫_t^1 x^(-2) dx = [-1/x]_t^1 = -1 + 1/t. Limit as t → 0⁺: ∞. DIVERGES.',
      responseFormat: 'numeric', hints: ['p-integral test: ∫_1^∞ 1/x^p converges iff p > 1; ∫_0^1 1/x^p converges iff p < 1.'], estimatedMinutes: 5 },
    { id: 'try-p-test', kind: 'try_yourself',
      problem: 'AP-style synthesis. (a) State the p-integral test for ∫_1^∞ 1/x^p dx. (b) Use it to determine convergence/divergence of ∫_1^∞ 1/x^(0.5) dx and ∫_1^∞ 1/x^(1.5) dx. (c) Briefly explain WHY convergence at infinity requires p > 1.',
      expectedAnswer: '(a) ∫_1^∞ 1/x^p dx converges if p > 1; diverges if p ≤ 1. (b) p = 0.5 < 1: DIVERGES. p = 1.5 > 1: CONVERGES (specifically to 1/(p−1) = 1/0.5 = 2). (c) For p = 1, the integrand 1/x decays slowly; ln(b) → ∞. For p < 1, decay is even slower. For p > 1, decay is fast enough that the integral SUMS to a finite value. Intuitively: if 1/x^p decays as x → ∞ FAST ENOUGH (faster than 1/x), the area under the curve is finite. p = 1 is the borderline case (logarithmic divergence).',
      responseFormat: 'frq', hints: ['p-integral test: depends on whether decay is fast enough.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Improper: infinite limits or discontinuous integrand.',
      'Replace offending bound with variable; take limit; check finiteness.',
      'p-integral: ∫_1^∞ 1/x^p converges iff p > 1; ∫_0^1 1/x^p converges iff p < 1.',
      'Interior discontinuity: split at the point; both pieces must converge.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.13', cedTitle: 'Improper Integrals (BC)',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '8', note: 'Standard improper integral treatment.' }] },
};
