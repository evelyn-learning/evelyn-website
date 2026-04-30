/**
 * K-2 SS — Families and cultures.
 *
 * Families come in many shapes; people have different traditions,
 * languages, and celebrations — and that\'s a good thing.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_FAMILIES_CULTURES: LessonPlan = {
  id: 'evelyn.k2.ss.families.cultures.v1',
  title: 'Families and cultures around us',
  curriculum: 'NCSS',
  grade: '1',
  subject: 'ss',
  topic: 'culture',
  locale: 'en',
  los: [
    {
      id: 'ncss.k2.culture',
      description: 'Recognize that people have similar needs but express them through different cultures.',
      standard: 'NCSS.D2.Cul.1.K-2',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.k2.individuals.groups'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with a relatable question about what makes the student\'s family special.',
      script: 'What\'s one food your family eats together? Maybe pasta, dosa, tacos, rice and beans? Every family has their favorites.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-many-families',
      kind: 'concept',
      goal: 'Families look different, but every family loves and takes care of its members.',
      keyIdeas: [
        'A FAMILY is a group of people who care for each other.',
        'Families come in MANY shapes: big, small, two-parent, one-parent, grandparents-raising-kids, blended, adopted.',
        'Different families have different TRADITIONS — special foods, holidays, languages, songs.',
        'CULTURE = the things a group of people share: food, language, music, clothing, holidays.',
        'Every culture has things to celebrate. Learning about other cultures makes our world richer.',
      ],
      vocabulary: [
        { term: 'family', definition: 'a group of people who love and care for each other.' },
        { term: 'culture', definition: 'the food, language, holidays, and traditions a group shares.' },
        { term: 'tradition', definition: 'something a family or group does the same way each year.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-tradition',
      kind: 'worked_example',
      problem: 'Why do different families celebrate different holidays?',
      steps: [
        'Holidays come from CULTURES — and different families have different cultures.',
        'A family from China might celebrate Lunar New Year with red envelopes.',
        'A family from Mexico might celebrate Día de los Muertos with photos of grandparents.',
        'A family from India might celebrate Diwali with lights and sweets.',
        'None is "right" or "wrong" — they\'re different ways to celebrate love, family, and the year.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name one tradition your family does together (a meal, a holiday, a song, a saying).',
      expectedAnswer: 'family-specific answer',
      responseFormat: 'free',
      hints: [
        'Think about things your family does that other families might not.',
        'Foods, songs, holidays, even nicknames — all count!',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-right-family',
      kind: 'misconception_check',
      question: 'Is there one "right" way for a family to look?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Thinking only one family structure is "real".',
          correctsTo: 'No — what matters is that the people CARE for each other. Two moms, single dad, grandma raising you, foster family — all real, all loving.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Families come in many shapes — what matters is the love and care.',
        'Different cultures = different foods, languages, holidays.',
        'Learning about other cultures makes our world richer.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If a friend at school celebrates a holiday you\'ve never heard of, what\'s a polite question to ask?',
      hint: 'Try "Can you tell me about it?" — curiosity, not judgment.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
