'use client';

import React from 'react';
import {
  MITOSIS_PHASES,
  mitosisFeatureNames,
  meiosisFeatureNames,
  dnaReplicationFeatureNames,
  cellMembraneFeatureNames,
  type MitosisFigure,
  type MitosisPhase,
  type MeiosisFigure,
  type DnaReplicationFigure,
  type CellMembraneFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/cell-biology';

const INK = '#374151';
const GRAY = '#94a3b8';
const FAINT = '#cbd5e1';
const RED = '#dc2626';      // maternal long chromosome
const PINK = '#ec4899';     // paternal long chromosome
const BLUE = '#2563eb';     // maternal short chromosome
const LBLUE = '#38bdf8';    // paternal short chromosome
const GREEN = '#16a34a';
const PURPLE = '#7c3aed';
const ORANGE = '#ea580c';
const TEAL = '#0d9488';
const AMBER = '#d97706';
const HL = '#059669';       // highlight (emerald)
const HL_BG = '#ecfdf5';

// ══════════════════════════════════════════════════════════════════════════
//  shared chromosome primitives
// ══════════════════════════════════════════════════════════════════════════

/** A condensed, replicated chromosome as an X (two sister chromatids). */
function chromX(key: string, cx: number, cy: number, color: string, scale = 1) {
  const a = 10 * scale;
  const b = 20 * scale;
  return (
    <g key={key}>
      <line x1={cx - a} y1={cy - b} x2={cx + a} y2={cy + b} stroke={color} strokeWidth={5.5 * scale} strokeLinecap="round" />
      <line x1={cx - a} y1={cy + b} x2={cx + a} y2={cy - b} stroke={color} strokeWidth={5.5 * scale} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill="#fff" stroke={color} strokeWidth={1} />
    </g>
  );
}

/** A single (unreplicated) chromatid rod. */
function chromRod(key: string, cx: number, cy: number, color: string, h = 32) {
  return <line key={key} x1={cx} y1={cy - h / 2} x2={cx} y2={cy + h / 2} stroke={color} strokeWidth={5.5} strokeLinecap="round" />;
}

/** A replicated chromosome drawn as two parallel vertical chromatids joined at a centromere ("H"). */
function repChrom(key: string, cx: number, cy: number, color: string, h: number) {
  const off = 6;
  return (
    <g key={key}>
      <line x1={cx - off} y1={cy - h / 2} x2={cx - off} y2={cy + h / 2} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={cx + off} y1={cy - h / 2} x2={cx + off} y2={cy + h / 2} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={cx - off} y1={cy} x2={cx + off} y2={cy} stroke={color} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={2.4} fill="#fff" stroke={color} strokeWidth={0.8} />
    </g>
  );
}

function singleChrom(key: string, cx: number, cy: number, color: string, h: number) {
  return <line key={key} x1={cx} y1={cy - h / 2} x2={cx} y2={cy + h / 2} stroke={color} strokeWidth={5} strokeLinecap="round" />;
}

/** A wavy chromatin thread (uncondensed DNA). */
function squigglePoints(cx: number, cy: number, halfW: number, amp: number, waves = 2): string {
  const pts: string[] = [];
  const N = 22;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = cx - halfW + 2 * halfW * t;
    const y = cy + amp * Math.sin(t * Math.PI * 2 * waves);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

/** A centrosome marker (small radiating aster). */
function centrosome(key: string, px: number, py: number) {
  const spikes = [];
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    spikes.push(
      <line
        key={`${key}-s${i}`}
        x1={px}
        y1={py}
        x2={px + Math.cos(ang) * 7}
        y2={py + Math.sin(ang) * 7}
        stroke={INK}
        strokeWidth={1.6}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <g key={key}>
      {spikes}
      <circle cx={px} cy={py} r={2.6} fill={INK} />
    </g>
  );
}

function spindleFibers(key: string, px: number, py: number, targets: Array<[number, number]>) {
  return (
    <g key={key}>
      {targets.map((t, i) => (
        <line key={`${key}-f${i}`} x1={px} y1={py} x2={t[0]} y2={t[1]} stroke={FAINT} strokeWidth={1.2} />
      ))}
    </g>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  mitosis
// ══════════════════════════════════════════════════════════════════════════

const MITOSIS_SUB: Record<MitosisPhase, string> = {
  interphase: 'DNA replicates',
  prophase: 'chromosomes condense',
  metaphase: 'align at the middle',
  anaphase: 'chromatids separate',
  telophase: 'nuclei reform',
  cytokinesis: 'cell splits → 2 cells',
};

function mitosisCellContent(phase: MitosisPhase, cx: number, cy: number, R: number) {
  const poleL: [number, number] = [cx - R + 14, cy];
  const poleR: [number, number] = [cx + R - 14, cy];
  switch (phase) {
    case 'interphase':
      return (
        <>
          <circle cx={cx} cy={cy} r={R * 0.6} fill="#eef2ff" stroke={GRAY} strokeWidth={1.5} />
          <circle cx={cx + 15} cy={cy - 11} r={7} fill={FAINT} />
          <polyline points={squigglePoints(cx, cy - 6, R * 0.4, 5)} fill="none" stroke={RED} strokeWidth={2.4} />
          <polyline points={squigglePoints(cx - 2, cy + 14, R * 0.28, 4)} fill="none" stroke={BLUE} strokeWidth={2.4} />
        </>
      );
    case 'prophase':
      return (
        <>
          <circle cx={cx} cy={cy} r={R * 0.66} fill="none" stroke={GRAY} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.7} />
          {centrosome('pro-cL', poleL[0], poleL[1])}
          {centrosome('pro-cR', poleR[0], poleR[1])}
          {chromX('pro-red', cx - 20, cy - 4, RED, 0.85)}
          {chromX('pro-blue', cx + 20, cy + 8, BLUE, 0.85)}
        </>
      );
    case 'metaphase': {
      const cRed: [number, number] = [cx, cy - 26];
      const cBlue: [number, number] = [cx, cy + 26];
      return (
        <>
          <line x1={cx} y1={cy - 52} x2={cx} y2={cy + 52} stroke={GRAY} strokeWidth={1.2} strokeDasharray="5 4" />
          {spindleFibers('meta-fL', poleL[0], poleL[1], [cRed, cBlue])}
          {spindleFibers('meta-fR', poleR[0], poleR[1], [cRed, cBlue])}
          {centrosome('meta-cL', poleL[0], poleL[1])}
          {centrosome('meta-cR', poleR[0], poleR[1])}
          {chromX('meta-red', cRed[0], cRed[1], RED, 0.85)}
          {chromX('meta-blue', cBlue[0], cBlue[1], BLUE, 0.85)}
        </>
      );
    }
    case 'anaphase': {
      const lRed: [number, number] = [cx - 42, cy - 12];
      const lBlue: [number, number] = [cx - 34, cy + 20];
      const rRed: [number, number] = [cx + 42, cy - 12];
      const rBlue: [number, number] = [cx + 34, cy + 20];
      return (
        <>
          {spindleFibers('ana-fL', poleL[0], poleL[1], [lRed, lBlue])}
          {spindleFibers('ana-fR', poleR[0], poleR[1], [rRed, rBlue])}
          {centrosome('ana-cL', poleL[0], poleL[1])}
          {centrosome('ana-cR', poleR[0], poleR[1])}
          {chromRod('ana-lr', lRed[0], lRed[1], RED, 30)}
          {chromRod('ana-lb', lBlue[0], lBlue[1], BLUE, 30)}
          {chromRod('ana-rr', rRed[0], rRed[1], RED, 30)}
          {chromRod('ana-rb', rBlue[0], rBlue[1], BLUE, 30)}
        </>
      );
    }
    case 'telophase':
      return (
        <>
          {[-1, 1].map((s) => (
            <g key={`telo-${s}`}>
              <circle cx={cx + s * 38} cy={cy} r={30} fill="#eef2ff" stroke={GRAY} strokeWidth={1.4} strokeDasharray="4 4" opacity={0.85} />
              <polyline points={squigglePoints(cx + s * 38, cy - 5, 15, 4)} fill="none" stroke={RED} strokeWidth={2.2} />
              <polyline points={squigglePoints(cx + s * 38, cy + 9, 11, 3.5)} fill="none" stroke={BLUE} strokeWidth={2.2} />
            </g>
          ))}
          <line x1={cx} y1={cy - R} x2={cx} y2={cy - R + 12} stroke={GRAY} strokeWidth={2} />
          <line x1={cx} y1={cy + R} x2={cx} y2={cy + R - 12} stroke={GRAY} strokeWidth={2} />
        </>
      );
    case 'cytokinesis':
      return (
        <>
          {[-1, 1].map((s) => (
            <g key={`cyto-${s}`}>
              <circle cx={cx + s * 42} cy={cy} r={52} fill="#f0fdf4" stroke={GRAY} strokeWidth={2} />
              <circle cx={cx + s * 42} cy={cy} r={22} fill="#eef2ff" stroke={GRAY} strokeWidth={1.2} />
              <polyline points={squigglePoints(cx + s * 42, cy - 4, 11, 3)} fill="none" stroke={RED} strokeWidth={2.2} />
              <polyline points={squigglePoints(cx + s * 42, cy + 8, 8, 2.6)} fill="none" stroke={BLUE} strokeWidth={2.2} />
            </g>
          ))}
          {/* cleavage furrow arrows */}
          <path d={`M ${cx - 8} ${cy - 60} L ${cx} ${cy - 48} L ${cx + 8} ${cy - 60} Z`} fill={INK} />
          <path d={`M ${cx - 8} ${cy + 60} L ${cx} ${cy + 48} L ${cx + 8} ${cy + 60} Z`} fill={INK} />
        </>
      );
  }
}

export function CatalogMitosisRenderer({ figure }: { figure: MitosisFigure }) {
  const N = mitosisFeatureNames;
  const W = 680;
  const H = 548;
  const R = 88;
  const cols = [120, 340, 560];
  const rows = [175, 410];
  const cells = MITOSIS_PHASES.map((phase, i) => ({
    phase,
    cx: cols[i % 3],
    cy: rows[Math.floor(i / 3)],
  }));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'The phases of mitosis'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Mitosis'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {cells.map(({ phase, cx, cy }, i) => {
          const highlighted = figure.highlight === phase;
          const dimmed = figure.highlight != null && !highlighted;
          const num = i + 1;
          const label = phase.charAt(0).toUpperCase() + phase.slice(1);
          return (
            <g key={phase} opacity={dimmed ? 0.4 : 1} data-feature={N[phase]} data-feature-label={label}>
              {highlighted && (
                <rect x={cx - 104} y={cy - R - 22} width={208} height={2 * R + 58} rx={12} fill={HL_BG} stroke={HL} strokeWidth={2.5} />
              )}
              {/* phase label + step number */}
              <text x={cx} y={cy - R - 6} fontSize={14} textAnchor="middle" fill={highlighted ? HL : INK} fontWeight={700}>
                {num}. {label}
              </text>
              {/* cell membrane (cytokinesis draws its own pinched pair) */}
              {phase !== 'cytokinesis' && <circle cx={cx} cy={cy} r={R} fill="#f8fafc" stroke={INK} strokeWidth={2} />}
              {mitosisCellContent(phase, cx, cy, R)}
              {/* sub-caption */}
              <text x={cx} y={cy + R + 18} fontSize={11.5} textAnchor="middle" fill={GRAY}>
                {MITOSIS_SUB[phase]}
              </text>
            </g>
          );
        })}
        <text x={W / 2} y={H - 6} fontSize={11.5} textAnchor="middle" fill={INK}>
          Mitosis → 2 genetically identical diploid daughter cells
        </text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  meiosis
// ══════════════════════════════════════════════════════════════════════════

function meiosisCellCircle(key: string, cx: number, cy: number, r: number) {
  return <circle key={key} cx={cx} cy={cy} r={r} fill="#f8fafc" stroke={INK} strokeWidth={2} />;
}

function arrow(key: string, x1: number, y1: number, x2: number, y2: number, dim = false) {
  return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={dim ? FAINT : GRAY} strokeWidth={2} markerEnd="url(#mei-arr)" />;
}

export function CatalogMeiosisRenderer({ figure }: { figure: MeiosisFigure }) {
  const N = meiosisFeatureNames;
  const W = 680;
  const H = 522;

  const parent = { cx: 340, cy: 92, r: 60 };
  const mi = [
    { cx: 210, cy: 258, r: 52 },
    { cx: 470, cy: 258, r: 52 },
  ];
  const mii = [
    { cx: 118, cy: 430, r: 40 },
    { cx: 256, cy: 430, r: 40 },
    { cx: 424, cy: 430, r: 40 },
    { cx: 562, cy: 430, r: 40 },
  ];

  const hiParent = figure.highlight === 'crossing_over';
  const hiM1 = figure.highlight === 'meiosis_i';
  const hiM2 = figure.highlight === 'meiosis_ii';
  const dimParent = figure.highlight != null && !hiParent;
  const dimM1 = figure.highlight != null && !hiM1;
  const dimM2 = figure.highlight != null && !hiM2;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'Meiosis — one diploid cell → four haploid cells'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Meiosis'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="mei-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GRAY} />
          </marker>
        </defs>

        {/* stage bands */}
        <text x={40} y={192} fontSize={13} textAnchor="start" fill={hiM1 ? HL : GRAY} fontWeight={700}>MEIOSIS I</text>
        <text x={40} y={210} fontSize={10.5} textAnchor="start" fill={GRAY}>homologs separate</text>
        <text x={40} y={362} fontSize={13} textAnchor="start" fill={hiM2 ? HL : GRAY} fontWeight={700}>MEIOSIS II</text>
        <text x={40} y={380} fontSize={10.5} textAnchor="start" fill={GRAY}>sisters separate</text>

        {/* division arrows */}
        <g opacity={dimM1 ? 0.4 : 1}>
          {arrow('a-p-l', parent.cx - 40, parent.cy + 56, mi[0].cx + 26, mi[0].cy - 56)}
          {arrow('a-p-r', parent.cx + 40, parent.cy + 56, mi[1].cx - 26, mi[1].cy - 56)}
        </g>
        <g opacity={dimM2 ? 0.4 : 1}>
          {arrow('a-l-0', mi[0].cx - 20, mi[0].cy + 54, mii[0].cx + 14, mii[0].cy - 44)}
          {arrow('a-l-1', mi[0].cx + 20, mi[0].cy + 54, mii[1].cx - 14, mii[1].cy - 44)}
          {arrow('a-r-0', mi[1].cx - 20, mi[1].cy + 54, mii[2].cx + 14, mii[2].cy - 44)}
          {arrow('a-r-1', mi[1].cx + 20, mi[1].cy + 54, mii[3].cx - 14, mii[3].cy - 44)}
        </g>

        {/* ── parent (2n) cell ── */}
        <g opacity={dimParent ? 0.4 : 1} data-feature={N.parent} data-feature-label="Parent cell (2n)">
          {hiParent && <circle cx={parent.cx} cy={parent.cy} r={parent.r + 8} fill={HL_BG} stroke={HL} strokeWidth={2.5} />}
          {meiosisCellCircle('p', parent.cx, parent.cy, parent.r)}
          {/* long homologous pair (tetrad) with crossing over */}
          {repChrom('p-long-m', parent.cx - 34, parent.cy - 2, RED, 46)}
          {repChrom('p-long-p', parent.cx - 14, parent.cy - 2, PINK, 46)}
          {/* short homologous pair (tetrad) */}
          {repChrom('p-short-m', parent.cx + 16, parent.cy + 2, BLUE, 30)}
          {repChrom('p-short-p', parent.cx + 34, parent.cy + 2, LBLUE, 30)}
        </g>
        {/* crossing-over annotation */}
        <g opacity={dimParent ? 0.4 : 1} data-feature={N.crossover} data-feature-label="Crossing over">
          <line x1={parent.cx - 28} y1={parent.cy - 18} x2={parent.cx - 20} y2={parent.cy - 10} stroke={PINK} strokeWidth={4} strokeLinecap="round" />
          <line x1={parent.cx - 20} y1={parent.cy - 18} x2={parent.cx - 28} y2={parent.cy - 10} stroke={RED} strokeWidth={4} strokeLinecap="round" />
          <line x1={parent.cx + 84} y1={parent.cy - 22} x2={parent.cx - 20} y2={parent.cy - 14} stroke={INK} strokeWidth={1} />
          <text x={parent.cx + 86} y={parent.cy - 24} fontSize={11.5} textAnchor="start" fill={hiParent ? HL : INK} fontWeight={700}>
            crossing over
          </text>
        </g>
        <text x={parent.cx} y={parent.cy - parent.r - 8} fontSize={11.5} textAnchor="middle" fill={INK} fontWeight={700}>
          Diploid parent (2n = 4)
        </text>

        {/* ── Meiosis I products (n, still replicated) ── */}
        <g opacity={dimM1 ? 0.4 : 1} data-feature={N.meiosis1} data-feature-label="Meiosis I">
          {hiM1 && mi.map((c, i) => <circle key={`hm1-${i}`} cx={c.cx} cy={c.cy} r={c.r + 8} fill={HL_BG} stroke={HL} strokeWidth={2.5} />)}
          {/* left cell: red long + light-blue short (independent assortment) */}
          {meiosisCellCircle('mi0', mi[0].cx, mi[0].cy, mi[0].r)}
          {repChrom('mi0-long', mi[0].cx - 15, mi[0].cy, RED, 44)}
          {repChrom('mi0-short', mi[0].cx + 17, mi[0].cy + 2, LBLUE, 28)}
          {/* right cell: pink long + blue short */}
          {meiosisCellCircle('mi1', mi[1].cx, mi[1].cy, mi[1].r)}
          {repChrom('mi1-long', mi[1].cx - 15, mi[1].cy, PINK, 44)}
          {repChrom('mi1-short', mi[1].cx + 17, mi[1].cy + 2, BLUE, 28)}
        </g>
        <text x={340} y={mi[0].cy - mi[0].r - 8} fontSize={11} textAnchor="middle" fill={INK}>
          2 haploid cells (n) — chromosomes still doubled
        </text>

        {/* ── Meiosis II products (4 haploid cells) ── */}
        <g opacity={dimM2 ? 0.4 : 1} data-feature={N.daughters} data-feature-label="Four haploid cells">
          {hiM2 && mii.map((c, i) => <circle key={`hm2-${i}`} cx={c.cx} cy={c.cy} r={c.r + 7} fill={HL_BG} stroke={HL} strokeWidth={2.5} />)}
          {mii.map((c, i) => {
            const long = i < 2 ? RED : PINK;
            const short = i < 2 ? LBLUE : BLUE;
            return (
              <g key={`mii-${i}`}>
                {meiosisCellCircle(`mii-c-${i}`, c.cx, c.cy, c.r)}
                {singleChrom(`mii-long-${i}`, c.cx - 12, c.cy, long, 40)}
                {singleChrom(`mii-short-${i}`, c.cx + 13, c.cy + 2, short, 26)}
              </g>
            );
          })}
        </g>
        <text x={340} y={mii[0].cy + mii[0].r + 20} fontSize={11.5} textAnchor="middle" fill={INK} fontWeight={700}>
          4 genetically unique haploid cells (n) — gametes
        </text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  dna_replication
// ══════════════════════════════════════════════════════════════════════════

export function CatalogDnaReplicationRenderer({ figure }: { figure: DnaReplicationFigure }) {
  const N = dnaReplicationFeatureNames;
  const W = 680;
  const H = 420;
  const Jx = 322;
  const Jy = 210;

  // parental duplex rungs (left, closed)
  const rungs = [];
  for (let x = 60; x <= Jx - 12; x += 26) {
    rungs.push(<line key={`rung-${x}`} x1={x} y1={198} x2={x} y2={222} stroke={FAINT} strokeWidth={2} />);
  }

  // Okazaki fragments along the lower (lagging) arm — synthesised away from fork
  const okazaki: Array<{ x1: number; y1: number; x2: number; y2: number }> = [
    { x1: 372, y1: 224, x2: 430, y2: 244 },
    { x1: 452, y1: 251, x2: 512, y2: 270 },
    { x1: 534, y1: 277, x2: 596, y2: 296 },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'DNA replication — the replication fork'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'DNA replication'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="dna-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
          <marker id="dna-arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
          <marker id="dna-arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GREEN} />
          </marker>
        </defs>

        {/* ── parental duplex (left) ── */}
        <line x1={52} y1={198} x2={Jx} y2={198} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={52} y1={222} x2={Jx} y2={222} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        {rungs}
        <text x={48} y={193} fontSize={11} textAnchor="end" fill={INK} fontWeight={700}>3′</text>
        <text x={48} y={230} fontSize={11} textAnchor="end" fill={INK} fontWeight={700}>5′</text>
        <text x={150} y={176} fontSize={11.5} textAnchor="middle" fill={INK}>parental DNA</text>

        {/* ── separated parental template strands (the opened fork) ── */}
        <path d={`M ${Jx} 198 Q 470 150 628 122`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <path d={`M ${Jx} 222 Q 470 272 628 300`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <text x={636} y={120} fontSize={11} textAnchor="start" fill={INK} fontWeight={700}>3′</text>
        <text x={636} y={306} fontSize={11} textAnchor="start" fill={INK} fontWeight={700}>5′</text>
        <text x={598} y={104} fontSize={10.5} textAnchor="middle" fill={GRAY}>template</text>
        <text x={598} y={322} fontSize={10.5} textAnchor="middle" fill={GRAY}>template</text>

        {/* ── leading strand (continuous, toward fork) ── */}
        <g data-feature={N.leading} data-feature-label="Leading strand">
          <path d="M 600 150 Q 470 176 352 206" fill="none" stroke={BLUE} strokeWidth={3.5} strokeLinecap="round" markerEnd="url(#dna-arr-blue)" />
          <text x={512} y={148} fontSize={11.5} textAnchor="middle" fill={BLUE} fontWeight={700}>leading strand</text>
          <text x={512} y={162} fontSize={10} textAnchor="middle" fill={BLUE}>continuous (5′→3′)</text>
        </g>

        {/* ── lagging strand: Okazaki fragments (away from fork) ── */}
        <g data-feature={N.lagging} data-feature-label="Lagging strand">
          <g data-feature={N.okazaki} data-feature-label="Okazaki fragments">
            {okazaki.map((f, i) => (
              <g key={`ok-${i}`}>
                {/* RNA primer (short red tick at the fork-proximal start) */}
                <line x1={f.x1} y1={f.y1} x2={f.x1 + 9} y2={f.y1 + 3} stroke={RED} strokeWidth={4} strokeLinecap="round" />
                {/* the DNA fragment, arrow points away from the fork */}
                <line x1={f.x1 + 10} y1={f.y1 + 3.3} x2={f.x2} y2={f.y2} stroke={GREEN} strokeWidth={3.5} strokeLinecap="round" markerEnd="url(#dna-arr-green)" />
              </g>
            ))}
          </g>
          <text x={470} y={330} fontSize={11.5} textAnchor="middle" fill={GREEN} fontWeight={700}>lagging strand</text>
          <text x={470} y={344} fontSize={10} textAnchor="middle" fill={GREEN}>Okazaki fragments (discontinuous)</text>
          <line x1={392} y1={232} x2={410} y2={214} stroke={RED} strokeWidth={0.8} />
          <text x={412} y={212} fontSize={10} textAnchor="start" fill={RED} fontWeight={700}>RNA primer</text>
        </g>

        {/* ── helicase at the fork junction ── */}
        <g data-feature={N.helicase} data-feature-label="Helicase">
          <circle cx={Jx} cy={210} r={15} fill={ORANGE} stroke="#fff" strokeWidth={1.5} />
          <path d={`M ${Jx} 210 L ${Jx + 15} 202 L ${Jx + 15} 218 Z`} fill="#fff" opacity={0.85} />
          <text x={Jx - 2} y={252} fontSize={11.5} textAnchor="middle" fill={ORANGE} fontWeight={700}>helicase</text>
        </g>

        {figure.showEnzymes && (
          <>
            {/* DNA polymerase on the leading strand */}
            <g data-feature={N.polymerase} data-feature-label="DNA polymerase">
              <ellipse cx={412} cy={192} rx={17} ry={12} fill={BLUE} opacity={0.85} stroke="#fff" strokeWidth={1.5} />
              <text x={412} y={196} fontSize={9} textAnchor="middle" fill="#fff" fontWeight={700}>pol</text>
            </g>
            <ellipse cx={456} cy={252} rx={16} ry={11} fill={GREEN} opacity={0.85} stroke="#fff" strokeWidth={1.5} />
            <text x={456} y={256} fontSize={9} textAnchor="middle" fill="#fff" fontWeight={700}>pol</text>
            {/* DNA ligase sealing a gap between fragments */}
            <g data-feature={N.ligase} data-feature-label="DNA ligase">
              <ellipse cx={441} cy={247} rx={9} ry={9} fill={PURPLE} opacity={0.9} stroke="#fff" strokeWidth={1.2} />
              <line x1={441} y1={247} x2={441} y2={300} stroke={PURPLE} strokeWidth={0.8} />
              <text x={441} y={314} fontSize={11} textAnchor="middle" fill={PURPLE} fontWeight={700}>ligase</text>
            </g>
            <text x={150} y={300} fontSize={11} textAnchor="middle" fill={INK}>pol = DNA polymerase</text>
          </>
        )}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  cell_membrane (fluid-mosaic + transport variant)
// ══════════════════════════════════════════════════════════════════════════

const HEAD_TOP = 150;
const HEAD_BOT = 270;
const HEAD_R = 10;

function phospholipid(key: string, x: number, leaflet: 'top' | 'bottom') {
  const headY = leaflet === 'top' ? HEAD_TOP : HEAD_BOT;
  const dir = leaflet === 'top' ? 1 : -1;
  const t0 = headY + dir * (HEAD_R + 1);
  const t1 = headY + dir * 58;
  const mid = (t0 + t1) / 2;
  return (
    <g key={key}>
      <path d={`M ${x - 3.5} ${t0} Q ${x - 6} ${mid} ${x - 3.5} ${t1}`} fill="none" stroke={AMBER} strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${x + 3.5} ${t0} Q ${x + 6} ${mid} ${x + 3.5} ${t1}`} fill="none" stroke={AMBER} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={headY} r={HEAD_R} fill="#fcd34d" stroke={AMBER} strokeWidth={1.5} />
    </g>
  );
}

/** small molecule dot */
function molecule(key: string, x: number, y: number, color: string) {
  return <circle key={key} cx={x} cy={y} r={4.5} fill={color} stroke="#fff" strokeWidth={1} />;
}

export function CatalogCellMembraneRenderer({ figure }: { figure: CellMembraneFigure }) {
  const N = cellMembraneFeatureNames;
  const W = 680;
  const H = 430;

  // protein x-positions and half-widths (columns overlapping are skipped)
  const channelX = 150;
  const carrierX = 340;
  const glycoX = 522;
  const skip: Array<[number, number]> = [
    [channelX - 24, channelX + 24],
    [carrierX - 26, carrierX + 26],
    [glycoX - 20, glycoX + 20],
  ];
  const isSkipped = (x: number) => skip.some(([lo, hi]) => x >= lo && x <= hi);

  const columns: number[] = [];
  for (let x = 34; x <= 648; x += 25) if (!isSkipped(x)) columns.push(x);

  const mode = figure.mode;

  // transport overlay geometry
  const passUp = mode === 'active'; // active transport moves against the gradient (upward here)
  const routeX = mode === 'facilitated' ? channelX : mode === 'active' ? carrierX : 430;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">
        {figure.title ||
          (mode
            ? mode === 'diffusion'
              ? 'Cell membrane — simple diffusion'
              : mode === 'facilitated'
                ? 'Cell membrane — facilitated diffusion'
                : 'Cell membrane — active transport'
            : 'Cell membrane — fluid-mosaic model')}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Cell membrane'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="mem-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={PURPLE} />
          </marker>
        </defs>

        {/* fluid labels */}
        <text x={20} y={34} fontSize={12.5} textAnchor="start" fill={INK} fontWeight={700}>Extracellular fluid (outside)</text>
        <text x={20} y={H - 12} fontSize={12.5} textAnchor="start" fill={INK} fontWeight={700}>Cytoplasm (inside the cell)</text>

        {/* phospholipid bilayer */}
        <g data-feature={N.bilayer} data-feature-label="Phospholipid bilayer">
          <g data-feature={N.tails} data-feature-label="Hydrophobic tails" />
          <g data-feature={N.heads} data-feature-label="Hydrophilic heads">
            {columns.map((x) => phospholipid(`pt-${x}`, x, 'top'))}
            {columns.map((x) => phospholipid(`pb-${x}`, x, 'bottom'))}
          </g>
        </g>

        {/* cholesterol tucked among the tails */}
        <g>
          <rect x={252} y={186} width={9} height={30} rx={4} fill="#fbbf24" stroke={AMBER} strokeWidth={1} />
        </g>

        {/* ── channel protein ── */}
        <g data-feature={N.channel} data-feature-label="Channel protein">
          <path d={`M ${channelX - 20} 132 Q ${channelX - 26} 210 ${channelX - 20} 288 L ${channelX - 7} 288 Q ${channelX - 12} 210 ${channelX - 7} 132 Z`} fill={TEAL} stroke="#0f766e" strokeWidth={1.5} />
          <path d={`M ${channelX + 20} 132 Q ${channelX + 26} 210 ${channelX + 20} 288 L ${channelX + 7} 288 Q ${channelX + 12} 210 ${channelX + 7} 132 Z`} fill={TEAL} stroke="#0f766e" strokeWidth={1.5} />
          <text x={channelX} y={116} fontSize={11} textAnchor="middle" fill={TEAL} fontWeight={700}>channel</text>
          <text x={channelX} y={106} fontSize={11} textAnchor="middle" fill={TEAL} fontWeight={700}>protein</text>
        </g>

        {/* ── carrier / transport protein ── */}
        <g data-feature={N.carrier} data-feature-label="Carrier protein">
          <path d={`M ${carrierX - 24} 130 L ${carrierX + 24} 130 Q ${carrierX + 30} 210 ${carrierX + 24} 290 L ${carrierX - 24} 290 Q ${carrierX - 30} 210 ${carrierX - 24} 130 Z`} fill={PURPLE} opacity={0.9} stroke="#5b21b6" strokeWidth={1.5} />
          {/* binding cleft */}
          <path d={`M ${carrierX - 8} ${passUp ? 290 : 130} L ${carrierX} 210 L ${carrierX + 8} ${passUp ? 290 : 130}`} fill="#f8fafc" stroke="#5b21b6" strokeWidth={1} />
          <text x={carrierX} y={116} fontSize={11} textAnchor="middle" fill={PURPLE} fontWeight={700}>{mode === 'active' ? 'pump protein' : 'carrier protein'}</text>
        </g>

        {/* ── glycoprotein ── */}
        <g>
          <path d={`M ${glycoX - 16} 134 Q ${glycoX - 20} 210 ${glycoX - 16} 286 L ${glycoX + 16} 286 Q ${glycoX + 20} 210 ${glycoX + 16} 134 Z`} fill="#64748b" stroke="#475569" strokeWidth={1.5} />
          {/* carbohydrate chain */}
          <path d={`M ${glycoX} 134 L ${glycoX} 108 M ${glycoX} 118 L ${glycoX - 12} 104 M ${glycoX} 118 L ${glycoX + 12} 104`} fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" />
          {[[glycoX, 106], [glycoX - 12, 102], [glycoX + 12, 102]].map(([x, y], i) => (
            <circle key={`carb-${i}`} cx={x} cy={y} r={4} fill={GREEN} />
          ))}
          <text x={glycoX + 24} y={126} fontSize={10.5} textAnchor="start" fill={INK}>glycoprotein</text>
        </g>

        {/* structural leader labels (only when not showing transport) */}
        {!mode && (
          <>
            <line x1={columns[3] ?? 90} y1={HEAD_TOP} x2={90} y2={70} stroke={INK} strokeWidth={0.8} />
            <text x={90} y={64} fontSize={10.5} textAnchor="middle" fill={INK}>hydrophilic head</text>
            <line x1={430} y1={205} x2={430} y2={70} stroke={INK} strokeWidth={0.8} />
            <text x={430} y={64} fontSize={10.5} textAnchor="middle" fill={INK}>hydrophobic tails</text>
            <text x={276} y={200} fontSize={9.5} textAnchor="start" fill={AMBER} fontWeight={700}>cholesterol</text>
            <line x1={272} y1={200} x2={262} y2={200} stroke={AMBER} strokeWidth={0.8} />
          </>
        )}

        {/* ── transport overlay ── */}
        {mode && (
          <g data-feature={N.transport} data-feature-label="Transport">
            {(() => {
              // High-concentration side has more dots. Passive: high on top → move down.
              // Active: pumped from low(top) to high(bottom-ward)? draw against-gradient upward.
              const topDots = passUp ? 3 : 8;
              const botDots = passUp ? 8 : 3;
              const els: React.ReactNode[] = [];
              for (let i = 0; i < topDots; i++) {
                els.push(molecule(`td-${i}`, 60 + (i % 4) * 150 + (i > 3 ? 40 : 0), 66 + Math.floor(i / 4) * 22, PURPLE));
              }
              for (let i = 0; i < botDots; i++) {
                els.push(molecule(`bd-${i}`, 60 + (i % 4) * 150 + (i > 3 ? 40 : 0), 350 + Math.floor(i / 4) * 22, PURPLE));
              }
              return els;
            })()}
            {/* transport arrow through the route */}
            <line
              x1={routeX}
              y1={passUp ? 300 : 120}
              x2={routeX}
              y2={passUp ? 120 : 300}
              stroke={PURPLE}
              strokeWidth={3}
              markerEnd="url(#mem-arr)"
              strokeDasharray={mode === 'diffusion' ? undefined : '2 0'}
            />
            {/* the moving molecule sitting in the route */}
            {molecule('m-route', routeX, 210, PURPLE)}

            {/* ATP for active transport */}
            {mode === 'active' && (
              <>
                <text x={carrierX + 40} y={214} fontSize={11} textAnchor="start" fill={RED} fontWeight={700}>ATP → ADP + P</text>
                <path d={`M ${carrierX + 30} 224 q 6 6 12 0`} fill="none" stroke={RED} strokeWidth={1.5} />
              </>
            )}

            <text x={W / 2} y={H - 30} fontSize={11.5} textAnchor="middle" fill={INK} fontWeight={700}>
              {mode === 'diffusion'
                ? 'Simple diffusion: molecules cross the bilayer directly, high → low (no protein, no ATP)'
                : mode === 'facilitated'
                  ? 'Facilitated diffusion: down the gradient through a protein (no ATP)'
                  : 'Active transport: against the gradient through a pump, powered by ATP'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
