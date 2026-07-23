/**
 * Intersection-Point Validator
 *
 * Deterministic validator for `show_function_graph` labeled points.
 *
 * Problem it solves: the tutor sometimes labels points like the vertex of a
 * parabola or the x-intercept of one curve as "intersection points" on a
 * multi-curve plot, even though those points don't actually lie on every
 * plotted equation.
 *
 * Approach:
 *   1. Parse each plotted curve's expression into a numeric JS evaluator
 *      (LaTeX-ish → JS with a strict whitelist; unparseable curves cause a
 *      conservative bail-out so we never drop a point we can't verify).
 *   2. For each labeled point with a coordinate-style label, check that it
 *      lies on at least TWO of the plotted curves within tolerance. Drop
 *      any that don't — "intersection" always means a crossing of ≥2 curves.
 *      (For 2-curve plots this is identical to "on both"; for 3+ curves it's
 *      the pairwise rule, which is what students mean by "intersection points".)
 *   3. When the graph clearly intends to show intersections (title/labels
 *      mention "intersection", or all labeled points use coordinate-style
 *      labels), numerically find all pairwise intersections of the y=f(x)
 *      curves over the visible viewport and backfill them, capped at 10.
 *
 * Runs client-side alongside validateConicGraph in VoiceTutorRealtime.
 */

export interface GraphFunction {
  latex?: string;
  fn?: string;
  color?: string;
  label?: string;
  domain?: [number, number];
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface GraphData {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  xRange: [number, number];
  yRange: [number, number];
  functions?: GraphFunction[];
  functionsOfY?: GraphFunction[];
  points?: GraphPoint[];
  [key: string]: unknown;
}

type Variable = 'x' | 'y';
type Evaluator = (v: number) => number;

function getExpr(fn: GraphFunction): string {
  return fn.latex || fn.fn || '';
}

/**
 * Convert a LaTeX-ish expression to a JS-evaluable string in the given
 * free variable. Returns null when we see a relation ("=", "<", ">") or
 * any construct we don't confidently understand — callers must treat null
 * as "can't validate this curve".
 */
export function latexToJs(expr: string, variable: Variable): string | null {
  if (!expr) return null;
  let s = expr.trim();

  // Strip leading "y =" / "x =" so "y=x^3" and "x^3" both work.
  s = s.replace(/^\s*[yYxX]\s*=\s*/, '');

  // Reject anything with a remaining relation — that's an implicit equation
  // (e.g. "x^2+y^2=1") which we can't evaluate as a single-variable f(v).
  if (/[=<>]/.test(s)) return null;

  // \frac{a}{b} — resolve repeatedly for nesting.
  for (let i = 0; i < 6; i++) {
    const before = s;
    s = s.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '(($1)/($2))');
    if (s === before) break;
  }

  // \sqrt{a}
  for (let i = 0; i < 4; i++) {
    const before = s;
    s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, 'Math.sqrt($1)');
    if (s === before) break;
  }

  // Strip display-only LaTeX bracket commands.
  s = s.replace(/\\left|\\right/g, '');
  s = s.replace(/\\cdot/g, '*');
  s = s.replace(/\\pi\b/g, 'Math.PI');
  s = s.replace(/\\e\b/g, 'Math.E');

  // Trig / log (both \sin(x) and \sin x aren't supported — LaTeX almost
  // always parenthesizes or wraps in \left(\right), which we already stripped).
  const fnRewrites: Array<[RegExp, string]> = [
    [/\\sin\s*\(([^()]+)\)/g, 'Math.sin($1)'],
    [/\\cos\s*\(([^()]+)\)/g, 'Math.cos($1)'],
    [/\\tan\s*\(([^()]+)\)/g, 'Math.tan($1)'],
    [/\\ln\s*\(([^()]+)\)/g, 'Math.log($1)'],
    [/\\log\s*\(([^()]+)\)/g, '(Math.log($1)/Math.log(10))'],
    [/\\sqrt\s*\(([^()]+)\)/g, 'Math.sqrt($1)'],
    [/\\abs\s*\(([^()]+)\)/g, 'Math.abs($1)'],
  ];
  for (let i = 0; i < 3; i++) {
    for (const [re, sub] of fnRewrites) s = s.replace(re, sub);
  }

  // Any remaining backslash = unsupported LaTeX command.
  if (/\\/.test(s)) return null;

  // Bare Euler's e ("e^x - 4", the R32 IVT/Puzzle graphs) — the free
  // variable is only ever x/y, so a standalone e is always the constant.
  // Numeric literal (not Math.E) so the final whitelist check passes.
  // Lookbehinds exclude letters AND digits so scientific-notation-ish
  // tokens ("2e3") and multi-letter names are untouched.
  s = s.replace(/(?<![A-Za-z0-9.])e(?![A-Za-z0-9])/g, '(2.718281828459045)');

  // Unicode superscripts.
  const superMap: Record<string, string> = {
    '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  };
  s = s.replace(/([xy0-9)])([²³⁴⁵⁶⁷⁸⁹])/g, (_m, base, sup) => `${base}**${superMap[sup]}`);

  // ^ → **
  s = s.replace(/\^/g, '**');

  // ** followed by a braced group: **{2} → **(2)
  s = s.replace(/\*\*\s*\{([^{}]+)\}/g, '**($1)');

  // Shorthand xN/yN (e.g. x2 → x**2), only for the active variable.
  const v = variable;
  s = s.replace(new RegExp(`\\b${v}(\\d+)\\b`, 'g'), `${v}**$1`);

  // Implicit multiplication:
  //   2x → 2*x, 3(x+1) → 3*(x+1)
  s = s.replace(new RegExp(`(\\d)\\s*(${v}|\\()`, 'g'), '$1*$2');
  //   )x, )2, )( → )*...
  s = s.replace(new RegExp(`\\)\\s*(${v}|\\d|\\()`, 'g'), ')*$1');
  //   x( → x*(
  s = s.replace(new RegExp(`(${v})\\s*\\(`, 'g'), '$1*(');
  //   Adjacent variables: xx → x*x (handles "xxx" that some LLMs produce for x^3).
  //   Run twice to catch "xxx" → "x*xx" → "x*x*x".
  s = s.replace(new RegExp(`(${v})(${v})`, 'g'), '$1*$2');
  s = s.replace(new RegExp(`(${v})(${v})`, 'g'), '$1*$2');

  // Final whitelist check: after stripping recognized Math.<fn> tokens and
  // the `**` operator, the remaining string should only contain digits, the
  // free variable, arithmetic, parens, dots, commas, and whitespace.
  const residual = s
    .replace(/Math\.(sqrt|sin|cos|tan|log|abs|PI|E|pow)/g, '')
    .replace(/\*\*/g, '');
  if (!new RegExp(`^[\\s0-9${v}+\\-*/().]*$`).test(residual)) {
    return null;
  }

  return s;
}

function compile(expr: string, variable: Variable): Evaluator | null {
  const js = latexToJs(expr, variable);
  if (!js) return null;
  try {
    const fn = new Function(variable, `"use strict"; return (${js});`) as (v: number) => unknown;
    return (v: number) => {
      try {
        const r = fn(v);
        return typeof r === 'number' ? r : NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return null;
  }
}

interface CompiledCurve {
  kind: Variable;           // 'x' means y=f(x); 'y' means x=g(y)
  evalFn: Evaluator;
  source: GraphFunction;
}

function compileCurves(data: GraphData): CompiledCurve[] | null {
  const curves: CompiledCurve[] = [];
  for (const f of data.functions || []) {
    const e = compile(getExpr(f), 'x');
    if (!e) return null;
    curves.push({ kind: 'x', evalFn: e, source: f });
  }
  for (const f of data.functionsOfY || []) {
    const e = compile(getExpr(f), 'y');
    if (!e) return null;
    curves.push({ kind: 'y', evalFn: e, source: f });
  }
  return curves;
}

function looksLikeCoordinateLabel(label?: string): boolean {
  if (!label) return false;
  return /\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)/.test(label);
}

function hasIntersectionContext(data: GraphData): boolean {
  const blob = [
    data.title || '',
    ...(data.functions || []).map(f => f.label || ''),
    ...(data.functionsOfY || []).map(f => f.label || ''),
    ...(data.points || []).map(p => p.label || ''),
  ].join(' ').toLowerCase();
  return /\bintersect/.test(blob);
}

function pointOnCurve(pt: GraphPoint, c: CompiledCurve): boolean {
  if (c.kind === 'x') {
    const expected = c.evalFn(pt.x);
    if (!Number.isFinite(expected)) return false;
    if (c.source.domain) {
      const [lo, hi] = c.source.domain;
      if (pt.x < lo - 1e-9 || pt.x > hi + 1e-9) return false;
    }
    const tol = Math.max(0.1, 0.05 * Math.max(Math.abs(pt.y), Math.abs(expected)));
    return Math.abs(pt.y - expected) <= tol;
  }
  const expected = c.evalFn(pt.y);
  if (!Number.isFinite(expected)) return false;
  if (c.source.domain) {
    const [lo, hi] = c.source.domain;
    if (pt.y < lo - 1e-9 || pt.y > hi + 1e-9) return false;
  }
  const tol = Math.max(0.1, 0.05 * Math.max(Math.abs(pt.x), Math.abs(expected)));
  return Math.abs(pt.x - expected) <= tol;
}

/**
 * Numerically find all intersections of y=f(x) and y=g(x) on [x0, x1] by
 * densely sampling (f-g), bracketing sign changes, and refining via bisection.
 */
function findYofXIntersections(
  f: Evaluator,
  g: Evaluator,
  x0: number,
  x1: number,
  maxResults = 6,
): Array<{ x: number; y: number }> {
  if (!(x1 > x0)) return [];
  const N = 400;
  const step = (x1 - x0) / N;
  const diff = (x: number) => {
    const a = f(x);
    const b = g(x);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
    return a - b;
  };

  const out: Array<{ x: number; y: number }> = [];
  let prevX = x0;
  let prevD = diff(prevX);
  for (let i = 1; i <= N && out.length < maxResults; i++) {
    const curX = x0 + i * step;
    const curD = diff(curX);
    if (Number.isFinite(prevD) && Math.abs(prevD) < 1e-9) {
      const y = f(prevX);
      if (Number.isFinite(y)) out.push({ x: prevX, y });
    }
    if (Number.isFinite(prevD) && Number.isFinite(curD) && prevD * curD < 0) {
      let lo = prevX;
      let hi = curX;
      let lod = prevD;
      for (let j = 0; j < 60; j++) {
        const mid = 0.5 * (lo + hi);
        const md = diff(mid);
        if (!Number.isFinite(md)) break;
        if (Math.abs(md) < 1e-10) { lo = mid; hi = mid; break; }
        if (md * lod < 0) { hi = mid; } else { lo = mid; lod = md; }
      }
      const x = 0.5 * (lo + hi);
      const y = f(x);
      if (Number.isFinite(y)) out.push({ x, y });
    }
    prevX = curX;
    prevD = curD;
  }

  // De-duplicate roots that bisected to the same point from adjacent brackets.
  const dedup: Array<{ x: number; y: number }> = [];
  for (const r of out) {
    if (!dedup.some(d => Math.abs(d.x - r.x) < 1e-4)) dedup.push(r);
  }
  return dedup;
}

function formatIntersectionLabel(x: number, y: number): string {
  const round = (n: number) => {
    const r = Math.round(n * 100) / 100;
    return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/\.?0+$/, '');
  };
  return `(${round(x)}, ${round(y)})`;
}

/**
 * Validate labeled intersection points on a function graph and, when we can
 * confidently detect intersection intent, backfill real intersections the
 * tutor missed. Pass-through if we can't safely validate.
 */
export function validateIntersectionPoints(data: GraphData): GraphData {
  const points = data.points || [];
  const curveCount = (data.functions?.length || 0) + (data.functionsOfY?.length || 0);
  if (curveCount < 2) return data;
  if (points.length === 0 && !hasIntersectionContext(data)) return data;

  const intersectionFlag = hasIntersectionContext(data);
  const allCoordStyle = points.length > 0 && points.every(p => looksLikeCoordinateLabel(p.label));
  if (!intersectionFlag && !allCoordStyle) return data;

  const compiled = compileCurves(data);
  // If any curve can't be parsed, bail out — better to keep a possibly-wrong
  // label than to drop a point we couldn't verify.
  if (!compiled) return data;

  // A labeled intersection point must lie on at least 2 of the plotted curves.
  // For 2-curve plots this is identical to "on both". For 3+ curves it's the
  // pairwise rule — "highlight intersection points" almost always means every
  // place two curves cross, not just the (often empty or singleton) set where
  // all curves meet.
  const kept: GraphPoint[] = [];
  const dropped: GraphPoint[] = [];
  for (const pt of points) {
    // Word-labeled points ("Vertex", "Focus") may be legitimate features of
    // a single curve; only coordinate-style labels are treated as intersection
    // claims.
    if (!looksLikeCoordinateLabel(pt.label)) {
      kept.push(pt);
      continue;
    }
    const onCount = compiled.reduce((n, c) => n + (pointOnCurve(pt, c) ? 1 : 0), 0);
    if (onCount >= 2) kept.push(pt);
    else dropped.push(pt);
  }

  // Backfill: compute all pairwise intersections of y=f(x) curves within the
  // visible viewport, skipping ones already present. Capped so a pathological
  // trig example doesn't flood the plot with dots.
  const autoAdded: GraphPoint[] = [];
  const yOfX = compiled.filter(c => c.kind === 'x');
  if (yOfX.length >= 2) {
    const [x0, x1] = data.xRange;
    const [y0, y1] = data.yRange;
    const sample: GraphPoint | undefined = dropped[0] || points[0];
    const color = sample?.color || '#16a34a';
    const isDuplicate = (x: number, y: number) =>
      kept.some(p => Math.abs(p.x - x) < 0.02 && Math.abs(p.y - y) < 0.05) ||
      autoAdded.some(p => Math.abs(p.x - x) < 0.02 && Math.abs(p.y - y) < 0.05);
    const CAP = 10;
    outer: for (let i = 0; i < yOfX.length; i++) {
      for (let j = i + 1; j < yOfX.length; j++) {
        const ints = findYofXIntersections(yOfX[i].evalFn, yOfX[j].evalFn, x0, x1);
        for (const { x, y } of ints) {
          if (y < y0 - 0.01 || y > y1 + 0.01) continue;
          if (isDuplicate(x, y)) continue;
          autoAdded.push({ x, y, label: formatIntersectionLabel(x, y), color });
          if (autoAdded.length >= CAP) break outer;
        }
      }
    }
  }

  if (dropped.length === 0 && autoAdded.length === 0) return data;

  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(
      '[intersection-validator]',
      dropped.length ? `dropped ${dropped.length} point(s) not on ≥2 curves: ${dropped.map(p => p.label || `(${p.x}, ${p.y})`).join(', ')}` : '',
      autoAdded.length ? `added ${autoAdded.length} true intersection(s): ${autoAdded.map(p => p.label).join(', ')}` : '',
    );
  }

  return { ...data, points: [...kept, ...autoAdded] };
}
