/**
 * Chemistry — Unit 6.5: Limiting Reactants & Percent Yield.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u6-limiting-reactant-yield.ts
 * (planId evelyn.hs.chem.limiting-reactant-yield.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.limiting-reactant-yield';

export const BASELINE_CHEM_U6_LIMITING_REACTANT_YIELD: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.limiting-reactant-yield.v1',
  course: 'Chemistry',
  cedUnit: 6,
  cedTopic: '6.5',
  cedTitle: 'Limiting Reactants & Percent Yield',
  planId: 'evelyn.hs.chem.limiting-reactant-yield.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.limiting-reactant-yield.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Limiting versus excess reactant',
      content:
        'The limiting reactant is consumed first and caps how much product can form — the instant it is gone the reaction stops, however much else is left in the flask. Every other reactant is EXCESS, and its unconsumed remainder is the leftover.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The test: moles ÷ coefficient',
      content:
        'Convert each reactant\'s mass to moles (÷ molar mass), then divide those moles by that reactant\'s coefficient in the balanced equation. The SMALLEST quotient identifies the limiting reactant; that quotient also counts how many times the recipe can run.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why raw moles fail',
      content:
        '1.50 mol H₂ exceeds 1.00 mol N₂, yet in N₂ + 3 H₂ → 2 NH₃ hydrogen still runs out first: each batch eats three H₂ per one N₂. The coefficient is the appetite, and it must be divided out before any comparison.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why raw grams fail',
      content:
        'Grams say nothing about particle count. 3.0 g of H₂ is 1.50 mol of molecules while 28.0 g of N₂ is only 1.00 mol — the lighter pile holds more particles. Mass ranking is meaningless for this decision.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Theoretical versus actual yield',
      content:
        'Theoretical yield is the maximum product mass, computed from the LIMITING reactant alone via grams → moles → mole ratio → grams. Actual yield is MEASURED after the product is isolated and dried; reverse reactions, side reactions, and product lost on glassware keep it below theoretical.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Percent yield',
      content:
        'percent yield = (actual ÷ theoretical) × 100, with both masses for the SAME substance in the SAME units. It is the reaction\'s report card. Above 100% is not a triumph — it flags impurity, usually solvent or water still in the product.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Leftover excess reactant',
      content:
        'From the limiting reactant\'s moles, use the mole ratio to find how many moles of the excess were CONSUMED, convert to grams, and subtract from the starting mass. Whatever remains is the leftover.',
    },
  ],
  methods: [
    {
      title: 'Identify the limiting reactant and its theoretical yield',
      when_to_use:
        'Whenever amounts of TWO OR MORE reactants are given — that is the signal a limiting-reactant test is required.',
      steps: [
        'Balance the equation, then convert every given reactant mass to moles (÷ its molar mass).',
        'Divide each reactant\'s moles by its own coefficient; the smallest quotient is the limiting reactant.',
        'From the LIMITING reactant\'s moles only, cross the mole bridge to the product: moles × (coefficient product / coefficient limiting).',
        'Multiply by the product\'s molar mass for the theoretical yield in grams.',
        'Optional leftover: moles of excess consumed = limiting moles × (coefficient excess / coefficient limiting); convert to grams and subtract from the starting mass.',
      ],
      example: {
        problem:
          'N₂ + 3 H₂ → 2 NH₃ charged with 28.0 g N₂ and 3.0 g H₂ (N₂ = 28.0, H₂ = 2.0, NH₃ = 17.0 g/mol).',
        solution:
          'Moles: 1.00 mol N₂, 1.50 mol H₂. Divide by coefficients: 1.00 ÷ 1 = 1.00; 1.50 ÷ 3 = 0.50 → H₂ limits. Yield: 1.50 mol H₂ × (2 NH₃ / 3 H₂) = 1.00 mol × 17.0 = 17.0 g NH₃. Leftover N₂: consumed 1.50 × (1/3) = 0.50 mol = 14.0 g, so 28.0 − 14.0 = 14.0 g remains.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compute percent yield',
      when_to_use:
        'When a measured (actual) product mass is given alongside enough data to predict the theoretical yield.',
      steps: [
        'Find the theoretical yield first, from the limiting reactant only — never from the excess.',
        'Put actual and theoretical in the same units for the same substance.',
        'Divide actual by theoretical and multiply by 100.',
        'Interpret: below 100% is normal; above 100% means the weighed product contained something that is not product.',
      ],
      example: {
        problem: 'Theoretical yield 17.0 g NH₃; the plant isolates 13.6 g.',
        solution:
          '(13.6 ÷ 17.0) × 100 = 80%. Using an inflated 34.0 g theoretical (from picking N₂ as limiting) would have reported 40% — a fine reaction misgraded as a failure.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Two reactant amounts given = do the limiting-reactant test. Only one amount given = it is the limiting reactant by default.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Never rank reactants by raw moles and never by grams. The test is moles ÷ coefficient, smallest quotient wins.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Feeding the EXCESS reactant into the yield calculation inflates the answer and poisons every number downstream, including percent yield.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Percent yield above 100% means contamination — usually a product that was never fully dried — not a super-efficient reaction. Atoms cannot be created.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'A right answer from wrong reasoning still fails: "the smaller pile of grams limits" happens to work for 3.0 g H₂ vs 28.0 g N₂, but flips wrong at 12.0 g H₂ vs 28.0 g N₂ (6.00 ÷ 3 = 2.00 beats 1.00 ÷ 1 = 1.00, so N₂ limits).',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
