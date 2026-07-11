/**
 * Unit suite for the SmoothDraw Phase-3 note slot engine (pure).
 * Run: npm run test:ink-placement
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md §5
 */
import { placeNote, rectsOverlap, type Rect } from '../src/lib/tutor/whiteboard/ink-placement';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const page: Rect = { x: 0, y: 0, w: 800, h: 600 };
const note = { w: 160, h: 40 };
const target: Rect = { x: 300, y: 200, w: 120, h: 60 };

// ── slot preference order ─────────────────────────────────────
{
  const p = placeNote({ target, occupied: [], page, note });
  check('empty page → right slot', p.slot === 'right');
  check('right slot sits beside the target', p.rect.x > target.x + target.w && Math.abs((p.rect.y + p.rect.h / 2) - (target.y + target.h / 2)) < note.h);
}
{
  // Block ONLY the right slot (y-band matches the target, so above/below stay clear).
  const blocker: Rect = { x: target.x + target.w + 2, y: target.y, w: 300, h: 60 };
  const p = placeNote({ target, occupied: [blocker], page, note });
  check('right blocked → above', p.slot === 'above');
  check('above sits over the target', p.rect.y + p.rect.h <= target.y);
}
{
  // Target flush against the right page edge → right can't fit → above.
  const edgeTarget: Rect = { x: page.w - 130, y: 200, w: 120, h: 60 };
  const p = placeNote({ target: edgeTarget, occupied: [], page, note });
  check('no room right of edge target → not right', p.slot !== 'right');
}

// ── never overlaps anything ───────────────────────────────────
{
  const occupied: Rect[] = [
    { x: 430, y: 180, w: 300, h: 100 },  // blocks right
    { x: 280, y: 130, w: 200, h: 60 },   // blocks above
    { x: 280, y: 270, w: 200, h: 60 },   // blocks below
    { x: 120, y: 180, w: 170, h: 100 },  // blocks left
  ];
  const p = placeNote({ target, occupied, page, note });
  check('all four slots blocked → margin', p.slot === 'margin');
  check('margin placement overlaps nothing', occupied.every((o) => !rectsOverlap(p.rect, o)) && !rectsOverlap(p.rect, target));
}
{
  const p = placeNote({ target, occupied: [], page, note });
  check('placement never overlaps its own target', !rectsOverlap(p.rect, target));
}

// ── page clamping ─────────────────────────────────────────────
{
  const topTarget: Rect = { x: 300, y: 4, w: 120, h: 30 };
  const blocker: Rect = { x: 430, y: 0, w: 370, h: 80 }; // blocks right
  const p = placeNote({ target: topTarget, occupied: [blocker], page, note });
  check('above cannot fit at page top → falls further down the order', p.slot !== 'above');
  check('placement stays inside the page', p.rect.x >= 0 && p.rect.y >= 0 && p.rect.x + p.rect.w <= page.w && p.rect.y + p.rect.h <= page.h);
}

// ── margin column stacks ──────────────────────────────────────
{
  const first = placeNote({ target: null, occupied: [], page, note });
  check('null target → margin', first.slot === 'margin');
  const second = placeNote({ target: null, occupied: [first.rect], page, note });
  check('second margin note stacks without overlap', second.slot === 'margin' && !rectsOverlap(first.rect, second.rect));
  check('margin notes share the right column', Math.abs(first.rect.x - second.rect.x) < 1);
}

// ── determinism ───────────────────────────────────────────────
{
  const a = placeNote({ target, occupied: [], page, note });
  const b = placeNote({ target, occupied: [], page, note });
  check('same input → identical placement', JSON.stringify(a) === JSON.stringify(b));
}

// ── margin column stays on-page for narrow hosts ──────────────
{
  const narrow: Rect = { x: 0, y: 0, w: 140, h: 400 };
  const p = placeNote({ target: null, occupied: [], page: narrow, note: { w: 160, h: 40 } });
  check('over-wide note on narrow page → margin x clamps to page edge', p.slot === 'margin' && p.rect.x >= 0);
}

// ── exhausted margin scan EXTENDS the page (never a fixed clamp) ──
{
  // Content fills the whole page: no in-page margin row is clear.
  const fullContent: Rect = { x: 0, y: 0, w: 800, h: 600 };
  const occupied: Rect[] = [fullContent];
  const first = placeNote({ target: null, occupied, page, note });
  check('full page → margin extension below the page bottom', first.slot === 'margin' && first.rect.y >= page.y + page.h);
  check('extension does not overlap the content', !rectsOverlap(first.rect, fullContent));
  occupied.push(first.rect);
  const second = placeNote({ target: null, occupied, page, note });
  check('second extension note does not overlap the first', second.slot === 'margin' && !rectsOverlap(first.rect, second.rect));
  check('extension y grows monotonically', second.rect.y > first.rect.y);
  occupied.push(second.rect);
  const third = placeNote({ target: null, occupied, page, note });
  check('third extension keeps growing', third.rect.y > second.rect.y && !rectsOverlap(third.rect, second.rect));
  check('extension notes keep the margin column x', Math.abs(first.rect.x - second.rect.x) < 1 && Math.abs(second.rect.x - third.rect.x) < 1);
}
{
  // Occupant OUTSIDE the margin column's x-band must not push the
  // extension down — only same-band occupants count.
  const fullContent: Rect = { x: 0, y: 0, w: 800, h: 600 };
  const farBelowLeft: Rect = { x: 0, y: 900, w: 100, h: 100 }; // left edge, outside the band
  const p = placeNote({ target: null, occupied: [fullContent, farBelowLeft], page, note });
  check('out-of-band occupant does not inflate the extension y', p.rect.y < 900);
}

// ── rectsOverlap sanity ───────────────────────────────────────
{
  check('overlap true', rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }));
  check('overlap false when apart', !rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 0, w: 10, h: 10 }));
  check('pad expands the test', rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 12, y: 0, w: 10, h: 10 }, 3));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
