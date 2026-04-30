/**
 * AP Calculus BC — Parametric equations.
 *
 * Curves defined by x(t) and y(t). Derivatives and integrals
 * along parametric paths.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_BC_PARAMETRIC: LessonPlan = {
  id: 'evelyn.ap.calcbc.parametric.v1',
  title: 'Parametric equations: derivatives and arc length',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.parametric',
      description: 'Differentiate and integrate parametric equations.',
      standard: 'AP-CALCBC-CHA-3',
    },
  ],
  prerequisites: ['apcalc.derivative-rules'],
  followUps: ['apcalcbc.polar'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why we need parameters: paths that aren\'t functions of x.',
      script: 'A circle isn\'t a function — it fails the vertical line test. But describe it as a PATH traced over time, with x(t) and y(t), and circles are easy. That\'s the power of parametric equations.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-derivatives-arc-length',
      kind: 'concept',
      goal: 'Definition + dy/dx formula + arc length integral.',
      keyIdeas: [
        'PARAMETRIC: instead of y = f(x), define x = f(t) and y = g(t). The PARAMETER t (often time) traces a path.',
        'Common example: a circle of radius r is x = r cos t, y = r sin t for t ∈ [0, 2π].',
        'DERIVATIVE dy/dx for parametric: dy/dx = (dy/dt) / (dx/dt). Both must be evaluated at the same t.',
        'SECOND derivative: d²y/dx² = d/dt(dy/dx) / (dx/dt). Note the dx/dt in the denominator — chain rule.',
        'TANGENT LINE at parameter t₀: slope = (dy/dt) / (dx/dt) evaluated at t₀.',
        'ARC LENGTH formula: L = ∫_a^b √((dx/dt)² + (dy/dt)²) dt. Adds infinitesimal path lengths.',
        'SPEED at parameter t: ds/dt = √((dx/dt)² + (dy/dt)²). Same integrand as arc length.',
      ],
      vocabulary: [
        { term: 'parameter', definition: 'an independent variable (often t) used to define x and y.' },
        { term: 'arc length', definition: 'the total length of a curve between two parameter values.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-derivative',
      kind: 'worked_example',
      problem: 'For x = t² + 1 and y = t³, find dy/dx at t = 2.',
      steps: [
        'dx/dt = 2t. dy/dt = 3t².',
        'dy/dx = (dy/dt) / (dx/dt) = 3t² / (2t) = (3/2)t.',
        'At t = 2: dy/dx = (3/2)(2) = 3.',
        'So the slope of the tangent at t = 2 is 3.',
      ],
      answer: '3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-arc-length',
      kind: 'worked_example',
      problem: 'Find the arc length of x = cos t, y = sin t from t = 0 to t = π.',
      steps: [
        'dx/dt = -sin t. dy/dt = cos t.',
        '(dx/dt)² + (dy/dt)² = sin²t + cos²t = 1.',
        'L = ∫_0^π √1 dt = ∫_0^π 1 dt = π.',
        'Half a unit circle has arc length π — confirms our formula.',
      ],
      answer: 'π',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For x = 3t and y = t², find dy/dx as a function of t.',
      expectedAnswer: '(2t)/3 or (2/3)t',
      responseFormat: 'free',
      hints: [
        'dx/dt = 3, dy/dt = 2t.',
        '(dy/dt)/(dx/dt) = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-derivative-direct',
      kind: 'misconception_check',
      question: 'Can you find dy/dx by directly differentiating y with respect to x?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating y as a direct function of x.',
          correctsTo: 'In parametric form, y is a function of t, not x. To get dy/dx, use the chain-rule formula (dy/dt)/(dx/dt). You can ELIMINATE the parameter sometimes (solve for t and substitute), but the parametric formula always works.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parametric: x = f(t), y = g(t).',
        'dy/dx = (dy/dt) / (dx/dt).',
        'Arc length: L = ∫ √((dx/dt)² + (dy/dt)²) dt.',
        'Useful for paths that aren\'t functions (circles, loops).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A particle moves with x = t² and y = t³. At what time is the path SMOOTH (tangent well-defined)?',
      hint: 'Tangent is well-defined when dx/dt and dy/dt are not BOTH zero. dx/dt = 2t, dy/dt = 3t². Both zero at t = 0 — that\'s a CUSP. Path is smooth for t ≠ 0.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
