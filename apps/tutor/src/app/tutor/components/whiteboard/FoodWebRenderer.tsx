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
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }, vb: { width: number; height: number } = DIAGRAM_VIEWBOX) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / vb.width).toFixed(3),
    'data-feature-cy': (bbox.cy / vb.height).toFixed(3),
    'data-feature-w': (bbox.w / vb.width).toFixed(3),
    'data-feature-h': (bbox.h / vb.height).toFixed(3),
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

const BASE_W = DIAGRAM_VIEWBOX.width;
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

/** Greedy word wrap on the 0.55 average-glyph estimate (fraction-bar-layout.ts
 *  pattern) — level labels wrap inside the left gutter instead of clipping at
 *  the viewBox edge (audit 2026-08-07). */
function wrapWords(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [text];
  const lines: string[] = [];
  let line = words[0];
  for (const word of words.slice(1)) {
    const candidate = `${line} ${word}`;
    if (candidate.length * fontSize * 0.55 <= maxWidth) line = candidate;
    else { lines.push(line); line = word; }
  }
  lines.push(line);
  return lines;
}

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

  const pad = { top: 18, bottom: 20, left: showLevelLabels ? 90 : 30, right: 30 };
  // A crowded level widens the canvas (the figure scales to fit) rather than
  // squeezing its names into unreadable stubs.
  const widest = Math.max(...Array.from(species.reduce((m, sp) => m.set(sp.level, (m.get(sp.level) ?? 0) + 1), new Map<number, number>()).values()));
  const W = Math.max(BASE_W, pad.left + pad.right + widest * 88);
  const VB = { width: W, height: H };
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

  // Order each level by where its food sits in the level below (barycentre
  // sweeps) so arrows mostly run straight up instead of criss-crossing.
  const levels = Array.from(byLevel.keys()).sort((x, y) => x - y);
  const slot = new Map<string, number>();
  byLevel.forEach((arr) => arr.forEach((s, i) => slot.set(s.id, (i + 0.5) / arr.length)));
  const neighbours = (id: string, dir: 'down' | 'up'): number[] => {
    const own = species.find((sp) => sp.id === id)?.level ?? 0;
    const out: number[] = [];
    for (const e of edges) {
      const other = e.from === id ? e.to : e.to === id ? e.from : null;
      if (!other) continue;
      const lv = species.find((sp) => sp.id === other)?.level;
      if (lv === undefined || !slot.has(other)) continue;
      if ((dir === 'down' && lv < own) || (dir === 'up' && lv > own)) out.push(slot.get(other)!);
    }
    return out;
  };
  const reorder = (lv: number, dir: 'down' | 'up') => {
    const arr = byLevel.get(lv)!;
    const key = new Map(arr.map((s, i) => {
      const ns = neighbours(s.id, dir);
      return [s.id, ns.length ? ns.reduce((x, y) => x + y, 0) / ns.length : (i + 0.5) / arr.length] as const;
    }));
    const sorted = arr.map((s, i) => ({ s, i })).sort((x, y) => (key.get(x.s.id)! - key.get(y.s.id)!) || (x.i - y.i)).map((o) => o.s);
    byLevel.set(lv, sorted);
    sorted.forEach((s, i) => slot.set(s.id, (i + 0.5) / sorted.length));
  };
  for (let sweep = 0; sweep < 2; sweep++) {
    levels.slice(1).forEach((lv) => reorder(lv, 'down'));
    levels.slice(0, -1).reverse().forEach((lv) => reorder(lv, 'up'));
  }

  interface NodeBox { x: number; y: number; color: string; w: number; h: number; lines: string[]; fontSize: number }
  const positions = new Map<string, NodeBox>();
  byLevel.forEach((arr, lv) => {
    const colW = plotW / arr.length;
    const maxW = Math.max(40, Math.min(120, colW - 10));
    arr.forEach((s, i) => {
      const x = pad.left + (i + 0.5) * colW;
      // Fit the name to its column: one line, else two, else a smaller size,
      // and only then shorten it.
      let fontSize = 11; let lines: string[] = [s.label];
      for (const fs of [11, 10, 9]) {
        fontSize = fs;
        const one = s.label.length * fs * 0.58 + 16 <= maxW;
        lines = one ? [s.label] : wrapWords(s.label, maxW - 12, fs).slice(0, 3);
        const joined = lines.join(' ');
        if (joined.length >= s.label.replace(/\s+/g, ' ').trim().length && lines.every((l) => l.length * fs * 0.58 + 12 <= maxW)) break;
      }
      const cap = Math.max(3, Math.floor((maxW - 12) / (fontSize * 0.58)));
      lines = lines.map((l) => truncate(l, cap));
      const textW = Math.max(...lines.map((l) => l.length * fontSize * 0.58));
      const w = Math.min(maxW, Math.max(Math.min(64, maxW), textW + 20));
      const h = Math.min(rowH - 18, (s.icon ? 16 : 0) + lines.length * (fontSize + 2) + 14);
      positions.set(s.id, { x, y: yForLevel(lv), color: s.color || LEVEL_COLORS[lv] || DIAGRAM_COLORS.primary, w, h, lines, fontSize });
    });
  });

  /** Point where the segment from box centre towards (tx,ty) leaves the box (plus a small gap). */
  const edgePoint = (b: NodeBox, tx: number, ty: number, gap: number) => {
    const dx = tx - b.x; const dy = ty - b.y;
    const len = Math.hypot(dx, dy) || 1;
    const t = Math.min(dx === 0 ? Infinity : (b.w / 2) / Math.abs(dx), dy === 0 ? Infinity : (b.h / 2) / Math.abs(dy));
    return { x: b.x + dx * t + (dx / len) * gap, y: b.y + dy * t + (dy / len) * gap };
  };

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
          const lines = wrapWords(LEVEL_LABELS[lv] || `Level ${lv}`, pad.left - 14, 11);
          return (
            <g key={lv}>
              <text x={pad.left - 10} y={yForLevel(lv) + 4} fontSize={11} fill={LEVEL_COLORS[lv] || DIAGRAM_COLORS.muted} textAnchor="end" fontWeight={700}>
                {lines.map((line, li) => (
                  <tspan key={li} x={pad.left - 10} y={yForLevel(lv) + 4 + (li - (lines.length - 1) / 2) * 12}>
                    {line}
                  </tspan>
                ))}
              </text>
              <line x1={pad.left - 4} y1={yForLevel(lv)} x2={W - 10} y2={yForLevel(lv)} stroke={DIAGRAM_COLORS.grid} strokeWidth={0.5} strokeDasharray="3 3" />
            </g>
          );
        })}

        {/* Edges prey → predator */}
        {edges.map((e, i) => {
          const p = positions.get(e.from);
          const q = positions.get(e.to);
          if (!p || !q || e.from === e.to) return null;
          const marker = `url(#${arrowMarkerId(DIAGRAM_COLORS.slate, 'fw-arrow')})`;
          if (Math.abs(p.y - q.y) < 1) {
            // Same trophic level: arc over the row instead of running through the boxes between.
            const lift = Math.min(rowH * 0.42, 14 + Math.abs(q.x - p.x) * 0.08);
            const y0 = p.y - p.h / 2 - 2; const y1 = q.y - q.h / 2 - 3;
            const x0 = p.x + Math.sign(q.x - p.x) * Math.min(12, p.w / 4);
            const x1 = q.x - Math.sign(q.x - p.x) * Math.min(12, q.w / 4);
            return (
              <path key={`e${i}`} d={`M ${x0} ${y0} C ${x0} ${y0 - lift}, ${x1} ${y1 - lift}, ${x1} ${y1}`}
                fill="none" stroke={DIAGRAM_COLORS.slate} strokeWidth={1.3} markerEnd={marker} />
            );
          }
          const a = edgePoint(p, q.x, q.y, 2);
          const z = edgePoint(q, p.x, p.y, 4);
          return (
            <line
              key={`e${i}`}
              x1={a.x} y1={a.y}
              x2={z.x} y2={z.y}
              stroke={DIAGRAM_COLORS.slate}
              strokeWidth={1.3}
              markerEnd={marker}
            />
          );
        })}

        {/* Species nodes — each exposes data-feature="species-<id>" so
            the tutor can say "circle the shark" by passing
            targetFeature: "species-shark" and have the client figure out
            the coordinates automatically. */}
        {species.map((s) => {
          const p = positions.get(s.id)!;
          const rectW = p.w;
          const rectH = p.h;
          const textTop = p.y - rectH / 2 + 8 + (s.icon ? 16 : 0);
          return (
            <g key={s.id} {...feat(`species-${s.id}`, { cx: p.x, cy: p.y, w: rectW, h: rectH }, VB)}>
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill="white" />
              <rect x={p.x - rectW / 2} y={p.y - rectH / 2} width={rectW} height={rectH} rx={6}
                fill={withAlpha(p.color, 0.16)} stroke={p.color} strokeWidth={1.75} />
              {s.icon && (
                <text x={p.x} y={p.y - rectH / 2 + 15} fontSize={14} textAnchor="middle" dominantBaseline="middle">{s.icon}</text>
              )}
              {p.lines.map((line, li) => (
                <text key={li} x={p.x} y={textTop + (li + 0.82) * (p.fontSize + 2) - 1} fontSize={p.fontSize} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={700}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
