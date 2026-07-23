'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Diagram Renderer
 *
 * Renders physics diagrams including vectors, free body diagrams,
 * motion diagrams, and other visual elements.
 */

import { useMemo } from 'react';
import { Mafs, Vector, Point, Text, Line, useMovablePoint, Polygon } from 'mafs';
import 'mafs/core.css';
import type { Point as PointType } from '@/lib/knowledge/types';
import { deoverlapLabels, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';
import { EquationRenderer } from './EquationRenderer';

// ── Label collision-avoidance (2026-07-19 renderer label-collision audit) ──
// Mafs <Text> takes math coordinates, but deoverlapLabels reasons in pixels
// (font sizes are px). mafsLabelSpace mirrors Mafs' "contain" view transform
// at the 500px SSR width — exact under the server-side collision harness,
// proportionally right in the browser — so each diagram runs ONE de-overlap
// pass in pixel space over every data-positioned label, with the fixed
// geometry (shafts, point markers, static captions) as obstacles, and maps
// only the resolved y back to math coordinates. Labels that collide with
// nothing keep their historical positions bit-for-bit.

const MAFS_SSR_WIDTH = 500;
const MAFS_VIEWBOX_PADDING = 0.5; // Mafs viewBox.padding default

interface MafsLabelSpace {
  toPx(x: number, y: number): [number, number];
  yToMath(pxY: number): number;
  /** Pixels per math unit (uniform — "contain" keeps both axes equal). */
  pxPerUnit: number;
  bounds: { width: number; height: number };
}

function mafsLabelSpace(
  viewBox: { x: [number, number]; y: [number, number] },
  height: number,
): MafsLabelSpace {
  const width = MAFS_SSR_WIDTH;
  let xMin = viewBox.x[0] - MAFS_VIEWBOX_PADDING;
  let xMax = viewBox.x[1] + MAFS_VIEWBOX_PADDING;
  let yMin = viewBox.y[0] - MAFS_VIEWBOX_PADDING;
  let yMax = viewBox.y[1] + MAFS_VIEWBOX_PADDING;
  const aspect = width / height;
  const aoiAspect = (xMax - xMin) / (yMax - yMin);
  if (aoiAspect > aspect) {
    const yCenter = (yMax + yMin) / 2;
    const half = (xMax - xMin) / aspect / 2;
    yMin = yCenter - half;
    yMax = yCenter + half;
  } else {
    const xCenter = (xMax + xMin) / 2;
    const half = ((yMax - yMin) * aspect) / 2;
    xMin = xCenter - half;
    xMax = xCenter + half;
  }
  const sx = width / (xMax - xMin);
  const sy = height / (yMax - yMin);
  return {
    toPx: (x, y) => [(x - xMin) * sx, (yMax - y) * sy],
    yToMath: (pxY) => yMax - pxY / sy,
    pxPerUnit: sy,
    bounds: { width, height },
  };
}

interface DiagramLabel {
  key: string;
  /** Seed position in math coordinates (the historical placement). */
  x: number;
  y: number;
  text: string;
  fontSize: number;
  preferDir?: 'up' | 'down';
}

function markerObstacle(space: MafsLabelSpace, x: number, y: number, rPx = 5): DeoverlapObstacle {
  const [px, py] = space.toPx(x, y);
  return { left: px - rPx, right: px + rPx, top: py - rPx, bottom: py + rPx };
}

function textObstacle(
  space: MafsLabelSpace,
  x: number,
  y: number,
  text: string,
  fontSize: number,
): DeoverlapObstacle {
  const [px, py] = space.toPx(x, y);
  const w = text.length * fontSize * 0.55;
  const h = fontSize * 1.2;
  return { left: px - w / 2, right: px + w / 2, top: py - h / 2, bottom: py + h / 2 };
}

/** Arrow/axis shafts as chunked obstacle boxes (a diagonal shaft's single
 *  bbox would block far more area than the line covers). Near-vertical
 *  shafts are skipped: de-overlap nudges vertically only, so a tall
 *  vertical band would chase a label to the canvas edge instead of
 *  clearing it — callers keep labels off vertical shafts by seed x. */
function shaftObstacles(
  space: MafsLabelSpace,
  from: [number, number],
  to: [number, number],
  padPx = 3,
): DeoverlapObstacle[] {
  const [x1, y1] = space.toPx(from[0], from[1]);
  const [x2, y2] = space.toPx(to[0], to[1]);
  if (Math.abs(x2 - x1) < 8 && Math.abs(y2 - y1) > 24) return [];
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(1, Math.ceil(len / 12));
  const boxes: DeoverlapObstacle[] = [];
  for (let i = 0; i < n; i++) {
    const ax = x1 + ((x2 - x1) * i) / n;
    const ay = y1 + ((y2 - y1) * i) / n;
    const bx = x1 + ((x2 - x1) * (i + 1)) / n;
    const by = y1 + ((y2 - y1) * (i + 1)) / n;
    boxes.push({
      left: Math.min(ax, bx) - padPx,
      right: Math.max(ax, bx) + padPx,
      top: Math.min(ay, by) - padPx,
      bottom: Math.max(ay, by) + padPx,
    });
  }
  return boxes;
}

/** One de-overlap pass; returns resolved math positions keyed by label key.
 *  Non-colliding labels come back reference-equal from deoverlapLabels, so
 *  their original math coordinates are returned untouched. */
function layoutDiagramLabels(
  space: MafsLabelSpace,
  labels: DiagramLabel[],
  obstacles: DeoverlapObstacle[],
): Map<string, { x: number; y: number }> {
  const seeded = labels.map((l) => {
    const [x, y] = space.toPx(l.x, l.y);
    return { ...l, x, y };
  });
  const resolved = deoverlapLabels(seeded, space.bounds, {
    baseline: 'middle',
    obstacles,
    pad: 2,
    edgePad: 2,
  });
  const out = new Map<string, { x: number; y: number }>();
  labels.forEach((l, i) => {
    out.set(
      l.key,
      resolved[i] === seeded[i] ? { x: l.x, y: l.y } : { x: l.x, y: space.yToMath(resolved[i].y) },
    );
  });
  return out;
}

interface VectorRendererProps {
  from: PointType;
  to: PointType;
  label?: string;
  color?: string;
}

// `ssr` on every <Mafs> below: render at the 500px SSR default width when no
// container measurement exists yet — required for the server-side label-
// collision harness (2026-07-19 audit) and paints one frame earlier in the
// browser. Final client geometry is unchanged (the resize observer takes over).
export function VectorRenderer({ from, to, label, color = '#2563eb' }: VectorRendererProps) {
  return (
    <Mafs ssr height={200} viewBox={{ x: [-5, 5], y: [-5, 5] }}>
      <Vector
        tail={[from.x, from.y]}
        tip={[to.x, to.y]}
        color={color}
        weight={3}
      />
      {label && (
        <Text
          x={(from.x + to.x) / 2 + 0.3}
          y={(from.y + to.y) / 2 + 0.3}
          size={16}
        >
          {label}
        </Text>
      )}
      <Point x={from.x} y={from.y} color={color} />
    </Mafs>
  );
}

/**
 * Multi-Vector Diagram
 *
 * Shows multiple vectors for comparing velocities, forces, or any vector quantities.
 * Can display vectors from a common origin or different origins.
 * Optionally shows the resultant (sum) vector.
 */
interface VectorData {
  magnitude: number;
  direction: number; // degrees from positive x-axis (0 = right, 90 = up)
  label: string;
  color?: string;
}

interface VectorDiagramProps {
  title?: string;
  vectors: VectorData[];
  showResultant?: boolean;
  resultantLabel?: string;
  scale?: number; // pixels per unit
  showAxes?: boolean;
  showAngleLabels?: boolean;
}

export function VectorDiagram({
  title = 'Vector Diagram',
  vectors,
  showResultant = false,
  resultantLabel = 'Resultant',
  scale = 1,
  showAxes = true,
  showAngleLabels = true,
}: VectorDiagramProps) {
  // Default colors for vectors
  const defaultColors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

  // Calculate vector components
  const vectorData = useMemo(() => {
    return vectors.map((v, index) => {
      const rad = (v.direction * Math.PI) / 180;
      const scaledMag = v.magnitude * scale;
      return {
        ...v,
        color: v.color || defaultColors[index % defaultColors.length],
        dx: Math.cos(rad) * scaledMag,
        dy: Math.sin(rad) * scaledMag,
        rad,
      };
    });
  }, [vectors, scale]);

  // Calculate resultant vector
  const resultant = useMemo(() => {
    const totalX = vectorData.reduce((sum, v) => sum + v.dx, 0);
    const totalY = vectorData.reduce((sum, v) => sum + v.dy, 0);
    const magnitude = Math.sqrt(totalX * totalX + totalY * totalY);
    const direction = Math.atan2(totalY, totalX) * (180 / Math.PI);
    return { dx: totalX, dy: totalY, magnitude, direction };
  }, [vectorData]);

  // Calculate view bounds
  const viewRange = useMemo(() => {
    const allX = vectorData.map(v => Math.abs(v.dx));
    const allY = vectorData.map(v => Math.abs(v.dy));
    if (showResultant) {
      allX.push(Math.abs(resultant.dx));
      allY.push(Math.abs(resultant.dy));
    }
    const maxX = Math.max(...allX, 1) * 1.5;
    const maxY = Math.max(...allY, 1) * 1.5;
    const range = Math.max(maxX, maxY);
    return range;
  }, [vectorData, resultant, showResultant]);

  // Calculate label positions to avoid overlap
  const getLabelPosition = (dx: number, dy: number, index: number) => {
    const length = Math.sqrt(dx * dx + dy * dy);
    const normalizedX = dx / (length || 1);
    const normalizedY = dy / (length || 1);

    // Position label at the end of the vector, slightly offset
    const labelDist = length + viewRange * 0.12;
    const perpOffset = viewRange * 0.08 * (index % 2 === 0 ? 1 : -1); // Alternate sides

    return {
      x: normalizedX * labelDist - normalizedY * perpOffset,
      y: normalizedY * labelDist + normalizedX * perpOffset,
    };
  };

  // De-overlap pass (2026-07-19 audit): tip labels, angle labels and the
  // resultant label in one pass; shafts, origin marker and compass letters
  // as obstacles. Near-parallel vectors used to composite both tip labels
  // and pile every angle label onto the same spot near the origin.
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace({ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }, 320);
    const labels: DiagramLabel[] = [];
    vectorData.forEach((v, index) => {
      const seed = getLabelPosition(v.dx, v.dy, index);
      labels.push({
        key: `v-${index}`,
        x: seed.x,
        y: seed.y,
        text: v.label,
        fontSize: 12,
        preferDir: v.dy >= 0 ? 'up' : 'down',
      });
      if (showAngleLabels && v.direction !== 0 && v.direction !== 90 && v.direction !== 180 && v.direction !== 270) {
        labels.push({
          key: `ang-${index}`,
          x: Math.cos(v.rad / 2) * viewRange * 0.25,
          y: Math.sin(v.rad / 2) * viewRange * 0.25,
          text: `${Math.round(v.direction)}°`,
          fontSize: 10,
          preferDir: Math.sin(v.rad / 2) >= 0 ? 'up' : 'down',
        });
      }
    });
    if (showResultant && (resultant.dx !== 0 || resultant.dy !== 0)) {
      labels.push({
        key: 'res',
        x: resultant.dx * 1.15,
        y: resultant.dy * 1.15,
        text: resultantLabel,
        fontSize: 12,
        preferDir: resultant.dy >= 0 ? 'up' : 'down',
      });
    }
    const obstacles: DeoverlapObstacle[] = [markerObstacle(space, 0, 0)];
    vectorData.forEach((v) => obstacles.push(...shaftObstacles(space, [0, 0], [v.dx, v.dy])));
    if (showResultant && (resultant.dx !== 0 || resultant.dy !== 0)) {
      obstacles.push(...shaftObstacles(space, [0, 0], [resultant.dx, resultant.dy]));
    }
    if (showAxes) {
      obstacles.push(
        textObstacle(space, viewRange * 0.85, -viewRange * 0.1, 'E', 12),
        textObstacle(space, -viewRange * 0.85, -viewRange * 0.1, 'W', 12),
        textObstacle(space, viewRange * 0.05, viewRange * 0.85, 'N', 12),
        textObstacle(space, viewRange * 0.05, -viewRange * 0.85, 'S', 12),
      );
    }
    return layoutDiagramLabels(space, labels, obstacles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vectorData, viewRange, showAngleLabels, showResultant, resultant, resultantLabel, showAxes]);

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2"><InlineMathText text={title} /></h4>
      <Mafs
        ssr
        height={320}
        viewBox={{ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }}
      >
        {/* Axes */}
        {showAxes && (
          <>
            <Line.Segment
              point1={[-viewRange * 0.9, 0]}
              point2={[viewRange * 0.9, 0]}
              color="#94a3b8"
              weight={1}
            />
            <Line.Segment
              point1={[0, -viewRange * 0.9]}
              point2={[0, viewRange * 0.9]}
              color="#94a3b8"
              weight={1}
            />
            {/* Axis labels */}
            <Text x={viewRange * 0.85} y={-viewRange * 0.1} size={12}>E</Text>
            <Text x={-viewRange * 0.85} y={-viewRange * 0.1} size={12}>W</Text>
            <Text x={viewRange * 0.05} y={viewRange * 0.85} size={12}>N</Text>
            <Text x={viewRange * 0.05} y={-viewRange * 0.85} size={12}>S</Text>
          </>
        )}

        {/* Origin point */}
        <Point x={0} y={0} color="#374151" />

        {/* Draw each vector */}
        {vectorData.map((v, index) => {
          const labelPos = labelLayout.get(`v-${index}`) ?? getLabelPosition(v.dx, v.dy, index);
          const angPos = labelLayout.get(`ang-${index}`);
          return (
            <g key={index}>
              <Vector
                tail={[0, 0]}
                tip={[v.dx, v.dy]}
                color={v.color}
                weight={3}
              />
              {/* Vector label */}
              <Text x={labelPos.x} y={labelPos.y} size={12}>
                {v.label}
              </Text>
              {/* Angle arc indicator */}
              {showAngleLabels && v.direction !== 0 && v.direction !== 90 && v.direction !== 180 && v.direction !== 270 && angPos && (
                <Text
                  x={angPos.x}
                  y={angPos.y}
                  size={10}
                >
                  {Math.round(v.direction)}°
                </Text>
              )}
            </g>
          );
        })}

        {/* Resultant vector */}
        {showResultant && (resultant.dx !== 0 || resultant.dy !== 0) && (
          <>
            <Vector
              tail={[0, 0]}
              tip={[resultant.dx, resultant.dy]}
              color="#7c3aed"
              weight={4}
              style="dashed"
            />
            <Text
              x={(labelLayout.get('res') ?? { x: resultant.dx * 1.15, y: resultant.dy * 1.15 }).x}
              y={(labelLayout.get('res') ?? { x: resultant.dx * 1.15, y: resultant.dy * 1.15 }).y}
              size={12}
            >
              {resultantLabel}
            </Text>
          </>
        )}
      </Mafs>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-3 text-sm">
        {vectorData.map((v, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-4 h-1 rounded"
              style={{ backgroundColor: v.color }}
            />
            <span className="text-gray-700">
              {v.label}: {v.magnitude}{scale !== 1 ? '' : ''}
              {v.direction !== 0 && ` @ ${v.direction}°`}
            </span>
          </div>
        ))}
        {showResultant && (resultant.dx !== 0 || resultant.dy !== 0) && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 rounded bg-purple-600" style={{ borderStyle: 'dashed' }} />
            <span className="text-gray-700">
              {resultantLabel}: {resultant.magnitude.toFixed(1)} @ {resultant.direction.toFixed(0)}°
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Free Body Diagram
 */
interface Force {
  magnitude: number;
  direction: number; // degrees from positive x-axis
  label: string;
  color?: string;
}

interface FreeBodyDiagramProps {
  forces: Force[];
  objectLabel?: string;
  showNet?: boolean;
  scale?: number;
}

export function FreeBodyDiagram({
  forces,
  objectLabel = 'Object',
  showNet = false,
  scale: scaleProp = 1,
}: FreeBodyDiagramProps) {
  // Normalize scale so vectors are always a readable size (target ~3 units length)
  const maxMag = Math.max(...forces.map((f) => f.magnitude), 1);
  const normalizedScale = maxMag > 0 ? 3 / maxMag : 1;
  const scale = scaleProp !== 1 ? scaleProp : normalizedScale;

  // Calculate vector components with better label positioning
  const vectors = useMemo(() => {
    return forces.map((force) => {
      const rad = (force.direction * Math.PI) / 180;
      const dx = Math.cos(rad) * force.magnitude * scale;
      const dy = Math.sin(rad) * force.magnitude * scale;

      const length = Math.sqrt(dx * dx + dy * dy);
      // Place label past arrow tip with perpendicular offset for readability
      const labelDistance = length + 1.2;
      const perpOffset = 0.6;

      const perpX = -dy / (length || 1) * perpOffset;
      const perpY = dx / (length || 1) * perpOffset;

      return {
        ...force,
        dx,
        dy,
        labelX: (dx / (length || 1)) * labelDistance + perpX,
        labelY: (dy / (length || 1)) * labelDistance + perpY,
      };
    });
  }, [forces, scale]);

  // Calculate net force
  const netForce = useMemo(() => {
    const netX = vectors.reduce((sum, v) => sum + v.dx, 0);
    const netY = vectors.reduce((sum, v) => sum + v.dy, 0);
    return { dx: netX, dy: netY };
  }, [vectors]);

  const viewRange = 6; // Fixed view range since we normalize vector lengths

  // De-overlap pass (2026-07-19 audit): same-direction forces used to put
  // both labels on the identical spot past the shared tip, and the object
  // caption sat ON the horizontal/vertical shafts. Caption gets a
  // width-aware seed x when a vertical shaft exists (vertical nudging
  // can't clear a vertical band); everything else resolves vertically.
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace({ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }, 300);
    const s = space.pxPerUnit;
    const hasVerticalShaft = vectors.some((v) => {
      const [x1, y1] = space.toPx(0, 0);
      const [x2, y2] = space.toPx(v.dx, v.dy);
      return Math.abs(x2 - x1) < 8 && Math.abs(y2 - y1) > 24;
    });
    const captionHalfW = (objectLabel.length * 11 * 0.55) / 2;
    const captionX = hasVerticalShaft ? Math.max(0.6, (captionHalfW + 8) / s) : 0.6;
    const labels: DiagramLabel[] = [
      { key: 'obj', x: captionX, y: 0, text: objectLabel, fontSize: 11, preferDir: 'up' },
      ...vectors.map((v, i): DiagramLabel => ({
        key: `f-${i}`,
        x: v.labelX,
        y: v.labelY,
        text: v.label,
        fontSize: 13,
        preferDir: v.dy < -0.01 ? 'down' : 'up',
      })),
    ];
    const showNetVector = showNet && (Math.abs(netForce.dx) > 0.01 || Math.abs(netForce.dy) > 0.01);
    if (showNetVector) {
      labels.push({
        key: 'net',
        x: netForce.dx * 1.3 + 0.5,
        y: netForce.dy * 1.3 + 0.5,
        text: 'F_net',
        fontSize: 13,
        preferDir: netForce.dy >= 0 ? 'up' : 'down',
      });
    }
    const obstacles: DeoverlapObstacle[] = [];
    vectors.forEach((v) => obstacles.push(...shaftObstacles(space, [0, 0], [v.dx, v.dy])));
    if (showNetVector) obstacles.push(...shaftObstacles(space, [0, 0], [netForce.dx, netForce.dy]));
    return layoutDiagramLabels(space, labels, obstacles);
  }, [vectors, netForce, showNet, objectLabel]);
  const objPos = labelLayout.get('obj') ?? { x: 0.6, y: 0 };
  const netPos = labelLayout.get('net') ?? { x: netForce.dx * 1.3 + 0.5, y: netForce.dy * 1.3 + 0.5 };

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">Free Body Diagram</h4>
      <Mafs
        ssr
        height={300}
        viewBox={{ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }}
      >
        {/* Central object */}
        <Point x={0} y={0} color="#64748b" />
        <Text x={objPos.x} y={objPos.y} size={11}>{objectLabel}</Text>

        {/* Force vectors */}
        {vectors.map((v, index) => {
          const labelPos = labelLayout.get(`f-${index}`) ?? { x: v.labelX, y: v.labelY };
          return (
            <g key={index}>
              <Vector
                tail={[0, 0]}
                tip={[v.dx, v.dy]}
                color={v.color || '#2563eb'}
                weight={3}
              />
              <Text
                x={labelPos.x}
                y={labelPos.y}
                size={13}
              >
                {v.label}
              </Text>
            </g>
          );
        })}

        {/* Net force vector */}
        {showNet && (Math.abs(netForce.dx) > 0.01 || Math.abs(netForce.dy) > 0.01) && (
          <>
            <Vector
              tail={[0, 0]}
              tip={[netForce.dx, netForce.dy]}
              color="#dc2626"
              weight={4}
              style="dashed"
            />
            <Text
              x={netPos.x}
              y={netPos.y}
              size={13}
            >
              F_net
            </Text>
          </>
        )}
      </Mafs>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-2 text-sm text-gray-700">
        {forces.map((force, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: force.color || '#2563eb' }}
            />
            <span className="font-medium">{force.label}: {force.magnitude} N</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Motion Diagram (shows position at equal time intervals)
 */
interface MotionDiagramProps {
  positions: Array<{ x: number; y: number; t: number }>;
  showVelocityVectors?: boolean;
  title?: string;
}

export function MotionDiagram({
  positions,
  showVelocityVectors = true,
  title = 'Motion Diagram',
}: MotionDiagramProps) {
  // Calculate bounds
  const bounds = useMemo(() => {
    const xs = positions.map((p) => p.x);
    const ys = positions.map((p) => p.y);
    const padding = 2;
    return {
      x: [Math.min(...xs) - padding, Math.max(...xs) + padding] as [number, number],
      y: [Math.min(...ys) - padding, Math.max(...ys) + padding] as [number, number],
    };
  }, [positions]);

  // Calculate velocity vectors
  const velocities = useMemo(() => {
    if (!showVelocityVectors || positions.length < 2) return [];
    return positions.slice(0, -1).map((pos, i) => {
      const next = positions[i + 1];
      const dt = next.t - pos.t;
      if (dt === 0) return { from: pos, dx: 0, dy: 0 };
      return {
        from: pos,
        dx: (next.x - pos.x) / dt * 0.5, // Scale for visibility
        dy: (next.y - pos.y) / dt * 0.5,
      };
    });
  }, [positions, showVelocityVectors]);

  // De-overlap pass (2026-07-19 audit): decelerating motion bunches the
  // dots up, compositing adjacent t=…s captions. Dots and velocity shafts
  // are obstacles; captions stack downward away from the dot row.
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace(bounds, 250);
    const labels: DiagramLabel[] = positions.map((pos, i): DiagramLabel => ({
      key: `t-${i}`,
      x: pos.x,
      y: pos.y - 0.5,
      text: `t=${pos.t}s`,
      fontSize: 10,
      preferDir: 'down',
    }));
    const obstacles: DeoverlapObstacle[] = positions.map((pos) => markerObstacle(space, pos.x, pos.y));
    velocities.forEach((v) =>
      obstacles.push(...shaftObstacles(space, [v.from.x, v.from.y], [v.from.x + v.dx, v.from.y + v.dy])),
    );
    return layoutDiagramLabels(space, labels, obstacles);
  }, [positions, velocities, bounds]);

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2"><InlineMathText text={title} /></h4>
      <Mafs ssr height={250} viewBox={bounds}>
        {/* Ground line */}
        <Line.Segment
          point1={[bounds.x[0], 0]}
          point2={[bounds.x[1], 0]}
          color="#94a3b8"
        />

        {/* Position dots */}
        {positions.map((pos, index) => {
          const tPos = labelLayout.get(`t-${index}`) ?? { x: pos.x, y: pos.y - 0.5 };
          return (
            <g key={index}>
              <Point
                x={pos.x}
                y={pos.y}
                color={index === 0 ? '#16a34a' : index === positions.length - 1 ? '#dc2626' : '#2563eb'}
              />
              <Text x={tPos.x} y={tPos.y} size={10}>
                t={pos.t}s
              </Text>
            </g>
          );
        })}

        {/* Connect with dashed line */}
        {positions.slice(0, -1).map((pos, index) => (
          <Line.Segment
            key={`line-${index}`}
            point1={[pos.x, pos.y]}
            point2={[positions[index + 1].x, positions[index + 1].y]}
            color="#cbd5e1"
            style="dashed"
          />
        ))}

        {/* Velocity vectors */}
        {velocities.map((v, index) => (
          <Vector
            key={`vel-${index}`}
            tail={[v.from.x, v.from.y]}
            tip={[v.from.x + v.dx, v.from.y + v.dy]}
            color="#9333ea"
            weight={2}
          />
        ))}
      </Mafs>

      <div className="flex gap-4 justify-center mt-2 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-600" />
          Start
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-600" />
          End
        </span>
        {showVelocityVectors && (
          <span className="flex items-center gap-1">
            <div className="w-4 h-1 bg-purple-600" />
            Velocity
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Projectile Motion Diagram
 * Shows trajectory with velocity component vectors at multiple points
 */
interface ProjectileMotionProps {
  v0: number;       // Initial velocity (m/s)
  angle: number;    // Launch angle (degrees)
  g?: number;       // Gravity (m/s²)
  showComponents?: boolean;
  showVelocityAtPoints?: boolean; // Show velocity vectors along path
}

export function ProjectileMotionDiagram({
  v0,
  angle,
  g = 9.8,
  showComponents = true,
  showVelocityAtPoints = true,
}: ProjectileMotionProps) {
  const rad = (angle * Math.PI) / 180;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);
  const totalTime = (2 * v0y) / g;

  // Calculate trajectory points for smooth curve
  const positions = useMemo(() => {
    const points: Array<{ x: number; y: number; t: number }> = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * totalTime;
      const x = v0x * t;
      const y = v0y * t - 0.5 * g * t * t;
      if (y >= 0) {
        points.push({ x, y, t: Math.round(t * 100) / 100 });
      }
    }
    return points;
  }, [v0x, v0y, g, totalTime]);

  // Calculate velocity vectors at key points along trajectory
  const velocityPoints = useMemo(() => {
    const points: Array<{ x: number; y: number; vx: number; vy: number; t: number }> = [];
    // Show at 0%, 25%, 50%, 75%, 100% of flight
    const times = [0, 0.25, 0.5, 0.75, 1.0];

    for (const frac of times) {
      const t = frac * totalTime;
      const x = v0x * t;
      const y = v0y * t - 0.5 * g * t * t;
      const vy = v0y - g * t; // Vertical velocity at time t

      if (y >= -0.1) { // Allow slight negative for landing point
        points.push({
          x,
          y: Math.max(0, y),
          vx: v0x, // Horizontal velocity stays constant
          vy,
          t: Math.round(t * 100) / 100,
        });
      }
    }
    return points;
  }, [v0x, v0y, g, totalTime]);

  // Calculate range and max height for bounds
  const range = (v0 * v0 * Math.sin(2 * rad)) / g;
  const maxHeight = (v0y * v0y) / (2 * g);
  const vectorScale = range / (v0 * 3); // Scale vectors relative to diagram size
  const viewBox = {
    x: [-3, range + 5] as [number, number],
    y: [-2, maxHeight + 4] as [number, number],
  };

  // De-overlap pass (2026-07-19 audit): the v₀/θ/max-height/range captions
  // share the pass; key-point + velocity-point markers and the component-
  // vector shafts are obstacles (low flat arcs crowd all four together).
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace(
      { x: [-3, range + 5], y: [-2, maxHeight + 4] },
      300,
    );
    const labels: DiagramLabel[] = [
      { key: 'v0', x: v0x * 0.15, y: v0y * 0.15 + 2, text: `v₀ = ${v0} m/s`, fontSize: 12, preferDir: 'up' },
      { key: 'theta', x: 2, y: 0.8, text: `θ = ${angle}°`, fontSize: 12, preferDir: 'up' },
      {
        key: 'maxh',
        x: range / 2,
        y: maxHeight + 1.2,
        text: `Max height: ${Math.round(maxHeight * 10) / 10}m`,
        fontSize: 11,
        preferDir: 'up',
      },
      {
        key: 'range',
        x: range,
        y: -1.2,
        text: `Range: ${Math.round(range * 10) / 10}m`,
        fontSize: 11,
        preferDir: 'down',
      },
    ];
    const obstacles: DeoverlapObstacle[] = [
      markerObstacle(space, 0, 0),
      markerObstacle(space, range / 2, maxHeight),
      markerObstacle(space, range, 0),
    ];
    if (showVelocityAtPoints) {
      for (const pt of velocityPoints) {
        obstacles.push(markerObstacle(space, pt.x, pt.y));
        obstacles.push(...shaftObstacles(space, [pt.x, pt.y], [pt.x + pt.vx * vectorScale, pt.y]));
        if (Math.abs(pt.vy) > 0.5) {
          obstacles.push(...shaftObstacles(space, [pt.x, pt.y], [pt.x, pt.y + pt.vy * vectorScale]));
        }
        obstacles.push(
          ...shaftObstacles(space, [pt.x, pt.y], [pt.x + pt.vx * vectorScale, pt.y + pt.vy * vectorScale]),
        );
      }
    }
    return layoutDiagramLabels(space, labels, obstacles);
  }, [v0, v0x, v0y, angle, range, maxHeight, vectorScale, velocityPoints, showVelocityAtPoints]);
  const v0Pos = labelLayout.get('v0') ?? { x: v0x * 0.15, y: v0y * 0.15 + 2 };
  const thetaPos = labelLayout.get('theta') ?? { x: 2, y: 0.8 };
  const maxhPos = labelLayout.get('maxh') ?? { x: range / 2, y: maxHeight + 1.2 };
  const rangePos = labelLayout.get('range') ?? { x: range, y: -1.2 };

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">Projectile Motion</h4>
      <Mafs ssr height={300} viewBox={viewBox}>
        {/* Ground */}
        <Line.Segment
          point1={[viewBox.x[0], 0]}
          point2={[viewBox.x[1], 0]}
          color="#94a3b8"
          weight={2}
        />

        {/* Trajectory curve */}
        {positions.slice(0, -1).map((pos, index) => (
          <Line.Segment
            key={`traj-${index}`}
            point1={[pos.x, pos.y]}
            point2={[positions[index + 1].x, positions[index + 1].y]}
            color="#64748b"
            weight={2}
          />
        ))}

        {/* Velocity vectors at multiple points */}
        {showVelocityAtPoints && velocityPoints.map((pt, index) => (
          <g key={`vel-pt-${index}`}>
            {/* Position dot */}
            <Point x={pt.x} y={pt.y} color="#1e40af" />

            {/* Horizontal component (constant - blue) */}
            <Vector
              tail={[pt.x, pt.y]}
              tip={[pt.x + pt.vx * vectorScale, pt.y]}
              color="#2563eb"
              weight={2}
            />

            {/* Vertical component (changes - red) */}
            {Math.abs(pt.vy) > 0.5 && (
              <Vector
                tail={[pt.x, pt.y]}
                tip={[pt.x, pt.y + pt.vy * vectorScale]}
                color="#dc2626"
                weight={2}
              />
            )}

            {/* Resultant velocity (green) */}
            <Vector
              tail={[pt.x, pt.y]}
              tip={[pt.x + pt.vx * vectorScale, pt.y + pt.vy * vectorScale]}
              color="#16a34a"
              weight={2}
            />
          </g>
        ))}

        {/* Initial velocity label */}
        <Text x={v0Pos.x} y={v0Pos.y} size={12}>
          v₀ = {v0} m/s
        </Text>

        {/* Angle label */}
        <Text x={thetaPos.x} y={thetaPos.y} size={12}>
          θ = {angle}°
        </Text>

        {/* Key points labels */}
        <Point x={0} y={0} color="#16a34a" />
        <Point x={range / 2} y={maxHeight} color="#ea580c" />
        <Point x={range} y={0} color="#dc2626" />

        {/* Max height and range labels */}
        <Text x={maxhPos.x} y={maxhPos.y} size={11}>
          Max height: {Math.round(maxHeight * 10) / 10}m
        </Text>
        <Text x={rangePos.x} y={rangePos.y} size={11}>
          Range: {Math.round(range * 10) / 10}m
        </Text>
      </Mafs>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-2 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-600" />
          Horizontal (constant)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-red-600" />
          Vertical (changes)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-600" />
          Resultant
        </span>
      </div>
    </div>
  );
}


/**
 * Coordinate System Diagram (for explaining reference frames)
 */
interface CoordinateSystemProps {
  origin?: PointType;
  showLabels?: boolean;
  vectors?: Array<{ to: PointType; label: string; color?: string }>;
}

export function CoordinateSystemDiagram({
  origin = { x: 0, y: 0 },
  showLabels = true,
  vectors = [],
}: CoordinateSystemProps) {
  // De-overlap pass (2026-07-19 audit): vector labels converge when the
  // model emits nearby tips; axis letters and shafts are obstacles.
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace({ x: [-5, 5], y: [-5, 5] }, 250);
    const labels: DiagramLabel[] = vectors.map((v, i): DiagramLabel => ({
      key: `v-${i}`,
      x: v.to.x + 0.3,
      y: v.to.y + 0.3,
      text: v.label,
      fontSize: 14,
      preferDir: v.to.y >= origin.y ? 'up' : 'down',
    }));
    const obstacles: DeoverlapObstacle[] = [
      ...shaftObstacles(space, [origin.x, origin.y], [origin.x + 4, origin.y]),
      ...shaftObstacles(space, [origin.x, origin.y], [origin.x, origin.y + 4]),
    ];
    if (showLabels) {
      obstacles.push(
        textObstacle(space, origin.x + 4.3, origin.y, 'x', 16),
        textObstacle(space, origin.x, origin.y + 4.3, 'y', 16),
        textObstacle(space, origin.x - 0.3, origin.y - 0.3, 'O', 14),
      );
    }
    vectors.forEach((v) => obstacles.push(...shaftObstacles(space, [origin.x, origin.y], [v.to.x, v.to.y])));
    return layoutDiagramLabels(space, labels, obstacles);
  }, [vectors, origin, showLabels]);

  return (
    <div className="diagram-container">
      <Mafs ssr height={250} viewBox={{ x: [-5, 5], y: [-5, 5] }}>
        {/* Axes */}
        <Vector tail={[origin.x, origin.y]} tip={[origin.x + 4, origin.y]} color="#64748b" weight={2} />
        <Vector tail={[origin.x, origin.y]} tip={[origin.x, origin.y + 4]} color="#64748b" weight={2} />

        {showLabels && (
          <>
            <Text x={origin.x + 4.3} y={origin.y} size={16}>x</Text>
            <Text x={origin.x} y={origin.y + 4.3} size={16}>y</Text>
            <Text x={origin.x - 0.3} y={origin.y - 0.3} size={14}>O</Text>
          </>
        )}

        {/* Custom vectors */}
        {vectors.map((v, index) => {
          const labelPos = labelLayout.get(`v-${index}`) ?? { x: v.to.x + 0.3, y: v.to.y + 0.3 };
          return (
            <g key={index}>
              <Vector
                tail={[origin.x, origin.y]}
                tip={[v.to.x, v.to.y]}
                color={v.color || '#2563eb'}
                weight={3}
              />
              <Text x={labelPos.x} y={labelPos.y} size={14}>
                {v.label}
              </Text>
            </g>
          );
        })}
      </Mafs>
    </div>
  );
}

/**
 * Circular Path Diagram
 * For problems involving circular motion, like the cyclist problem
 */
interface CircularPathProps {
  radius?: number;
  center?: PointType;
  points?: Array<{ angle: number; label: string; color?: string }>;
  path?: Array<{ from: string; to: string; type: 'straight' | 'arc'; color?: string }>;
  title?: string;
}

export function CircularPathDiagram({
  radius = 3,
  center = { x: 0, y: 0 },
  points = [
    { angle: 0, label: 'P', color: '#2563eb' },
    { angle: 90, label: 'Q', color: '#2563eb' },
    { angle: 180, label: 'R', color: '#2563eb' },
    { angle: 270, label: 'S', color: '#2563eb' },
  ],
  path = [],
  title = 'Circular Path',
}: CircularPathProps) {
  // Defensive: reject points missing a numeric angle, and clamp center
  // / radius to safe defaults if the brain omitted them. Without these
  // guards, an emission like `points: [{ label: 'S' }]` produces NaN
  // angle → NaN coordinates → SVG attribute errors and a blank canvas
  // (observed 2026-04-26 on "circular orbit of radius 3 with the
  // satellite at the top": the satellite was emitted without an angle).
  const safeCenter = {
    x: typeof center?.x === 'number' && isFinite(center.x) ? center.x : 0,
    y: typeof center?.y === 'number' && isFinite(center.y) ? center.y : 0,
  };
  const safeRadius = typeof radius === 'number' && isFinite(radius) && radius > 0 ? radius : 3;
  const safePoints = useMemo(() => {
    return (points ?? []).map((p) => {
      let angle = p.angle;
      if (typeof angle !== 'number' || !isFinite(angle)) {
        // "Top" / "satellite at the top" → assume 90°.
        const lower = (p.label || '').toLowerCase();
        if (/top|north/.test(lower)) angle = 90;
        else if (/bottom|south/.test(lower)) angle = 270;
        else if (/right|east/.test(lower)) angle = 0;
        else if (/left|west/.test(lower)) angle = 180;
        else angle = 0;
      }
      return { ...p, angle };
    });
  }, [points]);

  // Calculate point positions
  const pointPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {
      'O': { x: safeCenter.x, y: safeCenter.y },
    };
    safePoints.forEach((p) => {
      const rad = (p.angle * Math.PI) / 180;
      positions[p.label] = {
        x: safeCenter.x + safeRadius * Math.cos(rad),
        y: safeCenter.y + safeRadius * Math.sin(rad),
      };
    });
    return positions;
  }, [safeCenter, safeRadius, safePoints]);

  // Generate circle points for drawing — use the sanitized center / radius
  // so a missing-radius emission still draws something instead of NaNing.
  const circlePoints = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      pts.push([safeCenter.x + safeRadius * Math.cos(angle), safeCenter.y + safeRadius * Math.sin(angle)]);
    }
    return pts;
  }, [safeCenter, safeRadius]);

  const viewRange = safeRadius + 2;

  // De-overlap pass (2026-07-19 audit): points at nearby angles put their
  // radially-offset labels at almost the same height. Point/center markers
  // and the O caption are obstacles; labels shift away from the circle top
  // or bottom depending on which half they sit in.
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace({ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }, 300);
    const labels: DiagramLabel[] = [];
    safePoints.forEach((p, i) => {
      const pos = pointPositions[p.label];
      if (!pos || !isFinite(pos.x) || !isFinite(pos.y)) return;
      const rad = (p.angle * Math.PI) / 180;
      labels.push({
        key: `p-${i}`,
        x: pos.x + 0.5 * Math.cos(rad),
        y: pos.y + 0.5 * Math.sin(rad),
        text: p.label,
        fontSize: 14,
        preferDir: Math.sin(rad) >= 0 ? 'up' : 'down',
      });
    });
    const obstacles: DeoverlapObstacle[] = [
      markerObstacle(space, safeCenter.x, safeCenter.y),
      textObstacle(space, safeCenter.x - 0.4, safeCenter.y - 0.4, 'O', 14),
    ];
    safePoints.forEach((p) => {
      const pos = pointPositions[p.label];
      if (pos && isFinite(pos.x) && isFinite(pos.y)) obstacles.push(markerObstacle(space, pos.x, pos.y));
    });
    return layoutDiagramLabels(space, labels, obstacles);
  }, [safePoints, pointPositions, safeCenter, viewRange]);

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2"><InlineMathText text={title} /></h4>
      <Mafs
        ssr
        height={300}
        viewBox={{ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }}
      >
        {/* Draw circle using line segments */}
        {circlePoints.slice(0, -1).map((pt, i) => (
          <Line.Segment
            key={`circle-${i}`}
            point1={pt}
            point2={circlePoints[i + 1]}
            color="#94a3b8"
            weight={2}
          />
        ))}

        {/* Center point O */}
        <Point x={safeCenter.x} y={safeCenter.y} color="#16a34a" />
        <Text x={safeCenter.x - 0.4} y={safeCenter.y - 0.4} size={14}>O</Text>

        {/* Labeled points on circle */}
        {safePoints.map((p, index) => {
          const pos = pointPositions[p.label];
          if (!pos || !isFinite(pos.x) || !isFinite(pos.y)) return null;
          const labelOffset = 0.5;
          const rad = (p.angle * Math.PI) / 180;
          const labelPos = labelLayout.get(`p-${index}`) ?? {
            x: pos.x + labelOffset * Math.cos(rad),
            y: pos.y + labelOffset * Math.sin(rad),
          };
          return (
            <g key={index}>
              <Point x={pos.x} y={pos.y} color={p.color || '#2563eb'} />
              <Text
                x={labelPos.x}
                y={labelPos.y}
                size={14}
              >
                {p.label}
              </Text>
            </g>
          );
        })}

        {/* Path arrows */}
        {path.map((segment, index) => {
          const from = pointPositions[segment.from];
          const to = pointPositions[segment.to];
          if (!from || !to) return null;

          if (segment.type === 'straight') {
            return (
              <Vector
                key={`path-${index}`}
                tail={[from.x, from.y]}
                tip={[to.x, to.y]}
                color={segment.color || '#dc2626'}
                weight={3}
              />
            );
          }
          // For arc, just show a curved indicator (simplified)
          return (
            <Line.Segment
              key={`path-${index}`}
              point1={[from.x, from.y]}
              point2={[to.x, to.y]}
              color={segment.color || '#dc2626'}
              weight={2}
              style="dashed"
            />
          );
        })}
      </Mafs>

      {/* Legend */}
      {path.length > 0 && (
        <div className="flex gap-3 justify-center mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-600" />
            Path traveled
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Pipe Flow / Fluid Continuity Diagram
 *
 * Shows a pipe that narrows (or widens) with flow arrows indicating
 * velocity changes. Used for continuity equation and Bernoulli's principle.
 */
interface PipeFlowDiagramProps {
  title?: string;
  wideArea?: number;    // A1 value
  narrowArea?: number;  // A2 value
  wideVelocity?: number;  // v1
  narrowVelocity?: number; // v2
  showPressure?: boolean;  // show pressure labels
  widePressure?: string;   // P1 label
  narrowPressure?: string; // P2 label
  description?: string;
}

export function PipeFlowDiagram({
  title = 'Flow Through a Pipe',
  wideArea = 4,
  narrowArea = 2,
  wideVelocity = 2,
  narrowVelocity,
  showPressure = false,
  widePressure = 'P₁ (high)',
  narrowPressure = 'P₂ (low)',
  description,
}: PipeFlowDiagramProps) {
  // Calculate narrow velocity from continuity if not provided
  const v2 = narrowVelocity ?? (wideArea / narrowArea) * wideVelocity;

  // Pipe geometry — draw from left to right
  // Wide section: x = -8 to -2, half-height proportional to sqrt(wideArea)
  // Narrow section: x = 2 to 8
  // Taper: x = -2 to 2
  const wideHalf = Math.sqrt(wideArea) * 0.8;
  const narrowHalf = Math.sqrt(narrowArea) * 0.8;

  // Scale arrow lengths relative to each other
  const maxV = Math.max(wideVelocity, v2, 1);
  const arrowScale = 2.5 / maxV;

  // De-overlap pass (2026-07-19 audit): the pressure captions sit at y=0 —
  // exactly on the center flow arrow. Walls and flow arrows are obstacles;
  // the area/velocity captions outside the pipe stay untouched.
  const labelLayout = useMemo(() => {
    const space = mafsLabelSpace({ x: [-10, 10], y: [-5, 5] }, 300);
    const labels: DiagramLabel[] = [
      { key: 'a1', x: -5, y: wideHalf + 0.7, text: `A₁ = ${wideArea}`, fontSize: 13, preferDir: 'up' },
      { key: 'a2', x: 5, y: narrowHalf + 0.7, text: `A₂ = ${narrowArea}`, fontSize: 13, preferDir: 'up' },
      { key: 'v1', x: -5, y: -wideHalf - 0.7, text: `v₁ = ${wideVelocity} m/s`, fontSize: 13, preferDir: 'down' },
      { key: 'v2', x: 5, y: -narrowHalf - 0.7, text: `v₂ = ${Math.round(v2 * 10) / 10} m/s`, fontSize: 13, preferDir: 'down' },
    ];
    if (showPressure) {
      labels.push(
        { key: 'p1', x: -5, y: 0, text: widePressure, fontSize: 11, preferDir: 'up' },
        { key: 'p2', x: 5, y: 0, text: narrowPressure, fontSize: 11, preferDir: 'up' },
      );
    }
    const obstacles: DeoverlapObstacle[] = [
      // Pipe walls.
      ...shaftObstacles(space, [-8, wideHalf], [-2, wideHalf]),
      ...shaftObstacles(space, [-8, -wideHalf], [-2, -wideHalf]),
      ...shaftObstacles(space, [-2, wideHalf], [2, narrowHalf]),
      ...shaftObstacles(space, [-2, -wideHalf], [2, -narrowHalf]),
      ...shaftObstacles(space, [2, narrowHalf], [8, narrowHalf]),
      ...shaftObstacles(space, [2, -narrowHalf], [8, -narrowHalf]),
      // Flow arrows.
      ...shaftObstacles(space, [-6.5, 0], [-6.5 + wideVelocity * arrowScale, 0]),
      ...shaftObstacles(space, [-6.5, wideHalf * 0.4], [-6.5 + wideVelocity * arrowScale, wideHalf * 0.4]),
      ...shaftObstacles(space, [-6.5, -wideHalf * 0.4], [-6.5 + wideVelocity * arrowScale, -wideHalf * 0.4]),
      ...shaftObstacles(space, [4, 0], [4 + v2 * arrowScale, 0]),
      ...shaftObstacles(space, [4, narrowHalf * 0.35], [4 + v2 * arrowScale, narrowHalf * 0.35]),
      ...shaftObstacles(space, [4, -narrowHalf * 0.35], [4 + v2 * arrowScale, -narrowHalf * 0.35]),
    ];
    return layoutDiagramLabels(space, labels, obstacles);
  }, [wideArea, narrowArea, wideVelocity, v2, wideHalf, narrowHalf, arrowScale, showPressure, widePressure, narrowPressure]);
  const posOf = (key: string, fx: number, fy: number): { x: number; y: number } =>
    labelLayout.get(key) ?? { x: fx, y: fy };

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2"><InlineMathText text={title} /></h4>
      <Mafs ssr height={300} viewBox={{ x: [-10, 10], y: [-5, 5] }}>
        {/* Wide section — top wall */}
        <Line.Segment point1={[-8, wideHalf]} point2={[-2, wideHalf]} color="#475569" weight={3} />
        {/* Wide section — bottom wall */}
        <Line.Segment point1={[-8, -wideHalf]} point2={[-2, -wideHalf]} color="#475569" weight={3} />

        {/* Taper — top */}
        <Line.Segment point1={[-2, wideHalf]} point2={[2, narrowHalf]} color="#475569" weight={3} />
        {/* Taper — bottom */}
        <Line.Segment point1={[-2, -wideHalf]} point2={[2, -narrowHalf]} color="#475569" weight={3} />

        {/* Narrow section — top wall */}
        <Line.Segment point1={[2, narrowHalf]} point2={[8, narrowHalf]} color="#475569" weight={3} />
        {/* Narrow section — bottom wall */}
        <Line.Segment point1={[2, -narrowHalf]} point2={[8, -narrowHalf]} color="#475569" weight={3} />

        {/* End caps */}
        <Line.Segment point1={[-8, -wideHalf]} point2={[-8, wideHalf]} color="#94a3b8" weight={1} />
        <Line.Segment point1={[8, -narrowHalf]} point2={[8, narrowHalf]} color="#94a3b8" weight={1} />

        {/* Flow arrows — wide section (short, blue) */}
        <Vector tail={[-6.5, 0]} tip={[-6.5 + wideVelocity * arrowScale, 0]} color="#2563eb" weight={3} />
        <Vector tail={[-6.5, wideHalf * 0.4]} tip={[-6.5 + wideVelocity * arrowScale, wideHalf * 0.4]} color="#93c5fd" weight={2} />
        <Vector tail={[-6.5, -wideHalf * 0.4]} tip={[-6.5 + wideVelocity * arrowScale, -wideHalf * 0.4]} color="#93c5fd" weight={2} />

        {/* Flow arrows — narrow section (long, red/orange) */}
        <Vector tail={[4, 0]} tip={[4 + v2 * arrowScale, 0]} color="#dc2626" weight={3} />
        <Vector tail={[4, narrowHalf * 0.35]} tip={[4 + v2 * arrowScale, narrowHalf * 0.35]} color="#fca5a5" weight={2} />
        <Vector tail={[4, -narrowHalf * 0.35]} tip={[4 + v2 * arrowScale, -narrowHalf * 0.35]} color="#fca5a5" weight={2} />

        {/* Area labels */}
        <Text x={posOf('a1', -5, wideHalf + 0.7).x} y={posOf('a1', -5, wideHalf + 0.7).y} size={13}>A₁ = {wideArea}</Text>
        <Text x={posOf('a2', 5, narrowHalf + 0.7).x} y={posOf('a2', 5, narrowHalf + 0.7).y} size={13}>A₂ = {narrowArea}</Text>

        {/* Velocity labels */}
        <Text x={posOf('v1', -5, -wideHalf - 0.7).x} y={posOf('v1', -5, -wideHalf - 0.7).y} size={13}>v₁ = {wideVelocity} m/s</Text>
        <Text x={posOf('v2', 5, -narrowHalf - 0.7).x} y={posOf('v2', 5, -narrowHalf - 0.7).y} size={13}>v₂ = {Math.round(v2 * 10) / 10} m/s</Text>

        {/* Area dimension arrows */}
        <Line.Segment point1={[-8.5, -wideHalf]} point2={[-8.5, wideHalf]} color="#94a3b8" weight={1} style="dashed" />
        <Line.Segment point1={[8.5, -narrowHalf]} point2={[8.5, narrowHalf]} color="#94a3b8" weight={1} style="dashed" />

        {/* Pressure labels if enabled */}
        {showPressure && (
          <>
            <Text x={posOf('p1', -5, 0).x} y={posOf('p1', -5, 0).y} size={11}>{widePressure}</Text>
            <Text x={posOf('p2', 5, 0).x} y={posOf('p2', 5, 0).y} size={11}>{narrowPressure}</Text>
          </>
        )}
      </Mafs>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-3 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <div className="w-4 h-1 bg-blue-600 rounded" />
          Slow flow (wide section)
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-4 h-1 bg-red-600 rounded" />
          Fast flow (narrow section)
        </span>
      </div>
      {description && (
        <p className="text-center text-xs text-gray-500 mt-2 italic">{description}</p>
      )}
    </div>
  );
}

/**
 * SVG Diagram (Generic / AI-generated)
 *
 * Renders arbitrary SVG markup produced by the AI tutor.
 * Sanitizes to prevent script injection while preserving drawing elements.
 */
interface SvgDiagramProps {
  title?: string;
  description?: string;
  svg: string;
}

function sanitizeSvg(raw: string): string {
  // Remove script tags and event handlers
  let s = raw.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
  s = s.replace(/javascript\s*:/gi, '');
  s = s.replace(/\bxlink:href\s*=\s*["']javascript:[^"']*["']/gi, '');
  // Add padding to viewBox so text near edges doesn't get clipped.
  // Shifts the origin by -20,-10 and adds 40/20 to width/height.
  s = s.replace(
    /viewBox\s*=\s*"(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"/i,
    (_, x, y, w, h) => `viewBox="${Number(x) - 20} ${Number(y) - 10} ${Number(w) + 40} ${Number(h) + 20}"`
  );
  return s;
}

export function SvgDiagram({ title, description, svg }: SvgDiagramProps) {
  const sanitized = useMemo(() => sanitizeSvg(svg), [svg]);

  return (
    <div className="diagram-container">
      {title && (
        <h4 className="text-center font-medium text-gray-800 mb-2"><InlineMathText text={title} /></h4>
      )}
      <div
        className="flex justify-center items-center bg-white rounded-lg border border-gray-200 p-2 overflow-hidden"
        style={{ minHeight: 200 }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
      {description && (
        <p className="text-center text-xs text-gray-500 mt-2 italic">{description}</p>
      )}
    </div>
  );
}

/**
 * Generic Problem Diagram
 * Displays extracted problem text and any diagram description
 */
interface ProblemDiagramProps {
  problemText: string;
  diagramDescription?: string;
  givenValues?: Array<{ symbol: string; value: string; unit?: string }>;
  findValues?: string[];
}

export function ProblemDiagram({
  problemText,
  diagramDescription,
  givenValues = [],
  findValues = [],
}: ProblemDiagramProps) {
  return (
    <div className="problem-diagram p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-3">Problem</h4>
      <p className="text-gray-800 mb-4">{problemText}</p>

      {diagramDescription && (
        <div className="mb-4 p-3 bg-white rounded border border-blue-100">
          <p className="text-sm text-gray-600 italic">{diagramDescription}</p>
        </div>
      )}

      {givenValues.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Given:</p>
          <ul className="text-sm text-gray-600 ml-4 list-disc">
            {givenValues.filter(gv => gv && (gv.symbol || gv.value)).map((gv, i) => (
              <li key={i}>
                <EquationRenderer
                  latex={`${gv.symbol || '?'} = ${gv.value ?? '?'} \\text{ ${gv.unit || ''}}`}
                  displayMode={false}
                  className="inline-block"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {findValues.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Find:</p>
          <ul className="text-sm text-gray-600 ml-4 list-disc">
            {findValues.map((fv, i) => (
              <li key={i}>{fv}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
