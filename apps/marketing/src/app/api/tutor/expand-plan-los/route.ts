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
 *
 * The validate → expand → upsert core lives in
 * `src/lib/tutor/lesson-plan/expand.ts` (`expandPlanLos`), shared with
 * the portal-facing `/api/portal/v1/plan-expand` route (Task 5). This
 * route is a thin wrapper that preserves its EXACT pre-extraction
 * request/response shape — the engine dev page depends on it — by
 * mapping `expandPlanLos`'s result onto the same JSON bodies/status
 * codes as before.
 */

import { NextRequest, NextResponse } from 'next/server';
import { expandPlanLos } from '@/lib/tutor/lesson-plan/expand';

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

  const startedAt = Date.now();
  const result = await expandPlanLos({
    planId: body.planId,
    pickedLoIds: body.pickedLoIds,
    priorityLoIds: body.priorityLoIds,
    capBehavior: 'truncate',
  });

  if (!result.ok) {
    switch (result.kind) {
      case 'plan_not_found':
        return NextResponse.json({ error: 'plan not found', planId: body.planId }, { status: 404 });
      case 'no_matching_los':
        return NextResponse.json(
          {
            error: 'none of pickedLoIds matched the plan\'s LO list',
            planId: body.planId,
            droppedIds: result.droppedIds,
            availableIds: result.availableIds,
          },
          { status: 400 },
        );
      case 'expand_failed':
        return NextResponse.json(
          { error: 'failed to expand picked LOs', reason: result.reason, timing: result.timing },
          { status: 502 },
        );
      case 'parse_failed':
        return NextResponse.json(
          { error: 'plan parse failed', reason: result.reason },
          { status: 502 },
        );
      // 'cap_exceeded' is unreachable here — this route always calls
      // expandPlanLos with capBehavior: 'truncate'.
      default:
        return NextResponse.json({ error: 'unexpected expand failure' }, { status: 502 });
    }
  }

  return NextResponse.json({
    plan: result.plan,
    pickedCount: result.pickedCount,
    expandedCount: result.expandedCount,
    pendingExpansion: result.pendingExpansionIds,
    droppedCount: result.droppedIds.length,
    timing: { stage2Ms: result.timing.stage2Ms, totalMs: Date.now() - startedAt },
  });
}
