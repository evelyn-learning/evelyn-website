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
 * Track-enable semantics are deliberately shared, not per-consumer: the only
 * caller that toggles `track.enabled` is the student's mute button, and "muted"
 * must mean muted for the STT path and the recorder alike. Per-consumer
 * software gates (Ink2's `mutedRef`, the production WS's own send guards) are
 * unaffected and still apply on top.
 *
 * Teardown is refcounted so one consumer stopping (the production WS commits a
 * turn and calls `stopListening()` mid-session) cannot pull the mic out from
 * under the other. Tracks stop only when the last handle is released.
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

  pending = navigator.mediaDevices
    .getUserMedia({ audio: AUDIO_CONSTRAINTS })
    .then((stream) => {
      sharedStream = stream;
      pending = null;
      const settings = stream.getAudioTracks()[0]?.getSettings?.() ?? {};
      // Surfaces whether the browser actually HONORED echoCancellation — the
      // constraint is a request, not a guarantee, and this was the single
      // unverified assumption behind the mobile echo. Shows in the browser→
      // server log bridge alongside the other voice lifecycle lines.
      console.warn(
        `[shared-mic] opened for ${[...holders].join('+')} — ` +
        `echoCancellation=${(settings as MediaTrackSettings).echoCancellation} ` +
        `noiseSuppression=${(settings as MediaTrackSettings).noiseSuppression} ` +
        `autoGainControl=${(settings as MediaTrackSettings).autoGainControl} ` +
        `sampleRate=${(settings as MediaTrackSettings).sampleRate}`,
      );
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
  if (holders.size > 0) return;
  if (sharedStream) {
    sharedStream.getTracks().forEach((t) => {
      try { t.stop(); } catch {}
    });
    sharedStream = null;
  }
}

/**
 * Student mute button. Applies to every consumer by design (see file header).
 * No-op when the mic isn't open, so an early mute before Start can't throw.
 */
export function setSharedMicEnabled(enabled: boolean): void {
  if (!sharedStream) return;
  sharedStream.getTracks().forEach((t) => { t.enabled = enabled; });
}

/** Diagnostic only — reports whether the browser honored the AEC request. */
export function getSharedMicSettings(): MediaTrackSettings | null {
  const track = sharedStream?.getAudioTracks()[0];
  return track?.getSettings?.() ?? null;
}
