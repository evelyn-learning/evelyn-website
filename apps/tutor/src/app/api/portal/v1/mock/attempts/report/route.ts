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

export const GET = withPortalAuth(async (req, auth) => {
  const u = new URL(req.url);
  const studentId = u.searchParams.get('studentId');
  const attemptId = u.searchParams.get('attemptId');
  if (!studentId || !attemptId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId and attemptId required' }, { status: 400 });
  }
  try {
    const report = await getReport(mongoMockStores(), studentId, attemptId, {
      gradeDeps: defaultGradeDeps(),
      partnerId: auth.partnerId,
    });
    if (report.status === 'grading') {
      return NextResponse.json({ state: 'grading' }, { status: 202 });
    }
    return NextResponse.json(stripNullsDeep(report));
  } catch (e) {
    return mapMockError(e);
  }
});
