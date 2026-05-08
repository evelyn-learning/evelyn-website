/**
 * AP Calculus BC — Unit 1 FRQ Practice.
 *
 * Three multi-part FRQs covering limits via algebra + table reading,
 * continuity-with-parameter, and IVT root proof. Modeled on past
 * AP Calc BC Unit-1 patterns; verbatim swap-in queued.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u1-frq-practice.v1',
  title: 'U1 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.u1-frq-practice',
      description:
        'Apply Unit 1 concepts (limits via algebraic manipulation, continuity at a point with parameter, IVT root-existence) to multi-part free-response problems with AP-style rubric scoring.',
      standard: 'AP-CALCBC-1-FRQ',
    },
  ],
  prerequisites: [
    'apcalcbc.limits-algebraic-manipulation',
    'apcalcbc.continuity',
    'apcalcbc.intermediate-value-theorem',
  ],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Unit 1 FRQs as the "build the foundation" exam practice.',
      script:
        "Unit 1 FRQs test foundational skills — every later unit depends on you being fast and accurate at limits, continuity, and IVT. Three problems incoming, scored on rubric: every algebraic step, every justification, every continuity-condition check.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Refresher on Unit 1 FRQ scoring conventions.',
      keyIdeas: [
        'LIMITS rubric: state the technique (factor / conjugate / etc.), execute step-by-step, simplify, apply direct substitution at the end. Skipping algebra steps loses points.',
        'CONTINUITY rubric: explicitly state all THREE conditions (defined, limit exists, limit = value). Verify each in turn — even when "obviously continuous", AP wants the explicit checks.',
        'IVT rubric: (1) state continuity (and justify — "polynomial is continuous on ℝ"), (2) compute endpoint values, (3) identify opposite signs (or N between values), (4) state IVT conclusion explicitly.',
        'COMMON POINT-LOSERS: skipping the substitute-then-fail diagnosis (going straight to a technique without showing direct sub gives 0/0); forgetting to state continuity before IVT; concluding c is unique or has a specific value when IVT only gives existence.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-frq-limits',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 1 — Limits via Algebraic Manipulation. Compute each limit. For each, state the technique used, show all steps, and verify the answer with direct substitution at the end where applicable. (a) lim_{x→3} (x² − 9)/(x − 3). (b) lim_{x→0} (√(x + 16) − 4)/x. (c) lim_{x→0} sin(7x)/(3x). (d) lim_{x→2} (1/x − 1/2)/(x − 2).",
      expectedAnswer:
        '(a) Direct sub: 0/0. Polynomial → factor. (x − 3)(x + 3)/(x − 3) = x + 3 (for x ≠ 3). lim = 3 + 3 = 6. (1.5 points)\n(b) Direct sub: (4 − 4)/0 = 0/0. Square root → conjugate. Multiply num and denom by (√(x + 16) + 4): numerator becomes (x + 16) − 16 = x. Whole expression = x/(x · (√(x+16) + 4)) = 1/(√(x+16) + 4). lim x → 0: 1/(√16 + 4) = 1/8. (2 points)\n(c) Direct sub: 0/0. Sin in numerator → trig identity. Rewrite sin(7x)/(3x) = (7/3) · sin(7x)/(7x). lim sin(7x)/(7x) = 1. So limit = 7/3. (1.5 points)\n(d) Direct sub: (1/2 − 1/2)/0 = 0/0. Complex fraction → common denominator. Numerator: 1/x − 1/2 = (2 − x)/(2x). Whole expression: (2 − x)/(2x · (x − 2)) = -(x − 2)/(2x(x − 2)) = -1/(2x). lim x → 2: -1/4. (2 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'Try direct sub first; if 0/0, identify the form.',
        'Polynomial 0/0 → factor; radical → conjugate; sin → trig identity; complex frac → common denom.',
      ],
      estimatedMinutes: 9,
    },
    {
      id: 'try-frq-continuity',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 2 — Continuity with Parameters. The piecewise function f is defined as: f(x) = x² − 1 for x < 1; f(x) = a · x + b for 1 ≤ x ≤ 3; f(x) = 2x + c for x > 3. (a) State the THREE conditions for continuity at a point. (b) For f to be continuous at x = 1, find a relationship between a and b. (c) For f to be continuous at x = 3, find a relationship between a, b, and c. (d) If a = 2, find specific values of b and c that make f continuous on all of ℝ.",
      expectedAnswer:
        '(a) Three conditions for continuity at x = c: (i) f(c) is defined, (ii) lim_{x→c} f(x) exists (both one-sided limits exist and are equal), (iii) lim_{x→c} f(x) = f(c). (1.5 points)\n(b) At x = 1. Left limit: lim_{x→1⁻} f(x) = (1)² − 1 = 0. Right limit: lim_{x→1⁺} f(x) = a(1) + b = a + b. f(1) = a + b (from middle branch since 1 is in [1, 3]). Continuity at x = 1 requires both one-sided limits = f(1): 0 = a + b. So a + b = 0, or equivalently b = -a. (2 points)\n(c) At x = 3. Left limit: lim_{x→3⁻} f(x) = 3a + b (from middle branch). f(3) = 3a + b. Right limit: lim_{x→3⁺} f(x) = 2(3) + c = 6 + c. Continuity at x = 3 requires 3a + b = 6 + c. (1.5 points)\n(d) With a = 2: from (b), b = -a = -2. From (c), 3(2) + (-2) = 6 + c → 6 − 2 = 6 + c → 4 = 6 + c → c = -2. Specific values: a = 2, b = -2, c = -2. Verify: at x = 1, left = 0 and right = 2(1) − 2 = 0 ✓. At x = 3, left = 2(3) − 2 = 4 and right = 2(3) + (-2) = 4 ✓. Continuous on ℝ. (2 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'State three conditions explicitly.',
        'For each break point, set both one-sided limits = f at the break.',
        'Solve the resulting system for the parameters.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-ivt',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 3 — IVT Root Proof. (a) State the Intermediate Value Theorem precisely, including all hypotheses and the conclusion. (b) Use IVT to prove that f(x) = x⁴ − 3x − 1 has a root in the interval (1, 2). Show all steps. (c) Briefly explain why the IVT conclusion does NOT tell you (i) the exact value of the root, or (ii) whether the root is unique.",
      expectedAnswer:
        '(a) IVT: If f is continuous on the closed interval [a, b] and N is any value between f(a) and f(b), then there exists at least one c in the open interval (a, b) such that f(c) = N. (2 points: 1 for hypothesis, 1 for conclusion phrased correctly)\n(b) STEP 1 — Continuity: f(x) = x⁴ − 3x − 1 is a polynomial, continuous on all of ℝ, hence continuous on [1, 2]. ✓\nSTEP 2 — Endpoint values: f(1) = 1 − 3 − 1 = -3 (negative). f(2) = 16 − 6 − 1 = 9 (positive).\nSTEP 3 — Identify N = 0 between f(1) = -3 and f(2) = 9. Yes, 0 is between -3 and 9.\nSTEP 4 — Apply IVT: since f is continuous on [1, 2] and 0 lies between f(1) and f(2), by IVT there exists c ∈ (1, 2) such that f(c) = 0. Therefore f has at least one root in (1, 2). (3 points: 1 for continuity check, 1 for endpoint evaluations, 1 for IVT conclusion)\n(c) (i) IVT proves EXISTENCE of c but not its value — to find c we\'d need numerical methods or further analysis. (ii) IVT proves AT LEAST ONE root exists, not exactly one — there could be 1, 3, or any odd number of roots in (1, 2) consistent with f(1) < 0 and f(2) > 0. To show UNIQUENESS, we\'d need additional reasoning (e.g., proving f is monotonic via derivative). (2 points: 1 each for "no value" and "no uniqueness")\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'State IVT hypothesis: continuous on [a, b], N between f(a) and f(b).',
        'For (b), check continuity, evaluate at endpoints, identify opposite signs.',
        'For (c), what does "exists" mean? Doesn\'t mean "unique" or "value known".',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Limits: state technique → execute → substitute. Show every step.',
        'Continuity: name all 3 conditions (defined, limit exists, equal). Verify each.',
        'IVT: continuity + N between endpoint values → ∃ c. Prove exists, not value or uniqueness.',
        'Always start with direct substitution and DIAGNOSE the form before reaching for a technique.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ',
    cedTitle: 'Unit 1 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Three multi-part problems modeled on past AP Calc BC Unit-1 patterns.' },
    ],
  },
};
