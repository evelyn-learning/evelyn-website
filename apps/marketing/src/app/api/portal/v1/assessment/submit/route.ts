/**
 * POST /api/portal/v1/assessment/submit — grade calibration responses and
 * commit a preliminary read (low-exposure mastery + candidate gaps) via the
 * normal SessionResult machinery. Idempotent on sessionId. Silent: returns
 * pedagogical state to the portal only, no student-facing score.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { AssessmentSubmissionSchema } from '@evelyn/portal-contract/v1';
import { submitAssessment } from '@/lib/tutor/portal/assessment';
import { defaultGradeDeps } from '@/lib/tutor/portal/grade-free-response';
import { resolveAssessmentItem } from '@/lib/tutor/portal/adapters';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = AssessmentSubmissionSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const result = await submitAssessment(parsed.data, defaultGradeDeps(), resolveAssessmentItem, auth.partnerId);
  return NextResponse.json(stripNullsDeep(result));
});
