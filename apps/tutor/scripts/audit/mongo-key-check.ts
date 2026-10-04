/**
 * Real-Mongo check of the creation-time key check's storage path
 * (lesson-plan/store.ts `setSegmentKeyCheck`, the read path, practice retrieval).
 *
 * THROWAWAY DATABASE ONLY. The URI must be passed inline and must be the
 * local throwaway mongod on port 27998 — the script aborts otherwise and
 * reads no env file:
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27998/evelyn_keycheck_test npx tsx scripts/audit/mongo-key-check.ts
 *
 * No model calls (the verifier is faked; PRACTICE_GEN is forced off).
 */
const URI = process.env.MONGODB_URI ?? '';
if (URI !== 'mongodb://127.0.0.1:27998/evelyn_keycheck_test' || !URI.includes(':27998/')) {
  console.error(`REFUSING TO RUN: MONGODB_URI must be the throwaway mongodb://127.0.0.1:27998/evelyn_keycheck_test (got "${URI.replace(/\/\/.*@/, '//…@')}")`);
  process.exit(2);
}
delete process.env.PRACTICE_GEN;
delete process.env.ANTHROPIC_API_KEY;
delete process.env.TUTOR_KEY_VERIFY_AT_CREATION;

import assert from 'node:assert/strict';

let passed = 0;
let failed = 0;
async function check(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}\n       ${(e as Error).message.split('\n').slice(0, 6).join('\n       ')}`);
  }
}

async function main(): Promise<void> {
  const mongoose = (await import('mongoose')).default;
  const { default: connectDB } = await import('@core/db');
  const store = await import('../../src/lib/tutor/lesson-plan/store');
  const { LessonPlanModel } = await import('../../src/models/LessonPlan');
  const { toPlanLite, mongoPracticeSources } = await import('../../src/lib/tutor/portal/adapters');
  const { retrievePractice } = await import('../../src/lib/tutor/portal/practice');
  const { effectiveSegment, keyCheckUntrusted } = await import('../../src/lib/tutor/portal/withdrawn-items');
  const { verifyPlanKeys } = await import('../../src/lib/tutor/lesson-plan/plan-key-verify');

  await connectDB();
  const c = mongoose.connection;
  if (c.host !== '127.0.0.1' || c.port !== 27998 || c.name !== 'evelyn_keycheck_test') {
    console.error(`REFUSING TO RUN: connected to ${c.host}:${c.port}/${c.name}`);
    process.exit(2);
  }
  console.log(`connected to ${c.host}:${c.port}/${c.name}`);
  await LessonPlanModel.deleteMany({});

  const PARTNER = 'kc-partner';
  const pending = { status: 'unverifiable', checkedAt: '2026-10-04T00:00:00.000Z', model: 'claude-sonnet-5', reason: 'pending' };
  const P = 'gen-kc-0001';
  const genPlan = {
    id: P,
    title: 'Linear equations',
    curriculum: 'custom',
    grade: '8',
    subject: 'math',
    topic: 'Linear equations',
    estimatedMinutes: 20,
    los: [
      { id: `${P}.lo-1`, description: 'Solve two-step equations' },
      { id: `${P}.lo-2`, description: 'Solve inequalities' },
    ],
    metadata: { generatedFromText: true, portalPartnerId: PARTNER },
    segments: [
      { id: `${P}.lo-1-concept`, kind: 'concept', goal: 'Undo operations in reverse order', keyIdeas: ['inverse operations'] },
      { id: `${P}.lo-1-we`, kind: 'worked_example', problem: 'Solve 2x + 1 = 7', steps: ['2x = 6', 'x = 3'], answer: 'x = 3' },
      { id: `${P}.lo-1-try`, kind: 'try_yourself', problem: 'Solve 3x + 2 = 14. What is x?', expectedAnswer: '4', keyCheck: pending },
      { id: `${P}.lo-1-try2`, kind: 'try_yourself', problem: 'Solve (3x + 7)/2 = 10. What is x?', expectedAnswer: '11', keyCheck: pending },
      { id: `${P}.lo-2-try`, kind: 'try_yourself', problem: 'Solve 2x + 3 < 13', expectedAnswer: 'x < 5', keyCheck: pending },
      { id: `${P}.recap`, kind: 'recap', mustRemember: ['undo in reverse order'] },
    ],
  };
  const t1 = { segmentId: `${P}.lo-1-try`, problem: 'Solve 3x + 2 = 14. What is x?', expectedAnswer: '4' };
  const t2 = { segmentId: `${P}.lo-1-try2`, problem: 'Solve (3x + 7)/2 = 10. What is x?', expectedAnswer: '11' };
  const verified = { status: 'verified' as const, checkedAt: '2026-10-04T00:00:05.000Z', model: 'claude-sonnet-5', reason: 'numeric: 4 ≈ 4' };
  const mismatch = { status: 'mismatch' as const, checkedAt: '2026-10-04T00:00:06.000Z', model: 'claude-sonnet-5', reason: 'numeric: 11 vs 4.33' };

  const seg = (plan: { segments: Array<{ id: string }> } | null, id: string): any => plan?.segments.find((s) => s.id === id);
  const rawDoc = async (id: string): Promise<any> => {
    const d = await LessonPlanModel.collection.findOne({ _id: id as never });
    if (d) delete (d as any).updatedAt;
    return d;
  };
  const practice = async (loId: string, partnerId?: string) =>
    (
      await retrievePractice(
        { studentId: 'stu-1', scope: { loId }, count: 5 } as never,
        mongoPracticeSources(partnerId ? { partnerId } : undefined),
        {
          generateAndVerify: async () => { throw new Error('generation must not run in this check'); },
          reserve: async () => 0,
          persist: async () => { throw new Error('persist must not run in this check'); },
        },
        partnerId ? { partnerId } : undefined,
      )
    ).items;

  console.log('\n1. generated plan with pending key checks');
  await store.upsertLessonPlan(genPlan);
  const before = await store.getLessonPlan(P);
  const rawBefore = await rawDoc(P);
  await check('stored plan reads back with all three try-yourselves pending', () => {
    for (const id of [t1.segmentId, t2.segmentId, `${P}.lo-2-try`]) assert.deepEqual(seg(before, id).keyCheck, pending);
  });
  await check('pending: nothing is served for lo-1 or lo-2', async () => {
    assert.deepEqual(await practice(`${P}.lo-1`, PARTNER), []);
    assert.deepEqual(await practice(`${P}.lo-2`, PARTNER), []);
  });
  await check('pending: effectiveSegment strips the key', () => {
    const e = effectiveSegment(P, seg(before, t1.segmentId)) as any;
    assert.equal(e.expectedAnswer, undefined);
    assert.equal(e.keyWithdrawn, true);
    assert.equal(e.problem, t1.problem);
  });

  console.log('\n2. setSegmentKeyCheck: verified on -try, mismatch on -try2');
  await check('both updates report modified', async () => {
    assert.equal(await store.setSegmentKeyCheck(P, t1, verified), true);
    assert.equal(await store.setSegmentKeyCheck(P, t2, mismatch), true);
  });
  const after = await store.getLessonPlan(P);
  const rawAfter = await rawDoc(P);
  await check('statuses landed on the right segments only', () => {
    assert.deepEqual(seg(after, t1.segmentId).keyCheck, verified);
    assert.deepEqual(seg(after, t2.segmentId).keyCheck, mismatch);
    assert.deepEqual(seg(after, `${P}.lo-2-try`).keyCheck, pending);
  });
  await check('every other segment and field is untouched (raw document diff)', () => {
    const strip = (d: any) => ({ ...d, segments: d.segments.map((s: any) => { const { keyCheck: _k, ...rest } = s; return rest; }) });
    assert.deepEqual(strip(rawAfter), strip(rawBefore));
    assert.equal(rawAfter.segments.length, 6);
    assert.deepEqual(rawAfter.segments.map((s: any) => s.id), genPlan.segments.map((s) => s.id));
    for (const s of rawAfter.segments) if (s.kind !== 'try_yourself') assert.equal('keyCheck' in s, false);
  });
  await check('second identical call leaves the document identical', async () => {
    const r = await store.setSegmentKeyCheck(P, t1, verified);
    console.log(`       (second identical call returned ${r})`);
    assert.deepEqual(await rawDoc(P), rawAfter);
  });
  await check('changed problem → no write, returns false', async () => {
    assert.equal(await store.setSegmentKeyCheck(P, { ...t2, problem: 'Solve something else' }, verified), false);
    assert.deepEqual(await rawDoc(P), rawAfter);
  });
  await check('changed expectedAnswer → no write, returns false', async () => {
    assert.equal(await store.setSegmentKeyCheck(P, { ...t2, expectedAnswer: '13/3' }, verified), false);
    assert.deepEqual(await rawDoc(P), rawAfter);
  });
  await check('unknown segment id / unknown plan id → false', async () => {
    assert.equal(await store.setSegmentKeyCheck(P, { ...t1, segmentId: 'nope' }, verified), false);
    assert.equal(await store.setSegmentKeyCheck('gen-does-not-exist', t1, verified), false);
    assert.equal(await LessonPlanModel.countDocuments({}), 1);
  });
  await check('a non-try_yourself segment with the same id is never stamped', async () => {
    assert.equal(await store.setSegmentKeyCheck(P, { segmentId: `${P}.lo-1-we`, problem: 'Solve 2x + 1 = 7', expectedAnswer: 'x = 3' }, verified), false);
  });

  console.log('\n3. read path → practice');
  await check('findStoredPlansByLoId → toPlanLite carries the statuses', async () => {
    const plans = await store.findStoredPlansByLoId(`${P}.lo-1`);
    assert.equal(plans.length, 1);
    const lite = toPlanLite(plans[0]);
    assert.equal(seg(lite, t1.segmentId).keyCheck.status, 'verified');
    assert.equal(seg(lite, t2.segmentId).keyCheck.status, 'mismatch');
    assert.equal(seg(lite, `${P}.lo-2-try`).keyCheck.status, 'unverifiable');
  });
  await check('practice for lo-1 serves ONLY the verified item, with its key', async () => {
    const items = await practice(`${P}.lo-1`, PARTNER);
    assert.deepEqual(items.map((i) => i.id), [`${P}::${t1.segmentId}`]);
    assert.equal(items[0].expectedAnswer, '4');
    assert.equal('keyCheck' in items[0], false);
  });
  await check('practice for lo-2 (still pending) serves nothing', async () => {
    assert.deepEqual(await practice(`${P}.lo-2`, PARTNER), []);
  });
  await check('verified: effectiveSegment returns the SAME object; mismatch: key stripped', () => {
    const v = seg(after, t1.segmentId);
    assert.equal(effectiveSegment(P, v), v);
    const m = effectiveSegment(P, seg(after, t2.segmentId)) as any;
    assert.equal(m.expectedAnswer, undefined);
  });

  console.log('\n4. legacy plan with NO keyCheck');
  const L = 'gen-kc-legacy';
  const legacy = {
    id: L,
    title: 'Legacy',
    curriculum: 'custom',
    grade: '8',
    subject: 'math',
    topic: 'Legacy topic',
    estimatedMinutes: 10,
    los: [{ id: `${L}.lo-1`, description: 'x' }],
    metadata: { generatedFromText: true },
    segments: [
      { id: `${L}.lo-1-concept`, kind: 'concept', goal: 'g', keyIdeas: ['k'] },
      { id: `${L}.lo-1-try`, kind: 'try_yourself', problem: 'What is 6 × 7?', expectedAnswer: '42' },
      { id: `${L}.lo-1-try2`, kind: 'try_yourself', problem: 'What is 9 × 9?', expectedAnswer: '81', hints: ['square'], keyCheck: null },
    ],
  };
  await store.upsertLessonPlan(legacy);
  const lraw = await rawDoc(L);
  const lplan = await store.getLessonPlan(L);
  await check('raw document has no keyCheck field on any segment', () => {
    for (const s of lraw.segments) assert.equal('keyCheck' in s, false, `${s.id} has keyCheck=${JSON.stringify(s.keyCheck)}`);
  });
  await check('read back: keys intact, trusted, effectiveSegment is identity', () => {
    for (const s of lplan!.segments as any[]) {
      if (s.kind !== 'try_yourself') continue;
      assert.equal(keyCheckUntrusted(s), false);
      assert.equal(effectiveSegment(L, s), s);
    }
    assert.equal(seg(lplan, `${L}.lo-1-try`).expectedAnswer, '42');
  });
  await check('a literal keyCheck:null written straight into Mongo is still trusted and served', async () => {
    await LessonPlanModel.collection.updateOne({ _id: L as never, 'segments.id': `${L}.lo-1-try2` }, { $set: { 'segments.$.keyCheck': null } });
    const p = await store.getLessonPlan(L);
    assert.equal(seg(p, `${L}.lo-1-try2`).keyCheck, null);
    assert.equal(keyCheckUntrusted(seg(p, `${L}.lo-1-try2`)), false);
    assert.equal(effectiveSegment(L, seg(p, `${L}.lo-1-try2`)), seg(p, `${L}.lo-1-try2`));
  });
  await check('legacy practice serves both items with their keys (no caller needed)', async () => {
    const items = await practice(`${L}.lo-1`);
    assert.deepEqual(items.map((i) => [i.id, i.expectedAnswer]), [[`${L}::${L}.lo-1-try`, '42'], [`${L}::${L}.lo-1-try2`, '81']]);
  });
  await check('re-upserting the read-back legacy plan keeps it keyCheck-free', async () => {
    await store.upsertLessonPlan(await store.getLessonPlan(L));
    const r = await rawDoc(L);
    for (const s of r.segments) assert.ok(!s.keyCheck, `${s.id} gained keyCheck=${JSON.stringify(s.keyCheck)}`);
    assert.equal((await practice(`${L}.lo-1`)).length, 2);
  });

  console.log('\n5. end-to-end: verifyPlanKeys (fake verifier) → upsert → finish() with the REAL persist');
  const E = 'gen-kc-e2e';
  const e2e = JSON.parse(JSON.stringify(genPlan).split(P).join(E));
  for (const s of e2e.segments) delete s.keyCheck;
  delete e2e.metadata.portalPartnerId;
  const parsed = (await import('../../src/lib/tutor/lesson-plan/parser')).parseLessonPlan(e2e);
  const kv = await verifyPlanKeys(parsed, {
    label: 'mongo-check',
    inlineBudgetMs: 0,
    log: (l) => console.log(`       ${l}`),
    verify: async (input) => {
      await new Promise((r) => setTimeout(r, 150));
      if (input.claimedAnswer === '11') return { status: 'mismatch', reason: 'numeric: 11 vs 4.33', model: 'fake' };
      if (input.claimedAnswer === '4') return { status: 'verified', reason: 'numeric', model: 'fake' };
      throw new Error('model API down');
    },
  });
  await check('inline budget 0 → every try-yourself is pending and finish is set', () => {
    assert.ok(kv.finish);
    for (const s of kv.plan.segments as any[]) if (s.kind === 'try_yourself') assert.equal(s.keyCheck.reason, 'pending');
  });
  await store.upsertLessonPlan(kv.plan);
  await check('before finish(): nothing served', async () => assert.deepEqual(await practice(`${E}.lo-1`), []));
  const fin = await kv.finish!();
  await check('finish() wrote 3 late results through setSegmentKeyCheck', async () => {
    assert.equal(fin.stored, 3);
    const p = await store.getLessonPlan(E);
    assert.equal(seg(p, `${E}.lo-1-try`).keyCheck.status, 'verified');
    assert.equal(seg(p, `${E}.lo-1-try2`).keyCheck.status, 'mismatch');
    assert.equal(seg(p, `${E}.lo-2-try`).keyCheck.status, 'unverifiable');
    assert.match(seg(p, `${E}.lo-2-try`).keyCheck.reason, /model API down/);
    assert.deepEqual((await practice(`${E}.lo-1`)).map((i) => i.id), [`${E}::${E}.lo-1-try`]);
  });

  console.log('\n6. later whole-plan upserts vs. the stored status (review item i)');
  await check('re-upsert of the ORIGINAL pending plan object resets verified → pending (safe direction)', async () => {
    await store.upsertLessonPlan(kv.plan);
    const p = await store.getLessonPlan(E);
    assert.equal(seg(p, `${E}.lo-1-try`).keyCheck.reason, 'pending');
    assert.deepEqual(await practice(`${E}.lo-1`), []);
  });
  await check('re-upsert of a copy WITHOUT keyCheck (stale pre-check object) makes every key trusted again', async () => {
    await store.upsertLessonPlan(parsed);
    const p = await store.getLessonPlan(E);
    console.log(`       after stale upsert: try2 keyCheck=${JSON.stringify(seg(p, `${E}.lo-1-try2`).keyCheck)} served=${(await practice(`${E}.lo-1`)).length}`);
    assert.equal(seg(p, `${E}.lo-1-try2`).keyCheck, undefined);
  });
  await check('seed plans are never written', async () => {
    const seedId = store.SEED_PLANS[0].id;
    assert.equal(await store.setSegmentKeyCheck(seedId, t1, verified), false);
    assert.equal(await LessonPlanModel.countDocuments({ _id: seedId }), 0);
  });

  await LessonPlanModel.deleteMany({});
  await mongoose.disconnect();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('script error:', e);
  process.exit(1);
});
