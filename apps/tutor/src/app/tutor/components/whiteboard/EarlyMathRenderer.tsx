'use client';

/**
 * EarlyMathRenderer — visual primitives for K-2 / K-5 math.
 *
 * One renderer covers a family of related shapes the brain reaches for
 * when teaching number sense, place value, multiplication intro, and
 * word-problem visualization. Consolidated into one tool so the brain
 * doesn't have to pick between five overlapping options:
 *
 *   - place_value      base-10 blocks (hundreds / tens / ones)
 *   - ten_frame        the classic 5×2 dot grid for K-1 number sense
 *   - array            r×c grid of dots — multiplication intro
 *   - skip_count       number line with hop arcs
 *   - bar_model        Singapore-style tape diagram for word problems
 *
 * All five share viewport assumptions (small, square-ish, large fonts,
 * generous whitespace) and a similar pedagogy register (K-2 / K-5 = lots
 * of pictures, very few words). One renderer is easier to keep visually
 * consistent than five.
 */

import React from 'react';
// Width-aware label helpers (FractionBar fix, commit 009dc645) — bar_model
// labels/question wrap and clamp instead of clipping at the viewBox edge.
import { estimateLabelWidth, wrapLabel } from './fraction-bar-layout';

const SVG_W = 480;
const SVG_H = 280;
const FONT = 16;

/** Greedy wrap of `text` to lines that fit `maxWidth` at `fontSize`
 *  (wrapLabel estimates at 13px, so scale the pixel cap). */
function wrapAt(text: string, fontSize: number, maxWidth: number): string[] {
  return wrapLabel(text, (maxWidth * 13) / fontSize);
}

// ─── Spec ─────────────────────────────────────────────────────────────────────

export type EarlyMathSpec =
  | { kind: 'place_value'; title?: string; hundreds?: number; tens?: number; ones?: number; showCount?: boolean }
  | { kind: 'ten_frame'; title?: string; count: number; total?: number }    // total defaults to 10
  | { kind: 'array'; title?: string; rows: number; cols: number; showProduct?: boolean }
  | {
      kind: 'skip_count';
      title?: string;
      from: number;
      step: number;
      stops: number;       // how many stops to mark (3 stops on step 5 from 0 → 0,5,10,15)
      maxLabel?: number;   // upper end of the number line (defaults from-derived)
    }
  | {
      kind: 'bar_model';
      title?: string;
      /** Top bar — the whole. Set value or a label like "?". */
      whole?: { value?: number | string; label?: string };
      /** Bottom bars — the parts. Their total should equal whole when both are numeric. */
      parts: Array<{ value?: number | string; label?: string; color?: string }>;
      /** Optional question annotation appended below. */
      question?: string;
    };

interface EarlyMathRendererProps {
  spec: EarlyMathSpec;
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

export default function EarlyMathRenderer({ spec }: EarlyMathRendererProps) {
  // place_value renders its own SVG with content-aware height — its
  // tower height varies a lot (one rod is short, three flats is tall),
  // and the shared 280-height viewBox left huge empty space below the
  // blocks (observed 2026-05-07 K-2 test: "Pile 1: 8 blocks" had
  // ~210px of dead space above the "= 8" total). The other kinds keep
  // the shared SVG since their content fills the box reliably.
  if (spec.kind === 'place_value') {
    return <PlaceValueRenderer spec={spec} />;
  }
  // bar_model also renders its own SVG: its height depends on content (a
  // wrapped question line, leader labels for narrow parts), and labels of
  // tiny proportional segments need width-aware placement — see
  // BarModelRenderer.
  if (spec.kind === 'bar_model') {
    return <BarModelRenderer spec={spec} />;
  }
  return (
    <div className="early-math-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={SVG_H} fill="#fafbfc" rx={4} />
        {spec.kind === 'ten_frame' && renderTenFrame(spec)}
        {spec.kind === 'array' && renderArray(spec)}
        {spec.kind === 'skip_count' && renderSkipCount(spec)}
      </svg>
    </div>
  );
}

// ─── place_value ──────────────────────────────────────────────────────────────

/**
 * place_value gets its own component+SVG so the viewBox can size to the
 * tallest column. Three columns side-by-side; blocks are centered
 * within each column under the header. Total ("= N") sits a small gap
 * below the tallest tower.
 */
function PlaceValueRenderer({ spec }: { spec: Extract<EarlyMathSpec, { kind: 'place_value' }> }) {
  const hundreds = spec.hundreds ?? 0;
  const tens = spec.tens ?? 0;
  const ones = spec.ones ?? 0;
  const total = hundreds * 100 + tens * 10 + ones;

  // Block cell pixel size. Chosen so a single rod (1×10) fits comfortably
  // and a flat (10×10) doesn't dominate the card.
  const CELL = 12;
  // Column geometry. Each column is centered around its own x_center;
  // headers are anchored at x_center; blocks are centered horizontally
  // within the column based on the actual block-cluster width.
  const TOP_HEADER_Y = 30;        // header text baseline
  const BLOCK_TOP_Y = 50;         // first row of blocks
  const COL_WIDTHS = [150, 110, 180];
  const COL_GAP = 10;
  const TOTAL_W = COL_WIDTHS.reduce((s, w) => s + w, 0) + COL_GAP * (COL_WIDTHS.length - 1);
  const PAD_X = 20;
  const SVG_W_PV = TOTAL_W + PAD_X * 2;
  // Column x_left positions
  let cursor = PAD_X;
  const COL_X_LEFT = COL_WIDTHS.map((w) => {
    const x = cursor;
    cursor += w + COL_GAP;
    return x;
  });
  const colCenter = (i: number) => COL_X_LEFT[i] + COL_WIDTHS[i] / 2;

  // ── Compute block-cluster dimensions per column so we can both
  //    center horizontally AND know how tall the tallest tower is ──
  // Hundreds: each flat is 10×10 cells; stacked vertically (1 col).
  const flatWidthCells = 10;
  const flatHeightCells = 10;
  const flatGap = 8;
  const hundredsClusterW = flatWidthCells * CELL;
  const hundredsClusterH = hundreds === 0
    ? 0
    : hundreds * flatHeightCells * CELL + (hundreds - 1) * flatGap;

  // Tens: vertical rods, each 1 col × 10 rows. Lay out in a row of up
  // to MAX_RODS_PER_ROW rods, then wrap. Each rod is 1 cell wide.
  const MAX_RODS_PER_ROW = 4;
  const rodGapX = 6;
  const rodGapY = 6;
  const rodHeightCells = 10;
  const tensRows = tens === 0 ? 0 : Math.ceil(tens / MAX_RODS_PER_ROW);
  const tensInLastRow = tens === 0 ? 0 : Math.min(MAX_RODS_PER_ROW, tens - (tensRows - 1) * MAX_RODS_PER_ROW);
  // Cluster width is determined by the widest row (full row OR last row, whichever is bigger).
  const tensRowWidthCells = (n: number) => n * 1 + (n - 1) * (rodGapX / CELL); // approximate
  const tensWidestRowCount = tensRows > 1 ? MAX_RODS_PER_ROW : tensInLastRow;
  const tensClusterW = tens === 0 ? 0 : tensWidestRowCount * CELL + (tensWidestRowCount - 1) * rodGapX;
  const tensClusterH = tens === 0
    ? 0
    : tensRows * rodHeightCells * CELL + (tensRows - 1) * rodGapY;
  // (tensRowWidthCells helper above is informational; unused in the
  // final layout because each row computes its own cluster width.)
  void tensRowWidthCells;

  // Ones: small unit blocks; row-wrap with gap.
  const unitGap = 4;
  const onesPerRow = Math.max(1, Math.floor(COL_WIDTHS[2] / (CELL + unitGap)));
  const onesRows = ones === 0 ? 0 : Math.ceil(ones / onesPerRow);
  const onesClusterH = ones === 0
    ? 0
    : onesRows * CELL + (onesRows - 1) * unitGap;
  // (clusterW for a row varies by row — last row may be partial — so
  // we recompute per-row inside the render loop. Tens + ones do the
  // same; hundreds is always one flat per row, so its cluster width is
  // already a constant.)
  void tensClusterW;
  void hundredsClusterW;

  // Tallest tower across all columns.
  const maxTowerH = Math.max(hundredsClusterH, tensClusterH, onesClusterH, 0);
  // Place "= total" with a gap below the tallest tower.
  const TOTAL_Y_GAP = 28;
  const TOTAL_FONT = 22;
  const totalY = BLOCK_TOP_Y + maxTowerH + TOTAL_Y_GAP + TOTAL_FONT;
  const SVG_H_PV = totalY + 16; // bottom padding

  return (
    <div className="early-math-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg
        viewBox={`0 0 ${SVG_W_PV} ${SVG_H_PV}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_W_PV }}
      >
        <rect width={SVG_W_PV} height={SVG_H_PV} fill="#fafbfc" rx={4} />
        {/* Headers, one per column */}
        {(['hundreds', 'tens', 'ones'] as const).map((label, i) => {
          const counts = [hundreds, tens, ones];
          return (
            <text
              key={label}
              x={colCenter(i)}
              y={TOP_HEADER_Y}
              fontSize={FONT}
              textAnchor="middle"
              fill="#475569"
              fontWeight={600}
            >
              {label} ({counts[i]})
            </text>
          );
        })}
        {/* Hundreds — vertical stack of 10×10 flats, centered in column */}
        {hundreds > 0 && Array.from({ length: hundreds }).map((_, k) => {
          const flatW = flatWidthCells * CELL;
          const flatX0 = colCenter(0) - flatW / 2;
          const oy = BLOCK_TOP_Y + k * (flatHeightCells * CELL + flatGap);
          return (
            <g key={`flat-${k}`}>
              {Array.from({ length: flatHeightCells }).map((_, r) =>
                Array.from({ length: flatWidthCells }).map((__, col) => (
                  <rect
                    key={`${r}-${col}`}
                    x={flatX0 + col * CELL}
                    y={oy + r * CELL}
                    width={CELL}
                    height={CELL}
                    fill="#fbbf24"
                    stroke="#92400e"
                    strokeWidth={0.5}
                  />
                ))
              )}
            </g>
          );
        })}
        {/* Tens — vertical rods, wrapping in rows of 4 */}
        {tens > 0 && Array.from({ length: tens }).map((_, k) => {
          const rowIdx = Math.floor(k / MAX_RODS_PER_ROW);
          const colIdx = k % MAX_RODS_PER_ROW;
          // For the last (possibly partial) row, recenter the row's rods
          // within the column so they don't all left-justify when count
          // isn't a multiple of MAX_RODS_PER_ROW.
          const rowCount = rowIdx < tensRows - 1 ? MAX_RODS_PER_ROW : tensInLastRow;
          const rowClusterW = rowCount * CELL + (rowCount - 1) * rodGapX;
          const rowX0 = colCenter(1) - rowClusterW / 2;
          const ox = rowX0 + colIdx * (CELL + rodGapX);
          const oy = BLOCK_TOP_Y + rowIdx * (rodHeightCells * CELL + rodGapY);
          return (
            <g key={`rod-${k}`}>
              {Array.from({ length: rodHeightCells }).map((_, r) => (
                <rect
                  key={r}
                  x={ox}
                  y={oy + r * CELL}
                  width={CELL}
                  height={CELL}
                  fill="#60a5fa"
                  stroke="#1e3a8a"
                  strokeWidth={0.5}
                />
              ))}
            </g>
          );
        })}
        {/* Ones — unit blocks, row-wrapping, recentered per row */}
        {ones > 0 && Array.from({ length: ones }).map((_, k) => {
          const rowIdx = Math.floor(k / onesPerRow);
          const colIdx = k % onesPerRow;
          const rowCount = rowIdx < onesRows - 1
            ? onesPerRow
            : (ones - rowIdx * onesPerRow);
          const rowClusterW = rowCount * CELL + (rowCount - 1) * unitGap;
          const rowX0 = colCenter(2) - rowClusterW / 2;
          const ox = rowX0 + colIdx * (CELL + unitGap);
          const oy = BLOCK_TOP_Y + rowIdx * (CELL + unitGap);
          return (
            <rect
              key={`unit-${k}`}
              x={ox}
              y={oy}
              width={CELL}
              height={CELL}
              fill="#34d399"
              stroke="#065f46"
              strokeWidth={0.5}
            />
          );
        })}
        {/* Total label, just below the tallest tower */}
        {spec.showCount !== false && (
          <text
            x={SVG_W_PV / 2}
            y={totalY}
            fontSize={TOTAL_FONT}
            textAnchor="middle"
            fill="#0f172a"
            fontWeight={700}
          >
            = {total}
          </text>
        )}
      </svg>
    </div>
  );
}

// ─── ten_frame ────────────────────────────────────────────────────────────────

function renderTenFrame(spec: Extract<EarlyMathSpec, { kind: 'ten_frame' }>) {
  const total = spec.total ?? 10;
  const cols = Math.max(2, Math.min(5, total));
  const rows = Math.max(1, Math.ceil(total / cols));
  const filled = Math.max(0, Math.min(total, spec.count));
  const cell = 50;
  const W = cols * cell;
  const H = rows * cell;
  const ox = (SVG_W - W) / 2;
  const oy = (SVG_H - H) / 2;

  return (
    <g>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const idx = r * cols + c;
          const isFilled = idx < filled;
          return (
            <g key={`${r}-${c}`}>
              <rect x={ox + c * cell} y={oy + r * cell} width={cell} height={cell} fill="#fff" stroke="#1e293b" strokeWidth={2} />
              {isFilled && (
                <circle cx={ox + c * cell + cell / 2} cy={oy + r * cell + cell / 2} r={cell * 0.32} fill="#ef4444" />
              )}
            </g>
          );
        }),
      )}
      <text x={SVG_W / 2} y={oy - 10} fontSize={FONT} textAnchor="middle" fill="#475569" fontWeight={600}>
        {filled} of {total}
      </text>
    </g>
  );
}

// ─── array ────────────────────────────────────────────────────────────────────

function renderArray(spec: Extract<EarlyMathSpec, { kind: 'array' }>) {
  const { rows, cols } = spec;
  const cell = Math.min(40, 320 / Math.max(rows, cols));
  const W = cols * cell;
  const H = rows * cell;
  const ox = (SVG_W - W) / 2;
  const oy = 60;

  return (
    <g>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={ox + c * cell + cell / 2}
            cy={oy + r * cell + cell / 2}
            r={cell * 0.34}
            fill="#3b82f6"
            stroke="#1e3a8a"
            strokeWidth={1}
          />
        )),
      )}
      <text x={SVG_W / 2} y={36} fontSize={FONT} textAnchor="middle" fill="#475569" fontWeight={600}>
        {rows} × {cols}
      </text>
      {spec.showProduct !== false && (
        <text x={SVG_W / 2} y={oy + H + 30} fontSize={20} textAnchor="middle" fill="#0f172a" fontWeight={700}>
          {rows} × {cols} = {rows * cols}
        </text>
      )}
    </g>
  );
}

// ─── skip_count ───────────────────────────────────────────────────────────────

function renderSkipCount(spec: Extract<EarlyMathSpec, { kind: 'skip_count' }>) {
  const { from, step, stops } = spec;
  const values = Array.from({ length: stops + 1 }, (_, i) => from + i * step);
  const maxLabel = spec.maxLabel ?? values[values.length - 1];
  const minLabel = Math.min(from, 0);
  const range = Math.max(1, maxLabel - minLabel);
  const mapX = (v: number) => 40 + ((v - minLabel) / range) * (SVG_W - 80);
  const y = SVG_H / 2 + 10;

  return (
    <g>
      {/* Number line */}
      <line x1={mapX(minLabel)} y1={y} x2={mapX(maxLabel)} y2={y} stroke="#1e293b" strokeWidth={2} />
      {/* Tick marks at each integer */}
      {Array.from({ length: range + 1 }, (_, i) => i + minLabel).map((v) => (
        <g key={v}>
          <line x1={mapX(v)} y1={y - 5} x2={mapX(v)} y2={y + 5} stroke="#94a3b8" strokeWidth={1} />
          <text x={mapX(v)} y={y + 22} fontSize={11} textAnchor="middle" fill="#64748b">
            {v}
          </text>
        </g>
      ))}
      {/* Hop arcs between consecutive values */}
      {values.slice(0, -1).map((v, i) => {
        const x1 = mapX(v), x2 = mapX(values[i + 1]);
        const cx = (x1 + x2) / 2;
        const cy = y - 26;
        return (
          <g key={i}>
            <path d={`M ${x1},${y} Q ${cx},${cy} ${x2},${y}`} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
            <text x={cx} y={cy - 6} fontSize={12} textAnchor="middle" fill="#7c3aed" fontWeight={600}>
              +{step}
            </text>
          </g>
        );
      })}
      {/* Highlighted stop dots */}
      {values.map((v) => (
        <circle key={v} cx={mapX(v)} cy={y} r={5} fill="#7c3aed" />
      ))}
      <text x={SVG_W / 2} y={30} fontSize={FONT} textAnchor="middle" fill="#475569" fontWeight={600}>
        Skip-count by {step} from {from}
      </text>
    </g>
  );
}

// ─── bar_model ────────────────────────────────────────────────────────────────

/**
 * bar_model gets its own component+SVG (like place_value) so the viewBox
 * height can grow with content: the question wraps to tspan lines, and a
 * part label that doesn't fit its (possibly tiny) proportional segment
 * moves below the bar on a staggered leader — centered 18px text over a
 * narrow segment used to clip at the viewBox edge.
 */
function BarModelRenderer({ spec }: { spec: Extract<EarlyMathSpec, { kind: 'bar_model' }> }) {
  const { whole, parts, question } = spec;
  const totalNumeric = parts.every((p) => typeof p.value === 'number')
    ? (parts as Array<{ value: number }>).reduce((s, p) => s + p.value, 0)
    : null;
  // Bar widths proportional to numeric values when available; else equal.
  const sumForWeights = parts.reduce((s, p) => s + (typeof p.value === 'number' ? Math.max(0, p.value) : 1), 0);
  const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];
  const BAR_H = 50;
  const margin = 30;
  const fullW = SVG_W - 2 * margin;
  const wholeY = 60;
  const partsY = wholeY + BAR_H + 36;

  // Whole-bar label — wraps inside the bar if long.
  const wholeText = whole
    ? `${whole.label ? `${whole.label} · ` : ''}${whole.value !== undefined ? whole.value : (totalNumeric ?? '?')}`
    : '';
  const wholeLines = whole ? wrapAt(wholeText, 20, fullW - 12) : [];

  // Part segments + label placement: inside the segment when the estimated
  // width fits, otherwise below the bar on a staggered leader, clamped into
  // the viewBox.
  let xCursor = margin;
  let belowCount = 0;
  const partBoxes = parts.map((p, i) => {
    const weight = typeof p.value === 'number' ? Math.max(0, p.value) : 1;
    const w = sumForWeights > 0 ? (weight / sumForWeights) * fullW : fullW / parts.length;
    const x = xCursor;
    xCursor += w;
    const text = `${p.label ? `${p.label} · ` : ''}${p.value ?? '?'}`;
    const inside = estimateLabelWidth(text, 18) <= w - 8;
    let labelX = x + w / 2;
    let labelY = partsY + BAR_H / 2 + 6;
    if (!inside) {
      const half = estimateLabelWidth(text, 13) / 2;
      labelX = Math.max(8 + half, Math.min(x + w / 2, SVG_W - 8 - half));
      labelY = partsY + BAR_H + 20 + (belowCount % 2) * 16;
      belowCount += 1;
    }
    return { p, i, x, w, text, inside, labelX, labelY, color: p.color || PALETTE[i % PALETTE.length] };
  });
  const belowRows = Math.min(belowCount, 2);
  const labelsBottom = partsY + BAR_H + (belowCount > 0 ? 8 + belowRows * 16 : 0);

  // Question — wrapped, centered, height grows to fit.
  const qLines = question ? wrapAt(question, FONT, SVG_W - 40) : [];
  const questionY = labelsBottom + 32;
  const viewHeight = Math.max(
    SVG_H,
    question ? questionY + (qLines.length - 1) * 20 + 16 : labelsBottom + 20,
  );

  return (
    <div className="early-math-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${viewHeight}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={viewHeight} fill="#fafbfc" rx={4} />
        <g>
          {/* Whole bar (top) */}
          {whole && (
            <g>
              <rect x={margin} y={wholeY} width={fullW} height={BAR_H} fill="#cbd5e1" stroke="#475569" strokeWidth={2} />
              <text
                x={margin + fullW / 2}
                y={wholeY + BAR_H / 2 + 6 - ((wholeLines.length - 1) * 22) / 2}
                fontSize={20}
                textAnchor="middle"
                fill="#0f172a"
                fontWeight={700}
              >
                {wholeLines.map((line, li) => (
                  <tspan key={li} x={margin + fullW / 2} dy={li === 0 ? 0 : 22}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text x={margin} y={wholeY - 6} fontSize={11} fill="#64748b">whole</text>
            </g>
          )}
          {/* Parts row (bottom) */}
          <g>
            <text x={margin} y={partsY - 6} fontSize={11} fill="#64748b">parts</text>
            {partBoxes.map((b) => (
              <g key={b.i}>
                <rect x={b.x} y={partsY} width={b.w} height={BAR_H} fill={b.color} fillOpacity={0.6} stroke={b.color} strokeWidth={2} />
                {!b.inside && (
                  <line x1={b.x + b.w / 2} y1={partsY + BAR_H} x2={b.labelX} y2={b.labelY - 10} stroke="#64748b" strokeWidth={1} />
                )}
                <text x={b.labelX} y={b.labelY} fontSize={b.inside ? 18 : 13} textAnchor="middle" fill="#0f172a" fontWeight={700}>
                  {b.text}
                </text>
              </g>
            ))}
          </g>
          {question && (
            <text x={SVG_W / 2} y={questionY} fontSize={FONT} textAnchor="middle" fill="#7c3aed" fontStyle="italic">
              {qLines.map((line, li) => (
                <tspan key={li} x={SVG_W / 2} dy={li === 0 ? 0 : 20}>
                  {line}
                </tspan>
              ))}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
