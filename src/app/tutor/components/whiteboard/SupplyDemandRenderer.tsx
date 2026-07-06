'use client';

import React from 'react';
import {
  supplyDemandFeatureNames,
  type SupplyDemandFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_S = '#dc2626';
const COLOR_S_NEW = '#fca5a5';
const COLOR_D = '#2563eb';
const COLOR_D_NEW = '#93c5fd';
const COLOR_AXIS = '#1f2937';
const COLOR_EQ = '#16a34a';
const COLOR_EQ_NEW = '#a16207';
const COLOR_PC = '#9333ea';

export function SupplyDemandRenderer({ figure }: { figure: SupplyDemandFigure }) {
  const {
    good,
    initialQuantity: Q0,
    initialPrice: P0,
    shift,
    finalQuantity: Q1,
    finalPrice: P1,
    priceControl: pc,
    title,
  } = figure;
  const N = supplyDemandFeatureNames;

  const W = 560;
  const H = 410;
  const PAD_L = 62;
  const PAD_R = 66;
  const PAD_T = 30;
  const PAD_B = 64;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const AXIS_MAX = 100;
  const xAt = (v: number) => PAD_L + (Math.max(0, Math.min(AXIS_MAX, v)) / AXIS_MAX) * plotW;
  const yAt = (v: number) => PAD_T + plotH - (Math.max(0, Math.min(AXIS_MAX, v)) / AXIS_MAX) * plotH;

  const sInt = P0 - Q0; // S: P = sInt + Q
  const dInt = P0 + Q0; // D: P = dInt − Q

  function clipLine(slope: number, intercept: number) {
    const cand: { Q: number; P: number }[] = [
      { Q: 0, P: intercept },
      { Q: AXIS_MAX, P: intercept + slope * AXIS_MAX },
    ];
    if (slope !== 0) {
      cand.push({ Q: -intercept / slope, P: 0 });
      cand.push({ Q: (AXIS_MAX - intercept) / slope, P: AXIS_MAX });
    }
    const inside = cand.filter((c) => c.Q >= -0.001 && c.Q <= AXIS_MAX + 0.001 && c.P >= -0.001 && c.P <= AXIS_MAX + 0.001);
    if (inside.length < 2) {
      return { x1: xAt(0), y1: yAt(intercept), x2: xAt(AXIS_MAX), y2: yAt(intercept + slope * AXIS_MAX) };
    }
    inside.sort((a, b) => a.Q - b.Q);
    const a = inside[0], b = inside[inside.length - 1];
    return { x1: xAt(a.Q), y1: yAt(a.P), x2: xAt(b.Q), y2: yAt(b.P) };
  }

  const sLine = clipLine(1, sInt);
  const dLine = clipLine(-1, dInt);

  let sShift: ReturnType<typeof clipLine> | null = null;
  let dShift: ReturnType<typeof clipLine> | null = null;
  if (shift) {
    const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
    if (shift.curve === 'S') sShift = clipLine(1, sInt - delta);
    else dShift = clipLine(-1, dInt + delta);
  }

  const subtitle = shift
    ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`)
    : pc
      ? (pc.label ?? `price ${pc.type} at ${pc.level}`)
      : null;

  return (
    <div
      className="supply-demand-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || `Supply & demand (${good})`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      {subtitle && <div className="text-xs italic text-gray-600 -mt-1 mb-2">{subtitle}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* supply */}
        <g data-feature={N.supply} data-feature-label="S">
          <line x1={sLine.x1} y1={sLine.y1} x2={sLine.x2} y2={sLine.y2} stroke={COLOR_S} strokeWidth={2.5} />
          <text x={sLine.x2 + 5} y={sLine.y2 + 4} fontSize={13} fontWeight={700} fill={COLOR_S}>S</text>
        </g>
        {sShift && (
          <g data-feature={N.supplyShifted} data-feature-label="S'">
            <line x1={sShift.x1} y1={sShift.y1} x2={sShift.x2} y2={sShift.y2} stroke={COLOR_S_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={sShift.x2 + 5} y={sShift.y2 + 4} fontSize={13} fontWeight={700} fill={COLOR_S_NEW}>S&apos;</text>
          </g>
        )}

        {/* demand */}
        <g data-feature={N.demand} data-feature-label="D">
          <line x1={dLine.x1} y1={dLine.y1} x2={dLine.x2} y2={dLine.y2} stroke={COLOR_D} strokeWidth={2.5} />
          <text x={dLine.x2 + 5} y={dLine.y2 + 4} fontSize={13} fontWeight={700} fill={COLOR_D}>D</text>
        </g>
        {dShift && (
          <g data-feature={N.demandShifted} data-feature-label="D'">
            <line x1={dShift.x1} y1={dShift.y1} x2={dShift.x2} y2={dShift.y2} stroke={COLOR_D_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={dShift.x2 + 5} y={dShift.y2 + 4} fontSize={13} fontWeight={700} fill={COLOR_D_NEW}>D&apos;</text>
          </g>
        )}

        {/* price control line + shortage/surplus */}
        {pc && (
          <g data-feature={N.priceControl} data-feature-label={`price ${pc.type}`}>
            <line x1={PAD_L} y1={yAt(pc.level)} x2={PAD_L + plotW} y2={yAt(pc.level)} stroke={COLOR_PC} strokeWidth={2} strokeDasharray="8 4" />
            <text x={PAD_L + plotW + 4} y={yAt(pc.level) + 4} fontSize={11} fontWeight={700} fill={COLOR_PC}>
              {pc.type === 'ceiling' ? 'Ceiling' : 'Floor'}
            </text>
            {pc.binding && (
              <g data-feature={N.gap} data-feature-label={pc.type === 'ceiling' ? 'shortage' : 'surplus'}>
                <line
                  x1={xAt(Math.min(pc.qDemand, pc.qSupply))}
                  y1={yAt(pc.level)}
                  x2={xAt(Math.max(pc.qDemand, pc.qSupply))}
                  y2={yAt(pc.level)}
                  stroke={COLOR_PC}
                  strokeWidth={6}
                  opacity={0.35}
                />
                <text
                  x={xAt((pc.qDemand + pc.qSupply) / 2)}
                  y={yAt(pc.level) + (pc.type === 'ceiling' ? 20 : -12)}
                  fontSize={12}
                  fontWeight={700}
                  fill={COLOR_PC}
                  textAnchor="middle"
                >
                  {pc.type === 'ceiling' ? 'Shortage' : 'Surplus'}
                </text>
              </g>
            )}
          </g>
        )}

        {/* initial equilibrium */}
        <g data-feature={N.eqInitial} data-feature-label="equilibrium">
          <line x1={xAt(Q0)} y1={yAt(P0)} x2={xAt(Q0)} y2={PAD_T + plotH} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
          <line x1={xAt(Q0)} y1={yAt(P0)} x2={PAD_L} y2={yAt(P0)} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
          <circle cx={xAt(Q0)} cy={yAt(P0)} r={5} fill={COLOR_EQ} stroke="#fff" strokeWidth={2} />
          <text x={xAt(Q0)} y={PAD_T + plotH + 15} fontSize={11} fill={COLOR_EQ} textAnchor="middle">{shift || pc ? 'Q₀' : 'Q*'}</text>
          <text x={PAD_L - 6} y={yAt(P0) + 4} fontSize={11} fill={COLOR_EQ} textAnchor="end">{shift || pc ? 'P₀' : 'P*'}</text>
        </g>

        {/* final equilibrium (shift only) */}
        {Q1 !== undefined && P1 !== undefined && (
          <g data-feature={N.eqFinal} data-feature-label="new equilibrium">
            <line x1={xAt(Q1)} y1={yAt(P1)} x2={xAt(Q1)} y2={PAD_T + plotH} stroke={COLOR_EQ_NEW} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
            <line x1={xAt(Q1)} y1={yAt(P1)} x2={PAD_L} y2={yAt(P1)} stroke={COLOR_EQ_NEW} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
            <circle cx={xAt(Q1)} cy={yAt(P1)} r={5} fill={COLOR_EQ_NEW} stroke="#fff" strokeWidth={2} />
            <text x={xAt(Q1)} y={PAD_T + plotH + 15} fontSize={11} fill={COLOR_EQ_NEW} textAnchor="middle">Q₁</text>
            <text x={PAD_L - 6} y={yAt(P1) + 4} fontSize={11} fill={COLOR_EQ_NEW} textAnchor="end">P₁</text>
          </g>
        )}

        {/* axis titles */}
        <text x={PAD_L + plotW / 2} y={H - 22} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">
          Quantity of {good}
        </text>
        <text
          x={22}
          y={PAD_T + plotH / 2}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 22 ${PAD_T + plotH / 2})`}
        >
          Price
        </text>
      </svg>
    </div>
  );
}
