/**
 * AP Physics 2 — Thermodynamics and Kinetic Theory.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS_2_THERMODYNAMICS: LessonPlan = {
  id: 'evelyn.ap.physics-2.thermodynamics.v1',
  title: 'AP Physics 2 — Thermodynamics, Heat, and Kinetic Theory',
  curriculum: 'AP',
  grade: '11',
  subject: 'science',
  topic: 'ap-physics-2',
  locale: 'en',
  los: [
    {
      id: 'ap.physics-2.thermo',
      description: 'Apply the first law of thermodynamics, kinetic theory of gases, and thermodynamic processes (isobaric, isochoric, isothermal, adiabatic) to solve AP-style problems.',
      standard: 'AP-PHYS-2-UNIT-3',
    },
  ],
  prerequisites: [],
  followUps: ['ap.physics-2.optics'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Thermodynamics is the physics of heat — and the first law tells you energy is conserved even when it changes form.',
      script: 'A gas in a piston expands when heated. Where does the energy go? Some becomes internal energy (faster molecules), some goes into work pushing the piston. The first law balances the books: ΔU = Q − W. Today: kinetic theory + the four canonical processes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-thermo',
      kind: 'concept',
      goal: 'Kinetic theory, internal energy, first law, four processes, PV diagrams.',
      keyIdeas: [
        'KINETIC THEORY: gas pressure comes from molecular collisions with container walls. Temperature is proportional to AVERAGE KINETIC ENERGY of molecules.',
        '  Average KE per molecule = (3/2) k_B T, where k_B = Boltzmann constant.',
        '  rms speed: v_rms = √(3k_B T / m).',
        'IDEAL GAS LAW: PV = nRT. Combines Boyle, Charles, Avogadro.',
        '  Used in nearly every AP P2 thermo problem.',
        'INTERNAL ENERGY (U): total kinetic energy of all molecules. For monatomic ideal gas: U = (3/2)nRT.',
        'FIRST LAW: ΔU = Q − W (sign convention varies — AP uses W = work done BY gas; some texts use W = work done ON gas).',
        '  Q > 0: heat added to system.',
        '  W > 0: gas does work (e.g. expansion).',
        '  ΔU > 0: internal energy / temperature increases.',
        'FOUR PROCESSES (memorise the constraint and the simplification):',
        '  ISOBARIC (constant P): W = PΔV.',
        '  ISOCHORIC / ISOVOLUMETRIC (constant V): W = 0. ΔU = Q.',
        '  ISOTHERMAL (constant T): ΔU = 0 (for ideal gas). Q = W.',
        '  ADIABATIC (no heat exchange, Q = 0): ΔU = -W.',
        'PV DIAGRAMS: visualise these processes as paths.',
        '  Area under the curve = work done by gas.',
        '  Cyclic process (returns to start): ΔU = 0 over the cycle.',
        '2ND LAW: heat flows from hot to cold spontaneously, never the reverse without external work. Entropy of an isolated system never decreases.',
        'HEAT ENGINES: convert heat to work. Efficiency = W / Q_h. Carnot (ideal) efficiency = 1 - T_c/T_h.',
      ],
      vocabulary: [
        { term: 'first law of thermodynamics', definition: 'energy conservation for thermodynamic systems: ΔU = Q − W.' },
        { term: 'adiabatic', definition: 'a process with no heat transfer; Q = 0; rapid expansions/compressions are approximately adiabatic.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: '0.5 mol of an ideal monatomic gas is at 300 K. The gas absorbs 1500 J of heat at constant volume. Find the new temperature.',
      steps: [
        'Constant volume → ISOCHORIC. W = 0.',
        'First law: ΔU = Q − W = Q (since W = 0). ΔU = 1500 J.',
        'For monatomic ideal gas: U = (3/2)nRT. So ΔU = (3/2)nRΔT.',
        'Solve: ΔT = 2ΔU / (3nR) = 2(1500) / (3 × 0.5 × 8.314) = 3000 / 12.47 ≈ 240.6 K.',
        'New temperature: 300 + 240.6 = 540.6 K.',
        'Sanity check: ΔU positive (heated), so T should rise. ✓',
      ],
      answer: 'T ≈ 540.6 K',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A gas expands isothermally. What is the change in internal energy?',
      expectedAnswer: 'ΔU = 0. Isothermal means constant temperature. For an ideal gas, internal energy depends only on temperature, so constant T means constant U. The first law gives Q = W: any heat added is fully converted to work output.',
      responseFormat: 'free',
      hints: [
        'Isothermal means... temperature does what?',
        'For ideal gas, U depends only on T.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sign-convention',
      kind: 'misconception_check',
      question: 'A student writes ΔU = Q + W on AP Physics 2 and gets a wrong sign. What\'s the AP convention?',
      commonErrors: [
        {
          answer: 'ΔU = Q + W',
          misconception: 'Using the chemistry / IB convention where W is work DONE ON the gas.',
          correctsTo: 'AP Physics 2 uses W = work done BY the gas, so the first law is ΔU = Q − W. Chemistry textbooks often use W = work done ON the gas, giving ΔU = Q + W. The two are equivalent if you keep your sign conventions consistent. ALWAYS write down which convention you\'re using at the start of a problem; mixing conventions mid-problem causes sign errors.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PV = nRT (ideal gas).',
        'First law: ΔU = Q − W (AP convention).',
        'Isobaric: W = PΔV. Isochoric: W = 0. Isothermal: ΔU = 0. Adiabatic: Q = 0.',
        'PV diagram: area under curve = work.',
        'Heat engines: efficiency = W/Q_h; Carnot ideal = 1 − T_c/T_h.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
