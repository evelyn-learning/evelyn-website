/**
 * IB DP Math AA — Trigonometry: Radian Measure & Unit Circle.
 * Radian definition, arc length, sector area in radians, exact values
 * on the unit circle.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_TRIG_RADIANS: LessonPlan = {
  id: 'evelyn.ibdp.aa.trig-radians.v1',
  title: 'IB DP Math AA — Radian Measure & Unit Circle',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.trig-radians',
      description: 'Convert between degrees and radians; compute arc length s = rθ and sector area (1/2)r²θ; recall exact values on the unit circle.',
      standard: 'IB-DP-MATH-AA-3.4/3.5',
    },
  ],
  prerequisites: ['ibdp.aa.poly-rational'],
  followUps: ['ibdp.aa.trig-id-equations'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB AA uses radians by default — degrees only when specified. Calculus formulas like d/dx(sin x) = cos x are FALSE if x is in degrees.',
      script: 'You\'ve been doing trig in degrees since GCSE. IB AA flips that: radians are the default, calculus only works with radians, and the unit circle becomes your home base. The good news: arc length and sector area get cleaner in radians.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-radians',
      kind: 'concept',
      goal: 'Radian definition, conversion, unit circle exact values, and the simpler formulas.',
      keyIdeas: [
        'RADIAN: angle subtended at the centre of a circle by an arc of length equal to the radius. So 1 radian ≈ 57.296°.',
        'CONVERSION: 180° = π radians. Multiply degrees by π/180 to get radians; multiply radians by 180/π for degrees.',
        'KEY ANGLES: 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 180° = π, 270° = 3π/2, 360° = 2π.',
        'UNIT CIRCLE: x = cos θ, y = sin θ for the point at angle θ. Pythagoras: x² + y² = 1 → sin²θ + cos²θ = 1.',
        'ARC LENGTH (radians): s = rθ. (Compare with degrees: s = (θ/360)·2πr — uglier.) Why simpler? Because radian = arc/radius by definition.',
        'SECTOR AREA (radians): A = (1/2)r²θ.',
        'EXACT VALUES on unit circle: at π/6, sin = 1/2 cos = √3/2 tan = 1/√3. At π/4, sin = cos = √2/2 tan = 1. At π/3, sin = √3/2 cos = 1/2 tan = √3. At π/2, sin = 1 cos = 0 tan undefined.',
        'CAS / TI conventions: most calculators have a MODE switch for degrees vs radians. Setting wrong → wrong answer everywhere.',
      ],
      vocabulary: [
        { term: 'radian', definition: 'an angle whose subtended arc length equals the radius; 1 rad ≈ 57.3°.' },
        { term: 'unit circle', definition: 'a circle of radius 1 centred at the origin; (cos θ, sin θ) is the point at angle θ.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sector',
      kind: 'worked_example',
      problem: 'A circular sector has radius 6 cm and the arc subtends an angle of 5π/6 radians at the centre. Find the arc length and the sector area in exact form.',
      steps: [
        'Arc length s = rθ = 6 · (5π/6) = 5π cm.',
        'Sector area A = (1/2)r²θ = (1/2)·36·(5π/6) = 18 · (5π/6) = 15π cm².',
        'CHECK by converting: 5π/6 rad = 150°. Arc length (degree formula) = (150/360)·2π·6 = (5/12)·12π = 5π ✓.',
      ],
      answer: 'Arc length = 5π cm; Sector area = 15π cm²',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Convert 2π/3 radians into degrees.',
      expectedAnswer: '120°',
      responseFormat: 'numeric',
      hints: [
        'Multiply by 180/π.',
        '(2π/3) · (180/π) = 2·180/3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mode',
      kind: 'misconception_check',
      question: 'A student computes sin(π/2) on a calculator set to DEGREES mode. They get sin(1.5708…) ≈ 0.0274. Why is this wrong?',
      commonErrors: [
        {
          answer: 'sin(π/2) ≈ 0.0274',
          misconception: 'Plugging a radian value into a calculator that\'s expecting degrees.',
          correctsTo: 'sin(π/2) in radians = 1 (top of unit circle). In degrees mode, the calculator treats π/2 ≈ 1.57 as 1.57 DEGREES, returning sin(1.57°) ≈ 0.027 — a tiny number, not 1. ALWAYS check calculator mode before trusting the output. IB exams expect radians for AA unless the question explicitly uses ° or "degrees".',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '180° = π radians; convert by π/180 or 180/π.',
        'Arc length s = rθ. Sector area = (1/2)r²θ. (θ in radians.)',
        'Unit circle: (cos θ, sin θ); sin²θ + cos²θ = 1.',
        'Exact values at π/6, π/4, π/3, π/2 — memorise.',
        'Calculus identities only valid in RADIANS.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A sector has area 24 cm² and arc length 8 cm. Find the radius and the angle (in radians).',
      hint: 'Two equations: (1/2)r²θ = 24 and rθ = 8. From (1): r·(rθ) = 48 → r·8 = 48 → r = 6. Then θ = 8/6 = 4/3 rad. Verify: arc length 6·(4/3) = 8 ✓; area (1/2)·36·(4/3) = 24 ✓.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
