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
