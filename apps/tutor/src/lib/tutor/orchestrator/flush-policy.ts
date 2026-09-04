/**
 * When to persist debug events sooner than the ordinary 30s cadence.
 *
 * portal-00fa1bb7, portal-5bc0fc1e and portal-c3007206 (2026-09-03/04) each
 * hold ZERO debug events. All three emitted mount-time perception_state and
 * shared_mic events — the cartesia-token requests in nginx prove perception
 * connected — and none survived: events ride the 30s interval or a
 * beforeunload beacon that an iframed embed does not reliably receive. A
 * session that dies inside the first window loses 100% of its telemetry, and
 * those are precisely the sessions a triage needs.
 *
 * The window is deliberately short and one-shot per new event batch: it costs
 * a long session nothing (after EARLY_FLUSH_MS the 30s interval owns the
 * cadence again) and it costs a dead session one extra POST.
 *
 * Pure module — no side effects, never throws.
 */

/** Window during which any new event is worth an immediate post. Measured
 *  from the first start_tap (see controller ruling on task 12), not mount —
 *  a page load with no tap is navigation and mints nothing; a tap that never
 *  became a session must get its telemetry. */
export const EARLY_FLUSH_MS = 10_000;
/** Number of new events that justifies a post inside that window. */
export const EARLY_FLUSH_EVENTS = 1;

export function shouldFlushEarly(args: {
  /** debugEventsRef.current.length */
  eventCount: number;
  /** lastSavedDebugCountRef.current */
  lastFlushedCount: number;
  /** now - first start_tap time (see controller ruling on task 12) */
  msSinceMount: number;
}): boolean {
  if (args.msSinceMount > EARLY_FLUSH_MS) return false;
  return args.eventCount - args.lastFlushedCount >= EARLY_FLUSH_EVENTS;
}
