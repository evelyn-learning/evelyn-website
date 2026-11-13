'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { BalanceScaleFigure, BalanceScaleItem } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const W = 760;
const CX = W / 2;
const HALF = 200;      // beam half-length
const TRAY = 250;      // tray width: a row of items never grows wider than this
const FS = 13;
const GAP = 6;
const STEM = 34;       // tray stands this far above the beam end
const TILT = 7;        // degrees

/** Rough width of a run of text: the boxes are sized from it, so it errs on the wide side. */
const tw = (s: string, fs: number) => s.length * fs * 0.6;

interface Box { item: BalanceScaleItem; lines: string[]; w: number; h: number }

/** One box per item, as wide as its label needs. A label too long for the tray breaks into two lines at a
 *  space; one that still does not fit is cut with an ellipsis rather than spilling out of its box. */
function boxFor(item: BalanceScaleItem): Box {
  const max = TRAY - 16;
  const label = item.label.trim();
  let lines = [label];
  if (tw(label, FS) > 150 && label.includes(' ')) {
    const words = label.split(/\s+/);
    let best = 1; let bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
  }
  lines = lines.map((l) => (tw(l, FS) > max ? `${l.slice(0, Math.floor(max / (FS * 0.6)) - 1)}…` : l));
  const w = Math.max(40, Math.max(...lines.map((l) => tw(l, FS))) + 18);
  return { item, lines, w, h: lines.length > 1 ? 44 : 30 };
}

/** Items stand on the tray in rows, filled from the bottom, each row centred. */
function rowsFor(items: BalanceScaleItem[]): { rows: Box[][]; height: number } {
  const rows: Box[][] = [];
  let row: Box[] = []; let used = 0;
  for (const b of items.map(boxFor)) {
    if (row.length && used + GAP + b.w > TRAY) { rows.push(row); row = []; used = 0; }
    used += (row.length ? GAP : 0) + b.w; row.push(b);
  }
  if (row.length) rows.push(row);
  const height = rows.reduce((s, r) => s + Math.max(...r.map((b) => b.h)) + GAP, 0);
  return { rows, height };
}

export function BalanceScaleRenderer({ figure }: { figure: BalanceScaleFigure }) {
  const { left, right, state, title, caption } = figure;
  const L = rowsFor(left); const R = rowsFor(right);
  // Both trays the same width: as wide as the widest row needs, so one apple does not sit on a long shelf.
  const widest = Math.max(...[...L.rows, ...R.rows].map((row) => row.reduce((s, b) => s + b.w, 0) + GAP * (row.length - 1)), 0);
  const trayW = Math.min(TRAY, Math.max(130, widest + 36));
  const angle = state === 'level' ? 0 : state === 'tilt_left' ? -TILT : TILT;
  const rad = (angle * Math.PI) / 180;
  const drop = HALF * Math.abs(Math.sin(rad));
  // The pivot sits low enough for the taller stack to clear the top even on the side that rises.
  const FY = 16 + Math.max(L.height, R.height, 30) + STEM + drop;
  const baseY = FY + 96;
  const H = baseY + 22;
  const lx = CX - HALF * Math.cos(rad); const ly = FY - HALF * Math.sin(rad);
  const rx = CX + HALF * Math.cos(rad); const ry = FY + HALF * Math.sin(rad);
  return (
    <div className="balance-scale-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]" role="img" aria-label={`Balance scale, ${state === 'level' ? 'level' : state === 'tilt_left' ? 'left side down' : 'right side down'}`}>
        {/* Stand */}
        <line x1={CX - 150} y1={baseY} x2={CX + 150} y2={baseY} stroke="#6b7280" strokeWidth={4} strokeLinecap="round" />
        <polygon points={`${CX - 34},${baseY} ${CX + 34},${baseY} ${CX},${FY}`} fill="#9ca3af" stroke="#374151" strokeWidth={1.5} strokeLinejoin="round" />
        {/* Trays first, so the beam's ends cover the foot of each stem */}
        <Tray x={lx} y={ly} rows={L.rows} trayW={trayW} />
        <Tray x={rx} y={ry} rows={R.rows} trayW={trayW} />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#374151" strokeWidth={7} strokeLinecap="round" />
        <circle cx={CX} cy={FY} r={6} fill="#fff" stroke="#374151" strokeWidth={2.5} />
      </svg>
      {caption && <div className="mt-2 max-w-[640px] text-center text-sm text-gray-700"><InlineMathText text={caption} /></div>}
    </div>
  );
}

function Tray({ x, y, rows, trayW }: { x: number; y: number; rows: Box[][]; trayW: number }) {
  const top = y - STEM;
  let rowBottom = top - 3;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={top} stroke="#374151" strokeWidth={5} />
      <path d={`M ${x - trayW / 2 - 8} ${top - 6} L ${x - trayW / 2 + 2} ${top + 3} L ${x + trayW / 2 - 2} ${top + 3} L ${x + trayW / 2 + 8} ${top - 6}`} fill="none" stroke="#374151" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      {rows.map((row, ri) => {
        const rowW = row.reduce((s, b) => s + b.w, 0) + GAP * (row.length - 1);
        const rowH = Math.max(...row.map((b) => b.h));
        let bx = x - rowW / 2;
        const bottom = rowBottom;
        rowBottom -= rowH + GAP;
        return row.map((b, i) => {
          const x0 = bx; bx += b.w + GAP;
          const y0 = bottom - b.h;
          const c = b.item.color;
          return (
            <g key={`${ri}-${i}`}>
              <rect x={x0} y={y0} width={b.w} height={b.h} rx={5} fill="#fff" />
              <rect x={x0} y={y0} width={b.w} height={b.h} rx={5} fill={c || '#dbeafe'} fillOpacity={c ? 0.25 : 1} stroke={c || '#3b82f6'} strokeWidth={2} />
              {b.lines.map((l, li) => (
                <text key={li} x={x0 + b.w / 2} y={y0 + (b.lines.length > 1 ? 18 + li * 16 : 20)} fontSize={FS} textAnchor="middle" fill="#111827" fontWeight={600}>{l}</text>
              ))}
            </g>
          );
        });
      })}
    </g>
  );
}
