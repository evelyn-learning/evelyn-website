/**
 * Tutor brain v2 — a last-line net for tool names in the tutor's words.
 *
 * Once in a while the model writes a tool's name into its reply ("Then
 * end_lesson."). The student must never hear or read that. A sentence that
 * contains a tool name is dropped whole; everything else passes untouched.
 * This is a safety net for a rare slip, not a way of steering the tutor.
 */
const TOOL_NAME = /\b(?:end_lesson|update_session_note|set_goal_status|track_gap|record_thinking|keep_listening|switch_language|new_page|go_to_page|tutor_handwrite|show_[a-z]+(?:_[a-z]+)*)\b/;

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

/** The tools that never draw: a reply that writes one of them as markup has slipped. */
const CONTROL_NAMES = ['record_thinking', 'set_goal_status', 'update_session_note', 'end_lesson', 'keep_listening', 'track_gap', 'switch_language'];

/**
 * Takes control tools written as markup out of a reply as it streams. Board blocks are written inline, and now
 * and then the model writes a control tool the same way (`<record_thinking address_declined="true"
 * stance="against">`); the sentence net above then left its tail in the words (`stance="against">` opened two
 * replies of a replay, 2026-11-24). The tag never reaches the student, and `onTag` gets what it asked for.
 */
export class ControlTagStream {
  private buf = '';
  constructor(private onTag?: (name: string, attrs: Record<string, string>) => void) {}
  push(delta: string): string { this.buf += delta; return this.drain(false); }
  flush(): string { return this.drain(true); }
  private drain(final: boolean): string {
    let out = '';
    for (;;) {
      const lt = this.buf.indexOf('<');
      if (lt < 0) { out += this.buf; this.buf = ''; return out; }
      out += this.buf.slice(0, lt); this.buf = this.buf.slice(lt);
      const head = this.buf.slice(1).replace(/^\//, '');
      const name = CONTROL_NAMES.find((n) => head.startsWith(n) && !/^[a-z_]/i.test(head.slice(n.length, n.length + 1)));
      if (name) {
        const end = this.buf.indexOf('>');
        if (end < 0) { if (final) this.buf = ''; return out; }
        const tag = this.buf.slice(0, end + 1); this.buf = this.buf.slice(end + 1).replace(/^[ \t]*\n?/, '');
        if (!tag.startsWith('</')) this.onTag?.(name, Object.fromEntries([...tag.matchAll(/([a-z_]+)\s*=\s*"([^"]*)"/gi)].map((m) => [m[1], m[2]])));
        continue;
      }
      // Not yet enough to tell: "<rec" may still become a control tag.
      if (!final && CONTROL_NAMES.some((n) => n.startsWith(head) || (head.length <= n.length && n.startsWith(head.slice(0, n.length))))) return out;
      out += '<'; this.buf = this.buf.slice(1);
    }
  }
}

/** The same, for a whole text (the stored copy of a reply). */
export function stripControlTags(text: string): string {
  if (!text.includes('<')) return text;
  const st = new ControlTagStream();
  return st.push(text) + st.flush();
}
