/**
 * AP Calculus BC — CED Unit 4.6: Approximating Function Values Using
 * Local Linearity (Linearization).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U4_LINEARIZATION: LessonPlan = {
  id: 'evelyn.ap.calcbc.linearization.v1',
  title: 'U4.6 Linearization (Local Linear Approximation)',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.linearization',
      description:
        'Use the tangent-line approximation L(x) = f(a) + f\'(a)·(x − a) to estimate f(x) for x near a. Connect to differentials and to the first-order Taylor approximation.',
      standard: 'AP-CALCBC-4.6',
    },
  ],
  prerequisites: ['apcalcbc.related-rates'],
  followUps: ['apcalcbc.lhopital'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame linearization as the basic engineering trick of "use the tangent line for nearby x".',
      script:
        "Need √4.02 without a calculator? Don't compute it from scratch — use the TANGENT LINE to f(x) = √x at x = 4 (where f(4) = 2 is easy). For x close to 4, the function and its tangent are nearly identical. That's LINEARIZATION — the most basic Taylor approximation.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-linearization',
      kind: 'concept',
      goal: 'Cover the linearization formula + when it works + differential notation.',
      keyIdeas: [
        'LINEARIZATION (tangent line approximation): for x close to a, f(x) ≈ L(x) where L(x) = f(a) + f\'(a)·(x − a).',
        'GEOMETRIC MEANING. L is the equation of the TANGENT LINE to f at x = a. Near a, the curve and the tangent agree to first order.',
        'WHEN IS THE APPROXIMATION GOOD? When |x − a| is small AND f is "smooth" (no sudden curvature changes). Error grows with the second derivative — small for nearly-linear functions, larger for highly curved ones.',
        'PROCEDURE. (1) Pick a value a near x where f(a) and f\'(a) are easy. (2) Compute L(x) = f(a) + f\'(a)·(x − a). (3) Use L(x) ≈ f(x).',
        'EXAMPLE. Estimate √4.02. Use f(x) = √x, a = 4. f(4) = 2, f\'(x) = 1/(2√x), f\'(4) = 1/4. L(x) = 2 + (1/4)(x − 4). At x = 4.02: L(4.02) = 2 + (1/4)(0.02) = 2 + 0.005 = 2.005. Compare to actual √4.02 ≈ 2.00499... very close.',
        'DIFFERENTIAL NOTATION (sometimes used in problems). dy = f\'(a) · dx, where dx is a small change in x and dy approximates the resulting change in y. Then f(a + dx) ≈ f(a) + dy.',
        'CONNECTION TO TAYLOR (Unit 10 preview). Linearization is the FIRST-ORDER Taylor polynomial. Adding more terms (quadratic, cubic, etc.) gives better approximations — the Taylor series in Unit 10.',
      ],
      vocabulary: [
        { term: 'linearization', definition: 'L(x) = f(a) + f\'(a)·(x − a); the tangent-line approximation to f near a.' },
        { term: 'differential', definition: 'dy = f\'(a)·dx; small change in y approximated by derivative times small change in x.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-linearize',
      kind: 'worked_example',
      problem:
        'Use linearization to estimate (a) √16.1, (b) (1.02)¹⁰.',
      steps: [
        'STEP 1 — (a) f(x) = √x, a = 16. f(16) = 4. f\'(x) = 1/(2√x), f\'(16) = 1/8. L(x) = 4 + (1/8)(x − 16). At x = 16.1: L = 4 + (1/8)(0.1) = 4 + 0.0125 = 4.0125. (Actual √16.1 ≈ 4.01248...)',
        'STEP 2 — (b) f(x) = x¹⁰, a = 1. f(1) = 1. f\'(x) = 10x⁹, f\'(1) = 10. L(x) = 1 + 10(x − 1). At x = 1.02: L = 1 + 10(0.02) = 1 + 0.2 = 1.2. (Actual (1.02)¹⁰ ≈ 1.2190; linearization underestimates because of curvature, but close for small Δx.)',
      ],
      answer: '(a) √16.1 ≈ 4.0125. (b) (1.02)¹⁰ ≈ 1.2.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-estimate',
      kind: 'try_yourself',
      problem:
        'Use linearization to estimate. (a) ∛8.05 (cube root). (b) sin(0.05). (c) e^(0.1).',
      expectedAnswer:
        '(a) f(x) = x^(1/3), a = 8. f(8) = 2. f\'(x) = (1/3)x^(-2/3); f\'(8) = (1/3)(1/4) = 1/12. L(8.05) = 2 + (1/12)(0.05) ≈ 2.00417.\n(b) f(x) = sin x, a = 0. f(0) = 0, f\'(0) = cos(0) = 1. L(0.05) = 0 + 1·0.05 = 0.05.\n(c) f(x) = e^x, a = 0. f(0) = 1, f\'(0) = e^0 = 1. L(0.1) = 1 + 1·0.1 = 1.1. (Actual e^0.1 ≈ 1.10517.)',
      responseFormat: 'numeric',
      hints: ['Pick a near x where the function and derivative are easy.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-error',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Linearization works well for small |x − a| but degrades as |x − a| grows. (a) Identify the SOURCE of error (what causes linearization to fail when x is far from a?). (b) For a function f that is CONCAVE UP near a, does linearization typically OVERESTIMATE or UNDERESTIMATE f(x)? Justify.',
      expectedAnswer:
        '(a) ERROR SOURCE: linearization replaces the curve with its tangent line — a STRAIGHT-LINE approximation. As x moves away from a, the curve deviates from the tangent. The error is dominated by the SECOND DERIVATIVE — specifically, the error in linearization is approximately (1/2)·f\'\'(a)·(x − a)² for x near a. Functions with large |f\'\'(a)| have rapidly-growing error; nearly-linear functions (small |f\'\'|) have small error.\n(b) CONCAVE UP: f\'\' > 0. The function curves UPWARD. The tangent line lies BELOW the curve (for x ≠ a near a). So L(x) UNDERESTIMATES f(x) for both x slightly less than and greater than a. Concave down: tangent above curve, so linearization OVERESTIMATES. (This insight extends to "the second-derivative term" in Taylor approximation: positive second derivative → tangent below curve, error is positive.) Strong answers: (i) source of error = second derivative, (ii) sign of error = sign of second derivative for concave shape.',
      responseFormat: 'frq',
      hints: ['Tangent is straight; curve isn\'t. Error grows with curvature (second derivative).'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'L(x) = f(a) + f\'(a)·(x − a). Tangent line at x = a.',
        'Use for x close to a where f(a) and f\'(a) are easy.',
        'Concave up → tangent below curve → linearization underestimates.',
        'Concave down → tangent above curve → linearization overestimates.',
        'Error roughly (1/2)·f\'\'(a)·(x − a)² — second-derivative term.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.6',
    cedTitle: 'Linearization',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Standard linearization treatment.' }],
  },
};
