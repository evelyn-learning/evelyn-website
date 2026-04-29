/**
 * Grade 4 Science — Plant and Animal Structures.
 * NGSS 4-LS1-1: construct an argument that plants and animals have
 * internal and external structures that function to support survival,
 * growth, behavior, and reproduction.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_PLANT_ANIMAL_STRUCTURES: LessonPlan = {
  id: 'evelyn.g4.science.life.plant-animal-structures.v1',
  title: 'How Body Structures Help Living Things Survive',
  curriculum: 'NGSS', grade: '4', subject: 'science', topic: 'life-science', locale: 'en',
  los: [{ id: 'ngss.4-ls1-1', description: 'Construct an argument that plants and animals have internal and external structures that function to support survival, growth, behavior, and reproduction.', standard: 'NGSS.4-LS1-1' }],
  prerequisites: ['ngss.k-ls1-1'], followUps: ['ngss.ms-ls1-3'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in a familiar adaptation.', script: 'Look at a duck\'s feet — webbed, like little paddles. Now look at a chicken\'s feet — split toes, no web. Same kind of animal (a bird), but very different feet. Why? Because the feet are built for the JOB each bird needs to do.', estimatedMinutes: 2 },
    { id: 'concept-structure-function', kind: 'concept', goal: 'Every body part is a STRUCTURE that performs a FUNCTION. Form fits function.', keyIdeas: [
      'EXTERNAL structures: visible body parts — wings, fur, claws, leaves, roots, thorns.',
      'INTERNAL structures: parts inside — bones, heart, lungs, stems carrying water in plants.',
      'Each structure has a FUNCTION (job) that helps the organism survive.',
      'Examples:',
      '  · Sharp teeth (cat) → tear meat. Flat teeth (cow) → grind plants.',
      '  · Long roots (cactus) → reach deep water. Big leaves (banana) → catch lots of sunlight.',
      '  · Hollow bones (bird) → light enough to fly. Solid bones (elephant) → support heavy body.',
      'Plants and animals BOTH have structures with functions.',
    ], vocabulary: [{ term: 'structure', definition: 'a body part of a plant or animal.' }, { term: 'function', definition: 'the job that body part does.' }], estimatedMinutes: 4 },
    { id: 'worked-bird-beaks', kind: 'worked_example', problem: 'Two birds — a hawk and a hummingbird — have very different beaks. What\'s each one for?', steps: [
      'HAWK beak: SHORT, SHARP, hooked. Function: tearing meat from prey.',
      'HUMMINGBIRD beak: LONG, THIN, straight. Function: reaching nectar deep inside flowers.',
      'Same body part (beak), shaped differently for the food each bird eats.',
      'Form fits function — the structure is BUILT for the job.',
    ], answer: 'Hawk beak: tearing meat. Hummingbird beak: reaching nectar.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A cactus has thick, fleshy stems and tiny needle-like leaves (instead of broad flat ones). What FUNCTION do these structures serve in the desert?', expectedAnswer: 'The thick stems STORE WATER for dry times. Tiny needle leaves LOSE LESS WATER than broad flat ones (less surface area). Together, they help the cactus survive long droughts.', responseFormat: 'free', hints: ['Deserts are dry — what does the plant need to do with water?', 'Big leaves lose water fast (think laundry on a clothesline).'], estimatedMinutes: 3 },
    { id: 'misconception-structures-decorative', kind: 'misconception_check', question: 'A friend says "some body parts don\'t really do anything — they\'re just for looks." Is that right?', commonErrors: [{ answer: 'Yes — some are decorative.', misconception: 'Believing parts can exist without function.', correctsTo: 'Almost every body part has a function — even ones we don\'t notice. Eyebrows divert sweat from eyes. Pinkie toes help with balance. Ear shapes funnel sound. Some structures are LEFTOVER from ancestors (like the appendix), but most parts are doing some job.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Every structure has a function.', 'Form fits function — the shape matches the job.', 'Plants and animals both have specialized structures.', 'Differences in structure reflect differences in lifestyle (diet, habitat).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
