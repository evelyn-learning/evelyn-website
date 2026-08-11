/**
 * Embed-token verifier — pure tests against
 * src/lib/tutor/portal/embed-token.ts. No DB, no LLM calls: the module is
 * pure env+crypto, so this script only manipulates process.env and calls
 * the verifier/signer/decision functions directly.
 *
 * Usage: npx tsx scripts/test-embed-token.ts  (npm run test:embed-token)
 */
import {
  verifyEmbedToken,
  checkEmbedAuth,
  signEmbedToken,
  embedEnforceMode,
} from '../src/lib/tutor/portal/embed-token';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

// Save/restore the env keys this script touches so it never leaks state.
const ENV_KEYS = [
  'PORTAL_PARTNER_ID',
  'PORTAL_API_SECRET',
  'PORTAL_PARTNER_SECRETS',
  'EMBED_TOKEN_ENFORCE',
  'EMBED_TOKEN_EXP_GRACE_MINUTES',
] as const;
const savedEnv: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) savedEnv[k] = process.env[k];
function resetEnv() {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
}
function clearEnv() {
  for (const k of ENV_KEYS) delete process.env[k];
}

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

console.log('embed-token: verifyEmbedToken + signEmbedToken + checkEmbedAuth');

// ---------------------------------------------------------------------------
// Fixture: single-default partner mode (auth.ts:46-51)
// ---------------------------------------------------------------------------
clearEnv();
process.env.PORTAL_PARTNER_ID = 'academy';
process.env.PORTAL_API_SECRET = 'test-secret';
const now = Date.UTC(2026, 7, 11, 12, 0, 0);
const good = signEmbedToken(
  { partner_id: 'academy', student_id: 'stu-1', exp: Math.floor(now / 1000) + 7200 },
  'test-secret',
);

// --- verifyEmbedToken: structural / signature cases -------------------------
assert(verifyEmbedToken(null).ok === false, 'null token rejected (missing token)');
assert(verifyEmbedToken('not-a-jwt').ok === false, 'non-JWT rejected');
const legacyB64 = Buffer.from(JSON.stringify({ partner_id: 'academy' }), 'utf8').toString('base64');
assert(verifyEmbedToken(legacyB64).ok === false, 'legacy base64 token rejected (not a JWT)');
assert(verifyEmbedToken(good, now).ok === true, 'valid HS256 token verifies');
assert(verifyEmbedToken(good.slice(0, -2) + 'xx', now).ok === false, 'tampered signature rejected');

const wrongPartner = signEmbedToken(
  { partner_id: 'nobody', student_id: 's', exp: Math.floor(now / 1000) + 7200 },
  'whatever',
);
assert(verifyEmbedToken(wrongPartner, now).ok === false, 'unknown partner rejected');

// student_id is optional — an anonymous-demo token with no student_id must
// still verify fine as long as partner + signature + exp all check out.
const anon = signEmbedToken(
  { partner_id: 'academy', exp: Math.floor(now / 1000) + 7200 },
  'test-secret',
);
const anonResult = verifyEmbedToken(anon, now);
assert(anonResult.ok === true, 'token with no student_id verifies (optional claim)');

// no exp claim at all → never expires, should verify
const noExp = signEmbedToken({ partner_id: 'academy', student_id: 's' }, 'test-secret');
assert(verifyEmbedToken(noExp, now).ok === true, 'token with no exp claim verifies');

// --- exp + grace window ------------------------------------------------------
const stale3h = signEmbedToken(
  { partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) - 3 * 3600 },
  'test-secret',
);
const stale5h = signEmbedToken(
  { partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) - 5 * 3600 },
  'test-secret',
);
assert(verifyEmbedToken(stale3h, now).ok === true, 'expired-within-grace (default 240min) passes');
assert(verifyEmbedToken(stale5h, now).ok === false, 'expired-past-grace (default 240min) rejected');

// custom grace window, read at call time (not module load)
process.env.EMBED_TOKEN_EXP_GRACE_MINUTES = '30';
const stale1h = signEmbedToken(
  { partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) - 3600 },
  'test-secret',
);
assert(verifyEmbedToken(stale1h, now).ok === false, 'custom grace=30min: 1h-stale token rejected');
delete process.env.EMBED_TOKEN_EXP_GRACE_MINUTES;
assert(verifyEmbedToken(stale1h, now).ok === true, 'grace restored to default 240min: 1h-stale token passes');

// --- alg pinning --------------------------------------------------------------
// header alg 'none' with an empty signature segment must be rejected.
const noneHeader = b64url({ alg: 'none', typ: 'JWT' });
const nonePayload = b64url({ partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) + 7200 });
const noneToken = `${noneHeader}.${nonePayload}.`;
assert(verifyEmbedToken(noneToken, now).ok === false, 'alg:none token rejected');
const noneResult = verifyEmbedToken(noneToken, now);
assert(!noneResult.ok && noneResult.reason === 'unsupported alg', 'alg:none rejected with reason "unsupported alg"');

// header alg 'HS512' — signed (with the real secret, over the real HMAC-SHA256
// of the header+payload) but the header itself claims HS512 — must still be
// rejected on the alg check, before any signature comparison happens.
const hs512Header = b64url({ alg: 'HS512', typ: 'JWT' });
const hs512Payload = b64url({ partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) + 7200 });
const hs512Sig = require('node:crypto')
  .createHmac('sha256', 'test-secret')
  .update(`${hs512Header}.${hs512Payload}`)
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');
const hs512Token = `${hs512Header}.${hs512Payload}.${hs512Sig}`;
const hs512Result = verifyEmbedToken(hs512Token, now);
assert(hs512Result.ok === false, 'header alg:HS512 rejected even when signed');
assert(!hs512Result.ok && hs512Result.reason === 'unsupported alg', 'HS512 rejected with reason "unsupported alg"');

// header/payload segments that are valid JSON but not objects (e.g. the
// literal `null`) must be rejected, not thrown — property access on a JSON
// `null` payload would otherwise throw before the ok:false path is hit.
const nullHeaderB64 = b64url(null);
const nullPayloadB64 = b64url(null);
assert(
  verifyEmbedToken(`${nullHeaderB64}.${nonePayload}.x`, now).ok === false,
  'JSON-null header rejected without throwing',
);
assert(
  verifyEmbedToken(`${noneHeader}.${nullPayloadB64}.x`, now).ok === false,
  'JSON-null payload rejected without throwing',
);

// ---------------------------------------------------------------------------
// embedEnforceMode() + checkEmbedAuth() — env read at call time, not module
// load, so flipping process.env.EMBED_TOKEN_ENFORCE between assertions must
// be observed immediately.
// ---------------------------------------------------------------------------
delete process.env.EMBED_TOKEN_ENFORCE;
assert(embedEnforceMode() === 'off', 'default off');

process.env.EMBED_TOKEN_ENFORCE = 'off';
assert(embedEnforceMode() === 'off', 'explicit off');
const offDecision = checkEmbedAuth({ token: null, route: 't' });
assert(offDecision.allow === true, 'off mode allows even a missing token');
assert(offDecision.payload === undefined, 'off mode does not attempt verification (no payload)');

process.env.EMBED_TOKEN_ENFORCE = 'log';
assert(embedEnforceMode() === 'log', 'log mode read back');
assert(checkEmbedAuth({ token: null, route: 't' }).allow === true, 'log mode allows failures');
const logDecision = checkEmbedAuth({ token: null, route: 't' });
assert(typeof logDecision.reason === 'string' && logDecision.reason.length > 0, 'log mode still reports a reason');

process.env.EMBED_TOKEN_ENFORCE = 'on';
assert(embedEnforceMode() === 'on', 'on mode read back');
assert(checkEmbedAuth({ token: null, route: 't' }).allow === false, 'on mode blocks missing token');
assert(checkEmbedAuth({ token: good, expectedStudentId: 'stu-1', route: 't' }).allow === true, 'on mode allows match');
const mismatch = checkEmbedAuth({ token: good, expectedStudentId: 'stu-2', route: 't' });
assert(mismatch.allow === false, 'student mismatch blocked');
assert(mismatch.reason === 'student_mismatch', 'student mismatch reports reason "student_mismatch"');
assert(
  checkEmbedAuth({ token: good, route: 't' }).allow === true,
  'on mode allows a verified token when no expectedStudentId is given',
);
assert(
  checkEmbedAuth({ token: anon, route: 't' }).allow === true,
  'on mode allows a verified anonymous (no student_id) token when no expectedStudentId is given',
);

resetEnv();

// ---------------------------------------------------------------------------
// Route-level gating: student-profile GET/POST (Task 2)
//
// This section only covers the DENY paths. The route short-circuits BEFORE
// any DB access when checkEmbedAuth blocks (auth runs ahead of
// getOrCreateStudentProfile and ahead of the segmentOutcomes evidence
// block), so these tests are safe in this DB-free script. The 200 (allow)
// paths necessarily touch Mongo via getOrCreateStudentProfile /
// saveStudentProfile, so that coverage lives in test-learner-model.ts's
// DB-backed student-profile section instead (runStudentProfileEmbedAuthTests).
// ---------------------------------------------------------------------------
async function runStudentProfileRouteDenyTests() {
  console.log('\nstudent-profile route — embed-token gating (deny paths, Task 2):\n');

  const { GET: profileGET, POST: profilePOST } = await import(
    '../src/app/api/tutor/student-profile/[id]/route'
  );
  const { NextRequest } = await import('next/server');

  function getReq(headers?: Record<string, string>) {
    return new Request('https://engine.test/api/tutor/student-profile/stu-1', {
      method: 'GET',
      headers,
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function postReq(bodyObj: unknown, headers?: Record<string, string>) {
    return new Request('https://engine.test/api/tutor/student-profile/stu-1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
      body: JSON.stringify(bodyObj),
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function ctx(id: string) {
    return { params: Promise.resolve({ id }) };
  }

  clearEnv();
  process.env.PORTAL_PARTNER_ID = 'academy';
  process.env.PORTAL_API_SECRET = 'test-secret';
  process.env.EMBED_TOKEN_ENFORCE = 'on';

  // (a) GET without a token header, enforce=on → 401.
  {
    const res = await profileGET(getReq(), ctx('stu-1'));
    const json = await res.json();
    assert(res.status === 401, 'GET student-profile: no token, enforce=on → 401');
    assert(
      json.error === 'unauthorized' && typeof json.reason === 'string' && json.reason.length > 0,
      'GET student-profile: 401 body shape {error: "unauthorized", reason}',
    );
  }

  // (c) POST with a token whose student_id mismatches the URL id, enforce=on
  // → 401. Auth runs before the segmentOutcomes evidence block, so a denied
  // commit never reaches appendEvidence or getOrCreateStudentProfile — that
  // "no evidence appended, no profile mutated" guarantee is verified against
  // a live DB in test-learner-model.ts (runStudentProfileEmbedAuthTests).
  {
    const mismatchToken = signEmbedToken(
      { partner_id: 'academy', student_id: 'stu-OTHER', exp: Math.floor(now / 1000) + 7200 },
      'test-secret',
    );
    const res = await profilePOST(
      postReq(
        {
          sessionId: 'sess-x',
          segmentOutcomes: [
            { segmentId: 'seg', loId: 'lo', kind: 'try_yourself', completed: true, outcome: 1 },
          ],
        },
        { 'x-embed-token': mismatchToken },
      ),
      ctx('stu-1'),
    );
    const json = await res.json();
    assert(res.status === 401, 'POST student-profile: mismatched student_id token, enforce=on → 401');
    assert(json.reason === 'student_mismatch', 'POST student-profile: 401 reason is "student_mismatch"');
  }

  // Note: the "(d) enforce=log, POST without token → 200" case from the task
  // brief is deliberately NOT tested here — once auth allows (log mode never
  // blocks), the route proceeds into getOrCreateStudentProfile/
  // saveStudentProfile, which requires a live Mongo connection. That case is
  // covered against a real DB in test-learner-model.ts
  // (runStudentProfileEmbedAuthTests) so this script stays DB-free.

  resetEnv();
}

runStudentProfileRouteDenyTests()
  .then(() => {
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Fatal error running embed-token route-level tests:', err);
    process.exit(1);
  });
