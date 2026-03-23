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
import type { GraphData, GraphType, GraphAnnotation, ShadedRegion } from '@/lib/knowledge/types';

interface GraphRendererProps {
  type: GraphType;
  data: GraphData;
  interactive?: boolean;
  className?: string;
}

// Normalize a math expression string into evaluable JavaScript
function normalizeMathExpression(fnStr: string, variable: string = 'x'): string {
  let s = fnStr;
  // t -> x for time-based expressions
  if (variable === 'x') s = s.replace(/\bt\b/g, 'x');
  // ^ -> ** for exponentiation
  s = s.replace(/\^/g, '**');
  // Common math functions (avoid double-prefixing Math.)
  s = s.replace(/(?<!Math\.)(?<!\w)(sin|cos|tan|sqrt|abs|log)\b/g, 'Math.$1');
  // Constants
  s = s.replace(/\bpi\b/gi, 'Math.PI');
  s = s.replace(/(?<![a-zA-Z.])e\b/g, 'Math.E');
  // Fix "x2" or "y2" → "x**2" or "y**2" (digit after variable = exponent, not multiply)
  // Pattern: variable followed by a single digit with no operator between
  const v = variable;
  s = s.replace(new RegExp(`\\b${v}(\\d)\\b`, 'g'), `${v}**$1`);
  // Implicit multiplication: 2x → 2*x, 4Math → 4*Math, )( → )*(
  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  s = s.replace(/([)])(\d)/g, '$1*$2');
  s = s.replace(/([)])\s*\(/g, '$1*(');
  return s;
}

// Parse a function string like "2*t + 5" into an evaluable function of x
function parseFunctionString(fnStr: string): (x: number) => number {
  const processed = normalizeMathExpression(fnStr, 'x');

  return (x: number) => {
    try {
      const result = new Function('x', `"use strict"; return ${processed}`)(x);
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };
}

// Parse a function string like "y**3" into an evaluable function of y
function parseFunctionOfYString(fnStr: string): (y: number) => number {
  const processed = normalizeMathExpression(fnStr, 'y');

  return (y: number) => {
    try {
      const result = new Function('y', `"use strict"; return ${processed}`)(y);
      return typeof result === 'number' && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
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
    functionsOfY = [],
    points = [],
    annotations = [],
    shadedRegion,
  } = data;

  // Parse y=f(x) functions
  const parsedFunctions = useMemo(() => {
    return functions.map((fn, index) => ({
      ...fn,
      evaluator: parseFunctionString(fn.fn || fn.latex || 'x'),
      color: fn.color || COLORS[index % COLORS.length],
    }));
  }, [functions]);

  // Parse x=f(y) functions
  const parsedFunctionsOfY = useMemo(() => {
    return functionsOfY.map((fn, index) => ({
      ...fn,
      evaluator: parseFunctionOfYString(fn.fn || fn.latex || 'y'),
      color: fn.color || COLORS[(functions.length + index) % COLORS.length],
    }));
  }, [functionsOfY, functions.length]);

  // Parse shaded region
  const shadedRegionEvaluators = useMemo(() => {
    if (!shadedRegion) return null;
    if (shadedRegion.axis === 'y') {
      return {
        fn1: parseFunctionOfYString(shadedRegion.between[0]),
        fn2: parseFunctionOfYString(shadedRegion.between[1]),
      };
    }
    return {
      fn1: parseFunctionString(shadedRegion.between[0]),
      fn2: parseFunctionString(shadedRegion.between[1]),
    };
  }, [shadedRegion]);

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

            {/* Shaded region between curves */}
            {shadedRegion && shadedRegionEvaluators && (
              shadedRegion.axis === 'y' ? (
                <Plot.Inequality
                  x={{
                    ">": (y: number) => {
                      if (y < shadedRegion.from || y > shadedRegion.to) return Infinity;
                      return Math.min(shadedRegionEvaluators.fn1(y), shadedRegionEvaluators.fn2(y));
                    },
                    "<": (y: number) => {
                      if (y < shadedRegion.from || y > shadedRegion.to) return -Infinity;
                      return Math.max(shadedRegionEvaluators.fn1(y), shadedRegionEvaluators.fn2(y));
                    },
                  }}
                  color={shadedRegion.color || '#16a34a'}
                  fillOpacity={shadedRegion.opacity ?? 0.3}
                />
              ) : (
                <Plot.Inequality
                  y={{
                    ">": (x: number) => {
                      if (x < shadedRegion.from || x > shadedRegion.to) return Infinity;
                      return Math.min(
                        (shadedRegionEvaluators.fn1 as (x: number) => number)(x),
                        (shadedRegionEvaluators.fn2 as (x: number) => number)(x)
                      );
                    },
                    "<": (x: number) => {
                      if (x < shadedRegion.from || x > shadedRegion.to) return -Infinity;
                      return Math.max(
                        (shadedRegionEvaluators.fn1 as (x: number) => number)(x),
                        (shadedRegionEvaluators.fn2 as (x: number) => number)(x)
                      );
                    },
                  }}
                  color={shadedRegion.color || '#16a34a'}
                  fillOpacity={shadedRegion.opacity ?? 0.3}
                />
              )
            )}

            {/* Plot y=f(x) functions — wrap evaluator with NaN guard */}
            {parsedFunctions.map((fn, index) => (
              <Plot.OfX
                key={`ofx-${index}`}
                y={(x: number) => {
                  const v = fn.evaluator(x);
                  return isNaN(v) ? Infinity : v; // Mafs handles Infinity by not drawing, NaN causes SVG errors
                }}
                color={fn.color}
                weight={2}
              />
            ))}

            {/* Plot x=f(y) functions — wrap evaluator with NaN guard */}
            {parsedFunctionsOfY.map((fn, index) => (
              <Plot.OfY
                key={`ofy-${index}`}
                x={(y: number) => {
                  const v = fn.evaluator(y);
                  return isNaN(v) ? Infinity : v;
                }}
                color={fn.color}
                weight={2}
                domain={fn.domain}
              />
            ))}

            {/* Plot points — skip if coordinates are NaN */}
            {points
              .filter((p) => isFinite(p.x) && isFinite(p.y))
              .map((point, index) => (
              <Point
                key={`point-${index}`}
                x={point.x}
                y={point.y}
                color={point.color || '#2563eb'}
              />
            ))}

            {/* Point labels */}
            {points
              .filter((p) => p.label && isFinite(p.x) && isFinite(p.y))
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
      {(functions.length + functionsOfY.length) > 1 && (
        <div className="flex gap-4 justify-center mt-3 flex-wrap">
          {parsedFunctions.map((fn, index) => (
            <div key={`ofx-${index}`} className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-1 rounded"
                style={{ backgroundColor: fn.color }}
              />
              <span>{fn.label || fn.fn || fn.latex || ''}</span>
            </div>
          ))}
          {parsedFunctionsOfY.map((fn, index) => (
            <div key={`ofy-${index}`} className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-1 rounded"
                style={{ backgroundColor: fn.color }}
              />
              <span>{fn.label || fn.fn || fn.latex || ''}</span>
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
