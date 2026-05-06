/**
 * College General Physics — Electricity and Magnetism Survey.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_GENPHYS_EM: LessonPlan = {
  id: 'evelyn.college.sci.genphys.em.v1',
  title: 'General Physics II — Electricity and Magnetism Survey',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'general-physics',
  locale: 'en',
  los: [
    {
      id: 'college.sci.genphys.em',
      description: 'Apply Coulomb\'s law, Gauss\'s law, Ohm\'s law, and the right-hand rule to standard E&M problems.',
      standard: 'COLLEGE-GENPHYS',
    },
  ],
  prerequisites: ['college.sci.genphys.mechanics'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'E&M is the second half of intro physics — and it\'s where the math (vectors, integrals) gets serious.',
      script: 'Charges create electric fields. Moving charges create magnetic fields. Changing magnetic fields create electric fields. These three rules — embodied in Maxwell\'s equations — describe everything from circuits to light. Today: the workhorse formulas you\'ll use most.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-em',
      kind: 'concept',
      goal: 'Coulomb, E-field, Gauss, V, circuits (Ohm/Kirchhoff), magnetic force, induction.',
      keyIdeas: [
        'COULOMB\'S LAW: F = kq₁q₂/r², where k = 8.99 × 10⁹ N·m²/C². Inverse-square attractive (opposite signs) or repulsive (same signs).',
        'ELECTRIC FIELD E = F/q (force per unit charge). For a point charge: E = kQ/r², direction along line from source.',
        'GAUSS\'S LAW: ∮ E · dA = Q_enc / ε₀. Use for high-symmetry problems (sphere, cylinder, plane). Pick a Gaussian surface where E is constant or perpendicular to the surface.',
        'POTENTIAL: V = kQ/r for a point charge (with V = 0 at infinity). Energy: U = qV. ΔV = −∫E·dl.',
        'CAPACITORS: C = Q/V. Stored energy U = (1/2)CV² = Q²/(2C). Series: 1/C_eq = Σ 1/C_i. Parallel: C_eq = ΣC_i.',
        'OHM\'S LAW: V = IR. POWER: P = IV = I²R = V²/R.',
        'KIRCHHOFF\'S LAWS:',
        '  Junction (current): Σ I_in = Σ I_out.',
        '  Loop (voltage): Σ ΔV around any closed loop = 0.',
        'MAGNETIC FORCE on a moving charge: F = qv × B (cross product → use right-hand rule for direction). Magnitude qvB sinθ.',
        'MAGNETIC FORCE on current-carrying wire: F = I L × B.',
        'AMPERE\'S LAW: ∮ B · dl = μ₀ I_enc (high-symmetry analog of Gauss for magnetic fields).',
        'FARADAY\'S LAW (induction): EMF = −dΦ_B/dt, where Φ_B = ∫B·dA. Changing flux induces an EMF; sign from Lenz\'s law (opposes change).',
      ],
      vocabulary: [
        { term: 'right-hand rule', definition: 'a mnemonic for cross-product direction; in qv × B, fingers point along v, curl toward B, thumb gives F direction (for positive charge).' },
        { term: 'Lenz\'s law', definition: 'induced EMF opposes the change in flux that caused it; the negative sign in Faraday\'s law.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A 5 Ω resistor and a 10 Ω resistor are in parallel; the combination is in series with a 3 Ω resistor and a 12 V battery. Find total current and voltage across the parallel pair.',
      steps: [
        'Parallel combo: 1/R_p = 1/5 + 1/10 = 2/10 + 1/10 = 3/10. R_p = 10/3 ≈ 3.33 Ω.',
        'Series total: R_total = 3 + 3.33 = 6.33 Ω.',
        'Current from battery: I = V / R_total = 12 / 6.33 ≈ 1.90 A.',
        'Voltage across parallel pair: V_p = I × R_p = 1.90 × 3.33 ≈ 6.31 V.',
        'Sanity check: V_3Ω = 1.90 × 3 = 5.69 V. Total = 5.69 + 6.31 = 12 V ✓.',
      ],
      answer: 'I ≈ 1.90 A; V_parallel ≈ 6.31 V.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A proton moves east at 2 × 10⁵ m/s through a 0.5 T magnetic field pointing north. Find magnitude and direction of the magnetic force.',
      expectedAnswer: 'F = qvB sinθ = (1.6 × 10⁻¹⁹)(2 × 10⁵)(0.5) sin90° = 1.6 × 10⁻¹⁴ N. Direction: right-hand rule. Fingers east (v), curl toward north (B), thumb points UP. Force is UPWARD.',
      responseFormat: 'free',
      hints: [
        'Magnitude: F = qvB sinθ. v ⊥ B here, so sinθ = 1.',
        'Direction: right-hand rule for v × B.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-charge-direction',
      kind: 'misconception_check',
      question: 'A student applies the right-hand rule for an electron and gets the same direction as for a proton. What did they miss?',
      commonErrors: [
        {
          answer: 'Right-hand rule the same regardless of charge sign',
          misconception: 'Forgetting that F = qv × B includes the SIGN of q.',
          correctsTo: 'For NEGATIVE charges, the force is OPPOSITE to v × B. Right-hand rule gives the direction for positive charges; flip it for electrons. Or use the LEFT hand for electrons. Always check the sign of q before reporting direction.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Coulomb\'s law (1/r² force), E = kQ/r², Gauss for symmetry.',
        'V = IR; series adds R; parallel adds 1/R.',
        'Magnetic force qv × B; right-hand rule (flip for electrons).',
        'Faraday: EMF = −dΦ/dt; Lenz: opposes change.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
