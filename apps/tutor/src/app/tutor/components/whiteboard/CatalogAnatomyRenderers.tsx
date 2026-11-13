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
  const W = 770;
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
          {/* membrane of the NEXT cell, a small gap away from the terminals */}
          <path d="M 700 92 C 672 130, 672 220, 700 258" fill="none" stroke={hi('synapse') ? HI : '#7c3aed'} strokeWidth={hi('synapse') ? 4 : 3} strokeLinecap="round" opacity={hi('synapse') ? 1 : 0.55} />
          {/* neurotransmitter crossing the gap */}
          {[[660, 224], [664, 231], [661, 238]].map(([dx, dy], i) => (
            <circle key={i} cx={dx} cy={dy} r={1.6} fill={hi('synapse') ? HI : '#64748b'} />
          ))}
          <text x={712} y={179} fontSize={10.5} fill="#6b7280" fontStyle="italic">next cell</text>
        </g>

        {/* Labels */}
        {/* Labels: one row above the cell and one below, none over a dendrite */}
        <Leader lx={58} ly={338} tx={104} ty={292} text="Dendrites" hi={hi('dendrites')} />
        <Leader lx={206} ly={300} tx={166} ty={215} text="Cell body (soma)" hi={hi('cell_body')} />
        <Leader lx={186} ly={66} tx={154} ty={162} text="Nucleus" hi={hi('nucleus')} />
        <Leader lx={300} ly={266} tx={300} ty={182} text="Axon" hi={hi('axon')} />
        <Leader lx={345} ly={104} tx={345} ty={160} text="Myelin sheath" hi={hi('myelin_sheath')} />
        <Leader lx={505} ly={104} tx={480} ty={168} text="Node of Ranvier" hi={hi('node_of_ranvier')} />
        <Leader lx={610} ly={84} tx={646} ty={113} text="Axon terminals" hi={hi('axon_terminals')} />
        <Leader lx={664} ly={306} tx={665} ty={242} text="Synapse" hi={hi('synapse')} />
        {/* direction the signal travels */}
        <line x1={300} y1={322} x2={470} y2={322} stroke="#374151" strokeWidth={1.5} markerEnd="url(#nrn-arr)" />
        <text x={385} y={340} fontSize={11} textAnchor="middle" fill="#6b7280">direction of the nerve impulse</text>
      </svg>
    </div>
  );
}

// ── brain_regions ──────────────────────────────────────────────────────────
// Side view of the left hemisphere, facing left (frontal lobe at the front).
const CEREBRUM_PATH =
  'M 96 232 C 70 200, 76 140, 120 104 C 170 62, 270 48, 350 56 ' +
  'C 440 62, 520 100, 540 170 C 552 214, 530 250, 490 262 ' +
  'C 460 268, 430 262, 400 262 C 370 290, 300 300, 250 290 ' +
  'C 210 282, 190 262, 176 250 C 150 252, 120 250, 96 232 Z';
// Sulci that separate the lobes.
const SYLVIAN = 'M 176 250 Q 220 222 270 215 L 365 198';          // lateral fissure
const CENTRAL = 'M 300 54 Q 280 130 270 215';                      // central sulcus
const PARIETO_OCCIPITAL = 'M 458 70 Q 440 130 446 185 Q 440 225 425 264';
const LOBE_ZONES: Record<'frontal_lobe' | 'parietal_lobe' | 'occipital_lobe' | 'temporal_lobe', string> = {
  frontal_lobe: 'M 0 0 L 300 0 L 300 54 Q 280 130 270 215 Q 220 222 176 250 L 0 420 Z',
  parietal_lobe: 'M 300 0 L 458 0 L 458 70 Q 440 130 446 185 L 365 198 L 270 215 Q 280 130 300 54 Z',
  occipital_lobe: 'M 458 0 L 620 0 L 620 440 L 425 440 L 425 264 Q 440 225 446 185 Q 440 130 458 70 Z',
  temporal_lobe: 'M 176 250 Q 220 222 270 215 L 365 198 L 446 185 Q 440 225 425 264 L 425 440 L 0 440 L 0 420 Z',
};
const LOBE_FILL: Record<keyof typeof LOBE_ZONES, string> = {
  frontal_lobe: '#bfdbfe', parietal_lobe: '#bbf7d0', occipital_lobe: '#fde68a', temporal_lobe: '#ddd6fe',
};
const LOBE_INK: Record<keyof typeof LOBE_ZONES, string> = {
  frontal_lobe: '#1e40af', parietal_lobe: '#166534', occipital_lobe: '#92400e', temporal_lobe: '#5b21b6',
};
// Faint folds (gyri) so the surface reads as cortex, not a flat blob.
const GYRI = [
  'M 130 130 q 22 -14 40 4 q 14 14 34 2', 'M 120 190 q 26 -12 44 6 q 12 10 30 0', 'M 190 96 q 24 -10 40 8 q 10 10 26 2',
  'M 320 90 q 22 -12 40 6 q 12 12 32 2', 'M 340 150 q 22 -12 40 4 q 12 10 30 0', 'M 400 104 q 16 -8 30 6',
  'M 470 120 q 18 -8 30 8 q 8 10 22 4', 'M 468 216 q 18 -10 32 4 q 8 8 20 2', 'M 230 262 q 26 -10 46 4 q 14 10 34 0', 'M 320 244 q 22 -8 40 4',
];
const CEREBELLUM = { cx: 468, cy: 298, rx: 62, ry: 42 };
const BRAIN_STEM_PATH = 'M 370 262 C 372 312, 384 360, 394 404 L 430 404 C 426 362, 420 314, 420 272 Z';

/** A label in a side margin with a straight leader to the part it names. */
function SideLeader({ side, x, y, tx, ty, text, hi }: { side: 'left' | 'right'; x: number; y: number; tx: number; ty: number; text: string; hi?: boolean }) {
  return (
    <g>
      <line x1={side === 'left' ? x + 6 : x - 6} y1={y - 4} x2={tx} y2={ty} stroke={hi ? HI : '#64748b'} strokeWidth={hi ? 1.5 : 1} />
      <circle cx={tx} cy={ty} r={2.2} fill={hi ? HI : '#64748b'} />
      <text x={x} y={y} fontSize={12.5} textAnchor={side === 'left' ? 'end' : 'start'} fill={hi ? HI : '#374151'} fontWeight={hi ? 700 : 600}>{text}</text>
    </g>
  );
}

export function CatalogBrainRegionsRenderer({ figure }: { figure: BrainRegionsFigure }) {
  const N = brainFeatureNames;
  const hi = (p: BrainPart) => figure.highlight.includes(p);
  const OX = 80;       // room for a left label column
  const W = 760;
  const H = 430;
  const fx = (x: number) => (x + OX) / W;
  const lobes = Object.keys(LOBE_ZONES) as Array<keyof typeof LOBE_ZONES>;
  const lobeLabel: Record<keyof typeof LOBE_ZONES, { x: number; y: number; lines: string[] }> = {
    frontal_lobe: { x: 185, y: 162, lines: ['Frontal', 'lobe'] },
    parietal_lobe: { x: 372, y: 124, lines: ['Parietal', 'lobe'] },
    occipital_lobe: { x: 494, y: 170, lines: ['Occipital', 'lobe'] },
    temporal_lobe: { x: 318, y: 250, lines: ['Temporal lobe'] },
  };

  return (
    <div className="brain-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
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
        <g transform={`translate(${OX} 0)`}>
          {figure.view === 'lobes' ? (
            <>
              {/* Cerebellum (tucked under the back of the cerebrum) */}
              <g data-feature={N.part('cerebellum')} data-feature-label="cerebellum" data-feature-cx={fx(CEREBELLUM.cx)} data-feature-cy={0.72} data-feature-w={0.17} data-feature-h={0.2}>
                <ellipse cx={CEREBELLUM.cx} cy={CEREBELLUM.cy} rx={CEREBELLUM.rx} ry={CEREBELLUM.ry} fill={hi('cerebellum') ? '#fca5a5' : '#fecdd3'} stroke="#475569" strokeWidth={2.5} />
                {[278, 292, 306, 320].map((yy, i) => {
                  const half = CEREBELLUM.rx * Math.sqrt(Math.max(0, 1 - ((yy - CEREBELLUM.cy) / CEREBELLUM.ry) ** 2)) - 5;
                  return <path key={i} d={`M ${CEREBELLUM.cx - half} ${yy} Q ${CEREBELLUM.cx} ${yy + 7} ${CEREBELLUM.cx + half} ${yy}`} fill="none" stroke="#9f1239" strokeWidth={0.9} opacity={0.5} />;
                })}
              </g>
              {/* Brain stem */}
              <g data-feature={N.part('brain_stem')} data-feature-label="brain stem" data-feature-cx={fx(400)} data-feature-cy={0.78} data-feature-w={0.08} data-feature-h={0.32}>
                <path d={BRAIN_STEM_PATH} fill={hi('brain_stem') ? '#fca5a5' : '#e2e8f0'} stroke="#475569" strokeWidth={2.5} strokeLinejoin="round" />
              </g>

              {/* Lobe zones, clipped to the cerebrum silhouette */}
              <g clipPath="url(#cerebrum-clip)">
                {lobes.map((l) => <path key={l} d={LOBE_ZONES[l]} fill={hi(l) ? '#fca5a5' : LOBE_FILL[l]} />)}
                {GYRI.map((d, i) => <path key={i} d={d} fill="none" stroke="#475569" strokeWidth={1.1} opacity={0.22} strokeLinecap="round" />)}
                {[SYLVIAN, CENTRAL, PARIETO_OCCIPITAL].map((d, i) => <path key={i} d={d} fill="none" stroke="#475569" strokeWidth={2} strokeLinecap="round" />)}
              </g>
              <path d={CEREBRUM_PATH} fill="none" stroke="#475569" strokeWidth={2.5} strokeLinejoin="round" />

              {/* Lobe names sit inside their lobes */}
              {lobes.map((l) => {
                const lab = lobeLabel[l];
                return (
                  <g key={l} data-feature={N.part(l)} data-feature-label={lab.lines.join(' ')} data-feature-cx={fx(lab.x)} data-feature-cy={lab.y / H} data-feature-w={0.16} data-feature-h={0.16}>
                    <text x={lab.x} y={lab.y} fontSize={13} textAnchor="middle" fill={hi(l) ? '#991b1b' : LOBE_INK[l]} fontWeight={700}>
                      {lab.lines.map((ln, i) => <tspan key={i} x={lab.x} dy={i === 0 ? 0 : 15}>{ln}</tspan>)}
                    </text>
                  </g>
                );
              })}
              <text x={CEREBELLUM.cx + 6} y={318} fontSize={12.5} textAnchor="middle" fill={hi('cerebellum') ? '#991b1b' : '#9f1239'} fontWeight={700}>Cerebellum</text>
              <SideLeader side="left" x={300} y={372} tx={392} ty={366} text="Brain stem" hi={hi('brain_stem')} />
              <text x={60} y={300} fontSize={10.5} fill="#6b7280" fontStyle="italic" textAnchor="middle">front</text>
              <text x={566} y={300} fontSize={10.5} fill="#6b7280" fontStyle="italic" textAnchor="middle">back</text>
            </>
          ) : (
            <>
              {/* Whole brain as pale context */}
              <ellipse cx={CEREBELLUM.cx} cy={CEREBELLUM.cy} rx={CEREBELLUM.rx} ry={CEREBELLUM.ry} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.5} />
              <path d={BRAIN_STEM_PATH} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.5} />
              <path d={CEREBRUM_PATH} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} />
              {/* Thalamus */}
              <g data-feature={N.part('thalamus')} data-feature-label="thalamus" data-feature-cx={fx(338)} data-feature-cy={0.42} data-feature-w={0.14} data-feature-h={0.14}>
                <ellipse cx={338} cy={182} rx={42} ry={26} fill={hi('thalamus') ? '#fca5a5' : '#fbcfe8'} stroke={hi('thalamus') ? HI : '#9d174d'} strokeWidth={hi('thalamus') ? 3 : 2} />
              </g>
              {/* Hypothalamus (below and in front of the thalamus) */}
              <g data-feature={N.part('hypothalamus')} data-feature-label="hypothalamus" data-feature-cx={fx(296)} data-feature-cy={0.51} data-feature-w={0.08} data-feature-h={0.08}>
                <ellipse cx={296} cy={218} rx={21} ry={13} fill={hi('hypothalamus') ? '#fca5a5' : '#fed7aa'} stroke={hi('hypothalamus') ? HI : '#9a3412'} strokeWidth={hi('hypothalamus') ? 3 : 2} />
              </g>
              {/* Hippocampus (curved, running back from the amygdala) */}
              <g data-feature={N.part('hippocampus')} data-feature-label="hippocampus" data-feature-cx={fx(360)} data-feature-cy={0.57} data-feature-w={0.2} data-feature-h={0.12}>
                <path d="M 296 252 C 332 268, 384 262, 408 236 C 418 224, 414 212, 402 210"
                  fill="none" stroke={hi('hippocampus') ? HI : '#15803d'} strokeWidth={hi('hippocampus') ? 10 : 8} strokeLinecap="round" />
              </g>
              {/* Amygdala (almond at the front tip of the hippocampus) */}
              <g data-feature={N.part('amygdala')} data-feature-label="amygdala" data-feature-cx={fx(284)} data-feature-cy={0.58} data-feature-w={0.07} data-feature-h={0.08}>
                <ellipse cx={284} cy={248} rx={14} ry={11} fill={hi('amygdala') ? '#fca5a5' : '#c4b5fd'} stroke={hi('amygdala') ? HI : '#5b21b6'} strokeWidth={hi('amygdala') ? 3 : 2} />
              </g>

              <SideLeader side="left" x={40} y={196} tx={280} ty={216} text="Hypothalamus" hi={hi('hypothalamus')} />
              <SideLeader side="left" x={40} y={266} tx={274} ty={250} text="Amygdala" hi={hi('amygdala')} />
              <SideLeader side="right" x={580} y={150} tx={368} ty={172} text="Thalamus" hi={hi('thalamus')} />
              <SideLeader side="right" x={580} y={236} tx={404} ty={240} text="Hippocampus" hi={hi('hippocampus')} />
              <text x={60} y={320} fontSize={10.5} fill="#6b7280" fontStyle="italic" textAnchor="middle">front</text>
              <text x={566} y={320} fontSize={10.5} fill="#6b7280" fontStyle="italic" textAnchor="middle">back</text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
