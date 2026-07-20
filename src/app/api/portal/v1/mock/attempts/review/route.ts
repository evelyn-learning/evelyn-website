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

export const GET = withPortalAuth(async (req) => {
  const u = new URL(req.url);
  const studentId = u.searchParams.get('studentId');
  const attemptId = u.searchParams.get('attemptId');
  if (!studentId || !attemptId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId and attemptId required' }, { status: 400 });
  }
  try {
    const result = await getReview(mongoMockStores(), studentId, attemptId);
    return NextResponse.json(stripNullsDeep(result));
  } catch (e) {
    return mapMockError(e);
  }
});
