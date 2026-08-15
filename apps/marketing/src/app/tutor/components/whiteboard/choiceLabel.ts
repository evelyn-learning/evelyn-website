import { sanitizeStatementDollars } from '../../../../lib/tutor/whiteboard/statement-dollar-sanitizer';

/**
 * MCQ choice-label de-duplication.
 *
 * Every MCQ renderer (TryYourselfRenderer, QuizRenderer, the showProblem card)
 * draws its OWN letter badge from the choice's id/letter field, then the choice
 * text beside it. When the brain ALSO bakes the letter into the text (e.g.
 * text = "A) 5x + 3" alongside id = "A"), the board shows the letter twice:
 * "A. A) 5x + 3" (2026-06-23 Image 56). Strip the redundant leading label.
 *
 * Safety: we only strip a leading token that EXACTLY matches the badge label,
 * so this can never remove meaningful content (a choice whose answer genuinely
 * begins with a different letter, math, or word is untouched).
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function stripRedundantChoiceLabel(
  text: string | undefined,
  label: string | undefined,
): string {
  if (!text || !label) return text ?? '';
  const trimmedLabel = label.trim();
  if (!trimmedLabel) return text;
  // Leading duplicate of the badge label: optional "(", the label, then a
  // separator — ")", ".", ":", or "-" (the "(A)" form closes with ")").
  const re = new RegExp(`^\\s*\\(?\\s*${escapeRegExp(trimmedLabel)}\\s*[).:\\-]\\s*`, 'i');
  const stripped = text.replace(re, '').trimStart();
  // Never blank a choice — if stripping consumed everything, keep the original.
  return stripped || text;
}

/**
 * Embedded-choice-block de-duplication (round 29, live SAT session
 * session-1784936161888: "Root Multiplicity" card showed its four choices
 * twice). When the brain (or a bank row's problemText) embeds the full
 * "A) … B) … C) … D) …" list inside `statement` AND also fills
 * `answerChoices`, the card renders the block twice — KaTeX lines from the
 * statement, then the styled choice list.
 *
 * Same safety doctrine as stripRedundantChoiceLabel: strip ONLY a trailing
 * run of statement lines that matches the answerChoices one-to-one, in
 * order — each line must be "<letter>) <text>" (with ()./: separators
 * tolerated) whose letter equals choices[i]'s letter and whose text,
 * whitespace-collapsed, equals choices[i]'s text. A statement that merely
 * mentions "choice B" is untouched, and stripping never blanks the
 * statement.
 *
 * This is also the single intake choke point where BOTH statement renderers
 * (WhiteboardCanvas's showProblem card and TryYourselfRenderer's
 * showTryYourself card) hand the raw statement text to InlineMathText —
 * every call site pipes `stripEmbeddedChoiceBlock(...)` straight into
 * `<InlineMathText text={...} />`. R47: run sanitizeStatementDollars first,
 * so a brain-emitted stray `$` glued to prose (e.g. "...ticket.$What is...")
 * is dropped before either the choice-block dedup or the KaTeX segmenter
 * ever see it.
 */
export function stripEmbeddedChoiceBlock(
  rawStatement: string | undefined,
  choices: Array<{ letter?: string; text?: string }> | undefined,
): string {
  const statement = sanitizeStatementDollars(rawStatement);
  if (!statement || !choices || choices.length === 0) return statement;
  const lines = statement.split('\n');
  // Collect trailing non-empty lines (allowing blank lines between them).
  const tail: { idx: number; line: string }[] = [];
  for (let i = lines.length - 1; i >= 0 && tail.length < choices.length; i--) {
    if (!lines[i].trim()) continue;
    tail.unshift({ idx: i, line: lines[i] });
  }
  if (tail.length !== choices.length) return statement;
  const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/[$]/g, '').trim();
  const CHOICE_LINE_RE = /^\s*\(?\s*([A-Ea-e])\s*[).:\-]\s*(.+)$/;
  for (let i = 0; i < choices.length; i++) {
    const m = tail[i].line.match(CHOICE_LINE_RE);
    if (!m) return statement;
    const letter = (choices[i].letter ?? String.fromCharCode(65 + i)).trim().toUpperCase();
    if (m[1].toUpperCase() !== letter) return statement;
    const lineText = norm(stripRedundantChoiceLabel(m[2], choices[i].letter));
    if (!lineText || lineText !== norm(choices[i].text ?? '')) return statement;
  }
  const kept = lines.slice(0, tail[0].idx).join('\n').trimEnd();
  return kept || statement;
}
