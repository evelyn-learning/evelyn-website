'use client';

/**
 * Geometry Renderer
 *
 * Renders geometric figures on a coordinate plane using pure SVG.
 * Supports points, segments, polygons, circles, arcs, and angle markers.
 * Maps mathematical coordinates (y-up) to SVG coordinates (y-down).
 */

import { useMemo } from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import type {
  GeometryPoint,
  GeometrySegment,
  GeometryPolygon,
  GeometryCircle,
  GeometryArc,
  GeometryAngle,
} from '@/lib/knowledge/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const SVG_WIDTH = 500;
const SVG_HEIGHT = 400;
const PADDING = 1.5; // math-unit padding around auto-computed viewRange
const POINT_RADIUS = 5;
const LABEL_OFFSET = 14;
const ANGLE_MARKER_SIZE = 18; // pixels for the angle arc/square marker
const TICK_LENGTH = 6; // half-length of tick marks in pixels
const ARROWHEAD_SIZE = 8;

// ─── Props ───────────────────────────────────────────────────────────────────

interface GeometryRendererProps {
  title?: string;
  points: GeometryPoint[];
  segments?: GeometrySegment[];
  polygons?: GeometryPolygon[];
  circles?: GeometryCircle[];
  arcs?: GeometryArc[];
  angles?: GeometryAngle[];
  showGrid?: boolean;
  showAxes?: boolean;
  viewRange?: { x: [number, number]; y: [number, number] };
  className?: string;
}

// ─── Coordinate helpers ──────────────────────────────────────────────────────

/** Build a lookup map from point id → point data */
function buildPointMap(points: GeometryPoint[]): Map<string, GeometryPoint> {
  const map = new Map<string, GeometryPoint>();
  for (const p of points) {
    map.set(p.id, p);
  }
  return map;
}

/** Return a function that maps math (x,y) → SVG (px, py) */
function makeTransform(range: { x: [number, number]; y: [number, number] }) {
  const [xMin, xMax] = range.x;
  const [yMin, yMax] = range.y;
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  return (mx: number, my: number): [number, number] => {
    const px = ((mx - xMin) / xSpan) * SVG_WIDTH;
    // Flip y: math y-up → SVG y-down
    const py = ((yMax - my) / ySpan) * SVG_HEIGHT;
    return [px, py];
  };
}

/**
 * Expand the math range so its aspect ratio matches the SVG's pixel aspect.
 * Without this, a square math viewport (e.g. radius-5 circle in a [-7,7]×[-7,7]
 * window) gets stretched horizontally by SVG_WIDTH/SVG_HEIGHT = 1.25, so
 * circles render as ellipses and equal angles look unequal. We always
 * EXPAND (never shrink) the tighter dimension so all content stays visible
 * and the diagram remains centered on its original midpoint.
 */
function matchRangeAspect(
  range: { x: [number, number]; y: [number, number] },
): { x: [number, number]; y: [number, number] } {
  const [xMin, xMax] = range.x;
  const [yMin, yMax] = range.y;
  const xSpan = xMax - xMin;
  const ySpan = yMax - yMin;
  const targetAspect = SVG_WIDTH / SVG_HEIGHT;
  const currentAspect = xSpan / ySpan;
  if (Math.abs(currentAspect - targetAspect) < 1e-6) return range;
  if (currentAspect < targetAspect) {
    // Math is too narrow → expand x (keeping it centered).
    const newXSpan = ySpan * targetAspect;
    const xCenter = (xMin + xMax) / 2;
    return {
      x: [xCenter - newXSpan / 2, xCenter + newXSpan / 2],
      y: range.y,
    };
  }
  // Math is too wide → expand y.
  const newYSpan = xSpan / targetAspect;
  const yCenter = (yMin + yMax) / 2;
  return {
    x: range.x,
    y: [yCenter - newYSpan / 2, yCenter + newYSpan / 2],
  };
}

/** Convert a math-unit distance to pixel distance (x-axis scale) */
function mathToPixelX(range: { x: [number, number] }, dist: number): number {
  const xSpan = range.x[1] - range.x[0] || 1;
  return (dist / xSpan) * SVG_WIDTH;
}

/** Convert a math-unit distance to pixel distance (y-axis scale). Used to
 *  draw circles as ellipses when the SVG aspect ratio doesn't match the
 *  math viewport — without this, "radius 5" maps to one pixel value on
 *  the x-axis and a different one on the y-axis, and points at math-
 *  distance 5 from the center don't fall on the rendered circle outline.
 */
function mathToPixelY(range: { y: [number, number] }, dist: number): number {
  const ySpan = range.y[1] - range.y[0] || 1;
  return (dist / ySpan) * SVG_HEIGHT;
}

// ─── Sub-renderers ───────────────────────────────────────────────────────────

/** Render grid lines */
function renderGrid(
  range: { x: [number, number]; y: [number, number] },
  toSvg: (x: number, y: number) => [number, number],
) {
  const lines: React.ReactElement[] = [];
  const [xMin, xMax] = range.x;
  const [yMin, yMax] = range.y;

  // Choose a nice step based on the span
  const xSpan = xMax - xMin;
  const ySpan = yMax - yMin;
  const xStep = niceStep(xSpan);
  const yStep = niceStep(ySpan);

  // Vertical grid lines
  const xStart = Math.ceil(xMin / xStep) * xStep;
  for (let x = xStart; x <= xMax; x += xStep) {
    const [px, py1] = toSvg(x, yMin);
    const [, py2] = toSvg(x, yMax);
    lines.push(
      <line
        key={`gv-${x}`}
        x1={px}
        y1={py1}
        x2={px}
        y2={py2}
        stroke="#e0e0e0"
        strokeWidth={1}
      />,
    );
  }

  // Horizontal grid lines
  const yStart = Math.ceil(yMin / yStep) * yStep;
  for (let y = yStart; y <= yMax; y += yStep) {
    const [px1, py] = toSvg(xMin, y);
    const [px2] = toSvg(xMax, y);
    lines.push(
      <line
        key={`gh-${y}`}
        x1={px1}
        y1={py}
        x2={px2}
        y2={py}
        stroke="#e0e0e0"
        strokeWidth={1}
      />,
    );
  }

  return <g className="grid">{lines}</g>;
}

/** Pick a "nice" step size for grid lines given a total span */
function niceStep(span: number): number {
  const raw = span / 8; // aim for ~8 divisions
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  if (norm < 1.5) return mag;
  if (norm < 3.5) return 2 * mag;
  if (norm < 7.5) return 5 * mag;
  return 10 * mag;
}

/** Render axes with arrowheads */
function renderAxes(
  range: { x: [number, number]; y: [number, number] },
  toSvg: (x: number, y: number) => [number, number],
  /** When the brain has already emitted a labeled point at (0, 0)
   *  (e.g. circle's center O), suppress the renderer's auto-origin
   *  marker so the user doesn't see two "O" labels at the same spot. */
  hasPointAtOrigin: boolean = false,
) {
  const [xMin, xMax] = range.x;
  const [yMin, yMax] = range.y;

  const elements: React.ReactElement[] = [];

  // Only draw an axis if zero is within the visible range
  const showXAxis = yMin <= 0 && yMax >= 0;
  const showYAxis = xMin <= 0 && xMax >= 0;

  if (showXAxis) {
    const [x1, y0] = toSvg(xMin, 0);
    const [x2] = toSvg(xMax, 0);
    elements.push(
      <line key="x-axis" x1={x1} y1={y0} x2={x2} y2={y0} stroke="#333" strokeWidth={1.5} />,
    );
    // Arrowhead at +x end
    elements.push(
      <polygon
        key="x-arrow"
        points={`${x2},${y0} ${x2 - ARROWHEAD_SIZE},${y0 - ARROWHEAD_SIZE / 2} ${x2 - ARROWHEAD_SIZE},${y0 + ARROWHEAD_SIZE / 2}`}
        fill="#333"
      />,
    );
    // "x" label — always drawn when the axis is. This is a rendering-layer
    // responsibility: the LLM shouldn't have to ask for axis labels, and
    // many LLM prompts that DO ask for them get ignored by the model.
    elements.push(
      <text key="x-label" x={x2 - 4} y={y0 - 10} textAnchor="end" fontSize={13} fontWeight={600} fontStyle="italic" fill="#333">
        x
      </text>,
    );
  }

  if (showYAxis) {
    const [x0, y1] = toSvg(0, yMin);
    const [, y2] = toSvg(0, yMax);
    elements.push(
      <line key="y-axis" x1={x0} y1={y1} x2={x0} y2={y2} stroke="#333" strokeWidth={1.5} />,
    );
    // Arrowhead at +y end (top of SVG = smaller py)
    elements.push(
      <polygon
        key="y-arrow"
        points={`${x0},${y2} ${x0 - ARROWHEAD_SIZE / 2},${y2 + ARROWHEAD_SIZE} ${x0 + ARROWHEAD_SIZE / 2},${y2 + ARROWHEAD_SIZE}`}
        fill="#333"
      />,
    );
    elements.push(
      <text key="y-label" x={x0 + 10} y={y2 + 6} textAnchor="start" fontSize={13} fontWeight={600} fontStyle="italic" fill="#333">
        y
      </text>,
    );
    // If the x-axis is also drawn AND the brain hasn't already labeled
    // a point at the origin, mark it. Without the second guard, a circle
    // whose center O sits at (0,0) renders two "O" labels.
    if (showXAxis && !hasPointAtOrigin) {
      const [ox, oy] = toSvg(0, 0);
      elements.push(
        <text key="origin-label" x={ox - 6} y={oy + 14} textAnchor="end" fontSize={11} fill="#666">
          O
        </text>,
      );
    }
  }

  return <g className="axes">{elements}</g>;
}

/** Render filled polygons */
function renderPolygons(
  polygons: GeometryPolygon[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
  labeledPoints: GeometryPoint[],
) {
  return polygons.map((poly, i) => {
    const pts = poly.vertices
      .map((id) => ptMap.get(id))
      .filter(Boolean) as GeometryPoint[];
    if (pts.length < 3) return null;

    const pathPoints = pts.map((p) => toSvg(p.x, p.y));
    const d = pathPoints.map(([px, py], idx) => `${idx === 0 ? 'M' : 'L'}${px},${py}`).join(' ') + ' Z';

    // Compute centroid for label placement
    const cx = pathPoints.reduce((s, [px]) => s + px, 0) / pathPoints.length;
    const cy = pathPoints.reduce((s, [, py]) => s + py, 0) / pathPoints.length;

    // Suppress polygon center label if a labeled point sits at the centroid
    // (e.g. hexagon centered at O(0,0) — otherwise "Regular Hexagon" stomps
    // on the "O" label and any auto-origin marker).
    const CENTROID_COLLIDE_PX = 16;
    const labelCollidesWithPoint = labeledPoints.some((p) => {
      const [px, py] = toSvg(p.x, p.y);
      return Math.hypot(px - cx, py - cy) < CENTROID_COLLIDE_PX;
    });

    const polyXs = pathPoints.map(([px]) => px);
    const polyYs = pathPoints.map(([, py]) => py);
    const polyMinX = Math.min(...polyXs), polyMaxX = Math.max(...polyXs);
    const polyMinY = Math.min(...polyYs), polyMaxY = Math.max(...polyYs);
    const polyName = poly.label ? `shape-${featSlug(poly.label)}` : `shape-${i + 1}`;
    return (
      <g key={`poly-${i}`} {...feat(polyName, { cx: (polyMinX + polyMaxX) / 2, cy: (polyMinY + polyMaxY) / 2, w: polyMaxX - polyMinX + 16, h: polyMaxY - polyMinY + 16 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <path
          d={d}
          fill={poly.fill || '#4f8cff'}
          fillOpacity={0.15}
          stroke={poly.stroke || '#4f8cff'}
          strokeWidth={2}
        />
        {poly.label && !labelCollidesWithPoint && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={13} fill="#333" fontWeight={500}>
            {poly.label}
          </text>
        )}
      </g>
    );
  });
}

/** Render line segments between named points */
function renderSegments(
  segments: GeometrySegment[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
) {
  return segments.map((seg, i) => {
    const from = ptMap.get(seg.from);
    const to = ptMap.get(seg.to);
    if (!from || !to) return null;

    const [x1, y1] = toSvg(from.x, from.y);
    const [x2, y2] = toSvg(to.x, to.y);

    // Stroke dash pattern
    let dashArray: string | undefined;
    if (seg.style === 'dashed') dashArray = '8,4';
    else if (seg.style === 'dotted') dashArray = '2,4';

    // Midpoint for label and tick marks
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Direction perpendicular to segment (for ticks and label offset)
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len; // perpendicular unit vector
    const ny = dx / len;

    return (
      <g key={`seg-${i}`} {...feat(`segment-${featSlug(seg.from)}-${featSlug(seg.to)}`,
        { cx: mx, cy: my, w: Math.max(20, Math.abs(x2 - x1) + 20), h: Math.max(20, Math.abs(y2 - y1) + 20) },
        { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={seg.color || '#333'}
          strokeWidth={2}
          strokeDasharray={dashArray}
        />
        {/* Tick marks for congruence notation */}
        {seg.tickMarks && seg.tickMarks > 0 && renderTickMarks(mx, my, nx, ny, dx / len, dy / len, seg.tickMarks)}
        {/* Segment label rendered separately — see renderLabels. */}
      </g>
    );
  });
}

/** Render 1–3 small perpendicular tick marks at the segment midpoint */
function renderTickMarks(
  mx: number,
  my: number,
  nx: number,
  ny: number,
  tx: number,
  ty: number,
  count: number,
) {
  const ticks: React.ReactElement[] = [];
  const spacing = 5;

  for (let i = 0; i < count; i++) {
    // Offset along the segment direction from the midpoint
    const offset = (i - (count - 1) / 2) * spacing;
    const cx = mx + tx * offset;
    const cy = my + ty * offset;

    ticks.push(
      <line
        key={`tick-${i}`}
        x1={cx - nx * TICK_LENGTH}
        y1={cy - ny * TICK_LENGTH}
        x2={cx + nx * TICK_LENGTH}
        y2={cy + ny * TICK_LENGTH}
        stroke="#333"
        strokeWidth={1.5}
      />,
    );
  }

  return <>{ticks}</>;
}

/** Render circles */
function renderCircles(
  circles: GeometryCircle[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
  range: { x: [number, number]; y: [number, number] },
) {
  return circles.map((circ, i) => {
    const center = ptMap.get(circ.center);
    if (!center) return null;

    const [cx, cy] = toSvg(center.x, center.y);
    // Use separate x/y pixel radii so the rendered circle exactly contains
    // all math-points at math-distance `radius` from the center. With a
    // single `r`, the chord endpoints would fall inside or outside the
    // circle whenever the SVG aspect ratio (500×400) differs from the
    // math viewport's aspect ratio.
    const rx = mathToPixelX(range, circ.radius);
    const ry = mathToPixelY(range, circ.radius);

    let dashArray: string | undefined;
    if (circ.style === 'dashed') dashArray = '6,4';

    const circName = circ.label ? `shape-${featSlug(circ.label)}` : `shape-circle-${i + 1}`;
    return (
      <g key={`circle-${i}`} {...feat(circName, { cx, cy, w: rx * 2 + 10, h: ry * 2 + 10 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={circ.color || '#4f8cff'}
          strokeWidth={2}
          strokeDasharray={dashArray}
        />
        {circ.label && (
          <text
            x={cx}
            y={cy - ry - 8}
            textAnchor="middle"
            fontSize={12}
            fill={circ.color || '#4f8cff'}
          >
            {circ.label}
          </text>
        )}
      </g>
    );
  });
}

/** Render arcs as SVG arc paths */
function renderArcs(
  arcs: GeometryArc[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
  range: { x: [number, number]; y: [number, number] },
) {
  return arcs.map((arc, i) => {
    const center = ptMap.get(arc.center);
    if (!center) return null;

    const r = mathToPixelX(range, arc.radius);
    const startRad = (arc.startAngle * Math.PI) / 180;
    const endRad = (arc.endAngle * Math.PI) / 180;

    // Compute start and end points in math coords, then transform
    const sx = center.x + arc.radius * Math.cos(startRad);
    const sy = center.y + arc.radius * Math.sin(startRad);
    const ex = center.x + arc.radius * Math.cos(endRad);
    const ey = center.y + arc.radius * Math.sin(endRad);

    const [spx, spy] = toSvg(sx, sy);
    const [epx, epy] = toSvg(ex, ey);

    // Determine if the arc is greater than 180 degrees
    let sweep = arc.endAngle - arc.startAngle;
    if (sweep < 0) sweep += 360;
    const largeArc = sweep > 180 ? 1 : 0;

    // SVG arc sweep flag: 0 because y-axis is flipped
    const d = `M ${spx},${spy} A ${r},${r} 0 ${largeArc} 0 ${epx},${epy}`;

    // Label at the arc midpoint
    const midAngle = ((arc.startAngle + sweep / 2) * Math.PI) / 180;
    const labelR = arc.radius * 1.15;
    const lx = center.x + labelR * Math.cos(midAngle);
    const ly = center.y + labelR * Math.sin(midAngle);
    const [lpx, lpy] = toSvg(lx, ly);

    return (
      <g key={`arc-${i}`}>
        <path d={d} fill="none" stroke={arc.color || '#e67e22'} strokeWidth={2} />
        {arc.label && (
          <text x={lpx} y={lpy} textAnchor="middle" dominantBaseline="central" fontSize={12} fill={arc.color || '#e67e22'}>
            {arc.label}
          </text>
        )}
      </g>
    );
  });
}

/** Compute an interior angle in degrees from three math-space points. */
function computeAngleDegrees(
  vertex: GeometryPoint,
  from: GeometryPoint,
  to: GeometryPoint,
): number {
  const dx1 = from.x - vertex.x;
  const dy1 = from.y - vertex.y;
  const dx2 = to.x - vertex.x;
  const dy2 = to.y - vertex.y;
  const dot = dx1 * dx2 + dy1 * dy2;
  const m1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const m2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  if (m1 === 0 || m2 === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** Pretty-print a degree value, dropping ".0" when the result is integer. */
function formatDegrees(deg: number): string {
  const rounded = Math.round(deg * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}°` : `${rounded.toFixed(1)}°`;
}

/** Compute the display text for an angle: the model's label if it's
 *  meaningful, otherwise the auto-computed degree measure. */
function angleDisplayLabel(
  angle: GeometryAngle,
  vertex: GeometryPoint,
  from: GeometryPoint,
  to: GeometryPoint,
): string {
  const rawLabel = (angle.label ?? '').trim();
  const looksLikeBareSymbol =
    rawLabel === '' ||
    rawLabel === '∠' ||
    (rawLabel.length <= 2 && !/\d/.test(rawLabel) && !/°/.test(rawLabel));
  return looksLikeBareSymbol
    ? formatDegrees(computeAngleDegrees(vertex, from, to))
    : rawLabel;
}

/** Render angle markers (arc or right-angle square). Labels are emitted
 *  separately through the LabelBox collision system so they don't get
 *  painted underneath nearby vertex or segment labels. */
function renderAngles(
  angles: GeometryAngle[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
) {
  return angles.map((angle, i) => {
    const vertex = ptMap.get(angle.vertex);
    const fromPt = ptMap.get(angle.from);
    const toPt = ptMap.get(angle.to);
    if (!vertex || !fromPt || !toPt) return null;

    const [vx, vy] = toSvg(vertex.x, vertex.y);
    const [fx, fy] = toSvg(fromPt.x, fromPt.y);
    const [tx, ty] = toSvg(toPt.x, toPt.y);

    // Direction vectors from vertex to each ray endpoint (in SVG space)
    const dxFrom = fx - vx;
    const dyFrom = fy - vy;
    const dxTo = tx - vx;
    const dyTo = ty - vy;

    const lenFrom = Math.sqrt(dxFrom * dxFrom + dyFrom * dyFrom) || 1;
    const lenTo = Math.sqrt(dxTo * dxTo + dyTo * dyTo) || 1;

    // Unit vectors along each ray
    const ufx = dxFrom / lenFrom;
    const ufy = dyFrom / lenFrom;
    const utx = dxTo / lenTo;
    const uty = dyTo / lenTo;

    const color = angle.color || '#e74c3c';
    const size = ANGLE_MARKER_SIZE;

    const vertexName = vertex.label ? featSlug(vertex.label) : featSlug(angle.vertex);
    const angleFeatProps = feat(`angle-${vertexName}`,
      { cx: vx, cy: vy, w: size * 3, h: size * 3 },
      { width: SVG_WIDTH, height: SVG_HEIGHT });

    if (angle.style === 'square') {
      // Right angle: draw a small square at the vertex.
      const p1x = vx + ufx * size;
      const p1y = vy + ufy * size;
      const p2x = vx + ufx * size + utx * size;
      const p2y = vy + ufy * size + uty * size;
      const p3x = vx + utx * size;
      const p3y = vy + uty * size;
      return (
        <polyline
          key={`angle-${i}`}
          points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          {...angleFeatProps}
        />
      );
    }

    // Default: arc marker
    const angleFrom = Math.atan2(dyFrom, dxFrom);
    const angleTo = Math.atan2(dyTo, dxTo);
    const arcStartX = vx + Math.cos(angleFrom) * size;
    const arcStartY = vy + Math.sin(angleFrom) * size;
    const arcEndX = vx + Math.cos(angleTo) * size;
    const arcEndY = vy + Math.sin(angleTo) * size;
    const cross = ufx * uty - ufy * utx;
    const sweepFlag = cross > 0 ? 1 : 0;
    let angleDiff = angleTo - angleFrom;
    if (sweepFlag === 1 && angleDiff < 0) angleDiff += 2 * Math.PI;
    if (sweepFlag === 0 && angleDiff > 0) angleDiff -= 2 * Math.PI;
    const largeArc = Math.abs(angleDiff) > Math.PI ? 1 : 0;
    const d = `M ${arcStartX},${arcStartY} A ${size},${size} 0 ${largeArc} ${sweepFlag} ${arcEndX},${arcEndY}`;

    return (
      <path
        key={`angle-${i}`}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        {...angleFeatProps}
      />
    );
  });
}

/** Render points as colored dots (labels rendered separately by renderLabels). */
function renderPointDots(
  points: GeometryPoint[],
  toSvg: (x: number, y: number) => [number, number],
) {
  return points.map((pt) => {
    const [px, py] = toSvg(pt.x, pt.y);
    const color = pt.color || '#2563eb';
    const ptName = pt.label ? `point-${featSlug(pt.label)}` : `point-${featSlug(pt.id)}`;
    return (
      <circle
        key={`pt-${pt.id}`}
        cx={px}
        cy={py}
        r={POINT_RADIUS}
        fill={color}
        stroke="#fff"
        strokeWidth={1.5}
        {...feat(ptName, { cx: px, cy: py, w: POINT_RADIUS * 4, h: POINT_RADIUS * 4 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}
      />
    );
  });
}

// ─── Label layout + collision resolution ─────────────────────────────────────
//
// Labels are placed in a separate pass so point labels and segment labels can
// avoid colliding with each other. Each label starts at a "preferred" position
// (the same one the renderer used historically). If two labels' bounding
// boxes overlap, we shift one of them along the perpendicular axis until the
// collision is resolved. This is why "Chord AB" and "Center (2,1)" no longer
// paint on top of each other even when the chord passes near the center.

interface LabelBox {
  key: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  fontSize: number;
  fontWeight?: number;
  fontStyle?: 'italic' | 'normal';
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'auto' | 'central' | 'middle';
  /** Perpendicular direction used to push this label away from collisions. */
  pushX: number;
  pushY: number;
  /** The geometric feature this label refers to (dot center, segment
   *  midpoint, angle vertex). Used for leader-line endpoints when the
   *  resolver displaces the label far from where it points. NOT the
   *  spring target — labels would land on top of their dots if it were. */
  anchorX: number;
  anchorY: number;
  /** The label's "preferred" rest position — the offset placement from
   *  the anchor that the layout chose initially. The spring force in
   *  resolveLabelCollisions pulls each label back toward THIS, not the
   *  anchor. Without separate ideal vs anchor, my first attempt at
   *  the force-directed resolver pulled labels onto their own dots. */
  idealX: number;
  idealY: number;
}

/** Rough width estimate for a text label in SVG (monospace-ish averaging). */
function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

/** AABB overlap test with a small buffer. */
function boxesOverlap(a: LabelBox, b: LabelBox, buffer = 2): boolean {
  const ax1 = textLeft(a);
  const ay1 = textTop(a);
  const ax2 = ax1 + a.w;
  const ay2 = ay1 + a.h;
  const bx1 = textLeft(b);
  const by1 = textTop(b);
  const bx2 = bx1 + b.w;
  const by2 = by1 + b.h;
  return !(ax2 + buffer < bx1 || bx2 + buffer < ax1 || ay2 + buffer < by1 || by2 + buffer < ay1);
}

function textLeft(a: LabelBox): number {
  if (a.textAnchor === 'middle') return a.x - a.w / 2;
  if (a.textAnchor === 'end') return a.x - a.w;
  return a.x;
}
function textTop(a: LabelBox): number {
  // Approximate: baseline text extends mostly below the anchor y for 'auto',
  // and centered around y for 'central'/'middle'.
  if (a.dominantBaseline === 'central' || a.dominantBaseline === 'middle') {
    return a.y - a.h / 2;
  }
  return a.y - a.h * 0.9;
}

/**
 * The label's visual center, accounting for text-anchor and baseline.
 * (Different anchor combos produce different left/top edges.)
 */
function labelCenter(a: LabelBox): { x: number; y: number } {
  const cx = a.x + (a.textAnchor === 'middle' ? 0 : a.textAnchor === 'end' ? -a.w / 2 : a.w / 2);
  const cy = a.y + (a.dominantBaseline === 'central' || a.dominantBaseline === 'middle' ? 0 : -a.h * 0.4);
  return { x: cx, y: cy };
}

/** Vector from the label's anchor (the geometric feature) to the
 *  label's current visual center. Used by leader-line drawing. */
function anchorOffset(a: LabelBox): { dx: number; dy: number } {
  const c = labelCenter(a);
  return { dx: c.x - a.anchorX, dy: c.y - a.anchorY };
}

/** Vector from the label's IDEAL rest position to its current visual
 *  center. Used by the spring force in collision resolution. */
function idealOffset(a: LabelBox): { dx: number; dy: number } {
  const c = labelCenter(a);
  return { dx: c.x - a.idealX, dy: c.y - a.idealY };
}

/**
 * Force-directed label-collision resolver. Each label has:
 *   • a SPRING force pulling it back toward its anchor (proportional to
 *     displacement) — so labels drift no further than necessary, and
 *     symmetrically (no first-label-wins bias).
 *   • a REPULSION force from every other overlapping label (constant
 *     magnitude in the direction that most reduces overlap).
 *
 * Iterating these forces a few dozen times reaches a stable equilibrium
 * where labels are spread out only as much as needed. Compared to the
 * old fixed-step push-the-later-one strategy, this:
 *   • doesn't over-push when there's room.
 *   • doesn't anchor label A in place while pushing B halfway across.
 *   • converges symmetrically when two labels both want the same spot.
 */
function resolveLabelCollisions(labels: LabelBox[]): void {
  const MAX_ITERS = 30;
  const REPULSION_STEP = 4;     // px moved per iter when overlapping
  const SPRING_K = 0.06;        // fraction of displacement reverted per iter
  const MIN_DELTA = 0.5;        // stop early when no label moves more than this
  for (let iter = 0; iter < MAX_ITERS; iter++) {
    let maxMove = 0;
    for (let i = 0; i < labels.length; i++) {
      const a = labels[i];
      let fx = 0;
      let fy = 0;
      // Repulsion from each overlapping neighbor.
      for (let j = 0; j < labels.length; j++) {
        if (i === j) continue;
        const b = labels[j];
        if (!boxesOverlap(a, b)) continue;
        // Direction: from b's center to a's center.
        const ac = labelCenter(a);
        const bc = labelCenter(b);
        let rdx = ac.x - bc.x;
        let rdy = ac.y - bc.y;
        const rlen = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
        rdx /= rlen;
        rdy /= rlen;
        // Bias along this label's preferred push direction so the
        // movement still feels "natural" (perpendicular for segments,
        // outward-radial for points and angles).
        fx += rdx * REPULSION_STEP * 0.7 + a.pushX * REPULSION_STEP * 0.3;
        fy += rdy * REPULSION_STEP * 0.7 + a.pushY * REPULSION_STEP * 0.3;
      }
      // Spring back to IDEAL rest position (the offset placement),
      // NOT to the anchor (the dot itself). Pulling to anchor would
      // make labels land on top of their own dots.
      const off = idealOffset(a);
      fx -= off.dx * SPRING_K;
      fy -= off.dy * SPRING_K;
      // Apply.
      a.x += fx;
      a.y += fy;
      const move = Math.abs(fx) + Math.abs(fy);
      if (move > maxMove) maxMove = move;
    }
    if (maxMove < MIN_DELTA) break;
  }
}

/**
 * Co-located label de-duplication. If a non-point label (segment
 * midpoint, etc.) shares its anchor (within COLOC_PX) with a point
 * label, the segment label is redundant — the point's letter already
 * names the location. Drop it. Specific case: a chord whose midpoint
 * IS a labeled point (the chord is a diameter through O) — the user
 * sees "O" and "Chord" both wanting to live at origin; collapse.
 */
function dedupCoLocatedLabels(labels: LabelBox[]): LabelBox[] {
  const COLOC_PX = 4;
  const pointLabels = labels.filter((l) => l.key.startsWith('pt:'));
  return labels.filter((l) => {
    if (l.key.startsWith('pt:')) return true;
    // For non-point labels, drop if any point label sits at the same anchor.
    for (const pl of pointLabels) {
      const dx = l.anchorX - pl.anchorX;
      const dy = l.anchorY - pl.anchorY;
      if (dx * dx + dy * dy <= COLOC_PX * COLOC_PX) return false;
    }
    return true;
  });
}

/** Compute all label boxes (point labels + segment labels + angle labels)
 *  in one pass so they participate in collision resolution together. */
function computeLabels(
  points: GeometryPoint[],
  segments: GeometrySegment[],
  angles: GeometryAngle[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
): LabelBox[] {
  const labels: LabelBox[] = [];

  // Point labels — offset diagonally up-right by default.
  for (const pt of points) {
    if (!pt.label) continue;
    const [px, py] = toSvg(pt.x, pt.y);
    const fontSize = 13;
    const text = pt.label;
    labels.push({
      key: `pt:${pt.id}`,
      text,
      x: px + LABEL_OFFSET,
      y: py - LABEL_OFFSET,
      w: estimateTextWidth(text, fontSize),
      h: fontSize + 2,
      color: pt.color || '#2563eb',
      fontSize,
      fontWeight: 600,
      textAnchor: 'start',
      dominantBaseline: 'auto',
      // Push further up-right if crowded.
      pushX: 1,
      pushY: -0.6,
      anchorX: px,
      anchorY: py,
      idealX: px + LABEL_OFFSET,
      idealY: py - LABEL_OFFSET,
    });
  }

  // Segment labels — offset perpendicular to the segment by default.
  segments.forEach((seg, i) => {
    if (!seg.label) return;
    const from = ptMap.get(seg.from);
    const to = ptMap.get(seg.to);
    if (!from || !to) return;
    const [x1, y1] = toSvg(from.x, from.y);
    const [x2, y2] = toSvg(to.x, to.y);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const fontSize = 12;
    labels.push({
      key: `seg:${i}`,
      text: seg.label,
      x: mx + nx * LABEL_OFFSET,
      y: my + ny * LABEL_OFFSET,
      w: estimateTextWidth(seg.label, fontSize),
      h: fontSize + 2,
      color: seg.color || '#333',
      fontSize,
      fontStyle: 'italic',
      textAnchor: 'middle',
      dominantBaseline: 'central',
      pushX: nx,
      pushY: ny,
      anchorX: mx,
      anchorY: my,
      idealX: mx + nx * LABEL_OFFSET,
      idealY: my + ny * LABEL_OFFSET,
    });
  });

  // Angle labels — placed along the arc bisector, far enough from the vertex
  // to clear the vertex letter label, and then nudged further by collision
  // resolution if they still overlap.
  angles.forEach((angle, i) => {
    const vertex = ptMap.get(angle.vertex);
    const from = ptMap.get(angle.from);
    const to = ptMap.get(angle.to);
    if (!vertex || !from || !to) return;
    const text = angleDisplayLabel(angle, vertex, from, to);
    if (!text) return;

    const [vx, vy] = toSvg(vertex.x, vertex.y);
    const [fx, fy] = toSvg(from.x, from.y);
    const [tx, ty] = toSvg(to.x, to.y);
    const dxF = fx - vx;
    const dyF = fy - vy;
    const dxT = tx - vx;
    const dyT = ty - vy;
    const lenF = Math.sqrt(dxF * dxF + dyF * dyF) || 1;
    const lenT = Math.sqrt(dxT * dxT + dyT * dyT) || 1;
    const ufx = dxF / lenF;
    const ufy = dyF / lenF;
    const utx = dxT / lenT;
    const uty = dyT / lenT;
    const color = angle.color || '#e74c3c';
    const size = ANGLE_MARKER_SIZE;
    const fontSize = 11;

    let bisectorX: number;
    let bisectorY: number;
    let labelDist: number;
    if (angle.style === 'square') {
      // Right-angle square: bisector is the average of the two ray directions.
      bisectorX = ufx + utx;
      bisectorY = ufy + uty;
      const blen = Math.sqrt(bisectorX * bisectorX + bisectorY * bisectorY) || 1;
      bisectorX /= blen;
      bisectorY /= blen;
      labelDist = size * 2.0;
    } else {
      const angleFrom = Math.atan2(dyF, dxF);
      const angleTo = Math.atan2(dyT, dxT);
      const cross = ufx * uty - ufy * utx;
      const sweepFlag = cross > 0 ? 1 : 0;
      let angleDiff = angleTo - angleFrom;
      if (sweepFlag === 1 && angleDiff < 0) angleDiff += 2 * Math.PI;
      if (sweepFlag === 0 && angleDiff > 0) angleDiff -= 2 * Math.PI;
      const midAngle = angleFrom + angleDiff / 2;
      bisectorX = Math.cos(midAngle);
      bisectorY = Math.sin(midAngle);
      labelDist = size * 2.4;
    }

    const lx = vx + bisectorX * labelDist;
    const ly = vy + bisectorY * labelDist;
    labels.push({
      key: `ang:${i}`,
      text,
      x: lx,
      y: ly,
      w: estimateTextWidth(text, fontSize),
      h: fontSize + 2,
      color,
      fontSize,
      textAnchor: 'middle',
      dominantBaseline: 'central',
      // Push further along the bisector if a collision pushes us out.
      pushX: bisectorX,
      pushY: bisectorY,
      // Anchor: the angle's vertex (so leader lines, if drawn,
      // point at the vertex — the geometric feature being labeled).
      anchorX: vx,
      anchorY: vy,
      // Ideal: where we initially placed it on the bisector.
      idealX: lx,
      idealY: ly,
    });
  });

  // De-dup: if a segment-midpoint label shares its anchor with a labeled
  // point (e.g. chord-as-diameter where the midpoint IS the origin O),
  // drop the segment label. The point label already names the location.
  const deduped = dedupCoLocatedLabels(labels);
  resolveLabelCollisions(deduped);
  return deduped;
}

function renderLabels(labels: LabelBox[]) {
  // Two passes so leader lines render BEHIND text (no character cutting).
  // Pass 1: leader lines for labels displaced far enough from anchor that
  // the connection between label and feature would otherwise be lost.
  const leaders: React.ReactElement[] = [];
  for (const l of labels) {
    const off = anchorOffset(l);
    const distSq = off.dx * off.dx + off.dy * off.dy;
    // Threshold: label center must be at least 1.4× line height away from
    // anchor before we draw a leader. Below that, the label visually
    // hugs its feature and a line would just add noise.
    const threshold = l.h * 1.4;
    if (distSq < threshold * threshold) continue;
    // Stop the leader line at the label's bounding box edge, not at its
    // text-anchor point — otherwise the line would sometimes stab through
    // the text. Approximate by trimming a few px in the direction of the
    // anchor along the label-to-anchor vector.
    const dist = Math.sqrt(distSq);
    const ux = off.dx / dist;
    const uy = off.dy / dist;
    const labelEdgeX = (l.anchorX + off.dx) - ux * (l.h * 0.5);
    const labelEdgeY = (l.anchorY + off.dy) - uy * (l.h * 0.5);
    leaders.push(
      <line
        key={`lead:${l.key}`}
        x1={l.anchorX}
        y1={l.anchorY}
        x2={labelEdgeX}
        y2={labelEdgeY}
        stroke="#94a3b8"
        strokeWidth={0.6}
        strokeDasharray="2,2"
      />,
    );
  }
  // Pass 2: the text itself.
  const texts = labels.map((l) => (
    <text
      key={l.key}
      x={l.x}
      y={l.y}
      textAnchor={l.textAnchor}
      dominantBaseline={l.dominantBaseline}
      fontSize={l.fontSize}
      fontWeight={l.fontWeight}
      fontStyle={l.fontStyle}
      fill={l.color}
    >
      {l.text}
    </text>
  ));
  return [...leaders, ...texts];
}

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildGeometryManifest(props: GeometryRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const points = props.points ?? [];
  const segments = props.segments ?? [];
  const polygons = props.polygons ?? [];
  const circles = props.circles ?? [];
  const angles = props.angles ?? [];

  const ptMap = new Map(points.map((p) => [p.id, p]));

  // Resolve a point id to its human name (its label if set, else the id).
  const pointName = (id: string): string => ptMap.get(id)?.label ?? id;

  polygons.forEach((poly, i) => {
    const hasAllVertices = poly.vertices.every((id) => ptMap.has(id));
    if (!hasAllVertices || poly.vertices.length < 3) return;
    const name = poly.label ? `shape-${featSlug(poly.label)}` : `shape-${i + 1}`;
    // Humanized vertex list, e.g. "ABC" for vertices [A, B, C]
    const vertexNames = poly.vertices.map(pointName);
    const vertexJoined = vertexNames.join('');
    const vertexSpaced = vertexNames.join(' ');
    const n = poly.vertices.length;
    const polyKind = n === 3 ? 'triangle' : n === 4 ? 'quadrilateral' : n === 5 ? 'pentagon' : n === 6 ? 'hexagon' : 'polygon';
    const labels = new Set<string>([
      name,
      `shape-${i + 1}`,
      `shape ${i + 1}`,
      polyKind,
      `the ${polyKind}`,
      `${polyKind} ${vertexJoined}`,
      `${polyKind} ${vertexSpaced}`,
      `polygon ${vertexJoined}`,
    ]);
    if (poly.label) {
      labels.add(poly.label);
      labels.add(`${polyKind} ${poly.label}`);
      labels.add(`the ${poly.label}`);
    }
    entries.push({
      name,
      kind: 'shape',
      description: poly.label
        ? `polygon "${poly.label}" (${poly.vertices.join(', ')})`
        : `polygon ${i + 1} (${poly.vertices.join(', ')})`,
      labels: Array.from(labels),
    });
  });

  circles.forEach((circ, i) => {
    if (!ptMap.has(circ.center)) return;
    const name = circ.label ? `shape-${featSlug(circ.label)}` : `shape-circle-${i + 1}`;
    const centerName = pointName(circ.center);
    const labels = new Set<string>([
      name,
      `shape-circle-${i + 1}`,
      'circle',
      'the circle',
      `circle ${i + 1}`,
      `circle centered at ${centerName}`,
      `circle with center ${centerName}`,
    ]);
    if (circ.label) {
      labels.add(circ.label);
      labels.add(`circle ${circ.label}`);
      labels.add(`the ${circ.label} circle`);
    }
    entries.push({
      name,
      kind: 'shape',
      description: circ.label
        ? `circle "${circ.label}" (center ${circ.center}, radius ${circ.radius})`
        : `circle ${i + 1} (center ${circ.center}, radius ${circ.radius})`,
      labels: Array.from(labels),
    });
  });

  segments.forEach((seg) => {
    if (!ptMap.has(seg.from) || !ptMap.has(seg.to)) return;
    const fromN = pointName(seg.from);
    const toN = pointName(seg.to);
    const pair = `${fromN}${toN}`;
    const revPair = `${toN}${fromN}`;
    const name = `segment-${featSlug(seg.from)}-${featSlug(seg.to)}`;
    const labels = new Set<string>([
      name,
      `segment-${featSlug(seg.from)}-${featSlug(seg.to)}`,
      `segment ${pair}`,
      `segment ${revPair}`,
      `segment-${featSlug(pair)}`,
      `segment-${featSlug(revPair)}`,
      `edge ${pair}`,
      `edge-${featSlug(pair)}`,
      `edge-${featSlug(revPair)}`,
      `side ${pair}`,
      `side-${featSlug(pair)}`,
      `line ${pair}`,
      `line-${featSlug(pair)}`,
      `line-${featSlug(revPair)}`,
      pair,
      revPair,
      `${fromN} to ${toN}`,
      `${fromN}-${toN}`,
    ]);
    if (seg.label) {
      labels.add(seg.label);
      labels.add(`segment ${seg.label}`);
      labels.add(`side ${seg.label}`);
      labels.add(`the ${seg.label} side`);
    }
    entries.push({
      name,
      kind: 'segment',
      description: seg.label
        ? `segment ${seg.from}→${seg.to} labeled "${seg.label}"`
        : `segment ${seg.from}→${seg.to}`,
      labels: Array.from(labels),
    });
  });

  angles.forEach((angle) => {
    const vertex = ptMap.get(angle.vertex);
    if (!vertex || !ptMap.has(angle.from) || !ptMap.has(angle.to)) return;
    const vertexHuman = vertex.label ?? angle.vertex;
    const vertexName = vertex.label ? featSlug(vertex.label) : featSlug(angle.vertex);
    const fromN = pointName(angle.from);
    const toN = pointName(angle.to);
    const labels = new Set<string>([
      `angle-${vertexName}`,
      `angle ${vertexHuman}`,
      `∠${vertexHuman}`,
      `angle at ${vertexHuman}`,
      `angle at vertex ${vertexHuman}`,
      `the angle at ${vertexHuman}`,
      `angle ${fromN}${vertexHuman}${toN}`,
      `∠${fromN}${vertexHuman}${toN}`,
      `angle-${featSlug(`${fromN}${vertexHuman}${toN}`)}`,
    ]);
    if (angle.label) {
      labels.add(angle.label);
    }
    if (angle.style === 'square') {
      labels.add('right angle');
      labels.add('90 degree angle');
      labels.add(`right angle at ${vertexHuman}`);
    }
    entries.push({
      name: `angle-${vertexName}`,
      kind: 'annotation',
      description: `angle at vertex ${vertexHuman} (from ${angle.from} to ${angle.to})`,
      labels: Array.from(labels),
    });
  });

  points.forEach((pt) => {
    const name = pt.label ? `point-${featSlug(pt.label)}` : `point-${featSlug(pt.id)}`;
    const human = pt.label ?? pt.id;
    const slug = featSlug(human);
    // Strip a trailing coordinate annotation like "A (0, 0)" → "A" so
    // the tutor's plain reference ("point A", "vertex A", "C") still
    // resolves. Without this, labels are dominated by coord-bearing
    // strings and bare-letter targets miss. Captures the leading
    // identifier portion before the first parenthesis.
    const bareMatch = human.match(/^([^\(]+?)\s*\(/);
    const bare = bareMatch ? bareMatch[1].trim() : '';
    const bareSlug = bare ? featSlug(bare) : '';
    const labels = new Set<string>([
      name,
      `point-${slug}`,
      `vertex-${slug}`,
      `node-${slug}`,
      `point ${human}`,
      `vertex ${human}`,
      `node ${human}`,
      human,
      `the ${human} point`,
      `the point ${human}`,
      `(${pt.x}, ${pt.y})`,
    ]);
    if (bare && bare !== human) {
      labels.add(bare);
      labels.add(`point ${bare}`);
      labels.add(`vertex ${bare}`);
      labels.add(`node ${bare}`);
      labels.add(`point-${bareSlug}`);
      labels.add(`vertex-${bareSlug}`);
      labels.add(`the point ${bare}`);
      labels.add(`the ${bare} point`);
    }
    entries.push({
      name,
      kind: 'point',
      description: pt.label
        ? `point "${pt.label}" at (${pt.x}, ${pt.y})`
        : `point ${pt.id} at (${pt.x}, ${pt.y})`,
      labels: Array.from(labels),
    });
  });

  return entries;
}

export function GeometryRenderer({
  title,
  points,
  segments = [],
  polygons = [],
  circles = [],
  arcs = [],
  angles = [],
  showGrid = false,
  showAxes = false,
  viewRange,
  className = '',
}: GeometryRendererProps) {
  // Build point lookup map
  const ptMap = useMemo(() => buildPointMap(points), [points]);

  // Auto-compute view range from points (with padding) if not provided.
  // Then expand to match SVG aspect so circles render as circles.
  const range = useMemo(() => {
    let baseRange: { x: [number, number]; y: [number, number] };
    if (viewRange) {
      baseRange = viewRange;
    } else if (points.length === 0) {
      baseRange = { x: [-5, 5], y: [-5, 5] };
    } else {
      let xMin = Infinity;
      let xMax = -Infinity;
      let yMin = Infinity;
      let yMax = -Infinity;

      for (const p of points) {
        if (p.x < xMin) xMin = p.x;
        if (p.x > xMax) xMax = p.x;
        if (p.y < yMin) yMin = p.y;
        if (p.y > yMax) yMax = p.y;
      }

      for (const c of circles) {
        const center = ptMap.get(c.center);
        if (!center) continue;
        xMin = Math.min(xMin, center.x - c.radius);
        xMax = Math.max(xMax, center.x + c.radius);
        yMin = Math.min(yMin, center.y - c.radius);
        yMax = Math.max(yMax, center.y + c.radius);
      }

      if (xMax - xMin < 1) { xMin -= 1; xMax += 1; }
      if (yMax - yMin < 1) { yMin -= 1; yMax += 1; }

      baseRange = {
        x: [xMin - PADDING, xMax + PADDING],
        y: [yMin - PADDING, yMax + PADDING],
      };
    }
    return matchRangeAspect(baseRange);
  }, [viewRange, points, circles, ptMap]);

  // Coordinate transform function
  const toSvg = useMemo(() => makeTransform(range), [range]);

  // Pre-compute label positions with collision resolution across points,
  // segments, and angles. Labels are drawn in a single pass on top of the
  // diagram so they sit above arcs and strokes.
  const labelBoxes = useMemo(
    () => computeLabels(points, segments, angles, ptMap, toSvg),
    [points, segments, angles, ptMap, toSvg],
  );

  return (
    <div className={`geometry-renderer ${className}`}>
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{title}</div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        {/* Background */}
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fafbfc" rx={4} />

        {/* Grid lines (behind everything) */}
        {showGrid && renderGrid(range, toSvg)}

        {/* Axes — pass hasPointAtOrigin so we don't double-label O */}
        {showAxes && renderAxes(range, toSvg, points.some((p) => p.x === 0 && p.y === 0 && !!p.label))}

        {/* Polygons (filled areas behind lines and points) */}
        {polygons.length > 0 && renderPolygons(polygons, ptMap, toSvg, points.filter((p) => !!p.label))}

        {/* Circles */}
        {circles.length > 0 && renderCircles(circles, ptMap, toSvg, range)}

        {/* Arcs */}
        {arcs.length > 0 && renderArcs(arcs, ptMap, toSvg, range)}

        {/* Segments (without labels — labels come later) */}
        {segments.length > 0 && renderSegments(segments, ptMap, toSvg)}

        {/* Angle markers */}
        {angles.length > 0 && renderAngles(angles, ptMap, toSvg)}

        {/* Point dots (without labels) */}
        {renderPointDots(points, toSvg)}

        {/* All labels (point + segment) — collision-resolved, rendered last
            so they sit on top of everything. */}
        {renderLabels(labelBoxes)}
      </svg>
    </div>
  );
}

export default GeometryRenderer;
