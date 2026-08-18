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
export async function acquireSharedMicStream(consumer: string): Promise<MediaStream> {
  holders.add(consumer);

  // Live tracks? Reuse. A stream whose tracks have all ended (device unplugged,
  // OS revoked access) must be re-opened, not handed out dead.
  if (sharedStream && sharedStream.getAudioTracks().some((t) => t.readyState === 'live')) {
    return sharedStream;
  }
  if (pending) return pending;

  const openWithPreference = async (): Promise<MediaStream> => {
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
  };

  pending = openWithPreference()
    .then((stream) => {
      sharedStream = stream;
      pending = null;
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
