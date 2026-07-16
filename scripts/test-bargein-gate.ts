/**
 * Unit test for the sustained-energy barge-in gate
 * (src/lib/tutor/voice/bargein-gate.ts). Task V1 — layer 1 of the echo fix.
 *
 * Covers the four required cases:
 *   - 150ms echo blip DURING 'speaking' → NO kill (self-echo defended)
 *   - 450ms sustained speech during 'speaking' → kill (real barge-in works)
 *   - onset while NOT 'speaking' → instant path (gate bypassed, no frames needed)
 *   - boundary at exactly 400ms → kill; just under → no kill
 * Plus: added barge-in latency ≤ the sustain constant (the boundary proves it).
 *
 * Run: npm run test:bargein-gate
 * No framework — matches test:kill-keep / test:cancel-storm. Pure.
 */

import { strict as assert } from 'node:assert';
import { shouldFireBargeInKill, type BargeInFrame } from '../src/lib/tutor/voice/bargein-gate';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const THRESHOLD = 0.15;   // "voice present" on the scaled 0..1 mic level
const SUSTAIN = 400;      // BARGEIN_SUSTAIN_MS default
const FRAME_MS = 80;      // ~ the perception ScriptProcessor cadence

/** Frames every FRAME_MS from `start`..`end` (inclusive) at `energy`. */
function frames(start: number, end: number, energy: number): BargeInFrame[] {
  const out: BargeInFrame[] = [];
  for (let t = start; t <= end + 1e-6; t += FRAME_MS) out.push({ tMs: t, energy });
  return out;
}

const LOUD = 0.6;   // clearly above threshold (mid-range speech)
const QUIET = 0.02; // near-silent ambient floor

function main() {
  console.log('Sustained-energy barge-in gate — shouldFireBargeInKill\n');

  test('150ms echo blip during speaking → NO kill', () => {
    // Loud for the first ~150ms, then silence. Evaluated at 400ms.
    const blip = [...frames(0, 150, LOUD), ...frames(160, 400, QUIET)];
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 400,
      frames: blip, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'a short self-echo blip must not kill the tutor');
  });

  test('450ms sustained speech during speaking → kill', () => {
    const speech = frames(0, 450, LOUD);
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 450,
      frames: speech, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'a sustained genuine barge-in must kill');
  });

  test('onset while NOT speaking (processing) → instant path, gate bypassed', () => {
    // No frames at all — the instant path must not depend on the energy window.
    const fire = shouldFireBargeInKill({
      state: 'processing', speechStartMs: 0, nowMs: 0,
      frames: [], energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, "non-'speaking' states keep today's instant kill");
  });

  test('onset while listening/idle → instant path too', () => {
    for (const state of ['listening', 'idle', 'connecting', 'connected']) {
      const fire = shouldFireBargeInKill({
        state, speechStartMs: 0, nowMs: 0,
        frames: [], energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
      });
      assert.equal(fire, true, `state='${state}' must bypass the gate`);
    }
  });

  test('boundary: exactly 400ms of sustained energy → kill', () => {
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 400,
      frames: frames(0, 400, LOUD), energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'run of exactly sustainMs fires (>=)');
  });

  test('boundary: just under 400ms → NO kill', () => {
    // Run continuous but only 360ms long, evaluated at 360ms.
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 360,
      frames: frames(0, 360, LOUD), energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'under sustainMs must not fire');
  });

  test('added barge-in latency ≤ sustain constant (fires no earlier than, and by, sustainMs)', () => {
    // Continuous loud speech from onset. Sweep evaluation time; the kill must
    // NOT fire before sustainMs and MUST fire by sustainMs — i.e. the extra
    // latency a genuine barge-in pays is exactly bounded by the sustain window.
    const speech = frames(0, 1000, LOUD);
    for (let now = 0; now < SUSTAIN; now += 20) {
      assert.equal(
        shouldFireBargeInKill({ state: 'speaking', speechStartMs: 0, nowMs: now, frames: speech, energyThreshold: THRESHOLD, sustainMs: SUSTAIN }),
        false, `must not fire early at now=${now}ms`);
    }
    assert.equal(
      shouldFireBargeInKill({ state: 'speaking', speechStartMs: 0, nowMs: SUSTAIN, frames: speech, energyThreshold: THRESHOLD, sustainMs: SUSTAIN }),
      true, 'fires by exactly sustainMs → added latency ≤ sustain constant');
  });

  test('brief blip then real sustained speech → kill (recovers, run measured trailing)', () => {
    // A 100ms echo blip, a gap, then the student speaks continuously for 450ms.
    const mixed = [
      ...frames(0, 100, LOUD),      // echo blip
      ...frames(120, 300, QUIET),   // silence
      ...frames(320, 800, LOUD),    // real barge-in
    ];
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 800,
      frames: mixed, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'the trailing sustained run (320..800) fires');
  });

  test('stale window (mic went silent, no fresh frames) → NO kill', () => {
    // Loud run 0..450 but evaluated much later with no frames since → not live.
    const stale = frames(0, 450, LOUD);
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 2000,
      frames: stale, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'a stale latest frame is not a live barge-in');
  });

  test('sustained energy but below threshold (ambient hum) → NO kill', () => {
    const hum = frames(0, 800, THRESHOLD - 0.01);
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 800,
      frames: hum, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'below-threshold energy never counts as voice');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
