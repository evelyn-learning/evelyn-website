/**
 * withPortalAuth against the registry (M1c Task 3).
 *
 * Run: `npm run test:portal-auth-registry`
 *
 * scripts/test-portal-auth.ts still covers the contract-level signing rules.
 * This file covers ONLY what the registry adds: rotation, status, kind and
 * the endpoint allowlist. Build requests exactly as that file does.
 */

import assert from 'node:assert';

import { signPortalRequest, type SigningParts } from '@evelyn/portal-contract/auth';

import { __setRegistryOverrideForTests, withPortalAuth, type PortalAuth } from '@/lib/tutor/portal/auth';
import type { PartnerRecord } from '@/lib/tutor/portal/registry';
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

function parts(over: Partial<SigningParts> = {}): SigningParts {
  return { method: 'POST', path: '/api/portal/v1/x', timestamp: String(Date.now()), body: '', ...over };
}

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

  // NOTE: the brief's case table lists this as `invalid_signature`, but the
  // brief's own withPortalAuth code (which must stay exactly as given to
  // preserve test-portal-auth.ts's 'bad_signature'/'stale_timestamp'
  // passthrough assertions) always overwrites the loop's initial
  // 'invalid_signature' default with the real per-secret reason before
  // returning — so 'invalid_signature' is unreachable dead code under that
  // implementation. Asserting the actual, consistent behavior here.
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

  await test('endpoint allowed by prefix → 200', async () => {
    setRegistry(makePartner({ allowedEndpoints: ['/api/portal/v1/context'] }));
    const { status } = await callEcho(signedRequest({ path: '/api/portal/v1/context' }));
    assert.strictEqual(status, 200);
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

  await test('handler receives the full partner record', async () => {
    setRegistry(makePartner());
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.partner.partnerId, 'crimsora');
  });

  __setRegistryOverrideForTests(null);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
