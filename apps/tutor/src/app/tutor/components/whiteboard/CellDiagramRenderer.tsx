'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Cell Diagram Renderer
 *
 * Simplified animal or plant cell with labeled organelles. Organelle positions
 * are fixed by type to maintain textbook recognizability (nucleus center,
 * mitochondria scattered, ER around nucleus, etc). The tutor specifies which
 * organelles to highlight plus an optional custom label.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';
import { wrapLabel } from './fraction-bar-layout';

export interface CellDiagramProps {
  title?: string;
  type: 'animal' | 'plant';
  /** Which organelles to highlight. Default: show ALL organelles for the cell type unlabeled. */
  highlight?: Array<{ organelle: string; note?: string; color?: string }>;
  notes?: string;
}

// Own viewBox (wider than the shared one): the cell sits in the middle and
// the two side gutters hold the label columns, so a label never lands on an
// organelle and never leaves the canvas.
const W = 640;
const H = 420;
const VB = { width: W, height: H } as const;
const CX = 320;
const CY = 210;
/** Label columns: left labels end at LEFT_X (right-aligned), right labels start at RIGHT_X. */
const LEFT_X = 150;
const RIGHT_X = 490;
const LABEL_FS = 12;
const NOTE_FS = 10;
const NOTE_LH = 12;

interface Organelle {
  id: string;
  label: string;
  render: (highlight?: { color?: string }) => React.ReactElement;
  /** Where the leader line ends (a point ON the drawn organelle). */
  labelPos: { x: number; y: number };
  /** Approximate bounding box of the organelle's drawn region. */
  bbox: { cx: number; cy: number; w: number; h: number };
  /** Force a label column; default = the side the anchor is on. */
  side?: 'left' | 'right';
}

const INK = {
  nucleusFill: '#ddd6fe', nucleusStroke: '#6d28d9', nucleolus: '#7c3aed',
  erFill: '#bfdbfe', erStroke: '#1d4ed8',
  golgiFill: '#fcd34d', golgiStroke: '#b45309',
  mitoFill: '#fecaca', mitoStroke: '#b91c1c',
  chloroFill: '#86efac', chloroStroke: '#15803d',
  vacuoleFill: '#dbeafe', vacuoleStroke: '#3b82f6',
  lysoFill: '#fbcfe8', lysoStroke: '#be185d',
  ribosome: '#475569',
} as const;

/** Animal-cell outline: a gently irregular round blob (radius as a function of angle). */
function animalRadius(theta: number): { rx: number; ry: number } {
  const k = 1 + 0.022 * Math.sin(3 * theta + 0.6) + 0.016 * Math.sin(5 * theta + 2);
  return { rx: 150 * k, ry: 158 * k };
}
function animalPoint(theta: number, inset = 0): { x: number; y: number } {
  const { rx, ry } = animalRadius(theta);
  return { x: CX + (rx - inset) * Math.cos(theta), y: CY + (ry - inset) * Math.sin(theta) };
}
function animalOutline(): string {
  const n = 96;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = animalPoint((i / n) * Math.PI * 2);
    d += `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  }
  return `${d}Z`;
}

/** Plant-cell box (outer face of the wall). */
const PLANT = { x: 172, y: 44, w: 296, h: 332, r: 18, wall: 7 } as const;

function Mitochondrion({ x, y, rot, fill }: { x: number; y: number; rot: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse rx={25} ry={12.5} fill={fill || INK.mitoFill} stroke={INK.mitoStroke} strokeWidth={1.5} />
      <path d="M -17 0 l 4 -6 l 5 12 l 5 -12 l 5 12 l 5 -12 l 5 12 l 3 -6" stroke={INK.mitoStroke} strokeWidth={1.1} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

function Chloroplast({ x, y, rot, fill }: { x: number; y: number; rot: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse rx={26} ry={13} fill={fill || INK.chloroFill} stroke={INK.chloroStroke} strokeWidth={1.5} />
      {[-13, 0, 13].map((dx) => (
        <g key={dx}>
          {[-4, 0, 4].map((dy) => (
            <ellipse key={dy} cx={dx} cy={dy} rx={5} ry={1.7} fill={INK.chloroStroke} />
          ))}
        </g>
      ))}
    </g>
  );
}

/** Rough ER: one serpentine band folded round the nucleus, studded with ribosomes. */
function EndoplasmicReticulum({ ncx, ncy, radii, a0, a1, fill }: { ncx: number; ncy: number; radii: number[]; a0: number; a1: number; fill?: string }) {
  const pt = (r: number, deg: number) => {
    const t = (deg * Math.PI) / 180;
    return { x: ncx + r * Math.cos(t), y: ncy + r * Math.sin(t) };
  };
  let d = '';
  radii.forEach((r, i) => {
    const from = i % 2 === 0 ? a0 : a1;
    const to = i % 2 === 0 ? a1 : a0;
    const p0 = pt(r, from); const p1 = pt(r, to);
    const sweep = to > from ? 1 : 0;
    d += i === 0 ? `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} ` : `L ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} `;
    d += `A ${r} ${r} 0 0 ${sweep} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} `;
  });
  const dots: Array<{ x: number; y: number }> = [];
  const outer = radii[radii.length - 1];
  const steps = Math.max(4, Math.round(Math.abs(a1 - a0) / 16));
  for (let i = 0; i <= steps; i++) dots.push(pt(outer + 5.5, a0 + ((a1 - a0) * i) / steps));
  return (
    <g>
      <path d={d} fill="none" stroke={INK.erStroke} strokeWidth={6.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={fill || INK.erFill} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {dots.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.9} fill={INK.ribosome} />)}
    </g>
  );
}

function Golgi({ x, y, rot, fill }: { x: number; y: number; rot: number; fill?: string }) {
  const rows = [-14, -7, 0, 7, 14];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {rows.map((dy, i) => {
        const half = 24 - Math.abs(i - 2) * 3;
        const d = `M ${-half} ${dy + 3} Q 0 ${dy - 6} ${half} ${dy + 3}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={INK.golgiStroke} strokeWidth={5.5} strokeLinecap="round" />
            <path d={d} fill="none" stroke={fill || INK.golgiFill} strokeWidth={3.2} strokeLinecap="round" />
          </g>
        );
      })}
      {[[31, -10], [33, 4], [-31, 12]].map(([vx, vy], i) => (
        <circle key={i} cx={vx} cy={vy} r={3.4} fill={fill || INK.golgiFill} stroke={INK.golgiStroke} strokeWidth={1.1} />
      ))}
    </g>
  );
}

function Nucleus({ x, y, r, fill }: { x: number; y: number; r: number; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill || INK.nucleusFill} stroke={INK.nucleusStroke} strokeWidth={2} />
      <circle cx={x} cy={y} r={r - 4} fill="none" stroke={INK.nucleusStroke} strokeWidth={0.8} strokeDasharray="5 3" opacity={0.7} />
      <circle cx={x + r * 0.18} cy={y + r * 0.12} r={r * 0.3} fill={INK.nucleolus} opacity={0.8} />
    </g>
  );
}

function RibosomeDots({ pts }: { pts: Array<[number, number]> }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.3} fill={INK.ribosome} />)}</g>;
}

function makeOrganelles(cellType: 'animal' | 'plant'): Organelle[] {
  if (cellType === 'animal') {
    const memAnchor = animalPoint((208 * Math.PI) / 180);
    const ribo: Array<[number, number]> = [[200, 226], [209, 235], [198, 241], [352, 88], [362, 96], [346, 99], [268, 345], [279, 339], [452, 190], [447, 256]];
    return [
      {
        id: 'cell-membrane-label', label: 'Cell membrane', side: 'left',
        labelPos: memAnchor, bbox: { cx: CX, cy: CY, w: 300, h: 316 },
        render: () => <g />, // drawn as the outline
      },
      {
        id: 'nucleus', label: 'Nucleus', side: 'left',
        labelPos: { x: 272, y: 182 }, bbox: { cx: 305, cy: 195, w: 96, h: 96 },
        render: (h) => <Nucleus x={305} y={195} r={48} fill={h?.color} />,
      },
      {
        id: 'mitochondria', label: 'Mitochondria', side: 'right',
        labelPos: { x: 428, y: 136 }, bbox: { cx: CX, cy: 200, w: 250, h: 230 },
        render: (h) => (
          <g>
            <Mitochondrion x={250} y={112} rot={-30} fill={h?.color} />
            <Mitochondrion x={420} y={135} rot={35} fill={h?.color} />
            <Mitochondrion x={230} y={292} rot={20} fill={h?.color} />
          </g>
        ),
      },
      {
        id: 'ribosomes', label: 'Ribosomes', side: 'left',
        labelPos: { x: 198, y: 234 }, bbox: { cx: CX, cy: CY, w: 270, h: 270 },
        render: () => <RibosomeDots pts={ribo} />,
      },
      {
        id: 'er', label: 'Endoplasmic reticulum', side: 'right',
        labelPos: { x: 383, y: 198 }, bbox: { cx: 350, cy: 205, w: 80, h: 140 },
        render: (h) => <EndoplasmicReticulum ncx={305} ncy={195} radii={[58, 68, 78]} a0={-42} a1={68} fill={h?.color} />,
      },
      {
        id: 'golgi', label: 'Golgi apparatus', side: 'right',
        labelPos: { x: 428, y: 286 }, bbox: { cx: 412, cy: 290, w: 76, h: 60 },
        render: (h) => <Golgi x={410} y={290} rot={-28} fill={h?.color} />,
      },
      {
        id: 'lysosome', label: 'Lysosome', side: 'left',
        labelPos: { x: 293, y: 322 }, bbox: { cx: 315, cy: 324, w: 60, h: 30 },
        render: (h) => (
          <g>
            <circle cx={302} cy={322} r={10} fill={h?.color || INK.lysoFill} stroke={INK.lysoStroke} strokeWidth={1.4} />
            {[[-3, -2], [3, 1], [-1, 4]].map(([dx, dy], i) => <circle key={i} cx={302 + dx} cy={322 + dy} r={1.3} fill={INK.lysoStroke} />)}
            <circle cx={336} cy={332} r={7} fill={h?.color || INK.lysoFill} stroke={INK.lysoStroke} strokeWidth={1.4} />
          </g>
        ),
      },
      {
        id: 'cytoplasm', label: 'Cytoplasm', side: 'right',
        labelPos: { x: 440, y: 226 }, bbox: { cx: CX, cy: CY, w: 280, h: 300 },
        render: () => <g />,
      },
    ];
  }

  // ── Plant cell ──
  const ribo: Array<[number, number]> = [[192, 196], [201, 204], [190, 210], [300, 66], [310, 73], [445, 250], [451, 262], [442, 270], [372, 356], [382, 350]];
  return [
    {
      id: 'cell-wall', label: 'Cell wall', side: 'left',
      labelPos: { x: PLANT.x + 1, y: 72 }, bbox: { cx: CX, cy: CY, w: PLANT.w, h: PLANT.h },
      render: () => <g />, // drawn as the outer border
    },
    {
      id: 'cell-membrane-label', label: 'Cell membrane', side: 'right',
      labelPos: { x: PLANT.x + PLANT.w - PLANT.wall - 2, y: 112 }, bbox: { cx: CX, cy: CY, w: PLANT.w - 14, h: PLANT.h - 14 },
      render: () => <g />,
    },
    {
      id: 'nucleus', label: 'Nucleus', side: 'left',
      labelPos: { x: 212, y: 104 }, bbox: { cx: 232, cy: 108, w: 68, h: 68 },
      render: (h) => <Nucleus x={232} y={108} r={34} fill={h?.color} />,
    },
    {
      id: 'vacuole', label: 'Central vacuole', side: 'right',
      labelPos: { x: 392, y: 236 }, bbox: { cx: 345, cy: 232, w: 160, h: 184 },
      render: (h) => (
        <ellipse cx={345} cy={232} rx={80} ry={92} fill={h?.color || INK.vacuoleFill} stroke={INK.vacuoleStroke} strokeWidth={1.6} />
      ),
    },
    {
      id: 'er', label: 'Endoplasmic reticulum', side: 'left',
      labelPos: { x: 203, y: 152 }, bbox: { cx: 240, cy: 145, w: 100, h: 60 },
      render: (h) => <EndoplasmicReticulum ncx={232} ncy={108} radii={[43, 52, 61]} a0={14} a1={124} fill={h?.color} />,
    },
    {
      id: 'ribosomes', label: 'Ribosomes', side: 'left',
      labelPos: { x: 191, y: 204 }, bbox: { cx: CX, cy: CY, w: 270, h: 300 },
      render: () => <RibosomeDots pts={ribo} />,
    },
    {
      id: 'chloroplast', label: 'Chloroplasts', side: 'left',
      labelPos: { x: 204, y: 250 }, bbox: { cx: CX, cy: 220, w: 260, h: 290 },
      render: (h) => (
        <g>
          <Chloroplast x={398} y={88} rot={15} fill={h?.color} />
          <Chloroplast x={216} y={250} rot={82} fill={h?.color} />
          <Chloroplast x={282} y={348} rot={-8} fill={h?.color} />
          <Chloroplast x={432} y={338} rot={-55} fill={h?.color} />
        </g>
      ),
    },
    {
      id: 'mitochondria', label: 'Mitochondria', side: 'left',
      labelPos: { x: 210, y: 316 }, bbox: { cx: 280, cy: 210, w: 160, h: 260 },
      render: (h) => (
        <g>
          <Mitochondrion x={330} y={104} rot={-8} fill={h?.color} />
          <Mitochondrion x={222} y={316} rot={30} fill={h?.color} />
        </g>
      ),
    },
    {
      id: 'golgi', label: 'Golgi apparatus', side: 'right',
      labelPos: { x: 440, y: 158 }, bbox: { cx: 424, cy: 158, w: 70, h: 56 },
      render: (h) => <Golgi x={424} y={158} rot={62} fill={h?.color} />,
    },
    {
      id: 'cytoplasm', label: 'Cytoplasm', side: 'right',
      labelPos: { x: 440, y: 296 }, bbox: { cx: CX, cy: CY, w: PLANT.w - 20, h: PLANT.h - 20 },
      render: () => <g />,
    },
  ];
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildCellDiagramManifest(props: CellDiagramProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  entries.push({
    name: 'cell-membrane',
    kind: 'shape',
    description: props.type === 'plant' ? 'outer cell wall / membrane rectangle' : 'outer cell membrane ellipse',
    labels: props.type === 'plant'
      ? ['cell-membrane', 'cell membrane', 'plasma membrane', 'cell wall', 'outer membrane', 'cell boundary']
      : ['cell-membrane', 'cell membrane', 'plasma membrane', 'outer membrane', 'cell boundary'],
  });
  const organelles = makeOrganelles(props.type);
  // Synonyms for common organelles the tutor may say.
  const ORGANELLE_SYNONYMS: Record<string, string[]> = {
    'nucleus': ['nucleus', 'the nucleus', 'cell nucleus', 'nuclear membrane', 'nuclear envelope'],
    'mitochondria': ['mitochondria', 'the mitochondria', 'mitochondrion', 'powerhouse', 'powerhouse of the cell', 'powerhouses'],
    'ribosomes': ['ribosomes', 'the ribosomes', 'ribosome'],
    'er': ['ER', 'endoplasmic reticulum', 'the ER', 'rough ER', 'smooth ER'],
    'golgi': ['golgi', 'Golgi', 'Golgi apparatus', 'Golgi body', 'the Golgi'],
    'chloroplast': ['chloroplast', 'chloroplasts', 'the chloroplast', 'the chloroplasts'],
    'vacuole': ['vacuole', 'central vacuole', 'the vacuole'],
    'cell-wall': ['cell wall', 'the cell wall', 'outer wall'],
    'lysosome': ['lysosome', 'lysosomes', 'the lysosome'],
    'cytoplasm': ['cytoplasm', 'the cytoplasm', 'cytosol'],
  };
  for (const org of organelles) {
    if (org.id === 'cell-membrane-label') continue; // the outline is the 'cell-membrane' feature above
    const extras = ORGANELLE_SYNONYMS[org.id] ?? [];
    const labels = new Set<string>([org.id, org.label, org.label.toLowerCase(), ...extras]);
    entries.push({
      name: org.id,
      kind: 'object',
      description: org.label,
      labels: Array.from(labels),
    });
  }
  return entries;
}

/** Highlight lookup tolerant of the names a tutor actually sends ("ER", "cell wall", "Golgi apparatus"). */
function normaliseOrganelleKey(raw: string): string {
  const k = String(raw || '').toLowerCase().trim().replace(/[_\s]+/g, '-');
  if (k === 'cell-membrane' || k === 'membrane' || k === 'plasma-membrane') return 'cell-membrane-label';
  if (k === 'mitochondrion') return 'mitochondria';
  if (k === 'ribosome') return 'ribosomes';
  if (k === 'chloroplasts') return 'chloroplast';
  if (k === 'central-vacuole') return 'vacuole';
  if (k === 'endoplasmic-reticulum' || k === 'rough-er' || k === 'smooth-er') return 'er';
  if (k === 'golgi-apparatus' || k === 'golgi-body') return 'golgi';
  if (k === 'lysosomes') return 'lysosome';
  return k;
}

interface PlacedLabel { org: Organelle; side: 'left' | 'right'; top: number; noteLines: string[]; height: number; }

/** Stack one column's labels beside their anchors: no two overlap, none leaves the canvas, leaders do not cross. */
function placeColumn(items: PlacedLabel[], top: number, bottom: number, gap: number): void {
  items.sort((a, b) => a.org.labelPos.y - b.org.labelPos.y);
  let prevEnd = top - gap;
  for (const it of items) {
    it.top = Math.max(it.org.labelPos.y - LABEL_FS / 2, prevEnd + gap);
    prevEnd = it.top + it.height;
  }
  let limit = bottom;
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it.top + it.height > limit) it.top = limit - it.height;
    limit = it.top - gap;
  }
}

export default function CellDiagramRenderer({ title, type, highlight, notes }: CellDiagramProps) {
  const cellType: 'animal' | 'plant' = type === 'plant' ? 'plant' : 'animal';
  const organelles = makeOrganelles(cellType);
  const highlightMap = new Map((highlight || []).map((h) => [normaliseOrganelleKey(h.organelle), h]));
  const findHighlight = (org: Organelle) => highlightMap.get(org.id) || highlightMap.get(normaliseOrganelleKey(org.label));
  const anyMatched = organelles.some((o) => findHighlight(o));
  // Labels: every part by default; with a highlight list, only the parts named
  // (a highlight naming nothing we draw falls back to labelling everything).
  const labelled = anyMatched ? organelles.filter((o) => findHighlight(o)) : organelles;

  const noteWrapWidth = (LEFT_X - 10) * (13 / NOTE_FS); // wrapLabel estimates at 13px
  const placed: PlacedLabel[] = labelled.map((org) => {
    const h = findHighlight(org);
    const allLines = h?.note ? wrapLabel(h.note, noteWrapWidth) : [];
    const noteLines = allLines.length > 6 ? [...allLines.slice(0, 5), `${allLines[5]}…`] : allLines;
    const side = org.side ?? (org.labelPos.x < CX ? 'left' : 'right');
    return { org, side, top: 0, noteLines, height: LABEL_FS + 2 + noteLines.length * NOTE_LH };
  });
  const left = placed.filter((p) => p.side === 'left');
  const right = placed.filter((p) => p.side === 'right');
  placeColumn(left, 16, H - 12, 12);
  placeColumn(right, 16, H - 12, 12);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 460 }}>
        {/* Cell membrane / wall */}
        {cellType === 'plant' ? (
          <g {...feat('cell-membrane', { cx: CX, cy: CY, w: PLANT.w, h: PLANT.h }, VB)}>
            <rect x={PLANT.x + PLANT.wall / 2} y={PLANT.y + PLANT.wall / 2} width={PLANT.w - PLANT.wall} height={PLANT.h - PLANT.wall} rx={PLANT.r}
              fill="#f0fdf4" stroke="#4d7c0f" strokeWidth={PLANT.wall} />
            <rect x={PLANT.x + PLANT.wall + 1.5} y={PLANT.y + PLANT.wall + 1.5} width={PLANT.w - 2 * PLANT.wall - 3} height={PLANT.h - 2 * PLANT.wall - 3} rx={PLANT.r - 6}
              fill="none" stroke="#ca8a04" strokeWidth={1.6} />
          </g>
        ) : (
          <path
            d={animalOutline()}
            fill="#fff7ed" stroke="#c2410c" strokeWidth={2.5} strokeLinejoin="round"
            {...feat('cell-membrane', { cx: CX, cy: CY, w: 300, h: 316 }, VB)}
          />
        )}

        {/* Organelles — each exposed as data-feature="<organelle-id>"
            (e.g. "nucleus", "mitochondria", "ribosomes") so the tutor
            can point at a specific organelle by name. */}
        {organelles.filter((o) => o.id !== 'cell-membrane-label').map((org) => {
          const h = findHighlight(org);
          return <g key={org.id} {...feat(org.id, org.bbox, VB)}>{org.render({ color: h?.color })}</g>;
        })}

        {/* Labels — two side columns, each label level with its part where
            the column allows, joined by a straight leader ending in a dot. */}
        {placed.map(({ org, side, top, noteLines }) => {
          const isLeft = side === 'left';
          const tx = isLeft ? LEFT_X : RIGHT_X;
          const baseline = top + LABEL_FS - 2;
          const lineStartX = isLeft ? tx + 6 : tx - 6;
          const lineY = top + LABEL_FS / 2;
          return (
            <g key={org.id}>
              <line x1={lineStartX} y1={lineY} x2={org.labelPos.x} y2={org.labelPos.y} stroke={DIAGRAM_COLORS.slate} strokeWidth={0.9} />
              <circle cx={org.labelPos.x} cy={org.labelPos.y} r={2.2} fill={DIAGRAM_COLORS.slate} />
              <text x={tx} y={baseline} fontSize={LABEL_FS} fill={DIAGRAM_COLORS.text} fontWeight={600} textAnchor={isLeft ? 'end' : 'start'}>
                {org.label}
              </text>
              {noteLines.map((line, li) => (
                <text key={li} x={tx} y={baseline + (li + 1) * NOTE_LH} fontSize={NOTE_FS} fill={DIAGRAM_COLORS.muted} textAnchor={isLeft ? 'end' : 'start'}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
