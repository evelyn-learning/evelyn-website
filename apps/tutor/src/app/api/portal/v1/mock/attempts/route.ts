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

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = StartMockAttemptRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const state = await startOrResume(mongoMockStores(), parsed.data);
    return NextResponse.json(stripNullsDeep(state));
  } catch (e) {
    return mapMockError(e);
  }
});
