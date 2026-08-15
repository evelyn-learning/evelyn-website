/**
 * Shared, in-process memo for the tutor catalog index (the slim, fully-resolved
 * entry list behind the setup-page quick-search + cascade).
 *
 * Building it requires a DB read of every plan + a resolvePlanCell pass, so the
 * FIRST caller after a cold server boot pays the latency ("Loading catalog…").
 * Memoising here lets the GET route AND the startup warm-up
 * (instrumentation.ts) share one build — so the warm-up at boot means the first
 * real user request hits a ready cache (~8ms) instead of waiting on the cold
 * Mongo connect + full-catalog build.
 */
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { resolvePlanCell } from '@/lib/tutor/lesson-plan/resolve-cell';
import {
  PLAN_INDEX_VERSION,
  type PlanIndexEntry,
  type PlanIndexResponse,
} from '@/lib/tutor/lesson-plan/plan-index-types';

let cached: PlanIndexResponse | null = null;
let inflight: Promise<PlanIndexResponse> | null = null;

async function buildIndex(): Promise<PlanIndexResponse> {
  // Build from the in-code curated catalog (SEED_PLANS) ONLY — deliberately NOT
  // listLessonPlans({}). The browse/search catalog is the curated seeds; the
  // DB holds only freestyle, session-generated plans (resumed by id, never
  // browsed). Querying the DB here cost 11–21s for ~33 tiny docs on the slow
  // shared cluster — a `find({})` the index doesn't need. Seeds-only makes the
  // build ~15ms (pure resolvePlanCell) and correctly keeps freestyle artifacts
  // out of the catalog. (A specific plan is still loaded by id via
  // /api/tutor/lesson-plans/[id] for resume — that path is untouched.)
  const plans = SEED_PLANS.filter((p) => !p.title.startsWith('[TEST]'));
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

/**
 * Return the memoised index, building it once on first call. Concurrent callers
 * (e.g. the boot warm-up racing the first request) share one in-flight build.
 */
export async function getPlanIndex(): Promise<PlanIndexResponse> {
  if (cached) return cached;
  if (!inflight) {
    inflight = buildIndex()
      .then((res) => {
        cached = res;
        return res;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Fire-and-forget warm-up for server startup (instrumentation.ts). */
export async function warmPlanIndex(): Promise<void> {
  try {
    const res = await getPlanIndex();
    console.log(`[plan-index] warmed: ${res.count} entries`);
  } catch (err) {
    console.warn('[plan-index] warm-up failed (will build lazily on first request):', err);
  }
}
