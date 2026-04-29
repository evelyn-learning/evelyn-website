/**
 * K-2 Science — Earth Materials: Rocks, Soil, Water.
 *
 * NGSS 2-ESS2-3: obtain information to identify where water is found
 * on Earth and that it can be solid or liquid. Plus rocks and soil
 * as the other major Earth materials kids encounter every day.
 *
 * Source: NGSS 2-ESS2, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_EARTH_MATERIALS: LessonPlan = {
  id: 'evelyn.k2.science.earth.earth-materials.v1',
  title: 'Rocks, Soil, and Water',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'earth-systems',
  locale: 'en',
  los: [
    {
      id: 'ngss.2-ess2-3',
      description: 'Obtain information to identify where water is found on Earth and that it can be solid or liquid.',
      standard: 'NGSS.2-ESS2-3',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.4-ess2-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student noticing what Earth\'s ground and surface are made of.',
      script: 'Look outside. What do you see covering the ground? Maybe rocks, dirt, grass, water… Earth\'s surface is made of just a few main things. Let\'s figure out what they are.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-materials',
      kind: 'concept',
      goal: 'Earth\'s surface is mostly made of rocks, soil, and water.',
      keyIdeas: [
        'ROCKS — hard, solid pieces of Earth. Big rocks (boulders), small rocks (pebbles), tiny rocks (sand).',
        'SOIL — a mix of broken-down rocks, decayed plants/animals, water, and air. Plants grow in soil.',
        'WATER — covers most of Earth\'s surface (oceans, lakes, rivers). Can be SOLID (ice, snow) or LIQUID.',
        'Most of Earth\'s water is in OCEANS — but ocean water is salty. Fresh water is rarer.',
        'Ice exists at the cold ends of Earth (poles) and on tall mountains.',
      ],
      vocabulary: [
        { term: 'soil', definition: 'the loose top layer of Earth where plants grow.' },
        { term: 'fresh water', definition: 'water without much salt — what we drink.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-water-three-states',
      kind: 'worked_example',
      problem: 'Water on Earth comes in different forms depending on where you look. Name a place you\'d find LIQUID water and a place you\'d find SOLID water.',
      steps: [
        'LIQUID water: ocean, lake, river, rain, your drinking glass, a puddle.',
        'SOLID water: ICE in your freezer, snow on a mountain, glaciers in cold regions, frozen pond in winter.',
        'Both are still WATER — just at different temperatures. Below freezing → solid. Above → liquid.',
      ],
      answer: 'Liquid water: oceans, rivers, rain. Solid water: ice, snow, glaciers.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You dig in your backyard. You find chunks of rock, brown crumbly stuff with bits of leaves in it, and the dirt feels a little wet. Name the three Earth materials you found.',
      expectedAnswer: 'Rocks, soil (the brown crumbly stuff with leaves), and water (the wet bit).',
      responseFormat: 'free',
      hints: [
        'Three materials we just learned about.',
        'Rocks = chunks. Soil = brown crumbly. The wet feeling = water.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-soil-is-just-dirt',
      kind: 'misconception_check',
      question: 'A friend says "soil is just dirt — there\'s nothing alive in it." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — soil is dead.',
          misconception: 'Believing soil is just lifeless dirt.',
          correctsTo: 'Soil is FULL of life — earthworms, ants, tiny fungi, and BILLIONS of bacteria. It\'s also made up of decaying old leaves and bits of dead bugs. Healthy soil is alive and helps plants grow. "Just dirt" misses how rich and complex soil really is.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth\'s surface is made of rocks, soil, and water.',
        'Most water is in oceans — but salty.',
        'Water can be solid (ice/snow) or liquid.',
        'Soil is alive — full of tiny creatures and decayed things.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
