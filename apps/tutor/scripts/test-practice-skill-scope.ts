/**
 * Practice SKILL SCOPE — a request for the FIRST objective of a generated
 * course plan draws from ALL objectives of that plan.
 *
 * Defect this pins (confirmed from a production data dump): a course node
 * holds only `gen-<uuid>.lo-1`, and since the 2026-10-04 per-LO rule each
 * try-yourself is served only under its own LO — so practice for a skill
 * with 2–8 objectives served objective 1 alone.
 *
 * Under test:
 *   - portal/practice.ts — `isSkillScopePlan` (the rule), `retrievePractice`
 *     (all objectives, every existing filter, objective spread, wire `loId` =
 *     the skill), `spreadAcrossObjectives`, the kill switch
 *     `TUTOR_PRACTICE_SKILL_SCOPE`;
 *   - portal/audited-items.ts + src/data/audited-lesson-steps.json +
 *     scripts/audit/build-audited-lesson-steps.ts — the audited-only gate on
 *     steps from objectives 2..N;
 *   - attribution: assessment, homework resolution, the per-(student, LO)
 *     generation cap all stay on the skill LO;
 *   - grading an objective-3 item by id (adapters.ts resolvers, unchanged);
 *   - portal/practice-coverage.ts — the coverage report helper;
 *   - the production adapter over STUBBED Mongo (no connection is opened).
 *
 * No database, no model: injected fakes; `connectDB`, `LessonPlanModel.find`
 * and `ProblemBank.find` are replaced for the adapter section.
 *
 * Run — either runner (the stubs are on `mongoose.connect` and the model
 * objects, never on a module export):
 *   npm run test:practice-skill-scope
 *   npx tsx scripts/test-practice-skill-scope.ts
 */
// FIRST, before anything loads `@core/db`: no run of this file can reach a database.
import { NO_DB_URI } from './lib/no-db-env';
import { strict as assert } from 'node:assert';
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import {
  retrievePractice,
  isSkillScopePlan,
  isStudentOwnedPlan,
  skillScopeEnabled,
  spreadAcrossObjectives,
  type PracticeSources,
  type PlanLite,
  type BankLite,
} from '@/lib/tutor/portal/practice';
import type { PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import {
  AUDITED_LESSON_STEP_IDS,
  AUDITED_ONLY_PARTNERS_ENV,
  isAuditedLessonStep,
  lessonStepServableToPartner,
  withoutUnauditedLessonSteps,
} from '@/lib/tutor/portal/audited-items';
import { WITHDRAWN_ITEM_IDS } from '@/lib/tutor/portal/withdrawn-items';
import { buildAssessment, gradeAssessmentResponses } from '@/lib/tutor/portal/assessment';
import { mongoPracticeSources, toPlanLite, resolveGradeItem, resolveAssessmentItem, type ItemKeyDeps } from '@/lib/tutor/portal/adapters';
import { resolveAssignmentItems, NO_GEN_SOURCES } from '@/lib/tutor/practice-assign/resolve';
import { skillCoverage, summarizeCoverage } from '@/lib/tutor/portal/practice-coverage';
import { buildAuditedLessonStepList, lessonStepObjective, readLessonStepIds } from './audit/build-audited-lesson-steps';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank } from '@/models/ProblemBank';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import { RetrievePracticeResponseSchema, type RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

// No database in this file. Replaced before anything can call it.
// `connectDB` itself is NOT replaced: reassigning a module's export only
// takes under ts-node/commonjs — under tsx the import binding is read-only
// and the real connectDB ran (it threw on the unset URI, so the adapter
// returned nothing). `mongoose.connect` is a property of a plain object, so
// this stub holds under either runner; scripts/lib/no-db-env.ts gives
// connectDB an unresolvable URI to hand it.
let connectCalls = 0;
const connectUris: unknown[] = [];
(mongoose as unknown as { connect: (uri: unknown) => Promise<typeof mongoose> }).connect = async (uri) => {
  connectCalls++;
  connectUris.push(uri);
  return mongoose;
};

const FLAG = 'TUTOR_PRACTICE_SKILL_SCOPE';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  const log = console.log;
  try {
    console.log = () => {}; // the retrieval logs one line per skipped item
    await fn();
    console.log = log;
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    console.log = log;
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  } finally {
    console.log = log;
    delete process.env.PRACTICE_GEN;
    delete process.env[FLAG];
    delete process.env[AUDITED_ONLY_PARTNERS_ENV];
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const P1 = 'partner-one';
const P2 = 'partner-two';

/** A generated course plan in the stored shape: `<planId>.lo-K` objectives,
 *  each with hook / concept / worked_example / try_yourself segments. */
function genPlan(planId: string, objectives: number, over: Partial<PlanLite> = {}, extraTry: number[] = []): PlanLite {
  const los = Array.from({ length: objectives }, (_, i) => ({ id: `${planId}.lo-${i + 1}`, standard: `STD.${i + 1}` }));
  const segments: PlanLite['segments'] = [];
  los.forEach((lo, i) => {
    segments.push({ kind: 'hook', id: `${lo.id}-hook` });
    segments.push({ kind: 'concept', id: `${lo.id}-concept` });
    segments.push({ kind: 'worked_example', id: `${lo.id}-worked` });
    segments.push({
      kind: 'try_yourself', id: `${lo.id}-try`, problem: `Objective ${i + 1}: compute ${i + 1} + ${i + 1}.`,
      expectedAnswer: String(2 * (i + 1)), hints: [`hint for objective ${i + 1}`], responseFormat: 'numeric',
    });
    if (extraTry.includes(i + 1)) {
      segments.push({
        kind: 'try_yourself', id: `${lo.id}-try2`, problem: `Objective ${i + 1} again: compute ${i + 1} × 10.`,
        expectedAnswer: String(10 * (i + 1)), hints: [], responseFormat: 'numeric',
      });
    }
  });
  return { id: planId, title: `Skill ${planId}`, topic: `Topic ${planId}`, partnerId: P1, los, segments, ...over };
}

const A = 'gen-aaaaaaaa-0000-4000-8000-000000000001';
const B = 'gen-bbbbbbbb-0000-4000-8000-000000000002';
const planA = genPlan(A, 4, {}, [2]);
const planB = genPlan(B, 3);
const lo = (planId: string, k: number) => `${planId}.lo-${k}`;
const step = (planId: string, k: number, suffix = 'try') => `${planId}::${planId}.lo-${k}-${suffix}`;

/** Authored (curated) multi-LO plan: alias standards, bare segment ids. */
const authored: PlanLite = {
  id: 'alg1-linear-equations',
  topic: 'linear-equations',
  los: [{ id: 'CCSS.HSA.REI.3' }, { id: 'NCERT.8.2' }],
  segments: [
    { kind: 'try_yourself', id: 'try-1', problem: 'Solve 2x = 8.', expectedAnswer: '4' },
    { kind: 'try_yourself', id: 'try-2', problem: 'Solve x + 3 = 5.', expectedAnswer: '2' },
  ],
};
/** Authored plan whose segment ids DO name its LOs (strict per-LO rule). */
const authoredPerLo: PlanLite = {
  id: 'authored-per-lo',
  topic: 'authored-topic',
  los: [{ id: 'auth.one' }, { id: 'auth.two' }],
  segments: [
    { kind: 'try_yourself', id: 'auth.one-try', problem: 'One?', expectedAnswer: '1' },
    { kind: 'try_yourself', id: 'auth.two-try', problem: 'Two?', expectedAnswer: '2' },
  ],
};

const bankRow = (id: string, loId: string, over: Partial<BankLite> = {}): BankLite => ({
  id, problemText: `Bank ${id}`, answer: '1', responseFormat: 'numeric', loId, ...over,
});

function sourcesOf(plans: PlanLite[], bank: BankLite[] = [], calls?: string[]): PracticeSources {
  return {
    plansForLoId: async (loId) => plans.filter((p) => p.los.some((l) => l.id === loId)),
    plansForTopic: async (topicId) => plans.filter((p) => p.topic === topicId),
    bankForLoId: async (loId, difficulty) => {
      calls?.push(loId);
      return bank.filter((b) => b.loId === loId && (!difficulty || b.difficulty === difficulty));
    },
    bankForTopic: async () => [],
  };
}

const req = (loId: string, count = 50, excludeIds?: string[]): RetrievePracticeRequest => ({
  studentId: 'stu-1', courseId: 'course-1', scope: { loId }, count, ...(excludeIds ? { excludeIds } : {}),
});
const ids = (r: { items: Array<{ id: string }> }) => r.items.map((i) => i.id);
const objectiveOfId = (id: string): number => Number(/\.lo-(\d+)-/.exec(id)?.[1] ?? /\.lo-(\d+)\./.exec(id)?.[1] ?? 0);
const draw = (loId: string, sources: PracticeSources, partnerId: string | undefined = P1, count = 50, excludeIds?: string[]) =>
  retrievePractice(req(loId, count, excludeIds), sources, NO_GEN_SOURCES, partnerId ? { partnerId } : undefined);

/** A real withdrawn step and a real audited step of the same production plan
 *  (the lists are data; the fixture plan is built around their ids). */
const REAL_PLAN = (() => {
  // A production plan with: objective 2's step audited, objective 3's step
  // withdrawn, objective 1's step on neither list.
  for (const id of AUDITED_LESSON_STEP_IDS) {
    const planId = id.slice(0, id.indexOf('::'));
    if (id === step(planId, 2) && WITHDRAWN_ITEM_IDS.has(step(planId, 3)) && !WITHDRAWN_ITEM_IDS.has(step(planId, 1))) return planId;
  }
  throw new Error('fixture: no plan with an audited lo-2 step and a withdrawn lo-3 step');
})();
const REAL_AUDITED = step(REAL_PLAN, 2);
const REAL_WITHDRAWN = step(REAL_PLAN, 3);

async function main(): Promise<void> {
  console.log('\nThe skill-scope rule (isSkillScopePlan):\n');

  await test('first LO of a generated course plan: yes; any other LO: no', () => {
    assert.equal(isSkillScopePlan(planA, lo(A, 1)), true);
    for (const k of [2, 3, 4]) assert.equal(isSkillScopePlan(planA, lo(A, k)), false);
    assert.equal(isSkillScopePlan(planA, lo(B, 1)), false);
  });

  await test('not a skill plan: authored, single-LO, review / freestyle / homework, materials / owner-stamped / picker, foreign LO ids', () => {
    assert.equal(isSkillScopePlan(authored, 'CCSS.HSA.REI.3'), false);
    assert.equal(isSkillScopePlan(authoredPerLo, 'auth.one'), false);
    assert.equal(isSkillScopePlan(genPlan(A, 1), lo(A, 1)), false);
    assert.equal(isSkillScopePlan(genPlan(A, 3, { privateKind: 'homework' }), lo(A, 1)), false);
    assert.equal(isSkillScopePlan(genPlan(A, 3, { privateKind: 'review' }), lo(A, 1)), false);
    const rev = genPlan('rev-11111111', 3);
    assert.equal(isSkillScopePlan(rev, rev.los[0].id), false);
    const free = genPlan('freestyle-1700000000000-abcd1234', 3);
    assert.equal(isSkillScopePlan(free, free.los[0].id), false);
    assert.equal(isSkillScopePlan(genPlan(A, 3, { studentOwned: true }), lo(A, 1)), false);
    // A plan whose LOs are not all its own (an expand clone keeps the source
    // plan's LO ids; a hostile / malformed row could name another plan's).
    const mixed = genPlan(A, 3);
    mixed.los[2] = { id: lo(B, 3) };
    assert.equal(isSkillScopePlan(mixed, lo(A, 1)), false);
    assert.equal(isSkillScopePlan({ ...planA, id: undefined }, lo(A, 1)), false);
  });

  await test('isStudentOwnedPlan reads the stored metadata; toPlanLite carries it', () => {
    assert.equal(isStudentOwnedPlan(undefined), false);
    assert.equal(isStudentOwnedPlan({ portalPartnerId: P1, cacheKey: 'k' }), false);
    assert.equal(isStudentOwnedPlan({ sourceKind: 'materials' }), true);
    assert.equal(isStudentOwnedPlan({ ownerStudentId: 'profile-1' }), true);
    assert.equal(isStudentOwnedPlan({ pendingPicker: true }), false);
    assert.equal(isStudentOwnedPlan({ pendingPicker: true, sourceKind: 'materials' }), true);
    assert.equal(isStudentOwnedPlan({ pendingPicker: true, ownerStudentId: 'profile-1' }), true);
    const stored = (metadata: Record<string, unknown>) => toPlanLite({
      id: A, title: 't', topic: 't', los: planA.los.map((l) => ({ id: l.id, description: 'd' })), segments: [], metadata,
    } as unknown as LessonPlan);
    assert.equal(stored({ portalPartnerId: P1 }).studentOwned, undefined);
    assert.equal(stored({ portalPartnerId: P1, sourceKind: 'materials' }).studentOwned, true);
    assert.equal(isSkillScopePlan(stored({ portalPartnerId: P1 }), lo(A, 1)), true);
    assert.equal(isSkillScopePlan(stored({ portalPartnerId: P1, ownerStudentId: 'x' }), lo(A, 1)), false);
  });

  await test('a pendingPicker COURSE plan (more objectives than one session holds) is a skill; a picker plan over student material is not', async () => {
    const PK = 'gen-dddddddd-0000-4000-8000-000000000004';
    const p = genPlan(PK, 7);
    const courseMeta = {
      allowedMaxLOs: 5, availableLOs: p.los.map((l) => ({ id: l.id, description: 'd' })),
      generatedFromText: true, generatorOk: true, pendingPicker: true, portalPartnerId: P1,
    };
    const stored = (metadata: Record<string, unknown>) => toPlanLite({
      id: PK, title: 't', topic: 't', los: p.los.map((l) => ({ id: l.id, description: 'd' })), segments: p.segments, metadata,
    } as unknown as LessonPlan);
    const course = stored(courseMeta);
    assert.equal(course.studentOwned, undefined);
    assert.equal(isSkillScopePlan(course, lo(PK, 1)), true);
    const r = await draw(lo(PK, 1), sourcesOf([course]));
    assert.deepEqual(ids(r).map(objectiveOfId), [1, 2, 3, 4, 5, 6, 7]);
    assert.ok(r.items.every((i) => i.loId === lo(PK, 1)));
    assert.deepEqual(ids(await draw(lo(PK, 3), sourcesOf([course]))), [step(PK, 3)]);
    // Same flag on a per-student plan: its own marker still excludes it.
    for (const own of [{ sourceKind: 'materials' }, { ownerStudentId: 'profile-1' }, { kind: 'homework-help' }]) {
      const mine = stored({ ...courseMeta, ...own });
      assert.equal(isSkillScopePlan(mine, lo(PK, 1)), false, JSON.stringify(own));
      assert.deepEqual(ids(await draw(lo(PK, 1), sourcesOf([mine]))), [step(PK, 1)], JSON.stringify(own));
    }
    // An unexpanded picker shell (intro + picker segments only) has no step
    // to serve under any objective.
    const shell = stored(courseMeta);
    shell.segments = [{ kind: 'hook', id: 'intro' }, { kind: 'concept', id: 'picker' }];
    assert.deepEqual(ids(await draw(lo(PK, 1), sourcesOf([shell]))), []);
  });

  await test('kill switch is default ON; only "off" disables', () => {
    assert.equal(skillScopeEnabled({}), true);
    assert.equal(skillScopeEnabled({ [FLAG]: 'on' }), true);
    assert.equal(skillScopeEnabled({ [FLAG]: '' }), true);
    assert.equal(skillScopeEnabled({ [FLAG]: 'off' }), false);
    assert.equal(skillScopeEnabled({ [FLAG]: ' OFF ' }), false);
  });

  console.log('\nRetrieval:\n');

  await test('skill request returns items from ALL objectives, valid on the wire', async () => {
    const r = await draw(lo(A, 1), sourcesOf([planA, planB]));
    assert.deepEqual([...ids(r)].sort(), [step(A, 1), step(A, 2), step(A, 2, 'try2'), step(A, 3), step(A, 4)].sort());
    RetrievePracticeResponseSchema.parse({ items: r.items });
    // Each item keeps its OWN question / key / hints / standard.
    const three = r.items.find((i) => i.id === step(A, 3));
    assert.equal(three?.problemText, 'Objective 3: compute 3 + 3.');
    assert.equal(three?.expectedAnswer, '6');
    assert.deepEqual(three?.hints, ['hint for objective 3']);
    assert.equal(three?.cedCode, 'STD.3');
  });

  await test('bank rows stored under ANY of the plan\'s LO ids are drawn, bank-first within an objective', async () => {
    const bank = [
      bankRow(`practice-gen.${lo(A, 1)}.h1`, lo(A, 1)),
      bankRow(`practice-gen.${lo(A, 3)}.h3`, lo(A, 3)),
      bankRow(`practice-gen.${lo(B, 1)}.hb`, lo(B, 1)),
    ];
    const calls: string[] = [];
    const r = await draw(lo(A, 1), sourcesOf([planA, planB], bank, calls));
    assert.deepEqual([...calls].sort(), [1, 2, 3, 4].map((k) => lo(A, k)));
    assert.ok(ids(r).includes(`practice-gen.${lo(A, 3)}.h3`));
    assert.ok(!ids(r).includes(`practice-gen.${lo(B, 1)}.hb`));
    assert.deepEqual(ids(r).slice(0, 4), [`practice-gen.${lo(A, 1)}.h1`, step(A, 2), `practice-gen.${lo(A, 3)}.h3`, step(A, 4)]);
  });

  await test('a request for a NON-first objective is exactly what it was (flag on = flag off)', async () => {
    const bank = [bankRow(`practice-gen.${lo(A, 1)}.h1`, lo(A, 1)), bankRow(`practice-gen.${lo(A, 2)}.h2`, lo(A, 2))];
    for (const k of [2, 3, 4]) {
      const on = await draw(lo(A, k), sourcesOf([planA, planB], bank));
      process.env[FLAG] = 'off';
      const off = await draw(lo(A, k), sourcesOf([planA, planB], bank));
      delete process.env[FLAG];
      assert.deepEqual(on, off);
      assert.ok(on.items.every((i) => i.loId === lo(A, k)));
    }
    const two = await draw(lo(A, 2), sourcesOf([planA], bank));
    assert.deepEqual(ids(two), [`practice-gen.${lo(A, 2)}.h2`, step(A, 2), step(A, 2, 'try2')]);
  });

  await test('authored content is unchanged (alias-LO plan, per-LO plan, bank-only LO)', async () => {
    const bank = [bankRow('alg1.bank.01', 'CCSS.HSA.REI.3'), bankRow('auth.bank.01', 'auth.one')];
    const src = () => sourcesOf([authored, authoredPerLo, planA], bank);
    for (const l of ['CCSS.HSA.REI.3', 'NCERT.8.2', 'auth.one', 'auth.two', 'no.such.lo']) {
      const on = await draw(l, src(), undefined);
      process.env[FLAG] = 'off';
      const off = await draw(l, src(), undefined);
      delete process.env[FLAG];
      assert.deepEqual(on, off, l);
    }
    assert.deepEqual(ids(await draw('CCSS.HSA.REI.3', src(), undefined)), ['alg1.bank.01', 'alg1-linear-equations::try-1', 'alg1-linear-equations::try-2']);
    assert.deepEqual(ids(await draw('auth.one', src(), undefined)), ['auth.bank.01', 'authored-per-lo::auth.one-try']);
  });

  await test('flag off restores the per-LO behaviour for the skill LO', async () => {
    const bank = [bankRow(`practice-gen.${lo(A, 1)}.h1`, lo(A, 1)), bankRow(`practice-gen.${lo(A, 3)}.h3`, lo(A, 3))];
    process.env[FLAG] = 'off';
    const calls: string[] = [];
    const off = await draw(lo(A, 1), sourcesOf([planA, planB], bank, calls));
    assert.deepEqual(ids(off), [`practice-gen.${lo(A, 1)}.h1`, step(A, 1)]);
    assert.deepEqual(calls, [lo(A, 1)]);
  });

  console.log('\nNo cross-plan leak:\n');

  await test('a skill never serves another plan\'s items, in either direction', async () => {
    const bank = [bankRow(`practice-gen.${lo(A, 2)}.h2`, lo(A, 2)), bankRow(`practice-gen.${lo(B, 2)}.hb2`, lo(B, 2))];
    const a = await draw(lo(A, 1), sourcesOf([planA, planB], bank));
    assert.ok(a.items.length > 0 && ids(a).every((id) => id.includes(A) && !id.includes(B)));
    const b = await draw(lo(B, 1), sourcesOf([planA, planB], bank));
    assert.ok(b.items.length > 0 && ids(b).every((id) => id.includes(B) && !id.includes(A)));
    assert.deepEqual([...ids(b)].sort(), [`practice-gen.${lo(B, 2)}.hb2`, step(B, 1), step(B, 2), step(B, 3)].sort());
  });

  await test('a second plan that also lists the skill LO contributes only that LO\'s own segments', async () => {
    // C lists A's lo-1 among its LOs (the pre-10-04 leak shape).
    const C = 'gen-cccccccc-0000-4000-8000-000000000003';
    const planC: PlanLite = {
      id: C, topic: 'c', partnerId: P1,
      los: [{ id: lo(C, 1) }, { id: lo(A, 1) }],
      segments: [
        { kind: 'try_yourself', id: `${lo(C, 1)}-try`, problem: 'C own objective.', expectedAnswer: 'c' },
        { kind: 'try_yourself', id: `${lo(C, 2)}-try`, problem: 'C unattributable.', expectedAnswer: 'c2' },
      ],
    };
    const a = await draw(lo(A, 1), sourcesOf([planA, planC]));
    assert.ok(ids(a).every((id) => !id.startsWith(C)), ids(a).join(','));
    // And C is not skill-scoped itself (its LOs are not all its own).
    const c = await draw(lo(C, 1), sourcesOf([planA, planC]));
    assert.deepEqual(ids(c), [`${C}::${lo(C, 1)}-try`]);
  });

  console.log('\nExisting filters still apply to items from other objectives:\n');

  await test('partner stamp: another partner and an unknown caller get nothing', async () => {
    const bankless = sourcesOf([planA]);
    assert.deepEqual(ids(await draw(lo(A, 1), bankless, P2)), []);
    assert.deepEqual(ids(await retrievePractice(req(lo(A, 1)), bankless, NO_GEN_SOURCES)), []);
    assert.equal((await draw(lo(A, 1), bankless, P1)).items.length, 5);
  });

  await test('withdrawn step of another objective is never served (real list entry)', async () => {
    assert.ok(WITHDRAWN_ITEM_IDS.has(REAL_WITHDRAWN));
    const real = genPlan(REAL_PLAN, 3);
    const r = await draw(lo(REAL_PLAN, 1), sourcesOf([real]));
    assert.ok(!ids(r).includes(REAL_WITHDRAWN));
    assert.deepEqual([...ids(r)].sort(), [step(REAL_PLAN, 1), step(REAL_PLAN, 2)].sort());
  });

  await test('unverified key, drawing-only and off-topic steps of other objectives are dropped', async () => {
    const p = genPlan(A, 5);
    const seg = (k: number) => p.segments.find((s) => s.id === `${lo(A, k)}-try`) as PlanLite['segments'][number];
    seg(2).keyCheck = { status: 'mismatch' };
    seg(3).problem = 'Graph the line.';
    seg(4).offTopic = true;
    seg(5).keyCheck = { status: 'verified' };
    const r = await draw(lo(A, 1), sourcesOf([p]));
    assert.deepEqual([...ids(r)].sort(), [step(A, 1), step(A, 5)].sort());
  });

  await test('withdrawn bank row under another objective is dropped', async () => {
    const withdrawnBank = [...WITHDRAWN_ITEM_IDS].find((id) => !id.includes('::')) as string;
    const bank = [bankRow(withdrawnBank, lo(A, 3)), bankRow('ok.row', lo(A, 3))];
    const r = await draw(lo(A, 1), sourcesOf([planA], bank));
    assert.ok(!ids(r).includes(withdrawnBank));
    assert.ok(ids(r).includes('ok.row'));
  });

  console.log('\nAudited-only partner (lesson steps of objectives 2..N):\n');

  await test('the committed list: every id is a non-first-objective generated step, none withdrawn, sorted', () => {
    const file = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'audited-lesson-steps.json'), 'utf8')) as { generatedAt: string; source: string; items: Record<string, string> };
    const listed = Object.keys(file.items);
    // The ONE pin of the committed count — update it when the list is rebuilt.
    assert.equal(listed.length, 678);
    assert.equal(AUDITED_LESSON_STEP_IDS.size, listed.length);
    assert.match(file.generatedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(file.source.length > 0);
    for (const id of listed) {
      assert.equal(file.items[id], 'AUDITED');
      assert.ok((lessonStepObjective(id) ?? 0) >= 2, id);
      assert.ok(!WITHDRAWN_ITEM_IDS.has(id), id);
    }
    assert.deepEqual(listed, [...listed].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    // The builder accepts its own output's ids (round trip).
    assert.deepEqual(buildAuditedLessonStepList(listed, file.generatedAt, file.source, WITHDRAWN_ITEM_IDS), file);
  });

  await test('builder: validates id shape, objective ≥ 2, duplicates, withdrawn; reads json / jsonl / csv with a tier filter', () => {
    const none = new Set<string>();
    const good = step(A, 2);
    assert.deepEqual(Object.keys(buildAuditedLessonStepList([step(A, 3), good], '2026-10-08', 's', none).items), [good, step(A, 3)]);
    assert.throws(() => buildAuditedLessonStepList([''], 'd', 's', none), /empty id/);
    assert.throws(() => buildAuditedLessonStepList([step(A, 1)], 'd', 's', none), /objective-1/);
    assert.throws(() => buildAuditedLessonStepList([`${A}::${lo(B, 2)}-try`], 'd', 's', none), /not a generated-plan lesson step/);
    assert.throws(() => buildAuditedLessonStepList([`practice-gen.${lo(A, 2)}.h`], 'd', 's', none), /not a generated-plan lesson step/);
    assert.throws(() => buildAuditedLessonStepList(['alg1-linear-equations::try-1'], 'd', 's', none), /not a generated-plan lesson step/);
    assert.throws(() => buildAuditedLessonStepList([good, good], 'd', 's', none), /duplicate/);
    assert.throws(() => buildAuditedLessonStepList([good], 'd', 's', new Set([good])), /withdrawn/);
    assert.throws(() => buildAuditedLessonStepList([REAL_WITHDRAWN], 'd', 's', WITHDRAWN_ITEM_IDS), /withdrawn/);
    const rows = [{ id: good, tier: 'two_model_ok' }, { id: step(A, 3), tier: 'claude_only' }, { id: step(A, 4), tier: 'no_audit' }];
    assert.deepEqual(readLessonStepIds(JSON.stringify(rows), 'x.json', 'two_model_ok'), [good]);
    assert.deepEqual(readLessonStepIds(JSON.stringify(rows), 'x.json'), rows.map((r) => r.id));
    assert.deepEqual(readLessonStepIds(rows.map((r) => JSON.stringify(r)).join('\n'), 'x.jsonl', 'claude_only'), [step(A, 3)]);
    assert.deepEqual(readLessonStepIds(`id,tier\n${good},two_model_ok\n${step(A, 3)},no_audit\n`, 'x.csv', 'two_model_ok'), [good]);
    assert.deepEqual(readLessonStepIds(JSON.stringify([good]), 'x.json'), [good]);
    assert.throws(() => readLessonStepIds(JSON.stringify([good]), 'x.json', 'two_model_ok'), /tier/);
    assert.throws(() => readLessonStepIds('{}', 'x.json'), /array/);
  });

  await test('predicates: only a LISTED partner is gated; withdrawn wins', () => {
    assert.equal(isAuditedLessonStep(REAL_AUDITED), true);
    assert.equal(isAuditedLessonStep(step(A, 2)), false);
    assert.equal(lessonStepServableToPartner(step(A, 2), P1), true);
    process.env[AUDITED_ONLY_PARTNERS_ENV] = `other, ${P1.toUpperCase()}`;
    assert.equal(lessonStepServableToPartner(step(A, 2), P1), false);
    assert.equal(lessonStepServableToPartner(REAL_AUDITED, P1), true);
    assert.equal(lessonStepServableToPartner(REAL_WITHDRAWN, P1), false);
    assert.equal(lessonStepServableToPartner(step(A, 2), P2), true);
    assert.equal(lessonStepServableToPartner(step(A, 2), undefined), true);
    const items = [{ id: REAL_AUDITED }, { id: step(A, 2) }];
    assert.equal(withoutUnauditedLessonSteps(items, P2, 't'), items);
    assert.deepEqual(withoutUnauditedLessonSteps(items, P1, 't'), [{ id: REAL_AUDITED }]);
  });

  await test('listed partner: unaudited steps of objectives 2..N are not served; objective 1 and audited steps are', async () => {
    // Objectives of the real plan: lo-2 is on the audited list, lo-3 is
    // withdrawn; pick a K whose step is on NEITHER list as the unaudited one.
    const K = [4, 5, 6, 7, 8, 9].find((k) => !AUDITED_LESSON_STEP_IDS.has(step(REAL_PLAN, k)) && !WITHDRAWN_ITEM_IDS.has(step(REAL_PLAN, k))) as number;
    assert.ok(K, 'fixture needs an unlisted objective');
    const real = genPlan(REAL_PLAN, K);
    const unlisted = Array.from({ length: K - 1 }, (_, i) => i + 2).filter((k) => !AUDITED_LESSON_STEP_IDS.has(step(REAL_PLAN, k)));
    const bank = [bankRow(`practice-gen.${lo(REAL_PLAN, 2)}.unaudited`, lo(REAL_PLAN, 2)), bankRow('authored.row', lo(REAL_PLAN, 2))];

    const open = await draw(lo(REAL_PLAN, 1), sourcesOf([real], bank));
    assert.ok(ids(open).includes(step(REAL_PLAN, K)), 'not listed ⇒ served to an ordinary partner');
    assert.ok(ids(open).includes(`practice-gen.${lo(REAL_PLAN, 2)}.unaudited`));

    process.env[AUDITED_ONLY_PARTNERS_ENV] = P1;
    const gated = await draw(lo(REAL_PLAN, 1), sourcesOf([real], bank));
    assert.ok(ids(gated).includes(step(REAL_PLAN, 1)), 'objective 1 is not gated');
    assert.ok(ids(gated).includes(REAL_AUDITED), 'audited step served');
    assert.ok(ids(gated).includes('authored.row'), 'authored bank row untouched');
    for (const k of unlisted) assert.ok(!ids(gated).includes(step(REAL_PLAN, k)), `objective ${k} step is unaudited`);
    assert.ok(!ids(gated).includes(REAL_WITHDRAWN));
    assert.ok(!ids(gated).includes(`practice-gen.${lo(REAL_PLAN, 2)}.unaudited`), 'unaudited generated row');
    assert.ok(gated.items.every((i) => i.loId === lo(REAL_PLAN, 1)));

    // A partner that is not listed is unaffected by the switch.
    const other = genPlan(REAL_PLAN, K, { partnerId: P2 });
    assert.deepEqual(ids(await draw(lo(REAL_PLAN, 1), sourcesOf([other], bank), P2)), ids(open));
    // Flag off for the listed partner: objective 1 only, as before.
    process.env[FLAG] = 'off';
    assert.deepEqual(ids(await draw(lo(REAL_PLAN, 1), sourcesOf([real], bank))), [step(REAL_PLAN, 1)]);
  });

  await test('listed partner: nothing is generated, and an unaudited step is never an anchor', async () => {
    process.env[AUDITED_ONLY_PARTNERS_ENV] = P1;
    process.env.PRACTICE_GEN = 'on';
    let generateCalls = 0;
    const gen: PracticeGenSources = {
      async generateAndVerify() { generateCalls++; return null; },
      async reserve() { generateCalls++; return 2; },
      async persist() {},
    };
    const r = await retrievePractice(req(lo(A, 1), 50), sourcesOf([planA]), gen, { partnerId: P1 });
    assert.deepEqual(ids(r), [step(A, 1)]); // fixture plan A has no audited step
    assert.equal(generateCalls, 0);
  });

  console.log('\nObjective spread:\n');

  await test('spreadAcrossObjectives: one per objective before any repeat; least-seen first; stable', () => {
    const of = new Map([['a1', 'o1'], ['a2', 'o1'], ['a3', 'o1'], ['b1', 'o2'], ['c1', 'o3'], ['c2', 'o3']]);
    const items = ['a1', 'a2', 'a3', 'b1', 'c1', 'c2'].map((id) => ({ id }));
    const order = ['o1', 'o2', 'o3'];
    const out = (seen?: Map<string, number>) => spreadAcrossObjectives(items, of, order, seen).map((i) => i.id);
    assert.deepEqual(out(), ['a1', 'b1', 'c1', 'a2', 'c2', 'a3']);
    assert.deepEqual(out(), out());
    assert.deepEqual(out(new Map([['o1', 2]])), ['b1', 'c1', 'c2', 'a1', 'a2', 'a3']);
    assert.deepEqual(spreadAcrossObjectives([], of, order), []);
    // An item with no known objective is counted under the first one.
    assert.deepEqual(spreadAcrossObjectives([{ id: 'x' }, { id: 'b1' }], of, order).map((i) => i.id), ['x', 'b1']);
  });

  await test('fewer items than available: the set covers distinct objectives first', async () => {
    const bank = [1, 2, 3, 4, 5, 6].map((n) => bankRow(`practice-gen.${lo(A, 1)}.h${n}`, lo(A, 1)));
    const src = sourcesOf([planA], bank);
    const four = await draw(lo(A, 1), src, P1, 4);
    assert.deepEqual(ids(four).map(objectiveOfId), [1, 2, 3, 4]);
    const two = await draw(lo(A, 1), src, P1, 2);
    assert.deepEqual(ids(two), ids(four).slice(0, 2));
    // Deterministic for the same request.
    assert.deepEqual(await draw(lo(A, 1), src, P1, 4), four);
    // Pre-change behaviour for contrast: objective 1 only, bank first.
    process.env[FLAG] = 'off';
    assert.deepEqual(ids(await draw(lo(A, 1), src, P1, 4)).map(objectiveOfId), [1, 1, 1, 1]);
  });

  await test('successive requests (excludeIds grows as the portal sends it) work through every objective', async () => {
    // Objective 1 is deep (6 generated rows + its step); 2..4 have 1–2 steps.
    const bank = [1, 2, 3, 4, 5, 6].map((n) => bankRow(`practice-gen.${lo(A, 1)}.h${n}`, lo(A, 1)));
    const src = sourcesOf([planA], bank);
    const seen: string[] = [];
    const draws: number[][] = [];
    for (let i = 0; i < 6; i++) {
      const r = await draw(lo(A, 1), src, P1, 2, seen.length ? [...seen] : undefined);
      if (r.items.length === 0) break;
      assert.ok(r.items.every((it) => !seen.includes(it.id)), 'no repeat');
      seen.push(...ids(r));
      draws.push(ids(r).map(objectiveOfId));
    }
    assert.deepEqual(draws.slice(0, 2), [[1, 2], [3, 4]], 'all four objectives met in the first two draws of 2');
    assert.deepEqual(draws[2], [1, 2], 'then round again: objective 2 has a second step');
    assert.equal(new Set(seen).size, 11, 'the whole pool (6 rows + 5 steps) is reachable');
    assert.equal(seen.length, 11);
  });

  console.log('\nAttribution stays on the skill:\n');

  await test('every item is returned with loId = the requested skill LO', async () => {
    const bank = [bankRow(`practice-gen.${lo(A, 3)}.h3`, lo(A, 3))];
    const r = await draw(lo(A, 1), sourcesOf([planA], bank));
    assert.equal(r.items.length, 6);
    assert.ok(r.items.every((i) => i.loId === lo(A, 1)));
    // The objective stays readable in the id.
    assert.deepEqual([...new Set(ids(r).map(objectiveOfId))].sort(), [1, 2, 3, 4]);
  });

  await test('generation (daily cap, stored row) is keyed on the skill LO', async () => {
    process.env.PRACTICE_GEN = 'on';
    const reserved: Array<[string, string]> = [];
    const persisted: string[] = [];
    let anchors: string[] = [];
    const gen: PracticeGenSources = {
      async generateAndVerify(input: unknown) {
        const a = (input as { anchor?: { id?: string } | null })?.anchor;
        if (a?.id) anchors.push(a.id);
        return null;
      },
      async reserve(studentId, loId) { reserved.push([studentId, loId]); return 0; },
      async persist(row) { persisted.push(row.loId); },
    };
    anchors = [];
    const r = await retrievePractice(req(lo(A, 1), 20), sourcesOf([planA]), gen, { partnerId: P1 });
    assert.equal(r.items.length, 5);
    assert.deepEqual(reserved, [['stu-1', lo(A, 1)]]);
    assert.deepEqual(persisted, []);
  });

  await test('assessment and homework resolution record the skill LO, with items from other objectives', async () => {
    const set = await buildAssessment(
      { studentId: 'stu-1', courseId: 'c', loIds: [lo(A, 1)], maxPerLo: 4 },
      sourcesOf([planA]), NO_GEN_SOURCES, { partnerId: P1 },
    );
    assert.deepEqual(set.items.map((i) => objectiveOfId(i.itemId)), [1, 2, 3, 4]);
    assert.ok(set.items.every((i) => i.loId === lo(A, 1)));

    const hw = await resolveAssignmentItems(
      { los: [{ loId: lo(A, 1), title: 'Skill A' }], band: 'developing' as never, seenItemIds: [], studentId: 'stu-1', courseId: 'c' },
      { ...sourcesOf([planA]), caller: { partnerId: P1 } },
    );
    assert.equal(hw.length, 1);
    assert.equal(hw[0].loId, lo(A, 1));
    assert.deepEqual(hw[0].items.map((i) => objectiveOfId(i.id)), [1, 2, 3, 4]);
    assert.ok(hw[0].items.every((i) => i.loId === lo(A, 1)));
  });

  console.log('\nGrading an item from another objective:\n');

  const storedA = {
    id: A, title: 'Skill A', topic: 't', metadata: { portalPartnerId: P1 },
    los: planA.los.map((l) => ({ id: l.id, description: 'd' })),
    segments: planA.segments.map((s) => ({ ...s, rubric: null, modelResponse: null })),
  } as unknown as LessonPlan;
  const keyDeps: ItemKeyDeps = {
    getStoredPlan: async (planId) => (planId === A ? storedA : null),
    findBankRow: async () => null,
  };

  await test('an objective-3 item id resolves to ITS OWN key and hints', async () => {
    const g = await resolveGradeItem(step(A, 3), keyDeps);
    assert.equal(g?.itemId, step(A, 3));
    assert.equal(g?.expectedAnswer, '6');
    assert.equal(g?.problemText, 'Objective 3: compute 3 + 3.');
    const k = await resolveAssessmentItem(step(A, 3), keyDeps);
    assert.equal(k?.expectedAnswer, '6');
    assert.deepEqual(k?.hints, ['hint for objective 3']);
    assert.equal((await resolveAssessmentItem(step(A, 2, 'try2'), keyDeps))?.expectedAnswer, '20');
    // Never another plan's segment of the same name.
    assert.equal(await resolveGradeItem(step(B, 3), keyDeps), null);
  });

  await test('graded against its own key, evidence recorded against the SKILL LO', async () => {
    const noJudge = {
      gradeRubricPart: async () => { throw new Error('no model in tests'); },
      judgeSingleAnswer: async () => { throw new Error('no model in tests'); },
    } as never;
    const out = await gradeAssessmentResponses(
      {
        sessionId: 'quiz-1',
        responses: [
          { itemId: step(A, 3), loId: lo(A, 1), response: { text: '6' } },
          { itemId: step(A, 4), loId: lo(A, 1), response: { text: '6' } }, // objective 4's key is 8
        ],
      },
      noJudge,
      (itemId) => resolveAssessmentItem(itemId, keyDeps),
      { studentId: 'profile-1', partnerId: P1, source: 'diagnostic' as never, occurredAt: new Date(0) },
    );
    assert.deepEqual(out.review.map((r) => [r.itemId, r.correct, r.loId]), [[step(A, 3), true, lo(A, 1)], [step(A, 4), false, lo(A, 1)]]);
    assert.deepEqual([...out.perLo.keys()], [lo(A, 1)]);
    assert.deepEqual(out.perLo.get(lo(A, 1)), { awarded: 1, max: 2, judgedAwarded: 1, judgedMax: 2 });
    assert.deepEqual(out.evidenceInputs.map((e) => [e.loId, e.itemId, e.outcome]), [[lo(A, 1), step(A, 3), 1], [lo(A, 1), step(A, 4), 0]]);
  });

  console.log('\nCoverage report (pure helper):\n');

  const doc = (planId: string, objectives: number, metadata: Record<string, unknown>, mutate?: (segs: Array<Record<string, unknown>>) => void) => {
    const p = genPlan(planId, objectives);
    const segments = p.segments.map((s) => ({ ...s, hints: null, choices: null })) as Array<Record<string, unknown>>;
    mutate?.(segments);
    return { _id: planId, title: p.title, topic: p.topic, los: p.los.map((l, i) => ({ id: l.id, description: `Objective ${i + 1}` })), segments, metadata };
  };

  await test('per skill: objectives, servable items per objective, objectives with none', async () => {
    const before = process.env[AUDITED_ONLY_PARTNERS_ENV];
    const dump = {
      plans: [
        doc(A, 4, { portalPartnerId: P1 }, (segs) => {
          (segs.find((s) => s.id === `${lo(A, 3)}-try`) as Record<string, unknown>).keyCheck = { status: 'mismatch' };
        }),
        doc(B, 2, { portalPartnerId: P1, sourceKind: 'materials' }), // not a skill
        { _id: 'rev-1', los: [{ id: lo(A, 1) }], segments: [], metadata: { reviewPlan: true } },
        doc(REAL_PLAN, 3, { portalPartnerId: P1 }),
      ],
      bank: [
        { id: `practice-gen.${lo(A, 1)}.h1`, loId: lo(A, 1), problemText: 'q', answer: '1', hints: null, bankScope: null },
        { id: `practice-gen.${lo(A, 1)}.mock`, loId: lo(A, 1), problemText: 'q', answer: '1', bankScope: 'mock' },
        { id: `brain-gen.${lo(A, 1)}.x`, loId: lo(A, 1), problemText: 'q', answer: '1' },
      ],
    };
    const rows = await skillCoverage(dump);
    assert.deepEqual(rows.map((r) => r.skillLoId), [lo(A, 1), lo(REAL_PLAN, 1)]);
    const a = rows[0];
    assert.equal(a.partnerId, P1);
    assert.deepEqual(a.objectives.map((o) => [o.servable, o.servableSteps, o.servableBank, o.authoredSteps]), [[2, 1, 1, 1], [1, 1, 0, 1], [0, 0, 0, 1], [1, 1, 0, 1]]);
    assert.deepEqual(a.zeroObjectives, [lo(A, 3)]);
    assert.equal(a.objectives[0].description, 'Objective 1');
    assert.equal(a.servable, 4);
    // The real plan: objective 3's step is withdrawn.
    assert.deepEqual(rows[1].zeroObjectives, [lo(REAL_PLAN, 3)]);
    assert.deepEqual(summarizeCoverage(rows), { skills: 2, objectives: 7, servable: 6, servableFigures: 0, objectivesWithZero: 2, skillsWithAZeroObjective: 2, skillsWithNothing: 0 });

    // Audited-only: fixture plan A has no audited step → objectives 2..4 empty,
    // and its generated row is unaudited; the real plan keeps lo-1 + lo-2.
    const gated = await skillCoverage(dump, { auditedOnly: true });
    assert.deepEqual(gated[0].objectives.map((o) => o.servable), [1, 0, 0, 0]);
    assert.deepEqual(gated[1].objectives.map((o) => o.servable), [1, 1, 0]);
    assert.equal(process.env[AUDITED_ONLY_PARTNERS_ENV], before, 'the switch is restored');

    // Another partner sees none of a stamped plan; --skills restricts.
    const p2 = await skillCoverage(dump, { partnerId: P2 });
    // (Generated bank rows are LO-global by design, so A's lo-1 row still shows.)
    assert.ok(p2.every((r) => r.objectives.every((o) => o.servableSteps === 0)));
    assert.deepEqual(p2.map((r) => r.servable), [1, 0]);
    assert.deepEqual((await skillCoverage(dump, { skillLoIds: [lo(REAL_PLAN, 1)] })).map((r) => r.planId), [REAL_PLAN]);
    await assert.rejects(() => skillCoverage({ plans: [doc(A, 3, {})], bank: [] }, { auditedOnly: true }), /needs a partner/);
  });

  console.log('\nProduction adapter (mongoPracticeSources over stubbed Mongo — no connection):\n');

  await test('stored course plan: skill LO draws every objective + bank rows under each LO id', async () => {
    const storedDocs: LessonPlan[] = [storedA];
    (LessonPlanModel as unknown as {
      find: (filter: Record<string, unknown>) => { limit: (n: number) => Promise<Array<{ toJSON: () => LessonPlan }>> };
    }).find = (filter) => {
      const loId = filter['los.id'] as string;
      return { limit: async () => storedDocs.filter((p) => p.los.some((l) => l.id === loId)).map((p) => ({ toJSON: () => ({ ...p }) })) };
    };
    const bankFilters: string[] = [];
    (ProblemBank as unknown as {
      find: (filter: Record<string, unknown>) => { limit: () => { lean: () => Promise<unknown[]> } };
    }).find = (filter) => {
      bankFilters.push(filter.loId as string);
      const rows = filter.loId === lo(A, 4) ? [{ id: `practice-gen.${lo(A, 4)}.h4`, problemText: 'q4', answer: '4', loId: lo(A, 4) }] : [];
      return { limit: () => ({ lean: async () => rows }) };
    };
    const r = await retrievePractice(req(lo(A, 1), 4), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: P1 });
    RetrievePracticeResponseSchema.parse({ items: r.items });
    assert.deepEqual(ids(r), [step(A, 1), step(A, 2), step(A, 3), `practice-gen.${lo(A, 4)}.h4`]);
    assert.ok(r.items.every((i) => i.loId === lo(A, 1)));
    assert.deepEqual([...bankFilters].sort(), [1, 2, 3, 4].map((k) => lo(A, k)));
    // Another partner: nothing.
    assert.deepEqual(ids(await retrievePractice(req(lo(A, 1), 4), mongoPracticeSources(), NO_GEN_SOURCES, { partnerId: P2 })), []);
    assert.ok(connectCalls > 0, 'the adapter went through connectDB to the stubbed mongoose.connect');
    assert.ok(connectUris.every((u) => u === NO_DB_URI), 'only ever the unresolvable test URI');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
