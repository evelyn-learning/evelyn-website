/**
 * AP Calculus BC — CED Unit 7.6+7.7: Separation of Variables (general
 * + particular solutions).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_SEPARATION_OF_VARIABLES: LessonPlan = {
  id: 'evelyn.ap.calcbc.separation-of-variables.v1', title: 'U7.6 Separation of Variables',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.separation-of-variables', description: 'Solve separable differential equations dy/dx = f(x)·g(y) by separating variables and integrating both sides. Find general and particular solutions using initial conditions.', standard: 'AP-CALCBC-7.6-7.7' }],
  prerequisites: ['apcalcbc.eulers-method'], followUps: ['apcalcbc.exponential-models'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame separation as the analytical method for many DEs.', script: "When dy/dx can be written as f(x)·g(y) — x-stuff times y-stuff — you can SEPARATE the variables: dy/g(y) = f(x) dx, integrate both sides, solve for y. The most-tested analytical DE technique on AP Calc BC.", estimatedMinutes: 2 },
    { id: 'concept-separable', kind: 'concept', goal: 'Cover the separation procedure and IC application.',
      keyIdeas: [
        'A DE IS SEPARABLE if it can be written as dy/dx = f(x) · g(y) (functions of x and y multiplied, NOT added).',
        'PROCEDURE: (1) Separate. dy/g(y) = f(x) dx. (2) Integrate both sides: ∫ dy/g(y) = ∫ f(x) dx + C. (3) Solve for y if possible.',
        'EXAMPLE: dy/dx = ky. Separate: dy/y = k dx. Integrate: ln|y| = kx + C. Solve: y = ±e^(kx + C) = A·e^(kx) (where A = ±e^C is a new constant).',
        'EXAMPLE: dy/dx = x/y. Separate: y dy = x dx. Integrate: y²/2 = x²/2 + C. Or y² = x² + C\'. Solutions are hyperbolas (or circles if C\' is negative).',
        'PARTICULAR SOLUTIONS — given an INITIAL CONDITION y(x_0) = y_0, plug in to determine the constant C, then write the specific solution.',
        'EXAMPLE: dy/dx = ky, y(0) = 5. General: y = A·e^(kx). IC: 5 = A·e^0 = A → A = 5. Particular: y = 5·e^(kx).',
        'ALWAYS CHECK SOLUTION by differentiating and substituting back into the original DE.',
        'NON-SEPARABLE EXAMPLE: dy/dx = x + y is NOT separable (x and y are added, not multiplied). Need other techniques (linear DE methods — beyond AP scope).',
      ],
      vocabulary: [
        { term: 'separable DE', definition: 'one that factors as dy/dx = f(x)·g(y).' },
        { term: 'particular solution', definition: 'specific solution determined by an initial condition.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-separate', kind: 'worked_example', problem: 'Solve dy/dx = 2xy with y(0) = 3.',
      steps: [
        'STEP 1 — Separate: dy/y = 2x dx.',
        'STEP 2 — Integrate: ln|y| = x² + C.',
        'STEP 3 — Solve for y: y = ±e^(x² + C) = A·e^(x²).',
        'STEP 4 — IC: y(0) = 3 → A·e^0 = 3 → A = 3.',
        'STEP 5 — Particular: y = 3·e^(x²).',
      ],
      answer: 'y = 3 e^(x²)', estimatedMinutes: 4 },
    { id: 'try-separable', kind: 'try_yourself', problem: 'Solve dy/dx = -2x·y² with y(0) = 1.',
      expectedAnswer: 'Separate: dy/y² = -2x dx. Integrate: -1/y = -x² + C. Solve: y = 1/(x² − C). IC: y(0) = 1 → 1 = 1/(-C) → C = -1. Particular: y = 1/(x² + 1).',
      responseFormat: 'numeric', hints: ['Separate; integrate; isolate y; apply IC.'], estimatedMinutes: 4 },
    { id: 'try-circle', kind: 'try_yourself', problem: 'Solve dy/dx = -x/y with y(0) = 4.',
      expectedAnswer: 'Separate: y dy = -x dx. Integrate: y²/2 = -x²/2 + C. Or y² + x² = 2C. Circle of radius √(2C). IC: y(0) = 4 → 16 + 0 = 2C → C = 8 → 2C = 16. So x² + y² = 16. y = √(16 − x²) (positive root by IC). Solutions are upper semicircle.',
      responseFormat: 'numeric', hints: ['y dy = -x dx; integrate; this gives a circle.'], estimatedMinutes: 4 },
    { id: 'try-non-separable', kind: 'try_yourself', problem: 'AP-style synthesis. Identify whether each DE is separable. (a) dy/dx = x²y. (b) dy/dx = x + y. (c) dy/dx = e^x · cos y. (d) dy/dx = (xy + 1)/x.',
      expectedAnswer: '(a) SEPARABLE. dy/y = x² dx. (b) NOT separable (x and y are added). (c) SEPARABLE: e^x · cos y is x-stuff TIMES y-stuff. dy/cos y = e^x dx. (d) Rewrite: (xy + 1)/x = y + 1/x. So dy/dx = y + 1/x — y and 1/x ADDED, NOT separable. (Linear DE, but not separable.)',
      responseFormat: 'frq', hints: ['Separable means MULTIPLICATION between x-functions and y-functions, not addition.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Separable: dy/dx = f(x)·g(y).',
      'Move all y to left, x to right: dy/g(y) = f(x) dx.',
      'Integrate both sides; solve for y.',
      'Particular solution: apply initial condition to find constant.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.6-7.7', cedTitle: 'Separation of Variables', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '6', note: 'Standard separation.' }] },
};
