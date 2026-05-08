/**
 * AP Calculus BC — CED Unit 9.1+9.2: Parametric Equations and
 * Differentiation.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_PARAMETRIC: LessonPlan = {
  id: 'evelyn.ap.calcbc.parametric.v1', title: 'U9.1 Parametric Equations and Differentiation',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.parametric', description: 'Parametric curves x(t), y(t); compute dy/dx = (dy/dt)/(dx/dt) and the second derivative d²y/dx² = (d/dt)(dy/dx)/(dx/dt). Identify horizontal and vertical tangents.', standard: 'AP-CALCBC-9.1-9.2' }],
  prerequisites: ['apcalcbc.arc-length'], followUps: ['apcalcbc.parametric-arc-length'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame parametric as describing curves not constrained to be functions.', script: "Parametric equations let us describe curves where x and y BOTH depend on a third variable t. Useful when y isn't a function of x (like a circle). Differentiation rules adapt: dy/dx = (dy/dt)/(dx/dt).", estimatedMinutes: 2 },
    { id: 'concept-parametric', kind: 'concept', goal: 'Cover parametric, derivatives, second derivatives, special tangents.',
      keyIdeas: [
        'PARAMETRIC EQUATIONS: x = f(t), y = g(t). The parameter t traces out a curve in the (x, y)-plane.',
        'EXAMPLES: x = cos t, y = sin t (unit circle, parameterized by t = angle). x = t, y = t² (the parabola y = x², parameterized linearly in t).',
        'FIRST DERIVATIVE: dy/dx = (dy/dt) / (dx/dt) = g\'(t) / f\'(t). Provided f\'(t) ≠ 0.',
        'SECOND DERIVATIVE (chain rule): d²y/dx² = d/dx[dy/dx] = d/dt[dy/dx] / (dx/dt). NOT (d²y/dt²)/(d²x/dt²).',
        'HORIZONTAL TANGENT: dy/dx = 0 → dy/dt = 0 (with dx/dt ≠ 0). Tangent line has slope 0.',
        'VERTICAL TANGENT: dy/dx undefined → dx/dt = 0 (with dy/dt ≠ 0). Tangent line is vertical.',
        'SIMULTANEOUS dx/dt = 0 AND dy/dt = 0: a CUSP. Need limit analysis to determine tangent (often DNE).',
        'EXAMPLE: x = t² − 4, y = t³ − 3t. dx/dt = 2t. dy/dt = 3t² − 3. dy/dx = (3t² − 3)/(2t). Horizontal tangent: 3t² − 3 = 0 → t = ±1, with dx/dt = ±2 ≠ 0. ✓ At t = 1: (x,y) = (-3, -2). At t = -1: (x,y) = (-3, 2). Vertical tangent: dx/dt = 0 → t = 0. dy/dt = -3 ≠ 0. ✓ At t = 0: (x,y) = (-4, 0).',
      ],
      vocabulary: [{ term: 'parametric', definition: 'curve given by x(t), y(t) — both functions of a parameter.' }],
      estimatedMinutes: 5 },
    { id: 'worked-deriv', kind: 'worked_example', problem: 'For x = t², y = t³ + t, find dy/dx and d²y/dx² at t = 1.',
      steps: [
        'STEP 1 — dx/dt = 2t. dy/dt = 3t² + 1.',
        'STEP 2 — dy/dx = (3t² + 1)/(2t). At t = 1: 4/2 = 2.',
        'STEP 3 — d²y/dx². First, d/dt[dy/dx] = d/dt[(3t² + 1)/(2t)]. Quotient rule: ((6t)·2t − (3t² + 1)·2)/(2t)² = (12t² − 6t² − 2)/(4t²) = (6t² − 2)/(4t²). At t = 1: 4/4 = 1.',
        'STEP 4 — d²y/dx² = (d/dt[dy/dx])/(dx/dt) = 1/2 at t = 1.',
      ],
      answer: 'dy/dx = 2; d²y/dx² = 1/2 at t = 1.', estimatedMinutes: 5 },
    { id: 'try-tangents', kind: 'try_yourself', problem: 'For x = t² − 4t, y = t² − 4, find values of t where the curve has horizontal tangents and vertical tangents.',
      expectedAnswer: 'dx/dt = 2t − 4. dy/dt = 2t. Horizontal: dy/dt = 0 with dx/dt ≠ 0 → t = 0; check dx/dt = -4 ≠ 0. ✓ Horizontal tangent at t = 0. Vertical: dx/dt = 0 with dy/dt ≠ 0 → 2t − 4 = 0 → t = 2; dy/dt = 4 ≠ 0. ✓ Vertical tangent at t = 2.',
      responseFormat: 'numeric', hints: ['Horizontal: dy/dt = 0. Vertical: dx/dt = 0. Don\'t both vanish.'], estimatedMinutes: 4 },
    { id: 'try-second', kind: 'try_yourself', problem: 'AP-style synthesis. For x = t³ − 3t, y = t² + 2, find dy/dx and d²y/dx² as functions of t.',
      expectedAnswer: 'dx/dt = 3t² − 3 = 3(t² − 1). dy/dt = 2t. dy/dx = 2t/(3(t² − 1)). For d²y/dx²: differentiate dy/dx w.r.t. t. Let u = 2t, v = 3(t² − 1). Quotient: (u\'v − uv\')/v² = (2·3(t²−1) − 2t·6t)/(3(t²−1))² = (6t² − 6 − 12t²)/(9(t²−1)²) = (-6t² − 6)/(9(t²−1)²) = -6(t² + 1)/(9(t²−1)²) = -2(t² + 1)/(3(t²−1)²). Then d²y/dx² = (above)/(dx/dt) = [-2(t² + 1)/(3(t²−1)²)] / [3(t² − 1)] = -2(t² + 1)/(9(t²−1)³).',
      responseFormat: 'frq', hints: ['Compute first; then differentiate first w.r.t. t; divide by dx/dt.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'dy/dx = (dy/dt)/(dx/dt). Provided dx/dt ≠ 0.',
      'd²y/dx² = (d/dt[dy/dx])/(dx/dt). NOT (d²y/dt²)/(d²x/dt²).',
      'Horizontal tangent: dy/dt = 0. Vertical: dx/dt = 0.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9.1-9.2', cedTitle: 'Parametric Differentiation', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '10', note: 'Standard parametric.' }] },
};
