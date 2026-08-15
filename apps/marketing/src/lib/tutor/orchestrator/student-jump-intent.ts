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
 *
 * Post-review hardening (same round, coordinator pass):
 *  - Negation guard: "don't move to X yet" / "let's not move to X" must
 *    not fire just because the verb+label pattern is present. Checked
 *    ONLY against the words immediately preceding the chosen verb match —
 *    a bare "no wait, move to X" correction-lead-in is NOT a negator
 *    (no don't/not/never/do not token) and must still resolve normally.
 *  - Self-correction re-anchoring: "move to derivative patterns, no
 *    wait, second derivatives" must resolve against "second derivatives"
 *    (the corrected destination), never the abandoned first mention. Two
 *    mechanisms cover this: (a) when the student re-issues the verb
 *    ("...actually, move to X"), only the LAST verb-phrase occurrence
 *    anchors the destination text; (b) within a single destination span,
 *    text is split on correction markers (no wait/actually/i mean/…) and
 *    only the LAST fragment is scored.
 *  - Bag-of-words scatter guard: a token-fraction match (not a full-label
 *    substring) is only trusted if the matched tokens sit within a
 *    compact window of the destination text — otherwise "move to the
 *    second example, we'll cover the derivative next" wrongly matches
 *    "Second derivative example" purely by coincidental word overlap
 *    scattered across an unrelated sentence.
 */

export interface JumpCandidateItem { segmentIds: string[]; label: string }

// Requires an explicit destination preposition (to/onto/back to) directly
// after the verb — "go over X" and "go X" (no preposition) never match,
// which is what excludes review phrasing and bare "let's move on". Global
// so every occurrence can be found (self-correction may re-issue the verb).
//
// R46 (b), live session portal-0c48edbb: "let's get into the direct
// substitution examples" carried no destination verb at all — "get into" /
// "dig into" / "dive into" carry their OWN preposition ("into"), so they
// are a second, self-contained alternative rather than additions to the
// move|switch|jump|go|skip group (which all route through the separate
// on-to/onto/back-to/to tail). Same safety property applies unchanged:
// the verb alone never fires without the ≥0.75 clear-winner label match
// below.
const MOVE_VERB_RE =
  /\b(?:(?:move|switch|jump|go|skip)(?:\s+\w+){0,2}?\s+(?:on to|onto|back to|to)\s+|(?:get|dig|dive)\s+into\s+)/gi;

// Negator immediately governing the verb, allowing up to two intervening
// words ("don't want to move…"). Deliberately does NOT include bare "no"
// or "wait" — those are correction lead-ins ("no wait, move to X"), not
// negation, and must never block a match.
const NEGATION_RE = /(?:\bdon'?t\b|\bdo not\b|\bnot\b|\bnever\b)(?:\s+\w+){0,2}\s*$/i;

// Mid-utterance self-correction markers. Only the fragment AFTER the last
// one names the destination the student actually wants.
const CORRECTION_SPLIT_RE =
  /\b(?:no wait|wait no|wait,?\s|actually|i mean|sorry|scratch that|rather)\b/gi;

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

  const verbMatches = [...t.matchAll(MOVE_VERB_RE)];
  if (verbMatches.length === 0) return null;
  // Last occurrence: a re-issued verb ("...actually, move to Y") means Y,
  // not the first-mentioned destination.
  const verbMatch = verbMatches[verbMatches.length - 1];
  const matchIndex = verbMatch.index ?? -1;
  if (matchIndex < 0) return null;

  const prefix = t.slice(0, matchIndex);
  if (NEGATION_RE.test(prefix)) return null;

  // Only the text AFTER the verb phrase names the destination; within
  // that, only the text after the last correction marker does.
  const rawTail = t.slice(matchIndex + verbMatch[0].length);
  const fragments = rawTail.split(CORRECTION_SPLIT_RE);
  const rawDestination = fragments[fragments.length - 1];

  const tail = normalizeLabel(rawDestination);
  if (!tail) return null;
  const tailTokenList = contentTokens(rawDestination);
  const tailTokens = new Set(tailTokenList);
  if (tailTokens.size === 0) return null;

  // Score every item: fraction of the LABEL's content tokens present in the
  // tail. Full-label containment (normalized substring) is an immediate max
  // and is exempt from the scatter-window check below (an intact substring
  // is definitionally compact).
  type Scored = { item: JumpCandidateItem; score: number };
  const scored: Scored[] = items.map((item) => {
    const norm = normalizeLabel(item.label);
    if (norm && tail.includes(norm)) return { item, score: 1 };
    const toks = contentTokens(item.label);
    if (toks.length === 0) return { item, score: 0 };
    const matchedToks = toks.filter((w) => tailTokens.has(w));
    const score = matchedToks.length / toks.length;
    if (score < 0.75) return { item, score };
    // Scatter guard: the matched tokens must span a compact window of the
    // destination text, not be strewn across an unrelated sentence.
    const positions = matchedToks.map((w) => tailTokenList.indexOf(w));
    const span = Math.max(...positions) - Math.min(...positions) + 1;
    if (span > toks.length + 2) return { item, score: 0 };
    return { item, score };
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
