/**
 * High School (9-10) Earth Science.
 *
 * Plate tectonics, rock cycle, climate vs weather, Earth systems.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_EARTH_SCIENCE: LessonPlan = {
  id: 'evelyn.science.9-10.earth-science.v1',
  title: 'HS earth science — tectonics, climate, Earth systems',
  curriculum: 'NGSS',
  grade: '9',
  subject: 'science',
  topic: 'earth-science-hs',
  locale: 'en',
  los: [
    {
      id: 'hsearth.systems',
      description: 'Explain plate tectonics as the engine of geologic change and distinguish weather from climate.',
      standard: 'HS-ESS2',
    },
  ],
  prerequisites: ['g6-8.earth-space'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Earth as a dynamic, restless system.',
      script: 'The continents you see on a map were once one supercontinent. Mountains rise, oceans open, climates flip. The Earth is constantly remaking itself — slowly enough that one human life sees only a snapshot. Earth science is about reading that ongoing story from the rocks.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-earth',
      kind: 'concept',
      goal: 'Plate tectonics, rock cycle, weather vs climate, four spheres.',
      keyIdeas: [
        'PLATE TECTONICS: Earth\'s crust is broken into plates that move on the mantle. ~2-10 cm per year.',
        'BOUNDARIES: divergent (plates pull apart, mid-ocean ridges, rift valleys). Convergent (collide — mountains, subduction, volcanoes). Transform (slide past, e.g., San Andreas).',
        'ROCK CYCLE: igneous (cooled magma) → sedimentary (compressed sediment) → metamorphic (heat + pressure transformed) → back to magma. Any rock can become any other rock.',
        'EARTH SYSTEMS: geosphere (rock), hydrosphere (water), atmosphere (air), biosphere (life). They interact.',
        'WEATHER = local, short-term (today\'s rain). CLIMATE = average over decades. "Climate is what you expect; weather is what you get."',
        'CLIMATE CHANGE: greenhouse gases (CO₂, CH₄) trap infrared radiation. More gases → warmer surface → cascading effects on ice, sea level, weather patterns.',
      ],
      vocabulary: [
        { term: 'plate tectonics', definition: 'theory that Earth\'s crust is divided into moving plates.' },
        { term: 'rock cycle', definition: 'the continuous process by which rocks change between igneous, sedimentary, and metamorphic forms.' },
        { term: 'climate', definition: 'long-term average weather over decades.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-andes',
      kind: 'worked_example',
      problem: 'Why are the Andes Mountains on the western edge of South America?',
      steps: [
        'The Nazca Plate (oceanic) is converging with the South American Plate (continental).',
        'Oceanic crust is denser → it subducts beneath the continental crust.',
        'As it subducts, water from the slab triggers melting in the mantle → magma rises → volcanoes form.',
        'The compression also crumples the continental crust upward → mountain building.',
        'Result: a long volcanic mountain range parallel to the subduction zone — the Andes.',
      ],
      answer: 'Subduction of the Nazca plate beneath South America builds the Andes.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A particularly cold winter doesn\'t prove climate change is wrong. Why not?',
      expectedAnswer: 'cold winters are weather; climate is the long-term average — one season doesn\'t define a trend',
      responseFormat: 'free',
      hints: [
        'The unit of climate is decades, not days.',
        'Compare to: a gambler losing one hand doesn\'t change their long-term win rate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fixed-continents',
      kind: 'misconception_check',
      question: 'A student says: "Continents have always been where they are." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because they look fixed',
          misconception: 'Treating geological time as human time.',
          correctsTo: 'On HUMAN time scales (decades, centuries) continents barely move. On GEOLOGICAL time (millions of years) they migrate thousands of kilometers. 250 million years ago all the continents were joined as Pangaea. Africa and South America fit together because they once were together. Movement at fingernail-growth speed adds up over hundreds of millions of years.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Plates move; their boundaries cause earthquakes, volcanoes, and mountains.',
        'Rocks cycle through three forms.',
        'Weather is local + short. Climate is average + long.',
        'Climate change = greenhouse gases trapping more outgoing infrared.',
        'Earth\'s four spheres interact constantly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
