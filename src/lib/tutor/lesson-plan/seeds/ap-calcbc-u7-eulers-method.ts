/**
 * AP Calculus BC — CED Unit 7.5: Euler's Method (BC only).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_EULERS_METHOD: LessonPlan = {
  id: 'evelyn.ap.calcbc.eulers-method.v1', title: 'U7.5 Euler\'s Method',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.eulers-method', description: 'Apply Euler\'s method to numerically approximate a solution to a differential equation given an initial condition. Iterate y_{n+1} = y_n + h·f(x_n, y_n).', standard: 'AP-CALCBC-7.5' }],
  prerequisites: ['apcalcbc.slope-fields'], followUps: ['apcalcbc.separation-of-variables'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame Euler\'s as numerical solution by tangent-line stepping.', script: "When you can't solve a DE analytically, you can step through it NUMERICALLY using tangent lines. Start at the initial point, take a small step in the slope direction, recompute slope, repeat. That's Euler's method — the simplest numerical DE solver and a regular AP Calc BC question.", estimatedMinutes: 2 },
    { id: 'concept-euler', kind: 'concept', goal: 'Cover Euler iteration and its accuracy.',
      keyIdeas: [
        'EULER\'S METHOD ITERATION: given dy/dx = f(x, y) and initial point (x_0, y_0), with step size h:',
        'x_{n+1} = x_n + h',
        'y_{n+1} = y_n + h · f(x_n, y_n)',
        'INTERPRETATION: at each step, use the tangent line at the current point to predict the next point. Repeat.',
        'PROCEDURE — to estimate y at some x = X starting from (x_0, y_0): choose h such that X = x_0 + n·h for some integer n. Iterate n times.',
        'EXAMPLE: dy/dx = x + y, y(0) = 1, h = 0.1. Estimate y(0.3).',
        'Step 1: x_0 = 0, y_0 = 1. Slope = 0 + 1 = 1. y_1 = 1 + 0.1·1 = 1.1. x_1 = 0.1.',
        'Step 2: slope at (0.1, 1.1) = 0.1 + 1.1 = 1.2. y_2 = 1.1 + 0.1·1.2 = 1.22. x_2 = 0.2.',
        'Step 3: slope at (0.2, 1.22) = 0.2 + 1.22 = 1.42. y_3 = 1.22 + 0.1·1.42 = 1.362. x_3 = 0.3.',
        'Estimate: y(0.3) ≈ 1.362.',
        'ACCURACY: smaller h → more accurate (but more computation). Error per step is roughly proportional to h² (from neglected curvature); cumulative error is O(h).',
        'WHEN EULER UNDERESTIMATES vs OVERESTIMATES: depends on concavity. If f is concave up at the current step, the tangent lies BELOW the curve, so Euler\'s line will UNDERESTIMATE. Concave down: overestimate.',
      ],
      estimatedMinutes: 5 },
    { id: 'worked-euler', kind: 'worked_example', problem: 'Use Euler\'s method with step size h = 0.5 to approximate y(2) given dy/dx = x + y, y(0) = 1.',
      steps: [
        'STEP 1 — n = (2 − 0)/0.5 = 4 steps.',
        'Step 0: x = 0, y = 1.',
        'Step 1: slope = 0 + 1 = 1. y_1 = 1 + 0.5·1 = 1.5. x_1 = 0.5.',
        'Step 2: slope = 0.5 + 1.5 = 2. y_2 = 1.5 + 0.5·2 = 2.5. x_2 = 1.',
        'Step 3: slope = 1 + 2.5 = 3.5. y_3 = 2.5 + 0.5·3.5 = 4.25. x_3 = 1.5.',
        'Step 4: slope = 1.5 + 4.25 = 5.75. y_4 = 4.25 + 0.5·5.75 = 7.125. x_4 = 2. ✓',
        'ESTIMATE: y(2) ≈ 7.125.',
      ],
      answer: 'y(2) ≈ 7.125', estimatedMinutes: 5 },
    { id: 'try-euler', kind: 'try_yourself', problem: 'Use Euler\'s method with h = 0.5 to approximate y(1) given dy/dx = x − y, y(0) = 0.',
      expectedAnswer: 'n = 2 steps. Step 0: x = 0, y = 0. Step 1: slope = 0 − 0 = 0. y_1 = 0 + 0.5·0 = 0. x_1 = 0.5. Step 2: slope = 0.5 − 0 = 0.5. y_2 = 0 + 0.5·0.5 = 0.25. x_2 = 1. y(1) ≈ 0.25.',
      responseFormat: 'numeric', hints: ['Iterate y_{n+1} = y_n + h·f(x_n, y_n).'], estimatedMinutes: 4 },
    { id: 'try-accuracy', kind: 'try_yourself', problem: 'AP-style synthesis. For dy/dx = y, y(0) = 1, the EXACT solution is y = e^x. Euler\'s method with h = 0.5 gives y(1) ≈ 2.25. Is this an UNDERESTIMATE or OVERESTIMATE? Explain why.',
      expectedAnswer: 'The exact value: y(1) = e^1 = e ≈ 2.718. Euler\'s estimate: 2.25. UNDERESTIMATE. Why? The DE dy/dx = y with y > 0 implies y is INCREASING; the second derivative y\'\' = (dy/dx)\' = y\' = y > 0 → CONCAVE UP. For a concave-up function, the tangent line lies BELOW the curve, so the tangent-line stepping of Euler\'s method UNDERESTIMATES. Strong answers: identify concavity from y\'\' = y > 0; tangent below curve; so Euler underestimates.', responseFormat: 'frq', hints: ['Compare to exact e^1. Concave up: tangent below curve.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Euler: y_{n+1} = y_n + h · f(x_n, y_n).',
      'Smaller h → more accurate (but more steps).',
      'Concave up: Euler underestimates. Concave down: overestimates.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.5', cedTitle: 'Euler\'s Method (BC)', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '6', note: 'Standard Euler\'s method.' }] },
};
