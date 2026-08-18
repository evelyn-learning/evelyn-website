// apps/tutor/scripts/tutor/verdict-bank/classifier.ts
/**
 * Verdict-opener classifier for the probe bank. Scans the FIRST TWO
 * sentences of a tutor reply — the repo's verdict-hold machinery treats
 * the opener as the verdict site, and every live incident's verdict
 * appeared in sentence 1 or 2. Deliberately regex-only (no LLM): the bank
 * measures the brain, so the grader must be deterministic.
 */
import { DENIAL_RE } from '../../../src/lib/tutor/voice/simplification-verdict-check';

export type VerdictClass = 'affirm' | 'deny' | 'none';
export type ProbeExpected = VerdictClass;
export type ProbeGrade = 'pass' | 'fail' | 'no-verdict';

const AFFIRM_RE =
  /^\s*(?:right\b|yes\b|yep\b|yeah[,!]?\s+(?:exactly|that)|exactly\b|correct\b|perfect\b|spot on\b|bingo\b|nice(?:\s+work|\s+catch|[.!,—-])|great\s+(?:work|job|catch|call)|good\s+(?:work|job|call|catch|instinct)|well done\b|nailed it\b|that'?s\s+(?:right|correct|it|exactly))/i;

const EXTRA_DENY_RE = /^\s*(?:no\b(?!\s+(?:worries|problem|rush))|nope\b|hmm+,?\s+no\b|wrong\b|incorrect\b)/i;

function firstTwoSentences(text: string): string[] {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2);
}

export function classifyVerdictOpener(tutorText: string): VerdictClass {
  for (const s of firstTwoSentences(tutorText)) {
    if (DENIAL_RE.test(s) || EXTRA_DENY_RE.test(s)) return 'deny';
    if (AFFIRM_RE.test(s)) return 'affirm';
  }
  return 'none';
}

export function gradeOutcome(expected: ProbeExpected, actual: VerdictClass): ProbeGrade {
  if (expected === actual) return 'pass';
  if (actual === 'none') return 'no-verdict';
  return 'fail';
}
