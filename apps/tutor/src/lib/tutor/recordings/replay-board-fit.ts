/**
 * Replay whiteboard scale-to-fit (task R2).
 *
 * The replay modal's WB pane renders `WhiteboardCanvas` at a FIXED design
 * width (see `REPLAY_BOARD_DESIGN_WIDTH_PX` — matches the live tutor board's
 * `max-w-3xl` column, `SessionStage.tsx:288`) so its cards/equations/diagrams
 * lay out exactly as they do live — same font sizes, same per-element aspect
 * ratios, same relative scale between a diagram's SVG labels and the
 * surrounding card text. That fixed-width render is then uniformly shrunk
 * (CSS `transform: scale()`) to fit whatever width the pane actually has.
 *
 * Why not just let the board's own layout shrink to the pane width instead?
 * `WhiteboardCanvas`'s content is a mix of fluid pieces (e.g.
 * `ConceptMapRenderer`'s SVG uses `width: '100%'` with a fixed viewBox, so it
 * silently rescales — labels and all — to whatever width it's given) and
 * fixed-size pieces (card padding, font sizes, KaTeX). Handing the whole tree
 * a narrower width doesn't fail loudly (nothing overflows to reveal the bug)
 * — it just silently produces mismatched proportions: SVG diagram labels
 * shrink with the container while surrounding card text does not, which is
 * exactly the reported "too large / illegible until fullscreen" complaint.
 * Rendering once at the live design width and scaling the WHOLE picture
 * uniformly preserves every element's proportion relative to every other
 * element — it just makes the whole thing smaller, which is legible, unlike
 * a lopsided reflow.
 *
 * This module is the pure ratio/height math extracted out of the
 * ResizeObserver wiring in `ReplayPlayer.tsx` so it's unit-testable without a
 * DOM (script-test pattern, `scripts/test-replay-board-fit.ts`).
 */

/** Design width the WB pane's (unscaled) content wrapper is rendered at —
 *  matches the live board's `max-w-3xl` (48rem) column in `SessionStage.tsx`.
 *  This is a CSS width fed to the layout (needed so the fluid pieces inside
 *  `WhiteboardCanvas` have a definite width to lay out against); it is NOT
 *  assumed to be the final "content natural width" used in the ratio below —
 *  that is measured (via `scrollWidth`) off the actual rendered DOM, so a
 *  pathological element wider than this design width is still honestly
 *  accounted for rather than silently clipped. */
export const REPLAY_BOARD_DESIGN_WIDTH_PX = 768;

export interface BoardFitInput {
  /** The replay WB pane's available width, in px (ResizeObserver on the
   *  pane's outer scrollable container). 0/negative/NaN before the observer
   *  has fired at least once. */
  containerWidth: number;
  /** The unscaled content wrapper's measured width, in px — `scrollWidth`,
   *  not the CSS width fed to it — so real overflow past the design width
   *  is honestly reflected rather than assumed away. 0 before first measure. */
  contentWidth: number;
  /** The unscaled content wrapper's measured height, in px (`scrollHeight`).
   *  Genuinely varies with how much has been revealed so far — always
   *  measured, never assumed. 0 before first measure. */
  contentHeight: number;
}

export interface BoardFitResult {
  /** Scale factor for `transform: scale(ratio)` on the content wrapper.
   *  Always in (0, 1] — capped at 1 so small content is never upscaled
   *  (a small concept map shouldn't blow up to fill a huge R3 board pane;
   *  it should render at its natural size, centered/left-aligned). */
  ratio: number;
  /** The height (px) the scroll-containing ancestor should be given so its
   *  scrollable area matches the VISUALLY scaled content — `transform`
   *  doesn't change layout size, so without this the pane would scroll past
   *  (or short of) the shrunk content's actual painted extent. */
  scaledHeight: number;
}

/** Pure ratio/height math for the replay WB scale-to-fit wrapper.
 *  Never divides by zero and never produces NaN/Infinity: any not-yet-
 *  measured dimension (0, negative, or NaN — e.g. before a ResizeObserver's
 *  first callback, or a `display:none` pane) falls back to ratio 1 (render
 *  at natural size; nothing worse than today's un-scaled behavior). */
export function computeReplayBoardFit({
  containerWidth,
  contentWidth,
  contentHeight,
}: BoardFitInput): BoardFitResult {
  const safeHeight = contentHeight > 0 ? contentHeight : 0;
  if (!(containerWidth > 0) || !(contentWidth > 0)) {
    return { ratio: 1, scaledHeight: safeHeight };
  }
  const ratio = Math.min(1, containerWidth / contentWidth);
  return { ratio, scaledHeight: safeHeight * ratio };
}
