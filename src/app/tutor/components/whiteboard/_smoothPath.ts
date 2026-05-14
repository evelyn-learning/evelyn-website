/** Catmull-Rom-to-Bezier smoothing for sparse-sampled curves.
 *
 *  Brain typically pre-samples a curve with 12-30 points. Rendering
 *  those with straight-line `M/L` SVG commands produces visibly
 *  faceted shapes (e.g. a 13-point unit circle looks like a
 *  dodecagon — observed 2026-05-14 Phase 10 live test). Cubic Bezier
 *  interpolation through the same points yields a smooth curve.
 *
 *  Tangents at each interior point use the Catmull-Rom formula:
 *      m_i = (P_{i+1} - P_{i-1}) / 6
 *  with the endpoints reflected (m_0 uses P_0 twice; m_n uses P_n
 *  twice). Output is a single SVG path string starting with `M` and
 *  using `C` segments thereafter. */
export function smoothPath(
  pts: Array<{ x: number; y: number }>,
  xAt: (x: number) => number,
  yAt: (y: number) => number,
): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${xAt(pts[0].x).toFixed(2)},${yAt(pts[0].y).toFixed(2)}`;
  if (pts.length === 2) {
    return `M${xAt(pts[0].x).toFixed(2)},${yAt(pts[0].y).toFixed(2)} L${xAt(pts[1].x).toFixed(2)},${yAt(pts[1].y).toFixed(2)}`;
  }
  const X = (i: number) => xAt(pts[i].x);
  const Y = (i: number) => yAt(pts[i].y);
  let d = `M${X(0).toFixed(2)},${Y(0).toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0i = i - 1;
    const p3i = i + 2;
    const p0x = p0i >= 0 ? X(p0i) : X(i);
    const p0y = p0i >= 0 ? Y(p0i) : Y(i);
    const p1x = X(i);
    const p1y = Y(i);
    const p2x = X(i + 1);
    const p2y = Y(i + 1);
    const p3x = p3i < pts.length ? X(p3i) : X(i + 1);
    const p3y = p3i < pts.length ? Y(p3i) : Y(i + 1);
    const c1x = p1x + (p2x - p0x) / 6;
    const c1y = p1y + (p2y - p0y) / 6;
    const c2x = p2x - (p3x - p1x) / 6;
    const c2y = p2y - (p3y - p1y) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2x.toFixed(2)},${p2y.toFixed(2)}`;
  }
  return d;
}
