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

/** Up to two lines of about `max` characters each. */
function twoLines(s: string, max: number): string[] {
  if (s.length <= max) return [s];
  const words = s.split(/\s+/); const lines: string[] = []; let cur = '';
  for (const w of words) { if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w; }
  if (cur) lines.push(cur);
  if (lines.length > 2) { const rest = lines.slice(1).join(' '); lines.length = 1; lines.push(rest.length > max + 4 ? `${rest.slice(0, max + 2).trimEnd()}…` : rest); }
  return lines;
}

export function GameTheoryMatrixRenderer({ figure }: { figure: GameTheoryFigure }) {
  const N = gameTheoryFeatureNames;
  const cw = 176, ch = 132;           // cell size
  const rowLines = figure.rowStrategies.map((s) => twoLines(s, 17));
  const colLines = figure.colStrategies.map((s) => twoLines(s, 22));
  const rowDepth = Math.max(...rowLines.map((l) => l.length));
  const colDepth = Math.max(...colLines.map((l) => l.length));
  // The players' names sit directly outside their strategies, so the eye reads name → strategy → payoff.
  const gx = 34 + rowDepth * 16 + 10;   // grid origin (top-left of cell area)
  const gy = 30 + colDepth * 16 + 10;
  const W = gx + 2 * cw + 16, H = gy + 2 * ch + 12;

  const heading = figure.title || `${figure.rowPlayer} vs ${figure.colPlayer}`;
  const fmtPay = (n: number) => (Math.abs(n) >= 10000 ? n.toLocaleString('en-US') : String(n)).replace('-', '−');
  const payFs = (t: string) => (t.length <= 4 ? 21 : t.length <= 7 ? 17 : t.length <= 10 ? 14.5 : 12);
  const nameFs = (s: string, room: number) => Math.max(11, Math.min(14, room / (s.length * 0.6)));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W * 1.12 }}
        data-feature={N.matrix}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* column player and strategies */}
        <text x={gx + cw} y={18} textAnchor="middle" fontSize={nameFs(figure.colPlayer, 2 * cw)} fontWeight={700} fill={COL_COLOR}>{figure.colPlayer}</text>
        {colLines.map((lines, c) => lines.map((ln, i) => (
          <text key={`${c}-${i}`} x={gx + c * cw + cw / 2} y={gy - 9 - (lines.length - 1 - i) * 16} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>{ln}</text>
        )))}
        {/* row player and strategies (rotated) */}
        <text x={18} y={gy + ch} textAnchor="middle" fontSize={nameFs(figure.rowPlayer, 2 * ch)} fontWeight={700} fill={ROW_COLOR} transform={`rotate(-90 18 ${gy + ch})`}>{figure.rowPlayer}</text>
        {rowLines.map((lines, r) => lines.map((ln, i) => {
          const x = gx - 9 - (lines.length - 1 - i) * 16; const y = gy + r * ch + ch / 2;
          return <text key={`${r}-${i}`} x={x} y={y} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK} transform={`rotate(-90 ${x} ${y})`}>{ln}</text>;
        }))}

        {/* cells */}
        {[0, 1].map((r) => [0, 1].map((c) => {
          const x = gx + c * cw, y = gy + r * ch;
          const [rp, cp] = figure.payoffs[r][c];
          const rt = fmtPay(rp); const ct = fmtPay(cp);
          const isHi = figure.highlightCell && figure.highlightCell[0] === r && figure.highlightCell[1] === c;
          return (
            <g key={`${r}-${c}`} data-feature={N.cell(r, c)} data-feature-label={`(${rp}, ${cp})`}>
              <rect x={x} y={y} width={cw} height={ch} fill={isHi ? '#fef3c7' : '#ffffff'} stroke={INK} strokeWidth={1.5} />
              {/* split from top-left to bottom-right */}
              <line x1={x} y1={y} x2={x + cw} y2={y + ch} stroke={isHi ? '#e7c873' : '#cbd5e1'} strokeWidth={1} />
              {/* row player's payoff: lower-left triangle */}
              <text x={x + 18} y={y + ch - 20} fontSize={payFs(rt)} fontWeight={700} fill={ROW_COLOR}>{rt}</text>
              {/* column player's payoff: upper-right triangle */}
              <text x={x + cw - 18} y={y + 32} textAnchor="end" fontSize={payFs(ct)} fontWeight={700} fill={COL_COLOR}>{ct}</text>
            </g>
          );
        }))}
        {/* the equilibrium cell is outlined last, over its neighbours' borders */}
        {figure.highlightCell && (() => {
          const [r, c] = figure.highlightCell; const x = gx + c * cw, y = gy + r * ch;
          return (
            <g>
              <rect x={x} y={y} width={cw} height={ch} fill="none" stroke={HL_STROKE} strokeWidth={3} />
              <text x={x + cw / 2} y={y + ch / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#92400e" style={{ paintOrder: 'stroke', stroke: '#fef3c7', strokeWidth: 5, strokeLinejoin: 'round' }}>Nash equilibrium</text>
            </g>
          );
        })()}
      </svg>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-700 mt-1">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block" style={{ width: 10, height: 10, background: ROW_COLOR }} />{figure.rowPlayer}: lower-left number</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block" style={{ width: 10, height: 10, background: COL_COLOR }} />{figure.colPlayer}: upper-right number</span>
      </div>
    </div>
  );
}

// ── elasticity ──────────────────────────────────────────────────────────────

export function ElasticityRenderer({ figure }: { figure: ElasticityFigure }) {
  const N = elasticityFeatureNames;
  const W = 560, H = 400;
  const PAD_L = 60, PAD_R = 30, PAD_T = 20, PAD_B = 52;
  const plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;
  const AXIS = '#1f2937';
  // common point at the plot centre
  const mx = PAD_L + plotW * 0.5, my = PAD_T + plotH * 0.5;

  // Both are demand curves, so both fall from left to right: the inelastic one steeply, the elastic one gently.
  const inel = { x1: mx - 30, y1: PAD_T + 14, x2: mx + 30, y2: PAD_T + plotH - 16 };
  const el = { x1: PAD_L + 22, y1: my - 52, x2: PAD_L + plotW - 22, y2: my + 52 };

  const showEl = figure.mode !== 'inelastic';
  const showInel = figure.mode !== 'elastic';
  const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' as const };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{figure.title || 'Price elasticity of demand'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
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
            <line x1={inel.x1} y1={inel.y1} x2={inel.x2} y2={inel.y2} stroke={ROW_COLOR} strokeWidth={2.5} strokeLinecap="round" />
            {/* beside the steep curve's foot, where nothing else runs */}
            <text x={inel.x2 + 12} y={inel.y2 - 22} fontSize={13} fontWeight={700} fill={ROW_COLOR} style={halo}>D (inelastic)</text>
            <text x={inel.x2 + 12} y={inel.y2 - 6} fontSize={11.5} fill={ROW_COLOR} style={halo}>steep: %ΔQ &lt; %ΔP</text>
          </g>
        )}
        {showEl && (
          <g data-feature={N.elastic} data-feature-label="Elastic (flat)">
            <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={COL_COLOR} strokeWidth={2.5} strokeLinecap="round" />
            {/* above the flat curve's right end: the curve falls away below it */}
            <text x={el.x2} y={el.y2 - 58} textAnchor="end" fontSize={13} fontWeight={700} fill={COL_COLOR} style={halo}>D (elastic)</text>
            <text x={el.x2} y={el.y2 - 42} textAnchor="end" fontSize={11.5} fill={COL_COLOR} style={halo}>flat: %ΔQ &gt; %ΔP</text>
          </g>
        )}
        {figure.mode === 'compare' && <circle cx={mx} cy={my} r={4.5} fill={INK} stroke="#fff" strokeWidth={1.5} />}
      </svg>
      {figure.mode === 'compare' && (
        <div className="text-xs text-gray-600 text-center -mt-1">Flatter demand is more elastic: buyers respond more to the same change in price.</div>
      )}
    </div>
  );
}

// ── comparative_advantage ────────────────────────────────────────────────────

export function ComparativeAdvantageRenderer({ figure }: { figure: ComparativeAdvantageFigure }) {
  const N = comparativeAdvantageFeatureNames;
  // 0.5, 1.86, 2: no padding zeros.
  const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString('en-US') : String(Number(n.toFixed(2))));
  const heading = figure.title || `Comparative advantage: ${figure.producerA} vs ${figure.producerB}`;

  const caXWinner = figure.caX === 'A' ? figure.producerA : figure.producerB;
  const caYWinner = figure.caY === 'A' ? figure.producerA : figure.producerB;
  const caXColor = figure.caX === 'A' ? ROW_COLOR : COL_COLOR;
  const caYColor = figure.caY === 'A' ? ROW_COLOR : COL_COLOR;

  // A table set by the browser: headings and cells wrap to their own width, so long names of goods
  // cannot run into the next column (drawn at fixed widths, they printed over each other).
  const th = 'px-3 py-2 text-xs font-bold text-slate-700 border border-slate-300 bg-slate-100 text-center align-middle';
  const td = 'px-3 py-3 text-sm text-gray-700 border border-slate-200 text-center align-middle';
  const win = { background: HL, fontWeight: 700 } as const;
  const row = (name: string, color: string, outX: number, outY: number, costX: number, costY: number, winsX: boolean, winsY: boolean, feature: string) => (
    <tr data-feature={feature} data-feature-label={name}>
      <td className={td} style={{ color, fontWeight: 700 }}>{name}</td>
      <td className={td}>{fmt(outX)}</td>
      <td className={td}>{fmt(outY)}</td>
      <td className={td} style={winsX ? win : undefined}>{fmt(costX)} {figure.goodY}</td>
      <td className={td} style={winsY ? win : undefined}>{fmt(costY)} {figure.goodX}</td>
    </tr>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-3 text-center">{heading}</div>
      <table
        className="border-collapse max-w-[760px]"
        data-feature={N.table}
        data-feature-label={figure.title || 'Comparative advantage'}
      >
        <thead>
          <tr>
            <th className={th}>Producer</th>
            <th className={th}>{figure.goodX}: output</th>
            <th className={th}>{figure.goodY}: output</th>
            <th className={th}>Opportunity cost of 1 {figure.goodX}</th>
            <th className={th}>Opportunity cost of 1 {figure.goodY}</th>
          </tr>
        </thead>
        <tbody>
          {row(figure.producerA, ROW_COLOR, figure.outputAX, figure.outputAY, figure.oppCostAX, figure.oppCostAY, figure.caX === 'A', figure.caY === 'A', N.rowA)}
          {row(figure.producerB, COL_COLOR, figure.outputBX, figure.outputBY, figure.oppCostBX, figure.oppCostBY, figure.caX === 'B', figure.caY === 'B', N.rowB)}
        </tbody>
      </table>
      <div className="text-sm text-gray-700 mt-3 text-center max-w-[640px]">
        <span style={{ color: caXColor, fontWeight: 700 }}>{caXWinner}</span> has the comparative advantage in {figure.goodX};{' '}
        <span style={{ color: caYColor, fontWeight: 700 }}>{caYWinner}</span> in {figure.goodY} (the lower opportunity cost, highlighted).
      </div>
    </div>
  );
}

// ── lorenz_curve ─────────────────────────────────────────────────────────────
export function LorenzCurveRenderer({ figure }: { figure: LorenzCurveFigure }) {
  const N = lorenzCurveFeatureNames;
  const heading = figure.title || 'Lorenz Curve';
  const W = 560;
  const H = 520;
  const M = { left: 64, right: 28, top: 24, bottom: 66 };
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
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
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
        <text x={M.left + plotW / 2} y={M.top + plotH + 44} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Cumulative % of population</text>
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
