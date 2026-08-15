/**
 * Unit tests for computeReplayBoardFit() — task R2, replay whiteboard
 * scale-to-fit.
 *
 * The replay WB pane renders WhiteboardCanvas at a fixed design width
 * (REPLAY_BOARD_DESIGN_WIDTH_PX, matching the live board's max-w-3xl) and
 * then CSS-transform-scales the whole thing down to fit the pane's actual
 * (ResizeObserver-measured) width. This locks down the pure ratio/height
 * math: never upscale, never divide by zero/NaN, and the scaled result must
 * actually fit within the container (no horizontal cut — the acceptance
 * criterion from the brief: a 390px-wide pane must show a wide concept-map
 * fully, no cutoff).
 *
 *   npx tsx scripts/test-replay-board-fit.ts
 */
import assert from 'node:assert';
import { computeReplayBoardFit, REPLAY_BOARD_DESIGN_WIDTH_PX } from '../apps/marketing/src/lib/tutor/recordings/replay-board-fit';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

console.log('computeReplayBoardFit — core ratio/height math');

check('narrow pane (390px) vs. a design-width (768px) concept map: ratio < 1 and content fits with no horizontal cut', () => {
  const { ratio, scaledHeight } = computeReplayBoardFit({
    containerWidth: 390,
    contentWidth: REPLAY_BOARD_DESIGN_WIDTH_PX,
    contentHeight: 500,
  });
  assert.ok(ratio > 0 && ratio < 1, `expected 0 < ratio < 1, got ${ratio}`);
  assert.strictEqual(ratio, 390 / REPLAY_BOARD_DESIGN_WIDTH_PX);
  // The acceptance bar: scaled content width must NOT exceed the container —
  // i.e., no horizontal cut in the 390px pane.
  const scaledWidth = REPLAY_BOARD_DESIGN_WIDTH_PX * ratio;
  assert.ok(scaledWidth <= 390 + 1e-9, `scaledWidth ${scaledWidth} exceeds container 390`);
  assert.strictEqual(scaledHeight, 500 * ratio);
});

check('container wider than content: ratio caps at 1 — never upscale', () => {
  const { ratio, scaledHeight } = computeReplayBoardFit({
    containerWidth: 1200,
    contentWidth: REPLAY_BOARD_DESIGN_WIDTH_PX,
    contentHeight: 400,
  });
  assert.strictEqual(ratio, 1, 'a wider R3-style board pane must not blow up a small board past its natural size');
  assert.strictEqual(scaledHeight, 400, 'unscaled height should pass through unchanged at ratio 1');
});

check('container exactly equal to content width: ratio is exactly 1', () => {
  const { ratio } = computeReplayBoardFit({ containerWidth: 768, contentWidth: 768, contentHeight: 300 });
  assert.strictEqual(ratio, 1);
});

check('content wider than the design width (a pathological overflowing element): ratio still computed honestly off the measured width, not the design constant', () => {
  // scrollWidth measured 900 (something inside overflowed the 768 design
  // width) — the ratio must be computed against the REAL measured width,
  // not silently against REPLAY_BOARD_DESIGN_WIDTH_PX, or the scaled result
  // would still overflow the container.
  const { ratio } = computeReplayBoardFit({ containerWidth: 390, contentWidth: 900, contentHeight: 200 });
  assert.strictEqual(ratio, 390 / 900);
  const scaledWidth = 900 * ratio;
  assert.ok(scaledWidth <= 390 + 1e-9, `scaledWidth ${scaledWidth} exceeds container 390`);
});

console.log('\ncomputeReplayBoardFit — not-yet-measured / degenerate inputs never divide-by-zero or NaN/Infinity');

check('containerWidth 0 (ResizeObserver has not fired yet): falls back to ratio 1, no NaN/Infinity', () => {
  const { ratio, scaledHeight } = computeReplayBoardFit({ containerWidth: 0, contentWidth: 768, contentHeight: 400 });
  assert.strictEqual(ratio, 1);
  assert.strictEqual(scaledHeight, 400);
});

check('contentWidth 0 (content not yet measured): falls back to ratio 1, no divide-by-zero/Infinity', () => {
  const { ratio, scaledHeight } = computeReplayBoardFit({ containerWidth: 390, contentWidth: 0, contentHeight: 0 });
  assert.strictEqual(ratio, 1);
  assert.ok(Number.isFinite(ratio));
  assert.strictEqual(scaledHeight, 0);
});

check('negative containerWidth or contentWidth (should never happen, but defensive): falls back to ratio 1', () => {
  assert.strictEqual(computeReplayBoardFit({ containerWidth: -10, contentWidth: 768, contentHeight: 100 }).ratio, 1);
  assert.strictEqual(computeReplayBoardFit({ containerWidth: 390, contentWidth: -10, contentHeight: 100 }).ratio, 1);
});

check('NaN containerWidth or contentWidth: falls back to ratio 1, result stays finite', () => {
  const a = computeReplayBoardFit({ containerWidth: NaN, contentWidth: 768, contentHeight: 100 });
  assert.strictEqual(a.ratio, 1);
  assert.ok(Number.isFinite(a.scaledHeight));
  const b = computeReplayBoardFit({ containerWidth: 390, contentWidth: NaN, contentHeight: 100 });
  assert.strictEqual(b.ratio, 1);
  assert.ok(Number.isFinite(b.scaledHeight));
});

check('contentHeight not yet measured (0 or negative): scaledHeight is 0, never negative/NaN', () => {
  assert.strictEqual(computeReplayBoardFit({ containerWidth: 390, contentWidth: 768, contentHeight: 0 }).scaledHeight, 0);
  assert.strictEqual(computeReplayBoardFit({ containerWidth: 390, contentWidth: 768, contentHeight: -50 }).scaledHeight, 0);
});

console.log('\ncomputeReplayBoardFit — ratio is monotonic in containerWidth (sanity: bigger pane never shrinks content further)');

check('ratio increases (or stays capped at 1) as containerWidth grows, for fixed content size', () => {
  const widths = [200, 390, 500, 768, 900, 1400];
  let prevRatio = 0;
  for (const w of widths) {
    const { ratio } = computeReplayBoardFit({ containerWidth: w, contentWidth: 768, contentHeight: 400 });
    assert.ok(ratio >= prevRatio - 1e-9, `ratio regressed at containerWidth=${w}`);
    assert.ok(ratio > 0 && ratio <= 1);
    prevRatio = ratio;
  }
});

console.log(`\n${passed} checks passed`);
