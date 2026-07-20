/**
 * GET /api/portal/v1/mock/forms?studentId=&topicId= — live mock forms for a
 * topic, each annotated with the caller's own attempt history.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { listForms, mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';
import { mapMockError } from '@/lib/tutor/mock-exam/route-errors';

export const GET = withPortalAuth(async (req) => {
  const u = new URL(req.url);
  const studentId = u.searchParams.get('studentId');
  const topicId = u.searchParams.get('topicId');
  if (!studentId || !topicId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId and topicId required' }, { status: 400 });
  }
  try {
    const result = await listForms(mongoMockStores(), studentId, topicId);
    return NextResponse.json(stripNullsDeep(result));
  } catch (e) {
    return mapMockError(e);
  }
});
