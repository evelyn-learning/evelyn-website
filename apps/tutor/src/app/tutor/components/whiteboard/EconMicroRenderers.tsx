'use client';

import React from 'react';
import {
  gameTheoryFeatureNames,
  elasticityFeatureNames,
  comparativeAdvantageFeatureNames,
  lorenzCurveFeatureNames,
  type GameTheoryFigure,
  type ElasticityFigure,
  type ComparativeAdvantageFigure,
  type LorenzCurveFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const INK = '#374151';
const ROW_COLOR = '#dc2626';   // row player's payoff / producer A
const COL_COLOR = '#2563eb';   // col player's payoff / producer B
const HL = '#fde68a';          // highlight fill
const HL_STROKE = '#d97706';

// ── game_theory_matrix ──────────────────────────────────────────────────────

export function GameTheoryMatrixRenderer({ figure }: { figure: GameTheoryFigure }) {
  const N = gameTheoryFeatureNames;
  const W = 580, H = 500;
  const gx = 190, gy = 150;           // grid origin (top-left of cell area)
  const cw = 170, ch = 150;           // cell size

  const heading = figure.title || `${figure.rowPlayer} vs ${figure.colPlayer}`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[580px]"
        data-feature={N.matrix}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* column player header */}
        <text x={gx + cw} y={44} textAnchor="middle" fontSize={14} fontWeight={700} fill={COL_COLOR}>{figure.colPlayer}</text>
        {figure.colStrategies.map((s, c) => (
          <text key={c} x={gx + c * cw + cw / 2} y={gy - 14} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>{s}</text>
        ))}
        {/* row player header (rotated) */}
        <text x={44} y={gy + ch} textAnchor="middle" fontSize={14} fontWeight={700} fill={ROW_COLOR} transform={`rotate(-90 44 ${gy + ch})`}>{figure.rowPlayer}</text>
        {figure.rowStrategies.map((s, r) => (
          <text key={r} x={gx - 14} y={gy + r * ch + ch / 2} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK} transform={`rotate(-90 ${gx - 14} ${gy + r * ch + ch / 2})`}>{s}</text>
        ))}

        {/* cells */}
        {[0, 1].map((r) => [0, 1].map((c) => {
          const x = gx + c * cw, y = gy + r * ch;
          const [rp, cp] = figure.payoffs[r][c];
          const isHi = figure.highlightCell && figure.highlightCell[0] === r && figure.highlightCell[1] === c;
          return (
            <g key={`${r}-${c}`} data-feature={N.cell(r, c)} data-feature-label={`(${rp}, ${cp})`}>
              <rect x={x} y={y} width={cw} height={ch} fill={isHi ? HL : '#ffffff'} stroke={isHi ? HL_STROKE : INK} strokeWidth={isHi ? 2.5 : 1.5} />
              {/* anti-diagonal split (top-left → bottom-right) */}
              <line x1={x} y1={y} x2={x + cw} y2={y + ch} stroke="#cbd5e1" strokeWidth={1} />
              {/* row player payoff — lower-left triangle */}
              <text x={x + 30} y={y + ch - 24} fontSize={20} fontWeight={700} fill={ROW_COLOR}>{rp}</text>
              {/* col player payoff — upper-right triangle */}
              <text x={x + cw - 30} y={y + 34} textAnchor="end" fontSize={20} fontWeight={700} fill={COL_COLOR}>{cp}</text>
              {isHi && <text x={x + cw / 2} y={y + ch / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={HL_STROKE}>Nash eq.</text>}
            </g>
          );
        }))}

        {/* legend */}
        <g transform={`translate(${gx - 30}, ${gy + 2 * ch + 30})`}>
          <rect x={0} y={-10} width={11} height={11} fill={ROW_COLOR} />
          <text x={16} y={0} fontSize={10.5} fill={INK}>{figure.rowPlayer}: bottom-left</text>
          <rect x={210} y={-10} width={11} height={11} fill={COL_COLOR} />
          <text x={226} y={0} fontSize={10.5} fill={INK}>{figure.colPlayer}: top-right</text>
        </g>
      </svg>
    </div>
  );
}

// ── elasticity ──────────────────────────────────────────────────────────────

export function ElasticityRenderer({ figure }: { figure: ElasticityFigure }) {
  const N = elasticityFeatureNames;
  const W = 560, H = 430;
  const PAD_L = 60, PAD_R = 70, PAD_T = 30, PAD_B = 56;
  const plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;
  const AXIS = '#1f2937';
  // common midpoint at plot centre
  const mx = PAD_L + plotW * 0.5, my = PAD_T + plotH * 0.5;

  // inelastic (steep): near-vertical through midpoint; elastic (flat): near-horizontal
  const inel = { x1: mx - 26, y1: PAD_T + 8, x2: mx + 26, y2: PAD_T + plotH - 8 };
  const el = { x1: PAD_L + 8, y1: my + 44, x2: PAD_L + plotW - 8, y2: my - 44 };

  const showEl = figure.mode !== 'inelastic';
  const showInel = figure.mode !== 'elastic';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'Price elasticity of demand'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.diagram}
        data-feature-label={figure.title || 'Elasticity of demand'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={AXIS} strokeWidth={1.5} />
        <text x={26} y={PAD_T + plotH / 2} fontSize={13} fontWeight={600} textAnchor="middle" fill={INK} transform={`rotate(-90 26 ${PAD_T + plotH / 2})`}>Price</text>
        <text x={PAD_L + plotW / 2} y={H - 18} fontSize={13} fontWeight={600} textAnchor="middle" fill={INK}>Quantity</text>

        {showInel && (
          <g data-feature={N.inelastic} data-feature-label="Inelastic (steep)">
            <line x1={inel.x1} y1={inel.y1} x2={inel.x2} y2={inel.y2} stroke={ROW_COLOR} strokeWidth={2.5} />
            <text x={inel.x2 + 4} y={inel.y2 + 4} fontSize={12} fontWeight={700} fill={ROW_COLOR}>D (inelastic)</text>
            <text x={inel.x2 + 4} y={inel.y2 + 19} fontSize={10} fill={ROW_COLOR}>steep · %ΔQ &lt; %ΔP</text>
          </g>
        )}
        {showEl && (
          <g data-feature={N.elastic} data-feature-label="Elastic (flat)">
            <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={COL_COLOR} strokeWidth={2.5} />
            <text x={el.x2 + 4} y={el.y2 - 2} fontSize={12} fontWeight={700} fill={COL_COLOR}>D (elastic)</text>
            <text x={el.x2 + 4} y={el.y2 + 13} fontSize={10} fill={COL_COLOR}>flat · %ΔQ &gt; %ΔP</text>
          </g>
        )}
        {figure.mode === 'compare' && (
          <>
            <circle cx={mx} cy={my} r={4} fill={INK} />
            <text x={PAD_L + plotW / 2} y={PAD_T + 16} fontSize={11} textAnchor="middle" fill="#64748b">Flatter demand = more elastic (buyers more responsive to price)</text>
          </>
        )}
      </svg>
    </div>
  );
}

// ── comparative_advantage ────────────────────────────────────────────────────

export function ComparativeAdvantageRenderer({ figure }: { figure: ComparativeAdvantageFigure }) {
  const N = comparativeAdvantageFeatureNames;
  const W = 740;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
  const NB = ' '; // non-breaking space (SVG tspan collapses leading spaces)

  // columns: Producer | out X | out Y | opp cost 1 X | opp cost 1 Y
  const x0 = 26;
  const colW = [150, 105, 105, 175, 175];
  const colX = colW.reduce<number[]>((acc, _w, i) => { acc.push(i === 0 ? x0 : acc[i - 1] + colW[i - 1]); return acc; }, []);
  const tableRight = colX[4] + colW[4];
  const headers = ['Producer', `${figure.goodX} output`, `${figure.goodY} output`, `Opp. cost of 1 ${figure.goodX}`, `Opp. cost of 1 ${figure.goodY}`];
  const headTop = 44, headH = 40;
  const rowH = 62;
  const rowAY = headTop + headH + rowH / 2;   // centre of row A (clear of header)
  const rowBY = rowAY + rowH;

  const cell = (x: number, w: number, y: number, text: string, opts?: { color?: string; bold?: boolean; hi?: boolean }) => (
    <>
      {opts?.hi && <rect x={x + 3} y={y - rowH / 2 + 5} width={w - 6} height={rowH - 10} fill={HL} rx={4} />}
      <text x={x + w / 2} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={opts?.bold ? 700 : 400} fill={opts?.color || INK}>{text}</text>
    </>
  );

  const caXWinner = figure.caX === 'A' ? figure.producerA : figure.producerB;
  const caYWinner = figure.caY === 'A' ? figure.producerA : figure.producerB;

  // ── Conclusion sentence, wrapped (2026-08-07 clip audit) ──
  // Four concatenated content strings centered at W/2 formed one unwrapped
  // line (~66 literal chars + producers + goods) that clipped both viewBox
  // edges for realistic names. Greedy word-wrap by estimated glyph width
  // (0.55 × fontSize), keeping the bold/colored winner-name styling per word,
  // then grow the viewBox height by the extra lines.
  const CONCL_FS = 12.5;
  type ConclusionWord = { text: string; bold?: boolean; fill?: string };
  const caXColor = figure.caX === 'A' ? ROW_COLOR : COL_COLOR;
  const caYColor = figure.caY === 'A' ? ROW_COLOR : COL_COLOR;
  const conclusionWords: ConclusionWord[] = [
    { text: caXWinner, bold: true, fill: caXColor },
    { text: `has the comparative advantage in ${figure.goodX};` },
    { text: caYWinner, bold: true, fill: caYColor },
    { text: `in ${figure.goodY} (lower opportunity cost).` },
  ].flatMap((seg) => seg.text.split(/\s+/).filter(Boolean).map((w) => ({ ...seg, text: w })));
  const maxLineChars = Math.floor((W - 48) / (CONCL_FS * 0.55));
  const conclusionLines: ConclusionWord[][] = [];
  {
    let cur: ConclusionWord[] = [];
    let curLen = 0;
    for (const w of conclusionWords) {
      const nextLen = curLen === 0 ? w.text.length : curLen + 1 + w.text.length;
      if (nextLen > maxLineChars && cur.length > 0) {
        conclusionLines.push(cur);
        cur = [w];
        curLen = w.text.length;
      } else {
        cur.push(w);
        curLen = nextLen;
      }
    }
    if (cur.length > 0) conclusionLines.push(cur);
  }
  // Merge consecutive same-style words into one tspan per run.
  const conclusionLineChunks = conclusionLines.map((line) => {
    const chunks: ConclusionWord[] = [];
    for (const w of line) {
      const last = chunks[chunks.length - 1];
      if (last && last.bold === w.bold && last.fill === w.fill) last.text += ` ${w.text}`;
      else chunks.push({ ...w });
    }
    return chunks;
  });
  const H = 320 + (conclusionLineChunks.length - 1) * 17;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || `Comparative advantage — ${figure.producerA} vs ${figure.producerB}`}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[740px]"
        data-feature={N.table}
        data-feature-label={figure.title || 'Comparative advantage'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* header row */}
        <rect x={x0} y={headTop} width={tableRight - x0} height={headH} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
        {headers.map((h, i) => (
          <text key={i} x={colX[i] + colW[i] / 2} y={headTop + 25} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{h}</text>
        ))}

        {/* producer A row */}
        <g data-feature={N.rowA} data-feature-label={figure.producerA}>
          {cell(colX[0], colW[0], rowAY, figure.producerA, { color: ROW_COLOR, bold: true })}
          {cell(colX[1], colW[1], rowAY, fmt(figure.outputAX))}
          {cell(colX[2], colW[2], rowAY, fmt(figure.outputAY))}
          {cell(colX[3], colW[3], rowAY, `${fmt(figure.oppCostAX)} ${figure.goodY}`, { hi: figure.caX === 'A', bold: figure.caX === 'A' })}
          {cell(colX[4], colW[4], rowAY, `${fmt(figure.oppCostAY)} ${figure.goodX}`, { hi: figure.caY === 'A', bold: figure.caY === 'A' })}
        </g>
        {/* producer B row */}
        <g data-feature={N.rowB} data-feature-label={figure.producerB}>
          {cell(colX[0], colW[0], rowBY, figure.producerB, { color: COL_COLOR, bold: true })}
          {cell(colX[1], colW[1], rowBY, fmt(figure.outputBX))}
          {cell(colX[2], colW[2], rowBY, fmt(figure.outputBY))}
          {cell(colX[3], colW[3], rowBY, `${fmt(figure.oppCostBX)} ${figure.goodY}`, { hi: figure.caX === 'B', bold: figure.caX === 'B' })}
          {cell(colX[4], colW[4], rowBY, `${fmt(figure.oppCostBY)} ${figure.goodX}`, { hi: figure.caY === 'B', bold: figure.caY === 'B' })}
        </g>

        {/* grid lines */}
        <line x1={x0} y1={rowAY - rowH / 2} x2={tableRight} y2={rowAY - rowH / 2} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={x0} y1={rowBY - rowH / 2} x2={tableRight} y2={rowBY - rowH / 2} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={x0} y1={rowBY + rowH / 2} x2={tableRight} y2={rowBY + rowH / 2} stroke="#cbd5e1" strokeWidth={1} />
        {colX.slice(1).map((x, i) => (
          <line key={i} x1={x} y1={headTop} x2={x} y2={rowBY + rowH / 2} stroke="#e2e8f0" strokeWidth={1} />
        ))}

        {/* conclusion (wrapped — see conclusionLineChunks above) */}
        {conclusionLineChunks.map((chunks, li) => (
          <text key={li} x={W / 2} y={rowBY + rowH / 2 + 34 + li * 17} textAnchor="middle" fontSize={CONCL_FS} fill={INK} xmlSpace="preserve">
            {chunks.map((c, ci) => (
              <tspan key={ci} fontWeight={c.bold ? 700 : undefined} fill={c.fill}>{ci === 0 ? c.text : `${NB}${c.text}`}</tspan>
            ))}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── lorenz_curve ─────────────────────────────────────────────────────────────
export function LorenzCurveRenderer({ figure }: { figure: LorenzCurveFigure }) {
  const N = lorenzCurveFeatureNames;
  const heading = figure.title || 'Lorenz Curve';
  const W = 560;
  const H = 520;
  const M = { left: 64, right: 28, top: 24, bottom: 62 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  // data (0..100) → pixel
  const px = (x: number): number => M.left + (x / 100) * plotW;
  const py = (y: number): number => M.top + (1 - y / 100) * plotH;

  const curvePts = figure.points.map((p) => `${px(p.pop)},${py(p.income)}`).join(' ');
  // Shaded inequality gap = area between equality line and the curve.
  const gapPts = `${figure.points.map((p) => `${px(p.pop)},${py(p.income)}`).reverse().join(' ')} ${px(100)},${py(100)} ${px(0)},${py(0)}`;

  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* gridlines */}
        {ticks.map((t) => (
          <g key={`g${t}`}>
            <line x1={px(t)} y1={M.top} x2={px(t)} y2={M.top + plotH} stroke="#eef2f7" strokeWidth={1} />
            <line x1={M.left} y1={py(t)} x2={M.left + plotW} y2={py(t)} stroke="#eef2f7" strokeWidth={1} />
          </g>
        ))}

        {/* inequality gap shading */}
        <polygon data-feature={N.gap} data-feature-label="Inequality gap" points={gapPts} fill="#f59e0b" fillOpacity={0.16} />

        {/* line of perfect equality */}
        <line data-feature={N.equality} data-feature-label="Line of equality" x1={px(0)} y1={py(0)} x2={px(100)} y2={py(100)} stroke="#64748b" strokeWidth={2} strokeDasharray="6 4" />
        <text x={px(62)} y={py(70)} fontSize={12} fontStyle="italic" fill="#64748b" transform={`rotate(-33 ${px(62)} ${py(70)})`}>line of equality</text>

        {/* Lorenz curve */}
        <polyline data-feature={N.curve} data-feature-label="Lorenz curve" points={curvePts} fill="none" stroke="#2563eb" strokeWidth={3} />
        {figure.points.slice(1, -1).map((p, i) => (
          <circle key={i} cx={px(p.pop)} cy={py(p.income)} r={3.5} fill="#2563eb" />
        ))}

        {/* axes */}
        <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + plotH} stroke={INK} strokeWidth={2} />
        <line x1={M.left} y1={M.top + plotH} x2={M.left + plotW} y2={M.top + plotH} stroke={INK} strokeWidth={2} />
        {ticks.map((t) => (
          <g key={`t${t}`}>
            <text x={px(t)} y={M.top + plotH + 18} textAnchor="middle" fontSize={11} fill="#64748b">{t}</text>
            <text x={M.left - 10} y={py(t) + 4} textAnchor="end" fontSize={11} fill="#64748b">{t}</text>
          </g>
        ))}
        <text x={M.left + plotW / 2} y={H - 30} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Cumulative % of population</text>
        <text x={16} y={M.top + plotH / 2} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} transform={`rotate(-90 16 ${M.top + plotH / 2})`}>Cumulative % of income</text>

        {/* Gini badge */}
        <g>
          <rect x={M.left + 14} y={M.top + 12} width={128} height={30} rx={6} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1} />
          <text x={M.left + 14 + 64} y={M.top + 12 + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">Gini ≈ {figure.gini.toFixed(2)}</text>
        </g>
      </svg>
    </div>
  );
}
