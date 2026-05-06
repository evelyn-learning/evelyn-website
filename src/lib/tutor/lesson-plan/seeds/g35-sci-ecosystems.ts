/**
 * Grades 3-5 Science — Ecosystems.
 *
 * Anchor plan covering producers, consumers, decomposers, food chains
 * and webs, and how disruption ripples through an ecosystem.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SCI_ECOSYSTEMS: LessonPlan = {
  id: 'evelyn.g35.science.ecosystems.v1',
  title: 'Grades 3-5 Science — Ecosystems',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'science',
  topic: 'ecosystems',
  locale: 'en',
  los: [
    {
      id: 'g35.science.ecosystems',
      description: 'Describe how producers, consumers, and decomposers transfer matter and energy through ecosystems, and predict how disruptions ripple through.',
      standard: 'NGSS-5-LS2-1 / 5-PS3-1',
    },
  ],
  prerequisites: ['g35.science.life-cycles'],
  followUps: ['g68.science.ecosystems-biomes'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Every living thing is connected to every other living thing through what eats what.',
      script: 'In a forest, a deer eats grass. A wolf eats the deer. When the wolf dies, mushrooms break it down and return nutrients to the soil — where new grass grows. Pull on any thread and the whole web shifts. Today we map these connections and see what happens when one species is removed.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ecosystems',
      kind: 'concept',
      goal: 'Producers, consumers, decomposers, food chains, food webs, energy flow, ecosystem balance.',
      keyIdeas: [
        'An ECOSYSTEM is all the living things (plants, animals, fungi, microbes) AND the non-living parts (water, soil, sunlight, air) in an area, and how they interact.',
        'PRODUCERS make their own food using sunlight (plants and algae do this through photosynthesis). They are the start of every food chain.',
        'CONSUMERS eat other living things. HERBIVORES eat plants (rabbit, deer). CARNIVORES eat animals (wolf, hawk). OMNIVORES eat both (humans, bears).',
        'DECOMPOSERS break down dead plants and animals (mushrooms, bacteria, worms). They return nutrients to the soil so new producers can grow.',
        'A FOOD CHAIN shows one path: grass → grasshopper → frog → snake → hawk. Energy flows up.',
        'A FOOD WEB shows all the connections in an ecosystem — usually many overlapping food chains. Most ecosystems are webs, not single chains.',
        'ENERGY DECREASES at each level of a food chain (a lot of energy is used up by each animal moving and breathing). That\'s why there are fewer top predators than producers.',
        'When ONE species is removed, the effects ripple. Remove wolves: deer overpopulate, eat too much grass, plant communities collapse. The ecosystem is balanced through these feedback loops.',
      ],
      vocabulary: [
        { term: 'producer', definition: 'an organism (usually a plant or alga) that makes its own food from sunlight via photosynthesis.' },
        { term: 'consumer', definition: 'an organism that gets energy by eating other living things — herbivore, carnivore, or omnivore.' },
        { term: 'decomposer', definition: 'an organism (mushroom, bacterium, worm) that breaks down dead matter and returns nutrients to the soil.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-foodchain',
      kind: 'worked_example',
      problem: 'Build a food chain for a grassland with these organisms: wheat, mouse, snake, hawk. Then label each organism\'s role.',
      steps: [
        'Start with the producer — the one that makes its own food: WHEAT (uses sunlight).',
        'What eats wheat? MOUSE (a herbivore).',
        'What eats mice? SNAKE (a carnivore).',
        'What eats snakes? HAWK (a top predator, also a carnivore).',
        'Food chain: wheat → mouse → snake → hawk.',
        'Roles: wheat = producer; mouse = herbivore (primary consumer); snake = carnivore (secondary consumer); hawk = carnivore / top predator.',
      ],
      answer: 'wheat → mouse → snake → hawk; producer → herbivore → carnivore → top predator',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a pond ecosystem, all the algae die because of pollution. What will happen to the small fish that eat the algae, and then to the bigger fish that eat the small fish?',
      expectedAnswer: 'Without algae, the small fish lose their food source — they will starve and their numbers will drop. With fewer small fish, the bigger fish lose their food too — they will also decline. The whole food chain collapses from the bottom up because the producers were removed.',
      responseFormat: 'free',
      hints: [
        'Algae is the producer — what depends on it directly?',
        'Once that level is hit, what happens to everything above it?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-decomposers',
      kind: 'misconception_check',
      question: 'A student says decomposers are not important because they don\'t eat live animals. Why are they actually essential?',
      commonErrors: [
        {
          answer: 'Decomposers don\'t matter because they only eat dead things',
          misconception: 'Treating decomposers as a side detail rather than the recycling system that keeps ecosystems running.',
          correctsTo: 'Decomposers are the RECYCLING SYSTEM of the ecosystem. When plants and animals die, the nutrients in their bodies (nitrogen, phosphorus, carbon) are locked up. Decomposers break them down and return those nutrients to the soil — where producers (plants) can use them again to grow. Without decomposers, dead plants and animals would pile up, nutrients would be locked away forever, and producers would run out of what they need. The ecosystem would slowly starve. Decomposers close the loop.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Producers make food from sunlight; consumers eat; decomposers recycle.',
        'Food chain = one path; food web = all the connections.',
        'Energy decreases up the chain — fewer top predators.',
        'Removing one species ripples through the whole ecosystem.',
        'Decomposers close the nutrient loop.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
