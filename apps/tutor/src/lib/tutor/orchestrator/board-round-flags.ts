/**
 * Flags for the board / graph / flow round of 2026-10-06 (two live sessions
 * run by the product owner: portal-897212b5 voice, portal-347539a7 text).
 *
 * All default ON (`!== 'off'`), all NEXT_PUBLIC so the browser orchestrator
 * (VoiceTutorRealtime) and the renderers read the same value. Kept in their
 * own file so they do not collide with flags.ts edits from other rounds.
 */

/** show_function_graph `inequalities` + per-function `lineStyle`: parsed,
 *  validated and drawn natively by Desmos. Off ⇒ the fields are ignored by
 *  the gate (the renderer still draws whatever reaches it). */
export const TUTOR_GRAPH_INEQUALITIES =
  process.env.NEXT_PUBLIC_TUTOR_GRAPH_INEQUALITIES !== 'off';

/** Deterministic region check: a graph that shades a region (inequalities or
 *  shadedRegion) is sampled against the active problem's inequalities; a
 *  mismatch is soft-rejected once, then repaired from the problem. Never
 *  blocks when the problem's relations cannot be read. */
export const TUTOR_GRAPH_REGION_CHECK =
  process.env.NEXT_PUBLIC_TUTOR_GRAPH_REGION_CHECK !== 'off';

/** A scribble never switches the board to another page on its own: it is
 *  retargeted to the figure painted this turn / the page in view, or dropped
 *  with a next-turn advisory. Also drops a repeat mark (same feature, same
 *  shape) whatever its label. */
export const TUTOR_SCRIBBLE_STAY_ON_PAGE =
  process.env.NEXT_PUBLIC_TUTOR_SCRIBBLE_STAY_ON_PAGE !== 'off';

/** An attempt killed for a verdict / assent reason takes its board renders
 *  with it (they state the conclusion the kill withheld), unless the retry
 *  re-emits them. Narrows TUTOR_KEEP_VALIDATED_ON_KILL. */
export const TUTOR_KILL_DISCARDS_ANSWER_RENDERS =
  process.env.NEXT_PUBLIC_TUTOR_KILL_DISCARDS_ANSWER_RENDERS !== 'off';

/** Homework-help plans: advance_lesson past the homework segment does not
 *  complete it unless the brain marked it complete or the student asked to
 *  move on; returning from a recap detour resumes the homework segment. */
export const TUTOR_HOMEWORK_ADVANCE_GUARD =
  process.env.NEXT_PUBLIC_TUTOR_HOMEWORK_ADVANCE_GUARD !== 'off';

/** Text transcript: only a real gesture (wheel / touch / key / scrollbar
 *  drag) can latch "the student scrolled up"; the scroller's own resizes are
 *  followed. */
export const TUTOR_TRANSCRIPT_GESTURE_LATCH =
  process.env.NEXT_PUBLIC_TUTOR_TRANSCRIPT_GESTURE_LATCH !== 'off';
