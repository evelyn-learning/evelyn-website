/**
 * TEST PLAN — Bug 1 query-target divergence guard.
 *
 * Tagged Mathematics → College Intro → Intro Statistics so it surfaces
 * in the picker without polluting real subject areas. NOT real
 * pedagogy — designed to trigger the divergence guard quickly.
 *
 * Repro flow:
 *   1. Pick this plan in the demo. Hit "Start Voice Session".
 *   2. Say "ready" / "go" / "yes" twice to advance through the brief
 *      hook + concept.
 *   3. The brain enters the worked_example segment whose authored
 *      problem asks "Find the MEAN".
 *   4. Brain SHOULD render the authored card via show_segment_card and
 *      narrate "find the mean."
 *   5. If the brain instead emits show_problem with a different query
 *      target ("Find the median", "Find the variance", etc.), the
 *      query-target divergence guard fires:
 *        - debug event: 'show_problem_target_divergence'
 *        - rejection feedback to brain naming both targets
 *        - 1 retry; brain re-narrates with the authored target.
 *
 * To force the divergence in testing: just before "ready", tell the
 * brain "show me a problem about the median for these numbers" — most
 * brains will improvise a "Find the median" show_problem instead of
 * using the authored "Find the mean" segment_card.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_BUG1_QUERY_TARGET_DIVERGENCE: LessonPlan = {
  id: 'evelyn.test.bug1.query-target-divergence.v1',
  title: '[TEST] Bug 1 — query-target divergence guard',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'test.bug1.divergence',
      description: 'Trigger the show_problem query-target divergence guard for the authored worked_example whose target is "mean".',
      standard: 'TEST-BUG1',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 4,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'One-line setup so we can advance fast.',
      script: 'We\'ll do one quick statistics problem about the mean. Say "ready" when you want to begin.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mean',
      kind: 'concept',
      goal: 'Define mean.',
      keyIdeas: [
        'MEAN = sum of values divided by count of values.',
        'For a small dataset like {2, 4, 6, 8, 10}, mean = (2+4+6+8+10)/5 = 6.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'worked-mean',
      kind: 'worked_example',
      problem: 'A class of 5 students scored 70, 75, 80, 85, 90 on an exam. Find the mean score.',
      steps: [
        'Sum the scores: 70 + 75 + 80 + 85 + 90 = 400.',
        'Divide by count of values: 400 / 5 = 80.',
      ],
      answer: '80',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning (TEST)', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
