'use client';

/**
 * Spring-Mass Renderer
 *
 * Shows a horizontal (default) or vertical spring connected to a mass, with
 * the spring drawn at natural length, then at a displaced position. Labels
 * the spring constant k, displacement x, mass m, and derived angular frequency
 * ω = √(k/m) + period T = 2π/ω.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

/** See RayDiagramRenderer for documentation. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-cy': (bbox.cy / DIAGRAM_VIEWBOX.height).toFixed(3),
    'data-feature-w': (bbox.w / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-h': (bbox.h / DIAGRAM_VIEWBOX.height).toFixed(3),
  };
}

/**
 * A single element in a multi-element spring-mass chain.
 * Chains let the tool draw series / coupled setups that single-mass mode
 * can't express (e.g. "wall - spring(k1) - mass(m1) - spring(k2) - mass(m2)").
 */
export interface SpringMassElement {
  type: 'wall' | 'spring' | 'mass';
  /** Optional label override (defaults: "k = … N/m", "m = … kg"). */
  label?: string;
  /** Spring constant in N/m — required for type: 'spring'. */
  k?: number;
  /** Natural length in meters for type: 'spring'. Default 1. */
  naturalLength?: number;
  /** Mass in kg — required for type: 'mass'. */
  mass?: number;
  /** Displacement of this mass from equilibrium in meters. Default 0. */
  displacement?: number;
}

export interface SpringMassProps {
  title?: string;

  /**
   * NEW (2026-04-23): left-to-right chain of elements. When provided,
   * renders a multi-element setup. Typical shapes:
   *   [{wall}, {spring,k:200}, {mass,mass:0.5}]                       ← single mass (equiv. legacy mode)
   *   [{wall}, {spring,k:200}, {mass,mass:0.5}, {spring,k:200}, {mass,mass:0.5}]  ← two masses in series
   *   [{wall}, {spring,k:200}, {mass,mass:0.5}, {spring,k:200}, {wall}]            ← mass between two walls
   *   [{mass,mass:0.5}, {spring,k:200}, {mass,mass:0.5}]                           ← free coupled oscillator
   * Legacy k/mass/displacement fields below are ignored when this is set.
   */
  elements?: SpringMassElement[];

  // ── Legacy single-mass fields (kept for backward compatibility) ──
  /** Spring constant in N/m. */
  k?: number;
  /** Mass in kg. */
  mass?: number;
  /** Displacement from equilibrium in meters (negative = compressed). */
  displacement?: number;
  /** Natural length of the spring in meters (for scaling only). Default 1. */
  naturalLength?: number;

  orientation?: 'horizontal' | 'vertical';
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

function springPath(x1: number, y1: number, x2: number, y2: number, coils = 6, amplitude = 12): string {
  // Draw a zig-zag spring between the two points with `coils` zigzags.
  const dx = x2 - x1; const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const ux = dx / length; const uy = dy / length;
  const nx = -uy; const ny = ux;
  const segments = coils * 2;
  const step = length / segments;
  let path = `M ${x1} ${y1}`;
  for (let i = 1; i <= segments; i++) {
    const alongX = x1 + ux * step * i;
    const alongY = y1 + uy * step * i;
    const side = i % 2 === 1 ? 1 : -1;
    path += ` L ${alongX + nx * amplitude * side} ${alongY + ny * amplitude * side}`;
  }
  path += ` L ${x2} ${y2}`;
  return path;
}

/**
 * Renders a left-to-right chain of spring/mass elements. Computes real-world
 * lengths (meters) for springs, fixed px for masses, then scales uniformly to
 * fit the viewBox. A summary block at the bottom reports total spring
 * constant (for springs that are clearly in series between a wall and a
 * single mass), total mass, and — when exactly one mass is present — ω and T.
 */
function ChainRenderer({
  title, elements, notes,
}: { title?: string; elements: SpringMassElement[]; notes?: string }) {
  // Classify once so the summary block is deterministic.
  const springs = elements.filter((e) => e.type === 'spring');
  const masses = elements.filter((e) => e.type === 'mass');
  const walls = elements.filter((e) => e.type === 'wall');

  // Layout — convert the chain into (widthInMeters, pxAtScale) for each
  // element, then pick a uniform scale that fits within the viewBox.
  const MASS_METERS = 0.35;           // visual size of a mass block in "meters"
  const WALL_METERS = 0.12;           // visual width of a wall strip
  const H_CENTER = H / 2 + 10;
  const MASS_PX = 44;
  const WALL_PX = 14;

  const widthsInMeters = elements.map((el) => {
    if (el.type === 'spring') return Math.max(0.3, el.naturalLength ?? 1);
    if (el.type === 'mass') return MASS_METERS;
    return WALL_METERS; // wall
  });
  const totalMeters = widthsInMeters.reduce((a, b) => a + b, 0);

  // Use the same scale for both springs and everything else so distances
  // are consistent. Leave padding on both sides for labels.
  const padX = 36;
  const availablePx = W - 2 * padX;
  const pxPerM = availablePx / Math.max(0.5, totalMeters);

  // Precompute x positions (left edge of each element).
  let cursor = padX;
  const placed = elements.map((el, i) => {
    const wPx = widthsInMeters[i] * pxPerM;
    const x = cursor;
    cursor += wPx;
    return { el, x, w: wPx, i };
  });

  // Ground line runs through the centre of the lowest element row.
  const groundY = H_CENTER + 32;

  // Effective spring constant for the common case of "all springs between
  // a wall and a single mass" (series): 1/keff = Σ 1/k_i.
  let keff: number | null = null;
  if (walls.length >= 1 && springs.length >= 1 && masses.length === 1) {
    const kVals = springs.map((s) => s.k ?? 0).filter((v) => v > 0);
    if (kVals.length === springs.length) {
      if (kVals.length === 1) {
        keff = kVals[0];
      } else {
        // Series spring combination.
        const invSum = kVals.reduce((a, v) => a + 1 / v, 0);
        keff = invSum > 0 ? 1 / invSum : null;
      }
    }
  }
  const totalMass = masses.reduce((a, m) => a + (m.mass ?? 0), 0);
  const singleMass = masses.length === 1 ? (masses[0].mass ?? 0) : 0;
  const omega = keff && singleMass > 0 ? Math.sqrt(keff / singleMass) : 0;
  const period = omega > 0 ? (2 * Math.PI) / omega : 0;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="spr-chain-arrow" />

        {/* Ground line under the whole chain */}
        <g {...feat('ground', { cx: W / 2, cy: groundY, w: W - 2 * padX + 20, h: 8 })}>
          <line x1={padX - 10} y1={groundY} x2={W - padX + 10} y2={groundY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.2} />
        </g>

        {(() => {
          // Per-type indices so the tutor can say "mark spring-2" or
          // "circle mass-1" unambiguously even when the chain has several
          // of each. Numbered left-to-right.
          let wallN = 0, springN = 0, massN = 0;
          return placed.map(({ el, x, w, i }) => {
            const cx = x + w / 2;
            if (el.type === 'wall') {
              wallN += 1;
              const wallW = Math.min(WALL_PX, w);
              const wallX = x + (w - wallW) / 2;
              return (
                <g key={`wall-${i}`} {...feat(`wall-${wallN}`, { cx, cy: H_CENTER, w: wallW + 4, h: 100 })}>
                  <line x1={wallX + wallW} y1={H_CENTER - 50} x2={wallX + wallW} y2={H_CENTER + 30} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
                  {/* Hatch marks */}
                  {Array.from({ length: 5 }).map((_, hi) => (
                    <line key={hi} x1={wallX} y1={H_CENTER - 40 + hi * 18} x2={wallX + wallW} y2={H_CENTER - 30 + hi * 18} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                  ))}
                  {el.label && (
                    <text x={cx} y={H_CENTER - 56} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{el.label}</text>
                  )}
                </g>
              );
            }
            if (el.type === 'spring') {
              springN += 1;
              return (
                <g key={`spring-${i}`} {...feat(`spring-${springN}`, { cx, cy: H_CENTER, w, h: 40 })}>
                  <path d={springPath(x, H_CENTER, x + w, H_CENTER, 6, 10)}
                    stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" />
                  <text x={cx} y={H_CENTER - 24} fontSize={11} fill={DIAGRAM_COLORS.primary} textAnchor="middle" fontWeight={600}>
                    {el.label ?? `k = ${formatValue(el.k ?? 0)} N/m`}
                  </text>
                </g>
              );
            }
            // mass
            massN += 1;
            const boxW = Math.min(MASS_PX, w);
            const boxH = MASS_PX;
            const boxX = x + (w - boxW) / 2;
            const boxY = H_CENTER - boxH / 2;
            return (
              <g key={`mass-${i}`} {...feat(`mass-${massN}`, { cx, cy: H_CENTER, w: boxW + 4, h: boxH + 24 })}>
                <rect x={boxX} y={boxY} width={boxW} height={boxH}
                  fill={DIAGRAM_COLORS.secondary} stroke="#7f1d1d" strokeWidth={1.5} />
                <text x={cx} y={boxY + boxH / 2 + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>m</text>
                <text x={cx} y={boxY + boxH + 14} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">
                  {el.label ?? `m = ${formatValue(el.mass ?? 0)} kg`}
                </text>
              </g>
            );
          });
        })()}

        {/* Summary readouts at the bottom — only show when meaningful */}
        {springs.length > 0 && (
          <text x={padX} y={H - 38} fontSize={11} fill={DIAGRAM_COLORS.muted}>
            {springs.length === 1
              ? `1 spring, k = ${formatValue(springs[0].k ?? 0)} N/m`
              : `${springs.length} springs in series → k_eff = ${keff != null ? formatValue(keff) : '?'} N/m`}
          </text>
        )}
        {masses.length > 1 && (
          <text x={padX} y={H - 24} fontSize={11} fill={DIAGRAM_COLORS.muted}>
            {masses.length} masses, total = {formatValue(totalMass)} kg
          </text>
        )}
        {omega > 0 && (
          <text x={W - padX} y={H - 24} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">
            ω = √(k/m) = {formatValue(omega)} rad/s &nbsp; T = {formatValue(period)} s
          </text>
        )}
      </svg>
      <DiagramNotes notes={notes} />
    </div>
  );
}

export default function SpringMassRenderer({
  title,
  k = 0, mass = 0, displacement = 0,
  elements,
  naturalLength = 1,
  orientation = 'horizontal', notes,
}: SpringMassProps) {
  // ── Chain mode ─────────────────────────────────────────────────────────
  // When `elements` is supplied, render a multi-element chain (series,
  // coupled, or mass-between-walls). Chain mode always renders horizontal
  // regardless of `orientation` for now — vertical chains are uncommon.
  if (elements && elements.length > 0) {
    return <ChainRenderer title={title} elements={elements} notes={notes} />;
  }

  const omega = mass > 0 ? Math.sqrt(k / mass) : 0;
  const period = omega > 0 ? (2 * Math.PI) / omega : 0;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="spr-arrow" />

        {orientation === 'horizontal' && (() => {
          const wallX = 60; const cy = H / 2 + 20;
          const naturalPx = 140;
          const pxPerM = naturalPx / Math.max(naturalLength, 0.1);
          const displacedPx = displacement * pxPerM;
          const massSize = 52;

          const naturalEnd = wallX + naturalPx;
          const displacedEnd = wallX + naturalPx + displacedPx;

          return (
            <g>
              {/* Wall */}
              <g {...feat('wall', { cx: wallX - 7, cy, w: 22, h: 100 })}>
                <line x1={wallX} y1={cy - 50} x2={wallX} y2={cy + 50} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
                {Array.from({ length: 5 }).map((_, i) => (
                  <line key={i} x1={wallX - 14} y1={cy - 40 + i * 20} x2={wallX} y2={cy - 30 + i * 20} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                ))}
              </g>

              {/* Ground */}
              <g {...feat('ground', { cx: (wallX + (W - 30)) / 2, cy: cy + 28, w: (W - 30) - wallX, h: 6 })}>
                <line x1={wallX} y1={cy + 28} x2={W - 30} y2={cy + 28} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
              </g>

              {/* Natural-length reference spring (faint) */}
              <g {...feat('equilibrium', { cx: naturalEnd + massSize / 2, cy, w: massSize + 6, h: massSize + 18 })}>
                <path d={springPath(wallX, cy, naturalEnd, cy)} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} fill="none" opacity={0.35} />
                <rect x={naturalEnd} y={cy - massSize / 2} width={massSize} height={massSize} fill="none" stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="4 3" />
                <text x={naturalEnd + massSize / 2} y={cy - massSize / 2 - 4} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">equilibrium</text>
              </g>

              {/* Displaced spring */}
              <g {...feat('spring', { cx: (wallX + displacedEnd) / 2, cy, w: displacedEnd - wallX, h: 40 })}>
                <path d={springPath(wallX, cy, displacedEnd, cy)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" />
                {/* Spring-constant label */}
                <text x={wallX + naturalPx / 2} y={cy - 24} fontSize={11} fill={DIAGRAM_COLORS.primary} textAnchor="middle" fontWeight={600}>k = {formatValue(k)} N/m</text>
              </g>

              {/* Mass */}
              <g {...feat('mass', { cx: displacedEnd + massSize / 2, cy: cy + massSize / 4, w: massSize + 6, h: massSize + 24 })}>
                <rect x={displacedEnd} y={cy - massSize / 2} width={massSize} height={massSize} fill={DIAGRAM_COLORS.secondary} stroke="#7f1d1d" strokeWidth={1.5} />
                <text x={displacedEnd + massSize / 2} y={cy + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>m</text>
                <text x={displacedEnd + massSize / 2} y={cy + massSize / 2 + 14} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={600}>m = {formatValue(mass)} kg</text>
              </g>

              {/* Displacement annotation */}
              <g {...feat('displacement', { cx: (naturalEnd + displacedEnd) / 2, cy: cy + 50, w: Math.abs(displacedEnd - naturalEnd) + 12, h: 24 })}>
                <line x1={naturalEnd} y1={cy + 44} x2={displacedEnd} y2={cy + 44} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.5} markerStart="url(#spr-arrow-warning)" markerEnd="url(#spr-arrow-warning)" />
                <text x={(naturalEnd + displacedEnd) / 2} y={cy + 58} fontSize={11} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>x = {formatValue(displacement)} m</text>
              </g>
            </g>
          );
        })()}

        {orientation === 'vertical' && (() => {
          const topY = 40; const cx = W / 2;
          const naturalPx = 140;
          const pxPerM = naturalPx / Math.max(naturalLength, 0.1);
          const displacedPx = displacement * pxPerM;
          const massSize = 52;
          const naturalEnd = topY + naturalPx;
          const displacedEnd = topY + naturalPx + displacedPx;

          return (
            <g>
              {/* Ceiling */}
              <line x1={cx - 70} y1={topY} x2={cx + 70} y2={topY} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
              {/* Natural-length reference */}
              <path d={springPath(cx, topY, cx, naturalEnd)} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} fill="none" opacity={0.35} />
              <rect x={cx - massSize / 2} y={naturalEnd} width={massSize} height={massSize} fill="none" stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="4 3" />

              {/* Displaced */}
              <path d={springPath(cx, topY, cx, displacedEnd)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" />
              <rect x={cx - massSize / 2} y={displacedEnd} width={massSize} height={massSize} fill={DIAGRAM_COLORS.secondary} stroke="#7f1d1d" strokeWidth={1.5} />
              <text x={cx} y={displacedEnd + massSize / 2 + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>m</text>

              {/* Displacement annotation */}
              <line x1={cx + massSize / 2 + 20} y1={naturalEnd} x2={cx + massSize / 2 + 20} y2={displacedEnd} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.5} markerStart="url(#spr-arrow-warning)" markerEnd="url(#spr-arrow-warning)" />
              <text x={cx + massSize / 2 + 26} y={(naturalEnd + displacedEnd) / 2} fontSize={11} fill={DIAGRAM_COLORS.warning} fontWeight={600}>x = {formatValue(displacement)} m</text>
            </g>
          );
        })()}

        {/* Readouts */}
        <text x={W - 18} y={H - 40} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">ω = √(k/m) = {formatValue(omega)} rad/s</text>
        <text x={W - 18} y={H - 26} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">T = 2π/ω = {formatValue(period)} s</text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
