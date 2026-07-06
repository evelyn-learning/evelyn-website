'use client';

/**
 * Elementary-math manipulative renderers (K-3):
 *   - clock_face      analog clock showing a time
 *   - ten_frame       one or two 2×5 ten-frames with counters
 *   - base_ten_blocks place-value blocks for a whole number
 *
 * Pure deterministic SVG. Each SVG element that the brain may address
 * carries a data-feature attribute matching the colocated *FeatureNames.
 */

import React from 'react';
import {
  clockFeatureNames,
  tenFrameFeatureNames,
  baseTenFeatureNames,
  type ClockFaceFigure,
  type TenFrameFigure,
  type BaseTenFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/elementary-math';

const INK = '#374151';
const FAINT = '#cbd5e1';
const SLATE = '#475569';
const RED = '#dc2626';
const BLUE = '#2563eb';
const GREEN = '#16a34a';
const AMBER = '#d97706';
const PURPLE = '#7c3aed';
const PANEL = '#f8fafc';

// clock angle (deg, clockwise from 12 o'clock) → point on a circle of radius r
function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg - 90) * (Math.PI / 180); // -90 so 0° points up
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

// ══════════════════════════════════════════════════════════════════════════
//  clock_face
// ══════════════════════════════════════════════════════════════════════════

export function CatalogClockFaceRenderer({ figure }: { figure: ClockFaceFigure }) {
  const N = clockFeatureNames;
  const W = 380;
  const H = 420;
  const cx = W / 2;
  const cy = 190;
  const R = 150;

  const heading = figure.title || `What time is it?`;

  const ticks: React.ReactNode[] = [];
  for (let m = 0; m < 60; m++) {
    const major = m % 5 === 0;
    if (!major && !figure.showMinuteTicks) continue;
    const [x1, y1] = polar(cx, cy, R - (major ? 16 : 8), m * 6);
    const [x2, y2] = polar(cx, cy, R - 2, m * 6);
    ticks.push(
      <line key={`t${m}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? SLATE : FAINT} strokeWidth={major ? 3 : 1.5} strokeLinecap="round" />,
    );
  }

  const numbers: React.ReactNode[] = [];
  for (let h = 1; h <= 12; h++) {
    const [tx, ty] = polar(cx, cy, R - 36, h * 30);
    numbers.push(
      <text key={`n${h}`} x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fontSize={26} fontWeight={700} fill={INK}>{h}</text>,
    );
  }

  const [hx, hy] = polar(cx, cy, R * 0.55, figure.hourAngle);
  const [mx, my] = polar(cx, cy, R * 0.82, figure.minuteAngle);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[380px]"
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={cy / H}
        data-feature-w={1}
        data-feature-h={(2 * R) / H}
      >
        <circle cx={cx} cy={cy} r={R} fill={PANEL} stroke={SLATE} strokeWidth={4} data-feature={N.face} data-feature-label="Clock face" />
        {ticks}
        {numbers}

        {/* minute hand (long, thin, blue) */}
        <line
          x1={cx} y1={cy} x2={mx} y2={my}
          stroke={BLUE} strokeWidth={5} strokeLinecap="round"
          data-feature={N.minuteHand} data-feature-label="Minute hand"
        />
        {/* hour hand (short, thick, red) */}
        <line
          x1={cx} y1={cy} x2={hx} y2={hy}
          stroke={RED} strokeWidth={8} strokeLinecap="round"
          data-feature={N.hourHand} data-feature-label="Hour hand"
        />
        <circle cx={cx} cy={cy} r={7} fill={INK} />

        {/* digital time label */}
        <g data-feature={N.timeLabel} data-feature-label={`Time ${figure.timeLabel}`}>
          <rect x={cx - 52} y={cy + R + 18} width={104} height={40} rx={8} fill="#ffffff" stroke={SLATE} strokeWidth={1.5} />
          <text x={cx} y={cy + R + 38} textAnchor="middle" dominantBaseline="central" fontSize={24} fontWeight={700} fill={INK} fontFamily="ui-monospace, monospace">{figure.timeLabel}</text>
        </g>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  ten_frame
// ══════════════════════════════════════════════════════════════════════════

export function CatalogTenFrameRenderer({ figure }: { figure: TenFrameFigure }) {
  const N = tenFrameFeatureNames;
  const cell = 52;
  const gap = 26;
  const frameW = cell * 5;
  const frameH = cell * 2;
  const nFrames = figure.frames.length;

  const W = frameW + 40;
  const H = 60 + nFrames * frameH + (nFrames - 1) * gap + 44;

  const heading = figure.title || `Ten-frame — ${figure.total}`;

  const renderFrame = (filled: number, color: string, fi: number) => {
    const ox = 20;
    const oy = 44 + fi * (frameH + gap);
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = ox + col * cell;
      const y = oy + row * cell;
      cells.push(<rect key={`c${fi}-${i}`} x={x} y={y} width={cell} height={cell} fill="#ffffff" stroke={SLATE} strokeWidth={2} />);
      if (i < filled) {
        cells.push(<circle key={`d${fi}-${i}`} cx={x + cell / 2} cy={y + cell / 2} r={cell * 0.34} fill={color} />);
      }
    }
    return (
      <g key={`frame${fi}`} data-feature={N.counters} data-feature-label={`Frame ${fi + 1}: ${filled}`}>
        {cells}
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {figure.frames.map((f, i) => renderFrame(f, figure.colors[i], i))}
        <g data-feature={N.total} data-feature-label={`Total ${figure.total}`}>
          <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={22} fontWeight={700} fill={INK}>Total: {figure.total}</text>
        </g>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  base_ten_blocks
// ══════════════════════════════════════════════════════════════════════════

const U = 15; // unit-square edge in px

/** A hundreds "flat": a 10×10 grid of unit squares. */
function Flat({ x, y, color }: { x: number; y: number; color: string }) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      cells.push(<rect key={`${r}-${c}`} x={x + c * (U * 0.6)} y={y + r * (U * 0.6)} width={U * 0.6} height={U * 0.6} fill={color} stroke="#ffffff" strokeWidth={0.6} />);
    }
  }
  return <g>{cells}<rect x={x} y={y} width={U * 6} height={U * 6} fill="none" stroke={INK} strokeWidth={1.5} /></g>;
}

/** A tens "rod": a 1×10 column of unit squares. */
function Rod({ x, y, color }: { x: number; y: number; color: string }) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 10; r++) {
    cells.push(<rect key={r} x={x} y={y + r * (U * 0.6)} width={U * 0.6} height={U * 0.6} fill={color} stroke="#ffffff" strokeWidth={0.6} />);
  }
  return <g>{cells}<rect x={x} y={y} width={U * 0.6} height={U * 6} fill="none" stroke={INK} strokeWidth={1.5} /></g>;
}

/** A thousands "cube": a flat with a small isometric offset to read as 3D. */
function Cube({ x, y, color }: { x: number; y: number; color: string }) {
  const s = U * 6;
  const d = U * 1.4;
  return (
    <g>
      <polygon points={`${x},${y} ${x + d},${y - d} ${x + s + d},${y - d} ${x + s},${y}`} fill={color} stroke={INK} strokeWidth={1.2} opacity={0.85} />
      <polygon points={`${x + s},${y} ${x + s + d},${y - d} ${x + s + d},${y + s - d} ${x + s},${y + s}`} fill={color} stroke={INK} strokeWidth={1.2} opacity={0.65} />
      <rect x={x} y={y} width={s} height={s} fill={color} stroke={INK} strokeWidth={1.5} />
    </g>
  );
}

export function CatalogBaseTenRenderer({ figure }: { figure: BaseTenFigure }) {
  const N = baseTenFeatureNames;
  const W = 820;
  const heading = figure.title || `Show ${figure.value} with blocks`;

  // Four place columns left→right: thousands, hundreds, tens, ones.
  const colX = [30, 290, 500, 660];
  const colLabels = ['Thousands', 'Hundreds', 'Tens', 'Ones'];
  const counts = [figure.thousands, figure.hundreds, figure.tens, figure.ones];
  const featNames = [N.thousands, N.hundreds, N.tens, N.ones];
  const colColors = [PURPLE, BLUE, GREEN, AMBER];
  const topY = 74; // headroom for the cube's isometric top edge
  const flatSize = U * 6;

  // Row pitches per place (cubes + flats stack 2-wide; ones 2-wide; rods 1 row).
  const cubePitch = flatSize + 34;
  const flatPitch = flatSize + 14;
  const onePitch = U * 0.6 + 4;

  // Content height needed by the tallest column, so nothing clips.
  const colHeight = (ci: number, count: number): number => {
    if (count === 0) return 30;
    if (ci === 0) return Math.ceil(count / 2) * cubePitch + 20; // + iso top overhang
    if (ci === 1) return Math.ceil(count / 2) * flatPitch;
    if (ci === 2) return flatSize; // rods are one row, full-height
    return Math.ceil(count / 2) * onePitch;
  };
  const contentH = Math.max(...counts.map((c, ci) => colHeight(ci, c)));

  const columns: React.ReactNode[] = colX.map((cx, ci) => {
    const count = counts[ci];
    const blocks: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      if (ci === 0) {
        blocks.push(<g key={i} transform={`translate(${cx + (i % 2) * (flatSize + 30)}, ${topY + Math.floor(i / 2) * cubePitch})`}><Cube x={0} y={0} color={colColors[ci]} /></g>);
      } else if (ci === 1) {
        blocks.push(<g key={i} transform={`translate(${cx + (i % 2) * (flatSize + 12)}, ${topY + Math.floor(i / 2) * flatPitch})`}><Flat x={0} y={0} color={colColors[ci]} /></g>);
      } else if (ci === 2) {
        blocks.push(<g key={i} transform={`translate(${cx + i * (U * 0.6 + 8)}, ${topY})`}><Rod x={0} y={0} color={colColors[ci]} /></g>);
      } else {
        const row = Math.floor(i / 2), col = i % 2;
        blocks.push(<rect key={i} x={cx + col * onePitch} y={topY + row * onePitch} width={U * 0.6} height={U * 0.6} fill={colColors[ci]} stroke={INK} strokeWidth={1} />);
      }
    }
    return (
      <g key={ci} data-feature={featNames[ci]} data-feature-label={`${colLabels[ci]}: ${count}`}>
        <text x={cx} y={34} fontSize={15} fontWeight={700} fill={colColors[ci]}>{colLabels[ci]}</text>
        {count === 0 ? <text x={cx} y={topY + 30} fontSize={16} fill={FAINT}>0</text> : blocks}
      </g>
    );
  });

  const H = topY + contentH + 44;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {colX.slice(1).map((cx, i) => (
          <line key={`sep${i}`} x1={cx - 20} y1={20} x2={cx - 20} y2={H - 40} stroke={FAINT} strokeWidth={1} strokeDasharray="4 4" />
        ))}
        {columns}
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={22} fontWeight={700} fill={INK}>{figure.value}</text>
      </svg>
    </div>
  );
}
