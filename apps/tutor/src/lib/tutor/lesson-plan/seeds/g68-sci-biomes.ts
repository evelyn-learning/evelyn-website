/**
 * Grades 6-8 Science — Biomes and Ecosystems.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SCI_BIOMES: LessonPlan = {
  id: 'evelyn.g68.science.biomes.v1',
  title: 'Ecology — Biomes and Their Climate Patterns',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'science',
  topic: 'ecology',
  locale: 'en',
  los: [
    {
      id: 'g68.sci.ecology.biomes',
      description: 'Identify the major terrestrial biomes by their climate (temperature, precipitation) and characteristic organisms.',
      standard: 'NGSS-MS-LS2-1',
    },
  ],
  prerequisites: ['g68.sci.ecology.food-webs'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Climate determines biome — and biome determines what lives there.',
      script: 'Why are there cacti in the desert and not in the rainforest? Why polar bears in the Arctic and not the Sahara? Climate. The temperature and precipitation of a region create predictable BIOMES with characteristic plants and animals. Today: the world\'s major biomes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-biomes',
      kind: 'concept',
      goal: 'Major biomes by climate, plants/animals, geographic location.',
      keyIdeas: [
        'BIOME = a large region with similar climate, plants, and animals. Biomes are SHAPED BY CLIMATE — temperature + precipitation.',
        'TROPICAL RAINFOREST: hot (~25-27°C year-round) + very wet (~2000+ mm/year). Equatorial. Very high biodiversity. Examples: Amazon, Congo, SE Asia rainforests. Towering trees, vines, monkeys, jaguars.',
        'DESERT: hot or cold, very DRY (<250 mm/year). Sahara, Gobi, Atacama. Cacti, succulents, camels, lizards. Adaptations: water storage, nocturnal behavior.',
        'GRASSLAND: moderate temperature, moderate precipitation. Two types: TROPICAL (savannas — Africa) and TEMPERATE (prairies, steppes — North America, Eurasia). Grasses, scattered trees, large grazing herbivores, predators.',
        'TEMPERATE DECIDUOUS FOREST: warm summers, cold winters, moderate precipitation. Eastern US, Europe, East Asia. Trees lose leaves in winter. Oak, maple, deer, foxes, bears.',
        'TAIGA / BOREAL FOREST: cold, moderate precipitation. Russia, Canada, Scandinavia. Coniferous (pine, spruce, fir). Wolves, moose, lynx.',
        'TUNDRA: very cold, low precipitation. Arctic, alpine zones. No trees. Permafrost. Mosses, lichens. Caribou, polar bears, arctic foxes.',
        'AQUATIC BIOMES: freshwater (lakes, rivers) and marine (oceans, coral reefs, estuaries). Cover most of Earth.',
        'WHY climate creates biomes: temperature determines what plants can survive (frost, heat). Rainfall determines whether plants are trees, grasses, or scrub. Plants create habitat that supports specific animals.',
        'CLIMATE CHANGE shifts biomes — warming pushes some biomes northward (or to higher altitudes), with major consequences for species that can\'t move fast enough.',
      ],
      vocabulary: [
        { term: 'biome', definition: 'a major regional ecosystem characterised by climate and dominant vegetation.' },
        { term: 'biodiversity', definition: 'the variety of life in an area; tropical rainforests have the highest biodiversity per area.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Imagine a biome with very cold winters, short summers, and almost no trees. The ground stays frozen year-round below the surface. What biome is this?',
      steps: [
        'Cold + short summers + no trees + permafrost.',
        'No trees rules out forests.',
        'Permafrost is characteristic of TUNDRA.',
        'Cold + dry + treeless = TUNDRA. Found in the Arctic and on high mountains.',
      ],
      answer: 'Tundra',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You see a biome with hot temperatures year-round, abundant rain, and trees taller than 30 metres with vines and many bird species. What biome is this?',
      expectedAnswer: 'Tropical rainforest. Hot + wet + tall trees + high biodiversity = tropical rainforest. Found near the equator (Amazon, Congo, SE Asia).',
      responseFormat: 'free',
      hints: [
        'Hot + very wet + lots of biodiversity points to one biome.',
        'Where on Earth would this be?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-desert-hot',
      kind: 'misconception_check',
      question: 'A student thinks all deserts are hot. What\'s the missing piece?',
      commonErrors: [
        {
          answer: 'Deserts are hot',
          misconception: 'Defining desert by temperature instead of precipitation.',
          correctsTo: 'A DESERT is defined by LOW PRECIPITATION (less than 250 mm/year), not high temperature. Antarctica is technically the largest desert on Earth — extremely cold, but very dry. The Gobi desert in Mongolia is cold most of the year. The Atacama in Chile is one of the driest places on Earth, with cool temperatures. Hot deserts (Sahara, Sonoran) are common but not universal. Defining feature: lack of water.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Biome = climate-shaped region. Defined by temperature + precipitation.',
        'Major biomes: tropical rainforest, desert, grassland, deciduous forest, taiga, tundra.',
        'Desert = LOW PRECIPITATION (not necessarily hot).',
        'Climate change is shifting biomes northward / upward.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
