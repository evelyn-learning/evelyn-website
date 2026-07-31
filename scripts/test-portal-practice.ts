/**
 * Phase 3(c) — gap-targeted practice retrieval tests (pure `retrievePractice`).
 *
 * Run: `npm run test:portal-practice`
 * Style mirrors scripts/test-cross-session-promotion.ts.
 */

import assert from 'node:assert';
import {
  retrievePractice,
  type PracticeSources,
  type PlanLite,
  type BankLite,
} from '@/lib/tutor/portal/practice';
import { MAX_GENERATIONS_PER_REQUEST, type PracticeGenSources } from '@/lib/tutor/portal/practice-gen';
import type { GenPayload } from '@/lib/tutor/voice/problem-generator';
import type { RetrievePracticeRequest } from '@evelyn/portal-contract/v1';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

const LO = 'apstats.normal-distribution';

const planWithLo: PlanLite = {
  los: [{ id: LO, standard: 'AP-STATS-1.10' }],
  segments: [
    { kind: 'try_yourself', id: 'ty-1', problem: 'Find the z-score', expectedAnswer: '1.5' },
    { kind: 'try_yourself', id: 'ty-2', problem: 'Shade the region', responseFormat: 'frq' },
    { kind: 'try_yourself', id: 'ty-off', problem: 'Off-topic bait', offTopic: true },
    { kind: 'worked_example', id: 'we-1', problem: 'not a try-yourself' },
  ],
};

const bankItem: BankLite = {
  id: 'openstax.stats.0042',
  problemText: 'Bank normal problem',
  answer: '0.84',
  responseFormat: 'mcq',
  choices: ['0.84', '0.16'],
  difficulty: 2,
  loId: LO,
  cedCode: 'AP-STATS-1.10',
};

class FakeSources implements PracticeSources {
  public lastBankDifficulty: number | undefined;
  constructor(
    private plans: PlanLite[] = [],
    private bank: BankLite[] = [],
  ) {}
  async plansForLoId() {
    return this.plans;
  }
  async plansForTopic() {
    return this.plans;
  }
  async bankForLoId(_loId: string, difficulty?: 1 | 2 | 3 | 4) {
    this.lastBankDifficulty = difficulty;
    return this.bank;
  }
  async bankForTopic(_topicId: string, difficulty?: 1 | 2 | 3 | 4) {
    this.lastBankDifficulty = difficulty;
    return this.bank;
  }
}

function loReq(over: Partial<RetrievePracticeRequest> = {}): RetrievePracticeRequest {
  return { studentId: 's', courseId: 'ap-statistics', scope: { loId: LO }, count: 10, ...over };
}

(async () => {
console.log('\nPhase 3(c) retrievePractice:\n');

await test('LO scope — plan try-yourselves (off-topic + non-try excluded) + bank, all tagged with the LO', async () => {
  const r = await retrievePractice(loReq(), new FakeSources([planWithLo], [bankItem]));
  const ids = r.items.map((i) => i.id);
  // Bank (verified) items first, then plan try-yourselves (off-topic + non-try excluded).
  assert.deepStrictEqual(ids, ['openstax.stats.0042', 'ty-1', 'ty-2']);
  assert.ok(r.items.every((i) => i.loId === LO), 'every item tagged with the requested LO');
  assert.strictEqual(r.items[0].source, 'bank');
  assert.strictEqual(r.items[0].cedCode, 'AP-STATS-1.10');
});

await test('LO scope — returns ONLY practice tagged with the canonical LO (acceptance)', async () => {
  const r = await retrievePractice(loReq(), new FakeSources([planWithLo], [bankItem]));
  assert.ok(r.items.length > 0);
  assert.ok(r.items.every((i) => i.loId === LO));
});

await test('difficulty is forwarded to the bank source', async () => {
  const src = new FakeSources([planWithLo], [bankItem]);
  await retrievePractice(loReq({ difficulty: 3 }), src);
  assert.strictEqual(src.lastBankDifficulty, 3);
});

await test('count caps the result (bank items first)', async () => {
  const r = await retrievePractice(loReq({ count: 2 }), new FakeSources([planWithLo], [bankItem]));
  assert.strictEqual(r.items.length, 2);
  assert.deepStrictEqual(r.items.map((i) => i.id), ['openstax.stats.0042', 'ty-1']);
});

await test('plan-TY item ids are qualified with the plan id (no false bank collision)', async () => {
  const planWithId: PlanLite = {
    id: 'evelyn.test.plan.v1',
    los: [{ id: LO, standard: 'AP-STATS-1.10' }],
    segments: [{ kind: 'try_yourself', id: 'ty-1', problem: 'Find the z-score', expectedAnswer: '1.5' }],
  };
  // A bank item whose bare id equals the plan's segment id must NOT dedup away:
  // the plan-TY id is qualified (`planId::segId`), so the two are distinct.
  const bankSameSeg: BankLite = { ...bankItem, id: 'ty-1' };
  const r = await retrievePractice(loReq(), new FakeSources([planWithId], [bankSameSeg]));
  assert.deepStrictEqual(r.items.map((i) => i.id).sort(), ['evelyn.test.plan.v1::ty-1', 'ty-1']);
  const planItem = r.items.find((i) => i.source === 'plan-try-yourself')!;
  assert.strictEqual(planItem.id, 'evelyn.test.plan.v1::ty-1', 'plan-TY id qualified with plan id');
});

await test('bank choices mapped from string[] to {id,text}', async () => {
  const r = await retrievePractice(loReq(), new FakeSources([], [bankItem]));
  const bank = r.items.find((i) => i.source === 'bank')!;
  assert.deepStrictEqual(bank.choices, [
    { id: 'A', text: '0.84' },
    { id: 'B', text: '0.16' },
  ]);
});

await test('topic scope — bank items returned, plan try-yourselves tagged with plan first LO', async () => {
  const req: RetrievePracticeRequest = { studentId: 's', courseId: 'c', scope: { topicId: 'ap-statistics' }, count: 10 };
  const r = await retrievePractice(req, new FakeSources([planWithLo], [bankItem]));
  assert.ok(r.items.some((i) => i.source === 'bank'));
  assert.ok(r.items.some((i) => i.source === 'plan-try-yourself' && i.loId === LO));
});

await test('no sources → empty result', async () => {
  const r = await retrievePractice(loReq(), new FakeSources([], []));
  assert.deepStrictEqual(r.items, []);
});

// Design B (generate-on-exhaustion), Task 2: excludeIds — portal-supplied ids
// this student has already been served are dropped BEFORE slicing to count,
// so a fresh item fills the slot rather than being crowded out by a repeat.
const bankItem2: BankLite = { ...bankItem, id: 'openstax.stats.0099' };

await test('excludeIds — an excluded bank item is dropped from the result', async () => {
  const r = await retrievePractice(
    loReq({ excludeIds: ['openstax.stats.0042'] }),
    new FakeSources([planWithLo], [bankItem]),
  );
  const ids = r.items.map((i) => i.id);
  assert.ok(!ids.includes('openstax.stats.0042'), 'excluded bank item must not appear');
  assert.deepStrictEqual(ids, ['ty-1', 'ty-2'], 'remaining plan try-yourselves still served');
});

await test('excludeIds — an excluded plan try-yourself is dropped from the result', async () => {
  const planWithId: PlanLite = {
    id: 'evelyn.test.plan.v1',
    los: [{ id: LO, standard: 'AP-STATS-1.10' }],
    segments: planWithLo.segments,
  };
  const r = await retrievePractice(
    loReq({ excludeIds: ['evelyn.test.plan.v1::ty-1'] }),
    new FakeSources([planWithId], []),
  );
  const ids = r.items.map((i) => i.id);
  assert.ok(!ids.includes('evelyn.test.plan.v1::ty-1'));
  assert.deepStrictEqual(ids, ['evelyn.test.plan.v1::ty-2']);
});

await test('excludeIds — shortfall: pool minus exclusions is thinner than count, fewer items returned (no error)', async () => {
  // Pool = 2 bank items; exclude one; ask for 5 → only 1 comes back (the
  // generation fallback that fills this gap lands in Task 3).
  const r = await retrievePractice(
    loReq({ count: 5, excludeIds: ['openstax.stats.0042'] }),
    new FakeSources([], [bankItem, bankItem2]),
  );
  assert.deepStrictEqual(r.items.map((i) => i.id), ['openstax.stats.0099']);
  assert.ok(r.items.length < 5, 'result is short of the requested count — no crash, no error');
});

await test('excludeIds absent — behaves exactly as before (regression)', async () => {
  const withUndefined = await retrievePractice(loReq(), new FakeSources([planWithLo], [bankItem]));
  const withoutField: RetrievePracticeRequest = { ...loReq() };
  delete (withoutField as { excludeIds?: string[] }).excludeIds;
  const withoutFieldResult = await retrievePractice(withoutField, new FakeSources([planWithLo], [bankItem]));
  assert.deepStrictEqual(withUndefined.items, withoutFieldResult.items);
});

await test('excludeIds empty array — behaves exactly as before (regression)', async () => {
  const withEmpty = await retrievePractice(
    loReq({ excludeIds: [] }),
    new FakeSources([planWithLo], [bankItem]),
  );
  const baseline = await retrievePractice(loReq(), new FakeSources([planWithLo], [bankItem]));
  assert.deepStrictEqual(withEmpty.items, baseline.items);
});

// Design B (generate-on-exhaustion), Task 3 round-1 review fix #3 —
// integration tests for the practice.ts <-> practice-gen.ts wiring, injecting
// a fake PracticeGenSources through retrievePractice's third parameter.
// PRACTICE_GEN is off-by-default (env unset), so every test here turns it on
// and cleans up after itself.
class FakeGenSources implements PracticeGenSources {
  public reserveCalls: Array<{ studentId: string; loId: string; n: number }> = [];
  public persisted: Array<{ id: string; topic: string; topicId?: string; loId: string }> = [];
  public generateCalls = 0;
  constructor(
    private allowed: number,
    private results: Array<{ gen: GenPayload; hash: string } | null>,
  ) {}
  async reserve(studentId: string, loId: string, n: number) {
    this.reserveCalls.push({ studentId, loId, n });
    return Math.min(this.allowed, n);
  }
  async generateAndVerify() {
    const result = this.results[this.generateCalls] ?? null;
    this.generateCalls++;
    return result;
  }
  async persist(row: { id: string; topic: string; topicId?: string; loId: string }) {
    this.persisted.push(row);
  }
}

function numericGen(text: string, answer: string): GenPayload {
  return { problemText: text, finalAnswer: answer, responseFormat: 'numeric' };
}

const planWithTopic: PlanLite = {
  id: 'evelyn.test.plan.gen.v1',
  topic: 'ap-statistics',
  los: [{ id: LO, standard: 'AP-STATS-1.10' }],
  segments: [],
};
const planNoTopic: PlanLite = {
  id: 'evelyn.test.plan.notopic.v1',
  los: [{ id: LO, standard: 'AP-STATS-1.10' }],
  segments: [],
};

await test('generate-on-exhaustion: LO-scope-only gating — topic scope never calls genSources', async () => {
  process.env.PRACTICE_GEN = 'on';
  const gen = new FakeGenSources(2, [{ gen: numericGen('Fresh', '9'), hash: 'h1' }]);
  const req: RetrievePracticeRequest = { studentId: 's', courseId: '64f0abc123abc123abc12345', scope: { topicId: 'ap-statistics' }, count: 10 };
  await retrievePractice(req, new FakeSources([planWithTopic], [bankItem]), gen);
  assert.equal(gen.generateCalls, 0, 'topic-scoped shortfalls must never trigger generation');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: shortfall (capped at 2) is what gets requested from the cap check', async () => {
  process.env.PRACTICE_GEN = 'on';
  const gen = new FakeGenSources(2, [
    { gen: numericGen('Fresh 1', '9'), hash: 'h1' },
    { gen: numericGen('Fresh 2', '11'), hash: 'h2' },
  ]);
  // Pool = 1 bank item; asking for 8 -> shortfall = 7, capped to 2 internally.
  await retrievePractice(loReq({ count: 8 }), new FakeSources([planWithTopic], [bankItem]), gen);
  assert.equal(gen.reserveCalls.length, 1);
  assert.equal(gen.reserveCalls[0].n, MAX_GENERATIONS_PER_REQUEST, 'reserve is asked for min(shortfall, 2), not the raw shortfall (7)');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: generated items are appended to the retrieval result', async () => {
  process.env.PRACTICE_GEN = 'on';
  const gen = new FakeGenSources(1, [{ gen: numericGen('Fresh problem', '9'), hash: 'freshhash' }]);
  const r = await retrievePractice(loReq({ count: 5 }), new FakeSources([planWithTopic], [bankItem]), gen);
  const ids = r.items.map((i) => i.id);
  assert.ok(ids.includes(`practice-gen.${LO}.freshhash`), 'the generated item is appended to the response');
  assert.ok(ids.includes(bankItem.id), 'retrieval-pool items are still present');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: a generated item colliding with an already-available id is deduped away', async () => {
  process.env.PRACTICE_GEN = 'on';
  // The generation stub "regenerates" a hash that collides with an id
  // already present in the retrieval pool.
  const collidingId = `practice-gen.${LO}.dupA`;
  const gen = new FakeGenSources(1, [{ gen: numericGen('Regenerated dup', '9'), hash: 'dupA' }]);
  const bankWithCollision: BankLite = { ...bankItem, id: collidingId };
  const r = await retrievePractice(loReq({ count: 5 }), new FakeSources([planWithTopic], [bankWithCollision]), gen);
  const occurrences = r.items.filter((i) => i.id === collidingId).length;
  assert.equal(occurrences, 1, 'the id must appear exactly once, not duplicated');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: a generated item colliding with an excludeIds entry is not re-served', async () => {
  process.env.PRACTICE_GEN = 'on';
  const collidingId = `practice-gen.${LO}.dupB`;
  const gen = new FakeGenSources(1, [{ gen: numericGen('Regenerated dup', '9'), hash: 'dupB' }]);
  // Pool = 1 bank item (not the colliding one) so there IS a shortfall to
  // trigger generation; the student has already been served collidingId.
  const r = await retrievePractice(
    loReq({ count: 5, excludeIds: [collidingId] }),
    new FakeSources([planWithTopic], [bankItem]),
    gen,
  );
  assert.ok(!r.items.some((i) => i.id === collidingId), 'a regenerated item matching an excluded id must not be re-served');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: topic is derived engine-side from the LO\'s owning plan, never courseId', async () => {
  process.env.PRACTICE_GEN = 'on';
  const gen = new FakeGenSources(1, [{ gen: numericGen('Fresh problem', '9'), hash: 'topichash' }]);
  // courseId here is what the real portal sends on the wire (a Mongo
  // ObjectId hex) — it must NOT leak into the persisted topic/topicId.
  const req: RetrievePracticeRequest = {
    studentId: 's',
    courseId: '64f0abc123abc123abc12345',
    scope: { loId: LO },
    count: 5,
  };
  await retrievePractice(req, new FakeSources([planWithTopic], [bankItem]), gen);
  assert.equal(gen.persisted.length, 1);
  assert.equal(gen.persisted[0].topic, 'ap-statistics', 'topic comes from the owning plan, not courseId');
  assert.equal(gen.persisted[0].topicId, 'ap-statistics', 'topicId mirrors topic so bankForTopic matches');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: no owning plan for the LO -> generation skipped (no orphan rows)', async () => {
  process.env.PRACTICE_GEN = 'on';
  const gen = new FakeGenSources(2, [{ gen: numericGen('Fresh problem', '9'), hash: 'orphan' }]);
  const r = await retrievePractice(loReq({ count: 5 }), new FakeSources([], [bankItem]), gen);
  assert.equal(gen.generateCalls, 0, 'no owning plan (no topic to tag) must skip generation entirely');
  assert.ok(!r.items.some((i) => i.id.startsWith('practice-gen.')));
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: an owning plan with no topic field also skips generation (no orphan rows)', async () => {
  process.env.PRACTICE_GEN = 'on';
  const gen = new FakeGenSources(2, [{ gen: numericGen('Fresh problem', '9'), hash: 'orphan2' }]);
  await retrievePractice(loReq({ count: 5 }), new FakeSources([planNoTopic], [bankItem]), gen);
  assert.equal(gen.generateCalls, 0, 'an owning plan lacking a topic must not produce an orphan-tagged row');
  delete process.env.PRACTICE_GEN;
});

await test('generate-on-exhaustion: kill-switch off (env unset) -> genSources never touched even with a shortfall', async () => {
  delete process.env.PRACTICE_GEN;
  const gen = new FakeGenSources(2, [{ gen: numericGen('Fresh problem', '9'), hash: 'killed' }]);
  await retrievePractice(loReq({ count: 5 }), new FakeSources([planWithTopic], [bankItem]), gen);
  assert.equal(gen.reserveCalls.length, 0);
  assert.equal(gen.generateCalls, 0);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
})();
