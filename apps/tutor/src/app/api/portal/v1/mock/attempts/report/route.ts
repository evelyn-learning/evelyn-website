/**
 * GET /api/portal/v1/mock/attempts/report?studentId=&attemptId= — finalized
 * score report. FRQ grading runs inline on this poll (engine is self-hosted
 * Next, no serverless timeout) — while grading is in flight this responds
 * 202 {state:'grading'} and the caller polls again; first poll may take
 * ~1 min for a form with many free-response items.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { getReport } from '@/lib/tutor/mock-exam/report';
import { mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { defaultGradeDeps } from '@/lib/tutor/portal/grade-free-response';
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
    // M1c Task 5 (fix round 1) — `getReport`'s ownership check compares
    // this against `attempt.studentId`, which is the RESOLVED id (stamped
    // at attempt creation, mock/attempts/route.ts) — so this must resolve
    // to the same id or every report request gets `forbidden` once the
    // flag is on. `feedGapsAndMastery`'s own profile-store write (inside
    // `getReport`) then inherits this same resolved `attempt.studentId`
    // with no further resolution needed — see report.ts's comment there.
    const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
    const report = await getReport(mongoMockStores(), profileId, attemptId, {
      gradeDeps: defaultGradeDeps(),
    });
    if (report.status === 'grading') {
      return NextResponse.json({ state: 'grading' }, { status: 202 });
    }
    return NextResponse.json(stripNullsDeep(report));
  } catch (e) {
    return mapMockError(e);
  }
});
