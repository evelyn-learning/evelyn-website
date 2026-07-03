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
        '(a) Chain: 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴. (2)\n(b) Chain: cos(e^x) · e^x = e^x cos(e^x). (2)\n(c) Chain: (1/cos x)·(-sin x) = -tan x. (Or via -sin/cos = -tan.) (2)\n(d) Chain: 1/(1 + (2x)²) · 2 = 2/(1 + 4x²). (3)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Applies the chain rule to (3x² + 1)⁵: outer derivative 5(3x² + 1)⁴ (1 pt) times inner derivative 6x, giving the simplified 30x(3x² + 1)⁴ (1 pt).', modelResponse: 'Outer u⁵, inner u = 3x² + 1. dy/dx = 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴.' },
          { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Applies the chain rule to sin(e^x): derivative of sine is cos(e^x) (1 pt) times inner derivative e^x, giving e^x cos(e^x) (1 pt).', modelResponse: 'dy/dx = cos(e^x) · e^x = e^x cos(e^x).' },
          { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Applies the chain rule to ln(cos x): (1/cos x) times (−sin x) (1 pt), simplified to −tan x (1 pt).', modelResponse: 'dy/dx = (1/cos x)·(−sin x) = −sin x / cos x = −tan x.' },
          { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Recalls d/dx[arctan u] = u′/(1 + u²) (1 pt), sets u = 2x so u′ = 2 giving 2/(1 + (2x)²) (1 pt), and simplifies to 2/(1 + 4x²) (1 pt).', modelResponse: 'With u = 2x, dy/dx = 1/(1 + (2x)²) · 2 = 2/(1 + 4x²).' },
        ],
      },
      modelResponse:
        '(a) dy/dx = 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴. (b) dy/dx = cos(e^x) · e^x = e^x cos(e^x). (c) dy/dx = (1/cos x)(−sin x) = −tan x. (d) dy/dx = 1/(1 + (2x)²) · 2 = 2/(1 + 4x²).',
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
        '(a) 4 + 6 + 9 = 19 ✓ (1)\n(b) Differentiate: 2x + (y + x·dy/dx) + 2y·dy/dx = 0. Collect: dy/dx·(x + 2y) = -(2x + y). dy/dx = -(2x + y)/(x + 2y). (4 points)\n(c) At (2, 3): dy/dx = -(4 + 3)/(2 + 6) = -7/8. Tangent: y − 3 = -7/8·(x − 2). (3 points)\n(d) -7/8. (1 point)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 1, scoringCriteria: 'Substitutes (2, 3) into x² + xy + y² and shows it equals 19 (4 + 6 + 9 = 19).', modelResponse: '(2)² + (2)(3) + (3)² = 4 + 6 + 9 = 19 ✓, so (2, 3) is on the curve.' },
          { criterionId: 'b', maxPoints: 4, scoringCriteria: 'Differentiates both sides implicitly, using the product rule on xy and the chain rule on y² (2 pts: 2x + y + x·dy/dx + 2y·dy/dx = 0), collects the dy/dx terms (1 pt), and solves dy/dx = −(2x + y)/(x + 2y) (1 pt).', modelResponse: 'd/dx: 2x + (y + x·dy/dx) + 2y·dy/dx = 0. Collect: dy/dx·(x + 2y) = −(2x + y). So dy/dx = −(2x + y)/(x + 2y).' },
          { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Evaluates the slope at (2, 3) as −7/8 (1 pt) and writes a correct point-slope tangent line y − 3 = −7/8·(x − 2) (2 pts).', modelResponse: 'At (2, 3): dy/dx = −(4 + 3)/(2 + 6) = −7/8. Tangent line: y − 3 = −7/8·(x − 2).' },
          { criterionId: 'd', maxPoints: 1, scoringCriteria: 'States the numerical value dy/dx = −7/8 at the point (2, 3).', modelResponse: 'dy/dx = −7/8 at (2, 3).' },
        ],
      },
      modelResponse:
        '(a) 4 + 6 + 9 = 19 ✓. (b) 2x + y + x·dy/dx + 2y·dy/dx = 0 ⇒ dy/dx = −(2x + y)/(x + 2y). (c) At (2, 3), dy/dx = −7/8; tangent y − 3 = −7/8(x − 2). (d) dy/dx = −7/8.',
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
        '(a) f\'(x) = 3x² + 2. Since 3x² ≥ 0, f\'(x) ≥ 2 > 0 for all x. f is strictly increasing → one-to-one. (3 points)\n(b) Need f⁻¹(-2). Solve x³ + 2x − 5 = -2 → x³ + 2x − 3 = 0. Try x = 1: 1 + 2 − 3 = 0. ✓ So f⁻¹(-2) = 1. f\'(1) = 3 + 2 = 5. (f⁻¹)\'(-2) = 1/f\'(1) = 1/5. (4 points)\n(c) f\'(x) = 3x² + 2. f\'\'(x) = 6x. (2 points)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Computes f\'(x) = 3x² + 2 (1 pt), argues 3x² ≥ 0 so f\'(x) ≥ 2 > 0 for all x (1 pt), and concludes f is strictly increasing hence one-to-one (1 pt).', modelResponse: 'f\'(x) = 3x² + 2. Since 3x² ≥ 0, f\'(x) ≥ 2 > 0 for every x, so f is strictly increasing and therefore one-to-one.' },
          { criterionId: 'b', maxPoints: 4, scoringCriteria: 'Sets f(x) = −2 and solves x³ + 2x − 3 = 0 to find f⁻¹(−2) = 1 (2 pts), computes f\'(1) = 5 (1 pt), and applies (f⁻¹)\'(−2) = 1/f\'(1) = 1/5 (1 pt).', modelResponse: 'Solve x³ + 2x − 5 = −2 ⇒ x³ + 2x − 3 = 0; x = 1 works, so f⁻¹(−2) = 1. f\'(1) = 3(1)² + 2 = 5. (f⁻¹)\'(−2) = 1/f\'(1) = 1/5.' },
          { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Differentiates f\'(x) = 3x² + 2 (1 pt) to obtain f\'\'(x) = 6x (1 pt).', modelResponse: 'f\'(x) = 3x² + 2, so f\'\'(x) = 6x.' },
        ],
      },
      modelResponse:
        '(a) f\'(x) = 3x² + 2 ≥ 2 > 0 for all x, so f is strictly increasing and one-to-one. (b) f(x) = −2 ⇒ x³ + 2x − 3 = 0 ⇒ x = 1, so f⁻¹(−2) = 1; f\'(1) = 5, thus (f⁻¹)\'(−2) = 1/5. (c) f\'\'(x) = 6x.',
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
