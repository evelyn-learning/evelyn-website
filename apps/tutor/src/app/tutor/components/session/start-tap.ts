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

export type AgendaPickFailureStage = 'no-context' | 'refetch-unavailable' | 'refetch-failed';
export type AgendaPickFailureAction = 'plain-start' | 'kickoff-lesson' | 'ignore';

/**
 * What to do when an agenda-row pick cannot complete (2026-08-17 triage).
 * A pre-start pick IS the student's start gesture, so its failure must not
 * strand the session:
 * - 'no-context' happens BEFORE gestureSessionStart ran — nothing was
 *   dispatched, so run the plain full start (micClick path, kickoff and
 *   all) and let the pick itself go.
 * - the refetch stages happen AFTER gestureSessionStart marked the session
 *   started (warmup armed, orb demoted) but before any brain dispatch —
 *   kick the lesson so the student gets the normal opener instead of a
 *   spinner that only the 40s fail net clears.
 * Mid-session picks keep the historical log-and-ignore.
 */
export function resolveAgendaPickFailure(opts: {
  isFirstGesture: boolean;
  stage: AgendaPickFailureStage;
}): AgendaPickFailureAction {
  if (!opts.isFirstGesture) return 'ignore';
  return opts.stage === 'no-context' ? 'plain-start' : 'kickoff-lesson';
}

export type StartWatchdogAction = 'none' | 'log-idle' | 'restore-start';

/** How long a mounted, un-started session may sit before the watchdog acts. */
export const START_WATCHDOG_MS = 30_000;

/**
 * Pre-start watchdog rule (2026-08-17 triage): the safety net for
 * silent-death variants the tap resolver can't reach — an agenda pick stuck
 * mid-flight (agendaEngaged latched, orb no longer a start button), a
 * startSession handle that wasn't attached yet, or paths not discovered
 * yet. Fired START_WATCHDOG_MS after mount while the session hasn't
 * started: 'restore-start' un-latches a stuck agenda pick so the orb is a
 * start button again; 'log-idle' just leaves a telemetry trace (the orb is
 * already the affordance — a student reading the pre-start screen for 30s
 * is legitimate).
 */
export function resolveStartWatchdog(opts: {
  started: boolean;
  agendaEngaged: boolean;
}): StartWatchdogAction {
  if (opts.started) return 'none';
  return opts.agendaEngaged ? 'restore-start' : 'log-idle';
}

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
