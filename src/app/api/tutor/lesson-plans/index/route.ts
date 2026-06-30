/**
 * GET /api/tutor/lesson-plans/index
 *
 * Returns the slim, fully-resolved catalog index used by the tutor setup
 * page for instant client-side quick-search AND the Subject→Level→Topic→
 * Lesson cascade (no per-keystroke / per-cascade DB round-trips).
 *
 * Each entry carries the plan's raw tags plus the resolved taxonomy cell
 * (resolvePlanCell), so search-select and the drilldown land in the same
 * place. The payload is static per deploy → memoised in-process (shared with
 * the startup warm-up in instrumentation.ts so the first real request hits a
 * ready cache) and sent with a long immutable-ish cache header.
 */
import { NextResponse } from 'next/server';
import { getPlanIndex } from '@/lib/tutor/lesson-plan/plan-index-cache';

export async function GET() {
  const index = await getPlanIndex();
  return NextResponse.json(index, {
    headers: {
      // Static per deploy; allow CDN/browser caching, revalidate in background.
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  });
}
