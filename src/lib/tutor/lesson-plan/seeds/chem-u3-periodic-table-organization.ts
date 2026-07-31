/**
 * Chemistry — The Periodic Table: Organization & Element Families.
 *
 * The table's architecture (NGSS HS-PS1-1): columns are families that share
 * valence-electron count and therefore share chemistry; rows are periods that
 * count occupied shells. The star misconception gets equal billing —
 * neighbors in a ROW are not chemical relatives.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U3_PERIODIC_TABLE_ORGANIZATION: LessonPlan = {
  id: 'evelyn.hs.chem.periodic-table-organization.v1',
  title: 'Organization of the Periodic Table & Element Families',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.periodic-table-organization',
      standard: 'CHEM-3.1',
      description:
        'Locate an element by period and group, determine its valence-electron count and family, and use that position to predict its chemical behavior (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.electron-configurations'],
  followUps: ['chem.periodic-trends'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The table is a seating chart written by electrons — and it let Mendeleev describe elements nobody had ever seen.',
      script:
        'In 1869 Mendeleev laid the known elements out in rows and left three blank seats, then wrote down what the missing elements would look like — their color, their density, the compounds they would form. Years later chemists dug up gallium, scandium, and germanium and found the descriptions were nearly exact. He was not guessing. The seats themselves carry the information: an element\'s column tells you how many outer electrons it has, and outer electrons are the entire personality of an atom. Today you learn to read that seating chart — so that "element 34, Group 16" tells you how it will behave before you ever touch it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-organization',
      kind: 'concept',
      goal: 'Rows count shells, columns count valence electrons — plus the families they define and the row-neighbor trap.',
      keyIdeas: [
        'THE TWO AXES — a PERIOD is a horizontal row; a GROUP (or family) is a vertical column. They mean completely different things, and mixing them up is the #1 error in this unit.',
        'PERIOD NUMBER = SHELL COUNT — an element in Period 3 has electrons filling three shells. Moving one seat right adds one proton and one electron to the SAME outer shell; dropping to the next row starts a brand-new shell.',
        'GROUP NUMBER → VALENCE ELECTRONS — Groups 1 and 2 have 1 and 2 valence electrons. For the main-group columns on the right, SUBTRACT 10: Group 13 → 3, Group 14 → 4, Group 15 → 5, Group 16 → 6, Group 17 → 7, Group 18 → 8 (helium is the exception, with 2). Transition metals (Groups 3–12) fill inner d orbitals, so this shortcut does not apply to them.',
        'WHY COLUMNS REPEAT — every member of a column ends its electron configuration the same way: Li is 2s¹, Na is 3s¹, K is 4s¹. Same valence count → same bonding appetite → same chemistry, just at different sizes. THIS is why the table works at all.',
        'THE FAMILIES — Group 1 ALKALI METALS: 1 valence electron, soft, lose it instantly, form 1+ ions, react violently with water. Group 2 ALKALINE EARTH METALS: 2 valence electrons, form 2+ ions, less violent. Groups 3–12 TRANSITION METALS: hard, dense, colorful compounds, multiple possible charges. Group 17 HALOGENS: 7 valence electrons, one short of full, grab an electron to form 1− ions, the most reactive nonmetals. Group 18 NOBLE GASES: full outer shells, essentially unreactive — the reason all the other families do what they do.',
        'METALS, NONMETALS, METALLOIDS — a staircase from boron down to astatine splits the table: metals to the LEFT (shiny, conduct, lose electrons), nonmetals to the RIGHT (brittle, insulate, gain or share electrons), and metalloids ON the staircase (B, Si, Ge, As, Sb, Te) behaving in between — which is exactly why silicon runs every computer chip you own.',
        'READING A SEAT — given an element, ask three questions in order: which row (how many shells), which column (how many valence electrons), which family (what does it do with them). Those three answers predict its ion charge and its reaction partners.',
        'THE TRAP: ROW NEIGHBORS ARE NOT RELATIVES — Na, Mg, and Al sit side by side but have 1, 2, and 3 valence electrons and behave nothing alike. Na and K are separated by an entire row yet are near-twins. Chemical family means COLUMN, never row.',
      ],
      vocabulary: [
        { term: 'group (family)', definition: 'a vertical column of the periodic table; its members share a valence-electron count and therefore similar chemistry.' },
        { term: 'period', definition: 'a horizontal row of the periodic table; the period number equals the number of occupied electron shells.' },
        { term: 'valence electrons', definition: 'the electrons in the outermost shell — the ones that form bonds and set an element\'s behavior.' },
        { term: 'metalloid', definition: 'an element along the staircase boundary with properties between metals and nonmetals, such as silicon or germanium.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-a-seat',
      kind: 'worked_example',
      problem:
        'An element sits in Period 3, Group 17. How many electron shells does it occupy, how many valence electrons does it have, which family does it belong to, and what ion charge should you expect it to form?',
      steps: [
        'Period 3 → three occupied shells. That answers the size/shell question immediately.',
        'Group 17 is a main-group column on the right side, so subtract 10: 17 − 10 = 7 valence electrons.',
        'Seven valence electrons, one short of a full shell of eight — that is the halogen family (Group 17), the most reactive nonmetals.',
        'A halogen gains ONE electron to complete its outer shell, so expect a 1− ion. The element is chlorine, and it does exactly that: Cl becomes Cl⁻ in table salt, NaCl.',
        'Position alone gave you shells, valence count, family, and charge — no memorized fact sheet required.',
      ],
      answer: '3 shells, 7 valence electrons, halogen family, forms a 1− ion (the element is chlorine)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-row-neighbor-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "Na, Mg, and Al are right next to each other in Period 3, so they belong to the same family and should react the same way." Find the flaw and give the correct grouping.',
      steps: [
        'Check what the three actually share: Period 3 means all three have three occupied shells. That is a SIZE similarity, not a chemistry similarity.',
        'Now count valence electrons by column: Na is Group 1 → 1 valence electron; Mg is Group 2 → 2; Al is Group 13 → 13 − 10 = 3. Three different appetites.',
        'Different valence counts mean different ion charges: Na⁺, Mg²⁺, Al³⁺. They form different compounds in different ratios — NaCl, MgCl₂, AlCl₃ — so their chemistry is genuinely different.',
        'The real family for sodium runs DOWN its column: Li, Na, K, Rb, Cs — all with 1 valence electron, all forming 1+ ions, all reacting with water. K sits an entire row away from Na and is still its closest chemical relative.',
        'Correct rule: shared row = shared shell count. Shared COLUMN = shared chemistry. Family always means column.',
      ],
      answer: 'The flaw is using the row: Na, Mg, Al have 1, 2, and 3 valence electrons and form 1+, 2+, and 3+ ions. Sodium\'s family is its column — Li, Na, K, Rb, Cs.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-similar-chemistry',
      kind: 'try_yourself',
      problem: 'Which pair of elements should have the MOST similar chemical behavior?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mg and Ca — same column, both with 2 valence electrons', correct: true },
        { id: 'b', text: 'Mg and Al — they are next to each other in Period 3' },
        { id: 'c', text: 'Mg and Ne — both are in Period 3' },
        { id: 'd', text: 'Mg and S — both are in the right half of the table' },
      ],
      expectedAnswer: 'Mg and Ca — same column, both with 2 valence electrons',
      hints: [
        'Similar chemistry comes from matching valence-electron counts, not from sitting nearby on the page.',
        'Which of these pairs sits in the same COLUMN?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-family-id',
      kind: 'try_yourself',
      problem:
        'An unknown element is a soft, silvery solid that must be stored under oil, fizzes violently when dropped in water, and forms a compound with chlorine in a 1-to-1 ratio. Which family does it belong to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Alkali metals (Group 1) — one valence electron, given up easily to form a 1+ ion', correct: true },
        { id: 'b', text: 'Alkaline earth metals (Group 2) — they are the most reactive metals' },
        { id: 'c', text: 'Halogens (Group 17) — they react vigorously with everything' },
        { id: 'd', text: 'Transition metals (Groups 3–12) — they are silvery and metallic' },
      ],
      expectedAnswer: 'Alkali metals (Group 1) — one valence electron, given up easily to form a 1+ ion',
      hints: [
        'A 1-to-1 ratio with chloride (Cl⁻) means the element forms a 1+ ion. How many valence electrons does it give away?',
        'Soft, stored under oil, explosive in water, one electron to lose — that profile belongs to one specific column.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Silicon sits in Period 3, Group 14 of the periodic table. How many valence electrons does a neutral silicon atom have? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'The group number gives the valence count only after you adjust for the main-group columns on the right.',
        'For Groups 13 through 18, subtract 10 from the group number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hydrogen',
      kind: 'misconception_check',
      question:
        'A student says: "Hydrogen is printed at the top of Group 1, so it is an alkali metal — it should be soft, silvery, and explode in water like sodium." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Hydrogen is an alkali metal because it sits in Group 1',
          misconception: 'Treating column position as an absolute guarantee of family membership, without checking the underlying electron structure.',
          correctsTo:
            'Hydrogen is parked over Group 1 only because it has 1 valence electron — but it has NO inner shells to shield it, so that single electron is held tightly instead of being handed away. Hydrogen is a colorless nonmetal gas that shares electrons (H₂O, CH₄) far more often than it loses them, and it can even gain one to form H⁻. The column tells you the valence count; you still have to check what the atom actually does with those electrons. Hydrogen is chemistry\'s one-off.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Period = row = number of occupied shells; group = column = family with the same valence-electron count.',
        'Group number gives valence electrons directly for Groups 1–2, and after subtracting 10 for Groups 13–18; transition metals are the exception.',
        'The families: alkali metals (1 valence e⁻, form 1+), alkaline earth (2 valence e⁻, form 2+), halogens (7 valence e⁻, form 1−), noble gases (full shell, unreactive).',
        'The staircase from boron to astatine splits metals (left) from nonmetals (right), with metalloids like Si and Ge sitting on the line.',
        'The trap: row neighbors are not relatives — Na, Mg, Al behave differently, while Na and K, a full row apart, are near-twins.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Organization of the Periodic Table & Element Families' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
