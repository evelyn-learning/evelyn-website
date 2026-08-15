/**
 * K-2 Science — What Plants Need to Grow.
 *
 * NGSS K-LS1-1 / 2-LS2-1: identify the resources plants need (light,
 * water, air, room to grow). Foundational life science before
 * photosynthesis is even named. Embodied investigation: what would
 * happen to a plant in a closet vs on a windowsill? Without water?
 *
 * Source: NGSS K-LS1, 2-LS2, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_PLANT_NEEDS: LessonPlan = {
  id: 'evelyn.k2.science.life.plant-needs.v1',
  title: 'What Plants Need to Grow',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.k-ls1-1',
      description: 'Use observations to describe patterns of what plants and animals (including humans) need to survive.',
      standard: 'NGSS.K-LS1-1',
    },
    {
      id: 'ngss.2-ls2-1',
      description: 'Plan and conduct an investigation to determine if plants need sunlight and water to grow.',
      standard: 'NGSS.2-LS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.5-ls1-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect to a plant the student knows — at home, school, or in a park.',
      script: 'Think of a plant you\'ve seen — maybe at home, or in a garden. What do you think it needs to stay alive and grow? Make a guess!',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-needs',
      kind: 'concept',
      goal: 'Plants need four things: light, water, air, and space.',
      keyIdeas: [
        'LIGHT — usually from the sun. Plants use light to make their own food.',
        'WATER — plants drink through their roots.',
        'AIR — plants breathe in a gas from the air called carbon dioxide.',
        'SPACE / SOIL — roots need room to spread out, and soil holds nutrients.',
        'If a plant is missing ONE of these, it will get sick or die.',
      ],
      vocabulary: [
        { term: 'roots', definition: 'plant parts under the soil that drink water and hold the plant in place.' },
        { term: 'leaves', definition: 'the green parts of a plant that catch sunlight.' },
        { term: 'soil', definition: 'the dirt plants grow in — full of tiny food bits.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-windowsill-vs-closet',
      kind: 'worked_example',
      problem: 'Two plants get the same water and air. One sits on a sunny windowsill. The other sits in a dark closet. After two weeks, what do you think happens to each?',
      steps: [
        'Windowsill plant: gets light, water, air. All four needs met. Grows healthy and green.',
        'Closet plant: gets water and air, but NO LIGHT. Plants need light to make food.',
        'Closet plant turns yellow, droops, and may die — even with water.',
      ],
      answer: 'The windowsill plant thrives. The closet plant dies (no light → no food).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Your friend forgot to water their houseplant for a whole month. The plant is brown and droopy. Which of the plant\'s four needs was missing?',
      expectedAnswer: 'water',
      responseFormat: 'free',
      hints: [
        'The plant didn\'t get one of: light, water, air, or space.',
        'Read the problem again — what did the friend forget?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plants-eat-soil',
      kind: 'misconception_check',
      question: 'A friend says "plants get all their food from the soil — the dirt feeds them." Is that fully right?',
      commonErrors: [
        {
          answer: 'Yes, plants eat soil.',
          misconception: 'Believing soil is plant food.',
          correctsTo: 'Soil holds water and tiny nutrients, but plants MAKE their own food using LIGHT (you\'ll learn this is called photosynthesis later). They don\'t eat the dirt itself.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Plants need light, water, air, and space.',
        'Roots drink water; leaves catch sunlight.',
        'Without ALL FOUR, plants get sick.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
