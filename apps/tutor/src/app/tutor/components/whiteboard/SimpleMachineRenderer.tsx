'use client';

import { InlineMathText } from './InlineMathText';
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
import { DIAGRAM_VIEWBOX, formatValue, feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

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

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Each machine type (lever/pulley/inclined-plane/wedge) emits its own feature
 * set, so we branch on props.type.
 */
export function buildSimpleMachineManifest(props: SimpleMachineProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  if (props.type === 'lever') {
    entries.push({
      name: 'fulcrum',
      kind: 'object',
      description: 'triangular fulcrum pivot under the beam',
      labels: ['fulcrum', 'the fulcrum', 'pivot', 'pivot point', 'support', 'hinge', 'triangle', 'pivot triangle'],
    });
    entries.push({
      name: 'load',
      kind: 'object',
      description: `load block${props.load != null ? ` = ${formatValue(props.load)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['load', 'the load', 'resistance', 'weight', 'load block', 'load force', 'output force', 'Fr', 'FL'],
    });
    entries.push({
      name: 'effort',
      kind: 'other',
      description: `effort force arrow${props.effort != null ? ` = ${formatValue(props.effort)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['effort', 'the effort', 'effort force', 'applied force', 'input force', 'force', 'Fe', 'F applied'],
    });
    entries.push({
      name: 'load-arm',
      kind: 'label',
      description: `load-arm length label = ${formatValue(props.loadArm ?? 1)}`,
      labels: ['load-arm', 'load arm', 'resistance arm', 'load arm length', 'd load', 'dL'],
    });
    entries.push({
      name: 'effort-arm',
      kind: 'label',
      description: `effort-arm length label = ${formatValue(props.effortArm ?? 2)}`,
      labels: ['effort-arm', 'effort arm', 'input arm', 'effort arm length', 'd effort', 'dE'],
    });
  } else if (props.type === 'pulley') {
    const movable = props.variant === 'movable' || props.variant === 'compound';
    entries.push({
      name: 'pulley-fixed',
      kind: 'object',
      description: 'fixed pulley attached to ceiling',
      labels: ['pulley-fixed', 'fixed pulley', 'top pulley', 'upper pulley', 'ceiling pulley', ...(movable ? [] : ['pulley', 'the pulley'])],
    });
    if (movable) {
      entries.push({
        name: 'pulley-movable',
        kind: 'object',
        description: 'movable pulley that rises with the load',
        labels: ['pulley-movable', 'movable pulley', 'moving pulley', 'lower pulley', 'bottom pulley', 'load pulley'],
      });
    }
    entries.push({
      name: 'load',
      kind: 'object',
      description: `load block${props.load != null ? ` = ${formatValue(props.load)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['load', 'the load', 'weight', 'mass', 'load block', 'hanging weight', 'W', 'FL'],
    });
    entries.push({
      name: 'effort',
      kind: 'other',
      description: `effort force arrow on free rope end${props.effort != null ? ` = ${formatValue(props.effort)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['effort', 'the effort', 'effort force', 'applied force', 'input force', 'pull', 'tension', 'Fe'],
    });
  } else if (props.type === 'inclined-plane') {
    entries.push({
      name: 'ground',
      kind: 'line',
      description: 'horizontal ground line under the ramp',
      labels: ['ground', 'floor', 'bottom', 'surface', 'baseline', 'ground line'],
    });
    entries.push({
      name: 'ramp',
      kind: 'shape',
      description: `triangular ramp (angle ${formatValue(props.angle ?? 30)}°)`,
      labels: ['ramp', 'the ramp', 'incline', 'slope', 'inclined plane', 'triangle', 'hypotenuse'],
    });
    entries.push({
      name: 'load',
      kind: 'object',
      description: 'load box resting on the hypotenuse',
      labels: ['load', 'the load', 'box', 'block', 'crate', 'mass', 'weight', 'object on ramp'],
    });
    entries.push({
      name: 'effort',
      kind: 'other',
      description: `effort force arrow parallel to the ramp${props.effort != null ? ` = ${formatValue(props.effort)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['effort', 'the effort', 'effort force', 'applied force', 'push', 'pull', 'force up ramp', 'Fe'],
    });
    entries.push({
      name: 'angle',
      kind: 'annotation',
      description: `ramp angle arc θ = ${formatValue(props.angle ?? 30)}° at base-right vertex`,
      labels: ['angle', 'θ', 'theta', 'ramp angle', 'incline angle', 'the angle', 'angle of incline'],
    });
    entries.push({
      name: 'length',
      kind: 'label',
      description: `hypotenuse length label = ${formatValue(props.length ?? 4)} m`,
      labels: ['length', 'ramp length', 'hypotenuse', 'L', 'ramp length label', 'slope length'],
    });
    entries.push({
      name: 'height',
      kind: 'label',
      description: 'vertical height label on the left edge of the triangle',
      labels: ['height', 'h', 'vertical height', 'rise', 'height label'],
    });
    entries.push({
      name: 'base',
      kind: 'label',
      description: 'base length label below the ground edge',
      labels: ['base', 'base length', 'run', 'horizontal distance', 'base label'],
    });
  } else if (props.type === 'wedge') {
    entries.push({
      name: 'object',
      kind: 'object',
      description: 'horizontal block being split by the wedge',
      labels: ['object', 'the object', 'block', 'log', 'material', 'workpiece', 'the block', 'split object'],
    });
    entries.push({
      name: 'wedge',
      kind: 'shape',
      description: `wedge (downward-pointing triangle, angle ${formatValue(props.angle ?? 20)}°)`,
      labels: ['wedge', 'the wedge', 'triangle', 'splitting wedge', 'axe head', 'blade'],
    });
    entries.push({
      name: 'effort',
      kind: 'other',
      description: `effort force pushing down on the wedge${props.effort != null ? ` = ${formatValue(props.effort)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['effort', 'the effort', 'effort force', 'applied force', 'input force', 'push', 'downward force', 'Fe'],
    });
    entries.push({
      name: 'load',
      kind: 'other',
      description: `splitting reaction forces on the object${props.load != null ? ` = ${formatValue(props.load)} ${props.unit ?? 'N'}` : ''}`,
      labels: ['load', 'the load', 'splitting force', 'reaction force', 'splitting forces', 'output force', 'resistance'],
    });
  }
  return entries;
}

export default function SimpleMachineRenderer({
  title, type, variant,
  effort, load, effortArm, loadArm,
  angle, length, height, ropes,
  unit = 'N', notes,
}: SimpleMachineProps) {
  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="sm-arrow" />

        {type === 'lever' && renderLever(variant, effort, load, effortArm, loadArm, unit)}
        {type === 'pulley' && renderPulley(variant, effort, load, ropes, unit)}
        {type === 'inclined-plane' && renderInclinedPlane(effort, load, angle, length, height, unit)}
        {type === 'wedge' && renderWedge(effort, load, angle, length, unit)}
      </svg>
    <DiagramNotes notes={notes} />
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
      <polygon
        points={`${fulcrumX},${beamY + 2} ${fulcrumX - 16},${beamY + 32} ${fulcrumX + 16},${beamY + 32}`}
        fill={DIAGRAM_COLORS.slate}
        {...feat('fulcrum', { cx: fulcrumX, cy: beamY + 24, w: 40, h: 48 })}
      />
      <text x={fulcrumX} y={beamY + 48} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>Fulcrum</text>

      {/* Load */}
      <g {...feat('load', { cx: loadX, cy: beamY - 24, w: 50, h: 60 })}>
        <rect x={loadX - 20} y={beamY - 44} width={40} height={40} fill={DIAGRAM_COLORS.success} stroke="#166534" strokeWidth={1.5} />
        <text x={loadX} y={beamY - 52} fontSize={11} fill={DIAGRAM_COLORS.success} textAnchor="middle" fontWeight={700}>Load{load != null ? ` = ${formatValue(load)} ${unit}` : ''}</text>
      </g>

      {/* Effort arrow (downward push on beam) */}
      <g {...feat('effort', { cx: effortX, cy: beamY - 40, w: 60, h: 80 })}>
        <line x1={effortX} y1={beamY - 60} x2={effortX} y2={beamY - 6} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd="url(#sm-arrow-secondary)" />
        <text x={effortX} y={beamY - 68} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={700}>Effort{effort != null ? ` = ${formatValue(effort)} ${unit}` : ''}</text>
      </g>

      {/* Arms */}
      <text
        x={(fulcrumX + loadX) / 2} y={beamY + 14} fontSize={10}
        fill={DIAGRAM_COLORS.muted} textAnchor="middle"
        {...feat('load-arm', { cx: (fulcrumX + loadX) / 2, cy: beamY + 14, w: Math.abs(fulcrumX - loadX), h: 14 })}
      >Load arm = {formatValue(loadArm)}</text>
      <text
        x={(fulcrumX + effortX) / 2} y={beamY + 14} fontSize={10}
        fill={DIAGRAM_COLORS.muted} textAnchor="middle"
        {...feat('effort-arm', { cx: (fulcrumX + effortX) / 2, cy: beamY + 14, w: Math.abs(fulcrumX - effortX), h: 14 })}
      >Effort arm = {formatValue(effortArm)}</text>

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
      <g {...feat('pulley-fixed', { cx: cx, cy: topY, w: 52, h: 52 })}>
        <circle cx={cx} cy={topY} r={22} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
        <circle cx={cx} cy={topY} r={4} fill={DIAGRAM_COLORS.slate} />
      </g>

      {/* Movable pulley for compound/movable */}
      {movable && (
        <g {...feat('pulley-movable', { cx: cx, cy: loadY - 60, w: 52, h: 52 })}>
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
      <g {...feat('load', { cx: cx, cy: loadY - 15, w: 80, h: 70 })}>
        <rect x={cx - 30} y={loadY - 40} width={60} height={50} fill={DIAGRAM_COLORS.success} stroke="#166534" strokeWidth={1.5} />
        <text x={cx} y={loadY - 12} fontSize={11} fill="white" textAnchor="middle" fontWeight={700}>Load</text>
        {load != null && (
          <text x={cx} y={loadY + 22} fontSize={11} fill={DIAGRAM_COLORS.success} textAnchor="middle" fontWeight={600}>{formatValue(load)} {unit}</text>
        )}
      </g>

      {/* Effort arrow: always pulling down on the free end of the rope */}
      {(() => {
        const ex = variant === 'compound' ? cx + 44 : cx + 22;
        return (
          <g {...feat('effort', { cx: ex + 20, cy: loadY - 55, w: 80, h: 60 })}>
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
  // Uniform px-per-meter so the triangle's angle VISUALLY matches θ.
  const pxPerM = Math.min(320 / Math.max(base, 0.1), 180 / Math.max(h, 0.1));

  // Triangle geometry:
  //   originX = base-left (right-angle corner)
  //   baseEndX = base-right (where the incline angle θ is measured)
  //   apex = directly above origin at (originX, baseY - h*px)
  //   hypotenuse = apex → baseEndX, descending to the right
  const baseY = H - 70;
  const originX = 100;
  const baseEndX = originX + base * pxPerM;
  const apexY = baseY - h * pxPerM;

  const ma = 1 / Math.sin(rad);

  // Parameterize a point on the hypotenuse: t=0 → apex, t=1 → baseEnd.
  const hypo = (t: number) => ({
    x: originX + t * (baseEndX - originX),
    y: apexY + t * (baseY - apexY),
  });

  // Box sits ON the hypotenuse at 50% and tilts with the ramp.
  // Rotation: +θ (SVG CW) so the box's LEFT side is UP (uphill) and RIGHT
  // side is DOWN (downhill), matching the physical orientation on a
  // right-descending ramp. The rect local coords place its BOTTOM edge at
  // y=0 so that after translate(bx,by) + rotate(+θ), the bottom edge lies
  // exactly along the ramp.
  const tBox = 0.50;
  const bxy = hypo(tBox);
  const boxSize = 40;

  // Effort arrow: parallel to the ramp, offset slightly perpendicular on
  // the air side (outside the triangle, above the ramp).
  const rampDx = (baseEndX - originX) / (length * pxPerM); // unit along ramp (down-right)
  const rampDy = (baseY - apexY) / (length * pxPerM);
  const normX = rampDy;   // outward normal (up-right) for down-right ramp
  const normY = -rampDx;
  const effortT0 = 0.22;
  const effortT1 = 0.08;
  const e0 = hypo(effortT0);
  const e1 = hypo(effortT1);
  const offset = 26;

  // Triangle centroid + bounding box so the whole ramp is one addressable
  // feature ("ramp").
  const rampCx = (originX + baseEndX + originX) / 3;
  const rampCy = (baseY + baseY + apexY) / 3;
  const rampW = baseEndX - originX;
  const rampH = baseY - apexY;

  return (
    <g>
      {/* Ground */}
      <line
        x1={40} y1={baseY} x2={W - 40} y2={baseY}
        stroke={DIAGRAM_COLORS.slate} strokeWidth={2}
        {...feat('ground', { cx: W / 2, cy: baseY, w: W - 80, h: 6 })}
      />
      {/* Triangle ramp */}
      <polygon
        points={`${originX},${baseY} ${baseEndX},${baseY} ${originX},${apexY}`}
        fill="#e0e7ef" stroke={DIAGRAM_COLORS.slate} strokeWidth={2}
        {...feat('ramp', { cx: rampCx, cy: rampCy, w: rampW, h: rampH })}
      />

      {/* Box on the hypotenuse — the "load" / "mass" / "crate" */}
      <g
        transform={`translate(${bxy.x}, ${bxy.y}) rotate(${theta})`}
        {...feat('load', { cx: bxy.x, cy: bxy.y - boxSize / 2, w: boxSize * 1.3, h: boxSize * 1.3 })}
      >
        <rect x={-boxSize / 2} y={-boxSize} width={boxSize} height={boxSize} fill={DIAGRAM_COLORS.success} stroke="#166534" strokeWidth={1.5} />
        <text x={0} y={-boxSize / 2 + 4} fontSize={11} fill="white" textAnchor="middle" fontWeight={700}>Load</text>
      </g>

      {/* Effort arrow (uphill along the ramp, offset on the air side) */}
      <g {...feat('effort', { cx: (e0.x + e1.x) / 2 + normX * offset, cy: (e0.y + e1.y) / 2 + normY * offset, w: 80, h: 40 })}>
        <line
          x1={e0.x + normX * offset} y1={e0.y + normY * offset}
          x2={e1.x + normX * offset} y2={e1.y + normY * offset}
          stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5}
          markerEnd="url(#sm-arrow-secondary)"
        />
        {effort != null && (
          <text
            x={(e0.x + e1.x) / 2 + normX * (offset + 14)}
            y={(e0.y + e1.y) / 2 + normY * (offset + 14)}
            fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={700}
          >
            Effort = {formatValue(effort)} {unit}
          </text>
        )}
      </g>

      {/* Angle arc at the base-right corner (where θ is measured: between
          the ground going LEFT from baseEnd and the hypotenuse going UP-LEFT
          toward the apex). */}
      {(() => {
        const arcR = 34;
        const startX = baseEndX - arcR;
        const startY = baseY;
        const endX = baseEndX - arcR * Math.cos(rad);
        const endY = baseY - arcR * Math.sin(rad);
        return (
          <g {...feat('angle', { cx: baseEndX - arcR / 2, cy: baseY - arcR / 3, w: arcR + 20, h: arcR + 12 })}>
            <path d={`M ${startX} ${startY} A ${arcR} ${arcR} 0 0 1 ${endX} ${endY}`}
              stroke={DIAGRAM_COLORS.accent} strokeWidth={1.75} fill="none" />
            <text
              x={baseEndX - arcR * 1.15 * Math.cos(rad / 2)}
              y={baseY - arcR * 1.15 * Math.sin(rad / 2) + 4}
              fontSize={12} fill={DIAGRAM_COLORS.accent} fontWeight={700} textAnchor="end"
            >
              {formatValue(theta)}°
            </text>
          </g>
        );
      })()}

      {/* Length label along the hypotenuse. Parked at t=0.22 (uphill of the
          box at t=0.50, downhill of the effort-arrow tail area around
          t=0.08-0.22) so it never overlaps the load box. Also bumped the
          perpendicular offset from 16 → 22 for a bit more breathing room. */}
      {(() => {
        const mid = hypo(0.22);
        const labelOffset = 22;
        const lX = mid.x + normX * labelOffset;
        const lY = mid.y + normY * labelOffset;
        return (
          <text
            x={lX} y={lY}
            fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}
            transform={`rotate(${theta} ${lX} ${lY})`}
            {...feat('length', { cx: lX, cy: lY, w: 90, h: 18 })}
          >
            Length = {formatValue(length)} m
          </text>
        );
      })()}

      {/* Height label along the vertical left edge */}
      <text
        x={originX - 8} y={(apexY + baseY) / 2}
        fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end"
        {...feat('height', { cx: originX - 30, cy: (apexY + baseY) / 2, w: 70, h: 18 })}
      >
        Height = {formatValue(h)} m
      </text>

      {/* Base label below the ground edge */}
      <text
        x={(originX + baseEndX) / 2} y={baseY + 18}
        fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle"
        {...feat('base', { cx: (originX + baseEndX) / 2, cy: baseY + 18, w: baseEndX - originX, h: 18 })}
      >
        Base = {formatValue(base)} m
      </text>

      {/* Load annotation — tucked near the ground at the right to avoid
          the box label. */}
      {load != null && (
        <text x={baseEndX + 10} y={baseY - 6} fontSize={11} fill={DIAGRAM_COLORS.success} fontWeight={700}>
          Load = {formatValue(load)} {unit}
        </text>
      )}

      <text x={W / 2} y={32} fontSize={13} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
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
      <rect
        x={cx - 140} y={cy - 10} width={280} height={30}
        fill="#e7d8b0" stroke="#997a3b" strokeWidth={1.5}
        {...feat('object', { cx: cx, cy: cy + 5, w: 280, h: 30 })}
      />
      {/* Wedge — triangle pointing down */}
      <polygon
        points={`${cx - halfW},${cy - 10 - h} ${cx + halfW},${cy - 10 - h} ${cx},${cy - 10}`}
        fill={DIAGRAM_COLORS.warning} stroke="#9a4f09" strokeWidth={2}
        {...feat('wedge', { cx: cx, cy: cy - 10 - h / 2, w: halfW * 2, h: h })}
      />
      {/* Effort arrow downward on wedge */}
      <g {...feat('effort', { cx: cx, cy: cy - 10 - h - 40, w: 80, h: 80 })}>
        <line x1={cx} y1={cy - 10 - h - 70} x2={cx} y2={cy - 10 - h - 4} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd="url(#sm-arrow-secondary)" />
        <text x={cx} y={cy - 10 - h - 80} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={700}>Effort{effort != null ? ` = ${formatValue(effort)} ${unit}` : ''}</text>
      </g>
      {/* Splitting forces */}
      <g {...feat('load', { cx: cx, cy: cy + 6, w: 180, h: 30 })}>
        <line x1={cx} y1={cy + 6} x2={cx - 80} y2={cy + 6} stroke={DIAGRAM_COLORS.success} strokeWidth={2} markerEnd="url(#sm-arrow-success)" />
        <line x1={cx} y1={cy + 6} x2={cx + 80} y2={cy + 6} stroke={DIAGRAM_COLORS.success} strokeWidth={2} markerEnd="url(#sm-arrow-success)" />
        {load != null && (
          <text x={cx} y={cy + 28} fontSize={10} fill={DIAGRAM_COLORS.success} textAnchor="middle" fontWeight={600}>Load split force = {formatValue(load)} {unit}</text>
        )}
      </g>

      <text x={cx} y={36} fontSize={13} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
        Wedge ({formatValue(theta)}°) · MA = {formatValue(1 / Math.sin(rad))}
      </text>
    </g>
  );
}
