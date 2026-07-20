/**
 * Test-prep shared constants — applied across every Digital SAT / ACT plan.
 *
 * Pacing intentionally matches AP_PACING_THRESHOLDS (locked 2026-07-19):
 * test-prep students are drilling for a high-stakes exam, same profile as AP.
 * Tune here, not per-plan.
 */

import type { LessonPlan } from '../types';

export const TESTPREP_PACING_THRESHOLDS: NonNullable<LessonPlan['pacingThresholds']> = {
  silentRampStreak: 2,
  explicitOfferStreak: 6,
  inverseStreak: 3,
  checkInMinTurns: 8,
  checkInCooldown: 6,
};

/** Locked source attribution for test-prep plans authored in-house. */
export const TESTPREP_SOURCE = {
  author: 'Evelyn Learning',
  org: 'Evelyn',
  license: 'proprietary',
} as const;
