/**
 * Chemistry — Unit 10.3: Neutralization & Titration Basics.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u10-neutralization-titration.ts
 * (planId evelyn.hs.chem.neutralization-titration.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.neutralization-titration';
const PLAN_ID = 'evelyn.hs.chem.neutralization-titration.v1';

export const BASELINE_CHEM_U10_NEUTRALIZATION_TITRATION: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Neutralization & Titration Basics',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Neutralization pattern',
      content:
        'acid + base → salt + water, a double replacement. HCl + NaOH → NaCl + H₂O; HNO₃ + KOH → KNO₃ + H₂O. The metal from the base pairs with the nonmetal ion from the acid to give the salt; the leftover H⁺ and OH⁻ give water.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Net ionic core',
      content:
        'Strip the spectator ions (Na⁺ and Cl⁻ simply float) and every strong-acid/strong-base neutralization reduces to H⁺ + OH⁻ → H₂O. That single step is why neutralization always releases heat and always drags pH toward the middle of the scale.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Moles cancel, volumes do not',
      content:
        'One mole of H⁺ cancels one mole of OH⁻, and moles = molarity × volume in liters. A small volume of concentrated acid can out-punch a large volume of dilute base, so a volume means nothing until it is multiplied by a concentration.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Equivalence point',
      content:
        'The instant when moles of H⁺ added exactly equal moles of OH⁻ present — nothing left over on either side. For a strong acid against a strong base the solution there is neutral, pH 7.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The 1:1 workhorse',
      content:
        'When the acid supplies one H⁺ and the base one OH⁻ (HCl with NaOH, HNO₃ with KOH), equal moles means M(acid) × V(acid) = M(base) × V(base), often written Mₐ × Vₐ = Mᵦ × Vᵦ. Volume appears on both sides, so mL may be used throughout without converting — the units cancel. It is a shortcut for a genuinely 1:1 equation, not a law.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The apparatus',
      content:
        'The KNOWN solution (the standard) goes in the buret, a tall graduated tube with a stopcock. A measured volume of the UNKNOWN goes in the flask below with two or three drops of indicator such as phenolphthalein. Open the stopcock, swirl constantly, slow to one drop at a time as color starts to flash. Read the buret before and after; the difference is the volume delivered.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Endpoint vs equivalence point',
      content:
        'The equivalence point is the chemistry (moles balanced); the ENDPOINT is what the eye sees — the first color change that survives 30 seconds of swirling. Phenolphthalein is colorless in acid and pink in base, so the target is the faintest lasting pink; dark magenta means you overshot.',
    },
  ],
  methods: [
    {
      title: 'Find an unknown concentration from titration data (1:1 system)',
      when_to_use:
        'A measured volume of unknown is titrated with a standard solution and the balanced equation is genuinely one H⁺ per one OH⁻.',
      steps: [
        'Get the volume DELIVERED: subtract the initial buret reading from the final one. Never assume the buret started at 0.00 mL.',
        'Check the ratio in the balanced equation — one H⁺ per one OH⁻, otherwise the shortcut is illegal.',
        'Write M(acid) × V(acid) = M(base) × V(base) and substitute the three known values, keeping both volumes in mL.',
        'Solve for the missing molarity by dividing.',
        'Sanity-check: whichever solution needed the SMALLER volume must be the MORE concentrated one.',
      ],
      example: {
        problem:
          '40.0 mL of HCl of unknown molarity is titrated with 0.50 M NaOH; the buret reads 3.0 mL at the start and 23.0 mL at the faint pink endpoint.',
        solution:
          'Delivered = 23.0 − 3.0 = 20.0 mL. Ratio is 1:1, so M(acid) × 40.0 = 0.50 × 20.0 = 10.0 → M(acid) = 10.0 ÷ 40.0 = 0.25 M HCl. The acid used only half its own volume of base, so it should be about half as concentrated. ✓',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Handle a polyprotic acid — the honest mole route',
      when_to_use:
        'Whenever the balanced equation is NOT 1:1, e.g. H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O.',
      steps: [
        'Read the coefficients first — the 1:1 volume shortcut is void the moment the acid supplies two H⁺.',
        'Moles of acid = molarity × volume in liters.',
        'Multiply by the protons per formula unit to get moles of H⁺ (×2 for a diprotic acid).',
        'Set moles of OH⁻ equal to moles of H⁺, then divide by the base molarity to get the volume of base in liters.',
        'Convert back to mL and compare against what the 1:1 shortcut would have predicted — the gap is the factor you would have missed.',
      ],
      example: {
        problem: '25.0 mL of 0.10 M H₂SO₄ titrated with 0.10 M NaOH — what volume of base reaches the equivalence point?',
        solution:
          'moles H₂SO₄ = 0.10 × 0.0250 = 0.0025 mol, supplying 2 × 0.0025 = 0.0050 mol H⁺. Need 0.0050 mol OH⁻ → 0.0050 ÷ 0.10 = 0.050 L = 50.0 mL, double the 25.0 mL the 1:1 shortcut predicts.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Equal VOLUMES never mean neutralized. Only equal MOLES do, and moles = molarity × volume — a titration finishing at 10.0 mL or 30.0 mL against a 25.0 mL sample is perfectly normal.',
      kind: 'common-error',
    },
    {
      content:
        'Check the balanced equation before using M(acid) × V(acid) = M(base) × V(base). H₂SO₄ needs two OH⁻ per formula unit, so the shortcut underestimates the base by half.',
      kind: 'gotcha',
    },
    {
      content:
        'Subtract the two buret readings. A buret that starts at 3.0 mL and ends at 23.0 mL delivered 20.0 mL, not 23.0 mL.',
      kind: 'common-error',
    },
    {
      content:
        'mL is legal on both sides of M(acid) × V(acid) = M(base) × V(base) because the volume units cancel — but the moment you compute moles on their own, convert to liters.',
      kind: 'tip',
    },
    {
      content:
        'A titration measures CONCENTRATION, not strength. A sample needing three times the base is three times as concentrated; how completely an acid ionizes is a separate property of the acid itself.',
      kind: 'gotcha',
    },
  ],
};
