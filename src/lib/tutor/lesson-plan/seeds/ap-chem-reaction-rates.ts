/**
 * AP Chemistry — Reaction rates and rate laws.
 *
 * What controls how fast a reaction goes: concentration, temperature,
 * catalysts. Rate law derivation from initial-rates data.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CHEM_REACTION_RATES: LessonPlan = {
  id: 'evelyn.ap.chem.reaction-rates.v1',
  title: 'Reaction rates and rate laws',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'apchem.kinetics-rate',
      description: 'Determine rate laws from experimental data and explain factors that affect reaction rates.',
      standard: 'AP-CHEM-TRA-3',
    },
  ],
  prerequisites: ['apchem.stoichiometry'],
  followUps: ['apchem.equilibrium'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Compare two reactions of vastly different speeds.',
      script: 'Iron rusts in months. Hydrogen burns in milliseconds. Both are oxidations. Why so different? Reaction RATES — driven by concentration, temperature, surface area, and catalysts.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rate-and-law',
      kind: 'concept',
      goal: 'Define rate, identify factors, and write rate laws.',
      keyIdeas: [
        'RATE = change in concentration over time. Units: M/s (mol/L per second). Always positive — for reactants, rate = −Δ[A]/Δt (the negative makes it positive since [A] decreases).',
        'RATE LAW: Rate = k[A]^m[B]^n where k is the rate constant, [A] and [B] are reactant concentrations, m and n are the ORDERS w.r.t. each reactant.',
        'ORDER must be determined EXPERIMENTALLY (NOT from stoichiometric coefficients).',
        'OVERALL ORDER = m + n.',
        'To find orders from initial-rates data: hold all but one concentration constant, see how rate scales with the changing one. Doubling [A] doubles rate → 1st order in A. Doubling [A] quadruples rate → 2nd order.',
        'FACTORS AFFECTING RATE: 1) Concentration (more = faster). 2) Temperature (higher = faster — particles collide harder and more often). 3) Catalyst (lowers activation energy, faster, not consumed). 4) Surface area (powders react faster than chunks).',
        'ARRHENIUS: k = A·exp(−Ea/RT). Higher T or lower Ea → bigger k → faster rate.',
      ],
      vocabulary: [
        { term: 'rate constant (k)', definition: 'a temperature-dependent constant linking concentrations to rate.' },
        { term: 'order of reaction', definition: 'the exponent on a reactant in the rate law (must be measured).' },
        { term: 'activation energy (Ea)', definition: 'the minimum energy a collision needs to react.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rate-law',
      kind: 'worked_example',
      problem: 'For A + B → products, three experiments give: (1) [A]=0.1, [B]=0.1, rate=2. (2) [A]=0.2, [B]=0.1, rate=8. (3) [A]=0.1, [B]=0.2, rate=4. Find the rate law.',
      steps: [
        'Compare exps 1 & 2: [A] doubled, [B] same. Rate went 2 → 8 = 4×. So 2^m = 4 → m = 2. Second order in A.',
        'Compare exps 1 & 3: [A] same, [B] doubled. Rate went 2 → 4 = 2×. So 2^n = 2 → n = 1. First order in B.',
        'Rate law: Rate = k[A]²[B]. Overall third order.',
        'Solve for k using exp 1: 2 = k(0.1)²(0.1) = k(0.001). So k = 2000 M⁻²·s⁻¹.',
      ],
      answer: 'Rate = 2000 [A]² [B], M⁻²·s⁻¹',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'When [A] is doubled, the rate triples. What is the order with respect to A?',
      expectedAnswer: 'log₂(3) ≈ 1.58 (non-integer; or "between 1st and 2nd order")',
      responseFormat: 'free',
      hints: [
        '2^m = 3 means m = log₂(3).',
        'Most rate laws have integer orders (0, 1, 2). Non-integer can happen in complex mechanisms.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-stoichiometry',
      kind: 'misconception_check',
      question: 'For 2A + B → C, can you read the rate law as Rate = k[A]²[B] from the equation?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating coefficients as orders.',
          correctsTo: 'No — rate law orders must be determined EXPERIMENTALLY. The stoichiometric coefficients only set the order if the reaction is a single elementary step. Most reactions go through multiple steps, and the slowest step (rate-determining) controls the law.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rate = k[A]^m[B]^n; orders m, n must be measured.',
        'Determine orders by varying one concentration at a time.',
        'Factors affecting rate: concentration, temperature, catalyst, surface area.',
        'Higher T or lower Ea → larger k → faster reaction.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does a CATALYST speed up a reaction without being consumed?',
      hint: 'Catalysts provide an alternative pathway with LOWER activation energy. More collisions have enough energy to react. The catalyst regenerates at the end, so it isn\'t used up.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
