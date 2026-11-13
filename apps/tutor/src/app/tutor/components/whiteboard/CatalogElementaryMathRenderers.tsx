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
  coordinateGridFeatureNames,
  type ClockFaceFigure,
  type TenFrameFigure,
  type BaseTenFigure,
  type CoordinateGridFigure,
  coordinateGridStep as coordStep,
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

  // Both hands stop short of the numerals (inner edge ≈ R − 50), so a hand
  // never hides the number it points at.
  const [hx, hy] = polar(cx, cy, R * 0.42, figure.hourAngle);
  const [mx, my] = polar(cx, cy, R * 0.63, figure.minuteAngle);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
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
          <text x={cx} y={cy + R + 38} textAnchor="middle" dominantBaseline="central" fontSize={24} fontWeight={700} fill={INK} style={{ fontVariantNumeric: 'tabular-nums' }}>{figure.timeLabel}</text>
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
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
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

/** A hundreds "flat": a 10×10 grid of unit squares, edge 10·c. */
function Flat({ x, y, c, color }: { x: number; y: number; c: number; color: string }) {
  const lines: React.ReactNode[] = [];
  for (let k = 1; k < 10; k++) {
    lines.push(<line key={`v${k}`} x1={x + k * c} y1={y} x2={x + k * c} y2={y + 10 * c} stroke="#ffffff" strokeWidth={0.7} />);
    lines.push(<line key={`h${k}`} x1={x} y1={y + k * c} x2={x + 10 * c} y2={y + k * c} stroke="#ffffff" strokeWidth={0.7} />);
  }
  return <g><rect x={x} y={y} width={10 * c} height={10 * c} fill={color} />{lines}<rect x={x} y={y} width={10 * c} height={10 * c} fill="none" stroke={INK} strokeWidth={1.5} /></g>;
}

/** A tens "rod": a 1×10 column of unit squares. */
function Rod({ x, y, c, color }: { x: number; y: number; c: number; color: string }) {
  const lines: React.ReactNode[] = [];
  for (let k = 1; k < 10; k++) {
    lines.push(<line key={k} x1={x} y1={y + k * c} x2={x + c} y2={y + k * c} stroke="#ffffff" strokeWidth={0.7} />);
  }
  return <g><rect x={x} y={y} width={c} height={10 * c} fill={color} />{lines}<rect x={x} y={y} width={c} height={10 * c} fill="none" stroke={INK} strokeWidth={1.5} /></g>;
}

/** A thousands "cube": a flat with an oblique top and side so it reads as 3D. */
function Cube({ x, y, c, color }: { x: number; y: number; c: number; color: string }) {
  const s = 10 * c;
  const d = 2.4 * c;
  return (
    <g>
      <polygon points={`${x},${y} ${x + d},${y - d} ${x + s + d},${y - d} ${x + s},${y}`} fill={color} stroke={INK} strokeWidth={1.2} opacity={0.85} />
      <polygon points={`${x + s},${y} ${x + s + d},${y - d} ${x + s + d},${y + s - d} ${x + s},${y + s}`} fill={color} stroke={INK} strokeWidth={1.2} opacity={0.65} />
      <Flat x={x} y={y} c={c} color={color} />
    </g>
  );
}

export function CatalogBaseTenRenderer({ figure }: { figure: BaseTenFigure }) {
  const N = baseTenFeatureNames;
  const heading = figure.title || `Show ${figure.value} with blocks`;

  // Four place columns left→right: thousands, hundreds, tens, ones.
  const colLabels = ['Thousands', 'Hundreds', 'Tens', 'Ones'];
  const counts = [figure.thousands, figure.hundreds, figure.tens, figure.ones];
  const featNames = [N.thousands, N.hundreds, N.tens, N.ones];
  const colColors = [PURPLE, BLUE, GREEN, AMBER];

  // Unit edge: roomy when there are few big blocks, smaller when a place
  // holds many, so 9,999 still fits on one board.
  const bigMax = Math.max(figure.thousands, figure.hundreds);
  const c = bigMax <= 2 ? 9 : bigMax <= 4 ? 7.5 : 6;
  const flat = 10 * c;
  const depth = 2.4 * c;
  // Big blocks sit in rows of 2 (up to 4) or 3 (5–9).
  const perRow = (count: number) => (count <= 4 ? 2 : 3);
  const cubeGapX = depth + 8;
  const cubeGapY = depth + 10;
  const flatGap = 10;
  const rodGap = Math.max(5, c * 0.8);
  const oneGap = 4;

  const contentW = (ci: number, count: number): number => {
    if (count === 0) return 0;
    if (ci === 0) { const n = Math.min(count, perRow(count)); return n * flat + (n - 1) * cubeGapX + depth; }
    if (ci === 1) { const n = Math.min(count, perRow(count)); return n * flat + (n - 1) * flatGap; }
    if (ci === 2) return count * c + (count - 1) * rodGap;
    const n = Math.min(count, 3);
    return n * c + (n - 1) * oneGap;
  };
  const contentH = (ci: number, count: number): number => {
    if (count === 0) return 30;
    if (ci === 0) { const r = Math.ceil(count / perRow(count)); return r * flat + (r - 1) * cubeGapY + depth; }
    if (ci === 1) { const r = Math.ceil(count / perRow(count)); return r * flat + (r - 1) * flatGap; }
    if (ci === 2) return flat;
    const r = Math.ceil(count / 3);
    return r * c + (r - 1) * oneGap;
  };

  const COL_PAD = 22;
  const colW = counts.map((count, ci) => Math.max(colLabels[ci].length * 15 * 0.6, contentW(ci, count)) + 2 * COL_PAD);
  const colX: number[] = [];
  let acc = 10;
  for (const w of colW) { colX.push(acc + COL_PAD); acc += w; }
  const W = acc + 10;
  const headY = 30;
  const topY = headY + 22 + depth; // headroom for a cube's top face
  const bodyH = Math.max(...counts.map((count, ci) => contentH(ci, count)));
  const H = topY + bodyH + 54;

  const columns: React.ReactNode[] = colX.map((cx, ci) => {
    const count = counts[ci];
    const blocks: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      if (ci === 0) {
        const pr = perRow(count);
        blocks.push(<Cube key={i} x={cx + (i % pr) * (flat + cubeGapX)} y={topY + Math.floor(i / pr) * (flat + cubeGapY)} c={c} color={colColors[ci]} />);
      } else if (ci === 1) {
        const pr = perRow(count);
        blocks.push(<Flat key={i} x={cx + (i % pr) * (flat + flatGap)} y={topY + Math.floor(i / pr) * (flat + flatGap)} c={c} color={colColors[ci]} />);
      } else if (ci === 2) {
        blocks.push(<Rod key={i} x={cx + i * (c + rodGap)} y={topY} c={c} color={colColors[ci]} />);
      } else {
        const row = Math.floor(i / 3), col = i % 3;
        blocks.push(<rect key={i} x={cx + col * (c + oneGap)} y={topY + row * (c + oneGap)} width={c} height={c} fill={colColors[ci]} stroke={INK} strokeWidth={1} />);
      }
    }
    return (
      <g key={ci} data-feature={featNames[ci]} data-feature-label={`${colLabels[ci]}: ${count}`}>
        <text x={cx} y={headY} fontSize={15} fontWeight={700} fill={colColors[ci]}>{colLabels[ci]}</text>
        {count === 0 ? <text x={cx} y={topY + 14} fontSize={16} fill="#94a3b8">0</text> : blocks}
      </g>
    );
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(820, W * 1.1) }}
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {colX.slice(1).map((cx, i) => (
          <line key={`sep${i}`} x1={cx - COL_PAD} y1={14} x2={cx - COL_PAD} y2={H - 44} stroke={FAINT} strokeWidth={1} strokeDasharray="4 4" />
        ))}
        {columns}
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={22} fontWeight={700} fill={INK}>{figure.value.toLocaleString('en-US')}</text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  coordinate_grid
// ══════════════════════════════════════════════════════════════════════════

const POINT_COLORS = [RED, BLUE, GREEN, PURPLE, AMBER];

export function CatalogCoordinateGridRenderer({ figure }: { figure: CoordinateGridFigure }) {
  const N = coordinateGridFeatureNames;
  const { xMin, xMax, yMin, yMax, points, quadrants, connect } = figure;
  const heading = figure.title || 'Coordinate grid';

  const spanX = xMax - xMin;
  const spanY = yMax - yMin;

  // Plot box: one unit is the same length on both axes whenever the two
  // spans are of similar size (so shapes are not stretched); a very lopsided
  // window fills the square box on each axis independently.
  const BOX = 460;
  const ratio = Math.max(spanX, spanY) / Math.min(spanX, spanY);
  const equalUnits = ratio <= 2.5;
  const unit = BOX / Math.max(spanX, spanY);
  const plotW = equalUnits ? spanX * unit : BOX;
  const plotH = equalUnits ? spanY * unit : BOX;

  const fmt = (v: number): string => String(Math.round(v * 1e6) / 1e6).replace(/^-/, '−');
  const stepX = equalUnits ? (figure.step ?? coordStep(Math.max(spanX, spanY))) : coordStep(spanX);
  const stepY = equalUnits ? stepX : coordStep(spanY);
  const xTicks: number[] = [];
  for (let x = Math.ceil(xMin / stepX - 1e-9) * stepX; x <= xMax + 1e-9; x += stepX) xTicks.push(Math.round(x * 1e6) / 1e6);
  const yTicks: number[] = [];
  for (let y = Math.ceil(yMin / stepY - 1e-9) * stepY; y <= yMax + 1e-9; y += stepY) yTicks.push(Math.round(y * 1e6) / 1e6);

  // Margins: room for the y numerals when the y-axis sits on the left edge.
  const yNumW = Math.max(...yTicks.map((t) => fmt(t).length), 1) * 12 * 0.6 + 12;
  const M = { left: Math.max(34, xMin >= 0 ? yNumW + 6 : 30), right: 30, top: 26, bottom: 34 };
  const W = M.left + plotW + M.right;
  const H = M.top + plotH + M.bottom;

  // data → pixel
  const px = (x: number): number => M.left + ((x - xMin) / spanX) * plotW;
  const py = (y: number): number => M.top + (1 - (y - yMin) / spanY) * plotH;

  // Axis positions: the x-axis sits at data y=0 (clamped into view), y-axis at x=0.
  const axisY = py(Math.min(Math.max(0, yMin), yMax));
  const axisX = px(Math.min(Math.max(0, xMin), xMax));

  // x numerals: every k-th when neighbours would touch.
  const xNumW = Math.max(...xTicks.map((t) => fmt(t).length), 1) * 12 * 0.6;
  const xGap = (stepX / spanX) * plotW;
  let xEvery = 1;
  while (xEvery * xGap < xNumW + 6 && xEvery < 10) xEvery++;
  const yGap = (stepY / spanY) * plotH;
  let yEvery = 1;
  while (yEvery * yGap < 15 && yEvery < 10) yEvery++;
  const showX = (x: number) => Math.round(x / stepX) % xEvery === 0;
  const showY = (y: number) => Math.round(y / stepY) % yEvery === 0;

  const closed = connect && figure.closed === true && points.length >= 3;
  const polyPts = connect && points.length >= 2
    ? points.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')
    : null;

  // ── Point labels ──────────────────────────────────────────────────────
  // Each label tries the four diagonal spots around its point, then right
  // above / below it, and takes the first that stays inside the canvas and
  // clear of every other point and every label already placed.
  type Box = { l: number; r: number; t: number; b: number };
  const hit = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
  const FS = 14;
  const pointBoxes: Box[] = points.map((p) => ({ l: px(p.x) - 7, r: px(p.x) + 7, t: py(p.y) - 7, b: py(p.y) + 7 }));
  const placedBoxes: Box[] = [];
  const labelSpots = points.map((p, i) => {
    const nm = p.label || `(${fmt(p.x)}, ${fmt(p.y)})`;
    const w = nm.length * FS * 0.6;
    const cx = px(p.x);
    const cy = py(p.y);
    const cands: Array<{ x: number; y: number; anchor: 'start' | 'end' | 'middle' }> = [
      { x: cx + 9, y: cy - 9, anchor: 'start' },
      { x: cx - 9, y: cy - 9, anchor: 'end' },
      { x: cx + 9, y: cy + 19, anchor: 'start' },
      { x: cx - 9, y: cy + 19, anchor: 'end' },
      { x: cx, y: cy - 12, anchor: 'middle' },
      { x: cx, y: cy + 23, anchor: 'middle' },
      { x: cx + 9, y: cy - 25, anchor: 'start' },
      { x: cx - 9, y: cy - 25, anchor: 'end' },
      { x: cx + 9, y: cy + 35, anchor: 'start' },
      { x: cx - 9, y: cy + 35, anchor: 'end' },
    ];
    const boxOf = (c: (typeof cands)[number]): Box => {
      const l = c.anchor === 'start' ? c.x : c.anchor === 'end' ? c.x - w : c.x - w / 2;
      return { l, r: l + w, t: c.y - FS, b: c.y + 3 };
    };
    const inside = (b: Box) => b.l >= 2 && b.r <= W - 2 && b.t >= 2 && b.b <= H - 2;
    let best = cands[0];
    let bestScore = Infinity;
    for (const c of cands) {
      const b = boxOf(c);
      let score = 0;
      if (!inside(b)) score += 100;
      placedBoxes.forEach((o) => { if (hit(b, o)) score += 10; });
      pointBoxes.forEach((o, j) => { if (j !== i && hit(b, o)) score += 6; });
      if (score < bestScore) { bestScore = score; best = c; }
      if (score === 0) break;
    }
    // last resort: pull a too-wide label back inside the canvas
    let b = boxOf(best);
    let x = best.x;
    if (b.l < 2) x += 2 - b.l;
    if (b.r > W - 2) x -= b.r - (W - 2);
    b = { ...b, l: b.l + (x - best.x), r: b.r + (x - best.x) };
    placedBoxes.push(b);
    return { nm, x, y: best.y, anchor: best.anchor };
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.grid}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* gridlines */}
        {xTicks.map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={M.top} x2={px(x)} y2={M.top + plotH} stroke={FAINT} strokeWidth={x === 0 ? 0 : 1} />
        ))}
        {yTicks.map((y) => (
          <line key={`gy${y}`} x1={M.left} y1={py(y)} x2={M.left + plotW} y2={py(y)} stroke={FAINT} strokeWidth={y === 0 ? 0 : 1} />
        ))}

        {/* plot border */}
        <rect x={M.left} y={M.top} width={plotW} height={plotH} fill="none" stroke={FAINT} strokeWidth={1} />

        {/* axes */}
        <g data-feature={N.xAxis} data-feature-label="x-axis">
          <line x1={M.left} y1={axisY} x2={M.left + plotW + 6} y2={axisY} stroke={SLATE} strokeWidth={2.5} />
          <polygon points={`${M.left + plotW + 14},${axisY} ${M.left + plotW + 5},${axisY - 5} ${M.left + plotW + 5},${axisY + 5}`} fill={SLATE} />
          <text x={M.left + plotW + 20} y={axisY + 5} textAnchor="middle" fontSize={15} fontStyle="italic" fill={SLATE}>x</text>
        </g>
        <g data-feature={N.yAxis} data-feature-label="y-axis">
          <line x1={axisX} y1={M.top + plotH} x2={axisX} y2={M.top - 6} stroke={SLATE} strokeWidth={2.5} />
          <polygon points={`${axisX},${M.top - 14} ${axisX - 5},${M.top - 5} ${axisX + 5},${M.top - 5}`} fill={SLATE} />
          <text x={axisX + 10} y={M.top - 8} textAnchor="start" fontSize={15} fontStyle="italic" fill={SLATE}>y</text>
        </g>

        {/* tick numerals (white halo so a gridline never strikes through one) */}
        <g fontSize={12} fill={SLATE} stroke="#ffffff" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">
          {xTicks.filter((x) => x !== 0 && showX(x)).map((x) => (
            <text key={`tx${x}`} x={px(x)} y={axisY + 16} textAnchor="middle">{fmt(x)}</text>
          ))}
          {yTicks.filter((y) => y !== 0 && showY(y)).map((y) => (
            <text key={`ty${y}`} x={axisX - 8} y={py(y) + 4} textAnchor="end">{fmt(y)}</text>
          ))}
          {/* origin label */}
          {xMin <= 0 && yMin <= 0 && xMax >= 0 && yMax >= 0 && (
            <text x={axisX - 7} y={axisY + 16} textAnchor="end">{quadrants === 1 ? '0' : 'O'}</text>
          )}
        </g>

        {/* connecting path */}
        {polyPts && (closed
          ? <polygon points={polyPts} fill="rgba(71,85,105,0.08)" stroke={SLATE} strokeWidth={2} strokeLinejoin="round" />
          : <polyline points={polyPts} fill="none" stroke={SLATE} strokeWidth={2} strokeLinejoin="round" />)}

        {/* plotted points */}
        {points.map((p, i) => {
          const cx = px(p.x);
          const cy = py(p.y);
          const color = p.color || POINT_COLORS[i % POINT_COLORS.length];
          const spot = labelSpots[i];
          return (
            <g key={`p${i}`} data-feature={N.point(i)} data-feature-label={`${spot.nm} at (${p.x}, ${p.y})`}>
              <circle cx={cx} cy={cy} r={5.5} fill={color} stroke="#fff" strokeWidth={1.5} />
              <text
                x={spot.x}
                y={spot.y}
                textAnchor={spot.anchor}
                fontSize={FS}
                fontWeight={700}
                fill={color}
                stroke="#ffffff"
                strokeWidth={3.5}
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                {spot.nm}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
