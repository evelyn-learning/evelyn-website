/**
 * Praise-echo check (verdict-detector round, session portal-cb2addf5): the
 * R41 target class where the brain's opener AFFIRMS a value that DISAGREES
 * with what the student actually said out loud — "Right — $2x$." after the
 * student said "three x". `detectPraiseContradiction` (praise-contradiction.ts)
 * catches the brain contradicting ITSELF later in the same turn; this module
 * catches the brain's affirmation contradicting the STUDENT, using the
 * tri-state utterance comparator built in Tasks 1-2.
 *
 * Two branches, both gated to fire ONLY on a full-parse 'disagree' verdict
 * from `matchUtteranceToAnswer` — 'agree' and 'unknown' always resolve to
 * 'ok', so a hedged, unparseable, or genuinely-matching student utterance
 * can never trigger a kill:
 *
 * 1. PRIMARY branch — `extractPraiseEcho` returned a compact math-value
 *    token (its own `isMathValueToken` gate gives us that guarantee: no
 *    bare praise, no prose phrases). That token is compared against the
 *    utterance with `choices` deliberately withheld (see the single-letter
 *    guard below for why) — a math token is never an MCQ letter, choices
 *    have no legitimate role in resolving it.
 * 2. MCQ-SCOPED branch (design decision 2026-08-10) — `extractPraiseEcho`
 *    returned null (the opener's capture wasn't a math-value token, e.g. a
 *    bare letter like "B") AND an MCQ problem is live (`choices` supplied).
 *    Re-derives the same opener capture directly via `PRAISE_OPENER_RE` and
 *    resolves it against the live choices — see the branch body below for
 *    the full rationale and guards.
 *
 * Pure, no LLM, no side effects, never throws.
 */
import { extractPraiseEcho, PRAISE_OPENER_RE } from '@/lib/tutor/voice/praise-contradiction';
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';

export interface PraiseEchoResult { verdict: 'ok' | 'false_praise'; affirmed?: string; studentSaid?: string; matchReason?: string }

/** MCQ-scoped capture length guard (design decision 2026-08-10): a letter
 *  or "option B" shape, never a clause. Cheap first gate before the capture
 *  ever reaches the comparator — matchUtteranceToAnswer's own unresolvable-
 *  expected fallthrough is a second, independent guard behind it. */
const MCQ_CAPTURE_MAX_LEN = 12;

export function checkPraiseEcho(args: {
  turnTextSoFar: string; studentUtterance: string;
  choices?: Array<{ letter: string; text: string }>;
}): PraiseEchoResult {
  const affirmed = extractPraiseEcho(args.turnTextSoFar);
  if (affirmed) {
    // Fix (2026-08-10, review Critical): a $-wrapped SINGLE letter a-e
    // ("Right — $b$! Good work.") is a math-variable affirmation, not an
    // MCQ echo — but resolveMcqLetter's normMcqText strips $-delimiters
    // before comparing, so "$b$" and choice-letter "B" collide. Worse: even
    // WITHOUT choices, a bare single letter still reaches the EXPRESSION
    // path in matchUtteranceToAnswer ('c' vs 'b', both parse flat →
    // disagree) — variable names are exactly the shape that path is built
    // to compare, so it can't tell "the variable is b" from "the choice is
    // B" apart on its own. Strip $/\(\)/{} delimiters from the affirmed
    // capture; if what remains is a single alphabetic character — OPTIONALLY
    // followed by up to two primes ("y'", "b''", derivative notation, fixed
    // 2026-08-10 re-review: "Right — $y'$!" strips to "y'", which is exactly
    // as ambiguous a variable/label reference as the unprimed case and is
    // common in calculus tutoring; the unprimed-only regex let it slip past
    // this guard and back into the same wrongful-kill shape) — the phrase is
    // too ambiguous (variable/label vs. MCQ letter) to kill on at all — bail
    // to 'ok' before the comparator ever runs. Multi-char, non-prime tokens
    // ("$2x$", "$0.5$") are unaffected.
    const strippedAffirmed = affirmed.replace(/\\\(|\\\)|[${}]/g, '').trim();
    if (/^[a-zA-Z]'{0,2}$/.test(strippedAffirmed)) {
      return { verdict: 'ok' };
    }
    // Fix (round-3 review Important): the mirror-image collision. Student
    // says a bare choice LETTER ("C"); the opener affirms that choice's
    // VALUE ("Right — $5$.") — extractPraiseEcho's isMathValueToken gate
    // grabbed "5" as a legit math token (it's not the ambiguous-letter
    // shape the guard above exists for), so 'c' vs '5' both full-parse in
    // the comparator and DISAGREE, wrongfully killing a correct turn. The
    // affirmed math value can never be resolved back to a letter — there's
    // no principled way to judge "does 5 agree with C" — so once an MCQ is
    // live AND the student's utterance is nothing but a live choice letter
    // (optionally trailing punctuation), the comparison is unjudgeable:
    // bail to 'ok' before matchUtteranceToAnswer ever runs. A genuine
    // math-value utterance ("three x") is untouched — it isn't a bare
    // letter, so it still reaches the comparator below.
    if (args.choices && args.choices.length > 0) {
      const bareLetter = args.studentUtterance.trim().replace(/[.!?,;:]+$/, '');
      if (
        /^[a-zA-Z]$/.test(bareLetter) &&
        args.choices.some((c) => c.letter.toUpperCase() === bareLetter.toUpperCase())
      ) {
        return { verdict: 'ok' };
      }
    }
    // `choices` deliberately withheld here (fix, same review): extractPraiseEcho's
    // output is always a math token (isMathValueToken gate), never an MCQ
    // letter — choices have no legitimate role in resolving it, and passing
    // them through only reopens the letter/variable collision the guard
    // above exists to close (a surviving multi-char capture could still
    // resolve via resolveMcqLetter's TEXT-match path against a live choice
    // whose text happens to equal the token).
    const m = matchUtteranceToAnswer(args.studentUtterance, affirmed, undefined);
    if (m.verdict === 'disagree') {
      return { verdict: 'false_praise', affirmed, studentSaid: args.studentUtterance, matchReason: m.reason };
    }
    return { verdict: 'ok' };
  }

  // MCQ-scoped branch (design decision 2026-08-10, resolving the Step-1
  // "mcq echo mismatch fires" NEEDS_CONTEXT): extractPraiseEcho only ever
  // returns a value for compact MATH tokens (isMathValueToken), so a
  // bare-letter opener like "Right — B." always comes back null from it —
  // BY DESIGN. Loosening that gate to accept bare letters would let a
  // non-MCQ "Right — B." (B as a label reference, not a choice) manufacture
  // a wrongful kill against an unrelated utterance ("3x" vs expected "b" —
  // both parse, disagree, kill). That gate stays frozen; praise-
  // contradiction.ts is Task 3's and out of scope here.
  //
  // Bare-letter MCQ affirmations are instead handled HERE, gated on
  // `choices` actually being supplied — i.e. only when an MCQ problem is
  // live, which is the only context where a bare letter unambiguously
  // means a choice. Re-run the same PRAISE_OPENER_RE opener match (exported
  // by praise-contradiction.ts) directly, clean the capture the same way
  // extractPraiseEcho/detectPraiseContradiction do (strip emphasis
  // asterisks, trim, collapse whitespace), reject anything longer than a
  // letter/"option B" shape, then hand the capture to matchUtteranceToAnswer
  // as the `expected` side with `choices` attached — its own MCQ path
  // (resolveMcqLetter on both sides) does the real comparison, and its
  // unresolvable-expected fallthrough / unresolvable-utterance 'unknown'
  // are what keep prose from ever reaching a kill.
  if (args.choices && args.choices.length > 0) {
    const om = args.turnTextSoFar.match(PRAISE_OPENER_RE);
    if (om) {
      const capture = om[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
      if (capture && capture.length <= MCQ_CAPTURE_MAX_LEN) {
        const m = matchUtteranceToAnswer(args.studentUtterance, capture, args.choices);
        if (m.verdict === 'disagree') {
          return { verdict: 'false_praise', affirmed: capture, studentSaid: args.studentUtterance, matchReason: m.reason };
        }
      }
    }
  }

  return { verdict: 'ok' };
}
