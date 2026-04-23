'use client';

/**
 * Simple Machine Renderer
 *
 * Four variants: lever (class 1/2/3), pulley (fixed/movable/compound), inclined
 * plane, and wedge. Each renders a labeled schematic with effort + load + MA
 * (mechanical advantage) annotation. The tutor passes semantic parameters
 * (effort, load, arm lengths, incline angle) rather than pixel coordinates.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';

export interface SimpleMachineProps {
  title?: string;
  type: 'lever' | 'pulley' | 'inclined-plane' | 'wedge';
  /** Class 1/2/3 for levers, or 'fixed'/'movable'/'compound' for pulleys. */
  variant?: 'class-1' | 'class-2' | 'class-3' | 'fixed' | 'movable' | 'compound';
  effort?: number;
  load?: number;
  /** Lever-specific: distances from fulcrum. */
  effortArm?: number;
  loadArm?: number;
  /** Inclined plane: angle in degrees. */
  angle?: number;
  /** Inclined plane / wedge: ramp or wedge length. */
  length?: number;
  /** Inclined plane: height. */
  height?: number;
  /** Pulley: number of supporting ropes (sets MA). */
  ropes?: number;
  unit?: string;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

export default function SimpleMachineRenderer({
  title, type, variant,
  effort, load, effortArm, loadArm,
  angle, length, height, ropes,
  unit = 'N', notes,
}: SimpleMachineProps) {
  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="sm-arrow" />

        {type === 'lever' && renderLever(variant, effort, load, effortArm, loadArm, unit)}
        {type === 'pulley' && renderPulley(variant, effort, load, ropes, unit)}
        {type === 'inclined-plane' && renderInclinedPlane(effort, load, angle, length, height, unit)}
        {type === 'wedge' && renderWedge(effort, load, angle, length, unit)}

        {notes && (
          <text x={W / 2} y={H - 6} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}

function renderLever(
  variant: SimpleMachineProps['variant'],
  effort?: number, load?: number,
  effortArm = 2, loadArm = 1, unit = 'N',
) {
  const beamY = 180;
  const totalArm = effortArm + loadArm;
  const pxPerUnit = Math.min(320 / Math.max(totalArm, 1), 60);
  const cx = W / 2;

  // Fulcrum position depends on class.
  // Class 1: fulcrum in the middle; Class 2: fulcrum at load end; Class 3: fulcrum at effort end.
  const cls = variant === 'class-2' ? 2 : variant === 'class-3' ? 3 : 1;
  let fulcrumX = cx;
  let loadX: number; let effortX: number;
  if (cls === 1) {
    fulcrumX = cx;
    loadX = cx - loadArm * pxPerUnit;
    effortX = cx + effortArm * pxPerUnit;
  } else if (cls === 2) {
    fulcrumX = cx - totalArm * pxPerUnit / 2;
    loadX = fulcrumX + loadArm * pxPerUnit;
    effortX = fulcrumX + totalArm * pxPerUnit;
  } else {
    fulcrumX = cx - totalArm * pxPerUnit / 2;
    effortX = fulcrumX + effortArm * pxPerUnit;
    loadX = fulcrumX + totalArm * pxPerUnit;
  }

  const ma = effortArm / loadArm;

  return (
    <g>
      {/* Beam */}
      <line x1={Math.min(loadX, effortX) - 20} y1={beamY} x2={Math.max(loadX, effortX) + 20} y2={beamY} stroke={DIAGRAM_COLORS.slate} strokeWidth={5} strokeLinecap="round" />
      {/* Fulcrum — triangle */}
      <polygon points={`${fulcrumX},${beamY + 2} ${fulcrumX - 16},${beamY + 32} ${fulcrumX + 16},${beamY + 32}`} fill={DIAGRAM_COLORS.slate} />
      <text x={fulcrumX} y={beamY + 48} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>Fulcrum</text>

      {/* Load */}
      <rect x={loadX - 20} y={beamY - 44} width={40} height={40} fill={DIAGRAM_COLORS.success} stroke="#166534" strokeWidth={1.5} />
      <text x={loadX} y={beamY - 52} fontSize={11} fill={DIAGRAM_COLORS.success} textAnchor="middle" fontWeight={700}>Load{load != null ? ` = ${formatValue(load)} ${unit}` : ''}</text>

      {/* Effort arrow (downward push on beam) */}
      <line x1={effortX} y1={beamY - 60} x2={effortX} y2={beamY - 6} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd="url(#sm-arrow-secondary)" />
      <text x={effortX} y={beamY - 68} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={700}>Effort{effort != null ? ` = ${formatValue(effort)} ${unit}` : ''}</text>

      {/* Arms */}
      <text x={(fulcrumX + loadX) / 2} y={beamY + 14} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">Load arm = {formatValue(loadArm)}</text>
      <text x={(fulcrumX + effortX) / 2} y={beamY + 14} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">Effort arm = {formatValue(effortArm)}</text>

      {/* Title: MA */}
      <text x={W / 2} y={36} fontSize={13} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
        Class {cls} Lever · MA = {formatValue(ma)}
      </text>
    </g>
  );
}

function renderPulley(
  variant: SimpleMachineProps['variant'],
  effort?: number, load?: number, ropes = 1, unit = 'N',
) {
  const cx = W / 2; const topY = 80;
  const loadY = 260;
  const count = variant === 'compound' ? 2 : 1;
  const movable = variant === 'movable' || variant === 'compound';
  const ma = variant === 'fixed' ? 1 : Math.max(1, ropes || (variant === 'compound' ? 4 : 2));

  return (
    <g>
      {/* Ceiling */}
      <line x1={cx - 120} y1={topY - 20} x2={cx + 120} y2={topY - 20} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={cx - 120 + i * 48} y1={topY - 20} x2={cx - 108 + i * 48} y2={topY - 8} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
      ))}

      {/* Fixed pulley */}
      <circle cx={cx} cy={topY} r={22} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
      <circle cx={cx} cy={topY} r={4} fill={DIAGRAM_COLORS.slate} />

      {/* Movable pulley for compound/movable */}
      {movable && (
        <g>
          <circle cx={cx} cy={loadY - 60} r={22} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
          <circle cx={cx} cy={loadY - 60} r={4} fill={DIAGRAM_COLORS.slate} />
          <line x1={cx} y1={loadY - 38} x2={cx} y2={loadY - 16} stroke={DIAGRAM_COLORS.slate} strokeWidth={2} />
        </g>
      )}

      {/* Rope */}
      {variant === 'fixed' && (
        <g>
          <line x1={cx - 22} y1={topY} x2={cx - 22} y2={loadY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
          <line x1={cx + 22} y1={topY} x2={cx + 22} y2={topY + 40} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
          <line x1={cx + 22} y1={topY + 40} x2={cx + 22} y2={loadY - 40} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
        </g>
      )}
      {movable && (
        <g>
          {/* Rope attached to ceiling, under movable, up over fixed (compound), down to effort */}
          <line x1={cx - 22} y1={topY - 20} x2={cx - 22} y2={loadY - 60} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
          <path d={`M ${cx - 22} ${loadY - 60} Q ${cx} ${loadY - 38} ${cx + 22} ${loadY - 60}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} fill="none" />
          <line x1={cx + 22} y1={loadY - 60} x2={cx + 22} y2={topY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
          {variant === 'compound' && (
            <g>
              <path d={`M ${cx + 22} ${topY} Q ${cx + 34} ${topY - 4} ${cx + 44} ${topY + 8}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} fill="none" />
              <line x1={cx + 44} y1={topY + 8} x2={cx + 44} y2={loadY - 40} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
            </g>
          )}
        </g>
      )}

      {/* Load */}
      <rect x={cx - 30} y={loadY - 40} width={60} height={50} fill={DIAGRAM_COLORS.success} stroke="#166534" strokeWidth={1.5} />
      <text x={cx} y={loadY - 12} fontSize={11} fill="white" textAnchor="middle" fontWeight={700}>Load</text>
      {load != null && (
        <text x={cx} y={loadY + 22} fontSize={11} fill={DIAGRAM_COLORS.success} textAnchor="middle" fontWeight={600}>{formatValue(load)} {unit}</text>
      )}

      {/* Effort arrow: always pulling down on the free end of the rope */}
      {(() => {
        const ex = variant === 'compound' ? cx + 44 : cx + 22;
        return (
          <g>
            <line x1={ex} y1={loadY - 80} x2={ex} y2={loadY - 30} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd="url(#sm-arrow-secondary)" />
            <text x={ex + 6} y={loadY - 60} fontSize={11} fill={DIAGRAM_COLORS.secondary} fontWeight={700}>Effort{effort != null ? ` = ${formatValue(effort)} ${unit}` : ''}</text>
          </g>
        );
      })()}

      <text x={W / 2} y={36} fontSize={13} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
        {variant === 'fixed' ? 'Fixed Pulley' : variant === 'movable' ? 'Movable Pulley' : 'Compound Pulley'} · MA = {ma}
      </text>
    </g>
  );
}

function renderInclinedPlane(
  effort?: number, load?: number,
  theta = 30, length = 4, height?: number,
  unit = 'N',
) {
  const rad = (theta * Math.PI) / 180;
  const h = height ?? length * Math.sin(rad);
  const base = length * Math.cos(rad);
  const px = Math.min(360 / Math.max(base, 0.1), 180 / Math.max(h, 0.1));
  const apexX = 80; const apexY = 280 - h * px;
  const baseEndX = apexX + base * px;
  const baseY = 280;

  const ma = 1 / Math.sin(rad);

  return (
    <g>
      {/* Ground */}
      <line x1={40} y1={baseY} x2={W - 40} y2={baseY} stroke={DIAGRAM_COLORS.slate} strokeWidth={2} />
      {/* Triangle ramp */}
      <polygon points={`${apexX},${baseY} ${baseEndX},${baseY} ${apexX},${apexY}`} fill="#e0e7ef" stroke={DIAGRAM_COLORS.slate} strokeWidth={2} />
      {/* Box on ramp */}
      {(() => {
        const bx = apexX + base * px * 0.4;
        const by = baseY - (length * px * 0.4) * Math.sin(rad);
        const boxSize = 36;
        const angle = -theta;
        return (
          <g transform={`translate(${bx}, ${by}) rotate(${angle})`}>
            <rect x={-boxSize / 2} y={-boxSize - 4} width={boxSize} height={boxSize} fill={DIAGRAM_COLORS.success} stroke="#166534" strokeWidth={1.5} />
            <text x={0} y={-boxSize / 2} fontSize={10} fill="white" textAnchor="middle" fontWeight={700}>Load</text>
          </g>
        );
      })()}
      {/* Effort up the incline */}
      <line x1={apexX + base * px * 0.5} y1={baseY - h * px * 0.5} x2={apexX + base * px * 0.2} y2={baseY - h * px * 0.2} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd="url(#sm-arrow-secondary)" />

      {/* Dimensions */}
      <text x={(apexX + baseEndX) / 2} y={baseY + 14} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">Base = {formatValue(base)}</text>
      <text x={apexX - 6} y={(apexY + baseY) / 2} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">Height = {formatValue(h)}</text>
      <text x={(apexX + baseEndX) / 2 - 30} y={(apexY + baseY) / 2 - 4} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle" transform={`rotate(${-theta} ${(apexX + baseEndX) / 2 - 30} ${(apexY + baseY) / 2 - 4})`}>
        Length = {formatValue(length)}
      </text>

      {/* Effort & load labels */}
      {effort != null && (
        <text x={apexX + base * px * 0.2} y={baseY - h * px * 0.2 - 8} fontSize={11} fill={DIAGRAM_COLORS.secondary} fontWeight={700}>Effort = {formatValue(effort)} {unit}</text>
      )}
      {load != null && (
        <text x={baseEndX + 6} y={baseY - 8} fontSize={11} fill={DIAGRAM_COLORS.success} fontWeight={700}>Load = {formatValue(load)} {unit}</text>
      )}

      <text x={W / 2} y={36} fontSize={13} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
        Inclined Plane ({formatValue(theta)}°) · MA = {formatValue(ma)}
      </text>
    </g>
  );
}

function renderWedge(
  effort?: number, load?: number,
  theta = 20, length = 4, unit = 'N',
) {
  const cx = W / 2; const cy = H / 2 + 10;
  const rad = (theta * Math.PI) / 180;
  const halfW = Math.sin(rad) * 80;
  const h = length * 40;

  return (
    <g>
      {/* Object being split (horizontal block) */}
      <rect x={cx - 140} y={cy - 10} width={280} height={30} fill="#e7d8b0" stroke="#997a3b" strokeWidth={1.5} />
      {/* Wedge — triangle pointing down */}
      <polygon points={`${cx - halfW},${cy - 10 - h} ${cx + halfW},${cy - 10 - h} ${cx},${cy - 10}`} fill={DIAGRAM_COLORS.warning} stroke="#9a4f09" strokeWidth={2} />
      {/* Effort arrow downward on wedge */}
      <line x1={cx} y1={cy - 10 - h - 70} x2={cx} y2={cy - 10 - h - 4} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd="url(#sm-arrow-secondary)" />
      <text x={cx} y={cy - 10 - h - 80} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={700}>Effort{effort != null ? ` = ${formatValue(effort)} ${unit}` : ''}</text>
      {/* Splitting forces */}
      <line x1={cx} y1={cy + 6} x2={cx - 80} y2={cy + 6} stroke={DIAGRAM_COLORS.success} strokeWidth={2} markerEnd="url(#sm-arrow-success)" />
      <line x1={cx} y1={cy + 6} x2={cx + 80} y2={cy + 6} stroke={DIAGRAM_COLORS.success} strokeWidth={2} markerEnd="url(#sm-arrow-success)" />
      {load != null && (
        <text x={cx} y={cy + 28} fontSize={10} fill={DIAGRAM_COLORS.success} textAnchor="middle" fontWeight={600}>Load split force = {formatValue(load)} {unit}</text>
      )}

      <text x={cx} y={36} fontSize={13} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
        Wedge ({formatValue(theta)}°) · MA = {formatValue(1 / Math.sin(rad))}
      </text>
    </g>
  );
}
