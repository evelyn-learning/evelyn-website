/**
 * Sustained-energy barge-in gate (Task V1 — echo fix layer 1; R44 — windowed
 * accumulation).
 *
 * ROOT CAUSE this defends against (session portal-81f2b582): the tutor's own
 * TTS leaks into the mic, the perception VAD fires `speech_started`, and the
 * stage-3 kill (`clearSpeechQueue` + brain abort + `markInterrupted`) executes
 * on the tutor's OWN echo — cutting it off mid-sentence. Echo bursts are SHORT
 * and correlated with playback; a genuine student barge-in ("wait, stop") is
 * SUSTAINED. So during 'speaking' ONLY, the kill is withheld until the mic has
 * carried above-threshold energy for `sustainMs` (default 400).
 *
 * R44 — windowed accumulation (session portal-dc74208b): live evidence showed
 * 2 of 5 armed barge-in gates never fired on sustained real student speech.
 * The original rule required that energy for `sustainMs` be a CONTINUOUS run
 * — it reset to zero on any single below-threshold frame. Real speech isn't
 * continuous: inter-word dips drop below threshold for ~100ms between voiced
 * segments, and echo cancellation actively ducks the mic while the tutor's
 * TTS is playing, further chopping up genuine student audio into runs shorter
 * than `sustainMs` even when the student never stopped talking. So the
 * continuity requirement is now WINDOWED ACCUMULATION: instead of requiring
 * one unbroken run, the gate sums above-threshold coverage across the
 * trailing `accumWindowMs` (default 700, see {@link
 * DEFAULT_BARGEIN_ACCUM_WINDOW_MS}) and fires once that sum reaches
 * `sustainMs`. A genuine sustained utterance with dips still accumulates
 * enough coverage to fire; a short or sparse echo blip still doesn't. The
 * liveness guards (currently-quiet mic, stale latest frame) are unchanged —
 * accumulated coverage never overrides a currently-dead mic.
 *
 * HONEST CREDITING (R44 fix-review): the first cut of windowed accumulation
 * credited every above-threshold frame `min(gapToSuccessor, maxFrameGapMs)`
 * regardless of what that successor frame actually was — including up to
 * `maxFrameGapMs` (250ms) of pure SILENCE after a single ~85ms voiced spike,
 * since the successor's own energy was never checked. That let periodic
 * echo-burst trains (the exact self-correlated pattern this gate exists to
 * reject) accumulate enough fabricated coverage to fire — reviewer probes
 * showed a 3-spike isolated-blip train crediting 480ms and a 40%-duty burst
 * train (100ms on / 150ms off) firing, both of which the OLD strict
 * continuous-run rule correctly refused. The credit rule is now split by what
 * the SUCCESSOR frame actually is:
 *   - successor ALSO above threshold → credit `min(nextT - f.tMs,
 *     maxFrameGapMs)` (the real elapsed time; a single dropped frame inside
 *     an otherwise-continuous voiced run is still tolerated).
 *   - successor below threshold, OR this is the trailing frame of the window
 *     → credit a flat `NOMINAL_FRAME_MS` (the documented ~85ms capture
 *     cadence) instead of the real gap to that successor. Voiced energy can
 *     no longer be assumed to persist into a gap that ends in silence — the
 *     frame is credited only its own nominal presence, not the distance to
 *     whatever (silent) sample comes next. The trailing frame of the window
 *     is capped to `min(nowMs - f.tMs, NOMINAL_FRAME_MS)` so a fresh live
 *     frame isn't over-credited either.
 * This bounds the maximum fabricated overcredit per frame-boundary to one
 * nominal frame (~85ms) instead of the old rule's unbounded-up-to-250ms, and
 * denies periodic echo-burst trains and duty-cycle bursts under ~50% duty the
 * coverage they'd need to fire (see the pinned regression tests below).
 *
 * ACCEPTED BOUNDARY: this is a COVERAGE-based gate, so any signal whose TRUE
 * duty cycle exceeds `sustainMs / accumWindowMs` (350/700 = 50% at the
 * defaults) mathematically contains ≥ `sustainMs` of genuine above-threshold
 * time inside the window and WILL accumulate enough real coverage to fire,
 * no matter how the per-frame credit is computed — e.g. a ≥60%-duty burst
 * train (150ms on / 100ms off) is >50% duty and fires. That is by design,
 * not a bug: an energy-only gate cannot distinguish a genuinely sustained
 * utterance from an isochronous echo/doorbell-style burst once the burst
 * carries more real voiced time than silence in the window — no coverage
 * threshold can reject a signal that IS majority-voiced. Discriminating that
 * case requires signal shape or content, not just coverage; that
 * classification is a SEPARATE downstream layer (the transcript classifier,
 * Task 6) — deliberately out of this gate's reach.
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
  /** Required above-threshold duration, ACCUMULATED (not necessarily
   *  continuous) within `accumWindowMs`, before the kill may fire. */
  sustainMs: number;
  /** Max gap between consecutive in-run frames (and between the latest frame
   *  and now) before the run is considered broken/stale. Guards against a
   *  reception gap being read as continuous energy. Defaults to
   *  {@link DEFAULT_MAX_FRAME_GAP_MS}. Also caps the per-frame credit in the
   *  windowed-accumulation sum (see {@link shouldFireBargeInKill}). */
  maxFrameGapMs?: number;
  /** Trailing window (ms, ending at `nowMs`) over which above-threshold
   *  coverage is accumulated. Defaults to
   *  {@link DEFAULT_BARGEIN_ACCUM_WINDOW_MS}. */
  accumWindowMs?: number;
}

/** ~3 perception frames at the ~85ms ScriptProcessor cadence (4096 / 24k... the
 *  capture context runs higher, ~12 frames/sec). Comfortably spans one dropped
 *  frame without reading a genuine silence gap as sustained energy. */
export const DEFAULT_MAX_FRAME_GAP_MS = 250;

/** Trailing window over which above-threshold coverage is accumulated (R44).
 *  700ms comfortably spans a few inter-word dips (~100ms each) around a
 *  `sustainMs`-sized (350ms default) run of genuine speech without being so
 *  wide that sparse, unrelated echo blips accumulate into a false fire. */
export const DEFAULT_BARGEIN_ACCUM_WINDOW_MS = 700;

/** The documented perception capture cadence (see the module header). Flat
 *  credit given to an above-threshold frame whose successor is silent (or
 *  which is the trailing frame of the window) — its own nominal presence,
 *  never the (possibly silent) distance to the next sample. See "HONEST
 *  CREDITING" in the module header. */
export const NOMINAL_FRAME_MS = 85;

/**
 * Should the stage-3 barge-in kill fire?
 *
 * - NON-'speaking' onset → true immediately (gate bypassed; instant path, today's
 *   behavior, ZERO added latency).
 * - 'speaking' onset → true only once the mic has carried ≥ `sustainMs` of
 *   above-threshold energy, ACCUMULATED (not necessarily continuous) within
 *   the trailing `accumWindowMs` window ending at `nowMs` (R44 — see the
 *   module header). A short or sparse echo blip (accumulated coverage stays
 *   under `sustainMs`, or the mic has already gone quiet) → false.
 * - Liveness is still required regardless of accumulated coverage: a
 *   currently-quiet or stale mic never fires, no matter how much coverage it
 *   carried earlier.
 *
 * Pure: identical output for identical input.
 */
export function shouldFireBargeInKill(input: BargeInGateInput): boolean {
  // The gate is a 'speaking'-only concern. Anything else keeps the instant
  // kill path — the whole point is that latency is added ONLY during TTS.
  if (input.state !== 'speaking') return true;

  const gap = input.maxFrameGapMs ?? DEFAULT_MAX_FRAME_GAP_MS;
  const accumWindowMs = input.accumWindowMs ?? DEFAULT_BARGEIN_ACCUM_WINDOW_MS;
  const frames = input.frames
    .filter((f) => f.tMs >= input.speechStartMs && f.tMs <= input.nowMs)
    .sort((a, b) => a.tMs - b.tMs);
  if (frames.length === 0) return false;

  const last = frames[frames.length - 1];
  // Currently quiet → the burst has died (echo blip). Not a live barge-in.
  if (last.energy < input.energyThreshold) return false;
  // Latest frame is stale relative to now (no fresh audio) → run not live.
  if (input.nowMs - last.tMs > gap) return false;

  // Windowed accumulation (R44, HONEST CREDITING — see module header): walk
  // the frames inside [nowMs - accumWindowMs, nowMs]. An above-threshold
  // frame is credited differently depending on what its successor actually
  // is:
  //   - successor ALSO above threshold → the real elapsed gap to it, capped
  //     at `gap` (tolerates one dropped frame inside a continuous run).
  //   - successor below threshold, or this is the trailing frame of the
  //     window → a flat NOMINAL_FRAME_MS. Energy can't be assumed to persist
  //     into a gap that ends in silence, so the frame is credited only its
  //     own nominal cadence, never the distance to a silent sample.
  // Fire as soon as the running sum reaches `sustainMs`. This tolerates
  // inter-word dips and AEC-attenuated capture that would break a strict
  // continuous run, while denying periodic echo-burst trains and sub-50%-duty
  // bursts the fabricated coverage the old (buggy) credit rule gave them.
  const windowStart = input.nowMs - accumWindowMs;
  let coveredMs = 0;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (f.tMs < windowStart) continue;
    if (f.energy < input.energyThreshold) continue;
    const isTrailing = i + 1 >= frames.length;
    const next = isTrailing ? null : frames[i + 1];
    const credit = isTrailing
      ? Math.min(input.nowMs - f.tMs, NOMINAL_FRAME_MS)
      : next!.energy >= input.energyThreshold
        ? Math.min(next!.tMs - f.tMs, gap)
        : NOMINAL_FRAME_MS;
    coveredMs += credit;
    if (coveredMs >= input.sustainMs) return true;
  }
  return false;
}

/**
 * Per-device adaptive energy threshold (round-5 echo fix, 2026-07-27).
 *
 * ROOT CAUSE this closes: `BARGEIN_ENERGY_THRESHOLD` (0.15) is a single
 * absolute number on a scale that is ~10x hotter on desktop than on a phone.
 * Measuring the recorded student/tutor PCM of two real mobile prod sessions
 * in this exact scaled domain (see flags.ts for the full table) shows mobile
 * self-echo at p99 .039-.042 and genuine mobile student speech at p50 .104 /
 * max .139 — BOTH under 0.15. A fixed gate therefore cannot separate them on
 * mobile at any setting: at 0.15 it blocks every real barge-in, and anywhere
 * low enough to pass speech it also passes echo.
 *
 * The separation that DOES hold on every device is RELATIVE: genuine speech
 * sits several times above the echo floor the same mic is already carrying.
 * So sample that floor from the frames just BEFORE the onset — during TTS the
 * mic carries echo + ambient and nothing else — and scale it.
 *
 *   threshold = clamp(margin * median(baseline frames), floor, ceiling)
 *
 * `ceiling` is the legacy fixed constant, so this is NEVER stricter than what
 * shipped. `floor` stops a digitally-silent baseline (muted mic, capture gap)
 * from collapsing the gate to ~0 and letting any whisper of echo through.
 * Median, not mean, so one loud frame that straddles the onset can't inflate
 * the baseline and silently disable the gate.
 *
 * With no frames in the window there is no evidence to adapt on, so it
 * returns `ceiling` — today's behaviour, chosen deliberately over guessing.
 *
 * Pure: identical output for identical input.
 */
export interface AdaptiveThresholdInput {
  /** Recent mic-energy frames. Filtered to [fromMs, toMs] internally. */
  frames: BargeInFrame[];
  /** Start of the baseline window (ms, Date.now() domain). */
  fromMs: number;
  /** End of the baseline window — normally the speech onset. */
  toMs: number;
  /** Absolute minimum the threshold may adapt down to. */
  floor: number;
  /** Absolute maximum — the legacy fixed constant. */
  ceiling: number;
  /** How many times the echo floor a frame must reach to count as speech. */
  margin: number;
}

export function resolveBargeInEnergyThreshold(input: AdaptiveThresholdInput): number {
  const inWindow = input.frames
    .filter((f) => f.tMs >= input.fromMs && f.tMs <= input.toMs)
    .map((f) => f.energy)
    .sort((a, b) => a - b);
  // No evidence → don't guess; keep the shipped constant.
  if (inWindow.length === 0) return input.ceiling;

  const mid = Math.floor(inWindow.length / 2);
  const baseline = inWindow.length % 2 === 0
    ? (inWindow[mid - 1] + inWindow[mid]) / 2
    : inWindow[mid];

  const scaled = baseline * input.margin;
  if (scaled < input.floor) return input.floor;
  if (scaled > input.ceiling) return input.ceiling;
  return scaled;
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
