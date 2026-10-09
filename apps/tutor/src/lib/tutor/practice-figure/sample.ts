/**
 * Curve sampling for practice figures — split out of render.ts so the kind
 * modules under ./kinds can use it; render.ts re-exports it.
 */

/**
 * Sample `f` over [a, b] into continuous pieces (data coordinates), breaking
 * at every discontinuity instead of joining across it:
 *   - where f is undefined (non-finite) the piece ends at the last defined x
 *     (found by bisection, so sqrt(x) starts at 0, not one sample late);
 *   - a large change between neighbouring samples is bisected: a continuous
 *     function's change shrinks with the interval, a jump's or a pole's does
 *     not — then each side is drawn up to the break (a pole runs off the
 *     plot edge; the caller clips), and never through it.
 * y is clamped to one span beyond the range so a pole cannot emit absurd
 * coordinates.
 */
export function sampleCurve(
  f: (x: number) => number,
  a: number,
  b: number,
  yMin: number,
  yMax: number,
  n = 480,
): Array<Array<[number, number]>> {
  const span = yMax - yMin;
  const lo = yMin - span;
  const hi = yMax + span;
  const clampY = (y: number) => Math.max(lo, Math.min(hi, y));
  const pieces: Array<Array<[number, number]>> = [];
  let cur: Array<[number, number]> = [];
  const close = () => {
    if (cur.length > 1) pieces.push(cur);
    cur = [];
  };
  /** Last x in [defined, undefinedX) where f is still finite. */
  const edgeOfDefinition = (defined: number, undefinedX: number): number => {
    let l = defined;
    let r = undefinedX;
    for (let k = 0; k < 44; k++) {
      const m = (l + r) / 2;
      if (m === l || m === r) break;
      if (Number.isFinite(f(m))) l = m;
      else r = m;
    }
    return l;
  };
  let px = NaN;
  let py = NaN;
  for (let i = 0; i <= n; i++) {
    const x = i === n ? b : a + ((b - a) * i) / n;
    const y = f(x);
    if (!Number.isFinite(y)) {
      if (Number.isFinite(py)) {
        const e = edgeOfDefinition(px, x);
        if (e !== px) cur.push([e, clampY(f(e))]);
      }
      close();
      px = x;
      py = NaN;
      continue;
    }
    if (!Number.isFinite(py)) {
      if (i > 0) {
        const e = edgeOfDefinition(x, px);
        if (e !== x) cur.push([e, clampY(f(e))]);
      }
    } else if (Math.abs(y - py) > span * 0.2) {
      // Bisect toward the larger change.
      let l = px;
      let r = x;
      let yl = py;
      let yr = y;
      let jump = true;
      for (let k = 0; k < 44; k++) {
        const m = (l + r) / 2;
        if (m === l || m === r) break;
        const ym = f(m);
        if (!Number.isFinite(ym)) break;
        if (Math.abs(ym - yl) >= Math.abs(yr - ym)) {
          r = m;
          yr = ym;
        } else {
          l = m;
          yl = ym;
        }
        if (Math.abs(yr - yl) < span * 1e-3) {
          jump = false;
          break;
        }
      }
      if (jump) {
        if (l !== px) cur.push([l, clampY(yl)]);
        close();
        if (r !== x) cur.push([r, clampY(yr)]);
      }
    }
    cur.push([x, clampY(y)]);
    px = x;
    py = y;
  }
  close();
  return pieces;
}
