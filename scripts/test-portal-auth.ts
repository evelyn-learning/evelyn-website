/**
 * Portal API auth & isolation tests (Phase 2).
 *
 * Run: `npm run test:portal-auth`
 *
 * Covers the portable signer/verifier (`@/lib/portal-contract/auth`) and the
 * engine route wrapper (`@/lib/tutor/portal/auth`): header presence, unknown
 * partner, timestamp replay window, body-bound signature, tamper detection
 * (incl. studentId tamper), and invalid-JSON handling.
 *
 * Style mirrors scripts/test-cross-session-promotion.ts.
 */

import assert from 'node:assert';

import {
  signPortalRequest,
  verifyPortalSignature,
  PORTAL_SIGNATURE_WINDOW_MS,
  type SigningParts,
} from '@/lib/portal-contract/auth';

// Configure partner secrets BEFORE the engine module reads them (it reads
// process.env lazily per-call, so setting here is sufficient).
process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'super-secret-a' });
process.env.PORTAL_PARTNER_ID = 'legacyPartner';
process.env.PORTAL_API_SECRET = 'legacy-secret';

import { getPartnerSecret, withPortalAuth, type PortalAuth } from '@/lib/tutor/portal/auth';
import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Harness
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

const SECRET = 'super-secret-a';
const PARTNER = 'portalA';

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

// A dummy authed handler that echoes the verified partner + body.
const echoHandler = withPortalAuth(async (_req, auth: PortalAuth) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import('next/server')).NextResponse.json({ ok: true, partnerId: auth.partnerId, body: auth.body }),
);

async function callEcho(req: NextRequest): Promise<{ status: number; json: any }> {
  const res = await echoHandler(req, undefined);
  return { status: res.status, json: await res.json() };
}

// ---------------------------------------------------------------------------
(async () => {
  console.log('\nPortal auth — portable signer/verifier:\n');

  await test('sign → verify round-trip ok', () => {
    const p = parts({ body: '{"a":1}' });
    const sig = signPortalRequest(SECRET, p);
    assert.deepStrictEqual(verifyPortalSignature(SECRET, p, sig), { ok: true });
  });
  await test('wrong secret → bad_signature', () => {
    const p = parts({ body: '{"a":1}' });
    const sig = signPortalRequest('other-secret', p);
    assert.strictEqual(verifyPortalSignature(SECRET, p, sig).ok, false);
  });
  await test('tampered body → bad_signature', () => {
    const p = parts({ body: '{"a":1}' });
    const sig = signPortalRequest(SECRET, p);
    const r = verifyPortalSignature(SECRET, { ...p, body: '{"a":2}' }, sig);
    assert.deepStrictEqual(r, { ok: false, reason: 'bad_signature' });
  });
  await test('tampered path → bad_signature (sig bound to endpoint)', () => {
    const p = parts({ path: '/api/portal/v1/reads/gaps' });
    const sig = signPortalRequest(SECRET, p);
    const r = verifyPortalSignature(SECRET, { ...p, path: '/api/portal/v1/reads/mastery' }, sig);
    assert.strictEqual(r.ok, false);
  });
  await test('stale timestamp → stale_timestamp', () => {
    const p = parts({ timestamp: String(Date.now() - (PORTAL_SIGNATURE_WINDOW_MS + 10_000)) });
    const sig = signPortalRequest(SECRET, p);
    assert.deepStrictEqual(verifyPortalSignature(SECRET, p, sig), { ok: false, reason: 'stale_timestamp' });
  });
  await test('non-numeric timestamp → bad_timestamp', () => {
    const p = parts({ timestamp: 'not-a-number' });
    const sig = signPortalRequest(SECRET, p);
    assert.deepStrictEqual(verifyPortalSignature(SECRET, p, sig), { ok: false, reason: 'bad_timestamp' });
  });
  await test('malformed/odd-length signature → bad_signature (no throw)', () => {
    const p = parts();
    assert.deepStrictEqual(verifyPortalSignature(SECRET, p, 'zzz'), { ok: false, reason: 'bad_signature' });
  });
  await test('empty signature → bad_signature', () => {
    const p = parts();
    assert.strictEqual(verifyPortalSignature(SECRET, p, '').ok, false);
  });

  console.log('\nPartner secret resolver:\n');
  await test('JSON-map mode resolves known partner', () =>
    assert.strictEqual(getPartnerSecret('portalA'), 'super-secret-a'));
  await test('single-default mode resolves PORTAL_PARTNER_ID', () =>
    assert.strictEqual(getPartnerSecret('legacyPartner'), 'legacy-secret'));
  await test('unknown partner → null', () => assert.strictEqual(getPartnerSecret('nope'), null));
  await test('empty partner id → null', () => assert.strictEqual(getPartnerSecret(''), null));

  console.log('\nRoute wrapper (withPortalAuth):\n');
  await test('missing auth headers → 401 missing_auth_headers', async () => {
    const { status, json } = await callEcho(signedRequest({ omitHeaders: true, bodyObj: { studentId: 'A' } }));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'missing_auth_headers');
  });
  await test('unknown partner → 401 unknown_partner', async () => {
    const { status, json } = await callEcho(signedRequest({ partnerId: 'ghost', bodyObj: { studentId: 'A' } }));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'unknown_partner');
  });
  await test('valid signed POST → 200, partner + body surfaced', async () => {
    const { status, json } = await callEcho(signedRequest({ bodyObj: { studentId: 'A', q: 1 } }));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.partnerId, 'portalA');
    assert.deepStrictEqual(json.body, { studentId: 'A', q: 1 });
  });
  await test('valid signed GET (empty body) → 200', async () => {
    const { status, json } = await callEcho(signedRequest({ method: 'GET' }));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.partnerId, 'portalA');
  });
  await test('tampered body after signing → 401 bad_signature', async () => {
    // Signed for studentId A, but a different body is actually delivered.
    const req = signedRequest({ bodyObj: { studentId: 'A' }, deliverBody: JSON.stringify({ studentId: 'B' }) });
    const { status, json } = await callEcho(req);
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'bad_signature');
  });
  await test('studentId cannot be swapped without breaking the signature (isolation/integrity)', async () => {
    // A verified partner holding a signature for student A cannot reuse it to
    // read student B — the recomputed signature over the new body won't match.
    const req = signedRequest({
      path: '/api/portal/v1/reads/gaps',
      bodyObj: { studentId: 'partnerA:alice' },
      deliverBody: JSON.stringify({ studentId: 'partnerA:bob' }),
    });
    const { status } = await callEcho(req);
    assert.strictEqual(status, 401);
  });
  await test('stale request → 401 stale_timestamp', async () => {
    const req = signedRequest({ bodyObj: { studentId: 'A' }, tsOffsetMs: -(PORTAL_SIGNATURE_WINDOW_MS + 10_000) });
    const { status, json } = await callEcho(req);
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'stale_timestamp');
  });
  await test('valid signature but invalid JSON body → 400 invalid_json', async () => {
    // Sign the exact (malformed) raw body so the signature passes; JSON.parse fails.
    const timestamp = String(Date.now());
    const path = '/api/portal/v1/x';
    const rawBody = '{not json';
    const sig = signPortalRequest(SECRET, { method: 'POST', path, timestamp, body: rawBody });
    const req = new Request(`https://engine.test${path}`, {
      method: 'POST',
      headers: { 'x-evelyn-partner': PARTNER, 'x-evelyn-timestamp': timestamp, 'x-evelyn-signature': sig },
      body: rawBody,
    }) as unknown as NextRequest;
    const { status, json } = await callEcho(req);
    assert.strictEqual(status, 400);
    assert.strictEqual(json.reason, 'invalid_json');
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
