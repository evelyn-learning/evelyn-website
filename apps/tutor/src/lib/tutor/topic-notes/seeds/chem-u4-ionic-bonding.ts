/**
 * Chemistry — Unit 4 topic 4.1: Ionic Bonds & Ionic Compounds.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u4-ionic-bonding.ts
 * (planId evelyn.hs.chem.ionic-bonding.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.ionic-bonding';
const PLAN_ID = 'evelyn.hs.chem.ionic-bonding.v1';

export const BASELINE_CHEM_U4_IONIC_BONDING: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Ionic Bonds & Ionic Compounds',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Transfer, not sharing',
      content:
        'An ionic bond is a one-way TRANSFER of valence electrons from a metal to a nonmetal. The metal dumps its 1–3 valence electrons to reach a full shell; the nonmetal grabs the 1–3 it is missing. What holds the pieces together afterward is plain electrostatic attraction between a full + charge and a full − charge — nothing is shared.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Charge from the group number',
      content:
        'Group 1 → 1⁺, Group 2 → 2⁺, Group 13 → 3⁺; Group 15 → 3⁻, Group 16 → 2⁻, Group 17 → 1⁻. Metals lose electrons and become CATIONS (positive); nonmetals gain them and become ANIONS (negative). The size of the charge is how far the atom sits from the nearest noble gas.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Neutrality writes the formula',
      content:
        'Total positive charge must exactly cancel total negative charge. Mg²⁺ + Cl⁻ needs two chlorides → MgCl₂. Al³⁺ + O²⁻ needs 2 and 3 → Al₂O₃ (+6 and −6). Cation is written first, subscript 1 is never written.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Formula unit vs molecule',
      content:
        'An ionic solid is a repeating 3D lattice, not a collection of NaCl pairs: each Na⁺ is surrounded by 6 Cl⁻ and each Cl⁻ by 6 Na⁺. "NaCl" is a FORMULA UNIT — the simplest whole-number ion ratio in that lattice — not a particle you could isolate. Related terms: cation = positive ion (lost e⁻); anion = negative ion (gained e⁻); crystal lattice = the repeating alternating-ion arrangement.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Lattice → bulk properties',
      content:
        'Every ion is gripped by many neighbors at once, so melting points are HIGH (NaCl, 801 °C). Strike the crystal and one layer slides until like charges face each other, they repel, and it SHATTERS — ionic solids are brittle, not malleable like metals.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conductivity is about mobility',
      content:
        'Solid NaCl is 100% ions yet does not conduct, because those ions are locked in place. Melt it or dissolve it and the SAME ions are free to drift toward an electrode, so it conducts. Melting does not create ions; it only unlocks them.',
    },
  ],
  methods: [
    {
      title: 'Write the formula of an ionic compound from two elements',
      when_to_use:
        'Given a metal and a nonmetal (or their group numbers) and asked for the compound formula.',
      steps: [
        'Read each charge off the group: metal → cation charge, nonmetal → anion charge (Group 2 → Ca²⁺, Group 17 → Cl⁻).',
        'Find the smallest ratio whose charges cancel — match electrons supplied to electrons demanded. One Ca²⁺ needs two Cl⁻.',
        'Verify neutrality by adding signed charges: (+2) + 2(−1) = 0.',
        'Write cation first, ratio as subscripts, subscript 1 omitted: CaCl₂.',
        'REDUCE: check whether the subscripts share a common factor. Mg²⁺ with O²⁻ criss-crosses to Mg₂O₂, which reduces to MgO.',
      ],
      example: {
        problem: 'Magnesium (Group 2) with nitrogen (Group 15) — what is the formula?',
        solution:
          'Mg²⁺ and N³⁻. Least common total charge is 6, so three Mg²⁺ (+6) with two N³⁻ (−6): Mg₃N₂. Subscripts 3 and 2 share no factor, so nothing reduces. Note the cation charge sets the ANION subscript, and vice versa.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Explain an ionic bulk property from the lattice',
      when_to_use:
        'Asked why an ionic compound melts high, shatters, or conducts only in some states.',
      steps: [
        'Name the structure first: a 3D lattice of alternating cations and anions, each ion attracted to many neighbors.',
        'For MELTING/BOILING: many strong electrostatic attractions per ion → large energy needed → high melting point.',
        'For BRITTLENESS: a struck layer slides, like charges align, repulsion splits the crystal.',
        'For CONDUCTIVITY: ask whether the charged particles can MOVE, not whether they exist. Solid = locked = no conduction; molten or aqueous = mobile = conducts.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Criss-cross is a shortcut, not the rule — the rule is charge balance. Always check the subscripts for a common factor: Mg²⁺ with O²⁻ gives MgO, not Mg₂O₂.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        '"The ions share an electron" is the covalent picture leaking in. Ionic bonding is TRANSFER — Na keeps none of the electron it gave away.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'The compound is neutral, but the ions are NOT. Na⁺ stays +1 and Cl⁻ stays −1 permanently; only their totals cancel. That is why dissolved salt conducts.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Solid ionic compounds do not conduct. Ions exist in the solid — they just cannot move. Conduction needs mobility: melt it or dissolve it.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Memory hook: "cats are paws-itive" — a CATion is the positive one, formed by LOSING electrons. Anion = gained electrons = negative.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
