/**
 * HS-core shared constants — applied across every high-school course plan
 * (Algebra 1, Geometry, Biology, Chemistry, …).
 *
 * Pacing starts as a copy of the AP/test-prep values (locked 2026-07-30).
 * HS students may want a gentler ramp — tune here, not per-plan.
 */

import type { LessonPlan } from '../types';

export const HS_PACING_THRESHOLDS: NonNullable<LessonPlan['pacingThresholds']> = {
  silentRampStreak: 2,
  explicitOfferStreak: 6,
  inverseStreak: 3,
  checkInMinTurns: 8,
  checkInCooldown: 6,
};

/** Locked source attribution for HS-core plans authored in-house. */
export const HS_SOURCE = {
  author: 'Evelyn Learning',
  org: 'Evelyn',
  license: 'proprietary',
} as const;
