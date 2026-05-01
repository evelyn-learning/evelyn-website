/**
 * TEST PLAN — Bug 3 server-only tool dispatch (generate_problem).
 *
 * Tagged Mathematics → College Intro → Intro Statistics. Designed so
 * the student can ask "another one" after a relevant try_yourself,
 * the brain emits generate_problem, the pipeline lands on Layer 4
 * with a topically-relevant authored try_yourself, the brain quotes
 * canonicalText verbatim, and a follow-up show_problem renders on a
 * fresh page. Validates that:
 *   - The orchestrator's server-only-tool short-circuit fires (no
 *     "unmapped tool call" warning, no stuck gate).
 *   - The TTS gate opens cleanly so the brain's bridge utterance
 *     ("Sure, here's another one for you.") audibly precedes the
 *     pipeline result.
 *   - The follow-up show_problem with canonicalText renders and the
 *     new_page navigates correctly.
 *
 * Repro flow:
 *   1. Pick this plan. Hit "Start Voice Session".
 *   2. Say "ready" → advance through hook → first try_yourself
 *      (compute mean of {3, 5, 7, 9, 11}). Submit "7" — correct.
 *   3. Brain marks segment complete + advances or stays. Say "give me
 *      one more example like that".
 *   4. Brain emits generate_problem with anchor = "compute mean of
 *      {3, 5, 7, 9, 11}". Pipeline Layer 4 finds the SECOND authored
 *      try_yourself (compute mean of {10, 20, 30, 40, 50}) — high
 *      content-token overlap (compute, mean, dataset, etc.).
 *   5. Brain receives canonicalText, speaks bridge utterance, calls
 *      new_page + show_problem with verbatim canonical text.
 *   6. Verify the new page renders the second mean problem (NOT a
 *      duplicate of the first, NOT the brain's invention).
 *
 * Telemetry to look for:
 *   - server log: [generate-problem] telemetry: layerReached=4,
 *                 provenance='plan-authored'
 *   - debug events: 'server_only_tool: generate_problem',
 *                   transitional bridge sentence audible.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_BUG3_SERVER_ONLY_TOOL: LessonPlan = {
  id: 'evelyn.test.bug3.server-only-tool.v1',
  title: '[TEST] Bug 3 — generate_problem server-only dispatch',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'intro-statistics',
  locale: 'en',
  los: [
    {
      id: 'test.bug3.server-only',
      description: 'Validate generate_problem dispatches as a server-only tool (no unmapped warning, gate opens, follow-up show_problem renders).',
      standard: 'TEST-BUG3',
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
      script: 'Two quick mean problems. Say "ready" to begin.',
      estimatedMinutes: 1,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute the mean of the dataset {3, 5, 7, 9, 11}.',
      expectedAnswer: '7',
      responseFormat: 'numeric',
      hints: [
        'Mean = sum of values / count of values.',
        'Sum the five numbers, then divide by 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      // Topically RELEVANT to try-1 — high content-token overlap on
      // (compute, mean, dataset). When student says "another one" after
      // try-1, Layer 4 should pick this segment (relevance filter
      // passes) and the brain quotes canonicalText verbatim.
      id: 'try-2',
      kind: 'try_yourself',
      problem: 'Compute the mean of the dataset {10, 20, 30, 40, 50}.',
      expectedAnswer: '30',
      responseFormat: 'numeric',
      hints: [
        'Same approach as before: sum / count.',
        '10 + 20 + 30 + 40 + 50 = 150. Divide by 5.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning (TEST)', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
