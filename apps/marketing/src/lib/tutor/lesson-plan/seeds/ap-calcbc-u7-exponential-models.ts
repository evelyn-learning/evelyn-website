/**
 * AP Calculus BC — CED Unit 7.8: Exponential Models with DEs.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_EXPONENTIAL_MODELS: LessonPlan = {
  id: 'evelyn.ap.calcbc.exponential-models.v1', title: 'U7.8 Exponential Models',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.exponential-models', description: 'Recognize and solve exponential growth/decay differential equations dy/dt = ky. Apply to half-life, doubling time, Newton\'s law of cooling, and continuous compound interest.', standard: 'AP-CALCBC-7.8' }],
  prerequisites: ['apcalcbc.separation-of-variables'], followUps: ['apcalcbc.logistic-models'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame exponential models as the most common real-world DE.', script: "Population growth, radioactive decay, compound interest, Newton's cooling — all governed by dy/dt = ky. Solving gives y = y_0 · e^(kt). One model, many applications.", estimatedMinutes: 2 },
    { id: 'concept-exponential', kind: 'concept', goal: 'Cover the model + half-life/doubling-time + Newton\'s cooling.',
      keyIdeas: [
        'EXPONENTIAL MODEL: dy/dt = ky.',
        'k > 0: GROWTH. k < 0: DECAY.',
        'Solution (separation): y = y_0 · e^(kt), where y_0 = initial value at t = 0.',
        'DOUBLING TIME (for growth, k > 0): time T such that y(T) = 2 y_0. Solving: 2 = e^(kT) → T = ln(2)/k.',
        'HALF-LIFE (for decay, k < 0): time T such that y(T) = y_0/2. T = ln(2)/|k| = -ln(2)/k.',
        'NEWTON\'S LAW OF COOLING: dT/dt = -k(T − T_amb). Object\'s temperature minus ambient. Solution: T(t) = T_amb + (T_0 − T_amb)·e^(-kt). Approaches T_amb as t → ∞.',
        'CONTINUOUS COMPOUND INTEREST: dB/dt = rB. B(t) = B_0 · e^(rt). r = continuous interest rate.',
        'KEY PROPERTY of exponential growth: rate of change is PROPORTIONAL TO CURRENT VALUE. Distinguishing feature.',
      ],
      vocabulary: [
        { term: 'exponential model', definition: 'dy/dt = ky; solution y = y_0 e^(kt).' },
        { term: 'half-life', definition: 'time for an exponentially decaying quantity to reach half of its initial value.' },
        { term: 'doubling time', definition: 'time for an exponentially growing quantity to double.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-decay', kind: 'worked_example', problem: 'A radioactive sample decays at a rate proportional to its mass: dm/dt = -0.05m (mass in grams, t in years). If initial mass is 200 g, (a) find m(t); (b) find the half-life.',
      steps: [
        'STEP 1 — Solution: m(t) = 200 · e^(-0.05t).',
        'STEP 2 — Half-life: m(T) = 100. 100 = 200 e^(-0.05T) → e^(-0.05T) = 0.5 → -0.05T = ln(0.5) = -ln(2). T = ln(2)/0.05 ≈ 13.86 years.',
      ],
      answer: '(a) m(t) = 200 e^(-0.05t). (b) Half-life ≈ 13.86 years.', estimatedMinutes: 4 },
    { id: 'try-doubling', kind: 'try_yourself', problem: 'A population grows at a continuous rate of 4% per year. Find the doubling time.',
      expectedAnswer: 'k = 0.04. Doubling time T = ln(2)/k = ln(2)/0.04 ≈ 17.33 years.',
      responseFormat: 'numeric', hints: ['T = ln(2)/k for exponential growth.'], estimatedMinutes: 2 },
    { id: 'try-cooling', kind: 'try_yourself', problem: 'A cup of coffee at 90°C is left in a 25°C room. After 5 minutes, it has cooled to 70°C. (a) Find the cooling constant k. (b) Find the temperature after 15 minutes.',
      expectedAnswer: '(a) Newton\'s law: T(t) = 25 + (90 − 25)e^(-kt) = 25 + 65 e^(-kt). T(5) = 70: 70 = 25 + 65 e^(-5k) → 45 = 65 e^(-5k) → e^(-5k) = 45/65 ≈ 0.6923 → -5k = ln(0.6923) ≈ -0.3677 → k ≈ 0.0735. (b) T(15) = 25 + 65 e^(-15·0.0735) = 25 + 65 e^(-1.103) ≈ 25 + 65·0.3318 ≈ 25 + 21.57 ≈ 46.57°C.',
      responseFormat: 'numeric', hints: ['Newton\'s law: T(t) = T_amb + (T_0 − T_amb)e^(-kt). Plug values to find k.'], estimatedMinutes: 5 },
    { id: 'try-derive', kind: 'try_yourself', problem: 'AP-style synthesis. (a) Derive the formula for doubling time T = ln(2)/k starting from y(t) = y_0 e^(kt). (b) Why is the doubling time INDEPENDENT of the starting value y_0?',
      expectedAnswer: '(a) y(T) = 2 y_0. y_0 e^(kT) = 2 y_0. Cancel y_0: e^(kT) = 2. Take ln: kT = ln(2). T = ln(2)/k. (b) The y_0 CANCELS OUT in the equation. The doubling time depends only on the GROWTH RATE k, NOT on the initial size. INTUITION: doubling means going from y_0 to 2 y_0 — the RATIO is what matters, not the absolute size. A bacterial colony of 100 doubles in the same time as a colony of 1,000,000 (provided same growth rate).',
      responseFormat: 'frq', hints: ['Set up doubling equation; cancel y_0; solve for T.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'dy/dt = ky → y = y_0 e^(kt).',
      'Doubling time: ln(2)/k. Half-life: ln(2)/|k|.',
      'Newton cooling: T(t) = T_amb + (T_0 − T_amb)e^(-kt).',
      'Doubling time independent of starting value.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.8', cedTitle: 'Exponential Models', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '6', note: 'Standard exponential models.' }] },
};
