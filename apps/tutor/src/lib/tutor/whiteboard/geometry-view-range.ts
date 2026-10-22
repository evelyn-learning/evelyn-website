/**
 * The geometry renderer's auto view range, in math units, before its aspect
 * expansion: the box around the points, circles (center ± radius) and conics
 * (center ± 2·max(a, b)), a span under 1 widened by 1 on each side, then
 * padded. Pure; the renderer resolves circle / conic centres from point ids.
 *
 * fit 'canvas' (every live session; frozen): ± PADDING = 1.5 units.
 * fit 'content' (GAC round 8, G3 — the board's lead figure and the homework
 * thumbnail): ± max(1.5, 12 % of the larger extent). A fixed 1.5 units is
 * ≈ 1 % of a 125-unit-wide figure, so labels and arcs drawn past its edge
 * points fell outside the canvas and the content crop, clamped to the canvas,
 * could not bring them back.
 */

const PADDING = 1.5;
const CONTENT_PAD_SHARE = 0.12;

export function autoViewRange(a: {
  points: { x: number; y: number }[];
  circles: { center: { x: number; y: number }; radius: number }[];
  conics: { center: { x: number; y: number }; a: number; b?: number }[];
  fit: 'canvas' | 'content';
}): { x: [number, number]; y: [number, number] } {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  for (const p of a.points) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }

  for (const c of a.circles) {
    xMin = Math.min(xMin, c.center.x - c.radius);
    xMax = Math.max(xMax, c.center.x + c.radius);
    yMin = Math.min(yMin, c.center.y - c.radius);
    yMax = Math.max(yMax, c.center.y + c.radius);
  }

  // Parabolas are unbounded; treated as ellipse-like for viewport purposes.
  for (const cn of a.conics) {
    const span = 2 * Math.max(cn.a, cn.b ?? cn.a);
    xMin = Math.min(xMin, cn.center.x - span);
    xMax = Math.max(xMax, cn.center.x + span);
    yMin = Math.min(yMin, cn.center.y - span);
    yMax = Math.max(yMax, cn.center.y + span);
  }

  if (xMax - xMin < 1) { xMin -= 1; xMax += 1; }
  if (yMax - yMin < 1) { yMin -= 1; yMax += 1; }

  const pad = a.fit === 'content'
    ? Math.max(PADDING, CONTENT_PAD_SHARE * Math.max(xMax - xMin, yMax - yMin))
    : PADDING;

  return {
    x: [xMin - pad, xMax + pad],
    y: [yMin - pad, yMax + pad],
  };
}
