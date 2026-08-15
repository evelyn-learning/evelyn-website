/**
 * G7 — Energy flow in ecosystems.
 *
 * Producers → consumers → decomposers. Energy pyramid (10% rule).
 * Why apex predators are rare.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_ENERGY_FLOW_ECOSYSTEMS: LessonPlan = {
  id: 'evelyn.g7.sci.life.energy-flow-ecosystems.v1',
  title: 'Energy flow through ecosystems',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'sci',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ls2.b',
      description: 'Develop a model to describe the cycling of matter and flow of energy among living and non-living parts of an ecosystem.',
      standard: 'NGSS.MS-LS2-3',
    },
  ],
  prerequisites: ['ngss.ms-ls1.c'],
  followUps: ['ngss.hs-ls2.b'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show ecosystem energy as a one-way flow from sun to predators.',
      script: 'A wolf eats a deer. The deer ate grass. The grass grew using SUNLIGHT. So wolves ultimately eat sunlight — through several layers. That\'s the energy pyramid.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trophic-levels',
      kind: 'concept',
      goal: 'Trophic levels + 10% rule + decomposers.',
      keyIdeas: [
        'PRODUCERS (1st level): plants, algae, some bacteria. Make their own food via photosynthesis. Capture sun energy → chemical energy.',
        'PRIMARY CONSUMERS (2nd level): herbivores. Eat producers. Cows, deer, grasshoppers, zooplankton.',
        'SECONDARY CONSUMERS (3rd level): carnivores eating herbivores. Frogs eating insects, snakes eating mice.',
        'TERTIARY / APEX CONSUMERS (4th+): top predators. Wolves, eagles, sharks. No predators eat them.',
        'DECOMPOSERS: bacteria, fungi. Break down dead matter at every level. Return nutrients to soil for producers.',
        '10% RULE: roughly 10% of energy at one level moves to the next. The other 90% is lost as HEAT (cellular respiration) or used for movement, growth.',
        'IMPLICATION: pyramid shape. Lots of grass → fewer rabbits → way fewer foxes → very few apex predators. That\'s why lions, eagles, sharks are rare.',
      ],
      vocabulary: [
        { term: 'producer', definition: 'an organism that makes its own food (usually via photosynthesis).' },
        { term: 'consumer', definition: 'an organism that eats other organisms.' },
        { term: 'decomposer', definition: 'an organism that breaks down dead matter.' },
        { term: 'trophic level', definition: 'a position in a food chain, like producer or primary consumer.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-pyramid-math',
      kind: 'worked_example',
      problem: 'Producers in a meadow capture 10,000 units of energy from the sun. How much reaches the secondary consumers (3rd level)?',
      steps: [
        'Producers: 10,000 units.',
        'Primary consumers (10% of producers): 1,000 units.',
        'Secondary consumers (10% of primary): 100 units.',
        'Total reaching tertiary level would be just 10 units.',
        'You can see why apex predators must hunt vast territories — there\'s very little energy left at their level.',
      ],
      answer: '100 units',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why are apex predators (lions, eagles, sharks) usually FEWER in number than the prey at lower levels?',
      expectedAnswer: 'only 10% of energy passes up each level — not enough to support large populations',
      responseFormat: 'free',
      hints: [
        'Think about the 10% rule.',
        'Less energy at higher levels = fewer organisms can survive there.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy-cycles',
      kind: 'misconception_check',
      question: 'Does energy CYCLE through an ecosystem like nutrients do?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating energy as cyclical.',
          correctsTo: 'No — energy FLOWS one-way through an ecosystem and exits as HEAT. The sun continuously supplies new energy from outside. NUTRIENTS (carbon, nitrogen) cycle. ENERGY does not.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Trophic levels: producers → primary → secondary → apex consumers.',
        'Decomposers operate at every level.',
        '~10% of energy passes to the next level — 90% lost as heat or used.',
        'Energy FLOWS (one-way); nutrients CYCLE (return).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does eating LOWER on the food chain (more plants, less meat) feed more people?',
      hint: 'You can feed roughly 10× more people from a given amount of land if they eat plants directly vs feeding it to animals you then eat. Energy efficiency arg for plant-heavy diets.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
