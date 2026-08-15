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

export class CancelStormGovernor {
  private cancelTimes: number[] = [];

  /** May a stage2/3 (or retro) cancel fire right now? */
  allowCancel(now: number): boolean {
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
