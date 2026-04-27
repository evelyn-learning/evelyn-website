/**
 * GET  /api/tutor/lesson-plans?subject=...&grade=...&curriculum=...
 *   List lesson plans matching the filter. Returns seeds + any DB-stored
 *   plans. Used by the demo site's LO dropdown and by the brain when it
 *   needs to choose between candidate plans.
 *
 * POST /api/tutor/lesson-plans
 *   Upsert a lesson plan (admin / B2B ingest). Body is the raw plan;
 *   parseLessonPlan normalizes and validates. Auth gating is left to
 *   middleware — for now we accept all writes in dev and require
 *   ADMIN_INGEST_TOKEN in non-dev.
 */

import { NextRequest, NextResponse } from 'next/server';
import { listLessonPlans, upsertLessonPlan } from '@/lib/tutor/lesson-plan/store';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const filter = {
    subject: url.searchParams.get('subject') ?? undefined,
    grade: url.searchParams.get('grade') ?? undefined,
    curriculum: url.searchParams.get('curriculum') ?? undefined,
    topic: url.searchParams.get('topic') ?? undefined,
    locale: url.searchParams.get('locale') ?? undefined,
  };
  const plans = await listLessonPlans(filter);
  // Return a slim view for listing — full plan available via /[id].
  const items = plans.map((p) => ({
    id: p.id,
    title: p.title,
    curriculum: p.curriculum,
    grade: p.grade,
    subject: p.subject,
    topic: p.topic,
    locale: p.locale,
    estimatedMinutes: p.estimatedMinutes,
    los: p.los.map((lo) => ({ id: lo.id, description: lo.description })),
    segmentCount: p.segments.length,
  }));
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const token = req.headers.get('x-admin-ingest-token');
    if (!token || token !== process.env.ADMIN_INGEST_TOKEN) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  try {
    const plan = await upsertLessonPlan(body);
    return NextResponse.json({ ok: true, id: plan.id });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
