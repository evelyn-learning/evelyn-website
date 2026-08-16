/**
 * Flag-override channel tests (M1c Task 8).
 *
 * Run: `npm run test:partner-flags`
 *
 * Pure function tests — resolveFlag takes everything it needs as arguments,
 * so no DB is involved and this counts in the oracle.
 */
import assert from 'node:assert';
import { resolveFlag } from '@/lib/tutor/portal/flags';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

await test('an override wins over the build-time fallback', () => {
  const partner = { flagOverrides: { newBoard: true } };
  assert.strictEqual(resolveFlag('newBoard', partner, false), true);
});

await test('an absent override falls back to the build-time constant', () => {
  const partner = { flagOverrides: {} };
  assert.strictEqual(resolveFlag('newBoard', partner, false), false);
  assert.strictEqual(resolveFlag('greeting', partner, 'default-greeting'), 'default-greeting');
});

await test('a null partner (internal/retail call) falls back to the build-time constant', () => {
  assert.strictEqual(resolveFlag('newBoard', null, true), true);
  assert.strictEqual(resolveFlag('newBoard', null, false), false);
});

// --- The `??` vs `||` trap: `false` and `''` are real override values, not
// "absent". `||` would silently fall through to the fallback for both,
// which is exactly the opposite of what an operator setting a flag to
// `false` (or an empty string) intends. These two cases are the entire
// reason this module exists to be reviewed at all.

await test('a `false` override is honoured, not treated as absent (the `??` vs `||` trap)', () => {
  const partner = { flagOverrides: { newBoard: false } };
  // Fallback is `true` — if the implementation used `||`, `false || true`
  // would silently return `true`, hiding the operator's override.
  assert.strictEqual(resolveFlag('newBoard', partner, true), false);
});

await test("an empty-string override is honoured, not treated as absent (the `??` vs `||` trap)", () => {
  const partner = { flagOverrides: { greeting: '' } };
  // Fallback is a non-empty string — `||` would fall through to it.
  assert.strictEqual(resolveFlag('greeting', partner, 'default-greeting'), '');
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
