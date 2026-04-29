/**
 * K-2 Science — The Day and Night Sky.
 *
 * NGSS 1-ESS1-1 / 1-ESS1-2: use observations of the sun, moon, and
 * stars to describe patterns that can be predicted. Day vs night
 * sky, sun position changing through the day, moon phases (intro
 * level — just "the moon changes shape").
 *
 * Source: NGSS 1-ESS1, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_DAY_NIGHT_SKY: LessonPlan = {
  id: 'evelyn.k2.science.earth.day-night-sky.v1',
  title: 'The Day and Night Sky',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'earth-and-space',
  locale: 'en',
  los: [
    {
      id: 'ngss.1-ess1-1',
      description: 'Use observations of the sun, moon, and stars to describe patterns that can be predicted.',
      standard: 'NGSS.1-ESS1-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.5-ess1-2'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice what they see in the daytime sky vs at night.',
      script: 'Look at the sky during the day — what do you see? Now imagine looking at the same spot at night. What\'s different? What\'s the same?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-day-vs-night',
      kind: 'concept',
      goal: 'During the day we see the sun and clouds; at night we see the moon and stars. The sun rises and sets in a pattern.',
      keyIdeas: [
        'DAY SKY: SUN (very bright!), clouds, sometimes the moon if it\'s up.',
        'NIGHT SKY: MOON (sometimes), STARS (lots of them!), planets (look like extra-bright stars).',
        'The SUN appears to move across the sky from morning to evening — rises in the EAST, sets in the WEST.',
        'The MOON also rises and sets — but at different times of the day or night.',
        'STARS are like our sun, but VERY far away — that\'s why they look so small.',
        'These patterns repeat every day. We can predict where the sun will be tomorrow at noon.',
      ],
      vocabulary: [
        { term: 'sunrise', definition: 'when the sun appears in the east in the morning.' },
        { term: 'sunset', definition: 'when the sun goes down in the west in the evening.' },
        { term: 'planet', definition: 'a big round object in space, like Earth, Mars, or Jupiter.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sun-position',
      kind: 'worked_example',
      problem: 'You look outside at 7am and the sun is just rising in the east. Where will the sun be at noon? Where will it be in the evening?',
      steps: [
        '7AM (sunrise): sun is LOW in the EAST.',
        'NOON: sun is HIGH UP, close to overhead.',
        'EVENING (sunset): sun is LOW in the WEST.',
        'This pattern happens EVERY day, year after year.',
      ],
      answer: 'Noon: high up. Evening: low in the west.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re looking up at night and you see something very bright that doesn\'t twinkle. It\'s probably not a star — what is it most likely?',
      expectedAnswer: 'a planet',
      responseFormat: 'free',
      hints: [
        'Stars twinkle (the air bends their light a lot). Planets shine steadily.',
        'A bright non-twinkling object is most likely a planet (Venus, Mars, or Jupiter).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sun-disappears',
      kind: 'misconception_check',
      question: 'A friend says "the sun goes AWAY at night — it sleeps." What\'s really happening when the sun "sets"?',
      commonErrors: [
        {
          answer: 'Yes — the sun goes to sleep.',
          misconception: 'Believing the sun stops existing or sleeps at night.',
          correctsTo: 'The sun is ALWAYS there. EARTH is spinning! When your part of Earth turns AWAY from the sun, you can\'t see it anymore — that\'s night for you. Meanwhile, the OTHER side of Earth is having day with the same sun.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Day sky has the sun. Night sky has the moon and stars.',
        'Sun rises in the east, sets in the west — every day.',
        'Stars twinkle; planets shine steadily.',
        'The sun doesn\'t disappear — Earth turns!',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
