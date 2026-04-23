'use client';

/**
 * Pedigree Renderer
 *
 * Standard family-pedigree notation: squares = male, circles = female, filled
 * = affected, half-filled = carrier. Horizontal lines between individuals
 * show marriages; vertical lines drop to their offspring rows.
 *
 * Accepts individuals with generation + position-in-generation coordinates
 * and a list of parent→child and marriage edges.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX } from '@/lib/tutor/diagrams/layout';

export interface PedigreeIndividual {
  id: string;
  sex: 'male' | 'female' | 'unknown';
  status?: 'unaffected' | 'affected' | 'carrier' | 'deceased';
  label?: string;
  generation: number;   // 1-based (I, II, III, ...)
  position: number;     // 0-based left-to-right within that generation
}

export interface PedigreeMarriage {
  /** The two individual IDs forming the couple. */
  pair: [string, string];
  /** Consanguineous (parallel horizontal line). Default false. */
  consanguineous?: boolean;
}

export interface PedigreeChild {
  parents: [string, string];
  childId: string;
}

export interface PedigreeProps {
  title?: string;
  individuals: PedigreeIndividual[];
  marriages?: PedigreeMarriage[];
  children?: PedigreeChild[];
  /** Legend keys to show. Default auto-detected from individuals. */
  legend?: Array<'unaffected' | 'affected' | 'carrier' | 'deceased'>;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

function symbolForStatus(status: PedigreeIndividual['status']): { fill: string; half?: boolean; strike?: boolean } {
  if (status === 'affected') return { fill: DIAGRAM_COLORS.slate };
  if (status === 'carrier') return { fill: DIAGRAM_COLORS.slate, half: true };
  if (status === 'deceased') return { fill: 'white', strike: true };
  return { fill: 'white' };
}

export default function PedigreeRenderer({
  title, individuals, marriages = [], children = [], legend, notes,
}: PedigreeProps) {
  if (!individuals || individuals.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No pedigree data.</div>;
  }

  const pad = { top: title ? 42 : 28, bottom: 40, left: 40, right: 40 };
  const maxGen = Math.max(...individuals.map((i) => i.generation));
  const maxPosByGen = new Map<number, number>();
  individuals.forEach((ind) => {
    maxPosByGen.set(ind.generation, Math.max(maxPosByGen.get(ind.generation) ?? 0, ind.position));
  });

  const rowSpacing = (H - pad.top - pad.bottom) / Math.max(maxGen, 1);
  const nodeR = 14;

  const byId = new Map(individuals.map((i) => [i.id, i]));
  const place = (ind: PedigreeIndividual) => {
    const row = pad.top + (ind.generation - 0.5) * rowSpacing;
    const cols = (maxPosByGen.get(ind.generation) ?? 0) + 1;
    const colW = (W - pad.left - pad.right) / cols;
    const x = pad.left + (ind.position + 0.5) * colW;
    return { x, y: row };
  };

  // Roman-numeral generation labels on the left.
  const roman = (n: number) => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n] || String(n);

  const autoLegend = new Set<'unaffected' | 'affected' | 'carrier' | 'deceased'>();
  individuals.forEach((i) => autoLegend.add((i.status || 'unaffected') as 'unaffected' | 'affected' | 'carrier' | 'deceased'));
  const shownLegend = legend || Array.from(autoLegend);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Generation labels */}
        {Array.from({ length: maxGen }, (_, i) => {
          const g = i + 1;
          return (
            <text key={g} x={16} y={pad.top + (g - 0.5) * rowSpacing + 4} fontSize={12} fill={DIAGRAM_COLORS.muted} fontWeight={700}>
              {roman(g)}
            </text>
          );
        })}

        {/* Marriages — horizontal line between pair */}
        {marriages.map((m, i) => {
          const a = byId.get(m.pair[0]); const b = byId.get(m.pair[1]);
          if (!a || !b) return null;
          const pa = place(a); const pb = place(b);
          return (
            <g key={`m${i}`}>
              <line x1={pa.x + nodeR} y1={pa.y} x2={pb.x - nodeR} y2={pb.y} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
              {m.consanguineous && (
                <line x1={pa.x + nodeR} y1={pa.y - 2} x2={pb.x - nodeR} y2={pb.y - 2} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
              )}
            </g>
          );
        })}

        {/* Children — drop lines from marriage midpoint */}
        {children.map((c, i) => {
          const p1 = byId.get(c.parents[0]); const p2 = byId.get(c.parents[1]);
          const child = byId.get(c.childId);
          if (!p1 || !p2 || !child) return null;
          const mid = { x: (place(p1).x + place(p2).x) / 2, y: place(p1).y };
          const ch = place(child);
          const horizontalY = ch.y - nodeR - 10;
          return (
            <g key={`c${i}`}>
              <line x1={mid.x} y1={mid.y} x2={mid.x} y2={horizontalY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
              <line x1={mid.x} y1={horizontalY} x2={ch.x} y2={horizontalY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
              <line x1={ch.x} y1={horizontalY} x2={ch.x} y2={ch.y - nodeR} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
            </g>
          );
        })}

        {/* Individuals */}
        {individuals.map((ind) => {
          const { x, y } = place(ind);
          const sym = symbolForStatus(ind.status);
          return (
            <g key={ind.id}>
              {ind.sex === 'male' || ind.sex === 'unknown' ? (
                <g>
                  <rect x={x - nodeR} y={y - nodeR} width={nodeR * 2} height={nodeR * 2} fill={sym.fill} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
                  {sym.half && (
                    <rect x={x - nodeR} y={y - nodeR} width={nodeR} height={nodeR * 2} fill={DIAGRAM_COLORS.slate} />
                  )}
                </g>
              ) : (
                <g>
                  <circle cx={x} cy={y} r={nodeR} fill={sym.fill} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
                  {sym.half && (
                    <path d={`M ${x} ${y - nodeR} A ${nodeR} ${nodeR} 0 0 0 ${x} ${y + nodeR} Z`} fill={DIAGRAM_COLORS.slate} />
                  )}
                </g>
              )}
              {sym.strike && (
                <line x1={x - nodeR - 4} y1={y + nodeR + 4} x2={x + nodeR + 4} y2={y - nodeR - 4} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
              )}
              {ind.sex === 'unknown' && (
                <text x={x} y={y + 4} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle">?</text>
              )}
              <text x={x} y={y + nodeR + 12} fontSize={10} fill={DIAGRAM_COLORS.text} textAnchor="middle">{ind.label || ind.id}</text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${pad.left}, ${H - 26})`}>
          {shownLegend.map((key, i) => {
            const x = i * 110;
            const sym = symbolForStatus(key);
            return (
              <g key={key} transform={`translate(${x}, 0)`}>
                <rect x={0} y={-8} width={14} height={14} fill={sym.fill} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                {sym.half && <rect x={0} y={-8} width={7} height={14} fill={DIAGRAM_COLORS.slate} />}
                <text x={20} y={3} fontSize={10} fill={DIAGRAM_COLORS.text}>{key}</text>
              </g>
            );
          })}
        </g>

        {notes && (
          <text x={W / 2} y={H - 4} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
