/**
 * Chemistry — Unit 1 topic 1.4: Density & Dimensional Analysis.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u1-density-dimensional-analysis.ts
 * (planId evelyn.hs.chem.density-dimensional-analysis.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.density-dimensional-analysis';
const PLAN_ID = 'evelyn.hs.chem.density-dimensional-analysis.v1';

export const BASELINE_CHEM_U1_DENSITY_DIMENSIONAL_ANALYSIS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Density & Dimensional Analysis',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Density is a ratio, not an amount',
      content:
        'd = m/V — how much mass is packed into each unit of volume. Rearranged: m = d × V and V = m/d. Because it is a ratio it is INTENSIVE: one drop of mercury and a full flask both read 13.6 g/mL.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Units advertise the phase',
      content:
        'Solids are quoted in g/cm³, liquids in g/mL, gases in g/L. The bridge to memorize: 1 mL = 1 cm³ exactly, so a solid at 2.70 g/cm³ and a liquid at 2.70 g/mL are equally dense.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Getting the volume right',
      content:
        'Regular solid: V = length × width × height. Irregular solid: water displacement, V = final level − initial level. A wrong volume ruins a perfect mass measurement, so decide the method before touching the balance.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Dimensional analysis (factor-label method)',
      content:
        'Multiply by conversion factors that equal 1 — 1000 g / 1 kg is just "1" in disguise — oriented so the unwanted unit sits on the BOTTOM and cancels. Carry units through every line; if the surviving units are wrong, the arithmetic is wrong no matter how clean the number looks.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Density as a conversion factor',
      content:
        '13.6 g/mL can be written upright as 13.6 g / 1 mL or flipped as 1 mL / 13.6 g. Grams in, volume out → use the flipped form. Volume in, grams out → use the upright form. Choose by what cancels, never by memorizing "multiply" or "divide".',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The float test',
      content:
        'An object sinks in a fluid when it is DENSER than that fluid. Water is 1.00 g/mL, so ice at 0.92 g/mL floats and iron at 7.87 g/cm³ sinks — the same reason spilled oil spreads across the surface instead of mixing downward.',
    },
  ],
  methods: [
    {
      title: 'Identify an unknown substance from mass and volume',
      when_to_use:
        'A sample of unknown identity plus a reference table of densities.',
      steps: [
        'Get the volume: measure length × width × height for a regular solid, or take final minus initial water level for an irregular one. Convert with 1 mL = 1 cm³ if the reference table uses the other unit.',
        'Apply d = m/V and check that the surviving units really are g/cm³ or g/mL.',
        'Round to the significant figures the measurements allow, then compare against the reference list.',
        'Sanity-check the size: does a lump that small weighing that much feel like the substance you named?',
      ],
      example: {
        problem:
          'A metal chunk of mass 89.6 g raises water from 25.0 mL to 35.0 mL. References (g/cm³): Al 2.70, Fe 7.87, Cu 8.96, Pb 11.3.',
        solution:
          'V = 35.0 − 25.0 = 10.0 mL = 10.0 cm³. d = 89.6 ÷ 10.0 = 8.96 g/cm³ → COPPER. Aluminum would be far too light and lead far too heavy for that volume.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Convert between units by cancelling',
      when_to_use:
        'Any unit conversion, and especially any mass ⇌ volume conversion through a density.',
      steps: [
        'Write the given quantity with its unit, then write the target unit off to the side — the setup must end there.',
        'Chain conversion factors, each oriented so the unit you want to lose is on the BOTTOM.',
        'Insert density flipped (1 mL / d g) when going grams → volume, upright (d g / 1 mL) when going volume → grams.',
        'Cross off cancelling units before computing; only when the surviving unit matches the target do the arithmetic.',
      ],
      example: {
        problem: 'A procedure calls for 39.45 g of ethanol, d = 0.789 g/mL. What volume do you pour?',
        solution:
          '39.45 g × (1 mL / 0.789 g) = 50.0 mL. Grams cancel and mL survives. The common wrong line, 39.45 g × 0.789 g/mL, yields g²/mL — a unit that does not exist, which flags the error before any arithmetic.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Convert a cubed or squared unit',
      when_to_use: 'Whenever a volume in cm³, mm³, or m³ must be rescaled.',
      steps: [
        'Write the linear conversion first: 1 cm = 10 mm.',
        'Cube (or square) BOTH sides, factor and unit together: (1 cm)³ = (10 mm)³, so 1 cm³ = 1000 mm³.',
        'Use that cubed factor in the chain, oriented so the unwanted cubed unit cancels.',
        'Check the magnitude: converting to a smaller unit must make the NUMBER bigger.',
      ],
      example: {
        problem: 'Express 2.50 cm³ in mm³.',
        solution: '2.50 cm³ × (1000 mm³ / 1 cm³) = 2500 mm³. Cubing the length factor is the whole trick — 10 becomes 1000.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Flipping the formula silently inverts the answer. Density is m/V, never V/m — if the number comes out around 0.11 where 8.96 was expected, you inverted it.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Cubed units get cubed factors: 1 cm = 10 mm but 1 cm³ = 1000 mm³. Forgetting to cube the number is the classic volume-conversion wreck.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Dense ≠ heavy. A steel paperclip sinks and a huge log floats because sinking compares density to the fluid (water 1.00 g/mL), not total mass. Always ask "per unit volume?"',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Let units audit the setup. If the surviving unit is g²/mL or mL/g when you wanted mL, the orientation is wrong — fix it before computing anything.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Reasonableness check for mass ⇌ volume: a liquid less dense than water occupies MORE mL than its mass in grams; a liquid denser than water occupies fewer.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
