/**
 * Partner registry tests (M1c Task 2).
 *
 * Run: `npm run test:partner-registry`
 *
 * Hermetic: the registry takes an injected `findPartner` so these tests
 * never touch MongoDB and therefore count in the 181-script oracle.
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';

process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import { encryptSecret } from '@/lib/tutor/portal/secret-box';
import { getPartner, invalidatePartner, type RegistryDeps } from '@/lib/tutor/portal/registry';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

function doc(over: Record<string, unknown> = {}) {
  return {
    _id: 'crimsora',
    kind: 'partner' as const,
    status: 'active' as const,
    secrets: [{ ...encryptSecret('secret-one'), label: 'v1', createdAt: '2026-01-01' }],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
    ...over,
  };
}

function deps(over: Partial<RegistryDeps> = {}): RegistryDeps {
  return {
    findPartner: async () => doc(),
    now: () => 1_000_000,
    env: {} as NodeJS.ProcessEnv,
    ...over,
  };
}

(async () => {

await test('decrypts secrets on read', async () => {
  invalidatePartner('crimsora');
  const p = await getPartner('crimsora', deps());
  assert.deepStrictEqual(p!.secrets, ['secret-one']);
});

await test('returns every live secret so rotation has two valid at once', async () => {
  invalidatePartner('crimsora');
  const two = doc({ secrets: [
    { ...encryptSecret('old'), label: 'v1', createdAt: '2026-01-01' },
    { ...encryptSecret('new'), label: 'v2', createdAt: '2026-02-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => two }));
  assert.deepStrictEqual(p!.secrets, ['old', 'new']);
});

await test('a secret that fails to decrypt is dropped, not fatal', async () => {
  invalidatePartner('crimsora');
  const mixed = doc({ secrets: [
    { ciphertext: 'not-openable', keyVersion: 1, label: 'bad', createdAt: '2026-01-01' },
    { ...encryptSecret('good'), label: 'v2', createdAt: '2026-02-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => mixed }));
  assert.deepStrictEqual(p!.secrets, ['good'], 'one bad secret must not lock the partner out');
});

await test('caches within the TTL — a second read does not hit the store', async () => {
  invalidatePartner('crimsora');
  let calls = 0;
  const d = deps({ findPartner: async () => { calls++; return doc(); } });
  await getPartner('crimsora', d);
  await getPartner('crimsora', d);
  assert.strictEqual(calls, 1);
});

await test('re-reads after the TTL expires', async () => {
  invalidatePartner('crimsora');
  let calls = 0, t = 1_000_000;
  const d = deps({ findPartner: async () => { calls++; return doc(); }, now: () => t });
  await getPartner('crimsora', d);
  t += 61_000;
  await getPartner('crimsora', d);
  assert.strictEqual(calls, 2);
});

await test('invalidatePartner forces a re-read', async () => {
  invalidatePartner('crimsora');
  let calls = 0;
  const d = deps({ findPartner: async () => { calls++; return doc(); } });
  await getPartner('crimsora', d);
  invalidatePartner('crimsora');
  await getPartner('crimsora', d);
  assert.strictEqual(calls, 2);
});

await test('unknown partner resolves to null', async () => {
  invalidatePartner('nobody');
  const p = await getPartner('nobody', deps({ findPartner: async () => null }));
  assert.strictEqual(p, null);
});

await test('falls back to PORTAL_PARTNER_SECRETS when the row is absent', async () => {
  invalidatePartner('academy');
  const p = await getPartner('academy', deps({
    findPartner: async () => null,
    env: { PORTAL_PARTNER_SECRETS: JSON.stringify({ academy: 'env-secret' }) } as NodeJS.ProcessEnv,
  }));
  assert.deepStrictEqual(p!.secrets, ['env-secret']);
  assert.strictEqual(p!.kind, 'partner');
  assert.deepStrictEqual(p!.allowedEndpoints, ['/api/portal/v1/'], 'env fallback grants all portal routes');
});

await test('the registry row wins over the env fallback', async () => {
  invalidatePartner('crimsora');
  const p = await getPartner('crimsora', deps({
    env: { PORTAL_PARTNER_SECRETS: JSON.stringify({ crimsora: 'env-secret' }) } as NodeJS.ProcessEnv,
  }));
  assert.deepStrictEqual(p!.secrets, ['secret-one']);
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
