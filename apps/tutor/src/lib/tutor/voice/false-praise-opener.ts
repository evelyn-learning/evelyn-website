/**
 * False-praise-opener guard (holistic-pedagogy round, spec §D.2; fix round 1
 * widened the kill scope and added same-sentence self-correction handling).
 *
 * Third live instance of praise-then-reverse (2026-09-05, QA session turn 5):
 * the student picked a wrong MCQ option and the tutor opened "Right, let's
 * check the reasoning behind it…" then denied it sentences later. Neither
 * praise-contradiction.ts (needs `not <phrase>` / math substitution) nor
 * praise-echo-check.ts (needs a math token or letter IN the opener) can see a
 * bare "Right," followed by prose. But the ground truth was already on the
 * table BEFORE any later text: the student's answer disagreed with the
 * verified key, so a praise-class opener over that answer needs scrutiny.
 *
 * SAME-SENTENCE SELF-CORRECTION (fix round 1, Important 1). A probe found
 * this guard killing turns where the tutor's OWN sentence self-corrects
 * immediately after the opener: "Right, but check your sign — that is not
 * twelve.", "Right - the sign is off though, try again.", "Right, so where
 * did the extra one go?" — all three deny or question the answer in the SAME
 * breath the opener fired in, so the affirmation never actually stood.
 * `checkFalsePraiseOpener` now inspects the text AFTER the opener's
 * punctuation (the "remainder") for three signals that the sentence is
 * already correcting itself rather than closing out: a `DENIAL_RE` match, a
 * contrast conjunction (but/though/however/actually/except), or the
 * remainder itself being a follow-up QUESTION (trailing "?"). The third
 * probe above contains neither a denial phrase nor a contrast word — a bare
 * "so where did the extra one go?" is a Socratic re-check, not a flat
 * continuation — so the question-ending check is required to keep it quiet;
 * verified it does not swallow either must-still-fire case below (neither
 * "Right, let's check the reasoning behind it." nor "Exactly. So that gives
 * us the answer." ends its remainder in "?").
 *
 * TIER WIDENING (fix round 1, Important 2). A probe found this guard killing
 * on an intermediate-step check: {sentence:'Right, now add one.',
 * studentUtterance:'twelve', verifiedExpectedAnswer:'13'} — "twelve" can be
 * correct for a scaffolding sub-step even though it disagrees with the
 * card's FINAL answer, so a flat kill there punishes the tutor for grading
 * the wrong thing. The KILL tier is now split:
 *   (a) MCQ disagree: `choices` supplied AND the comparator resolved via its
 *       letter path (its `reason` starts with "mcq") AND `disagree` — an MCQ
 *       pick is always a terminal, single-shot answer to the posed question,
 *       never an intermediate step, so this still kills regardless of
 *       `finalAnswerTurn`.
 *   (b) Value disagree: kills ONLY when the caller passes
 *       `finalAnswerTurn: true` — an explicit assertion that the student's
 *       utterance answers the POSED CARD, not a scaffolding sub-question.
 *       Without it, a verified value disagree is `advisory_false_praise` (a
 *       correction note, same shape as the unverified tier) rather than a
 *       kill.
 * Unverified stays advisory in every case — it is the brain's own claimed
 * answer for an unverified card, never grounds for a kill.
 *
 * WIRING PRECONDITION: `finalAnswerTurn` must be supplied by the caller
 * (never inferred here) and must only be `true` when the orchestrator itself
 * knows the student's utterance is answering the currently posed card as a
 * whole — not an intermediate/scaffolding sub-question the tutor asked along
 * the way. Passing `true` for a scaffolding answer reintroduces exactly the
 * false kill this round fixed. Multi-valued expected answers (the "roots
 * right, vertex wrong" two-part class) are kept out by `isSingleValued`
 * refusing them before any comparison runs — that refusal, not any
 * structural property of the comparator, is what scopes this guard to
 * single-claim answers; see `isSingleValued` below.
 *
 * Tiers otherwise mirror inverse-verdict-check.ts. Pure, no LLM, never
 * throws.
 */
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';
import { isPureAcknowledgment } from '@/lib/tutor/voice/nonanswer-praise';
import { looksMonetary } from '@/lib/tutor/voice/spoken-money';
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';

export interface FalsePraiseResult { verdict: 'ok' | 'false_praise' | 'advisory_false_praise'; expected?: string; matchReason?: string }
const OK: FalsePraiseResult = { verdict: 'ok' };

/** Affirmation-class openers only. Partial verdicts ("right idea", "close",
 *  "almost", "nearly") are excluded by the mandatory trailing punctuation
 *  alone — none of those continuations are immediately followed by
 *  `[.!,—–:-]`, so no separate negative lookahead is needed (fix round 1,
 *  minor (a): a lookahead here previously duplicated that exclusion as dead
 *  code and has been removed; the exclusion tests still pass on the
 *  punctuation requirement alone). */
export const PRAISE_OPENER_STRICT_RE =
  /^\s*(?:right|yes|yep|exactly|correct|perfect|spot\s+on|bingo|that'?s\s+(?:right|correct|it)|you\s+(?:got|nailed|have)\s+it|well\s+done|nice\s+(?:work|job|one)|great\s+(?:work|job))\s*[.!,—–:-]/i;

/** A same-sentence contrast conjunction — signals the opener is already
 *  being walked back within the same breath (fix round 1, Important 1). */
const CONTRAST_MARKER_RE = /\b(?:but|though|however|actually|except)\b/i;

/** True when the text AFTER a matched opener already undermines it: a
 *  denial (`DENIAL_RE`), a contrast conjunction, or the remainder is itself
 *  a follow-up question ("so where did the extra one go?") — a genuine
 *  Socratic re-check is not a flat continuation. See the fix-round-1 header
 *  note (Important 1) for the probe evidence behind each branch. */
function remainderSelfCorrects(remainder: string): boolean {
  const r = remainder.trim();
  if (!r) return false;
  if (DENIAL_RE.test(r)) return true;
  if (CONTRAST_MARKER_RE.test(r)) return true;
  if (/\?\s*$/.test(r)) return true;
  return false;
}

/** No list separators, at most one '=', short. */
export function isSingleValued(expected: string): boolean {
  const e = expected.trim();
  if (!e || e.length > 40) return false;
  if (/[;,]|\band\b/i.test(e)) return false;
  if ((e.match(/=/g) ?? []).length > 1) return false;
  return true;
}

/** A student utterance carries no gradable claim: empty, a question, or a
 *  pure acknowledgment. Exported (fix round 1, minor (b)) so tests can
 *  assert the filter directly rather than relying solely on the comparator
 *  to independently reject the same input — every `nonanswer-praise.ts`
 *  ACK_PHRASES entry is prose the comparator already calls unparseable on
 *  its own (verified by probe), so an end-to-end-only test wasn't
 *  load-bearing for this function. */
export function isAnswerShaped(utterance: string): boolean {
  const u = utterance.trim();
  if (!u) return false;
  if (/\?\s*$/.test(u)) return false;
  if (isPureAcknowledgment(u)) return false;
  return true;
}

/** True when `reason` came from matchUtteranceToAnswer's MCQ letter-
 *  resolution path — its reason strings are `mcq ${letter}`,
 *  `mcq ${lu}≠${le}`, or `mcq: utterance unresolvable` (see
 *  utterance-answer-match.ts's MCQ branch). */
function isMcqResolvedReason(reason: string): boolean {
  return /^mcq\b/.test(reason ?? '');
}

export function checkFalsePraiseOpener(args: {
  sentence: string; studentUtterance: string;
  verifiedExpectedAnswer?: string; unverifiedCardAnswer?: string;
  choices?: Array<{ letter: string; text: string }>;
  problemContext?: string; spokenMoneyEnabled?: boolean;
  /** Fix round 1 (Important 2): must be `true` ONLY when the caller knows
   *  the student's utterance answers the posed CARD as a whole, not a
   *  scaffolding sub-question — see the wiring-precondition header note.
   *  Optional and defaults to falsy, so existing callers that don't pass it
   *  keep compiling and simply never reach the value-disagree kill branch. */
  finalAnswerTurn?: boolean;
}): FalsePraiseResult {
  try {
    const openerMatch = PRAISE_OPENER_STRICT_RE.exec(args.sentence ?? '');
    if (!openerMatch) return OK;
    const remainder = (args.sentence ?? '').slice(openerMatch.index + openerMatch[0].length);
    if (remainderSelfCorrects(remainder)) return OK;
    if (!isAnswerShaped(args.studentUtterance)) return OK;
    const monetary = !!args.spokenMoneyEnabled && !!args.problemContext && looksMonetary(args.problemContext);
    const verified = (args.verifiedExpectedAnswer ?? '').trim();
    if (verified) {
      if (!isSingleValued(verified)) return OK;
      const m = matchUtteranceToAnswer(args.studentUtterance, verified, args.choices, { monetary });
      if (m.verdict !== 'disagree') return OK;
      const mcqKill = !!(args.choices && args.choices.length > 0) && isMcqResolvedReason(m.reason);
      if (mcqKill || args.finalAnswerTurn === true) {
        return { verdict: 'false_praise', expected: verified, matchReason: m.reason };
      }
      return { verdict: 'advisory_false_praise', expected: verified, matchReason: m.reason };
    }
    const unverified = (args.unverifiedCardAnswer ?? '').trim();
    if (unverified && isSingleValued(unverified)) {
      const m = matchUtteranceToAnswer(args.studentUtterance, unverified, args.choices, { monetary });
      return m.verdict === 'disagree' ? { verdict: 'advisory_false_praise', expected: unverified, matchReason: m.reason } : OK;
    }
    return OK;
  } catch {
    return OK;
  }
}
