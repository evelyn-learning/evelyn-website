/**
 * Partner minute pool — embed frame wiring (tutor-portal/embed/page.tsx):
 * snapshot read, start gate, wall-clock sitting cap, exhausted end, per-partner
 * parked idle, clock pool field, overlay. Source scans (the page is a React
 * client component) plus a unit test of the wire → snapshot parser.
 *
 * Run: npm run test:partner-pool-embed
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { poolSnapshotFromWire } from '../src/lib/tutor/portal/partner-pool';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const embed = readFileSync(join(__dirname, '../src/app/tutor-portal/embed/page.tsx'), 'utf8');

test('poolSnapshotFromWire: the route JSON becomes a typed snapshot', () => {
  assert.deepEqual(
    poolSnapshotFromWire({ pooled: true, cap_sec: 18000, used_sec: 100, remaining_sec: 17900, session_max_sec: 900, idle_end_sec: 600, exhausted: false }),
    { pooled: true, capSec: 18000, usedSec: 100, remainingSec: 17900, sessionMaxSec: 900, idleEndSec: 600, exhausted: false },
  );
  assert.deepEqual(poolSnapshotFromWire({ pooled: false }), { pooled: false });
  assert.deepEqual(poolSnapshotFromWire({ pooled: false, error: 'unavailable' }), { pooled: false });
  assert.deepEqual(poolSnapshotFromWire(null), { pooled: false });
  assert.deepEqual(poolSnapshotFromWire({ pooled: true, cap_sec: 'x' }), { pooled: false });
});

test('flag + debug prefix', () => {
  assert.match(embed, /const TUTOR_PARTNER_POOL = process\.env\.NEXT_PUBLIC_TUTOR_PARTNER_POOL !== 'off'/);
  const m = /const EMBED_DEBUG_EVENT_PREFIXES = \[([\s\S]*?)\];/.exec(embed);
  assert.ok(m && m[1].includes("'partner_pool'"), "'partner_pool' in EMBED_DEBUG_EVENT_PREFIXES");
});

test('snapshot read at mount with the embed token; unavailable → fail open', () => {
  assert.ok(embed.includes("fetch('/api/tutor/partner-pool'"), 'fetches the pool route');
  assert.ok(embed.includes("'x-embed-token': embedToken"), 'with the embed token');
  assert.ok(embed.includes("addDebugEvent('partner_pool_snapshot'"), 'snapshot debug event');
  assert.ok(embed.includes("addDebugEvent('partner_pool_unavailable'"), 'unavailable debug event');
  assert.ok(embed.includes('poolSnapshotFromWire('), 'parses the wire shape');
});

test('start gate: exhausted blocks the host start and the overlay; overlay copy is the fixed line', () => {
  assert.ok(embed.includes("blockStart('minutes_exhausted')"), 'blockStart minutes_exhausted');
  assert.ok(embed.includes('startDecision('), 'uses startDecision');
  assert.ok(embed.includes("startBlocked === 'minutes_exhausted'"), 'overlay branch');
  assert.ok(embed.includes('POOL_BLOCKED_LINE'), 'overlay copy from the helper');
  assert.match(embed, /useState<null \| 'autoplay' \| 'token_expired' \| 'minutes_exhausted'>/);
});

test('wall-clock sitting cap: effectiveCapSec latched at engagement, 5-s timer ends with time_limit', () => {
  assert.ok(embed.includes('effectiveCapSec('), 'effectiveCapSec');
  assert.ok(embed.includes('poolCapSecRef'), 'poolCapSecRef');
  assert.ok(embed.includes("addDebugEvent('partner_pool_cap_end'"), 'cap end event');
  assert.match(embed, /poolEndReasonRef\.current = 'time_limit'/);
  assert.match(embed, /\}, 5_000\);/, 'a 5-second interval');
});

test('exhausted mid-session: the usage response ends the session with the pool goodbye', () => {
  assert.ok(embed.includes("addDebugEvent('partner_pool_exhausted'"), 'exhausted event');
  assert.match(embed, /poolEndReasonRef\.current = 'minutes_exhausted'/);
  assert.match(embed, /endSession\(\{ farewell: POOL_GOODBYE_LINE \}\)/);
  assert.match(embed, /const endedReason = reason \?\? poolEndReasonRef\.current \?\? hostEndReasonRef\.current \?\? undefined;/);
});

test('parked idle end uses the partner\'s idle_end_sec, default unchanged', () => {
  assert.ok(embed.includes('poolIdleEndSecRef'), 'poolIdleEndSecRef');
  assert.match(embed, /poolIdleEndSecRef\.current \?\? STANDBY_IDLE_END_MS \/ 1000/);
});

test('clock: max_seconds is the effective cap; pool_remaining_seconds from the snapshot', () => {
  assert.match(embed, /maxSeconds: poolCapSecRef\.current \?\? \(maxDurationExplicit \? maxDuration \* 60 : undefined\)/);
  assert.ok(embed.includes('poolRemainingSeconds: clockPoolSeconds(poolSnapshotRef.current)'), 'clockPoolSeconds');
});

// ADMIN-SCAN (Task 7 appends above this line)

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
