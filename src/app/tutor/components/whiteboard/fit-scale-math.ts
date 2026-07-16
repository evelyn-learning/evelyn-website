/**
 * Pure ratio math for `useFitScale` (task W1 — per-card scale-to-fit for
 * wide whiteboard content). Extracted out of the ResizeObserver wiring in
 * `useFitScale.ts` so it's unit-testable without a DOM (same script-test
 * pattern as `replay-board-fit.ts` / `scripts/test-replay-board-fit.ts`).
 *
 * Unlike `computeReplayBoardFit` (which caps at 1 and never floors — the
 * whole-board scaler just shrinks to whatever fits, however small), this
 * math has a `floor`: a comparison table or t_chart shrunk past ~60% of its
 * natural size becomes illegible, so below `floor` we stop shrinking and
 * instead report `overflowing: true` so the caller can render the content
 * at `floor` inside a scrollable wrapper — reachable, never silently
 * clipped by an ancestor's `overflow-x-hidden`.
 */

export interface FitScaleInput {
  /** The available width, in px (e.g. a `w-full` wrapper's `clientWidth`).
   *  0/negative/NaN before first measurement. */
  containerWidth: number;
  /** The content's natural (pre-transform) width, in px — `scrollWidth`,
   *  so real overflow is honestly reflected rather than assumed away.
   *  0/negative/NaN before first measurement. */
  contentWidth: number;
  /** Minimum scale factor, in (0, 1]. */
  floor: number;
}

export interface FitScaleResult {
  /** Scale factor for `transform: scale(scale)`. Always in (0, 1] —
   *  capped at 1 so content narrower than its container is never
   *  upscaled. */
  scale: number;
  /** True when `floor` had to clamp the fit — content is rendered at
   *  `floor` but is STILL wider than the container. Callers should make
   *  the container horizontally scrollable in this case. */
  overflowing: boolean;
}

/** Pure scale/overflow math for the W1 fit-to-width wrapper. Never divides
 *  by zero and never produces NaN/Infinity: any not-yet-measured dimension
 *  (0, negative, or NaN) falls back to `{ scale: 1, overflowing: false }` —
 *  render at natural size, nothing worse than pre-W1 behavior. */
export function computeFitScale({ containerWidth, contentWidth, floor }: FitScaleInput): FitScaleResult {
  if (!(containerWidth > 0) || !(contentWidth > 0)) {
    return { scale: 1, overflowing: false };
  }
  if (contentWidth <= containerWidth) {
    return { scale: 1, overflowing: false };
  }
  const natural = containerWidth / contentWidth;
  const clampedFloor = Math.min(1, Math.max(0, floor));
  const scale = Math.max(clampedFloor, natural);
  return { scale, overflowing: natural < clampedFloor };
}
