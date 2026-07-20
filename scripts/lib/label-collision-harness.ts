/**
 * Shared assertion machinery for the renderer label-collision battery
 * (scripts/test-renderer-label-collision.ts). Fixtures live one file per
 * renderer under scripts/label-collision-fixtures/ — the runner
 * auto-discovers them, so parallel retrofits never edit a shared file.
 *
 * A fixture renders a real component server-side; we parse every <text>
 * element out of the SVG string, estimate bboxes with the same char-width
 * heuristic label-deoverlap uses, and assert: no label-label overlap, no
 * label outside the viewbox, and (opt-in) no label crossing an
 * arrow/marker shaft.
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export interface LabelFixture {
  /** Unique test-case name, e.g. 'pendulum-two-labels'. */
  name: string;
  element: React.ReactElement;
  viewbox: { w: number; h: number };
  /** Also assert labels stay off <line marker-end> arrow shafts. */
  checkArrows?: boolean;
  /** Estimated-bbox pairs allowed to touch (rare deliberate composites).
   *  Each entry is a [contentA, contentB] pair matched by exact text. */
  allowOverlap?: Array<[string, string]>;
}

interface TextBox {
  content: string;
  left: number; right: number; top: number; bottom: number;
}

const CHAR_W = 0.55;
const LINE_H = 1.1;

/** renderToStaticMarkup escapes ' " < > & into entities; measure the glyphs
 *  actually rendered, not the escape sequence ("F&#x27;" is 2 glyphs, not 7). */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function parseTextBoxes(svg: string): TextBox[] {
  const boxes: TextBox[] = [];
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) {
    const attrs = m[1];
    const content = decodeEntities(m[2].replace(/<[^>]+>/g, '').trim());
    if (!content) continue;
    const attr = (name: string): string | null => {
      const am = attrs.match(new RegExp(`${name}="([^"]*)"`));
      return am ? am[1] : null;
    };
    const x = parseFloat(attr('x') ?? '0');
    const y = parseFloat(attr('y') ?? '0');
    const fontSize = parseFloat(attr('font-size') ?? attr('fontSize') ?? '12');
    const anchor = attr('text-anchor') ?? 'start';
    const baseline = attr('dominant-baseline') ?? 'alphabetic';
    const w = content.length * fontSize * CHAR_W;
    const h = fontSize * LINE_H;
    const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    const top = baseline === 'middle' ? y - h / 2 : y - h * 0.8;
    boxes.push({ content, left, right: left + w, top, bottom: top + h });
  }
  return boxes;
}

function intersects(a: TextBox, b: TextBox): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

/** Arrow shafts: <line> elements carrying a marker-end arrowhead.
 *  (React emits <line ...></line>, not a self-closing tag.) */
function parseArrowBoxes(svg: string): TextBox[] {
  const boxes: TextBox[] = [];
  const re = /<line\b([^>]*marker-end[^>]*)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) {
    const attrs = m[1];
    const attr = (name: string): number => {
      const am = attrs.match(new RegExp(`${name}="([^"]*)"`));
      return am ? parseFloat(am[1]) : 0;
    };
    const pad = 3;
    boxes.push({
      content: '(arrow shaft)',
      left: Math.min(attr('x1'), attr('x2')) - pad,
      right: Math.max(attr('x1'), attr('x2')) + pad,
      top: Math.min(attr('y1'), attr('y2')) - pad,
      bottom: Math.max(attr('y1'), attr('y2')) + pad,
    });
  }
  return boxes;
}

/** Run one fixture. Returns human-readable failure strings (empty = pass). */
export function runFixture(f: LabelFixture): string[] {
  const failures: string[] = [];
  let svg: string;
  try {
    svg = renderToStaticMarkup(f.element);
  } catch (err) {
    return [`${f.name}: render threw — ${(err as Error).message}`];
  }
  const boxes = parseTextBoxes(svg);
  const allowed = (a: string, b: string): boolean =>
    (f.allowOverlap ?? []).some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  if (f.checkArrows) {
    for (const arrow of parseArrowBoxes(svg)) {
      for (const b of boxes) {
        if (intersects(arrow, b)) {
          failures.push(`${f.name}: label "${b.content}" crosses an arrow shaft (${JSON.stringify(arrow)})`);
        }
      }
    }
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (intersects(boxes[i], boxes[j]) && !allowed(boxes[i].content, boxes[j].content)) {
        failures.push(`${f.name}: "${boxes[i].content}" overlaps "${boxes[j].content}"` +
          ` (${JSON.stringify(boxes[i])} vs ${JSON.stringify(boxes[j])})`);
      }
    }
  }
  for (const b of boxes) {
    if (b.left < -0.5 || b.right > f.viewbox.w + 0.5 || b.top < -0.5 || b.bottom > f.viewbox.h + 0.5) {
      failures.push(`${f.name}: "${b.content}" leaves the viewbox (${JSON.stringify(b)})`);
    }
  }
  return failures;
}
