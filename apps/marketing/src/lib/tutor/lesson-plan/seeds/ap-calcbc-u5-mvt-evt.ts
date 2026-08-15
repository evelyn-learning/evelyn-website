/**
 * AP Calculus BC — CED Unit 5.1+5.2: Mean Value Theorem + Extreme
 * Value Theorem.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_MVT_EVT: LessonPlan = {
  id: 'evelyn.ap.calcbc.mvt-evt.v1',
  title: 'U5.1 Mean Value Theorem and Extreme Value Theorem',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.mvt-evt',
      description:
        'State and apply the Mean Value Theorem (MVT) and the Extreme Value Theorem (EVT). Identify hypotheses for each.',
      standard: 'AP-CALCBC-5.1-5.2',
    },
  ],
  prerequisites: ['apcalcbc.lhopital'],
  followUps: ['apcalcbc.first-derivative-analysis'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook', kind: 'hook',
      goal: 'Frame both theorems as foundational existence theorems.',
      script: "MVT and EVT are workhorses: MVT guarantees a tangent slope equal to the secant slope; EVT guarantees min and max exist. Both have hypotheses you must verify. AP exam testing here is reliable.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mvt-evt', kind: 'concept',
      goal: 'State both theorems and contrast their hypotheses.',
      keyIdeas: [
        'MEAN VALUE THEOREM (MVT): If f is CONTINUOUS on [a, b] AND DIFFERENTIABLE on (a, b), then there exists at least one c in (a, b) such that f\'(c) = (f(b) − f(a))/(b − a). The instantaneous rate at c equals the average rate over [a, b].',
        'GEOMETRIC INTERPRETATION of MVT: there is at least one point in (a, b) where the TANGENT LINE is PARALLEL to the secant line connecting (a, f(a)) and (b, f(b)).',
        'ROLLE\'S THEOREM (special case of MVT when f(a) = f(b)): under same hypotheses + f(a) = f(b), there exists c in (a, b) with f\'(c) = 0.',
        'EXTREME VALUE THEOREM (EVT): If f is CONTINUOUS on a CLOSED interval [a, b], then f has both an ABSOLUTE MAX and ABSOLUTE MIN on [a, b]. Each occurs either at a CRITICAL POINT (where f\' = 0 or f\' DNE) or at an ENDPOINT a or b.',
        'KEY DIFFERENCE in hypotheses: MVT requires continuity on [a, b] AND differentiability on (a, b). EVT only requires continuity on [a, b].',
        'CRITICAL POINT: x = c in the domain where f\'(c) = 0 OR f\'(c) DNE. Locations where local extrema can occur.',
        'CANDIDATES TEST (EVT-based): to find absolute extrema on [a, b]: compute f at all critical points in (a, b) AND at the endpoints. The largest of these values is the absolute max; the smallest is the absolute min.',
      ],
      vocabulary: [
        { term: 'critical point', definition: 'x where f\'(x) = 0 or f\'(x) DNE.' },
        { term: 'MVT', definition: 'continuous on [a,b] + differentiable on (a,b) → ∃ c with f\'(c) = (f(b)−f(a))/(b−a).' },
        { term: 'EVT', definition: 'continuous on [a,b] → f attains absolute max and absolute min on [a,b].' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mvt', kind: 'worked_example',
      problem: 'Verify MVT applies for f(x) = x² on [1, 4] and find a value of c.',
      steps: [
        'STEP 1 — Verify hypotheses. f(x) = x² is a polynomial: continuous on [1, 4] AND differentiable on (1, 4). ✓',
        'STEP 2 — Compute average rate. (f(4) − f(1))/(4 − 1) = (16 − 1)/3 = 5.',
        'STEP 3 — Set f\'(c) = 5. f\'(x) = 2x → 2c = 5 → c = 5/2 = 2.5. Check c ∈ (1, 4): yes. ✓',
        'STEP 4 — MVT confirmed: at x = 2.5, the tangent slope = 5 = secant slope.',
      ],
      answer: 'c = 5/2 = 2.5',
      estimatedMinutes: 4,
    },
    {
      id: 'try-mvt', kind: 'try_yourself',
      problem: 'Find all c values guaranteed by MVT for f(x) = x³ − 3x on [-2, 2].',
      expectedAnswer: 'Continuous + differentiable on (-2, 2) (polynomial). Average rate: (f(2) − f(-2))/4 = (2 − (-2))/4 = 4/4 = 1. f\'(x) = 3x² − 3. Set 3c² − 3 = 1: c² = 4/3, c = ±2/√3 ≈ ±1.155. Both in (-2, 2). ✓',
      responseFormat: 'numeric',
      hints: ['Verify hypotheses; compute secant slope; solve f\'(c) = secant slope.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-evt', kind: 'try_yourself',
      problem: 'Find absolute max and min of f(x) = x³ − 3x on [-2, 3] (Candidates Test).',
      expectedAnswer: 'Continuous polynomial on closed interval — EVT applies. Critical points: f\'(x) = 3x² − 3 = 0 → x² = 1 → x = ±1, both in (-2, 3). Candidates: f(-2) = -8 + 6 = -2; f(-1) = -1 + 3 = 2; f(1) = 1 − 3 = -2; f(3) = 27 − 9 = 18. ABSOLUTE MAX: 18 at x = 3 (endpoint). ABSOLUTE MIN: -2 at x = -2 OR x = 1 (tied; both give -2).',
      responseFormat: 'numeric',
      hints: ['Find critical points where f\' = 0 in (a, b). Evaluate f at those + endpoints. Largest = max, smallest = min.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-applications', kind: 'try_yourself',
      problem: 'AP-style synthesis. (a) State the MVT hypotheses precisely. (b) Give a function and interval where MVT does NOT apply, and explain why. (c) Why is the EVT a different theorem from MVT despite both being existence theorems on intervals?',
      expectedAnswer: '(a) MVT: f continuous on [a, b] AND differentiable on (a, b). (b) f(x) = |x| on [-1, 1]: continuous on [-1, 1] but NOT differentiable at x = 0 (corner). MVT does not apply because f fails differentiability on the open interval. (c) MVT requires BOTH continuity AND differentiability and concludes existence of a specific tangent slope; EVT requires ONLY continuity and concludes existence of absolute max/min. They\'re distinct: MVT is about tangent vs secant; EVT is about overall extremes. Strong answers cite the differentiability difference + the different conclusions.',
      responseFormat: 'frq',
      hints: ['MVT needs differentiable; EVT only continuous. Different conclusions.'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap', kind: 'recap',
      mustRemember: [
        'MVT: continuous [a,b] + diff (a,b) → ∃c with f\'(c) = secant slope.',
        'EVT: continuous [a,b] → absolute max and min exist; check critical points + endpoints.',
        'Critical point: f\'(c) = 0 OR f\'(c) DNE.',
        'Candidates test: evaluate f at all critical points in (a,b) and at endpoints; pick min and max.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5', cedTopic: '5.1-5.2', cedTitle: 'MVT and EVT',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard MVT/EVT.' }],
  },
};
