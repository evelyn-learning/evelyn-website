/**
 * GET /api/portal/v1/gaps?studentId= — staleness-filtered gaps.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { getOrCreateStudentProfile, isGapStale } from '@/lib/tutor/student-profile/store';

export const GET = withPortalAuth(async (req) => {
  const studentId = new URL(req.url).searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  const profile = await getOrCreateStudentProfile(studentId);
  const gaps = profile.gaps.filter((g) => !isGapStale(g));
  return NextResponse.json(gaps);
});
