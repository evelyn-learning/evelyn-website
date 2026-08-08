/**
 * POST /api/portal/v1/plan-generate — runtime lesson generation for portal
 * free-form sessions.
 *
 * Called by the student portal at session start to turn a typed topic (or
 * pasted study text) into a runnable LessonPlan. Reuses the existing
 * text->plan generation pipeline (`generate-from-text.ts`, already driving
 * `/api/tutor/plan-from-text`) and adds:
 *   - portal HMAC auth (`withPortalAuth`)
 *   - a topic/grade-band/length-bucket generation cache (Task 3) so repeat
 *     requests for "the same lesson" skip the LLM entirely
 *   - durable persistence (upsertLessonPlan) — NOT best-effort here; if
 *     persistence fails we return 502 so the portal falls back to freestyle
 *     rather than minting a session pointed at a plan that doesn't exist
 *   - a contract-shaped PlanGenerateResponse
 *
 * Mode decision mirrors `/api/tutor/plan-from-text/route.ts` EXACTLY (Stage
 * 1 extracts the LO list; Y = LOs found vs X = maxLOsForBudget(sessionMinutes,
 * grade); Y > X returns a 'picker' plan the caller must resolve via
 * POST /api/portal/v1/plan-expand (Task 5), Y <= X runs Stage 2 inline and
 * returns a 'full' plan) — kept in lockstep so both entry points behave
 * identically for the same input. The one difference: this endpoint never
 * hard-fails a generation. On a Stage 1 / Stage 2 failure it falls through
 * to `generatePlanFromText`'s deterministic fallback plan (same one used by
 * the one-shot pipeline) and reports `generatorOk: false` — a usable
 * skeleton beats no plan for a portal session, but it's worth a spot-review.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import {
  extractLearningObjectives,
  expandSegmentsForLOs,
  buildPickerPlan,
  generatePlanFromText,
} from '@/lib/tutor/lesson-plan/generate-from-text';
import { upsertLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { clampSessionMinutes, maxLOsForBudget } from '@/lib/tutor/lesson-plan/session-budget';
import { topicCacheKey, findCachedPlan } from '@/lib/tutor/lesson-plan/generation-cache';
import { parseLessonPlan } from '@/lib/tutor/lesson-plan/parser';
import { LESSON_PLAN_SCHEMA_VERSION } from '@/lib/tutor/lesson-plan/types';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';

export const runtime = 'nodejs';

// TODO(contract v1.9.0): import from @evelyn/portal-contract once the engine's
// npm pin bumps past v1.8.0 (the tag exists in the portal-contract repo as of
// this writing but hasn't been pushed to GitHub yet — `npm install` of the
// new tag isn't possible right now). These two schemas are copied VERBATIM
// from portal-contract's `src/v1/schemas.ts` (commit fd954d0, "feat(v1.9.0):
// additive plan-generate/plan-expand schemas for runtime lesson generation").
// Swap this block for the real import at ship time (Task 11) and delete it.
const PlanGenerateRequestSchema = z.object({
  /** Source text: a normalized topic (Phase 1) or pasted material (Phase 2). */
  text: z.string().min(3).max(8000),
  subject: z.string().min(1),
  grade: z.string().min(1),
  topic: z.string().max(300).optional(),
  locale: z.string().optional(),
  /** Target session length; engine clamps to [5, 120]. */
  sessionMinutes: z.number().int().min(5).max(120).optional(),
});
type PlanGenerateRequest = z.infer<typeof PlanGenerateRequestSchema>;

const PlanLoSummarySchema = z.object({
  id: z.string(),
  description: z.string(),
});

const PlanGenerateResponseSchema = z.object({
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
type PlanGenerateResponse = z.infer<typeof PlanGenerateResponseSchema>;
// --- end TODO(contract v1.9.0) block ---

/** `sessionMinutes` is always the CURRENT request's clamped value, not
 *  whatever the plan happened to be generated under — on a cache hit two
 *  requests can land in the same length bucket (e.g. 22 min and 28 min
 *  both bucket to 'std') without sharing an exact sessionMinutes, and
 *  maxPickableLos must reflect what THIS caller asked for. */
function toResponse(
  plan: LessonPlan,
  flags: { cached: boolean; sessionMinutes: number; generatorOk?: boolean },
): PlanGenerateResponse {
  const generatorOk = flags.generatorOk ?? plan.metadata?.generatorOk !== false;
  const mode: 'full' | 'picker' = plan.metadata?.pendingPicker === true ? 'picker' : 'full';
  return {
    planId: plan.id,
    title: plan.title,
    mode,
    los: plan.los.map((lo) => ({ id: lo.id, description: lo.description })),
    maxPickableLos: maxLOsForBudget({ sessionMinutes: flags.sessionMinutes, grade: plan.grade }),
    estimatedMinutes: plan.estimatedMinutes,
    generatorOk,
    cached: flags.cached,
  };
}

const INTRO_SEGMENT_GOAL =
  'Acknowledge the material the student supplied: name how many learning objectives you see, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = PlanGenerateRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }
  const { text, subject, grade, topic, locale }: PlanGenerateRequest = parsed.data;
  const sessionMinutes = clampSessionMinutes(parsed.data.sessionMinutes);

  const cacheKey = topicCacheKey({ topic: topic ?? text, grade, sessionMinutes });
  const cachedPlan = await findCachedPlan(cacheKey);
  if (cachedPlan) {
    return NextResponse.json(toResponse(cachedPlan, { cached: true, sessionMinutes }));
  }

  const genInput = { text, subject, grade, topic, locale };
  const X = maxLOsForBudget({ sessionMinutes, grade });

  let plan: LessonPlan;
  let generatorOk: boolean;

  const stage1 = await extractLearningObjectives(genInput);
  if (!stage1.ok || stage1.los.length === 0) {
    // Stage 1 failed outright — fall through to the one-shot pipeline's
    // deterministic fallback rather than 502ing (portal treats a fallback
    // skeleton as usable; logged below for spot-review).
    const fallback = await generatePlanFromText(genInput);
    plan = fallback.plan;
    generatorOk = fallback.ok;
  } else if (stage1.los.length > X) {
    // Y > X: hand back a picker plan (all discovered LOs, unexpanded).
    // The portal shows a picker UI and resolves via plan-expand (Task 5).
    plan = buildPickerPlan({
      input: genInput,
      titleSuggestion: stage1.titleSuggestion,
      los: stage1.los,
      allowedMaxLOs: X,
      sessionMinutes,
    });
    generatorOk = true;
  } else {
    // Y <= X: expand inline and assemble a full plan (mirrors
    // generatePlanFromText's own full-plan branch, minus the redundant
    // Stage 1 call since we already ran it above).
    const stage2 = await expandSegmentsForLOs(stage1.los, genInput);
    if (!stage2.ok || stage2.segments.length === 0) {
      const fallback = await generatePlanFromText(genInput);
      plan = fallback.plan;
      generatorOk = fallback.ok;
    } else {
      const introSegment: Segment = { id: 'intro', kind: 'hook', goal: INTRO_SEGMENT_GOAL };
      try {
        plan = parseLessonPlan({
          id: `freestyle-${Date.now()}`,
          title: stage1.titleSuggestion,
          curriculum: 'freestyle',
          grade,
          subject,
          topic,
          locale: locale ?? 'en',
          los: stage1.los,
          estimatedMinutes: sessionMinutes,
          segments: [introSegment, ...stage2.segments],
          prerequisites: [],
          followUps: [],
          schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
          metadata: {
            generatedFromText: true,
            generatorOk: true,
            sourceTextLength: text.length,
            sessionMaxLOs: X,
          },
        });
        generatorOk = true;
      } catch (err) {
        console.warn('[plan-generate] full-plan parse failed, falling back:', (err as Error).message);
        const fallback = await generatePlanFromText(genInput);
        plan = fallback.plan;
        generatorOk = fallback.ok;
      }
    }
  }

  if (!generatorOk) {
    console.warn(`[plan-generate] served fallback plan (generatorOk=false) for cacheKey="${cacheKey}"`);
  }

  // Mint the durable id and stamp portal-owned metadata. Overrides the
  // pipeline's own minted id (freestyle-*, freestyle-fallback-*) — the
  // portal contract needs a stable "gen-" prefix it can recognize.
  plan = {
    ...plan,
    id: `gen-${randomUUID()}`,
    metadata: {
      ...plan.metadata,
      generatedFromText: true,
      generatorOk,
      cacheKey,
      portalPartnerId: auth.partnerId,
      sessionMinutes,
    },
  };

  try {
    await upsertLessonPlan(plan);
  } catch (err) {
    // NOT best-effort: a plan id that isn't durably stored would leave the
    // portal minting a session token pointing at nothing. Fail loud so it
    // falls back to freestyle instead.
    console.error('[plan-generate] persistence failed, returning 502:', (err as Error).message);
    return NextResponse.json({ error: 'persistence_failed' }, { status: 502 });
  }

  return NextResponse.json(toResponse(plan, { cached: false, generatorOk, sessionMinutes }));
});
