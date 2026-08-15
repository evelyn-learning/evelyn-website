/**
 * Chemistry — Bonding: Ionic Bonds & Ionic Compounds.
 *
 * Electron TRANSFER (NGSS HS-PS1-1, HS-PS1-3): metals hand valence
 * electrons to nonmetals, the resulting cations and anions lock into a
 * lattice, and that lattice explains every bulk property — melting point,
 * brittleness, conductivity. The star misconceptions get equal billing:
 * criss-cross subscripts that never get reduced, and "the ions share".
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U4_IONIC_BONDING: LessonPlan = {
  id: 'evelyn.hs.chem.ionic-bonding.v1',
  title: 'Ionic Bonds & Ionic Compounds',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.ionic-bonding',
      standard: 'CHEM-4.1',
      description:
        'Predict the ions metals and nonmetals form, write balanced formulas for the ionic compounds they produce, and explain ionic melting points, brittleness, and conductivity from lattice structure (NGSS HS-PS1-1, HS-PS1-3).',
    },
  ],
  prerequisites: ['chem.ion-formation'],
  followUps: ['chem.covalent-bonding-lewis'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two lethal elements make the safest thing in the kitchen — because electrons changed owners permanently.',
      script:
        'Sodium is a soft metal that bursts into flame the instant it touches water. Chlorine is a green gas so toxic it was used as a chemical weapon. Put them together and you get the white crystals you shake onto french fries. Nothing was diluted and nothing was tamed — one electron simply changed owners, permanently, and the atoms that remain are not sodium and chlorine anymore. They are Na⁺ and Cl⁻, and they are stacked into a crystal so tightly bound that it takes 801 °C to pull it apart. Today you learn to predict exactly which electrons move, how many, and what that transfer does to the stuff you can hold in your hand.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ionic-bond',
      kind: 'concept',
      goal: 'Transfer → ions → lattice → bulk properties, plus the criss-cross subscript trap.',
      keyIdeas: [
        'THE DRIVING IDEA: OCTET — atoms are most stable with a full outer shell (8 valence electrons, or 2 for the smallest atoms). A metal reaches that shell fastest by DUMPING its 1–3 valence electrons; a nonmetal reaches it fastest by GRABBING the 1–3 it is missing. An ionic bond is that trade.',
        'PREDICTING THE CHARGE FROM THE GROUP — Group 1 → 1⁺, Group 2 → 2⁺, Group 13 → 3⁺; Group 15 → 3⁻, Group 16 → 2⁻, Group 17 → 1⁻. Metals become CATIONS (positive, because they lost negative electrons); nonmetals become ANIONS (negative). The charge equals how far the atom is from the nearest noble gas.',
        'THE BOND IS ELECTROSTATIC, NOT A SHARED PAIR — after Na gives its electron to Cl, the two are held together by plain opposite-charge attraction: Na⁺ pulls on Cl⁻. Nothing is being shared. That distinction is the whole difference between this lesson and the next one.',
        'CHARGE BALANCE WRITES THE FORMULA — a compound must be electrically NEUTRAL, so total positive charge must exactly cancel total negative. Mg²⁺ with Cl⁻ needs two chlorides: MgCl₂. Al³⁺ with O²⁻ needs 2 and 3: Al₂O₃ (+6 and −6).',
        'THE TRAP: CRISS-CROSS WITHOUT REDUCING — swapping the charges down as subscripts is a shortcut, not a rule. Mg²⁺ with O²⁻ criss-crosses to "Mg₂O₂", which is wrong — the ratio must be reduced to the simplest whole numbers: MgO. Always check whether the subscripts share a common factor.',
        'NO MOLECULES, JUST A LATTICE — an ionic solid is not little NaCl pairs floating around. It is a repeating 3D grid where each Na⁺ is surrounded by 6 Cl⁻ and vice versa. "NaCl" is a FORMULA UNIT — the simplest ratio in that grid, not a particle you could isolate.',
        'PROPERTIES FALL OUT OF THE LATTICE — every ion is gripped by many neighbors, so melting points are HIGH (NaCl, 801 °C). Strike the crystal and one layer slides so that like charges line up, they repel, and it SHATTERS — ionic solids are brittle, not bendable like metals.',
        'CONDUCTIVITY IS ABOUT MOBILITY, NOT EXISTENCE — solid NaCl does not conduct even though it is made entirely of ions, because those ions are locked in place. Melt it or dissolve it in water and the same ions are suddenly free to drift toward an electrode, and it conducts.',
      ],
      vocabulary: [
        { term: 'cation', definition: 'a positively charged ion, formed when an atom loses one or more electrons.' },
        { term: 'anion', definition: 'a negatively charged ion, formed when an atom gains one or more electrons.' },
        { term: 'formula unit', definition: 'the simplest whole-number ratio of ions in an ionic compound, e.g. NaCl or Al₂O₃.' },
        { term: 'crystal lattice', definition: 'the repeating three-dimensional arrangement of alternating cations and anions in an ionic solid.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cacl2',
      kind: 'worked_example',
      problem:
        'Calcium (Group 2) reacts with chlorine (Group 17). Show which electrons move, what ions form, and write the formula of the compound.',
      steps: [
        'Read the charges off the groups. Calcium is in Group 2, so it has 2 valence electrons and loses both: Ca → Ca²⁺ + 2 e⁻. Chlorine is in Group 17, so it has 7 valence electrons and gains 1 to finish its octet: Cl + 1 e⁻ → Cl⁻.',
        'Match supply to demand. Calcium is handing out 2 electrons, but each chlorine atom can only accept 1. Two chlorine atoms are needed to absorb the pair.',
        'Check neutrality: one Ca²⁺ contributes +2; two Cl⁻ contribute a total of −2. The sum is zero, so the ratio 1 calcium to 2 chlorines is correct.',
        'Write the formula with the cation first and the ratio as subscripts: CaCl₂. Subscript 1 is never written. The subscripts 1 and 2 share no common factor, so nothing reduces.',
        'Sanity-check the substance: CaCl₂ should be a hard, high-melting solid that dissolves readily in water — and it is, which is why it is spread on icy roads.',
      ],
      answer: 'Ca loses 2 e⁻ → Ca²⁺; two Cl each gain 1 e⁻ → 2 Cl⁻; charges cancel at a 1:2 ratio, so the formula is CaCl₂',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-criss-cross-trap',
      kind: 'worked_example',
      problem:
        'A student writes the compound of magnesium and oxygen as Mg₂O₂, explaining: "Mg is 2⁺ and O is 2⁻, so I criss-crossed the charges into subscripts." Find the flaw and give the correct formula.',
      steps: [
        'Confirm the ions first — that part is right. Magnesium is Group 2 → Mg²⁺; oxygen is Group 16 → O²⁻.',
        'Now apply the actual rule, which is charge balance, not criss-crossing. One Mg²⁺ (+2) already cancels one O²⁻ (−2) exactly. A 1:1 ratio is neutral, so no second pair is required.',
        'See why Mg₂O₂ still "works" numerically: 2 × (+2) = +4 and 2 × (−2) = −4, which also cancels. Criss-crossing never breaks neutrality — it just produces a ratio that has not been reduced.',
        'Reduce to the simplest whole-number ratio: 2 and 2 share the factor 2, giving 1 and 1. The formula unit is MgO.',
        'The deeper reason: a formula unit describes the RATIO of ions repeating through the lattice, not a molecule with a fixed particle count. Ratios must always be written in lowest terms, so criss-cross results must be checked for common factors every time.',
      ],
      answer: 'MgO — criss-crossing gave the unreduced ratio Mg₂O₂; +2 and −2 already cancel 1:1',
      estimatedMinutes: 3,
    },
    {
      id: 'try-mg3n2',
      kind: 'try_yourself',
      problem:
        'Magnesium is in Group 2 and nitrogen is in Group 15. What is the formula of the ionic compound they form?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mg₃N₂ — three Mg²⁺ (+6) balance two N³⁻ (−6)', correct: true },
        { id: 'b', text: 'Mg₂N₃ — the charges written straight across as subscripts' },
        { id: 'c', text: 'MgN — one of each, since one metal bonds to one nonmetal' },
        { id: 'd', text: 'MgN₂ — magnesium gives away two electrons, so it needs two nitrogens' },
      ],
      expectedAnswer: 'Mg₃N₂ — three Mg²⁺ (+6) balance two N³⁻ (−6)',
      hints: [
        'First get the ions: Group 2 gives Mg²⁺, and Group 15 needs three more electrons, giving N³⁻.',
        'Find the smallest total charge both can reach. +2 and −3 both divide into 6, so you need three Mg²⁺ and two N³⁻ — the cation charge sets the ANION subscript, not its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-conductivity',
      kind: 'try_yourself',
      problem:
        'Solid table salt does not conduct electricity, but melted table salt conducts very well. Why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The ions exist in both cases, but only in the melt are they free to move toward an electrode', correct: true },
        { id: 'b', text: 'Melting splits the neutral NaCl units into ions for the first time' },
        { id: 'c', text: 'Melting frees electrons, which carry the current the way they do in a copper wire' },
        { id: 'd', text: 'The heat itself carries the charge, so any hot substance conducts' },
      ],
      expectedAnswer: 'The ions exist in both cases, but only in the melt are they free to move toward an electrode',
      hints: [
        'A current is charge in motion. Ask what charged particles are present in solid NaCl — and whether they can go anywhere.',
        'Solid NaCl is already 100% ions, locked in a rigid lattice. Melting does not create them; it only unlocks them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Aluminum forms Al³⁺ and oxygen forms O²⁻. In the neutral ionic compound aluminum oxide, how many oxide ions are present for every 2 aluminum ions? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Two Al³⁺ ions carry a total charge of +6. The oxide ions must contribute exactly −6 to cancel it.',
        'Each O²⁻ contributes −2. How many of them add up to −6?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-share-vs-transfer',
      kind: 'misconception_check',
      question:
        'A student says: "In NaCl, sodium and chlorine share an electron so that both of them end up with a full outer shell." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'They share the electron between them',
          misconception: 'Applying the covalent picture of a shared electron pair to a metal-plus-nonmetal bond.',
          correctsTo:
            'Sharing is covalent; ionic bonding is a one-way TRANSFER. Sodium hands its single valence electron to chlorine and keeps none of it, leaving Na⁺ with a complete inner shell and Cl⁻ with a complete octet. What holds them together afterward is nothing but the electrostatic attraction between a full positive charge and a full negative charge — and because that attraction reaches out in all directions, the ions build a lattice instead of pairing off into molecules.',
        },
        {
          answer: 'The compound is neutral, so the ions must be neutral too',
          misconception: 'Confusing overall electrical neutrality of the compound with the charges on the individual ions.',
          correctsTo:
            'The ions keep their full charges permanently — Na⁺ is always +1 and Cl⁻ is always −1. The COMPOUND is neutral only because those charges cancel in the right ratio. That is exactly why dissolving salt in water gives you a solution full of charged particles that conducts electricity.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ionic bonding is TRANSFER: a metal loses valence electrons to become a cation, a nonmetal gains them to become an anion, and opposite charges attract.',
        'The group number predicts the charge: Group 1 → 1⁺, Group 2 → 2⁺, Group 13 → 3⁺, Group 15 → 3⁻, Group 16 → 2⁻, Group 17 → 1⁻.',
        'Write formulas by balancing charge to zero, then REDUCE — criss-crossing Mg²⁺ with O²⁻ gives Mg₂O₂, but the answer is MgO.',
        'A formula unit is the simplest ion ratio in a lattice, not an isolated molecule; each Na⁺ in NaCl touches 6 Cl⁻.',
        'Lattice explains the properties: high melting point, brittle when struck, and conducts only once melted or dissolved — the ions are always there, but only then can they move.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Ionic Bonds & Ionic Compounds' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
