'use client';

/**
 * Cell Diagram Renderer
 *
 * Simplified animal or plant cell with labeled organelles. Organelle positions
 * are fixed by type to maintain textbook recognizability (nucleus center,
 * mitochondria scattered, ER around nucleus, etc). The tutor specifies which
 * organelles to highlight plus an optional custom label.
 */

import React from 'react';
import { DIAGRAM_COLORS, withAlpha } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface CellDiagramProps {
  title?: string;
  type: 'animal' | 'plant';
  /** Which organelles to highlight. Default: show ALL organelles for the cell type unlabeled. */
  highlight?: Array<{ organelle: string; note?: string; color?: string }>;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

interface Organelle {
  id: string;
  label: string;
  render: (highlight?: { color?: string }) => React.ReactElement;
  /** Label-line callout target. */
  labelPos: { x: number; y: number };
}

function makeOrganelles(cellType: 'animal' | 'plant'): Organelle[] {
  const cx = W / 2; const cy = H / 2 + 6;
  const list: Organelle[] = [
    {
      id: 'nucleus',
      label: 'Nucleus',
      labelPos: { x: cx, y: cy },
      render: (h) => (
        <g>
          <circle cx={cx} cy={cy} r={40} fill={h?.color || '#93c5fd'} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.5} />
          <circle cx={cx + 5} cy={cy - 5} r={8} fill={DIAGRAM_COLORS.primary} opacity={0.6} />
        </g>
      ),
    },
    {
      id: 'mitochondria',
      label: 'Mitochondria',
      labelPos: { x: cx + 90, y: cy - 60 },
      render: (h) => (
        <g>
          {[[cx + 90, cy - 60], [cx - 110, cy + 20], [cx + 70, cy + 70]].map(([mx, my], i) => (
            <g key={i}>
              <ellipse cx={mx} cy={my} rx={22} ry={10} fill={h?.color || '#fecaca'} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} />
              <path d={`M ${mx - 14} ${my} q 4 -6 8 0 q 4 6 8 0 q 4 -6 8 0`} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1} fill="none" />
            </g>
          ))}
        </g>
      ),
    },
    {
      id: 'ribosomes',
      label: 'Ribosomes',
      labelPos: { x: cx - 80, y: cy - 70 },
      render: () => (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={cx + Math.cos(angle) * 70} cy={cy + Math.sin(angle) * 50} r={2.5} fill={DIAGRAM_COLORS.warning} />;
          })}
        </g>
      ),
    },
    {
      id: 'er',
      label: 'Endoplasmic Reticulum',
      labelPos: { x: cx - 120, y: cy + 50 },
      render: (h) => (
        <path d={`M ${cx - 60} ${cy + 50} q 20 -10 40 0 q 20 10 40 0 q -10 20 0 40 q -20 10 -40 0 q -20 -10 -40 0 z`}
          fill={h?.color || '#e9d5ff'} opacity={0.6} stroke={DIAGRAM_COLORS.accent} strokeWidth={1.25} />
      ),
    },
    {
      id: 'golgi',
      label: 'Golgi Apparatus',
      labelPos: { x: cx - 140, y: cy - 30 },
      render: (h) => (
        <g>
          {[0, 6, 12, 18].map((dy, i) => (
            <path key={i} d={`M ${cx - 130 + i * 2} ${cy - 10 + dy} q 30 -10 60 0`} stroke={h?.color || DIAGRAM_COLORS.warning} strokeWidth={2.5} fill="none" />
          ))}
        </g>
      ),
    },
  ];
  if (cellType === 'plant') {
    list.push(
      {
        id: 'chloroplast',
        label: 'Chloroplast',
        labelPos: { x: cx + 110, y: cy + 60 },
        render: (h) => (
          <g>
            {[[cx + 110, cy + 60], [cx - 90, cy - 40]].map(([mx, my], i) => (
              <g key={i}>
                <ellipse cx={mx} cy={my} rx={26} ry={14} fill={h?.color || '#bbf7d0'} stroke={DIAGRAM_COLORS.success} strokeWidth={1.25} />
                {[-8, 0, 8].map((dx) => (
                  <ellipse key={dx} cx={mx + dx} cy={my} rx={4} ry={3} fill={DIAGRAM_COLORS.success} opacity={0.7} />
                ))}
              </g>
            ))}
          </g>
        ),
      },
      {
        id: 'vacuole',
        label: 'Central Vacuole',
        labelPos: { x: cx + 30, y: cy + 90 },
        render: (h) => (
          <ellipse cx={cx + 20} cy={cy + 70} rx={50} ry={30} fill={h?.color || withAlpha(DIAGRAM_COLORS.primary, 0.15)} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.25} />
        ),
      },
      {
        id: 'cell-wall',
        label: 'Cell Wall',
        labelPos: { x: 40, y: cy - 110 },
        render: () => <g />, // rendered as outer border below
      },
    );
  }
  return list;
}

export default function CellDiagramRenderer({ title, type, highlight, notes }: CellDiagramProps) {
  const organelles = makeOrganelles(type);
  const cx = W / 2; const cy = H / 2 + 6;
  const highlightMap = new Map((highlight || []).map((h) => [h.organelle.toLowerCase(), h]));

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Cell membrane / wall */}
        {type === 'plant' ? (
          <g>
            <rect x={40} y={50} width={W - 80} height={H - 100} rx={24} fill="#f0f9ff" stroke="#047857" strokeWidth={4} />
            <rect x={46} y={56} width={W - 92} height={H - 112} rx={20} fill="#ecfdf5" stroke={DIAGRAM_COLORS.primary} strokeWidth={1.5} />
          </g>
        ) : (
          <ellipse cx={cx} cy={cy} rx={W / 2 - 40} ry={H / 2 - 50} fill="#f8fafc" stroke={DIAGRAM_COLORS.primary} strokeWidth={2} />
        )}

        {/* Organelles */}
        {organelles.map((org) => {
          const h = highlightMap.get(org.id) || highlightMap.get(org.label.toLowerCase());
          return <g key={org.id}>{org.render({ color: h?.color })}</g>;
        })}

        {/* Labels — only for highlighted organelles, else optionally all */}
        {(highlight && highlight.length > 0 ? organelles.filter((o) => highlightMap.has(o.id) || highlightMap.has(o.label.toLowerCase())) : organelles).map((org, i) => {
          const h = highlightMap.get(org.id) || highlightMap.get(org.label.toLowerCase());
          const anchorX = org.labelPos.x;
          const anchorY = org.labelPos.y;
          // Place label outside the cell.
          const outside = { x: anchorX > cx ? Math.min(W - 10, anchorX + 80) : Math.max(10, anchorX - 80), y: anchorY + (i % 2 === 0 ? -20 : 14) };
          return (
            <g key={org.id}>
              <line x1={anchorX} y1={anchorY} x2={outside.x} y2={outside.y} stroke={DIAGRAM_COLORS.muted} strokeWidth={0.75} />
              <text x={outside.x} y={outside.y - 2} fontSize={11} fill={DIAGRAM_COLORS.text} fontWeight={600} textAnchor={anchorX > cx ? 'start' : 'end'}>
                {org.label}
              </text>
              {h?.note && (
                <text x={outside.x} y={outside.y + 10} fontSize={9} fill={DIAGRAM_COLORS.muted} textAnchor={anchorX > cx ? 'start' : 'end'}>{h.note}</text>
              )}
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
