/**
 * Chemistry — Unit 6.2: Mole Conversions (mass, particles, gas volume).
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u6-mole-conversions.ts
 * (planId evelyn.hs.chem.mole-conversions.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.mole-conversions';

export const BASELINE_CHEM_U6_MOLE_CONVERSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.mole-conversions.v1',
  course: 'Chemistry',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Mole Conversions: Mass, Particles & Gas Volume',
  planId: 'evelyn.hs.chem.mole-conversions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.mole-conversions.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Moles are the hub',
      content:
        'Mass, particle count, and gas volume never convert directly into one another. Each connects only to MOLES, so every problem is "which spokes do I ride?" Draw the hub with three spokes and the route picks itself.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Spoke 1 — mass ↔ moles (molar mass)',
      content:
        'grams ÷ molar mass = moles; moles × molar mass = grams. Molar mass comes from the formula: CO₂ = 12.0 + 2(16.0) = 44.0 g/mol. This spoke works for solids, liquids, and gases alike.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: "Spoke 2 — moles ↔ particles (Avogadro's number)",
      content:
        '1 mol = 6.02 × 10²³ particles. moles × 6.02 × 10²³ = particles; particles ÷ 6.02 × 10²³ = moles. "Particles" means whatever the formula names: atoms for Fe, molecules for CO₂, formula units for NaCl.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Spoke 3 — moles ↔ gas volume (molar volume)',
      content:
        'At STP (0 °C and 1 atm) one mole of ANY gas occupies 22.4 L. liters ÷ 22.4 = moles; moles × 22.4 = liters. Identity is irrelevant: 1 mol of H₂ (2.0 g) and 1 mol of CO₂ (44.0 g) both fill 22.4 L, because gas particles sit far enough apart that only the count matters.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-spoke trips',
      content:
        'Grams to particles, or grams to liters, is never one step. Ride into the hub, then back out: grams → moles → particles, or grams → moles → liters. Skipping the hub skips the only unit the three spokes share.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Units pick divide versus multiply',
      content:
        'Write each conversion factor so the unit you are leaving cancels: 88 g × (1 mol / 44.0 g) leaves mol. A setup that leaves g²/mol means the factor is upside-down. Dimensional analysis decides the direction, not memory.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Molecules versus atoms',
      content:
        '1 mol of CO₂ holds 6.02 × 10²³ MOLECULES but 3 × that many atoms, since each molecule carries 3 atoms. Decide which particle the question wants before reaching for Avogadro\'s number, then multiply by the atoms-per-formula count if needed.',
    },
  ],
  methods: [
    {
      title: 'Route a mole-conversion problem through the hub',
      when_to_use:
        'Any conversion among grams, moles, particles, and gas volume at STP — including multi-spoke trips.',
      steps: [
        'Label what you HAVE and what you WANT with their units (g, mol, particles, L).',
        'Mark the spokes the trip needs. If neither end is moles, the route is in-to-the-hub then out.',
        'Write each factor so the old unit cancels: (1 mol / M g), (6.02 × 10²³ particles / 1 mol), (1 mol / 22.4 L) or their reciprocals.',
        'Multiply straight through, cancelling units as you go; the surviving unit must be the one asked for.',
        'Sanity-check the size — a mass equal to twice the molar mass should give about two Avogadro\'s numbers of particles.',
      ],
      example: {
        problem: 'How many molecules are in 88.0 g of CO₂ (M = 44.0 g/mol)?',
        solution:
          '88.0 g × (1 mol / 44.0 g) = 2.00 mol; 2.00 mol × (6.02 × 10²³ molecules / 1 mol) = 1.204 × 10²⁴ molecules. For ATOMS instead, multiply once more by 3.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether 22.4 L/mol applies',
      when_to_use:
        'Whenever a problem mentions volume, liters, or STP — before using the molar-volume spoke at all.',
      steps: [
        'Check the PHASE. Molar volume is a gas-only spoke; liquids and solids do not have one.',
        'Check the CONDITIONS. 22.4 L/mol holds at STP (0 °C, 1 atm) only; other temperatures or pressures need the gas laws instead.',
        'If both checks pass, convert with liters ÷ 22.4 = moles or moles × 22.4 = liters.',
        'If the sample is a liquid or solid, use density (g/mL) to reach volume, not molar volume.',
      ],
      example: {
        problem: 'What volume does 36.0 g of water occupy — as a liquid, and as steam at STP?',
        solution:
          '36.0 g ÷ 18.0 g/mol = 2.00 mol either way. As a LIQUID, use density: 36.0 g ÷ 1.00 g/mL = 36.0 mL. As a gas at STP: 2.00 mol × 22.4 L/mol = 44.8 L — about 1,200 times larger.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Moles are the hub: mass, particles, and gas volume each connect only to moles, never straight to each other.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        '22.4 L/mol is for GASES at STP only. One mole of liquid water is about 18 mL, not 22.4 L — off by a factor of roughly a thousand.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Multiplying grams by molar mass to "get moles" leaves g²/mol, which is not a unit of anything. Units catch the flipped factor instantly: 18.0 g × (1 mol / 18.0 g) = 1.00 mol.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Read the particle word. Avogadro\'s number counts what the formula names — 1 mol CO₂ is 6.02 × 10²³ molecules but 1.81 × 10²⁴ atoms.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Quick anchor values: 1 mol at STP = 22.4 L of gas; a sample weighing exactly one molar mass is exactly 1 mol; 2 × molar mass in grams is 2 × 6.02 × 10²³ particles.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
