/**
 * GET /api/portal/v1/mastery?studentId=&courseId= — per-LO mastery map.
 * courseId is accepted for parity with the contract; mastery is keyed by LO id
 * (not course), so the full map is returned.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import {
  getOrCreateStudentProfile,
  resolveProfileIdOrRaw,
} from '@/lib/tutor/student-profile/store';

export const GET = withPortalAuth(async (req, auth) => {
  const studentId = new URL(req.url).searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  // M1c Task 5 — flag-gated identity resolution; see identityResolutionEnabled.
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
  const profile = await getOrCreateStudentProfile(profileId);
  return NextResponse.json(profile.mastery);
});
