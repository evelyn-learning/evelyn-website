/**
 * POST /api/portal/v1/mock/attempts/responses — autosave student responses
 * for the currently open module.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { SaveMockResponsesRequestSchema } from '@evelyn/portal-contract/v1';
import { saveResponses, mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';
import { mapMockError } from '@/lib/tutor/mock-exam/route-errors';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = SaveMockResponsesRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  // M1c Task 5 (fix round 2, IMPORTANT D) — see mock/attempts/route.ts's
  // matching comment.
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  try {
    // M1c Task 5 (fix round 1) — see advance/route.ts's comment: must match
    // the id the attempt was created under, or the ownership guard rejects.
    const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: parsed.data.studentId });
    const result = await saveResponses(mongoMockStores(), { ...parsed.data, studentId: profileId });
    return NextResponse.json(stripNullsDeep(result));
  } catch (e) {
    return mapMockError(e);
  }
});
