'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Food Web Renderer
 *
 * Labeled species nodes arranged in trophic levels, with directed arrows
 * from prey → predator (direction of energy flow). Supports an arbitrary
 * number of producers, primary/secondary/tertiary consumers, and apex
 * predators at distinct vertical levels.
 */

import React from 'react';
import { DIAGRAM_COLORS, withAlpha } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, truncate, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

/** See RayDiagramRenderer for documentation. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-cy': (bbox.cy / DIAGRAM_VIEWBOX.height).toFixed(3),
    'data-feature-w': (bbox.w / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-h': (bbox.h / DIAGRAM_VIEWBOX.height).toFixed(3),
  };
}

export interface FoodWebSpecies {
  id: string;
  label: string;
  /** Trophic level — 1=producer, 2=primary consumer, 3=secondary, 4=tertiary, 5=apex. */
  level: number;
  color?: string;
  icon?: string;
}

export interface FoodWebEdge {
  /** Who is eaten (prey). */
  from: string;
  /** Who eats (predator). */
  to: string;
}

export interface FoodWebProps {
  title?: string;
  species: FoodWebSpecies[];
  edges: FoodWebEdge[];
  /** Show trophic-level labels on the left. Default true. */
  showLevelLabels?: boolean;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

const LEVEL_LABELS: Record<number, string> = {
  1: 'Producers',
  2: 'Primary consumers',
  3: 'Secondary consumers',
  4: 'Tertiary consumers',
  5: 'Apex predators',
};

const LEVEL_COLORS: Record<number, string> = {
  1: DIAGRAM_COLORS.success,
  2: DIAGRAM_COLORS.warning,
  3: DIAGRAM_COLORS.secondary,
  4: DIAGRAM_COLORS.accent,
  5: DIAGRAM_COLORS.slate,
};

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildFoodWebManifest(props: FoodWebProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const species = props.species ?? [];
  for (const s of species) {
    const levelName = LEVEL_LABELS[s.level] || `level ${s.level}`;
    const labels = new Set<string>([
      `species-${s.id}`,
      s.id,
      s.label,
      `the ${s.label}`,
      s.label.toLowerCase(),
      `the ${s.label.toLowerCase()}`,
    ]);
    entries.push({
      name: `species-${s.id}`,
      kind: 'node',
      description: `${s.label} (${levelName.toLowerCase()})`,
      labels: Array.from(labels),
    });
  }
  return entries;
}

export default function FoodWebRenderer({
  title, species, edges, showLevelLabels = true, notes,
}: FoodWebProps) {
  if (!species || species.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No species.</div>;
  }

  const pad = { top: title ? 40 : 18, bottom: notes ? 32 : 20, left: showLevelLabels ? 90 : 30, right: 30 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const minLv = Math.min(...species.map((s) => s.level));
  const maxLv = Math.max(...species.map((s) => s.level));
  const lvCount = maxLv - minLv + 1;
  const rowH = plotH / lvCount;
  // Bottom of the plot = lowest level (producers).
  const yForLevel = (lv: number) => pad.top + plotH - (lv - minLv + 0.5) * rowH;

  const byLevel = new Map<number, FoodWebSpecies[]>();
  for (const s of species) {
    if (!byLevel.has(s.level)) byLevel.set(s.level, []);
    byLevel.get(s.level)!.push(s);
  }

  const positions = new Map<string, { x: number; y: number; color: string }>();
  byLevel.forEach((arr, lv) => {
    arr.forEach((s, i) => {
      const colW = plotW / arr.length;
      const x = pad.left + (i + 0.5) * colW;
      positions.set(s.id, { x, y: yForLevel(lv), color: s.color || LEVEL_COLORS[lv] || DIAGRAM_COLORS.primary });
    });
  });

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="fw-arrow" />

        {/* Level labels */}
        {showLevelLabels && Array.from({ length: lvCount }, (_, i) => {
          const lv = minLv + i;
          return (
            <g key={lv}>
              <text x={pad.left - 10} y={yForLevel(lv) + 4} fontSize={11} fill={LEVEL_COLORS[lv] || DIAGRAM_COLORS.muted} textAnchor="end" fontWeight={700}>
                {LEVEL_LABELS[lv] || `Level ${lv}`}
              </text>
              <line x1={pad.left - 4} y1={yForLevel(lv)} x2={W - 10} y2={yForLevel(lv)} stroke={DIAGRAM_COLORS.grid} strokeWidth={0.5} strokeDasharray="3 3" />
            </g>
          );
        })}

        {/* Edges prey → predator */}
        {edges.map((e, i) => {
          const p = positions.get(e.from);
          const q = positions.get(e.to);
          if (!p || !q) return null;
          return (
            <line
              key={`e${i}`}
              x1={p.x} y1={p.y - 20}
              x2={q.x} y2={q.y + 20}
              stroke={DIAGRAM_COLORS.muted}
              strokeWidth={1.25}
              markerEnd={`url(#${arrowMarkerId(DIAGRAM_COLORS.muted, 'fw-arrow')})`}
            />
          );
        })}

        {/* Species nodes — each exposes data-feature="species-<id>" so
            the tutor can say "circle the shark" by passing
            targetFeature: "species-shark" and have the client figure out
            the coordinates automatically. */}
        {species.map((s) => {
          const p = positions.get(s.id)!;
          const label = truncate(s.label, 14);
          const rectW = Math.max(70, label.length * 7 + 20);
          const rectH = 34;
          return (
            <g key={s.id} {...feat(`species-${s.id}`, { cx: p.x, cy: p.y, w: rectW, h: rectH })}>
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill={withAlpha(p.color, 0.18)} stroke={p.color} strokeWidth={1.75} />
              {s.icon && (
                <text x={p.x} y={p.y - 4} fontSize={14} textAnchor="middle" dominantBaseline="middle">{s.icon}</text>
              )}
              <text x={p.x} y={s.icon ? p.y + 12 : p.y + 4} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={700}>{label}</text>
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
