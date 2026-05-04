/**
 * JEE Main Physics — Electrostatics.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_ELECTROSTATICS: LessonPlan = {
  id: 'evelyn.jee.phys.electrostatics.v1',
  title: 'JEE Physics — Electrostatics',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.electrostatics',
      description: 'Apply Coulomb\'s law, electric field, potential, Gauss\'s law, and capacitor formulas to JEE problems.',
      standard: 'JEE-MAIN-PHY-ELE',
    },
  ],
  prerequisites: ['jee.physics-strategy'],
  followUps: ['jee.phys.current-electricity'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Electrostatics is the gateway to all of electromagnetism — JEE drills it heavily.',
      script: 'Two charges, find the force. Or the field. Or the potential. Or the energy. The same Coulomb constant, the same r², four different quantities. Today we get the toolkit straight so any electrostatics question becomes a substitution.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-electrostatics',
      kind: 'concept',
      goal: 'Coulomb + field + potential + Gauss + capacitance.',
      keyIdeas: [
        'COULOMB\'S LAW: F = k·q₁q₂/r², k = 1/(4πε₀) = 9 × 10⁹ N·m²/C². Like charges repel, opposite attract.',
        'ELECTRIC FIELD: E = F/q (force per unit positive test charge). Point charge: E = kQ/r².',
        'SUPERPOSITION: total field = vector sum of contributions from each charge.',
        'POTENTIAL (scalar): V = kQ/r for point charge. Zero at infinity. Sum of potentials (no vectors).',
        'V → E: E = −dV/dr (negative gradient of potential).',
        'POTENTIAL ENERGY of pair: U = kq₁q₂/r. Negative for opposite charges (attractive bound).',
        'WORK done by field: W = q(V_initial − V_final). Positive when field accelerates charge to lower potential.',
        'GAUSS\'S LAW: ∮E·dA = Q_enc/ε₀. Use for symmetric charge distributions: spherical, cylindrical, planar.',
        'CAPACITOR: C = Q/V. Parallel plates: C = ε₀A/d. Energy stored: U = (1/2)CV² = (1/2)Q²/C = (1/2)QV.',
        'DIELECTRIC: inserting dielectric (constant κ) increases C by factor κ.',
        'CAPACITORS in PARALLEL: C_eq = C₁ + C₂. In SERIES: 1/C_eq = 1/C₁ + 1/C₂.',
      ],
      vocabulary: [
        { term: 'electric field', definition: 'force per unit positive charge; E = F/q. Vector quantity.' },
        { term: 'capacitance', definition: 'C = Q/V; charge stored per unit potential difference.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-charges',
      kind: 'worked_example',
      problem: 'Two point charges of +5 μC and +10 μC are placed 0.3 m apart. Find the force on each, and the work done bringing them together from infinity.',
      steps: [
        'Force: F = k·q₁q₂/r² = 9e9 · (5e−6)(10e−6) / (0.3)² = 9e9 · 5e−11 / 0.09 = 5 N. Repulsive (both positive).',
        'Both charges experience equal and opposite 5 N forces (Newton\'s 3rd law).',
        'Work to bring from infinity: W = U = kq₁q₂/r = 9e9 · 5e−11 / 0.3 = 1.5 J. Positive (you must DO positive work against repulsion).',
      ],
      answer: 'F = 5 N (repulsive); W = 1.5 J',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two capacitors of 4 μF and 6 μF are connected in series across a 50 V battery. Find the equivalent capacitance and the charge stored.',
      expectedAnswer: 'C_eq = 2.4 μF; Q = 120 μC',
      responseFormat: 'free',
      hints: [
        '1/C = 1/4 + 1/6 = 3/12 + 2/12 = 5/12 → C = 12/5 = 2.4 μF.',
        'Q = CV = 2.4e−6 · 50 = 1.2e−4 C = 120 μC.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-field-vs-potential',
      kind: 'misconception_check',
      question: 'A student says "if the electric field at a point is zero, the potential there is also zero." Correct?',
      commonErrors: [
        {
          answer: 'E = 0 implies V = 0',
          misconception: 'Equating zero field with zero potential.',
          correctsTo: 'Field and potential are independent quantities related by E = −dV/dr. E = 0 means V is CONSTANT at that point (flat region of V), not necessarily zero. Example: midpoint between two equal positive charges — by symmetry E = 0 but V = 2kq/r ≠ 0. Conversely, V = 0 doesn\'t mean E = 0: e.g. midpoint between equal opposite charges, V = 0 but E ≠ 0.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Coulomb F = kq₁q₂/r². k = 9e9.',
        'Field E = kQ/r² (vector). Potential V = kQ/r (scalar).',
        'E = −dV/dr.',
        'Capacitor C = Q/V. Parallel plates C = ε₀A/d. Energy = (1/2)CV².',
        'Series capacitors: reciprocals add. Parallel: capacitances add.',
        'Gauss\'s law for symmetric charge distributions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A capacitor of 10 μF is charged to 100 V then disconnected. A dielectric of κ = 4 is then inserted. Find the new voltage.',
      hint: 'Q is conserved (capacitor disconnected). C_new = κC_old = 40 μF. V_new = Q/C_new. Q = 10e−6 · 100 = 1e−3 C. V_new = 1e−3 / 40e−6 = 25 V. Voltage decreases by factor κ when dielectric is inserted on a disconnected capacitor.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
