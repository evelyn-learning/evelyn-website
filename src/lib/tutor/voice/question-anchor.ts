/**
 * R2 E2 (2026-07-26, session portal-19ac025c): deterministic safety net for
 * the "Board-anchored questions" HARD RULE. The k=-0.1 half-life question
 * was posed in speech only — the prompt rule is the primary fix; this net
 * catches the zero-board-write case: a turn that ENDS with a substantive
 * question (names a number/variable/expression) and painted NO content on
 * the board plants a next-turn corrective note (the turn-cap pattern — a
 * note, never a kill; the audio already played).
 *
 * KNOWN LIMIT (deliberate): a turn that wrote SOME content but not the
 * question itself (the actual session-portal-19ac025c shape) is not
 * detectable without semantic matching — the strengthened prompt rule owns
 * that case. Spelled-out numbers ("fifteen percent") are likewise missed;
 * conservative by design (note noise costs prompt budget every turn).
 */

/** Meta/nav/control tool calls that do NOT paint teaching content. */
const NON_CONTENT_TOOLS = new Set([
  'new_page',
  'go_to_page',
  'clear',
  'tutor_scroll_whiteboard',
  'list_whiteboard_features',
  'mark_segment_complete',
  'advance_lesson',
  'generate_problem',
  // R2 review-round-2 fix-3: these fire silently (student profile/plan/
  // notes bookkeeping — see toolDefinitions.ts) and never touch the board,
  // so a turn that calls only one of these still counts as a zero-board-
  // write turn for the corrective-note check above.
  'confirm_plan_los',
  'propose_plan_swap',
  'record_gap',
  'flag_prerequisite_gap',
  'expand_topic_notes_theory',
  'add_topic_notes_method',
  'add_topic_notes_pointer',
]);

export function isBoardContentTool(name: string): boolean {
  return !NON_CONTENT_TOOLS.has(name);
}

/** The prompt rule's exempt conversational checks — reaction/yes-no/open
 *  prediction asks that name nothing to hold onto. */
const CONVERSATIONAL_RE =
  /^(does that make sense|ready to try|what do you think happens next|should we keep going|make sense so far|any questions|you with me|sound good)/i;

/**
 * A substantive ask names a number, variable, or expression the student
 * must compute or manipulate: digits, math operators, LaTeX/$-spans, or a
 * function-call-shaped token like y(t).
 */
export function isSubstantiveAsk(sentence: string): boolean {
  const s = sentence.trim();
  if (!s) return false;
  if (CONVERSATIONAL_RE.test(s)) return false;
  return /[\d$\\^=+×÷*/%]|\b[a-zA-Z]\([a-zA-Z0-9 ,]*\)/.test(s);
}

export function buildBoardAnchorNote(question: string): string {
  return (
    `[board-anchor note — not from the student] Your previous turn ended by asking ` +
    `"${question}" — a question that names specific values — but painted nothing on the ` +
    `whiteboard that turn. If that ask is not already visible on the board, write it there ` +
    `now (show_equation, or a scribble against the existing target) as you continue; ` +
    `never leave the student holding a spoken-only expression in their head.`
  );
}
