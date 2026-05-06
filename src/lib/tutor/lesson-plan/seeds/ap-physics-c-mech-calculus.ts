/**
 * AP Physics C: Mechanics — Calculus-Based Foundations.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS_C_MECH_CALCULUS: LessonPlan = {
  id: 'evelyn.ap.physics-c.mech.calculus.v1',
  title: 'AP Physics C: Mechanics — Calculus-Based Kinematics and Dynamics',
  curriculum: 'AP',
  grade: '11',
  subject: 'science',
  topic: 'ap-physics-c-mech',
  locale: 'en',
  los: [
    {
      id: 'ap.physics-c.mech.calculus',
      description: 'Apply calculus (derivatives + integrals) to kinematics, dynamics, and energy problems where forces and acceleration vary with time or position.',
      standard: 'AP-PHYS-C-MECH',
    },
  ],
  prerequisites: ['ap.physics-1'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Phys C distinguishes itself from Phys 1 by allowing variable forces — and that means calculus.',
      script: 'AP Physics 1 had constant accelerations and uniform forces. AP Physics C: Mech routinely has F(t) or F(x) — forces that change over time or position. The kinematic equations no longer apply directly. Calculus does. Today: how to use derivatives and integrals to handle variable-force mechanics.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-phys-c-calculus',
      kind: 'concept',
      goal: 'Position-velocity-acceleration via calculus, variable forces, work integrals, momentum from impulse.',
      keyIdeas: [
        'KINEMATICS via calculus:',
        '  v = dx/dt (velocity is the time derivative of position).',
        '  a = dv/dt = d²x/dt² (acceleration is derivative of velocity).',
        '  Inversely: x(t) = x₀ + ∫v(t)dt; v(t) = v₀ + ∫a(t)dt.',
        '  CONSTANT ACCELERATION reduces these to the standard kinematics equations. VARIABLE acceleration requires the integrals.',
        'NEWTON\'S 2ND LAW: F = ma = m(d²x/dt²). For variable F, this is a DIFFERENTIAL EQUATION you may need to solve.',
        'WORK with VARIABLE FORCE: W = ∫F·dx (along the path). For 1D: W = ∫F(x)dx from x_i to x_f.',
        '  When F is a function of POSITION (e.g. spring F = -kx), this integral is the only way.',
        '  Spring potential energy: U = (1/2)kx² comes from ∫kx dx.',
        'IMPULSE-MOMENTUM theorem: J = ∫F dt = Δp. With variable F(t), this integral gives the impulse, which equals the change in momentum.',
        '  Useful for collisions where F isn\'t constant.',
        'POWER: P = F·v. Or P = dW/dt.',
        'CENTER OF MASS for an extended object: x_cm = (∫x dm) / M. Often you parametrise dm = λ dx (linear density) or σ dA, etc.',
        'MOMENT OF INERTIA: I = ∫r² dm. Comes up in rotational mechanics.',
        'DIFFERENTIAL EQUATION SOLVING is sometimes required:',
        '  Drag: m(dv/dt) = -bv. Solution: v(t) = v₀ e^(-bt/m). Exponential decay.',
        '  SHM: m(d²x/dt²) = -kx. Solution: x(t) = A cos(ωt + φ), with ω = √(k/m).',
        'AP exam often gives a force expression (F as a function of t or x) and asks you to find motion / energy / momentum. Always start by writing F = ma, then decide whether you need to integrate or solve a differential equation.',
      ],
      vocabulary: [
        { term: 'impulse', definition: '∫F dt; the time-integral of force; equals the change in momentum.' },
        { term: 'differential equation', definition: 'an equation involving a function and its derivatives; physics often produces them when forces depend on position or velocity.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A 2 kg object is at rest at x = 0. A force F(t) = 4t (N, with t in seconds) acts on it for 5 seconds. Find the velocity at t = 5 s and the position at t = 5 s.',
      steps: [
        'Newton\'s 2nd law: F = ma → a(t) = F(t)/m = 4t/2 = 2t m/s².',
        'Integrate to find v: v(t) = v₀ + ∫₀ᵗ a(τ) dτ = 0 + ∫₀ᵗ 2τ dτ = τ²|₀ᵗ = t².',
        'At t = 5: v = 25 m/s.',
        'Integrate to find x: x(t) = x₀ + ∫₀ᵗ v(τ) dτ = 0 + ∫₀ᵗ τ² dτ = (1/3)t³.',
        'At t = 5: x = (1/3)(125) ≈ 41.67 m.',
        'Sanity: variable a means kinematics equations don\'t directly apply.',
      ],
      answer: 'v(5) = 25 m/s, x(5) ≈ 41.67 m',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A force F(x) = 6x² (N, with x in metres) acts on an object as it moves from x = 0 to x = 2 m. Find the work done.',
      expectedAnswer: 'W = ∫₀² F(x) dx = ∫₀² 6x² dx = 2x³|₀² = 2(8) − 0 = 16 J.',
      responseFormat: 'numeric',
      hints: [
        'Work with variable F is W = ∫F(x) dx.',
        'Integrate 6x² with respect to x.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-kinematics-equations',
      kind: 'misconception_check',
      question: 'A student uses v² = v₀² + 2aΔx for a problem with a position-dependent force F(x). Why is this wrong?',
      commonErrors: [
        {
          answer: 'Apply kinematics equations',
          misconception: 'Forgetting that the kinematic equations require constant acceleration.',
          correctsTo: 'The kinematics equations (v = v₀ + at, x = x₀ + v₀t + (1/2)at², v² = v₀² + 2aΔx) are derived assuming CONSTANT acceleration. With F(x) or F(t), a changes over time/position, and these equations DON\'T APPLY. You must use calculus: F = ma → a is variable → integrate. For energy questions, use the work-energy theorem with W = ∫F dx instead. AP graders dock heavily for misapplying kinematics equations to variable-force problems.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'v = dx/dt, a = dv/dt; integrate for inverse direction.',
        'Variable force ⟹ use F = ma → integrate or solve differential equation.',
        'Work with variable F: W = ∫F dx.',
        'Impulse = ∫F dt = Δp.',
        'Kinematics equations only apply with CONSTANT acceleration.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
