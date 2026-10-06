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
 * Pure — no DOM, no imports beyond the slug helper.
 */

import { shortLabelSlug } from '@/lib/tutor/diagrams/layout';

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
