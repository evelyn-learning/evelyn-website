/**
 * Grade 7 Science — Unit 9 CED 9.4: Biomes & Habitats.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.biomes-and-habitats.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U9_BIOMES_AND_HABITATS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.biomes-and-habitats.v1',
  course: 'Grade 7 Science',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Biomes & Habitats',
  planId: 'evelyn.ms.m7sci.biomes-and-habitats.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.biomes-and-habitats.v1' }],
  theory: [
    { loId: 'm7sci.biomes-and-habitats', kind: 'framework', title: 'A biome is a huge region defined by its climate', content: `A BIOME IS A HUGE REGION DEFINED BY ITS CLIMATE — mainly by two things, how warm it is and how much precipitation it gets. Precipitation means rain, snow, sleet and hail: water arriving from the sky. Places on opposite sides of the world belong to the same biome when their climate is alike, because similar climate supports similar kinds of living things. So a biome is not a country and not a continent. Africa is not a biome, because Africa contains rainforest, desert, grassland and cold mountaintops all at once.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'framework', title: 'Biome, habitat and niche are three different sizes of answer', content: `BIOME, HABITAT AND NICHE ARE THREE DIFFERENT SIZES OF ANSWER — a BIOME is the whole region, like tropical rainforest. A HABITAT is the specific place one organism lives, like the underside of a leaf high in a rainforest tree. A NICHE is not a place at all: it is the JOB an organism does, which means what it eats, what eats it, when it is active, and how it changes the things around it. Address, then room, then job. WRONG: "The frog habitat is the rainforest biome." CORRECT: "The frog lives in the rainforest biome, its habitat is the leaves of the canopy, and its niche includes hunting insects at night."` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'framework', title: 'The land biomes, sorted by the two climate axes', content: `THE LAND BIOMES, SORTED BY THE TWO CLIMATE AXES — TROPICAL RAINFOREST: warm all year and wet nearly all year, with trees growing in layers and a huge variety of living things. DESERT: very little precipitation, which is the ONLY thing that makes it a desert. GRASSLAND: too dry for a thick forest but wetter than a desert, so grasses dominate and trees are scattered. TEMPERATE FOREST: warm summers and cold winters with plenty of precipitation, full of broad-leaved trees that drop their leaves in fall. TAIGA, also called boreal forest: long cold winters and short cool summers, covered in conifers with needle-shaped leaves. TUNDRA: the coldest and one of the driest, with a layer of soil that stays frozen all year, so no trees grow and mosses and lichens take over.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'framework', title: 'Desert means dry, not hot', content: `DESERT MEANS DRY, NOT HOT — this is the mistake almost everyone makes. A desert is a region that receives very little precipitation, whatever its temperature. Some deserts are scorching in the daytime. Much of Antarctica is also a desert, because almost no precipitation falls there; the water already present is locked up as ice. If you sort by heat instead of by water, you will put Antarctica in the wrong place every time.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'framework', title: 'The water biomes sort by salt', content: `THE WATER BIOMES SORT BY SALT — FRESHWATER covers lakes, ponds, rivers, streams and wetlands, and holds very little dissolved salt. MARINE covers the oceans, coral reefs and coastal waters, and is salty. Where a river runs into the sea you get an estuary, where the saltiness rises and falls with the tide. In water, the conditions that matter most are how salty it is, how deep it is, how much light reaches down, and the temperature.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'framework', title: 'Why the living things fit the place', content: `WHY THE LIVING THINGS FIT THE PLACE — this is the payoff, and the wording has to be exact. Organisms in a biome tend to have traits suited to its conditions because of what happened to POPULATIONS over many GENERATIONS, not because any individual wanted or tried. WRONG: "Desert plants store water so that they can survive." That sentence gives a plant a plan. RIGHT: "In desert conditions, plants that happened to store water survived and reproduced more often than plants that did not, so over many generations that trait became common." Nothing chooses. The conditions simply make some inherited traits more likely to be passed on than others.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'definition', title: 'biome', content: `a large region defined mainly by its climate, especially temperature and precipitation, together with the communities of living things found there.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'definition', title: 'habitat', content: 'the specific place where a particular organism lives.' },
    { loId: 'm7sci.biomes-and-habitats', kind: 'definition', title: 'niche', content: `the role an organism plays where it lives: what it eats, what eats it, when it is active, and how it affects its surroundings.` },
    { loId: 'm7sci.biomes-and-habitats', kind: 'definition', title: 'precipitation', content: 'water that falls from the sky as rain, snow, sleet or hail.' },
    { loId: 'm7sci.biomes-and-habitats', kind: 'definition', title: 'permafrost', content: 'a layer of ground in the tundra that stays frozen all year long.' },
    { loId: 'm7sci.biomes-and-habitats', kind: 'definition', title: 'estuary', content: 'the place where a river meets the ocean, where saltiness changes with the tide.' },
  ],
  methods: [
    {
      title: 'Worked name the biome',
      steps: [
        `Take the two climate axes one at a time, precipitation first and then temperature.`,
        `Precipitation is very low. That already rules out tropical rainforest and temperate forest, because a thick forest needs a lot of water. It leaves desert and tundra, which are the two dry biomes.`,
        `Now use temperature. A desert can be any temperature, so being cold does not rule desert out by itself. Notice that this is the step where most students stop too early.`,
        `Look for the piece of evidence that only one biome can explain. Soil that never thaws is permafrost, and permafrost is a tundra feature. A cold desert can freeze hard in winter, but its ground thaws in summer.`,
        `The absence of trees agrees with both dry biomes, so it does not decide anything on its own. Mosses and lichens growing over the ground fit tundra.`,
        `So the answer is tundra. The deciding evidence is the permanently frozen soil, not the cold and not the dryness, because those two are shared with cold deserts.`,
      ],
      example: { problem: `A science team sends back notes from a field station. Every month of the year is cold, even the warmest one. Very little precipitation falls. A layer of the soil never thaws, not even in summer. No trees grow anywhere, and the ground is covered with mosses and lichens. Which biome is this, and how do you rule out desert, which is also very dry?`, solution: `Tundra. Low precipitation narrows it to the dry biomes, desert and tundra; the soil that never thaws, which is permafrost, is what separates tundra from a cold desert.` },
      relatedLoIds: ['m7sci.biomes-and-habitats'],
    },
    {
      title: 'Worked fix the trait sentence',
      steps: [
        `Check the fact first. Many desert plants really do hold water in thick stems, and that trait really is more common in dry places. Nothing is wrong with the observation.`,
        `Now look at the two words doing the damage: "so that". They say the plant has a purpose. Read the sentence again and it means the plant stored water in order to solve a problem it saw coming.`,
        `A plant has no plan. It cannot notice a drought, decide on a stem shape, and build one. An individual plant also cannot change its inherited traits during its own life.`,
        `Ask instead what happened to the whole POPULATION across many GENERATIONS. Among the plants growing in that dry place, some happened to hold more water in their stems than others. That difference was inherited from their parents; it was not invented on demand.`,
        `In dry conditions, the plants that held more water were more likely to live long enough to reproduce. They passed that trait to their offspring. The plants that held less water were less likely to reproduce, so they passed on fewer copies of their traits.`,
        `Repeat that over many generations and the thick-stemmed plants become the common ones. The biome did not change the plants. It changed which plants left the most offspring.`,
        `WRONG: "Desert plants store water so they can survive." CORRECT: "In desert conditions, plants that stored water survived and reproduced more often, so that trait became common." Any time you catch yourself writing "so that they could" about a trait, rewrite it as "the ones that already had it reproduced more often".`,
      ],
      example: { problem: `A student writes: "Desert plants store water in thick stems so that they can survive when it does not rain." The trait is real and the student has the right idea about which biome it fits. Explain what is wrong with the sentence anyway, and rewrite it correctly.`, solution: `The sentence gives the plant a purpose, and it treats a trait as something an individual developed on demand. Correct version: in desert conditions, plants that happened to store water in thick stems survived and reproduced more often than plants that did not, so over many generations that trait became common in the population.` },
      relatedLoIds: ['m7sci.biomes-and-habitats'],
    },
  ],
  pointers: [
    { content: `Students often say "A tropical rainforest and a temperate forest are the same biome because both have trees." — Biomes are sorted by CLIMATE, not by the first thing you notice. A tropical rainforest is warm all year and wet nearly all year. A temperate forest has warm summers and cold winters, and many of its trees drop their leaves in fall while rainforest trees do not. Different climate means different conditions, so different kinds of living things end up there. Trees are the surface; temperature and precipitation are the definition. The same trap catches people with the word desert: they sort by sand instead of by how little precipitation falls.`, kind: 'common-error' },
    { content: `Students often say "Two kinds of birds can share the exact same niche in one place forever." — Two species can absolutely share a HABITAT. What they cannot do is hold exactly the same NICHE in the same place indefinitely, because they would be competing for every single resource at every moment. Over time one species out-competes the other, or the two end up splitting the work between them. Real forest birds do exactly that: one species feeds on insects out at the tips of the highest branches while another feeds near the trunk lower down. Same address, different jobs, so both can stay.`, kind: 'common-error' },
    { content: `A biome is a large region defined mainly by climate: temperature and precipitation. A continent is not a biome.`, kind: 'tip' },
    { content: `Biome is the region, habitat is the specific place one organism lives, and niche is the job it does there.`, kind: 'tip' },
    { content: `Land biomes by the two axes: tropical rainforest (warm and wet), desert (very dry, any temperature), grassland (drier than forest, wetter than desert), temperate forest (warm summers, cold winters, plenty of precipitation), taiga (long cold winters, conifers), tundra (coldest, permafrost, no trees).`, kind: 'tip' },
    { content: `Desert means dry, not hot. Much of Antarctica is a desert because almost no precipitation falls there.`, kind: 'tip' },
    { content: `Water biomes sort by salt: freshwater lakes, ponds, rivers and wetlands; salty marine oceans, reefs and coasts; estuaries in between.`, kind: 'tip' },
    { content: `Organisms fit their biome because populations changed over generations: the individuals that already had a useful inherited trait reproduced more often. Nothing chose, needed, or tried.`, kind: 'tip' },
    { content: `Desert = dry, not hot. Sort by precipitation first, never by sand or heat. Much of Antarctica counts as a desert because almost no precipitation falls there.`, kind: 'common-error' },
    { content: `Never write "so that they could" about a trait. Swap it: "the ones that already had it survived and reproduced more often, so over many generations it became common." Nothing chose, needed, wanted, or tried.`, kind: 'common-error' },
    { content: `A niche is a JOB, not a place. If your sentence could end with a map location, you described a habitat. "Its niche is the rainforest" is wrong; "its niche includes hunting insects at night" is right.`, kind: 'vocab-note' },
    { content: `Continents and countries are not biomes. Africa holds rainforest, desert, grassland and cold mountaintops at once. Two places on opposite sides of the world share a biome if their climate matches.`, kind: 'gotcha' },
    { content: `Cold + dry + no trees fits BOTH tundra and cold desert. The tiebreaker is permafrost: soil that never thaws, even in summer. A cold desert's ground does thaw. Don't stop at "it's cold."`, kind: 'edge-case' },
    { content: `Two species can share a habitat forever, but not the exact same niche. One out-competes the other, or they split the work — like one bird feeding at branch tips and another near the trunk. Same address, different jobs.`, kind: 'edge-case' },
    { content: `"Both have trees" does not make two places the same biome. Tropical rainforest is warm and wet all year; temperate forest has cold winters and leaves that drop in fall. Sort by climate, not by what's in the photo.`, kind: 'gotcha' },
    { content: `Precipitation means all water from the sky: rain, snow, sleet, hail. A snowy place can still be counted as getting precipitation — and a place with deep ice can still be dry if no new precipitation falls.`, kind: 'vocab-note' },
  ],
};
