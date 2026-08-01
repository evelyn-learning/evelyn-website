/**
 * Chemistry — The Periodic Table: Periodic Trends.
 *
 * The predictive power of the table (NGSS HS-PS1-1, HS-PS1-2): effective
 * nuclear charge as the single engine behind atomic radius, ionization
 * energy, and electronegativity. The star misconception gets equal
 * billing — "more electrons = bigger atom" fails across a period.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U3_PERIODIC_TRENDS: LessonPlan = {
  id: 'evelyn.hs.chem.periodic-trends.v1',
  title: 'Periodic Trends: Atomic Radius, Ionization Energy & Electronegativity',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.periodic-trends',
      standard: 'CHEM-3.2',
      description:
        'Predict and explain the trends in atomic radius, ionization energy, and electronegativity across periods and down groups using effective nuclear charge and electron shielding (NGSS HS-PS1-1, HS-PS1-2).',
    },
  ],
  prerequisites: ['chem.periodic-table-organization'],
  followUps: ['chem.ion-formation'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The periodic table as a prediction machine — position alone forecasts how an element you have never touched will behave.',
      script:
        'Lithium powers your phone battery; sodium, one row down in the same column, explodes on contact with water — yet chemists knew sodium would be MORE violent before anyone dared try it. How? Position on the periodic table. The table is not a filing cabinet, it is a prediction machine: read an element\'s row and column and you can forecast its size, how tightly it holds electrons, and how greedily it grabs new ones. Those three predictions — radius, ionization energy, electronegativity — are today\'s lesson, and they run the entire rest of this course.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trends',
      kind: 'concept',
      goal: 'One engine (effective nuclear charge) driving three trends, plus the classic electron-count trap.',
      keyIdeas: [
        'THE ENGINE: EFFECTIVE NUCLEAR CHARGE — the pull a valence electron actually feels: protons attract it, but inner-shell electrons SHIELD it, canceling part of the pull. Every trend on the table traces back to this tug-of-war.',
        'ACROSS A PERIOD (left → right) — each step adds a proton to the nucleus but adds electrons to the SAME shell, so shielding barely changes. Net pull strengthens → the electron cloud is drawn in TIGHTER. Radius shrinks; ionization energy and electronegativity rise.',
        'DOWN A GROUP (top → bottom) — each step adds a whole new shell. Valence electrons sit farther out, behind more shielding. Net pull on them weakens → radius grows; ionization energy and electronegativity fall.',
        'IONIZATION ENERGY — the energy needed to remove one electron from a gaseous atom. Tightly-held electrons (small atoms, high effective charge) cost more to remove. Metals on the left give electrons up cheaply — that is WHY they form positive ions.',
        'ELECTRONEGATIVITY — how strongly an atom pulls on SHARED electrons in a bond. Fluorine, top-right corner, is the undisputed champion (noble gases sit out — they rarely bond). This single number will explain ionic vs covalent bonding in Unit 4.',
        'CORNER RULE — trends point diagonally: smallest radius, highest ionization energy, highest electronegativity all crowd toward fluorine (top right); the largest, most easily ionized atoms crowd toward the bottom left.',
        'THE TRAP: MORE ELECTRONS ≠ BIGGER — chlorine has 6 more electrons than sodium but is SMALLER, because those electrons join the same shell while 6 extra protons pull everything inward. Shell COUNT sets size down a group; pull STRENGTH sets size across a period.',
      ],
      vocabulary: [
        { term: 'effective nuclear charge', definition: 'the net positive pull a valence electron feels after inner electrons shield part of the nucleus.' },
        { term: 'ionization energy', definition: 'the energy required to remove one electron from a neutral atom in the gas phase.' },
        { term: 'electronegativity', definition: 'the strength with which a bonded atom attracts shared electrons.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rank-radius',
      kind: 'worked_example',
      problem:
        'Rank Na, Al, and Cl (all in Period 3) from largest to smallest atomic radius, and explain the ranking.',
      steps: [
        'All three sit in the SAME period, so they have the same number of shells — shell count cannot decide this. The deciding factor is pull strength.',
        'Count protons: Na has 11, Al has 13, Cl has 17. Each added proton strengthens the nuclear pull on the same Period-3 shell, with shielding nearly unchanged.',
        'Stronger pull → tighter cloud. Cl (17 protons) pulls its valence shell in hardest, so it is the smallest; Na (11) pulls weakest, so it is the largest.',
        'Ranking: Na > Al > Cl. Across a period, radius SHRINKS left to right.',
      ],
      answer: 'Na > Al > Cl — same shells, but more protons pull the shared shell in tighter',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-electron-count-trap',
      kind: 'worked_example',
      problem:
        'A student argues: "Chlorine (17 electrons) must be bigger than sodium (11 electrons) — more electrons need more room." Find the flaw and give the correct comparison.',
      steps: [
        'Locate both atoms: Na and Cl are both in Period 3 — their electrons occupy the SAME outermost shell (the third).',
        'The 6 extra electrons in Cl do not open a new shell; they squeeze into the existing third shell.',
        'Meanwhile Cl also has 6 extra PROTONS, and with shielding nearly identical, every valence electron in Cl feels a much stronger inward pull.',
        'Stronger pull on the same shell → smaller cloud: Cl is significantly SMALLER than Na. Electron count only predicts size when new SHELLS are added — that is the down-a-group story, not the across-a-period story.',
      ],
      answer: 'Cl is smaller than Na — extra protons pull the same shell inward; electron count alone does not set size',
      estimatedMinutes: 3,
    },
    {
      id: 'try-largest-radius',
      kind: 'try_yourself',
      problem: 'Which atom has the largest atomic radius: K, Ca, Br, or Kr (all in Period 4)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'K — leftmost, weakest pull on the shared shell', correct: true },
        { id: 'b', text: 'Kr — it has the most electrons' },
        { id: 'c', text: 'Br — halogens are always large' },
        { id: 'd', text: 'Ca — metals are larger than nonmetals' },
      ],
      expectedAnswer: 'K — leftmost, weakest pull on the shared shell',
      hints: [
        'Same period → same shells. What changes from K to Kr is the number of protons.',
        'Fewest protons = weakest pull = largest cloud. Which of the four sits farthest left?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ie-down-group',
      kind: 'try_yourself',
      problem: 'Why does ionization energy DECREASE going down a group?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The valence electrons sit farther from the nucleus and behind more shielding, so they are easier to remove', correct: true },
        { id: 'b', text: 'The nuclear charge decreases down a group' },
        { id: 'c', text: 'Atoms lower in a group have more electrons, and each one costs less energy' },
        { id: 'd', text: 'Heavier atoms are more reactive, so they lose electrons faster' },
      ],
      expectedAnswer: 'The valence electrons sit farther from the nucleus and behind more shielding, so they are easier to remove',
      hints: [
        'Each step down a group adds a whole new shell. What does that do to the distance and shielding of the outermost electron?',
        'Far away + heavily shielded = weakly held. Weakly held electrons are cheap to remove.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'An element has successive ionization energies (in kJ/mol) of IE₁ = 578, IE₂ = 1817, IE₃ = 2745, IE₄ = 11577. The huge jump after IE₃ marks the point where removal breaks into the stable core. How many valence electrons does this element have? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Electrons removed BEFORE the giant jump are the loosely-held valence electrons.',
        'IE₁, IE₂, IE₃ climb steadily, then IE₄ quadruples — three electrons came off before the wall.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-electron-count',
      kind: 'misconception_check',
      question:
        'A student says: "Fluorine holds its electrons more tightly than lithium because fluorine has more electrons." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'More electrons means a stronger hold',
          misconception: 'Crediting electron count for trends that are actually driven by proton count and shielding.',
          correctsTo:
            'The grip comes from the NUCLEUS: fluorine has 6 more protons than lithium pulling on the same second shell, with almost identical shielding. Proton pull — effective nuclear charge — sets the trends; electron count only matters when it adds new shells.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One engine drives every trend: effective nuclear charge — proton pull minus inner-electron shielding.',
        'Across a period: same shells + more protons → smaller radius, higher ionization energy, higher electronegativity.',
        'Down a group: new shells + more shielding → larger radius, lower ionization energy, lower electronegativity.',
        'Corner rule: all three "grip" trends peak at fluorine (top right); size peaks bottom left.',
        'The trap: more electrons ≠ bigger atom — Cl is smaller than Na because 6 extra protons pull the same shell inward.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Periodic Trends: Atomic Radius, Ionization Energy & Electronegativity' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
