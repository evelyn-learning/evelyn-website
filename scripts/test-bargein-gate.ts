/**
 * Unit test for the sustained-energy barge-in gate
 * (src/lib/tutor/voice/bargein-gate.ts). Task V1 — layer 1 of the echo fix.
 *
 * Covers the four required cases:
 *   - 150ms echo blip DURING 'speaking' → NO kill (self-echo defended)
 *   - 450ms sustained speech during 'speaking' → kill (real barge-in works)
 *   - onset while NOT 'speaking' → instant path (gate bypassed, no frames needed)
 *   - boundary at exactly BARGEIN_SUSTAIN_MS → kill; just under → no kill
 * Plus: added barge-in latency ≤ the sustain constant (the boundary proves it).
 *
 * Run: npm run test:bargein-gate
 * No framework — matches test:kill-keep / test:cancel-storm. Pure.
 */

import { strict as assert } from 'node:assert';
import {
  shouldFireBargeInKill,
  shouldFireDeferredBargeInKill,
  shouldDrainAfterOrphanedFetch,
  shouldFireSpeakingWatchdog,
  type BargeInFrame,
} from '../src/lib/tutor/voice/bargein-gate';
import { BARGEIN_SUSTAIN_MS } from '../src/lib/tutor/orchestrator/flags';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const THRESHOLD = 0.15;   // "voice present" on the scaled 0..1 mic level
const SUSTAIN = BARGEIN_SUSTAIN_MS; // Read from flags.ts
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
    // Loud for the first ~150ms, then silence. Evaluated at SUSTAIN ms.
    const blip = [...frames(0, 150, LOUD), ...frames(160, SUSTAIN, QUIET)];
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: SUSTAIN,
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

  test('boundary: exactly sustainMs of sustained energy → kill', () => {
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: SUSTAIN,
      frames: frames(0, SUSTAIN, LOUD), energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'run of exactly sustainMs fires (>=)');
  });

  test('boundary: just under sustainMs → NO kill', () => {
    // Run continuous but only (SUSTAIN - 40)ms long, evaluated at that time.
    const justUnder = SUSTAIN - 40;
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: justUnder,
      frames: frames(0, justUnder, LOUD), energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
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

  // ── Task X3: Ink2 time-based deferred-kill variant (no energy window) ──
  // The Ink2 STT path exposes no per-frame energy, so the sustain gate is
  // measured purely by TIME between VAD events. This is the decision the
  // deferred-kill timer evaluates AT EXPIRY (speech_stopped disarms the timer,
  // so speechStopped is false whenever the callback actually runs — but the
  // predicate encodes the full semantics and is tested for all inputs).
  console.log('\nTime-based deferred barge-in gate — shouldFireDeferredBargeInKill\n');

  test('deferred: sustained through the window while speaking → kill', () => {
    // Timer reached BARGEIN_SUSTAIN_MS, tutor still speaking, no speech_stopped.
    const fire = shouldFireDeferredBargeInKill({
      state: 'speaking', speechStopped: false, elapsedMs: SUSTAIN, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'a sustained barge-in on the Ink2 path must kill');
  });

  test('deferred: speech_stopped before the window (echo blip) → NO kill', () => {
    // The 264ms self-echo from the live capture ends before SUSTAIN (350ms).
    // In wiring this disarms the timer; the predicate must also refuse it.
    const fire = shouldFireDeferredBargeInKill({
      state: 'speaking', speechStopped: true, elapsedMs: SUSTAIN, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'a stopped (echo-blip) utterance must never kill');
  });

  test('deferred: tutor no longer speaking at expiry → NO kill', () => {
    // TTS finished naturally during the window — nothing left to interrupt.
    for (const state of ['listening', 'processing', 'connected', 'idle']) {
      const fire = shouldFireDeferredBargeInKill({
        state, speechStopped: false, elapsedMs: SUSTAIN, sustainMs: SUSTAIN,
      });
      assert.equal(fire, false, `state='${state}' at expiry must not kill`);
    }
  });

  test('deferred: elapsed just under the window → NO kill', () => {
    const fire = shouldFireDeferredBargeInKill({
      state: 'speaking', speechStopped: false, elapsedMs: SUSTAIN - 1, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'under sustainMs must not fire (>= boundary)');
  });

  test('deferred: exactly the window → kill (boundary, >=)', () => {
    const fire = shouldFireDeferredBargeInKill({
      state: 'speaking', speechStopped: false, elapsedMs: SUSTAIN, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'elapsed == sustainMs fires');
  });

  test('deferred: added barge-in latency bounded by the sustain constant', () => {
    // Never fires before sustainMs; fires by sustainMs. Same latency budget as
    // the energy gate — a genuine Ink2 barge-in pays at most BARGEIN_SUSTAIN_MS.
    for (let t = 0; t < SUSTAIN; t += 20) {
      assert.equal(
        shouldFireDeferredBargeInKill({ state: 'speaking', speechStopped: false, elapsedMs: t, sustainMs: SUSTAIN }),
        false, `must not fire early at elapsed=${t}ms`);
    }
    assert.equal(
      shouldFireDeferredBargeInKill({ state: 'speaking', speechStopped: false, elapsedMs: SUSTAIN, sustainMs: SUSTAIN }),
      true, 'fires by exactly sustainMs');
  });

  // ── Task X3 fix-wave (review finding 2): orphaned-fetch drain guard ──
  console.log('\nOrphaned-fetch drain guard — shouldDrainAfterOrphanedFetch\n');

  test('true wedge shape (all four false/empty, clearSpeechQueue already reset them) → drain', () => {
    const drain = shouldDrainAfterOrphanedFetch({
      isPlaying: false,
      audioQueueLen: 0,
      speakTextInFlight: false,
      speakTextQueueLen: 0,
    });
    assert.equal(drain, true, 'the confirmed wedge shape must drain to idle');
  });

  test('new-turn mid-fetch shape (new dispatch in flight, next sentence queued) → NO drain', () => {
    const drain = shouldDrainAfterOrphanedFetch({
      isPlaying: false,
      audioQueueLen: 0,
      speakTextInFlight: true,
      speakTextQueueLen: 1,
    });
    assert.equal(drain, false, 'an orphaned fetch resolving mid a NEW dispatch must not hijack it');
  });

  test('new-turn mid-fetch shape (in flight, no further sentences queued) → NO drain', () => {
    const drain = shouldDrainAfterOrphanedFetch({
      isPlaying: false,
      audioQueueLen: 0,
      speakTextInFlight: true,
      speakTextQueueLen: 0,
    });
    assert.equal(drain, false, 'a live in-flight dispatch alone must block the drain');
  });

  test('audio already queued (chunk arrived, about to play) → NO drain', () => {
    const drain = shouldDrainAfterOrphanedFetch({
      isPlaying: false,
      audioQueueLen: 1,
      speakTextInFlight: false,
      speakTextQueueLen: 0,
    });
    assert.equal(drain, false, 'a queued chunk means playback is not actually stranded');
  });

  test('a source is playing → NO drain (onended owns the transition)', () => {
    const drain = shouldDrainAfterOrphanedFetch({
      isPlaying: true,
      audioQueueLen: 0,
      speakTextInFlight: false,
      speakTextQueueLen: 0,
    });
    assert.equal(drain, false, 'while something is playing its own onended must own the transition');
  });

  // ── Task X3 fix-wave (review finding 2): stuck-SPEAKING watchdog ──
  console.log('\nStuck-SPEAKING watchdog — shouldFireSpeakingWatchdog\n');

  test("speaking + silent past threshold (9s vs 8s) → fire", () => {
    const fire = shouldFireSpeakingWatchdog({
      state: 'speaking', isPlaying: false, silentForMs: 9000, thresholdMs: 8000,
    });
    assert.equal(fire, true, 'a genuinely stranded speaking pipeline past threshold must fire');
  });

  test("processing + 9s → NO fire (the 'processing'-pin variant is a different wedge, not covered here)", () => {
    // A terminal TTS-fetch failure pins production state at 'processing', not
    // 'speaking' — that variant is already self-healing via the `!float32`
    // branch in sendOneSpeakTextViaOpenAITTS, which calls playNextAudio
    // itself. This watchdog is scoped to 'speaking' only, by design.
    const fire = shouldFireSpeakingWatchdog({
      state: 'processing', isPlaying: false, silentForMs: 9000, thresholdMs: 8000,
    });
    assert.equal(fire, false, "the 'processing'-pin variant must not be caught by this watchdog");
  });

  test('speaking + still playing → NO fire (not actually stranded)', () => {
    const fire = shouldFireSpeakingWatchdog({
      state: 'speaking', isPlaying: true, silentForMs: 9000, thresholdMs: 8000,
    });
    assert.equal(fire, false, 'audio resumed since the clock started must not fire');
  });

  test('speaking + silent but under threshold → NO fire', () => {
    const fire = shouldFireSpeakingWatchdog({
      state: 'speaking', isPlaying: false, silentForMs: 7999, thresholdMs: 8000,
    });
    assert.equal(fire, false, 'under-threshold silence must not fire early');
  });

  test('speaking + silent exactly at threshold → fire (boundary, >=)', () => {
    const fire = shouldFireSpeakingWatchdog({
      state: 'speaking', isPlaying: false, silentForMs: 8000, thresholdMs: 8000,
    });
    assert.equal(fire, true, 'silentForMs === thresholdMs fires');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
