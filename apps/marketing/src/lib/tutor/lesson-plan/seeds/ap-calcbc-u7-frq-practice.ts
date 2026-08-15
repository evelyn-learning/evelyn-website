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
      expectedAnswer: 'Separate: y dy = (x+1) dx. Integrate: y²/2 = x²/2 + x + C. Or y² = x² + 2x + C\'. IC: y(0) = 2 → 4 = 0 + 0 + C\' → C\' = 4. Particular: y² = x² + 2x + 4. Solving: y = √(x² + 2x + 4) (positive root by IC). (9)',
      rubric: { parts: [
        { criterionId: 'separate', maxPoints: 2, scoringCriteria: 'Correctly separates the variables so that all y-terms are on one side and all x-terms on the other: y dy = (x+1) dx.', modelResponse: 'Separates variables: y dy = (x + 1) dx.' },
        { criterionId: 'integrate', maxPoints: 3, scoringCriteria: 'Finds a correct antiderivative of both sides with a constant of integration: y²/2 = x²/2 + x + C.', modelResponse: 'Antiderivative of both sides: y²/2 = x²/2 + x + C (constant of integration included).' },
        { criterionId: 'ic', maxPoints: 2, scoringCriteria: 'Substitutes the initial condition y(0) = 2 to solve for the constant and states the particular relation: 4/2 = 0 + 0 + C so C = 2, giving y² = x² + 2x + 4.', modelResponse: 'Applies y(0) = 2: 4/2 = 0 + 0 + C, so C = 2, giving y² = x² + 2x + 4.' },
        { criterionId: 'solve', maxPoints: 2, scoringCriteria: 'Solves explicitly for y and selects the positive square root, justified by y(0) = 2 > 0: y = √(x² + 2x + 4).', modelResponse: 'Solve for y and take the positive root since y(0) = 2 > 0: y = √(x² + 2x + 4).' },
      ] },
      modelResponse: 'Separate: y dy = (x + 1) dx. Integrate both sides: y²/2 = x²/2 + x + C. Apply the initial condition y(0) = 2: 4/2 = 0 + 0 + C, so C = 2, giving y² = x² + 2x + 4. Solve explicitly and take the positive root (since y(0) = 2 > 0): y = √(x² + 2x + 4).',
      responseFormat: 'frq', hints: ['Separate, integrate, IC, solve for y.'], estimatedMinutes: 6 },
    { id: 'try-frq-euler', kind: 'try_yourself',
      problem: "FRQ Practice 2 — Euler's Method. Use Euler's method with h = 0.25 to approximate y(1) given dy/dx = x + 2y, y(0) = 1.",
      expectedAnswer: 'n = 4 steps. \nStep 0: x=0, y=1. \nStep 1: slope = 0 + 2 = 2. y_1 = 1 + 0.25·2 = 1.5. x_1 = 0.25. \nStep 2: slope = 0.25 + 3 = 3.25. y_2 = 1.5 + 0.25·3.25 = 2.3125. x_2 = 0.5. \nStep 3: slope = 0.5 + 4.625 = 5.125. y_3 = 2.3125 + 0.25·5.125 = 3.59375. x_3 = 0.75. \nStep 4: slope = 0.75 + 7.1875 = 7.9375. y_4 = 3.59375 + 0.25·7.9375 = 5.578125. x_4 = 1. \ny(1) ≈ 5.578. (9)',
      rubric: { parts: [
        { criterionId: 'setup', maxPoints: 1, scoringCriteria: 'States Euler\'s method y_{n+1} = y_n + h·f(x_n, y_n) with h = 0.25 and recognizes that 4 steps are needed to go from x = 0 to x = 1.', modelResponse: 'Use y_{n+1} = y_n + h·f(x_n, y_n) with h = 0.25; 4 steps are needed to reach x = 1.' },
        { criterionId: 'step1', maxPoints: 2, scoringCriteria: 'Step 1 correct: slope at (0, 1) = 0 + 2(1) = 2, so y_1 = 1 + 0.25(2) = 1.5 at x = 0.25.', modelResponse: 'Step 1: slope = 0 + 2(1) = 2; y_1 = 1 + 0.25(2) = 1.5 at x = 0.25.' },
        { criterionId: 'step2', maxPoints: 2, scoringCriteria: 'Step 2 correct: slope at (0.25, 1.5) = 0.25 + 2(1.5) = 3.25, so y_2 = 1.5 + 0.25(3.25) = 2.3125 at x = 0.5.', modelResponse: 'Step 2: slope = 0.25 + 3 = 3.25; y_2 = 1.5 + 0.25(3.25) = 2.3125 at x = 0.5.' },
        { criterionId: 'step3', maxPoints: 2, scoringCriteria: 'Step 3 correct: slope at (0.5, 2.3125) = 0.5 + 2(2.3125) = 5.125, so y_3 = 2.3125 + 0.25(5.125) = 3.59375 at x = 0.75.', modelResponse: 'Step 3: slope = 0.5 + 4.625 = 5.125; y_3 = 2.3125 + 0.25(5.125) = 3.59375 at x = 0.75.' },
        { criterionId: 'step4', maxPoints: 2, scoringCriteria: 'Step 4 correct and final answer reported: slope at (0.75, 3.59375) = 0.75 + 2(3.59375) = 7.9375, so y_4 = 3.59375 + 0.25(7.9375) = 5.578125, giving y(1) ≈ 5.578.', modelResponse: 'Step 4: slope = 0.75 + 7.1875 = 7.9375; y_4 = 3.59375 + 0.25(7.9375) = 5.578125, so y(1) ≈ 5.578.' },
      ] },
      modelResponse: 'With h = 0.25 (4 steps) and y_{n+1} = y_n + h·f(x_n, y_n): Step 1 slope = 2, y_1 = 1.5 (x = 0.25). Step 2 slope = 3.25, y_2 = 2.3125 (x = 0.5). Step 3 slope = 5.125, y_3 = 3.59375 (x = 0.75). Step 4 slope = 7.9375, y_4 = 5.578125 (x = 1). So y(1) ≈ 5.578.',
      responseFormat: 'frq', hints: ['Iterate y_{n+1} = y_n + h·f(x_n, y_n).'], estimatedMinutes: 7 },
    { id: 'try-frq-logistic', kind: 'try_yourself',
      problem: "FRQ Practice 3 — Logistic Model. A population P satisfies dP/dt = 0.1P(100 − P), with P(0) = 10. (a) Identify the carrying capacity. (b) Find dP/dt when P = 30. (c) When does the population grow fastest? (d) What is the maximum growth rate?",
      expectedAnswer: '(a) Carrying capacity: M = 100. (2)\n(b) dP/dt at P = 30: 0.1·30·(100−30) = 0.1·30·70 = 210. (2)\n(c) Fastest at P = M/2 = 50. (2)\n(d) Max growth: dP/dt at P = 50 = 0.1·50·50 = 250. (Or kM²/4 = 0.1·10000/4 = 250.) (3)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Identifies the carrying capacity M = 100 from the logistic form dP/dt = kP(M − P).', modelResponse: 'The carrying capacity is M = 100 (the value that makes dP/dt = 0 with P > 0).' },
        { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Substitutes P = 30 into dP/dt = 0.1P(100 − P) and evaluates: 0.1·30·70 = 210.', modelResponse: 'dP/dt = 0.1·30·(100 − 30) = 0.1·30·70 = 210.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'States the population grows fastest at the inflection point P = M/2 = 50.', modelResponse: 'Growth is fastest at the inflection value P = M/2 = 50.' },
        { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Computes the maximum growth rate by evaluating dP/dt at P = 50 (or via kM²/4): 0.1·50·50 = 250, with justification tying it to part (c).', modelResponse: 'Maximum growth rate occurs at P = 50: dP/dt = 0.1·50·50 = 250 (equivalently kM²/4 = 0.1·100²/4 = 250).' },
      ] },
      modelResponse: '(a) Carrying capacity M = 100. (b) dP/dt at P = 30 = 0.1·30·70 = 210. (c) Fastest growth at the inflection point P = M/2 = 50. (d) Maximum growth rate at P = 50: 0.1·50·50 = 250 (= kM²/4).',
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
