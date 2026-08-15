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

// ─── Bracket helpers ─────────────────────────────────────────────────────────

/**
 * Square brackets are rendered with CSS borders that form the [ ] caps.
 * Round brackets use scaled parenthesis characters.
 * Pipes / double-pipes use literal | characters.
 */

/** Left bracket element */
function LeftBracket({ style }: { style: BracketStyle }) {
  if (style === 'round') {
    return (
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[2.5em] font-light leading-none" style={{ fontFamily: 'Times New Roman, serif' }}>
          (
        </span>
      </div>
    );
  }

  if (style === 'pipes') {
    return (
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[2.5em] font-light leading-none" style={{ fontFamily: 'Times New Roman, serif' }}>
          |
        </span>
      </div>
    );
  }

  if (style === 'double-pipes') {
    return (
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[2.5em] font-light leading-none tracking-tight" style={{ fontFamily: 'Times New Roman, serif' }}>
          ‖
        </span>
      </div>
    );
  }

  // Default: square brackets via CSS borders
  return (
    <div
      className="w-[6px] self-stretch border-l-2 border-t-2 border-b-2 border-current"
      aria-hidden="true"
    />
  );
}

/** Right bracket element */
function RightBracket({ style }: { style: BracketStyle }) {
  if (style === 'round') {
    return (
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[2.5em] font-light leading-none" style={{ fontFamily: 'Times New Roman, serif' }}>
          )
        </span>
      </div>
    );
  }

  if (style === 'pipes') {
    return (
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[2.5em] font-light leading-none" style={{ fontFamily: 'Times New Roman, serif' }}>
          |
        </span>
      </div>
    );
  }

  if (style === 'double-pipes') {
    return (
      <div className="flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[2.5em] font-light leading-none tracking-tight" style={{ fontFamily: 'Times New Roman, serif' }}>
          ‖
        </span>
      </div>
    );
  }

  // Default: square brackets via CSS borders
  return (
    <div
      className="w-[6px] self-stretch border-r-2 border-t-2 border-b-2 border-current"
      aria-hidden="true"
    />
  );
}

// ─── Single matrix block ─────────────────────────────────────────────────────

/**
 * Renders one matrix with brackets, optional augmented line, row labels,
 * and column labels. This is the core visual unit — the outer MatrixRenderer
 * composes one or two of these together with an operator symbol.
 */
function MatrixBlock({
  rows,
  brackets = 'square',
  augmented,
  rowLabels,
  colLabels,
}: {
  rows: string[][];
  brackets?: BracketStyle;
  augmented?: number;
  rowLabels?: string[];
  colLabels?: string[];
}) {
  const numCols = rows.length > 0 ? Math.max(...rows.map((r) => r.length)) : 0;

  return (
    <div className="inline-flex items-center gap-0">
      {/* Row labels (to the left of the bracket) */}
      {rowLabels && rowLabels.length > 0 && (
        <div className="flex flex-col justify-center mr-2">
          {/* Spacer for colLabels row */}
          {colLabels && colLabels.length > 0 && <div className="h-6" />}
          {rows.map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center justify-end h-9 text-xs text-gray-500 font-mono pr-1"
            >
              {rowLabels[rowIdx] ?? ''}
            </div>
          ))}
        </div>
      )}

      {/* Left bracket */}
      <LeftBracket style={brackets} />

      {/* Matrix body */}
      <div className="flex flex-col">
        {/* Column labels row */}
        {colLabels && colLabels.length > 0 && (
          <div className="flex">
            {Array.from({ length: numCols }).map((_, colIdx) => {
              // Determine if this column is right before the augmented line
              const isBeforeAugmented = augmented !== undefined && colIdx === augmented - 1;
              return (
                <div
                  key={colIdx}
                  className={`
                    min-w-[3rem] h-6 flex items-center justify-center
                    text-xs text-gray-500 font-mono
                    ${isBeforeAugmented ? 'border-r-2 border-dashed border-gray-400' : ''}
                  `}
                >
                  {colLabels[colIdx] ?? ''}
                </div>
              );
            })}
          </div>
        )}

        {/* Data rows */}
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {Array.from({ length: numCols }).map((_, colIdx) => {
              const isBeforeAugmented = augmented !== undefined && colIdx === augmented - 1;
              return (
                <div
                  key={colIdx}
                  className={`
                    min-w-[3rem] h-9 flex items-center justify-center
                    px-2 font-mono text-sm
                    ${isBeforeAugmented ? 'border-r-2 border-dashed border-gray-400' : ''}
                  `}
                >
                  {row[colIdx] ?? ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Right bracket */}
      <RightBracket style={brackets} />
    </div>
  );
}

// ─── Row operations display ──────────────────────────────────────────────────

/**
 * Shows row operations to the right of the matrix. Each operation gets
 * a small arrow indicator pointing at the corresponding row.
 */
function RowOperations({
  operations,
  numRows,
  hasColLabels,
}: {
  operations: RowOperation[];
  numRows: number;
  hasColLabels: boolean;
}) {
  return (
    <div className="flex flex-col ml-3">
      {/* Spacer if column labels are present */}
      {hasColLabels && <div className="h-6" />}

      {Array.from({ length: numRows }).map((_, rowIdx) => {
        const op = operations.find((o) => o.targetRow === rowIdx);
        return (
          <div
            key={rowIdx}
            className="h-9 flex items-center text-xs font-mono text-blue-600 whitespace-nowrap"
          >
            {op ? (
              <>
                <span className="mr-1">&#8592;</span>
                <span>{op.description}</span>
              </>
            ) : null}
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
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Title */}
      {title && (
        <div className="text-sm font-semibold text-gray-700 mb-1"><InlineMathText text={title} /></div>
      )}

      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Primary matrix */}
        <MatrixBlock
          rows={rows}
          brackets={brackets}
          augmented={augmented}
          rowLabels={rowLabels}
          colLabels={colLabels}
        />

        {/* Row operations (shown to the right of the primary matrix) */}
        {rowOperations && rowOperations.length > 0 && (
          <RowOperations
            operations={rowOperations}
            numRows={rows.length}
            hasColLabels={!!colLabels && colLabels.length > 0}
          />
        )}

        {/* Operator symbol + result matrix */}
        {resultMatrix && (
          <>
            <div className="flex items-center text-lg font-mono text-gray-600 px-2">
              {operatorSymbol}
            </div>
            <MatrixBlock
              rows={resultMatrix.rows}
              brackets={resultMatrix.brackets ?? brackets}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default MatrixRenderer;
