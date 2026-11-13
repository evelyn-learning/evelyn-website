'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Cycle Diagram Renderer
 *
 * Circular arrangement of stages connected by arrows looping back to start.
 * Textbook use cases: water cycle, carbon cycle, rock cycle, nitrogen cycle,
 * cell cycle, product-development loop, PDCA, etc.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
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
      // Echo-of-description phrasings the brain emits after reading the
      // boardSnapshot. Description text is `cycle stage "X"` so the brain
      // echoes that verbatim as the scribble target. Without these,
      // tutor_scribble silently drops (observed 2026-05-06 G3 life-cycles
      // session: 4 consecutive scribble drops on cycle stages).
      `cycle stage "${s.label}"`,
      `cycle stage ${s.label}`,
      `the cycle stage "${s.label}"`,
      `the cycle stage ${s.label}`,
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

/* Layout (rebuilt 2026-11-13, figure audit). The first version drew every stage as a circle of one size on a
 * ring of one size: ten stages overlapped into a wreath, a label longer than the circle ran over its neighbours,
 * the captions outside the ring collided with them, and the arrow of the last stage looped through the middle.
 * Now each stage is a card as large as its own words (label, caption under it), the ring is as large as the
 * cards need, and the arrows are arcs of the ring from the edge of one card to the edge of the next. One quiet
 * colour: the order is carried by the arrows, and a colour per stage meant nothing. A caller's own colours are kept. */
const LABEL_SIZE = 13;
const DESC_SIZE = 11;
const STROKE = '#2563eb';
const FILL = '#eff6ff';
const ARROW = '#475569';

/** Wrapped to lines of about equal length: "Nitrogen in / the air", not "Nitrogen in the / air". */
function wrapWords(text: string, limit: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const total = words.join(' ').length;
  const count = Math.max(1, Math.ceil(total / limit));
  const maxChars = Math.min(limit, Math.max(...words.map((w) => w.length), Math.ceil(total / count) + 2));
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (!line) line = w;
    else if ((line + ' ' + w).length <= maxChars) line += ' ' + w;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

interface StageBox { labelLines: string[]; descLines: string[]; w: number; h: number; hasIcon: boolean }

function measureStage(s: CycleStage, crowded: boolean): StageBox {
  const labelLines = wrapWords(s.label ?? '', crowded ? 13 : 16);
  const descLines = s.description && s.description.trim() ? wrapWords(s.description, crowded ? 18 : 22) : [];
  const labelW = Math.max(...labelLines.map((l) => l.length)) * LABEL_SIZE * 0.6;
  const descW = descLines.length ? Math.max(...descLines.map((l) => l.length)) * DESC_SIZE * 0.56 : 0;
  const hasIcon = !!s.icon;
  const w = Math.max(72, Math.max(labelW, descW) + 22);
  const h = 16 + (hasIcon ? 22 : 0) + labelLines.length * (LABEL_SIZE + 3) + (descLines.length ? 3 + descLines.length * (DESC_SIZE + 3) : 0);
  return { labelLines, descLines, w, h, hasIcon };
}

export default function CycleDiagramRenderer({
  title, stages, clockwise = true, notes,
}: CycleDiagramProps) {
  if (!stages || stages.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No cycle stages.</div>;
  }

  const n = stages.length;
  const boxes = stages.map((s) => measureStage(s, n > 6));
  const sign = clockwise ? 1 : -1;
  // Start at top, space evenly around the circle.
  const angleFor = (i: number) => -Math.PI / 2 + sign * (2 * Math.PI * i) / n;

  // How far along the ring (in radians, on one side) a card reaches, with a little air around it.
  const reach = (i: number, R: number, dir: 1 | -1): number => {
    const a = angleFor(i);
    const bx = R * Math.cos(a), by = R * Math.sin(a);
    const hw = boxes[i].w / 2 + 7, hh = boxes[i].h / 2 + 7;
    for (let t = 0; t < Math.PI; t += 0.01) {
      const x = R * Math.cos(a + dir * t), y = R * Math.sin(a + dir * t);
      if (Math.abs(x - bx) > hw || Math.abs(y - by) > hh) return t;
    }
    return Math.PI;
  };
  // The ring grows until there is room for an arrow between every card and the next.
  const MIN_ARROW = 42;
  let R = n === 1 ? 0 : 70;
  const gaps = (radius: number) => stages.map((_, i) => {
    const j = (i + 1) % n;
    const between = n === 1 ? 0 : (2 * Math.PI) / n;
    return (between - reach(i, radius, sign as 1 | -1) - reach(j, radius, -sign as 1 | -1)) * radius;
  });
  // …and until no two cards touch (three wide cards sit side by side below a small ring).
  const touching = (radius: number) => stages.some((_, i) => stages.some((__, j) => {
    if (j <= i) return false;
    const dx = Math.abs(radius * Math.cos(angleFor(i)) - radius * Math.cos(angleFor(j)));
    const dy = Math.abs(radius * Math.sin(angleFor(i)) - radius * Math.sin(angleFor(j)));
    return dx < (boxes[i].w + boxes[j].w) / 2 + 14 && dy < (boxes[i].h + boxes[j].h) / 2 + 14;
  }));
  if (n > 1) while (R < 420 && (Math.min(...gaps(R)) < MIN_ARROW || touching(R))) R += 6;

  const pos = (i: number) => ({ x: R * Math.cos(angleFor(i)), y: R * Math.sin(angleFor(i)) });
  // The frame holds the cards and the ring itself (with two stages the arrows bulge out beyond the cards).
  const minX = Math.min(-R, ...stages.map((_, i) => pos(i).x - boxes[i].w / 2)) - 10;
  const maxX = Math.max(R, ...stages.map((_, i) => pos(i).x + boxes[i].w / 2)) + 10;
  const minY = Math.min(-R, ...stages.map((_, i) => pos(i).y - boxes[i].h / 2)) - 10;
  const maxY = Math.max(R, ...stages.map((_, i) => pos(i).y + boxes[i].h / 2)) + 10;
  const vbW = maxX - minX, vbH = maxY - minY;
  const vb = { width: vbW, height: vbH };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 6, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`${minX} ${minY} ${vbW} ${vbH}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: Math.min(640, Math.round(vbW)), height: 'auto' }}>
        <defs>
          <marker id="cy-ring-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ARROW} />
          </marker>
        </defs>

        {/* Arrows: arcs of the ring, from the edge of one card to the edge of the next. */}
        {n > 1 && stages.map((_, i) => {
          const j = (i + 1) % n;
          const a0 = angleFor(i) + sign * reach(i, R, sign as 1 | -1);
          const a1 = angleFor(i) + sign * ((2 * Math.PI) / n - reach(j, R, -sign as 1 | -1));
          if ((a1 - a0) * sign * R < 10) return null;
          const sx = R * Math.cos(a0), sy = R * Math.sin(a0);
          const ex = R * Math.cos(a1), ey = R * Math.sin(a1);
          const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
          return (
            <path
              key={`arc${i}`}
              d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 ${large} ${clockwise ? 1 : 0} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
              stroke={ARROW}
              strokeWidth={2}
              fill="none"
              markerEnd="url(#cy-ring-arrow)"
            />
          );
        })}

        {/* Stage cards. Each stage exposes two data-features:
             - stage-<label-slug>               the card
             - stage-<label-slug>-description   its caption
            so the tutor can point at either. */}
        {stages.map((s, i) => {
          const { x, y } = pos(i);
          const b = boxes[i];
          const stroke = s.color || STROKE;
          const fill = s.color ? '#ffffff' : FILL;
          const slug = featSlug(s.label);
          const top = y - b.h / 2;
          let ty = top + 8 + (b.hasIcon ? 22 : 0);
          const labelYs = b.labelLines.map(() => { ty += LABEL_SIZE + 3; return ty - 3; });
          ty += b.descLines.length ? 3 : 0;
          const descYs = b.descLines.map(() => { ty += DESC_SIZE + 3; return ty - 3; });
          const local = (cx: number, cy: number, w: number, h: number) => ({ cx: cx - minX, cy: cy - minY, w, h });
          return (
            <g key={`node${i}`} {...feat(`stage-${slug}`, local(x, y, b.w + 8, b.h + 8), vb)}>
              <rect x={x - b.w / 2} y={top} width={b.w} height={b.h} rx={10} fill={fill} stroke={stroke} strokeWidth={2} />
              {s.icon && (
                <text x={x} y={top + 20} fontSize={18} textAnchor="middle" dominantBaseline="middle">{s.icon}</text>
              )}
              {b.labelLines.map((ln, k) => (
                <text key={`l${k}`} x={x} y={labelYs[k]} fontSize={LABEL_SIZE} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={700}>{ln}</text>
              ))}
              {b.descLines.length > 0 && (
                <g {...feat(`stage-${slug}-description`, local(x, (descYs[0] + descYs[descYs.length - 1]) / 2 - 4, b.w - 8, b.descLines.length * (DESC_SIZE + 3)), vb)}>
                  {b.descLines.map((ln, k) => (
                    <text key={`d${k}`} x={x} y={descYs[k]} fontSize={DESC_SIZE} fill="#475569" textAnchor="middle">{ln}</text>
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
