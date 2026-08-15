'use client';

import React from 'react';
import {
  neuronFeatureNames,
  brainFeatureNames,
  type NeuronFigure,
  type NeuronPart,
  type BrainRegionsFigure,
  type BrainPart,
} from '@/lib/tutor/diagrams/catalog/kinds/anatomy';

const HI = '#dc2626';

/** A label with a thin leader line to the part it names. */
function Leader({
  lx, ly, tx, ty, text, hi, anchor = 'middle',
}: {
  lx: number; ly: number; tx: number; ty: number; text: string; hi?: boolean; anchor?: 'start' | 'middle' | 'end';
}) {
  // Start the leader just off the text (above it for bottom labels, below for top).
  const startY = ly < ty ? ly + 5 : ly - 13;
  return (
    <g>
      <line x1={lx} y1={startY} x2={tx} y2={ty} stroke={hi ? HI : '#9ca3af'} strokeWidth={hi ? 1.5 : 1} />
      <circle cx={tx} cy={ty} r={2} fill={hi ? HI : '#9ca3af'} />
      <text x={lx} y={ly} fontSize={12.5} textAnchor={anchor} fill={hi ? HI : '#374151'} fontWeight={hi ? 700 : 600}>
        {text}
      </text>
    </g>
  );
}

// ── neuron_diagram ─────────────────────────────────────────────────────────
export function CatalogNeuronDiagramRenderer({ figure }: { figure: NeuronFigure }) {
  const N = neuronFeatureNames;
  const hi = (p: NeuronPart) => figure.highlight.includes(p);
  const W = 760;
  const H = 360;
  const cy = 175;

  // Dendrite branches radiating from the soma's left hemisphere.
  const somaCx = 150;
  const dendrite = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    const x0 = somaCx + 48 * Math.cos(a);
    const y0 = cy + 42 * Math.sin(a);
    const x1 = somaCx + 116 * Math.cos(a);
    const y1 = cy + 104 * Math.sin(a);
    const f = (16 * Math.PI) / 180;
    const x2 = x1 + 28 * Math.cos(a - f);
    const y2 = y1 + 26 * Math.sin(a - f);
    const x3 = x1 + 28 * Math.cos(a + f);
    const y3 = y1 + 26 * Math.sin(a + f);
    return `M ${x0} ${y0} L ${x1} ${y1} M ${x1} ${y1} L ${x2} ${y2} M ${x1} ${y1} L ${x3} ${y3}`;
  };
  const dendAngles = [110, 140, 170, 200, 232];
  const myelinX = [255, 345, 435, 525];
  const gapX = [300, 390, 480];

  return (
    <div className="neuron-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.neuron}
        data-feature-label={figure.title || 'neuron'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="nrn-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>

        {/* Dendrites */}
        <g data-feature={N.part('dendrites')} data-feature-label="dendrites" data-feature-cx={0.09} data-feature-cy={0.5} data-feature-w={0.18} data-feature-h={0.6}>
          {dendAngles.map((d, i) => (
            <path key={i} d={dendrite(d)} fill="none" stroke={hi('dendrites') ? HI : '#7c3aed'} strokeWidth={hi('dendrites') ? 3 : 2} strokeLinecap="round" />
          ))}
        </g>

        {/* Axon (under the myelin) */}
        <g data-feature={N.part('axon')} data-feature-label="axon" data-feature-cx={0.51} data-feature-cy={0.49} data-feature-w={0.55} data-feature-h={0.06}>
          <line x1={196} y1={cy} x2={585} y2={cy} stroke={hi('axon') ? HI : '#9ca3af'} strokeWidth={hi('axon') ? 6 : 4.5} strokeLinecap="round" />
        </g>

        {/* Myelin sheath segments */}
        <g data-feature={N.part('myelin_sheath')} data-feature-label="myelin sheath" data-feature-cx={0.51} data-feature-cy={0.49} data-feature-w={0.5} data-feature-h={0.1}>
          {myelinX.map((mx, i) => (
            <ellipse key={i} cx={mx} cy={cy} rx={38} ry={15} fill="#bfdbfe" stroke={hi('myelin_sheath') ? HI : '#2563eb'} strokeWidth={hi('myelin_sheath') ? 3 : 2} />
          ))}
        </g>

        {/* Nodes of Ranvier — small marks at the gaps */}
        <g data-feature={N.part('node_of_ranvier')} data-feature-label="node of Ranvier" data-feature-cx={0.51} data-feature-cy={0.49} data-feature-w={0.5} data-feature-h={0.05}>
          {gapX.map((gx, i) => (
            <circle key={i} cx={gx} cy={cy} r={hi('node_of_ranvier') ? 4.5 : 3} fill={hi('node_of_ranvier') ? HI : '#6b7280'} />
          ))}
        </g>

        {/* Soma (cell body) */}
        <g data-feature={N.part('cell_body')} data-feature-label="cell body" data-feature-cx={somaCx / W} data-feature-cy={0.5} data-feature-w={0.14} data-feature-h={0.26}>
          <ellipse cx={somaCx} cy={cy} rx={48} ry={42} fill="#fde68a" stroke={hi('cell_body') ? HI : '#b45309'} strokeWidth={hi('cell_body') ? 3.5 : 2.5} />
        </g>
        {/* Nucleus */}
        <g data-feature={N.part('nucleus')} data-feature-label="nucleus" data-feature-cx={somaCx / W} data-feature-cy={0.5} data-feature-w={0.05} data-feature-h={0.1}>
          <circle cx={somaCx} cy={cy} r={16} fill="#f59e0b" stroke={hi('nucleus') ? HI : '#b45309'} strokeWidth={hi('nucleus') ? 3 : 1.5} />
        </g>

        {/* Axon terminals */}
        <g data-feature={N.part('axon_terminals')} data-feature-label="axon terminals" data-feature-cx={0.84} data-feature-cy={0.5} data-feature-w={0.18} data-feature-h={0.32}>
          {[[610, 135, 648, 120], [612, 175, 658, 175], [610, 215, 648, 230]].map(([bx, by, ex, ey], i) => (
            <g key={i}>
              <path d={`M 585 ${cy} L ${bx} ${by} L ${ex} ${ey}`} fill="none" stroke={hi('axon_terminals') ? HI : '#9ca3af'} strokeWidth={hi('axon_terminals') ? 3 : 2} strokeLinecap="round" />
              <circle cx={ex} cy={ey} r={7} fill={hi('axon_terminals') ? HI : '#9ca3af'} />
            </g>
          ))}
        </g>

        {/* Synapse — gap to a receiving dendrite of the next neuron */}
        <g data-feature={N.part('synapse')} data-feature-label="synapse" data-feature-cx={0.91} data-feature-cy={0.34} data-feature-w={0.1} data-feature-h={0.16}>
          <path d="M 672 112 C 700 100, 716 116, 706 140" fill="none" stroke={hi('synapse') ? HI : '#94a3b8'} strokeWidth={hi('synapse') ? 3 : 2.5} strokeLinecap="round" />
          <line x1={651} y1={123} x2={668} y2={114} stroke={hi('synapse') ? HI : '#cbd5e1'} strokeWidth={1.5} strokeDasharray="3 3" />
        </g>

        {/* Labels */}
        <Leader lx={62} ly={266} tx={92} ty={214} text="Dendrites" hi={hi('dendrites')} />
        <Leader lx={168} ly={272} tx={158} ty={216} text="Cell body (soma)" hi={hi('cell_body')} />
        <Leader lx={150} ly={104} tx={152} ty={161} text="Nucleus" hi={hi('nucleus')} />
        <Leader lx={300} ly={266} tx={300} ty={182} text="Axon" hi={hi('axon')} />
        <Leader lx={345} ly={104} tx={345} ty={160} text="Myelin sheath" hi={hi('myelin_sheath')} />
        <Leader lx={505} ly={104} tx={480} ty={168} text="Node of Ranvier" hi={hi('node_of_ranvier')} />
        <Leader lx={668} ly={104} tx={648} ty={150} text="Axon terminals" hi={hi('axon_terminals')} />
        <Leader lx={706} ly={262} tx={700} ty={140} text="Synapse" hi={hi('synapse')} />
      </svg>
    </div>
  );
}

// ── brain_regions ──────────────────────────────────────────────────────────
const CEREBRUM_PATH =
  'M 110 205 C 86 130, 170 74, 270 80 C 360 84, 470 78, 522 120 ' +
  'C 562 152, 556 206, 500 226 C 462 240, 430 240, 398 242 ' +
  'C 348 250, 296 252, 246 246 C 186 240, 128 244, 110 205 Z';

export function CatalogBrainRegionsRenderer({ figure }: { figure: BrainRegionsFigure }) {
  const N = brainFeatureNames;
  const hi = (p: BrainPart) => figure.highlight.includes(p);
  const W = 620;
  const H = 440;

  return (
    <div className="brain-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
        data-feature={N.brain}
        data-feature-label={figure.title || 'brain'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <clipPath id="cerebrum-clip"><path d={CEREBRUM_PATH} /></clipPath>
        </defs>

        {figure.view === 'lobes' ? (
          <>
            {/* Lobe zones, clipped to the cerebrum silhouette */}
            <g clipPath="url(#cerebrum-clip)">
              <rect x={70} y={60} width={162} height={200} fill={hi('frontal_lobe') ? '#fca5a5' : '#bfdbfe'} />
              <rect x={232} y={60} width={170} height={100} fill={hi('parietal_lobe') ? '#fca5a5' : '#bbf7d0'} />
              <rect x={402} y={60} width={170} height={200} fill={hi('occipital_lobe') ? '#fca5a5' : '#fde68a'} />
              <rect x={232} y={160} width={170} height={100} fill={hi('temporal_lobe') ? '#fca5a5' : '#ddd6fe'} />
            </g>
            {/* Sulci hints + outline */}
            <path d={CEREBRUM_PATH} fill="none" stroke="#475569" strokeWidth={2.5} />
            <line x1={232} y1={84} x2={232} y2={248} stroke="#64748b" strokeWidth={1.5} />
            <line x1={232} y1={160} x2={402} y2={160} stroke="#64748b" strokeWidth={1.5} />
            <line x1={402} y1={84} x2={402} y2={232} stroke="#64748b" strokeWidth={1.5} />

            {/* Cerebellum */}
            <g data-feature={N.part('cerebellum')} data-feature-label="cerebellum" data-feature-cx={0.78} data-feature-cy={0.66} data-feature-w={0.2} data-feature-h={0.22}>
              <ellipse cx={482} cy={288} rx={52} ry={40} fill={hi('cerebellum') ? '#fca5a5' : '#cbd5e1'} stroke="#475569" strokeWidth={2.5} />
              {[268, 288, 308].map((yy, i) => (
                <path key={i} d={`M 438 ${yy} Q 482 ${yy + 8} 526 ${yy}`} fill="none" stroke="#64748b" strokeWidth={1} />
              ))}
            </g>
            {/* Brain stem */}
            <g data-feature={N.part('brain_stem')} data-feature-label="brain stem" data-feature-cx={0.6} data-feature-cy={0.74} data-feature-w={0.07} data-feature-h={0.22}>
              <path d="M 352 244 C 348 290, 360 330, 372 350 L 392 350 C 398 320, 396 280, 388 246 Z"
                fill={hi('brain_stem') ? '#fca5a5' : '#e2e8f0'} stroke="#475569" strokeWidth={2.5} />
            </g>

            <Leader lx={120} ly={350} tx={150} ty={170} text="Frontal lobe" hi={hi('frontal_lobe')} />
            <Leader lx={300} ly={48} tx={310} ty={110} text="Parietal lobe" hi={hi('parietal_lobe')} />
            <Leader lx={552} ly={120} tx={470} ty={150} text="Occipital lobe" hi={hi('occipital_lobe')} anchor="middle" />
            <Leader lx={250} ly={350} tx={300} ty={210} text="Temporal lobe" hi={hi('temporal_lobe')} />
            <Leader lx={548} ly={300} tx={510} ty={288} text="Cerebellum" hi={hi('cerebellum')} anchor="start" />
            <Leader lx={372} ly={392} tx={372} ty={330} text="Brain stem" hi={hi('brain_stem')} />
          </>
        ) : (
          <>
            {/* Cerebrum silhouette (context) */}
            <path d={CEREBRUM_PATH} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} />
            {/* Thalamus (two-lobed) */}
            <g data-feature={N.part('thalamus')} data-feature-label="thalamus" data-feature-cx={0.48} data-feature-cy={0.4} data-feature-w={0.18} data-feature-h={0.16}>
              <ellipse cx={284} cy={172} rx={34} ry={26} fill={hi('thalamus') ? '#fca5a5' : '#fbcfe8'} stroke="#9d174d" strokeWidth={2} />
              <ellipse cx={316} cy={176} rx={30} ry={23} fill={hi('thalamus') ? '#fca5a5' : '#fbcfe8'} stroke="#9d174d" strokeWidth={2} />
            </g>
            {/* Hypothalamus */}
            <g data-feature={N.part('hypothalamus')} data-feature-label="hypothalamus" data-feature-cx={0.47} data-feature-cy={0.49} data-feature-w={0.1} data-feature-h={0.08}>
              <ellipse cx={288} cy={210} rx={20} ry={12} fill={hi('hypothalamus') ? '#fca5a5' : '#fed7aa'} stroke="#9a3412" strokeWidth={2} />
            </g>
            {/* Hippocampus (curl) */}
            <g data-feature={N.part('hippocampus')} data-feature-label="hippocampus" data-feature-cx={0.57} data-feature-cy={0.52} data-feature-w={0.16} data-feature-h={0.16}>
              <path d="M 332 196 C 372 198, 388 226, 366 250 C 352 264, 330 260, 330 240 C 330 228, 344 226, 348 236"
                fill="none" stroke={hi('hippocampus') ? HI : '#15803d'} strokeWidth={hi('hippocampus') ? 7 : 6} strokeLinecap="round" />
            </g>
            {/* Amygdala */}
            <g data-feature={N.part('amygdala')} data-feature-label="amygdala" data-feature-cx={0.55} data-feature-cy={0.46} data-feature-w={0.08} data-feature-h={0.09}>
              <ellipse cx={338} cy={200} rx={13} ry={11} fill={hi('amygdala') ? HI : '#7c3aed'} stroke="#5b21b6" strokeWidth={2} />
            </g>

            <Leader lx={180} ly={120} tx={280} ty={168} text="Thalamus" hi={hi('thalamus')} />
            <Leader lx={170} ly={250} tx={278} ty={212} text="Hypothalamus" hi={hi('hypothalamus')} />
            <Leader lx={470} ly={300} tx={362} ty={244} text="Hippocampus" hi={hi('hippocampus')} anchor="start" />
            <Leader lx={430} ly={150} tx={344} ty={198} text="Amygdala" hi={hi('amygdala')} anchor="start" />
          </>
        )}
      </svg>
    </div>
  );
}
