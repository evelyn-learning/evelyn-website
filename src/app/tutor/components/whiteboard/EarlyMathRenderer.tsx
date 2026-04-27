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

const SVG_W = 480;
const SVG_H = 280;
const FONT = 16;

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
  return (
    <div className="early-math-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={SVG_H} fill="#fafbfc" rx={4} />
        {spec.kind === 'place_value' && renderPlaceValue(spec)}
        {spec.kind === 'ten_frame' && renderTenFrame(spec)}
        {spec.kind === 'array' && renderArray(spec)}
        {spec.kind === 'skip_count' && renderSkipCount(spec)}
        {spec.kind === 'bar_model' && renderBarModel(spec)}
      </svg>
    </div>
  );
}

// ─── place_value ──────────────────────────────────────────────────────────────

function renderPlaceValue(spec: Extract<EarlyMathSpec, { kind: 'place_value' }>) {
  const hundreds = spec.hundreds ?? 0;
  const tens = spec.tens ?? 0;
  const ones = spec.ones ?? 0;
  const total = hundreds * 100 + tens * 10 + ones;

  // Three columns: hundreds (10×10 squares), tens (1×10 rod), ones (1×1 unit)
  const COLS = [
    { x: 30, w: 130, label: 'hundreds', count: hundreds, kind: 'flat' as const },
    { x: 175, w: 90, label: 'tens', count: tens, kind: 'rod' as const },
    { x: 280, w: 170, label: 'ones', count: ones, kind: 'unit' as const },
  ];

  return (
    <g>
      {COLS.map((c) => (
        <g key={c.label}>
          <text x={c.x + c.w / 2} y={25} fontSize={FONT} textAnchor="middle" fill="#475569" fontWeight={600}>
            {c.label} ({c.count})
          </text>
          {Array.from({ length: c.count }).map((_, i) => renderBlock(c.kind, c.x, 40, i, c.w))}
        </g>
      ))}
      {spec.showCount !== false && (
        <text x={SVG_W / 2} y={SVG_H - 16} fontSize={20} textAnchor="middle" fill="#0f172a" fontWeight={700}>
          = {total}
        </text>
      )}
    </g>
  );
}

function renderBlock(kind: 'flat' | 'rod' | 'unit', cx: number, cy: number, i: number, colWidth: number): React.ReactElement {
  const cellSize = 10;
  if (kind === 'flat') {
    // A 10×10 square per "hundred". Stack vertically.
    const oy = cy + i * (10 * cellSize + 8);
    return (
      <g key={i}>
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 10 }).map((__, col) => (
            <rect key={`${r}-${col}`} x={cx + col * cellSize} y={oy + r * cellSize} width={cellSize} height={cellSize} fill="#fbbf24" stroke="#92400e" strokeWidth={0.5} />
          )),
        )}
      </g>
    );
  }
  if (kind === 'rod') {
    // 1×10 vertical rod per "ten".
    const cellsPerRow = 4;
    const ox = cx + (i % cellsPerRow) * (cellSize + 8);
    const oy = cy + Math.floor(i / cellsPerRow) * (10 * cellSize + 6);
    return (
      <g key={i}>
        {Array.from({ length: 10 }).map((_, r) => (
          <rect key={r} x={ox} y={oy + r * cellSize} width={cellSize} height={cellSize} fill="#60a5fa" stroke="#1e3a8a" strokeWidth={0.5} />
        ))}
      </g>
    );
  }
  // Unit: 1 cell per "one". Lay out in a 5-wide grid.
  const perRow = Math.max(1, Math.floor(colWidth / (cellSize + 4)));
  const ox = cx + (i % perRow) * (cellSize + 4);
  const oy = cy + Math.floor(i / perRow) * (cellSize + 4);
  return <rect key={i} x={ox} y={oy} width={cellSize} height={cellSize} fill="#34d399" stroke="#065f46" strokeWidth={0.5} />;
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

function renderBarModel(spec: Extract<EarlyMathSpec, { kind: 'bar_model' }>) {
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

  return (
    <g>
      {/* Whole bar (top) */}
      {whole && (
        <g>
          <rect x={margin} y={wholeY} width={fullW} height={BAR_H} fill="#cbd5e1" stroke="#475569" strokeWidth={2} />
          <text x={margin + fullW / 2} y={wholeY + BAR_H / 2 + 6} fontSize={20} textAnchor="middle" fill="#0f172a" fontWeight={700}>
            {whole.label ? `${whole.label} · ` : ''}
            {whole.value !== undefined ? whole.value : (totalNumeric ?? '?')}
          </text>
          <text x={margin} y={wholeY - 6} fontSize={11} fill="#64748b">whole</text>
        </g>
      )}
      {/* Parts row (bottom) */}
      <g>
        <text x={margin} y={partsY - 6} fontSize={11} fill="#64748b">parts</text>
        {(() => {
          let xCursor = margin;
          return parts.map((p, i) => {
            const weight = typeof p.value === 'number' ? Math.max(0, p.value) : 1;
            const w = sumForWeights > 0 ? (weight / sumForWeights) * fullW : fullW / parts.length;
            const x = xCursor;
            xCursor += w;
            return (
              <g key={i}>
                <rect x={x} y={partsY} width={w} height={BAR_H} fill={p.color || PALETTE[i % PALETTE.length]} fillOpacity={0.6} stroke={p.color || PALETTE[i % PALETTE.length]} strokeWidth={2} />
                <text x={x + w / 2} y={partsY + BAR_H / 2 + 6} fontSize={18} textAnchor="middle" fill="#0f172a" fontWeight={700}>
                  {p.label ? `${p.label} · ` : ''}
                  {p.value ?? '?'}
                </text>
              </g>
            );
          });
        })()}
      </g>
      {question && (
        <text x={SVG_W / 2} y={SVG_H - 16} fontSize={FONT} textAnchor="middle" fill="#7c3aed" fontStyle="italic">
          {question}
        </text>
      )}
    </g>
  );
}
