/**
 * MCAT Chem/Phys — Thermodynamics and Spontaneity.
 *
 * High-yield: Gibbs free energy, enthalpy, entropy, coupling reactions
 * (ATP hydrolysis), Hess's law, equilibrium relationships.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_CHEM_PHYS_THERMODYNAMICS: LessonPlan = {
  id: 'evelyn.testprep.mcat.chem-phys.thermodynamics.v1',
  title: 'MCAT Chem/Phys — Thermodynamics, Gibbs Free Energy, Coupling',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-chem-phys',
  locale: 'en',
  los: [
    {
      id: 'mcat.chem-phys.thermodynamics',
      description: 'Apply ΔG = ΔH − TΔS to predict spontaneity, use Hess\'s law to combine reactions, relate ΔG° to K via ΔG° = −RT ln K, and explain biological coupling via ATP hydrolysis.',
      standard: 'MCAT-CP-THERMO',
    },
  ],
  prerequisites: ['mcat.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Thermodynamics decides what biology can do.',
      script: 'Whether a reaction will run, in which direction, and by how much — all of biochemistry hinges on free energy. The MCAT tests Gibbs free energy in BOTH the Chem/Phys section (general thermo, electrochemistry) and Bio/Biochem (ATP coupling, metabolic pathway analysis). Master the sign rules, Hess\'s law, and reaction coupling once, and you\'ll never re-derive them mid-test.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws-state',
      kind: 'concept',
      goal: 'First and second laws + state functions.',
      keyIdeas: [
        'FIRST LAW: ΔU = q + w. Internal energy change = heat added + work done ON system. Sign convention varies in textbooks — MCAT uses w = −PΔV when work is done BY the system (gas expansion).',
        'SECOND LAW: total entropy of universe always increases for spontaneous processes. ΔS_total = ΔS_system + ΔS_surroundings ≥ 0.',
        'STATE FUNCTIONS (depend only on initial + final state, not path): U, H, S, G, T, P, V. PATH FUNCTIONS: q, w.',
        'ENTHALPY: H = U + PV. ΔH = q at constant pressure. EXOTHERMIC: ΔH < 0 (releases heat). ENDOTHERMIC: ΔH > 0 (absorbs heat).',
        'ENTROPY: S = measure of disorder/microstates. ΔS > 0 favors disorder. Common increases: gas formation, dissolution, temperature rise, larger molecules. Decreases: precipitation, polymerization, gas → liquid.',
        'STANDARD STATE: 1 atm, 298 K (25°C), 1 M solutions. Quantities marked with °.',
        'BOND ENERGIES: ΔH ≈ Σ(bonds broken) − Σ(bonds formed). BREAKING bonds REQUIRES energy (positive); FORMING releases (negative).',
      ],
      vocabulary: [
        { term: 'state function', definition: 'a property dependent only on the system\'s current state, not the path taken (e.g., U, H, S, G).' },
        { term: 'enthalpy', definition: 'H = U + PV; ΔH at constant pressure equals heat exchanged.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-gibbs-spontaneity',
      kind: 'concept',
      goal: 'Gibbs free energy + the spontaneity table.',
      keyIdeas: [
        'GIBBS FREE ENERGY: G = H − TS. ΔG = ΔH − TΔS at constant T,P.',
        'SPONTANEITY: ΔG < 0 → spontaneous (exergonic). ΔG > 0 → non-spontaneous (endergonic). ΔG = 0 → equilibrium.',
        'SPONTANEITY TABLE — by sign of ΔH and ΔS:',
        '  ΔH < 0, ΔS > 0: ALWAYS spontaneous (G always negative). E.g., combustion.',
        '  ΔH > 0, ΔS < 0: NEVER spontaneous (G always positive). E.g., ozone formation from O₂.',
        '  ΔH < 0, ΔS < 0: spontaneous at LOW T (TΔS small). E.g., freezing.',
        '  ΔH > 0, ΔS > 0: spontaneous at HIGH T (TΔS dominates). E.g., melting, dissolution of NH₄NO₃.',
        'ΔG° vs ΔG: ΔG° is at standard state. ΔG = ΔG° + RT ln Q (where Q is reaction quotient). At equilibrium, Q = K and ΔG = 0 → ΔG° = −RT ln K.',
        'ΔG° = −RT ln K: large K (favors products) → ΔG° large negative. K = 1 → ΔG° = 0. Small K → ΔG° positive.',
        'NOTE: ΔG° tells you about extent of reaction (equilibrium); ΔG tells you direction at any moment. Spontaneity ≠ fast — kinetics decides rate.',
      ],
      vocabulary: [
        { term: 'Gibbs free energy', definition: 'G = H − TS; ΔG < 0 indicates a spontaneous reaction at constant T,P.' },
        { term: 'exergonic', definition: 'a process with ΔG < 0; releases free energy and proceeds spontaneously.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-coupling-hess',
      kind: 'concept',
      goal: 'Hess\'s law + biological reaction coupling.',
      keyIdeas: [
        'HESS\'S LAW: ΔH (or ΔG, ΔS) of a multi-step reaction = sum of ΔH of each step. Allows combining reactions algebraically.',
        'TRICKS: REVERSE a reaction → flip the SIGN of ΔH/ΔG. MULTIPLY a reaction by a coefficient → multiply ΔH/ΔG by the same coefficient.',
        'STANDARD HEATS OF FORMATION (ΔH°f): ΔH for forming 1 mol of compound from its elements in standard states. Elements in their standard form have ΔH°f = 0. Reaction ΔH° = ΣΔH°f(products) − ΣΔH°f(reactants).',
        'BIOLOGICAL COUPLING: cells couple ENDERGONIC reactions (ΔG > 0) with EXERGONIC reactions (ΔG < 0) such that the SUM is exergonic. Most common driver: ATP hydrolysis.',
        'ATP HYDROLYSIS: ATP + H₂O → ADP + Pi. ΔG° ≈ −30.5 kJ/mol (cellular ΔG ≈ −50 kJ/mol because reactant/product ratios push it further). Exergonic enough to drive most coupled reactions.',
        'EXAMPLE COUPLING: Glucose + Pi → glucose-6-P (ΔG° = +13.8 kJ/mol, endergonic alone). Coupled with ATP hydrolysis (−30.5 kJ/mol) by hexokinase: net ΔG° = −16.7 kJ/mol → spontaneous.',
        'OTHER ENERGY CARRIERS: GTP (parallels ATP, used in protein synthesis + signaling), NADH/FADH₂ (electron carriers, oxidized in electron transport chain to drive ATP synthesis).',
      ],
      vocabulary: [
        { term: 'Hess\'s law', definition: 'overall ΔH (or ΔG) of a reaction is the sum of ΔH of any sequence of steps connecting reactants to products.' },
        { term: 'reaction coupling', definition: 'pairing an endergonic reaction with an exergonic one (often ATP hydrolysis) so the net process is spontaneous.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A reaction has ΔH = +50 kJ/mol and ΔS = +200 J/(mol·K). At what minimum temperature does the reaction become spontaneous?',
      expectedAnswer: '250 K (about −23°C). At the threshold of spontaneity, ΔG = 0 → ΔH = TΔS → T = ΔH/ΔS. Convert ΔS to kJ: 200 J = 0.200 kJ. T = 50/0.200 = 250 K. Above 250 K (i.e., warmer), the reaction is spontaneous; below, not.',
      responseFormat: 'numeric',
      hints: [
        'At threshold of spontaneity, ΔG = 0.',
        'Watch unit consistency: convert ΔS from J to kJ (or ΔH to J).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-spontaneity-rate',
      kind: 'misconception_check',
      question: 'A reaction with a large negative ΔG must proceed quickly. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Conflating thermodynamics (favorability) with kinetics (rate).',
          correctsTo: 'False. ΔG describes the THERMODYNAMIC favorability — whether the reaction CAN proceed spontaneously. RATE is a KINETIC question, governed by activation energy (Ea) and the Arrhenius equation, not ΔG. Famous example: diamond → graphite has ΔG < 0 (graphite is more stable), but the activation energy is so high that diamonds last for billions of years. Or hydrogen + oxygen → water: ΔG = −237 kJ/mol, yet a H₂/O₂ mixture can sit forever without reacting until ignited. MCAT exploits this confusion in passage-based questions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'ΔG = ΔH − TΔS. ΔG < 0 → spontaneous. State functions only depend on endpoints.',
        'Spontaneity table: ΔH−/ΔS+ always; ΔH+/ΔS− never; signs match → T-dependent.',
        'ΔG° = −RT ln K. Hess\'s law: sum reactions, sum ΔH/ΔG; reverse → flip sign.',
        'Biological coupling: ATP hydrolysis (−30.5 kJ/mol) drives endergonic steps.',
        'Spontaneous ≠ fast. Kinetics (Ea) sets rate independently.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Cellular ATP hydrolysis has a ΔG of about −50 kJ/mol, much more negative than the ΔG° = −30.5 kJ/mol. Why?',
      hint: 'ΔG = ΔG° + RT ln Q. Cellular concentrations are nowhere near standard 1 M. Typical cell: [ATP] ≈ 8 mM, [ADP] ≈ 1 mM, [Pi] ≈ 8 mM. Q = ([ADP][Pi])/([ATP]) = (0.001·0.008)/0.008 = 0.001. ΔG = ΔG° + RT ln(0.001) = −30.5 + (0.008314·310)·(−6.9) ≈ −30.5 − 17.8 ≈ −48 kJ/mol. The cell is held FAR from equilibrium — it has lots of ATP relative to ADP/Pi, which makes ATP hydrolysis MORE exergonic than at standard state. Cells maintain this disequilibrium by burning glucose continuously, which is why metabolic activity never stops in living tissue.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
