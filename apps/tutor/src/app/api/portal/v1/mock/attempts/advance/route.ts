/**
 * POST /api/portal/v1/mock/attempts/advance — advance the attempt one step
 * (student Next / module-review confirm / a client-noticed deadline).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { AdvanceMockAttemptRequestSchema } from '@evelyn/portal-contract/v1';
import { advance, mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';
import { mapMockError } from '@/lib/tutor/mock-exam/route-errors';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = AdvanceMockAttemptRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  // M1c Task 5 (fix round 2, IMPORTANT D) — see mock/attempts/route.ts's
  // matching comment.
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  try {
    // M1c Task 5 (fix round 1) — resolve to the SAME id the attempt was
    // created under (mock/attempts/route.ts), or `advance`'s ownership
    // guard (`attempt.studentId !== req.studentId`) would reject every
    // request once the flag is on.
    const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: parsed.data.studentId });
    const state = await advance(mongoMockStores(), { ...parsed.data, studentId: profileId });
    return NextResponse.json(stripNullsDeep(state));
  } catch (e) {
    return mapMockError(e);
  }
});
