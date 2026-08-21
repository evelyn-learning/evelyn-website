/**
 * Grade 7 Science (Life Science) — Ecosystems: Biomes & Habitats.
 *
 * Concept-led plan (NGSS MS-LS2-1). Three words that students collapse into
 * one get separated here: a BIOME is a large region set by climate, a HABITAT
 * is the specific place one organism lives, and a NICHE is the job that
 * organism does. The biomes are then sorted by the two climate axes --
 * temperature and precipitation -- rather than by a map, because there are no
 * images in this course and every item must be solvable from words alone.
 *
 * ACCURACY WATCH: every statement about traits fitting a biome is written at
 * the POPULATION level, over GENERATIONS. Nothing in this file lets an
 * organism want, choose, try for, or develop a trait because it needed one.
 * No rainfall totals, temperature figures or species counts are invented.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U9_BIOMES_AND_HABITATS: LessonPlan = {
  id: 'evelyn.ms.m7sci.biomes-and-habitats.v1',
  title: 'Biomes & Habitats',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.biomes-and-habitats',
      standard: 'M7SCI-9.4',
      description:
        'Describe the major terrestrial and aquatic biomes by their temperature and precipitation patterns, distinguish a biome from a habitat and a niche, and explain at the population level why the organisms found in a biome tend to have traits suited to its conditions (NGSS MS-LS2-1).',
    },
  ],
  prerequisites: ['m7sci.cycles-of-matter'],
  followUps: ['m7sci.interactions-between-species'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that climate, not distance, decides which living things a place holds.',
      script:
        'Picture two ponds. One sits behind a school in a cold northern town where the water freezes solid every winter. The other sits in a rainforest where it is warm and wet all year. Both are ponds. Both are about the same size. But almost nothing living in one of them could survive in the other. That is strange if you think a pond is just a pond. It stops being strange once you know that the biggest thing deciding what lives in a place is not how big the place is or what country it is in. It is how warm the place gets and how much water falls on it. Today we sort the whole planet using just those two things.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-biomes-habitats-niches',
      kind: 'concept',
      goal: 'Separate biome, habitat and niche; sort the major biomes by temperature and precipitation; state trait-fit at the population level.',
      keyIdeas: [
        'A BIOME IS A HUGE REGION DEFINED BY ITS CLIMATE — mainly by two things, how warm it is and how much precipitation it gets. Precipitation means rain, snow, sleet and hail: water arriving from the sky. Places on opposite sides of the world belong to the same biome when their climate is alike, because similar climate supports similar kinds of living things. So a biome is not a country and not a continent. Africa is not a biome, because Africa contains rainforest, desert, grassland and cold mountaintops all at once.',
        'BIOME, HABITAT AND NICHE ARE THREE DIFFERENT SIZES OF ANSWER — a BIOME is the whole region, like tropical rainforest. A HABITAT is the specific place one organism lives, like the underside of a leaf high in a rainforest tree. A NICHE is not a place at all: it is the JOB an organism does, which means what it eats, what eats it, when it is active, and how it changes the things around it. Address, then room, then job. WRONG: "The frog habitat is the rainforest biome." CORRECT: "The frog lives in the rainforest biome, its habitat is the leaves of the canopy, and its niche includes hunting insects at night."',
        'THE LAND BIOMES, SORTED BY THE TWO CLIMATE AXES — TROPICAL RAINFOREST: warm all year and wet nearly all year, with trees growing in layers and a huge variety of living things. DESERT: very little precipitation, which is the ONLY thing that makes it a desert. GRASSLAND: too dry for a thick forest but wetter than a desert, so grasses dominate and trees are scattered. TEMPERATE FOREST: warm summers and cold winters with plenty of precipitation, full of broad-leaved trees that drop their leaves in fall. TAIGA, also called boreal forest: long cold winters and short cool summers, covered in conifers with needle-shaped leaves. TUNDRA: the coldest and one of the driest, with a layer of soil that stays frozen all year, so no trees grow and mosses and lichens take over.',
        'DESERT MEANS DRY, NOT HOT — this is the mistake almost everyone makes. A desert is a region that receives very little precipitation, whatever its temperature. Some deserts are scorching in the daytime. Much of Antarctica is also a desert, because almost no precipitation falls there; the water already present is locked up as ice. If you sort by heat instead of by water, you will put Antarctica in the wrong place every time.',
        'THE WATER BIOMES SORT BY SALT — FRESHWATER covers lakes, ponds, rivers, streams and wetlands, and holds very little dissolved salt. MARINE covers the oceans, coral reefs and coastal waters, and is salty. Where a river runs into the sea you get an estuary, where the saltiness rises and falls with the tide. In water, the conditions that matter most are how salty it is, how deep it is, how much light reaches down, and the temperature.',
        'WHY THE LIVING THINGS FIT THE PLACE — this is the payoff, and the wording has to be exact. Organisms in a biome tend to have traits suited to its conditions because of what happened to POPULATIONS over many GENERATIONS, not because any individual wanted or tried. WRONG: "Desert plants store water so that they can survive." That sentence gives a plant a plan. RIGHT: "In desert conditions, plants that happened to store water survived and reproduced more often than plants that did not, so over many generations that trait became common." Nothing chooses. The conditions simply make some inherited traits more likely to be passed on than others.',
      ],
      vocabulary: [
        { term: 'biome', definition: 'a large region defined mainly by its climate, especially temperature and precipitation, together with the communities of living things found there.' },
        { term: 'habitat', definition: 'the specific place where a particular organism lives.' },
        { term: 'niche', definition: 'the role an organism plays where it lives: what it eats, what eats it, when it is active, and how it affects its surroundings.' },
        { term: 'precipitation', definition: 'water that falls from the sky as rain, snow, sleet or hail.' },
        { term: 'permafrost', definition: 'a layer of ground in the tundra that stays frozen all year long.' },
        { term: 'estuary', definition: 'the place where a river meets the ocean, where saltiness changes with the tide.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-biome',
      kind: 'worked_example',
      problem:
        'A science team sends back notes from a field station. Every month of the year is cold, even the warmest one. Very little precipitation falls. A layer of the soil never thaws, not even in summer. No trees grow anywhere, and the ground is covered with mosses and lichens. Which biome is this, and how do you rule out desert, which is also very dry?',
      steps: [
        'Take the two climate axes one at a time, precipitation first and then temperature.',
        'Precipitation is very low. That already rules out tropical rainforest and temperate forest, because a thick forest needs a lot of water. It leaves desert and tundra, which are the two dry biomes.',
        'Now use temperature. A desert can be any temperature, so being cold does not rule desert out by itself. Notice that this is the step where most students stop too early.',
        'Look for the piece of evidence that only one biome can explain. Soil that never thaws is permafrost, and permafrost is a tundra feature. A cold desert can freeze hard in winter, but its ground thaws in summer.',
        'The absence of trees agrees with both dry biomes, so it does not decide anything on its own. Mosses and lichens growing over the ground fit tundra.',
        'So the answer is tundra. The deciding evidence is the permanently frozen soil, not the cold and not the dryness, because those two are shared with cold deserts.',
      ],
      answer:
        'Tundra. Low precipitation narrows it to the dry biomes, desert and tundra; the soil that never thaws, which is permafrost, is what separates tundra from a cold desert.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-the-trait-sentence',
      kind: 'worked_example',
      problem:
        'A student writes: "Desert plants store water in thick stems so that they can survive when it does not rain." The trait is real and the student has the right idea about which biome it fits. Explain what is wrong with the sentence anyway, and rewrite it correctly.',
      steps: [
        'Check the fact first. Many desert plants really do hold water in thick stems, and that trait really is more common in dry places. Nothing is wrong with the observation.',
        'Now look at the two words doing the damage: "so that". They say the plant has a purpose. Read the sentence again and it means the plant stored water in order to solve a problem it saw coming.',
        'A plant has no plan. It cannot notice a drought, decide on a stem shape, and build one. An individual plant also cannot change its inherited traits during its own life.',
        'Ask instead what happened to the whole POPULATION across many GENERATIONS. Among the plants growing in that dry place, some happened to hold more water in their stems than others. That difference was inherited from their parents; it was not invented on demand.',
        'In dry conditions, the plants that held more water were more likely to live long enough to reproduce. They passed that trait to their offspring. The plants that held less water were less likely to reproduce, so they passed on fewer copies of their traits.',
        'Repeat that over many generations and the thick-stemmed plants become the common ones. The biome did not change the plants. It changed which plants left the most offspring.',
        'WRONG: "Desert plants store water so they can survive." CORRECT: "In desert conditions, plants that stored water survived and reproduced more often, so that trait became common." Any time you catch yourself writing "so that they could" about a trait, rewrite it as "the ones that already had it reproduced more often".',
      ],
      answer:
        'The sentence gives the plant a purpose, and it treats a trait as something an individual developed on demand. Correct version: in desert conditions, plants that happened to store water in thick stems survived and reproduced more often than plants that did not, so over many generations that trait became common in the population.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-biome-habitat-niche',
      kind: 'try_yourself',
      problem:
        'A small green tree frog lives in a tropical rainforest. It spends the day resting on the undersides of leaves near the top of a tall tree, and at night it hunts insects on those same leaves. Which statement uses the words biome, habitat and niche correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The rainforest is its biome, the leaves near the top of the tree are its habitat, and hunting insects at night is part of its niche.', correct: true },
        { id: 'b', text: 'The rainforest is its habitat, the leaves near the top of the tree are its biome, and hunting insects at night is part of its niche.' },
        { id: 'c', text: 'The rainforest is its niche, the leaves near the top of the tree are its biome, and hunting insects at night is its habitat.' },
        { id: 'd', text: 'The rainforest is its biome, hunting insects at night is its habitat, and the leaves near the top of the tree are its niche.' },
      ],
      expectedAnswer: 'The rainforest is its biome, the leaves near the top of the tree are its habitat, and hunting insects at night is part of its niche.',
      hints: [
        'Sort the three pieces of information by size and by type. One is a whole region, one is a specific spot, and one is not a place at all.',
        'A niche is a job, so the only phrase that can be a niche is the one describing what the frog DOES.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-desert-definition',
      kind: 'try_yourself',
      problem: 'Which statement about deserts is accurate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A desert is defined by very high temperature, so every desert is hot.' },
        { id: 'b', text: 'A desert is defined by very low precipitation, so a desert can be hot or cold.', correct: true },
        { id: 'c', text: 'A desert is defined by sandy ground, so a dry place without sand is not a desert.' },
        { id: 'd', text: 'A desert is defined by having no living things in it at all.' },
      ],
      expectedAnswer: 'A desert is defined by very low precipitation, so a desert can be hot or cold.',
      hints: [
        'Only one of the two climate axes gives a desert its name. Which one is it, temperature or precipitation?',
        'Almost no precipitation falls on Antarctica. Does your chosen statement still work there?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-population-level-trait',
      kind: 'try_yourself',
      problem:
        'Many cactus plants living in deserts have thick stems that hold water. Which sentence explains that pattern correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each cactus plant grew a thicker stem during its life because it needed to store more water.' },
        { id: 'b', text: 'Cactus plants decided to store water in their stems so that they could survive the dry season.' },
        { id: 'c', text: 'In dry conditions, cactus plants with thicker stems survived and reproduced more often, so over many generations thick stems became common.', correct: true },
        { id: 'd', text: 'The desert changed the cactus plants so that they would fit their surroundings better.' },
      ],
      expectedAnswer: 'In dry conditions, cactus plants with thicker stems survived and reproduced more often, so over many generations thick stems became common.',
      hints: [
        'Three of these sentences describe something happening to one plant, or something a plant wanted. Only one describes a whole population changing across generations.',
        'A trait is inherited from a parent. An individual cannot invent a new inherited trait because it needs one, and a place cannot reach in and redesign a living thing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forests-and-niches',
      kind: 'misconception_check',
      question:
        'A student writes: "A tropical rainforest and a temperate forest are really the same biome, because both are full of trees. And that is fine, because two kinds of birds can just share the exact same niche in a forest forever." What went wrong in each sentence?',
      commonErrors: [
        {
          answer: 'A tropical rainforest and a temperate forest are the same biome because both have trees.',
          misconception:
            'Sorting biomes by what you can see in a photograph instead of by climate, so any two tree-covered places look identical.',
          correctsTo:
            'Biomes are sorted by CLIMATE, not by the first thing you notice. A tropical rainforest is warm all year and wet nearly all year. A temperate forest has warm summers and cold winters, and many of its trees drop their leaves in fall while rainforest trees do not. Different climate means different conditions, so different kinds of living things end up there. Trees are the surface; temperature and precipitation are the definition. The same trap catches people with the word desert: they sort by sand instead of by how little precipitation falls.',
        },
        {
          answer: 'Two kinds of birds can share the exact same niche in one place forever.',
          misconception:
            'Confusing habitat with niche, so sharing a place sounds the same as doing an identical job.',
          correctsTo:
            'Two species can absolutely share a HABITAT. What they cannot do is hold exactly the same NICHE in the same place indefinitely, because they would be competing for every single resource at every moment. Over time one species out-competes the other, or the two end up splitting the work between them. Real forest birds do exactly that: one species feeds on insects out at the tips of the highest branches while another feeds near the trunk lower down. Same address, different jobs, so both can stay.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A biome is a large region defined mainly by climate: temperature and precipitation. A continent is not a biome.',
        'Biome is the region, habitat is the specific place one organism lives, and niche is the job it does there.',
        'Land biomes by the two axes: tropical rainforest (warm and wet), desert (very dry, any temperature), grassland (drier than forest, wetter than desert), temperate forest (warm summers, cold winters, plenty of precipitation), taiga (long cold winters, conifers), tundra (coldest, permafrost, no trees).',
        'Desert means dry, not hot. Much of Antarctica is a desert because almost no precipitation falls there.',
        'Water biomes sort by salt: freshwater lakes, ponds, rivers and wetlands; salty marine oceans, reefs and coasts; estuaries in between.',
        'Organisms fit their biome because populations changed over generations: the individuals that already had a useful inherited trait reproduced more often. Nothing chose, needed, or tried.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Biomes & Habitats' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
