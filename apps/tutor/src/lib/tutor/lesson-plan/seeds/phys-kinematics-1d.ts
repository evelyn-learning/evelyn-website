/**
 * High School Physics — Kinematics in One Dimension.
 *
 * NGSS HS-PS2-1 (and the broader HS physics canon): position,
 * velocity, acceleration as related quantities; the four kinematic
 * equations for constant acceleration; sign conventions for direction.
 * Foundation for everything in mechanics.
 *
 * Source: NGSS HS-PS2, OpenStax College Physics Chapter 2.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_KINEMATICS_1D: LessonPlan = {
  id: 'evelyn.hs.science.physics.kinematics-1d.v1',
  title: 'Kinematics in One Dimension',
  curriculum: 'NGSS',
  grade: '9-12',
  subject: 'science',
  topic: 'physics-mechanics',
  locale: 'en',
  los: [
    {
      id: 'ngss.hs-ps2-1',
      description: 'Analyze data to support the claim that Newton\'s second law of motion describes the mathematical relationship among the net force on a macroscopic object, its mass, and its acceleration.',
      standard: 'NGSS.HS-PS2-1',
    },
  ],
  prerequisites: ['ngss.ms-ps2-2'],
  followUps: ['hs.phys.kinematics-2d-projectile', 'hs.phys.newtons-second-law'],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the math in a concrete scenario the student has experienced.',
      script: 'A car accelerates from a red light. We can describe what\'s happening with three numbers: where it is (position), how fast it\'s going (velocity), and how fast its speed is changing (acceleration). These three are related — and once you know the relationships, you can predict where the car will be in 5 seconds, or how long it takes to reach 60 mph. That\'s kinematics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-position-velocity-acceleration',
      kind: 'concept',
      goal: 'Define position, velocity, and acceleration with clear sign conventions for 1D motion.',
      keyIdeas: [
        'POSITION (x) — where the object is along an axis. Sign tells direction (+ right, − left, by convention).',
        'DISPLACEMENT (Δx) — change in position. Δx = x_final − x_initial. Can be positive, negative, or zero.',
        'VELOCITY (v) — rate of change of position. v = Δx / Δt. Sign indicates direction.',
        'ACCELERATION (a) — rate of change of velocity. a = Δv / Δt.',
        'CRITICAL distinction: SPEED is the magnitude of velocity (always ≥ 0). VELOCITY has direction (+/−).',
        'A car braking has POSITIVE velocity (still moving forward) and NEGATIVE acceleration (slowing down).',
      ],
      vocabulary: [
        { term: 'displacement', definition: 'change in position; final minus initial.' },
        { term: 'velocity', definition: 'rate of change of position, with direction.' },
        { term: 'acceleration', definition: 'rate of change of velocity, with direction.' },
        { term: 'scalar', definition: 'a quantity with magnitude only (e.g., speed, distance).' },
        { term: 'vector', definition: 'a quantity with magnitude AND direction (e.g., velocity, displacement).' },
      ],
      suggestedTools: ['show_motion_diagram', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-kinematic-equations',
      kind: 'concept',
      goal: 'For CONSTANT acceleration, four equations relate the five variables (x₀, x, v₀, v, a, t). Knowing any 3 lets you solve for the others.',
      keyIdeas: [
        'Eq 1: v = v₀ + at (velocity at time t)',
        'Eq 2: x = x₀ + v₀t + ½at² (position at time t)',
        'Eq 3: v² = v₀² + 2a(x − x₀) (no time variable)',
        'Eq 4: x = x₀ + ½(v₀ + v)t (no acceleration variable)',
        'Pick the equation that matches what you KNOW and what you want to FIND.',
        'These are ONLY valid when acceleration is constant. If a changes (e.g., a non-constant force), use calculus or break into segments.',
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-car-stops',
      kind: 'worked_example',
      problem: 'A car traveling at 30 m/s brakes with constant acceleration −5 m/s². How long does it take to stop, and how far does it travel during braking?',
      steps: [
        'Knowns: v₀ = 30 m/s, v = 0 (stopped), a = −5 m/s². Find: t and Δx.',
        'For TIME: use Eq 1 (v = v₀ + at). 0 = 30 + (−5)t → t = 6 s.',
        'For DISTANCE: use Eq 3 (no t needed). v² = v₀² + 2aΔx → 0 = 900 + 2(−5)Δx → Δx = 90 m.',
        'Check: alternatively, Eq 4 with t=6 gives x = ½(30+0)(6) = 90 m. ✓',
      ],
      answer: 't = 6 s, distance = 90 m.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A ball is dropped from rest off a 45-m cliff. Using g = 10 m/s² (ignoring air resistance), how long does it take to hit the ground, and what is its speed on impact?',
      expectedAnswer: 't = 3 s, v = 30 m/s downward',
      responseFormat: 'free',
      hints: [
        'Set DOWN as positive (then a = +10 m/s², easy signs). Knowns: v₀ = 0, Δx = 45 m, a = 10 m/s².',
        'For TIME: use Eq 2 with v₀=0 → x = ½at² → solve for t.',
        'For SPEED: use Eq 1 (v = v₀ + at) once you have t.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-zero-velocity-zero-accel',
      kind: 'misconception_check',
      question: 'A ball thrown straight up reaches its peak and momentarily stops before falling back down. At that instant, the velocity is zero. A student concludes that "the acceleration must also be zero at the peak." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — zero velocity means zero acceleration.',
          misconception: 'Confusing zero velocity with zero acceleration.',
          correctsTo: 'No. Velocity is INSTANTANEOUSLY zero, but acceleration due to gravity is STILL −9.8 m/s². That\'s exactly why the ball doesn\'t HOVER — gravity is pulling it down at every instant, including the peak. At the peak, velocity is changing (from + to −) which requires nonzero acceleration.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Position, velocity, acceleration are related: v = Δx/Δt, a = Δv/Δt.',
        'Velocity and acceleration are VECTORS — direction matters.',
        'For constant acceleration, four kinematic equations relate the five variables.',
        'Pick the equation matching what you KNOW and what you want to FIND.',
        'Velocity = 0 ≠ acceleration = 0 (the peak of a thrown ball).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
