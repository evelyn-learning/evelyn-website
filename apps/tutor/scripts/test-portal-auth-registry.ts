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

import {
  __setRegistryOverrideForTests,
  __setLimitsDepsOverrideForTests,
  withPortalAuth,
  type PortalAuth,
} from '@/lib/tutor/portal/auth';
import { getPartner, invalidatePartner, type PartnerRecord } from '@/lib/tutor/portal/registry';
import { encryptSecret } from '@/lib/tutor/portal/secret-box';
import type { LimitsDeps } from '@/lib/tutor/portal/limits';
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
//
// M1c final review (A-I3): `auth.partner` no longer carries the plaintext
// secrets, which is what makes echoing it into a response body safe at all.
// This harness echoing the record verbatim was named in the review as
// "exactly the shape of the mistake" — it stays, deliberately, because the
// assertion below now uses it to PROVE no secret can reach a handler.
const echoHandler = withPortalAuth(async (_req, auth: PortalAuth) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import('next/server')).NextResponse.json({
    ok: true,
    partnerId: auth.partnerId,
    partner: auth.partner,
    partnerKeys: Object.keys(auth.partner).sort(),
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

/** In-memory stand-in for the real Mongo counter store — same key shape,
 *  same "atomic increment, return the new count" contract as
 *  scripts/test-partner-limits.ts's makeCounterStore. Fixed clock so a slow
 *  test run can never cross a minute/day boundary mid-test. */
function makeLimitsDeps(env: Record<string, string> = {}): LimitsDeps {
  const counts = new Map<string, number>();
  const bump: LimitsDeps['bump'] = async (key) => {
    const k = `${key.partnerId}::${key.endpoint}::${key.windowKind}::${key.windowStart}`;
    const next = (counts.get(k) ?? 0) + 1;
    counts.set(k, next);
    return next;
  };
  return { bump, now: () => Date.parse('2026-08-16T12:00:00.000Z'), env: env as NodeJS.ProcessEnv };
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

  // --- M1c final review, A-I4: the kind/status gates moved BELOW the
  // signature loop. The reason is verbatim the one recorded for the
  // allowlist one check later: returning 403 to a caller who cannot sign
  // let anyone who merely knows a partner slug map that partner's state off
  // the 403-vs-401 split without ever authenticating. These are the mirror
  // of the existing 'garbage signature against a disallowed endpoint' case.

  function garbageSignedRequest(partnerId = PARTNER, path = '/api/portal/v1/x'): NextRequest {
    return new Request(`https://engine.test${path}`, {
      method: 'POST',
      headers: {
        'x-evelyn-partner': partnerId,
        'x-evelyn-timestamp': String(Date.now()),
        'x-evelyn-signature': 'deadbeef',
      },
    }) as unknown as NextRequest;
  }

  await test('A-I4: garbage signature against a SUSPENDED partner → 401 bad_signature, not 403 partner_suspended', async () => {
    setRegistry(makePartner({ status: 'suspended' }));
    const { status, json } = await callEcho(garbageSignedRequest());
    assert.strictEqual(status, 401, 'an unauthenticated caller must not learn that this partner is suspended');
    assert.strictEqual(json.reason, 'bad_signature');
  });

  await test('A-I4: garbage signature against a first-party row that DOES hold a secret → 401 bad_signature, not 403 partner_cannot_authenticate', async () => {
    // `secrets: [SECRET]` on purpose: a first-party row with an empty
    // secrets array 401s one check earlier (see the ordering case below),
    // so it could not distinguish the two orderings.
    setRegistry(makePartner({ kind: 'first-party' }));
    const { status, json } = await callEcho(garbageSignedRequest());
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'bad_signature');
  });

  await test('A-I4 ordering fact preserved: a first-party/test row with secrets:[] still 401s unknown_partner at the empty-secrets guard, never 403', async () => {
    // This is the ordering the backfill script's operator warning documents
    // ("the consequence is 401 unknown_partner — NOT 403
    // partner_cannot_authenticate, which is unreachable with an empty
    // secrets array"). Moving the kind/status checks below the signature
    // must not change it. Signature is VALID here, so nothing but the
    // empty-secrets guard can be producing the 401.
    setRegistry(makePartner({ kind: 'first-party', secrets: [] }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 401);
    assert.strictEqual(json.reason, 'unknown_partner');
  });

  // --- M1c final review, A-I1: spec §3 says a registry READ FAILURE is
  // `unknown_partner` (401) — not a 500, and not a fail-open. Before the
  // try/catch, a Mongo blip with MONGODB_URI set threw straight out of
  // getPartner → withPortalAuth → Next, 500-ing every portal route at once.
  // Routed through the REAL getPartner (an injected findPartner that
  // rejects) rather than a throwing override, so this exercises the actual
  // production error path.
  await test('A-I1: a registry read failure → 401 unknown_partner, never a 500 and never the env fallback', async () => {
    invalidatePartner('failpartner');
    __setRegistryOverrideForTests(async (id) =>
      id === 'failpartner'
        ? getPartner('failpartner', {
            findPartner: async () => { throw new Error('replica set failover'); },
            now: () => Date.now(),
            // A live env fallback for the SAME partner: if the fix ever
            // "recovered" by falling through to fromEnv, this request would
            // be 200 — silently resurrecting a partner (possibly a
            // suspended one) for the duration of an outage.
            env: { PORTAL_PARTNER_SECRETS: JSON.stringify({ failpartner: SECRET }) } as NodeJS.ProcessEnv,
          })
        : null,
    );
    const { status, json } = await callEcho(signedRequest({ partnerId: 'failpartner' }));
    assert.strictEqual(status, 401, 'a read failure must be a clean 401, not an uncaught throw (500) and not a 200');
    assert.strictEqual(json.reason, 'unknown_partner');
  });

  // --- M1c final review, reviewer B finding 1 (end-to-end half): route a
  // SUSPENDED row through the REAL getPartner, so the registry's own
  // `status: doc.status` mapping is on trial here, not just the hand-built
  // fixture the case above uses.
  await test('B-1 e2e: a suspended ROW (through the real getPartner) → 403 partner_suspended', async () => {
    invalidatePartner('suspendedrow');
    __setRegistryOverrideForTests(async (id) =>
      id === 'suspendedrow'
        ? getPartner('suspendedrow', {
            findPartner: async () => ({
              kind: 'partner' as const,
              status: 'suspended' as const,
              secrets: [{ ...encryptSecret(SECRET), label: 'v1', createdAt: '2026-01-01' }],
              allowedEndpoints: ['/api/portal/v1/'],
            }),
            now: () => Date.now(),
            env: {} as NodeJS.ProcessEnv,
          })
        : null,
    );
    const { status, json } = await callEcho(signedRequest({ partnerId: 'suspendedrow' }));
    assert.strictEqual(status, 403);
    assert.strictEqual(json.reason, 'partner_suspended');
  });

  // --- M1c final review, A-I3: the plaintext HMAC secrets must not leave
  // withPortalAuth's verification loop. This harness echoes `auth.partner`
  // straight into a response body — the exact mistake the review named — so
  // if `secrets` ever comes back onto PortalAuth, a live credential appears
  // in this JSON and the assertion fires.
  await test('A-I3: auth.partner carries NO plaintext secrets (they never leave the verification loop)', async () => {
    setRegistry(makePartner({ secrets: ['plaintext-should-never-escape'] }));
    const { status, json } = await callEcho(
      signedRequest({ secret: 'plaintext-should-never-escape' }),
    );
    assert.strictEqual(status, 200);
    assert.ok(
      !json.partnerKeys.includes('secrets'),
      `auth.partner must not have a 'secrets' key; got ${JSON.stringify(json.partnerKeys)}`,
    );
    assert.ok(
      !JSON.stringify(json).includes('plaintext-should-never-escape'),
      'no plaintext secret may appear anywhere in what a handler can serialize',
    );
    // Still the SAME record otherwise — handlers legitimately need these.
    assert.deepStrictEqual(json.partnerKeys, [
      'allowedEndpoints', 'flagOverrides', 'kind', 'limits', 'partnerId', 'status',
    ]);
  });

  await test('handler receives the full partner record (non-derivable field)', async () => {
    setRegistry(makePartner({ limits: { rpm: 42, burst: 7, dailyQuota: 100 } }));
    const { status, json } = await callEcho(signedRequest({}));
    assert.strictEqual(status, 200);
    assert.strictEqual(json.partner.limits.rpm, 42, 'partnerId alone is derivable from the header; assert something only the record carries');
  });

  // --- Critical-1 regression: the PORTAL_PARTNER_ID + PORTAL_API_SECRET
  // pair mode (the *other* env shape getPartnerSecret supports — still live
  // production code, called directly by the demo-token route for
  // evelyn-marketing) must still authenticate through the wrapper, not just
  // when called directly. Clears the override so this goes through the
  // real getPartner → registry fromEnv path.
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

  // --- M1c Task 7, fix round 1 (I3): the withPortalAuth → checkPartnerLimits
  // wiring itself had no test — only checkPartnerLimits in isolation
  // (scripts/test-partner-limits.ts). These two exercise it through the
  // real wrapper, via the __setLimitsDepsOverrideForTests seam.
  await test('over-burst through the wrapper → 429 with Retry-After', async () => {
    setRegistry(makePartner({ limits: { rpm: 600, burst: 1, dailyQuota: null } }));
    __setLimitsDepsOverrideForTests(makeLimitsDeps());
    try {
      const r1 = await echoHandler(signedRequest({}), undefined);
      assert.strictEqual(r1.status, 200);
      const r2 = await echoHandler(signedRequest({}), undefined);
      assert.strictEqual(r2.status, 429);
      const json = await r2.json();
      assert.strictEqual(json.reason, 'rate_limited');
      const retryAfter = r2.headers.get('Retry-After');
      assert.ok(retryAfter && Number(retryAfter) > 0, `expected a positive Retry-After header, got ${retryAfter}`);
    } finally {
      __setLimitsDepsOverrideForTests(null);
    }
  });

  await test('daily quota exceeded through the wrapper → 402', async () => {
    setRegistry(makePartner({ limits: { rpm: 600, burst: 1000, dailyQuota: 1 } }));
    __setLimitsDepsOverrideForTests(makeLimitsDeps());
    try {
      const r1 = await echoHandler(signedRequest({}), undefined);
      assert.strictEqual(r1.status, 200);
      const r2 = await echoHandler(signedRequest({}), undefined);
      assert.strictEqual(r2.status, 402);
      const json = await r2.json();
      assert.strictEqual(json.reason, 'quota_exceeded');
    } finally {
      __setLimitsDepsOverrideForTests(null);
    }
  });

  // --- M1c Task 7, fix round 2: I3 was only partially closed — the two
  // tests above use the default allowedEndpoints ('/api/portal/v1/', which
  // covers the default request path), so they pass regardless of whether
  // limits runs before or after the allowlist check. This one pins the
  // ORDER: dailyQuota: 0 blocks unconditionally on the very first bump (see
  // limits.ts), so if checkPartnerLimits ever ran before the allowlist
  // check, this request would 402. It must 403 instead, because the
  // endpoint isn't on this partner's allowlist at all — the allowlist has
  // to run first, exactly as it does for the signature (see the
  // 'garbage signature against a disallowed endpoint' case above, which
  // pins the same ordering one check earlier in the chain).
  await test('over-quota + disallowed endpoint → 403 endpoint_not_allowed (limits must run AFTER the allowlist)', async () => {
    setRegistry(makePartner({
      allowedEndpoints: ['/api/portal/v1/other'], // does NOT cover signedRequest's default path
      limits: { rpm: 600, burst: 1000, dailyQuota: 0 }, // blocks everything, on the very first call
    }));
    __setLimitsDepsOverrideForTests(makeLimitsDeps());
    try {
      const { status, json } = await callEcho(signedRequest({}));
      assert.strictEqual(status, 403);
      assert.strictEqual(json.reason, 'endpoint_not_allowed');
    } finally {
      __setLimitsDepsOverrideForTests(null);
    }
  });

  __setRegistryOverrideForTests(null);
  __setLimitsDepsOverrideForTests(null);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
