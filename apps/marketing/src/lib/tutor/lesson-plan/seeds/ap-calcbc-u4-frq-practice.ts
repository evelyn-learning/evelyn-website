/**
 * AP Calculus BC — Unit 4 FRQ Practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U4_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u4-frq-practice.v1',
  title: 'U4 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [{ id: 'apcalcbc.u4-frq-practice', description: 'Apply Unit 4 contextual derivatives in multi-part FRQs.', standard: 'AP-CALCBC-4-FRQ' }],
  prerequisites: ['apcalcbc.lhopital'],
  followUps: [],
  estimatedMinutes: 28,
  segments: [
    {
      id: 'hook', kind: 'hook',
      goal: 'Set Unit 4 FRQ stakes — applications.',
      script: "Unit 4 FRQs test contextual interpretation, related rates, linearization, and L'Hôpital. Three problems incoming.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy', kind: 'concept',
      goal: 'Refresh on rubric.',
      keyIdeas: [
        'Always include UNITS in interpretation answers.',
        'Related rates: 5 steps. Differentiate before plugging in.',
        'Linearization: state f(a), f\'(a), L(x), then evaluate.',
        'L\'Hôpital: VERIFY indeterminate form before applying.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-frq-motion', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Motion. A particle moves along a line with position s(t) = t³ − 9t² + 24t (in meters, t ≥ 0 in seconds). (a) Find v(t) and a(t). (b) When is the particle at rest? (c) When is the particle moving to the right? (d) When is the particle speeding up?',
      expectedAnswer: '(a) v = 3t² − 18t + 24 = 3(t − 2)(t − 4). a = 6t − 18 = 6(t − 3). (2)\n(b) v = 0 at t = 2 and t = 4. (1)\n(c) v > 0 when (t − 2)(t − 4) > 0: t < 2 or t > 4. So 0 ≤ t < 2 or t > 4. (2)\n(d) Speeding up = v and a same sign. a > 0 for t > 3, a < 0 for t < 3. \n• 0 < t < 2: v > 0, a < 0 → opposite, slowing. \n• 2 < t < 3: v < 0, a < 0 → same, speeding. \n• 3 < t < 4: v < 0, a > 0 → opposite, slowing. \n• t > 4: v > 0, a > 0 → same, speeding. \nSpeeding up on (2, 3) ∪ (4, ∞). (4)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Differentiates position to velocity v = 3t² − 18t + 24 (1 pt) and velocity to acceleration a = 6t − 18 (1 pt); factored forms 3(t − 2)(t − 4) and 6(t − 3) accepted.', modelResponse: 'v(t) = s\'(t) = 3t² − 18t + 24 = 3(t − 2)(t − 4). a(t) = v\'(t) = 6t − 18 = 6(t − 3).' },
          { criterionId: 'b', maxPoints: 1, scoringCriteria: 'Solves v(t) = 0 to get t = 2 and t = 4.', modelResponse: 'v = 0 ⇒ 3(t − 2)(t − 4) = 0 ⇒ t = 2 and t = 4.' },
          { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Determines where v > 0 via a sign analysis of (t − 2)(t − 4) (1 pt) and states the interval 0 ≤ t < 2 or t > 4 for motion to the right (1 pt).', modelResponse: 'v > 0 when (t − 2)(t − 4) > 0, i.e. t < 2 or t > 4. On t ≥ 0: 0 ≤ t < 2 or t > 4.' },
          { criterionId: 'd', maxPoints: 4, scoringCriteria: 'States speeding up ⟺ v and a have the same sign (1 pt), finds a changes sign at t = 3 and analyzes the signs of v and a on each interval (2 pts), and concludes the particle speeds up on (2, 3) ∪ (4, ∞) (1 pt).', modelResponse: 'Speeding up ⟺ v and a share a sign. a > 0 for t > 3, a < 0 for t < 3. (0,2): v>0, a<0 → slowing; (2,3): v<0, a<0 → speeding; (3,4): v<0, a>0 → slowing; (t>4): v>0, a>0 → speeding. Speeding up on (2, 3) ∪ (4, ∞).' },
        ],
      },
      modelResponse:
        '(a) v = 3t² − 18t + 24 = 3(t − 2)(t − 4); a = 6t − 18 = 6(t − 3). (b) v = 0 at t = 2, 4. (c) Moving right (v > 0) on 0 ≤ t < 2 or t > 4. (d) Speeding up (v, a same sign) on (2, 3) ∪ (4, ∞).',
      responseFormat: 'frq',
      hints: ['Compute v, a; analyze signs; speeding up requires same signs.'],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-related', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Related Rates. A right circular cone has fixed height 10 cm and base radius decreasing at 2 cm/min. (a) Write a formula for the volume V of the cone in terms of base radius r. (b) When r = 4 cm, find dV/dt. Show the differentiation step explicitly.',
      expectedAnswer: '(a) V = (1/3)πr²h, h = 10 → V = (10π/3)r². (3)\n(b) Differentiate: dV/dt = (10π/3)·2r·dr/dt = (20π/3)·r·dr/dt. (3) At r = 4, dr/dt = -2: dV/dt = (20π/3)·4·(-2) = -160π/3 cm³/min. NEGATIVE: volume is decreasing. (3)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Writes the cone volume V = (1/3)πr²h (1 pt), substitutes the fixed h = 10 (1 pt), and reduces to V = (10π/3)r² in terms of r alone (1 pt).', modelResponse: 'V = (1/3)πr²h. With h = 10 fixed, V = (1/3)π r² (10) = (10π/3)r².' },
          { criterionId: 'b-setup', maxPoints: 3, scoringCriteria: 'Differentiates V with respect to t (chain rule on r²) to obtain dV/dt = (10π/3)·2r·dr/dt = (20π/3)·r·dr/dt.', modelResponse: 'dV/dt = (10π/3)·2r·dr/dt = (20π/3)·r·dr/dt.' },
          { criterionId: 'b-eval', maxPoints: 3, scoringCriteria: 'Substitutes r = 4 and dr/dt = −2 (1 pt), computes dV/dt = −160π/3 cm³/min with correct units (1 pt), and interprets the negative sign as the volume decreasing (1 pt).', modelResponse: 'At r = 4, dr/dt = −2: dV/dt = (20π/3)(4)(−2) = −160π/3 cm³/min. The negative sign means the volume is decreasing.' },
        ],
      },
      modelResponse:
        '(a) V = (1/3)πr²h with h = 10 gives V = (10π/3)r². (b) dV/dt = (20π/3)·r·dr/dt; at r = 4, dr/dt = −2, dV/dt = −160π/3 cm³/min (decreasing).',
      responseFormat: 'frq',
      hints: ['Express V in r alone (h is fixed). Differentiate w.r.t. t. Plug in.'],
      estimatedMinutes: 5,
    },
    {
      id: 'try-frq-mixed', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Linearization + L\'Hôpital. (a) Use linearization at a = 0 to estimate sin(0.1) and tan(0.1). (b) Compute lim_{x→0} (sin x − x)/x³ using L\'Hôpital. Apply the rule as many times as necessary.',
      expectedAnswer: '(a) f(x) = sin x: f(0) = 0, f\'(0) = cos(0) = 1. L(x) = x. So sin(0.1) ≈ 0.1. (Actual ≈ 0.0998.) f(x) = tan x: f(0) = 0, f\'(0) = sec²(0) = 1. L(x) = x. So tan(0.1) ≈ 0.1. (Actual ≈ 0.1003.) (4)\n(b) Direct sub: (0 − 0)/0 = 0/0. L\'H 1: lim (cos x − 1)/(3x²). Still 0/0. L\'H 2: lim -sin x/(6x). Still 0/0. L\'H 3: lim -cos x/6 = -1/6. Limit = -1/6. (5)\nTotal: 9 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 4, scoringCriteria: 'For sin x: f(0) = 0, f\'(0) = 1, L(x) = x, giving sin(0.1) ≈ 0.1 (2 pts). For tan x: f(0) = 0, f\'(0) = sec²(0) = 1, L(x) = x, giving tan(0.1) ≈ 0.1 (2 pts).', modelResponse: 'sin x at a = 0: f(0) = 0, f\'(0) = cos 0 = 1, so L(x) = x and sin(0.1) ≈ 0.1. tan x at a = 0: f(0) = 0, f\'(0) = sec²0 = 1, so L(x) = x and tan(0.1) ≈ 0.1.' },
          { criterionId: 'b', maxPoints: 5, scoringCriteria: 'Verifies the 0/0 indeterminate form (1 pt), applies L\'Hôpital three times — (cos x − 1)/(3x²), then −sin x/(6x), then −cos x/6 — re-checking 0/0 before each re-application (3 pts), and concludes the limit is −1/6 (1 pt).', modelResponse: 'Direct substitution gives 0/0. L\'Hôpital: (cos x − 1)/(3x²) → 0/0; again −sin x/(6x) → 0/0; again −cos x/6 → −1/6. So the limit is −1/6.' },
        ],
      },
      modelResponse:
        '(a) sin(0.1) ≈ 0.1 and tan(0.1) ≈ 0.1 via L(x) = x at a = 0. (b) lim_{x→0} (sin x − x)/x³ = −1/6 by applying L\'Hôpital three times.',
      responseFormat: 'frq',
      hints: ['Linearize each at 0. For (b), apply L\'H repeatedly until determinate.'],
      estimatedMinutes: 6,
    },
    {
      id: 'recap', kind: 'recap',
      mustRemember: [
        'Motion: speeding up ⟺ v and a same sign.',
        'Related rates: 5 steps. Differentiate first; plug in last.',
        'Linearization: L(x) = f(a) + f\'(a)(x − a).',
        'L\'Hôpital: only for indeterminate forms; can apply repeatedly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4', cedTopic: '4-FRQ', cedTitle: 'Unit 4 FRQ Practice',
    sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-4 patterns.' }],
  },
};
