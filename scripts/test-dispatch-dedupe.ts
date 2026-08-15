/**
 * Perception dispatch deduper.
 *
 * Regression under test: session-1783615623994 (2026-07-09) — two
 * perception direct-dispatches for the same utterance landed 2.05s
 * apart (post-reconnect re-emission); the first ran, the second queued
 * behind the busy brain and drained as a SECOND reply — which
 * re-introduced the tutor. Perception dispatch paths bypass the
 * production-WS dedupe by design, so they need their own short
 * exact-text window.
 *
 * Run: npx tsx scripts/test-dispatch-dedupe.ts
 */
import { DispatchDeduper } from '../apps/marketing/src/lib/tutor/voice/dispatch-dedupe';

let failures = 0;
function check(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

{
  const d = new DispatchDeduper();
  const t0 = 1_000_000;
  check('first dispatch allowed', d.shouldDispatch('I want to do assumptions today.', t0), true);
  check('same text 2s later is a duplicate', d.shouldDispatch('I want to do assumptions today.', t0 + 2_000), false);
  check('same text with punct/case drift is still a duplicate', d.shouldDispatch('i want to do assumptions today', t0 + 3_000), false);
  check('different text inside the window is allowed', d.shouldDispatch('Give me a practice problem.', t0 + 3_500), true);
  check('same text after the window is allowed (legit repeat)', d.shouldDispatch('I want to do assumptions today.', t0 + 20_000), true);
}

{
  // A duplicate must NOT extend the window (else a steady trickle of
  // re-emissions could suppress a genuine later repeat forever).
  const d = new DispatchDeduper();
  const t0 = 2_000_000;
  d.shouldDispatch('yes', t0);
  d.shouldDispatch('yes', t0 + 3_000); // duplicate, dropped
  check('window anchored to the ACCEPTED dispatch, not the duplicate', d.shouldDispatch('yes', t0 + 7_000), true);
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll dispatch-dedupe checks passed.');
