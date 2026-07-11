/**
 * Unit suite for the SmoothDraw Phase-3 note slot engine (pure).
 * Run: npm run test:ink-placement
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md §5
 */
import { placeNote, rectsOverlap, type Rect } from '../src/lib/tutor/whiteboard/ink-placement';
import { arrowSpine } from '../src/lib/tutor/whiteboard/hand-stroke';

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

// ── SmoothDraw P4: arrow labels place beside their own waist ──────
// Regression for the self-collision defect: an arrow label's 24×24
// midpoint target sits INSIDE its own arrow's padded bbox, so with
// that bbox in `occupied` every near slot collided and the label
// ALWAYS fell to margin (proven on all diagonal seeds). The overlay
// now carves the OWN arrow's bbox out of the label's occupied set
// (ownerArrowKey); these cases mirror that assembly exactly.
{
  const labelNote = { w: 120, h: 30 };
  const pad6 = (spine: Array<{ x: number; y: number }>): Rect => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of spine) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    return { x: minX - 6, y: minY - 6, w: maxX - minX + 12, h: maxY - minY + 12 };
  };
  const midTarget = (spine: Array<{ x: number; y: number }>): Rect => {
    const mid = spine[Math.floor(spine.length / 2)];
    return { x: mid.x - 12, y: mid.y - 12, w: 24, h: 24 };
  };

  // Horizontal ~300px arrow between two endpoint cards.
  const hFrom: Rect = { x: 40, y: 250, w: 100, h: 60 };
  const hTo: Rect = { x: 440, y: 250, w: 100, h: 60 };
  const hSpine = arrowSpine(hFrom, hTo, 'endpoint-a->endpoint-b');
  check('horizontal arrow spine is non-empty', hSpine.length > 0);
  {
    // Own-arrow bbox EXCLUDED (the fix-1 carve) → label sits beside the waist.
    const p = placeNote({ target: midTarget(hSpine), occupied: [hFrom, hTo], page, note: labelNote });
    check('horizontal arrow label places beside the waist (not margin)', p.slot !== 'margin');
  }

  // 45° diagonal ~280px arrow — the empirically-margined class.
  const dFrom: Rect = { x: 40, y: 40, w: 100, h: 60 };
  const dTo: Rect = { x: 240, y: 240, w: 100, h: 60 };
  const dSpine = arrowSpine(dFrom, dTo, 'corner-a->corner-b');
  check('diagonal arrow spine is non-empty', dSpine.length > 0);
  {
    const p = placeNote({ target: midTarget(dSpine), occupied: [dFrom, dTo], page, note: labelNote });
    check('diagonal arrow label places beside the waist (not margin)', p.slot !== 'margin');
  }

  // A DIFFERENT note (not the arrow's label) keeps the arrow bbox in
  // occupied and must still dodge it.
  {
    const bbox = pad6(hSpine);
    const p = placeNote({ target: hFrom, occupied: [hTo, bbox], page, note: { w: 160, h: 40 } });
    check('other note with arrow bbox occupied still dodges the arrow', !rectsOverlap(p.rect, bbox));
  }
}

// ── rectsOverlap sanity ───────────────────────────────────────
{
  check('overlap true', rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }));
  check('overlap false when apart', !rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 0, w: 10, h: 10 }));
  check('pad expands the test', rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 12, y: 0, w: 10, h: 10 }, 3));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
