/**
 * AP Calculus BC — CED Unit 1.11 + 1.12: Defining Continuity at a Point
 * + Confirming Continuity over an Interval. Combined.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_CONTINUITY: LessonPlan = {
  id: 'evelyn.ap.calcbc.continuity.v1',
  title: 'U1.11 Defining Continuity at a Point and Over an Interval',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.continuity',
      description:
        'State the three-condition definition of continuity at a point, verify continuity at a specific x by checking each condition, and identify continuity over an interval (closed, open) including endpoint considerations.',
      standard: 'AP-CALCBC-1.11-1.12',
    },
  ],
  prerequisites: ['apcalcbc.discontinuity-types'],
  followUps: ['apcalcbc.removing-discontinuities'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame continuity as the "no-surprises" property at a point.',
      script:
        "Continuity at a point is the formal version of \"the function doesn't surprise you here\". The limit equals the function value, no holes, no jumps, no asymptotes. Three conditions check it precisely. Once a function is continuous on an interval, all the powerful theorems of calculus (IVT, Extreme Value, Mean Value) become available.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-continuity',
      kind: 'concept',
      goal: 'Cover the three-condition definition + interval continuity + standard families.',
      keyIdeas: [
        'CONTINUITY AT A POINT — three conditions, ALL must hold for f to be continuous at x = a:',
        '(1) f(a) IS DEFINED (function value exists).',
        '(2) lim_{x→a} f(x) EXISTS (two-sided limit exists as a finite number).',
        '(3) lim_{x→a} f(x) = f(a) (the limit equals the function value).',
        'IF ANY ONE FAILS, the function is DISCONTINUOUS at a. The three corresponding failure types: (1) f(a) undefined → typically removable or infinite. (2) Limit doesn\'t exist → jump or oscillating. (3) Limit exists but ≠ f(a) → removable.',
        'CONTINUITY ON AN INTERVAL. A function is continuous on an OPEN interval (a, b) if it is continuous at EVERY point in (a, b). On a CLOSED interval [a, b]: continuous at every interior point AND right-continuous at the left endpoint (lim_{x→a⁺} f(x) = f(a)) AND left-continuous at the right endpoint (lim_{x→b⁻} f(x) = f(b)).',
        'STANDARD CONTINUOUS FAMILIES — these are continuous wherever they\'re defined: (a) ALL POLYNOMIALS — continuous on all of ℝ. (b) RATIONAL FUNCTIONS — continuous wherever the denominator ≠ 0. (c) sin x, cos x — continuous on all of ℝ. (d) tan x, sec x, csc x, cot x — continuous wherever defined (where denominator ≠ 0). (e) e^x — continuous on all of ℝ. (f) ln x — continuous on (0, ∞). (g) √x — continuous on [0, ∞).',
        'OPERATIONS PRESERVING CONTINUITY. If f and g are continuous at a, then so are: f ± g, f · g, f/g (provided g(a) ≠ 0), and the composition g(f(x)) (continuous at a if f is continuous at a and g is continuous at f(a)).',
        'PIECEWISE FUNCTIONS — check continuity at each "break point" (where the formula changes) by computing one-sided limits AND f at the break, then verifying all three conditions.',
      ],
      vocabulary: [
        { term: 'continuity at a point', definition: 'a function f is continuous at x = a if (1) f(a) is defined, (2) lim_{x→a} f(x) exists, and (3) lim_{x→a} f(x) = f(a).' },
        { term: 'continuity on an interval', definition: 'continuity at every point in the interval; closed intervals require one-sided continuity at endpoints.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-piecewise-cont',
      kind: 'worked_example',
      problem:
        'Let f(x) = x + 1 for x < 2; f(x) = c for x = 2; f(x) = 3x − 3 for x > 2. Find the value of c that makes f continuous at x = 2.',
      steps: [
        'STEP 1 — APPLY THE THREE-CONDITION TEST. For continuity at x = 2: f(2) defined (it\'s c), limit exists, limit equals f(2).',
        'STEP 2 — LEFT-SIDED LIMIT. As x → 2⁻, f(x) = x + 1 → 3. lim_{x→2⁻} = 3.',
        'STEP 3 — RIGHT-SIDED LIMIT. As x → 2⁺, f(x) = 3x − 3 → 3. lim_{x→2⁺} = 3.',
        'STEP 4 — TWO-SIDED LIMIT. Both one-sided = 3 → lim_{x→2} f(x) = 3.',
        'STEP 5 — CONTINUITY CONDITION 3. Need f(2) = lim. So c = 3.',
        'STEP 6 — VERIFY. With c = 3: f(2) = 3, lim = 3, agree. ✓ All three conditions hold; f is continuous at x = 2.',
      ],
      answer: 'c = 3',
      estimatedMinutes: 4,
    },
    {
      id: 'try-three-conditions',
      kind: 'try_yourself',
      problem:
        'Determine whether each function is continuous at the given point by checking all three conditions. (a) f(x) = (x² − 9)/(x − 3) at x = 3. (b) g(x) = x² + 1 at x = 5. (c) h(x) = sin(x)/x at x = 0 (with h(0) = 1).',
      expectedAnswer:
        '(a) f(3): denominator = 0, so f(3) is UNDEFINED. Condition (1) fails → discontinuous. (Removable, since lim = 6 exists; we\'d need f(3) = 6 for continuity.) (b) f(5) = 26 (defined). lim_{x→5} (x² + 1) = 26 (continuous polynomial). 26 = 26 ✓. CONTINUOUS at x = 5. (c) h(0) = 1 by definition (defined). lim_{x→0} sin(x)/x = 1 (special trig limit). 1 = 1 ✓. CONTINUOUS at x = 0. (Note: this is the canonical example of redefining a function to remove a removable discontinuity.)',
      responseFormat: 'free',
      hints: [
        'Three conditions: defined, limit exists, equal.',
        'Check each in order; first failure ends the analysis.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-pwise-find-c',
      kind: 'try_yourself',
      problem:
        'Let f(x) = 2x + a for x < 1; f(x) = a · x² for x ≥ 1. Find the value of a that makes f continuous at x = 1.',
      expectedAnswer:
        'For continuity at x = 1: lim_{x→1⁻} f = lim_{x→1⁺} f = f(1). Left limit: 2(1) + a = 2 + a. Right limit: a · (1)² = a. f(1) = a (using the x ≥ 1 branch). Continuity requires 2 + a = a. But 2 + a = a → 2 = 0, which is FALSE. So NO value of a makes f continuous at x = 1. The function has a forced discontinuity here regardless of a.',
      responseFormat: 'free',
      hints: [
        'Compute both one-sided limits; set equal.',
        'If the algebra yields a contradiction, no value works.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-interval-continuous',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Determine the largest interval on which each function is continuous. (a) f(x) = (x² − 4)/(x − 2). (b) g(x) = √(x − 5). (c) h(x) = ln(2x − 6). (d) p(x) = tan(x).',
      expectedAnswer:
        '(a) Continuous wherever defined; defined except at x = 2 (denominator zero). Largest continuous interval: (-∞, 2) ∪ (2, ∞). (b) √(x − 5) needs x − 5 ≥ 0 → x ≥ 5. Continuous on [5, ∞). (At x = 5, right-continuous: lim_{x→5⁺} √(x−5) = 0 = √0 = h(5). ✓) (c) ln(2x − 6) needs 2x − 6 > 0 → x > 3. Continuous on (3, ∞). (d) tan(x) = sin(x)/cos(x); discontinuous wherever cos(x) = 0, i.e., at x = π/2 + nπ for integer n. Continuous on each interval (π/2 + nπ, π/2 + (n+1)π) but not on a single connected interval covering all of ℝ.',
      responseFormat: 'free',
      hints: [
        'Continuity domain = where the function is defined (for standard families).',
        'Watch for endpoint vs interior considerations on closed intervals.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Continuity at a: (1) f(a) defined, (2) limit exists, (3) limit = f(a). All three.',
        'Discontinuity = at least one condition fails.',
        'Polynomials, sin/cos, e^x: continuous everywhere. Rationals, tan/sec/csc/cot: where denominator ≠ 0.',
        'Endpoint continuity on [a, b] requires one-sided continuity matching the function value.',
        'For piecewise functions, test continuity at each break by computing both one-sided limits + the function value.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.11-1.12',
    cedTitle: 'Defining Continuity at a Point and Over an Interval',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard three-condition continuity definition.' },
    ],
  },
};
