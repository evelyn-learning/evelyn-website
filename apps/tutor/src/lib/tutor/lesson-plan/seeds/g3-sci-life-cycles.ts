/**
 * Grade 3 Science — Life Cycles of Plants and Animals.
 *
 * NGSS 3-LS1-1: develop a model showing organisms have unique and
 * diverse life cycles but follow a common pattern (birth → growth →
 * reproduction → death). Compares butterfly metamorphosis,
 * frog metamorphosis, plant seed-to-seed cycle, and a "no
 * metamorphosis" mammal cycle so the unifying pattern stands out.
 *
 * Source: NGSS 3-LS1, OpenStax Grade 3 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_LIFE_CYCLES: LessonPlan = {
  id: 'evelyn.g3.science.life.life-cycles.v1',
  title: 'Life Cycles of Plants and Animals',
  curriculum: 'NGSS',
  grade: '3',
  subject: 'science',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.3-ls1-1',
      description: 'Develop models to describe that organisms have unique and diverse life cycles but all have in common: birth, growth, reproduction, and death.',
      standard: 'NGSS.3-LS1-1',
    },
  ],
  prerequisites: ['ngss.k-ls1-1'],
  followUps: ['ngss.ms-ls1-4'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the surprise that a caterpillar is the same animal as the butterfly it becomes.',
      script: 'A caterpillar crawls on a leaf. A butterfly flies through the air. They look NOTHING alike — but they\'re actually the same animal at different stages. How does that work?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pattern',
      kind: 'concept',
      goal: 'Every living thing — plant or animal — goes through the same four stages: birth, growth, reproduction, death.',
      keyIdeas: [
        'BIRTH — the start of a new life. From an egg, a seed, or born from a parent.',
        'GROWTH — getting bigger and stronger. May involve big changes (caterpillar → chrysalis → butterfly).',
        'REPRODUCTION — making new offspring. Plants make seeds; animals lay eggs or birth young.',
        'DEATH — the end of life. Bodies return to the soil, becoming nutrients for new plants.',
        'This is a CYCLE because the new offspring start the pattern over again.',
      ],
      vocabulary: [
        { term: 'life cycle', definition: 'the stages an organism goes through from birth to death.' },
        { term: 'metamorphosis', definition: 'a big body change during growth (caterpillar → butterfly, tadpole → frog).' },
        { term: 'reproduction', definition: 'making new living things of the same kind.' },
      ],
      suggestedTools: ['show_cycle_diagram', 'show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-butterfly-cycle',
      kind: 'worked_example',
      problem: 'Walk through the four stages of a butterfly\'s life cycle.',
      steps: [
        'BIRTH — a butterfly lays an egg on a leaf. A tiny caterpillar hatches out.',
        'GROWTH (early) — the caterpillar eats leaves and grows MANY times its starting size.',
        'GROWTH (transformation) — the caterpillar forms a CHRYSALIS. Inside, its body completely rearranges.',
        'GROWTH (adult) — a butterfly emerges, with wings.',
        'REPRODUCTION — the adult butterfly mates and lays eggs of its own.',
        'DEATH — the adult dies after laying eggs, but the next generation has already begun.',
      ],
      answer: 'Egg → caterpillar → chrysalis → butterfly → eggs → death. Cycle restarts.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A flower drops seeds onto the ground. The seeds sprout into seedlings, grow into adult flowers, and those flowers eventually drop their own seeds. Which of the four life-cycle stages happens when the seed first sprouts?',
      expectedAnswer: 'birth (or "growth" — both are reasonable; sprouting is the start of life)',
      responseFormat: 'free',
      hints: [
        'Think about where the new life BEGINS for a plant.',
        'Sprouting from a seed is the plant\'s version of being born.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cycle-uniform',
      kind: 'misconception_check',
      question: 'A friend says "all animals must go through metamorphosis like butterflies do." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — all animals change shape.',
          misconception: 'Generalizing metamorphosis to all life cycles.',
          correctsTo: 'Many animals (mammals like dogs, cats, humans) DON\'T have metamorphosis — they\'re born looking like small versions of their adult form, then just grow bigger. Metamorphosis is a SPECIAL kind of growth used by butterflies, frogs, beetles, and some others. The four-stage PATTERN (birth/growth/reproduction/death) is universal, but the SHAPE of growth varies.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every living thing follows: birth → growth → reproduction → death.',
        'It\'s a CYCLE because each generation starts the pattern over.',
        'The pattern is universal, but the details (metamorphosis or not) vary.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Some bacteria can divide into two new bacteria once every 20 minutes when food is plentiful. How does their life cycle compare to a butterfly\'s?',
      hint: 'Same four stages — but how long is each? And how does reproduction look without two parents?',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
