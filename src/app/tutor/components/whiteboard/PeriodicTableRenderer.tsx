'use client';

/**
 * Periodic Table Renderer
 *
 * Full 118-element periodic table with group/period layout. Supports:
 *   - Category-based coloring (shown by default)
 *   - Highlighting specific elements or element groups
 *   - Per-element info display (symbol, atomic number, mass)
 *
 * Use for chemistry teaching — e.g. "show me the alkali metals", "which
 * group is chlorine in?", "trend in electronegativity across period 3".
 */

import React from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import {
  ELEMENTS,
  ELEMENT_BY_SYMBOL,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type ElementCategory,
  type Element,
} from '@/data/tutor/periodic-table';

export interface PeriodicTableRendererProps {
  title?: string;
  /** Highlight specific elements by symbol. */
  highlight?: Array<{ symbol: string; color?: string; note?: string }>;
  /** Highlight an entire group (column), e.g. 1 for alkali metals. */
  highlightGroup?: number;
  /** Highlight an entire period (row), e.g. 3. */
  highlightPeriod?: number;
  /** Highlight an entire category. */
  highlightCategory?: ElementCategory;
  /** If true, show atomic mass on each tile. */
  showMass?: boolean;
}

const CELL_W = 42;
const CELL_H = 46;
const GAP = 2;
const COLS = 18;
const ROWS = 10;

const GRID_W = COLS * (CELL_W + GAP);
const GRID_H = ROWS * (CELL_H + GAP) + 16; // extra vertical gap between row 7 and row 9 (lanthanides)

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * The table renders ALL elements from the ELEMENTS table — one feature per element.
 */
export function buildPeriodicTableManifest(props: PeriodicTableRendererProps): FeatureManifestEntry[] {
  // Highlight selection surfaced (value-blindness audit, 2026-07-23): the
  // pedagogically-chosen highlight — the whole POINT of the render — was
  // invisible to the brain (props were ignored entirely).
  const highlights: FeatureManifestEntry[] = [];
  const hl = [
    Array.isArray(props.highlight) && props.highlight.length ? `elements ${props.highlight.join(', ')}` : '',
    props.highlightGroup !== undefined ? `group ${props.highlightGroup}` : '',
    props.highlightPeriod !== undefined ? `period ${props.highlightPeriod}` : '',
    typeof (props as { highlightCategory?: unknown }).highlightCategory === 'string'
      ? `category ${(props as { highlightCategory?: string }).highlightCategory}` : '',
  ].filter(Boolean).join('; ');
  if (hl) {
    highlights.push({
      name: 'highlight',
      kind: 'annotation',
      description: `highlighted: ${hl}`,
      labels: ['highlight', 'the highlight', 'highlighted elements', 'the highlighted'],
    });
  }
  return highlights.concat(ELEMENTS.map((el) => {
    const labels = new Set<string>([
      `element-${el.symbol}`,
      el.symbol,
      el.name,
      el.name.toLowerCase(),
      `the ${el.name.toLowerCase()}`,
      `atomic number ${el.z}`,
      `Z=${el.z}`,
      `Z ${el.z}`,
      `element ${el.z}`,
    ]);
    return {
      name: `element-${el.symbol}`,
      kind: 'object' as const,
      description: `${el.name} (${el.symbol}, Z=${el.z}, period ${el.row}, group ${el.col})`,
      labels: Array.from(labels),
    };
  }));
}

export default function PeriodicTableRenderer({
  title,
  highlight = [],
  highlightGroup,
  highlightPeriod,
  highlightCategory,
  showMass = false,
}: PeriodicTableRendererProps) {
  const highlightMap = new Map(highlight.map((h) => [h.symbol.toLowerCase(), h]));

  const isActiveHighlight = (el: Element) => {
    if (highlightMap.has(el.symbol.toLowerCase())) return true;
    if (highlightGroup !== undefined && el.col === highlightGroup && el.row <= 7) return true;
    if (highlightPeriod !== undefined && el.row === highlightPeriod) return true;
    if (highlightCategory !== undefined && el.category === highlightCategory) return true;
    return false;
  };

  const anyHighlight = highlight.length > 0 || highlightGroup !== undefined || highlightPeriod !== undefined || highlightCategory !== undefined;

  return (
    <div className="periodic-table-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${GRID_W + 10} ${GRID_H + 60}`}
        className="w-full h-auto"
        style={{ maxWidth: GRID_W + 10 }}
      >
        <rect width={GRID_W + 10} height={GRID_H + 60} fill="#fafbfc" rx={4} />

        {ELEMENTS.map((el) => {
          // Extra vertical offset for row 9 and row 10 (lanthanides/actinides) to visually separate
          const rowOffset = el.row >= 9 ? 16 : 0;
          const x = 4 + (el.col - 1) * (CELL_W + GAP);
          const y = 4 + (el.row - 1) * (CELL_H + GAP) + rowOffset;

          const active = isActiveHighlight(el);
          const categoryCol = CATEGORY_COLORS[el.category];
          const customColor = highlightMap.get(el.symbol.toLowerCase())?.color;
          const bg = customColor || (anyHighlight && !active ? '#f3f4f6' : categoryCol.bg);
          const border = active ? '#111827' : categoryCol.border;
          const textColor = anyHighlight && !active ? '#9ca3af' : '#111827';

          return (
            <g key={el.symbol}
              {...feat(`element-${el.symbol}`,
                { cx: x + CELL_W / 2, cy: y + CELL_H / 2, w: CELL_W + 4, h: CELL_H + 4 },
                { width: GRID_W + 10, height: GRID_H + 60 })}>
              <rect
                x={x}
                y={y}
                width={CELL_W}
                height={CELL_H}
                rx={3}
                fill={bg}
                stroke={border}
                strokeWidth={active ? 2 : 1}
              />
              <text
                x={x + CELL_W / 2}
                y={y + 10}
                textAnchor="middle"
                fontSize={7}
                fill={textColor}
              >
                {el.z}
              </text>
              <text
                x={x + CELL_W / 2}
                y={y + 26}
                textAnchor="middle"
                fontSize={15}
                fontWeight={700}
                fill={textColor}
              >
                {el.symbol}
              </text>
              {showMass && (
                <text
                  x={x + CELL_W / 2}
                  y={y + CELL_H - 4}
                  textAnchor="middle"
                  fontSize={7}
                  fill={textColor}
                >
                  {el.mass.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(0, ${GRID_H + 8})`}>
          {Object.entries(CATEGORY_COLORS).map(([cat, col], i) => {
            const perRow = 5;
            const lx = 10 + (i % perRow) * 160;
            const ly = Math.floor(i / perRow) * 18;
            return (
              <g key={cat} transform={`translate(${lx}, ${ly})`}>
                <rect width={12} height={12} rx={2} fill={col.bg} stroke={col.border} strokeWidth={1} />
                <text x={18} y={10} fontSize={10} fill="#374151">
                  {CATEGORY_LABELS[cat as ElementCategory]}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Notes for highlighted elements */}
      {highlight.filter((h) => h.note).length > 0 && (
        <div className="mt-2 text-xs text-gray-700 space-y-1">
          {highlight.filter((h) => h.note).map((h, i) => {
            const el = ELEMENT_BY_SYMBOL.get(h.symbol);
            return (
              <div key={i}>
                <span className="font-semibold">{el?.name || h.symbol}:</span> {h.note}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
