/**
 * Unit suite for SmoothDraw Phase-2 hand-stroke geometry (pure, seeded).
 * Run: npm run test:hand-stroke
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md §4
 */
import { strokeOutline, tickSpine, highlightBand, type Pt } from '../src/lib/tutor/whiteboard/hand-stroke';

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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
