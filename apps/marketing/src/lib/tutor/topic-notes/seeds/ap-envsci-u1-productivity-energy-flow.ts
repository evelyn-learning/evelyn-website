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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.productivity-energy-flow.v1' }],
  theory: [
    { loId: 'apenvsci.productivity-energy-flow', content: `ENERGY FLOW IS ONE-WAY. Energy enters an ecosystem from the sun, is captured by producers, and passes up through consumers — being LOST AS HEAT at every transfer. Unlike matter, energy does NOT cycle; it flows through and dissipates. This one-way loss is the master fact of this topic.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `PRIMARY PRODUCTIVITY is the RATE at which producers capture solar energy (or chemical energy, in chemosynthesis) and store it as biomass. It sets the energy budget for the entire ecosystem above the producers.` },
    { loId: 'apenvsci.productivity-energy-flow', kind: 'definition', title: 'GPP (gross primary productivity)', content: `GROSS PRIMARY PRODUCTIVITY is the TOTAL energy captured by photosynthesis, before producers spend any of it on their own respiration.` },
    { loId: 'apenvsci.productivity-energy-flow', kind: 'definition', title: 'NPP (net primary productivity)', content: `NET PRIMARY PRODUCTIVITY = GPP minus RESPIRATION. It is the energy left over after producers meet their own metabolic needs, so it is the energy actually AVAILABLE to consumers (or accumulating as new biomass). NPP, not GPP, is the consumer-relevant quantity.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `UNITS for productivity are typically kcal per square meter per year (kcal/m²/yr) or grams of carbon per square meter per year (g C/m²/yr) — an amount of energy or biomass, per area, per time.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `PRODUCTIVITY VARIES BY BIOME. HIGHEST per unit area: tropical rainforests, estuaries, coral reefs, wetlands. LOWEST per unit area: open ocean and tundra. IMPORTANT twist — the OPEN OCEAN has low productivity per area but a HUGE total NPP because it covers so much of the planet.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `TROPHIC LEVELS (the energy-flow hierarchy): LEVEL 1 PRODUCERS / AUTOTROPHS (plants, algae, cyanobacteria) make their own food by photosynthesis (or chemosynthesis at hydrothermal vents). LEVEL 2 PRIMARY CONSUMERS / HERBIVORES (rabbits, cows, zooplankton) eat producers. LEVEL 3 SECONDARY CONSUMERS (carnivores/omnivores like foxes, small fish) eat primary consumers. LEVEL 4 TERTIARY CONSUMERS / TOP CARNIVORES (hawks, sharks) eat secondary consumers.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `DECOMPOSERS vs DETRITIVORES. DECOMPOSERS (bacteria, fungi) chemically break down dead organic matter and release nutrients back to the soil; they operate at ALL levels. DETRITIVORES (earthworms, vultures, dung beetles) physically EAT detritus — dead matter and leaf litter. Both recycle matter but sit outside the numbered trophic chain.` },
    { loId: 'apenvsci.productivity-energy-flow', kind: 'definition', title: 'ten-percent rule', content: `the TEN-PERCENT RULE: only about 10% of the energy at one trophic level is incorporated into biomass at the next level. The other roughly 90% is lost as heat (respiration), spent on movement/metabolism, or passes through undigested.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `CONSEQUENCES OF THE 10% RULE: (1) ENERGY PYRAMIDS — far more biomass/energy at the producer base than at the top. (2) SHORT FOOD CHAINS — rarely more than 4-5 trophic levels because too little energy remains. (3) EATING LOW on the chain is energy-efficient — producing 1 kg of beef takes roughly 10 kg of plant feed, so vegetarian diets capture more of the original solar energy.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `EXAMPLE CHAIN illustrating the 10% rule: 10,000 kcal of plants yields about 1,000 kcal in herbivores, then about 100 kcal in carnivores, then about 10 kcal in top predators. This 1000-fold drop over three steps is why apex predators are rare and need large territories.` },
    { loId: 'apenvsci.productivity-energy-flow', content: `PYRAMIDS OF NUMBERS / BIOMASS: at any moment there are usually more producer individuals and more producer biomass than the consumers above. EXCEPTION: pyramids can INVERT in parasitic systems (one large tree supporting many caterpillars) or where fast-reproducing producers turn over quickly.` },
  ],
  methods: [
    {
      title: 'Apply the 10% rule up an energy pyramid',
      when_to_use: 'When given the energy or NPP at one trophic level and asked for the energy at higher levels.',
      steps: [
        `STEP 1 — START from the given level (often producers, stated as NPP). Write down its energy value with units.`,
        `STEP 2 — MULTIPLY BY 0.10 to move UP one trophic level (or DIVIDE by 10). This applies the 10% rule.`,
        `STEP 3 — REPEAT the times-0.10 step for each additional level you need.`,
        `STEP 4 — INTERPRET the result: note how steeply energy falls (a 1000-fold drop over three steps) and connect it to why top predators are scarce.`,
      ],
      example: { problem: `A grassland ecosystem has producers with NPP of 50,000 kcal/m²/yr. Estimate the energy available to (a) primary, (b) secondary, and (c) tertiary consumers.`, solution: `(a) Primary consumers: 50,000 times 0.10 = 5,000 kcal/m²/yr. (b) Secondary consumers: 5,000 times 0.10 = 500 kcal/m²/yr. (c) Tertiary consumers: 500 times 0.10 = 50 kcal/m²/yr. From 50,000 down to 50 is a 1000-fold reduction — which is why apex predators are rare and need large territories.` },
      relatedLoIds: ['apenvsci.productivity-energy-flow'],
    },
  ],
  pointers: [
    { content: 'NPP = GPP minus respiration. NPP is the energy actually available to consumers.', kind: 'tip' },
    { content: '10% rule: about 90% of energy is lost between trophic levels (heat, metabolism, undigested).', kind: 'tip' },
    { content: 'Move UP a level: multiply by 0.10. Move implied biomass DOWN: divide by 0.10.', kind: 'tip' },
    { content: 'Open ocean: low productivity per area but huge total NPP due to vast area.', kind: 'tip' },
    { content: 'Decomposers and detritivores recycle matter but sit outside the numbered trophic chain.', kind: 'tip' },
    { content: 'The 10% loss forces short food chains and makes eating low on the chain more efficient.', kind: 'tip' },
  ],
};
