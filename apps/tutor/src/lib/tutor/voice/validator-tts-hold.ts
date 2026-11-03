/**
 * Task 43 §F (voice run 21, embed-1793719782028, 441 / 624 / 874 / 1116 s):
 * the end-of-turn validators — transition ask off part, transition offer
 * missing, repeat ask third version, move-on ignored, required phrase missing
 * — killed turns whose first sentences had already played (judge_kill_snapshot
 * heard=1–5): the learner heard "Please…" / "You went with your…" / "By giving
 * everyone…" / "Summary…" cut off, then the retry.
 *
 * Every attempt already speaks through a TTS gate (sentences buffer until a
 * 1 s timer or the stream end opens it; a kill closes it and drops the buffer
 * pre-audio). On a validator-PRONE turn the gate stays closed until the
 * validators have passed — capped at VALIDATOR_TTS_HOLD_MS from the attempt
 * start, so the worst case is bounded latency, never silence. Prone: a voice
 * attempt 0 on a fixed-script plan that (a) carries an urgent runtime note
 * delivered this turn (offer / advance / entry / close — the transition and
 * required-phrase validators), (b) is the third try of a repeat ask
 * (repeat_ask_third_version), or (c) answers a move-on request
 * (move_on_ignored). Ordinary turns are untouched. Pure.
 */
export const VALIDATOR_TTS_HOLD_MS = 3500;

export function validatorTtsHold(input: {
  enabled: boolean;
  voice: boolean;
  attempt: number;
  fixedScript: boolean;
  /** an urgent fixed-script note (offer / advance / entry / close) was delivered with this turn */
  noteDelivered: boolean;
  /** attempts so far of the repeat ask in play for this part (0 = none) */
  repeatAttempts: number;
  /** the student's turn asks to move on */
  moveOnRequested: boolean;
}): boolean {
  if (!input.enabled || !input.voice || input.attempt !== 0 || !input.fixedScript) return false;
  return input.noteDelivered || input.repeatAttempts >= 2 || input.moveOnRequested;
}
