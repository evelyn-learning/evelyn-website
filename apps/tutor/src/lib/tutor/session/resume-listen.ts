// src/lib/tutor/session/resume-listen.ts
/**
 * Should a session-start gesture open the production mic (realtime
 * .startListening())? Pure decision.
 *
 * WHY: `startListening` (useOpenAIRealtime) is the ONLY thing that creates
 * the ScriptProcessor feeding the student track of the session recording.
 * The normal Start tap calls it; the RESUME path ("Continue lesson" overlay
 * / mic-dock resume tap → resumeContinue) never did. Speech recognition kept
 * working (it captures through its own shared-mic consumer), so the gap was
 * invisible in the session itself — every resumed session simply had no
 * student audio in its recording.
 *
 * The rule is the one the Start tap already applies: open the mic unless the
 * student muted before starting, and never in text mode (which must not
 * touch the microphone at all).
 */
export type ListenOnStartReason = 'ok' | 'flag-off' | 'text-mode' | 'muted';

export function shouldStartListeningOnSessionStart(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_RESUME_START_LISTENING !== 'off'). */
  enabled: boolean;
  sessionMode: 'voice' | 'text';
  micMuted: boolean;
}): { start: boolean; reason: ListenOnStartReason } {
  if (input.sessionMode === 'text') return { start: false, reason: 'text-mode' };
  if (!input.enabled) return { start: false, reason: 'flag-off' };
  if (input.micMuted) return { start: false, reason: 'muted' };
  return { start: true, reason: 'ok' };
}

/**
 * Typed-first start in a VOICE session (2026-10-03).
 *
 * WHY: the in-session composer's submit stamped the clock and unlocked audio
 * but deliberately did not latch hasStarted in voice mode. Focusing the
 * composer had already called muteInput() (userMutedRef = true in the hook),
 * and its blur only calls startListening() once hasStarted is true — so the
 * hook's own auto-listen stayed blocked and the student recorder never
 * opened. Perception (STT) was muted too: its start-gate keys on hasStarted.
 * The student's only way out was the mic tap, which — hasStarted still false
 * — resolved to 'start' and sent a SECOND [start lesson] kickoff over the
 * lesson already under way.
 *
 * Two decisions:
 *  - shouldLatchStartOnTypedSubmit: the first typed message IS the session
 *    start (voice mode, not a rehydrated session — that keeps its dedicated
 *    resumeContinue gesture). Text mode has its own latch and no mic.
 *  - resolveTypedFirstMicTap: the first mic tap after a typed-first start
 *    opens the mic (unless the composer's blur already did). It is consulted BEFORE the ordinary tap rule
 *    (resolveStartTap) because that rule would make the tap inert
 *    (state-only dock), a stop toggle (the composer's blur can put the relay
 *    in 'listening' an instant before the click) or — pre-fix — a restart.
 *    'defer' hands the tap to the ordinary rule.
 */
export type TypedSubmitLatchReason = 'ok' | 'flag-off' | 'text-mode' | 'already-started' | 'resume';

export function shouldLatchStartOnTypedSubmit(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_TYPED_FIRST_START !== 'off'). */
  enabled: boolean;
  sessionMode: 'voice' | 'text';
  hasStarted: boolean;
  hasResumeState: boolean;
}): { latch: boolean; reason: TypedSubmitLatchReason } {
  if (input.sessionMode === 'text') return { latch: false, reason: 'text-mode' };
  if (!input.enabled) return { latch: false, reason: 'flag-off' };
  if (input.hasStarted) return { latch: false, reason: 'already-started' };
  if (input.hasResumeState) return { latch: false, reason: 'resume' };
  return { latch: true, reason: 'ok' };
}

export type TypedFirstMicTapAction = 'open-mic' | 'stay-muted' | 'ignore' | 'defer';
export type TypedFirstMicTapReason =
  | 'typed-first' | 'muted' | 'same-gesture' | 'flag-off' | 'text-mode' | 'not-typed-first' | 'not-started';

/** A tap this soon after the composer's blur opened the mic IS that blur's
 *  click (the student tapped the orb while the composer had focus). */
export const TYPED_FIRST_SAME_GESTURE_MS = 500;

/**
 * The pending state must be cleared by whichever comes first — it used to be
 * cleared only by an un-muted tap, and swallowed taps for the rest of the
 * session otherwise (2026-10-04):
 *  - the composer's BLUR opening the mic clears it (caller). The click that
 *    caused that blur lands within TYPED_FIRST_SAME_GESTURE_MS: 'ignore'
 *    (it must not toggle the just-opened mic off). Any later tap: 'defer'.
 *  - 'stay-muted': the caller clears it and hands the tap to the ordinary
 *    rule (the session is started, so that rule can interrupt but never
 *    sends a start kickoff).
 *  - 'open-mic': the caller clears it and opens the mic.
 */
export function resolveTypedFirstMicTap(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_TYPED_FIRST_START !== 'off'). */
  enabled: boolean;
  sessionMode: 'voice' | 'text';
  hasStarted: boolean;
  /** The session was started by a typed first message and neither a mic tap
   *  nor the composer's blur has opened the mic since. */
  typedFirstTapPending: boolean;
  /** The student explicitly muted (the Mute button), not the composer's
   *  transient focus mute. */
  micMuted: boolean;
  /** ms since the composer's blur first opened the mic after a typed-first
   *  start; null / omitted = it has not. */
  sinceBlurOpenedMicMs?: number | null;
}): { action: TypedFirstMicTapAction; reason: TypedFirstMicTapReason } {
  if (input.sessionMode === 'text') return { action: 'defer', reason: 'text-mode' };
  if (!input.enabled) return { action: 'defer', reason: 'flag-off' };
  if (!input.typedFirstTapPending) {
    const since = input.sinceBlurOpenedMicMs;
    if (typeof since === 'number' && since >= 0 && since < TYPED_FIRST_SAME_GESTURE_MS) {
      return { action: 'ignore', reason: 'same-gesture' };
    }
    return { action: 'defer', reason: 'not-typed-first' };
  }
  if (!input.hasStarted) return { action: 'defer', reason: 'not-started' };
  if (input.micMuted) return { action: 'stay-muted', reason: 'muted' };
  return { action: 'open-mic', reason: 'typed-first' };
}
