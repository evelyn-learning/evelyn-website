/**
 * K-2 SS — Community helpers.
 *
 * Who keeps a community running: doctors, firefighters, teachers,
 * grocers, librarians, sanitation workers. The "we depend on each
 * other" idea, told concretely.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_COMMUNITY_HELPERS: LessonPlan = {
  id: 'evelyn.k2.ss.community.helpers.v1',
  title: 'People who help our community',
  curriculum: 'NCSS',
  grade: '1',
  subject: 'ss',
  topic: 'community',
  locale: 'en',
  los: [
    {
      id: 'ncss.k2.individuals.groups.institutions',
      description: 'Identify roles people play in their community and how they depend on each other.',
      standard: 'NCSS.D2.Civ.1.K-2',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.k2.civic.virtues'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student thinking about who helps them in a normal day.',
      script: 'Think about today. Who has helped you so far? Maybe a parent, a teacher, a bus driver? Communities are full of helpers.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-who-helps',
      kind: 'concept',
      goal: 'A community is a group of people who live and work near each other, each doing different jobs.',
      keyIdeas: [
        'A COMMUNITY is people who live, work, and play in the same area.',
        'Different people do different JOBS — and each job helps everyone else.',
        'DOCTORS help when we\'re sick. FIREFIGHTERS keep us safe from fires.',
        'TEACHERS help us learn. GROCERS bring food to stores. LIBRARIANS share books.',
        'No one does everything alone — we depend on each other.',
      ],
      vocabulary: [
        { term: 'community', definition: 'a group of people who live and work near each other.' },
        { term: 'helper', definition: 'someone who does a job that helps the community.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-firefighter',
      kind: 'worked_example',
      problem: 'What does a firefighter do, and why is that job important?',
      steps: [
        'A FIREFIGHTER puts out fires and rescues people in danger.',
        'Why important? If a house catches fire, no one in the family can stop it alone — they need someone trained with the right tools.',
        'Firefighters also visit schools to teach fire safety. They help BEFORE problems happen too.',
        'Without firefighters, a small fire could spread to the whole neighborhood.',
      ],
      answer: 'puts out fires, rescues people, teaches safety',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name one community helper and one thing they do.',
      expectedAnswer: 'a doctor helps sick people',
      responseFormat: 'free',
      hints: [
        'Think about places you go: school, store, hospital, library.',
        'Who works there? What do they do?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-firefighters-helpers',
      kind: 'misconception_check',
      question: 'Are only firefighters and police community helpers?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Thinking only emergency workers are helpers.',
          correctsTo: 'No — teachers, mail carriers, bus drivers, garbage collectors, grocers, dentists, librarians… ALL of them help the community work.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A community is people living and working near each other.',
        'Different jobs help in different ways — health, safety, food, learning.',
        'We DEPEND on each other; no one does it all alone.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a job you might want when you grow up. How would that job help your community?',
      hint: 'Even artists, farmers, and engineers help — think about what they make or do for others.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
