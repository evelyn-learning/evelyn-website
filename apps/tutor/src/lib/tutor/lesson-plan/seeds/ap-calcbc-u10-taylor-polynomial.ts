/**
 * AP Calculus BC — CED Unit 10.11+10.12: Taylor Polynomials and Lagrange
 * Error Bound.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_TAYLOR_POLYNOMIAL: LessonPlan = {
  id: 'evelyn.ap.calcbc.taylor-polynomial.v1', title: 'U10.11 Taylor Polynomials and Lagrange Error Bound',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.taylor-polynomial', description: 'Build Taylor polynomial approximations T_n(x) of f about x = c using f(c), f\'(c), ..., f^(n)(c). Apply Lagrange error bound: |R_n(x)| ≤ M·|x − c|^{n+1}/(n+1)! where M bounds |f^{(n+1)}|.', standard: 'AP-CALCBC-10.11-10.12' }],
  prerequisites: ['apcalcbc.ratio-test'], followUps: ['apcalcbc.power-series'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame Taylor polynomials as polynomial approximations.', script: "A Taylor polynomial replaces a complicated function (like sin x or e^x) with a POLYNOMIAL that matches it perfectly at one point in value AND in derivatives. The Lagrange bound tells us how good the approximation is.", estimatedMinutes: 2 },
    { id: 'concept-taylor', kind: 'concept', goal: 'Cover Taylor polynomial + error.',
      keyIdeas: [
        'TAYLOR POLYNOMIAL of f about c, degree n: T_n(x) = Σ_{k=0}^n [f^{(k)}(c)/k!] · (x − c)^k = f(c) + f\'(c)(x−c) + f\'\'(c)(x−c)²/2! + ... + f^{(n)}(c)(x−c)^n/n!',
        'MACLAURIN POLYNOMIAL: Taylor polynomial about c = 0. T_n(x) = f(0) + f\'(0)x + f\'\'(0)x²/2! + ...',
        'PROPERTY: T_n agrees with f and ALL DERIVATIVES through order n at x = c. T_n^{(k)}(c) = f^{(k)}(c) for k = 0, 1, ..., n.',
        'INTERPRETATION: T_1 is the TANGENT LINE at c (linearization). T_2 includes curvature. Higher T_n are more accurate near c.',
        'EXAMPLE — Maclaurin for f(x) = e^x: f(0) = 1. f\'(x) = e^x → f\'(0) = 1. ALL derivatives at 0 equal 1. T_n(x) = 1 + x + x²/2! + x³/3! + ... + x^n/n!.',
        'LAGRANGE ERROR BOUND: |R_n(x)| = |f(x) − T_n(x)| ≤ M · |x − c|^{n+1}/(n+1)! where M = max|f^{(n+1)}(t)| for t between c and x.',
        'STRATEGY for using error bound:',
        '  STEP 1: Find a bound M for |f^{(n+1)}| on the interval between c and x.',
        '  STEP 2: Compute M · |x − c|^{n+1}/(n+1)!.',
        '  STEP 3: That value is the maximum possible error.',
        'EXAMPLE — |e^x − T_3(x)| at x = 0.5, c = 0. f^(4) = e^x. On [0, 0.5], max e^x = e^{0.5} ≈ 1.649 < 2. M = 2. Error ≤ 2 · (0.5)^4/4! = 2 · 0.0625/24 ≈ 0.0052.',
      ],
      vocabulary: [
        { term: 'Taylor polynomial', definition: 'T_n(x) = Σ f^{(k)}(c)(x−c)^k/k!.' },
        { term: 'Lagrange error', definition: 'Bound on |f − T_n| using max of next derivative.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-taylor', kind: 'worked_example', problem: 'Find the third-degree Taylor polynomial T_3(x) for f(x) = ln(x) about x = 1.',
      steps: [
        'STEP 1 — Compute derivatives at x = 1. f(x) = ln x: f(1) = 0. f\'(x) = 1/x: f\'(1) = 1. f\'\'(x) = -1/x²: f\'\'(1) = -1. f\'\'\'(x) = 2/x³: f\'\'\'(1) = 2.',
        'STEP 2 — Plug into Taylor formula. T_3(x) = 0 + 1·(x−1) + (-1)·(x−1)²/2! + 2·(x−1)³/3!.',
        'STEP 3 — Simplify. T_3(x) = (x−1) − (x−1)²/2 + (x−1)³/3.',
      ],
      answer: 'T_3(x) = (x−1) − (x−1)²/2 + (x−1)³/3', estimatedMinutes: 5 },
    { id: 'try-maclaurin', kind: 'try_yourself', problem: 'Find the Maclaurin polynomial T_4(x) for f(x) = sin x.',
      expectedAnswer: 'f(0) = 0. f\'(x) = cos x → f\'(0) = 1. f\'\'(x) = -sin x → f\'\'(0) = 0. f\'\'\'(x) = -cos x → f\'\'\'(0) = -1. f^(4)(x) = sin x → f^(4)(0) = 0. T_4(x) = 0 + 1·x + 0 + (-1)x³/3! + 0 = x − x³/6.',
      responseFormat: 'free', hints: ['Compute derivatives at 0; cycle through sin/cos.'], estimatedMinutes: 4 },
    { id: 'try-error', kind: 'try_yourself', problem: 'Use Lagrange error to bound the error |sin(0.5) − T_3(0.5)| where T_3 is the 3rd-degree Maclaurin polynomial of sin x.',
      expectedAnswer: 'T_3(x) = x − x³/6. f^(4)(x) = sin x. On [0, 0.5], |sin x| ≤ 1. M = 1. Error: |R_3(0.5)| ≤ 1·(0.5)^4/4! = 0.0625/24 ≈ 0.0026. (Actual: sin(0.5) ≈ 0.4794; T_3(0.5) = 0.5 − 0.5³/6 ≈ 0.4792. Error ≈ 0.0002 ≪ 0.0026 ✓ bound is valid.)',
      responseFormat: 'numeric', hints: ['Use M = 1 since |sin x| ≤ 1.'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself', problem: 'AP-style synthesis. (a) Find T_2(x) for f(x) = √x about x = 4. (b) Use T_2 to approximate √4.1.',
      expectedAnswer: '(a) f(4) = 2. f\'(x) = 1/(2√x), f\'(4) = 1/4. f\'\'(x) = -1/(4x^{3/2}), f\'\'(4) = -1/32. T_2(x) = 2 + (1/4)(x−4) + (-1/32)(x−4)²/2 = 2 + (x−4)/4 − (x−4)²/64. \n(b) T_2(4.1) = 2 + 0.1/4 − 0.01/64 = 2 + 0.025 − 0.000156 ≈ 2.0248. (Actual √4.1 ≈ 2.0248 ✓)',
      responseFormat: 'frq', hints: ['Compute derivatives at 4; substitute; plug in 4.1.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'T_n(x) = Σ_{k=0}^n f^{(k)}(c)(x−c)^k/k!.',
      'Maclaurin: Taylor about c = 0.',
      'Lagrange error: |R_n| ≤ M · |x−c|^{n+1}/(n+1)! where M bounds |f^{(n+1)}| on [c, x].',
      'T_1 = tangent line. Higher degrees track curvature.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.11-10.12', cedTitle: 'Taylor Polynomials', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard Taylor + Lagrange.' }] },
};
