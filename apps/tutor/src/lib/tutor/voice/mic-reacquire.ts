/**
 * Task 27 §G (GDI run 14, 1141 s): when to re-acquire the shared microphone
 * mid-session. Pure; the wiring lives in VoiceTutorRealtime (devicechange +
 * the shared track's ended / mute events, see shared-mic.ts).
 *
 *  - `devicechange` (an input appeared / disappeared / the default changed)
 *    ⇒ re-acquire — unless one ran within MIC_REACQUIRE_COOLDOWN_MS (the
 *    event fires in bursts while a Bluetooth device connects);
 *  - the track `ended` ⇒ re-acquire;
 *  - the track muted at the source for ≥ MIC_TRACK_MUTED_REACQUIRE_MS ⇒
 *    re-acquire; shorter ⇒ wait (re-check when the threshold passes);
 *  - a re-acquire in flight, no capture open, or the flag off ⇒ ignore.
 * The student's own mute button sets `track.enabled` and fires none of
 * these (mic_mute / mic_unmute are unchanged).
 */
export const MIC_TRACK_MUTED_REACQUIRE_MS = 3000;
export const MIC_REACQUIRE_COOLDOWN_MS = 1500;

export type MicReacquireTrigger =
  | { kind: 'devicechange' }
  | { kind: 'track-ended' }
  | { kind: 'track-muted'; mutedForMs: number };

export function micReacquireDecision(
  trigger: MicReacquireTrigger,
  state: { enabled: boolean; captureOpen: boolean; inFlight: boolean; sinceLastReacquireMs?: number | null },
): 'reacquire' | 'wait' | 'ignore' {
  if (!state.enabled || !state.captureOpen || state.inFlight) return 'ignore';
  if (trigger.kind === 'devicechange') {
    const since = state.sinceLastReacquireMs;
    return since != null && since < MIC_REACQUIRE_COOLDOWN_MS ? 'ignore' : 'reacquire';
  }
  if (trigger.kind === 'track-ended') return 'reacquire';
  return trigger.mutedForMs >= MIC_TRACK_MUTED_REACQUIRE_MS ? 'reacquire' : 'wait';
}

/** The `mic_device_changed` event detail. */
export function micReacquireReason(trigger: MicReacquireTrigger): string {
  return trigger.kind === 'track-muted' ? `track-muted ${(trigger.mutedForMs / 1000).toFixed(1)}s` : trigger.kind;
}

/** Fix round 1 (m-8): `devicechange` also fires for output-only or unrelated
 *  devices. The capture is re-acquired only when the system DEFAULT input is
 *  no longer the device being captured (labels compared without the
 *  "Default - " wrapper), or the default cannot be read. */
export function defaultInputChanged(
  devices: ReadonlyArray<{ kind: string; deviceId: string; label: string }>,
  currentLabel: string,
): boolean {
  const norm = (x: string) => x.trim().toLowerCase().replace(/^default\s*-\s*/, '');
  const inputs = devices.filter((d) => d.kind === 'audioinput');
  const def = inputs.find((d) => d.deviceId === 'default') ?? inputs[0];
  if (!def || !def.label.trim() || !currentLabel.trim()) return true;
  return norm(def.label) !== norm(currentLabel);
}
