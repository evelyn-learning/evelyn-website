/**
 * Exact-text dedupe window for perception brain dispatches.
 *
 * The perception direct-dispatch and late-fallback paths bypass the
 * production-WS suppress window by design (bypassPerceptionDedupe) —
 * but that leaves them with NO protection against perception itself
 * re-emitting a transcript, e.g. after a mic-permission reconnect.
 * Observed live (session-1783615623994, 2026-07-09): the same utterance
 * dispatched twice 2.05s apart; the second queued behind the busy brain
 * and drained as a second reply that re-introduced the tutor.
 *
 * Window is deliberately SHORT (6s) and exact-match on normalized text:
 * a genuine repeated answer ("yes" to two consecutive questions) cannot
 * recur that fast — a tutor reply cycle (brain + TTS) exceeds 6s. The
 * window anchors to the accepted dispatch; duplicates don't extend it.
 */
const WINDOW_MS = 6_000;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export class DispatchDeduper {
  private lastText = '';
  private lastAt = -Infinity;

  /** True → dispatch (and record it); false → duplicate, drop. */
  shouldDispatch(text: string, now: number): boolean {
    const norm = normalize(text);
    if (norm === this.lastText && now - this.lastAt < WINDOW_MS) {
      return false;
    }
    this.lastText = norm;
    this.lastAt = now;
    return true;
  }
}
