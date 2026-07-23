import { latexToJs } from './intersection-validator';

/**
 * Graph slope/point-consistency guard.
 *
 * The brain sometimes plots a LINE whose slope is inconsistent with the very
 * points it labels on that line — observed 2026-06-22 (Console2, Charles's-Law
 * V–T): function `0.667 * x` with points (300 K, 2 L) and (600 K, 4 L). To pass
 * through its own labels the slope must be 0.00667 — the emitted line is 100×
 * too steep, so it shoots off-screen while the points collapse onto the axis.
 * No view-bounds choice can frame a line that misses its own points, so this is
 * a DATA problem, not a framing one (framing is handled in DesmosGraphRenderer).
 *
 * This guard runs in the showGraph validator chain alongside validateConicGraph
 * / validateIntersectionPoints (substitute-not-reject philosophy): when a
 * straight-line function badly misses its own ≥2 collinear labeled points, it
 * REFITS the line through those points (the points are concrete data the brain
 * computed; the formula is the slip). Scope is deliberately LINEAR-only — eval-
 * free and safe; refitting a nonlinear curve from points is out of scope (it
 * only logs/leaves those). Returns the SAME object reference when nothing
 * changed, so callers can cheaply detect a fix with `!==`.
 */
/** Minimal structural shape this guard needs. Kept local + permissive so it
 *  accepts every GraphData variant in the validator chain (the conic /
 *  intersection validators each carry their own slightly-looser GraphData
 *  type) without coupling to one of them. */
interface GraphLike {
  functions?: Array<{ fn?: string; latex?: string; label?: string; color?: string; domain?: [number, number] }>;
  points?: Array<{ x: number; y: number; label?: string; color?: string }>;
  yRange?: [number, number];
}

/**
 * Reject a y=f(x) `functions` entry whose expression isn't actually a function
 * of x. The brain sometimes converts a polar curve r=f(θ) into a Cartesian-
 * implicit form (e.g. `sqrt(x^2+y^2) - 2 - 2(x/sqrt(x^2+y^2))`) and stuffs it
 * into `functions` (which expects y=f(x)), so it references `y` (or θ) and
 * renders as garbage (a parabola, not the cardioid). Generic, eval-free: any
 * standalone `y` or a `θ` in a y=f(x) expression is a wrong-slot / wrong-tool
 * signal — steer to show_diagram(polar_graph) or functionsOfY.
 */
export function validateFunctionGraphVars(
  data: { functions?: Array<{ expr?: string; latex?: string; fn?: string }> },
): { ok: true } | { ok: false; reason: string } {
  for (const fn of data.functions ?? []) {
    const e = fn.expr || fn.latex || fn.fn || '';
    if (/\\theta\b|θ/.test(e)) {
      return { ok: false, reason: `show_function_graph: the expression "${e}" uses θ — that is a POLAR curve r=f(θ). Use show_diagram(type: "polar_graph") with a {theta, r} point array; do not put a polar curve in \`functions\` (which is y=f(x)).` };
    }
    if (/(?<![A-Za-z\\])y(?![A-Za-z])/.test(e)) {
      return { ok: false, reason: `show_function_graph: a \`functions\` entry is y=f(x), but its expression "${e}" references y, so it is not a function of x. For a POLAR curve use show_diagram(type: "polar_graph"); for x=f(y) use \`functionsOfY\`; do not stuff an implicit/polar relation into \`functions\`.` };
    }
  }
  return { ok: true };
}

/**
 * R32 (2026-07-23, session-1784825448372 "The Puzzle" graph): the brain
 * plotted a single curve with value-claim labeled points ("f(1) = -3",
 * "f(5) = 7") that the curve visibly missed — the curve left the viewport
 * near x=4 while the labeled f(5)=7 dot floated in space. The points are the
 * pedagogical givens and an arbitrary nonlinear curve can't be refit safely
 * (see validateGraphLinearConsistency's scope note), so this is a REJECT
 * with a pointed corrective — the brain re-emits with a curve that actually
 * passes through its own claimed values (observed working: it drew the
 * correct graph on retry when the student asked).
 *
 * Scope: exactly ONE y=f(x) curve, no x=f(y) curves, and only points whose
 * label makes an explicit function-value claim ("f(1) = -3", "g(2) ≈ 5").
 * Bare-named points (a/b/c — the MVT shapes the secant-tangent validator
 * repairs) and coordinate-style labels (intersection validator's territory)
 * are ignored. Unparseable curve → pass (never reject what we can't check).
 */
const VALUE_CLAIM_LABEL_RE = /^\s*[a-zA-Z]\s*\(\s*-?[\d.]+\s*\)\s*[=≈]\s*(-?[\d.]+)/;
export function validateFunctionValuePoints(
  data: {
    functions?: Array<{ latex?: string; fn?: string; domain?: [number, number] }>;
    functionsOfY?: Array<unknown>;
    points?: Array<{ x: number; y: number; label?: string }>;
    yRange?: [number, number];
  },
): { ok: true } | { ok: false; reason: string } {
  const fns = data.functions ?? [];
  if (fns.length !== 1 || (data.functionsOfY ?? []).length > 0) return { ok: true };
  const points = data.points ?? [];
  const claimed = points.filter((p) => VALUE_CLAIM_LABEL_RE.test(p.label ?? ''));
  if (claimed.length === 0) return { ok: true };

  const expr = fns[0].latex || fns[0].fn || '';
  const js = latexToJs(expr, 'x');
  if (!js) return { ok: true };
  let f: (x: number) => number;
  try {
    // eslint-disable-next-line no-new-func
    const compiled = new Function('x', `"use strict"; return (${js});`) as (x: number) => unknown;
    f = (x) => { try { const r = compiled(x); return typeof r === 'number' ? r : NaN; } catch { return NaN; } };
  } catch {
    return { ok: true };
  }

  const ySpan = Math.abs((data.yRange?.[1] ?? 0) - (data.yRange?.[0] ?? 0)) || 1;
  const tol = Math.max(0.15 * ySpan, 0.5);
  const misses: string[] = [];
  for (const p of claimed) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    const d = fns[0].domain;
    if (d && (p.x < d[0] - 1e-9 || p.x > d[1] + 1e-9)) continue;
    const actual = f(p.x);
    if (!Number.isFinite(actual)) continue;
    if (Math.abs(actual - p.y) > tol) {
      misses.push(`"${p.label}" is plotted at (${p.x}, ${p.y}) but your curve gives f(${p.x}) = ${parseFloat(actual.toPrecision(4))}`);
    }
  }
  if (misses.length === 0) return { ok: true };
  return {
    ok: false,
    reason: `show_function_graph: your curve "${expr}" does not pass through your own labeled point(s): ${misses.join('; ')}. The labeled values are the givens — re-emit with an expression that actually passes through them (or correct the point coordinates).`,
  };
}

/** Parse a simple straight line `m*x + b` (or LaTeX `mx+b`) → {m,b}. Returns
 *  null for anything that isn't a recognizable degree-1 line in x (powers,
 *  other variables, functions, fractions all disqualify). Eval-free. */
export function parseLinear(expr: string): { m: number; b: number } | null {
  let s = String(expr ?? '')
    .trim()
    .replace(/^y\s*=\s*/i, '')
    .replace(/\\cdot|\\times/g, '*')
    .replace(/\\left|\\right/g, '')
    .replace(/\s+/g, '');
  if (!s) return null;
  // Reject anything non-linear: powers, other letters, functions, fractions.
  if (/x\^|x\*x|\^|[a-wyz]|frac|sqrt|pi|sin|cos|tan|log|ln/i.test(s)) return null;
  // Reject parenthesized forms — point-slope "7.29 - 0.05(x - 2.7)" was being
  // garbage-parsed as m=1,b=7.29 (observed 2026-07-23 MVT session: that parse
  // made a correct tangent look 100% wrong and got it refit onto the secant).
  // Linear-in-x with parens is out of scope; null = "can't judge, leave as-is".
  if (/[()]/.test(s)) return null;
  s = s.replace(/\*/g, '');
  if ((s.match(/x/g) || []).length !== 1) return null;

  const xTerm = s.match(/([+-]?\d*\.?\d*)x/);
  if (!xTerm) return null;
  const mRaw = xTerm[1];
  const m = mRaw === '' || mRaw === '+' ? 1 : mRaw === '-' ? -1 : parseFloat(mRaw);
  if (!Number.isFinite(m)) return null;

  const rest = s.replace(xTerm[0], '');
  let b = 0;
  if (rest) {
    const bMatch = rest.match(/[+-]?\d*\.?\d+/);
    if (!bMatch) return null; // leftover we can't parse → bail rather than guess
    b = parseFloat(bMatch[0]);
    if (!Number.isFinite(b)) return null;
  }
  return { m, b };
}

/** Slope/intercept of the line through ≥2 labeled points, plus whether the
 *  points actually lie on one line (so they DEFINE a line we can refit to). */
function lineThroughPoints(
  pts: ReadonlyArray<{ x: number; y: number }>,
): { m: number; b: number; collinear: boolean } | null {
  const valid = pts.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (valid.length < 2) return null;
  const sorted = [...valid].sort((a, b) => a.x - b.x);
  const p0 = sorted[0];
  const pN = sorted[sorted.length - 1];
  if (Math.abs(pN.x - p0.x) < 1e-9) return null; // vertical / coincident x
  const m = (pN.y - p0.y) / (pN.x - p0.x);
  const b = p0.y - m * p0.x;
  const ySpan = Math.max(...valid.map((p) => p.y)) - Math.min(...valid.map((p) => p.y));
  const tol = 0.05 * Math.max(Math.abs(ySpan), 1) + 1e-6;
  const collinear = valid.every((p) => Math.abs(m * p.x + b - p.y) <= tol);
  return { m, b, collinear };
}

function formatNum(n: number): string {
  return parseFloat(n.toPrecision(6)).toString();
}

function buildLinearLatex(m: number, b: number): string {
  let s = `${formatNum(m)}x`;
  if (Math.abs(b) > 1e-9) s += b > 0 ? ` + ${formatNum(b)}` : ` - ${formatNum(Math.abs(b))}`;
  return s;
}

/**
 * Refit any straight-line function that badly misses its own collinear labeled
 * points. "Badly misses" = the line's value at a point's x is off by more than
 * half the visible y-span (so it visibly fails to pass through the point).
 */
export function validateGraphLinearConsistency<T extends GraphLike>(data: T): T {
  if (!data || !Array.isArray(data.functions) || data.functions.length === 0) return data;
  if (!Array.isArray(data.points) || data.points.length < 2) return data;
  const points = data.points;

  const line = lineThroughPoints(points);
  if (!line || !line.collinear) return data; // points don't define a clean line → can't judge

  const ySpan = Math.abs((data.yRange?.[1] ?? 0) - (data.yRange?.[0] ?? 0)) || 1;
  const missTol = 0.5 * ySpan;

  let changed = false;
  const fixedFns = data.functions.map((fn) => {
    // A tangent line touches the curve at ONE point — missing the other
    // labeled points is by design, so refitting it through them rewrites the
    // tangent onto the secant (observed 2026-07-23 MVT session: c misplaced
    // onto the secant made a,c,b collinear and the tangent vanished under it).
    if (/tangent/i.test(fn.label || '')) return fn;
    const expr = fn.latex || fn.fn;
    if (!expr) return fn;
    const lin = parseLinear(expr);
    if (!lin) return fn; // nonlinear / unparseable → out of scope, leave as-is
    const maxMiss = Math.max(...points.map((p) => Math.abs(lin.m * p.x + lin.b - p.y)));
    if (maxMiss <= missTol) return fn; // line already passes through its points
    changed = true;
    return { ...fn, latex: buildLinearLatex(line.m, line.b), fn: undefined };
  });

  if (!changed) return data;
  return { ...data, functions: fixedFns };
}
