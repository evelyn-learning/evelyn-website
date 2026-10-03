/**
 * Rule-based `wrong` ledger events from answer attempts.
 *
 * 2026-10-02 (live portal-bf533c4b): six wrong or confused answers to
 * "2x + y = 7, x − y = 2" produced ONE pacing-credit decision, and the
 * advisory judge withheld it (wrongly: 2·2+3=7 but 2−3≠2). The pacing path
 * was the ONLY producer of ledger `wrong` events, so the gap was recorded
 * with STUCK_CUE alone and the partner feed's `repeated_difficulty` flag —
 * which needs INCORRECT_STREAK_2_PLUS / NO_RECOVERY — never fired.
 *
 * This module is the ledger-only fallback: a plausible answer from the
 * student, met by a tutor correction, is a `wrong` event — unless a
 * deterministic objective-correct proof says otherwise. The advisory LLM
 * judge is deliberately NOT a gate here: it only withholds PACING credit.
 *
 * Pure; never throws.
 */
import { isLedgerStuckCue } from '@/lib/tutor/orchestrator/struggle-ledger';
import { readPacingVerdict } from '@/lib/tutor/voice/pacing-verdict';

/** Requests for help / another example: never an answer. */
const HELP_REQUEST_RE =
  /\b(give me|another (one|example)|explain|example|help|what do you mean|how do (i|you)|can you|could you)\b/i;

/** Math-bearing shapes: a digit, `=`, or an operator/sign standing as a token
 *  (`- 3`, `+x`, `x ^ 2`), so a hyphenated word ("well-known") never counts. */
const MATH_SHAPE_RE = /\d|=|(?:^|\s)[+\-−×÷*/^](?=\s|[a-z0-9(]|$)/i;

const SHORT_ANSWER_MAX_WORDS = 8;

/**
 * Correction openers `readPacingVerdict` does not read (its CORRECTION_RE
 * wants "close but" with no comma and has no "not exactly"). Anchored to the
 * turn's opening so ordinary prose later in the turn never matches — the
 * whole-turn "almost" false positive (R53) is exactly what this avoids.
 * Local to this ledger fallback on purpose: widening CORRECTION_RE would also
 * move pacing credit, which this change must not touch.
 */
const LEDGER_CORRECTION_OPENER_RE =
  /^[*_~`\s]*(?:(?:hmm+|ah|oh|ok(?:ay)?)[,.!—–\-\s]+)?(?:close,?\s+but\b|not\s+(?:exactly|quite)\b)/i;

/** Is this student utterance a plausible ANSWER (not a cue, not a request)? */
export function isAnswerAttempt(studentText: string): boolean {
  const t = (studentText || '').trim();
  if (!t) return false;
  // Synthetic turns ("[validator feedback …]", "[start lesson]") are never
  // the student's answer.
  if (t.startsWith('[')) return false;
  if (isLedgerStuckCue(t)) return false;
  if (HELP_REQUEST_RE.test(t)) return false;
  // A trailing "?" does not disqualify: "is it 4?" is an answer.
  if (MATH_SHAPE_RE.test(t)) return true;
  return t.split(/\s+/).filter(Boolean).length <= SHORT_ANSWER_MAX_WORDS;
}

/** Should this turn feed a ledger `wrong` event? */
export function inferWrongEvent(input: {
  studentText: string;
  tutorText: string;
  objectiveCorrect: boolean;
}): boolean {
  if (input.objectiveCorrect) return false;
  if (!isAnswerAttempt(input.studentText)) return false;
  const verdict = readPacingVerdict(input.tutorText);
  if (verdict.isCorrection) return true;
  return !verdict.isAffirm && LEDGER_CORRECTION_OPENER_RE.test(input.tutorText || '');
}
