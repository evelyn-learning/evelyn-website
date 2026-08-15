/**
 * TEST plan B — same LO as v1 (`test.gaps.fractions.lcd-add`), different
 * problem (1/3 + 1/4 instead of 1/4 + 1/6). Purpose: verify the
 * orchestrator-side cross-session promotion fallback in
 * `applyCrossSessionPromotion`.
 *
 * Why a separate plan with the same LO. When the brain re-encounters a
 * known gap on the SAME plan, it tends to read the situation as "we're
 * revisiting this on purpose, the misconception is the expected state"
 * and skips firing record_gap — which means cross-session promotion via
 * brain re-fire never trips. A different plan teaching the SAME LO
 * removes that meta-cue: the brain sees a fresh plan, fires record_gap
 * (or not, doesn't matter for this test), the orchestrator detects
 * sub-mastery on an LO with an existing open gap, and the fallback
 * promotes the gap to 'confirmed' deterministically.
 *
 * Test choreography:
 *   1. Use a fresh studentId (e.g. `test-gaps-002`).
 *   2. Session 1 on Plan A (`evelyn.test.gaps.fractions.v1`). Roleplay
 *      misconception ("Two over ten. You just add the tops and the
 *      bottoms"). Brain fires record_gap. Gap lands as 'candidate',
 *      sessions: 1.
 *   3. Session 2 on Plan B (this plan). Roleplay struggle and DON'T
 *      recover — keep producing wrong answers. Brain calls
 *      mark_segment_complete with masteryDelta < 0.5 (sub-mastery).
 *   4. The orchestrator-side fallback fires at commit-time, bumps
 *      sessionIds to length 2, promotes the gap to 'confirmed'.
 *   5. Verify on /tutor/dev/gaps?studentId=test-gaps-002:
 *      `status: confirmed`, `sessions: 2`.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_GAPS_FRACTIONS_V2: LessonPlan = {
  id: 'evelyn.test.gaps.fractions.v2',
  title: '[TEST] Gap-Detection Probe v2 — Fraction Addition (1/3 + 1/4)',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
      // SAME loId as Plan A — that's the whole point. Cross-session
      // promotion keys on (kind='lo', loId=...).
      id: 'test.gaps.fractions.lcd-add',
      description: 'Add two fractions with unlike denominators by rewriting them with a common denominator.',
      standard: 'CCSS.MATH.CONTENT.5.NF.A.1',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 5,
  segments: [
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute 1/3 + 1/4. Walk me through your reasoning.',
      expectedAnswer: '7/12',
      responseFormat: 'frq',
      hints: [
        'What is the smallest number both 3 and 4 divide into evenly?',
        'Once you have the common denominator, rewrite each fraction with it, then add the numerators.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-1',
      kind: 'misconception_check',
      question: 'A friend says "1/3 + 1/4 = 2/7 because we just add tops and bottoms." Where did they go wrong, and what is the right answer?',
      commonErrors: [
        {
          answer: '2/7',
          misconception: 'Adding numerators and denominators directly, ignoring that the pieces are different sizes.',
          correctsTo: 'Rewrite to a common denominator (12) first; only then add numerators. The denominator stays.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Different denominators mean different piece sizes — you must rewrite first.',
        'Common denominator: a number both denominators divide into evenly.',
        'After rewriting, add the numerators only — the denominator stays.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
