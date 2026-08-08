/**
 * Generate-plan-from-text API route.
 *
 * Two-stage flow:
 *   1. Stage 1 (always) — extract the LO list from the student's text.
 *      Fast Haiku call (~3 s).
 *   2. Branch on Y (LOs found) vs X (LOs that fit in T):
 *        Y ≤ X → run Stage 2 inline, return full plan with intro
 *                segment + 4 segments per LO.
 *        Y > X → return a small "picker" plan: intro segment + a
 *                concept segment whose keyIdeas IS the LO list. The
 *                brain reads it and asks the student to pick X via
 *                the confirm_plan_los tool. When the student picks,
 *                the client hits /api/tutor/expand-plan-los which
 *                runs Stage 2 for the chosen LOs.
 *
 * Plans are upserted so /api/tutor/lesson-plans/{id} can serve them
 * back to VoiceTutorRealtime via the lessonPlanId prop flow.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  extractLearningObjectives,
  expandSegmentsForLOs,
  buildPickerPlan,
  buildRecapSegment,
} from '@/lib/tutor/lesson-plan/generate-from-text';
import { findCuratedMatches } from '@/lib/tutor/lesson-plan/match-curated';
import { detectFreestyleText } from '@/lib/tutor/lesson-plan/freestyle-trigger';
import { upsertLessonPlan } from '@/lib/tutor/lesson-plan/store';
import {
  clampSessionMinutes,
  maxLOsForBudget,
} from '@/lib/tutor/lesson-plan/session-budget';
import { LESSON_PLAN_SCHEMA_VERSION } from '@/lib/tutor/lesson-plan/types';
import type { LessonPlan, Segment } from '@/lib/tutor/lesson-plan/types';
import { parseLessonPlan } from '@/lib/tutor/lesson-plan/parser';

export const runtime = 'nodejs';

const MAX_INPUT_CHARS = 8000;

interface PlanFromTextRequestBody {
  text: string;
  subject: string;
  grade: string;
  topic?: string;
  locale?: string;
  /** Total session time in minutes. Drives the X (max LOs) calculation.
   *  Defaults to 30. Clamped to [1, 120] server-side. */
  sessionMinutes?: number;
}

export async function POST(request: NextRequest) {
  let body: PlanFromTextRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json body' }, { status: 400 });
  }

  if (!body.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }
  if (!body.subject || typeof body.subject !== 'string') {
    return NextResponse.json({ error: 'subject is required' }, { status: 400 });
  }
  if (!body.grade || typeof body.grade !== 'string') {
    return NextResponse.json({ error: 'grade is required' }, { status: 400 });
  }

  const text = body.text.length > MAX_INPUT_CHARS ? body.text.slice(0, MAX_INPUT_CHARS) : body.text;
  const sessionMinutes = clampSessionMinutes(body.sessionMinutes);
  const allowedMaxLOs = maxLOsForBudget({ sessionMinutes, grade: body.grade });

  const trigger = detectFreestyleText(text);
  if (!trigger.shouldGeneratePlan) {
    console.log(`[plan-from-text] heuristic disagreed (client called anyway): ${trigger.reason}`);
  }

  // Stage 1: extract LO list.
  const startedAt = Date.now();
  const stage1 = await extractLearningObjectives({
    text,
    subject: body.subject,
    grade: body.grade,
    topic: body.topic,
    locale: body.locale,
  });
  const stage1Ms = Date.now() - startedAt;

  if (!stage1.ok || stage1.los.length === 0) {
    console.log(
      `[plan-from-text] stage1 FAILED ok=${stage1.ok} reason="${stage1.reason}" ms=${stage1Ms}`,
    );
    return NextResponse.json(
      {
        error: 'failed to extract learning objectives',
        reason: stage1.reason,
        timing: { stage1Ms },
      },
      { status: 502 },
    );
  }

  const Y = stage1.los.length;
  const X = allowedMaxLOs;

  // Curated-plan match attempted in both branches — informational.
  // (When a curated plan matches an LO, we could swap segments later;
  // exposed in the response for client-side telemetry only in v1.)
  let curatedMatches: Awaited<ReturnType<typeof findCuratedMatches>> = [];
  try {
    curatedMatches = await findCuratedMatches({
      los: stage1.los,
      subject: body.subject,
      grade: body.grade,
      topic: body.topic,
    });
  } catch (err) {
    console.warn('[plan-from-text] curated-match lookup failed:', err);
  }

  // Branch: Y > X → picker plan, no Stage 2 yet.
  if (Y > X) {
    const plan = buildPickerPlan({
      input: { text, subject: body.subject, grade: body.grade, topic: body.topic, locale: body.locale },
      titleSuggestion: stage1.titleSuggestion,
      los: stage1.los,
      allowedMaxLOs: X,
      sessionMinutes,
    });
    try {
      await upsertLessonPlan(plan);
    } catch (err) {
      console.warn('[plan-from-text] picker upsert failed (continuing):', err);
    }
    console.log(
      `[plan-from-text] picker plan=${plan.id} Y=${Y} X=${X} session=${sessionMinutes}min trigger="${trigger.reason}" stage1Ms=${stage1Ms}`,
    );
    return NextResponse.json({
      plan,
      mode: 'picker' as const,
      Y,
      X,
      sessionMinutes,
      generatorOk: true,
      curatedMatches,
      timing: { stage1Ms, totalMs: Date.now() - startedAt },
    });
  }

  // Branch: Y ≤ X → run Stage 2 inline.
  const stage2Started = Date.now();
  const stage2 = await expandSegmentsForLOs(stage1.los, {
    text,
    subject: body.subject,
    grade: body.grade,
    topic: body.topic,
    locale: body.locale,
  });
  const stage2Ms = Date.now() - stage2Started;

  if (!stage2.ok || stage2.segments.length === 0) {
    console.log(
      `[plan-from-text] stage2 FAILED ok=${stage2.ok} reason="${stage2.reason}" ms=${stage2Ms}`,
    );
    return NextResponse.json(
      {
        error: 'failed to expand segments',
        reason: stage2.reason,
        timing: { stage1Ms, stage2Ms },
      },
      { status: 502 },
    );
  }

  const planId = `freestyle-${Date.now()}`;
  const introSegment: Segment = {
    id: 'intro',
    kind: 'hook',
    goal:
      'Acknowledge the material the student supplied: name how many learning objectives you see, list them in the planned order in 1 sentence, and propose starting with the first one. Stay brief — under 25 spoken words.',
  };

  let fullPlan: LessonPlan;
  try {
    fullPlan = parseLessonPlan({
      id: planId,
      title: stage1.titleSuggestion,
      curriculum: 'freestyle',
      grade: body.grade,
      subject: body.subject,
      topic: body.topic,
      locale: body.locale ?? 'en',
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
        sessionMinutes,
        sessionMaxLOs: X,
      },
    });
  } catch (err) {
    console.log(
      `[plan-from-text] full-plan parse FAILED: ${(err as Error).message} (stage1Ms=${stage1Ms} stage2Ms=${stage2Ms})`,
    );
    return NextResponse.json(
      { error: 'plan parse failed', reason: (err as Error).message },
      { status: 502 },
    );
  }

  try {
    await upsertLessonPlan(fullPlan);
  } catch (err) {
    console.warn('[plan-from-text] full upsert failed (continuing):', err);
  }

  console.log(
    `[plan-from-text] full plan=${fullPlan.id} Y=${Y} X=${X} (fits) session=${sessionMinutes}min trigger="${trigger.reason}" stage1Ms=${stage1Ms} stage2Ms=${stage2Ms}`,
  );

  return NextResponse.json({
    plan: fullPlan,
    mode: 'full' as const,
    Y,
    X,
    sessionMinutes,
    generatorOk: true,
    curatedMatches,
    timing: { stage1Ms, stage2Ms, totalMs: Date.now() - startedAt },
  });
}
