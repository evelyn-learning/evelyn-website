/**
 * GET /api/portal/v1/homework-problem-outcome?sessionId=[&planId=]
 *   -> 200 { outcome: 'done' | 'in_progress' | 'needs_review', priorNote }
 *   -> 400 sessionId missing · 404 session missing or another partner's
 *
 * The outcome of one homework-problem session (lib/tutor/homework-build/
 * outcome.ts). The plan is the session's `lessonProgress.lessonPlanId`, else
 * the `planId` the partner minted (it must be that partner's plan). Never
 * returns an answer.
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { TutorSession, type ITutorSession } from '@/models/TutorSession';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { homeworkProblemOf } from '@/lib/tutor/lesson-plan/homework-problem';
import { classifyHomeworkProblemOutcome, homeworkProblemPriorNote } from '@/lib/tutor/homework-build/outcome';
import { getHomeworkBuild } from '@/lib/tutor/homework-build/store';

export const GET = withPortalAuth(async (req, auth) => {
  const params = new URL(req.url).searchParams;
  const sessionId = params.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'bad_request', reason: 'sessionId required' }, { status: 400 });
  await connectDB();
  const session = await TutorSession.findOne({ sessionId, sourcePartnerId: auth.partnerId })
    .select({ transcript: 1, debugEvents: 1, lessonProgress: 1 })
    .lean<Pick<ITutorSession, 'transcript' | 'debugEvents' | 'lessonProgress'> | null>();
  if (!session) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const planId = session.lessonProgress?.lessonPlanId || params.get('planId') || '';
  const plan = planId ? await getLessonPlan(planId) : null;
  const scoped = plan && plan.metadata?.portalPartnerId === auth.partnerId ? plan : null;
  const meta = homeworkProblemOf(scoped);
  // The host's finish button (academy live-result path): done only when the
  // transcript confirms every key part, else needs_review (outcome.ts).
  const finished = params.get('finished') === '1';
  const build = finished && meta?.verified ? await getHomeworkBuild(meta.parentPlanId).catch(() => null) : null;
  const key = build?.problems.find((p) => p.n === meta?.n)?.key ?? null;
  const outcome = classifyHomeworkProblemOutcome({
    debugEvents: session.debugEvents,
    transcript: session.transcript,
    verified: meta ? meta.verified : null,
    finished,
    key,
  });
  const priorNote = await homeworkProblemPriorNote(session.transcript);
  return NextResponse.json({ outcome, priorNote });
});
