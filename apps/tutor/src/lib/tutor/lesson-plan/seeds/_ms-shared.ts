/**
 * MS-core shared constants — applied across every middle-school course plan
 * (Grade 7 Math, Grade 7 ELA, Grade 7 Science, Grade 7 World Geography).
 *
 * PACING IS A PLACEHOLDER, NOT A DECISION. These values start as a copy of
 * the HS thresholds, which themselves started as a copy of the AP/test-prep
 * values. A twelve-year-old should almost certainly get a gentler ramp and a
 * more patient check-in cadence than an AP student — tune HERE, once, never
 * per-plan, and never by editing HS_PACING_THRESHOLDS (the two bands must be
 * able to diverge).
 */

import type { LessonPlan } from '../types';

export const MS_PACING_THRESHOLDS: NonNullable<LessonPlan['pacingThresholds']> = {
  silentRampStreak: 2,
  explicitOfferStreak: 6,
  inverseStreak: 3,
  checkInMinTurns: 8,
  checkInCooldown: 6,
};

/** Locked source attribution for MS-core plans authored in-house. */
export const MS_SOURCE = {
  author: 'Evelyn Learning',
  org: 'Evelyn',
  license: 'proprietary',
} as const;
