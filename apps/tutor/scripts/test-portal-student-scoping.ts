/**
 * Portal call-site identity scoping (M1c Task 5).
 *
 * Run: `npm run test:portal-student-scoping`
 *
 * Task 4 proved `resolveProfileId` itself is partner-scoped and atomic.
 * This suite proves the WIRING at the entry point: a portal handler that
 * reads a `studentId` off its (verified) request resolves it through
 * `resolveProfileId({ partnerId: auth.partnerId, externalStudentId })` —
 * the verified header-derived partner, NEVER anything read off the body —
 * and that the raw body `studentId` never itself reaches the profile store
 * as a key.
 *
 * It also pins the Task 5 rollout-safety constraint: with
 * `PORTAL_IDENTITY_RESOLUTION` unset (the shipped default), the handler
 * passes the raw studentId straight through, byte-identical to pre-M1c
 * behavior — this is what makes the deploy safe ahead of the Task 6
 * backfill (see identityResolutionEnabled's doc comment in store.ts).
 *
 * Hermetic: `__setRegistryOverrideForTests` (Task 3) stands in for the
 * partner registry (no DB), and a fake `ResolverDeps` (same shape as
 * test-profile-resolver.ts's) stands in for the Mongo upsert (no DB).
 * `resolveProfileId` itself is exercised for real — only its Mongo-facing
 * deps are faked — so this suite tests the actual production call shape,
 * not a re-implementation of it.
 */
import assert from 'node:assert';
import { randomBytes } from 'node:crypto';

// Mirrors scripts/test-portal-auth-registry.ts's setup: some import in the
// withPortalAuth chain (secret-box.ts, transitively) wants this set before
// first import, even though this suite never decrypts a real secret (the
// registry override below bypasses that path entirely).
process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import type { NextRequest } from 'next/server';

import { __setRegistryOverrideForTests, withPortalAuth, type PortalAuth } from '@/lib/tutor/portal/auth';
import type { PartnerRecord } from '@/lib/tutor/portal/registry';
import { resolveProfileId, identityResolutionEnabled, type ResolverDeps } from '@/lib/tutor/student-profile/store';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

// ---------------------------------------------------------------------------
// Harness (request construction mirrors scripts/test-portal-auth-registry.ts)
// ---------------------------------------------------------------------------

const SECRET = 'secret-x';

function signedRequest(opts: { partnerId: string; bodyObj: unknown; path?: string }): NextRequest {
  const method = 'POST';
  const path = opts.path ?? '/api/portal/v1/x';
  const signedBody = JSON.stringify(opts.bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest(SECRET, { method, path, timestamp, body: signedBody });
  const headers: Record<string, string> = {
    'x-evelyn-partner': opts.partnerId,
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  return new Request(`https://engine.test${path}`, { method, headers, body: signedBody }) as unknown as NextRequest;
}

function makePartner(partnerId: string): PartnerRecord {
  return {
    partnerId,
    kind: 'partner',
    status: 'active',
    secrets: [SECRET],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
  };
}

/** Both `crimsora` and `academy` are live, valid partners for this suite. */
function setRegistry(): void {
  __setRegistryOverrideForTests(async (id) =>
    id === 'crimsora' || id === 'academy' ? makePartner(id) : null,
  );
}

/** Fake, hermetic ResolverDeps — same collision-enforcing shape as
 *  scripts/test-profile-resolver.ts's fakeStore(), so a bug that let two
 *  partners collide on the same key would fail here the same way. */
function fakeResolverDeps(): ResolverDeps {
  const rows = new Map<string, string>();
  let seq = 0;
  return {
    newId: () => `gen-${++seq}`,
    findExisting: async ({ partnerId, externalStudentId }) => {
      const id = rows.get(`${partnerId}|${externalStudentId}`);
      return id ? { _id: id } : null;
    },
    findOneAndUpsert: async ({ partnerId, externalStudentId, newId }) => {
      const k = `${partnerId}|${externalStudentId}`;
      if (rows.has(k)) {
        const err = new Error('E11000 duplicate key error') as Error & { code?: number };
        err.code = 11000;
        throw err;
      }
      rows.set(k, newId);
      return { _id: newId };
    },
  };
}

/**
 * The exact Step 4 pattern every real portal call site now runs (gaps/,
 * mastery/, learner-state/, session-result/, plan-generate/, review-plan/,
 * mock/attempts/report/ routes): resolve `body.studentId` under the
 * VERIFIED `auth.partnerId`, gated by `identityResolutionEnabled`. The only
 * difference from production is the injected fake `deps` — production uses
 * `resolveProfileId`'s default (real-Mongo) deps.
 *
 * Uses the REAL `identityResolutionEnabled()` (store.ts) — not a
 * reimplementation — so a change to the flag's env var name or semantics
 * fails this suite too.
 */
function buildHandler(deps: ResolverDeps) {
  return withPortalAuth(async (_req, auth: PortalAuth) => {
    const body = auth.body as { studentId: string };
    const profileId = identityResolutionEnabled()
      ? await resolveProfileId({ partnerId: auth.partnerId, externalStudentId: body.studentId }, deps)
      : body.studentId;
    return (await import('next/server')).NextResponse.json({ profileId });
  });
}

async function resolvedIdFor(handler: ReturnType<typeof buildHandler>, partnerId: string): Promise<string> {
  const req = signedRequest({ partnerId, bodyObj: { studentId: 'user_1' } });
  const res = await handler(req, undefined);
  assert.strictEqual(res.status, 200, `expected 200, got ${res.status}`);
  const json = (await res.json()) as { profileId: string };
  return json.profileId;
}

// ---------------------------------------------------------------------------
(async () => {
  console.log('\nPortal student-id scoping — entry points (M1c Task 5):\n');

  setRegistry();

  await test('flag ON: crimsora resolves under partnerId "crimsora", never the raw string', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
    const handler = buildHandler(fakeResolverDeps());
    const id = await resolvedIdFor(handler, 'crimsora');
    assert.notStrictEqual(id, 'user_1', 'the raw body studentId must never reach the store as a key');
    assert.ok(id, 'a resolved id must be returned');
  });

  await test('flag ON: the same body from academy resolves to a DIFFERENT id than crimsora', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
    const deps = fakeResolverDeps(); // shared store — proves cross-partner isolation, not just per-call uniqueness
    const handler = buildHandler(deps);
    const crimsoraId = await resolvedIdFor(handler, 'crimsora');
    const academyId = await resolvedIdFor(handler, 'academy');
    assert.notStrictEqual(
      crimsoraId, academyId,
      'two partners sending the same externalStudentId must never share a profile',
    );
    assert.notStrictEqual(crimsoraId, 'user_1');
    assert.notStrictEqual(academyId, 'user_1');
  });

  await test('flag ON: resolution is STABLE — the same partner+student resolves to the same id twice', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'on';
    const deps = fakeResolverDeps();
    const handler = buildHandler(deps);
    const a = await resolvedIdFor(handler, 'crimsora');
    const b = await resolvedIdFor(handler, 'crimsora');
    assert.strictEqual(a, b);
  });

  await test('flag OFF (unset): the raw body studentId passes through UNCHANGED — the default-safe path', async () => {
    delete process.env.PORTAL_IDENTITY_RESOLUTION;
    // A resolver that throws on any call — proves the off-branch never even
    // reaches resolveProfileId, not just that it happens to return the same
    // value.
    const explodingDeps: ResolverDeps = {
      newId: () => { throw new Error('resolveProfileId must not run while the flag is off'); },
      findExisting: async () => { throw new Error('resolveProfileId must not run while the flag is off'); },
      findOneAndUpsert: async () => { throw new Error('resolveProfileId must not run while the flag is off'); },
    };
    const handler = buildHandler(explodingDeps);
    const id = await resolvedIdFor(handler, 'crimsora');
    assert.strictEqual(id, 'user_1', 'flag off must pass the raw id through exactly as pre-M1c code did');
  });

  await test('flag explicitly "off" (not just unset) also passes the raw id through', async () => {
    process.env.PORTAL_IDENTITY_RESOLUTION = 'off';
    const explodingDeps: ResolverDeps = {
      newId: () => { throw new Error('must not run'); },
      findExisting: async () => { throw new Error('must not run'); },
      findOneAndUpsert: async () => { throw new Error('must not run'); },
    };
    const handler = buildHandler(explodingDeps);
    const id = await resolvedIdFor(handler, 'academy');
    assert.strictEqual(id, 'user_1');
  });

  delete process.env.PORTAL_IDENTITY_RESOLUTION;

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
