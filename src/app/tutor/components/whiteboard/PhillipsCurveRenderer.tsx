'use client';

import React from 'react';
import {
  phillipsCurveFeatureNames,
  type PhillipsCurveFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_SRPC = '#2563eb';
const COLOR_SRPC_NEW = '#60a5fa';
const COLOR_LRPC = '#1f2937';
const COLOR_LRPC_NEW = '#6b7280';
const COLOR_AXIS = '#1f2937';
const COLOR_EQ = '#16a34a';
const COLOR_EQ_NEW = '#facc15';

export function PhillipsCurveRenderer({ figure }: { figure: PhillipsCurveFigure }) {
  const {
    nairu,
    initialUnemployment: u0,
    initialInflation: pi0,
    showLrpc,
    shift,
    finalUnemployment: u1,
    finalInflation: pi1,
    title,
  } = figure;
  const N = phillipsCurveFeatureNames;

  const W = 540;
  const H = 400;
  const PAD_L = 70;
  const PAD_R = 60;
  const PAD_T = 36;
  const PAD_B = 60;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const AXIS_MAX = 100;
  const xAt = (v: number) => PAD_L + (v / AXIS_MAX) * plotW;
  const yAt = (v: number) => PAD_T + plotH - (v / AXIS_MAX) * plotH;

  // SRPC slope = -1, intercept = pi0 + u0. inflation = intercept - UR.
  const srpcIntercept0 = pi0 + u0;
  function clipLine(slope: number, intercept: number): { x1: number; y1: number; x2: number; y2: number } {
    const candidates: { U: number; pi: number }[] = [];
    candidates.push({ U: 0, pi: intercept });
    candidates.push({ U: AXIS_MAX, pi: intercept + slope * AXIS_MAX });
    if (slope !== 0) candidates.push({ U: -intercept / slope, pi: 0 });
    if (slope !== 0) candidates.push({ U: (AXIS_MAX - intercept) / slope, pi: AXIS_MAX });
    const inside = candidates.filter((c) => c.U >= 0 && c.U <= AXIS_MAX && c.pi >= 0 && c.pi <= AXIS_MAX);
    if (inside.length < 2) {
      return { x1: xAt(0), y1: yAt(intercept), x2: xAt(AXIS_MAX), y2: yAt(intercept + slope * AXIS_MAX) };
    }
    inside.sort((a, b) => a.U - b.U);
    return {
      x1: xAt(inside[0].U),
      y1: yAt(inside[0].pi),
      x2: xAt(inside[inside.length - 1].U),
      y2: yAt(inside[inside.length - 1].pi),
    };
  }

  const srpcLine = clipLine(-1, srpcIntercept0);

  let srpcShiftedLine: ReturnType<typeof clipLine> | null = null;
  let lrpcShiftedNairu: number | null = null;
  if (shift) {
    const delta = (shift.direction === 'up' || shift.direction === 'right') ? shift.magnitude : -shift.magnitude;
    if (shift.curve === 'SRPC') {
      srpcShiftedLine = clipLine(-1, srpcIntercept0 + delta);
    } else {
      lrpcShiftedNairu = nairu + delta;
    }
  }

  return (
    <div
      className="phillips-curve-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'Phillips curve'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* LRPC (vertical at NAIRU) */}
        {showLrpc && (
          <g
            data-feature={N.lrpc}
            data-feature-label="LRPC"
            data-feature-cx={xAt(nairu) / W}
            data-feature-cy={(PAD_T + plotH / 2) / H}
            data-feature-w={28 / W}
            data-feature-h={plotH / H}
          >
            <line x1={xAt(nairu)} y1={PAD_T} x2={xAt(nairu)} y2={PAD_T + plotH} stroke={COLOR_LRPC} strokeWidth={2} />
            <text x={xAt(nairu)} y={PAD_T - 6} fontSize={12} fontWeight={600} fill={COLOR_LRPC} textAnchor="middle">LRPC</text>
          </g>
        )}
        {showLrpc && lrpcShiftedNairu !== null && lrpcShiftedNairu >= 0 && lrpcShiftedNairu <= AXIS_MAX && (
          <g
            data-feature={N.lrpcShifted}
            data-feature-label="LRPC'"
            data-feature-cx={xAt(lrpcShiftedNairu) / W}
            data-feature-cy={(PAD_T + plotH / 2) / H}
            data-feature-w={28 / W}
            data-feature-h={plotH / H}
          >
            <line x1={xAt(lrpcShiftedNairu)} y1={PAD_T} x2={xAt(lrpcShiftedNairu)} y2={PAD_T + plotH} stroke={COLOR_LRPC_NEW} strokeWidth={2} strokeDasharray="6 4" />
            <text x={xAt(lrpcShiftedNairu)} y={PAD_T - 6} fontSize={12} fontWeight={600} fill={COLOR_LRPC_NEW} textAnchor="middle">LRPC&apos;</text>
          </g>
        )}

        {/* SRPC */}
        <g
          data-feature={N.srpc}
          data-feature-label="SRPC"
          data-feature-cx={((srpcLine.x1 + srpcLine.x2) / 2) / W}
          data-feature-cy={((srpcLine.y1 + srpcLine.y2) / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        >
          <line x1={srpcLine.x1} y1={srpcLine.y1} x2={srpcLine.x2} y2={srpcLine.y2} stroke={COLOR_SRPC} strokeWidth={2.5} />
          <text x={srpcLine.x2 + 4} y={srpcLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_SRPC}>SRPC</text>
        </g>
        {srpcShiftedLine && (
          <g
            data-feature={N.srpcShifted}
            data-feature-label="SRPC'"
            data-feature-cx={((srpcShiftedLine.x1 + srpcShiftedLine.x2) / 2) / W}
            data-feature-cy={((srpcShiftedLine.y1 + srpcShiftedLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={srpcShiftedLine.x1} y1={srpcShiftedLine.y1} x2={srpcShiftedLine.x2} y2={srpcShiftedLine.y2} stroke={COLOR_SRPC_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={srpcShiftedLine.x2 + 4} y={srpcShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_SRPC_NEW}>SRPC&apos;</text>
          </g>
        )}

        {/* Initial point */}
        <g
          data-feature={N.eqInitial}
          data-feature-label="initial equilibrium"
          data-feature-cx={xAt(u0) / W}
          data-feature-cy={yAt(pi0) / H}
          data-feature-w={40 / W}
          data-feature-h={40 / H}
        >
          <circle cx={xAt(u0)} cy={yAt(pi0)} r={5} fill={COLOR_EQ} stroke="#fff" strokeWidth={2} />
        </g>
        <line x1={xAt(u0)} y1={yAt(pi0)} x2={xAt(u0)} y2={PAD_T + plotH} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <line x1={xAt(u0)} y1={yAt(pi0)} x2={PAD_L} y2={yAt(pi0)} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <text x={xAt(u0)} y={PAD_T + plotH + 14} fontSize={11} fill={COLOR_EQ} textAnchor="middle">U₀</text>
        <text x={PAD_L - 6} y={yAt(pi0) + 4} fontSize={11} fill={COLOR_EQ} textAnchor="end">π₀</text>

        {/* Final point */}
        {u1 !== undefined && pi1 !== undefined && (
          <g
            data-feature={N.eqFinal}
            data-feature-label="final equilibrium"
            data-feature-cx={xAt(u1) / W}
            data-feature-cy={yAt(pi1) / H}
            data-feature-w={40 / W}
            data-feature-h={40 / H}
          >
            <circle cx={xAt(u1)} cy={yAt(pi1)} r={5} fill={COLOR_EQ_NEW} stroke="#fff" strokeWidth={2} />
            <line x1={xAt(u1)} y1={yAt(pi1)} x2={xAt(u1)} y2={PAD_T + plotH} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <line x1={xAt(u1)} y1={yAt(pi1)} x2={PAD_L} y2={yAt(pi1)} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <text x={xAt(u1)} y={PAD_T + plotH + 14} fontSize={11} fill="#a16207" textAnchor="middle">U₁</text>
            <text x={PAD_L - 6} y={yAt(pi1) + 4} fontSize={11} fill="#a16207" textAnchor="end">π₁</text>
          </g>
        )}

        <text x={PAD_L + plotW / 2} y={H - 18} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">
          Unemployment Rate (%)
        </text>
        <text
          x={20}
          y={PAD_T + plotH / 2}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 20 ${PAD_T + plotH / 2})`}
        >
          Inflation Rate (%)
        </text>

        {shift && (
          <text x={PAD_L + plotW - 6} y={PAD_T + 14} fontSize={11} fill="#374151" textAnchor="end" fontStyle="italic">
            {shift.label ?? `${shift.curve} shifts ${shift.direction}`}
          </text>
        )}
      </svg>
    </div>
  );
}
