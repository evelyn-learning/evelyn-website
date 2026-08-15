/**
 * Biology — Unit 9 CED 9.1: Levels of Ecological Organization & Biomes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.ecosystems-biomes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U9_ECOSYSTEMS_BIOMES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.ecosystems-biomes.v1',
  course: 'Biology',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Levels of Ecological Organization & Biomes',
  planId: 'evelyn.hs.bio.ecosystems-biomes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.ecosystems-biomes.v1' }],
  theory: [
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'The ladder', content: `THE LADDER — ORGANISM → POPULATION → COMMUNITY → ECOSYSTEM → BIOME → BIOSPHERE. One wolf is an organism; all the wolves in Yellowstone are a population (one species, one place); wolves plus elk plus aspen plus soil fungi are a community; add the river, snowpack and sunlight and you have an ecosystem. Each level nests inside the next, and the levels differ by what they INCLUDE, not by how big the area is.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'Community vs ecosystem', content: `COMMUNITY VS ECOSYSTEM — the boundary students miss most. A COMMUNITY is every living thing in an area: all populations of all species. An ECOSYSTEM is that same community PLUS the non-living surroundings it interacts with. Community = life only. Ecosystem = life + environment. If your description mentions temperature, water, soil or sunlight, you have crossed into ecosystem.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'Biotic vs abiotic', content: `BIOTIC VS ABIOTIC — BIOTIC factors are living or once-living: predators, competitors, plants, bacteria, a fallen log. ABIOTIC factors are non-living physical and chemical conditions: temperature, rainfall, sunlight, soil pH, salinity, wind, dissolved oxygen. Careful: a dead leaf and a shed shell count as biotic in origin, while the water they float in is abiotic.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'Habitat vs niche', content: `HABITAT VS NICHE — the habitat is the ADDRESS, the niche is the JOB. A habitat is the physical place an organism lives; a niche is everything it does there — what it eats, when it is active, what eats it, how it affects the nutrients around it. Two species can share a habitat, but the COMPETITIVE EXCLUSION PRINCIPLE says no two species can occupy exactly the same niche in the same place indefinitely: one out-competes the other, or the two split the niche between them.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'Biomes are defined by climate, not by location', content: `BIOMES ARE DEFINED BY CLIMATE, NOT BY LOCATION — a BIOME is a group of ecosystems worldwide that share a climate and therefore share a growth form of vegetation. Two numbers do most of the work: average TEMPERATURE and annual PRECIPITATION. Rainfall mostly decides whether a place grows trees, grasses or scattered scrub; temperature mostly decides which trees or grasses survive there. "Africa" is not a biome — Africa contains rainforest, savanna, desert and alpine tundra.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'The six major terrestrial biomes by the numbers', content: `THE SIX MAJOR TERRESTRIAL BIOMES BY THE NUMBERS — TUNDRA: about -12°C average, roughly 200 mm of precipitation a year, permafrost, no trees, mosses and lichens. TAIGA (boreal forest): about -5°C average, 400-600 mm, conifers with needle leaves. TEMPERATE FOREST: about 10°C average, 800-1500 mm, broadleaf trees that drop their leaves. GRASSLAND: about 10°C average but only 300-800 mm, grasses with few trees. DESERT: any temperature at all, under about 250 mm — the driest, NOT necessarily the hottest. TROPICAL RAINFOREST: about 26°C year-round, over 2000 mm, layered canopy, highest biodiversity on Earth.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'Aquatic ecosystems', content: `AQUATIC ECOSYSTEMS — sorted first by SALINITY. FRESHWATER (lakes, ponds, rivers, wetlands) has very little dissolved salt and holds most of the liquid water people drink. MARINE (open ocean, coastal zones, coral reefs) is salty and covers about 70 percent of the planet. An ESTUARY is where a river meets the sea, so salinity swings with the tide; estuaries are among the most productive places on Earth and act as nurseries for young fish. Here the key abiotic factors are salinity, light penetration, depth, temperature and dissolved oxygen.` },
    { loId: 'bio.ecosystems-biomes', kind: 'framework', title: 'Latitude and elevation run the same pattern twice', content: `LATITUDE AND ELEVATION RUN THE SAME PATTERN TWICE — walking from the equator toward a pole takes you through rainforest, then grassland or desert, then temperate forest, then taiga, then tundra. Climbing a tall tropical mountain takes you through the SAME sequence in a few thousand metres, because both moving poleward and moving upward lower the temperature. That is why a mountaintop in Ecuador can be alpine tundra while the forest at its base is rainforest.` },
    { loId: 'bio.ecosystems-biomes', kind: 'definition', title: 'abiotic factor', content: `a non-living physical or chemical condition of an environment, such as temperature, rainfall, soil pH or salinity.` },
    { loId: 'bio.ecosystems-biomes', kind: 'definition', title: 'niche', content: `the full role a species plays in its community — what it eats, when it is active, and how it interacts with everything around it.` },
    { loId: 'bio.ecosystems-biomes', kind: 'definition', title: 'estuary', content: `the zone where a river meets the ocean, with salinity that changes with the tide; a highly productive nursery habitat.` },
  ],
  methods: [
    {
      title: 'Worked identify biome',
      steps: [
        `Read the two climate axes separately. Precipitation is about 200 mm a year — that is genuinely dry, under the roughly 250 mm line. Temperature is extremely cold: a warmest month of only 8°C means a very short growing season.`,
        `Use the dryness first: 200 mm of precipitation is too little to support a closed forest, which matches the reported absence of trees.`,
        `Now use temperature to choose between the two dry candidates. Desert is defined by low precipitation at ANY temperature; tundra is low precipitation PLUS persistent cold with permanently frozen subsoil.`,
        `The permafrost and the 8°C warmest month settle it: this is tundra. A cold desert like the Gobi is dry and cold in winter but thaws deeply in summer and has no permafrost layer, so the frozen subsoil is the deciding piece of evidence.`,
      ],
      example: { problem: `A field station reports its climate record: the coldest month averages -25°C, the warmest month averages 8°C, total precipitation is about 200 mm per year, the subsoil stays frozen all year, and no trees grow. Which biome is this, and how do you rule out desert, which is also very dry?`, solution: `Tundra — dry AND persistently cold with permafrost. Low rainfall alone would only narrow it to "dry biome"; the temperature record and permafrost separate tundra from desert.` },
      relatedLoIds: ['bio.ecosystems-biomes'],
    },
    {
      title: 'Worked sort hierarchy',
      steps: [
        `Note 1 names one individual living thing, so it sits at the lowest level: an ORGANISM.`,
        `Note 2 counts many individuals but they are all one species in one place — that is a POPULATION. The number 60 is a population size, not a new level.`,
        `Note 3 adds several different species interacting in the same place, and every item on the list is alive. Multiple populations, living things only, means COMMUNITY.`,
        `Note 4 keeps all of note 3 and adds leaf litter, moisture and sunlight — abiotic factors. Community plus abiotic surroundings means ECOSYSTEM. That single addition is the whole difference between notes 3 and 4.`,
      ],
      example: { problem: `A researcher studying one oak woodland writes four notes. Note 1: a single male red fox, tagged and tracked. Note 2: the 60 grey squirrels living in the woodland. Note 3: the oaks, squirrels, foxes, beetles and soil fungi of the woodland taken together. Note 4: everything in note 3 plus the leaf litter, the soil moisture and the sunlight reaching the forest floor. Name the level of ecological organization each note describes.`, solution: `Note 1 = organism, note 2 = population, note 3 = community, note 4 = ecosystem. Notes 3 and 4 cover the same woodland; only note 4 includes the non-living factors.` },
      relatedLoIds: ['bio.ecosystems-biomes'],
    },
  ],
  pointers: [
    { content: `The COMMUNITY of the pond is only the living part: every population of fish, insects, plants, algae, bacteria and fungi. The moment you add the water, the mud, the dissolved oxygen and the sunlight, you have described the ECOSYSTEM. Both terms cover the same pond — the difference is what is counted, not how large the area is. A quick self-check: if the item would still be there with all the life removed, it is abiotic, so it belongs to the ecosystem and not to the community.`, kind: 'common-error' },
    { content: `The ladder: organism → population → community → ecosystem → biome → biosphere; each level adds what it includes, not just area.`, kind: 'tip' },
    { content: `Community = every living thing in an area. Ecosystem = that community PLUS its abiotic factors (temperature, water, soil, light).`, kind: 'tip' },
    { content: `Habitat is the address, niche is the job — and competitive exclusion means two species cannot hold identical niches in one place for long.`, kind: 'tip' },
    { content: `Biomes are set by TEMPERATURE and PRECIPITATION, not by continent: tundra, taiga, temperate forest, grassland, desert, tropical rainforest. Desert means dry, not hot.`, kind: 'tip' },
    { content: `Aquatic ecosystems sort by salinity — freshwater, estuary (river meets sea, highly productive), marine — and latitude and elevation produce the same biome sequence twice.`, kind: 'tip' },
    { content: `Community vs ecosystem is about WHAT'S COUNTED, not area size. Self-check: if the item would still be there after you removed all life (water, mud, sunlight, soil), it's abiotic — so you're describing an ecosystem, not a community.`, kind: 'common-error' },
    { content: `Desert is defined by DRYNESS (under ~250 mm/yr), not heat. Antarctica and the Gobi are deserts. Never rule out desert because a climate record says cold.`, kind: 'gotcha' },
    { content: `Tundra and desert are both dry — use PERMAFROST and a warmest month near 8°C to separate them. Cold deserts get cold but thaw deeply in summer and have no permanently frozen subsoil.`, kind: 'edge-case' },
    { content: `A continent or country is not a biome. 'Africa,' 'Brazil' and 'the Arctic Circle' name places; biomes are climate categories that repeat worldwide, so one continent can hold rainforest, savanna, desert and alpine tundra.`, kind: 'vocab-note' },
    { content: `Habitat = address, niche = job. Two species sharing spruce trees are NOT in the same niche if they feed in different parts of the tree. Competitive exclusion only applies to identical niches, not shared habitats.`, kind: 'vocab-note' },
    { content: `Dead and once-living material is still BIOTIC: leaf litter, a fallen log, a shed shell, bones. Abiotic means never alive — water, temperature, salinity, pH, light.`, kind: 'edge-case' },
    { content: `Population = ONE species in ONE place. A count (60 squirrels) is population SIZE, not a separate level of organization. Multiple species interacting jumps you straight to community.`, kind: 'common-error' },
    { content: `Sort aquatic ecosystems by SALINITY first, not by size. Estuaries aren't 'small oceans' — their salinity swings with the tide, which is exactly why they're so productive.`, kind: 'tip' },
  ],
};
