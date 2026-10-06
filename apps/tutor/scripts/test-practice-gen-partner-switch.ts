/**
 * PRACTICE_GEN_DISABLED_PARTNERS — per-partner switch for on-demand practice
 * generation.
 *
 * Server env, comma-separated partner ids, read at CALL time (no restart-order
 * surprises), trimmed, case-insensitive; unset / empty ⇒ nobody is disabled.
 * For a listed partner the practice endpoint and the end-of-session top-up
 * serve STORED items only: no cap reservation, no model call, nothing banked.
 * An empty result carries `emptyReason: 'none_available'` — never 'preparing'
 * or 'limit' — which is the contract the host already reads: with nothing
 * previously served it shows "not available yet", with items previously
 * served (its own `excludeIds` count) it shows the ordinary "completed all
 * the practice" state. Every other partner is untouched.
 *
 * No database, no model: injected sources throughout.
 * Run: npx tsx scripts/test-practice-gen-partner-switch.ts  (npm run test:practice-gen-partner-switch)
 */
import { strict as assert } from 'node:assert';
import { retrievePractice, type PracticeSources, type PlanLite, type BankLite } from '../src/lib/tutor/portal/practice';
import {
  generatePracticeItemsDetailed,
  practiceGenDisabledForPartner,
  type GeneratePracticeItemsOptions,
  type PracticeGenSources,
} from '../src/lib/tutor/portal/practice-gen';
import { topUpPractice } from '../src/lib/tutor/practice-assign/top-up';
import type { GenPayload } from '../src/lib/tutor/voice/problem-generator';
import type { PracticeItem } from '@evelyn/portal-contract/v1';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}\n      ${(e as Error).message}`); }
}
const VAR = 'PRACTICE_GEN_DISABLED_PARTNERS';
async function withEnv(value: string | undefined, fn: () => Promise<void> | void) {
  const before = process.env[VAR];
  if (value === undefined) delete process.env[VAR]; else process.env[VAR] = value;
  try { await fn(); } finally { if (before === undefined) delete process.env[VAR]; else process.env[VAR] = before; }
}

const NUMERIC_GEN: GenPayload = { problemText: 'What is 6 × 7?', finalAnswer: '42', responseFormat: 'numeric', answerKind: 'numeric' };
function countingGen() {
  const calls = { reserve: 0, generate: 0, persist: 0 };
  const sources: PracticeGenSources = {
    async reserve(_s, _l, n) { calls.reserve++; return n; },
    async generateAndVerify() { calls.generate++; return { gen: { ...NUMERIC_GEN, problemText: `What is 6 × ${6 + calls.generate}?` }, hash: `h${calls.generate}` }; },
    async persist() { calls.persist++; },
  };
  return { calls, sources };
}
const LO = 'alg1.order-of-operations';
const plan: PlanLite = { id: 'evelyn.alg1.order-of-operations.v1', title: 'Order of Operations', topic: 'algebra-1', los: [{ id: LO }], segments: [] };
const STORED: BankLite[] = [
  { id: 'alg1-order-of-operations-001', loId: LO, problemText: 'Evaluate 36 ÷ 6 · 2 + 1', answer: '13', responseFormat: 'numeric' },
  { id: `practice-gen.${LO}.abc123`, loId: LO, problemText: 'Evaluate 2 + 3 · 4', answer: '14', responseFormat: 'numeric' },
];
function sources(bank: BankLite[]): PracticeSources {
  return {
    async plansForLoId(loId) { return loId === LO ? [plan] : []; },
    async plansForTopic() { return []; },
    async bankForLoId(loId) { return bank.filter((b) => b.loId === loId); },
    async bankForTopic() { return []; },
  };
}
const req = (count: number, excludeIds?: string[]) => ({ studentId: 's1', courseId: 'c1', scope: { loId: LO }, count, ...(excludeIds ? { excludeIds } : {}) });

async function main() {
  console.log('PRACTICE_GEN_DISABLED_PARTNERS');
  process.env.PRACTICE_GEN = 'on';

  await test('parsing: unset / empty ⇒ nobody; trimmed, case-insensitive, exact ids only', () => {
    assert.equal(practiceGenDisabledForPartner('greenapple', {}), false);
    assert.equal(practiceGenDisabledForPartner('greenapple', { [VAR]: '' }), false);
    assert.equal(practiceGenDisabledForPartner('greenapple', { [VAR]: ' , ,' }), false);
    assert.equal(practiceGenDisabledForPartner('greenapple', { [VAR]: 'greenapple' }), true);
    assert.equal(practiceGenDisabledForPartner('GreenApple', { [VAR]: ' kanzoo , GREENAPPLE ' }), true);
    assert.equal(practiceGenDisabledForPartner(' greenapple ', { [VAR]: 'greenapple,kanzoo' }), true);
    assert.equal(practiceGenDisabledForPartner('kanzoo', { [VAR]: 'greenapple,kanzoo' }), true);
    assert.equal(practiceGenDisabledForPartner('crimsora', { [VAR]: 'greenapple,kanzoo' }), false);
    assert.equal(practiceGenDisabledForPartner('green', { [VAR]: 'greenapple' }), false, 'no prefix match');
    assert.equal(practiceGenDisabledForPartner('greenapple2', { [VAR]: 'greenapple' }), false);
    for (const none of [undefined, null, '', '  ']) assert.equal(practiceGenDisabledForPartner(none, { [VAR]: 'greenapple' }), false, 'an unknown caller is not a listed partner');
  });

  await test('read at call time: the same process flips with the variable', async () => {
    await withEnv('greenapple', () => { assert.equal(practiceGenDisabledForPartner('greenapple'), true); });
    await withEnv(undefined, () => { assert.equal(practiceGenDisabledForPartner('greenapple'), false); });
  });

  // ── practice endpoint (retrievePractice) ──────────────────────────────────
  await test('listed partner: stored items only — the shortfall is not generated, nothing reserved or banked', async () => {
    await withEnv('greenapple', async () => {
      const gen = countingGen();
      const res = await retrievePractice(req(3), sources(STORED), gen.sources, { partnerId: 'greenapple' });
      assert.deepEqual(res.items.map((i) => i.id), STORED.map((b) => b.id), 'both stored rows (authored and previously generated) are served');
      assert.equal(res.emptyReason, undefined);
      assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
    });
  });

  await test('listed partner, skill never served and nothing stored: empty with none_available', async () => {
    await withEnv('greenapple', async () => {
      const gen = countingGen();
      const res = await retrievePractice(req(3), sources([]), gen.sources, { partnerId: 'greenapple' });
      assert.deepEqual(res.items, []);
      assert.equal(res.emptyReason, 'none_available');
      assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
    });
  });

  await test('listed partner, student already served every stored item: empty, none_available — never preparing / limit', async () => {
    await withEnv('greenapple', async () => {
      const gen = countingGen();
      const res = await retrievePractice(req(3, STORED.map((b) => b.id)), sources(STORED), gen.sources, { partnerId: 'greenapple' });
      assert.deepEqual(res.items, []);
      assert.equal(res.emptyReason, 'none_available', 'the host reads this + its own previously-served count as "completed all the practice"');
      assert.deepEqual(gen.calls, { reserve: 0, generate: 0, persist: 0 });
    });
  });

  await test('unlisted partner with the variable set: generates exactly as before', async () => {
    await withEnv('greenapple', async () => {
      const gen = countingGen();
      const res = await retrievePractice(req(3), sources(STORED), gen.sources, { partnerId: 'crimsora' });
      assert.equal(gen.calls.reserve, 1);
      assert.ok(gen.calls.generate >= 1);
      assert.ok(res.items.some((i) => i.id.startsWith(`practice-gen.${LO}.`) && i.id !== STORED[1].id), 'a freshly generated item is served');
    });
  });

  await test('variable unset: the listed-elsewhere partner generates as before', async () => {
    await withEnv(undefined, async () => {
      const gen = countingGen();
      await retrievePractice(req(3), sources(STORED), gen.sources, { partnerId: 'greenapple' });
      assert.equal(gen.calls.reserve, 1);
      assert.ok(gen.calls.generate >= 1);
    });
  });

  await test('unknown caller (no partner id) is unaffected by the list', async () => {
    await withEnv('greenapple', async () => {
      const gen = countingGen();
      await retrievePractice(req(3), sources(STORED), gen.sources);
      assert.equal(gen.calls.reserve, 1);
    });
  });

  // ── the generator itself ──────────────────────────────────────────────────
  await test('generatePracticeItemsDetailed: a listed partnerId generates nothing before any reservation', async () => {
    const opts: GeneratePracticeItemsOptions = { studentId: 's1', loId: LO, topic: 'algebra-1', topicId: 'algebra-1', shortfall: 2, anchorItems: [] };
    await withEnv('greenapple', async () => {
      const listed = countingGen();
      const out = await generatePracticeItemsDetailed({ ...opts, partnerId: 'greenapple' }, listed.sources);
      assert.deepEqual([out.items, out.status, out.reserved, out.pending], [[], 'off', 0, 0]);
      assert.deepEqual(listed.calls, { reserve: 0, generate: 0, persist: 0 });
      const other = countingGen();
      await generatePracticeItemsDetailed({ ...opts, partnerId: 'crimsora' }, other.sources);
      assert.equal(other.calls.reserve, 1);
      const anonymous = countingGen();
      await generatePracticeItemsDetailed(opts, anonymous.sources);
      assert.equal(anonymous.calls.reserve, 1);
    });
  });

  // ── end-of-session top-up ─────────────────────────────────────────────────
  const stored: PracticeItem = { id: 'alg1-order-of-operations-001', source: 'bank', problemText: 'Evaluate 36 ÷ 6 · 2 + 1', expectedAnswer: '13', loId: LO };
  const topUpInput = (partnerId?: string) => ({ studentId: 's1', topic: 'algebra-1', anchorsFor: () => [], ...(partnerId ? { partnerId } : {}) });

  await test('top-up, listed partner: keeps the stored items, never calls the generator', async () => {
    await withEnv('greenapple', async () => {
      let genCalls = 0;
      const gen = async (): Promise<PracticeItem[]> => { genCalls++; return [{ ...stored, id: 'practice-gen.x.1' }]; };
      const out = await topUpPractice([{ loId: LO, title: 'Order of Operations', items: [stored] }], [{ loId: LO, title: 'Order of Operations' }], topUpInput('greenapple'), gen);
      assert.equal(genCalls, 0);
      assert.deepEqual(out, [{ loId: LO, title: 'Order of Operations', items: [stored] }]);
      const none = await topUpPractice([], [{ loId: LO, title: 'Order of Operations' }], topUpInput('greenapple'), gen);
      assert.deepEqual(none, [], 'nothing stored ⇒ nothing assigned, and no empty LO left behind');
      assert.equal(genCalls, 0);
    });
  });

  await test('top-up forwards the partner id to the generator; unlisted / unset partners top up as before', async () => {
    const seenPartner: Array<string | undefined> = [];
    const gen = async (o: GeneratePracticeItemsOptions): Promise<PracticeItem[]> => { seenPartner.push(o.partnerId); return [{ ...stored, id: `practice-gen.x.${seenPartner.length}` }]; };
    await withEnv('greenapple', async () => {
      const out = await topUpPractice([{ loId: LO, title: 'T', items: [stored] }], [{ loId: LO, title: 'T' }], topUpInput('crimsora'), gen);
      assert.ok(out[0].items.length > 1, 'an unlisted partner is topped up');
    });
    await withEnv(undefined, async () => {
      const out = await topUpPractice([{ loId: LO, title: 'T', items: [stored] }], [{ loId: LO, title: 'T' }], topUpInput('greenapple'), gen);
      assert.ok(out[0].items.length > 1, 'variable unset ⇒ topped up');
      const anon = await topUpPractice([{ loId: LO, title: 'T', items: [stored] }], [{ loId: LO, title: 'T' }], topUpInput(), gen);
      assert.ok(anon[0].items.length > 1);
    });
    assert.ok(seenPartner.includes('crimsora') && seenPartner.includes('greenapple') && seenPartner.includes(undefined));
  });

  await test('both production top-up call sites pass the partner id', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const assign = readFileSync(join(__dirname, '../src/lib/tutor/practice-assign/assign.ts'), 'utf8');
    assert.equal((assign.match(/topUpPractice\(/g) ?? []).length, 2);
    assert.match(assign, /topUpPractice\(los, wanted, \{ \.\.\.input\.topUp, partnerId: input\.partnerId, target: Math\.min\(PRACTICE_TARGET, cap\) \}\)/);
    assert.match(assign, /\{ \.\.\.input\.topUp, partnerId: input\.partnerId, target \},/);
  });

  delete process.env.PRACTICE_GEN;
  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
