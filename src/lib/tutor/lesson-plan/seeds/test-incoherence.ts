/**
 * TEST PLAN — Problem-injection incoherence (umbrella bug).
 *
 * Tagged Mathematics → College Intro → Intro Statistics so it surfaces
 * in the picker without polluting real subject content. NOT real
 * pedagogy — designed so a single ~5-min session triggers every
 * known incoherence failure mode in sequence:
 *
 *   1. Brain narration ↔ board card target mismatch (worked example
 *      with an authored "find the mean" target).
 *   2. Brain bypasses generate_problem in favor of advance_lesson +
 *      show_segment_card when student says "another one".
 *   3. Layer 4 relevance filter rejects the topically-distant
 *      try_yourself "bait" segment, returning null after the on-topic
 *      try-yourselfs are exhausted.
 *   4. Divergence guard kills legitimate topic-change show_problem
 *      when the brain emits new_page + show_problem in the same batch.
 *   5. advance_lesson("next") at end-of-plan fails silently — brain
 *      doesn't know and re-emits stale show_segment_card.
 *   6. After no_problem_available, brain re-renders an
 *      already-completed segment (silent dedup hit).
 *
 * Plan structure:
 *   - hook
 *   - worked-mean              (worked_example, target = "mean")
 *   - try-mean-1               (try_yourself, on-topic — relevance OK)
 *   - try-mean-2               (try_yourself, on-topic — relevance OK)
 *   - try-offtopic-bait        (try_yourself, off-topic — relevance FAIL)
 *
 * The off-topic bait at the end is intentional: when the student
 * exhausts the on-topic problems and asks for "another one", the
 * relevance filter MUST reject try-offtopic-bait (≥3 content-token
 * overlap with the anchor not satisfied), and the pipeline returns
 * null → brain receives no_problem_available.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_INCOHERENCE: LessonPlan = {
  id: 'evelyn.test.incoherence.v1',
  title: '[TEST] Problem-injection incoherence',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'test.incoherence',
      description: 'Trigger every known problem-injection incoherence failure mode in a single ~5-min session.',
      standard: 'TEST-INCOHERENCE',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 6,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'One-line setup so we advance fast.',
      script: 'A few quick mean problems coming up. Say "ready" when you want to begin.',
      estimatedMinutes: 1,
    },
    {
      id: 'worked-mean',
      kind: 'worked_example',
      problem: 'A class of 5 students scored 70, 75, 80, 85, 90 on an exam. Find the mean score.',
      steps: [
        'Sum the scores: 70 + 75 + 80 + 85 + 90 = 400.',
        'Divide by count: 400 / 5 = 80.',
      ],
      answer: '80',
      estimatedMinutes: 2,
    },
    {
      id: 'try-mean-1',
      kind: 'try_yourself',
      problem: 'Compute the mean of the dataset {2, 4, 6, 8, 10}.',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: [
        'Mean = sum / count.',
        'Sum the five numbers, then divide by 5.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'try-mean-2',
      kind: 'try_yourself',
      problem: 'Compute the mean of the dataset {12, 14, 16, 18, 20}.',
      expectedAnswer: '16',
      responseFormat: 'numeric',
      hints: [
        'Same approach.',
        '12 + 14 + 16 + 18 + 20 = 80. Divide by 5.',
      ],
      estimatedMinutes: 1,
    },
    {
      // Intentional bait. Off-topic — zero content-token overlap with
      // the worked-example or try-mean-* problems on (mean, dataset,
      // compute, etc.). The relevance filter MUST reject this when
      // the student exhausts the on-topic try-yourselfs and asks for
      // "another one". offTopic: true also blocks passive natural-flow
      // advance into this segment via advance_lesson + show_segment_card.
      id: 'try-offtopic-bait',
      kind: 'try_yourself',
      problem: 'What is the capital city of France?',
      expectedAnswer: 'Paris',
      responseFormat: 'free',
      hints: [
        'Largest city on the Seine.',
      ],
      offTopic: true,
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning (TEST)', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
