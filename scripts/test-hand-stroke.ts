/**
 * Unit suite for SmoothDraw Phase-2 hand-stroke geometry (pure, seeded).
 * Run: npm run test:hand-stroke
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md §4
 */
import { strokeOutline, tickSpine, highlightBand, arrowSpine, arrowHeads, type Pt, type Rect4 } from '../apps/marketing/src/lib/tutor/whiteboard/hand-stroke';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const spine: Pt[] = [{ x: 10, y: 50 }, { x: 40, y: 80 }, { x: 90, y: 20 }];

// ── determinism ───────────────────────────────────────────────
{
  const a = strokeOutline(spine, 8, 'point-3-0');
  const b = strokeOutline(spine, 8, 'point-3-0');
  const c = strokeOutline(spine, 8, 'point-neg3-0');
  check('same seed → identical path', a === b);
  check('different seed → different wobble', a !== c);
  check('no Math.random dependence (runs stable across calls)', strokeOutline(spine, 8, 'x') === strokeOutline(spine, 8, 'x'));
}

// ── path shape ────────────────────────────────────────────────
{
  const d = strokeOutline(spine, 8, 's');
  check('path is closed', /Z\s*$/.test(d));
  check('path starts with M', d.startsWith('M'));
  const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  check('outline has many points (resampled, not 3)', nums.length > 40);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  // Outline must stay within spine bbox inflated by baseWidth (wobble margin included).
  check('outline bounded by spine bbox + width', Math.min(...xs) >= 10 - 8 && Math.max(...xs) <= 90 + 8
    && Math.min(...ys) >= 20 - 8 && Math.max(...ys) <= 80 + 8);
}

// ── taper: ends thinner than middle ───────────────────────────
{
  // Straight horizontal spine: outline y-extent at the ends must be
  // smaller than at the midpoint (variable width with end taper).
  const flat: Pt[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
  const d = strokeOutline(flat, 10, 't');
  const pairs = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const pts: Pt[] = [];
  for (let i = 0; i + 1 < pairs.length; i += 2) pts.push({ x: pairs[i], y: pairs[i + 1] });
  const widthAt = (x0: number, x1: number) => {
    const ys = pts.filter((p) => p.x >= x0 && p.x <= x1).map((p) => p.y);
    return ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  };
  const endW = Math.max(widthAt(0, 12), widthAt(88, 100));
  const midW = widthAt(44, 56);
  check('mid width exceeds end width (taper)', midW > endW && midW > 0);
}

// ── degenerate spines never throw ─────────────────────────────
{
  check('single-point spine → empty path', strokeOutline([{ x: 5, y: 5 }], 8, 's') === '');
  check('empty spine → empty path', strokeOutline([], 8, 's') === '');
  const dup = strokeOutline([{ x: 5, y: 5 }, { x: 5, y: 5 }], 8, 's');
  check('zero-length spine → empty path', dup === '');
}

// ── tick spine geometry ───────────────────────────────────────
{
  const t = tickSpine(100, 50, 20);
  check('tick spine has 3 points', t.length === 3);
  check('tick cusp is below the wings', t[1].y > t[0].y && t[1].y > t[2].y);
  check('tick sweeps left to right', t[0].x < t[1].x && t[1].x < t[2].x);
  check('tick long arm rises above anchor', t[2].y < 50);
}

// ── highlight band ────────────────────────────────────────────
{
  const wide = highlightBand({ x: 0, y: 0, w: 200, h: 30 }, 'h');
  check('wide rect → band returned', wide !== null);
  if (wide) {
    check('band spine spans the rect width', Math.abs(wide.spine[0].x - 0) < 12 && Math.abs(wide.spine[wide.spine.length - 1].x - 200) < 12);
    check('band width ≤ rect height', wide.width <= 30);
    check('band deterministic', JSON.stringify(highlightBand({ x: 0, y: 0, w: 200, h: 30 }, 'h')) === JSON.stringify(wide));
  }
  const tall = highlightBand({ x: 0, y: 0, w: 40, h: 300 }, 'h');
  check('tall region → null (caller keeps rect fill)', tall === null);
}

// ── arrow spine ───────────────────────────────────────────────
{
  const a: Rect4 = { x: 0, y: 0, w: 100, h: 60 };
  const b: Rect4 = { x: 300, y: 200, w: 120, h: 80 };
  const s = arrowSpine(a, b, 'seed');
  check('spine has many samples (curved, resampleable)', s.length >= 8);
  const first = s[0];
  const last = s[s.length - 1];
  check('spine starts OUTSIDE the from-rect', first.x > 100 || first.y > 60);
  check('spine ends OUTSIDE the to-rect (before its edge)', last.x < 300 || last.y < 200);
  check('deterministic', JSON.stringify(arrowSpine(a, b, 'seed')) === JSON.stringify(s));
  check('different seed bows differently', JSON.stringify(arrowSpine(a, b, 'other')) !== JSON.stringify(s));
  // Bow: the midpoint deviates from the straight chord.
  const mid = s[Math.floor(s.length / 2)];
  const chordMidX = (first.x + last.x) / 2;
  const chordMidY = (first.y + last.y) / 2;
  const dev = Math.hypot(mid.x - chordMidX, mid.y - chordMidY);
  check('spine bows away from the chord', dev > 4);
  check('bow is bounded', dev <= 40 + 1);
}
{
  // Degenerate: overlapping rects → no spine.
  const a: Rect4 = { x: 0, y: 0, w: 100, h: 100 };
  const b: Rect4 = { x: 20, y: 20, w: 100, h: 100 };
  check('overlapping rects → empty spine', arrowSpine(a, b, 's').length === 0);
}
{
  // Elongated rects that overlap while both centers sit OUTSIDE each other
  // (reviewer repro) — must be empty, not a backwards spine.
  const a: Rect4 = { x: 0, y: 0, w: 500, h: 10 };
  const b: Rect4 = { x: 400, y: -5, w: 500, h: 20 };
  check('elongated overlapping rects → empty spine', arrowSpine(a, b, 'probe').length === 0);
}

// ── arrow heads ───────────────────────────────────────────────
{
  const spine = arrowSpine({ x: 0, y: 0, w: 50, h: 50 }, { x: 200, y: 0, w: 50, h: 50 }, 'h');
  const [b1, b2] = arrowHeads(spine, 12);
  check('two barbs, 2 pts each', b1.length === 2 && b2.length === 2);
  const tip = spine[spine.length - 1];
  check('barbs anchor at the tip', b1[0].x === tip.x && b1[0].y === tip.y && b2[0].x === tip.x && b2[0].y === tip.y);
  check('barbs point BACK from the tip (upstream x)', b1[1].x < tip.x && b2[1].x < tip.x);
  check('barbs straddle the shaft (opposite y sides)', (b1[1].y - tip.y) * (b2[1].y - tip.y) < 0);
  check('empty spine → no barbs', arrowHeads([], 12)[0].length === 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
