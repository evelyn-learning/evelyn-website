'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  productionPossibilitiesFeatureNames,
  type PPCFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_ON = '#15803d';      // green
const COLOR_INSIDE = '#dc2626';  // red
const COLOR_OUTSIDE = '#c2410c'; // orange
const COLOR_CURVE = '#1f2937';
const COLOR_SHIFT = '#2563eb';
const COLOR_AXIS = '#1f2937';

function colorFor(position: 'inside' | 'on' | 'outside' | undefined): string {
  switch (position) {
    case 'inside': return COLOR_INSIDE;
    case 'outside': return COLOR_OUTSIDE;
    case 'on':
    default: return COLOR_ON;
  }
}

/** A round tick step giving four to eight ticks, and the axis end on a tick at or above `max`. */
function niceAxis(max: number): { step: number; end: number } {
  const raw = max / 5;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => max / s <= 7.5) ?? 10 * pow;
  return { step, end: Math.ceil(max / step - 1e-9) * step };
}
const fmt = (v: number) => (Math.abs(v) >= 10000 ? v.toLocaleString('en-US') : String(Number(v.toFixed(6))));

interface Box { x1: number; y1: number; x2: number; y2: number }
const hit = (a: Box, b: Box, pad = 0) => a.x1 < b.x2 + pad && a.x2 > b.x1 - pad && a.y1 < b.y2 + pad && a.y2 > b.y1 - pad;

function wrap(s: string, maxChars: number): string[] {
  if (s.length <= maxChars) return [s];
  const lines: string[] = []; let cur = '';
  for (const w of s.split(/\s+/)) { if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w; }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

export function ProductionPossibilitiesRenderer({ figure }: { figure: PPCFigure }) {
  const { xAxis, yAxis, curve, points, shift, title } = figure;
  const N = productionPossibilitiesFeatureNames;
  const W = 580;
  const H = 420;
  const PAD_L = 78;
  const PAD_R = 44;
  const PAD_T = 26;
  const PAD_B = 64;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const shiftX = shift ? (shift.direction === 'out' ? xAxis.max * shift.factor : xAxis.max / shift.factor) : null;
  const shiftY = shift ? (shift.direction === 'out' ? yAxis.max * shift.factor : yAxis.max / shift.factor) : null;

  // The view holds both curves and every point, and ends on a round tick.
  const xAx = niceAxis(Math.max(xAxis.max, shiftX ?? 0, ...points.map((p) => p.x * 1.04)));
  const yAx = niceAxis(Math.max(yAxis.max, shiftY ?? 0, ...points.map((p) => p.y * 1.04)));
  const xToPx = (v: number) => PAD_L + (v / xAx.end) * plotW;
  const yToPx = (v: number) => PAD_T + plotH - (v / yAx.end) * plotH;

  /** The curve as pixel points: by angle, so it stays smooth where it drops to the x-axis. */
  function curvePts(xMax: number, yMax: number): { x: number; y: number }[] {
    if (curve === 'linear') return Array.from({ length: 41 }, (_, i) => ({ x: xToPx((xMax * i) / 40), y: yToPx(yMax * (1 - i / 40)) }));
    return Array.from({ length: 73 }, (_, i) => { const a = (Math.PI / 2) * (1 - i / 72); return { x: xToPx(xMax * Math.cos(a)), y: yToPx(yMax * Math.sin(a)) }; });
  }
  const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const mainPts = curvePts(xAxis.max, yAxis.max);
  const shiftPts = shift ? curvePts(shiftX!, shiftY!) : null;
  const allCurvePts = [...mainPts, ...(shiftPts ?? [])];

  const xTicks: number[] = [];
  for (let v = 0; v <= xAx.end + 1e-9; v += xAx.step) xTicks.push(Number(v.toFixed(6)));
  const yTicks: number[] = [];
  for (let v = 0; v <= yAx.end + 1e-9; v += yAx.step) yTicks.push(Number(v.toFixed(6)));

  // Labels: each takes the first spot that meets no other label, no dot and neither curve.
  const dots = points.map((p) => ({ x: xToPx(p.x), y: yToPx(p.y) }));
  const placed: Box[] = [];
  const bounds: Box = { x1: PAD_L + 3, y1: 2, x2: W - 2, y2: PAD_T + plotH - 3 };
  // (The top of the y-axis can coincide with the curve's intercept: labels may use the margin above.)
  function place(text: string, fs: number, cands: { x: number; y: number; anchor: 'start' | 'middle' | 'end' }[], ownDot = -1) {
    const w = text.length * fs * 0.6;
    let best = cands[0]; let bestBox: Box = { x1: 0, y1: 0, x2: 0, y2: 0 }; let bestCost = Infinity;
    cands.forEach((c, i) => {
      const x1 = c.anchor === 'start' ? c.x : c.anchor === 'end' ? c.x - w : c.x - w / 2;
      const box: Box = { x1: x1 - 2, y1: c.y - fs + 1, x2: x1 + w + 2, y2: c.y + 4 };
      let cost = i * 0.5;
      if (box.x1 < bounds.x1 || box.x2 > bounds.x2 || box.y1 < bounds.y1 || box.y2 > bounds.y2) cost += 400;
      for (const b of placed) if (hit(box, b, 3)) cost += 300;
      dots.forEach((d, di) => { if (di !== ownDot && hit(box, { x1: d.x - 8, y1: d.y - 8, x2: d.x + 8, y2: d.y + 8 })) cost += 120; });
      if (allCurvePts.some((p) => p.x > box.x1 - 2 && p.x < box.x2 + 2 && p.y > box.y1 - 2 && p.y < box.y2 + 2)) cost += 60;
      if (cost < bestCost) { bestCost = cost; best = c; bestBox = box; }
    });
    placed.push(bestBox);
    return best;
  }

  const pointLabels = points.map((p, i) => {
    if (!p.label) return null;
    const { x, y } = dots[i];
    return place(p.label, 13, [
      { x: x + 10, y: y - 8, anchor: 'start' }, { x: x - 10, y: y - 8, anchor: 'end' },
      { x: x + 10, y: y + 16, anchor: 'start' }, { x: x - 10, y: y + 16, anchor: 'end' },
      { x: x + 11, y: y + 4, anchor: 'start' }, { x: x - 11, y: y + 4, anchor: 'end' },
      { x, y: y - 13, anchor: 'middle' }, { x, y: y + 23, anchor: 'middle' },
      { x: x + 12, y: y - 22, anchor: 'start' }, { x: x - 12, y: y - 22, anchor: 'end' },
      { x: x + 12, y: y + 30, anchor: 'start' }, { x: x - 12, y: y + 30, anchor: 'end' },
      { x, y: y - 28, anchor: 'middle' }, { x, y: y + 38, anchor: 'middle' },
    ], i);
  });

  /** Spots just off a curve, at several places along it; `out` puts the label on the far side from the origin. */
  function alongCurve(pts: { x: number; y: number }[], out: boolean) {
    const fr = [0.5, 0.36, 0.64, 0.25, 0.75, 0.15, 0.85];
    return fr.map((f) => {
      const p = pts[Math.round(f * (pts.length - 1))];
      return out ? { x: p.x + 9, y: p.y - 7, anchor: 'start' as const } : { x: p.x - 9, y: p.y + 16, anchor: 'end' as const };
    });
  }
  // The outer curve is named on its outer side, the inner curve on its inner side, so neither name sits between them.
  const mainOuter = !shift || shift.direction === 'in';
  const ppcLabel = place('PPC', 12.5, [...alongCurve(mainPts, mainOuter), ...alongCurve(mainPts, !mainOuter)]);
  const shiftText = shift ? (shift.label ?? (shift.direction === 'out' ? 'PPC′ (growth)' : 'PPC′ (contraction)')) : '';
  const shiftLabel = shift && shiftPts ? place(shiftText, 12, [...alongCurve(shiftPts, !mainOuter), ...alongCurve(shiftPts, mainOuter)]) : null;

  const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' as const };
  const yLines = wrap(yAxis.label, Math.floor((plotH + 20) / 7.2));
  const xLines = wrap(xAxis.label, Math.floor((plotW + 60) / 7.2));
  const yTickW = Math.max(...yTicks.map((t) => fmt(t).length)) * 6.2;
  const yTitleX = Math.max(12, PAD_L - 14 - yTickW - (yLines.length - 1) * 16 - 8);

  const legend = ([
    ['on', COLOR_ON, 'on the curve (efficient)'],
    ['inside', COLOR_INSIDE, 'inside (inefficient)'],
    ['outside', COLOR_OUTSIDE, 'outside (unattainable)'],
  ] as const).filter(([k]) => points.some((p) => (p.position ?? 'on') === k));

  return (
    <div
      className="ppc-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'PPC'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {xTicks.map((t) => <line key={`xg-${t}`} x1={xToPx(t)} y1={PAD_T} x2={xToPx(t)} y2={PAD_T + plotH} stroke="#f1f3f5" strokeWidth={1} />)}
        {yTicks.map((t) => <line key={`yg-${t}`} x1={PAD_L} y1={yToPx(t)} x2={PAD_L + plotW} y2={yToPx(t)} stroke="#f1f3f5" strokeWidth={1} />)}

        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {yTicks.map((t) => (
          <g key={`yt-${t}`}>
            <line x1={PAD_L - 4} y1={yToPx(t)} x2={PAD_L} y2={yToPx(t)} stroke={COLOR_AXIS} />
            <text x={PAD_L - 8} y={yToPx(t) + 4} fontSize={11} textAnchor="end" fill="#6b7280">{fmt(t)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={`xt-${t}`}>
            <line x1={xToPx(t)} y1={PAD_T + plotH} x2={xToPx(t)} y2={PAD_T + plotH + 4} stroke={COLOR_AXIS} />
            <text x={xToPx(t)} y={PAD_T + plotH + 18} fontSize={11} textAnchor="middle" fill="#6b7280">{fmt(t)}</text>
          </g>
        ))}

        {xLines.map((ln, i) => (
          <text key={`xl-${i}`} x={PAD_L + plotW / 2} y={PAD_T + plotH + 40 + i * 16} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">{ln}</text>
        ))}
        {yLines.map((ln, i) => (
          <text key={`yl-${i}`} x={yTitleX + i * 16} y={PAD_T + plotH / 2} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 ${yTitleX + i * 16} ${PAD_T + plotH / 2})`}>{ln}</text>
        ))}

        {/* Shifted PPC (behind the main one) */}
        {shiftPts && shiftLabel && (
          <g
            data-feature={N.shiftedCurve}
            data-feature-label={shift?.direction === 'out' ? 'PPC growth' : 'PPC contraction'}
            data-feature-cx={shiftPts[Math.round(shiftPts.length / 2)].x / W}
            data-feature-cy={shiftPts[Math.round(shiftPts.length / 2)].y / H}
            data-feature-w={80 / W}
            data-feature-h={28 / H}
          >
            <path d={toPath(shiftPts)} stroke={COLOR_SHIFT} strokeWidth={2.25} fill="none" strokeDasharray="7 5" strokeLinecap="round" />
            <text x={shiftLabel.x} y={shiftLabel.y} fontSize={12} fill={COLOR_SHIFT} fontWeight={700} textAnchor={shiftLabel.anchor} style={halo}>{shiftText}</text>
          </g>
        )}

        {/* Main PPC */}
        <g
          data-feature={N.curve}
          data-feature-label="PPC"
          data-feature-cx={mainPts[Math.round(mainPts.length / 2)].x / W}
          data-feature-cy={mainPts[Math.round(mainPts.length / 2)].y / H}
          data-feature-w={120 / W}
          data-feature-h={80 / H}
        >
          <path d={toPath(mainPts)} stroke={COLOR_CURVE} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <text x={ppcLabel.x} y={ppcLabel.y} fontSize={12.5} fill={COLOR_CURVE} fontWeight={700} textAnchor={ppcLabel.anchor} style={halo}>PPC</text>
        </g>

        {/* Points: coloured by zone, so a dot always agrees with the legend. */}
        {points.map((p, i) => {
          const { x: cx, y: cy } = dots[i];
          const fill = colorFor(p.position);
          const lb = pointLabels[i];
          return (
            <g
              key={`pt-${i}`}
              data-feature={N.point(p.label, i)}
              data-feature-label={p.label ? `point ${p.label}` : `point ${i + 1}`}
              data-feature-cx={cx / W}
              data-feature-cy={cy / H}
              data-feature-w={40 / W}
              data-feature-h={32 / H}
            >
              <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#fff" strokeWidth={2} />
              {p.label && lb && <text x={lb.x} y={lb.y} fontSize={13} fontWeight={700} fill={fill} textAnchor={lb.anchor} style={halo}>{p.label}</text>}
            </g>
          );
        })}
      </svg>
      {legend.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-700 -mt-1">
          {legend.map(([k, c, text]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="inline-block rounded-full" style={{ width: 10, height: 10, background: c }} />{text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
