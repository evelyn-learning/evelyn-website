'use client';

/**
 * Free Body Diagram Renderer
 *
 * Structured parametric tool for physics mechanics. The model supplies the
 * object shape, the surface type (horizontal / inclined / vertical / none),
 * optional friction, and a list of forces — each with a name, optional
 * magnitude string, and a direction (cardinal/ordinal, slope-relative, or
 * raw angle in degrees). The renderer handles geometry, colors, arrowheads,
 * and label placement so the LLM never has to emit SVG coordinates.
 *
 * Force colors are auto-assigned by name convention (W/Mg → green gravity,
 * N → amber normal, f/friction → purple, T → blue tension, default red
 * for applied forces), but can be overridden per-force.
 */

import React from 'react';

export type FbdDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right'
  | 'normal'       // perpendicular to surface, outward
  | 'up-slope'     // along incline, uphill
  | 'down-slope'   // along incline, downhill
  | 'into-surface';

export type FbdSurfaceType = 'horizontal' | 'inclined' | 'vertical' | 'none';
export type FbdObjectShape = 'box' | 'circle' | 'person';

export interface FbdForce {
  name: string;
  magnitude?: string;
  /** Either a named direction or an angle in degrees (math convention: CCW from +x, 90 = up). */
  direction: FbdDirection | number;
  color?: string;
  /** Scales the drawn arrow length relative to the default. 1.0 = default. */
  scale?: number;
}

export interface FbdSurface {
  type: FbdSurfaceType;
  /** Degrees above horizontal for inclined surface. Ignored otherwise. */
  angle?: number;
  friction?: boolean;
}

export interface FreeBodyDiagramProps {
  title?: string;
  object: {
    shape?: FbdObjectShape;
    label?: string;
    mass?: string;
  };
  surface?: FbdSurface;
  forces: FbdForce[];
  notes?: string;
}

const VIEWBOX_W = 520;
const VIEWBOX_H = 380;
const DEFAULT_ARROW_LEN = 90;

// Auto-assign colors based on force name conventions.
function colorForForce(name: string, explicit?: string): string {
  if (explicit) return explicit;
  const n = (name || '').toLowerCase().trim();
  if (/^(w|mg|f[_ ]?g|gravity|weight)/.test(n)) return '#16a34a'; // green - gravity
  if (/^n\b|normal/.test(n)) return '#d97706';                    // amber - normal
  if (/^f[_ ]?[skf]\b|friction/.test(n)) return '#9333ea';        // purple - friction
  if (/^t\b|tension/.test(n)) return '#2563eb';                   // blue - tension
  return '#dc2626';                                               // red - applied (default)
}

// Convert named direction to degrees (math convention: CCW from +x, 90 = up).
// Accepts a named direction OR a raw number OR a numeric string (e.g. "45")
// — the OpenAI Realtime strict-schema validator forbids union types on tool
// parameters, so the model sends numeric angles as strings.
function dirToAngle(dir: FbdDirection | number | string, surfaceAngle: number): number {
  if (typeof dir === 'number') return dir;
  if (typeof dir === 'string') {
    const trimmed = dir.trim();
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return parseFloat(trimmed);
    switch (trimmed as FbdDirection) {
      case 'right': return 0;
      case 'up-right': return 45;
      case 'up': return 90;
      case 'up-left': return 135;
      case 'left': return 180;
      case 'down-left': return -135;
      case 'down': return -90;
      case 'down-right': return -45;
      case 'normal': return 90 + surfaceAngle;        // perpendicular to slope, outward
      case 'up-slope': return surfaceAngle;
      case 'down-slope': return 180 + surfaceAngle;
      case 'into-surface': return -(90 + surfaceAngle);
    }
  }
  return 0;
}

// Row of hatched lines below a surface (ground/incline).
function HatchPattern({
  x1, x2, y, length = 10, spacing = 12, angleDeg = 45,
}: { x1: number; x2: number; y: number; length?: number; spacing?: number; angleDeg?: number }) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = -Math.cos(rad) * length;
  const dy = Math.sin(rad) * length;
  const lines: React.ReactElement[] = [];
  for (let x = x1; x <= x2; x += spacing) {
    lines.push(
      <line key={x} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="#94a3b8" strokeWidth={1} />,
    );
  }
  return <g>{lines}</g>;
}

// Hatched lines perpendicular to a slope (from top-left to bottom-right).
function SlopeHatching({
  x1, y1, x2, y2, length = 10, spacing = 14,
}: { x1: number; y1: number; x2: number; y2: number; length?: number; spacing?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular INTO the slope (below the hypotenuse, away from the object)
  const perpX = uy;
  const perpY = -ux;
  const lines: React.ReactElement[] = [];
  for (let d = 0; d <= len; d += spacing) {
    const sx = x1 + ux * d;
    const sy = y1 + uy * d;
    lines.push(
      <line
        key={d}
        x1={sx}
        y1={sy}
        x2={sx - perpX * length}
        y2={sy - perpY * length}
        stroke="#94a3b8"
        strokeWidth={1}
      />,
    );
  }
  return <g>{lines}</g>;
}

export default function FreeBodyDiagramRenderer({
  title,
  object,
  surface = { type: 'none' },
  forces,
  notes,
}: FreeBodyDiagramProps) {
  const surfaceAngle = surface.angle ?? 0;
  const shape: FbdObjectShape = object.shape ?? 'box';
  const BLOCK_HALF = 28;         // box renders as 56×56, half-side used for lift math
  const BODY_CLEARANCE = BLOCK_HALF + 4; // lift enough that the block SITS on the slope, not in it

  // Object center depends on surface layout.
  let objX = 260;
  let objY = 190;
  let slopeBottomLeft: { x: number; y: number } | null = null;
  let slopeTopRight: { x: number; y: number } | null = null;

  if (surface.type === 'inclined') {
    // Slope rises left→right (conventional physics orientation). The angle θ
    // is at the bottom-left vertex where the hypotenuse meets the base.
    const baseY = 300;
    const baseXStart = 70;
    const baseXEnd = 430;
    const run = baseXEnd - baseXStart;
    const rise = Math.min(run * Math.tan((surfaceAngle * Math.PI) / 180), 200);
    slopeBottomLeft = { x: baseXStart, y: baseY };
    slopeTopRight = { x: baseXEnd, y: baseY - rise };
    // Position object at ~50% along the hypotenuse from bottom-left to top-right.
    const t = 0.5;
    objX = baseXStart + (baseXEnd - baseXStart) * t;
    objY = baseY + ((baseY - rise) - baseY) * t;
    // Lift the object along the outward normal so its bottom edge sits ON
    // the hypotenuse rather than embedded in the slope. Outward normal for a
    // rising-right slope points up-and-left: (−sin θ, −cos θ) in SVG coords.
    const rad = (surfaceAngle * Math.PI) / 180;
    objX += -Math.sin(rad) * BODY_CLEARANCE;
    objY += -Math.cos(rad) * BODY_CLEARANCE;
  } else if (surface.type === 'vertical') {
    objX = 330;
    objY = 180;
  } else if (surface.type === 'horizontal') {
    objX = 260;
    objY = 170;
  }

  const renderObject = (): React.ReactElement => {
    if (shape === 'circle') {
      return (
        <circle cx={objX} cy={objY} r={28} fill="#93c5fd" stroke="#1e40af" strokeWidth={2} />
      );
    }
    if (shape === 'person') {
      return (
        <g stroke="#1e40af" strokeWidth={2} fill="#93c5fd" strokeLinecap="round">
          <circle cx={objX} cy={objY - 22} r={10} />
          <line x1={objX} y1={objY - 12} x2={objX} y2={objY + 18} />
          <line x1={objX} y1={objY - 4} x2={objX - 14} y2={objY + 10} />
          <line x1={objX} y1={objY - 4} x2={objX + 14} y2={objY + 10} />
          <line x1={objX} y1={objY + 18} x2={objX - 10} y2={objY + 36} />
          <line x1={objX} y1={objY + 18} x2={objX + 10} y2={objY + 36} />
        </g>
      );
    }
    // Default: box (rotated to match slope if inclined)
    const rotation =
      surface.type === 'inclined' ? `rotate(${-surfaceAngle} ${objX} ${objY})` : '';
    return (
      <rect
        x={objX - 28}
        y={objY - 28}
        width={56}
        height={56}
        fill="#93c5fd"
        stroke="#1e40af"
        strokeWidth={2}
        rx={4}
        transform={rotation || undefined}
      />
    );
  };

  const renderSurface = (): React.ReactElement | null => {
    if (surface.type === 'none') return null;
    if (surface.type === 'horizontal') {
      const groundY = objY + 32;
      return (
        <g>
          <line x1={50} y1={groundY} x2={470} y2={groundY} stroke="#64748b" strokeWidth={2.5} />
          <HatchPattern x1={50} x2={470} y={groundY} angleDeg={45} />
        </g>
      );
    }
    if (surface.type === 'vertical') {
      const wallX = objX + 44;
      return (
        <g>
          <line x1={wallX} y1={40} x2={wallX} y2={340} stroke="#64748b" strokeWidth={2.5} />
          {/* Hatches to the right of the wall, slanting up-right */}
          {Array.from({ length: 24 }).map((_, i) => {
            const y = 40 + i * 12;
            return (
              <line
                key={i}
                x1={wallX}
                y1={y}
                x2={wallX + 10}
                y2={y - 10}
                stroke="#94a3b8"
                strokeWidth={1}
              />
            );
          })}
        </g>
      );
    }
    if (surface.type === 'inclined' && slopeBottomLeft && slopeTopRight) {
      // Slope rises left→right. Triangle vertices:
      //   A = bottom-left (pivot, where angle θ sits)
      //   B = bottom-right
      //   C = top-right
      const { x: ax, y: ay } = slopeBottomLeft;
      const { x: cx, y: cy } = slopeTopRight;
      const bx = cx;
      const by = ay;
      // Angle arc at bottom-left vertex, sweeping from the +x axis up to the
      // hypotenuse direction.
      const arcRadius = 28;
      const arcRad = (surfaceAngle * Math.PI) / 180;
      const arcStartX = ax + arcRadius;
      const arcStartY = ay;
      const arcEndX = ax + arcRadius * Math.cos(arcRad);
      const arcEndY = ay - arcRadius * Math.sin(arcRad);
      return (
        <g>
          <polygon
            points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
            fill="#f1f5f9"
            stroke="#64748b"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <SlopeHatching x1={ax} y1={ay} x2={cx} y2={cy} />
          <path
            d={`M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`}
            fill="none"
            stroke="#475569"
            strokeWidth={1.5}
          />
          <text
            x={ax + arcRadius + 6}
            y={ay - 6}
            fontSize={13}
            fill="#475569"
            fontStyle="italic"
          >
            θ = {surfaceAngle}°
          </text>
          {surface.friction && (
            <text x={bx - 100} y={by + 30} fontSize={12} fill="#9333ea">
              μ (friction)
            </text>
          )}
        </g>
      );
    }
    return null;
  };

  // Assign a unique arrowhead marker per color used (so the stroke doesn't
  // leak through the fill).
  const usedColors = Array.from(new Set(forces.map((f) => colorForForce(f.name, f.color))));

  // Distance from object center to where an arrow should start (the "edge"
  // of the body) so the vector line doesn't visually cut through the object.
  // Box: half-side. Circle: radius. Person: approximated torso radius.
  const bodyRadius =
    shape === 'circle' ? 28
    : shape === 'person' ? 18
    : BLOCK_HALF;

  // Detect forces that share an angle (within 5°) so we can offset their
  // labels perpendicular to the arrow, preventing overlap.
  const angles = forces.map((f) => dirToAngle(f.direction, surfaceAngle));
  const angleClusters = angles.map((a, i) => {
    let cluster = 0;
    for (let j = 0; j < i; j++) {
      if (Math.abs(((angles[j] - a + 540) % 360) - 180) < 5) cluster++;
    }
    return cluster;
  });

  const renderForces = (): React.ReactElement[] =>
    forces.map((f, i) => {
      const angle = angles[i];
      const rad = (angle * Math.PI) / 180;
      const len = DEFAULT_ARROW_LEN * (f.scale ?? 1);
      const dirX = Math.cos(rad);
      const dirY = -Math.sin(rad); // SVG y is flipped
      // Start the arrow at the body edge, not the center.
      const startX = objX + dirX * bodyRadius;
      const startY = objY + dirY * bodyRadius;
      // When two forces share a direction, separate their arrows so both are
      // visible rather than one on top of the other.
      const cluster = angleClusters[i];
      const clusterLen = len - cluster * 18;
      const tipX = startX + dirX * Math.max(clusterLen, 30);
      const tipY = startY + dirY * Math.max(clusterLen, 30);
      const color = colorForForce(f.name, f.color);
      // Labels just past the arrow tip, offset perpendicular when multiple
      // forces share this direction.
      const labelOffset = 16;
      const perpX = -dirY;
      const perpY = dirX;
      const perpStep = 14 * cluster; // 0 for first, 14 for second, etc.
      const labelX = tipX + dirX * labelOffset + perpX * perpStep;
      const labelY = tipY + dirY * labelOffset + perpY * perpStep;
      // Defensive label hygiene. The model sometimes sends (a) LaTeX commands
      // in magnitude, which don't render in plain SVG text, (b) long descriptive
      // phrases in name, which overflow and collide with other labels, and (c)
      // redundant "X = X" where magnitude echoes the name. Sanitize all three.
      const stripLatex = (s: string): string => s
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2') // \frac{a}{b} → a/b
        .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')             // \sqrt{x} → √(x)
        .replace(/\\text\{([^{}]+)\}/g, '$1')                // \text{x} → x
        .replace(/\\(theta|pi|alpha|beta|mu|Delta|omega|phi|rho|sigma|gamma)\b/g, (_, n) => {
          const map: Record<string, string> = {
            theta: 'θ', pi: 'π', alpha: 'α', beta: 'β', mu: 'μ',
            Delta: 'Δ', omega: 'ω', phi: 'φ', rho: 'ρ', sigma: 'σ', gamma: 'γ',
          };
          return map[n] || n;
        })
        .replace(/\\[a-zA-Z]+/g, '')   // strip any remaining LaTeX commands
        .replace(/[{}]/g, '')
        .trim();
      const truncate = (s: string, max: number): string =>
        s.length > max ? `${s.slice(0, max - 1)}…` : s;
      const nameN = truncate(stripLatex((f.name || '').trim()), 8);
      const magN = truncate(stripLatex((f.magnitude || '').trim()), 14);
      const label = magN && magN !== nameN ? `${nameN} = ${magN}` : nameN;
      return (
        <g key={`${f.name}-${i}`}>
          <line
            x1={startX}
            y1={startY}
            x2={tipX}
            y2={tipY}
            stroke={color}
            strokeWidth={3}
            markerEnd={`url(#fbd-arrow-${color.replace('#', '')})`}
          />
          <text
            x={labelX}
            y={labelY}
            fontSize={13}
            fill={color}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        </g>
      );
    });

  const objectCaption = object.mass || object.label;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 8,
            color: '#0f172a',
          }}
        >
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: 400 }}
      >
        <defs>
          {usedColors.map((c) => (
            <marker
              key={c}
              id={`fbd-arrow-${c.replace('#', '')}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {renderSurface()}
        {renderObject()}
        {/* Object label inside the object */}
        {objectCaption && (
          <text
            x={objX}
            y={objY + 4}
            fontSize={13}
            fill="#0f172a"
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {objectCaption}
          </text>
        )}
        {renderForces()}
        {notes && wrapText(notes, 80).map((line, i, lines) => (
          <text
            key={`note-${i}`}
            x={VIEWBOX_W / 2}
            y={VIEWBOX_H - 12 - (lines.length - 1 - i) * 14}
            fontSize={12}
            fill="#64748b"
            textAnchor="middle"
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Best-effort word-wrap for SVG text (no native wrapping in SVG <text>).
// Caps lines at ~charsPerLine characters, preserving whole words when possible.
function wrapText(text: string, charsPerLine: number): string[] {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > charsPerLine && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  // Hard-cap to 3 lines to avoid eating into the diagram.
  if (lines.length > 3) {
    const kept = lines.slice(0, 3);
    kept[2] = kept[2].replace(/.{0,3}$/, '…');
    return kept;
  }
  return lines;
}
