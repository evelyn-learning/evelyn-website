/**
 * Task 10 — mock-exam portal route tests (auth wiring + error mapping).
 *
 * Run: `npm run test:portal-mock`
 *
 * No DB: every case here short-circuits before a store call (401 on missing/
 * bad signature, 400 on missing query params / malformed body), so the
 * Mongo-backed happy paths are intentionally NOT exercised — those are
 * covered by the service/report unit tests (`test:mock-service`,
 * `test:mock-report`) and academy's e2e.
 */

import assert from 'node:assert';

process.env.PORTAL_PARTNER_SECRETS = JSON.stringify({ portalA: 'secret-a' });

import { signPortalRequest } from '@evelyn/portal-contract/auth';
import type { NextRequest } from 'next/server';

import { GET as formsGET } from '@/app/api/portal/v1/mock/forms/route';
import { POST as attemptsPOST } from '@/app/api/portal/v1/mock/attempts/route';
import { POST as responsesPOST } from '@/app/api/portal/v1/mock/attempts/responses/route';
import { POST as advancePOST } from '@/app/api/portal/v1/mock/attempts/advance/route';
import { GET as reportGET } from '@/app/api/portal/v1/mock/attempts/report/route';
import { GET as reviewGET } from '@/app/api/portal/v1/mock/attempts/review/route';

const SECRET = 'secret-a';
const PARTNER = 'portalA';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
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

function signed(method: string, pathWithQuery: string, bodyObj?: unknown): NextRequest {
  const body = bodyObj === undefined ? '' : JSON.stringify(bodyObj);
  const timestamp = String(Date.now());
  const sig = signPortalRequest(SECRET, { method, path: pathWithQuery, timestamp, body });
  const headers: Record<string, string> = {
    'x-evelyn-partner': PARTNER,
    'x-evelyn-timestamp': timestamp,
    'x-evelyn-signature': sig,
  };
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && body) init.body = body;
  return new Request(`https://engine.test${pathWithQuery}`, init) as unknown as NextRequest;
}
function unsigned(method: string, pathWithQuery: string): NextRequest {
  return new Request(`https://engine.test${pathWithQuery}`, { method }) as unknown as NextRequest;
}
async function call(h: (r: NextRequest, c: unknown) => Promise<Response>, req: NextRequest) {
  const res = await h(req, undefined);
  return { status: res.status, json: await res.json() };
}

(async () => {
  console.log('\nMock-exam routes — auth enforcement (unsigned → 401):\n');
  await test('forms GET without signature → 401', async () => {
    const { status } = await call(formsGET, unsigned('GET', '/api/portal/v1/mock/forms?studentId=x&topicId=y'));
    assert.strictEqual(status, 401);
  });
  await test('attempts POST (start/resume) without signature → 401', async () => {
    const { status } = await call(attemptsPOST, unsigned('POST', '/api/portal/v1/mock/attempts'));
    assert.strictEqual(status, 401);
  });
  await test('attempts/responses POST without signature → 401', async () => {
    const { status } = await call(responsesPOST, unsigned('POST', '/api/portal/v1/mock/attempts/responses'));
    assert.strictEqual(status, 401);
  });
  await test('attempts/advance POST without signature → 401', async () => {
    const { status } = await call(advancePOST, unsigned('POST', '/api/portal/v1/mock/attempts/advance'));
    assert.strictEqual(status, 401);
  });
  await test('attempts/report GET without signature → 401', async () => {
    const { status } = await call(reportGET, unsigned('GET', '/api/portal/v1/mock/attempts/report?studentId=x&attemptId=y'));
    assert.strictEqual(status, 401);
  });
  await test('attempts/review GET without signature → 401', async () => {
    const { status } = await call(reviewGET, unsigned('GET', '/api/portal/v1/mock/attempts/review?studentId=x&attemptId=y'));
    assert.strictEqual(status, 401);
  });

  console.log('\nGET routes — missing query params → 400:\n');
  await test('forms GET signed, missing studentId+topicId → 400', async () => {
    const { status, json } = await call(formsGET, signed('GET', '/api/portal/v1/mock/forms'));
    assert.strictEqual(status, 400);
    assert.strictEqual(json.error, 'bad_request');
  });
  await test('forms GET signed, missing topicId only → 400', async () => {
    const { status } = await call(formsGET, signed('GET', '/api/portal/v1/mock/forms?studentId=x'));
    assert.strictEqual(status, 400);
  });
  await test('attempts/report GET signed, missing attemptId → 400', async () => {
    const { status, json } = await call(reportGET, signed('GET', '/api/portal/v1/mock/attempts/report?studentId=x'));
    assert.strictEqual(status, 400);
    assert.strictEqual(json.error, 'bad_request');
  });
  await test('attempts/review GET signed, missing studentId+attemptId → 400', async () => {
    const { status, json } = await call(reviewGET, signed('GET', '/api/portal/v1/mock/attempts/review'));
    assert.strictEqual(status, 400);
    assert.strictEqual(json.error, 'bad_request');
  });

  console.log('\nPOST routes — signed but malformed body → 400 (contract-schema wiring):\n');
  await test('attempts POST (start/resume) bad body → 400', async () => {
    const { status, json } = await call(attemptsPOST, signed('POST', '/api/portal/v1/mock/attempts', { studentId: 'x' }));
    assert.strictEqual(status, 400);
    assert.strictEqual(json.error, 'bad_request');
    assert.ok(Array.isArray(json.issues));
  });
  await test('attempts/responses POST bad body → 400', async () => {
    const { status, json } = await call(responsesPOST, signed('POST', '/api/portal/v1/mock/attempts/responses', { attemptId: 'x' }));
    assert.strictEqual(status, 400);
    assert.strictEqual(json.error, 'bad_request');
  });
  await test('attempts/advance POST bad body → 400', async () => {
    const { status, json } = await call(advancePOST, signed('POST', '/api/portal/v1/mock/attempts/advance', { attemptId: 'x' }));
    assert.strictEqual(status, 400);
    assert.strictEqual(json.error, 'bad_request');
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
