/**
 * AP Calculus BC — CED Unit 3.3 + 3.4: Derivatives of Inverse Functions
 * + Inverse Trig Derivatives. Combined.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U3_DERIVATIVES_INVERSE: LessonPlan = {
  id: 'evelyn.ap.calcbc.derivatives-inverse-functions.v1',
  title: 'U3.3 Derivatives of Inverse Functions',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.derivatives-inverse-functions',
      description:
        'Apply the inverse-function derivative formula (f⁻¹)\'(b) = 1 / f\'(f⁻¹(b)). Memorize and apply derivatives of arcsin, arccos, arctan.',
      standard: 'AP-CALCBC-3.3-3.4',
    },
  ],
  prerequisites: ['apcalcbc.implicit-differentiation'],
  followUps: ['apcalcbc.higher-order-derivatives'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame inverse derivatives as the natural counterpart to direct derivatives.',
      script:
        "If f and f⁻¹ are inverses, their graphs are reflections across y = x. Derivatives are RECIPROCALS of each other (with appropriate evaluation). One formula links them, and from it we get the derivatives of arcsin, arccos, and arctan.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-inverse',
      kind: 'concept',
      goal: 'Cover the inverse-function derivative formula + standard inverse-trig derivatives.',
      keyIdeas: [
        'INVERSE FUNCTION DERIVATIVE FORMULA: if f and g are inverses (g(f(x)) = x), and f is differentiable at a with f\'(a) ≠ 0, then g\'(f(a)) = 1/f\'(a). Equivalently: (f⁻¹)\'(b) = 1/f\'(f⁻¹(b)).',
        'DERIVATION (sketch): if g(f(x)) = x, differentiate both sides w.r.t. x: g\'(f(x))·f\'(x) = 1, so g\'(f(x)) = 1/f\'(x). Setting f(x) = b means x = g(b) = f⁻¹(b). Therefore (f⁻¹)\'(b) = 1/f\'(f⁻¹(b)).',
        'INVERSE TRIG DERIVATIVES (must memorize):',
        'd/dx[arcsin(x)] = 1/√(1 − x²). Domain |x| < 1.',
        'd/dx[arccos(x)] = -1/√(1 − x²). Domain |x| < 1. NEGATIVE of arcsin\'s.',
        'd/dx[arctan(x)] = 1/(1 + x²). Domain all x.',
        'd/dx[arccot(x)] = -1/(1 + x²). NEGATIVE of arctan\'s.',
        'd/dx[arcsec(x)] = 1/(|x|√(x² − 1)). Domain |x| > 1.',
        'd/dx[arccsc(x)] = -1/(|x|√(x² − 1)). NEGATIVE of arcsec\'s.',
        'CHAIN RULE WITH INVERSE TRIGS. d/dx[arcsin(g(x))] = g\'(x)/√(1 − g(x)²). And similarly for the others.',
      ],
      vocabulary: [
        { term: 'inverse function derivative formula', definition: '(f⁻¹)\'(b) = 1/f\'(f⁻¹(b)).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-inverse-formula',
      kind: 'worked_example',
      problem:
        'Let f(x) = x³ + x + 2. The function is one-to-one (strictly increasing). Find (f⁻¹)\'(4).',
      steps: [
        'STEP 1 — APPLY (f⁻¹)\'(b) = 1/f\'(f⁻¹(b)). Need f⁻¹(4).',
        'STEP 2 — FIND f⁻¹(4). We need x such that f(x) = 4. Try x = 1: f(1) = 1 + 1 + 2 = 4. ✓ So f⁻¹(4) = 1.',
        'STEP 3 — COMPUTE f\'(x) = 3x² + 1. f\'(1) = 3 + 1 = 4.',
        'STEP 4 — APPLY FORMULA. (f⁻¹)\'(4) = 1/f\'(f⁻¹(4)) = 1/f\'(1) = 1/4.',
      ],
      answer: '(f⁻¹)\'(4) = 1/4',
      estimatedMinutes: 4,
    },
    {
      id: 'try-inverse-trig',
      kind: 'try_yourself',
      problem:
        'Differentiate. (a) y = arctan(x). (b) y = arcsin(2x). (c) y = arctan(x²).',
      expectedAnswer:
        '(a) 1/(1 + x²). (b) Chain rule: 1/√(1 − (2x)²) · 2 = 2/√(1 − 4x²). (c) Chain rule: 1/(1 + (x²)²) · 2x = 2x/(1 + x⁴).',
      responseFormat: 'numeric',
      hints: ['Inverse trig derivative formulas, then chain rule for the inner.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-formula-application',
      kind: 'try_yourself',
      problem:
        'Let f(x) = e^x + x. (a) Verify f is invertible (strictly monotonic). (b) Find (f⁻¹)\'(1).',
      expectedAnswer:
        '(a) f\'(x) = e^x + 1. Since e^x > 0 for all x, e^x + 1 > 1 > 0. f\'(x) > 0 always → f is strictly increasing → invertible. (b) Apply (f⁻¹)\'(b) = 1/f\'(f⁻¹(b)) with b = 1. Need f⁻¹(1): solve f(x) = 1, i.e., e^x + x = 1. Try x = 0: e^0 + 0 = 1. ✓ So f⁻¹(1) = 0. f\'(0) = e^0 + 1 = 2. So (f⁻¹)\'(1) = 1/2.',
      responseFormat: 'numeric',
      hints: ['Verify monotonic via f\'. Find f⁻¹(b) by solving f(x) = b.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-derive-arctan',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Use the inverse-function derivative formula to DERIVE d/dx[arctan(x)] = 1/(1 + x²). Hint: let y = arctan(x), so tan(y) = x.',
      expectedAnswer:
        'Let y = arctan(x). Then tan(y) = x. Differentiate both sides with respect to x. Left: sec²(y) · dy/dx (chain rule). Right: 1. So sec²(y) · dy/dx = 1, giving dy/dx = 1/sec²(y) = cos²(y). Now use the relationship: tan(y) = x means we can think of a right triangle with opposite x and adjacent 1, so hypotenuse = √(x² + 1). Therefore cos(y) = 1/√(x² + 1), and cos²(y) = 1/(x² + 1). Conclusion: dy/dx = 1/(1 + x²). Strong answers: (i) set y = arctan(x), (ii) implicitly differentiate, (iii) convert sec²(y) or cos²(y) to expression in x using triangle / Pythagorean identity.',
      responseFormat: 'frq',
      hints: ['Set y = arctan(x), so x = tan(y). Implicit differentiation. Convert back to x using Pythagorean identity.'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '(f⁻¹)\'(b) = 1/f\'(f⁻¹(b)).',
        'arcsin: 1/√(1−x²). arccos: -1/√(1−x²). arctan: 1/(1+x²).',
        'Negative pairs: arccos = -arcsin\', arccot = -arctan\', arccsc = -arcsec\'.',
        'Chain rule extends each: d/dx[arcsin(g(x))] = g\'(x)/√(1−g²).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.3-3.4',
    cedTitle: 'Derivatives of Inverse Functions and Inverse Trig',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Standard inverse-function derivative.' }],
  },
};
