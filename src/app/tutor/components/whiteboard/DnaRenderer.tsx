'use client';

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
import { DIAGRAM_VIEWBOX } from '@/lib/tutor/diagrams/layout';
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

export default function DnaRenderer({ title, mode = 'helix', sequence, complement, mrna, rungs = 12, notes }: DnaProps) {
  if (mode === 'base-pairs') {
    const top = (sequence || 'ATGCATGC').toUpperCase().replace(/[^ATGCU]/g, '');
    const bot = (complement || top.split('').map(complementBase).join('')).toUpperCase();
    const mrnaSeq = mrna ? mrna.toUpperCase() : null;
    return renderBasePairs({ title, top, bot, mrna: mrnaSeq, notes });
  }
  return renderHelix({ title, rungs, notes });
}

function renderHelix({ title, rungs = 12, notes }: { title?: string; rungs?: number; notes?: string }) {
  const cx = W / 2;
  const top = title ? 40 : 18;
  const bot = notes ? H - 32 : H - 22;
  const length = bot - top;
  const amp = 60;
  const waves = 2.5;
  const step = length / rungs;

  const pointOnBackbone = (i: number, phase: number) => {
    const t = i / rungs;
    const y = top + t * length;
    const x = cx + amp * Math.sin(t * waves * 2 * Math.PI + phase);
    return { x, y };
  };

  const backbone1: string[] = [];
  const backbone2: string[] = [];
  for (let i = 0; i <= rungs * 4; i++) {
    const t = i / (rungs * 4);
    const y = top + t * length;
    backbone1.push(`${i === 0 ? 'M' : 'L'} ${cx + amp * Math.sin(t * waves * 2 * Math.PI)} ${y}`);
    backbone2.push(`${i === 0 ? 'M' : 'L'} ${cx + amp * Math.sin(t * waves * 2 * Math.PI + Math.PI)} ${y}`);
  }

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Base-pair rungs first (behind backbones) */}
        {Array.from({ length: rungs }, (_, i) => {
          const p1 = pointOnBackbone(i + 0.5, 0);
          const p2 = pointOnBackbone(i + 0.5, Math.PI);
          const bases = ['A', 'T', 'G', 'C'];
          const b1 = bases[i % 4];
          const b2 = complementBase(b1);
          return (
            <g key={i}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} />
              <circle cx={p1.x} cy={p1.y} r={5} fill={BASE_COLORS[b1]} />
              <circle cx={p2.x} cy={p2.y} r={5} fill={BASE_COLORS[b2]} />
            </g>
          );
        })}

        {/* Backbones */}
        <path d={backbone1.join(' ')} stroke={DIAGRAM_COLORS.primary} strokeWidth={3} fill="none" />
        <path d={backbone2.join(' ')} stroke={DIAGRAM_COLORS.secondary} strokeWidth={3} fill="none" />

        {/* Legend */}
        <g transform={`translate(20, ${H - 52})`}>
          {Object.entries(BASE_COLORS).filter(([b]) => b !== 'U').map(([b, c], i) => (
            <g key={b} transform={`translate(${i * 44}, 0)`}>
              <circle cx={6} cy={6} r={5} fill={c} />
              <text x={14} y={10} fontSize={10} fill={DIAGRAM_COLORS.text}>{b}</text>
            </g>
          ))}
        </g>
        <text x={20} y={H - 68} fontSize={10} fill={DIAGRAM_COLORS.muted}>sugar-phosphate backbones ↔ base-pair rungs</text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}

function renderBasePairs({ title, top, bot, mrna, notes }: { title?: string; top: string; bot: string; mrna: string | null; notes?: string }) {
  const pad = { top: title ? 44 : 24, bottom: notes ? 36 : 22, left: 20, right: 20 };
  const n = top.length;
  const colW = Math.min(28, (W - pad.left - pad.right) / Math.max(n, 1));
  const totalW = colW * n;
  const startX = (W - totalW) / 2;
  const topY = pad.top + 30;
  const botY = topY + 42;
  const mrnaY = botY + 42;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* 5'/3' labels */}
        <text x={startX - 12} y={topY} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end" fontWeight={600}>5'</text>
        <text x={startX + totalW + 12} y={topY} fontSize={11} fill={DIAGRAM_COLORS.muted} fontWeight={600}>3'</text>
        <text x={startX - 12} y={botY} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end" fontWeight={600}>3'</text>
        <text x={startX + totalW + 12} y={botY} fontSize={11} fill={DIAGRAM_COLORS.muted} fontWeight={600}>5'</text>

        {/* Backbones as thick lines */}
        <line x1={startX} y1={topY - 14} x2={startX + totalW} y2={topY - 14} stroke={DIAGRAM_COLORS.primary} strokeWidth={3} />
        <line x1={startX} y1={botY + 14} x2={startX + totalW} y2={botY + 14} stroke={DIAGRAM_COLORS.secondary} strokeWidth={3} />

        {/* Bases + pair lines */}
        {top.split('').map((b, i) => {
          const x = startX + i * colW + colW / 2;
          const color = BASE_COLORS[b] || DIAGRAM_COLORS.text;
          const bb = bot[i] || '-';
          const colorB = BASE_COLORS[bb] || DIAGRAM_COLORS.text;
          return (
            <g key={i}>
              <line x1={x} y1={topY + 2} x2={x} y2={botY - 14} stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="2 2" />
              <rect x={x - 10} y={topY - 10} width={20} height={20} rx={3} fill={color} />
              <text x={x} y={topY + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>{b}</text>
              <rect x={x - 10} y={botY - 10} width={20} height={20} rx={3} fill={colorB} />
              <text x={x} y={botY + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>{bb}</text>
            </g>
          );
        })}

        {/* mRNA row */}
        {mrna !== null && (() => {
          const seq = mrna ?? top.split('').map(transcribeBase).reverse().join('');
          return (
            <g>
              <text x={startX - 12} y={mrnaY} fontSize={11} fill={DIAGRAM_COLORS.accent} textAnchor="end" fontWeight={700}>mRNA</text>
              <line x1={startX} y1={mrnaY + 14} x2={startX + totalW} y2={mrnaY + 14} stroke={DIAGRAM_COLORS.accent} strokeWidth={2} />
              {seq.split('').map((b, i) => {
                const x = startX + i * colW + colW / 2;
                const color = BASE_COLORS[b] || DIAGRAM_COLORS.text;
                return (
                  <g key={i}>
                    <rect x={x - 10} y={mrnaY - 10} width={20} height={20} rx={3} fill={color} />
                    <text x={x} y={mrnaY + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>{b}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
