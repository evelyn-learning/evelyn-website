/**
 * K-2 Science — Weather and Seasons.
 *
 * NGSS K-ESS2-1 / K-ESS3-2: use observations to describe weather
 * patterns over time (seasons), and ask questions to obtain
 * information about how the weather affects what people wear or do.
 *
 * Source: NGSS K-ESS2/3, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_WEATHER_SEASONS: LessonPlan = {
  id: 'evelyn.k2.science.earth.weather-seasons.v1',
  title: 'Weather and Seasons',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'earth-and-space',
  locale: 'en',
  los: [
    {
      id: 'ngss.k-ess2-1',
      description: 'Use and share observations of local weather conditions to describe patterns over time.',
      standard: 'NGSS.K-ESS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.3-ess2-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student noticing what season they\'re in right now.',
      script: 'What\'s the weather like outside today? Is it hot or cold? Sunny or rainy? Now think — what season are we in? Each season has its own kind of weather.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-weather-seasons',
      kind: 'concept',
      goal: 'Weather is the day-to-day condition of the air. Seasons are patterns of weather that repeat each year.',
      keyIdeas: [
        'WEATHER = what\'s going on in the sky RIGHT NOW. Sunny, cloudy, rainy, windy, snowy, hot, cold.',
        'SEASONS = patterns of weather that happen each year: SPRING, SUMMER, FALL, WINTER.',
        'In many places: SUMMER is HOT, WINTER is COLD, SPRING and FALL are in between.',
        'Different parts of Earth have different season patterns. Near the equator: warm all year. Far north/south: big season changes.',
        'PLANTS and ANIMALS respond to seasons — leaves fall, animals grow thicker fur or migrate, flowers bloom in spring.',
      ],
      vocabulary: [
        { term: 'weather', definition: 'what the sky and air are doing right now.' },
        { term: 'season', definition: 'a part of the year with its own weather pattern.' },
        { term: 'migrate', definition: 'when animals move to a new place for a season.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-clothing-by-season',
      kind: 'worked_example',
      problem: 'A child needs to dress for school. In SUMMER they wear shorts and a t-shirt. In WINTER they wear a heavy coat, gloves, and a hat. Why the difference?',
      steps: [
        'SUMMER: weather is HOT. Body needs to stay COOL. Light clothing lets body heat escape.',
        'WINTER: weather is COLD. Body needs to stay WARM. Heavy clothing TRAPS body heat.',
        'Different seasons → different weather → different clothing.',
      ],
      answer: 'Different seasons have different weather, so we need different clothes.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bird flies south every fall and comes back every spring. Why?',
      expectedAnswer: 'It migrates because winter is too cold (and food is scarce) where it lives. It flies to a warmer place for the cold months.',
      responseFormat: 'free',
      hints: [
        'What changes about weather in fall and winter?',
        'Birds need food and warmth — where can they find both in winter?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-weather-equals-climate',
      kind: 'misconception_check',
      question: 'A friend says "today is sunny, so we\'re in summer!" Is that right?',
      commonErrors: [
        {
          answer: 'Yes — sun = summer.',
          misconception: 'Confusing one day\'s weather with the season as a pattern.',
          correctsTo: 'A sunny day can happen in any season — including winter! Seasons are about the OVERALL pattern: summer is sunny AND hot for many weeks; winter is often cold even on sunny days. One day isn\'t enough to tell.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weather = today\'s sky. Season = a months-long pattern.',
        'Four seasons: spring, summer, fall, winter.',
        'Animals and plants respond to seasons (migration, leaves falling, blooming).',
        'We dress for the weather and the season.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
