/**
 * K-2 Science — Light and Shadows.
 *
 * NGSS 1-PS4-2 / 1-PS4-3: objects can be seen only when light shines
 * on them; some materials block light, making shadows. Concrete:
 * shadow on a sunny day, finger shadows on a wall, flashlight games.
 *
 * Source: NGSS 1-PS4, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_LIGHT_SHADOWS: LessonPlan = {
  id: 'evelyn.k2.science.physics.light-shadows.v1',
  title: 'Light and Shadows',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'waves',
  locale: 'en',
  los: [
    {
      id: 'ngss.1-ps4-2',
      description: 'Make observations to construct an evidence-based account that objects can be seen only when illuminated.',
      standard: 'NGSS.1-PS4-2',
    },
    {
      id: 'ngss.1-ps4-3',
      description: 'Plan and conduct investigations to determine the effect of placing objects made with different materials in the path of a beam of light.',
      standard: 'NGSS.1-PS4-3',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.4-ps4-2'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student noticing their own shadow.',
      script: 'Have you ever made a shadow on the wall with your hand? Or seen your shadow stretching long behind you on a sunny morning? Where do shadows COME from?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-light-and-shadows',
      kind: 'concept',
      goal: 'Light travels in straight lines. When something blocks the light, the dark area behind it is a shadow.',
      keyIdeas: [
        'LIGHT travels in straight lines from a SOURCE — sun, lamp, flashlight, fire.',
        'You can only SEE things when light bounces off them and reaches your eyes.',
        'When something solid BLOCKS the light, the area behind it stays DARK — that\'s a shadow.',
        'A bigger object makes a BIGGER shadow.',
        'Shadows have the same general shape as the thing blocking the light.',
        'Some materials let light THROUGH (clear glass, plastic wrap) — they don\'t make a strong shadow.',
        'Some materials BLOCK light (wood, metal, your body) — strong shadow.',
      ],
      vocabulary: [
        { term: 'light source', definition: 'something that makes its own light (sun, lamp, fire).' },
        { term: 'shadow', definition: 'the dark area behind something that blocks light.' },
        { term: 'transparent', definition: 'lets light through (like clear glass).' },
        { term: 'opaque', definition: 'blocks light (like a brick).' },
      ],
      suggestedTools: ['show_labeled_image', 'show_ray_diagram'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-flashlight-shadow',
      kind: 'worked_example',
      problem: 'You shine a flashlight at the wall. You hold up your hand between the flashlight and the wall. What appears on the wall?',
      steps: [
        'Flashlight = light source. Light travels in straight lines toward the wall.',
        'Your hand BLOCKS the light where it would have reached the wall.',
        'On the wall: you see a HAND-SHAPED dark area — the shadow.',
        'Around the hand-shape, the wall is bright (light still reaches it there).',
      ],
      answer: 'A hand-shaped shadow appears on the wall.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You hold a piece of CLEAR plastic in front of a flashlight. Then you hold a piece of CARDBOARD. Which one makes a shadow on the wall?',
      expectedAnswer: 'The cardboard makes a shadow. The clear plastic lets light through, so it barely makes any shadow.',
      responseFormat: 'free',
      hints: [
        'A shadow forms when light is BLOCKED.',
        'Clear plastic = transparent (light passes through). Cardboard = opaque (blocks light).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-see-in-dark',
      kind: 'misconception_check',
      question: 'A friend says "if my eyes adjust long enough in a closet, I\'ll be able to see in TOTAL darkness." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — eyes adjust to total darkness.',
          misconception: 'Believing eyes can see without any light.',
          correctsTo: 'No. Eyes can adjust to LOW light by getting more sensitive — but with ZERO light, there\'s nothing to see. Seeing requires light bouncing off objects into your eyes. No light = no seeing, no matter how long you wait.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Light comes from sources (sun, lamp, fire).',
        'You see things when light bounces off them into your eyes.',
        'Shadows form when something solid blocks the light.',
        'Clear things (transparent) don\'t make strong shadows; solid things (opaque) do.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
