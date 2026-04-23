/**
 * Shared SVG layout primitives for whiteboard diagram renderers.
 *
 * Every renderer uses the same viewBox aspect ratio (520×360) and a shared
 * padding convention so titles, legends, and notes line up consistently.
 */

export const DIAGRAM_VIEWBOX = {
  width: 520,
  height: 360,
} as const;

export const DIAGRAM_PAD = {
  top: 36,       // room for a title
  bottom: 28,    // room for a caption / notes
  left: 24,
  right: 24,
} as const;

export function plotBox(viewbox = DIAGRAM_VIEWBOX, pad = DIAGRAM_PAD) {
  return {
    x: pad.left,
    y: pad.top,
    width: viewbox.width - pad.left - pad.right,
    height: viewbox.height - pad.top - pad.bottom,
    right: viewbox.width - pad.right,
    bottom: viewbox.height - pad.bottom,
    cx: viewbox.width / 2,
    cy: (pad.top + (viewbox.height - pad.bottom)) / 2,
  };
}

/**
 * Compact numeric formatting for on-chart labels.
 */
export function formatValue(v: number): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1000) return v.toFixed(0);
  if (abs >= 100) return v.toFixed(0);
  if (abs >= 10) return v.toFixed(1);
  if (abs >= 1) return v.toFixed(2).replace(/\.?0+$/, '');
  return v.toFixed(3).replace(/\.?0+$/, '');
}

/**
 * Evenly space N items within a range so adjacent items are separated by a
 * consistent gap and centered as a group.
 */
export function evenlySpaced(n: number, start: number, end: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [(start + end) / 2];
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/**
 * Rotate a point (px, py) around the origin by `angleRad` radians.
 */
export function rotate(px: number, py: number, angleRad: number): { x: number; y: number } {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return { x: px * c - py * s, y: px * s + py * c };
}

/**
 * Convert a degree angle (0° = East, 90° = North, as used elsewhere in the
 * codebase) to (dx, dy) in SVG coordinates where +y is down.
 */
export function degToVec(deg: number): { dx: number; dy: number } {
  const rad = (deg * Math.PI) / 180;
  return { dx: Math.cos(rad), dy: -Math.sin(rad) };
}

/**
 * Truncate a long label so it doesn't overflow a node / axis tick.
 */
export function truncate(s: string | undefined, max: number): string {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, Math.max(1, max - 1)) + '…';
}
