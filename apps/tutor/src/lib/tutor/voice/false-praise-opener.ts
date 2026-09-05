/**
 * False-praise-opener guard (holistic-pedagogy round, spec §D.2; fix round 1
 * widened the kill scope and added same-sentence self-correction handling;
 * fix round 2 narrowed the self-correction signal after a re-review probe).
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
 * continuation — so a question-ending check was added to keep it quiet.
 *
 * SELF-CORRECTION NARROWED (fix round 2). A re-review probe found the
 * round-1 "ends in ?" signal over-broad: {sentence:'Right! Should we try
 * another one?', studentUtterance:'C', verifiedExpectedAnswer:'B',
 * choices:[A,B,C letters]} returned `ok` — ANY trailing "?" bypassed even
 * the MCQ-letter kill, including a question with nothing to do with the
 * student's answer. Two fixes:
 *   1. The question-mark signal now requires an actual wh-word (where/what/
 *      why/how/which/when) in the remainder AND a trailing "?" —
 *      `isWhQuestion()`. "Should we try another one?" has no wh-word, so it
 *      no longer counts as self-correcting; "so where did the extra one
 *      go?" still does.
 *   2. The wh-question signal no longer exempts the MCQ-letter kill branch
 *      at all — only `DENIAL_RE` / a contrast marker can. An MCQ pick is
 *      always a terminal, single-shot answer (Important 2's reasoning), so
 *      a trailing question about something else in the same sentence must
 *      not suppress it. `selfCorrectsByDenialOrContrast` and
 *      `selfCorrectsByWhQuestion` are therefore computed and consumed
 *      separately: the MCQ-kill branch checks only the first; the value
 *      branch (and the unverified/advisory branch) check both.
 *
 * DEFERRED GAP (not fixed, recorded for a future round): a single-sentence
 * walk-back like "Right — actually it's thirteen." is exempted here by the
 * contrast marker ("actually") even though the tutor never lets the
 * affirmation stand — that's correct for THIS guard, but it is also
 * invisible to praise-contradiction.ts's bare-denial branch (which needs a
 * LATER sentence). Neither detector currently catches a same-sentence
 * walk-back that substitutes a new value with no denial/contrast word at
 * all ("Right — it's thirteen, not twelve." falls to praise-contradiction's
 * `not <phrase>` branch, but a bare substitution without "not" would not).
 * See `checkFalsePraiseOpener`'s doc comment for the exact scope note.
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

/** A wh-question word — required (fix round 2) alongside a trailing "?" for
 *  the question signal to count, so an UNRELATED question ("Should we try
 *  another one?") can't ride along on any trailing "?". */
const WH_QUESTION_WORD_RE = /\b(?:where|what|why|how|which|when)\b/i;

/** True when the remainder is a denial (`DENIAL_RE`) or contains a contrast
 *  conjunction — the strong signal: this exempts EVERY kill branch,
 *  including the MCQ-letter one (fix round 2: a contrast marker like "but"
 *  after an MCQ pick means the tutor is already correcting itself, so the
 *  kill would be redundant/wrong; see the "but check your sign" pin). */
function selfCorrectsByDenialOrContrast(remainder: string): boolean {
  const r = remainder.trim();
  if (!r) return false;
  return DENIAL_RE.test(r) || CONTRAST_MARKER_RE.test(r);
}

/** True when the remainder is a genuine wh-question ("so where did the
 *  extra one go?") — the weak signal: this NEVER exempts the MCQ-letter
 *  kill branch (fix round 2, New Important), only the value-disagree
 *  branch, because an MCQ pick is always a terminal answer and a trailing
 *  question about something unrelated must not suppress that kill. */
function selfCorrectsByWhQuestion(remainder: string): boolean {
  const r = remainder.trim();
  if (!r) return false;
  return /\?\s*$/.test(r) && WH_QUESTION_WORD_RE.test(r);
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

/**
 * DEFERRED GAP (fix round 2, recorded — not fixed here): a single-sentence
 * walk-back with no denial word and no contrast conjunction at all — e.g.
 * "Right — it's thirteen." said over a student who answered "twelve", with
 * neither "not" nor "but/though/however/actually/except" anywhere — is not
 * caught by this guard (no self-correction signal fires, so it falls
 * through to the normal disagree/kill logic — which is arguably correct
 * for THAT shape) but a *different* single-sentence walk-back that DOES
 * carry a contrast word ("Right — actually it's thirteen.") is exempted by
 * `selfCorrectsByDenialOrContrast` and is ALSO invisible to
 * praise-contradiction.ts's bare-denial branch (which requires the denial
 * to land in a LATER sentence than the opener). That combination is a real
 * blind spot for the "affirm-then-immediately-correct-with-a-hedge-word"
 * shape; left as a follow-up rather than fixed now.
 */
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
    const strongSelfCorrect = selfCorrectsByDenialOrContrast(remainder);
    const whSelfCorrect = selfCorrectsByWhQuestion(remainder);
    if (!isAnswerShaped(args.studentUtterance)) return OK;
    const monetary = !!args.spokenMoneyEnabled && !!args.problemContext && looksMonetary(args.problemContext);
    const verified = (args.verifiedExpectedAnswer ?? '').trim();
    if (verified) {
      if (!isSingleValued(verified)) return OK;
      const m = matchUtteranceToAnswer(args.studentUtterance, verified, args.choices, { monetary });
      if (m.verdict !== 'disagree') return OK;
      const mcqResolved = !!(args.choices && args.choices.length > 0) && isMcqResolvedReason(m.reason);
      if (mcqResolved) {
        // Fix round 2: the MCQ-letter kill checks ONLY the strong signal —
        // a wh-question elsewhere in the sentence must not suppress it.
        if (strongSelfCorrect) return OK;
        return { verdict: 'false_praise', expected: verified, matchReason: m.reason };
      }
      // Value path checks BOTH signals.
      if (strongSelfCorrect || whSelfCorrect) return OK;
      if (args.finalAnswerTurn === true) {
        return { verdict: 'false_praise', expected: verified, matchReason: m.reason };
      }
      return { verdict: 'advisory_false_praise', expected: verified, matchReason: m.reason };
    }
    const unverified = (args.unverifiedCardAnswer ?? '').trim();
    if (unverified && isSingleValued(unverified)) {
      // Unverified never kills regardless of MCQ/value shape, so it is
      // treated like the value path: both signals suppress the advisory.
      if (strongSelfCorrect || whSelfCorrect) return OK;
      const m = matchUtteranceToAnswer(args.studentUtterance, unverified, args.choices, { monetary });
      return m.verdict === 'disagree' ? { verdict: 'advisory_false_praise', expected: unverified, matchReason: m.reason } : OK;
    }
    return OK;
  } catch {
    return OK;
  }
}
