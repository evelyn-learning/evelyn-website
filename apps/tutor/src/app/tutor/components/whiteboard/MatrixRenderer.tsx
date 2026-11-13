'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Matrix Renderer
 *
 * Renders matrices with configurable bracket styles, augmented lines,
 * row/column labels, row operations, and side-by-side result matrices.
 * Uses HTML/CSS (not SVG) for better text rendering and accessibility.
 */

import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type BracketStyle = 'square' | 'round' | 'pipes' | 'double-pipes';

interface RowOperation {
  /** Human-readable description, e.g. "R1 ← R1 - 3R2" */
  description: string;
  /** Zero-based index of the row this operation targets */
  targetRow: number;
}

interface MatrixRendererProps {
  /** Optional title displayed above the matrix */
  title?: string;
  /** 2D array of cell values — each inner array is one row */
  rows: string[][];
  /** Bracket style wrapping the matrix (default: 'square') */
  brackets?: BracketStyle;
  /** Column index where a dashed augmented divider is drawn */
  augmented?: number;
  /** Labels shown to the left of each row (e.g. "R1", "R2") */
  rowLabels?: string[];
  /** Labels shown above each column (e.g. "x", "y", "z") */
  colLabels?: string[];
  /** Row operations displayed to the right of the matrix */
  rowOperations?: RowOperation[];
  /** When provided, a second matrix is rendered to the right with an operator between them */
  resultMatrix?: {
    rows: string[][];
    brackets?: BracketStyle;
  };
  /** Symbol placed between the main and result matrices (default: "→") */
  operatorSymbol?: string;
}

// ─── Maths text ──────────────────────────────────────────────────────────────

/** A matrix entry is maths: typeset it (fractions, signs, variables) instead
 *  of printing the raw LaTeX. An entry that already carries its own $…$ is
 *  left as written. */
function Cell({ text }: { text: string }) {
  const t = String(text ?? '');
  if (t.trim() === '') return null;
  return <InlineMathText text={t.includes('$') ? t : `$${t}$`} forceMath nowrap />;
}

/** A row operation ("R_1 + \frac{3}{2}R_2 \to R_1", "R2 ← R2 − 3R1") is maths;
 *  a sentence ("swap rows 1 and 2") stays prose. */
function Operation({ text }: { text: string }) {
  const t = String(text ?? '');
  if (t.includes('$')) return <InlineMathText text={t} nowrap />;
  const bare = t.replace(/\\[A-Za-z]+/g, ' ');
  const isProse = /[A-Za-z]{3,}/.test(bare);
  if (isProse) return <InlineMathText text={t} nowrap />;
  const tex = t
    .replace(/([A-Za-z])(\d+)/g, (_m, letter: string, digits: string) => `${letter}_{${digits}}`) // R1 → R_1
    .replace(/<->|↔/g, '\\leftrightarrow ')
    .replace(/->|→/g, '\\to ')
    .replace(/<-|←/g, '\\leftarrow ');
  return <InlineMathText text={`$${tex}$`} forceMath nowrap />;
}

// ─── Brackets ────────────────────────────────────────────────────────────────

/** A bracket that spans the full height of the rows it encloses (a grid item
 *  stretched over them), so it is always as tall as its content. */
function Bracket({ style, side, gridRow, gridColumn }: { style: BracketStyle; side: 'left' | 'right'; gridRow: string; gridColumn: number }) {
  const base: React.CSSProperties = { gridRow, gridColumn, alignSelf: 'stretch', color: '#1f2937' };
  const edge = side === 'left' ? 'borderLeft' : 'borderRight';
  if (style === 'round') {
    return (
      <div aria-hidden="true" style={{
        ...base, width: 10, [edge]: '2px solid currentColor',
        borderRadius: side === 'left' ? '50% 0 0 50% / 14px 0 0 14px' : '0 50% 50% 0 / 0 14px 14px 0',
        margin: '1px 0',
      }} />
    );
  }
  if (style === 'pipes') {
    return <div aria-hidden="true" style={{ ...base, width: 6, [edge]: '2px solid currentColor' }} />;
  }
  if (style === 'double-pipes') {
    return <div aria-hidden="true" style={{ ...base, width: 8, [edge]: '6px double currentColor' }} />;
  }
  return (
    <div aria-hidden="true" style={{
      ...base, width: 7, [edge]: '2px solid currentColor',
      borderTop: '2px solid currentColor', borderBottom: '2px solid currentColor',
    }} />
  );
}

// ─── Single matrix block ─────────────────────────────────────────────────────

/**
 * One matrix laid out on a single CSS grid: row labels, left bracket, the
 * entries, right bracket, row operations. Every row of the grid is one row of
 * the matrix, so labels, entries, the augmented bar and the operations stay
 * aligned whatever the height of an entry (a fraction is taller than a 1).
 */
function MatrixBlock({
  rows,
  brackets = 'square',
  augmented,
  rowLabels,
  colLabels,
  rowOperations,
}: {
  rows: string[][];
  brackets?: BracketStyle;
  augmented?: number;
  rowLabels?: string[];
  colLabels?: string[];
  rowOperations?: RowOperation[];
}) {
  const numCols = rows.length > 0 ? Math.max(...rows.map((r) => r.length)) : 0;
  const hasRowLabels = !!rowLabels && rowLabels.length > 0;
  const hasColLabels = !!colLabels && colLabels.length > 0;
  const hasOps = !!rowOperations && rowOperations.length > 0;
  const bar = typeof augmented === 'number' && augmented > 0 && augmented < numCols ? augmented : undefined;
  // grid columns: [row label] [left bracket] [entries…] [right bracket] [operation]
  const c0 = hasRowLabels ? 2 : 1; // left bracket column
  const firstCol = c0 + 1;
  const rightCol = firstCol + numCols;
  const r0 = hasColLabels ? 2 : 1; // first data row
  const dataRows = `${r0} / ${r0 + rows.length}`;
  const template = [
    hasRowLabels ? 'auto' : null, 'auto', `repeat(${numCols}, auto)`, 'auto', hasOps ? 'auto' : null,
  ].filter(Boolean).join(' ');
  const barStyle = (colIdx: number): React.CSSProperties =>
    (bar !== undefined && colIdx === bar ? { borderLeft: '2px dashed #9ca3af' } : {});

  return (
    <div className="inline-grid items-center" style={{ gridTemplateColumns: template }}>
      {hasColLabels && Array.from({ length: numCols }).map((_, colIdx) => (
        <div
          key={`cl${colIdx}`}
          className="flex items-center justify-center text-sm text-gray-500"
          style={{ gridRow: 1, gridColumn: firstCol + colIdx, padding: '0 14px 4px' }}
        >
          <Cell text={colLabels![colIdx] ?? ''} />
        </div>
      ))}

      {hasRowLabels && rows.map((_, rowIdx) => (
        <div
          key={`rl${rowIdx}`}
          className="flex items-center justify-end text-sm text-gray-500 pr-3"
          style={{ gridRow: r0 + rowIdx, gridColumn: 1 }}
        >
          <Cell text={rowLabels![rowIdx] ?? ''} />
        </div>
      ))}

      <Bracket style={brackets} side="left" gridRow={dataRows} gridColumn={c0} />

      {rows.map((row, rowIdx) => Array.from({ length: numCols }).map((_, colIdx) => (
        <div
          key={`${rowIdx}-${colIdx}`}
          className="flex items-center justify-center text-base text-gray-900"
          style={{
            gridRow: r0 + rowIdx, gridColumn: firstCol + colIdx,
            alignSelf: 'stretch', minHeight: '2.4rem', minWidth: '2.6rem', padding: '5px 14px',
            ...barStyle(colIdx),
          }}
        >
          <Cell text={row[colIdx] ?? ''} />
        </div>
      )))}

      <Bracket style={brackets} side="right" gridRow={dataRows} gridColumn={rightCol} />

      {hasOps && rows.map((_, rowIdx) => {
        const op = rowOperations!.find((o) => o.targetRow === rowIdx);
        if (!op) return null;
        return (
          <div
            key={`op${rowIdx}`}
            className="flex items-center text-sm text-blue-700 whitespace-nowrap pl-4"
            style={{ gridRow: r0 + rowIdx, gridColumn: rightCol + 1 }}
          >
            <Operation text={op.description} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function MatrixRenderer({
  title,
  rows,
  brackets = 'square',
  augmented,
  rowLabels,
  colLabels,
  rowOperations,
  resultMatrix,
  operatorSymbol = '→',
}: MatrixRendererProps) {
  const safeRows = Array.isArray(rows) ? rows.filter(Array.isArray) : [];
  const numCols = safeRows.length > 0 ? Math.max(...safeRows.map((r) => r.length)) : 0;
  const resultRows = resultMatrix && Array.isArray(resultMatrix.rows) ? resultMatrix.rows.filter(Array.isArray) : null;
  const resultCols = resultRows && resultRows.length > 0 ? Math.max(...resultRows.map((r) => r.length)) : 0;
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {title && (
        <div className="text-base font-semibold text-gray-800 text-center"><InlineMathText text={title} /></div>
      )}

      <div className="flex items-center gap-x-5 gap-y-5 flex-wrap justify-center">
        <MatrixBlock
          rows={safeRows}
          brackets={brackets}
          augmented={augmented}
          rowLabels={rowLabels}
          colLabels={colLabels}
          rowOperations={rowOperations}
        />

        {/* The operator stays with its result when the pair wraps to a new line. */}
        {resultRows && (
          <div className="inline-flex items-center gap-5">
            <div className="flex items-center text-xl text-gray-600">
              <Operation text={operatorSymbol} />
            </div>
            <MatrixBlock
              rows={resultRows}
              brackets={resultMatrix!.brackets ?? brackets}
              augmented={resultCols === numCols ? augmented : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MatrixRenderer;
