/**
 * Grade 5 Science — Energy in Food Chains.
 * NGSS 5-LS2-1 / 5-PS3-1: develop a model to describe the movement
 * of matter and energy among living things.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_ENERGY_FOOD_CHAINS: LessonPlan = {
  id: 'evelyn.g5.science.life.energy-food-chains.v1',
  title: 'Energy Through Food Chains',
  curriculum: 'NGSS', grade: '5', subject: 'science', topic: 'life-science', locale: 'en',
  los: [{ id: 'ngss.5-ls2-1', description: 'Develop a model to describe the movement of matter among plants, animals, decomposers, and the environment.', standard: 'NGSS.5-LS2-1' }, { id: 'ngss.5-ps3-1', description: 'Use models to describe that energy in animals\' food was once energy from the sun.', standard: 'NGSS.5-PS3-1' }],
  prerequisites: ['ngss.5-ls1-1'], followUps: ['ngss.ms-ls2-3'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Make the chain real.', script: 'You eat a chicken sandwich for lunch. The chicken ate corn. The corn grew using sunlight. You\'re eating SUNLIGHT — turned into corn, then chicken, then YOU. Let\'s trace this energy flow.', estimatedMinutes: 2 },
    { id: 'concept-trophic-levels', kind: 'concept', goal: 'Energy flows from sun → plants (producers) → herbivores → carnivores → decomposers. Each level is called a "trophic level."', keyIdeas: [
      'PRODUCERS: plants and algae. They make their own food using sunlight (photosynthesis).',
      'PRIMARY CONSUMERS (herbivores): eat plants. Cows, rabbits, grasshoppers.',
      'SECONDARY CONSUMERS (carnivores): eat herbivores. Foxes, hawks.',
      'TERTIARY CONSUMERS: eat other carnivores. Sharks, eagles.',
      'DECOMPOSERS: break down dead things. Fungi, bacteria, worms. They return nutrients to the soil.',
      'A FOOD CHAIN: linear path (grass → grasshopper → frog → snake → hawk).',
      'A FOOD WEB: many overlapping chains in an ecosystem.',
    ], vocabulary: [{ term: 'producer', definition: 'a living thing that makes its own food.' }, { term: 'consumer', definition: 'a living thing that eats other living things.' }, { term: 'decomposer', definition: 'breaks down dead things and returns nutrients.' }], estimatedMinutes: 5 },
    { id: 'concept-energy-loss', kind: 'concept', goal: 'Only ~10% of energy passes from one level to the next. The rest is used for movement, warmth, or lost as heat.', keyIdeas: [
      'When a rabbit eats grass, only about 10% of the grass\'s energy ends up stored in the rabbit.',
      'The other 90% is used to MOVE, stay WARM, GROW, or is lost as HEAT.',
      'This is why food chains rarely have more than 4-5 levels — not enough energy left for a 6th.',
      'It\'s why apex predators (sharks, lions) are RARE compared to plants — energy thins out at higher levels.',
    ], estimatedMinutes: 3 },
    { id: 'worked-grass-grasshopper-frog', kind: 'worked_example', problem: 'A grass plant captures 1000 units of energy from the sun. Trace the energy through this chain: grass → grasshopper → frog → snake. Roughly how much energy does the snake get?', steps: [
      'Grass: 1000 units (captured from sun).',
      'Grasshopper eats grass: ~10% = 100 units.',
      'Frog eats grasshopper: ~10% = 10 units.',
      'Snake eats frog: ~10% = 1 unit.',
      'The snake gets only ~1/1000 of the original energy — most was lost at each step.',
    ], answer: '~1 unit (10% × 10% × 10% = 0.1%).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'In an ecosystem, you have GRASS, RABBITS, FOXES, and DECOMPOSERS. Draw the food chain order and label each role.', expectedAnswer: 'Grass (producer) → Rabbit (primary consumer/herbivore) → Fox (secondary consumer/carnivore) → Decomposers (when each dies, fungi/bacteria return nutrients to soil for the grass).', responseFormat: 'free', hints: ['Start with the producer.', 'Decomposers act on EVERY level when organisms die.'], estimatedMinutes: 3 },
    { id: 'misconception-equal-energy', kind: 'misconception_check', question: 'A friend says "every animal in the food chain gets the same amount of energy from food." Right?', commonErrors: [{ answer: 'Yes — equal energy.', misconception: 'Believing energy is conserved equally at each trophic level.', correctsTo: 'Most energy is LOST at each level — only ~10% passes up. That\'s why pyramids of energy narrow toward the top: there are MANY plants, FEWER herbivores, and FEW top predators.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Sun → producers → consumers → decomposers.', 'Energy flows ONE way; matter cycles.', '~10% rule: energy at each level.', 'Food webs are realistic — many chains overlap.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
