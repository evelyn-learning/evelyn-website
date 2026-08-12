/**
 * Q-pin collapse/drag behavior — pure helpers, unit-tested by
 * scripts/test-qpin-behavior.ts. Spec:
 * docs/superpowers/specs/2026-07-23-qpin-collapse-drag-design.md
 */

/** Pointer must move MORE than this (px, euclidean) before a press counts as a drag. */
export const QPIN_DRAG_THRESHOLD_PX = 5;
/** Collapse this long after the tutor finishes speaking the ask. */
export const QPIN_POST_SPEECH_MS = 6000;
/** Collapse no later than this after the pin appears (covers a missing TTS-end signal). */
export const QPIN_HARD_CAP_MS = 15000;

// Reserved bands inside the stage (px) the dragged pin may not enter: the
// floating header (top) and the floating caption+dock bar (bottom), plus a
// small side gutter. The stage rect already includes iOS safe-area insets
// (the stage root is `fixed inset-0`).
export const QPIN_TOP_MIN_PX = 60;
export const QPIN_BOTTOM_RESERVED_PX = 96;
export const QPIN_SIDE_PX = 8;

/** Pin top-left corner as fractions of the stage size — survives resizes/rotation. */
export interface QpinFraction {
  x: number;
  y: number;
}

export function exceedsDragThreshold(dx: number, dy: number): boolean {
  return Math.hypot(dx, dy) > QPIN_DRAG_THRESHOLD_PX;
}

/**
 * Absolute epoch-ms deadline for auto-collapse. speechEndedAt is null while
 * the tutor is still speaking (or the signal never arrived) — then only the
 * hard cap applies. The cap also bounds a very late speech-end.
 */
export function qpinCollapseDeadline(shownAt: number, speechEndedAt: number | null): number {
  const cap = shownAt + QPIN_HARD_CAP_MS;
  if (speechEndedAt === null) return cap;
  return Math.min(speechEndedAt + QPIN_POST_SPEECH_MS, cap);
}

/** R38: the pin's owning turn no longer needs to be the LATEST tutor turn —
 *  an idle-nudge line or a board-only (historyOnly) turn must not kill an
 *  unanswered question. The pin dies only by ✕ dismiss or replacement
 *  (the gist effect sets a NEW pin when a newer turn asks a question). */
export function latestSubstantiveTutorEntry<T extends { role: string; historyOnly?: boolean }>(
  transcript: T[],
): T | undefined {
  return [...transcript].reverse().find((t) => t.role === 'tutor' && !t.historyOnly);
}

/** R47 Task 3c: a pinned question is scoped to the problem/segment it was
 *  asked in. R38's persist-until-replaced semantics deliberately keep a pin
 *  alive across non-question tutor turns WITHIN that segment (idle nudge,
 *  board-only) — but nothing previously bounded it across a SEGMENT
 *  advance, so a question pinned against an earlier problem could still be
 *  showing several turns later at, e.g., the Recap segment (live: session
 *  portal-1349716e, ~22:37 — "Ready for one with a billionaire in the mix?"
 *  stuck at Recap). The lesson cursor's segment id (`activeSegmentId` /
 *  `lessonProgress.currentSegmentId` — the same signal the rail uses) is
 *  the obsoleting event: once it changes, the pin's problem context is
 *  gone and it must clear, regardless of whether a new question has
 *  arrived yet.
 *
 *  Design call: clear on ANY segment-id change, including a `to:'free'`
 *  cursor release (segId → '') and a later resume back into the plan
 *  ('' → segId). A pin surviving into free-conversation is exactly as
 *  stale as one surviving into Recap — its problem is off the board
 *  either way — so there is no case where keeping it "because the
 *  conversation might still be relevant" beats the student re-asking if
 *  they actually want it back. Two equal, non-empty ids (no advance) or
 *  two equal empty ids (never entered a plan) are NOT a change. */
export function shouldClearQpinOnSegmentChange(prevSegmentId: string, nextSegmentId: string): boolean {
  return prevSegmentId !== nextSegmentId;
}

export function clampQpinFraction(
  pos: QpinFraction,
  stage: { width: number; height: number },
  pin: { width: number; height: number },
): QpinFraction {
  const minX = QPIN_SIDE_PX;
  const maxX = Math.max(minX, stage.width - pin.width - QPIN_SIDE_PX);
  const minY = QPIN_TOP_MIN_PX;
  const maxY = Math.max(minY, stage.height - pin.height - QPIN_BOTTOM_RESERVED_PX);
  const px = Math.min(Math.max(pos.x * stage.width, minX), maxX);
  const py = Math.min(Math.max(pos.y * stage.height, minY), maxY);
  return { x: px / stage.width, y: py / stage.height };
}
