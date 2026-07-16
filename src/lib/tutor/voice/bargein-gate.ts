/**
 * Sustained-energy barge-in gate (Task V1 — echo fix layer 1).
 *
 * ROOT CAUSE this defends against (session portal-81f2b582): the tutor's own
 * TTS leaks into the mic, the perception VAD fires `speech_started`, and the
 * stage-3 kill (`clearSpeechQueue` + brain abort + `markInterrupted`) executes
 * on the tutor's OWN echo — cutting it off mid-sentence. Echo bursts are SHORT
 * and correlated with playback; a genuine student barge-in ("wait, stop") is
 * SUSTAINED. So during 'speaking' ONLY, the kill is withheld until the mic has
 * carried above-threshold energy continuously for `sustainMs` (default 400).
 *
 * This module is the PURE decision core — no React, no DOM, no timers, no
 * component state — so it is script-testable (`npm run test:bargein-gate`).
 * The wiring in VoiceTutorRealtime feeds it (onset state, speechStartMs, the
 * energy window from usePerceptionWS's onaudioprocess, and now) and acts on the
 * boolean. Later transcript classification (V2/V3) is a SEPARATE layer; this
 * gate only decides whether the kill is allowed to fire at all.
 *
 * No new deps; no imports (keeps the script test hermetic — it passes the
 * sustain constant in directly rather than importing orchestrator/flags).
 */

/** One mic-amplitude sample. `tMs` is a wall-clock ms timestamp (Date.now()
 *  domain in production); `energy` is the already-scaled 0..1 "being heard"
 *  level emitted by usePerceptionWS's onaudioprocess. */
export interface BargeInFrame {
  tMs: number;
  energy: number;
}

export interface BargeInGateInput {
  /** Production state AT THE ONSET of speech_started. The gate applies ONLY
   *  when this is 'speaking' (TTS playing). Every other state routes to the
   *  instant path (predicate returns true immediately). */
  state: string;
  /** When speech_started fired (ms). Frames before this are ignored. */
  speechStartMs: number;
  /** Evaluation time (ms). Sustained duration is measured to NOW so a live,
   *  continuous run fires at exactly `sustainMs` with no frame-quantization
   *  underestimate — bounding the latency a genuine barge-in pays to
   *  `sustainMs` (+ the caller's poll granularity). */
  nowMs: number;
  /** Recent mic-energy frames. May span more than the utterance; the predicate
   *  filters to [speechStartMs, nowMs] itself. Order-independent. */
  frames: BargeInFrame[];
  /** Amplitude at/above which a frame counts as "voice present". */
  energyThreshold: number;
  /** Required continuous above-threshold duration before the kill may fire. */
  sustainMs: number;
  /** Max gap between consecutive in-run frames (and between the latest frame
   *  and now) before the run is considered broken/stale. Guards against a
   *  reception gap being read as continuous energy. Defaults to
   *  {@link DEFAULT_MAX_FRAME_GAP_MS}. */
  maxFrameGapMs?: number;
}

/** ~3 perception frames at the ~85ms ScriptProcessor cadence (4096 / 24k... the
 *  capture context runs higher, ~12 frames/sec). Comfortably spans one dropped
 *  frame without reading a genuine silence gap as sustained energy. */
export const DEFAULT_MAX_FRAME_GAP_MS = 250;

/**
 * Should the stage-3 barge-in kill fire?
 *
 * - NON-'speaking' onset → true immediately (gate bypassed; instant path, today's
 *   behavior, ZERO added latency).
 * - 'speaking' onset → true only when the mic has carried a CONTINUOUS run of
 *   above-threshold energy for ≥ `sustainMs`, measured to `nowMs`. A short echo
 *   blip (run ends before `sustainMs`, or the mic has already gone quiet) → false.
 *
 * Pure: identical output for identical input.
 */
export function shouldFireBargeInKill(input: BargeInGateInput): boolean {
  // The gate is a 'speaking'-only concern. Anything else keeps the instant
  // kill path — the whole point is that latency is added ONLY during TTS.
  if (input.state !== 'speaking') return true;

  const gap = input.maxFrameGapMs ?? DEFAULT_MAX_FRAME_GAP_MS;
  const frames = input.frames
    .filter((f) => f.tMs >= input.speechStartMs && f.tMs <= input.nowMs)
    .sort((a, b) => a.tMs - b.tMs);
  if (frames.length === 0) return false;

  const last = frames[frames.length - 1];
  // Currently quiet → the burst has died (echo blip). Not a live barge-in.
  if (last.energy < input.energyThreshold) return false;
  // Latest frame is stale relative to now (no fresh audio) → run not live.
  if (input.nowMs - last.tMs > gap) return false;

  // Walk backwards over the trailing above-threshold run. It breaks on the
  // first below-threshold frame OR on a reception gap larger than `gap`.
  let runStart = last.tMs;
  let prevT = last.tMs;
  for (let i = frames.length - 2; i >= 0; i--) {
    const f = frames[i];
    if (f.energy < input.energyThreshold) break;
    if (prevT - f.tMs > gap) break;
    runStart = f.tMs;
    prevT = f.tMs;
  }

  // Measured to NOW (not to the last frame) so a still-live run fires the
  // instant it has been loud for `sustainMs`.
  return input.nowMs - runStart >= input.sustainMs;
}
