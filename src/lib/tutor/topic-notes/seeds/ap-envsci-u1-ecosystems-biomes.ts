/**
 * AP Environmental Science — Unit 1 CED 1.1-1.3: Ecosystems and Biomes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.ecosystems-biomes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_ECOSYSTEMS_BIOMES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.ecosystems-biomes.v1',
  course: 'AP Environmental Science',
  cedUnit: 1,
  cedTopic: '1.1-1.3',
  cedTitle: 'Ecosystems and Biomes',
  planId: 'evelyn.ap.envsci.ecosystems-biomes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.ecosystems-biomes.v1' }],
  theory: [
    { loId: 'apenvsci.ecosystems-biomes', content: `ECOSYSTEM: a community of organisms (BIOTIC) interacting with their physical environment (ABIOTIC) within a defined area.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `BIOTIC FACTORS: living components — plants, animals, fungi, bacteria. Trophic interactions (who eats whom), competition, symbiosis.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `ABIOTIC FACTORS: non-living components — temperature, water, sunlight, soil, nutrients, salinity, pH, wind.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `ECOSYSTEM SERVICES: benefits humans receive from ecosystems. Categories: PROVISIONING (food, water, timber), REGULATING (climate regulation, water purification, pollination), CULTURAL (recreation, spiritual), SUPPORTING (nutrient cycling, soil formation).` },
    { loId: 'apenvsci.ecosystems-biomes', content: `BIOME: a large-scale ecosystem type characterized by similar CLIMATE (temperature + precipitation) and dominant VEGETATION. Biomes occur in similar latitudes worldwide.` },
    { loId: 'apenvsci.ecosystems-biomes', content: 'TERRESTRIAL BIOMES (memorize 7):' },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • TUNDRA: cold (-10°C average), low precipitation, permafrost. Lichens, mosses, low shrubs. Short growing season.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • TAIGA / BOREAL FOREST: cold winters, cool summers. Coniferous forest (pine, spruce, fir). Largest terrestrial biome by area.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • TEMPERATE DECIDUOUS FOREST: moderate temperatures, distinct seasons. Broadleaf trees that drop leaves. Eastern US.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • TEMPERATE GRASSLAND: hot summers, cold winters; moderate rain. Prairies, steppes. Fertile soil → much of it converted to agriculture.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • DESERT: low precipitation (< 25 cm/yr). Hot or cold (cold deserts exist!). Cacti, drought-resistant plants.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • SAVANNA: tropical grassland with scattered trees. Wet/dry season. African plains.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • TROPICAL RAINFOREST: high temperature + high precipitation year-round. Highest biodiversity on Earth. Equatorial.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `CLIMATE DIAGRAM (rule of thumb): biome is determined PRIMARILY by temperature and precipitation patterns. Latitude and altitude both affect climate.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `AQUATIC BIOMES: split into FRESHWATER (lakes, rivers, wetlands) vs MARINE (oceans, estuaries, coral reefs).` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • ESTUARIES: where freshwater meets saltwater. Highly productive (nutrient-rich), critical nurseries for fish.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • CORAL REEFS: shallow tropical seas. Symbiotic algae (zooxanthellae) live in coral tissue. Vulnerable to bleaching when ocean warms.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • OPEN OCEAN (PELAGIC): low productivity per unit area but vast — dominated by phytoplankton.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `  • WETLANDS (freshwater): swamps, marshes, bogs. High productivity, flood control, water purification.` },
    { loId: 'apenvsci.ecosystems-biomes', kind: 'definition', title: 'biome', content: 'large-scale ecosystem type defined by climate + vegetation.' },
    { loId: 'apenvsci.ecosystems-biomes', kind: 'definition', title: 'ecosystem services', content: `benefits humans get from ecosystems (provisioning, regulating, cultural, supporting).` },
    { loId: 'apenvsci.ecosystems-biomes', kind: 'definition', title: 'estuary', content: 'where rivers meet ocean; highly productive nursery habitat.' },
  ],
  methods: [
    {
      title: 'Worked classify',
      steps: [
        'STEP 1 — Cold winters + hot summers indicates a continental climate.',
        `STEP 2 — Moderate precipitation (50 cm/yr) is too dry for forest, too wet for desert.`,
        `STEP 3 — Dominant grasses + few trees → TEMPERATE GRASSLAND (e.g., North American prairie, Eurasian steppe).`,
      ],
      example: { problem: `You're told an ecosystem has cold winters (-15°C avg), hot summers (25°C), about 50 cm/year precipitation, and is dominated by grasses with few trees. Identify the biome.`, solution: 'Temperate grassland.' },
      relatedLoIds: ['apenvsci.ecosystems-biomes'],
    },
  ],
  pointers: [
    { content: 'Ecosystem = biotic + abiotic in a defined area.', kind: 'tip' },
    { content: `Biomes are climate-defined. 7 terrestrial: tundra, taiga, temperate deciduous, temperate grassland, desert, savanna, tropical rainforest.`, kind: 'tip' },
    { content: `Aquatic biomes: estuaries and wetlands are highly productive and disproportionately important.`, kind: 'tip' },
    { content: 'Ecosystem services: provisioning, regulating, cultural, supporting.', kind: 'tip' },
  ],
};
