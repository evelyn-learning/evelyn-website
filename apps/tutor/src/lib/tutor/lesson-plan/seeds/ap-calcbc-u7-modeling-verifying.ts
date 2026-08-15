/**
 * AP Calculus BC — CED Unit 7.1+7.2: Modeling and Verifying Differential
 * Equations.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_MODELING_VERIFYING: LessonPlan = {
  id: 'evelyn.ap.calcbc.modeling-verifying-de.v1', title: 'U7.1 Modeling and Verifying Differential Equations',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.modeling-verifying-de', description: 'Translate verbal rate-of-change descriptions into differential equations; verify a function is a solution to a given differential equation.', standard: 'AP-CALCBC-7.1-7.2' }],
  prerequisites: ['apcalcbc.integration-strategy'], followUps: ['apcalcbc.slope-fields'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame DE as the language of change.', script: "A differential equation is an equation involving a function and its derivatives. Newton's law F = ma is one. Population growth equations are too. They model HOW things change. Today: read English and write down the DE.", estimatedMinutes: 2 },
    { id: 'concept-de', kind: 'concept', goal: 'Cover writing and verifying DEs.', keyIdeas: [
      'A DIFFERENTIAL EQUATION (DE) involves an unknown function y(x) and its derivatives. Example: dy/dx = 2y means "y\'s rate of change is twice its current value".',
      'WRITING A DE FROM A WORD PROBLEM: identify the rate (dy/dt or dy/dx); identify what the rate is proportional to or depends on; express dy/dx = function of x and/or y.',
      'EXAMPLES OF MODELING:',
      '"Population grows at a rate proportional to its size" → dP/dt = kP.',
      '"Newton\'s law of cooling: rate of cooling proportional to temperature difference" → dT/dt = -k(T − T_ambient).',
      '"Logistic growth: rate proportional to current size AND remaining capacity" → dP/dt = kP(M − P).',
      'VERIFYING A SOLUTION: given a candidate function y(x) and a DE, substitute y and y\' into the DE and check that the equation holds.',
      'SOLUTIONS COME IN FAMILIES (general solution) parameterized by integration constants. Specific solutions (particular solution) are picked by initial conditions y(x_0) = y_0.',
    ], estimatedMinutes: 5 },
    { id: 'worked-verify', kind: 'worked_example', problem: 'Verify that y = e^(2x) is a solution to dy/dx = 2y.',
      steps: ['STEP 1 — Compute dy/dx: 2 e^(2x).', 'STEP 2 — Compute 2y: 2 e^(2x).', 'STEP 3 — Compare: dy/dx = 2y. ✓ The equation holds. y = e^(2x) IS a solution.'], answer: 'Verified', estimatedMinutes: 3 },
    { id: 'try-model', kind: 'try_yourself', problem: 'Translate to a DE: "The rate at which water leaks out of a tank is proportional to the square root of the volume in the tank."',
      expectedAnswer: 'V is volume; rate of change dV/dt is proportional to √V (negative because leaking): dV/dt = -k√V (k > 0 constant of proportionality).', responseFormat: 'free', hints: ['Identify rate, identify what it\'s proportional to, include sign.'], estimatedMinutes: 3 },
    { id: 'try-verify', kind: 'try_yourself', problem: 'Verify that y = sin(2x) satisfies y\'\' + 4y = 0.',
      expectedAnswer: 'y\' = 2 cos(2x); y\'\' = -4 sin(2x). Substitute: y\'\' + 4y = -4 sin(2x) + 4 sin(2x) = 0. ✓', responseFormat: 'numeric', hints: ['Compute derivatives; substitute; check.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'DE: equation involving y and y\' (or y\'\').',
      'Write DEs by identifying rate + what it depends on.',
      'Verify: substitute y and its derivatives; check the equation.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.1-7.2', cedTitle: 'Modeling and Verifying DEs', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '6', note: 'Standard DE intro.' }] },
};
