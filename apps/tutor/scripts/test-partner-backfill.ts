/**
 * Backfill attribution tests (M1c Task 6).
 *
 * Run: `npm run test:partner-backfill`
 *
 * Pure function tests — attributeProfile takes the sessions it needs, so no
 * DB is involved and this counts in the oracle.
 */
import assert from 'node:assert';
import { attributeProfile } from './backfill-partner-namespace';

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
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
