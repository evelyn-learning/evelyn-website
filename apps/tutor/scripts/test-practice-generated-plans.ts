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
import { retrievePractice } from '@/lib/tutor/portal/practice';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank } from '@/models/ProblemBank';
import * as dbModule from '@core/db';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import { PracticeItemSchema, type RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

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

// Review fix: a stored plan is app-layer-validated only (Mongoose `segments`
// is Mixed — models/LessonPlan.ts), so a malformed row (bad upsert, partial
// write, future schema drift) must be skipped, not throw and 500 every
// student on this LO. `segments: null` reproduces the crash toPlanLite()
// used to hit unguarded (`plan.segments.map(...)` on a non-array).
const GEN_LO2 = 'gen-cphq-uuid-9999.lo-1';
const MALFORMED_PLAN = {
  id: 'gen-cphq-uuid-bad',
  title: 'Malformed Generated Plan',
  curriculum: 'freestyle',
  grade: 'college',
  subject: 'Healthcare Quality',
  topic: 'Bad Topic',
  locale: 'en',
  los: [{ id: GEN_LO2, description: 'malformed row' }],
  estimatedMinutes: 30,
  segments: null,
  schemaVersion: 1,
  metadata: {},
} as unknown as LessonPlan;
const VALID_SIBLING_PLAN: LessonPlan = {
  id: 'gen-cphq-uuid-good',
  title: 'Valid Generated Plan',
  curriculum: 'freestyle',
  grade: 'college',
  subject: 'Healthcare Quality',
  topic: 'Good Topic',
  locale: 'en',
  los: [{ id: GEN_LO2, description: 'valid sibling' }],
  estimatedMinutes: 30,
  segments: [
    { kind: 'try_yourself', id: 'ty-good-1', problem: 'What is a valid try-yourself?', expectedAnswer: 'This one' },
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

  await test('plansForLoId — a malformed stored plan (null segments) is skipped, not thrown; valid sibling survives', async () => {
    stubbedDocs = [MALFORMED_PLAN, VALID_SIBLING_PLAN];
    const sources = mongoPracticeSources();
    const plans = await sources.plansForLoId(GEN_LO2);
    assert.equal(plans.length, 1, 'only the valid sibling should survive');
    assert.equal(plans[0].id, VALID_SIBLING_PLAN.id);
  });

  await test('retrievePractice — malformed + valid stored plans for the same loId: no throw, valid try-yourself returned', async () => {
    stubbedDocs = [MALFORMED_PLAN, VALID_SIBLING_PLAN];
    const sources = mongoPracticeSources();
    const req: RetrievePracticeRequest = { studentId: 's', courseId: 'c', scope: { loId: GEN_LO2 }, count: 10 };
    const r = await retrievePractice(req, sources); // must not throw
    const ids = r.items.map((i) => i.id);
    assert.ok(ids.some((id) => id.includes('ty-good-1')), 'the valid sibling plan\'s try-yourself is present');
    assert.ok(!ids.some((id) => id.includes('gen-cphq-uuid-bad')), 'the malformed plan contributed nothing');
  });

  // Prod bug repro (white-label second-practice-request 500): a stored
  // generated plan's try-yourself segments carry EXPLICIT `null` on
  // hints/responseFormat/choices — not absent, literal null. This is what a
  // real Mongo round-trip produces: generate-from-text.ts's Stage 2 never
  // asks Haiku for these fields on a try_yourself segment, so
  // parseLessonPlan (lesson-plan/parser.ts:122-124) bakes them onto the
  // Segment as explicit `undefined` properties, and the Mongo driver's
  // default BSON serialization (no `ignoreUndefined`) turns those into
  // literal `null` on the stored document. `doc.toJSON()` here returns the
  // plan object as-is (mirroring the existing stub convention above), so
  // these segments simulate exactly what `findStoredPlansByLoId` hands back
  // in production.
  const GEN_LO3 = 'gen-cphq-uuid-nulls.lo-1';
  const BANK_ITEM_ID = 'bank.cphq.risk.0001';
  const NULL_FIELDS_PLAN: LessonPlan = {
    id: 'gen-cphq-uuid-nulls',
    title: 'CPHQ Generated Plan (null fields)',
    curriculum: 'freestyle',
    grade: 'college',
    subject: 'Healthcare Quality',
    topic: 'Understand Risk Assessment Methodologies',
    locale: 'en',
    los: [{ id: GEN_LO3, description: 'Understand risk assessment.' }],
    estimatedMinutes: 30,
    segments: [
      {
        kind: 'try_yourself',
        id: 'ty-free',
        problem: 'Name the first step in risk assessment.',
        expectedAnswer: 'Identify hazards',
        hints: null,
        responseFormat: null,
        choices: null,
      },
      {
        kind: 'try_yourself',
        id: 'ty-mcq',
        problem: 'Which of these is a risk-assessment tool?',
        expectedAnswer: 'FMEA',
        hints: null,
        responseFormat: null, // null despite real choices — must infer 'mcq', not 'free'
        choices: [
          { id: 'A', text: 'FMEA', correct: true },
          { id: 'B', text: 'SWOT' },
        ],
      },
    ] as unknown as LessonPlan['segments'],
    schemaVersion: 1,
    metadata: { generatedFromText: true, generatorOk: true },
  };

  (ProblemBank as unknown as {
    find: (filter: Record<string, unknown>) => {
      limit: (n: number) => { lean: () => Promise<Array<Record<string, unknown>>> };
    };
  }).find = (filter) => ({
    limit: () => ({
      lean: async () => {
        if (filter.loId !== GEN_LO3) return [];
        return [
          {
            id: BANK_ITEM_ID,
            problemText: 'What is the purpose of a risk register?',
            answer: 'Track identified risks and mitigations',
            hints: ['Think tracking, not scoring'],
            responseFormat: 'free',
            difficulty: 2,
            loId: GEN_LO3,
          },
        ];
      },
    }),
  });

  await test('retrievePractice — first request: bank item + generated try-yourselves ALL parse against PracticeItemSchema', async () => {
    stubbedDocs = [NULL_FIELDS_PLAN];
    const sources = mongoPracticeSources();
    const req: RetrievePracticeRequest = { studentId: 's', courseId: 'c', scope: { loId: GEN_LO3 }, count: 10 };
    const r = await retrievePractice(req, sources);
    assert.ok(r.items.length >= 3, 'bank item + both try-yourselves present');
    for (const item of r.items) {
      const parsed = PracticeItemSchema.safeParse(item);
      assert.ok(parsed.success, `item "${item.id}" must parse against PracticeItemSchema: ${JSON.stringify(parsed.success ? null : parsed.error.issues)}`);
    }
  });

  await test('retrievePractice — second request (excludeIds = bank id already served) tops up from the null-field try-yourselves; every returned item parses, and the nulls are normalized', async () => {
    stubbedDocs = [NULL_FIELDS_PLAN];
    const sources = mongoPracticeSources();
    const req: RetrievePracticeRequest = {
      studentId: 's',
      courseId: 'c',
      scope: { loId: GEN_LO3 },
      count: 10,
      excludeIds: [BANK_ITEM_ID],
    };
    const r = await retrievePractice(req, sources);
    const ids = r.items.map((i) => i.id);
    assert.ok(!ids.includes(BANK_ITEM_ID), 'excluded bank id must not reappear');
    const freeItem = r.items.find((i) => i.id.includes('ty-free'));
    const mcqItem = r.items.find((i) => i.id.includes('ty-mcq'));
    assert.ok(freeItem, 'top-up path served the free-response try-yourself');
    assert.ok(mcqItem, 'top-up path served the mcq try-yourself');
    for (const item of r.items) {
      const parsed = PracticeItemSchema.safeParse(item);
      assert.ok(parsed.success, `item "${item.id}" must parse against PracticeItemSchema: ${JSON.stringify(parsed.success ? null : parsed.error.issues)}`);
    }
    // Null -> contract-valid normalization, not just "didn't crash":
    assert.deepEqual(freeItem!.hints, [], 'null hints default to []');
    assert.equal(freeItem!.responseFormat, 'free', 'null responseFormat with no real choices infers free');
    assert.equal(freeItem!.choices, undefined, 'null choices with no real options is omitted, not []');
    assert.equal(mcqItem!.responseFormat, 'mcq', 'null responseFormat WITH real choices infers mcq');
    assert.equal(mcqItem!.choices?.length, 2, 'real choices array survives untouched');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
