/**
 * AP Calculus BC — CED Unit 9.4+9.5+9.6: Vector-Valued Functions and
 * Motion in 2D.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_VECTOR_VALUED: LessonPlan = {
  id: 'evelyn.ap.calcbc.vector-valued.v1', title: 'U9.4 Vector-Valued Functions and 2D Motion',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.vector-valued', description: 'Differentiate and integrate vector-valued functions r(t) = ⟨x(t), y(t)⟩ component-wise. Apply to 2D motion: position, velocity, speed, acceleration. Find total distance traveled in 2D.', standard: 'AP-CALCBC-9.4-9.6' }],
  prerequisites: ['apcalcbc.parametric-arc-length'], followUps: ['apcalcbc.polar-coordinates'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame vector-valued functions as 2D position over time.', script: "A particle moving in 2D has position r(t) = ⟨x(t), y(t)⟩. Velocity, speed, acceleration, distance — all vector-or-scalar quantities you compute component-wise. AP loves \"particle moving in xy-plane\" FRQs.", estimatedMinutes: 2 },
    { id: 'concept-vector', kind: 'concept', goal: 'Cover vector calculus + 2D motion quantities.',
      keyIdeas: [
        'VECTOR-VALUED FUNCTION: r(t) = ⟨x(t), y(t)⟩. Position vector at time t.',
        'VELOCITY: v(t) = r\'(t) = ⟨x\'(t), y\'(t)⟩. Vector quantity.',
        'SPEED: |v(t)| = √((x\'(t))² + (y\'(t))²). Scalar quantity (magnitude of velocity).',
        'ACCELERATION: a(t) = r\'\'(t) = ⟨x\'\'(t), y\'\'(t)⟩.',
        'INTEGRATION component-wise: ∫ r(t) dt = ⟨∫ x(t) dt, ∫ y(t) dt⟩.',
        'MOVING FROM v BACK TO r: r(t) = r(0) + ∫_0^t v(τ) dτ. Component-wise: x(t) = x(0) + ∫_0^t x\'(τ) dτ.',
        'TOTAL DISTANCE TRAVELED on [a, b]: ∫_a^b |v(t)| dt = ∫_a^b √(x\'² + y\'²) dt. Same as parametric arc length, applied to motion.',
        'DISPLACEMENT (vector): r(b) − r(a). The straight-line vector from start to end.',
        'CRITICAL DIFFERENCE from Unit 4.2 motion: in 2D, the "particle moves left/right" interpretation generalizes — but speed = |v| (magnitude); velocity = v (vector). They\'re not interchangeable.',
      ],
      vocabulary: [
        { term: 'vector-valued function', definition: 'r(t) = ⟨x(t), y(t)⟩ describing position over time.' },
        { term: 'speed', definition: '|v(t)| = magnitude of velocity vector.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-motion', kind: 'worked_example', problem: 'A particle\'s position is r(t) = ⟨t², 2t⟩ for t ≥ 0. (a) Find v(t). (b) Find speed at t = 2. (c) Find a(t).',
      steps: [
        'STEP 1 — v(t) = r\'(t) = ⟨2t, 2⟩.',
        'STEP 2 — Speed = |v| = √((2t)² + 4) = √(4t² + 4) = 2√(t² + 1). At t = 2: 2√5.',
        'STEP 3 — a(t) = r\'\'(t) = ⟨2, 0⟩. Constant acceleration in x-direction.',
      ],
      answer: 'v = ⟨2t, 2⟩; speed at t=2 = 2√5; a = ⟨2, 0⟩.', estimatedMinutes: 4 },
    { id: 'try-velocity-position', kind: 'try_yourself', problem: 'A particle has v(t) = ⟨cos t, sin t⟩ and r(0) = ⟨0, 0⟩. Find r(t).',
      expectedAnswer: 'r(t) = r(0) + ∫_0^t v(τ) dτ = ⟨0, 0⟩ + ⟨∫_0^t cos τ dτ, ∫_0^t sin τ dτ⟩ = ⟨sin t, 1 − cos t⟩.',
      responseFormat: 'numeric', hints: ['Integrate component-wise; add initial position.'], estimatedMinutes: 3 },
    { id: 'try-distance', kind: 'try_yourself', problem: 'A particle has v(t) = ⟨2 sin t, 2 cos t⟩ on [0, π/2]. Find total distance traveled.',
      expectedAnswer: 'Speed = √((2 sin t)² + (2 cos t)²) = √(4 sin²t + 4 cos²t) = 2. Total distance = ∫_0^{π/2} 2 dt = π. (Particle moves at constant speed 2 along a circular path.)',
      responseFormat: 'numeric', hints: ['∫ |v| dt = ∫ √((x\')² + (y\')²) dt.'], estimatedMinutes: 3 },
    { id: 'try-displacement-vs-distance', kind: 'try_yourself', problem: 'AP-style synthesis. A particle moves with v(t) = ⟨2t, 4 - 2t⟩ on [0, 4]. (a) Find displacement. (b) Find total distance.',
      expectedAnswer: '(a) Displacement = ⟨∫_0^4 2t dt, ∫_0^4 (4 - 2t) dt⟩ = ⟨16, 16 - 16⟩ = ⟨16, 0⟩. The particle ends 16 units to the right of where it started, same height. \n(b) Total distance = ∫_0^4 √((2t)² + (4 - 2t)²) dt = ∫_0^4 √(4t² + 16 - 16t + 4t²) dt = ∫_0^4 √(8t² - 16t + 16) dt. Factor 8 from square root: √8·√(t² - 2t + 2) = 2√2·√((t-1)² + 1). \n∫_0^4 2√2 · √((t-1)² + 1) dt. Sub u = t - 1: ∫_{-1}^3 2√2·√(u² + 1) du. This integral has standard form ∫√(u²+1) du = (u/2)·√(u²+1) + (1/2)·ln|u + √(u²+1)| + C (table integral / hyperbolic substitution). Evaluating exactly is involved; in practice on AP exam, this would either simplify due to chosen functions or be left in setup form.',
      responseFormat: 'frq', hints: ['Displacement: integrate components. Distance: ∫|v|.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'r(t) = ⟨x(t), y(t)⟩. v = r\'. a = r\'\'.',
      'Speed = |v| = √(x\'² + y\'²).',
      'Distance = ∫|v| dt. Displacement = r(b) − r(a) (vector).',
      'Differentiation and integration are component-wise.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9.4-9.6', cedTitle: 'Vector-Valued Functions', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '10', note: 'Standard vector-valued.' }] },
};
