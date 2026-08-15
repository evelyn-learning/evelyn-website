/**
 * Chemistry — Atomic Structure: Electron Configurations & Energy Levels.
 *
 * Where every element's personality comes from (NGSS HS-PS1-1): shells,
 * subshells, and the Aufbau order that fills them. The two classic traps
 * get equal billing — 4s fills before 3d, and a p subshell never holds
 * more than 6 electrons.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U2_ELECTRON_CONFIGURATIONS: LessonPlan = {
  id: 'evelyn.hs.chem.electron-configurations.v1',
  title: 'Electron Configurations & Energy Levels',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.electron-configurations',
      standard: 'CHEM-2.4',
      description:
        'Write ground-state electron configurations for atoms using the Aufbau order, the Pauli exclusion principle, and Hund\'s rule, and use the outermost energy level to predict an element\'s chemical behavior (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.average-atomic-mass'],
  followUps: ['chem.periodic-table-organization'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Fireworks colors as visible proof that electrons live in fixed energy levels — and that those levels decide everything an element does.',
      script:
        'Every color in a fireworks show is an element signing its name. Strontium burns scarlet, copper burns blue-green, sodium burns that highway-lamp orange — always the same color, every single time. That is not a dye; it is electrons. Heat kicks an electron up to a higher energy level, and when it falls back it releases exactly one color of light, because the levels it falls between are fixed. Today we map those levels and learn to write out where every electron in an atom sits. Get this right and the rest of chemistry stops being memorization: bonding, reactivity, ion charges, the shape of the periodic table itself all fall out of this one arrangement.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-configurations',
      kind: 'concept',
      goal: 'The filling rules and the notation, plus the two errors that wreck most student configurations.',
      keyIdeas: [
        'ENERGY LEVELS AND SUBSHELLS — electrons occupy shells numbered n = 1, 2, 3, ... and each shell splits into subshells labeled s, p, d, f. Capacities are fixed by the number of orbitals: s has 1 orbital (2 e⁻), p has 3 orbitals (6 e⁻), d has 5 orbitals (10 e⁻), f has 7 orbitals (14 e⁻).',
        'PAULI EXCLUSION PRINCIPLE — one orbital holds at most 2 electrons, and those two must have opposite spins. This is where every capacity number above comes from: 3 p orbitals × 2 = 6, 5 d orbitals × 2 = 10.',
        'AUFBAU PRINCIPLE — a neutral atom fills the LOWEST-energy subshell available first, in this order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p. Notice the order is not numerical: the 4s subshell sits at lower energy than 3d, so it fills first.',
        'HUND\'S RULE — within one subshell, every orbital gets a single electron before any orbital gets a second. Electrons repel, so they spread out first and pair up only when they must. This sets the count of UNPAIRED electrons, which is what makes iron magnetic.',
        'THE NOTATION — shell number, then subshell letter, then the electron count as a superscript: oxygen (8 electrons) is 1s² 2s² 2p⁴. Self-check: the superscripts must add up to the atomic number, every time.',
        'NOBLE-GAS SHORTHAND — replace the filled inner core with the previous noble gas in brackets: sodium is [Ne] 3s¹ rather than 1s² 2s² 2p⁶ 3s¹. Same information, and it puts the chemically interesting electrons front and center.',
        'VALENCE ELECTRONS — the electrons in the highest occupied n shell. They are the only ones that bond, so they decide reactivity and ion charge: chlorine\'s [Ne] 3s² 3p⁵ is 7 valence electrons, one short of a full outer shell, which is exactly why it grabs an electron to become Cl⁻. Noble gases have full outer shells and sit out.',
        'THE TWO TRAPS — (1) skipping 4s and jumping straight from 3p to 3d; potassium is [Ar] 4s¹, not [Ar] 3d¹. (2) overstuffing a subshell: writing 2p⁸ or 3p⁷. A p subshell never exceeds 6 electrons no matter how many are left to place.',
      ],
      vocabulary: [
        { term: 'orbital', definition: 'a region around the nucleus where an electron is likely to be found; it holds at most 2 electrons.' },
        { term: 'Aufbau principle', definition: 'the rule that electrons fill the lowest-energy subshell available before moving to a higher one.' },
        { term: 'Hund\'s rule', definition: 'within a subshell, electrons occupy separate orbitals singly before any orbital is doubled up.' },
        { term: 'valence electrons', definition: 'the electrons in an atom\'s highest occupied energy level — the ones that participate in bonding.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-phosphorus',
      kind: 'worked_example',
      problem:
        'Write the full and noble-gas-shorthand ground-state electron configurations for phosphorus (P, atomic number 15), then state how many valence electrons it has.',
      steps: [
        'Atomic number 15 means a neutral phosphorus atom has 15 electrons to place. That total is also the answer key: the superscripts must sum to 15.',
        'Fill in Aufbau order, tracking the running total: 1s² (2 placed) → 2s² (4) → 2p⁶ (10) → 3s² (12). Twelve down, three electrons left.',
        'Next subshell in the order is 3p, which can hold 6. Only 3 electrons remain, so it takes 3p³ — and by Hund\'s rule those three sit in the three separate p orbitals, one apiece, all unpaired.',
        'Full configuration: 1s² 2s² 2p⁶ 3s² 3p³. Check the sum: 2 + 2 + 6 + 2 + 3 = 15. ✓',
        'The inner core 1s² 2s² 2p⁶ is exactly neon, so the shorthand is [Ne] 3s² 3p³.',
        'Valence electrons live in the highest occupied shell, n = 3: that is 3s² 3p³, so 2 + 3 = 5 valence electrons. Five valence electrons means phosphorus needs 3 more to fill its outer shell — which is why it forms three bonds in PH₃ and PCl₃.',
      ],
      answer: 'P: 1s² 2s² 2p⁶ 3s² 3p³ = [Ne] 3s² 3p³, with 5 valence electrons',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-4s-before-3d',
      kind: 'worked_example',
      problem:
        'A student writes calcium (Ca, atomic number 20) as 1s² 2s² 2p⁶ 3s² 3p⁶ 3d², reasoning that "3d comes right after 3p because they are both in shell 3." Find the flaw and write the correct configuration.',
      steps: [
        'Start with what is right: the electron count is fine. 2 + 2 + 6 + 2 + 6 + 2 = 20, so the student placed all 20 electrons. The error is not arithmetic — it is ORDER.',
        'The Aufbau order is set by ENERGY, not by shell number. After 3p, the next-lowest-energy subshell is 4s, not 3d — the 3d subshell sits slightly higher in energy even though its shell number is smaller.',
        'So after 1s² 2s² 2p⁶ 3s² 3p⁶ (that is 18 electrons, the argon core), the last 2 electrons go into 4s, giving 4s².',
        'Correct configuration: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s², or [Ar] 4s².',
        'This is not a bookkeeping detail — it is the reason the periodic table is shaped the way it is. Potassium and calcium start row 4 in the s-block because their outermost electrons are 4s; the 3d block (scandium through zinc) only begins afterward. Predicting from the student\'s version, calcium would be a transition metal instead of a Group 2 alkaline earth metal that forms Ca²⁺.',
      ],
      answer: 'Ca: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² = [Ar] 4s² — 4s fills before 3d because Aufbau order follows energy, not shell number',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sulfur-config',
      kind: 'try_yourself',
      problem: 'Which is the correct ground-state electron configuration for sulfur (S, atomic number 16)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1s² 2s² 2p⁶ 3s² 3p⁴', correct: true },
        { id: 'b', text: '1s² 2s² 2p⁸ 3s² 3p⁴' },
        { id: 'c', text: '1s² 2s² 2p⁶ 3s² 3d⁴' },
        { id: 'd', text: '1s² 2s² 2p⁶ 3s² 3p⁶' },
      ],
      expectedAnswer: '1s² 2s² 2p⁶ 3s² 3p⁴',
      hints: [
        'Run the self-check first: the superscripts must add up to 16. Two of these choices fail that test immediately.',
        'Then check capacities and order — a p subshell stops at 6 electrons, and 3p fills completely before anything reaches 3d.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-valence-reading',
      kind: 'try_yourself',
      problem: 'An atom has the ground-state configuration [Ne] 3s² 3p⁵. Which statement about it is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It has 7 valence electrons and needs one more to fill its outer shell, so it readily gains an electron to form a 1− ion', correct: true },
        { id: 'b', text: 'It has 5 valence electrons, since only the 3p electrons count as valence' },
        { id: 'c', text: 'It has 17 valence electrons, since the atom has 17 electrons in total' },
        { id: 'd', text: 'It has 2 valence electrons, since only the s subshell counts as valence' },
      ],
      expectedAnswer: 'It has 7 valence electrons and needs one more to fill its outer shell, so it readily gains an electron to form a 1− ion',
      hints: [
        'Valence electrons are ALL the electrons in the highest occupied shell — here that is everything with n = 3.',
        'Add the 3s and 3p electrons. A full third shell of s and p holds 8, so how far short is this atom, and which way will it move to fix that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Iron (Fe) has atomic number 26. Fill its 26 electrons in Aufbau order (1s, 2s, 2p, 3s, 3p, 4s, 3d), then apply Hund\'s rule to the last subshell: the d subshell has 5 orbitals, and every orbital takes one electron before any orbital takes a second. How many UNPAIRED electrons does a ground-state iron atom have? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Place the electrons in order: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² accounts for 20, leaving 6 for 3d — so the configuration is [Ar] 4s² 3d⁶. Every subshell except 3d is completely full, and full subshells have no unpaired electrons.',
        'Spread those 6 electrons across the 5 d orbitals one at a time: the first 5 go in singly, then the 6th must pair up with one of them. Count how many orbitals are left holding a lone electron.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-planetary-orbits',
      kind: 'misconception_check',
      question:
        'A student says: "Electron configurations are just a list of the circular orbits electrons travel in, like planets going around the sun — 2p⁶ means six electrons sharing one track." What is wrong with this picture?',
      commonErrors: [
        {
          answer: 'Electrons travel fixed circular orbits around the nucleus',
          misconception: 'The solar-system (Bohr) model of the atom — treating energy levels as physical tracks and orbitals as paths.',
          correctsTo:
            'That is the Bohr model, and it was replaced nearly a century ago. Electrons do not follow paths at all; an orbital is a PROBABILITY CLOUD — a region where an electron is likely to be found. A 1s orbital is spherical, p orbitals are dumbbell-shaped and point along three perpendicular directions. So 2p⁶ is not six electrons on one track: it is three differently-oriented p orbitals holding two electrons each, and the fact that they are separate orbitals is exactly why Hund\'s rule spreads electrons out before pairing them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Capacities come from orbital counts: s = 2, p = 6, d = 10, f = 14 electrons, because each orbital holds at most 2 (Pauli).',
        'Aufbau order follows ENERGY, not shell number: 1s 2s 2p 3s 3p 4s 3d 4p — 4s fills before 3d.',
        'Hund\'s rule: within a subshell, spread one electron per orbital before pairing any up.',
        'Always self-check: the superscripts must sum to the atomic number, and no p subshell ever exceeds 6.',
        'Valence electrons = all electrons in the highest occupied shell; they set reactivity and ion charge (3s² 3p⁵ → 7 valence → forms a 1− ion).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Electron Configurations & Energy Levels' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
