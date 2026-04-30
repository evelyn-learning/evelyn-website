/**
 * K-2 SS — Continents and oceans.
 *
 * Earth has 7 continents and 5 oceans. Memory mnemonics + map
 * pointing. Foundation for later world geography.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_CONTINENTS_OCEANS: LessonPlan = {
  id: 'evelyn.k2.ss.geography.continents-oceans.v1',
  title: 'The 7 continents and 5 oceans',
  curriculum: 'NCSS',
  grade: '2',
  subject: 'ss',
  topic: 'geography',
  locale: 'en',
  los: [
    {
      id: 'ncss.k2.geography.places',
      description: 'Identify the major land and water features of the Earth.',
      standard: 'NCSS.D2.Geo.1.K-2',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.35.geography.regions'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to wonder about the size of Earth.',
      script: 'Earth is huge — so big it has SEVEN giant pieces of land and FIVE giant oceans. Ready to learn all of them in a few minutes?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-seven',
      kind: 'concept',
      goal: 'Name the 7 continents and 5 oceans, and roughly where they sit.',
      keyIdeas: [
        'A CONTINENT is a giant piece of land. There are 7: North America, South America, Europe, Asia, Africa, Australia, Antarctica.',
        'Asia is the BIGGEST continent. Australia is the smallest. Antarctica is the coldest (covered in ice!).',
        'An OCEAN is a giant body of salt water. There are 5: Pacific (biggest), Atlantic, Indian, Arctic, Southern.',
        'The Pacific is so big you could fit ALL the continents inside it.',
        'Memory trick for continents: "Eat An Aspirin After A Nighttime Snack" — Europe, Asia, Australia, Antarctica, Africa, North America, South America.',
      ],
      vocabulary: [
        { term: 'continent', definition: 'a giant piece of land — there are 7 on Earth.' },
        { term: 'ocean', definition: 'a giant body of salt water — there are 5.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-where-am-i',
      kind: 'worked_example',
      problem: 'If you live in the United States, what continent are you on?',
      steps: [
        'The United States is a country.',
        'It\'s in the part of the world called North America — Canada is north of it, Mexico is south.',
        'North America is ONE of the 7 continents.',
        'So the answer is: North America.',
      ],
      answer: 'North America',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which is the LARGEST ocean on Earth?',
      expectedAnswer: 'Pacific',
      responseFormat: 'free',
      choices: [
        { id: 'a', text: 'Atlantic' },
        { id: 'b', text: 'Pacific', correct: true },
        { id: 'c', text: 'Indian' },
        { id: 'd', text: 'Arctic' },
      ],
      hints: [
        'It touches the west coast of North America AND the east coast of Asia.',
        'It\'s so wide planes take many hours to fly across.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-country-vs-continent',
      kind: 'misconception_check',
      question: 'Is "America" a continent?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the country (USA) with the continent (North America).',
          correctsTo: 'There are TWO continents named with America: North America and South America. The USA is a country in North America.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '7 continents: North America, South America, Europe, Asia, Africa, Australia, Antarctica.',
        '5 oceans: Pacific (biggest), Atlantic, Indian, Arctic, Southern.',
        'Pacific is HUGE — it\'s about a third of Earth\'s surface.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Which continent has NO countries — only research stations?',
      hint: 'It\'s the coldest one, covered in ice.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
