/**
 * Pure geometry for the historical_timeline renderer — the single source of
 * truth shared by CatalogHistoricalTimelineRenderer (drawing) and
 * solveHistoricalTimeline (collision-driven evenSpace decision). Exercised
 * by scripts/test-timeline-layout.ts.
 *
 * Why it exists (2026-08-17 triage, portal-35b9a5d8): proportional-by-year
 * placement squeezes dense spans — 5 events across 1781-1788, two sharing a
 * year — into overlapping 156px boxes. The layout is deterministic, so the
 * brain re-rendering the same events could never fix it, and evenSpace was
 * only set for unparseable dates. shouldEvenSpaceTimeline runs the actual
 * box geometry and flips to even spacing whenever proportional placement
 * collides.
 */

export interface TimelineLayoutBox {
  /** Dot position on the axis. */
  x: number;
  /** Left edge of the label box (already clamped into the viewBox). */
  boxX: number;
  /** Vertical center of the label box (already clamped). */
  labelY: number;
}

export const TIMELINE_GEOM = {
  W: 760,
  H: 320,
  PAD: 40,
  BOX_W: 156,
  BOX_H: 52,
  BASE_Y: 200,
  ALT_OFFSETS: [-100, 70, -70, 100, -80, 80],
} as const;

/** Mirrors the renderer's placement exactly, degenerate cases included:
 *  a single event or a zero-year span always falls back to even spacing. */
export function layoutTimelineEvents(
  events: Array<{ year: number }>,
  evenSpace: boolean,
): TimelineLayoutBox[] {
  const { W, H, PAD, BOX_W, BOX_H, BASE_Y, ALT_OFFSETS } = TIMELINE_GEOM;
  const usableW = W - PAD * 2;
  const years = events.map((e) => e.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const span = maxY - minY || 1;
  const even = evenSpace || maxY <= minY || events.length === 1;
  return events.map((e, i) => {
    const x = even
      ? PAD + (events.length === 1 ? usableW / 2 : (i / (events.length - 1)) * usableW)
      : PAD + ((e.year - minY) / span) * usableW;
    const labelYRaw = BASE_Y + ALT_OFFSETS[i % ALT_OFFSETS.length];
    const labelY = Math.max(BOX_H / 2 + 4, Math.min(H - BOX_H / 2 - 4, labelYRaw));
    const boxX = Math.max(4, Math.min(W - BOX_W - 4, x - BOX_W / 2));
    return { x, boxX, labelY };
  });
}

/** True when any two label boxes strictly overlap under the given spacing
 *  mode. Touching edges do not count — only real overlap. */
export function timelineHasCollisions(
  events: Array<{ year: number }>,
  evenSpace: boolean,
): boolean {
  const { BOX_W, BOX_H } = TIMELINE_GEOM;
  const boxes = layoutTimelineEvents(events, evenSpace);
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const xOverlap = a.boxX < b.boxX + BOX_W && b.boxX < a.boxX + BOX_W;
      const yOverlap = a.labelY - BOX_H / 2 < b.labelY + BOX_H / 2 && b.labelY - BOX_H / 2 < a.labelY + BOX_H / 2;
      if (xOverlap && yOverlap) return true;
    }
  }
  return false;
}

/** The solver's rule: flip to even spacing when proportional placement
 *  collides. Even spacing is never worse — same boxes, maximal separation
 *  — so a still-colliding even layout (very high event counts) keeps the
 *  flag too. */
export function shouldEvenSpaceTimeline(events: Array<{ year: number }>): boolean {
  return timelineHasCollisions(events, false);
}
