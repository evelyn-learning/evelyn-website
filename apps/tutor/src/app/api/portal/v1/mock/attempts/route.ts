/**
 * POST /api/portal/v1/mock/attempts — start a new mock attempt or resume the
 * caller's in-flight one.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { StartMockAttemptRequestSchema } from '@evelyn/portal-contract/v1';
import { startOrResume, mongoMockStores } from '@/lib/tutor/mock-exam/service';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';
import { mapMockError } from '@/lib/tutor/mock-exam/route-errors';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = StartMockAttemptRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  // M1c Task 5 (fix round 2, IMPORTANT D) — StartMockAttemptRequestSchema
  // declares `studentId: z.string()` with no `.min(1)`; reject `""` here
  // with a clean 400 — mapMockError below would otherwise turn
  // resolveProfileIdOrRaw's now-loud ProfileIdentityError into an
  // unhelpful logged 500 (no table entry for that message).
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  try {
    // M1c Task 5 (fix round 1, CRITICAL 2) — resolve once and stamp the
    // resolved id onto the request the service layer sees, so the
    // MockAttempt it creates/finds is keyed the same way as the profile,
    // evidence, and every other student-keyed store (spec §4.1).
    // `MockAttemptState` (the response) carries no `studentId` field, so
    // there is no raw-id echo to preserve here (contrast session-result.ts).
    const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: parsed.data.studentId });
    const state = await startOrResume(mongoMockStores(), { ...parsed.data, studentId: profileId });
    return NextResponse.json(stripNullsDeep(state));
  } catch (e) {
    return mapMockError(e);
  }
});
