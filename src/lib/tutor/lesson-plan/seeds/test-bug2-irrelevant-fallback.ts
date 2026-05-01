/**
 * TEST PLAN — Bug 2 Layer 4 relevance filter.
 *
 * Tagged Mathematics → College Intro → Intro Statistics. Designed so
 * the only authored try_yourself is TOPICALLY DISTANT from the
 * worked_example anchor — when the student asks "another one" after
 * the worked_example, the planAuthoredFallback's relevance filter
 * should reject the irrelevant try_yourself and the pipeline should
 * return null, prompting the brain to apologize + ask the student
 * what they want next (per the system prompt rule).
 *
 * Repro flow:
 *   1. Pick this plan. Hit "Start Voice Session".
 *   2. Say "ready" → advance through hook → worked_example.
 *   3. Worked example: "Find the standard deviation of {2,4,4,4,5,5,7,9}".
 *      The brain walks through it, gets the answer ~2.0.
 *   4. Say "give me one more example".
 *   5. Brain emits generate_problem with anchor = worked_example
 *      statement. Pipeline:
 *        - Layer 1 (bank): ap-statistics topic, no bank entries → null.
 *        - Layer 2 (brain-gen): stub, returns null.
 *        - Layer 3 (bank fallback): null.
 *        - Layer 4 (plan-authored): the only try_yourself in this plan
 *          is "What was the population of Tokyo in 2020?" — totally
 *          unrelated to standard deviation. Token overlap with the
 *          anchor is < 3 → filter rejects → returns null.
 *   6. API returns { error: 'no_problem_available' }.
 *   7. Brain follows system prompt: apologizes briefly + offers to
 *      advance OR asks what student wants. Does NOT emit a free-form
 *      show_problem of its own.
 *
 * Verify telemetry log: should show
 *   layerReached: 4, provenance: 'plan-authored' (when filter passes)
 *   OR a no_problem_available error (when filter rejects).
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_BUG2_IRRELEVANT_FALLBACK: LessonPlan = {
  id: 'evelyn.test.bug2.irrelevant-fallback.v1',
  title: '[TEST] Bug 2 — Layer 4 relevance filter',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'test.bug2.irrelevant',
      description: 'Trigger the planAuthoredFallback relevance filter via a topically-distant try_yourself in the same plan.',
      standard: 'TEST-BUG2',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 5,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'One-line setup.',
      script: 'We\'ll work through a standard deviation problem. Say "ready" when you want to begin.',
      estimatedMinutes: 1,
    },
    {
      id: 'worked-stddev',
      kind: 'worked_example',
      problem: 'Compute the standard deviation of the dataset {2, 4, 4, 4, 5, 5, 7, 9}.',
      steps: [
        'Mean = (2+4+4+4+5+5+7+9)/8 = 40/8 = 5.',
        'Squared deviations from mean: (2-5)²=9, (4-5)²=1 (×3), (5-5)²=0 (×2), (7-5)²=4, (9-5)²=16. Sum = 9+1+1+1+0+0+4+16 = 32.',
        'Variance (population) = 32 / 8 = 4. Standard deviation = √4 = 2.',
      ],
      answer: '2',
      estimatedMinutes: 2,
    },
    {
      // Intentionally OFF-TOPIC try_yourself — this is the bait. The
      // relevance filter should reject this fallback when the anchor
      // is the standard-deviation problem above (zero content-token
      // overlap on standard / deviation / dataset / mean).
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What was the approximate population of Tokyo, Japan in 2020? (Round to the nearest million.)',
      expectedAnswer: '14 million',
      responseFormat: 'numeric',
      hints: [
        'Tokyo is one of the largest cities in the world.',
        'Greater Tokyo Area is around 37 million; the city proper is smaller.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning (TEST)', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
