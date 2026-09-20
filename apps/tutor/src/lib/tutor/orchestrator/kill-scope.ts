/**
 * Which of a killed attempt's tool calls must NOT dispatch.
 *
 * portal-704e3e01 (2026-09-04) @1414.3s: the false-assertion guard killed the
 * turn's speech at 1414.3s and mark_segment_complete (1418.8s), advance_lesson
 * (1419.9s), add_topic_notes_pointer (1421.6s) and the next segment's
 * show_problem (1423.2s) all dispatched afterwards. performKill drops the
 * render buffer and resets the TTS counters but never touched tool calls, and
 * the streaming loop gates only speech on `attemptKilled`. The lesson advanced
 * on a turn the student never heard, and the retry narrated the board it had
 * been moved to — "I don't know if I got that last question correct."
 *
 * Deliberately narrow: ONLY tools that mutate lesson position/progress. Render
 * tools are excluded on purpose — TUTOR_KEEP_VALIDATED_ON_KILL exists so a
 * validated figure survives a dropped narration, and withholding renders here
 * would fight it. Unknown tools are never withheld: a guard that silently
 * swallows a tool nobody registered is the drift class isTeachingRenderAction
 * was introduced to end.
 *
 * Pure module — no imports, no side effects, never throws.
 */

/** Tools whose effect is lesson STATE, not board content. */
export const LESSON_STATE_TOOLS: ReadonlySet<string> = new Set([
  'advance_lesson',
  'mark_segment_complete',
  'add_topic_notes_pointer',
  'show_segment_card',
]);

export function shouldWithholdAfterKill(toolName: string): boolean {
  return LESSON_STATE_TOOLS.has(toolName ?? '');
}
