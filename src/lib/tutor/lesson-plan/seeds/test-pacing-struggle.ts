/**
 * [TEST] Pacing v2 — struggle & easier-offer.
 *
 * Drives the incorrect-streak code path. Problems are intentionally
 * harder than a typical grade-6 student handles fluently — multi-step
 * weighted means, mixed-decimal totals — so a careful student often
 * gets the first attempt wrong. Each segment has 4 problems so an
 * incorrect-streak can build to 3 within ONE segment, crossing the
 * inverseStreak threshold (2) AND the explicit-offer-easier threshold
 * (inverseStreak + 1 = 3).
 *
 * Phase 1 expectation: server log shows
 *   [pacing] streak-incorrect seg=try-weighted count=1 → 2 → 3
 *   [pacing] streak-correct seg=try-weighted count=0 (was N) — when
 *     the student finally gets one right, correct increments and
 *     incorrect resets.
 *
 * Note: the test plan doesn't *force* wrong answers — the tester
 * deliberately gives wrong answers in the session script. The plan
 * only needs to provide enough problems for an incorrect-streak to
 * accumulate.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_PACING_STRUGGLE: LessonPlan = {
  id: 'evelyn.test.pacing.struggle.v1',
  title: '[TEST] Pacing v2 — struggle & easier-offer',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.pacing.weighted-mean',
      description: 'Compute weighted means and means with mixed-decimal data sets.',
    },
  ],
  prerequisites: ['evelyn.test.pacing.mean'],
  followUps: [],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the test plan: harder mean problems where wrong-streak signal can build.',
      script: 'These are tougher mean problems — weighted means and mixed decimals. Take your time.',
      estimatedMinutes: 1,
    },
    {
      id: 'worked-weighted',
      kind: 'worked_example',
      problem: 'Three students scored 80, 90, 100. The 100 counts double. Find the weighted mean.',
      steps: [
        'Weighted sum = 80 + 90 + 2×100 = 80 + 90 + 200 = 370.',
        'Weighted count = 1 + 1 + 2 = 4.',
        'Weighted mean = 370 / 4 = 92.5.',
      ],
      answer: '92.5',
      estimatedMinutes: 2,
    },
    {
      id: 'try-weighted-1',
      kind: 'try_yourself',
      problem: 'Quizzes 70, 80; midterm 90 counts double; final 100 counts triple. Find the weighted mean.',
      expectedAnswer: '90',
      responseFormat: 'numeric',
      hints: [
        'Weighted sum = 70 + 80 + 2×90 + 3×100 = 70 + 80 + 180 + 300 = 630.',
        'Weighted count = 1 + 1 + 2 + 3 = 7.',
        'Weighted mean = 630 / 7 = 90.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weighted-2',
      kind: 'try_yourself',
      problem: 'Three readings: 12.4, 18.7, 23.9. The third reading is twice as reliable, so it counts twice. Find the weighted mean.',
      expectedAnswer: '19.725',
      responseFormat: 'numeric',
      hints: [
        'Weighted sum = 12.4 + 18.7 + 2×23.9 = 12.4 + 18.7 + 47.8 = 78.9.',
        'Weighted count = 1 + 1 + 2 = 4.',
        'Weighted mean = 78.9 / 4 = 19.725.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weighted-3',
      kind: 'try_yourself',
      problem: 'Five participants: 4.5, 5.2, 6.8, 7.3, 8.1. Find the mean to two decimal places.',
      expectedAnswer: '6.38',
      responseFormat: 'numeric',
      hints: [
        'Sum = 4.5 + 5.2 + 6.8 + 7.3 + 8.1 = 31.9.',
        'Count = 5.',
        'Mean = 31.9 / 5 = 6.38.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-weighted-4',
      kind: 'try_yourself',
      problem: 'Test scores 78, 82, 91; homework average 88 counts double; final exam 73 counts triple. Find the weighted mean.',
      expectedAnswer: '80.75',
      responseFormat: 'numeric',
      hints: [
        'Weighted sum = 78 + 82 + 91 + 2×88 + 3×73 = 78 + 82 + 91 + 176 + 219 = 646.',
        'Weighted count = 1 + 1 + 1 + 2 + 3 = 8.',
        'Weighted mean = 646 / 8 = 80.75.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weighted mean: multiply each value by its weight, sum, then divide by sum of weights.',
        'Mixed-decimal sums: keep decimal alignment until the very last step.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
