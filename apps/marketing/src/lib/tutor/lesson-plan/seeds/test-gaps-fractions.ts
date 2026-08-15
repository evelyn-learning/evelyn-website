/**
 * TEST plan — purpose-built for verifying the learning-gaps capture
 * pipeline (record_gap + flag_prerequisite_gap). NOT a teaching plan;
 * choreographed to elicit both kinds of gap firings inside ~5 minutes.
 *
 * Designed roleplay (see `project_learning_gaps_v1_shipped.md` test path):
 *   - Try-yourself segment → answer wrongly with the additive misconception
 *     ("2/10"), say you don't get it after the hint → expect record_gap
 *     to fire on the LO, status promotes to 'confirmed' on first session
 *     once 3+ signals stack.
 *   - Misconception-check segment → tutor will ask sub-step like "what's
 *     4 × 3?" — hesitate / give a wrong product → expect
 *     flag_prerequisite_gap to fire on a multiplication-fact concept
 *     (NOT in this plan's LOs).
 *
 * Identifying ID lets us filter logs / dev-page entries to this test only.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_GAPS_FRACTIONS: LessonPlan = {
  id: 'evelyn.test.gaps.fractions.v1',
  title: '[TEST] Gap-Detection Probe — Fraction Addition',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
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
      problem: 'Compute 1/4 + 1/6. Walk me through your reasoning.',
      expectedAnswer: '5/12',
      responseFormat: 'frq',
      hints: [
        'What is the smallest number both 4 and 6 divide into evenly?',
        'Once you have the common denominator, rewrite each fraction with it, then add the numerators.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-1',
      kind: 'misconception_check',
      question: 'A friend says "1/4 + 1/6 = 2/10 because we just add tops and bottoms." Where did they go wrong, and what is the right answer?',
      commonErrors: [
        {
          answer: '2/10',
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
