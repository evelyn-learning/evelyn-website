/**
 * Deterministic detector for a praise-then-contradiction turn (R38, session
 * embed-1785738371329): the brain's FIRST sentence opens by praising a
 * short value phrase ("Right — one half.") and a LATER sentence in the
 * same turn contradicts that exact phrase ("…you've gone one third of the
 * way, not one half."). The student hears the tutor affirm their wrong
 * answer, then walk it back — worse than a plain correction.
 *
 * Task 1 (this round) already fixed `isVerdictOpener` so dash-form
 * ("Right —") openers get HELD instead of spoken immediately, buying a
 * window to catch exactly this shape before any audio plays. This module
 * is the deterministic backstop for turns that are held but still wrong
 * once fully assembled — it is intended to run on the FULL accumulated
 * turn text (not sentence 0 alone), since the contradiction only shows up
 * once a later sentence has streamed in.
 *
 * Deterministic shape (no LLM, no FP class): sentence 1 opens with a
 * praise-class verdict word followed by a short value phrase, and a LATER
 * sentence contains "not <that same phrase>". Scoped narrowly — the
 * contradiction regex targets only the AFFIRMED phrase, so a legitimate
 * contrast against a DIFFERENT value ("Right — one third. Not one half,
 * like the last one — one third.") does not fire.
 *
 * Pure module — no imports, no side effects. Never throws.
 */

const PRAISE_OPENER_RE =
  /^\s*(?:right|yes|exactly|correct|perfect|spot on|that'?s (?:right|correct|it))\s*[—–,.:!-]\s*([^.!?\n]{1,40})[.!?]/i;

export function detectPraiseContradiction(turnText: string): { affirmed: string } | null {
  const m = turnText.match(PRAISE_OPENER_RE);
  if (!m) return null;
  const affirmed = m[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
  if (!affirmed) return null;
  const rest = turnText.slice(m.index! + m[0].length).replace(/\*/g, '');
  const escaped = affirmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const contra = new RegExp(`\\bnot\\s+${escaped}\\b`, 'i');
  return contra.test(rest) ? { affirmed } : null;
}
