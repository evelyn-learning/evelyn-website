/**
 * AP Calculus BC — CED Unit 7.3+7.4: Slope Fields.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_SLOPE_FIELDS: LessonPlan = {
  id: 'evelyn.ap.calcbc.slope-fields.v1', title: 'U7.3 Slope Fields',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.slope-fields', description: 'Sketch slope fields for a differential equation dy/dx = f(x, y), match slope fields to differential equations, and trace approximate solution curves through given points.', standard: 'AP-CALCBC-7.3-7.4' }],
  prerequisites: ['apcalcbc.modeling-verifying-de'], followUps: ['apcalcbc.eulers-method'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame slope fields as visual portraits of DEs.', script: "A slope field is the GRAPHICAL view of a DE — at each (x, y), draw a tiny line segment with slope f(x, y). The picture shows the FAMILY of solution curves at a glance. AP loves this visualization.", estimatedMinutes: 2 },
    { id: 'concept-slope-fields', kind: 'concept', goal: 'Cover slope-field construction and reading.',
      keyIdeas: [
        'A SLOPE FIELD for dy/dx = f(x, y) draws a small line segment AT each point (x, y) with slope = f(x, y).',
        'CONSTRUCTING by hand: pick a grid of (x, y) points; compute slope f(x, y) at each; draw a small dash with that slope.',
        'TRACING A SOLUTION CURVE: starting at an initial condition (x_0, y_0), follow the slope-direction at each point. The trajectory traces an approximate solution curve.',
        'MATCHING DEs to slope fields: read the slope pattern. Vertical-only dependence (dy/dx = f(x)): slopes vary with x but constant in y. Horizontal-only (dy/dx = g(y)): slopes vary with y. Both: slopes vary with both.',
        'READING ASYMPTOTIC BEHAVIOR. Look at slopes far from origin or as x or y → ∞ to predict end behavior of solutions.',
        'SPECIAL CASES: dy/dx = 0 → horizontal segments → constant solutions. dy/dx undefined (e.g., 1/y at y = 0) → vertical segments / no field.',
      ],
      suggestedTools: ['show_function_graph'], estimatedMinutes: 5 },
    { id: 'worked-construct', kind: 'worked_example', problem: 'Sketch (mentally) the slope field for dy/dx = x. Describe the pattern.',
      steps: ['STEP 1 — Slope at (x, y) is x — depends only on x.', 'STEP 2 — At x = 0: all slopes 0 (horizontal). At x = 1: all slopes 1 (45° up). At x = -2: all slopes -2 (steeply down).', 'STEP 3 — Pattern: vertical "columns" of identical slopes, each column\'s slope = x-coordinate of column.', 'STEP 4 — Solutions: integrating dy/dx = x gives y = x²/2 + C — parabolas. Slope field shows parabolic shape.'], answer: 'Vertical columns; slopes increase linearly with x. Solutions: parabolas.', estimatedMinutes: 4 },
    { id: 'try-trace', kind: 'try_yourself', problem: 'For the DE dy/dx = y, describe the slope-field pattern. Then sketch (mentally) the solution curve through (0, 1).',
      expectedAnswer: 'Slope = y depends only on y. At y = 0: all slopes 0 (horizontal). At y = 1: slopes 1 (rising). At y = 2: slopes 2 (steep up). At y = -1: slopes -1 (down). HORIZONTAL "rows" of identical slopes; magnitude grows with |y|. Solution through (0, 1): y = e^x. (Verify: dy/dx = e^x = y. ✓) Curve rises exponentially.', responseFormat: 'free', hints: ['Slope depends only on y → horizontal rows. Solve dy/dx = y for explicit form.'], estimatedMinutes: 4 },
    { id: 'try-match', kind: 'try_yourself', problem: 'AP-style synthesis. Three slope fields: (i) all slopes = 1 everywhere; (ii) slopes = 0 along x-axis, increasing in magnitude away from x-axis; (iii) slopes converge toward y = 0 from both sides. Match each to one of: dy/dx = 1, dy/dx = y, dy/dx = -y.',
      expectedAnswer: '(i) "all slopes = 1": dy/dx = 1. (ii) "slopes 0 on x-axis, grow with |y|": dy/dx = y. (iii) "slopes converge toward y = 0": this is an ATTRACTING equilibrium at y = 0. dy/dx = -y matches: positive y → negative slope (decreasing toward 0); negative y → positive slope (rising toward 0). Solutions are y = Ce^(-x), all decaying to 0.', responseFormat: 'free', hints: ['Look for slope dependence on x vs y; equilibria where slope = 0; attracting vs repelling behavior.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Slope field: at each (x,y), draw segment with slope f(x,y).',
      'dy/dx = f(x): vertical columns of identical slopes.',
      'dy/dx = g(y): horizontal rows of identical slopes.',
      'Trace solution curve by following slopes from initial condition.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.3-7.4', cedTitle: 'Slope Fields', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '6', note: 'Standard slope fields.' }] },
};
