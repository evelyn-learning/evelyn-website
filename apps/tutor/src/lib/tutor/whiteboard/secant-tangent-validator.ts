/**
 * Secant/tangent (MVT-class) graph consistency validator.
 *
 * Problem it solves (observed 2026-07-23, AP Calc BC U5.1 MVT session): for
 * "secant + tangent" graphs the brain routinely authors mutually inconsistent
 * data — secant endpoints that don't lie on the curve, point c placed ON the
 * secant instead of the curve, a "tangent at c" that coincides with the secant
 * (and so renders invisible under it), or a narrated tangent that was never
 * plotted at all. The result is a graph that contradicts the narration.
 *
 * Approach (substitute-not-reject, all numeric via the intersection
 * validator's latexToJs evaluator):
 *   1. Identify the single non-secant/tangent curve; compile it. Bail
 *      conservatively if there isn't exactly one parseable curve.
 *   2. Snap the endpoint points a/b onto the curve and refit the secant line
 *      through them (domain-trimmed to [a.x, b.x]).
 *   3. Solve f'(c) = secant slope on (a.x, b.x) (sampled central-difference +
 *      bisection), snap the interior point c to (c*, f(c*)).
 *   4. Rewrite a wrong tangent — or BACKFILL a missing one when the title
 *      promises it — as the true tangent at c*, domain-trimmed so it reads as
 *      a segment touching the curve.
 *   5. Expand yRange (never shrink) so the curve is actually inside the
 *      viewport (the session graph's yRange [5,6.5] cropped a curve peaking
 *      at 7.38).
 *
 * Runs in the showGraph validator chain (server process-tool-call + client
 * VoiceTutorRealtime) BEFORE validateGraphLinearConsistency. Returns the SAME
 * object reference when nothing changed.
 */
import { latexToJs } from './intersection-validator';
import type { GraphData, GraphFunction, GraphPoint } from './intersection-validator';

const SECANT_RE = /secant/i;
const TANGENT_RE = /tangent/i;
const MVT_RE = /mean\s*value|\bMVT\b/i;

type Evaluator = (x: number) => number;

function compileX(expr: string): Evaluator | null {
  const js = latexToJs(expr, 'x');
  if (!js) return null;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `"use strict"; return (${js});`) as (x: number) => unknown;
    return (x: number) => {
      try {
        const r = fn(x);
        return typeof r === 'number' ? r : NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return null;
  }
}

function fmt(n: number): string {
  return parseFloat(n.toPrecision(6)).toString();
}

/** "m x + b" latex for a line through (x0, y0) with slope m. */
function lineLatex(m: number, x0: number, y0: number): string {
  const b = y0 - m * x0;
  if (Math.abs(m) < 1e-12) return fmt(b);
  let s = Math.abs(m - 1) < 1e-12 ? 'x' : Math.abs(m + 1) < 1e-12 ? '-x' : `${fmt(m)}x`;
  if (Math.abs(b) > 1e-12) s += b > 0 ? ` + ${fmt(b)}` : ` - ${fmt(Math.abs(b))}`;
  return s;
}

function getExpr(fn: GraphFunction): string {
  return fn.latex || fn.fn || '';
}

/** Roots of f'(x) = m on (lo, hi): sampled central difference + bisection. */
function solveSlopeEquals(f: Evaluator, m: number, lo: number, hi: number): number[] {
  const span = hi - lo;
  if (!(span > 0)) return [];
  const h = span * 1e-4;
  const g = (x: number) => {
    const d = (f(x + h) - f(x - h)) / (2 * h);
    return Number.isFinite(d) ? d - m : NaN;
  };
  const N = 400;
  const inset = span * 0.002;
  const x0 = lo + inset;
  const x1 = hi - inset;
  const step = (x1 - x0) / N;
  const out: number[] = [];
  let prevX = x0;
  let prevG = g(prevX);
  for (let i = 1; i <= N && out.length < 8; i++) {
    const curX = x0 + i * step;
    const curG = g(curX);
    // A sample can land exactly on the root (g=0), which the sign-change test
    // below misses (0 is not < 0) — record it directly.
    if (Number.isFinite(curG) && Math.abs(curG) < 1e-9) {
      if (!out.some(x => Math.abs(x - curX) < span * 1e-4)) out.push(curX);
      prevX = curX;
      prevG = curG;
      continue;
    }
    if (Number.isFinite(prevG) && Number.isFinite(curG) && prevG * curG < 0) {
      let a = prevX, b = curX, ga = prevG;
      for (let j = 0; j < 60; j++) {
        const mid = 0.5 * (a + b);
        const gm = g(mid);
        if (!Number.isFinite(gm)) break;
        if (Math.abs(gm) < 1e-10) { a = mid; b = mid; break; }
        if (gm * ga < 0) b = mid;
        else { a = mid; ga = gm; }
      }
      const r = 0.5 * (a + b);
      if (!out.some(x => Math.abs(x - r) < span * 1e-4)) out.push(r);
    }
    prevX = curX;
    prevG = curG;
  }
  return out;
}

function normLabel(l?: string): string {
  return (l || '').trim().toLowerCase();
}

export function validateSecantTangentGraph<T extends GraphData>(data: T): T {
  const fns = data.functions || [];
  if (fns.length === 0) return data;
  if ((data.functionsOfY || []).length > 0) return data; // out of scope
  if (!Array.isArray(data.xRange) || !Number.isFinite(data.xRange[0]) ||
      !Number.isFinite(data.xRange[1]) || !(data.xRange[1] > data.xRange[0])) return data;

  const secIdx = fns.findIndex(f => SECANT_RE.test(f.label || ''));
  const tanIdx = fns.findIndex(f => TANGENT_RE.test(f.label || ''));
  const title = String(data.title || '');
  const titleWantsTangent = TANGENT_RE.test(title) || MVT_RE.test(title);
  if (secIdx < 0 && tanIdx < 0) return data; // no secant/tangent-labeled line plotted

  // Exactly one curve (the function that is neither secant nor tangent).
  const curveIdxs = fns.map((_, i) => i).filter(i => i !== secIdx && i !== tanIdx);
  if (curveIdxs.length !== 1) return data;
  const curveIdx = curveIdxs[0];
  const f = compileX(getExpr(fns[curveIdx]));
  if (!f) return data; // can't evaluate the curve → conservative bail

  const points = data.points || [];
  if (points.length < 2) return data;

  // Roles: a/b = explicit labels else min/max x; c = explicit label else the
  // single interior point of a 3-point set.
  const byX = [...points].sort((p, q) => p.x - q.x);
  const findLabeled = (re: RegExp) => points.find(p => re.test(normLabel(p.label)));
  const pa = findLabeled(/^a\b/) || byX[0];
  const pb = findLabeled(/^b\b/) || byX[byX.length - 1];
  if (!(pb.x - pa.x > 1e-9)) return data;
  let pc = findLabeled(/^c\b/) ||
    (points.length === 3 ? byX.find(p => p !== pa && p !== pb) : undefined);

  const fa = f(pa.x);
  const fb = f(pb.x);
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) return data;
  const m = (fb - fa) / (pb.x - pa.x);

  // Visual tolerance: 2% of the larger of requested y-span and curve y-span.
  const [xLo, xHi] = data.xRange;
  const samples: number[] = [];
  const SN = 240;
  for (let i = 0; i <= SN; i++) {
    const v = f(xLo + (i * (xHi - xLo)) / SN);
    if (Number.isFinite(v)) samples.push(v);
  }
  if (samples.length < SN / 2) return data; // curve barely defined on window → bail
  samples.sort((a, b) => a - b);
  const clip = Math.floor(samples.length * 0.02);
  const curveLo = samples[clip];
  const curveHi = samples[samples.length - 1 - clip];
  const ySpan = Math.max(
    Math.abs((data.yRange?.[1] ?? 0) - (data.yRange?.[0] ?? 0)),
    curveHi - curveLo,
    1e-6,
  );
  const tol = 0.02 * ySpan + 1e-9;

  let changed = false;
  const notes: string[] = [];
  const newPoints = points.slice();
  const newFns = fns.slice();

  // 1. Snap endpoints onto the curve.
  const snap = (p: GraphPoint, fy: number, role: string): GraphPoint => {
    if (Math.abs(p.y - fy) <= tol) return p;
    changed = true;
    notes.push(`${role}=(${fmt(p.x)},${fmt(p.y)}) → on curve (${fmt(p.x)},${fmt(fy)})`);
    const snapped = { ...p, y: fy };
    newPoints[points.indexOf(p)] = snapped;
    return snapped;
  };
  const sa = snap(pa, fa, 'a');
  const sb = snap(pb, fb, 'b');

  // 2. Secant through the (snapped) endpoints.
  if (secIdx >= 0) {
    const sec = fns[secIdx];
    const se = compileX(getExpr(sec));
    const missA = se ? Math.abs(se(sa.x) - fa) : Infinity;
    const missB = se ? Math.abs(se(sb.x) - fb) : Infinity;
    if (missA > tol || missB > tol) {
      changed = true;
      const latex = lineLatex(m, sa.x, fa);
      notes.push(`secant refit through endpoints → ${latex}`);
      newFns[secIdx] = { ...sec, latex, fn: undefined, domain: [sa.x, sb.x] };
    }
  }

  // 3. MVT point c: f'(c) = secant slope.
  const roots = solveSlopeEquals(f, m, sa.x, sb.x);
  let cStar: number | undefined;
  if (roots.length > 0) {
    const target = pc ? pc.x : (sa.x + sb.x) / 2;
    cStar = roots.reduce((best, r) => (Math.abs(r - target) < Math.abs(best - target) ? r : best), roots[0]);
  }

  if (cStar !== undefined) {
    const fc = f(cStar);
    if (Number.isFinite(fc)) {
      if (pc) {
        const xOff = Math.abs(pc.x - cStar) > 0.02 * (sb.x - sa.x);
        if (xOff || Math.abs(pc.y - fc) > tol) {
          changed = true;
          notes.push(`c=(${fmt(pc.x)},${fmt(pc.y)}) → MVT point (${fmt(cStar)},${fmt(fc)})`);
          const snapped = { ...pc, x: cStar, y: fc };
          newPoints[points.indexOf(pc)] = snapped;
          pc = snapped;
        }
      }

      // 4. Tangent at c*: rewrite a wrong one, or backfill a promised one.
      const r = 0.25 * (sb.x - sa.x);
      const tanDomain: [number, number] = [
        Math.max(xLo, cStar - r),
        Math.min(xHi, cStar + r),
      ];
      if (tanIdx >= 0) {
        const tan = fns[tanIdx];
        const te = compileX(getExpr(tan));
        const d = Math.max((sb.x - sa.x) * 0.1, 1e-3);
        const tSlope = te ? (te(cStar + d) - te(cStar - d)) / (2 * d) : NaN;
        const touches = te ? Math.abs(te(cStar) - fc) <= tol : false;
        const parallel = Number.isFinite(tSlope) && Math.abs(tSlope - m) <= 0.02 * Math.max(1, Math.abs(m));
        if (!touches || !parallel) {
          changed = true;
          const latex = lineLatex(m, cStar, fc);
          notes.push(`tangent rewritten → ${latex} on [${fmt(tanDomain[0])}, ${fmt(tanDomain[1])}]`);
          newFns[tanIdx] = { ...tan, latex, fn: undefined, domain: tanDomain };
        }
      } else if (titleWantsTangent) {
        changed = true;
        const latex = lineLatex(m, cStar, fc);
        notes.push(`tangent BACKFILLED → ${latex} (title promises one)`);
        newFns.push({ latex, label: 'tangent at c', color: '#16a34a', domain: tanDomain });
        if (!pc) {
          notes.push(`c point added at (${fmt(cStar)},${fmt(fc)})`);
          newPoints.push({ x: cStar, y: fc, label: 'c', color: '#16a34a' });
        }
      }
    }
  }

  // 5. Viewport: yRange must contain the (percentile-clipped) curve + points.
  let yRange = data.yRange;
  if (Array.isArray(yRange)) {
    const ptYs = newPoints.map(p => p.y).filter(Number.isFinite);
    const lo = Math.min(curveLo, ...ptYs);
    const hi = Math.max(curveHi, ...ptYs);
    const pad = 0.05 * Math.max(hi - lo, 1e-6);
    const newLo = Math.min(yRange[0], lo - pad);
    const newHi = Math.max(yRange[1], hi + pad);
    if (newLo < yRange[0] - 1e-9 || newHi > yRange[1] + 1e-9) {
      changed = true;
      notes.push(`yRange [${fmt(yRange[0])}, ${fmt(yRange[1])}] → [${fmt(newLo)}, ${fmt(newHi)}] to contain curve`);
      yRange = [newLo, newHi];
    }
  }

  if (!changed) return data;
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(`[secant-tangent-validator] ${notes.join('; ')}`);
  }
  return { ...data, points: newPoints, functions: newFns, yRange };
}
