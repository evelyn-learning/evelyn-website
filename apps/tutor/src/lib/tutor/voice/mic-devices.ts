/**
 * Pure fallback-mic picker for the dead-mic banner. Exercised by
 * scripts/test-mic-devices.ts.
 *
 * 2026-08-17 triage: macOS handed three separate sessions the iPhone
 * Continuity microphone, which recorded pure silence (peak −∞ dBFS); the
 * student's only remedy was restarting the whole session with the MacBook
 * mic. When the truly-dead banner shows, this rule picks the device the
 * one-tap "switch" offer names: real audio inputs only (no outputs, no
 * 'default'/'communications' pseudo-devices, no blank permission-less
 * labels), never the current device (including its "Default -" wrapper),
 * never one already tried this session, built-in hardware first.
 */

export interface MicDeviceCandidate {
  deviceId: string;
  label: string;
  kind: string;
}

const PSEUDO_DEVICE_IDS = new Set(['default', 'communications']);
const BUILT_IN_RE = /built-in|internal microphone|macbook\s.*\bmic(?:rophone)?\b/i;

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/^default\s*-\s*/, '');
}

export function pickFallbackMicDevice(
  devices: MicDeviceCandidate[],
  currentLabel: string,
  triedDeviceIds: string[],
): { deviceId: string; label: string } | null {
  const current = normalizeLabel(currentLabel);
  const tried = new Set(triedDeviceIds);
  const candidates = devices.filter((dev) =>
    dev.kind === 'audioinput' &&
    dev.deviceId &&
    !PSEUDO_DEVICE_IDS.has(dev.deviceId) &&
    dev.label.trim() !== '' &&
    !tried.has(dev.deviceId) &&
    normalizeLabel(dev.label) !== current,
  );
  if (candidates.length === 0) return null;
  const builtIn = candidates.find((dev) => BUILT_IN_RE.test(dev.label));
  const chosen = builtIn ?? candidates[0];
  return { deviceId: chosen.deviceId, label: chosen.label };
}
