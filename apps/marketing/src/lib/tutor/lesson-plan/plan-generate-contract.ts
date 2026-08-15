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
 * The plan-generate/plan-expand schemas are defined in
 * @evelyn/portal-contract/v1 (v1.9.0+) and re-exported here so the route
 * handlers and test script keep importing from this module unchanged.
 */

import {
  PlanGenerateRequestSchema,
  PlanGenerateResponseSchema,
  PlanLoSummarySchema,
  PlanExpandRequestSchema,
  PlanExpandResponseSchema,
  type PlanGenerateRequest,
  type PlanGenerateResponse,
  type PlanExpandRequest,
  type PlanExpandResponse,
} from '@evelyn/portal-contract/v1';
import { maxLOsForBudget } from './session-budget';
import type { LessonPlan } from './types';

export {
  PlanGenerateRequestSchema,
  PlanGenerateResponseSchema,
  PlanLoSummarySchema,
  PlanExpandRequestSchema,
  PlanExpandResponseSchema,
};
export type { PlanGenerateRequest, PlanGenerateResponse, PlanExpandRequest, PlanExpandResponse };

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
 *
 * Either source is clamped to 12: `PlanExpandRequestSchema.pickedLoIds` is
 * `.max(12)`, so reporting anything above that would tell the picker UI it
 * can submit a pick plan-expand would reject outright with `cap_exceeded`.
 */
export function toResponse(
  plan: LessonPlan,
  flags: { cached: boolean; sessionMinutes: number; generatorOk?: boolean },
): PlanGenerateResponse {
  const generatorOk = flags.generatorOk ?? plan.metadata?.generatorOk !== false;
  const mode: 'full' | 'picker' = plan.metadata?.pendingPicker === true ? 'picker' : 'full';
  const rawMaxPickableLos =
    typeof plan.metadata?.allowedMaxLOs === 'number'
      ? (plan.metadata.allowedMaxLOs as number)
      : maxLOsForBudget({ sessionMinutes: flags.sessionMinutes, grade: plan.grade });
  const maxPickableLos = Math.min(12, rawMaxPickableLos);
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
 *
 * `cacheKey` is also optional/absent for the Phase-2 materials path (v1.10.0):
 * a document's content isn't a stable topic/grade-band/length-bucket
 * equivalence class the way a typed topic is, so the route never computes
 * one there in the first place — this just omits it the same way it omits
 * one on generatorOk:false, without conflating "no cache key to store" with
 * "generation failed" (materials-path plans still report their real
 * `generatorOk`).
 *
 * `sourceKind`/`materialsMeta` (Phase-2, materials path only): counts and
 * kinds of the attached materials, never their content or names.
 */
export function generatedPlanMetadata(
  plan: LessonPlan,
  opts: {
    cacheKey?: string;
    generatorOk: boolean;
    portalPartnerId: string;
    sessionMinutes: number;
    sourceKind?: 'materials';
    materialsMeta?: { count: number; kinds: string[]; totalChars: number };
  },
): Record<string, unknown> {
  return {
    ...plan.metadata,
    generatedFromText: true,
    generatorOk: opts.generatorOk,
    ...(opts.generatorOk && opts.cacheKey ? { cacheKey: opts.cacheKey } : {}),
    portalPartnerId: opts.portalPartnerId,
    sessionMinutes: opts.sessionMinutes,
    ...(opts.sourceKind ? { sourceKind: opts.sourceKind } : {}),
    ...(opts.materialsMeta ? { materialsMeta: opts.materialsMeta } : {}),
  };
}
