/**
 * Biology — Ecology: Levels of Ecological Organization & Biomes.
 *
 * The opening ecology plan for the HS Biology fan-out (NGSS HS-LS2-1).
 * Two boundaries carry the whole lesson: the one between a COMMUNITY and an
 * ECOSYSTEM (living things vs living things plus their physical setting), and
 * the one between a HABITAT and a NICHE (where an organism lives vs what it
 * does). Biomes then fall out of two numbers — temperature and precipitation —
 * so the concept segment is organized around those axes rather than around a
 * map, and every check is an MCQ with the climate values stated in words.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U9_ECOSYSTEMS_BIOMES: LessonPlan = {
  id: 'evelyn.hs.bio.ecosystems-biomes.v1',
  title: 'Levels of Ecological Organization & Biomes',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.ecosystems-biomes',
      standard: 'BIO-9.1',
      description:
        'Order the levels of ecological organization from organism to biosphere, distinguish biotic from abiotic factors and habitat from niche, and identify the major terrestrial and aquatic biomes from their temperature and precipitation patterns (NGSS HS-LS2-1).',
    },
  ],
  prerequisites: ['bio.domains-kingdoms-diversity'],
  followUps: ['bio.energy-flow-food-webs'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ecology as the science of scale — and show that biome boundaries are lines climate can move.',
      script:
        'A conservation team trying to save one endangered frog cannot just protect the frog. They have to protect the pond, the insects it eats, the shade over the water, and the rainfall that keeps the pond from drying up. Ecology is the habit of zooming out one level at a time until you can see what an organism actually depends on. And those levels are not fixed forever: as the climate warms, the treeline in Alaska is creeping north into ground that has been tundra for thousands of years. In this lesson you learn the ladder from a single organism up to the whole biosphere, and how just two numbers — temperature and rainfall — decide which biome a place becomes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-levels-and-biomes',
      kind: 'concept',
      goal: 'The organization ladder, the community/ecosystem boundary, habitat vs niche, and the climate axes that define biomes.',
      keyIdeas: [
        'THE LADDER — ORGANISM → POPULATION → COMMUNITY → ECOSYSTEM → BIOME → BIOSPHERE. One wolf is an organism; all the wolves in Yellowstone are a population (one species, one place); wolves plus elk plus aspen plus soil fungi are a community; add the river, snowpack and sunlight and you have an ecosystem. Each level nests inside the next, and the levels differ by what they INCLUDE, not by how big the area is.',
        'COMMUNITY VS ECOSYSTEM — the boundary students miss most. A COMMUNITY is every living thing in an area: all populations of all species. An ECOSYSTEM is that same community PLUS the non-living surroundings it interacts with. Community = life only. Ecosystem = life + environment. If your description mentions temperature, water, soil or sunlight, you have crossed into ecosystem.',
        'BIOTIC VS ABIOTIC — BIOTIC factors are living or once-living: predators, competitors, plants, bacteria, a fallen log. ABIOTIC factors are non-living physical and chemical conditions: temperature, rainfall, sunlight, soil pH, salinity, wind, dissolved oxygen. Careful: a dead leaf and a shed shell count as biotic in origin, while the water they float in is abiotic.',
        'HABITAT VS NICHE — the habitat is the ADDRESS, the niche is the JOB. A habitat is the physical place an organism lives; a niche is everything it does there — what it eats, when it is active, what eats it, how it affects the nutrients around it. Two species can share a habitat, but the COMPETITIVE EXCLUSION PRINCIPLE says no two species can occupy exactly the same niche in the same place indefinitely: one out-competes the other, or the two split the niche between them.',
        'BIOMES ARE DEFINED BY CLIMATE, NOT BY LOCATION — a BIOME is a group of ecosystems worldwide that share a climate and therefore share a growth form of vegetation. Two numbers do most of the work: average TEMPERATURE and annual PRECIPITATION. Rainfall mostly decides whether a place grows trees, grasses or scattered scrub; temperature mostly decides which trees or grasses survive there. "Africa" is not a biome — Africa contains rainforest, savanna, desert and alpine tundra.',
        'THE SIX MAJOR TERRESTRIAL BIOMES BY THE NUMBERS — TUNDRA: about -12°C average, roughly 200 mm of precipitation a year, permafrost, no trees, mosses and lichens. TAIGA (boreal forest): about -5°C average, 400-600 mm, conifers with needle leaves. TEMPERATE FOREST: about 10°C average, 800-1500 mm, broadleaf trees that drop their leaves. GRASSLAND: about 10°C average but only 300-800 mm, grasses with few trees. DESERT: any temperature at all, under about 250 mm — the driest, NOT necessarily the hottest. TROPICAL RAINFOREST: about 26°C year-round, over 2000 mm, layered canopy, highest biodiversity on Earth.',
        'AQUATIC ECOSYSTEMS — sorted first by SALINITY. FRESHWATER (lakes, ponds, rivers, wetlands) has very little dissolved salt and holds most of the liquid water people drink. MARINE (open ocean, coastal zones, coral reefs) is salty and covers about 70 percent of the planet. An ESTUARY is where a river meets the sea, so salinity swings with the tide; estuaries are among the most productive places on Earth and act as nurseries for young fish. Here the key abiotic factors are salinity, light penetration, depth, temperature and dissolved oxygen.',
        'LATITUDE AND ELEVATION RUN THE SAME PATTERN TWICE — walking from the equator toward a pole takes you through rainforest, then grassland or desert, then temperate forest, then taiga, then tundra. Climbing a tall tropical mountain takes you through the SAME sequence in a few thousand metres, because both moving poleward and moving upward lower the temperature. That is why a mountaintop in Ecuador can be alpine tundra while the forest at its base is rainforest.',
      ],
      vocabulary: [
        { term: 'abiotic factor', definition: 'a non-living physical or chemical condition of an environment, such as temperature, rainfall, soil pH or salinity.' },
        { term: 'niche', definition: 'the full role a species plays in its community — what it eats, when it is active, and how it interacts with everything around it.' },
        { term: 'estuary', definition: 'the zone where a river meets the ocean, with salinity that changes with the tide; a highly productive nursery habitat.' },
      ],
      suggestedTools: ['show_concept_map', 'show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-biome',
      kind: 'worked_example',
      problem:
        'A field station reports its climate record: the coldest month averages -25°C, the warmest month averages 8°C, total precipitation is about 200 mm per year, the subsoil stays frozen all year, and no trees grow. Which biome is this, and how do you rule out desert, which is also very dry?',
      steps: [
        'Read the two climate axes separately. Precipitation is about 200 mm a year — that is genuinely dry, under the roughly 250 mm line. Temperature is extremely cold: a warmest month of only 8°C means a very short growing season.',
        'Use the dryness first: 200 mm of precipitation is too little to support a closed forest, which matches the reported absence of trees.',
        'Now use temperature to choose between the two dry candidates. Desert is defined by low precipitation at ANY temperature; tundra is low precipitation PLUS persistent cold with permanently frozen subsoil.',
        'The permafrost and the 8°C warmest month settle it: this is tundra. A cold desert like the Gobi is dry and cold in winter but thaws deeply in summer and has no permafrost layer, so the frozen subsoil is the deciding piece of evidence.',
      ],
      answer: 'Tundra — dry AND persistently cold with permafrost. Low rainfall alone would only narrow it to "dry biome"; the temperature record and permafrost separate tundra from desert.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sort-hierarchy',
      kind: 'worked_example',
      problem:
        'A researcher studying one oak woodland writes four notes. Note 1: a single male red fox, tagged and tracked. Note 2: the 60 grey squirrels living in the woodland. Note 3: the oaks, squirrels, foxes, beetles and soil fungi of the woodland taken together. Note 4: everything in note 3 plus the leaf litter, the soil moisture and the sunlight reaching the forest floor. Name the level of ecological organization each note describes.',
      steps: [
        'Note 1 names one individual living thing, so it sits at the lowest level: an ORGANISM.',
        'Note 2 counts many individuals but they are all one species in one place — that is a POPULATION. The number 60 is a population size, not a new level.',
        'Note 3 adds several different species interacting in the same place, and every item on the list is alive. Multiple populations, living things only, means COMMUNITY.',
        'Note 4 keeps all of note 3 and adds leaf litter, moisture and sunlight — abiotic factors. Community plus abiotic surroundings means ECOSYSTEM. That single addition is the whole difference between notes 3 and 4.',
      ],
      answer: 'Note 1 = organism, note 2 = population, note 3 = community, note 4 = ecosystem. Notes 3 and 4 cover the same woodland; only note 4 includes the non-living factors.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-biome-from-climate',
      kind: 'try_yourself',
      problem:
        'A region has no trees at all, mosses and lichens as its dominant plants, and a layer of soil that never thaws. Which climate record matches this biome?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Average temperature about 26°C every month, with about 2400 mm of precipitation a year' },
        { id: 'b', text: 'Average temperature about 10°C, with about 1200 mm of precipitation a year' },
        { id: 'c', text: 'Average temperature about -12°C, with about 200 mm of precipitation a year', correct: true },
        { id: 'd', text: 'Average temperature about 30°C in summer, with about 150 mm of precipitation a year' },
      ],
      expectedAnswer: 'Average temperature about -12°C, with about 200 mm of precipitation a year',
      hints: [
        'Two of these records are dry. Use the temperature axis to tell the dry biomes apart.',
        'Permanently frozen subsoil cannot form in a hot desert — the biome you want is dry AND cold year-round.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-order-hierarchy',
      kind: 'try_yourself',
      problem:
        'Put these levels of ecological organization in order from the one that includes the least to the one that includes the most: biome, community, ecosystem, organism, population.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'organism → population → community → ecosystem → biome', correct: true },
        { id: 'b', text: 'organism → population → ecosystem → community → biome' },
        { id: 'c', text: 'organism → community → population → ecosystem → biome' },
        { id: 'd', text: 'population → organism → community → biome → ecosystem' },
      ],
      expectedAnswer: 'organism → population → community → ecosystem → biome',
      hints: [
        'Start at one individual and ask what each step adds: more individuals of one species, then other species, then the non-living surroundings.',
        'A community is living things only; an ecosystem is that community plus its abiotic factors — so the ecosystem must come after the community.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-habitat-vs-niche',
      kind: 'try_yourself',
      problem:
        'Two warbler species nest in the same spruce trees in the same forest. One feeds on insects at the outer tips of the highest branches; the other feeds on insects along the lower inner branches near the trunk. Which statement best describes their situation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They share the same habitat and the same niche, which is why both species can live in the trees' },
        { id: 'b', text: 'They occupy the same niche but different habitats, since they feed at different heights' },
        { id: 'c', text: 'They occupy different habitats, so competitive exclusion never applies to them' },
        { id: 'd', text: 'They share a habitat but occupy different niches, so competitive exclusion does not force one out', correct: true },
      ],
      expectedAnswer: 'They share a habitat but occupy different niches, so competitive exclusion does not force one out',
      hints: [
        'Habitat is the address, niche is the job. Do these birds live in the same place, do the same work, or both?',
        'Both species are in one spruce forest, but they feed in different parts of the tree — that difference is a difference in role, not in address.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-community-vs-ecosystem',
      kind: 'misconception_check',
      question:
        'A student writes: "The community of a pond is the pond itself — the water, the mud, the sunlight and every organism in it." What went wrong?',
      commonErrors: [
        {
          answer: 'The community includes the water, mud and sunlight',
          misconception: 'Treating "community" as a word for the whole place, so the abiotic factors get swept in and the community/ecosystem boundary disappears.',
          correctsTo:
            'The COMMUNITY of the pond is only the living part: every population of fish, insects, plants, algae, bacteria and fungi. The moment you add the water, the mud, the dissolved oxygen and the sunlight, you have described the ECOSYSTEM. Both terms cover the same pond — the difference is what is counted, not how large the area is. A quick self-check: if the item would still be there with all the life removed, it is abiotic, so it belongs to the ecosystem and not to the community.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The ladder: organism → population → community → ecosystem → biome → biosphere; each level adds what it includes, not just area.',
        'Community = every living thing in an area. Ecosystem = that community PLUS its abiotic factors (temperature, water, soil, light).',
        'Habitat is the address, niche is the job — and competitive exclusion means two species cannot hold identical niches in one place for long.',
        'Biomes are set by TEMPERATURE and PRECIPITATION, not by continent: tundra, taiga, temperate forest, grassland, desert, tropical rainforest. Desert means dry, not hot.',
        'Aquatic ecosystems sort by salinity — freshwater, estuary (river meets sea, highly productive), marine — and latitude and elevation produce the same biome sequence twice.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Levels of Ecological Organization & Biomes' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
