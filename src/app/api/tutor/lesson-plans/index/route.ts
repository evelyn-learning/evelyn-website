/**
 * GET /api/tutor/lesson-plans/index
 *
 * Returns the slim, fully-resolved catalog index used by the tutor setup
 * page for instant client-side quick-search AND the Subject→Level→Topic→
 * Lesson cascade (no per-keystroke / per-cascade DB round-trips).
 *
 * Each entry carries the plan's raw tags plus the resolved taxonomy cell
 * (resolvePlanCell), so search-select and the drilldown land in the same
 * place. The payload is static per deploy → memoised in-process and sent
 * with a long immutable-ish cache header.
 */
import { NextResponse } from 'next/server';
import { listLessonPlans } from '@/lib/tutor/lesson-plan/store';
import { resolvePlanCell } from '@/lib/tutor/lesson-plan/resolve-cell';
import {
  PLAN_INDEX_VERSION,
  type PlanIndexEntry,
  type PlanIndexResponse,
} from '@/lib/tutor/lesson-plan/plan-index-types';

let cached: PlanIndexResponse | null = null;

async function buildIndex(): Promise<PlanIndexResponse> {
  const all = await listLessonPlans({});
  // Exclude QA/stress-test fixtures (titles prefixed "[TEST]") — they are dev
  // fixtures, not student-facing catalog content.
  const plans = all.filter((p) => !p.title.startsWith('[TEST]'));
  const entries: PlanIndexEntry[] = plans.map((p) => {
    const cell = resolvePlanCell(p);
    const md = (p.metadata ?? {}) as Record<string, unknown>;
    const cedUnit = typeof md.cedUnit === 'string' ? md.cedUnit : undefined;
    const cedTopic = typeof md.cedTopic === 'string' ? md.cedTopic : undefined;
    const cedTitle = typeof md.cedTitle === 'string' ? md.cedTitle : undefined;
    const search = [
      p.title,
      p.id,
      p.topic ?? '',
      p.subject,
      p.grade,
      p.curriculum,
      cedTitle ?? '',
      ...p.los.map((lo) => lo.description),
    ]
      .join(' ')
      .toLowerCase();
    return {
      id: p.id,
      title: p.title,
      curriculum: p.curriculum,
      grade: p.grade,
      subject: p.subject,
      topic: p.topic,
      estimatedMinutes: p.estimatedMinutes,
      firstLo: p.los[0]?.description,
      cedUnit,
      cedTopic,
      cedTitle,
      cellSubject: cell?.subject ?? null,
      cellLevel: cell?.level ?? null,
      cellTopic: cell?.topic ?? null,
      search,
    };
  });
  return { version: PLAN_INDEX_VERSION, count: entries.length, entries };
}

export async function GET() {
  if (!cached) {
    cached = await buildIndex();
  }
  return NextResponse.json(cached, {
    headers: {
      // Static per deploy; allow CDN/browser caching, revalidate in background.
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  });
}
