/**
 * AP Physics C: Mechanics — Work-Energy and Momentum (Calculus-Based).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS_C_MECH_ENERGY_MOMENTUM: LessonPlan = {
  id: 'evelyn.ap.physics-c.mech.energy-momentum.v1',
  title: 'AP Physics C: Mechanics — Energy and Momentum (Calculus)',
  curriculum: 'AP',
  grade: '11',
  subject: 'science',
  topic: 'ap-physics-c-mech',
  locale: 'en',
  los: [{ id: 'ap.physics-c.mech.energy-momentum', description: 'Apply variable-force work integrals, conservative-force potentials, and impulse-momentum theorem with calculus.', standard: 'AP-PHYS-C-MECH' }],
  prerequisites: ['ap.physics-c.mech.calculus'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'AP Physics C uses calculus for non-constant forces — and the energy/momentum theorems become integrals.', script: 'AP Phys 1 had constant forces. AP Phys C lets force vary with position or time. The work-energy theorem becomes ∫F·dx; impulse-momentum becomes ∫F·dt. Today: master both.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Variable-force work, potential, conservation, impulse, collisions.', keyIdeas: [
      'WORK with variable force: W = ∫F·dx.',
      '  In 3D: W = ∫F·dr (line integral).',
      '  For constant F parallel to displacement: W = Fd.',
      'WORK-ENERGY theorem: W_net = ΔKE = (1/2)mv² − (1/2)mv₀².',
      'CONSERVATIVE FORCE: W path-independent. Examples: gravity, spring, electric.',
      '  Has potential energy U such that F = −dU/dx (in 1D) or F = −∇U (in 3D).',
      '  Spring: U = (1/2)kx². Gravity (uniform g): U = mgh. Gravity (point masses): U = −GMm/r.',
      'CONSERVATION OF MECHANICAL ENERGY: KE + U = constant when only conservative forces act.',
      'NON-CONSERVATIVE forces (friction, drag): W lost to heat. ΔKE + ΔU + heat = 0.',
      'POWER: P = dW/dt = F·v.',
      'IMPULSE: J = ∫F dt = Δp (impulse-momentum theorem).',
      '  For constant F: J = F·Δt.',
      'MOMENTUM: p = mv (vector). Conserved when no net external force.',
      'COLLISIONS:',
      '  ELASTIC: KE conserved. Use both conservation of momentum + KE.',
      '  INELASTIC: KE NOT conserved. Use only momentum conservation.',
      '  PERFECTLY INELASTIC: stick together. Use momentum; KE maximally lost.',
      'CENTER OF MASS: r_cm = (Σm_i r_i)/M. For continuous body: ∫r dm/M.',
      '  Velocity of CM: v_cm = (Σm_i v_i)/M.',
      '  External force changes momentum of CM only: F_net = M·a_cm.',
      'COLLISIONS in CM FRAME: in absence of external force, total momentum in CM frame is zero — useful simplification.',
      'COMMON AP problems:',
      '  Spring + block: SHM.',
      '  Pendulum + bullet (ballistic pendulum): inelastic collision then conservation.',
      '  Variable force F(x): integrate to find work.',
    ], vocabulary: [{ term: 'impulse-momentum theorem', definition: '∫F dt = Δp; impulse equals change in momentum.' }, { term: 'conservative force', definition: 'a force whose work is path-independent; has an associated potential energy U.' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'A 2 kg block rests on a horizontal surface. A horizontal force F(x) = 6x² N (x in metres) acts on it from x = 0 to x = 2 m. Find the work done and final speed (no friction).', steps: [
      'W = ∫₀² F(x) dx = ∫₀² 6x² dx = 2x³|₀² = 2(8) − 0 = 16 J.',
      'No friction → W = ΔKE = (1/2)mv²_f − 0.',
      '16 = (1/2)(2)v²_f → v²_f = 16 → v_f = 4 m/s.',
    ], answer: 'W = 16 J, v_f = 4 m/s', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A 0.1 kg ball moving at 10 m/s collides head-on with a wall and bounces back at 8 m/s. The collision lasts 0.02 s. Find the average force on the ball.', expectedAnswer: 'Δp = m(v_f − v_i) = 0.1(−8 − 10) = −1.8 kg·m/s (negative because direction reversed). Impulse J = Δp = ∫F dt = F_avg · Δt. F_avg = Δp/Δt = −1.8/0.02 = −90 N. (Negative = opposite to ball\'s initial motion. Magnitude 90 N.)', responseFormat: 'free', hints: ['Use impulse-momentum: F·Δt = Δp.', 'Be careful with signs (direction reversal).'], estimatedMinutes: 4 },
    { id: 'misconception-energy-vs-momentum', kind: 'misconception_check', question: 'A student uses energy conservation for a perfectly inelastic collision and gets a wrong answer. What\'s wrong?', commonErrors: [{ answer: 'Energy conservation in inelastic collision', misconception: 'Forgetting that KE is not conserved in inelastic collisions.', correctsTo: 'In INELASTIC collisions, kinetic energy is NOT conserved (some converts to heat, sound, deformation). MOMENTUM is always conserved (with no external forces). Always use MOMENTUM for collisions; you can compute energy LOST as KE_initial − KE_final, but never USE energy conservation across an inelastic event.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['W = ∫F·dx; W_net = ΔKE.', 'Conservative F: F = −dU/dx; KE + U conserved.', 'Impulse J = ∫F dt = Δp.', 'Momentum conserved in collisions; KE only in elastic.', 'CM equations: r_cm = Σm_i r_i / M.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
