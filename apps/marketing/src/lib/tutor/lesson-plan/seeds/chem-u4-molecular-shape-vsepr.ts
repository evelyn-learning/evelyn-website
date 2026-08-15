/**
 * Chemistry — Bonding: Molecular Shapes (VSEPR Theory).
 *
 * Counting electron domains around a central atom to predict three-dimensional
 * shape and bond angle (NGSS HS-PS2-6). The star misconception gets equal
 * billing — reporting the ELECTRON geometry when the question asks for the
 * MOLECULAR shape, because lone pairs are invisible in the drawn molecule.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U4_MOLECULAR_SHAPE_VSEPR: LessonPlan = {
  id: 'evelyn.hs.chem.molecular-shape-vsepr.v1',
  title: 'Molecular Shapes: VSEPR Theory',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.molecular-shape-vsepr',
      standard: 'CHEM-4.4',
      description:
        'Use VSEPR theory to count electron domains around a central atom and predict a molecule’s electron geometry, molecular shape, and approximate bond angles (NGSS HS-PS2-6).',
    },
  ],
  prerequisites: ['chem.naming-compounds-formulas'],
  followUps: ['chem.polarity-intermolecular-forces'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Shape is chemistry’s lock-and-key — a molecule’s three-dimensional arrangement decides what it does in the world.',
      script:
        'Carbon dioxide and water are both one small atom flanked by oxygens, yet CO₂ is a gas that drifts out of a soda and H₂O is a liquid that dissolves half your kitchen. The difference is not what they are made of — it is their SHAPE. CO₂ is a straight line; H₂O is bent like a boomerang. Shape is why a drug molecule fits one receptor and not another, why soap grabs grease, why ice floats. Today you learn the rule that lets you predict shape from nothing but a formula: electron pairs shove each other as far apart as they can get.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vsepr',
      kind: 'concept',
      goal: 'One rule (domains repel), a domain count, and the electron-geometry vs molecular-shape split that trips everyone.',
      keyIdeas: [
        'THE RULE: VSEPR — Valence Shell Electron Pair Repulsion. Groups of electrons around a central atom all carry negative charge, so they repel each other and settle into the arrangement that puts them as FAR APART as possible. That arrangement is the shape.',
        'COUNT DOMAINS, NOT ATOMS — an electron domain is any single blob of electrons on the central atom: one lone pair = one domain, and one BOND = one domain no matter whether it is single, double, or triple. A double bond is fatter, not extra.',
        'DOMAIN COUNT → ELECTRON GEOMETRY — 2 domains: LINEAR, 180°. 3 domains: TRIGONAL PLANAR, 120°. 4 domains: TETRAHEDRAL, 109.5°. 5 domains: TRIGONAL BIPYRAMIDAL, 90° and 120°. 6 domains: OCTAHEDRAL, 90°. Memorize these five — every other shape is one of them with atoms missing.',
        'MOLECULAR SHAPE = WHERE THE ATOMS ARE — you can only see atoms, not lone pairs, so the reported shape names the skeleton of atoms. Four domains gives three different molecular shapes: 0 lone pairs → TETRAHEDRAL (CH₄), 1 lone pair → TRIGONAL PYRAMIDAL (NH₃), 2 lone pairs → BENT (H₂O). Three domains gives two: 0 lone pairs → TRIGONAL PLANAR (BF₃), 1 lone pair → BENT (SO₂).',
        'LONE PAIRS PUSH HARDER — a lone pair is held by only one nucleus, so it spreads out wider and squeezes the bonding pairs together. The ideal 109.5° of a tetrahedral electron geometry drops to about 107° in NH₃ (one lone pair) and about 104.5° in H₂O (two lone pairs). Each lone pair shaves off a few degrees.',
        'SHAPE FEEDS POLARITY — polar bonds only make a POLAR molecule if the shape fails to cancel them. Symmetric shapes with identical outer atoms (linear CO₂, trigonal planar BF₃, tetrahedral CCl₄) cancel; lopsided shapes carrying lone pairs (bent H₂O, trigonal pyramidal NH₃) do not. This is the bridge into intermolecular forces next lesson.',
        'THE TRAP: REPORTING THE ELECTRON GEOMETRY — a student who counts 4 domains on the oxygen in water and answers "tetrahedral" has done the first half correctly and stopped. Water is BENT. Always finish the second step: subtract the lone pairs and name what is left.',
      ],
      vocabulary: [
        { term: 'electron domain', definition: 'one region of electron density on the central atom — a lone pair, or a bond of any order.' },
        { term: 'electron geometry', definition: 'the arrangement of ALL domains, lone pairs included.' },
        { term: 'molecular shape', definition: 'the arrangement of the ATOMS only — what the molecule looks like.' },
        { term: 'bond angle', definition: 'the angle formed at the central atom between two bonds to outer atoms.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ch4',
      kind: 'worked_example',
      problem:
        'Methane, CH₄, has a central carbon single-bonded to four hydrogens and no lone pairs on the carbon. Predict its electron geometry, molecular shape, bond angle, and whether the molecule is polar.',
      steps: [
        'Count domains on the central atom. Carbon has four C–H bonds and zero lone pairs, so it has 4 electron domains.',
        'Four domains repel into the arrangement that spreads them farthest apart in three dimensions: TETRAHEDRAL electron geometry, ideal angle 109.5°. A flat square would force 90° angles — worse repulsion — so the molecule refuses to be flat.',
        'Subtract lone pairs to get the molecular shape. There are none, so every domain holds an atom: the molecular shape is also TETRAHEDRAL.',
        'Bond angle: with no lone pairs squeezing anything, the H–C–H angles stay at the ideal 109.5°.',
        'Polarity: C–H bonds are only faintly polar, and the four identical hydrogens sit at the corners of a symmetric tetrahedron, so any small pulls cancel in every direction. CH₄ is NONPOLAR — which is why it does not dissolve in water and instead bubbles up through it as natural gas.',
      ],
      answer: 'Tetrahedral electron geometry, tetrahedral molecular shape, 109.5° bond angles, nonpolar',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-nh3-lone-pair',
      kind: 'worked_example',
      problem:
        'A student writes: "Ammonia, NH₃, has 4 electron domains on nitrogen, so its shape is tetrahedral with 109.5° angles, just like CH₄." Nitrogen has three N–H bonds and one lone pair. Find the flaw and give the correct shape and angle.',
      steps: [
        'The domain count is right: 3 bonds + 1 lone pair = 4 domains, so the ELECTRON geometry really is tetrahedral. That is the half the student got correct.',
        'The flaw is stopping there. Molecular shape names where the ATOMS are, and one of those four tetrahedral positions holds a lone pair, not a hydrogen. Erase the invisible corner and three hydrogens remain, splayed below the nitrogen like the legs of a tripod.',
        'That skeleton is TRIGONAL PYRAMIDAL, not tetrahedral. Same domain arrangement, different name, because one corner has no atom in it.',
        'The angle also moves. The lone pair is bound to only one nucleus, so it fans out wider than a bonding pair and presses the three N–H bonds closer together: the H–N–H angle drops from 109.5° to about 107°.',
        'Bonus consequence: the lopsided pyramid cannot cancel the polar N–H bonds, so NH₃ is POLAR — it dissolves readily in water, which is exactly why household ammonia comes as a water solution.',
      ],
      answer: 'Trigonal pyramidal, about 107° — the electron geometry is tetrahedral, but the lone pair holds a corner with no atom in it',
      estimatedMinutes: 3,
    },
    {
      id: 'try-water-shape',
      kind: 'try_yourself',
      problem:
        'In a water molecule, H₂O, the central oxygen has two O–H bonds and two lone pairs. What is the MOLECULAR SHAPE of water?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bent — 4 domains give a tetrahedral arrangement, but two corners hold lone pairs, leaving only two atoms', correct: true },
        { id: 'b', text: 'Tetrahedral — the oxygen has 4 electron domains' },
        { id: 'c', text: 'Linear — the formula H₂O is written in a straight line' },
        { id: 'd', text: 'Trigonal pyramidal — the lone pairs push the hydrogens down' },
      ],
      expectedAnswer: 'Bent — 4 domains give a tetrahedral arrangement, but two corners hold lone pairs, leaving only two atoms',
      hints: [
        'Count domains first: 2 bonds + 2 lone pairs. That fixes the ELECTRON geometry. Then ask a second question — where are the ATOMS?',
        'Four tetrahedral corners, two occupied by lone pairs you cannot see. Two hydrogens off a central oxygen at an angle, not a straight line: what is that shape called?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-so2-shape',
      kind: 'try_yourself',
      problem:
        'In sulfur dioxide, SO₂, the central sulfur has two bonds to oxygen (one of them a double bond) and one lone pair. What is the molecular shape of SO₂?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bent — 3 domains give a trigonal planar arrangement with one corner taken by the lone pair', correct: true },
        { id: 'b', text: 'Linear — like CO₂, it is one central atom with two oxygens attached' },
        { id: 'c', text: 'Trigonal planar — sulfur has 3 electron domains' },
        { id: 'd', text: 'Tetrahedral — the double bond counts as two domains, giving 4 in total' },
      ],
      expectedAnswer: 'Bent — 3 domains give a trigonal planar arrangement with one corner taken by the lone pair',
      hints: [
        'A double bond is still ONE domain. Count again: two bonds plus one lone pair.',
        'Three domains spread into a flat triangle at 120°. Now remove the corner that holds the lone pair and name the two-atom skeleton that remains.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Carbon tetrachloride, CCl₄, has a central carbon single-bonded to four chlorine atoms with no lone pairs on the carbon. What is the ideal Cl–C–Cl bond angle, in degrees? Type your answer as a number (a decimal is fine).',
      responseFormat: 'numeric',
      expectedAnswer: '109.5',
      hints: [
        'Count the electron domains on the carbon: four bonds, no lone pairs. Which of the five basic electron geometries does 4 domains give?',
        'Four domains means tetrahedral, and with no lone pairs squeezing anything the angle stays at the ideal tetrahedral value.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-co2-polar',
      kind: 'misconception_check',
      question:
        'A student says: "Each C=O bond in CO₂ is polar, so CO₂ must be a polar molecule." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Polar bonds always make a polar molecule',
          misconception: 'Judging molecular polarity from the bonds alone, skipping the shape step that decides whether the bond pulls cancel.',
          correctsTo:
            'Polarity needs BOTH polar bonds and a shape that fails to cancel them. The carbon in CO₂ has 2 electron domains and no lone pairs, so the molecule is LINEAR: O=C=O. The two bond pulls point in exactly opposite directions along that line and cancel, leaving CO₂ NONPOLAR. Water has equally polar bonds, but its two lone pairs bend it to about 104.5°, so its pulls add instead of canceling and water is polar. Same kind of bonds, opposite result — the shape decided it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'VSEPR in one line: electron domains repel, so they settle as far apart as possible — and that arrangement is the shape.',
        'Count domains, not atoms: every lone pair is one domain, and every bond is one domain whether it is single, double, or triple.',
        'Domain count sets the electron geometry: 2 → linear 180°, 3 → trigonal planar 120°, 4 → tetrahedral 109.5°, 5 → trigonal bipyramidal, 6 → octahedral.',
        'Then subtract the lone pairs to name the MOLECULAR shape: 4 domains gives tetrahedral (CH₄), trigonal pyramidal (NH₃), or bent (H₂O).',
        'Lone pairs push harder than bonds and shave a few degrees off the ideal angle: 109.5° → about 107° in NH₃ → about 104.5° in H₂O.',
        'The trap: answering with the electron geometry when the question asks for the molecular shape — water is bent, not tetrahedral.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Molecular Shapes: VSEPR Theory' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
