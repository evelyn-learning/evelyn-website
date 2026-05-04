/**
 * JEE Main Physics — Oscillations (SHM).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_OSCILLATIONS: LessonPlan = {
  id: 'evelyn.jee.phys.oscillations.v1',
  title: 'JEE Physics — Oscillations',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.oscillations',
      description: 'Apply SHM equations for spring-mass and pendulum systems; compute period, frequency, energy of oscillation.',
      standard: 'JEE-MAIN-PHY-OSC',
    },
  ],
  prerequisites: ['jee.phys.work-energy-power'],
  followUps: ['jee.phys.waves'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'SHM problems are formula-driven once you identify the restoring force per unit displacement.',
      script: 'Spring oscillation, simple pendulum, physical pendulum, torsion pendulum — they\'re all SHM with different "effective k". The period formula T = 2π√(m/k) generalises beautifully. Today we drill the substitutions.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-shm',
      kind: 'concept',
      goal: 'Definition of SHM, period formulas, energy.',
      keyIdeas: [
        'SHM CONDITION: restoring force F = −kx, where x is displacement from equilibrium and k > 0.',
        'EQUATION OF MOTION: a = −(k/m)·x = −ω²x, where ω = √(k/m) is angular frequency.',
        'POSITION: x(t) = A·cos(ωt + φ). A = amplitude, φ = phase.',
        'PERIOD: T = 2π/ω = 2π·√(m/k). Frequency f = 1/T.',
        'SPRING-MASS: T = 2π·√(m/k).',
        'SIMPLE PENDULUM (small angles): T = 2π·√(L/g). Note: independent of mass.',
        'PHYSICAL PENDULUM: T = 2π·√(I/(mgd)) where I is moment of inertia about pivot, d is distance from pivot to centre of mass.',
        'ENERGY in SHM: E_total = (1/2)kA² (constant). KE = (1/2)kA² − (1/2)kx². At extremes (x = ±A): all PE. At centre: all KE.',
        'MAX VELOCITY: v_max = ωA. MAX ACCELERATION: a_max = ω²A.',
        'JEE TRAP: in pendulum problems with small angles, sin θ ≈ θ. The "small angle" assumption is essential — large amplitudes are NOT SHM.',
      ],
      vocabulary: [
        { term: 'simple harmonic motion', definition: 'oscillation under restoring force proportional to displacement; F = −kx.' },
        { term: 'angular frequency', definition: 'ω = √(k/m); related to period by T = 2π/ω.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-spring',
      kind: 'worked_example',
      problem: 'A 0.5 kg mass is attached to a spring (k = 200 N/m). It is pulled 0.1 m from equilibrium and released. Find the period, max speed, and total energy.',
      steps: [
        'ω = √(k/m) = √(200/0.5) = √400 = 20 rad/s.',
        'T = 2π/ω = 2π/20 ≈ 0.314 s.',
        'v_max = ωA = 20·0.1 = 2 m/s.',
        'Total energy E = (1/2)kA² = (1/2)·200·(0.1)² = 1 J.',
      ],
      answer: 'T ≈ 0.314 s; v_max = 2 m/s; E = 1 J',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A simple pendulum has length 1 m. Find the period on Earth (g = 10 m/s²).',
      expectedAnswer: 'T ≈ 2 s',
      responseFormat: 'numeric',
      hints: [
        'T = 2π·√(L/g) = 2π·√(1/10) = 2π·0.316 ≈ 1.99 s.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-amplitude-period',
      kind: 'misconception_check',
      question: 'A student says doubling the amplitude of a spring oscillator doubles its period. Correct?',
      commonErrors: [
        {
          answer: 'Doubling A doubles T',
          misconception: 'Confusing amplitude (which doesn\'t affect period in SHM) with parameters that do.',
          correctsTo: 'Period T = 2π·√(m/k) depends ONLY on mass and spring constant. Amplitude has no effect on period — that\'s the defining feature of SHM (isochronism). However, doubling A does double v_max (= ωA) and quadruple total energy (= (1/2)kA²). The independence of period from amplitude is why pendulum clocks work.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SHM: F = −kx, ω = √(k/m), T = 2π/ω.',
        'Spring: T = 2π√(m/k). Pendulum: T = 2π√(L/g).',
        'E_total = (1/2)kA² (constant).',
        'v_max = ωA; a_max = ω²A; both at x = 0 (centre, only velocity), x = ±A (extremes, only acceleration).',
        'Period independent of amplitude (small-angle limit for pendulum).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two springs in parallel (each k₁) hold a mass m. Find the equivalent k and the period.',
      hint: 'Parallel: spring forces add for the same displacement → k_eq = 2k₁. T = 2π·√(m/(2k₁)). Springs in SERIES would give k_eq = k₁/2; period 2π·√(2m/k₁).',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
