/**
 * Backfill attribution tests (M1c Task 6).
 *
 * Run: `npm run test:partner-backfill`
 *
 * Pure function tests — attributeProfile takes the sessions it needs, so no
 * DB is involved and this counts in the oracle.
 */
import assert from 'node:assert';
import {
  attributeProfile,
  findUnexpectedPartners,
  planPartnerRows,
  decideBackfill,
  executeBackfill,
  type AttributionResult,
} from './backfill-partner-namespace';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

await test('uses a prefix as a partner HINT but never strips it from externalStudentId', () => {
  const r = attributeProfile({ _id: 'lmtest:abc:def' }, new Map());
  assert.strictEqual(r.partnerId, 'lmtest');
  // Spec 4.2: the partner sends the WHOLE string. Splitting it here would make
  // resolveProfileId('lmtest', 'abc:def') miss this row after the flip and mint
  // a blank profile — for 393 of the 495 rows.
  assert.strictEqual(r.externalStudentId, 'lmtest:abc:def');
  assert.strictEqual(r.signal, 'existing-prefix');
});

await test('attributes via sourcePartnerId', () => {
  const sessions = new Map([['u1', [{ sourcePartnerId: 'crimsora' }]]]);
  const r = attributeProfile({ _id: 'u1' }, sessions);
  assert.strictEqual(r.partnerId, 'crimsora');
  assert.strictEqual(r.externalStudentId, 'u1');
  assert.strictEqual(r.signal, 'sourcePartnerId');
});

await test('falls back to evelyn when no session carries a partner', () => {
  const r = attributeProfile({ _id: 'orphan-1' }, new Map());
  assert.strictEqual(r.partnerId, 'evelyn');
  assert.strictEqual(r.signal, 'orphan-default');
});

await test('falls back to evelyn for a session with no sourcePartnerId', () => {
  // TS2559 note: an object literal with zero properties in common with a
  // weak (all-optional) target type is rejected at compile time, so this
  // uses `sourcePartnerId: undefined` rather than an unrelated field like
  // `{ source: 'tutor' }` to represent "field absent" — same runtime case
  // (attributeProfile sees no sourcePartnerId), type-checks cleanly.
  const sessions = new Map([['u2', [{ sourcePartnerId: undefined }]]]);
  const r = attributeProfile({ _id: 'u2' }, sessions);
  assert.strictEqual(r.partnerId, 'evelyn');
});

await test('REFUSES to guess when two sessions disagree', () => {
  const sessions = new Map([['u3', [{ sourcePartnerId: 'crimsora' }, { sourcePartnerId: 'academy' }]]]);
  assert.throws(() => attributeProfile({ _id: 'u3' }, sessions), /ambiguous/i);
});

await test('is idempotent — a migrated profile is left alone', () => {
  const r = attributeProfile(
    { _id: 'gen-1', partnerId: 'crimsora', externalStudentId: 'user_1' }, new Map(),
  );
  assert.strictEqual(r.signal, 'already-migrated');
  assert.strictEqual(r.partnerId, 'crimsora');
  // Round-1 fix: a regression here would silently rewrite a student's
  // external id on a second run of the script.
  assert.strictEqual(r.externalStudentId, 'user_1');
});

// --- Round-1 review fixes: the allowlist guard and the "never create a
// kind:'partner' row" guard. Both are pure functions so the abort condition
// can be proven without touching a database — main() calls process.exit(1)
// as soon as either returns non-empty, before any write.

await test('allowlist: a stray-colon id outside the measured set is flagged, not silently accepted', () => {
  const violators = findUnexpectedPartners(['evelyn', 'crimsora', 'sneaky:colon']);
  assert.deepStrictEqual(violators, ['sneaky:colon']);
});

await test('allowlist: every measured partner id passes clean', () => {
  const violators = findUnexpectedPartners([
    'evelyn', 'evelyn-marketing', 'crimsora', 'academy', 'lmtest', 'trial', 'revtest', 'portalA',
  ]);
  assert.deepStrictEqual(violators, []);
});

await test('partner-row plan: a real partner id with no existing row is reported as missingReal (main() aborts on this before any write)', () => {
  const plan = planPartnerRows(['crimsora', 'evelyn'], new Set(['evelyn']));
  assert.deepStrictEqual(plan.missingReal, ['crimsora']);
});

await test('partner-row plan: NEVER proposes creating a kind:partner row — only first-party/test are ever auto-created', () => {
  const plan = planPartnerRows(['evelyn', 'lmtest', 'trial', 'crimsora'], new Set());
  assert.deepStrictEqual(plan.missingReal, ['crimsora'], 'crimsora is real and unseeded — must block, not be planned');
  assert.deepStrictEqual(
    plan.toCreate.map((r) => r.partnerId).sort(),
    ['evelyn', 'lmtest', 'trial'],
  );
  for (const row of plan.toCreate) {
    assert.notStrictEqual(row.kind, 'partner', `${row.partnerId} must never be auto-created as kind:'partner'`);
  }
});

await test('partner-row plan: an already-existing partner row (however it got there) is left alone, real or not', () => {
  const plan = planPartnerRows(['crimsora', 'academy'], new Set(['crimsora', 'academy']));
  assert.deepStrictEqual(plan.missingReal, []);
  assert.deepStrictEqual(plan.toCreate, []);
});

// --- Round-2 review fix (item 3): the tests above only prove the pure
// DETECTORS return the right values — they never exercised the code path
// that actually gates a write. Before this round, deleting either
// `process.exit(1)` in main() left all tests green. decideBackfill +
// executeBackfill factor the whole "decide, then only write if clean" flow
// out of main() into something a spy can watch: these tests assert ZERO
// calls to the write deps on every abort path, with write=true, so a
// deleted `if (decision.abort) return;` inside executeBackfill turns this
// red. (Verified by hand: temporarily commenting that line out flips the
// three "blocks all writes" tests below to FAIL — see task-6-report.md.)

function spyDeps() {
  const calls = { createPartnerRow: 0, writeProfile: 0 };
  return {
    calls,
    deps: {
      createPartnerRow: () => { calls.createPartnerRow++; },
      writeProfile: () => { calls.writeProfile++; },
    },
  };
}

const sampleApply: Array<{ _id: string; result: AttributionResult }> = [
  { _id: 's1', result: { partnerId: 'crimsora', externalStudentId: 's1', signal: 'sourcePartnerId' } },
];

await test('write gate: ambiguous attribution blocks all writes even with write=true', async () => {
  const decision = decideBackfill(
    { ambiguous: [{ id: 'x', error: 'ambiguous attribution' }], partnersObserved: new Set() },
    new Set(),
  );
  assert.strictEqual(decision.abort, true);
  assert.strictEqual(decision.reason, 'ambiguous');
  const { calls, deps } = spyDeps();
  await executeBackfill(decision, sampleApply, true, deps);
  assert.strictEqual(calls.createPartnerRow, 0);
  assert.strictEqual(calls.writeProfile, 0, 'an ambiguous profile must never be written, write=true or not');
});

await test('write gate: an unexpected (non-allowlisted) partner blocks all writes even with write=true', async () => {
  const decision = decideBackfill(
    { ambiguous: [], partnersObserved: new Set(['evelyn', 'sneaky:colon']) },
    new Set(),
  );
  assert.strictEqual(decision.abort, true);
  assert.strictEqual(decision.reason, 'unexpected-partners');
  const { calls, deps } = spyDeps();
  await executeBackfill(decision, sampleApply, true, deps);
  assert.strictEqual(calls.createPartnerRow, 0);
  assert.strictEqual(calls.writeProfile, 0);
});

await test('write gate: an unseeded real partner blocks all writes even with write=true (this is the guard that fired on real prod data)', async () => {
  const decision = decideBackfill(
    { ambiguous: [], partnersObserved: new Set(['crimsora', 'evelyn']) },
    new Set(), // neither crimsora nor evelyn has an existing row yet
  );
  assert.strictEqual(decision.abort, true);
  assert.strictEqual(decision.reason, 'missing-real-partners');
  if (decision.abort && decision.reason === 'missing-real-partners') {
    assert.deepStrictEqual(decision.detail, ['crimsora']);
    // Round-2 item 1: even the aborting decision carries the full plan, so
    // main() can report what it WOULD have created before reporting the abort.
    assert.deepStrictEqual(decision.partnerPlan.toCreate.map((r) => r.partnerId), ['evelyn']);
  }
  const { calls, deps } = spyDeps();
  await executeBackfill(decision, sampleApply, true, deps);
  assert.strictEqual(calls.createPartnerRow, 0);
  assert.strictEqual(calls.writeProfile, 0);
});

await test('write gate: write=false performs zero writes even on a fully clean decision', async () => {
  const decision = decideBackfill(
    { ambiguous: [], partnersObserved: new Set(['evelyn']) },
    new Set(['evelyn']),
  );
  assert.strictEqual(decision.abort, false);
  const { calls, deps } = spyDeps();
  await executeBackfill(decision, sampleApply, false, deps);
  assert.strictEqual(calls.createPartnerRow, 0);
  assert.strictEqual(calls.writeProfile, 0, 'dry run (write=false) must never call writeProfile');
});

await test('write gate: a clean decision with write=true calls each dep exactly once per planned item', async () => {
  const decision = decideBackfill(
    { ambiguous: [], partnersObserved: new Set(['evelyn']) },
    new Set(), // evelyn not yet seeded → exactly one toCreate row
  );
  assert.strictEqual(decision.abort, false);
  const { calls, deps } = spyDeps();
  await executeBackfill(decision, sampleApply, true, deps);
  assert.strictEqual(calls.createPartnerRow, 1, 'exactly one Partner row (evelyn) should be created');
  assert.strictEqual(calls.writeProfile, 1, 'exactly one profile (sampleApply has one entry) should be written');
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
