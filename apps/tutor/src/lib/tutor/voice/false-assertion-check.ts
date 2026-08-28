/**
 * Deterministic detector for the tutor asserting a WRONG FINAL VALUE for
 * the active problem's answer variable (R58, live session portal-71d11dac):
 * the brain spoke "Right. Dividing both sides by 3 gives $x = 11$." — and
 * then "Right, $x = 11$ checks out" a turn later — when the answer to the
 * card on the board ((3x+7)/2 = 10) is 13/3. The judge flagged both turns
 * as kill-severity, but the judge is advisory-only by design (Pillar 2b),
 * so the student kept the wrong value twice. This module is the
 * deterministic (non-LLM) member of the verdict-detector family for that
 * shape — deterministic detectors still kill under Pillar 2b.
 *
 * Deliberately narrow, because the symmetric-looking "student said a value
 * that differs from the verified answer and the tutor praised it" check is
 * NOT safe: students answer praised INTERMEDIATE sub-questions constantly
 * ("what's 20 − 7?" → "13" ≠ final 13/3), so comparing the STUDENT's
 * utterance against the final answer would kill correct praise. Instead
 * this compares the TUTOR'S OWN spoken assertion of the final variable —
 * "<answerVar> = <value>" — against the verified expected answer:
 *
 *  - Only fires when the caller supplies a VERIFIED expected answer (same
 *    trust tier as inverse-verdict-check's kill tier — pipeline-verified,
 *    plan-authored, or blind-solve-agreed). Unverified claims never kill.
 *  - Only fires when the problem statement names its answer variable
 *    ("What is x?", "solve for t", "find y") — without that anchor, a
 *    spoken "n = 4" may be any intermediate quantity.
 *  - Only fires on an ASSERTED equality for exactly that variable, in a
 *    sentence with no hypothetical framing ("if", "suppose", "what if",
 *    "imagine", "were", "would") — a counterfactual walkthrough of a wrong
 *    value is legitimate teaching.
 *  - The comparison reuses matchUtteranceToAnswer and fires ONLY on a
 *    full-parse 'disagree' — 'agree' and 'unknown' are always ok, so an
 *    unparseable or equivalent-notation value can never kill.
 *
 * Pure module — no side effects, never throws.
 */
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';

export interface FalseAssertionResult {
  verdict: 'ok' | 'false_assertion';
  asserted?: string;
  expected?: string;
  answerVar?: string;
  matchReason?: string;
}

const OK: FalseAssertionResult = { verdict: 'ok' };

/** "What is x?" / "find t" / "solve for y" / "What is the value of x?" —
 *  the variable the problem's final answer binds. Single letter, optional
 *  primes. */
const ANSWER_VAR_RE =
  /\b(?:what\s+is(?:\s+the\s+value\s+of)?|find(?:\s+the\s+value\s+of)?|solve\s+for|determine)\s+\$?([a-zA-Z])('*)\$?\s*[?.,]?/i;

/** Hypothetical / counterfactual framing anywhere in the sentence ⇒ skip. */
const HYPOTHETICAL_RE = /\b(?:if|suppose|imagine|what if|say|were|would|had)\b/i;

export function extractAnswerVariable(problemStatement: string): string | null {
  const m = (problemStatement ?? '').match(ANSWER_VAR_RE);
  return m ? m[1] + (m[2] || '') : null;
}

export function checkFalseFinalAssertion(args: {
  /** One streamed sentence of the tutor's turn. */
  sentence: string;
  /** The live problem's statement (currentProblemRef.statement). */
  problemStatement?: string;
  /** VERIFIED tier only — see the header. */
  verifiedExpectedAnswer?: string;
  /** R49 currency reconciliation, mirrored from inverse-verdict-check. */
  spokenMoneyEnabled?: boolean;
}): FalseAssertionResult {
  const verified = (args.verifiedExpectedAnswer ?? '').trim();
  if (!verified) return OK;
  const answerVar = extractAnswerVariable(args.problemStatement ?? '');
  if (!answerVar) return OK;
  const sentence = args.sentence ?? '';
  if (!sentence || HYPOTHETICAL_RE.test(sentence)) return OK;

  // Asserted equality for exactly the answer variable. The value capture is
  // compact — a signed number, decimal, plain fraction, or a \frac{}{}:
  // anything longer (an expression continuing with + / −) is a WORKING
  // step, not a final value, and must not be judged. (answerVar is a
  // letter plus optional primes — no regex-special characters to escape.)
  const esc = answerVar;
  const assertRe = new RegExp(
    `(?:^|[^a-zA-Z])\\$?${esc}\\$?\\s*(?:=|equals)\\s*\\$?` +
    `(-?\\d+(?:\\.\\d+)?(?:\\s*/\\s*-?\\d+(?:\\.\\d+)?)?|\\\\d?frac\\{-?\\d+\\}\\{-?\\d+\\})` +
    // No trailing digit/fraction continuation, and no arithmetic operator
    // after the value (with the whitespace INSIDE the lookahead — a `\s*`
    // before a negative lookahead backtracks to zero-width and defeats it).
    `\\$?(?![\\d./])(?!\\s*(?:[+*×·]|-\\s|\\\\cdot|\\\\times))`,
  );
  const m = sentence.match(assertRe);
  if (!m) return OK;
  const asserted = m[1].replace(/\\d?frac\{(-?\d+)\}\{(-?\d+)\}/, '$1/$2').replace(/\s+/g, '');

  const cmp = matchUtteranceToAnswer(asserted, verified, undefined, {
    monetary: args.spokenMoneyEnabled === true,
  });
  if (cmp.verdict === 'disagree') {
    return { verdict: 'false_assertion', asserted, expected: verified, answerVar, matchReason: cmp.reason };
  }
  return OK;
}
