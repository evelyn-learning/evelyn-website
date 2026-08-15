/**
 * POST /api/portal/v1/review-plan — one-tap review / post-mock remediation
 * plan (Task 15, phase-c).
 *
 * Thin route wrapper around `composeReviewPlan` (Task 14): the portal
 * supplies a studentId and up to 8 portal-scoped LOs (the learner-state
 * projection's weakest ones, or a mock's missed LOs); the composer orders
 * them weakest-first, caps to the session's time budget, and builds a
 * recall+try-heavy review plan via the Stage-2 expander. Unlike
 * `plan-generate/route.ts`, there is no fallback-plan path here — the
 * composer's LOs are already known (no Stage 1 to fail into a stub), so an
 * expander failure is a genuine 502: the portal has its own "couldn't build
 * a review session right now" fallback for that case.
 *
 * Response `los` are the ENGINE's own LO records off the composed plan
 * (`shortTitle ?? description`), not an echo of the portal-sent titles —
 * the plan may drop LOs the time budget couldn't fit, and per-LO titles can
 * legitimately differ from what the portal passed in.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { composeReviewPlan } from '@/lib/tutor/lesson-plan/compose-review-plan';
import { ReviewPlanRequestSchema, ReviewPlanResponseSchema } from '@evelyn/portal-contract/v1';

export const runtime = 'nodejs';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = ReviewPlanRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const plan = await composeReviewPlan({ ...parsed.data, partnerId: auth.partnerId });
    return NextResponse.json(
      ReviewPlanResponseSchema.parse({
        planId: plan.id,
        title: plan.title,
        los: plan.los.map((lo) => ({ id: lo.id, title: lo.shortTitle ?? lo.description })),
        estimatedMinutes: plan.estimatedMinutes,
      }),
    );
  } catch (err) {
    console.error('[review-plan]', err);
    return NextResponse.json({ error: 'compose_failed' }, { status: 502 });
  }
});
