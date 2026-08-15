/**
 * withPortalAuth against the registry (M1c Task 3).
 *
 * Run: `npm run test:portal-auth-registry`
 *
 * scripts/test-portal-auth.ts still covers the contract-level signing rules.
 * This file covers ONLY what the registry adds: rotation, status, kind, the
 * endpoint allowlist (including its ordering relative to signature
 * verification and its segment-boundary matching), and the two env
 * configuration modes reachable through the wrapper when no registry row
 * exists. Build requests exactly as that file does.
 *
 * MONGODB_URI must be unset for this whole process — several cases below
 * exercise the real (non-test-override) `getPartner` default path and rely
 * on its isDBConfigured() guard to fall through to the env fallback, the
 * same way scripts/test-portal-auth.ts does.
 */

import assert from 'node:assert';
import { randomBytes } from 'node:crypto';

process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import { signPortalRequest } from '@evelyn/portal-contract/auth';

import { __setRegistryOverrideForTests, withPortalAuth, type PortalAuth } from '@/lib/tutor/portal/auth';
import { getPartner, invalidatePartner, type PartnerRecord } from '@/lib/tutor/portal/registry';
import { encryptSecret } from '@/lib/tutor/portal/secret-box';
import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Harness (request construction mirrors scripts/test-portal-auth.ts verbatim)
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

const SECRET = 'secret-x';
const PARTNER = 'crimsora';

/** Build a real Request signed for the given (parts, secret). `deliverBody`
 *  lets a test deliver a DIFFERENT body than was signed (tamper). */
function signedRequest(opts: {
  method?: string;
  path?: string;
  bodyObj?: unknown;
  secret?: string;
  partnerId?: string;
  tsOffsetMs?: number;
  deliverBody?: string;
  omitHeaders?: boolean;
}): NextRequest {
  const method = opts.method ?? 'POST';
  const path = opts.path ?? '/api/portal/v1/x';
  const signedBody = opts.bodyObj === undefined ? '' : JSON.stringify(opts.bodyObj);
  const timestamp = String(Date.now() + (opts.tsOffsetMs ?? 0));
  const sig = signPortalRequest(opts.secret ?? SECRET, { method, path, timestamp, body: signedBody });
  const deliveredBody = opts.deliverBody ?? signedBody;
  const headers: Record<string, string> = {};
  if (!opts.omitHeaders) {
    headers['x-evelyn-partner'] = opts.partnerId ?? PARTNER;
    headers['x-evelyn-timestamp'] = timestamp;
    headers['x-evelyn-signature'] = sig;
  }
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && method !== 'HEAD' && deliveredBody) init.body = deliveredBody;
  return new Request(`https://engine.test${path}`, init) as unknown as NextRequest;
}

// A dummy authed handler that echoes the verified partner record + body.
const echoHandler = withPortalAuth(async (_req, auth: PortalAuth) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import('next/server')).NextResponse.json({
    ok: true,
    partnerId: auth.partnerId,
    partner: auth.partner,
    body: auth.body,
  }),
);

async function callEcho(req: NextRequest): Promise<{ status: number; json: any }> {
  const res = await echoHandler(req, undefined);
  return { status: res.status, json: await res.json() };
}

function makePartner(over: Partial<PartnerRecord> = {}): PartnerRecord {
  return {
    partnerId: PARTNER,
    kind: 'partner',
    status: 'active',
    secrets: [SECRET],
    allowedEndpoints: ['/api/portal/v1/'],
    limits: { rpm: 600, burst: 60, dailyQuota: null },
    flagOverrides: {},
    ...over,
  };
}

/** Point the auth wrapper at a fixture record for PARTNER only, hermetically
 *  (no Mongo). `null` simulates both "unknown partner" and "registry empty". */
function setRegistry(record: PartnerRecord | null): void {
  __setRegistryOverrideForTests(async (id) => (id === PARTNER ? record : null));
}

// ---------------------------------------------------------------------------
(async () => {
  assert.strictEqual(
    process.env.MONGODB_URI,
    undefined,
    'this suite must run with no DB configured — see the file header',
  );

  console.log('\nPortal auth — registry (M1c Task 3):\n');

  await test('rotation: old secret still verifies → 200', async () => {
    setRegistry(makePartner({ secrets: ['old-secret', 'new-secret'] }));
    const { status } = await callEcho(signedRequest({ secret: 'old-secret' }));
    assert.strictEqual(status, 200);
  });

  await test('rotation: new secret verifies → 200', async () => {
    setRegistry(makePartner({ secrets: ['old-secret', 'new-secret'] }));
    const { status } = await callEcho(signedRequest({ secret: 'new-secret' }));
    assert.strictEqual(status, 200);
  });

  // NOTE: an earlier case table listed this as `invalid_signature`, but
  // withPortalAuth's loop always overwrites its initial 'invalid_signature'
  // placeholder with the real per-secret reason once partner.secrets is
  // non-empty (guaranteed by the earlier length check) — so
  // 'invalid_signature' is unreachable dead code. Asserting the actual,
  // contract-vocabulary behavior here.
  await test('retired secret → 401 bad_signature', async () => {
    setRegistry(makePartner({ secrets: ['new-secret'] }));
    const { status, json } = await callEcho(signedRequest({ secret: 'old-secret' }));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'bad_signature');
  });

  await test('suspended partner → 403 partner_suspended', async () => {
    setRegistry(makePartner({ status: 'suspended' }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 403);
    assert.strictEqual(json.reason, 'partner_suspended');
  });

  await test("first-party kind cannot authenticate → 403 partner_cannot_authenticate", async () => {
    setRegistry(makePartner({ kind: 'first-party' }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 403);
    assert.strictEqual(json.reason, 'partner_cannot_authenticate');
  });

  await test("test kind cannot authenticate → 403 partner_cannot_authenticate", async () => {
    setRegistry(makePartner({ kind: 'test' }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 403);
    assert.strictEqual(json.reason, 'partner_cannot_authenticate');
  });

  await test('endpoint not allowed → 403 endpoint_not_allowed', async () => {
    setRegistry(makePartner({ allowedEndpoints: ['/api/portal/v1/context'] }));
    const { status, json } = await callEcho(signedRequest({ path: '/api/portal/v1/practice' }));
    assert.strictEqual(status, 403);
    assert.strictEqual(json.reason, 'endpoint_not_allowed');
  });

  await test('endpoint allowed by exact match → 200', async () => {
    setRegistry(makePartner({ allowedEndpoints: ['/api/portal/v1/context'] }));
    const { status } = await callEcho(signedRequest({ path: '/api/portal/v1/context' }));
    assert.strictEqual(status, 200);
  });

  // Regression: a plain `startsWith` allowlist check would let
  // '/api/portal/v1/context' also admit '/api/portal/v1/contextzzz' — a
  // different route that merely shares the string prefix.
  await test('endpoint allowlist requires a segment boundary, not just a shared prefix', async () => {
    setRegistry(makePartner({ allowedEndpoints: ['/api/portal/v1/context'] }));
    const { status, json } = await callEcho(signedRequest({ path: '/api/portal/v1/contextzzz' }));
    assert.strictEqual(status, 403);
    assert.strictEqual(json.reason, 'endpoint_not_allowed');
  });

  // Regression: the allowlist must be checked AFTER signature verification.
  // Checking it first let a caller with no valid secret at all send a
  // garbage signature against a disallowed endpoint and read the partner's
  // allowlist off the 403-vs-401 split, without ever authenticating.
  await test('garbage signature against a disallowed endpoint → 401 bad_signature, not endpoint_not_allowed', async () => {
    setRegistry(makePartner({ allowedEndpoints: ['/api/portal/v1/context'] }));
    const path = '/api/portal/v1/practice';
    const timestamp = String(Date.now());
    const req = new Request(`https://engine.test${path}`, {
      method: 'POST',
      headers: {
        'x-evelyn-partner': PARTNER,
        'x-evelyn-timestamp': timestamp,
        'x-evelyn-signature': 'deadbeef',
      },
    }) as unknown as NextRequest;
    const { status, json } = await callEcho(req);
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'bad_signature');
  });

  await test('unknown partner (registry returns null) → 401 unknown_partner', async () => {
    setRegistry(null);
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'unknown_partner');
  });

  await test('no openable secret (empty secrets array) → 401 unknown_partner', async () => {
    setRegistry(makePartner({ secrets: [] }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'unknown_partner');
  });

  await test('handler receives the full partner record (non-derivable field)', async () => {
    setRegistry(makePartner({ limits: { rpm: 42, burst: 7, dailyQuota: 100 } }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.partner.limits.rpm, 42, 'partnerId alone is derivable from the header; assert something only the record carries');
  });

  // --- Critical-1 regression: the PORTAL_PARTNER_ID + PORTAL_API_SECRET
  // pair mode (the *other* env shape the retired getPartnerSecret
  // supported) must still authenticate through the wrapper, not just when
  // called directly. Clears the override so this goes through the real
  // getPartner → registry fromEnv path.
  await test('env pair mode (PORTAL_PARTNER_ID + PORTAL_API_SECRET) authenticates through the wrapper', async () => {
    __setRegistryOverrideForTests(null);
    invalidatePartner('legacyPairPartner');
    process.env.PORTAL_PARTNER_ID = 'legacyPairPartner';
    process.env.PORTAL_API_SECRET = 'legacy-pair-secret';
    try {
      const { status, json } = await callEcho(
        signedRequest({ partnerId: 'legacyPairPartner', secret: 'legacy-pair-secret' }),
      );
      assert.strictEqual(status, 200);
      assert.strictEqual(json.partnerId, 'legacyPairPartner');
    } finally {
      delete process.env.PORTAL_PARTNER_ID;
      delete process.env.PORTAL_API_SECRET;
    }
  });

  // --- Critical-2 regression: a secret that decrypts to '' must never
  // authenticate. Routes the override through the REAL getPartner decrypt
  // path (not a hand-built PartnerRecord) so this actually exercises the
  // registry's filter, not just the wrapper's `secrets.length === 0` guard.
  await test('a secret that decrypts to the empty string never authenticates (real registry decrypt path)', async () => {
    invalidatePartner('emptysec');
    __setRegistryOverrideForTests(async (id) =>
      id === 'emptysec'
        ? getPartner('emptysec', {
            findPartner: async () => ({
              kind: 'partner',
              status: 'active',
              secrets: [{ ...encryptSecret(''), label: 'blank', createdAt: '2026-01-01' }],
              allowedEndpoints: ['/api/portal/v1/'],
            }),
            now: () => Date.now(),
            env: {} as NodeJS.ProcessEnv,
          })
        : null,
    );
    const { status, json } = await callEcho(signedRequest({ partnerId: 'emptysec', secret: '' }));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'unknown_partner');
  });

  __setRegistryOverrideForTests(null);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
