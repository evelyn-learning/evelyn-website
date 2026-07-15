/**
 * Pure, deterministic de-overlap pass for LLM-positioned text labels within a
 * single rendered whiteboard item.
 *
 * Motivation (2026-07-14 APUSH live session): a showSketch item carried three
 * caption labels ("tomatoes - from Americas", "potatoes - from Americas",
 * "maize/corn - from Americas") at the SAME coordinates, so the strings
 * composited into unreadable mush. The doodler/brain supplies coordinates with
 * no cross-label collision awareness, so the renderer needs a conservative
 * safety net.
 *
 * Algorithm (stable: same input → same output):
 *   1. Estimate each label's bbox (char-count × fontSize heuristic — fine for
 *      SVG <text> where no canvas 2d context is at hand).
 *   2. Visit labels in reading order (original y, then x, then input index).
 *      The first label of any colliding pile never moves.
 *   3. A label whose box intersects an already-placed box is nudged
 *      VERTICALLY only (x / anchor untouched): stacked below the colliding
 *      pile, or above its original spot when the bottom of the canvas would
 *      clip it. Clamped to the bounds either way.
 *   4. Labels that collide with nothing are returned as the SAME object
 *      reference — non-colliding input is bit-for-bit untouched.
 *
 * Deliberately NOT typography-aware or force-directed — a couple of small,
 * predictable nudges beat a clever layout that shifts on every render.
 */

export interface DeoverlapLabel {
  /** Anchor x (interpretation depends on `anchor`). */
  x: number;
  /** Anchor y — the vertical CENTER when baseline is 'middle' (SVG
   *  dominant-baseline: middle), or the text baseline when 'alphabetic'. */
  y: number;
  text: string;
  fontSize: number;
  /** SVG text-anchor; default 'middle'. */
  anchor?: 'start' | 'middle' | 'end';
}

export interface DeoverlapOptions {
  /** Estimated glyph width as a fraction of fontSize (default 0.55). */
  charWidth?: number;
  /** Estimated bbox height as a multiple of fontSize (default 1.2). */
  lineHeight?: number;
  /** Floor on the estimated bbox width, in canvas units (default 0). */
  minWidth?: number;
  /** Vertical gap left between stacked boxes, in canvas units (default 1). */
  pad?: number;
  /** How `y` maps onto the bbox (default 'middle'). */
  baseline?: 'middle' | 'alphabetic';
  /** Keep boxes at least this far inside the bounds when clamping (default 1). */
  edgePad?: number;
}

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** A label's estimated bbox at a given y (x fixed by the label itself). */
function boxAt(
  l: DeoverlapLabel,
  y: number,
  o: Required<DeoverlapOptions>,
): Box {
  const w = Math.max(o.minWidth, l.text.length * l.fontSize * o.charWidth);
  const h = l.fontSize * o.lineHeight;
  const anchor = l.anchor ?? 'middle';
  const left = anchor === 'start' ? l.x : anchor === 'end' ? l.x - w : l.x - w / 2;
  // 'alphabetic': the baseline sits near the bottom of the glyph box —
  // ascent ≈ 0.8·h above it, descent ≈ 0.2·h below.
  const top = o.baseline === 'middle' ? y - h / 2 : y - h * 0.8;
  return { left, right: left + w, top, bottom: top + h };
}

/** Strict geometric intersection (no padding) — the collision TRIGGER. */
function intersects(a: Box, b: Box): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

/**
 * De-overlap `labels` inside `bounds` by vertical nudging. Returns a new
 * array in the ORIGINAL order; entries that did not need to move are the
 * same object reference as the input.
 */
export function deoverlapLabels<T extends DeoverlapLabel>(
  labels: readonly T[],
  bounds: { width: number; height: number },
  options: DeoverlapOptions = {},
): T[] {
  const o: Required<DeoverlapOptions> = {
    charWidth: options.charWidth ?? 0.55,
    lineHeight: options.lineHeight ?? 1.2,
    minWidth: options.minWidth ?? 0,
    pad: options.pad ?? 1,
    baseline: options.baseline ?? 'middle',
    edgePad: options.edgePad ?? 1,
  };

  // Reading order: original y, then x, then input index (stable tiebreak).
  const order = labels
    .map((_, i) => i)
    .sort((a, b) => labels[a].y - labels[b].y || labels[a].x - labels[b].x || a - b);

  const out: T[] = new Array(labels.length);
  const placed: Box[] = [];

  /** y that puts the label's box top at `top`. */
  const yForTop = (l: T, top: number): number => {
    const h = l.fontSize * o.lineHeight;
    return o.baseline === 'middle' ? top + h / 2 : top + h * 0.8;
  };

  /** Walk one direction (down: below colliding boxes / up: above them) until
   *  collision-free. Returns the y, or null when it would leave the bounds. */
  const resolve = (l: T, dir: 1 | -1): number | null => {
    const h = l.fontSize * o.lineHeight;
    let y = l.y;
    // ≤ n iterations: each step clears at least one placed box.
    for (let step = 0; step <= placed.length; step++) {
      const box = boxAt(l, y, o);
      const hits = placed.filter((p) => intersects(box, p));
      if (hits.length === 0) {
        const top = box.top;
        if (top < o.edgePad || top + h > bounds.height - o.edgePad) return null;
        return y;
      }
      if (dir === 1) {
        const below = Math.max(...hits.map((p) => p.bottom)) + o.pad;
        y = yForTop(l, below);
      } else {
        const above = Math.min(...hits.map((p) => p.top)) - o.pad - h;
        y = yForTop(l, above);
      }
    }
    return null;
  };

  for (const i of order) {
    const l = labels[i];
    const original = boxAt(l, l.y, o);
    if (!placed.some((p) => intersects(original, p))) {
      out[i] = l; // untouched — same reference
      placed.push(original);
      continue;
    }
    // Prefer stacking DOWN (reading order flows downward); go UP only when
    // the bottom of the canvas would clip; clamp as a last resort.
    let y = resolve(l, 1);
    if (y === null) y = resolve(l, -1);
    if (y === null) {
      const h = l.fontSize * o.lineHeight;
      const down = resolveUnbounded(l, placed, o);
      const maxY = yForTop(l, bounds.height - o.edgePad - h);
      y = Math.min(down, maxY);
    }
    const moved = { ...l, y };
    out[i] = moved;
    placed.push(boxAt(moved, y, o));
  }

  return out;
}

/** Last-resort downward stack ignoring bounds (result is clamped by caller). */
function resolveUnbounded<T extends DeoverlapLabel>(
  l: T,
  placed: readonly Box[],
  o: Required<DeoverlapOptions>,
): number {
  const h = l.fontSize * o.lineHeight;
  let y = l.y;
  for (let step = 0; step <= placed.length; step++) {
    const box = boxAt(l, y, o);
    const hits = placed.filter((p) => intersects(box, p));
    if (hits.length === 0) return y;
    const below = Math.max(...hits.map((p) => p.bottom)) + o.pad;
    y = o.baseline === 'middle' ? below + h / 2 : below + h * 0.8;
  }
  return y;
}
