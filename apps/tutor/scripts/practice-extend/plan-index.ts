/**
 * Objective → plan lookup for the offline practice-extension job.
 *
 * Two kinds of objective id reach the job:
 *   - generated courses (the six newer subjects): `gen-<uuid>.lo-N`, whose
 *     plan id is the id without `.lo-N`, and whose plan is in the Mongo dump;
 *   - the seven older authored subjects: a seed LO such as `geom.reflections`,
 *     whose plan is the single-LO seed plan `evelyn.hs.geom.reflections.v1`
 *     in SEED_PLANS. Seed plans are not stored plans, so they are not in the
 *     dump; `planMapOf` adds them, in the dump's shape.
 *
 * In dump shape a seed plan keeps its own topic (the course slug, e.g.
 * `geometry`), so an exported row's `topic`/`topicId` is the course topic.
 * Its first concept / worked example / try-yourself are also given the ids
 * `<lo>-concept`, `<lo>-worked`, `<lo>-try`, which is how the job finds an
 * objective's lesson material (practice-extend.ts `materialOf`).
 *
 * No database: SEED_PLANS are bundled source files.
 */
import '../lib/no-db-env';
import { SEED_PLANS } from '../../src/lib/tutor/lesson-plan/store';
import type { LessonPlan } from '../../src/lib/tutor/lesson-plan/types';
import type { Plan, PlanSegment } from './practice-extend';

let seedByLo: Map<string, LessonPlan> | null = null;
function seedIndex(): Map<string, LessonPlan> {
  if (!seedByLo) {
    seedByLo = new Map();
    for (const p of SEED_PLANS) for (const l of p.los) if (!seedByLo.has(l.id)) seedByLo.set(l.id, p);
  }
  return seedByLo;
}

/** The plan id of an objective: `gen-….lo-N` → without `.lo-N`; a seed LO → its seed plan; anything else unchanged. */
export function planIdOfObjective(objectiveLoId: string): string {
  if (/\.lo-\d+$/.test(objectiveLoId)) return objectiveLoId.replace(/\.lo-\d+$/, '');
  return seedIndex().get(objectiveLoId)?.id ?? objectiveLoId;
}

/** A seed plan in the dump's `Plan` shape (see the module header). */
export function seedAsDumpPlan(seed: LessonPlan): Plan {
  const segs = seed.segments as unknown as Array<Record<string, unknown>>;
  const segments: PlanSegment[] = segs.map((s) => ({
    id: String(s.id),
    kind: String(s.kind),
    goal: (s.goal as string | undefined) ?? null,
    keyIdeas: (s.keyIdeas as string[] | undefined) ?? null,
    problem: (s.problem as string | undefined) ?? null,
    steps: (s.steps as string[] | undefined) ?? null,
    answer: (s.answer as string | undefined) ?? null,
    expectedAnswer: (s.expectedAnswer as string | undefined) ?? null,
  }));
  if (seed.los.length === 1) {
    const lo = seed.los[0].id;
    const named = (kind: string, suffix: string) => {
      const s = segments.find((x) => x.kind === kind);
      if (s && !segments.some((x) => x.id === `${lo}-${suffix}`)) segments.push({ ...s, id: `${lo}-${suffix}` });
    };
    named('concept', 'concept');
    named('worked_example', 'worked');
    named('try_yourself', 'try');
  }
  return {
    _id: seed.id,
    title: seed.title,
    topic: seed.topic,
    subject: seed.subject,
    los: seed.los.map((l) => ({ id: l.id, description: l.description, ...((l as { shortTitle?: string }).shortTitle ? { shortTitle: (l as { shortTitle?: string }).shortTitle } : {}) })),
    segments,
  };
}

/** The dump's plans by id, plus every seed plan (dump shape) the dump does not hold. A dump plan wins over a seed of the same id. */
export function planMapOf(dumpPlans: Plan[]): Map<string, Plan> {
  const m = new Map<string, Plan>(dumpPlans.map((p) => [p._id, p]));
  for (const s of SEED_PLANS) if (!m.has(s.id)) m.set(s.id, seedAsDumpPlan(s));
  return m;
}
