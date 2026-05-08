/**
 * AP Calculus BC — Unit 3 FRQ Practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U3_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u3-frq-practice.v1',
  title: 'U3 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [{ id: 'apcalcbc.u3-frq-practice', description: 'Apply Unit 3 derivative rules in multi-part FRQs.', standard: 'AP-CALCBC-3-FRQ' }],
  prerequisites: ['apcalcbc.higher-order-derivatives'],
  followUps: [],
  estimatedMinutes: 28,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 3 FRQ stakes — chain, implicit, inverse mastery.',
      script:
        "Unit 3 FRQs combine chain rule, implicit differentiation, inverse functions, and higher-order derivatives. Three problems incoming.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Refresher on Unit 3 FRQ scoring.',
      keyIdeas: [
        'CHAIN rule: state outer/inner; show derivative-of-outer at inner times derivative-of-inner.',
        'IMPLICIT: differentiate both sides; state d/dx[y^n] = n·y^(n-1)·dy/dx; collect dy/dx and solve.',
        'INVERSE FUNCTION: state (f⁻¹)\'(b) = 1/f\'(f⁻¹(b)); find f⁻¹(b) explicitly first.',
        'HIGHER-ORDER: just differentiate repeatedly, simplify between steps.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-frq-chain',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 1 — Chain Rule. Differentiate each. Show work. (a) y = (3x² + 1)⁵. (b) y = sin(e^x). (c) y = ln(cos x). (d) y = arctan(2x).',
      expectedAnswer:
        '(a) Chain: 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴. (1.5)\n(b) Chain: cos(e^x) · e^x = e^x cos(e^x). (1.5)\n(c) Chain: (1/cos x)·(-sin x) = -tan x. (Or via -sin/cos = -tan.) (1.5)\n(d) Chain: 1/(1 + (2x)²) · 2 = 2/(1 + 4x²). (1.5)\nTotal: 6 points.',
      responseFormat: 'frq',
      hints: ['Each is chain rule; identify outer and inner.'],
      estimatedMinutes: 6,
    },
    {
      id: 'try-frq-implicit',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 2 — Implicit Differentiation. Consider the curve x² + xy + y² = 19 at the point (2, 3). (a) Verify (2, 3) is on the curve. (b) Find dy/dx by implicit differentiation. (c) Find the equation of the tangent line at (2, 3). (d) Find dy/dx at the point (2, 3) numerically.',
      expectedAnswer:
        '(a) 4 + 6 + 9 = 19 ✓ (1)\n(b) Differentiate: 2x + (y + x·dy/dx) + 2y·dy/dx = 0. Collect: dy/dx·(x + 2y) = -(2x + y). dy/dx = -(2x + y)/(x + 2y). (3 points)\n(c) At (2, 3): dy/dx = -(4 + 3)/(2 + 6) = -7/8. Tangent: y − 3 = -7/8·(x − 2). (2 points)\n(d) -7/8. (1 point)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: ['Differentiate implicitly. Use product rule on xy. Collect dy/dx and solve.'],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-inverse',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 3 — Inverse Function. Let f(x) = x³ + 2x − 5. (a) Verify f is one-to-one. (b) Compute (f⁻¹)\'(-2) using the inverse-function derivative formula. (c) Find f\'\'(x).',
      expectedAnswer:
        '(a) f\'(x) = 3x² + 2. Since 3x² ≥ 0, f\'(x) ≥ 2 > 0 for all x. f is strictly increasing → one-to-one. (2 points)\n(b) Need f⁻¹(-2). Solve x³ + 2x − 5 = -2 → x³ + 2x − 3 = 0. Try x = 1: 1 + 2 − 3 = 0. ✓ So f⁻¹(-2) = 1. f\'(1) = 3 + 2 = 5. (f⁻¹)\'(-2) = 1/f\'(1) = 1/5. (3 points)\n(c) f\'(x) = 3x² + 2. f\'\'(x) = 6x. (1.5 points)\nTotal: 6.5 points.',
      responseFormat: 'frq',
      hints: ['Verify monotonicity via f\'. Find f⁻¹(b) by solving f(x) = b.'],
      estimatedMinutes: 6,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Chain rule: outer\' at inner times inner\'.',
        'Implicit: d/dx everywhere; chain rule on y; collect dy/dx.',
        'Inverse formula: (f⁻¹)\'(b) = 1/f\'(f⁻¹(b)).',
        'Higher orders: differentiate repeatedly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ',
    cedTitle: 'Unit 3 FRQ Practice',
    sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-3 patterns.' }],
  },
};
