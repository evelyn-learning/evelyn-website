/**
 * Practice / assessment plan scoping — which lesson plans may feed SHARED
 * practice items, and under which LO.
 *
 * Defect this pins (traced in production): a student of one partner brand was
 * served a try-yourself (with a wrong, unverified answer key) out of ANOTHER
 * brand's student's private review plan (`rev-<uuid>`), because the
 * stored-plan lookup matched on `los.id` alone and `planToItems` emitted every
 * try-yourself of a matching plan under the requested LO.
 *
 * Rules under test (portal/practice.ts):
 *   1. per-student artefacts (review / freestyle / homework plans) are never a
 *      shared source — only a request for the plan's OWN plan-scoped LO
 *      (`<planId>.…`) reaches them;
 *   2. a plan stamped with a partner is served only to that partner; an
 *      unknown caller gets no partner-stamped plan (fail closed);
 *   3. in a multi-LO plan a try-yourself is served only under the LO its
 *      segment id names (`<loId>-try`); unattributable → not served;
 *   4. grading of ALREADY-issued item ids is untouched.
 *
 * No database: pure fakes for the core; `connectDB`, `LessonPlanModel.find`
 * and `ProblemBank.find` are stubbed for the adapter section (same convention
 * as scripts/test-practice-generated-plans.ts).
 *
 * Run (ts-node/commonjs — the module stubs below do not take under tsx's ESM
 * namespaces, same as test:practice-gen-plans):
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/test-practice-plan-scoping.ts
 */
import { strict as assert } from 'node:assert';
import {
  retrievePractice,
  classifyPrivatePlan,
  segmentOwnerLoId,
  type PracticeSources,
  type PlanLite,
  type BankLite,
} from '@/lib/tutor/portal/practice';
import type { PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import { buildAssessment } from '@/lib/tutor/portal/assessment';
import { mongoPracticeSources, resolveGradeItem, resolveAssessmentItem, type ItemKeyDeps } from '@/lib/tutor/portal/adapters';
import { resolveAssignmentItems } from '@/lib/tutor/practice-assign/resolve';
import { createDraftOnEmit, buildSessionEventsWrite, PRACTICE_SESSION_EVENT_TYPES, PRACTICE_SESSION_EVENTS_PER_SESSION_MAX } from '@/lib/tutor/practice-assign/emit-draft';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';
import { buildHomeworkPlanFields, homeworkLoIdFor } from '@/lib/tutor/lesson-plan/homework';
import { LessonPlanModel } from '@/models/LessonPlan';
import { ProblemBank } from '@/models/ProblemBank';
import * as dbModule from '@core/db';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

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
  } finally {
    delete process.env.PRACTICE_GEN;
  }
}

// ---------------------------------------------------------------------------
// Fixtures — pure core
// ---------------------------------------------------------------------------

const PORTAL_LO = 'g8.math.real-numbers-operations';
const PORTAL_LO_2 = 'g8.math.two-step-equations';

/** Shape of compose-review-plan.ts output: real portal LO ids in los[],
 *  `<loId>-recall` / `<loId>-try` segments, minted for ONE student. */
const reviewPlan: PlanLite = {
  id: 'rev-11111111-2222-3333-4444-555555555555',
  topic: 'review-topic',
  privateKind: 'review',
  los: [{ id: PORTAL_LO }, { id: PORTAL_LO_2 }],
  segments: [
    { kind: 'concept', id: `${PORTAL_LO}-recall` },
    { kind: 'try_yourself', id: `${PORTAL_LO}-try`, problem: 'Simplify 3 + (-5).', expectedAnswer: 'WRONG-KEY' },
    { kind: 'concept', id: `${PORTAL_LO_2}-recall` },
    { kind: 'try_yourself', id: `${PORTAL_LO_2}-try`, problem: 'Solve 2x + 3 = 11.', expectedAnswer: '5' },
  ],
};

const GEN_A = 'gen-aaaaaaaa';
const genPlanA: PlanLite = {
  id: GEN_A,
  topic: 'Fractions',
  partnerId: 'partnerA',
  los: [{ id: `${GEN_A}.lo-1` }],
  segments: [{ kind: 'try_yourself', id: `${GEN_A}.lo-1-try`, problem: 'What is 1/2 + 1/4?', expectedAnswer: '3/4' }],
};

const GEN_5 = 'gen-55555555';
const fiveLoPlan: PlanLite = {
  id: GEN_5,
  topic: 'Algebra',
  los: [1, 2, 3, 4, 5].map((n) => ({ id: `${GEN_5}.lo-${n}` })),
  segments: [
    { kind: 'hook', id: 'intro' },
    ...[1, 2, 3, 4, 5].flatMap((n) => [
      { kind: 'concept', id: `${GEN_5}.lo-${n}-concept` },
      { kind: 'try_yourself', id: `${GEN_5}.lo-${n}-try`, problem: `Problem for objective ${n}?`, expectedAnswer: String(n) },
    ]),
    // LO 2 carries the review composer's easier second rep too.
    { kind: 'try_yourself', id: `${GEN_5}.lo-2-try2`, problem: 'Easier problem for objective 2?', expectedAnswer: '2' },
    // The model free-styled an id: no LO can be read off it.
    { kind: 'try_yourself', id: 'bonus-challenge', problem: 'Unattributable bonus?', expectedAnswer: 'x' },
    { kind: 'recap', id: 'recap' },
  ],
};

const HW = 'gen-hhhhhhhh';
const HW_LO = `${HW}.homework-lo-1`;
/** Homework plan (plan-generate route): ONE wrapper LO, a concept + recap
 *  segment, no try-yourselves; stamped with the partner that created it. */
const homeworkPlan: PlanLite = {
  id: HW,
  topic: 'Linear equations worksheet',
  partnerId: 'partnerA',
  privateKind: 'homework',
  los: [{ id: HW_LO }],
  segments: [{ kind: 'concept', id: 'homework' }, { kind: 'recap', id: 'recap' }],
};
const hwBank: BankLite[] = [
  { id: `practice-gen.${HW_LO}.aaa111`, problemText: 'Solve 3x = 12.', answer: '4', responseFormat: 'numeric', difficulty: 2, loId: HW_LO },
  { id: `practice-gen.${HW_LO}.bbb222`, problemText: 'Solve x + 7 = 9.', answer: '2', responseFormat: 'numeric', difficulty: 2, loId: HW_LO },
];

const SEED_LO = 'apstats.normal-distribution';
const seedLikePlan: PlanLite = {
  id: 'evelyn.ap.stats.normal.v1',
  topic: 'ap-statistics',
  los: [{ id: SEED_LO, standard: 'AP-STATS-1.10' }],
  segments: [
    { kind: 'try_yourself', id: 'try-1', problem: 'Find the z-score for x = 13.', expectedAnswer: '1.5' },
    { kind: 'try_yourself', id: 'try-2', problem: 'Explain what the area represents.', responseFormat: 'frq' },
  ],
};
const seedBank: BankLite = {
  id: 'openstax.stats.0042', problemText: 'Bank normal problem', answer: '0.84', responseFormat: 'mcq',
  choices: ['0.84', '0.16'], difficulty: 2, loId: SEED_LO, cedCode: 'AP-STATS-1.10',
};

class FakeSources implements PracticeSources {
  constructor(private plans: PlanLite[] = [], private bank: BankLite[] = []) {}
  async plansForLoId(loId: string) {
    return this.plans.filter((p) => p.los.some((l) => l.id === loId));
  }
  async plansForTopic(topicId: string) {
    return this.plans.filter((p) => p.topic === topicId);
  }
  async bankForLoId(loId: string) {
    return this.bank.filter((b) => b.loId === loId);
  }
  async bankForTopic() {
    return this.bank;
  }
}

function req(loId: string, over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest {
  return { studentId: 's1', courseId: 'c1', scope: { loId }, count: 10, ...over };
}

/** Generator spy: records the topics generate-on-exhaustion banked under
 *  (one verified payload per call), and how often a slot was reserved. */
function genSpy(): { gen: PracticeGenSources; topics: string[]; reserves: number[] } {
  // Generate-on-exhaustion is env-gated. On only while a spy is in play (a
  // wrongly visible plan then WOULD reach the spy); `test()` switches it off
  // again so no other test can reach the real generator.
  process.env.PRACTICE_GEN = 'on';
  const topics: string[] = [];
  const reserves: number[] = [];
  let n = 0;
  const gen = {
    async reserve(_s: string, _l: string, want: number) { reserves.push(want); return 1; },
    async generateAndVerify() {
      n++;
      return { gen: { problemText: `Fresh generated problem ${n}?`, finalAnswer: String(n), responseFormat: 'numeric' }, hash: `h${n}` };
    },
    async persist(row: { topic: string }) { topics.push(row.topic); },
  } as unknown as PracticeGenSources;
  return { gen, topics, reserves };
}

const ids = (r: { items: Array<{ id: string }> }) => r.items.map((i) => i.id);

// ---------------------------------------------------------------------------
// Adapter-section stubs (no DB)
// ---------------------------------------------------------------------------
(dbModule as unknown as { default: () => Promise<void> }).default = async () => {};
let storedDocs: LessonPlan[] = [];
let capturedPlanFilter: Record<string, unknown> | undefined;
(LessonPlanModel as unknown as {
  find: (filter: Record<string, unknown>) => { limit: (n: number) => Promise<Array<{ toJSON: () => LessonPlan }>> };
}).find = (filter) => {
  capturedPlanFilter = filter;
  const loId = filter['los.id'] as string;
  // Deliberately IGNORES every other filter key: the in-code rules must hold
  // even if the query-level exclusion were absent.
  const matches = storedDocs.filter((p) => p.los.some((l) => l.id === loId));
  return { limit: async () => matches.map((p) => ({ toJSON: () => ({ ...p }) })) };
};
(ProblemBank as unknown as {
  find: (filter: Record<string, unknown>) => { limit: () => { lean: () => Promise<unknown[]> } };
}).find = () => ({ limit: () => ({ lean: async () => [] }) });

function storedPlan(over: Partial<LessonPlan> & Pick<LessonPlan, 'id' | 'los' | 'segments'>): LessonPlan {
  return {
    title: 'Stored plan', curriculum: 'freestyle', grade: 'g8', subject: 'math', topic: 'Stored topic', locale: 'en',
    estimatedMinutes: 30, schemaVersion: 1, metadata: {}, ...over,
  } as unknown as LessonPlan;
}

const STORED_REVIEW = storedPlan({
  id: 'rev-99999999-aaaa-bbbb-cccc-dddddddddddd',
  los: [{ id: PORTAL_LO, description: 'Real numbers' }, { id: PORTAL_LO_2, description: 'Two-step equations' }],
  segments: [
    { kind: 'try_yourself', id: `${PORTAL_LO}-try`, problem: 'Simplify 3 + (-5).', expectedAnswer: 'WRONG-KEY' },
    { kind: 'try_yourself', id: `${PORTAL_LO_2}-try`, problem: 'Solve 2x + 3 = 11.', expectedAnswer: '5' },
  ] as unknown as LessonPlan['segments'],
  metadata: { reviewPlan: true, studentId: 'other-brand-student' },
});
const STORED_GEN_A = storedPlan({
  id: 'gen-stored-a',
  los: [{ id: 'gen-stored-a.lo-1', description: 'Fractions' }],
  segments: [
    { kind: 'try_yourself', id: 'gen-stored-a.lo-1-try', problem: 'What is 1/2 + 1/4?', expectedAnswer: '3/4' },
  ] as unknown as LessonPlan['segments'],
  metadata: { generatedFromText: true, generatorOk: true, portalPartnerId: 'partnerA' },
});
const STORED_UNSTAMPED = storedPlan({
  id: 'gen-stored-legacy',
  los: [{ id: 'gen-stored-legacy.lo-1', description: 'Legacy' }],
  segments: [
    { kind: 'try_yourself', id: 'ty-1', problem: 'Legacy question?', expectedAnswer: 'yes' },
  ] as unknown as LessonPlan['segments'],
  metadata: { generatedFromText: true, generatorOk: true },
});
const STORED_FREESTYLE = storedPlan({
  id: 'freestyle-1700000000000-abcd1234',
  // Legacy un-namespaced LO id — collides across every old freestyle plan.
  los: [{ id: 'lo-1', description: 'Freestyle' }],
  segments: [
    { kind: 'try_yourself', id: 'lo-1-try', problem: 'Freestyle private question?', expectedAnswer: 'x' },
  ] as unknown as LessonPlan['segments'],
  metadata: { generatedFromText: true },
});
const STORED_FREESTYLE_OWN = storedPlan({
  id: 'freestyle-1800000000000-ef015678',
  los: [{ id: 'freestyle-1800000000000-ef015678.lo-1', description: 'Freestyle' }],
  segments: [
    { kind: 'try_yourself', id: 'freestyle-1800000000000-ef015678.lo-1-try', problem: 'Own freestyle question?', expectedAnswer: 'y' },
  ] as unknown as LessonPlan['segments'],
  metadata: { generatedFromText: true },
});

(async () => {
  console.log('\nRule 1 — per-student artefacts are never a shared source:\n');

  await test('a review plan matching the LO is not served (and never anchors or topics a generation)', async () => {
    const { gen, topics, reserves } = genSpy();
    const r = await retrievePractice(req(PORTAL_LO), new FakeSources([reviewPlan]), gen, { partnerId: 'partnerB' });
    assert.deepEqual(ids(r), []);
    assert.deepEqual([topics, reserves], [[], []], 'a private plan must not lend its topic to generate-on-exhaustion');
  });

  await test('a review plan is recognised by its `rev-` id alone (no privateKind supplied by the source)', async () => {
    const { privateKind: _drop, ...bare } = reviewPlan;
    void _drop;
    const r = await retrievePractice(req(PORTAL_LO_2), new FakeSources([bare]), undefined, { partnerId: 'partnerA' });
    assert.deepEqual(ids(r), []);
  });

  await test('classifyPrivatePlan — review / freestyle / homework markers; course + seed plans are not private', () => {
    assert.equal(classifyPrivatePlan('rev-abc', {}), 'review');
    assert.equal(classifyPrivatePlan('gen-abc', { reviewPlan: true }), 'review');
    assert.equal(classifyPrivatePlan('freestyle-1700000000000-abcd1234', { generatedFromText: true }), 'freestyle');
    assert.equal(classifyPrivatePlan('freestyle-fallback-1700000000000-abcd1234', undefined), 'freestyle');
    assert.equal(classifyPrivatePlan('gen-abc', { kind: 'homework-help', problems: [{ n: 1, text: 'x' }] }), 'homework');
    assert.equal(classifyPrivatePlan('gen-abc', { generatedFromText: true, portalPartnerId: 'p' }), undefined);
    assert.equal(classifyPrivatePlan('evelyn.ap.stats.normal.v1', undefined), undefined);
    assert.equal(classifyPrivatePlan(undefined, undefined), undefined);
    // Pinned against the REAL homework marker + wrapper-LO shape (homework.ts):
    // the own-LO rule relies on the wrapper LO being `<planId>.…`.
    const hw = buildHomeworkPlanFields([{ n: 1, text: 'Solve 3x = 12.' }], 'Linear equations', 'gen-real-hw');
    assert.equal(classifyPrivatePlan('gen-real-hw', hw.metadata as unknown as Record<string, unknown>), 'homework');
    assert.equal(hw.los[0].id, homeworkLoIdFor('gen-real-hw'));
    assert.ok(homeworkLoIdFor('gen-real-hw').startsWith('gen-real-hw.'));
  });

  await test('a freestyle plan is not served under a shared (non-plan-scoped) LO id, but still is under its OWN LO', async () => {
    const legacy: PlanLite = {
      id: 'freestyle-1700000000000-abcd1234', privateKind: 'freestyle', los: [{ id: 'lo-1' }],
      segments: [{ kind: 'try_yourself', id: 'lo-1-try', problem: 'Private?', expectedAnswer: 'x' }],
    };
    assert.deepEqual(ids(await retrievePractice(req('lo-1'), new FakeSources([legacy]))), []);
    const ownId = 'freestyle-1800000000000-ef015678';
    const own: PlanLite = {
      id: ownId, privateKind: 'freestyle', los: [{ id: `${ownId}.lo-1` }],
      segments: [{ kind: 'try_yourself', id: `${ownId}.lo-1-try`, problem: 'Own?', expectedAnswer: 'y' }],
    };
    assert.deepEqual(ids(await retrievePractice(req(`${ownId}.lo-1`), new FakeSources([own]))), [`${ownId}::${ownId}.lo-1-try`]);
  });

  await test('topic scope never serves a private plan', async () => {
    const r = await retrievePractice(
      { studentId: 's1', courseId: 'c1', scope: { topicId: 'review-topic' }, count: 10 },
      new FakeSources([reviewPlan]),
      undefined,
      { partnerId: 'partnerA' },
    );
    assert.deepEqual(ids(r), []);
  });

  console.log('\nRule 2 — partner scoping (fail closed):\n');

  await test('a generated plan for partner A is served to partner A', async () => {
    const r = await retrievePractice(req(`${GEN_A}.lo-1`), new FakeSources([genPlanA]), undefined, { partnerId: 'partnerA' });
    assert.deepEqual(ids(r), [`${GEN_A}::${GEN_A}.lo-1-try`]);
    assert.equal(r.items[0].expectedAnswer, '3/4');
    assert.equal(r.items[0].loId, `${GEN_A}.lo-1`);
  });

  await test('… not to partner B (and its topic does not seed a generation for B)', async () => {
    const { gen, topics, reserves } = genSpy();
    const r = await retrievePractice(req(`${GEN_A}.lo-1`), new FakeSources([genPlanA]), gen, { partnerId: 'partnerB' });
    assert.deepEqual(ids(r), []);
    assert.deepEqual([topics, reserves], [[], []]);
  });

  await test('… nor to an unknown partner (no caller, empty caller, blank id)', async () => {
    for (const caller of [undefined, {}, { partnerId: '' }, { partnerId: '   ' }]) {
      const r = await retrievePractice(req(`${GEN_A}.lo-1`), new FakeSources([genPlanA]), undefined, caller);
      assert.deepEqual(ids(r), [], `caller=${JSON.stringify(caller)}`);
    }
  });

  await test('a plan with NO partner metadata (and not private) stays served to anyone, as today', async () => {
    const legacy: PlanLite = { ...genPlanA, partnerId: undefined };
    for (const caller of [undefined, { partnerId: 'partnerB' }]) {
      const r = await retrievePractice(req(`${GEN_A}.lo-1`), new FakeSources([legacy]), undefined, caller);
      assert.deepEqual(ids(r), [`${GEN_A}::${GEN_A}.lo-1-try`]);
    }
  });

  await test('the caller may be bound on the sources (`sources.caller`); an explicit argument wins', async () => {
    const bound = Object.assign(new FakeSources([genPlanA]), { caller: { partnerId: 'partnerA' } });
    assert.equal((await retrievePractice(req(`${GEN_A}.lo-1`), bound)).items.length, 1);
    assert.equal((await retrievePractice(req(`${GEN_A}.lo-1`), bound, undefined, { partnerId: 'partnerB' })).items.length, 0);
  });

  console.log('\nRule 3 — segment-to-LO fidelity:\n');

  await test('a five-LO stored plan serves each try-yourself only under its own LO', async () => {
    for (const n of [1, 2, 3, 4, 5]) {
      const lo = `${GEN_5}.lo-${n}`;
      const r = await retrievePractice(req(lo), new FakeSources([fiveLoPlan]));
      const want = n === 2 ? [`${GEN_5}::${lo}-try`, `${GEN_5}::${lo}-try2`] : [`${GEN_5}::${lo}-try`];
      assert.deepEqual(ids(r), want, `LO ${n}`);
      assert.ok(r.items.every((i) => i.loId === lo));
    }
  });

  await test('an unattributable try-yourself of a multi-LO plan is served under NO LO (fail closed)', async () => {
    for (const n of [1, 2, 3, 4, 5]) {
      const r = await retrievePractice(req(`${GEN_5}.lo-${n}`), new FakeSources([fiveLoPlan]));
      assert.ok(!ids(r).includes(`${GEN_5}::bonus-challenge`));
    }
  });

  await test('segmentOwnerLoId — longest LO id wins; single-LO plans own every segment; unknown → null', () => {
    const los = [{ id: 'p.lo-1' }, { id: 'p.lo-10' }, { id: 'a' }, { id: 'a-b' }];
    assert.equal(segmentOwnerLoId(los, 'p.lo-1-try'), 'p.lo-1');
    assert.equal(segmentOwnerLoId(los, 'p.lo-10-try'), 'p.lo-10');
    assert.equal(segmentOwnerLoId(los, 'a-b-try'), 'a-b');
    assert.equal(segmentOwnerLoId(los, 'a-try'), 'a');
    assert.equal(segmentOwnerLoId(los, 'try-1'), null);
    assert.equal(segmentOwnerLoId(los, 'p.lo-1'), null, 'a bare LO id is not an LO-suffixed segment id');
    assert.equal(segmentOwnerLoId([{ id: 'only' }], 'try-1'), 'only');
    assert.equal(segmentOwnerLoId([{ id: 'only' }, { id: 'only' }], 'try-1'), 'only', 'duplicate ids are one LO');
    assert.equal(segmentOwnerLoId([], 'try-1'), null);
  });

  await test('single-LO plans are unchanged: bank rows first, then every try-yourself of the plan', async () => {
    const r = await retrievePractice(req(SEED_LO), new FakeSources([seedLikePlan], [seedBank]));
    assert.deepEqual(ids(r), ['openstax.stats.0042', 'evelyn.ap.stats.normal.v1::try-1', 'evelyn.ap.stats.normal.v1::try-2']);
    assert.deepEqual(r.items[0], {
      id: 'openstax.stats.0042', source: 'bank', problemText: 'Bank normal problem', expectedAnswer: '0.84',
      hints: undefined, responseFormat: 'mcq', choices: [{ id: 'A', text: '0.84' }, { id: 'B', text: '0.16' }],
      difficulty: 2, loId: SEED_LO, cedCode: 'AP-STATS-1.10',
    });
    assert.equal(r.items[1].cedCode, 'AP-STATS-1.10');
    assert.equal(r.items[1].loId, SEED_LO);
  });

  await test('topic scope: a multi-LO plan tags an attributable try-yourself with its OWN LO, not the plan\'s first', async () => {
    const r = await retrievePractice(
      { studentId: 's1', courseId: 'c1', scope: { topicId: 'Algebra' }, count: 20 },
      new FakeSources([fiveLoPlan]),
    );
    const byId = new Map(r.items.map((i) => [i.id, i.loId]));
    assert.equal(byId.get(`${GEN_5}::${GEN_5}.lo-3-try`), `${GEN_5}.lo-3`);
    assert.equal(byId.get(`${GEN_5}::${GEN_5}.lo-1-try`), `${GEN_5}.lo-1`);
  });

  console.log('\nHomework wrapper LO — owner path unchanged:\n');

  await test('assigned-practice resolver (assign.ts → resolveAssignmentItems): same banked items as before, never generates', async () => {
    // assign.ts hands the resolver sources with no retrieval-time caller; the
    // homework plan itself carries no try-yourselves, so the result is the
    // wrapper LO's banked rows — with or without the plan being visible.
    const out = await resolveAssignmentItems(
      { los: [{ loId: HW_LO, title: 'Homework' }], band: 'developing' as never, seenItemIds: [], studentId: 'profile-1', courseId: '' },
      new FakeSources([homeworkPlan], hwBank),
    );
    assert.equal(out.length, 1);
    assert.equal(out[0].loId, HW_LO);
    assert.deepEqual(out[0].items.map((i) => i.id), hwBank.map((b) => b.id));
    assert.deepEqual(out[0].items.map((i) => i.expectedAnswer), ['4', '2']);
    const again = await resolveAssignmentItems(
      { los: [{ loId: HW_LO, title: 'Homework' }], band: 'developing' as never, seenItemIds: [hwBank[0].id], studentId: 'profile-1', courseId: '' },
      Object.assign(new FakeSources([homeworkPlan], hwBank), { caller: { partnerId: 'partnerA' } }),
    );
    assert.deepEqual(again[0].items.map((i) => i.id), [hwBank[1].id]);
  });

  await test('portal /practice for the wrapper LO by the owning partner: banked rows + top-up under the plan\'s own topic', async () => {
    const { gen, topics } = genSpy();
    const r = await retrievePractice(req(HW_LO, { count: 3 }), new FakeSources([homeworkPlan], hwBank), gen, { partnerId: 'partnerA' });
    assert.deepEqual(ids(r).slice(0, 2), hwBank.map((b) => b.id));
    assert.equal(r.items.length, 3, 'two banked rows + one generated top-up');
    assert.ok(r.items[2].id.startsWith(`practice-gen.${HW_LO}.`), r.items[2].id);
    assert.deepEqual(topics, ['Linear equations worksheet'], 'the owner\'s own-LO request still derives its generation topic from the homework plan');
  });

  await test('another partner asking for that wrapper LO gets no top-up topic from the homework plan', async () => {
    const { gen, topics, reserves } = genSpy();
    const r = await retrievePractice(req(HW_LO, { count: 3 }), new FakeSources([homeworkPlan], hwBank), gen, { partnerId: 'partnerB' });
    assert.deepEqual([topics, reserves], [[], []]);
    // Rule 5 (unchanged in this change): the wrapper LO's banked rows are
    // LO-keyed, not partner-keyed — whoever asks for that exact LO id gets them.
    assert.deepEqual(ids(r), hwBank.map((b) => b.id));
  });

  console.log('\nAssessment path — same rules:\n');

  await test('buildAssessment: review plan excluded, other-partner plan excluded, own-partner plan + per-LO fidelity kept', async () => {
    const sources = new FakeSources([reviewPlan, genPlanA, fiveLoPlan], []);
    const asA = await buildAssessment(
      { studentId: 's1', courseId: 'c1', loIds: [PORTAL_LO, `${GEN_A}.lo-1`, `${GEN_5}.lo-4`], maxPerLo: 5 } as never,
      sources, undefined, { partnerId: 'partnerA' },
    );
    assert.deepEqual(asA.items.map((i) => [i.itemId, i.loId]), [
      [`${GEN_A}::${GEN_A}.lo-1-try`, `${GEN_A}.lo-1`],
      [`${GEN_5}::${GEN_5}.lo-4-try`, `${GEN_5}.lo-4`],
    ]);
    const asB = await buildAssessment(
      { studentId: 's1', courseId: 'c1', loIds: [PORTAL_LO, `${GEN_A}.lo-1`, `${GEN_5}.lo-4`], maxPerLo: 5 } as never,
      sources, undefined, { partnerId: 'partnerB' },
    );
    assert.deepEqual(asB.items.map((i) => i.itemId), [`${GEN_5}::${GEN_5}.lo-4-try`]);
    const unknown = await buildAssessment(
      { studentId: 's1', courseId: 'c1', loIds: [PORTAL_LO, `${GEN_A}.lo-1`], maxPerLo: 5 } as never,
      sources,
    );
    assert.deepEqual(unknown.items, []);
  });

  console.log('\nProduction adapter (mongoPracticeSources over stubbed Mongo):\n');

  await test('stored review plan: never served; the lookup also excludes it at the query', async () => {
    storedDocs = [STORED_REVIEW];
    for (const caller of [undefined, { partnerId: 'greenapple' }]) {
      const r = await retrievePractice(req(PORTAL_LO), mongoPracticeSources(caller), undefined, caller);
      assert.deepEqual(ids(r), []);
      const r2 = await retrievePractice(req(PORTAL_LO_2), mongoPracticeSources(caller), undefined, caller);
      assert.deepEqual(ids(r2), []);
    }
    assert.equal(capturedPlanFilter?.['los.id'], PORTAL_LO_2);
    assert.deepEqual(capturedPlanFilter?.['metadata.reviewPlan'], { $ne: true });
    assert.deepEqual(capturedPlanFilter?._id, { $not: /^rev-/ });
  });

  await test('stored generated plan stamped for partner A: A yes; B no; unknown no', async () => {
    storedDocs = [STORED_GEN_A];
    const lo = 'gen-stored-a.lo-1';
    const a = await retrievePractice(req(lo), mongoPracticeSources(), undefined, { partnerId: 'partnerA' });
    assert.deepEqual(ids(a), ['gen-stored-a::gen-stored-a.lo-1-try']);
    assert.deepEqual(ids(await retrievePractice(req(lo), mongoPracticeSources(), undefined, { partnerId: 'partnerB' })), []);
    assert.deepEqual(ids(await retrievePractice(req(lo), mongoPracticeSources())), []);
    // Bound at construction (how a caller that only holds the sources threads it).
    assert.deepEqual(ids(await retrievePractice(req(lo), mongoPracticeSources({ partnerId: 'partnerA' }))), ['gen-stored-a::gen-stored-a.lo-1-try']);
  });

  await test('stored plan with no partner metadata stays served to an unknown caller (as today)', async () => {
    storedDocs = [STORED_UNSTAMPED];
    const r = await retrievePractice(req('gen-stored-legacy.lo-1'), mongoPracticeSources());
    assert.deepEqual(ids(r), ['gen-stored-legacy::ty-1']);
  });

  await test('stored freestyle plan: not under a shared `lo-1`; still under its own plan-scoped LO', async () => {
    storedDocs = [STORED_FREESTYLE, STORED_FREESTYLE_OWN];
    assert.deepEqual(ids(await retrievePractice(req('lo-1'), mongoPracticeSources())), []);
    const own = await retrievePractice(req('freestyle-1800000000000-ef015678.lo-1'), mongoPracticeSources());
    assert.deepEqual(ids(own), ['freestyle-1800000000000-ef015678::freestyle-1800000000000-ef015678.lo-1-try']);
  });

  await test('buildAssessment over the production adapter applies the same rules', async () => {
    storedDocs = [STORED_REVIEW, STORED_GEN_A];
    const set = await buildAssessment(
      { studentId: 's1', courseId: 'c1', loIds: [PORTAL_LO, PORTAL_LO_2, 'gen-stored-a.lo-1'], maxPerLo: 5 } as never,
      mongoPracticeSources(), undefined, { partnerId: 'partnerA' },
    );
    assert.deepEqual(set.items.map((i) => i.itemId), ['gen-stored-a::gen-stored-a.lo-1-try']);
    const other = await buildAssessment(
      { studentId: 's1', courseId: 'c1', loIds: [PORTAL_LO, PORTAL_LO_2, 'gen-stored-a.lo-1'], maxPerLo: 5 } as never,
      mongoPracticeSources(), undefined, { partnerId: 'greenapple' },
    );
    assert.deepEqual(other.items, []);
  });

  console.log('\nSeed plans (real SEED_PLANS):\n');

  await test('a single-LO seed plan serves exactly its typed try-yourselves, ids and keys unchanged', async () => {
    storedDocs = [];
    const loUse = new Map<string, number>();
    for (const p of SEED_PLANS) for (const l of p.los) loUse.set(l.id, (loUse.get(l.id) ?? 0) + 1);
    const seed = SEED_PLANS.find(
      (p) => p.los.length === 1 && loUse.get(p.los[0].id) === 1 &&
        p.segments.filter((s) => s.kind === 'try_yourself').length >= 2,
    );
    assert.ok(seed, 'expected a single-LO seed plan with ≥2 try-yourselves');
    const r = await retrievePractice(req(seed.los[0].id, { count: 50 }), mongoPracticeSources());
    assert.ok(r.items.length > 0);
    for (const it of r.items) {
      const segId = it.id.slice(`${seed.id}::`.length);
      const seg = seed.segments.find((s) => s.id === segId) as { kind: string; problem?: string; expectedAnswer?: string } | undefined;
      assert.ok(it.id.startsWith(`${seed.id}::`) && seg && seg.kind === 'try_yourself', `unexpected item ${it.id}`);
      assert.equal(it.problemText, seg.problem);
      assert.equal(it.expectedAnswer, seg.expectedAnswer);
      assert.equal(it.loId, seed.los[0].id);
    }
  });

  await test('multi-LO seed plans: alias-standard plans (no attributable try-yourself) keep serving under each LO; a plan with LO-named segments never leaks', async () => {
    storedDocs = [];
    const multi = SEED_PLANS.filter((p) => new Set(p.los.map((l) => l.id)).size > 1);
    let tries = 0;
    let attributable = 0;
    let leaked = 0;
    let aliasServed = 0;
    for (const p of multi) {
      const planTries = p.segments.filter((s) => s.kind === 'try_yourself');
      tries += planTries.length;
      const planAttributable = planTries.filter((s) => segmentOwnerLoId(p.los, s.id) !== null).length;
      attributable += planAttributable;
      // Alias-standard plan: one lesson listed under several standards, no
      // segment names an LO — its items stay served under each LO.
      const alias = planAttributable === 0;
      for (const lo of p.los) {
        const r = await retrievePractice(req(lo.id, { count: 50 }), mongoPracticeSources());
        for (const it of r.items) {
          if (!it.id.startsWith(`${p.id}::`)) continue;
          if (alias) { aliasServed++; continue; }
          if (segmentOwnerLoId(p.los, it.id.slice(`${p.id}::`.length)) !== lo.id) leaked++;
        }
      }
    }
    if (multi.some((p) => p.segments.some((s) => s.kind === 'try_yourself') && !p.segments.some((s) => s.kind === 'try_yourself' && segmentOwnerLoId(p.los, s.id) !== null))) {
      assert.ok(aliasServed > 0, 'alias-standard seed plans still serve their try-yourselves');
    }
    console.log(`      (multi-LO seed plans: ${multi.length}; try-yourselves: ${tries}; attributable by segment id: ${attributable})`);
    assert.equal(leaked, 0);
  });

  console.log('\nGrading of already-issued ids is untouched:\n');

  const ISSUED_REV = {
    id: 'rev-issued-0001',
    title: 'Review', topic: 't',
    los: [{ id: PORTAL_LO }, { id: PORTAL_LO_2 }],
    segments: [
      { kind: 'try_yourself', id: `${PORTAL_LO}-try`, problem: 'Simplify 3 + (-5).', expectedAnswer: '-2', responseFormat: 'numeric', rubric: null, hints: null },
      { kind: 'try_yourself', id: `${PORTAL_LO_2}-try`, problem: 'Solve 2x + 3 = 11.', expectedAnswer: '4' },
    ],
    metadata: { reviewPlan: true, studentId: 'someone' },
  } as unknown as LessonPlan;
  const keyDeps: ItemKeyDeps = {
    async getStoredPlan(id) { return id === ISSUED_REV.id ? ISSUED_REV : null; },
    async findBankRow() { return null; },
  };

  await test('resolveGradeItem still resolves an already-issued `rev-…::…-try` item id', async () => {
    const item = await resolveGradeItem(`rev-issued-0001::${PORTAL_LO_2}-try`, keyDeps);
    assert.ok(item);
    assert.equal(item.itemId, `rev-issued-0001::${PORTAL_LO_2}-try`);
    assert.equal(item.expectedAnswer, '4');
  });

  await test('resolveAssessmentItem still resolves an already-issued `rev-…::…-try` item id', async () => {
    const key = await resolveAssessmentItem(`rev-issued-0001::${PORTAL_LO}-try`, keyDeps);
    assert.ok(key);
    assert.equal(key.expectedAnswer, '-2');
    assert.equal(key.responseFormat, 'numeric');
    assert.equal(key.rubric, undefined);
  });

  // ── Review 5e: the end-of-session practice events written to the session ──
  await test('emit session-event write: matched on sessionId + the session\'s stored partner id, capped per session', async () => {
    const now = new Date('2026-10-04T10:00:00Z');
    const built = buildSessionEventsWrite({ sessionId: 's-1', partnerId: 'greenapple' }, [{ type: 'practice_gen_empty', message: 'x'.repeat(900) }], now);
    assert.ok(built);
    const w = built!;
    // TutorSession.studentId is the embed token's student id as the BROWSER posted it (optional, absent on
    // some sessions); the emit's studentId is what the partner's SERVER sent. Not one guaranteed id space.
    assert.equal(JSON.stringify(Object.keys(w.filter).sort()), JSON.stringify(['$expr', 'sessionId', 'sourcePartnerId']));
    assert.equal(w.filter.sessionId, 's-1');
    assert.equal(w.filter.sourcePartnerId, 'greenapple');
    assert.ok(!('studentId' in w.filter), 'never matched on the emit student id');
    // Cap: no append once the session holds PRACTICE_SESSION_EVENTS_PER_SESSION_MAX events of these types.
    assert.equal(PRACTICE_SESSION_EVENTS_PER_SESSION_MAX, 40);
    const expr = JSON.stringify(w.filter.$expr);
    assert.ok(expr.includes('"$lt"') && expr.includes('"$size"') && expr.endsWith(',40]}'), expr);
    for (const t of PRACTICE_SESSION_EVENT_TYPES) assert.ok(expr.includes(`"${t}"`), `cap counts ${t}`);
    const pushed = w.update.$push.debugEvents.$each;
    assert.equal(pushed.length, 1);
    assert.equal(pushed[0]!.message.length, 500);
    assert.equal(pushed[0]!.timestamp, now);
    assert.equal(buildSessionEventsWrite({ sessionId: 's-1', partnerId: '' }, [{ type: 'practice_gen_empty', message: 'm' }], now), null, 'no partner id ⇒ no write (never a sessionId-only match)');
    assert.equal(buildSessionEventsWrite({ sessionId: 's-1', partnerId: 'g' }, [], now), null);
  });

  await test('emit session-event write: fire-and-forget — never awaited, a failure never reaches the emit', async () => {
    const plan = { id: 'ev-1', topic: 't', title: 'T', los: [{ id: 'ev-1.lo-1', description: 'First' }, { id: 'ev-1.lo-2', description: 'Second' }], segments: [] };
    const draft = { _id: 'd', sessionId: 'x', studentId: 'p', status: 'draft', los: [{ loId: 'ev-1.lo-1', title: 'First', reason: 'r', items: [] }] };
    const req = (sessionId: string) => ({ sessionId, studentId: 'ext-7', courseId: 'c', status: 'completed', lessonPlanId: 'ev-1', losTouched: ['ev-1.lo-2'], masteryDeltas: [], gaps: [], notesTouched: [], practiceLocator: 'L' }) as never;
    const base = { findAssignment: async () => draft, getPlan: async () => plan, assign: async () => { throw new Error('no create'); }, topUpDraft: async () => 0, topUpAssigned: async () => 0 };
    const warn = console.warn; console.warn = () => {};
    try {
      // A write that NEVER settles must not hold the emit.
      const calls: unknown[][] = [];
      const hanging = { ...base, recordSessionEvents: (...args: unknown[]) => { calls.push(args); return new Promise<void>(() => {}); } };
      const outcome = await Promise.race([
        createDraftOnEmit(req('ev-hang'), { profileId: 'p', partnerId: 'greenapple' }, hanging as never),
        new Promise<string>((resolve) => setTimeout(() => resolve('TIMED-OUT'), 1500)),
      ]);
      assert.equal(outcome, 'exists', 'the emit returned without waiting for the session-event write');
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0]![0], { sessionId: 'ev-hang', studentId: 'ext-7' });
      assert.equal((calls[0]![1] as Array<{ type: string }>)[0]!.type, 'practice_draft_empty');
      assert.deepEqual(calls[0]![2], { partnerId: 'greenapple' }, 'the verified partner id is handed to the write');
      // Rejections and synchronous throws are caught and logged.
      let unhandled = 0;
      const onUnhandled = () => { unhandled++; };
      process.on('unhandledRejection', onUnhandled);
      const rejecting = { ...base, recordSessionEvents: async () => { throw new Error('mongo down'); } };
      assert.equal(await createDraftOnEmit(req('ev-reject'), { profileId: 'p', partnerId: 'g' }, rejecting as never), 'exists');
      const throwing = { ...base, recordSessionEvents: () => { throw new Error('sync boom'); } };
      assert.equal(await createDraftOnEmit(req('ev-throw'), { profileId: 'p', partnerId: 'g' }, throwing as never), 'exists');
      await new Promise((r) => setTimeout(r, 20));
      process.off('unhandledRejection', onUnhandled);
      assert.equal(unhandled, 0, 'no unhandled rejection from the detached write');
    } finally { console.warn = warn; }
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
