/**
 * K-2 Science — Habitats: Where Living Things Live.
 *
 * NGSS 2-LS4-1: make observations of plants and animals to compare
 * the diversity of life in different habitats. Forest, desert, ocean,
 * pond — each has plants and animals adapted to live there.
 *
 * Source: NGSS 2-LS4, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_HABITATS: LessonPlan = {
  id: 'evelyn.k2.science.life.habitats.v1',
  title: 'Habitats — Where Plants and Animals Live',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.2-ls4-1',
      description: 'Make observations of plants and animals to compare the diversity of life in different habitats.',
      standard: 'NGSS.2-LS4-1',
    },
  ],
  prerequisites: ['ngss.k-ls1-1'],
  followUps: ['ngss.3-ls4-3'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the question of why polar bears don\'t live in the desert.',
      script: 'You\'d never see a polar bear walking through a hot desert. Or a cactus growing on the snowy Arctic ice. Why? Why do certain plants and animals live in certain places?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-habitats',
      kind: 'concept',
      goal: 'A habitat is the kind of place where a living thing lives. Different habitats have different conditions, and different plants/animals are suited to each.',
      keyIdeas: [
        'A HABITAT is the place a plant or animal lives — with the food, water, and shelter it needs.',
        'OCEAN habitat: salt water. Fish, whales, coral, seaweed.',
        'FOREST habitat: lots of trees, rain. Squirrels, deer, mushrooms, ferns.',
        'DESERT habitat: hot, dry. Cacti, lizards, camels.',
        'POND habitat: fresh water. Frogs, dragonflies, lily pads.',
        'POLAR habitat: very cold, ice. Polar bears, penguins (different poles!), seals.',
        'Each living thing is ADAPTED — has body parts and behaviors that work for its habitat.',
      ],
      vocabulary: [
        { term: 'habitat', definition: 'a place where a plant or animal naturally lives.' },
        { term: 'adapted', definition: 'having body parts or behaviors that fit the habitat.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-cactus-vs-fern',
      kind: 'worked_example',
      problem: 'A cactus has thick, waxy skin and stores water inside. A fern has thin, soft leaves and dries out fast. Which lives in a desert, and which lives in a wet forest? Why?',
      steps: [
        'CACTUS — thick waxy skin LOCKS water in; can store water for weeks. Made for dry places. Lives in DESERT.',
        'FERN — thin soft leaves let water out easily; needs constant moisture. Made for wet places. Lives in FOREST.',
        'Each is ADAPTED to its habitat. A fern in the desert would dry up. A cactus in the rainforest would rot.',
      ],
      answer: 'Cactus = desert. Fern = forest. Each is adapted to its habitat.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A camel has a hump full of fat, long eyelashes to block sand, and can go a long time without water. Which habitat is the camel best suited to?',
      expectedAnswer: 'desert',
      responseFormat: 'free',
      hints: [
        'Long eyelashes block what?',
        'Going long without water suggests where?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-animals-anywhere',
      kind: 'misconception_check',
      question: 'A friend says "we should bring polar bears to the zoo in Florida — they\'d be happy because they\'d have plenty of food." Why might that not work?',
      commonErrors: [
        {
          answer: 'Yes — food is all that matters.',
          misconception: 'Underestimating habitat-specific needs (temperature, terrain).',
          correctsTo: 'Polar bears are adapted to COLD — thick fur, fat layer, snowy terrain. In Florida heat they\'d overheat dangerously. Zoos that keep polar bears must build chilled enclosures with ice and pools to mimic the Arctic. Habitat is more than food.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Habitat = where something lives.',
        'Different habitats: ocean, forest, desert, pond, polar, etc.',
        'Living things are ADAPTED — built for their habitat.',
        'A plant or animal moved to the wrong habitat usually can\'t survive.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
