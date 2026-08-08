/**
 * POST /api/portal/v1/plan-generate — runtime lesson generation for portal
 * free-form sessions.
 *
 * Called by the student portal at session start to turn a typed topic (or
 * pasted study text) into a runnable LessonPlan. Reuses the existing
 * text->plan generation pipeline (`generate-from-text.ts`, already driving
 * `/api/tutor/plan-from-text`) and adds:
 *   - portal HMAC auth (`withPortalAuth`)
 *   - a topic/subject/grade-band/length-bucket/locale generation cache
 *     (Task 3, extended here — see generation-cache.ts) so repeat requests
 *     for "the same lesson" skip the LLM entirely
 *   - durable persistence (upsertLessonPlan) — NOT best-effort here; if
 *     persistence fails we return 502 so the portal falls back to freestyle
 *     rather than minting a session pointed at a plan that doesn't exist
 *   - a contract-shaped, schema-validated PlanGenerateResponse
 *
 * Mode decision mirrors `/api/tutor/plan-from-text/route.ts` EXACTLY (Stage
 * 1 extracts the LO list; Y = LOs found vs X = maxLOsForBudget(sessionMinutes,
 * grade); Y > X returns a 'picker' plan the caller must resolve via
 * POST /api/portal/v1/plan-expand (Task 5), Y <= X runs Stage 2 inline and
 * returns a 'full' plan) — kept in lockstep so both entry points behave
 * identically for the same input. The one difference: this endpoint never
 * hard-fails a generation. On a Stage 1 / Stage 2 failure it serves
 * `generate-from-text.ts`'s deterministic `fallbackPlan` directly (no
 * retry — see the comment at each failure branch) and reports
 * `generatorOk: false` — a usable skeleton beats no plan for a portal
 * session, but it's never written into the generation cache (see
 * `generatedPlanMetadata` in plan-generate-contract.ts) and it's worth a
 * spot-review.
 *
 * Phase-2 doc ingestion (v1.10.0's `materials` field): when the request
 * carries one or more `materials`, they go through `extractMaterials()`
 * FIRST. An extraction failure (scanned PDF, oversized file, too many
 * pages, unsupported kind, or a parser crash) is a user-fixable input
 * problem, not a generation failure, so it short-circuits with 422 before
 * any LLM call. On success, the extracted `combinedText` becomes the
 * pipeline's `text` and the request's own `text` (the free-form prompt the
 * student typed alongside their upload) becomes a topic hint instead —
 * `topic ?? text`, clamped to the contract's own topic length cap
 * (`REQUEST_TOPIC_MAX_LENGTH`) since `text` can run to 8000 chars.
 * Materials-derived plans skip the topic cache entirely
 * (no lookup, no `cacheKey` stamped) since a document's content isn't a
 * stable topic/grade-band/length-bucket equivalence class the way a typed
 * topic is; everything else — picker/full mode decision, id minting,
 * persistence, response shaping — is identical to the text-only path.
 */

import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import {
  extractLearningObjectives,
  expandSegmentsForLOs,
  buildPickerPlan,
  fallbackPlan,
  buildRecapSegment,
} from '@/lib/tutor/lesson-plan/generate-from-text';
import { extractMaterials } from '@/lib/tutor/lesson-plan/material-extract';
import { upsertLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { clampSessionMinutes, maxLOsForBudget } from '@/lib/tutor/lesson-plan/session-budget';
import { topicCacheKey, findCachedPlan } from '@/lib/tutor/lesson-plan/generation-cache';
import { parseLessonPlan } from '@/lib/tutor/lesson-plan/parser';
import { LESSON_PLAN_SCHEMA_VERSION } from '@/lib/tutor/lesson-plan/types';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';
import {
  PlanGenerateRequestSchema,
  PlanGenerateResponseSchema,
  toResponse,
  generatedPlanMetadata,
  type PlanGenerateRequest,
} from '@/lib/tutor/lesson-plan/plan-generate-contract';

export const runtime = 'nodejs';

const INTRO_SEGMENT_GOAL =
  'Acknowledge the material the student supplied: name how many learning objectives you see, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.';

// Mirrors PlanGenerateRequestSchema's own `topic: z.string().max(300)`
// (contract v1.9.0+). The materials path falls back to the request's raw
// `text` (up to 8000 chars, per the same schema) as a topic hint when the
// caller didn't supply an explicit `topic` — clamp it to the field's own
// documented max so an 8000-char blob never rides the generation prompt's
// topic line or ends up verbatim in the persisted plan's `topic` field.
const REQUEST_TOPIC_MAX_LENGTH = 300;

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = PlanGenerateRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  }
  const { text: requestText, subject, grade, topic: requestTopic, locale, materials }: PlanGenerateRequest = parsed.data;
  const sessionMinutes = clampSessionMinutes(parsed.data.sessionMinutes);
  const hasMaterials = !!materials && materials.length > 0;

  let text = requestText;
  let topic = requestTopic;
  // Only set for the materials path — stays undefined (no cache lookup,
  // no cacheKey stamped) on the text-only path below.
  let cacheKey: string | undefined;
  let materialsMeta: { count: number; kinds: string[]; totalChars: number } | undefined;

  if (hasMaterials) {
    const extracted = await extractMaterials(materials!);
    if (!extracted.ok) {
      // User-fixable input problem (bad file, not a generation failure) —
      // 422, not 502, and no LLM call has happened yet.
      return NextResponse.json({ error: extracted.code, message: extracted.message }, { status: 422 });
    }
    // The extracted document text drives generation; the student's own
    // typed `text` becomes a topic hint instead (only if they didn't
    // already supply an explicit `topic`) — clamped to the contract's own
    // topic length cap, see REQUEST_TOPIC_MAX_LENGTH.
    text = extracted.combinedText;
    topic = requestTopic ?? requestText.slice(0, REQUEST_TOPIC_MAX_LENGTH);
    materialsMeta = {
      count: extracted.materials.length,
      kinds: extracted.materials.map((m) => m.kind),
      totalChars: extracted.combinedText.length,
    };
  } else {
    cacheKey = topicCacheKey({ topic: topic ?? text, subject, grade, sessionMinutes, locale });
    const cachedPlan = await findCachedPlan(cacheKey);
    if (cachedPlan) {
      return NextResponse.json(PlanGenerateResponseSchema.parse(toResponse(cachedPlan, { cached: true, sessionMinutes })));
    }
  }

  const genInput = { text, subject, grade, topic, locale };
  const X = maxLOsForBudget({ sessionMinutes, grade });

  let plan: LessonPlan;
  let generatorOk: boolean;

  const stage1 = await extractLearningObjectives(genInput);
  if (!stage1.ok || stage1.los.length === 0) {
    // Stage 1 failed outright — serve the canonical fallback directly.
    // Do NOT retry via the one-shot pipeline: that would re-run Stage 1
    // (the exact stage that just failed) and, on a retry success, hand
    // back a mode:'full' plan that was never checked against X — an
    // over-budget plan that breaks parity with plan-from-text. A usable
    // 1-LO skeleton beats a second live call at synchronous request time.
    plan = fallbackPlan(genInput, stage1.reason);
    generatorOk = false;
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
      // Same no-retry rule as the Stage 1 failure above.
      plan = fallbackPlan(genInput, stage2.reason);
      generatorOk = false;
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
          segments: [introSegment, ...stage2.segments, buildRecapSegment(stage1.los)],
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
        console.warn('[plan-generate] full-plan parse failed, serving fallback:', (err as Error).message);
        plan = fallbackPlan(genInput, `parse failed: ${(err as Error).message}`);
        generatorOk = false;
      }
    }
  }

  if (!generatorOk) {
    console.warn(`[plan-generate] served fallback plan (generatorOk=false), NOT cached, for cacheKey="${cacheKey}"`);
  }

  // Mint the durable id and stamp portal-owned metadata. Overrides the
  // pipeline's own minted id (freestyle-*, freestyle-fallback-*) — the
  // portal contract needs a stable "gen-" prefix it can recognize.
  // generatedPlanMetadata omits cacheKey whenever it's undefined (the
  // materials path never computes one — see the module doc) OR when
  // generatorOk is false, so a fallback skeleton is persisted (inspectable,
  // has a durable id) but never becomes the cached answer for its
  // topic/band/bucket.
  plan = {
    ...plan,
    id: `gen-${randomUUID()}`,
    metadata: generatedPlanMetadata(plan, {
      cacheKey,
      generatorOk,
      portalPartnerId: auth.partnerId,
      sessionMinutes,
      ...(hasMaterials ? { sourceKind: 'materials' as const, materialsMeta } : {}),
    }),
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

  // Schema-validate before responding so contract drift fails loudly
  // instead of silently shipping a malformed body to the portal.
  return NextResponse.json(PlanGenerateResponseSchema.parse(toResponse(plan, { cached: false, generatorOk, sessionMinutes })));
});
