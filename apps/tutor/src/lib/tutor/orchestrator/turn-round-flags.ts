// src/lib/tutor/orchestrator/turn-round-flags.ts
/**
 * Kill switches for the "a rejected call / a thin opener must not cost the
 * turn" round. Every one defaults ON (`!== 'off'`); setting the env var to
 * 'off' restores the exact pre-round behaviour for that one mechanism.
 * NEXT_PUBLIC_ values are inlined at build time.
 */

/** Resume ("Continue lesson") opens the production mic the way the Start tap
 *  does, so resumed sessions record the student track. */
export const TUTOR_RESUME_START_LISTENING =
  process.env.NEXT_PUBLIC_TUTOR_RESUME_START_LISTENING !== 'off';

/** show_equation whose label collides with a different equation still on the
 *  same page is painted with a unique label instead of being rejected. */
export const TUTOR_LABEL_DUP_RELABEL =
  process.env.NEXT_PUBLIC_TUTOR_LABEL_DUP_RELABEL !== 'off';

/** tutor_scroll_whiteboard with an unresolvable / empty target is dropped
 *  (one call) instead of rejected (whole-turn retry). */
export const TUTOR_SCROLL_MISS_SOFT_DROP =
  process.env.NEXT_PUBLIC_TUTOR_SCROLL_MISS_SOFT_DROP !== 'off';

/** A show_problem the RUNTIME rewrote to show_segment_card, which then
 *  dedups against the same problem already on the board, is a no-op instead
 *  of a rejection. */
export const TUTOR_SUBSTITUTED_DUP_SILENT =
  process.env.NEXT_PUBLIC_TUTOR_SUBSTITUTED_DUP_SILENT !== 'off';

/** Validator-feedback retries carry the student's original utterance. */
export const TUTOR_RETRY_STUDENT_CONTEXT =
  process.env.NEXT_PUBLIC_TUTOR_RETRY_STUDENT_CONTEXT !== 'off';

/** An opening turn that announces and stops is auto-continued once. */
export const TUTOR_TURN_CONTINUATION =
  process.env.NEXT_PUBLIC_TUTOR_TURN_CONTINUATION !== 'off';

/** The full opening directive rides only until the opener has been spoken;
 *  later opening-phase turns get the slim follow-up directive. */
export const TUTOR_OPENING_DIRECTIVE_ONCE =
  process.env.NEXT_PUBLIC_TUTOR_OPENING_DIRECTIVE_ONCE !== 'off';

/** First render of a turn paints immediately while the board holds nothing
 *  but the opener fallback line. */
export const TUTOR_FALLBACK_BOARD_PAINT_NOW =
  process.env.NEXT_PUBLIC_TUTOR_FALLBACK_BOARD_PAINT_NOW !== 'off';

/** A brain show_problem is rewritten to the authored show_segment_card only
 *  when it poses the SAME problem; a different problem is painted as the
 *  brain's own card, and a same problem already on the board is a no-op.
 *  Also gates the two companions (auto card after an own problem; silent
 *  dedup drops of a substituted different problem). */
export const TUTOR_SUBSTITUTE_SAME_ONLY =
  process.env.NEXT_PUBLIC_TUTOR_SUBSTITUTE_SAME_ONLY !== 'off';

/** TELEMETRY: exact one-variable relation checks on boarded show_equation
 *  steps and on improvised-answer disputes. The one behavioural effect: an
 *  "agreeing" claimed answer whose solution set differs from the problem's is
 *  not pinned as the verified expected answer. */
export const TUTOR_RELATION_STEP_CHECK =
  process.env.NEXT_PUBLIC_TUTOR_RELATION_STEP_CHECK !== 'off';

/** A typed FIRST message in a voice session counts as the session start for
 *  the mic control: hasStarted latches at the submit, the composer's blur
 *  opens the mic, and the next mic tap opens the mic instead of sending a
 *  second [start lesson]. */
export const TUTOR_TYPED_FIRST_START =
  process.env.NEXT_PUBLIC_TUTOR_TYPED_FIRST_START !== 'off';

/** The idle-nudge stretch/timer is reset only by a DISPATCHED student turn
 *  (or typed input); a bare speech onset defers a due nudge by a short grace
 *  bounded by a hard ceiling, and every postponement is logged. */
export const TUTOR_IDLE_NUDGE_DISPATCH_RESET =
  process.env.NEXT_PUBLIC_TUTOR_IDLE_NUDGE_DISPATCH_RESET !== 'off';

/** A tutor sentence whose numeric streak/tally praise ("five for five",
 *  "nine in a row") disagrees with the tracked streak is dropped from speech
 *  and transcript (advisory-only when the sentence carries a question, a
 *  verdict or other content). */
export const TUTOR_STREAK_CLAIM_GUARD =
  process.env.NEXT_PUBLIC_TUTOR_STREAK_CLAIM_GUARD !== 'off';

/** Single common words in the boredom-cue list ("next", "easy", "skip",
 *  "faster"…) count only in a request shape addressed to the tutor, not
 *  wherever they appear in a sentence. */
export const TUTOR_BOREDOM_CUE_REQUEST_SHAPE =
  process.env.NEXT_PUBLIC_TUTOR_BOREDOM_CUE_REQUEST_SHAPE !== 'off';

/** A counted relation-step disagreement in the `chain` / `vs-problem` tier
 *  plants a witness correction note for the brain's NEXT turn (never a block
 *  or a retry). Needs TUTOR_RELATION_STEP_CHECK; off ⇒ telemetry only. */
export const TUTOR_RELATION_STEP_NOTE =
  process.env.NEXT_PUBLIC_TUTOR_RELATION_STEP_NOTE !== 'off';

/** The LLM judge does not replace a DETERMINISTIC correction note that is
 *  still pending in the shared slot (the relation-step witness note, or an
 *  answer-dispute note decided by exact substitution). Off ⇒ the judge
 *  assigns the slot unconditionally, as before. */
export const TUTOR_JUDGE_NOTE_KEEP_DETERMINISTIC =
  process.env.NEXT_PUBLIC_TUTOR_JUDGE_NOTE_KEEP_DETERMINISTIC !== 'off';

/** A solver-vs-brain answer dispute is broken by exact substitution: the
 *  answer with the problem's solution set is pinned as the verified key and
 *  the mismatch note says so. Needs TUTOR_RELATION_STEP_CHECK; off ⇒ nothing
 *  pinned and the "neither value is confirmed" note, as before. */
export const TUTOR_ANSWER_DISPUTE_TIEBREAK =
  process.env.NEXT_PUBLIC_TUTOR_ANSWER_DISPUTE_TIEBREAK !== 'off';
