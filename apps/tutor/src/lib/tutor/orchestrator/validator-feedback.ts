// src/lib/tutor/orchestrator/validator-feedback.ts
/**
 * Builds the synthetic "user" message a validator retry sends to the brain.
 * Extracted from VoiceTutorRealtime.tsx's retry loop; the legacy body is
 * byte-identical to what that loop used to assemble inline.
 *
 * WHY THE STUDENT BLOCK: on a retry the brain's input is THIS message — the
 * server wraps it in <student_said> and logs it as
 * student="[validator feedback — not from the student] …". The student's real
 * words survive only one message further back in the history, behind the
 * brain's own rejected attempt. Live result: a retry triggered by a label
 * collision answered a student who had said "I don't know" with "Yes — that's
 * exactly the idea". The retry must still answer the student, so their
 * utterance now rides in the feedback message itself, with an explicit
 * statement that the feedback is not a reply from them.
 *
 * The message keeps its leading "[" — server-side guards (verdict guard,
 * answer-attempt detection) key on that to treat it as non-spoken input.
 */

export const VALIDATOR_FEEDBACK_PREFIX = '[validator feedback — not from the student]';

/** Synthetic rejection action for "the turn stopped early — continue it"
 *  (turn-shape.ts). Deliberately NOT prefixed `show_`: the give-up path treats
 *  `show_*` rejections as render failures and cancels the turn's speech. */
export const TURN_CONTINUATION_ACTION = 'turn_incomplete_continue';

export interface ValidatorRejection { action: string; reason: string }

const STUDENT_QUOTE_MAX = 600;
const MARKER_QUOTE_MAX = 200;

/**
 * The trailing note that puts the turn's original trigger in front of the
 * brain. '' when there was no trigger text at all.
 */
export function studentContextNote(originalTranscript: string): string {
  const t = (originalTranscript ?? '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (t.startsWith('[')) {
    // Runtime-triggered turn (kickoff, resume, button marker, board action).
    return (
      `\n\nFor reference: the turn you are redoing was triggered by a runtime event ` +
      `(${t.slice(0, MARKER_QUOTE_MAX)}), not by anything the student said aloud — ` +
      `do not respond as though the student has just spoken, answered, or agreed.`
    );
  }
  const capped = t.length > STUDENT_QUOTE_MAX ? `${t.slice(0, STUDENT_QUOTE_MAX)}…` : t;
  // Typographic quotes inside the span so the student's own quote marks
  // cannot close it early.
  const safe = capped.replace(/"/g, '”');
  return (
    `\n\nSTUDENT'S LAST WORDS — the turn you are redoing was your reply to exactly this: "${safe}". ` +
    `They are not new input (the student has said nothing since), and this feedback message is not ` +
    `agreement, an answer, or a request from the student. Your redone turn must still respond to those words.`
  );
}

function speechDeliveryNote(attemptKilled: boolean): string {
  return attemptKilled
    ? `Your spoken text from the prior attempt was CUT OFF by a kill bridge, so the student heard only a partial version. Re-deliver the spoken portion in full so they get a complete narration. If you asked a question, re-ask it and wait; do not answer it yourself or skip ahead. No new student input has occurred since your last attempt. Do NOT open with an affirmation or reference any student answer (real or imagined) — just re-deliver your prior teaching content with the required correction applied.`
    : `Your spoken text from the prior attempt was DELIVERED IN FULL to the student. Do NOT repeat the same narration — the student already heard it. In this turn, focus on emitting the corrected tool call(s) and speak only a brief connector (≤ one short sentence) if speech is needed at all. If you asked a question on the prior attempt and the student hasn't answered yet, just wait; do not re-ask.`;
}

export function buildValidatorFeedback(input: {
  rejections: ValidatorRejection[];
  /** True when the prior attempt's audio was cut by a kill. */
  attemptKilled: boolean;
  /** The transcript that triggered the turn (student words or a runtime marker). */
  originalTranscript: string;
  /** Kill switch (NEXT_PUBLIC_TUTOR_RETRY_STUDENT_CONTEXT !== 'off'). */
  includeStudentContext: boolean;
}): string {
  const { rejections, attemptKilled } = input;
  const context = input.includeStudentContext ? studentContextNote(input.originalTranscript) : '';

  // Pure continuation: nothing was rejected, the turn just stopped early and
  // everything it said was heard. Different job from a tool-call correction —
  // carry on, don't redo.
  const continuationOnly =
    !attemptKilled && rejections.length > 0 && rejections.every((r) => r.action === TURN_CONTINUATION_ACTION);
  if (continuationOnly) {
    return (
      `${VALIDATOR_FEEDBACK_PREFIX} Your last turn stopped too early: ${rejections[0].reason} ` +
      `Everything you said was DELIVERED IN FULL — do not repeat, rephrase, or re-announce any of it, and do not greet again. ` +
      `Continue the SAME turn now, without waiting for the student: put the first thing you are teaching on the board with a ` +
      `whiteboard tool call, teach it in a few sentences, and end by handing the floor to the student with one question. ` +
      `Don't apologize; the student doesn't see this message.` +
      context
    );
  }

  const summarizedRejections = rejections
    .map((r, i) => `[${i + 1}] ${r.action}: ${r.reason}`)
    .join('\n');
  return (
    `${VALIDATOR_FEEDBACK_PREFIX} Your last turn emitted ` +
    `tool call(s) that the runtime structural validator rejected:\n${summarizedRejections}\n` +
    `Re-emit the corrected tool call(s). Don't apologize; the student doesn't see this message. ` +
    speechDeliveryNote(attemptKilled) +
    context
  );
}
