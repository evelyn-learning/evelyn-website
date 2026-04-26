'use client';

/**
 * Timeline Renderer
 *
 * Horizontal timeline with dated events. Parses dates to numeric years when
 * possible (supports BCE/BC via negative years), falls back to evenly spaced
 * events when dates are strings like "Paleozoic Era" or "5th century AD".
 *
 * Two layout modes, chosen automatically:
 *  - **Swimlane**: when events carry 2+ distinct `category` values, each
 *    category gets its own horizontal track with a left-side label.
 *  - **Axis**: otherwise, events alternate above/below a single axis. Labels
 *    that would overlap horizontally get pushed to stacked rows.
 */

import React, { useMemo } from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export interface TimelineEvent {
  date: string; // e.g. "1776", "1492 CE", "500 BCE", "Jan 1, 1776"
  title: string;
  description?: string;
  category?: string; // Freeform label used to bucket events into colors / swimlanes.
  color?: string; // Explicit override.
}

export interface TimelineRendererProps {
  title?: string;
  events: TimelineEvent[];
  orientation?: 'horizontal' | 'vertical';
}

const SVG_WIDTH = 800;
const PIN_RADIUS = 6;
const AXIS_MODE_PADDING_X = 60;
const SWIMLANE_GUTTER = 130; // Left gutter reserved for category labels
const SWIMLANE_RIGHT_PAD = 40;
const SWIMLANE_HEIGHT = 68;
const SWIMLANE_TOP_PAD = 30;
const AXIS_FOOT = 40; // Height reserved for the bottom axis (ticks + labels)
// Rough character width at our font size — used to estimate label widths for
// collision resolution. Slightly generous to avoid false-negatives.
const CHAR_W_TITLE = 7.2; // fontSize=12
const CHAR_W_DATE = 6.6;  // fontSize=11
const LABEL_GAP = 8;      // Minimum pixel gap between adjacent labels

/**
 * Try to parse a date string to a numeric year. Returns null if it can't
 * confidently extract one — callers fall back to evenly spacing.
 */
function parseYear(date: string): number | null {
  const trimmed = date.trim();
  const bceMatch = trimmed.match(/(-?\d+)\s*(BCE|BC)\b/i);
  if (bceMatch) return -Math.abs(parseInt(bceMatch[1], 10));
  const negMatch = trimmed.match(/^-(\d+)/);
  if (negMatch) return -parseInt(negMatch[1], 10);
  const yearMatch = trimmed.match(/\b(\d{3,4})\b/);
  if (yearMatch) return parseInt(yearMatch[1], 10);
  return null;
}

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

function formatAxisYear(year: number): string {
  if (year < 0) return `${-year} BCE`;
  return String(year);
}

/** Wrap a title string at roughly `maxChars` on word boundaries, max 2 lines. */
function wrapTitle(title: string, maxChars: number): string[] {
  if (title.length <= maxChars) return [title];
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if (current.length === 0) {
      current = w;
    } else if (current.length + 1 + w.length <= maxChars) {
      current += ` ${w}`;
    } else {
      lines.push(current);
      current = w;
      if (lines.length === 1) break; // Only allow 2 lines total
    }
  }
  if (lines.length < 2) lines.push(current);
  // If still more words remain beyond 2 lines, truncate last line with ellipsis
  const consumed = lines.join(' ').length;
  if (consumed < title.length) {
    lines[1] = lines[1].length > maxChars - 1
      ? lines[1].slice(0, maxChars - 1) + '…'
      : lines[1] + '…';
  }
  return lines;
}

/** Estimate horizontal width of an event's label block (max of title + date widths). */
function estimateLabelWidth(title: string, date: string, titleMaxChars: number): number {
  const wrapped = wrapTitle(title, titleMaxChars);
  const longestTitle = Math.max(...wrapped.map((l) => l.length));
  const titleW = longestTitle * CHAR_W_TITLE;
  const dateW = date.length * CHAR_W_DATE;
  return Math.max(titleW, dateW);
}

/**
 * Assign a "row" index to each event so that horizontally-overlapping labels
 * stack vertically instead of superimposing. Row 0 = closest to axis; higher
 * rows sit further out. Operates on a single side (above or below).
 */
function assignCollisionRows(
  items: Array<{ x: number; width: number }>
): number[] {
  const rows: number[] = new Array(items.length).fill(0);
  // Process in x-order but keep original indices so callers can map results back.
  const indexed = items.map((it, i) => ({ ...it, i }));
  indexed.sort((a, b) => a.x - b.x);
  const rowEnds: number[] = []; // Right edge (x + half-width) of the last item placed on each row
  for (const it of indexed) {
    const left = it.x - it.width / 2;
    const right = it.x + it.width / 2;
    let placed = false;
    for (let r = 0; r < rowEnds.length; r++) {
      if (left >= rowEnds[r] + LABEL_GAP) {
        rowEnds[r] = right;
        rows[it.i] = r;
        placed = true;
        break;
      }
    }
    if (!placed) {
      rows[it.i] = rowEnds.length;
      rowEnds.push(right);
    }
  }
  return rows;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Both swimlane and axis layouts emit one axis + one event-<slug> per event.
 */
export function buildTimelineManifest(props: TimelineRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const events = props.events ?? [];
  if (events.length === 0) return entries;
  entries.push({
    name: 'axis',
    kind: 'axis',
    description: 'timeline axis line',
    labels: ['axis', 'timeline', 'the timeline', 'timeline axis', 'date axis', 'time axis'],
  });
  events.forEach((e, i) => {
    const slug = e.title ? featSlug(e.title) : `${i + 1}`;
    const name = e.title ? `event-${slug}` : `event-${i + 1}`;
    const labels = new Set<string>([
      name,
      `event-${i + 1}`,
      `event ${i + 1}`,
      `pin ${i + 1}`,
    ]);
    if (e.title) {
      labels.add(e.title);
      labels.add(`event ${e.title}`);
      labels.add(`event-${slug}`);
      labels.add(`the-${slug}-event`);
      labels.add(`the ${e.title} event`);
      labels.add(`the ${e.title}`);
      labels.add(`${e.title} event`);
    }
    if (e.date) {
      labels.add(e.date);
      labels.add(`the ${e.date} event`);
      labels.add(`event in ${e.date}`);
    }
    entries.push({
      name,
      kind: 'point',
      description: `event "${e.title}" (${e.date})${e.category ? ` — ${e.category}` : ''}`,
      labels: Array.from(labels),
    });
  });
  return entries;
}

export default function TimelineRenderer({
  title,
  events,
}: TimelineRendererProps) {
  // Swimlane mode when we have 2+ distinct non-empty categories.
  const distinctCategories = useMemo(() => {
    const seen: string[] = [];
    for (const e of events) {
      if (e.category && !seen.includes(e.category)) seen.push(e.category);
    }
    return seen;
  }, [events]);

  const swimlaneMode = distinctCategories.length >= 2;

  // Compute x positions and axis ticks (shared between both modes).
  const layout = useMemo(() => {
    if (events.length === 0) {
      return { xs: [] as number[], plotLeft: 0, plotRight: 0, ticks: [] as Array<{ x: number; label: string }> };
    }
    const plotLeft = swimlaneMode ? SWIMLANE_GUTTER : AXIS_MODE_PADDING_X;
    const plotRight = SVG_WIDTH - (swimlaneMode ? SWIMLANE_RIGHT_PAD : AXIS_MODE_PADDING_X);
    const parsed = events.map((e) => parseYear(e.date));
    const allNumeric = parsed.every((y) => y !== null);
    let xs: number[];
    let numericYears: number[] = [];
    if (allNumeric && events.length > 1) {
      const years = parsed as number[];
      numericYears = years;
      const minY = Math.min(...years);
      const maxY = Math.max(...years);
      const span = maxY - minY || 1;
      xs = years.map((y) => plotLeft + ((y - minY) / span) * (plotRight - plotLeft));
    } else {
      xs = events.map((_, i) =>
        plotLeft + (i / Math.max(1, events.length - 1)) * (plotRight - plotLeft),
      );
    }
    let ticks: Array<{ x: number; label: string }> = [];
    if (numericYears.length >= 2) {
      const minY = Math.min(...numericYears);
      const maxY = Math.max(...numericYears);
      const span = maxY - minY;
      const tickCount = Math.min(6, Math.max(3, Math.round(span / 100)));
      for (let i = 0; i <= tickCount; i++) {
        const year = Math.round(minY + (i * span) / tickCount);
        const x = plotLeft + (i / tickCount) * (plotRight - plotLeft);
        ticks.push({ x, label: formatAxisYear(year) });
      }
    }
    return { xs, plotLeft, plotRight, ticks };
  }, [events, swimlaneMode]);

  if (events.length === 0) {
    return <div className="text-sm text-gray-500 p-4">No events to display.</div>;
  }

  if (swimlaneMode) {
    return renderSwimlane({
      title,
      events,
      xs: layout.xs,
      plotLeft: layout.plotLeft,
      plotRight: layout.plotRight,
      ticks: layout.ticks,
      categories: distinctCategories,
    });
  }
  return renderAxis({
    title,
    events,
    xs: layout.xs,
    plotLeft: layout.plotLeft,
    plotRight: layout.plotRight,
    ticks: layout.ticks,
  });
}

/* ----------------------------------------------------------------- */
/* Swimlane layout                                                    */
/* ----------------------------------------------------------------- */

interface SwimlaneArgs {
  title?: string;
  events: TimelineEvent[];
  xs: number[];
  plotLeft: number;
  plotRight: number;
  ticks: Array<{ x: number; label: string }>;
  categories: string[];
}

function renderSwimlane({ title, events, xs, plotLeft, plotRight, ticks, categories }: SwimlaneArgs) {
  const height = SWIMLANE_TOP_PAD + categories.length * SWIMLANE_HEIGHT + AXIS_FOOT;
  const axisY = SWIMLANE_TOP_PAD + categories.length * SWIMLANE_HEIGHT;

  // Group event indices by category for per-row collision resolution.
  const titleMaxChars = 18;
  const perRowIndices: number[][] = categories.map((cat) =>
    events
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => e.category === cat)
      .map(({ i }) => i),
  );
  // Resolve collisions within each swimlane row — stacking inside the row
  // when labels would overlap.
  const labelRowByEvent = new Array(events.length).fill(0);
  perRowIndices.forEach((idxs) => {
    const items = idxs.map((i) => ({
      x: xs[i],
      width: estimateLabelWidth(events[i].title, events[i].date, titleMaxChars),
    }));
    const rows = assignCollisionRows(items);
    idxs.forEach((evIdx, localIdx) => {
      labelRowByEvent[evIdx] = rows[localIdx];
    });
  });

  return (
    <div className="timeline-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${height}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH }}
      >
        <rect width={SVG_WIDTH} height={height} fill="#fafbfc" rx={4} />

        {/* Swimlane rows */}
        {categories.map((cat, rowIdx) => {
          const laneY = SWIMLANE_TOP_PAD + rowIdx * SWIMLANE_HEIGHT;
          const laneMidY = laneY + SWIMLANE_HEIGHT / 2;
          const color = categoryColor(cat);
          return (
            <g key={`lane-${rowIdx}`}>
              {/* Alternating lane background */}
              {rowIdx % 2 === 1 && (
                <rect
                  x={plotLeft - 10}
                  y={laneY}
                  width={plotRight - plotLeft + 20}
                  height={SWIMLANE_HEIGHT}
                  fill="#f1f5f9"
                />
              )}
              {/* Lane rule */}
              <line
                x1={plotLeft}
                y1={laneMidY}
                x2={plotRight}
                y2={laneMidY}
                stroke="#cbd5e1"
                strokeWidth={1}
              />
              {/* Category label in left gutter */}
              <rect
                x={6}
                y={laneMidY - 10}
                width={8}
                height={20}
                fill={color}
                rx={2}
              />
              <text
                x={22}
                y={laneMidY + 4}
                fontSize={12}
                fontWeight={600}
                fill="#374151"
              >
                {cat.length > 16 ? cat.slice(0, 15) + '…' : cat}
              </text>
            </g>
          );
        })}

        {/* Events */}
        {events.map((event, i) => {
          const rowIdx = categories.indexOf(event.category || '');
          if (rowIdx < 0) return null;
          const laneMidY = SWIMLANE_TOP_PAD + rowIdx * SWIMLANE_HEIGHT + SWIMLANE_HEIGHT / 2;
          const color = categoryColor(event.category, event.color);
          const x = xs[i];
          const labelRow = labelRowByEvent[i];
          // Stack labels above the pin when multiple pins share x-space on a row.
          const labelY = laneMidY - 12 - labelRow * 20;
          const wrapped = wrapTitle(event.title, 18);
          const evName = event.title ? `event-${featSlug(event.title)}` : `event-${i + 1}`;
          return (
            <g key={`event-${i}`} {...feat(evName, { cx: x, cy: laneMidY, w: 80, h: SWIMLANE_HEIGHT }, { width: SVG_WIDTH, height })}>
              <line
                x1={x}
                y1={laneMidY}
                x2={x}
                y2={labelY + 4}
                stroke={color}
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <circle
                cx={x}
                cy={laneMidY}
                r={PIN_RADIUS}
                fill={color}
                stroke="#fff"
                strokeWidth={1.5}
              />
              {wrapped.map((line, li) => (
                <text
                  key={`t-${i}-${li}`}
                  x={x}
                  y={labelY - (wrapped.length - 1 - li) * 12}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={500}
                  fill={color}
                >
                  {line}
                </text>
              ))}
              <text
                x={x}
                y={laneMidY + 18}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="#1f2937"
              >
                {event.date}
              </text>
            </g>
          );
        })}

        {/* Axis at bottom */}
        <line
          x1={plotLeft}
          y1={axisY}
          x2={plotRight}
          y2={axisY}
          stroke="#94a3b8"
          strokeWidth={2}
          {...feat('axis', { cx: (plotLeft + plotRight) / 2, cy: axisY, w: plotRight - plotLeft + 20, h: 20 }, { width: SVG_WIDTH, height })}
        />
        {ticks.map((tick, i) => (
          <g key={`tick-${i}`}>
            <line
              x1={tick.x}
              y1={axisY - 4}
              x2={tick.x}
              y2={axisY + 4}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            <text
              x={tick.x}
              y={axisY + 20}
              textAnchor="middle"
              fontSize={11}
              fill="#64748b"
            >
              {tick.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Axis (single-row) layout                                           */
/* ----------------------------------------------------------------- */

interface AxisArgs {
  title?: string;
  events: TimelineEvent[];
  xs: number[];
  plotLeft: number;
  plotRight: number;
  ticks: Array<{ x: number; label: string }>;
}

function renderAxis({ title, events, xs, ticks }: AxisArgs) {
  // Partition events into above/below based on original even/odd index, then
  // resolve horizontal collisions within each side by stacking into rows.
  const aboveIdxs: number[] = [];
  const belowIdxs: number[] = [];
  events.forEach((_, i) => (i % 2 === 0 ? aboveIdxs : belowIdxs).push(i));

  const titleMaxChars = 20;
  const aboveItems = aboveIdxs.map((i) => ({
    x: xs[i],
    width: estimateLabelWidth(events[i].title, events[i].date, titleMaxChars),
  }));
  const belowItems = belowIdxs.map((i) => ({
    x: xs[i],
    width: estimateLabelWidth(events[i].title, events[i].date, titleMaxChars),
  }));
  const aboveRows = assignCollisionRows(aboveItems);
  const belowRows = assignCollisionRows(belowItems);

  const aboveMaxRow = aboveRows.length ? Math.max(...aboveRows) : 0;
  const belowMaxRow = belowRows.length ? Math.max(...belowRows) : 0;

  const ROW_HEIGHT = 44; // vertical space per collision row (title + date + dash line)
  const topReserve = 40 + (aboveMaxRow + 1) * ROW_HEIGHT;
  const bottomReserve = 20 + (belowMaxRow + 1) * ROW_HEIGHT;
  const height = topReserve + bottomReserve + AXIS_FOOT;
  const axisY = topReserve;

  const rowByEvent = new Array(events.length).fill(0);
  aboveIdxs.forEach((evIdx, li) => (rowByEvent[evIdx] = aboveRows[li]));
  belowIdxs.forEach((evIdx, li) => (rowByEvent[evIdx] = belowRows[li]));

  return (
    <div className="timeline-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${height}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH }}
      >
        <rect width={SVG_WIDTH} height={height} fill="#fafbfc" rx={4} />

        {/* Axis */}
        <line
          x1={AXIS_MODE_PADDING_X}
          y1={axisY}
          x2={SVG_WIDTH - AXIS_MODE_PADDING_X}
          y2={axisY}
          stroke="#94a3b8"
          strokeWidth={2}
          {...feat('axis', { cx: SVG_WIDTH / 2, cy: axisY, w: SVG_WIDTH - AXIS_MODE_PADDING_X * 2 + 20, h: 20 }, { width: SVG_WIDTH, height })}
        />

        {ticks.map((tick, i) => (
          <g key={`tick-${i}`}>
            <line
              x1={tick.x}
              y1={axisY - 4}
              x2={tick.x}
              y2={axisY + 4}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            <text
              x={tick.x}
              y={axisY + 22}
              textAnchor="middle"
              fontSize={11}
              fill="#64748b"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {events.map((event, i) => {
          const above = i % 2 === 0;
          const row = rowByEvent[i];
          const x = xs[i];
          const color = categoryColor(event.category, event.color);
          // Leader line: from axis pin out to the label block for this row
          const leaderEndY = above
            ? axisY - 24 - row * ROW_HEIGHT
            : axisY + 24 + row * ROW_HEIGHT;
          const wrapped = wrapTitle(event.title, 20);
          // Place date label closest to axis, then title above/below it
          const dateY = above ? leaderEndY - 4 : leaderEndY + 14;
          const titleStartY = above
            ? dateY - 14 - (wrapped.length - 1) * 14
            : dateY + 16;
          const evName = event.title ? `event-${featSlug(event.title)}` : `event-${i + 1}`;
          return (
            <g key={`event-${i}`} {...feat(evName, { cx: x, cy: (axisY + leaderEndY) / 2, w: 100, h: Math.abs(leaderEndY - axisY) + 30 }, { width: SVG_WIDTH, height })}>
              <line
                x1={x}
                y1={axisY}
                x2={x}
                y2={leaderEndY}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="3,3"
              />
              <circle
                cx={x}
                cy={axisY}
                r={PIN_RADIUS}
                fill={color}
                stroke="#fff"
                strokeWidth={1.5}
              />
              <text
                x={x}
                y={dateY}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#1f2937"
              >
                {event.date}
              </text>
              {wrapped.map((line, li) => (
                <text
                  key={`t-${i}-${li}`}
                  x={x}
                  y={titleStartY + li * 14}
                  textAnchor="middle"
                  fontSize={12}
                  fill={color}
                  fontWeight={500}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend — only meaningful when 1 category is present (multi-category → swimlanes) */}
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
            ),
          )}
        </div>
      )}
    </div>
  );
}
