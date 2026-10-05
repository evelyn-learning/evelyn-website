/**
 * G1 (2026-10-03) — the free-response grade resolver and the assessment-key
 * resolver must find items from Mongo-STORED generated lesson plans
 * (`gen-<uuid>…::<segId>`) and from generated ProblemBank rows
 * (`practice-gen.<loId>.<hash>`), not only the in-code SEED_PLANS. Observed:
 * every item of the six generated GreenApple courses graded as
 * "unknown itemId" (404).
 *
 * No live DB: the resolvers take injectable deps (stored-plan lookup, bank
 * lookup); the route-level tests monkeypatch connectDB + the two Mongoose
 * models + defaultGradeDeps (same idiom as adapters.test.ts /
 * practice-gen.test.ts), so no database and no model is ever touched.
 *
 * Run: npm run test:grade-resolver
 */
import { strict as assert } from 'node:assert';

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import type { NextRequest } from 'next/server';
import { resolveGradeItem, resolveAssessmentItem, type ItemKeyDeps } from './adapters';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { IProblemBank } from '@/models/ProblemBank';
import { ProblemBank } from '@/models/ProblemBank';
import { LessonPlanModel } from '@/models/LessonPlan';
import * as dbModule from '@core/db';
import * as gfrModule from './grade-free-response';
import { POST as gradePOST } from '@/app/api/portal/v1/grade/route';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

// A seed item with a known answer key (also used by adapters.test.ts).
const SEED_ITEM = 'evelyn.testprep.act.english.grammar-rules.v1::try-1';

const GEN_PLAN = {
  id: 'gen-x',
  title: 'Generated plan',
  topic: 'physics-1',
  los: [{ id: 'gen-x.lo-1' }],
  segments: [
    { kind: 'explain', id: 'seg-0' },
    // Stored plans round-trip through Mongo: absent optionals come back as
    // literal nulls (see adapters.ts toPlanLite).
    {
      kind: 'try_yourself', id: 'seg-1', problem: 'A 3 kg block… find a.', expectedAnswer: '4.9 m/s^2',
      rubric: null, modelResponse: null, hints: null, choices: null, responseFormat: null,
      passageId: null, passageIds: null, packetLabel: null,
    },
  ],
} as unknown as LessonPlan;

const BANK_ROW = {
  id: 'practice-gen.gen-x.lo-1.abc123',
  problemText: 'Find the net force.',
  answer: '12',
  responseFormat: 'numeric',
  hints: ['F = ma'],
} as unknown as IProblemBank;

function makeDeps(over: Partial<ItemKeyDeps> = {}) {
  const calls = { plan: [] as string[], bank: [] as string[] };
  const deps: ItemKeyDeps = {
    async getStoredPlan(id) { calls.plan.push(id); return id === GEN_PLAN.id ? GEN_PLAN : null; },
    async findBankRow(id) { calls.bank.push(id); return id === BANK_ROW.id ? BANK_ROW : null; },
    ...over,
  };
  return { deps, calls };
}

(async () => {

console.log('resolveGradeItem:');

await test('a stored generated plan item (gen-x::seg-1) resolves with its expectedAnswer', async () => {
  const { deps, calls } = makeDeps();
  const item = await resolveGradeItem('gen-x::seg-1', deps);
  assert.ok(item, 'expected the generated item to resolve');
  assert.equal(item!.itemId, 'gen-x::seg-1');
  assert.equal(item!.expectedAnswer, '4.9 m/s^2');
  // Mongo nulls are normalized away — a null rubric must not reach the grader.
  assert.equal(item!.rubric, undefined);
  assert.equal(item!.modelResponse, undefined);
  assert.equal(item!.passageText, undefined);
  assert.deepEqual(calls.plan, ['gen-x']);
  assert.deepEqual(calls.bank, [], 'a qualified id never falls through to the bank');
});

await test('a seed id still resolves — and never touches the stored-plan lookup', async () => {
  const { deps, calls } = makeDeps();
  const item = await resolveGradeItem(SEED_ITEM, deps);
  assert.ok(item);
  assert.ok(item!.expectedAnswer);
  assert.deepEqual(calls.plan, []);
  assert.deepEqual(calls.bank, []);
});

await test('a seed plan with an unknown segment → null, no DB fallthrough', async () => {
  const { deps, calls } = makeDeps();
  assert.equal(await resolveGradeItem('evelyn.testprep.act.english.grammar-rules.v1::no-such-seg', deps), null);
  assert.deepEqual(calls.plan, []);
});

await test('an unknown plan → null', async () => {
  const { deps } = makeDeps();
  assert.equal(await resolveGradeItem('gen-nope::seg-1', deps), null);
});

await test('a stored plan with no such try_yourself segment → null (non-try kinds do not count)', async () => {
  const { deps } = makeDeps();
  assert.equal(await resolveGradeItem('gen-x::seg-0', deps), null);
  assert.equal(await resolveGradeItem('gen-x::seg-9', deps), null);
});

await test('a practice-gen.* bank id resolves via the bank lookup', async () => {
  const { deps, calls } = makeDeps();
  const item = await resolveGradeItem(BANK_ROW.id, deps);
  assert.deepEqual(item, {
    itemId: BANK_ROW.id,
    expectedAnswer: '12',
    problemText: 'Find the net force.',
    rubric: undefined,
    modelResponse: undefined,
    passageText: undefined,
  });
  assert.deepEqual(calls.plan, [], 'a bare id never triggers the plan lookup');
  assert.deepEqual(calls.bank, [BANK_ROW.id]);
});

await test('an unknown bare id → null', async () => {
  const { deps } = makeDeps();
  assert.equal(await resolveGradeItem('no-such-item', deps), null);
});

await test('a throwing lookup never throws out of the resolver — null', async () => {
  const boom = async () => { throw new Error('db down'); };
  const { deps } = makeDeps({ getStoredPlan: boom, findBankRow: boom });
  assert.equal(await resolveGradeItem('gen-x::seg-1', deps), null);
  assert.equal(await resolveGradeItem(BANK_ROW.id, deps), null);
});

console.log('resolveAssessmentItem:');

await test('a stored generated plan item resolves to its key', async () => {
  const { deps, calls } = makeDeps();
  const key = await resolveAssessmentItem('gen-x::seg-1', deps);
  assert.ok(key);
  assert.equal(key!.expectedAnswer, '4.9 m/s^2');
  assert.equal(key!.responseFormat, undefined);
  assert.equal(key!.choices, undefined);
  assert.equal(key!.rubric, undefined);
  assert.equal(key!.hints, undefined);
  assert.deepEqual(calls.bank, []);
});

await test('an unknown stored plan → null; a seed id resolves without the plan lookup', async () => {
  const { deps, calls } = makeDeps();
  assert.equal(await resolveAssessmentItem('gen-nope::seg-1', deps), null);
  calls.plan.length = 0;
  const key = await resolveAssessmentItem(SEED_ITEM, deps);
  assert.ok(key && key.expectedAnswer);
  assert.deepEqual(calls.plan, []);
});

await test('a practice-gen.* bank id resolves via the bank lookup', async () => {
  const { deps } = makeDeps();
  const key = await resolveAssessmentItem(BANK_ROW.id, deps);
  assert.ok(key);
  assert.equal(key!.expectedAnswer, '12');
  assert.equal(key!.responseFormat, 'numeric');
  assert.deepEqual(key!.hints, ['F = ma']);
});

console.log('POST /api/portal/v1/grade (Mongo + grader monkeypatched):');

// Stub Mongo: connectDB no-op; LessonPlanModel.findById → the generated plan
// doc; ProblemBank.findOne → the bank row. Stub the grader so no model runs.
(dbModule as unknown as { default: () => Promise<void> }).default = async () => {};
(LessonPlanModel as unknown as { findById: (id: string) => Promise<unknown> }).findById = async (id: string) =>
  id === GEN_PLAN.id ? { toJSON: () => ({ ...GEN_PLAN }) } : null;
const bankFilters: Array<Record<string, unknown>> = [];
(ProblemBank as unknown as {
  findOne: (f: Record<string, unknown>) => { lean: () => Promise<unknown> };
}).findOne = (f) => {
  bankFilters.push(f);
  return { lean: async () => (f.id === BANK_ROW.id ? BANK_ROW : null) };
};
const judged: string[] = [];
const judgedQuestions: Array<string | undefined> = [];
(gfrModule as unknown as { defaultGradeDeps: () => gfrModule.GradeDeps }).defaultGradeDeps = () => ({
  async gradeRubricPart() { throw new Error('no rubric expected'); },
  async judgeSingleAnswer(args) { judged.push(args.expectedAnswer); judgedQuestions.push(args.question); return { correct: true, feedback: 'ok' }; },
});

function signed(body: unknown): NextRequest {
  const raw = JSON.stringify(body);
  const timestamp = String(Date.now());
  const path = '/api/portal/v1/grade';
  const sig = signPortalRequest('secret-a', { method: 'POST', path, timestamp, body: raw });
  return new Request(`https://engine.test${path}`, {
    method: 'POST',
    headers: { 'x-evelyn-partner': 'portalA', 'x-evelyn-timestamp': timestamp, 'x-evelyn-signature': sig },
    body: raw,
  }) as unknown as NextRequest;
}
async function grade(itemId: string, text = '4.9') {
  const res = await gradePOST(signed({ studentId: 'portalA:s1', itemId, response: { text } }), undefined);
  return { status: res.status, json: await res.json() };
}

await test('route: a generated-plan item grades (200) against its stored key', async () => {
  judged.length = 0;
  judgedQuestions.length = 0;
  const { status, json } = await grade('gen-x::seg-1');
  assert.equal(status, 200, JSON.stringify(json));
  assert.deepEqual(judged, ['4.9 m/s^2']);
  assert.deepEqual(judgedQuestions, ['A 3 kg block… find a.'], 'the judge is given the item\'s question text');
});

await test('route: a practice-gen.* bank item grades (200); the bank query excludes mock rows', async () => {
  judged.length = 0;
  bankFilters.length = 0;
  const { status, json } = await grade(BANK_ROW.id, '12 newtons');
  assert.equal(status, 200);
  assert.deepEqual(judged, ['12'], 'an answer that is not a single number goes to the judge');
  assert.equal(json.totalPoints, 1);
  assert.deepEqual(bankFilters[0], { id: BANK_ROW.id, bankScope: { $ne: 'mock' } });
});

await test('route: a plain-number key is graded by the deterministic rule — no judge call, near misses wrong', async () => {
  judged.length = 0;
  const near = await grade(BANK_ROW.id, '11.98');
  assert.equal(near.status, 200);
  assert.equal(near.json.totalPoints, 0);
  assert.equal(near.json.maxPoints, 1);
  assert.equal(near.json.parts[0].feedback, 'The expected answer is 12; 11.98 is not equal to it.');
  assert.equal(near.json.modelResponse, '12');
  const exact = await grade(BANK_ROW.id, 'F = 12.0');
  assert.equal(exact.json.totalPoints, 1);
  assert.equal(exact.json.parts[0].feedback, 'Correct.');
  assert.deepEqual(judged, [], 'the judge is never called for a plain-number key and a single-number answer');
});

await test('route: a truly unknown id is still 404', async () => {
  for (const id of ['no-such-item', 'gen-nope::seg-1', 'gen-x::seg-9']) {
    const { status, json } = await grade(id);
    assert.equal(status, 404, id);
    assert.equal(json.reason, 'unknown itemId');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

})();
