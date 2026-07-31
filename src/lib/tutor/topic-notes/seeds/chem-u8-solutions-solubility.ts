/**
 * Chemistry — Unit 8 topic 8.1: Solutions & Solubility.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u8-solutions-solubility.ts
 * (planId evelyn.hs.chem.solutions-solubility.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.solutions-solubility';

export const BASELINE_CHEM_U8_SOLUTIONS_SOLUBILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.solutions-solubility.v1',
  course: 'Chemistry',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Solutions & Solubility',
  planId: 'evelyn.hs.chem.solutions-solubility.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.solutions-solubility.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Solution, solute, solvent',
      content:
        'A solution is a HOMOGENEOUS mixture. Solute = the substance dissolved, present in the smaller amount. Solvent = the substance doing the dissolving, present in the larger amount. Uniformity is the test: every sample has the same composition, and no filter separates the parts.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Dissolving = competition of attractions',
      content:
        'Three pulls compete: solute-solute, solvent-solvent, and solute-solvent. Dissolving occurs when the solute-solvent attraction is strong enough to pay for pulling the other two apart. No particle changes chemically, which is why dissolving is a PHYSICAL change.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Like dissolves like',
      content:
        'Polar and ionic solutes dissolve in polar solvents; nonpolar solutes dissolve in nonpolar solvents. Water surrounds Na⁺ and Cl⁻ with its oppositely charged ends and pulls the crystal apart. A nonpolar chain (oil) offers water nothing to grip, so water molecules hold each other and squeeze the oil out.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Solubility — a number with conditions',
      content:
        'Solubility = the maximum mass of solute that dissolves in a fixed mass of solvent AT a stated temperature, usually grams per 100 g of water. "KNO₃ solubility is 32" is meaningless; "32 g per 100 g of water at 20 °C" is usable. It scales with solvent mass: 200 g of water holds twice as much.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Three states of a solution',
      content:
        'UNSATURATED — below the maximum, more will still dissolve. SATURATED — exactly at the maximum, undissolved solid in balance with dissolved solute. SUPERSATURATED — above the maximum, made by dissolving hot then cooling slowly; unstable, and one seed crystal makes the excess crash out at once.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Temperature and pressure effects',
      content:
        'Most SOLIDS: solubility RISES with temperature (hot tea takes more sugar). GASES: solubility FALLS with temperature — warm soda goes flat, a heated river holds less dissolved O₂. Pressure moves only GASES: higher gas pressure above a liquid forces more in, releasing it drives gas out. Pressure has essentially no effect on dissolved solids.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Rate is not amount',
      content:
        'Stirring, grinding to smaller crystals, and heating make a solid dissolve FASTER. Only temperature (and, for gases, pressure) changes HOW MUCH can dissolve at all; adding more solvent raises the total but not the per-100-g limit. Stirring a saturated solution for an hour dissolves not one extra gram.',
    },
  ],
  methods: [
    {
      title: 'Cooling crystallization: how much solid crashes out',
      when_to_use:
        'A solution is prepared at one temperature and cooled to another, and the question asks for the mass that crystallizes or for the state at each temperature.',
      steps: [
        'Scale the solubility values to the ACTUAL solvent mass: table values are per 100 g of water, so double them for 200 g, halve them for 50 g.',
        'At the starting temperature, compare mass present to the scaled maximum: less → unsaturated; equal → saturated; more than dissolves → excess sits undissolved.',
        'At the final temperature, look up the new scaled maximum — that is all the solvent can now hold.',
        'Mass crystallized = mass dissolved before − maximum at the final temperature.',
        'Name the final state: the cooled liquid is holding exactly its maximum with solid present, so it is SATURATED. Solvent mass never changed — cooling moved the LIMIT, not the water.',
      ],
      example: {
        problem:
          'KNO₃ dissolves 110 g per 100 g of water at 60 °C and 32 g per 100 g at 20 °C. 90 g of KNO₃ is stirred into 100 g of water at 60 °C, then cooled to 20 °C.',
        solution:
          'At 60 °C, 90 < 110, so all dissolves — UNSATURATED. At 20 °C the maximum is 32 g, so 90 − 32 = 58 g crystallizes and the remaining liquid is SATURATED.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Classify a solution as unsaturated, saturated, or supersaturated',
      when_to_use:
        'A mass of solute, a mass of solvent, and a temperature are given and the question asks which of the three labels applies.',
      steps: [
        'Read the temperature FIRST and pick the solubility value for that temperature — not the first number in the list.',
        'Scale that value to the stated solvent mass (per 100 g of water × solvent mass ÷ 100).',
        'Compare: dissolved mass below the maximum → UNSATURATED; equal to the maximum → SATURATED; above the maximum with everything still dissolved → SUPERSATURATED.',
        'Check the story for the supersaturated signature: it only arises after dissolving hot and cooling slowly without disturbance.',
      ],
      relatedLoIds: [LO],
    },
    {
      title: 'Predict the direction of a solubility change',
      when_to_use:
        'A temperature or pressure change is described and the question asks whether more or less will dissolve, or why gas escapes.',
      steps: [
        'Identify the PHASE of the solute: solid or gas. The rules run in opposite directions.',
        'Solid + temperature up → more dissolves. Solid + temperature down → less dissolves, excess crystallizes.',
        'Gas + temperature up → LESS dissolves, gas escapes. Gas + temperature down → more stays in.',
        'Gas + pressure up → more dissolves. Gas + pressure down (opening the cap) → gas leaves as bubbles. Skip this step entirely for solids.',
        'If the change is only stirring, grinding, or shaking, the answer is "faster, not more" — the maximum is unchanged.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Solids dissolve MORE as temperature rises; gases dissolve LESS. Never carry the solid rule over to a dissolved gas — that is the single most common miss in this topic.',
      kind: 'common-error',
    },
    {
      content:
        'Stirring, grinding, and heating change how FAST a solid dissolves; only temperature and solvent amount change how MUCH. A saturated solution stirred for an hour holds exactly the same mass.',
      kind: 'gotcha',
    },
    {
      content:
        'A solubility value is meaningless without its temperature. When two values are listed, match the one at the temperature the problem actually uses, not the first one you read.',
      kind: 'gotcha',
    },
    {
      content:
        'Solubility values are per 100 g of water. Scale them to the real solvent mass BEFORE comparing — 200 g of water at 40 °C holds 128 g of KNO₃, not 64 g.',
      kind: 'common-error',
    },
    {
      content:
        'Supersaturated is a real state, not a mistake: it holds MORE than the maximum, made by cooling a hot solution slowly. It is unstable — one seed crystal or a bump dumps the excess out at once.',
      kind: 'edge-case',
    },
  ],
};
