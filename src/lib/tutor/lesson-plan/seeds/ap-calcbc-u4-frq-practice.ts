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
      expectedAnswer: '(a) v = 3t² − 18t + 24 = 3(t − 2)(t − 4). a = 6t − 18 = 6(t − 3). (1.5)\n(b) v = 0 at t = 2 and t = 4. (1)\n(c) v > 0 when (t − 2)(t − 4) > 0: t < 2 or t > 4. So 0 ≤ t < 2 or t > 4. (2)\n(d) Speeding up = v and a same sign. a > 0 for t > 3, a < 0 for t < 3. \n• 0 < t < 2: v > 0, a < 0 → opposite, slowing. \n• 2 < t < 3: v < 0, a < 0 → same, speeding. \n• 3 < t < 4: v < 0, a > 0 → opposite, slowing. \n• t > 4: v > 0, a > 0 → same, speeding. \nSpeeding up on (2, 3) ∪ (4, ∞). (3)\nTotal: 7.5 points.',
      responseFormat: 'frq',
      hints: ['Compute v, a; analyze signs; speeding up requires same signs.'],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-related', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Related Rates. A right circular cone has fixed height 10 cm and base radius decreasing at 2 cm/min. (a) Write a formula for the volume V of the cone in terms of base radius r. (b) When r = 4 cm, find dV/dt. Show the differentiation step explicitly.',
      expectedAnswer: '(a) V = (1/3)πr²h, h = 10 → V = (10π/3)r². (1.5)\n(b) Differentiate: dV/dt = (10π/3)·2r·dr/dt = (20π/3)·r·dr/dt. At r = 4, dr/dt = -2: dV/dt = (20π/3)·4·(-2) = -160π/3 cm³/min. NEGATIVE: volume is decreasing. (3)\nTotal: 4.5 points.',
      responseFormat: 'frq',
      hints: ['Express V in r alone (h is fixed). Differentiate w.r.t. t. Plug in.'],
      estimatedMinutes: 5,
    },
    {
      id: 'try-frq-mixed', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Linearization + L\'Hôpital. (a) Use linearization at a = 0 to estimate sin(0.1) and tan(0.1). (b) Compute lim_{x→0} (sin x − x)/x³ using L\'Hôpital. Apply the rule as many times as necessary.',
      expectedAnswer: '(a) f(x) = sin x: f(0) = 0, f\'(0) = cos(0) = 1. L(x) = x. So sin(0.1) ≈ 0.1. (Actual ≈ 0.0998.) f(x) = tan x: f(0) = 0, f\'(0) = sec²(0) = 1. L(x) = x. So tan(0.1) ≈ 0.1. (Actual ≈ 0.1003.) (3)\n(b) Direct sub: (0 − 0)/0 = 0/0. L\'H 1: lim (cos x − 1)/(3x²). Still 0/0. L\'H 2: lim -sin x/(6x). Still 0/0. L\'H 3: lim -cos x/6 = -1/6. Limit = -1/6. (3)\nTotal: 6 points.',
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
