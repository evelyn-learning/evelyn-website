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
