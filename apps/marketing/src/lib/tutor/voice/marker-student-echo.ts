/**
 * Student-echo extraction from bracketed dispatch markers (2026-08-07 triage,
 * session-1786064015703).
 *
 * `callBrainOnce` treats every "[…]" transcript as a system directive and
 * skips the student transcript append (`silent = isBracketed`) — correct for
 * [start lesson]-class directives, but three marker families QUOTE genuine
 * student content:
 *   - `[try-yourself submission. The student submitted: "X". …]`
 *   - `[The student wrote on the whiteboard: "X". Respond to what they wrote.]`
 *   - `[The student <drew on/uploaded …> the whiteboard. It contains: "X". …]`
 * Those markers reached the brain (as <student_said>) while contributing
 * nothing to the saved transcript — so the replay/PDF showed the tutor
 * affirming out of nowhere, and later brain turns had no student turn in
 * history for that exchange.
 *
 * This extractor recovers the quoted student content so the orchestrator can
 * append it as a `historyOnly` student entry (saved + in brain history, but
 * not a live chat bubble — the card/board already displays the content).
 * The capture is anchored on each family's fixed CONTINUATION text, not on
 * the closing quote, so student content containing quote characters
 * survives intact. Directive-only markers return null.
 *
 * Tests: npx tsx scripts/test-marker-student-echo.ts
 */

const ECHO_PATTERNS: RegExp[] = [
  // [try-yourself submission. The student submitted: "X". Expected:… | No expected…]
  /\[try-yourself submission\. The student submitted: "([\s\S]*?)"\.\s*(?:Expected:|No expected answer)/,
  // [The student wrote on the whiteboard: "X". Respond to what they wrote.]
  /\[The student wrote on the whiteboard: "([\s\S]*?)"\.\s*Respond to what they wrote\.\]/,
  // [The student <noun phrase> the whiteboard. It contains: "X". Respond to what they shared.]
  /\[The student [^.\]]{1,60} the whiteboard\. It contains: "([\s\S]*?)"\.\s*Respond to what they shared\.\]/,
];

const MAX_ECHO_CHARS = 2000;

export function extractStudentEcho(marker: string): string | null {
  const t = marker.trim();
  if (!t.startsWith('[') || !t.endsWith(']')) return null;
  for (const re of ECHO_PATTERNS) {
    const m = re.exec(t);
    if (m) {
      const echo = m[1].trim();
      return echo ? echo.slice(0, MAX_ECHO_CHARS) : null;
    }
  }
  return null;
}
