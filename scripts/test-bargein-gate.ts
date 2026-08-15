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
  resolveBargeInEnergyThreshold,
  DEFAULT_BARGEIN_ACCUM_WINDOW_MS,
  NOMINAL_FRAME_MS,
  type BargeInFrame,
  type BargeInGateInput,
} from '../apps/marketing/src/lib/tutor/voice/bargein-gate';
import {
  BARGEIN_SUSTAIN_MS,
  BARGEIN_ENERGY_FLOOR,
  BARGEIN_ECHO_MARGIN,
} from '../apps/marketing/src/lib/tutor/orchestrator/flags';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const THRESHOLD = 0.15;   // "voice present" on the scaled 0..1 mic level
const MIN_THRESHOLD = BARGEIN_ENERGY_FLOOR;
const ECHO_MARGIN = BARGEIN_ECHO_MARGIN;
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

  // ── R44: windowed accumulation (dip-tolerant sustain) ──
  // Live evidence (session portal-dc74208b): 2 of 5 armed barge-in gates never
  // passed on sustained real student speech. The strict continuous-run walk
  // above resets on ANY below-threshold frame, and inter-word dips + AEC
  // ducking the mic during TTS playback break the run before it reaches
  // sustainMs. Windowed accumulation credits above-threshold coverage inside
  // the trailing `accumWindowMs` (default 700) instead of requiring an
  // unbroken run — a genuine sustained utterance still fires; short/sparse
  // echo blips still don't.
  //
  // HONEST CREDITING (fix-review round): the first cut credited every
  // above-threshold frame up to maxFrameGapMs (250ms) toward its successor
  // WITHOUT checking whether that successor was itself voiced — so up to
  // 250ms of pure silence after a single spike counted as coverage. That let
  // periodic echo-burst trains fabricate enough credit to fire (a shape the
  // OLD strict continuous-run rule correctly refused). The credit rule now
  // only extends the real-gap credit when the successor is ALSO
  // above-threshold; a voiced frame whose successor is silent (or which is
  // the trailing frame of the window) gets a flat NOMINAL_FRAME_MS instead.
  // See the module header ("HONEST CREDITING" / "ACCEPTED BOUNDARY") for the
  // full rationale, including why >50%-duty bursts are intentionally still in
  // reach (out of scope for THIS energy-only gate; that's Task 6).
  console.log('\nWindowed accumulation (dip-tolerant sustain) — shouldFireBargeInKill\n');

  test(`DEFAULT_BARGEIN_ACCUM_WINDOW_MS is 700`, () => {
    assert.equal(DEFAULT_BARGEIN_ACCUM_WINDOW_MS, 700);
  });

  test(`NOMINAL_FRAME_MS is 85`, () => {
    assert.equal(NOMINAL_FRAME_MS, 85);
  });

  function framesWithDips(): BargeInGateInput {
    // ~85ms-cadence capture (FRAME_MS below), energy alternating 0.3 (voiced)
    // / 0.1 (inter-word dip) in 200ms voiced runs with 100ms dips — the exact
    // live-incident shape. Direct computation under HONEST crediting (window
    // = [100,800], threshold = 0.15, gap = 250, NOMINAL = 85):
    //   t=160 (end of run 1, successor@200 is a dip)      → credit 85
    //   t=300 (successor@380 also voiced)                 → credit 80
    //   t=380 (successor@460 also voiced)                 → credit 80
    //   t=460 (end of run 2, successor@500 is a dip)       → credit 85
    //   t=600 (successor@680 also voiced)                 → credit 80  [running total 410 >= 350 → FIRES here]
    // Fires at 410ms of accumulated coverage, well inside the 700ms window.
    // Under the OLD strict continuous-run rule the trailing run is only
    // 200ms (600..800, broken by the 500..600 dip) → does NOT fire. This is
    // the case that must be RED before the fix and GREEN after.
    const dipFrames: BargeInFrame[] = [
      ...frames(0, 160, 0.3),    // voiced 0-200ish
      ...frames(200, 280, 0.1),  // dip
      ...frames(300, 460, 0.3),  // voiced
      ...frames(500, 580, 0.1),  // dip
      ...frames(600, 760, 0.3),  // voiced (trailing run only 200ms long)
    ];
    return {
      state: 'speaking', speechStartMs: 0, nowMs: 800,
      frames: dipFrames, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  function shortBlip(): BargeInGateInput {
    // A single ~200ms echo blip then silence. Accumulated coverage (~200ms)
    // stays well under sustainMs (350) regardless of windowing.
    const blipFrames: BargeInFrame[] = [
      ...frames(0, 160, LOUD),
      ...frames(200, 440, QUIET),
    ];
    return {
      state: 'speaking', speechStartMs: 0, nowMs: 440,
      frames: blipFrames, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  function sparseBlips(): BargeInGateInput {
    // 3x80ms voiced blips spread over 2s. Only the trailing pair falls inside
    // any 700ms window (~100ms total coverage) — refused.
    const sparse: BargeInFrame[] = [
      ...frames(0, 80, LOUD),
      ...frames(900, 980, LOUD),
      ...frames(1900, 1980, LOUD),
    ];
    return {
      state: 'speaking', speechStartMs: 0, nowMs: 2000,
      frames: sparse, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  function continuousRun(): BargeInGateInput {
    // The old passing shape: an unbroken 350ms run still fires under
    // windowed accumulation (it's a degenerate case of the same rule).
    return {
      state: 'speaking', speechStartMs: 0, nowMs: SUSTAIN,
      frames: frames(0, SUSTAIN - 30, LOUD), energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  function deadBurst(): BargeInGateInput {
    // 320ms of loud energy (would be MORE than enough accumulated coverage)
    // immediately followed by a currently-quiet frame. The liveness guard
    // (`last.energy < threshold`) must still refuse this — sufficient past
    // coverage does not override a currently-dead mic.
    const burst: BargeInFrame[] = [
      ...frames(0, 320, LOUD),
      { tMs: 400, energy: QUIET },
    ];
    return {
      state: 'speaking', speechStartMs: 0, nowMs: 400,
      frames: burst, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  function nonSpeaking(): BargeInGateInput {
    return {
      state: 'processing', speechStartMs: 0, nowMs: 0,
      frames: [], energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  test('dips within window fire (live-incident shape: inter-word dips no longer reset the gate)', () => {
    assert.equal(shouldFireBargeInKill(framesWithDips()), true,
      'sustained speech with inter-word dips must fire once windowed coverage reaches sustainMs');
  });

  test('short blip still refused (accumulated < sustainMs)', () => {
    assert.equal(shouldFireBargeInKill(shortBlip()), false,
      'a single short blip must not accumulate enough coverage to fire');
  });

  test('sparse blips refused (coverage inside any 700ms window is too small)', () => {
    assert.equal(shouldFireBargeInKill(sparseBlips()), false,
      'blips spread far apart in time must not fire even though they sum to more than sustainMs overall');
  });

  test('continuous run still fires (old passing shape unaffected)', () => {
    assert.equal(shouldFireBargeInKill(continuousRun()), true,
      'an unbroken run of sustainMs must still fire under windowed accumulation');
  });

  test('dead burst refused (liveness guard unchanged: currently-quiet mic refused even with past coverage)', () => {
    assert.equal(shouldFireBargeInKill(deadBurst()), false,
      'a currently-quiet mic must refuse regardless of how much coverage it accumulated earlier');
  });

  test('non-speaking instant path unchanged', () => {
    assert.equal(shouldFireBargeInKill(nonSpeaking()), true,
      "non-'speaking' states keep the instant kill path, untouched by accumulation");
  });

  // ── Fix-review pin: periodic echo-burst trains (the module's own named
  // threat — the exact shape the old buggy credit rule let through) ──

  function isolatedSpikeTrain(): BargeInGateInput {
    // 3 isolated ~85ms echo spikes (period 240ms), each followed by ONE
    // captured below-threshold sample placed near the far end of the gap to
    // the next spike (230ms later — close to but under maxFrameGapMs=250),
    // exactly the "successor is silent but far away" shape the OLD credit
    // rule mishandled. Direct computation (threshold 0.15, gap 250, NOMINAL
    // 85, window = [0, 700] so all 3 spikes are inside it):
    //   OLD (buggy) rule — credits the real gap to whatever frame is next,
    //   never checking its energy:
    //     t=0   → next@230 → credit min(230, 250) = 230
    //     t=240 → next@470 → credit min(230, 250) = 230        (sum 460, already >= 350 → WRONGLY FIRES)
    //   Verified programmatically against the pre-fix implementation:
    //   { fire: true, sum: 460 }.
    //   NEW (honest) rule — successor IS captured and IS below threshold, so
    //   each spike gets only its own nominal presence, not the gap to it:
    //     t=0   (successor@230 silent)          → credit 85
    //     t=240 (successor@470 silent)          → credit 85
    //     t=480 (trailing frame of the window)  → credit min(700-480, 85) = 85
    //   Total = 255ms < 350 sustainMs → REFUSED. Verified: { fire: false, sum: 255 }.
    const spikes: BargeInFrame[] = [
      { tMs: 0, energy: LOUD },
      { tMs: 230, energy: QUIET },
      { tMs: 240, energy: LOUD },
      { tMs: 470, energy: QUIET },
      { tMs: 480, energy: LOUD },
    ];
    return {
      state: 'speaking', speechStartMs: 0, nowMs: 700,
      frames: spikes, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  function periodicDutyCycleBurst(): BargeInGateInput {
    // A 40%-duty periodic echo-burst train: 100ms "on" / 150ms "off" (250ms
    // period), sampled once per on-phase onset plus one captured
    // below-threshold sample near the end of each off-phase (249ms later —
    // an honest capture near the far edge of the real 150ms silence, not an
    // invented gap) — 3 periods (onsets at 0, 250, 500). Direct computation
    // (threshold 0.15, gap 250, NOMINAL 85, window = [-30, 670]):
    //   OLD (buggy) rule:
    //     t=0   → next@249 → credit min(249, 250) = 249
    //     t=250 → next@499 → credit min(249, 250) = 249        (sum 498, already >= 350 → WRONGLY FIRES,
    //                                                            this is the reviewer-reported "40%-duty bursts firing")
    //   Verified programmatically against the pre-fix implementation:
    //   { fire: true, sum: 498 }.
    //   NEW (honest) rule — each on-phase's tail sample has a captured,
    //   below-threshold successor, so it gets flat NOMINAL instead of the
    //   real (mostly-silent) gap:
    //     t=0   (successor@249 silent)          → credit 85
    //     t=250 (successor@499 silent)          → credit 85
    //     t=500 (trailing frame of the window)  → credit min(670-500, 85) = 85
    //   Total = 255ms < 350 sustainMs → REFUSED. Verified: { fire: false, sum: 255 }.
    //   (True physical on-duration is 3 x 100ms = 300ms — also under
    //   sustainMs; 40% duty sits below the 50%-duty mathematical floor
    //   documented in the module header, so it MUST be refusable.)
    const burstTrain: BargeInFrame[] = [
      { tMs: 0, energy: LOUD },
      { tMs: 249, energy: QUIET },
      { tMs: 250, energy: LOUD },
      { tMs: 499, energy: QUIET },
      { tMs: 500, energy: LOUD },
    ];
    return {
      state: 'speaking', speechStartMs: 0, nowMs: 670,
      frames: burstTrain, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    };
  }

  test('isolated 3-spike echo-burst train refused (honest crediting denies the fabricated coverage)', () => {
    assert.equal(shouldFireBargeInKill(isolatedSpikeTrain()), false,
      'periodic isolated spikes must not accumulate enough real coverage to fire');
  });

  test('40%-duty periodic burst train refused (permanent regression — the module\'s named threat)', () => {
    assert.equal(shouldFireBargeInKill(periodicDutyCycleBurst()), false,
      'a sub-50%-duty periodic burst train must never accumulate sustainMs of honest coverage');
  });

  test('documents the accepted boundary: a >=60%-duty burst train DOES fire (by design, not a bug)', () => {
    // 150ms on / 100ms off (250ms period) = 60% duty, i.e. above the
    // sustainMs/accumWindowMs = 350/700 = 50% mathematical floor documented
    // in the module header ("ACCEPTED BOUNDARY"). 3 on-phases (0, 250, 500),
    // 2 samples each (onset + near-end) plus an off-phase silent marker so
    // each phase's tail correctly hits the honest flat-NOMINAL branch.
    // Direct computation (window = [-50, 650], all included):
    //   t=0   (successor@80 also voiced)     → credit 80
    //   t=80  (successor@200 is silent)      → credit 85
    //   t=250 (successor@330 also voiced)    → credit 80
    //   t=330 (successor@450 is silent)      → credit 85   [running total 330]
    //   t=500 (successor@580 also voiced)    → credit 80   [running total 410 >= 350 → FIRES here]
    // True on-coverage per period (150ms) x ~3 periods in the 700ms window is
    // genuinely >= 350ms, so ANY coverage-based rule fires on it — that's
    // inherent to an energy-only gate, not something this credit-rule fix is
    // meant to close. Discriminating this shape from real sustained speech is
    // Task 6's job (transcript classification), not this gate's.
    const highDutyBurst: BargeInFrame[] = [
      { tMs: 0, energy: LOUD },
      { tMs: 80, energy: LOUD },
      { tMs: 200, energy: QUIET },
      { tMs: 250, energy: LOUD },
      { tMs: 330, energy: LOUD },
      { tMs: 450, energy: QUIET },
      { tMs: 500, energy: LOUD },
      { tMs: 580, energy: LOUD },
    ];
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: 650,
      frames: highDutyBurst, energyThreshold: THRESHOLD, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true,
      '>=60%-duty periodic energy genuinely exceeds sustainMs of real coverage in the window and fires by design');
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

  console.log('\nAdaptive energy threshold — resolveBargeInEnergyThreshold\n');

  // Levels below are MEASURED, not invented: they come from the recorded
  // student/tutor PCM of real prod sessions, converted to the same scaled
  // 0..1 `onMicLevel` domain the gate consumes (rms * 6, capped at 1).
  //   mobile demo   portal-c867381f : echo p50 .022 p99 .039 | speech p90 .053 max .139
  //   mobile round3 portal-fb520c16 : echo p50 .012 p99 .042 | speech p50 .104 max .108
  //   desktop       session-1785023522127 : echo p50 .247   | speech p50 .308
  // The mobile numbers are the whole reason this function exists: BOTH echo
  // and real speech sit far below the fixed 0.15 constant, so the fixed gate
  // could only ever be all-block or all-pass on a phone.

  test('quiet mobile device → threshold drops below the fixed 0.15 constant', () => {
    const baseline = frames(0, 600, 0.022); // measured mobile echo floor
    const t = resolveBargeInEnergyThreshold({
      frames: baseline, fromMs: 0, toMs: 600,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    assert.ok(t < THRESHOLD, `expected adaptive threshold below ${THRESHOLD}, got ${t}`);
    assert.ok(t > 0.039, `must sit above the measured mobile echo p99 (0.039), got ${t}`);
    assert.ok(t < 0.104, `must sit below measured mobile student speech (0.104), got ${t}`);
  });

  test('loud desktop device → threshold clamps at the legacy ceiling', () => {
    const baseline = frames(0, 600, 0.247); // measured desktop echo floor
    const t = resolveBargeInEnergyThreshold({
      frames: baseline, fromMs: 0, toMs: 600,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    assert.equal(t, THRESHOLD, 'never stricter than the pre-existing fixed constant');
  });

  test('near-silent baseline → threshold clamps at the floor, not zero', () => {
    const baseline = frames(0, 600, 0.0001);
    const t = resolveBargeInEnergyThreshold({
      frames: baseline, fromMs: 0, toMs: 600,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    assert.equal(t, MIN_THRESHOLD, 'a silent baseline must not collapse the gate to ~0');
  });

  test('no baseline frames → conservative ceiling (today’s behaviour)', () => {
    const t = resolveBargeInEnergyThreshold({
      frames: [], fromMs: 0, toMs: 600,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    assert.equal(t, THRESHOLD, 'with no evidence, fall back to the fixed constant');
  });

  test('baseline ignores frames outside [fromMs, toMs]', () => {
    const mixed = [...frames(-2000, -1000, 0.9), ...frames(0, 600, 0.022)];
    const t = resolveBargeInEnergyThreshold({
      frames: mixed, fromMs: 0, toMs: 600,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    assert.ok(t < THRESHOLD, 'stale loud frames outside the window must not raise the baseline');
  });

  test('median-based: a single loud outlier does not move the baseline', () => {
    const withSpike = [...frames(0, 600, 0.022), { tMs: 300, energy: 1.0 }];
    const t = resolveBargeInEnergyThreshold({
      frames: withSpike, fromMs: 0, toMs: 600,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    assert.ok(t < 0.104, `one spike must not push the gate above student speech, got ${t}`);
  });

  console.log('\nEnd-to-end: measured mobile session replays\n');

  test('mobile echo at measured levels → NO kill (this is the reported bug)', () => {
    // Echo sustains for a full tutor sentence, so the TIME-only ink2 gate
    // fires — this is exactly what cut the tutor off 10x in 34s. With the
    // adaptive energy gate it must not.
    const echo = frames(0, 1200, 0.039); // measured mobile echo p99
    const threshold = resolveBargeInEnergyThreshold({
      frames: frames(-600, 0, 0.022), fromMs: -600, toMs: 0,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: SUSTAIN,
      frames: echo, energyThreshold: threshold, sustainMs: SUSTAIN,
    });
    assert.equal(fire, false, 'sustained self-echo on a phone must never kill the tutor');
  });

  test('mobile real barge-in at measured levels → kill still fires', () => {
    const speech = frames(0, 1200, 0.104); // measured mobile student speech p50
    const threshold = resolveBargeInEnergyThreshold({
      frames: frames(-600, 0, 0.022), fromMs: -600, toMs: 0,
      floor: MIN_THRESHOLD, ceiling: THRESHOLD, margin: ECHO_MARGIN,
    });
    const fire = shouldFireBargeInKill({
      state: 'speaking', speechStartMs: 0, nowMs: SUSTAIN,
      frames: speech, energyThreshold: threshold, sustainMs: SUSTAIN,
    });
    assert.equal(fire, true, 'a genuine mobile barge-in must still interrupt the tutor');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
