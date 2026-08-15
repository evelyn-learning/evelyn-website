/**
 * G3 — Communities: rural, urban, suburban.
 *
 * Three kinds of communities, what makes each different, and how
 * geography shapes how people live.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SS_COMMUNITIES: LessonPlan = {
  id: 'evelyn.g3.ss.communities.rural-urban-suburban.v1',
  title: 'Rural, urban, and suburban communities',
  curriculum: 'NCSS',
  grade: '3',
  subject: 'ss',
  topic: 'communities',
  locale: 'en',
  los: [
    {
      id: 'ncss.35.geography.places',
      description: 'Compare different types of communities based on geography and population.',
      standard: 'NCSS.D2.Geo.4.3-5',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.35.civic.local-government'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to picture two very different places.',
      script: 'Imagine a place where you can hear cows in the morning. Now imagine one where you hear honking taxis. Both are real communities — they just look totally different.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-types',
      kind: 'concept',
      goal: 'Communities fall into three rough types: rural, urban, suburban.',
      keyIdeas: [
        'A COMMUNITY is a group of people living near each other.',
        'RURAL community: small population, lots of open land, often farms. Few buildings, more nature. Examples: small towns in Iowa, ranches in Wyoming.',
        'URBAN community: a city. Lots of people, tall buildings, busy streets, public transportation. Examples: New York, Chicago, Mumbai.',
        'SUBURBAN community: in between. Outside a city. Houses with yards, schools, malls. Most people drive to the city for work. Examples: most of the towns surrounding any big city.',
        'GEOGRAPHY (mountains, rivers, weather) shapes which type a community becomes.',
      ],
      vocabulary: [
        { term: 'rural', definition: 'a community with few people and lots of open land or farms.' },
        { term: 'urban', definition: 'a busy city with lots of people and tall buildings.' },
        { term: 'suburban', definition: 'a community on the edge of a city, with mostly houses.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'A place has 80,000 people, lots of houses with yards, and most adults drive 30 minutes to a city for work. What type of community is this?',
      steps: [
        '80,000 people — moderate, not a tiny town and not a giant city.',
        'Houses with yards — typical of suburban.',
        'Drive to a nearby city for work — classic suburban pattern.',
        'So: SUBURBAN.',
      ],
      answer: 'suburban',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A community has 200 people, one road, and 50 cattle ranches. Rural, urban, or suburban?',
      expectedAnswer: 'rural',
      responseFormat: 'free',
      hints: [
        'Few people + open land + farms or ranches → which type?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-cities-real',
      kind: 'misconception_check',
      question: 'Are cities the only "real" communities?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Thinking only urban areas count as communities.',
          correctsTo: 'No — rural towns and suburbs are full communities too. They have schools, helpers, traditions. Just smaller or more spread out.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'RURAL = small population, open land, often farms.',
        'URBAN = city, big population, tall buildings.',
        'SUBURBAN = between the two — houses near a city.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might someone choose to live in a rural area even if it\'s far from stores?',
      hint: 'Think about quiet, space, animals, cost of houses.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
