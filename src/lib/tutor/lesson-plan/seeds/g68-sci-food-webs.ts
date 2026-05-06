/**
 * Grades 6-8 Science — Food Webs and Energy Flow.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SCI_FOOD_WEBS: LessonPlan = {
  id: 'evelyn.g68.science.food-webs.v1',
  title: 'Ecology — Food Webs and Energy Pyramids',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'science',
  topic: 'ecology',
  locale: 'en',
  los: [
    {
      id: 'g68.sci.ecology.food-webs',
      description: 'Trace energy flow through producers, consumers, and decomposers in an ecosystem; interpret energy pyramids.',
      standard: 'NGSS-MS-LS2-3',
    },
  ],
  prerequisites: ['g3.sci.life-cycles'],
  followUps: ['g68.sci.ecology.biomes'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'In every ecosystem, energy flows in ONE direction — from sun, through producers, up the food chain.',
      script: 'A grasshopper eats grass. A frog eats the grasshopper. A snake eats the frog. A hawk eats the snake. Each step, energy moves up — but most of it is LOST as heat. By the top, only a tiny fraction of the original solar energy remains. Today: tracking energy through an ecosystem.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-food-webs',
      kind: 'concept',
      goal: 'Trophic levels, energy transfer, energy pyramid, food web vs food chain.',
      keyIdeas: [
        'TROPHIC LEVELS = positions in a food chain.',
        '  Level 1: PRODUCERS (plants, algae) — make food from sunlight via photosynthesis.',
        '  Level 2: PRIMARY CONSUMERS (herbivores) — eat producers.',
        '  Level 3: SECONDARY CONSUMERS — eat herbivores.',
        '  Level 4+: TERTIARY, QUATERNARY consumers (top predators).',
        '  DECOMPOSERS (bacteria, fungi, worms) break down dead matter at every level, returning nutrients to soil.',
        'FOOD CHAIN: a single path of feeding relationships (grass → grasshopper → frog → snake → hawk).',
        'FOOD WEB: many interconnected food chains. Most ecosystems are webs because animals eat multiple things.',
        '10% RULE: only about 10% of energy at one trophic level is passed to the next level. The rest is:',
        '  Used for life processes (movement, breathing).',
        '  Lost as heat.',
        '  Stored as parts not eaten (bones, fur).',
        'ENERGY PYRAMID: a diagram showing energy at each trophic level. Wide at base (lots of producers), narrow at top (few top predators). Each level is roughly 1/10 the energy of the level below.',
        'CONSEQUENCE: ecosystems support MANY producers, fewer herbivores, FEWER carnivores, FEWEST top predators. A forest has thousands of plants per square km but maybe one apex predator.',
        'KEY PRINCIPLE: when one species is removed, energy flow is disrupted. Remove producers (deforestation): everyone above starves. Remove top predators: prey overpopulate, deplete producers, ecosystem collapses (cascade effects).',
      ],
      vocabulary: [
        { term: 'trophic level', definition: 'a position in a food chain — producer, primary consumer, secondary consumer, etc.' },
        { term: '10% rule', definition: 'about 10% of energy at one trophic level is passed to the next; the rest is lost.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A meadow has 10,000 J of solar energy stored in grass (producers). Roughly how much energy reaches a hawk that\'s 4 trophic levels above the grass?',
      steps: [
        'Apply the 10% rule at each step.',
        'Producer (grass): 10,000 J.',
        'Primary consumer (mouse): 10% × 10,000 = 1,000 J.',
        'Secondary consumer (snake): 10% × 1,000 = 100 J.',
        'Tertiary consumer (hawk): 10% × 100 = 10 J.',
        'The hawk gets only 10 J — 0.1% of the original solar energy.',
        'This is why ecosystems support so few top predators.',
      ],
      answer: '≈ 10 J (0.1% of original)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a forest, why are there usually so few wolves compared to deer?',
      expectedAnswer: 'Energy flow. Wolves are at a higher trophic level than deer; they only get ~10% of the energy that deer have access to. To support one wolf, you need many deer. Each level loses energy → fewer organisms can be supported at higher levels. The pyramid narrows toward the top.',
      responseFormat: 'free',
      hints: [
        'How does energy transfer between trophic levels?',
        'How does that affect how many organisms each level can support?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-decomposer-trivial',
      kind: 'misconception_check',
      question: 'A student says decomposers don\'t matter much because they\'re "just cleanup." Why is this misleading?',
      commonErrors: [
        {
          answer: 'Decomposers don\'t matter much',
          misconception: 'Treating decomposers as a side detail rather than a core part of nutrient cycling.',
          correctsTo: 'Decomposers are the RECYCLING SYSTEM of every ecosystem. When organisms die, decomposers break them down and return nutrients (nitrogen, phosphorus, carbon) to the soil. Without decomposers, dead matter would pile up forever, and producers would run out of nutrients to grow. Energy flows ONE WAY, but matter (atoms) CYCLES through ecosystems — and decomposers close that cycle. They are the backbone of every working ecosystem.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Trophic levels: producers → 1° consumers → 2° → 3° (top).',
        '10% rule: energy decreases by ~10× at each level.',
        'Energy pyramid: wide at bottom, narrow at top.',
        'Decomposers recycle nutrients back to producers.',
        'Removing one species ripples through the whole web.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
