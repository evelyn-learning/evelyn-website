/**
 * POST /api/portal/v1/grade — free-response grading (Phase 3(d)).
 * Rubric-bearing items score part-by-part; legacy expectedAnswer items use the
 * single-answer judge.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { GradeFreeResponseRequestSchema } from '@evelyn/portal-contract/v1';
import { gradeFreeResponse, defaultGradeDeps } from '@/lib/tutor/portal/grade-free-response';
import { resolveGradeItem } from '@/lib/tutor/portal/adapters';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = GradeFreeResponseRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const item = resolveGradeItem(parsed.data.itemId);
  if (!item) return NextResponse.json({ error: 'not_found', reason: 'unknown itemId' }, { status: 404 });
  const result = await gradeFreeResponse(parsed.data, item, defaultGradeDeps());
  return NextResponse.json(result);
});
