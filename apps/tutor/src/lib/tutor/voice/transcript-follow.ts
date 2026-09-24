/**
 * Pure decision helper for TranscriptView's follow-to-bottom scroll effect.
 *
 * Two independent modes coexist in TranscriptView's scroll effect:
 *  - Text mode (`stickToBottom: true`): standard chat semantics — the
 *    student's own message always snaps to bottom (TranscriptView clears
 *    the "scrolled up" latch separately when that happens); a tutor/system
 *    entry follows too, unless the student deliberately scrolled away.
 *  - Voice mode (`stickToBottom: false`): the older near-bottom-only rule —
 *    follow only when the scroller is already within the 120px threshold
 *    of its bottom, regardless of who spoke last.
 *
 * Extracted (GreenApple round 6, task 4) so scripts/test-transcript-scroll.ts
 * can assert the truth table without a DOM, and so the KaTeX-fonts-late-
 * layout fix — TranscriptView re-checking after `document.fonts.ready` and
 * on a `ResizeObserver` firing — re-applies this EXACT rule instead of a
 * hand-rolled duplicate that could drift from the effect's own logic.
 *
 * Live symptom this exists for: a math-bearing tutor reply lands, the
 * effect scrolls to `scrollHeight` (correct at that instant), but the
 * bubble's KaTeX span (rendered via a synchronous `katex.render()` with no
 * font-load handling — see InlineMathText.tsx's `Math` component) grows
 * once the KaTeX web fonts swap in, and the panel is left short of the
 * bottom with no further event to re-trigger the scroll.
 */

export interface ShouldFollowToBottomInput {
  /** Text mode vs. voice mode — see module doc. */
  stickToBottom: boolean;
  /** Whether the student has deliberately scrolled away from the bottom
   *  (tracked via wheel/touch/scroll listeners in TranscriptView; only
   *  meaningful in text mode — voice mode never sets this). */
  userScrolledUp: boolean;
  /** Role of the most recent transcript entry, if any. Only meaningful in
   *  text mode. */
  lastRole?: 'student' | 'tutor' | 'system' | string | null;
  /** Voice mode's near-bottom gate: true when the scroller is within the
   *  120px threshold of its bottom. Ignored in text mode (text mode has
   *  its own, more permissive "follow unless scrolled away" rule — see
   *  the diagnosis in TranscriptView.tsx for why the near-bottom gate
   *  doesn't work for un-streamed full-paragraph text replies). */
  nearBottom: boolean;
}

/** True when the transcript scroller should be snapped to `scrollHeight`
 *  right now, under the input's mode. Pure — no DOM access. */
export function shouldFollowToBottom({
  stickToBottom,
  userScrolledUp,
  lastRole,
  nearBottom,
}: ShouldFollowToBottomInput): boolean {
  if (stickToBottom) {
    return lastRole === 'student' || !userScrolledUp;
  }
  return nearBottom;
}

export interface RefollowDecisionInput {
  /** Text mode vs. voice mode — see module doc. */
  stickToBottom: boolean;
  /** The "scrolled up" latch read LIVE, at the moment the re-check fires
   *  (fonts.ready resolving, or a ResizeObserver callback) — NOT a value
   *  captured back when the effect first ran. A student can scroll away
   *  in the gap between the initial scroll and fonts/layout settling;
   *  re-checking against a frozen decision would yank them back down
   *  anyway. */
  userScrolledUpNow: boolean;
  /** Role of the most recent transcript entry, captured once when the
   *  effect ran (it can't change again before the effect re-runs). */
  lastRole?: 'student' | 'tutor' | 'system' | string | null;
  /** Present for signature symmetry with `shouldFollowToBottom` /
   *  possible future voice-mode re-checks; currently unused because
   *  `stickToBottom: false` short-circuits to `false` before it's read
   *  (voice mode never re-follows after the fact — see module doc). */
  nearBottomNow: boolean;
}

/** Round 6 task 4, fix round 1: the fonts.ready / ResizeObserver re-check
 *  decision, evaluated fresh each time it fires (never against a frozen
 *  `shouldFollowToBottom` result from when the effect first ran).
 *
 * Text mode only. Voice mode's near-bottom-only rule already re-runs on
 * every real scroll/wheel/touch event AND every `transcript`/`picker`
 * effect re-run — it never needed a fonts/layout re-check, and BEFORE
 * commit 97e933bc it had none. `stickToBottom: false` here always
 * returns `false` so voice mode's behavior stays byte-identical whether
 * or not TranscriptView happens to call this from a voice-mode instance. */
export function refollowDecision({
  stickToBottom,
  userScrolledUpNow,
  lastRole,
  nearBottomNow,
}: RefollowDecisionInput): boolean {
  if (!stickToBottom) return false;
  return shouldFollowToBottom({
    stickToBottom: true,
    userScrolledUp: userScrolledUpNow,
    lastRole,
    nearBottom: nearBottomNow,
  });
}
