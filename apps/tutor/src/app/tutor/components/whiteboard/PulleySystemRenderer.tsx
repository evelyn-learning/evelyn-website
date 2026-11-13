'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { pulleyReeving } from '@/lib/tutor/diagrams/catalog/kinds/physics';
import type { PulleyFigure, AtwoodSide } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const W = 480;
const H = 380;

const ROPE = '#1f2937';
const EFFORT = '#b45309';

// ── text helpers ──────────────────────────────────────────────────────────
// "m_1" / "F_{app}" are drawn as real subscripts; the width estimate must not
// count the markup.
const SUB_RE = /_(\{[^}]*\}|[A-Za-z0-9]+)/g;
const plain = (s: string): string => s.replace(SUB_RE, (_, g: string) => g.replace(/[{}]/g, ''));
const estW = (s: string, fontSize: number, bold = true): number => plain(s).length * fontSize * (bold ? 0.6 : 0.55);

function subParts(s: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of s.matchAll(SUB_RE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(s.slice(last, at));
    out.push(<tspan key={i++} baselineShift="sub" fontSize="72%">{m[1].replace(/[{}]/g, '')}</tspan>);
    last = at + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Greedy word wrap to a character budget (a single long word stays whole). */
function wrap(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && plain(`${cur} ${w}`).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

function fmtNum(n: number): string {
  return String(Number(n.toPrecision(4))).replace('-', '−');
}

type Line = { text: string; bold: boolean };
const LABEL_FS = 13;
const CAPTION_FS = 12;
const lineFs = (l: Line): number => (l.bold ? LABEL_FS : CAPTION_FS);
const lineW = (l: Line): number => estW(l.text, lineFs(l), l.bold);
const LINE_H = 16;

/** A body's label (bold) + optional weight caption, wrapped to a budget. */
function sideLines(side: AtwoodSide, maxChars: number): Line[] {
  const out: Line[] = wrap(side.label, maxChars).map((text) => ({ text, bold: true }));
  if (side.weight) for (const text of wrap(side.weight, maxChars)) out.push({ text, bold: false });
  return out;
}
const linesW = (lines: Line[]): number => Math.max(0, ...lines.map(lineW));
const fitsIn = (lines: Line[], w: number, h: number): boolean =>
  linesW(lines) <= w - 8 && lines.length * LINE_H <= h - 6;

/** Upright text lines. `y` is the vertical centre of the stack unless
 *  `vAlign` pins its top or bottom edge. */
function TextLines({
  lines, x, y, anchor = 'middle', vAlign = 'center',
}: { lines: Line[]; x: number; y: number; anchor?: 'start' | 'middle' | 'end'; vAlign?: 'center' | 'top' | 'bottom' }) {
  const total = lines.length * LINE_H;
  const top = vAlign === 'top' ? y : vAlign === 'bottom' ? y - total : y - total / 2;
  return (
    <g>
      {lines.map((l, i) => (
        <text
          key={i}
          x={x}
          y={top + i * LINE_H + LINE_H * 0.74}
          fontSize={lineFs(l)}
          textAnchor={anchor}
          fill={l.bold ? '#1e3a8a' : '#374151'}
          fontWeight={l.bold ? 700 : 400}
        >
          {subParts(l.text)}
        </text>
      ))}
    </g>
  );
}

function Box({ cx, cy, w, h }: { cx: number; cy: number; w: number; h: number }) {
  return <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />;
}

function PulleyWheel({ cx, cy, r = 16, movable = false }: { cx: number; cy: number; r?: number; movable?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={movable ? '#fef3c7' : '#e5e7eb'} stroke={movable ? '#92400e' : '#374151'} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={Math.max(2.5, r * 0.16)} fill={movable ? '#92400e' : '#374151'} />
    </g>
  );
}

/** Hatched support (ceiling) whose working edge is at `y`. */
function Ceiling({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const ticks: React.ReactElement[] = [];
  for (let x = x1 + 4; x <= x2; x += 10) {
    ticks.push(<line key={x} x1={x} y1={y} x2={x + 8} y2={y - 10} stroke="#9ca3af" strokeWidth={1} />);
  }
  return (
    <g>
      {ticks}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#4b5563" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export function PulleySystemRenderer({ figure }: { figure: PulleyFigure }) {
  const { mode, title } = figure;
  return (
    <div className="pulley-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {mode === 'atwood' && <AtwoodScene left={figure.leftSide} right={figure.rightSide} />}
        {mode === 'table-pulley' && <TablePulleyScene left={figure.leftSide} right={figure.rightSide} />}
        {mode === 'incline-pulley' && (
          <InclinePulleyScene angle={figure.inclineAngle ?? 30} left={figure.leftSide} right={figure.rightSide} />
        )}
        {mode !== 'atwood' && mode !== 'table-pulley' && mode !== 'incline-pulley' && <BlockTackleScene figure={figure} />}
      </svg>
    </div>
  );
}

// ── block and tackle ──────────────────────────────────────────────────────
function BlockTackleScene({ figure }: { figure: PulleyFigure }) {
  const { fixedCount, movableCount, weightLabel, weight } = figure;
  // The drawing, the strand count and the effort all come from one reeving,
  // so the caption can never disagree with the rope on the board.
  const { fixedUsed, movableUsed, startAt, strands, pullUp } = pulleyReeving(fixedCount, movableCount);
  const P = fixedUsed + movableUsed;
  const r = P <= 2 ? 20 : P <= 6 ? 18 : 15;
  const effortText = weight !== undefined ? `Effort = ${fmtNum(weight / strands)} N` : 'Effort';
  const effortW = estW(effortText, 13);
  const ropeSpan = 2 * r * P;

  // Pulley k (in rope order) sits between strand k and strand k+1; the two
  // blocks are offset by one diameter so every strand is vertical.
  const x0 = Math.max(16, (W - (ropeSpan + 12 + effortW)) / 2);
  const strandX = (j: number): number => x0 + 2 * r * j;
  const isFixed = (k: number): boolean => (startAt === 'movable') === (k % 2 === 0);
  const fixedXs: number[] = [];
  const movableXs: number[] = [];
  for (let k = 0; k < P; k++) (isFixed(k) ? fixedXs : movableXs).push(strandX(k) + r);

  const ceilingY = 34;
  const yU = ceilingY + 26 + r;
  const yL = yU + 150;
  const mid = (xs: number[]): number => (xs[0] + xs[xs.length - 1]) / 2;
  const upperCx = fixedXs.length ? mid(fixedXs) : strandX(0);
  // The load hangs under the middle of the lower block, or straight on the
  // rope when there is no movable pulley.
  const loadCx = movableXs.length ? mid(movableXs) : strandX(0);

  // Load box sized to its label.
  const loadText = /\d/.test(weightLabel) || weight === undefined ? weightLabel : `${weightLabel} = ${fmtNum(weight)} N`;
  const loadLines: Line[] = wrap(loadText, 22).map((text) => ({ text, bold: true }));
  const boxW = Math.max(72, linesW(loadLines) + 22);
  const boxH = Math.max(46, loadLines.length * LINE_H + 16);
  const boxCx = Math.max(8 + boxW / 2, Math.min(loadCx, W - 8 - boxW / 2));
  const boxTop = movableXs.length ? yL + r + 26 : yL + 10;
  const boxCy = boxTop + boxH / 2;

  // One continuous rope.
  const startY = startAt === 'fixed'
    ? (fixedXs.length ? yU : ceilingY)
    : (movableXs.length ? yL : boxTop);
  let d = `M ${strandX(0)} ${startY}`;
  for (let k = 0; k < P; k++) {
    const y = isFixed(k) ? yU : yL;
    d += ` L ${strandX(k)} ${y} A ${r} ${r} 0 0 ${isFixed(k) ? 1 : 0} ${strandX(k + 1)} ${y}`;
  }
  const freeX = strandX(P);
  const freeEndY = pullUp ? ceilingY + 22 : yU + (yL - yU) * 0.6;
  d += ` L ${freeX} ${pullUp ? freeEndY + 9 : freeEndY - 9}`;
  const head = pullUp
    ? `${freeX},${freeEndY} ${freeX - 6},${freeEndY + 12} ${freeX + 6},${freeEndY + 12}`
    : `${freeX},${freeEndY} ${freeX - 6},${freeEndY - 12} ${freeX + 6},${freeEndY - 12}`;

  // Block frames: a bar through the axles, reaching the strand tied to it.
  const upperBar = fixedXs.length
    ? { x1: Math.min(fixedXs[0], startAt === 'fixed' ? strandX(0) : Infinity), x2: fixedXs[fixedXs.length - 1] }
    : null;
  const lowerBar = movableXs.length
    ? { x1: Math.min(movableXs[0], startAt === 'movable' ? strandX(0) : Infinity), x2: movableXs[movableXs.length - 1] }
    : null;
  const ceilX1 = Math.max(10, Math.min(strandX(0), upperCx) - 60);
  const ceilX2 = Math.min(W - 10, Math.max(strandX(P - 1) + r, upperCx) + 60);

  return (
    <g>
      <Ceiling x1={ceilX1} x2={ceilX2} y={ceilingY} />
      {/* Hanger of the upper block and hook of the lower block (behind the wheels) */}
      {upperBar && <line x1={upperCx} y1={ceilingY} x2={upperCx} y2={yU} stroke="#4b5563" strokeWidth={3} />}
      {lowerBar && <line x1={loadCx} y1={yL} x2={boxCx} y2={boxTop} stroke="#4b5563" strokeWidth={3} />}
      {upperBar && <line x1={upperBar.x1} y1={yU} x2={upperBar.x2} y2={yU} stroke="#4b5563" strokeWidth={5} strokeLinecap="round" />}
      {lowerBar && <line x1={lowerBar.x1} y1={yL} x2={lowerBar.x2} y2={yL} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />}
      {fixedXs.map((x, i) => <PulleyWheel key={`f-${i}`} cx={x} cy={yU} r={r - 1.5} />)}
      {movableXs.map((x, i) => <PulleyWheel key={`m-${i}`} cx={x} cy={yL} r={r - 1.5} movable />)}
      <path d={d} fill="none" stroke={ROPE} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={strandX(0)} cy={startY} r={3} fill={ROPE} />
      {/* Effort on the free end */}
      <line x1={freeX} y1={pullUp ? freeEndY + 9 : freeEndY - 9} x2={freeX} y2={pullUp ? freeEndY + 40 : freeEndY - 40} stroke={EFFORT} strokeWidth={2.5} />
      <polygon points={head} fill={EFFORT} />
      <text x={freeX + 12} y={pullUp ? freeEndY + 18 : freeEndY - 6} fontSize={13} fill={EFFORT} fontWeight={700}>
        {effortText}
      </text>
      {/* Load */}
      <Box cx={boxCx} cy={boxCy} w={boxW} h={boxH} />
      <TextLines lines={loadLines} x={boxCx} y={boxCy} />
      <text x={W / 2} y={H - 10} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
        Mechanical advantage = {strands} ({strands} supporting {strands === 1 ? 'strand' : 'strands'})
      </text>
    </g>
  );
}

// ── Atwood machine ────────────────────────────────────────────────────────
function AtwoodScene({ left, right }: { left?: AtwoodSide; right?: AtwoodSide }) {
  const ceilingY = 36;
  const pulleyR = 36;
  const pulleyCx = W / 2;
  const pulleyCy = ceilingY + 24 + pulleyR;
  const massY = pulleyCy + 176;
  const leftCx = pulleyCx - pulleyR;
  const rightCx = pulleyCx + pulleyR;
  const ll = left ?? { label: 'm₁' };
  const rr = right ?? { label: 'm₂' };
  // The masses hang one pulley diameter apart, so a box can only grow to 64.
  // Labels that do not fit go beside the boxes, on the outer sides.
  const boxW = 60;
  const boxH = 48;
  const inL = sideLines(ll, 40);
  const inR = sideLines(rr, 40);
  const inside = fitsIn(inL, boxW, boxH) && fitsIn(inR, boxW, boxH);
  const roomChars = Math.floor((leftCx - boxW / 2 - 18) / (LABEL_FS * 0.6));
  const outL = sideLines(ll, roomChars);
  const outR = sideLines(rr, roomChars);
  return (
    <g>
      <Ceiling x1={pulleyCx - 130} x2={pulleyCx + 130} y={ceilingY} />
      <line x1={pulleyCx} y1={ceilingY} x2={pulleyCx} y2={pulleyCy} stroke="#4b5563" strokeWidth={3} />
      <PulleyWheel cx={pulleyCx} cy={pulleyCy} r={pulleyR - 1.5} />
      <path
        d={`M ${leftCx} ${massY - boxH / 2} L ${leftCx} ${pulleyCy} A ${pulleyR} ${pulleyR} 0 0 1 ${rightCx} ${pulleyCy} L ${rightCx} ${massY - boxH / 2}`}
        fill="none"
        stroke={ROPE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Box cx={leftCx} cy={massY} w={boxW} h={boxH} />
      <Box cx={rightCx} cy={massY} w={boxW} h={boxH} />
      {inside ? (
        <>
          <TextLines lines={inL} x={leftCx} y={massY} />
          <TextLines lines={inR} x={rightCx} y={massY} />
        </>
      ) : (
        <>
          <TextLines lines={outL} x={leftCx - boxW / 2 - 10} y={massY} anchor="end" />
          <TextLines lines={outR} x={rightCx + boxW / 2 + 10} y={massY} anchor="start" />
        </>
      )}
    </g>
  );
}

// ── block on a table + hanging block ──────────────────────────────────────
function TablePulleyScene({ left, right }: { left?: AtwoodSide; right?: AtwoodSide }) {
  const ll = left ?? { label: 'A' };
  const rr = right ?? { label: 'B' };
  const tableY = 130;
  const tableLeft = 50;
  const tableRight = 300;
  const floorY = 336;
  const blockH = 44;
  const ropeY = tableY - blockH / 2;
  // Pulley clamped to the table corner; its top is level with the rope so
  // the rope runs horizontally onto it and leaves it vertically.
  const pulleyR = 14;
  const pulleyCx = tableRight + 8;
  const pulleyCy = ropeY + pulleyR;
  const hangX = pulleyCx + pulleyR;

  // Table block grows to hold its label; a longer label goes above it.
  const tLines = sideLines(ll, 40);
  const tW = Math.max(52, Math.min(130, linesW(tLines) + 20));
  const tInside = fitsIn(tLines, tW, blockH);
  const tCx = tableLeft + 24 + Math.max(tW / 2, 50);
  const tOut = sideLines(ll, 26);
  const tOutX = Math.max(8 + linesW(tOut) / 2, tCx);

  // Hanging block: label inside, else underneath (free space down to the floor).
  const hW = 56;
  const hH = 44;
  const hCy = tableY + 112;
  const hLines = sideLines(rr, 40);
  const hInside = fitsIn(hLines, hW, hH);
  const legW = 12;
  const legXs = [tableLeft + 22, tableRight - 64 - legW];
  // Underneath label stays right of the table leg and inside the board.
  const hOut = sideLines(rr, 22);
  const hOutX = Math.max(legXs[1] + legW + 10 + linesW(hOut) / 2, Math.min(W - 8 - linesW(hOut) / 2, hangX));

  return (
    <g>
      {/* Floor */}
      <line x1={20} y1={floorY} x2={W - 20} y2={floorY} stroke="#9ca3af" strokeWidth={2} />
      {/* Table: legs, then the top over them */}
      {legXs.map((x) => (
        <rect key={x} x={x} y={tableY + 12} width={legW} height={floorY - tableY - 12} fill="#e5e7eb" stroke="#6b7280" strokeWidth={1.5} />
      ))}
      <rect x={tableLeft} y={tableY} width={tableRight - tableLeft} height={14} fill="#d1d5db" stroke="#4b5563" strokeWidth={2} rx={2} />
      {/* Pulley clamp */}
      <path d={`M ${tableRight} ${tableY + 7} L ${pulleyCx} ${tableY + 7} L ${pulleyCx} ${pulleyCy}`} fill="none" stroke="#4b5563" strokeWidth={3} strokeLinejoin="round" />
      <PulleyWheel cx={pulleyCx} cy={pulleyCy} r={pulleyR - 1.5} />
      {/* Rope: level from the block, a quarter turn over the pulley, straight down */}
      <path
        d={`M ${tCx + tW / 2} ${ropeY} L ${pulleyCx} ${ropeY} A ${pulleyR} ${pulleyR} 0 0 1 ${hangX} ${pulleyCy} L ${hangX} ${hCy - hH / 2}`}
        fill="none"
        stroke={ROPE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Box cx={tCx} cy={tableY - blockH / 2 - 1} w={tW} h={blockH} />
      {tInside
        ? <TextLines lines={tLines} x={tCx} y={tableY - blockH / 2 - 1} />
        : <TextLines lines={tOut} x={tOutX} y={tableY - blockH - 9} vAlign="bottom" />}
      <Box cx={hangX} cy={hCy} w={hW} h={hH} />
      {hInside
        ? <TextLines lines={hLines} x={hangX} y={hCy} />
        : <TextLines lines={hOut} x={hOutX} y={hCy + hH / 2 + 6} vAlign="top" />}
    </g>
  );
}

// ── block on an incline + hanging block ───────────────────────────────────
function InclinePulleyScene({ angle, left, right }: { angle: number; left?: AtwoodSide; right?: AtwoodSide }) {
  const ll = left ?? { label: 'm₁' };
  const rr = right ?? { label: 'm₂' };
  // The ramp is drawn at its true angle and scaled to fit (5°–75° drawable).
  const a = Math.max(5, Math.min(75, angle));
  const rad = (a * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const run = Math.min(250, 215 / Math.tan(rad));
  const rise = run * Math.tan(rad);
  const slopeLen = Math.hypot(run, rise);
  // The wedge stands at the edge of a bench, so the hanging block always has
  // room to hang, however shallow the ramp.
  const benchH = Math.max(30, 180 - rise);

  // Pulley radius = half the block height, so the rope from the block's mid
  // height runs parallel to the slope onto the pulley sitting at the top.
  const pr = 16;
  const bh = 2 * pr;
  const hW = 44;
  const hH = 40;

  // Block on the slope: label inside (turned with the block) when it fits
  // and the ramp is not too steep to read; otherwise upright, up-slope side.
  const bLines = sideLines(ll, 40);
  const bW = Math.max(46, Math.min(96, slopeLen * 0.42, linesW(bLines) + 18));
  const bInside = a <= 50 && fitsIn(bLines, bW, bh + 4);
  const bOut = sideLines(ll, 20);
  const hLines = sideLines(rr, 40);
  const hInside = fitsIn(hLines, hW, hH);
  const hOut = sideLines(rr, 16);

  const thetaText = `θ = ${fmtNum(Math.round(angle * 10) / 10)}°`;
  const thetaW = estW(thetaText, 12, false) + 4;
  const thetaD = Math.max(34, 17 / Math.tan(rad));
  const thetaInside = run - thetaD >= thetaW + 10;

  // Horizontal extents relative to the foot of the slope, then centre.
  const bDist = Math.max(bW / 2 + 10, Math.min(0.45 * slopeLen, slopeLen - bW / 2 - 30));
  const bRelX = bDist * cos - (bh / 2) * sin;
  const bLabelRelX = bRelX - (bh / 2 + 8) * sin;
  const leftExt = Math.min(
    thetaInside ? -30 : -(thetaW + 18),
    bInside ? 0 : bLabelRelX - linesW(bOut) - 4,
  );
  const hangRelX = run + 10 + pr;
  const rightExt = hangRelX + hW / 2 + (hInside ? 0 : 10 + linesW(hOut));
  const ax = Math.max(8 - leftExt, (W - (rightExt - leftExt)) / 2 - leftExt);
  const totalH = rise + benchH;
  const baseY = Math.max(50 + rise, (H - totalH) / 2 + rise + 12);
  const benchBottom = baseY + benchH;
  const benchLeft = ax + (thetaInside ? -30 : -(thetaW + 18));

  const topX = ax + run;
  const topY = baseY - rise;
  const pcx = topX + 10;
  const pcy = topY - 10 * Math.tan(rad);
  const tanX = pcx - pr * sin;
  const tanY = pcy - pr * cos;
  const bcx = ax + bRelX;
  const bcy = baseY - bDist * sin - (bh / 2) * cos;
  const ropeStartX = bcx + (bW / 2) * cos;
  const ropeStartY = bcy - (bW / 2) * sin;
  const hangX = pcx + pr;
  const hangCy = pcy + Math.max(70, Math.min(140, 0.5 * (benchBottom - pcy)));
  const arcR = thetaD - 6;
  // Hatching on the solid side of the bench top and of its edge.
  const benchTicks: React.ReactElement[] = [];
  for (let x = benchLeft + 10; x <= topX - 2; x += 10) {
    benchTicks.push(<line key={`h${x}`} x1={x} y1={baseY} x2={x - 8} y2={baseY + 10} stroke="#9ca3af" strokeWidth={1} />);
  }
  for (let y = baseY + 12; y <= benchBottom; y += 10) {
    benchTicks.push(<line key={`v${y}`} x1={topX} y1={y} x2={topX - 8} y2={y + 8} stroke="#9ca3af" strokeWidth={1} />);
  }

  return (
    <g>
      {/* Bench the wedge stands on; its edge continues the wedge's back face */}
      {benchTicks}
      <path d={`M ${benchLeft} ${baseY} L ${topX} ${baseY} L ${topX} ${benchBottom}`} fill="none" stroke="#4b5563" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Wedge */}
      <polygon points={`${ax},${baseY} ${topX},${baseY} ${topX},${topY}`} fill="#f1f5f9" stroke="#475569" strokeWidth={2} strokeLinejoin="round" />
      {/* Angle arc + label */}
      <path
        d={`M ${ax + arcR} ${baseY} A ${arcR} ${arcR} 0 0 0 ${ax + arcR * cos} ${baseY - arcR * sin}`}
        fill="none"
        stroke="#475569"
        strokeWidth={1.5}
      />
      <text
        x={thetaInside ? ax + thetaD : ax - 8}
        y={baseY - 5}
        fontSize={12}
        textAnchor={thetaInside ? 'start' : 'end'}
        fill="#334155"
        fontStyle="italic"
      >
        {thetaText}
      </text>
      {/* Pulley on the top corner */}
      <line x1={topX} y1={topY} x2={pcx} y2={pcy} stroke="#4b5563" strokeWidth={4} strokeLinecap="round" />
      <PulleyWheel cx={pcx} cy={pcy} r={pr - 1.5} />
      {/* Rope: parallel to the slope, over the pulley, straight down */}
      <path
        d={`M ${ropeStartX} ${ropeStartY} L ${tanX} ${tanY} A ${pr} ${pr} 0 0 1 ${hangX} ${pcy} L ${hangX} ${hangCy - hH / 2}`}
        fill="none"
        stroke={ROPE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Block on the slope */}
      <g transform={`rotate(${-a} ${bcx} ${bcy})`}>
        <Box cx={bcx} cy={bcy - 1} w={bW} h={bh} />
        {bInside && <TextLines lines={bLines} x={bcx} y={bcy - 1} />}
      </g>
      {!bInside && (
        <TextLines
          lines={bOut}
          x={ax + bLabelRelX}
          y={bcy - (bh / 2 + 8) * cos}
          anchor="end"
          vAlign="bottom"
        />
      )}
      {/* Hanging block */}
      <Box cx={hangX} cy={hangCy} w={hW} h={hH} />
      {hInside
        ? <TextLines lines={hLines} x={hangX} y={hangCy} />
        : <TextLines lines={hOut} x={hangX + hW / 2 + 10} y={hangCy} anchor="start" />}
    </g>
  );
}
