/**
 * AP Calculus BC — CED Unit 2.7: Derivatives of sin, cos, e^x, ln x.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_TRANSCENDENTAL_DERIVATIVES: LessonPlan = {
  id: 'evelyn.ap.calcbc.transcendental-derivatives.v1',
  title: 'U2.7 Derivatives of sin, cos, e^x, and ln x',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.transcendental-derivatives',
      description:
        'Memorize and apply the derivatives of the four core transcendental functions: d/dx[sin x] = cos x, d/dx[cos x] = -sin x, d/dx[e^x] = e^x, d/dx[ln x] = 1/x.',
      standard: 'AP-CALCBC-2.7',
    },
  ],
  prerequisites: ['apcalcbc.power-rule'],
  followUps: ['apcalcbc.product-rule'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame these four as the must-memorize derivatives that show up everywhere.',
      script:
        "Beyond polynomials, AP testing concentrates on FOUR functions: sin x, cos x, e^x, ln x. Their derivatives must be instant recall. Today's plan: memorize, apply, recognize patterns.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-list',
      kind: 'concept',
      goal: 'List the four core derivatives + show why each is what it is.',
      keyIdeas: [
        'd/dx[sin x] = cos x.',
        'd/dx[cos x] = -sin x. Note the NEGATIVE sign.',
        'd/dx[e^x] = e^x. The exponential is its own derivative — UNIQUE among elementary functions.',
        'd/dx[ln x] = 1/x. The natural log\'s derivative is the simplest reciprocal. (Domain: x > 0.)',
        'WHERE DO THESE COME FROM? sin and cos: from the limit definition combined with the special trig limits lim sin(h)/h = 1 and lim (1−cos(h))/h = 0 (Unit 1.6 + 1.8). e^x: defined as the function whose derivative is itself; this property characterizes the number e ≈ 2.71828. ln x: derivative follows from inverse-function relationship with e^x (Unit 3 will cover this).',
        'CIRCULARITY of trig pair: derivatives of sin and cos cycle through each other. d⁴/dx⁴[sin x] = sin x (back where we started, after 4 derivatives).',
        'COMBINED with linearity: any LINEAR COMBINATION differentiates term-by-term. d/dx[3 sin x − 2 cos x + 5e^x] = 3 cos x + 2 sin x + 5e^x.',
        'COMING SOON. The chain rule (Unit 3.1) lets us extend to functions like sin(2x), e^(3x), ln(x²+1). For now we use only the BASIC functions, not compositions.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-combined',
      kind: 'worked_example',
      problem:
        'Find f\'(x) where f(x) = 4 sin x − 3 cos x + 2e^x − 5 ln x + x³.',
      steps: [
        'STEP 1 — APPLY EACH RULE TERM BY TERM (with linearity).',
        'd/dx[4 sin x] = 4 cos x. d/dx[-3 cos x] = -3·(-sin x) = 3 sin x. d/dx[2e^x] = 2e^x. d/dx[-5 ln x] = -5·(1/x) = -5/x. d/dx[x³] = 3x².',
        'STEP 2 — COMBINE. f\'(x) = 4 cos x + 3 sin x + 2e^x − 5/x + 3x².',
        'STEP 3 — DOMAIN check (for ln x term). f and f\' are defined for x > 0.',
      ],
      answer: 'f\'(x) = 4 cos x + 3 sin x + 2e^x − 5/x + 3x²',
      estimatedMinutes: 3,
    },
    {
      id: 'try-basic',
      kind: 'try_yourself',
      problem:
        'Differentiate. (a) f(x) = 7 sin x. (b) g(x) = 5 cos x − e^x. (c) h(x) = 2 ln x + x⁴.',
      expectedAnswer:
        '(a) 7 cos x. (b) -5 sin x − e^x. (c) 2/x + 4x³.',
      responseFormat: 'numeric',
      hints: ['Apply each rule + linearity. Watch the negative sign on cos.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tangent',
      kind: 'try_yourself',
      problem:
        'Find the equation of the tangent line to y = e^x − 2 cos x at x = 0.',
      expectedAnswer:
        'y(0) = e^0 − 2 cos(0) = 1 − 2 = -1. So point: (0, -1). y\'(x) = e^x − 2(-sin x) = e^x + 2 sin x. y\'(0) = 1 + 0 = 1. Slope = 1. Tangent: y − (-1) = 1·(x − 0) → y = x − 1.',
      responseFormat: 'numeric',
      hints: ['Compute the value and the derivative-value at x = 0; use point-slope.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-cycle',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Compute the FIRST FOUR DERIVATIVES of f(x) = sin x. What do you notice? What does this say about d⁴⁰⁰/dx⁴⁰⁰[sin x]?',
      expectedAnswer:
        'f(x) = sin x. f\'(x) = cos x. f\'\'(x) = -sin x. f\'\'\'(x) = -cos x. f\'\'\'\'(x) = sin x. The cycle has period 4 — every 4 derivatives we return to sin x. For higher derivatives: take the order MOD 4. d⁴⁰⁰/dx⁴⁰⁰[sin x]: 400 mod 4 = 0, so the result is sin x (same as the 0th derivative). Equivalently: 400 derivatives = 100 complete cycles back to start. Strong answers: identify the period-4 cycle, use modular arithmetic to handle high-order derivatives.',
      responseFormat: 'frq',
      hints: ['sin → cos → -sin → -cos → sin. Period 4.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'd/dx[sin x] = cos x.',
        'd/dx[cos x] = -sin x. (NEGATIVE.)',
        'd/dx[e^x] = e^x. (Same as itself.)',
        'd/dx[ln x] = 1/x. (Defined for x > 0.)',
        'sin/cos derivatives cycle with period 4.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.7',
    cedTitle: 'Derivatives of sin, cos, e^x, ln x',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Standard transcendental derivatives.' }],
  },
};
