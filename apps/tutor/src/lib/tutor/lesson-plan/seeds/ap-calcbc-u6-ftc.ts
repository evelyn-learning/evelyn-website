/**
 * AP Calculus BC — CED Unit 6.4+6.5+6.7: Fundamental Theorem of
 * Calculus (accumulation + evaluation forms).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_FTC: LessonPlan = {
  id: 'evelyn.ap.calcbc.ftc.v1',
  title: 'U6.4 The Fundamental Theorem of Calculus',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.ftc', description: 'State and apply both forms of the FTC: (Part 1) d/dx[∫_a^x f(t) dt] = f(x); (Part 2) ∫_a^b f(x) dx = F(b) − F(a) where F is an antiderivative.', standard: 'AP-CALCBC-6.4-6.7' }],
  prerequisites: ['apcalcbc.riemann-sums'],
  followUps: ['apcalcbc.integral-properties'],
  estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame FTC as the unification of differentiation and integration.',
      script: "The FTC is the single most important theorem in calculus. It says: differentiation and integration are INVERSE operations. Knowing one antiderivative lets you compute any definite integral. This is what makes calculus practical.",
      estimatedMinutes: 2 },
    { id: 'concept-ftc', kind: 'concept', goal: 'Cover both parts of FTC.',
      keyIdeas: [
        'FTC PART 1 (Differentiation of accumulation): If f is continuous on an interval and F(x) = ∫_a^x f(t) dt (an "accumulation function"), then F\'(x) = f(x). The derivative of the integral with variable upper limit is the integrand evaluated at the variable.',
        'GENERAL FORM with chain rule: d/dx[∫_a^{g(x)} f(t) dt] = f(g(x))·g\'(x).',
        'FTC PART 2 (Evaluation): If F is an antiderivative of f (i.e., F\'(x) = f(x)), then ∫_a^b f(x) dx = F(b) − F(a). Compute the definite integral by finding any antiderivative and evaluating at endpoints.',
        'NOTATION: F(b) − F(a) often written F(x)|_a^b or [F(x)]_a^b.',
        'EXAMPLE FTC PART 2: ∫_0^4 x² dx. Antiderivative: F(x) = x³/3. Evaluate: F(4) − F(0) = 64/3 − 0 = 64/3. Match the Riemann sum limit.',
        'EXAMPLE FTC PART 1: F(x) = ∫_0^x sin(t²) dt. F\'(x) = sin(x²). The integrand evaluated at x.',
        'WHY THIS UNIFIES: Part 2 says integral = (something derivable from antiderivatives). Part 1 says antiderivatives can be DEFINED as accumulation functions. Together: differentiation and integration are inverse operations.',
        'WHEN PART 1 NEEDS CHAIN RULE: if upper limit is g(x) instead of x: F(x) = ∫_a^{g(x)} f(t) dt → F\'(x) = f(g(x))·g\'(x).',
        'WHEN BOTH LIMITS DEPEND ON x: split via additivity (Unit 6.6).',
      ],
      vocabulary: [
        { term: 'accumulation function', definition: 'F(x) = ∫_a^x f(t) dt; the area accumulated up to x.' },
        { term: 'FTC Part 1', definition: 'differentiation of accumulation: d/dx[∫_a^x f(t) dt] = f(x).' },
        { term: 'FTC Part 2', definition: 'evaluation: ∫_a^b f(x) dx = F(b) − F(a) for any antiderivative F.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-evaluate', kind: 'worked_example',
      problem: 'Evaluate ∫_1^3 (3x² − 4x + 1) dx using FTC Part 2.',
      steps: [
        'STEP 1 — Find antiderivative. ∫ 3x² dx = x³; ∫ -4x dx = -2x²; ∫ 1 dx = x. F(x) = x³ − 2x² + x.',
        'STEP 2 — Evaluate F(3) − F(1). F(3) = 27 − 18 + 3 = 12. F(1) = 1 − 2 + 1 = 0.',
        'STEP 3 — Difference: 12 − 0 = 12.',
      ],
      answer: '12', estimatedMinutes: 4 },
    { id: 'worked-ftc1', kind: 'worked_example',
      problem: 'Find F\'(x) where F(x) = ∫_2^{x²} sin(t) dt.',
      steps: [
        'STEP 1 — Recognize FTC Part 1 + chain rule. Upper limit is x², not x.',
        'STEP 2 — Apply: F\'(x) = sin(x²) · d/dx[x²] = sin(x²) · 2x = 2x sin(x²).',
      ],
      answer: 'F\'(x) = 2x sin(x²)', estimatedMinutes: 3 },
    { id: 'try-evaluate', kind: 'try_yourself',
      problem: 'Evaluate. (a) ∫_0^π sin(x) dx. (b) ∫_1^e (1/x) dx. (c) ∫_0^1 e^x dx.',
      expectedAnswer: '(a) -cos(x) from 0 to π = -cos(π) − (-cos(0)) = -(-1) − (-1) = 1 + 1 = 2. (b) ln(x) from 1 to e = ln(e) − ln(1) = 1 − 0 = 1. (c) e^x from 0 to 1 = e − 1.',
      responseFormat: 'numeric', hints: ['Find antiderivative; F(b) − F(a).'], estimatedMinutes: 3 },
    { id: 'try-ftc1', kind: 'try_yourself',
      problem: 'Find F\'(x). (a) F(x) = ∫_3^x √(1 + t³) dt. (b) F(x) = ∫_0^{sin(x)} e^{t²} dt.',
      expectedAnswer: '(a) F\'(x) = √(1 + x³) (FTC Part 1, no chain rule needed since upper limit is x). (b) Chain rule: F\'(x) = e^{(sin x)²} · cos(x) = cos(x) · e^{sin²(x)}.',
      responseFormat: 'numeric', hints: ['(a) plain FTC part 1. (b) chain rule on the upper-limit function.'], estimatedMinutes: 3 },
    { id: 'try-mixed', kind: 'try_yourself',
      problem: 'AP-style synthesis. Suppose F(x) = ∫_0^x (3t² − 2t) dt. (a) Find F\'(x) using FTC Part 1. (b) Compute F(2) using FTC Part 2. (c) Verify consistency: differentiate the explicit F formula and compare to (a).',
      expectedAnswer: '(a) FTC Part 1: F\'(x) = 3x² − 2x. (b) Antiderivative inside: G(t) = t³ − t². F(x) = G(x) − G(0) = x³ − x² − 0 = x³ − x². So F(2) = 8 − 4 = 4. (c) Verify: F(x) = x³ − x². Differentiate: F\'(x) = 3x² − 2x. ✓ Matches (a). Strong answers cite the consistency between FTC Part 1 (derivative of accumulation = integrand) and FTC Part 2 (evaluation).',
      responseFormat: 'frq', hints: ['Part 1 directly. Part 2 via explicit antiderivative.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'FTC Part 1: d/dx[∫_a^x f(t) dt] = f(x). With upper limit g(x): chain rule gives f(g(x))·g\'(x).',
      'FTC Part 2: ∫_a^b f(x) dx = F(b) − F(a) for any antiderivative F.',
      'Differentiation and integration are INVERSE operations.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.4-6.7', cedTitle: 'FTC',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard FTC Part 1 + Part 2.' }] },
};
