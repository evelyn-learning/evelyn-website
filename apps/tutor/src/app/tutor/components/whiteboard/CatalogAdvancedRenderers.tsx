'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { CellContent } from './CellContent';
import { HScrollFade } from './HScrollFade';
import type {
  UnitCircleFigure,
  TransformationFigure,
  InequalityGraphFigure,
  SentenceDiagramFigure,
  ArgumentFigure,
  HistoricalTimelineFigure,
  GovernmentBranchesFigure,
  ComparisonTableFigure,
  OrganizerFigure,
  HierarchyPyramidFigure,
  ComplexPlaneFigure,
  PlotDiagramFigure,
  RhetoricalTriangleFigure,
  RhetoricalAppeal,
  CharacterWebFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import {
  rhetoricalTriangleFeatureNames,
  characterWebFeatureNames,
  comparisonTableFeatureNames,
  tChartFeatureNames,
  kwlChartFeatureNames,
  frayerModelFeatureNames,
  argumentStructureFeatureNames,
  governmentBranchesFeatureNames,
  sentenceDiagramFeatureNames,
  historicalTimelineFeatureNames,
  hierarchyPyramidFeatureNames,
  unitCircleFeatureNames,
  transformationFeatureNames,
  inequalityGraphFeatureNames,
  complexPlaneFeatureNames,
  plotDiagramFeatureNames,
  PLOT_STAGES,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import { parseTimelineYear, estTextWidth, wrapTextToWidth } from '@/lib/tutor/diagrams/catalog/kinds/historical-timeline-layout';
import { TimelineCardsFigure } from './TimelineRenderer';

// ── Shared helpers for the maths figures in this file ─────────────────────
type LBox = { x: number; y: number; w: number; h: number; wt?: number };
const lboxHit = (a: LBox, b: LBox) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const textW = (s: string, fontSize: number) => Math.max(1, s.length) * fontSize * 0.58;
/** Boxes along a segment, so a label can be kept off a drawn line. */
function segBoxes(x1: number, y1: number, x2: number, y2: number, t = 6): LBox[] {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(1, Math.ceil(len / 8));
  const out: LBox[] = [];
  for (let i = 0; i <= n; i++) {
    const x = x1 + ((x2 - x1) * i) / n, y = y1 + ((y2 - y1) * i) / n;
    out.push({ x: x - t / 2, y: y - t / 2, w: t, h: t });
  }
  return out;
}
/** Pick the candidate centre whose text box overlaps the fewest taken boxes
 *  (earlier candidates win ties) and stays inside the frame; claims the box. */
function placeLabel(
  taken: LBox[], cands: Array<{ x: number; y: number }>, w: number, h: number, frame: LBox,
): { x: number; y: number } {
  let best = cands[0], bestScore = Infinity;
  for (const c of cands) {
    const cxm = Math.min(Math.max(c.x, frame.x + w / 2 + 2), frame.x + frame.w - w / 2 - 2);
    const cym = Math.min(Math.max(c.y, frame.y + h / 2 + 2), frame.y + frame.h - h / 2 - 2);
    const b = { x: cxm - w / 2, y: cym - h / 2, w, h };
    let score = Math.hypot(cxm - c.x, cym - c.y) > 0.5 ? 0.5 : 0;
    for (const t of taken) if (lboxHit(b, t)) score += t.wt ?? 1;
    if (score < bestScore) { bestScore = score; best = { x: cxm, y: cym }; if (score === 0) break; }
  }
  taken.push({ x: best.x - w / 2, y: best.y - h / 2, w, h, wt: 12 });
  return best;
}
const aroundPoint = (x: number, y: number, w: number, h: number, gap = 7): Array<{ x: number; y: number }> => [
  { x: x + gap + w / 2, y: y - gap - h / 2 }, { x: x - gap - w / 2, y: y - gap - h / 2 },
  { x: x + gap + w / 2, y: y + gap + h / 2 }, { x: x - gap - w / 2, y: y + gap + h / 2 },
  { x, y: y - gap - h / 2 - 2 }, { x, y: y + gap + h / 2 + 2 },
  { x: x + gap + w / 2 + 2, y }, { x: x - gap - w / 2 - 2, y },
  // second ring, for a crowded neighbourhood
  { x: x + gap * 3 + w / 2, y: y - gap * 3 - h / 2 }, { x: x - gap * 3 - w / 2, y: y - gap * 3 - h / 2 },
  { x: x + gap * 3 + w / 2, y: y + gap * 3 + h / 2 }, { x: x - gap * 3 - w / 2, y: y + gap * 3 + h / 2 },
  { x, y: y - gap * 4 - h / 2 }, { x, y: y + gap * 4 + h / 2 },
  { x: x + gap * 4 + w / 2, y }, { x: x - gap * 4 - w / 2, y },
];
const MINUS = '−';
/** A number for a label: at most `dp` decimals, no trailing zeros, real minus sign. */
function numText(v: number, dp = 2): string {
  const r = Number(v.toFixed(dp));
  const s = String(Object.is(r, -0) ? 0 : r);
  return s.replace('-', MINUS);
}
/** 1 / 2 / 5 × 10^k step giving at most `maxTicks` intervals over `span`. */
function niceStep(span: number, maxTicks: number): number {
  const raw = span / Math.max(1, maxTicks);
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1e-12))));
  for (const m of [1, 2, 5, 10]) if (m * pow >= raw - 1e-12) return m * pow;
  return 10 * pow;
}
const HALO = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' as const };

/** Exact text for a sine/cosine value at the classroom angles; null otherwise. */
function exactTrig(v: number): string | null {
  const a = Math.abs(v), sign = v < -1e-9 ? MINUS : '';
  const table: Array<[number, string]> = [[0, '0'], [0.5, '1/2'], [Math.SQRT1_2, '√2/2'], [Math.sqrt(3) / 2, '√3/2'], [1, '1']];
  for (const [n, s] of table) if (Math.abs(a - n) < 1e-9) return n === 0 ? '0' : sign + s;
  return null;
}
/** θ in radians as a multiple of π when the angle is a multiple of 15°. */
function exactRadians(deg: number): string | null {
  if (Math.abs(deg - Math.round(deg)) > 1e-9 || Math.round(deg) % 15 !== 0) return null;
  const d = Math.round(deg);
  if (d === 0) return '0';
  const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
  const k = g(Math.abs(d), 180), n = d / k, den = 180 / k;
  return `${n === 1 ? '' : n === -1 ? MINUS : numText(n)}π${den === 1 ? '' : `/${den}`}`;
}

// ── Unit circle ───────────────────────────────────────────────────────────
export function CatalogUnitCircleRenderer({ figure }: { figure: UnitCircleFigure }) {
  const { angleDegrees, showSinCos, showRadians, title } = figure;
  const N = unitCircleFeatureNames;
  const W = 480;
  const H = 430;
  const cx = W / 2;
  const cy = 176;
  const r = 124;
  const rad = (angleDegrees * Math.PI) / 180;
  const c = Math.cos(rad), s = Math.sin(rad);
  const px = cx + r * c;
  const py = cy - r * s;
  const cosExact = exactTrig(c), sinExact = exactTrig(s);
  const cosText = cosExact ?? numText(c, 3);
  const sinText = sinExact ?? numText(s, 3);
  const eq = (exact: string | null) => (exact === null ? '≈' : '=');
  const radExact = exactRadians(angleDegrees);
  const radText = radExact !== null ? `${radExact} rad` : `${numText(rad, 3)} rad`;
  const AXIS = '#94a3b8';
  // Angle arc from the positive x-axis, counter-clockwise.
  const ar = 26;
  const arcPath = angleDegrees >= 359.999
    ? ''
    : `M ${cx + ar} ${cy} A ${ar} ${ar} 0 ${angleDegrees > 180 ? 1 : 0} 0 ${cx + ar * c} ${cy - ar * s}`;
  const midA = rad / 2;
  const showTheta = angleDegrees >= 20;
  // Point coordinates sit radially outside the circle.
  const coordText = `(${cosText}, ${sinText})`;
  const coordAnchor: 'start' | 'end' | 'middle' = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
  const coordX = cx + (r + 12) * c;
  const coordY = cy - (r + 12) * s + (s < -0.3 ? 12 : s > 0.3 ? -2 : 4) + (Math.abs(s) <= 0.3 ? (s >= 0 ? -10 : 14) : 0);
  // The 1 / −1 marks: the one the point sits next to is left out (the point's
  // own coordinates say it) so the two never collide.
  const near = (deg: number) => {
    const d = Math.abs(((angleDegrees - deg + 540) % 360) - 180);
    return d < 28;
  };
  const marks = [
    { deg: 0, x: cx + r + 6, y: cy + 16, t: '1', a: 'start' as const },
    { deg: 90, x: cx + 8, y: cy - r - 7, t: '1', a: 'start' as const },
    { deg: 180, x: cx - r - 6, y: cy + 16, t: `${MINUS}1`, a: 'end' as const },
    { deg: 270, x: cx + 8, y: cy + r + 16, t: `${MINUS}1`, a: 'start' as const },
  ].filter((m) => !near(m.deg));
  const legX = Math.abs(px - cx), legY = Math.abs(py - cy);
  return (
    <div
      className="w-full flex flex-col items-center"
      data-feature={N.circle}
      data-feature-label={title || 'unit circle'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[500px]">
        {/* axes */}
        <line x1={cx - r - 34} y1={cy} x2={cx + r + 34} y2={cy} stroke={AXIS} strokeWidth={1.2} />
        <line x1={cx} y1={cy + r + 30} x2={cx} y2={cy - r - 30} stroke={AXIS} strokeWidth={1.2} />
        <polygon points={`${cx + r + 40},${cy} ${cx + r + 32},${cy - 4} ${cx + r + 32},${cy + 4}`} fill={AXIS} />
        <polygon points={`${cx},${cy - r - 36} ${cx - 4},${cy - r - 28} ${cx + 4},${cy - r - 28}`} fill={AXIS} />
        <text x={cx + r + 44} y={cy + 4} fontSize={13} fontStyle="italic" fill="#64748b">x</text>
        <text x={cx} y={cy - r - 40} fontSize={13} fontStyle="italic" fill="#64748b" textAnchor="middle">y</text>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={2} />
        {[[cx + r, cy], [cx - r, cy], [cx, cy - r], [cx, cy + r]].map(([mx, my], i) => (
          <circle key={i} cx={mx} cy={my} r={2.5} fill="#1f2937" />
        ))}
        {marks.map((m) => (
          <text key={m.deg} x={m.x} y={m.y} fontSize={12} fill="#475569" textAnchor={m.a} style={HALO}>{m.t}</text>
        ))}
        {showSinCos && (
          <g>
            <line
              x1={px} y1={py} x2={px} y2={cy}
              stroke="#16a34a" strokeWidth={2.5}
              data-feature={N.sinLine}
              data-feature-label="sin"
              data-feature-cx={px / W}
              data-feature-cy={((cy + py) / 2) / H}
              data-feature-w={20 / W}
              data-feature-h={Math.abs(cy - py) / H}
            />
            <line
              x1={cx} y1={cy} x2={px} y2={cy}
              stroke="#2563eb" strokeWidth={2.5}
              data-feature={N.cosLine}
              data-feature-label="cos"
              data-feature-cx={((cx + px) / 2) / W}
              data-feature-cy={cy / H}
              data-feature-w={Math.abs(px - cx) / W}
              data-feature-h={20 / H}
            />
            {legX >= 16 && legY >= 16 && (
              <path
                d={`M ${px - Math.sign(c) * 9} ${cy} v ${-Math.sign(s) * 9} h ${Math.sign(c) * 9}`}
                fill="none" stroke="#64748b" strokeWidth={1}
              />
            )}
          </g>
        )}
        {arcPath && <path d={arcPath} fill="none" stroke="#dc2626" strokeWidth={1.5} />}
        <line
          x1={cx} y1={cy} x2={px} y2={py}
          stroke="#dc2626" strokeWidth={2.5}
          data-feature={N.angle}
          data-feature-label={`${angleDegrees}°`}
          data-feature-cx={((cx + px) / 2) / W}
          data-feature-cy={((cy + py) / 2) / H}
          data-feature-w={Math.abs(px - cx) / W + 20 / W}
          data-feature-h={Math.abs(py - cy) / H + 20 / H}
        />
        {showTheta && (
          <text
            x={cx + (ar + 13) * Math.cos(midA)} y={cy - (ar + 13) * Math.sin(midA) + 4}
            fontSize={13} fontStyle="italic" fill="#dc2626" textAnchor="middle" style={HALO}
          >θ</text>
        )}
        {showSinCos && legX >= 34 && (
          <text
            x={(cx + px) / 2} y={s >= 0 ? cy + 17 : cy - 8}
            fontSize={12} fill="#2563eb" fontWeight={700} textAnchor="middle" style={HALO}
          >cos θ</text>
        )}
        {showSinCos && legY >= 26 && (
          <text
            x={px + (c >= 0 ? 7 : -7)} y={(cy + py) / 2 + 4}
            fontSize={12} fill="#16a34a" fontWeight={700} textAnchor={c >= 0 ? 'start' : 'end'} style={HALO}
          >sin θ</text>
        )}
        <circle
          cx={px} cy={py} r={5}
          fill="#dc2626" stroke="#fff" strokeWidth={1.5}
          data-feature={N.endpoint}
          data-feature-label="endpoint"
          data-feature-cx={px / W}
          data-feature-cy={py / H}
          data-feature-w={24 / W}
          data-feature-h={24 / H}
        />
        {showSinCos && (
          <text x={coordX} y={coordY} fontSize={12.5} fill="#1f2937" fontWeight={600} textAnchor={coordAnchor} style={HALO}>
            {coordText}
          </text>
        )}
        <text
          x={cx} y={H - 44}
          fontSize={14} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.thetaLabel}
          data-feature-label={`θ = ${angleDegrees}°`}
          data-feature-cx={cx / W}
          data-feature-cy={(H - 48) / H}
          data-feature-w={200 / W}
          data-feature-h={20 / H}
        >
          θ = {numText(angleDegrees)}°{showRadians ? ` ${radExact !== null ? '=' : '≈'} ${radText}` : ''}
        </text>
        {showSinCos && (
          <text x={cx} y={H - 20} fontSize={13.5} textAnchor="middle" fontWeight={600}>
            <tspan fill="#2563eb">cos θ {eq(cosExact)} {cosText}</tspan>
            <tspan dx={22} fill="#16a34a">sin θ {eq(sinExact)} {sinText}</tspan>
          </text>
        )}
      </svg>
    </div>
  );
}

// ── Transformation ────────────────────────────────────────────────────────
export function CatalogTransformationRenderer({ figure }: { figure: TransformationFigure }) {
  const { shape, transform, title } = figure;
  const N = transformationFeatureNames;
  const W = 520;
  const PLOT_H = 400;
  const H = PLOT_H + 50;
  const M = 26;
  // Compute transformed vertices.
  const transformed = shape.vertices.map((v) => {
    let { x, y } = v;
    if (transform.type === 'translate') {
      x += transform.tx ?? 0; y += transform.ty ?? 0;
    } else if (transform.type === 'rotate') {
      const a = ((transform.angleDeg ?? 0) * Math.PI) / 180;
      const nx = x * Math.cos(a) - y * Math.sin(a);
      const ny = x * Math.sin(a) + y * Math.cos(a);
      x = nx; y = ny;
    } else if (transform.type === 'reflect') {
      if (transform.axis === 'x') y = -y;
      if (transform.axis === 'y') x = -x;
    } else if (transform.type === 'scale') {
      x *= transform.sx ?? 1; y *= transform.sy ?? 1;
    }
    return { x, y };
  });
  // Window: both shapes and the origin, on one equal scale, snapped to the grid.
  const all = [...shape.vertices, ...transformed, { x: 0, y: 0 }];
  const dMinX = Math.min(...all.map((v) => v.x)), dMaxX = Math.max(...all.map((v) => v.x));
  const dMinY = Math.min(...all.map((v) => v.y)), dMaxY = Math.max(...all.map((v) => v.y));
  const dataSpan = Math.max(dMaxX - dMinX, dMaxY - dMinY, 1e-6);
  const step = Math.max(niceStep(dataSpan * 1.25, 12), dataSpan > 4 ? 1 : niceStep(dataSpan, 8));
  let x0 = Math.floor(dMinX / step - 0.75) * step, x1 = Math.ceil(dMaxX / step + 0.75) * step;
  let y0 = Math.floor(dMinY / step - 0.75) * step, y1 = Math.ceil(dMaxY / step + 0.75) * step;
  // Pad the shorter direction so the plot fills its box at an equal scale.
  const boxAspect = (W - 2 * M) / (PLOT_H - 2 * M);
  while ((x1 - x0) / (y1 - y0) < boxAspect - 1e-9) { if ((x1 + x0) / 2 <= (dMinX + dMaxX) / 2) x1 += step; else x0 -= step; }
  while ((x1 - x0) / (y1 - y0) > boxAspect + step / (y1 - y0)) { if ((y1 + y0) / 2 <= (dMinY + dMaxY) / 2) y1 += step; else y0 -= step; }
  const scale = Math.min((W - 2 * M) / (x1 - x0), (PLOT_H - 2 * M) / (y1 - y0));
  const offX = (W - (x1 - x0) * scale) / 2, offY = (PLOT_H - (y1 - y0) * scale) / 2;
  const px = (x: number) => offX + (x - x0) * scale;
  const py = (y: number) => offY + (y1 - y) * scale;
  const xs: number[] = []; for (let v = x0; v <= x1 + step * 1e-6; v += step) xs.push(Number(v.toFixed(8)));
  const ys: number[] = []; for (let v = y0; v <= y1 + step * 1e-6; v += step) ys.push(Number(v.toFixed(8)));
  const labelEvery = Math.max(1, Math.ceil(26 / (step * scale)));
  const path = (verts: Array<{ x: number; y: number }>) =>
    `M ${verts.map((v) => `${px(v.x)} ${py(v.y)}`).join(' L ')} Z`;
  const bboxFrac = (verts: Array<{ x: number; y: number }>) => {
    const sx = verts.map((v) => px(v.x));
    const sy = verts.map((v) => py(v.y));
    const minX = Math.min(...sx), maxX = Math.max(...sx), minY = Math.min(...sy), maxY = Math.max(...sy);
    return { cx: ((minX + maxX) / 2) / W, cy: ((minY + maxY) / 2) / H, w: (maxX - minX + 12) / W, h: (maxY - minY + 12) / H };
  };
  const preBox = bboxFrac(shape.vertices);
  const imgBox = bboxFrac(transformed);
  // Vertex letters, pushed outward from each shape's centre; left off a shape
  // too small on the board for its letters to stay apart.
  const frame: LBox = { x: 0, y: 0, w: W, h: PLOT_H };
  const taken: LBox[] = [];
  const edgeBoxes = (verts: Array<{ x: number; y: number }>) =>
    verts.flatMap((v, i) => { const n = verts[(i + 1) % verts.length]; return segBoxes(px(v.x), py(v.y), px(n.x), py(n.y)); });
  taken.push(...edgeBoxes(shape.vertices), ...edgeBoxes(transformed));
  xs.forEach((v, i) => { if (Math.abs(v) > step * 1e-6 && Math.round(v / step) % labelEvery === 0 && i > 0 && i < xs.length - 1) taken.push({ x: px(v) - 11, y: py(0) + 3, w: 22, h: 13 }); });
  ys.forEach((v, i) => { if (Math.abs(v) > step * 1e-6 && Math.round(v / step) % labelEvery === 0 && i > 0 && i < ys.length - 1) taken.push({ x: px(0) - 26, y: py(v) - 7, w: 23, h: 13 }); });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const roomy = (verts: Array<{ x: number; y: number }>) => {
    let min = Infinity;
    for (let i = 0; i < verts.length; i++) for (let j = i + 1; j < verts.length; j++) {
      min = Math.min(min, Math.hypot(px(verts[i].x) - px(verts[j].x), py(verts[i].y) - py(verts[j].y)));
    }
    return min >= 22 && verts.length <= 26;
  };
  const vertexLabels = (verts: Array<{ x: number; y: number }>, prime: boolean, color: string) => {
    if (!roomy(verts)) return [];
    const mx = verts.reduce((a, v) => a + px(v.x), 0) / verts.length;
    const my = verts.reduce((a, v) => a + py(v.y), 0) / verts.length;
    return verts.map((v, i) => {
      const t = letters[i] + (prime ? '′' : '');
      const w = textW(t, 13), h = 14;
      const vx = px(v.x), vy = py(v.y);
      const d = Math.hypot(vx - mx, vy - my) || 1;
      const ux = (vx - mx) / d, uy = (vy - my) / d;
      const out = { x: vx + ux * (9 + w / 2), y: vy + uy * (9 + h / 2) };
      const pos = placeLabel(taken, [out, ...aroundPoint(vx, vy, w, h, 5)], w, h, frame);
      return { t, color, ...pos };
    });
  };
  const preLabels = vertexLabels(shape.vertices, false, '#1d4ed8');
  const imgLabels = vertexLabels(transformed, true, '#b91c1c');
  // What moved where: one guide from the first vertex to its image.
  const a0 = shape.vertices[0], b0 = transformed[0];
  const moved = Math.hypot(px(a0.x) - px(b0.x), py(a0.y) - py(b0.y)) > 14;
  const GUIDE = '#6b7280';
  const isUniform = transform.type === 'scale' && (transform.sx ?? 1) === (transform.sy ?? 1);
  let caption: string = transform.type;
  if (transform.type === 'translate') caption = `translate by (${numText(transform.tx ?? 0)}, ${numText(transform.ty ?? 0)})`;
  else if (transform.type === 'rotate') caption = `rotate ${numText(Math.abs(transform.angleDeg ?? 0))}° ${(transform.angleDeg ?? 0) < 0 ? 'clockwise' : 'counter-clockwise'} about the origin`;
  else if (transform.type === 'reflect') caption = `reflect over the ${transform.axis ?? 'x'}-axis`;
  else if (transform.type === 'scale') caption = isUniform
    ? `dilate by scale factor ${numText(transform.sx ?? 1)} about the origin`
    : `stretch ×${numText(transform.sx ?? 1)} across, ×${numText(transform.sy ?? 1)} up`;
  const ox = px(0), oy = py(0);
  return (
    <div
      className="w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || `${transform.type} transformation`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        <defs>
          <marker id="tf-guide-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0.5 L7,4 L0,7.5 z" fill={GUIDE} />
          </marker>
        </defs>
        {/* grid */}
        {xs.map((v) => <line key={`gx${v}`} x1={px(v)} y1={py(y0)} x2={px(v)} y2={py(y1)} stroke="#e5e7eb" strokeWidth={1} />)}
        {ys.map((v) => <line key={`gy${v}`} x1={px(x0)} y1={py(v)} x2={px(x1)} y2={py(v)} stroke="#e5e7eb" strokeWidth={1} />)}
        {/* axes */}
        <line x1={px(x0)} y1={oy} x2={px(x1)} y2={oy} stroke="#64748b" strokeWidth={1.4} />
        <line x1={ox} y1={py(y0)} x2={ox} y2={py(y1)} stroke="#64748b" strokeWidth={1.4} />
        <text x={px(x1) + 6} y={oy + 4} fontSize={12} fontStyle="italic" fill="#64748b">x</text>
        <text x={ox} y={py(y1) - 6} fontSize={12} fontStyle="italic" fill="#64748b" textAnchor="middle">y</text>
        {xs.map((v, i) => (Math.abs(v) > step * 1e-6 && Math.round(v / step) % labelEvery === 0 && i > 0 && i < xs.length - 1) && (
          <text key={`tx${v}`} x={px(v)} y={oy + 13} fontSize={10.5} fill="#64748b" textAnchor="middle" style={HALO}>{numText(v, 6)}</text>
        ))}
        {ys.map((v, i) => (Math.abs(v) > step * 1e-6 && Math.round(v / step) % labelEvery === 0 && i > 0 && i < ys.length - 1) && (
          <text key={`ty${v}`} x={ox - 5} y={py(v) + 3.5} fontSize={10.5} fill="#64748b" textAnchor="end" style={HALO}>{numText(v, 6)}</text>
        ))}
        {/* the mirror line, when there is one */}
        {transform.type === 'reflect' && (transform.axis === 'x' || transform.axis === 'y') && (
          transform.axis === 'y'
            ? <line x1={ox} y1={py(y0)} x2={ox} y2={py(y1)} stroke="#7c3aed" strokeWidth={2} strokeDasharray="7 4" />
            : <line x1={px(x0)} y1={oy} x2={px(x1)} y2={oy} stroke="#7c3aed" strokeWidth={2} strokeDasharray="7 4" />
        )}
        {/* Pre-image */}
        <path
          d={path(shape.vertices)}
          fill="rgba(59, 130, 246, 0.18)" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round"
          data-feature={N.preimage}
          data-feature-label="pre-image"
          data-feature-cx={preBox.cx}
          data-feature-cy={preBox.cy}
          data-feature-w={preBox.w}
          data-feature-h={preBox.h}
        />
        {/* Image */}
        <path
          d={path(transformed)}
          fill="rgba(220, 38, 38, 0.16)" stroke="#dc2626" strokeWidth={2} strokeLinejoin="round"
          data-feature={N.image}
          data-feature-label="image"
          data-feature-cx={imgBox.cx}
          data-feature-cy={imgBox.cy}
          data-feature-w={imgBox.w}
          data-feature-h={imgBox.h}
        />
        {/* guides */}
        {moved && (transform.type === 'translate' || transform.type === 'reflect') && (
          <line x1={px(a0.x)} y1={py(a0.y)} x2={px(b0.x)} y2={py(b0.y)} stroke={GUIDE} strokeWidth={1.2} strokeDasharray="4 3" markerEnd="url(#tf-guide-arrow)" />
        )}
        {(transform.type === 'rotate' || transform.type === 'scale') && (
          <g>
            <line x1={ox} y1={oy} x2={px(a0.x)} y2={py(a0.y)} stroke={GUIDE} strokeWidth={1} strokeDasharray="4 3" />
            <line x1={ox} y1={oy} x2={px(b0.x)} y2={py(b0.y)} stroke={GUIDE} strokeWidth={1} strokeDasharray="4 3" />
            <circle cx={ox} cy={oy} r={3.5} fill="#7c3aed" />
          </g>
        )}
        {transform.type === 'rotate' && moved && (() => {
          const ra = Math.min(34, Math.hypot(px(a0.x) - ox, py(a0.y) - oy) * 0.6);
          const t0 = Math.atan2(a0.y, a0.x), turn = ((transform.angleDeg ?? 0) * Math.PI) / 180;
          const t1 = t0 + turn;
          if (ra < 10 || Math.abs(turn) < 0.05) return null;
          return (
            <path
              d={`M ${ox + ra * Math.cos(t0)} ${oy - ra * Math.sin(t0)} A ${ra} ${ra} 0 ${Math.abs(turn) > Math.PI ? 1 : 0} ${turn > 0 ? 0 : 1} ${ox + ra * Math.cos(t1)} ${oy - ra * Math.sin(t1)}`}
              fill="none" stroke="#7c3aed" strokeWidth={1.4} markerEnd="url(#tf-guide-arrow)"
            />
          );
        })()}
        {[...preLabels, ...imgLabels].map((l, i) => (
          <text key={i} x={l.x} y={l.y + 4.5} fontSize={13} fontWeight={700} fill={l.color} textAnchor="middle" style={HALO}>{l.t}</text>
        ))}
        {/* key + what was done, under the grid */}
        <g>
          <rect x={W / 2 - 150} y={PLOT_H + 3} width={12} height={12} fill="rgba(59, 130, 246, 0.18)" stroke="#3b82f6" strokeWidth={1.5} />
          <text x={W / 2 - 133} y={PLOT_H + 13.5} fontSize={12} fill="#1d4ed8" fontWeight={700}>pre-image</text>
          <rect x={W / 2 - 50} y={PLOT_H + 3} width={12} height={12} fill="rgba(220, 38, 38, 0.16)" stroke="#dc2626" strokeWidth={1.5} />
          <text x={W / 2 - 33} y={PLOT_H + 13.5} fontSize={12} fill="#b91c1c" fontWeight={700}>image</text>
          {transform.type === 'reflect' && (
            <>
              <line x1={W / 2 + 28} y1={PLOT_H + 9} x2={W / 2 + 50} y2={PLOT_H + 9} stroke="#7c3aed" strokeWidth={2} strokeDasharray="7 4" />
              <text x={W / 2 + 56} y={PLOT_H + 13.5} fontSize={12} fill="#6d28d9" fontWeight={700}>mirror line</text>
            </>
          )}
          {(transform.type === 'rotate' || transform.type === 'scale') && (
            <>
              <circle cx={W / 2 + 36} cy={PLOT_H + 9} r={3.5} fill="#7c3aed" />
              <text x={W / 2 + 46} y={PLOT_H + 13.5} fontSize={12} fill="#6d28d9" fontWeight={700}>centre</text>
            </>
          )}
        </g>
        <text
          x={W / 2} y={H - 10}
          fontSize={13.5} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.transformLabel}
          data-feature-label={transform.type}
          data-feature-cx={0.5}
          data-feature-cy={(H - 14) / H}
          data-feature-w={300 / W}
          data-feature-h={20 / H}
        >
          {caption}
        </text>
      </svg>
    </div>
  );
}

// ── Inequality graph ──────────────────────────────────────────────────────
export function CatalogInequalityGraphRenderer({ figure }: { figure: InequalityGraphFigure }) {
  const { variable, operator, value, title } = figure;
  const N = inequalityGraphFeatureNames;
  const W = 600;
  const H = 150;
  const cy = 62;
  const PAD = 50;
  const usableW = W - PAD * 2;
  // Window: small bounds keep 0 in view; a far or fractional bound gets about
  // ten ticks of a round step around it, so the ticks never smear together.
  const av = Math.abs(value);
  const isInt = Math.abs(value - Math.round(value)) < 1e-9;
  let step = 1;
  if (!isInt && av < 1) step = Math.pow(10, Math.floor(Math.log10(av)));
  let lo: number, hi: number;
  if (av <= 7 && step === 1) {
    const half = Math.max(av + 3, 5);
    lo = Math.floor(value - half); hi = Math.ceil(value + half);
  } else {
    lo = Math.floor((value - 5 * step) / step + 1e-9) * step;
    hi = Math.ceil((value + 5 * step) / step - 1e-9) * step;
  }
  const xOf = (v: number) => PAD + ((v - lo) / (hi - lo)) * usableW;
  const valueX = xOf(value);
  const includeEq = operator === '<=' || operator === '>=';
  const direction = operator === '<' || operator === '<=' ? -1 : 1;
  const nTicks = Math.round((hi - lo) / step);
  const dp = step < 1 ? Math.min(8, Math.ceil(-Math.log10(step))) : 0;
  const ticks: number[] = [];
  for (let i = 0; i <= nTicks; i++) ticks.push(Number((lo + i * step).toFixed(dp + 2)));
  const widest = Math.max(...ticks.map((t) => textW(numText(t, dp), 12)));
  const labelEvery = Math.max(1, Math.ceil((widest + 10) / (usableW / Math.max(1, nTicks))));
  const lineL = PAD - 16, lineR = W - PAD + 16;
  const rayEndX = direction > 0 ? lineR : lineL;
  const opText = operator === '<=' ? '≤' : operator === '>=' ? '≥' : operator;
  const valueText = numText(value, 8);
  const onTick = ticks.some((t, i) => Math.abs(t - value) < step * 1e-6 && i % labelEvery === 0);
  const RED = '#dc2626';
  return (
    <div
      className="w-full flex flex-col items-center"
      data-feature={N.numberLine}
      data-feature-label={title || 'number line'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        <line x1={lineL} y1={cy} x2={lineR} y2={cy} stroke="#1f2937" strokeWidth={2} />
        <polygon points={`${lineL - 8},${cy} ${lineL + 2},${cy - 5.5} ${lineL + 2},${cy + 5.5}`} fill={direction < 0 ? RED : '#1f2937'} />
        <polygon points={`${lineR + 8},${cy} ${lineR - 2},${cy - 5.5} ${lineR - 2},${cy + 5.5}`} fill={direction > 0 ? RED : '#1f2937'} />
        {ticks.map((t, i) => {
          const x = xOf(t);
          return (
            <g key={i}>
              <line x1={x} y1={cy - 6} x2={x} y2={cy + 6} stroke="#1f2937" strokeWidth={1.5} />
              {i % labelEvery === 0 && (
                <text x={x} y={cy + 23} fontSize={12} textAnchor="middle" fill="#374151">{numText(t, dp)}</text>
              )}
            </g>
          );
        })}
        {/* Ray */}
        <line
          x1={valueX} y1={cy} x2={rayEndX} y2={cy}
          stroke={RED} strokeWidth={4}
          data-feature={N.ray}
          data-feature-label="solution ray"
          data-feature-cx={((valueX + rayEndX) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={Math.abs(rayEndX - valueX) / W}
          data-feature-h={20 / H}
        />
        {/* Endpoint */}
        <circle
          cx={valueX} cy={cy} r={7}
          fill={includeEq ? RED : '#fff'} stroke={RED} strokeWidth={2.5}
          data-feature={N.endpoint}
          data-feature-label={`endpoint at ${value}`}
          data-feature-cx={valueX / W}
          data-feature-cy={cy / H}
          data-feature-w={24 / W}
          data-feature-h={24 / H}
        />
        {!onTick && (
          <text x={valueX} y={cy - 15} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={RED}>{valueText}</text>
        )}
        <text
          x={W / 2} y={H - 16}
          fontSize={15} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.inequalityLabel}
          data-feature-label={`${variable} ${operator} ${value}`}
          data-feature-cx={0.5}
          data-feature-cy={(H - 20) / H}
          data-feature-w={200 / W}
          data-feature-h={20 / H}
        >
          {variable} {opText} {valueText}
        </text>
      </svg>
    </div>
  );
}

// ── Sentence diagram ──────────────────────────────────────────────────────
// Reed–Kellogg: subject | verb | object on one baseline (the subject–verb bar crosses the line, the
// verb–object bar stops at it), each modifier on its own slanted line under the word it modifies, in the
// order given. Slots are sized to their word and to the number of slants hanging from them, so nothing
// overprints (three modifiers on one word used to print on top of each other, on two fixed tails).
export function CatalogSentenceDiagramRenderer({ figure }: { figure: SentenceDiagramFigure }) {
  const { subject, verb, object, modifiers, title } = figure;
  const N = sentenceDiagramFeatureNames;
  const WORD_FS = 17;
  const MOD_FS = 13.5;
  const SLANT_GAP = 30;            // along the baseline, between two slants
  const ANG = (52 * Math.PI) / 180; // slant below the horizontal
  const MARGIN = 28;
  const baseY = 62;

  const slotKeys = (object ? ['subject', 'verb', 'object'] : ['subject', 'verb']) as Array<'subject' | 'verb' | 'object'>;
  const words: Record<'subject' | 'verb' | 'object', string> = { subject, verb, object: object ?? '' };
  const mods = (modifiers ?? []).map((m, i) => ({ ...m, i }));
  // A modifier of an object that is not there hangs from the verb rather than vanishing.
  const modsOf = (k: 'subject' | 'verb' | 'object') => mods.filter((m) => (m.attachTo === 'object' && !object ? 'verb' : m.attachTo) === k);

  let cursor = MARGIN;
  const slots = slotKeys.map((k) => {
    const list = modsOf(k);
    const wordW = estTextWidth(words[k], WORD_FS, true);
    const w = Math.max(wordW + 44, list.length * SLANT_GAP + 34, 120);
    const x0 = cursor;
    cursor += w;
    // Slants are centred as a group under the word.
    const first = x0 + w / 2 - ((list.length - 1) * SLANT_GAP) / 2 - 8;
    const slants = list.map((m, j) => {
      const len = estTextWidth(m.word, MOD_FS) + 22;
      const sx = first + j * SLANT_GAP;
      return { ...m, sx, len, ex: sx + len * Math.cos(ANG), ey: baseY + len * Math.sin(ANG) };
    });
    return { k, x0, w, slants };
  });
  const lineEnd = cursor;
  const allSlants = slots.flatMap((sl) => sl.slants);
  const W = Math.max(lineEnd + MARGIN, ...allSlants.map((sl) => sl.ex + 16));
  const H = Math.max(baseY + 34, ...allSlants.map((sl) => sl.ey + 14));
  const featName = { subject: N.subject, verb: N.verb, object: N.object };
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(760, W * 1.3) }}
        data-feature={N.diagram}
        data-feature-label={title || 'sentence diagram'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* Base line */}
        <line x1={MARGIN} y1={baseY} x2={lineEnd} y2={baseY} stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />
        {/* Subject | Verb: crosses the base line */}
        <line x1={slots[1].x0} y1={baseY - 30} x2={slots[1].x0} y2={baseY + 22} stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />
        {/* Verb | Object: stops at the base line */}
        {slots[2] && <line x1={slots[2].x0} y1={baseY - 26} x2={slots[2].x0} y2={baseY} stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />}
        {slots.map((sl) => (
          <g
            key={sl.k}
            data-feature={featName[sl.k]}
            data-feature-label={words[sl.k]}
            data-feature-cx={(sl.x0 + sl.w / 2) / W}
            data-feature-cy={(baseY - 16) / H}
            data-feature-w={sl.w / W}
            data-feature-h={36 / H}
          >
            <text x={sl.x0 + sl.w / 2} y={baseY - 11} fontSize={WORD_FS} textAnchor="middle" fill="#111827" fontWeight={600}>{words[sl.k]}</text>
          </g>
        ))}
        {/* Modifiers: one slanted line each, the word written along it */}
        {allSlants.map((sl) => { const i = sl.i; return (
          <g
            key={i}
            data-feature={N.modifier(i)}
            data-feature-label={sl.word}
            data-feature-cx={((sl.sx + sl.ex) / 2) / W}
            data-feature-cy={((baseY + sl.ey) / 2) / H}
            data-feature-w={(sl.ex - sl.sx + 16) / W}
            data-feature-h={(sl.ey - baseY + 8) / H}
          >
            <line x1={sl.sx} y1={baseY} x2={sl.ex} y2={sl.ey} stroke="#475569" strokeWidth={1.5} strokeLinecap="round" />
            <text
              transform={`translate(${sl.sx}, ${baseY}) rotate(${(ANG * 180) / Math.PI})`}
              x={13} y={-5} fontSize={MOD_FS} fill="#334155"
            >
              {sl.word}
            </text>
          </g>
        ); })}
      </svg>
    </div>
  );
}

// ── Argument structure ────────────────────────────────────────────────────
export function CatalogArgumentStructureRenderer({ figure }: { figure: ArgumentFigure }) {
  const { claim, evidence, reasoning, counter, rebuttal, title } = figure;
  const N = argumentStructureFeatureNames;
  return (
    <div data-feature={N.argument} className="w-full flex flex-col items-center gap-3">
      {title && <div className="text-base font-semibold text-gray-800"><InlineMathText text={title} /></div>}
      <div data-feature={N.claim} data-feature-label="Claim" className="px-5 py-3 rounded-lg bg-blue-50 border-2 border-blue-400 max-w-[600px] w-full">
        <div className="text-xs font-bold uppercase text-blue-700 mb-1">Claim</div>
        <div className="text-base text-blue-900">{claim}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[640px] w-full">
        <div data-feature={N.evidence} data-feature-label="Evidence" className="p-3 rounded-lg bg-green-50 border border-green-300">
          <div className="text-xs font-bold uppercase text-green-700 mb-1">Evidence</div>
          <ul className="text-sm text-green-900 list-disc list-outside pl-5 space-y-1">
            {evidence.map((e, i) => <li key={i} data-feature={N.evidenceItem(i)} data-feature-label={e}>{e}</li>)}
          </ul>
        </div>
        <div data-feature={N.reasoning} data-feature-label="Reasoning" className="p-3 rounded-lg bg-amber-50 border border-amber-300">
          <div className="text-xs font-bold uppercase text-amber-700 mb-1">Reasoning</div>
          <ul className="text-sm text-amber-900 list-disc list-outside pl-5 space-y-1">
            {reasoning.map((r, i) => <li key={i} data-feature={N.reasoningItem(i)} data-feature-label={r}>{r}</li>)}
          </ul>
        </div>
      </div>
      {counter && (
        <div data-feature={N.counter} data-feature-label="Counterargument" className="p-3 rounded-lg bg-rose-50 border border-rose-300 max-w-[600px] w-full">
          <div className="text-xs font-bold uppercase text-rose-700 mb-1">Counterargument</div>
          <div className="text-sm text-rose-900">{counter}</div>
          {rebuttal && (
            <div data-feature={N.rebuttal} data-feature-label="Rebuttal" className="mt-2">
              <div className="text-xs font-bold uppercase text-rose-700 mb-1">Rebuttal</div>
              <div className="text-sm text-rose-900">{rebuttal}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Historical timeline ───────────────────────────────────────────────────
export function CatalogHistoricalTimelineRenderer({ figure }: { figure: HistoricalTimelineFigure }) {
  const { events, title } = figure;
  const N = historicalTimelineFeatureNames;
  // Drawing and layout are shared with show_timeline (TimelineCardsFigure, historical-timeline-layout.ts):
  // cards sized to their wrapped text in lanes above and below the axis, vertical leaders, no overlaps.
  // A named month orders events inside one year, unless the caller gave `year` itself.
  const when = (e: { date: string; year: number }): number => {
    const p = parseTimelineYear(e.date);
    return p !== null && Math.trunc(p) === e.year ? p : e.year;
  };
  const cards = React.useMemo(
    () => events.map((e) => ({ date: e.date, title: e.label, description: e.description, year: when(e), color: e.color || '#2563eb' })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events],
  );
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <div
        className="w-full"
        style={{ maxWidth: 820 }}
        data-feature={N.timeline}
        data-feature-label={title || 'timeline'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <TimelineCardsFigure
          events={cards}
          // Only a date with no readable year forces the given order; a dense span is the layout's own call.
          forceEven={figure.ordinal ?? (figure.evenSpace && events.some((e, i) => e.year === i))}
          maxWidth={820}
          wrapAxis={(box, d, children) => (
            <g
              data-feature={N.axis}
              data-feature-label="timeline axis"
              data-feature-cx={box.cx / d.width}
              data-feature-cy={box.cy / d.height}
              data-feature-w={box.w / d.width}
              data-feature-h={0.05}
            >
              {children}
            </g>
          )}
          wrapEvent={(i, box, d, children) => (
            <g
              data-feature={N.event(i)}
              data-feature-label={`${events[i].date} ${events[i].label}`}
              data-feature-cx={box.cx / d.width}
              data-feature-cy={box.cy / d.height}
              data-feature-w={box.w / d.width}
              data-feature-h={box.h / d.height}
            >
              {children}
            </g>
          )}
        />
      </div>
    </div>
  );
}

// ── Government branches ───────────────────────────────────────────────────
export function CatalogGovernmentBranchesRenderer({ figure }: { figure: GovernmentBranchesFigure }) {
  const { country, branches, title } = figure;
  const N = governmentBranchesFeatureNames;
  const PALETTE = ['#3b82f6', '#16a34a', '#dc2626', '#8b5cf6'];
  return (
    <div data-feature={N.branches} className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <div data-feature={N.country} data-feature-label={country} className="text-sm text-gray-600 mb-3">{country}</div>
      {/* Columns follow the count, so no branch is left alone on a second row (four used to be 3 + 1). */}
      <div
        className="grid gap-3 max-w-[760px] w-full"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${branches.length === 4 || branches.length === 2 ? 280 : 200}px, 1fr))` }}
      >
        {branches.map((b, i) => {
          const color = PALETTE[i % PALETTE.length];
          return (
            <div key={i} data-feature={N.branch(i)} data-feature-label={b.name} className="p-3 rounded-lg border-2" style={{ background: color + '11', borderColor: color }}>
              <div className="font-bold leading-snug mb-1" style={{ color }}>{b.name}</div>
              {b.bodies && b.bodies.length > 0 && (
                <div data-feature={N.branchBodies(i)} data-feature-label={`${b.name} bodies`} className="text-xs text-gray-700 mb-1">
                  <span className="font-semibold">Bodies: </span>
                  {b.bodies.join(', ')}
                </div>
              )}
              {b.powers && b.powers.length > 0 && (
                <ul data-feature={N.branchPowers(i)} data-feature-label={`${b.name} powers`} className="text-sm list-disc list-outside pl-5 space-y-0.5 text-gray-800">
                  {b.powers.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Comparison table ──────────────────────────────────────────────────────
export function CatalogComparisonTableRenderer({ figure }: { figure: ComparisonTableFigure }) {
  const { items, attributes, cells, title } = figure;
  const N = comparisonTableFeatureNames;
  // W1 fix: an unconstrained wide table inside `items-center` used to
  // flex-center and get double-edge-clipped by the board's
  // `overflow-x-hidden` ancestor, with no way to reach the rest (live
  // session screenshot IMG_7807). The `w-full` wrapper below with
  // `overflow-x-auto` keeps a wide table reachable via scroll. Round-7
  // item 7 removed the useFitScale shrink that used to sit in front of
  // the scroll (floor 0.6 halved the text on phones while every other
  // card stayed full-size): tables are the semantically-scrollable case —
  // full-size text, scroll when wide.
  // data-feature values come from the SHARED naming helper that
  // buildComparisonTableManifest also calls — manifest names and DOM
  // attrs cannot drift by construction. Attribute name is `data-feature`
  // (matches the project-wide convention; WhiteboardCanvas overlay
  // queries `[data-feature="..."]` at line ~1083). See
  // src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social.ts.
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <HScrollFade hint hintClassName="w-full" className="w-full max-w-full overflow-x-auto">
        <table data-feature={N.table} className="border-collapse text-sm mx-auto">
          <thead>
            <tr data-feature={N.headerRow}>
              <th className="px-3 py-2 border border-gray-400 bg-gray-100"></th>
              {items.map((it, i) => (
                <th
                  key={i}
                  data-feature={N.col(i)}
                  data-feature-label={it}
                  className="px-3 py-2 border border-gray-400 bg-blue-50 font-semibold text-blue-900"
                >
                  <CellContent value={it} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, ri) => (
              <tr key={ri} data-feature={N.row(ri)} data-feature-label={attr}>
                <th className="px-3 py-2 border border-gray-400 bg-amber-50 font-semibold text-amber-900 text-left"><CellContent value={attr} /></th>
                {cells[ri].map((c, ci) => (
                  <td
                    key={ci}
                    data-feature={N.cell(ri, ci)}
                    data-feature-label={`${items[ci]} / ${attr}`}
                    className="px-3 py-2 border border-gray-300"
                  >
                    <CellContent value={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </HScrollFade>
    </div>
  );
}

// ── Organizers (T-chart, KWL, Frayer) ─────────────────────────────────────
export function CatalogOrganizerRenderer({ figure }: { figure: OrganizerFigure }) {
  if (figure.kind === 't_chart') return <TChart figure={figure} />;
  if (figure.kind === 'kwl_chart') return <KWLChart figure={figure} />;
  return <FrayerModel figure={figure} />;
}

function TChart({ figure }: { figure: OrganizerFigure }) {
  const N = tChartFeatureNames;
  const rows = Math.max(figure.leftItems?.length || 0, figure.rightItems?.length || 0);
  // W1 fix: this grid is already `w-full` (forced to fill its flex
  // parent), so a normal-length item never overflows — but an UNBREAKABLE
  // long token (a URL, a chemical formula with no spaces) can still force
  // a grid track wider than its `1fr` share via CSS's min-content
  // constraint, blowing the whole grid out past its own `w-full` box
  // (classic grid/flex "1fr overflow" bug). `overflow-wrap: anywhere` on
  // the item/header cells below is the PRIMARY defense (lets the token
  // break instead of demanding oversized min-content); the wrapper's
  // `overflow-x-auto` catches whatever blowout still gets through
  // (round-7 item 7 removed the useFitScale shrink — organizers keep
  // full-size text and scroll like tables, no font scaling).
  // Rendered as CSS-grid divs (not <table>) so the LEFT and RIGHT
  // columns are actual DOM elements that can carry data-feature
  // markers for tutor_scribble. The previous <table> form had no
  // column-spanning element, so target="left-column" resolved
  // through the catalog but missed the DOM (observed 2026-05-13
  // session #7: 60+ "[Scribble] resolve-miss: data-feature=
  // 'left-column' not in HTML DOM" warnings as brain repeatedly
  // tried to highlight the Rights column).
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <HScrollFade hint hintClassName="w-full" className="w-full max-w-[640px] mx-auto overflow-x-auto">
        {/* CSS subgrid: both columns span the SAME parent row tracks, so paired
            rows size to the taller cell and ALIGN across columns — fixes the
            drift when one side's item wraps to more lines (2026-06-23 ear-test).
            The leftColumn/rightColumn elements are kept (scribble targets). */}
        <div
          data-feature={N.chart}
          className="grid grid-cols-2 max-w-[640px] w-full border-2 border-gray-700"
          style={{ gridTemplateRows: `repeat(${rows + 1}, auto)` }}
        >
          <div
            data-feature={N.leftColumn}
            data-feature-label={figure.leftHeader || 'Left column'}
            className="border-r-2 border-gray-700"
            style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: '1 / -1' }}
          >
            <div data-feature={N.leftHeader} data-feature-label={figure.leftHeader} className="px-3 py-2 border-b border-gray-400 bg-blue-50 font-bold text-blue-900 text-center" style={{ overflowWrap: 'anywhere' }}>{figure.leftHeader}</div>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                data-feature={N.leftItem(i)}
                data-feature-label={figure.leftItems?.[i] || ''}
                className={`px-3 py-2 ${i < rows - 1 ? 'border-b border-gray-400' : ''}`}
                style={{ overflowWrap: 'anywhere' }}
              >
                {figure.leftItems?.[i] || ''}
              </div>
            ))}
          </div>
          <div
            data-feature={N.rightColumn}
            data-feature-label={figure.rightHeader || 'Right column'}
            style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: '1 / -1' }}
          >
            <div data-feature={N.rightHeader} data-feature-label={figure.rightHeader} className="px-3 py-2 border-b border-gray-400 bg-amber-50 font-bold text-amber-900 text-center" style={{ overflowWrap: 'anywhere' }}>{figure.rightHeader}</div>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                data-feature={N.rightItem(i)}
                data-feature-label={figure.rightItems?.[i] || ''}
                className={`px-3 py-2 ${i < rows - 1 ? 'border-b border-gray-400' : ''}`}
                style={{ overflowWrap: 'anywhere' }}
              >
                {figure.rightItems?.[i] || ''}
              </div>
            ))}
          </div>
        </div>
      </HScrollFade>
    </div>
  );
}

function KWLChart({ figure }: { figure: OrganizerFigure }) {
  const N = kwlChartFeatureNames;
  // Each column needs its own data-feature (k-column / w-column / l-column)
  // and each list-item needs k-item-N / w-item-N / l-item-N. Loop iterates
  // [K, W, L] in order so column index 0=K, 1=W, 2=L.
  const columns = [
    { h: 'K — Know', label: 'Know', items: figure.know, bg: 'bg-blue-50', fg: 'text-blue-900', border: 'border-blue-400', col: N.kColumn, item: N.kItem },
    { h: 'W — Want to know', label: 'Want to know', items: figure.want, bg: 'bg-amber-50', fg: 'text-amber-900', border: 'border-amber-400', col: N.wColumn, item: N.wItem },
    { h: 'L — Learned', label: 'Learned', items: figure.learned, bg: 'bg-green-50', fg: 'text-green-900', border: 'border-green-400', col: N.lColumn, item: N.lItem },
  ];
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <div data-feature={N.chart} className="grid grid-cols-3 gap-2 max-w-[760px] w-full">
        {columns.map((col, i) => (
          <div key={i} data-feature={col.col} data-feature-label={col.label} className={`p-3 border-2 rounded ${col.bg} ${col.border}`}>
            <div className={`font-bold ${col.fg} mb-2`}>{col.h}</div>
            <ul className="list-disc list-inside text-sm space-y-1">
              {(col.items || []).map((it, j) => <li key={j} data-feature={col.item(j)} data-feature-label={it}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function FrayerModel({ figure }: { figure: OrganizerFigure }) {
  const N = frayerModelFeatureNames;
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <div data-feature={N.frayer} className="relative grid grid-cols-2 gap-0 max-w-[600px] w-full border-2 border-gray-700">
        <div data-feature={N.definition} data-feature-label="Definition" className="p-3 border-r-2 border-b-2 border-gray-700 bg-blue-50">
          <div className="font-bold text-blue-900 text-xs uppercase mb-1">Definition</div>
          <div className="text-sm">{figure.definition || '—'}</div>
        </div>
        <div data-feature={N.characteristics} data-feature-label="Characteristics" className="p-3 border-b-2 border-gray-700 bg-green-50">
          <div className="font-bold text-green-900 text-xs uppercase mb-1">Characteristics</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.characteristics || []).map((c, i) => <li key={i} data-feature={N.characteristicItem(i)} data-feature-label={c}>{c}</li>)}
          </ul>
        </div>
        <div data-feature={N.examples} data-feature-label="Examples" className="p-3 border-r-2 border-gray-700 bg-amber-50">
          <div className="font-bold text-amber-900 text-xs uppercase mb-1">Examples</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.examples || []).map((c, i) => <li key={i} data-feature={N.exampleItem(i)} data-feature-label={c}>{c}</li>)}
          </ul>
        </div>
        <div data-feature={N.nonExamples} data-feature-label="Non-examples" className="p-3 bg-rose-50">
          <div className="font-bold text-rose-900 text-xs uppercase mb-1">Non-Examples</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.nonExamples || []).map((c, i) => <li key={i} data-feature={N.nonExampleItem(i)} data-feature-label={c}>{c}</li>)}
          </ul>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Term pill is intentionally TRANSPARENT (no bg / border)
              so the rendered content beneath remains visible. The
              prior solid-white pill covered cell text in the bottom
              of the characteristics quadrant (observed 2026-05-13
              session #12 image #36 — "Provides services" was clipped
              by the "Government" pill). Bold text + light text-shadow
              gives enough separation against any quadrant color. */}
          <div
            data-feature={N.term}
            data-feature-label={figure.term}
            className="px-4 py-1 font-bold text-gray-900"
            style={{ textShadow: '0 0 4px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.8)' }}
          >
            {figure.term}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hierarchy pyramid ─────────────────────────────────────────────────────
export function CatalogHierarchyPyramidRenderer({ figure }: { figure: HierarchyPyramidFigure }) {
  const { tiers, baseFirst, title } = figure;
  // baseFirst semantics (per the HierarchyPyramidFigure docstring):
  //   true  — tiers[0] is the BASE of the pyramid (rendered at the
  //           bottom, widest). Standard for food pyramids, Maslow,
  //           Bloom's. This is the default.
  //   false — tiers[0] is the APEX (top, narrowest). Inverted use case.
  //
  // The renderer iterates `ordered` top-to-bottom (i=0 is topmost). To
  // get baseFirst=true behavior — tiers[0] at the bottom — we reverse
  // the tiers so iteration walks last → first. (Previously the
  // reverse/no-reverse was inverted relative to the docstring;
  // observed 2026-05-13 session #15 image #46: brain emitted
  // {tiers: [Producers, ..., Apex], baseFirst: true} expecting
  // Producers at the BOTTOM of a food pyramid — renderer put Producers
  // at the TOP instead.)
  const ordered = baseFirst ? [...tiers].reverse() : [...tiers];
  const N = hierarchyPyramidFeatureNames;
  const n = ordered.length;
  const LABEL_FS = 13.5, LABEL_LH = 17, DESC_FS = 12, DESC_LH = 15.5, GAP = 4;
  const TOP_W = 170, BASE_W = Math.min(460, Math.max(300, TOP_W + (n - 1) * 52));
  const DESC_W = 250;
  const hasDesc = ordered.some((t) => t.description && t.description.trim());
  // Tier widths run evenly from the apex to the base. A label wraps inside its own tier and a description
  // is written beside it (descriptions used to be dropped), so a tier is as tall as its text needs.
  const rows = ordered.map((t, i) => {
    const w = n === 1 ? BASE_W : TOP_W + ((BASE_W - TOP_W) * i) / (n - 1);
    const label = wrapTextToWidth(t.label, w - 24, LABEL_FS, 6, true);
    const desc = t.description && t.description.trim() ? wrapTextToWidth(t.description, DESC_W, DESC_FS, 4) : [];
    const h = Math.max(46, label.length * LABEL_LH + 18, desc.length * DESC_LH + 12);
    return { t, w, label, desc, h };
  });
  const PAD = 14;
  const pyrCx = PAD + BASE_W / 2;
  const descX = PAD + BASE_W + 30;
  // The description column is as wide as its longest line, so the whole figure stays centred on the card.
  const descUsed = Math.max(0, ...rows.flatMap((r) => r.desc.map((l) => estTextWidth(l, DESC_FS))));
  const W = hasDesc ? descX + descUsed + PAD : BASE_W + PAD * 2;
  let yCursor = PAD;
  const laid = rows.map((r) => { const y = yCursor; yCursor += r.h + GAP; return { ...r, y }; });
  const H = yCursor - GAP + PAD;
  // One hue, deepest at the apex (six unrelated colours said nothing about the order). An explicit tier
  // colour from the caller still wins.
  const ramp = (i: number): string => {
    const f = n === 1 ? 0 : i / (n - 1);
    const from = [30, 58, 138], to = [59, 130, 246];
    return `rgb(${from.map((c, k) => Math.round(c + (to[k] - c) * f)).join(', ')})`;
  };
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(780, W * 1.1) }}
        data-feature={N.pyramid}
        data-feature-label={title || 'pyramid'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {laid.map((r, i) => {
          const x = pyrCx - r.w / 2;
          const color = r.t.color || ramp(i);
          const midY = r.y + r.h / 2;
          const cxFrac = pyrCx / W;
          const w = r.w;
          return (
            <g
              key={i}
              data-feature={N.tier(i)}
              data-feature-label={r.t.label}
              data-feature-cx={cxFrac}
              data-feature-cy={midY / H}
              data-feature-w={w / W}
              data-feature-h={r.h / H}
            >
              <rect x={x} y={r.y} width={r.w} height={r.h} rx={5} fill={color} />
              {r.label.map((line, k) => (
                <text key={k} x={pyrCx} y={midY - ((r.label.length - 1) * LABEL_LH) / 2 + k * LABEL_LH + LABEL_FS * 0.36} fontSize={LABEL_FS} textAnchor="middle" fill="#fff" fontWeight={700}>
                  {line}
                </text>
              ))}
              {r.desc.length > 0 && (
                <>
                  <line x1={x + r.w + 5} y1={midY} x2={descX - 8} y2={midY} stroke="#cbd5e1" strokeWidth={1.25} />
                  {r.desc.map((line, k) => (
                    <text key={`d${k}`} x={descX} y={midY - ((r.desc.length - 1) * DESC_LH) / 2 + k * DESC_LH + DESC_FS * 0.36} fontSize={DESC_FS} fill="#475569">
                      {line}
                    </text>
                  ))}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Complex plane (Argand diagram) ──────────────────────────────────────────
export function CatalogComplexPlaneRenderer({ figure }: { figure: ComplexPlaneFigure }) {
  const N = complexPlaneFeatureNames;
  const { points, range, title } = figure;
  const W = 480;
  const H = 480;
  const pad = 40;
  const cx = W / 2;
  const cy = H / 2;
  const span = W - 2 * pad;
  const scale = (span / 2) / range;
  const X = (re: number) => cx + re * scale;
  const Y = (im: number) => cy - im * scale;

  const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];
  const AXIS = '#475569';
  const GRID = '#e2e8f0';

  // Numbered gridlines on a round step (never more than ~6 a side), with
  // fainter unit lines between them while those still read as a grid.
  const step = niceStep(range, 6);
  const ticks: number[] = [];
  for (let v = step; v <= range + step * 1e-6; v += step) { ticks.push(Number(v.toFixed(8))); ticks.push(-Number(v.toFixed(8))); }
  const minor: number[] = [];
  const minorStep = step / (String(step / Math.pow(10, Math.floor(Math.log10(step)))).startsWith('2') ? 2 : 5);
  if (step > 1e-9 && minorStep * scale >= 9) {
    for (let v = minorStep; v <= range + minorStep * 1e-6; v += minorStep) { minor.push(v); minor.push(-v); }
  }
  const dp = step < 1 ? Math.ceil(-Math.log10(step)) : 0;

  // Label placement: every label avoids the points, the vectors, the axes'
  // numbers and the labels already placed.
  const frame: LBox = { x: 0, y: 0, w: W, h: H };
  const taken: LBox[] = [];
  for (const p of points) {
    taken.push({ x: X(p.re) - 7, y: Y(p.im) - 7, w: 14, h: 14 });
    if (p.showVector) taken.push(...segBoxes(cx, cy, X(p.re), Y(p.im)));
  }
  for (const v of ticks) {
    taken.push({ x: X(v) - 12, y: cy + 4, w: 24, h: 14 });
    taken.push({ x: cx - 34, y: Y(v) - 7, w: 30, h: 14 });
  }
  taken.push(...segBoxes(pad, cy, W - pad, cy, 3), ...segBoxes(cx, pad, cx, H - pad, 3));
  const laid = points.map((p, i) => {
    const color = p.color || COLORS[i % COLORS.length];
    const px = X(p.re), py = Y(p.im);
    const zText = p.label || `${numText(p.re, 3)}${p.im >= 0 ? ' + ' : ` ${MINUS} `}${numText(Math.abs(p.im), 3)}i`;
    const w = textW(zText, 12.5), h = 15;
    // First choice: beyond the point, continuing the direction from the origin.
    const d = Math.hypot(px - cx, py - cy) || 1;
    const ux = (px - cx) / d, uy = (py - cy) / d;
    const beyond = { x: px + ux * (10 + w / 2), y: py + uy * (10 + h / 2) };
    const pos = placeLabel(taken, [beyond, ...aroundPoint(px, py, w, h)], w, h, frame);
    return { p, color, px, py, zText, pos, d, ux, uy };
  });
  const withAngle = laid.filter((l) => l.p.showAngle);
  const notes = laid.map((l) => {
    const { p, px, py, d, ux, uy } = l;
    const modulus = Math.hypot(p.re, p.im);
    const exactMod = Math.abs(modulus - Number(modulus.toFixed(2))) < 1e-9;
    const modText = `|z| ${exactMod ? '=' : '≈'} ${numText(modulus, 2)}`;
    let modPos: { x: number; y: number } | null = null;
    if (p.showModulus && d > 30) {
      const w = textW(modText, 11.5), h = 14;
      const off = 11 + Math.abs(ux) * h / 2 + Math.abs(uy) * w / 2;
      const cands: Array<{ x: number; y: number }> = [];
      for (const t of [0.5, 0.36, 0.64, 0.24, 0.78]) {
        const bx = cx + (px - cx) * t, by = cy + (py - cy) * t;
        cands.push({ x: bx - uy * off, y: by + ux * off }, { x: bx + uy * off, y: by - ux * off });
      }
      modPos = placeLabel(taken, cands, w, h, frame);
    }
    const angleDeg = Math.atan2(p.im, p.re) * 180 / Math.PI;
    const k = withAngle.indexOf(l);
    const ar = 24 + k * 11;
    const angText = `${numText(angleDeg, 1)}°`;
    let angPos: { x: number; y: number } | null = null;
    if (p.showAngle && d > ar + 4 && Math.abs(angleDeg) > 0.5) {
      const w = textW(angText, 11), h = 13;
      const mid = (angleDeg / 2) * Math.PI / 180;
      const at = (rr: number, a: number) => ({ x: cx + rr * Math.cos(a), y: cy - rr * Math.sin(a) });
      const cands: Array<{ x: number; y: number }> = [];
      for (const extra of [8, 20, 34, 50]) for (const f of [1, 0.5, 1.5]) cands.push(at(ar + extra + w / 2, mid * f));
      angPos = placeLabel(taken, cands, w, h, frame);
    }
    return { modText, modPos, angleDeg, ar, angText, angPos };
  });

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[480px]"
        data-feature={N.plane}
        data-feature-label={title || 'Complex plane'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          {laid.map((l, i) => (
            <marker key={i} id={`cplx-arrow-${i}`} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0.5 L8,4.5 L0,8.5 z" fill={l.color} />
            </marker>
          ))}
        </defs>
        {/* gridlines */}
        {minor.map((v, i) => (
          <g key={`m${i}`}>
            <line x1={X(v)} y1={pad} x2={X(v)} y2={H - pad} stroke="#f1f5f9" strokeWidth={1} />
            <line x1={pad} y1={Y(v)} x2={W - pad} y2={Y(v)} stroke="#f1f5f9" strokeWidth={1} />
          </g>
        ))}
        {ticks.map((v) => (
          <g key={`g${v}`}>
            <line x1={X(v)} y1={pad} x2={X(v)} y2={H - pad} stroke={GRID} strokeWidth={1} />
            <line x1={pad} y1={Y(v)} x2={W - pad} y2={Y(v)} stroke={GRID} strokeWidth={1} />
          </g>
        ))}
        {/* axes */}
        <g data-feature={N.realAxis} data-feature-label="Real axis">
          <line x1={pad - 6} y1={cy} x2={W - pad + 6} y2={cy} stroke={AXIS} strokeWidth={1.6} />
          <text x={W - pad + 10} y={cy + 4} fontSize={13} fontStyle="italic" fill={AXIS}>Re</text>
        </g>
        <g data-feature={N.imaginaryAxis} data-feature-label="Imaginary axis">
          <line x1={cx} y1={H - pad + 6} x2={cx} y2={pad - 6} stroke={AXIS} strokeWidth={1.6} />
          <text x={cx} y={pad - 12} fontSize={13} fontStyle="italic" fill={AXIS} textAnchor="middle">Im</text>
        </g>
        {ticks.map((v) => (
          <g key={`t${v}`}>
            <text x={X(v)} y={cy + 15} fontSize={11} fill="#64748b" textAnchor="middle" style={HALO}>{numText(v, dp)}</text>
            <text x={cx - 7} y={Y(v) + 4} fontSize={11} fill="#64748b" textAnchor="end" style={HALO}>{Math.abs(v) === 1 ? (v < 0 ? MINUS : '') : numText(v, dp)}i</text>
          </g>
        ))}

        {laid.map((l, i) => {
          const { p, color, px, py, zText, pos } = l;
          const n = notes[i];
          const a = n.angleDeg * Math.PI / 180;
          return (
            <g key={i} data-feature={N.point(i)} data-feature-label={zText}>
              {p.showVector && l.d > 12 && (
                <line x1={cx} y1={cy} x2={px - l.ux * 5} y2={py - l.uy * 5} stroke={color} strokeWidth={2} opacity={0.9} markerEnd={`url(#cplx-arrow-${i})`} />
              )}
              {n.angPos && (
                <path
                  d={`M ${cx + n.ar} ${cy} A ${n.ar} ${n.ar} 0 0 ${n.angleDeg < 0 ? 1 : 0} ${cx + n.ar * Math.cos(a)} ${cy - n.ar * Math.sin(a)}`}
                  fill="none" stroke={color} strokeWidth={1.3} opacity={0.8}
                />
              )}
              <circle cx={px} cy={py} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
              <text x={pos.x} y={pos.y + 4.5} fontSize={12.5} fontWeight={700} fill={color} textAnchor="middle" style={HALO}>{zText}</text>
              {n.modPos && (
                <text x={n.modPos.x} y={n.modPos.y + 4} fontSize={11.5} fontStyle="italic" fill={color} textAnchor="middle" style={HALO}>{n.modText}</text>
              )}
              {n.angPos && (
                <text x={n.angPos.x} y={n.angPos.y + 4} fontSize={11} fill={color} textAnchor="middle" style={HALO}>{n.angText}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Plot diagram (Freytag's pyramid) ────────────────────────────────────────
export function CatalogPlotDiagramRenderer({ figure }: { figure: PlotDiagramFigure }) {
  const N = plotDiagramFeatureNames;
  const { notes, title } = figure;
  const W = 760;
  const INK = '#1f2937';
  const LINE = '#2563eb';
  const DOT = '#1d4ed8';
  const NOTE_FS = 11.5;
  const NOTE_LH = 14.5;
  const order = PLOT_STAGES;

  // Notes are wrapped, never cut (they used to end in "…" after 39 characters). Each stage has its own
  // clear area: the climax above the peak, rising / falling outside their slope, exposition / resolution
  // under the baseline, each on its own half.
  const NOTE_W: Record<string, number> = { exposition: 300, resolution: 300, climax: 320, rising_action: 196, falling_action: 196 };
  const wrapped: Record<string, string[]> = {};
  for (const st of order) wrapped[st] = notes[st] ? wrapTextToWidth(notes[st] as string, NOTE_W[st], NOTE_FS, 5) : [];

  const peakY = 44 + wrapped.climax.length * NOTE_LH;
  // The side notes stack upward from their label: the slope must be long enough to clear the climax note.
  const sideLines = Math.max(wrapped.rising_action.length, wrapped.falling_action.length);
  const midY = Math.max(peakY + 128, peakY + 40 + sideLines * NOTE_LH);
  const baseY = midY + 120;
  const bottomLines = Math.max(wrapped.exposition.length, wrapped.resolution.length);
  const H = baseY + 40 + bottomLines * NOTE_LH + 10;
  const pts: Record<string, [number, number]> = {
    exposition: [70, baseY],
    rising_action: [262, midY],
    climax: [380, peakY],
    falling_action: [498, midY],
    resolution: [690, baseY],
  };
  const path = order.map((s, i) => `${i === 0 ? 'M' : 'L'} ${pts[s][0]} ${pts[s][1]}`).join(' ');

  const LABELS: Record<string, string> = {
    exposition: 'Exposition',
    rising_action: 'Rising action',
    climax: 'Climax',
    falling_action: 'Falling action',
    resolution: 'Resolution',
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{title || "Plot diagram (Freytag's pyramid)"}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[760px]"
        data-feature={N.figure}
        data-feature-label={title || 'Plot diagram'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* baseline */}
        <line x1={40} y1={baseY} x2={W - 40} y2={baseY} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
        {/* the dramatic arc */}
        <path d={path} fill="none" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {order.map((s) => {
          const [x, y] = pts[s];
          const lines = wrapped[s];
          // Label position, and whether the note runs down from it or stacks up above it.
          let lx = x, labelY: number, anchor: 'start' | 'middle' | 'end', down: boolean;
          if (s === 'climax') { labelY = y - 14; anchor = 'middle'; down = false; }
          else if (s === 'exposition') { labelY = y + 26; anchor = 'start'; down = true; }
          else if (s === 'resolution') { labelY = y + 26; anchor = 'end'; down = true; }
          else if (s === 'rising_action') { lx = x - 16; labelY = y + 3; anchor = 'end'; down = false; }
          else { lx = x + 16; labelY = y + 3; anchor = 'start'; down = false; } // falling_action
          const noteY = (k: number) => (down ? labelY + 17 + k * NOTE_LH : labelY - 18 - (lines.length - 1 - k) * NOTE_LH);
          return (
            <g key={s} data-feature={N.stage(s)} data-feature-label={LABELS[s]}>
              <circle cx={x} cy={y} r={5} fill={DOT} stroke="#fff" strokeWidth={1.5} />
              <text x={lx} y={labelY} fontSize={13.5} fontWeight={700} fill={INK} textAnchor={anchor}>{LABELS[s]}</text>
              {lines.map((line, k) => (
                <text key={k} x={lx} y={noteY(k)} fontSize={NOTE_FS} fill="#475569" textAnchor={anchor}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Rhetorical triangle (ethos / pathos / logos) ────────────────────────────
export function CatalogRhetoricalTriangleRenderer({ figure }: { figure: RhetoricalTriangleFigure }) {
  const N = rhetoricalTriangleFeatureNames;
  const heading = figure.title || 'The Rhetorical Triangle';
  const W = 640;

  const COLORS: Record<RhetoricalAppeal, string> = {
    ethos: '#2563eb',
    pathos: '#dc2626',
    logos: '#16a34a',
  };

  // Corner text is wrapped, never cut (roles and notes used to end in "…" or run off the card).
  const ROLE_FS = 12.5, NOTE_FS = 11.5, ROLE_LH = 16, NOTE_LH = 14.5, NAME_H = 24, BLOCK_W = 230;
  const text = (appeal: RhetoricalAppeal) => {
    const c = figure[appeal];
    const role = wrapTextToWidth(c.role, BLOCK_W, ROLE_FS, 3, true);
    const note = wrapTextToWidth(c.note, BLOCK_W, NOTE_FS, 4);
    return { role, note, h: NAME_H + role.length * ROLE_LH + note.length * NOTE_LH };
  };
  const blocks: Record<RhetoricalAppeal, ReturnType<typeof text>> = { ethos: text('ethos'), pathos: text('pathos'), logos: text('logos') };

  const apex = { x: W / 2, y: 12 + blocks.ethos.h + 16 };
  const SIDE = 400;
  const TRI_H = 306;
  const bl = { x: W / 2 - SIDE / 2, y: apex.y + TRI_H };
  const br = { x: W / 2 + SIDE / 2, y: apex.y + TRI_H };
  const H = bl.y + 22 + Math.max(blocks.logos.h, blocks.pathos.h) + 8;
  const centroid = { x: (apex.x + bl.x + br.x) / 3, y: (apex.y + bl.y + br.y) / 3 };
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  const vertexOf: Record<RhetoricalAppeal, { x: number; y: number }> = { ethos: apex, logos: bl, pathos: br };

  const corners: Array<{ appeal: RhetoricalAppeal; v: { x: number; y: number }; dir: 'above' | 'below' }> = [
    { appeal: 'ethos', v: apex, dir: 'above' },
    { appeal: 'logos', v: bl, dir: 'below' },
    { appeal: 'pathos', v: br, dir: 'below' },
  ];

  const trianglePts = `${apex.x},${apex.y} ${bl.x},${bl.y} ${br.x},${br.y}`;
  // The triangle is divided into three kites, one per appeal, by the lines from the centre to the middle of
  // each side. A highlighted appeal tints its own kite: its edges are lines that are drawn, so the tint reads
  // as a region of the figure (it used to end on invisible lines and looked like a rendering fault).
  const sideMids = [mid(apex, bl), mid(bl, br), mid(br, apex)];
  let wedge: string | null = null;
  if (figure.highlight) {
    const V = vertexOf[figure.highlight];
    const others = [apex, bl, br].filter((p) => p !== V);
    const m0 = mid(V, others[0]);
    const m1 = mid(V, others[1]);
    wedge = `${V.x},${V.y} ${m0.x},${m0.y} ${centroid.x},${centroid.y} ${m1.x},${m1.y}`;
  }

  const subjectLines = wrapTextToWidth(figure.subject, 190, 14, 3, true);
  const subjW = Math.max(74, ...subjectLines.map((l) => estTextWidth(l, 14, true))) + 22;
  const subjH = 20 + subjectLines.length * 18;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.triangle}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <polygon points={trianglePts} fill="#f8fafc" />
        {wedge && <polygon points={wedge} fill={COLORS[figure.highlight!]} fillOpacity={0.16} />}
        {/* the three regions */}
        {sideMids.map((m, i) => (
          <line key={`div${i}`} x1={m.x} y1={m.y} x2={centroid.x} y2={centroid.y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
        ))}
        <polygon points={trianglePts} fill="none" stroke="#334155" strokeWidth={2.5} strokeLinejoin="round" />

        {/* subject at the centre */}
        <g data-feature={N.subject} data-feature-label={`Subject: ${figure.subject}`}>
          <rect x={centroid.x - subjW / 2} y={centroid.y - subjH / 2} width={subjW} height={subjH} rx={8} fill="#fff" stroke="#e2e8f0" strokeWidth={1} />
          <text x={centroid.x} y={centroid.y - subjH / 2 + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#94a3b8" letterSpacing={1}>SUBJECT</text>
          {subjectLines.map((line, k) => (
            <text key={k} x={centroid.x} y={centroid.y - subjH / 2 + 33 + k * 18} textAnchor="middle" fontSize={14} fontWeight={700} fill="#334155">{line}</text>
          ))}
        </g>

        {/* corners */}
        {corners.map(({ appeal, v, dir }) => {
          const c = figure[appeal];
          const blk = blocks[appeal];
          const color = COLORS[appeal];
          const active = figure.highlight === appeal;
          const top = dir === 'above' ? v.y - 16 - blk.h : v.y + 22;
          const nameY = top + 18;
          return (
            <g key={appeal} data-feature={N.corner(appeal)} data-feature-label={`${c.label}: ${c.role}`}>
              {active && <circle cx={v.x} cy={v.y} r={13} fill={color} fillOpacity={0.18} />}
              <circle cx={v.x} cy={v.y} r={active ? 8 : 6.5} fill={color} stroke="#fff" strokeWidth={2} />
              <text x={v.x} y={nameY} textAnchor="middle" fontSize={20} fontWeight={800} fill={color}>{c.label}</text>
              {blk.role.map((line, k) => (
                <text key={`r${k}`} x={v.x} y={top + NAME_H + 12 + k * ROLE_LH} textAnchor="middle" fontSize={ROLE_FS} fontWeight={700} fill="#475569">{line}</text>
              ))}
              {blk.note.map((line, k) => (
                <text key={`n${k}`} x={v.x} y={top + NAME_H + blk.role.length * ROLE_LH + 11 + k * NOTE_LH} textAnchor="middle" fontSize={NOTE_FS} fill="#64748b">{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Character web (central character + relationship / trait spokes) ─────────
export function CatalogCharacterWebRenderer({ figure }: { figure: CharacterWebFigure }) {
  const N = characterWebFeatureNames;
  const heading = figure.title || `Character Web — ${figure.center}`;

  const CHAR_FILL = '#dbeafe';
  const CHAR_STROKE = '#2563eb';
  const TRAIT_FILL = '#dcfce7';
  const TRAIT_STROKE = '#16a34a';
  const NODE_FS = 13, NODE_LH = 16, CENTER_FS = 15, CENTER_LH = 18, REL_FS = 11.5, REL_LH = 14;

  // Every label is wrapped and its ellipse sized to it (names used to be cut at 14 characters).
  const sized = (label: string, fs: number, lh: number, wrapW: number) => {
    const lines = wrapTextToWidth(label, wrapW, fs, 3, true);
    const w = Math.max(...lines.map((l) => estTextWidth(l, fs, true)));
    // An ellipse around a w × h text block: the block's corners must stay inside.
    const h = lines.length * lh;
    return { lines, rx: Math.max(46, (w / 2) * 1.25 + 12), ry: Math.max(22, (h / 2) * 1.35 + 9) };
  };
  const centre = sized(figure.center, CENTER_FS, CENTER_LH, 132);
  const nodes = figure.nodes.map((node) => ({
    node,
    ...sized(node.label, NODE_FS, NODE_LH, 112),
    rel: node.relation ? wrapTextToWidth(node.relation, 128, REL_FS, 3) : [],
  }));

  type Box = { x: number; y: number; w: number; h: number };
  const hit = (p: Box, q: Box, gap = 6) => p.x < q.x + q.w + gap && q.x < p.x + p.w + gap && p.y < q.y + q.h + gap && q.y < p.y + p.h + gap;
  // Point on an ellipse rim (centre ex,ey) on the way to (tx,ty).
  const rim = (ex: number, ey: number, rx: number, ry: number, tx: number, ty: number) => {
    const dx = tx - ex, dy = ty - ey;
    const t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));
    return { x: ex + dx * t, y: ey + dy * t };
  };

  // The ring grows until nothing touches: node against node, and every relation label (which sits in the
  // middle of its own spoke) against the other labels, the nodes and the centre. Eight nodes with long
  // relations used to print their labels over each other and under the neighbouring nodes.
  const place = (ry: number) => {
    const rxRing = ry * 1.3;
    const placed = nodes.map((n, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
      const x = rxRing * Math.cos(ang), y = ry * Math.sin(ang);
      const a = rim(0, 0, centre.rx, centre.ry, x, y);
      const b = rim(x, y, n.rx, n.ry, 0, 0);
      const relW = n.rel.length ? Math.max(...n.rel.map((l) => estTextWidth(l, REL_FS))) + 12 : 0;
      const relH = n.rel.length * REL_LH + 6;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const relBox: Box | null = n.rel.length ? { x: mx - relW / 2, y: my - relH / 2, w: relW, h: relH } : null;
      return { ...n, x, y, a, b, mx, my, relBox, box: { x: x - n.rx, y: y - n.ry, w: n.rx * 2, h: n.ry * 2 } as Box };
    });
    const centreBox: Box = { x: -centre.rx, y: -centre.ry, w: centre.rx * 2, h: centre.ry * 2 };
    let ok = true;
    for (let i = 0; i < placed.length && ok; i++) {
      const p = placed[i];
      if (hit(p.box, centreBox, 14)) ok = false;
      if (p.relBox && hit(p.relBox, centreBox, 2)) ok = false;
      for (let j = 0; j < placed.length && ok; j++) {
        if (j === i) continue;
        const q = placed[j];
        if (j > i && hit(p.box, q.box, 10)) ok = false;
        if (p.relBox && hit(p.relBox, q.box, 4)) ok = false;
        if (p.relBox && q.relBox && j > i && hit(p.relBox, q.relBox, 4)) ok = false;
      }
      // A label must fit between the two rims of its own spoke.
      if (p.relBox && (hit(p.relBox, p.box, -2))) ok = false;
    }
    return { placed, ok, rxRing };
  };
  let ringRy = 150;
  let laid = place(ringRy);
  while (!laid.ok && ringRy < 420) { ringRy += 12; laid = place(ringRy); }
  const placed = laid.placed;

  const hasTrait = nodes.some((n) => n.node.kind === 'trait');
  const hasChar = nodes.some((n) => n.node.kind !== 'trait');
  const LEGEND_H = hasTrait && hasChar ? 34 : 0;
  // At least as wide as the legend, and symmetric about the centre when the web itself is narrow.
  const minX = Math.min(-centre.rx, -130, ...placed.map((p) => p.box.x)) - 14;
  const maxX = Math.max(centre.rx, 130, ...placed.map((p) => p.box.x + p.box.w)) + 14;
  const minY = Math.min(-centre.ry, ...placed.map((p) => p.box.y)) - 12;
  const maxY = Math.max(centre.ry, ...placed.map((p) => p.box.y + p.box.h)) + 12;
  const W = maxX - minX;
  const H = maxY - minY + LEGEND_H;
  const cx = -minX;
  const legendX = cx - 96;
  const cy = -minY;
  const textBlock = (lines: string[], x: number, y: number, fs: number, lh: number, fill: string, weight: number) =>
    lines.map((line, k) => (
      <text key={k} x={x} y={y - ((lines.length - 1) * lh) / 2 + k * lh + fs * 0.35} textAnchor="middle" fontSize={fs} fontWeight={weight} fill={fill}>{line}</text>
    ));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(760, W) }}
        data-feature={N.web}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* spokes (under everything) */}
        {placed.map((p, i) => (
          <line key={`edge${i}`} x1={cx + p.a.x} y1={cy + p.a.y} x2={cx + p.b.x} y2={cy + p.b.y} stroke="#94a3b8" strokeWidth={1.5} />
        ))}

        {/* centre */}
        <g data-feature={N.center} data-feature-label={figure.center}>
          <ellipse cx={cx} cy={cy} rx={centre.rx} ry={centre.ry} fill="#1e3a8a" stroke="#1e3a8a" />
          {textBlock(centre.lines, cx, cy, CENTER_FS, CENTER_LH, '#fff', 800)}
        </g>

        {/* nodes */}
        {placed.map((p, i) => {
          const isTrait = p.node.kind === 'trait';
          return (
            <g key={`node${i}`} data-feature={N.node(i)} data-feature-label={`${p.node.label}${p.node.relation ? ` (${p.node.relation})` : ''}`}>
              <ellipse cx={cx + p.x} cy={cy + p.y} rx={p.rx} ry={p.ry} fill={isTrait ? TRAIT_FILL : CHAR_FILL} stroke={isTrait ? TRAIT_STROKE : CHAR_STROKE} strokeWidth={2} {...(isTrait ? { strokeDasharray: '5 3' } : {})} />
              {textBlock(p.lines, cx + p.x, cy + p.y, NODE_FS, NODE_LH, isTrait ? '#166534' : '#1e40af', 700)}
            </g>
          );
        })}

        {/* relation labels: each in the middle of its own spoke, on a white plate */}
        {placed.map((p, i) => p.relBox && (
          <g key={`rel${i}`}>
            <rect x={cx + p.relBox.x} y={cy + p.relBox.y} width={p.relBox.w} height={p.relBox.h} rx={4} fill="#fff" />
            {p.rel.map((line, k) => (
              <text key={k} x={cx + p.mx} y={cy + p.relBox!.y + 3 + (k + 1) * REL_LH - 3.5} textAnchor="middle" fontSize={REL_FS} fontStyle="italic" fill="#475569">{line}</text>
            ))}
          </g>
        ))}

        {/* legend: only when both kinds are on the figure */}
        {LEGEND_H > 0 && (
          <g transform={`translate(${legendX}, ${H - 14})`}>
            <ellipse cx={8} cy={0} rx={9} ry={6} fill={CHAR_FILL} stroke={CHAR_STROKE} strokeWidth={1.5} />
            <text x={22} y={4} fontSize={11.5} fill="#475569">character</text>
            <ellipse cx={128} cy={0} rx={9} ry={6} fill={TRAIT_FILL} stroke={TRAIT_STROKE} strokeWidth={1.5} strokeDasharray="4 2" />
            <text x={142} y={4} fontSize={11.5} fill="#475569">trait</text>
          </g>
        )}
      </svg>
    </div>
  );
}
