/**
 * Tutor brain v2 — a last-line net for tool names in the tutor's words.
 *
 * Once in a while the model writes a tool's name into its reply ("Then
 * end_lesson."). The student must never hear or read that. A sentence that
 * contains a tool name is dropped whole; everything else passes untouched.
 * This is a safety net for a rare slip, not a way of steering the tutor.
 */
const TOOL_NAME = /\b(?:end_lesson|update_session_note|set_goal_status|track_gap|new_page|go_to_page|tutor_handwrite|show_[a-z]+(?:_[a-z]+)*)\b/;

export function mentionsTool(text: string): boolean {
  return TOOL_NAME.test(text);
}

/** Removes the sentences of `text` that name a tool. Paragraph breaks are kept. */
export function stripToolTalk(text: string): string {
  if (!mentionsTool(text)) return text;
  return text
    .split(/\n\n+/)
    .map((para) => (para.match(/[^.!?]+[.!?]*["')\]]*\s*/g) ?? [para]).filter((s) => !mentionsTool(s)).join('').trim())
    .filter(Boolean)
    .join('\n\n');
}
