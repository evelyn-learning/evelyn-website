'use client';

import { mathifyDollarSpans } from '@/lib/utils/export/latex-readable';
/**
 * Venn Diagram Renderer
 *
 * Renders 2-set or 3-set Venn diagrams using pure SVG.
 * Supports region highlighting, value/item display, and a universal set rectangle.
 */

import { useMemo } from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

const VB_W = 500;
const VB_H = 400;

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

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Each set circle (circle-A, circle-B, …) + each region (region-only-A,
 * region-intersection-AB, region-outside, …) + optional number-<value> hooks
 * when a region's value is a plain integer.
 */
export function buildVennDiagramManifest(props: VennDiagramRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const sets = props.sets ?? [];
  const safeRegions: Record<string, VennRegion> = props.regions ?? {};
  const isThreeSet = sets.length >= 3;

  // Circles — one per set, named A / B / C.
  const circleCount = isThreeSet ? 3 : Math.min(2, sets.length);
  const setLabelByLetter: Record<string, string> = {};
  for (let i = 0; i < circleCount; i++) {
    const letter = String.fromCharCode(65 + i);
    const label = sets[i]?.label ?? '';
    setLabelByLetter[letter] = label;
    const labels = new Set<string>([
      `circle-${letter}`,
      `circle ${letter}`,
      `set ${letter}`,
      letter,
      `circle of ${letter}`,
    ]);
    if (label) {
      labels.add(label);
      labels.add(label.toLowerCase());
      labels.add(`the ${label.toLowerCase()}`);
      labels.add(`set ${label}`);
      labels.add(`circle for ${label}`);
    }
    entries.push({
      name: `circle-${letter}`,
      kind: 'shape',
      description: label ? `circle for set ${letter} (${label})` : `circle for set ${letter}`,
      labels: Array.from(labels),
    });
  }

  // Region hooks: must match the internal keyMap in the renderer.
  const twoSetKeys: Record<string, string> = {
    onlyA: 'only-A', onlyB: 'only-B',
    intersection: 'intersection-AB',
    neither: 'outside',
  };
  const threeSetKeys: Record<string, string> = {
    onlyA: 'only-A', onlyB: 'only-B', onlyC: 'only-C',
    AB: 'intersection-AB', AC: 'intersection-AC',
    BC: 'intersection-BC', ABC: 'intersection-ABC',
    neither: 'outside',
  };
  const keyMap = isThreeSet ? threeSetKeys : twoSetKeys;
  // Helper: build natural-language labels for a region slug.
  const labelsForRegion = (slug: string): Set<string> => {
    const out = new Set<string>([
      `region-${slug}`,
      `the ${slug.replace(/-/g, ' ')} region`,
    ]);
    const setA = setLabelByLetter['A'];
    const setB = setLabelByLetter['B'];
    const setC = setLabelByLetter['C'];
    if (slug === 'only-A') {
      out.add('only A');
      out.add('A only');
      out.add('only in A');
      out.add('set A only');
      out.add('A minus B');
      if (setA) out.add(`only ${setA}`);
      if (setA) out.add(`${setA} only`);
    } else if (slug === 'only-B') {
      out.add('only B');
      out.add('B only');
      out.add('only in B');
      out.add('set B only');
      out.add('B minus A');
      if (setB) out.add(`only ${setB}`);
      if (setB) out.add(`${setB} only`);
    } else if (slug === 'only-C') {
      out.add('only C');
      out.add('C only');
      out.add('only in C');
      out.add('set C only');
      if (setC) out.add(`only ${setC}`);
      if (setC) out.add(`${setC} only`);
    } else if (slug === 'intersection-AB') {
      out.add('A∩B');
      out.add('A and B');
      out.add('A intersect B');
      out.add('intersection of A and B');
      out.add('AB');
      out.add('A cap B');
      if (!isThreeSet) {
        out.add('intersection');
        out.add('the intersection');
        out.add('both');
        out.add('overlap');
      }
      if (setA && setB) {
        out.add(`${setA} and ${setB}`);
        out.add(`intersection of ${setA} and ${setB}`);
      }
    } else if (slug === 'intersection-AC') {
      out.add('A∩C');
      out.add('A and C');
      out.add('A intersect C');
      out.add('intersection of A and C');
      out.add('AC');
      if (setA && setC) out.add(`${setA} and ${setC}`);
    } else if (slug === 'intersection-BC') {
      out.add('B∩C');
      out.add('B and C');
      out.add('B intersect C');
      out.add('intersection of B and C');
      out.add('BC');
      if (setB && setC) out.add(`${setB} and ${setC}`);
    } else if (slug === 'intersection-ABC') {
      out.add('A∩B∩C');
      out.add('A and B and C');
      out.add('all three');
      out.add('intersection of all three');
      out.add('ABC');
      out.add('center');
      out.add('the center');
      if (setA && setB && setC) out.add(`${setA}, ${setB}, and ${setC}`);
    } else if (slug === 'outside') {
      out.add('outside');
      out.add('neither');
      out.add('universal set');
      out.add('neither set');
      out.add('complement');
      out.add('universe');
    }
    return out;
  };
  for (const [internalKey, slug] of Object.entries(keyMap)) {
    entries.push({
      name: `region-${slug}`,
      kind: 'region',
      description: `Venn region ${slug.replace(/-/g, ' ')}`,
      labels: Array.from(labelsForRegion(slug)),
    });
    const region = safeRegions[internalKey];
    const raw = region?.value?.trim();
    if (raw && /^\d+$/.test(raw)) {
      entries.push({
        name: `number-${raw}`,
        kind: 'annotation',
        description: `numeric label ${raw} shown in ${slug}`,
        labels: [`number-${raw}`, raw, `the number ${raw}`, `${raw}`, `value ${raw}`],
      });
    }
  }
  return entries;
}

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
          {mathifyDollarSpans(title)}
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
      {circles.map((c, i) => {
        const letter = String.fromCharCode(65 + i); // A, B, C
        return (
          <circle
            key={`circle-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill={c.color}
            fillOpacity={0.15}
            stroke={c.color}
            strokeWidth={2}
            {...feat(`circle-${letter}`, { cx: c.cx, cy: c.cy, w: c.r * 2 + 10, h: c.r * 2 + 10 }, { width: VB_W, height: VB_H })}
          />
        );
      })}

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

      {/* Feature hooks for regions (invisible, used by tutor scribble).
          Each region exposes TWO names:
            - region-<key>   (e.g. region-only-A, region-intersection-AB)
            - number-<value> (e.g. number-25 when that region's value is "25")
          so the tutor can map either "circle the Set-A-only region" or
          "circle the number 25" to the correct spot. */}
      {(() => {
        const centers = regionCenters as Record<string, { x: number; y: number }>;
        // Build a list of (featureName, bbox) pairs to render.
        const regionHooks: Array<[string, { x: number; y: number; w: number; h: number }]> = [];
        const twoSetKeys: Record<string, string> = {
          onlyA: 'only-A', onlyB: 'only-B',
          intersection: 'intersection-AB',
          neither: 'outside',
        };
        const threeSetKeys: Record<string, string> = {
          onlyA: 'only-A', onlyB: 'only-B', onlyC: 'only-C',
          AB: 'intersection-AB', AC: 'intersection-AC',
          BC: 'intersection-BC', ABC: 'intersection-ABC',
          neither: 'outside',
        };
        const sizes: Record<string, number> = {
          onlyA: 60, onlyB: 60, onlyC: 60,
          AB: 60, AC: 60, BC: 60, ABC: 60,
          intersection: 80, neither: 100,
        };
        const keyMap = isThreeSet ? threeSetKeys : twoSetKeys;
        for (const [internalKey, slug] of Object.entries(keyMap)) {
          const center = centers[internalKey];
          if (!center) continue;
          const side = sizes[internalKey] ?? 60;
          const bbox = {
            x: center.x, y: center.y,
            w: internalKey === 'neither' ? 100 : side,
            h: internalKey === 'neither' ? 60 : side,
          };
          regionHooks.push([`region-${slug}`, { x: bbox.x, y: bbox.y, w: bbox.w, h: bbox.h }]);
          // If the tutor supplied a numeric value for this region, also
          // expose number-<value> so "circle the number 25" works.
          const region = safeRegions[internalKey];
          const raw = region?.value?.trim();
          if (raw && /^\d+$/.test(raw)) {
            regionHooks.push([`number-${raw}`, { x: bbox.x, y: bbox.y, w: bbox.w, h: bbox.h }]);
          }
        }
        return regionHooks.map(([name, b]) => (
          <g key={name} {...feat(name, { cx: b.x, cy: b.y, w: b.w, h: b.h }, { width: VB_W, height: VB_H })} />
        ));
      })()}
    </svg>
  );
}

export default VennDiagramRenderer;
