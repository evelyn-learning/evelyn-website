/**
 * portal-00fa1bb7 / portal-5bc0fc1e / portal-c3007206: three dead-start
 * sessions, zero debug events between them. Events ride a 30s interval or a
 * beforeunload beacon that an iframed embed does not reliably get, so a
 * session that dies inside the first flush window loses everything — which
 * is exactly the session worth diagnosing.
 *
 * Usage: npx tsx scripts/test-flush-policy.ts  (npm run test:flush-policy)
 */
import { shouldFlushEarly, EARLY_FLUSH_MS, EARLY_FLUSH_EVENTS } from '../src/lib/tutor/orchestrator/flush-policy';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

check('early window is shorter than the 30s interval', EARLY_FLUSH_MS < 30_000, `${EARLY_FLUSH_MS}`);
check('the event threshold is small', EARLY_FLUSH_EVENTS > 0 && EARLY_FLUSH_EVENTS <= 10, `${EARLY_FLUSH_EVENTS}`);

// portal-00fa1bb7: perception_state ×3 + shared_mic within ~6s of mount, page
// gone by 10s. These four events must have been flushed.
check('four mount events at 6s flush early',
  shouldFlushEarly({ eventCount: 4, lastFlushedCount: 0, msSinceMount: 6_000 }));
check('one event at 2s flushes early',
  shouldFlushEarly({ eventCount: 1, lastFlushedCount: 0, msSinceMount: 2_000 }));

// Nothing new → never post.
check('no new events → no flush',
  !shouldFlushEarly({ eventCount: 4, lastFlushedCount: 4, msSinceMount: 6_000 }));
check('zero events → no flush',
  !shouldFlushEarly({ eventCount: 0, lastFlushedCount: 0, msSinceMount: 6_000 }));

// Past the early window the ordinary 30s interval owns the cadence; this
// must not add a second timer's worth of traffic to a long session.
check('after the early window, no early flush',
  !shouldFlushEarly({ eventCount: 900, lastFlushedCount: 100, msSinceMount: 15 * 60_000 }));

// At-most-once semantics inside the window: a second call with nothing new
// must not re-post.
check('idempotent inside the window',
  !shouldFlushEarly({ eventCount: 7, lastFlushedCount: 7, msSinceMount: 9_000 }));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
