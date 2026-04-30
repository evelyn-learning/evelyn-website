/**
 * K-2 — Five senses.
 *
 * Sight, hearing, smell, taste, touch. Body parts that do each. How
 * we learn about our world.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_FIVE_SENSES: LessonPlan = {
  id: 'evelyn.k2.sci.life.five-senses.v1',
  title: 'Our five senses',
  curriculum: 'NGSS',
  grade: '1',
  subject: 'sci',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.k.ls1.a',
      description: 'Use observations to describe patterns of what plants and animals (including humans) need to survive.',
      standard: 'NGSS.K-LS1-1',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 9,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Notice senses by closing them off.',
      script: 'Close your eyes. What do you HEAR? What do you SMELL? Touch the table — how does it feel? Your body has FIVE senses, all working at the same time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five',
      kind: 'concept',
      goal: 'Each sense, body part, and what it tells us.',
      keyIdeas: [
        'SIGHT: with our EYES. Tells us about light, color, shape, distance.',
        'HEARING: with our EARS. Tells us about sounds — voices, music, warning sounds.',
        'SMELL: with our NOSE. Tells us about scents — food cooking, flowers, smoke.',
        'TASTE: with our TONGUE. Tells us about flavors — sweet, salty, sour, bitter.',
        'TOUCH: with our SKIN (especially fingers). Tells us about texture — soft, rough, hot, cold.',
        'All five work TOGETHER. Eating ice cream uses sight (color), smell, taste, AND touch (cold).',
      ],
      vocabulary: [
        { term: 'senses', definition: 'how our body learns about the world.' },
        { term: 'texture', definition: 'how something feels — smooth, rough, soft.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-apple',
      kind: 'worked_example',
      problem: 'Which senses do you use to enjoy an apple?',
      steps: [
        'SIGHT: red, round.',
        'TOUCH: smooth skin, hard.',
        'SMELL: sweet apple smell.',
        'TASTE: sweet, juicy.',
        'HEARING: crunch when you bite!',
        'All five senses can work on one apple.',
      ],
      answer: 'all 5 — sight, touch, smell, taste, hearing',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which sense do you use to know if a stove is HOT?',
      expectedAnswer: 'touch (or sight if you see steam/glow)',
      responseFormat: 'free',
      hints: [
        'Heat is felt with your skin — without touching it, you can feel warmth nearby.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-one',
      kind: 'misconception_check',
      question: 'When you eat dinner, do you only use ONE sense (taste)?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Counting only the most obvious sense.',
          correctsTo: 'No — you SEE the food, SMELL it (smell affects taste a lot!), FEEL the texture in your mouth, and HEAR yourself crunching. Many senses at once. That\'s why food tastes weird when you have a stuffed-up nose — smell is missing.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five senses: SIGHT (eyes), HEARING (ears), SMELL (nose), TASTE (tongue), TOUCH (skin).',
        'They work together to tell us about the world.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Some animals have senses we don\'t! Bats use echolocation, dogs smell ~10,000 times better. Can you name another?',
      hint: 'Snakes sense heat (infrared pits). Sharks sense electric fields. Birds sense Earth\'s magnetic field for migration.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
