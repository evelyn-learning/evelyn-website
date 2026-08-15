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
 *   1. PRE-PASS: every label gets a horizontal edge clamp (char-count ×
 *      fontSize bbox estimate, anchor-aware) so its box starts within
 *      [edgePad, bounds.width - edgePad] — `bounds.width` exists as a
 *      parameter precisely for this (2026-08 B2 fix; a lone off-canvas
 *      label, e.g. a number-line caption near x=0, would otherwise never
 *      get corrected, since a label with no collisions never reaches step
 *      3 below). This MUST run before collision detection (round-2 fix):
 *      clamping only labels that survive collision detection unclamped
 *      checks a label's PRE-clamp box, so a label whose pre-clamp box
 *      missed everything but whose CLAMPED box lands on an already-placed
 *      label would slip through untouched-but-clamped, overlapping
 *      silently. Clamping first means every collision check below already
 *      sees final x positions.
 *   2. Estimate each (now on-canvas) label's bbox (same estimate as above).
 *   3. Visit labels in reading order (clamped y, then x, then input index).
 *      The first label of any colliding pile never moves.
 *   4. A label whose box intersects an already-placed box is nudged
 *      VERTICALLY only (x / anchor untouched by collision resolution):
 *      stacked below the colliding pile, or above its original spot when
 *      the bottom of the canvas would clip it. Clamped to the bounds either
 *      way.
 *   5. Labels untouched by both the pre-pass clamp and collision resolution
 *      are returned as the SAME object reference — non-colliding,
 *      non-clamped input is bit-for-bit untouched.
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
  /** Nudge direction tried FIRST for this label when it collides
   *  (falls back to the other direction). Overrides options.preferDir.
   *  Lets a caller keep below-axis labels moving down and above-axis
   *  labels moving up in one pass (NumberLineRenderer). */
  preferDir?: 'down' | 'up';
}

/** Fixed rectangle labels must avoid but that never moves (axis bands,
 *  arrow shafts, the diagram object itself...). */
export interface DeoverlapObstacle {
  left: number;
  right: number;
  top: number;
  bottom: number;
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
  /** Nudge direction tried first for colliding labels (default 'down').
   *  A label's own preferDir wins over this. */
  preferDir?: 'down' | 'up';
  /** Fixed boxes labels must stay clear of (never moved, never reported).
   *  Renderer geometry such as the number-line axis band or FBD arrow
   *  shafts — added 2026-07-19 (label-collision live sessions). */
  obstacles?: readonly DeoverlapObstacle[];
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
 * Horizontal clamp so a label's estimated box stays within
 * [edgePad, bounds.width - edgePad], per its anchor. Mirrors clampLabelPos
 * in sketch-render-core.ts: `start`/`end` anchors pin the box to the near
 * edge when the label is wider than the usable width (there's no other
 * side to invert to); a `middle`-anchored label that's too wide to fit
 * with any half-width margin is instead CENTERED (`bounds.width / 2`) —
 * pinning it to one edge would just clip the other side of the same box.
 *
 * The vertical collision pass below never touches x, so a solitary label
 * (no collisions) that starts off-canvas would otherwise stay off-canvas
 * forever — this runs as a PRE-PASS over every label, before collision
 * detection (see the algorithm doc above for why the order matters).
 */
function clampX<T extends DeoverlapLabel>(
  l: T,
  bounds: { width: number },
  o: Required<DeoverlapOptions>,
): number {
  const w = Math.max(o.minWidth, l.text.length * l.fontSize * o.charWidth);
  const anchor = l.anchor ?? 'middle';
  const lo = o.edgePad;
  const hi = bounds.width - o.edgePad;
  if (anchor === 'start') return Math.max(lo, Math.min(l.x, hi - w));
  if (anchor === 'end') return Math.min(hi, Math.max(l.x, lo + w));
  const half = w / 2;
  return hi - half < lo + half ? bounds.width / 2 : Math.max(lo + half, Math.min(l.x, hi - half));
}

/**
 * De-overlap `labels` inside `bounds`: clamp every label horizontally to
 * `bounds.width` FIRST, then vertically nudge collisions among the clamped
 * positions. Returns a new array in the ORIGINAL order; entries that needed
 * neither a horizontal clamp nor a vertical nudge are the same object
 * reference as the input.
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
    preferDir: options.preferDir ?? 'down',
    obstacles: options.obstacles ?? [],
  };

  // PRE-PASS: horizontal edge clamp applied to EVERY label before collision
  // detection runs, so the vertical de-overlap below always operates on
  // already on-canvas x positions. Clamping AFTER collision resolution
  // (round 1) checked a label's PRE-clamp box for collisions, then moved
  // its x — a label whose pre-clamp box missed everything but whose
  // CLAMPED box landed on an already-placed label slipped through
  // untouched-but-clamped, overlapping silently (2026-08 B2 round-2 fix;
  // repro: a short label placed near center, a long label near the far
  // edge whose pre-clamp box missed it but whose clamped box didn't). A
  // label whose clamp is a no-op keeps its input reference.
  const clamped: T[] = labels.map((l) => {
    const cx = clampX(l, bounds, o);
    return cx === l.x ? l : ({ ...l, x: cx } as T);
  });

  // Reading order: original y, then x, then input index (stable tiebreak).
  const order = clamped
    .map((_, i) => i)
    .sort((a, b) => clamped[a].y - clamped[b].y || clamped[a].x - clamped[b].x || a - b);

  const out: T[] = new Array(clamped.length);
  // Obstacles are pre-placed immovable boxes: labels route around them
  // exactly as they do around already-placed labels.
  const placed: Box[] = o.obstacles.map((b) => ({ ...b }));

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
    const l = clamped[i];
    const original = boxAt(l, l.y, o);
    if (!placed.some((p) => intersects(original, p))) {
      out[i] = l; // untouched by collision resolution — same ref as clamped[i]
      placed.push(original);
      continue;
    }
    // Prefer stacking in the label's / caller's preferred direction
    // (default DOWN — reading order flows downward); fall back to the
    // opposite side when the canvas edge would clip; clamp as a last resort.
    const firstDir: 1 | -1 = (l.preferDir ?? o.preferDir) === 'up' ? -1 : 1;
    let y = resolve(l, firstDir);
    if (y === null) y = resolve(l, firstDir === 1 ? -1 : 1);
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
