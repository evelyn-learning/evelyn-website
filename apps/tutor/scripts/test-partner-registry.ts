/**
 * Partner registry tests (M1c Task 2, extended in the Task 3 review round).
 *
 * Run: `npm run test:partner-registry`
 *
 * Hermetic: most cases inject `findPartner` so they never touch MongoDB.
 * A few near the end deliberately call `getPartner(id)` with NO injected
 * deps, to exercise the real `defaultDeps.findPartner` — specifically its
 * `isDBConfigured()` guard — rather than a stand-in for it; those rely on
 * this whole process having no MONGODB_URI, same as
 * scripts/test-portal-auth.ts.
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

await test('falls back to PORTAL_PARTNER_ID + PORTAL_API_SECRET pair mode when the row is absent', async () => {
  invalidatePartner('legacyPair');
  const p = await getPartner('legacyPair', deps({
    findPartner: async () => null,
    env: { PORTAL_PARTNER_ID: 'legacyPair', PORTAL_API_SECRET: 'pair-secret' } as NodeJS.ProcessEnv,
  }));
  assert.deepStrictEqual(p!.secrets, ['pair-secret']);
  assert.strictEqual(p!.kind, 'partner');
});

await test('PORTAL_PARTNER_SECRETS map mode wins over pair mode when both are set (matches getPartnerSecret order)', async () => {
  invalidatePartner('bothModes');
  const p = await getPartner('bothModes', deps({
    findPartner: async () => null,
    env: {
      PORTAL_PARTNER_SECRETS: JSON.stringify({ bothModes: 'map-secret' }),
      PORTAL_PARTNER_ID: 'bothModes',
      PORTAL_API_SECRET: 'pair-secret',
    } as NodeJS.ProcessEnv,
  }));
  assert.deepStrictEqual(p!.secrets, ['map-secret']);
});

await test('an empty-string secret is dropped — it would authenticate anyone', async () => {
  invalidatePartner('crimsora');
  const blank = doc({ secrets: [
    { ...encryptSecret(''), label: 'blank', createdAt: '2026-01-01' },
    { ...encryptSecret('good'), label: 'v2', createdAt: '2026-02-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => blank }));
  assert.deepStrictEqual(p!.secrets, ['good'], 'the blank secret must never be returned as live');
});

await test('every secret unopenable leaves the partner with zero live secrets', async () => {
  invalidatePartner('crimsora');
  const allBad = doc({ secrets: [
    { ciphertext: 'not-openable-1', keyVersion: 1, label: 'bad1', createdAt: '2026-01-01' },
    { ciphertext: 'not-openable-2', keyVersion: 1, label: 'bad2', createdAt: '2026-01-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => allBad }));
  assert.deepStrictEqual(p!.secrets, []);
});

await test('expiresAt: past is dropped, future and unset stay live', async () => {
  invalidatePartner('crimsora');
  const mixed = doc({ secrets: [
    { ...encryptSecret('expired'), label: 'a', createdAt: '2026-01-01', expiresAt: '2026-02-01' },
    { ...encryptSecret('not-yet-expired'), label: 'b', createdAt: '2026-01-01', expiresAt: '2026-12-01' },
    { ...encryptSecret('no-expiry'), label: 'c', createdAt: '2026-01-01' },
  ] });
  const p = await getPartner('crimsora', deps({
    findPartner: async () => mixed,
    now: () => Date.parse('2026-03-01'),
  }));
  assert.deepStrictEqual(p!.secrets, ['not-yet-expired', 'no-expiry']);
});

await test('expiresAt: a malformed date fails CLOSED (dropped), not open ("never expires")', async () => {
  invalidatePartner('crimsora');
  const mixed = doc({ secrets: [
    { ...encryptSecret('typo-date'), label: 'a', createdAt: '2026-01-01', expiresAt: 'not-a-real-date' },
    { ...encryptSecret('fine'), label: 'b', createdAt: '2026-01-01' },
  ] });
  const p = await getPartner('crimsora', deps({ findPartner: async () => mixed }));
  assert.deepStrictEqual(
    p!.secrets,
    ['fine'],
    'Date.parse("not-a-real-date") is NaN and NaN <= anything is false — an unparseable expiresAt must not be treated as "not expired"',
  );
});

// --- IMPORTANT-4: exercise the REAL default findPartner (no injected deps),
// i.e. the isDBConfigured() guard itself, not a stub standing in for it.
// This whole suite runs with no MONGODB_URI (see the file header), so these
// two calls go through defaultDeps.findPartner exactly as production would
// during rollout step 1 / a DB-less environment.

await test('no DB + no env ⇒ null (fail-closed default, real defaultDeps)', async () => {
  assert.strictEqual(process.env.MONGODB_URI, undefined, 'this suite must run without a DB configured');
  invalidatePartner('noDbNoEnv');
  delete process.env.PORTAL_PARTNER_SECRETS;
  delete process.env.PORTAL_PARTNER_ID;
  delete process.env.PORTAL_API_SECRET;
  const p = await getPartner('noDbNoEnv');
  assert.strictEqual(p, null);
});

await test('no DB + env ⇒ record, via the real default findPartner (isDBConfigured guard)', async () => {
  invalidatePartner('noDbEnv');
  process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ noDbEnv: 'guard-secret' });
  try {
    const p = await getPartner('noDbEnv');
    assert.deepStrictEqual(p?.secrets, ['guard-secret']);
  } finally {
    delete process.env.PORTAL_PARTNER_SECRETS;
  }
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
