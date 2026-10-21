/**
 * POST /api/portal/v1/homework-build  { planId, first? } -> 202 { started }
 * GET  /api/portal/v1/homework-build?planId= -> build progress (no answer keys)
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { homeworkProblemsOf } from '@/lib/tutor/lesson-plan/homework';
import { getHomeworkBuild } from '@/lib/tutor/homework-build/store';
import { buildStatusResponse } from '@/lib/tutor/homework-build/status';
import { kickHomeworkBuild, BUILD_STALE_MS } from '@/lib/tutor/homework-build/runner';

export const POST = withPortalAuth(async (req, auth) => {
  let body: { planId?: unknown; first?: unknown } = {};
  try { body = await req.json(); } catch { /* handled below */ }
  if (typeof body.planId !== 'string' || !body.planId) {
    return NextResponse.json({ error: 'bad_request', reason: 'planId required' }, { status: 400 });
  }
  const plan = await getLessonPlan(body.planId);
  if (!plan || !homeworkProblemsOf(plan) || plan.metadata?.portalPartnerId !== auth.partnerId) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const existing = await getHomeworkBuild(body.planId);
  const first = typeof body.first === 'number' ? body.first : undefined;
  const started = existing?.done ? false : kickHomeworkBuild(body.planId, auth.partnerId, { first });
  return NextResponse.json({ started }, { status: 202 });
});

export const GET = withPortalAuth(async (req, auth) => {
  const planId = new URL(req.url).searchParams.get('planId');
  if (!planId) return NextResponse.json({ error: 'bad_request', reason: 'planId required' }, { status: 400 });
  const build = await getHomeworkBuild(planId);
  if (!build || build.partnerId !== auth.partnerId) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (!build.done && Date.now() - new Date(build.updatedAt).getTime() > BUILD_STALE_MS) {
    kickHomeworkBuild(planId, auth.partnerId);
  }
  return NextResponse.json(buildStatusResponse(build, auth.partnerId));
});
