'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Ray Diagram Renderer
 *
 * Thin-lens / spherical-mirror ray diagram with object, image, focal points,
 * and principal rays. Uses the thin-lens/mirror equation 1/f = 1/do + 1/di
 * and magnification m = -di/do.
 *
 * Sign conventions used:
 *   - f > 0 for converging lens and concave mirror; f < 0 for diverging lens
 *     and convex mirror. The caller passes a magnitude; this file applies
 *     the sign from `type`.
 *   - di > 0 means a real image. For a LENS, real images sit on the
 *     far (right) side of the lens; virtual images sit on the same side
 *     as the object. For a MIRROR, real images sit on the same (left)
 *     side as the object; virtual images sit behind the mirror (right).
 *
 * Notes (long tutor-written captions) render as an HTML <div> below the
 * SVG rather than as an SVG <text> element — that way they wrap naturally
 * instead of getting clipped by the viewBox.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

/**
 * Build the data-feature-* attribute set used by tutor_scribble to locate
 * a labeled element without the tutor having to guess coordinates. Inputs
 * are the feature's bounding box in the renderer's pixel space; the
 * helper converts them to 0-1 fractions of the SVG viewBox. Consumers:
 *   - live: WhiteboardCanvas.ScribbleOverlays reads these via querySelector
 *   - PDF:  whiteboard-capture.overlayScribbles reads them from the
 *     captured SVG string via DOMParser
 */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-cy': (bbox.cy / DIAGRAM_VIEWBOX.height).toFixed(3),
    'data-feature-w': (bbox.w / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-h': (bbox.h / DIAGRAM_VIEWBOX.height).toFixed(3),
  };
}

export interface RayDiagramProps {
  title?: string;
  type: 'converging' | 'diverging' | 'concave-mirror' | 'convex-mirror';
  focalLength: number;
  objectDistance: number;
  objectHeight?: number;
  showLabels?: boolean;
  notes?: string;
  /** The image is what the student is asked to find: the object, the lens and its focal points only (tutor v2). */
  hideImage?: boolean;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildRayDiagramManifest(props: RayDiagramProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const isMirror = props.type === 'concave-mirror' || props.type === 'convex-mirror';
  const isConverging = props.type === 'converging' || props.type === 'concave-mirror';
  const f = isConverging ? Math.abs(props.focalLength) : -Math.abs(props.focalLength);
  const doObj = Math.abs(props.objectDistance);

  entries.push({
    name: 'principalAxis',
    kind: 'axis',
    description: 'optical (principal) axis, horizontal dashed line',
    labels: ['principal axis', 'principalAxis', 'optical axis', 'axis', 'the axis', 'center line', 'central axis'],
  });
  entries.push({
    name: isMirror ? 'mirror' : 'lens',
    kind: 'object',
    description: isMirror
      ? `${props.type} mirror at the center of the axis`
      : `${props.type} lens at the center of the axis`,
    labels: isMirror
      ? ['mirror', 'the mirror', props.type, `${props.type} mirror`]
      : ['lens', 'the lens', props.type, `${props.type} lens`],
  });

  if (!isMirror) {
    entries.push({
      name: 'focal',
      kind: 'point',
      description: `focal point F (object side), f = ${formatValue(f)} cm`,
      labels: ['focal', 'focal point', 'focus', 'F', 'focal point F', 'near focal point', 'object-side focal point'],
    });
    entries.push({
      name: 'focalPrime',
      kind: 'point',
      description: `focal point F' (image side), f = ${formatValue(f)} cm`,
      labels: ["focalPrime", "focal prime", "F'", "F prime", "focal point F'", "far focal point", "image-side focal point", "second focal point"],
    });
  } else if (props.type === 'concave-mirror') {
    entries.push({
      name: 'focal',
      kind: 'point',
      description: `focal point F on object side, f = ${formatValue(Math.abs(f))} cm`,
      labels: ['focal', 'focal point', 'focus', 'F', 'focal point F'],
    });
    entries.push({
      name: 'centerOfCurvature',
      kind: 'point',
      description: `center of curvature C at 2f on object side`,
      labels: ['centerOfCurvature', 'center of curvature', 'C', 'radius center', '2f point', 'the center'],
    });
  } else {
    // convex-mirror
    entries.push({
      name: 'focal',
      kind: 'point',
      description: `virtual focal point F behind the mirror`,
      labels: ['focal', 'focal point', 'focus', 'F', 'virtual focal point', 'focal point F'],
    });
  }

  entries.push({
    name: 'object',
    kind: 'object',
    description: `object arrow at distance do = ${formatValue(doObj)} cm (height ${formatValue(props.objectHeight ?? 2)} cm)`,
    labels: ['object', 'the object', 'object arrow', 'source', 'object height', 'ho'],
  });

  // Image feature emitted only when di is finite.
  const diInv = 1 / f - 1 / doObj;
  const di = Math.abs(diInv) < 1e-9 ? Infinity : 1 / diInv;
  if (Number.isFinite(di)) {
    const imageReal = di > 0;
    entries.push({
      name: 'image',
      kind: 'object',
      description: `${imageReal ? 'real' : 'virtual'} image arrow, di = ${formatValue(di)} cm`,
      labels: [
        'image',
        'the image',
        'image arrow',
        imageReal ? 'real image' : 'virtual image',
        'hi',
        'image height',
      ],
    });
  }

  return entries;
}

/** Up to 3 significant figures, no trailing zeros, a real minus sign. */
function fmt(v: number): string {
  if (!Number.isFinite(v)) return '∞';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : abs >= 1 ? 2 : 3;
  const s = abs.toFixed(digits).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  return (v < 0 ? '−' : '') + s;
}

/**
 * The geometry of one diagram, in SVG units. The x and y scales are chosen
 * independently: a paraxial ray construction is affine, so every ray still
 * passes through the focal points and the image tip, and a 2 cm object 60 cm
 * from the lens stays a readable arrow instead of a speck.
 */
interface RayLayout {
  isMirror: boolean;
  f: number; doObj: number; ho: number;
  di: number; m: number; hi: number;
  hasImage: boolean; imageReal: boolean;
  /** The image exists but is too far or too large to draw truthfully. */
  offPage: boolean;
  cx: number; axisY: number; sx: number; sy: number;
  elemHalf: number;
  showFar: boolean; // 2F marks (lens) / C (mirror) fit on the axis
  X: (cm: number) => number; Y: (cm: number) => number;
  xMinCm: number; xMaxCm: number;
}

const PLOT = { left: 8, right: W - 8, top: 26, bottom: 306 };
const AXIS_Y = 166;

function layoutRayDiagram(props: RayDiagramProps): RayLayout {
  const { type, focalLength, objectDistance, objectHeight = 2 } = props;
  const isMirror = type === 'concave-mirror' || type === 'convex-mirror';
  const isConverging = type === 'converging' || type === 'concave-mirror';
  // Enforce sign by type so the caller can pass a positive magnitude either way.
  const fMag = Math.max(Math.abs(focalLength) || 1, 1e-6);
  const f = isConverging ? fMag : -fMag;
  const doObj = Math.max(Math.abs(objectDistance) || fMag, 1e-6);
  const ho = Math.abs(objectHeight) || 2;

  const diInv = 1 / f - 1 / doObj;
  const hasImage = Math.abs(diInv) > 1e-9 * Math.max(1, 1 / fMag);
  const di = hasImage ? 1 / diInv : Infinity;
  const m = hasImage ? -di / doObj : 0;
  const hi = m * ho;
  const imageReal = hasImage && di > 0;

  // An image many focal lengths away (object just outside F) would squeeze
  // everything else into a corner: the rays are drawn heading for it instead.
  const offPage = hasImage && (Math.abs(di) > 4.5 * Math.max(doObj, 2 * fMag) || Math.abs(m) > 5.5);
  const drawImage = hasImage && !offPage;

  // What must be on the page: the object and a drawable image. A focal
  // point far beyond them is allowed to fall off the page (its mark is
  // dropped; rays still head for it) rather than squeeze them into a corner.
  const core = Math.max(doObj, drawImage ? Math.abs(di) : 0);
  const fShown = Math.min(fMag, 4.5 * core);
  let left: number; let right: number; let showFar = false;
  if (!isMirror) {
    left = Math.max(doObj, fShown, drawImage && !imageReal ? Math.abs(di) : 0);
    right = Math.max(fShown, drawImage && imageReal ? di : 0);
    if (2 * fMag <= Math.max(left, right) * 1.15) { showFar = true; left = Math.max(left, 2 * fMag); right = Math.max(right, 2 * fMag); }
    right = Math.max(right, 0.45 * left);
    left = Math.max(left, 0.3 * right);
  } else {
    left = Math.max(doObj, isConverging ? fShown : 0, drawImage && imageReal ? di : 0);
    right = Math.max(drawImage && !imageReal ? Math.abs(di) : 0, isConverging ? 0 : Math.min(fMag, 1.6 * left));
    if (isConverging ? 2 * fMag <= left * 1.6 : 2 * fMag <= left * 1.2) {
      showFar = true;
      if (isConverging) left = Math.max(left, 2 * fMag); else right = Math.max(right, 2 * fMag);
    }
    right = Math.max(right, 0.14 * left);
  }
  const marginL = 54; const marginR = 44;
  const sx = (W - marginL - marginR) / ((left + right) * 1.04);
  const cx = marginL + left * 1.02 * sx;

  const tallest = Math.max(ho, drawImage ? Math.abs(hi) : ho);
  let sy = 92 / tallest;
  if (ho * sy < 20) sy = 20 / ho;
  const hiPx = drawImage ? Math.abs(hi) * sy : 0;
  const elemHalf = Math.min(138, Math.max(100, Math.max(ho * sy, hiPx) + 22));

  return {
    isMirror, f, doObj, ho, di, m, hi, hasImage, imageReal, offPage,
    cx, axisY: AXIS_Y, sx, sy, elemHalf, showFar,
    X: (cm) => cx + cm * sx, Y: (cm) => AXIS_Y - cm * sy,
    xMinCm: (PLOT.left - cx) / sx, xMaxCm: (PLOT.right - cx) / sx,
  };
}

interface Seg { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; arrow?: boolean }

/** The principal rays from the object tip, in centimetres about the element. */
function principalRays(L: RayLayout): { color: string; segs: Seg[] }[] {
  const { f, doObj, ho, di, hi, hasImage, imageReal, offPage, isMirror, xMinCm, xMaxCm } = L;
  const drawImage = hasImage && !offPage;
  const span = xMaxCm - xMinCm;
  const fMag = Math.abs(f);
  const r1: Seg[] = []; const r2: Seg[] = []; const r3: Seg[] = [];
  // Ray 3 meets the element at the image height: only when that is on the element.
  const ray3 = drawImage && Math.abs(doObj - f) > 1e-6 && Math.abs(hi) * L.sy <= L.elemHalf - 8;

  if (!isMirror) {
    const xi = di; // image x: right of the lens when real
    const end = drawImage && imageReal ? Math.min(xMaxCm, xi + 0.16 * span) : xMaxCm;
    // 1: parallel to the axis, then through F' (or away from the near F).
    r1.push({ x1: -doObj, y1: ho, x2: 0, y2: ho, arrow: true });
    r1.push({ x1: 0, y1: ho, x2: end, y2: ho - (ho / f) * end, arrow: true });
    if (f < 0) r1.push({ x1: 0, y1: ho, x2: f, y2: 0, dashed: true });
    else if (drawImage && !imageReal) r1.push({ x1: 0, y1: ho, x2: xi, y2: hi, dashed: true });
    // 2: straight through the centre.
    r2.push({ x1: -doObj, y1: ho, x2: 0, y2: 0, arrow: true });
    r2.push({ x1: 0, y1: 0, x2: end, y2: -(ho / doObj) * end, arrow: true });
    if (drawImage && !imageReal && Math.abs(xi) > doObj) r2.push({ x1: -doObj, y1: ho, x2: xi, y2: hi, dashed: true });
    // 3: through (or towards) the other focal point, then parallel.
    if (ray3) {
      r3.push({ x1: -doObj, y1: ho, x2: 0, y2: hi, arrow: true });
      r3.push({ x1: 0, y1: hi, x2: end, y2: hi, arrow: true });
      if (f > 0 && doObj < f) r3.push({ x1: -f, y1: 0, x2: -doObj, y2: ho, dashed: true });
      if (f < 0) r3.push({ x1: 0, y1: hi, x2: fMag, y2: 0, dashed: true });
      if (!imageReal) r3.push({ x1: 0, y1: hi, x2: xi, y2: hi, dashed: true });
    }
  } else {
    const xi = -di; // image x: in front of the mirror (left) when real
    const end = drawImage && imageReal ? Math.max(xMinCm, Math.min(xi, -doObj) - 0.16 * span) : xMinCm;
    // 1: parallel to the axis, reflects through F (or as if from F behind).
    r1.push({ x1: -doObj, y1: ho, x2: 0, y2: ho, arrow: true });
    r1.push({ x1: 0, y1: ho, x2: end, y2: ho + (ho / f) * end, arrow: true });
    if (f < 0) r1.push({ x1: 0, y1: ho, x2: fMag, y2: 0, dashed: true });
    else if (drawImage && !imageReal) r1.push({ x1: 0, y1: ho, x2: xi, y2: hi, dashed: true });
    // 2: to the vertex, reflects at an equal angle.
    r2.push({ x1: -doObj, y1: ho, x2: 0, y2: 0, arrow: true });
    r2.push({ x1: 0, y1: 0, x2: end, y2: (ho / doObj) * end, arrow: true });
    if (drawImage && !imageReal) r2.push({ x1: 0, y1: 0, x2: xi, y2: hi, dashed: true });
    // 3: through (or towards) F, reflects parallel to the axis.
    if (ray3) {
      r3.push({ x1: -doObj, y1: ho, x2: 0, y2: hi, arrow: true });
      r3.push({ x1: 0, y1: hi, x2: end, y2: hi, arrow: true });
      if (f > 0 && doObj < f) r3.push({ x1: -f, y1: 0, x2: -doObj, y2: ho, dashed: true });
      if (f < 0) r3.push({ x1: 0, y1: hi, x2: fMag, y2: 0, dashed: true });
      if (!imageReal) r3.push({ x1: 0, y1: hi, x2: xi, y2: hi, dashed: true });
    }
  }
  return [
    { color: DIAGRAM_COLORS.primary, segs: r1 },
    { color: DIAGRAM_COLORS.success, segs: r2 },
    { color: '#ea580c', segs: r3 },
  ];
}

const MIRROR_SAG = 11;

export default function RayDiagramRenderer(props: RayDiagramProps) {
  const { title, type, showLabels = true, notes, hideImage = false } = props;
  const L = layoutRayDiagram(props);
  const { isMirror, f, doObj, ho, di, m, hi, hasImage, imageReal, offPage, cx, axisY, elemHalf, showFar, X, Y } = L;
  const fMag = Math.abs(f);
  const drawImage = hasImage && !offPage && !hideImage;
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');

  const objX = X(-doObj);
  const objTopY = Y(ho);
  const imageX = isMirror ? X(-di) : X(di);
  const imageTopY = Y(hi);

  // Axis marks. Lens: F and F' (and 2F, 2F' when they fit). Concave mirror:
  // F and C in front. Convex mirror: F and C behind, both virtual.
  type Mark = { key: string; x: number; label: string; muted?: boolean };
  const marks: Mark[] = [];
  if (!isMirror) {
    marks.push({ key: 'focal', x: X(-fMag), label: 'F' }, { key: 'focalPrime', x: X(fMag), label: 'F′' });
    // 2F only where it has room beside F.
    if (showFar && fMag * L.sx >= 42) marks.push({ key: 'twoF', x: X(-2 * fMag), label: '2F', muted: true }, { key: 'twoFPrime', x: X(2 * fMag), label: '2F′', muted: true });
  } else if (type === 'concave-mirror') {
    marks.push({ key: 'focal', x: X(-fMag), label: 'F' });
    if (showFar) marks.push({ key: 'centerOfCurvature', x: X(-2 * fMag), label: 'C', muted: true });
  } else {
    marks.push({ key: 'focal', x: X(fMag), label: 'F' });
    if (showFar) marks.push({ key: 'centerOfCurvature', x: X(2 * fMag), label: 'C', muted: true });
  }

  // A focal point beyond the edge of the page gets no mark.
  const shownMarks = marks.filter((mk) => mk.x >= PLOT.left + 8 && mk.x <= PLOT.right - 8);

  // ── Label layout: one de-overlap pass over the axis marks and the
  // Object / Image captions, with the two arrows as obstacles. ──
  const LABEL = 12.5;
  const imageText = imageReal ? 'Image' : 'Virtual image';
  const imageW = imageText.length * LABEL * 0.6;
  const imageOnRight = imageX >= cx;
  // Outside the arrow, away from the element; flipped when it would leave the board.
  let imageAnchor: 'start' | 'middle' | 'end' = imageOnRight ? 'start' : 'end';
  if (imageAnchor === 'start' && imageX + 8 + imageW > W - 4) imageAnchor = 'end';
  if (imageAnchor === 'end' && imageX - 8 - imageW < 4) imageAnchor = 'start';
  // Beside the shaft at mid-height: the rays meet at the tip, so the wedge
  // between the axis and the tip is the clear spot. A stub of an arrow has
  // no such wedge: its caption goes beyond the tip instead.
  const imageLen = Math.abs(imageTopY - axisY);
  let imageSeed = { x: imageX + (imageAnchor === 'start' ? 9 : -9), y: (axisY + imageTopY) / 2 + 4 };
  if (imageLen < 30) {
    imageAnchor = 'middle';
    imageSeed = { x: Math.min(W - 6 - imageW / 2, Math.max(6 + imageW / 2, imageX)), y: hi < 0 ? imageTopY + 17 : imageTopY - 9 };
  }
  type RayLabel = DeoverlapLabel & { key: string };
  const seeds: RayLabel[] = shownMarks.map((mk) => ({ key: mk.key, x: mk.x, y: axisY + 18, text: mk.label, fontSize: 12, preferDir: 'down' as const }));
  if (showLabels) {
    seeds.push({ key: 'object', x: objX - 8, y: objTopY + 10, text: 'Object', fontSize: LABEL, anchor: 'end', preferDir: 'up' });
    if (drawImage) seeds.push({ key: 'image', x: imageSeed.x, y: imageSeed.y, text: imageText, fontSize: LABEL, anchor: imageAnchor, preferDir: hi < 0 ? 'down' : 'up' });
  }
  const obstacles: DeoverlapObstacle[] = [
    { left: objX - 5, right: objX + 5, top: Math.min(objTopY, axisY) - 3, bottom: Math.max(objTopY, axisY) + 3 },
  ];
  if (drawImage) obstacles.push({ left: imageX - 5, right: imageX + 5, top: Math.min(imageTopY, axisY) - 3, bottom: Math.max(imageTopY, axisY) + 3 });
  const resolved = deoverlapLabels(seeds, { width: W, height: PLOT.bottom }, { obstacles, baseline: 'alphabetic', charWidth: 0.6 });
  const labelMap = new Map(resolved.map((l) => [l.key, { x: l.x, y: l.y }]));
  const lpos = (key: string, x: number, y: number) => labelMap.get(key) ?? { x, y };

  // Readout under the figure: the given values, then what the image is like.
  const readout = [
    `f = ${fmt(f)} cm`,
    `dₒ = ${fmt(doObj)} cm`,
    hideImage ? 'dᵢ = ?' : hasImage ? `dᵢ = ${fmt(di)} cm` : null,
    !hideImage && hasImage ? `m = ${fmt(m)}` : null,
  ].filter(Boolean).join('      ');
  const size = Math.abs(Math.abs(m) - 1) < 0.02 ? 'same size' : Math.abs(m) > 1 ? 'enlarged' : 'reduced';
  const nature = hideImage ? ''
    : !hasImage ? 'The rays leave parallel: no image forms.'
    : `${imageReal ? 'Real' : 'Virtual'}, ${m < 0 ? 'inverted' : 'upright'}, ${size}${offPage ? ` (the image is off the page, ${imageOnRight ? 'to the right' : 'to the left'})` : ''}`;

  const rays = hideImage ? [] : principalRays(L);
  // Real rays stop at the reflecting surface, which bulges off the vertex plane.
  const sagSign = type === 'concave-mirror' ? -1 : 1;
  const mirrorEdgeX = cx + sagSign * MIRROR_SAG;
  const clipD = isMirror
    ? `M ${PLOT.left} ${PLOT.top} L ${mirrorEdgeX} ${PLOT.top} L ${mirrorEdgeX} ${axisY - elemHalf} Q ${cx - sagSign * MIRROR_SAG} ${axisY} ${mirrorEdgeX} ${axisY + elemHalf} L ${mirrorEdgeX} ${PLOT.bottom} L ${PLOT.left} ${PLOT.bottom} Z`
    : `M ${PLOT.left} ${PLOT.top} H ${PLOT.right} V ${PLOT.bottom} H ${PLOT.left} Z`;

  const halo = { paintOrder: 'stroke' as const, stroke: '#ffffff', strokeWidth: 3.5, strokeLinejoin: 'round' as const };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>
          <InlineMathText text={title} />
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 460, display: 'block', margin: '0 auto' }}>
        <defs>
          <clipPath id={`rd-real-${uid}`}><path d={clipD} /></clipPath>
          <clipPath id={`rd-plot-${uid}`}><rect x={PLOT.left} y={PLOT.top} width={PLOT.right - PLOT.left} height={PLOT.bottom - PLOT.top} /></clipPath>
        </defs>

        {/* Optical axis */}
        <g {...feat('principalAxis', { cx: W / 2, cy: axisY, w: W - 24, h: 10 })}>
          <line x1={12} y1={axisY} x2={W - 12} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} strokeDasharray="5 4" />
        </g>

        {/* The lens or mirror */}
        <g {...feat(isMirror ? 'mirror' : 'lens', { cx, cy: axisY, w: 34, h: elemHalf * 2 })}>
          {renderElement(type, cx, axisY, elemHalf)}
        </g>

        {/* Principal rays: solid where light travels, dashed where it is traced back. */}
        {rays.map((ray, ri) => (
          <g key={ri}>
            {ray.segs.map((s, si) => {
              let x1 = X(s.x1); let y1 = Y(s.y1); let x2 = X(s.x2); let y2 = Y(s.y2);
              const len = Math.hypot(x2 - x1, y2 - y1);
              if (len < 0.5) return null;
              if (isMirror && !s.dashed) {
                // Rays are computed to the vertex plane; run them on to the
                // curved surface (the clip trims them there).
                const ux = (x2 - x1) / len; const uy = (y2 - y1) / len; const over = MIRROR_SAG + 2;
                if (s.x2 === 0) { x2 += ux * over; y2 += uy * over; }
                if (s.x1 === 0) { x1 -= ux * over; y1 -= uy * over; }
              }
              const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
              // Direction mark part-way along, kept on the visible stretch.
              const t = Math.min(0.5, 70 / len);
              const ax = x1 + (x2 - x1) * t; const ay = y1 + (y2 - y1) * t;
              return (
                <g key={si} clipPath={`url(#${s.dashed ? `rd-plot-${uid}` : `rd-real-${uid}`})`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ray.color} strokeWidth={s.dashed ? 1.25 : 1.9} strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinecap="round" opacity={s.dashed ? 0.85 : 1} />
                  {s.arrow && !s.dashed && len > 44 && (
                    <path d="M -5 -3.6 L 3 0 L -5 3.6 Z" fill={ray.color} transform={`translate(${ax} ${ay}) rotate(${ang})`} />
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {/* Axis marks */}
        {shownMarks.map((mk) => (
          <g key={mk.key} {...(mk.key === 'twoF' || mk.key === 'twoFPrime' ? {} : feat(mk.key, { cx: mk.x, cy: axisY, w: 22, h: 22 }))}>
            <circle cx={mk.x} cy={axisY} r={3.2} fill={mk.muted ? DIAGRAM_COLORS.muted : DIAGRAM_COLORS.text} />
            <text x={lpos(mk.key, mk.x, axisY + 18).x} y={lpos(mk.key, mk.x, axisY + 18).y} fontSize={12} fontWeight={600} textAnchor="middle" fill={mk.muted ? DIAGRAM_COLORS.muted : DIAGRAM_COLORS.text} {...halo}>{mk.label}</text>
          </g>
        ))}

        {/* Object arrow */}
        <g {...feat('object', { cx: objX, cy: (axisY + objTopY) / 2, w: 44, h: (axisY - objTopY) + 24 })}>
          <UprightArrow x={objX} baseY={axisY} tipY={objTopY} color={DIAGRAM_COLORS.secondary} />
          {showLabels && (
            <text x={lpos('object', objX - 8, objTopY + 10).x} y={lpos('object', objX - 8, objTopY + 10).y} fontSize={LABEL} fill={DIAGRAM_COLORS.secondary} textAnchor="end" fontWeight={700} {...halo}>Object</text>
          )}
        </g>

        {/* Image arrow: dashed when virtual */}
        {drawImage && (
          <g {...feat('image', { cx: imageX, cy: (axisY + imageTopY) / 2, w: 80, h: Math.abs(imageTopY - axisY) + 24 })}>
            <UprightArrow x={imageX} baseY={axisY} tipY={imageTopY} color={DIAGRAM_COLORS.accent} dashed={!imageReal} />
            {showLabels && (
              <text x={lpos('image', imageSeed.x, imageSeed.y).x} y={lpos('image', imageSeed.x, imageSeed.y).y} fontSize={LABEL} fill={DIAGRAM_COLORS.accent} textAnchor={imageAnchor} fontWeight={700} {...halo}>{imageText}</text>
            )}
          </g>
        )}

        {/* Readout */}
        <text x={W / 2} y={H - 26} fontSize={13} fontWeight={600} textAnchor="middle" fill={DIAGRAM_COLORS.text} style={{ whiteSpace: 'pre' }}>{readout}</text>
        {nature && <text x={W / 2} y={H - 8} fontSize={12} textAnchor="middle" fill={DIAGRAM_COLORS.muted}>{nature}</text>}
      </svg>
      {/* Notes rendered as HTML so long captions wrap rather than getting
          clipped by the SVG viewBox. */}
      {notes && (
        <div style={{ textAlign: 'center', fontSize: 12, color: DIAGRAM_COLORS.muted, fontStyle: 'italic', marginTop: 4, lineHeight: 1.35 }}>
          {notes}
        </div>
      )}
    </div>
  );
}

/** A vertical arrow from the axis to its tip; the head shrinks with a short arrow so a small image still reads as one. */
function UprightArrow({ x, baseY, tipY, color, dashed = false }: { x: number; baseY: number; tipY: number; color: string; dashed?: boolean }): React.ReactElement {
  const len = Math.abs(tipY - baseY);
  const dir = tipY < baseY ? -1 : 1;
  const head = Math.max(4, Math.min(11, len * 0.45));
  const half = head * 0.48;
  const neckY = tipY - dir * head;
  return (
    <g>
      {len > head && <line x1={x} y1={baseY} x2={x} y2={neckY} stroke={color} strokeWidth={2.75} strokeDasharray={dashed ? '6 4' : undefined} />}
      <path d={`M ${x} ${tipY} L ${x - half} ${neckY} L ${x + half} ${neckY} Z`} fill={color} />
    </g>
  );
}

// ─── Element visuals ──────────────────────────────────────────────────────

function renderElement(type: RayDiagramProps['type'], cx: number, axisY: number, half: number): React.ReactElement {
  const top = axisY - half; const bottom = axisY + half;
  if (type === 'converging') {
    // Biconvex outline, thickest on the axis.
    return (
      <g>
        <path d={`M ${cx} ${top} Q ${cx + 24} ${axisY} ${cx} ${bottom} Q ${cx - 24} ${axisY} ${cx} ${top} Z`} fill="#dbeafe" fillOpacity={0.7} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75} strokeLinejoin="round" />
        <line x1={cx} y1={top} x2={cx} y2={bottom} stroke={DIAGRAM_COLORS.primary} strokeWidth={0.75} strokeDasharray="3 3" opacity={0.6} />
      </g>
    );
  }
  if (type === 'diverging') {
    // Biconcave outline, thinnest on the axis.
    const w = 11; const waist = 3.5;
    return (
      <g>
        <path d={`M ${cx - w} ${top} L ${cx + w} ${top} Q ${cx + 2 * waist - w} ${axisY} ${cx + w} ${bottom} L ${cx - w} ${bottom} Q ${cx - 2 * waist + w} ${axisY} ${cx - w} ${top} Z`} fill="#dbeafe" fillOpacity={0.7} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75} strokeLinejoin="round" />
        <line x1={cx} y1={top} x2={cx} y2={bottom} stroke={DIAGRAM_COLORS.primary} strokeWidth={0.75} strokeDasharray="3 3" opacity={0.6} />
      </g>
    );
  }
  // Mirrors: the object is on the left. A concave mirror's rim leans towards
  // the object (centre of curvature in front); a convex mirror's rim leans
  // away. The silvered back, hatched, is on the right either way.
  const s = type === 'concave-mirror' ? -1 : 1;
  const edgeX = cx + s * MIRROR_SAG;
  const n = 11;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const u = -1 + (2 * (i + 0.5)) / n;
        const px = cx + s * MIRROR_SAG * u * u;
        const py = axisY + u * half;
        return <line key={i} x1={px} y1={py} x2={px + 8} y2={py - 6} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />;
      })}
      <path d={`M ${edgeX} ${top} Q ${cx - s * MIRROR_SAG} ${axisY} ${edgeX} ${bottom}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
}
