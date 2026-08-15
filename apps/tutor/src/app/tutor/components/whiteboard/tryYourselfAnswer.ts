/**
 * Try-yourself answer checking — the decision seam shared by
 * TryYourselfRenderer (the on-board ✓/✗ affordance + verdict text) and
 * WhiteboardCanvas's brain-relay (the "[try-yourself submission ...
 * Verdict: ...]" synthetic turn that tells the tutor whether to say
 * "nice work" or "close, try again").
 *
 * Kept in a plain .ts module (no JSX, no CSS imports) so it can be
 * unit-tested with a bare `tsx` run — TryYourselfRenderer.tsx pulls in
 * InlineMathText, which imports katex's CSS and breaks outside webpack.
 *
 * Root cause of the 2026-07 AP Gov MCQ bug ("Concurrent (both share
 * it)" picked → shown as correct on the row, but the card printed "Not
 * quite. Expected: Concurrent" and the tutor said "close"):
 *
 *   MCQ submission passes the CHOICE ID (submit(c.id)), but the old
 *   verdict check compared that id against `expectedAnswer` — a
 *   free-text string the brain authors SEPARATELY from the choices
 *   array and is not guaranteed to equal any option's id OR its full
 *   label ("Concurrent" vs the option's real text "Concurrent (both
 *   share it)"). The row ✓ mark, meanwhile, read `choices[].correct`
 *   directly — a different, actually-correct signal — so the
 *   affordance and the verdict text (and the text relayed to the
 *   brain) could disagree.
 *
 * Fix: MCQ correctness is decided by OPTION IDENTITY. `choices[].correct`
 * is the brain's authoritative per-option flag (mirrors how
 * QuizRenderer.gradeItem already grades its own mcq items — see
 * `item.choices?.find(c => c.correct)`); only when no choice carries
 * that flag do we fall back to comparing each option's label against
 * `expectedAnswer` with tolerant normalization (case/whitespace, and
 * either string containing the other, to absorb a bare expected answer
 * against a parenthetical-qualified option label). The SAME resolved
 * choice feeds the ✓ affordance, the "Expected: …" text, and the
 * brain-relay verdict, so all three can no longer disagree.
 */

export interface Choice {
  id: string;
  text: string;
  correct?: boolean;
}

/** Compare a student's typed answer against the expected answer with
 *  format-aware tolerance:
 *  - numeric: parse both sides as numbers; "024" matches "24", "0.5" matches "1/2".
 *  - mcq: case-insensitive, trim, collapse internal whitespace. (Used only
 *    as a last-resort fallback when the mcq choice-identity path in
 *    `computeTryYourselfVerdict` can't resolve a correct choice — e.g. no
 *    `choices` array at all.)
 *  - frq: returns TRISTATE — true (string-equal after normalization),
 *    false (numeric mismatch only), or null (undecidable; defer to the
 *    brain). String mismatches in FRQ space are too unreliable to assert
 *    "wrong" — students write "sin" when expected is "sin(θ)", "1/√2"
 *    when expected is "√2/2", etc. The brain reads the marker and
 *    judges algebraic equivalence.
 *
 *  Returning null in the FRQ branch keeps the renderer from showing
 *  "Not quite. Expected: X" when the answer is plausibly correct in a
 *  different form.
 */
export function matchesAnswerStrict(submitted: string, expected: string, format: 'mcq' | 'frq' | 'numeric' | undefined): boolean | null {
  const s = submitted.trim();
  const e = expected.trim();
  if (!s || !e) return null;
  // Numeric path: try to parse and compare values, including simple fractions.
  const tryParse = (v: string): number | null => {
    const cleaned = v.replace(/,/g, '').replace(/\s+/g, '');
    if (cleaned === '') return null;
    const frac = cleaned.match(/^(-?\d+)\/(-?\d+)$/);
    if (frac) {
      const num = Number(frac[1]);
      const den = Number(frac[2]);
      if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) return num / den;
      return null;
    }
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const sn = tryParse(s);
  const en = tryParse(e);
  if (sn !== null && en !== null) {
    return Math.abs(sn - en) < 1e-9;
  }
  const norm = (v: string) =>
    v.toLowerCase()
      .replace(/^[a-z]\s*=\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();
  if (format === 'numeric') {
    // Format said numeric but parsing failed — strict string equality.
    return norm(s) === norm(e);
  }
  if (format === 'mcq') {
    // M1: this branch is LEGACY-ONLY — reached solely when the caller has
    // no `choices` array to resolve option identity from (see
    // computeTryYourselfVerdict). Whenever `choices` are present, option
    // identity via `resolveMcqCorrectChoice` decides correctness instead;
    // this bare submitted-vs-expected string compare is never consulted.
    return norm(s) === norm(e);
  }
  // FRQ: only assert TRUE on exact normalized match; otherwise undecidable.
  if (norm(s) === norm(e)) return true;
  return null;
}

function normalizeLabel(v: string): string {
  return v.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Negation tokens that flip a label's meaning relative to its plain
// reading. Used only to gate the CONTAINMENT fallback below — a negated
// distractor ("Not a concurrent power") textually CONTAINS the expected
// answer ("concurrent power") while meaning the opposite, so it must not
// be treated as a containment match unless the expected answer is
// *itself* a negation (in which case an exact match, not containment,
// is what resolves it — see the negation-both-sides case).
const NEGATION_TOKENS = [/\bnot\b/, /\bnon-/, /\bnever\b/, /n't\b/, /\bcannot\b/, /\bexcept\b/];

function hasNegation(v: string): boolean {
  return NEGATION_TOKENS.some((re) => re.test(v));
}

/** Resolve which MCQ choice counts as "correct" — the ONE decision both
 *  the row ✓ affordance and the verdict text must share.
 *
 *  Priority:
 *   1. A choice explicitly flagged `correct: true` — the brain's
 *      authoritative per-option signal, independent of whatever
 *      `expectedAnswer` text was separately authored.
 *   2. No choice flagged — an EXACT normalized-label match against
 *      `expectedAnswer`, checked across ALL choices before any
 *      containment check is attempted. An exact match is a stronger,
 *      unambiguous signal and must always win regardless of array order.
 *   3. Still nothing — a containment fallback (label contains expected,
 *      or expected contains label), tolerant of one being a
 *      parenthetical-qualified superset of the other. Candidates whose
 *      label carries a negation token that `expectedAnswer` itself
 *      lacks are excluded from this pass: a negated distractor ("Not a
 *      concurrent power") textually contains the expected answer
 *      ("concurrent power") while meaning the opposite, and previously
 *      could win the fallback purely by array position — see the 2026-07
 *      C1 regression (Task X9 review).
 *
 *  Returns undefined when correctness genuinely can't be determined
 *  (no flags, no exact match, and no non-negated containment candidate)
 *  — callers must treat that as "defer to the brain", not "wrong".
 */
export function resolveMcqCorrectChoice(choices: Choice[] | undefined, expectedAnswer: string | undefined): Choice | undefined {
  if (!choices || choices.length === 0) return undefined;
  const flagged = choices.find((c) => c.correct === true);
  if (flagged) return flagged;
  const exp = expectedAnswer ? normalizeLabel(expectedAnswer) : '';
  if (!exp) return undefined;

  // Pass 1: exact normalized match, checked over every choice before any
  // containment logic runs. Must win outright over containment candidates
  // no matter where either sits in the array.
  const exact = choices.find((c) => normalizeLabel(c.text) === exp);
  if (exact) return exact;

  // Pass 2: containment fallback, reached only when no choice is an
  // exact match. Exclude candidates carrying a negation the expected
  // answer doesn't have.
  const expNegated = hasNegation(exp);
  return choices.find((c) => {
    const label = normalizeLabel(c.text);
    if (!label) return false;
    if (!expNegated && hasNegation(label)) return false;
    return label.includes(exp) || exp.includes(label);
  });
}

/** Single decision seam for "was the student's try-yourself submission
 *  correct?" — used to drive the on-board verdict text AND the text
 *  relayed to the brain as a synthetic student turn, so they can never
 *  disagree.
 *
 *  - mcq (with a `choices` array): resolved by OPTION IDENTITY via
 *    `resolveMcqCorrectChoice` — compares the submitted choice id
 *    against the resolved-correct choice's id, not against raw
 *    `expectedAnswer` text.
 *  - mcq with no `choices` (or correctness undecidable): falls back to
 *    `matchesAnswerStrict` against `expectedAnswer`, same as frq/numeric.
 *  - frq / numeric: unchanged — `matchesAnswerStrict` against
 *    `expectedAnswer`.
 */
export function computeTryYourselfVerdict(
  submitted: string,
  expectedAnswer: string | undefined,
  format: 'mcq' | 'frq' | 'numeric' | undefined,
  choices?: Choice[],
): boolean | null {
  if (format === 'mcq' && choices && choices.length > 0) {
    const correctChoice = resolveMcqCorrectChoice(choices, expectedAnswer);
    if (!correctChoice) {
      // Can't identify the correct option from flags or label overlap —
      // asserting a verdict here would mean comparing the submitted
      // CHOICE ID against free-text `expectedAnswer`, the exact
      // mismatch that caused the original bug. Defer to the brain.
      return null;
    }
    const picked = choices.find((c) => c.id === submitted || c.text === submitted);
    if (!picked) return null;
    return picked.id === correctChoice.id;
  }
  return expectedAnswer ? matchesAnswerStrict(submitted, expectedAnswer, format) : null;
}
