/**
 * JEE — Thermodynamics (high-yield JEE topic, both physics and chemistry overlap).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_THERMODYNAMICS: LessonPlan = {
  id: 'evelyn.jee.thermodynamics.v1',
  title: 'JEE Thermodynamics',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'jee.thermodynamics',
      description: 'Apply first and second laws of thermodynamics to JEE-style problems: PV diagrams, work, heat, entropy, and the four canonical processes.',
      standard: 'JEE-PHY-THERMO',
    },
  ],
  prerequisites: ['jee.physics-strategy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Thermodynamics straddles JEE physics and chemistry.',
      script: 'JEE thermodynamics is unusual — it appears in BOTH physics and chemistry sections. Physics tests the macroscopic side: PV diagrams, work, heat, ideal-gas processes. Chemistry tests the molecular side: enthalpy, entropy, free energy, equilibrium. Master one and you\'ve already done half the work for the other. Sign conventions are the #1 source of errors — get them right and most problems fall.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'First law, processes, second law + entropy.',
      keyIdeas: [
        'FIRST LAW: ΔU = Q − W (physics convention) OR ΔU = Q + W (chemistry convention). Q = heat added TO system; W = work done BY system (physics) or ON system (chemistry). Sign confusion is the top JEE error here — pick a convention and STICK TO IT.',
        'INTERNAL ENERGY U: depends only on temperature for an ideal gas. ΔU = n·Cv·ΔT regardless of process.',
        'ENTHALPY H = U + PV. ΔH = ΔU + Δ(PV). For ideal gas: ΔH = n·Cp·ΔT. Cp − Cv = R.',
        'FOUR CANONICAL PROCESSES: (1) ISOBARIC (constant P): W = P·ΔV. (2) ISOCHORIC (constant V): W = 0. (3) ISOTHERMAL (constant T, ideal gas): ΔU = 0, so Q = W = nRT·ln(V_f/V_i). (4) ADIABATIC (Q = 0): ΔU = −W. PV^γ = constant.',
        'γ = Cp/Cv. For monatomic ideal gas γ = 5/3; for diatomic γ = 7/5.',
        'PV DIAGRAM: work = AREA under the curve. Cyclic process: net work = enclosed area. Clockwise = positive net work (heat engine). Counterclockwise = negative (refrigerator).',
        'SECOND LAW: entropy of an isolated system never decreases. ΔS_universe ≥ 0. For reversible process: ΔS = Q_rev / T.',
        'ENTROPY for ideal gas: ΔS = n·Cv·ln(T_f/T_i) + n·R·ln(V_f/V_i) — both terms.',
        'CARNOT EFFICIENCY: η = 1 − T_cold/T_hot (in Kelvin). Maximum possible efficiency between two reservoirs.',
        'GIBBS FREE ENERGY G = H − TS. Spontaneity: ΔG < 0 spontaneous; ΔG = 0 equilibrium; ΔG > 0 non-spontaneous.',
      ],
      vocabulary: [
        { term: 'adiabatic', definition: 'a process with no heat exchange (Q = 0).' },
        { term: 'entropy', definition: 'a measure of energy dispersal / number of microstates; never decreases for an isolated system.' },
        { term: 'Carnot efficiency', definition: 'the maximum theoretical efficiency of a heat engine: 1 − T_c/T_h.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-isothermal',
      kind: 'worked_example',
      problem: '2 mol of an ideal gas expands isothermally and reversibly at 300 K from 1 L to 2 L. Find Q, W, and ΔU. (R = 8.314 J/mol·K)',
      steps: [
        'ISOTHERMAL: T constant. For ideal gas, ΔU = n·Cv·ΔT = 0.',
        'WORK done BY gas: W = nRT ln(V_f/V_i) = 2 · 8.314 · 300 · ln(2) = 4988.4 · 0.693 ≈ 3457 J.',
        'FIRST LAW: ΔU = Q − W → 0 = Q − 3457 → Q = 3457 J.',
        'INTERPRETATION: heat absorbed by system equals work done by it. All thermal energy in goes to expansion work; no energy retained because T didn\'t change.',
        'ENTROPY change: ΔS = Q_rev / T = 3457 / 300 ≈ 11.5 J/K. Or directly: ΔS = nR·ln(V_f/V_i) = 2 · 8.314 · 0.693 ≈ 11.5 J/K. ✓',
      ],
      answer: 'Q = +3457 J, W = +3457 J, ΔU = 0. ΔS = +11.5 J/K.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A heat engine operates between 600 K and 300 K. What is its maximum (Carnot) efficiency?',
      expectedAnswer: '50% or 0.5',
      responseFormat: 'free',
      hints: [
        'η_max = 1 − T_c/T_h.',
        '1 − 300/600.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-isothermal-work',
      kind: 'misconception_check',
      question: 'In an isothermal expansion, the gas does work but ΔU = 0. Where does the energy for the work come from?',
      commonErrors: [
        {
          answer: 'from the gas\'s internal energy',
          misconception: 'Treating isothermal expansion as energy depletion of the gas.',
          correctsTo: 'From the surroundings — heat flows IN to keep temperature constant. The first law gives Q = W (since ΔU = 0). Without heat input, the gas would cool as it expanded (adiabatic). Isothermal expansion is only possible with a thermal reservoir actively supplying heat. The energy chain: reservoir → gas (as Q) → surroundings (as W). Internal energy is unchanged because temperature is unchanged.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'First law: ΔU = Q − W (physics) or Q + W (chem). Pick + stick.',
        'Isobaric: W = PΔV. Isochoric: W = 0. Isothermal (ideal): ΔU = 0, Q = W = nRT ln(V_f/V_i). Adiabatic: Q = 0, PV^γ const.',
        'Cp − Cv = R. γ = Cp/Cv (5/3 monatomic, 7/5 diatomic).',
        'Carnot η = 1 − T_c/T_h. ΔG = ΔH − TΔS controls spontaneity.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the second law of thermodynamics often stated as "entropy of the universe increases" rather than just "entropy of the system increases"?',
      hint: 'For a closed isolated SYSTEM, entropy increases. But many real processes involve the system AND its surroundings. A refrigerator decreases entropy of its interior; entropy of the kitchen increases. Total entropy of universe (system + surroundings) always increases. The "system only" version misses cases where ordered states form locally — life, crystallization — by exporting disorder elsewhere.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
