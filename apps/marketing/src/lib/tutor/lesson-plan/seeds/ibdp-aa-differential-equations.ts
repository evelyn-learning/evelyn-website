/**
 * IB DP Math AA — Differential Equations.
 * Separation of variables, exponential growth/decay, simple modelling.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_DIFFERENTIAL_EQUATIONS: LessonPlan = {
  id: 'evelyn.ibdp.aa.differential-equations.v1',
  title: 'IB DP Math AA — Differential Equations',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.differential-equations',
      description: 'Solve first-order separable differential equations; apply to exponential growth, decay, and Newton\'s law of cooling.',
      standard: 'IB-DP-MATH-AA-5.10',
    },
  ],
  prerequisites: ['ibdp.aa.integration'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Differential equations model real-world rates of change — population growth, drug clearance, cooling, radioactive decay.',
      script: 'When the rate of change of something depends on the current value (rate proportional to amount), you get an exponential. When rate depends on the difference from an equilibrium (Newton\'s law of cooling), you get exponential approach to that equilibrium. Both fall out of separation of variables.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-separable',
      kind: 'concept',
      goal: 'Separation of variables algorithm + exponential growth/decay templates + Newton cooling.',
      keyIdeas: [
        'SEPARABLE FORM: dy/dx = f(x)·g(y). Divide both sides by g(y) and multiply by dx: (1/g(y)) dy = f(x) dx. Integrate both sides.',
        'INITIAL CONDITION: an equation alone has infinitely many solutions (one per constant of integration). An initial condition (e.g. y(0) = 5) pins down one specific solution.',
        'EXPONENTIAL GROWTH/DECAY: dy/dt = k·y has solution y = y₀·e^(kt). k > 0: growth. k < 0: decay. y₀ is initial value.',
        'NEWTON\'S LAW OF COOLING: dT/dt = −k·(T − T_env), where T_env is ambient temperature. Solution: T = T_env + (T₀ − T_env)·e^(−kt).',
        'HALF-LIFE: time for y to halve in exponential decay. From e^(kt) = 1/2 → t = ln 2 / |k|.',
        'GENERAL SOLUTION vs PARTICULAR SOLUTION: general has +C; particular fixes C using initial condition.',
        'IB AA SCOPE: only first-order separable on the AA syllabus. (HL also covers homogeneous and Euler\'s method.)',
      ],
      vocabulary: [
        { term: 'separable equation', definition: 'a differential equation that can be written as f(x) dx = g(y) dy, integrable directly.' },
        { term: 'half-life', definition: 'the time for an exponentially decaying quantity to fall to half its initial value: t = ln 2 / |k|.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-decay',
      kind: 'worked_example',
      problem: 'A radioactive sample decays at a rate proportional to its mass: dm/dt = −km. Initial mass 100 g. After 5 years, mass is 80 g. Find k and predict mass at 20 years.',
      steps: [
        'Solve the DE: dm/m = −k·dt → ln|m| = −kt + C → m = A·e^(−kt) where A = e^C.',
        'Apply initial condition m(0) = 100: 100 = A·e^0 = A. So m(t) = 100·e^(−kt).',
        'Use t = 5, m = 80: 80 = 100·e^(−5k) → e^(−5k) = 0.8 → −5k = ln 0.8 → k = −(ln 0.8)/5 ≈ 0.0446.',
        'Predict m(20) = 100·e^(−0.0446·20) = 100·e^(−0.892) ≈ 100·0.4096 ≈ 40.96 g.',
        'CHECK proportionality: m at t = 5 is 80% of initial. m at t = 25 should be 0.8⁵ ≈ 0.328 times initial = 32.8. m at t = 20: 0.8⁴ ≈ 0.4096. Match. ✓',
      ],
      answer: 'k ≈ 0.0446 yr⁻¹; m(20) ≈ 41 g',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A population grows according to dP/dt = 0.1·P. Initial P(0) = 200. Find P(10).',
      expectedAnswer: 'P(10) = 200·e^1 ≈ 543.66',
      responseFormat: 'numeric',
      hints: [
        'Solution: P = 200·e^(0.1t).',
        'P(10) = 200·e^(0.1·10) = 200·e^1.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-constant',
      kind: 'misconception_check',
      question: 'A student solves dy/dx = y by writing y = e^x and stops. What\'s missing?',
      commonErrors: [
        {
          answer: 'y = e^x',
          misconception: 'Skipping the constant of integration; producing only ONE specific solution instead of the general family.',
          correctsTo: 'Separation: dy/y = dx → ln|y| = x + C → y = ±e^(x + C) = A·e^x where A is any non-zero constant. The GENERAL solution is y = A·e^x. The student\'s y = e^x is the particular solution corresponding to A = 1 (i.e. y(0) = 1). Always include the constant in general solutions; use initial conditions to fix it.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Separable form: f(x) dx = g(y) dy. Integrate both sides.',
        'dy/dt = ky → y = y₀·e^(kt). Sign of k decides growth/decay.',
        'Newton cooling: T = T_env + (T₀ − T_env)·e^(−kt).',
        'Half-life t = ln 2 / |k|.',
        'Always include +C in general solution; use initial condition to fix it.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A cup of coffee at 90°C is left in a 20°C room. After 5 minutes, it cools to 60°C. Find the temperature after 15 minutes.',
      hint: 'T = 20 + 70·e^(−kt). At t = 5, T = 60: 60 = 20 + 70·e^(−5k) → e^(−5k) = 40/70 = 4/7. After 15 min: T = 20 + 70·e^(−15k) = 20 + 70·(e^(−5k))³ = 20 + 70·(4/7)³ = 20 + 70·(64/343) = 20 + 4480/343 ≈ 20 + 13.06 = 33.06°C.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
