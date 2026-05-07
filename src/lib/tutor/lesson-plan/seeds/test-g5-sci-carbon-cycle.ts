/**
 * TEST PLAN — G5 Science — The Carbon Cycle.
 *
 * QA harness, not production content. Designed to invite:
 *   - show_cycle_diagram (carbon stages: atmosphere → plants → animals
 *     → soil/ocean → atmosphere again).
 *   - show_labeled_image with `query` (live image-search test —
 *     resolves through Unsplash → Pixabay → Pexels). The brain should
 *     reach for at least three image queries across the lesson:
 *     "trees forest sunlight", "coral reef ocean", "factory smokestack".
 *   - tutor_scribble — circle a stage on the cycle diagram.
 *   - new_page / tutor_scroll_whiteboard — multi-page navigation.
 *   - HEAVY humor with a named character ("Carla the Carbon atom").
 *     Test setup: open /tutor/settings before the session and pick
 *     "Very funny" — band cap is medium for 3-5 but the resolver lets
 *     the explicit preference through.
 *
 * Coverage gap this fills: carbon cycle is adjacent to existing water
 * cycle and ecosystems plans; not directly covered as its own plan.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G5_SCI_CARBON_CYCLE: LessonPlan = {
  id: 'evelyn.test.g5.science.carbon-cycle.v1',
  title: '[TEST] G5 Science — The Carbon Cycle',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'science',
  topic: 'ecosystems',
  locale: 'en',
  los: [
    {
      id: 'ngss.5-ls2-1',
      description: 'Develop a model to describe the movement of matter among plants, animals, decomposers, and the environment.',
      standard: 'NGSS.5-LS2-1',
    },
  ],
  prerequisites: ['ngss.3-ls1-1'],
  followUps: ['ngss.ms-ls2-3'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the surprise that the carbon in your body might once have been part of a dinosaur, a tree, or the air a friend just breathed out.',
      script: 'Take a deep breath. The carbon you just breathed in might have been inside a tree last year, a dinosaur a hundred million years ago, or a friend across the room a moment ago. The same carbon atoms keep moving around — through air, plants, animals, soil, and ocean — over and over.',
      teacherNote: 'At humor=heavy, introduce "Carla the Carbon atom" here as the through-line for the lesson — a single carbon atom we follow across all four stages. Use the named character every 2-3 turns as a callback.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-four-pools',
      kind: 'concept',
      goal: 'Carbon lives in four big "pools": the atmosphere (as CO₂), plants (as sugars and wood), animals (as food), and the ocean / soil. It moves between them.',
      keyIdeas: [
        'ATMOSPHERE — carbon as CO₂ gas, mixed in the air.',
        'PLANTS — pull CO₂ from the air during photosynthesis. Carbon becomes leaves, roots, and trunks.',
        'ANIMALS — eat plants (or other animals). Carbon moves into bodies. Animals breathe out CO₂.',
        'OCEAN / SOIL — dead plants and animals decompose; carbon goes into soil and ocean water.',
        'The cycle CONTINUES because plants pull the carbon back out of the air, the soil, and the water.',
      ],
      vocabulary: [
        { term: 'carbon dioxide (CO₂)', definition: 'a gas in the air made of carbon and oxygen.' },
        { term: 'photosynthesis', definition: 'how plants use sunlight and CO₂ to make their food.' },
        { term: 'decompose', definition: 'when dead plants or animals break down into smaller parts.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_cycle_diagram'],
      references: [
        { kind: 'image', content: 'query: "trees forest sunlight" — for the photosynthesis pool.' },
        { kind: 'image', content: 'query: "coral reef ocean" — for the ocean pool.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cycle',
      kind: 'worked_example',
      problem: 'Walk through one full cycle of a single carbon atom — from the air to a plant, into an animal, and back to the air.',
      steps: [
        'Start in the AIR — carbon is part of a CO₂ molecule.',
        'A leaf pulls in the CO₂ during photosynthesis. The carbon becomes part of a sugar molecule inside the plant.',
        'A grasshopper eats the leaf. Carbon moves into the grasshopper.',
        'The grasshopper breathes out — CO₂ leaves its body.',
        'Carbon is back in the AIR. Cycle restarts.',
      ],
      answer: 'Air → plant → animal → air. Cycle repeats.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A leaf falls off a tree onto the forest floor. After many months, the leaf decomposes. Where does the carbon in that leaf MOSTLY go next?',
      expectedAnswer: 'into the soil (and some back to the air as CO₂)',
      responseFormat: 'free',
      hints: [
        'Think about WHERE dead plants end up.',
        'Decomposition breaks the leaf into smaller and smaller pieces. Where do those pieces stay?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'concept-human-impact',
      kind: 'concept',
      goal: 'Burning fossil fuels (coal, oil, gas) takes carbon that was BURIED for millions of years and puts it back in the air FAST. Plants and oceans can\'t pull it out fast enough.',
      keyIdeas: [
        'FOSSIL FUELS = old plants and animals buried millions of years ago, turned into coal, oil, and natural gas.',
        'When we burn them, carbon that was OUT of the cycle for millions of years rejoins the cycle ALL AT ONCE.',
        'Extra CO₂ in the air traps more heat — this is why scientists track it carefully.',
      ],
      vocabulary: [
        { term: 'fossil fuel', definition: 'fuels made from buried plants and animals from long ago.' },
      ],
      suggestedTools: ['show_labeled_image'],
      references: [
        { kind: 'image', content: 'query: "factory smokestack pollution" — for the human-impact discussion.' },
      ],
      teacherNote: 'After the show_labeled_image for the smokestack, the brain should call tutor_scribble({ target: "stage-precipitation" or appropriate cycle stage, shape: "circle" }) on the cycle diagram\'s atmosphere stage to anchor the visual link. Also new_page("Human Impact") to demonstrate multi-page navigation, then tutor_scroll_whiteboard back to the cycle diagram to compare.',
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-trees-only',
      kind: 'misconception_check',
      question: 'A friend says "trees are the ONLY thing that takes CO₂ out of the air." Is that right?',
      commonErrors: [
        {
          answer: 'yes — only trees',
          misconception: 'Underestimating the ocean and other plants as carbon sinks.',
          correctsTo: 'The OCEAN actually pulls in HUGE amounts of CO₂ — about a quarter of what humans release! Other plants matter too: grass, algae, all kinds of plants and tiny ocean creatures take in CO₂. Trees are important, but they share the work.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Carbon CYCLES between the air, plants, animals, and the ocean / soil.',
        'Plants pull CO₂ OUT of the air; animals (and decomposers) put it BACK.',
        'Burning fossil fuels adds carbon to the air FASTER than the cycle can remove it.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If you planted 100 trees, how would that change the carbon cycle in your town?',
      hint: 'More leaves → more photosynthesis → more CO₂ pulled out of the air. But trees take time to grow, and one car can release more CO₂ in a year than a young tree absorbs.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
