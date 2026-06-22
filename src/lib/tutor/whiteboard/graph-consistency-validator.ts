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
