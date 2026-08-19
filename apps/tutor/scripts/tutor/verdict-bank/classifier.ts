// apps/tutor/scripts/tutor/verdict-bank/classifier.ts
/**
 * Verdict-opener classifier for the probe bank. Scans the FIRST TWO
 * sentences of a tutor reply — the repo's verdict-hold machinery treats
 * the opener as the verdict site, and every live incident's verdict
 * appeared in sentence 1 or 2. The window is deliberately kept at TWO
 * (controller ruling, 2026-08-18 final review): widening it would let a
 * tutor that opens with two neutral sentences and denies something
 * unrelated in sentence three false-deny a probe. Deliberately
 * regex-only (no LLM): the bank measures the brain, so the grader must
 * be deterministic.
 */
import { DENIAL_RE } from '../../../src/lib/tutor/voice/simplification-verdict-check';

export type VerdictClass = 'affirm' | 'deny' | 'none';
export type ProbeExpected = VerdictClass;
export type ProbeGrade = 'pass' | 'fail' | 'no-verdict';

const AFFIRM_RE =
  /^\s*(?:right\b(?!\s+(?:idea|track|direction|approach|instinct)\b)|yes\b(?!\s+and\s+no\b)|yep\b|yeah[,!]?\s+(?:exactly|that)|exactly\b|correct\b(?!\s+me\b)|perfect\b|spot on\b|bingo\b|absolutely\b(?!\s+not\b)|bang on\b|beautiful\b|nice(?:\s+work|\s+catch|[.!,—-])|great\s+(?:work|job|catch|call)|good\s+(?:work|job|call|catch|instinct(?!\s*,?\s*but\b))|well done\b|(?:you(?:'ve)?\s+(?:got it|nailed it)|got it\s+in\s+one|nailed it)\b|that'?s\s+(?:right|correct|it|exactly))/i;

const EXTRA_DENY_RE =
  /^\s*(?:no\b(?!\s+(?:worries|problem|rush))|nope\b|hmm+,?\s+no\b(?!\s+(?:worries|problem|rush))|wrong\b|incorrect\b|that'?s\s+incorrect\b|actually\b|close\b|almost\b|careful\b|not\s+so\s+fast\b|hold\s+on\b|half\s+right\b|(?:absolutely|definitely|certainly)\s+not\b)/i;

/**
 * Explicit high-confidence "hedged denial" openers: a positive-sounding
 * lead-in ("right idea", "right track", "good instinct", "yes and no")
 * that is ALWAYS a denial when paired with an explicit contrast marker
 * ("but"/"wrong") in the same sentence. These are added as their own
 * deny detector — rather than relying on the generic contrast veto below
 * — because they're specific, known-bad phrasings from the final review,
 * not a guess about unseen phrasing.
 */
const CONTRASTIVE_DENY_RE =
  /^\s*(?:right\s+(?:idea|track)\b|good\s+instinct\b)[\s\S]*?\b(?:but|wrong)\b|^\s*yes\s+and\s+no\b/i;

/**
 * Generic safety net for an affirm-shaped opener that also carries an
 * explicit contrast marker we don't have a specific pattern for (e.g.
 * "Exactly right — but also note X"). Deliberately does NOT resolve to
 * 'deny' — that would create the mirror-image false-fail on a phrasing
 * that turns out to still be an affirm. It resolves to 'none' instead,
 * which degrades the hunt-report row to FLAKY and prompts a human to read
 * the quoted opener rather than asserting a verdict we can't back.
 *
 * KNOWN LIMITATION (out of scope, final review 2026-08-18): "Right, so
 * let's set up the distance formula first." is structurally
 * indistinguishable from a verified-good affirm opener ("Right. That's
 * exactly the line through the origin with slope 3.") — both are a bare
 * "Right" followed by more talk with no contrast marker. This regex
 * cannot and does not attempt to separate them; over-fitting one would
 * break the other.
 */
const CONTRAST_RE = /\b(?:but|however|though)\b/i;

// Split on sentence-ending punctuation followed by whitespace, OR by a
// capital letter with no whitespace at all — the latter alternative added
// 2026-08-18 after a real captured opener joined sentences with no space
// ("...slope 3.Nice instinct...", from bundle-turns.json of a smoke run).
// Without it, that run-on text would count as ONE sentence and the fixed
// 2-sentence window below would silently swallow whatever came after,
// which is exactly the failure mode the window is supposed to prevent —
// this split is what keeps the 2-sentence window honest against
// run-together model output, not a widening of the window itself.
function firstTwoSentences(text: string): string[] {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+|(?<=[.!?])(?=[A-Z])/)
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

// The probe starts all set `studentName: 'Probe Student'`, and the repo
// ships a vocative-comma prompt rule, so a name-first opener ("Probe
// Student, not quite — ...") is expected, not exotic. Strip a leading
// one- or two-word capitalized vocative followed by a comma or dash and
// retry against the remainder — same "only used when the raw sentence
// matched nothing" ordering as stripLeadingHedge.
function stripLeadingVocative(sentence: string): string | null {
  const m = sentence.match(/^\s*[A-Z][a-zA-Z']*(?:\s+[A-Z][a-zA-Z']*)?[,—–-]\s*(.*)$/);
  return m ? m[1] : null;
}

function classifySentence(s: string): VerdictClass | null {
  if (DENIAL_RE.test(s) || EXTRA_DENY_RE.test(s) || CONTRASTIVE_DENY_RE.test(s)) return 'deny';
  if (AFFIRM_RE.test(s)) return CONTRAST_RE.test(s) ? 'none' : 'affirm';
  return null;
}

export function classifyVerdictOpener(tutorText: string): VerdictClass {
  for (const s of firstTwoSentences(tutorText)) {
    const direct = classifySentence(s);
    if (direct !== null) return direct;

    const hedgeStripped = stripLeadingHedge(s);
    if (hedgeStripped !== null) {
      const result = classifySentence(hedgeStripped);
      if (result !== null) return result;
    }

    const vocativeStripped = stripLeadingVocative(s);
    if (vocativeStripped !== null) {
      const result = classifySentence(vocativeStripped);
      if (result !== null) return result;
    }
  }
  return 'none';
}

export function gradeOutcome(expected: ProbeExpected, actual: VerdictClass): ProbeGrade {
  if (expected === actual) return 'pass';
  if (actual === 'none') return 'no-verdict';
  return 'fail';
}
