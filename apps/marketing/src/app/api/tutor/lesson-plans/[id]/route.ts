/**
 * GET    /api/tutor/lesson-plans/:id   — full plan (segments included).
 * DELETE /api/tutor/lesson-plans/:id   — admin-only (seeds rejected).
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteLessonPlan, getLessonPlan } from '@/lib/tutor/lesson-plan/store';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const plan = await getLessonPlan(id);
  if (!plan) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ plan });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === 'production') {
    const token = req.headers.get('x-admin-ingest-token');
    if (!token || token !== process.env.ADMIN_INGEST_TOKEN) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }
  const { id } = await ctx.params;
  const ok = await deleteLessonPlan(id);
  if (!ok) return NextResponse.json({ error: 'not found or seed (immutable)' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
