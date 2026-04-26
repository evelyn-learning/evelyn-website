'use client';

/**
 * Cycle Diagram Renderer
 *
 * Circular arrangement of stages connected by arrows looping back to start.
 * Textbook use cases: water cycle, carbon cycle, rock cycle, nitrogen cycle,
 * cell cycle, product-development loop, PDCA, etc.
 */

import React from 'react';
import { DIAGRAM_COLORS, cycleColor, withAlpha } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface CycleStage {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CycleDiagramProps {
  title?: string;
  stages: CycleStage[];
  /** If true, arrows go clockwise; else counter-clockwise. Default true. */
  clockwise?: boolean;
  notes?: string;
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
/** Known stage synonyms for well-known cycles. Keys match common stage
 *  labels (case-insensitive); returned synonyms are in the language a tutor
 *  is likely to speak. Missing keys just fall back to generic variants. */
const CYCLE_STAGE_SYNONYMS: Record<string, string[]> = {
  precipitation: ['precipitation', 'rain', 'rainfall', 'snowfall', 'snow'],
  evaporation: ['evaporation', 'evaporate'],
  condensation: ['condensation', 'condense', 'clouds forming'],
  transpiration: ['transpiration'],
  runoff: ['runoff', 'run-off', 'surface runoff'],
  infiltration: ['infiltration', 'groundwater recharge'],
  collection: ['collection', 'accumulation'],
  photosynthesis: ['photosynthesis'],
  respiration: ['respiration', 'cellular respiration'],
  decomposition: ['decomposition', 'decay'],
  combustion: ['combustion', 'burning'],
  fixation: ['fixation', 'nitrogen fixation'],
  nitrification: ['nitrification'],
  denitrification: ['denitrification'],
  ammonification: ['ammonification'],
  weathering: ['weathering'],
  erosion: ['erosion'],
  sedimentation: ['sedimentation', 'deposition'],
  metamorphism: ['metamorphism'],
  melting: ['melting'],
  cooling: ['cooling', 'crystallization'],
  plan: ['plan', 'planning'],
  do: ['do', 'execute'],
  check: ['check', 'study'],
  act: ['act', 'adjust'],
};

export function buildCycleDiagramManifest(props: CycleDiagramProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const stages = props.stages ?? [];
  stages.forEach((s) => {
    const slug = featSlug(s.label);
    const labelLower = s.label.toLowerCase().trim();
    const domainSyns = CYCLE_STAGE_SYNONYMS[labelLower] ?? [];
    const stageLabels = new Set<string>([
      `stage-${slug}`,
      s.label,
      `stage ${s.label}`,
      `the ${s.label} stage`,
      `the ${s.label} step`,
      `${s.label} step`,
      `step ${s.label}`,
      labelLower,
    ]);
    for (const syn of domainSyns) {
      stageLabels.add(syn);
      stageLabels.add(`the ${syn} stage`);
      stageLabels.add(`${syn} stage`);
      stageLabels.add(`the ${syn} step`);
    }
    entries.push({
      name: `stage-${slug}`,
      kind: 'node',
      description: `cycle stage "${s.label}"`,
      labels: Array.from(stageLabels),
    });
    if (s.description) {
      entries.push({
        name: `stage-${slug}-description`,
        kind: 'label',
        description: `caption for stage "${s.label}": ${s.description}`,
        labels: [
          `stage-${slug}-description`,
          `${s.label} description`,
          `${s.label} caption`,
          `description of ${s.label}`,
          `caption for ${s.label}`,
          `the ${s.label} caption`,
        ],
      });
    }
  });
  return entries;
}

export default function CycleDiagramRenderer({
  title, stages, clockwise = true, notes,
}: CycleDiagramProps) {
  if (!stages || stages.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No cycle stages.</div>;
  }

  const cx = VIEWBOX_W / 2;
  const cy = VIEWBOX_H / 2 + (title ? 8 : 0);
  const radius = Math.min(VIEWBOX_W, VIEWBOX_H) / 2 - 90;
  const nodeR = 42;

  const n = stages.length;
  // Start at top, space evenly around the circle.
  const angleFor = (i: number) => {
    const sign = clockwise ? 1 : -1;
    return -Math.PI / 2 + sign * (2 * Math.PI * i) / n;
  };
  const pos = (i: number) => {
    const a = angleFor(i);
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="cy-arrow" />

        {/* Arc arrows between stages */}
        {stages.map((_, i) => {
          const p0 = pos(i);
          const p1 = pos((i + 1) % n);
          const c0 = stages[i].color || cycleColor(i);
          // Pull the arrow tangentially inward along the circle (a curved arc) for visual flow.
          const midAngle = (angleFor(i) + angleFor((i + 1) % n)) / 2;
          const arcR = radius * 0.85;
          const qx = cx + arcR * Math.cos(midAngle);
          const qy = cy + arcR * Math.sin(midAngle);
          // Shrink both endpoints so arrow doesn't overlap the node circles.
          const shrink = (from: { x: number; y: number }, to: { x: number; y: number }, amt: number) => {
            const dx = to.x - from.x; const dy = to.y - from.y;
            const d = Math.hypot(dx, dy) || 1;
            return { x: from.x + (dx / d) * amt, y: from.y + (dy / d) * amt };
          };
          const start = shrink(p0, { x: qx, y: qy }, nodeR);
          const end = shrink(p1, { x: qx, y: qy }, nodeR);
          return (
            <path
              key={`arc${i}`}
              d={`M ${start.x} ${start.y} Q ${qx} ${qy} ${end.x} ${end.y}`}
              stroke={c0}
              strokeWidth={2}
              fill="none"
              markerEnd={`url(#${arrowMarkerId(c0, 'cy-arrow')})`}
            />
          );
        })}

        {/* Stage nodes. Each stage exposes two data-features:
             - stage-<label-slug>          the circle + its inner label
             - stage-<label-slug>-description  the outer description caption
            so the tutor can point at either. */}
        {stages.map((s, i) => {
          const { x, y } = pos(i);
          const color = s.color || cycleColor(i);
          const slug = featSlug(s.label);
          // Node bbox: square enclosing the circle with a small margin so
          // a scribble ellipse wraps cleanly around the whole node.
          const nodeBBox = { cx: x, cy: y, w: nodeR * 2 + 8, h: nodeR * 2 + 8 };
          return (
            <g key={`node${i}`} {...feat(`stage-${slug}`, nodeBBox)}>
              <circle cx={x} cy={y} r={nodeR} fill={withAlpha(color, 0.15)} stroke={color} strokeWidth={2} />
              {s.icon && (
                <text x={x} y={y - 6} fontSize={20} textAnchor="middle" dominantBaseline="middle">{s.icon}</text>
              )}
              <text x={x} y={s.icon ? y + 14 : y + 4} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={700}>
                {s.label}
              </text>
              {/* Description below the node */}
              {s.description && (() => {
                // Push description outside the ring, along the radial outward direction.
                const a = angleFor(i);
                const lx = cx + (radius + nodeR + 4) * Math.cos(a);
                const ly = cy + (radius + nodeR + 4) * Math.sin(a);
                const anchor = Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle';
                // Approximate the text bbox for the feature attribute — good
                // enough for a scribble underline / highlight to land on it.
                const textW = Math.max(60, s.description.length * 5);
                const textH = 14;
                const descCx = anchor === 'start' ? lx + textW / 2 : anchor === 'end' ? lx - textW / 2 : lx;
                return (
                  <text
                    x={lx}
                    y={ly}
                    fontSize={9}
                    fill={DIAGRAM_COLORS.muted}
                    textAnchor={anchor}
                    {...feat(`stage-${slug}-description`, { cx: descCx, cy: ly - 4, w: textW, h: textH })}
                  >
                    {s.description}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
