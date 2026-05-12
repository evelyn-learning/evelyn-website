/**
 * Expand-plan-LOs API route.
 *
 * Called by the client when the brain emits confirm_plan_los after a
 * picker turn. Loads the existing picker-shaped plan, expands the
 * picked LOs into hook/concept/worked-example/try-yourself segments
 * via the Stage 2 generator, and upserts the resulting full plan in
 * place (same id). The client reloads the plan via the existing
 * lessonPlanId prop → useEffect flow.
 *
 * The plan id is preserved across the upsert so the orchestrator
 * doesn't need to swap lessonPlanId — it sees the same id with new
 * segments and the next brain turn's lessonPlanContext reflects the
 * expanded segments.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getLessonPlan,
  upsertLessonPlan,
} from '@/lib/tutor/lesson-plan/store';
import { expandSegmentsForLOs } from '@/lib/tutor/lesson-plan/generate-from-text';
import { parseLessonPlan } from '@/lib/tutor/lesson-plan/parser';
import type { LessonPlan, Segment, LearningObjective } from '@/lib/tutor/lesson-plan/types';

export const runtime = 'nodejs';

interface ExpandPlanLosRequestBody {
  planId: string;
  /** LO ids the student picked. Must be a subset of the plan's
   *  metadata.availableLOs (or plan.los). The plan's `los` array is
   *  set to this full picked list regardless of priorityLoIds — so
   *  the orchestrator always knows the full session scope. */
  pickedLoIds: string[];
  /** Optional subset of pickedLoIds to expand into teaching segments
   *  in THIS call. When supplied, only those LOs get hook/concept/
   *  worked/try segments — the remaining picked LOs stay in plan.los
   *  but contribute no segments yet. Used to split a slow full-batch
   *  Haiku call into a fast first-LO call + a background full-batch
   *  call. Default: expand every picked LO (legacy behaviour). */
  priorityLoIds?: string[];
}

export async function POST(request: NextRequest) {
  let body: ExpandPlanLosRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json body' }, { status: 400 });
  }

  if (!body.planId || typeof body.planId !== 'string') {
    return NextResponse.json({ error: 'planId required' }, { status: 400 });
  }
  if (!Array.isArray(body.pickedLoIds) || body.pickedLoIds.length === 0) {
    return NextResponse.json({ error: 'pickedLoIds required (non-empty array)' }, { status: 400 });
  }

  const plan = await getLessonPlan(body.planId);
  if (!plan) {
    return NextResponse.json({ error: 'plan not found', planId: body.planId }, { status: 404 });
  }

  // Resolve picked ids against the plan's LO list. Tolerate ordering
  // differences; preserve the order the brain supplied (student's
  // own priority). Drop ids that don't match an LO in the plan — the
  // brain has been observed hallucinating ids (lo-1 .. lo-22 when the
  // plan only had 12 LOs). The server is the structural enforcer.
  const losById = new Map<string, LearningObjective>(plan.los.map((lo) => [lo.id, lo]));
  const seenIds = new Set<string>();
  const droppedIds: string[] = [];
  const pickedLOs: LearningObjective[] = [];
  for (const id of body.pickedLoIds) {
    const lo = losById.get(id);
    if (!lo) {
      droppedIds.push(id);
      continue;
    }
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    pickedLOs.push(lo);
  }
  if (pickedLOs.length === 0) {
    return NextResponse.json(
      {
        error: 'none of pickedLoIds matched the plan\'s LO list',
        planId: body.planId,
        droppedIds,
        availableIds: plan.los.map((lo) => lo.id),
      },
      { status: 400 },
    );
  }
  // Cap to allowedMaxLOs from the plan's metadata. If the brain
  // returned more than the picker promised, take the first N. This
  // matches the contract the picker segment's `goal` set with the
  // student — "we can cover ${allowedMaxLOs} of these".
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowedMaxLOs: number | undefined = (plan.metadata as any)?.allowedMaxLOs;
  let capped: LearningObjective[] = pickedLOs;
  if (typeof allowedMaxLOs === 'number' && allowedMaxLOs > 0 && pickedLOs.length > allowedMaxLOs) {
    capped = pickedLOs.slice(0, allowedMaxLOs);
    console.log(
      `[expand-plan-los] capped picks from ${pickedLOs.length} to ${allowedMaxLOs} (planId=${plan.id})`,
    );
  }
  if (droppedIds.length > 0) {
    console.warn(
      `[expand-plan-los] dropped ${droppedIds.length} hallucinated id(s): [${droppedIds.join(',')}] (planId=${plan.id})`,
    );
  }

  // Narrow to priority subset for THIS call (if supplied). The plan's
  // `los` array still gets the full capped picks so the orchestrator
  // knows the full session scope; only the segment-expansion targets
  // change. Priority ids that don't match any LO in `capped` are
  // silently ignored. Empty priority array falls back to expanding
  // all capped LOs (legacy behaviour).
  const priorityIdSet = new Set(
    Array.isArray(body.priorityLoIds) && body.priorityLoIds.length > 0
      ? body.priorityLoIds.filter((id) => capped.some((lo) => lo.id === id))
      : capped.map((lo) => lo.id),
  );
  const toExpand: LearningObjective[] = capped.filter((lo) => priorityIdSet.has(lo.id));
  const isPriorityCall = toExpand.length < capped.length;

  const startedAt = Date.now();
  const stage2 = await expandSegmentsForLOs(toExpand, {
    text: '',
    subject: plan.subject,
    grade: plan.grade,
    topic: plan.topic,
    locale: plan.locale,
  });
  const stage2Ms = Date.now() - startedAt;

  if (!stage2.ok || stage2.segments.length === 0) {
    console.log(
      `[expand-plan-los] stage2 FAILED ok=${stage2.ok} reason="${stage2.reason}" planId=${body.planId} ms=${stage2Ms}`,
    );
    return NextResponse.json(
      { error: 'failed to expand picked LOs', reason: stage2.reason, timing: { stage2Ms } },
      { status: 502 },
    );
  }

  // Rebuild the plan: keep the original id, swap the segments to
  // [intro, ...expanded]. The intro segment is regenerated to reflect
  // the picked count and order. los array is narrowed to the picked
  // ones so downstream LO-tracking is accurate.
  const introSegment: Segment = {
    id: 'intro',
    kind: 'hook',
    goal: `Acknowledge the student's pick of ${capped.length} learning objectives, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.`,
  };

  // Compute LO ids still awaiting expansion (priority-call only).
  const expandedIds = new Set(toExpand.map((lo) => lo.id));
  const pendingExpansion = isPriorityCall
    ? capped.map((lo) => lo.id).filter((id) => !expandedIds.has(id))
    : [];

  let updatedPlan: LessonPlan;
  try {
    updatedPlan = parseLessonPlan({
      ...plan,
      los: capped,
      segments: [introSegment, ...stage2.segments],
      metadata: {
        ...(plan.metadata ?? {}),
        pendingPicker: false,
        pickedLoIds: capped.map((lo) => lo.id),
        expandedAt: new Date().toISOString(),
        droppedIds: droppedIds.length > 0 ? droppedIds : undefined,
        // When pendingExpansion is non-empty, the orchestrator knows
        // the plan is a partial expansion — a follow-up call with the
        // full picked set is expected to land later in the session.
        pendingExpansion: pendingExpansion.length > 0 ? pendingExpansion : undefined,
      },
    });
  } catch (err) {
    console.log(`[expand-plan-los] parse FAILED: ${(err as Error).message}`);
    return NextResponse.json(
      { error: 'plan parse failed', reason: (err as Error).message },
      { status: 502 },
    );
  }

  try {
    await upsertLessonPlan(updatedPlan);
  } catch (err) {
    console.warn('[expand-plan-los] upsert failed (continuing):', err);
  }

  console.log(
    `[expand-plan-los] expanded plan=${updatedPlan.id} ${isPriorityCall ? 'PRIORITY ' : ''}los=${capped.length} expanded=${toExpand.length}${pendingExpansion.length > 0 ? ` pending=[${pendingExpansion.join(',')}]` : ''} segments=${updatedPlan.segments.length} stage2Ms=${stage2Ms}`,
  );

  return NextResponse.json({
    plan: updatedPlan,
    pickedCount: capped.length,
    expandedCount: toExpand.length,
    pendingExpansion,
    droppedCount: droppedIds.length,
    timing: { stage2Ms, totalMs: Date.now() - startedAt },
  });
}
