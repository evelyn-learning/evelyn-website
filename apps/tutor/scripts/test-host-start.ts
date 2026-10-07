/**
 * Host-driven pre-load and start (GameClass spec v1.1 §3): pure helpers in
 * lib/tutor/portal/host-start.ts, plus source scans proving the embed page
 * and VTR wire them (prewarm holds the mic, evelyn:start runs the Start path).
 *
 * Run: npm run test:host-start
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  PREWARM_IDLE_MS,
  decideHostStart,
  isAutoplayBlocked,
  isPrewarmParam,
  isTokenExpired,
  parseHostStart,
  prewarmIdleAction,
  tokenExpSec,
} from '../src/lib/tutor/portal/host-start';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const NOW = 1_800_000_000_000;
const base = { hostStartAccepted: false, sessionStarted: false, ending: false, nowMs: NOW };

test('prewarm param: 1 / true only', () => {
  assert.equal(isPrewarmParam('1'), true);
  assert.equal(isPrewarmParam('true'), true);
  for (const v of [null, undefined, '', '0', 'false', 'yes']) assert.equal(isPrewarmParam(v), false, String(v));
});

test('parseHostStart: exact type only', () => {
  assert.equal(parseHostStart({ type: 'evelyn:start' }), true);
  assert.equal(parseHostStart({ type: 'evelyn:start', extra: 1 }), true);
  for (const d of [null, undefined, 'evelyn:start', ['evelyn:start'], { type: 'evelyn:host_end' }, { type: 'evelyn:Start' }, {}]) {
    assert.equal(parseHostStart(d), null, JSON.stringify(d));
  }
});

test('decideHostStart: accepted once, ignored after any start or end', () => {
  assert.deepEqual(decideHostStart(base), { accept: true });
  assert.deepEqual(decideHostStart({ ...base, hostStartAccepted: true }), { accept: false, why: 'already_started' });
  assert.deepEqual(decideHostStart({ ...base, sessionStarted: true }), { accept: false, why: 'already_started' });
  assert.deepEqual(decideHostStart({ ...base, ending: true }), { accept: false, why: 'ending' });
});

test('decideHostStart: expired token refused, missing exp allowed', () => {
  assert.deepEqual(decideHostStart({ ...base, tokenExpSec: NOW / 1000 - 1 }), { accept: false, why: 'token_expired' });
  assert.deepEqual(decideHostStart({ ...base, tokenExpSec: NOW / 1000 + 60 }), { accept: true });
  assert.deepEqual(decideHostStart({ ...base, tokenExpSec: undefined }), { accept: true });
});

test('tokenExpSec: numeric positive exp only', () => {
  assert.equal(tokenExpSec({ exp: 123 }), 123);
  for (const p of [null, {}, { exp: '123' }, { exp: -1 }, { exp: NaN }, { exp: 0 }]) assert.equal(tokenExpSec(p), undefined);
  assert.equal(isTokenExpired(undefined, NOW), false);
  assert.equal(isTokenExpired(NOW / 1000, NOW), true);
});

test('prewarm idle: reload while the token is valid, else expired', () => {
  assert.equal(PREWARM_IDLE_MS, 30 * 60 * 1000);
  assert.equal(prewarmIdleAction(undefined, NOW), 'reload');
  assert.equal(prewarmIdleAction(NOW / 1000 + 3600, NOW), 'reload');
  assert.equal(prewarmIdleAction(NOW / 1000 - 1, NOW), 'expired');
});

test('autoplay: only a running probe counts as allowed; no AudioContext is not a block', () => {
  assert.equal(isAutoplayBlocked('running'), false);
  assert.equal(isAutoplayBlocked('unavailable'), false);
  assert.equal(isAutoplayBlocked('suspended'), true);
  assert.equal(isAutoplayBlocked('closed'), true);
});

// ── Wiring (source scans) ──
const root = join(__dirname, '..');
const embed = readFileSync(join(root, 'src/app/tutor-portal/embed/page.tsx'), 'utf8');
const vtr = readFileSync(join(root, 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const session = readFileSync(join(root, 'src/app/tutor/components/session/TutorSession.tsx'), 'utf8');
const flags = readFileSync(join(root, 'src/lib/tutor/orchestrator/flags.ts'), 'utf8');

test('flag NEXT_PUBLIC_TUTOR_HOST_START defaults ON', () => {
  assert.match(flags, /TUTOR_HOST_START = process\.env\.NEXT_PUBLIC_TUTOR_HOST_START !== 'off'/);
});

test('embed: prewarm read from the query behind the flag and passed down', () => {
  assert.match(embed, /isPrewarmParam\(searchParams\.get\('prewarm'\)\)/);
  assert.match(embed, /TUTOR_HOST_START/);
  assert.match(embed, /prewarm=\{prewarm\}/);
  assert.match(session, /prewarm=\{prewarm\}/);
});

test('embed: evelyn:start is parent-only, origin-checked, decided once, and runs startSession', () => {
  const i = embed.indexOf('parseHostStart(event.data)');
  assert.ok(i > 0, 'parseHostStart wired');
  const block = embed.slice(Math.max(0, i - 800), i + 2500);
  assert.match(block, /event\.source !== window\.parent/);
  assert.match(block, /isAllowedHostOrigin\(event\.origin, expectedOrigin\)/);
  assert.match(embed, /decideHostStart\(/);
  assert.match(embed, /\.startSession\(\)/);
  assert.match(embed, /'host_start_ignored'/);
});

test('embed: posts evelyn:ready and evelyn:start_blocked; autoplay fallback tap', () => {
  assert.match(embed, /type: 'evelyn:ready'/);
  assert.match(embed, /type: 'evelyn:start_blocked', reason/);
  assert.match(embed, /Tap to hear your tutor/);
  assert.match(embed, /isAutoplayBlocked\(/);
});

test('embed: new telemetry events persist', () => {
  for (const e of ['prewarm_', 'host_start']) assert.ok(embed.includes(`'${e}'`), e);
});

test('VTR: prewarm holds the microphone until the session starts', () => {
  assert.match(vtr, /prewarm\?: boolean/);
  assert.match(vtr, /const prewarmMicHold = prewarm && !hasStartedRef\.current/);
  assert.match(vtr, /const perceptionEnabled = [^;]*!prewarmMicHold/);
});

test('VTR: relay readiness reaches the page (onRelayReady)', () => {
  assert.match(vtr, /onRelayReady\?: \(\) => void/);
  assert.ok(vtr.includes("onRelayReadyRef.current?.()"), "onRelayReady fired");
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
