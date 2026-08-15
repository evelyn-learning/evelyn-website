/**
 * HS Chemistry — Covalent Bonding and Lewis Structures.
 * NGSS HS-PS1-3: structure and properties of substances.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_COVALENT_BONDING_LEWIS: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.covalent-bonding-lewis.v1',
  title: 'Covalent Bonding and Lewis Structures',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-3', description: 'Plan and conduct an investigation to gather evidence to compare the structure of substances at the bulk scale to infer the strength of electrical forces between particles.', standard: 'NGSS.HS-PS1-3' }],
  prerequisites: ['hs.chem.ionic-bonding'], followUps: ['hs.chem.molecular-geometry-vsepr'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in water.', script: 'H₂O — two hydrogens stuck to one oxygen. Without it, no life. The reason H and O bond at all is they SHARE electrons. That\'s a covalent bond. Most molecules in your body — proteins, DNA, sugars — are held together by covalent bonds.', estimatedMinutes: 2 },
    { id: 'concept-covalent', kind: 'concept', goal: 'Covalent bonds form when atoms share electron pairs.', keyIdeas: [
      'COVALENT BOND: atoms SHARE valence electrons to fill their outer shells.',
      'Mostly between TWO NONMETALS (similar electronegativity → neither wins, both share).',
      'SINGLE BOND: 1 shared pair (2 electrons). Drawn as one line: H–H.',
      'DOUBLE BOND: 2 shared pairs (4 electrons). Drawn as two lines: O=O.',
      'TRIPLE BOND: 3 shared pairs (6 electrons). Drawn as three lines: N≡N.',
      'BOND STRENGTH: triple > double > single. BOND LENGTH: single > double > triple.',
      'POLAR vs NONPOLAR:',
      '  · NONPOLAR: equal sharing (H–H, Cl–Cl, C–H — similar EN).',
      '  · POLAR: unequal sharing (O–H — O hogs electrons → partial − on O, partial + on H).',
    ], vocabulary: [{ term: 'covalent bond', definition: 'shared electron pair between atoms.' }, { term: 'lone pair', definition: 'valence electrons NOT in a bond.' }, { term: 'polar bond', definition: 'unequal electron sharing.' }], estimatedMinutes: 5 },
    { id: 'concept-lewis', kind: 'concept', goal: 'Lewis structures show valence electrons + bonds.', keyIdeas: [
      'LEWIS STRUCTURE rules:',
      '  1. Count total valence electrons.',
      '  2. Place least-electronegative atom in CENTER (H is always on the outside).',
      '  3. Connect with single bonds (each = 2 e⁻).',
      '  4. Distribute remaining as LONE PAIRS, completing OCTETS on outer atoms first.',
      '  5. If atoms still need more, make DOUBLE/TRIPLE bonds.',
      'EXCEPTIONS to octet rule:',
      '  · H needs only 2 (duet).',
      '  · B is fine with 6.',
      '  · Sulfur, phosphorus can have 10 or 12 (expanded octets).',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'worked-CO2', kind: 'worked_example', problem: 'Draw the Lewis structure for CO₂.', steps: [
      'Count valence: C has 4, each O has 6. Total = 4 + 6 + 6 = 16 electrons.',
      'C is least electronegative (after H, which isn\'t here) → C in center.',
      'Connect: O–C–O. Used 4 electrons for 2 single bonds. 12 left.',
      'Distribute on Os first: each O gets 6 lone pair electrons (3 lone pairs).',
      'Check: O has 6 lone + 2 shared = 8 ✓. But C has only 4 (2 single bonds × 2 e⁻).',
      'C needs 4 more → upgrade SINGLE bonds to DOUBLE. Move one lone pair from each O into the C–O bond.',
      'Final: O=C=O. Each O now has 2 lone pairs + 4 shared = 8 ✓. C has 8 (two double bonds) ✓.',
    ], answer: 'O=C=O with two lone pairs on each oxygen. Linear molecule. All atoms satisfy octet.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Draw the Lewis structure for water (H₂O). How many lone pairs are on the oxygen?', expectedAnswer: 'Total valence: 2(H) + 6(O) = 8 electrons. O in center, two H–O single bonds (4 e⁻ used). Remaining 4 e⁻ = 2 LONE PAIRS on oxygen. So oxygen has TWO LONE PAIRS plus two bonds. Structure: H–O–H with 2 lone pairs on the O (giving water its bent shape).', responseFormat: 'free', hints: ['How many valence electrons total?', 'Don\'t forget the lone pairs.'], estimatedMinutes: 3 },
    { id: 'misconception-double-strong', kind: 'misconception_check', question: 'A friend says "double bonds are exactly twice as strong as single bonds." Right?', commonErrors: [{ answer: 'Yes — double = 2x.', misconception: 'Treating bonds as additive.', correctsTo: 'Double bonds are STRONGER, but NOT exactly 2x. C–C single ≈ 348 kJ/mol; C=C double ≈ 614 kJ/mol (~1.8x). C≡C triple ≈ 839 kJ/mol (~2.4x). The first bond (sigma) is the strongest; additional bonds (pi) are weaker because of orbital geometry.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Covalent = SHARED electrons (mostly nonmetals).', 'Single, double, triple = 1, 2, 3 shared pairs.', 'Lewis structures: count valence, place center, complete octets.', 'Polar bonds: unequal sharing (different electronegativity).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
