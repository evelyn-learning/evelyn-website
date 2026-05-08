/**
 * AP Calculus BC — Unit 7 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u7-frq-practice.v1', title: 'U7 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u7-frq-practice', description: 'Apply Unit 7 differential-equation techniques.', standard: 'AP-CALCBC-7-FRQ' }],
  prerequisites: ['apcalcbc.logistic-models'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Set Unit 7 stakes.', script: "Unit 7 FRQs test slope fields, separation, Euler's method, and exponential/logistic models. Three problems incoming.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresher.', keyIdeas: [
      'Slope field problems: identify dependence (x-only, y-only, both); match patterns.',
      'Separation: separate, integrate, apply IC to find C.',
      'Euler: y_{n+1} = y_n + h·f(x_n, y_n). Show every step.',
      'Exponential: dy/dt = ky → y = y_0 e^(kt). Doubling = ln2/k.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-separation', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Separation. Solve dy/dx = (x+1)/y, y(0) = 2. Show all steps.',
      expectedAnswer: 'Separate: y dy = (x+1) dx. Integrate: y²/2 = x²/2 + x + C. Or y² = x² + 2x + C\'. IC: y(0) = 2 → 4 = 0 + 0 + C\' → C\' = 4. Particular: y² = x² + 2x + 4. Solving: y = √(x² + 2x + 4) (positive root by IC). (5)',
      responseFormat: 'frq', hints: ['Separate, integrate, IC, solve for y.'], estimatedMinutes: 6 },
    { id: 'try-frq-euler', kind: 'try_yourself',
      problem: "FRQ Practice 2 — Euler's Method. Use Euler's method with h = 0.25 to approximate y(1) given dy/dx = x + 2y, y(0) = 1.",
      expectedAnswer: 'n = 4 steps. \nStep 0: x=0, y=1. \nStep 1: slope = 0 + 2 = 2. y_1 = 1 + 0.25·2 = 1.5. x_1 = 0.25. \nStep 2: slope = 0.25 + 3 = 3.25. y_2 = 1.5 + 0.25·3.25 = 2.3125. x_2 = 0.5. \nStep 3: slope = 0.5 + 4.625 = 5.125. y_3 = 2.3125 + 0.25·5.125 = 3.59375. x_3 = 0.75. \nStep 4: slope = 0.75 + 7.1875 = 7.9375. y_4 = 3.59375 + 0.25·7.9375 = 5.578125. x_4 = 1. \ny(1) ≈ 5.578. (6)',
      responseFormat: 'frq', hints: ['Iterate y_{n+1} = y_n + h·f(x_n, y_n).'], estimatedMinutes: 7 },
    { id: 'try-frq-logistic', kind: 'try_yourself',
      problem: "FRQ Practice 3 — Logistic Model. A population P satisfies dP/dt = 0.1P(100 − P), with P(0) = 10. (a) Identify the carrying capacity. (b) Find dP/dt when P = 30. (c) When does the population grow fastest? (d) What is the maximum growth rate?",
      expectedAnswer: '(a) Carrying capacity: M = 100. (1)\n(b) dP/dt at P = 30: 0.1·30·(100−30) = 0.1·30·70 = 210. (1.5)\n(c) Fastest at P = M/2 = 50. (1)\n(d) Max growth: dP/dt at P = 50 = 0.1·50·50 = 250. (Or kM²/4 = 0.1·10000/4 = 250.) (1.5)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['M from form. Inflection at M/2. Max rate = kM²/4.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Separable: separate, integrate, IC.',
      'Euler: linear stepping with current slope.',
      'Logistic: M, M/2 inflection, kM²/4 max rate.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7-FRQ', cedTitle: 'Unit 7 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-7.' }] },
};
