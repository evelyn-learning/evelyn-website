/**
 * SmoothDraw Phase 3 — pure note slot engine.
 *
 * All spatial reasoning for on-board tutor notes lives here: given the
 * target's rect, everything already occupying the page, the page bounds,
 * and the measured note size, pick the first fitting slot in a fixed
 * order (right → above → below → left → margin column). The margin
 * column NEVER fails: it clamps into the page's right edge below any
 * occupant. Notes must never overlap content — the 2026-05-13 lesson
 * that created the AnnotationStrip; this engine is what makes on-board
 * notes safe enough to retire it.
 *
 * Pure and deterministic: DOM measurement happens in the caller
 * (InkNotesOverlay live; whiteboard-capture for PDFs).
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type NoteSlot = 'right' | 'above' | 'below' | 'left' | 'margin';
export type Placement = { rect: Rect; slot: NoteSlot };

export function rectsOverlap(a: Rect, b: Rect, pad = 0): boolean {
  return a.x - pad < b.x + b.w && a.x + a.w + pad > b.x && a.y - pad < b.y + b.h && a.y + a.h + pad > b.y;
}

const GAP = 8;          // breathing room between a note and its target
const CLEAR_PAD = 4;    // minimum clearance from other occupants
const MARGIN_W = 12;    // inset from the page's right edge for the margin column

function inside(page: Rect, r: Rect): boolean {
  return r.x >= page.x && r.y >= page.y && r.x + r.w <= page.x + page.w && r.y + r.h <= page.y + page.h;
}

function clear(r: Rect, occupied: Rect[], target: Rect | null): boolean {
  if (target && rectsOverlap(r, target, CLEAR_PAD)) return false;
  return occupied.every((o) => !rectsOverlap(r, o, CLEAR_PAD));
}

export function placeNote(input: {
  target: Rect | null;
  occupied: Rect[];
  page: Rect;
  note: { w: number; h: number };
  gap?: number;
}): Placement {
  const { target, occupied, page, note } = input;
  const gap = input.gap ?? GAP;

  if (target) {
    const candidates: Array<{ slot: NoteSlot; rect: Rect }> = [
      { slot: 'right', rect: { x: target.x + target.w + gap, y: target.y + target.h / 2 - note.h / 2, w: note.w, h: note.h } },
      { slot: 'above', rect: { x: target.x + target.w / 2 - note.w / 2, y: target.y - gap - note.h, w: note.w, h: note.h } },
      { slot: 'below', rect: { x: target.x + target.w / 2 - note.w / 2, y: target.y + target.h + gap, w: note.w, h: note.h } },
      { slot: 'left', rect: { x: target.x - gap - note.w, y: target.y + target.h / 2 - note.h / 2, w: note.w, h: note.h } },
    ];
    for (const c of candidates) {
      // Nudge horizontally-centered slots back inside the page before
      // testing (a wide note above a left-edge target shouldn't fail
      // solely on the x clamp), but never nudge INTO the target.
      const r = { ...c.rect };
      if (c.slot === 'above' || c.slot === 'below') {
        r.x = Math.min(Math.max(r.x, page.x), page.x + page.w - r.w);
      }
      if (inside(page, r) && clear(r, occupied, target)) return { slot: c.slot, rect: r };
    }
  }

  // Margin column: right edge, stacked below whatever already occupies
  // the column. Scan down in note-height steps; if the page is truly
  // full, clamp to the bottom (overlap the least-bad way — never returns
  // failure, the round-7 silent-drop philosophy applied to placement).
  const x = page.x + page.w - note.w - MARGIN_W;
  let y = page.y + MARGIN_W;
  const step = note.h + CLEAR_PAD * 2;
  while (y + note.h <= page.y + page.h) {
    const r: Rect = { x, y, w: note.w, h: note.h };
    if (clear(r, occupied, target)) return { slot: 'margin', rect: r };
    y += step;
  }
  return { slot: 'margin', rect: { x, y: page.y + page.h - note.h, w: note.w, h: note.h } };
}
