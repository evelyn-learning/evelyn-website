// src/lib/tutor/whiteboard/soft-rejections.ts
/**
 * "A rejected whiteboard call must not cost the whole turn" — pure decisions.
 *
 * Every rejection the whiteboard handler returns makes the orchestrator kill
 * the attempt and re-run the whole brain turn (`brain_validator_retry`). That
 * is the right price for a wrong figure or a missing problem card; it is the
 * wrong price for a cosmetic collision or a navigation miss:
 *
 *  (a) a show_equation whose label matched an earlier label was rejected; the
 *      retry replaced a good explanation with "Yes — that's exactly the idea"
 *      in reply to a student who had said "I don't know";
 *  (b) a resume opener was rejected for a bad tutor_scroll_whiteboard target
 *      → 12.7 s of dead air and an incoherent retry;
 *  (c) a show_problem the RUNTIME rewrote to show_segment_card was then
 *      rejected as a duplicate of the card already on the board.
 *
 * HISTORY THAT CONSTRAINS (a): the label guard used to DROP the equation
 * silently, which produced "the tutor spoke about an equation that never
 * appeared" (6× in one session); it became reject-with-reason so the brain
 * would re-issue. Neither is right. The equation is the content; the label is
 * decoration — so the equation is painted and the label is what gives way.
 */

const foldLabel = (s: string): string => (s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

export type LabelCollisionResolution =
  | { kind: 'reject' }
  | { kind: 'paint'; label: string; changed: boolean };

/**
 * Called only where decideLabelDuplicate (equation-label-dedup.ts) said
 * 'reject': same NORMALISED label, different latex, same page, prior still on
 * the board. (Identical label AND latex never reaches here — that is the
 * existing pass-through no-op.)
 *
 *  · The two labels already READ differently on the board (the collision was
 *    produced by normalisation — "(6)" vs "(10)", a trailing ✓): paint as
 *    written.
 *  · Otherwise append a counter so two different equations never share one
 *    heading: "Final answer" → "Final answer (2)" → "(3)" ….
 */
export function resolveLabelCollision(input: {
  /** Kill switch — off ⇒ the pre-fix reject-with-reason. */
  enabled: boolean;
  rawLabel: string;
  /** originalLabel of the registered prior equation. */
  priorLabel: string;
  /** How many times this normalised label has already been made unique. */
  relabelsSoFar: number;
}): LabelCollisionResolution {
  if (!input.enabled) return { kind: 'reject' };
  const display = (input.rawLabel ?? '').replace(/\s+/g, ' ').trim();
  if (foldLabel(display) !== foldLabel(input.priorLabel)) {
    return { kind: 'paint', label: display, changed: false };
  }
  const n = Math.max(0, Math.floor(input.relabelsSoFar || 0)) + 2;
  return { kind: 'paint', label: `${display} (${n})`, changed: true };
}

/**
 * The per-label relabel counter after a show_equation label decision. The
 * counter is scoped exactly like the label registration it decorates: when
 * decideLabelDuplicate answers 'register' (new page, new problem, prior off
 * the board) the label starts afresh, so the count restarts too — otherwise
 * the first collision on a new page reads "(3)" with no "(2)" in sight.
 */
export function relabelCountAfter(input: {
  event: 'relabelled' | 'unchanged' | 'scope-reset';
  countSoFar: number;
}): number {
  const count = Math.max(0, Math.floor(input.countSoFar || 0));
  if (input.event === 'scope-reset') return 0;
  return input.event === 'relabelled' ? count + 1 : count;
}

/** Board actions that POINT AT existing content rather than add content. A
 *  miss costs a pointer, never the lesson. */
const POINTER_ACTIONS = new Set(['scrollTo', 'scribble', 'highlight', 'annotate', 'link']);

/**
 * A pointer-type call whose target cannot be resolved is dropped (that one
 * call; speech proceeds). Anything that adds content keeps its rejection.
 */
export function decideUnresolvedTarget(input: { enabled: boolean; action: string }): 'drop' | 'reject' {
  if (!input.enabled) return 'reject';
  return POINTER_ACTIONS.has(input.action) ? 'drop' : 'reject';
}

const normalizeStatement = (s: string): string =>
  (s ?? '')
    .toLowerCase()
    .replace(/\\(?:text|mathrm|mathbf|textbf)\b/g, ' ')
    .replace(/[^a-z0-9.]+/g, ' ')
    // Keep a "." only between two digits (decimals). No lookbehind: this
    // module ships to browsers, and older Safari fails to PARSE one.
    .replace(/(\d)\.(?=\d)/g, '$1\u0001')
    .replace(/\./g, ' ')
    .replace(/\u0001/g, '.')
    .replace(/\s+/g, ' ')
    .trim();

const numbersOf = (norm: string): string[] => (norm.match(/\d+(?:\.\d+)?/g) ?? []).slice().sort();
const wordsOf = (norm: string): Set<string> => new Set(norm.split(' ').filter((w) => /[a-z]/.test(w) && w.length > 2));

/** Tokens that carry a digit, in reading order, with any attached letter
 *  ("4x", "9", "33") — the skeleton of the mathematics in a statement. */
const digitTokensOf = (norm: string): string[] => norm.split(' ').filter((w) => /\d/.test(w));

const COMPARATOR_RE = /\\(?:leqslant|leq|le)(?![a-zA-Z])|≤|⩽|<=|\\(?:geqslant|geq|ge)(?![a-zA-Z])|≥|⩾|>=|\\(?:neq|ne)(?![a-zA-Z])|≠|!=|\\lt(?![a-zA-Z])|<|\\gt(?![a-zA-Z])|>|=/g;
/** The comparators of a statement in reading order, notation-independent
 *  ("\le", "≤", "<=" all read "le"). normalizeStatement discards them, so
 *  without this "4x + 9 ≤ 33" and "4x + 9 ≥ 33" would be one problem. */
const comparatorsOf = (raw: string): string =>
  ((raw ?? '').match(COMPARATOR_RE) ?? [])
    .map((m) => (/^(?:\\l(?:e|eq|eqslant)|≤|⩽|<=)$/.test(m) ? 'le'
      : /^(?:\\g(?:e|eq|eqslant)|≥|⩾|>=)$/.test(m) ? 'ge'
      : /^(?:\\neq?|≠|!=)$/.test(m) ? 'ne'
      : /^(?:\\lt|<)$/.test(m) ? 'lt'
      : /^(?:\\gt|>)$/.test(m) ? 'gt'
      : 'eq'))
    .join(' ');

/**
 * Do two problem statements pose the SAME problem? Structural:
 *  · different numbers ⇒ a different problem, always;
 *  · both carry comparators and they differ (≤ vs ≥, < vs ≤) ⇒ different;
 *  · identical after stripping markup/punctuation/case ⇒ same;
 *  · the same multiset of numbers with mostly the same words (light
 *    rewording) ⇒ same; with no numbers at all, almost entirely the same words;
 *  · two or more numbers appearing as the SAME digit tokens in the SAME order
 *    ("4x … 9 … 33"), and the wordier statement merely adds words around the
 *    other's ("Solve 4x + 9 ≤ 33 and graph the solution on a number line" vs
 *    "Solve and graph: 4x + 9 ≤ 33", or the bare relation) ⇒ same.
 *
 * KNOWN LIMIT: + and − are not compared (a hyphen is indistinguishable from a
 * minus here), so "4x + 9 ≤ 33" and "4x − 9 ≤ 33" still read as one problem.
 */
export function sameProblemStatement(a: string, b: string): boolean {
  const na = normalizeStatement(a);
  const nb = normalizeStatement(b);
  if (!na || !nb) return false;
  const numsA = numbersOf(na);
  const numsB = numbersOf(nb);
  if (numsA.join(',') !== numsB.join(',')) return false;
  const cmpA = comparatorsOf(a);
  const cmpB = comparatorsOf(b);
  if (cmpA && cmpB && cmpA !== cmpB) return false;
  if (na === nb) return true;
  const wa = wordsOf(na);
  const wb = wordsOf(nb);
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  if (wa.size > 0 && wb.size > 0) {
    const jaccard = shared / (wa.size + wb.size - shared);
    if (jaccard >= (numsA.length > 0 ? 0.6 : 0.8)) return true;
  }
  if (numsA.length < 2) return false;
  if (digitTokensOf(na).join(' ') !== digitTokensOf(nb).join(' ')) return false;
  const smaller = Math.min(wa.size, wb.size);
  return smaller === 0 || shared / smaller >= 0.8;
}

const readingForm = (s: string): string =>
  (s ?? '').replace(/[*$]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * Is this the SAME CARD TEXT (not merely the same problem)? Used to ask "is
 * the authored card the one tracked as active on the board?" — the tracked
 * statement is the emphasis-stripped render of the authored text, so the two
 * are compared without emphasis stars, `$`, case and whitespace runs. Every
 * operator, sign and number must match.
 */
export function statementsReadIdentically(a: string, b: string): boolean {
  const ra = readingForm(a);
  return ra !== '' && ra === readingForm(b);
}

export type SubstitutedDuplicateReason =
  | 'flag-off' | 'not-substituted' | 'same-problem-already-on-board' | 'different-problem';

/**
 * Case (c). The brain emitted show_problem; the runtime rewrote it to
 * show_segment_card (authored card for the current segment); that card is
 * already on the board, so the render dedups. Surfacing the dedup as a
 * rejection retries a turn for a duplicate the brain never asked for.
 *
 * Silent ONLY when the brain's own statement poses the same problem as the
 * authored card: then the problem it is talking about IS on the board and
 * nothing is missing. If the brain asked for a different problem, its card
 * really did not appear — that rejection guards a missing problem card and
 * stays.
 */
export function decideSubstitutedDuplicate(input: {
  enabled: boolean;
  /** True when the RUNTIME (not the brain) turned this call into show_segment_card. */
  substitutedByRuntime: boolean;
  brainStatement: string;
  authoredStatement: string;
}): { silent: boolean; reason: SubstitutedDuplicateReason } {
  if (!input.enabled) return { silent: false, reason: 'flag-off' };
  if (!input.substitutedByRuntime) return { silent: false, reason: 'not-substituted' };
  return sameProblemStatement(input.brainStatement, input.authoredStatement)
    ? { silent: true, reason: 'same-problem-already-on-board' }
    : { silent: false, reason: 'different-problem' };
}

// ── Label reuse in a CORRECTION turn (2026-10-04) ──────────────────────────

/**
 * FIRST-PERSON statements that the tutor's OWN earlier writing is wrong.
 * Deliberately narrow: removing a card from the board on the strength of a
 * word like "actually", "correction" or "should say" deleted good steps —
 * those words are just as often praise ("Good correction!"), a remark about
 * the STUDENT's work ("Your answer should say x = 4"), or a plain next step
 * ("So the next line should read 2x = 8"). Subject-independent.
 */
const BOARD_NOUN = '(?:line|label|card|equation|step|board)';
const SELF_CORRECTION_RES: RegExp[] = [
  // "let me fix / correct / rewrite / redo that (label)"
  new RegExp(`\\blet\\s+me\\s+(?:just\\s+|quickly\\s+)?(?:fix|correct|redo|rewrite|re-write)\\s+(?:that|this|it|the\\s+${BOARD_NOUN}|my\\s+${BOARD_NOUN})\\b`, 'i'),
  // "I wrote that wrong"
  /\bi\s+(?:wrote|put|typed|labell?ed)\s+(?:that|this|it)\s+(?:down\s+)?(?:wrong|incorrectly|backwards?)\b/i,
  // "I made a mistake / an error there | on the board | in that line"
  new RegExp(`\\bi\\s+made\\s+an?\\s+(?:mistake|error)\\s+(?:there|on\\s+the\\s+board|in\\s+that\\s+${BOARD_NOUN})\\b`, 'i'),
  // "that line / label / card / equation was wrong"
  /\bthat\s+(?:line|label|card|equation)\s+(?:was|is)\s+(?:wrong|incorrect)\b/i,
  /\bscratch\s+that\b/i,
  // "that line should read … not …" / "what I wrote should say … not …"
  /\b(?:that\s+(?:line|label|card|equation)|the\s+board|what\s+i\s+(?:wrote|put))\s+should\s+(?:have\s+)?(?:read|say|said|be|been)\b[^.?!]*\bnot\b/i,
];

export function hasSelfCorrectionMarker(speech: string): boolean {
  const t = speech ?? '';
  return !!t.trim() && SELF_CORRECTION_RES.some((re) => re.test(t));
}

const COMPARATOR_SPLIT_RE = /(\\leq?|\\geq?|\\neq?|\\lt|\\gt|<=|>=|!=|≤|≥|≠|<|>|=|\\text\{\s*(?:or|and)\s*\}|\b(?:or|and)\b)/;
const normLatexForEdit = (s: string): string =>
  (s ?? '').replace(/\\left|\\right/g, '').replace(/\\[,;!: ]/g, '').replace(/\s+/g, '');

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Normalised edit distance at or below which two equations are "the same
 *  line with a fix". */
export const CORRECTION_MAX_EDIT_RATIO = 0.4;

/**
 * Is `next` the earlier equation with a small fix (same structure) rather
 * than a different equation that merely shares its label? True when the
 * normalised Levenshtein distance is ≤ 0.4, or when both split into the same
 * sides / operands around their comparators and exactly ONE of them changed.
 * Unknown or identical latex ⇒ false.
 */
export function isSmallLatexEdit(prior: string, next: string): boolean {
  const a = normLatexForEdit(prior);
  const b = normLatexForEdit(next);
  if (!a || !b || a === b) return false;
  if (a.length <= 600 && b.length <= 600 && levenshtein(a, b) / Math.max(a.length, b.length) <= CORRECTION_MAX_EDIT_RATIO) return true;
  const pa = (prior ?? '').split(COMPARATOR_SPLIT_RE).map(normLatexForEdit);
  const pb = (next ?? '').split(COMPARATOR_SPLIT_RE).map(normLatexForEdit);
  if (pa.length < 3 || pa.length !== pb.length) return false;
  let changed = 0;
  for (let k = 0; k < pa.length; k++) if (pa[k] !== pb[k]) changed++;
  return changed === 1;
}

export type LabelReuseReason =
  | 'self-correction-speech'
  | 'flag-off' | 'not-a-correction' | 'different-equation' | 'prior-not-addressable' | 'prior-pending-revision';

/**
 * Called exactly where resolveLabelCollision is (same normalised label,
 * DIFFERENT latex, same page and problem, prior still on the board).
 *
 * WHY: the tutor boarded "How to read it aloud: x > 3 or x < 3", then
 * corrected itself with a show_equation under the same label. The relabel
 * rule painted "How to read it aloud (2)" BESIDE the wrong original, which
 * stayed on the board. In a correction the new equation supersedes the old
 * one — replace it.
 *
 * Replacing REMOVES a card, so it happens only on the unmistakable case —
 * BOTH must hold; anything else keeps the relabel (both cards stay):
 *  (i)  the tutor's speech in this turn, before the tool call, says in the
 *       first person that its own earlier writing is wrong
 *       (hasSelfCorrectionMarker);
 *  (ii) the new latex is a small edit of the earlier card's
 *       (isSmallLatexEdit) — a different equation under a reused label
 *       ("Step", "Simplify", "Check") is a new step.
 * A judge / relation-step note in the turn's input is NOT evidence: it is
 * delivered on most corrected verdicts and is usually about the student's
 * answer, not the board.
 */
export function decideLabelReuseOnCorrection(input: {
  /** Kill switch (NEXT_PUBLIC_TUTOR_LABEL_REUSE_CORRECTION_REPLACE !== 'off'). */
  enabled: boolean;
  /** Everything the tutor has said in this turn up to the tool call. */
  tutorSpeechThisTurn: string;
  /** Latex of the earlier card under this label. */
  priorLatex: string;
  /** Latex of the equation being boarded now. */
  newLatex: string;
  /** Board id of the prior card under this label; null when it cannot be resolved. */
  priorItemId: string | null;
  /** The prior card is a killed render still awaiting kill-recovery — that
   *  mechanism owns it. */
  priorPendingRevision: boolean;
}): { action: 'replace' | 'relabel'; reason: LabelReuseReason } {
  const relabel = (reason: LabelReuseReason) => ({ action: 'relabel' as const, reason });
  if (!input.enabled) return relabel('flag-off');
  if (!hasSelfCorrectionMarker(input.tutorSpeechThisTurn)) return relabel('not-a-correction');
  if (!isSmallLatexEdit(input.priorLatex, input.newLatex)) return relabel('different-equation');
  if (!input.priorItemId) return relabel('prior-not-addressable');
  if (input.priorPendingRevision) return relabel('prior-pending-revision');
  return { action: 'replace', reason: 'self-correction-speech' };
}
