/**
 * K — Calendar and days of the week.
 *
 * Days of the week, months, today/yesterday/tomorrow. Foundation
 * for time concepts.
 */

import type { LessonPlan } from '../types';

export const SEED_K_MATH_CALENDAR_TIME: LessonPlan = {
  id: 'evelyn.k.math.measurement.calendar-time.v1',
  title: 'Calendar: days, months, today and tomorrow',
  curriculum: 'CCSS',
  grade: 'K',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.k.md.a.1',
      description: 'Describe measurable attributes of objects, such as length or weight.',
      standard: 'CCSS.MATH.CONTENT.K.MD.A.1',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.math.1.md.b.3'],
  estimatedMinutes: 9,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use today as the anchor.',
      script: 'What day is today? What was yesterday? What\'s tomorrow? Calendar tells us where each day goes — like a list of days that keeps repeating.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cycles',
      kind: 'concept',
      goal: 'Days, week cycle, months, year.',
      keyIdeas: [
        'DAYS OF THE WEEK in order: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.',
        'After Saturday, the cycle starts AGAIN with Sunday. SEVEN days = one WEEK.',
        'WEEKEND = Saturday and Sunday (no school usually). WEEKDAYS = Monday-Friday (school days).',
        'TODAY: the day right now. YESTERDAY: the day before today. TOMORROW: the day after today.',
        'MONTHS: 12 of them — January, February, March, April, May, June, July, August, September, October, November, December.',
        'YEAR: 12 months. Then a new year starts.',
      ],
      vocabulary: [
        { term: 'today', definition: 'the day we are living right now.' },
        { term: 'yesterday', definition: 'the day before today.' },
        { term: 'tomorrow', definition: 'the day after today.' },
        { term: 'week', definition: 'seven days in a row.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-tomorrow',
      kind: 'worked_example',
      problem: 'If today is Wednesday, what is tomorrow?',
      steps: [
        'Days in order: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.',
        'After Wednesday comes Thursday.',
        'So tomorrow is THURSDAY.',
      ],
      answer: 'Thursday',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'If today is Friday, what is YESTERDAY?',
      expectedAnswer: 'Thursday',
      responseFormat: 'free',
      hints: [
        'Yesterday is the day BEFORE today.',
        'What comes before Friday in the week?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-saturday-after-saturday',
      kind: 'misconception_check',
      question: 'After Saturday, does Sunday come — or does it go back to Monday?',
      commonErrors: [
        {
          answer: 'monday',
          misconception: 'Skipping the cycle restart.',
          correctsTo: 'Sunday comes next. Saturday ends a week, and the NEXT week starts with Sunday. Cycle: Sun → Mon → Tue → Wed → Thu → Fri → Sat → Sun (next week).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Days: Sun, Mon, Tue, Wed, Thu, Fri, Sat. Then repeats.',
        '7 days = 1 week. 12 months = 1 year.',
        'Today, yesterday, tomorrow — relationship to "now".',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Some months have 30 days, others 31, and February usually has 28. Why is February different?',
      hint: 'Long history — Roman calendar reform. February was the LAST month for a long time. Leap years add a day every 4 years to fix the calendar.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
