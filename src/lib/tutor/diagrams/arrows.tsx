/**
 * Shared SVG arrow / arrowhead primitives for diagram renderers.
 *
 * Many tools (ray diagrams, vectors, flowcharts, food webs, concept maps,
 * projectile motion) need a labeled arrow pointing from one point to another.
 * This file provides one reusable marker set + a helper component.
 */

import React from 'react';
import { DIAGRAM_COLORS } from './theme';

/**
 * Call once per SVG to define <marker> elements for arrowheads in several
 * colors. Render the returned <defs> as the first child of your <svg>.
 */
export function ArrowMarkers({ idPrefix = 'arrow' }: { idPrefix?: string }): React.ReactElement {
  const colors = [
    { id: 'default', fill: DIAGRAM_COLORS.slate },
    { id: 'primary', fill: DIAGRAM_COLORS.primary },
    { id: 'secondary', fill: DIAGRAM_COLORS.secondary },
    { id: 'success', fill: DIAGRAM_COLORS.success },
    { id: 'warning', fill: DIAGRAM_COLORS.warning },
    { id: 'accent', fill: DIAGRAM_COLORS.accent },
  ];
  return (
    <defs>
      {colors.map((c) => (
        <marker
          key={c.id}
          id={`${idPrefix}-${c.id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.fill} />
        </marker>
      ))}
    </defs>
  );
}

/**
 * Resolve a hex color (or semantic name) to the matching arrow marker id.
 * Used by tools that let the LLM pass arbitrary colors.
 */
export function arrowMarkerId(color: string | undefined, idPrefix = 'arrow'): string {
  if (!color) return `${idPrefix}-default`;
  const hex = color.toLowerCase();
  if (hex === DIAGRAM_COLORS.primary.toLowerCase()) return `${idPrefix}-primary`;
  if (hex === DIAGRAM_COLORS.secondary.toLowerCase()) return `${idPrefix}-secondary`;
  if (hex === DIAGRAM_COLORS.success.toLowerCase()) return `${idPrefix}-success`;
  if (hex === DIAGRAM_COLORS.warning.toLowerCase()) return `${idPrefix}-warning`;
  if (hex === DIAGRAM_COLORS.accent.toLowerCase()) return `${idPrefix}-accent`;
  return `${idPrefix}-default`;
}

export interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  label?: string;
  labelOffset?: number;
  /** Override the arrow-marker prefix (default "arrow"). */
  markerIdPrefix?: string;
}

/**
 * A straight labeled arrow from (x1,y1) to (x2,y2). Assumes ArrowMarkers has
 * already been rendered somewhere in the containing <svg>.
 */
export function Arrow({
  x1, y1, x2, y2,
  color = DIAGRAM_COLORS.slate,
  strokeWidth = 2,
  dashed = false,
  label,
  labelOffset = 6,
  markerIdPrefix = 'arrow',
}: ArrowProps): React.ReactElement {
  const markerUrl = `url(#${arrowMarkerId(color, markerIdPrefix)})`;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={markerUrl}
      />
      {label && (
        <text
          x={mx}
          y={my - labelOffset}
          fontSize={11}
          fill={color}
          textAnchor="middle"
          fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
}
