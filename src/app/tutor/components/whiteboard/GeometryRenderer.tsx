'use client';

/**
 * Geometry Renderer
 *
 * Renders geometric figures on a coordinate plane using pure SVG.
 * Supports points, segments, polygons, circles, arcs, and angle markers.
 * Maps mathematical coordinates (y-up) to SVG coordinates (y-down).
 */

import { useMemo } from 'react';
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

/** Convert a math-unit distance to pixel distance (x-axis scale) */
function mathToPixelX(range: { x: [number, number] }, dist: number): number {
  const xSpan = range.x[1] - range.x[0] || 1;
  return (dist / xSpan) * SVG_WIDTH;
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
  }

  return <g className="axes">{elements}</g>;
}

/** Render filled polygons */
function renderPolygons(
  polygons: GeometryPolygon[],
  ptMap: Map<string, GeometryPoint>,
  toSvg: (x: number, y: number) => [number, number],
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

    return (
      <g key={`poly-${i}`}>
        <path
          d={d}
          fill={poly.fill || '#4f8cff'}
          fillOpacity={0.15}
          stroke={poly.stroke || '#4f8cff'}
          strokeWidth={2}
        />
        {poly.label && (
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
      <g key={`seg-${i}`}>
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
        {/* Segment label */}
        {seg.label && (
          <text
            x={mx + nx * LABEL_OFFSET}
            y={my + ny * LABEL_OFFSET}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill={seg.color || '#333'}
            fontStyle="italic"
          >
            {seg.label}
          </text>
        )}
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
    const r = mathToPixelX(range, circ.radius);

    let dashArray: string | undefined;
    if (circ.style === 'dashed') dashArray = '6,4';

    return (
      <g key={`circle-${i}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={circ.color || '#4f8cff'}
          strokeWidth={2}
          strokeDasharray={dashArray}
        />
        {circ.label && (
          <text
            x={cx}
            y={cy - r - 8}
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

/** Render angle markers (arc or right-angle square) */
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

    if (angle.style === 'square') {
      // Right angle: draw a small square at the vertex
      const p1x = vx + ufx * size;
      const p1y = vy + ufy * size;
      const p2x = vx + ufx * size + utx * size;
      const p2y = vy + ufy * size + uty * size;
      const p3x = vx + utx * size;
      const p3y = vy + uty * size;

      return (
        <g key={`angle-${i}`}>
          <polyline
            points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
          {angle.label && (
            <text
              x={vx + (ufx + utx) * size * 1.4}
              y={vy + (ufy + uty) * size * 1.4}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fill={color}
            >
              {angle.label}
            </text>
          )}
        </g>
      );
    }

    // Default: arc marker
    // Compute angles in SVG coordinate system (y-down)
    const angleFrom = Math.atan2(dyFrom, dxFrom);
    const angleTo = Math.atan2(dyTo, dxTo);

    // Arc start and end points
    const arcStartX = vx + Math.cos(angleFrom) * size;
    const arcStartY = vy + Math.sin(angleFrom) * size;
    const arcEndX = vx + Math.cos(angleTo) * size;
    const arcEndY = vy + Math.sin(angleTo) * size;

    // Determine sweep direction: use cross product to pick the shorter arc
    const cross = ufx * uty - ufy * utx;
    const sweepFlag = cross > 0 ? 1 : 0;

    // Check if the angle is > 180 degrees
    let angleDiff = angleTo - angleFrom;
    if (sweepFlag === 1 && angleDiff < 0) angleDiff += 2 * Math.PI;
    if (sweepFlag === 0 && angleDiff > 0) angleDiff -= 2 * Math.PI;
    const largeArc = Math.abs(angleDiff) > Math.PI ? 1 : 0;

    const d = `M ${arcStartX},${arcStartY} A ${size},${size} 0 ${largeArc} ${sweepFlag} ${arcEndX},${arcEndY}`;

    // Label position: midpoint of the arc
    const midAngle = angleFrom + angleDiff / 2;
    const labelDist = size * 1.6;

    return (
      <g key={`angle-${i}`}>
        <path d={d} fill="none" stroke={color} strokeWidth={1.5} />
        {angle.label && (
          <text
            x={vx + Math.cos(midAngle) * labelDist}
            y={vy + Math.sin(midAngle) * labelDist}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fill={color}
          >
            {angle.label}
          </text>
        )}
      </g>
    );
  });
}

/** Render points as colored dots with labels */
function renderPoints(
  points: GeometryPoint[],
  toSvg: (x: number, y: number) => [number, number],
) {
  return points.map((pt) => {
    const [px, py] = toSvg(pt.x, pt.y);
    const color = pt.color || '#2563eb';

    return (
      <g key={`pt-${pt.id}`}>
        <circle cx={px} cy={py} r={POINT_RADIUS} fill={color} stroke="#fff" strokeWidth={1.5} />
        {pt.label && (
          <text
            x={px + LABEL_OFFSET}
            y={py - LABEL_OFFSET}
            textAnchor="start"
            dominantBaseline="auto"
            fontSize={13}
            fontWeight={600}
            fill={color}
          >
            {pt.label}
          </text>
        )}
      </g>
    );
  });
}

// ─── Main Component ──────────────────────────────────────────────────────────

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

  // Auto-compute view range from points (with padding) if not provided
  const range = useMemo(() => {
    if (viewRange) return viewRange;

    if (points.length === 0) {
      return { x: [-5, 5] as [number, number], y: [-5, 5] as [number, number] };
    }

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

    // Also consider circle extents
    for (const c of circles) {
      const center = ptMap.get(c.center);
      if (!center) continue;
      xMin = Math.min(xMin, center.x - c.radius);
      xMax = Math.max(xMax, center.x + c.radius);
      yMin = Math.min(yMin, center.y - c.radius);
      yMax = Math.max(yMax, center.y + c.radius);
    }

    // Ensure we have some span even if all points coincide
    if (xMax - xMin < 1) { xMin -= 1; xMax += 1; }
    if (yMax - yMin < 1) { yMin -= 1; yMax += 1; }

    return {
      x: [xMin - PADDING, xMax + PADDING] as [number, number],
      y: [yMin - PADDING, yMax + PADDING] as [number, number],
    };
  }, [viewRange, points, circles, ptMap]);

  // Coordinate transform function
  const toSvg = useMemo(() => makeTransform(range), [range]);

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

        {/* Axes */}
        {showAxes && renderAxes(range, toSvg)}

        {/* Polygons (filled areas behind lines and points) */}
        {polygons.length > 0 && renderPolygons(polygons, ptMap, toSvg)}

        {/* Circles */}
        {circles.length > 0 && renderCircles(circles, ptMap, toSvg, range)}

        {/* Arcs */}
        {arcs.length > 0 && renderArcs(arcs, ptMap, toSvg, range)}

        {/* Segments */}
        {segments.length > 0 && renderSegments(segments, ptMap, toSvg)}

        {/* Angle markers */}
        {angles.length > 0 && renderAngles(angles, ptMap, toSvg)}

        {/* Points (on top of everything) */}
        {renderPoints(points, toSvg)}
      </svg>
    </div>
  );
}

export default GeometryRenderer;
