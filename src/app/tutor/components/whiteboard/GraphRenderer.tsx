'use client';

/**
 * Graph Renderer
 *
 * Renders interactive graphs using Mafs for physics visualizations.
 * Supports position-time, velocity-time, and custom function plots.
 */

import { useMemo } from 'react';
import {
  Mafs,
  Coordinates,
  Plot,
  Point,
  Text,
  Line,
} from 'mafs';
import 'mafs/core.css';
import type { GraphData, GraphType, GraphAnnotation } from '@/lib/knowledge/types';

interface GraphRendererProps {
  type: GraphType;
  data: GraphData;
  interactive?: boolean;
  className?: string;
}

// Parse a function string like "2*t + 5" into an evaluable function
function parseFunctionString(fnStr: string): (x: number) => number {
  // Replace common physics notation
  let processed = fnStr
    .replace(/\bt\b/g, 'x') // t -> x for time
    .replace(/\^/g, '**')   // ^ -> ** for exponent
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/sqrt/g, 'Math.sqrt')
    .replace(/abs/g, 'Math.abs')
    .replace(/pi/gi, 'Math.PI')
    .replace(/e\b/g, 'Math.E');

  return (x: number) => {
    try {
      // Using Function constructor for dynamic evaluation
      // This is safe here as we control the input from the AI
      return new Function('x', `return ${processed}`)(x);
    } catch {
      return 0;
    }
  };
}

// Color palette for multiple functions
const COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
];

export function GraphRenderer({
  type,
  data,
  interactive = false,
  className = '',
}: GraphRendererProps) {
  const {
    title,
    xLabel,
    yLabel,
    xRange,
    yRange,
    functions = [],
    points = [],
    annotations = [],
  } = data;

  // Parse functions
  const parsedFunctions = useMemo(() => {
    return functions.map((fn, index) => ({
      ...fn,
      evaluator: parseFunctionString(fn.fn),
      color: fn.color || COLORS[index % COLORS.length],
    }));
  }, [functions]);

  // Calculate viewBox
  const viewBox = useMemo(() => ({
    x: [xRange[0], xRange[1]] as [number, number],
    y: [yRange[0], yRange[1]] as [number, number],
  }), [xRange, yRange]);

  return (
    <div className={`graph-container ${className}`}>
      {title && (
        <h4 className="text-center font-medium text-gray-800 mb-2">{title}</h4>
      )}

      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-600 origin-center whitespace-nowrap">
          {yLabel}
        </div>

        <div className="ml-8">
          <Mafs
            viewBox={viewBox}
            preserveAspectRatio={false}
            height={300}
          >
            <Coordinates.Cartesian
              xAxis={{ labels: (n) => n.toString() }}
              yAxis={{ labels: (n) => n.toString() }}
            />

            {/* Plot functions */}
            {parsedFunctions.map((fn, index) => (
              <Plot.OfX
                key={index}
                y={fn.evaluator}
                color={fn.color}
                weight={2}
              />
            ))}

            {/* Plot points */}
            {points.map((point, index) => (
              <Point
                key={`point-${index}`}
                x={point.x}
                y={point.y}
                color={point.color || '#2563eb'}
              />
            ))}

            {/* Point labels */}
            {points
              .filter((p) => p.label)
              .map((point, index) => (
                <Text
                  key={`label-${index}`}
                  x={point.x}
                  y={point.y + 0.5}
                  attach="n"
                  size={14}
                >
                  {point.label!}
                </Text>
              ))}

            {/* Annotations */}
            {annotations.map((annotation, index) => (
              <AnnotationRenderer
                key={`annotation-${index}`}
                annotation={annotation}
                functions={parsedFunctions}
              />
            ))}
          </Mafs>
        </div>

        {/* X-axis label */}
        <div className="text-center text-sm text-gray-600 mt-1">
          {xLabel}
        </div>
      </div>

      {/* Function legend */}
      {functions.length > 1 && (
        <div className="flex gap-4 justify-center mt-3">
          {parsedFunctions.map((fn, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-1 rounded"
                style={{ backgroundColor: fn.color }}
              />
              <span>{fn.label || fn.fn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Render graph annotations (slopes, areas, tangent lines, etc.)
interface AnnotationRendererProps {
  annotation: GraphAnnotation;
  functions: Array<{
    evaluator: (x: number) => number;
    color: string;
  }>;
}

function AnnotationRenderer({ annotation, functions }: AnnotationRendererProps) {
  if (functions.length === 0) return null;
  const fn = functions[0].evaluator;
  const color = annotation.color || '#9333ea';

  switch (annotation.type) {
    case 'tangent': {
      if (annotation.at === undefined) return null;
      const x = annotation.at;
      const y = fn(x);
      // Approximate derivative
      const h = 0.001;
      const slope = (fn(x + h) - fn(x - h)) / (2 * h);
      // Draw tangent line from x-1 to x+1
      const x1 = x - 1;
      const y1 = y + slope * (x1 - x);
      const x2 = x + 1;
      const y2 = y + slope * (x2 - x);
      return (
        <>
          <Line.Segment
            point1={[x1, y1]}
            point2={[x2, y2]}
            color={color}
            weight={2}
            style="dashed"
          />
          <Point x={x} y={y} color={color} />
          {annotation.label && (
            <Text x={x} y={y + 0.8} size={12}>
              {annotation.label}
            </Text>
          )}
        </>
      );
    }

    case 'slope': {
      if (annotation.from === undefined || annotation.to === undefined) return null;
      const x1 = annotation.from;
      const x2 = annotation.to;
      const y1 = fn(x1);
      const y2 = fn(x2);
      // Draw slope triangle
      return (
        <>
          <Line.Segment point1={[x1, y1]} point2={[x2, y1]} color={color} />
          <Line.Segment point1={[x2, y1]} point2={[x2, y2]} color={color} />
          <Line.Segment point1={[x1, y1]} point2={[x2, y2]} color={color} weight={2} />
          {annotation.label && (
            <Text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 0.5} size={12}>
              {annotation.label}
            </Text>
          )}
        </>
      );
    }

    case 'point-label': {
      if (annotation.at === undefined) return null;
      const x = annotation.at;
      const y = fn(x);
      return (
        <>
          <Point x={x} y={y} color={color} />
          {annotation.label && (
            <Text x={x} y={y + 0.5} size={12}>
              {annotation.label}
            </Text>
          )}
        </>
      );
    }

    default:
      return null;
  }
}

/**
 * Interactive graph with movable point
 * Note: Currently a placeholder - will be implemented with full interactivity
 */
interface InteractiveGraphProps {
  type: GraphType;
  data: GraphData;
  onPointMove?: (x: number, y: number) => void;
}

export function InteractiveGraph({ type, data, onPointMove }: InteractiveGraphProps) {
  // For now, just render a regular graph
  // Full interactivity with movable points will be added in a future update
  return (
    <GraphRenderer type={type} data={data} interactive />
  );
}

/**
 * Pre-configured physics graph templates
 */
export function PositionTimeGraph(props: Omit<GraphRendererProps, 'type'>) {
  return (
    <GraphRenderer
      {...props}
      type="position-time"
      data={{
        ...props.data,
        xLabel: props.data.xLabel || 'Time (s)',
        yLabel: props.data.yLabel || 'Position (m)',
      }}
    />
  );
}

export function VelocityTimeGraph(props: Omit<GraphRendererProps, 'type'>) {
  return (
    <GraphRenderer
      {...props}
      type="velocity-time"
      data={{
        ...props.data,
        xLabel: props.data.xLabel || 'Time (s)',
        yLabel: props.data.yLabel || 'Velocity (m/s)',
      }}
    />
  );
}

export function AccelerationTimeGraph(props: Omit<GraphRendererProps, 'type'>) {
  return (
    <GraphRenderer
      {...props}
      type="acceleration-time"
      data={{
        ...props.data,
        xLabel: props.data.xLabel || 'Time (s)',
        yLabel: props.data.yLabel || 'Acceleration (m/s²)',
      }}
    />
  );
}
