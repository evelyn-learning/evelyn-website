/**
 * Partner minute pool — GET /api/portal/v1/usage (HMAC, partner-facing).
 * Unit: usageResponse. Source scans: the route uses withPortalAuth and the
 * partner docs data mention the new endpoint and message values.
 *
 * Run: npm run test:partner-pool-usage-route
 */
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { poolView, usageResponse } from '../src/lib/tutor/portal/partner-pool';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

test('usageResponse: not pooled → partner_id + pooled:false only', () => {
  assert.deepEqual(usageResponse({ pooled: false }, 'gameclass'), { partner_id: 'gameclass', pooled: false });
});

test('usageResponse: minutes to one decimal', () => {
  const snap = poolView({ _id: 'gameclass', capSec: 18000, usedSec: 12_744, sessionMaxSec: 900 });
  assert.deepEqual(usageResponse(snap, 'gameclass'), {
    partner_id: 'gameclass',
    pooled: true,
    cap_minutes: 300,
    used_minutes: 212.4,
    remaining_minutes: 87.6,
    session_max_minutes: 15,
  });
});

test('source: /api/portal/v1/usage route is HMAC-wrapped and reads the caller\'s own pool', () => {
  const p = join(__dirname, '../src/app/api/portal/v1/usage/route.ts');
  assert.ok(existsSync(p), 'route exists');
  const src = readFileSync(p, 'utf8');
  assert.ok(src.includes('withPortalAuth'), 'withPortalAuth');
  assert.ok(src.includes('auth.partnerId'), 'auth.partnerId');
  assert.ok(src.includes('usageResponse'), 'usageResponse');
  assert.ok(src.includes('readPoolSnapshot'), 'readPoolSnapshot');
});

test('source: partner docs data list the endpoint and the new message values', () => {
  const ep = readFileSync(join(__dirname, '../src/app/tutor-portal/data/api-endpoints.ts'), 'utf8');
  assert.ok(ep.includes("path: '/usage'"), 'api-endpoints has /usage');
  assert.ok(ep.includes('remaining_minutes'), 'api-endpoints describes remaining_minutes');
  const ev = readFileSync(join(__dirname, '../src/app/tutor-portal/data/webhook-events.ts'), 'utf8');
  assert.ok(ev.includes("event: 'evelyn:start_blocked'"), 'start_blocked documented');
  assert.ok(ev.includes("event: 'evelyn:clock'"), 'clock documented');
  assert.ok(ev.includes('pool_remaining_seconds'), 'clock.pool_remaining_seconds');
  assert.ok((ev.match(/minutes_exhausted/g) ?? []).length >= 3, 'minutes_exhausted on start_blocked, session_ended and host_end');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
