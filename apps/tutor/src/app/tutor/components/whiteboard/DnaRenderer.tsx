'use client';

import { InlineMathText } from './InlineMathText';
/**
 * DNA Renderer
 *
 * Two modes:
 *   - 'helix': idealized double helix with the two sugar-phosphate backbones
 *     and base pairs ladder-rungs between them.
 *   - 'base-pairs': straight ladder with explicit base labels (A-T, G-C)
 *     for teaching complementary pairing & transcription.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface DnaProps {
  title?: string;
  mode?: 'helix' | 'base-pairs';
  /** For base-pairs mode: the 5'→3' sequence on the TOP strand. The bottom strand
   *  is auto-complemented (A↔T, G↔C) unless `complement` is supplied. */
  sequence?: string;
  complement?: string;
  /** For base-pairs mode: mRNA strand to display beneath the DNA (transcription). */
  mrna?: string;
  /** For helix mode: number of base-pair rungs to draw. Default 12. */
  rungs?: number;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

const BASE_COLORS: Record<string, string> = {
  A: '#22c55e', T: '#ef4444', G: '#3b82f6', C: '#f59e0b', U: '#a855f7',
};

function complementBase(b: string): string {
  const map: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G', U: 'A' };
  return map[b.toUpperCase()] || b;
}

function transcribeBase(b: string): string {
  // Template strand base → mRNA base
  const map: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };
  return map[b.toUpperCase()] || b;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildDnaManifest(props: DnaProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const mode = props.mode ?? 'helix';
  entries.push({
    name: 'strand-1',
    kind: 'curve',
    description: 'sugar-phosphate backbone strand 1 (primary color)',
    labels: ['strand-1', 'strand 1', 'first strand', 'top strand', 'sense strand', "5' strand", 'primary strand'],
  });
  entries.push({
    name: 'strand-2',
    kind: 'curve',
    description: 'sugar-phosphate backbone strand 2 (secondary color)',
    labels: ['strand-2', 'strand 2', 'second strand', 'bottom strand', 'antisense strand', 'template strand', "3' strand", 'complementary strand'],
  });

  const BASE_NAMES: Record<string, string> = { A: 'adenine', T: 'thymine', G: 'guanine', C: 'cytosine', U: 'uracil' };
  const complement: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G', U: 'A' };

  if (mode === 'base-pairs') {
    const top = (props.sequence || 'ATGCATGC').toUpperCase().replace(/[^ATGCU]/g, '');
    const bot = (props.complement || top.split('').map((b) => complement[b] || b).join('')).toUpperCase();
    const n = top.length;
    for (let i = 0; i < n; i++) {
      const b1 = top[i];
      const b2 = bot[i] || complement[b1] || '-';
      const fullName1 = BASE_NAMES[b1];
      const fullName2 = BASE_NAMES[b2];
      const labels = new Set<string>([
        `basepair-${i + 1}`,
        `base pair ${i + 1}`,
        `pair ${i + 1}`,
        `column ${i + 1}`,
        `${b1}-${b2}`,
        `${b1}${b2}`,
        `${b2}-${b1}`,
      ]);
      if (fullName1 && fullName2) {
        labels.add(`${fullName1}-${fullName2} pair`);
        labels.add(`${fullName1} ${fullName2} pair`);
        labels.add(`${fullName1}-${fullName2}`);
      }
      entries.push({
        name: `basepair-${i + 1}`,
        kind: 'object',
        description: `base pair ${i + 1} (column ${i + 1} of the ladder)`,
        labels: Array.from(labels),
      });
    }
  } else {
    // helix mode — synthetic bases cycle A,T,G,C (matches renderer)
    const rungs = props.rungs ?? 12;
    const bases = ['A', 'T', 'G', 'C'];
    for (let i = 0; i < rungs; i++) {
      const b1 = bases[i % 4];
      const b2 = complement[b1];
      const labels = new Set<string>([
        `basepair-${i + 1}`,
        `base pair ${i + 1}`,
        `rung ${i + 1}`,
        `pair ${i + 1}`,
        `${b1}-${b2}`,
        `${b1}${b2}`,
      ]);
      const fn1 = BASE_NAMES[b1];
      const fn2 = BASE_NAMES[b2];
      if (fn1 && fn2) {
        labels.add(`${fn1}-${fn2} pair`);
        labels.add(`${fn1} ${fn2} pair`);
      }
      entries.push({
        name: `basepair-${i + 1}`,
        kind: 'object',
        description: `base pair rung ${i + 1} on the helix`,
        labels: Array.from(labels),
      });
    }
  }
  return entries;
}

export default function DnaRenderer({ title, mode = 'helix', sequence, complement, mrna, rungs = 12, notes }: DnaProps) {
  if (mode === 'base-pairs') {
    const top = (sequence || 'ATGCATGC').toUpperCase().replace(/[^ATGCU]/g, '') || 'ATGCATGC';
    const bot = (complement || top.split('').map(complementBase).join('')).toUpperCase();
    // `mrna: ""` asks for the transcript to be worked out: read off the template
    // (bottom, 3′→5′) strand, so it matches the top strand with U in place of T.
    const mrnaSeq = typeof mrna === 'string'
      ? (mrna.trim() ? mrna.toUpperCase().replace(/[^AUGCT]/g, '') : bot.split('').map(transcribeBase).join(''))
      : null;
    return renderBasePairs({ title, top, bot, mrna: mrnaSeq, notes });
  }
  const n = Number.isFinite(rungs) ? Math.max(4, Math.min(40, Math.round(rungs))) : 12;
  return renderHelix({ title, rungs: n, notes });
}

const BASE_FULL: Record<string, string> = { A: 'Adenine', T: 'Thymine', G: 'Guanine', C: 'Cytosine', U: 'Uracil' };

function renderHelix({ title, rungs = 12, notes }: { title?: string; rungs?: number; notes?: string }) {
  const cx = 150;
  const top = 18;
  const bot = H - 18;
  const length = bot - top;
  const amp = 54;
  const waves = 2.5;
  const step = length / rungs;
  const rungW = Math.max(2, Math.min(5, step * 0.42));

  const xAt = (t: number, phase: number) => cx + amp * Math.sin(t * waves * 2 * Math.PI + phase);
  const pointOnBackbone = (i: number, phase: number) => {
    const t = i / rungs;
    return { x: xAt(t, phase), y: top + t * length };
  };
  const strandPath = (t0: number, t1: number, phase: number) => {
    const a = Math.max(0, t0); const b = Math.min(1, t1);
    const n = 24;
    let d = '';
    for (let i = 0; i <= n; i++) {
      const t = a + ((b - a) * i) / n;
      d += `${i === 0 ? 'M' : 'L'} ${xAt(t, phase).toFixed(1)} ${(top + t * length).toFixed(1)} `;
    }
    return d;
  };
  // The strands cross every half turn. Cut each strand into pieces centred on
  // a crossing and alternate which one passes in front, so the ribbon reads
  // as a twist rather than two overlapping zig-zags.
  const half = 1 / (2 * waves);
  const pieces: Array<{ t0: number; t1: number; front: 0 | 1 }> = [];
  for (let k = 0; (k - 0.5) * half < 1; k++) pieces.push({ t0: (k - 0.5) * half, t1: (k + 0.5) * half, front: (k % 2) as 0 | 1 });
  const strandColor = [DIAGRAM_COLORS.primary, DIAGRAM_COLORS.secondary];
  const phases = [0, Math.PI];

  // Callouts: a backbone crest and the widest rung nearest the middle.
  const crestT = 0.25 / waves;
  const crest = { x: xAt(crestT, 0), y: top + crestT * length };
  let pairIdx = 0; let pairBest = -1;
  for (let i = 0; i < rungs; i++) {
    const t = (i + 0.5) / rungs;
    // (a wide rung in the upper-middle, so the key fits underneath its label)
    const width = Math.abs(Math.sin(t * waves * 2 * Math.PI)) - Math.abs(t - 0.32) * 0.9;
    if (width > pairBest) { pairBest = width; pairIdx = i; }
  }
  const pairT = (pairIdx + 0.5) / rungs;
  const pairRight = Math.max(xAt(pairT, 0), xAt(pairT, Math.PI));
  const pairY = top + pairT * length;
  const labelX = 262;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 420 }}>
        {/* Base-pair rungs first (behind backbones): each half takes its base's colour */}
        {Array.from({ length: rungs }, (_, i) => {
          const p1 = pointOnBackbone(i + 0.5, 0);
          const p2 = pointOnBackbone(i + 0.5, Math.PI);
          const bases = ['A', 'T', 'G', 'C'];
          const b1 = bases[i % 4];
          const b2 = complementBase(b1);
          const mx = (p1.x + p2.x) / 2;
          return (
            <g key={i} {...feat(`basepair-${i + 1}`, { cx: mx, cy: p1.y, w: Math.abs(p2.x - p1.x) + 24, h: Math.max(12, step) })}>
              <line x1={p1.x} y1={p1.y} x2={mx} y2={p1.y} stroke={BASE_COLORS[b1]} strokeWidth={rungW} />
              <line x1={mx} y1={p2.y} x2={p2.x} y2={p2.y} stroke={BASE_COLORS[b2]} strokeWidth={rungW} />
            </g>
          );
        })}

        {/* Backbones, woven */}
        <g {...feat('strand-1', { cx, cy: (top + bot) / 2, w: amp * 2 + 20, h: bot - top + 20 })} />
        <g {...feat('strand-2', { cx, cy: (top + bot) / 2, w: amp * 2 + 20, h: bot - top + 20 })} />
        {pieces.map((pc, i) => {
          const back = pc.front === 0 ? 1 : 0;
          return (
            <g key={i}>
              <path d={strandPath(pc.t0, pc.t1, phases[back])} stroke={strandColor[back]} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d={strandPath(pc.t0 + half * 0.4, pc.t1 - half * 0.4, phases[pc.front])} stroke="white" strokeWidth={7} fill="none" />
              <path d={strandPath(pc.t0, pc.t1, phases[pc.front])} stroke={strandColor[pc.front]} strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Callouts */}
        <line x1={crest.x + 5} y1={crest.y} x2={labelX - 6} y2={crest.y} stroke={DIAGRAM_COLORS.slate} strokeWidth={0.9} />
        <circle cx={crest.x + 3} cy={crest.y} r={2} fill={DIAGRAM_COLORS.slate} />
        <text x={labelX} y={crest.y + 4} fontSize={12} fontWeight={600} fill={DIAGRAM_COLORS.text}>Sugar–phosphate backbone</text>
        <text x={labelX} y={crest.y + 18} fontSize={10.5} fill={DIAGRAM_COLORS.muted}>two strands, running in opposite directions</text>

        <line x1={pairRight + 6} y1={pairY} x2={labelX - 6} y2={pairY} stroke={DIAGRAM_COLORS.slate} strokeWidth={0.9} />
        <circle cx={pairRight + 6} cy={pairY} r={2} fill={DIAGRAM_COLORS.slate} />
        <text x={labelX} y={pairY + 4} fontSize={12} fontWeight={600} fill={DIAGRAM_COLORS.text}>Base pair</text>
        <text x={labelX} y={pairY + 18} fontSize={10.5} fill={DIAGRAM_COLORS.muted}>two bases joined by hydrogen bonds</text>

        {/* Legend: which base pairs with which */}
        <g transform={`translate(${labelX}, ${Math.min(H - 78, Math.max(pairY + 58, 236))})`}>
          <text x={0} y={0} fontSize={11} fontWeight={600} fill={DIAGRAM_COLORS.text}>Complementary bases</text>
          {[['A', 'T'], ['G', 'C']].map(([b1, b2], i) => (
            <g key={b1} transform={`translate(0, ${16 + i * 22})`}>
              <rect x={0} y={-3} width={26} height={7} rx={2} fill={BASE_COLORS[b1]} />
              <text x={32} y={5} fontSize={11} fill={DIAGRAM_COLORS.text}>{BASE_FULL[b1]} ({b1})</text>
              <text x={108} y={5} fontSize={11} fill={DIAGRAM_COLORS.muted}>pairs with</text>
              <rect x={166} y={-3} width={26} height={7} rx={2} fill={BASE_COLORS[b2]} />
              <text x={198} y={5} fontSize={11} fill={DIAGRAM_COLORS.text}>{BASE_FULL[b2]} ({b2})</text>
            </g>
          ))}
        </g>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}

function renderBasePairs({ title, top, bot, mrna, notes }: { title?: string; top: string; bot: string; mrna: string | null; notes?: string }) {
  const n = top.length;
  // Long sequences wrap onto several rows instead of shrinking past legibility.
  const MAX_PER_ROW = 20;
  const rowCount = Math.ceil(n / MAX_PER_ROW);
  const perRow = Math.ceil(n / rowCount);
  const gutter = 58;
  const colW = Math.min(34, (W - 2 * gutter) / perRow);
  const cell = Math.min(24, colW - 3);
  const fs = Math.max(10, Math.round(cell * 0.58));
  const totalW = colW * perRow;
  const startX = (W - totalW) / 2;
  const strandGap = cell + 20;
  const blockH = (mrna !== null ? 2 : 1) * strandGap + cell + (mrna !== null ? 34 : 30);
  const firstTop = 26;
  const captionY = firstTop + rowCount * blockH + 4;
  const VH = captionY + 16;
  const vb = { width: W, height: VH };
  const endFs = 11;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${VH}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 420 }}>
        <g {...feat('strand-1', { cx: W / 2, cy: firstTop, w: totalW + 20, h: 16 }, vb)} />
        <g {...feat('strand-2', { cx: W / 2, cy: firstTop + strandGap, w: totalW + 20, h: 16 }, vb)} />
        {Array.from({ length: rowCount }, (_, r) => {
          const from = r * perRow;
          const count = Math.min(perRow, n - from);
          const rowW = count * colW;
          const topY = firstTop + r * blockH + cell / 2 + 6;
          const botY = topY + strandGap;
          const mrnaY = botY + strandGap + 4;
          const railTop = topY - cell / 2 - 5;
          const railBot = botY + cell / 2 + 5;
          const lx = startX - 10;
          const rx = startX + rowW + 10;
          return (
            <g key={r}>
              {/* strand ends */}
              <text x={lx} y={topY + 4} fontSize={endFs} fill={DIAGRAM_COLORS.primary} textAnchor="end" fontWeight={700}>{r === 0 ? '5′' : '…'}</text>
              <text x={rx} y={topY + 4} fontSize={endFs} fill={DIAGRAM_COLORS.primary} fontWeight={700}>{r === rowCount - 1 ? '3′' : '…'}</text>
              <text x={lx} y={botY + 4} fontSize={endFs} fill={DIAGRAM_COLORS.secondary} textAnchor="end" fontWeight={700}>{r === 0 ? '3′' : '…'}</text>
              <text x={rx} y={botY + 4} fontSize={endFs} fill={DIAGRAM_COLORS.secondary} fontWeight={700}>{r === rowCount - 1 ? '5′' : '…'}</text>

              {/* Backbones as thick rails */}
              <line x1={startX} y1={railTop} x2={startX + rowW} y2={railTop} stroke={DIAGRAM_COLORS.primary} strokeWidth={3} strokeLinecap="round" />
              <line x1={startX} y1={railBot} x2={startX + rowW} y2={railBot} stroke={DIAGRAM_COLORS.secondary} strokeWidth={3} strokeLinecap="round" />

              {/* Bases + hydrogen-bond lines */}
              {top.slice(from, from + count).split('').map((b, j) => {
                const i = from + j;
                const x = startX + j * colW + colW / 2;
                const color = BASE_COLORS[b] || DIAGRAM_COLORS.text;
                const bb = bot[i] || '-';
                const colorB = BASE_COLORS[bb] || DIAGRAM_COLORS.muted;
                return (
                  <g key={i} {...feat(`basepair-${i + 1}`, { cx: x, cy: (topY + botY) / 2, w: colW, h: botY - topY + cell + 8 }, vb)}>
                    <line x1={x} y1={topY + cell / 2} x2={x} y2={botY - cell / 2} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.2} strokeDasharray="2.5 2.5" />
                    <rect x={x - cell / 2} y={topY - cell / 2} width={cell} height={cell} rx={3} fill={color} />
                    <text x={x} y={topY + fs * 0.36} fontSize={fs} fill="white" textAnchor="middle" fontWeight={700}>{b}</text>
                    <rect x={x - cell / 2} y={botY - cell / 2} width={cell} height={cell} rx={3} fill={colorB} />
                    <text x={x} y={botY + fs * 0.36} fontSize={fs} fill="white" textAnchor="middle" fontWeight={700}>{bb}</text>
                  </g>
                );
              })}

              {/* mRNA row */}
              {mrna !== null && (
                <g>
                  {r === 0 && (
                    <text x={lx} y={mrnaY - cell / 2 - 5} fontSize={10} fill={DIAGRAM_COLORS.accent} textAnchor="end" fontWeight={700}>mRNA</text>
                  )}
                  <text x={lx} y={mrnaY + 4} fontSize={endFs} fill={DIAGRAM_COLORS.accent} textAnchor="end" fontWeight={700}>{r === 0 ? '5′' : '…'}</text>
                  <text x={rx} y={mrnaY + 4} fontSize={endFs} fill={DIAGRAM_COLORS.accent} fontWeight={700}>{r === rowCount - 1 ? '3′' : '…'}</text>
                  <line x1={startX} y1={mrnaY + cell / 2 + 5} x2={startX + rowW} y2={mrnaY + cell / 2 + 5} stroke={DIAGRAM_COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
                  {mrna.slice(from, from + count).split('').map((b, j) => {
                    const x = startX + j * colW + colW / 2;
                    const color = BASE_COLORS[b] || DIAGRAM_COLORS.muted;
                    return (
                      <g key={j}>
                        <rect x={x - cell / 2} y={mrnaY - cell / 2} width={cell} height={cell} rx={3} fill={color} />
                        <text x={x} y={mrnaY + fs * 0.36} fontSize={fs} fill="white" textAnchor="middle" fontWeight={700}>{b}</text>
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}
        <text x={W / 2} y={captionY} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle">
          {mrna !== null ? 'A pairs with T, G pairs with C · in mRNA, U takes the place of T' : 'A pairs with T · G pairs with C'}
        </text>
      </svg>
      <DiagramNotes notes={notes} />
    </div>
  );
}
