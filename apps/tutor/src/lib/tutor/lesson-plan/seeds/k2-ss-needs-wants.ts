/**
 * K-2 SS — Needs vs wants (intro economics).
 *
 * Needs: food, water, shelter, clothing. Wants: toys, treats, fancy
 * things. Why telling them apart matters for choices.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_NEEDS_WANTS: LessonPlan = {
  id: 'evelyn.k2.ss.economics.needs-wants.v1',
  title: 'Needs vs wants',
  curriculum: 'NCSS',
  grade: '1',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ncss.k2.economics.scarcity',
      description: 'Distinguish between needs and wants and explain how people make economic choices.',
      standard: 'NCSS.D2.Eco.1.K-2',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.35.economics.choices'],
  estimatedMinutes: 9,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the gap with concrete examples.',
      script: 'You NEED food to live. But you might WANT a giant chocolate cake. Both are real, but they\'re different. Today we\'ll learn the difference between needs and wants.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distinction',
      kind: 'concept',
      goal: 'Define each, give examples, explain why it matters.',
      keyIdeas: [
        'NEEDS are things you HAVE TO have to LIVE: food, water, shelter (a home), clothing, basic medicine.',
        'WANTS are things you would LIKE to have but can live without: toys, candy, fancy clothes, video games.',
        'You can survive without wants. You CANNOT survive without needs.',
        'Why this matters: people don\'t always have enough money for everything. So they have to PRIORITIZE — needs first, wants if there\'s money left over.',
        'Wants aren\'t bad — they\'re fun and enrich life. The skill is knowing the difference and choosing wisely.',
      ],
      vocabulary: [
        { term: 'need', definition: 'something you must have to live — food, water, shelter, clothing.' },
        { term: 'want', definition: 'something you would like but don\'t need to live.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Sort these: water, video game, jacket in winter, candy.',
      steps: [
        'WATER: you need it to live → NEED.',
        'VIDEO GAME: fun, but not required → WANT.',
        'JACKET in winter: keeps you warm enough to be safe → NEED.',
        'CANDY: tasty, but not required → WANT.',
      ],
      answer: 'water = need; video game = want; jacket = need; candy = want',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A new toy or food — which is the NEED?',
      expectedAnswer: 'food',
      responseFormat: 'free',
      hints: [
        'Which one keeps you alive?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fancy-need',
      kind: 'misconception_check',
      question: 'Is a fancy birthday cake a NEED?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating special things as needs.',
          correctsTo: 'No — you need FOOD, but you don\'t NEED a fancy birthday cake. Cake is a WANT, even when it feels really important. Birthdays can be celebrated without expensive cake.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'NEEDS: food, water, shelter, clothing — to live.',
        'WANTS: things you\'d enjoy but don\'t need.',
        'Smart choices: needs first, wants when possible.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Are NEEDS the same for everyone, everywhere?',
      hint: 'Mostly yes — all humans need food, water, shelter. But specifics differ: a winter coat is a need in Alaska, not in Hawaii. Cultural context matters too.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
