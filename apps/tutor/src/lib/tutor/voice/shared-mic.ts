/**
 * Refcounted shared microphone stream (round-5 echo fix, 2026-07-27).
 *
 * ROOT CAUSE this closes: the tutor opened TWO independent `getUserMedia`
 * captures at once — `useOpenAIRealtime.startListening()` (which in Ink2 mode
 * feeds only the session recorder, since Ink2 is the sole STT input path) and
 * `useCartesiaInkWS.startMic()` (the real STT path). Two live capture sources
 * on one device force the browser to reconfigure its capture unit, and on
 * mobile Safari that is where acoustic echo cancellation is applied. Measured
 * on two real mobile prod sessions, the surviving echo was only ~20-30 dB below
 * the tutor track with a fixed ~140 ms offset — i.e. roughly the RAW speaker →
 * mic path, with AEC contributing close to nothing, even though every call site
 * asks for `echoCancellation: true`.
 *
 * The fix is to open the mic ONCE and hand the same MediaStream to every
 * consumer. Each consumer still builds its own AudioContext + MediaStreamSource
 * (they need different sample rates and different framing), which is fine —
 * what mattered was the duplicate CAPTURE.
 *
 * Track-enable semantics are PER-CONSUMER MUTE INTENT (round-6 fix,
 * 2026-07-28). The first shared-mic version exposed a single
 * `setSharedMicEnabled(bool)`: the production WS's `muteInput()` hardware-
 * disabled the track for EVERY consumer, and Ink2's software
 * `setMuted(false)` could not undo it — which silently killed the
 * mute-grace path ("mute with in-flight utterance — perception listens
 * briefly to capture it, then mutes" in VoiceTutorRealtime): perception
 * went deaf the instant the student muted, so the utterance tail it was
 * supposed to commit never existed. Now each consumer registers its own
 * intent and the track stays live while ANY consumer still wants to hear
 * (`resolveSharedMicEnabled`). "Student muted" still silences everything,
 * because the student mute drives BOTH consumers' intents (production WS
 * via `muteInput()`, Ink2 via the start-gate effect's `setMuted`) — they
 * just no longer clobber each other in between. Per-consumer software
 * gates (Ink2's `mutedRef`, the production WS's own send guards) are
 * unaffected and still apply on top.
 *
 * Teardown is refcounted so one consumer stopping (the production WS commits a
 * turn and calls `stopListening()` mid-session) cannot pull the mic out from
 * under the other. Tracks stop only when the last handle is released — and a
 * released consumer's mute intent is forgotten with it, so a departed
 * consumer can't pin the track off (or on) from the grave.
 */

const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  sampleRate: 24000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

let sharedStream: MediaStream | null = null;
let pending: Promise<MediaStream> | null = null;
const holders = new Set<string>();
/** 2026-08-17 dead-mic recovery: a student-chosen capture device (the
 *  banner's "switch mic" offer). Every acquire — including perception's
 *  separate getUserMedia, which reads this via getPreferredMicDeviceId —
 *  targets it with `deviceId: { exact }`. Cleared automatically if that
 *  exact device fails to open (unplugged between offer and tap), so a
 *  vanished device can never brick the mic: the retry falls back to the
 *  browser default. */
let preferredDeviceId: string | null = null;
/** Explicit per-consumer mute intent. Absent = the consumer has expressed
 *  none (it neither holds the track open nor pins it off). */
const muteIntents = new Map<string, boolean>();

/**
 * Pure resolution rule, exported for the script test: the track is enabled
 * while ANY consumer with an expressed intent wants to hear; with no
 * expressed intents at all it defaults to enabled (a fresh capture before
 * anyone has spoken up — the pre-fix default).
 */
export function resolveSharedMicEnabled(intents: boolean[]): boolean {
  if (intents.length === 0) return true;
  return intents.some((muted) => !muted);
}

function applySharedMicEnabled(): void {
  if (!sharedStream) return;
  const enabled = resolveSharedMicEnabled([...muteIntents.values()]);
  sharedStream.getTracks().forEach((t) => { t.enabled = enabled; });
}

/**
 * Acquire the shared mic stream for `consumer`. Repeat acquisitions by the same
 * consumer are idempotent (the set dedupes), so a hook that re-enters its start
 * path does not leak a reference and pin the mic open forever.
 *
 * Concurrent first-callers share one in-flight `getUserMedia` promise rather
 * than racing two permission prompts.
 */
/**
 * Task 20 §H (GDI run 8, 81.5 s): the student unmuted at 77.8 s, said "I sell
 * washing machine to customers.", muted at 81.4 s — and the transcript, landing
 * 0.1 s after the mute, was dropped (`perception_dropped_muted`: no utterance
 * was flagged in flight at the mute). A transcript that arrives while muted is
 * the student's answer when its speech began BEFORE the mute; when the start is
 * unknown, one arriving within SUBMIT_AFTER_MUTE_MS of the mute counts.
 */
export const SUBMIT_AFTER_MUTE_MS = 1500;
export function submitDespiteMute(input: { mutedAt: number | null | undefined; speechStartedAt: number | null | undefined; now: number }): boolean {
  const { mutedAt, speechStartedAt, now } = input;
  if (mutedAt == null) return false;
  if (speechStartedAt != null && Number.isFinite(speechStartedAt)) return speechStartedAt < mutedAt;
  return now - mutedAt <= SUBMIT_AFTER_MUTE_MS;
}

async function openWithPreference(): Promise<MediaStream> {
  if (preferredDeviceId) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: { ...AUDIO_CONSTRAINTS, deviceId: { exact: preferredDeviceId } },
      });
    } catch (err) {
      console.warn(`[shared-mic] preferred device "${preferredDeviceId}" failed to open — falling back to default:`, err);
      preferredDeviceId = null;
    }
  }
  return navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
}

export async function acquireSharedMicStream(consumer: string): Promise<MediaStream> {
  holders.add(consumer);

  // Live tracks? Reuse. A stream whose tracks have all ended (device unplugged,
  // OS revoked access) must be re-opened, not handed out dead.
  if (sharedStream && sharedStream.getAudioTracks().some((t) => t.readyState === 'live')) {
    return sharedStream;
  }
  if (pending) return pending;

  pending = openWithPreference()
    .then((stream) => {
      sharedStream = stream;
      pending = null;
      watchSharedMicTrack(stream);
      // Honour intents registered before the capture existed (the start-gate
      // mutes Ink2 at mount, well before any getUserMedia).
      applySharedMicEnabled();
      const settings = stream.getAudioTracks()[0]?.getSettings?.() ?? {};
      // Surfaces whether the browser actually HONORED echoCancellation — the
      // constraint is a request, not a guarantee, and this was the single
      // unverified assumption behind the mobile echo. Shows in the browser→
      // server log bridge alongside the other voice lifecycle lines.
      // Device label identifies the capture route (e.g. "AirPods Pro",
      // "Headset (…Hands-Free AG Audio)") — a Bluetooth/handsfree label here
      // explains "voice got slow/crackly when the mic opened" reports: AEC
      // capture can flip a BT device from A2DP into the degraded HFP profile
      // (suspected in session portal-734b537e…, 2026-07-31).
      const label = stream.getAudioTracks()[0]?.label ?? '';
      const summary =
        `echoCancellation=${(settings as MediaTrackSettings).echoCancellation} ` +
        `noiseSuppression=${(settings as MediaTrackSettings).noiseSuppression} ` +
        `autoGainControl=${(settings as MediaTrackSettings).autoGainControl} ` +
        `sampleRate=${(settings as MediaTrackSettings).sampleRate}` +
        (label ? ` device="${label.slice(0, 60)}"` : '');
      console.warn(`[shared-mic] opened for ${[...holders].join('+')} — ${summary}`);
      // Round-6: also surface to the persisted debug events (console lines
      // never leave the device). VoiceTutorRealtime forwards this.
      try {
        window.dispatchEvent(new CustomEvent('evelyn:shared-mic', { detail: { kind: 'opened', detail: summary } }));
      } catch {}
      return stream;
    })
    .catch((err) => {
      pending = null;
      throw err;
    });

  return pending;
}

/**
 * Release `consumer`'s handle. Stops the underlying tracks only once no
 * consumer holds one — releasing a consumer that never acquired is a no-op.
 */
export function releaseSharedMicStream(consumer: string): void {
  holders.delete(consumer);
  muteIntents.delete(consumer);
  applySharedMicEnabled();
  if (holders.size > 0) return;
  if (sharedStream) {
    sharedStream.getTracks().forEach((t) => {
      try { t.stop(); } catch {}
    });
    sharedStream = null;
  }
}

/**
 * Register `consumer`'s mute intent and re-resolve the track state (see file
 * header — the track goes hardware-off only once every expressed intent is
 * "muted"). Safe before the mic exists: the intent is remembered and applied
 * when the capture opens.
 */
export function setSharedMicConsumerMuted(consumer: string, muted: boolean): void {
  muteIntents.set(consumer, muted);
  applySharedMicEnabled();
}

/** Diagnostic only — reports whether the browser honored the AEC request. */
export function getSharedMicSettings(): MediaTrackSettings | null {
  const track = sharedStream?.getAudioTracks()[0];
  return track?.getSettings?.() ?? null;
}

/** The label of the currently-open capture, for the dead-mic banner's
 *  fallback picker ('' when no capture is open). */
export function getSharedMicLabel(): string {
  return sharedStream?.getAudioTracks()[0]?.label ?? '';
}

/** The device preference set by switchSharedMicDevice — read by
 *  usePerceptionWS's own getUserMedia so BOTH captures follow the switch. */
export function getPreferredMicDeviceId(): string | null {
  return preferredDeviceId;
}

/**
 * 2026-08-17 dead-mic recovery: point every future capture at `deviceId`
 * and kill the current stream so consumers' next start cycle reopens on
 * the new device. Holders and mute intents are deliberately kept — the
 * consumers themselves aren't going anywhere, their capture graphs are
 * simply rebuilt by the caller's reconnect choreography (VoiceTutorRealtime
 * drives ink/perception disconnect→connect and a production re-listen).
 */
export function switchSharedMicDevice(deviceId: string): void {
  preferredDeviceId = deviceId;
  if (sharedStream) {
    sharedStream.getTracks().forEach((t) => {
      try { t.stop(); } catch {}
    });
    sharedStream = null;
  }
  console.warn(`[shared-mic] device switch requested → ${deviceId} (stream dropped; consumers reopen on next acquire)`);
}

// ─────────────────────────────────────────────────────────────────────────
// Task 27 §G (GDI run 14, 1141 s): the student switched from AirPods to the
// laptop's microphone mid-session and the recogniser never heard him again —
// the capture stayed on the departed device. The session re-acquires the
// shared stream on the current default input (reacquireSharedMicStream) and
// every consumer re-points its OWN capture graph at the new stream
// (followSharedMicSwaps: a fresh MediaStreamSource into the same processor)
// — the WebSocket sessions, AudioContexts and processors are untouched.
// The active track's ended / mute / unmute are surfaced as the window event
// `evelyn:shared-mic-track` for the session's re-acquire decision
// (mic-reacquire.ts); the first audio frame after a swap as
// `evelyn:shared-mic-frame`.
// ─────────────────────────────────────────────────────────────────────────
type SharedMicSwapListener = (stream: MediaStream) => void;
const swapListeners = new Set<SharedMicSwapListener>();
let reacquireInFlight: Promise<MediaStream> | null = null;
let awaitingFirstFrame = false;
const watchedTracks = new WeakSet<MediaStreamTrack>();

function dispatchMicWindowEvent(name: string, detail: Record<string, unknown>): void {
  try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch {}
}

/** Surface the stream's audio track lifecycle (once per track). */
function watchSharedMicTrack(stream: MediaStream): void {
  const track = stream.getAudioTracks()[0];
  if (!track || watchedTracks.has(track) || typeof track.addEventListener !== 'function') return;
  watchedTracks.add(track);
  for (const kind of ['ended', 'mute', 'unmute'] as const) {
    track.addEventListener(kind, () => {
      // A replaced stream's track ends when it is stopped — not news.
      if (sharedStream && !sharedStream.getAudioTracks().includes(track)) return;
      dispatchMicWindowEvent('evelyn:shared-mic-track', { kind, label: track.label ?? '' });
    });
  }
}

/** The shared capture's track is muted at the source (OS / device), not by
 *  the student's mute button (that is `enabled`, which fires no event). */
export function sharedMicTrackMuted(): boolean {
  return sharedStream?.getAudioTracks()[0]?.muted === true;
}
/** A capture is open (some consumer holds the shared stream). */
export function sharedMicCaptureOpen(): boolean {
  return holders.size > 0 && sharedStream != null;
}
export function sharedMicReacquireInFlight(): boolean {
  return reacquireInFlight != null;
}

/** Subscribe to stream replacements; returns the unsubscribe. */
export function onSharedMicStreamSwapped(fn: SharedMicSwapListener): () => void {
  swapListeners.add(fn);
  return () => { swapListeners.delete(fn); };
}

/**
 * Re-point one consumer's capture graph at every replacement stream: the old
 * source is disconnected and a new MediaStreamSource from the same context
 * feeds the same processor. `isLive` false ⇒ the consumer has torn down (the
 * subscription removes itself). Returns the unsubscribe.
 */
export function followSharedMicSwaps(
  ctx: AudioContext,
  source: MediaStreamAudioSourceNode,
  processor: AudioNode,
  isLive: () => boolean,
  onStream?: (stream: MediaStream) => void,
): () => void {
  let current = source;
  const unsub = onSharedMicStreamSwapped((stream) => {
    if (!isLive()) { unsub(); return; }
    try { current.disconnect(); } catch {}
    current = ctx.createMediaStreamSource(stream);
    current.connect(processor);
    try { onStream?.(stream); } catch {}
  });
  return unsub;
}

/**
 * Open the shared capture again on the current default input (or the
 * student's chosen device, falling back to the default) and hand it to every
 * consumer; the old tracks stop after the swap. Holders and mute intents are
 * kept. One at a time: a call while one is in flight joins it.
 */
export function reacquireSharedMicStream(reason: string): Promise<MediaStream> {
  if (reacquireInFlight) return reacquireInFlight;
  if (holders.size === 0) return Promise.reject(new Error('no consumer holds the microphone'));
  reacquireInFlight = (async () => {
    const fresh = await openWithPreference();
    const old = sharedStream;
    sharedStream = fresh;
    applySharedMicEnabled();
    watchSharedMicTrack(fresh);
    awaitingFirstFrame = true;
    for (const fn of [...swapListeners]) { try { fn(fresh); } catch (err) { console.warn('[shared-mic] swap listener failed:', err); } }
    if (old && old !== fresh) old.getTracks().forEach((t) => { try { t.stop(); } catch {} });
    const label = fresh.getAudioTracks()[0]?.label ?? '';
    console.warn(`[shared-mic] re-acquired (${reason}) — device="${label.slice(0, 60)}"`);
    dispatchMicWindowEvent('evelyn:shared-mic', { kind: 'reacquired', detail: `${reason}${label ? ` device="${label.slice(0, 60)}"` : ''}` });
    return fresh;
  })().finally(() => { reacquireInFlight = null; });
  return reacquireInFlight;
}

/** Called by the consumers' processors for each live (unmuted) frame: the
 *  first frame after a swap is announced once (the on-stage notice clears). */
export function noteSharedMicFrame(): void {
  if (!awaitingFirstFrame) return;
  awaitingFirstFrame = false;
  dispatchMicWindowEvent('evelyn:shared-mic-frame', {});
}
