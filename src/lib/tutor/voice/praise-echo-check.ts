/**
 * Praise-echo check (verdict-detector round, session portal-cb2addf5): the
 * R41 target class where the brain's opener AFFIRMS a value that DISAGREES
 * with what the student actually said out loud — "Right — $2x$." after the
 * student said "three x". `detectPraiseContradiction` (praise-contradiction.ts)
 * catches the brain contradicting ITSELF later in the same turn; this module
 * catches the brain's affirmation contradicting the STUDENT, using the
 * tri-state utterance comparator built in Tasks 1-2.
 *
 * Deliberately thin: `extractPraiseEcho` already scopes the affirmed phrase
 * to compact math-value tokens (no bare praise, no prose phrases), and
 * `matchUtteranceToAnswer` already collapses anything ambiguous to
 * 'unknown'. This module only wires the two together and narrows to the
 * 'disagree' verdict — 'agree' and 'unknown' both resolve to 'ok', so a
 * hedged, unparseable, or genuinely-matching student utterance can never
 * trigger a kill. Pure, no LLM, no side effects, never throws.
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
    const m = matchUtteranceToAnswer(args.studentUtterance, affirmed, args.choices);
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
