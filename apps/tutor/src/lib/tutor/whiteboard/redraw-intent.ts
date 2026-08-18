/**
 * Detector for a student utterance complaining about a VISUAL on the board.
 * Exercised by scripts/test-redraw-intent.ts.
 *
 * 2026-08-17 triage (portal-35b9a5d8): the student asked three times to fix
 * an overlapping timeline; the brain re-rendered with fresh titles and no
 * removeItems, so three timelines stacked up. When THIS detector fires on
 * the current student turn, the orchestrator relaxes evolve-in-place to a
 * same-category replace (catalog.findRedrawReplaceTarget) so the redraw
 * actually supersedes the complained-about figure.
 *
 * Two tiers, tuned against the real utterances:
 *  - STRONG: words that are intrinsically about the drawing itself —
 *    redraw / remake / "draw it again" / any "overlap…" — fire alone.
 *  - PAIRED: quality words that also appear in conceptual complaints
 *    ("messy", "hard to read", "can't see") fire only alongside a visual
 *    noun (diagram, board, timeline, chart, …), so "I can't see how that
 *    follows" or "a messy situation" never arm a replace.
 */

const STRONG_RE = /\b(?:redraw|re-draw|remake|re-make|overlapp?\w*|draw (?:it|that|this) again)\b/i;

const QUALITY_RE = /\b(?:messy|clutter\w*|squish\w*|cramped|jumbled|crowded|unreadable|hard to (?:read|see)|can'?t (?:really )?(?:read|see|make out))\b/i;

const VISUAL_NOUN_RE = /\b(?:diagram|board|whiteboard|timeline|chart|graph|figure|map|table|drawing|picture|visual|sketch)\b/i;

export function isVisualComplaint(utterance: string): boolean {
  const text = utterance ?? '';
  if (STRONG_RE.test(text)) return true;
  return QUALITY_RE.test(text) && VISUAL_NOUN_RE.test(text);
}
