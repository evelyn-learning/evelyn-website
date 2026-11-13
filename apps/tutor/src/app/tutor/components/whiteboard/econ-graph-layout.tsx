'use client';

/**
 * One drawing routine for the schematic two-axis market graphs (AD-AS, money market, loanable funds,
 * Phillips curve, foreign exchange, supply & demand).
 *
 * These graphs carry no numerals: what matters is which way a curve moved and where the equilibria sit
 * relative to each other. Each renderer therefore states its curves and points in schematic units (see
 * `gap`), and this component frames them: the key points are centred in the plot, curves are cut to an
 * inset box so none runs into an axis or the card edge, and every label (curve names, equilibrium names,
 * axis marks) is placed where it meets no other label and crosses as few curves as possible. Drawn
 * separately in each renderer, an equilibrium near an edge pushed curves and labels off the card and a
 * small shift printed two labels on top of each other.
 */
import React from 'react';
import { InlineMathText } from './InlineMathText';

export const ECON = {
  demand: '#2563eb',
  supply: '#dc2626',
  vertical: '#1f2937',
  axis: '#1f2937',
  eq: '#15803d',
  eqNew: '#b45309',
  control: '#7e22ce',
  ink: '#374151',
};

/** A separation shown on a schematic axis: zero stays zero, anything else keeps its sign and is held
 *  between `lo` and `hi`, so a small shift stays visible and a large one stays on the card. */
export function gap(v: number, lo: number, hi: number): number {
  if (!Number.isFinite(v) || Math.abs(v) < 1e-9) return 0;
  return Math.sign(v) * Math.max(lo, Math.min(hi, Math.abs(v)));
}

export interface MarketLineSpec {
  key: string;
  /** up: slope +1 through (x, y); down: slope −1 through (x, y); vertical at x; horizontal at y. */
  kind: 'up' | 'down' | 'vertical' | 'horizontal';
  x?: number;
  y?: number;
  color: string;
  dashed?: boolean;
  label: string;
  /** Set as a subscript after the label (a short currency code). */
  sub?: string;
  feature?: string;
  featureLabel?: string;
}

export interface MarketPointSpec {
  key: string;
  x: number;
  y: number;
  color: string;
  /** Name written beside the dot. */
  label?: string;
  /** Marks on the axes, with a dotted guide to each. */
  xTick?: string;
  yTick?: string;
  dot?: boolean;
  feature?: string;
  featureLabel?: string;
}

export interface MarketBracketSpec {
  key: string;
  y: number;
  x1: number;
  x2: number;
  label: string;
  color: string;
  side: 'above' | 'below';
  feature?: string;
  featureLabel?: string;
}

export interface MarketGraphProps {
  className: string;
  rootFeature: string;
  rootLabel: string;
  title?: string;
  subtitle?: string | null;
  xTitle: string;
  yTitle: string;
  lines: MarketLineSpec[];
  points: MarketPointSpec[];
  brackets?: MarketBracketSpec[];
}

interface Box { x1: number; y1: number; x2: number; y2: number }
interface Seg { x1: number; y1: number; x2: number; y2: number; key: string }
interface Placed { x: number; y: number; anchor: 'start' | 'middle' | 'end'; box: Box }

const W = 580;
const H = 400;
const PAD_L = 76;
const PAD_R = 64;
const PAD_T = 30;
const PAD_B = 62;
const INSET = 7; // schematic units kept clear between a curve's end and the axes / plot edge

const textW = (s: string, fs: number, bold = true) => s.length * fs * (bold ? 0.6 : 0.56);

function overlap(a: Box, b: Box, pad = 0): boolean {
  return a.x1 < b.x2 + pad && a.x2 > b.x1 - pad && a.y1 < b.y2 + pad && a.y2 > b.y1 - pad;
}

/** Whether a segment passes through a box (Liang–Barsky). */
function segHitsBox(s: Seg, b: Box): boolean {
  let t0 = 0; let t1 = 1;
  const dx = s.x2 - s.x1; const dy = s.y2 - s.y1;
  const p = [-dx, dx, -dy, dy];
  const q = [s.x1 - b.x1, b.x2 - s.x1, s.y1 - b.y1, b.y2 - s.y1];
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-9) { if (q[i] < 0) return false; continue; }
    const t = q[i] / p[i];
    if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
  }
  return t0 <= t1;
}

const SUBS: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3' };
/** Unicode subscript digits are drawn very small by the board font: set them as real subscripts. */
function rich(text: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let buf = ''; let down = false;
  [...text].forEach((ch, i) => {
    const sub = SUBS[ch];
    if (sub) {
      if (buf) { out.push(down ? <tspan key={`b${i}`} dy={-3}>{buf}</tspan> : buf); buf = ''; down = false; }
      out.push(<tspan key={`s${i}`} fontSize="0.74em" dy={3}>{sub}</tspan>); down = true;
    } else buf += ch;
  });
  if (buf) out.push(down ? <tspan key="tail" dy={-3}>{buf}</tspan> : buf);
  return out;
}

function wrapTitle(s: string, maxChars: number): string[] {
  if (s.length <= maxChars) return [s];
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function MarketGraph(props: MarketGraphProps) {
  const { className, rootFeature, rootLabel, title, subtitle, xTitle, yTitle, lines, points, brackets = [] } = props;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // Frame: the bounding box of the key points sits at the middle of the plot.
  const xs: number[] = []; const ys: number[] = [];
  for (const l of lines) { if (l.kind !== 'horizontal' && l.x !== undefined) xs.push(l.x); if (l.kind !== 'vertical' && l.y !== undefined) ys.push(l.y); }
  for (const p of points) { xs.push(p.x); ys.push(p.y); }
  for (const b of brackets) { xs.push(b.x1, b.x2); ys.push(b.y); }
  const mid = (v: number[]) => (v.length ? (Math.min(...v) + Math.max(...v)) / 2 : 50);
  const span = (v: number[]) => (v.length ? Math.max(...v) - Math.min(...v) : 0);
  // A frame wider than the plot allows is drawn smaller rather than cut.
  const k = Math.min(1, (100 - 2 * INSET - 16) / Math.max(1, span(xs), span(ys)));
  const mx = mid(xs); const my = mid(ys);
  const sx = (v: number) => 50 + (v - mx) * k;
  const sy = (v: number) => 50 + (v - my) * k;
  const px = (u: number) => PAD_L + (u / 100) * plotW;
  const py = (u: number) => PAD_T + plotH - (u / 100) * plotH;
  const lo = INSET; const hi = 100 - INSET;

  // Curves, cut to the inset box.
  const segs: (Seg & { spec: MarketLineSpec })[] = lines.map((l) => {
    if (l.kind === 'vertical') { const x = px(sx(l.x ?? 50)); return { key: l.key, spec: l, x1: x, y1: py(0), x2: x, y2: py(hi + 3) }; }
    if (l.kind === 'horizontal') { const y = py(sy(l.y ?? 50)); return { key: l.key, spec: l, x1: px(0), y1: y, x2: px(hi + 3), y2: y }; }
    const x0 = sx(l.x ?? 50); const y0 = sy(l.y ?? 50);
    const s = l.kind === 'up' ? 1 : -1;
    // x-range where lo <= y0 + s (x − x0) <= hi, within lo..hi.
    const a = s > 0 ? x0 + (lo - y0) : x0 - (hi - y0);
    const b = s > 0 ? x0 + (hi - y0) : x0 - (lo - y0);
    const xa = Math.max(lo, Math.min(a, b)); const xb = Math.min(hi, Math.max(a, b));
    return { key: l.key, spec: l, x1: px(xa), y1: py(y0 + s * (xa - x0)), x2: px(xb), y2: py(y0 + s * (xb - x0)) };
  });

  const dots = points.filter((p) => p.dot !== false).map((p) => ({ x: px(sx(p.x)), y: py(sy(p.y)) }));
  const placedBoxes: Box[] = [];
  const bounds: Box = { x1: PAD_L + 4, y1: 2, x2: W - 2, y2: PAD_T + plotH - 3 };

  /** The first candidate that meets no placed label, stays on the card, and crosses the fewest curves. */
  function place(text: string, fs: number, cands: { x: number; y: number; anchor: 'start' | 'middle' | 'end' }[], ownKey?: string): Placed {
    const w = textW(text, fs);
    let best: Placed | null = null; let bestCost = Infinity;
    cands.forEach((c, i) => {
      const x1 = c.anchor === 'start' ? c.x : c.anchor === 'end' ? c.x - w : c.x - w / 2;
      const box: Box = { x1: x1 - 2, y1: c.y - fs + 1, x2: x1 + w + 2, y2: c.y + 4 };
      let cost = i * 0.6;
      if (box.x1 < bounds.x1 || box.x2 > bounds.x2 || box.y1 < bounds.y1 || box.y2 > bounds.y2) cost += 400;
      for (const b of placedBoxes) if (overlap(box, b, 3)) cost += 300;
      for (const s of segs) if (segHitsBox(s, box)) cost += s.key === ownKey ? 60 : 40;
      for (const d of dots) if (overlap(box, { x1: d.x - 7, y1: d.y - 7, x2: d.x + 7, y2: d.y + 7 })) cost += 80;
      if (cost < bestCost) { bestCost = cost; best = { x: c.x, y: c.y, anchor: c.anchor, box }; }
    });
    const out = best ?? { x: cands[0].x, y: cands[0].y, anchor: cands[0].anchor, box: { x1: 0, y1: 0, x2: 0, y2: 0 } };
    placedBoxes.push(out.box);
    return out;
  }

  const FS_CURVE = 13;
  const lineLabelText = (l: MarketLineSpec) => `${l.label}${l.sub ? l.sub : ''}`;
  const order = [...segs].sort((a, b) => Number(a.spec.kind !== 'vertical') - Number(b.spec.kind !== 'vertical'));
  const lineLabels = new Map<string, Placed>();
  for (const s of order) {
    const l = s.spec; const t = lineLabelText(l);
    let cands: { x: number; y: number; anchor: 'start' | 'middle' | 'end' }[];
    if (l.kind === 'vertical') {
      const top = s.y2;
      cands = [
        { x: s.x1, y: top - 6, anchor: 'middle' },
        { x: s.x1 + 6, y: top - 6, anchor: 'start' }, { x: s.x1 - 6, y: top - 6, anchor: 'end' },
        { x: s.x1 + 7, y: top + 14, anchor: 'start' }, { x: s.x1 - 7, y: top + 14, anchor: 'end' },
        { x: s.x1 + 7, y: s.y1 - 8, anchor: 'start' }, { x: s.x1 - 7, y: s.y1 - 8, anchor: 'end' },
      ];
    } else if (l.kind === 'horizontal') {
      cands = [
        { x: s.x2 + 5, y: s.y2 + 4, anchor: 'start' }, { x: s.x2, y: s.y2 - 7, anchor: 'end' }, { x: s.x2, y: s.y2 + 16, anchor: 'end' },
        { x: s.x1 + 8, y: s.y1 - 7, anchor: 'start' }, { x: s.x1 + 8, y: s.y1 + 16, anchor: 'start' },
      ];
    } else if (l.kind === 'up') {
      // Right end is the top; the curve falls away to the lower left.
      cands = [
        { x: s.x2 + 6, y: s.y2 + 4, anchor: 'start' }, { x: s.x2, y: s.y2 - 8, anchor: 'middle' },
        { x: s.x2 - 10, y: s.y2 - 4, anchor: 'end' }, { x: s.x2 + 4, y: s.y2 + 20, anchor: 'start' },
        { x: s.x2 - 16, y: s.y2 - 4, anchor: 'end' }, { x: s.x2 + 8, y: s.y2 + 34, anchor: 'start' },
        { x: s.x1 + 10, y: s.y1 + 6, anchor: 'start' }, { x: s.x1 - 8, y: s.y1 - 6, anchor: 'end' },
      ];
    } else {
      // Right end is the bottom; the curve rises to the upper left.
      cands = [
        { x: s.x2 + 6, y: s.y2 + 5, anchor: 'start' }, { x: s.x2 + 4, y: s.y2 - 10, anchor: 'start' },
        { x: s.x2 - 10, y: s.y2 + 12, anchor: 'end' }, { x: s.x2 + 8, y: s.y2 - 24, anchor: 'start' },
        { x: s.x2 - 16, y: s.y2 + 12, anchor: 'end' },
        { x: s.x1 + 10, y: s.y1 + 2, anchor: 'start' }, { x: s.x1 - 8, y: s.y1 + 14, anchor: 'end' },
      ];
    }
    lineLabels.set(l.key, place(t, FS_CURVE, cands, l.key));
  }

  // Brackets (shortage / surplus) name themselves beside their bar.
  const bracketLabels = new Map<string, Placed>();
  for (const b of brackets) {
    const cx = (px(sx(b.x1)) + px(sx(b.x2))) / 2; const y = py(sy(b.y));
    const first = b.side === 'above' ? y - 10 : y + 19; const second = b.side === 'above' ? y + 19 : y - 10;
    bracketLabels.set(b.key, place(b.label, 12, [{ x: cx, y: first, anchor: 'middle' }, { x: cx, y: second, anchor: 'middle' }, { x: cx, y: first + (b.side === 'above' ? -14 : 14), anchor: 'middle' }]));
  }

  // Equilibrium names: in the open wedges beside the crossing first.
  const pointLabels = new Map<string, Placed>();
  for (const p of points) {
    if (!p.label) continue;
    const x = px(sx(p.x)); const y = py(sy(p.y));
    pointLabels.set(p.key, place(p.label, 13, [
      { x: x + 11, y: y + 4, anchor: 'start' }, { x: x - 11, y: y + 4, anchor: 'end' },
      { x, y: y - 12, anchor: 'middle' }, { x, y: y + 22, anchor: 'middle' },
      { x: x + 16, y: y + 4, anchor: 'start' }, { x: x - 16, y: y + 4, anchor: 'end' },
      { x, y: y - 26, anchor: 'middle' }, { x, y: y + 36, anchor: 'middle' },
      { x: x + 12, y: y - 14, anchor: 'start' }, { x: x + 12, y: y + 22, anchor: 'start' },
      { x: x - 12, y: y - 14, anchor: 'end' }, { x: x - 12, y: y + 22, anchor: 'end' },
    ]));
  }

  // Marks on the axes: equal positions share one mark, close ones are moved apart.
  interface Tick { pos: number; text: string; color: string }
  function settle(raw: Tick[], minGap: (a: Tick, b: Tick) => number, loLim: number, hiLim: number): Tick[] {
    const sorted = [...raw].sort((a, b) => a.pos - b.pos);
    const merged: Tick[] = [];
    for (const t of sorted) {
      const last = merged[merged.length - 1];
      if (last && Math.abs(last.pos - t.pos) < 1.5) { if (last.text !== t.text) { last.text = `${last.text} = ${t.text}`; last.color = ECON.ink; } } else merged.push({ ...t });
    }
    for (let pass = 0; pass < 6; pass++) {
      for (let i = 1; i < merged.length; i++) {
        const need = minGap(merged[i - 1], merged[i]); const have = merged[i].pos - merged[i - 1].pos;
        if (have < need) { const d = (need - have) / 2; merged[i - 1].pos -= d; merged[i].pos += d; }
      }
      for (const t of merged) t.pos = Math.max(loLim, Math.min(hiLim, t.pos));
    }
    return merged;
  }
  const FS_TICK = 12;
  const xTicks = settle(points.filter((p) => p.xTick).map((p) => ({ pos: px(sx(p.x)), text: p.xTick!, color: p.color })), (a, b) => (textW(a.text, FS_TICK) + textW(b.text, FS_TICK)) / 2 + 6, PAD_L + 6, PAD_L + plotW);
  const yTicks = settle(points.filter((p) => p.yTick).map((p) => ({ pos: py(sy(p.y)), text: p.yTick!, color: p.color })), () => FS_TICK + 3, PAD_T + 4, PAD_T + plotH - 4);

  const yTitleLines = wrapTitle(yTitle, Math.floor((plotH + 30) / 7.2));
  const xTitleLines = wrapTitle(xTitle, Math.floor((plotW + 60) / 7.2)).slice(0, 2);
  const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' as const };
  const yTickW = Math.max(0, ...yTicks.map((t) => textW(t.text, FS_TICK)));
  const yTitleX = Math.max(12, Math.min(22, PAD_L - 12 - yTickW - (yTitleLines.length - 1) * 16 - 6));

  return (
    <div className={`${className} w-full flex flex-col items-center`} data-feature={rootFeature} data-feature-label={rootLabel}>
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      {subtitle && <div className="text-xs italic text-gray-600 -mt-1 mb-2 text-center"><InlineMathText text={subtitle} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={ECON.axis} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={ECON.axis} strokeWidth={1.5} />

        {/* guides */}
        {points.map((p) => {
          const x = px(sx(p.x)); const y = py(sy(p.y));
          return (
            <g key={`g-${p.key}`}>
              {p.xTick && <line x1={x} y1={y} x2={x} y2={PAD_T + plotH} stroke={p.color} strokeWidth={1} strokeDasharray="2 3" opacity={0.65} />}
              {p.yTick && <line x1={x} y1={y} x2={PAD_L} y2={y} stroke={p.color} strokeWidth={1} strokeDasharray="2 3" opacity={0.65} />}
            </g>
          );
        })}

        {/* curves */}
        {segs.map((s) => (
          <g
            key={s.key}
            data-feature={s.spec.feature}
            data-feature-label={s.spec.featureLabel ?? lineLabelText(s.spec)}
            data-feature-cx={((s.x1 + s.x2) / 2) / W}
            data-feature-cy={((s.y1 + s.y2) / 2) / H}
            data-feature-w={(s.spec.kind === 'vertical' ? 28 : 40) / W}
            data-feature-h={(s.spec.kind === 'vertical' ? Math.abs(s.y2 - s.y1) : 24) / H}
          >
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.spec.color} strokeWidth={s.spec.kind === 'horizontal' ? 2 : 2.5} strokeDasharray={s.spec.dashed ? '7 5' : undefined} strokeLinecap="round" />
          </g>
        ))}

        {/* brackets */}
        {brackets.map((b) => {
          const lb = bracketLabels.get(b.key)!; const y = py(sy(b.y));
          return (
            <g key={b.key} data-feature={b.feature} data-feature-label={b.featureLabel ?? b.label}>
              <line x1={px(sx(b.x1))} y1={y} x2={px(sx(b.x2))} y2={y} stroke={b.color} strokeWidth={7} opacity={0.3} />
              <text x={lb.x} y={lb.y} fontSize={12} fontWeight={700} fill={b.color} textAnchor={lb.anchor} style={halo}>{b.label}</text>
            </g>
          );
        })}

        {/* curve names */}
        {segs.map((s) => {
          const lb = lineLabels.get(s.key)!;
          return (
            <text key={`t-${s.key}`} x={lb.x} y={lb.y} fontSize={FS_CURVE} fontWeight={700} fill={s.spec.color} textAnchor={lb.anchor} style={halo}>
              {s.spec.label}{s.spec.sub && <tspan fontSize={9.5} dy={3.5}>{s.spec.sub}</tspan>}
            </text>
          );
        })}

        {/* points */}
        {points.map((p) => {
          const x = px(sx(p.x)); const y = py(sy(p.y)); const lb = pointLabels.get(p.key);
          return (
            <g key={p.key} data-feature={p.feature} data-feature-label={p.featureLabel ?? p.label} data-feature-cx={x / W} data-feature-cy={y / H} data-feature-w={40 / W} data-feature-h={40 / H}>
              {p.dot !== false && <circle cx={x} cy={y} r={5} fill={p.color} stroke="#fff" strokeWidth={2} />}
              {lb && p.label && <text x={lb.x} y={lb.y} fontSize={13} fontWeight={700} fill={p.color} textAnchor={lb.anchor} style={halo}>{rich(p.label)}</text>}
            </g>
          );
        })}

        {/* axis marks */}
        {xTicks.map((t, i) => <text key={`x-${i}`} x={t.pos} y={PAD_T + plotH + 16} fontSize={FS_TICK} fontWeight={600} fill={t.color} textAnchor="middle">{rich(t.text)}</text>)}
        {yTicks.map((t, i) => <text key={`y-${i}`} x={PAD_L - 7} y={t.pos + 4} fontSize={FS_TICK} fontWeight={600} fill={t.color} textAnchor="end">{rich(t.text)}</text>)}

        {/* axis titles */}
        {xTitleLines.map((ln, i) => (
          <text key={`xt-${i}`} x={PAD_L + plotW / 2} y={PAD_T + plotH + 38 + i * 16} fontSize={13} fontWeight={600} textAnchor="middle" fill={ECON.ink}>{ln}</text>
        ))}
        {yTitleLines.map((ln, i) => (
          <text key={`yt-${i}`} x={yTitleX + i * 16} y={PAD_T + plotH / 2} fontSize={13} fontWeight={600} textAnchor="middle" fill={ECON.ink} transform={`rotate(-90 ${yTitleX + i * 16} ${PAD_T + plotH / 2})`}>{ln}</text>
        ))}
      </svg>
    </div>
  );
}
