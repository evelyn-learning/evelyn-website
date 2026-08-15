/**
 * G1 — Telling time to the hour.
 *
 * Reading an analog clock when the minute hand is on 12. Foundation
 * for half-hour, then quarter-hour, then five-minute intervals.
 */

import type { LessonPlan } from '../types';

export const SEED_G1_MATH_TIME_TO_HOUR: LessonPlan = {
  id: 'evelyn.g1.math.measurement.time-hour.v1',
  title: 'Telling time to the hour',
  curriculum: 'CCSS',
  grade: '1',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.1.md.b.3',
      description: 'Tell and write time in hours and half-hours using analog and digital clocks.',
      standard: 'CCSS.MATH.CONTENT.1.MD.B.3',
    },
  ],
  prerequisites: ['ccss.math.k.cc.b.4'],
  followUps: ['ccss.math.2.md.c.7'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect clock-reading to a real moment in the student\'s day.',
      script: 'When does school start where you live? Maybe 8 o\'clock? Today we\'ll learn how to read that on a clock.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-hands',
      kind: 'concept',
      goal: 'A clock has two hands; the SHORT one points to the hour, the LONG one to the minute.',
      keyIdeas: [
        'A clock has 12 numbers in a circle, 1 through 12.',
        'The SHORT hand is the HOUR hand.',
        'The LONG hand is the MINUTE hand.',
        'When the LONG hand points to 12, the time is ON THE HOUR — like 3 o\'clock.',
        'To read it: find the number the SHORT hand points to. That\'s the hour.',
      ],
      vocabulary: [
        { term: 'hour hand', definition: 'the short hand on a clock — tells you the hour.' },
        { term: 'minute hand', definition: 'the long hand on a clock — tells you the minutes.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-three-oclock',
      kind: 'worked_example',
      problem: 'A clock has the short hand on 3 and the long hand on 12. What time is it?',
      steps: [
        'Long hand on 12 → it\'s ON THE HOUR.',
        'Short hand on 3 → the hour is 3.',
        'So the time is 3 o\'clock — written 3:00 on a digital clock.',
      ],
      answer: '3:00',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Short hand on 7, long hand on 12. What time is it?',
      expectedAnswer: '7:00',
      responseFormat: 'free',
      hints: [
        'Long hand on 12 means it\'s o\'clock.',
        'Just read the number the short hand points to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-which-hand',
      kind: 'misconception_check',
      question: 'A clock shows the LONG hand on 5 and the SHORT hand on 12. Is the time 5 o\'clock?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reading the LONG hand as the hour.',
          correctsTo: 'No — the SHORT hand tells the hour. With the long hand on 5, it\'s NOT on the hour. The short hand on 12 means the hour is 12.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SHORT hand = hour. LONG hand = minutes.',
        'When the long hand is on 12, the time is exactly o\'clock.',
        'Just read the number the short hand points to for the hour.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If the long hand moves all the way around once, how long has passed — 1 minute, 1 hour, or 1 day?',
      hint: 'Think about how the hour hand barely moves while the minute hand goes all the way around.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
