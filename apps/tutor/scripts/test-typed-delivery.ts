/**
 * Typed-message delivery when the realtime socket is not open
 * (src/lib/tutor/voice/typed-delivery.ts) + the stalled-opener retry
 * (src/lib/tutor/voice/brain-stall.ts shouldRetryStalledOpener).
 *
 * Why it exists (2026-10-08, live text-mode partner session): the opening
 * request stalled (`brain_stall_abort` at 24.6 s, spoke=false) and the
 * fallback card rendered. The student typed at 33.9 s; the message was
 * appended to the transcript and no tutor turn ever ran — the realtime
 * socket was still waiting on its token, so the hook parked the message for
 * an `onopen` that never came (62.6 s: "Invalid token response: missing
 * client_secret"). A text session needs that socket for nothing.
 *
 * Run: npx tsx scripts/test-typed-delivery.ts  (npm run test:typed-delivery)
 * No framework — matches test:brain-stall / test:ws-recovery. Pure.
 */

import { strict as assert } from 'node:assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  decideTypedDelivery,
  canSubmitTyped,
  shouldSurfaceRealtimeError,
  describeTokenFailure,
  TYPED_QUEUE_MAX,
  REALTIME_CONNECT_ERROR_NAME,
} from '../src/lib/tutor/voice/typed-delivery';
import { shouldRetryStalledOpener } from '../src/lib/tutor/voice/brain-stall';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// ── where a typed message goes ──────────────────────────────────────────
const closedText = { socketOpen: false, textMode: true, relayActive: true, parkedCount: 0 };
test('text mode + brain relay, socket closed ⇒ relayed to the brain, not parked', () => {
  assert.equal(decideTypedDelivery(closedText), 'relay');
});
test('…however full the parked queue is (it is never used on this path)', () => {
  assert.equal(decideTypedDelivery({ ...closedText, parkedCount: TYPED_QUEUE_MAX }), 'relay');
});
test('voice mode, socket closed ⇒ parked as before', () => {
  assert.equal(decideTypedDelivery({ ...closedText, textMode: false }), 'park');
});
test('voice mode, socket closed, queue full ⇒ dropped as before', () => {
  assert.equal(decideTypedDelivery({ ...closedText, textMode: false, parkedCount: TYPED_QUEUE_MAX }), 'drop');
});
test('text mode WITHOUT the brain relay, socket closed ⇒ parked (the socket authors the reply)', () => {
  assert.equal(decideTypedDelivery({ ...closedText, relayActive: false }), 'park');
});
test('socket open ⇒ the existing send path, every mode', () => {
  for (const textMode of [true, false]) for (const relayActive of [true, false]) {
    assert.equal(decideTypedDelivery({ socketOpen: true, textMode, relayActive, parkedCount: 3 }), 'send');
  }
});

// ── no double delivery ──────────────────────────────────────────────────
// The hook's queue, modelled: a message is parked only on 'park', and the
// socket's onopen re-sends exactly what was parked.
function run(mode: { textMode: boolean; relayActive: boolean }, messages: string[]) {
  const parked: string[] = [];
  const delivered: string[] = [];
  const send = (text: string, socketOpen: boolean) => {
    const d = decideTypedDelivery({ socketOpen, ...mode, parkedCount: parked.length });
    if (d === 'park') parked.push(text);
    else if (d !== 'drop') delivered.push(text);
  };
  for (const m of messages) send(m, false);
  const beforeOpen = [...delivered];
  for (const m of parked.splice(0)) send(m, true); // ws.onopen flush
  return { beforeOpen, delivered, parked };
}
test('text mode: relayed while closed, and the socket opening later delivers nothing again', () => {
  const r = run({ textMode: true, relayActive: true }, ['x = 4', 'is that right?']);
  assert.deepEqual(r.beforeOpen, ['x = 4', 'is that right?']);
  assert.deepEqual(r.delivered, ['x = 4', 'is that right?'], 'each message exactly once');
});
test('voice mode: nothing delivered while closed, each parked message once on open', () => {
  const r = run({ textMode: false, relayActive: true }, ['x = 4', 'is that right?']);
  assert.deepEqual(r.beforeOpen, []);
  assert.deepEqual(r.delivered, ['x = 4', 'is that right?']);
  assert.equal(r.parked.length, 0);
});

// ── the composer + the error banner ─────────────────────────────────────
test('text mode + relay: the composer submits whatever the socket state', () => {
  assert.equal(canSubmitTyped({ isConnected: false, textMode: true, relayActive: true }), true);
});
test('voice mode (and text without relay): the composer still waits for the connection', () => {
  assert.equal(canSubmitTyped({ isConnected: false, textMode: false, relayActive: true }), false);
  assert.equal(canSubmitTyped({ isConnected: false, textMode: true, relayActive: false }), false);
  assert.equal(canSubmitTyped({ isConnected: true, textMode: false, relayActive: true }), true);
});
test('text mode + relay: a failed realtime connect is not a blocking error', () => {
  assert.equal(shouldSurfaceRealtimeError({ errorName: REALTIME_CONNECT_ERROR_NAME, textMode: true, relayActive: true }), false);
});
test('voice mode: a failed realtime connect surfaces as before; so does any other error in text mode', () => {
  assert.equal(shouldSurfaceRealtimeError({ errorName: REALTIME_CONNECT_ERROR_NAME, textMode: false, relayActive: true }), true);
  assert.equal(shouldSurfaceRealtimeError({ errorName: REALTIME_CONNECT_ERROR_NAME, textMode: true, relayActive: false }), true);
  assert.equal(shouldSurfaceRealtimeError({ errorName: 'Error', textMode: true, relayActive: true }), true);
});
test('token error names the real failure; unknown ⇒ the old message', () => {
  assert.equal(describeTokenFailure('HTTP 429'), 'Failed to get realtime token: HTTP 429');
  assert.equal(describeTokenFailure(null), 'Invalid token response: missing client_secret');
  assert.equal(describeTokenFailure('  '), 'Invalid token response: missing client_secret');
});

// ── the stalled opener ──────────────────────────────────────────────────
const stalledOpener = { stalled: true, nothingShown: true, transcript: '[start lesson]', retryUsed: false };
test('recorded: opener stalled, nothing spoken ⇒ retry', () => {
  assert.equal(shouldRetryStalledOpener(stalledOpener), true);
});
test('the retry stalled too ⇒ no second retry (the fallback opener stands)', () => {
  assert.equal(shouldRetryStalledOpener({ ...stalledOpener, retryUsed: true }), false);
});
test('stall after speech started ⇒ no retry', () => {
  assert.equal(shouldRetryStalledOpener({ ...stalledOpener, nothingShown: false }), false);
});
test('not a stall ⇒ not this retry (the network-failure retry owns that)', () => {
  assert.equal(shouldRetryStalledOpener({ ...stalledOpener, stalled: false }), false);
});
test('the planless opener is an opener too; a student turn or another runtime dispatch is not', () => {
  assert.equal(shouldRetryStalledOpener({ ...stalledOpener, transcript: '[start session]' }), true);
  assert.equal(shouldRetryStalledOpener({ ...stalledOpener, transcript: 'x = 4' }), false);
  assert.equal(shouldRetryStalledOpener({ ...stalledOpener, transcript: '[Skip-button-clicked: advance]' }), false);
});

// ── wiring ──────────────────────────────────────────────────────────────
const root = join(__dirname, '..', 'src/app/tutor');
const hook = readFileSync(join(root, 'hooks/useOpenAIRealtime.ts'), 'utf8');
const vtr = readFileSync(join(root, 'components/VoiceTutorRealtime.tsx'), 'utf8');
test('wiring: sendTextMessage routes through decideTypedDelivery and parks only on park', () => {
  assert.ok(hook.includes('const delivery = decideTypedDelivery({'));
  assert.ok(hook.includes("if (delivery === 'park') {"));
  assert.equal(hook.split('pendingTypedRef.current.push(').length - 1, 1, 'one park site');
});
test('wiring: the token error carries the recorded failure; a connect failure is named', () => {
  assert.ok(hook.includes('throw new Error(describeTokenFailure(tokenFailureRef.current))'));
  assert.ok(hook.includes('error.name = REALTIME_CONNECT_ERROR_NAME;'));
});
test('wiring: the composer gate and the error banner use the text-mode decisions', () => {
  assert.ok(vtr.includes('if (text && canSubmitTyped({ isConnected: realtime.isConnected,'));
  assert.ok(vtr.includes('if (!shouldSurfaceRealtimeError({ errorName: error.name,'));
});
test('wiring: the stalled opener retry shares the single-use opener guard', () => {
  assert.ok(vtr.includes('shouldRetryStalledOpener({'));
  assert.ok(vtr.includes("onDebugEvent?.('opener_stall_retry',"));
  assert.equal(vtr.split('openerRetryUsedRef.current = true').length - 1, 2, 'network retry + stall retry, one guard');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
