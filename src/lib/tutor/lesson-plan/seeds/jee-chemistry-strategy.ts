/**
 * JEE — Chemistry subject-specific strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_CHEMISTRY_STRATEGY: LessonPlan = {
  id: 'evelyn.jee.chemistry.strategy.v1',
  title: 'JEE Chemistry strategy',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'jee.chemistry-strategy',
      description: 'Apply subject-specific strategy to JEE Chemistry: balance physical, organic, inorganic; use NCERT thoroughly; high-yield reactions; common traps.',
      standard: 'JEE-CHEM',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Chemistry is the highest-yield-per-effort JEE subject.',
      script: 'JEE Chemistry has three sub-areas: PHYSICAL (calculation-heavy), ORGANIC (mechanism + memorization), and INORGANIC (mostly memorization). Unlike physics or math, much of chemistry is about RECALL — properties, trends, named reactions. NCERT is famously enough for inorganic. Master the three sub-areas separately and you can build chemistry into your highest-scoring section, freeing time for the harder math and physics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Three sub-areas, NCERT primacy, common pitfalls.',
      keyIdeas: [
        'PHYSICAL CHEMISTRY: thermodynamics, equilibrium, kinetics, electrochemistry, atomic structure, bonding, gas laws, solutions, surface chemistry. Calculation-heavy. Rules + formulas.',
        'ORGANIC CHEMISTRY: nomenclature, isomerism, mechanisms (SN1, SN2, E1, E2, electrophilic addition, electrophilic substitution), named reactions, biomolecules. Mechanism-based reasoning beats memorization.',
        'INORGANIC CHEMISTRY: periodic trends, p-block / d-block / f-block elements and their compounds, coordination chemistry, qualitative analysis. Mostly memorization.',
        'NCERT IS MANDATORY for chemistry. Almost every inorganic question has its answer in NCERT. Read NCERT 11 and 12 cover-to-cover, multiple times.',
        'REACTIONS to memorize: in Inorganic, every important reaction in NCERT must be at instant recall. In Organic, focus on mechanisms + reagents that yield specific products. Practice with actual organic reaction maps.',
        'STRATEGY ORDER ON EXAM DAY: chemistry first (often the fastest section). Many questions are 30-second recall.',
        'COMMON TRAPS in physical: sign conventions in thermodynamics (system vs surroundings), confusing K_c vs K_p, inconsistent units in gas-law problems.',
        'COMMON TRAPS in organic: stereochemistry (R/S, E/Z), markovnikov vs anti-markovnikov addition, Saytzeff vs Hofmann elimination products.',
        'COMMON TRAPS in inorganic: thermal decomposition products (carbonates → oxide + CO₂; nitrates depend on metal), color of compounds (mostly transition metal complex), oxidation states (especially of f-block).',
        'BOOKS: NCERT (mandatory), J.D. Lee for Inorganic, Morrison & Boyd or LG Wade for Organic, OP Tandon for Physical. Start with NCERT; supplement only if you have time.',
      ],
      vocabulary: [
        { term: 'Markovnikov\'s rule', definition: 'in HX addition to alkenes, H goes to the carbon with more H\'s (giving more stable carbocation).' },
        { term: 'Saytzeff product', definition: 'in elimination, the more substituted (more stable) alkene predominates.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-stoichiometry',
      kind: 'worked_example',
      problem: '4 g of NaOH (M = 40) is dissolved in water to make 500 mL solution. Find the molarity.',
      steps: [
        'Moles of NaOH = mass / M = 4 / 40 = 0.1 mol.',
        'Volume = 500 mL = 0.5 L.',
        'Molarity = moles / volume = 0.1 / 0.5 = 0.2 M.',
        'CHECK: typical lab solutions are 0.1-1 M. 0.2 M is reasonable. ✓',
        'KEY: chemistry numerical questions reward speed. Internalize unit conversions to avoid time loss.',
      ],
      answer: '0.2 M',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In an SN2 reaction, what determines whether the product is racemized or has clean inversion of configuration?',
      expectedAnswer: 'SN2 always gives INVERSION of configuration (Walden inversion) because the nucleophile attacks from the back side opposite the leaving group. There is NO racemization in pure SN2 — that\'s a feature of SN1, where a planar carbocation intermediate allows attack from either face. If you see racemization, suspect SN1 or a mixed mechanism.',
      responseFormat: 'free',
      hints: [
        'SN2 is concerted (one step). What does that mean for stereochemistry?',
        'Compare to SN1 (carbocation intermediate).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-organic-memorize',
      kind: 'misconception_check',
      question: 'Is JEE Organic Chemistry mostly about memorizing thousands of named reactions?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating organic as memorization-only.',
          correctsTo: 'Partly — but the smarter approach is MECHANISMS. If you understand WHY a reagent reacts a certain way (electron-poor / electron-rich, sterics, stability of intermediates), you can PREDICT products you\'ve never seen. JEE often gives a novel substrate / reagent combination — pure memorization fails. Master 4-5 fundamental mechanisms (SN1, SN2, E1, E2, electrophilic addition / substitution) and you can reason through most organic problems. Named reactions are scaffolding on top of mechanisms.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Physical (calc), Organic (mechanisms), Inorganic (NCERT memorize).',
        'NCERT is the foundation — multiple full reads.',
        'Chemistry first on exam day — fastest section.',
        'Master mechanisms in organic; rote memorize inorganic compounds.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does Mn²⁺ in acidic solution have a pale pink color while Ti³⁺ has a violet color?',
      hint: 'Both are d-d transitions in d-block ions. The COLOR depends on the energy gap between split d-orbitals (Δ_o), which depends on the metal ion AND the ligands. Mn²⁺ has a smaller crystal-field splitting → less light absorbed in visible → pale color. Different oxidation states + ligand fields give different colors. JEE inorganic loves these comparisons; learn them per ion.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
