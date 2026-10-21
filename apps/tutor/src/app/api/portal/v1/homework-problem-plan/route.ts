/**
 * POST /api/portal/v1/homework-problem-plan  { planId, n, priorNote?, waitMs? }
 *   -> 201 { planId, verified, hasFigure, buildStatus }
 *
 * Mints the one-problem plan a student's session runs on. Waits (up to
 * waitMs, clamp 0-8000) for the problem's build to leave `preparing`. The
 * response and the minted plan never carry the answer key.
 */

import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { getLessonPlan, upsertLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { homeworkProblemsOf } from '@/lib/tutor/lesson-plan/homework';
import { buildHomeworkProblemPlan } from '@/lib/tutor/lesson-plan/homework-problem';
import { getHomeworkBuild } from '@/lib/tutor/homework-build/store';
import { buildNeedsKick, kickHomeworkBuild } from '@/lib/tutor/homework-build/runner';
import type { ProblemBuild, ProblemBuildStatus } from '@/lib/tutor/homework-build/types';

const POLL_MS = 500;
const MAX_WAIT_MS = 8000;
const PRIOR_NOTE_MAX = 400;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const POST = withPortalAuth(async (req, auth) => {
  let body: { planId?: unknown; n?: unknown; priorNote?: unknown; waitMs?: unknown } = {};
  try { body = await req.json(); } catch { /* handled below */ }
  if (typeof body.planId !== 'string' || !body.planId || typeof body.n !== 'number') {
    return NextResponse.json({ error: 'bad_request', reason: 'planId and n required' }, { status: 400 });
  }
  const parentId = body.planId;
  const n = body.n;
  const parent = await getLessonPlan(parentId);
  const problem = parent ? homeworkProblemsOf(parent)?.find((p) => p.n === n) : undefined;
  if (!parent || !problem || parent.metadata?.portalPartnerId !== auth.partnerId) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  const waitMs = Math.min(MAX_WAIT_MS, Math.max(0, typeof body.waitMs === 'number' && Number.isFinite(body.waitMs) ? body.waitMs : MAX_WAIT_MS));
  const priorNote = typeof body.priorNote === 'string' ? body.priorNote.trim().slice(0, PRIOR_NOTE_MAX) : '';

  const deadline = Date.now() + waitMs;
  let kicked = false;
  let entry: ProblemBuild | undefined;
  for (;;) {
    const build = await getHomeworkBuild(parentId);
    // No build yet, or one whose run died (not done, stale): start it, this problem first.
    if (!kicked && buildNeedsKick(build)) { kickHomeworkBuild(parentId, auth.partnerId, { first: n }); kicked = true; }
    entry = build?.problems.find((p) => p.n === n);
    if ((entry && entry.status !== 'preparing') || Date.now() + POLL_MS > deadline) break;
    await sleep(POLL_MS);
  }

  const buildStatus: ProblemBuildStatus = entry?.status ?? 'preparing';
  const figure = entry?.figure ?? null;
  const verified = buildStatus === 'ready';
  const planId = `gen-${randomUUID()}`;
  const plan = buildHomeworkProblemPlan(parent, {
    parentPlanId: parentId, n, text: problem.text, figure, verified,
    ...(priorNote ? { priorNote } : {}),
  }, planId);
  await upsertLessonPlan(plan);
  return NextResponse.json({ planId, verified, hasFigure: figure != null, buildStatus }, { status: 201 });
});
