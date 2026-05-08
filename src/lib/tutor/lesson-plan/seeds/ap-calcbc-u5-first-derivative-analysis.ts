/**
 * AP Calculus BC — CED Unit 5.3+5.4+5.5: First Derivative Analysis
 * (combined: increasing/decreasing intervals, first derivative test,
 * absolute extrema via candidates test).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_FIRST_DERIVATIVE_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.calcbc.first-derivative-analysis.v1',
  title: 'U5.3 First Derivative Analysis: Increasing/Decreasing and Local Extrema',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.first-derivative-analysis',
      description:
        'Use the sign of f\'(x) to determine intervals where f is increasing or decreasing, apply the First Derivative Test for local extrema, and identify absolute extrema using the Candidates Test on closed intervals.',
      standard: 'AP-CALCBC-5.3-5.5',
    },
  ],
  prerequisites: ['apcalcbc.mvt-evt'],
  followUps: ['apcalcbc.concavity-second-derivative'],
  estimatedMinutes: 26,
  segments: [
    {
      id: 'hook', kind: 'hook',
      goal: 'Frame the connection between f\' sign and f\'s shape.',
      script: "If f\\' > 0, f is climbing. If f\\' < 0, f is descending. The SIGN OF THE DERIVATIVE tells you everything about the function's increasing/decreasing behavior. From there, local maxes and mins are just where f\\' changes sign.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-first-deriv', kind: 'concept',
      goal: 'Cover the increasing/decreasing test, first derivative test for local extrema, and the candidates test.',
      keyIdeas: [
        'INCREASING/DECREASING TEST: f INCREASING on an interval ⟺ f\'(x) > 0 there. f DECREASING ⟺ f\'(x) < 0 there. (Strictly: > 0 or < 0 except possibly at isolated points.)',
        'FINDING INTERVALS: (1) compute f\'(x). (2) find critical points: where f\'(x) = 0 or f\'(x) DNE. (3) test sign of f\' on each interval between critical points. (4) interval where f\' > 0: increasing; where f\' < 0: decreasing.',
        'FIRST DERIVATIVE TEST for LOCAL EXTREMA: at a critical point x = c:',
        '- If f\' changes from POSITIVE to NEGATIVE at c → LOCAL MAX.',
        '- If f\' changes from NEGATIVE to POSITIVE at c → LOCAL MIN.',
        '- If f\' does NOT change sign at c → NOT a local extremum (but possibly an inflection point).',
        'PROCEDURE for finding local extrema: (1) find critical points. (2) examine sign of f\' on each side of each critical point. (3) classify by sign change.',
        'ABSOLUTE EXTREMA on [a, b] (Candidates Test, EVT): (1) find critical points in (a, b). (2) evaluate f at critical points + at endpoints a, b. (3) largest = absolute max; smallest = absolute min.',
        'NOTE: local extrema are about NEIGHBORHOOD behavior; absolute extrema are about a SPECIFIC INTERVAL. They may coincide (a local max may also be the absolute max if it has the highest f-value), but not always.',
        'BEWARE: not every critical point is an extremum. f(x) = x³ at x = 0: f\'(0) = 0 (critical), but f\' = 3x² ≥ 0 everywhere — no sign change. Inflection point, not an extremum.',
      ],
      vocabulary: [
        { term: 'first derivative test', definition: 'classify a critical point as local max, local min, or neither based on sign change of f\' across it.' },
        { term: 'local extremum', definition: 'a point that is the max or min of f on some open interval containing it.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cubic', kind: 'worked_example',
      problem: 'Analyze f(x) = x³ − 6x² + 9x + 1. Find intervals of increase/decrease, local extrema, and absolute extrema on [0, 5].',
      steps: [
        'STEP 1 — f\'(x) = 3x² − 12x + 9 = 3(x² − 4x + 3) = 3(x − 1)(x − 3). Critical points: x = 1, x = 3.',
        'STEP 2 — Sign of f\'. Test in each region: x = 0: 3(−1)(−3) = 9 > 0. x = 2: 3(1)(−1) = −3 < 0. x = 4: 3(3)(1) = 9 > 0.',
        'STEP 3 — INCREASING/DECREASING. f increasing on (-∞, 1) and (3, ∞); decreasing on (1, 3).',
        'STEP 4 — FIRST DERIVATIVE TEST. At x = 1: f\' changes + → -, so LOCAL MAX. At x = 3: f\' changes - → +, so LOCAL MIN. f(1) = 1 − 6 + 9 + 1 = 5; f(3) = 27 − 54 + 27 + 1 = 1.',
        'STEP 5 — CANDIDATES TEST on [0, 5]. Evaluate at critical points (1, 3) and endpoints (0, 5). f(0) = 1; f(1) = 5; f(3) = 1; f(5) = 125 − 150 + 45 + 1 = 21. ABSOLUTE MAX = 21 at x = 5; ABSOLUTE MIN = 1 (tied at x = 0 and x = 3).',
      ],
      answer: 'Increasing on (-∞, 1) ∪ (3, ∞), decreasing on (1, 3). Local max f(1)=5, local min f(3)=1. Absolute max 21 at x=5; absolute min 1 (at x=0 and x=3 on [0,5]).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-analyze', kind: 'try_yourself',
      problem: 'For f(x) = x³ − 12x: (a) intervals of increase/decrease; (b) local extrema.',
      expectedAnswer: 'f\'(x) = 3x² − 12 = 3(x² − 4). Critical points: x = ±2. Sign: x < -2 → +; -2 < x < 2 → -; x > 2 → +. Increasing on (-∞, -2) ∪ (2, ∞); decreasing on (-2, 2). Local max at x = -2 (sign +→-): f(-2) = -8 + 24 = 16. Local min at x = 2 (sign -→+): f(2) = 8 − 24 = -16.',
      responseFormat: 'numeric',
      hints: ['Find critical points; sign-test; apply first derivative test.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-absolute', kind: 'try_yourself',
      problem: 'Find absolute extrema of f(x) = x⁴ − 8x² + 1 on [-3, 2].',
      expectedAnswer: 'f\'(x) = 4x³ − 16x = 4x(x² − 4) = 4x(x − 2)(x + 2). Critical points: x = -2, 0, 2. All in [-3, 2]. Evaluate: f(-3) = 81 − 72 + 1 = 10; f(-2) = 16 − 32 + 1 = -15; f(0) = 1; f(2) = 16 − 32 + 1 = -15. Absolute max: 10 at x = -3. Absolute min: -15 at x = -2 OR x = 2 (tied).',
      responseFormat: 'numeric',
      hints: ['Critical points + endpoints; evaluate; pick min and max.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-not-extremum', kind: 'try_yourself',
      problem: 'AP-style synthesis. f(x) = x³ has f\'(0) = 0 (critical point), but x = 0 is NOT a local extremum. Explain why, and use the first derivative test framework.',
      expectedAnswer: 'f\'(x) = 3x². At x = 0: f\'(0) = 0 (critical). But f\'(x) = 3x² ≥ 0 for ALL x — never negative. Sign of f\' does NOT change at x = 0; it\'s positive on both sides. By first derivative test: NO sign change → NO local extremum. f is INCREASING through x = 0 (with a horizontal tangent at the critical point — an inflection point with horizontal tangent, sometimes called a "saddle point in 1D"). Strong answers cite that critical point ≠ extremum, and the first-derivative-test\'s sign-change requirement.',
      responseFormat: 'frq',
      hints: ['Critical point is NECESSARY for extremum, not SUFFICIENT. Sign change is the test.'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap', kind: 'recap',
      mustRemember: [
        'f increasing ⟺ f\' > 0; f decreasing ⟺ f\' < 0.',
        'Critical points: f\' = 0 or f\' DNE.',
        'First Derivative Test: + → - means local max; - → + means local min; no change means neither.',
        'Candidates Test: critical points + endpoints → pick min and max.',
        'Critical point ≠ extremum. Verify sign change.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5', cedTopic: '5.3-5.5', cedTitle: 'First Derivative Analysis',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard first-derivative analysis.' }],
  },
};
