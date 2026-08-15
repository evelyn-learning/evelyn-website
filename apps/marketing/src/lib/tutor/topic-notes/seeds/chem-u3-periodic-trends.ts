/**
 * Chemistry — Unit 3.2: Periodic Trends (Atomic Radius, Ionization Energy,
 * Electronegativity).
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u3-periodic-trends.ts
 * (planId evelyn.hs.chem.periodic-trends.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.periodic-trends';

export const BASELINE_CHEM_U3_PERIODIC_TRENDS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.periodic-trends.v1',
  course: 'Chemistry',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Periodic Trends: Atomic Radius, Ionization Energy & Electronegativity',
  planId: 'evelyn.hs.chem.periodic-trends.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.periodic-trends.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The engine: effective nuclear charge',
      content:
        'Effective nuclear charge is the net pull a VALENCE electron actually feels: protons attract it, inner-shell electrons SHIELD it and cancel part of that pull. Every trend on the table reduces to this one tug-of-war — count protons, count shielding shells, and the direction follows.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Across a period (left → right)',
      content:
        'Each step adds a proton but adds the new electron to the SAME shell, so shielding is nearly unchanged. Net pull STRENGTHENS and the cloud is drawn in tighter: radius SHRINKS, ionization energy RISES, electronegativity RISES.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Down a group (top → bottom)',
      content:
        'Each step adds a whole new shell. Valence electrons sit farther out and behind more shielding, so net pull on them WEAKENS: radius GROWS, ionization energy FALLS, electronegativity FALLS.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Ionization energy',
      content:
        'The energy needed to remove one electron from a neutral gaseous atom. Tightly held electrons — small atoms, high effective nuclear charge — cost more. Metals on the left surrender electrons cheaply, which is exactly WHY they form positive ions.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Electronegativity',
      content:
        'How strongly a BONDED atom pulls on the electrons it shares. Fluorine, top right, is the maximum; noble gases sit out of the ranking because they rarely bond. This one number decides ionic vs covalent character later in the course.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Corner rule',
      content:
        'All three grip trends point diagonally toward fluorine (top right): smallest radius, highest ionization energy, highest electronegativity. The opposite corner, bottom left (Fr/Cs region), holds the largest and most easily ionized atoms.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Successive ionization energies',
      content:
        'IE₁ < IE₂ < IE₃ … always climbs, because pulling an electron off an already-positive ion is harder. The informative feature is the JUMP: a sudden multi-fold spike means the next electron is coming out of the stable noble-gas core. Electrons removed BEFORE the jump = the valence count.',
    },
  ],
  methods: [
    {
      title: 'Rank atoms by radius from position alone',
      when_to_use: 'Given a set of elements and asked to order them by size (or by ionization energy / electronegativity, which run opposite to size).',
      steps: [
        'Check whether the atoms share a PERIOD or a GROUP — that decides which mechanism is in play.',
        'Same period → same shell count, so shells cannot decide it. Count PROTONS: more protons on the same shell = stronger pull = smaller atom, so radius decreases left to right.',
        'Same group → shell count decides it: more shells = larger atom, so radius increases top to bottom.',
        'Mixed cases: move to a shared row or column first, or use the corner rule (small/high-grip toward fluorine, large/low-grip toward the bottom left).',
        'Flip the ordering to answer ionization energy or electronegativity — they are the inverse of radius.',
      ],
      example: {
        problem: 'Rank Na, Al, and Cl (all Period 3) from largest to smallest atomic radius.',
        solution:
          'Same period → same three shells, so pull strength decides. Protons: Na 11, Al 13, Cl 17, with shielding nearly constant. Cl pulls its valence shell in hardest → smallest; Na pulls weakest → largest. Ranking: Na > Al > Cl.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Explain a trend using effective nuclear charge',
      when_to_use: 'When the question asks WHY, not just which — an explanation has to name protons and shielding, not just the direction.',
      steps: [
        'State the direction of travel (across a period, or down a group).',
        'Say what happens to PROTON COUNT on that path.',
        'Say what happens to SHIELDING / shell count on that path.',
        'Combine into the net effective nuclear charge on the valence electron: stronger or weaker.',
        'Convert net pull to the property asked for: stronger pull → smaller radius, higher ionization energy, higher electronegativity; weaker pull → the reverse.',
      ],
      example: {
        problem: 'Why does ionization energy decrease going down a group?',
        solution:
          'Each step down adds a whole new shell: the valence electron is farther from the nucleus and screened by more inner electrons. Proton count rises, but the added shielding and distance outweigh it, so effective nuclear charge on the valence electron falls. Weakly held electrons are cheap to remove → ionization energy decreases.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find the valence count from successive ionization energies',
      when_to_use: 'Given a list IE₁, IE₂, IE₃, … in kJ/mol and asked for valence electrons or group placement.',
      steps: [
        'Scan the list for the first ENORMOUS jump (roughly a 3–5× leap, not the gentle climb between neighbors).',
        'Count how many electrons came off BEFORE that jump — those are the loosely held valence electrons.',
        'That count is the valence-electron number; map it to a group (3 valence e⁻ → Group 13, and so on).',
      ],
      example: {
        problem: 'IE₁ = 578, IE₂ = 1817, IE₃ = 2745, IE₄ = 11577 kJ/mol. How many valence electrons?',
        solution:
          'IE₁ → IE₃ climb steadily; IE₄ quadruples, so the fourth electron is being torn out of the noble-gas core. Three electrons came off before the wall → 3 valence electrons (a Group 13 element).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'More electrons ≠ bigger atom. Cl has 6 more electrons than Na yet is SMALLER: those electrons join the SAME third shell while 6 extra protons pull everything inward. Electron count only predicts size when new SHELLS are added.',
      kind: 'common-error',
    },
    {
      content:
        'Never explain a trend with "it has more electrons" or "it is heavier". The grip comes from the NUCLEUS — proton count minus shielding. Name both halves in any explanation.',
      kind: 'gotcha',
    },
    {
      content:
        'Ionization energy and electronegativity are not the same quantity: ionization energy is about REMOVING an electron from a lone atom; electronegativity is about pulling on SHARED electrons inside a bond. They trend in the same direction, which is why they get confused.',
      kind: 'gotcha',
    },
    {
      content:
        'Noble gases are excluded from electronegativity rankings — they mostly do not bond, so there are no shared electrons to pull on. They are NOT excluded from ionization energy, where they sit at the top of their periods.',
      kind: 'edge-case',
    },
    {
      content:
        'Memory hook: everything "tight" points at fluorine in the top-right corner (smallest, hardest to ionize, greediest); everything "loose and large" points at the bottom-left corner.',
      kind: 'tip',
    },
  ],
};
