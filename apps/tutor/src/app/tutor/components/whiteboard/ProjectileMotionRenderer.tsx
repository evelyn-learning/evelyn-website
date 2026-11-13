'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Projectile Motion Renderer
 *
 * Plots the trajectory y(x) of a projectile launched at initial speed v0 and
 * angle θ (from horizontal) under gravity g, with optional launch height y0.
 * Draws the parabolic path, decomposed initial-velocity vector (vx, vy), and
 * annotated time-of-flight / max height / range.
 *
 * The v0 arrow has a fixed on-screen length and points along the SCREEN
 * tangent of the drawn curve, so it stays on the parabola's initial tangent
 * even when the two axes need different scales (very flat or very steep
 * shots). Labels are placed by a small candidate picker against the curve,
 * the arrows and the axes, so nothing is ever printed on a line.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface ProjectileMotionProps {
  title?: string;
  /** Initial speed. */
  v0: number;
  /** Launch angle in degrees from horizontal. */
  angle: number;
  /** Launch height above landing plane. Default 0. */
  y0?: number;
  /** Gravitational acceleration. Default 9.8. */
  g?: number;
  /** Show the decomposed vx/vy vectors at launch. Default true. */
  showComponents?: boolean;
  /** Plot N sample markers along the trajectory to mark equal-time intervals. Default 5. */
  sampleCount?: number;
  /** Units label for speed — default "m/s". */
  speedUnit?: string;
  /** Units label for distance — default "m". */
  distanceUnit?: string;
  notes?: string;
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

/** See RayDiagramRenderer for documentation. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / VIEWBOX_W).toFixed(3),
    'data-feature-cy': (bbox.cy / VIEWBOX_H).toFixed(3),
    'data-feature-w': (bbox.w / VIEWBOX_W).toFixed(3),
    'data-feature-h': (bbox.h / VIEWBOX_H).toFixed(3),
  };
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildProjectileMotionManifest(props: ProjectileMotionProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const g = props.g ?? 9.8;
  const y0 = props.y0 ?? 0;
  const theta = (props.angle * Math.PI) / 180;
  const vy = props.v0 * Math.sin(theta);

  entries.push({
    name: 'ground',
    kind: 'line',
    description: 'horizontal ground line (landing plane)',
    labels: ['ground', 'floor', 'bottom', 'surface', 'baseline', 'landing plane', 'x-axis'],
  });
  entries.push({
    name: 'y-axis',
    kind: 'axis',
    description: 'vertical axis on the left of the plot',
    labels: ['y-axis', 'y axis', 'vertical axis', 'height axis', 'left axis'],
  });
  entries.push({
    name: 'trajectory',
    kind: 'curve',
    description: `parabolic trajectory (v₀ = ${formatValue(props.v0)}, angle = ${formatValue(props.angle)}°, g = ${formatValue(g)}${props.notes ? ` — ${String(props.notes).slice(0, 100)}` : ''})`,
    labels: ['trajectory', 'path', 'parabola', 'the trajectory', 'flight path', 'curve', 'arc', 'projectile path'],
  });
  entries.push({
    name: 'launch',
    kind: 'point',
    description: `launch point at (0, ${formatValue(y0)})`,
    labels: ['launch', 'launch point', 'start', 'starting point', 'origin', 'release point', 'initial point'],
  });
  const tPeak = vy / g;
  if (Number.isFinite(tPeak) && tPeak > 0) {
    entries.push({
      name: 'peak',
      kind: 'point',
      description: 'peak (maximum height) of the trajectory',
      labels: ['peak', 'apex', 'maximum height', 'max height', 'top', 'highest point', 'the peak', 'h'],
    });
  }
  entries.push({
    name: 'landing',
    kind: 'point',
    description: 'landing point where the trajectory meets the ground',
    labels: ['landing', 'landing point', 'end', 'endpoint', 'impact', 'impact point', 'range point', 'touchdown'],
  });
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

function niceStep(raw: number): number {
  if (!(raw > 0)) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow;
}

/** A label with an optional subscript: v + x + " = 14.1 m/s". */
interface Rich { pre: string; sub?: string; rest?: string }
const richWidth = (r: Rich, fs: number, bold = false) =>
  (r.pre.length + (r.sub?.length ?? 0) * 0.7 + (r.rest?.length ?? 0)) * fs * (bold ? 0.6 : 0.56);

function RichText({ r, x, y, fs, fill, bold }: { r: Rich; x: number; y: number; fs: number; fill: string; bold?: boolean }) {
  return (
    <text x={x} y={y} fontSize={fs} fill={fill} textAnchor="middle" fontWeight={bold ? 700 : 500}
      stroke="white" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">
      <tspan fontStyle="italic">{r.pre}</tspan>
      {r.sub && <tspan dy={fs * 0.28} fontSize={fs * 0.72}>{r.sub}</tspan>}
      {r.rest && <tspan dy={r.sub ? -fs * 0.28 : 0}>{r.rest}</tspan>}
    </text>
  );
}

interface Box { l: number; r: number; t: number; b: number }
const hits = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;

export default function ProjectileMotionRenderer({
  title, v0, angle, y0 = 0, g = 9.8,
  showComponents = true, sampleCount = 5,
  speedUnit = 'm/s', distanceUnit = 'm',
  notes,
}: ProjectileMotionProps) {
  const gg = g > 0 ? g : 9.8;
  const h0 = Math.max(0, Number.isFinite(y0) ? y0 : 0);
  const theta = (angle * Math.PI) / 180;
  // A launch "backwards" (cos < 0) is drawn mirrored: the figure always runs left to right.
  // cos(90°) is 6e-17 in floating point: a straight-up throw has no horizontal speed.
  const snap = (v: number) => (Math.abs(v) < 1e-9 * Math.max(1, Math.abs(v0)) ? 0 : v);
  const vx = snap(Math.abs(v0 * Math.cos(theta)));
  const vy = snap(v0 * Math.sin(theta));

  const tFlight = Math.max(0, (vy + Math.sqrt(vy * vy + 2 * gg * h0)) / gg);
  const range = vx * tFlight;
  // A ball thrown level or downward never rises: its highest point is the launch.
  const hasApex = vy > 1e-9;
  const tPeak = hasApex ? vy / gg : 0;
  const maxH = hasApex ? h0 + (vy * vy) / (2 * gg) : h0;
  const hasCliff = h0 > 0;
  const hasComponents = showComponents && Math.abs(vy) > 1e-9 && vx > 1e-9;

  const FS = 11;
  const padL = 46; const padR = 50; const padT = 40; const padB = 56;
  const cliffW = hasCliff ? 84 : 0;
  const availW = VIEWBOX_W - padL - padR - cliffW;
  const availH = VIEWBOX_H - padT - padB;
  const ARROW = 96;

  const xData = range > 1e-9 ? range * 1.05 : Math.max(maxH * 0.5, 1);
  let yData = Math.max(maxH, h0) * 1.06 || 1;

  // True proportions when they stay readable; otherwise the cramped axis is
  // stretched to about half the plot (the ticks and a note keep that honest).
  let kx = 1; let ky = 1; let ux = 1; let uy = 0; let arrowLen = ARROW;
  for (let pass = 0; pass < 4; pass++) {
    const e = Math.min(availW / xData, availH / yData);
    kx = e; ky = e;
    if (e * yData < 0.36 * availH) ky = (0.48 * availH) / yData;
    if (e * xData < 0.45 * availW) kx = (0.62 * availW) / xData;
    const n = Math.hypot(vx * kx, vy * ky) || 1;
    ux = (vx * kx) / n; uy = (vy * ky) / n;
    arrowLen = ARROW;
    if (uy < 0) {
      // Thrown downward: the arrow must stop above the ground.
      arrowLen = Math.min(ARROW, Math.max(26, (h0 * ky - 6) / -uy));
      break;
    }
    // The arrow tip needs headroom inside the plot.
    const need = h0 + (ARROW * uy + 6) / ky;
    if (need <= yData * 1.0001) break;
    yData = need;
  }
  const distorted = range > 1e-9 && Math.max(kx, ky) / Math.min(kx, ky) > 1.15;

  const usedW = kx * xData; const usedH = ky * yData;
  const axisX = padL + (availW - usedW) / 2;
  const x0 = axisX + cliffW;
  const top = padT + (availH - usedH) / 2;
  const groundY = top + usedH;
  const sx = (x: number) => x0 + x * kx;
  const sy = (y: number) => groundY - y * ky;

  // Trajectory
  const steps = 120;
  const trajPts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * tFlight;
    return { x: sx(vx * t), y: sy(Math.max(0, h0 + vy * t - 0.5 * gg * t * t)) };
  });
  const path = trajPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

  const samples: Array<{ x: number; y: number }> = [];
  for (let i = 1; i < sampleCount && tFlight > 0; i++) {
    const t = (i / sampleCount) * tFlight;
    samples.push({ x: sx(vx * t), y: sy(Math.max(0, h0 + vy * t - 0.5 * gg * t * t)) });
  }

  // Ticks
  const xStep = niceStep(xData / Math.min(6, Math.max(2, Math.floor(usedW / 70))));
  const yStep = niceStep(yData / Math.min(6, Math.max(2, Math.floor(usedH / 45))));
  const xTicks: number[] = []; const yTicks: number[] = [];
  for (let v = 0; v <= xData * 1.0001 && xTicks.length < 12; v += xStep) xTicks.push(v);
  for (let v = yStep; v <= yData * 1.0001 && yTicks.length < 12; v += yStep) yTicks.push(v);

  // ── Label placement: first free candidate against everything drawn ──
  const obstacles: Box[] = [];
  const addPt = (x: number, y: number, r = 5) => obstacles.push({ l: x - r, r: x + r, t: y - r, b: y + r });
  const addSeg = (x1: number, y1: number, x2: number, y2: number, r = 5) => {
    const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 5));
    for (let i = 0; i <= n; i++) addPt(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, r);
  };
  const place = (w: number, cands: Array<[number, number]>): { x: number; y: number } => {
    const h = FS + 2;
    let best: { x: number; y: number; n: number } | null = null;
    for (const [cx0, cy] of cands) {
      const cx = Math.min(VIEWBOX_W - 4 - w / 2, Math.max(4 + w / 2, cx0));
      const box = { l: cx - w / 2 - 2, r: cx + w / 2 + 2, t: cy - h / 2 - 1, b: cy + h / 2 + 1 };
      let n = obstacles.reduce((acc, o) => acc + (hits(box, o) ? 1 : 0), 0);
      if (box.t < 2 || box.b > VIEWBOX_H - 2) n += 100;
      if (!best || n < best.n) best = { x: cx, y: cy, n };
      if (n === 0) break;
    }
    const p = best ?? { x: cands[0][0], y: cands[0][1] };
    obstacles.push({ l: p.x - w / 2 - 2, r: p.x + w / 2 + 2, t: p.y - h / 2 - 1, b: p.y + h / 2 + 1 });
    return { x: p.x, y: p.y };
  };

  trajPts.forEach((p) => addPt(p.x, p.y, 4));
  obstacles.push({ l: 0, r: VIEWBOX_W, t: groundY + 1, b: groundY + 22 });   // x-axis + its tick labels
  obstacles.push({ l: 0, r: axisX + 3, t: 0, b: groundY });                  // y-axis + its tick labels
  obstacles.push({ l: axisX - 20, r: axisX + 20, t: top - 26, b: top - 8 }); // y caption

  // Launch height: a dimension inside the cliff when it fits, else a caption on top of it.
  const lx = sx(0); const ly = sy(h0);
  const h0Label: Rich = { pre: 'h', sub: '0', rest: ` = ${num(h0)} ${distanceUnit}` };
  const h0W = richWidth(h0Label, FS, true);
  const cliffH = groundY - ly;
  const h0Inside = hasCliff && cliffH >= 44 && h0W <= cliffW - 26;
  const h0Pos = h0Inside
    ? { x: axisX + (cliffW - 20) / 2 + 2, y: (ly + groundY) / 2 }
    : { x: Math.max(axisX + 6 + h0W / 2, axisX + cliffW / 2), y: ly - 12 };
  if (hasCliff) {
    obstacles.push({ l: axisX, r: x0, t: ly, b: groundY });
    obstacles.push({ l: h0Pos.x - h0W / 2 - 2, r: h0Pos.x + h0W / 2 + 2, t: h0Pos.y - 9, b: h0Pos.y + 9 });
  }

  // Launch velocity arrow and its component triangle (screen space).
  const tipX = lx + arrowLen * ux; const tipY = ly - arrowLen * uy;
  const legX = tipX; // foot of the vertical leg
  addSeg(lx, ly, tipX, tipY, 6);
  if (hasComponents) { addSeg(lx, ly, legX, ly, 3); addSeg(legX, ly, tipX, tipY, 3); }
  const up = uy >= 0 ? 1 : -1;

  // Apex
  const apexX = sx(vx * tPeak); const apexY = sy(maxH);
  const apexLabel: Rich = { pre: 'h', sub: 'max', rest: ` = ${calc(maxH)} ${distanceUnit}` };
  const apexW = richWidth(apexLabel, FS, true);
  let apexPos = { x: 0, y: 0 };
  if (hasApex) {
    addSeg(apexX, apexY, apexX, groundY, 3);
    apexPos = place(apexW, [
      [apexX, apexY - 13], [apexX + apexW / 2 + 8, apexY - 13], [apexX - apexW / 2 - 8, apexY - 13],
      [apexX + apexW / 2 + 8, (apexY + groundY) / 2],
    ]);
  }

  // Angle arc + value (the stated angle; the drawn one follows the axis scales).
  const screenAng = Math.atan2(Math.abs(uy), ux);
  const showAngle = Math.abs(vy) > 1e-9 && vx > 1e-9 && Math.abs(angle) > 0.05;
  const arcR = Math.min(26, arrowLen * 0.4);
  const angText = `${num(Math.abs(angle) > 90 ? 180 - Math.abs(angle) : Math.abs(angle))}°`;
  const angW = angText.length * FS * 0.6;
  let angPos = { x: 0, y: 0 };
  if (showAngle) {
    const bis = screenAng / 2;
    // Inside the wedge, far enough out that it is tall enough for the text;
    // a wedge too narrow for that puts the value just outside the triangle.
    const d = Math.max(arcR + 12, 10 / Math.max(Math.sin(bis), 0.05));
    const inX = lx + d * Math.cos(bis);
    const fitsInside = d <= arrowLen * 0.85 && (!hasComponents || inX + angW / 2 + 5 <= legX);
    angPos = fitsInside
      ? { x: inX, y: ly - up * d * Math.sin(bis) }
      : { x: tipX + 9 + angW / 2, y: ly - up * 12 };
    obstacles.push({ l: angPos.x - angW / 2 - 1, r: angPos.x + angW / 2 + 1, t: angPos.y - 8, b: angPos.y + 8 });
  }

  const vxLabel: Rich = { pre: 'v', sub: 'x', rest: ` = ${calc(vx)} ${speedUnit}` };
  const vyLabel: Rich = { pre: 'v', sub: 'y', rest: ` = ${calc(vy)} ${speedUnit}` };
  const v0Label: Rich = { pre: 'v', sub: '0', rest: ` = ${num(v0)} ${speedUnit}` };
  const vxW = richWidth(vxLabel, FS); const vyW = richWidth(vyLabel, FS); const v0W = richWidth(v0Label, FS + 1, true);
  let vxPos = { x: 0, y: 0 }; let vyPos = { x: 0, y: 0 };
  const legH = Math.abs(tipY - ly); const legW = legX - lx;
  if (hasComponents) {
    const side = legX + 9 + vxW / 2;
    vxPos = place(vxW, up > 0
      ? [[lx + Math.max(legW / 2, vxW / 2 + 2), ly + 13], [side, ly - 12], [side + angW + 8, ly - 12], [side, ly + 13]]
      : [[lx + Math.max(legW / 2, vxW / 2 + 2), ly - 12], [side, ly - 12], [side + angW + 8, ly + 12], [side, ly + 2]]);
    const sideY = legX + 9 + vyW / 2;
    // Low on the leg (one line above the vx label) so v0 has room under the tip.
    const mid = Math.max(legH * 0.42, Math.min(28, legH));
    vyPos = place(vyW, [0, 6, -6, 12, 18, -12, 24].map((dy): [number, number] => [sideY, ly - up * (mid + dy)]));
  }
  // v0: beside the tip on the side the curve leaves free, else above the shaft.
  const aboveShaft: [number, number] = [
    (lx + tipX) / 2, (ly + tipY) / 2 - up * (10 + (v0W / 2) * Math.abs(uy)),
  ];
  const beside = tipX + 10 + v0W / 2;
  // Above the launch corner, high enough to clear the curve's tangent at the label's far end.
  const highAbove: [number, number] = [
    lx + 6 + v0W / 2,
    Math.min(tipY - 13, ly - (v0W + 8) * Math.min(Math.tan(screenAng), 3) - 10),
  ];
  const v0Cands: Array<[number, number]> = Math.abs(vy) <= 1e-9
    ? [[lx + Math.max(arrowLen / 2, v0W / 2 + 2), ly - 12], [lx + Math.max(arrowLen / 2, v0W / 2 + 2), ly + 13]]
    : up > 0
      ? [...[0, 8, 14, 20, 26, -8].map((dy): [number, number] => [beside, tipY + dy]), highAbove,
        [tipX - 9 - v0W / 2, tipY - 2], aboveShaft, [beside, tipY + 34], [tipX - 9 - v0W / 2, tipY - 18]]
      : [...[2, 10, 16, 24, -8].map((dy): [number, number] => [beside, tipY + dy]), [tipX, tipY + 16], aboveShaft];
  const v0Pos = place(v0W, v0Cands);

  const rangeText = `Range = ${calc(range)} ${distanceUnit}`;
  const rangeW = rangeText.length * FS * 0.6;
  const rangeCx = Math.min(VIEWBOX_W - 4 - rangeW / 2, Math.max(4 + rangeW / 2, (sx(0) + sx(range)) / 2));
  const dimY = groundY + 30;
  const arcEndX = lx + arcR * Math.cos(screenAng); const arcEndY = ly - up * arcR * Math.sin(screenAng);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="pm-arrow" />

        {/* Cliff / platform the projectile leaves from */}
        {hasCliff && (
          <g>
            <rect x={axisX} y={ly} width={cliffW} height={cliffH} fill="#e2e8f0" stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
            {h0Inside && (
              <path d={`M ${x0 - 13} ${groundY - 1.5} L ${x0 - 13} ${ly + 1.5}`} stroke={DIAGRAM_COLORS.success} strokeWidth={1.25} fill="none"
                markerStart="url(#pm-arrow-success)" markerEnd="url(#pm-arrow-success)" />
            )}
            <text x={h0Pos.x} y={h0Pos.y + FS * 0.35} fontSize={FS} fill="#15803d" textAnchor="middle" fontWeight={700}>
              <tspan fontStyle="italic">h</tspan><tspan dy={FS * 0.28} fontSize={FS * 0.72}>0</tspan><tspan dy={-FS * 0.28}>{h0Label.rest}</tspan>
            </text>
          </g>
        )}

        {/* Ground = x-axis, with ticks */}
        <g {...feat('ground', { cx: (axisX + x0 + usedW) / 2, cy: groundY, w: usedW + cliffW, h: 4 })}>
          <line x1={axisX} y1={groundY} x2={x0 + usedW + 10} y2={groundY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
        </g>
        {xTicks.map((v) => (
          <g key={`xt-${v}`}>
            <line x1={sx(v)} y1={groundY} x2={sx(v)} y2={groundY + 4} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
            <text x={sx(v)} y={groundY + 16} fontSize={FS} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{num(v)}</text>
          </g>
        ))}
        <text x={x0 + usedW + 15} y={groundY + 4} fontSize={FS} fill={DIAGRAM_COLORS.muted} fontStyle="italic">x ({distanceUnit})</text>

        {/* Y-axis with ticks */}
        <g {...feat('y-axis', { cx: axisX, cy: (top + groundY) / 2, w: 4, h: usedH })}>
          <line x1={axisX} y1={top - 6} x2={axisX} y2={groundY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
        </g>
        {yTicks.map((v) => (
          <g key={`yt-${v}`}>
            <line x1={axisX - 4} y1={sy(v)} x2={axisX} y2={sy(v)} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
            <text x={axisX - 7} y={sy(v) + 4} fontSize={FS} fill={DIAGRAM_COLORS.muted} textAnchor="end">{num(v)}</text>
          </g>
        ))}
        <text x={axisX} y={top - 13} fontSize={FS} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">y ({distanceUnit})</text>
        {distorted && (
          <text x={VIEWBOX_W - 8} y={14} fontSize={FS} fill={DIAGRAM_COLORS.muted} textAnchor="end" fontStyle="italic">the two axes use different scales</text>
        )}

        {/* Max height marker: only when the projectile actually rises. */}
        {hasApex && (
          <g>
            <line x1={apexX} y1={apexY} x2={apexX} y2={groundY} stroke={DIAGRAM_COLORS.success} strokeWidth={1} strokeDasharray="3 3" />
            <RichText r={apexLabel} x={apexPos.x} y={apexPos.y + FS * 0.35} fs={FS} fill="#15803d" bold />
          </g>
        )}

        {/* Trajectory + key points */}
        <g {...feat('trajectory', { cx: x0 + usedW / 2, cy: (top + groundY) / 2, w: usedW, h: usedH })}>
          <path d={path} stroke={DIAGRAM_COLORS.primary} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
        </g>
        {samples.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={3} fill={DIAGRAM_COLORS.primary} stroke="white" strokeWidth={1} />
        ))}
        <g {...feat('launch', { cx: lx, cy: ly, w: 28, h: 28 })}>
          <circle cx={lx} cy={ly} r={3.5} fill={DIAGRAM_COLORS.text} />
        </g>
        {hasApex && (
          <g {...feat('peak', { cx: apexX, cy: apexY, w: 28, h: 28 })}>
            <circle cx={apexX} cy={apexY} r={3.5} fill={DIAGRAM_COLORS.success} stroke="white" strokeWidth={1} />
          </g>
        )}
        <g {...feat('landing', { cx: sx(range), cy: groundY, w: 28, h: 28 })}>
          {range > 0 && <circle cx={sx(range)} cy={groundY} r={3.5} fill={DIAGRAM_COLORS.primary} stroke="white" strokeWidth={1} />}
        </g>

        {/* Launch velocity, components and angle */}
        {hasComponents && (
          <g>
            <line x1={lx} y1={ly} x2={legX} y2={ly} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} strokeDasharray="4 3"
              markerEnd={legW >= 14 ? 'url(#pm-arrow-secondary)' : undefined} />
            <line x1={legX} y1={ly} x2={tipX} y2={tipY} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} strokeDasharray="4 3"
              markerEnd={legH >= 14 ? 'url(#pm-arrow-secondary)' : undefined} />
            <RichText r={vxLabel} x={vxPos.x} y={vxPos.y + FS * 0.35} fs={FS} fill={DIAGRAM_COLORS.secondary} />
            <RichText r={vyLabel} x={vyPos.x} y={vyPos.y + FS * 0.35} fs={FS} fill={DIAGRAM_COLORS.secondary} />
          </g>
        )}
        {showAngle && (
          <g>
            <path d={`M ${lx + arcR} ${ly} A ${arcR} ${arcR} 0 0 ${up > 0 ? 0 : 1} ${arcEndX} ${arcEndY}`}
              stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} fill="none" />
            <text x={angPos.x} y={angPos.y + FS * 0.35} fontSize={FS} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}
              stroke="white" strokeWidth={3} paintOrder="stroke">{angText}</text>
          </g>
        )}
        {/* A path, not a line: the shaft is diagonal. */}
        <path d={`M ${lx} ${ly} L ${tipX} ${tipY}`} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} fill="none" markerEnd="url(#pm-arrow-secondary)" />
        <RichText r={v0Label} x={v0Pos.x} y={v0Pos.y + (FS + 1) * 0.35} fs={FS + 1} fill={DIAGRAM_COLORS.secondary} bold />

        {/* Range dimension under the axis */}
        {range > 0 && (
          <g>
            <line x1={sx(0)} y1={dimY - 6} x2={sx(0)} y2={dimY + 6} stroke={DIAGRAM_COLORS.warning} strokeWidth={1} />
            <line x1={sx(range)} y1={dimY - 6} x2={sx(range)} y2={dimY + 6} stroke={DIAGRAM_COLORS.warning} strokeWidth={1} />
            <line x1={sx(0) + 1} y1={dimY} x2={sx(range) - 1} y2={dimY}
              stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25}
              markerEnd="url(#pm-arrow-warning)" markerStart="url(#pm-arrow-warning)" />
            <text x={rangeCx} y={dimY + 18} fontSize={FS} fill="#b45309" textAnchor="middle" fontWeight={700}>{rangeText}</text>
          </g>
        )}
      </svg>
      <DiagramNotes notes={notes} />
    </div>
  );
}
