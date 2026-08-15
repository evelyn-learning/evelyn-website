/**
 * Chemistry — Unit 2, Topic 2.4: Electron Configurations & Energy Levels.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u2-electron-configurations.ts
 * (planId evelyn.hs.chem.electron-configurations.v1).
 *
 * Compressed reference notes — shells, subshells, the three filling
 * rules, the notation and its self-check, and the two traps that wreck
 * most student configurations (4s before 3d; overstuffed subshells).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.electron-configurations';
const PLAN_ID = 'evelyn.hs.chem.electron-configurations.v1';

export const BASELINE_CHEM_U2_ELECTRON_CONFIGURATIONS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Electron Configurations & Energy Levels',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Shells, subshells, capacities',
      content:
        'Electrons occupy shells numbered n = 1, 2, 3, ... and each shell splits into subshells labeled s, p, d, f. Capacity follows the orbital count: s has 1 orbital (2 e⁻), p has 3 orbitals (6 e⁻), d has 5 orbitals (10 e⁻), f has 7 orbitals (14 e⁻).',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Pauli exclusion principle',
      content:
        'One orbital holds at most 2 electrons, and those two must have opposite spins. Every capacity number comes from this: 3 p orbitals × 2 = 6, 5 d orbitals × 2 = 10, 7 f orbitals × 2 = 14.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Aufbau principle — order follows energy',
      content:
        'A neutral atom fills the LOWEST-energy subshell available first: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p. The order is not numerical — 4s sits at lower energy than 3d, so 4s fills first. This ordering is why the periodic table has the block shape it does.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Hund\'s rule',
      content:
        'Within one subshell, every orbital takes a single electron before any orbital takes a second. Electrons repel, so they spread out first and pair only when they must. This fixes the count of UNPAIRED electrons — the quantity behind magnetic behavior in iron.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The notation and its self-check',
      content:
        'Shell number, then subshell letter, then the electron count as a superscript: oxygen (8 electrons) is 1s² 2s² 2p⁴. Self-check every time — the superscripts must add to the atomic number, and no subshell may exceed its capacity.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Noble-gas shorthand',
      content:
        'Replace the filled inner core with the previous noble gas in brackets: sodium is [Ne] 3s¹ rather than 1s² 2s² 2p⁶ 3s¹; calcium is [Ar] 4s². Identical information, with the chemically active electrons front and center.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Valence electrons',
      content:
        'All electrons in the highest occupied n shell. They are the only ones that bond, so they set reactivity and ion charge: chlorine\'s [Ne] 3s² 3p⁵ is 7 valence electrons — one short of a full outer shell, which is why it gains one to become Cl⁻. Noble gases have full outer shells and sit out.',
    },
  ],
  methods: [
    {
      title: 'Write a ground-state configuration (Aufbau fill)',
      when_to_use:
        'Given a neutral atom\'s atomic number, produce the full configuration, the noble-gas shorthand, and/or the valence count.',
      steps: [
        'Set the electron budget: a neutral atom has electrons = atomic number. That total is also the answer key.',
        'Fill in Aufbau order — 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, ... — filling each subshell to capacity (s 2, p 6, d 10) while tracking the running total.',
        'Put whatever remains into the next subshell in the order, never exceeding its capacity.',
        'Check the sum of the superscripts against the atomic number.',
        'Shorthand: cut at the last complete noble-gas core and write it in brackets.',
        'Valence: add all electrons in the HIGHEST occupied n shell (both s and p count).',
      ],
      example: {
        problem: 'Phosphorus, atomic number 15 — full configuration, shorthand, and valence count.',
        solution:
          '1s² (2) → 2s² (4) → 2p⁶ (10) → 3s² (12) → 3p³ (15). Full: 1s² 2s² 2p⁶ 3s² 3p³; sum 2+2+6+2+3 = 15 ✓. Shorthand [Ne] 3s² 3p³. Valence = 3s² 3p³ = 5 electrons, so phosphorus needs 3 more and forms three bonds in PH₃ and PCl₃.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Audit a configuration for order and capacity errors',
      when_to_use:
        'A written configuration must be checked or corrected — the two standard failures are wrong filling ORDER and an overstuffed subshell.',
      steps: [
        'Sum the superscripts first. If the total misses the atomic number, electrons were lost or invented; if it matches, the error is order or capacity.',
        'Scan capacities: any s above 2, p above 6, or d above 10 is immediately wrong.',
        'Scan order against the Aufbau sequence, especially the 3p → 4s → 3d stretch. After 3p the next-lowest energy is 4s, NOT 3d.',
        'Rewrite the configuration correctly and give the shorthand.',
        'State the chemical consequence when relevant — order errors misplace the element in the periodic table entirely.',
      ],
      example: {
        problem: 'A student writes calcium (Z = 20) as 1s² 2s² 2p⁶ 3s² 3p⁶ 3d², "because 3d follows 3p in shell 3."',
        solution:
          'The count is fine (2+2+6+2+6+2 = 20) — the ORDER is wrong. After the argon core (18 e⁻), the last 2 go into 4s: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² = [Ar] 4s². The student\'s version would make calcium a transition metal instead of a Group 2 metal that forms Ca²⁺.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Count unpaired electrons with Hund\'s rule',
      when_to_use:
        'Asked how many unpaired electrons a ground-state atom has (or whether it is magnetic).',
      steps: [
        'Write the configuration in Aufbau order.',
        'Discard every FULL subshell — a filled subshell has zero unpaired electrons.',
        'Take the partially filled subshell and count its orbitals (s 1, p 3, d 5, f 7).',
        'Distribute its electrons one per orbital first; only after every orbital has one does pairing begin.',
        'Unpaired count = number of orbitals still holding a lone electron.',
      ],
      example: {
        problem: 'Iron, atomic number 26 — how many unpaired electrons?',
        solution:
          '[Ar] 4s² 3d⁶; only 3d is partial. Six electrons over five d orbitals: five go in singly, the sixth pairs with one of them, leaving 4 orbitals singly occupied → 4 unpaired electrons.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Capacities come from orbital counts: s = 2, p = 6, d = 10, f = 14, because each orbital holds at most 2 electrons (Pauli).',
      kind: 'tip',
    },
    {
      content:
        'Aufbau order follows ENERGY, not shell number: 1s 2s 2p 3s 3p 4s 3d 4p. Potassium is [Ar] 4s¹, not [Ar] 3d¹ — skipping 4s is trap number one.',
      kind: 'common-error',
    },
    {
      content:
        'Never overstuff a subshell. Writing 2p⁸ or 3p⁷ is trap number two — a p subshell stops at 6 no matter how many electrons are left to place; move to the next subshell instead.',
      kind: 'common-error',
    },
    {
      content:
        'Self-check every configuration: the superscripts must sum to the atomic number. On a multiple-choice item this alone eliminates most wrong options before you check anything else.',
      kind: 'tip',
    },
    {
      content:
        'Valence = ALL electrons in the highest occupied shell, s and p together — [Ne] 3s² 3p⁵ is 7 valence electrons (not 5, not 17), so the atom gains one electron and forms a 1− ion. And orbitals are probability clouds, not circular tracks: 2p⁶ means three differently-oriented p orbitals holding two electrons each, which is exactly why Hund\'s rule can spread electrons out.',
      kind: 'gotcha',
    },
  ],
};
