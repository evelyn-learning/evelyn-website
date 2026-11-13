'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { PendulumFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const estW = (s: string, fontSize: number): number => s.length * fontSize * 0.6;
const fmtNum = (n: number): string => String(Number(n.toPrecision(6))).replace('-', '−');

export function CatalogPendulumRenderer({ figure }: { figure: PendulumFigure }) {
  const { length, angleDegrees, showVelocity, title } = figure;
  const W = 460;
  const H = 340;
  // The string is always drawn the same size: `length` is a label, not a
  // scale (1.5 m used to be drawn as 1.5 px). 50+ is an old pixel length.
  const L = 250;
  const bobR = 18;
  const a = Math.max(-90, Math.min(90, angleDegrees));
  const s = a < 0 ? -1 : 1;
  const rad = (Math.abs(a) * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const pivotY = 40;
  // Centre the swing (vertical line … bob) on the board.
  const pivotX = Math.max(80, Math.min(W - 80, W / 2 - (s * L * sin) / 2));
  const bobX = pivotX + s * L * sin;
  const bobY = pivotY + L * cos;
  const lengthText = length > 0 && length <= 50 ? `L = ${fmtNum(length)} m` : 'L';
  const thetaText = `θ = ${fmtNum(Math.abs(a))}°`;
  const thetaW = estW(thetaText, 13);

  // Angle label: inside the wedge once the wedge is wide enough to hold it,
  // otherwise beside the arc on the far side of the vertical.
  const wide = Math.abs(a) >= 50;
  const rho = (thetaW / 2 + 8) / Math.sin(rad / 2 || 1);
  const arcR = wide ? Math.max(26, rho - 20) : Math.max(44, Math.min(120, 30 / (rad || 1)));
  const thetaPos = wide
    ? { x: pivotX + s * rho * Math.sin(rad / 2), y: pivotY + rho * Math.cos(rad / 2) + 4, anchor: 'middle' as const }
    : { x: pivotX - s * 9, y: pivotY + arcR + 4, anchor: s > 0 ? ('end' as const) : ('start' as const) };

  // Length label: outer side of the string, pushed out far enough that the
  // text box clears a steeply swung string.
  const lW = estW(lengthText, 13);
  const above = Math.abs(a) >= 60;
  const off = above ? 10 + (lW / 2) * cos : 12;
  const lPos = {
    x: pivotX + s * (L / 2) * sin + s * cos * off,
    y: pivotY + (L / 2) * cos - sin * off,
  };

  // Velocity: tangent to the swing, towards the rest position.
  const tx = -s * cos;
  const ty = sin;
  const v0 = { x: bobX + tx * (bobR + 3), y: bobY + ty * (bobR + 3) };
  const v1 = { x: v0.x + tx * 52, y: v0.y + ty * 52 };
  const head = `${v1.x},${v1.y} ${v1.x - tx * 11 - ty * 5},${v1.y - ty * 11 + tx * 5} ${v1.x - tx * 11 + ty * 5},${v1.y - ty * 11 - tx * 5}`;

  const ticks: React.ReactElement[] = [];
  for (let x = pivotX - 56; x <= pivotX + 56; x += 10) {
    ticks.push(<line key={x} x1={x} y1={pivotY} x2={x + 8} y2={pivotY - 10} stroke="#9ca3af" strokeWidth={1} />);
  }
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[500px]">
        {/* Support */}
        {ticks}
        <line x1={pivotX - 60} y1={pivotY} x2={pivotX + 60} y2={pivotY} stroke="#374151" strokeWidth={3} strokeLinecap="round" />
        {/* Vertical reference and the path of the bob */}
        <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + L + bobR + 8} stroke="#6b7280" strokeDasharray="6 4" strokeWidth={1.5} />
        {rad > 0 && (
          <path
            d={`M ${bobX} ${bobY} A ${L} ${L} 0 0 ${s > 0 ? 1 : 0} ${pivotX} ${pivotY + L}`}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={1.5}
            strokeDasharray="3 4"
          />
        )}
        {/* String, pivot, bob */}
        <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#1f2937" strokeWidth={2.5} />
        <circle cx={pivotX} cy={pivotY} r={4.5} fill="#374151" />
        <circle cx={bobX} cy={bobY} r={bobR} fill="#fbbf24" stroke="#92400e" strokeWidth={2} />
        <text x={lPos.x} y={lPos.y + (above ? -2 : 4)} fontSize={13} fill="#1f2937" fontWeight={700} textAnchor={above ? 'middle' : s > 0 ? 'start' : 'end'}>
          {lengthText}
        </text>
        {/* Angle */}
        {rad > 0 && (
          <g>
            <path
              d={`M ${pivotX} ${pivotY + arcR} A ${arcR} ${arcR} 0 0 ${s > 0 ? 0 : 1} ${pivotX + s * arcR * sin} ${pivotY + arcR * cos}`}
              fill="none"
              stroke="#dc2626"
              strokeWidth={2}
            />
            <text x={thetaPos.x} y={thetaPos.y} fontSize={13} fill="#dc2626" fontWeight={700} textAnchor={thetaPos.anchor}>
              {thetaText}
            </text>
          </g>
        )}
        {/* Velocity */}
        {showVelocity && rad > 0.01 && (
          <g>
            <line x1={v0.x} y1={v0.y} x2={v1.x - tx * 8} y2={v1.y - ty * 8} stroke="#16a34a" strokeWidth={2.5} />
            <polygon points={head} fill="#16a34a" />
            <text x={v1.x + tx * 12} y={v1.y + ty * 12 + 4} fontSize={13} fill="#16a34a" fontWeight={700} fontStyle="italic" textAnchor="middle">v</text>
          </g>
        )}
      </svg>
    </div>
  );
}
