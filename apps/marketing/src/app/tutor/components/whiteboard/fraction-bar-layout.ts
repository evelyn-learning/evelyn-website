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

export function gridDimensions(total: number): { rows: number; cols: number } {
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  return { rows, cols };
}

export function itemShapeSize(item: FractionLayoutInput): { w: number; h: number } {
  const style = item.style ?? 'bar';
  if (style === 'bar') return { w: BAR_WIDTH, h: BAR_HEIGHT };
  if (style === 'circle') return { w: CIRCLE_RADIUS * 2, h: CIRCLE_RADIUS * 2 };
  const { rows, cols } = gridDimensions(item.denominator);
  return { w: cols * GRID_CELL, h: rows * GRID_CELL };
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

    const x = layout === 'horizontal' ? cursorX : PADDING;
    const y = layout === 'horizontal' ? PADDING : cursorY;
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
      maxW = cursorX;
      maxH = Math.max(maxH, y + h + PADDING);
    } else {
      cursorY += h + ITEM_GAP;
      maxW = Math.max(maxW, x + w + PADDING);
      maxH = cursorY;
    }
  }

  if (layout === 'horizontal') maxW += PADDING - ITEM_GAP;
  else maxH += PADDING - ITEM_GAP;

  return {
    positions,
    viewWidth: Math.max(maxW, 100),
    viewHeight: Math.max(maxH, 80),
  };
}
