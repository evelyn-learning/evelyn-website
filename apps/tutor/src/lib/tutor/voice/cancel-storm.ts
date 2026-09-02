/**
 * Cancel-storm governor for perception stage2/3 barge-in cancels.
 *
 * The livelock (session-1783615559112, 2026-07-09): a student who hears
 * silence re-speaks every few seconds; each speech_started fires a
 * cancel that aborts the nascent recovery reply, so no tutor turn ever
 * completes. Perception latency (9–15s) makes each cycle long enough
 * that the student gives up and refreshes.
 *
 * The governor caps cancels in a rolling window. Once the cap is hit,
 * cancels are suppressed: the in-flight reply plays out and the
 * student's new transcript flows the normal path (queued behind the
 * busy brain). Legitimate barge-ins are sparse — a student interrupting
 * more than twice in ~45s without ever hearing a full reply is, in
 * every observed case, the "tutor is deaf" livelock, not real use.
 *
 * `recordDelivery()` — a tutor turn whose audio fully played — resets
 * the history, so a healthy back-and-forth never accumulates toward
 * the cap.
 */
const WINDOW_MS = 45_000;
const MAX_CANCELS_PER_WINDOW = 2;

/** Issue G (embed-1788187567764): explicit stop imperatives must never be
 *  storm-suppressed — a student shouting "stop" while the storm breaker is
 *  engaged is exactly the moment the breaker exists to protect, inverted.
 *
 *  A bare `\bstop\b` also matches "the bus stop is far" (a noun mid-
 *  sentence), so this anchors on IMPERATIVE POSITION instead: the
 *  stop-word must be the first word of the utterance (however it's
 *  followed — "stop", "stop talking") or the last word of it (however
 *  it's preceded — "No, no, stop."). A stop-word buried mid-sentence
 *  with content on both sides ("the bus stop is far", "I can't wait for
 *  class") matches neither edge and is correctly rejected. */
export const STOP_IMPERATIVE_RE =
  /^\s*\b(?:stop|wait|pause|hold on|be quiet|quiet|shush)\b|\b(?:stop|wait|pause|hold on|be quiet|quiet|shush)\b[.!,]?\s*$/i;

export class CancelStormGovernor {
  private cancelTimes: number[] = [];

  /** May a stage2/3 (or retro) cancel fire right now? */
  allowCancel(now: number, opts?: { stopImperative?: boolean }): boolean {
    if (opts?.stopImperative) return true;
    this.prune(now);
    return this.cancelTimes.length < MAX_CANCELS_PER_WINDOW;
  }

  recordCancel(now: number): void {
    this.prune(now);
    this.cancelTimes.push(now);
  }

  /** A tutor turn's audio fully played — the loop is healthy; reset. */
  recordDelivery(): void {
    this.cancelTimes = [];
  }

  private prune(now: number): void {
    this.cancelTimes = this.cancelTimes.filter((t) => now - t < WINDOW_MS);
  }
}
