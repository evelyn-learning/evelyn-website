'use client';

import React from 'react';
import {
  phaseDiagramFeatureNames,
  type PhaseDiagramFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/phase-diagram';

const AX = '#475569';
const SOLID_C = '#3b82f6';
const LIQUID_C = '#10b981';
const GAS_C = '#f59e0b';

export function CatalogPhaseDiagramRenderer({ figure }: { figure: PhaseDiagramFigure }) {
  const N = phaseDiagramFeatureNames;
  const W = 540;
  const H = 420;
  const x0 = 70, xR = W - 34, yTop = 54, yBot = H - 62;
  const mx = (t: number) => x0 + t * (xR - x0);
  const my = (p: number) => yBot - p * (yBot - yTop);

  // Width-aware side flip + edge clamp for point-attached labels (2026-08-07
  // clip audit): the start-anchored critical label near the right edge (even
  // the "critical point" fallback clips at t≥0.9) and the end-anchored triple
  // label near the left edge escaped the viewBox. Same char-width estimate as
  // ProjectileMotionRenderer; flip to the roomy side, then clamp.
  const estW = (s: string, fontSize: number) => s.length * fontSize * 0.55;
  const placeLabel = (
    x: number, text: string, fontSize: number, prefer: 'start' | 'end', pad: number,
  ): { x: number; anchor: 'start' | 'end' } => {
    const w = estW(text, fontSize);
    const anchor: 'start' | 'end' = prefer === 'start'
      ? (x + pad + w > W - 3 ? 'end' : 'start')
      : (x - pad - w < 3 ? 'start' : 'end');
    const lx = anchor === 'start'
      ? Math.max(3, Math.min(x + pad, W - 3 - w))
      : Math.min(W - 3, Math.max(x - pad, 3 + w));
    return { x: lx, anchor };
  };

  const T: [number, number] = [mx(figure.triple.t), my(figure.triple.p)];
  const C: [number, number] = [mx(figure.critical.t), my(figure.critical.p)];
  const tripleText = figure.triple.label || 'triple point';
  const tripleL = placeLabel(T[0], tripleText, 11.5, 'end', 8);
  const criticalText = figure.critical.label || 'critical point';
  const criticalL = placeLabel(C[0], criticalText, 11.5, 'start', 8);
  const O: [number, number] = [x0, yBot];
  const fTopT = figure.triple.t + (figure.fusionSlope === 'positive' ? 0.06 : -0.06);
  const F: [number, number] = [mx(fTopT), yTop];

  // boundary control points (curve bows down-right → concave-up)
  const sc: [number, number] = [(O[0] + T[0]) / 2 + 8, (O[1] + T[1]) / 2 + 20];
  const vc: [number, number] = [(T[0] + C[0]) / 2 + 12, (T[1] + C[1]) / 2 + 14];
  const sub = `Q ${sc[0]} ${sc[1]} ${T[0]} ${T[1]}`;
  const vap = `Q ${vc[0]} ${vc[1]} ${C[0]} ${C[1]}`;

  return (
    <div className="phase-diagram-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.diagram}
        data-feature-label={figure.title || 'phase diagram'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="pd-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={AX} />
          </marker>
        </defs>

        {/* region fills (paths reuse the boundary curves → no seam) */}
        <path data-feature={N.solid} d={`M ${x0} ${yTop} L ${F[0]} ${F[1]} L ${T[0]} ${T[1]} Q ${sc[0]} ${sc[1]} ${x0} ${yBot} Z`} fill={SOLID_C} fillOpacity={0.12} />
        <path data-feature={N.liquid} d={`M ${F[0]} ${F[1]} L ${T[0]} ${T[1]} ${vap} L ${C[0]} ${yTop} Z`} fill={LIQUID_C} fillOpacity={0.12} />
        <path data-feature={N.gas} d={`M ${x0} ${yBot} ${sub} ${vap} L ${xR} ${C[1]} L ${xR} ${yBot} Z`} fill={GAS_C} fillOpacity={0.12} />

        {/* phase boundaries */}
        <path d={`M ${O[0]} ${O[1]} ${sub}`} fill="none" stroke={AX} strokeWidth={2} />
        <line x1={T[0]} y1={T[1]} x2={F[0]} y2={F[1]} stroke={AX} strokeWidth={2} />
        <path d={`M ${T[0]} ${T[1]} ${vap}`} fill="none" stroke={AX} strokeWidth={2} />

        {/* region labels */}
        <text x={(x0 + T[0]) / 2 - 6} y={(yTop + T[1]) / 2 + 18} fontSize={14} fill={SOLID_C} fontWeight={700} textAnchor="middle">Solid</text>
        <text x={(T[0] + C[0]) / 2 + 6} y={yTop + 42} fontSize={14} fill={LIQUID_C} fontWeight={700} textAnchor="middle">Liquid</text>
        <text x={(T[0] + xR) / 2 + 14} y={(T[1] + yBot) / 2 + 28} fontSize={14} fill={'#b45309'} fontWeight={700} textAnchor="middle">Gas</text>

        {/* triple + critical points */}
        <g data-feature={N.triple} data-feature-label="triple point">
          <circle cx={T[0]} cy={T[1]} r={4} fill="#dc2626" />
          <text x={tripleL.x} y={T[1] + 16} fontSize={11.5} fill="#dc2626" fontWeight={600} textAnchor={tripleL.anchor}>{tripleText}</text>
        </g>
        <g data-feature={N.critical} data-feature-label="critical point">
          <circle cx={C[0]} cy={C[1]} r={4} fill="#7c3aed" />
          <text x={criticalL.x} y={C[1] - 6} fontSize={11.5} fill="#7c3aed" fontWeight={600} textAnchor={criticalL.anchor}>{criticalText}</text>
        </g>

        {/* optional state marker */}
        {figure.marker && (() => {
          const m: [number, number] = [mx(figure.marker.t), my(figure.marker.p)];
          const markerL = figure.marker.label ? placeLabel(m[0], figure.marker.label, 11.5, 'start', 7) : null;
          return (
            <g>
              <circle cx={m[0]} cy={m[1]} r={4.5} fill="none" stroke="#111827" strokeWidth={2} />
              {figure.marker.label && markerL && <text x={markerL.x} y={m[1] + 4} fontSize={11.5} fill="#111827" fontWeight={600} textAnchor={markerL.anchor}>{figure.marker.label}</text>}
            </g>
          );
        })()}

        {/* axes */}
        <line x1={x0} y1={yBot} x2={xR + 6} y2={yBot} stroke={AX} strokeWidth={1.5} markerEnd="url(#pd-arr)" />
        <line x1={x0} y1={yBot} x2={x0} y2={yTop - 6} stroke={AX} strokeWidth={1.5} markerEnd="url(#pd-arr)" />
        <text x={(x0 + xR) / 2} y={H - 22} fontSize={13} fill={AX} fontWeight={600} textAnchor="middle">{figure.tLabel} →</text>
        <text x={20} y={(yTop + yBot) / 2} fontSize={13} fill={AX} fontWeight={600} textAnchor="middle" transform={`rotate(-90 20 ${(yTop + yBot) / 2})`}>{figure.pLabel} →</text>
      </svg>
    </div>
  );
}
