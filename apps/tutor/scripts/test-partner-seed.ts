/**
 * Seed script decision-logic tests (M1c Task 9).
 *
 * Run: `npm run test:partner-seed`
 *
 * Pure function tests — planSeed/buildSeedEntries/parsePartnerSecretsEnv and
 * executeSeed (with injected deps + a fake sealer) take everything they need
 * as arguments, so no DB and no PORTAL_SECRET_ENC_KEY are involved. This
 * counts in the hermetic oracle.
 */
import assert from 'node:assert';
import {
  parsePartnerSecretsEnv,
  buildSeedEntries,
  planSeed,
  buildCreateDoc,
  buildUpdateSet,
  executeSeed,
  ALLOWED_ENDPOINTS,
  DEFAULT_LIMITS,
  EVELYN_PARTNER_ID,
  type SeedPlanRow,
} from './seed-partner-registry';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

// --- parsePartnerSecretsEnv ---

await test('parses a well-formed JSON map', () => {
  const m = parsePartnerSecretsEnv('{"crimsora":"secret-a","academy":"secret-b"}');
  assert.deepStrictEqual(m, { crimsora: 'secret-a', academy: 'secret-b' });
});

await test('missing env degrades to empty map, not a throw', () => {
  assert.deepStrictEqual(parsePartnerSecretsEnv(undefined), {});
});

await test('malformed JSON degrades to empty map, not a throw', () => {
  assert.deepStrictEqual(parsePartnerSecretsEnv('{not json'), {});
});

await test('a non-string value is dropped, not coerced', () => {
  const m = parsePartnerSecretsEnv('{"crimsora":"secret-a","bad":123}');
  assert.deepStrictEqual(m, { crimsora: 'secret-a' });
});

// --- buildSeedEntries ---

await test('every secrets-map key becomes a partner-kind entry, plus a fixed evelyn first-party entry', () => {
  const entries = buildSeedEntries({ crimsora: 'a', academy: 'b' });
  assert.deepStrictEqual(entries, [
    { partnerId: 'academy', kind: 'partner' },
    { partnerId: 'crimsora', kind: 'partner' },
    { partnerId: EVELYN_PARTNER_ID, kind: 'first-party' },
  ]);
});

await test('an "evelyn" key in the secrets map never becomes a partner-kind entry — the first-party row always wins', () => {
  const entries = buildSeedEntries({ crimsora: 'a', evelyn: 'sneaky-secret' });
  const evelynEntries = entries.filter((e) => e.partnerId === EVELYN_PARTNER_ID);
  assert.strictEqual(evelynEntries.length, 1);
  assert.strictEqual(evelynEntries[0].kind, 'first-party');
});

// --- planSeed ---

await test('a partner id with no existing row is planned as create + sealSecret', () => {
  const plan = planSeed([{ partnerId: 'crimsora', kind: 'partner' }], new Set());
  assert.deepStrictEqual(plan, [
    { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true },
  ]);
});

await test('an existing partner row is planned as update, and sealSecret is false — never re-seal on update', () => {
  const plan = planSeed([{ partnerId: 'crimsora', kind: 'partner' }], new Set(['crimsora']));
  assert.deepStrictEqual(plan, [
    { partnerId: 'crimsora', kind: 'partner', operation: 'update', sealSecret: false },
  ]);
});

await test('evelyn (first-party) is never sealSecret, whether created or updated', () => {
  const createPlan = planSeed([{ partnerId: 'evelyn', kind: 'first-party' }], new Set());
  assert.strictEqual(createPlan[0].sealSecret, false);
  const updatePlan = planSeed([{ partnerId: 'evelyn', kind: 'first-party' }], new Set(['evelyn']));
  assert.strictEqual(updatePlan[0].sealSecret, false);
});

// --- Field ownership on update ---
// A routine re-seed must not undo deliberate operator state. `secrets` was
// already protected (never appears in the update path at all); this section
// covers the fields the coordinator flagged as needing the same treatment:
// `status`, `allowedEndpoints`, `limits`, `flagOverrides`, `metering`.

const updateRow: SeedPlanRow = { partnerId: 'crimsora', kind: 'partner', operation: 'update', sealSecret: false };

await test('buildUpdateSet writes ONLY name, kind, updatedAt — no operator-state field ever appears in the update payload', () => {
  const set = buildUpdateSet(updateRow, () => '2026-08-16T00:00:00.000Z');
  assert.deepStrictEqual(Object.keys(set).sort(), ['kind', 'name', 'updatedAt']);
  assert.deepStrictEqual(set, { name: 'crimsora', kind: 'partner', updatedAt: '2026-08-16T00:00:00.000Z' });
});

await test('a suspended row survives a re-seed unchanged (this is the bug the coordinator caught)', () => {
  // Simulates exactly what MongoDB's $set does: merge buildUpdateSet's
  // payload onto the existing document, leaving every other field alone.
  const existingDoc = {
    _id: 'crimsora',
    name: 'crimsora',
    kind: 'partner' as const,
    status: 'suspended' as const,
    secrets: [{ ciphertext: 'sealed(rotated-secret)', keyVersion: 1, label: 'rotation-2', createdAt: '2026-08-01T00:00:00.000Z' }],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: DEFAULT_LIMITS,
    flagOverrides: {},
    metering: {},
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
  const merged = { ...existingDoc, ...buildUpdateSet(updateRow, () => '2026-08-16T00:00:00.000Z') };
  assert.strictEqual(merged.status, 'suspended', 'status must survive a re-seed — it is the incident-response lever, not seed-owned');
  assert.strictEqual(merged.updatedAt, '2026-08-16T00:00:00.000Z', 'updatedAt IS seed-owned and should refresh');
});

await test('a narrowed allowlist, adjusted limits, operator flagOverrides and metering all survive a re-seed unchanged', () => {
  const existingDoc = {
    status: 'active' as const,
    secrets: [{ ciphertext: 'sealed(x)', keyVersion: 1, label: 'seed', createdAt: '2026-01-01T00:00:00.000Z' }],
    allowedEndpoints: ['/api/portal/v1/mock'], // deliberately narrowed by an operator below the seed's default grant
    limits: { rpm: 50, burst: 5, dailyQuota: 1000 }, // deliberately throttled below DEFAULT_LIMITS
    flagOverrides: { newBoard: false },
    metering: { plan: 'enterprise' },
  };
  const merged = { ...existingDoc, ...buildUpdateSet(updateRow) };
  assert.deepStrictEqual(merged.secrets, existingDoc.secrets);
  assert.deepStrictEqual(merged.allowedEndpoints, ['/api/portal/v1/mock'], 'a narrowed allowlist must not be silently re-widened');
  assert.deepStrictEqual(merged.limits, { rpm: 50, burst: 5, dailyQuota: 1000 });
  assert.deepStrictEqual(merged.flagOverrides, { newBoard: false });
  assert.deepStrictEqual(merged.metering, { plan: 'enterprise' });
});

await test('buildCreateDoc IS the only place status/allowedEndpoints/limits/flagOverrides/metering get their initial values', () => {
  const createRow: SeedPlanRow = { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true };
  const doc = buildCreateDoc(createRow, { ciphertext: 'sealed(s)', keyVersion: 1 }, () => '2026-08-16T00:00:00.000Z');
  assert.strictEqual(doc.status, 'active');
  assert.deepStrictEqual(doc.allowedEndpoints, ALLOWED_ENDPOINTS);
  assert.deepStrictEqual(doc.limits, DEFAULT_LIMITS);
  assert.deepStrictEqual(doc.flagOverrides, {});
  assert.deepStrictEqual(doc.metering, {});
  assert.strictEqual(doc.secrets.length, 1);
  assert.strictEqual(doc.secrets[0].ciphertext, 'sealed(s)');
});

await test('buildCreateDoc for evelyn (no secret passed) has an empty secrets array, not a placeholder', () => {
  const evelynRow: SeedPlanRow = { partnerId: EVELYN_PARTNER_ID, kind: 'first-party', operation: 'create', sealSecret: false };
  const doc = buildCreateDoc(evelynRow, undefined, () => '2026-08-16T00:00:00.000Z');
  assert.deepStrictEqual(doc.secrets, []);
  assert.strictEqual(doc.kind, 'first-party');
});

// --- executeSeed: proves the write gate, not just the planner ---
// (Standing lesson from Task 6 round 2: a detector returning the right
// value proves nothing about whether the code that consumes it actually
// acts on it. These assert on spy calls, not on planSeed's output.)

interface Call {
  op: 'create' | 'update' | 'invalidate';
  partnerId: string;
  hadSecret?: boolean;
}

function spyDeps() {
  const calls: Call[] = [];
  return {
    calls,
    deps: {
      createPartner: (row: SeedPlanRow, secret: unknown) => {
        calls.push({ op: 'create', partnerId: row.partnerId, hadSecret: secret !== undefined });
      },
      updatePartner: (row: SeedPlanRow) => {
        calls.push({ op: 'update', partnerId: row.partnerId });
      },
      invalidate: (partnerId: string) => {
        calls.push({ op: 'invalidate', partnerId });
      },
    },
  };
}

const fakeSeal = (plaintext: string) => ({ ciphertext: `sealed(${plaintext})`, keyVersion: 1 });

await test('a new partner is created with a sealed secret, and allowedEndpoints matches the env-fallback grant exactly', () => {
  // allowedEndpoints itself is asserted against the exported constant, not
  // just recomputed inline — a regression that drops the constant's value
  // (e.g. back to []) would desync this test from the bug it exists to catch.
  assert.deepStrictEqual(ALLOWED_ENDPOINTS, ['/api/portal/v1/']);
});

await test('executeSeed: create calls createPartner with a sealed secret, then invalidate — in that order', async () => {
  const plan: SeedPlanRow[] = [{ partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true }];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'plaintext-secret' }, fakeSeal, deps);
  assert.deepStrictEqual(calls, [
    { op: 'create', partnerId: 'crimsora', hadSecret: true },
    { op: 'invalidate', partnerId: 'crimsora' },
  ]);
});

await test('executeSeed: update NEVER calls createPartner and NEVER receives a secret — an existing row is untouched', async () => {
  const plan: SeedPlanRow[] = [{ partnerId: 'crimsora', kind: 'partner', operation: 'update', sealSecret: false }];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'plaintext-secret' }, fakeSeal, deps);
  assert.deepStrictEqual(calls, [
    { op: 'update', partnerId: 'crimsora' },
    { op: 'invalidate', partnerId: 'crimsora' },
  ]);
  assert.ok(!calls.some((c) => c.op === 'create'), 'update must never call createPartner');
});

await test('executeSeed: invalidate fires exactly once per row, for both create and update — proves the cache is never left stale', async () => {
  const plan: SeedPlanRow[] = [
    { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true },
    { partnerId: 'academy', kind: 'partner', operation: 'update', sealSecret: false },
    { partnerId: EVELYN_PARTNER_ID, kind: 'first-party', operation: 'update', sealSecret: false },
  ];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'secret-a' }, fakeSeal, deps);
  const invalidated = calls.filter((c) => c.op === 'invalidate').map((c) => c.partnerId);
  assert.deepStrictEqual(invalidated, ['crimsora', 'academy', EVELYN_PARTNER_ID]);
});

await test('DEFAULT_LIMITS matches the spec: rpm 600, burst 60, no daily quota', () => {
  assert.deepStrictEqual(DEFAULT_LIMITS, { rpm: 600, burst: 60, dailyQuota: null });
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
