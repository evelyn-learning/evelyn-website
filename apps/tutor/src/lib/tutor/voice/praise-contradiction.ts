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
 * VALUE-SUBSTITUTION SHAPE (2026-08-10 root cause, session
 * portal-7cfa226c, AP Calc BC): the "not <phrase>" branch above only
 * catches an EXPLICIT verbal walk-back. The live failure had no "not" at
 * all — the opener affirmed "$2x$", then a later sentence silently
 * substituted a different value into an equality: "the derivative of
 * $3x^2$ is $3 \cdot 2x = 6x$ — so $f''(x) = 6x$." The student hears the
 * tutor affirm one value and then, with zero acknowledgement, assert a
 * DIFFERENT one as the answer.
 *
 * This is scoped to short MATH-TOKEN affirmations only (has a digit,
 * operator, or `$`/`\(` wrapper, and no internal whitespace) — a prose
 * affirmation like "one half" or "great job" never enters this branch, so
 * it can't collide with the existing negation-only tests. Within that
 * scope: scan every inline-math `=` equality in the rest of the turn.  An
 * equality only counts as being ABOUT the affirmed value if the affirmed
 * token (normalized) appears as a substring somewhere on the equality's
 * left side — this is what lets "$3 \cdot 2x = 6x$" qualify (it contains
 * "2x" as a factor) while a same-turn but DIFFERENT problem's equality
 * ("Right. $2x$. Now try $g(x)=x^3$: $g'(x)=3x^2$") does NOT qualify
 * (neither "g(x)" nor "g'(x)" contains "2x") — the existing detector has
 * no cross-problem scoping of its own (it runs on the whole accumulated
 * turn text), so this substring gate is what keeps a topic shift from
 * false-positiving. Once at least one equality qualifies, the turn is
 * flagged only if the FINAL asserted value (the RHS of the LAST qualifying
 * or non-qualifying equality found — i.e. what the turn ultimately lands
 * on) differs from the affirmed token; an equality whose RHS still equals
 * the affirmed token ("$f'(x) = 2x$") is a restatement, not a
 * contradiction.
 *
 * BARE-PRAISE SHAPE (spec §D.3, 2026-09-05 QA session turn 5 — the third
 * live praise-then-reverse instance): the opener praised with NO value at
 * all ("Right, let's check the reasoning behind it.") and a later sentence
 * denied the student's answer ("…so x=9 isn't quite it here."). Both
 * branches above are blind to it — there is no `not <affirmed phrase>` (the
 * affirmed capture is a prose clause, never re-negated verbatim) and no math
 * token to run the substitution scan on. The third branch below therefore
 * fires on a PROSE opener capture only (`isMathValueToken` false, so the two
 * branches above are untouched) when a later sentence carries a denial that
 * is about the SAME claim: it either names a value matching the student's own
 * utterance, or names no value at all (a bare "Not quite —" can only be about
 * what the student just said).
 *
 * Same-claim scoping is what keeps the two-part shape quiet: "Right on the
 * roots — two and three. Not quite on the vertex: it should be (1, -4)…"
 * denies a DIFFERENT value than the one praised, so it never enters. And a
 * denial-SHAPED rhetorical aside ("Not quite the same thing happens with
 * negatives…") is excluded by continuation word, not by value — it names no
 * value, so the "no value named" arm would otherwise swallow it. Exclusions
 * are the only lever this branch tunes on: the fire conditions are fixed.
 *
 * Imports are pure sibling modules only (a regex constant and a string
 * normalizer) — no side effects. Never throws.
 */
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

export const PRAISE_OPENER_RE =
  /^\s*(?:right|yes|exactly|correct|perfect|spot on|that'?s (?:right|correct|it))\s*[—–,.:!-]\s*([^!?\n]{1,120}?)[.!?](?:\s|$)/i;

/** Strips $, \( \), and braces, then all whitespace — used to compare an
 * affirmed value token against equation fragments regardless of delimiter
 * or spacing noise. */
function normalizeMathToken(s: string): string {
  return s
    .replace(/\\\(/g, '')
    .replace(/\\\)/g, '')
    .replace(/[${}]/g, '')
    .replace(/\s+/g, '');
}

/** True when the affirmed phrase looks like a compact math value (a
 * digit/operator/$-delimited token) rather than prose ("one half", "great
 * job") — the value-substitution branch is scoped to this shape only.
 *
 * A token with no internal whitespace always qualifies on the trailing
 * digit/operator/$/backslash check below. A token WITH internal whitespace
 * only qualifies if the ENTIRE trimmed capture is a single delimited math
 * span — either one `$...$` pair or one `\(...\)` pair — and nothing else.
 * This is intentionally a whole-token check, not an existence check: an
 * earlier version accepted whitespace-bearing captures merely for
 * containing a `$` or a backslash ANYWHERE, which let whole prose clauses
 * like "you used $\sqrt{4}$ correctly here, nice job" (backslash present)
 * or multi-span captures like "$2x$ and $3y$" (two `$`-pairs, outer `$`s
 * still satisfy a greedy `^\$.*\$$`) through as a "math value" — exactly
 * the shape `extractPraiseEcho` must never hand back as an affirmed value,
 * since a caller (Task 4) treats that return as ground truth for a kill
 * decision. Requiring a SINGLE unbroken delimited span closes both holes:
 * a clause with English words around a `$...$` token no longer starts/ends
 * with `$`/`\(`+`\)`, and a two-span capture has extra `$` chars inside the
 * outer pair, which the non-greedy-interior `[^$]*`/`[^)]*` reject. */
function isMathValueToken(affirmed: string): boolean {
  const raw = affirmed.trim();
  if (!raw) return false;
  if (/\s/.test(raw) && !/^\$[^$]*\$$/.test(raw) && !/^\\\([^)]*\\\)$/.test(raw)) {
    return false;
  }
  return /[$\d^*/+\-\\]/.test(raw);
}

/** Finds every inline-math span ($...$ or \(...\)) in `text` containing at
 * least one "=" and returns, for each, its LHS-side text (everything
 * before the final "=") and its RHS token (normalized). */
function findEqualitiesInMath(text: string): Array<{ lhs: string; rhsNorm: string }> {
  const spanRe = /\$([^$]+)\$|\\\(([^)]+)\\\)/g;
  const out: Array<{ lhs: string; rhsNorm: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = spanRe.exec(text)) !== null) {
    const content = m[1] ?? m[2] ?? '';
    const segments = content.split('=').map((s) => s.trim()).filter((s) => s.length > 0);
    if (segments.length < 2) continue;
    out.push({
      lhs: normalizeMathToken(segments.slice(0, -1).join('')),
      rhsNorm: normalizeMathToken(segments[segments.length - 1]),
    });
  }
  return out;
}

/** Denials the shared DENIAL_RE (anchored, opener-shaped) does not carry —
 *  the clause-final forms the live instance used ("…so x=9 isn't quite it
 *  here."). Unanchored on purpose: in this shape the denial lands mid-sentence
 *  after the substitution, not at the start of one. */
const BARE_DENIAL_RE = /\b(?:isn'?t\s+(?:quite\s+)?(?:it|right|correct)|not\s+quite\s+(?:it|right)|that'?s\s+not\s+(?:it|right|correct))\b/i;

/** A denial-shaped opening that is actually a rhetorical COMPARISON ("not
 *  quite the same thing happens with negatives…", "not quite like the last
 *  one") — it denies nothing the student said. Excluded before the value test
 *  because such an aside typically names no value, which the "no value named"
 *  arm would otherwise read as a bare denial of the student's answer. This is
 *  the exact aside class VoiceTutorRealtime's inverse-verdict gate documents. */
const DENIAL_ASIDE_RE = /\b(?:not\s+quite|isn'?t\s+quite)\s+(?:the\s+same|similar|like|as)\b/i;

/** A denial framed as a HYPOTHETICAL or a FORWARD warning — "if someone said
 *  the slope is negative, that's not correct", "careful on the next one…",
 *  "a common mistake is…". It denies a claim nobody made, so it is never a
 *  verdict on this student's answer, whether or not a value is named (fix
 *  round 1, Important 1). Applied to BOTH arms of the branch for that reason. */
const DENIAL_HYPOTHETICAL_RE =
  /\b(?:if\s+(?:someone|you|a\s+student)|careful|watch\s+(?:out\s+)?(?:for|on)|on\s+the\s+next|a\s+common\s+mistake|students\s+often|would(?:n'?t)?\s+be)\b/i;

/** A denial scoped to a PART of the work ("your sign ON THE second term
 *  isn't quite right") rather than to the answer as a whole. Applied to the
 *  value-free arm ONLY: with no value named, "a bare denial can only be
 *  about what the student just said" is exactly the assumption a part-scoped
 *  denial breaks (fix round 1, Important 1). The same-value arm has positive
 *  evidence the denial is about the student's own number, so it is not
 *  weakened here — the live instance 3 denies "on the other side, so x=9
 *  isn't quite it" and must keep firing. */
const PART_SCOPE_RE = /\b(?:on|for|in|with)\s+(?:the|your)\s+\w+/i;

/** Digits, decimals, fractions, or a $…$ span — "a value was named". */
const VALUE_TOKEN_RE = /\d+(?:[./]\d+)?|\$[^$]+\$/g;

/** Abbreviations whose trailing period is not a sentence end (fix round 1,
 *  minor 3). Without this, "…roughly 30 percent, i.e. not quite right." splits
 *  into a value-bearing fragment and a value-FREE denial fragment, and the
 *  value-free arm then reads that fragment as a bare denial of the student's
 *  answer. */
const ABBREV_TAIL_RE = /(?:^|\s)(?:vs|e\.g|i\.e|approx|etc)\.$/i;

function splitSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+/);
  const merged: string[] = [];
  for (const part of parts) {
    if (merged.length > 0 && ABBREV_TAIL_RE.test(merged[merged.length - 1])) {
      merged[merged.length - 1] += ' ' + part;
    } else {
      merged.push(part);
    }
  }
  return merged.map((s) => s.trim()).filter(Boolean);
}

/** Spoken numerals → digits, then strip currency/whitespace and a leading
 *  "x=" style variable label, so "x equals nine" and "x=9" compare. */
function normValue(s: string): string {
  return spokenNumbersToDigits(s).toLowerCase().replace(/[$\s]/g, '').replace(/^[a-z]'?=/, '');
}

/** Does a value named in the denial refer to what the student said?
 *
 *  Equality, or a SUFFIX match on a token boundary. The suffix arm exists so
 *  a labelled utterance ("x equals nine" → "xequals9") still matches a bare
 *  "9"; the boundary condition is what stops it matching a DIFFERENT number
 *  that merely ends the same way (fix round 1, Important 2: "one hundred
 *  nineteen" → "119" must NOT match a denial naming "9"). The character
 *  immediately before the matched suffix must therefore not be a digit —
 *  "xequals9" passes ("s"), "119" does not ("1"). */
function matchesStudentValue(named: string, studentVal: string): boolean {
  if (!named) return false;
  if (named === studentVal) return true;
  if (!studentVal.endsWith(named)) return false;
  const prev = studentVal[studentVal.length - named.length - 1];
  return prev !== undefined && !/\d/.test(prev);
}

/** @param opts.studentUtterance  the utterance the turn is grading — scopes
 *   the §D.3 branch to the SAME claim.
 *  @param opts.bareDenialWidening  set FALSE to disable the §D.3 branch
 *   entirely and get byte-identical pre-widening behaviour. Defaults to true
 *   (the module's spec behaviour); the orchestrator passes false when
 *   `TUTOR_FALSE_PRAISE_OPENER` is off, so that flag is a true kill switch for
 *   the widening as well as for the false-praise-opener guard — a kill path
 *   whose switch only half-disables it is the trap this repo keeps re-learning. */
/** Which of the three shapes fired. The caller needs it because the kill
 *  REASON differs: 'negation' and 'substitution' both have an affirmed VALUE
 *  the turn later contradicts, while 'bare-denial' affirmed prose and the
 *  contradiction is a later denial of the student's answer — describing that
 *  as "you praised value X then asserted a different one" is nonsense. */
export type PraiseContradictionBranch = 'negation' | 'substitution' | 'bare-denial';

export function detectPraiseContradiction(
  turnText: string,
  opts?: { studentUtterance?: string; bareDenialWidening?: boolean },
): { affirmed: string; branch: PraiseContradictionBranch } | null {
  const m = turnText.match(PRAISE_OPENER_RE);
  if (!m) return null;
  const affirmed = m[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
  if (!affirmed) return null;
  const rest = turnText.slice(m.index! + m[0].length).replace(/\*/g, '');
  const escaped = affirmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Trailing boundary uses a negative lookahead rather than \b: \b requires
  // a word\/non-word transition, which fails when the affirmed token itself
  // ends in a non-word char (e.g. a `$`-delimited math span) followed by
  // whitespace or end-of-string — both sides non-word, no transition, so a
  // literal "not $2x$" would never match. (?!\w) keeps the same protection
  // for word-ending tokens (still rejects "not one halves" as a match for
  // "one half") while correctly closing after symbol-ending tokens.
  const contra = new RegExp(`\\bnot\\s+${escaped}(?!\\w)`, 'i');
  if (contra.test(rest)) return { affirmed, branch: 'negation' };

  if (isMathValueToken(affirmed)) {
    const affirmedNorm = normalizeMathToken(affirmed);
    const equalities = findEqualitiesInMath(rest);
    let qualifies = false;
    let finalRhsNorm: string | null = null;
    for (const eq of equalities) {
      if (eq.lhs.includes(affirmedNorm)) qualifies = true;
      finalRhsNorm = eq.rhsNorm;
    }
    if (qualifies && finalRhsNorm !== null && finalRhsNorm !== affirmedNorm) {
      return { affirmed, branch: 'substitution' };
    }
  }

  // Spec §D.3 — bare praise opener (prose capture, not a math token) followed
  // by a denial that either names the student's own value or names NO value.
  if (opts?.bareDenialWidening !== false && !isMathValueToken(affirmed)) {
    const sentences = splitSentences(rest);
    const studentVal = opts?.studentUtterance ? normValue(opts.studentUtterance) : '';
    for (const s of sentences) {
      // Where the denial sits, so "before the denial marker" is answerable.
      // DENIAL_RE is anchored, so an opener-shaped denial is always at 0.
      const bare = BARE_DENIAL_RE.exec(s);
      const denialIdx = DENIAL_RE.test(s) ? 0 : (bare ? bare.index : -1);
      if (denialIdx < 0) continue;
      // Exclusions below (never fire conditions): each one only ever skips.
      // A comparison aside, not a verdict.
      if (DENIAL_ASIDE_RE.test(s)) continue;
      // A hypothetical or a forward warning — denies a claim nobody made.
      if (DENIAL_HYPOTHETICAL_RE.test(s)) continue;
      const named = (s.match(VALUE_TOKEN_RE) ?? []).map(normValue);
      if (named.length === 0) {
        // Value-free arm only: a denial scoped to a PART of the work is not
        // a verdict on the whole answer. "Before the denial marker" is what
        // makes it part-scoping rather than an unrelated later clause.
        const partScope = PART_SCOPE_RE.exec(s);
        if (partScope && partScope.index < denialIdx) continue;
        return { affirmed, branch: 'bare-denial' };
      }
      if (studentVal && named.some((v) => matchesStudentValue(v, studentVal))) return { affirmed, branch: 'bare-denial' };
    }
  }

  return null;
}

/** Extracts the affirmed value phrase from a praise opener (same capture and
 * cleanup as `detectPraiseContradiction`), independent of whether a later
 * contradiction exists in the turn. Returns null when there is no opener
 * match, the cleaned-up capture is empty, or the capture is not a
 * math-value token per `isMathValueToken` (Task 4 uses this to seed
 * echo/board comparisons for math-shaped affirmations only — prose phrases
 * like "one half" are out of scope here, matching the value-substitution
 * branch above).
 *
 * Note on "bare praise" ("Right. Now try the next one."): that case is
 * rejected by the LAST check (not a math-value token), not by an absent or
 * empty capture — the opener regex still captures the trailing clause
 * ("Now try the next one"), it is simply prose, so `isMathValueToken`
 * correctly refuses it. */
export function extractPraiseEcho(turnText: string): string | null {
  const m = turnText.match(PRAISE_OPENER_RE);
  if (!m) return null;
  const affirmed = m[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
  if (!affirmed) return null;
  if (!isMathValueToken(affirmed)) return null;
  return affirmed;
}
