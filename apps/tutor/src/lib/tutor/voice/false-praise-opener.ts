/**
 * False-praise-opener guard (holistic-pedagogy round, spec §D.2).
 *
 * Third live instance of praise-then-reverse (2026-09-05, QA session turn 5):
 * the student picked a wrong MCQ option and the tutor opened "Right, let's
 * check the reasoning behind it…" then denied it sentences later. Neither
 * praise-contradiction.ts (needs `not <phrase>` / math substitution) nor
 * praise-echo-check.ts (needs a math token or letter IN the opener) can see a
 * bare "Right," followed by prose. But the ground truth was already on the
 * table BEFORE any later text: the student's answer disagreed with the
 * verified key, so a praise-class opener was false by construction.
 *
 * Same-claim scoping is structural: the claim is the student's answer to the
 * posed problem. Multi-valued expected answers (the "roots right, vertex
 * wrong" two-part class) never enter — `isSingleValued` refuses them, and
 * the comparator returns unknown/partial for them anyway.
 *
 * Tiers mirror inverse-verdict-check.ts: a VERIFIED expected answer may
 * kill; an unverified card answer is advisory only.
 * Pure, no LLM, never throws.
 */
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';
import { isPureAcknowledgment } from '@/lib/tutor/voice/nonanswer-praise';
import { looksMonetary } from '@/lib/tutor/voice/spoken-money';

export interface FalsePraiseResult { verdict: 'ok' | 'false_praise' | 'advisory_false_praise'; expected?: string; matchReason?: string }
const OK: FalsePraiseResult = { verdict: 'ok' };

/** Affirmation-class openers only. Partial verdicts ("right idea", "close",
 *  "almost", "nearly") are excluded — they are not affirmations. */
export const PRAISE_OPENER_STRICT_RE =
  /^\s*(?:right|yes|yep|exactly|correct|perfect|spot\s+on|bingo|that'?s\s+(?:right|correct|it)|you\s+(?:got|nailed|have)\s+it|well\s+done|nice\s+(?:work|job|one)|great\s+(?:work|job))(?!\s+(?:idea|track|direction|thinking|start))\s*[.!,—–:-]/i;

/** No list separators, at most one '=', short. */
export function isSingleValued(expected: string): boolean {
  const e = expected.trim();
  if (!e || e.length > 40) return false;
  if (/[;,]|\band\b/i.test(e)) return false;
  if ((e.match(/=/g) ?? []).length > 1) return false;
  return true;
}

function isAnswerShaped(utterance: string): boolean {
  const u = utterance.trim();
  if (!u) return false;
  if (/\?\s*$/.test(u)) return false;
  if (isPureAcknowledgment(u)) return false;
  return true;
}

export function checkFalsePraiseOpener(args: {
  sentence: string; studentUtterance: string;
  verifiedExpectedAnswer?: string; unverifiedCardAnswer?: string;
  choices?: Array<{ letter: string; text: string }>;
  problemContext?: string; spokenMoneyEnabled?: boolean;
}): FalsePraiseResult {
  try {
    if (!PRAISE_OPENER_STRICT_RE.test(args.sentence)) return OK;
    if (!isAnswerShaped(args.studentUtterance)) return OK;
    const monetary = !!args.spokenMoneyEnabled && !!args.problemContext && looksMonetary(args.problemContext);
    const verified = (args.verifiedExpectedAnswer ?? '').trim();
    if (verified) {
      if (!isSingleValued(verified)) return OK;
      const m = matchUtteranceToAnswer(args.studentUtterance, verified, args.choices, { monetary });
      return m.verdict === 'disagree' ? { verdict: 'false_praise', expected: verified, matchReason: m.reason } : OK;
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
