/**
 * Phase 3(b) — mastery-based resolution for PREREQUISITE gaps.
 *
 * Mirrors `resolveSettledGaps` (which handles `kind:'lo'` gaps keyed by
 * `loId`), but for `kind:'prerequisite'` gaps keyed by `conceptId`. A prereq
 * gap resolves once its canonical concept's mastery is sustained
 * (score ≥ threshold AND exposures ≥ threshold) — using the SAME thresholds
 * as the LO path (imported, single source of truth).
 *
 * Requires `conceptId` to be populated (by the async normalizer) AND a
 * mastery entry keyed by that conceptId. Until both exist the gap is left
 * untouched.
 *
 * Reversibility: handled by the existing `recordGap` resolved-match reopen
 * path — when the brain re-fires the same concept, the resolved gap reverts
 * to 'candidate' (preserving id + conceptId). No extra code needed here.
 *
 * Pure function — no I/O. Intended to run at session end alongside
 * `resolveSettledGaps`.
 */

import type { StudentProfile } from '@/lib/tutor/student-profile/types';
import {
  GAP_RESOLVE_SCORE_THRESHOLD,
  GAP_RESOLVE_EXPOSURES_THRESHOLD,
} from '@/lib/tutor/student-profile/store';

export function resolveSettledPrereqGaps(profile: StudentProfile): StudentProfile {
  const now = new Date().toISOString();
  let mutated = false;
  const gaps = profile.gaps.map((g) => {
    if (g.kind !== 'prerequisite') return g;
    if (!g.conceptId) return g; // needs the normalizer to have canonicalized it
    if (g.status === 'resolved') return g;
    const m = profile.mastery[g.conceptId];
    if (!m) return g;
    if (m.score < GAP_RESOLVE_SCORE_THRESHOLD) return g;
    if (m.exposures < GAP_RESOLVE_EXPOSURES_THRESHOLD) return g;
    mutated = true;
    return { ...g, status: 'resolved' as const, lastSeenAt: now };
  });
  return mutated ? { ...profile, gaps } : profile;
}
