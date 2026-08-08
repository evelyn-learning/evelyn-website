/**
 * POST /api/portal/v1/plan-expand — resolve a picker-mode plan-generate
 * response into a runnable LessonPlan.
 *
 * When `/api/portal/v1/plan-generate` (Task 4) returns `mode: 'picker'`
 * (the topic's LOs exceed the session's budget), the portal shows the
 * student an LO-picker UI, collects the picked LO ids, and calls this
 * endpoint. It expands the picked LOs into hook/concept/worked-example/
 * try-yourself segments via the Stage 2 generator and persists the
 * result under a BRAND-NEW plan id — the response's `planId` is that new
 * id, and the portal threads it into the session (no portal changes
 * needed; it already reads `planId` off this response).
 *
 * Shares its validate → expand → upsert core with the engine dev page's
 * `/api/tutor/expand-plan-los` route via `expandPlanLos`
 * (`src/lib/tutor/lesson-plan/expand.ts`). Two behavioural differences
 * from the dev route:
 *   - this endpoint REJECTS (400) a pick that exceeds the plan's stored
 *     `metadata.allowedMaxLOs` instead of silently truncating it — see
 *     `expandPlanLos`'s `capBehavior` doc comment. This also backstops
 *     plan-generate's cache-hit path: a cache hit reports
 *     `maxPickableLos` from the STORED plan's own cap (Task 4), and this
 *     endpoint is what actually enforces that stored cap server-side.
 *   - this endpoint expands via `writeMode: 'clone'`, NOT in-place. The
 *     plan at `planId` here can be a topic-cache-served picker plan
 *     (`findCachedPlan`) shared by every student who asks about the same
 *     topic/grade-band/length-bucket — expanding it in place would mutate
 *     that shared cached row under the first student's picks (silent
 *     wrong content for the next cache hit, or a 400-on-confirm for any
 *     other concurrent holder). Cloning leaves the cached picker plan
 *     (and its `cacheKey`/`pendingPicker` metadata) completely untouched
 *     and writes the expansion under a fresh `gen-` id instead. See
 *     `expandPlanLos`'s module doc for the full hazard writeup.
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { expandPlanLos } from '@/lib/tutor/lesson-plan/expand';
import {
  PlanExpandRequestSchema,
  PlanExpandResponseSchema,
} from '@/lib/tutor/lesson-plan/plan-generate-contract';

export const runtime = 'nodejs';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = PlanExpandRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }
  const { planId, pickedLoIds } = parsed.data;

  const result = await expandPlanLos({ planId, pickedLoIds, capBehavior: 'reject', writeMode: 'clone' });

  if (!result.ok) {
    switch (result.kind) {
      case 'plan_not_found':
        return NextResponse.json({ error: 'plan_not_found', planId }, { status: 404 });
      case 'no_matching_los':
        return NextResponse.json(
          {
            error: 'no_matching_los',
            planId,
            droppedIds: result.droppedIds,
            availableIds: result.availableIds,
          },
          { status: 400 },
        );
      case 'cap_exceeded':
        return NextResponse.json(
          {
            error: 'cap_exceeded',
            planId,
            allowedMaxLOs: result.allowedMaxLOs,
            pickedCount: result.pickedCount,
          },
          { status: 400 },
        );
      case 'expand_failed':
        return NextResponse.json({ error: 'expand_failed', reason: result.reason }, { status: 502 });
      case 'parse_failed':
        return NextResponse.json({ error: 'parse_failed', reason: result.reason }, { status: 502 });
    }
  }

  return NextResponse.json(
    PlanExpandResponseSchema.parse({
      planId: result.plan.id,
      estimatedMinutes: result.plan.estimatedMinutes,
      expandedCount: result.expandedCount,
      pendingExpansion: result.pendingExpansion,
    }),
  );
});
