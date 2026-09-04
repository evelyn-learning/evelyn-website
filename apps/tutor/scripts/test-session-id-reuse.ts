/**
 * portal-85b2c632 holds three days of three different sessions because the
 * partner minted 2026-09-04 embed tokens carrying a 2026-09-01 session_id.
 *
 * ⚠️ A `true` verdict means "LOG IT", not "REFUSE IT". The session-usage route
 * writes a loud console.error on a true verdict and then performs the write
 * anyway. It must never gate the write: conversation resume has a THIRTY-DAY
 * window (RESUME_MAX_AGE_MS) and writes back to the SAME sessionId, so a
 * multi-day document is ALSO what a working resume produces — refusing it
 * silently destroyed the student's whole sitting, lessonProgress checkpoint
 * included. The pure module's contract is unchanged; only the route's response
 * to a true verdict is. The cases below therefore pin what the module SAYS,
 * never what the route does with it.
 *
 * Usage: npx tsx scripts/test-session-id-reuse.ts  (npm run test:session-id-reuse)
 */
import { isStaleSessionReuse, SESSION_REUSE_MAX_AGE_MS } from '../src/lib/tutor/portal/session-id-reuse';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const NOW = new Date('2026-09-04T00:33:18Z');

// ─── the live case ───
check('portal-85b2c632: a 2026-09-01 doc reused on 2026-09-04 is stale',
  isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-01T02:10:13Z'), now: NOW }));
check('portal-60dcca1d: 2026-08-31 doc written on 2026-09-04 is stale',
  isStaleSessionReuse({ existingCreatedAt: new Date('2026-08-31T23:48:24Z'), now: NOW }));
check('string dates are accepted',
  isStaleSessionReuse({ existingCreatedAt: '2026-09-01T02:10:13Z', now: NOW }));

// ─── legitimate resumes must NOT be refused ───
check('a same-session reconnect 3 minutes later is fine',
  !isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-04T00:30:00Z'), now: NOW }));
check('a 90-minute session is fine',
  !isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-03T23:03:18Z'), now: NOW }));
check('a reload 4 hours into a long sitting is fine',
  !isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-03T20:33:18Z'), now: NOW }));

// ─── the blind spot this suite used to have ───
// Every "legitimate" case above topped out at FOUR hours, so all of them were
// inside the 12h window by construction and the suite could never have caught
// the route refusing a real overnight resume. A student resuming the next
// morning is well inside RESUME_MAX_AGE_MS (30 days) and IS reported stale
// here — which is correct for a DETECTOR and catastrophic for a GATE. Pinned
// so the distinction cannot quietly regress back into a 409.
check('an overnight resume ~26h later IS reported stale (log it, never refuse it)',
  isStaleSessionReuse({ existingCreatedAt: new Date('2026-09-02T22:33:18Z'), now: NOW }));

// ─── a brand-new session has no existing doc ───
check('no existing doc → not reuse',
  !isStaleSessionReuse({ existingCreatedAt: null, now: NOW }));
check('undefined → not reuse',
  !isStaleSessionReuse({ existingCreatedAt: undefined, now: NOW }));
check('unparseable date → not reuse (fail closed)',
  !isStaleSessionReuse({ existingCreatedAt: 'not-a-date', now: NOW }));

check('the window is longer than any plausible single sitting',
  SESSION_REUSE_MAX_AGE_MS >= 6 * 3_600_000, `${SESSION_REUSE_MAX_AGE_MS}`);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
