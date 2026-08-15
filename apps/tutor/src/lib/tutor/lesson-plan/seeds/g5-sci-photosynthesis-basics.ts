/**
 * Grade 5 Science — Photosynthesis Basics.
 *
 * NGSS 5-LS1-1 / 5-PS3-1: plants get materials they need for growth
 * mostly from air and water (NOT mostly from the soil!), and the
 * energy in food can be traced back to the sun. Sets up the
 * conservation-of-matter framing without going into chemistry detail.
 *
 * Source: NGSS 5-LS1, 5-PS3, OpenStax Grade 5 Science, CK-12 Life Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_PHOTOSYNTHESIS_BASICS: LessonPlan = {
  id: 'evelyn.g5.science.life.photosynthesis-basics.v1',
  title: 'How Plants Make Their Own Food',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'science',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.5-ls1-1',
      description: 'Support an argument that plants get the materials they need for growth chiefly from air and water.',
      standard: 'NGSS.5-LS1-1',
    },
    {
      id: 'ngss.5-ps3-1',
      description: 'Use models to describe that energy in animals\' food (used for body repair, growth, motion, and to maintain body warmth) was once energy from the sun.',
      standard: 'NGSS.5-PS3-1',
    },
  ],
  prerequisites: ['ngss.k-ls1-1'],
  followUps: ['ngss.ms-ls1-6', 'ngss.hs-ls1-5'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the surprising truth that a tree\'s mass comes from AIR, not soil.',
      script: 'A giant oak tree weighs thousands of pounds. Where did all that mass come from? Most kids guess "the soil" — but if you weighed the soil under a tree before and after 100 years of growth, the soil weight barely changes. So where DID the tree come from?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-photosynthesis',
      kind: 'concept',
      goal: 'Plants make their own food (sugar) using sunlight, water, and air. Most of the plant\'s mass comes from air and water — not soil.',
      keyIdeas: [
        'Plants are "AUTOTROPHS" — they make their own food.',
        'INPUTS: sunlight (energy), water (from roots), carbon dioxide (CO₂ from air through leaves).',
        'OUTPUTS: sugar (the food the plant uses for growth + energy) and oxygen (released into the air).',
        'Most of the plant\'s body weight comes from CO₂ in the AIR, not soil. Soil provides minerals + water, but the bulk material is built from air.',
        'Light is captured in CHLOROPLASTS — green organelles in leaves. Chlorophyll (the green pigment) absorbs sunlight.',
      ],
      vocabulary: [
        { term: 'photosynthesis', definition: 'the process plants use to make food from sunlight, water, and air.' },
        { term: 'chlorophyll', definition: 'the green substance in leaves that captures sunlight.' },
        { term: 'autotroph', definition: 'a living thing that makes its own food.' },
        { term: 'carbon dioxide (CO₂)', definition: 'a gas in air that plants use to build their bodies.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-energy-trace',
      kind: 'worked_example',
      problem: 'A rabbit eats grass. A fox eats the rabbit. Trace where all the ENERGY in the fox\'s body originally came from.',
      steps: [
        'GRASS: did photosynthesis — captured energy from SUNLIGHT and stored it in sugar molecules.',
        'RABBIT: ate the grass and absorbed those sugar molecules. The sun\'s energy is now in the rabbit.',
        'FOX: ate the rabbit. The energy in the rabbit\'s body becomes the energy in the fox\'s body.',
        'TRACE: sun → grass → rabbit → fox. Every bit of energy in the fox came ORIGINALLY from sunlight.',
      ],
      answer: 'The energy in the fox originally came from the sun, captured by grass through photosynthesis.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A scientist grows a plant in a sealed jar with water and light, but no opening to outside air. After a few weeks the plant stops growing and starts to die. Which input did it run out of?',
      expectedAnswer: 'carbon dioxide (CO₂) from air',
      responseFormat: 'free',
      hints: [
        'Photosynthesis needs three inputs: sunlight, water, and ___ from the air.',
        'The jar is sealed. Light still gets in through the glass. Water is provided. What is missing?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-soil-feeds',
      kind: 'misconception_check',
      question: 'A friend insists "plants drink soil — that\'s where their body comes from." Is the soil the main source of a plant\'s mass?',
      commonErrors: [
        {
          answer: 'Yes — the soil is what plants are made of.',
          misconception: 'Believing plant mass comes mostly from soil.',
          correctsTo: 'Soil provides MINERALS (small amounts) and holds WATER. But the BULK of a plant\'s mass is built from CARBON in CO₂ pulled from the air, plus water. That\'s why a tree can grow huge in soil that hardly changes weight.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Photosynthesis: light + water + CO₂ → sugar + oxygen.',
        'Plant mass is built mostly from AIR (CO₂) and water.',
        'Energy in any food chain traces back to the sun.',
        'Chlorophyll in chloroplasts is what captures light.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If a plant releases oxygen as a byproduct of photosynthesis, where does the oxygen you breathe ultimately come from?',
      hint: 'Most of Earth\'s oxygen is produced by photosynthetic organisms — both plants on land AND something in the ocean. Can you guess what?',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
