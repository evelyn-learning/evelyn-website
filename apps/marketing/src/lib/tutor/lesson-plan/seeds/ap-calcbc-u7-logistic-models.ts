/**
 * AP Calculus BC — CED Unit 7.9: Logistic Models (BC only).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U7_LOGISTIC_MODELS: LessonPlan = {
  id: 'evelyn.ap.calcbc.logistic-models.v1', title: 'U7.9 Logistic Models',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.logistic-models', description: 'Recognize the logistic differential equation dP/dt = kP(M − P) (or = kP(1 − P/M)), identify carrying capacity M and inflection point at P = M/2, and use the logistic-curve characteristics in problem solving.', standard: 'AP-CALCBC-7.9' }],
  prerequisites: ['apcalcbc.exponential-models'], followUps: [], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame logistic as bounded growth.', script: "Exponential growth assumes UNLIMITED resources. Real populations have CARRYING CAPACITY — a max sustainable size. The LOGISTIC MODEL captures this: rapid growth at first, slowing as the population approaches the limit. AP Calc BC tests its key features.", estimatedMinutes: 2 },
    { id: 'concept-logistic', kind: 'concept', goal: 'Cover logistic DE features without solving the full DE.',
      keyIdeas: [
        'LOGISTIC DE: dP/dt = kP(M − P) where M is the CARRYING CAPACITY.',
        'Equivalent form: dP/dt = kP(1 − P/M) = kP·(1 − P/M). The "(1 − P/M)" factor decreases as P approaches M, slowing growth.',
        'EQUILIBRIUM solutions: P = 0 (trivial) and P = M (carrying capacity).',
        'BEHAVIOR: when P is small (P << M), dP/dt ≈ kPM (exponential-like growth). When P is near M, dP/dt → 0 (slows down). When P > M, dP/dt < 0 (population decreases back toward M).',
        'INFLECTION POINT at P = M/2. Compute: d²P/dt² = 0 when P = M/2. This is the INFLECTION POINT — the population grows fastest exactly at half the carrying capacity. Before P = M/2, growth is ACCELERATING (concave up). After, growth DECELERATES (concave down).',
        'MAXIMUM RATE OF CHANGE occurs at P = M/2: dP/dt|_{P=M/2} = k·(M/2)·(M/2) = kM²/4.',
        'GENERAL SOLUTION (sometimes given on AP problems but rarely required to derive): P(t) = M / (1 + A·e^(-kMt)) where A = (M − P_0)/P_0.',
        'CHARACTERISTIC S-SHAPED CURVE: starts low, accelerates upward through P = M/2 (inflection), then asymptotically approaches M from below.',
      ],
      vocabulary: [
        { term: 'carrying capacity', definition: 'the maximum sustainable population M; in logistic model, the upper asymptote.' },
        { term: 'logistic equation', definition: 'dP/dt = kP(M − P).' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-logistic', kind: 'worked_example', problem: 'A population grows logistically with dP/dt = 0.02P(500 − P), and P(0) = 50. (a) Identify the carrying capacity. (b) When is the population growing fastest? (c) What is the maximum rate of change?',
      steps: [
        'STEP 1 — CARRYING CAPACITY: M = 500.',
        'STEP 2 — FASTEST GROWTH at P = M/2 = 250 (inflection point).',
        'STEP 3 — MAXIMUM dP/dt = kM²/4 = 0.02·(500)²/4 = 0.02·250000/4 = 1250 individuals per unit time.',
      ],
      answer: '(a) M = 500. (b) When P = 250. (c) Max rate = 1250.', estimatedMinutes: 4 },
    { id: 'try-logistic', kind: 'try_yourself', problem: 'For dP/dt = 0.05P(1 − P/200), find (a) carrying capacity; (b) inflection point P-value; (c) initial growth rate when P = 10.',
      expectedAnswer: '(a) M = 200. (b) Inflection at P = 100. (c) When P = 10: dP/dt = 0.05·10·(1 − 10/200) = 0.5·(0.95) = 0.475.',
      responseFormat: 'numeric', hints: ['Match form: kP(1 − P/M). M is the denominator.'], estimatedMinutes: 3 },
    { id: 'try-comparison', kind: 'try_yourself', problem: 'AP-style synthesis. Compare exponential model (dP/dt = kP) and logistic model (dP/dt = kP(1 − P/M)) for a population. (a) When are the two models nearly identical? (b) When do they DIVERGE? (c) Which is more realistic for a bacterial colony in a petri dish?',
      expectedAnswer: '(a) When P is SMALL relative to M (P << M), the factor (1 − P/M) ≈ 1, so logistic ≈ exponential. Early growth is essentially exponential. (b) When P approaches M, the (1 − P/M) factor approaches 0, slowing logistic growth. Exponential keeps growing without bound. The two diverge dramatically as P → M. (c) LOGISTIC is more realistic for a bacterial colony in a petri dish: limited nutrients, space, waste accumulation — the colony has a CARRYING CAPACITY. Pure exponential would predict infinite bacteria, which physically can\'t happen. (Note: in unlimited environments — early stages of any colony — exponential is a fine approximation.) Strong answers: identify the regime (small P) where they agree, the regime (P near M) where they diverge, and the realism of logistic for bounded environments.',
      responseFormat: 'frq', hints: ['Compare for small P vs P near M. Real-world bounded vs unbounded.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Logistic: dP/dt = kP(M − P).',
      'Carrying capacity = M (equilibrium).',
      'Inflection at P = M/2 (maximum growth rate).',
      'Solution is S-shaped curve approaching M from below.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7.9', cedTitle: 'Logistic Models (BC)', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '6', note: 'Standard logistic.' }] },
};
