/**
 * Pure decision rule for a mic/orb tap in the tutor session. No React, no
 * DOM — imported by VoiceTutorRealtime's handleMicClick and exercised by
 * scripts/test-start-tap.ts.
 *
 * Why this exists (2026-08-17 triage, portal-96a436f0): handleMicClick was
 * an if/else-if chain whose FIRST branch treated any tap during
 * realtime.state === 'listening' as a stop-listening toggle. The relay can
 * reach 'listening' before the session starts (pre-start input-blur and
 * unmute both used to call startListening unconditionally), so a student's
 * Start tap could resolve to a silent stop-listening no-op — a session that
 * never begins, with no telemetry. R40 queued taps that land while the
 * relay is connecting, but only that state. The rule this module pins:
 *
 *   BEFORE the session starts, a tap is ALWAYS a start intent —
 *   'start' when the relay is ready, 'queue-start' when it isn't,
 *   'resume-continue' for a rehydrated session. Never a toggle.
 *
 * After the session starts, taps keep their historical toggle semantics.
 * 'none' is returned instead of silently falling off the chain so the
 * caller can still record telemetry for the tap.
 */

export type StartTapAction =
  | 'resume-continue' // rehydrated session: kick the brain to pick it back up
  | 'start'           // relay ready: run the full start sequence now
  | 'queue-start'     // relay not ready: unlock audio in-gesture, complete on connect (R40)
  | 'stop-listening'  // in-session: student toggles the mic off
  | 'interrupt'       // in-session: student cuts the tutor off
  | 'none';           // in-session, relay down: nothing actionable (telemetry only)

export function resolveStartTap(opts: {
  hasStarted: boolean;
  hasResumeState: boolean;
  realtimeState: string;
  isConnected: boolean;
}): StartTapAction {
  const { hasStarted, hasResumeState, realtimeState, isConnected } = opts;
  if (!hasStarted) {
    // Pre-start: every tap is a start intent, regardless of relay state.
    if (hasResumeState) return 'resume-continue';
    return isConnected ? 'start' : 'queue-start';
  }
  if (realtimeState === 'listening') return 'stop-listening';
  if (realtimeState === 'speaking') return 'interrupt';
  return isConnected ? 'start' : 'none';
}
