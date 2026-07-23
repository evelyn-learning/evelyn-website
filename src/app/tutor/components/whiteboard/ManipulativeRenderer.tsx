'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Manipulative Renderer
 *
 * Elementary-math visual aids: base-10 blocks, ten-frames, area models.
 * These are core K-5 teaching tools — concrete representations of abstract
 * number concepts. Single renderer with a `type` discriminator.
 *
 *  - base-10: ones/tens/hundreds/thousands blocks
 *  - ten-frame: 2×5 grid with counters (one or two frames for 0–20)
 *  - area-model: rectangle partitioned for multi-digit multiplication
 */

import React from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export type ManipulativeType = 'base-10' | 'ten-frame' | 'area-model';

export interface ManipulativeRendererProps {
  title?: string;
  type: ManipulativeType;
  /** base-10 params */
  base10?: {
    ones?: number;
    tens?: number;
    hundreds?: number;
    thousands?: number;
    showTotal?: boolean;
  };
  /** ten-frame params */
  tenFrame?: {
    count: number; // 0-20 (uses 1 or 2 ten-frames)
    color?: string;
    label?: string;
  };
  /** area-model params */
  areaModel?: {
    rows: number[]; // e.g. [20, 3] → splits the rows into a row of height 20 and a row of height 3
    cols: number[]; // e.g. [40, 5]
    showProducts?: boolean; // Fill each cell with its product
    showSum?: boolean; // Show the total below
    rowLabel?: string;
    colLabel?: string;
  };
}

const SVG_WIDTH = 500;
const SVG_HEIGHT = 320;

// ═══════════════════════════════════════════════════════════════════════════════
// Base-10 blocks
// ═══════════════════════════════════════════════════════════════════════════════
function Base10Blocks({
  ones = 0,
  tens = 0,
  hundreds = 0,
  thousands = 0,
  showTotal = true,
}: NonNullable<ManipulativeRendererProps['base10']>) {
  // Unit cube: 14×14. Tens rod: 14×140 (10 cubes). Hundreds flat: 140×140.
  // Thousands cube: drawn as a stacked "10×10×10" with an isometric-style hint.
  const UNIT = 14;
  const total = ones + tens * 10 + hundreds * 100 + thousands * 1000;

  let x = 20;
  const baselineY = 30;

  // Limit visible thousands to avoid overflow.
  // Ones go up to 18 (wraps to 2 rows) — required for regrouping demos where
  // two single-digit additions produce up to 18 units before carrying.
  const thousandsClamped = Math.min(thousands, 3);
  const hundredsClamped = Math.min(hundreds, 6);
  const tensClamped = Math.min(tens, 9);
  const onesClamped = Math.min(ones, 18);

  const blocks: React.ReactElement[] = [];

  // Thousands (draw as 10×10 grid with "stacked" label)
  for (let i = 0; i < thousandsClamped; i++) {
    const bx = x;
    const by = baselineY;
    blocks.push(
      <g key={`th-${i}`} {...feat(`thousands-${i + 1}`, { cx: bx + 5 * UNIT, cy: by + 5 * UNIT, w: 10 * UNIT + 10, h: 10 * UNIT + 10 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <rect x={bx + 4} y={by - 4} width={10 * UNIT} height={10 * UNIT} fill="#e0e7ff" stroke="#6366f1" strokeWidth={1} />
        <rect x={bx} y={by} width={10 * UNIT} height={10 * UNIT} fill="#c7d2fe" stroke="#4338ca" strokeWidth={1.2} />
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 10 }).map((__, c) => (
            <rect
              key={`th-${i}-${r}-${c}`}
              x={bx + c * UNIT}
              y={by + r * UNIT}
              width={UNIT}
              height={UNIT}
              fill="none"
              stroke="#4338ca"
              strokeWidth={0.3}
            />
          ))
        )}
        <text x={bx + 5 * UNIT} y={by + 10 * UNIT + 14} textAnchor="middle" fontSize={11} fill="#1e293b">
          1,000
        </text>
      </g>
    );
    x += 10 * UNIT + 14;
  }

  // Hundreds
  for (let i = 0; i < hundredsClamped; i++) {
    const bx = x;
    const by = baselineY;
    blocks.push(
      <g key={`h-${i}`} {...feat(`hundreds-${i + 1}`, { cx: bx + 5 * UNIT, cy: by + 5 * UNIT, w: 10 * UNIT + 10, h: 10 * UNIT + 10 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <rect x={bx} y={by} width={10 * UNIT} height={10 * UNIT} fill="#bbf7d0" stroke="#16a34a" strokeWidth={1.2} />
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 10 }).map((__, c) => (
            <rect
              key={`h-${i}-${r}-${c}`}
              x={bx + c * UNIT}
              y={by + r * UNIT}
              width={UNIT}
              height={UNIT}
              fill="none"
              stroke="#166534"
              strokeWidth={0.3}
            />
          ))
        )}
        <text x={bx + 5 * UNIT} y={by + 10 * UNIT + 14} textAnchor="middle" fontSize={11} fill="#1e293b">
          100
        </text>
      </g>
    );
    x += 10 * UNIT + 10;
  }

  // Tens (vertical rods of 10)
  for (let i = 0; i < tensClamped; i++) {
    const bx = x;
    const by = baselineY;
    blocks.push(
      <g key={`t-${i}`} {...feat(`tens-${i + 1}`, { cx: bx + UNIT / 2, cy: by + 5 * UNIT, w: UNIT + 6, h: 10 * UNIT + 10 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <rect x={bx} y={by} width={UNIT} height={10 * UNIT} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.2} />
        {Array.from({ length: 10 }).map((_, r) => (
          <line key={`t-${i}-${r}`} x1={bx} y1={by + r * UNIT} x2={bx + UNIT} y2={by + r * UNIT} stroke="#9a3412" strokeWidth={0.3} />
        ))}
        <text x={bx + UNIT / 2} y={by + 10 * UNIT + 14} textAnchor="middle" fontSize={11} fill="#1e293b">
          10
        </text>
      </g>
    );
    x += UNIT + 4;
  }

  // Ones (single unit cubes, wrapped into rows of up to 10 for regrouping demos)
  x += 8;
  const onesRowStartX = x;
  const onesPerRow = 10;
  for (let i = 0; i < onesClamped; i++) {
    const row = Math.floor(i / onesPerRow);
    const col = i % onesPerRow;
    const bx = onesRowStartX + col * (UNIT + 2);
    // Stack rows upward from the bottom so the tens rods' bottom line is shared
    const by = baselineY + 9 * UNIT - row * (UNIT + 2);
    blocks.push(
      <g key={`o-${i}`} {...feat(`ones-${i + 1}`, { cx: bx + UNIT / 2, cy: by + UNIT / 2, w: UNIT + 4, h: UNIT + 4 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <rect x={bx} y={by} width={UNIT} height={UNIT} fill="#fecaca" stroke="#dc2626" strokeWidth={1.2} />
      </g>
    );
  }

  return (
    <g>
      {blocks}
      {/* Overflow indicator if counts exceed visible limits */}
      {(thousands > thousandsClamped || hundreds > hundredsClamped || tens > tensClamped || ones > onesClamped) && (
        <text x={SVG_WIDTH / 2} y={SVG_HEIGHT - 40} textAnchor="middle" fontSize={10} fill="#9ca3af" fontStyle="italic">
          (showing {thousandsClamped} of {thousands} thousands, {hundredsClamped} of {hundreds} hundreds,
          {' '}{tensClamped} of {tens} tens, {onesClamped} of {ones} ones)
        </text>
      )}
      {showTotal && (
        <text x={SVG_WIDTH / 2} y={SVG_HEIGHT - 16} textAnchor="middle" fontSize={16} fontWeight={700} fill="#111827">
          Total: {total.toLocaleString()}
        </text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Ten-frame
// ═══════════════════════════════════════════════════════════════════════════════
function TenFrame({ count, color = '#2563eb', label }: NonNullable<ManipulativeRendererProps['tenFrame']>) {
  const CELL = 40;
  const COLS = 5;
  const ROWS = 2;
  const GAP = 30;
  // One or two ten-frames depending on count
  const frames = count > 10 ? 2 : 1;
  const countsPerFrame = frames === 2 ? [10, Math.max(0, Math.min(10, count - 10))] : [Math.max(0, Math.min(10, count))];
  const totalWidth = frames * COLS * CELL + (frames - 1) * GAP;
  const startX = (SVG_WIDTH - totalWidth) / 2;
  const frameY = 80;

  return (
    <g>
      {countsPerFrame.map((fCount, fIdx) => {
        const fx = startX + fIdx * (COLS * CELL + GAP);
        const dots: React.ReactElement[] = [];
        for (let i = 0; i < 10; i++) {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const cx = fx + c * CELL + CELL / 2;
          const cy = frameY + r * CELL + CELL / 2;
          const filled = i < fCount;
          dots.push(
            <circle
              key={`d-${fIdx}-${i}`}
              cx={cx}
              cy={cy}
              r={CELL * 0.35}
              fill={filled ? color : 'none'}
              stroke={filled ? color : '#cbd5e1'}
              strokeWidth={filled ? 0 : 1.5}
              {...feat(`cell-${fIdx + 1}-${i + 1}`, { cx, cy, w: CELL, h: CELL }, { width: SVG_WIDTH, height: SVG_HEIGHT })}
            />
          );
        }
        return (
          <g key={`frame-${fIdx}`}>
            <rect
              x={fx}
              y={frameY}
              width={COLS * CELL}
              height={ROWS * CELL}
              fill="#fff"
              stroke="#1f2937"
              strokeWidth={2}
            />
            {/* Grid lines */}
            {Array.from({ length: COLS - 1 }).map((_, i) => (
              <line key={`v-${fIdx}-${i}`} x1={fx + (i + 1) * CELL} y1={frameY} x2={fx + (i + 1) * CELL} y2={frameY + ROWS * CELL} stroke="#1f2937" strokeWidth={1.5} />
            ))}
            <line x1={fx} y1={frameY + CELL} x2={fx + COLS * CELL} y2={frameY + CELL} stroke="#1f2937" strokeWidth={1.5} />
            {dots}
          </g>
        );
      })}
      <text x={SVG_WIDTH / 2} y={frameY + ROWS * CELL + 40} textAnchor="middle" fontSize={20} fontWeight={700} fill="#111827">
        {label || `${count}`}
      </text>
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Area model (for multi-digit multiplication / factoring)
// ═══════════════════════════════════════════════════════════════════════════════
function AreaModel({ rows, cols, showProducts = true, showSum = true, rowLabel, colLabel }: NonNullable<ManipulativeRendererProps['areaModel']>) {
  const PADDING_L = 70;
  const PADDING_T = 70;
  const AREA_W = 380;
  const AREA_H = 200;
  const totalRow = rows.reduce((a, b) => a + b, 0);
  const totalCol = cols.reduce((a, b) => a + b, 0);

  // Compute proportional cell dimensions
  const colWidths = cols.map((c) => (c / totalCol) * AREA_W);
  const rowHeights = rows.map((r) => (r / totalRow) * AREA_H);

  const cellColors = ['#bfdbfe', '#fde68a', '#bbf7d0', '#fecaca', '#e9d5ff', '#bae6fd', '#fed7aa'];

  const elements: React.ReactElement[] = [];

  // Column labels (top)
  let xAcc = PADDING_L;
  for (let j = 0; j < cols.length; j++) {
    elements.push(
      <text key={`col-${j}`} x={xAcc + colWidths[j] / 2} y={PADDING_T - 14} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1f2937">
        {cols[j]}
      </text>
    );
    xAcc += colWidths[j];
  }

  // Row labels (left)
  let yAcc = PADDING_T;
  for (let i = 0; i < rows.length; i++) {
    elements.push(
      <text key={`row-${i}`} x={PADDING_L - 14} y={yAcc + rowHeights[i] / 2 + 5} textAnchor="end" fontSize={14} fontWeight={700} fill="#1f2937">
        {rows[i]}
      </text>
    );
    yAcc += rowHeights[i];
  }

  // Cells with products
  yAcc = PADDING_T;
  for (let i = 0; i < rows.length; i++) {
    xAcc = PADDING_L;
    for (let j = 0; j < cols.length; j++) {
      const product = rows[i] * cols[j];
      const color = cellColors[(i + j) % cellColors.length];
      elements.push(
        <g key={`cell-${i}-${j}`} {...feat(`region-${i + 1}-${j + 1}`, { cx: xAcc + colWidths[j] / 2, cy: yAcc + rowHeights[i] / 2, w: colWidths[j], h: rowHeights[i] }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
          <rect x={xAcc} y={yAcc} width={colWidths[j]} height={rowHeights[i]} fill={color} stroke="#1f2937" strokeWidth={1.5} />
          {showProducts && (
            <text
              x={xAcc + colWidths[j] / 2}
              y={yAcc + rowHeights[i] / 2 + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={600}
              fill="#111827"
            >
              {product}
            </text>
          )}
        </g>
      );
      xAcc += colWidths[j];
    }
    yAcc += rowHeights[i];
  }

  if (showSum) {
    const sum = totalRow * totalCol;
    elements.push(
      <text
        key="sum"
        x={PADDING_L + AREA_W / 2}
        y={PADDING_T + AREA_H + 28}
        textAnchor="middle"
        fontSize={16}
        fontWeight={700}
        fill="#111827"
      >
        {rows.map((r) => r).reduce((a, b) => a + b, 0)} × {cols.reduce((a, b) => a + b, 0)} = {sum}
      </text>
    );
  }

  if (rowLabel) {
    elements.push(
      <text key="rl" x={20} y={PADDING_T + AREA_H / 2} textAnchor="middle" fontSize={12} fill="#475569" transform={`rotate(-90, 20, ${PADDING_T + AREA_H / 2})`}>
        {rowLabel}
      </text>
    );
  }
  if (colLabel) {
    elements.push(
      <text key="cl" x={PADDING_L + AREA_W / 2} y={PADDING_T - 36} textAnchor="middle" fontSize={12} fill="#475569">
        {colLabel}
      </text>
    );
  }

  return <g>{elements}</g>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Manifest builder
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildManipulativeManifest(props: ManipulativeRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const { type, base10, tenFrame, areaModel } = props;

  if (type === 'base-10' && base10) {
    const thousands = base10.thousands ?? 0;
    const hundreds = base10.hundreds ?? 0;
    const tens = base10.tens ?? 0;
    const ones = base10.ones ?? 0;
    const thousandsClamped = Math.min(thousands, 3);
    const hundredsClamped = Math.min(hundreds, 6);
    const tensClamped = Math.min(tens, 9);
    const onesClamped = Math.min(ones, 18);
    for (let i = 0; i < thousandsClamped; i++) {
      entries.push({
        name: `thousands-${i + 1}`,
        kind: 'object',
        description: `thousands block ${i + 1} (1000)`,
        labels: [
          `thousands-${i + 1}`,
          `thousands ${i + 1}`,
          `thousand ${i + 1}`,
          `thousands block ${i + 1}`,
          `thousands cube ${i + 1}`,
          '1000', '1,000',
        ],
      });
    }
    for (let i = 0; i < hundredsClamped; i++) {
      entries.push({
        name: `hundreds-${i + 1}`,
        kind: 'object',
        description: `hundreds flat ${i + 1} (100)`,
        labels: [
          `hundreds-${i + 1}`,
          `hundreds ${i + 1}`,
          `hundred ${i + 1}`,
          `hundreds flat ${i + 1}`,
          `flat ${i + 1}`,
          '100',
        ],
      });
    }
    for (let i = 0; i < tensClamped; i++) {
      entries.push({
        name: `tens-${i + 1}`,
        kind: 'object',
        description: `tens rod ${i + 1} (10)`,
        labels: [
          `tens-${i + 1}`,
          `tens ${i + 1}`,
          `ten ${i + 1}`,
          `tens rod ${i + 1}`,
          `rod ${i + 1}`,
          '10',
        ],
      });
    }
    for (let i = 0; i < onesClamped; i++) {
      entries.push({
        name: `ones-${i + 1}`,
        kind: 'object',
        description: `ones unit cube ${i + 1} (1)`,
        labels: [
          `ones-${i + 1}`,
          `ones ${i + 1}`,
          `one ${i + 1}`,
          `unit ${i + 1}`,
          `cube ${i + 1}`,
          `unit cube ${i + 1}`,
        ],
      });
    }
  } else if (type === 'ten-frame' && tenFrame) {
    const count = tenFrame.count;
    const frames = count > 10 ? 2 : 1;
    for (let f = 0; f < frames; f++) {
      for (let i = 0; i < 10; i++) {
        entries.push({
          name: `cell-${f + 1}-${i + 1}`,
          kind: 'shape',
          description: `ten-frame ${f + 1}, cell ${i + 1}`,
          labels: [
            `cell-${f + 1}-${i + 1}`,
            `cell ${f + 1}-${i + 1}`,
            `cell ${i + 1}`,
            `frame ${f + 1} cell ${i + 1}`,
            `ten-frame ${f + 1} cell ${i + 1}`,
            `box ${i + 1}`,
            `square ${i + 1}`,
          ],
        });
      }
    }
  } else if (type === 'area-model' && areaModel) {
    for (let i = 0; i < areaModel.rows.length; i++) {
      for (let j = 0; j < areaModel.cols.length; j++) {
        const rVal = areaModel.rows[i];
        const cVal = areaModel.cols[j];
        entries.push({
          name: `region-${i + 1}-${j + 1}`,
          kind: 'region',
          description: `area-model cell row ${i + 1} × col ${j + 1} = ${rVal} × ${cVal}`,
          labels: [
            `region-${i + 1}-${j + 1}`,
            `region ${i + 1} ${j + 1}`,
            `cell ${i + 1} ${j + 1}`,
            `cell-${i + 1}-${j + 1}`,
            `row ${i + 1} col ${j + 1}`,
            `row ${i + 1} column ${j + 1}`,
            `${rVal} × ${cVal}`,
            `${rVal} times ${cVal}`,
            `the ${rVal}-by-${cVal} cell`,
          ],
        });
      }
    }
  }

  return entries;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════
export default function ManipulativeRenderer(props: ManipulativeRendererProps) {
  const { title, type, base10, tenFrame, areaModel } = props;

  let content: React.ReactNode = null;
  if (type === 'base-10' && base10) content = <Base10Blocks {...base10} />;
  else if (type === 'ten-frame' && tenFrame) content = <TenFrame {...tenFrame} />;
  else if (type === 'area-model' && areaModel) content = <AreaModel {...areaModel} />;

  return (
    <div className="manipulative-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fafbfc" rx={4} />
        {content}
      </svg>
    </div>
  );
}
