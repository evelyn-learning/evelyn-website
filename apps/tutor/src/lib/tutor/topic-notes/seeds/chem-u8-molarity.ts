/**
 * Chemistry — Unit 8 topic 8.2: Molarity & Solution Concentration.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u8-molarity.ts
 * (planId evelyn.hs.chem.molarity.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.molarity';

export const BASELINE_CHEM_U8_MOLARITY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.molarity.v1',
  course: 'Chemistry',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Molarity & Solution Concentration',
  planId: 'evelyn.hs.chem.molarity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.molarity.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The definition',
      content:
        'Molarity M = moles of SOLUTE ÷ LITERS of SOLUTION. A 2 M solution holds 2 moles of dissolved substance in every 1 liter of finished solution. The symbol M is read "molar" and literally means mol/L.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why moles, not grams',
      content:
        'Reactions happen particle by particle, so a concentration that counts PARTICLES tells you how much reaction a solution can drive. Grams per liter would rate sugar and salt as equally "strong" at equal mass, which is chemically false.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The grams on-ramp',
      content:
        'If the solute is given in grams, convert first: moles = grams ÷ molar mass. Two conversions, always in this order — grams → moles, mL → L — and only then divide.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Volume of SOLUTION, not of solvent',
      content:
        'The liters in the denominator are the TOTAL finished volume, not the water poured in. Dissolved solute occupies space, so "1 mole plus 1 liter of water" is NOT 1 M. This is why solutions are made in a volumetric flask: dissolve in some water, then fill to the etched mark.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Running the formula backward',
      content:
        'M = mol/L rearranges to moles = M × L — the recipe form. To prepare a solution: multiply target molarity by target volume in liters to get moles needed, then multiply by molar mass to get grams to weigh out.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Concentration is intensive',
      content:
        'Pouring out half the beaker does not change the molarity — moles and liters halve together. A 3 M solution is 3 M whether you hold 10 mL or 10 L of it. AMOUNT of solute scales with volume; CONCENTRATION does not.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Key terms',
      content:
        'molarity — concentration as moles of solute per liter of solution, symbol M. solute — the dissolved substance, whose moles sit in the numerator. volumetric flask — glassware calibrated to one exact total volume, used to bring a solution up to its final mark.',
    },
  ],
  methods: [
    {
      title: 'Grams of solute + volume → molarity',
      when_to_use:
        'A mass of solute and a total solution volume are given (volume usually in mL) and the concentration is asked for.',
      steps: [
        'Build the molar mass of the solute by adding the atomic masses of every atom in the formula.',
        'Convert grams → moles: moles = grams ÷ molar mass.',
        'Convert the volume mL → L by dividing by 1000. Do this BEFORE dividing, never after.',
        'Divide: M = moles ÷ liters, and label the answer mol/L.',
        'Sanity check: if the volume is under a liter the molarity must be LARGER than the mole count; if the volume is over a liter it must be smaller.',
      ],
      example: {
        problem: '11.7 g of NaCl is dissolved and the flask filled to a total volume of 500 mL. Na = 23.0, Cl = 35.5 g/mol.',
        solution:
          'Molar mass NaCl = 58.5 g/mol → 11.7 ÷ 58.5 = 0.200 mol. 500 mL ÷ 1000 = 0.500 L. M = 0.200 ÷ 0.500 = 0.40 M.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Prepare a solution to a target concentration (formula backward)',
      when_to_use:
        'A target molarity and a target volume are given and the question asks how much solute to weigh out, or which lab procedure is correct.',
      steps: [
        'Convert the target volume to LITERS.',
        'moles needed = target M × liters.',
        'grams to weigh = moles × molar mass of the solute.',
        'Procedure: dissolve that mass in SOME water in a volumetric flask of the target volume, then add water up to the mark — do not add the solute to a full measured volume of water.',
      ],
      relatedLoIds: [LO],
    },
    {
      title: 'Diagnose a suspicious concentration',
      when_to_use:
        'An answer looks wrong, or a worked solution must be checked for the classic concentration errors.',
      steps: [
        'Check the denominator units: is the volume in LITERS? A denominator in mL makes the answer 1000 times too small.',
        'Smell test: an ordinary lab solution reading near 0.001 M is the milliliter signature — reconvert and redivide.',
        'Check the numerator: were grams converted to moles, or divided as grams?',
        'Check WHICH volume was used: the total finished solution, not the water added.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'The star error: leaving the volume in milliliters. Molarity is per LITER, so dividing by 250 instead of 0.250 shrinks the answer 1000-fold. Convert mL → L first, every single time.',
      kind: 'common-error',
    },
    {
      content:
        'A result near 0.001 M from ordinary lab quantities is almost always an un-converted milliliter volume, not a genuinely dilute solution. Treat it as an alarm.',
      kind: 'gotcha',
    },
    {
      content:
        'The denominator is the total volume of SOLUTION, not the solvent added — hence the volumetric flask and its mark. Adding solute to a full liter of water gives more than a liter, so the solution comes out too dilute.',
      kind: 'common-error',
    },
    {
      content:
        'If the solute is in grams, convert to moles first (grams ÷ molar mass). Molarity never accepts grams in the numerator.',
      kind: 'tip',
    },
    {
      content:
        'Concentration is intensive: transferring, splitting, or discarding part of a solution leaves the molarity unchanged. Only adding solvent or solute moves it.',
      kind: 'edge-case',
    },
  ],
};
