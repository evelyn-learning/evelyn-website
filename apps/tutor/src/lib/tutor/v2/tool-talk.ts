/**
 * Tutor brain v2 — a last-line net for tool names in the tutor's words.
 *
 * Once in a while the model writes a tool's name into its reply ("Then
 * end_lesson."). The student must never hear or read that. A sentence that
 * contains a tool name is dropped whole; everything else passes untouched.
 * This is a safety net for a rare slip, not a way of steering the tutor.
 */
const TOOL_NAME = /\b(?:end_lesson|update_session_note|set_goal_status|track_gap|record_thinking|keep_listening|new_page|go_to_page|tutor_handwrite|show_[a-z]+(?:_[a-z]+)*)\b/;

/** The same slip in plain words: an order to the board said aloud ("Open a new page for it.", embed-1794500923861). */
const BOARD_ORDER = /(?:^|[.!?]\s+)(?:open|start|turn to|create|add|begin) (?:a|the) new page\b/i;

/** An order to itself said aloud ("Record the direction, then close.", discussion replay round 8). */
const SELF_ORDER = /(?:^|[.!?]\s+)(?:record|log) (?:the|their|this|that|it)\b|\bthen close\b/i;

/** A thought about the student said aloud to them ("The student is still thinking, so I'll stay quiet.", portal-b8ee9d0f). */
const ASIDE = /\bthe student\b[^.!?]*\bI(?:'ll|’ll| will| should|'m| am)\b/i;

export function mentionsTool(text: string): boolean {
  return ASIDE.test(text) || TOOL_NAME.test(text) || BOARD_ORDER.test(text) || SELF_ORDER.test(text);
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
