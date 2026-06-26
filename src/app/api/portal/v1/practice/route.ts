/**
 * POST /api/portal/v1/practice — gap-targeted practice retrieval (Phase 3(c)).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { RetrievePracticeRequestSchema } from '@/lib/portal-contract/v1';
import { retrievePractice } from '@/lib/tutor/portal/practice';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = RetrievePracticeRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const result = await retrievePractice(parsed.data, mongoPracticeSources());
  return NextResponse.json(result);
});
