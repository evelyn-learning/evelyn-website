/**
 * Transcription-watchdog recovery decision (perception WS).
 *
 * Regression under test: session-1783615559112 (2026-07-09) — Whisper
 * hung on a HEALTHY (readyState OPEN) socket, the old watchdog only
 * recovered when the socket was already non-OPEN, so the student's
 * utterance produced a 27s dead gap and no reply. The watchdog must
 * force a reconnect on ANY hang unless the disconnect was intentional.
 *
 * Run: npx tsx scripts/test-perception-watchdog.ts
 */
import { shouldForceReconnectOnWatchdog } from '../apps/marketing/src/lib/tutor/voice/perception-watchdog';

const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

let failures = 0;
function check(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

// The production bug: transcription hangs while the socket is OPEN.
check(
  'OPEN socket + hang → force reconnect (the session-1783615559112 case)',
  shouldForceReconnectOnWatchdog({ hasSocket: true, readyState: WS_OPEN, intentionallyDisconnected: false }),
  true,
);

// Old behavior preserved: dead socket also recovers.
check(
  'CLOSED socket → force reconnect',
  shouldForceReconnectOnWatchdog({ hasSocket: true, readyState: WS_CLOSED, intentionallyDisconnected: false }),
  true,
);
check(
  'CLOSING socket → force reconnect',
  shouldForceReconnectOnWatchdog({ hasSocket: true, readyState: WS_CLOSING, intentionallyDisconnected: false }),
  true,
);
check(
  'CONNECTING socket → no action (handshake still in flight, closing would race it)',
  shouldForceReconnectOnWatchdog({ hasSocket: true, readyState: WS_CONNECTING, intentionallyDisconnected: false }),
  false,
);

// Intentional teardown (session end / disable) must never trigger recovery.
check(
  'intentional disconnect → never reconnect',
  shouldForceReconnectOnWatchdog({ hasSocket: true, readyState: WS_OPEN, intentionallyDisconnected: true }),
  false,
);

// No socket at all → nothing to close; onclose already ran and owns reconnect.
check(
  'no socket → no action',
  shouldForceReconnectOnWatchdog({ hasSocket: false, readyState: WS_CLOSED, intentionallyDisconnected: false }),
  false,
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll perception-watchdog checks passed.');
