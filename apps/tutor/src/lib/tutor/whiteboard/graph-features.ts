/**
 * Labelled points of a function graph as addressable board features.
 *
 * Live 2026-10-06 (portal-897212b5): the tutor painted a graph with a point
 * labelled "origin" and then scribbled on "origin". The graph registered ONE
 * whole-item, non-scribbleable feature, so the resolver's newest-first search
 * skipped it and matched the "origin" every coordinate plane declares — on a
 * page drawn eight minutes earlier — and the board was switched away from the
 * graph the tutor had just shown.
 *
 * One function builds the names for BOTH sides so they cannot drift:
 *   - manifests.ts registers them in the catalog (so "origin" resolves ON the
 *     graph), and
 *   - DesmosGraphRenderer positions a transparent `data-feature` mark over
 *     each plotted point (so the scribble overlay can find it; the overlay's
 *     HTML mode resolves any `[data-feature]` element by its rectangle).
 *
 * Pure — no DOM.
 */

import { shortLabelSlug } from '@/lib/tutor/diagrams/layout';
import { inequalityEntryText, normalizeLineStyle, parseXYExpression, parseXYRelation } from './graph-inequalities';

export interface GraphPointFeature {
  /** `data-feature` value / catalog canonical name. */
  name: string;
  x: number;
  y: number;
  /** The point's own label, if it has one. */
  label?: string;
  /** Everything that should resolve to this point. */
  labels: string[];
  description: string;
}

const MAX_POINT_FEATURES = 12;

const coord = (n: number): string => String(Math.round(n * 1000) / 1000);

export function graphPointFeatures(points: unknown): GraphPointFeature[] {
  if (!Array.isArray(points)) return [];
  const out: GraphPointFeature[] = [];
  const used = new Set<string>();
  points.forEach((raw, i) => {
    if (out.length >= MAX_POINT_FEATURES) return;
    const p = (raw ?? {}) as { x?: unknown; y?: unknown; label?: unknown };
    if (typeof p.x !== 'number' || typeof p.y !== 'number' || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    const label = typeof p.label === 'string' && p.label.trim() ? p.label.trim() : undefined;
    const slug = label ? shortLabelSlug(label) : '';
    let name = slug && slug !== 'unnamed' ? `point-${slug}` : `point-${i + 1}`;
    if (used.has(name)) name = `${name}-${i + 1}`;
    used.add(name);
    const at = `(${coord(p.x)}, ${coord(p.y)})`;
    const labels = new Set<string>([name, at, `point ${at}`]);
    if (label) {
      labels.add(label);
      labels.add(`point ${label}`);
    }
    if (p.x === 0 && p.y === 0) {
      labels.add('origin');
      labels.add('the origin');
    }
    out.push({
      name,
      x: p.x,
      y: p.y,
      label,
      labels: Array.from(labels),
      description: label ? `point "${label}" at ${at}` : `point at ${at}`,
    });
  });
  return out;
}

// ── plots and inequalities as features (2026-10-06b) ────────────────────────
//
// portal-10beb4f5 (voice): the tutor ticked "(1/3)x - 2/3 (y = (1/3)x - 2/3)"
// and "y = -2x + 4" — strings copied from the graph's own board description.
// The graph offered no such feature, so each resolved (by loose token match)
// to an OLDER equation card and the view was scrolled off the graph the
// student was looking at. A graph's plots and inequalities are now features
// of that graph: the catalog resolves the brain's string to the graph (an
// exact label on the newest item wins), and the renderer lays a transparent
// `data-feature` mark on a point of the curve that is in view.

export interface GraphCurveFeature {
  /** `data-feature` value / catalog canonical name ("plot-1", "inequality-2"). */
  name: string;
  kind: 'plot' | 'inequality';
  /** Everything that should resolve to this curve. */
  labels: string[];
  description: string;
  /** Short name for the mark's caption. */
  displayName: string;
  /** A point ON the curve inside the given window, or null when the curve
   *  does not pass through it. */
  anchor(w: { left: number; right: number; bottom: number; top: number }): { x: number; y: number } | null;
}

const MAX_CURVE_FEATURES = 8;
/** Where along the visible x-range to look for a point on the curve, in
 *  order; staggered per curve so two lines are not marked at their crossing. */
const ANCHOR_FRACTIONS = [0.8, 0.2, 0.65, 0.35, 0.9, 0.1, 0.5];

function textOf(f: unknown): { expr: string; label?: string; dashed: boolean } {
  if (typeof f === 'string') return { expr: f.trim(), dashed: false };
  if (!f || typeof f !== 'object') return { expr: '', dashed: false };
  const o = f as { expr?: unknown; latex?: unknown; fn?: unknown; label?: unknown; lineStyle?: unknown };
  const expr = [o.expr, o.latex, o.fn].find((v): v is string => typeof v === 'string' && v.trim() !== '') ?? '';
  return {
    expr: expr.trim(),
    ...(typeof o.label === 'string' && o.label.trim() ? { label: o.label.trim() } : {}),
    dashed: normalizeLineStyle(o.lineStyle) === 'dashed',
  };
}

function anchorOnGraphOf(evaluate: (t: number) => number, variable: 'x' | 'y', slot: number): GraphCurveFeature['anchor'] {
  return (w) => {
    const [lo, hi] = variable === 'x' ? [w.left, w.right] : [w.bottom, w.top];
    const [vlo, vhi] = variable === 'x' ? [w.bottom, w.top] : [w.left, w.right];
    const pad = (vhi - vlo) * 0.06;
    for (let k = 0; k < ANCHOR_FRACTIONS.length; k++) {
      const frac = ANCHOR_FRACTIONS[(k + slot) % ANCHOR_FRACTIONS.length];
      const t = lo + frac * (hi - lo);
      const v = evaluate(t);
      if (!Number.isFinite(v) || v < vlo + pad || v > vhi - pad) continue;
      return variable === 'x' ? { x: t, y: v } : { x: v, y: t };
    }
    return null;
  };
}

/**
 * The plots (`functions`, `functionsOfY`) and `inequalities` of a graph as
 * features. One builder for the catalog (manifests.ts) and the renderer.
 */
export function graphCurveFeatures(data: unknown): GraphCurveFeature[] {
  if (!data || typeof data !== 'object') return [];
  const d = data as { functions?: unknown; functionsOfY?: unknown; inequalities?: unknown };
  const out: GraphCurveFeature[] = [];
  const push = (f: GraphCurveFeature) => { if (out.length < MAX_CURVE_FEATURES) out.push(f); };
  let slot = 0;
  const plots: Array<[unknown, 'x' | 'y']> = [
    ...(Array.isArray(d.functions) ? d.functions : []).map((f): [unknown, 'x' | 'y'] => [f, 'x']),
    ...(Array.isArray(d.functionsOfY) ? d.functionsOfY : []).map((f): [unknown, 'x' | 'y'] => [f, 'y']),
  ];
  plots.forEach(([f, variable], i) => {
    const { expr, label, dashed } = textOf(f);
    if (!expr) return;
    const body = expr.replace(/^\s*[yYxX]\s*=\s*/, '');
    const parsed = parseXYExpression(body);
    const dep = variable === 'x' ? 'y' : 'x';
    const labels = new Set<string>([`plot-${i + 1}`, expr, body, `${dep} = ${body}`]);
    if (label) {
      labels.add(label);
      // The exact forms the board description prints for this plot.
      labels.add(`${expr} (${label})`);
      labels.add(`${expr} (${label}) [dashed]`);
      labels.add(`the line ${label}`);
      labels.add(`line ${label}`);
    }
    const usable = parsed.ok && !(variable === 'x' ? parsed.usesY : parsed.usesX);
    push({
      name: `plot-${i + 1}`,
      kind: 'plot',
      labels: Array.from(labels),
      description: `plotted ${dashed ? 'dashed ' : ''}curve ${label ?? `${dep} = ${body}`}`,
      displayName: label ?? `${dep} = ${body}`,
      anchor: usable
        ? anchorOnGraphOf((t) => (variable === 'x' ? parsed.evaluate(t, 0) : parsed.evaluate(0, t)), variable, slot++)
        : () => null,
    });
  });
  let n = 0;
  for (const entry of Array.isArray(d.inequalities) ? d.inequalities : []) {
    const text = inequalityEntryText(entry);
    const p = text ? parseXYRelation(text) : null;
    if (!p || !p.ok) continue;
    n++;
    const rel = p.relation;
    const label = entry && typeof entry === 'object' && typeof (entry as { label?: unknown }).label === 'string'
      ? ((entry as { label: string }).label.trim() || undefined) : undefined;
    const labels = new Set<string>([`inequality-${n}`, rel.pretty, rel.source, text.trim()]);
    if (label) { labels.add(label); labels.add(`${rel.pretty} (${label})`); }
    // The boundary a·x + b·y + c = 0, when straight and not vertical: y on it.
    const diff = rel.boundaries[0].diff;
    const c0 = diff(0, 0), a = diff(1, 0) - c0, b = diff(0, 1) - c0;
    const straight = [a, b, c0].every(Number.isFinite) && Math.abs(diff(2.3, -1.7) - (a * 2.3 + b * -1.7 + c0)) < 1e-7;
    const mySlot = slot++;
    push({
      name: `inequality-${n}`,
      kind: 'inequality',
      labels: Array.from(labels),
      description: `inequality ${rel.pretty}${label ? ` (${label})` : ''} — its ${rel.strict ? 'dashed' : 'solid'} boundary line`,
      displayName: label ?? rel.pretty,
      anchor: straight && Math.abs(b) > 1e-12
        ? anchorOnGraphOf((x) => -(a * x + c0) / b, 'x', mySlot)
        : straight && Math.abs(a) > 1e-12
          ? anchorOnGraphOf(() => -c0 / a, 'y', mySlot)
          : () => null,
    });
  }
  return out;
}
