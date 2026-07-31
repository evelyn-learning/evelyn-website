/**
 * Chemistry — Unit 10.4: Nuclear Chemistry: Radioactivity & Half-Life.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u10-nuclear-chemistry-intro.ts
 * (planId evelyn.hs.chem.nuclear-chemistry-intro.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.nuclear-chemistry-intro';
const PLAN_ID = 'evelyn.hs.chem.nuclear-chemistry-intro.v1';

export const BASELINE_CHEM_U10_NUCLEAR_CHEMISTRY_INTRO: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Nuclear Chemistry: Radioactivity & Half-Life',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Nuclear vs chemical change',
      content:
        'A chemical change rearranges valence electrons and the elements survive intact. A NUCLEAR change rewrites the nucleus, so one element transmutes into another. Nuclear changes release roughly a million times more energy per atom, and their rates ignore temperature, pressure, concentration, and catalysts entirely.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Isotope notation',
      content:
        'Uranium-238 is also written ²³⁸U. The superscript is the MASS NUMBER (protons + neutrons); the element symbol fixes the ATOMIC NUMBER (protons, 92 for U). Isotopes share protons and differ in neutrons: ²³⁵U has 235 − 92 = 143 neutrons, ²³⁸U has 146.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The three emissions',
      content:
        'ALPHA (α) — ejects a helium-4 nucleus, ⁴He (2 protons + 2 neutrons): mass −4, atomic number −2, element moves two boxes LEFT; stopped by paper or skin, but dangerous if inhaled or swallowed. BETA (β⁻) — a neutron becomes a proton and shoots out an electron, e⁻: mass UNCHANGED, atomic number +1, element moves one box RIGHT; stopped by aluminum foil. GAMMA (γ) — pure high-energy light, no mass and no charge: BOTH numbers unchanged, so gamma alone never changes the element; needs thick lead or concrete.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Balance twice',
      content:
        'Mass numbers must sum to the same total on both sides of the arrow AND atomic numbers must sum to the same total on both sides. Those two bookkeeping rules alone identify any missing particle — no memorization of decay products required.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Half-life',
      content:
        'The time for half of the radioactive nuclei present to decay — a fixed property of the isotope (carbon-14: 5,730 years; iodine-131: 8 days; uranium-238: 4.5 billion years). Number of half-lives = total time ÷ half-life, then remaining = initial × (1/2) raised to that number. Each half-life halves what is STILL THERE, not the original amount.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Fission vs fusion',
      content:
        'FISSION SPLITS a heavy nucleus: a neutron strikes ²³⁵U, it breaks into lighter fragments plus 2–3 more neutrons, and those neutrons split more nuclei in a chain — this runs every nuclear power plant. FUSION JOINS light nuclei: hydrogen merges into helium in the Sun\'s core, releasing even more energy per gram but only at enormous temperature and pressure. Both convert a tiny amount of mass into an enormous amount of energy.',
    },
  ],
  methods: [
    {
      title: 'Balance a nuclear equation and name the product',
      when_to_use:
        'Given a decay mode (alpha, beta, gamma) and a starting nuclide, or given a partial equation with one particle missing.',
      steps: [
        'Write what you know, leaving the unknown as "?" — e.g. ²³⁸U → ⁴He + ?.',
        'Balance the MASS numbers: the totals across the arrow must match; solve for the unknown mass number.',
        'Balance the ATOMIC numbers the same way; solve for the unknown atomic number.',
        'Look up the element with that atomic number — the atomic number, not the mass, names the element.',
        'Check against the pattern for that decay mode: alpha −4/−2, beta 0/+1, gamma 0/0.',
      ],
      example: {
        problem: 'Uranium-238 (Z = 92) undergoes alpha decay. Write the equation and name the product.',
        solution:
          'Mass: 238 − 4 = 234. Atomic: 92 − 2 = 90 → thorium. So ²³⁸U → ⁴He + ²³⁴Th. Uranium moved two boxes left — transmutation, which no chemical change can do.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compute the mass remaining after a whole number of half-lives',
      when_to_use:
        'Given an initial mass, a half-life, and a total elapsed time that is a whole multiple of it.',
      steps: [
        'Count the half-lives: total time ÷ half-life.',
        'Halve the sample that many times, each time halving what is LEFT — 80 → 40 → 20 → 10.',
        'Or use the formula directly: remaining = initial × (1/2) raised to the number of half-lives.',
        'Check that the answer is never 0 — repeated halving approaches zero but never reaches it.',
      ],
      example: {
        problem: 'An 80 g sample of an isotope with a 5-year half-life sits for 15 years. How much remains?',
        solution: '15 ÷ 5 = 3 half-lives. 80 → 40 → 20 → 10 g. Formula check: 80 × (1/2)³ = 80 × 1/8 = 10 g.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Two half-lives do NOT empty a sample. Each one halves what is still present: 40 g → 20 g → 10 g, never 0. After 10 half-lives about 1/1024 of the original is still there.',
      kind: 'common-error',
    },
    {
      content:
        'Nothing changes a decay rate — not heat, not grinding, not a catalyst, not dissolving it. Those factors act on electrons; decay happens in the nucleus. Carbon-14 is 5,730 years in a freezer and in a furnace alike.',
      kind: 'gotcha',
    },
    {
      content:
        'Beta decay does NOT lower the mass number. A neutron simply became a proton, so the protons + neutrons total is unchanged and only the atomic number climbs by 1: carbon-14 → nitrogen-14.',
      kind: 'common-error',
    },
    {
      content:
        'Gamma emission alone changes neither number, so the element stays put. It usually rides along with an alpha or beta decay rather than occurring by itself.',
      kind: 'edge-case',
    },
    {
      content:
        'Memory hook for the pair: a "fissure" is a crack, so FISSION splits; to "fuse" is to join, so FUSION combines. Reactors split ²³⁵U; the Sun merges hydrogen.',
      kind: 'tip',
    },
  ],
};
