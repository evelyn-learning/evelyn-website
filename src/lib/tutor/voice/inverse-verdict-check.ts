/**
 * Deterministic detector for false DENIALS of a verified-correct answer —
 * the "(3x+2)" class (verdict-detector round, Task 5): the tutor's opener
 * denies an answer ("Not quite — check that again.") when the student's
 * utterance actually MATCHES the verified expected answer for the active
 * problem. Inverse of praise-echo-check.ts (which catches false AFFIRMS);
 * this catches false DENIALS.
 *
 * Two tiers, deliberately asymmetric in consequence:
 *  - KILL tier (`verifiedExpectedAnswer`): only ever populated by verified
 *    paths (pipeline-verified generate_problem, plan-authored, or a blind-
 *    solve-VERIFIED improvised claim). A denial of an utterance that AGREES
 *    with a verified answer is provably false — the caller may kill+retry.
 *  - ADVISORY tier (`unverifiedCardAnswer`): the brain's own claimed answer
 *    for an improvised card that failed pipeline verification. It might
 *    still be right, might still be wrong — the caller must NEVER kill on
 *    it, only nudge (a correction note for the brain to silently re-check).
 *    A wrong unverified card + a correct tutor denial must never kill a
 *    good turn.
 *
 * The verified tier wins whenever both are present (checked first, and only
 * falls through to the unverified tier when `verifiedExpectedAnswer` is
 * absent/empty). `disagree` or `unknown` from the comparator never fires at
 * either tier — a true denial must stand, and an unparseable utterance can't
 * be judged.
 *
 * Pure module — no side effects, never throws (matchUtteranceToAnswer and
 * DENIAL_RE.test are both themselves total).
 */
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';

export interface InverseVerdictResult {
  verdict: 'ok' | 'false_denial' | 'advisory_false_denial';
  expected?: string;
  matchReason?: string;
}

const OK: InverseVerdictResult = { verdict: 'ok' };

export function checkInverseVerdict(args: {
  sentence: string;
  studentUtterance: string;
  verifiedExpectedAnswer?: string;
  unverifiedCardAnswer?: string;
  choices?: Array<{ letter: string; text: string }>;
}): InverseVerdictResult {
  if (!DENIAL_RE.test(args.sentence ?? '')) return OK;

  const verified = (args.verifiedExpectedAnswer ?? '').trim();
  if (verified) {
    const m = matchUtteranceToAnswer(args.studentUtterance, verified, args.choices);
    if (m.verdict === 'agree') return { verdict: 'false_denial', expected: verified, matchReason: m.reason };
    return OK; // disagree OR unknown: denial stands / can't judge
  }

  const unverified = (args.unverifiedCardAnswer ?? '').trim();
  if (unverified) {
    const m = matchUtteranceToAnswer(args.studentUtterance, unverified, args.choices);
    if (m.verdict === 'agree') return { verdict: 'advisory_false_denial', expected: unverified, matchReason: m.reason };
  }

  return OK;
}
