/**
 * AP Physics 2 — Electrostatics.
 *
 * Coulomb's law, electric field, electric potential, capacitance.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_ELECTROSTATICS: LessonPlan = {
  id: 'evelyn.ap.physics2.electrostatics.v1',
  title: 'Electrostatics: Coulomb, fields, potential',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.electrostatics',
      description: 'Apply Coulomb\'s law, electric field and potential, and capacitance.',
      standard: 'AP-PHYS2-EST',
    },
  ],
  prerequisites: ['phys.electric-charge'],
  followUps: ['apphys2.circuits'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame static electricity as the foundation for all of electronics.',
      script: 'A balloon rubbed on hair sticks to a wall — that\'s electrostatic force. Same fundamental principles run every chip in your phone. Understanding charges and fields is understanding the building block of modern technology.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Four key relationships: Coulomb, field, potential, capacitance.',
      keyIdeas: [
        'CHARGE: comes in elementary units. Electron: -e = -1.6 × 10⁻¹⁹ C. Same magnitude, positive: proton.',
        'COULOMB\'S LAW: F = k·q₁q₂/r². Like charges REPEL, opposite ATTRACT. k = 8.99 × 10⁹ N·m²/C².',
        'ELECTRIC FIELD: force per unit positive test charge. E = F/q. Field of a point charge: E = kq/r². Direction: AWAY from positive, TOWARD negative.',
        'ELECTRIC POTENTIAL (voltage): potential energy per unit charge. V = U/q. Point charge: V = kq/r. SCALAR (no direction).',
        'POTENTIAL ENERGY of two point charges: U = kq₁q₂/r.',
        'CAPACITANCE: C = Q/V. A capacitor stores charge Q at voltage V. Parallel plate: C = ε₀A/d.',
        'ENERGY in capacitor: U = (1/2)CV² = (1/2)QV.',
      ],
      vocabulary: [
        { term: 'electric field', definition: 'force per unit positive test charge at a point.' },
        { term: 'electric potential', definition: 'potential energy per unit charge; the "voltage" at a point.' },
        { term: 'capacitor', definition: 'a device that stores electric charge and energy.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-coulomb',
      kind: 'worked_example',
      problem: 'Two point charges: q₁ = +2 μC and q₂ = -3 μC, separated by 0.1 m. Find the force between them.',
      steps: [
        'F = k·|q₁||q₂|/r² = (8.99 × 10⁹)(2 × 10⁻⁶)(3 × 10⁻⁶)/(0.1)².',
        'Numerator: 8.99 × 10⁹ × 6 × 10⁻¹² = 53.94 × 10⁻³ ≈ 0.054.',
        'Denominator: 0.01.',
        'F = 5.4 N — attractive (opposite signs).',
      ],
      answer: '5.4 N attractive',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-capacitor',
      kind: 'worked_example',
      problem: 'A 5 μF capacitor is charged to 12 V. How much charge does it store, and what energy?',
      steps: [
        'Q = CV = 5 × 10⁻⁶ × 12 = 60 × 10⁻⁶ C = 60 μC.',
        'U = (1/2)CV² = (1/2)(5 × 10⁻⁶)(12²) = (1/2)(5 × 10⁻⁶)(144) = 360 × 10⁻⁶ J = 360 μJ.',
      ],
      answer: 'Q = 60 μC; U = 360 μJ',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two electrons are 1 mm apart. Do they ATTRACT or REPEL? With what force?',
      expectedAnswer: 'repel; F ≈ 2.3 × 10⁻²² N',
      responseFormat: 'free',
      hints: [
        'Both negative → repel.',
        'F = k·e²/r² = (8.99e9)(1.6e-19)²/(1e-3)² ≈ 2.3 × 10⁻²² N.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-field-vs-force',
      kind: 'misconception_check',
      question: 'Is the electric field at a point the same as the force on a charge there?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing field and force.',
          correctsTo: 'No — FIELD E exists even with no test charge. FORCE = qE — the force on a particular charge q in that field. Field is property of space; force is what a charge experiences.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Coulomb: F = kq₁q₂/r². Like repels, opposite attracts.',
        'Field: E = F/q. Of point charge: kq/r².',
        'Potential: V = kq/r. SCALAR.',
        'Capacitor: C = Q/V. Energy: (1/2)CV².',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does Coulomb\'s law have the SAME mathematical form (1/r²) as Newton\'s gravity?',
      hint: 'Both are inverse-square laws from sources radiating influence in 3D. Surface area of a sphere grows as r² → flux per unit area falls as 1/r². Same geometry both times.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
