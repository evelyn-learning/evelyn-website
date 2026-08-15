/**
 * HS Physics — Simple Harmonic Motion (SHM).
 * Springs and pendulums.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_SIMPLE_HARMONIC_MOTION: LessonPlan = {
  id: 'evelyn.hs.science.physics.simple-harmonic-motion.v1',
  title: 'Simple Harmonic Motion',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps4-1', description: 'Use mathematical representations to support a claim regarding relationships among the frequency, wavelength, and speed of waves traveling in various media.', standard: 'NGSS.HS-PS4-1' }],
  prerequisites: ['hs.phys.work-energy'], followUps: ['hs.phys.waves-sound'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in oscillating systems.', script: 'A grandfather clock\'s pendulum. A guitar string after you pluck it. A weight bouncing on a spring. A child on a swing. All examples of SHM — repeating motion with a restoring force. Same math runs them all.', estimatedMinutes: 2 },
    { id: 'concept-shm', kind: 'concept', goal: 'SHM: a restoring force proportional to displacement.', keyIdeas: [
      'SIMPLE HARMONIC MOTION: oscillation where restoring force is PROPORTIONAL to displacement.',
      'F = −kx (Hooke\'s Law for springs).',
      '  · F = restoring force.',
      '  · k = spring constant (stiffness, N/m).',
      '  · x = displacement from equilibrium.',
      '  · Negative sign: force opposes displacement.',
      'PROPERTIES of SHM:',
      '  · Position oscillates as a SINE/COSINE wave.',
      '  · PERIOD (T): time for one full cycle.',
      '  · FREQUENCY (f): cycles per second (Hz). f = 1/T.',
      '  · AMPLITUDE (A): max displacement.',
      'Spring period: T = 2π√(m/k). Larger m or smaller k → slower oscillation.',
      'Simple pendulum (small angle): T = 2π√(L/g). Period depends on LENGTH and gravity, NOT mass!',
    ], vocabulary: [{ term: 'amplitude', definition: 'maximum displacement from equilibrium.' }, { term: 'period', definition: 'time for one cycle (T).' }, { term: 'frequency', definition: 'cycles per second (Hz).' }, { term: 'restoring force', definition: 'force that pulls back toward equilibrium.' }], suggestedTools: ['show_equation', 'show_diagram'], estimatedMinutes: 5 },
    { id: 'concept-energy-shm', kind: 'concept', goal: 'In SHM, energy oscillates between PE and KE.', keyIdeas: [
      'TOTAL energy is constant (no friction): E = ½kA².',
      'AT EXTREMES (x = ±A): all PE, no KE. Velocity = 0.',
      'AT EQUILIBRIUM (x = 0): all KE, no PE. Velocity = max.',
      'Speed and acceleration ALSO oscillate (but offset in phase from position).',
      'Damping: real oscillators lose energy to friction → amplitude decays. Eventually stops.',
      'Resonance: applying force at the natural frequency → amplitude grows large (pushing a swing at the right time).',
    ], estimatedMinutes: 4 },
    { id: 'worked-pendulum', kind: 'worked_example', problem: 'A pendulum has length 1.0 m. What is its period on Earth (g = 10 m/s²)? On the Moon (g = 1.6 m/s²)?', steps: [
      'Earth: T = 2π√(L/g) = 2π√(1.0/10) = 2π × √0.1 = 2π × 0.316 ≈ 1.99 s.',
      'Moon: T = 2π√(1.0/1.6) = 2π × √0.625 = 2π × 0.79 ≈ 4.97 s.',
      'On Moon: gravity ~6x weaker → period ~2.5x longer (square root relationship).',
      'A "1-second pendulum" on Earth would take ~2.5 sec per swing on Moon.',
    ], answer: 'Earth: T ≈ 2.0 s. Moon: T ≈ 5.0 s. Pendulums tick slower in weaker gravity.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A 0.5 kg mass on a spring (k = 200 N/m) oscillates. What is the period? What is the frequency?', expectedAnswer: 'T = 2π√(m/k) = 2π√(0.5/200) = 2π√0.0025 = 2π × 0.05 ≈ 0.314 s. Frequency: f = 1/T = 1/0.314 ≈ 3.18 Hz. (~3 cycles per second.)', responseFormat: 'numeric', hints: ['T = 2π√(m/k).', 'f = 1/T.'], estimatedMinutes: 3 },
    { id: 'misconception-pendulum-mass', kind: 'misconception_check', question: 'A friend says "a heavier pendulum bob swings slower." Right?', commonErrors: [{ answer: 'Yes — heavier = slower.', misconception: 'Adding pendulum mass to slow it.', correctsTo: 'Pendulum period T = 2π√(L/g) — depends only on LENGTH and gravity, NOT mass. Heavy bob and light bob with same length swing at the same period. Galileo discovered this watching a chandelier in 1583. (Mass DOES matter for spring oscillators: T = 2π√(m/k).)' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['SHM: restoring force ∝ displacement.', 'Spring: T = 2π√(m/k).', 'Pendulum: T = 2π√(L/g) (mass doesn\'t matter!).', 'Energy oscillates between KE and PE; total constant (without damping).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
