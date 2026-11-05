/**
 * Partner minute pool — charging from POST /api/tutor/session-usage.
 * Unit: chargePartnerFor (token partner wins over the body). Source scans:
 * the route charges per sitting and answers `pool`; the embed sends
 * `attemptEngagedAt` with every save.
 *
 * Run: npm run test:session-usage-pool
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chargePartnerFor } from '../src/lib/tutor/portal/partner-pool';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

test('chargePartnerFor: token and body agree', () => {
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: 'gameclass', bodyPartnerId: 'gameclass' }), { partnerId: 'gameclass', mismatch: false, untrustedBody: false });
});
test('chargePartnerFor: token wins on a mismatch, and says so', () => {
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: 'gameclass', bodyPartnerId: 'other' }), { partnerId: 'gameclass', mismatch: true, untrustedBody: false });
});
test('chargePartnerFor: no token → body partner', () => {
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: null, bodyPartnerId: 'gameclass' }), { partnerId: 'gameclass', mismatch: false, untrustedBody: false });
  assert.deepEqual(chargePartnerFor({ bodyPartnerId: 'gameclass' }), { partnerId: 'gameclass', mismatch: false, untrustedBody: false });
});
test('chargePartnerFor: an untrusted body (token enforcement on, no token) charges nobody', () => {
  // Review finding 1: session-usage is unauthenticated without a studentId, so
  // an anonymous POST naming sourcePartnerId:'gameclass' must not drain the pool.
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: null, bodyPartnerId: 'gameclass', trustBody: false }), { partnerId: null, mismatch: false, untrustedBody: true });
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: 'gameclass', bodyPartnerId: 'gameclass', trustBody: false }), { partnerId: 'gameclass', mismatch: false, untrustedBody: false });
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: null, bodyPartnerId: 'gameclass', trustBody: true }), { partnerId: 'gameclass', mismatch: false, untrustedBody: false });
});

test('chargePartnerFor: neither → null', () => {
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: null, bodyPartnerId: null }), { partnerId: null, mismatch: false, untrustedBody: false });
  assert.deepEqual(chargePartnerFor({ tokenPartnerId: '', bodyPartnerId: undefined }), { partnerId: null, mismatch: false, untrustedBody: false });
});

test('source: session-usage route charges the pool per sitting and answers pool state', () => {
  const src = readFileSync(join(__dirname, '../src/app/api/tutor/session-usage/route.ts'), 'utf8');
  assert.ok(src.includes('chargeSitting'), 'imports chargeSitting');
  assert.ok(src.includes('chargePartnerFor'), 'imports chargePartnerFor');
  assert.ok(src.includes('sendPoolAlert'), 'imports sendPoolAlert');
  assert.ok(src.includes('poolFlagOn'), 'honours TUTOR_PARTNER_POOL');
  assert.ok(src.includes('body.attemptEngagedAt'), 'reads body.attemptEngagedAt');
  assert.ok(/pool:/.test(src), 'response carries pool:');
  assert.ok(src.includes('partner_mismatch'), 'warns on a token/body partner mismatch');
  assert.ok(src.includes("'session-usage:pool'"), 'verifies the token once for the pool when no studentId auth ran');
  assert.ok(src.includes('embedEnforceMode()'), 'body partner trusted only when enforcement is not on');
  assert.ok(src.includes('partner_pool_untrusted_body'), 'logs a skipped body-only charge');
});

test('source: session-usage takes studentId/sourcePartnerId from the verified token', () => {
  const src = readFileSync(join(__dirname, '../src/app/api/tutor/session-usage/route.ts'), 'utf8');
  assert.ok(/[sS]tudentId = auth\.payload\.student_id/.test(src), 'studentId assigned from auth.payload.student_id');
  assert.ok(/PartnerId = auth\.payload\.partner_id/.test(src), 'partner assigned from auth.payload.partner_id');
  assert.ok(src.includes('[session-usage] identity from token'), 'logs the override once');
  assert.ok(/updateFields\.studentId = identityStudentId/.test(src), 'update uses the token-derived studentId');
  assert.ok(/setOnInsertFields\.sourcePartnerId = identityPartnerId/.test(src), 'insert uses the token-derived partner');
});

test('source: a completed save fires the learner summary, never awaited', () => {
  const src = readFileSync(join(__dirname, '../src/app/api/tutor/session-usage/route.ts'), 'utf8');
  assert.ok(/if \(body\.status === ['"]completed['"][^{]*\)\s*\{\s*void runSummaryForSession\(/.test(src), 'void runSummaryForSession( guarded by body.status === completed');
  const guard = src.slice(src.indexOf('if (body.status === "completed" && session'), src.indexOf('void runSummaryForSession('));
  assert.ok(guard.includes('TUTOR_LEARNER_SUMMARY'), 'kill switch guards the hook');
  assert.ok(guard.includes('session.studentId') && guard.includes('session.sourcePartnerId'), 'partner learner rows only');
  assert.ok(/session\.transcript\?\.length \?\? 0\) >= 4/.test(guard), 'at least 4 transcript turns');
});

test('source: TUTOR_LEARNER_SUMMARY kill switch defaults ON', () => {
  const src = readFileSync(join(__dirname, '../src/lib/tutor/orchestrator/flags.ts'), 'utf8');
  assert.ok(src.includes("export const TUTOR_LEARNER_SUMMARY = process.env.TUTOR_LEARNER_SUMMARY !== 'off';"), 'flag default ON');
});

test('source: a verified token cannot write another owner\'s session', () => {
  const src = readFileSync(join(__dirname, '../src/app/api/tutor/session-usage/route.ts'), 'utf8');
  assert.ok(src.includes('reason: "session_owner_mismatch" }, { status: 403 }'), '403 session_owner_mismatch');
  assert.ok(/studentId: 1, sourcePartnerId: 1/.test(src), 'pre-read loads the owner');
  assert.ok((src.match(/if \(ownerMismatch\(/g) ?? []).length >= 2, 'owner checked on the first read and every re-read');
  assert.ok(/\{ \$or: \[\{ studentId: \{ \$exists: false \} \}, \{ studentId: null \}, \{ studentId: tokenOwner\.studentId \}\] \}/.test(src), 'student owner filter');
  assert.ok(/\{ \$or: \[\{ sourcePartnerId: \{ \$exists: false \} \}, \{ sourcePartnerId: null \}, \{ sourcePartnerId: tokenOwner\.partnerId \}\] \}/.test(src), 'partner owner filter');
  assert.ok(src.includes('{ sessionId, ...(spanWrite?.filter ?? {}), ...ownerFilter }'), 'owner filter in the findOneAndUpdate');
  assert.ok(src.indexOf('void runSummaryForSession(') > src.indexOf('TutorSession.findOneAndUpdate('), 'after the update');
  assert.ok(src.indexOf('void runSummaryForSession(') < src.indexOf('return NextResponse.json({\n      success: true'), 'before the response');
});

test('source: embed basePayload carries attemptEngagedAt from sessionEngagedAtRef', () => {
  const src = readFileSync(join(__dirname, '../src/app/tutor-portal/embed/page.tsx'), 'utf8');
  const i = src.indexOf('const basePayload = {');
  assert.ok(i > 0, 'basePayload found');
  const block = src.slice(i, i + 2500);
  assert.ok(/attemptEngagedAt:\s*sessionEngagedAtRef\.current/.test(block), 'attemptEngagedAt in basePayload');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
