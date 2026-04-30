/**
 * AP Physics 2 — Magnetism and induction.
 *
 * Magnetic fields, force on moving charges, current loops,
 * electromagnetic induction (Faraday's law).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_MAGNETISM: LessonPlan = {
  id: 'evelyn.ap.physics2.magnetism.v1',
  title: 'Magnetism: forces, fields, induction',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.magnetism',
      description: 'Apply right-hand rule, force on moving charges, and Faraday\'s law.',
      standard: 'AP-PHYS2-MAG',
    },
  ],
  prerequisites: ['apphys2.electrostatics'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Magnetism + electricity = the foundation of modern tech.',
      script: 'Move a magnet through a coil → ELECTRICITY appears. Run current through a wire → it MOVES near a magnet. Generators, motors, transformers — all rely on this electricity-magnetism dance discovered in the 1800s.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Force law + right-hand rule + induction.',
      keyIdeas: [
        'MAGNETIC FIELD B: measured in tesla (T). Earth\'s field ~5×10⁻⁵ T. Strong magnet ~1 T. MRI ~3 T.',
        'FORCE on moving charge: F = qv × B. Magnitude: F = qvB sin θ. Direction: RIGHT-HAND RULE.',
        'Right-hand rule for positive charge: point fingers in v direction, curl toward B; thumb points in F direction. (Reverse for negative charge.)',
        'Force is PERPENDICULAR to both v and B → does NO work on the charge. Only changes direction, not speed.',
        'CIRCULAR MOTION: a charged particle entering a magnetic field perpendicular to v moves in a circle. Radius r = mv/(qB).',
        'WIRE in field: F = BIL sin θ. Current I, length L. Used in motors.',
        'CURRENT LOOP creates a magnetic field — like a small bar magnet. Coil it many times → ELECTROMAGNET.',
        'FARADAY\'S LAW: changing magnetic flux INDUCES an EMF (voltage). EMF = −dΦ/dt where Φ = B·A·cos θ.',
        'LENZ\'S LAW: the induced current OPPOSES the change in flux. The minus sign in Faraday\'s law.',
        'GENERATOR: rotating coil in magnetic field → changing flux → induced EMF → AC electricity.',
      ],
      vocabulary: [
        { term: 'magnetic field', definition: 'a vector field that exerts force on moving charges and magnets.' },
        { term: 'electromagnetic induction', definition: 'creating an EMF by changing magnetic flux.' },
        { term: 'flux', definition: 'the amount of magnetic field passing through an area: Φ = BA cos θ.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-circle',
      kind: 'worked_example',
      problem: 'A proton (m = 1.67×10⁻²⁷ kg) moves at 10⁵ m/s perpendicular to a 0.5 T magnetic field. Find the radius of its circular path.',
      steps: [
        'r = mv/(qB).',
        'q = +e = 1.6×10⁻¹⁹ C.',
        'r = (1.67×10⁻²⁷)(10⁵) / [(1.6×10⁻¹⁹)(0.5)].',
        'Numerator: 1.67×10⁻²² kg·m/s.',
        'Denominator: 8×10⁻²⁰.',
        'r = 1.67/8 × 10⁻² = 0.0021 m = 2.1 mm.',
        'Tiny circle! Higher mass or speed → bigger circle. Higher field or charge → smaller.',
      ],
      answer: '~2.1 mm',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A magnet is pushed INTO a coil. By Lenz\'s law, the induced current opposes the change. What does that mean for the magnet?',
      expectedAnswer: 'the induced current creates a magnetic field that REPELS the incoming magnet — pushes back',
      responseFormat: 'free',
      hints: [
        'Induced current flows so as to oppose the change.',
        'Magnet pushed in → flux increases → opposing field pushes magnet back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-magnet-energy',
      kind: 'misconception_check',
      question: 'Does a magnet do work on a moving charge that enters its field?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating magnetic force as energy-providing.',
          correctsTo: 'No — magnetic force is ALWAYS perpendicular to velocity. Perpendicular force does NO work. Speed (and kinetic energy) of the particle stays the same. Only direction changes. (Generators do work, but via the COIL\'s motion through the field, not direct magnet → charge.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F = qv × B; direction by right-hand rule.',
        'Magnetic force perpendicular to v → does no work.',
        'Charged particles in B-field move in circles: r = mv/(qB).',
        'Faraday: changing flux induces EMF.',
        'Lenz: induced current opposes the change.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does an MRI use these principles to image the body?',
      hint: 'Strong magnetic field aligns proton spins in body water. Radio pulses flip them; as they relax, they emit signals. Different tissues relax at different rates → image. The "magnetic resonance" is the resonant flipping at specific frequencies.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
