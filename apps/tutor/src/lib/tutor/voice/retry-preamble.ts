/**
 * GDI trial live run 1 (2026-10-29): a validator retry of a rejected opener
 * leaked the redo into speech ("Let's get the overview right this time").
 * Every retry instruction that redoes killed speech opens with this preamble.
 *
 * The retry message keeps its leading "[validator feedback — not from the
 * student]" marker: server-side guards (verdict guard, answer-attempt
 * detection) key on the leading "[" to treat it as non-spoken input. So the
 * preamble goes directly AFTER that marker; an instruction without the
 * marker is simply prefixed.
 */
import { VALIDATOR_FEEDBACK_PREFIX } from '../orchestrator/validator-feedback';

export const RETRY_PREAMBLE = 'Deliver this as a fresh turn: never say "this time", "again", "let me try that again", "let me get this right" or anything else that refers to a redo.';

/** Prefix every retry instruction with RETRY_PREAMBLE (idempotent). */
export function withRetryPreamble(instruction: string): string {
  if (instruction.includes(RETRY_PREAMBLE)) return instruction;
  if (instruction.startsWith(VALIDATOR_FEEDBACK_PREFIX)) {
    const rest = instruction.slice(VALIDATOR_FEEDBACK_PREFIX.length).replace(/^\s+/, '');
    return `${VALIDATOR_FEEDBACK_PREFIX} ${RETRY_PREAMBLE} ${rest}`;
  }
  return `${RETRY_PREAMBLE} ${instruction}`;
}

/**
 * Task 30 §D2 (GDI run 17, 746 s / 1112 s): a validator fired after the
 * student had heard sentences of the attempt, and the retry said them again
 * ("Okay, let's keep going. You said "I met the suppliers from China," and
 * that's correct…"). Every retry of an attempt with heard sentences is told
 * what was heard. null when nothing was heard.
 */
export function heardSentencesNote(heard: readonly string[]): string | null {
  const said = heard.map((s) => (s ?? '').trim()).filter(Boolean);
  if (said.length === 0) return null;
  return `[runtime note — not from the student] The student has already heard you say: "${said.join(' ')}". Do not say them again or restate them; continue from there and never open with a filler such as "Okay" or "Let's keep going". Apply this silently; never mention this note.]`;
}
