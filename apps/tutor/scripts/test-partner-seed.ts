/**
 * Seed script decision-logic tests (M1c Task 9).
 *
 * Run: `npm run test:partner-seed`
 *
 * Pure function tests — planSeed/buildSeedEntries/parsePartnerSecretsEnv/
 * checkSecretsEnv/checkSecretKeyEnv and executeSeed (with injected deps + a
 * fake sealer) take everything they need as arguments, so no DB is involved.
 * This counts in the hermetic oracle.
 *
 * The `main()` section at the bottom (M1c final review, A-C1 + reviewer B
 * finding 7) is the exception: it calls the script's REAL `main()` in-process
 * with `process.exit` and the console stubbed and no `MONGODB_URI`. It is
 * hermetic for the same reason — `connectDB()` throws "MONGODB_URI not
 * configured" synchronously with nothing configured, so `main()` either
 * aborts at one of its own gates first (which is the thing under test) or
 * dies at the connection attempt, and never reaches a database either way.
 * `checkSecretsEnv` being a well-tested pure function proved nothing about
 * whether `main()` acts on it; three mutations shipped green because of that.
 */
import assert from 'node:assert';
import { createHash, randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import {
  parsePartnerSecretsEnv,
  checkSecretsEnv,
  checkSecretKeyEnv,
  buildSeedEntries,
  planSeed,
  buildCreateDoc,
  buildUpdateSet,
  executeSeed,
  main as seedMain,
  ALLOWED_ENDPOINTS,
  DEFAULT_LIMITS,
  EVELYN_PARTNER_ID,
  type SeedPlanRow,
} from './seed-partner-registry';
import { opsMongooseConfigured } from './ops-mongoose';
import {
  ENV_FALLBACK_ALLOWED_ENDPOINTS,
  ENV_FALLBACK_LIMITS,
} from '@/lib/tutor/portal/registry';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

(async () => {

// --- parsePartnerSecretsEnv (permissive parse, used for the actual seed content) ---

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

// --- checkSecretsEnv: the operator-mistake gate (round-2 review, I1) ---
// parsePartnerSecretsEnv's silent degrade-to-{} above is right for
// registry.ts's hot auth path and wrong for this one-shot ops script — a
// forgotten or fat-fingered env must abort loudly, not print "create
// evelyn" / "Done." and exit 0 while the operator believes every partner
// was seeded.

await test('checkSecretsEnv: an unset env is rejected as "missing", not silently treated as "seed evelyn only"', () => {
  assert.deepStrictEqual(checkSecretsEnv(undefined), { ok: false, reason: 'missing' });
});

await test('checkSecretsEnv: unparseable JSON is rejected as "malformed"', () => {
  assert.deepStrictEqual(checkSecretsEnv('{not json'), { ok: false, reason: 'malformed' });
});

await test('checkSecretsEnv: a well-formed but non-object JSON value (an array) is rejected as "malformed"', () => {
  assert.deepStrictEqual(checkSecretsEnv('["crimsora"]'), { ok: false, reason: 'malformed' });
});

await test('checkSecretsEnv: a well-formed but EMPTY map is rejected as "empty" — this is the fat-finger case', () => {
  assert.deepStrictEqual(checkSecretsEnv('{}'), { ok: false, reason: 'empty' });
  // All values non-string: parses fine, nothing usable comes out of it.
  assert.deepStrictEqual(checkSecretsEnv('{"crimsora":123}'), { ok: false, reason: 'empty' });
});

await test('checkSecretsEnv: a map with at least one real secret passes', () => {
  assert.deepStrictEqual(checkSecretsEnv('{"crimsora":"secret-a"}'), { ok: true });
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
// A routine re-seed must not undo deliberate operator state, or reclassify
// a fixed-at-creation field. `secrets` was already protected (never appears
// in the update path at all); this section covers every field the
// coordinator flagged as needing the same treatment: `status`,
// `allowedEndpoints`, `limits`, `flagOverrides`, `metering`, and (round-2)
// `kind`.

const updateRow: SeedPlanRow = { partnerId: 'crimsora', kind: 'partner', operation: 'update', sealSecret: false };

await test('buildUpdateSet writes ONLY name and updatedAt — no operator-state or creation-only field ever appears in the update payload', () => {
  const set = buildUpdateSet(updateRow, () => '2026-08-16T00:00:00.000Z');
  assert.deepStrictEqual(Object.keys(set).sort(), ['name', 'updatedAt']);
  assert.deepStrictEqual(set, { name: 'crimsora', updatedAt: '2026-08-16T00:00:00.000Z' });
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

await test('round-2: a kind:"test" fixture row (e.g. portalA) survives a re-seed with kind:"partner" unchanged — a re-seed must never reclassify it', () => {
  // planSeed would compute kind:'partner' for this row purely because its id
  // showed up as a key in PORTAL_PARTNER_SECRETS (buildSeedEntries always
  // proposes 'partner' for a secrets-map key) — an operator mistake, or a
  // deliberate "give this fixture a real secret" attempt. Either way,
  // buildUpdateSet must not carry `kind` at all, so the existing 'test'
  // classification is untouched by the merge.
  const portalARow: SeedPlanRow = { partnerId: 'portalA', kind: 'partner', operation: 'update', sealSecret: false };
  const existingDoc = { kind: 'test' as const, status: 'active' as const };
  const merged = { ...existingDoc, ...buildUpdateSet(portalARow) };
  assert.strictEqual(merged.kind, 'test', 'kind must survive a re-seed — set only at creation, per Partner.ts');
});

await test('buildCreateDoc IS the only place status/allowedEndpoints/limits/flagOverrides/metering/kind get their initial values', () => {
  const createRow: SeedPlanRow = { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true };
  const doc = buildCreateDoc(createRow, { ciphertext: 'sealed(s)', keyVersion: 1 }, () => '2026-08-16T00:00:00.000Z');
  assert.strictEqual(doc.status, 'active');
  assert.strictEqual(doc.kind, 'partner');
  assert.deepStrictEqual(doc.allowedEndpoints, ALLOWED_ENDPOINTS);
  assert.deepStrictEqual(doc.limits, DEFAULT_LIMITS);
  assert.deepStrictEqual(doc.flagOverrides, {});
  assert.deepStrictEqual(doc.metering, {});
  assert.strictEqual(doc.secrets.length, 1);
  assert.strictEqual(doc.secrets[0].ciphertext, 'sealed(s)');
});

await test('buildCreateDoc copies allowedEndpoints/limits BY VALUE — mutating a created doc must not affect the shared module constants', () => {
  const createRow: SeedPlanRow = { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: false };
  const doc = buildCreateDoc(createRow, undefined);
  assert.notStrictEqual(doc.allowedEndpoints, ALLOWED_ENDPOINTS, 'must be a copy, not the shared reference');
  assert.notStrictEqual(doc.limits, DEFAULT_LIMITS, 'must be a copy, not the shared reference');
  doc.allowedEndpoints.push('/api/portal/v2/');
  assert.deepStrictEqual(ALLOWED_ENDPOINTS, ['/api/portal/v1/'], 'mutating one created doc must never leak into the shared constant');
});

await test('buildCreateDoc for evelyn (no secret passed) has an empty secrets array, not a placeholder', () => {
  const evelynRow: SeedPlanRow = { partnerId: EVELYN_PARTNER_ID, kind: 'first-party', operation: 'create', sealSecret: false };
  const doc = buildCreateDoc(evelynRow, undefined, () => '2026-08-16T00:00:00.000Z');
  assert.deepStrictEqual(doc.secrets, []);
  assert.strictEqual(doc.kind, 'first-party');
});

// --- I2: shared source of truth with registry.ts's env fallback ---
// Round-1 asserted the seed's constant against a literal, which is true by
// coincidence and gives no guard against drift. These assert the seed's
// exports ARE (reference-equal to) registry.ts's exported fallback grant —
// the same binding, not an independently maintained copy — so a future
// change to one is structurally impossible to leave the other stale.

await test('ALLOWED_ENDPOINTS is registry.ts\'s ENV_FALLBACK_ALLOWED_ENDPOINTS itself, not a coincidentally-equal copy', () => {
  assert.strictEqual(ALLOWED_ENDPOINTS, ENV_FALLBACK_ALLOWED_ENDPOINTS);
});

await test('DEFAULT_LIMITS is registry.ts\'s ENV_FALLBACK_LIMITS itself, not a coincidentally-equal copy', () => {
  assert.strictEqual(DEFAULT_LIMITS, ENV_FALLBACK_LIMITS);
});

await test('DEFAULT_LIMITS matches the spec: rpm 600, burst 60, no daily quota', () => {
  assert.deepStrictEqual(DEFAULT_LIMITS, { rpm: 600, burst: 60, dailyQuota: null });
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

await test('executeSeed: write=false (the DEFAULT) performs ZERO writes, even with creates and updates staged — this is what makes dry-run safe', async () => {
  const plan: SeedPlanRow[] = [
    { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true },
    { partnerId: 'academy', kind: 'partner', operation: 'update', sealSecret: false },
  ];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'secret-a' }, fakeSeal, false, deps);
  assert.deepStrictEqual(calls, [], 'dry run (write=false) must call none of createPartner/updatePartner/invalidate');
});

await test('executeSeed: create calls createPartner with a sealed secret, then invalidate — in that order (write=true)', async () => {
  const plan: SeedPlanRow[] = [{ partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true }];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'plaintext-secret' }, fakeSeal, true, deps);
  assert.deepStrictEqual(calls, [
    { op: 'create', partnerId: 'crimsora', hadSecret: true },
    { op: 'invalidate', partnerId: 'crimsora' },
  ]);
});

await test('executeSeed: update NEVER calls createPartner and NEVER receives a secret — an existing row is untouched (write=true)', async () => {
  const plan: SeedPlanRow[] = [{ partnerId: 'crimsora', kind: 'partner', operation: 'update', sealSecret: false }];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'plaintext-secret' }, fakeSeal, true, deps);
  assert.deepStrictEqual(calls, [
    { op: 'update', partnerId: 'crimsora' },
    { op: 'invalidate', partnerId: 'crimsora' },
  ]);
  assert.ok(!calls.some((c) => c.op === 'create'), 'update must never call createPartner');
});

await test('executeSeed: invalidate fires exactly once per row, for both create and update — proves the cache is never left stale (write=true)', async () => {
  const plan: SeedPlanRow[] = [
    { partnerId: 'crimsora', kind: 'partner', operation: 'create', sealSecret: true },
    { partnerId: 'academy', kind: 'partner', operation: 'update', sealSecret: false },
    { partnerId: EVELYN_PARTNER_ID, kind: 'first-party', operation: 'update', sealSecret: false },
  ];
  const { calls, deps } = spyDeps();
  await executeSeed(plan, { crimsora: 'secret-a' }, fakeSeal, true, deps);
  const invalidated = calls.filter((c) => c.op === 'invalidate').map((c) => c.partnerId);
  assert.deepStrictEqual(invalidated, ['crimsora', 'academy', EVELYN_PARTNER_ID]);
});

// --- checkSecretKeyEnv: the A-C1 gate ------------------------------------
// A MISSING PORTAL_SECRET_ENC_KEY already failed safely by accident (the
// seal throws before the first write). A WRONG-BUT-VALID 32-byte key did
// not: it seals cleanly, writes the rows, exits 0 — and the server, holding
// a different key, then resolves every partner with secrets:[] and 401s all
// of them within one 60s cache TTL. Nothing in the code or the runbook
// caught that before traffic did.

const VALID_KEY = randomBytes(32).toString('base64');

await test('checkSecretKeyEnv: an unset key is rejected as "missing"', () => {
  assert.deepStrictEqual(checkSecretKeyEnv(undefined), { ok: false, reason: 'missing' });
});

await test('checkSecretKeyEnv: a usable key returns a fingerprint = sha256(env value).slice(0,8), and never the key itself', () => {
  const status = checkSecretKeyEnv(VALID_KEY);
  assert.strictEqual(status.ok, true);
  if (!status.ok) return;
  assert.strictEqual(status.fingerprint, createHash('sha256').update(VALID_KEY).digest('hex').slice(0, 8));
  assert.strictEqual(status.fingerprint.length, 8);
  assert.ok(!VALID_KEY.includes(status.fingerprint), 'the fingerprint must not be a substring of the key');
});

await test('checkSecretKeyEnv: two different keys have different fingerprints — this is the whole point of printing it', () => {
  const a = checkSecretKeyEnv(VALID_KEY);
  const b = checkSecretKeyEnv(randomBytes(32).toString('base64'));
  assert.strictEqual(a.ok && b.ok, true);
  if (a.ok && b.ok) assert.notStrictEqual(a.fingerprint, b.fingerprint);
});

await test('checkSecretKeyEnv: a key whose seal/open round-trip THROWS is rejected as "unusable" (a wrong-length key)', () => {
  const status = checkSecretKeyEnv(randomBytes(16).toString('base64'), () => {
    throw new Error('PORTAL_SECRET_ENC_KEY must decode to 32 bytes, got 16');
  });
  assert.strictEqual(status.ok, false);
  if (status.ok) return;
  assert.strictEqual(status.reason, 'unusable');
  assert.match(status.detail ?? '', /32 bytes/);
});

await test('checkSecretKeyEnv: a key whose round-trip returns a DIFFERENT value is rejected as "unusable"', () => {
  const status = checkSecretKeyEnv(VALID_KEY, () => 'something-else');
  assert.strictEqual(status.ok, false);
  if (status.ok) return;
  assert.strictEqual(status.reason, 'unusable');
});

await test('checkSecretKeyEnv: the real (uninjected) round-trip validates the ARGUMENT, not process.env — 32 bytes passes, 16 fails', () => {
  // Deliberately run with PORTAL_SECRET_ENC_KEY absent from the environment:
  // the key being checked is the one passed in, so main() can never
  // fingerprint one value while validating another.
  const saved = process.env.PORTAL_SECRET_ENC_KEY;
  delete process.env.PORTAL_SECRET_ENC_KEY;
  try {
    assert.strictEqual(checkSecretKeyEnv(VALID_KEY).ok, true);
    const status = checkSecretKeyEnv(randomBytes(16).toString('base64'));
    assert.strictEqual(status.ok, false, 'a 16-byte key must not pass the real seal/open round-trip');
    if (!status.ok) assert.match(status.detail ?? '', /32 bytes/);
  } finally {
    if (saved !== undefined) process.env.PORTAL_SECRET_ENC_KEY = saved;
  }
});

// --- main(): does it ACT on the gates? -----------------------------------
// Reviewer B finding 7 / mutations M33 + M34: deleting the checkSecretsEnv
// abort, or the autoIndex/autoCreate guards, from main() left every suite
// green. A detector returning the right value proves nothing about whether
// the code that consumes it acts on it — the standing lesson of this
// milestone, applied to the one function that had escaped it.

class ExitCalled extends Error {
  constructor(public readonly code: number) {
    super(`process.exit(${code})`);
  }
}

interface MainRun {
  /** The code main() passed to process.exit, or null if it never exited. */
  exitCode: number | null;
  stdout: string;
  stderr: string;
  /** The error main() threw instead of exiting (in this env, connectDB's). */
  error?: Error;
}

/** Run the REAL main() with a controlled env, process.exit and console. */
async function runSeedMain(env: Record<string, string | undefined>): Promise<MainRun> {
  const savedEnv: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(env)) {
    savedEnv[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const realExit = process.exit;
  const realLog = console.log;
  const realError = console.error;
  let stdout = '';
  let stderr = '';
  console.log = (...a: unknown[]) => { stdout += `${a.map(String).join(' ')}\n`; };
  console.error = (...a: unknown[]) => { stderr += `${a.map(String).join(' ')}\n`; };
  process.exit = ((code?: number) => { throw new ExitCalled(code ?? 0); }) as unknown as typeof process.exit;

  let exitCode: number | null = null;
  let error: Error | undefined;
  try {
    await seedMain();
  } catch (e) {
    if (e instanceof ExitCalled) exitCode = e.code;
    else error = e as Error;
  } finally {
    process.exit = realExit;
    console.log = realLog;
    console.error = realError;
    for (const [k, v] of Object.entries(savedEnv)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
  return { exitCode, stdout, stderr, error };
}

const GOOD_SECRETS = JSON.stringify({ crimsora: 'plaintext-crimsora-secret' });

await test('main(): sanity — with both envs good, main() gets past every gate and dies at connectDB (no MONGODB_URI here)', async () => {
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: GOOD_SECRETS, PORTAL_SECRET_ENC_KEY: VALID_KEY });
  assert.strictEqual(run.exitCode, null, `main() must not abort on a good env; stderr was: ${run.stderr}`);
  assert.match(
    run.error?.message ?? '', /MONGODB_URI not configured/,
    'reaching connectDB is the proof that both gates PASSED rather than being skipped',
  );
});

await test('main(): M33 — a missing PORTAL_PARTNER_SECRETS aborts with exit 1, before any DB connection', async () => {
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: undefined, PORTAL_SECRET_ENC_KEY: VALID_KEY });
  assert.strictEqual(run.exitCode, 1, 'main() must exit non-zero, not seed only evelyn and exit 0');
  assert.strictEqual(run.error, undefined, 'it must abort BEFORE connectDB — reaching it would throw MONGODB_URI instead');
  assert.match(run.stderr, /PORTAL_PARTNER_SECRETS is not set/);
});

await test('main(): a malformed PORTAL_PARTNER_SECRETS aborts with exit 1 and its OWN message', async () => {
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: '{not json', PORTAL_SECRET_ENC_KEY: VALID_KEY });
  assert.strictEqual(run.exitCode, 1);
  assert.match(run.stderr, /not a valid JSON object/);
});

await test('main(): A-C1 — a missing PORTAL_SECRET_ENC_KEY aborts with exit 1, before any DB connection', async () => {
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: GOOD_SECRETS, PORTAL_SECRET_ENC_KEY: undefined });
  assert.strictEqual(run.exitCode, 1);
  assert.strictEqual(run.error, undefined, 'the key gate must precede connectDB, exactly like the secrets gate');
  assert.match(run.stderr, /PORTAL_SECRET_ENC_KEY is not set/);
  assert.ok(!/fingerprint/i.test(run.stdout), 'no fingerprint can be printed for a key that does not exist');
});

await test('main(): A-C1 — a present but UNUSABLE key (16 bytes) aborts with exit 1 before any DB connection', async () => {
  const run = await runSeedMain({
    PORTAL_PARTNER_SECRETS: GOOD_SECRETS,
    PORTAL_SECRET_ENC_KEY: randomBytes(16).toString('base64'),
  });
  assert.strictEqual(run.exitCode, 1);
  assert.strictEqual(run.error, undefined);
  assert.match(run.stderr, /PORTAL_SECRET_ENC_KEY is set but unusable/);
});

await test('main(): A-C1 — the key FINGERPRINT is printed in DRY RUN (this is what makes a dry run useful for C1)', async () => {
  // No --write in this process's argv, so WRITE is false: this IS the dry
  // run. A wrong-but-valid key is invisible to every other check in the
  // script, so the dry run's only possible defence is showing the operator
  // a fingerprint to compare against the deployed server's — before any row
  // exists to be unopenable.
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: GOOD_SECRETS, PORTAL_SECRET_ENC_KEY: VALID_KEY });
  const expected = createHash('sha256').update(VALID_KEY).digest('hex').slice(0, 8);
  assert.ok(
    run.stdout.includes(`PORTAL_SECRET_ENC_KEY fingerprint: ${expected}`),
    `dry-run stdout must carry the key fingerprint; got:\n${run.stdout}`,
  );
});

await test('main(): no path prints the key or a plaintext secret — only the fingerprint', async () => {
  for (const env of [
    { PORTAL_PARTNER_SECRETS: GOOD_SECRETS, PORTAL_SECRET_ENC_KEY: VALID_KEY },
    { PORTAL_PARTNER_SECRETS: GOOD_SECRETS, PORTAL_SECRET_ENC_KEY: undefined },
    { PORTAL_PARTNER_SECRETS: undefined, PORTAL_SECRET_ENC_KEY: VALID_KEY },
  ]) {
    const run = await runSeedMain(env);
    const all = run.stdout + run.stderr + (run.error?.message ?? '');
    assert.ok(!all.includes('plaintext-crimsora-secret'), `a plaintext secret reached the console: ${all}`);
    assert.ok(!all.includes(VALID_KEY), `the encryption key reached the console: ${all}`);
  }
});

await test('main(): M34 — autoIndex and autoCreate are BOTH off before connectDB is attempted', async () => {
  // The guard that stops even a dry run from building TutorSession's TTL
  // index, which DELETES rows. Deleting the two mongoose.set lines left
  // every suite green. Re-armed here, then asserted on the observable
  // global Mongoose state main() left behind.
  mongoose.set('autoIndex', true);
  mongoose.set('autoCreate', true);
  assert.strictEqual(opsMongooseConfigured(), false, 'sanity: the guard is genuinely re-armed before the run');
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: GOOD_SECRETS, PORTAL_SECRET_ENC_KEY: VALID_KEY });
  assert.match(run.error?.message ?? '', /MONGODB_URI not configured/, 'sanity: main() did reach the connection attempt');
  assert.strictEqual(
    opsMongooseConfigured(), true,
    'main() must disable autoIndex AND autoCreate before connecting — a dry run must never build an index or create a collection',
  );
});

await test('main(): M34 — the guard runs even on the abort paths, which also open no connection', async () => {
  mongoose.set('autoIndex', true);
  mongoose.set('autoCreate', true);
  const run = await runSeedMain({ PORTAL_PARTNER_SECRETS: undefined, PORTAL_SECRET_ENC_KEY: VALID_KEY });
  assert.strictEqual(run.exitCode, 1);
  assert.strictEqual(opsMongooseConfigured(), true);
});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
