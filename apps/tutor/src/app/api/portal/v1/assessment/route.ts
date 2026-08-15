/**
 * POST /api/portal/v1/assessment — build a diagnostic calibration set.
 * Answer-stripped items across the requested LOs; no teaching scaffolding.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { AssessmentRequestSchema } from '@evelyn/portal-contract/v1';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = AssessmentRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const set = await buildAssessment(parsed.data, mongoPracticeSources());
  return NextResponse.json(set);
});
