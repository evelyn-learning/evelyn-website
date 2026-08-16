/**
 * GET /api/portal/v1/mock/attempts/review?studentId=&attemptId= — post-
 * completion answer-key review payload.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { getReview } from '@/lib/tutor/mock-exam/report';
import { mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';
import { mapMockError } from '@/lib/tutor/mock-exam/route-errors';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const GET = withPortalAuth(async (req, auth) => {
  const u = new URL(req.url);
  const studentId = u.searchParams.get('studentId');
  const attemptId = u.searchParams.get('attemptId');
  if (!studentId || !attemptId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId and attemptId required' }, { status: 400 });
  }
  try {
    // M1c Task 5 (fix round 1) — see report/route.ts's comment: must match
    // `attempt.studentId` (resolved at attempt creation) or the ownership
    // check throws `forbidden`.
    const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
    const result = await getReview(mongoMockStores(), profileId, attemptId);
    return NextResponse.json(stripNullsDeep(result));
  } catch (e) {
    return mapMockError(e);
  }
});
