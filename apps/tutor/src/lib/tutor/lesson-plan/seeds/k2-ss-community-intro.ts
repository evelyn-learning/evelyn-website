/**
 * Grades K-2 Social Studies — What Is a Community?
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_COMMUNITY_INTRO: LessonPlan = {
  id: 'evelyn.k2.ss.community-intro.v1',
  title: 'K-2 SS — What Is a Community?',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ss',
  topic: 'k2-ss',
  locale: 'en',
  los: [
    {
      id: 'k2.ss.community-intro',
      description: 'Identify what a community is; recognise the people and places that make up a child\'s community.',
      standard: 'NCSS K-2 People, Places, Environments',
    },
  ],
  prerequisites: [],
  followUps: ['k2.ss.maps-symbols'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A community is bigger than a family — and you\'re part of one.',
      script: 'You live in a HOUSE with your family. But you also live in a NEIGHBOURHOOD. And the neighbourhood is part of a TOWN or CITY. Each one is bigger than the last. All of these together make a COMMUNITY.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-community',
      kind: 'concept',
      goal: 'Define community + identify members + recognise types.',
      keyIdeas: [
        'COMMUNITY: a group of people who live, work, or learn together in the same area.',
        'TYPES: rural (small, with farms and open spaces), suburban (homes near a city), urban (city, lots of people and buildings).',
        'MEMBERS: families, neighbours, helpers (police, firefighters, teachers, doctors), shopkeepers, workers.',
        'PLACES: homes, schools, parks, libraries, hospitals, stores, fire stations.',
        'COMMUNITIES SHARE: rules, holidays, traditions, places they all use.',
        'EVERY child belongs to several communities at once: family, school, neighbourhood, sometimes religious or sports groups.',
        'COMMUNITIES help: by working together, members keep one another safe, healthy, and happy.',
      ],
      vocabulary: [
        { term: 'community', definition: 'a group of people who live, work, or play together in one place.' },
        { term: 'neighbour', definition: 'someone who lives near you.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-community',
      kind: 'worked_example',
      problem: 'Name three places in YOUR community and tell what each is for.',
      steps: [
        'School — where children learn.',
        'Library — where everyone borrows books.',
        'Park — where families play and exercise.',
        'Each place serves the community in its own way.',
      ],
      answer: 'Three places + their purposes.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Who is one COMMUNITY HELPER, and what does that person do?',
      expectedAnswer: 'Sample: A firefighter — puts out fires and keeps people safe. Or: A teacher — helps children learn.',
      responseFormat: 'free',
      hints: [
        'Think of jobs that help everyone in the community.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-family-only',
      kind: 'misconception_check',
      question: 'A child says "my community is just my family". Why is this incomplete?',
      commonErrors: [
        {
          answer: 'Community = just family',
          misconception: 'Confusing family with community.',
          correctsTo: 'Family is one part of your community, but a community is BIGGER. It includes neighbours, teachers, helpers, store workers, and more — everyone who shares your area. You belong to many communities at once: family, school, neighbourhood, town. They overlap like layers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Community = people who live, work, or play together.',
        'Types: rural, suburban, urban.',
        'Members: families, helpers, workers, shopkeepers.',
        'You belong to many communities at once.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How might TWO communities (your school and your neighbourhood) be DIFFERENT?',
      hint: 'Different places, different people, different rules. School: classmates and teachers, classrooms, learning rules. Neighbourhood: families and neighbours, houses, friendly hellos. Both are communities, but each has its own purpose and members. People belong to many communities at once.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
