/**
 * Cancel-storm governor (perception stage2/3 barge-in cancels).
 *
 * Regression under test: session-1783615559112 (2026-07-09) — the
 * student, hearing silence, re-spoke every few seconds; each
 * speech_started fired a stage2/3 cancel that aborted the nascent
 * recovery reply, so no turn ever completed (livelock). The reply
 * finally landed 4s after the student had left. The governor caps
 * cancels in a rolling window: once the cap is hit, further cancels
 * are suppressed so the in-flight reply plays out and later student
 * transcripts queue normally behind it.
 *
 * Run: npx tsx scripts/test-cancel-storm.ts
 */
import { CancelStormGovernor } from '../apps/marketing/src/lib/tutor/voice/cancel-storm';

let failures = 0;
function check(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

{
  // Livelock case: three rapid re-speaks. First two cancels allowed,
  // third suppressed.
  const g = new CancelStormGovernor();
  const t0 = 1_000_000;
  check('1st cancel allowed', g.allowCancel(t0), true);
  g.recordCancel(t0);
  check('2nd cancel allowed', g.allowCancel(t0 + 8_000), true);
  g.recordCancel(t0 + 8_000);
  check('3rd cancel within window suppressed', g.allowCancel(t0 + 16_000), false);
}

{
  // Legit sparse barge-ins: one interruption a minute stays allowed.
  const g = new CancelStormGovernor();
  const t0 = 2_000_000;
  g.recordCancel(t0);
  g.recordCancel(t0 + 60_000);
  check('cancels a minute apart never suppressed', g.allowCancel(t0 + 120_000), true);
}

{
  // Window expiry: after the rolling window passes, cancels are allowed again.
  const g = new CancelStormGovernor();
  const t0 = 3_000_000;
  g.recordCancel(t0);
  g.recordCancel(t0 + 1_000);
  check('suppressed right after two rapid cancels', g.allowCancel(t0 + 2_000), false);
  check('allowed again once the window has passed', g.allowCancel(t0 + 50_000), true);
}

{
  // A delivered tutor turn (audio fully played) proves the loop is not
  // a livelock — history resets so the student can barge in again.
  const g = new CancelStormGovernor();
  const t0 = 4_000_000;
  g.recordCancel(t0);
  g.recordCancel(t0 + 5_000);
  check('suppressed during storm', g.allowCancel(t0 + 10_000), false);
  g.recordDelivery();
  check('allowed after a delivered turn resets history', g.allowCancel(t0 + 11_000), true);
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll cancel-storm checks passed.');
