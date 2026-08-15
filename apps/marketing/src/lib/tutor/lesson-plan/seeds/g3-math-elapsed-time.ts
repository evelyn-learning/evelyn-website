/**
 * G3 — Elapsed time word problems.
 *
 * Calculating duration between two clock times. Counting up,
 * counting back, jumping by hours and minutes.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_ELAPSED_TIME: LessonPlan = {
  id: 'evelyn.g3.math.measurement.elapsed-time.v1',
  title: 'Elapsed time word problems',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.md.a.1',
      description: 'Tell and write time to the nearest minute and measure time intervals in minutes.',
      standard: 'CCSS.MATH.CONTENT.3.MD.A.1',
    },
  ],
  prerequisites: ['ccss.math.2.md.c.7'],
  followUps: ['ccss.math.4.md.a.2'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make elapsed time concrete with a daily routine.',
      script: 'School ends at 3:00. You have soccer practice at 4:30. How long do you have between? That\'s elapsed time — finding the gap between two times.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-counting-up',
      kind: 'concept',
      goal: 'Count up by jumps from start time to end time.',
      keyIdeas: [
        'ELAPSED TIME = how much time PASSES between a start and an end.',
        'COUNT-UP STRATEGY: start at the START time, jump in friendly chunks (hours, then minutes) until you reach the END time. Add up all your jumps.',
        'EXAMPLE: from 3:00 to 4:30. Jump 1 hour → 4:00. Jump 30 min → 4:30. Total = 1 hour 30 min.',
        'JUMPING ACROSS THE HOUR: from 8:45 to 9:20. First jump to the next hour: 8:45 → 9:00 = 15 min. Then 9:00 → 9:20 = 20 min. Total = 35 min.',
        'TIME does NOT use base-10. 60 minutes = 1 hour. So 30 + 30 = 60 min = 1 hour, NOT 60 min as a separate value.',
      ],
      vocabulary: [
        { term: 'elapsed time', definition: 'the amount of time between a start and an end.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-school-soccer',
      kind: 'worked_example',
      problem: 'School ends at 3:00 PM. Soccer starts at 4:30 PM. How much time elapsed?',
      steps: [
        'Start: 3:00. End: 4:30.',
        'Jump 1 hour: 3:00 → 4:00. (60 min so far.)',
        'Jump 30 minutes: 4:00 → 4:30.',
        'Total: 1 hour + 30 minutes = 1 hour 30 minutes (or 90 minutes).',
      ],
      answer: '1 hour 30 minutes',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-cross-hour',
      kind: 'worked_example',
      problem: 'Lily starts homework at 5:45 PM and finishes at 6:20 PM. How long did she spend?',
      steps: [
        'Start: 5:45. End: 6:20.',
        'First, jump up to the next hour: 5:45 → 6:00 = 15 minutes.',
        'Then continue: 6:00 → 6:20 = 20 minutes.',
        'Total: 15 + 20 = 35 minutes.',
      ],
      answer: '35 minutes',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A movie starts at 1:15 PM and ends at 3:00 PM. How long was the movie?',
      expectedAnswer: '1 hour 45 minutes',
      responseFormat: 'free',
      hints: [
        'Jump first to the next hour: 1:15 → 2:00 = 45 minutes.',
        'Then jump to the end time: 2:00 → 3:00 = 1 hour.',
        'Add them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subtract-digits',
      kind: 'misconception_check',
      question: 'For elapsed time from 3:00 to 4:30, can I just subtract: 4:30 − 3:00 = 1:30?',
      commonErrors: [
        {
          answer: 'no',
          misconception: 'Treating the colon as something you can\'t subtract across.',
          correctsTo: 'For SIMPLE clean times you actually CAN subtract: 4:30 − 3:00 = 1 hour 30 min. But it BREAKS for cross-hour jumps like 6:20 − 5:45. There you\'d get "1:-25" which doesn\'t make sense. The count-up strategy works for any pair.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Elapsed time = end − start (sort of — but be careful crossing hours).',
        'COUNT-UP method: jump to the next hour first, then complete to the end.',
        '60 minutes = 1 hour. Time isn\'t base-10.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A baker started bread at 6:30 AM. It baked for 1 hour 45 minutes. What time did it finish?',
      hint: 'Add 1 hour: 6:30 → 7:30. Add 45 min: 7:30 → 8:15.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
