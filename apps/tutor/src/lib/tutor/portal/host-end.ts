/**
 * Host → embed "end" channel and student-activity throttle (GreenApple spec
 * 2026-10-02 §1). Pure helpers; the embed page (tutor-portal/embed) wires
 * them to `window.message` and `window.parent.postMessage`.
 *
 * Why the channel exists: a host that drops the iframe on its own (the
 * academy's "I've finished this concept" button, its idle sweep, a usage
 * ceiling) skips the engine's end path, and the client-side accumulator
 * (gaps, evidence, learner deltas) is only shipped by that path. With
 * `evelyn:host_end` the host asks the engine to end itself: a fixed goodbye
 * line (no model call), the final flush, then `evelyn:session_ended` with
 * `ended_reason` = the host's reason.
 */

export const HOST_END_REASONS = ['finished', 'minutes_exhausted', 'no_input', 'idle'] as const;
export type HostEndReason = (typeof HOST_END_REASONS)[number];

/** Accepts only `{ type: 'evelyn:host_end', reason: <one of HOST_END_REASONS> }`. */
export function parseHostEnd(data: unknown): { reason: HostEndReason } | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const d = data as { type?: unknown; reason?: unknown };
  if (d.type !== 'evelyn:host_end') return null;
  if (typeof d.reason !== 'string') return null;
  if (!(HOST_END_REASONS as readonly string[]).includes(d.reason)) return null;
  return { reason: d.reason as HostEndReason };
}

/** Fixed goodbye lines (spec §1). `idle` shares the `no_input` line. */
export function goodbyeFor(reason: HostEndReason): string {
  switch (reason) {
    case 'finished':
      return 'Nice work today — that\'s the session.';
    case 'minutes_exhausted':
      return 'Your program\'s tutoring minutes for this month are used up. See you next month.';
    case 'no_input':
    case 'idle':
      return 'I\'ll stop here since it\'s gone quiet — come back any time.';
  }
}

/** True when `expected` is unset (the embed may not know its host — the
 *  caller still requires `event.source === window.parent`), else an exact
 *  origin match. */
export function isAllowedHostOrigin(eventOrigin: string, expected: string | undefined): boolean {
  if (!expected) return true;
  return eventOrigin === expected;
}

/** A host_end is acted on only while NO end of any kind has begun: not a
 *  previous host_end, not the student's End (VTR teardown already running),
 *  and not a session whose session_ended was already posted. Otherwise a
 *  student-initiated end would be relabelled with the host's reason, or the
 *  session would end twice. */
export function shouldAcceptHostEnd(state: {
  hostEndStarted: boolean;
  teardownStarted: boolean;
  sessionEndedPosted: boolean;
}): boolean {
  return !state.hostEndStarted && !state.teardownStarted && !state.sessionEndedPosted;
}

/** `evelyn:activity` is posted at most once per this many ms. */
export const ACTIVITY_THROTTLE_MS = 5000;

/** Throttle for `evelyn:activity`: post when nothing was posted yet, when
 *  the last post is at least ACTIVITY_THROTTLE_MS old, or when the clock
 *  went backwards (never let a clock jump silence the signal). */
export function shouldPostActivity(lastMs: number | null, nowMs: number): boolean {
  if (lastMs === null) return true;
  if (nowMs < lastMs) return true;
  return nowMs - lastMs >= ACTIVITY_THROTTLE_MS;
}
