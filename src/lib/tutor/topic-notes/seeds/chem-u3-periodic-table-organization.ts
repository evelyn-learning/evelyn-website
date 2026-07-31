/**
 * Chemistry — Unit 3.1: Organization of the Periodic Table & Element Families.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u3-periodic-table-organization.ts
 * (planId evelyn.hs.chem.periodic-table-organization.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.periodic-table-organization';

export const BASELINE_CHEM_U3_PERIODIC_TABLE_ORGANIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.periodic-table-organization.v1',
  course: 'Chemistry',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Organization of the Periodic Table & Element Families',
  planId: 'evelyn.hs.chem.periodic-table-organization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.periodic-table-organization.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The two axes',
      content:
        'PERIOD = horizontal row. GROUP (family) = vertical column. They encode different things: period number = number of occupied electron shells; group number = valence-electron count. Moving one seat right adds a proton and an electron to the SAME outer shell; dropping to the next row opens a brand-new shell.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Group number → valence electrons',
      content:
        'Groups 1 and 2 → 1 and 2 valence electrons directly. Groups 13–18 → subtract 10: 13 → 3, 14 → 4, 15 → 5, 16 → 6, 17 → 7, 18 → 8 (helium is the exception at 2). Transition metals (Groups 3–12) fill inner d orbitals, so the shortcut does not apply to them.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why columns repeat',
      content:
        'Every member of a column ends its configuration the same way: Li 2s¹, Na 3s¹, K 4s¹. Same valence count → same bonding appetite → same chemistry, just at different sizes. This periodic repetition is the reason the table exists as a table.',
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'The families',
      content:
        'Group 1 ALKALI METALS: 1 valence e⁻, soft, lose it instantly, form 1+ ions, react violently with water. Group 2 ALKALINE EARTH METALS: 2 valence e⁻, form 2+ ions, less violent. Groups 3–12 TRANSITION METALS: hard, dense, colored compounds, multiple possible charges. Group 17 HALOGENS: 7 valence e⁻, one short of full, take an electron to form 1− ions, most reactive nonmetals. Group 18 NOBLE GASES: full outer shell, essentially unreactive — the reference state every other family is chasing.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Metals, nonmetals, metalloids',
      content:
        'A staircase from boron down to astatine splits the table. LEFT of it: metals — shiny, conduct, lose electrons. RIGHT of it: nonmetals — brittle, insulate, gain or share electrons. ON it: metalloids (B, Si, Ge, As, Sb, Te), intermediate in both directions, which is why silicon works as a semiconductor.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Core vocabulary',
      content:
        'GROUP (family): a vertical column; members share a valence-electron count and therefore similar chemistry. PERIOD: a horizontal row; the period number equals the number of occupied shells. VALENCE ELECTRONS: outermost-shell electrons — the ones that bond and set behavior. METALLOID: a staircase element with properties between metal and nonmetal.',
    },
  ],
  methods: [
    {
      title: 'Read a seat: position → shells, valence, family, charge',
      when_to_use:
        'Any time you are handed an element by name, symbol, or (period, group) coordinates and asked what it is like or what ion it forms.',
      steps: [
        'Read the ROW → period number = number of occupied shells (Period 3 → three shells).',
        'Read the COLUMN → valence electrons. Groups 1–2 use the group number as is; Groups 13–18 subtract 10; Groups 3–12 (transition metals) are outside the shortcut.',
        'Name the FAMILY from the column: 1 alkali, 2 alkaline earth, 3–12 transition, 17 halogen, 18 noble gas.',
        'Convert valence count to expected ION CHARGE: metals lose their valence electrons (Group 1 → 1+, Group 2 → 2+); nonmetals gain 8 − valence (Group 17 → 1−, Group 16 → 2−).',
      ],
      example: {
        problem: 'An element sits in Period 3, Group 17. Shells, valence electrons, family, expected ion charge?',
        solution:
          'Period 3 → 3 occupied shells. Group 17 → 17 − 10 = 7 valence electrons. Seven valence electrons, one short of eight → halogen family. A halogen gains ONE electron to complete the shell → 1− ion. The element is chlorine, and it forms Cl⁻ in NaCl.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether two elements are chemical relatives',
      when_to_use:
        'When asked which pair behaves most alike, or when a claim rests on two elements "being next to each other".',
      steps: [
        'Ignore how close they look on the page — proximity is not the test.',
        'Get each element\'s COLUMN and convert it to a valence-electron count.',
        'Matching valence counts → same family → same ion charge and similar reactions (Mg and Ca, both Group 2, both 2 valence e⁻ → both 2+).',
        'Same row but different columns → same shell count only. That is a size similarity, not a chemistry one (Na, Mg, Al → 1, 2, 3 valence e⁻ → Na⁺, Mg²⁺, Al³⁺, giving NaCl, MgCl₂, AlCl₃).',
      ],
      example: {
        problem: 'A student claims Na, Mg, and Al are one family because they sit side by side in Period 3.',
        solution:
          'Wrong axis. The shared row means only three occupied shells each. By column: Na Group 1 → 1 valence e⁻, Mg Group 2 → 2, Al Group 13 → 3. Different charges (Na⁺, Mg²⁺, Al³⁺) and different formulas. Sodium\'s real family runs DOWN its column: Li, Na, K, Rb, Cs.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Row neighbors are not relatives. Shared row = shared shell count; shared COLUMN = shared chemistry. Na and K sit a full row apart and are near-twins; Na and Mg touch and behave nothing alike.',
      kind: 'common-error',
    },
    {
      content:
        'Group → valence shortcut only works for main-group columns, and Groups 13–18 need the −10 adjustment. Transition metals (3–12) fill inner d orbitals and have no single valence count to read off.',
      kind: 'gotcha',
    },
    {
      content:
        'Hydrogen is printed over Group 1 because it has 1 valence electron, but it is a nonmetal gas. With no inner shells to shield it, that electron is held tightly — hydrogen usually SHARES (H₂O, CH₄) and can even gain one to form H⁻. Column gives valence count, not automatic family membership.',
      kind: 'edge-case',
    },
    {
      content:
        'Helium sits in Group 18 but has 2 valence electrons, not 8. Its first shell holds only 2, and 2 is full for that shell — so it is still a noble gas.',
      kind: 'edge-case',
    },
    {
      content:
        'Memory hook for the three questions to ask any element: which ROW (how many shells), which COLUMN (how many valence electrons), which FAMILY (what it does with them). Those three answers give charge and reaction partners.',
      kind: 'tip',
    },
  ],
};
