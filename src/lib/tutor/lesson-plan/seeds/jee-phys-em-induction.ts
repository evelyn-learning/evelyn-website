/**
 * JEE Main Physics — Electromagnetic Induction.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_EM_INDUCTION: LessonPlan = {
  id: 'evelyn.jee.phys.em-induction.v1',
  title: 'JEE Physics — Electromagnetic Induction',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.em-induction',
      description: 'Apply Faraday\'s law, Lenz\'s law, motional EMF, and self/mutual inductance.',
      standard: 'JEE-MAIN-PHY-EMI',
    },
  ],
  prerequisites: ['jee.phys.magnetic-effects'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Faraday and Lenz are at the heart of electromagnetism — JEE loves rod-on-rails, rotating coils, and changing flux.',
      script: 'Move a magnet through a coil — current flows. Slide a rod along rails in a B-field — EMF appears. Both are electromagnetic induction. Faraday tells you the magnitude; Lenz tells you the direction.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-induction',
      kind: 'concept',
      goal: 'Faraday + Lenz + motional EMF + inductance + LR circuit.',
      keyIdeas: [
        'MAGNETIC FLUX: Φ = B·A·cos θ. SI unit weber (Wb).',
        'FARADAY\'S LAW: induced EMF ε = −dΦ/dt. Negative sign captures Lenz.',
        'LENZ\'S LAW: induced current opposes the change in flux that caused it. Conservation of energy.',
        'MOTIONAL EMF: rod of length L moving at speed v perpendicular to B → ε = BLv.',
        'COIL ROTATING in B field: ε = NABω·sin(ωt). Peak EMF = NABω.',
        'SELF-INDUCTANCE L: ε = −L·dI/dt. Solenoid inductance L = μ₀N²A/ℓ.',
        'MUTUAL INDUCTANCE M: ε₂ = −M·dI₁/dt for two coils.',
        'ENERGY in inductor: U = (1/2)·LI².',
        'LR CIRCUIT growth: I(t) = I₀·(1 − e^(−t/τ)) where τ = L/R. Decay: I(t) = I₀·e^(−t/τ).',
        'JEE TRAP: Lenz\'s direction depends on whether flux is INCREASING or DECREASING. Induced current creates B opposing the change; right-hand rule gives the current direction.',
      ],
      vocabulary: [
        { term: 'Faraday\'s law', definition: 'induced EMF equals negative time-rate-of-change of magnetic flux.' },
        { term: 'self-inductance', definition: 'a circuit\'s tendency to oppose changes in its own current; ε_self = −L·dI/dt.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rod',
      kind: 'worked_example',
      problem: 'A 0.4 m rod slides at 5 m/s perpendicular to a uniform 0.5 T magnetic field. Find the induced EMF and the current if the rod is connected through a 2 Ω resistor.',
      steps: [
        'EMF = BLv = 0.5 · 0.4 · 5 = 1 V.',
        'Current I = ε/R = 1/2 = 0.5 A.',
        'Force on the moving rod (opposing motion): F = BIL = 0.5 · 0.5 · 0.4 = 0.1 N. (External agent must push with this force to maintain constant velocity.)',
      ],
      answer: 'EMF = 1 V; I = 0.5 A',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A solenoid has inductance 0.05 H. The current changes from 2 A to 5 A in 0.1 s. Find the magnitude of the induced EMF.',
      expectedAnswer: '1.5 V',
      responseFormat: 'numeric',
      hints: [
        '|ε| = L·|dI/dt|.',
        '|dI/dt| = 3/0.1 = 30 A/s.',
        '0.05 · 30 = 1.5 V.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lenz',
      kind: 'misconception_check',
      question: 'A bar magnet is pushed N-pole-first into a coil. A student says the induced current produces a south pole on the side facing the magnet. Correct?',
      commonErrors: [
        {
          answer: 'Coil shows S pole facing the approaching N',
          misconception: 'Forgetting Lenz\'s law: the induced current\'s field must OPPOSE the increase in flux.',
          correctsTo: 'As N pole approaches, flux through the coil INCREASES (in the direction the magnet faces). Lenz\'s law says induced current opposes this. So the coil generates a field opposing the magnet\'s field at the near end → induced current creates a NORTH POLE facing the approaching N pole. The two N poles repel — making it harder to push the magnet in (consistent with energy conservation).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Φ = BA cos θ. ε = −dΦ/dt.',
        'Motional EMF: ε = BLv (perpendicular setup).',
        'Lenz: induced current opposes flux CHANGE.',
        'Solenoid L = μ₀N²A/ℓ. Inductor energy = (1/2)LI².',
        'LR transient: τ = L/R. Growth: 1 − e^(−t/τ).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A coil of 50 turns has area 0.01 m² and rotates at 50 Hz in a 0.2 T field. Find the peak EMF.',
      hint: 'ω = 2π·f = 100π rad/s. ε_peak = NABω = 50·0.01·0.2·100π = 100π·0.1 = 10π ≈ 31.4 V.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
