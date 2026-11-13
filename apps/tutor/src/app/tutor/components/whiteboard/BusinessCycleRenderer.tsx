'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  businessCycleFeatureNames,
  type BusinessCycleFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_TREND = '#9ca3af';
const COLOR_CYCLE = '#1f2937';
const COLOR_GAP_POS = '#86efac';
const COLOR_GAP_NEG = '#fca5a5';
const COLOR_LABEL = '#374151';
const COLOR_MARKER = '#dc2626';

interface Box { x1: number; y1: number; x2: number; y2: number }
const hit = (a: Box, b: Box, pad = 0) => a.x1 < b.x2 + pad && a.x2 > b.x1 - pad && a.y1 < b.y2 + pad && a.y2 > b.y1 - pad;

export function BusinessCycleRenderer({ figure }: { figure: BusinessCycleFigure }) {
  const { cycles, amplitude, trendSlope, showTrend, showOutputGap, labels, markers, title } = figure;
  const N = businessCycleFeatureNames;
  const W = 640;
  const H = 360;
  const PAD_L = 60;
  const PAD_R = 24;
  const PAD_T = 22;
  const PAD_B = 50;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (t: number) => PAD_L + t * plotW;
  const trendAt = (t: number) => 0.5 + (t - 0.5) * (trendSlope * 0.5);
  const cycleAt = (t: number) => trendAt(t) + amplitude * Math.sin(t * cycles * 2 * Math.PI - Math.PI / 2);

  const segments = 240;
  const ts = Array.from({ length: segments + 1 }, (_, i) => i / segments);
  // The curve keeps clear of the axes and of the top edge whatever its amplitude and slope: its own
  // range is fitted to the plot (a large swing used to run into the x-axis).
  const vals = ts.flatMap((t) => [cycleAt(t), trendAt(t)]);
  const vMin = Math.min(...vals); const vMax = Math.max(...vals);
  const top = PAD_T + 34; const bottom = PAD_T + plotH - 30;
  const yAt = (v: number) => bottom - ((v - vMin) / Math.max(1e-9, vMax - vMin)) * (bottom - top);

  const curve = ts.map((t) => ({ x: xAt(t), y: yAt(cycleAt(t)) }));
  const trend = ts.map((t) => ({ x: xAt(t), y: yAt(trendAt(t)) }));
  const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

  const drawnMarkers = markers ?? [];
  const markerPts = drawnMarkers.map((m) => ({ x: xAt(m.t), y: yAt(cycleAt(m.t)) }));

  // Labels take the first spot that meets no other label, no marker line and neither curve.
  const placed: Box[] = [];
  const bounds: Box = { x1: PAD_L + 4, y1: 2, x2: W - 3, y2: PAD_T + plotH - 3 };
  type Cand = { x: number; y: number; anchor: 'start' | 'middle' | 'end'; lines?: string[] };
  /** A label of several words may also stand on two lines: narrower, it fits beside a steep stretch of the curve. */
  const split = (text: string): string[] | null => {
    const words = text.split(/\s+/);
    if (words.length < 2 || text.length < 9) return null;
    let best: string[] | null = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' '); const b = words.slice(i).join(' ');
      if (!best || Math.max(a.length, b.length) < Math.max(best[0].length, best[1].length)) best = [a, b];
    }
    return best;
  };
  function place(text: string, fs: number, base: Cand[], own = -1, mayWrap = false): Cand {
    const two = mayWrap ? split(text) : null;
    const cands: Cand[] = two ? [...base.map((c) => ({ ...c, lines: [text] })), ...base.map((c) => ({ ...c, lines: two }))] : base.map((c) => ({ ...c, lines: [text] }));
    let best = cands[0]; let bestBox: Box = { x1: 0, y1: 0, x2: 0, y2: 0 }; let bestCost = Infinity;
    cands.forEach((c, i) => {
      const lines = c.lines!;
      const w = Math.max(...lines.map((l) => l.length)) * fs * 0.6;
      const extra = (lines.length - 1) * (fs + 2);
      const x1 = c.anchor === 'start' ? c.x : c.anchor === 'end' ? c.x - w : c.x - w / 2;
      // `y` is the baseline of the line nearest the point: a label above grows upward, one below grows downward.
      const up = c.y < (own >= 0 ? markerPts[own].y : c.y + 1);
      const box: Box = { x1: x1 - 2, y1: c.y - fs + 1 - (up ? extra : 0), x2: x1 + w + 2, y2: c.y + 4 + (up ? 0 : extra) };
      let cost = (i % base.length) * 0.5 + (lines.length > 1 ? 8 : 0);
      if (box.x1 < bounds.x1 || box.x2 > bounds.x2 || box.y1 < bounds.y1 || box.y2 > bounds.y2) cost += 400;
      for (const b of placed) if (hit(box, b, 3)) cost += 300;
      const inBox = (p: { x: number; y: number }) => p.x > box.x1 - 2 && p.x < box.x2 + 2 && p.y > box.y1 - 2 && p.y < box.y2 + 2;
      if (curve.some(inBox)) cost += 120;
      if (showTrend && trend.some(inBox)) cost += 40;
      markerPts.forEach((m, mi) => {
        if (mi !== own && hit(box, { x1: m.x - 6, y1: m.y - 6, x2: m.x + 6, y2: m.y + 6 })) cost += 100;
        if ((drawnMarkers[mi].showLine ?? true) && m.x > box.x1 && m.x < box.x2 && box.y2 > m.y) cost += mi === own ? 25 : 45;
      });
      if (cost < bestCost) { bestCost = cost; best = { ...c, y: up ? c.y - extra : c.y }; bestBox = box; }
    });
    placed.push(bestBox);
    return best;
  }

  const markerLabels = drawnMarkers.map((m, i) => {
    const { x, y } = markerPts[i];
    return place(m.label, 11.5, [
      { x, y: y - 11, anchor: 'middle' }, { x: x - 9, y: y - 7, anchor: 'end' }, { x: x + 9, y: y - 7, anchor: 'start' },
      { x: x - 10, y: y + 4, anchor: 'end' }, { x: x + 10, y: y + 4, anchor: 'start' },
      { x, y: y + 20, anchor: 'middle' }, { x: x - 9, y: y + 17, anchor: 'end' }, { x: x + 9, y: y + 17, anchor: 'start' },
      { x, y: y - 26, anchor: 'middle' }, { x: x - 12, y: y - 20, anchor: 'end' }, { x: x + 12, y: y - 20, anchor: 'start' },
      { x: x - 12, y: y + 30, anchor: 'end' }, { x: x + 12, y: y + 30, anchor: 'start' }, { x, y: y - 40, anchor: 'middle' },
    ], i, true);
  });

  // Phases between the turning points, when the figure names its own peaks and troughs.
  const phases: { text: string; at: Cand }[] = [];
  const autoTurns = drawnMarkers.length > 0 && drawnMarkers.every((m) => m.label === 'Peak' || m.label === 'Trough');
  if (labels === 'all' && autoTurns) {
    const turns = [0, ...drawnMarkers.map((m) => m.t).sort((a, b) => a - b), 1];
    for (let i = 0; i + 1 < turns.length; i++) {
      const a = turns[i]; const b = turns[i + 1];
      if ((b - a) * plotW < 84) continue;
      const rising = cycleAt(b) > cycleAt(a);
      const text = rising ? 'Expansion' : 'Contraction';
      // Beside the run, on its open side, at several heights: the middle of a run is where it crosses the trend.
      const spots = [0.5, 0.68, 0.32, 0.8, 0.2].flatMap((f): Cand[] => {
        const t = a + (b - a) * f; const x = xAt(t); const y = yAt(cycleAt(t));
        return rising
          ? [{ x: x + 10, y: y + 15, anchor: 'start' }, { x: x - 10, y: y - 6, anchor: 'end' }]
          : [{ x: x + 10, y: y - 6, anchor: 'start' }, { x: x - 10, y: y + 15, anchor: 'end' }];
      });
      phases.push({ text, at: place(text, 11, spots) });
    }
  }

  // Long-run trend: named where the cycle is farthest from it, on the side the cycle is not.
  let trendLabel: Cand | null = null;
  if (showTrend && labels !== 'none') {
    const spots = Array.from({ length: 17 }, (_, i) => 0.1 + i * 0.05)
      .map((t) => ({ t, d: cycleAt(t) - trendAt(t) }))
      .sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
    const at = (t: number, below: boolean): Cand => ({ x: xAt(t), y: yAt(trendAt(t)) + (below ? 17 : -8), anchor: 'middle' });
    // First the side the cycle is not on, at every spot; then the other side.
    const cands = [...spots.map(({ t, d }) => at(t, d > 0)), ...spots.map(({ t, d }) => at(t, d <= 0))];
    trendLabel = place('Long-run trend', 11.5, cands);
  }

  const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' as const };
  const gapPath = (above: boolean) => {
    // One closed region between cycle and trend, clipped to the side wanted.
    const upper = ts.map((t, i) => ({ x: curve[i].x, y: above ? Math.min(curve[i].y, trend[i].y) : Math.max(curve[i].y, trend[i].y) }));
    return `${toPath(upper)} ${[...trend].reverse().map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')} Z`;
  };

  return (
    <div
      className="business-cycle-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'business cycle'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke="#1f2937" strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke="#1f2937" strokeWidth={1.5} />

        {showOutputGap && (
          <g>
            <path d={gapPath(true)} fill={COLOR_GAP_POS} opacity={0.6} />
            <path d={gapPath(false)} fill={COLOR_GAP_NEG} opacity={0.6} />
          </g>
        )}

        {showTrend && (
          <g
            data-feature={N.trend}
            data-feature-label="trend"
            data-feature-cx={xAt(0.5) / W}
            data-feature-cy={yAt(trendAt(0.5)) / H}
            data-feature-w={plotW / W}
            data-feature-h={20 / H}
          >
            <path d={toPath(trend)} stroke={COLOR_TREND} strokeWidth={2} fill="none" strokeDasharray="6 4" />
          </g>
        )}

        {drawnMarkers.map((m, i) => (m.showLine ?? true) && (
          <line key={`ml-${i}`} x1={markerPts[i].x} y1={markerPts[i].y} x2={markerPts[i].x} y2={PAD_T + plotH} stroke={COLOR_MARKER} strokeDasharray="3 3" strokeWidth={1} opacity={0.8} />
        ))}

        <g
          data-feature={N.cycle}
          data-feature-label="cycle"
          data-feature-cx={xAt(0.5) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={plotW / W}
          data-feature-h={plotH / H}
        >
          <path d={toPath(curve)} stroke={COLOR_CYCLE} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
        </g>

        {trendLabel && (
          <text x={trendLabel.x} y={trendLabel.y} fontSize={11.5} fill="#6b7280" textAnchor={trendLabel.anchor} fontStyle="italic" style={halo}>Long-run trend</text>
        )}
        {phases.map((p, i) => (
          <text key={`ph-${i}`} x={p.at.x} y={p.at.y} fontSize={11} fill={COLOR_LABEL} textAnchor={p.at.anchor} style={halo}>{p.text}</text>
        ))}

        {drawnMarkers.map((m, i) => {
          const { x, y } = markerPts[i]; const lb = markerLabels[i];
          return (
            <g
              key={`mk-${i}`}
              data-feature={N.marker(m.label, i)}
              data-feature-label={m.label}
              data-feature-cx={x / W}
              data-feature-cy={y / H}
              data-feature-w={50 / W}
              data-feature-h={32 / H}
            >
              <circle cx={x} cy={y} r={4.5} fill={COLOR_MARKER} stroke="#fff" strokeWidth={1.5} />
              <text x={lb.x} y={lb.y} fontSize={11.5} fontWeight={700} fill={COLOR_MARKER} textAnchor={lb.anchor} style={halo}>
                {(lb.lines ?? [m.label]).map((ln, li) => <tspan key={li} x={lb.x} dy={li === 0 ? 0 : 13.5}>{ln}</tspan>)}
              </text>
            </g>
          );
        })}

        <text x={PAD_L + plotW / 2} y={H - 16} fontSize={13} fontWeight={600} textAnchor="middle" fill={COLOR_LABEL}>
          Time
        </text>
        <text
          x={24}
          y={PAD_T + plotH / 2}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill={COLOR_LABEL}
          transform={`rotate(-90 24 ${PAD_T + plotH / 2})`}
        >
          Real GDP
        </text>
      </svg>
    </div>
  );
}
