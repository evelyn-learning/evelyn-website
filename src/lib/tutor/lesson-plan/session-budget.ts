/**
 * Session-time budget arithmetic.
 *
 * Given a total session time T (minutes), compute how many learning
 * objectives fit comfortably. Used by /api/tutor/plan-from-text to
 * decide whether to expand all generated LOs upfront (Y ≤ X) or hand
 * the LO list to the brain as a picker (Y > X).
 *
 * Tuning targets per-LO minutes by grade band — younger students need
 * more scaffolding, older students cover ground faster. These are
 * rough averages of the existing curated-plan estimatedMinutes /
 * los.length ratios; refine when real session timing data exists.
 *
 * Generic by design — no subject-specific multipliers.
 */

/** Default total session time in minutes when the caller doesn't
 *  specify one. Matches the demo UI's "30:00" hard stop. */
export const DEFAULT_SESSION_MINUTES = 30;

/** Hard ceiling — a partner can't request more than this no matter
 *  what they pass in the embed JWT. */
export const MAX_SESSION_MINUTES = 120;

/** Reserved minutes for intro + recap segments that are NOT per-LO
 *  teaching. Subtracted from T before computing the LO budget. */
const NON_LO_OVERHEAD_MINUTES = 4;

/** Per-grade-band approximate minutes per LO, averaged across the
 *  existing curated-plan catalog. Returns a fallback for unknown
 *  bands. */
export function minutesPerLOForGrade(grade: string): number {
  const g = (grade ?? '').trim().toLowerCase();
  if (g === 'k' || g === 'k-2' || g === '1' || g === '2') return 8;
  if (g === '3' || g === '4' || g === '5' || g === '3-5') return 7;
  if (g === '6' || g === '7' || g === '8' || g === '6-8') return 6;
  if (g === '9' || g === '10' || g === '9-10') return 5;
  if (g === '11' || g === '12' || g === '11-12' || g === '9-12') return 5;
  if (g === 'ap' || g === 'college' || g === 'sat-act' || g === 'iitjee' || g === 'graduate' || g === 'nursing') return 5;
  return 6; // safe fallback
}

/** Compute the maximum number of LOs that fit in T minutes for the
 *  given grade band. Floor at 1 — even with a tiny T we want to
 *  attempt at least one LO. */
export function maxLOsForBudget(opts: { sessionMinutes: number; grade: string }): number {
  const T = Math.max(1, Math.min(MAX_SESSION_MINUTES, opts.sessionMinutes));
  const perLO = minutesPerLOForGrade(opts.grade);
  const teachingMinutes = Math.max(perLO, T - NON_LO_OVERHEAD_MINUTES);
  return Math.max(1, Math.floor(teachingMinutes / perLO));
}

/** Clamp a partner-supplied session-time request to [1, MAX]. */
export function clampSessionMinutes(requested: number | undefined): number {
  if (typeof requested !== 'number' || !Number.isFinite(requested)) {
    return DEFAULT_SESSION_MINUTES;
  }
  return Math.max(1, Math.min(MAX_SESSION_MINUTES, Math.floor(requested)));
}
