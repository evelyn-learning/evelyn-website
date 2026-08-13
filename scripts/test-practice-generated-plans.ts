/**
 * Option B — practice/quiz/diagnostic retrieval must see STORED GENERATED
 * lesson plans, not just authored SEED_PLANS. White-label taxonomy-built
 * courses (e.g. CPHQ) adopt runtime-generated plan ids (`gen-<uuid>.lo-N`,
 * minted by plan-generate's `namespaceGeneratedLos`) onto their CourseNodes
 * — see academy's CourseBuildService.materialize()/buildOne(). Those plans
 * only ever live in Mongo, so before this change `plansForLoId` (adapters.ts)
 * returned [] for every one of their LOs — no practice, no quiz items, and
 * (via assessment.ts sharing the same PracticeSources) the diagnostic stayed
 * silently stubbed for these courses too.
 *
 * Run: `npm run test:practice-gen-plans`
 *
 * No live DB required: stubs `connectDB` (no-op) and `LessonPlanModel.find`
 * directly, mirroring the existing DB-stub convention in
 * `src/lib/tutor/portal/adapters.test.ts` (captured-filter assertions there;
 * here the stub also returns a realistic `doc.toJSON()` so
 * `store.ts`'s `findStoredPlansByLoId` -> `toLessonPlan` round-trips the
 * fields `adapters.ts`'s `toPlanLite` actually reads).
 */
import { strict as assert } from 'node:assert';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { LessonPlanModel } from '@/models/LessonPlan';
import * as dbModule from '@/lib/db';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

(dbModule as unknown as { default: () => Promise<void> }).default = async () => {};

let stubbedDocs: LessonPlan[] = [];
let capturedFilter: Record<string, unknown> | undefined;
(LessonPlanModel as unknown as {
  find: (filter: Record<string, unknown>) => { limit: (n: number) => Promise<Array<{ toJSON: () => LessonPlan }>> };
}).find = (filter) => {
  capturedFilter = filter;
  const loId = filter['los.id'] as string;
  const matches = stubbedDocs.filter((p) => p.los.some((l) => l.id === loId));
  return { limit: async () => matches.map((p) => ({ toJSON: () => ({ ...p, id: p.id }) })) };
};

// Mirrors what plan-generate's namespaceGeneratedLos actually mints
// (`${planId}.lo-${i+1}`) and what academy's materialize()/buildOne() sends
// as `topic` — the LO's own title (free text), NOT a shared topic-taxonomy
// id. See the derivedTopic finding in the report.
const GEN_LO = 'gen-cphq-uuid-1234.lo-1';
const GEN_PLAN: LessonPlan = {
  id: 'gen-cphq-uuid-1234',
  title: 'CPHQ Generated Plan',
  curriculum: 'freestyle',
  grade: 'college',
  subject: 'Healthcare Quality',
  topic: 'Understand Risk Assessment Methodologies',
  locale: 'en',
  los: [{ id: GEN_LO, description: 'Understand risk assessment.' }],
  estimatedMinutes: 30,
  segments: [
    { kind: 'try_yourself', id: 'ty-1', problem: 'What is the first step in risk assessment?', expectedAnswer: 'Identify hazards' },
    { kind: 'hook', id: 'intro', goal: 'intro' },
  ] as unknown as LessonPlan['segments'],
  schemaVersion: 1,
  metadata: { generatedFromText: true, generatorOk: true },
};

(async () => {
  await test("plansForLoId — a gen-* loId with no SEED_PLANS match surfaces the stored plan's try-yourself", async () => {
    stubbedDocs = [GEN_PLAN];
    const sources = mongoPracticeSources();
    const plans = await sources.plansForLoId(GEN_LO);
    assert.equal(plans.length, 1, 'stored plan should be the only match (no seed collides)');
    assert.equal(plans[0].id, GEN_PLAN.id);
    assert.equal(plans[0].topic, 'Understand Risk Assessment Methodologies');
    const seg = plans[0].segments.find((s) => s.kind === 'try_yourself');
    assert.ok(seg, 'try-yourself segment carried through toPlanLite');
    assert.equal(seg!.problem, 'What is the first step in risk assessment?');
    assert.deepEqual(capturedFilter, { 'los.id': GEN_LO });
  });

  await test('plansForLoId — an authored (SEED_PLANS) loId is byte-identical to pre-change SEED_PLANS-only filtering', async () => {
    const seedLo = SEED_PLANS.find((p) => p.los.length > 0)!.los[0].id;
    const expectedIds = SEED_PLANS.filter((p) => p.los.some((l) => l.id === seedLo)).map((p) => p.id);
    // No stored plan collides with an authored loId in production (guardrail:
    // authored loIds never collide with gen-* ids) — the DB stub returns []
    // for this loId exactly as the real store would.
    stubbedDocs = [];
    const sources = mongoPracticeSources();
    const plans = await sources.plansForLoId(seedLo);
    assert.deepEqual(plans.map((p) => p.id), expectedIds, 'identical id set/order to SEED_PLANS-only filtering');
  });

  await test('plansForLoId — an unknown loId (no seed, no stored match) returns empty, no crash', async () => {
    stubbedDocs = [];
    const sources = mongoPracticeSources();
    const plans = await sources.plansForLoId('no-such-lo');
    assert.deepEqual(plans, []);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
