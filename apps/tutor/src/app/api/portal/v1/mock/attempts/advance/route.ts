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

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = AdvanceMockAttemptRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const state = await advance(mongoMockStores(), parsed.data);
    return NextResponse.json(stripNullsDeep(state));
  } catch (e) {
    return mapMockError(e);
  }
});
