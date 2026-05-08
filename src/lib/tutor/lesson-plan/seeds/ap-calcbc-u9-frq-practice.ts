/**
 * AP Calculus BC — Unit 9 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u9-frq-practice.v1', title: 'U9 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u9-frq-practice', description: 'Apply Unit 9 parametric/polar/vector techniques.', standard: 'AP-CALCBC-9-FRQ' }],
  prerequisites: ['apcalcbc.polar-area'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Unit 9 FRQs combine parametric, polar, and 2D motion. Three problems incoming.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Parametric: dy/dx = (dy/dt)/(dx/dt). Arc length: ∫ √(x\'² + y\'²) dt.',
      'Polar area: (1/2)∫r² dθ. Identify bounds where r = 0 or curves intersect.',
      '2D motion: speed = |v|, distance = ∫|v| dt.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-parametric', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Parametric. A particle\'s position is given by x = t² − 1, y = t³ − 3t. (a) Find dy/dx. (b) Find values of t where the curve has horizontal and vertical tangents. (c) Find d²y/dx² as a function of t.',
      expectedAnswer: '(a) dx/dt = 2t. dy/dt = 3t² − 3. dy/dx = (3t² − 3)/(2t) = (3(t² − 1))/(2t). (1.5)\n(b) Horizontal: dy/dt = 0 with dx/dt ≠ 0. 3t² − 3 = 0 → t = ±1. Check dx/dt = ±2 ≠ 0. ✓ Vertical: dx/dt = 0 with dy/dt ≠ 0. 2t = 0 → t = 0. dy/dt at t=0 = -3 ≠ 0. ✓ Horizontal at t = ±1; vertical at t = 0. (2)\n(c) d/dt[dy/dx] = d/dt[(3t² − 3)/(2t)]. Quotient rule: (6t·2t − (3t²−3)·2)/(2t)² = (12t² − 6t² + 6)/(4t²) = (6t² + 6)/(4t²) = (3(t² + 1))/(2t²). d²y/dx² = ÷ dx/dt = (3(t² + 1)/(2t²)) / (2t) = 3(t² + 1)/(4t³). (2.5)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Parametric derivatives.'], estimatedMinutes: 6 },
    { id: 'try-frq-vector', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Vector / 2D Motion. A particle has v(t) = ⟨3 − t, 2t − 4⟩ on [0, 5]. (a) Find when the particle is at rest. (b) Find total distance traveled. (c) Find acceleration vector at t = 2.',
      expectedAnswer: '(a) At rest: |v| = 0 means BOTH components 0. v_x = 3 − t = 0 → t = 3. v_y = 2t − 4 = 0 → t = 2. Both can\'t be 0 at same t → particle is NEVER at rest. (Different from 1D motion where v=0 means at rest.) (1.5)\n(b) Distance = ∫_0^5 √((3 − t)² + (2t − 4)²) dt. Expand: (3 − t)² + (2t − 4)² = 9 − 6t + t² + 4t² − 16t + 16 = 5t² − 22t + 25. So Distance = ∫_0^5 √(5t² − 22t + 25) dt. (Numerical evaluation needed; AP would accept this setup or a calculator answer.) (3)\n(c) a(t) = ⟨-1, 2⟩ (constant). At t = 2: ⟨-1, 2⟩. (1.5)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Component-wise differentiation.'], estimatedMinutes: 6 },
    { id: 'try-frq-polar', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Polar Area. Consider r = 2 sin(2θ) (rose curve). (a) Find the area of ONE petal. (b) Find the total area enclosed by all four petals.',
      expectedAnswer: '(a) One petal traces from r = 0 to r = 0 next time. r = 0 when sin(2θ) = 0, i.e., 2θ = 0, π, 2π, ... → θ = 0, π/2, π, ... One petal: 0 ≤ θ ≤ π/2. A = (1/2)∫_0^{π/2} (2 sin 2θ)² dθ = 2∫_0^{π/2} sin²(2θ) dθ. Use sin²(2θ) = (1 − cos 4θ)/2: = 2 · ∫_0^{π/2} (1 − cos 4θ)/2 dθ = [θ − (sin 4θ)/4]_0^{π/2} = π/2 − 0 = π/2. (3.5)\n(b) 4 petals × π/2 = 2π. (1.5)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['One petal: 0 to π/2. Area formula: (1/2)∫r² dθ.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Parametric: derivatives via chain rule.',
      'Polar area: (1/2)∫r² dθ.',
      '2D motion: vector velocity, scalar speed.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9-FRQ', cedTitle: 'Unit 9 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-9.' }] },
};
