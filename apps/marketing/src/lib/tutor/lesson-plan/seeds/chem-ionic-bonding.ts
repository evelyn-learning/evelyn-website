/**
 * HS Chemistry — Ionic Bonding.
 * NGSS HS-PS1-3: structure and properties of substances at bulk scale.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_IONIC_BONDING: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.ionic-bonding.v1',
  title: 'Ionic Bonding',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-3', description: 'Plan and conduct an investigation to gather evidence to compare the structure of substances at the bulk scale to infer the strength of electrical forces between particles.', standard: 'NGSS.HS-PS1-3' }],
  prerequisites: ['hs.chem.periodic-trends'], followUps: ['hs.chem.covalent-bonding-lewis'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in salt.', script: 'Sodium is a metal so reactive it explodes in water. Chlorine is a poisonous yellow gas. Combined: they make TABLE SALT — something you put on french fries. How does that work? IONIC BONDING.', estimatedMinutes: 2 },
    { id: 'concept-formation', kind: 'concept', goal: 'Ionic bonds form when a metal gives an electron to a nonmetal, creating + and − ions.', keyIdeas: [
      'OCTET RULE: atoms want 8 valence electrons (full outer shell, like noble gases).',
      'METALS (left side): few valence electrons → easier to LOSE them.',
      'NONMETALS (right side): nearly full outer shell → easier to GAIN electrons.',
      'IONIC BOND = transfer of electron(s) from metal → nonmetal.',
      'Result: METAL becomes a CATION (+ charge). NONMETAL becomes an ANION (− charge).',
      'Opposite charges ATTRACT → ionic bond.',
      'Example: Na (loses 1 e⁻) → Na⁺. Cl (gains 1 e⁻) → Cl⁻. Together: NaCl.',
      'Atoms reach noble-gas configurations after the transfer (stable!).',
    ], vocabulary: [{ term: 'ion', definition: 'charged atom (gained or lost electrons).' }, { term: 'cation', definition: 'positively charged ion (lost electrons).' }, { term: 'anion', definition: 'negatively charged ion (gained electrons).' }], estimatedMinutes: 5 },
    { id: 'concept-properties', kind: 'concept', goal: 'Ionic compounds form crystal lattices with characteristic properties.', keyIdeas: [
      'IONIC COMPOUNDS form CRYSTAL LATTICES — repeating 3D pattern of + and − ions.',
      '  · Each Na⁺ surrounded by 6 Cl⁻ in NaCl.',
      'PROPERTIES:',
      '  · HIGH MELTING/BOILING points (strong electrostatic forces — NaCl melts at 801°C).',
      '  · BRITTLE: shift the lattice and like charges repel → cracks.',
      '  · CONDUCT electricity ONLY when MELTED or DISSOLVED (ions free to move).',
      '  · Often soluble in WATER (polar water surrounds ions).',
      '  · Solid at room temp.',
      'CHARGE BALANCE: total + must equal total −.',
      '  · MgCl₂: Mg²⁺ + 2 Cl⁻ → balanced.',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'worked-CaCl2', kind: 'worked_example', problem: 'Walk through how calcium and chlorine form CaCl₂.', steps: [
      'Calcium (Ca): Group 2, has 2 valence electrons. Tends to LOSE both.',
      '  · Ca → Ca²⁺ + 2 e⁻.',
      'Chlorine (Cl): Group 17, has 7 valence. Tends to GAIN 1 to reach 8.',
      '  · Cl + 1 e⁻ → Cl⁻.',
      'Charge balance: Ca²⁺ needs to balance with TWO Cl⁻ (each −1).',
      'So one Ca atom transfers electrons to TWO Cl atoms.',
      'Formula: CaCl₂. Ionic compound — solid at room temp, dissolves in water.',
    ], answer: 'Ca loses 2 e⁻ (becomes Ca²⁺); 2 Cl atoms each gain 1 e⁻ (become Cl⁻). Charge balanced: CaCl₂.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Predict the ionic compound formed by aluminum (Al) and oxygen (O). What\'s its formula?', expectedAnswer: 'Al loses 3 e⁻ → Al³⁺. O gains 2 e⁻ → O²⁻. To balance: 2 Al³⁺ (= +6) with 3 O²⁻ (= −6). Formula: Al₂O₃ (aluminum oxide). Same compound that gives sapphires/rubies their structure.', responseFormat: 'free', hints: ['What charges do Al and O take?', 'Use cross-multiplication to balance the charges.'], estimatedMinutes: 3 },
    { id: 'misconception-share-not-transfer', kind: 'misconception_check', question: 'A friend says "in NaCl, Na and Cl share the electron." Right?', commonErrors: [{ answer: 'Yes — they share.', misconception: 'Confusing ionic with covalent.', correctsTo: 'IONIC = TRANSFER (one atom takes the electron, the other loses it). COVALENT = SHARE (both atoms split the electron). NaCl is fully ionic — Na actually loses its electron to Cl. They\'re held by electrostatic attraction between + and −, not by sharing. (Truly 100% ionic is rare; most bonds are partial. But NaCl is close to fully ionic.)' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Ionic bond = electron transfer (metal → nonmetal).', 'Cation = +, Anion = −. Opposite charges attract.', 'Crystal lattice → high melt point, brittle, conducts when dissolved.', 'Always balance total + and − charges.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
