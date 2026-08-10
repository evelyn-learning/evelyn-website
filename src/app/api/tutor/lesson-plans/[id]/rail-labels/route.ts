/**
 * GET /api/tutor/lesson-plans/:id/rail-labels — { labels: SegmentLabels | null }
 *
 * Generated plans group by LO client-side, so they short-circuit to
 * `{ labels: null }` without any derivation. Curated plans go through the
 * cached Haiku derivation (deriveSegmentLabels), which itself fails soft to
 * null on any error — this route never surfaces a 5xx for a derivation
 * failure, only for an unknown plan id.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { isGeneratedPlan } from '@/lib/tutor/lesson-plan/context';
import { deriveSegmentLabels } from '@/lib/tutor/lesson-plan/derive-rail-labels';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const plan = await getLessonPlan(id);
  if (!plan) return NextResponse.json({ error: 'not found' }, { status: 404 });
  // Generated plans group by LO client-side — no derivation needed.
  if (isGeneratedPlan(plan)) return NextResponse.json({ labels: null });
  const labels = await deriveSegmentLabels(plan);
  return NextResponse.json({ labels });
}
