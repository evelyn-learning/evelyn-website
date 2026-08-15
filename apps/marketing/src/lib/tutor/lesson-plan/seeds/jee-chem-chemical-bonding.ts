/**
 * JEE Chemistry — Chemical Bonding and Molecular Structure.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_CHEM_CHEMICAL_BONDING: LessonPlan = {
  id: 'evelyn.jee.chem.chemical-bonding.v1',
  title: 'JEE Chemistry — Chemical Bonding and Hybridisation',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-chemistry',
  locale: 'en',
  los: [{ id: 'jee.chem.chemical-bonding', description: 'Apply VSEPR, hybridisation, MO theory; predict shapes, bond angles, polarities, paramagnetic vs diamagnetic.', standard: 'JEE-CHEM-BONDING' }],
  prerequisites: ['jee.chem.atomic-structure'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Chemical bonding governs structure — and JEE tests structure with multiple shape/hybridisation/polarity questions per paper.', script: 'Why is CO₂ linear but H₂O bent? Why is benzene flat? Why is O₂ paramagnetic? VSEPR + hybridisation + MO theory each answer one of these. Today: the toolkit for predicting structure.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Lewis, VSEPR, hybridisation, MO theory, polarity.', keyIdeas: [
      'LEWIS structures: count valence electrons, draw single/double/triple bonds + lone pairs satisfying octet (with exceptions).',
      'OCTET EXCEPTIONS: incomplete octet (BF₃, BeCl₂), expanded octet (PCl₅, SF₆), odd electron (NO).',
      'VSEPR (Valence Shell Electron Pair Repulsion):',
      '  Count electron domains around central atom (bonds + lone pairs).',
      '  2 domains: linear (180°). E.g., BeCl₂, CO₂.',
      '  3 domains: trigonal planar (120°). BF₃, BCl₃.',
      '  4 domains: tetrahedral (109.5°). CH₄, NH₃ (with lone pair → bent), H₂O.',
      '  5 domains: trigonal bipyramidal. PCl₅. With lone pairs: see-saw, T-shape, linear.',
      '  6 domains: octahedral. SF₆. With lone pairs: square pyramidal, square planar.',
      '  Lone pairs reduce bond angles (LP-BP > BP-BP repulsion).',
      'HYBRIDISATION (counts central atom\'s electron domains):',
      '  2 → sp (linear). 3 → sp² (trig planar). 4 → sp³ (tetrahedral).',
      '  5 → sp³d (trig bipy). 6 → sp³d² (octahedral).',
      'BOND POLARITY: difference in electronegativity (>0.4 polar).',
      'MOLECULE polarity: depends on (a) bond polarity, (b) molecular shape — symmetric shapes can cancel polarities (CO₂ nonpolar despite polar bonds).',
      'MO theory: order of MO filling for diatomics (memorise σ1s, σ*1s, σ2s, σ*2s, etc.).',
      '  BOND ORDER = (bonding electrons − antibonding)/2.',
      '  PARAMAGNETIC: unpaired electrons in MOs (e.g., O₂ with 2 unpaired in π*2p).',
      '  DIAMAGNETIC: all paired (e.g., N₂).',
      'FAJANS\' RULES (covalent character in ionic bonds): high charge + small cation + large anion → more covalent. Explains why AgCl is more covalent than NaCl.',
      'HYDROGEN BONDING: H bonded to F, O, N attracts another N/O/F. Explains high BPs of H₂O, NH₃, HF.',
    ], vocabulary: [{ term: 'VSEPR', definition: 'Valence Shell Electron Pair Repulsion; predicts molecular shape from electron domain count.' }, { term: 'hybridisation', definition: 'mixing of atomic orbitals to form equivalent hybrid orbitals; matches the molecule\'s shape.' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'Predict shape, hybridisation, and polarity of NH₃.', steps: [
      'Lewis: N has 5 valence e⁻. 3 bonds to H (3 BP) + 1 LP. Total 4 domains around N.',
      '4 domains ⟹ tetrahedral electron geometry, but 3 bonds + 1 LP makes molecular shape PYRAMIDAL.',
      'Bond angle: ~107° (slightly less than 109.5° because LP-BP repulsion > BP-BP).',
      'Hybridisation: 4 domains ⟹ sp³.',
      'Polarity: N is more electronegative than H. Each N-H bond is polar (toward N). Pyramidal shape doesn\'t cancel — molecule is POLAR. (CONTRAST: CH₄ tetrahedral with 4 bonds cancels symmetrically — non-polar.)',
    ], answer: 'Trigonal pyramidal, sp³, polar.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why is O₂ paramagnetic but N₂ diamagnetic, even though both have all electrons paired in Lewis dot structures?', expectedAnswer: 'Lewis dot structures fail here — MO theory is needed. In O₂, the molecular orbital configuration has TWO UNPAIRED electrons in π*2p (degenerate antibonding orbitals), per Hund\'s rule. → paramagnetic. In N₂, 14 electrons fill MOs with all paired. → diamagnetic. The MO model predicted paramagnetism of O₂ before experiment confirmed it — major win for MO theory over Lewis.', responseFormat: 'free', hints: ['Lewis structures don\'t capture electron pairing in degenerate MOs.', 'Apply Hund\'s rule to π* orbitals.'], estimatedMinutes: 3 },
    { id: 'misconception-shape-vs-electron-geometry', kind: 'misconception_check', question: 'A student says H₂O is tetrahedral. What\'s the right description?', commonErrors: [{ answer: 'H₂O is tetrahedral', misconception: 'Confusing electron-domain geometry with molecular shape.', correctsTo: 'H₂O has 4 ELECTRON DOMAINS around O (2 bonds + 2 lone pairs) — so the ELECTRON GEOMETRY is tetrahedral. But the MOLECULAR SHAPE (described by atom positions only) is BENT/V-shaped, because the lone pairs aren\'t "atoms." Bond angle ≈ 104.5° (less than tetrahedral 109.5° due to lone pair repulsion). Always: shape names refer to atom positions, not electron domain count.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['VSEPR: count domains; shape from BP only.', 'sp/sp²/sp³/sp³d/sp³d² match domain counts 2/3/4/5/6.', 'Bond order = (bonding − antibonding)/2.', 'Para = unpaired e⁻; dia = all paired.', 'Symmetric shape can cancel polar bonds (CO₂).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
