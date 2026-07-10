/**
 * SmoothDraw Phase 1 — pure draw-on planner (no DOM).
 *
 * Computes an animation timeline for a newly mounted whiteboard item.
 * The DOM walking + Web Animations application live in the client hook
 * (useDrawOn.ts); keeping this module pure makes the timing math fully
 * unit-testable (npm run test:draw-on).
 *
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md
 * Budget: clamp(800, 80 × strokeCount, 1500) ms. Strokes stagger with
 * overlap so the item reads as ONE continuous drawing; fills/text fade
 * in as the stroke immediately before them (document order) completes.
 * Above STROKE_BATCH strokes, strokes share start slots so dense
 * figures still finish inside the ceiling.
 *
 * totalMs is the TRUE animation end (the stroke budget, extended by any
 * trailing fade) — downstream queue spacing depends on it.
 */

export type Drawable = { kind: 'stroke'; length: number } | { kind: 'fill' };
export type DrawStep = { index: number; delayMs: number; durMs: number; mode: 'stroke' | 'fade' };
export type DrawPlan = { steps: DrawStep[]; totalMs: number };

export const IFRAME_FADE_MS = 300;
export const SERIAL_SPACING_MS = 300;
export const STROKE_BATCH = 40;

const FLOOR_MS = 800;
const CEIL_MS = 1500;
const PER_STROKE_MS = 80;
const FADE_MS = 250;

function budgetFor(strokeCount: number): number {
  if (strokeCount === 0) return FLOOR_MS;
  return Math.max(FLOOR_MS, Math.min(CEIL_MS, strokeCount * PER_STROKE_MS));
}

export function planSvgDrawOn(drawables: Drawable[]): DrawPlan {
  if (drawables.length === 0) return { steps: [], totalMs: 0 };
  const strokeIdx = drawables
    .map((d, i) => ({ d, i }))
    .filter((x) => x.d.kind === 'stroke')
    .map((x) => x.i);
  const n = strokeIdx.length;
  const total = budgetFor(n);

  const steps: DrawStep[] = [];
  // Slot count: one per stroke up to STROKE_BATCH, then strokes share.
  const slots = Math.max(1, Math.min(n, STROKE_BATCH));
  // Each stroke draws for durPer; slot starts spread so the LAST slot
  // ends exactly at `total`, and consecutive slots overlap (~40%).
  const durPer = slots === 1 ? total : Math.min(600, Math.max(120, (total / slots) * 1.6));
  const lastStart = total - durPer;
  const slotStart = (slot: number) => (slots === 1 ? 0 : Math.round((lastStart * slot) / (slots - 1)));

  const strokeEnd = new Map<number, number>(); // drawable index → end time
  strokeIdx.forEach((di, k) => {
    const slot = Math.floor((k * slots) / n); // batches strokes into slots when n > slots
    const delayMs = slotStart(slot);
    const durMs = slot === slots - 1 ? total - delayMs : durPer;
    steps.push({ index: di, delayMs, durMs, mode: 'stroke' });
    strokeEnd.set(di, delayMs + durMs);
  });

  // Fills fade in when the nearest PRECEDING stroke (document order)
  // completes; a fill before any stroke fades at t=0.
  drawables.forEach((d, di) => {
    if (d.kind !== 'fill') return;
    let precedingEnd = 0;
    for (let j = di - 1; j >= 0; j--) {
      if (strokeEnd.has(j)) { precedingEnd = strokeEnd.get(j)!; break; }
    }
    steps.push({ index: di, delayMs: precedingEnd, durMs: FADE_MS, mode: 'fade' });
  });

  steps.sort((a, b) => a.index - b.index);
  // totalMs must be the TRUE animation end: a fill trailing the last
  // stroke fades past the stroke budget, and downstream queue spacing
  // (Task 2's hook) schedules the next item off totalMs.
  const maxEnd = steps.reduce((m, s) => Math.max(m, s.delayMs + s.durMs), 0);
  return { steps, totalMs: Math.max(total, maxEnd) };
}

export function planHtmlWipe(rowCount: number): DrawPlan {
  const rows = Math.max(1, rowCount);
  const total = Math.max(FLOOR_MS, Math.min(CEIL_MS, rows * 200));
  const durPer = rows === 1 ? total : Math.min(500, (total / rows) * 1.6);
  const lastStart = total - durPer;
  const steps: DrawStep[] = Array.from({ length: rows }, (_, i) => {
    const delayMs = rows === 1 ? 0 : Math.round((lastStart * i) / (rows - 1));
    const durMs = i === rows - 1 ? total - delayMs : durPer;
    return { index: i, delayMs, durMs, mode: 'fade' as const };
  });
  return { steps, totalMs: total };
}
