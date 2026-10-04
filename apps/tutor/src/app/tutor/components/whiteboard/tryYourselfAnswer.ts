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

import { gradeRelationAnswer, isInequalityText, relationGradingEnabled, type RelationWitness } from '@/lib/tutor/voice/utterance-answer-match';

/** Options for the exact inequality check (2026-10-03).
 *
 *  `relationGrading` is an explicit OPT-IN on `matchesAnswerStrict` /
 *  `computeTryYourselfVerdict`, and that is deliberate: TryYourselfRenderer
 *  calls the 4-argument `computeTryYourselfVerdict` and prints
 *  "Not quite. Expected: <answer>" whenever it returns false. The owner
 *  decision is that a wrong typed inequality must NOT reveal the answer, so a
 *  caller may only receive `false` for an inequality if it also honours
 *  `revealExpected` — i.e. it goes through `gradeTryYourself`, which applies
 *  the NEXT_PUBLIC_TUTOR_RELATION_GRADING kill switch (default ON). */
export interface RelationGradingOpts {
  relationGrading?: boolean;
  /** The problem statement. A WRONG verdict needs it: it must be a plain
   *  "solve this relation" statement whose solution is the expected answer
   *  (gradeRelationAnswer). Without that, a differing answer is undecidable. */
  problemText?: string;
}

/** How an inequality submission was decided. Present only when it WAS
 *  decided exactly; `witness` only on a mismatch. */
export interface TryYourselfRelationDetail {
  matches: boolean;
  witness?: RelationWitness;
}

export interface TryYourselfGrade {
  verdict: boolean | null;
  relation?: TryYourselfRelationDetail;
  /** Whether the card may print "Expected: …" beside "Not quite". True for a
   *  wrong verdict, EXCEPT that an inequality key (isInequalityText) is never
   *  revealed — whatever the response format or verdict path. */
  revealExpected: boolean;
}

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
 *
 *  2026-10-03/04: with `opts.relationGrading`, an answer whose expected value
 *  is an INEQUALITY is decided by the relation path FIRST, whatever the
 *  response format: solved-form and the same solution set → true; a different
 *  set on a provably pure-solve problem → false; anything else → the legacy
 *  string compare may still say true (string-equal), never false.
 */
export function matchesAnswerStrict(
  submitted: string,
  expected: string,
  format: 'mcq' | 'frq' | 'numeric' | undefined,
  opts?: RelationGradingOpts,
): boolean | null {
  return matchesAnswerDetailed(submitted, expected, format, opts).verdict;
}

function matchesAnswerDetailed(
  submitted: string,
  expected: string,
  format: 'mcq' | 'frq' | 'numeric' | undefined,
  opts?: RelationGradingOpts,
): { verdict: boolean | null; relation?: TryYourselfRelationDetail } {
  if (!opts?.relationGrading || !isInequalityText(expected)) {
    return { verdict: matchesAnswerLegacy(submitted, expected, format) };
  }
  // Inequality key: the relation path decides FIRST, regardless of format. The
  // numeric / choiceless-mcq string compare is whitespace- and
  // spelling-sensitive ("x < 5" ≠ "x<5", "x \lt 5"), so its `false` is not a
  // verdict about an inequality at all.
  if (submitted.trim() && expected.trim()) {
    const g = gradeRelationAnswer(submitted, expected, { problemText: opts.problemText });
    if (g.verdict === 'agree') return { verdict: true, relation: { matches: true } };
    if (g.verdict === 'disagree') return { verdict: false, relation: { matches: false, witness: g.witness } };
  }
  // Not decided exactly: string-equal may still confirm; nothing may deny.
  return { verdict: matchesAnswerLegacy(submitted, expected, format) === true ? true : null };
}

function matchesAnswerLegacy(submitted: string, expected: string, format: 'mcq' | 'frq' | 'numeric' | undefined): boolean | null {
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
  opts?: RelationGradingOpts,
): boolean | null {
  return gradeDetailed(submitted, expectedAnswer, format, choices, opts).verdict;
}

function gradeDetailed(
  submitted: string,
  expectedAnswer: string | undefined,
  format: 'mcq' | 'frq' | 'numeric' | undefined,
  choices: Choice[] | undefined,
  opts: RelationGradingOpts | undefined,
): { verdict: boolean | null; relation?: TryYourselfRelationDetail } {
  if (format === 'mcq' && choices && choices.length > 0) {
    const correctChoice = resolveMcqCorrectChoice(choices, expectedAnswer);
    if (!correctChoice) {
      // Can't identify the correct option from flags or label overlap —
      // asserting a verdict here would mean comparing the submitted
      // CHOICE ID against free-text `expectedAnswer`, the exact
      // mismatch that caused the original bug. Defer to the brain.
      return { verdict: null };
    }
    const picked = choices.find((c) => c.id === submitted || c.text === submitted);
    if (!picked) return { verdict: null };
    return { verdict: picked.id === correctChoice.id };
  }
  return expectedAnswer ? matchesAnswerDetailed(submitted, expectedAnswer, format, opts) : { verdict: null };
}

/** The full decision for one submission: the verdict, how an inequality was
 *  decided (with the witness), and whether the card may show the expected
 *  answer. Same seam as `computeTryYourselfVerdict`, plus exact inequality
 *  grading — ON unless NEXT_PUBLIC_TUTOR_RELATION_GRADING=off or the caller
 *  passes `relationGrading: false`.
 *
 *  Both the card and the brain relay should call THIS, so the two cannot
 *  disagree and the card cannot print the key for a wrong inequality. */
export function gradeTryYourself(
  submitted: string,
  expectedAnswer: string | undefined,
  format: 'mcq' | 'frq' | 'numeric' | undefined,
  choices?: Choice[],
  opts?: RelationGradingOpts,
): TryYourselfGrade {
  const relationGrading = opts?.relationGrading ?? relationGradingEnabled();
  const inequalityKey = isInequalityText(expectedAnswer);
  const graded = gradeDetailed(submitted, expectedAnswer, format, choices, { ...opts, relationGrading });
  const { relation } = graded;
  let { verdict } = graded;
  // With relation grading OFF (kill switch / opt-out) a typed inequality goes
  // back to the legacy string compare, whose numeric / choiceless-mcq `false`
  // only means "the strings differ" — and this card has no way to say "Not
  // quite" without the key. Undecidable instead; the tutor judges.
  const byOptionIdentity = format === 'mcq' && !!choices && choices.length > 0;
  if (inequalityKey && verdict === false && !relation && !byOptionIdentity) verdict = null;
  // Owner rule: a wrong TYPED inequality never shows the expected answer —
  // for any inequality key, whatever path produced the verdict. An option
  // pick is not typed: the key is one of the choices already on the card,
  // and a wrong pick shows the correct option as for any other MCQ.
  const hideKey = inequalityKey && !byOptionIdentity;
  return { verdict, ...(relation ? { relation } : {}), revealExpected: verdict === false && !relation && !hideKey };
}

/** The synthetic turn that tells the brain about a try-yourself submission.
 *  ONE builder for both call sites (TutorSession.tsx and tutor/page.tsx held
 *  byte-identical copies). Without `relation` the text is exactly what those
 *  copies produced. The opening `[try-yourself submission. The student
 *  submitted: "…". Expected:` is keyed on by marker-student-echo.ts, and
 *  "does NOT match" by the system prompt — neither may change.
 *
 *  For an exactly-graded inequality the verdict is stated as a fact, and a
 *  mismatch carries the witness so the brain can show WHY without reading
 *  out the key. */
export function buildTryYourselfMarker(
  answer: string,
  expected: string | undefined,
  isCorrect: boolean | null,
  relation?: TryYourselfRelationDetail,
): string {
  if (!expected) {
    return `[try-yourself submission. The student submitted: "${answer}". No expected answer set — judge correctness yourself. If wrong, stay on this same try-yourself; do NOT advance to a new problem.]`;
  }
  const rules = `If "does NOT match", stay on this same try-yourself — give a hint, do NOT call new_page or show a different problem. If undecidable, judge algebraic equivalence yourself.`;
  if (relation && isCorrect !== null) {
    const w = relation.witness;
    const witness = !w ? ''
      : w.submittedHolds
        ? `: at ${w.variable} = ${w.value} the student's answer holds and the expected answer does not`
        : `: at ${w.variable} = ${w.value} the expected answer holds and the student's answer does not`;
    const verdict = isCorrect
      ? 'matches the expected answer (checked exactly as an inequality — the same solution set, whatever form it is written in)'
      : `does NOT match the expected answer (checked exactly as an inequality${witness})`;
    const exact = isCorrect
      ? ' This verdict is exact, not a string comparison — treat the answer as correct.'
      : ' This verdict is exact — do not praise the answer or call it correct. Use that value to help the student see what is off; do NOT state the expected answer outright.';
    return `[try-yourself submission. The student submitted: "${answer}". Expected: ${expected}. Verdict: ${verdict}. ${rules}${exact}]`;
  }
  const verdict =
    isCorrect === true ? 'matches the expected answer (string-equal)'
    : isCorrect === false ? 'does NOT match the expected answer'
    : '(undecidable by string match — judge equivalence yourself, accepting any algebraically-correct form)';
  return `[try-yourself submission. The student submitted: "${answer}". Expected: ${expected}. Verdict: ${verdict}. ${rules}]`;
}
