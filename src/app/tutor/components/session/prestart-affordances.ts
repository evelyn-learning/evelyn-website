/**
 * Pure pre-start affordance rules for the tutor session UI. No React, no DOM
 * — imported by both SessionStage (the orb) and VoiceTutorRealtime (the dock)
 * and exercised by scripts/test-prestart-affordances.ts.
 *
 * Context (2026-07-26 trial feedback): a first-time student saw two mic icons
 * in the bottom dock (start + mute) and a big "Tap the mic below to start"
 * instruction in the center of the stage pointing at the very bottom edge of
 * the frame. The redesign makes the ORB the primary start control and leaves
 * the dock as a quieter second way in (voice or typed).
 */

/** Does the dock render its mute toggle?
 *
 *  Pre-start it does not: there is no audio to mute yet, and a second mic
 *  glyph beside the start mic reads as a competing start control. It appears
 *  the moment the session starts, in exactly the place it has always been.
 *  The `isPaused` exclusion is pre-existing behavior, preserved here. */
export function showsDockMuteButton(opts: { hasStarted: boolean; isPaused: boolean }): boolean {
  return opts.hasStarted && !opts.isPaused;
}

/** The dock's status line when no live caption or transient state overrides it.
 *
 *  Muted is checked first because it is actionable regardless of phase. The
 *  pre-start string deliberately says "or" — the orb is the primary call to
 *  action now, and this line's job is to tell a student who cannot or will
 *  not speak that typing works too. */
export function preStartDockCaption(opts: { started: boolean; muted: boolean }): string {
  if (opts.muted) return 'Muted — tap the mic to talk';
  return opts.started ? 'Listening…' : 'or start here — talk or type';
}

/** Is the center orb an interactive start button right now?
 *
 *  Only before the session starts, only when a start path is actually wired
 *  (`canStart` is false on hosts that never pass an `onOrbStart`), and never
 *  while an agenda pick is already in flight — that tap has fired the start
 *  sequence and the orb must not double-kick the brain. Once the session is
 *  running the orb returns to being a presence indicator. */
export function orbIsStartButton(opts: { started: boolean; canStart: boolean; agendaEngaged: boolean }): boolean {
  return !opts.started && opts.canStart && !opts.agendaEngaged;
}
