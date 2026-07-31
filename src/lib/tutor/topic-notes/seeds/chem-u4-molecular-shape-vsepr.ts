/**
 * Chemistry — Unit 4 topic 4.4: Molecular Shapes — VSEPR Theory.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u4-molecular-shape-vsepr.ts
 * (planId evelyn.hs.chem.molecular-shape-vsepr.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.molecular-shape-vsepr';
const PLAN_ID = 'evelyn.hs.chem.molecular-shape-vsepr.v1';

export const BASELINE_CHEM_U4_MOLECULAR_SHAPE_VSEPR: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Molecular Shapes: VSEPR Theory',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The rule',
      content:
        'VSEPR = Valence Shell Electron Pair Repulsion. Every group of electrons around a central atom is negative, so they repel and settle into the arrangement that puts them as FAR APART as possible. That arrangement is the shape.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Count domains, not atoms',
      content:
        'An electron domain is one blob of electron density on the central atom: one lone pair = one domain, and one BOND = one domain whether it is single, double, or triple. A double bond is fatter, not extra.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Domain count → electron geometry',
      content:
        '2 domains → LINEAR, 180°. 3 → TRIGONAL PLANAR, 120°. 4 → TETRAHEDRAL, 109.5°. 5 → TRIGONAL BIPYRAMIDAL, 90° and 120°. 6 → OCTAHEDRAL, 90°. Memorize these five; every other shape is one of them with atoms missing. Electron geometry = the arrangement of ALL domains, lone pairs included.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Molecular shape = where the ATOMS are',
      content:
        'Lone pairs are invisible, so the reported shape names the skeleton of atoms only. 4 domains gives three shapes: 0 lone pairs → TETRAHEDRAL (CH₄), 1 → TRIGONAL PYRAMIDAL (NH₃), 2 → BENT (H₂O). 3 domains gives two: 0 lone pairs → TRIGONAL PLANAR (BF₃), 1 → BENT (SO₂).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Lone pairs push harder',
      content:
        'A lone pair is held by only one nucleus, so it spreads wider and squeezes the bonding pairs together. The ideal 109.5° drops to about 107° in NH₃ (one lone pair) and about 104.5° in H₂O (two). Each lone pair shaves off a few degrees. Bond angle = the angle at the central atom between two bonds to outer atoms.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Shape feeds polarity',
      content:
        'Polar bonds only make a POLAR molecule if the shape fails to cancel them. Symmetric shapes with identical outer atoms (linear CO₂, trigonal planar BF₃, tetrahedral CCl₄) cancel; lopsided shapes carrying lone pairs (bent H₂O, trigonal pyramidal NH₃) do not. This is the bridge into intermolecular forces.',
    },
  ],
  methods: [
    {
      title: 'Predict shape and bond angle from a formula',
      when_to_use: 'Asked for electron geometry, molecular shape, bond angle, or polarity of a molecule.',
      steps: [
        'Build or recall the Lewis structure so you know the bonds and lone pairs on the CENTRAL atom.',
        'Count domains: bonds (any order) + lone pairs. That number alone fixes the ELECTRON geometry and the ideal angle.',
        'Subtract the lone pairs and name what is left — that is the MOLECULAR shape.',
        'Adjust the angle downward a few degrees per lone pair (109.5° → ~107° → ~104.5°).',
        'For polarity: no lone pairs on the center AND identical outer atoms → dipoles cancel → nonpolar; otherwise polar.',
      ],
      example: {
        problem: 'Predict everything for NH₃ (three N–H bonds, one lone pair on N).',
        solution:
          '3 bonds + 1 lone pair = 4 domains → tetrahedral ELECTRON geometry, ideal 109.5°. One corner holds a lone pair, so the atom skeleton is TRIGONAL PYRAMIDAL. The lone pair fans out wider and compresses H–N–H to about 107°. The pyramid is lopsided, so the polar N–H bonds do not cancel: NH₃ is POLAR.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Separate electron geometry from molecular shape',
      when_to_use:
        'The domain count is settled but the question asks specifically for the shape (or vice versa).',
      steps: [
        'Say the domain count out loud and name the electron geometry — that is the answer only if the question says "electron geometry".',
        'Count the lone pairs on the central atom. If there are none, the two names are identical and you are done.',
        'If there are lone pairs, mentally erase those corners — no atom sits there.',
        'Name the remaining atom skeleton: 4 domains with 1 lone pair = trigonal pyramidal; with 2 lone pairs = bent; 3 domains with 1 lone pair = bent.',
      ],
      example: {
        problem: 'H₂O: two O–H bonds and two lone pairs on oxygen.',
        solution:
          '4 domains → tetrahedral electron geometry. Two of the four corners hold lone pairs, so only two atoms remain around the oxygen: the molecular shape is BENT, about 104.5°. Answering "tetrahedral" is the classic half-finished answer.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'A double or triple bond is still ONE domain. SO₂ (two bonds, one double, plus one lone pair) has 3 domains, not 4 — so it is bent from trigonal planar.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'The trap: answering with the ELECTRON geometry when the question asked for the MOLECULAR shape. Water is bent, not tetrahedral.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Angles are approximate once lone pairs are present. Write "about 107°" and "about 104.5°", not exactly 109.5°.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Four domains never sit flat. A square would force 90° angles; the tetrahedron spreads them to 109.5°, which is why CH₄ is three-dimensional.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Polar bonds do not guarantee a polar molecule. CO₂ has two polar C=O bonds but is linear, so they cancel — always check the shape before answering.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
  ],
};
