'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { WaveFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const AMP = '#dc2626';
const WL = '#15803d';
const fmtNum = (n: number): string => String(Number(n.toPrecision(6))).replace('-', '−');

/** Dimension line with a head at each end, pointing outwards. */
function DimLine({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const h = Math.min(9, len / 2.4);
  const head = (x: number, y: number, s: number): string =>
    `${x},${y} ${x + s * ux * h - uy * h * 0.45},${y + s * uy * h + ux * h * 0.45} ${x + s * ux * h + uy * h * 0.45},${y + s * uy * h - ux * h * 0.45}`;
  return (
    <g>
      <line x1={x1 + ux * h * 0.8} y1={y1 + uy * h * 0.8} x2={x2 - ux * h * 0.8} y2={y2 - uy * h * 0.8} stroke={color} strokeWidth={2} />
      <polygon points={head(x1, y1, 1)} fill={color} />
      <polygon points={head(x2, y2, -1)} fill={color} />
    </g>
  );
}

export function CatalogWaveDiagramRenderer({ figure }: { figure: WaveFigure }) {
  const { amplitude, wavelength, cycles, showAmplitude, showWavelength, title } = figure;
  const W = 700;
  const H = 290;
  // Margins hold the labels, so nothing is ever written over the curve:
  // amplitude in the left margin, "equilibrium" in the right one.
  const x0 = 112;
  const x1 = 600;
  const cy = 146;
  const ampPx = 72;
  const totalW = x1 - x0;
  const wlPx = totalW / cycles;
  const points: string[] = [];
  const N = Math.max(200, Math.ceil(cycles * 48));
  for (let i = 0; i <= N; i++) {
    const x = x0 + (i / N) * totalW;
    const y = cy - ampPx * Math.sin((i / N) * cycles * 2 * Math.PI);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const crestY = cy - ampPx;
  const troughY = cy + ampPx;
  const crestCount = cycles >= 0.25 ? Math.floor(cycles - 0.25 + 1e-9) + 1 : 0;
  const troughCount = cycles >= 0.75 ? Math.floor(cycles - 0.75 + 1e-9) + 1 : 0;
  const crestX = (i: number): number => x0 + (i + 0.25) * wlPx;
  const troughX = (i: number): number => x0 + (i + 0.75) * wlPx;

  // Wavelength: crest to crest above the wave when two crests exist;
  // otherwise along the bottom from the start of the wave.
  const wlOnTop = crestCount >= 2;
  const wlFull = cycles >= 1 - 1e-9;
  const wlSpan = wlOnTop
    ? { a: crestX(0), b: crestX(1), y: crestY - 20 }
    : { a: x0, b: x0 + (wlFull ? wlPx : wlPx / 2), y: troughY + 36 };
  const wlText = wlFull ? `λ = ${fmtNum(wavelength)}` : `λ/2 = ${fmtNum(wavelength / 2)}`;
  // "crest" only where it does not meet the wavelength dimension.
  const crestLabelAt = wlOnTop || !showWavelength
    ? (crestCount >= 3 || (!showWavelength && crestCount >= 1) ? crestX(crestCount - 1) : null)
    : (crestCount >= 1 ? crestX(crestCount - 1) : null);
  const troughLabelAt = troughCount >= 1 ? troughX(troughCount - 1) : null;
  const dimX = x0 - 20;

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]">
        {/* Equilibrium line */}
        <line x1={x0 - 32} y1={cy} x2={x1 + 6} y2={cy} stroke="#9ca3af" strokeWidth={1.5} />
        <text x={x1 + 12} y={cy + 4} fontSize={11} fill="#4b5563">equilibrium</text>
        {/* Wave */}
        <polyline points={points.join(' ')} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" />
        {crestLabelAt !== null && (
          <text x={crestLabelAt} y={crestY - 8} fontSize={11} textAnchor="middle" fill="#4b5563">crest</text>
        )}
        {troughLabelAt !== null && (
          <text x={troughLabelAt} y={troughY + 16} fontSize={11} textAnchor="middle" fill="#4b5563">trough</text>
        )}
        {/* Amplitude: measured in the left margin, level with the first crest */}
        {showAmplitude && crestCount >= 1 && (
          <g>
            <line x1={dimX - 8} y1={crestY} x2={crestX(0)} y2={crestY} stroke={AMP} strokeWidth={1} strokeDasharray="4 3" />
            <DimLine x1={dimX} y1={cy} x2={dimX} y2={crestY} color={AMP} />
            <text x={dimX - 10} y={cy - ampPx / 2 + 4} fontSize={13} textAnchor="end" fill={AMP} fontWeight={700}>
              A = {fmtNum(amplitude)}
            </text>
          </g>
        )}
        {/* Wavelength */}
        {showWavelength && (
          <g>
            {wlOnTop ? (
              <>
                <line x1={wlSpan.a} y1={crestY - 4} x2={wlSpan.a} y2={wlSpan.y - 6} stroke={WL} strokeWidth={1} />
                <line x1={wlSpan.b} y1={crestY - 4} x2={wlSpan.b} y2={wlSpan.y - 6} stroke={WL} strokeWidth={1} />
              </>
            ) : (
              <>
                <line x1={wlSpan.a} y1={cy + 4} x2={wlSpan.a} y2={wlSpan.y + 6} stroke={WL} strokeWidth={1} />
                <line x1={wlSpan.b} y1={cy + 4} x2={wlSpan.b} y2={wlSpan.y + 6} stroke={WL} strokeWidth={1} />
              </>
            )}
            <DimLine x1={wlSpan.a} y1={wlSpan.y} x2={wlSpan.b} y2={wlSpan.y} color={WL} />
            <text
              x={(wlSpan.a + wlSpan.b) / 2}
              y={wlOnTop ? wlSpan.y - 9 : wlSpan.y + 19}
              fontSize={13}
              textAnchor="middle"
              fill={WL}
              fontWeight={700}
            >
              {wlText}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
