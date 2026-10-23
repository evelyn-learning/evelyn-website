/**
 * GET /api/portal/v1/homework-problem-outcome?sessionId=[&planId=]
 *   -> 200 { outcome: 'done' | 'in_progress' | 'needs_review', priorNote, confirmed }
 *      `confirmed` (A2): keyed-verdict marks for every part confirmed so far,
 *      earlier sessions' included — the host passes them to the next mint.
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
import { confirmedKeyMarks } from '@/lib/tutor/voice/keyed-verdict';

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
  // The key is loaded for every call (2026-10-22): a pause after solving the problem is done too.
  const build = meta?.verified ? await getHomeworkBuild(meta.parentPlanId).catch(() => null) : null;
  const key = build?.problems.find((p) => p.n === meta?.n)?.key ?? null;
  const outcome = classifyHomeworkProblemOutcome({
    debugEvents: session.debugEvents,
    transcript: session.transcript,
    verified: meta ? meta.verified : null,
    finished,
    key,
    priorConfirmed: meta?.priorConfirmed ?? [],
  });
  const priorNote = await homeworkProblemPriorNote(session.transcript);
  const history = (session.transcript ?? [])
    .filter((t) => t?.role === 'student' && typeof t.text === 'string' && t.text.trim() !== '')
    .map((t) => ({ role: 'user' as const, content: String(t.text) }));
  const confirmed = key?.parts?.length ? confirmedKeyMarks(history, '', key, meta?.priorConfirmed ?? []) : (meta?.priorConfirmed ?? []);
  return NextResponse.json({ outcome, priorNote, confirmed });
});
