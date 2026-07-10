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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.ecosystems-biomes.v1' }],
  theory: [
    { loId: 'apenvsci.ecosystems-biomes', kind: 'definition', title: 'ecosystem', content: `an ECOSYSTEM is a community of organisms (BIOTIC) interacting with their physical environment (ABIOTIC) within a defined area. It bundles the living community and the non-living conditions that community depends on.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `BIOTIC vs ABIOTIC — the core split. BIOTIC FACTORS are the LIVING components: plants, animals, fungi, bacteria, plus their interactions (who eats whom, competition, symbiosis). ABIOTIC FACTORS are the NON-LIVING physical/chemical components: temperature, water, sunlight, soil, nutrients, salinity, pH, wind. On the exam, sort any listed factor into exactly one of these two buckets.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `ECOSYSTEM SERVICES: benefits humans receive from ecosystems. FOUR categories to memorize — PROVISIONING (food, water, timber), REGULATING (climate regulation, water purification, pollination, flood control), CULTURAL (recreation, spiritual, aesthetic), SUPPORTING (nutrient cycling, soil formation, primary production). Supporting services underpin all the others.` },
    { loId: 'apenvsci.ecosystems-biomes', kind: 'definition', title: 'biome', content: `a BIOME is a large-scale ecosystem type defined by similar CLIMATE (temperature + precipitation) and dominant VEGETATION. The same biome type recurs at similar latitudes worldwide — climate, not location, sets the pattern.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `CLIMATE DRIVES BIOMES. A biome is determined PRIMARILY by TEMPERATURE and PRECIPITATION. Both LATITUDE (distance from equator) and ALTITUDE (elevation) shape climate — higher latitude and higher altitude both trend colder. This is why an Arctic forest and an Amazon forest are utterly different communities.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `SEVEN TERRESTRIAL BIOMES (memorize all): TUNDRA — very cold (around -10°C average), low precipitation, PERMAFROST, short growing season; lichens, mosses, low shrubs. TAIGA / BOREAL FOREST — cold winters, cool summers; coniferous forest (pine, spruce, fir); LARGEST terrestrial biome by area. TEMPERATE DECIDUOUS FOREST — moderate temps, distinct seasons; broadleaf trees that drop leaves; eastern US.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `TERRESTRIAL BIOMES continued: TEMPERATE GRASSLAND — hot summers, cold winters, moderate rain; prairies and steppes; FERTILE soil so much of it is converted to agriculture. DESERT — very low precipitation (under 25 cm/yr); can be HOT or COLD (cold deserts exist!); cacti and drought-resistant plants. SAVANNA — tropical grassland with scattered trees, distinct WET/DRY seasons; African plains. TROPICAL RAINFOREST — high temperature AND high precipitation year-round; the HIGHEST biodiversity on Earth; equatorial.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `AQUATIC BIOMES split into FRESHWATER (lakes, rivers/streams, wetlands) and MARINE (open ocean, estuaries, coral reefs). Aquatic zones are classified by depth and light: PELAGIC = open water column; BENTHIC = bottom.` },
    { loId: 'apenvsci.ecosystems-biomes', kind: 'definition', title: 'estuary', content: `an ESTUARY is where freshwater rivers meet saltwater ocean. Estuaries are HIGHLY PRODUCTIVE (nutrient-rich, brackish) and serve as critical NURSERIES for fish and shellfish. Disproportionately important despite small area.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `HIGH-PRODUCTIVITY aquatic systems to remember: ESTUARIES (nutrient-rich nurseries), CORAL REEFS (shallow tropical seas; symbiotic algae called ZOOXANTHELLAE live in coral tissue; vulnerable to BLEACHING when ocean warms), and freshwater WETLANDS (swamps, marshes, bogs — high productivity, flood control, water purification). By contrast the OPEN OCEAN / PELAGIC zone has LOW productivity per unit area but a huge total because it is so vast; dominated by phytoplankton.` },
    { loId: 'apenvsci.ecosystems-biomes', content: `CORAL REEF BLEACHING: reef corals depend on symbiotic zooxanthellae for color and much of their food. When water gets too warm, corals EXPEL the algae, turn white (bleach), and can starve. Warming oceans therefore threaten one of the most biodiverse marine biomes.` },
  ],
  methods: [
    {
      title: 'Identify a biome from climate + vegetation clues',
      when_to_use: 'When an FRQ or stimulus gives temperature, precipitation, and dominant plants and asks you to name the biome.',
      steps: [
        `STEP 1 — Read the TEMPERATURE pattern. Cold winters + hot summers signals a CONTINENTAL (mid-latitude interior) climate; uniformly hot signals tropical; uniformly cold signals tundra/taiga.`,
        `STEP 2 — Read the PRECIPITATION. Very low (under 25 cm/yr) points to DESERT; very high year-round points to TROPICAL RAINFOREST; moderate is grassland or temperate forest.`,
        `STEP 3 — Read the DOMINANT VEGETATION. Grasses with few trees rule out forest; broadleaf trees say temperate deciduous; conifers say taiga; lichens/mosses say tundra.`,
        `STEP 4 — CROSS-CHECK all three clues and name the single biome they jointly indicate.`,
      ],
      example: { problem: `An ecosystem has cold winters (about -15°C average), hot summers (about 25°C), roughly 50 cm/yr precipitation, and is dominated by grasses with few trees. Identify the biome.`, solution: `Cold winters + hot summers = continental climate. 50 cm/yr is too dry for forest, too wet for desert. Grasses with few trees seals it: TEMPERATE GRASSLAND (e.g., North American prairie, Eurasian steppe).` },
      relatedLoIds: ['apenvsci.ecosystems-biomes'],
    },
  ],
  pointers: [
    { content: 'Biotic = living; abiotic = non-living. Sort every listed factor into exactly one bucket.', kind: 'tip' },
    { content: 'Biomes are CLIMATE-defined (temp + precipitation), not location-defined. Same biome recurs at similar latitudes.', kind: 'tip' },
    { content: 'Ecosystem services: PROVISIONING, REGULATING, CULTURAL, SUPPORTING. Name the category on the FRQ.', kind: 'tip' },
    { content: 'Estuaries, wetlands, and coral reefs are the high-productivity standouts despite small area.', kind: 'tip' },
    { content: 'Cold deserts exist! Desert is defined by low precipitation, not by heat.', kind: 'tip' },
    { content: 'Coral bleaching = warm water expels symbiotic zooxanthellae. Taiga = largest terrestrial biome.', kind: 'tip' },
  ],
};
