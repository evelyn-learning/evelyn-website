/**
 * Grades K-2 Social Studies — Holidays & Traditions.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_HOLIDAYS_TRADITIONS: LessonPlan = {
  id: 'evelyn.k2.ss.holidays-traditions.v1',
  title: 'K-2 SS — Holidays & Traditions',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ss',
  topic: 'k2-ss',
  locale: 'en',
  los: [
    {
      id: 'k2.ss.holidays-traditions',
      description: 'Identify common holidays and traditions; explain why families and communities celebrate them.',
      standard: 'NCSS K-2 Culture',
    },
  ],
  prerequisites: ['k2.ss.timeline-intro'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Holidays and traditions connect us to family, community, and history.',
      script: 'Birthdays. Thanksgiving. Independence Day. Lunar New Year. Eid. Diwali. Each of these is a HOLIDAY — a special day many people celebrate. The way you celebrate is your TRADITION. Today we drill what these mean and why they matter.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-holidays',
      kind: 'concept',
      goal: 'Define + identify common holidays + understand traditions + diversity.',
      keyIdeas: [
        'HOLIDAY: a special day to celebrate or remember something important.',
        'TRADITION: how a family or community always celebrates — passed down over years.',
        'NATIONAL holidays in the US: Independence Day (July 4 — celebrates freedom), Thanksgiving (4th Thursday in November — gratitude), Memorial Day (honours soldiers), MLK Day (honours civil rights leader).',
        'CULTURAL holidays: Lunar New Year (East Asian families), Eid al-Fitr (Muslim families, end of Ramadan), Diwali (Hindu/Sikh families, festival of lights), Hanukkah (Jewish families, festival of lights), Kwanzaa (African American families).',
        'PERSONAL traditions: birthday cakes, family meals, vacation routines.',
        'WHY HOLIDAYS MATTER: connect us to history, family, beliefs. Bring people together.',
        'DIVERSITY: not every family celebrates the same things. Many families have their own mix.',
        'RESPECT: different families have different holidays. Asking about — and respecting — others\' traditions builds understanding.',
      ],
      vocabulary: [
        { term: 'holiday', definition: 'a special day for celebrating or remembering.' },
        { term: 'tradition', definition: 'a way of celebrating that is passed down from family or community over time.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tradition',
      kind: 'worked_example',
      problem: 'Tell about ONE holiday or tradition your family has, and what makes it special.',
      steps: [
        'Many families celebrate birthdays.',
        'On someone\'s birthday, they might: get a cake, have candles to blow out, sing "Happy Birthday", give presents.',
        'WHAT makes it special: it celebrates a person\'s LIFE; family gathers; the birthday person feels loved and honoured.',
        'Different families have different birthday traditions — some have parties, some quiet dinners.',
      ],
      answer: 'Birthday: cake, candles, song, gifts. Celebrates the person.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why might TWO families celebrate Thanksgiving DIFFERENTLY?',
      expectedAnswer: 'Different family traditions! Some have turkey, some don\'t. Some watch parades; some volunteer at shelters; some have big extended-family gatherings; some keep it small. Same holiday, different ways to celebrate.',
      responseFormat: 'free',
      hints: [
        'Different families have different ways of doing things.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-everyone-same',
      kind: 'misconception_check',
      question: 'A child assumes all families celebrate the same holidays. Why is this wrong?',
      commonErrors: [
        {
          answer: 'All families celebrate the same things',
          misconception: 'Assuming one\'s own traditions are universal.',
          correctsTo: 'Different families have different cultural and religious backgrounds. A family that\'s Hindu might celebrate Diwali; a Muslim family might celebrate Eid; a Jewish family might celebrate Hanukkah; a non-religious family might focus on national holidays like Independence Day. ALL of these are real, valid traditions. Asking respectfully about others\' celebrations is how we learn.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Holiday = special day for celebrating or remembering.',
        'Tradition = how a family or group celebrates over time.',
        'Different families have different holidays.',
        'Respecting others\' traditions builds understanding.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does a holiday help connect you to PEOPLE WHO LIVED LONG AGO?',
      hint: 'Many holidays celebrate something that happened in the past. Independence Day remembers when America became its own country. Christmas marks an event from 2000+ years ago. By celebrating, families pass stories to children, who pass them to their own children. The holiday is a bridge across time, connecting today\'s people to ancestors and traditions.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
