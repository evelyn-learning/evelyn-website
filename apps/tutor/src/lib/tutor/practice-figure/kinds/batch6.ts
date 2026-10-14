/**
 * Batch 6 of the practice-figure kinds (2026-10-15, GreenApple T2 — the older
 * seven subjects). One list and one dispatcher, as ./batch5.ts; each kind is a
 * pure function of a typed params object documented at the top of its module:
 *   coordinate_polygon (coordinate-polygon.ts) — polygons (a pre-image and its
 *     image) with labelled vertices on a numbered coordinate grid;
 *   stemplot (stemplot.ts) — a stem-and-leaf plot, single or back-to-back.
 */
import type { Drawn, Reader } from '../spec';
import { renderCoordinatePolygon } from './coordinate-polygon';
import { renderStemplot } from './stemplot';

export const BATCH6_FIGURE_KINDS = ['coordinate_polygon', 'stemplot'] as const;
export type Batch6FigureKind = (typeof BATCH6_FIGURE_KINDS)[number];

/** The drawing of a batch-6 kind, or null when `kind` is not one. */
export function renderBatch6(kind: string, r: Reader, uid: string): Drawn | null {
  switch (kind as Batch6FigureKind) {
    case 'coordinate_polygon': return renderCoordinatePolygon(r, uid);
    case 'stemplot': return renderStemplot(r, uid);
    default: return null;
  }
}
