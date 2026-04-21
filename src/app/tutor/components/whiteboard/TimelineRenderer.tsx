'use client';

/**
 * Timeline Renderer
 *
 * Horizontal timeline with dated events. Parses dates to numeric years when
 * possible (supports BCE/BC via negative years), falls back to evenly spaced
 * events when dates are strings like "Paleozoic Era" or "5th century AD".
 *
 * Events alternate above and below the axis for readability. Optional color
 * categories drive pin hues.
 */

import React, { useMemo } from 'react';

export interface TimelineEvent {
  date: string; // e.g. "1776", "1492 CE", "500 BCE", "Jan 1, 1776"
  title: string;
  description?: string;
  category?: string; // Freeform label used to bucket events into colors.
  color?: string; // Explicit override.
}

export interface TimelineRendererProps {
  title?: string;
  events: TimelineEvent[];
  orientation?: 'horizontal' | 'vertical';
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 320;
const PADDING_X = 60;
const AXIS_Y = 160;
const PIN_RADIUS = 6;

/**
 * Try to parse a date string to a numeric year. Returns null if it can't
 * confidently extract one — callers fall back to evenly spacing.
 * Handles: "1776", "1492 CE", "1492 AD", "500 BCE", "500 BC", "-500",
 * "Jan 1, 1776", "c. 1492", "1776–1789" (takes first).
 */
function parseYear(date: string): number | null {
  const trimmed = date.trim();
  // BCE / BC → negative year
  const bceMatch = trimmed.match(/(-?\d+)\s*(BCE|BC)\b/i);
  if (bceMatch) return -Math.abs(parseInt(bceMatch[1], 10));
  // Explicit negative
  const negMatch = trimmed.match(/^-(\d+)/);
  if (negMatch) return -parseInt(negMatch[1], 10);
  // Any 4-digit or 3-digit year preceded by "AD"/"CE" or plain
  const yearMatch = trimmed.match(/\b(\d{3,4})\b/);
  if (yearMatch) return parseInt(yearMatch[1], 10);
  return null;
}

/** Convert a category string to a consistent color via cheap hashing. */
const CATEGORY_PALETTE = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#ea580c', // orange
  '#9333ea', // purple
  '#0891b2', // cyan
  '#b45309', // amber
  '#db2777', // pink
];

function categoryColor(category?: string, override?: string): string {
  if (override) return override;
  if (!category) return '#2563eb';
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

/** Format a year for axis labels, keeping BCE explicit. */
function formatAxisYear(year: number): string {
  if (year < 0) return `${-year} BCE`;
  return String(year);
}

export default function TimelineRenderer({
  title,
  events,
}: TimelineRendererProps) {
  const positions = useMemo(() => {
    if (events.length === 0) return [] as Array<{ x: number; year: number | null }>;

    const parsed = events.map((e) => parseYear(e.date));
    const allNumeric = parsed.every((y) => y !== null);

    if (allNumeric && events.length > 1) {
      const years = parsed as number[];
      const minY = Math.min(...years);
      const maxY = Math.max(...years);
      const span = maxY - minY || 1;
      return years.map((y) => ({
        x: PADDING_X + ((y - minY) / span) * (SVG_WIDTH - 2 * PADDING_X),
        year: y,
      }));
    }

    // Fallback: even spacing
    return events.map((_, i) => ({
      x:
        PADDING_X +
        (i / Math.max(1, events.length - 1)) * (SVG_WIDTH - 2 * PADDING_X),
      year: parsed[i],
    }));
  }, [events]);

  const axisYears = useMemo(() => {
    const numeric = positions.map((p) => p.year).filter((y): y is number => y !== null);
    if (numeric.length < 2) return [] as Array<{ x: number; label: string }>;
    const minY = Math.min(...numeric);
    const maxY = Math.max(...numeric);
    const span = maxY - minY;
    // 4–6 ticks depending on span
    const tickCount = Math.min(6, Math.max(3, Math.round(span / 100)));
    const step = span / tickCount;
    const ticks: Array<{ x: number; label: string }> = [];
    for (let i = 0; i <= tickCount; i++) {
      const year = Math.round(minY + i * step);
      const x = PADDING_X + (i / tickCount) * (SVG_WIDTH - 2 * PADDING_X);
      ticks.push({ x, label: formatAxisYear(year) });
    }
    return ticks;
  }, [positions]);

  if (events.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4">No events to display.</div>
    );
  }

  return (
    <div className="timeline-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fafbfc" rx={4} />

        {/* Axis */}
        <line
          x1={PADDING_X}
          y1={AXIS_Y}
          x2={SVG_WIDTH - PADDING_X}
          y2={AXIS_Y}
          stroke="#94a3b8"
          strokeWidth={2}
        />

        {/* Axis tick marks + year labels */}
        {axisYears.map((tick, i) => (
          <g key={`tick-${i}`}>
            <line
              x1={tick.x}
              y1={AXIS_Y - 4}
              x2={tick.x}
              y2={AXIS_Y + 4}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            <text
              x={tick.x}
              y={AXIS_Y + 20}
              textAnchor="middle"
              fontSize={11}
              fill="#64748b"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* Events — alternate above/below axis */}
        {events.map((event, i) => {
          const pos = positions[i];
          const above = i % 2 === 0;
          const pinY = AXIS_Y;
          const lineEndY = above ? AXIS_Y - 60 : AXIS_Y + 60;
          const labelY = above ? lineEndY - 8 : lineEndY + 20;
          const color = categoryColor(event.category, event.color);
          return (
            <g key={`event-${i}`}>
              <line
                x1={pos.x}
                y1={pinY}
                x2={pos.x}
                y2={lineEndY}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="3,3"
              />
              <circle
                cx={pos.x}
                cy={pinY}
                r={PIN_RADIUS}
                fill={color}
                stroke="#fff"
                strokeWidth={1.5}
              />
              <text
                x={pos.x}
                y={labelY}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#1f2937"
              >
                {event.date}
              </text>
              <text
                x={pos.x}
                y={labelY + (above ? -14 : 14)}
                textAnchor="middle"
                fontSize={12}
                fill={color}
                fontWeight={500}
              >
                {event.title}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend — show categories if any are labeled */}
      {events.some((e) => e.category) && (
        <div className="flex flex-wrap gap-2 justify-center mt-2 text-xs">
          {[...new Set(events.map((e) => e.category).filter(Boolean))].map(
            (cat) => (
              <span key={cat} className="inline-flex items-center gap-1">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColor(cat) }}
                />
                {cat}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
