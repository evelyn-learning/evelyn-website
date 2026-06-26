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
import type { RetrievePracticeRequest } from '@/lib/portal-contract/v1';

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
  assert.deepStrictEqual(ids, ['ty-1', 'ty-2', 'openstax.stats.0042']);
  assert.ok(r.items.every((i) => i.loId === LO), 'every item tagged with the requested LO');
  assert.strictEqual(r.items[0].source, 'plan-try-yourself');
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

await test('count caps the result (plan items first)', async () => {
  const r = await retrievePractice(loReq({ count: 2 }), new FakeSources([planWithLo], [bankItem]));
  assert.strictEqual(r.items.length, 2);
  assert.deepStrictEqual(r.items.map((i) => i.id), ['ty-1', 'ty-2']);
});

await test('dedup by id — plan item wins over a bank item with the same id', async () => {
  const collidingBank: BankLite = { ...bankItem, id: 'ty-1' };
  const r = await retrievePractice(loReq(), new FakeSources([planWithLo], [collidingBank]));
  const ty1 = r.items.filter((i) => i.id === 'ty-1');
  assert.strictEqual(ty1.length, 1);
  assert.strictEqual(ty1[0].source, 'plan-try-yourself');
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

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
})();
