/**
 * GET /api/portal/v1/mastery?studentId=&courseId= — per-LO mastery map.
 * courseId is accepted for parity with the contract; mastery is keyed by LO id
 * (not course), so the full map is returned.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { getOrCreateStudentProfile } from '@/lib/tutor/student-profile/store';

export const GET = withPortalAuth(async (req) => {
  const studentId = new URL(req.url).searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  const profile = await getOrCreateStudentProfile(studentId);
  return NextResponse.json(profile.mastery);
});
