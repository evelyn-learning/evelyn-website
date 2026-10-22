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

/** Clause boundaries: a value must be in the same clause as its NAME. */
const BOUNDARY = new Set([',', ';', ')', ']']);
/** Words allowed between NAME and VALUE in a label (plus the = : operators). */
const LABEL_LINKS = new Set(['is', 'measures', 'of']);

/**
 * Words of the text, the = : operators, and clause boundaries (, ; ) ] and a
 * sentence-ending period). A leading minus is kept when part of a number.
 */
function tokenize(s: string): string[] {
  const raw = normalise(s).match(/[A-Za-z0-9\u00b0\u03c0'\u2032.\-/]+|[=:,;()\[\]]/g) ?? [];
  const out: string[] = [];
  for (const r of raw) {
    if (r === '(') continue;
    if (BOUNDARY.has(r) || isOp(r)) { out.push(r); continue; }
    const t = r.replace(/^[.\/]+(?=[A-Za-z0-9])/, '').replace(/^-(?![0-9\u03c0.])/, '').replace(/[.\-/]+$/, '');
    if (t) out.push(t);
    if (r.length > 1 && r.endsWith('.')) out.push(';');
  }
  return out;
}

const isOp = (t: string) => t === '=' || t === ':';

const IDENT_RE = /^[A-Za-z][A-Za-z'\u2032]{0,2}$/;
const VALUE_RE = /^-?\d+(?:\.\d+)?(?:\/\d+)?(?:\u00b0|\u03c0)?[A-Za-z%\u00b0]*$|^-?\d*\u03c0(?:\/\d+)?$|^[A-Za-z]$/;
/** One whole word of a label: identifier / number / unit / pi fraction, optional leading minus. */
const LABEL_WORD_RE = /^-?[A-Za-z0-9\u00b0\u03c0'\u2032./]+$/;

/**
 * Does this label come from the problem text? Passes when it is
 * (a) a bare point name, (b) a bare value or single variable, or
 * (c) `NAME op VALUE` (op = : is measures of, or none) with VALUE in the same
 * clause, within 4 words after an occurrence of NAME. Anything else (sums,
 * products, computed values) fails.
 */
/**
 * 2026-10-21 (hw-10 problem 5): the proposer captioned a polygon "Rectangle
 * with semicircle cut out" and the whole figure was rejected for it. A label
 * of three or more words with no digit is a caption, not a value: it can
 * never leak an answer, so it is dropped from the figure instead of failing
 * it. Two words ("DE = 9" is three tokens but carries a digit) stay labels.
 */
export function isCaptionLabel(label: string): boolean {
  const l = String(label ?? '').trim();
  if (/[\d=+−×÷*/^<>≤≥≠∠∥⊥°√π%]/.test(l)) return false;   // a relation or a value is a label (a hyphen inside "quarter-circle" is not)
  return l.split(/\s+/).filter((w) => /^[A-Za-z]{2,}$/.test(w)).length >= 3;
}

export function labelIsFromText(label: string, problemText: string): boolean {
  const l = normalise(label).replace(/([=:])/g, ' $1 ').replace(/\s+/g, ' ').trim();
  if (!l) return true;
  const pieces = l.split(' ');
  // GAC acceptance 2026-10-21 (worksheet3_photo): the sheet labels its angles
  // "(5x + 10)°" and "(8x − 56)°", written exactly so in the problem text, and
  // the token rule below (name/value, NAME = VALUE) has no shape for an
  // expression — six of eight figures were dropped for it. A label of two or
  // more pieces that appears verbatim in the text (case and spacing aside) is
  // from the text by definition. A single token keeps the word rule: "8" must
  // be a word of the text, not a digit inside one.
  if (pieces.length >= 2 && phraseInText(l, problemText)) return true;
  if (!pieces.every((w) => isOp(w) || LABEL_WORD_RE.test(w))) return false;
  const toks = tokenize(problemText);
  const words = new Set(toks.filter((t) => !isOp(t) && !BOUNDARY.has(t) && t !== ';'));
  if (pieces.length === 1) {
    const w = pieces[0];
    return (IDENT_RE.test(w) || VALUE_RE.test(w)) && words.has(w);
  }
  const parts = pieces.filter((w) => !isOp(w) && !LABEL_LINKS.has(w));
  const ops = pieces.filter((w) => isOp(w) || LABEL_LINKS.has(w));
  if (parts.length !== 2 || ops.length > 1 || pieces.length > 3) return false;
  const [name, value] = parts;
  if (pieces[0] !== name || pieces[pieces.length - 1] !== value) return false;
  for (let i = 0; i < toks.length; i++) {
    if (toks[i] !== name) continue;
    const after: string[] = [];
    for (let j = i + 1; j < toks.length && after.length < 4; j++) {
      if (BOUNDARY.has(toks[j]) || toks[j] === ';') break;
      if (!isOp(toks[j])) after.push(toks[j]);
    }
    if (after.includes(value)) return true;
  }
  return false;
}

/**
 * A free-text figure field (a title, an axis label, an annotation): passes
 * when it is a label `labelIsFromText` accepts, or a whole phrase of the
 * problem text (case and spacing aside). A value the text does not state —
 * an answer — fails either way.
 */
export function textFieldIsFromText(field: string, problemText: string): boolean {
  if (labelIsFromText(field, problemText)) return true;
  return phraseInText(normalise(field), problemText);
}

/** `phrase` occurs in the text as a whole phrase: not inside a longer word or number, case and spacing aside. */
function phraseInText(phrase: string, problemText: string): boolean {
  const f = phrase.toLowerCase();
  if (!f) return true;
  const esc = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
  return new RegExp(`(?<![A-Za-z0-9])${esc}(?![A-Za-z0-9])`).test(normalise(problemText).toLowerCase());
}

/** Step kinds that place a point (shared with normalizeFigureDisplay). */
export const POINT_KINDS = new Set(['point', 'midpoint', 'intersect', 'section_point', 'point_on_circle', 'point_on_conic', 'triangle_center', 'reflect_point', 'rotate_point', 'translate_point', 'dilate_point']);

/** The single-capital point names a text uses, as whole tokens, with a
 *  sentence-initial article ("A square pyramid", "I ...") not counted — the
 *  hw-13 pyramid's helper point A came out lettered because of that article. */
export function namedPointsIn(text: string): Set<string> {
  // GAC acceptance 2026-10-22 (hw-14 p1): "V" shape — a quoted letter, a
  // letter-shape ("V-shaped", "an L shape") or "letter T" names a glyph, not a point.
  const noGlyphs = text
    // A point written in quotes ("A") is stripped on purpose (brief). A straight ' only
    // opens a quote when not glued to a word, so prime notation A'B'C' survives.
    .replace(/(?:["\u201C\u2018][A-Z]["\u201D\u2019]|(?<![A-Za-z0-9])'[A-Z]')/g, ' ')
    .replace(/(?<![A-Za-z0-9'])[A-Z](?:-| )shape(?:d)?(?![A-Za-z])/g, ' ')
    .replace(/\bletter\s+[A-Z](?![A-Za-z0-9'])/gi, ' ');
  const stripped = noGlyphs.replace(/(^\s*|[.:\]]\s+)(A|I)\s+(?=[a-z])/g, '$1');
  return new Set(stripped.match(/(?<![A-Za-z0-9'])[A-Z](?![A-Za-z0-9'])/g) ?? []);
}

/** I4: every free-text field of a figure comes from the sheet; one-letter axis names always pass. */
function textFieldReasons(fields: Array<{ value: unknown; axis?: boolean }>, problemText: string): string[] {
  const out: string[] = [];
  for (const { value, axis } of fields) {
    if (typeof value !== 'string' || !value.trim()) continue;
    if (axis && /^\s*[A-Za-z]\s*$/.test(value)) continue;
    if (!textFieldIsFromText(value, problemText)) out.push(`label "${value}" does not come from the problem text`);
  }
  return out;
}

// ---------------------------------------------------------------- claims

type Pt = { x: number; y: number };

/** Failing-claim messages; [] when every claim holds. tol is relative to the
 *  figure's extent. 1e-3 (2026-10-21, GAC acceptance): the proposer writes
 *  given coordinates to two or three decimals, so a chord endpoint sat 0.003
 *  off its circle and a point 0.004 off its line at 1e-6 — a thousandth of
 *  the figure is invisible on the board and still catches a wrong figure. */
export function checkClaims(
  points: Record<string, Pt>,
  circles: Record<string, { cx: number; cy: number; r: number }>,
  claims: FigureClaim[],
  tol = 1e-3,
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
    // 2026-10-21 (hw-10 problem 4): the claims reader named the cone's "apex",
    // "center" and "edge" — words of the sheet, not point ids — and the
    // figure failed for points it could never have. A claim on a prose word
    // cannot be checked against any drawing, so it is skipped; a missing
    // letter id (B, P1) is still a point the figure forgot.
    if (gone.some((id) => /^[a-z]{3,}$/.test(id))) continue;
    if (gone.length) { out.push(`${c.kind} claim names ${gone.join(', ')} but the solver has no such point`); continue; }

    if (c.kind === 'on_segment' || c.kind === 'between') {
      const [a, b] = c.kind === 'on_segment' ? c.segment : c.ends;
      const { off, t } = lineDist(points[c.point], points[a], points[b]);
      if (off > dtol) out.push(`${c.kind === 'between' ? 'between' : 'on_segment'} ${c.point} [${a},${b}] fails: ${c.point} is ${fmt(off)} off the line`);
      else if (t < -tol || t > 1 + tol) out.push(`${c.kind === 'between' ? 'between' : 'on_segment'} ${c.point} [${a},${b}] fails: ${c.point} is outside the segment`);
    } else if (c.kind === 'on_circle') {
      // The claims pass names a circle the way the sheet does ("the circle",
      // "circle O"); with one circle in the figure that is the one it means.
      const ids = Object.keys(circles);
      const circ = circles[c.circle] ?? (ids.length === 1 ? circles[ids[0]] : undefined);
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
  if (!Array.isArray(fig.given) || !Array.isArray(fig.steps)) return ['malformed figure: given and steps must both be arrays'];
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
    if (isCaptionLabel(label)) continue;   // dropped by normalizeFigureDisplay, never a value
    if (!labelIsFromText(label, ctx.problemText)) reasons.push(`label "${label}" does not come from the problem text`);
  }
  // GAC acceptance 2026-10-22 (hw-13 p1): "(3x − 5)°" was placed as a bare
  // labelled point near C, so the board showed an angle value with no angle.
  // A label with a degree sign is an angle label and belongs on an angle_marker.
  for (const o of [...fig.given, ...fig.steps] as Array<{ kind?: unknown; label?: unknown }>) {
    if (o && typeof o.kind === 'string' && POINT_KINDS.has(o.kind) && typeof o.label === 'string' && /°/.test(o.label)) {
      reasons.push(`angle label "${o.label}" is on a bare point; attach it to an angle_marker at its vertex`);
    }
  }
  reasons.push(...textFieldReasons([{ value: fig.title }], ctx.problemText));

  const points: Record<string, Pt> = {};
  for (const p of solved.points) points[p.id] = { x: p.x, y: p.y };
  // Circles are keyed by their step/given id: match each spec circle to a solved one by centre (and radius when given).
  const circles: Record<string, { cx: number; cy: number; r: number }> = {};
  const centerAlias = new Map<string, string | null>();
  const used = new Set<number>();
  for (const g of [...fig.given, ...fig.steps] as Array<{ id?: string; center?: string; radius?: number; kind?: string }>) {
    if (!g.id || typeof g.center !== 'string' || !/circle/.test(g.kind ?? '')) continue;
    const idx = solved.circles.findIndex((c, i) => !used.has(i) && c.center === g.center && (g.radius === undefined || Math.abs(c.radius - g.radius) < 1e-9));
    const ctr = points[g.center];
    if (idx < 0 || !ctr) continue;
    used.add(idx);
    circles[g.id] = { cx: ctr.x, cy: ctr.y, r: solved.circles[idx].radius };
    // 2026-10-21 (hw-11 problem 5, "quarter circles centered at A and C"): the
    // claims reader names a circle by its centre ("circle A"). When no shape
    // carries that id, the centre's name reaches its circle — one circle per
    // centre; a second circle on the same centre makes the name ambiguous.
    if (!circles[g.center]) {
      if (centerAlias.has(g.center)) centerAlias.set(g.center, null); else centerAlias.set(g.center, g.id);
    }
  }
  for (const [center, id] of centerAlias) if (id && !circles[center]) circles[center] = circles[id];
  reasons.push(...checkClaims(points, circles, ctx.claims));

  // Every single-capital point the figure description names must be drawn.
  const desc = /\[Figure:([^\]]*)\]/.exec(ctx.problemText)?.[1] ?? '';
  const named = namedPointsIn(desc);
  for (const n of named) if (!points[n]) reasons.push(`point ${n} is in the figure description but not drawn`);
  return reasons;
}

// ---------------------------------------------------------------- graph

/** A graph function's source as parseFunctionString reads it: π → pi with its
 *  products explicit ("2π" → "2*pi", "πx" → "pi*x"), and "3sin(2x)" → "3*sin(2x)"
 *  (the parser's function-name lookbehind rejects a leading digit). */
export function explicitFunctionSource(src: string): string {
  return src.replace(/π/g, 'pi').replace(/([\d)])\s*(?=pi\b)/g, '$1*').replace(/\bpi(?=[A-Za-z(])/g, 'pi*')
    .replace(/([\dx)])\s*(?=\\?(?:sin|cos|tan|sqrt|abs|log)\b)/g, '$1*').replace(/\\(?=(?:sin|cos|tan|sqrt|abs|log)\b)/g, '');
}

/** The source of a graph function, whichever field the proposer used. */
export const functionSourceOf = (f: { expr?: string; latex?: string; fn?: string; expression?: string }): string => f.expr || f.latex || f.fn || f.expression || '';

/** What the board's graph renderer draws (GraphData). Anything else the proposer invents — hw-11 problem 6 sent a box plot as `segments` — is not drawn, so the figure would be empty axes. */
const GRAPH_DATA_FIELDS = new Set(['title', 'xLabel', 'yLabel', 'xRange', 'yRange', 'xAxisStep', 'yAxisStep', 'functions', 'functionsOfY', 'points', 'annotations', 'shadedRegion', 'inequalities']);

function validateGraph(data: GraphData, ctx: FigureContext): string[] {
  const reasons: string[] = [];
  const unknown = Object.keys(data ?? {}).filter((k) => !GRAPH_DATA_FIELDS.has(k));
  if (unknown.length) reasons.push(`graph field${unknown.length > 1 ? 's' : ''} ${unknown.map((k) => `"${k}"`).join(', ')} cannot be drawn: a graph holds functions, functionsOfY, points, annotations, shadedRegion and inequalities only; a figure the graph vocabulary cannot express returns figure_json ""`);
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
    // 2026-10-21 (hw-10 problem 8): the sheet writes π, and so did the proposer
    // ("-2cos(πx/2)+3"); the parser knows only "pi", so every point read as off
    // the curve. π becomes pi with its products made explicit ("2π" → "2*pi",
    // "πx" → "pi*x") before the function-name pass.
    return { fn: src ? parseFunctionString(explicitFunctionSource(src)) : null, domain: f.domain };
  });
  for (const p of data.points ?? []) {
    const onCurve = evals.some((e) => {
      if (!e.fn) return false;
      if (e.domain && (p.x < e.domain[0] - 1e-9 || p.x > e.domain[1] + 1e-9)) return false;
      const y = e.fn(p.x);
      return Number.isFinite(y) && Math.abs(y - p.y) <= tol;
    });
    if (!onCurve) reasons.push(`point (${fmt(p.x)}, ${fmt(p.y)}) is not on any plotted function (roots and y-intercepts count only when the curve passes through them)`);
    if (p.label && !labelIsFromText(p.label, ctx.problemText)) reasons.push(`label "${p.label}" does not come from the problem text`);
  }
  reasons.push(...textFieldReasons([
    { value: data.title },
    { value: data.xLabel, axis: true },
    { value: data.yLabel, axis: true },
    ...(data.annotations ?? []).map((a) => ({ value: a?.label })),
  ], ctx.problemText));
  const vp = validateFunctionValuePoints(data);
  if (!vp.ok) reasons.push(vp.reason);

  if (/axis/i.test(ctx.problemText) && /(π|\bpi\b)/i.test(ctx.problemText) && !isPiStep(parseAxisStep(data.xAxisStep))) {
    reasons.push('x axis is marked in multiples of pi on the sheet but xAxisStep is not a pi step (e.g. "pi/2")');
  }
  return reasons;
}

// ---------------------------------------------------------------- entry

function validateFigureUnsafe(figure: FigureCommand | null, ctx: FigureContext): FigureVerdict {
  if (!figure) return { ok: true };
  const reasons = figure.action === 'showGraph'
    ? validateGraph(figure.data, ctx)
    : validateGeometry(figure, ctx);
  return reasons.length ? { ok: false, reasons } : { ok: true };
}

/** Total: malformed model output yields a failing verdict, never a throw. */
export function validateFigure(figure: FigureCommand | null, ctx: FigureContext): FigureVerdict {
  try {
    return validateFigureUnsafe(figure, ctx);
  } catch (e) {
    return { ok: false, reasons: [`malformed figure: ${(e as Error).message}`] };
  }
}
