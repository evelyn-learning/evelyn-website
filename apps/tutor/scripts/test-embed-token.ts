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
  partnerIdForInternalRoute,
  embedTokenRejectionReason,
} from '../src/lib/tutor/portal/embed-token';
import { parseEmbedConfig } from '../src/lib/tutor/portal/parse-embed-config';

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
// Base the fixture clock on the real clock, not a pinned calendar date: every
// checkEmbedAuth() call and every route handler in this file verifies against
// real Date.now() internally (only the explicit verifyEmbedToken(token, now)
// calls below inject this value directly). A token minted with `now` fixed to
// a past date would drift past its exp+grace window on the real clock as time
// passes, flipping every "valid token" assertion in those paths to 'expired'.
const now = Date.now();
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

// non-numeric grace override (e.g. a typo'd env value) must NOT fail open.
// Number('abc') is NaN, and `expMs + NaN*60000 < nowMs` is always false —
// without the Number.isFinite guard this would let ANY expired token
// through regardless of age. Use a token stale well past even the 240min
// default so a silent fall-through to "no grace at all" (0min) would also
// wrongly pass; only the intended 240min-default fallback rejects it.
process.env.EMBED_TOKEN_EXP_GRACE_MINUTES = 'abc';
const staleWayPast = signEmbedToken(
  { partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) - 6 * 3600 },
  'test-secret',
);
assert(
  verifyEmbedToken(staleWayPast, now).ok === false,
  'non-numeric grace env ("abc") does not fail open: expired-past-default-grace token still rejected',
);
delete process.env.EMBED_TOKEN_EXP_GRACE_MINUTES;

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

// ---------------------------------------------------------------------------
// partnerIdForInternalRoute() — M1c Task 5 fix round 3, CRITICAL A2.
//
// `checkEmbedAuth` returns `payload` even when verification only PARTIALLY
// succeeded (a `student_mismatch`), and in 'log' mode still ALLOWS the
// request. If `partnerIdForInternalRoute` trusted that payload, any
// validly-signed token — e.g. the marketing demo-token route hands out a
// signed `evelyn-marketing` token to anyone — could pick which partner's
// namespace an unrelated student's data gets written into. It must fall
// back to 'evelyn' whenever verification didn't FULLY succeed (`reason`
// set), never just whenever `allow` is true.
// ---------------------------------------------------------------------------
assert(
  partnerIdForInternalRoute({ allow: true }) === 'evelyn',
  'partnerIdForInternalRoute: no payload at all (e.g. enforce=off) -> evelyn',
);
assert(
  partnerIdForInternalRoute({ allow: true, payload: { partner_id: 'academy', student_id: 'stu-1' } }) === 'academy',
  'partnerIdForInternalRoute: full verification success -> the token\'s own partner_id',
);
assert(
  partnerIdForInternalRoute(mismatch) === 'evelyn',
  'partnerIdForInternalRoute: student_mismatch (mode=on, blocked) -> evelyn, NOT the token\'s partner_id',
);
const logModeMismatch = (() => {
  process.env.EMBED_TOKEN_ENFORCE = 'log';
  const decision = checkEmbedAuth({ token: good, expectedStudentId: 'stu-2', route: 't' });
  process.env.EMBED_TOKEN_ENFORCE = 'on';
  return decision;
})();
assert(logModeMismatch.allow === true, 'sanity: log mode allows the mismatched request through');
assert(logModeMismatch.payload?.partner_id === 'academy', 'sanity: log mode still returns the payload');
assert(
  partnerIdForInternalRoute(logModeMismatch) === 'evelyn',
  'partnerIdForInternalRoute: student_mismatch in LOG mode (allowed through) -> evelyn, not the exploit path CRITICAL A2 closed',
);
assert(
  partnerIdForInternalRoute({ allow: false, reason: 'missing token' }) === 'evelyn',
  'partnerIdForInternalRoute: no token at all -> evelyn (retail), never a 401 concern for this function',
);

// ---------------------------------------------------------------------------
// embedTokenRejectionReason() — M1c Task 5 fix round 4, spec §4.0 refinement.
//
// Round 3's `partnerIdForInternalRoute` treated "no token" and "token
// present but invalid" identically (both -> 'evelyn', never reject). That
// was wrong for the second case: a PRESENT token is by definition not
// retail, so falling back to 'evelyn' for one that fails verification
// (expired past the grace window, tampered, unknown partner) or fails
// student-binding (student_mismatch) silently misattributes a partner
// student's write into the retail namespace instead of erroring. This
// function is the route-level reject/proceed decision that closes that:
// only a genuinely ABSENT token may proceed as retail; a present-but-bad
// one must reject.
// ---------------------------------------------------------------------------
assert(
  embedTokenRejectionReason(null, { allow: true }) === null,
  'embedTokenRejectionReason: no token at all -> proceed (retail), never reject',
);
assert(
  embedTokenRejectionReason(null, { allow: false, reason: 'missing token' }) === null,
  'embedTokenRejectionReason: no token, enforce=on (checkEmbedAuth still reports allow:false) -> proceed anyway, token itself was absent',
);
assert(
  embedTokenRejectionReason(good, { allow: true, payload: { partner_id: 'academy', student_id: 'stu-1' } }) === null,
  'embedTokenRejectionReason: token present and fully verified -> proceed',
);
const garbage = 'not-a-valid-jwt';
const garbageDecision = checkEmbedAuth({ token: garbage, expectedStudentId: 'stu-1', route: 't' });
assert(garbageDecision.reason !== undefined, 'sanity: a garbage token fails verification with a reason');
assert(
  embedTokenRejectionReason(garbage, garbageDecision) === garbageDecision.reason,
  'embedTokenRejectionReason: token present but malformed -> reject with the verification reason',
);
assert(
  embedTokenRejectionReason(good, mismatch) === 'student_mismatch',
  'embedTokenRejectionReason: token present but student_mismatch (mode=on) -> reject, not evelyn',
);
assert(
  embedTokenRejectionReason(good, logModeMismatch) === 'student_mismatch',
  'embedTokenRejectionReason: student_mismatch in LOG mode (checkEmbedAuth itself allows it through) -> STILL reject — ' +
    'this route-level check deliberately overrides log mode\'s usual "warn but allow" for identity-deriving routes',
);
// 'off' mode never attempts verification, so `reason` is never set even
// for a token that would otherwise be garbage — this function must not
// reject there (checkEmbedAuth's OWN contract: off means "don't even try").
process.env.EMBED_TOKEN_ENFORCE = 'off';
const offModeGarbage = checkEmbedAuth({ token: garbage, expectedStudentId: 'stu-1', route: 't' });
assert(
  embedTokenRejectionReason(garbage, offModeGarbage) === null,
  'embedTokenRejectionReason: enforce=off never rejects, even with a garbage token present (off means "do not verify")',
);
process.env.EMBED_TOKEN_ENFORCE = 'on';

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

// ---------------------------------------------------------------------------
// Route-level gating: session-usage GET/POST (Task 3)
//
// Same split as student-profile (Task 2): this section only covers the DENY
// paths. GET checks auth BEFORE the sessionId-missing 400 / connectDB, and
// POST checks auth (when body.studentId is present) BEFORE checkRateLimit /
// connectDB, so a denied request never reaches Mongo — safe in this DB-free
// script. If either check were ever reordered to run after connectDB(), these
// tests would fail loudly here (no MONGODB_URI in this process → connectDB()
// throws → 500, not 401) rather than silently in a DB-backed run. The 200
// (allow) paths, and the studentId-absent anonymous-POST path (which is
// unauthenticated by design but still upserts), necessarily touch Mongo, so
// that coverage lives in test-learner-model.ts's DB-backed section instead
// (runSessionUsageEmbedAuthTests).
// ---------------------------------------------------------------------------
async function runSessionUsageRouteDenyTests() {
  console.log('\nsession-usage route — embed-token gating (deny paths, Task 3):\n');

  const { GET: usageGET, POST: usagePOST } = await import(
    '../src/app/api/tutor/session-usage/route'
  );
  const { NextRequest } = await import('next/server');

  function getReq(qs: string, headers?: Record<string, string>) {
    return new Request(`https://engine.test/api/tutor/session-usage${qs}`, {
      method: 'GET',
      headers,
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function postReq(bodyObj: unknown, headers?: Record<string, string>) {
    return new Request('https://engine.test/api/tutor/session-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
      body: JSON.stringify(bodyObj),
    }) as unknown as InstanceType<typeof NextRequest>;
  }

  clearEnv();
  process.env.PORTAL_PARTNER_ID = 'academy';
  process.env.PORTAL_API_SECRET = 'test-secret';
  process.env.EMBED_TOKEN_ENFORCE = 'on';

  // (a) GET without a token, enforce=on → 401. No sessionId in the query
  // either — proves auth runs BEFORE the sessionId-missing 400.
  {
    const res = await usageGET(getReq(''));
    const json = await res.json();
    assert(res.status === 401, 'GET session-usage: no token, enforce=on → 401');
    assert(
      json.error === 'unauthorized' && typeof json.reason === 'string' && json.reason.length > 0,
      'GET session-usage: 401 body shape {error: "unauthorized", reason}',
    );
  }

  // (c) POST with studentId in body, no token, enforce=on → 401.
  {
    const res = await usagePOST(
      postReq({ sessionId: `sess-deny-${Date.now()}`, studentId: 'stu-1' }),
    );
    const json = await res.json();
    assert(res.status === 401, 'POST session-usage: studentId present, no token, enforce=on → 401');
    assert(json.error === 'unauthorized', 'POST session-usage: 401 body has error:"unauthorized"');
  }

  // (f) POST with studentId in body + a token whose student_id mismatches →
  // 401, reason "student_mismatch".
  {
    const mismatchToken = signEmbedToken(
      { partner_id: 'academy', student_id: 'stu-OTHER', exp: Math.floor(now / 1000) + 7200 },
      'test-secret',
    );
    const res = await usagePOST(
      postReq(
        { sessionId: `sess-deny-mismatch-${Date.now()}`, studentId: 'stu-1' },
        { 'x-embed-token': mismatchToken },
      ),
    );
    const json = await res.json();
    assert(res.status === 401, 'POST session-usage: mismatched student_id token, enforce=on → 401');
    assert(json.reason === 'student_mismatch', 'POST session-usage: 401 reason is "student_mismatch"');
  }

  // Same mismatch case, but the token rides in body.embedToken (beacon path,
  // no header) — proves the header-or-body extraction feeds the same auth
  // check on the POST deny path too.
  {
    const mismatchToken = signEmbedToken(
      { partner_id: 'academy', student_id: 'stu-OTHER', exp: Math.floor(now / 1000) + 7200 },
      'test-secret',
    );
    const res = await usagePOST(
      postReq({
        sessionId: `sess-deny-mismatch-body-${Date.now()}`,
        studentId: 'stu-1',
        embedToken: mismatchToken,
      }),
    );
    const json = await res.json();
    assert(res.status === 401, 'POST session-usage: mismatched student_id token via body.embedToken → 401');
    assert(json.reason === 'student_mismatch', 'POST session-usage (body token): 401 reason is "student_mismatch"');
  }

  // Note: the "(b) GET valid token → 200", "(d) POST matching-claim token via
  // body.embedToken → 200", "(e) POST without studentId, no token → 200
  // (anonymous demo)", and "log-mode POST with studentId, no token → 200"
  // cases from the task brief are deliberately NOT tested here — every allow
  // path here falls through into connectDB()/TutorSession, which requires a
  // live Mongo connection. Those live in test-learner-model.ts
  // (runSessionUsageEmbedAuthTests) so this script stays DB-free.

  resetEnv();
}

// ---------------------------------------------------------------------------
// session-usage GET — accepts a demo-token-minted token under enforce=on
// (final-review Finding 2: first-party /tutor's reload-resume GET now mints
// one of these via POST /api/tutor-portal/demo-token before its resume
// fetch, since it has no embed-supplied token of its own to thread through).
//
// DB-free: the request omits sessionId from the query, so a token that
// clears the auth gate still short-circuits at the sessionId-missing 400
// BEFORE connectDB() runs — a rejected/missing token would 401 here instead,
// so landing on 400 proves auth passed, without needing a live Mongo
// connection. The full 200 (sessionId + DB) path is covered in
// test-learner-model.ts.
// ---------------------------------------------------------------------------
async function runSessionUsageDemoTokenAcceptedTest() {
  console.log('\nsession-usage route — demo-token-minted token clears the auth gate (Finding 2 fix):\n');

  const { GET: usageGET } = await import('../src/app/api/tutor/session-usage/route');
  const { POST: demoTokenPOST } = await import('../src/app/api/tutor-portal/demo-token/route');
  const { NextRequest } = await import('next/server');

  clearEnv();
  process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({
    'evelyn-marketing': 'mkt-secret',
    academy: 'test-secret',
  });
  process.env.EMBED_TOKEN_ENFORCE = 'on';

  const tokenReq = new Request('https://engine.test/api/tutor-portal/demo-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config: {} }),
  });
  const tokenRes = await demoTokenPOST(tokenReq as never);
  const { token } = (await tokenRes.json()) as { token: string };
  assert(typeof token === 'string' && token.length > 0, 'demo-token: minted a token for the resume-fetch fixture');

  const req = new Request('https://engine.test/api/tutor/session-usage', {
    method: 'GET',
    headers: { 'x-embed-token': token },
  }) as unknown as InstanceType<typeof NextRequest>;
  const res = await usageGET(req);
  const json = await res.json();
  assert(
    res.status !== 401,
    'GET session-usage: demo-token-minted token, enforce=on → not blocked by auth',
  );
  assert(
    res.status === 400 && json.error === 'sessionId is required',
    'GET session-usage: demo-token clears auth, falls through to sessionId-missing 400 (DB-free)',
  );

  resetEnv();
}

// ---------------------------------------------------------------------------
// Route-level: POST /api/tutor-portal/demo-token (Task 5)
//
// DB-free: the route only signs/encodes, no Mongo. Covers the forced-claim
// override (client-sent partner_id/student_id in `config` are ignored), the
// unsigned-fallback degrade when no evelyn-marketing secret is configured,
// and the 400 body-validation paths.
// ---------------------------------------------------------------------------
async function runDemoTokenRouteTests() {
  console.log('\ndemo-token route — server-minted signed demo tokens (Task 5):\n');

  const { POST: demoTokenPOST } = await import(
    '../src/app/api/tutor-portal/demo-token/route'
  );

  function postReq(body: unknown) {
    return new Request('https://engine.test/api/tutor-portal/demo-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  }

  // (a) With a configured evelyn-marketing secret, a spoofed partner_id /
  // student_id in the client config must be overridden by the server's
  // forced claims, while other fields (e.g. subject) pass through.
  {
    clearEnv();
    process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({
      'evelyn-marketing': 'mkt-secret',
      academy: 'test-secret',
    });

    const res = await demoTokenPOST(
      postReq({
        config: { subject: 'math', partner_id: 'spoofed', student_id: 'stu-victim' },
      }) as never,
    );
    assert(res.status === 200, 'demo-token: 200 with configured secret');
    const json = (await res.json()) as { token?: string };
    assert(typeof json.token === 'string' && json.token.length > 0, 'demo-token: response has a token string');

    const verdict = verifyEmbedToken(json.token ?? null);
    assert(verdict.ok === true, 'demo-token: signed token verifies via verifyEmbedToken');
    if (verdict.ok) {
      assert(verdict.payload.partner_id === 'evelyn-marketing', 'demo-token: partner_id forced to evelyn-marketing');
      assert(
        typeof verdict.payload.student_id === 'string' && verdict.payload.student_id.startsWith('demo-'),
        'demo-token: spoofed student_id overridden, forced id starts with "demo-"',
      );
      assert(verdict.payload.subject === 'math', 'demo-token: other config fields (subject) survive');
    }

    resetEnv();
  }

  // (b) With no evelyn-marketing secret configured, the route degrades to
  // the legacy unsigned base64 encoding (matches enforcement-off worlds) —
  // still carrying the forced partner_id/student_id claims.
  {
    clearEnv();
    process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ academy: 'test-secret' });

    const res = await demoTokenPOST(
      postReq({ config: { subject: 'science', partner_id: 'spoofed', student_id: 'stu-victim' } }) as never,
    );
    assert(res.status === 200, 'demo-token: 200 with no marketing secret configured (degrade path)');
    const json = (await res.json()) as { token?: string };
    const token = json.token ?? '';
    assert(verifyEmbedToken(token).ok === false, 'demo-token: unsigned fallback token fails verifyEmbedToken');

    let decoded: Record<string, unknown> = {};
    let decodeOk = true;
    try {
      decoded = JSON.parse(decodeURIComponent(escape(atob(token))));
    } catch {
      decodeOk = false;
    }
    assert(decodeOk, 'demo-token: unsigned fallback token base64-decodes to JSON');
    assert(decoded.partner_id === 'evelyn-marketing', 'demo-token: unsigned fallback still forces partner_id');
    assert(
      typeof decoded.student_id === 'string' && (decoded.student_id as string).startsWith('demo-'),
      'demo-token: unsigned fallback still forces demo- student_id',
    );
    assert(decoded.subject === 'science', 'demo-token: unsigned fallback preserves other config fields');

    resetEnv();
  }

  // (c) Missing/invalid body → 400.
  {
    clearEnv();
    process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ 'evelyn-marketing': 'mkt-secret' });

    const resNoConfig = await demoTokenPOST(postReq({}) as never);
    assert(resNoConfig.status === 400, 'demo-token: missing config object → 400');

    const resBadJson = await demoTokenPOST(postReq('not json') as never);
    assert(resBadJson.status === 400, 'demo-token: invalid JSON body → 400');

    const resWrongType = await demoTokenPOST(postReq({ config: 'nope' }) as never);
    assert(resWrongType.status === 400, 'demo-token: config not an object → 400');

    resetEnv();
  }
}

// ---------------------------------------------------------------------------
// parseEmbedConfig (Task 5 fix round 1) — non-authoritative, non-verifying
// token→config decode used by the embed page. The bug this closes: the old
// embed/page.tsx parseToken did atob(entireToken), which chokes on a signed
// 3-segment JWT's '.' separators (not in the base64 alphabet) — so every
// signed token, including the ones this task's demo-token route mints,
// rendered "Invalid Session Token". This module must accept signed JWTs
// (decode the payload segment WITHOUT verifying — verification stays
// server-side) as well as the legacy whole-string base64 and plain JSON.
// ---------------------------------------------------------------------------
async function runParseEmbedConfigTests() {
  console.log('\nparseEmbedConfig — non-verifying token decode (Task 5 fix round 1):\n');

  clearEnv();
  process.env.PORTAL_PARTNER_ID = 'academy';
  process.env.PORTAL_API_SECRET = 'test-secret';

  // (a) Signed 3-segment JWT from signEmbedToken decodes to its payload —
  // this is the exact success path the mint endpoint produces.
  {
    const signed = signEmbedToken(
      { partner_id: 'academy', student_id: 'stu-1', subject: 'math', exp: Math.floor(now / 1000) + 7200 },
      'test-secret',
    );
    const parsed = parseEmbedConfig<{ partner_id: string; student_id: string; subject: string }>(signed);
    assert(parsed !== null, 'parseEmbedConfig: signed JWT decodes (not null)');
    assert(parsed?.partner_id === 'academy', 'parseEmbedConfig: signed JWT — partner_id survives');
    assert(parsed?.subject === 'math', 'parseEmbedConfig: signed JWT — passthrough field (subject) survives');
  }

  // (a-regression) base64url payload segments containing '-' or '_' must
  // decode correctly (the whole reason this isn't plain base64). A narrow
  // alphabet (e.g. hex digits) rarely lands on base64's last two symbols —
  // the full printable-ASCII range reliably does — so the probe spans every
  // printable char (space through '~') to deterministically force at least
  // one '-'/'_' substitution in the resulting payload segment.
  {
    const printable = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
    const probe = printable + printable;
    const token = signEmbedToken(
      { partner_id: 'academy', student_id: 's', exp: Math.floor(now / 1000) + 7200, probe },
      'test-secret',
    );
    const payloadSeg = token.split('.')[1] ?? '';
    assert(
      payloadSeg.includes('-') || payloadSeg.includes('_'),
      'parseEmbedConfig: precondition — payload segment actually contains "-" or "_"',
    );
    const parsed = parseEmbedConfig<{ probe: string }>(token);
    assert(parsed?.probe === probe, 'parseEmbedConfig: base64url payload with -/_ chars decodes correctly');
  }

  // (b) Legacy whole-string base64 (UTF-8-safe encode, matching the old
  // client-side btoa(unescape(encodeURIComponent(...))) semantics).
  {
    const cfg = { partner_id: 'evelyn-marketing', student_id: 'demo-legacy', subject: 'science — chem' };
    const legacyToken = Buffer.from(JSON.stringify(cfg), 'utf8').toString('base64');
    const parsed = parseEmbedConfig<typeof cfg>(legacyToken);
    assert(parsed !== null, 'parseEmbedConfig: legacy base64 token decodes (not null)');
    assert(parsed?.student_id === 'demo-legacy', 'parseEmbedConfig: legacy base64 — student_id survives');
    assert(parsed?.subject === 'science — chem', 'parseEmbedConfig: legacy base64 — UTF-8 field survives intact');
  }

  // (c) Plain JSON (sandbox/manual testing path).
  {
    const cfg = { partner_id: 'academy', student_id: 'stu-sandbox' };
    const parsed = parseEmbedConfig<typeof cfg>(encodeURIComponent(JSON.stringify(cfg)));
    assert(parsed?.student_id === 'stu-sandbox', 'parseEmbedConfig: plain JSON (URI-encoded) decodes');
  }

  // Garbage / non-parseable input → null, never throws.
  assert(parseEmbedConfig(null) === null, 'parseEmbedConfig: null token → null');
  assert(parseEmbedConfig('') === null, 'parseEmbedConfig: empty string → null');
  assert(parseEmbedConfig('not-a-jwt') === null, 'parseEmbedConfig: garbage single-segment string → null');
  assert(parseEmbedConfig('a.b.c') === null, 'parseEmbedConfig: garbage 3-segment string → null');
  assert(parseEmbedConfig('....') === null, 'parseEmbedConfig: empty-segment dots-only string → null');

  // End-to-end shaped: a token minted by the demo-token route (Task 5,
  // signed path) must parse via this helper — proves the mint endpoint's
  // success path and the embed page's parse path actually agree.
  {
    process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ 'evelyn-marketing': 'mkt-secret' });
    const { POST: demoTokenPOST } = await import('../src/app/api/tutor-portal/demo-token/route');
    const req = new Request('https://engine.test/api/tutor-portal/demo-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { subject: 'e2e-check' } }),
    });
    const res = await demoTokenPOST(req as never);
    const { token } = (await res.json()) as { token: string };
    const parsed = parseEmbedConfig<{ partner_id: string; subject: string; student_id: string }>(token);
    assert(parsed !== null, 'parseEmbedConfig: demo-token-route-minted signed token decodes (not null)');
    assert(parsed?.partner_id === 'evelyn-marketing', 'parseEmbedConfig: demo-token-route token — partner_id survives');
    assert(parsed?.subject === 'e2e-check', 'parseEmbedConfig: demo-token-route token — passthrough field survives');
  }

  resetEnv();
}

runStudentProfileRouteDenyTests()
  .then(() => runSessionUsageRouteDenyTests())
  .then(() => runSessionUsageDemoTokenAcceptedTest())
  .then(() => runDemoTokenRouteTests())
  .then(() => runParseEmbedConfigTests())
  .then(() => {
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Fatal error running embed-token route-level tests:', err);
    process.exit(1);
  });
