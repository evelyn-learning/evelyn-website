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

/**
 * Timer-variant of the sustain gate for the Ink2 STT path (Task X3).
 *
 * ROOT CAUSE (session portal-da5b97a6): the energy-window gate above defends
 * the OpenAI perception path, but the Ink2 hook (`useCartesiaInkWS`) exposes
 * NO per-frame energy signal, so its 'speaking'-state `speech_started` fell
 * back to the INSTANT kill — the documented V1 gap. Live console proved a
 * self-echo `turn.start` fired a STAGE-3 cancel that cut the tutor off, with
 * `speech_stopped` arriving ~264ms later. A sustain check would have caught it.
 *
 * With no energy window, "sustain" is measured purely by TIME between the VAD
 * events: `speech_started` arms a deferred-kill timer; `speech_stopped` within
 * `sustainMs` DISARMS it (echo blip / brief noise — the utterance ended before
 * a genuine barge-in would have); if the timer reaches `sustainMs` while the
 * tutor is STILL 'speaking' and the utterance has NOT stopped, the kill fires.
 *
 * This is the pure decision the timer callback evaluates AT EXPIRY. In wiring,
 * `speechStopped` is enforced by clearing the timer on `speech_stopped`, so the
 * callback only runs when it is false; the parameter is kept explicit so the
 * full semantics are testable and the predicate is honest in isolation.
 *
 * Pure: identical output for identical input. No timers, no refs.
 */
export interface DeferredBargeInGateInput {
  /** Production state at timer-expiry evaluation. Kill only fires while the
   *  tutor is still 'speaking' — if TTS finished naturally there is nothing
   *  left to interrupt. */
  state: string;
  /** Did `speech_stopped` fire before this evaluation? True → the utterance
   *  ended within the sustain window (echo blip) → never kill. */
  speechStopped: boolean;
  /** Milliseconds elapsed since the arming `speech_started` (onset). */
  elapsedMs: number;
  /** Required continuous duration before the kill may fire. */
  sustainMs: number;
}

export function shouldFireDeferredBargeInKill(input: DeferredBargeInGateInput): boolean {
  // Tutor stopped talking before sustain met → nothing to interrupt.
  if (input.state !== 'speaking') return false;
  // Utterance ended within the sustain window → short echo/noise, not a
  // genuine barge-in. (In wiring this is enforced by disarming the timer.)
  if (input.speechStopped) return false;
  // Sustained through the window while still speaking → real barge-in.
  return input.elapsedMs >= input.sustainMs;
}

/**
 * Orphaned-fetch drain guard (Task X3 fix-wave, finding 1 — review of the
 * epoch-guard branch at `useOpenAIRealtime.ts`'s `sendOneSpeakTextViaOpenAITTS`).
 *
 * ROOT CAUSE this closes: the original fix drained on `!isPlaying &&
 * audioQueueLen === 0` alone. That shape is ALSO true for an entirely
 * legitimate in-progress turn: sentence K's chunk hasn't arrived yet
 * (`isPlaying` still false, pre-first-chunk), a NEW dispatch is in flight
 * (`speakTextInFlightRef` true) with sentence M+1 already queued
 * (`speakTextQueueRef` non-empty) — an orphaned PRE-KILL fetch (epoch
 * mismatch) resolving during exactly that mid-fetch window would wrongly
 * fire `playNextAudio()` and hijack dispatch, reordering/overlapping
 * sentences. The wedge this guards against instead has ALL FOUR of these
 * false/empty at once: `clearSpeechQueue` (the barge-in that bumped the
 * epoch) resets `speakTextInFlightRef` to false and empties
 * `speakTextQueueRef` as part of the SAME kill that invalidated this
 * dispatch, so in the true wedge there is nothing else in flight or queued
 * to hijack — draining is safe. Requiring all four closes the reorder race
 * while still draining the real wedge.
 *
 * Pure: no React, no refs — script-testable.
 */
export interface OrphanedFetchDrainInput {
  /** Is a client-side audio source currently playing? */
  isPlaying: boolean;
  /** Number of decoded chunks waiting in the playback queue. */
  audioQueueLen: number;
  /** Is a NEW TTS fetch (a different dispatch than the orphaned one) in flight? */
  speakTextInFlight: boolean;
  /** Number of sentences queued behind that in-flight dispatch. */
  speakTextQueueLen: number;
}

export function shouldDrainAfterOrphanedFetch(input: OrphanedFetchDrainInput): boolean {
  return (
    !input.isPlaying &&
    input.audioQueueLen === 0 &&
    !input.speakTextInFlight &&
    input.speakTextQueueLen === 0
  );
}

/**
 * Stuck-'speaking' watchdog fire decision (Task X3 fix-wave, finding 2 —
 * review of the defensive watchdog in `useOpenAIRealtime.ts`).
 *
 * The interval's own tick re-derives "stranded" (`state === 'speaking' &&
 * !isPlaying && audioQueueLen === 0`) to start/hold the `silentForMs` clock;
 * this predicate is the fire-time decision once that clock has been running,
 * re-checking `state`/`isPlaying` defensively at the moment of the check
 * against the threshold so a late recovery (audio resumed between ticks)
 * cannot still fire on a stale elapsed value.
 *
 * NOTE — the 'processing'-pin variant is a DIFFERENT wedge shape and is NOT
 * covered by this watchdog: a terminal TTS-fetch failure pins production
 * state at `'processing'` (see `sendOneSpeakTextViaOpenAITTS`'s `!float32`
 * branch), never `'speaking'`, so `state !== 'speaking'` always returns
 * false here. That variant is already handled at its own site — the
 * `!float32` branch skips the failed sentence and drives `playNextAudio`
 * itself rather than relying on any watchdog.
 *
 * Pure: no React, no refs, no `Date.now()` — script-testable.
 */
export interface SpeakingWatchdogInput {
  /** Production state at the moment of the check. */
  state: string;
  /** Is a client-side audio source currently playing? */
  isPlaying: boolean;
  /** How long the pipeline has continuously looked stranded (ms). */
  silentForMs: number;
  /** Required stranded duration before the watchdog is allowed to fire. */
  thresholdMs: number;
}

export function shouldFireSpeakingWatchdog(input: SpeakingWatchdogInput): boolean {
  // Only 'speaking' can wedge this way. The 'processing'-pin variant
  // (terminal TTS failure) is a separate shape covered elsewhere — see note
  // above.
  if (input.state !== 'speaking') return false;
  // Audio resumed since the clock started — not stranded anymore.
  if (input.isPlaying) return false;
  return input.silentForMs >= input.thresholdMs;
}
