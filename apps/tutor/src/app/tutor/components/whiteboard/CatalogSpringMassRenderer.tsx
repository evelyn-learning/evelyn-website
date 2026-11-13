'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { SpringMassFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const INK = '#374151';
const DIM = '#b91c1c';
const estW = (s: string, fontSize: number): number => s.length * fontSize * 0.6;
const fmtNum = (n: number): string => String(Number(n.toPrecision(6))).replace('-', '−');

/** Zig-zag coil between two points; the turns squeeze or open with the length. */
function Spring({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const lead = Math.min(10, len * 0.12);
  const turns = 12;
  const amp = 12;
  const step = (len - 2 * lead) / (turns * 2);
  const pt = (along: number, side: number): string =>
    `${(x1 + ux * along - uy * side).toFixed(1)} ${(y1 + uy * along + ux * side).toFixed(1)}`;
  let d = `M ${pt(0, 0)} L ${pt(lead, 0)}`;
  for (let i = 0; i < turns * 2; i++) {
    d += ` L ${pt(lead + (i + 0.5) * step, i % 2 === 0 ? amp : -amp)}`;
  }
  d += ` L ${pt(len - lead, 0)} L ${pt(len, 0)}`;
  return <path d={d} fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />;
}

/** Dimension line with a head at each end, pointing outwards. */
function DimLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const h = Math.min(9, len / 2.4);
  const head = (x: number, y: number, s: number): string =>
    `${x},${y} ${x + s * ux * h - uy * h * 0.45},${y + s * uy * h + ux * h * 0.45} ${x + s * ux * h + uy * h * 0.45},${y + s * uy * h - ux * h * 0.45}`;
  return (
    <g>
      <line x1={x1 + ux * h * 0.8} y1={y1 + uy * h * 0.8} x2={x2 - ux * h * 0.8} y2={y2 - uy * h * 0.8} stroke={DIM} strokeWidth={2} />
      <polygon points={head(x1, y1, 1)} fill={DIM} />
      <polygon points={head(x2, y2, -1)} fill={DIM} />
    </g>
  );
}

export function CatalogSpringMassRenderer({ figure }: { figure: SpringMassFigure }) {
  const { displacement, showEquilibrium, orientation, mass, k, title } = figure;
  const isVert = orientation === 'vertical';
  // The drawing is a schematic: the block is offset a fixed amount in the
  // direction of the displacement, and the label carries the real value.
  // (A value of 20 or more is an old pixel offset, not metres: no unit.)
  const dir = displacement > 0 ? 1 : displacement < 0 ? -1 : 0;
  const xText = Math.abs(displacement) < 20 ? `x = ${fmtNum(displacement)} m` : 'x';
  const massText = mass !== undefined ? `m = ${fmtNum(mass)} kg` : 'm';
  const kText = k !== undefined ? `k = ${fmtNum(k)} N/m` : null;
  const blockW = Math.max(64, Math.min(124, estW(massText, 13) + 22));
  const blockH = 54;

  if (isVert) {
    const W = 400;
    const H = 370;
    const cx = 180;
    const ceilingY = 40;
    const eqY = 236;
    const cy = eqY + dir * 62;
    const springEnd = cy - blockH / 2;
    const dimX = cx + blockW / 2 + 26;
    const ticks: React.ReactElement[] = [];
    for (let x = cx - 76; x <= cx + 76; x += 10) {
      ticks.push(<line key={x} x1={x} y1={ceilingY} x2={x + 8} y2={ceilingY - 10} stroke="#9ca3af" strokeWidth={1} />);
    }
    return (
      <div className="w-full flex flex-col items-center">
        {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[440px]">
          {ticks}
          <line x1={cx - 80} y1={ceilingY} x2={cx + 80} y2={ceilingY} stroke={INK} strokeWidth={3} strokeLinecap="round" />
          {showEquilibrium && (
            <g>
              <line x1={30} y1={eqY} x2={dimX + 12} y2={eqY} stroke="#6b7280" strokeDasharray="6 4" strokeWidth={1.5} />
              <text x={30} y={eqY - 6} fontSize={11} fill="#4b5563">equilibrium</text>
            </g>
          )}
          <Spring x1={cx} y1={ceilingY} x2={cx} y2={springEnd} />
          {kText && (
            <text x={cx - 24} y={(ceilingY + springEnd) / 2 + 4} fontSize={13} textAnchor="end" fill={INK} fontWeight={600}>{kText}</text>
          )}
          <rect x={cx - blockW / 2} y={cy - blockH / 2} width={blockW} height={blockH} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
          <text x={cx} y={cy + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{massText}</text>
          {showEquilibrium && dir !== 0 && (
            <g>
              <line x1={cx + blockW / 2} y1={cy} x2={dimX + 8} y2={cy} stroke={DIM} strokeWidth={1} />
              <DimLine x1={dimX} y1={eqY} x2={dimX} y2={cy} />
              <text x={dimX + 12} y={(eqY + cy) / 2 + 4} fontSize={13} fill={DIM} fontWeight={700}>{xText}</text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  const W = 520;
  const H = 250;
  const wallX = 60;
  const floorY = 172;
  const eqX = 304;
  const cx = eqX + dir * 72;
  const springY = floorY - blockH / 2;
  const springEnd = cx - blockW / 2;
  const ticks: React.ReactElement[] = [];
  for (let y = floorY - 104; y <= floorY; y += 10) {
    ticks.push(<line key={`w${y}`} x1={wallX} y1={y} x2={wallX - 10} y2={y + 8} stroke="#9ca3af" strokeWidth={1} />);
  }
  for (let x = wallX + 10; x <= W - 34; x += 10) {
    ticks.push(<line key={`f${x}`} x1={x} y1={floorY} x2={x - 8} y2={floorY + 9} stroke="#9ca3af" strokeWidth={1} />);
  }
  const kW = kText ? estW(kText, 13) : 0;
  const kX = Math.max(wallX + 8 + kW / 2, (wallX + springEnd) / 2);
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {ticks}
        <line x1={wallX} y1={floorY - 108} x2={wallX} y2={floorY} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <line x1={wallX} y1={floorY} x2={W - 30} y2={floorY} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {showEquilibrium && (
          <g>
            <line x1={eqX} y1={46} x2={eqX} y2={floorY + 34} stroke="#6b7280" strokeDasharray="6 4" strokeWidth={1.5} />
            <text x={eqX} y={38} fontSize={11} textAnchor="middle" fill="#4b5563">equilibrium</text>
          </g>
        )}
        <Spring x1={wallX} y1={springY} x2={springEnd} y2={springY} />
        {kText && (
          <text x={kX} y={springY - 24} fontSize={13} textAnchor="middle" fill={INK} fontWeight={600}>{kText}</text>
        )}
        <rect x={cx - blockW / 2} y={floorY - blockH - 1.5} width={blockW} height={blockH} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
        <text x={cx} y={springY + 4} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{massText}</text>
        {showEquilibrium && dir !== 0 && (
          <g>
            <line x1={cx} y1={floorY + 2} x2={cx} y2={floorY + 34} stroke={DIM} strokeWidth={1} />
            <DimLine x1={eqX} y1={floorY + 26} x2={cx} y2={floorY + 26} />
            <text x={(eqX + cx) / 2} y={floorY + 50} fontSize={13} textAnchor="middle" fill={DIM} fontWeight={700}>{xText}</text>
          </g>
        )}
      </svg>
    </div>
  );
}
