/**
 * Label-collision regression for whiteboard renderers (live sessions
 * 2026-07-16/17):
 *
 *  - session-1784320013977: showFreeBodyDiagram with two opposed horizontal
 *    forces on a "You" person — force labels rendered inline with the arrow
 *    axis, truncated to 8 chars ("Wall pu…"), overlapping their own arrows
 *    and crowding the object caption.
 *  - session-1784182146307 / -1784194326500: number_line where the segment
 *    label ("diameter") and the point label ("diameter piece") share the
 *    same above-line row → "diameterdiameter piece" mush.
 *
 * The test renders the real components server-side with the sessions' actual
 * payload shapes, parses every <text> element out of the SVG, estimates
 * bboxes with the same char-width heuristic label-deoverlap uses, and
 * asserts (a) no two text bboxes intersect, (b) no text bbox crosses the
 * viewbox, (c) force names short enough to display are not ellipsis-mangled.
 *
 * Run: npx tsx scripts/test-renderer-label-collision.ts
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import FreeBodyDiagramRenderer from '../src/app/tutor/components/whiteboard/FreeBodyDiagramRenderer';
import { NumberLineRenderer } from '../src/app/tutor/components/whiteboard/NumberLineRenderer';

interface TextBox {
  content: string;
  left: number; right: number; top: number; bottom: number;
}

const CHAR_W = 0.55;
const LINE_H = 1.1;

/** Parse every <text> in an SVG string into an estimated bbox. */
function parseTextBoxes(svg: string): TextBox[] {
  const boxes: TextBox[] = [];
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) {
    const attrs = m[1];
    const content = m[2].replace(/<[^>]+>/g, '').trim();
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

/** Force-arrow shafts: <line> elements carrying a marker-end arrowhead. */
function parseArrowBoxes(svg: string): TextBox[] {
  const boxes: TextBox[] = [];
  // React emits <line ...></line>, not a self-closing tag.
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

let failures = 0;
function assertNoCollisions(
  name: string, svg: string, viewbox: { w: number; h: number },
  opts: { checkArrows?: boolean } = {},
) {
  const boxes = parseTextBoxes(svg);
  if (opts.checkArrows) {
    // A force label overlapping ANY arrow shaft (its own included) is the
    // session-1784320013977 failure mode — labels sat inline on the axis.
    for (const arrow of parseArrowBoxes(svg)) {
      for (const b of boxes) {
        if (intersects(arrow, b)) {
          failures++;
          console.error(`FAIL ${name}: label "${b.content}" crosses an arrow shaft (${JSON.stringify(arrow)})`);
        }
      }
    }
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (intersects(boxes[i], boxes[j])) {
        failures++;
        console.error(`FAIL ${name}: "${boxes[i].content}" overlaps "${boxes[j].content}"` +
          ` (${JSON.stringify(boxes[i])} vs ${JSON.stringify(boxes[j])})`);
      }
    }
  }
  for (const b of boxes) {
    if (b.left < 0 || b.right > viewbox.w || b.top < 0 || b.bottom > viewbox.h) {
      failures++;
      console.error(`FAIL ${name}: "${b.content}" leaves the viewbox (${JSON.stringify(b)})`);
    }
  }
  if (failures === 0) console.log(`  ok  ${name}: ${boxes.length} labels, no collisions`);
}

// ── Case 1: session-1784320013977 — opposed horizontal forces, person ──────
{
  const svg = renderToStaticMarkup(
    React.createElement(FreeBodyDiagramRenderer, {
      title: 'You push a wall... does it push back?',
      object: { label: 'You', shape: 'person' as const },
      surface: { type: 'none' as const },
      forces: [
        { name: 'Push on wall', magnitude: 'F', direction: 'right' as const },
        { name: 'Wall pushes back', magnitude: 'F', direction: 'left' as const },
      ],
    }),
  );
  assertNoCollisions('fbd-opposed-horizontal', svg, { w: 520, h: 380 }, { checkArrows: true });
  if (/…/.test(svg)) {
    failures++;
    console.error('FAIL fbd-opposed-horizontal: label ellipsis-truncated (e.g. "Wall pu…") — names this short must render whole');
  }
}

// ── Case 2: same FBD family — 4-force box on ground (regression guard) ─────
{
  const svg = renderToStaticMarkup(
    React.createElement(FreeBodyDiagramRenderer, {
      object: { shape: 'box' as const, mass: 'm = 5 kg' },
      surface: { type: 'horizontal' as const },
      forces: [
        { name: 'N', direction: 'up' as const },
        { name: 'W', magnitude: 'mg', direction: 'down' as const },
        { name: 'F_app', magnitude: '20 N', direction: 'right' as const },
        { name: 'f_k', magnitude: '8 N', direction: 'left' as const },
      ],
    }),
  );
  assertNoCollisions('fbd-four-forces-box', svg, { w: 520, h: 380 }, { checkArrows: true });
}

// ── Case 3: session-1784182146307 — segment label vs point label ───────────
{
  const svg = renderToStaticMarkup(
    React.createElement(NumberLineRenderer, {
      min: 0, max: 4, step: 1,
      points: [{ value: 1, label: 'diameter piece', color: '#3b82f6' }],
      segments: [
        { from: 0, to: 1, label: 'diameter', color: '#2563eb' },
        { from: 1, to: 4, label: 'wrap ≈ 3.14 diameters', color: '#92400e' },
      ],
    }),
  );
  assertNoCollisions('numberline-segment-vs-point', svg, { w: 500, h: 170 });
}

// ── Case 4: number line — interval + points clustered (regression guard) ───
{
  const svg = renderToStaticMarkup(
    React.createElement(NumberLineRenderer, {
      min: -2, max: 6, step: 1,
      intervals: [{ from: 0, to: 3, label: 'solution set', fromInclusive: true, toInclusive: false }],
      points: [
        { value: 0, label: 'start' },
        { value: 3, label: 'boundary', style: 'open' as const },
        { value: 1.5, label: 'midpoint' },
      ],
    }),
  );
  assertNoCollisions('numberline-interval-plus-points', svg, { w: 500, h: 170 });
}

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nOK — renderer label-collision invariants validated');
