/**
 * Deterministic gate for a model-proposed homework figure. A figure shown to
 * a student is always one the solver resolved and whose labels all come from
 * the sheet; otherwise no figure. Pure: no I/O, no model calls.
 */

import { solveGeometry, type ConstructedGeometrySpec } from '../diagrams/geometry-solver';
import { validateFunctionValuePoints } from '../whiteboard/graph-consistency-validator';
import { parseFunctionString } from '../whiteboard/math-expr';
import { parseAxisStep, isPiStep } from '../whiteboard/graph-axis';
import { functionSourceOf } from '../whiteboard/graph-function-source';
import type { GraphData } from '@core/knowledge/types';
import type { FigureClaim, FigureCommand } from './types';
import { isCaptionLabel, labelIsFromText, textFieldIsFromText, textFieldReasons } from './figure-text';
import { figureKindId, isFigureKindAllowed, type FigureVocabulary } from './figure-vocabulary';
import { validateNumberLineFigure, validateScatterFigure, validateStatsFigure, validateTableFigure, validateFractionBarFigure, validateTreeFigure, validateVennFigure } from './figure-validate-data';
import { validateDiagramFigure } from './figure-validate-diagram';

/** Re-exported so existing imports from figure-validate keep working. */
export { isCaptionLabel, labelIsFromText, textFieldIsFromText };

/** vocabulary defaults to 'all' (HOMEWORK_FIGURE_KINDS unset). */
export interface FigureContext { problemText: string; claims: FigureClaim[]; vocabulary?: FigureVocabulary }
export type FigureVerdict = { ok: true } | { ok: false; reasons: string[] };

const fmt = (n: number) => String(parseFloat(n.toPrecision(3)));

// ---------------------------------------------------------------- labels

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


// ---------------------------------------------------------------- claims

type Pt = { x: number; y: number };

/** The shape of a point id (B, P1, AB, P12, A', P1'); any other unresolved claim name is a word. */
const BARE_ID = /^[A-Z]{1,2}\d*['\u2032]*$/;
/** A single-letter point id (E, P1, A'): the only missing name a position claim fails on. */
const SINGLE_POINT_ID = /^[A-Z]\d?['\u2032]?$/;
const POSITION_KINDS = new Set<FigureClaim['kind']>(['left_of', 'right_of', 'above', 'below']);

/** A point name folded for matching a label: lower case, letters, digits and
 *  primes only ("Boat 1" → "boat1", "A′" → "a'"). The prime stays so A' and A
 *  never fold together (a transformation sheet names both). */
const foldName = (s: string) => String(s ?? '').toLowerCase().replace(/\u2032/g, "'").replace(/[^a-z0-9']/g, '');

function resolveClaim(c: FigureClaim, r: (n: string) => string): FigureClaim {
  const two = (p: [string, string]): [string, string] => [r(p[0]), r(p[1])];
  switch (c.kind) {
    case 'on_segment': return { ...c, point: r(c.point), segment: two(c.segment) };
    case 'on_circle': return { ...c, point: r(c.point) };
    case 'parallel': case 'perpendicular': return { ...c, a: two(c.a), b: two(c.b) };
    case 'collinear': return { ...c, points: c.points.map(r) };
    case 'between': return { ...c, point: r(c.point), ends: two(c.ends) };
    case 'left_of': case 'right_of': case 'above': case 'below': return { ...c, point: r(c.point), of: r(c.of) };
    default: return c;
  }
}

/** Failing-claim messages; [] when every claim holds. polygons are the solved
 *  polygons' vertex ids: a collinear claim over one polygon's vertices is
 *  skipped (hw-14b p4). tol is relative to the
 *  figure's extent. 1e-3 (2026-10-21, GAC acceptance): the proposer writes
 *  given coordinates to two or three decimals, so a chord endpoint sat 0.003
 *  off its circle and a point 0.004 off its line at 1e-6 — a thousandth of
 *  the figure is invisible on the board and still catches a wrong figure.
 *  nameToId maps a point id or a folded point label (foldName) to its id, or
 *  to null when two points' labels fold alike (ambiguous: left unresolved); a
 *  claim name resolves through it, and with no map a name is its own id. */
export function checkClaims(
  points: Record<string, Pt>,
  circles: Record<string, { cx: number; cy: number; r: number }>,
  claims: FigureClaim[],
  tol = 1e-3,
  nameToId: ReadonlyMap<string, string | null> = new Map(),
  polygons: ReadonlyArray<ReadonlyArray<string>> = [],
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

  const resolve = (n: string) => {
    if (points[n]) return n;
    const exact = nameToId.get(n);
    if (exact !== undefined) return exact ?? n;   // null: ambiguous, unresolved
    return nameToId.get(foldName(n)) ?? n;
  };
  for (const raw of claims) {
    const c = resolveClaim(raw, resolve);
    const ids = c.kind === 'on_segment' ? [c.point, ...c.segment]
      : c.kind === 'on_circle' ? [c.point]
      : c.kind === 'parallel' || c.kind === 'perpendicular' ? [...c.a, ...c.b]
      : c.kind === 'collinear' ? c.points
      : c.kind === 'between' ? [c.point, ...c.ends]
      : [c.point, c.of];
    const gone = missing(ids);
    // 2026-10-21 (hw-10 problem 4): the claims reader named the cone's "apex",
    // "center" and "edge" — words of the sheet, not point ids — and the
    // figure failed for points it could never have. A claim on a prose word
    // cannot be checked against any drawing, so it is skipped; a missing
    // letter id (B, P1) is still a point the figure forgot.
    // GAC acceptance 2026-10-22 (hw-14 problem 3, the lighthouse): the claims
    // named "Boat1", "Base", "Boat2" — the sheet's words, in any case — while
    // the figure drew P1/P2 labelled "Boat 1"/"Boat 2". A name now resolves
    // by its point's label first (above); what still matches nothing and is
    // not an id shape (Q, P3, AB) is a word, and its claim is skipped.
    if (gone.some((id) => !BARE_ID.test(id))) continue;
    // Final review (finding 1): "E is right of segment AB" — a phrasing the read
    // sentence invites — named AB as a point; the proposer cannot satisfy such a
    // claim by redrawing, so both attempts died and the problem lost its figure.
    // A position claim checks only single-letter points (E, P1, A'); any other
    // missing name (AB, a segment or line) is skipped. Other kinds keep BARE_ID.
    if (POSITION_KINDS.has(c.kind) && gone.some((id) => !SINGLE_POINT_ID.test(id))) continue;
    if (gone.length) { out.push(`${c.kind} claim names ${gone.join(', ')} but the solver has no such point`); continue; }
    // GAC acceptance 2026-10-22 (hw-14b p4): the claims read turned the
    // parallelogram's angle names (DAB, ABC, BCD, ADC) into collinear triples.
    // Points that are all vertices of one declared polygon are never collinear
    // (the polygon would be degenerate), so such a claim is the reader's error,
    // not the figure's: it is skipped. Both attempts had died on it, since the
    // claims are unioned once and a redraw cannot change them.
    if (c.kind === 'collinear' && polygons.some((poly) => c.points.every((p) => poly.includes(p)))) continue;

    if (c.kind === 'on_segment' || c.kind === 'between') {
      const [a, b] = c.kind === 'on_segment' ? c.segment : c.ends;
      const { off, t } = lineDist(points[c.point], points[a], points[b]);
      if (off > dtol) out.push(`${c.kind === 'between' ? 'between' : 'on_segment'} ${c.point} [${a},${b}] fails: ${c.point} is ${fmt(off)} off the line`);
      else if (t < -tol || t > 1 + tol) out.push(`${c.kind === 'between' ? 'between' : 'on_segment'} ${c.point} [${a},${b}] fails: ${c.point} is outside the segment`);
    } else if (c.kind === 'on_circle') {
      // The claims pass names a circle the way the sheet does ("the circle",
      // "circle O"); with one circle in the figure that is the one it means.
      // 2026-10-22 (hw-14 p2): a circle is registered under its id and its
      // centre's name, so "one circle" counts distinct circles, not names; a
      // name that matches a key only after folding ("CC" for "cc") reaches it.
      const distinct = [...new Set(Object.values(circles))];
      const folded = [...new Set(Object.keys(circles).filter((k) => foldName(k) === foldName(c.circle)).map((k) => circles[k]))];
      const circ = circles[c.circle] ?? (folded.length === 1 ? folded[0] : undefined)
        ?? (distinct.length === 1 ? distinct[0] : undefined);
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
    } else {
      // GAC acceptance 2026-10-22 (hw-14b p1, G1): the read said E is right of
      // A and B; the drawing put E on the left (a mirrored figure). y is up
      // (the solver's convention; the renderer flips it in makeTransform).
      const horizontal = c.kind === 'left_of' || c.kind === 'right_of';
      const d = horizontal ? points[c.point].x - points[c.of].x : points[c.point].y - points[c.of].y;
      const holds = c.kind === 'right_of' || c.kind === 'above' ? d > dtol : d < -dtol;
      if (!holds) {
        const actual = Math.abs(d) <= dtol ? 'level with' : horizontal ? (d < 0 ? 'left of' : 'right of') : (d < 0 ? 'below' : 'above');
        out.push(`${c.kind} ${c.point} ${c.of} fails: ${c.point} is ${actual} ${c.of}`);
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
  // G5 (2026-10-22, hw-14b p5): a `region` names the shapes it shades between by
  // id. One naming an id the figure never declares is reported by name, before
  // the solver's own refusal (which would read as a step trace: 'region "shade":
  // outer names c9 …'), so the retry feedback says exactly which name is wrong.
  const declared = new Set<string>();
  for (const o of [...fig.given, ...fig.steps] as Array<{ id?: unknown }>) if (typeof o?.id === 'string') declared.add(o.id);
  for (const o of fig.steps as Array<{ kind?: unknown; id?: unknown; outer?: unknown; inner?: unknown }>) {
    if (o?.kind !== 'region') continue;
    const named = [o.outer, ...(Array.isArray(o.inner) ? o.inner : [])];
    for (const ref of named) {
      if (typeof ref === 'string' && !declared.has(ref)) reasons.push(`region "${String(o.id)}" names ${ref} but the figure has no such shape`);
    }
  }
  if (reasons.length) return reasons;
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
  // G7 (2026-10-22, hw-14b p3): a caption-like title ("Lighthouse and two
  // boats") is the proposer's own words, never the sheet's: normalizeFigureDisplay
  // drops it, so it is not checked. A title that is a label ("AB = 5") still is.
  if (!(typeof fig.title === 'string' && isCaptionLabel(fig.title))) {
    reasons.push(...textFieldReasons([{ value: fig.title }], ctx.problemText));
  }

  const points: Record<string, Pt> = {};
  for (const p of solved.points) points[p.id] = { x: p.x, y: p.y };
  // Circles are keyed by their step/given id: match each spec circle to a solved one by
  // id, else by centre (and radius when given). GAC acceptance 2026-10-22 (hw-14 p2): an
  // `incircle`/`circumcircle` step has no `center` field, so it matched nothing and the
  // claims on the incircle failed with "no such circle"; the solver now carries the id.
  const circles: Record<string, { cx: number; cy: number; r: number }> = {};
  const centerAlias = new Map<string, string | null>();
  const used = new Set<number>();
  const solvedCircle = (i: number) => {
    const c = solved.circles[i], ctr = points[c.center];
    return ctr ? { cx: ctr.x, cy: ctr.y, r: c.radius } : undefined;
  };
  for (const g of [...fig.given, ...fig.steps] as Array<{ id?: string; center?: string; radius?: number; kind?: string }>) {
    if (!g.id || !/circle/.test(g.kind ?? '')) continue;
    let idx = solved.circles.findIndex((c, i) => !used.has(i) && c.id === g.id);
    if (idx < 0 && typeof g.center === 'string') idx = solved.circles.findIndex((c, i) => !used.has(i) && c.center === g.center && (g.radius === undefined || Math.abs(c.radius - g.radius) < 1e-9));
    const circ = idx < 0 ? undefined : solvedCircle(idx);
    if (!circ) continue;
    used.add(idx);
    circles[g.id] = circ;
    const center = solved.circles[idx].center;
    // 2026-10-21 (hw-11 problem 5, "quarter circles centered at A and C"): the
    // claims reader names a circle by its centre ("circle A"). When no shape
    // carries that id, the centre's name reaches its circle — one circle per
    // centre; a second circle on the same centre makes the name ambiguous.
    if (!circles[center]) {
      if (centerAlias.has(center)) centerAlias.set(center, null); else centerAlias.set(center, g.id);
    }
  }
  // A solved circle no spec entry claimed is still a circle of the figure, under its own id.
  solved.circles.forEach((c, i) => {
    const circ = used.has(i) || !c.id || circles[c.id] ? undefined : solvedCircle(i);
    if (circ && c.id) circles[c.id] = circ;
  });
  for (const [center, id] of centerAlias) if (id && !circles[center]) circles[center] = circles[id];
  // G5 review (controller ruling R4): a region's inner shape outside, or straddling,
  // its outer would paint a union / XOR silently. Every hole vertex must lie inside
  // the outer: within r + dtol of the centre when the outer is a circle, inside the
  // polygon (even-odd ray cast, or within dtol of an edge) otherwise. dtol is the
  // claims tolerance (1e-3 of the figure's extent), so an inner shape that TOUCHES
  // the boundary (hw-14b p5: the inner square's vertices sit on the circle) still
  // passes. Not the polygon's bounding box: the box of the p5 inner diamond is the
  // whole outer square, so a circle straddling the diamond would have passed.
  {
    const xs = Object.values(points).map((p) => p.x), ys = Object.values(points).map((p) => p.y);
    // Final review (finding 3): the solver round2's every point it places, a circle
    // hole's 48 samples included — up to 0.005 per axis, 0.005·√2 ≈ 0.0071 off a
    // circle — so on a figure of extent < 7 a hole that touches the outer failed at
    // a sample. The floor 0.0075 covers that rounding for EVERY hole vertex (a
    // polygon's vertices are solver points too, rounded the same way); 0.0075 units
    // is invisible on the board and a hole that really pokes out still fails.
    const dtol = Math.max(0.0075, 1e-3 * Math.max(1e-9, Math.max(...xs, 0) - Math.min(...xs, 0), Math.max(...ys, 0) - Math.min(...ys, 0)));
    const steps = fig.steps as Array<{ kind?: unknown; id?: unknown; outer?: unknown; inner?: unknown }>;
    const inPolygon = (p: Pt, ring: Pt[]): boolean => {
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[i], b = ring[j];
        // Within dtol of the edge ab (between its ends): on the boundary counts as inside.
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1e-12;
        const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
        if (t >= -1e-9 && t <= 1 + 1e-9 && Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) / len <= dtol) return true;
        if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
      }
      return inside;
    };
    for (const r of solved.regions) {
      const step = steps.find((s) => s?.kind === 'region' && s.id === r.id);
      if (!step || typeof step.outer !== 'string') continue;
      const innerIds = Array.isArray(step.inner) ? step.inner as string[] : [];
      const circ = circles[step.outer];
      const ring = r.outer.map((id) => points[id]).filter(Boolean);
      const inside = (p: Pt) => (circ ? Math.hypot(p.x - circ.cx, p.y - circ.cy) <= circ.r + dtol : inPolygon(p, ring));
      r.holes.forEach((hole, i) => {
        const vs = hole.map((id) => points[id]).filter(Boolean);
        if (vs.length && !vs.every(inside)) reasons.push(`region "${r.id}" fails: inner ${innerIds[i] ?? '?'} is not inside outer ${step.outer}`);
      });
    }
  }
  // A claim may name a point by the sheet's word for it, the point's label (hw-14 p3).
  // Two points whose labels fold alike make the label ambiguous (null), like
  // centerAlias above: neither point is guessed.
  const nameToId = new Map<string, string | null>();
  for (const id of Object.keys(points)) nameToId.set(id, id);
  for (const o of [...fig.given, ...fig.steps] as Array<{ id?: unknown; label?: unknown }>) {
    if (typeof o?.id !== 'string' || !points[o.id] || typeof o.label !== 'string') continue;
    const k = foldName(o.label);
    if (!k) continue;
    const prev = nameToId.get(k);
    if (prev === undefined) nameToId.set(k, o.id); else if (prev !== o.id) nameToId.set(k, null);
  }
  reasons.push(...checkClaims(points, circles, ctx.claims, undefined, nameToId, solved.polygons.map((p) => p.vertices)));

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

/** The source of a graph function, whichever field the proposer used. The
 *  order is canonical in whiteboard/graph-function-source (the board reads it too). */
export { functionSourceOf };

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
    // Final review (F8): the same field order as the board renderers, so a
    // function written as `expression` is plotted here too.
    const src = functionSourceOf(f);
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

/** The validators of the kinds beyond geometry and function graphs, by kind
 *  id (figureKindId). Each kind task adds its own; a kind the vocabulary allows
 *  with no validator here is unsupported. */
const statsValidator = (figure: FigureCommand, ctx: FigureContext) => validateStatsFigure(figure as Extract<FigureCommand, { action: 'showStats' }>, ctx);
const diagramValidator = (figure: FigureCommand, ctx: FigureContext) => validateDiagramFigure(figure as Extract<FigureCommand, { action: 'showDiagram' }>, ctx);
const KIND_VALIDATORS: Record<string, (figure: FigureCommand, ctx: FigureContext) => string[]> = {
  'showStats:boxplot': statsValidator,
  'showStats:histogram': statsValidator,
  'showStats:dotplot': statsValidator,
  'showStats:bar': statsValidator,
  'showStats:pie': statsValidator,
  showTable: (figure, ctx) => validateTableFigure(figure as Extract<FigureCommand, { action: 'showTable' }>, ctx),
  showNumberLine: (figure, ctx) => validateNumberLineFigure(figure as Extract<FigureCommand, { action: 'showNumberLine' }>, ctx),
  showScatterPlot: (figure, ctx) => validateScatterFigure(figure as Extract<FigureCommand, { action: 'showScatterPlot' }>, ctx),
  showVennDiagram: (figure, ctx) => validateVennFigure(figure as Extract<FigureCommand, { action: 'showVennDiagram' }>, ctx),
  showTree: (figure, ctx) => validateTreeFigure(figure as Extract<FigureCommand, { action: 'showTree' }>, ctx),
  showFractionBar: (figure, ctx) => validateFractionBarFigure(figure as Extract<FigureCommand, { action: 'showFractionBar' }>, ctx),
  'showDiagram:solid_3d': diagramValidator,
  'showDiagram:tape_diagram': diagramValidator,
  'showDiagram:area_model': diagramValidator,
};

function validateFigureUnsafe(figure: FigureCommand | null, ctx: FigureContext): FigureVerdict {
  if (!figure) return { ok: true };
  // The kind gate comes first: a kind outside the vocabulary (HOMEWORK_FIGURE_KINDS)
  // is named, so the retry feedback says which kind to stop proposing.
  const id = figureKindId(figure);
  const unsupported: FigureVerdict = { ok: false, reasons: [`unsupported figure kind "${id}"`] };
  if (!isFigureKindAllowed(id, ctx.vocabulary ?? 'all')) return unsupported;
  let reasons: string[];
  if (figure.action === 'showGraph') reasons = validateGraph(figure.data, ctx);
  else if (figure.action === 'showGeometryConstructed') reasons = validateGeometry(figure, ctx);
  else {
    const validate = KIND_VALIDATORS[id];
    if (!validate) return unsupported;
    reasons = validate(figure, ctx);
  }
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
