/**
 * Chemistry — Unit 10.1: Acids & Bases: Properties and Definitions.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u10-acids-bases-definitions.ts
 * (planId evelyn.hs.chem.acids-bases-definitions.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.acids-bases-definitions';
const PLAN_ID = 'evelyn.hs.chem.acids-bases-definitions.v1';

export const BASELINE_CHEM_U10_ACIDS_BASES_DEFINITIONS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'Acids & Bases: Properties and Definitions',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Arrhenius definition',
      content:
        'Acid = releases H⁺ in water (HCl → H⁺ + Cl⁻). Base = releases OH⁻ in water (NaOH → Na⁺ + OH⁻). Fast to apply — H at the front, OH at the back — but valid only in water and blind to NH₃.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Bronsted-Lowry definition (the default)',
      content:
        'Acid = proton DONOR, base = proton ACCEPTOR. A base needs no OH⁻ in its formula: NH₃ + H⁺ → NH₄⁺ is basic because ammonia CAUGHT the proton. Every Arrhenius acid is also Bronsted-Lowry; the reverse fails. "Proton" is literal — H minus its electron is a bare proton, and in water it rides on a water molecule as hydronium, H₃O⁺.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conjugate pairs',
      content:
        'Every proton transfer builds its own reverse. The acid that donates H⁺ becomes its CONJUGATE BASE; the base that accepts H⁺ becomes its CONJUGATE ACID. HF + H₂O ⇌ F⁻ + H₃O⁺ holds two pairs: HF/F⁻ and H₂O/H₃O⁺.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'One-proton rule',
      content:
        'Pair members differ by EXACTLY one H and one unit of charge. H₂CO₃/HCO₃⁻ qualifies; H₂CO₃/CO₃²⁻ does not (two protons apart). Polyprotic acids ionize one proton at a time, so H₂SO₄ → HSO₄⁻ → SO₄²⁻ is a chain of pairs, never a single leap.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Amphoteric water',
      content:
        'Water plays either side. With ammonia it donates: H₂O + NH₃ ⇌ NH₄⁺ + OH⁻ (water = acid). With hydrogen chloride it accepts: H₂O + HCl → H₃O⁺ + Cl⁻ (water = base). Role is set by the PARTNER, never by the formula.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The memorized lists',
      content:
        'Strong acids (ionize essentially 100%): HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄. Strong bases: NaOH, KOH, LiOH, Ca(OH)₂, Ba(OH)₂. Everyday weak acids: CH₃COOH (vinegar), H₂CO₃ (soda), citric acid, HF. Weak base: NH₃. Anything off the strong lists is weak.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Strength vs concentration',
      content:
        'STRENGTH = what fraction of the molecules ionize, a fixed property of the substance. CONCENTRATION = how many moles you dissolved per liter, your choice at the bench. Independent knobs: a dilute strong acid and a concentrated weak acid are both routine, and the second can be the more acidic solution.',
    },
  ],
  methods: [
    {
      title: 'Label acid, base, and both conjugate pairs in a proton transfer',
      when_to_use:
        'Given an equation such as HNO₂ + H₂O ⇌ NO₂⁻ + H₃O⁺ and asked who is the acid, who is the base, and what the pairs are.',
      steps: [
        'Track the proton: compare each species left to right and find which one LOST an H and which one GAINED one.',
        'The loser is the ACID (donor); what it becomes is its CONJUGATE BASE.',
        'The gainer is the BASE (acceptor); what it becomes is its CONJUGATE ACID.',
        'Verify each pair against the one-proton rule — one H difference and a one-unit charge shift in the matching direction.',
        'Write the two pairs as acid/conjugate-base, e.g. HNO₂/NO₂⁻ and H₂O/H₃O⁺.',
      ],
      example: {
        problem: 'Label every species in HNO₂ + H₂O ⇌ NO₂⁻ + H₃O⁺ and give the two pairs.',
        solution:
          'HNO₂ lost an H → acid; NO₂⁻ is its conjugate base (charge 0 → −1). H₂O gained an H → base; H₃O⁺ is its conjugate acid (charge 0 → +1). Pairs: HNO₂/NO₂⁻ and H₂O/H₃O⁺.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether a species with no OH⁻ can still be a base',
      when_to_use:
        'When a candidate base (NH₃, F⁻, CO₃²⁻, HCO₃⁻) carries no hydroxide and the Arrhenius rule seems to disqualify it.',
      steps: [
        'Name which definition is being applied — "a base must contain OH⁻" is Arrhenius, narrow rather than wrong.',
        'Switch to the donor/acceptor test: write the species with water and ask whether it ACCEPTS a proton.',
        'If it accepts, it is a Bronsted-Lowry base and water is the acid in that equation, regardless of what the formulas contain.',
        'Note where the OH⁻ actually came from — it was MADE by stripping a proton off water, not carried in by the base.',
      ],
      example: {
        problem: 'Is NH₃ a base even though its formula has no OH⁻?',
        solution:
          'Yes. NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ — nitrogen\'s lone pair takes H⁺ from water, so NH₃ is the base and H₂O is the acid. The hydroxide in solution was generated by the transfer, not contained in the ammonia.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Count the ionizable hydrogens in a formula',
      when_to_use:
        'When asked how many protons an acid can donate, or when checking a polyprotic chain.',
      steps: [
        'Look at what each hydrogen is bonded to — only H attached to a strongly electron-hungry atom (usually O or a halogen) leaves as H⁺.',
        'Discard hydrogens glued to carbon: CH₃COOH shows four H but donates only the one on the O.',
        'For an acid whose hydrogens are all on oxygen, the subscript on H is the count: H₃PO₄ donates 3.',
        'Write the donation chain one proton at a time, e.g. H₃PO₄ → H₂PO₄⁻ → HPO₄²⁻ → PO₄³⁻; each arrow is one ionizable H.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Reach for Bronsted-Lowry by default — proton DONOR vs proton ACCEPTOR. It reproduces every Arrhenius result and additionally covers NH₃, F⁻, CO₃²⁻, HCO₃⁻.',
      kind: 'tip',
    },
    {
      content:
        'No OH⁻ in the formula does NOT rule out a base. NH₃ generates hydroxide by taking a proton off water rather than carrying it in.',
      kind: 'common-error',
    },
    {
      content:
        'Conjugate pairs differ by exactly one H⁺ and one unit of charge. H₂SO₄/SO₄²⁻ and H₃O⁺/OH⁻ each span two protons, so neither is a pair.',
      kind: 'gotcha',
    },
    {
      content:
        'Strong ≠ concentrated. 0.001 M HCl and 0.1 M CH₃COOH end up with roughly the same free H⁺ (about 1% of the weak acid ionizes), so the dilute strong acid matches the concentrated weak one.',
      kind: 'gotcha',
    },
    {
      content:
        'Count the ACIDIC hydrogens, not the total. Only H bonded to O or a halogen ionizes — the three on carbon in CH₃COOH never leave.',
      kind: 'edge-case',
    },
  ],
};
