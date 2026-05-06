/**
 * [TEST] Pacing v2 — boredom & ramp.
 *
 * Drives the correct-streak code path. Designed so a student answering
 * fluently can build streak >= 5 within the plan, crossing both the
 * silent-ramp threshold (3 for default grades, 4 for college) and the
 * explicit-offer threshold (4 / 6) without exhausting the plan first.
 *
 * Three try-yourself segments at progressively harder difficulty, each
 * with 4 problems so a streak can build inside ONE segment without
 * relying on cross-segment streak (Phase 1 streak refs reset on
 * segment change). Math: pure mean computation — easy to grade, easy
 * for any age.
 *
 * Phase 1 expectation: server log shows
 *   [pacing] streak-correct seg=try-easy count=1 → 2 → 3 → 4
 *   [pacing] segment-mastered seg=try-easy streakAtComplete>=2
 *   [pacing] streak-correct seg=try-medium count=1 (after segment change reset)
 *
 * No behavior change in Phase 1 (no advisory hints rendered, brain
 * doesn't ramp difficulty automatically).
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_PACING_BOREDOM: LessonPlan = {
  id: 'evelyn.test.pacing.boredom.v1',
  title: '[TEST] Pacing v2 — boredom & ramp',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.pacing.mean',
      description: 'Compute the arithmetic mean of a small data set.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the test plan: lots of mean problems, simple → harder, to test pacing signals.',
      script: 'We\'ll work through several mean problems today. Don\'t skip ahead — answer each one and we\'ll move through them.',
      estimatedMinutes: 1,
    },
    {
      id: 'worked-mean',
      kind: 'worked_example',
      problem: 'Find the mean of 70, 75, 80, 85, 90.',
      steps: [
        'Add: 70 + 75 + 80 + 85 + 90 = 400.',
        'Count: 5 numbers.',
        'Mean = 400 / 5 = 80.',
      ],
      answer: '80',
      estimatedMinutes: 2,
    },
    {
      id: 'try-easy-1',
      kind: 'try_yourself',
      problem: 'Find the mean of 2, 4, 6, 8, 10.',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: ['Sum = 30. Count = 5.', 'Mean = sum / count.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-easy-2',
      kind: 'try_yourself',
      problem: 'Find the mean of 4, 6, 8, 10, 12.',
      expectedAnswer: '8',
      responseFormat: 'numeric',
      hints: ['Sum = 40. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-easy-3',
      kind: 'try_yourself',
      problem: 'Find the mean of 1, 3, 5, 7, 9.',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: ['Sum = 25. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-easy-4',
      kind: 'try_yourself',
      problem: 'Find the mean of 5, 10, 15, 20, 25.',
      expectedAnswer: '15',
      responseFormat: 'numeric',
      hints: ['Sum = 75. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-medium-1',
      kind: 'try_yourself',
      problem: 'Find the mean of 12, 18, 24, 30, 36.',
      expectedAnswer: '24',
      responseFormat: 'numeric',
      hints: ['Sum = 120. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-medium-2',
      kind: 'try_yourself',
      problem: 'Find the mean of 14, 21, 28, 35, 42.',
      expectedAnswer: '28',
      responseFormat: 'numeric',
      hints: ['Sum = 140. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-medium-3',
      kind: 'try_yourself',
      problem: 'Find the mean of 22, 36, 48, 54, 60.',
      expectedAnswer: '44',
      responseFormat: 'numeric',
      hints: ['Sum = 220. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-medium-4',
      kind: 'try_yourself',
      problem: 'Find the mean of 16, 24, 32, 40, 48.',
      expectedAnswer: '32',
      responseFormat: 'numeric',
      hints: ['Sum = 160. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-hard-1',
      kind: 'try_yourself',
      problem: 'Find the mean of 1.2, 2.4, 3.6, 4.8, 6.0.',
      expectedAnswer: '3.6',
      responseFormat: 'numeric',
      hints: ['Sum = 18.0. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-hard-2',
      kind: 'try_yourself',
      problem: 'Find the mean of 0.5, 1.5, 2.5, 3.5, 4.5.',
      expectedAnswer: '2.5',
      responseFormat: 'numeric',
      hints: ['Sum = 12.5. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-hard-3',
      kind: 'try_yourself',
      problem: 'Find the mean of 17, 23, 41, 38, 26.',
      expectedAnswer: '29',
      responseFormat: 'numeric',
      hints: ['Sum = 145. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-hard-4',
      kind: 'try_yourself',
      problem: 'Find the mean of 13, 27, 31, 19, 35.',
      expectedAnswer: '25',
      responseFormat: 'numeric',
      hints: ['Sum = 125. Count = 5.'],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean = sum / count.',
        'When the count stays constant (5 here), only the sum changes between problems.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
