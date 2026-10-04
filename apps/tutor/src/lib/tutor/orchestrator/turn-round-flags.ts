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
