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

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = SaveMockResponsesRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const result = await saveResponses(mongoMockStores(), parsed.data);
    return NextResponse.json(stripNullsDeep(result));
  } catch (e) {
    return mapMockError(e);
  }
});
