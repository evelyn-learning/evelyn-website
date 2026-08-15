/**
 * AP Calculus BC — CED Unit 1.16: Working with the Intermediate Value
 * Theorem (IVT).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_IVT: LessonPlan = {
  id: 'evelyn.ap.calcbc.intermediate-value-theorem.v1',
  title: 'U1.16 The Intermediate Value Theorem',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.intermediate-value-theorem',
      description:
        'State the Intermediate Value Theorem (IVT) precisely, identify the hypotheses (continuity on a closed interval), and apply IVT to prove existence of solutions / roots / fixed points.',
      standard: 'AP-CALCBC-1.16',
    },
  ],
  prerequisites: ['apcalcbc.limits-at-infinity-horizontal-asymptotes'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame IVT as the "no skipping values" theorem.',
      script:
        "If you walk continuously from one elevation to another, you HAVE TO PASS THROUGH every elevation in between — you can't teleport. That's the Intermediate Value Theorem in everyday language. Mathematically: a continuous function on a closed interval takes every y-value between its endpoints. AP exam questions love this — give a function, ask if it has a root in some interval; IVT proves it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ivt',
      kind: 'concept',
      goal: 'Cover IVT statement, hypotheses, and standard application patterns.',
      keyIdeas: [
        'INTERMEDIATE VALUE THEOREM (IVT): If f is CONTINUOUS on the closed interval [a, b], and N is any value BETWEEN f(a) and f(b), then there EXISTS at least one c in (a, b) such that f(c) = N.',
        'IN WORDS. A continuous function "fills in" all values between its endpoints. It cannot skip any y-value.',
        'CRUCIAL HYPOTHESIS — continuity on [a, b]. Including endpoints. Without continuity, the theorem fails — discontinuous functions can skip values. Always verify continuity before applying IVT.',
        'TYPICAL APPLICATION 1 — ROOT EXISTENCE. To show f has a zero in (a, b), apply IVT with N = 0: verify (i) f continuous on [a, b], (ii) f(a) and f(b) have OPPOSITE SIGNS (one positive, one negative). Then 0 is between f(a) and f(b), so there exists c with f(c) = 0.',
        'TYPICAL APPLICATION 2 — SOLUTION EXISTENCE. To show g(x) = h(x) has a solution in (a, b): rewrite as f(x) = g(x) − h(x) = 0 and apply the root-existence pattern to f.',
        'TYPICAL APPLICATION 3 — FIXED POINTS. To show f(x) = x has a solution: apply IVT to g(x) = f(x) − x.',
        'WHAT IVT DOES AND DOESN\'T GIVE. IVT proves EXISTENCE of c — it does NOT tell you the VALUE of c, nor does it say c is unique. There may be multiple c with f(c) = N. The theorem is a "yes there is at least one" statement, not a "here\'s where it is".',
        'WATCH FOR FALSE CONCLUSIONS — common errors: (1) Applying IVT to discontinuous functions (theorem doesn\'t apply). (2) Concluding c is UNIQUE (it might not be). (3) Concluding f(c) is the EXACT VALUE c — IVT only gives existence. (4) Applying IVT when f(a) and f(b) have the same sign (you can\'t conclude root existence between them — there might still be roots, but IVT doesn\'t prove it).',
      ],
      vocabulary: [
        { term: 'Intermediate Value Theorem (IVT)', definition: 'if f is continuous on [a, b] and N is between f(a) and f(b), then ∃ c in (a, b) with f(c) = N.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-root',
      kind: 'worked_example',
      problem:
        'Use the IVT to show that f(x) = x³ + x − 3 has a root in the interval (1, 2).',
      steps: [
        'STEP 1 — VERIFY CONTINUITY. f(x) = x³ + x − 3 is a polynomial → continuous on all of ℝ → continuous on [1, 2]. ✓',
        'STEP 2 — EVALUATE AT ENDPOINTS. f(1) = 1 + 1 − 3 = -1 (negative). f(2) = 8 + 2 − 3 = 7 (positive).',
        'STEP 3 — IDENTIFY OPPOSITE SIGNS. f(1) < 0 and f(2) > 0. So 0 is BETWEEN f(1) = -1 and f(2) = 7.',
        'STEP 4 — APPLY IVT. Since f is continuous on [1, 2] and 0 is between f(1) and f(2), by IVT there exists c in (1, 2) such that f(c) = 0.',
        'STEP 5 — INTERPRET. f has at least one root in (1, 2). IVT does not tell us where exactly (we\'d need to compute it numerically or use other methods), nor does it claim uniqueness — there could be more roots in this interval.',
      ],
      answer: 'Continuity ✓; f(1) = -1, f(2) = 7 (opposite signs); IVT → ∃ c ∈ (1, 2) with f(c) = 0.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-ivt-root',
      kind: 'try_yourself',
      problem:
        'Use IVT to show that f(x) = cos(x) − x has a root in (0, π/2).',
      expectedAnswer:
        'STEP 1 — Continuity. f(x) = cos(x) − x is the difference of two continuous functions (cos is continuous; x is continuous polynomial). Continuous on [0, π/2]. ✓ STEP 2 — Endpoint evaluations. f(0) = cos(0) − 0 = 1 − 0 = 1 (positive). f(π/2) = cos(π/2) − π/2 = 0 − π/2 ≈ -1.571 (negative). STEP 3 — Opposite signs. f(0) > 0, f(π/2) < 0. 0 is between them. STEP 4 — Apply IVT. Since f is continuous on [0, π/2] and 0 is between f(0) and f(π/2), by IVT ∃ c ∈ (0, π/2) with f(c) = 0. So cos(c) = c — there is a number in (0, π/2) where cosine equals itself. (This is the famous "fixed point of cosine" — exists by IVT, but no closed-form expression for it.)',
      responseFormat: 'free',
      hints: [
        'Verify continuity, then check endpoint signs.',
        'Apply IVT: opposite signs + continuity → root exists in between.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-equation',
      kind: 'try_yourself',
      problem:
        'Use IVT to show that the equation e^x = 2x + 1 has a solution in (0, 2).',
      expectedAnswer:
        'Rewrite: e^x − (2x + 1) = 0. Define f(x) = e^x − 2x − 1. STEP 1 — Continuity. e^x is continuous everywhere; 2x + 1 is continuous everywhere. Difference is continuous on [0, 2]. ✓ STEP 2 — Endpoints. f(0) = 1 − 0 − 1 = 0. WAIT — f(0) = 0 directly! So x = 0 IS a solution... but the problem asks for the OPEN interval (0, 2), so x = 0 doesn\'t count. Let me check: f(2) = e² − 5 ≈ 7.389 − 5 = 2.389 (positive). What about a slightly positive value to start? f(0.5) = e^0.5 − 1 − 1 = 1.6487 − 2 = -0.3513 (negative). So we have f(0.5) < 0 and f(2) > 0. By IVT applied to [0.5, 2]: ∃ c in (0.5, 2) ⊂ (0, 2) with f(c) = 0, i.e., e^c = 2c + 1. Done. (Subtlety: could also look at intervals around x = 0 to find the OTHER zero, depending on what the problem wanted; the problem said "a solution in (0, 2)" so we found one.)',
      responseFormat: 'free',
      hints: [
        'Rewrite as f(x) = 0.',
        'Find a sub-interval of (0, 2) where f changes sign.',
        'Apply IVT to that sub-interval.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-fail-cases',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Identify ALL hypotheses of IVT and explain what goes wrong if each is missing. Specifically: (a) what if f is not continuous on [a, b]? (b) what if N is not between f(a) and f(b)?',
      expectedAnswer:
        'IVT HYPOTHESES: (i) f is continuous on the CLOSED interval [a, b] (including both endpoints). (ii) N is a value BETWEEN f(a) and f(b) (i.e., min(f(a), f(b)) ≤ N ≤ max(f(a), f(b))). (a) IF NOT CONTINUOUS: a discontinuous function can SKIP values. Counterexample: f(x) = -1 for x < 0; f(x) = 1 for x ≥ 0 on [-1, 1]. f(-1) = -1, f(1) = 1. The value 0 is between them. But there is NO c with f(c) = 0 — the function jumps over 0. The discontinuity at x = 0 broke IVT. (b) IF N IS NOT BETWEEN f(a) and f(b): IVT says nothing. The function may or may not take that value somewhere in (a, b) — IVT just doesn\'t prove it. Example: f(x) = sin(x) on [0, π/4]. f(0) = 0, f(π/4) = √2/2 ≈ 0.707. The value N = 1 is NOT between them. IVT doesn\'t say sin(x) = 1 anywhere in [0, π/4] — and indeed it doesn\'t (sine reaches 1 only at π/2 + 2nπ). The hypothesis "N between f(a) and f(b)" is essential for IVT to conclude existence. Strong answers: (i) state both hypotheses, (ii) give counterexamples for what fails when each is missing.',
      responseFormat: 'frq',
      hints: [
        'Two hypotheses: continuity, and N is between f(a) and f(b).',
        'A discontinuous function can skip y-values.',
        'If N isn\'t between the endpoint values, IVT can\'t conclude anything.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'IVT: f continuous on [a, b], N between f(a) and f(b) → ∃ c ∈ (a, b) with f(c) = N.',
        'Standard use: prove root exists by checking continuity + opposite endpoint signs.',
        'IVT proves EXISTENCE only — not value, not uniqueness.',
        'CONTINUITY HYPOTHESIS is essential. Discontinuous functions can skip values.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.16',
    cedTitle: 'Working with the Intermediate Value Theorem',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard IVT statement and root-existence application pattern.' },
    ],
  },
};
