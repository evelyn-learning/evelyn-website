/**
 * Chemistry — Unit 3.3: Ion Formation & Predicting Charges.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u3-ion-formation.ts
 * (planId evelyn.hs.chem.ion-formation.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.ion-formation';

export const BASELINE_CHEM_U3_ION_FORMATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.ion-formation.v1',
  course: 'Chemistry',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Ion Formation & Predicting Charges',
  planId: 'evelyn.hs.chem.ion-formation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.ion-formation.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Ion, cation, anion',
      content:
        'An ION is an atom carrying a net charge, and the charge comes from ELECTRONS ONLY — protons never move in chemistry, and the proton count IS the element\'s identity. Lose electrons → positives outnumber negatives → CATION (+). Gain electrons → ANION (−).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The driver: noble-gas configuration',
      content:
        'Atoms gain or lose whichever is CHEAPER to reach the electron count of the nearest noble gas (a full octet of valence electrons). Na sits 1 electron past neon, so it drops one. Cl sits 1 short of argon, so it takes one. Cost, not symmetry, picks the direction.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why metals lose and nonmetals gain',
      content:
        'This is the trends topic cashing in. Metals on the left have LOW ionization energy, so their few valence electrons come off cheaply → cations. Nonmetals on the right have HIGH electronegativity, so they pull extra electrons in → anions. Position predicts direction.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Group → charge map (main group)',
      content:
        'Group 1 → 1+; Group 2 → 2+; Group 13 → 3+; Group 15 → 3−; Group 16 → 2−; Group 17 → 1−; Group 18 → no ion (already full). Compact rule: metals lose their valence electrons; nonmetals gain (8 − valence).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Naming monatomic ions',
      content:
        'A cation keeps the element name: Na⁺ is the sodium ion, Mg²⁺ the magnesium ion. A monatomic anion swaps its ending to -ide: Cl⁻ chloride, O²⁻ oxide, S²⁻ sulfide, N³⁻ nitride.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Size flips when the ion forms',
      content:
        'Cations SHRINK: Na⁺ is far smaller than Na because losing the lone third-shell electron strips away a whole shell, and the remaining 10 electrons face all 11 protons. Anions SWELL: Cl⁻ is larger than Cl because the added electron increases electron–electron repulsion while the proton count stays at 17.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Isoelectronic species',
      content:
        'Species with the same electron count. N³⁻, O²⁻, F⁻, Na⁺, and Mg²⁺ all carry 10 electrons, matching neon. Same electrons, different PROTONS — so size ranks by nuclear pull: Mg²⁺ (12 p⁺) is smallest, N³⁻ (7 p⁺) is largest.',
    },
  ],
  methods: [
    {
      title: 'Predict a monatomic ion from group position',
      when_to_use: 'Given a main-group element and asked for the ion it forms, its name, or its electron count.',
      steps: [
        'Read the GROUP → valence-electron count (Groups 13–18: subtract 10).',
        'Compare the two routes to a noble gas: lose the valence electrons, or gain (8 − valence). Pick the cheaper (smaller) move — this matches metal-loses / nonmetal-gains.',
        'Set the SIGN from the direction: electrons lost → positive; electrons gained → negative (electrons are negative, so adding them cannot make a cation).',
        'Write the ion with charge, then count particles: protons unchanged, electrons = original ∓ the number moved.',
        'Name it: cation keeps the element name; anion takes the -ide ending.',
      ],
      example: {
        problem: 'Magnesium (Group 2, 12 protons) and nitrogen (Group 15, 7 protons) — predict, name, and count.',
        solution:
          'Mg: 2 valence e⁻; lose 2 (cheap) rather than gain 6 → Mg → Mg²⁺ + 2 e⁻, the magnesium ion, 12 p⁺ and 10 e⁻. N: 5 valence e⁻; gain 8 − 5 = 3 rather than lose 5 → N + 3 e⁻ → N³⁻, the nitride ion, 7 p⁺ and 10 e⁻. Both land at 10 electrons — isoelectronic with neon — but their proton counts keep them magnesium and nitrogen.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Rank isoelectronic ions by size',
      when_to_use: 'When several ions share an electron count and you are asked which is largest or smallest.',
      steps: [
        'Confirm the electron counts really match (e.g. all 10, isoelectronic with neon).',
        'List the PROTON counts — that is the only variable left.',
        'More protons on the same electron cloud = tighter grip = smaller ion; fewer protons = loosest grip = largest ion.',
      ],
      example: {
        problem: 'Rank N³⁻, O²⁻, F⁻, Na⁺, Mg²⁺ from largest to smallest.',
        solution:
          'All carry 10 electrons. Protons: N 7, O 8, F 9, Na 11, Mg 12. Grip rises with protons, so size falls: N³⁻ > O²⁻ > F⁻ > Na⁺ > Mg²⁺.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'The valence count is not the charge. Sulfur has 6 valence electrons but forms S²⁻ — never S⁶⁺ and never S⁶⁻. Valence tells you how FAR you are from an octet; the cheaper direction decides the sign.',
      kind: 'common-error',
    },
    {
      content:
        'Nothing gains or loses a proton. Na⁺ still has 11 protons — it is down to 10 electrons. Change the proton count and you have changed the element, which chemistry cannot do.',
      kind: 'common-error',
    },
    {
      content:
        'Transition metals break the column rule: iron gives Fe²⁺ and Fe³⁺, copper Cu⁺ and Cu²⁺. That is why their names carry a Roman numeral, as in iron(III) chloride. Do not predict their charge from Groups 3–12.',
      kind: 'edge-case',
    },
    {
      content:
        'Cations shrink, anions swell — the opposite of what "gaining stuff makes it bigger, losing stuff makes it smaller" would suggest for the cation. Losing the last valence electron removes an entire shell.',
      kind: 'gotcha',
    },
    {
      content:
        'Memory hook for the map: 1 → 1+, 2 → 2+, 13 → 3+, then walk backward from the right edge — 17 → 1−, 16 → 2−, 15 → 3−, 18 → none.',
      kind: 'tip',
    },
  ],
};
