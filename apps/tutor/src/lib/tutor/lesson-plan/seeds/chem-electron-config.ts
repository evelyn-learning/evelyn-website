/**
 * HS Chemistry — Electron Configuration.
 * NGSS HS-PS1-1: periodic patterns based on electron arrangement.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_ELECTRON_CONFIG: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.electron-config.v1',
  title: 'Electron Configuration',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-1', description: 'Use the periodic table as a model to predict the relative properties of elements based on the patterns of electrons in the outermost energy level of atoms.', standard: 'NGSS.HS-PS1-1' }],
  prerequisites: ['hs.chem.atomic-structure'], followUps: ['hs.chem.periodic-trends'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in why electrons matter.', script: 'Why does sodium explode in water but neon does nothing? Why does gold stay shiny but iron rusts? The answer is in how their ELECTRONS are arranged. Electron configuration explains all of chemistry.', estimatedMinutes: 2 },
    { id: 'concept-shells-orbitals', kind: 'concept', goal: 'Electrons live in shells, subshells (s, p, d, f), and orbitals.', keyIdeas: [
      'ELECTRONS occupy ENERGY LEVELS (shells), labeled n = 1, 2, 3...',
      'Each shell has SUBSHELLS: s, p, d, f.',
      '  · s: 1 orbital, holds 2 electrons.',
      '  · p: 3 orbitals, holds 6.',
      '  · d: 5 orbitals, holds 10.',
      '  · f: 7 orbitals, holds 14.',
      'PAULI EXCLUSION: each orbital holds max 2 electrons (with opposite spin).',
      'AUFBAU PRINCIPLE: fill lowest-energy orbitals first.',
      'Order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d ...',
      'HUND\'S RULE: in a subshell, fill each orbital singly before pairing.',
    ], vocabulary: [{ term: 'orbital', definition: 'region around nucleus where an electron is likely.' }, { term: 'subshell', definition: 's, p, d, or f group of orbitals.' }, { term: 'Aufbau', definition: 'rule: fill lowest energy first.' }], estimatedMinutes: 5 },
    { id: 'concept-notation', kind: 'concept', goal: 'Write electron configurations using shell notation.', keyIdeas: [
      'NOTATION: shell # + subshell letter + (electrons as superscript).',
      'Example: oxygen (8 electrons) = 1s² 2s² 2p⁴.',
      'NOBLE GAS SHORTHAND: use the previous noble gas in brackets.',
      '  · Sodium (11 e⁻): [Ne] 3s¹ instead of 1s² 2s² 2p⁶ 3s¹.',
      'VALENCE ELECTRONS = outermost shell electrons. They determine chemistry.',
      'Group # on periodic table tells you valence count (Group 1 = 1, Group 2 = 2, Group 17 = 7).',
      'Noble gases have FULL outer shells = stable (don\'t react).',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'worked-iron', kind: 'worked_example', problem: 'Write the electron configuration for iron (Fe, atomic number 26).', steps: [
      'Iron has 26 electrons total.',
      'Fill in Aufbau order:',
      '  · 1s² (2) → 2s² (4) → 2p⁶ (10) → 3s² (12) → 3p⁶ (18) → 4s² (20) → 3d⁶ (26).',
      'Full notation: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶.',
      'Noble gas shorthand: [Ar] 4s² 3d⁶.',
      'Note: 4s fills before 3d (lower energy), but 3d is shown before 4s by convention when reordered.',
    ], answer: 'Fe: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶ or [Ar] 4s² 3d⁶.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Write the electron configuration for chlorine (Cl, atomic number 17). How many valence electrons?', expectedAnswer: 'Cl: 1s² 2s² 2p⁶ 3s² 3p⁵ or [Ne] 3s² 3p⁵. VALENCE = 7 electrons (3s² 3p⁵ in shell n=3). It needs 1 more to complete its octet → very reactive (gains an electron to become Cl⁻).', responseFormat: 'free', hints: ['Fill in Aufbau order until 17 electrons placed.', 'Valence = electrons in highest n shell.'], estimatedMinutes: 3 },
    { id: 'misconception-electrons-orbit', kind: 'misconception_check', question: 'A friend says "electrons orbit the nucleus like planets orbit the sun." Right?', commonErrors: [{ answer: 'Yes — orbit like planets.', misconception: 'Solar system model of atom.', correctsTo: 'That\'s the BOHR model — useful for intro but WRONG. Electrons don\'t follow fixed paths. They exist in PROBABILITY CLOUDS (orbitals) where they\'re LIKELY to be found. A 1s orbital is sphere-shaped; p orbitals are dumbbell-shaped. Quantum mechanics replaced the planetary model nearly 100 years ago.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Electrons fill: 1s 2s 2p 3s 3p 4s 3d 4p ...', 's=2, p=6, d=10, f=14 electrons per subshell.', 'Valence electrons = outermost shell, determine chemistry.', 'Noble gases have full outer shells = unreactive.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
