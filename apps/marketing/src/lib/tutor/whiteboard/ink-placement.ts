/**
 * SmoothDraw Phase 3 — pure note slot engine.
 *
 * All spatial reasoning for on-board tutor notes lives here: given the
 * target's rect, everything already occupying the page, the page bounds,
 * and the measured note size, pick the first fitting slot in a fixed
 * order (right → above → below → left → margin column). The margin
 * column NEVER fails: when no in-page row is clear it EXTENDS the page
 * downward (below the bottom-most occupant in the column's x-band), and
 * its x clamps to the left page edge when the note is wider than the
 * page minus the margin inset (narrow hosts) — width overflow beyond
 * the page, and growing the host to reveal a downward extension, are
 * the caller's concern. Notes must never overlap content — the 2026-05-13 lesson
 * that created the AnnotationStrip; this engine is what makes on-board
 * notes safe enough to retire it.
 *
 * Pure and deterministic: DOM measurement happens in the caller
 * (InkNotesOverlay live; whiteboard-capture for PDFs).
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type NoteSlot = 'right' | 'above' | 'below' | 'left' | 'margin' | 'user';
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
  // the column. Scan down in note-height steps. If the page is truly
  // full, EXTEND it: place below the page bottom, under the bottom-most
  // occupant in the margin column's x-band. (The prior fixed
  // bottom-clamp ignored `occupied`, so any two exhausted-scan notes
  // landed on identical pixels — the 2026-07-11 gate's turn-2 overlap.
  // Extension keeps the never-fails philosophy AND the zero-overlap
  // invariant; the caller grows the host to reveal the extension — see
  // InkNotesOverlay's overflow spacer.) Monotonic by construction: each
  // extension note enters `occupied` for its successors, so the next
  // extension y is strictly greater.
  const x = Math.max(page.x, page.x + page.w - note.w - MARGIN_W);
  let y = page.y + MARGIN_W;
  const step = note.h + CLEAR_PAD * 2;
  while (y + note.h <= page.y + page.h) {
    const r: Rect = { x, y, w: note.w, h: note.h };
    if (clear(r, occupied, target)) return { slot: 'margin', rect: r };
    y += step;
  }
  const bandBottom = occupied.reduce(
    (b, o) => (o.x < x + note.w + CLEAR_PAD && o.x + o.w > x - CLEAR_PAD ? Math.max(b, o.y + o.h) : b),
    page.y + page.h,
  );
  return { slot: 'margin', rect: { x, y: bandBottom + CLEAR_PAD, w: note.w, h: note.h } };
}

/** Clamp `value` (a position along one axis) into [pageMin, pageMin +
 *  pageSize - itemSize] — but never below pageMin. Order matters: the
 *  naive `Math.min(Math.max(value, pageMin), pageMin + pageSize -
 *  itemSize)` inverts when `itemSize > pageSize` (the upper bound then
 *  sits BELOW pageMin), so the Math.min silently wins with the lower
 *  bound and the result lands before pageMin — e.g. a note wider than
 *  the page drags to a negative x. The outer Math.max re-asserts the
 *  near-edge floor: an oversized item pins to pageMin (allowed to
 *  overflow the FAR edge, since it can't fit either way) but never
 *  crosses the near one. Shared by applyUserPos below and
 *  InkNotesOverlay's live-drag clamp (dragPosFromClient) so both paths
 *  get the guard from one tested place. */
export function clampIntoPage(value: number, pageMin: number, pageSize: number, itemSize: number): number {
  return Math.max(pageMin, Math.min(Math.max(value, pageMin), pageMin + pageSize - itemSize));
}

/** R2 E3: a user-dragged note's stored offset → concrete rect. Offset is
 *  target-relative (anchor present) or page-origin-relative (margin note).
 *  Always clamped fully inside the page so a drag can never strand a note
 *  off-canvas after a reflow shrinks the page. */
export function applyUserPos(
  cache: { anchor: Rect | null },
  userPos: { dx: number; dy: number },
  size: { w: number; h: number },
  page: Rect,
): Rect {
  const baseX = cache.anchor ? cache.anchor.x : page.x;
  const baseY = cache.anchor ? cache.anchor.y : page.y;
  const x = clampIntoPage(baseX + userPos.dx, page.x, page.w, size.w);
  const y = clampIntoPage(baseY + userPos.dy, page.y, page.h, size.h);
  return { x, y, w: size.w, h: size.h };
}
