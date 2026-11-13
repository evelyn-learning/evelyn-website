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
    const movable = props.variant === 'movable' || props.variant === 'compound' || (props.variant == null && (props.ropes ?? 1) > 1);
    entries.push({
      name: 'pulley-fixed',
      kind: 'object',
      description: props.variant === 'movable' && !((props.ropes ?? 2) > 2)
        ? 'ceiling anchor where the rope is tied (a single movable pulley has no fixed pulley)'
        : 'fixed pulley block attached to the ceiling',
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

/** Given values keep their precision (up to 6 s.f.); derived ones show 3 s.f. */
function num(v: number, sig = 6): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const a = Math.abs(v);
  const s = a >= Math.pow(10, sig) ? String(Math.round(a)) : String(parseFloat(a.toPrecision(sig)));
  return (v < 0 ? '−' : '') + s;
}
const calc = (v: number) => (Math.abs(v) >= 1000 ? num(Math.round(v), 9) : num(v, 3));
const tw = (text: string, fs: number, bold = true) => text.length * fs * (bold ? 0.6 : 0.56);
const clampCx = (cx: number, w: number) => Math.min(W - 5 - w / 2, Math.max(5 + w / 2, cx));
const FS = 12;
const INK = { load: '#15803d', loadEdge: '#166534', effort: DIAGRAM_COLORS.secondary, dim: DIAGRAM_COLORS.slate, wood: '#e7d8b0', woodEdge: '#997a3b' };
const forceText = (name: string, v: number | undefined, unit: string) => (v != null && Number.isFinite(v) ? `${name} = ${num(v)} ${unit}` : name);

type VB = { width: number; height: number };
interface Drawing { vb: VB; node: React.ReactNode; name: string; latex: string }

function Txt({ x, y, children, fill = DIAGRAM_COLORS.text, fs = FS, anchor = 'middle', bold = true, italic, halo = true, rotate }: {
  x: number; y: number; children: React.ReactNode; fill?: string; fs?: number;
  anchor?: 'start' | 'middle' | 'end'; bold?: boolean; italic?: boolean; halo?: boolean; rotate?: number;
}) {
  return (
    <text x={x} y={y} fontSize={fs} fill={fill} textAnchor={anchor} fontWeight={bold ? 700 : 500}
      fontStyle={italic ? 'italic' : undefined}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      {...(halo ? { stroke: 'white', strokeWidth: 3, paintOrder: 'stroke', strokeLinejoin: 'round' as const } : {})}>
      {children}
    </text>
  );
}

/** Straight force arrow; a path so a slanted shaft is not read as a box. */
function Force({ x1, y1, x2, y2, color = 'secondary' }: { x1: number; y1: number; x2: number; y2: number; color?: 'secondary' | 'success' }) {
  return (
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} fill="none" strokeWidth={2.5}
      stroke={color === 'secondary' ? INK.effort : INK.load} markerEnd={`url(#sm-arrow-${color})`} />
  );
}

/** Dimension line between two x positions with the value printed under it. */
function HDim({ xa, xb, y, text, color = INK.dim }: { xa: number; xb: number; y: number; text: string; color?: string }) {
  const l = Math.min(xa, xb); const r = Math.max(xa, xb);
  return (
    <g>
      <path d={`M ${l + 1} ${y} L ${r - 1} ${y}`} stroke={color} strokeWidth={1.25} fill="none"
        markerStart="url(#sm-arrow-default)" markerEnd="url(#sm-arrow-default)" />
      <Txt x={clampCx((l + r) / 2, tw(text, FS - 0.5))} y={y + 16} fill={color} fs={FS - 0.5}>{text}</Txt>
    </g>
  );
}

function Hatch({ x1, x2, y, up = true }: { x1: number; x2: number; y: number; up?: boolean }) {
  const n = Math.floor((x2 - x1) / 12);
  return (
    <g>
      <rect x={x1} y={up ? y - 12 : y} width={x2 - x1} height={12} fill="#e2e8f0" />
      {Array.from({ length: n }).map((_, i) => (
        <line key={i} x1={x1 + 2 + i * 12} y1={up ? y : y + 12} x2={x1 + 12 + i * 12} y2={up ? y - 12 : y} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
      ))}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
    </g>
  );
}

export default function SimpleMachineRenderer({
  title, type, variant,
  effort, load, effortArm, loadArm,
  angle, length, height, ropes,
  unit = 'N', notes,
}: SimpleMachineProps) {
  const drawing: Drawing | null =
    type === 'lever' ? drawLever(variant, effort, load, effortArm, loadArm, unit)
      : type === 'pulley' ? drawPulley(variant, effort, load, ropes, unit)
        : type === 'inclined-plane' ? drawInclinedPlane(effort, load, angle, length, height, unit)
          : type === 'wedge' ? drawWedge(effort, load, angle, length, height, unit)
            : null;
  if (!drawing) return null;
  // The machine's name is not repeated when the title already says it.
  const squash = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const showName = !title || !squash(title).includes(squash(drawing.name));
  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${drawing.vb.width} ${drawing.vb.height}`} xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxWidth: 680, maxHeight: 420, display: 'block', margin: '0 auto' }}>
        <ArrowMarkers idPrefix="sm-arrow" />
        {drawing.node}
      </svg>
      <div style={{ textAlign: 'center', fontSize: 15, color: DIAGRAM_COLORS.text, marginTop: 2, lineHeight: 2.1 }}>
        {showName && <span style={{ fontWeight: 600 }}>{drawing.name}: </span>}
        <InlineMathText text={`$${drawing.latex}$`} forceMath literalLineBreaks={false} />
      </div>
      <DiagramNotes notes={notes} />
    </div>
  );
}

function drawLever(
  variant: SimpleMachineProps['variant'],
  effort?: number, load?: number,
  effortArmIn?: number, loadArmIn?: number, unit = 'N',
): Drawing {
  const effortArm = effortArmIn != null && effortArmIn > 0 ? effortArmIn : 2;
  const loadArm = loadArmIn != null && loadArmIn > 0 ? loadArmIn : 1;
  const cls = variant === 'class-2' ? 2 : variant === 'class-3' ? 3 : 1;
  const beamY = 104;
  const vb = { width: W, height: cls === 1 ? beamY + 88 : beamY + 122 };

  // Arms to scale, but never so short that the two forces or their labels pile up.
  let fulcrumX: number; let loadX: number; let effortX: number;
  if (cls === 1) {
    const span = 380; const minArm = 84;
    const loadPx = Math.min(span - minArm, Math.max(minArm, (span * loadArm) / (loadArm + effortArm)));
    fulcrumX = (W - span) / 2 + loadPx;
    loadX = fulcrumX - loadPx; effortX = fulcrumX + (span - loadPx);
  } else {
    const span = 360; const minGap = 104;
    fulcrumX = 84;
    // Both arms start at the fulcrum; the longer one spans the beam, order as given
    // (equal arms fall back to the textbook order of the class).
    const effortFar = effortArm === loadArm ? cls === 2 : effortArm > loadArm;
    const nearPx = Math.min(span - minGap, Math.max(minGap, (span * Math.min(effortArm, loadArm)) / Math.max(effortArm, loadArm)));
    effortX = fulcrumX + (effortFar ? span : nearPx);
    loadX = fulcrumX + (effortFar ? nearPx : span);
  }
  const beamL = Math.min(fulcrumX, loadX, effortX) - 24; const beamR = Math.max(fulcrumX, loadX, effortX) + 24;
  const down = cls === 1; // a first-class effort pushes down; in classes 2 and 3 it lifts
  const loadLabel = forceText('Load', load, unit); const effortLabel = forceText('Effort', effort, unit);
  const loadW = tw(loadLabel, FS); const effortW = tw(effortLabel, FS);
  // The load caption steps aside if it would run through the effort arrow.
  let loadCx = loadX;
  if (Math.abs(loadX - effortX) < loadW / 2 + 10) loadCx = effortX + (loadX < effortX ? -1 : 1) * (loadW / 2 + 10);
  loadCx = clampCx(loadCx, loadW);
  const row1 = beamY + 56; const row2 = cls === 1 ? row1 : beamY + 90;
  const loadRow = cls === 1 || loadX < effortX ? row1 : row2;
  const effortRow = cls === 1 || effortX < loadX ? row1 : row2;

  const node = (
    <g>
      {/* extension lines for the arm dimensions */}
      <line x1={fulcrumX} y1={beamY + 36} x2={fulcrumX} y2={Math.max(row1, row2) + 6} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />
      <line x1={loadX} y1={beamY + 8} x2={loadX} y2={loadRow + 6} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />
      <line x1={effortX} y1={beamY + 8} x2={effortX} y2={effortRow + 6} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />

      <rect x={beamL} y={beamY - 4} width={beamR - beamL} height={9} rx={3} fill="#94a3b8" stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
      <g {...feat('fulcrum', { cx: fulcrumX, cy: beamY + 20, w: 44, h: 40 }, vb)}>
        <polygon points={`${fulcrumX},${beamY + 5} ${fulcrumX - 18},${beamY + 35} ${fulcrumX + 18},${beamY + 35}`} fill={DIAGRAM_COLORS.slate} />
        <line x1={fulcrumX - 32} y1={beamY + 35} x2={fulcrumX + 32} y2={beamY + 35} stroke={DIAGRAM_COLORS.slate} strokeWidth={2} />
        <Txt x={fulcrumX - 26} y={beamY + 26} anchor="end" fill={DIAGRAM_COLORS.slate} fs={FS - 0.5}>fulcrum</Txt>
      </g>

      <g {...feat('load', { cx: loadX, cy: beamY - 26, w: 50, h: 60 }, vb)}>
        <rect x={loadX - 20} y={beamY - 38} width={40} height={34} rx={2} fill={DIAGRAM_COLORS.success} stroke={INK.loadEdge} strokeWidth={1.5} />
        <Txt x={loadCx} y={beamY - 47} fill={INK.load}>{loadLabel}</Txt>
      </g>

      <g {...feat('effort', { cx: effortX, cy: beamY - 44, w: 60, h: 84 }, vb)}>
        {down
          ? <Force x1={effortX} y1={beamY - 72} x2={effortX} y2={beamY - 6} />
          : <Force x1={effortX} y1={beamY - 8} x2={effortX} y2={beamY - 72} />}
        <Txt x={clampCx(effortX, effortW)} y={beamY - 80} fill={INK.effort}>{effortLabel}</Txt>
      </g>

      <g {...feat('load-arm', { cx: (fulcrumX + loadX) / 2, cy: loadRow + 8, w: Math.abs(fulcrumX - loadX), h: 30 }, vb)}>
        <HDim xa={fulcrumX} xb={loadX} y={loadRow} text={`load arm = ${num(loadArm)}`} color={INK.load} />
      </g>
      <g {...feat('effort-arm', { cx: (fulcrumX + effortX) / 2, cy: effortRow + 8, w: Math.abs(fulcrumX - effortX), h: 30 }, vb)}>
        <HDim xa={fulcrumX} xb={effortX} y={effortRow} text={`effort arm = ${num(effortArm)}`} color={INK.effort} />
      </g>
    </g>
  );
  return {
    vb, node, name: `Class ${cls} lever`,
    latex: `\\text{MA} = \\dfrac{\\text{effort arm}}{\\text{load arm}} = \\dfrac{${num(effortArm)}}{${num(loadArm)}} = ${calc(effortArm / loadArm)}`,
  };
}

function drawPulley(
  variant: SimpleMachineProps['variant'],
  effort?: number, load?: number, ropes?: number, unit = 'N',
): Drawing {
  const vb = { width: W, height: 340 };
  const ceilY = 24;
  const rope = { stroke: '#334155', strokeWidth: 2, fill: 'none' as const };
  const loadLabel = forceText('Load', load, unit); const effortLabel = forceText('Effort', effort, unit);
  const wheel = (x: number, y: number, r: number) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="#f1f5f9" stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
      <circle cx={x} cy={y} r={Math.max(3, r * 0.16)} fill={DIAGRAM_COLORS.slate} />
    </g>
  );
  const loadBox = (x: number, topY: number) => (
    <g {...feat('load', { cx: x, cy: topY + 30, w: 90, h: 76 }, vb)}>
      <rect x={x - 32} y={topY} width={64} height={44} rx={2} fill={DIAGRAM_COLORS.success} stroke={INK.loadEdge} strokeWidth={1.5} />
      <Txt x={clampCx(x, tw(loadLabel, FS))} y={topY + 62} fill={INK.load}>{loadLabel}</Txt>
    </g>
  );
  const asked = Number.isFinite(ropes) && (ropes as number) >= 1 ? Math.round(ropes as number) : undefined;

  // A single movable pulley: rope tied to the ceiling, round the pulley that
  // carries the load, and up to a hand that lifts. Two strands hold the load.
  if (variant === 'movable' && !(asked != null && asked > 2)) {
    const cx = 246; const r = 30; const wy = 196; const freeY = 118;
    const node = (
      <g>
        <Hatch x1={cx - 130} x2={cx + 130} y={ceilY} />
        <g {...feat('pulley-fixed', { cx: cx - r, cy: ceilY + 4, w: 24, h: 20 }, vb)}>
          <circle cx={cx - r} cy={ceilY + 2} r={4} fill={DIAGRAM_COLORS.slate} />
        </g>
        <path d={`M ${cx - r} ${ceilY + 2} L ${cx - r} ${wy} A ${r} ${r} 0 0 0 ${cx + r} ${wy} L ${cx + r} ${freeY}`} {...rope} />
        <g {...feat('pulley-movable', { cx, cy: wy, w: 2 * r + 8, h: 2 * r + 8 }, vb)}>
          {wheel(cx, wy, r - 3)}
          <line x1={cx} y1={wy} x2={cx} y2={wy + r + 18} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
        </g>
        {loadBox(cx, wy + r + 18)}
        <g {...feat('effort', { cx: cx + r + 40, cy: freeY - 26, w: 120, h: 70 }, vb)}>
          <Force x1={cx + r} y1={freeY} x2={cx + r} y2={freeY - 56} />
          <Txt x={cx + r + 12} y={freeY - 26} anchor="start" fill={INK.effort}>{effortLabel}</Txt>
        </g>
        <Txt x={cx - r - 8} y={150} anchor="end" fill={DIAGRAM_COLORS.muted} bold={false} fs={FS - 1}>1</Txt>
        <Txt x={cx + r + 8} y={150} anchor="start" fill={DIAGRAM_COLORS.muted} bold={false} fs={FS - 1}>2</Txt>
      </g>
    );
    return { vb, node, name: 'Movable pulley', latex: '\\text{MA} = \\text{strands holding the load} = 2' };
  }

  // Fixed pulley (1 strand) and block and tackle (n strands): wheels side by
  // side, every strand vertical, so the strands holding the lower block can
  // be counted. Strand 0 is the free end, pulled down.
  // No variant given: the rope count decides (one rope = a fixed pulley).
  const isFixed = variant === 'fixed' || (variant == null && !(asked != null && asked > 1));
  const n = isFixed ? 1 : Math.min(8, Math.max(2, asked ?? (variant === 'compound' ? 4 : 2)));
  const d = Math.min(60, Math.max(28, 240 / n)); const r = d / 2;
  const x0 = 270 - (n * d) / 2;
  const X = (i: number) => x0 + i * d;
  const upperY = ceilY + 26 + r; const lowerY = upperY + 132;
  const nUpper = Math.ceil(n / 2); const nLower = Math.floor(n / 2);
  const barY = lowerY + r + 12;
  const loadX = n === 1 ? X(1) : (X(1) + X(n)) / 2;
  const boxTop = n === 1 ? upperY + 150 : barY + 18;
  const freeY = upperY + 58;
  const strands: React.ReactNode[] = [];
  strands.push(<path key="free" d={`M ${X(0)} ${upperY} L ${X(0)} ${freeY}`} {...rope} />);
  for (let i = 1; i <= n; i++) {
    const last = i === n;
    const top = last && n % 2 === 0 ? ceilY : upperY;            // even: the rope end is tied to the ceiling
    const bottom = n === 1 ? boxTop : last && n % 2 === 1 ? barY : lowerY; // odd: tied to the lower block
    strands.push(<path key={i} d={`M ${X(i)} ${top} L ${X(i)} ${bottom}`} {...rope} />);
  }
  const node = (
    <g>
      <Hatch x1={Math.min(X(0) - 40, 150)} x2={Math.max(X(n) + 40, 390)} y={ceilY} />
      <g {...feat('pulley-fixed', { cx: (X(0) + X(2 * nUpper - 1)) / 2, cy: upperY, w: (2 * nUpper - 1) * d + 8, h: d + 8 }, vb)}>
        {Array.from({ length: nUpper }).map((_, j) => {
          const wx = X(2 * j) + r;
          return (
            <g key={j}>
              <line x1={wx} y1={ceilY} x2={wx} y2={upperY} stroke={DIAGRAM_COLORS.slate} strokeWidth={4} />
              {wheel(wx, upperY, r - 2)}
              <path d={`M ${X(2 * j)} ${upperY} A ${r} ${r} 0 0 1 ${X(2 * j + 1)} ${upperY}`} {...rope} />
            </g>
          );
        })}
      </g>
      {n > 1 && (
        <g {...feat('pulley-movable', { cx: loadX, cy: lowerY + 8, w: (n - 1) * d + 16, h: d + 30 }, vb)}>
          <rect x={X(1) - 8} y={barY - 4} width={X(n) - X(1) + 16} height={8} rx={3} fill={DIAGRAM_COLORS.slate} />
          {Array.from({ length: nLower }).map((_, j) => {
            const wx = X(2 * j + 1) + r;
            return (
              <g key={j}>
                <line x1={wx} y1={lowerY} x2={wx} y2={barY} stroke={DIAGRAM_COLORS.slate} strokeWidth={4} />
                {wheel(wx, lowerY, r - 2)}
                <path d={`M ${X(2 * j + 1)} ${lowerY} A ${r} ${r} 0 0 0 ${X(2 * j + 2)} ${lowerY}`} {...rope} />
              </g>
            );
          })}
          <line x1={loadX} y1={barY} x2={loadX} y2={boxTop} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
        </g>
      )}
      {n > 1 && n % 2 === 0 && <circle cx={X(n)} cy={ceilY + 2} r={4} fill={DIAGRAM_COLORS.slate} />}
      {n > 1 && n % 2 === 1 && <circle cx={X(n)} cy={barY - 4} r={4} fill={DIAGRAM_COLORS.slate} />}
      {strands}
      {n > 1 && Array.from({ length: n }).map((_, i) => (
        <Txt key={i} x={X(i + 1) + 5} y={(upperY + lowerY) / 2 + 22} anchor="start" fill={DIAGRAM_COLORS.muted} bold={false} fs={FS - 1}>{i + 1}</Txt>
      ))}
      {loadBox(loadX, boxTop)}
      <g {...feat('effort', { cx: X(0) - 40, cy: freeY + 26, w: 130, h: 70 }, vb)}>
        <Force x1={X(0)} y1={freeY} x2={X(0)} y2={freeY + 54} />
        <Txt x={X(0) - 12} y={freeY + 32} anchor="end" fill={INK.effort}>{effortLabel}</Txt>
      </g>
    </g>
  );
  return n === 1
    ? { vb, node, name: 'Fixed pulley', latex: '\\text{MA} = 1 \\quad \\text{(it only changes the direction of the pull)}' }
    : { vb, node, name: variant === 'movable' ? 'Movable pulley system' : 'Compound pulley', latex: `\\text{MA} = \\text{strands holding the load} = ${n}` };
}

function drawInclinedPlane(
  effort?: number, load?: number,
  angleIn?: number, lengthIn?: number, heightIn?: number,
  unit = 'N',
): Drawing {
  const length = lengthIn != null && lengthIn > 0 ? lengthIn : 4;
  const fromSides = heightIn != null && heightIn > 0 && heightIn < length ? (Math.asin(heightIn / length) * 180) / Math.PI : undefined;
  const theta = Math.min(89, Math.max(0.5, angleIn != null && angleIn > 0 ? angleIn : fromSides ?? 30));
  const rad = (theta * Math.PI) / 180;
  const h = heightIn != null && heightIn > 0 ? heightIn : length * Math.sin(rad);
  const base = length * Math.cos(rad);
  // Drawn at the true angle when that is readable; a sliver or a wall is
  // opened up to a readable angle and the figure says so.
  const phiDeg = Math.min(64, Math.max(15, theta));
  const exaggerated = Math.abs(phiDeg - theta) > 0.5;
  const phi = (phiDeg * Math.PI) / 180;
  const groundY = 236;
  const vb = { width: W, height: groundY + (exaggerated ? 50 : 32) };
  const slopePx = Math.min(300 / Math.cos(phi), 168 / Math.sin(phi));
  const basePx = slopePx * Math.cos(phi); const hPx = slopePx * Math.sin(phi);
  const originX = 136 + (300 - basePx) / 2;
  const baseEndX = originX + basePx; const apexY = groundY - hPx;
  const u = { x: Math.cos(phi), y: Math.sin(phi) };      // down the slope
  const nrm = { x: Math.sin(phi), y: -Math.cos(phi) };   // out of the slope, into the air
  const onSlope = (t: number) => ({ x: originX + t * basePx, y: apexY + t * hPx });

  const box = 40;
  const tBox = 0.56;
  const foot = onSlope(tBox);
  const c = { x: foot.x + nrm.x * (box / 2), y: foot.y + nrm.y * (box / 2) };
  // Effort: attached to the block's uphill face, pulling it up the slope.
  const arrowLen = Math.min(64, Math.max(30, tBox * slopePx - box / 2 - 16));
  const a0 = { x: c.x - u.x * (box / 2 + 2), y: c.y - u.y * (box / 2 + 2) };
  const a1 = { x: a0.x - u.x * arrowLen, y: a0.y - u.y * arrowLen };
  const effortLabel = forceText('Effort', effort, unit); const loadLabel = forceText('Load', load, unit);
  const effortW = tw(effortLabel, FS);
  const off = 7 + (effortW / 2) * Math.sin(phi) + 7 * Math.cos(phi);
  const effortPos = {
    x: clampCx((a0.x + a1.x) / 2 + nrm.x * off, effortW),
    y: Math.max(14, (a0.y + a1.y) / 2 + nrm.y * off),
  };
  const lenPt = onSlope(phiDeg > 45 ? 0.5 : 0.4);
  const arcR = phiDeg < 25 ? 58 : 34;
  const angDist = Math.max(arcR + 15, 11 / Math.sin(phi / 2));

  const node = (
    <g>
      <line x1={36} y1={groundY} x2={W - 36} y2={groundY} stroke={DIAGRAM_COLORS.slate} strokeWidth={2}
        {...feat('ground', { cx: W / 2, cy: groundY, w: W - 72, h: 6 }, vb)} />
      <polygon points={`${originX},${groundY} ${baseEndX},${groundY} ${originX},${apexY}`}
        fill="#e0e7ef" stroke={DIAGRAM_COLORS.slate} strokeWidth={2} strokeLinejoin="round"
        {...feat('ramp', { cx: originX + basePx / 3, cy: groundY - hPx / 3, w: basePx, h: hPx }, vb)} />
      <path d={`M ${originX + 10} ${groundY} L ${originX + 10} ${groundY - 10} L ${originX} ${groundY - 10}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} fill="none" />

      <g {...feat('load', { cx: c.x, cy: c.y, w: box * 1.4, h: box * 1.4 }, vb)}>
        <rect x={-box / 2} y={-box} width={box} height={box} rx={2}
          transform={`translate(${foot.x} ${foot.y}) rotate(${phiDeg})`}
          fill={DIAGRAM_COLORS.success} stroke={INK.loadEdge} strokeWidth={1.5} />
        <Txt x={c.x + box * 0.72 + 6} y={c.y + 2} anchor="start" fill={INK.load}>{loadLabel}</Txt>
      </g>

      <g {...feat('effort', { cx: (a0.x + a1.x) / 2, cy: (a0.y + a1.y) / 2, w: 80, h: 50 }, vb)}>
        <Force x1={a0.x} y1={a0.y} x2={a1.x} y2={a1.y} />
        <Txt x={effortPos.x} y={effortPos.y + 4} fill={INK.effort}>{effortLabel}</Txt>
      </g>

      <g {...feat('angle', { cx: baseEndX - arcR / 2, cy: groundY - arcR / 3, w: arcR + 20, h: arcR + 12 }, vb)}>
        <path d={`M ${baseEndX - arcR} ${groundY} A ${arcR} ${arcR} 0 0 1 ${baseEndX - arcR * Math.cos(phi)} ${groundY - arcR * Math.sin(phi)}`}
          stroke={DIAGRAM_COLORS.accent} strokeWidth={1.75} fill="none" />
        <Txt x={baseEndX - angDist * Math.cos(phi / 2)} y={groundY - angDist * Math.sin(phi / 2) + 4} fill={DIAGRAM_COLORS.accent} halo={false}>{num(theta)}°</Txt>
      </g>

      {/* The three sides, each labelled on its own side of the triangle. */}
      <g {...feat('length', { cx: lenPt.x, cy: lenPt.y, w: 90, h: 30 }, vb)}>
        <Txt x={lenPt.x - nrm.x * 15} y={lenPt.y - nrm.y * 15 + 4} rotate={phiDeg} halo={false} fill={DIAGRAM_COLORS.text} fs={FS - 0.5}>length = {num(length)}</Txt>
      </g>
      <g {...feat('height', { cx: originX - 46, cy: (apexY + groundY) / 2, w: 90, h: 18 }, vb)}>
        <Txt x={originX - 9} y={(apexY + groundY) / 2 + 4} anchor="end" fill={DIAGRAM_COLORS.text} fs={FS - 0.5}>height = {calc(h)}</Txt>
      </g>
      <g {...feat('base', { cx: (originX + baseEndX) / 2, cy: groundY + 18, w: basePx, h: 18 }, vb)}>
        <Txt x={(originX + baseEndX) / 2} y={groundY + 18} fill={DIAGRAM_COLORS.text} fs={FS - 0.5}>base = {calc(base)}</Txt>
      </g>
      {exaggerated && (
        <Txt x={W / 2} y={groundY + 38} fill={DIAGRAM_COLORS.muted} bold={false} italic fs={FS - 1}>not drawn to scale: the slope is shown {phiDeg > theta ? 'steeper' : 'less steep'} than {num(theta)}° so it can be read</Txt>
      )}
    </g>
  );
  const bySides = heightIn != null && heightIn > 0 && lengthIn != null && lengthIn > 0;
  return {
    vb, node, name: 'Inclined plane',
    latex: bySides
      ? `\\text{MA} = \\dfrac{\\text{length}}{\\text{height}} = \\dfrac{${num(length)}}{${num(h)}} = ${calc(length / h)}`
      : `\\text{MA} = \\dfrac{\\text{length}}{\\text{height}} = \\dfrac{1}{\\sin ${num(theta)}^\\circ} = ${calc(1 / Math.sin(rad))}`,
  };
}

function drawWedge(
  effort?: number, load?: number,
  angleIn?: number, length?: number, thickness?: number, unit = 'N',
): Drawing {
  const bySides = length != null && length > 0 && thickness != null && thickness > 0;
  const theta = Math.min(170, Math.max(1, angleIn != null && angleIn > 0
    ? angleIn : bySides ? (2 * Math.atan((thickness as number) / (2 * (length as number))) * 180) / Math.PI : 20));
  // The tip angle is drawn true from 12° to 110°; a needle is opened up and labelled as such.
  const phiDeg = Math.min(110, Math.max(12, theta));
  const exaggerated = Math.abs(phiDeg - theta) > 0.5;
  const half = (phiDeg * Math.PI) / 360;
  const cx = W / 2; const surfaceY = 152; const blockH = 92;
  const vb = { width: W, height: surfaceY + blockH + (exaggerated ? 34 : 14) };
  const wedgeH = Math.min(132, 118 / Math.tan(half));
  const depth = Math.min(62, wedgeH * 0.5);
  const tipY = surfaceY + depth; const topY = tipY - wedgeH;
  const halfTop = wedgeH * Math.tan(half);
  const halfAt = (y: number) => (tipY - y) * Math.tan(half);
  const effortLabel = forceText('Effort', effort, unit); const loadLabel = forceText('Load', load, unit);
  const fy = surfaceY + depth * 0.5;
  const faceL = cx - halfAt(fy) - 6; const faceR = cx + halfAt(fy) + 6;
  const labelY = fy - 13 - FS >= surfaceY + 2 ? fy - 13 : fy + 22;
  // The captions start clear of the wedge face at their own height.
  const labelGap = halfAt(labelY - FS) + 9;
  const angDist = Math.min(wedgeH - 14, Math.max(46, 15 / Math.tan(half)));
  const arcR = angDist - 15;

  const node = (
    <g>
      <rect x={46} y={surfaceY} width={W - 92} height={blockH} rx={3} fill={INK.wood} stroke={INK.woodEdge} strokeWidth={1.5}
        {...feat('object', { cx, cy: surfaceY + blockH / 2, w: W - 92, h: blockH }, vb)} />
      <path d={`M ${cx} ${tipY} L ${cx - 2} ${tipY + 14} L ${cx + 2} ${tipY + 24} L ${cx} ${surfaceY + blockH}`} stroke={INK.woodEdge} strokeWidth={1.5} fill="none" />
      <polygon points={`${cx - halfTop},${topY} ${cx + halfTop},${topY} ${cx},${tipY}`}
        fill="#fbbf24" stroke="#9a4f09" strokeWidth={2} strokeLinejoin="round"
        {...feat('wedge', { cx, cy: topY + wedgeH / 2, w: halfTop * 2, h: wedgeH }, vb)} />
      <path d={`M ${cx - arcR * Math.sin(half)} ${tipY - arcR * Math.cos(half)} A ${arcR} ${arcR} 0 0 1 ${cx + arcR * Math.sin(half)} ${tipY - arcR * Math.cos(half)}`}
        stroke="#7c2d12" strokeWidth={1.5} fill="none" />
      <Txt x={cx} y={tipY - angDist + 4} fill="#7c2d12" halo={false}>{num(theta)}°</Txt>

      <g {...feat('effort', { cx, cy: topY - 34, w: 110, h: 72 }, vb)}>
        <Force x1={cx} y1={topY - 54} x2={cx} y2={topY - 4} />
        <Txt x={cx} y={topY - 62} fill={INK.effort}>{effortLabel}</Txt>
      </g>

      <g {...feat('load', { cx, cy: fy, w: 300, h: 40 }, vb)}>
        <Force x1={faceL} y1={fy} x2={faceL - 62} y2={fy} color="success" />
        <Force x1={faceR} y1={fy} x2={faceR + 62} y2={fy} color="success" />
        <Txt x={cx - labelGap} y={labelY} anchor="end" fill={INK.loadEdge} halo={false}>{loadLabel}</Txt>
        <Txt x={cx + labelGap} y={labelY} anchor="start" fill={INK.loadEdge} halo={false}>{loadLabel}</Txt>
      </g>
      {exaggerated && (
        <Txt x={cx} y={surfaceY + blockH + 22} fill={DIAGRAM_COLORS.muted} bold={false} italic fs={FS - 1}>not drawn to scale: the wedge is shown {phiDeg > theta ? 'wider' : 'narrower'} than {num(theta)}° so it can be read</Txt>
      )}
    </g>
  );
  return {
    vb, node, name: 'Wedge',
    latex: bySides
      ? `\\text{MA} = \\dfrac{\\text{length}}{\\text{thickness}} = \\dfrac{${num(length as number)}}{${num(thickness as number)}} = ${calc((length as number) / (thickness as number))}`
      : `\\text{MA} = \\dfrac{\\text{length}}{\\text{thickness}} = \\dfrac{1}{2\\tan(${num(theta)}^\\circ / 2)} = ${calc(1 / (2 * Math.tan((theta * Math.PI) / 360)))}`,
  };
}
