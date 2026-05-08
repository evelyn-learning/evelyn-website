/**
 * AP-shared constants — applied across every AP plan.
 *
 * These values are locked by the AP Plans Initiative (see
 * project_ap_plans_initiative.md memory). Tune by changing here, not
 * per-plan.
 */

import type { LessonPlan } from '../types';

/**
 * AP-wide pacing override.
 *
 * Senior-year AP students are explicitly preparing for a high-stakes exam.
 * They want to drill, not be paced out. Defaults are tuned for general
 * K-12 lessons; AP needs:
 *   - faster scaffolding escalation when stuck (lower silentRampStreak)
 *   - more drilling before offering a topic switch (higher explicitOfferStreak)
 *   - longer stay on hard problems (higher inverseStreak)
 *   - fewer interrupting check-ins (higher checkInMinTurns + cooldown)
 */
export const AP_PACING_THRESHOLDS: NonNullable<LessonPlan['pacingThresholds']> = {
  silentRampStreak: 2,
  explicitOfferStreak: 6,
  inverseStreak: 3,
  checkInMinTurns: 8,
  checkInCooldown: 6,
};

/** Locked source attribution for AP plans authored in-house. */
export const AP_SOURCE = {
  author: 'Evelyn Learning',
  org: 'Evelyn',
  license: 'proprietary',
} as const;
