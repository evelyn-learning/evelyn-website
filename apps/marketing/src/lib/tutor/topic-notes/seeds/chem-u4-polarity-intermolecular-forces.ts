/**
 * Chemistry — Unit 4 topic 4.5: Bond Polarity & Intermolecular Forces.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u4-polarity-intermolecular-forces.ts
 * (planId evelyn.hs.chem.polarity-intermolecular-forces.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.polarity-intermolecular-forces';
const PLAN_ID = 'evelyn.hs.chem.polarity-intermolecular-forces.v1';

export const BASELINE_CHEM_U4_POLARITY_INTERMOLECULAR_FORCES: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'Bond Polarity & Intermolecular Forces',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'identity',
      title: 'Stage 1 — bond polarity is a subtraction',
      content:
        'ΔEN = the electronegativity difference between the two bonded atoms. Below 0.4 → NONPOLAR covalent (H–H, C–H). 0.4 to 1.7 → POLAR covalent. Above 1.7 → IONIC (Na–Cl). The more electronegative atom takes the partial negative end; its partner is left partially positive. That separated pair of partial charges is a DIPOLE.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Stage 2 — molecular polarity is dipoles plus shape',
      content:
        'Bond dipoles are arrows, and arrows can cancel. Add them in the geometry VSEPR gave you. Exact cancellation → the molecule is NONPOLAR no matter how polar the individual bonds are. Leftover → that is the net dipole and the molecule is POLAR.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The shape test',
      content:
        'Fast screen: if the central atom has NO lone pairs AND every outer atom is identical, the dipoles cancel → nonpolar (CO₂ linear, BF₃ trigonal planar, CH₄ and CCl₄ tetrahedral). Break either condition — a lone pair on the center, or one outer atom swapped — and the molecule is polar (H₂O bent, NH₃ trigonal pyramidal, CHCl₃).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Intermolecular ≠ intramolecular',
      content:
        'A covalent bond holds atoms together WITHIN a molecule. An intermolecular force (IMF) is the far weaker attraction of one whole molecule for its neighbor — typically a few percent as strong. Melting and boiling pull molecules APART from each other; they never break the bonds inside.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'The three IMFs, weakest to strongest',
      content:
        '(1) LONDON DISPERSION — momentary lopsided electron clouds induce matching ones in neighbors; present in EVERY substance, and it grows with molecular size and electron count. (2) DIPOLE–DIPOLE — permanent positive ends of polar molecules attracted to neighbors\' negative ends. (3) HYDROGEN BONDING — the strongest, an extra-powerful dipole–dipole appearing only when H is bonded DIRECTLY to N, O, or F and reaches for a lone pair on another N, O, or F.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'IMFs set physical properties',
      content:
        'Stronger IMFs → higher boiling and melting points, higher viscosity and surface tension, lower vapor pressure, because more energy is needed to separate the molecules. Solubility follows LIKE DISSOLVES LIKE: polar water dissolves polar sugar and ionic salt, but not nonpolar oil.',
    },
  ],
  methods: [
    {
      title: 'Run the two-stage polarity chain',
      when_to_use:
        'Asked whether a bond or a molecule is polar, or asked to name the strongest IMF present.',
      steps: [
        'Stage 1: compute ΔEN for each distinct bond and classify it (<0.4 nonpolar covalent, 0.4–1.7 polar covalent, >1.7 ionic). Mark which atom carries the partial negative end.',
        'Stage 2: get the molecular shape from VSEPR, then decide whether the bond dipoles cancel — apply the shape test (no lone pairs on the center AND identical outer atoms → cancel).',
        'Name the molecule polar or nonpolar based on the net dipole, not on the bonds alone.',
        'List the IMFs: dispersion is always present; add dipole–dipole if the molecule is polar; add hydrogen bonding only if H is bonded directly to N, O, or F.',
        'The strongest force on that list drives the boiling point, solubility, and state.',
      ],
      example: {
        problem: 'HCl, with H = 2.1 and Cl = 3.0 — classify the bond, the molecule, and the strongest IMF.',
        solution:
          'ΔEN = 3.0 − 2.1 = 0.9 → POLAR COVALENT, with Cl at the partial negative end. Two different atoms in a diatomic means one dipole and nothing to cancel it → the molecule is POLAR. Dispersion is present, dipole–dipole is present and stronger; no hydrogen bonding, because Cl is not N, O, or F. That is why HCl boils near −85 °C while water holds on to 100 °C.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compare boiling points of two substances',
      when_to_use:
        'Asked which substance boils higher, or to explain a surprising boiling-point gap.',
      steps: [
        'State up front that boiling separates molecules and does NOT break covalent bonds, so compare the forces BETWEEN molecules.',
        'Determine polarity of each substance via the two-stage chain.',
        'Identify the strongest IMF for each: hydrogen bonding > dipole–dipole > dispersion.',
        'If both sit in the same IMF class, break the tie on size/electron count — bigger clouds mean stronger dispersion.',
        'Conclude: the substance with the stronger dominant IMF boils higher.',
      ],
      example: {
        problem: 'H₂O boils at 100 °C but H₂S near −60 °C, even though H₂S is heavier and both are bent.',
        solution:
          'Both are polar bent molecules, so the difference is not shape. In H₂O the H sits directly on O, so water molecules HYDROGEN BOND; in H₂S the H sits on S, which is not on the N/O/F list, so only dipole–dipole plus dispersion act. The stronger force wins over the extra mass.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Polar bonds ≠ polar molecule. CO₂ has two ΔEN = 1.0 C=O bonds but is linear, so the equal opposite dipoles cancel and CO₂ is nonpolar. Always run stage 2.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Hydrogen bonding needs H bonded DIRECTLY to N, O, or F. Seeing a hydrogen atom is not enough — HCl is polar but has no hydrogen bonding.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Boiling does not break covalent bonds. It only overcomes the forces between molecules — steam is still H₂O.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Nonpolar does not mean force-free. London dispersion acts in everything and grows with electron count: F₂ and Cl₂ gases, Br₂ liquid, I₂ (106 e⁻) a solid — all nonpolar.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
    {
      content:
        'A "hydrogen bond" is an attraction BETWEEN molecules, not a bond made of hydrogen inside one. Keep the intermolecular/intramolecular line sharp.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
