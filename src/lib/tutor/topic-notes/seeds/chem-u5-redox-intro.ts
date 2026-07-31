/**
 * Chemistry — Unit 5 topic 5.4: Oxidation & Reduction Basics.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u5-redox-intro.ts
 * (planId evelyn.hs.chem.redox-intro.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.redox-intro';

export const BASELINE_CHEM_U5_REDOX_INTRO: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.redox-intro.v1',
  course: 'Chemistry',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Oxidation & Reduction Basics',
  planId: 'evelyn.hs.chem.redox-intro.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.redox-intro.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'OIL RIG — the core idea',
      content:
        'Oxidation Is Loss of electrons; Reduction Is Gain. The two ALWAYS happen together: electrons cannot vanish, so whatever one species loses another species gains, in the same reaction, in the same instant.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Oxidation number',
      content:
        'The charge an atom WOULD carry if every bond it makes were counted as fully ionic. It is a bookkeeping label, not a measured charge — and it is what makes an invisible electron transfer visible on paper.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The assignment rules, applied in order',
      content:
        '(1) a pure element is 0 (Fe, O₂, Na, Cl₂). (2) a monatomic ion equals its charge (Na⁺ = +1, S²⁻ = −2). (3) hydrogen is +1, except −1 in metal hydrides like NaH. (4) oxygen is −2, except −1 in peroxides like H₂O₂. (5) the oxidation numbers in a species SUM to its overall charge — 0 for a neutral compound, the ion charge for a polyatomic ion.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading the change',
      content:
        'Write each element\'s oxidation number before and after. Number UP → the atom lost electrons → OXIDIZED. Number DOWN → the atom gained electrons → REDUCED. If no number changes anywhere, the reaction is not redox at all.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'The agent labels are crossed',
      content:
        'The OXIDIZING agent is the species that gets REDUCED — it takes electrons and thereby oxidizes its partner. The REDUCING agent is the species that gets OXIDIZED. An agent is named for what it DOES TO THE OTHER, not for what happens to it.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Oxidation needs no oxygen',
      content:
        'The word is a historical leftover from the era when oxygen was the only known electron thief. In 2 Na + Cl₂ → 2 NaCl there is no oxygen anywhere, yet Na is oxidized (0 → +1) and Cl is reduced (0 → −1). Losing electrons is the definition.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Where redox shows up',
      content:
        'Single-replacement reactions (Zn + Cu²⁺ → Zn²⁺ + Cu) and all combustion are redox. Double replacement and simple acid-base neutralization usually are NOT — ions swap partners without any oxidation number moving. Spectator ions such as SO₄²⁻ keep the same numbers on both sides.',
    },
  ],
  methods: [
    {
      title: 'Assign oxidation numbers in a compound',
      when_to_use:
        'Whenever you need the oxidation number of an atom that is not a pure element or a monatomic ion — e.g. Mn in KMnO₄, S in SO₄²⁻.',
      steps: [
        'Write the overall charge target: 0 for a neutral compound, the ion charge for a polyatomic ion.',
        'Fill in every atom governed by a fixed rule: Group 1 metals +1, Group 2 +2, H = +1 (−1 in hydrides), O = −2 (−1 in peroxides).',
        'Multiply each fixed value by how many of that atom the formula contains and add them into a running total.',
        'Solve for the unknown atom: its contribution is (target − running total), divided by how many of it there are.',
      ],
      example: {
        problem: 'Find the oxidation number of Mn in KMnO₄.',
        solution:
          'Target 0. K = +1; four O at −2 gives −8. Running total +1 − 8 = −7. Mn must contribute +7 to reach 0, and there is one Mn, so Mn = +7.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Identify what is oxidized, reduced, and each agent',
      when_to_use:
        'Given a full equation and asked which species is oxidized/reduced or which is the oxidizing/reducing agent.',
      steps: [
        'Assign oxidation numbers to every element on the LEFT side.',
        'Assign oxidation numbers to every element on the RIGHT side.',
        'Compare element by element. Increase → that element was OXIDIZED. Decrease → REDUCED. No change → spectator.',
        'Cross the labels: the species containing the REDUCED element is the OXIDIZING agent; the species containing the OXIDIZED element is the REDUCING agent.',
        'Name the whole species, not just the atom, when the atom sits inside a compound (Cu²⁺ from CuSO₄, not "the sulfate").',
      ],
      example: {
        problem: 'Analyze Zn + CuSO₄ → ZnSO₄ + Cu.',
        solution:
          'Zn 0 → +2 (up, OXIDIZED); Cu +2 → 0 (down, REDUCED); in SO₄²⁻, S stays +6 and O stays −2 on both sides, so sulfate is a spectator. Crossing the labels: Zn is the REDUCING agent, Cu²⁺ is the OXIDIZING agent.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Test whether a reaction is redox at all',
      when_to_use:
        'Before hunting for agents — many double-replacement and neutralization equations have no electron transfer.',
      steps: [
        'Assign oxidation numbers on both sides for every element.',
        'Scan for any element whose number differs between sides.',
        'At least one increase AND one decrease → redox. Zero changes → not redox, and there are no agents to name.',
        'Shortcut check: if a free element (oxidation number 0) appears on one side and only in compounds on the other, the reaction is redox.',
      ],
      example: {
        problem: 'Is AgNO₃ + NaCl → AgCl + NaNO₃ a redox reaction?',
        solution:
          'Ag stays +1, NO₃⁻ stays intact, Na stays +1, Cl stays −1. No oxidation number moves anywhere, so this is a plain double replacement, not redox.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'OIL RIG — Oxidation Is Loss of electrons, Reduction Is Gain. They always occur together in the same reaction.',
      kind: 'tip',
    },
    {
      content:
        'Rule stack: pure element = 0, monatomic ion = its charge, H = +1, O = −2, and every species sums to its overall charge.',
      kind: 'tip',
    },
    {
      content:
        'Number goes UP → oxidized. Number goes DOWN → reduced. No number changes anywhere → not a redox reaction.',
      kind: 'tip',
    },
    {
      content:
        'The signature error: calling the oxidized species the "oxidizing agent." The labels are CROSSED — species reduced = oxidizing agent, species oxidized = reducing agent.',
      kind: 'common-error',
    },
    {
      content:
        'Gotcha: no oxygen in the equation does not mean no oxidation. 2 Na + Cl₂ → 2 NaCl is redox because electrons moved.',
      kind: 'gotcha',
    },
    {
      content:
        'Watch the exceptions: H is −1 in metal hydrides (NaH) and O is −1 in peroxides (H₂O₂). Applying the default blindly gives a wrong Mn or S.',
      kind: 'edge-case',
    },
    {
      content:
        'A polyatomic ion that appears unchanged on both sides (SO₄²⁻, NO₃⁻) is a spectator — skip it and keep the analysis short.',
      kind: 'tip',
    },
  ],
};
