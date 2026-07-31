/**
 * Chemistry — Unit 4 topic 4.2: Covalent Bonds & Lewis Structures.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u4-covalent-bonding-lewis.ts
 * (planId evelyn.hs.chem.covalent-bonding-lewis.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.covalent-bonding-lewis';
const PLAN_ID = 'evelyn.hs.chem.covalent-bonding-lewis.v1';

export const BASELINE_CHEM_U4_COVALENT_BONDING_LEWIS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Covalent Bonds & Lewis Structures',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Sharing between nonmetals',
      content:
        'A covalent bond forms between two NONMETALS — similar electronegativity, so neither can strip electrons off the other. Both pull on the SAME pair and both count it toward a full outer shell. One shared pair = one bond = 2 e⁻.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Bond order, strength, length',
      content:
        'One shared pair = single bond, two = double, three = triple. More shared pairs pull the nuclei closer and hold harder: strength triple > double > single, while LENGTH runs the opposite way, single > double > triple. N₂ (triple) sits inert in the air; O₂ (double) rusts nails. Vocabulary: lone pair = a valence pair held by one atom and not shared; bond order = the number of pairs shared between two atoms.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The electron budget is fixed',
      content:
        'Step 1 of any structure sets the total valence-electron count, and that number never changes. Bonding pairs plus lone pairs must add back to exactly that total. A lone pair still belongs to its atom\'s octet and still occupies space (O in H₂O carries two, N in NH₃ carries one).',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'A shared pair counts twice',
      content:
        'The 2 e⁻ in a bond count toward the octet of BOTH bonded atoms. Carbon in CO₂ reaches 8 from four shared pairs it does not exclusively own. Counting only what an atom "brought" gives carbon 4 and wrecks the structure.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Short octet → multiple bond',
      content:
        'If the central atom is left at 6 e⁻ with an empty budget, do NOT add electrons. Move an existing lone pair from an outer atom into the bond, converting single → double (or double → triple). Same total, better sharing.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Octet exceptions',
      content:
        'Hydrogen stops at 2 (a duet) and only ever bonds once, so it is never central. Boron often settles for 6. Period 3 atoms such as S and P can hold expanded octets of 10 or 12.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Even vs uneven sharing',
      content:
        'Sharing is only fair when electronegativities match. H–H and Cl–Cl share evenly (nonpolar); in O–H the oxygen pulls harder, leaving a partial negative on O and a partial positive on H (polar). Polar bonds are why water dissolves salt and oil does not.',
    },
  ],
  methods: [
    {
      title: 'The Lewis-structure recipe',
      when_to_use: 'Given a molecular formula and asked for bonds, lone pairs, or a structure.',
      steps: [
        'Budget: add the valence electrons of every atom. That total is the only currency available.',
        'Skeleton: least electronegative atom in the center; hydrogen is never central.',
        'Single-bond every outer atom to the center, spending 2 e⁻ per bond.',
        'Spend what is left as LONE PAIRS on the outer atoms until each has an octet (H needs only its bonding pair).',
        'Audit the center. If it is short, pull a lone pair in from an outer atom to make a double or triple bond — never invent electrons.',
        'Final audit: bonding e⁻ + lone-pair e⁻ must equal the step-1 total exactly.',
      ],
      example: {
        problem: 'Build the Lewis structure of NH₃.',
        solution:
          'Budget 5 + 3(1) = 8 e⁻. N central, three H around it. Three N–H bonds spend 6 e⁻; H is full at a duet, so the last 2 e⁻ become one LONE PAIR on nitrogen. N: 3 shared pairs (6 e⁻) + 1 lone pair (2 e⁻) = 8. Budget check 6 + 2 = 8. No multiple bond needed.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Fix a central atom that is short of an octet',
      when_to_use:
        'The recipe finished, outer atoms have octets, the budget is empty, but the center has only 4 or 6 e⁻.',
      steps: [
        'Count how many electrons short the center is; divide by 2 to get the number of pairs you must convert.',
        'Take that many lone pairs from OUTER atoms (one per bond you are upgrading) and move each into its bond with the center.',
        'Re-count the center: each converted pair adds 2 e⁻ to its octet.',
        'Re-count each outer atom: it lost a lone pair but gained the same pair as shared, so it still has 8.',
        'Re-audit the total — it must be unchanged from step 1.',
      ],
      example: {
        problem: 'CO₂ leaves carbon at 4 e⁻ after single bonds and three lone pairs on each oxygen.',
        solution:
          'Budget 4 + 2(6) = 16. Carbon is 4 e⁻ (two pairs) short, so convert one lone pair from EACH oxygen into its bond: two C=O DOUBLE bonds. Carbon now has four shared pairs = 8. Each oxygen keeps two lone pairs (4 e⁻) plus 4 shared = 8. Total 8 in bonds + 8 in lone pairs = 16, unchanged.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Never invent electrons to patch a short octet. The step-1 total is fixed — re-share an existing lone pair into a multiple bond instead.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'A shared pair counts in FULL for both atoms. Do not split it 1-and-1 when checking an octet; carbon in CO₂ counts all 8.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Where a pair sits is the whole point: a lone pair counts for ONE atom, a bonding pair for TWO. That is why converting one completes an octet at zero cost.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Hydrogen bonds once and stops at 2 electrons, so it can never be the central atom — even when it is written first in the formula.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Edge cases before you "fix" a structure: B is often fine at 6, and S or P may legitimately expand past 8. Not every non-octet is an error.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
