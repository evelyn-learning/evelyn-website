/**
 * K-2 Science — Sunlight and Weather.
 *
 * NGSS K-PS3-1 / K-PS3-2: the effect of sunlight on Earth's surface
 * and how to design a structure (like a shade) to slow that warming.
 * Concrete embodied investigation: hands in sun vs hands in shade,
 * sand in a paper cup, etc. Avoids "energy transfer" jargon — keeps
 * the language at "the sun warms things up" level.
 *
 * Source: NGSS K-PS3, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_SUNLIGHT_WEATHER: LessonPlan = {
  id: 'evelyn.k2.science.earth.sunlight-weather.v1',
  title: 'Sunlight and Weather',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'earth-and-space',
  locale: 'en',
  los: [
    {
      id: 'ngss.k-ps3-1',
      description: 'Make observations to determine the effect of sunlight on Earth\'s surface.',
      standard: 'NGSS.K-PS3-1',
    },
    {
      id: 'ngss.k-ps3-2',
      description: 'Use tools and materials to design and build a structure that will reduce the warming effect of sunlight on an area.',
      standard: 'NGSS.K-PS3-2',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.4-ess2-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student noticing that the same place feels different in sun vs shade.',
      script: 'Have you ever stepped from sun into shade on a hot day? What changed? Now think about a sidewalk in the sun in summer — too hot to touch! Why?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sun-warms',
      kind: 'concept',
      goal: 'Sunlight makes things warmer; without it, things stay cooler.',
      keyIdeas: [
        'The sun gives off LIGHT and HEAT.',
        'When sunlight lands on something — sand, sidewalk, your skin — it warms it up.',
        'In the SHADE, sunlight is blocked. Things in the shade stay COOLER.',
        'Different colors warm up at different speeds (dark colors get hotter than light colors).',
      ],
      vocabulary: [
        { term: 'sunlight', definition: 'light from the sun — also carries heat.' },
        { term: 'shade', definition: 'a place where sunlight is blocked.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cup-experiment',
      kind: 'worked_example',
      problem: 'You put two cups of water outside on a sunny day. One cup sits in direct sunlight. The other cup sits under a small box (in shade). After an hour, you check the water temperature. Which cup is warmer?',
      steps: [
        'Sun-cup: sunlight hits the water all hour, slowly warming it.',
        'Shade-cup: the box BLOCKS the sunlight. The water doesn\'t warm.',
        'After an hour, the sun-cup is WARMER. The shade-cup is closer to the starting temperature.',
      ],
      answer: 'The cup in direct sunlight is warmer; the shaded cup stays cooler.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You want to keep a popsicle from melting at the park. Where would you put it: on a sunny picnic table, or under the picnic umbrella in shade?',
      expectedAnswer: 'under the umbrella in shade',
      responseFormat: 'free',
      hints: [
        'Sun warms things up. Where would the popsicle warm up FASTER?',
        'You want it to stay COLD — so you want the place that\'s cooler.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sun-only-summer',
      kind: 'misconception_check',
      question: 'A student says "the sun only warms things in the summer — in winter it doesn\'t." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — the sun is cold in winter.',
          misconception: 'Confusing season-driven temperature changes with the sun "turning off".',
          correctsTo: 'The sun warms things ALL year — but in winter the sunlight hits Earth at an angle and the days are shorter, so we GET LESS of it. The sun itself is just as hot.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sunlight = light + warmth.',
        'Shade blocks sunlight, so things stay cooler.',
        'A simple shade (umbrella, box, hat) protects things from warming up.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
