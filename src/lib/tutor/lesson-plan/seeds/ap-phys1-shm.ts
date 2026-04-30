/**
 * AP Physics 1 — Simple Harmonic Motion.
 *
 * Springs and pendulums. Period, frequency, energy in SHM, restoring force.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_SHM: LessonPlan = {
  id: 'evelyn.ap.physics1.shm.v1',
  title: 'Simple Harmonic Motion',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.shm',
      description: 'Identify simple harmonic motion, calculate period for spring-mass and pendulum systems, and analyze energy in oscillating systems.',
      standard: 'AP-PHYS1-3.B',
    },
  ],
  prerequisites: ['apphys1.energy', 'apphys1.newtons-second'],
  followUps: ['apphys1.waves'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Identify the universal pattern behind oscillation.',
      script: 'Pluck a guitar string. Push a kid on a swing. Pull a spring and let go. They all oscillate the same way — and they\'re all governed by the same equation. The trick: a force that pulls the object back toward equilibrium proportional to how far it\'s strayed. That\'s simple harmonic motion.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-restoring',
      kind: 'concept',
      goal: 'Restoring force, period formulas, energy distribution.',
      keyIdeas: [
        'SHM definition: a system oscillates with SHM if the net force is proportional to and opposite the displacement: F = −k·x. Hooke\'s law for springs is the canonical example.',
        'PERIOD T = how long for one full cycle. FREQUENCY f = 1/T. ANGULAR FREQUENCY ω = 2π/T = 2π·f.',
        'SPRING-MASS: T = 2π·√(m/k). Mass slows oscillation, stiffer spring speeds it up. INDEPENDENT of amplitude.',
        'SIMPLE PENDULUM (small angle): T = 2π·√(L/g). INDEPENDENT of mass and amplitude (small-angle approximation).',
        'ENERGY: total = KE + PE. At extreme: all PE (max), v = 0. At equilibrium: all KE, x = 0. KE_max = 0.5·k·A² (spring) or m·g·h_max (pendulum).',
        'POSITION: x(t) = A·cos(ω·t + φ). VELOCITY: v(t) = −A·ω·sin(ω·t + φ). MAX SPEED: v_max = A·ω.',
        'Pendulums break SHM at large angles — the small-angle approximation sin θ ≈ θ stops holding.',
      ],
      vocabulary: [
        { term: 'amplitude', definition: 'maximum displacement from equilibrium.' },
        { term: 'restoring force', definition: 'a force that always pulls the system back toward equilibrium.' },
        { term: 'period', definition: 'time for one complete oscillation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-spring',
      kind: 'worked_example',
      problem: 'A 0.2 kg block on a frictionless surface attached to a spring (k = 50 N/m) is pulled 0.1 m from equilibrium and released. Find the period and maximum speed.',
      steps: [
        'Period: T = 2π·√(m/k) = 2π·√(0.2/50) = 2π·√(0.004) = 2π·0.0632 ≈ 0.40 s.',
        'Angular frequency ω = 2π/T = 2π / 0.40 ≈ 15.7 rad/s. (Or directly: ω = √(k/m) = √(250) ≈ 15.8 rad/s.)',
        'Max speed at equilibrium: v_max = A·ω = 0.1 · 15.8 ≈ 1.58 m/s.',
        'Energy check: KE_max = 0.5·m·v_max² = 0.5·0.2·2.5 = 0.25 J. PE_max = 0.5·k·A² = 0.5·50·0.01 = 0.25 J. ✓',
      ],
      answer: 'T ≈ 0.40 s, v_max ≈ 1.58 m/s',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A simple pendulum has length 1 m. Find its period on Earth (g = 10 m/s²).',
      expectedAnswer: '2 s',
      responseFormat: 'numeric',
      hints: [
        'T = 2π·√(L/g).',
        'Use π ≈ 3.16 if computing manually. Or note √(1/10) ≈ 0.316, then 2π·0.316 ≈ 1.99 s.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-amplitude',
      kind: 'misconception_check',
      question: 'You double a pendulum\'s amplitude (the angle it swings to). Does its period also double?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing amplitude with frequency-determining factors.',
          correctsTo: 'No — period stays the same (small-angle approximation). T depends only on L and g for a pendulum, on m and k for a spring. Amplitude affects MAX SPEED and ENERGY, not period. This is why pendulum clocks work — small variations in swing arc don\'t change the timing.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SHM: restoring force ∝ displacement. F = −kx.',
        'T_spring = 2π·√(m/k). T_pendulum = 2π·√(L/g).',
        'Period independent of amplitude.',
        'v_max = A·ω at equilibrium. Total energy = 0.5·k·A² stays constant.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A pendulum clock keeps perfect time on Earth. Take it to the moon (g_moon ≈ g_earth / 6). Will it run fast or slow?',
      hint: 'T = 2π·√(L/g). Smaller g → larger T → each "second" tick takes longer. The clock runs SLOW.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
