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

export const RETRY_PREAMBLE = 'The student never heard your previous attempt. Speak as if for the first time: never say "this time", "again", "let me try that again", "let me get this right" or anything else that refers to a redo.';

/** Prefix every retry instruction with RETRY_PREAMBLE (idempotent). */
export function withRetryPreamble(instruction: string): string {
  if (instruction.includes(RETRY_PREAMBLE)) return instruction;
  if (instruction.startsWith(VALIDATOR_FEEDBACK_PREFIX)) {
    const rest = instruction.slice(VALIDATOR_FEEDBACK_PREFIX.length).replace(/^\s+/, '');
    return `${VALIDATOR_FEEDBACK_PREFIX} ${RETRY_PREAMBLE} ${rest}`;
  }
  return `${RETRY_PREAMBLE} ${instruction}`;
}
