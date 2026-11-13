'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  parametricCurveFeatureNames,
  type ParametricCurveFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';
import { niceTicks, formatTick, textWidth } from './_niceTicks';

const COLOR_AXIS = '#1f2937';
const COLOR_CURVE = '#7c3aed';
const COLOR_HL = '#16a34a';
const COLOR_TAN = '#dc2626';

export function ParametricCurveRenderer({ figure }: { figure: ParametricCurveFigure }) {
  const { curve, xMin: xMinIn, xMax: xMaxIn, yMin: yMinIn, yMax: yMaxIn, highlightT, tangentAtT, exprLabel, title } = figure;
  const N = parametricCurveFeatureNames;

  const W = 520;
  const H = 440;
  const PAD_L = 56;
  const PAD_R = 28;
  const PAD_T = 36;
  const PAD_B = 50;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // One unit of x and one unit of y take the same length on the board whenever the two spans are
  // of like size — otherwise a circle is drawn as an ellipse and every slope on the curve reads
  // wrong. Only when one span dwarfs the other (more than 3 to 1) do the axes scale separately.
  let xMin = xMinIn, xMax = xMaxIn, yMin = yMinIn, yMax = yMaxIn;
  {
    const ux = (xMax - xMin) / plotW;
    const uy = (yMax - yMin) / plotH;
    const ratio = ux / uy;
    if (ratio > 1 / 3 && ratio < 3 && Math.abs(ratio - 1) > 1e-6) {
      const u = Math.max(ux, uy);
      const cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2;
      xMin = cx - (u * plotW) / 2; xMax = cx + (u * plotW) / 2;
      yMin = cy - (u * plotH) / 2; yMax = cy + (u * plotH) / 2;
    }
  }

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const { ticks: xTicks, step: xStep } = niceTicks(xMin, xMax, 6);
  const { ticks: yTicks, step: yStep } = niceTicks(yMin, yMax, 6);

  const path = smoothPath(curve, xAt, yAt);

  // Direction-of-travel arrowheads, a third and two thirds of the way along the samples, each a
  // small triangle lying on the curve and turned the way the curve is going on the board.
  const arrows: { x: number; y: number; deg: number }[] = [];
  for (const frac of [1 / 3, 2 / 3]) {
    const i = Math.round((curve.length - 1) * frac);
    const a = curve[Math.max(0, i - 1)];
    const b = curve[Math.min(curve.length - 1, i + 1)];
    const c = curve[i];
    if (!a || !b || !c) continue;
    const vx = xAt(b.x) - xAt(a.x);
    const vy = yAt(b.y) - yAt(a.y);
    if (Math.hypot(vx, vy) < 0.5) continue;
    if (highlightT && Math.hypot(xAt(c.x) - xAt(highlightT.x), yAt(c.y) - yAt(highlightT.y)) < 18) continue;
    arrows.push({ x: xAt(c.x), y: yAt(c.y), deg: (Math.atan2(vy, vx) * 180) / Math.PI });
  }

  // Tangent vector (clamp length).
  let tanLine: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (tangentAtT) {
    const xScale = plotW / (xMax - xMin);
    const yScale = plotH / (yMax - yMin);
    const vxScr = tangentAtT.dx * xScale;
    const vyScr = -tangentAtT.dy * yScale;
    const lenPx = tangentAtT.length ?? 70;
    const mag = Math.hypot(vxScr, vyScr) || 1;
    const ux = (vxScr / mag) * lenPx;
    const uy = (vyScr / mag) * lenPx;
    tanLine = {
      x1: xAt(tangentAtT.x),
      y1: yAt(tangentAtT.y),
      x2: xAt(tangentAtT.x) + ux,
      y2: yAt(tangentAtT.y) + uy,
    };
  }

  return (
    <div
      className="parametric-curve-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'parametric curve'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        <defs>
          <marker id="arrowhead-param" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={COLOR_CURVE} />
          </marker>
          <marker id="arrowhead-tan" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={COLOR_TAN} />
          </marker>
        </defs>

        {/* gridlines */}
        {xTicks.map((tx, i) => (
          <line key={`gx-${i}`} x1={xAt(tx)} y1={PAD_T} x2={xAt(tx)} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        ))}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* axes */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD_L} y1={yAt(0)} x2={PAD_L + plotW} y2={yAt(0)} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={xAt(0)} y1={PAD_T} x2={xAt(0)} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} fill="none" stroke="#9ca3af" strokeWidth={1} />

        {/* curve */}
        <path
          d={path} fill="none" stroke={COLOR_CURVE} strokeWidth={2.5}
          data-feature={N.curve}
          data-feature-label={exprLabel || 'curve'}
          data-feature-cx={(PAD_L + plotW / 2) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        />

        {/* direction arrow */}
        {arrows.map((a, i) => (
          <path key={`dir-${i}`} d="M6,0 L-5,-5 L-5,5 Z" fill={COLOR_CURVE} transform={`translate(${a.x} ${a.y}) rotate(${a.deg})`} />
        ))}

        {/* tangent vector */}
        {tanLine && (
          <g
            data-feature={N.tangent}
            data-feature-label="tangent vector"
            data-feature-cx={((tanLine.x1 + tanLine.x2) / 2) / W}
            data-feature-cy={((tanLine.y1 + tanLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={tanLine.x1} y1={tanLine.y1} x2={tanLine.x2} y2={tanLine.y2}
              stroke={COLOR_TAN} strokeWidth={2} markerEnd="url(#arrowhead-tan)" />
            {(() => {
              // The word sits past the arrow's tip, on the side the arrow points to, inside the frame.
              const right = tanLine.x2 >= tanLine.x1;
              const tw = textWidth('tangent', 11);
              let tx = right ? tanLine.x2 + 6 : tanLine.x2 - 6 - tw;
              tx = Math.min(Math.max(tx, PAD_L + 3), PAD_L + plotW - tw - 3);
              const ty = Math.min(Math.max(tanLine.y2 + (tanLine.y2 <= tanLine.y1 ? -6 : 14), PAD_T + 12), PAD_T + plotH - 6);
              return <text x={tx} y={ty} fontSize={11} fontWeight={600} fill={COLOR_TAN} stroke="#fff" strokeWidth={3} paintOrder="stroke">tangent</text>;
            })()}
          </g>
        )}

        {/* highlight point */}
        {highlightT && (() => {
          const hpx = xAt(highlightT.x);
          const hpy = yAt(highlightT.y);
          const hlText = highlightT.label ?? (highlightT.t !== undefined ? `t = ${Number(highlightT.t.toFixed(3))}` : '');
          // Width-aware anchor flip + edge clamp (ProjectileMotionRenderer
          // :197-208 idiom): a start-anchored label on a point at xMax runs
          // past the viewBox — flip it to the left side of the point, then
          // clamp the extent into [3, W-3].
          const hlW = textWidth(hlText, 11);
          // Four places round the point; the first that stays in the frame and off the tangent
          // arrow wins (the arrow leaves the same point, so "above right" is often taken).
          const spots = [
            { x: hpx + 9, y: hpy - 9 }, { x: hpx - 9 - hlW, y: hpy - 9 },
            { x: hpx + 9, y: hpy + 18 }, { x: hpx - 9 - hlW, y: hpy + 18 },
          ];
          const fits = (sp: { x: number; y: number }) => sp.x >= PAD_L + 2 && sp.x + hlW <= PAD_L + plotW - 2 && sp.y - 10 >= PAD_T && sp.y <= PAD_T + plotH - 2;
          const hitsTangent = (sp: { x: number; y: number }) => {
            if (!tanLine) return false;
            for (let k = 0; k <= 10; k += 1) {
              const px = tanLine.x1 + ((tanLine.x2 - tanLine.x1) * k) / 10;
              const py = tanLine.y1 + ((tanLine.y2 - tanLine.y1) * k) / 10;
              if (px >= sp.x - 3 && px <= sp.x + hlW + 3 && py >= sp.y - 13 && py <= sp.y + 4) return true;
            }
            return false;
          };
          const spot = spots.find((sp) => fits(sp) && !hitsTangent(sp)) ?? spots.find(fits) ?? spots[0];
          const hlFlip = false;
          const hlX = Math.min(Math.max(spot.x, 3), Math.max(3, W - 3 - hlW));
          const hlY = spot.y;
          return (
            <g
              data-feature={N.highlightT}
              data-feature-label={highlightT.label || (highlightT.t !== undefined ? `t = ${highlightT.t}` : 'highlight point')}
              data-feature-cx={hpx / W}
              data-feature-cy={hpy / H}
              data-feature-w={36 / W}
              data-feature-h={32 / H}
            >
              <circle cx={hpx} cy={hpy} r={5} fill={COLOR_HL} stroke="#fff" strokeWidth={2} />
              <text x={hlX} y={hlY} fontSize={11} fill="#15803d" fontWeight={600} textAnchor={hlFlip ? 'end' : 'start'} stroke="#fff" strokeWidth={3} paintOrder="stroke">
                {hlText}
              </text>
            </g>
          );
        })()}

        {/* tick labels */}
        {xTicks.map((tx, i) => (
          <text key={`tlx-${i}`} x={xAt(tx)} y={PAD_T + plotH + 16} fontSize={11} textAnchor="middle" fill="#374151">
            {formatTick(tx, xStep)}
          </text>
        ))}
        {yTicks.map((ty, i) => (
          <text key={`tly-${i}`} x={PAD_L - 6} y={yAt(ty) + 4} fontSize={11} textAnchor="end" fill="#374151">
            {formatTick(ty, yStep)}
          </text>
        ))}

        {/* labels */}
        {exprLabel && (
          <text
            x={PAD_L + 2} y={PAD_T - 12}
            fontSize={13} fontWeight={600} fill={COLOR_CURVE}
            data-feature={N.exprLabel}
            data-feature-label={exprLabel}
            data-feature-cx={(PAD_L + 60) / W}
            data-feature-cy={(PAD_T - 16) / H}
            data-feature-w={160 / W}
            data-feature-h={18 / H}
          >
            {exprLabel}
          </text>
        )}
        <text x={PAD_L + plotW / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">x</text>
        <text x={16} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}>y</text>
      </svg>
    </div>
  );
}
