/**
 * NEET Physics — Electrostatics.
 *
 * NCERT class 12 chapters 1-2. ~5-7 NEET questions per sitting.
 * Coulomb's law, electric field, potential, capacitance.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_PHYSICS_ELECTROSTATICS: LessonPlan = {
  id: 'evelyn.testprep.neet.physics.electrostatics.v1',
  title: 'NEET Physics — Electrostatics (Charges, Field, Potential, Capacitance)',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-physics',
  locale: 'en',
  los: [
    {
      id: 'neet.physics.electrostatics',
      description: 'Apply Coulomb\'s law, electric field and potential calculations, Gauss\'s law for symmetric charge distributions, and capacitor combinations to NEET-style problems.',
      standard: 'NEET-PHYS-ELEC',
    },
  ],
  prerequisites: ['neet.physics-mechanics'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Electrostatics opens the EM chapter sequence — and reuses every formula.',
      script: 'Electrostatics is where Class 12 physics begins, and every later chapter (current electricity, magnetism, EMI) builds on its concepts. Get the field-and-potential picture clear here and the rest of EM is mostly extending the same ideas to moving charges. NEET asks 5-7 questions per year here, mostly numerical.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-coulomb-field',
      kind: 'concept',
      goal: 'Coulomb\'s law, electric field, superposition.',
      keyIdeas: [
        'COULOMB\'S LAW: F = (1/4πε₀)·(q₁q₂/r²). k = 1/(4πε₀) ≈ 9×10⁹ N·m²/C². Force is along the line joining charges; like charges repel, opposite attract.',
        'PERMITTIVITY: ε₀ = 8.85×10⁻¹² C²/(N·m²) in vacuum. In a medium with dielectric constant K: ε = K·ε₀, force reduced by factor K.',
        'ELECTRIC FIELD: E = F/q (test charge q). UNITS: N/C or V/m. Force on charge q: F = qE.',
        'FIELD of a POINT CHARGE: E = (1/4πε₀)·(q/r²), radial outward (positive q) or inward (negative q).',
        'SUPERPOSITION: total field at a point is vector sum of fields from each source charge.',
        'FIELD LINES: tangent to E at every point. Density represents magnitude. From + to −. They never cross.',
        'DIPOLE: two equal-opposite charges separated by 2a. DIPOLE MOMENT p = q·(2a), pointing from − to +. ELECTRIC FIELD on axial point at distance r >> 2a: E = (1/4πε₀)·(2p/r³). On equatorial point: E = (1/4πε₀)·(p/r³), opposite to p.',
        'TORQUE on dipole in uniform E: τ = p × E (magnitude pE·sinθ).',
      ],
      vocabulary: [
        { term: 'permittivity', definition: 'a property of a medium describing how electric field is reduced; ε₀ for vacuum.' },
        { term: 'dipole moment', definition: 'p = q·d, vector from negative to positive charge with magnitude q·(separation).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-gauss-potential',
      kind: 'concept',
      goal: 'Gauss\'s law + electric potential.',
      keyIdeas: [
        'ELECTRIC FLUX: Φ = ∮ E·dA. For uniform E perpendicular to area A: Φ = EA. Units N·m²/C.',
        'GAUSS\'S LAW: Φ_total = q_enclosed / ε₀. Powerful for SYMMETRIC distributions: spherical, cylindrical, planar.',
        'GAUSS APPLICATIONS: (a) Point charge → recovers Coulomb. (b) Infinite line of charge: E = λ/(2πε₀r). (c) Infinite plane sheet: E = σ/(2ε₀) (independent of distance!). (d) Spherical shell: E = 0 inside, E = kQ/r² outside.',
        'CONDUCTORS: in electrostatic equilibrium, E = 0 inside, all charge on surface, E perpendicular to surface, E_surface = σ/ε₀.',
        'ELECTRIC POTENTIAL: V = W/q (work done per unit charge to bring from infinity). UNITS: volts (V) = J/C.',
        'V from POINT CHARGE: V = (1/4πε₀)·(q/r). V is scalar, can be added directly without vector treatment.',
        'POTENTIAL DIFFERENCE: V_A − V_B = −∫_A^B E·dl. Field points from HIGH to LOW potential.',
        'EQUIPOTENTIAL SURFACES: surfaces of constant V. E lines perpendicular to equipotentials.',
        'POTENTIAL ENERGY of two charges: U = (1/4πε₀)·(q₁q₂/r). Of a charge in field: U = qV.',
      ],
      vocabulary: [
        { term: 'Gauss\'s law', definition: '∮ E·dA = q_enclosed/ε₀; relates total flux out of a closed surface to enclosed charge.' },
        { term: 'electric potential', definition: 'V = W/q — work per unit charge to bring a positive test charge from infinity to a point.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-capacitance',
      kind: 'concept',
      goal: 'Capacitors: definition, combinations, energy.',
      keyIdeas: [
        'CAPACITANCE: C = Q/V. Units: farads (F) = C/V.',
        'PARALLEL PLATE CAPACITOR: C = ε₀·A/d (vacuum). With dielectric of constant K: C = K·ε₀·A/d.',
        'SERIES COMBINATION: 1/C_total = 1/C₁ + 1/C₂ + ... Charge same on each, voltages add.',
        'PARALLEL COMBINATION: C_total = C₁ + C₂ + ... Voltage same across each, charges add.',
        'ENERGY stored: U = ½CV² = ½(Q²/C) = ½QV.',
        'DIELECTRIC inserted while connected to battery: V constant, C ↑ by K, Q ↑ by K, U ↑ by K.',
        'DIELECTRIC inserted while disconnected (Q constant): C ↑ by K, V ↓ by K, U ↓ by K.',
        'MEMORIZE the CONNECTED vs DISCONNECTED contrast — NEET tests this directly.',
      ],
      vocabulary: [
        { term: 'capacitance', definition: 'C = Q/V; the charge a capacitor stores per unit voltage.' },
        { term: 'dielectric', definition: 'an insulating material that increases capacitance when placed between capacitor plates.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Three capacitors of 2 μF, 3 μF, and 6 μF are connected in series across a 12V battery. Find the total capacitance and the charge on each capacitor.',
      expectedAnswer: 'C_series = 1/(1/2 + 1/3 + 1/6) = 1/(3/6 + 2/6 + 1/6) = 1/1 = 1 μF. Q = C·V = 1·12 = 12 μC. Same charge on each capacitor in series. (Voltages: V₂ = 6V, V₃ = 4V, V₆ = 2V; sum to 12V.)',
      responseFormat: 'free',
      hints: [
        'Series: 1/C = sum of reciprocals.',
        'Q is the same for each capacitor in series.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-charge-conservation',
      kind: 'misconception_check',
      question: 'When a positive charge is placed near a neutral metal sphere, the sphere becomes positively charged because the negative electrons are attracted to the positive charge.',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing redistribution with net charge change.',
          correctsTo: 'False. The neutral sphere remains NEUTRAL overall — total charge is unchanged. What happens is INDUCTION: free electrons in the metal redistribute (gather on the side near the +charge), leaving the far side slightly +. The sphere has SEPARATED CHARGE within it, but the net charge is still zero. To actually charge the sphere requires grounding it (electrons flow in or out) or contact transfer. NEET often tests this distinction.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Coulomb F = kq₁q₂/r². E = F/q. V = W/q. U = qV.',
        'Gauss: Φ = q_enclosed/ε₀. Use for spherical, cylindrical, planar symmetry.',
        'Capacitor energy U = ½CV² = ½Q²/C = ½QV.',
        'Series 1/C_total = Σ1/Cᵢ; parallel C_total = ΣCᵢ.',
        'Dielectric while connected to battery: V same, C↑ by K. Disconnected: Q same, V↓ by K.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the electric field INSIDE a uniformly charged spherical shell zero, even though the field on the surface is large?',
      hint: 'Use Gauss\'s law with a Gaussian surface inside the shell. The enclosed charge is zero (all charge is on the outer shell), so the total flux through the inner Gaussian surface is zero. By symmetry, E must be the same magnitude at every point on the Gaussian surface. The only consistent solution: E = 0 everywhere inside. The exterior field still appears as if all charge were concentrated at the center — that\'s why orbits and capacitor calculations work.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
