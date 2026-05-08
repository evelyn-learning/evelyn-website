/**
 * AP Calculus BC — Unit 2 FRQ Practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u2-frq-practice.v1',
  title: 'U2 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [{ id: 'apcalcbc.u2-frq-practice', description: 'Apply Unit 2 derivative rules in multi-part FRQs.', standard: 'AP-CALCBC-2-FRQ' }],
  prerequisites: ['apcalcbc.quotient-rule'],
  followUps: [],
  estimatedMinutes: 28,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 2 FRQ stakes — mechanical accuracy under pressure.',
      script:
        "Unit 2 FRQs test fluency with the differentiation rules. Algebra, sign discipline, applying multiple rules in sequence. Three problems incoming.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Refresher on Unit 2 FRQ scoring.',
      keyIdeas: [
        'Show every step. Skipping algebraic moves loses points.',
        'For tangent-line problems: ALWAYS state f\'(a) = slope, then point-slope form.',
        'For "is f differentiable here" problems: explicitly verify CONTINUITY first, then check that one-sided derivatives agree.',
        'Watch sign discipline on cos\' = -sin and the quotient rule\'s middle minus.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-frq-rules',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 1 — Differentiation. Differentiate each. Show all steps. (a) f(x) = (x² + 3) sin x. (b) g(x) = (e^x)/(x + 1). (c) h(x) = 5x⁴ − 3 ln x + 2 cos x.',
      expectedAnswer:
        '(a) PRODUCT RULE: f\'(x) = 2x·sin x + (x² + 3)·cos x. (2 points)\n(b) QUOTIENT RULE: g\'(x) = [e^x(x + 1) − e^x·1]/(x + 1)² = e^x·x/(x + 1)² = xe^x/(x + 1)². (2 points)\n(c) LINEARITY + each derivative: h\'(x) = 20x³ − 3/x − 2 sin x. (2 points)\nTotal: 6 points.',
      responseFormat: 'frq',
      hints: ['(a) product rule; (b) quotient rule; (c) linearity + transcendentals.'],
      estimatedMinutes: 6,
    },
    {
      id: 'try-frq-tangent',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 2 — Tangent Line. Let f(x) = x · e^x. (a) Compute f\'(x). (b) Find the slope of the tangent line at x = 0. (c) Find the equation of the tangent line at x = 0. (d) Find all x at which the tangent line is HORIZONTAL.',
      expectedAnswer:
        '(a) Product rule: f\'(x) = 1·e^x + x·e^x = e^x(1 + x). (2 points)\n(b) f\'(0) = e^0·(1 + 0) = 1·1 = 1. Slope = 1. (1 point)\n(c) f(0) = 0·e^0 = 0. Point (0, 0). Tangent: y − 0 = 1·(x − 0), i.e., y = x. (2 points)\n(d) Horizontal tangent: f\'(x) = 0. e^x(1 + x) = 0. e^x is NEVER zero, so 1 + x = 0 → x = -1. The tangent is horizontal only at x = -1. (2 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: ['Product rule for x·e^x. Horizontal tangent: f\' = 0.'],
      estimatedMinutes: 6,
    },
    {
      id: 'try-frq-piecewise',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 3 — Differentiability. Let f(x) = x² for x ≤ 1; f(x) = ax + b for x > 1. (a) Find values of a and b that make f BOTH continuous AND differentiable at x = 1. (b) Verify your values satisfy both conditions explicitly.',
      expectedAnswer:
        '(a) CONTINUITY at x = 1: lim_{x→1⁻} f = 1² = 1. f(1) = 1 (from x ≤ 1 branch). Right side: lim_{x→1⁺} f = a + b. Continuity: a + b = 1.\nDIFFERENTIABILITY at x = 1: left derivative = d/dx[x²] at 1 = 2(1) = 2. Right derivative = d/dx[ax + b] at 1 = a. Differentiability: a = 2.\nFrom a = 2 and a + b = 1: b = 1 − a = -1.\nValues: a = 2, b = -1. (4 points: 2 for setting up the two equations, 2 for solving)\n(b) VERIFY. With a = 2, b = -1: f(x) = 2x − 1 for x > 1. At x = 1: left value = 1; right limit = 2(1) − 1 = 1; f(1) = 1. ✓ continuity. Left slope = 2; right slope = 2. ✓ differentiability. (2 points)\nTotal: 6 points.',
      responseFormat: 'frq',
      hints: ['Continuity → values match. Differentiability → slopes match.'],
      estimatedMinutes: 6,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Power rule + linearity for polynomials.',
        'Product / quotient rules for f·g and f/g.',
        'Trig: sin\' = cos, cos\' = -sin, tan\' = sec², sec\' = sec·tan, etc.',
        'e^x and ln x: derivatives are e^x and 1/x.',
        'Tangent line: y − f(a) = f\'(a)(x − a).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ',
    cedTitle: 'Unit 2 FRQ Practice',
    sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-2 patterns.' }],
  },
};
