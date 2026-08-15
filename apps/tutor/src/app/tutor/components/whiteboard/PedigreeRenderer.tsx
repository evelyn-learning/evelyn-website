'use client';

import { InlineMathText } from './InlineMathText';
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
import { DIAGRAM_VIEWBOX, feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

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
  /**
   * Optional legend keys. Strings outside the enum (e.g. arbitrary captions
   * from the AI) are ignored — the legend is always rendered from the
   * canonical set so icons cannot contradict their own labels.
   */
  legend?: Array<'unaffected' | 'affected' | 'carrier' | 'deceased' | string>;
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

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildPedigreeManifest(props: PedigreeProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const individuals = props.individuals ?? [];
  const marriages = props.marriages ?? [];
  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  marriages.forEach((m, i) => {
    const labels = new Set<string>([
      `mating-${i + 1}`,
      `mating ${i + 1}`,
      `marriage ${i + 1}`,
      `couple ${i + 1}`,
      `mating line ${i + 1}`,
      `mating between ${m.pair[0]} and ${m.pair[1]}`,
      `${m.pair[0]}-${m.pair[1]}`,
    ]);
    if (m.consanguineous) labels.add(`consanguineous mating ${i + 1}`);
    entries.push({
      name: `mating-${i + 1}`,
      kind: 'edge',
      description: `mating line between ${m.pair[0]} and ${m.pair[1]}${m.consanguineous ? ' (consanguineous)' : ''}`,
      labels: Array.from(labels),
    });
  });
  for (const ind of individuals) {
    const sexLabel = ind.sex === 'male' ? 'male' : ind.sex === 'female' ? 'female' : 'unknown sex';
    const statusLabel = ind.status && ind.status !== 'unaffected' ? `, ${ind.status}` : '';
    const slug = featSlug(ind.id);
    const labels = new Set<string>([
      `person-${slug}`,
      ind.id,
      `individual ${ind.id}`,
      `person ${ind.id}`,
    ]);
    if (ind.label) {
      labels.add(ind.label);
      labels.add(ind.label.toLowerCase());
      labels.add(`the ${ind.label.toLowerCase()}`);
    }
    // Generation-based aliases: "I-1", "individual I-1", "generation I person 1"
    const roman = ROMAN[ind.generation] || String(ind.generation);
    labels.add(`${roman}-${ind.position + 1}`);
    labels.add(`${roman}:${ind.position + 1}`);
    labels.add(`generation ${roman} position ${ind.position + 1}`);
    labels.add(`generation ${ind.generation}, position ${ind.position + 1}`);
    entries.push({
      name: `person-${slug}`,
      kind: 'node',
      description: `${ind.label || ind.id} (${sexLabel}${statusLabel}, generation ${ind.generation})`,
      labels: Array.from(labels),
    });
  }
  return entries;
}

export default function PedigreeRenderer({
  title, individuals, marriages = [], children = [], notes,
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

  // Auto-build a legend from what's actually in the data. This always
  // includes the sex shapes that appear (square/circle) and every status
  // that appears. We intentionally ignore arbitrary strings passed in
  // `legend` — prior versions accepted freeform captions like
  // "Filled = Affected", which rendered as default unfilled squares and
  // contradicted their own labels.
  const hasMale = individuals.some((i) => i.sex === 'male' || i.sex === 'unknown');
  const hasFemale = individuals.some((i) => i.sex === 'female');
  const statusSet = new Set<'unaffected' | 'affected' | 'carrier' | 'deceased'>();
  individuals.forEach((i) => statusSet.add((i.status || 'unaffected') as 'unaffected' | 'affected' | 'carrier' | 'deceased'));

  interface LegendEntry { kind: 'shape' | 'status'; shape?: 'square' | 'circle'; status?: 'unaffected' | 'affected' | 'carrier' | 'deceased'; text: string }
  const entries: LegendEntry[] = [];
  if (hasMale) entries.push({ kind: 'shape', shape: 'square', text: '□ Male' });
  if (hasFemale) entries.push({ kind: 'shape', shape: 'circle', text: '○ Female' });
  if (statusSet.has('affected')) entries.push({ kind: 'status', status: 'affected', text: 'Affected' });
  if (statusSet.has('carrier')) entries.push({ kind: 'status', status: 'carrier', text: 'Carrier' });
  if (statusSet.has('unaffected')) entries.push({ kind: 'status', status: 'unaffected', text: 'Unaffected' });
  if (statusSet.has('deceased')) entries.push({ kind: 'status', status: 'deceased', text: 'Deceased' });

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
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
            <g key={`m${i}`} {...feat(`mating-${i + 1}`, { cx: (pa.x + pb.x) / 2, cy: (pa.y + pb.y) / 2, w: Math.abs(pb.x - pa.x) + 20, h: 20 })}>
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
            <g key={ind.id} {...feat(`person-${featSlug(ind.id)}`, { cx: x, cy: y, w: nodeR * 2 + 8, h: nodeR * 2 + 8 })}>
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

        {/* Legend — auto-sized to fit inside the viewBox. Each entry's
            width is estimated from its label length so long captions don't
            push later items off the right edge. */}
        {(() => {
          const iconW = 14;
          const iconGap = 6;
          const entryGap = 14;
          const charW = 5.6; // approx px for 10-px sans-serif digit/letter
          const widths = entries.map((e) => iconW + iconGap + e.text.length * charW);
          const total = widths.reduce((a, b) => a + b, 0) + Math.max(0, entries.length - 1) * entryGap;
          const available = W - pad.left - pad.right;
          const scale = total > available && total > 0 ? available / total : 1;
          const scaledEntryGap = entryGap * scale;
          const scaledCharW = charW * scale;
          const scaledIconW = iconW * scale;
          const iconH = 14 * scale;
          const fontSize = Math.max(9, 10 * scale);
          let cursor = 0;
          return (
            <g transform={`translate(${pad.left + (available - total * scale) / 2}, ${H - 20})`}>
              {entries.map((e, i) => {
                const eW = scaledIconW + iconGap + e.text.length * scaledCharW;
                const gx = cursor;
                cursor += eW + scaledEntryGap;
                const iconCx = gx + scaledIconW / 2;
                const iconCy = 0;
                return (
                  <g key={`${e.kind}-${e.text}-${i}`}>
                    {e.kind === 'shape' && e.shape === 'square' && (
                      <rect x={gx} y={iconCy - iconH / 2} width={scaledIconW} height={iconH} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                    )}
                    {e.kind === 'shape' && e.shape === 'circle' && (
                      <circle cx={iconCx} cy={iconCy} r={iconH / 2} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                    )}
                    {e.kind === 'status' && (() => {
                      const sym = symbolForStatus(e.status);
                      return (
                        <g>
                          <rect x={gx} y={iconCy - iconH / 2} width={scaledIconW} height={iconH} fill={sym.fill} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                          {sym.half && <rect x={gx} y={iconCy - iconH / 2} width={scaledIconW / 2} height={iconH} fill={DIAGRAM_COLORS.slate} />}
                          {sym.strike && <line x1={gx - 2} y1={iconCy + iconH / 2 + 2} x2={gx + scaledIconW + 2} y2={iconCy - iconH / 2 - 2} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />}
                        </g>
                      );
                    })()}
                    <text x={gx + scaledIconW + iconGap} y={iconCy + fontSize / 3} fontSize={fontSize} fill={DIAGRAM_COLORS.text}>{e.text}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
