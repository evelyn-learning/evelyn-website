/**
 * AP Calculus BC — CED Unit 3.2: Implicit Differentiation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U3_IMPLICIT_DIFFERENTIATION: LessonPlan = {
  id: 'evelyn.ap.calcbc.implicit-differentiation.v1',
  title: 'U3.2 Implicit Differentiation',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.implicit-differentiation',
      description:
        'Apply implicit differentiation to find dy/dx for equations relating x and y where y cannot be solved explicitly. Treat y as a function of x and apply chain rule consistently.',
      standard: 'AP-CALCBC-3.2',
    },
  ],
  prerequisites: ['apcalcbc.chain-rule'],
  followUps: ['apcalcbc.derivatives-inverse-functions'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame implicit differentiation as the way to differentiate when you can\'t solve for y.',
      script:
        "Some equations relate x and y but can't be solved cleanly for y. Try x² + y² = 25 — the unit circle. Or x³ + y³ = 6xy — the folium of Descartes. Yet these curves DO have tangent lines, slopes, derivatives. IMPLICIT DIFFERENTIATION lets you find dy/dx without solving for y first.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-implicit',
      kind: 'concept',
      goal: 'Cover the implicit-differentiation procedure + chain-rule application + solving for dy/dx.',
      keyIdeas: [
        'IMPLICIT EQUATION: an equation in x and y that doesn\'t express y as f(x). Examples: x² + y² = 25, sin(xy) = 1, x²y³ + xy = 4.',
        'KEY INSIGHT: even though we don\'t have y = f(x), y IS a function of x (implicitly defined by the equation). So we can differentiate everything WITH RESPECT TO x and apply chain rule wherever y appears.',
        'PROCEDURE for finding dy/dx: (1) DIFFERENTIATE BOTH SIDES with respect to x. (2) ANYWHERE y APPEARS, treat it as a function of x and apply chain rule (multiply by dy/dx). (3) COLLECT all dy/dx terms on one side, all others on the other. (4) SOLVE for dy/dx.',
        'KEY MOVE: d/dx[y] = dy/dx. d/dx[y²] = 2y · dy/dx. d/dx[y³] = 3y² · dy/dx. (Chain rule: outer is the power, inner is y, derivative of inner with respect to x is dy/dx.)',
        'KEY MOVE: d/dx[xy] = (using product rule, with y as a function of x) = 1·y + x·(dy/dx) = y + x·(dy/dx).',
        'KEY MOVE: d/dx[sin(xy)] = cos(xy) · d/dx[xy] = cos(xy) · (y + x·dy/dx). Chain rule + product rule combo.',
        'AFTER DIFFERENTIATION, the equation contains both x, y, and dy/dx. Solve algebraically for dy/dx — it will typically depend on BOTH x and y.',
        'EVALUATING dy/dx at a specific point: plug in x and y values (the point must be on the curve to be valid).',
      ],
      vocabulary: [
        { term: 'implicit differentiation', definition: 'differentiating an equation in x and y with respect to x, treating y as an implicit function of x.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-circle',
      kind: 'worked_example',
      problem:
        'Find dy/dx for the unit circle x² + y² = 1. Then find the slope of the tangent line at the point (3/5, 4/5).',
      steps: [
        'STEP 1 — DIFFERENTIATE BOTH SIDES with respect to x. d/dx[x²] = 2x. d/dx[y²] = 2y · dy/dx (chain rule, treating y as f(x)). d/dx[1] = 0.',
        'STEP 2 — EQUATION. 2x + 2y · dy/dx = 0.',
        'STEP 3 — SOLVE for dy/dx. 2y · dy/dx = -2x. dy/dx = -2x/(2y) = -x/y.',
        'STEP 4 — EVALUATE at (3/5, 4/5). dy/dx = -(3/5)/(4/5) = -3/4.',
        'STEP 5 — INTERPRET. The tangent line at (3/5, 4/5) has slope -3/4. Verify: this point is on the unit circle since (3/5)² + (4/5)² = 9/25 + 16/25 = 25/25 = 1. ✓',
      ],
      answer: 'dy/dx = -x/y. Slope at (3/5, 4/5) = -3/4.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-basic',
      kind: 'try_yourself',
      problem:
        'Find dy/dx using implicit differentiation. (a) x² + 3y² = 7. (b) x³ + y³ = 6xy.',
      expectedAnswer:
        '(a) Differentiate: 2x + 6y · dy/dx = 0. Solve: dy/dx = -2x/(6y) = -x/(3y). (b) Differentiate (using product rule on right side): 3x² + 3y² · dy/dx = 6y + 6x · dy/dx. Collect dy/dx: 3y² · dy/dx − 6x · dy/dx = 6y − 3x². Factor: dy/dx · (3y² − 6x) = 6y − 3x². Solve: dy/dx = (6y − 3x²)/(3y² − 6x) = (2y − x²)/(y² − 2x).',
      responseFormat: 'numeric',
      hints: [
        '(a) Easy: differentiate both sides, isolate dy/dx.',
        '(b) Use product rule on 6xy. Collect dy/dx terms.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-trig',
      kind: 'try_yourself',
      problem:
        'Find dy/dx for sin(xy) = x + y.',
      expectedAnswer:
        'Differentiate both sides. Left: cos(xy) · d/dx[xy] = cos(xy)·(y + x·dy/dx) (chain rule + product rule). Right: 1 + dy/dx. Equation: cos(xy)·(y + x·dy/dx) = 1 + dy/dx. Expand: y cos(xy) + x cos(xy) · dy/dx = 1 + dy/dx. Collect dy/dx: x cos(xy) · dy/dx − dy/dx = 1 − y cos(xy). Factor: dy/dx · (x cos(xy) − 1) = 1 − y cos(xy). Solve: dy/dx = (1 − y cos(xy))/(x cos(xy) − 1).',
      responseFormat: 'numeric',
      hints: ['Chain rule on sin(xy); product rule inside; collect dy/dx.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-tangent',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Find the equation of the tangent line to the curve x² + xy + y² = 7 at the point (1, 2).',
      expectedAnswer:
        'STEP 1 — VERIFY (1, 2) is on the curve: 1 + 1·2 + 4 = 7. ✓\nSTEP 2 — IMPLICIT DIFFERENTIATION. d/dx[x² + xy + y² = 7]: 2x + (y + x·dy/dx) + 2y·dy/dx = 0.\nSTEP 3 — Plug in x = 1, y = 2 BEFORE solving (cleaner): 2(1) + 2 + 1·dy/dx + 2(2)·dy/dx = 0 → 4 + dy/dx + 4·dy/dx = 0 → 4 + 5·dy/dx = 0 → dy/dx = -4/5.\nSTEP 4 — TANGENT LINE at (1, 2) with slope -4/5: y − 2 = -4/5·(x − 1), or y = -4x/5 + 4/5 + 2 = -4x/5 + 14/5.\nStrong answers: verify the point is on the curve, apply implicit differentiation correctly, evaluate at the point, write the tangent line.',
      responseFormat: 'frq',
      hints: [
        'Verify the point is on the curve first.',
        'Differentiate implicitly, plug in (1, 2), solve for dy/dx.',
        'Use point-slope form for the tangent.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'IMPLICIT DIFFERENTIATION: differentiate both sides w.r.t. x, treating y = f(x).',
        'd/dx[y^n] = n·y^(n-1)·dy/dx (chain rule).',
        'd/dx[xy] = y + x·dy/dx (product rule with chain rule).',
        'After differentiating, COLLECT dy/dx and SOLVE.',
        'For tangent lines: differentiate, plug in (a, b) BEFORE solving (often cleaner).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.2',
    cedTitle: 'Implicit Differentiation',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Standard implicit differentiation procedure.' }],
  },
};
