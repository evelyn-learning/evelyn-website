/**
 * HS Chemistry — Molecular Geometry (VSEPR).
 * NGSS HS-PS1-3: bulk-scale properties from molecular structure.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_MOLECULAR_GEOMETRY_VSEPR: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.molecular-geometry-vsepr.v1',
  title: 'Molecular Geometry (VSEPR)',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-3', description: 'Plan and conduct an investigation to gather evidence to compare the structure of substances at the bulk scale to infer the strength of electrical forces between particles.', standard: 'NGSS.HS-PS1-3' }],
  prerequisites: ['hs.chem.covalent-bonding-lewis'], followUps: ['hs.chem.naming-compounds'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Shape determines function.', script: 'CO₂ is linear — and that\'s why it traps heat. Water is bent — and that\'s why it dissolves so much. The shape of a molecule determines whether it dissolves, reacts, or even smells. VSEPR theory predicts those shapes.', estimatedMinutes: 2 },
    { id: 'concept-vsepr', kind: 'concept', goal: 'VSEPR: electron pairs (bonds + lone pairs) push apart, determining shape.', keyIdeas: [
      'VSEPR = Valence Shell Electron Pair Repulsion.',
      'Premise: electron pairs around an atom REPEL each other → arrange to be as far apart as possible.',
      'COUNT the "electron domains" around the central atom: each single, double, or triple bond = ONE domain. Each lone pair = ONE domain.',
      'BASIC SHAPES (no lone pairs):',
      '  · 2 domains: LINEAR (180°). Example: CO₂.',
      '  · 3 domains: TRIGONAL PLANAR (120°). Example: BF₃.',
      '  · 4 domains: TETRAHEDRAL (109.5°). Example: CH₄.',
      '  · 5 domains: TRIGONAL BIPYRAMIDAL.',
      '  · 6 domains: OCTAHEDRAL (90°).',
      'LONE PAIRS push HARDER than bonds → squeeze bond angles slightly smaller.',
    ], vocabulary: [{ term: 'electron domain', definition: 'a bond OR a lone pair on central atom.' }, { term: 'bond angle', definition: 'angle between two bonds at central atom.' }, { term: 'tetrahedral', definition: '4-domain shape, 109.5° angles.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'concept-with-lone-pairs', kind: 'concept', goal: 'Lone pairs change the molecular shape (different from electron geometry).', keyIdeas: [
      'ELECTRON geometry: based on ALL domains (bonds + lone pairs).',
      'MOLECULAR shape: based on ATOM positions (lone pairs are invisible).',
      'EXAMPLES (4 domains total):',
      '  · CH₄: 4 bonds, 0 lone pairs → TETRAHEDRAL.',
      '  · NH₃: 3 bonds, 1 lone pair → TRIGONAL PYRAMIDAL (~107°).',
      '  · H₂O: 2 bonds, 2 lone pairs → BENT (~104.5°).',
      'EXAMPLES (3 domains total):',
      '  · BF₃: 3 bonds → TRIGONAL PLANAR.',
      '  · SO₂: 2 bonds, 1 lone pair → BENT.',
      'Polar molecules: bond polarity + asymmetric shape. Water (bent + polar bonds) = polar overall. CO₂ (linear + polar bonds) = nonpolar (cancel out).',
    ], estimatedMinutes: 4 },
    { id: 'worked-CH4', kind: 'worked_example', problem: 'Predict the geometry, bond angles, and polarity of methane (CH₄).', steps: [
      'Lewis structure: C in center, 4 H on outside, all single bonds. No lone pairs on C.',
      'Domains around C: 4 bonds + 0 lone pairs = 4 domains.',
      'Geometry: TETRAHEDRAL.',
      'Bond angles: 109.5° (each H–C–H).',
      'POLARITY: C–H bonds are very slightly polar (EN: C=2.5, H=2.1) — nearly nonpolar.',
      'Even if bonds were polar, the SYMMETRIC tetrahedral shape would cancel them out.',
      'CH₄ is essentially NONPOLAR.',
    ], answer: 'Tetrahedral, 109.5° bond angles, nonpolar. Symmetric shape cancels any small bond polarity.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Predict the geometry and polarity of NH₃ (ammonia).', expectedAnswer: 'N has 3 bonds + 1 LONE PAIR = 4 domains total. ELECTRON geometry: tetrahedral. MOLECULAR shape: TRIGONAL PYRAMIDAL (lone pair invisible but pushes H atoms down). Bond angle ~107° (lone pair squeezes). N–H bonds are POLAR (N more EN). Asymmetric shape doesn\'t cancel → NH₃ is POLAR. (That\'s why it dissolves in water.)', responseFormat: 'free', hints: ['Count electron domains including lone pairs.', 'Does the shape cancel bond polarity?'], estimatedMinutes: 3 },
    { id: 'misconception-co2-polar', kind: 'misconception_check', question: 'A friend says "C=O bonds are polar, so CO₂ must be a polar molecule." Right?', commonErrors: [{ answer: 'Yes — polar bonds = polar molecule.', misconception: 'Confusing bond polarity with molecule polarity.', correctsTo: 'Bonds AND shape both matter. CO₂ has polar bonds (O=C=O), but the LINEAR shape means the two bond dipoles point exactly OPPOSITE → they CANCEL out. Net result: CO₂ is NONPOLAR. (Compare to H₂O — also polar bonds, but BENT shape, so dipoles add up and water is polar.)' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['VSEPR: electron domains repel each other.', '4 domains: tetrahedral / trigonal pyramidal / bent depending on lone pairs.', 'Lone pairs squeeze bond angles smaller.', 'Polarity = bond polarity AND molecular shape.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
