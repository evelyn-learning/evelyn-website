/**
 * High School (9-10) Chemistry — overview unit.
 *
 * Atomic structure, periodic trends, bonding, reactions, stoichiometry —
 * five anchors of HS chem.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_CHEMISTRY_OVERVIEW: LessonPlan = {
  id: 'evelyn.science.9-10.chemistry-overview.v1',
  title: 'HS chemistry — five big anchors',
  curriculum: 'NGSS',
  grade: '10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'hschem.anchors',
      description: 'Identify how atomic structure leads to bonding and reactions; perform basic stoichiometry.',
      standard: 'HS-PS1',
    },
  ],
  prerequisites: ['g6-8.chemistry-basics'],
  followUps: ['hschem.bonding', 'hschem.stoichiometry'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame chemistry as the consequences of electron arrangement.',
      script: 'Chemistry has hundreds of reactions and you cannot memorize them all. But underneath, almost everything reduces to ELECTRONS. How they\'re arranged. Whether atoms want to lose, gain, or share them. Once you see chemistry as electron behavior, hundreds of reactions become a few patterns.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-anchors',
      kind: 'concept',
      goal: 'Atomic structure → periodic trends → bonding → reactions → stoichiometry.',
      keyIdeas: [
        'ATOM: nucleus (protons + neutrons) + electrons in shells. Protons define the element; electrons drive chemistry.',
        'PERIODIC TABLE: organized by proton count + shell structure. Columns = similar valence electrons = similar chemistry.',
        'PERIODIC TRENDS: across a row, atomic radius shrinks (more pull). Down a group, radius grows (more shells). Ionization energy increases across, decreases down.',
        'BONDING: atoms want full outer shells. IONIC = electron transfer (metal + nonmetal). COVALENT = electron sharing (two nonmetals). METALLIC = sea of shared electrons.',
        'REACTIONS: bonds break and reform. Conservation of mass: atoms in = atoms out. Balance equations.',
        'STOICHIOMETRY: ratios in balanced equations. Mole = 6.022 × 10²³ particles. Moles, mass, and Avogadro\'s number connect quantities.',
      ],
      vocabulary: [
        { term: 'valence electrons', definition: 'electrons in the outermost shell; they drive bonding behavior.' },
        { term: 'mole', definition: '6.022 × 10²³ particles — chemistry\'s counting unit.' },
        { term: 'stoichiometry', definition: 'using balanced-equation ratios to convert between amounts of reactants and products.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-balance',
      kind: 'worked_example',
      problem: 'Balance: H₂ + O₂ → H₂O.',
      steps: [
        'Count atoms: LHS has 2 H, 2 O. RHS has 2 H, 1 O. Oxygen unbalanced.',
        'Try 2 H₂O on RHS: now RHS has 4 H, 2 O. LHS still 2 H, 2 O. Hydrogen unbalanced.',
        'Try 2 H₂ on LHS: LHS has 4 H, 2 O. RHS still 4 H, 2 O. Balanced!',
        'Final: 2 H₂ + O₂ → 2 H₂O.',
        'Read it: two molecules of hydrogen react with one of oxygen to make two of water.',
      ],
      answer: '2 H₂ + O₂ → 2 H₂O',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Sodium (Na) is in column 1 of the periodic table. How many valence electrons does it have, and what kind of bond does it tend to form with chlorine?',
      expectedAnswer: '1 valence electron; ionic bond (loses the electron to chlorine)',
      responseFormat: 'free',
      hints: [
        'Column number = valence-electron count for groups 1-2.',
        'Sodium loses one to reach a noble-gas configuration; chlorine gains one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-conservation',
      kind: 'misconception_check',
      question: 'A student says: "When wood burns, mass disappears — that\'s why ash weighs less than the original log." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because it\'s lighter',
          misconception: 'Forgetting that gases have mass.',
          correctsTo: 'Mass is conserved. The "missing" mass left as gases (CO₂, H₂O vapor) — invisible, but real. If you weighed the log + oxygen consumed before combustion and the ash + all gases after, the totals would match. Burning isn\'t destruction; it\'s rearrangement of atoms.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Protons define element; electrons drive chemistry.',
        'Periodic table organizes by proton count + valence electrons.',
        'Bonding: ionic (transfer), covalent (share), metallic (delocalized).',
        'Reactions conserve atoms — balance equations.',
        'Mole = 6.022 × 10²³; stoichiometry uses balanced-equation ratios.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is water (H₂O) liquid at room temperature when similarly small molecules like CO₂ are gas?',
      hint: 'Hydrogen bonding. The O-H bond is very polar; H atoms attract O atoms in neighboring molecules with bonds (~5% the strength of a covalent bond, but persistent). Water molecules cluster, raising boiling point dramatically. CO₂ is nonpolar — no such clustering — so it\'s a gas at the same temperature.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
