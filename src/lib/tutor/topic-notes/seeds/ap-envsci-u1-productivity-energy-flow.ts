/**
 * AP Environmental Science — Unit 1 CED 1.8-1.10: Productivity and Energy Flow.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.productivity-energy-flow.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_PRODUCTIVITY_ENERGY_FLOW: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.productivity-energy-flow.v1',
  course: 'AP Environmental Science',
  cedUnit: 1,
  cedTopic: '1.8-1.10',
  cedTitle: 'Productivity and Energy Flow',
  planId: 'evelyn.ap.envsci.productivity-energy-flow.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.productivity-energy-flow.v1' }],
  theory: [
    { loId: 'apenvsci.productivity-energy-flow', content: `PRIMARY PRODUCTIVITY: rate at which producers capture solar energy (or chemical energy in chemosynthesis) into biomass.` },
    { loId: 'apenvsci.productivity-energy-flow', content: '  • GROSS PRIMARY PRODUCTIVITY (GPP): TOTAL energy captured by photosynthesis.' },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • NET PRIMARY PRODUCTIVITY (NPP) = GPP − Respiration. Energy AVAILABLE to consumers (after producers use some for their own metabolism).` },
    { loId: 'apenvsci.productivity-energy-flow', content: '  • Units: typically kcal/m²/year or g C/m²/year.' },
    { loId: 'apenvsci.productivity-energy-flow', content: `PRODUCTIVITY VARIES by biome: tropical rainforests, estuaries, coral reefs HIGHEST. Open ocean and tundra LOWEST (per area). But OPEN OCEAN total NPP is huge because of vast area.` },
    { loId: 'apenvsci.productivity-energy-flow', content: 'TROPHIC LEVELS — energy flow hierarchy:' },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • TROPHIC LEVEL 1 — PRODUCERS (autotrophs): plants, algae, cyanobacteria. Make their own food via photosynthesis (or chemosynthesis at hydrothermal vents).` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • TROPHIC LEVEL 2 — PRIMARY CONSUMERS (herbivores): eat producers. Rabbits, cows, zooplankton.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • TROPHIC LEVEL 3 — SECONDARY CONSUMERS (carnivores or omnivores): eat primary consumers. Foxes, small fish.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • TROPHIC LEVEL 4 — TERTIARY CONSUMERS (top carnivores): eat secondary consumers. Hawks, sharks.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • DECOMPOSERS: bacteria, fungi. Break down dead organic matter; release nutrients back to soil. Operate at all levels.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • DETRITIVORES: eat detritus (dead matter, leaf litter). Earthworms, vultures, dung beetles.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `TEN-PERCENT RULE: only ~10% of the energy at one trophic level is incorporated into biomass at the next level. The other ~90% is LOST as heat (respiration), used for movement/metabolism, or undigested.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • Consequence: ENERGY PYRAMIDS — much more biomass at producer level than at top.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • Consequence: SHORT food chains. Rare to see > 4-5 trophic levels — not enough energy left.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `  • Consequence: EATING LOWER on the food chain (vegetarian) is more energy-efficient. Producing 1 kg beef requires ~10 kg plant feed.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `EXAMPLE: 10,000 kcal of plants → 1,000 kcal in herbivores → 100 kcal in carnivores → 10 kcal in top predators.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `PYRAMID OF NUMBERS / BIOMASS: at any moment, more producer individuals/biomass than consumers above. EXCEPTION: parasitic pyramids can invert (one tree, many caterpillars).` },
    { loId: 'apenvsci.productivity-energy-flow', kind: 'definition', title: 'GPP', content: 'gross primary productivity — total energy captured by photosynthesis.' },
    { loId: 'apenvsci.productivity-energy-flow', kind: 'definition', title: 'NPP', content: 'net primary productivity = GPP − respiration; available to consumers.' },
    { loId: 'apenvsci.productivity-energy-flow', kind: 'definition', title: '10% rule', content: 'only ~10% of energy passes from one trophic level to the next.' },
  ],
  methods: [
    {
      title: 'Worked pyramid',
      steps: [
        'STEP 1 — Apply the 10% rule at each step.',
        'STEP 2 — Producers: 50,000 kcal/m²/yr (given as NPP).',
        'STEP 3 — (a) Primary consumers: 50,000 × 0.10 = 5,000 kcal/m²/yr.',
        'STEP 4 — (b) Secondary consumers: 5,000 × 0.10 = 500 kcal/m²/yr.',
        'STEP 5 — (c) Tertiary consumers: 500 × 0.10 = 50 kcal/m²/yr.',
        `STEP 6 — From 50,000 to 50: a 1000-fold reduction. Why apex predators are rare and need large territories.`,
      ],
      example: { problem: `A grassland ecosystem has producers with NPP of 50,000 kcal/m²/yr. Estimate the energy available to: (a) primary consumers, (b) secondary consumers, (c) tertiary consumers.`, solution: '(a) 5,000 kcal/m²/yr. (b) 500. (c) 50.' },
      relatedLoIds: ['apenvsci.productivity-energy-flow'],
    },
  ],
  pointers: [
    { content: 'GPP = total energy captured. NPP = GPP − respiration.', kind: 'tip' },
    { content: `Trophic levels: producer → primary → secondary → tertiary; decomposers process all.`, kind: 'tip' },
    { content: '10% rule: ~90% of energy lost between levels (heat, metabolism, undigested).', kind: 'tip' },
    { content: 'Energy pyramids → short food chains → vegetarian diets more efficient.', kind: 'tip' },
  ],
};
