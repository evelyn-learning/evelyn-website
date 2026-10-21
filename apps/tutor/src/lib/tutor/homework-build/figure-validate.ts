/**
 * Deterministic gate for a model-proposed homework figure. A figure shown to
 * a student is always one the solver resolved and whose labels all come from
 * the sheet; otherwise no figure. Pure: no I/O, no model calls.
 */

import { solveGeometry, type ConstructedGeometrySpec } from '../diagrams/geometry-solver';
import { validateFunctionValuePoints } from '../whiteboard/graph-consistency-validator';
import { parseFunctionString } from '../whiteboard/math-expr';
import { parseAxisStep, isPiStep } from '../whiteboard/graph-axis';
import type { GraphData } from '@core/knowledge/types';
import type { FigureClaim, FigureCommand } from './types';

export interface FigureContext { problemText: string; claims: FigureClaim[] }
export type FigureVerdict = { ok: true } | { ok: false; reasons: string[] };

const fmt = (n: number) => String(parseFloat(n.toPrecision(3)));

// ---------------------------------------------------------------- labels

function normalise(s: string): string {
  return s.replace(/[−‒–]/g, '-').replace(/\s+/g, ' ').trim().replace(/\.$/, '');
}

/** Words of the text: identifiers, numbers (with ° / π / fractions), and the = : operators. */
function tokenize(s: string): string[] {
  const raw = normalise(s).match(/[A-Za-z0-9°π'′.\-/]+|[=:]/g) ?? [];
  return raw.map((t) => t.replace(/^[.\-/]+(?=[A-Za-z0-9])/, '').replace(/[.\-/]+$/, '')).filter(Boolean);
}

const isOp = (t: string) => t === '=' || t === ':';

/** Whole-word tokens of the normalised text, plus `NAME op VALUE` pairs found in it. */
export function allowedLabelTokens(problemText: string): Set<string> {
  const toks = tokenize(problemText);
  const out = new Set<string>(toks.filter((t) => !isOp(t)));
  for (let i = 1; i + 1 < toks.length; i++) {
    if (isOp(toks[i]) && !isOp(toks[i - 1]) && !isOp(toks[i + 1])) out.add(`${toks[i - 1]} = ${toks[i + 1]}`);
  }
  return out;
}

const IDENT_RE = /^[A-Za-z][A-Za-z'′]{0,2}$/;
const VALUE_RE = /^-?\d+(?:\.\d+)?(?:\/\d+)?(?:°|π)?[A-Za-z%°]*$|^[π]$|^-?\d*π(?:\/\d+)?$|^[A-Za-z]$/;

/** Does this label come from the problem text? See the rules in the task brief (a)-(c). */
export function labelIsFromText(label: string, problemText: string): boolean {
  const l = normalise(label);
  if (!l) return true;
  const toks = tokenize(problemText);
  const words = new Set(toks.filter((t) => !isOp(t)));
  const wl = tokenize(l);
  if (wl.length === 1 && !isOp(wl[0])) {
    const w = wl[0];
    if (IDENT_RE.test(w) && words.has(w)) return true;
    if (VALUE_RE.test(w) && words.has(w)) return true;
    return false;
  }
  // NAME op VALUE, or NAME VALUE
  const parts = wl.filter((t) => !isOp(t));
  if (parts.length === 2 && wl.length <= 3) {
    const [name, value] = parts;
    for (let i = 0; i < toks.length; i++) {
      if (toks[i] !== name) continue;
      const after = toks.slice(i + 1).filter((t) => !isOp(t)).slice(0, 4);
      if (after.includes(value)) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------- claims

type Pt = { x: number; y: number };

/** Failing-claim messages; [] when every claim holds. tol is relative to the figure's extent. */
export function checkClaims(
  points: Record<string, Pt>,
  circles: Record<string, { cx: number; cy: number; r: number }>,
  claims: FigureClaim[],
  tol = 1e-6,
): string[] {
  const xs = Object.values(points).map((p) => p.x);
  const ys = Object.values(points).map((p) => p.y);
  const extent = Math.max(1e-9, Math.max(...xs, 0) - Math.min(...xs, 0), Math.max(...ys, 0) - Math.min(...ys, 0));
  const dtol = tol * extent;
  const out: string[] = [];

  const missing = (ids: string[]) => ids.filter((id) => !points[id]);
  /** Distance of p from the line through a,b, and whether it falls between a and b. */
  const lineDist = (p: Pt, a: Pt, b: Pt) => {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1e-12;
    const off = Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) / len;
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
    return { off, t };
  };
  const dir = (a: string, b: string) => {
    const dx = points[b].x - points[a].x, dy = points[b].y - points[a].y;
    return { dx, dy, len: Math.hypot(dx, dy) || 1e-12 };
  };

  for (const c of claims) {
    const ids = c.kind === 'on_segment' ? [c.point, ...c.segment]
      : c.kind === 'on_circle' ? [c.point]
      : c.kind === 'parallel' || c.kind === 'perpendicular' ? [...c.a, ...c.b]
      : c.kind === 'collinear' ? c.points
      : [c.point, ...c.ends];
    const gone = missing(ids);
    if (gone.length) { out.push(`${c.kind} claim names ${gone.join(', ')} but the solver has no such point`); continue; }

    if (c.kind === 'on_segment' || c.kind === 'between') {
      const [a, b] = c.kind === 'on_segment' ? c.segment : c.ends;
      const { off, t } = lineDist(points[c.point], points[a], points[b]);
      if (off > dtol) out.push(`${c.kind === 'between' ? 'between' : 'on_segment'} ${c.point} [${a},${b}] fails: ${c.point} is ${fmt(off)} off the line`);
      else if (t < -tol || t > 1 + tol) out.push(`${c.kind === 'between' ? 'between' : 'on_segment'} ${c.point} [${a},${b}] fails: ${c.point} is outside the segment`);
    } else if (c.kind === 'on_circle') {
      const circ = circles[c.circle];
      if (!circ) { out.push(`on_circle ${c.point} names circle ${c.circle} but the solver has no such circle`); continue; }
      const d = Math.abs(Math.hypot(points[c.point].x - circ.cx, points[c.point].y - circ.cy) - circ.r);
      if (d > dtol) out.push(`on_circle ${c.point} ${c.circle} fails: ${c.point} is ${fmt(d)} off the circle`);
    } else if (c.kind === 'parallel' || c.kind === 'perpendicular') {
      const u = dir(c.a[0], c.a[1]), v = dir(c.b[0], c.b[1]);
      const cross = Math.abs(u.dx * v.dy - u.dy * v.dx) / (u.len * v.len);
      const dot = Math.abs(u.dx * v.dx + u.dy * v.dy) / (u.len * v.len);
      const label = `${c.kind} [${c.a}] [${c.b}]`;
      if (c.kind === 'parallel' && cross > tol) out.push(`${label} fails: the lines differ by ${fmt((Math.asin(Math.min(1, cross)) * 180) / Math.PI)} degrees`);
      if (c.kind === 'perpendicular' && dot > tol) out.push(`${label} fails: the lines are ${fmt((Math.acos(Math.min(1, dot)) * 180) / Math.PI)} degrees apart, not 90`);
    } else if (c.kind === 'collinear') {
      const [a, b, ...rest] = c.points;
      for (const p of rest) {
        const { off } = lineDist(points[p], points[a], points[b]);
        if (off > dtol) out.push(`collinear [${c.points}] fails: ${p} is ${fmt(off)} off line ${a}${b}`);
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- geometry

function collectLabels(items: unknown[]): string[] {
  const out: string[] = [];
  for (const it of items) {
    const l = (it as { label?: unknown } | null)?.label;
    if (typeof l === 'string') out.push(l);
  }
  return out;
}

function validateGeometry(
  fig: Extract<FigureCommand, { action: 'showGeometryConstructed' }>,
  ctx: FigureContext,
): string[] {
  const reasons: string[] = [];
  let solved;
  try {
    solved = solveGeometry({
      title: fig.title, given: fig.given, steps: fig.steps, display: fig.display,
    } as ConstructedGeometrySpec);
  } catch (e) {
    return [`solver rejected the figure: ${(e as Error).message}`];
  }

  for (const label of [...collectLabels(fig.given), ...collectLabels(fig.steps)]) {
    if (!labelIsFromText(label, ctx.problemText)) reasons.push(`label "${label}" does not come from the problem text`);
  }

  const points: Record<string, Pt> = {};
  for (const p of solved.points) points[p.id] = { x: p.x, y: p.y };
  const circles: Record<string, { cx: number; cy: number; r: number }> = {};
  for (const c of solved.circles) {
    const ctr = points[c.center];
    if (ctr) circles[c.center] = { cx: ctr.x, cy: ctr.y, r: c.radius };
  }
  for (const g of [...fig.given, ...fig.steps] as Array<{ id?: string; center?: string; kind?: string }>) {
    if (g.id && g.center && circles[g.center] && (g.kind === 'circle' || g.kind?.startsWith('circle') || g.kind === 'incircle' || g.kind === 'circumcircle')) {
      circles[g.id] = circles[g.center];
    }
  }
  reasons.push(...checkClaims(points, circles, ctx.claims));

  // Every single-capital point the figure description names must be drawn.
  const desc = /\[Figure:([^\]]*)\]/.exec(ctx.problemText)?.[1] ?? '';
  const stripped = desc.replace(/(^|[.:]\s+)(A|I)\s+(?=[a-z])/g, '$1');
  const named = new Set(stripped.match(/(?<![A-Za-z0-9'])[A-Z](?![A-Za-z0-9'])/g) ?? []);
  for (const n of named) if (!points[n]) reasons.push(`point ${n} is in the figure description but not drawn`);
  return reasons;
}

// ---------------------------------------------------------------- graph

function validateGraph(data: GraphData, ctx: FigureContext): string[] {
  const reasons: string[] = [];
  const fns = data.functions ?? [];
  for (const f of fns) {
    if (f.label) reasons.push(`legend label "${f.label}" is not allowed on a homework graph (the problem panel shows the text)`);
  }

  const ySpan = Math.abs(data.yRange[1] - data.yRange[0]) || 1;
  const tol = 1e-3 * ySpan;
  const evals = fns.map((f) => {
    const src = f.expr || f.latex || f.fn || '';
    // parseFunctionString does not insert the '*' in "3sin(2x)" (its function-name
    // lookbehind rejects a leading digit), so make the multiplication explicit first.
    const explicit = src.replace(/([\dx)])\s*(?=\\?(?:sin|cos|tan|sqrt|abs|log)\b)/g, '$1*').replace(/\\(?=(?:sin|cos|tan|sqrt|abs|log)\b)/g, '');
    return { fn: src ? parseFunctionString(explicit) : null, domain: f.domain };
  });
  for (const p of data.points ?? []) {
    const atAxis = Math.abs(p.x) <= tol || Math.abs(p.y) <= tol;
    const onCurve = evals.some((e) => {
      if (!e.fn) return false;
      if (e.domain && (p.x < e.domain[0] - 1e-9 || p.x > e.domain[1] + 1e-9)) return false;
      const y = e.fn(p.x);
      return Number.isFinite(y) && Math.abs(y - p.y) <= tol;
    });
    if (!onCurve && !atAxis) reasons.push(`point (${fmt(p.x)}, ${fmt(p.y)}) is not on any plotted function or axis intercept`);
    if (p.label && !labelIsFromText(p.label, ctx.problemText)) reasons.push(`label "${p.label}" does not come from the problem text`);
  }
  const vp = validateFunctionValuePoints(data);
  if (!vp.ok) reasons.push(vp.reason);

  if (/axis/i.test(ctx.problemText) && /(π|\bpi\b)/i.test(ctx.problemText) && !isPiStep(parseAxisStep(data.xAxisStep))) {
    reasons.push('x axis is marked in multiples of pi on the sheet but xAxisStep is not a pi step (e.g. "pi/2")');
  }
  return reasons;
}

// ---------------------------------------------------------------- entry

export function validateFigure(figure: FigureCommand | null, ctx: FigureContext): FigureVerdict {
  if (!figure) return { ok: true };
  const reasons = figure.action === 'showGraph'
    ? validateGraph(figure.data, ctx)
    : validateGeometry(figure, ctx);
  return reasons.length ? { ok: false, reasons } : { ok: true };
}
