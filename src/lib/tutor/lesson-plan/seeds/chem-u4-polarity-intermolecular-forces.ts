/**
 * Chemistry — Bonding: Bond Polarity & Intermolecular Forces.
 *
 * From electronegativity difference to bond dipoles, from bond dipoles plus
 * shape to molecular polarity, and from molecular polarity to the forces
 * BETWEEN molecules that set boiling point, solubility, and state
 * (NGSS HS-PS1-3, HS-PS2-6). The two star traps get equal billing: "polar
 * bonds means a polar molecule" (CO₂ says no) and "boiling breaks the
 * covalent bonds" (it does not).
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U4_POLARITY_INTERMOLECULAR_FORCES: LessonPlan = {
  id: 'evelyn.hs.chem.polarity-intermolecular-forces.v1',
  title: 'Bond Polarity & Intermolecular Forces',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.polarity-intermolecular-forces',
      standard: 'CHEM-4.5',
      description:
        'Use electronegativity differences and molecular shape to classify bonds and molecules as polar or nonpolar, identify the intermolecular forces present, and use those forces to explain boiling point, solubility, and state of matter (NGSS HS-PS1-3, HS-PS2-6).',
    },
  ],
  prerequisites: ['chem.molecular-shape-vsepr'],
  followUps: ['chem.balancing-equations'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Forces BETWEEN molecules — not the atoms inside them — decide whether a substance is a gas you exhale or a liquid you drink.',
      script:
        'Water is a liquid you can swim in at room temperature. Carbon dioxide, a HEAVIER molecule, is a gas you exhale. Same three-atom size class, wildly different behavior — and nothing about the atoms inside explains it. The difference is what happens BETWEEN molecules: water molecules cling to each other with a force strong enough to hold a paperclip on the surface of a glass, and CO₂ molecules barely notice each other at all. Today you learn to look at any formula, decide where the electrons sit unevenly, decide whether the whole molecule ends up lopsided, and from that predict how it boils, what it dissolves in, and why soap can pull grease off a plate that plain water walks right past.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-polarity-imf',
      kind: 'concept',
      goal: 'A two-stage chain — electronegativity difference sets bond polarity, bond polarity plus shape sets molecular polarity, molecular polarity sets the intermolecular force — plus the two classic traps.',
      keyIdeas: [
        'STAGE 1 — BOND POLARITY IS A SUBTRACTION: take the electronegativity difference ΔEN between the two bonded atoms. ΔEN below 0.4 → nonpolar covalent (electrons shared evenly, as in H–H or C–H). ΔEN from 0.4 to 1.7 → polar covalent (shared, but pulled toward the greedier atom). ΔEN above 1.7 → ionic (electrons transferred outright, as in Na–Cl). The MORE electronegative atom takes the partial negative end; its partner is left partially positive. That separated pair of partial charges is called a dipole.',
        'STAGE 2 — MOLECULAR POLARITY IS BOND DIPOLES PLUS SHAPE: bond dipoles are arrows, and arrows can cancel. Add them up in the geometry VSEPR gave you. If they cancel exactly, the molecule is NONPOLAR no matter how polar the individual bonds are. If they do not cancel, the leftover is the molecule\'s net dipole and the molecule is POLAR.',
        'THE SHAPE TEST — a fast screen: if the central atom has NO lone pairs AND every outer atom is identical, the arrangement is symmetric and the dipoles cancel → nonpolar (CO₂ linear, BF₃ trigonal planar, CH₄ and CCl₄ tetrahedral). Break either condition — a lone pair on the central atom, or one outer atom swapped — and the symmetry breaks → polar (H₂O bent, NH₃ trigonal pyramidal, CHCl₃).',
        'INTERMOLECULAR FORCES PULL BETWEEN MOLECULES, NOT INSIDE THEM — a covalent bond holds atoms together WITHIN a molecule; an intermolecular force (IMF) is the much weaker attraction of one whole molecule for its neighbor, typically only a few percent as strong. Melting and boiling pull molecules APART from each other; they do not break the bonds inside.',
        'THE THREE IMFs, WEAKEST TO STRONGEST — (1) London dispersion: momentary lopsided electron clouds attract neighbors; present in EVERY substance, and it grows stronger as the molecule gets larger and has more electrons. (2) Dipole–dipole: permanent positive ends of polar molecules attracted to the negative ends of their neighbors. (3) Hydrogen bonding: the strongest, a special extra-powerful dipole–dipole that appears only when H is bonded DIRECTLY to N, O, or F and reaches for a lone pair on another N, O, or F.',
        'IMF STRENGTH SETS PHYSICAL PROPERTIES — stronger IMFs mean higher boiling and melting points, higher viscosity and surface tension, and a lower vapor pressure, because more energy is needed to tear the molecules apart. Solubility follows the same logic: LIKE DISSOLVES LIKE, so polar water dissolves polar sugar and ionic salt but not nonpolar oil.',
        'THE TRAP — POLAR BONDS DO NOT GUARANTEE A POLAR MOLECULE: CO₂ has two strongly polar C=O bonds (ΔEN = 1.0 each), yet the molecule is nonpolar because the linear shape points those two dipoles in exactly opposite directions and they cancel. You must always check the shape before you answer.',
        'THE SECOND TRAP — HYDROGEN BONDING NEEDS H ON N, O, OR F: HCl is polar and its molecules attract by dipole–dipole, but there is no hydrogen bonding, because Cl does not qualify. And "hydrogen bond" is not a bond made of hydrogen inside a molecule — it is an attraction between molecules.',
      ],
      vocabulary: [
        { term: 'electronegativity difference (ΔEN)', definition: 'the gap between two bonded atoms\' electronegativities; it classifies the bond as nonpolar covalent, polar covalent, or ionic.' },
        { term: 'dipole', definition: 'a separation of partial positive and partial negative charge across a bond or a whole molecule.' },
        { term: 'intermolecular force', definition: 'an attraction between separate molecules, far weaker than the covalent bonds inside them.' },
        { term: 'hydrogen bond', definition: 'the strongest intermolecular force, formed when H bonded to N, O, or F is attracted to a lone pair on another N, O, or F.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-hcl-chain',
      kind: 'worked_example',
      problem:
        'For hydrogen chloride, HCl: classify the H–Cl bond, decide whether the molecule is polar, and name the strongest intermolecular force between HCl molecules. Use electronegativities H = 2.1 and Cl = 3.0.',
      steps: [
        'Stage 1 — bond polarity: ΔEN = 3.0 − 2.1 = 0.9. That lands in the 0.4 to 1.7 window, so H–Cl is a POLAR COVALENT bond. Chlorine, the more electronegative atom, holds the shared pair closer and carries the partial negative end; hydrogen carries the partial positive end.',
        'Stage 2 — molecular polarity: HCl has only two atoms, so there is exactly one bond dipole and nothing for it to cancel against. A diatomic molecule made of two DIFFERENT atoms is always polar. HCl is POLAR.',
        'Now the intermolecular force. London dispersion is present, as it is in everything. Because the molecule is polar, dipole–dipole attraction is also present, and it is the stronger of the two.',
        'Check for hydrogen bonding: the H is bonded to Cl, and Cl is not on the N/O/F list. No hydrogen bonding, even though people often guess it whenever they see a hydrogen atom.',
        'Answer: polar covalent bond (ΔEN = 0.9), polar molecule, strongest IMF is dipole–dipole. That is why HCl boils at about −85 °C while water, which DOES hydrogen bond, holds on all the way to 100 °C.',
      ],
      answer: 'ΔEN = 0.9 → polar covalent bond; HCl is a polar molecule; strongest IMF is dipole–dipole (no hydrogen bonding, because Cl is not N, O, or F)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-co2-vs-water',
      kind: 'worked_example',
      problem:
        'A student argues: "CO₂ has polar C=O bonds, so CO₂ must be a polar molecule — it should behave like water." Find the flaw, and use it to explain why CO₂ is a gas at room temperature while water is a liquid. Use electronegativities C = 2.5, O = 3.5, H = 2.1.',
      steps: [
        'The student got stage 1 right. ΔEN for C=O is 3.5 − 2.5 = 1.0, comfortably polar covalent, with each oxygen carrying the partial negative end. Two genuinely polar bonds.',
        'The flaw is skipping stage 2. The central carbon in CO₂ has two electron domains and NO lone pairs, so VSEPR gives a LINEAR shape, O=C=O, with the bonds 180° apart.',
        'That points the two bond dipoles in exactly opposite directions with exactly equal size, so they cancel completely. Net dipole zero → CO₂ is a NONPOLAR molecule despite its polar bonds.',
        'Now water for contrast: ΔEN for O–H is 3.5 − 2.1 = 1.4, so the bonds are even more polar, AND the oxygen carries two lone pairs, which forces a BENT shape near 104.5°. Bent means the two dipoles do not oppose each other; they add to a strong net dipole pointing at the oxygen. Water is POLAR.',
        'Cash it out as forces. Nonpolar CO₂ molecules attract only by weak London dispersion, so they escape into the gas phase easily and CO₂ is a gas at room temperature (subliming at about −78 °C). Polar water has H bonded directly to O, so its molecules HYDROGEN BOND to each other — strong enough to keep water liquid to 100 °C even though a CO₂ molecule is heavier.',
        'The moral: always run both stages. Bond polarity alone never decides molecular polarity.',
      ],
      answer: 'The flaw is stopping at bond polarity: CO₂ is linear, so its two equal C=O dipoles cancel and the molecule is nonpolar (dispersion only, a gas); water is bent, so its O–H dipoles add and it hydrogen bonds (a liquid to 100 °C)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cancel-or-not',
      kind: 'try_yourself',
      problem:
        'Each of the following molecules contains polar bonds. Which one is NONPOLAR overall? CCl₄ (tetrahedral, no lone pairs on C, four identical Cl atoms), CHCl₃ (tetrahedral, three Cl and one H), H₂O (bent), or NH₃ (trigonal pyramidal).',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'CCl₄ — four identical polar bonds arranged symmetrically, so the dipoles cancel', correct: true },
        { id: 'b', text: 'CHCl₃ — the C–H bond is nearly nonpolar, so the whole molecule is nonpolar' },
        { id: 'c', text: 'H₂O — the two O–H dipoles point away from each other and cancel' },
        { id: 'd', text: 'None of them — any molecule with polar bonds is a polar molecule' },
      ],
      expectedAnswer: 'CCl₄ — four identical polar bonds arranged symmetrically, so the dipoles cancel',
      hints: [
        'Run the shape test: no lone pairs on the central atom AND every outer atom identical means the dipoles cancel.',
        'Three of these break symmetry — two by a lone pair on the central atom, one by a swapped outer atom. Only one survives the test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-boiling-point',
      kind: 'try_yourself',
      problem:
        'Water (H₂O) boils at 100 °C, while hydrogen sulfide (H₂S) boils at about −60 °C — even though an H₂S molecule is heavier and both molecules are bent. What best explains the enormous gap?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'H₂O molecules hydrogen bond to each other because H is bonded directly to O; H₂S cannot, so only weaker forces hold it together', correct: true },
        { id: 'b', text: 'The O–H covalent bonds are stronger than the S–H bonds, so boiling water takes more energy to break them' },
        { id: 'c', text: 'H₂S is a nonpolar molecule, so it has no intermolecular forces at all' },
        { id: 'd', text: 'H₂S is heavier, and heavier molecules always boil at lower temperatures' },
      ],
      expectedAnswer: 'H₂O molecules hydrogen bond to each other because H is bonded directly to O; H₂S cannot, so only weaker forces hold it together',
      hints: [
        'Boiling separates molecules from each other — it never breaks the covalent bonds inside them. So compare the forces BETWEEN molecules.',
        'Hydrogen bonding requires H bonded directly to N, O, or F. Which of these two molecules qualifies?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Methanol, CH₃OH, contains both a C–O bond and an O–H bond. Using the electronegativity values H = 2.1, C = 2.5, and O = 3.5, calculate the electronegativity difference of the MORE polar of those two bonds. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '1.4',
      hints: [
        'Find ΔEN for each bond separately by subtracting the smaller electronegativity from the larger one.',
        'C–O gives 3.5 − 2.5, and O–H gives 3.5 − 2.1. Report the larger of those two differences.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-nonpolar-no-forces',
      kind: 'misconception_check',
      question:
        'A student says: "Iodine, I₂, is made of two identical atoms, so it has no polar bonds and therefore no forces between its molecules at all — it should be a gas like H₂." Iodine is actually a purple SOLID at room temperature. What is wrong with the reasoning?',
      commonErrors: [
        {
          answer: 'Nonpolar means no intermolecular forces',
          misconception: 'Treating London dispersion as optional — assuming attraction requires a permanent dipole.',
          correctsTo:
            'London dispersion forces exist in EVERY substance, polar or not: electron clouds are constantly sloshing, and a momentary lopsided cloud induces a matching one in the neighbor. Dispersion gets stronger as a molecule gets bigger and holds more electrons, so it is not always negligible. An I₂ molecule carries 106 electrons in a huge, easily distorted cloud — the dispersion is strong enough to make iodine a solid, while tiny H₂ (2 electrons) boils at about −253 °C. Watch the same trend down the halogens: F₂ and Cl₂ are gases, Br₂ is a liquid, I₂ is a solid, all of them nonpolar.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Stage 1 — bond polarity is a subtraction: ΔEN below 0.4 nonpolar covalent, 0.4 to 1.7 polar covalent, above 1.7 ionic; the more electronegative atom takes the partial negative end.',
        'Stage 2 — molecular polarity is bond dipoles PLUS shape: no lone pairs on the central atom and identical outer atoms means symmetric and the dipoles cancel (CO₂, CCl₄); break either condition and the molecule is polar (H₂O, NH₃, CHCl₃).',
        'Intermolecular forces act BETWEEN molecules and are far weaker than the bonds inside — boiling separates molecules, it does not break covalent bonds.',
        'Weakest to strongest: London dispersion (in everything, grows with size and electron count) < dipole–dipole (polar molecules) < hydrogen bonding (H bonded directly to N, O, or F).',
        'Stronger IMFs mean higher boiling and melting points, higher surface tension, and "like dissolves like" — which is why water dissolves salt and sugar but never oil.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.5', cedTitle: 'Bond Polarity & Intermolecular Forces' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
