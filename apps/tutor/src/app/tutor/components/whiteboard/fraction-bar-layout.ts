/**
 * FractionBar width-aware layout — pure module (2026-08-07,
 * embed-1786139818867).
 *
 * The renderer used to size its viewBox from the SHAPES alone, then center
 * each item's label under its shape inside the SVG. A single grid item
 * (2×2 → 56 units) produced a ~104-unit viewBox, so the 13px label
 * "One planted square out of four" (~190 units) clipped on BOTH sides to
 * "anted square out". This is the same disease R38 fixed for the title by
 * moving it to an HTML <h3>; per-item labels must stay in the SVG (they sit
 * under each item in SVG space), so instead the layout now accounts for
 * label width: long labels wrap at LABEL_WRAP_WIDTH, the item box grows to
 * the wrapped label's widest line, and the shape centers inside its box.
 *
 * Width estimation is a character-count heuristic (no canvas/DOM in the
 * layout pass — this module is also exercised headless by the unit suite);
 * the 0.55em average glyph factor deliberately over-estimates so a label
 * never clips at the cost of a little whitespace.
 *
 * Tests: npx tsx scripts/test-fraction-bar-layout.ts
 */

export interface FractionLayoutInput {
  numerator: number;
  denominator: number;
  label?: string;
  style?: 'bar' | 'circle' | 'grid';
}

export interface FractionLayoutItem {
  /** Item box (shape + label footprint). */
  x: number; y: number; w: number; h: number;
  /** Shape origin/size — centered inside the item box when the label is wider. */
  shapeX: number; shapeY: number; shapeW: number; shapeH: number;
  /** Wrapped label lines (always ≥1). */
  labelLines: string[];
  /** Center-x for the label text and y of the FIRST line's baseline. */
  labelX: number; labelY: number;
}

export const BAR_WIDTH = 160;
export const BAR_HEIGHT = 32;
export const CIRCLE_RADIUS = 48;
export const GRID_CELL = 28;
export const ITEM_GAP = 40;
export const PADDING = 24;
export const LABEL_OFFSET = 22;
export const LABEL_FONT_SIZE = 13;
export const LABEL_LINE_HEIGHT = 15;
/** Max estimated line width before the label wraps to another line. */
export const LABEL_WRAP_WIDTH = 240;
/** A horizontal row wider than this wraps onto a new row. */
export const MAX_ROW_WIDTH = 600;

/** Average-glyph width heuristic for system-ui @ font-weight 500. */
export function estimateLabelWidth(text: string, fontSize: number = LABEL_FONT_SIZE): number {
  return text.length * fontSize * 0.55;
}

/** Greedy word wrap on the estimated width. A single word longer than the
 *  cap gets its own (over-cap) line — the item box grows to fit it. */
export function wrapLabel(text: string, maxWidth: number = LABEL_WRAP_WIDTH): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let line = words[0];
  for (const word of words.slice(1)) {
    const candidate = `${line} ${word}`;
    if (estimateLabelWidth(candidate) <= maxWidth) line = candidate;
    else { lines.push(line); line = word; }
  }
  lines.push(line);
  return lines;
}

/** Gap between the wholes of one improper fraction (5/4 = two shapes). */
export const WHOLE_GAP = 10;

/** How many whole shapes a fraction needs: 3/4 → 1, 5/4 → 2, 8/4 → 2. */
export function wholesFor(numerator: number, denominator: number): number {
  if (!(denominator > 0) || !(numerator > 0)) return 1;
  return Math.max(1, Math.min(6, Math.ceil(numerator / denominator - 1e-9)));
}

/** Rows × cols for a grid of `total` equal cells. A full rectangle whenever
 *  the count factors into one (8 → 2×4, 12 → 3×4, 100 → 10×10); a single row
 *  for small primes; otherwise the nearest-square layout with a short last row. */
export function gridDimensions(total: number): { rows: number; cols: number } {
  if (!(total >= 1)) return { rows: 1, cols: 1 };
  let rows = 1;
  for (let r = Math.floor(Math.sqrt(total)); r >= 1; r--) {
    if (total % r === 0) { rows = r; break; }
  }
  const cols = total / rows;
  if (cols <= 10 && cols / rows <= 5) return { rows, cols };
  if (rows === 1 && cols <= 7) return { rows, cols };
  const c = Math.ceil(Math.sqrt(total));
  return { rows: Math.ceil(total / c), cols: c };
}

/** Grid cell edge: full size for small grids, smaller for big ones so a
 *  hundred-grid does not dwarf the shapes beside it. */
export function gridCell(denominator: number): number {
  const { rows, cols } = gridDimensions(denominator);
  const side = Math.max(rows, cols);
  return side <= 5 ? GRID_CELL : Math.max(14, Math.floor((GRID_CELL * 5.5) / side));
}

export function itemShapeSize(item: FractionLayoutInput): { w: number; h: number } {
  const style = item.style ?? 'bar';
  // An improper fraction is several wholes side by side.
  const n = wholesFor(item.numerator, item.denominator);
  const span = (w: number) => n * w + (n - 1) * WHOLE_GAP;
  if (style === 'bar') return { w: span(BAR_WIDTH), h: BAR_HEIGHT };
  if (style === 'circle') return { w: span(CIRCLE_RADIUS * 2), h: CIRCLE_RADIUS * 2 };
  const { rows, cols } = gridDimensions(item.denominator);
  const cell = gridCell(item.denominator);
  return { w: span(cols * cell), h: rows * cell };
}

export function computeFractionLayout(
  items: FractionLayoutInput[],
  layout: 'vertical' | 'horizontal',
): { positions: FractionLayoutItem[]; viewWidth: number; viewHeight: number } {
  const positions: FractionLayoutItem[] = [];
  let cursorX = PADDING;
  let cursorY = PADDING;
  let maxW = 0;
  let maxH = 0;
  let rowTop = PADDING;
  let rowH = 0;

  for (const item of items) {
    const { w: shapeW, h: shapeH } = itemShapeSize(item);
    const labelText = item.label ?? `${item.numerator}/${item.denominator}`;
    const labelLines = wrapLabel(labelText);
    const labelW = Math.max(...labelLines.map((l) => estimateLabelWidth(l)));
    const w = Math.max(shapeW, labelW);
    // Label footprint below the shape: first line inside LABEL_OFFSET (as
    // before), each extra line adds LABEL_LINE_HEIGHT.
    const labelExtra = (labelLines.length - 1) * LABEL_LINE_HEIGHT;
    const h = shapeH + LABEL_OFFSET + labelExtra;

    // Horizontal rows wrap: an item that would push the row past
    // MAX_ROW_WIDTH starts a new row, so five shapes side by side are not
    // shrunk to fit one line.
    if (layout === 'horizontal' && cursorX > PADDING && cursorX + w + PADDING > MAX_ROW_WIDTH) {
      cursorX = PADDING;
      rowTop += rowH + ITEM_GAP * 0.6;
      rowH = 0;
    }
    const x = layout === 'horizontal' ? cursorX : PADDING;
    const y = layout === 'horizontal' ? rowTop : cursorY;
    const shapeX = x + (w - shapeW) / 2;
    const shapeY = y;
    positions.push({
      x, y, w, h,
      shapeX, shapeY, shapeW, shapeH,
      labelLines,
      labelX: x + w / 2,
      labelY: shapeY + shapeH + LABEL_OFFSET - 4,
    });

    if (layout === 'horizontal') {
      cursorX += w + ITEM_GAP;
      rowH = Math.max(rowH, h);
      maxW = Math.max(maxW, cursorX - ITEM_GAP + PADDING);
      maxH = Math.max(maxH, y + h + PADDING);
    } else {
      cursorY += h + ITEM_GAP;
      maxW = Math.max(maxW, x + w + PADDING);
      maxH = cursorY;
    }
  }

  if (layout !== 'horizontal') maxH += PADDING - ITEM_GAP;

  return {
    positions,
    viewWidth: Math.max(maxW, 100),
    viewHeight: Math.max(maxH, 80),
  };
}
