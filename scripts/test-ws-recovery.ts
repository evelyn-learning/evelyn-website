/**
 * WS error-surfacing + foreground-reconnect decisions (round-7 item 3).
 *
 * Regression under test: session portal-b2fe010e (2026-07-28) — on app
 * foreground the Ink2 socket was dead; ws.onerror surfaced 'WebSocket
 * connection error' / 'Ink2 WS error' to the user BEFORE onclose ran the
 * reconnect ladder, which then recovered within ~1s (disabled →
 * connecting → connected → listening). The banner stuck while TTS kept
 * talking. Separately: the 3-attempt ladder can burn out while the tab
 * is backgrounded (throttled timers, no network) and nothing ever
 * re-arms it on foreground → permanently 'degraded'.
 *
 * Run: npx tsx scripts/test-ws-recovery.ts
 */
import { shouldSurfaceWsError, shouldReconnectOnForeground } from '../apps/marketing/src/lib/tutor/voice/ws-recovery';

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

// --- shouldSurfaceWsError ------------------------------------------------

// The b2fe010e case: reconnect machinery owns recovery → onerror stays silent.
check(
  'reconnect enabled → suppress (onclose ladder owns recovery)',
  shouldSurfaceWsError({ intentionallyDisconnected: false, reconnectEnabled: true }),
  false,
);
// Frozen behavior when the reconnect flag is off: surface as before.
check(
  'reconnect disabled → surface (frozen dead-end behavior)',
  shouldSurfaceWsError({ intentionallyDisconnected: false, reconnectEnabled: false }),
  true,
);
// Session teardown races can fire a late error event — never surface those.
check(
  'intentional disconnect → suppress even with reconnect off',
  shouldSurfaceWsError({ intentionallyDisconnected: true, reconnectEnabled: false }),
  false,
);
check(
  'intentional disconnect + reconnect on → suppress',
  shouldSurfaceWsError({ intentionallyDisconnected: true, reconnectEnabled: true }),
  false,
);

// --- shouldReconnectOnForeground -----------------------------------------

const base = {
  visible: true,
  intentionallyDisconnected: false,
  everConnected: true,
  wsReadyState: null as number | null, // onclose ran → wsRef nulled
  reconnectTimerPending: false,
};

// The background-burn case: ladder exhausted while hidden, socket gone.
check(
  'foreground + dead socket (no ws) → reconnect',
  shouldReconnectOnForeground(base),
  true,
);
check(
  'foreground + CLOSED socket → reconnect',
  shouldReconnectOnForeground({ ...base, wsReadyState: WS_CLOSED }),
  true,
);
check(
  'foreground + CLOSING socket → reconnect',
  shouldReconnectOnForeground({ ...base, wsReadyState: WS_CLOSING }),
  true,
);
// Healthy or already-recovering sockets must be left alone.
check(
  'OPEN socket → no action',
  shouldReconnectOnForeground({ ...base, wsReadyState: WS_OPEN }),
  false,
);
check(
  'CONNECTING socket → no action (handshake in flight)',
  shouldReconnectOnForeground({ ...base, wsReadyState: WS_CONNECTING }),
  false,
);
check(
  'backoff timer pending → no action (it will fire now that timers unthrottle)',
  shouldReconnectOnForeground({ ...base, reconnectTimerPending: true }),
  false,
);
// Guards: never fire before the session ever connected, after intentional
// teardown, or while hidden.
check(
  'never connected → no action (session not started yet)',
  shouldReconnectOnForeground({ ...base, everConnected: false }),
  false,
);
check(
  'intentional disconnect → no action',
  shouldReconnectOnForeground({ ...base, intentionallyDisconnected: true }),
  false,
);
check(
  'not visible → no action',
  shouldReconnectOnForeground({ ...base, visible: false }),
  false,
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll ws-recovery checks passed.');
