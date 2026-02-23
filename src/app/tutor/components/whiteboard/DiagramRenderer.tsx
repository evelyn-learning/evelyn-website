'use client';

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
import { EquationRenderer } from './EquationRenderer';

interface VectorRendererProps {
  from: PointType;
  to: PointType;
  label?: string;
  color?: string;
}

export function VectorRenderer({ from, to, label, color = '#2563eb' }: VectorRendererProps) {
  return (
    <Mafs height={200} viewBox={{ x: [-5, 5], y: [-5, 5] }}>
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

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">{title}</h4>
      <Mafs
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
          const labelPos = getLabelPosition(v.dx, v.dy, index);
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
              {showAngleLabels && v.direction !== 0 && v.direction !== 90 && v.direction !== 180 && v.direction !== 270 && (
                <Text
                  x={Math.cos(v.rad / 2) * viewRange * 0.25}
                  y={Math.sin(v.rad / 2) * viewRange * 0.25}
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
              x={resultant.dx * 1.15}
              y={resultant.dy * 1.15}
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

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">Free Body Diagram</h4>
      <Mafs
        height={300}
        viewBox={{ x: [-viewRange, viewRange], y: [-viewRange, viewRange] }}
      >
        {/* Central object */}
        <Point x={0} y={0} color="#64748b" />
        <Text x={0.6} y={0} size={11}>{objectLabel}</Text>

        {/* Force vectors */}
        {vectors.map((v, index) => (
          <g key={index}>
            <Vector
              tail={[0, 0]}
              tip={[v.dx, v.dy]}
              color={v.color || '#2563eb'}
              weight={3}
            />
            <Text
              x={v.labelX}
              y={v.labelY}
              size={13}
            >
              {v.label}
            </Text>
          </g>
        ))}

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
              x={netForce.dx * 1.3 + 0.5}
              y={netForce.dy * 1.3 + 0.5}
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

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">{title}</h4>
      <Mafs height={250} viewBox={bounds}>
        {/* Ground line */}
        <Line.Segment
          point1={[bounds.x[0], 0]}
          point2={[bounds.x[1], 0]}
          color="#94a3b8"
        />

        {/* Position dots */}
        {positions.map((pos, index) => (
          <g key={index}>
            <Point
              x={pos.x}
              y={pos.y}
              color={index === 0 ? '#16a34a' : index === positions.length - 1 ? '#dc2626' : '#2563eb'}
            />
            <Text x={pos.x} y={pos.y - 0.5} size={10}>
              t={pos.t}s
            </Text>
          </g>
        ))}

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

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">Projectile Motion</h4>
      <Mafs height={300} viewBox={viewBox}>
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
        <Text x={v0x * 0.15} y={v0y * 0.15 + 2} size={12}>
          v₀ = {v0} m/s
        </Text>

        {/* Angle label */}
        <Text x={2} y={0.8} size={12}>
          θ = {angle}°
        </Text>

        {/* Key points labels */}
        <Point x={0} y={0} color="#16a34a" />
        <Point x={range / 2} y={maxHeight} color="#ea580c" />
        <Point x={range} y={0} color="#dc2626" />

        {/* Max height and range labels */}
        <Text x={range / 2} y={maxHeight + 1.2} size={11}>
          Max height: {Math.round(maxHeight * 10) / 10}m
        </Text>
        <Text x={range} y={-1.2} size={11}>
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
  return (
    <div className="diagram-container">
      <Mafs height={250} viewBox={{ x: [-5, 5], y: [-5, 5] }}>
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
        {vectors.map((v, index) => (
          <g key={index}>
            <Vector
              tail={[origin.x, origin.y]}
              tip={[v.to.x, v.to.y]}
              color={v.color || '#2563eb'}
              weight={3}
            />
            <Text x={v.to.x + 0.3} y={v.to.y + 0.3} size={14}>
              {v.label}
            </Text>
          </g>
        ))}
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
  // Calculate point positions
  const pointPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {
      'O': { x: center.x, y: center.y },
    };
    points.forEach((p) => {
      const rad = (p.angle * Math.PI) / 180;
      positions[p.label] = {
        x: center.x + radius * Math.cos(rad),
        y: center.y + radius * Math.sin(rad),
      };
    });
    return positions;
  }, [center, radius, points]);

  // Generate circle points for drawing
  const circlePoints = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      pts.push([center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle)]);
    }
    return pts;
  }, [center, radius]);

  const viewRange = radius + 2;

  return (
    <div className="diagram-container">
      <h4 className="text-center font-medium text-gray-800 mb-2">{title}</h4>
      <Mafs
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
        <Point x={center.x} y={center.y} color="#16a34a" />
        <Text x={center.x - 0.4} y={center.y - 0.4} size={14}>O</Text>

        {/* Labeled points on circle */}
        {points.map((p, index) => {
          const pos = pointPositions[p.label];
          const labelOffset = 0.5;
          const rad = (p.angle * Math.PI) / 180;
          return (
            <g key={index}>
              <Point x={pos.x} y={pos.y} color={p.color || '#2563eb'} />
              <Text
                x={pos.x + labelOffset * Math.cos(rad)}
                y={pos.y + labelOffset * Math.sin(rad)}
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
