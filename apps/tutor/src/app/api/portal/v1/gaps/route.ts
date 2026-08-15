/**
 * GET /api/portal/v1/gaps?studentId= — staleness-filtered gaps.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import {
  getOrCreateStudentProfile,
  isGapStale,
  resolveProfileIdOrRaw,
} from '@/lib/tutor/student-profile/store';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';

export const GET = withPortalAuth(async (req, auth) => {
  const studentId = new URL(req.url).searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  // M1c Task 5 — flag-gated identity resolution; see identityResolutionEnabled.
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
  const profile = await getOrCreateStudentProfile(profileId);
  const gaps = profile.gaps.filter((g) => !isGapStale(g));
  // Contract optionals are `.optional()` not `.nullable()` — strip null keys so
  // the portal parses (field absent), never 500s on a persisted null.
  return NextResponse.json(stripNullsDeep(gaps));
});
