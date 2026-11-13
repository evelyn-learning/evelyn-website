'use client';

import React from 'react';
import {
  proteinSynthesisFeatureNames,
  enzymeActionFeatureNames,
  cellCycleFeatureNames,
  geneExpressionFeatureNames,
  CELL_CYCLE_PHASES,
  type ProteinSynthesisFigure,
  type EnzymeActionFigure,
  type CellCycleFigure,
  type CellCyclePhase,
  type GeneExpressionFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/molecular-biology';

const INK = '#374151';
const GRAY = '#94a3b8';
const FAINT = '#cbd5e1';
const BLUE = '#2563eb';
const LBLUE = '#93c5fd';
const GREEN = '#16a34a';
const TEAL = '#0d9488';
const PURPLE = '#7c3aed';
const ORANGE = '#ea580c';
const AMBER = '#d97706';
const RED = '#dc2626';
const HL = '#059669';       // highlight (emerald)
const HL_BG = '#ecfdf5';

/** Straight arrow with a filled head (self-contained, no <marker>). */
function arrow(key: string, x1: number, y1: number, x2: number, y2: number, color = INK, w = 2.5) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, px = -uy, py = ux, s = 9;
  return (
    <g key={key}>
      <line x1={x1} y1={y1} x2={x2 - ux * 4} y2={y2 - uy * 4} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon
        points={`${x2},${y2} ${x2 - ux * s + px * s * 0.55},${y2 - uy * s + py * s * 0.55} ${x2 - ux * s - px * s * 0.55},${y2 - uy * s - py * s * 0.55}`}
        fill={color}
      />
    </g>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  protein_synthesis
// ══════════════════════════════════════════════════════════════════════════

function complementRNA(base: string): string {
  switch (base) {
    case 'A': return 'U';
    case 'U': return 'A';
    case 'G': return 'C';
    case 'C': return 'G';
    default: return base;
  }
}

/** Transcription block, centred vertically on yc, inside a nucleus box. */
function transcriptionBlock(yc: number, N: typeof proteinSynthesisFeatureNames, mRnaExits: boolean): React.ReactNode {
  const dnaTop = yc + 4, dnaBot = yc + 26;
  const rungs: React.ReactNode[] = [];
  for (let x = 90; x <= 590; x += 22) {
    // leave a gap around the polymerase (transcription bubble)
    if (x > 268 && x < 372) continue;
    rungs.push(<line key={`tr-r${x}`} x1={x} y1={dnaTop} x2={x} y2={dnaBot} stroke={FAINT} strokeWidth={2} />);
  }
  return (
    <g data-feature={N.transcription} data-feature-label="Transcription">
      {/* nucleus envelope */}
      <rect x={38} y={yc - 78} width={604} height={172} rx={70} fill="#eff6ff" stroke={BLUE} strokeWidth={2.5} />
      <rect x={46} y={yc - 70} width={588} height={156} rx={62} fill="none" stroke={BLUE} strokeWidth={1.1} opacity={0.55} />
      {/* heading sits above the envelope, never on its curved border */}
      <text x={48} y={yc - 86} fontSize={12.5} textAnchor="start" fill={BLUE} fontWeight={700}>Nucleus — Transcription</text>

      {/* DNA double strand with a transcription bubble in the middle */}
      <g data-feature={N.dna} data-feature-label="DNA">
        <line x1={72} y1={dnaTop} x2={268} y2={dnaTop} stroke={BLUE} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={72} y1={dnaBot} x2={268} y2={dnaBot} stroke={BLUE} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={372} y1={dnaTop} x2={608} y2={dnaTop} stroke={BLUE} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={372} y1={dnaBot} x2={608} y2={dnaBot} stroke={BLUE} strokeWidth={3.5} strokeLinecap="round" />
        {/* opened template strands under the polymerase (transcription bubble) */}
        <path d={`M 268 ${dnaTop} Q 320 ${yc - 30} 372 ${dnaTop}`} fill="none" stroke={LBLUE} strokeWidth={3} />
        <path d={`M 268 ${dnaBot} Q 320 ${yc + 44} 372 ${dnaBot}`} fill="none" stroke={LBLUE} strokeWidth={3} />
        {rungs}
        <text x={150} y={yc - 30} fontSize={11.5} textAnchor="middle" fill={BLUE} fontWeight={700}>DNA (template)</text>
      </g>

      {/* RNA polymerase over the bubble */}
      <g data-feature={N.rnaPolymerase} data-feature-label="RNA polymerase">
        <ellipse cx={320} cy={yc + 8} rx={44} ry={34} fill={PURPLE} opacity={0.85} stroke="#5b21b6" strokeWidth={1.5} />
        <text x={320} y={yc + 5} fontSize={10} textAnchor="middle" fill="#fff" fontWeight={700}>RNA</text>
        <text x={320} y={yc + 17} fontSize={10} textAnchor="middle" fill="#fff" fontWeight={700}>pol</text>
        <text x={320} y={yc - 44} fontSize={11.5} textAnchor="middle" fill={PURPLE} fontWeight={700}>RNA polymerase</text>
      </g>
      {arrow('tr-dir', 372, yc - 40, 430, yc - 40, INK, 2)}
      <text x={462} y={yc - 36} fontSize={10.5} textAnchor="middle" fill={INK}>transcription</text>

      {/* mRNA emerging from under the polymerase */}
      <g data-feature={N.mrna} data-feature-label="mRNA">
        <path
          d={mRnaExits ? `M 344 ${yc + 30} Q 372 ${yc + 60} 340 ${yc + 84}` : `M 346 ${yc + 34} Q 400 ${yc + 62} 500 ${yc + 56}`}
          fill="none" stroke={ORANGE} strokeWidth={3.5} strokeLinecap="round"
        />
        <text x={mRnaExits ? 392 : 508} y={mRnaExits ? yc + 56 : yc + 60} fontSize={11.5} textAnchor="start" fill={ORANGE} fontWeight={700}>mRNA</text>
      </g>
    </g>
  );
}

/** Translation block, mRNA baseline at mY, inside a cytoplasm box (box spans mY-170 … mY+78). */
function translationBlock(mY: number, N: typeof proteinSynthesisFeatureNames): React.ReactNode {
  const codons = ['AUG', 'UUC', 'GGA', 'CGU', 'AAG', 'GCC', 'UAA'];
  const x0 = 100, cw = 66;
  const cx = (i: number) => x0 + i * cw;
  const riboIdx = 3;
  const rx = cx(riboIdx);
  const codonUnder = codons[riboIdx];
  const anticodon = codonUnder.split('').map(complementRNA).join('');
  const mrnaEnd = x0 + codons.length * cw - 12;

  // Growing chain leaves the top-left of the ribosome.
  const polyChain = [
    { x: rx - 62, y: mY - 76 },
    { x: rx - 88, y: mY - 94 },
    { x: rx - 114, y: mY - 110 },
    { x: rx - 141, y: mY - 122 },
  ];
  const polyColors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7'];
  const last = polyChain[polyChain.length - 1];
  const labelX = rx + 104;   // right-hand label column (amino acid / tRNA / ribosome)

  return (
    <g data-feature={N.translation} data-feature-label="Translation">
      {/* cytoplasm region, heading above it */}
      <text x={48} y={mY - 178} fontSize={12.5} textAnchor="start" fill={GREEN} fontWeight={700}>Cytoplasm — Translation</text>
      <rect x={38} y={mY - 170} width={604} height={248} rx={20} fill="#f0fdf4" stroke={GREEN} strokeWidth={2} />

      {/* ribosome — small subunit below the mRNA, large subunit above it (drawn first, behind everything) */}
      <g data-feature={N.ribosome} data-feature-label="Ribosome">
        <ellipse cx={rx} cy={mY + 24} rx={70} ry={22} fill="#e2c290" stroke="#a97e3f" strokeWidth={1.5} />
        <ellipse cx={rx} cy={mY - 46} rx={80} ry={46} fill="#d9c49c" stroke="#a97e3f" strokeWidth={1.5} />
        <line x1={rx + 74} y1={mY - 30} x2={labelX - 5} y2={mY - 28} stroke="#8a6a34" strokeWidth={0.8} />
        <text x={labelX} y={mY - 24} fontSize={11.5} textAnchor="start" fill="#8a6a34" fontWeight={700}>ribosome</text>
      </g>

      {/* mRNA strand with codon divisions */}
      <g data-feature={N.mrna} data-feature-label="mRNA">
        <line x1={64} y1={mY} x2={mrnaEnd} y2={mY} stroke={ORANGE} strokeWidth={4} strokeLinecap="round" />
        <text x={58} y={mY + 4} fontSize={10.5} textAnchor="end" fill={AMBER} fontWeight={700}>5′</text>
        <text x={mrnaEnd + 7} y={mY + 4} fontSize={10.5} textAnchor="start" fill={AMBER} fontWeight={700}>3′</text>
        <text x={mrnaEnd + 26} y={mY + 4} fontSize={11.5} textAnchor="start" fill={ORANGE} fontWeight={700}>mRNA</text>
      </g>
      {/* codon boxes */}
      {codons.map((c, i) => {
        const isUnder = i === riboIdx;
        const isStart = i === 0, isStop = i === codons.length - 1;
        return (
          <g key={`cod-${i}`} data-feature={isUnder ? N.codon : undefined} data-feature-label={isUnder ? 'Codon' : undefined}>
            <rect x={cx(i) - 28} y={mY - 11} width={56} height={22} rx={4}
              fill={isUnder ? '#fed7aa' : isStart ? '#dcfce7' : isStop ? '#fee2e2' : '#fff7ed'}
              stroke={isUnder ? ORANGE : '#fdba74'} strokeWidth={isUnder ? 2 : 1} />
            <text x={cx(i)} y={mY + 4.5} fontSize={11} textAnchor="middle" fill={INK} fontWeight={700} fontFamily="monospace">{c}</text>
          </g>
        );
      })}
      <line x1={cx(0)} y1={mY + 14} x2={cx(0)} y2={mY + 28} stroke={GREEN} strokeWidth={0.8} />
      <text x={cx(0)} y={mY + 40} fontSize={10} textAnchor="middle" fill={GREEN} fontWeight={600}>start codon</text>
      <line x1={cx(6)} y1={mY + 14} x2={cx(6)} y2={mY + 28} stroke={RED} strokeWidth={0.8} />
      <text x={cx(6)} y={mY + 40} fontSize={10} textAnchor="middle" fill={RED} fontWeight={600}>stop codon</text>

      {/* codon label: leader runs down through the small subunit to clear space below it */}
      <line x1={rx} y1={mY + 12} x2={rx} y2={mY + 52} stroke={ORANGE} strokeWidth={0.8} />
      <text x={rx} y={mY + 64} fontSize={10.5} textAnchor="middle" fill={ORANGE} fontWeight={700}>codon</text>

      {/* tRNA in the A-site: T-shape, anticodon at bottom, amino acid on top */}
      <g data-feature={N.trna} data-feature-label="tRNA">
        <rect x={rx - 12} y={mY - 62} width={24} height={49} rx={5} fill="#bbf7d0" stroke={GREEN} strokeWidth={1.6} />
        <rect x={rx - 26} y={mY - 68} width={52} height={16} rx={6} fill="#bbf7d0" stroke={GREEN} strokeWidth={1.6} />
        <line x1={rx + 26} y1={mY - 60} x2={labelX - 5} y2={mY - 60} stroke={GREEN} strokeWidth={0.8} />
        <text x={labelX} y={mY - 56} fontSize={11.5} textAnchor="start" fill={GREEN} fontWeight={700}>tRNA</text>
      </g>
      {/* anticodon letters pairing with the codon */}
      <g data-feature={N.anticodon} data-feature-label="Anticodon">
        <text x={rx} y={mY - 18} fontSize={10} textAnchor="middle" fill="#166534" fontWeight={700} fontFamily="monospace">{anticodon}</text>
        <line x1={rx - 88} y1={mY - 22} x2={rx - 14} y2={mY - 22} stroke={GREEN} strokeWidth={0.8} />
        <text x={rx - 92} y={mY - 18} fontSize={10.5} textAnchor="end" fill={GREEN} fontWeight={700}>anticodon</text>
      </g>

      {/* amino acid carried by the tRNA */}
      <circle cx={rx} cy={mY - 80} r={11} fill="#f97316" stroke="#c2410c" strokeWidth={1.5} />
      <line x1={rx + 12} y1={mY - 82} x2={labelX - 5} y2={mY - 92} stroke="#c2410c" strokeWidth={0.8} />
      <text x={labelX} y={mY - 88} fontSize={11.5} textAnchor="start" fill="#c2410c" fontWeight={700}>amino acid</text>

      {/* growing polypeptide off the ribosome exit */}
      <g data-feature={N.polypeptide} data-feature-label="Polypeptide">
        <line x1={rx - 14} y1={mY - 78} x2={polyChain[0].x} y2={polyChain[0].y} stroke={GRAY} strokeWidth={2} />
        {polyChain.map((p, i) => (
          <g key={`poly-${i}`}>
            {i > 0 && <line x1={polyChain[i - 1].x} y1={polyChain[i - 1].y} x2={p.x} y2={p.y} stroke={GRAY} strokeWidth={2} />}
            <circle cx={p.x} cy={p.y} r={10} fill={polyColors[i % polyColors.length]} stroke="#fff" strokeWidth={1.4} />
          </g>
        ))}
        <text x={last.x - 18} y={last.y - 1} fontSize={11.5} textAnchor="end" fill={INK} fontWeight={700}>polypeptide</text>
        <text x={last.x - 18} y={last.y + 12} fontSize={10} textAnchor="end" fill="#64748b">(growing protein)</text>
      </g>
    </g>
  );
}

export function CatalogProteinSynthesisRenderer({ figure }: { figure: ProteinSynthesisFigure }) {
  const N = proteinSynthesisFeatureNames;
  const showTx = figure.stage !== 'translation';
  const showTl = figure.stage !== 'transcription';
  const both = figure.stage === 'both';
  const W = 680;
  const H = both ? 592 : showTx ? 222 : 284;

  const txYc = 112;
  const tlMy = both ? 500 : 196;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {showTx && transcriptionBlock(txYc, N, both)}
        {both && (
          <>
            {arrow('exit-arrow', 340, txYc + 100, 340, tlMy - 200, INK, 2.5)}
            <text x={356} y={(txYc + 100 + tlMy - 200) / 2 - 2} fontSize={11} textAnchor="start" fill={INK}>mRNA exits the nucleus</text>
            <text x={356} y={(txYc + 100 + tlMy - 200) / 2 + 12} fontSize={10} textAnchor="start" fill="#64748b">(through a nuclear pore)</text>
          </>
        )}
        {showTl && translationBlock(tlMy, N)}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  enzyme_action
// ══════════════════════════════════════════════════════════════════════════

/** A two-lobed substrate ("peanut") centred at (cx,cy); optionally split. */
function substrate(key: string, cx: number, cy: number, split = 0) {
  return (
    <g key={key}>
      <circle cx={cx - 12 - split} cy={cy} r={13} fill="#a855f7" stroke="#7c3aed" strokeWidth={1.5} />
      <circle cx={cx + 12 + split} cy={cy} r={13} fill="#c084fc" stroke="#7c3aed" strokeWidth={1.5} />
      {split === 0 && <line x1={cx - 2} y1={cy} x2={cx + 2} y2={cy} stroke="#7c3aed" strokeWidth={3} />}
    </g>
  );
}

/**
 * Enzyme body (a teal blob) with an active-site pocket cut into the top.
 * `snug` closes the pocket around the substrate (induced fit / bound state).
 */
function enzyme(key: string, cx: number, cy: number, model: 'lock_key' | 'induced_fit', snug: boolean) {
  const top = cy - 6;
  // pocket width: induced fit opens wide when empty and hugs when snug
  const w = model === 'induced_fit' ? (snug ? 20 : 34) : 26;
  const depth = 30;
  const pocketPath = model === 'lock_key'
    // angular double-scallop matching the two-lobe substrate
    ? `L ${cx - w} ${top + depth} L ${cx - 3} ${top + depth - 8} L ${cx + 3} ${top + depth - 8} L ${cx + w} ${top + depth} L ${cx + w + 12} ${top}`
    // rounded pocket (induced fit)
    : `Q ${cx} ${top + depth * 1.6} ${cx + w + 12} ${top}`;
  return (
    <g key={key}>
      {/* body with the active-site pocket cut into the top edge */}
      <path
        d={`M ${cx - 62} ${cy + 54}
            L ${cx - 62} ${top}
            L ${cx - w - 12} ${top}
            ${pocketPath}
            L ${cx + 62} ${top}
            L ${cx + 62} ${cy + 54} Z`}
        fill={TEAL} opacity={0.9} stroke="#0f766e" strokeWidth={1.8} strokeLinejoin="round"
      />
      <text x={cx} y={cy + 40} fontSize={10.5} textAnchor="middle" fill="#fff" fontWeight={700}>enzyme</text>
    </g>
  );
}

function reactionCoordinateInset(x: number, y: number, w: number, h: number, N: typeof enzymeActionFeatureNames): React.ReactNode {
  // axes origin bottom-left; a strip under the x-axis holds the key
  const ox = x + 44, oy = y + h - 40, plotW = w - 68, plotH = h - 70;
  const reactY = oy - plotH * 0.40;   // reactant energy level
  const prodY = oy - plotH * 0.22;    // product energy level (lower)
  const peakUncat = oy - plotH * 0.95;
  const peakCat = oy - plotH * 0.64;
  const midX = ox + plotW * 0.5;
  const endX = ox + plotW;
  const uncat = `M ${ox} ${reactY} C ${ox + plotW * 0.32} ${reactY}, ${midX - 30} ${peakUncat}, ${midX} ${peakUncat} C ${midX + 30} ${peakUncat}, ${endX - plotW * 0.28} ${prodY}, ${endX} ${prodY}`;
  const cat = `M ${ox} ${reactY} C ${ox + plotW * 0.30} ${reactY}, ${midX - 26} ${peakCat}, ${midX} ${peakCat} C ${midX + 26} ${peakCat}, ${endX - plotW * 0.26} ${prodY}, ${endX} ${prodY}`;
  /** Vertical double-headed measure from the reactant level up to a peak. */
  const measure = (key: string, mx: number, top: number, color: string) => (
    <g key={key}>
      <line x1={mx} y1={reactY - 2} x2={mx} y2={top + 3} stroke={color} strokeWidth={1.3} />
      <path d={`M ${mx - 3.5} ${top + 8} L ${mx} ${top + 2} L ${mx + 3.5} ${top + 8} M ${mx - 3.5} ${reactY - 7} L ${mx} ${reactY - 1} L ${mx + 3.5} ${reactY - 7}`} fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  const keyY = oy + 24;
  return (
    <g data-feature={N.energyPlot} data-feature-label="Reaction coordinate">
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#f8fafc" stroke={FAINT} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 18} fontSize={11.5} textAnchor="middle" fill={INK} fontWeight={700}>Enzymes lower the activation energy (Ea)</text>
      {/* axes */}
      {arrow('rc-y', ox, oy, ox, y + 30, INK, 1.6)}
      {arrow('rc-x', ox, oy, endX + 10, oy, INK, 1.6)}
      <text x={ox - 7} y={y + 40} fontSize={10} textAnchor="end" fill={INK}>energy</text>
      <text x={endX + 10} y={oy + 14} fontSize={10} textAnchor="end" fill={INK}>reaction progress →</text>
      {/* reactant level, as the baseline both barriers are measured from */}
      <line x1={ox} y1={reactY} x2={midX + 22} y2={reactY} stroke={FAINT} strokeWidth={1} strokeDasharray="2 3" />
      {/* curves */}
      <path d={uncat} fill="none" stroke="#64748b" strokeWidth={2} strokeDasharray="5 4" />
      <path d={cat} fill="none" stroke={GREEN} strokeWidth={2.5} />
      {/* Ea measures, both at the peak */}
      <g data-feature={N.activationEnergy} data-feature-label="Activation energy">
        {measure('ea-un', midX - 9, peakUncat, '#64748b')}
        {measure('ea-cat', midX + 9, peakCat, GREEN)}
        <text x={midX - 15} y={(peakUncat + peakCat) / 2 + 4} fontSize={10} textAnchor="end" fill="#475569" fontWeight={700}>Ea</text>
        <text x={midX + 15} y={(reactY + peakCat) / 2 + 6} fontSize={10} textAnchor="start" fill={GREEN} fontWeight={700}>Ea</text>
      </g>
      <text x={ox + 6} y={reactY + 14} fontSize={10} textAnchor="start" fill={INK}>reactants</text>
      <text x={endX} y={prodY + 13} fontSize={10} textAnchor="end" fill={INK}>products</text>
      {/* key */}
      <line x1={ox} y1={keyY - 3.5} x2={ox + 26} y2={keyY - 3.5} stroke="#64748b" strokeWidth={2} strokeDasharray="5 4" />
      <text x={ox + 32} y={keyY} fontSize={10} textAnchor="start" fill="#475569">without enzyme</text>
      <line x1={ox + 128} y1={keyY - 3.5} x2={ox + 154} y2={keyY - 3.5} stroke={GREEN} strokeWidth={2.5} />
      <text x={ox + 160} y={keyY} fontSize={10} textAnchor="start" fill={GREEN} fontWeight={700}>with enzyme</text>
    </g>
  );
}

export function CatalogEnzymeActionRenderer({ figure }: { figure: EnzymeActionFigure }) {
  const N = enzymeActionFeatureNames;
  const W = 680, H = 470;
  const induced = figure.model === 'induced_fit';
  const stepY = 118;
  const cols = [118, 340, 562];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* step arrows */}
        {arrow('ea-a1', cols[0] + 70, stepY + 20, cols[1] - 70, stepY + 20, INK, 2.5)}
        {arrow('ea-a2', cols[1] + 70, stepY + 20, cols[2] - 70, stepY + 20, INK, 2.5)}

        {/* ── Step 1: enzyme + free substrate ── */}
        <g data-feature={N.enzyme} data-feature-label="Enzyme">
          {enzyme('e1', cols[0], stepY, figure.model, false)}
        </g>
        <g data-feature={N.substrate} data-feature-label="Substrate">
          {substrate('s1', cols[0], stepY - 44)}
          {arrow('s1-in', cols[0], stepY - 28, cols[0], stepY - 8, PURPLE, 1.8)}
        </g>
        <g data-feature={N.activeSite} data-feature-label="Active site">
          {/* named outside the enzyme body, leader into the pocket */}
          <line x1={cols[0] + 48} y1={stepY - 22} x2={cols[0] + 20} y2={stepY + 6} stroke={INK} strokeWidth={0.8} />
          <circle cx={cols[0] + 20} cy={stepY + 6} r={1.8} fill={INK} />
          <text x={cols[0] + 50} y={stepY - 22} fontSize={10.5} textAnchor="start" fill={INK} fontWeight={600}>active site</text>
        </g>
        <text x={cols[0]} y={stepY + 96} fontSize={11} textAnchor="middle" fill={INK} fontWeight={700}>1. Enzyme + substrate</text>
        <text x={cols[0]} y={stepY - 68} fontSize={10.5} textAnchor="middle" fill="#7c3aed" fontWeight={700}>substrate</text>

        {/* ── Step 2: enzyme–substrate complex ── */}
        <g data-feature={N.complex} data-feature-label="Enzyme–substrate complex">
          {enzyme('e2', cols[1], stepY, figure.model, true)}
          {substrate('s2', cols[1], stepY + (induced ? 18 : 16))}
          {induced && (
            <>
              {arrow('if-l', cols[1] - 44, stepY + 4, cols[1] - 28, stepY + 12, TEAL, 1.6)}
              {arrow('if-r', cols[1] + 44, stepY + 4, cols[1] + 28, stepY + 12, TEAL, 1.6)}
              <text x={cols[1]} y={stepY - 40} fontSize={9.5} textAnchor="middle" fill={TEAL} fontWeight={700}>active site molds to fit</text>
            </>
          )}
        </g>
        <text x={cols[1]} y={stepY + 96} fontSize={11} textAnchor="middle" fill={INK} fontWeight={700}>2. Enzyme–substrate complex</text>

        {/* ── Step 3: products released, enzyme unchanged ── */}
        <g data-feature={N.enzyme} data-feature-label="Enzyme (unchanged)">
          {enzyme('e3', cols[2], stepY, figure.model, false)}
        </g>
        <g data-feature={N.products} data-feature-label="Products">
          <circle cx={cols[2] - 30} cy={stepY - 46} r={13} fill="#a855f7" stroke="#7c3aed" strokeWidth={1.5} />
          <circle cx={cols[2] + 30} cy={stepY - 46} r={13} fill="#c084fc" stroke="#7c3aed" strokeWidth={1.5} />
          {arrow('p-l', cols[2] - 8, stepY - 6, cols[2] - 22, stepY - 28, PURPLE, 1.8)}
          {arrow('p-r', cols[2] + 8, stepY - 6, cols[2] + 22, stepY - 28, PURPLE, 1.8)}
        </g>
        <text x={cols[2]} y={stepY - 68} fontSize={10.5} textAnchor="middle" fill="#7c3aed" fontWeight={700}>products</text>
        <text x={cols[2]} y={stepY + 96} fontSize={11} textAnchor="middle" fill={INK} fontWeight={700}>3. Products + enzyme (unchanged)</text>

        {/* reaction-coordinate inset */}
        {reactionCoordinateInset(130, 240, 420, 222, N)}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  cell_cycle
// ══════════════════════════════════════════════════════════════════════════

const CC_COLORS: Record<CellCyclePhase, { fill: string; stroke: string }> = {
  g1: { fill: '#bbf7d0', stroke: '#16a34a' },
  s: { fill: '#bfdbfe', stroke: '#2563eb' },
  g2: { fill: '#86efac', stroke: '#15803d' },
  m: { fill: '#fed7aa', stroke: '#ea580c' },
};

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Annular sector path from a0 to a1 (degrees, clockwise). */
function annularSector(cx: number, cy: number, rO: number, rI: number, a0: number, a1: number): string {
  const [x0o, y0o] = polar(cx, cy, rO, a0);
  const [x1o, y1o] = polar(cx, cy, rO, a1);
  const [x1i, y1i] = polar(cx, cy, rI, a1);
  const [x0i, y0i] = polar(cx, cy, rI, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0o} ${y0o} A ${rO} ${rO} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rI} ${rI} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

export function CatalogCellCycleRenderer({ figure }: { figure: CellCycleFigure }) {
  const N = cellCycleFeatureNames;
  const W = 680, H = 452;
  const cx = 340, cy = 236, rO = 150, rI = 92;
  const rMid = (rO + rI) / 2;
  const total = CELL_CYCLE_PHASES.reduce((s, p) => s + p.hours, 0);

  // build sector angle spans starting at top (-90°), clockwise
  let acc = -90;
  const sectors = CELL_CYCLE_PHASES.map((p) => {
    const span = (p.hours / total) * 360;
    const a0 = acc, a1 = acc + span;
    acc = a1;
    return { ...p, a0, a1, mid: (a0 + a1) / 2 };
  });
  const mSector = sectors[3];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* interphase bracket: an outer arc over G1 + S + G2, stopping short of M so M's label has a clear gap */}
        <g data-feature={N.interphase} data-feature-label="Interphase">
          {(() => {
            const r = rO + 18;
            const [ax, ay] = polar(cx, cy, r, -84);
            const [bx, by] = polar(cx, cy, r, sectors[2].a1 - 6);
            const [tx, ty] = polar(cx, cy, r, 142);
            return (
              <>
                <path d={`M ${ax} ${ay} A ${r} ${r} 0 1 1 ${bx} ${by}`} fill="none" stroke={GRAY} strokeWidth={2} strokeLinecap="round" />
                <line x1={tx} y1={ty} x2={tx - 14} y2={ty + 10} stroke={GRAY} strokeWidth={1} />
                <text x={tx - 18} y={ty + 16} fontSize={12} textAnchor="end" fill="#475569" fontWeight={700}>Interphase</text>
                <text x={tx - 18} y={ty + 30} fontSize={10.5} textAnchor="end" fill="#64748b">(G1 + S + G2)</text>
              </>
            );
          })()}
        </g>

        {/* sectors: the phase letter and its duration sit INSIDE the ring */}
        {sectors.map((s) => {
          const hi = figure.highlight === s.id;
          const dim = figure.highlight != null && !hi;
          const col = CC_COLORS[s.id];
          const [ix, iy] = polar(cx, cy, rMid, s.mid);
          const thin = s.a1 - s.a0 < 24;
          return (
            <g key={s.id} opacity={dim ? 0.5 : 1} data-feature={N.phase(s.id)} data-feature-label={`${s.label} phase`}>
              <path d={annularSector(cx, cy, rO, rI, s.a0, s.a1)} fill={hi ? HL_BG : col.fill} stroke={hi ? HL : col.stroke} strokeWidth={hi ? 4 : 2} />
              {!thin && (
                <>
                  <text x={ix} y={iy + 1} fontSize={17} textAnchor="middle" fill={hi ? HL : col.stroke} fontWeight={800}>{s.label}</text>
                  <text x={ix} y={iy + 15} fontSize={10} textAnchor="middle" fill={INK}>~{s.hours} h</text>
                </>
              )}
            </g>
          );
        })}

        {/* M is too thin to hold its name: it is named straight above, in the gap the interphase arc leaves */}
        {(() => {
          const hi = figure.highlight === 'm';
          const [ox, oy] = polar(cx, cy, rO + 2, mSector.mid);
          const lx = cx - 14, ly = cy - rO - 34;
          return (
            <g opacity={figure.highlight != null && !hi ? 0.5 : 1}>
              <line x1={ox} y1={oy} x2={lx} y2={ly + 18} stroke={CC_COLORS.m.stroke} strokeWidth={0.9} />
              <text x={lx} y={ly} fontSize={12} textAnchor="middle" fill={hi ? HL : CC_COLORS.m.stroke} fontWeight={800}>M phase (mitosis)</text>
              <text x={lx} y={ly + 13} fontSize={10} textAnchor="middle" fill={INK}>~{mSector.hours} h</text>
            </g>
          );
        })()}

        {/* direction arrow (clockwise) near the top-right, between ring and bracket */}
        {arrow('cc-dir', ...(polar(cx, cy, rO + 8, -64) as [number, number]), ...(polar(cx, cy, rO + 8, -50) as [number, number]), INK, 2)}

        {/* centre label */}
        <text x={cx} y={cy + 6} fontSize={13} textAnchor="middle" fill={INK} fontWeight={800}>THE CELL</text>
        <text x={cx} y={cy + 23} fontSize={13} textAnchor="middle" fill={INK} fontWeight={800}>CYCLE</text>
        <text x={cx} y={cy + 40} fontSize={10} textAnchor="middle" fill="#64748b">one turn ≈ {total} h</text>

        {/* checkpoints: G1/S and G2/M markers sit on the OUTER rim (labels outside the ring);
            the spindle checkpoint sits on M's inner rim (label inside the ring) */}
        {(() => {
          const marker = (mx: number, my: number) => (
            <>
              <circle cx={mx} cy={my} r={7.5} fill="#fde68a" stroke={AMBER} strokeWidth={2} />
              <text x={mx} y={my + 3.5} fontSize={9.5} textAnchor="middle" fill="#92400e" fontWeight={800}>!</text>
            </>
          );
          const [g1x, g1y] = polar(cx, cy, rO, sectors[0].a1);
          const [g2x, g2y] = polar(cx, cy, rO, sectors[2].a1);
          const [spx, spy] = polar(cx, cy, rI, mSector.mid);
          return (
            <>
              <g data-feature={N.checkpointG1S} data-feature-label="G1/S checkpoint">
                <line x1={g1x} y1={g1y} x2={g1x + 26} y2={g1y + 34} stroke={AMBER} strokeWidth={0.9} />
                {marker(g1x, g1y)}
                <text x={g1x + 30} y={g1y + 42} fontSize={11} textAnchor="start" fill="#b45309" fontWeight={700}>G1/S checkpoint</text>
              </g>
              <g data-feature={N.checkpointG2M} data-feature-label="G2/M checkpoint">
                <line x1={g2x} y1={g2y} x2={g2x - 34} y2={g2y - 22} stroke={AMBER} strokeWidth={0.9} />
                {marker(g2x, g2y)}
                <text x={g2x - 38} y={g2y - 22} fontSize={11} textAnchor="end" fill="#b45309" fontWeight={700}>G2/M checkpoint</text>
              </g>
              <g data-feature={N.checkpointSpindle} data-feature-label="spindle (M) checkpoint">
                {marker(spx, spy)}
                <text x={cx} y={cy - 56} fontSize={10.5} textAnchor="middle" fill="#b45309" fontWeight={700}>spindle checkpoint</text>
                <text x={cx} y={cy - 43} fontSize={9.5} textAnchor="middle" fill="#b45309">(during M)</text>
              </g>
            </>
          );
        })()}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  gene_expression (lac operon)
// ══════════════════════════════════════════════════════════════════════════

function dnaSegment(key: string, x: number, w: number, label: string, sub: string, fill: string, stroke: string, yMid: number): React.ReactNode {
  return (
    <g key={key}>
      <rect x={x} y={yMid - 15} width={w} height={30} rx={4} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={x + w / 2} y={yMid + 4} fontSize={11} textAnchor="middle" fill={INK} fontWeight={700}>{label}</text>
      {sub && <text x={x + w / 2} y={yMid + 30} fontSize={10} textAnchor="middle" fill="#64748b">{sub}</text>}
    </g>
  );
}

export function CatalogGeneExpressionRenderer({ figure }: { figure: GeneExpressionFigure }) {
  const N = geneExpressionFeatureNames;
  const on = figure.state === 'on';
  const W = 680, H = 372;
  const yMid = 186;

  // segment layout
  const lacI = { x: 56, w: 92 };
  const prom = { x: 236, w: 66 };
  const oper = { x: 306, w: 60 };
  const zx = { x: 372, w: 76 };
  const yx = { x: 452, w: 76 };
  const ax = { x: 532, w: 76 };
  const dnaL = 40, dnaR = 620;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* status banner */}
        <rect x={W - 168} y={12} width={128} height={30} rx={15} fill={on ? '#dcfce7' : '#fee2e2'} stroke={on ? GREEN : RED} strokeWidth={2} />
        <text x={W - 104} y={32} fontSize={13} textAnchor="middle" fill={on ? GREEN : RED} fontWeight={800}>OPERON {on ? 'ON' : 'OFF'}</text>

        {/* DNA backbone */}
        <line x1={dnaL} y1={yMid - 15} x2={dnaR} y2={yMid - 15} stroke={INK} strokeWidth={2.5} />
        <line x1={dnaL} y1={yMid + 15} x2={dnaR} y2={yMid + 15} stroke={INK} strokeWidth={2.5} />
        <text x={dnaL} y={yMid - 26} fontSize={10.5} textAnchor="start" fill={INK} fontWeight={700}>DNA</text>

        {/* segments */}
        <g data-feature={N.regulatoryGene} data-feature-label="Regulatory gene (lacI)">
          {dnaSegment('seg-i', lacI.x, lacI.w, 'lacI', 'regulatory gene', '#e0e7ff', '#6366f1', yMid)}
        </g>
        <g data-feature={N.promoter} data-feature-label="Promoter">
          {dnaSegment('seg-p', prom.x, prom.w, 'P', 'promoter', '#fef9c3', AMBER, yMid)}
        </g>
        <g data-feature={N.operator} data-feature-label="Operator">
          {dnaSegment('seg-o', oper.x, oper.w, 'O', 'operator', '#fecaca', RED, yMid)}
        </g>
        <g data-feature={N.genes} data-feature-label="Structural genes">
          {dnaSegment('seg-z', zx.x, zx.w, 'lacZ', '', '#bfdbfe', BLUE, yMid)}
          {dnaSegment('seg-y', yx.x, yx.w, 'lacY', '', '#a5c8f7', BLUE, yMid)}
          {dnaSegment('seg-a', ax.x, ax.w, 'lacA', '', '#93b8f0', BLUE, yMid)}
          <text x={(zx.x + ax.x + ax.w) / 2} y={yMid + 46} fontSize={10} textAnchor="middle" fill={BLUE} fontWeight={700}>structural genes</text>
        </g>

        {/* lacI → makes repressor (always expressed) */}
        {/* the dashed arrow ends AT the repressor: on the operator when OFF, floating free below when ON */}
        {on ? (
          <>
            <path d={`M ${lacI.x + lacI.w - 8} ${yMid + 17} Q ${lacI.x + lacI.w + 30} ${yMid + 74} ${oper.x - 14} ${yMid + 72}`} fill="none" stroke="#64748b" strokeWidth={1.4} strokeDasharray="4 3" />
            <path d={`M ${oper.x - 21} ${yMid + 68} L ${oper.x - 13} ${yMid + 72} L ${oper.x - 21} ${yMid + 77}`} fill="none" stroke="#64748b" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            <text x={lacI.x + lacI.w + 62} y={yMid + 96} fontSize={10} textAnchor="middle" fill="#64748b">makes repressor</text>
          </>
        ) : (
          <>
            <path d={`M ${lacI.x + lacI.w / 2} ${yMid - 17} Q ${lacI.x + lacI.w + 20} ${yMid - 84} ${oper.x - 22} ${yMid - 46}`} fill="none" stroke="#64748b" strokeWidth={1.4} strokeDasharray="4 3" />
            <path d={`M ${oper.x - 31} ${yMid - 46} L ${oper.x - 21} ${yMid - 45} L ${oper.x - 27} ${yMid - 54}`} fill="none" stroke="#64748b" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            <text x={lacI.x + lacI.w + 28} y={yMid - 76} fontSize={10} textAnchor="middle" fill="#64748b">makes repressor</text>
          </>
        )}

        {!on ? (
          /* ── OFF: repressor bound to operator, RNA pol blocked ── */
          <>
            <g data-feature={N.repressor} data-feature-label="Repressor">
              {/* repressor blob docked on the operator with a binding cleft */}
              <path d={`M ${oper.x - 6} ${yMid - 70} h ${oper.w + 12} a 10 10 0 0 1 10 10 v 28 a 6 6 0 0 1 -6 6 h -14 l -6 12 l -6 -12 h -${oper.w - 12} l -6 12 l -6 -12 h -14 a 6 6 0 0 1 -6 -6 v -28 a 10 10 0 0 1 10 -10 Z`}
                fill="#f87171" stroke="#b91c1c" strokeWidth={1.8} />
              <text x={oper.x + oper.w / 2} y={yMid - 42} fontSize={10.5} textAnchor="middle" fill="#fff" fontWeight={700}>repressor</text>
              <text x={oper.x + oper.w / 2} y={yMid - 78} fontSize={10} textAnchor="middle" fill="#b91c1c" fontWeight={700}>bound to operator</text>
            </g>
            {/* RNA polymerase blocked at the promoter */}
            <g data-feature="ge-rna-polymerase-blocked">
              {/* waiting under the promoter, its way forward barred — drawn below the
                  promoter / operator captions so nothing crosses them */}
              <ellipse cx={prom.x + prom.w / 2 - 6} cy={yMid + 72} rx={40} ry={24} fill={PURPLE} opacity={0.85} stroke="#5b21b6" strokeWidth={1.5} />
              <text x={prom.x + prom.w / 2 - 6} y={yMid + 69} fontSize={9.5} textAnchor="middle" fill="#fff" fontWeight={700}>RNA</text>
              <text x={prom.x + prom.w / 2 - 6} y={yMid + 81} fontSize={9.5} textAnchor="middle" fill="#fff" fontWeight={700}>polymerase</text>
              {arrow('ge-block', prom.x + prom.w / 2 + 38, yMid + 72, oper.x + oper.w / 2 + 6, yMid + 72, '#64748b', 2)}
              <g>
                <circle cx={oper.x + oper.w / 2 + 22} cy={yMid + 72} r={12} fill="none" stroke={RED} strokeWidth={2.5} />
                <line x1={oper.x + oper.w / 2 + 14} y1={yMid + 80} x2={oper.x + oper.w / 2 + 30} y2={yMid + 64} stroke={RED} strokeWidth={2.5} />
              </g>
              <text x={oper.x + oper.w / 2 + 40} y={yMid + 76} fontSize={10} textAnchor="start" fill={RED} fontWeight={700}>blocked</text>
            </g>
            <text x={W / 2} y={H - 20} fontSize={11.5} textAnchor="middle" fill={INK} fontWeight={700}>
              No inducer → repressor binds the operator → RNA polymerase is blocked → genes OFF
            </text>
          </>
        ) : (
          /* ── ON: inducer inactivates repressor, RNA pol transcribes ── */
          <>
            {/* RNA polymerase on the promoter, moving right */}
            <g data-feature={N.polymerase} data-feature-label="RNA polymerase">
              <ellipse cx={prom.x + prom.w / 2 + 8} cy={yMid - 42} rx={42} ry={27} fill={PURPLE} opacity={0.9} stroke="#5b21b6" strokeWidth={1.5} />
              <text x={prom.x + prom.w / 2 + 8} y={yMid - 45} fontSize={9.5} textAnchor="middle" fill="#fff" fontWeight={700}>RNA</text>
              <text x={prom.x + prom.w / 2 + 8} y={yMid - 33} fontSize={9.5} textAnchor="middle" fill="#fff" fontWeight={700}>polymerase</text>
              {arrow('ge-move', oper.x + oper.w, yMid - 40, zx.x + 20, yMid - 40, PURPLE, 2)}
            </g>
            {/* mRNA transcript over the structural genes */}
            <g data-feature={N.mrna} data-feature-label="mRNA">
              <path d={`M ${zx.x} ${yMid - 62} H ${ax.x + ax.w}`} fill="none" stroke={ORANGE} strokeWidth={3.5} strokeLinecap="round" />
              {arrow('ge-mrna-end', ax.x + ax.w, yMid - 62, ax.x + ax.w + 14, yMid - 62, ORANGE, 3)}
              <text x={(zx.x + ax.x + ax.w) / 2} y={yMid - 70} fontSize={10.5} textAnchor="middle" fill={ORANGE} fontWeight={700}>mRNA → enzymes made</text>
            </g>
            {/* repressor released below, inactivated by inducer */}
            <g data-feature={N.repressor} data-feature-label="Repressor">
              <path d={`M ${oper.x - 2} ${yMid + 78} q -10 -20 8 -30 q 20 -10 40 -2 q 20 8 14 26 q -4 12 -22 12 q -30 4 -40 -6 Z`}
                fill="#fca5a5" stroke="#b91c1c" strokeWidth={1.8} />
              <text x={oper.x + 26} y={yMid + 70} fontSize={10} textAnchor="middle" fill="#b91c1c" fontWeight={700}>repressor</text>
              <text x={oper.x + 26} y={yMid + 100} fontSize={9} textAnchor="middle" fill="#b91c1c">inactivated, can’t bind</text>
            </g>
            {/* inducer bound to the repressor */}
            <g data-feature={N.inducer} data-feature-label="Inducer">
              <polygon points={`${oper.x + 44},${yMid + 70} ${oper.x + 58},${yMid + 76} ${oper.x + 54},${yMid + 92} ${oper.x + 34},${yMid + 92} ${oper.x + 30},${yMid + 76}`}
                fill="#fbbf24" stroke={AMBER} strokeWidth={1.5} />
              <text x={oper.x + 96} y={yMid + 86} fontSize={9.5} textAnchor="start" fill={AMBER} fontWeight={700}>inducer (lactose)</text>
              <line x1={oper.x + 62} y1={yMid + 84} x2={oper.x + 92} y2={yMid + 84} stroke={AMBER} strokeWidth={0.8} />
            </g>
            <text x={W / 2} y={H - 20} fontSize={11.5} textAnchor="middle" fill={INK} fontWeight={700}>
              Inducer inactivates the repressor → operator is free → RNA polymerase transcribes → genes ON
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
