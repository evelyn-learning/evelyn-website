'use client';

/**
 * Venn Diagram Renderer
 *
 * Renders 2-set or 3-set Venn diagrams using pure SVG.
 * Supports region highlighting, value/item display, and a universal set rectangle.
 */

import { useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface VennSet {
  label: string;
  color?: string;
}

interface VennRegion {
  value?: string;
  highlight?: boolean;
  items?: string[];
}

/** Region keys for 2-set diagrams */
type TwoSetRegionKey = 'onlyA' | 'onlyB' | 'intersection' | 'neither';

/** Region keys for 3-set diagrams */
type ThreeSetRegionKey =
  | 'onlyA'
  | 'onlyB'
  | 'onlyC'
  | 'AB'
  | 'AC'
  | 'BC'
  | 'ABC'
  | 'neither';

interface VennDiagramRendererProps {
  title?: string;
  sets: VennSet[];
  regions: Record<string, VennRegion>;
  universalLabel?: string;
}

// ─── Default colors ──────────────────────────────────────────────────────────

const DEFAULT_COLORS = ['#2563eb', '#dc2626', '#16a34a']; // blue, red, green

// ─── Geometric centers for each region ───────────────────────────────────────

/** 2-set circle config */
const TWO_SET = {
  A: { cx: 180, cy: 200, r: 120 },
  B: { cx: 320, cy: 200, r: 120 },
};

/**
 * 3-set circle config — classic triangular arrangement.
 * Top circle centered above, two lower circles left and right.
 */
const THREE_SET = {
  A: { cx: 200, cy: 170, r: 110 },
  B: { cx: 300, cy: 170, r: 110 },
  C: { cx: 250, cy: 260, r: 110 },
};

/**
 * Approximate geometric centers of each non-overlapping or overlapping region.
 * These are hand-tuned to sit visually inside the correct area.
 */
const TWO_SET_REGION_CENTERS: Record<TwoSetRegionKey, { x: number; y: number }> = {
  onlyA: { x: 140, y: 200 },
  onlyB: { x: 360, y: 200 },
  intersection: { x: 250, y: 200 },
  neither: { x: 60, y: 50 },
};

const THREE_SET_REGION_CENTERS: Record<ThreeSetRegionKey, { x: number; y: number }> = {
  onlyA: { x: 160, y: 140 },
  onlyB: { x: 340, y: 140 },
  onlyC: { x: 250, y: 310 },
  AB: { x: 250, y: 145 },
  AC: { x: 200, y: 250 },
  BC: { x: 300, y: 250 },
  ABC: { x: 250, y: 210 },
  neither: { x: 60, y: 50 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Render the text content for a single region (value and/or items). */
function RegionText({
  x,
  y,
  region,
}: {
  x: number;
  y: number;
  region: VennRegion;
}) {
  const hasValue = region.value !== undefined && region.value !== '';
  const hasItems = region.items && region.items.length > 0;
  if (!hasValue && !hasItems) return null;

  return (
    <g>
      {/* Primary value */}
      {hasValue && (
        <text
          x={x}
          y={hasItems ? y - 8 : y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          fontWeight={600}
          fill="#1e293b"
        >
          {region.value}
        </text>
      )}

      {/* Items list — rendered smaller, below the value */}
      {hasItems && (
        <text
          x={x}
          y={hasValue ? y + 10 : y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fill="#475569"
        >
          {region.items!.join(', ')}
        </text>
      )}
    </g>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VennDiagramRenderer({
  title,
  sets,
  regions,
  universalLabel,
}: VennDiagramRendererProps) {
  // Model sometimes omits `regions` entirely when it just wants to show
  // the diagram structure. Guard against null/undefined so Object.entries
  // doesn't throw — an empty regions map renders the bare circles.
  const safeRegions: Record<string, VennRegion> = regions ?? {};
  const isThreeSet = sets.length >= 3;

  /** Resolved colors for each set */
  const colors = useMemo(
    () => sets.map((s, i) => s.color || DEFAULT_COLORS[i] || DEFAULT_COLORS[0]),
    [sets]
  );

  /** Circle definitions based on set count */
  const circles = useMemo(() => {
    if (isThreeSet) {
      return [
        { ...THREE_SET.A, color: colors[0], label: sets[0].label },
        { ...THREE_SET.B, color: colors[1], label: sets[1].label },
        { ...THREE_SET.C, color: colors[2], label: sets[2].label },
      ];
    }
    return [
      { ...TWO_SET.A, color: colors[0], label: sets[0].label },
      { ...TWO_SET.B, color: colors[1], label: sets[1]?.label ?? '' },
    ];
  }, [isThreeSet, colors, sets]);

  /** Region center positions */
  const regionCenters = isThreeSet ? THREE_SET_REGION_CENTERS : TWO_SET_REGION_CENTERS;

  /** Label positions — placed just above or beside each circle */
  const labelPositions = useMemo(() => {
    if (isThreeSet) {
      return [
        { x: THREE_SET.A.cx - 60, y: THREE_SET.A.cy - THREE_SET.A.r - 10 }, // A: top-left
        { x: THREE_SET.B.cx + 60, y: THREE_SET.B.cy - THREE_SET.B.r - 10 }, // B: top-right
        { x: THREE_SET.C.cx, y: THREE_SET.C.cy + THREE_SET.C.r + 20 },      // C: below
      ];
    }
    return [
      { x: TWO_SET.A.cx, y: TWO_SET.A.cy - TWO_SET.A.r - 12 }, // A: above
      { x: TWO_SET.B.cx, y: TWO_SET.B.cy - TWO_SET.B.r - 12 }, // B: above
    ];
  }, [isThreeSet]);

  return (
    <svg
      viewBox="0 0 500 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label={title || 'Venn Diagram'}
    >
      {/* Universal set — outer rectangle */}
      <rect
        x={10}
        y={10}
        width={480}
        height={380}
        rx={8}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />

      {/* Universal set label */}
      {universalLabel && (
        <text x={20} y={30} fontSize={12} fill="#64748b" fontWeight={500}>
          {universalLabel}
        </text>
      )}

      {/* Title */}
      {title && (
        <text
          x={250}
          y={universalLabel ? 30 : 30}
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
          fill="#0f172a"
        >
          {title}
        </text>
      )}

      {/* Highlight fills — drawn before circle strokes so they sit underneath */}
      {Object.entries(safeRegions).map(([key, region]) => {
        if (!region.highlight) return null;
        const center = regionCenters[key as keyof typeof regionCenters];
        if (!center) return null;

        // Draw a small semi-transparent circle at the region center to indicate highlight.
        // For a precise approach, clip paths would be needed, but this provides a clear
        // visual cue that the region is emphasized.
        return (
          <circle
            key={`highlight-${key}`}
            cx={center.x}
            cy={center.y}
            r={40}
            fill="#fbbf24"
            opacity={0.25}
          />
        );
      })}

      {/* Circles — stroke + low-opacity fill */}
      {circles.map((c, i) => (
        <circle
          key={`circle-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill={c.color}
          fillOpacity={0.15}
          stroke={c.color}
          strokeWidth={2}
        />
      ))}

      {/* Set labels */}
      {circles.map((c, i) => (
        <text
          key={`label-${i}`}
          x={labelPositions[i].x}
          y={labelPositions[i].y}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={c.color}
        >
          {c.label}
        </text>
      ))}

      {/* Region values and items */}
      {Object.entries(safeRegions).map(([key, region]) => {
        const center = regionCenters[key as keyof typeof regionCenters];
        if (!center) return null;

        return (
          <RegionText
            key={`region-${key}`}
            x={center.x}
            y={center.y}
            region={region}
          />
        );
      })}
    </svg>
  );
}

export default VennDiagramRenderer;
