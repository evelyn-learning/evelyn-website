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

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
})();
