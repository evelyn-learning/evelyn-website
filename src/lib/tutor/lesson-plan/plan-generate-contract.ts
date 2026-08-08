/**
 * Portal contract shapes + pure response/metadata helpers for
 * POST /api/portal/v1/plan-generate.
 *
 * Pulled out of the route handler so this logic — response shaping,
 * persisted-metadata shaping — is unit-testable without touching Next.js
 * request/response plumbing, the DB, or a live LLM call. The route itself
 * (`src/app/api/portal/v1/plan-generate/route.ts`) stays thin: parse, call
 * the generation pipeline, call these helpers, persist, respond.
 *
 * TODO(contract v1.9.0): import PlanGenerateRequestSchema /
 * PlanGenerateResponseSchema from @evelyn/portal-contract/v1 once the
 * engine's npm pin bumps past v1.8.0. As of this writing the v1.9.0 tag
 * exists in the portal-contract repo (commit fd954d0, "feat(v1.9.0):
 * additive plan-generate/plan-expand schemas for runtime lesson
 * generation") but has NOT been pushed to GitHub — `npm install` of it is
 * impossible right now. The two schemas below are copied VERBATIM from
 * portal-contract's `src/v1/schemas.ts` at that commit. Swap this block for
 * the real import at ship time (Task 11) and delete it.
 */

import { z } from 'zod';
import { maxLOsForBudget } from './session-budget';
import type { LessonPlan } from './types';

export const PlanGenerateRequestSchema = z.object({
  /** Source text: a normalized topic (Phase 1) or pasted material (Phase 2). */
  text: z.string().min(3).max(8000),
  subject: z.string().min(1),
  grade: z.string().min(1),
  topic: z.string().max(300).optional(),
  locale: z.string().optional(),
  /** Target session length; engine clamps to [5, 120]. */
  sessionMinutes: z.number().int().min(5).max(120).optional(),
});
export type PlanGenerateRequest = z.infer<typeof PlanGenerateRequestSchema>;

export const PlanLoSummarySchema = z.object({
  id: z.string(),
  description: z.string(),
});

export const PlanGenerateResponseSchema = z.object({
  planId: z.string(),
  title: z.string(),
  /** 'full' = plan ready to run; 'picker' = LOs exceed budget, caller must pick then call plan-expand. */
  mode: z.enum(['full', 'picker']),
  los: z.array(PlanLoSummarySchema),
  /** Max LOs the session budget fits (picker mode: how many the student may pick). */
  maxPickableLos: z.number().int().positive(),
  estimatedMinutes: z.number().int().positive(),
  /** False when the engine served its deterministic fallback plan. */
  generatorOk: z.boolean(),
  cached: z.boolean(),
});
export type PlanGenerateResponse = z.infer<typeof PlanGenerateResponseSchema>;
// --- end TODO(contract v1.9.0) block ---

/**
 * Build the PlanGenerateResponse body for a plan (fresh or cache-hit).
 *
 * `sessionMinutes` is always the CURRENT request's clamped value, not
 * whatever the plan happened to be generated under — on a cache hit two
 * requests can land in the same length bucket (e.g. 22 min and 28 min both
 * bucket to 'std') without sharing an exact sessionMinutes.
 *
 * `maxPickableLos`: when the plan is a picker plan (`metadata.pendingPicker
 * === true`), it carries its own `metadata.allowedMaxLOs` — the cap its
 * prose already told the student about and that plan-expand (Task 5) will
 * enforce server-side. That stored cap MUST win over a fresh recompute:
 * the 'long' length bucket alone spans 31-120 minutes, so
 * maxLOsForBudget(sessionMinutes, grade) can swing from ~5 to ~23 within
 * one bucket — recomputing from THIS request's sessionMinutes on a cache
 * hit could report a number bigger than what the persisted plan (and its
 * picker segment's hard-coded prose) actually allows. Non-picker plans
 * don't carry allowedMaxLOs, so they fall back to a fresh compute (there's
 * no stored cap to violate — it's purely informational for those).
 */
export function toResponse(
  plan: LessonPlan,
  flags: { cached: boolean; sessionMinutes: number; generatorOk?: boolean },
): PlanGenerateResponse {
  const generatorOk = flags.generatorOk ?? plan.metadata?.generatorOk !== false;
  const mode: 'full' | 'picker' = plan.metadata?.pendingPicker === true ? 'picker' : 'full';
  const maxPickableLos =
    typeof plan.metadata?.allowedMaxLOs === 'number'
      ? (plan.metadata.allowedMaxLOs as number)
      : maxLOsForBudget({ sessionMinutes: flags.sessionMinutes, grade: plan.grade });
  return {
    planId: plan.id,
    title: plan.title,
    mode,
    los: plan.los.map((lo) => ({ id: lo.id, description: lo.description })),
    maxPickableLos,
    estimatedMinutes: plan.estimatedMinutes,
    generatorOk,
    cached: flags.cached,
  };
}

/**
 * Metadata to stamp onto a freshly generated plan before persisting it.
 *
 * Omits `cacheKey` when `generatorOk` is false: a fallback skeleton (the
 * deterministic 1-LO plan served on an LLM failure) must NEVER become the
 * cached answer for its topic/band/bucket. `findCachedPlan` matches on
 * `metadata.cacheKey` with no quality filter, so if a fallback carried the
 * real cacheKey, one transient LLM hiccup would serve that degraded
 * skeleton — with `cached: true` — to every student asking about the same
 * topic/grade-band/length-bucket for the full 30-day TTL, long after the
 * LLM is healthy again. The plan is still durably persisted (has a stable
 * "gen-" id, is inspectable) — it's just not *findable* via the cache, so
 * the next request regenerates fresh.
 */
export function generatedPlanMetadata(
  plan: LessonPlan,
  opts: { cacheKey: string; generatorOk: boolean; portalPartnerId: string; sessionMinutes: number },
): Record<string, unknown> {
  return {
    ...plan.metadata,
    generatedFromText: true,
    generatorOk: opts.generatorOk,
    ...(opts.generatorOk ? { cacheKey: opts.cacheKey } : {}),
    portalPartnerId: opts.portalPartnerId,
    sessionMinutes: opts.sessionMinutes,
  };
}
