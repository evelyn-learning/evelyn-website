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
        '(a) PRODUCT RULE: f\'(x) = 2x·sin x + (x² + 3)·cos x. (3 points)\n(b) QUOTIENT RULE: g\'(x) = [e^x(x + 1) − e^x·1]/(x + 1)² = e^x·x/(x + 1)² = xe^x/(x + 1)². (3 points)\n(c) LINEARITY + each derivative: h\'(x) = 20x³ − 3/x − 2 sin x. (3 points)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Applies the product rule to (x² + 3)·sin x: derivative of the first times the second plus the first times derivative of the second, giving f′(x) = 2x·sin x + (x² + 3)·cos x. 1 point for correct product-rule setup, 1 for correct derivative factors.', modelResponse: 'Product rule: f′(x) = (2x)(sin x) + (x² + 3)(cos x) = 2x·sin x + (x² + 3)·cos x.' },
          { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Applies the quotient rule to eˣ/(x + 1) with correct numerator order and the middle minus, then simplifies: g′(x) = [eˣ(x + 1) − eˣ]/(x + 1)² = x·eˣ/(x + 1)². 1 point for correct quotient-rule setup, 1 for simplification.', modelResponse: 'Quotient rule: g′(x) = [eˣ(x + 1) − eˣ(1)]/(x + 1)² = eˣ·x/(x + 1)² = x·eˣ/(x + 1)².' },
          { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Differentiates term-by-term using linearity: d/dx[5x⁴] = 20x³, d/dx[−3 ln x] = −3/x, d/dx[2 cos x] = −2 sin x, giving h′(x) = 20x³ − 3/x − 2 sin x (correct signs on the ln and cos derivatives).', modelResponse: 'By linearity: h′(x) = 20x³ − 3/x − 2 sin x.' },
        ],
      },
      modelResponse:
        '(a) Product rule: f′(x) = 2x·sin x + (x² + 3)·cos x.\n(b) Quotient rule: g′(x) = [eˣ(x + 1) − eˣ]/(x + 1)² = x·eˣ/(x + 1)².\n(c) Linearity: h′(x) = 20x³ − 3/x − 2 sin x.',
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
        '(a) Product rule: f\'(x) = 1·e^x + x·e^x = e^x(1 + x). (3 points)\n(b) f\'(0) = e^0·(1 + 0) = 1·1 = 1. Slope = 1. (1 point)\n(c) f(0) = 0·e^0 = 0. Point (0, 0). Tangent: y − 0 = 1·(x − 0), i.e., y = x. (3 points)\n(d) Horizontal tangent: f\'(x) = 0. e^x(1 + x) = 0. e^x is NEVER zero, so 1 + x = 0 → x = -1. The tangent is horizontal only at x = -1. (2 points)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Applies the product rule to x·eˣ: f′(x) = 1·eˣ + x·eˣ = eˣ(1 + x). 1 point for product-rule setup, 1 for correct factored derivative.', modelResponse: 'Product rule: f′(x) = (1)(eˣ) + (x)(eˣ) = eˣ(1 + x).' },
          { criterionId: 'b', maxPoints: 1, scoringCriteria: 'Substitutes x = 0 into f′ to get the slope f′(0) = e⁰(1 + 0) = 1.', modelResponse: 'f′(0) = e⁰(1 + 0) = 1, so the slope is 1.' },
          { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Finds the point f(0) = 0 and writes the tangent line in point-slope form y − 0 = 1(x − 0), i.e. y = x. 1 point for the point, 1 for the correct line equation.', modelResponse: 'f(0) = 0·e⁰ = 0, so the point is (0, 0). Tangent: y − 0 = 1(x − 0) ⇒ y = x.' },
          { criterionId: 'd', maxPoints: 2, scoringCriteria: 'Sets f′(x) = 0, argues eˣ is never zero so 1 + x = 0, and concludes the tangent is horizontal only at x = −1. 1 point for setting f′ = 0 with the eˣ ≠ 0 justification, 1 for x = −1.', modelResponse: 'Horizontal tangent ⇒ f′(x) = eˣ(1 + x) = 0. Since eˣ > 0 for all x, we need 1 + x = 0 ⇒ x = −1. Horizontal only at x = −1.' },
        ],
      },
      modelResponse:
        '(a) Product rule: f′(x) = eˣ(1 + x).\n(b) f′(0) = 1, so the slope is 1.\n(c) f(0) = 0, point (0, 0); tangent line y = x.\n(d) f′(x) = eˣ(1 + x) = 0; eˣ ≠ 0, so x = −1 is the only horizontal tangent.',
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
        '(a) CONTINUITY at x = 1: lim_{x→1⁻} f = 1² = 1. f(1) = 1 (from x ≤ 1 branch). Right side: lim_{x→1⁺} f = a + b. Continuity: a + b = 1.\nDIFFERENTIABILITY at x = 1: left derivative = d/dx[x²] at 1 = 2(1) = 2. Right derivative = d/dx[ax + b] at 1 = a. Differentiability: a = 2.\nFrom a = 2 and a + b = 1: b = 1 − a = -1.\nValues: a = 2, b = -1. (6 points: 4 for setting up the two equations, 2 for solving)\n(b) VERIFY. With a = 2, b = -1: f(x) = 2x − 1 for x > 1. At x = 1: left value = 1; right limit = 2(1) − 1 = 1; f(1) = 1. ✓ continuity. Left slope = 2; right slope = 2. ✓ differentiability. (3 points)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a-continuity', maxPoints: 2, scoringCriteria: 'Sets up the continuity condition at x = 1 by matching the branch values: left value/f(1) = 1² = 1 and right limit = a + b, giving a + b = 1.', modelResponse: 'Continuity at x = 1: lim_{x→1⁻} f = f(1) = 1² = 1 and lim_{x→1⁺} f = a + b, so a + b = 1.' },
          { criterionId: 'a-differentiability', maxPoints: 2, scoringCriteria: 'Sets up the differentiability condition at x = 1 by matching one-sided derivatives: left derivative d/dx[x²] = 2 and right derivative d/dx[ax + b] = a, giving a = 2.', modelResponse: 'Differentiability at x = 1: left derivative = 2x|_{x=1} = 2 and right derivative = a, so a = 2.' },
          { criterionId: 'a-solve', maxPoints: 2, scoringCriteria: 'Solves the two equations for the parameters: a = 2 (from the derivative condition) and then b = 1 − a = −1 (from the continuity condition).', modelResponse: 'From a = 2 and a + b = 1: b = 1 − 2 = −1. So a = 2, b = −1.' },
          { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Verifies both conditions with a = 2, b = −1: continuity (left value 1, right value 2(1) − 1 = 1, f(1) = 1 all agree) and differentiability (left slope 2 = right slope 2).', modelResponse: 'With a = 2, b = −1: at x = 1 left value = 1, right value = 2(1) − 1 = 1 = f(1) ✓ (continuous); left slope = 2, right slope = a = 2 ✓ (differentiable).' },
        ],
      },
      modelResponse:
        '(a) Continuity: a + b = 1. Differentiability: left slope 2 = right slope a, so a = 2. Then b = 1 − 2 = −1. Thus a = 2, b = −1.\n(b) Check with a = 2, b = −1: values match at x = 1 (both 1) ⇒ continuous; slopes match (both 2) ⇒ differentiable.',
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
