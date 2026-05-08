/**
 * AP Calculus BC — CED Unit 5.6+5.7: Concavity + Second Derivative Test
 * (combined).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_CONCAVITY_SECOND_DERIVATIVE: LessonPlan = {
  id: 'evelyn.ap.calcbc.concavity-second-derivative.v1',
  title: 'U5.6 Concavity and the Second Derivative Test',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.concavity-second-derivative',
      description:
        'Use the sign of f\'\'(x) to determine concavity (up vs down) and identify inflection points. Apply the Second Derivative Test to classify local extrema.',
      standard: 'AP-CALCBC-5.6-5.7',
    },
  ],
  prerequisites: ['apcalcbc.first-derivative-analysis'],
  followUps: ['apcalcbc.graphing-f-fp-fpp'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook', kind: 'hook',
      goal: 'Frame the second derivative as the curvature signal.',
      script: "f' tells you up or down. f'' tells you BENT UP or BENT DOWN — the curvature. Together they reveal everything about a function's shape: where it climbs, where it bends, where it peaks.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-concavity', kind: 'concept',
      goal: 'Cover concavity, inflection points, second derivative test.',
      keyIdeas: [
        'CONCAVITY: f is CONCAVE UP on an interval ⟺ f\'\'(x) > 0 there. CONCAVE DOWN ⟺ f\'\'(x) < 0 there.',
        'GEOMETRIC: concave up = tangent lines lie BELOW curve, curve "smiles" (cup shape). Concave down = tangent lines ABOVE curve, "frowns" (cap shape).',
        'INFLECTION POINT: x = c where f changes concavity (f\'\' changes sign). Requires (1) f\'\'(c) = 0 OR f\'\'(c) DNE, AND (2) f\'\' actually changes sign at c. Not every f\'\' = 0 point is an inflection point.',
        'EXAMPLE: f(x) = x⁴ has f\'\'(x) = 12x², which is 0 at x = 0 but never negative. NO sign change → NOT an inflection point.',
        'SECOND DERIVATIVE TEST for local extrema: at a critical point c (where f\'(c) = 0):',
        '- If f\'\'(c) > 0 → concave up at c → LOCAL MIN.',
        '- If f\'\'(c) < 0 → concave down at c → LOCAL MAX.',
        '- If f\'\'(c) = 0 → INCONCLUSIVE; use first derivative test instead.',
        'WHEN TO USE — second derivative test is FASTER than first derivative test when f\'\' is easy to evaluate. But the first derivative test ALWAYS WORKS and may be needed when second derivative test is inconclusive.',
        'CONCAVITY AND f\': f\' is INCREASING ⟺ f\'\' > 0 ⟺ f concave up. So concavity describes how f\'s SLOPE is changing.',
      ],
      vocabulary: [
        { term: 'concave up', definition: 'f\'\' > 0; tangent below curve; "smile".' },
        { term: 'concave down', definition: 'f\'\' < 0; tangent above curve; "frown".' },
        { term: 'inflection point', definition: 'x where f changes concavity (f\'\' changes sign).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-second-derivative', kind: 'worked_example',
      problem: 'Analyze f(x) = x³ − 3x² + 4. Find concavity intervals, inflection points, and use second derivative test on critical points.',
      steps: [
        'STEP 1 — f\'(x) = 3x² − 6x = 3x(x − 2). Critical points: x = 0 and x = 2.',
        'STEP 2 — f\'\'(x) = 6x − 6 = 6(x − 1).',
        'STEP 3 — CONCAVITY. f\'\' < 0 for x < 1: concave DOWN on (-∞, 1). f\'\' > 0 for x > 1: concave UP on (1, ∞). f\'\' changes sign at x = 1 → INFLECTION POINT at x = 1. f(1) = 1 − 3 + 4 = 2.',
        'STEP 4 — SECOND DERIVATIVE TEST on critical points. f\'\'(0) = -6 < 0 → LOCAL MAX at x = 0; f(0) = 4. f\'\'(2) = 6 > 0 → LOCAL MIN at x = 2; f(2) = 8 − 12 + 4 = 0.',
      ],
      answer: 'Concave up (1, ∞), concave down (-∞, 1). Inflection point (1, 2). Local max (0, 4). Local min (2, 0).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-second-deriv-test', kind: 'try_yourself',
      problem: 'For f(x) = -x³ + 12x − 1: (a) find critical points; (b) classify each via second derivative test; (c) find inflection points.',
      expectedAnswer: '(a) f\'(x) = -3x² + 12 = -3(x² − 4) = -3(x − 2)(x + 2). Critical: x = ±2. (b) f\'\'(x) = -6x. f\'\'(2) = -12 < 0 → local MAX at x = 2; f(2) = -8 + 24 − 1 = 15. f\'\'(-2) = 12 > 0 → local MIN at x = -2; f(-2) = 8 − 24 − 1 = -17. (c) f\'\'(x) = -6x = 0 at x = 0; sign changes at 0 (positive for x < 0, negative for x > 0). Inflection point at x = 0; f(0) = -1.',
      responseFormat: 'numeric',
      hints: ['Critical points from f\'; classify via f\'\' sign at each. Inflection: f\'\' changes sign.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-not-inflection', kind: 'try_yourself',
      problem: 'AP-style synthesis. Show that f(x) = x⁴ has f\'\'(0) = 0 but x = 0 is NOT an inflection point. Explain why.',
      expectedAnswer: 'f(x) = x⁴. f\'(x) = 4x³. f\'\'(x) = 12x². At x = 0: f\'\'(0) = 0. But f\'\'(x) = 12x² ≥ 0 for ALL x — never negative. Sign of f\'\' does NOT change at x = 0 (positive on both sides, zero only at x = 0). So x = 0 is NOT an inflection point. f is concave up everywhere (with a "flat spot" at x = 0 where the second derivative happens to vanish). LESSON: f\'\'(c) = 0 is NECESSARY but NOT SUFFICIENT for an inflection point. The sign change is what defines the inflection.',
      responseFormat: 'frq',
      hints: ['Check sign of f\'\' on both sides of x = 0. Inflection requires sign change.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap', kind: 'recap',
      mustRemember: [
        'Concave up ⟺ f\'\' > 0; concave down ⟺ f\'\' < 0.',
        'Inflection point: f\'\' changes sign (necessary AND sufficient).',
        '2nd Deriv Test: f\'(c) = 0 + f\'\'(c) > 0 → local MIN; f\'\'(c) < 0 → local MAX; f\'\'(c) = 0 → inconclusive.',
        'f\'\' = 0 alone does NOT guarantee inflection (e.g., x⁴ at 0).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5', cedTopic: '5.6-5.7', cedTitle: 'Concavity and Second Derivative Test',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard concavity treatment.' }],
  },
};
