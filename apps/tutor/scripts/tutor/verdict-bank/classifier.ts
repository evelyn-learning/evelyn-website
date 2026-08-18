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

const EXTRA_DENY_RE = /^\s*(?:no\b(?!\s+(?:worries|problem|rush))|nope\b|hmm+,?\s+no\b(?!\s+(?:worries|problem|rush))|wrong\b|incorrect\b)/i;

function firstTwoSentences(text: string): string[] {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2);
}

// The tutor often opens with a hedge — "Hmm —", "Well —", "Oh —" — joined to
// the actual verdict by an em/en-dash rather than plain whitespace.
// DENIAL_RE is production guard code (simplification-verdict-check.ts) and
// cannot be widened from here, so instead we strip a leading hedge + dash
// run and retry the same regexes against the remainder.
function stripLeadingHedge(sentence: string): string | null {
  const m = sentence.match(/^\s*(?:hmm+|well|ok|okay|oh|alright|so)\b[,—–\-\s]+(.*)$/i);
  return m ? m[1] : null;
}

export function classifyVerdictOpener(tutorText: string): VerdictClass {
  for (const s of firstTwoSentences(tutorText)) {
    if (DENIAL_RE.test(s) || EXTRA_DENY_RE.test(s)) return 'deny';
    if (AFFIRM_RE.test(s)) return 'affirm';
    const stripped = stripLeadingHedge(s);
    if (stripped !== null) {
      if (DENIAL_RE.test(stripped) || EXTRA_DENY_RE.test(stripped)) return 'deny';
      if (AFFIRM_RE.test(stripped)) return 'affirm';
    }
  }
  return 'none';
}

export function gradeOutcome(expected: ProbeExpected, actual: VerdictClass): ProbeGrade {
  if (expected === actual) return 'pass';
  if (actual === 'none') return 'no-verdict';
  return 'fail';
}
