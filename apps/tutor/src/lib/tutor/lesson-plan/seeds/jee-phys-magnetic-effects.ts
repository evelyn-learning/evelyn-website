/**
 * JEE Main Physics — Magnetic Effects of Current.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_MAGNETIC_EFFECTS: LessonPlan = {
  id: 'evelyn.jee.phys.magnetic-effects.v1',
  title: 'JEE Physics — Magnetic Effects of Current',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.magnetic-effects',
      description: 'Apply Biot-Savart law, Ampère\'s law, force on current-carrying conductors, and magnetic moments.',
      standard: 'JEE-MAIN-PHY-MAG',
    },
  ],
  prerequisites: ['jee.phys.current-electricity'],
  followUps: ['jee.phys.em-induction'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Magnetic effects link current and force — JEE drills B fields of standard configurations and the F = BIL law.',
      script: 'A long straight wire creates a B field of μ₀I/(2πr). A loop creates μ₀I/(2R) at its centre. A solenoid creates μ₀nI inside. Three formulas, plus Ampère\'s law for symmetric cases, plus F = BIL for force on a wire. That\'s the bulk of JEE Main magnetism.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-magnetism',
      kind: 'concept',
      goal: 'B-field formulas + force on wire + force on charge + torque on loop.',
      keyIdeas: [
        'BIOT-SAVART: dB = (μ₀/4π)·I·dL × r̂/r². Standard configurations memorised.',
        'STRAIGHT WIRE (long): B = μ₀I/(2πr). Field lines circle the wire (right-hand rule).',
        'CIRCULAR LOOP: at centre, B = μ₀I/(2R). On axis: B = μ₀IR²/[2(R² + x²)^(3/2)].',
        'SOLENOID: B = μ₀nI inside (n = turns per unit length). Approximately uniform; zero outside.',
        'TOROID: B = μ₀NI/(2πr) inside (N = total turns).',
        'AMPÈRE\'S LAW: ∮B·dL = μ₀I_enc. Use for symmetric currents (long wire, solenoid, toroid).',
        'FORCE ON CURRENT-CARRYING WIRE: F = BIL·sin θ, where θ is angle between B and L. F = IL × B (vector).',
        'FORCE ON MOVING CHARGE (Lorentz): F = qv × B. Magnitude qvB·sin θ. Perpendicular to v → circular motion if B uniform.',
        'CIRCULAR MOTION RADIUS: r = mv/(qB). Period T = 2πm/(qB) — independent of speed (cyclotron frequency).',
        'TORQUE on a current loop: τ = NIA × B. Magnitude τ = NIAB·sin θ. Magnetic moment m = NIA.',
      ],
      vocabulary: [
        { term: 'Ampère\'s law', definition: '∮B·dL = μ₀·I_enc; relates the line integral of B around a closed loop to enclosed current.' },
        { term: 'magnetic moment', definition: 'm = NIA for a current loop; vector quantity perpendicular to the loop.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-charge-circular',
      kind: 'worked_example',
      problem: 'A proton (mass 1.67 × 10⁻²⁷ kg, charge 1.6 × 10⁻¹⁹ C) moves perpendicular to a 0.5 T magnetic field at 1 × 10⁵ m/s. Find the radius of the circular path.',
      steps: [
        'Magnetic force provides centripetal: qvB = mv²/r → r = mv/(qB).',
        'r = (1.67e−27 · 1e5) / (1.6e−19 · 0.5) = 1.67e−22 / 8e−20 = 2.09e−3 m ≈ 2.1 mm.',
      ],
      answer: 'r ≈ 2.1 mm',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 50 cm wire carries current 4 A in a magnetic field of 0.2 T perpendicular to it. Find the force on the wire.',
      expectedAnswer: '0.4 N',
      responseFormat: 'numeric',
      hints: [
        'F = BIL·sin 90° = BIL.',
        '0.2 · 4 · 0.5 = 0.4 N.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-charge-rest',
      kind: 'misconception_check',
      question: 'A stationary positive charge sits in a uniform magnetic field. A student says the magnetic force on it is qB. What\'s wrong?',
      commonErrors: [
        {
          answer: 'F = qB',
          misconception: 'Forgetting that magnetic force depends on charge\'s VELOCITY.',
          correctsTo: 'Lorentz force F = qv × B. If v = 0, then F = 0. A stationary charge experiences NO magnetic force regardless of B-strength. Only ELECTRIC fields exert force on a stationary charge. Once moving, magnetic force kicks in: F = qvB·sin θ.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Long wire: B = μ₀I/(2πr).',
        'Loop centre: B = μ₀I/(2R). Solenoid: B = μ₀nI.',
        'Force on wire: F = BIL sin θ.',
        'Lorentz: F = qv × B. Circular radius r = mv/(qB).',
        'Magnetic moment m = NIA. Torque τ = NIAB sin θ.',
        'Stationary charge: zero magnetic force.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A solenoid has 1000 turns over 50 cm length and carries 2 A. Find the magnetic field inside.',
      hint: 'n = 1000/0.5 = 2000 turns/m. B = μ₀·n·I = (4π × 10⁻⁷)·2000·2 = 16π × 10⁻⁴ ≈ 5 × 10⁻³ T = 5 mT.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
