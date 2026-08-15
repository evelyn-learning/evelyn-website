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

export default function RayDiagramRenderer({
  title, type, focalLength, objectDistance, objectHeight = 2, showLabels = true, notes,
}: RayDiagramProps) {
  const isMirror = type === 'concave-mirror' || type === 'convex-mirror';
  const isConverging = type === 'converging' || type === 'concave-mirror';
  // Enforce sign by type so the caller can pass a positive magnitude either way.
  const f = isConverging ? Math.abs(focalLength) : -Math.abs(focalLength);
  const doObj = Math.abs(objectDistance);

  // Thin lens/mirror equation.
  const diInv = 1 / f - 1 / doObj;
  const di = Math.abs(diInv) < 1e-9 ? Infinity : 1 / diInv;
  const magnification = Number.isFinite(di) ? -di / doObj : 0;
  const hi = magnification * objectHeight;
  const imageReal = Number.isFinite(di) && di > 0;

  // Lay out the optical axis horizontally, with the element at center.
  const cx = W / 2;
  const axisY = H / 2 + 10;
  const maxExtent = Math.max(
    doObj,
    Math.abs(Number.isFinite(di) ? di : doObj * 1.5),
    Math.abs(f) * 2.2,
    1,
  );
  const pxPerCm = 175 / maxExtent;

  // Key reference points on the axis.
  const objX = cx - doObj * pxPerCm;
  const objTopY = axisY - objectHeight * pxPerCm;

  // For a MIRROR, positive di sits on the OBJECT side (left of vertex).
  // For a LENS, positive di sits on the opposite side (right of lens).
  const signedDi = Number.isFinite(di) ? di : 0;
  const imageX = isMirror ? cx - signedDi * pxPerCm : cx + signedDi * pxPerCm;
  const imageTopY = axisY - hi * pxPerCm;

  // Focal points. LENSES have F (object side) and F' (image side). MIRRORS
  // have a single physical F on the object side; the "behind-mirror" focus
  // is a virtual construction (only drawn for convex mirrors).
  const fLeftX = cx - Math.abs(f) * pxPerCm;
  const fRightX = cx + Math.abs(f) * pxPerCm;

  // Readout lines (rendered bottom-left; also an obstacle for the pass below).
  const readoutLines = [
    `f = ${formatValue(f)} cm`,
    `d_o = ${formatValue(doObj)} cm`,
    `d_i = ${Number.isFinite(di) ? formatValue(di) : '∞'} cm`,
    `m = ${formatValue(magnification)}`,
  ];

  // ── Label layout pass (2026-07-19 renderer label-collision audit):
  // Object / Image / focal-point captions were each placed independently
  // around the axis band ("Image" composited into "C" for an object just
  // beyond the center of curvature; the F' caption sat on the image arrow
  // shaft when d_i ≈ f). One deoverlapLabels pass, seeded at the
  // historical spots, with the object/image arrow shafts and the readout
  // block as obstacles. ──
  const tipBelow = imageTopY > axisY; // inverted image dips below axis
  const imageLabelAnchor: 'start' | 'end' = imageX >= cx ? 'start' : 'end';
  const imageLabelSeed = {
    x: imageX + (imageX >= cx ? 8 : -8),
    y: tipBelow ? imageTopY + 12 : imageTopY - 6,
  };
  type RayLabel = DeoverlapLabel & { key: string };
  const labelSeeds: RayLabel[] = [];
  if (!isMirror) {
    labelSeeds.push({ key: 'focal', x: fLeftX, y: axisY + 16, text: 'F', fontSize: 10, preferDir: 'down' });
    labelSeeds.push({ key: 'focalPrime', x: fRightX, y: axisY + 16, text: "F'", fontSize: 10, preferDir: 'down' });
  } else if (type === 'concave-mirror') {
    labelSeeds.push({ key: 'focal', x: fLeftX, y: axisY + 16, text: 'F', fontSize: 10, preferDir: 'down' });
    labelSeeds.push({ key: 'centerOfCurvature', x: cx - 2 * Math.abs(f) * pxPerCm, y: axisY + 16, text: 'C', fontSize: 10, preferDir: 'down' });
  } else {
    labelSeeds.push({ key: 'focal', x: fRightX, y: axisY + 16, text: 'F', fontSize: 10, preferDir: 'down' });
  }
  if (showLabels) {
    labelSeeds.push({ key: 'object', x: objX - 4, y: objTopY - 6, text: 'Object', fontSize: 11, anchor: 'end', preferDir: 'up' });
    if (Number.isFinite(di)) {
      labelSeeds.push({
        key: 'image', x: imageLabelSeed.x, y: imageLabelSeed.y,
        text: imageReal ? 'Image' : 'Image (virtual)', fontSize: 11,
        anchor: imageLabelAnchor, preferDir: tipBelow ? 'down' : 'up',
      });
    }
  }
  const readoutW = Math.max(...readoutLines.map((s) => s.length)) * 10 * 0.55;
  const labelObstacles: DeoverlapObstacle[] = [
    { left: objX - 3, right: objX + 3, top: Math.min(objTopY, axisY) - 3, bottom: Math.max(objTopY, axisY) + 3 },
    { left: 14, right: 18 + readoutW + 4, top: H - 74 - 12, bottom: H - 74 + 46 },
  ];
  if (Number.isFinite(di)) {
    labelObstacles.push({ left: imageX - 3, right: imageX + 3, top: Math.min(imageTopY, axisY) - 3, bottom: Math.max(imageTopY, axisY) + 3 });
  }
  const resolvedLabels = deoverlapLabels(
    labelSeeds,
    { width: W, height: H },
    { obstacles: labelObstacles, baseline: 'alphabetic' },
  );
  const labelMap = new Map(resolvedLabels.map((l) => [l.key, { x: l.x, y: l.y }]));
  const lpos = (key: string, fallbackX: number, fallbackY: number) =>
    labelMap.get(key) ?? { x: fallbackX, y: fallbackY };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>
          <InlineMathText text={title} />
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Arrowhead for the image / object arrows. */}
        <defs>
          <marker id="rd-arrow-obj" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={DIAGRAM_COLORS.secondary} />
          </marker>
          <marker id="rd-arrow-img" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={DIAGRAM_COLORS.accent} />
          </marker>
        </defs>

        {/* Optical axis */}
        <g {...feat('principalAxis', { cx: W / 2, cy: axisY, w: W - 60, h: 10 })}>
          <line x1={30} y1={axisY} x2={W - 30} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} strokeDasharray="4 3" />
        </g>

        {/* The element itself (lens / mirror visual) */}
        <g {...feat(isMirror ? 'mirror' : 'lens', { cx, cy: axisY, w: 34, h: 120 })}>
          {renderElement(type, cx, axisY)}
        </g>

        {/* Focal point markers + labels.
            Lens: F on object side (left), F' on image side (right).
            Concave mirror: F on object side (left) only.
            Convex mirror: F behind mirror (right), shown for reference (virtual). */}
        {!isMirror && (
          <>
            <g {...feat('focal', { cx: fLeftX, cy: axisY, w: 22, h: 22 })}>
              <FocalMark x={fLeftX} y={axisY} label="F" labelPos={lpos('focal', fLeftX, axisY + 16)} />
            </g>
            <g {...feat('focalPrime', { cx: fRightX, cy: axisY, w: 22, h: 22 })}>
              <FocalMark x={fRightX} y={axisY} label="F'" labelPos={lpos('focalPrime', fRightX, axisY + 16)} />
            </g>
          </>
        )}
        {type === 'concave-mirror' && (
          <>
            <g {...feat('focal', { cx: fLeftX, cy: axisY, w: 22, h: 22 })}>
              <FocalMark x={fLeftX} y={axisY} label="F" labelPos={lpos('focal', fLeftX, axisY + 16)} />
            </g>
            {/* C = center of curvature at 2f */}
            <g {...feat('centerOfCurvature', { cx: cx - 2 * Math.abs(f) * pxPerCm, cy: axisY, w: 22, h: 22 })}>
              <FocalMark
                x={cx - 2 * Math.abs(f) * pxPerCm}
                y={axisY}
                label="C"
                muted
                labelPos={lpos('centerOfCurvature', cx - 2 * Math.abs(f) * pxPerCm, axisY + 16)}
              />
            </g>
          </>
        )}
        {type === 'convex-mirror' && (
          <g {...feat('focal', { cx: fRightX, cy: axisY, w: 22, h: 22 })}>
            <FocalMark x={fRightX} y={axisY} label="F" muted labelPos={lpos('focal', fRightX, axisY + 16)} />
          </g>
        )}

        {/* Object arrow. */}
        <g {...feat('object', {
          cx: objX,
          cy: (axisY + objTopY) / 2,
          w: 44,
          h: (axisY - objTopY) + 24,
        })}>
          <line
            x1={objX} y1={axisY}
            x2={objX} y2={objTopY}
            stroke={DIAGRAM_COLORS.secondary}
            strokeWidth={2.5}
            markerEnd="url(#rd-arrow-obj)"
          />
          {showLabels && (
            <text
              x={lpos('object', objX - 4, objTopY - 6).x}
              y={lpos('object', objX - 4, objTopY - 6).y}
              fontSize={11}
              fill={DIAGRAM_COLORS.secondary}
              textAnchor="end"
              fontWeight={700}
            >
              Object
            </text>
          )}
        </g>

        {/* Principal rays. */}
        {renderRays({
          type, cx, axisY, objX, objTopY, fLeftX, fRightX,
          imageX, imageTopY, imageReal, isMirror,
        })}

        {/* Image arrow. Dashed for virtual, solid for real. */}
        {Number.isFinite(di) && (() => {
          const imageCy = (axisY + imageTopY) / 2;
          const imageH = Math.abs(imageTopY - axisY) + 24;
          return (
          <g {...feat('image', { cx: imageX, cy: imageCy, w: 80, h: imageH })}>
            <line
              x1={imageX} y1={axisY}
              x2={imageX} y2={imageTopY}
              stroke={DIAGRAM_COLORS.accent}
              strokeWidth={2.5}
              strokeDasharray={imageReal ? undefined : '6 4'}
              markerEnd="url(#rd-arrow-img)"
            />
            {showLabels && (
              <text
                x={lpos('image', imageLabelSeed.x, imageLabelSeed.y).x}
                y={lpos('image', imageLabelSeed.x, imageLabelSeed.y).y}
                fontSize={11}
                fill={DIAGRAM_COLORS.accent}
                textAnchor={imageLabelAnchor}
                fontWeight={700}
              >
                Image{imageReal ? '' : ' (virtual)'}
              </text>
            )}
          </g>
          );
        })()}

        {/* Readout — bottom-left corner. Absolute coordinates (no transform)
            so the label harness / layout pass can measure the lines. */}
        <g>
          {readoutLines.map((line, i) => (
            <text key={i} x={18} y={H - 74 + i * 14} fontSize={10} fill={DIAGRAM_COLORS.muted}>{line}</text>
          ))}
        </g>
      </svg>
      {/* Notes rendered as HTML so long captions wrap rather than getting
          clipped by the SVG viewBox. */}
      {notes && (
        <div style={{
          textAlign: 'center',
          fontSize: 11,
          color: DIAGRAM_COLORS.muted,
          fontStyle: 'italic',
          marginTop: 4,
          lineHeight: 1.35,
        }}>
          {notes}
        </div>
      )}
    </div>
  );
}

// ─── Element visuals ──────────────────────────────────────────────────────

function renderElement(type: RayDiagramProps['type'], cx: number, axisY: number): React.ReactElement {
  const height = 110;
  if (type === 'converging') {
    return (
      <g>
        <ellipse cx={cx} cy={axisY} rx={10} ry={height / 2} fill="#dbeafe" stroke={DIAGRAM_COLORS.primary} strokeWidth={2} />
        {/* Outward-facing arrows to indicate "converging" */}
        <polygon points={`${cx - 10},${axisY - height / 2} ${cx - 18},${axisY - height / 2 + 10} ${cx - 10},${axisY - height / 2 + 16}`} fill={DIAGRAM_COLORS.primary} />
        <polygon points={`${cx + 10},${axisY - height / 2} ${cx + 18},${axisY - height / 2 + 10} ${cx + 10},${axisY - height / 2 + 16}`} fill={DIAGRAM_COLORS.primary} />
      </g>
    );
  }
  if (type === 'diverging') {
    return (
      <g>
        <ellipse cx={cx} cy={axisY} rx={6} ry={height / 2} fill="#fef3c7" stroke={DIAGRAM_COLORS.warning} strokeWidth={2} />
        {/* Inward-facing arrow tips to indicate "diverging" */}
        <polygon points={`${cx - 6},${axisY - height / 2} ${cx - 16},${axisY - height / 2 - 6} ${cx + 4},${axisY - height / 2 - 2}`} fill={DIAGRAM_COLORS.warning} />
        <polygon points={`${cx + 6},${axisY + height / 2} ${cx + 16},${axisY + height / 2 + 6} ${cx - 4},${axisY + height / 2 + 2}`} fill={DIAGRAM_COLORS.warning} />
      </g>
    );
  }
  if (type === 'concave-mirror') {
    // Concave surface faces the object (LEFT). Reflective (shaded) side on the right.
    return (
      <g>
        <path d={`M ${cx} ${axisY - height / 2} A 60 ${height / 2} 0 0 0 ${cx} ${axisY + height / 2}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} fill="none" />
        {/* Hatching on the back (right) side */}
        {Array.from({ length: 9 }).map((_, i) => {
          const ty = axisY - height / 2 + (i + 0.5) * (height / 9);
          return <line key={i} x1={cx + 1} y1={ty} x2={cx + 10} y2={ty - 6} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />;
        })}
      </g>
    );
  }
  // convex-mirror: convex surface faces object (LEFT). Reflective (shaded) side on left? Actually for convex, the mirror bulges TOWARD the object.
  return (
    <g>
      <path d={`M ${cx} ${axisY - height / 2} A 60 ${height / 2} 0 0 1 ${cx} ${axisY + height / 2}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} fill="none" />
      {Array.from({ length: 9 }).map((_, i) => {
        const ty = axisY - height / 2 + (i + 0.5) * (height / 9);
        return <line key={i} x1={cx - 1} y1={ty} x2={cx - 10} y2={ty - 6} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />;
      })}
    </g>
  );
}

function FocalMark({ x, y, label, muted = false, labelPos }: {
  x: number; y: number; label: string; muted?: boolean;
  /** Resolved caption spot from the layout pass; defaults to just below the dot. */
  labelPos?: { x: number; y: number };
}): React.ReactElement {
  const color = muted ? DIAGRAM_COLORS.muted : DIAGRAM_COLORS.warning;
  return (
    <g>
      <circle cx={x} cy={y} r={3} fill={color} />
      <text x={labelPos?.x ?? x} y={labelPos?.y ?? y + 16} fontSize={10} fill={color} textAnchor="middle" fontWeight={600}>{label}</text>
    </g>
  );
}

// ─── Ray rendering ────────────────────────────────────────────────────────

interface RayCtx {
  type: RayDiagramProps['type'];
  cx: number;
  axisY: number;
  objX: number;
  objTopY: number;
  fLeftX: number;
  fRightX: number;
  imageX: number;
  imageTopY: number;
  imageReal: boolean;
  isMirror: boolean;
}

function renderRays(ctx: RayCtx): React.ReactElement {
  const { type, cx, axisY, objX, objTopY, fLeftX, fRightX, imageX, imageTopY, imageReal, isMirror } = ctx;

  // Ray 1 (parallel to axis from object tip, then refracts/reflects through F).
  //   Lens converging: after lens, passes through F' on right.
  //   Lens diverging: refracts outward, extended backward (dashed) through F' on right.
  //   Concave mirror: reflects back through F on left.
  //   Convex mirror: reflects as if from virtual F behind mirror (right).
  //
  // Ray 2 — goes through the centre of the lens / the mirror vertex.
  //   Lens: straight line through (cx, axisY).
  //   Mirror: reflects at (cx, axisY) with equal angle about the axis. The
  //     reflected ray direction = (-incomingDx, +incomingDy) in SVG because
  //     reflection about the horizontal normal at the vertex flips the
  //     axis-parallel component.

  const rayColor1 = DIAGRAM_COLORS.primary;
  const rayColor2 = DIAGRAM_COLORS.success;

  const parts: React.ReactElement[] = [];

  // --- Ray 1, incoming parallel segment (always solid, object → element at tip height).
  parts.push(
    <line key="r1-in"
      x1={objX} y1={objTopY}
      x2={cx} y2={objTopY}
      stroke={rayColor1} strokeWidth={1.75}
    />,
  );

  // --- Ray 1, outgoing segment after the element.
  if (type === 'converging') {
    // Through F' on right then extended to or past image.
    const end = extendLine(cx, objTopY, fRightX, axisY, imageReal ? imageX : cx + 160);
    parts.push(<line key="r1-out" x1={cx} y1={objTopY} x2={end.x} y2={end.y} stroke={rayColor1} strokeWidth={1.75} />);
  } else if (type === 'diverging') {
    // Refracted ray appears to come from F' on right (the "near" focal point
    // for a diverging lens). The real refracted ray goes UPWARD-AND-RIGHT from
    // the lens. Draw the real ray solid + a dashed backward extension to F'.
    const dirX = cx - fRightX;   // from F' to lens exit, pointing left (negative)
    const dirY = objTopY - axisY; // negative (objTopY is above axis)
    // Real ray: from (cx, objTopY), direction = opposite of (dirX, dirY)
    const tEnd = 2; // extend past the image region
    const endX = cx - dirX * tEnd;
    const endY = objTopY - dirY * tEnd;
    parts.push(<line key="r1-out" x1={cx} y1={objTopY} x2={endX} y2={endY} stroke={rayColor1} strokeWidth={1.75} />);
    // Dashed backward extension through F'
    parts.push(<line key="r1-ext" x1={cx} y1={objTopY} x2={fRightX} y2={axisY} stroke={rayColor1} strokeWidth={1} strokeDasharray="4 3" />);
  } else if (type === 'concave-mirror') {
    // Reflects back through F on LEFT. Line from (cx, objTopY) through (fLeftX, axisY), extended.
    const end = extendLine(cx, objTopY, fLeftX, axisY, Math.min(imageX, objX) - 20);
    parts.push(<line key="r1-out" x1={cx} y1={objTopY} x2={end.x} y2={end.y} stroke={rayColor1} strokeWidth={1.75} />);
  } else {
    // Convex mirror: reflected ray appears to come from virtual F behind mirror (right).
    // Real reflected ray goes UPWARD-LEFT from (cx, objTopY).
    // Direction from virtual F (fRightX, axisY) through (cx, objTopY), continue in that direction.
    const dx = cx - fRightX;
    const dy = objTopY - axisY;
    const endX = cx + dx * 1.6;
    const endY = objTopY + dy * 1.6;
    parts.push(<line key="r1-out" x1={cx} y1={objTopY} x2={endX} y2={endY} stroke={rayColor1} strokeWidth={1.75} />);
    // Dashed virtual extension INTO the mirror to F.
    parts.push(<line key="r1-ext" x1={cx} y1={objTopY} x2={fRightX} y2={axisY} stroke={rayColor1} strokeWidth={1} strokeDasharray="4 3" />);
  }

  // --- Ray 2: through element center / mirror vertex.
  if (!isMirror) {
    // Straight line through (cx, axisY), extended to image or past it.
    const end = extendLine(objX, objTopY, cx, axisY, imageReal ? imageX + 20 : cx + 160);
    parts.push(<line key="r2" x1={objX} y1={objTopY} x2={end.x} y2={end.y} stroke={rayColor2} strokeWidth={1.75} />);
    // Virtual images: dashed extension backward from lens on object side.
    if (!imageReal && Number.isFinite(imageX)) {
      parts.push(<line key="r2-ext" x1={cx} y1={axisY} x2={imageX} y2={imageTopY} stroke={rayColor2} strokeWidth={1} strokeDasharray="4 3" />);
    }
  } else {
    // Mirror vertex reflection.
    // Incoming direction (from object to vertex) in SVG: (cx - objX, axisY - objTopY).
    // Reflection about the axis (horizontal normal at vertex) flips the y-component relative to the axis reflection:
    //   wait, the NORMAL at a spherical-mirror vertex points along the axis (horizontal, to the right). Reflection
    //   reverses the component parallel to the normal. Incoming (+dx, +dy) becomes (-dx, +dy) after reflection.
    const inDx = cx - objX;
    const inDy = axisY - objTopY;
    // Incoming segment: object to vertex (solid)
    parts.push(<line key="r2-in" x1={objX} y1={objTopY} x2={cx} y2={axisY} stroke={rayColor2} strokeWidth={1.75} />);
    // Reflected segment: from vertex going (-dx, +dy) for as long as we want.
    // End at the image x (or ~160 px back if virtual).
    const target = imageReal ? imageX : (cx - 160);
    const t = (target - cx) / (-inDx); // parameter so cx + t*(-inDx) = target
    const outX = cx + t * -inDx;
    const outY = axisY + t * inDy;
    parts.push(<line key="r2-out" x1={cx} y1={axisY} x2={outX} y2={outY} stroke={rayColor2} strokeWidth={1.75} />);
    // Virtual image: dashed extension behind the mirror
    if (!imageReal && Number.isFinite(imageX)) {
      parts.push(<line key="r2-ext-a" x1={cx} y1={axisY} x2={imageX} y2={imageTopY} stroke={rayColor2} strokeWidth={1} strokeDasharray="4 3" />);
      parts.push(<line key="r1-ext-a" x1={cx} y1={objTopY} x2={imageX} y2={imageTopY} stroke={rayColor1} strokeWidth={1} strokeDasharray="4 3" />);
    }
  }

  return <g>{parts}</g>;
}

/** Extend a line defined by two points (p1, p2) out to a target x-coordinate.
 *  Returns the new endpoint. */
function extendLine(x1: number, y1: number, x2: number, y2: number, targetX: number): { x: number; y: number } {
  const dx = x2 - x1;
  if (Math.abs(dx) < 1e-9) return { x: x2, y: y2 };
  const slope = (y2 - y1) / dx;
  return { x: targetX, y: y1 + slope * (targetX - x1) };
}
