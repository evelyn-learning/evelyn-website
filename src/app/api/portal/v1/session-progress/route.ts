/**
 * GET /api/portal/v1/session-progress?sessionId= — authoritative lesson
 * position read (contract v1.2.0, spec §3.1).
 *
 * The live `evelyn:progress` / `evelyn:session_ended` postMessages are
 * best-effort and don't fire on an abrupt close (reload, tab-kill, network
 * drop) — exactly the case resume targets. The durable truth is the engine's
 * persisted checkpoint (E1, written on each segment change). This read serves
 * it to the authed portal so the lessons list + resume decision use the real
 * position even with no open iframe.
 *
 *   → 200 { lessonProgress: LessonProgress | null,
 *           resumable: boolean,   // checkpoint within RESUME_MAX_AGE_MS
 *           updatedAt?: string }  // ISO; absent when no checkpoint
 *
 * `resumable` is the engine's decision (it owns RESUME_MAX_AGE_MS); the portal
 * only reads it to label Resume vs Restart. Progress pills render regardless
 * of age — structural state never expires.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { connectDB } from '@core/db';
import { TutorSession, type ITutorSession } from '@/models/TutorSession';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { buildLessonProgress } from '@/lib/tutor/portal/lesson-progress';
import { RESUME_MAX_AGE_MS, type LessonProgress } from '@evelyn/portal-contract/v1';

export const GET = withPortalAuth(async (req) => {
  const sessionId = new URL(req.url).searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'bad_request', reason: 'sessionId required' }, { status: 400 });
  }

  await connectDB();
  const session = await TutorSession.findOne({ sessionId }).lean<ITutorSession | null>();
  const cp = session?.lessonProgress;
  if (!cp || !cp.lessonPlanId) {
    return NextResponse.json({ lessonProgress: null, resumable: false });
  }

  // Rebuild the full LessonProgress (segments manifest + %) from the minimal
  // checkpoint by re-loading the plan. If the plan was deleted, still return a
  // manifest-less progress so the portal can show position + label it.
  const plan = await getLessonPlan(cp.lessonPlanId);
  const lessonProgress: LessonProgress =
    buildLessonProgress(plan, cp.currentSegmentId ?? '', cp.completedSegmentIds ?? []) ?? {
      lessonPlanId: cp.lessonPlanId,
      segments: [],
      currentSegmentId: cp.currentSegmentId ?? '',
      completedSegmentIds: cp.completedSegmentIds ?? [],
    };

  const updatedAt = cp.updatedAt ? new Date(cp.updatedAt) : null;
  const resumable = updatedAt ? Date.now() - updatedAt.getTime() <= RESUME_MAX_AGE_MS : false;

  return NextResponse.json({
    lessonProgress,
    resumable,
    ...(updatedAt ? { updatedAt: updatedAt.toISOString() } : {}),
  });
});
