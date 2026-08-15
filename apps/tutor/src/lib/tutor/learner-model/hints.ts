/**
 * Learner-hints module (Task 11, phase-c slice 3) — a compact ability-band
 * + gap-topic summary that runtime lesson generation (Task 12) and the
 * review-session composer (Task 14) read to steer content without either
 * of them having to know about Elo ratings or the student-profile gap
 * lifecycle directly.
 *
 * `getLearnerHints` must never fail its caller: on any error (DB down,
 * malformed profile, whatever) it falls back to the same neutral default
 * a brand-new student gets — generation should degrade to "no hints", not
 * throw. `bandForElo` is kept pure and exported on its own so callers that
 * already have an Elo rating in hand (e.g. from a batch read) can band it
 * without re-hitting the DB.
 */

import { getStudentElo } from './store';
import {
  getOrCreateStudentProfile,
  resolveProfileIdOrRaw,
} from '@/lib/tutor/student-profile/store';
import { TUNING } from './estimator';

export type AbilityBand = 'building' | 'steady' | 'strong';

export interface LearnerHints {
  band: AbilityBand;
  gapTopics: string[];
}

const DEFAULT_HINTS: LearnerHints = { band: 'steady', gapTopics: [] };

/** Pure. `null` (no rating yet) or a rating with too few games
 *  (`count < TUNING.hints.minEloCount`) both read as 'steady' — there
 *  isn't enough signal yet to call a student strong or building. Otherwise
 *  thresholds from `TUNING.hints` decide the band; anything strictly
 *  between them is 'steady'. */
export function bandForElo(elo: { rating: number; count: number } | null): AbilityBand {
  if (!elo || elo.count < TUNING.hints.minEloCount) return 'steady';
  if (elo.rating >= TUNING.hints.strongRating) return 'strong';
  if (elo.rating <= TUNING.hints.buildingRating) return 'building';
  return 'steady';
}

/** Ability band + confirmed-gap topic labels for one student. `trial:`-
 *  prefixed studentIds short-circuit to the neutral default before any
 *  await — demo/trial sessions carry no persistent learner-model or
 *  profile data to read. Everything else fetches the Elo rating and the
 *  student profile in parallel and reduces the profile's CONFIRMED gaps
 *  (candidates are single-observation and not trustworthy enough to steer
 *  generation) to their display labels, capped at `TUNING.hints.maxGapTopics`.
 *  Any failure along the way — DB unreachable, whatever — falls back to
 *  the same default a fresh student gets; hints must never fail the
 *  caller. */
export async function getLearnerHints(
  studentId: string,
  subject: string | undefined,
  /** M1c Task 5 (fix round 1, IMPORTANT 3) — the calling portal route's
   *  verified `auth.partnerId`. REQUIRED (not optional): an earlier draft
   *  made this optional with a `?? ''` fallback, and because the resolve
   *  call sat INSIDE the try/catch below, a caller that forgot to pass it
   *  didn't fail loud — it silently degraded every student to
   *  `{band:'steady', gapTopics:[]}`, indistinguishable from a normal DB
   *  hiccup. Making it required turns that into a compile error at every
   *  call site instead of a silent runtime degradation. */
  partnerId: string,
): Promise<LearnerHints> {
  if (studentId.startsWith('trial:')) return DEFAULT_HINTS;

  try {
    // M1c Task 5 (spec §4.1) — resolve ONCE; `getStudentElo` and the
    // profile-store read are one identity space (both keyed by the
    // resolved surrogate id, not the raw external one) — see
    // resolveProfileIdOrRaw's doc comment for why a resolution failure
    // degrades to the raw id here rather than throwing.
    const profileId = await resolveProfileIdOrRaw({ partnerId, externalStudentId: studentId });
    const [elo, profile] = await Promise.all([
      getStudentElo(profileId, subject),
      getOrCreateStudentProfile(profileId),
    ]);

    const gapTopics = profile.gaps
      .filter((g) => g.status === 'confirmed')
      .map((g) => g.conceptLabel ?? g.evidence?.observation.slice(0, 60) ?? '')
      .filter((label) => label.length > 0)
      .slice(0, TUNING.hints.maxGapTopics);

    return { band: bandForElo(elo), gapTopics };
  } catch {
    return DEFAULT_HINTS;
  }
}
