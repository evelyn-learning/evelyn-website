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

/** Tool names that never paint a board item on their own. A turn made only of
 *  these has nothing for Rule 8 to repair — live 2026-09-06 the client
 *  requested repairs after `advance_lesson` and after two `tutor_scroll_whiteboard`
 *  calls (painted=0 is CORRECT for both), which then re-asked the model for ink
 *  it never meant to draw. Unknown names are counted (fail toward repair). */
export const NON_RENDER_TOOL_NAMES: ReadonlySet<string> = new Set([
  'advance_lesson', 'mark_segment_complete', 'record_gap', 'flag_prerequisite_gap',
  'close_session_notes', 'propose_plan_swap', 'confirm_plan_los',
  'expand_topic_notes_theory', 'add_topic_notes_method', 'add_topic_notes_pointer',
  'tutor_scroll_whiteboard', 'go_to_page', 'new_page', 'generate_problem',
  'clear', 'list_whiteboard_features', 'hold_for_student',
]);

export function countBoardRenderTools(names: string[]): number {
  return names.filter((n) => !NON_RENDER_TOOL_NAMES.has(n)).length;
}
