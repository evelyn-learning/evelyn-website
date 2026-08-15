/**
 * Rule-8 v2 client-side decision predicate — its own module (not
 * rule8-repair.ts) so VoiceTutorRealtime can import it without dragging the
 * Anthropic SDK into the client bundle. rule8-repair.ts re-exports it for
 * the server route and tests.
 */

export interface ClientRepairSignals {
  /** tool-call frames the server sent this turn (incl. any server repairs). */
  serverToolCount: number;
  /** renders that actually landed on the board this turn (assignedIds). */
  paintedCount: number;
  /** sentences actually spoken this turn — a silent turn has nothing to board. */
  sentenceCount: number;
}

/** Fire ONLY when the server sent tools and none painted. The in-stream
 *  server pass owns serverToolCount===0 — the two are mutually exclusive so
 *  a turn can never double-repair. */
export function shouldClientRequestRepair(s: ClientRepairSignals): boolean {
  return s.serverToolCount > 0 && s.paintedCount === 0 && s.sentenceCount > 0;
}
