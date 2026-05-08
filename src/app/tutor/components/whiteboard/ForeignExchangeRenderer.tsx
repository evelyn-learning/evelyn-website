'use client';

import React from 'react';
import type { FxMarketFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_S = '#dc2626';
const COLOR_S_NEW = '#fca5a5';
const COLOR_D = '#2563eb';
const COLOR_D_NEW = '#60a5fa';
const COLOR_AXIS = '#1f2937';
const COLOR_EQ = '#16a34a';
const COLOR_EQ_NEW = '#facc15';

export function ForeignExchangeRenderer({ figure }: { figure: FxMarketFigure }) {
  const {
    currency,
    quoteCurrency,
    initialQuantity: Q0,
    initialExchangeRate: e0,
    shift,
    finalQuantity: Q1,
    finalExchangeRate: e1,
    title,
  } = figure;

  const W = 540;
  const H = 400;
  const PAD_L = 80;
  const PAD_R = 60;
  const PAD_T = 36;
  const PAD_B = 70;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const AXIS_MAX = 100;
  const xAt = (v: number) => PAD_L + (v / AXIS_MAX) * plotW;
  const yAt = (v: number) => PAD_T + plotH - (v / AXIS_MAX) * plotH;

  const sIntercept0 = e0 - Q0;
  const dIntercept0 = e0 + Q0;

  function clipLine(slope: number, intercept: number): { x1: number; y1: number; x2: number; y2: number } {
    const candidates: { Q: number; e: number }[] = [];
    candidates.push({ Q: 0, e: intercept });
    candidates.push({ Q: AXIS_MAX, e: intercept + slope * AXIS_MAX });
    if (slope !== 0) candidates.push({ Q: -intercept / slope, e: 0 });
    if (slope !== 0) candidates.push({ Q: (AXIS_MAX - intercept) / slope, e: AXIS_MAX });
    const inside = candidates.filter((c) => c.Q >= 0 && c.Q <= AXIS_MAX && c.e >= 0 && c.e <= AXIS_MAX);
    if (inside.length < 2) {
      return { x1: xAt(0), y1: yAt(intercept), x2: xAt(AXIS_MAX), y2: yAt(intercept + slope * AXIS_MAX) };
    }
    inside.sort((a, b) => a.Q - b.Q);
    return {
      x1: xAt(inside[0].Q),
      y1: yAt(inside[0].e),
      x2: xAt(inside[inside.length - 1].Q),
      y2: yAt(inside[inside.length - 1].e),
    };
  }

  const sLine = clipLine(1, sIntercept0);
  const dLine = clipLine(-1, dIntercept0);

  let sShiftedLine: ReturnType<typeof clipLine> | null = null;
  let dShiftedLine: ReturnType<typeof clipLine> | null = null;
  if (shift) {
    const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
    if (shift.curve === 'S') sShiftedLine = clipLine(1, sIntercept0 - delta);
    else dShiftedLine = clipLine(-1, dIntercept0 + delta);
  }

  return (
    <div className="fx-market-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        <line x1={sLine.x1} y1={sLine.y1} x2={sLine.x2} y2={sLine.y2} stroke={COLOR_S} strokeWidth={2.5} />
        <text x={sLine.x2 + 4} y={sLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_S}>S{currency}</text>
        {sShiftedLine && (
          <>
            <line x1={sShiftedLine.x1} y1={sShiftedLine.y1} x2={sShiftedLine.x2} y2={sShiftedLine.y2} stroke={COLOR_S_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={sShiftedLine.x2 + 4} y={sShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_S_NEW}>S{currency}&apos;</text>
          </>
        )}

        <line x1={dLine.x1} y1={dLine.y1} x2={dLine.x2} y2={dLine.y2} stroke={COLOR_D} strokeWidth={2.5} />
        <text x={dLine.x2 + 4} y={dLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_D}>D{currency}</text>
        {dShiftedLine && (
          <>
            <line x1={dShiftedLine.x1} y1={dShiftedLine.y1} x2={dShiftedLine.x2} y2={dShiftedLine.y2} stroke={COLOR_D_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={dShiftedLine.x2 + 4} y={dShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_D_NEW}>D{currency}&apos;</text>
          </>
        )}

        <circle cx={xAt(Q0)} cy={yAt(e0)} r={5} fill={COLOR_EQ} stroke="#fff" strokeWidth={2} />
        <line x1={xAt(Q0)} y1={yAt(e0)} x2={xAt(Q0)} y2={PAD_T + plotH} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <line x1={xAt(Q0)} y1={yAt(e0)} x2={PAD_L} y2={yAt(e0)} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <text x={xAt(Q0)} y={PAD_T + plotH + 14} fontSize={11} fill={COLOR_EQ} textAnchor="middle">Q₀</text>
        <text x={PAD_L - 6} y={yAt(e0) + 4} fontSize={11} fill={COLOR_EQ} textAnchor="end">e₀</text>

        {Q1 !== undefined && e1 !== undefined && (
          <>
            <circle cx={xAt(Q1)} cy={yAt(e1)} r={5} fill={COLOR_EQ_NEW} stroke="#fff" strokeWidth={2} />
            <line x1={xAt(Q1)} y1={yAt(e1)} x2={xAt(Q1)} y2={PAD_T + plotH} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <line x1={xAt(Q1)} y1={yAt(e1)} x2={PAD_L} y2={yAt(e1)} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <text x={xAt(Q1)} y={PAD_T + plotH + 14} fontSize={11} fill="#a16207" textAnchor="middle">Q₁</text>
            <text x={PAD_L - 6} y={yAt(e1) + 4} fontSize={11} fill="#a16207" textAnchor="end">e₁</text>
          </>
        )}

        <text x={PAD_L + plotW / 2} y={H - 26} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">
          Quantity of {currency}
        </text>
        <text
          x={26}
          y={PAD_T + plotH / 2}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 26 ${PAD_T + plotH / 2})`}
        >
          Exchange Rate ({quoteCurrency} per {currency})
        </text>

        {shift && (
          <text x={PAD_L + plotW - 6} y={PAD_T + 14} fontSize={11} fill="#374151" textAnchor="end" fontStyle="italic">
            {shift.label ?? `${shift.curve}{currency} shifts ${shift.direction}`}
          </text>
        )}
      </svg>
    </div>
  );
}
