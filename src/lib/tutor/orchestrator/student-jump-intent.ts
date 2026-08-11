/**
 * Student-jump-intent matcher (R44, session portal-dc74208b): the student
 * asked "move to derivative patterns"; the brain rerouted content but
 * never called advance_lesson, so the agenda rail's active pill froze (the
 * exact bug class segment-advance.ts already documents for
 * show_segment_card). This is the analogous inference for VERBAL in-plan
 * jumps: an explicit move-verb + a high-confidence match against an
 * agenda item's label.
 *
 * Conservative by design — a wrong inferred jump corrupts pedagogical
 * state (the applied advance auto-marks skipped segments complete), a
 * missed one just leaves today's behavior (brain reroutes content, rail
 * stays frozen until the brain's own tool call catches up). Never fire
 * without BOTH an explicit move-verb AND a clear-winner label match
 * ≥0.75 token coverage. Pure, import-free.
 *
 * Deliberately excluded from the verb set: "go over" is REVIEW phrasing
 * ("can we go over derivative patterns again") — the student wants the
 * CURRENT material re-explained, not a cursor move to a different agenda
 * item. Firing a jump there would skip-complete whatever sits between the
 * cursor and the named item. Only destination verbs (move/switch/jump/
 * skip/go [back] to) count.
 */

export interface JumpCandidateItem { segmentIds: string[]; label: string }

// Requires an explicit destination preposition (to/onto/back to) directly
// after the verb — "go over X" and "go X" (no preposition) never match,
// which is what excludes review phrasing and bare "let's move on".
const MOVE_VERB_RE =
  /\b(?:move|switch|jump|go|skip)(?:\s+\w+){0,2}?\s+(?:on to|onto|back to|to)\s+/i;

function normalizeLabel(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set(['the', 'a', 'an', 'one', 'thing', 'and', 'to', 'of', 'on']);

function contentTokens(s: string): string[] {
  return normalizeLabel(s).split(' ').filter((w) => w && !STOPWORDS.has(w));
}

export function matchStudentJumpIntent(
  transcript: string,
  items: JumpCandidateItem[],
  currentSegmentId: string
): { targetSegmentId: string; matchedLabel: string } | null {
  const t = (transcript ?? '').trim();
  if (!t || items.length === 0) return null;
  const verbMatch = MOVE_VERB_RE.exec(t);
  if (!verbMatch) return null;
  // Only the text AFTER the verb phrase names the destination.
  const tail = normalizeLabel(t.slice(verbMatch.index + verbMatch[0].length));
  if (!tail) return null;
  const tailTokens = new Set(contentTokens(tail));
  if (tailTokens.size === 0) return null;

  // Score every item: fraction of the LABEL's content tokens present in the
  // tail. Full-label containment (normalized substring) is an immediate max.
  type Scored = { item: JumpCandidateItem; score: number };
  const scored: Scored[] = items.map((item) => {
    const norm = normalizeLabel(item.label);
    if (norm && tail.includes(norm)) return { item, score: 1 };
    const toks = contentTokens(item.label);
    if (toks.length === 0) return { item, score: 0 };
    const hit = toks.filter((w) => tailTokens.has(w)).length;
    return { item, score: hit / toks.length };
  });
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const second = scored[1];
  // High confidence: ≥0.75 of the label's tokens present, AND a clear winner
  // (second-best strictly lower). Any tie at or above the threshold —
  // including two simultaneous full-containment matches — is ambiguous.
  if (!best || best.score < 0.75) return null;
  if (second && second.score >= best.score) return null;
  if (best.item.segmentIds.includes(currentSegmentId)) return null; // already there
  const targetSegmentId = best.item.segmentIds[0];
  if (!targetSegmentId) return null;
  return { targetSegmentId, matchedLabel: best.item.label };
}
