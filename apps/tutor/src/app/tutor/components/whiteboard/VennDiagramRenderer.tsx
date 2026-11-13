'use client';

import { mathifyDollarSpans } from '@/lib/utils/export/latex-readable';
/**
 * Venn Diagram Renderer
 *
 * Renders 2-set or 3-set Venn diagrams using pure SVG.
 * Supports region highlighting, value/item display, and a universal set rectangle.
 */

import { useId, useMemo } from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
// Width-aware label helpers (FractionBar fix, commit 009dc645) — set labels
// and region items sit at hand-tuned anchors in a fixed 500×400 viewBox, so
// long strings clipped at the edges. They now wrap and clamp into the box.
import { estimateLabelWidth, wrapLabel } from './fraction-bar-layout';

const VB_W = 500;
const VB_H = 400;
/** Keep clamped text off the universal-set rectangle stroke (x=10). */
const EDGE_PAD = 12;

/** Clamp a text center-x so the estimated extent stays inside the viewBox. */
function clampCenterX(x: number, estWidth: number): number {
  const half = estWidth / 2;
  if (VB_W - EDGE_PAD - half < EDGE_PAD + half) return VB_W / 2;
  return Math.max(EDGE_PAD + half, Math.min(x, VB_W - EDGE_PAD - half));
}

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
  A: { cx: 195, cy: 178, r: 100 },
  B: { cx: 305, cy: 178, r: 100 },
  C: { cx: 250, cy: 272, r: 100 },
};

type Circle = { cx: number; cy: number; r: number };
/** Which circles a region lies inside (the rest it lies outside). */
const TWO_SET_MEMBERS: Record<TwoSetRegionKey, boolean[]> = {
  onlyA: [true, false], onlyB: [false, true], intersection: [true, true], neither: [false, false],
};
const THREE_SET_MEMBERS: Record<ThreeSetRegionKey, boolean[]> = {
  onlyA: [true, false, false], onlyB: [false, true, false], onlyC: [false, false, true],
  AB: [true, true, false], AC: [true, false, true], BC: [false, true, true], ABC: [true, true, true],
  neither: [false, false, false],
};

/**
 * Where a region's text goes: the true centre of mass of the region, found by
 * sampling the board. (Hand-tuned anchors put the A∩B text of a 3-set diagram
 * on circle C's edge.) "Outside every circle" has no useful centre, so its
 * text sits in the lower-left corner of the universal set.
 */
function regionCentres<K extends string>(circles: Circle[], members: Record<K, boolean[]>): Record<K, { x: number; y: number }> {
  const acc = {} as Record<K, { sx: number; sy: number; n: number }>;
  const keys = Object.keys(members) as K[];
  for (const k of keys) acc[k] = { sx: 0, sy: 0, n: 0 };
  for (let x = 2; x < VB_W; x += 4) {
    for (let y = 2; y < VB_H; y += 4) {
      const inside = circles.map((c) => (x - c.cx) ** 2 + (y - c.cy) ** 2 <= c.r * c.r);
      const k = keys.find((key) => members[key].every((m, i) => m === inside[i]));
      if (k) { acc[k].sx += x; acc[k].sy += y; acc[k].n += 1; }
    }
  }
  const out = {} as Record<K, { x: number; y: number }>;
  for (const k of keys) {
    out[k] = k === 'neither' || acc[k].n === 0
      ? { x: 78, y: VB_H - 46 }
      : { x: acc[k].sx / acc[k].n, y: acc[k].sy / acc[k].n };
  }
  return out;
}

const TWO_SET_REGION_CENTERS = regionCentres([TWO_SET.A, TWO_SET.B], TWO_SET_MEMBERS);
const THREE_SET_REGION_CENTERS = regionCentres([THREE_SET.A, THREE_SET.B, THREE_SET.C], THREE_SET_MEMBERS);
/** Widest line of item text that fits each kind of region (viewBox units). */
const REGION_TEXT_WIDTH: Record<string, number> = {
  onlyA: 96, onlyB: 96, onlyC: 120, AB: 64, AC: 58, BC: 58, ABC: 62, intersection: 84, neither: 128,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Render the text content for a single region (value and/or items). */
function RegionText({
  x,
  y,
  region,
  maxWidth = 130,
}: {
  x: number;
  y: number;
  region: VennRegion;
  maxWidth?: number;
}) {
  const hasValue = region.value !== undefined && region.value !== '';
  const hasItems = region.items && region.items.length > 0;
  if (!hasValue && !hasItems) return null;

  // Wrap the items list and clamp every line into the viewBox — region
  // anchors are hand-tuned (`neither` sits at x=60), so long item lists
  // clipped at the left/right edge. wrapLabel estimates at 13px; scale the
  // ~130u cap into estimator units for the 11px items font.
  const itemLines = hasItems ? wrapLabel(region.items!.join(', '), (maxWidth * 13) / 11.5) : [];
  // The block (value + item lines) is centred on the region's centre.
  const blockShift = hasItems ? ((itemLines.length - 1) * 13) / 2 : 0;
  const valueX = hasValue ? clampCenterX(x, estimateLabelWidth(region.value!, 14)) : x;

  return (
    <g>
      {/* Primary value */}
      {hasValue && (
        <text
          x={valueX}
          y={hasItems ? y - 9 - blockShift : y}
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
          y={(hasValue ? y + 9 : y) - blockShift}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11.5}
          fill="#334155"
        >
          {itemLines.map((line, li) => {
            const lineX = clampCenterX(x, estimateLabelWidth(line, 11.5));
            return (
              <tspan key={li} x={lineX} dy={li === 0 ? 0 : 13}>
                {line}
              </tspan>
            );
          })}
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
  const regionCenters: Record<string, { x: number; y: number }> = isThreeSet ? THREE_SET_REGION_CENTERS : TWO_SET_REGION_CENTERS;
  const regionMembers: Record<string, boolean[]> = isThreeSet ? THREE_SET_MEMBERS : TWO_SET_MEMBERS;
  const uid = `venn${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  /** Label positions — placed just above or beside each circle */
  const labelPositions = useMemo(() => {
    if (isThreeSet) {
      return [
        { x: THREE_SET.A.cx - 50, y: THREE_SET.A.cy - THREE_SET.A.r - 9 }, // A: top-left
        { x: THREE_SET.B.cx + 50, y: THREE_SET.B.cy - THREE_SET.B.r - 9 }, // B: top-right
        // C: beside its lower-right shoulder (below it there is no room left in the frame)
        { x: THREE_SET.C.cx + THREE_SET.C.r + 62, y: THREE_SET.C.cy + 64 },
      ];
    }
    return [
      { x: TWO_SET.A.cx, y: TWO_SET.A.cy - TWO_SET.A.r - 12 }, // A: above
      { x: TWO_SET.B.cx, y: TWO_SET.B.cy - TWO_SET.B.r - 12 }, // B: above
    ];
  }, [isThreeSet]);

  return (
    <div className="venn-diagram-renderer w-full flex flex-col items-center">
      {/* Title as HTML above the svg — R38: centered SVG text in the fixed 500u viewBox clipped long titles on both sides */}
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 text-center">{mathifyDollarSpans(title)}</h3>
      )}
    <svg
      viewBox="0 0 500 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[620px]"
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

      {/* Highlight fills: the REGION itself (inside some circles, outside the
          others), not a blob at its centre. Drawn under the circle strokes. */}
      <defs>
        {circles.map((c, i) => (
          <clipPath key={i} id={`${uid}-in-${i}`}><circle cx={c.cx} cy={c.cy} r={c.r} /></clipPath>
        ))}
      </defs>
      {Object.entries(safeRegions).map(([key, region]) => {
        if (!region?.highlight) return null;
        const members = (regionMembers as Record<string, boolean[]>)[key];
        if (!members) return null;
        const outside = circles.map((_, i) => i).filter((i) => !members[i]);
        const inside = circles.map((_, i) => i).filter((i) => members[i]);
        const maskId = `${uid}-out-${key}`;
        let node = <rect x={10} y={10} width={480} height={380} rx={8} fill="#fbbf24" fillOpacity={0.5} mask={outside.length ? `url(#${maskId})` : undefined} />;
        for (const i of inside) node = <g clipPath={`url(#${uid}-in-${i})`}>{node}</g>;
        return (
          <g key={`highlight-${key}`}>
            {outside.length > 0 && (
              <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={VB_W} height={VB_H}>
                <rect x={0} y={0} width={VB_W} height={VB_H} fill="#fff" />
                {outside.map((i) => <circle key={i} cx={circles[i].cx} cy={circles[i].cy} r={circles[i].r} fill="#000" />)}
              </mask>
            )}
            {node}
          </g>
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

      {/* Set labels — wrapped and clamped: the anchors are hand-tuned
          (3-set B sits at x=360), so long labels clipped at the viewBox
          edge. Lines stack UP from the anchor so the label stays above
          (A/B) or just below (C) its circle. */}
      {circles.map((c, i) => {
        const lines = wrapLabel(c.label ?? '', ((isThreeSet ? (i === 2 ? 118 : 150) : 190) * 13) / 14);
        const firstY = isThreeSet && i === 2 ? labelPositions[i].y : labelPositions[i].y - (lines.length - 1) * 15;
        return (
          <text
            key={`label-${i}`}
            x={labelPositions[i].x}
            y={firstY}
            textAnchor="middle"
            fontSize={14}
            fontWeight={600}
            fill={c.color}
          >
            {lines.map((line, li) => {
              const lineX = clampCenterX(labelPositions[i].x, estimateLabelWidth(line, 14));
              return (
                <tspan key={li} x={lineX} dy={li === 0 ? 0 : 15}>
                  {line}
                </tspan>
              );
            })}
          </text>
        );
      })}

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
            maxWidth={REGION_TEXT_WIDTH[key]}
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
    </div>
  );
}

export default VennDiagramRenderer;
