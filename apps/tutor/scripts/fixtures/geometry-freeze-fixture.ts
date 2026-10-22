/**
 * Engine-freeze pin for the geometry renderer's default `fit: 'canvas'` path
 * (GAC round 8, G3; reused by round-8 Task 4, controller ruling R1). Every
 * live session renders with the default fit, and the GAC engine is frozen for
 * non-homework sessions, so a static render of this fixture must stay
 * byte-identical: the expected values below were taken from the renderer
 * BEFORE the content-fit padding change and are asserted literally.
 *
 * The old arithmetic, by hand: points span x [-1, 4], y [-1, 3] (the circle
 * of radius 1 at A reaches -1 on both axes); ± PADDING 1.5 → x [-2.5, 5.5]
 * (span 8), y [-2.5, 4.5] (span 7); 8/7 < 500/400, so x widens to 8.75
 * around 1.5 → x [-2.875, 5.875]. A (0, 0) → cx = 2.875 / 8.75 · 500,
 * cy = 4.5 / 7 · 400.
 */
import type { GeometryCircle, GeometryPoint, GeometrySegment } from '@core/knowledge/types';

export const GEOMETRY_FREEZE_FIXTURE: { points: GeometryPoint[]; segments: GeometrySegment[]; circles: GeometryCircle[] } = {
  points: [
    { id: 'A', x: 0, y: 0, label: 'A' },
    { id: 'B', x: 4, y: 0, label: 'B' },
    { id: 'C', x: 0, y: 3, label: 'C' },
  ] as GeometryPoint[],
  segments: [
    { from: 'A', to: 'B', label: '4' },
    { from: 'B', to: 'C', label: '5' },
    { from: 'C', to: 'A', label: '3' },
  ] as GeometrySegment[],
  circles: [{ center: 'A', radius: 1 }] as GeometryCircle[],
};

/** The old ±1.5 range's numbers for the fixture, literally. */
export const GEOMETRY_FREEZE_EXPECTED = {
  viewBox: '0 0 500 400',
  firstPointCx: (2.875 / 8.75) * 500,   // 164.28571428571428
  firstPointCy: (4.5 / 7) * 400,        // 257.14285714285717
  /** renderToStaticMarkup(renderGeometryTree(GEOMETRY_FREEZE_FIXTURE)), captured at 3d2ef167. */
  markupLength: 3416,
  markupSha256: '6be5dd990308e6b4c2b9e5b7de7592a543ed907c8f394fc527f8f27d2ad24f35',
};
