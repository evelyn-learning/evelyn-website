/**
 * Swap-plan API route.
 *
 * Called by the client when the brain emits a propose_plan_swap tool
 * call. Resolves a new lesson plan within the session's configured
 * subject + topic, by:
 *
 *   1. Searching the curated catalog for a plan whose title or LO
 *      descriptions match the requested sub-topic (normalized string
 *      match, no fuzzy).
 *   2. Falling back to plan-from-text generation seeded with the
 *      sub-topic label when no curated match exists.
 *
 * Returns the new plan id. The client setSelectedLessonPlanId(newId)
 * via its callback, the existing useEffect in VoiceTutorRealtime loads
 * the plan, and the next brain turn picks it up from lessonPlanContext.
 *
 * Topic-scoping is enforced server-side: every candidate plan must
 * match the session's configured subject + (when present) topic.
 * This is the structural guarantee behind Rule 7's "session stays
 * within scope" — a misbehaving brain cannot escape the topic by
 * proposing a swap to something outside.
 */

import { NextRequest, NextResponse } from 'next/server';
import { listLessonPlans } from '@/lib/tutor/lesson-plan/store';
import { generatePlanFromText } from '@/lib/tutor/lesson-plan/generate-from-text';
import { upsertLessonPlan } from '@/lib/tutor/lesson-plan/store';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';

export const runtime = 'nodejs';

interface SwapPlanRequestBody {
  /** Short plain-English label for the sub-topic the brain wants. */
  targetSubTopic: string;
  /** Session configuration. Used to scope the catalog search and
   *  seed plan generation when no curated match is found. */
  subject: string;
  grade: string;
  topic?: string;
  locale?: string;
  /** Telemetry only. */
  reason?: string;
}

/** Normalize a string for case-insensitive substring / equality
 *  matching. Same shape as match-curated's normalizer. Generic. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]+$/g, '')
    .trim();
}

/** Score a curated plan against a target sub-topic label. Higher =
 *  better fit. Deterministic, no fuzzy embeddings — substring
 *  containment in either direction on title or any LO description.
 *  Returns 0 when no signal at all so the caller can decide between
 *  curated and generated. */
function scorePlanForSubTopic(plan: LessonPlan, target: string): number {
  const t = norm(target);
  if (!t) return 0;
  let score = 0;
  const title = norm(plan.title);
  if (title === t) score += 10;
  else if (title.includes(t) || t.includes(title)) score += 5;
  for (const lo of plan.los) {
    const d = norm(lo.description);
    if (d === t) score += 8;
    else if (d.includes(t) || t.includes(d)) score += 3;
  }
  return score;
}

export async function POST(request: NextRequest) {
  let body: SwapPlanRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json body' }, { status: 400 });
  }

  const targetSubTopic = (body.targetSubTopic ?? '').trim();
  if (!targetSubTopic) {
    return NextResponse.json({ error: 'targetSubTopic is required' }, { status: 400 });
  }
  if (!body.subject || !body.grade) {
    return NextResponse.json({ error: 'subject and grade are required' }, { status: 400 });
  }

  // Step 1: scoped curated lookup. Topic is the session boundary; we
  // pass it through if present so the catalog filter honors it.
  let candidates: LessonPlan[] = [];
  try {
    candidates = await listLessonPlans({
      subject: body.subject,
      grade: body.grade,
      topic: body.topic,
    });
  } catch (err) {
    console.warn('[swap-plan] catalog list failed:', err);
  }

  let bestCurated: { plan: LessonPlan; score: number } | null = null;
  for (const plan of candidates) {
    const score = scorePlanForSubTopic(plan, targetSubTopic);
    if (score > 0 && (!bestCurated || score > bestCurated.score)) {
      bestCurated = { plan, score };
    }
  }

  // Threshold: require a minimum signal before slotting in a curated
  // plan. Anything below this is likely a coincidence; safer to
  // generate. Tuned conservatively — false-negatives just route to
  // generation, which is correct.
  if (bestCurated && bestCurated.score >= 3) {
    console.log(
      `[swap-plan] curated match plan=${bestCurated.plan.id} title="${bestCurated.plan.title}" score=${bestCurated.score} for target="${targetSubTopic}"`,
    );
    return NextResponse.json({
      plan: bestCurated.plan,
      source: 'curated' as const,
      score: bestCurated.score,
    });
  }

  // Step 2: generate a focused plan from the sub-topic label. The
  // freestyle generator already produces an intro segment + per-LO
  // segments. Seeding with just the label gives a small but focused
  // plan — Haiku fills out reasonable LOs around the label.
  const startedAt = Date.now();
  const generation = await generatePlanFromText({
    text: targetSubTopic,
    subject: body.subject,
    grade: body.grade,
    topic: body.topic,
    locale: body.locale,
  });
  const generationMs = Date.now() - startedAt;

  try {
    await upsertLessonPlan(generation.plan);
  } catch (err) {
    console.warn('[swap-plan] upsert failed (continuing):', err);
  }

  console.log(
    `[swap-plan] generated plan=${generation.plan.id} ok=${generation.ok} reason="${generation.reason}" target="${targetSubTopic}" ms=${generationMs}`,
  );

  return NextResponse.json({
    plan: generation.plan,
    source: 'generated' as const,
    generatorOk: generation.ok,
    generatorReason: generation.reason,
    timing: { generationMs },
  });
}
